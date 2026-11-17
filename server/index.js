import { eventBots } from './eventBots.js';
import { createMatchService } from './matchService.js';
import http from 'node:http';
import { promises as fs } from 'node:fs';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.woff2':'font/woff2', '.woff':'font/woff', '.png':'image/png', '.svg':'image/svg+xml' };

// One shared event per server instance. No third-party service, accounts or persistence.
// Tokens are secret: only opaque public IDs are broadcast to the room.
const rooms = new Map();
let activeRoom = null;
const token = () => randomBytes(16).toString('hex');
const MAX_PLAYERS = 24;
const EVENT_SECONDS = 65;
const COUNTDOWN_MS = 25000;
function json(res, code, data) { res.writeHead(code, {'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data)); }
function makeRoom() { const r={id:token(),startAt:Date.now()+COUNTDOWN_MS,players:new Map()};rooms.set(r.id,r);activeRoom=r;return r; }
function getRoomForJoin() {
  if(!activeRoom || Date.now() > activeRoom.startAt+EVENT_SECONDS*1000) return makeRoom();
  return activeRoom;
}
function publicState(room) { const now=Date.now();return {room:room.id,startAt:room.startAt,serverTime:now,duration:EVENT_SECONDS,players:[...room.players.values()].map(p=>({id:p.id,skin:p.skin,x:p.x,z:p.z,yaw:p.yaw,moving:p.moving,bot:false})),bots:eventBots(room.startAt,now)}; }
function broadcast(room) {const data=`data: ${JSON.stringify(publicState(room))}\n\n`;for(const p of room.players.values()) if(p.stream&&!p.stream.destroyed) p.stream.write(data);}
function removePlayer(room,p) { if(p.stream&&!p.stream.destroyed)p.stream.end();if(p.grace)clearTimeout(p.grace);room.players.delete(p.secret);broadcast(room);if(!room.players.size){rooms.delete(room.id);if(activeRoom===room)activeRoom=null;} }
function sameOrigin(req) {
  const origin=req.headers.origin;if(!origin)return true;
  // A browser's Fetch Metadata remains same-origin even when a hosting proxy rewrites Host.
  if(req.headers['sec-fetch-site']==='same-origin')return true;
  try { return new URL(origin).host===(req.headers['x-forwarded-host']||req.headers.host); } catch {return false;}
}
async function body(req) {let s='';for await(const chunk of req){s+=chunk;if(s.length>4096)throw new Error('Request too large');}return JSON.parse(s||'{}');}
async function eventApi(req,res,url) {
  if(!sameOrigin(req))return json(res,403,{error:'Cross-origin request denied'});
  if(req.method==='POST'&&url.pathname==='/api/event/join'){
    let data;try{data=await body(req)}catch{return json(res,400,{error:'Invalid request'});}
    const r=getRoomForJoin();if(r.players.size>=MAX_PLAYERS)return json(res,429,{error:'This event is full. Try again after it ends.'});
    const secret=token(),id=token().slice(0,10),index=r.players.size,skin=typeof data.skin==='string'&&/^[a-z0-9_-]{1,32}$/i.test(data.skin)?data.skin:'ranger';
    const angle=index*2.4, radius=2+Math.min(index,8)*.55;
    const p={secret,id,skin,x:Math.sin(angle)*radius,z:Math.cos(angle)*radius,yaw:Math.PI,moving:false,stream:null,lastSeen:Date.now()};r.players.set(secret,p);
    json(res,200,{room:r.id,token:secret,id,startAt:r.startAt,serverTime:Date.now(),duration:EVENT_SECONDS,x:p.x,z:p.z});broadcast(r);return;
  }
  if(req.method==='GET'&&url.pathname==='/api/event/stream'){
    const r=rooms.get(url.searchParams.get('room')),p=r?.players.get(url.searchParams.get('token'));if(!p)return json(res,404,{error:'Session expired'});
    if(p.grace)clearTimeout(p.grace);if(p.stream&&!p.stream.destroyed)p.stream.end();
    res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});res.write(': connected\n\n');p.stream=res;p.lastSeen=Date.now();broadcast(r);
    req.on('close',()=>{if(p.stream!==res)return;p.stream=null;p.grace=setTimeout(()=>{if(!p.stream&&r.players.has(p.secret))removePlayer(r,p)},12000);});return;
  }
  if(req.method==='POST'&&(url.pathname==='/api/event/move'||url.pathname==='/api/event/leave')){
    let data;try{data=await body(req)}catch{return json(res,400,{error:'Invalid request'});}
    const r=rooms.get(data.room),p=r?.players.get(data.token);if(!p)return json(res,404,{error:'Session expired'});
    if(url.pathname.endsWith('/leave')){removePlayer(r,p);return json(res,200,{ok:true});}
    const x=Number(data.x),z=Number(data.z),yaw=Number(data.yaw);if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(yaw))return json(res,400,{error:'Invalid position'});
    // The server bounds the event exploration area; movement itself is client-simulated.
    const len=Math.hypot(x,z),scale=len>130?130/len:1;p.x=x*scale;p.z=z*scale;p.yaw=Math.max(-100,Math.min(100,yaw));p.moving=!!data.moving;p.lastSeen=Date.now();return json(res,200,{ok:true});
  }
  return json(res,404,{error:'Unknown event endpoint'});
}
const pulse=setInterval(()=>{for(const r of rooms.values()){for(const p of r.players.values())if(!p.stream&&Date.now()-p.lastSeen>15000)removePlayer(r,p);if(r.players.size)broadcast(r);}},200);pulse.unref();

const matchApi=createMatchService({json,body,sameOrigin});

async function serve(req,res) {
  const url = new URL(req.url, 'http://local');
  if(url.pathname.startsWith('/api/event/'))return eventApi(req,res,url);
  if(url.pathname.startsWith('/api/match/'))return matchApi(req,res,url);
  if(url.pathname==='/healthz')return json(res,200,{ok:true});
  if (req.method !== 'GET' && req.method !== 'HEAD') {res.writeHead(405,{Allow:'GET, HEAD'});res.end('Method not allowed');return;}
  let decoded;try {decoded=decodeURIComponent(url.pathname)}catch{res.writeHead(400);res.end('Bad path');return;}
  const target=path.resolve(dist,'.'+(decoded==='/'?'/index.html':decoded));
  if(!target.startsWith(dist+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
  try {const file=await fs.readFile(target),ext=path.extname(target);res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':ext==='.html'?'no-cache':'public, max-age=3600'});res.end(req.method==='HEAD'?undefined:file);}
  catch(e){if(e.code!=='ENOENT'&&e.code!=='EISDIR')console.error(e);res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Not found. Run npm run build first.');}
}
http.createServer((req,res)=>serve(req,res).catch(err=>{console.error(err);if(!res.headersSent)res.writeHead(500);res.end('Server error');})).listen(port,host,()=>console.log(`Skydrop Royale listening on ${host}:${port}`));
