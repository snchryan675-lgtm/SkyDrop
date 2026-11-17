import * as THREE from 'three';

// Terrain is cloned; detailed scenery uses the gameplay engine’s own models.
export function makeEventIslands(data, scene){
 const SCALE=1, oldRoot=new THREE.Group(), newRoot=new THREE.Group(), ownedTextures=[];
 oldRoot.scale.setScalar(SCALE);newRoot.scale.setScalar(SCALE);scene.add(oldRoot,newRoot);
 const oldGeo=data.geometry.clone(),newGeo=data.geometry.clone();
 // The BR terrain includes a square seabed. Strip triangles deep underwater so
 // the cinematic island has a coastline rather than a floating square of sea.
 const clipSea=geo=>{const idx=geo.index,points=geo.attributes.position,kept=[];if(!idx)return;for(let i=0;i<idx.count;i+=3){const a=idx.getX(i),b=idx.getX(i+1),c=idx.getX(i+2);if(Math.max(points.getY(a),points.getY(b),points.getY(c))>=-1.5)kept.push(a,b,c);}geo.setIndex(kept);};clipSea(oldGeo);clipSea(newGeo);
 const tex=data.texture.clone();tex.needsUpdate=true;ownedTextures.push(tex);
 const oldMat=new THREE.MeshStandardMaterial({map:tex,roughness:1,side:THREE.DoubleSide});
 const newMat=new THREE.MeshStandardMaterial({map:tex,roughness:1,side:THREE.DoubleSide});
 oldRoot.add(new THREE.Mesh(oldGeo,oldMat));newRoot.add(new THREE.Mesh(newGeo,newMat));
 const undersideGeo=new THREE.ConeGeometry(295,145,32),undersideMat=new THREE.MeshStandardMaterial({color:0x544e52,roughness:1,side:THREE.DoubleSide});
 for(const root of [oldRoot,newRoot]){const m=new THREE.Mesh(undersideGeo.clone(),undersideMat.clone());m.position.y=-74;m.rotation.z=Math.PI;root.add(m);}undersideGeo.dispose();undersideMat.dispose();
 // Full-resolution procedural buildings, props and trees from the game engine.
 oldRoot.add(data.scenery.old);newRoot.add(data.scenery.current);newRoot.visible=false;
 // Broken fragments and lightning form a physical silhouette as the old world fails.
 const debris=new THREE.Group();scene.add(debris);const fragments=[];
 for(let i=0;i<18;i++){const a=i*2.399,r=195+(i%4)*30,m=new THREE.Mesh(new THREE.IcosahedronGeometry(10+(i%3)*4,0),new THREE.MeshStandardMaterial({color:i%3?0x6e716a:0x9a805f,roughness:1}));m.position.set(Math.cos(a)*r,-3,Math.sin(a)*r);m.userData={a,r,i};debris.add(m);fragments.push(m);}debris.visible=false;
 const cracks=new THREE.Group();oldRoot.add(cracks);const crackMat=new THREE.MeshBasicMaterial({color:0x88eaff,transparent:true,opacity:.8});for(let i=0;i<8;i++){const mesh=new THREE.Mesh(new THREE.BoxGeometry(300,1.4,1.7),crackMat);mesh.rotation.y=i*Math.PI/4;mesh.position.y=data.height(0,0)+2+i*.3;cracks.add(mesh);}cracks.visible=false;
 function update(elapsed){const clamp=n=>Math.max(0,Math.min(1,n)),q=clamp((elapsed-7)/12),turn=clamp((elapsed-26)/20);cracks.visible=elapsed>=4&&elapsed<31;debris.visible=elapsed>=8&&elapsed<53;for(const m of fragments){const {a,r,i}=m.userData;m.position.set(Math.cos(a)*(r+q*120),q*(i%4*20-20),Math.sin(a)*(r+q*120));m.rotation.set(q*i*.31,q*i*.19,q*i*.13);}oldRoot.visible=elapsed<34;oldRoot.rotation.z=clamp((elapsed-18)/16)*.55;newRoot.visible=elapsed>=25;newRoot.rotation.z=(1-turn)*Math.PI;}
 return {oldRoot,newRoot,update,ground:(x,z)=>data.height(x/SCALE,z/SCALE)*SCALE,dispose:()=>ownedTextures.forEach(t=>t.dispose())};
}
