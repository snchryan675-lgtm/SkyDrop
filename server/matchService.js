import { randomBytes } from 'node:crypto';

// Private, ephemeral playtest rooms. Clients simulate movement/combat; this is
// deliberately not an authoritative production battle-royale server.
export function createMatchService({json,body,sameOrigin}) {
 const rooms=new Map(), secret=()=>randomBytes(16).toString('hex');
 const code=()=>randomBytes(4).toString('hex').slice(0,6).toUpperCase();
 const finite=(x,min,max)=>Number.isFinite(Number(x))?Math.max(min,Math.min(max,Number(x))):0;
 const safeName=s=>typeof s==='string'?s.trim().replace(/[^a-zA-Z0-9 _-]/g,'').slice(0,16)||'Player':'Player';
 function state(r){return {code:r.code,host:r.host,startAt:r.startAt,serverTime:Date.now(),seed:r.seed,players:[...r.players.values()].map(p=>({id:p.id,name:p.name,skin:p.skin,...p.state})),events:r.events};}
 function broadcast(r){const data=`data: ${JSON.stringify(state(r))}\n\n`;for(const p of r.players.values())if(p.stream&&!p.stream.destroyed)p.stream.write(data);}
 function remove(r,p){if(!r.players.has(p.secret))return;r.players.delete(p.secret);if(p.stream&&!p.stream.destroyed)p.stream.end();clearTimeout(p.grace);if(!r.players.size)rooms.delete(r.code);else{if(r.host===p.id)r.host=r.players.values().next().value.id;broadcast(r);}}
 function auth(d){const r=rooms.get(String(d.code||'').toUpperCase());return [r,r?.players.get(d.token)];}
 async function api(req,res,url){
  if(!sameOrigin(req))return json(res,403,{error:'Cross-origin request denied'});
  if(req.method==='POST'&&url.pathname==='/api/match/join'){
   let d;try{d=await body(req)}catch{return json(res,400,{error:'Invalid request'});}
   let r;if(!d.code){let c;do{c=code()}while(rooms.has(c));r={code:c,players:new Map(),host:null,startAt:0,seed:Math.random(),seq:0,events:[]};rooms.set(c,r);}else r=rooms.get(String(d.code).trim().toUpperCase());
   if(!r)return json(res,404,{error:'Room not found. Check the code.'});if(r.startAt)return json(res,409,{error:'This room already started. Create a new room.'});if(r.players.size>=8)return json(res,429,{error:'Room is full (8 players maximum).'});
   const p={secret:secret(),id:secret().slice(0,10),name:safeName(d.name),skin:typeof d.skin==='string'&&/^[a-z0-9_-]{1,32}$/i.test(d.skin)?d.skin:'ranger',stream:null,lastSeen:Date.now(),state:{x:0,y:0,z:0,yaw:0,pitch:0,mode:'bus',alive:true,crouch:false,speed:0}};r.players.set(p.secret,p);if(!r.host)r.host=p.id;json(res,200,{code:r.code,token:p.secret,id:p.id});broadcast(r);return;
  }
  if(req.method==='GET'&&url.pathname==='/api/match/stream'){
   const [r,p]=auth({code:url.searchParams.get('code'),token:url.searchParams.get('token')});if(!p)return json(res,404,{error:'Room expired'});clearTimeout(p.grace);if(p.stream&&!p.stream.destroyed)p.stream.end();res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});res.write(': connected\n\n');p.stream=res;p.lastSeen=Date.now();broadcast(r);req.on('close',()=>{if(p.stream!==res)return;p.stream=null;p.grace=setTimeout(()=>{if(!p.stream)remove(r,p)},15000)});return;
  }
  if(req.method==='POST'){
   let d;try{d=await body(req)}catch{return json(res,400,{error:'Invalid request'});}const [r,p]=auth(d);if(!p)return json(res,404,{error:'Room expired'});p.lastSeen=Date.now();
   if(url.pathname==='/api/match/leave'){remove(r,p);return json(res,200,{ok:true});}
   if(url.pathname==='/api/match/start'){if(p.id!==r.host)return json(res,403,{error:'Only the host can start'});if(r.players.size<2)return json(res,400,{error:'At least two players are required'});if(!r.startAt){r.startAt=Date.now()+8000;broadcast(r);}return json(res,200,{ok:true});}
   if(url.pathname==='/api/match/state'){
    if(r.startAt&&Date.now()>=r.startAt){const s=d.state||{};p.state={x:finite(s.x,-400,400),y:finite(s.y,-30,300),z:finite(s.z,-400,400),yaw:finite(s.yaw,-100,100),pitch:finite(s.pitch,-2,2),mode:['bus','ground','glide','skydive','dead'].includes(s.mode)?s.mode:'ground',alive:s.alive!==false,crouch:!!s.crouch,speed:finite(s.speed,0,40),weapon:typeof s.weapon==='string'&&/^[a-z0-9_-]{1,24}$/i.test(s.weapon)?s.weapon:'pickaxe'};}return json(res,200,{ok:true});
   }
   if(url.pathname==='/api/match/action'){
    if(!r.startAt||Date.now()<r.startAt)return json(res,409,{error:'Match not started'});
    const now=Date.now();if(!p.rateAt||now-p.rateAt>1000){p.rateAt=now;p.rate=0;}if(++p.rate>60)return json(res,429,{error:'Action rate exceeded'});
    let event=null;
    if(d.type==='chat'&&typeof d.text==='string'){const text=d.text.trim().slice(0,120);if(text)event={type:'chat',text};}
    if(d.type==='hit'&&typeof d.target==='string'&&[...r.players.values()].some(v=>v.id===d.target&&v!==p)) event={type:'hit',target:d.target,damage:finite(d.damage,1,200),weapon:safeName(d.weapon)};
    if(['build','edit','destroy'].includes(d.type)&&d.spec&&typeof d.spec==='object'){
     const v=d.spec,shapes=['wall','wallGrid','wallTriL','wallTriR','wallDoor','wallWin','half','floor','floorHalf','stairs','pyr','roof','pad'],materials=['wood','stone','metal'];
     if(shapes.includes(v.shape)&&materials.includes(v.mat)&&[v.gx,v.gy,v.gz,v.rot].every(Number.isFinite)&&Math.abs(v.gx)<=80&&Math.abs(v.gz)<=80&&v.gy>=-10&&v.gy<=75)event={type:d.type,spec:{shape:v.shape,gx:v.gx,gy:v.gy,gz:v.gz,rot:Math.round(v.rot)%4,mask:Math.round(finite(v.mask,0,511)),mat:v.mat},oldKey:typeof d.oldKey==='string'?d.oldKey.slice(0,80):''};
    }
    if(!event)return json(res,400,{error:'Invalid action'});r.events.push({...event,from:p.id,seq:++r.seq});if(r.events.length>160)r.events.splice(0,r.events.length-160);broadcast(r);return json(res,200,{ok:true});
   }
  }
  return json(res,404,{error:'Unknown match endpoint'});
 }
 const pulse=setInterval(()=>{for(const r of rooms.values()){for(const p of r.players.values())if(!p.stream&&Date.now()-p.lastSeen>20000)remove(r,p);if(r.players.size)broadcast(r);}},250);pulse.unref();
 return api;
}
