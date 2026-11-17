import { Shape, ExtrudeGeometry } from 'three';
import {
  GeoBuilder,
  TriMeshBuilder,
  shadeHex,
  strutBox,
  strutCyl,
  xform,
} from './geoBuilder.js';

const HALF_PI = Math.PI / 2;
const TWO_PI = Math.PI * 2;

function starGeo(radius, depth) {
  const shape = new Shape();
  for (let i = 0; i < 10; i++) {
    const ang = HALF_PI + (i * Math.PI) / 5;
    const r = i % 2 ? radius * 0.44 : radius;
    const x = Math.cos(ang) * r;
    const y = Math.sin(ang) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return new ExtrudeGeometry(shape, { depth, bevelEnabled: false }).translate(0, 0, -depth / 2);
}

function addArchWindow(b, cx, cy, cz, rotY, w, h, frameCol, recessCol, shutterCol) {
  const r = w * 0.5;
  const bodyH = Math.max(0.2, h - r);
  const face = (lx, ly, lz, bw, bh, bd, col, topCol) => {
    const c = Math.cos(rotY);
    const s = Math.sin(rotY);
    const wx = cx + lx * c + lz * s;
    const wz = cz - lx * s + lz * c;
    b.box(bw, bh, bd, col, xform(wx, cy + ly, wz, 0, rotY, 0), topCol);
  };
  // Stone sill and surround
  face(0, -h * 0.5 - 0.08, 0.08, w + 0.28, 0.16, 0.22, frameCol);
  face(0, -r * 0.5, 0.02, w + 0.16, bodyH, 0.1, frameCol);
  face(0, -r * 0.5, 0.06, w, bodyH, 0.1, shutterCol, shadeHex(shutterCol, 1.15));
  // Louver slats
  const slats = Math.max(3, Math.floor(bodyH / 0.28));
  for (let i = 0; i < slats; i++) {
    const sy = -h * 0.5 + 0.18 + i * ((bodyH - 0.2) / slats);
    face(0, sy, 0.11, w * 0.88, 0.05, 0.04, recessCol);
  }
  // Semicircular arch top
  const c = Math.cos(rotY);
  const s = Math.sin(rotY);
  b.cyl(
    r + 0.08,
    r + 0.08,
    0.1,
    frameCol,
    xform(cx + 0.02 * s, cy + h * 0.5 - r, cz + 0.02 * c, HALF_PI, rotY, 0),
    12
  );
  b.cyl(
    r,
    r,
    0.11,
    shutterCol,
    xform(cx + 0.06 * s, cy + h * 0.5 - r, cz + 0.06 * c, HALF_PI, rotY, 0),
    12
  );
}

export const TOWN_KIT_BUILDERS = {
  officeDesk: b => {
    b.rbox(1.5,.12,.8,.03,0x695143,xform(0,.8,0),0xb09377,1);
    for(const x of [-.62,.62]) b.box(.12,.74,.65,0x393f49,xform(x,.4,0));
    b.box(.65,.43,.07,0x26313d,xform(0,1.12,-.18),0x63828b);
    b.box(.54,.31,.012,0x74d8e0,xform(0,1.13,-.13));
    b.box(.4,.025,.17,0xc9d4d1,xform(0,.89,.2));
    b.cyl(.08,.08,.17,0xc9d5da,xform(.52,.95,.12),10);
  },
  workshopBench: b => {
    b.rbox(1.7,.16,.75,.025,0x956a3f,xform(0,.82,0),0xc29b69,1);
    for(const x of [-.7,.7])for(const z of [-.25,.25]) b.box(.1,.76,.1,0x4b4e4d,xform(x,.4,z));
    b.box(.55,.18,.22,0xbb5942,xform(-.3,.99,0));
    b.cyl(.08,.08,.55,0xaebdc1,xform(.35,1.04,0,0,0,Math.PI/2),10);
    b.box(.18,.22,.26,0x4c6268,xform(.65,1.04,0));
  },
  serverRack: b => {
    b.rbox(.85,1.8,.5,.04,0x273d48,xform(0,.9,0),0x536d75,1);
    for(let y=.25;y<1.7;y+=.3){b.box(.68,.16,.02,0x101c23,xform(0,y,.26));for(let x=-.25;x<.3;x+=.17)b.sphere(.025,x>0?0x66e9cc:0xffaa51,xform(x,y,.28),6,4);}
  },
  interiorBed: (b) => {
    b.rbox(1.4,.25,2.05,.08,0x57413a,xform(0,.2,0),0x946d50,1);
    b.rbox(1.33,.3,1.9,.09,0xe6ded0,xform(0,.45,0),0xffffff,2);
    b.rbox(1.31,.16,1.15,.04,0x466c78,xform(0,.66,.3),0x7ba8ab,1);
    b.rbox(1.1,.16,.38,.07,0xf7f0e3,xform(0,.68,-.67),0xffffff,2);
    b.box(1.42,.9,.12,0x57413a,xform(0,.48,-1.03));
    for(const x of [-.55,.55]) for(const z of [-.8,.8]) b.box(.12,.2,.12,0x3f302b,xform(x,.1,z));
  },
  interiorTable: (b) => {
    b.rbox(1.45,.12,.95,.04,0x795432,xform(0,.78,0),0xc79967,1);
    for(const x of [-.55,.55]) for(const z of [-.32,.32]) b.box(.1,.72,.1,0x59402c,xform(x,.36,z));
    b.cyl(.15,.12,.18,0xd1a761,xform(.34,.94,.12),10,0xf0d28e);
    b.box(.34,.045,.24,0x7d332f,xform(-.3,.87,-.1),0xc16b57);
  },
  interiorShelf: (b) => {
    b.rbox(1.15,1.7,.36,.025,0x513c32,xform(0,.85,0),0x8e674c,1);
    for(let y=.32;y<1.6;y+=.42) {
      b.box(1.02,.07,.4,0xaa805d,xform(0,y,.04));
      for(let i=0;i<5;i++) b.box(.12,.25,.19,[0xa7493c,0x387a86,0xd2ab56,0x6b774b,0x756097][i],xform(-.4+i*.2,y+.16,.08));
    }
  },
  interiorSofa: (b) => {
    b.rbox(1.7,.42,.8,.12,0x5b7880,xform(0,.34,0),0x8dafb0,2);
    b.rbox(1.7,.65,.24,.08,0x55747a,xform(0,.7,-.28),0x99b8b5,2);
    for(const x of [-.72,.72]) b.rbox(.22,.45,.85,.07,0x4a6669,xform(x,.55,0),0x87a8a4,1);
    b.rbox(.44,.12,.42,.05,0xd09d5f,xform(.36,.59,.03),0xf0d298,1);
    for(const x of [-.6,.6])for(const z of [-.25,.25]) b.box(.11,.12,.11,0x443b36,xform(x,.06,z));
  },

  sanctuaryArch: (b) => {
    const stone=0xb9d0cb, shadow=0x678b83, gold=0xe1cb8e;
    for(const x of [-3.2,3.2]) {
      b.box(1.35,.4,1.7,shadow,xform(x,.2,0),stone);
      b.rbox(.92,4.8,.98,.12,stone,xform(x,2.75,0),0xe9f3e5,2);
      for(let y=.8;y<5;y+=1) b.box(1.03,.07,1.05,shadow,xform(x,y,0));
      b.box(1.4,.3,1.3,gold,xform(x,5.27,0),0xffe9a8);
    }
    b.box(7.9,.65,1.35,stone,xform(0,5.7,0),0xe1efdf);
    b.box(7.5,.12,1.5,gold,xform(0,6.08,0));
    b.ico(.6,0x66efd0,xform(0,6.55,0,0,0,0,1,1.4,.45),1,0xd8fff3);
  },
  bugleSign: (b) => {
    const iron=0x28333d, red=0xc72e32, ivory=0xffe5cf;
    for(const x of [-3,3]) { b.box(.26,4,.26,iron,xform(x,2,0)); b.box(.8,.2,.8,iron,xform(x,.1,0)); }
    b.box(7,.2,.35,iron,xform(0,3.6,0));
    b.rbox(7.5,2,.35,.08,red,xform(0,4.7,0),0xf76857,1);
    b.box(6.85,.12,.38,ivory,xform(0,5.25,.02));
    // Stylized paper-and-headline emblem, visible from both sides.
    for(const z of [-.2,.2]) {
      b.box(1.15,1.1,.05,ivory,xform(-2.4,4.7,z));
      for(let i=0;i<4;i++) b.box(.75,.07,.06,iron,xform(-2.4,4.45+i*.17,z));
      for(let i=0;i<4;i++) b.box(.62,.95,.06,ivory,xform(-.8+i*1.12,4.7,z));
    }
  },
  cuddleMascot: (b) => {
    const pink=0xe573a7,light=0xffbad3,dark=0x603452;
    b.box(1.3,1.5,1.3,0x644d4a,xform(0,.75,0));
    b.sphere(1.35,pink,xform(0,2.9,0,0,0,0,1,1,.85),16,12,light);
    for(const x of [-.9,.9]) {b.sphere(.43,pink,xform(x,3.95,0),12,8,light);b.sphere(.23,dark,xform(x,3.99,.29),10,8);}
    b.sphere(.6,light,xform(0,2.65,1.0,0,0,0,1,.7,.35),12,8);
    b.sphere(.2,dark,xform(0,2.8,1.23,0,0,0,1,.7,.55),10,8);
    for(const x of [-.47,.47]) b.sphere(.16,dark,xform(x,3.12,1.06,0,0,0,1,1,.5),10,8);
  },
  desertWindmill: (b) => {
    const iron=0x827060, red=0xc45439;
    for(const x of [-1,1]) {strutBox(b,[x*1.2,0,0],[x*.3,7,0],.15,iron);}
    for(let y=1;y<7;y+=1) b.box(2.4-y*.25,.12,.18,iron,xform(0,y,0));
    b.cyl(.24,.24,.4,iron,xform(0,7.2,0,HALF_PI,0,0),10);
    for(let i=0;i<8;i++) {const a=i*Math.PI/4; b.box(.5,2.2,.09,i%2?red:0xd9c9a5,xform(Math.sin(a)*1.5,7.2+Math.cos(a)*1.5,.25,0,0,-a));}
  },

  clocktower: (b) => {
    const stoneLight = 0xfaf3e2;
    const stoneWarm = 0xead9b6;
    const stoneTrim = 0xcdb58c;
    const stoneDark = 0xb59a6e;
    const woodDoor = 0x7a4f2c;
    const woodLight = 0xa8723f;
    const shutterRed = 0xc84b38;
    const shutterDark = 0x8a2c1f;
    const copper = 0x3c9a82;
    const copperLight = 0x58bfa5;
    const copperDark = 0x266b59;
    const iron = 0x2a2e3a;
    const gold = 0xf0b938;

    // Stepped foundation plinth [-4.4..4.4]
    b.box(8.8, 0.65, 8.8, stoneDark, xform(0, 0.325, 0), stoneTrim);
    b.box(8.2, 0.65, 8.2, stoneTrim, xform(0, 0.975, 0), stoneWarm);

    // Lower tower story (y = 1.3 .. 9.2)
    b.box(7.4, 7.9, 7.4, stoneWarm, xform(0, 5.25, 0), stoneLight);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        b.box(0.68, 8.0, 0.68, stoneTrim, xform(sx * 3.52, 5.3, sz * 3.52), stoneWarm);
      }
    }
    b.box(7.95, 0.48, 7.95, stoneTrim, xform(0, 9.35, 0), stoneLight);

    // Grand arched double doors + gold star crest on all 4 faces
    const star = starGeo(0.42, 0.12);
    for (let dir = 0; dir < 4; dir++) {
      const rot = dir * HALF_PI;
      const c = Math.cos(rot);
      const s = Math.sin(rot);
      const fz = 3.72;
      // Stone steps
      b.box(3.4, 0.3, 0.7, stoneTrim, xform(s * (fz + 0.25), 1.45, c * (fz + 0.25), 0, rot, 0));
      // Doorway arch frame
      b.box(2.5, 3.3, 0.24, stoneTrim, xform(s * fz, 3.15, c * fz, 0, rot, 0));
      b.cyl(1.25, 1.25, 0.24, stoneTrim, xform(s * fz, 4.8, c * fz, HALF_PI, rot, 0), 14);
      // Wooden doors
      b.box(2.05, 3.2, 0.28, woodDoor, xform(s * (fz + 0.03), 3.1, c * (fz + 0.03), 0, rot, 0), woodLight);
      b.cyl(1.02, 1.02, 0.28, woodLight, xform(s * (fz + 0.03), 4.7, c * (fz + 0.03), HALF_PI, rot, 0), 14);
      b.box(0.08, 4.2, 0.32, iron, xform(s * (fz + 0.04), 3.55, c * (fz + 0.04), 0, rot, 0));
      // Brass handles
      for (const side of [-0.2, 0.2]) {
        const hx = side * c + (fz + 0.18) * s;
        const hz = -side * s + (fz + 0.18) * c;
        b.sphere(0.08, gold, xform(hx, 3.0, hz), 8, 6);
      }
      // Circular star medallion above doorway (y = 7.2)
      b.cyl(0.68, 0.68, 0.16, iron, xform(s * (fz + 0.03), 7.25, c * (fz + 0.03), HALF_PI, rot, 0), 16);
      b.torus(0.68, 0.07, stoneTrim, xform(s * (fz + 0.08), 7.25, c * (fz + 0.08), 0, rot, 0), 6, 16);
      b.add(star, gold, xform(s * (fz + 0.12), 7.25, c * (fz + 0.12), 0, rot, 0));
    }

    // Middle window tier (y = 9.6 .. 17.2)
    b.box(6.9, 7.6, 6.9, stoneWarm, xform(0, 13.4, 0), stoneLight);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        b.box(0.58, 7.6, 0.58, stoneTrim, xform(sx * 3.3, 13.4, sz * 3.3), stoneWarm);
      }
    }
    for (let dir = 0; dir < 4; dir++) {
      const rot = dir * HALF_PI;
      const c = Math.cos(rot);
      const s = Math.sin(rot);
      for (const wxOff of [-1.32, 1.32]) {
        const wx = wxOff * c + 3.46 * s;
        const wz = -wxOff * s + 3.46 * c;
        addArchWindow(b, wx, 13.5, wz, rot, 1.38, 3.85, stoneTrim, shutterDark, shutterRed);
      }
    }
    b.box(7.55, 0.52, 7.55, stoneTrim, xform(0, 17.42, 0), stoneLight);

    // Clock stage (y = 17.68 .. 23.8)
    b.box(6.8, 6.1, 6.8, stoneWarm, xform(0, 20.73, 0), stoneLight);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        b.box(0.56, 6.1, 0.56, stoneTrim, xform(sx * 3.26, 20.73, sz * 3.26));
      }
    }
    for (let dir = 0; dir < 4; dir++) {
      const rot = dir * HALF_PI;
      const c = Math.cos(rot);
      const s = Math.sin(rot);
      const fz = 3.43;
      const cy = 20.75;
      // Outer bronze/iron bezel + white clock dial
      b.cyl(2.18, 2.18, 0.2, stoneTrim, xform(s * fz, cy, c * fz, HALF_PI, rot, 0), 24);
      b.torus(2.05, 0.14, iron, xform(s * (fz + 0.1), cy, c * (fz + 0.1), 0, rot, 0), 8, 24);
      b.cyl(1.96, 1.96, 0.16, 0xffffff, xform(s * (fz + 0.08), cy, c * (fz + 0.08), HALF_PI, rot, 0), 24);
      // 12 hour ticks
      for (let h = 0; h < 12; h++) {
        const ang = (h / 12) * TWO_PI;
        const rad = 1.62;
        const lx = Math.sin(ang) * rad;
        const ly = Math.cos(ang) * rad;
        const tx = lx * c + (fz + 0.18) * s;
        const tz = -lx * s + (fz + 0.18) * c;
        const major = h % 3 === 0;
        b.box(
          major ? 0.14 : 0.08,
          major ? 0.34 : 0.22,
          0.06,
          iron,
          xform(tx, cy + ly, tz, 0, rot, -ang)
        );
      }
      // Clock hands (10:10 classic pose) + gold hub
      const hand = (ang, len, thick) => {
        const lx = Math.sin(ang) * len * 0.5;
        const ly = Math.cos(ang) * len * 0.5;
        const hx = lx * c + (fz + 0.21) * s;
        const hz = -lx * s + (fz + 0.21) * c;
        b.box(thick, len, 0.06, iron, xform(hx, cy + ly, hz, 0, rot, -ang));
      };
      hand(-0.95, 1.12, 0.16);
      hand(0.88, 1.56, 0.11);
      b.sphere(0.18, gold, xform(s * (fz + 0.23), cy, c * (fz + 0.23)), 10, 8);
    }
    b.box(7.5, 0.55, 7.5, stoneTrim, xform(0, 24.05, 0), stoneLight);

    // Belfry lantern stage (y = 24.3 .. 28.4)
    b.box(4.2, 4.1, 4.2, iron, xform(0, 26.35, 0));
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        b.box(1.05, 4.1, 1.05, stoneWarm, xform(sx * 2.35, 26.35, sz * 2.35), stoneLight);
      }
    }
    for (let dir = 0; dir < 4; dir++) {
      const rot = dir * HALF_PI;
      const c = Math.cos(rot);
      const s = Math.sin(rot);
      b.box(3.8, 0.85, 0.9, stoneWarm, xform(s * 2.4, 28.0, c * 2.4, 0, rot, 0), stoneLight);
      b.box(3.8, 0.65, 0.95, stoneTrim, xform(s * 2.42, 24.62, c * 2.42, 0, rot, 0));
    }
    // Hanging bronze bell inside belfry
    b.cyl(0.45, 0.95, 1.35, gold, xform(0, 26.4, 0), 14, woodLight);
    b.sphere(0.22, iron, xform(0, 25.65, 0), 8, 6);

    // Cornice + Verdigris Copper Spire (y = 28.4 .. 37.68)
    b.box(6.6, 0.5, 6.6, copperDark, xform(0, 28.65, 0), copper);
    b.cone(4.55, 7.6, copper, xform(0, 32.65, 0, 0, Math.PI / 4, 0), 4, copperLight);
    // Dormer vents on spire
    for (let dir = 0; dir < 4; dir++) {
      const rot = dir * HALF_PI;
      const c = Math.cos(rot);
      const s = Math.sin(rot);
      b.box(1.05, 1.25, 0.9, copperDark, xform(s * 2.15, 30.2, c * 2.15, 0, rot, 0), copperLight);
      b.cone(0.82, 0.75, copperLight, xform(s * 2.18, 31.15, c * 2.18, 0, rot + Math.PI / 4, 0), 4);
    }
    // Gold finial spire & orb
    b.cyl(0.12, 0.22, 0.7, copperDark, xform(0, 36.6, 0), 8);
    b.sphere(0.36, gold, xform(0, 37.05, 0), 12, 10);
    b.cone(0.12, 0.62, gold, xform(0, 37.37, 0), 8);
  },

  fountain: (b) => {
    const stoneBase = 0xcdb58c;
    const stoneLight = 0xf6ecd8;
    const stoneMid = 0xead9b6;
    const waterDeep = 0x45b8e6;
    const waterBright = 0x9eeeff;
    const gold = 0xf0b938;
    const brass = 0xc98f22;

    // Outer plaza rim & lower basin (r = 3.95, y = 0..0.82)
    b.cyl(3.98, 4.02, 0.22, stoneBase, xform(0, 0.11, 0), 16, stoneMid);
    b.cyl(3.82, 3.68, 0.58, stoneBase, xform(0, 0.48, 0), 16, stoneLight);
    b.torus(3.72, 0.19, stoneLight, xform(0, 0.76, 0, HALF_PI, 0, 0), 8, 20);
    // Inner dark basin floor + bright glowing turquoise water
    b.cyl(3.52, 3.45, 0.12, 0x2c6e8f, xform(0, 0.26, 0), 16);
    b.cyl(3.54, 3.54, 0.34, waterDeep, xform(0, 0.5, 0), 18, waterBright);

    // 8 perimeter brass nozzles & arcing foam splashes
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * TWO_PI;
      const rx = Math.cos(ang) * 3.15;
      const rz = Math.sin(ang) * 3.15;
      b.cyl(0.08, 0.11, 0.22, brass, xform(rx, 0.74, rz), 8, gold);
      strutCyl(
        b,
        [rx, 0.84, rz],
        [Math.cos(ang) * 1.85, 1.55, Math.sin(ang) * 1.85],
        0.045,
        waterBright,
        6
      );
      b.sphere(0.14, 0xffffff, xform(rx * 0.88, 0.72, rz * 0.88), 8, 6);
    }

    // Central sculpted pedestal (y = 0.65 .. 2.35)
    b.cyl(1.12, 1.36, 0.48, stoneBase, xform(0, 0.88, 0), 14, stoneMid);
    b.torus(1.08, 0.1, gold, xform(0, 1.14, 0, HALF_PI, 0, 0), 6, 16);
    b.cyl(0.72, 0.94, 1.15, stoneMid, xform(0, 1.7, 0), 14, stoneLight);

    // Middle tier bowl (r = 2.05, y = 2.22 .. 2.78)
    b.cyl(2.08, 1.15, 0.46, stoneBase, xform(0, 2.45, 0), 16, stoneLight);
    b.torus(2.02, 0.13, stoneLight, xform(0, 2.68, 0, HALF_PI, 0, 0), 8, 18);
    b.cyl(1.92, 1.92, 0.16, waterDeep, xform(0, 2.66, 0), 16, waterBright);
    // Waterfall spill ribs from mid bowl to lower basin
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * TWO_PI;
      strutCyl(
        b,
        [Math.cos(ang) * 1.98, 2.62, Math.sin(ang) * 1.98],
        [Math.cos(ang) * 2.25, 0.68, Math.sin(ang) * 2.25],
        0.055,
        waterBright,
        5
      );
    }

    // Upper pedestal + top bowl (y = 2.74 .. 4.25)
    b.cyl(0.46, 0.62, 1.15, stoneMid, xform(0, 3.3, 0), 12, stoneLight);
    b.torus(0.52, 0.07, gold, xform(0, 3.35, 0, HALF_PI, 0, 0), 6, 14);
    b.cyl(1.08, 0.52, 0.36, stoneBase, xform(0, 4.02, 0), 14, stoneLight);
    b.torus(1.04, 0.09, stoneLight, xform(0, 4.2, 0, HALF_PI, 0, 0), 6, 16);
    b.cyl(0.96, 0.96, 0.12, waterDeep, xform(0, 4.18, 0), 14, waterBright);

    // Golden finial + top geyser water plume (up to y = 5.1)
    b.cyl(0.18, 0.26, 0.38, brass, xform(0, 4.42, 0), 10, gold);
    b.sphere(0.24, gold, xform(0, 4.68, 0), 10, 8);
    b.cone(0.32, 0.52, waterBright, xform(0, 4.84, 0, Math.PI, 0, 0), 10, 0xffffff);
    b.sphere(0.22, 0xffffff, xform(0, 5.0, 0), 10, 8);
  },

  awning: (b, variant = 0) => {
    const schemes = [
      [0xe8433a, 0xf7f7f4], // 0: Red & White
      [0x2f7fd8, 0xf7f7f4], // 1: Blue & White
      [0x2e9e57, 0xfff3d6], // 2: Green & Cream
      [0xf2a33a, 0x7a3b1d], // 3: Amber Yellow & Espresso Brown
    ];
    const [colA, colB] = schemes[variant % schemes.length];
    const frameCol = 0x4c5561;
    const totalW = 4.4;
    const stripes = 9;
    const sw = totalW / stripes;
    const yBack = 3.4;
    const yFront = 2.66;
    const zBack = 0.04;
    const zFront = 1.76;

    // Wall header bar & front roller bar
    b.box(totalW + 0.08, 0.1, 0.1, frameCol, xform(0, yBack, zBack + 0.03));
    b.cyl(0.04, 0.04, totalW + 0.06, frameCol, xform(0, yFront, zFront, 0, 0, HALF_PI), 8);

    // Steel side support struts
    for (const sx of [-1, 1]) {
      const x = sx * (totalW * 0.5 - 0.08);
      strutCyl(b, [x, 2.45, 0.06], [x, yFront, zFront - 0.06], 0.035, frameCol, 6);
      strutCyl(b, [x, yBack, 0.06], [x, yFront, zFront], 0.035, frameCol, 6);
    }

    // Sloped fabric panels + front valance tabs
    for (let i = 0; i < stripes; i++) {
      const col = i % 2 === 0 ? colA : colB;
      const darkCol = shadeHex(col, 0.84);
      const x0 = -totalW * 0.5 + i * sw;
      const x1 = x0 + sw;
      const tm = new TriMeshBuilder();
      const bL = [x0, yBack, zBack];
      const bR = [x1, yBack, zBack];
      const fR = [x1, yFront, zFront];
      const fL = [x0, yFront, zFront];
      // Top & underside
      tm.quad(bL, fL, fR, bR).quad(bR, fR, fL, bL);
      b.add(tm.geo(), darkCol, undefined, col);

      // Front hanging valance flap (y = 2.44 .. 2.66)
      const cx = (x0 + x1) * 0.5;
      b.rbox(sw * 0.96, 0.24, 0.04, 0.04, darkCol, xform(cx, yFront - 0.12, zFront), col, 1);
    }

    // Side fabric gussets
    for (const sx of [-1, 1]) {
      const x = sx * totalW * 0.5;
      const gusset = new TriMeshBuilder();
      const p1 = [x, yBack, zBack];
      const p2 = [x, yFront, zFront];
      const p3 = [x, yFront, zBack];
      if (sx > 0) gusset.tri(p1, p3, p2).tri(p1, p2, p3);
      else gusset.tri(p1, p2, p3).tri(p1, p3, p2);
      b.add(gusset.geo(), shadeHex(colA, 0.78));
    }
  },

  blade: (b, variant = 0) => {
    const themes = [
      { bg: 0x2b2148, neon: 0xff4f8b, h: 4.5 },
      { bg: 0xb8322b, neon: 0xffd23f, h: 4.5 },
      { bg: 0x1d3a5c, neon: 0x7df9ff, h: 3.72 },
      { bg: 0x3a2416, neon: 0xffa531, h: 6.06 },
      { bg: 0x23402a, neon: 0xb8ff5a, h: 4.5 },
      { bg: 0x1c1736, neon: 0xd56bff, h: 5.28 },
    ];
    const t = themes[variant % themes.length];
    const iron = 0x4c5561;
    const brass = 0xc98f22;
    const bulb = 0xfff4c2;

    // Wall mount plate & horizontal brackets (z = 0 .. 0.42)
    b.box(0.22, t.h * 0.82, 0.06, iron, xform(0, t.h * 0.5, 0.03));
    for (const yf of [0.16, 0.84]) {
      const y = t.h * yf;
      b.box(0.1, 0.1, 1.68, iron, xform(0, y, 0.86));
      strutCyl(b, [0, y + 0.38, 0.05], [0, y, 0.95], 0.028, iron, 6);
    }

    // Main sign cabinet (x = -0.14..0.14, y = 0..t.h, z = 0.36..1.68)
    const cabZ = 1.02;
    const cabD = 1.3;
    b.rbox(0.26, t.h, cabD, 0.05, shadeHex(t.bg, 0.8), xform(0, t.h * 0.5, cabZ), t.bg, 1);
    // Brass trim border
    b.box(0.28, 0.1, cabD + 0.06, brass, xform(0, t.h - 0.04, cabZ));
    b.box(0.28, 0.1, cabD + 0.06, brass, xform(0, 0.04, cabZ));
    b.box(0.28, t.h, 0.08, brass, xform(0, t.h * 0.5, cabZ + cabD * 0.5));
    b.box(0.28, t.h, 0.08, brass, xform(0, t.h * 0.5, cabZ - cabD * 0.5));

    // Marquee bulbs & vertical neon bars/glyphs on both faces (±X)
    const rows = Math.max(4, Math.floor(t.h / 0.72));
    for (const sx of [-1, 1]) {
      const fx = sx * 0.145;
      // Glowing vertical neon border tubes
      b.box(0.03, t.h - 0.4, 0.06, t.neon, xform(fx, t.h * 0.5, cabZ - cabD * 0.36));
      b.box(0.03, t.h - 0.4, 0.06, t.neon, xform(fx, t.h * 0.5, cabZ + cabD * 0.36));
      // Stylized letter blocks down the blade
      for (let r = 0; r < rows; r++) {
        const ry = 0.48 + (r + 0.5) * ((t.h - 0.96) / rows);
        b.rbox(0.04, 0.34, 0.58, 0.02, t.neon, xform(fx, ry, cabZ), bulb, 1);
        b.box(0.05, 0.12, 0.28, t.bg, xform(fx + sx * 0.005, ry, cabZ + ((r % 2) - 0.5) * 0.14));
      }
      // Top & bottom bulb accents
      for (let k = -2; k <= 2; k++) {
        b.sphere(0.045, bulb, xform(fx, t.h - 0.16, cabZ + k * 0.24), 6, 5);
        b.sphere(0.045, bulb, xform(fx, 0.16, cabZ + k * 0.24), 6, 5);
      }
    }
    // Bottom finial pointer
    b.cone(0.16, 0.24, brass, xform(0, -0.06, cabZ, Math.PI, 0, 0), 6);
  },

  roofsign: (b) => {
    const steel = 0x4c5561;
    const steelDark = 0x323942;
    const red = 0xd2412f;
    const yellow = 0xffd23f;
    const bulb = 0xfff4c2;
    const navy = 0x16233d;

    // 5 vertical truss towers across [-7.6 .. 7.6]
    const cols = [-7.5, -3.75, 0, 3.75, 7.5];
    for (const x of cols) {
      b.box(0.26, 8.2, 0.26, steelDark, xform(x, 4.1, 0.18), steel);
      b.box(0.22, 6.8, 0.22, steelDark, xform(x, 3.4, -0.88), steel);
      strutBox(b, [x, 0.1, -0.88], [x, 3.4, 0.18], 0.14, steel);
      strutBox(b, [x, 3.4, -0.88], [x, 6.8, 0.18], 0.14, steel);
      b.box(0.2, 0.16, 1.15, steel, xform(x, 3.4, -0.35));
      b.box(0.2, 0.16, 1.15, steel, xform(x, 6.75, -0.35));
    }
    // Horizontal crossbeams + X-bracing
    b.box(16.2, 0.24, 0.24, steel, xform(0, 3.35, 0.18));
    b.box(16.2, 0.24, 0.24, steel, xform(0, 8.15, 0.18));
    for (let i = 0; i < cols.length - 1; i++) {
      strutBox(b, [cols[i], 0.2, 0.18], [cols[i + 1], 3.3, 0.18], 0.12, steelDark);
      strutBox(b, [cols[i + 1], 0.2, 0.18], [cols[i], 3.3, 0.18], 0.12, steelDark);
    }

    // Front maintenance catwalk & floodlights (z = 0.4 .. 1.65)
    b.box(16.0, 0.12, 0.85, steelDark, xform(0, 3.15, 0.82), steel);
    b.box(16.0, 0.07, 0.07, steel, xform(0, 3.95, 1.22));
    for (let x = -7.5; x <= 7.5; x += 2.5) {
      b.box(0.07, 0.8, 0.07, steel, xform(x, 3.55, 1.22));
    }
    for (const lx of [-5.8, -1.9, 1.9, 5.8]) {
      strutCyl(b, [lx, 8.2, 0.25], [lx, 8.42, 1.48], 0.05, steel, 6);
      b.rbox(0.55, 0.28, 0.34, 0.05, steelDark, xform(lx, 8.32, 1.5, 0.45, 0, 0), steel, 1);
      b.box(0.46, 0.2, 0.06, bulb, xform(lx, 8.24, 1.36, 0.45, 0, 0));
    }

    // Giant Marquee Billboard Face (16.5m x 4.6m at y = 3.5 .. 8.1, z = 0.42)
    b.rbox(16.5, 4.65, 0.36, 0.12, red, xform(0, 5.82, 0.42), shadeHex(red, 1.15), 1);
    b.rbox(15.8, 3.95, 0.4, 0.08, navy, xform(0, 5.82, 0.44), 0x223863, 1);
    // Yellow inner chevron frame
    b.box(15.4, 0.18, 0.44, yellow, xform(0, 7.62, 0.45));
    b.box(15.4, 0.18, 0.44, yellow, xform(0, 4.02, 0.45));
    // Marquee bulbs around perimeter
    for (let x = -7.8; x <= 7.81; x += 0.78) {
      b.sphere(0.085, bulb, xform(x, 7.95, 0.62), 6, 5);
      b.sphere(0.085, bulb, xform(x, 3.69, 0.62), 6, 5);
    }
    // Bold geometric "SKY HIGH" block letters + center crown star
    const star = starGeo(0.95, 0.22);
    b.add(star, yellow, xform(0, 5.95, 0.68));
    const letterXs = [-6.4, -4.9, -3.4, 3.4, 4.9, 6.4];
    for (let i = 0; i < letterXs.length; i++) {
      const lx = letterXs[i];
      b.rbox(1.05, 2.35, 0.2, 0.08, yellow, xform(lx, 5.85, 0.65), bulb, 1);
      b.box(0.42, 0.75, 0.22, navy, xform(lx + (i % 2 ? 0.12 : -0.12), 5.85, 0.67));
    }
    b.rbox(3.8, 0.55, 0.22, 0.06, red, xform(0, 4.55, 0.66), yellow, 1);
  },

  rooftank: (b) => {
    const steel = 0x4c5561;
    const steelDark = 0x323842;
    const hoop = 0x8e9aa8;
    const cedarDark = 0x7a4f2c;
    const cedarLight = 0xb57c45;

    // 4 angled steel trestle legs + cross-bracing (y = 0 .. 2.75)
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        b.box(0.36, 0.14, 0.36, steelDark, xform(sx * 1.22, 0.07, sz * 1.22));
        strutBox(b, [sx * 1.22, 0.1, sz * 1.22], [sx * 0.92, 2.75, sz * 0.92], 0.16, steel);
      }
    }
    for (const y of [1.05, 2.05]) {
      const w = 1.22 - (y / 2.75) * 0.3;
      for (const s of [-1, 1]) {
        strutBox(b, [-w, y, s * w], [w, y, s * w], 0.09, steelDark);
        strutBox(b, [s * w, y, -w], [s * w, y, w], 0.09, steelDark);
      }
    }
    // Diagonal X braces
    for (const s of [-1, 1]) {
      strutBox(b, [-1.18, 0.25, s * 1.18], [0.95, 2.6, s * 0.95], 0.06, steel);
      strutBox(b, [1.18, 0.25, s * 1.18], [-0.95, 2.6, s * 0.95], 0.06, steel);
    }

    // Platform deck & central standpipe
    b.cyl(0.18, 0.18, 2.8, steelDark, xform(0, 1.4, 0), 10, hoop);
    b.cyl(1.42, 1.42, 0.18, cedarDark, xform(0, 2.78, 0), 18, cedarLight);

    // Cedar wood stave tank body (y = 2.85 .. 5.55)
    b.cyl(1.26, 1.3, 2.7, cedarDark, xform(0, 4.2, 0), 20, cedarLight);
    for (let i = 0; i < 16; i++) {
      const ang = (i / 16) * TWO_PI;
      b.box(
        0.06,
        2.68,
        0.05,
        shadeHex(cedarDark, i % 2 ? 0.9 : 1.18),
        xform(Math.cos(ang) * 1.28, 4.2, Math.sin(ang) * 1.28, 0, -ang, 0)
      );
    }
    // Galvanized steel tension hoops
    for (const hy of [3.08, 3.72, 4.42, 5.18]) {
      b.cyl(1.32, 1.32, 0.08, hoop, xform(0, hy, 0), 20);
    }

    // Conical roof + finial (y = 5.55 .. 6.72)
    b.cone(1.45, 0.95, cedarDark, xform(0, 6.02, 0), 18, cedarLight);
    b.cyl(0.08, 0.12, 0.26, steel, xform(0, 6.58, 0), 8, hoop);
    b.sphere(0.1, hoop, xform(0, 6.66, 0), 8, 6);

    // Side access ladder (+X)
    for (const lz of [-0.22, 0.22]) {
      strutBox(b, [1.36, 0.1, lz], [1.36, 5.65, lz], 0.05, steel);
    }
    for (let ly = 0.45; ly <= 5.5; ly += 0.42) {
      b.box(0.05, 0.05, 0.44, hoop, xform(1.36, ly, 0));
    }
  },

  acunit: (b) => {
    const bodyCol = 0xb8c0ca;
    const topCol = 0xdde2e8;
    const dark = 0x3c434d;
    const mid = 0x6e7783;
    const copper = 0xb87344;

    // Vibration rails
    for (const z of [-0.52, 0.52]) {
      b.box(2.22, 0.1, 0.14, dark, xform(0, 0.05, z));
    }
    // Main sheet-metal cabinet
    b.rbox(2.16, 0.96, 1.36, 0.06, bodyCol, xform(0, 0.58, 0), topCol, 1);
    b.box(2.2, 0.06, 1.4, mid, xform(0, 1.06, 0), topCol);

    // Twin top exhaust fan shrouds, blades & wire grilles
    for (const fx of [-0.54, 0.54]) {
      b.cyl(0.42, 0.44, 0.1, mid, xform(fx, 1.1, 0), 16, dark);
      b.cyl(0.37, 0.37, 0.08, 0x1e2329, xform(fx, 1.11, 0), 16);
      b.cyl(0.09, 0.09, 0.11, bodyCol, xform(fx, 1.12, 0), 10);
      for (let i = 0; i < 4; i++) {
        const ang = (i * Math.PI) / 2 + 0.35;
        b.box(0.66, 0.02, 0.13, mid, xform(fx, 1.12, 0, 0.22, ang, 0));
      }
      b.torus(0.36, 0.016, topCol, xform(fx, 1.155, 0, HALF_PI, 0, 0), 5, 16);
      b.torus(0.22, 0.014, topCol, xform(fx, 1.155, 0, HALF_PI, 0, 0), 5, 14);
    }

    // Front & back louver grilles
    for (const sz of [-1, 1]) {
      for (let row = 0; row < 5; row++) {
        const ly = 0.26 + row * 0.14;
        b.box(1.86, 0.05, 0.04, dark, xform(0, ly, sz * 0.68));
      }
    }
    // Side electrical service box & copper refrigerant lines
    b.rbox(0.14, 0.48, 0.36, 0.02, mid, xform(1.12, 0.62, 0.18), topCol, 1);
    b.cyl(0.035, 0.035, 0.52, copper, xform(-1.1, 0.36, -0.25), 8);
    b.cyl(0.025, 0.025, 0.52, dark, xform(-1.1, 0.36, -0.14), 8);
  },

  trafficlight: (b) => {
    const pole = 0x262b33;
    const poleLight = 0x3d4652;
    const housing = 0x1c2027;
    const visor = 0xf0b938;
    const red = 0xff4b3e;
    const amber = 0xffbe2e;
    const green = 0x4bf07a;

    // Octagonal base + vertical mast (y = 0 .. 5.68)
    b.cyl(0.19, 0.22, 0.36, pole, xform(0, 0.18, 0), 8, poleLight);
    b.cyl(0.11, 0.14, 5.34, pole, xform(0, 3.0, 0), 10, poleLight);
    b.sphere(0.13, poleLight, xform(0, 5.66, 0), 8, 6);

    // Pedestrian button box & street name sign blades
    b.rbox(0.14, 0.26, 0.14, 0.02, visor, xform(0, 1.25, 0.14), 0xffd86b, 1);
    b.box(0.95, 0.22, 0.04, 0x1f6b45, xform(0.48, 4.35, 0));
    b.box(0.85, 0.14, 0.05, 0xffffff, xform(0.48, 4.35, 0));
    b.box(0.04, 0.22, 0.95, 0x1f6b45, xform(0, 4.62, 0.48));
    b.box(0.05, 0.14, 0.85, 0xffffff, xform(0, 4.62, 0.48));

    // Cantilever arm extending +Z (z = 0 .. 3.95 at y = 5.15..5.45)
    strutCyl(b, [0, 5.15, 0], [0, 5.42, 3.92], 0.075, pole, 8);
    strutCyl(b, [0, 4.45, 0], [0, 5.26, 1.65], 0.045, poleLight, 6);

    // Helper for 3-light signal head
    const addSignalHead = (hx, hy, hz, scale = 1) => {
      b.rbox(0.38 * scale, 1.08 * scale, 0.28 * scale, 0.04, housing, xform(hx, hy, hz), visor, 1);
      b.box(0.42 * scale, 1.12 * scale, 0.03, visor, xform(hx, hy, hz - 0.12 * scale));
      const cols = [red, amber, green];
      for (let i = 0; i < 3; i++) {
        const ly = hy + (1 - i) * 0.31 * scale;
        for (const dir of [-1, 1]) {
          b.cyl(
            0.105 * scale,
            0.105 * scale,
            0.06,
            cols[i],
            xform(hx + dir * 0.16 * scale, ly, hz, 0, 0, HALF_PI),
            12
          );
          b.cyl(
            0.12 * scale,
            0.12 * scale,
            0.12 * scale,
            housing,
            xform(hx + dir * 0.2 * scale, ly + 0.03 * scale, hz, 0, 0, HALF_PI),
            10,
            undefined,
            true
          );
        }
      }
    };
    addSignalHead(0, 5.05, 2.35, 0.95);
    addSignalHead(0, 5.08, 3.78, 1.0);
    // Pole-mounted secondary light
    b.rbox(0.26, 0.78, 0.24, 0.03, housing, xform(0, 3.35, 0.2), poleLight, 1);
    const cols = [red, amber, green];
    for (let i = 0; i < 3; i++) {
      b.cyl(0.08, 0.08, 0.05, cols[i], xform(0, 3.58 - i * 0.23, 0.32, HALF_PI, 0, 0), 10);
    }
  },

  busstop: (b) => {
    const curb = 0xc9c5bd;
    const navy = 0x1d2a44;
    const blue = 0x2f6fbf;
    const blueBright = 0x4595ea;
    const glass = 0x8cc6ec;
    const wood = 0xa8723f;
    const woodDark = 0x784e28;
    const red = 0xd2412f;
    const yellow = 0xffd23f;

    // Concrete base pad [-2.25..2.25, 0..0.12, -0.88..0.88]
    b.rbox(4.45, 0.12, 1.76, 0.03, shadeHex(curb, 0.85), xform(0, 0.06, 0), curb, 1);

    // 4 navy structural posts (back & side frame)
    for (const px of [-1.95, 0, 1.95]) {
      b.box(0.11, 2.48, 0.11, navy, xform(px, 1.34, -0.68));
    }
    for (const px of [-1.95, 1.95]) {
      b.box(0.09, 2.48, 0.09, navy, xform(px, 1.34, 0.58));
      b.box(0.1, 0.1, 1.36, navy, xform(px, 2.54, -0.05));
    }

    // Tinted glass back panels & left wind screen
    b.box(3.82, 1.96, 0.04, glass, xform(0, 1.36, -0.68), 0xbbe2fb);
    b.box(0.04, 1.96, 1.18, glass, xform(-1.95, 1.36, -0.05), 0xbbe2fb);

    // Cantilevered arched/sloped blue transit canopy roof (y = 2.56 .. 2.76)
    b.rbox(4.36, 0.16, 1.88, 0.06, blue, xform(0, 2.64, 0.02, 0.04, 0, 0), blueBright, 1);
    b.box(4.4, 0.06, 0.12, yellow, xform(0, 2.62, 0.94));

    // Slatted wood bench inside shelter
    for (const bx of [-1.05, 0.35]) {
      b.box(0.1, 0.44, 0.42, navy, xform(bx, 0.34, -0.34));
    }
    for (let s = 0; s < 3; s++) {
      b.rbox(2.35, 0.055, 0.13, 0.015, woodDark, xform(-0.35, 0.56, -0.48 + s * 0.15), wood, 1);
    }

    // Illuminated route map & timetable cabinet (+X side)
    b.rbox(0.95, 1.48, 0.14, 0.03, navy, xform(1.38, 1.42, -0.62), blue, 1);
    b.box(0.78, 1.24, 0.16, 0xf7f7f4, xform(1.38, 1.42, -0.61));
    b.box(0.78, 0.24, 0.17, blue, xform(1.38, 1.92, -0.61));
    b.box(0.55, 0.08, 0.18, red, xform(1.32, 1.5, -0.6));
    b.box(0.55, 0.08, 0.18, yellow, xform(1.38, 1.28, -0.6));

    // Bus Stop curbside flag totem (+X front)
    b.cyl(0.045, 0.05, 2.55, navy, xform(2.16, 1.38, 0.65), 8);
    b.cyl(0.24, 0.24, 0.09, red, xform(2.16, 2.48, 0.65, 0, 0, HALF_PI), 16);
    b.cyl(0.16, 0.16, 0.1, yellow, xform(2.16, 2.48, 0.65, 0, 0, HALF_PI), 14);
  },

  rebootvan: (b) => {
    const body = 0x2f6fbf;
    const bodyLight = 0x4595ea;
    const bodyDark = 0x1d4a7a;
    const white = 0xf7f7f4;
    const glass = 0x8cc6ec;
    const iron = 0x2a2e3a;
    const yellow = 0xffd23f;
    const cyan = 0x19d8ff;

    // Main van body
    b.rbox(2.2, 1.6, 5.2, 0.12, bodyDark, xform(0, 1.15, 0), bodyLight, 2);
    // Cab front
    b.rbox(2.1, 1.1, 1.2, 0.1, bodyDark, xform(0, 0.95, 2.9), body, 2);
    // Windshield
    b.rbox(1.9, 0.7, 0.08, 0.03, glass, xform(0, 1.35, 3.48, -0.25, 0, 0), 0xbbe2fb, 1);
    // Side windows
    for (const sx of [-1, 1]) {
      b.rbox(0.06, 0.55, 1.6, 0.02, glass, xform(sx * 1.11, 1.5, -0.8), 0xbbe2fb, 1);
    }
    // White stripe
    b.rbox(2.24, 0.3, 5.24, 0.02, white, xform(0, 1.55, 0), 0xffffff, 1);
    // Reboot symbol (cross) on side
    for (const sx of [-1, 1]) {
      b.rbox(0.08, 0.7, 0.22, 0.02, cyan, xform(sx * 1.12, 1.15, 0.5), 0xb8f7ff, 1);
      b.rbox(0.08, 0.22, 0.7, 0.02, cyan, xform(sx * 1.12, 1.15, 0.5), 0xb8f7ff, 1);
    }
    // Roof equipment
    b.rbox(1.4, 0.25, 2.2, 0.06, iron, xform(0, 2.05, -0.5), 0x3b434e, 1);
    b.cyl(0.06, 0.06, 0.8, iron, xform(0.5, 2.5, -0.5), 8);
    b.sphere(0.12, cyan, xform(0.5, 2.92, -0.5), 10, 8);
    // Wheels
    for (const wx of [-1.05, 1.05]) {
      for (const wz of [-1.8, 1.8]) {
        b.cyl(0.42, 0.42, 0.3, iron, xform(wx, 0.42, wz, 0, 0, HALF_PI), 14);
        b.cyl(0.2, 0.2, 0.32, 0x8a8f98, xform(wx, 0.42, wz, 0, 0, HALF_PI), 10);
      }
    }
    // Headlights
    for (const sx of [-1, 1]) {
      b.rbox(0.35, 0.18, 0.06, 0.02, yellow, xform(sx * 0.7, 0.85, 3.52), 0xfff2b0, 1);
    }
    // Rear reboot pad
    b.rbox(1.8, 0.08, 1.0, 0.02, cyan, xform(0, 0.35, -3.0), 0xb8f7ff, 1);
  },

  cafe: (b, variant = 0) => {
    const palettes = [
      [0xe8433a, 0xf7f7f4], // 0: Red & White
      [0x2f7fd8, 0xf7f7f4], // 1: Blue & White
      [0x2e9e57, 0xf7f7f4], // 2: Green & White
    ];
    const [umbA, umbB] = palettes[variant % palettes.length];
    const iron = 0x3b434e;
    const cream = 0xfff6e5;
    const wood = 0xb88450;

    // Bistro table at origin
    b.cyl(0.26, 0.3, 0.06, iron, xform(0, 0.03, 0), 12);
    b.cyl(0.045, 0.055, 0.72, iron, xform(0, 0.38, 0), 8);
    b.cyl(0.54, 0.52, 0.05, cream, xform(0, 0.75, 0), 16, 0xffffff);
    b.torus(0.53, 0.022, iron, xform(0, 0.75, 0, HALF_PI, 0, 0), 6, 18);

    // Two coffee cups & saucers on table
    for (const sx of [-1, 1]) {
      b.cyl(0.08, 0.06, 0.015, 0xffffff, xform(sx * 0.22, 0.785, 0.1 * sx), 10);
      b.cyl(0.048, 0.038, 0.065, umbA, xform(sx * 0.22, 0.82, 0.1 * sx), 10, 0xffffff);
    }

    // Two bistro chairs at x = -0.82 and x = +0.82 facing center
    for (const sx of [-1, 1]) {
      const cx = sx * 0.82;
      b.rbox(0.42, 0.045, 0.42, 0.04, wood, xform(cx, 0.45, 0), cream, 1);
      for (const lx of [-0.16, 0.16]) {
        for (const lz of [-0.16, 0.16]) {
          strutCyl(b, [cx + lx * 1.15, 0, lz * 1.15], [cx + lx, 0.44, lz], 0.02, iron, 5);
        }
      }
      // Chair backrest
      for (const bz of [-0.16, 0.16]) {
        strutCyl(b, [cx + sx * 0.18, 0.45, bz], [cx + sx * 0.24, 0.88, bz], 0.02, iron, 5);
      }
      b.rbox(0.045, 0.22, 0.42, 0.03, umbA, xform(cx + sx * 0.23, 0.78, 0), shadeHex(umbA, 1.15), 1);
    }

    // Central umbrella pole & 8-panel striped canopy (r = 1.28, y up to 2.5)
    b.cyl(0.032, 0.036, 2.42, iron, xform(0, 1.21, 0), 8);
    const segs = 8;
    const rad = 1.28;
    const apex = [0, 2.44, 0];
    const tmA = new TriMeshBuilder();
    const tmB = new TriMeshBuilder();
    const tmUnder = new TriMeshBuilder();
    for (let i = 0; i < segs; i++) {
      const a0 = (i / segs) * TWO_PI;
      const a1 = ((i + 1) / segs) * TWO_PI;
      const p0 = [Math.sin(a0) * rad, 1.94, Math.cos(a0) * rad];
      const p1 = [Math.sin(a1) * rad, 1.94, Math.cos(a1) * rad];
      const v0 = [p0[0], 1.82, p0[2]];
      const v1 = [p1[0], 1.82, p1[2]];
      const target = i % 2 === 0 ? tmA : tmB;
      target.tri(apex, p0, p1).quad(p0, v0, v1, p1);
      tmUnder.tri(apex, p1, p0).quad(v0, p0, p1, v1);
    }
    b.add(tmA.geo(), shadeHex(umbA, 0.9), undefined, umbA);
    b.add(tmB.geo(), shadeHex(umbB, 0.9), undefined, umbB);
    b.add(tmUnder.geo(), 0xd8d3c8);
    b.sphere(0.065, iron, xform(0, 2.47, 0), 8, 6);
  },

  planter: (b) => {
    const stoneDark = 0xb8b2a6;
    const stoneLight = 0xf6ecd8;
    const soil = 0x5c3d24;
    const leafDark = 0x3b9424;
    const leafBright = 0x62c93c;
    const flowers = [0xff6fa5, 0xffd23f, 0xffffff];

    // Molded square stone planter box [-1.15..1.15, 0..0.72]
    b.box(2.26, 0.14, 2.26, stoneDark, xform(0, 0.07, 0), stoneLight);
    b.rbox(2.12, 0.5, 2.12, 0.05, stoneDark, xform(0, 0.37, 0), stoneLight, 1);
    b.rbox(2.32, 0.12, 2.32, 0.04, stoneDark, xform(0, 0.66, 0), stoneLight, 1);
    // Soil bed
    b.box(1.94, 0.08, 1.94, soil, xform(0, 0.66, 0));

    // Sculpted ornamental shrub + central topiary stem (up to y = 1.97)
    b.cyl(0.09, 0.13, 0.62, 0x6b4a2e, xform(0, 0.95, 0), 7);
    const puffs = [
      [0, 1.48, 0, 0.52],
      [0, 1.72, 0, 0.34],
      [-0.52, 0.96, -0.48, 0.38],
      [0.54, 0.98, -0.46, 0.36],
      [-0.48, 0.95, 0.52, 0.37],
      [0.5, 0.97, 0.5, 0.39],
      [0, 1.04, 0.56, 0.34],
      [0, 1.02, -0.56, 0.34],
      [-0.58, 1.0, 0, 0.34],
      [0.58, 1.0, 0, 0.34],
    ];
    for (const [px, py, pz, pr] of puffs) {
      b.ico(pr, leafDark, xform(px, py, pz), 1, leafBright);
    }
    // Colorful flower blossoms around the bush skirt
    for (let i = 0; i < 15; i++) {
      const ang = (i / 15) * TWO_PI;
      const rad = i % 2 === 0 ? 0.72 : 0.42;
      const fy = i % 2 === 0 ? 0.96 : 1.38;
      b.sphere(
        0.09,
        flowers[i % flowers.length],
        xform(Math.cos(ang) * rad, fy, Math.sin(ang) * rad),
        7,
        5
      );
    }
  },

  plazalamp: (b) => {
    const iron = 0x232b35;
    const ironLight = 0x3b4654;
    const gold = 0xf0b938;
    const glow = 0xfff6d8;

    // Fluted boulevard base + central shaft
    b.cyl(0.26, 0.33, 0.22, iron, xform(0, 0.11, 0), 10, ironLight);
    b.cyl(0.16, 0.24, 0.65, iron, xform(0, 0.54, 0), 10, ironLight);
    b.torus(0.17, 0.035, gold, xform(0, 0.88, 0, HALF_PI, 0, 0), 6, 14);
    b.cyl(0.068, 0.11, 2.95, iron, xform(0, 2.35, 0), 10, ironLight);
    b.torus(0.095, 0.03, gold, xform(0, 3.65, 0, HALF_PI, 0, 0), 6, 12);
    b.cone(0.09, 0.36, gold, xform(0, 4.02, 0), 8);

    // Twin scrolled arms & warm-glowing boulevard globes (x = -0.82, +0.82, y up to 4.55)
    for (const sx of [-1, 1]) {
      strutCyl(b, [0, 3.55, 0], [sx * 0.82, 3.88, 0], 0.035, iron, 6);
      strutCyl(b, [0, 3.15, 0], [sx * 0.56, 3.72, 0], 0.024, gold, 6);
      // Lantern cradle, glowing glass globe & brass cap
      b.cyl(0.14, 0.08, 0.12, iron, xform(sx * 0.82, 3.94, 0), 8, gold);
      b.sphere(0.24, glow, xform(sx * 0.82, 4.18, 0, 0, 0, 0, 0.92, 1.12, 0.92), 12, 10, 0xffffff);
      b.cone(0.22, 0.18, iron, xform(sx * 0.82, 4.44, 0), 8, gold);
      b.sphere(0.045, gold, xform(sx * 0.82, 4.53, 0), 6, 5);
    }
  },

  kiosk: (b) => {
    const greenDark = 0x1f4730;
    const green = 0x2e9e57;
    const white = 0xf7f7f4;
    const counterCol = 0xe8dfd0;
    const red = 0xe8433a;
    const blue = 0x5ab4ff;
    const yellow = 0xffd23f;

    // Kiosk base & lower counter walls [-1.35..1.35, 0..2.32, -0.88..0.88]
    b.box(2.76, 0.14, 1.8, 0x3b424c, xform(0, 0.07, 0));
    b.rbox(2.64, 1.02, 1.68, 0.04, greenDark, xform(0, 0.62, 0), green, 1);
    // Vertical white beadboard stripes on lower front
    for (let x = -1.1; x <= 1.11; x += 0.275) {
      b.box(0.11, 0.82, 0.04, white, xform(x, 0.6, 0.84));
    }
    // Back wall + corner mullions + interior shelves
    b.box(2.64, 1.25, 0.14, greenDark, xform(0, 1.72, -0.77), green);
    b.box(0.16, 1.25, 1.68, greenDark, xform(-1.24, 1.72, 0), green);
    b.box(0.16, 1.25, 1.68, greenDark, xform(1.24, 1.72, 0), green);
    // Protruding front customer counter
    b.rbox(2.84, 0.09, 0.42, 0.03, shadeHex(counterCol, 0.86), xform(0, 1.12, 0.82), white, 1);

    // Colorful drinks & magazine display inside
    const itemCols = [red, blue, yellow, 0xff6fa5, white];
    for (let row = 0; row < 2; row++) {
      const sy = 1.38 + row * 0.42;
      b.box(2.2, 0.05, 0.34, white, xform(0, sy, -0.52));
      for (let k = 0; k < 7; k++) {
        const ix = -0.9 + k * 0.3;
        b.rbox(
          0.2,
          0.28,
          0.18,
          0.03,
          itemCols[(k + row * 2) % itemCols.length],
          xform(ix, sy + 0.17, -0.5),
          white,
          1
        );
      }
    }

    // Overhanging striped roof & front canopy (y = 2.25..2.66, z = -0.9..1.45)
    b.rbox(2.92, 0.2, 1.88, 0.05, greenDark, xform(0, 2.4, -0.02), green, 1);
    const stripes = 7;
    const sw = 2.84 / stripes;
    for (let i = 0; i < stripes; i++) {
      const col = i % 2 === 0 ? green : white;
      const sx = -1.42 + (i + 0.5) * sw;
      b.box(sw * 0.98, 0.08, 0.72, shadeHex(col, 0.88), xform(sx, 2.28, 1.08, 0.28, 0, 0), col);
      b.rbox(sw * 0.95, 0.16, 0.04, 0.03, col, xform(sx, 2.12, 1.42), white, 1);
    }
    // Header sign board
    b.rbox(2.1, 0.32, 0.1, 0.04, yellow, xform(0, 2.54, 0.88), 0xfff2a6, 1);
    b.box(1.75, 0.14, 0.12, red, xform(0, 2.54, 0.89));
  },

  bollard: (b) => {
    const iron = 0x242c36;
    const ironLight = 0x3b4654;
    const gold = 0xf0b938;

    b.cyl(0.19, 0.21, 0.08, iron, xform(0, 0.04, 0), 12, ironLight);
    b.cyl(0.145, 0.165, 0.78, iron, xform(0, 0.46, 0), 12, ironLight);
    b.cyl(0.152, 0.152, 0.065, gold, xform(0, 0.68, 0), 12, 0xffe07d);
    b.cyl(0.154, 0.154, 0.045, gold, xform(0, 0.54, 0), 12, 0xffe07d);
    b.sphere(0.145, ironLight, xform(0, 0.85, 0, 0, 0, 0, 1, 0.85, 1), 12, 8, iron);
    b.torus(0.148, 0.018, ironLight, xform(0, 0.84, 0, HALF_PI, 0, 0), 6, 12);
  },
};

export function isTownKitProp(id) {
  return Object.prototype.hasOwnProperty.call(TOWN_KIT_BUILDERS, id);
}
