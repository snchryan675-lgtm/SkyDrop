// Event bots are scripted ambient participants, not real players. Computing their
// paths from the shared event clock keeps their positions deterministic per room.
export const EVENT_BOT_COUNT=8;
const outfits=['ranger','islandscout','frost','webhero','valor','aurora','foundation','starlight'];
export function eventBots(startAt,now){
 const t=(now-startAt)/1000;
 return Array.from({length:EVENT_BOT_COUNT},(_,i)=>{
   const a=i*Math.PI*2/EVENT_BOT_COUNT+t*(.12+i*.004),radius=8+(i%4)*3;
   return {id:`bot-${i+1}`,skin:outfits[i],x:Math.cos(a)*radius,z:Math.sin(a)*radius,yaw:-a,moving:true,bot:true};
 });
}
