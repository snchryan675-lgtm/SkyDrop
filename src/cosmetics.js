import * as THREE from 'three';

const COLORS={axe:0x94b864,hammer:0x7796c0,scythe:0xb473ff,frost:0xa7ecff};
function material(color,metalness=.55){return new THREE.MeshStandardMaterial({color,metalness,roughness:.32});}
function part(group,geometry,mat,x,y,z,rz=0){const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.rotation.z=rz;group.add(m);return m;}
export function makePickaxe(id){
 const root=new THREE.Group();root.userData.cosmeticId=id;const col=COLORS[id]??0x899daf,shaft=material(0x343b48),accent=material(col),edge=material(id==='frost'?0xdafaff:0xd6e5ef,.8);
 part(root,new THREE.CylinderGeometry(.027,.033,.95,8),shaft,0,.15,0);part(root,new THREE.CylinderGeometry(.043,.043,.18,8),accent,0,-.23,0);
 if(id==='hammer'){part(root,new THREE.BoxGeometry(.42,.22,.2),accent,0,.64,0);part(root,new THREE.BoxGeometry(.08,.24,.22),edge,-.21,.64,0);part(root,new THREE.BoxGeometry(.08,.24,.22),edge,.21,.64,0);}
 else if(id==='scythe'){part(root,new THREE.CylinderGeometry(.024,.024,.28,8),edge,0,.7,0);const blade=part(root,new THREE.TorusGeometry(.28,.05,6,18,Math.PI*.82),accent,.25,.75,0,-.2);blade.rotation.x=.15;}
 else if(id==='frost'){const blade=part(root,new THREE.ConeGeometry(.13,.62,4),accent,0,.82,0,0);blade.rotation.y=Math.PI/4;part(root,new THREE.BoxGeometry(.37,.065,.09),edge,0,.58,0);}
 else {part(root,new THREE.BoxGeometry(.16,.17,.16),accent,0,.61,0);const b=part(root,new THREE.BoxGeometry(.35,.22,.065),edge,.22,.62,0,-.25);b.rotation.y=.15;}
 return root;
}
const GLIDER_COLORS={sky:0x168be1,cloud:0xe7f6ff,dragon:0xd83d2e,phoenix:0xff8515};
export function makeGlider(id){
 const root=new THREE.Group();root.userData.cosmeticId=id;const main=material(GLIDER_COLORS[id]??0x4e9ccc,.2),dark=material(0x27384d),trim=material(id==='phoenix'?0xffd05d:0xb8e8fa,.5);
 const shape=id==='dragon'||id==='phoenix';
 for(const side of [-1,1]){
   const wing=part(root,new THREE.BoxGeometry(shape?1.72:1.9,.11,shape?.72:1.15),main,side*.92,1.24,0,side*(shape?.12:0));wing.rotation.y=side*(shape?.22:0);
   part(root,new THREE.CylinderGeometry(.018,.018,1.25,6),dark,side*.32,.58,0,side*.35);
   if(shape)for(let k=0;k<3;k++){const feather=part(root,new THREE.ConeGeometry(.2,.6,4),trim,side*(.7+k*.35),1.22,.48);feather.rotation.x=Math.PI/2;}
 }
 part(root,new THREE.BoxGeometry(.4,.2,.8),dark,0,1.2,0);part(root,new THREE.CylinderGeometry(.03,.03,.65,8),dark,0,.25,0);
 if(id==='cloud')for(let k=-2;k<=2;k++)part(root,new THREE.SphereGeometry(.22,8,6),trim,k*.5,1.39,0);
 if(shape){const crest=part(root,new THREE.ConeGeometry(.21,.55,6),trim,0,1.38,-.52);crest.rotation.x=-Math.PI/2;}
 return root;
}
const WRAP_COLORS={camo:0x6b9852,gold:0xffd43b,neon:0x34dfff,galaxy:0xb279ff};
export function applyWeaponWrap(root,id){
 root.userData.wrapId=id;if(id==='default'||!WRAP_COLORS[id])return root;
 root.traverse(o=>{if(!o.isMesh||!o.material)return;const clone=m=>{const n=m.clone();if(n.color)n.color.setHex(WRAP_COLORS[id]);if('emissive' in n&&id==='neon')n.emissive.setHex(0x034252);return n;};o.material=Array.isArray(o.material)?o.material.map(clone):clone(o.material);});return root;
}
