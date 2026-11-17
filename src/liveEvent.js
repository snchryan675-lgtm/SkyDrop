import * as THREE from 'three';
import { makeEventIslands } from './eventIsland.js';
import { eventBots } from '../server/eventBots.js';

// Synchronized cinematic journey using the game island terrain.
export function openLiveEvent({Character, skins, animationDefaults, selectedSkin, islandData, performanceMode=false, onClose}) {
  const overlay=document.createElement('section');overlay.className='live-event';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Multiplayer island flip event');
  overlay.innerHTML=`<canvas class="live-event-canvas"></canvas><div class="live-event-shade"></div><header class="live-event-header"><div><span class="live-kicker">MULTIPLAYER EVENT • CHAPTER 4</span><h1>THE ISLAND FLIP</h1><p class="live-status" role="status">Connecting to the event server…</p></div><button class="live-close">LEAVE EVENT</button></header><div class="live-bottom"><b class="live-players">CONNECTING</b><span>WASD / ARROWS MOVE &nbsp; • &nbsp; SHIFT SPRINT &nbsp; • &nbsp; ESC LEAVE</span></div><div class="live-message" aria-live="polite"></div>`;
  document.getElementById('ui').appendChild(overlay);
  let closed=false,room=null,stream=null,renderer=null,raf=0,sendTimer=0,last=performance.now(),offset=0,snapshot=null,inflight=false,connection='connecting',connectTimer=0,reconnectTimer=0,joinController=new AbortController(),lastOfflineSync=0,movement={x:0,z:0,yaw:Math.PI,moving:false};
  const remotes=new Map(),keys=new Set(),characters=[];let localChar=null,localSkin=null;
  const status=overlay.querySelector('.live-status'),counter=overlay.querySelector('.live-players'),message=overlay.querySelector('.live-message');
  const post=(url,data,keepalive=false)=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),keepalive});
  function close(){if(closed)return;closed=true;cancelAnimationFrame(raf);clearInterval(sendTimer);clearTimeout(connectTimer);clearTimeout(reconnectTimer);joinController.abort();stream?.close();if(room?.token)post('/api/event/leave',{room:room.room,token:room.token},true).catch(()=>{});window.removeEventListener('resize',resize);window.removeEventListener('keydown',keyDown,true);window.removeEventListener('keyup',keyUp,true);window.removeEventListener('blur',blur);window.removeEventListener('pagehide',pageHide);for(const c of characters){c.root.traverse(o=>{if(o.isSprite){o.material.map?.dispose();o.material.dispose();}});c.dispose();}if(renderer){scene.traverse(o=>{if(o.isMesh){if(o.userData.eventShared){if(o.isInstancedMesh)o.dispose();}else{o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose();}}if(o.isSprite){o.material.map?.dispose();o.material.dispose();}});islands.dispose();renderer.dispose();renderer.forceContextLoss();}overlay.remove();onClose?.();}
  function pageHide(){if(room?.token)navigator.sendBeacon('/api/event/leave',new Blob([JSON.stringify({room:room.room,token:room.token})],{type:'application/json'}));}
  function keyDown(e){if(e.code==='Escape'){e.preventDefault();e.stopPropagation();close();return;}if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();e.stopPropagation();keys.add(e.code);}}
  function keyUp(e){keys.delete(e.code);if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight'].includes(e.code)){e.preventDefault();e.stopPropagation();}}
  function blur(){keys.clear();}
  overlay.querySelector('.live-close').onclick=close;window.addEventListener('keydown',keyDown,true);window.addEventListener('keyup',keyUp,true);window.addEventListener('blur',blur);window.addEventListener('pagehide',pageHide);
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x304d7b);scene.fog=new THREE.FogExp2(0x263b5c,.00035);
  const camera=new THREE.PerspectiveCamera(60,1,.1,3500);
  function resize(){if(!renderer)return;const w=overlay.clientWidth,h=overlay.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
  const mat=(color,more={})=>new THREE.MeshStandardMaterial({color,roughness:.85,...more});
  const box=(parent,w,h,d,color,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));m.position.set(x,y,z);parent.add(m);return m;};
  const glow=(color)=>new THREE.MeshBasicMaterial({color,transparent:true,opacity:.8,depthWrite:false});
  scene.add(new THREE.HemisphereLight(0xaddfff,0x322d42,2.0));const sun=new THREE.DirectionalLight(0xffdfac,2.8);sun.position.set(-16,35,15);scene.add(sun);const fill=new THREE.DirectionalLight(0x94c8ff,1.4);fill.position.set(0,0,35);scene.add(fill);
  // 3D terrain cloned from the actual game island; the old season's POIs are
  // reconstructed because its original terrain wasn't retained in this build.
  const islands=makeEventIslands(islandData,scene);
  const starsGeo=new THREE.BufferGeometry(),starPos=[];for(let i=0;i<260;i++){const a=i*2.399,r=900+(i%23)*12;starPos.push(Math.cos(a)*r,150+(i*17)%500,Math.sin(a)*r);}starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPos,3));scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0xc3e9ff,size:.35})));
  const rift=new THREE.Mesh(new THREE.IcosahedronGeometry(12,1),new THREE.MeshBasicMaterial({color:0x8ae8ff,transparent:true,opacity:.85}));rift.position.set(0,140,-40);scene.add(rift);
  const riftLight=new THREE.PointLight(0x5bcbff,50,180);riftLight.position.copy(rift.position);scene.add(riftLight);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(35,.3,6,90),glow(0xb3edff));ring.position.copy(rift.position);scene.add(ring);
  // Names are short server-generated IDs, never unsanitized HTML.
  function label(text){const cv=document.createElement('canvas');cv.width=256;cv.height=64;const c=cv.getContext('2d');c.font='bold 27px sans-serif';c.textAlign='center';c.fillStyle='rgba(4,22,46,.8)';c.fillRect(10,8,236,48);c.fillStyle='#dff8ff';c.fillText(text,128,41);const texture=new THREE.CanvasTexture(cv),sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false}));sprite.position.y=2.4;sprite.scale.set(1.8,.48,1);return sprite;}
  function character(id,skin,own=false,bot=false){const def=skins.find(s=>s.id===skin)||skins[0],c=new Character(def);characters.push(c);scene.add(c.root);if(!own)c.root.add(label(bot?`BOT ${id.split('-').pop()}`:`PLAYER ${id.slice(0,4).toUpperCase()}`));return c;}
  function syncPlayers(state){
    snapshot=state;offset=state.serverTime-Date.now();
    const humans=state.players||[],bots=state.bots||[],all=[...humans,...bots];
    counter.textContent=connection==='offline'?`${bots.length} BOTS • OFFLINE`:`${humans.length} REAL ${humans.length===1?'PLAYER':'PLAYERS'} • ${bots.length} BOTS`;
    const ids=new Set(all.map(p=>p.id));for(const [id,entry] of remotes)if(!ids.has(id)){entry.char.root.traverse(o=>{if(o.isSprite){o.material.map?.dispose();o.material.dispose();}});entry.char.dispose();const index=characters.indexOf(entry.char);if(index>=0)characters.splice(index,1);remotes.delete(id);}
    for(const p of all){if(p.id===room.id)continue;let e=remotes.get(p.id);if(!e){e={char:character(p.id,p.skin,false,!!p.bot),x:p.x,z:p.z,yaw:p.yaw,moving:p.moving};e.char.root.position.set(p.x,islands.ground(p.x,p.z),p.z);remotes.set(p.id,e);}Object.assign(e,{x:p.x,z:p.z,yaw:p.yaw,moving:p.moving});}
    overlay.dataset.remotePlayers=String(humans.filter(p=>p.id!==room.id).length);overlay.dataset.bots=String(bots.length);overlay.dataset.connection=connection;overlay.dataset.remotePositions=JSON.stringify(humans.filter(p=>p.id!==room.id).map(({id,x,z})=>({id,x,z})));
  }
  function startOffline(reason){
    if(closed||connection==='offline')return;
    clearTimeout(connectTimer);clearTimeout(reconnectTimer);clearInterval(sendTimer);stream?.close();
    if(room?.token)post('/api/event/leave',{room:room.room,token:room.token},true).catch(()=>{});
    connection='offline';overlay.querySelector('.live-kicker').textContent='OFFLINE EVENT • BOTS ONLY';offset=0;room={id:'local',startAt:Date.now()+25000};
    if(!localChar)localChar=character('local',selectedSkin,true);
    overlay.dataset.connection='offline';overlay.dataset.offlineReason=reason;
  }
  function frame(now){if(closed)return;raf=requestAnimationFrame(frame);const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;
    const elapsed=room?(Date.now()+offset-room.startAt)/1000:-25;
    if(connection==='offline'&&now-lastOfflineSync>200){lastOfflineSync=now;syncPlayers({players:[{id:'local'}],bots:eventBots(room.startAt,Date.now()),serverTime:Date.now()});}
    overlay.dataset.phase=!room?'connecting':elapsed<0?'waiting':elapsed>=62?'landed':elapsed>=42?'pull':elapsed>=26?'flip':elapsed>=6?'fly':'fracture';
    const ease=(v)=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
    const fly=ease((elapsed-6)/14),pull=ease((elapsed-42)/20),air=fly*(1-pull),landed=elapsed<6||elapsed>=62;
    let x=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),z=(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0);const len=Math.hypot(x,z);
    if(len&&landed){x/=len;z/=len;const speed=keys.has('ShiftLeft')||keys.has('ShiftRight')?7:4;movement.x+=x*speed*dt;movement.z+=z*speed*dt;const r=Math.hypot(movement.x,movement.z);if(r>130){movement.x*=130/r;movement.z*=130/r;}movement.yaw=Math.atan2(x,z);movement.moving=true;}else movement.moving=false;
    const actorPos=(x,z)=>new THREE.Vector3(x,islands.ground(x,z)+air*350,z+air*650);
    if(localChar){localChar.root.position.copy(actorPos(movement.x,movement.z));localChar.root.rotation.y=movement.yaw;localChar.update(dt,{...animationDefaults,mode:air>.1?'skydive':'ground',grounded:air<.1,vy:air>.1?-2:0,speed:movement.moving?4:0,moveAngle:0});}
    for(const e of remotes.values()){e.char.root.position.lerp(actorPos(e.x,e.z),1-Math.exp(-dt*10));e.char.root.rotation.y=e.yaw;e.char.update(dt,{...animationDefaults,mode:air>.1?'skydive':'ground',grounded:air<.1,vy:air>.1?-2:0,speed:e.moving?4:0,moveAngle:0});}
    const pos=actorPos(movement.x,movement.z), camNear=new THREE.Vector3(pos.x,pos.y+4.2,pos.z+9),camFar=new THREE.Vector3(pos.x*.3,pos.y+7,pos.z+14),blend=ease(air*2);
    camera.position.copy(camNear.lerp(camFar,blend));const nearTarget=new THREE.Vector3(pos.x,pos.y+1.4,pos.z-12),farTarget=new THREE.Vector3(0,0,0);camera.lookAt(nearTarget.lerp(farTarget,blend));
    if(connection==='connecting'){status.textContent='CONNECTING TO MULTIPLAYER…';message.textContent='If the server cannot be reached, the event will start offline with bots.';}
    else if(connection==='reconnecting'){status.textContent='CONNECTION INTERRUPTED • RECONNECTING';message.textContent='Reconnecting to the event server; offline mode starts if it cannot be reached.';}
    else if(elapsed<0){status.textContent=`EVENT STARTS IN ${Math.ceil(-elapsed)}s${connection==='offline'?'':' • WAITING FOR PLAYERS'}`;message.textContent=connection==='offline'?'Offline with bots • Run npm start for real multiplayer':'Explore the old island with players and bots';}
    else if(elapsed<6){status.textContent='THE OLD ISLAND IS FRACTURING';message.textContent='The rift is breaking the island apart!';}
    else if(elapsed<26){status.textContent='PULLED INTO THE SKY';message.textContent='You and the other players are flying away from the old island';}
    else if(elapsed<42){status.textContent='THE ISLAND IS FLIPPING';message.textContent='A new island turns through the rift';}
    else if(elapsed<62){status.textContent='PULLED TOWARD CHAPTER 4';message.textContent='The new island is pulling you back';}
    else if(elapsed<65){status.textContent='CHAPTER 4 • A NEW ISLAND';message.textContent='Welcome to the new island';}
    else {status.textContent='EVENT COMPLETE';message.textContent='Leave and rejoin to replay with other players';}
    if(connection==='offline'&&room)status.textContent=`OFFLINE • ${status.textContent}`;
    islands.update(elapsed);rift.rotation.y+=dt*.7;rift.rotation.z+=dt*.3;rift.scale.setScalar(1+Math.sin(now*.003)*.2+(elapsed>0&&elapsed<42?1.2:0));ring.rotation.z+=dt*.25;
    overlay.dataset.playerAltitude=pos.y.toFixed(2);overlay.dataset.playerDistance=pos.z.toFixed(2);
    if(!window.__SKYDROP_NO_EVENT_RENDER)renderer.render(scene,camera);
  }
  try{renderer=new THREE.WebGLRenderer({canvas:overlay.querySelector('canvas'),antialias:!performanceMode,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,performanceMode ? .7 : 1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;window.addEventListener('resize',resize);resize();raf=requestAnimationFrame(frame);}catch(err){status.textContent='3D rendering unavailable in this browser.';message.textContent='Enable WebGL and try again.';return overlay;}
  // Time out both the initial request and the first event-stream snapshot.
  connectTimer=setTimeout(()=>{joinController.abort();startOffline('Server connection timed out');},7000);
  fetch('/api/event/join',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({skin:selectedSkin}),signal:joinController.signal}).then(async response=>{
    if(!response.ok){let d=await response.json().catch(()=>({}));throw new Error(d.error||`Server returned ${response.status}`);}return response.json();
  }).then(data=>{
    if(closed||connection==='offline'){post('/api/event/leave',{room:data.room,token:data.token},true).catch(()=>{});return;}
    room=data;offset=data.serverTime-Date.now();movement.x=data.x;movement.z=data.z;localSkin=selectedSkin;localChar=character(data.id,localSkin,true);
    stream=new EventSource(`/api/event/stream?room=${encodeURIComponent(data.room)}&token=${encodeURIComponent(data.token)}`);
    stream.onmessage=e=>{try{if(closed||connection==='offline')return;const state=JSON.parse(e.data);clearTimeout(connectTimer);clearTimeout(reconnectTimer);reconnectTimer=0;connection='online';overlay.querySelector('.live-kicker').textContent='MULTIPLAYER EVENT • CHAPTER 4';syncPlayers(state);}catch(err){console.error('Event update error',err);}};
    stream.onerror=()=>{if(closed||connection==='offline')return;connection='reconnecting';overlay.dataset.connection=connection;counter.textContent='RECONNECTING';if(!reconnectTimer)reconnectTimer=setTimeout(()=>startOffline('Event stream disconnected'),8000);};
    sendTimer=setInterval(()=>{if(closed||!room?.token||inflight)return;inflight=true;post('/api/event/move',{room:room.room,token:room.token,...movement}).then(r=>{if(r.status===404&&!closed)startOffline('Event session expired');}).catch(()=>{}).finally(()=>{inflight=false;});},140);
  }).catch(err=>{if(!closed&&connection!=='offline')startOffline(err.message||'Server unavailable');});
  return overlay;
}
