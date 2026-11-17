import { makePickaxe, makeGlider, applyWeaponWrap } from './cosmetics.js';
import { openLiveEvent } from './liveEvent.js';
import { OnlineMatch } from './multiplayer.js';
import { chapter3Sites } from './chapter3.js';
import { chapter4Sites } from './chapter4.js';
import {
  AmbientLight as Ic,
  Bone as Gi,
  Box3 as ir,
  BoxGeometry as La,
  BufferAttribute as Dr,
  BufferGeometry as Hr,
  CanvasTexture as Na,
  CapsuleGeometry as Ra,
  CircleGeometry as za,
  ClampToEdgeWrapping as n,
  Color as B,
  ConeGeometry as Va,
  CylinderGeometry as Ba,
  DataTexture as Ki,
  DataUtils as Cr,
  DepthTexture as Pa,
  DirectionalLight as Fc,
  DynamicDrawUsage as Je,
  EdgesGeometry as qa,
  Euler as gn,
  Float32BufferAttribute as V,
  FloatType as g,
  FogExp2 as Hn,
  Group as Pn,
  HalfFloatType as _,
  HemisphereLight as gc,
  InstancedBufferAttribute as Xi,
  InstancedBufferGeometry as Rc,
  InstancedMesh as ia,
  IcosahedronGeometry as fs,
  LatheGeometry as ps,
  LineBasicMaterial as da,
  LineSegments as Ca,
  LinearFilter as s,
  NearestFilter as perfNearest,
  LinearMipmapLinearFilter as l,
  Matrix3 as zt,
  Matrix4 as z,
  Mesh as Mi,
  MeshBasicMaterial as bi,
  MeshLambertMaterial as As,
  MeshStandardMaterial as Os,
  Object3D as Nn,
  OrthographicCamera as Nc,
  PMREMGenerator as Ol,
  PerspectiveCamera as Oc,
  PlaneGeometry as ms,
  PointLight as Mc,
  Quaternion as It,
  RGBAFormat as T,
  RepeatWrapping as t,
  RingGeometry as hs,
  SRGBColorSpace as He,
  Scene as Un,
  ShaderMaterial as Es,
  Shape as To,
  ShapeGeometry as ls,
  Skeleton as Yi,
  SkinnedMesh as Wi,
  Sphere as Pr,
  SphereGeometry as gs,
  Sprite as pi,
  SpriteMaterial as $r,
  Timer as Gc,
  TorusGeometry as _s,
  Uint8BufferAttribute as Or,
  UniformsLib as H,
  UniformsUtils as Cs,
  Vector2 as L,
  Vector3 as R,
  WebGLRenderTarget as rn,
  WebGLRenderer as vf
} from "three";
import { GeoBuilder } from "./models/geoBuilder.js";
import { TOWN_KIT_BUILDERS } from "./models/townKit.js";
import { getProceduralCharacterParts, buildBlueprintTabletGeo } from "./models/characters.js";
// Battle Pass tiers (100 tiers)
var bpTiers = [];
{
  let types = [`skin`, `bbucks`, `glider`, `pickaxe`, `skin`, `bbucks`, `wrap`, `skin`, `bbucks`, `glider`];
  let names = [`Nova`, `100 B-Bucks`, `Skyfall Glider`, `Nova Axe`, `Vortex`, `100 B-Bucks`, `Neon Wrap`, `Phoenix`, `100 B-Bucks`, `Storm Glider`];
  let ids = [`nova`, `bbucks`, `sky`, `axe`, `vortex`, `bbucks`, `camo`, `phoenix`, `bbucks`, `cloud`];
  for (let i = 0; i < 100; i++) {
    bpTiers.push({ type: types[i % types.length], name: names[i % names.length], id: ids[i % ids.length] });
  }
}
const legacyBattlePassTiers=bpTiers.slice();
const chapterFourOutfits=[`starlight`,`oathguard`,`moonrunner`,`frostknight`,`dustrider`,`dreamer`,`riftwarden`,`eternalknight`,`nova`,`lunar`,`shade`,`valor`,`phoenix`,`storm`,`ghost`,`aurora`,`ember`,`vortex`,`solar`,`mirage`];
bpTiers=Array.from({length:100},(_,i)=>{const tier=i+1;if(tier%5===1){const id=chapterFourOutfits[Math.floor(i/5)];return {type:`skin`,id,name:id.replace(/([a-z])([A-Z])/g,`$1 $2`).toUpperCase()};}if(tier%5===0)return {type:`bbucks`,id:`bbucks`,name:`100 B-BUCKS`};const reward=[{type:`wrap`,id:`galaxy`,name:`RIFT WRAP`},{type:`glider`,id:`cloud`,name:`CLOUD GLIDER`},{type:`pickaxe`,id:`hammer`,name:`OATH HAMMER`}][(tier-2)%5];return reward||{type:`bbucks`,id:`bbucks`,name:`100 B-BUCKS`};});
var yf = { master: 0.8, sfx: 0.9, ambience: 0.6, ui: 0.7, sensitivity: 1, adsSensitivity: 0.7, fov: 80, quality: `high`, shadows: true, bloom: true, renderScale: 1, invertY: false, showFps: true, difficulty: `normal`, botCount: 99, skin: `ranger`, damageNumbers: true, bbucks: 150, battlePassOwned: false, bpLevel: 1, bpClaimed: [], gameMode: `solo`, wrap: `default`, glider: `default`, pickaxe: `default`, friends: [], eventMode: `normal`, ranked: false, elo: 1000, rankedMatches: 0, stats: { matches: 0, wins: 0, kills: 0, damage: 0, deaths: 0 }, quests: { date: ``, list: [], claimed: [] }, shopDate: ``, shopOwned: [], partyCode: ``, partyMembers: [], music: true, aimAssist: 0.5, performanceMode: false, hudColor: `#ffffff`, hudScale: 1, colorblind: `off`, shakeScale: 1, hudContrast: false, editConfirmOnRelease: false, editResetOnRelease: false, bpXp: 0, keybinds: { forward: `KeyW`, back: `KeyS`, left: `KeyA`, right: `KeyD`, jump: `Space`, sprint: `ShiftLeft`, crouch: `KeyZ`, interact: `KeyE`, reload: `KeyR`, wall: `KeyQ`, floor: `KeyC`, stairs: `KeyF`, roof: `KeyV`, pad: `KeyT`, switchMat: `KeyX`, edit: `KeyG`, inventory: `KeyI`, map: `Tab`, emote: `KeyB`, cheats: `KeyP`, inspect: `KeyH`, ping: `KeyK`, chat: `Enter` } }, bf = { god: false, aimbot: false, infiniteAmmo: false, infiniteMats: false, noReload: false, oneShot: false, speed: false, superJump: false, fly: false, esp: false, noStorm: false, freezeBots: false }, xf = `skydrop-royale-settings-v1`, Sf = new class {
  s = { ...yf };
  cheats = { ...bf };
  listeners = [];
  constructor() {
    try {
      let e4 = localStorage.getItem(xf);
      e4 && Object.assign(this.s, JSON.parse(e4));
      // Ensure new fields have defaults (for old saved settings)
      if (!this.s.stats || typeof this.s.stats !== `object`) this.s.stats = { matches: 0, wins: 0, kills: 0, damage: 0, deaths: 0 };
      if (!this.s.quests || typeof this.s.quests !== `object`) this.s.quests = { date: ``, list: [], claimed: [] };
      if (!Array.isArray(this.s.shopOwned)) this.s.shopOwned = [];
      if (!Array.isArray(this.s.partyMembers)) this.s.partyMembers = [];
      if (typeof this.s.partyCode !== `string`) this.s.partyCode = ``;
      if (typeof this.s.shopDate !== `string`) this.s.shopDate = ``;
      if (typeof this.s.eventMode !== `string`) this.s.eventMode = `normal`;
      if (typeof this.s.elo !== `number`) this.s.elo = 1000;
      if (typeof this.s.rankedMatches !== `number`) this.s.rankedMatches = 0;
      if (typeof this.s.ranked !== `boolean`) this.s.ranked = false;
      if (typeof this.s.music !== `boolean`) this.s.music = true;
      if(this.s.seasonId!==`chapter4-season1`) {
        const earned=(this.s.battlePassOwned&&Array.isArray(this.s.bpClaimed)?this.s.bpClaimed:[]).map(n=>legacyBattlePassTiers[n-1]).filter(it=>it&&it.type!==`bbucks`).map(it=>it.id);
        this.s.shopOwned=[...new Set([...(this.s.shopOwned||[]),...earned,this.s.skin].filter(Boolean))];
        this.s.bpLevel=1;this.s.bpXp=0;this.s.bpClaimed=[];this.s.battlePassOwned=false;this.s.weeklyClaimed=[];this.s.quests={date:``,list:[],claimed:[]};this.s.seasonId=`chapter4-season1`;
        try {localStorage.setItem(xf,JSON.stringify(this.s));}catch{}
      }
    } catch {
    }
  }
  set(e4, t2) {
    this.s[e4] = t2;
    try {
      localStorage.setItem(xf, JSON.stringify(this.s));
    } catch {
    }
    for (let n2 of this.listeners) n2(e4, t2);
  }
  save() {
    try {
      localStorage.setItem(xf, JSON.stringify(this.s));
    } catch {
    }
  }
  setCheat(e4, t2) {
    this.cheats[e4] = t2;
    for (let n2 of this.listeners) n2(e4, t2);
  }
  onChange(e4) {
    this.listeners.push(e4);
  }
}(), Cf = 28, wf = 30, Tf = 14, Ef = 1.6, Df = 240, Of = 0.62, kf = 25, Af = 0.4, jf = 1.6, Mf = 2.5, Nf = 0.1, Pf = 2500, Ff = 4, If = 0.5, Lf = { wind: 1, birds: 1, storm: 1, rain: 1, skydive: 1, glide: 1, bus: 1, chest: 1, surf: 1, town: 1, alpine: 1, forest: 1, meadow: 1 }, Rf = () => {
}, U = (e4, t2) => e4 + Math.random() * (t2 - e4), zf = (e4, t2, n2) => e4 < t2 ? t2 : e4 > n2 ? n2 : e4, Bf = (e4) => e4[Math.floor(Math.random() * e4.length)], Vf = (e4, t2) => typeof e4 == `number` && Number.isFinite(e4) ? e4 : t2, Hf = (e4) => typeof e4 == `number` && Number.isFinite(e4) ? zf(e4, 0, 1) : 0, Uf = (e4) => zf((Df - e4) / 30, 0, 1) / (1 + (Math.max(e4, 0) / Tf) ** +Ef);
function Wf(e4) {
  try {
    let t2 = e4;
    if (t2.state !== `running` && typeof t2.resume == `function`) {
      let e5 = t2.resume();
      e5 && typeof e5.catch == `function` && e5.catch(Rf);
    }
  } catch {
  }
}
function Gf(e4) {
  let t2 = e4.sampleRate, n2 = Math.floor(t2 * Ff), r = e4.createBuffer(1, n2, t2), i = r.getChannelData(0), a = If * Math.sqrt(3);
  for (let e5 = 0; e5 < n2; e5++) i[e5] = (Math.random() * 2 - 1) * a;
  let o = Math.floor(t2 * 0.25), s2 = new Float32Array(n2 + o), c = 0, l2 = 0, u = 0, d = 0, f = 0, p = 0, m = 0;
  for (let e5 = -4096; e5 < s2.length; e5++) {
    let t3 = Math.random() * 2 - 1;
    c = 0.99886 * c + t3 * 0.0555179, l2 = 0.99332 * l2 + t3 * 0.0750759, u = 0.969 * u + t3 * 0.153852, d = 0.8665 * d + t3 * 0.3104856, f = 0.55 * f + t3 * 0.5329522, p = -0.7616 * p - t3 * 0.016898;
    let n3 = c + l2 + u + d + f + p + m + t3 * 0.5362;
    m = t3 * 0.115926, e5 >= 0 && (s2[e5] = n3);
  }
  let h = e4.createBuffer(1, n2, t2), g2 = h.getChannelData(0), _2 = 0;
  for (let e5 = 0; e5 < n2; e5++) {
    let t3 = s2[e5];
    if (e5 < o) {
      let r2 = e5 / o * (Math.PI / 2);
      t3 = t3 * Math.sin(r2) + s2[n2 + e5] * Math.cos(r2);
    }
    g2[e5] = t3, _2 += t3 * t3;
  }
  let v = If / Math.sqrt(_2 / n2 || 1);
  for (let e5 = 0; e5 < n2; e5++) g2[e5] *= v;
  return { white: r, pink: h };
}
function Kf(e4, t2) {
  let n2 = e4.sampleRate, r = Math.floor(n2 * t2), i = e4.createBuffer(2, r, n2), a = Math.floor(n2 * 0.014), o = [[[0.083, 0.55], [0.171, 0.38], [0.293, 0.25], [0.452, 0.15]], [[0.097, 0.52], [0.189, 0.36], [0.317, 0.23], [0.481, 0.14]]];
  for (let e5 = 0; e5 < 2; e5++) {
    let t3 = i.getChannelData(e5), s2 = 0;
    for (let e6 = a; e6 < r; e6++) {
      let i2 = (e6 - a) / (r - a), o2 = Math.exp(-6.2 * i2) * (1 - i2), c2 = Math.min(1, (e6 - a) / (n2 * 0.03)), l2 = 0.6 - 0.48 * i2;
      s2 += l2 * (Math.random() * 2 - 1 - s2), t3[e6] = s2 * o2 * (0.35 + 0.65 * c2);
    }
    let c = Math.floor(n2 * 4e-3);
    for (let [i2, a2] of o[e5]) {
      let e6 = Math.floor(n2 * i2);
      for (let n3 = 0; n3 < c && e6 + n3 < r; n3++) t3[e6 + n3] += (Math.random() * 2 - 1) * a2 * (1 - n3 / c);
    }
  }
  return i;
}
function qf(e4, t2, n2, r, i) {
  let a = 1, o = Math.max(r, 0.1);
  if (e4 === `white`) t2 === `lowpass` ? a = n2 / i : t2 === `highpass` ? a = 1 - n2 / i : t2 === `bandpass` && (a = 1.571 * n2 / (o * i));
  else {
    let e5 = Math.log2(i / 20);
    t2 === `lowpass` ? a = Math.log2(Math.max(n2, 25) / 20) / e5 : t2 === `highpass` ? a = Math.log2(i / Math.min(n2, i * 0.9)) / e5 : t2 === `bandpass` && (a = 2.27 / (o * e5));
  }
  return zf(a, 0.03, 1);
}
var Jf = [1, 1.483, 2.09, 2.756, 3.62, 4.41], Yf = [1, 2.01, 2.99, 4.18], Xf = class {
  end = 0.05;
  ctx;
  out;
  t;
  p;
  bufs;
  nyq;
  constructor(e4, t2, n2, r, i) {
    this.ctx = e4, this.bufs = t2, this.out = n2, this.t = r, this.p = i, this.nyq = e4.sampleRate / 2 - 100;
  }
  hz(e4) {
    return zf(e4 * this.p, 20, this.nyq);
  }
  env(e4, t2, n2, r, i, a, o) {
    let s2 = Math.max(a, 1e-4), c = t2 + n2, l2 = c + r + i;
    e4.setValueAtTime(0, t2), e4.linearRampToValueAtTime(s2, c), r > 0 && e4.setValueAtTime(s2, c + r), o ? e4.linearRampToValueAtTime(0, l2) : (e4.exponentialRampToValueAtTime(Math.max(s2 * 1e-3, 1e-5), l2), e4.linearRampToValueAtTime(0, l2 + 0.012));
    let u = l2 + 0.03;
    return u - this.t > this.end && (this.end = u - this.t), u;
  }
  tone(e4) {
    let t2 = this.ctx, n2 = this.t + (e4.at ?? 0), r = e4.a ?? 3e-3, i = e4.hold ?? 0, a = r + i + e4.d, o = t2.createOscillator();
    o.type = e4.type ?? `sine`, o.frequency.setValueAtTime(this.hz(e4.f), n2), e4.f2 !== void 0 && o.frequency.exponentialRampToValueAtTime(this.hz(e4.f2), n2 + (e4.ft ?? a)), e4.det !== void 0 && (o.detune.value = e4.det);
    let s2 = t2.createGain(), c = this.env(s2.gain, n2, r, i, e4.d, e4.g, e4.lin), l2 = o;
    if (e4.lp !== void 0) {
      let r2 = t2.createBiquadFilter();
      r2.type = `lowpass`, r2.Q.value = e4.lq ?? 0, r2.frequency.setValueAtTime(this.hz(e4.lp), n2), e4.lp2 !== void 0 && r2.frequency.exponentialRampToValueAtTime(this.hz(e4.lp2), n2 + a), l2.connect(r2), l2 = r2;
    }
    if (l2.connect(s2), s2.connect(this.out), e4.vib) {
      let r2 = t2.createOscillator(), i2 = t2.createGain();
      r2.frequency.value = e4.vib[0], i2.gain.value = e4.vib[1] * this.p, r2.connect(i2), i2.connect(o.frequency), r2.start(n2), r2.stop(c);
    }
    o.start(n2), o.stop(c);
  }
  noise(e4) {
    let t2 = this.ctx, n2 = this.t + (e4.at ?? 0), r = e4.a ?? 2e-3, i = e4.hold ?? 0, a = r + i + e4.d, o = e4.kind ?? `white`, s2 = o === `pink` ? this.bufs.pink : this.bufs.white, c = t2.createBufferSource();
    c.buffer = s2, c.loop = true, c.playbackRate.value = zf((e4.rate ?? 1) * this.p, 0.25, 4);
    let l2 = c, u = 1;
    if (e4.f !== void 0) {
      let r2 = e4.ft ?? `lowpass`, i2 = e4.q ?? +(r2 === `bandpass`), s3 = t2.createBiquadFilter();
      s3.type = r2, s3.Q.value = i2, s3.frequency.setValueAtTime(this.hz(e4.f), n2), e4.f2 !== void 0 && s3.frequency.exponentialRampToValueAtTime(this.hz(e4.f2), n2 + (e4.fd ?? a));
      let c2 = e4.f2 === void 0 ? e4.f : Math.sqrt(e4.f * e4.f2);
      u = qf(o, r2, this.hz(c2), i2, this.nyq), l2.connect(s3), l2 = s3;
    }
    let d = t2.createGain(), f = this.env(d.gain, n2, r, i, e4.d, e4.g / Math.sqrt(u), e4.lin);
    l2.connect(d), d.connect(this.out), c.start(n2, Math.random() * (s2.duration - 0.1)), c.stop(f);
  }
  ring(e4, t2, n2, r, i = 0) {
    for (let a = 0; a < t2.length; a++) this.tone({ at: i, f: e4 * t2[a], type: a === 0 ? `triangle` : `sine`, a: 1e-3, d: n2 / (1 + a * 0.45), g: r / (1 + a * 0.7) });
  }
  punch(e4, t2 = 240, n2 = 55) {
    this.tone({ f: t2, f2: n2, ft: 0.028, a: 6e-4, d: 0.09, g: e4 }), this.noise({ ft: `highpass`, f: 5200, a: 4e-4, d: 6e-3, g: e4 * 0.35 });
  }
  clack(e4, t2, n2) {
    this.noise({ at: e4, ft: `bandpass`, f: t2, q: 3, a: 1e-3, d: 0.035, g: n2 }), this.noise({ at: e4, ft: `highpass`, f: t2 * 2.5, a: 1e-3, d: 0.012, g: n2 * 0.5 }), this.tone({ at: e4, type: `triangle`, f: t2 * 1.4, f2: t2 * 0.9, a: 1e-3, d: 0.025, g: n2 * 0.3 });
  }
  brass(e4, t2, n2, r, i, a = 1) {
    let o = this.ctx, s2 = this.t + e4, c = 0.018, l2 = (e5) => zf(e5 * a * this.p, 120, this.nyq), u = o.createBiquadFilter();
    u.type = `lowpass`, u.Q.value = 3, u.frequency.setValueAtTime(l2(400 + t2 * 0.6), s2), u.frequency.exponentialRampToValueAtTime(l2(1500 + t2 * 3.4), s2 + 0.045), u.frequency.exponentialRampToValueAtTime(l2(1e3 + t2 * 2), s2 + 0.2), u.frequency.exponentialRampToValueAtTime(l2(500 + t2), Math.max(s2 + 0.26, s2 + c + n2 + r));
    let d = o.createGain(), f = this.env(d.gain, s2, c, n2, r, i, false);
    u.connect(d), d.connect(this.out);
    for (let [e5, n3, r2] of [[`sawtooth`, -7, 0.42], [`sawtooth`, 6, 0.42], [`square`, 0, 0.2]]) {
      let i2 = o.createOscillator();
      i2.type = e5, i2.frequency.value = this.hz(t2), i2.detune.value = n3;
      let a2 = o.createGain();
      a2.gain.value = r2, i2.connect(a2), a2.connect(u), i2.start(s2), i2.stop(f);
    }
  }
}, Zf = 523.25, Qf = 659.25, $f = 783.99, ep = 1046.5, tp = 1318.51, np = 1567.98, rp = 2093, ip = [2093, 2637, 3136, 4186, 5274];
function ap(e4, t2) {
  e4.tone({ f: 155, f2: 60, ft: 0.07, a: 2e-3, d: 0.22, g: 0.55 }), e4.noise({ kind: `pink`, f: 520, a: 2e-3, d: 0.1, g: 0.3 });
  for (let n3 = 0; n3 < 5; n3++) {
    let r = 0.028 + n3 * 0.021, i = 1 + n3 * 0.075, a = 1 - n3 * 0.1;
    t2 === 0 ? (e4.tone({ at: r, f: 430 * i, f2: 300 * i, a: 1e-3, d: 0.03, g: 0.2 * a }), e4.noise({ at: r, ft: `bandpass`, f: 1100 * i, q: 3, a: 1e-3, d: 0.018, g: 0.16 * a })) : t2 === 1 ? (e4.noise({ at: r, ft: `bandpass`, f: 2700 * i, q: 4, a: 1e-3, d: 0.022, g: 0.2 * a }), e4.tone({ at: r, type: `triangle`, f: 1500 * i, a: 1e-3, d: 0.02, g: 0.06 * a })) : (e4.ring(1250 * i, [1, 2.41], 0.07, 0.09 * a, r), e4.noise({ at: r, ft: `highpass`, f: 4200, a: 1e-3, d: 0.012, g: 0.09 * a }));
  }
  let n2 = 0.145;
  t2 === 0 ? (e4.tone({ at: n2, f: 270, f2: 185, a: 1e-3, d: 0.09, g: 0.3 }), e4.noise({ at: n2, ft: `bandpass`, f: 850, q: 2, a: 1e-3, d: 0.04, g: 0.16 })) : t2 === 1 ? (e4.tone({ at: n2, f: 190, f2: 120, a: 1e-3, d: 0.08, g: 0.3 }), e4.noise({ at: n2, ft: `bandpass`, f: 3200, q: 3, a: 1e-3, d: 0.045, g: 0.18 })) : (e4.ring(620, Jf, 0.3, 0.14, n2), e4.tone({ at: n2, f: 170, f2: 110, a: 1e-3, d: 0.07, g: 0.25 }));
}
var op = { shot_ar: { rev: 0.24, jit: true, gain: 0.85, fn: (e4) => {
  e4.punch(0.3, 250, 62), e4.noise({ ft: `bandpass`, f: 1750, q: 0.8, a: 1e-3, d: 0.1, g: 0.5 }), e4.noise({ ft: `highpass`, f: 3400, a: 1e-3, d: 0.03, g: 0.22 }), e4.noise({ kind: `pink`, f: 1100, a: 2e-3, d: 0.15, g: 0.3 }), e4.tone({ f: 175, f2: 88, ft: 0.045, a: 1e-3, d: 0.14, g: 0.62 }), e4.tone({ type: `triangle`, f: 430, f2: 190, a: 1e-3, d: 0.06, g: 0.16 });
} }, shot_smg: { rev: 0.18, jit: true, gain: 0.8, fn: (e4) => {
  e4.punch(0.2, 300, 80), e4.noise({ ft: `bandpass`, f: 2700, q: 0.9, a: 1e-3, d: 0.06, g: 0.42 }), e4.noise({ ft: `highpass`, f: 4800, a: 1e-3, d: 0.02, g: 0.16 }), e4.tone({ f: 250, f2: 135, ft: 0.03, a: 1e-3, d: 0.07, g: 0.36 }), e4.tone({ type: `square`, f: 640, f2: 320, a: 1e-3, d: 0.03, g: 0.06, lp: 2600 });
} }, shot_pulse: { rev: 0.18, jit: true, gain: 0.8, fn: (e4) => {
  e4.punch(0.2, 300, 80), e4.noise({ ft: `bandpass`, f: 3100, q: 0.9, a: 1e-3, d: 0.05, g: 0.42 }), e4.noise({ ft: `highpass`, f: 5200, a: 1e-3, d: 0.02, g: 0.16 }), e4.tone({ f: 280, f2: 150, ft: 0.03, a: 1e-3, d: 0.06, g: 0.36 }), e4.tone({ type: `square`, f: 720, f2: 360, a: 1e-3, d: 0.03, g: 0.06, lp: 2800 });
} }, shot_sky: { rev: 0.24, jit: true, gain: 0.85, fn: (e4) => {
  e4.punch(0.2, 300, 80), e4.noise({ ft: `bandpass`, f: 2300, q: 0.9, a: 1e-3, d: 0.07, g: 0.44 }), e4.noise({ ft: `highpass`, f: 4400, a: 1e-3, d: 0.02, g: 0.16 }), e4.tone({ f: 230, f2: 120, ft: 0.03, a: 1e-3, d: 0.08, g: 0.38 }), e4.tone({ type: `square`, f: 580, f2: 290, a: 1e-3, d: 0.03, g: 0.06, lp: 2400 });
} }, shot_pump: { rev: 0.34, jit: true, gain: 0.9, fn: (e4) => {
  e4.punch(0.4, 220, 48), e4.noise({ ft: `highpass`, f: 3200, a: 1e-3, d: 0.035, g: 0.22 }), e4.noise({ ft: `bandpass`, f: 1250, q: 0.6, a: 1e-3, d: 0.14, g: 0.42 }), e4.noise({ kind: `pink`, f: 2800, f2: 420, fd: 0.22, a: 2e-3, d: 0.46, g: 0.6 }), e4.tone({ f: 135, f2: 46, ft: 0.17, a: 2e-3, d: 0.42, g: 0.72 }), e4.tone({ type: `triangle`, f: 270, f2: 95, a: 1e-3, d: 0.15, g: 0.24 });
} }, shot_sniper: { rev: 0.6, jit: true, gain: 0.9, fn: (e4) => {
  e4.punch(0.42, 240, 50), e4.noise({ ft: `highpass`, f: 2400, a: 8e-4, d: 0.05, g: 0.4 }), e4.noise({ ft: `bandpass`, f: 1500, q: 0.5, a: 1e-3, d: 0.17, g: 0.5 }), e4.noise({ kind: `pink`, f: 2200, f2: 260, fd: 0.8, a: 2e-3, d: 1.2, g: 0.36 }), e4.tone({ f: 200, f2: 52, ft: 0.12, a: 1e-3, d: 0.38, g: 0.78 }), e4.tone({ type: `triangle`, f: 520, f2: 140, a: 1e-3, d: 0.09, g: 0.2 });
  for (let [t2, n2, r] of [[0.21, 0.17, 1500], [0.43, 0.11, 1100], [0.7, 0.07, 800], [0.98, 0.04, 600]]) e4.noise({ kind: `pink`, at: t2, f: r, a: 0.012, d: 0.24, g: n2 }), e4.tone({ at: t2, f: 90, f2: 55, a: 0.01, d: 0.2, g: n2 * 0.8 });
} }, shot_pistol: { rev: 0.09, jit: true, gain: 0.85, fn: (e4) => {
  e4.punch(0.26, 320, 90), e4.noise({ ft: `bandpass`, f: 2200, q: 1.2, a: 1e-3, d: 0.05, g: 0.42 }), e4.noise({ ft: `highpass`, f: 4e3, a: 1e-3, d: 0.015, g: 0.12 }), e4.tone({ f: 340, f2: 150, ft: 0.03, a: 1e-3, d: 0.075, g: 0.5 }), e4.tone({ type: `triangle`, f: 920, f2: 420, a: 1e-3, d: 0.025, g: 0.12 });
} }, shot_rpg: { rev: 0.3, jit: true, gain: 0.85, fn: (e4) => {
  e4.tone({ f: 110, f2: 45, ft: 0.12, a: 2e-3, d: 0.3, g: 0.7 }), e4.noise({ kind: `pink`, f: 700, a: 2e-3, d: 0.16, g: 0.36 }), e4.noise({ ft: `bandpass`, f: 500, f2: 2600, fd: 0.35, q: 1.2, a: 0.04, hold: 0.1, d: 0.5, g: 0.4 }), e4.noise({ ft: `highpass`, f: 2500, a: 0.08, d: 0.45, g: 0.09 });
} }, explosion: { rev: 0.5, jit: true, gain: 0.8, fn: (e4) => {
  e4.tone({ f: 120, f2: 35, ft: 0.5, a: 2e-3, d: 1.1, g: 0.9 }), e4.tone({ type: `triangle`, f: 70, f2: 30, ft: 0.6, a: 4e-3, d: 0.9, g: 0.3 }), e4.noise({ kind: `pink`, f: 3200, f2: 180, fd: 0.9, a: 2e-3, d: 1.3, g: 0.6 }), e4.noise({ ft: `highpass`, f: 1800, a: 1e-3, d: 0.07, g: 0.3 });
  for (let t2 = 0; t2 < 14; t2++) {
    let t3 = 0.08 + Math.random() * 1;
    e4.noise({ at: t3, ft: `bandpass`, f: U(1200, 4200), q: 2.5, a: 1e-3, d: U(0.03, 0.08), g: 0.16 * (1 - t3 / 1.3) });
  }
} }, reload: { fn: (e4) => {
  e4.clack(0, 1500, 0.3), e4.noise({ at: 0.015, ft: `bandpass`, f: 3200, f2: 2200, q: 1.2, a: 0.02, d: 0.09, g: 0.07 }), e4.tone({ type: `square`, f: 300, f2: 200, a: 1e-3, d: 0.04, g: 0.06, lp: 1200 }), e4.clack(0.32, 1100, 0.34), e4.tone({ at: 0.32, f: 185, f2: 110, a: 1e-3, d: 0.07, g: 0.24 }), e4.clack(0.39, 2300, 0.18);
} }, pump_rack: { fn: (e4) => {
  e4.noise({ ft: `bandpass`, f: 1800, f2: 900, q: 1.6, a: 4e-3, d: 0.07, g: 0.3 }), e4.clack(0.055, 950, 0.32), e4.tone({ at: 0.055, f: 160, f2: 100, a: 1e-3, d: 0.05, g: 0.16 }), e4.noise({ at: 0.17, ft: `bandpass`, f: 950, f2: 2e3, q: 1.6, a: 4e-3, d: 0.06, g: 0.28 }), e4.clack(0.225, 1350, 0.36), e4.tone({ at: 0.225, f: 150, f2: 90, a: 1e-3, d: 0.06, g: 0.2 });
} }, empty: { fn: (e4) => {
  e4.clack(0, 2400, 0.22), e4.tone({ type: `square`, f: 1100, a: 1e-3, d: 0.012, g: 0.04 });
} }, swap: { fn: (e4) => {
  e4.noise({ kind: `pink`, ft: `bandpass`, f: 1400, q: 0.8, a: 0.012, d: 0.07, g: 0.14 }), e4.noise({ at: 0.05, ft: `bandpass`, f: 2600, q: 2, a: 1e-3, d: 0.02, g: 0.1 }), e4.tone({ at: 0.05, f: 260, f2: 180, a: 1e-3, d: 0.03, g: 0.06 });
} }, swing: { jit: true, fn: (e4) => {
  e4.noise({ ft: `bandpass`, f: 600, f2: 2e3, fd: 0.08, q: 1.4, a: 0.06, d: 0.1, g: 0.24, lin: true }), e4.noise({ at: 0.06, ft: `bandpass`, f: 1900, f2: 700, q: 1.4, a: 0.03, d: 0.12, g: 0.13, lin: true });
} }, hit_wood: { jit: true, gain: 0.8, fn: (e4) => {
  e4.tone({ f: 330, f2: 210, ft: 0.04, a: 1e-3, d: 0.11, g: 0.5 }), e4.tone({ type: `triangle`, f: 560, f2: 420, a: 1e-3, d: 0.05, g: 0.2 }), e4.noise({ ft: `bandpass`, f: 900, q: 2.2, a: 1e-3, d: 0.045, g: 0.26 }), e4.noise({ ft: `highpass`, f: 2500, a: 1e-3, d: 0.012, g: 0.1 });
} }, hit_stone: { jit: true, gain: 0.8, fn: (e4) => {
  e4.noise({ ft: `bandpass`, f: 3400, q: 3.5, a: 1e-3, d: 0.05, g: 0.28 }), e4.noise({ ft: `highpass`, f: 5e3, a: 1e-3, d: 0.015, g: 0.12 }), e4.tone({ type: `triangle`, f: 2300, a: 1e-3, d: 0.05, g: 0.14 }), e4.tone({ f: 3150, a: 1e-3, d: 0.035, g: 0.08 }), e4.tone({ f: 190, f2: 120, a: 1e-3, d: 0.06, g: 0.3 }), e4.noise({ kind: `pink`, f: 700, a: 1e-3, d: 0.07, g: 0.18 });
} }, hit_metal: { jit: true, gain: 0.8, fn: (e4) => {
  e4.ring(540, Jf, 0.5, 0.2), e4.noise({ ft: `bandpass`, f: 4200, q: 2, a: 1e-3, d: 0.03, g: 0.2 }), e4.tone({ f: 200, f2: 130, a: 1e-3, d: 0.05, g: 0.25 });
} }, weakpoint: { fn: (e4) => {
  e4.noise({ ft: `bandpass`, f: 1400, q: 1.5, a: 1e-3, d: 0.03, g: 0.12 }), e4.tone({ f: 1244.5, f2: 1318.5, ft: 0.03, a: 2e-3, d: 0.13, g: 0.2 }), e4.tone({ f: 2637, a: 2e-3, d: 0.08, g: 0.06 });
  let t2 = 0.05;
  e4.tone({ at: t2, f: 1975.5, a: 2e-3, d: 0.34, g: 0.24 }), e4.tone({ at: t2, f: 3951, a: 2e-3, d: 0.18, g: 0.07 }), e4.tone({ at: t2, type: `triangle`, f: 2963.3, a: 2e-3, d: 0.1, g: 0.035 });
} }, break_wood: { rev: 0.12, jit: true, gain: 0.85, fn: (e4) => {
  e4.tone({ f: 210, f2: 90, ft: 0.12, a: 2e-3, d: 0.3, g: 0.5 }), e4.noise({ kind: `pink`, f: 1800, f2: 400, a: 2e-3, d: 0.4, g: 0.36 });
  for (let t2 = 0; t2 < 8; t2++) {
    let t3 = Math.random() * 0.32;
    e4.noise({ at: t3, ft: `bandpass`, f: U(700, 2100), q: 3, a: 1e-3, d: U(0.03, 0.07), g: 0.24 * (1 - t3) }), e4.tone({ at: t3, f: U(250, 500), f2: 150, a: 1e-3, d: 0.05, g: 0.12 });
  }
} }, break_stone: { rev: 0.12, jit: true, gain: 0.85, fn: (e4) => {
  e4.tone({ f: 140, f2: 50, ft: 0.15, a: 2e-3, d: 0.4, g: 0.55 }), e4.noise({ kind: `pink`, f: 2600, f2: 300, a: 2e-3, d: 0.55, g: 0.42 });
  for (let t2 = 0; t2 < 9; t2++) {
    let t3 = Math.random() * 0.42;
    e4.noise({ at: t3, ft: `bandpass`, f: U(2200, 5200), q: 3.5, a: 1e-3, d: U(0.025, 0.065), g: 0.2 * (1 - t3) });
  }
} }, break_metal: { rev: 0.14, jit: true, gain: 0.8, fn: (e4) => {
  e4.ring(310, Jf, 0.9, 0.2), e4.ring(467, Jf, 0.6, 0.1, 0.03), e4.tone({ f: 120, f2: 50, a: 2e-3, d: 0.3, g: 0.45 }), e4.noise({ ft: `bandpass`, f: 3e3, q: 0.8, a: 1e-3, d: 0.25, g: 0.24 });
  for (let t2 = 0; t2 < 6; t2++) {
    let t3 = 0.05 + Math.random() * 0.4;
    e4.ring(U(900, 2400), [1, 2.76], 0.12, 0.06 * (1 - t3), t3);
  }
} }, build_wood: { gain: 0.85, fn: (e4) => ap(e4, 0) }, build_stone: { gain: 0.85, fn: (e4) => ap(e4, 1) }, build_metal: { gain: 0.85, fn: (e4) => ap(e4, 2) }, build_deny: { fn: (e4) => {
  e4.tone({ type: `square`, f: 196, a: 4e-3, hold: 0.03, d: 0.06, g: 0.16, lp: 700 }), e4.tone({ at: 0.09, type: `square`, f: 147, a: 4e-3, hold: 0.04, d: 0.1, g: 0.16, lp: 600 });
} }, edit: { fn: (e4) => {
  e4.noise({ ft: `bandpass`, f: 3200, q: 1.2, a: 4e-3, d: 0.035, g: 0.13 }), e4.noise({ kind: `pink`, ft: `bandpass`, f: 1500, q: 0.8, a: 0.01, d: 0.06, g: 0.09 }), e4.tone({ f: 880, a: 2e-3, d: 0.03, g: 0.05 });
} }, chest_open: { rev: 0.3, fn: (e4) => {
  e4.tone({ f: 190, f2: 85, a: 4e-3, d: 0.28, g: 0.3 }), e4.noise({ kind: `pink`, f: 700, a: 0.02, d: 0.22, g: 0.14 });
  let t2 = [Zf, Qf, $f, ep, tp, np, rp];
  for (let n2 = 0; n2 < t2.length; n2++) {
    let r = 0.04 + n2 * 0.07, i = t2[n2];
    e4.tone({ at: r, f: i, a: 4e-3, d: 0.55, g: 0.15 }), e4.tone({ at: r, f: i * 2, a: 4e-3, d: 0.3, g: 0.04 }), e4.tone({ at: r, type: `triangle`, f: i * 1.004, a: 4e-3, d: 0.35, g: 0.045 });
  }
  for (let t3 of [Zf, Qf, $f]) e4.tone({ at: 0.1, f: t3, a: 0.3, d: 0.85, g: 0.04, det: 6 });
  e4.noise({ at: 0.1, ft: `bandpass`, f: 5500, f2: 9e3, q: 3, a: 0.35, d: 0.8, g: 0.04 });
  for (let t3 = 0; t3 < 10; t3++) e4.tone({ at: U(0.35, 1.05), f: Bf(ip), a: 2e-3, d: U(0.1, 0.2), g: U(0.015, 0.04) });
} }, pickup: { fn: (e4) => {
  e4.tone({ f: 430, f2: 900, ft: 0.05, a: 3e-3, d: 0.09, g: 0.28 }), e4.noise({ ft: `bandpass`, f: 1500, q: 1.2, a: 1e-3, d: 0.02, g: 0.06 }), e4.tone({ at: 0.055, f: 1760, a: 2e-3, d: 0.14, g: 0.08 }), e4.tone({ at: 0.085, f: 2637, a: 2e-3, d: 0.12, g: 0.05 });
} }, ammo: { fn: (e4) => {
  for (let [t2, n2] of [[0, 2450], [0.04, 3150], [0.085, 2750]]) e4.ring(n2, [1, 2.32], 0.09, 0.09, t2), e4.noise({ at: t2, ft: `highpass`, f: 5e3, a: 1e-3, d: 0.012, g: 0.05 });
  e4.tone({ f: 320, f2: 220, a: 1e-3, d: 0.04, g: 0.1 });
} }, mats: { fn: (e4) => {
  e4.tone({ f: 520, f2: 350, a: 1e-3, d: 0.045, g: 0.2 }), e4.noise({ ft: `bandpass`, f: 2300, q: 2.5, a: 1e-3, d: 0.025, g: 0.12 }), e4.tone({ at: 0.038, f: 700, f2: 520, a: 1e-3, d: 0.04, g: 0.12 }), e4.noise({ at: 0.038, ft: `bandpass`, f: 3e3, q: 3, a: 1e-3, d: 0.02, g: 0.07 });
} }, drop: { fn: (e4) => {
  e4.tone({ f: 130, f2: 70, a: 2e-3, d: 0.12, g: 0.36 }), e4.noise({ kind: `pink`, f: 500, a: 2e-3, d: 0.07, g: 0.18 });
} }, bandage: { fn: (e4) => {
  for (let [t2, n2, r] of [[0, 1100, 2400], [0.17, 2300, 1300], [0.36, 1200, 2700], [0.53, 2100, 1100]]) e4.noise({ at: t2, kind: `pink`, ft: `bandpass`, f: n2, f2: r, q: 0.9, a: 0.05, d: 0.1, g: 0.18, lin: true }), e4.noise({ at: t2 + 0.02, ft: `highpass`, f: 5200, a: 0.03, d: 0.07, g: 0.025, lin: true });
} }, drink: { fn: (e4) => {
  let t2 = [1, 0.93, 1.07];
  for (let n2 = 0; n2 < 3; n2++) {
    let r = n2 * 0.27 + U(0, 0.02), i = t2[n2];
    e4.tone({ at: r, f: 310 * i, f2: 165 * i, ft: 0.06, a: 8e-3, d: 0.1, g: 0.26 }), e4.tone({ at: r + 0.065, f: 175 * i, f2: 430 * i, ft: 0.07, a: 0.01, d: 0.09, g: 0.2 }), e4.noise({ at: r, kind: `pink`, ft: `bandpass`, f: 500, q: 1.5, a: 0.01, d: 0.1, g: 0.07 });
  }
} }, heal_done: { fn: (e4) => {
  let t2 = [[0, Zf], [0.15, $f]];
  for (let [n2, r] of t2) e4.tone({ at: n2, f: r, a: 0.012, d: 0.6, g: 0.2 }), e4.tone({ at: n2, type: `triangle`, f: r, a: 0.012, d: 0.35, g: 0.06, lp: 2400 }), e4.tone({ at: n2, f: r * 2, a: 0.012, d: 0.3, g: 0.035 }), e4.tone({ at: n2, f: r * 1.005, a: 0.02, d: 0.5, g: 0.05 });
} }, shield_up: { fn: (e4) => {
  e4.noise({ ft: `bandpass`, f: 700, f2: 5200, q: 5, a: 0.26, d: 0.22, g: 0.14 }), e4.tone({ f: 420, f2: 1560, ft: 0.34, a: 0.22, d: 0.22, g: 0.1 }), e4.tone({ type: `triangle`, f: 630, f2: 2340, ft: 0.34, a: 0.24, d: 0.18, g: 0.04 });
  let t2 = 0.31;
  e4.tone({ at: t2, f: np, a: 4e-3, d: 0.7, g: 0.15 }), e4.tone({ at: t2, f: np, a: 4e-3, d: 0.7, g: 0.08, det: 9 }), e4.tone({ at: t2, f: 2349.32, a: 4e-3, d: 0.5, g: 0.08 }), e4.tone({ at: t2, f: 3135.96, a: 4e-3, d: 0.35, g: 0.04 }), e4.tone({ at: t2, f: 4698.6, a: 4e-3, d: 0.2, g: 0.02 }), e4.noise({ at: t2, ft: `bandpass`, f: 7500, q: 4, a: 0.01, d: 0.3, g: 0.03 });
} }, hit_flesh: { jit: true, fn: (e4) => {
  e4.noise({ kind: `pink`, ft: `bandpass`, f: 700, q: 0.9, a: 1e-3, d: 0.06, g: 0.34 }), e4.tone({ f: 200, f2: 100, a: 1e-3, d: 0.07, g: 0.34 }), e4.noise({ ft: `bandpass`, f: 2e3, q: 1, a: 1e-3, d: 0.02, g: 0.09 });
} }, hit_shield: { jit: true, fn: (e4) => {
  e4.tone({ type: `sawtooth`, f: 2400, f2: 900, ft: 0.07, a: 1e-3, d: 0.1, g: 0.09, lp: 5e3 }), e4.tone({ f: 3200, f2: 1800, a: 1e-3, d: 0.09, g: 0.14 }), e4.tone({ f: 1480, a: 1e-3, d: 0.12, g: 0.08 }), e4.noise({ ft: `bandpass`, f: 5e3, q: 3, a: 1e-3, d: 0.04, g: 0.12 });
} }, shield_break: { rev: 0.15, fn: (e4) => {
  e4.noise({ ft: `highpass`, f: 3500, a: 1e-3, d: 0.3, g: 0.24 }), e4.noise({ ft: `bandpass`, f: 6e3, q: 2, a: 1e-3, d: 0.08, g: 0.24 });
  for (let t2 = 0; t2 < 10; t2++) e4.tone({ at: Math.random() * 0.35, f: U(2500, 7e3), a: 1e-3, d: U(0.05, 0.15), g: 0.06 });
  e4.tone({ type: `sawtooth`, f: 1800, f2: 110, ft: 0.4, a: 3e-3, d: 0.45, g: 0.15, lp: 3500 }), e4.tone({ type: `square`, f: 900, f2: 60, ft: 0.4, a: 3e-3, d: 0.4, g: 0.05, lp: 2e3 }), e4.tone({ f: 140, f2: 50, a: 2e-3, d: 0.25, g: 0.32 });
} }, hitmarker: { fn: (e4) => {
  e4.noise({ ft: `bandpass`, f: 3e3, q: 2, a: 1e-3, d: 0.018, g: 0.16 }), e4.tone({ type: `triangle`, f: 1900, a: 1e-3, d: 0.02, g: 0.12 });
} }, headshot: { fn: (e4) => {
  e4.ring(rp, Yf, 0.38, 0.22), e4.tone({ f: ep, a: 1e-3, d: 0.14, g: 0.07 }), e4.noise({ ft: `bandpass`, f: 5200, q: 2.5, a: 1e-3, d: 0.02, g: 0.1 });
} }, elim: { rev: 0.15, fn: (e4) => {
  e4.tone({ f: 170, f2: 70, a: 2e-3, d: 0.16, g: 0.32 }), e4.noise({ ft: `bandpass`, f: 2500, q: 1.2, a: 1e-3, d: 0.03, g: 0.12 });
  let t2 = (t3, n2, r) => {
    e4.tone({ at: t3, type: `square`, f: n2, a: 3e-3, d: r, g: 0.07, lp: 3200 }), e4.tone({ at: t3, f: n2, a: 3e-3, d: r * 1.2, g: 0.2 }), e4.tone({ at: t3, f: n2 * 2, a: 3e-3, d: r * 0.7, g: 0.05 });
  };
  t2(0, $f, 0.16), t2(0.095, 1174.66, 0.5);
  for (let t3 = 0; t3 < 6; t3++) e4.tone({ at: U(0.16, 0.5), f: Bf([2349.3, 3136, 3520, 4698.6]), a: 2e-3, d: U(0.08, 0.18), g: U(0.015, 0.04) });
  e4.noise({ at: 0.1, ft: `bandpass`, f: 7e3, q: 3, a: 0.05, d: 0.4, g: 0.03 });
} }, hurt: { jit: true, fn: (e4) => {
  e4.tone({ f: 120, f2: 55, a: 2e-3, d: 0.16, g: 0.5 }), e4.noise({ kind: `pink`, f: 400, a: 2e-3, d: 0.09, g: 0.26 });
} }, death: { rev: 0.15, fn: (e4) => {
  e4.noise({ ft: `bandpass`, f: 2400, f2: 180, fd: 0.7, q: 1.6, a: 0.05, d: 0.75, g: 0.3 }), e4.tone({ f: 520, f2: 60, ft: 0.7, a: 0.03, d: 0.75, g: 0.2 }), e4.tone({ type: `triangle`, f: 780, f2: 90, ft: 0.7, a: 0.03, d: 0.7, g: 0.06 });
} }, jump: { jit: true, fn: (e4) => {
  e4.noise({ kind: `pink`, ft: `bandpass`, f: 500, f2: 1300, q: 1.2, a: 0.03, d: 0.09, g: 0.11, lin: true });
} }, doublejump: { jit: true, fn: (e4) => {
  e4.noise({ kind: `pink`, ft: `bandpass`, f: 700, f2: 1900, q: 1.1, a: 0.02, d: 0.1, g: 0.14, lin: true }), e4.tone({ f: 320, f2: 640, a: 0.01, d: 0.09, g: 0.08 });
} }, dash: { jit: true, fn: (e4) => {
  e4.noise({ kind: `pink`, ft: `bandpass`, f: 900, f2: 2600, fd: 0.35, q: 0.9, a: 0.01, d: 0.22, g: 0.22, lin: true }), e4.tone({ f: 180, f2: 520, a: 0.01, d: 0.18, g: 0.1 });
} }, launchpad: { rev: 0.15, fn: (e4) => {
  e4.tone({ f: 120, f2: 720, a: 0.01, d: 0.35, g: 0.4 }), e4.noise({ kind: `pink`, ft: `bandpass`, f: 600, f2: 2400, fd: 0.4, q: 0.8, a: 0.01, d: 0.3, g: 0.25, lin: true }), e4.tone({ type: `triangle`, f: 880, f2: 1760, a: 0.01, d: 0.2, g: 0.1 });
} }, land: { jit: true, fn: (e4) => {
  e4.tone({ f: 110, f2: 58, a: 2e-3, d: 0.1, g: 0.3 }), e4.noise({ kind: `pink`, f: 450, a: 2e-3, d: 0.06, g: 0.18 }), e4.noise({ ft: `bandpass`, f: 1800, q: 0.8, a: 1e-3, d: 0.03, g: 0.035 });
} }, step: { jit: true, fn: (e4) => {
  e4.noise({ kind: `pink`, ft: `bandpass`, f: U(300, 430), q: 0.9, a: 2e-3, d: 0.05, g: 0.11 }), e4.tone({ f: 95, f2: 60, a: 2e-3, d: 0.05, g: 0.1 }), e4.noise({ ft: `bandpass`, f: 1700, q: 0.8, a: 1e-3, d: 0.02, g: 0.02 });
} }, glider_open: { rev: 0.1, fn: (e4) => {
  e4.tone({ f: 170, f2: 60, ft: 0.15, a: 4e-3, d: 0.3, g: 0.48 }), e4.noise({ kind: `pink`, f: 1200, f2: 300, a: 4e-3, d: 0.25, g: 0.34 }), e4.noise({ at: 0.03, ft: `bandpass`, f: 2500, q: 1, a: 2e-3, d: 0.04, g: 0.13 }), e4.noise({ ft: `bandpass`, f: 500, f2: 1600, fd: 0.4, q: 0.9, a: 0.15, hold: 0.1, d: 0.6, g: 0.2 });
} }, bus_horn: { rev: 0.3, fn: (e4) => {
  let t2 = (t3, n2, r, i) => {
    for (let a of [n2, r]) e4.tone({ at: t3, type: `sawtooth`, f: a, a: 0.02, hold: i, d: 0.14, g: 0.13, lp: 1500, lq: 3, vib: [5.5, a * 4e-3] }), e4.tone({ at: t3, type: `square`, f: a * 1.003, a: 0.02, hold: i, d: 0.14, g: 0.05, lp: 1100 });
  };
  t2(0, 392, 493.88, 0.16), t2(0.3, 329.63, 415.3, 0.5);
} }, level_up: { fn: (e4) => {
  e4.tone({ f: 523, f2: 659, a: 0.01, d: 0.12, g: 0.14 }), e4.tone({ f: 659, f2: 880, a: 0.12, d: 0.18, g: 0.12 }), e4.tone({ f: 1046, f2: 1318, a: 0.2, d: 0.3, g: 0.1 });
} }, killstreak: { fn: (e4) => {
  e4.tone({ f: 440, f2: 880, a: 0.01, d: 0.2, g: 0.16 }), e4.noise({ kind: `white`, ft: `bandpass`, f: 1800, q: 2, a: 0.05, d: 0.25, g: 0.1 });
} }, thunder: { fn: (e4) => {
  e4.noise({ kind: `brown`, ft: `lowpass`, f: 400, f2: 80, a: 0.02, d: 1.2, g: 0.5 }), e4.tone({ f: 60, f2: 40, a: 0.02, d: 1, g: 0.3 });
} }, bus_jump: { fn: (e4) => {
  e4.tone({ f: 90, f2: 50, a: 0.02, d: 0.3, g: 0.28 }), e4.noise({ kind: `pink`, ft: `bandpass`, f: 300, f2: 1400, fd: 0.5, q: 0.8, a: 0.25, hold: 0.15, d: 0.7, g: 0.36 }), e4.noise({ ft: `highpass`, f: 2500, a: 0.3, d: 0.6, g: 0.06 });
} }, ui_click: { ui: true, fn: (e4) => {
  e4.tone({ f: 740, f2: 560, ft: 0.03, a: 1e-3, d: 0.06, g: 0.14 }), e4.tone({ type: `triangle`, f: 1480, a: 1e-3, d: 0.025, g: 0.03 }), e4.noise({ ft: `bandpass`, f: 2600, q: 1.6, a: 1e-3, d: 0.01, g: 0.04 });
} }, ui_hover: { ui: true, fn: (e4) => {
  e4.tone({ type: `triangle`, f: 880, a: 4e-3, d: 0.04, g: 0.035, lp: 2e3 });
} }, ui_play: { ui: true, rev: 0.15, fn: (e4) => {
  e4.tone({ f: 140, f2: 62, a: 2e-3, d: 0.3, g: 0.45 }), e4.noise({ kind: `pink`, f: 900, a: 2e-3, d: 0.12, g: 0.18 });
  let t2 = [392, Zf, Qf, $f];
  for (let n2 = 0; n2 < t2.length; n2++) e4.brass(n2 * 0.055, t2[n2], 0.04, 0.12, 0.13);
  for (let t3 of [Zf, Qf, $f, ep]) e4.brass(0.23, t3, 0.22, 0.5, 0.09);
  e4.brass(0.23, 130.81, 0.22, 0.5, 0.12, 0.6), e4.noise({ at: 0.23, ft: `bandpass`, f: 6500, q: 2, a: 0.03, d: 0.6, g: 0.035 });
  for (let t3 = 0; t3 < 5; t3++) e4.tone({ at: U(0.25, 0.7), f: Bf(ip), a: 2e-3, d: 0.15, g: 0.025 });
} }, storm_warn: { rev: 0.25, fn: (e4) => {
  e4.tone({ type: `sawtooth`, f: 55, a: 0.6, hold: 0.3, d: 1, g: 0.3, lp: 180, lp2: 700, lq: 4 }), e4.tone({ type: `sawtooth`, f: 77.78, a: 0.7, hold: 0.2, d: 1, g: 0.16, lp: 200, lp2: 600 }), e4.tone({ f: 41.2, a: 0.4, hold: 0.4, d: 1, g: 0.2 }), e4.noise({ kind: `pink`, ft: `bandpass`, f: 300, f2: 900, q: 2, a: 0.7, d: 0.9, g: 0.1 });
  for (let t2 of [0.1, 0.32, 0.54]) e4.tone({ at: t2, type: `square`, f: 932.33, a: 4e-3, hold: 0.07, d: 0.08, g: 0.06, lp: 2600 }), e4.tone({ at: t2, f: 932.33, a: 4e-3, hold: 0.07, d: 0.1, g: 0.08 });
} }, storm_tick: { fn: (e4) => {
  e4.noise({ ft: `bandpass`, f: 4600, q: 2.5, a: 1e-3, d: 0.07, g: 0.14 }), e4.noise({ at: 0.022, ft: `highpass`, f: 6e3, a: 1e-3, d: 0.012, g: 0.07 }), e4.noise({ at: 0.047, ft: `highpass`, f: 6e3, a: 1e-3, d: 0.014, g: 0.05 }), e4.tone({ type: `sawtooth`, f: 150, f2: 85, a: 1e-3, d: 0.07, g: 0.1, lp: 1400 }), e4.tone({ type: `square`, f: 1900, f2: 700, a: 1e-3, d: 0.04, g: 0.03, lp: 4e3 });
} }, countdown: { ui: true, fn: (e4) => {
  e4.tone({ f: 880, a: 4e-3, hold: 0.07, d: 0.09, g: 0.22 }), e4.tone({ f: 1760, a: 4e-3, hold: 0.05, d: 0.06, g: 0.03 });
} }, victory: { ui: true, rev: 0.25, fn: (e4) => {
  e4.tone({ f: 120, f2: 60, a: 2e-3, d: 0.4, g: 0.38 });
  let t2 = [[0, 392, 0.09], [0.14, Zf, 0.09], [0.28, Qf, 0.09], [0.42, $f, 0.22], [0.72, Qf, 0.08], [0.86, $f, 0.08]];
  for (let [n2, r, i] of t2) e4.brass(n2, r, i, 0.14, 0.19), e4.brass(n2, r / 2, i, 0.14, 0.08, 0.8);
  e4.tone({ at: 1, f: 110, f2: 55, a: 2e-3, d: 0.6, g: 0.42 }), e4.noise({ at: 1, kind: `pink`, f: 500, a: 2e-3, d: 0.3, g: 0.16 });
  for (let t3 of [Zf, Qf, $f, ep]) e4.brass(1, t3, 1.2, 0.8, 0.11);
  e4.brass(1, 130.81, 1.2, 0.8, 0.13, 0.7), e4.brass(1, 261.63, 1.2, 0.8, 0.07, 0.8), e4.noise({ at: 1, ft: `highpass`, f: 6e3, a: 0.02, d: 1.6, g: 0.045 }), e4.noise({ at: 1, ft: `bandpass`, f: 8e3, q: 2, a: 0.4, hold: 0.5, d: 1, g: 0.03 });
  for (let t3 = 0; t3 < 16; t3++) e4.tone({ at: 1 + U(0.05, 1.7), f: Bf(ip), a: 2e-3, d: U(0.12, 0.3), g: U(0.012, 0.035) });
} }, defeat: { ui: true, rev: 0.2, fn: (e4) => {
  let t2 = [[0, Qf, 0.16, 0.2], [0.26, Zf, 0.16, 0.2], [0.52, 440, 0.16, 0.2], [0.78, 329.63, 0.5, 0.7]];
  for (let [n2, r, i, a] of t2) e4.brass(n2, r, i, a, 0.13, 0.55), e4.tone({ at: n2, f: r / 2, a: 0.01, hold: i, d: 0.3, g: 0.07 });
  e4.brass(0.78, 110, 0.5, 0.7, 0.1, 0.5), e4.tone({ at: 0.78, f: 220, a: 0.02, hold: 0.4, d: 0.6, g: 0.05 }), e4.tone({ at: 0.78, f: 261.63, a: 0.02, hold: 0.4, d: 0.6, g: 0.05 });
} }, emote: { fn: (e4) => {
  let t2 = [[0, 392], [0.11, 466.16], [0.275, Zf], [0.385, $f]];
  for (let [n2, r] of t2) e4.tone({ at: n2, type: `square`, f: r, a: 3e-3, hold: 0.03, d: 0.08, g: 0.11, lp: 2800 }), e4.tone({ at: n2, type: `triangle`, f: r * 2, a: 3e-3, d: 0.06, g: 0.04 });
  e4.tone({ f: 150, f2: 60, a: 2e-3, d: 0.1, g: 0.25 }), e4.tone({ at: 0.275, f: 150, f2: 60, a: 2e-3, d: 0.1, g: 0.22 }), e4.noise({ at: 0.11, ft: `highpass`, f: 6e3, a: 1e-3, d: 0.03, g: 0.05 }), e4.noise({ at: 0.385, ft: `highpass`, f: 6e3, a: 1e-3, d: 0.05, g: 0.06 });
} }, bullet_whiz: { jit: true, fn: (e4) => {
  e4.noise({ ft: `bandpass`, f: 4200, f2: 900, fd: 0.14, q: 6, a: 0.03, d: 0.13, g: 0.26, lin: true }), e4.tone({ type: `sawtooth`, f: 1900, f2: 500, ft: 0.15, a: 0.03, d: 0.12, g: 0.05, lp: 3e3, lin: true });
} }, impact: { jit: true, fn: (e4) => {
  if (e4.noise({ kind: `pink`, ft: `bandpass`, f: 900, q: 1, a: 1e-3, d: 0.05, g: 0.22 }), e4.noise({ ft: `highpass`, f: 3e3, a: 1e-3, d: 0.015, g: 0.1 }), Math.random() < 0.3) {
    let t2 = U(2200, 3200);
    e4.tone({ f: t2, f2: t2 * U(0.45, 0.65), ft: 0.16, a: 2e-3, d: 0.18, g: 0.05 });
  }
} }, shot_tac: { rev: 0.3, jit: true, gain: 0.86, fn: (e4) => {
  e4.punch(0.4, 230, 52), e4.noise({ ft: `highpass`, f: 3600, a: 8e-4, d: 0.03, g: 0.26 }), e4.tone({ type: `square`, f: 1400, f2: 600, a: 5e-4, d: 0.012, g: 0.05, lp: 5e3 }), e4.noise({ ft: `bandpass`, f: 1050, q: 0.7, a: 1e-3, d: 0.12, g: 0.44 }), e4.noise({ kind: `pink`, f: 2400, f2: 520, fd: 0.16, a: 2e-3, d: 0.3, g: 0.5 }), e4.tone({ f: 150, f2: 52, ft: 0.12, a: 2e-3, d: 0.3, g: 0.6 }), e4.tone({ type: `triangle`, f: 300, f2: 110, a: 1e-3, d: 0.11, g: 0.2 }), e4.clack(0.085, 1700, 0.11), e4.clack(0.13, 1150, 0.13);
} }, shot_burst: { rev: 0.2, jit: true, gain: 0.8, fn: (e4) => {
  e4.punch(0.28, 260, 70), e4.noise({ ft: `highpass`, f: 4200, a: 8e-4, d: 0.018, g: 0.24 }), e4.noise({ ft: `bandpass`, f: 2100, q: 0.9, a: 1e-3, d: 0.065, g: 0.46 }), e4.noise({ kind: `pink`, f: 1500, a: 2e-3, d: 0.1, g: 0.24 }), e4.tone({ f: 205, f2: 92, ft: 0.035, a: 1e-3, d: 0.1, g: 0.5 }), e4.tone({ type: `triangle`, f: 520, f2: 240, a: 1e-3, d: 0.045, g: 0.14 }), e4.tone({ type: `square`, f: 760, f2: 380, a: 1e-3, d: 0.022, g: 0.045, lp: 3200 });
} }, throw: { jit: true, fn: (e4) => {
  e4.ring(3400, [1, 2.71], 0.12, 0.05), e4.clack(0.02, 2600, 0.08), e4.noise({ kind: `pink`, at: 0.04, ft: `bandpass`, f: 450, f2: 2200, fd: 0.12, q: 1.3, a: 0.09, d: 0.1, g: 0.3, lin: true }), e4.noise({ at: 0.14, ft: `bandpass`, f: 2600, f2: 900, fd: 0.14, q: 1.6, a: 0.02, d: 0.16, g: 0.12, lin: true });
} }, nade_bounce: { jit: true, rev: 0.08, fn: (e4) => {
  e4.tone({ f: 210, f2: 120, a: 1e-3, d: 0.06, g: 0.24 }), e4.noise({ kind: `pink`, ft: `bandpass`, f: 700, q: 1.2, a: 1e-3, d: 0.04, g: 0.16 }), e4.ring(U(1550, 1750), Jf, 0.16, 0.12), e4.ring(2900, [1, 1.52], 0.06, 0.04, 2e-3), e4.noise({ ft: `highpass`, f: 5e3, a: 6e-4, d: 0.01, g: 0.1 });
} }, slide: { fn: (e4) => {
  e4.noise({ kind: `pink`, ft: `bandpass`, f: 800, f2: 520, q: 0.9, a: 0.04, hold: 0.22, d: 0.3, g: 0.28 }), e4.noise({ ft: `bandpass`, f: 3200, f2: 2e3, q: 1.4, a: 0.03, hold: 0.18, d: 0.28, g: 0.08 });
  for (let t2 = 0; t2 < 16; t2++) {
    let t3 = 0.02 + Math.random() * 0.45;
    e4.noise({ at: t3, ft: `bandpass`, f: U(1800, 4200), q: 3, a: 1e-3, d: U(0.01, 0.025), g: 0.06 * (1 - t3 / 0.6) });
  }
  e4.tone({ f: 95, f2: 70, a: 0.02, d: 0.25, g: 0.1 });
} }, mantle: { fn: (e4) => {
  e4.noise({ kind: `pink`, ft: `bandpass`, f: 700, q: 1.1, a: 1e-3, d: 0.06, g: 0.3 }), e4.tone({ f: 150, f2: 90, a: 1e-3, d: 0.07, g: 0.22 }), e4.noise({ ft: `highpass`, f: 3e3, a: 1e-3, d: 0.012, g: 0.08 }), e4.noise({ kind: `pink`, at: 0.05, ft: `bandpass`, f: 500, f2: 1500, fd: 0.18, q: 1.1, a: 0.08, d: 0.14, g: 0.16, lin: true }), e4.noise({ at: 0.07, ft: `bandpass`, f: 1300, q: 2.2, a: 0.03, hold: 0.04, d: 0.12, g: 0.05 }), e4.noise({ at: 0.075, ft: `bandpass`, f: 2500, q: 3, a: 0.03, hold: 0.03, d: 0.1, g: 0.025 }), e4.noise({ kind: `pink`, at: 0.27, ft: `bandpass`, f: 520, q: 1, a: 2e-3, d: 0.06, g: 0.2 }), e4.tone({ at: 0.27, f: 120, f2: 75, a: 2e-3, d: 0.06, g: 0.16 });
} }, supply_drop: { rev: 0.4, fn: (e4) => {
  e4.noise({ ft: `bandpass`, f: 4e3, f2: 700, fd: 0.5, q: 1.2, a: 0.25, d: 0.32, g: 0.16 }), e4.noise({ kind: `pink`, f: 900, f2: 300, fd: 0.5, a: 0.3, d: 0.3, g: 0.12 });
  let t2 = 0.5;
  e4.tone({ at: t2, f: 110, f2: 60, a: 4e-3, d: 0.5, g: 0.28 }), e4.noise({ at: t2, kind: `pink`, f: 600, a: 2e-3, d: 0.14, g: 0.14 });
  let n2 = [$f, ep, tp, np];
  for (let t3 = 0; t3 < n2.length; t3++) {
    let r = 0.53 + t3 * 0.075;
    e4.tone({ at: r, f: n2[t3], type: `triangle`, a: 2e-3, d: 0.9 - t3 * 0.1, g: 0.11 }), e4.tone({ at: r, f: n2[t3] * 2, a: 2e-3, d: 0.35, g: 0.03 }), e4.tone({ at: r, f: n2[t3] * 3.01, a: 2e-3, d: 0.18, g: 0.012 });
  }
  e4.tone({ at: 0.8, f: Zf, a: 0.06, hold: 0.2, d: 0.9, g: 0.05 }), e4.tone({ at: 0.8, f: Qf, a: 0.06, hold: 0.2, d: 0.9, g: 0.04 });
  for (let n3 = 0; n3 < 8; n3++) e4.tone({ at: t2 + U(0.3, 1), f: Bf(ip), a: 2e-3, d: U(0.1, 0.22), g: U(0.01, 0.025) });
} }, glass_break: { jit: true, rev: 0.15, gain: 1.8, fn: (e4) => {
  e4.noise({ ft: `highpass`, f: 3e3, a: 6e-4, d: 0.04, g: 0.3 }), e4.tone({ f: 160, f2: 90, a: 1e-3, d: 0.06, g: 0.2 }), e4.ring(U(2300, 2700), Yf, 0.25, 0.08);
  for (let t2 = 0; t2 < 16; t2++) {
    let t3 = 0.01 + Math.random() ** 1.6 * 0.5;
    e4.ring(U(3e3, 7200), [1, 2.03], U(0.04, 0.1), 0.035 * (1 - t3 / 0.6), t3);
  }
  e4.noise({ ft: `bandpass`, f: 6e3, q: 1.2, a: 4e-3, d: 0.4, g: 0.06 });
} } }, sp = class {
  ctx;
  out;
  sources = [];
  bufs;
  canPan;
  constructor(e4, t2, n2, r) {
    this.ctx = e4, this.bufs = t2, this.out = n2, this.canPan = r;
  }
  gain(e4) {
    let t2 = this.ctx.createGain();
    return t2.gain.value = e4, t2;
  }
  filt(e4, t2, n2) {
    let r = this.ctx.createBiquadFilter();
    return r.type = e4, r.frequency.value = t2, r.Q.value = n2, r;
  }
  osc(e4, t2, n2 = 0) {
    let r = this.ctx.createOscillator();
    return r.type = e4, r.frequency.value = t2, r.detune.value = n2, r.start(), this.sources.push(r), r;
  }
  noise(e4) {
    let t2 = e4 === `pink` ? this.bufs.pink : this.bufs.white, n2 = this.ctx.createBufferSource();
    return n2.buffer = t2, n2.loop = true, n2.start(0, Math.random() * (t2.duration - 0.1)), this.sources.push(n2), n2;
  }
  band(e4, t2, n2, r, i) {
    let a = this.filt(t2, n2, r), o = qf(e4, t2, n2, r, this.ctx.sampleRate / 2), s2 = this.gain(i / (If * Math.sqrt(o)));
    return this.noise(e4).connect(a), a.connect(s2), s2.connect(this.out), { f: a, g: s2 };
  }
  lfo(e4, t2, n2, r = `sine`) {
    let i = this.gain(t2);
    this.osc(r, e4).connect(i), i.connect(n2);
  }
  trem(e4, t2, n2, r = `sine`) {
    this.lfo(e4, n2.gain.value * t2, n2.gain, r);
  }
  shot(e4, t2 = 1) {
    return new Xf(this.ctx, this.bufs, e4 ?? this.out, this.ctx.currentTime + 0.05, t2);
  }
  panned(e4, t2) {
    if (!this.canPan) return this.out;
    let n2 = this.ctx.createStereoPanner();
    return n2.pan.value = zf(e4, -1, 1), n2.connect(this.out), setTimeout(() => {
      try {
        n2.disconnect();
      } catch {
      }
    }, t2 * 1e3), n2;
  }
}, cp = [[369.99, 0.11], [466.16, 0.09], [554.37, 0.09], [739.99, 0.06], [932.33, 0.035], [1108.73, 0.03]], lp = { wind: (e4) => {
  let t2 = e4.band(`pink`, `bandpass`, 430, 0.55, 0.09);
  e4.lfo(0.09, 170, t2.f.frequency), e4.trem(0.053, 0.3, t2.g), e4.trem(0.21, 0.12, t2.g);
  let n2 = e4.band(`white`, `bandpass`, 1900, 0.5, 0.02);
  return e4.lfo(0.13, 600, n2.f.frequency), e4.trem(0.07, 0.45, n2.g), null;
}, birds: (e4) => () => {
  let t2 = e4.shot(e4.panned(U(-0.85, 0.85), 3)), n2 = Math.floor(Math.random() * 4), r = U(2300, 4200), i = U(0.02, 0.06), a = n2 === 2 ? 5 + Math.floor(Math.random() * 5) : 2 + Math.floor(Math.random() * 3), o = 0;
  for (let e5 = 0; e5 < a; e5++) {
    let a2, s2, c, l2;
    n2 === 0 ? (a2 = r * U(0.95, 1.05), s2 = a2 * U(1.25, 1.6), c = U(0.07, 0.12), l2 = U(0.05, 0.14)) : n2 === 1 ? (a2 = r * U(1.3, 1.5), s2 = r * U(0.85, 1), c = U(0.09, 0.16), l2 = U(0.06, 0.16)) : n2 === 2 ? (a2 = r * (e5 % 2 ? 1.12 : 1), s2 = a2 * 1.06, c = 0.035, l2 = 0.022) : (a2 = r * (e5 % 2 ? 0.8 : 1.05), s2 = a2 * 0.97, c = U(0.12, 0.2), l2 = U(0.08, 0.2)), t2.tone({ at: o, f: a2, f2: s2, a: Math.min(0.012, c * 0.3), d: c, g: i, lin: true }), o += c + l2;
  }
  return U(1800, 6500);
}, storm: (e4) => {
  let t2 = e4.band(`pink`, `lowpass`, 120, 0, 0.12);
  e4.trem(0.17, 0.35, t2.g), e4.lfo(0.07, 30, t2.f.frequency);
  let n2 = e4.band(`pink`, `bandpass`, 560, 5, 0.085);
  e4.lfo(0.11, 190, n2.f.frequency), e4.trem(0.19, 0.4, n2.g);
  let r = e4.band(`pink`, `bandpass`, 980, 7, 0.045);
  e4.lfo(0.077, 300, r.f.frequency), e4.trem(0.13, 0.5, r.g);
  let i = e4.band(`white`, `bandpass`, 1500, 0.6, 0.03);
  return e4.lfo(0.23, 500, i.f.frequency), e4.trem(0.31, 0.5, i.g), () => {
    let t3 = e4.shot(void 0, U(0.85, 1.15)), n3 = Math.random();
    if (n3 < 0.65) for (let e5 = 0; e5 < 6; e5++) t3.noise({ at: U(0, 0.35), ft: `bandpass`, f: U(900, 2600), q: 1.5, a: 2e-3, d: U(0.04, 0.12), g: 0.16 * (1 - n3) });
    t3.noise({ kind: `pink`, at: 0.05, f: 520, f2: 90, fd: 1.6, a: 0.06, d: U(1.6, 2.8), g: 0.4 }), t3.tone({ at: 0.05, f: 70, f2: 38, a: 0.05, d: 1.4, g: 0.22 });
    for (let e5 = 0; e5 < 3; e5++) t3.noise({ kind: `pink`, at: 0.45 + e5 * U(0.3, 0.5), f: 230, a: 0.12, d: 0.8, g: 0.2 - e5 * 0.05 });
    return U(5e3, 14e3);
  };
}, rain: (e4) => {
  let t2 = e4.band(`white`, `bandpass`, 4500, 0.5, 0.07);
  e4.trem(0.15, 0.15, t2.g);
  let n2 = e4.band(`pink`, `bandpass`, 700, 0.6, 0.04);
  return e4.trem(0.09, 0.2, n2.g), null;
}, skydive: (e4) => {
  let t2 = e4.band(`pink`, `lowpass`, 950, 0, 0.22);
  e4.lfo(0.5, 220, t2.f.frequency), e4.trem(2.7, 0.1, t2.g), e4.trem(0.33, 0.12, t2.g);
  let n2 = e4.band(`white`, `bandpass`, 2300, 0.45, 0.07);
  e4.lfo(0.37, 700, n2.f.frequency), e4.trem(0.61, 0.25, n2.g);
  let r = e4.band(`pink`, `lowpass`, 110, 0, 0.1);
  return e4.trem(0.8, 0.3, r.g), null;
}, glide: (e4) => {
  let t2 = e4.band(`pink`, `bandpass`, 650, 0.7, 0.12);
  e4.lfo(0.23, 180, t2.f.frequency), e4.trem(0.17, 0.2, t2.g);
  let n2 = e4.band(`pink`, `bandpass`, 1500, 1.2, 0.06);
  return e4.trem(7.3, 0.45, n2.g, `triangle`), e4.trem(11.1, 0.2, n2.g), e4.trem(0.31, 0.25, n2.g), e4.band(`white`, `highpass`, 3e3, 0, 0.015), null;
}, bus: (e4) => {
  let t2 = e4.filt(`lowpass`, 230, 3), n2 = e4.gain(0.2);
  e4.osc(`sawtooth`, 55, -7).connect(t2), e4.osc(`sawtooth`, 55, 8).connect(t2);
  let r = e4.gain(0.4);
  e4.osc(`square`, 82.41).connect(r), r.connect(t2), t2.connect(n2), n2.connect(e4.out), e4.trem(9.5, 0.22, n2), e4.lfo(0.21, 35, t2.frequency);
  let i = e4.band(`pink`, `lowpass`, 170, 0, 0.08);
  return e4.trem(0.4, 0.25, i.g), () => {
    let t3 = e4.shot(void 0, U(0.92, 1.08)), n3 = U(0.5, 1.4);
    return t3.noise({ ft: `bandpass`, f: 2800, q: 0.6, a: 0.06, hold: n3, d: 0.35, g: 0.12 }), t3.noise({ kind: `pink`, f: 520, a: 0.08, hold: n3, d: 0.4, g: 0.2 }), t3.noise({ ft: `highpass`, f: 5500, a: 0.04, hold: n3, d: 0.25, g: 0.03 }), (n3 + U(1.6, 4.5)) * 1e3;
  };
}, chest: (e4) => {
  let t2 = e4.gain(1);
  t2.connect(e4.out);
  for (let n3 = 0; n3 < cp.length; n3++) {
    let [r, i] = cp[n3];
    for (let a of [-5, 5]) {
      let o = e4.gain(i / 2);
      e4.osc(`sine`, r, a).connect(o), o.connect(t2), e4.lfo(0.17 + 0.061 * n3 + (a > 0 ? 0.03 : 0), i * 0.2, o.gain);
    }
  }
  e4.trem(2.3, 0.16, t2), e4.trem(0.19, 0.12, t2);
  let n2 = e4.band(`white`, `bandpass`, 6500, 5, 6e-3);
  return e4.trem(0.7, 0.6, n2.g), () => {
    let t3 = e4.shot(), n3 = Math.min(Bf(cp)[0] * Bf([2, 4, 4, 8]), 7500);
    return t3.tone({ f: n3, a: 4e-3, d: U(0.18, 0.45), g: U(8e-3, 0.024) }), U(110, 480);
  };
}, surf: (e4) => {
  let t2 = e4.band(`pink`, `lowpass`, 420, 0, 0.05);
  e4.lfo(0.071, 150, t2.f.frequency), e4.trem(0.083, 0.5, t2.g);
  let n2 = e4.band(`white`, `bandpass`, 2600, 0.5, 9e-3);
  return e4.trem(0.061, 0.6, n2.g), () => {
    if (Math.random() < 0.32) {
      let t4 = e4.shot(e4.panned(U(-0.9, 0.9), 4), U(0.9, 1.12)), n4 = Math.random() < 0.35, r = n4 ? 4 + Math.floor(Math.random() * 3) : 1 + Math.floor(Math.random() * 3), i = U(6e-3, 0.012), a = 0;
      for (let e5 = 0; e5 < r; e5++) {
        let r2 = n4 ? U(1250, 1400) : U(1500, 1750), o = n4 ? U(0.09, 0.13) : U(0.2, 0.3);
        t4.tone({ at: a, type: `sawtooth`, f: r2, f2: r2 * (n4 ? 0.82 : 0.66), a: 0.02, d: o, g: i * (1 - e5 * 0.08), lin: true, lp: 2300, vib: [26, 28] }), t4.tone({ at: a, f: r2 * 2, f2: r2 * 1.4, a: 0.02, d: o * 0.8, g: i * 0.5, lin: true }), a += o + (n4 ? U(0.05, 0.09) : U(0.18, 0.4));
      }
      return U(3e3, 7e3);
    }
    let t3 = e4.shot(e4.panned(U(-0.6, 0.6), 7), U(0.85, 1.1)), n3 = U(0.6, 1);
    return t3.noise({ kind: `pink`, ft: `lowpass`, f: 260, f2: 1500, fd: 1.4, a: 1.2, hold: 0.25, d: 2.6, g: 0.06 * n3 }), t3.noise({ ft: `bandpass`, f: 3200, f2: 1800, q: 0.5, at: 1.1, a: 0.35, d: 2.4, g: 0.014 * n3 }), U(3800, 8500);
  };
}, town: (e4) => {
  let t2 = e4.band(`pink`, `lowpass`, 170, 0, 0.03);
  e4.trem(0.05, 0.3, t2.g);
  let n2 = e4.band(`pink`, `bandpass`, 850, 0.8, 6e-3);
  return e4.trem(0.11, 0.5, n2.g), e4.lfo(0.07, 120, n2.f.frequency), () => {
    let t3 = Math.random();
    if (t3 < 0.4) {
      let t4 = e4.shot(e4.panned(U(-0.8, 0.8), 3), U(0.9, 1.1)), n4 = U(470, 540);
      return t4.tone({ f: n4 * 0.92, f2: n4 * 1.04, a: 0.05, d: 0.22, g: 0.018, lin: true, lp: 900, vib: [9, 18] }), t4.tone({ at: 0.3, f: n4 * 1.05, f2: n4 * 0.86, a: 0.04, hold: 0.12, d: 0.35, g: 0.02, lin: true, lp: 900, vib: [11, 22] }), Math.random() < 0.6 && t4.tone({ at: 0.85, f: n4 * 0.95, f2: n4 * 0.84, a: 0.04, d: 0.3, g: 0.014, lin: true, lp: 900, vib: [10, 18] }), U(2500, 6e3);
    }
    if (t3 < 0.65) {
      let t4 = e4.shot(e4.panned(U(-0.7, 0.7), 5)), n4 = [1046.5, 1174.7, 1318.5, 1568, 1760, 2093], r = 2 + Math.floor(Math.random() * 4), i = 0;
      for (let e5 = 0; e5 < r; e5++) t4.ring(Bf(n4), [1, 2.76, 5.4], U(1.6, 2.6), U(4e-3, 8e-3), i), i += U(0.15, 0.6);
      return U(3e3, 7e3);
    }
    if (t3 < 0.85) return e4.shot(e4.panned(U(-0.8, 0.8), 6), U(0.9, 1.1)).noise({ kind: `pink`, ft: `bandpass`, f: 260, f2: 520, fd: 2.2, q: 0.9, a: 2, d: 2.4, g: 0.035 }), U(3e3, 8e3);
    let n3 = e4.shot(e4.panned(U(-0.7, 0.7), 4));
    for (let e5 = 0; e5 < 5; e5++) n3.noise({ at: e5 * U(0.09, 0.14), kind: `pink`, ft: `bandpass`, f: U(600, 900), q: 1.2, a: 0.01, d: 0.12, g: 0.02 });
    return U(2500, 6e3);
  };
}, alpine: (e4) => {
  let t2 = e4.band(`pink`, `bandpass`, 330, 1.1, 0.05);
  e4.lfo(0.061, 110, t2.f.frequency), e4.trem(0.047, 0.4, t2.g);
  let n2 = e4.band(`white`, `bandpass`, 1150, 9, 6e-3);
  e4.lfo(0.093, 260, n2.f.frequency), e4.trem(0.13, 0.7, n2.g);
  let r = e4.band(`white`, `highpass`, 3500, 0, 6e-3);
  return e4.trem(0.17, 0.6, r.g), () => {
    let t3 = e4.shot(e4.panned(U(-0.7, 0.7), 6), U(0.85, 1.15)), n3 = U(0.6, 1.8);
    return t3.noise({ kind: `pink`, ft: `bandpass`, f: 420, f2: 900, fd: 1.4, q: 1.4, a: 1.1, hold: n3, d: 2.2, g: 0.07 }), t3.noise({ ft: `highpass`, f: 4200, at: 0.6, a: 0.8, hold: n3 * 0.6, d: 1.6, g: 8e-3 }), U(4e3, 9e3);
  };
}, forest: (e4) => {
  let t2 = e4.band(`white`, `highpass`, 4300, 0, 0.011);
  e4.trem(0.11, 0.7, t2.g), e4.trem(0.29, 0.25, t2.g);
  let n2 = e4.band(`pink`, `bandpass`, 1900, 0.6, 0.016);
  return e4.trem(0.07, 0.6, n2.g), () => {
    let t3 = Math.random(), n3 = e4.shot(e4.panned(U(-0.85, 0.85), 4), U(0.92, 1.08));
    if (t3 < 0.2) {
      let e5 = 10 + Math.floor(Math.random() * 8), t4 = U(0.05, 0.065);
      for (let r = 0; r < e5; r++) {
        let i = 1 - r / (e5 + 4);
        n3.noise({ at: r * t4, ft: `bandpass`, f: 1500, q: 2.5, a: 1e-3, d: 0.03, g: 0.03 * i }), n3.tone({ at: r * t4, f: 640, f2: 520, a: 1e-3, d: 0.035, g: 0.012 * i });
      }
      return U(5e3, 11e3);
    }
    if (t3 < 0.4) {
      let e5 = U(640, 700);
      for (let t4 = 0; t4 < 2 + Math.floor(Math.random() * 2); t4++) n3.tone({ at: t4 * 0.75, f: e5, f2: e5 * 0.99, a: 0.03, d: 0.2, g: 0.012, lin: true, lp: 1200 }), n3.tone({ at: t4 * 0.75 + 0.24, f: e5 * 0.8, f2: e5 * 0.79, a: 0.03, d: 0.28, g: 0.011, lin: true, lp: 1200 });
      return U(5e3, 1e4);
    }
    return n3.noise({ ft: `highpass`, f: 2600, f2: 3800, a: 0.9, hold: U(0.3, 1.2), d: 1.6, g: 0.012 }), n3.noise({ kind: `pink`, ft: `bandpass`, f: 1200, q: 0.7, a: 1, hold: 0.4, d: 1.4, g: 0.012 }), U(2500, 6e3);
  };
}, meadow: (e4) => {
  let t2 = e4.band(`pink`, `bandpass`, 2600, 0.5, 5e-3);
  return e4.trem(0.09, 0.6, t2.g), () => {
    let t3 = e4.shot(e4.panned(U(-0.9, 0.9), 3), U(0.95, 1.05));
    if (Math.random() < 0.13) {
      let e5 = U(190, 240);
      return t3.tone({ type: `sawtooth`, f: e5, f2: e5 * U(0.96, 1.06), a: 0.7, hold: U(0.2, 0.6), d: 0.9, g: 4e-3, lp: 850, vib: [12, 7] }), U(2e3, 4500);
    }
    let n2 = 5 + Math.floor(Math.random() * 10), r = U(5200, 7400), i = U(0.035, 0.055), a = U(6e-3, 0.012);
    for (let e5 = 0; e5 < n2; e5++) t3.noise({ at: e5 * i, ft: `bandpass`, f: r, q: 5, a: 2e-3, d: 0.025, g: a });
    return U(900, 3200);
  };
} }, up = Object.keys(lp);
function dp(e4, t2) {
  let n2 = Sf.s, r = e4.createDynamicsCompressor();
  r.threshold.value = -8, r.knee.value = 6, r.ratio.value = 16, r.attack.value = 3e-3, r.release.value = 0.16, r.connect(e4.destination);
  let i = e4.createBiquadFilter();
  i.type = `highpass`, i.frequency.value = 26, i.Q.value = 0, i.connect(r);
  let a = e4.createGain();
  a.gain.value = t2 ? 0 : Hf(n2.master) * Of, a.connect(i);
  let o = (t3) => {
    let n3 = e4.createGain();
    return n3.gain.value = t3, n3.connect(a), n3;
  }, s2 = o(Hf(n2.sfx)), c = o(Hf(n2.ambience)), l2 = o(Hf(n2.ui)), u = e4.createGain(), d = e4.createBiquadFilter();
  d.type = `highpass`, d.frequency.value = 160, d.Q.value = 0;
  let f = e4.createConvolver();
  f.normalize = true, f.buffer = Kf(e4, jf);
  let p = e4.createGain();
  p.gain.value = Mf, u.connect(d), d.connect(f), f.connect(p), p.connect(a);
  let m = typeof e4.createStereoPanner == `function`;
  return { ctx: e4, master: a, sfx: s2, amb: c, ui: l2, reverbIn: u, noise: Gf(e4), canPan: m };
}
var W = new class {
  g = null;
  dead = false;
  muted = false;
  lx = 0;
  ly = 0;
  lz = 0;
  fx = 0;
  fz = -1;
  voices = [];
  last = /* @__PURE__ */ new Map();
  want = {};
  loops = {};
  constructor() {
    try {
      typeof location < `u` && location.search.includes(`mute`) && (this.muted = true);
    } catch {
    }
    try {
      Sf.onChange((e4) => {
        (e4 === `master` || e4 === `sfx` || e4 === `ambience` || e4 === `ui`) && this.applyVolumes();
      });
    } catch {
    }
  }
  init() {
    try {
      if (this.g) {
        Wf(this.g.ctx);
        return;
      }
      if (this.dead || typeof window > `u`) return;
      let e4 = window, t2 = e4.AudioContext ?? e4.webkitAudioContext;
      if (!t2) {
        this.dead = true;
        return;
      }
      let n2;
      try {
        n2 = new t2({ latencyHint: `interactive` });
      } catch {
        n2 = new t2();
      }
      try {
        this.g = dp(n2, this.muted);
      } catch (e5) {
        try {
          n2.close().catch(Rf);
        } catch {
        }
        throw e5;
      }
      Wf(n2);
    } catch {
      this.dead = true, this.g = null;
      return;
    }
    for (let e4 of up) try {
      this.applyLoop(e4);
    } catch {
    }
  }
  setMuted(e4) {
    try {
      if (this.muted = !!e4, !this.g) return;
      this.applyVolumes();
      for (let e5 of up) this.applyLoop(e5);
    } catch {
    }
  }
  setListener(e4, t2, n2, r, i) {
    Number.isFinite(e4) && Number.isFinite(t2) && Number.isFinite(n2) && (this.lx = e4, this.ly = t2, this.lz = n2);
    let a = Math.sqrt(r * r + i * i);
    Number.isFinite(a) && a > 1e-6 && (this.fx = r / a, this.fz = i / a);
  }
  play(e4, t2) {
    try {
      let n2 = this.g;
      if (!n2 || this.muted) return;
      let r = op[e4];
      if (!r) return;
      let i = n2.ctx, a = zf(Vf(t2?.volume, 1), 0, 4) * (r.gain ?? 1), o = false, s2 = 0, c = 0, l2 = 2e4, u = 0;
      if (t2 && (t2.x !== void 0 || t2.y !== void 0 || t2.z !== void 0)) {
        o = true;
        let e5 = Vf(t2.x, this.lx) - this.lx, n3 = Vf(t2.y, this.ly) - this.ly, r2 = Vf(t2.z, this.lz) - this.lz;
        if (s2 = Math.sqrt(e5 * e5 + n3 * n3 + r2 * r2), s2 >= Df) return;
        if (a *= Uf(s2), l2 = 2e4 * Math.exp(-s2 / 40), s2 > kf && (u = Math.min(s2 / 343, Af)), s2 > 0.5) {
          let t3 = zf(s2 / 4, 0, 1), n4 = (e5 * -this.fz + r2 * this.fx) / s2, i2 = (e5 * this.fx + r2 * this.fz) / s2;
          c = zf(n4 * 0.9, -1, 1) * t3, i2 < 0 && (l2 *= 1 + 0.35 * i2 * t3);
        }
        l2 = zf(l2, 350, i.sampleRate / 2 - 200);
      }
      if (!(a > 4e-4)) return;
      let d = performance.now(), f = this.last.get(e4);
      if (f && d - f.t < wf && a <= f.g * 1.5 || i.state !== `running` && (Wf(i), this.voices.length >= 3)) return;
      let p = i.currentTime;
      if (this.prune(p), o && this.voices.length >= Cf) return;
      f ? (f.t = d, f.g = a) : this.last.set(e4, { t: d, g: a });
      let m = p + 4e-3 + u, h = i.createGain();
      h.gain.value = a;
      let g2 = { end: m + 0.2, nodes: [h] }, _2 = h;
      if (o) {
        let e5 = i.createBiquadFilter();
        if (e5.type = `lowpass`, e5.frequency.value = l2, e5.Q.value = 0, _2.connect(e5), _2 = e5, g2.nodes.push(e5), n2.canPan && Math.abs(c) > 0.01) {
          let e6 = i.createStereoPanner();
          e6.pan.value = c, _2.connect(e6), _2 = e6, g2.nodes.push(e6);
        }
      }
      let v = r.ui === true;
      if (_2.connect(v ? n2.ui : n2.sfx), r.rev) {
        let e5 = i.createGain();
        e5.gain.value = r.rev * Hf(v ? Sf.s.ui : Sf.s.sfx) * (1 + Math.min(s2 / 60, 1.5)), _2.connect(e5), e5.connect(n2.reverbIn), g2.nodes.push(e5);
      }
      this.voices.push(g2);
      let y = zf(Vf(t2?.pitch, 1), 0.25, 4) * (r.jit ? 1 + U(-0.04, 0.04) : 1), b = new Xf(i, n2.noise, h, m, y);
      r.fn(b), g2.end = m + b.end + 0.05;
    } catch {
    }
  }
  setLoop(e4, t2) {
    try {
      this.want[e4] = zf(Vf(t2, 0), 0, 1), this.applyLoop(e4);
    } catch {
    }
  }
  applyVolumes() {
    try {
      let e4 = this.g;
      if (!e4) return;
      let t2 = Sf.s, n2 = e4.ctx.currentTime;
      e4.master.gain.setTargetAtTime(this.muted ? 0 : Hf(t2.master) * Of, n2, 0.02), e4.sfx.gain.setTargetAtTime(Hf(t2.sfx), n2, 0.02), e4.amb.gain.setTargetAtTime(Hf(t2.ambience), n2, 0.02), e4.ui.gain.setTargetAtTime(Hf(t2.ui), n2, 0.02);
    } catch {
    }
  }
  // ===== MUSIC SYSTEM =====
  musicOn = false;
  musicTimer = null;
  musicStep = 0;
  startMusic() {
    if (this.musicOn || !this.g || !Sf.s.music) return;
    this.musicOn = true;
    this.musicStep = 0;
    let ctx = this.g.ctx;
    let playNote = (freq, time, dur, vol, type = `sine`) => {
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + dur);
      osc.connect(gain);
      gain.connect(this.g.master);
      osc.start(time);
      osc.stop(time + dur);
    };
    let scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C major pentatonic
    let bass = [130.81, 98.00, 110.00, 87.31]; // C, G, A, F
    this.musicTimer = setInterval(() => {
      if (!this.musicOn || !this.g) return;
      let t = ctx.currentTime + 0.1;
      let step = this.musicStep % 16;
      // Bass on beats
      if (step % 4 === 0) playNote(bass[Math.floor(step / 4) % 4], t, 0.4, 0.15, `triangle`);
      // Melody
      if (Math.random() < 0.7) {
        let note = scale[Math.floor(Math.random() * scale.length)];
        playNote(note, t, 0.3, 0.08, `sine`);
      }
      this.musicStep++;
    }, 300);
  }
  stopMusic() {
    this.musicOn = false;
    if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null; }
  }
  playStinger(type) {
    if (!this.g) return;
    let ctx = this.g.ctx;
    let t = ctx.currentTime + 0.05;
    let playNote = (freq, time, dur, vol) => {
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.type = `sine`;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + dur);
      osc.connect(gain);
      gain.connect(this.g.master);
      osc.start(time);
      osc.stop(time + dur);
    };
    if (type === `victory`) {
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => playNote(f, t + i * 0.15, 0.5, 0.2));
    } else if (type === `defeat`) {
      [392.00, 329.63, 261.63, 196.00].forEach((f, i) => playNote(f, t + i * 0.2, 0.6, 0.15));
    } else if (type === `emote`) {
      // Dance emote music - upbeat loop
      [440.00, 523.25, 659.25, 523.25, 440.00, 392.00].forEach((f, i) => playNote(f, t + i * 0.12, 0.25, 0.12));
    }
  }
  prune(e4) {
    let t2 = this.voices, n2 = 0;
    for (let r = 0; r < t2.length; r++) {
      let i = t2[r];
      if (i.end > e4) t2[n2++] = i;
      else for (let e5 of i.nodes) try {
        e5.disconnect();
      } catch {
      }
    }
    t2.length = n2;
  }
  applyLoop(e4) {
    let t2 = this.g;
    if (!t2) return;
    let n2 = this.muted ? 0 : this.want[e4] ?? 0, r = this.loops[e4];
    if (!r) {
      if (n2 <= 0) return;
      r = this.buildLoop(t2, e4), this.loops[e4] = r;
    }
    if (n2 === r.level || n2 > 0 && r.level > 0 && Math.abs(n2 - r.level) < 4e-3) return;
    r.level = n2;
    let i = t2.ctx.currentTime;
    if (r.gain.gain.cancelScheduledValues(i), r.gain.gain.setTargetAtTime(n2 * Lf[e4], i, Nf), n2 > 0) r.reaper !== null && (clearTimeout(r.reaper), r.reaper = null), r.tick && r.timer === null && this.arm(r, U(250, 1600));
    else if (r.timer !== null && (clearTimeout(r.timer), r.timer = null), r.reaper === null) {
      let t3 = r;
      r.reaper = setTimeout(() => this.reap(e4, t3), Pf);
    }
  }
  buildLoop(e4, t2) {
    let n2 = e4.ctx.createGain();
    n2.gain.value = 0, n2.connect(e4.amb);
    let r = new sp(e4.ctx, e4.noise, n2, e4.canPan);
    return { gain: n2, level: 0, tick: lp[t2](r), timer: null, reaper: null, sources: r.sources };
  }
  arm(e4, t2) {
    e4.timer = setTimeout(() => {
      if (e4.timer = null, e4.level <= 0 || !e4.tick) return;
      let t3 = 1e3;
      try {
        let n2 = this.g;
        n2 && n2.ctx.state === `running` && (t3 = e4.tick());
      } catch {
      }
      this.arm(e4, Math.max(60, t3));
    }, t2);
  }
  reap(e4, t2) {
    if (t2.reaper = null, !(t2.level > 0)) {
      t2.timer !== null && (clearTimeout(t2.timer), t2.timer = null);
      for (let e5 of t2.sources) try {
        e5.stop();
      } catch {
      }
      try {
        t2.gain.disconnect();
      } catch {
      }
      this.loops[e4] === t2 && delete this.loops[e4];
    }
  }
}(), fp = new R(0.52, 0.7, 0.42).normalize(), pp = 0.42, mp = 1.8, hp = 0.62, gp = 8.6, _p = 5.4, vp = 7.9, yp = 2.9, bp = 2.2, xp = { wood: 150, stone: 300, metal: 450 }, G = { fighters: [], time: 0, phase: `lobby`, alive: 0 }, Sp = Math.PI * 2, Cp = (e4, t2, n2) => e4 < t2 ? t2 : e4 > n2 ? n2 : e4, wp = (e4) => e4 < 0 ? 0 : e4 > 1 ? 1 : e4, Tp = (e4, t2, n2) => e4 + (t2 - e4) * n2, Ep = (e4, t2, n2) => {
  let r = wp((n2 - e4) / (t2 - e4));
  return r * r * (3 - 2 * r);
}, Dp = (e4, t2, n2, r) => Tp(e4, t2, 1 - Math.exp(-n2 * r)), Op = (e4) => (e4 = (e4 + Math.PI) % Sp, e4 < 0 && (e4 += Sp), e4 - Math.PI), kp = (e4, t2) => Op(t2 - e4), Ap = (e4, t2, n2, r) => e4 + kp(e4, t2) * (1 - Math.exp(-n2 * r)), jp = class {
  s;
  constructor(e4) {
    this.s = e4 >>> 0 || 1;
  }
  next() {
    let e4 = this.s += 1831565813;
    return e4 = Math.imul(e4 ^ e4 >>> 15, e4 | 1), e4 ^= e4 + Math.imul(e4 ^ e4 >>> 7, e4 | 61), ((e4 ^ e4 >>> 14) >>> 0) / 4294967296;
  }
  range(e4, t2) {
    return e4 + (t2 - e4) * this.next();
  }
  int(e4, t2) {
    return Math.floor(this.range(e4, t2 + 1));
  }
  chance(e4) {
    return this.next() < e4;
  }
  pick(e4) {
    return e4[Math.floor(this.next() * e4.length)];
  }
  sign() {
    return this.next() < 0.5 ? -1 : 1;
  }
  gauss() {
    return (this.next() + this.next() + this.next() + this.next() - 2) * 1.732;
  }
}, K = (e4 = 0, t2 = 1) => e4 + (t2 - e4) * Math.random(), Mp = (e4, t2) => Math.floor(K(e4, t2 + 1)), Np = (e4) => e4[Math.floor(Math.random() * e4.length)], Pp = (e4) => Math.random() < e4, Fp = () => (Math.random() + Math.random() + Math.random() + Math.random() - 2) * 1.732, Ip = new Uint8Array(512), Lp = new Float32Array(256), Rp = new Float32Array(256);
function zp(e4) {
  let t2 = new jp(e4), n2 = new Uint8Array(256);
  for (let e5 = 0; e5 < 256; e5++) n2[e5] = e5;
  for (let e5 = 255; e5 > 0; e5--) {
    let r = Math.floor(t2.next() * (e5 + 1)), i = n2[e5];
    n2[e5] = n2[r], n2[r] = i;
  }
  for (let e5 = 0; e5 < 512; e5++) Ip[e5] = n2[e5 & 255];
  for (let e5 = 0; e5 < 256; e5++) {
    let n3 = t2.next() * Sp;
    Lp[e5] = Math.cos(n3), Rp[e5] = Math.sin(n3);
  }
}
zp(1337);
var Bp = (e4) => e4 * e4 * e4 * (e4 * (e4 * 6 - 15) + 10);
function Vp(e4, t2) {
  let n2 = Math.floor(e4), r = Math.floor(t2), i = e4 - n2, a = t2 - r, o = n2 & 255, s2 = r & 255, c = Ip[Ip[o] + s2], l2 = Ip[Ip[o] + s2 + 1], u = Ip[Ip[o + 1] + s2], d = Ip[Ip[o + 1] + s2 + 1], f = Bp(i), p = Bp(a), m = Lp[c] * i + Rp[c] * a, h = Lp[u] * (i - 1) + Rp[u] * a, g2 = Lp[l2] * i + Rp[l2] * (a - 1), _2 = Lp[d] * (i - 1) + Rp[d] * (a - 1);
  return Tp(Tp(m, h, f), Tp(g2, _2, f), p) * 1.45;
}
function Hp(e4, t2, n2 = 4, r = 2, i = 0.5) {
  let a = 0.5, o = 1, s2 = 0, c = 0;
  for (let l2 = 0; l2 < n2; l2++) s2 += a * Vp(e4 * o, t2 * o), c += a, a *= i, o *= r;
  return s2 / c;
}
function Up(e4, t2, n2 = 4) {
  let r = 0.5, i = 1, a = 0, o = 0;
  for (let s2 = 0; s2 < n2; s2++) {
    let n3 = 1 - Math.abs(Vp(e4 * i, t2 * i));
    a += r * n3 * n3, o += r, r *= 0.5, i *= 2.05;
  }
  return a / o;
}
function Wp(e4, t2) {
  let n2 = e4 * 374761393 + t2 * 668265263 | 0;
  return n2 = Math.imul(n2 ^ n2 >>> 13, 1274126177), ((n2 ^ n2 >>> 16) >>> 0) / 4294967296;
}
function Gp(e4) {
  let t2 = Math.max(0, Math.ceil(e4));
  return `${Math.floor(t2 / 60)}:${String(t2 % 60).padStart(2, `0`)}`;
}
var Kp = `
attribute vec3 aPos;
attribute vec4 aData;   // size, alpha, rotation, shape
attribute vec3 aCol;
attribute vec3 aVel;
varying vec2 vUv;
varying vec4 vCol;
varying float vShape;
void main() {
  vUv = position.xy;
  float c = cos(aData.z), s = sin(aData.z);
  vec2 q = position.xy;
  vec4 mv = modelViewMatrix * vec4(aPos, 1.0);
  if (aData.w > 5.5) {
    vec2 d = (modelViewMatrix * vec4(aVel, 0.0)).xy;
    float L = length(d);
    vec2 dir = L > 1e-4 ? d / L : vec2(0.0, 1.0);
    vec2 nrm = vec2(-dir.y, dir.x);
    mv.xy += dir * q.y * aData.x * (1.0 + min(L, 40.0) * 0.12) + nrm * q.x * aData.x * 0.32;
  } else {
    if (aData.w > 2.5 && aData.w < 3.5) q.x *= 0.05; else q = vec2(q.x * c - q.y * s, q.x * s + q.y * c);
    mv.xy += q * aData.x;
  }
  gl_Position = projectionMatrix * mv;
  vCol = vec4(aCol, aData.y);
  vShape = aData.w;
}`, qp = `
varying vec2 vUv;
varying vec4 vCol;
varying float vShape;
void main() {
  vec2 p = vUv * 2.0;
  float d = length(p);
  float a;
  if (vShape < 0.5) a = pow(max(1.0 - d, 0.0), 1.7);
  else if (vShape < 1.5) a = smoothstep(1.0, 0.8, max(abs(p.x), abs(p.y)));
  else if (vShape < 2.5) a = smoothstep(1.0, 0.15, d);
  else if (vShape < 3.5) a = 1.0 - abs(vUv.y) * 2.0;
  else if (vShape < 4.5) {
    float ax = abs(p.x), ay = abs(p.y);
    float star = max(1.0 - (ax * 7.0 + ay), 0.0) + max(1.0 - (ay * 7.0 + ax), 0.0);
    a = clamp(star * 1.4 + pow(max(1.0 - d * 1.6, 0.0), 2.0), 0.0, 1.0);
  } else if (vShape < 5.5) {
    // triangle shard
    float e = max(-p.y * 0.5 - 0.35, abs(p.x) * 0.866 + p.y * 0.5 - 0.35);
    a = smoothstep(0.08, 0.0, e);
  } else {
    a = smoothstep(1.0, 0.25, abs(p.x)) * smoothstep(1.0, 0.45, abs(p.y));
  }
  if (a * vCol.a < 0.004) discard;
  gl_FragColor = vec4(vCol.rgb, vCol.a * a);
}`, Jp = class {
  max;
  mesh;
  n = 0;
  pos;
  data;
  col;
  vel;
  misc;
  phys;
  fade;
  aPos;
  aData;
  aCol;
  aVel;
  geo;
  constructor(e4, t2) {
    this.max = e4, this.pos = new Float32Array(e4 * 3), this.data = new Float32Array(e4 * 4), this.col = new Float32Array(e4 * 3), this.vel = new Float32Array(e4 * 3), this.misc = new Float32Array(e4 * 4), this.phys = new Float32Array(e4 * 4), this.fade = new Float32Array(e4);
    let n2 = new Rc();
    n2.setAttribute(`position`, new V([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0], 3)), n2.setIndex([0, 1, 2, 0, 2, 3]), this.aPos = new Xi(this.pos, 3).setUsage(Je), this.aData = new Xi(this.data, 4).setUsage(Je), this.aCol = new Xi(this.col, 3).setUsage(Je), this.aVel = new Xi(this.vel, 3).setUsage(Je), n2.setAttribute(`aPos`, this.aPos), n2.setAttribute(`aData`, this.aData), n2.setAttribute(`aCol`, this.aCol), n2.setAttribute(`aVel`, this.aVel), n2.instanceCount = 0, this.geo = n2, this.mesh = new Mi(n2, new Es({ vertexShader: Kp, fragmentShader: qp, transparent: true, depthWrite: false, blending: t2 ? 2 : 1 })), this.mesh.frustumCulled = false, this.mesh.renderOrder = t2 ? 31 : 30;
  }
  get count() {
    return this.n;
  }
  spawn(e4, t2, n2, r, i, a, o, s2, c, l2, u, d, f, p, m, h, g2 = 0, _2 = 0) {
    if (this.n >= this.max) return;
    let v = this.n++;
    this.pos[v * 3] = e4, this.pos[v * 3 + 1] = t2, this.pos[v * 3 + 2] = n2, this.vel[v * 3] = r, this.vel[v * 3 + 1] = i, this.vel[v * 3 + 2] = a, this.col[v * 3] = o, this.col[v * 3 + 1] = s2, this.col[v * 3 + 2] = c, this.data[v * 4] = u, this.data[v * 4 + 1] = l2, this.data[v * 4 + 2] = Math.random() * 6.28, this.data[v * 4 + 3] = h, this.misc[v * 4] = f, this.misc[v * 4 + 1] = f, this.misc[v * 4 + 2] = u, this.misc[v * 4 + 3] = d, this.phys[v * 4] = p, this.phys[v * 4 + 1] = m, this.phys[v * 4 + 2] = g2, this.phys[v * 4 + 3] = l2, this.fade[v] = _2, _2 > 0 && (this.data[v * 4 + 1] = 0);
  }
  update(e4) {
    let { pos: t2, vel: n2, data: r, col: i, misc: a, phys: o, fade: s2 } = this;
    for (let c = 0; c < this.n; c++) {
      if (a[c * 4] -= e4, a[c * 4] <= 0) {
        let e5 = --this.n;
        if (e5 !== c) {
          for (let r2 = 0; r2 < 3; r2++) t2[c * 3 + r2] = t2[e5 * 3 + r2], n2[c * 3 + r2] = n2[e5 * 3 + r2], i[c * 3 + r2] = i[e5 * 3 + r2];
          for (let t3 = 0; t3 < 4; t3++) r[c * 4 + t3] = r[e5 * 4 + t3], a[c * 4 + t3] = a[e5 * 4 + t3], o[c * 4 + t3] = o[e5 * 4 + t3];
          s2[c] = s2[e5];
        }
        c--;
        continue;
      }
      let l2 = 1 - a[c * 4] / a[c * 4 + 1], u = Math.exp(-o[c * 4 + 1] * e4);
      n2[c * 3] *= u, n2[c * 3 + 1] = n2[c * 3 + 1] * u - o[c * 4] * e4, n2[c * 3 + 2] *= u, t2[c * 3] += n2[c * 3] * e4, t2[c * 3 + 1] += n2[c * 3 + 1] * e4, t2[c * 3 + 2] += n2[c * 3 + 2] * e4, r[c * 4] = a[c * 4 + 2] + (a[c * 4 + 3] - a[c * 4 + 2]) * l2, r[c * 4 + 1] = o[c * 4 + 3] * (1 - l2 * l2) * (s2[c] > 0 ? Math.min(1, l2 / s2[c]) : 1), r[c * 4 + 2] += o[c * 4 + 2] * e4;
    }
    this.geo.instanceCount = this.n, this.n > 0 && (this.aPos.needsUpdate = true, this.aData.needsUpdate = true, this.aCol.needsUpdate = true, this.aVel.needsUpdate = true, this.aPos.addUpdateRange(0, this.n * 3), this.aData.addUpdateRange(0, this.n * 4), this.aCol.addUpdateRange(0, this.n * 3), this.aVel.addUpdateRange(0, this.n * 3));
  }
  clearRanges() {
    this.aPos.clearUpdateRanges(), this.aData.clearUpdateRanges(), this.aCol.clearUpdateRanges(), this.aVel.clearUpdateRanges();
  }
}, Yp = new B(), Xp = new B(), Zp = new R(), Qp = new R(0, 0, 1);
new It();
var $p = { h: 0, s: 0, l: 0 };
function em() {
  let e4 = document.createElement(`canvas`);
  e4.width = 64, e4.height = 128;
  let t2 = e4.getContext(`2d`), n2 = t2.createImageData(64, 128);
  for (let e5 = 0; e5 < 128; e5++) for (let t3 = 0; t3 < 64; t3++) {
    let r2 = (t3 + 0.5) / 64 * 2 - 1, i = (e5 + 0.5) / 128, a = (1 - i) * 0.9 * (0.72 + 0.28 * Math.cos(i * 26)) + 0.04, o = Math.max(0, 1 - Math.abs(r2) / a), s2 = o ** 2.2 * (1 - i) ** 0.6, c = Math.min(1, o ** 1.1 * (1 - i) ** 1.4 * 1.6), l2 = (e5 * 64 + t3) * 4;
    n2.data[l2] = 255, n2.data[l2 + 1] = Math.round(170 + 85 * s2), n2.data[l2 + 2] = Math.round(60 + 195 * s2), n2.data[l2 + 3] = Math.round(c * 255);
  }
  t2.putImageData(n2, 0, 0);
  let r = new Na(e4);
  return r.colorSpace = He, r;
}
function tm() {
  let e4 = [], t2 = [], n2 = (n3, r2, i2, a2, o) => {
    let s2 = Math.cos(r2), c = Math.sin(r2), l2 = s2 * n3 / 2, u = c * n3 / 2, d = [[-l2, -u, 0, i2], [l2, u, 0, i2], [l2, u, 1, a2], [-l2, -u, 0, i2], [l2, u, 1, a2], [-l2, -u, 1, a2]];
    for (let [n4, r3, i3, a3] of d) e4.push(n4, r3, i3), t2.push(o.r * a3, o.g * a3, o.b * a3);
  }, r = new B(1, 0.62, 0.22), i = new B(1.6, 1.45, 1.1);
  for (let e5 of [0, Math.PI / 2]) n2(1, e5, 0, 1, r), n2(0.32, e5, 0.05, 1.2, i);
  let a = new Hr();
  return a.setAttribute(`position`, new V(e4, 3)), a.setAttribute(`color`, new V(t2, 3)), a;
}
var nm = `
varying float vRim;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vec3 n = normalize(normalMatrix * normal);
  vRim = 1.0 - abs(dot(n, normalize(-mv.xyz)));
  gl_Position = projectionMatrix * mv;
}`, rm = `
uniform vec3 uCol;
uniform float uAlpha;
varying float vRim;
void main() { gl_FragColor = vec4(uCol, uAlpha * pow(vRim, 2.5)); }`;
function im(e4) {
  return Yp.setHex(e4).getHSL($p), $p.s < 0.16 ? $p.l > 0.35 && $p.l < 0.85 ? `stone` : `metal` : $p.h > 0.5 && $p.h < 0.68 && $p.s < 0.4 ? `metal` : $p.h > 0.04 && $p.h < 0.13 && $p.l < 0.62 ? `wood` : $p.h > 0.18 && $p.h < 0.45 ? `leaf` : `other`;
}
var am = new class {
  group = new Pn();
  add = new Jp(4200, true);
  solid = new Jp(3200, false);
  tracers = [];
  rings = [];
  shells = [];
  beams = [];
  flashes = [];
  mflashes = [];
  emitters = [];
  pending = [];
  init() {
    this.group.add(this.add.mesh, this.solid.mesh);
    let e4 = tm();
    for (let t3 = 0; t3 < 48; t3++) {
      let t4 = new bi({ vertexColors: true, transparent: true, blending: 2, depthWrite: false, toneMapped: false, side: 2 }), n3 = new Mi(e4, t4);
      n3.visible = false, n3.frustumCulled = false, n3.renderOrder = 32, this.group.add(n3), this.tracers.push({ mesh: n3, mat: t4, ox: 0, oy: 0, oz: 0, dx: 0, dy: 0, dz: 1, dist: 0, head: 0, len: 0, t: 0, active: false });
    }
    let t2 = new hs(0.82, 1, 48).rotateX(-Math.PI / 2);
    for (let e5 = 0; e5 < 14; e5++) {
      let e6 = new Mi(t2, new bi({ transparent: true, blending: 2, depthWrite: false, side: 2, toneMapped: false }));
      e6.visible = false, e6.renderOrder = 32, this.group.add(e6), this.rings.push({ mesh: e6, t: 0, life: 1, size: 1, active: false });
    }
    let n2 = new fs(1, 3);
    for (let e5 = 0; e5 < 5; e5++) {
      let e6 = new Es({ vertexShader: nm, fragmentShader: rm, transparent: true, depthWrite: false, blending: 2, uniforms: { uCol: { value: new B() }, uAlpha: { value: 0 } } }), t3 = new Mi(n2, e6);
      t3.visible = false, t3.renderOrder = 32, this.group.add(t3), this.shells.push({ mesh: t3, mat: e6, t: 0, life: 1, size: 1, active: false });
    }
    let r = new Ba(1, 1, 1, 18, 1, true).translate(0, 0.5, 0);
    for (let e5 = 0; e5 < 8; e5++) {
      let e6 = new Mi(r, new bi({ color: new B(0.6, 1.6, 3.2), transparent: true, blending: 2, depthWrite: false, side: 2, toneMapped: false }));
      e6.visible = false, e6.renderOrder = 32, this.group.add(e6), this.beams.push({ mesh: e6, t: 0, life: 1, active: false });
    }
    let i = em(), a = new Hr();
    {
      let e5 = [], t3 = [];
      for (let n3 = 0; n3 < 3; n3++) {
        let r2 = n3 * Math.PI / 3, i2 = Math.cos(r2) * 0.5, a2 = Math.sin(r2) * 0.5;
        e5.push(-i2, -a2, 0, i2, a2, 0, i2, a2, 1, -i2, -a2, 0, i2, a2, 1, -i2, -a2, 1), t3.push(0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1);
      }
      a.setAttribute(`position`, new V(e5, 3)), a.setAttribute(`uv`, new V(t3, 2));
    }
    for (let e5 = 0; e5 < 12; e5++) {
      let e6 = new bi({ map: i, color: new B(2.4, 2, 1.5), transparent: true, blending: 2, depthWrite: false, side: 2, toneMapped: false }), t3 = new Mi(a, e6);
      t3.visible = false, t3.frustumCulled = false, t3.renderOrder = 33, this.group.add(t3), this.mflashes.push({ mesh: t3, mat: e6, t: 0, life: 0.05, active: false });
    }
    for (let e5 = 0; e5 < 3; e5++) {
      let e6 = new Mc(16777215, 0, 26, 2);
      this.group.add(e6), this.flashes.push({ light: e6, t: 1, life: 1, peak: 0 });
    }
  }
  later(e4, t2) {
    this.pending.push({ t: e4, fn: t2 });
  }
  spark(e4, t2, n2, r, i, a = 6, o = 0.16, s2 = 0.45, c = 9, l2 = 2.6) {
    Yp.setHex(r);
    for (let r2 = 0; r2 < i; r2++) {
      let i2 = Math.random() * 6.283, u = Math.random() * 2 - 1, d = Math.sqrt(1 - u * u), f = a * K(0.35, 1);
      this.add.spawn(e4, t2, n2, Math.cos(i2) * d * f, u * f + a * 0.3, Math.sin(i2) * d * f, Yp.r * l2, Yp.g * l2, Yp.b * l2, 1, o * K(0.6, 1.3), 0.01, s2 * K(0.6, 1.2), c, 1.5, r2 % 3 == 0 ? 0 : 6);
    }
  }
  chips(e4, t2, n2, r, i, a, o, s2, c = 4.5, l2 = 0.13) {
    Yp.setHex(o);
    for (let o2 = 0; o2 < s2; o2++) {
      let s3 = K(0.65, 1.15);
      this.solid.spawn(e4, t2, n2, r * c * K(0.2, 1) + K(-1, 1) * c * 0.5, i * c * K(0.2, 1) + K(0.2, 1) * c * 0.7, a * c * K(0.2, 1) + K(-1, 1) * c * 0.5, Yp.r * s3, Yp.g * s3, Yp.b * s3, 1, l2 * K(0.6, 1.5), l2 * 0.4, K(0.45, 0.9), 16, 0.6, o2 % 4 == 3 ? 5 : 1, K(-9, 9));
    }
  }
  puff(e4, t2, n2, r, i, a = 0.7, o = 0.7, s2 = 1.2, c = 0.8, l2 = 0.55) {
    Yp.setHex(r);
    for (let r2 = 0; r2 < i; r2++) {
      let r3 = K(0.92, 1.08);
      this.solid.spawn(e4 + K(-0.2, 0.2), t2 + K(-0.1, 0.2), n2 + K(-0.2, 0.2), K(-1, 1) * s2, K(0.2, 1) * c, K(-1, 1) * s2, Yp.r * r3, Yp.g * r3, Yp.b * r3, l2, a * K(0.5, 0.9), a * K(1.6, 2.4), o * K(0.7, 1.3), -0.3, 2.2, 2, K(-1, 1));
    }
  }
  star(e4, t2, n2, r, i, a = 0.08, o = 3) {
    Yp.setHex(r), this.add.spawn(e4, t2, n2, 0, 0, 0, Yp.r * o, Yp.g * o, Yp.b * o, 1, i, i * 0.4, a, 0, 0, 4, K(-2, 2));
  }
  flash(e4, t2, n2, r, i, a) {
    let o = this.flashes[0], s2 = -1;
    for (let e5 of this.flashes) {
      if (e5.t >= e5.life) {
        o = e5;
        break;
      }
      let t3 = e5.peak * (1 - e5.t / e5.life);
      (s2 < 0 || t3 < s2) && (s2 = t3, o = e5);
    }
    o.light.position.set(e4, t2, n2), o.light.color.setHex(r), o.t = 0, o.life = a, o.peak = i;
  }
  tracer(e4, t2, n2, r, i, a, o = 16765562) {
    let s2 = this.tracers.find((e5) => !e5.active);
    if (!s2) return;
    let c = r - e4, l2 = i - t2, u = a - n2, d = Math.hypot(c, l2, u);
    d < 1.5 || (s2.ox = e4, s2.oy = t2, s2.oz = n2, s2.dx = c / d, s2.dy = l2 / d, s2.dz = u / d, s2.dist = d, s2.head = Math.min(d, 5), s2.len = Math.min(d, 14), s2.t = 0, s2.active = true, s2.mesh.visible = true, s2.mesh.quaternion.setFromUnitVectors(Qp, Zp.set(s2.dx, s2.dy, s2.dz)), s2.mat.color.setHex(o).multiplyScalar(1.6), s2.mat.opacity = 1);
  }
  ring(e4, t2, n2, r, i, a = 0.45, o = 2.5) {
    let s2 = this.rings.find((e5) => !e5.active);
    s2 && (s2.mesh.position.set(e4, t2, n2), s2.t = 0, s2.life = a, s2.size = i, s2.active = true, s2.mesh.visible = true, s2.mesh.material.color.setHex(r).multiplyScalar(o));
  }
  shockwave(e4, t2, n2, r, i, a = 0.35) {
    let o = this.shells.find((e5) => !e5.active);
    o && (o.mesh.position.set(e4, t2, n2), o.t = 0, o.life = a, o.size = i, o.active = true, o.mesh.visible = true, o.mat.uniforms.uCol.value.setHex(r).multiplyScalar(1.3));
  }
  muzzle(e4, t2, n2, r, i, a, o, s2) {
    let c = this.mflashes.find((e5) => !e5.active);
    if (c) {
      let s3 = o ? K(0.75, 1) : K(0.4, 0.58), l3 = o ? K(0.42, 0.55) : K(0.24, 0.32);
      c.mesh.position.set(e4, t2, n2), c.mesh.quaternion.setFromUnitVectors(Qp, Zp.set(r, i, a)), c.mesh.rotateZ(Math.random() * Math.PI), c.mesh.scale.set(l3, l3, s3), c.t = 0, c.life = o ? 0.06 : 0.045, c.active = true, c.mesh.visible = true, c.mat.opacity = 1;
    }
    this.add.spawn(e4 + r * 0.06, t2 + i * 0.06, n2 + a * 0.06, 0, 0, 0, 4, 3.1, 1.6, 1, o ? 0.95 : 0.55, 0.15, o ? 0.06 : 0.045, 0, 0, 4, 0), this.add.spawn(e4 + r * 0.04, t2 + i * 0.04, n2 + a * 0.04, 0, 0, 0, 3.6, 3.2, 2.4, 1, o ? 0.45 : 0.28, 0.05, 0.04, 0, 0, 0);
    let l2 = o ? 6 : 3;
    for (let s3 = 0; s3 < l2; s3++) {
      let s4 = K(6, o ? 22 : 14);
      this.add.spawn(e4, t2, n2, r * s4 + K(-1.6, 1.6), i * s4 + K(-1.6, 1.6), a * s4 + K(-1.6, 1.6), 3.6, 2.2, 0.8, 1, K(0.05, o ? 0.12 : 0.08), 0.01, K(0.06, 0.14), 2, 4, 6);
    }
    o && this.puff(e4 + r * 0.3, t2 + i * 0.3, n2 + a * 0.3, 13816530, 3, 0.28, 0.55, 0.5, 0.5, 0.22), s2 && this.flash(e4, t2, n2, 16761446, o ? 34 : 18, 0.07);
  }
  impact(e4, t2, n2, r, i, a, o) {
    let s2 = im(o), c = e4 + r * 0.04, l2 = t2 + i * 0.04, u = n2 + a * 0.04;
    if (this.add.spawn(c, l2, u, 0, 0, 0, 3.2, 2.6, 1.6, 1, s2 === `metal` ? 0.5 : 0.34, 0.05, 0.06, 0, 0, 4, 0), s2 === `metal`) {
      for (let e5 = 0; e5 < 9; e5++) {
        let e6 = K(5, 13);
        this.add.spawn(c, l2, u, (r + K(-0.8, 0.8)) * e6, (i + K(-0.4, 1)) * e6, (a + K(-0.8, 0.8)) * e6, 3.8, 2.6, 1.1, 1, K(0.04, 0.08), 0.01, K(0.15, 0.35), 14, 1.2, 6);
      }
      this.puff(c, l2, u, 12106948, 1, 0.22, 0.3, 0.4, 0.3, 0.3);
    } else if (s2 === `wood`) {
      Yp.setHex(o);
      for (let e5 = 0; e5 < 6; e5++) {
        let e6 = K(2.5, 5.5);
        this.solid.spawn(c, l2, u, (r + K(-0.7, 0.7)) * e6, (i + K(0, 1.1)) * e6, (a + K(-0.7, 0.7)) * e6, Yp.r * 1.1, Yp.g * 1.05, Yp.b, 1, K(0.06, 0.12), 0.05, K(0.4, 0.75), 15, 0.5, 6, 0);
      }
      this.puff(c, l2, u, o, 1, 0.3, 0.4, 0.5, 0.4, 0.4);
    } else if (this.chips(c, l2, u, r, i, a, o, s2 === `stone` ? 6 : 4, 3.5, 0.08), this.puff(c, l2, u, s2 === `leaf` ? o : Xp.setHex(o).lerp(Yp.setHex(14273712), 0.5).getHex(), s2 === `stone` ? 2 : 1, 0.32, 0.45, 0.5, 0.45, 0.45), s2 !== `leaf`) for (let e5 = 0; e5 < 3; e5++) {
      let e6 = K(4, 9);
      this.add.spawn(c, l2, u, (r + K(-0.8, 0.8)) * e6, (i + K(-0.3, 1)) * e6, (a + K(-0.8, 0.8)) * e6, 3.2, 2.2, 1, 1, 0.05, 0.01, K(0.1, 0.22), 12, 1.5, 6);
    }
  }
  explosion(e4, t2, n2, r = 1) {
    this.flash(e4, t2 + 1, n2, 16752704, 180, 0.35), this.add.spawn(e4, t2 + 0.6, n2, 0, 0, 0, 3.2, 2.6, 1.6, 1, 2.2 * r, 4.5 * r, 0.07, 0, 0, 4, 0), this.add.spawn(e4, t2 + 0.6, n2, 0, 0, 0, 2, 1.1, 0.3, 1, 2.2 * r, 4.5 * r, 0.09, 0, 0, 0);
    for (let i = 0; i < 18; i++) {
      let a = Math.random() * 6.283, o = Math.random() * 1.4 - 0.4, s2 = Math.sqrt(Math.max(0, 1 - o * o)), c = K(3, 8) * r, l2 = i < 6 ? K(0.6, 1) : K(0, 0.5);
      this.solid.spawn(e4 + K(-0.6, 0.6) * r, t2 + K(0.5, 1.4) * r, n2 + K(-0.6, 0.6) * r, Math.cos(a) * s2 * c, o * c + 2.4, Math.sin(a) * s2 * c, 1.45, 0.34 + l2 * 0.5, 0.04 + l2 * 0.1, 0.96, K(2.2, 3.2) * r, K(4.2, 5.6) * r, K(0.55, 0.95), -3.5, 3.4, 2, K(-1, 1));
    }
    for (let i = 0; i < 34; i++) {
      let i2 = Math.random() * 6.283, a = Math.random() * 1.5 - 0.3, o = Math.sqrt(Math.max(0, 1 - a * a)), s2 = K(9, 24) * r;
      this.add.spawn(e4, t2 + 0.4, n2, Math.cos(i2) * o * s2, a * s2 + 3, Math.sin(i2) * o * s2, 4.4, 2.2, 0.7, 1, K(0.1, 0.2) * Math.sqrt(r), 0.02, K(0.5, 1.2), 14, 1.1, 6);
    }
    this.ring(e4, t2 + 0.25, n2, 16756832, 10 * r, 0.4, 1.4), this.shockwave(e4, t2 + 0.5, n2, 16751168, 6.5 * r, 0.28), this.chips(e4, t2 + 0.3, n2, 0, 1, 0, 5918792, 16, 11 * r, 0.22), this.chips(e4, t2 + 0.3, n2, 0, 1, 0, 2762276, 10, 8 * r, 0.16);
    for (let i = 0; i < 12; i++) {
      let a = i / 12 * 6.283 + K(-0.2, 0.2), o = K(5, 9) * r;
      this.solid.spawn(e4 + Math.cos(a) * 0.8 * r, t2 + 0.3, n2 + Math.sin(a) * 0.8 * r, Math.cos(a) * o, K(0.3, 1.2), Math.sin(a) * o, 0.72, 0.66, 0.56, 0.6, 1.2 * r, 3.2 * r, K(0.9, 1.5), -0.2, 2.6, 2, K(-1, 1));
    }
    this.later(0.22, () => {
      for (let i = 0; i < 22; i++) {
        let i2 = K(0.1, 0.22);
        this.solid.spawn(e4 + K(-1, 1) * r, t2 + K(1.4, 3.4) * r, n2 + K(-1, 1) * r, K(-1, 1) * 1.3, K(2.4, 6) * r, K(-1, 1) * 1.3, i2, i2 * 0.97, i2 * 0.95, 0.8, K(1.8, 2.8) * r, K(4.6, 6.6) * r, K(2, 3.6), -0.7, 1.1, 2, K(-0.6, 0.6), 0.22);
      }
    }), this.later(0.05, () => this.spark(e4, t2 + 0.5, n2, 16757575, 18, 14 * r, 0.18, 0.8, 12, 3));
  }
  beam(e4, t2, n2) {
    let r = this.beams.find((e5) => !e5.active);
    r && (r.mesh.position.set(e4, t2, n2), r.t = 0, r.life = 0.9, r.active = true, r.mesh.visible = true), this.ring(e4, t2 + 0.1, n2, 4830975, 3.2, 0.55), this.ring(e4, t2 + 0.1, n2, 16777215, 1.6, 0.3), this.star(e4, t2 + 1.1, n2, 9428223, 2.4, 0.18, 3.2), Yp.setHex(5882623);
    for (let r2 = 0; r2 < 40; r2++) {
      let i = r2 / 40 * 6.283 * 2, a = K(0.25, 0.7), o = K(3, 10), s2 = r2 % 5 == 0;
      this.add.spawn(e4 + Math.cos(i) * a, t2 + K(0, 1.8), n2 + Math.sin(i) * a, -Math.sin(i) * 1.4 + Math.cos(i) * 0.4, o, Math.cos(i) * 1.4 + Math.sin(i) * 0.4, s2 ? 3 : Yp.r * 3, s2 ? 3 : Yp.g * 3, s2 ? 3 : Yp.b * 3, 1, K(0.1, 0.22), 0.03, K(0.5, 1.1), -2, 0.4, r2 % 2 ? 1 : 0, K(-6, 6));
    }
    for (let r2 = 0; r2 < 10; r2++) this.add.spawn(e4 + K(-0.3, 0.3), t2 + K(0.2, 1.6), n2 + K(-0.3, 0.3), 0, K(8, 16), 0, 1.4, 2.8, 4, 1, 0.12, 0.02, K(0.3, 0.6), 0, 0.2, 6);
    this.flash(e4, t2 + 1, n2, 5882623, 40, 0.4);
  }
  shieldPop(e4, t2, n2) {
    for (let r = 0; r < 22; r++) {
      let r2 = Math.random() * 6.283, i = Math.random() * 1.6 - 0.6, a = Math.sqrt(Math.max(0, 1 - i * i)), o = K(3, 7.5);
      this.add.spawn(e4 + Math.cos(r2) * 0.3, t2 + i * 0.4, n2 + Math.sin(r2) * 0.3, Math.cos(r2) * a * o, i * o + 2, Math.sin(r2) * a * o, 1, 2.2, 3.8, 1, K(0.12, 0.26), 0.06, K(0.45, 0.8), 7, 1.4, 5, K(-14, 14));
    }
    this.spark(e4, t2, n2, 4571903, 12, 7, 0.14, 0.45, 6, 3), this.star(e4, t2, n2, 10478847, 1.6, 0.12, 3), this.ring(e4, t2 - 0.2, n2, 4571903, 2.4, 0.35), this.shockwave(e4, t2, n2, 5224703, 0.95, 0.18), this.flash(e4, t2, n2, 4571903, 14, 0.2);
  }
  leaves(e4, t2, n2, r, i) {
    Yp.setHex(r);
    for (let r2 = 0; r2 < i; r2++) {
      let i2 = K(0.7, 1.25);
      this.solid.spawn(e4 + K(-1.6, 1.6), t2 + K(-1, 1.4), n2 + K(-1.6, 1.6), K(-2, 2), K(0.5, 3), K(-2, 2), Yp.r * i2, Yp.g * i2, Yp.b * i2, 1, K(0.1, 0.2), 0.08, K(0.8, 1.7), 3.2, 1.6, r2 % 3 == 0 ? 5 : 1, K(-7, 7));
    }
  }
  confetti(e4, t2, n2, r = 60) {
    let i = [16771128, 4571903, 16736162, 7330876, 12082421, 16777215];
    for (let a = 0; a < r; a++) {
      Yp.setHex(i[a % i.length]);
      let r2 = Math.random() * 6.283, o = K(2, 7);
      this.solid.spawn(e4, t2, n2, Math.cos(r2) * o, K(4, 11), Math.sin(r2) * o, Yp.r * 1.3, Yp.g * 1.3, Yp.b * 1.3, 1, K(0.09, 0.16), 0.08, K(1.6, 3), 5, 1.4, a % 4 == 0 ? 5 : 1, K(-12, 12));
    }
  }
  sparkle(e4, t2, n2, r = 16766554) {
    Yp.setHex(r), this.add.spawn(e4 + K(-0.5, 0.5), t2 + K(0, 0.5), n2 + K(-0.4, 0.4), K(-0.2, 0.2), K(0.5, 1.4), K(-0.2, 0.2), Yp.r * 2.4, Yp.g * 2.4, Yp.b * 2.4, 1, K(0.07, 0.15), 0.01, K(0.6, 1.2), -0.2, 0.5, Math.random() < 0.3 ? 4 : 0);
  }
  rain(e4, t2, n2, r) {
    for (let i = 0; i < r; i++) this.add.spawn(e4 + K(-22, 22), t2 + K(4, 14), n2 + K(-22, 22), 2, -34, 1.2, 0.55, 0.42, 0.95, 0.5, K(0.9, 1.6), 1.2, 0.5, 0, 0, 3);
  }
  dust(e4, t2, n2, r = 3) {
    r >= 5 ? this.land(e4, t2, n2, r >= 6 ? 1 : 0.75) : this.puff(e4, t2 + 0.05, n2, 13351060, r, 0.35, 0.5, 0.9, 0.3, 0.35);
  }
  land(e4, t2, n2, r = 1) {
    let i = Math.round(10 + 8 * r);
    for (let a = 0; a < i; a++) {
      let o = a / i * 6.283 + K(-0.15, 0.15), s2 = K(3, 5.5) * (0.6 + 0.4 * r), c = K(0.92, 1.06);
      this.solid.spawn(e4 + Math.cos(o) * 0.3, t2 + 0.12, n2 + Math.sin(o) * 0.3, Math.cos(o) * s2, K(0.2, 0.9), Math.sin(o) * s2, 0.8 * c, 0.74 * c, 0.6 * c, 0.5, 0.35, K(1.1, 1.6) * (0.7 + 0.3 * r), K(0.6, 0.95), -0.2, 3.4, 2, K(-1, 1));
    }
    this.chips(e4, t2 + 0.05, n2, 0, 1, 0, 9075290, Math.round(4 * r), 3, 0.07), this.ring(e4, t2 + 0.08, n2, 14469536, 1.8 + r, 0.35, 0.5);
  }
  gliderPuff(e4, t2, n2) {
    for (let r = 0; r < 10; r++) {
      let i = r / 10 * 6.283;
      this.solid.spawn(e4 + Math.cos(i) * 0.6, t2 + 1.7, n2 + Math.sin(i) * 0.6, Math.cos(i) * 3.5, K(-0.5, 0.8), Math.sin(i) * 3.5, 0.95, 0.97, 1, 0.5, 0.45, K(1.3, 1.8), K(0.45, 0.7), 0, 3.4, 2, K(-1, 1));
    }
    for (let r = 0; r < 8; r++) this.add.spawn(e4 + K(-1.2, 1.2), t2 + K(0.5, 2.2), n2 + K(-1.2, 1.2), 0, K(6, 12), 0, 1.6, 1.8, 2, 0.8, 0.12, 0.02, K(0.2, 0.35), 0, 1, 6);
    this.ring(e4, t2 + 1.6, n2, 16777215, 2.2, 0.3);
  }
  buildPlace(e4, t2, n2, r = 10475775) {
    this.puff(e4, t2, n2, r, 5, 0.8, 0.45, 2.4, 0.6, 0.32), this.star(e4, t2, n2, r, 1.8, 0.2, 2.4), Yp.setHex(r);
    for (let r2 = 0; r2 < 16; r2++) this.add.spawn(e4 + K(-2, 2), t2 + K(-1.7, 1.7), n2 + K(-2, 2), 0, K(0.5, 1.8), 0, Yp.r * 2.8, Yp.g * 2.8, Yp.b * 2.8, 1, K(0.12, 0.24), 0.02, K(0.3, 0.6), 0, 1, r2 % 3 == 0 ? 4 : 1, K(-4, 4));
  }
  buildBreak(e4, t2, n2, r, i = 1) {
    this.chips(e4, t2, n2, 0, 1, 0, r, Math.round(16 * i), 6.5, 0.22), this.chips(e4, t2, n2, 0, 1, 0, Xp.setHex(r).multiplyScalar(0.6).getHex(), Math.round(8 * i), 5, 0.14), this.puff(e4, t2, n2, Xp.setHex(r).lerp(Yp.setHex(15261904), 0.4).getHex(), Math.round(6 * i), 1.2, 0.8, 2.6, 1, 0.45), this.spark(e4, t2, n2, 16773312, Math.round(6 * i), 5, 0.1, 0.3, 8, 2.4);
  }
  grenadeTrail(e4, t2, n2) {
    this.solid.spawn(e4, t2, n2, K(-0.2, 0.2), K(0.1, 0.4), K(-0.2, 0.2), 0.88, 0.88, 0.9, 0.35, 0.1, K(0.35, 0.5), K(0.35, 0.55), -0.2, 2, 2, 0), Math.random() < 0.5 && this.add.spawn(e4, t2, n2, 0, 0, 0, 3, 1.6, 0.5, 1, 0.08, 0.02, 0.08, 0, 0, 0);
  }
  flare(e4, t2, n2, r, i = 20) {
    Yp.setHex(r);
    let a = { x: e4, y: t2, z: n2, r: Yp.r, g: Yp.g, b: Yp.b, t: 0, dur: i, acc: 0, light: true };
    return this.emitters.push(a), { stop: () => {
      a.dur = 0;
    }, move: (e5, t3, n3) => {
      a.x = e5, a.y = t3, a.z = n3;
    } };
  }
  update(e4) {
    if (this.pending.length) for (let t2 = this.pending.length - 1; t2 >= 0; t2--) {
      let n2 = this.pending[t2];
      n2.t -= e4, n2.t <= 0 && (this.pending.splice(t2, 1), n2.fn());
    }
    for (let t2 = this.emitters.length - 1; t2 >= 0; t2--) {
      let n2 = this.emitters[t2];
      if (n2.t += e4, n2.t >= n2.dur) this.emitters.splice(t2, 1);
      else {
        for (n2.acc += e4 * 14; n2.acc >= 1; ) --n2.acc, this.solid.spawn(n2.x + K(-0.15, 0.15), n2.y + 0.3, n2.z + K(-0.15, 0.15), K(-0.5, 0.5), K(3, 5), K(-0.5, 0.5), n2.r, n2.g, n2.b, 0.55, 0.4, K(2.4, 3.6), K(2.2, 3.4), -0.4, 0.7, 2, K(-0.5, 0.5)), Math.random() < 0.5 && this.add.spawn(n2.x, n2.y + 0.15, n2.z, K(-1, 1), K(1, 3), K(-1, 1), n2.r * 3, n2.g * 3, n2.b * 3, 1, K(0.1, 0.2), 0.02, K(0.2, 0.4), 6, 1, 6);
        n2.light && Math.random() < e4 * 6 && this.flash(n2.x, n2.y + 0.6, n2.z, Math.round(n2.r * 255) << 16 | Math.round(n2.g * 255) << 8 | Math.round(n2.b * 255), 6, 0.3);
      }
    }
    this.add.clearRanges(), this.solid.clearRanges(), this.add.update(e4), this.solid.update(e4);
    for (let t2 of this.tracers) {
      if (!t2.active) continue;
      t2.head += 430 * e4, t2.t += e4;
      let n2 = Math.max(0, t2.head - t2.len), r = Math.min(t2.head, t2.dist);
      if (n2 >= t2.dist) {
        t2.active = false, t2.mesh.visible = false;
        continue;
      }
      t2.mesh.position.set(t2.ox + t2.dx * n2, t2.oy + t2.dy * n2, t2.oz + t2.dz * n2);
      let i = 0.095 * (1 - Math.min(0.5, t2.t * 2));
      t2.mesh.scale.set(i, i, Math.max(0.05, r - n2)), t2.mat.opacity = r >= t2.dist ? Math.max(0, 1 - n2 / t2.dist) : 1;
    }
    for (let t2 of this.mflashes) t2.active && (t2.t += e4, t2.t >= t2.life ? (t2.active = false, t2.mesh.visible = false) : t2.mat.opacity = 1 - t2.t / t2.life);
    for (let t2 of this.rings) {
      if (!t2.active) continue;
      t2.t += e4;
      let n2 = t2.t / t2.life;
      if (n2 >= 1) {
        t2.active = false, t2.mesh.visible = false;
        continue;
      }
      let r = t2.size * (0.15 + 0.85 * (1 - (1 - n2) * (1 - n2)));
      t2.mesh.scale.set(r, 1, r), t2.mesh.material.opacity = (1 - n2) * 0.9;
    }
    for (let t2 of this.shells) {
      if (!t2.active) continue;
      t2.t += e4;
      let n2 = t2.t / t2.life;
      n2 >= 1 ? (t2.active = false, t2.mesh.visible = false) : (t2.mesh.scale.setScalar(t2.size * (0.2 + 0.8 * (1 - (1 - n2) * (1 - n2) * (1 - n2)))), t2.mat.uniforms.uAlpha.value = (1 - n2) * 0.55);
    }
    for (let t2 of this.beams) {
      if (!t2.active) continue;
      t2.t += e4;
      let n2 = t2.t / t2.life;
      if (n2 >= 1) {
        t2.active = false, t2.mesh.visible = false;
        continue;
      }
      let r = 0.75 * (1 - n2) * (0.6 + 0.4 * Math.sin(n2 * 30));
      t2.mesh.scale.set(r, 6 + n2 * 70, r), t2.mesh.material.opacity = (1 - n2) * 0.85;
    }
    for (let t2 of this.flashes) t2.t >= t2.life ? t2.light.intensity = 0 : (t2.t += e4, t2.light.intensity = t2.peak * Math.max(0, 1 - t2.t / t2.life));
  }
}(), om = new R();
function sm(e4, t2, n2, r, i, a) {
  let o = 2 * Math.PI * i / 4, s2 = Math.max(a - 2 * i, 0), c = Math.PI / 4;
  om.copy(t2), om[r] = 0, om.normalize();
  let l2 = 0.5 * o / (o + s2), u = 1 - om.angleTo(e4) / c;
  return Math.sign(om[n2]) === 1 ? u * l2 : s2 / (o + s2) + l2 + l2 * (1 - u);
}
var cm = class e extends La {
  constructor(e4 = 1, t2 = 1, n2 = 1, r = 2, i = 0.1) {
    let a = r * 2 + 1;
    if (i = Math.min(e4 / 2, t2 / 2, n2 / 2, i), super(1, 1, 1, a, a, a), this.type = `RoundedBoxGeometry`, this.parameters = { width: e4, height: t2, depth: n2, segments: r, radius: i }, a === 1) return;
    let o = this.toNonIndexed();
    this.index = null, this.attributes.position = o.attributes.position, this.attributes.normal = o.attributes.normal, this.attributes.uv = o.attributes.uv;
    let s2 = new R(), c = new R(), l2 = new R(e4, t2, n2).divideScalar(2).subScalar(i), u = this.attributes.position.array, d = this.attributes.normal.array, f = this.attributes.uv.array, p = u.length / 6, m = new R(), h = 0.5 / a;
    for (let r2 = 0, a2 = 0; r2 < u.length; r2 += 3, a2 += 2) switch (s2.fromArray(u, r2), c.copy(s2), c.x -= Math.sign(c.x) * h, c.y -= Math.sign(c.y) * h, c.z -= Math.sign(c.z) * h, c.normalize(), u[r2 + 0] = l2.x * Math.sign(s2.x) + c.x * i, u[r2 + 1] = l2.y * Math.sign(s2.y) + c.y * i, u[r2 + 2] = l2.z * Math.sign(s2.z) + c.z * i, d[r2 + 0] = c.x, d[r2 + 1] = c.y, d[r2 + 2] = c.z, Math.floor(r2 / p)) {
      case 0:
        m.set(1, 0, 0), f[a2 + 0] = sm(m, c, `z`, `y`, i, n2), f[a2 + 1] = 1 - sm(m, c, `y`, `z`, i, t2);
        break;
      case 1:
        m.set(-1, 0, 0), f[a2 + 0] = 1 - sm(m, c, `z`, `y`, i, n2), f[a2 + 1] = 1 - sm(m, c, `y`, `z`, i, t2);
        break;
      case 2:
        m.set(0, 1, 0), f[a2 + 0] = 1 - sm(m, c, `x`, `z`, i, e4), f[a2 + 1] = sm(m, c, `z`, `x`, i, n2);
        break;
      case 3:
        m.set(0, -1, 0), f[a2 + 0] = 1 - sm(m, c, `x`, `z`, i, e4), f[a2 + 1] = 1 - sm(m, c, `z`, `x`, i, n2);
        break;
      case 4:
        m.set(0, 0, 1), f[a2 + 0] = 1 - sm(m, c, `x`, `y`, i, e4), f[a2 + 1] = 1 - sm(m, c, `y`, `x`, i, t2);
        break;
      case 5:
        m.set(0, 0, -1), f[a2 + 0] = sm(m, c, `x`, `y`, i, e4), f[a2 + 1] = 1 - sm(m, c, `y`, `x`, i, t2);
    }
  }
  static fromJSON(t2) {
    return new e(t2.width, t2.height, t2.depth, t2.segments, t2.radius);
  }
}, lm = new gn(), um = new It(), dm = new R(), fm = new R();
function q(e4 = 0, t2 = 0, n2 = 0, r = 0, i = 0, a = 0, o = 1, s2 = o, c = o) {
  return um.setFromEuler(lm.set(r, i, a, `XYZ`)), new z().compose(dm.set(e4, t2, n2), um, fm.set(o, s2, c));
}
var pm = new B(), mm = new B();
function hm(e4, t2) {
  return typeof e4 == `number` ? t2.setHex(e4) : t2.copy(e4);
}
var gm = class {
  pos = [];
  nor = [];
  col = [];
  nm = new zt();
  v = new R();
  add(e4, t2, n2, r) {
    let i = e4.index ? e4.toNonIndexed() : e4, a = i.getAttribute(`position`), o = i.getAttribute(`normal`);
    o ||= (i.computeVertexNormals(), i.getAttribute(`normal`));
    let s2 = hm(t2, pm), c = r === void 0 ? null : hm(r, mm), l2 = 1 / 0, u = -1 / 0;
    if (c) {
      for (let e5 = 0; e5 < a.count; e5++) {
        let t3 = a.getY(e5);
        t3 < l2 && (l2 = t3), t3 > u && (u = t3);
      }
      u - l2 < 1e-6 && (u = l2 + 1);
    }
    n2 && this.nm.getNormalMatrix(n2);
    let d = this.v;
    for (let e5 = 0; e5 < a.count; e5++) {
      let t3 = a.getY(e5);
      if (d.set(a.getX(e5), t3, a.getZ(e5)), n2 && d.applyMatrix4(n2), this.pos.push(d.x, d.y, d.z), d.set(o.getX(e5), o.getY(e5), o.getZ(e5)), n2 && d.applyMatrix3(this.nm).normalize(), this.nor.push(d.x, d.y, d.z), c) {
        let e6 = (t3 - l2) / (u - l2);
        this.col.push(s2.r + (c.r - s2.r) * e6, s2.g + (c.g - s2.g) * e6, s2.b + (c.b - s2.b) * e6);
      } else this.col.push(s2.r, s2.g, s2.b);
    }
    return i !== e4 && i.dispose(), this;
  }
  box(e4, t2, n2, r, i, a) {
    return this.add(new La(e4, t2, n2), r, i, a);
  }
  rbox(e4, t2, n2, r, i, a, o, s2 = 2) {
    return this.add(new cm(e4, t2, n2, s2, Math.min(r, e4 / 2, t2 / 2, n2 / 2)), i, a, o);
  }
  cyl(e4, t2, n2, r, i, a = 12, o, s2 = false) {
    return this.add(new Ba(e4, t2, n2, a, 1, s2), r, i, o);
  }
  cone(e4, t2, n2, r, i = 12, a) {
    return this.add(new Va(e4, t2, i), n2, r, a);
  }
  sphere(e4, t2, n2, r = 14, i = 10, a) {
    return this.add(new gs(e4, r, i), t2, n2, a);
  }
  ico(e4, t2, n2, r = 1, i) {
    return this.add(new fs(e4, r), t2, n2, i);
  }
  capsule(e4, t2, n2, r, i, a = 4, o = 10) {
    return this.add(new Ra(e4, t2, a, o), n2, r, i);
  }
  torus(e4, t2, n2, r, i = 8, a = 16, o = Math.PI * 2) {
    return this.add(new _s(e4, t2, i, a, o), n2, r);
  }
  get vertexCount() {
    return this.pos.length / 3;
  }
  build() {
    let e4 = new Hr();
    return e4.setAttribute(`position`, new V(this.pos, 3)), e4.setAttribute(`normal`, new V(this.nor, 3)), e4.setAttribute(`color`, new V(this.col, 3)), e4.computeBoundingBox(), e4.computeBoundingSphere(), e4;
  }
}, _m = { std: new Os({ vertexColors: true, roughness: 0.78, metalness: 0 }), metal: new Os({ vertexColors: true, roughness: 0.34, metalness: 0.85 }), glow: (() => {
  let e4 = new bi({ vertexColors: true, toneMapped: false });
  return e4.color.setScalar(2.2), e4;
})() };
for (let e4 of [_m.std, _m.metal]) e4.onBeforeCompile = (e5) => {
  e5.fragmentShader = e5.fragmentShader.replace(`#include <emissivemap_fragment>`, `#include <emissivemap_fragment>
      {
        float rim = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.2);
        totalEmissiveRadiance += mix(diffuseColor.rgb, vec3(0.62, 0.78, 1.0), 0.45) * rim * 0.42;
      }`);
};
var Sh = [`town_kit`, `weapons`, `items`, `characters`], Ch = /* @__PURE__ */ new Map();
async function wh() {
}
function Th() {
  return void 0;
}
function Nh() {
  return null;
}
var Ph = [`Common`, `Uncommon`, `Rare`, `Epic`, `Legendary`, `Mythic`], Fh = [10134961, 6932010, 3842303, 12082421, 16099379, 16746495], Ih = { ar: { id: `ar`, name: `Assault Rifle`, hold: `rifle`, ammo: `medium`, damage: 30, pellets: 1, fireRate: 5.5, auto: true, mag: 30, reload: 2.2, spread: 1.5, adsSpread: 0.35, headMult: 1.5, falloffStart: 55, falloffEnd: 110, minFalloff: 0.66, adsFov: 52, recoil: 0.55, structDamage: 30, minRarity: 0, maxRarity: 5, equip: 0.25 }, smg: { id: `smg`, name: `Submachine Gun`, hold: `rifle`, ammo: `light`, damage: 17, pellets: 1, fireRate: 12, auto: true, mag: 30, reload: 2, spread: 2.6, adsSpread: 1.1, headMult: 1.75, falloffStart: 22, falloffEnd: 55, minFalloff: 0.5, adsFov: 58, recoil: 0.3, structDamage: 17, minRarity: 0, maxRarity: 3, equip: 0.2 }, pump: { id: `pump`, name: `Pump Shotgun`, hold: `rifle`, ammo: `shells`, damage: 9.5, pellets: 10, fireRate: 0.75, auto: false, mag: 5, reload: 4.2, spread: 4.2, adsSpread: 3.4, headMult: 1.8, falloffStart: 7, falloffEnd: 28, minFalloff: 0.15, adsFov: 60, recoil: 2.6, structDamage: 5, minRarity: 0, maxRarity: 5, equip: 0.3 }, sniper: { id: `sniper`, name: `Bolt-Action Sniper`, hold: `rifle`, ammo: `heavy`, damage: 105, pellets: 1, fireRate: 0.4, auto: false, mag: 1, reload: 2.6, spread: 5.5, adsSpread: 0, headMult: 2.5, falloffStart: 400, falloffEnd: 500, minFalloff: 1, adsFov: 16, recoil: 3.4, structDamage: 105, minRarity: 2, maxRarity: 5, equip: 0.3 }, pistol: { id: `pistol`, name: `Pistol`, hold: `pistol`, ammo: `light`, damage: 24, pellets: 1, fireRate: 6.2, auto: false, mag: 16, reload: 1.4, spread: 1.6, adsSpread: 0.6, headMult: 2, falloffStart: 28, falloffEnd: 70, minFalloff: 0.6, adsFov: 58, recoil: 0.7, structDamage: 24, minRarity: 0, maxRarity: 2, equip: 0.18 }, rpg: { id: `rpg`, name: `Rocket Launcher`, hold: `launcher`, ammo: `rockets`, damage: 110, pellets: 1, fireRate: 0.6, auto: false, mag: 1, reload: 3, spread: 0.4, adsSpread: 0.1, headMult: 1, falloffStart: 999, falloffEnd: 1e3, minFalloff: 1, adsFov: 55, recoil: 3, structDamage: 300, minRarity: 3, maxRarity: 5, equip: 0.35 }, tac: { id: `tac`, name: `Tactical Shotgun`, hold: `rifle`, ammo: `shells`, damage: 7.4, pellets: 10, fireRate: 1.5, auto: false, mag: 8, reload: 5.2, spread: 5, adsSpread: 4, headMult: 1.75, falloffStart: 6, falloffEnd: 24, minFalloff: 0.18, adsFov: 62, recoil: 1.8, structDamage: 6, minRarity: 0, maxRarity: 5, equip: 0.25 }, burst: { id: `burst`, name: `Burst Rifle`, hold: `rifle`, ammo: `medium`, damage: 27, pellets: 1, fireRate: 1.6, auto: false, mag: 27, reload: 2.4, spread: 1.3, adsSpread: 0.25, headMult: 1.5, falloffStart: 60, falloffEnd: 120, minFalloff: 0.7, adsFov: 50, recoil: 0.62, structDamage: 27, minRarity: 1, maxRarity: 5, burst: 3, burstGap: 0.075, equip: 0.25 }, grenade: { id: `grenade`, name: `Frag Grenade`, hold: `throwable`, ammo: `heavy`, damage: 100, pellets: 1, fireRate: 1.1, auto: false, mag: 6, reload: 0, spread: 0, adsSpread: 0, headMult: 1, falloffStart: 0, falloffEnd: 5, minFalloff: 0.2, adsFov: 70, recoil: 0, structDamage: 375, minRarity: 1, maxRarity: 1, thrown: true, equip: 0.2 }, pulse: { id: `pulse`, name: `Pulse SMG`, hold: `rifle`, ammo: `light`, damage: 15, pellets: 1, fireRate: 14, auto: true, mag: 36, reload: 1.8, spread: 2.2, adsSpread: 0.9, headMult: 1.75, falloffStart: 24, falloffEnd: 60, minFalloff: 0.55, adsFov: 56, recoil: 0.28, structDamage: 15, minRarity: 0, maxRarity: 5, equip: 0.2 }, sky: { id: `sky`, name: `Sky Rifle`, hold: `rifle`, ammo: `medium`, damage: 34, pellets: 1, fireRate: 4.8, auto: true, mag: 28, reload: 2.1, spread: 1.4, adsSpread: 0.3, headMult: 1.6, falloffStart: 60, falloffEnd: 120, minFalloff: 0.7, adsFov: 50, recoil: 0.5, structDamage: 34, minRarity: 1, maxRarity: 5, equip: 0.25 }, smoke: { id: `smoke`, name: `Smoke Grenade`, hold: `throwable`, ammo: `heavy`, damage: 6, pellets: 1, fireRate: 1.1, auto: false, mag: 6, reload: 0, spread: 0, adsSpread: 0, headMult: 1, falloffStart: 0, falloffEnd: 5, minFalloff: 0.2, adsFov: 70, recoil: 0, structDamage: 60, minRarity: 1, maxRarity: 1, thrown: true, equip: 0.2 }, stink: { id: `stink`, name: `Stink Bomb`, hold: `throwable`, ammo: `heavy`, damage: 8, pellets: 1, fireRate: 1.1, auto: false, mag: 6, reload: 0, spread: 0, adsSpread: 0, headMult: 1, falloffStart: 0, falloffEnd: 5, minFalloff: 0.2, adsFov: 70, recoil: 0, structDamage: 60, minRarity: 2, maxRarity: 2, thrown: true, equip: 0.2 }, shock: { id: `shock`, name: `Shockwave Grenade`, hold: `throwable`, ammo: `heavy`, damage: 0, pellets: 1, fireRate: 1.1, auto: false, mag: 6, reload: 0, spread: 0, adsSpread: 0, headMult: 1, falloffStart: 0, falloffEnd: 5, minFalloff: 0.2, adsFov: 70, recoil: 0, structDamage: 80, minRarity: 2, maxRarity: 2, thrown: true, equip: 0.2 }, bounce: { id: `bounce`, name: `Bounce Grenade`, hold: `throwable`, ammo: `heavy`, damage: 75, pellets: 1, fireRate: 1.1, auto: false, mag: 6, reload: 0, spread: 0, adsSpread: 0, headMult: 1, falloffStart: 0, falloffEnd: 5, minFalloff: 0.2, adsFov: 70, recoil: 0, structDamage: 250, minRarity: 1, maxRarity: 1, thrown: true, fuse: 5, equip: 0.2 } }, Lh = { web: { id:`web`, name:`Mythic Web Shooters`, useTime:0, heal:0, shield:0, cap:100, stack:80, rarity:5, mobility:true }, bandage: { id: `bandage`, name: `Bandages`, useTime: 2.6, heal: 15, shield: 0, cap: 75, stack: 15, rarity: 0 }, medkit: { id: `medkit`, name: `Med Kit`, useTime: 6.5, heal: 100, shield: 0, cap: 100, stack: 3, rarity: 1 }, mini: { id: `mini`, name: `Small Shield Potion`, useTime: 1.8, heal: 0, shield: 25, cap: 50, stack: 6, rarity: 1 }, big: { id: `big`, name: `Shield Potion`, useTime: 4.2, heal: 0, shield: 50, cap: 100, stack: 3, rarity: 2 }, chug: { id: `chug`, name: `Chug Splash`, useTime: 1.2, heal: 20, shield: 20, cap: 100, stack: 6, rarity: 2, splash: true }, launchpad: { id: `launchpad`, name: `Launch Pad`, useTime: 1.2, heal: 0, shield: 0, cap: 100, stack: 2, rarity: 3, place: `pad` }, fortress: { id: `fortress`, name: `Port-a-Fortress`, useTime: 2, heal: 0, shield: 0, cap: 100, stack: 1, rarity: 3, place: `fort` }, riftbeacon: { id: `riftbeacon`, name: `Rift Beacon`, useTime: 2, heal: 0, shield: 0, cap: 100, stack: 1, rarity: 4, place: `rift` }, spiketrap: { id: `spiketrap`, name: `Spike Trap`, useTime: 1, heal: 0, shield: 0, cap: 100, stack: 3, rarity: 2, place: `spike` } }, Rh = { light: `Light Bullets`, medium: `Medium Bullets`, heavy: `Heavy Bullets`, shells: `Shells`, rockets: `Rockets` }, zh = { light: 14205562, medium: 7311178, heavy: 5926810, shells: 12732986, rockets: 8028040 }, Bh = { light: 18, medium: 20, heavy: 6, shells: 5, rockets: 2 }, Vh = { wood: `Wood`, stone: `Stone`, metal: `Metal` }, Hh = { wood: 12880458, stone: 11117466, metal: 9413557 };
function Uh(e4) {
  return e4 in Ih;
}
function Wh(e4) {
  return e4 in Lh;
}
function Gh(e4) {
  return Uh(e4) ? Ih[e4].name : Lh[e4].name;
}
var Kh = Math.PI, qh = Kh / 2, Jh = /* @__PURE__ */ new Map();
function Yh(e4, t2, n2 = 16765498, r = -1) {
  let i = Jh.get(e4);
  if (!i) {
    let a = { s: new gm(), m: new gm(), g: new gm(), acc: n2, rar: r };
    t2(a), i = { std: a.s.vertexCount ? a.s.build() : null, metal: a.m.vertexCount ? a.m.build() : null, glow: a.g.vertexCount ? a.g.build() : null }, Jh.set(e4, i);
  }
  return i;
}
function Xh(e4, t2) {
  if (t2.std) {
    let n2 = new Mi(t2.std, _m.std);
    n2.castShadow = true, n2.receiveShadow = true, e4.add(n2);
  }
  if (t2.metal) {
    let n2 = new Mi(t2.metal, _m.metal);
    n2.castShadow = true, n2.receiveShadow = true, e4.add(n2);
  }
  return t2.glow && e4.add(new Mi(t2.glow, _m.glow)), e4;
}
function Zh(e4, t2) {
  let n2 = new Hr();
  n2.setAttribute(`position`, e4.getAttribute(`position`)), n2.setAttribute(`normal`, e4.getAttribute(`normal`));
  let r = e4.getAttribute(`position`).count, i = new B(t2), a = new Float32Array(r * 3);
  for (let e5 = 0; e5 < r; e5++) a[e5 * 3] = i.r, a[e5 * 3 + 1] = i.g, a[e5 * 3 + 2] = i.b;
  return n2.setAttribute(`color`, new V(a, 3)), n2.boundingBox = e4.boundingBox, n2.boundingSphere = e4.boundingSphere, n2;
}
function Qh(e4) {
  let t2 = e4.filter((e5) => !!e5);
  if (t2.length < 2) return t2[0] ?? null;
  let n2 = new Hr();
  for (let e5 of [`position`, `normal`, `color`]) {
    let r = 0;
    for (let n3 of t2) r += n3.getAttribute(e5).count * 3;
    let i = new Float32Array(r), a = 0;
    for (let n3 of t2) {
      let t3 = n3.getAttribute(e5);
      for (let e6 = 0; e6 < t3.count; e6++) i[a++] = t3.getX(e6), i[a++] = t3.getY(e6), i[a++] = t3.getZ(e6);
    }
    n2.setAttribute(e5, new V(i, 3));
  }
  return n2.computeBoundingBox(), n2.computeBoundingSphere(), n2;
}
function $h(e4, t2, n2 = 16777215, r = false, i = 16777215) {
  let a = `glb:${e4}/${t2}/${n2}/${+!!r}/${i}`, o = Jh.get(a);
  if (o) return o;
  let s2 = Nh(e4, t2 + `__std`), c = Nh(e4, t2 + `__metal`), l2 = Nh(e4, t2 + `__glow`), u = Nh(e4, t2 + `__acc`), d = Nh(e4, t2 + `__acc2`);
  if (!s2 && !c && !l2 && !u) return null;
  let f = u ? Zh(u, r ? Bg(n2, 0.8) : n2) : null, p = { std: Qh([s2, r ? null : f, d ? Zh(d, i) : null]), metal: c, glow: Qh([l2, r ? f : null]) };
  return Jh.set(a, p), p;
}
var J = (e4, t2, n2) => q(e4, t2, n2, qh, 0, 0), eg = (e4, t2, n2) => q(e4, t2, n2, 0, 0, -qh), tg = new R(0, 1, 0), ng = new R(1, 1, 1);
function rg(e4, t2, n2, r, i, a, o, s2, c, l2 = 5, u = s2, d) {
  let f = new R(t2, n2, r), p = new R(i - t2, a - n2, o - r), m = p.length(), h = new It().setFromUnitVectors(tg, p.normalize());
  f.set((t2 + i) / 2, (n2 + a) / 2, (r + o) / 2), e4.cyl(u, s2, m, c, new z().compose(f, h, ng), l2, d);
}
function ig(e4, t2, n2, r, i, a, o, s2, c, l2, u = 0) {
  let d = new z().makeTranslation(o, s2, c).multiply(new z().makeRotationY(u)).multiply(new z().makeScale(t2, 1, n2)).multiply(new z().makeRotationY(Kh / 4));
  e4.cyl(Math.SQRT2, Math.SQRT2 * i, r, a, d, 4, l2);
}
var ag = /* @__PURE__ */ new Map();
function og(e4, t2) {
  let n2 = e4 + `_` + t2, r = ag.get(n2);
  if (!r) {
    let i = new To();
    for (let t3 = 0; t3 < 10; t3++) {
      let n3 = qh + t3 * Kh / 5, r2 = t3 % 2 ? e4 * 0.46 : e4;
      t3 === 0 ? i.moveTo(Math.cos(n3) * r2, Math.sin(n3) * r2) : i.lineTo(Math.cos(n3) * r2, Math.sin(n3) * r2);
    }
    r = new ls(i, { depth: t2, bevelEnabled: false }).translate(0, 0, -t2 / 2), ag.set(n2, r);
  }
  return r;
}
var sg = 2303531, cg = 3817287, lg = 789775, ug = 3093564, dg = 4936543, fg = 9081500, pg = 4409939, mg = 15265525, hg = 6121074, gg = 9213603, _g = 5661818, vg = 8030882, yg = 13806960, bg = 11043916, xg = 14728060, Sg = 11766354, Cg = 15525592, wg = 12432803, Tg = 9392679, Eg = 12746048, Dg = 6173719, Og = 5662266, kg = 8360016, Ag = 14394943, jg = 16102958, Mg = 16768106, Ng = 14170411, Pg = 15922422, Fg = 16765498, Ig = 16747039, Lg = 2279352, Rg = 4770047, zg = 1855370, Bg = (e4, t2) => new B(e4).multiplyScalar(t2).getHex(), Vg = (e4) => {
  let t2 = new B(e4);
  return t2.r * 0.3 + t2.g * 0.59 + t2.b * 0.11;
};
function Hg(e4, t2, n2, r, i) {
  (e4.rar >= 3 ? e4.g : e4.s).box(t2, n2, r, e4.rar >= 3 ? Bg(e4.acc, 0.8) : e4.acc, i);
}
function Ug(e4, t2, n2, r, i) {
  e4.s.box(0.014, 0.01, n2 - t2, i, q(0, r, (t2 + n2) / 2)), e4.s.box(0.014, 0.044, 0.01, i, q(0, r + 0.018, n2)), e4.m.box(8e-3, 0.032, 0.01, fg, q(0, r + 0.02, t2 + (n2 - t2) * 0.42, 0.35));
}
function Wg(e4, t2, n2, r) {
  e4.m.cyl(6e-3, 6e-3, 5e-3, fg, eg(t2, n2, r), 6);
}
function Gg(e4, t2, n2, r, i, a, o = 0.046, s2 = 0.13) {
  let c = Math.cos(r), l2 = Math.sin(r), u = (e5, i2) => q(0, t2 + e5 * c - i2 * l2, n2 + e5 * l2 + i2 * c, r);
  e4.s.rbox(o, s2, 0.06, 0.018, i, q(0, t2, n2, r), a, 1), e4.s.rbox(o + 6e-3, 0.016, 0.07, 6e-3, cg, u(-s2 / 2, -4e-3), void 0, 1);
  for (let t3 = 0; t3 < 3; t3++) e4.s.box(o + 3e-3, 6e-3, 0.042, Bg(i, 0.6), u(-s2 * 0.28 + t3 * s2 * 0.2, -4e-3));
}
function Kg(e4, t2, n2, r, i, a, o, s2, c, l2 = 0.08, u = 0.17) {
  let d = t2, f = n2, p = l2;
  for (let t3 = 0; t3 < r; t3++) {
    p = l2 + t3 * u;
    let n3 = d - Math.cos(p) * a / 2, r2 = f + Math.sin(p) * a / 2;
    e4.s.rbox(i, a + 0.012, o, 9e-3, s2, q(0, n3, r2, -p), c, 1), e4.s.box(i + 4e-3, 6e-3, o * 0.7, Bg(s2, 0.6), q(0, n3, r2, -p)), d -= Math.cos(p) * a, f += Math.sin(p) * a;
  }
  e4.s.rbox(i + 8e-3, 0.016, o + 0.01, 5e-3, cg, q(0, d - 4e-3, f + 2e-3, -p), void 0, 1);
}
function qg(e4, t2, n2, r, i = 0.032) {
  let a = Math.max(2, Math.round((r - n2) / 0.045));
  e4.m.box(i, 0.012, r - n2, ug, q(0, t2, (n2 + r) / 2));
  for (let o = 0; o < a; o++) e4.m.box(i + 4e-3, 8e-3, 0.016, dg, q(0, t2 + 9e-3, n2 + 0.02 + o * (r - n2 - 0.04) / (a - 1)));
}
function Jg(e4) {
  let { s: t2, m: n2 } = e4;
  Gg(e4, -0.04, -0.016, 0.3, ug, dg), Ug(e4, 0.014, 0.108, -0.014, ug), t2.rbox(0.058, 0.07, 0.27, 0.016, Sg, q(0, 0.05, 0.08), xg, 1), t2.rbox(0.054, 0.07, 0.096, 0.012, Sg, q(0, 0, 0.168), xg, 1), Kg(e4, -0.02, 0.17, 3, 0.04, 0.058, 0.076, ug, dg), t2.cyl(7e-3, 7e-3, 0.062, Ng, eg(0, 0.064, 0.02), 6), t2.rbox(0.066, 0.074, 0.44, 0.02, Sg, q(0, 0.122, 0.1), xg, 1), t2.box(6e-3, 0.028, 0.09, lg, q(0.033, 0.122, 0.12)), n2.box(8e-3, 0.016, 0.03, fg, q(0.036, 0.122, 0.1)), n2.box(0.05, 0.014, 0.03, ug, q(0, 0.16, -0.1)), t2.rbox(0.074, 0.08, 0.25, 0.024, ug, q(0, 0.114, 0.43), dg, 1);
  for (let e5 = 0; e5 < 3; e5++) for (let n3 of [-1, 1]) t2.box(6e-3, 0.022, 0.044, lg, q(n3 * 0.037, 0.122, 0.36 + e5 * 0.066));
  Hg(e4, 0.077, 0.014, 0.2, q(0, 0.088, 0.43)), qg(e4, 0.164, -0.12, 0.54), t2.rbox(0.052, 0.052, 0.09, 0.015, ug, q(0, 0.202, 0.07), dg, 1), t2.rbox(0.058, 0.058, 0.018, 7e-3, dg, q(0, 0.204, 0.118), void 0, 1), n2.box(0.038, 0.036, 4e-3, Rg, q(0, 0.204, 0.128)), n2.box(0.036, 0.034, 4e-3, zg, q(0, 0.204, 0.024)), t2.cyl(0.012, 0.012, 0.014, dg, eg(0.032, 0.2, 0.07), 8), n2.box(0.034, 0.032, 0.022, ug, q(0, 0.184, 0.53)), n2.box(6e-3, 0.03, 8e-3, mg, q(0, 0.212, 0.53)), n2.cyl(0.013, 0.013, 0.08, pg, J(0, 0.114, 0.59), 8), n2.rbox(0.044, 0.044, 0.062, 0.01, ug, q(0, 0.114, 0.64), dg, 1);
  for (let e5 of [-1, 1]) for (let t3 = 0; t3 < 2; t3++) n2.box(6e-3, 0.026, 0.01, lg, q(e5 * 0.022, 0.114, 0.628 + t3 * 0.022));
  n2.cyl(0.011, 0.011, 4e-3, lg, J(0, 0.114, 0.672), 8), n2.cyl(0.019, 0.019, 0.12, ug, J(0, 0.124, -0.17), 8), t2.rbox(0.052, 0.1, 0.19, 0.022, Sg, q(0, 0.1, -0.245), xg, 1), t2.rbox(0.046, 0.026, 0.14, 0.01, ug, q(0, 0.156, -0.24), void 0, 1), t2.rbox(0.056, 0.152, 0.04, 0.014, ug, q(0, 0.076, -0.34), dg, 1), Wg(e4, 0.03, 0.05, 0.1), Wg(e4, 0.03, 0.05, -0.02), Wg(e4, 0.034, 0.1, 0.3), Wg(e4, -0.034, 0.1, 0.3);
}
function Yg(e4) {
  let { s: t2, m: n2 } = e4;
  Gg(e4, -0.04, -0.012, 0.22, ug, dg), t2.rbox(0.016, 0.014, 0.16, 5e-3, ug, q(0, -0.018, 0.075), void 0, 1), t2.box(0.016, 0.06, 0.014, ug, q(0, 6e-3, 0.152)), n2.box(8e-3, 0.032, 0.01, fg, q(0, 6e-3, 0.05, 0.35)), t2.rbox(0.074, 0.112, 0.6, 0.026, wg, q(0, 0.08, 0.02), Cg, 1), t2.rbox(0.07, 0.04, 0.28, 0.016, Cg, q(0, 0.142, -0.13), void 0, 1), t2.rbox(0.078, 0.14, 0.034, 0.012, ug, q(0, 0.074, -0.29), dg, 1), t2.rbox(0.044, 0.125, 0.078, 9e-3, ug, q(0, -0.04, -0.13, -0.1), dg, 1), t2.box(0.046, 6e-3, 0.06, sg, q(0, -0.03, -0.128, -0.1)), t2.rbox(0.05, 0.016, 0.086, 5e-3, cg, q(0, -0.104, -0.137, -0.1), void 0, 1), t2.rbox(0.07, 0.07, 0.24, 0.022, ug, q(0, 0.072, 0.37), dg, 1);
  for (let e5 = 0; e5 < 4; e5++) for (let n3 of [-1, 1]) t2.box(6e-3, 0.026, 0.026, lg, q(n3 * 0.035, 0.07, 0.29 + e5 * 0.05));
  for (let t3 of [-1, 1]) Hg(e4, 6e-3, 0.016, 0.34, q(t3 * 0.038, 0.1, -0.02));
  Hg(e4, 0.076, 0.03, 0.02, q(0, 0.08, 0.255)), t2.box(6e-3, 0.026, 0.07, lg, q(-0.038, 0.1, -0.16)), n2.box(0.01, 0.014, 0.024, fg, q(-0.041, 0.1, -0.15)), qg(e4, 0.144, -0.06, 0.3, 0.03);
  for (let e5 of [-0.02, 0.2]) t2.box(0.03, 0.04, 0.03, ug, q(0, 0.168, e5));
  t2.rbox(0.056, 0.06, 0.29, 0.018, ug, q(0, 0.212, 0.09), dg, 1), t2.rbox(0.064, 0.068, 0.03, 0.01, dg, q(0, 0.214, 0.24), void 0, 1), n2.box(0.044, 0.044, 4e-3, Rg, q(0, 0.214, 0.256)), n2.box(0.036, 0.036, 4e-3, zg, q(0, 0.212, -0.056)), t2.cyl(0.014, 0.014, 0.016, dg, q(0, 0.248, 0.09), 8), Hg(e4, 0.058, 0.01, 0.03, q(0, 0.186, 0.17)), n2.cyl(0.014, 0.014, 0.08, pg, J(0, 0.08, 0.52), 8), n2.rbox(0.04, 0.04, 0.05, 8e-3, ug, q(0, 0.08, 0.57), dg, 1);
  for (let e5 of [-1, 1]) n2.box(6e-3, 0.02, 0.03, lg, q(e5 * 0.02, 0.08, 0.57));
  n2.cyl(0.01, 0.01, 4e-3, lg, J(0, 0.08, 0.596), 8), Wg(e4, 0.038, 0.05, -0.2), Wg(e4, -0.038, 0.05, -0.2), Wg(e4, 0.038, 0.05, 0.2), Wg(e4, -0.038, 0.05, 0.2);
}
function Xg(e4) {
  let { s: t2, m: n2 } = e4;
  Gg(e4, -0.035, -0.012, 0.22, ug, dg, 0.044, 0.122), Ug(e4, 0.016, 0.1, -0.01, ug), t2.rbox(0.062, 0.092, 0.34, 0.022, _g, q(0, 0.092, 0.09), vg, 1), t2.rbox(0.056, 0.05, 0.22, 0.012, cg, q(0, 0.036, 0.1), void 0, 1), Hg(e4, 0.065, 0.024, 0.16, q(0, 0.098, 0.13)), t2.box(0.066, 8e-3, 0.3, sg, q(0, 0.064, 0.09)), t2.rbox(0.032, 0.2, 0.046, 8e-3, sg, q(0, -0.09, 0.152, -0.06), cg, 1);
  for (let e5 = 0; e5 < 3; e5++) t2.box(0.035, 6e-3, 0.03, lg, q(0, -0.05 - e5 * 0.05, 0.149 - e5 * 3e-3, -0.06));
  t2.rbox(0.038, 0.016, 0.054, 5e-3, Fg, q(0, -0.192, 0.158, -0.06), void 0, 1), t2.rbox(0.068, 0.082, 0.15, 0.022, _g, q(0, 0.094, 0.33), vg, 1);
  for (let e5 = 0; e5 < 3; e5++) for (let n3 of [-1, 1]) t2.box(6e-3, 0.03, 0.026, lg, q(n3 * 0.034, 0.1, 0.285 + e5 * 0.045));
  t2.rbox(0.036, 0.1, 0.042, 0.014, sg, q(0, 0, 0.31, -0.12), cg, 1);
  for (let e5 = 0; e5 < 3; e5++) t2.box(0.039, 6e-3, 0.03, lg, q(0, -0.025 + e5 * 0.022, 0.31 - e5 * 3e-3, -0.12));
  n2.cyl(0.013, 0.013, 0.05, pg, J(0, 0.094, 0.43), 8), n2.rbox(0.038, 0.038, 0.044, 8e-3, cg, q(0, 0.094, 0.468), pg, 1), n2.box(0.04, 8e-3, 0.012, lg, q(0, 0.11, 0.468)), n2.cyl(9e-3, 9e-3, 4e-3, lg, J(0, 0.094, 0.491), 8), qg(e4, 0.144, -0.06, 0.24, 0.028), n2.box(0.032, 0.03, 0.016, sg, q(0, 0.166, -0.04)), n2.box(0.01, 0.014, 0.018, lg, q(0, 0.176, -0.04)), n2.box(8e-3, 0.034, 0.012, sg, q(0, 0.15, 0.39)), n2.box(8e-3, 9e-3, 8e-3, Fg, q(0, 0.171, 0.39)), n2.cyl(8e-3, 8e-3, 0.03, fg, eg(-0.042, 0.11, 0.13), 6), n2.sphere(0.011, fg, q(-0.058, 0.11, 0.13), 8, 6), t2.cyl(7e-3, 7e-3, 6e-3, Fg, eg(-0.03, 0.07, 0.01), 6), Wg(e4, 0.031, 0.06, 0.2), Wg(e4, 0.031, 0.06, -0.04), t2.rbox(0.05, 0.056, 0.024, 8e-3, cg, q(0, 0.092, -0.088), void 0, 1);
  for (let e5 of [-1, 1]) rg(n2, e5 * 0.019, 0.108, -0.08, e5 * 0.019, 0.108, -0.21, 6e-3, pg), rg(n2, e5 * 0.019, 0.108, -0.21, e5 * 0.019, 0.02, -0.21, 6e-3, pg);
  t2.rbox(0.056, 0.11, 0.02, 7e-3, sg, q(0, 0.064, -0.212), cg, 1);
}
function Zg(e4) {
  let { s: t2, m: n2 } = e4;
  t2.rbox(0.044, 0.06, 0.15, 0.018, Tg, q(0, 0.018, -0.025, -0.3), Eg, 1), t2.rbox(0.054, 0.13, 0.26, 0.026, Tg, q(0, -0.018, -0.2, -0.12), Eg, 1);
  for (let e5 of [-0.03, 0.02]) t2.box(0.056, 4e-3, 0.18, Dg, q(0, -0.018 + e5, -0.21, -0.12));
  t2.rbox(0.058, 0.138, 0.03, 0.01, sg, q(0, -0.035, -0.336, -0.12), cg, 1), t2.rbox(0.058, 0.096, 0.26, 0.016, hg, q(0, 0.076, 0.13), gg, 1), n2.box(0.06, 0.012, 0.2, fg, q(0, 0.118, 0.13)), t2.box(6e-3, 0.034, 0.09, lg, q(0.03, 0.09, 0.14)), Hg(e4, 0.06, 0.012, 0.2, q(0, 0.046, 0.13)), Ug(e4, 0.03, 0.11, 4e-3, pg), Wg(e4, 0.03, 0.06, 0.05), Wg(e4, 0.03, 0.06, 0.22), Wg(e4, 0.03, 0.1, 0.03), n2.cyl(0.017, 0.017, 0.44, pg, J(0, 0.104, 0.48), 10), n2.cyl(0.021, 0.021, 0.03, fg, J(0, 0.104, 0.69), 10), n2.cyl(0.012, 0.012, 4e-3, lg, J(0, 0.104, 0.706), 8), n2.box(0.012, 8e-3, 0.42, fg, q(0, 0.124, 0.47)), n2.sphere(6e-3, Ag, q(0, 0.132, 0.676), 6, 4), n2.cyl(0.016, 0.016, 0.38, pg, J(0, 0.064, 0.44), 10), n2.cyl(0.018, 0.018, 0.02, fg, J(0, 0.064, 0.635), 10), n2.box(0.016, 0.06, 0.02, fg, q(0, 0.084, 0.6)), t2.rbox(0.07, 0.066, 0.19, 0.026, Tg, q(0, 0.062, 0.4), Eg, 1);
  for (let e5 = 0; e5 < 5; e5++) t2.box(0.072, 0.034, 8e-3, Dg, q(0, 0.062, 0.33 + e5 * 0.035));
  rg(n2, 0.024, 0.062, 0.24, 0.024, 0.062, 0.31, 5e-3, fg), t2.box(6e-3, 0.04, 0.13, sg, q(-0.031, 0.08, 0.1));
  for (let e5 = 0; e5 < 4; e5++) t2.cyl(0.012, 0.012, 0.05, Ng, q(-0.044, 0.088, 0.055 + e5 * 0.03), 8), n2.cyl(0.0125, 0.0125, 0.014, Ag, q(-0.044, 0.056, 0.055 + e5 * 0.03), 8);
}
function Qg(e4) {
  let { s: t2, m: n2 } = e4;
  Gg(e4, -0.036, -0.012, 0.26, ug, dg), Ug(e4, 0.014, 0.112, -8e-3, ug), t2.rbox(0.064, 0.104, 0.3, 0.02, hg, q(0, 0.077, 0.1), gg, 1), t2.rbox(0.058, 0.02, 0.26, 8e-3, ug, q(0, 0.132, 0.1), void 0, 1), Hg(e4, 0.067, 0.016, 0.24, q(0, 0.05, 0.1)), t2.box(6e-3, 0.032, 0.08, lg, q(-0.033, 0.095, 0.14)), n2.box(0.01, 0.014, 0.03, fg, q(-0.036, 0.095, 0.12)), t2.rbox(0.01, 0.056, 0.14, 3e-3, sg, q(0.036, 0.086, 0.1), void 0, 1);
  for (let e5 = 0; e5 < 4; e5++) t2.cyl(0.011, 0.011, 0.046, Ng, q(0.048, 0.09, 0.052 + e5 * 0.032), 8), n2.cyl(0.0115, 0.0115, 0.012, Ag, q(0.048, 0.062, 0.052 + e5 * 0.032), 8);
  qg(e4, 0.146, -0.04, 0.24, 0.03);
  for (let e5 of [-1, 1]) n2.box(8e-3, 0.034, 0.016, sg, q(e5 * 0.016, 0.168, -0.02));
  n2.torus(0.014, 4e-3, cg, q(0, 0.178, -0.02), 5, 12), n2.cyl(0.017, 0.017, 0.42, pg, J(0, 0.104, 0.46), 10), t2.rbox(0.05, 0.036, 0.3, 0.012, cg, q(0, 0.124, 0.43), void 0, 1);
  for (let e5 = 0; e5 < 6; e5++) t2.box(0.052, 0.012, 0.02, lg, q(0, 0.126, 0.315 + e5 * 0.045)), t2.box(0.03, 0.038, 0.02, lg, q(0, 0.122, 0.315 + e5 * 0.045));
  n2.cyl(0.016, 0.016, 0.34, pg, J(0, 0.06, 0.42), 10), n2.cyl(0.02, 0.02, 0.03, ug, J(0, 0.06, 0.6), 10), t2.rbox(0.072, 0.07, 0.17, 0.022, ug, q(0, 0.062, 0.33), dg, 1);
  for (let e5 = 0; e5 < 3; e5++) for (let n3 of [-1, 1]) t2.box(6e-3, 8e-3, 0.13, sg, q(n3 * 0.036, 0.046 + e5 * 0.016, 0.33));
  n2.rbox(0.046, 0.046, 0.04, 8e-3, ug, q(0, 0.104, 0.69), dg, 1);
  for (let e5 = 0; e5 < 4; e5++) {
    let t3 = e5 * qh + Kh / 4;
    n2.box(0.012, 0.012, 0.024, dg, q(Math.cos(t3) * 0.016, 0.104 + Math.sin(t3) * 0.016, 0.718));
  }
  n2.cyl(0.012, 0.012, 4e-3, lg, J(0, 0.104, 0.711), 8), n2.cyl(0.018, 0.018, 0.15, cg, J(0, 0.104, -0.12), 8), t2.rbox(0.052, 0.124, 0.14, 0.02, ug, q(0, 0.08, -0.225), dg, 1), t2.box(0.054, 0.04, 0.07, lg, q(0, 0.07, -0.215)), t2.rbox(0.056, 0.154, 0.032, 0.01, sg, q(0, 0.07, -0.298), cg, 1), Hg(e4, 0.054, 0.012, 0.12, q(0, 0.136, -0.225)), Wg(e4, 0.033, 0.05, 0.02), Wg(e4, 0.033, 0.05, 0.2);
}
function $g(e4) {
  let { s: t2, m: n2, g: r } = e4;
  Gg(e4, -0.035, -0.014, 0.3, Og, kg), t2.rbox(0.064, 0.076, 0.58, 0.024, Og, q(0, 0.05, 0.22), kg, 1), t2.rbox(0.058, 0.142, 0.32, 0.026, Og, q(0, 0.02, -0.25), kg, 1), t2.box(0.06, 0.036, 0.09, lg, q(0, 0.025, -0.13)), t2.rbox(0.05, 0.04, 0.17, 0.014, cg, q(0, 0.106, -0.23), void 0, 1), t2.rbox(0.062, 0.152, 0.032, 0.01, sg, q(0, 0.02, -0.42), cg, 1);
  for (let e5 = 0; e5 < 4; e5++) for (let n3 of [-1, 1]) t2.box(6e-3, 0.03, 0.022, lg, q(n3 * 0.032, 0.05, 0.3 + e5 * 0.045));
  Hg(e4, 0.062, 0.014, 0.1, q(0, 0.03, -0.25)), n2.cyl(0.026, 0.026, 0.32, pg, J(0, 0.1, 0.08), 10), n2.cyl(0.022, 0.022, 0.03, fg, J(0, 0.1, -0.09), 8), n2.cyl(0.014, 0.019, 0.6, pg, J(0, 0.1, 0.53), 10), n2.rbox(0.054, 0.054, 0.1, 0.012, ug, q(0, 0.1, 0.87), dg, 1);
  for (let e5 = 0; e5 < 3; e5++) for (let t3 of [-1, 1]) n2.box(8e-3, 0.032, 0.014, lg, q(t3 * 0.027, 0.1, 0.84 + e5 * 0.026));
  n2.cyl(0.012, 0.012, 4e-3, lg, J(0, 0.1, 0.921), 8), rg(n2, 0.022, 0.1, -0.04, 0.064, 0.066, -0.05, 7e-3, fg), n2.sphere(0.016, fg, q(0.07, 0.062, -0.051), 8, 6), n2.cyl(0.023, 0.023, 0.3, sg, J(0, 0.182, 0.1), 12), n2.cyl(0.042, 0.023, 0.08, sg, J(0, 0.182, 0.29), 14), n2.cyl(0.042, 0.042, 0.05, cg, J(0, 0.182, 0.355), 14), r.cyl(0.035, 0.035, 4e-3, zg, J(0, 0.182, 0.381), 14), n2.cyl(0.022, 0.032, 0.06, sg, J(0, 0.182, -0.075), 12), n2.cyl(0.032, 0.032, 0.04, cg, J(0, 0.182, -0.124), 12), n2.cyl(0.026, 0.026, 4e-3, Rg, J(0, 0.182, -0.145), 10), n2.cyl(0.014, 0.014, 0.032, cg, q(0, 0.212, 0.1), 8), n2.cyl(0.014, 0.014, 0.032, cg, eg(0.034, 0.182, 0.1), 8), (e4.rar >= 3 ? r : t2).cyl(0.0245, 0.0245, 0.02, e4.acc, J(0, 0.182, 0.2), 12), n2.box(0.054, 0.066, 0.022, pg, q(0, 0.152, 0.02)), n2.box(0.054, 0.066, 0.022, pg, q(0, 0.152, 0.18)), t2.rbox(0.042, 0.054, 0.09, 8e-3, sg, q(0, 0, 0.15), cg, 1), Ug(e4, 0.018, 0.095, -6e-3, sg), n2.box(0.054, 0.022, 0.03, pg, q(0, 0.012, 0.44));
  for (let r2 of [-1, 1]) rg(n2, r2 * 0.02, 0.01, 0.44, r2 * 0.032, 0, 0.64, 7e-3, pg), t2.box(0.018, 0.018, 0.03, sg, q(r2 * 0.032, 0, 0.65)), Wg(e4, r2 * 0.033, 0.05, -0.05);
}
function e_(e4) {
  let { s: t2, m: n2 } = e4;
  Gg(e4, -0.032, -0.012, 0.2, ug, dg, 0.036, 0.118);
  for (let t3 of [-1, 1]) Hg(e4, 4e-3, 0.07, 0.036, q(t3 * 0.019, -0.03, -0.013, 0.2));
  t2.rbox(0.034, 0.03, 0.19, 8e-3, ug, q(0, 0.034, 0.085), dg, 1), t2.box(0.024, 0.012, 0.06, cg, q(0, 0.018, 0.15)), Ug(e4, 0.015, 0.085, -0.012, ug), t2.rbox(0.04, 0.048, 0.26, 0.01, hg, q(0, 0.072, 0.085), gg, 1), n2.box(0.042, 8e-3, 0.2, fg, q(0, 0.098, 0.1));
  for (let e5 = 0; e5 < 5; e5++) for (let t3 of [-1, 1]) n2.box(4e-3, 0.034, 5e-3, sg, q(t3 * 0.02, 0.072, -0.03 + e5 * 0.011));
  t2.box(6e-3, 0.018, 0.05, lg, q(0.02, 0.08, 0.1)), n2.box(0.022, 0.01, 0.012, sg, q(0, 0.1, -0.036)), n2.box(6e-3, 0.01, 0.01, mg, q(0, 0.1, 0.2)), n2.cyl(0.011, 0.011, 0.012, cg, J(0, 0.07, 0.218), 8), n2.cyl(7e-3, 7e-3, 4e-3, lg, J(0, 0.07, 0.224), 8), n2.box(0.01, 0.02, 0.012, cg, q(0, 0.064, -0.052, -0.4)), t2.cyl(5e-3, 5e-3, 4e-3, Ng, eg(-0.018, 0.04, 0), 6), Wg(e4, 0.019, -0.03, -0.012), Wg(e4, -0.019, -0.03, -0.012), Wg(e4, 0.018, 0.036, 0.12);
}
var t_ = 4170573, n_ = 2914874;
function r_(e4) {
  let { s: t2, m: n2 } = e4, r = 0.118;
  Gg(e4, -0.036, -0.01, 0.2, Tg, Eg, 0.04, 0.12), t2.rbox(0.04, 0.12, 0.052, 0.016, Tg, q(0, -0.036, 0.2, 0.1), Eg, 1), t2.rbox(0.044, 0.05, 0.33, 0.012, sg, q(0, 0.048, 0.1), cg, 1), Ug(e4, 0.02, 0.1, -0.01, sg), t2.cyl(0.05, 0.05, 0.84, Og, J(0, r, -0.02), 14, kg), t2.cyl(0.059, 0.059, 0.28, Tg, J(0, r, -0.17), 14, Eg);
  for (let e5 of [-0.31, -0.03]) n2.cyl(0.062, 0.062, 0.018, pg, J(0, r, e5), 14);
  t2.cyl(0.05, 0.092, 0.12, Og, J(0, r, -0.49), 14, kg), n2.cyl(0.094, 0.094, 0.014, pg, J(0, r, -0.55), 14), t2.cyl(0.082, 0.082, 4e-3, lg, J(0, r, -0.552), 12), (e4.rar >= 3 ? e4.g : t2).cyl(0.0515, 0.0515, 0.03, e4.rar >= 3 ? Bg(e4.acc, 0.8) : e4.acc, J(0, r, 0.3), 14), n2.cyl(0.055, 0.055, 0.03, pg, J(0, r, 0.38), 14), t2.cyl(0.032, 0.032, 0.06, n_, J(0, r, 0.415), 10), t2.cyl(0.074, 0.036, 0.07, n_, J(0, r, 0.465), 14, t_), t2.cyl(0.076, 0.076, 0.014, Ng, J(0, r, 0.5), 14), t2.cone(0.074, 0.15, t_, J(0, r, 0.582), 14, Ng), n2.cyl(8e-3, 0.012, 0.02, fg, J(0, r, 0.664), 6), t2.box(0.022, 0.014, 0.32, sg, q(0, 0.174, 0.1)), n2.box(8e-3, 0.06, 0.012, cg, q(0, 0.205, 0.24)), n2.box(0.034, 0.01, 0.012, cg, q(0, 0.232, 0.24)), t2.rbox(0.05, 0.05, 0.08, 0.012, sg, q(0, 0.21, -0.03), cg, 1), n2.box(0.034, 0.032, 4e-3, Rg, q(0, 0.21, 0.011)), t2.box(6e-3, 0.024, 0.52, bg, q(-0.056, 0.09, -0.06)), n2.box(0.014, 0.032, 0.018, fg, q(-0.054, 0.09, -0.32)), n2.box(0.014, 0.032, 0.018, fg, q(-0.054, 0.09, 0.2)), Wg(e4, 0.022, 0.048, 0.05), Wg(e4, 0.022, 0.048, 0.15);
}
var i_ = 5208634, a_ = 7774800;
function o_(e4, t2, n2, r) {
  let { s: i, m: a } = e4;
  i.sphere(0.046, i_, q(t2, n2, r, 0, 0, 0, 1, 1.12, 1), 14, 10, a_);
  for (let e5 = 0; e5 < 3; e5++) i.torus(0.0465, 35e-4, Bg(i_, 0.55), q(t2, n2, r, 0, e5 * Kh / 3, 0, 1, 1.12, 1), 4, 20);
  i.cyl(0.0475, 0.0475, 0.016, Fg, q(t2, n2 - 4e-3, r), 14), i.cyl(0.03, 0.04, 0.012, Bg(i_, 0.7), q(t2, n2 - 0.048, r), 12), a.cyl(0.019, 0.024, 0.024, pg, q(t2, n2 + 0.058, r), 10), a.cyl(0.015, 0.015, 0.012, fg, q(t2, n2 + 0.075, r), 10), a.box(0.018, 0.012, 0.034, fg, q(t2, n2 + 0.075, r - 0.02, -0.15)), a.box(0.018, 0.07, 7e-3, fg, q(t2, n2 + 0.035, r - 0.047, -0.28)), a.cyl(4e-3, 4e-3, 0.034, Ag, eg(t2 + 0.017, n2 + 0.066, r), 5), a.torus(0.017, 35e-4, Ag, q(t2 + 0.042, n2 + 0.066, r, 0, qh, 0), 5, 12);
}
function s_(e4) {
  o_(e4, 0, 0.055, 0.02);
}
function c_(e4) {
  let { s: t2, m: n2, g: r } = e4;
  t2.cyl(0.036, 0.036, 0.26, n_, J(0, 0, -0.06), 12, t_), t2.cyl(0.0375, 0.0375, 0.022, Fg, J(0, 0, -0.02), 12), t2.cyl(0.0375, 0.0375, 0.01, Pg, J(0, 0, -0.1), 12), t2.cyl(0.064, 0.036, 0.06, n_, J(0, 0, 0.1), 14, t_), t2.cyl(0.066, 0.066, 0.014, Ng, J(0, 0, 0.13), 14), t2.cone(0.064, 0.15, t_, J(0, 0, 0.212), 14, Ng), n2.cyl(6e-3, 0.01, 0.014, fg, J(0, 0, 0.292), 6), n2.cyl(0.036, 0.024, 0.05, pg, J(0, 0, -0.215), 12), n2.cyl(0.024, 0.032, 0.032, pg, J(0, 0, -0.256), 12), r.cyl(0.022, 0.026, 6e-3, 16751146, J(0, 0, -0.273), 10), r.cone(0.022, 0.07, 16765802, q(0, 0, -0.31, -qh, 0, 0), 8);
  for (let e5 = 0; e5 < 4; e5++) {
    let n3 = e5 * qh + Kh / 4;
    t2.box(6e-3, 0.07, 0.11, Ng, q(Math.cos(n3) * 0.062, Math.sin(n3) * 0.062, -0.19, 0, 0, n3 - qh)), t2.box(8e-3, 0.014, 0.11, Pg, q(Math.cos(n3) * 0.097, Math.sin(n3) * 0.097, -0.19, 0, 0, n3 - qh));
  }
}
var l_ = { ar: Jg, smg: Xg, pump: Zg, sniper: $g, pistol: e_, rpg: r_, tac: Qg, burst: Yg, grenade: s_, smoke: s_, stink: s_, shock: s_, bounce: s_, pulse: Xg, sky: Jg }, u_ = { ar: [0, 0.114, 0.676], smg: [0, 0.094, 0.494], pump: [0, 0.104, 0.708], sniper: [0, 0.1, 0.924], pistol: [0, 0.07, 0.226], rpg: [0, 0.118, 0.67], tac: [0, 0.104, 0.73], burst: [0, 0.08, 0.6], grenade: [0, 0.055, 0.02], smoke: [0, 0.055, 0.02], stink: [0, 0.055, 0.02], shock: [0, 0.055, 0.02], bounce: [0, 0.055, 0.02], pulse: [0, 0.094, 0.494], sky: [0, 0.114, 0.676] }, d_ = { ar: [0, 0.115, 0.718], smg: [0, 0.097, 0.516], pump: [0, 0.104, 0.713], sniper: [0, 0.104, 0.93], pistol: [0, 0.072, 0.25], rpg: [0, 0.118, 0.68], tac: [0, 0.104, 0.75], burst: [0, 0.088, 0.586], grenade: [0, 0.055, 0.02], smoke: [0, 0.055, 0.02], stink: [0, 0.055, 0.02], shock: [0, 0.055, 0.02], bounce: [0, 0.055, 0.02], pulse: [0, 0.097, 0.516], sky: [0, 0.115, 0.718] }, f_ = { ar: Ig, smg: Fg, pump: Ag, sniper: Fg, pistol: yg, rpg: Fg, tac: Ng, burst: Lg, grenade: Fg, smoke: Ng, stink: Ag, shock: Ig, bounce: yg, pulse: Fg, sky: Ig }, p_ = { ar: { fore: [0.016, 0.05, 0.4], mag: [0, -0.15, 0.2], reload: `mag` }, burst: { fore: [0.016, 0.03, 0.32], mag: [0, -0.1, -0.1], reload: `mag` }, smg: { fore: [6e-3, -0.035, 0.33], mag: [0, -0.15, 0.17], reload: `mag` }, pump: { fore: [0.016, 0.02, 0.41], mag: [0, 0, 0.15], reload: `shells`, action: `pump` }, tac: { fore: [0.016, 0.03, 0.37], mag: [0, -0.01, 0.14], reload: `shells` }, sniper: { fore: [0.016, -5e-3, 0.44], mag: [0, -0.07, 0.08], reload: `mag` }, pistol: { fore: [0.04, -0.045, -5e-3], mag: [0, -0.15, -0.01], reload: `mag` }, rpg: { fore: [4e-3, -0.07, 0.19], mag: [0, 0.12, 0.62], reload: `tube` }, grenade: { fore: [0, 0, 0], mag: [0, 0, 0], reload: `none` }, smoke: { fore: [0, 0, 0], mag: [0, 0, 0], reload: `none` }, stink: { fore: [0, 0, 0], mag: [0, 0, 0], reload: `none` }, shock: { fore: [0, 0, 0], mag: [0, 0, 0], reload: `none` }, bounce: { fore: [0, 0, 0], mag: [0, 0, 0], reload: `none` }, pulse: { fore: [6e-3, -0.035, 0.33], mag: [0, -0.15, 0.17], reload: `mag` }, sky: { fore: [0.016, 0.05, 0.4], mag: [0, -0.15, 0.2], reload: `mag` } };
function m_(e4, t2) {
  let n2 = t2 === void 0 || e4 === `grenade` ? -1 : t2, r = n2 < 0 ? f_[e4] : Fh[n2], i = $h(`weapons`, e4, r, n2 >= 3), a = Xh(new Pn(), i ?? Yh(`weapon_` + e4 + `_` + n2, l_[e4], r, n2)), o = i ? d_[e4] : u_[e4];
  a.userData.muzzle = new R(o[0], o[1], o[2]);
  let s2 = p_[e4];
  return a.userData.fore = new R(s2.fore[0], s2.fore[1], s2.fore[2]), a.userData.mag = new R(s2.mag[0], s2.mag[1], s2.mag[2]), a.userData.reload = s2.reload, s2.action && (a.userData.action = s2.action), a;
}
function h_() {
  return Xh(new Pn(), $h(`weapons`, `nade`) ?? Yh(`grenade_thrown`, (e4) => o_(e4, 0, 0, 0)));
}
function g_() {
  return Xh(new Pn(), $h(`weapons`, `rocket`, Fg) ?? Yh(`rocket`, c_));
}
var __ = 3112432, v_ = 5939967;
function y_(e4) {
  let { s: t2, m: n2 } = e4;
  t2.cyl(0.021, 0.025, 0.9, Dg, q(0, 0.145, 0), 8, Tg), n2.cyl(0.03, 0.028, 0.036, pg, q(0, -0.318, 0), 8), n2.sphere(0.022, fg, q(0, -0.34, 0), 8, 5), t2.cyl(0.0255, 0.0265, 0.27, sg, q(0, -0.15, 0), 8, cg);
  for (let e5 = 0; e5 < 7; e5++) t2.cyl(0.0285, 0.0285, 0.016, e5 % 2 ? Ig : 16757575, q(0, -0.27 + e5 * 0.04, 0, 0.32, 0, 0), 8);
  n2.cyl(0.03, 0.03, 0.024, fg, q(0, 0, 0), 8), n2.cyl(0.026, 0.026, 0.05, pg, q(0, 0.51, 0), 8), t2.rbox(0.078, 0.104, 0.12, 0.02, __, q(0, 0.588, 0), v_, 1), n2.box(0.082, 0.014, 0.124, fg, q(0, 0.638, 0)), n2.box(0.082, 0.014, 0.124, fg, q(0, 0.538, 0)), Wg(e4, 0.04, 0.588, 0.03), Wg(e4, -0.04, 0.588, 0.03), Wg(e4, 0.04, 0.588, -0.03), Wg(e4, -0.04, 0.588, -0.03), rg(t2, 0, 0.6, 0.05, 0, 0.592, 0.17, 0.04, __, 6, 0.031, v_), rg(n2, 0, 0.592, 0.168, 0, 0.565, 0.29, 0.031, pg, 6, 0.02, fg), rg(n2, 0, 0.565, 0.288, 0, 0.512, 0.385, 0.02, fg, 6, 2e-3, mg), n2.box(6e-3, 0.012, 0.16, mg, q(0, 0.612, 0.17, 0.08)), t2.rbox(0.07, 0.07, 0.1, 0.014, __, q(0, 0.588, -0.1), v_, 1), n2.cyl(0.044, 0.04, 0.034, pg, J(0, 0.588, -0.162), 10), n2.cyl(0.04, 0.04, 6e-3, mg, J(0, 0.588, -0.181), 10), n2.cone(0.022, 0.06, fg, q(0, 0.674, 0), 6);
}
function b_() {
  return Xh(new Pn(), $h(`weapons`, `pickaxe`) ?? Yh(`pickaxe`, y_));
}
function x_(e4, t2, n2, r, i, a = false) {
  let o = [], s2 = [], c = [0, 0, 0];
  for (let e5 = 0; e5 <= n2; e5++) for (let i2 = 0; i2 <= t2; i2++) r(i2 / t2, e5 / n2, c), o.push(c[0], c[1], c[2]);
  for (let e5 = 0; e5 < n2; e5++) for (let n3 = 0; n3 < t2; n3++) {
    let r2 = e5 * (t2 + 1) + n3, i2 = r2 + 1, o2 = r2 + t2 + 2, c2 = r2 + t2 + 1;
    a ? s2.push(r2, o2, i2, r2, c2, o2) : s2.push(r2, i2, o2, r2, o2, c2);
  }
  let l2 = new Hr();
  l2.setAttribute(`position`, new V(o, 3)), l2.setIndex(s2), l2.computeVertexNormals(), e4.add(l2, i), l2.dispose();
}
function S_(e4) {
  return (t2) => {
    let { s: n2, m: r } = t2, i = 2.3, a = Vg(e4) > 0.7 ? 2832981 : Pg, o = Bg(e4, 0.55), s2 = Bg(e4, 0.42), c = Bg(a, 0.62), l2 = (e5) => e5 / i * (e5 / i), u = (e5) => 1.12 + 0.36 * (1 - l2(e5)), d = (e5) => 1.62 - 0.72 * l2(e5), f = (e5) => -0.12 - 0.28 * l2(e5), p = (e5, t3) => 0.13 * t3 * Math.sin(Kh * e5 ** 0.62), m = (e5, t3) => -0.035 * t3 * Math.sin(Kh * e5), h = 2 * i / 9;
    for (let t3 = 0; t3 < 9; t3++) {
      let r2 = -2.3 + t3 * h, i2 = t3 % 2 ? a : e4, l3 = t3 === 0 || t3 === 8, g2 = (e5, t4) => (n3, i3, a2) => {
        let o2 = r2 + n3 * h, s3 = d(o2), c2 = e5 + (t4 - e5) * i3, l4 = 1 + 0.22 * Math.sin(Kh * n3);
        a2[0] = o2, a2[1] = u(o2) + p(c2, s3) * l4, a2[2] = f(o2) + s3 / 2 - c2 * s3;
      };
      x_(n2, 4, 3, g2(0, 0.16), l3 ? Fg : i2 === Pg ? e4 : a), x_(n2, 4, 6, g2(0.16, 0.82), l3 ? o : i2), x_(n2, 4, 2, g2(0.82, 1), o), x_(n2, 4, 6, (e5, t4, n3) => {
        let i3 = r2 + e5 * h, a2 = d(i3);
        n3[0] = i3, n3[1] = u(i3) + m(t4, a2), n3[2] = f(i3) + a2 / 2 - t4 * a2;
      }, i2 === a ? c : s2, true), l3 || n2.box(h * 0.6, 0.05, 0.012, lg, q(r2 + h / 2, u(r2 + h / 2) + 0.03, f(r2 + h / 2) + d(r2 + h / 2) / 2 - 0.01));
    }
    for (let e5 of [-1, 1]) {
      let t3 = e5 * i, r2 = d(t3);
      x_(n2, 1, 8, (e6, n3, i2) => {
        i2[0] = t3, i2[1] = u(t3) + (e6 ? p(n3, r2) * 1 : m(n3, r2)), i2[2] = f(t3) + r2 / 2 - n3 * r2;
      }, o, e5 > 0);
    }
    for (let t3 = 1; t3 < 9; t3++) {
      let r2 = -2.3 + t3 * h, i2 = d(r2);
      for (let t4 = 0; t4 < 4; t4++) {
        let a2 = 0.08 + t4 * 0.22, o2 = a2 + 0.22;
        rg(n2, r2, u(r2) + p(a2, i2) + 4e-3, f(r2) + i2 / 2 - a2 * i2, r2, u(r2) + p(o2, i2) + 4e-3, f(r2) + i2 / 2 - o2 * i2, 9e-3, Bg(e4, 0.7), 4);
      }
    }
    for (let e5 of [-1, 1]) {
      rg(r, e5 * 0.4, 0, 0, e5 * 0.08, 1.16, 0, 0.017, pg, 6), n2.cyl(0.028, 0.028, 0.17, sg, eg(e5 * 0.29, 0, 0), 8), n2.cyl(0.031, 0.031, 0.022, Ng, eg(e5 * 0.4, 0, 0), 8);
      for (let t3 of [0.35, 0.62, 0.86]) {
        let r2 = e5 * i * t3, a2 = d(r2);
        rg(n2, e5 * 0.4, 0, 0, r2, u(r2) - 0.03 * a2, f(r2) + a2 * 0.3, 6e-3, Pg, 4), rg(n2, e5 * 0.4, 0, 0, r2, u(r2) - 0.02 * a2, f(r2) - a2 * 0.25, 6e-3, Pg, 4);
      }
    }
    r.cyl(0.021, 0.021, 0.82, fg, eg(0, 0, 0), 8), r.sphere(0.06, fg, q(0, 1.18, 0), 10, 8), rg(r, 0, 1.2, 0.7, 0, 1.2, -1, 0.022, cg, 6), rg(r, 0, 1.2, 0, 0, 1.38, 0.55, 0.016, cg, 5), rg(r, 0, 1.2, 0, 0, 1.38, -0.7, 0.016, cg, 5), n2.cone(0.05, 0.16, Fg, J(0, 1.2, 0.77), 8);
  };
}
function C_(e4 = 3112432) {
  let t2 = new B(e4).lerp(new B(16777215), 0.6).getHex();
  return Xh(new Pn(), $h(`items`, `glider`, e4, false, t2) ?? Yh(`glider_` + e4, S_(e4)));
}
var w_ = 15985366, T_ = 14075556, E_ = 1402328, D_ = 5227519, O_ = 11851506, k_ = 5207206, A_ = 10119996, j_ = 13079128, M_ = 2374251;
function N_(e4) {
  let { s: t2, m: n2 } = e4;
  t2.cyl(0.048, 0.048, 0.086, T_, q(-0.03, 0.043, 0), 16, w_), t2.cyl(0.036, 0.036, 4e-3, T_, q(-0.03, 0.087, 0), 14), t2.cyl(0.024, 0.024, 6e-3, w_, q(-0.03, 0.088, 0), 12), t2.cyl(0.011, 0.011, 8e-3, 11114618, q(-0.03, 0.089, 0), 8), t2.cyl(0.0495, 0.0495, 0.016, Ng, q(-0.03, 0.043, 0), 16), t2.box(4e-3, 0.074, 0.05, w_, q(0.019, 0.04, 0.014, 0, 0.3, 0)), t2.box(0.034, 0.034, 4e-3, Pg, q(-0.03, 0.062, 0.049)), t2.box(0.024, 8e-3, 5e-3, Ng, q(-0.03, 0.062, 0.051)), t2.box(8e-3, 0.024, 5e-3, Ng, q(-0.03, 0.062, 0.051)), t2.cyl(0.036, 0.036, 0.074, T_, eg(0.05, 0.036, 0.04), 14, w_), t2.cyl(0.0375, 0.0375, 0.014, Ng, eg(0.05, 0.036, 0.04), 14), t2.cyl(0.021, 0.021, 0.078, T_, eg(0.05, 0.036, 0.04), 10), t2.cyl(9e-3, 9e-3, 0.082, 11114618, eg(0.05, 0.036, 0.04), 6), n2.box(4e-3, 4e-3, 0.032, fg, q(-0.03, 0.074, 0.05)), n2.sphere(5e-3, jg, q(-0.03, 0.074, 0.067), 6, 4);
}
function P_(e4) {
  let { s: t2, m: n2 } = e4;
  t2.rbox(0.3, 0.2, 0.12, 0.03, 14015200, q(0, 0.1, 0), Pg, 2), t2.box(0.304, 0.012, 0.124, 10134445, q(0, 0.13, 0));
  for (let e5 of [-1, 1]) t2.box(0.11, 0.036, 0.012, Ng, q(0, 0.08, e5 * 0.058)), t2.box(0.036, 0.11, 0.012, Ng, q(0, 0.08, e5 * 0.058));
  for (let e5 of [-1, 1]) t2.rbox(0.036, 0.21, 0.13, 0.012, Ng, q(e5 * 0.139, 0.1, 0), 15751752, 1), n2.box(0.03, 0.044, 0.01, fg, q(e5 * 0.085, 0.13, 0.062)), n2.cyl(7e-3, 7e-3, 0.012, fg, J(e5 * 0.085, 0.118, 0.066), 6), t2.box(0.018, 0.036, 0.022, sg, q(e5 * 0.055, 0.218, 0));
  t2.rbox(0.14, 0.022, 0.03, 9e-3, sg, q(0, 0.242, 0), cg, 1);
}
function F_(e4) {
  let { s: t2, g: n2 } = e4;
  t2.cyl(0.032, 0.036, 0.012, M_, q(0, 6e-3, 0), 14), n2.sphere(0.044, E_, q(0, 0.052, 0, 0, 0, 0, 1, 0.95, 1), 14, 10, D_), t2.cyl(0.0455, 0.0455, 0.016, k_, q(0, 0.04, 0), 16), t2.box(0.02, 0.012, 6e-3, Pg, q(-6e-3, 0.041, 0.045, 0, 0, 0.6)), t2.box(0.02, 0.012, 6e-3, Pg, q(6e-3, 0.041, 0.045, 0, 0, -0.6)), t2.cyl(0.015, 0.022, 0.03, O_, q(0, 0.102, 0), 10), t2.cyl(0.021, 0.021, 8e-3, k_, q(0, 0.118, 0), 10), t2.cyl(0.015, 0.017, 0.024, A_, q(0, 0.133, 0), 8, j_), t2.sphere(8e-3, Pg, q(-0.022, 0.072, 0.03), 6, 4);
}
function I_(e4) {
  let { s: t2, g: n2 } = e4;
  t2.cyl(0.086, 0.092, 0.022, M_, q(0, 0.011, 0), 16), n2.cyl(0.085, 0.085, 0.13, E_, q(0, 0.087, 0), 14, D_), n2.sphere(0.085, D_, q(0, 0.152, 0, 0, 0, 0, 1, 0.72, 1), 14, 7), t2.cyl(0.089, 0.089, 0.018, k_, q(0, 0.056, 0), 16), t2.cyl(0.089, 0.089, 0.018, k_, q(0, 0.146, 0), 16);
  for (let e5 = 0; e5 < 4; e5++) {
    let n3 = e5 * qh + Kh / 4;
    t2.box(0.018, 0.1, 0.01, k_, q(Math.cos(n3) * 0.088, 0.1, Math.sin(n3) * 0.088, 0, qh - n3, 0));
  }
  t2.rbox(0.056, 0.05, 0.012, 0.01, Pg, q(0, 0.106, 0.084), void 0, 1), t2.cone(0.028, 0.03, Pg, q(0, 0.074, 0.084, Kh, 0, 0, 1, 1, 0.3), 4), t2.box(0.03, 0.01, 0.014, E_, q(0, 0.108, 0.087)), t2.box(0.01, 0.03, 0.014, E_, q(0, 0.104, 0.087)), t2.cyl(0.03, 0.048, 0.046, O_, q(0, 0.228, 0), 12), t2.cyl(0.037, 0.037, 0.012, k_, q(0, 0.254, 0), 12), t2.cyl(0.026, 0.03, 0.036, A_, q(0, 0.277, 0), 10, j_), t2.torus(0.036, 9e-3, k_, q(0.078, 0.2, 0), 6, 12), t2.sphere(0.012, Pg, q(-0.05, 0.16, 0.06), 6, 4);
}
// Compact wrist-mounted web launcher with spool, nozzle and cartridge.
function webShooterModel({s:b,m:metal,g:glow}) {
  b.rbox(.28,.13,.22,.025,0xb82b3c,q(0,.1,0),0xf35961,2);
  b.box(.22,.04,.17,0x27364c,q(0,.19,0),0x526d7e);
  metal.cyl(.065,.065,.11,0xc9d7df,q(0,.19,.13,Math.PI/2,0,0),12,0xffffff);
  glow.sphere(.034,0x8fe7ff,q(0,.19,.2),8,6);
  for(let x of [-.09,.09]) b.box(.03,.1,.22,0x263343,q(x,.09,0));
}
var L_ = { web: webShooterModel, bandage: N_, medkit: P_, mini: F_, big: I_, chug: F_, launchpad: N_, fortress: P_, riftbeacon: I_, spiketrap: N_ }, R_ = { web: `wrap`, bandage: `wrap`, medkit: `kit`, mini: `drink`, big: `drink`, chug: `drink`, launchpad: `kit`, fortress: `kit`, riftbeacon: `drink`, spiketrap: `wrap` };
function z_(e4) {
  let t2 = Xh(new Pn(), $h(`items`, e4) ?? Yh(`consumable_` + e4, L_[e4]));
  return t2.userData.use = R_[e4], t2;
}
var B_ = { light: [5, 2, 0.012, 0.035], medium: [4, 2, 0.015, 0.05], heavy: [3, 2, 0.02, 0.07], shells: [3, 2, 0.022, 0.04], rockets: [0, 0, 0, 0] };
function V_(e4) {
  return (t2) => {
    let { s: n2, m: r } = t2, i = zh[e4], a = Bg(i, 0.55), o = Bg(i, 1.35);
    if (e4 === `rockets`) {
      n2.rbox(0.32, 0.05, 0.22, 0.012, Tg, q(0, 0.025, 0), Eg, 1);
      for (let e5 of [-1, 1]) n2.box(0.04, 0.03, 0.24, Dg, q(e5 * 0.12, 0.012, 0));
      for (let e5 of [-1, 1]) {
        n2.cyl(0.032, 0.032, 0.18, n_, eg(-0.02, 0.09, e5 * 0.05), 10, t_), n2.cyl(0.033, 0.033, 0.016, Fg, eg(0.03, 0.09, e5 * 0.05), 10), n2.cone(0.032, 0.08, Ng, q(0.11, 0.09, e5 * 0.05, 0, 0, -qh), 10), r.cyl(0.022, 0.022, 0.024, pg, eg(-0.122, 0.09, e5 * 0.05), 8);
        for (let t3 = 0; t3 < 2; t3++) n2.box(0.06, 4e-3, 0.03, Ng, q(-0.09, 0.09, e5 * 0.05, t3 * Kh / 2 + Kh / 4, 0, 0));
      }
      for (let e5 of [-0.06, 0.05]) n2.box(0.024, 0.075, 0.17, i, q(e5, 0.09, 0));
      return;
    }
    n2.rbox(0.3, 0.15, 0.2, 0.024, a, q(0, 0.075, 0), i, 1), n2.rbox(0.31, 0.036, 0.21, 0.012, o, q(0, 0.13, 0), void 0, 1), n2.box(0.26, 0.01, 0.16, lg, q(0, 0.149, 0)), n2.rbox(0.14, 0.064, 8e-3, 4e-3, Pg, q(0, 0.064, 0.101), void 0, 1), n2.box(0.09, 0.012, 0.01, a, q(0, 0.076, 0.104)), n2.box(0.06, 0.012, 0.01, a, q(0, 0.054, 0.104));
    for (let e5 of [-1, 1]) r.box(0.012, 0.036, 0.08, fg, q(e5 * 0.155, 0.09, 0)), n2.box(0.012, 0.12, 0.012, Bg(i, 0.4), q(e5 * 0.1, 0.07, 0.101));
    let [s2, c, l2, u] = B_[e4];
    for (let t3 = 0; t3 < s2; t3++) for (let i2 = 0; i2 < c; i2++) {
      let a2 = (t3 - (s2 - 1) / 2) * (0.25 / s2), o2 = (i2 - (c - 1) / 2) * 0.08;
      e4 === `shells` ? (n2.cyl(l2, l2, u, Ng, q(a2, 0.15 + u / 2, o2), 10), r.cyl(l2 * 1.08, l2 * 1.08, 0.014, Ag, q(a2, 0.156 + u, o2), 10)) : (r.cyl(l2, l2, u, Ag, q(a2, 0.15 + u / 2, o2), 8), r.cone(l2 * 0.95, l2 * 2.2, 13136954, q(a2, 0.15 + u + l2 * 1.1, o2), 8));
    }
  };
}
function H_(e4) {
  return Xh(new Pn(), $h(`items`, `ammo_` + e4) ?? Yh(`ammo_` + e4, V_(e4)));
}
function U_(e4) {
  return (t2) => {
    let { s: n2, m: r } = t2, i = Hh[e4], a = Bg(i, 0.6), o = Bg(i, 1.3);
    if (e4 === `wood`) {
      for (let e5 = 0; e5 < 3; e5++) n2.rbox(0.125, 0.05, 0.45, 8e-3, a, q((e5 - 1) * 0.14, 0.025, 0, 0, (e5 - 1) * 0.04, 0), i, 1), n2.rbox(0.45, 0.05, 0.125, 8e-3, a, q(0, 0.076, (e5 - 1) * 0.14, 0, (1 - e5) * 0.05, 0), i, 1), n2.box(0.1, 0.03, 0.452, o, q((e5 - 1) * 0.14, 0.03, 0, 0, (e5 - 1) * 0.04, 0));
      n2.rbox(0.13, 0.052, 0.45, 0.01, i, q(-0.075, 0.128, 0.01, 0, 0.08, 0), o, 1), n2.rbox(0.13, 0.052, 0.45, 0.01, i, q(0.075, 0.128, -0.01, 0, -0.06, 0), o, 1);
      for (let e5 of [-0.075, 0.075]) for (let t3 = 0; t3 < 3; t3++) n2.box(4e-3, 3e-3, 0.3, a, q(e5 - 0.04 + t3 * 0.04, 0.155, 0));
      for (let e5 of [-1, 1]) n2.box(0.3, 0.012, 0.03, Dg, q(0, 0.157, e5 * 0.13)), r.cyl(8e-3, 8e-3, 6e-3, fg, q(-0.075, 0.158, e5 * 0.19), 6), r.cyl(8e-3, 8e-3, 6e-3, fg, q(0.075, 0.158, e5 * 0.19), 6);
    } else if (e4 === `stone`) {
      for (let e5 = 0; e5 < 4; e5++) {
        let t3 = (e5 % 2 ? 1 : -1) * 0.112, r2 = (e5 < 2 ? 1 : -1) * 0.08;
        n2.rbox(0.215, 0.11, 0.15, 0.014, a, q(t3, 0.055, r2, 0, (e5 - 1.5) * 0.03, 0), i, 1);
      }
      n2.box(0.4, 0.012, 0.28, Bg(i, 0.45), q(0, 0.112, 0)), n2.rbox(0.215, 0.11, 0.15, 0.015, a, q(-0.05, 0.172, 0.07, 0, 0.1, 0), o, 1), n2.rbox(0.215, 0.11, 0.15, 0.015, a, q(0.06, 0.172, -0.08, 0, -0.12, 0), o, 1), n2.rbox(0.2, 0.1, 0.14, 0.015, i, q(0, 0.278, 0, 0, 0.5, 0), o, 1), n2.box(0.05, 4e-3, 3e-3, a, q(0.02, 0.3, 0.071, 0, 0.5, 0.4));
    } else {
      let e5 = (e6, t3, n3) => {
        ig(r, 0.055, 0.14, 0.06, 1.28, i, e6, t3 + 0.03, n3, o), r.box(0.06, 4e-3, 0.12, o, q(e6, t3 + 0.061, n3));
      };
      for (let t3 = 0; t3 < 3; t3++) e5((t3 - 1) * 0.15, 0, 0);
      e5(-0.075, 0.062, 0.01), e5(0.075, 0.062, -0.01), e5(0, 0.124, 0), n2.box(0.46, 6e-3, 0.04, cg, q(0, 3e-3, 0.08)), n2.box(0.46, 6e-3, 0.04, cg, q(0, 3e-3, -0.08));
      for (let e6 of [-1, 1]) r.box(8e-3, 0.2, 0.03, pg, q(e6 * 0.232, 0.09, 0));
      r.box(0.472, 8e-3, 0.03, pg, q(0, 0.192, 0));
    }
  };
}
function W_(e4) {
  return Xh(new Pn(), $h(`items`, `mat_` + e4) ?? Yh(`mat_` + e4, U_(e4)));
}
var G_ = 1.15, K_ = 0.75, q_ = 0.45, J_ = 3809038, Y_ = 16758062, X_ = 16770442, Z_ = 10115626, Q_ = 13470277, $_ = 5911062;
function ev(e4) {
  let { s: t2, m: n2, g: r } = e4;
  t2.rbox(1.13, 0.41000000000000003, 0.73, 0.03, Z_, q(0, q_ / 2, 0), Q_, 2);
  for (let e5 of [0.15, 0.29]) t2.box(1.14, 0.01, 0.74, $_, q(0, e5, 0));
  for (let e5 of [-0.18, 0.18]) for (let n3 of [-1, 1]) t2.box(0.012, 0.33, 6e-3, $_, q(e5, q_ / 2, n3 * 0.367));
  t2.box(1.0299999999999998, 6e-3, 0.63, J_, q(0, 0.44, 0)), n2.rbox(1.18, 0.06, 0.78, 0.012, jg, q(0, 0.41800000000000004, 0), Mg, 1), n2.rbox(1.18, 0.06, 0.78, 0.012, jg, q(0, 0.05, 0), Mg, 1);
  for (let e5 of [-1, 1]) {
    n2.box(0.1, 0.4, 0.78, jg, q(e5 * 0.36, q_ / 2, 0), Mg);
    for (let t3 of [-1, 1]) n2.rbox(0.09, 0.43, 0.09, 0.014, jg, q(e5 * 0.5549999999999999, q_ / 2, t3 * 0.355), Mg, 1), n2.rbox(0.14, 0.05, 0.14, 0.012, jg, q(e5 * 0.5199999999999999, 0.025, t3 * 0.32), void 0, 1);
    for (let t3 of [0.16, 0.3]) for (let r2 of [-1, 1]) n2.sphere(0.016, Mg, q(e5 * 0.36, t3, r2 * 0.391), 6, 4);
    n2.box(0.03, 0.07, 0.08, Mg, q(e5 * 0.591, 0.32, 0)), n2.torus(0.07, 0.015, jg, q(e5 * 0.609, 0.25, 0, 0, qh, 0), 6, 10);
  }
  n2.rbox(0.18, 0.22, 0.05, 0.022, jg, q(0, 0.33, 0.397), Mg, 1), t2.cyl(0.02, 0.02, 6e-3, lg, J(0, 0.35, 0.425), 8), t2.box(0.016, 0.05, 6e-3, lg, q(0, 0.318, 0.425));
  for (let e5 of [-1, 1]) r.box(1.17, 0.024, 0.016, Y_, q(0, 0.459, e5 * 0.381), X_);
  for (let e5 of [-1, 1]) r.box(0.016, 0.024, 0.77, Y_, q(e5 * 0.581, 0.459, 0), X_);
  r.box(8e-3, 0.03, 4e-3, X_, q(0, 0.322, 0.429));
}
function tv(e4, t2, n2, r, i, a) {
  e4.add(new Ba(t2, t2, n2, 12, 1, false, Kh, Kh), r, q(i, 0.03, K_ / 2, 0, 0, -qh, 0.8, 1, 1), a);
}
function nv(e4) {
  let { s: t2, m: n2 } = e4, r = K_ / 2;
  tv(t2, 0.365, 1.13, Q_, 0);
  for (let e5 of [-0.22, -0.07, 0.07, 0.22]) tv(t2, 0.367, 8e-3, $_, e5);
  t2.box(1.0699999999999998, 4e-3, 0.67, J_, q(0, -3e-3, r)), n2.rbox(1.18, 0.05, 0.78, 0.012, jg, q(0, 0.045, r), Mg, 1);
  for (let e5 of [-1, 1]) tv(n2, 0.382, 0.1, jg, e5 * 0.36), tv(n2, 0.382, 0.08, jg, e5 * (G_ / 2 - 0.035)), n2.sphere(0.018, Mg, q(e5 * 0.36, 0.33, r), 6, 4), n2.sphere(0.018, Mg, q(e5 * 0.36, 0.25, 0.635), 6, 4);
  n2.rbox(0.16, 0.05, 0.16, 0.02, jg, q(0, 0.302, r), Mg, 1), n2.sphere(0.034, Mg, q(0, 0.33, r), 8, 6), n2.rbox(0.12, 0.11, 0.032, 0.012, Mg, q(0, 0.02, 0.77), void 0, 1), n2.box(0.07, 0.05, 0.04, jg, q(0, -0.032, 0.782));
}
function rv(e4) {
  e4.g.rbox(0.95, 0.3, 0.55, 0.1, 16753950, q(0, 0.51, 0), 16769658, 1);
}
function iv() {
  let e4 = Xh(new Pn(), $h(`items`, `chest`) ?? Yh(`chest_base`, ev)), t2 = Xh(new Pn(), $h(`items`, `chest_lid`) ?? Yh(`chest_lid`, nv));
  t2.position.set(0, q_, -0.75 / 2), e4.add(t2);
  let n2 = new Mi($h(`items`, `chest_glow`)?.glow ?? Yh(`chest_glow`, rv).glow, _m.glow);
  return n2.visible = false, e4.add(n2), { root: e4, lid: t2, glow: n2 };
}
var av = 15324010, ov = 3950631;
function sv(e4) {
  let { s: t2, m: n2 } = e4;
  t2.rbox(0.6, 0.23, 0.36, 0.022, Og, q(0, 0.135, 0), kg, 1), t2.box(0.604, 0.04, 0.364, av, q(0, 0.075, 0)), t2.box(0.54, 4e-3, 0.3, lg, q(0, 0.251, 0));
  for (let e5 = 0; e5 < 5; e5++) t2.box(e5 === 2 ? 0.012 : 0.034, 0.06, 4e-3, Pg, q(-0.1 + e5 * 0.05, 0.168, 0.181));
  for (let e5 of [-1, 1]) {
    t2.box(0.08, 0.022, 0.37, ov, q(e5 * 0.2, 0.011, 0));
    for (let t3 of [-1, 1]) n2.box(0.032, 0.232, 0.032, pg, q(e5 * 0.29, 0.135, t3 * 0.17)), n2.box(0.02, 0.04, 0.03, pg, q(e5 * 0.302, 0.17, t3 * 0.08));
    rg(n2, e5 * 0.315, 0.17, -0.08, e5 * 0.315, 0.17, 0.08, 0.01, fg), n2.box(0.05, 0.06, 0.012, fg, q(e5 * 0.17, 0.215, 0.184));
    for (let t3 = 0; t3 < 3; t3++) n2.cyl(0.024, 0.024, 0.02, Ag, q(e5 * (0.05 + t3 * 0.075), 0.256, e5 * 0.05 * (t3 % 2 ? 1 : -1)), 8), n2.cone(0.022, 0.03, 13136954, q(e5 * (0.05 + t3 * 0.075), 0.28, e5 * 0.05 * (t3 % 2 ? 1 : -1)), 8);
  }
}
function cv(e4) {
  let { s: t2, m: n2 } = e4, r = 0.18;
  t2.rbox(0.62, 0.11, 0.38, 0.026, Og, q(0, 0.055, r), kg, 1), t2.box(0.1, 0.114, 0.384, av, q(-0.2, 0.056, r)), t2.box(0.02, 0.115, 0.385, lg, q(-0.135, 0.056, r));
  for (let e5 of [-1, 1]) t2.box(0.3, 0.012, 0.04, ov, q(0.08, 0.113, r + e5 * 0.1));
  for (let e5 of [-1, 1]) n2.box(0.05, 0.05, 0.014, fg, q(e5 * 0.17, 0.03, 0.372)), n2.box(0.03, 0.022, 0.022, pg, q(e5 * 0.17, 0, 0.378)), n2.cyl(0.012, 0.012, 0.09, pg, eg(e5 * 0.18, 0, -4e-3), 6), n2.box(0.016, 0.03, 0.016, pg, q(0.08 + e5 * 0.09, 0.122, r));
  rg(n2, -0.01, 0.136, r, 0.17, 0.136, r, 0.01, fg);
}
function lv() {
  let e4 = Xh(new Pn(), $h(`items`, `ammobox`) ?? Yh(`crate_base`, sv)), t2 = Xh(new Pn(), $h(`items`, `ammobox_lid`) ?? Yh(`crate_lid`, cv));
  return t2.position.set(0, 0.25, -0.18), e4.add(t2), { root: e4, lid: t2 };
}
var uv = 1.3, dv = 0.22, fv = 2781152, pv = 5216255, mv = 1788576, hv = 4186367, gv = 5.4, _v = 1.55;
function vv(e4) {
  let { s: t2, m: n2, g: r } = e4, i = 0.78;
  t2.rbox(uv, i, uv, 0.05, fv, q(0, i / 2, 0), pv, 2);
  for (let e5 = 0; e5 < 4; e5++) {
    let n3 = e5 * Kh / 2, a = Math.sin(n3), o = Math.cos(n3);
    t2.box(0.86, 0.54, 0.02, mv, q(a * 0.654, i / 2, o * 0.654, 0, n3, 0)), t2.add(og(0.2, 0.03), Pg, q(a * 0.662, i / 2, o * 0.662, 0, n3, 0)), r.box(1.1800000000000002, 0.03, 0.012, hv, q(a * 0.656, 0.72, o * 0.656, 0, n3, 0)), r.box(1.1800000000000002, 0.03, 0.012, hv, q(a * 0.656, 0.08, o * 0.656, 0, n3, 0));
  }
  for (let e5 of [-1, 1]) for (let t3 of [-1, 1]) n2.rbox(0.13, 0.8, 0.13, 0.02, pg, q(e5 * 0.61, i / 2, t3 * 0.61), fg, 1), n2.rbox(0.18, 0.08, 0.18, 0.02, pg, q(e5 * 0.6, 0.04, t3 * 0.6), void 0, 1), n2.torus(0.04, 0.012, fg, q(e5 * 0.61, 0.81, t3 * 0.61), 5, 10);
  t2.box(1.1600000000000001, 0.01, 1.1600000000000001, lg, q(0, 0.776, 0));
}
function yv(e4) {
  let { s: t2, m: n2, g: r } = e4, i = uv / 2;
  t2.rbox(1.34, dv, 1.34, 0.05, mv, q(0, dv / 2, i), fv, 1), t2.rbox(1, 0.06, 1, 0.03, Pg, q(0, 0.24, i), void 0, 1), t2.add(og(0.26, 0.05), fv, q(0, 0.28, i, -qh, 0, 0)), r.box(1.35, 0.03, 0.03, hv, q(0, 0.02, 1.33));
  for (let e5 of [-1, 1]) n2.box(0.08, 0.1, 0.05, fg, q(e5 * 0.3, 0.06, 1.34)), n2.box(0.05, 0.24, 1.36, pg, q(e5 * 0.61, dv / 2, i));
}
function bv(e4) {
  let { s: t2, m: n2 } = e4, r = Kh * 2 / 12, i = [fv, Pg, fv, Fg], a = q(0, gv, 0, 0, 0, 0, 1, 1.12, 1);
  for (let e5 = 0; e5 < 12; e5++) {
    let n3 = i[e5 % 4];
    t2.add(new gs(_v, 2, 12, e5 * r, r, 0, Kh), Bg(n3, 0.75), a, n3);
  }
  t2.add(new gs(1.57, 12, 2, 0, Kh * 2, 0, 0.42), Fg, a), t2.cone(0.22, 0.3, mv, q(0, 3.564, 0, Kh, 0, 0), 12), n2.torus(0.16, 0.035, pg, q(0, 3.4240000000000004, 0, qh, 0, 0), 5, 12);
  let o = uv / 2 - 0.04;
  for (let e5 of [-1, 1]) for (let n3 of [-1, 1]) rg(t2, e5 * 0.14, 3.4240000000000004, n3 * 0.14, e5 * o, 0.78 + 0.05, n3 * o, 0.016, 14207392, 4);
}
function xv() {
  let e4 = Xh(new Pn(), $h(`items`, `supply`) ?? Yh(`supply_base`, vv)), t2 = Xh(new Pn(), $h(`items`, `supply_lid`) ?? Yh(`supply_lid`, yv));
  t2.position.set(0, 0.78, -1.3 / 2), e4.add(t2);
  let n2 = Xh(new Pn(), $h(`items`, `supply_balloon`) ?? Yh(`supply_balloon`, bv));
  return e4.add(n2), { root: e4, lid: t2, balloon: n2 };
}
var Sv = 2060261, Cv = 4035583, wv = 1395368, Tv = 10474751, Ev = 1776929, Dv = 14207392, Ov = -0.9, kv = 3.75, Av = 13, jv = 7.88, Mv = [16732010, 16765498, 4182122, 3842303, 12082421, 16747039];
function Nv(e4, t2, n2, r, i, a, o, s2, c) {
  let l2 = t2, u = n2, d = r;
  for (let f = 1; f <= s2; f++) {
    let p = f / s2, m = t2 + (i - t2) * p, h = r + (o - r) * p, g2 = n2 + (a - n2) * p - c * 4 * p * (1 - p);
    if (rg(e4, l2, u, d, m, g2, h, 0.018, Dv, 3), f < s2) {
      let n3 = Math.atan2(i - t2, o - r);
      e4.cone(0.16, 0.36, Mv[f % Mv.length], q(m, g2 - 0.2, h, Kh, n3, 0, 0.12, 1, 1), 3);
    }
    l2 = m, u = g2, d = h;
  }
}
function Pv(e4) {
  let { s: t2, m: n2, g: r } = e4;
  t2.rbox(2.6, 1.3, 7.3, 0.18, Sv, q(0, 1.2, -0.6), Cv, 2), t2.rbox(2.5, 1.1, 7.1, 0.22, Sv, q(0, 2.35, -0.65), Cv, 2), t2.rbox(2.4, 0.14, 6.9, 0.06, Pg, q(0, 2.9, -0.65), void 0, 1), t2.rbox(2.3, 0.95, 1.6, 0.2, Sv, q(0, 1.1, 3.7), Cv, 2), t2.rbox(0.9, 0.1, 1, 0.04, wv, q(0, 1.59, 3.7), void 0, 1), n2.rbox(0.5, 0.12, 0.3, 0.04, fg, q(0, 1.66, 4.1), mg, 1), n2.box(2.2, 0.8, 0.06, Tv, q(0, 2.3, 2.93, -0.1)), t2.box(0.06, 0.82, 0.08, wv, q(0, 2.3, 2.94, -0.1)), t2.box(1.5, 0.2, 0.1, Fg, q(0, 2.79, 2.9));
  for (let e5 = 0; e5 < 5; e5++) t2.box(0.12, 0.08, 0.11, wv, q(-0.5 + e5 * 0.25, 2.79, 2.905));
  rg(n2, -0.5, 1.92, 2.99, -0.1, 2.25, 2.96, 0.015, lg, 4), rg(n2, 0.5, 1.92, 2.99, 0.9, 2.25, 2.96, 0.015, lg, 4);
  for (let e5 of [-1, 1]) {
    for (let t3 = 0; t3 < 6; t3++) n2.box(0.06, 0.68, 0.86, Tv, q(e5 * 1.235, 2.35, 2.2 - t3 * 1.1));
    for (let n3 = 0; n3 < 5; n3++) t2.box(0.07, 0.72, 0.1, wv, q(e5 * 1.24, 2.35, 1.65 - n3 * 1.1));
    t2.box(0.05, 0.06, 6.8, Pg, q(e5 * 1.26, 1.93, -0.65)), t2.box(0.04, 0.14, 7.2, Fg, q(e5 * 1.3, 1.52, -0.6)), t2.box(0.04, 0.06, 7.2, wv, q(e5 * 1.3, 1.38, -0.6)), t2.box(0.04, 0.08, 4, Pg, q(e5 * 1.3, 0.78, -0.1)), t2.cyl(0.36, 0.36, 0.04, Pg, eg(e5 * 1.31, 1.05, -0.4), 16), t2.add(og(0.3, 0.05), Fg, q(e5 * 1.335, 1.05, -0.4, 0, e5 * qh, 0)), e5 > 0 && (t2.box(0.05, 1.7, 0.06, wv, q(1.31, 1.45, 2.2)), t2.box(0.05, 1.7, 0.06, wv, q(1.31, 1.45, 1.35)), n2.box(0.06, 0.06, 0.2, fg, q(1.33, 1.3, 1.5)));
    for (let r2 of [2.6, -2.8]) {
      t2.box(0.06, 0.52, 1.5, lg, q(e5 * 1.29, 0.8, r2)), t2.rbox(0.14, 0.1, 1.66, 0.04, wv, q(e5 * 1.31, 1.09, r2), void 0, 1), t2.cyl(0.6, 0.6, 0.45, Ev, eg(e5 * 1.12, 0.6, r2), 18);
      for (let n3 = 0; n3 < 9; n3++) {
        let i = n3 * Kh * 2 / 9;
        t2.box(0.47, 0.08, 0.12, 2829876, q(e5 * 1.12, 0.6 + Math.sin(i) * 0.58, r2 + Math.cos(i) * 0.58, -i, 0, 0));
      }
      n2.cyl(0.34, 0.34, 0.47, fg, eg(e5 * 1.12, 0.6, r2), 12), t2.cyl(0.15, 0.15, 0.5, Fg, eg(e5 * 1.12, 0.6, r2), 8);
      for (let t3 = 0; t3 < 5; t3++) {
        let i = t3 * Kh * 2 / 5;
        n2.cyl(0.035, 0.035, 0.5, pg, eg(e5 * 1.12, 0.6 + Math.sin(i) * 0.24, r2 + Math.cos(i) * 0.24), 6);
      }
    }
    n2.cyl(0.21, 0.21, 0.08, fg, J(e5 * 0.88, 1.15, 4.49), 12), r.cyl(0.165, 0.165, 0.06, 16771496, J(e5 * 0.88, 1.15, 4.52), 12), r.box(0.18, 0.08, 0.05, 16747038, q(e5 * 0.88, 0.86, 4.5)), r.box(0.26, 0.18, 0.05, 16722462, q(e5 * 1, 1.3, -4.26)), r.box(0.16, 0.1, 0.05, 16761390, q(e5 * 1, 1.55, -4.26)), rg(n2, e5 * 1.25, 2, 2.8, e5 * 1.6, 2.1, 3.1, 0.025, pg, 4), t2.rbox(0.07, 0.42, 0.26, 0.03, sg, q(e5 * 1.62, 2.15, 3.12), cg, 1), rg(n2, e5 * 1.05, 3.14, -3.8, e5 * 1.05, 3.14, 2.4, 0.035, pg, 6);
    for (let t3 = 0; t3 < 5; t3++) n2.box(0.05, 0.2, 0.05, pg, q(e5 * 1.05, 3.05, -3.8 + t3 * 1.55));
    t2.rbox(0.8, 0.6, 0.55, 0.05, sg, q(e5 * 0.56, 3.44, -3.3), cg, 1), n2.cyl(0.21, 0.21, 0.04, pg, eg(e5 * 0.965, 3.5, -3.3), 12), t2.cyl(0.13, 0.13, 0.06, lg, eg(e5 * 0.97, 3.5, -3.3), 10), n2.cyl(0.2, 0.2, 0.04, pg, J(e5 * 0.56, 3.46, -3.58), 12), t2.cyl(0.12, 0.12, 0.06, lg, J(e5 * 0.56, 3.46, -3.59), 10), t2.cyl(0.16, 0.16, 0.7, Ng, J(e5 * 0.55, 3.2, -2.3), 10), n2.cyl(0.06, 0.08, 0.1, fg, J(e5 * 0.55, 3.2, -1.9), 8);
    for (let n3 of [-1.6, 0.4]) rg(t2, e5 * 1.12, 3.14, n3, e5 * 1.36, 2.62, n3, 0.012, Dv, 3), t2.capsule(0.12, 0.12, 12159829, q(e5 * 1.38, 2.45, n3), 13936752, 3, 8), t2.cyl(0.05, 0.08, 0.06, 9069880, q(e5 * 1.38, 2.6, n3), 6);
  }
  for (let e5 = 0; e5 < 5; e5++) rg(n2, -1.05, 3.14, -3.8 + e5 * 1.55, 1.05, 3.14, -3.8 + e5 * 1.55, 0.03, pg, 6);
  n2.rbox(2.7, 0.24, 0.28, 0.06, fg, q(0, 0.62, 4.55), mg, 1), n2.rbox(2.7, 0.24, 0.28, 0.06, fg, q(0, 0.62, -4.33), mg, 1), t2.box(1.3, 0.5, 0.06, lg, q(0, 1.12, 4.5));
  for (let e5 = 0; e5 < 5; e5++) n2.box(1.34, 0.03, 0.08, fg, q(0, 0.94 + e5 * 0.09, 4.51));
  t2.rbox(0.6, 0.2, 0.04, 0.02, Fg, q(0, 0.62, 4.7), void 0, 1), t2.box(0.4, 0.05, 0.05, cg, q(0, 0.62, 4.71)), n2.cyl(0.07, 0.07, 0.5, pg, J(-0.8, 0.5, -4.3), 8), t2.box(1.2, 1.75, 0.06, Cv, q(0, 1.65, -4.25)), t2.box(1.3, 0.06, 0.07, Pg, q(0, 2.56, -4.25)), n2.box(0.8, 0.6, 0.08, Tv, q(0, 2.15, -4.26)), n2.box(0.06, 0.25, 0.1, fg, q(0.45, 1.5, -4.29)), t2.box(0.5, 0.12, 0.07, Fg, q(0, 1.2, -4.26));
  for (let e5 of [-1, 1]) rg(n2, e5 * 0.85, 0.9, -4.3, e5 * 0.85, 3.1, -4.3, 0.025, pg, 5);
  for (let e5 = 0; e5 < 5; e5++) rg(n2, -0.85, 1.1 + e5 * 0.45, -4.3, -0.55, 1.1 + e5 * 0.45, -4.3, 0.018, fg, 4);
  n2.cyl(0.18, 0.22, 0.4, pg, J(0, 3.5, -4.35), 10), n2.torus(0.95, 0.04, pg, q(0, 3.5, -4.6), 5, 24);
  for (let e5 = 0; e5 < 6; e5++) {
    let t3 = e5 * Kh / 3;
    rg(n2, 0, 3.5, -4.55, Math.cos(t3) * 0.95, 3.5 + Math.sin(t3) * 0.95, -4.6, 0.015, pg, 3);
  }
  for (let e5 = 0; e5 < 3; e5++) {
    let n3 = e5 * Kh * 2 / 3 + 0.3;
    t2.rbox(0.18, 0.85, 0.04, 0.03, e5 === 0 ? Ng : Pg, q(Math.cos(n3) * 0.45, 3.5 + Math.sin(n3) * 0.45, -4.57, 0, 0.35, n3 - qh), void 0, 1);
  }
  t2.cone(0.14, 0.24, Fg, q(0, 3.5, -4.72, -qh, 0, 0), 10), t2.box(1.9, 0.1, 0.14, sg, q(0, 3.22, 2.3));
  for (let e5 = 0; e5 < 4; e5++) t2.cyl(0.14, 0.14, 0.12, cg, J(-0.66 + e5 * 0.44, 3.36, 2.3), 8), r.cyl(0.11, 0.11, 0.04, 16773560, J(-0.66 + e5 * 0.44, 3.36, 2.365), 8);
  t2.rbox(0.7, 0.36, 0.9, 0.05, Ng, q(-0.35, 3.34, 1.1), 15755850, 1), t2.box(0.72, 0.05, 0.1, yg, q(-0.35, 3.36, 1.1)), t2.box(0.5, 0.3, 0.6, 15900730, q(0.45, 3.3, 1.4), Fg), t2.rbox(0.55, 0.3, 0.45, 0.06, 4177754, q(0.4, 3.3, 0.6), 8380554, 1), rg(t2, -0.75, 3.52, 1.1, 0.05, 3.52, 1.1, 0.02, bg, 4);
  for (let e5 of [-1, 1]) for (let r2 of [-1, 1]) rg(n2, e5 * 0.75, 2.96, Ov + r2 * 0.75, e5 * 0.45, 4.5, Ov + r2 * 0.45, 0.045, pg, 6), rg(t2, e5 * 0.45, 4.5, Ov + r2 * 0.45, e5 * 0.6, jv, Ov + r2 * 0.6, 0.02, Dv, 4), rg(t2, e5 * 1.15, 2.96, r2 > 0 ? 2.6 : -4, e5 * 1.56, 9.68, Ov + r2 * 1.56, 0.022, Dv, 4);
  for (let e5 of [-1, 1]) rg(n2, -0.45, 4.5, Ov + e5 * 0.45, 0.45, 4.5, Ov + e5 * 0.45, 0.04, pg, 6), rg(n2, e5 * 0.45, 4.5, -1.35, e5 * 0.45, 4.5, -0.45, 0.04, pg, 6), n2.cyl(0.16, 0.16, 0.4, fg, q(e5 * 0.2, 4.72, Ov), 10), n2.cyl(0.2, 0.12, 0.14, pg, q(e5 * 0.2, 4.98, Ov), 10), n2.torus(0.17, 0.025, Ag, q(e5 * 0.2, 4.72, Ov, qh, 0, 0), 5, 10), r.cone(0.09, 0.32, 16751146, q(e5 * 0.2, 5.2, Ov), 8), r.cone(0.05, 0.2, 16773296, q(e5 * 0.2, 5.16, Ov), 6);
  n2.box(1, 0.06, 0.2, pg, q(0, 4.5, Ov)), Nv(t2, 0, 4.5, -0.45, 0, 3, 4.2, 7, 0.35), Nv(t2, 0, 4.5, -1.35, 0, 3.15, -4.1, 6, 0.35);
}
function Fv(e4) {
  let { s: t2, m: n2 } = e4, r = Kh * 2 / 16, i = [Sv, Pg, 16761370, Pg], a = q(0, Av, Ov), o = q(0, 9.315, Ov);
  for (let e5 = 0; e5 < 16; e5++) {
    let n3 = i[e5 % 4];
    t2.add(new gs(kv, 2, 10, e5 * r, r, 0, 2.2143), Bg(n3, 0.78), a, n3), t2.add(new Ba(3, 0.85, 2.87, 2, 1, true, e5 * r - qh, r), Bg(n3, 0.55), o, Bg(n3, 0.78)), t2.add(new gs(3.78, 1, 10, e5 * r - 0.012, 0.024, 0.3, 1.9143000000000001), wv, a);
  }
  t2.cyl(3.79, 3.79, 0.6, wv, a, 32, void 0, true);
  for (let e5 = 0; e5 < 8; e5++) {
    let n3 = e5 * Kh * 2 / 8 + r / 2;
    t2.add(og(0.24, 0.06), Fg, q(Math.sin(n3) * 3.83, Av, Ov + Math.cos(n3) * 3.83, 0, n3, 0));
  }
  t2.add(new gs(3.78, 16, 2, 0, Kh * 2, 0, 0.36), Fg, a), t2.cyl(0.12, 0.22, 0.22, wv, q(0, 16.81, Ov), 8), t2.cyl(0.95, 0.87, 0.3, Fg, q(0, 7.9799999999999995, Ov), 16, void 0, true), t2.cyl(0.84, 0.84, 0.02, 928346, q(0, 8.08, Ov), 12), n2.torus(0.87, 0.05, pg, q(0, jv, Ov, qh, 0, 0), 5, 16), rg(n2, 0, 16.85, Ov, 0, 18.25, Ov, 0.03, fg, 5), n2.sphere(0.07, jg, q(0, 18.3, Ov), 8, 6), t2.cone(0.22, 0.9, 16732010, q(0, 18.05, -1.35, -qh, 0, 0, 1, 1, 0.1), 3);
}
function Iv() {
  let e4 = Xh(new Pn(), $h(`items`, `bus`) ?? Yh(`bus`, Pv)), t2 = Xh(new Pn(), $h(`items`, `bus_balloon`) ?? Yh(`bus_balloon`, Fv));
  return e4.add(t2), e4.userData.balloon = t2, e4.userData.burner = new R(0, 5.15, Ov), e4;
}
var Lv = 9063392, Rv = 11039221, zv = 6566064, Bv = 3389170, Vv = 16736168, Hv = 16765498, Uv = 14469367;
function Wv(e4) {
  let { s: t2, m: n2 } = e4, r = [Bv, Lv, Vv, Rv, Hv];
  for (let e5 of [-1, 1]) for (let n3 of [-1, 1]) {
    let i2 = e5 * 0.19, a2 = -0.05 + n3 * 0.36;
    t2.rbox(0.19, 0.1, 0.2, 0.03, 3877486, q(i2, 0.05, a2), void 0, 1);
    for (let e6 = 0; e6 < 5; e6++) ig(t2, 0.085, 0.085, 0.105, 1.28, Bg(r[e6], 0.72), i2, 0.15 + e6 * 0.105, a2, r[e6], e6 % 2 * 0.12);
  }
  let i = [Vv, Lv, Bv, Rv, Hv, Lv];
  for (let e5 = 0; e5 < 6; e5++) ig(t2, 0.3, 0.52, 0.1, 1.12, Bg(i[e5], 0.7), 0, 0.64 + e5 * 0.1, -0.05, i[e5], (e5 % 2 ? 1 : -1) * 0.02);
  t2.box(0.6, 0.04, 1.04, Rv, q(0, 1.205, -0.05)), ig(t2, 0.07, 0.07, 0.14, 1.5, Bv, 0, 1.02, -0.62, Vv), ig(t2, 0.05, 0.05, 0.12, 1.5, Hv, 0, 0.92, -0.64, Vv);
  let a = [Lv, Vv, Bv, Lv];
  for (let e5 = 0; e5 < 4; e5++) ig(t2, 0.15, 0.15, 0.11, 1.2, Bg(a[e5], 0.72), 0, 1.24 + e5 * 0.105, 0.36 + e5 * 0.03, a[e5]);
  ig(t2, 0.17, 0.18, 0.09, 1.15, Hv, 0, 1.6, 0.48, 16773258), t2.rbox(0.36, 0.31, 0.38, 0.09, Lv, q(0, 1.72, 0.5), Rv, 2), t2.rbox(0.24, 0.19, 0.22, 0.07, Uv, q(0, 1.65, 0.75), Pg, 1), t2.box(0.24, 0.03, 0.16, Bv, q(0, 1.715, 0.72)), t2.box(0.15, 0.012, 0.01, zv, q(0, 1.62, 0.862)), t2.box(0.09, 0.036, 0.012, Pg, q(0, 1.598, 0.862)), t2.sphere(0.024, Vv, q(0, 1.69, 0.86), 8, 6), ig(t2, 0.1, 0.1, 0.07, 1.4, Vv, 0, 1.9, 0.47, 16751816), ig(t2, 0.07, 0.07, 0.07, 1.4, Hv, 0, 1.96, 0.46, 16773258);
  for (let e5 of [-1, 1]) {
    t2.box(0.03, 0.02, 0.01, zv, q(e5 * 0.05, 1.69, 0.862)), t2.sphere(0.084, Pg, q(e5 * 0.155, 1.78, 0.6), 12, 8), t2.sphere(0.05, 1380383, q(e5 * 0.183, 1.78, 0.654), 10, 6), t2.sphere(0.018, Pg, q(e5 * 0.196, 1.806, 0.694), 6, 4);
    for (let n3 = 0; n3 < 3; n3++) t2.box(0.012, 0.04, 8e-3, 1380383, q(e5 * (0.12 + n3 * 0.035), 1.87, 0.62, 0, 0, e5 * (0.5 - n3 * 0.4)));
    t2.cone(0.065, 0.19, Lv, q(e5 * 0.12, 1.94, 0.42, 0, 0, -e5 * 0.25), 6, Rv), t2.cone(0.036, 0.13, Vv, q(e5 * 0.12, 1.93, 0.448, 0, 0, -e5 * 0.25), 5), t2.box(0.02, 0.26, 0.52, Vv, q(e5 * 0.345, 1.06, -0.08)), t2.box(0.026, 0.03, 0.54, Hv, q(e5 * 0.348, 0.94, -0.08)), t2.rbox(0.17, 0.27, 0.35, 0.05, 13208124, q(e5 * 0.43, 1, -0.08), 15118436, 1), t2.box(0.18, 0.1, 0.36, 11037736, q(e5 * 0.435, 1.09, -0.08)), n2.box(0.02, 0.05, 0.05, jg, q(e5 * 0.525, 1.04, -0.08), Mg);
  }
  t2.box(0.68, 0.03, 0.52, Vv, q(0, 1.235, -0.08)), t2.box(0.92, 0.022, 0.06, 8014366, q(0, 1.255, -0.08)), t2.box(0.5, 0.032, 0.1, Bv, q(0, 1.236, -0.08)), n2.cyl(0.032, 0.032, 0.2, jg, q(0.43, 1.18, -0.18, 0.3, 0, 0), 6, Mg), n2.box(0.05, 0.05, 0.14, jg, q(-0.43, 1.16, 0, 0.5, 0.3, 0), Mg), n2.sphere(0.04, Mg, q(-0.43, 1.17, -0.15), 8, 6);
}
function Gv() {
  return Xh(new Pn(), $h(`items`, `llama`) ?? Yh(`llama`, Wv));
}
var Kv = 800 / 320, qv = chapter4Sites, Jv = (e4) => qv.find((t2) => t2.id === e4), Yv = { x: -95, z: -75, r: 29 }, Xv = [[60,-350],[35,-300],[22,-230],[35,-170],[5,-120],[-40,-100],[-95,-75],[-140,-55],[-180,0],[-170,60],[-120,85],[-60,105],[-35,160],[-75,195],[-120,185],[-165,220],[-170,340]], Zv = new Float32Array(103041), Qv = new Float32Array(103041);
function $v(e4, t2, n2, r, i, a) {
  let o = i - n2, s2 = a - r, c = Cp(((e4 - n2) * o + (t2 - r) * s2) / (o * o + s2 * s2), 0, 1);
  return Math.hypot(e4 - n2 - o * c, t2 - r - s2 * c);
}
function ey(e4, t2) {
  let n2 = 1 / 0;
  for (let r = 0; r < Xv.length - 1; r++) n2 = Math.min(n2, $v(e4, t2, Xv[r][0], Xv[r][1], Xv[r + 1][0], Xv[r + 1][1]));
  return n2;
}
var ty = (e4, t2, n2) => Math.exp(-(e4 * e4 + t2 * t2) / (2 * n2 * n2));
function ny(e4, t2) {
  let n2 = Math.atan2(t2, e4), r = Ep(1.03, 0.62, Math.hypot(e4, t2) / 362 + Hp(e4 * 45e-4 + 3.1, t2 * 45e-4 - 1.7, 4) * 0.17 + 0.05 * Math.sin(n2 * 3 + 0.6) + 0.03 * Math.sin(n2 * 7 + 2)), i = 9.5 + Hp(e4 * 55e-4, t2 * 55e-4, 5) * 11 + Hp(e4 * 0.021, t2 * 0.021, 3) * 2.2, a = ty(e4 - 220, t2 + 245, 64), o = a ** 0.85 * (82 + Up(e4 * 0.013, t2 * 0.013, 4) * 22 * a) + ty(e4 - 300, t2 + 190, 56) * 50 + ty(e4 + 340, t2 + 100, 40) * 26 + ty(e4 - 280, t2 + 120, 44) * 18 + ty(e4 - 300, t2 + 260, 50) * 22, s2 = ty(e4 + 120, t2 + 300, 44) * 15, c = -8 + (i + o + s2 + 8) * r ** 1.25, l2 = Math.hypot(e4 - Yv.x, t2 - Yv.z) + Vp(e4 * 0.05, t2 * 0.05) * 5;
  let u = ey(e4, t2) + Vp(e4 * 0.06 + 9, t2 * 0.06) * 2.5;
  c = Tp(c, -1.8, Ep(24, 6, u));
  for (let n3 of qv) {
    let r2 = Math.hypot(e4 - n3.x, t2 - n3.z);
    r2 < n3.r * 1.4 && (c = Tp(c, n3.y, Ep(n3.r * 1.38, n3.r * 0.98, r2)));
  }
  // Keep the lake basin below water even where nearby POI terrain is flattened.
  c = Tp(c, -3.2, Ep(Yv.r + 12, Yv.r - 8, l2));
  // The Observatory's excavated lower lab sits beneath its raised main floor.
  const obs=Jv(`observatory`), lab=Math.max(Math.abs(e4-(obs.x-5))/11,Math.abs(t2-(obs.z-2.5))/8.5), cut=Cp((1.3-lab)*4,0,1);
  c=Tp(c,obs.y-4,cut);
  return c;
}
function ry() {
  for (let e4 = 0; e4 < 321; e4++) {
    let t2 = -400 + e4 * Kv;
    for (let n2 = 0; n2 < 321; n2++) Zv[e4 * 321 + n2] = ny(-400 + n2 * Kv, t2);
  }
  for (let e4 = 0; e4 < 321; e4++) for (let t2 = 0; t2 < 321; t2++) {
    let n2 = Zv[e4 * 321 + Math.max(0, t2 - 1)], r = Zv[e4 * 321 + Math.min(320, t2 + 1)], i = Zv[Math.max(0, e4 - 1) * 321 + t2], a = Zv[Math.min(320, e4 + 1) * 321 + t2], o = (r - n2) / (2 * Kv), s2 = (a - i) / (2 * Kv);
    Qv[e4 * 321 + t2] = 1 - 1 / Math.sqrt(o * o + s2 * s2 + 1);
  }
}
function iy(e4, t2, n2, r) {
  let i = (t2 + 400) / Kv, a = (n2 + 400) / Kv;
  if (i < 0 || a < 0 || i >= 320 || a >= 320) return r;
  let o = i | 0, s2 = a | 0, c = i - o, l2 = a - s2, u = s2 * 321 + o;
  return (e4[u] * (1 - c) + e4[u + 1] * c) * (1 - l2) + (e4[u + 321] * (1 - c) + e4[u + 321 + 1] * c) * l2;
}
var ay = (e4, t2) => iy(Zv, e4, t2, -8), oy = (e4, t2) => iy(Qv, e4, t2, 0);
function sy(e4, t2, n2) {
  let r = 1.25, i = (ay(e4 + r, t2) - ay(e4 - r, t2)) / (2 * r), a = (ay(e4, t2 + r) - ay(e4, t2 - r)) / (2 * r), o = 1 / Math.sqrt(i * i + a * a + 1);
  n2.x = -i * o, n2.y = o, n2.z = -a * o;
}
function cy(e4, t2, n2 = 1) {
  for (let r of qv) if (Math.hypot(e4 - r.x, t2 - r.z) < r.r * n2) return r;
  return null;
}
function ly(e4, t2) {
  let n2 = Ep(-0.08, 0.42, Hp(e4 * 75e-4 + 40, t2 * 75e-4 - 12, 3));
  return n2 = Math.max(n2, ty(e4 + 30, t2 + 215, 95) * 0.95, ty(e4 + 150, t2 + 60, 80) * 0.8), Cp(n2, 0, 1);
}
var uy = [], dy = /* @__PURE__ */ new Map(), fy = 16, py = (e4, t2) => (Math.floor(e4 / fy) + 512) * 1024 + Math.floor(t2 / fy) + 512;
function my(e4, t2, n2, r) {
  let i = Jv(e4), a = Jv(t2), o = a.x - i.x, s2 = a.z - i.z, c = Math.hypot(o, s2), l2 = o / c, u = s2 / c, d = i.x + l2 * i.r * 0.9, f = i.z + u * i.r * 0.9, p = a.x - l2 * a.r * 0.9, m = a.z - u * a.r * 0.9, h = (d + p) / 2 - u * n2, g2 = (f + m) / 2 + l2 * n2, _2 = [], v = Math.ceil(c / 6);
  for (let e5 = 0; e5 <= v; e5++) {
    let t3 = e5 / v, n3 = 1 - t3, r2 = n3 * n3 * d + 2 * n3 * t3 * h + t3 * t3 * p, i2 = n3 * n3 * f + 2 * n3 * t3 * g2 + t3 * t3 * m, a2 = Vp(r2 * 0.02 + 5, i2 * 0.02) * 5 * Math.sin(t3 * Math.PI);
    r2 += -u * a2, i2 += l2 * a2, _2.push([r2, i2]);
  }
  uy.push({ pts: _2, width: r });
  for (let e5 = 0; e5 < _2.length - 1; e5++) {
    let [t3, n3] = _2[e5], [r2, i2] = _2[e5 + 1];
    for (let e6 = 0; e6 < 3; e6++) {
      let a2 = Tp(t3, r2, e6 / 3), o2 = Tp(n3, i2, e6 / 3), s3 = py(a2, o2), c2 = dy.get(s3);
      c2 || dy.set(s3, c2 = []), c2.push(a2, o2);
    }
  }
}
function hy() {
  uy.length = 0; dy.clear();
  for(const [from,to,curve,width] of [[`logjam`,`covert`,8,5],[`covert`,`sanctuary`,8,6],[`sanctuary`,`bugle`,10,5],[`bugle`,`sleepy`,-8,5],[`bugle`,`joneses`,12,5],[`sanctuary`,`mall`,0,5],[`mall`,`coney`,10,5],[`coney`,`joneses`,10,5],[`coney`,`reels`,-10,6],[`reels`,`tilted`,8,5],[`tilted`,`covert`,-12,5],[`ironworks`,`tilted`,10,4],[`observatory`,`bugle`,0,4]]) my(from,to,curve,width);
}
function gy(e4, t2) {
  let n2 = 1 / 0, r = Math.floor(e4 / fy), i = Math.floor(t2 / fy);
  for (let a = -1; a <= 1; a++) for (let o = -1; o <= 1; o++) {
    let s2 = dy.get((r + o + 512) * 1024 + i + a + 512);
    if (s2) for (let r2 = 0; r2 < s2.length; r2 += 2) {
      let i2 = Math.hypot(s2[r2] - e4, s2[r2 + 1] - t2);
      i2 < n2 && (n2 = i2);
    }
  }
  return n2;
}
var _y = 8, vy = /* @__PURE__ */ new Map(), yy = 1, by = (e4, t2) => (e4 + 2048) * 4096 + (t2 + 2048);
function xy(e4, t2, n2, r, i, a, o = null, s2 = true) {
  return { kind: 0, minX: e4, minY: t2, minZ: n2, maxX: r, maxY: i, maxZ: a, dir: 0, cx: 0, cz: 0, r: 0, solid: s2, owner: o, stamp: 0, keys: [] };
}
function Sy(e4, t2, n2, r, i, a, o, s2 = null) {
  return { kind: 1, minX: e4, minY: t2, minZ: n2, maxX: r, maxY: i, maxZ: a, dir: o, cx: 0, cz: 0, r: 0, solid: false, owner: s2, stamp: 0, keys: [] };
}
function Cy(e4, t2, n2, r, i, a, o = null) {
  return { kind: 3, minX: e4, minY: t2, minZ: n2, maxX: r, maxY: i, maxZ: a, dir: 0, cx: (e4 + r) / 2, cz: (n2 + a) / 2, r: 0, solid: false, owner: o, stamp: 0, keys: [] };
}
function wy(e4, t2, n2, r, i, a = null, o = true) {
  return { kind: 2, minX: e4 - n2, minY: r, minZ: t2 - n2, maxX: e4 + n2, maxY: i, maxZ: t2 + n2, dir: 0, cx: e4, cz: t2, r: n2, solid: o, owner: a, stamp: 0, keys: [] };
}
function Ty(e4) {
  let t2 = Math.floor(e4.minX / _y), n2 = Math.floor(e4.maxX / _y), r = Math.floor(e4.minZ / _y), i = Math.floor(e4.maxZ / _y);
  e4.keys.length = 0;
  for (let a = r; a <= i; a++) for (let r2 = t2; r2 <= n2; r2++) {
    let t3 = by(r2, a), n3 = vy.get(t3);
    n3 || vy.set(t3, n3 = []), n3.push(e4), e4.keys.push(t3);
  }
  return e4;
}
function Ey(e4) {
  for (let t2 of e4.keys) {
    let n2 = vy.get(t2);
    if (!n2) continue;
    let r = n2.indexOf(e4);
    r >= 0 && (n2[r] = n2[n2.length - 1], n2.pop()), n2.length === 0 && vy.delete(t2);
  }
  e4.keys.length = 0;
}
function Dy(e4, t2, n2) {
  if (e4.kind === 1) {
    let r;
    switch (e4.dir) {
      case 0:
        r = (n2 - e4.minZ) / (e4.maxZ - e4.minZ);
        break;
      case 1:
        r = (t2 - e4.minX) / (e4.maxX - e4.minX);
        break;
      case 2:
        r = (e4.maxZ - n2) / (e4.maxZ - e4.minZ);
        break;
      default:
        r = (e4.maxX - t2) / (e4.maxX - e4.minX);
    }
    return e4.minY + (r < 0 ? 0 : r > 1 ? 1 : r) * (e4.maxY - e4.minY);
  }
  if (e4.kind === 3) {
    let r = 1 - Math.max(Math.abs(t2 - e4.cx) / ((e4.maxX - e4.minX) / 2), Math.abs(n2 - e4.cz) / ((e4.maxZ - e4.minZ) / 2));
    return e4.minY + (r < 0 ? 0 : r) * (e4.maxY - e4.minY);
  }
  return e4.maxY;
}
function Oy(e4, t2, n2, r = hp) {
  let i = ay(e4, t2), a = vy.get(by(Math.floor(e4 / _y), Math.floor(t2 / _y)));
  const train=window.__game?.islandUpgrade?.train;
  if(train && train.group.visible) { const dx=e4-train.x, dz=t2-train.z, lx=dx*Math.cos(train.angle)-dz*Math.sin(train.angle), lz=dx*Math.sin(train.angle)+dz*Math.cos(train.angle); if(Math.abs(lx)<3 && Math.abs(lz)<12 && train.y+3<=n2+r) i=Math.max(i,train.y+3); }
  if (!a) return i;
  let o = n2 + r;
  for (let n3 = 0; n3 < a.length; n3++) {
    let r2 = a[n3];
    if (e4 < r2.minX || e4 > r2.maxX || t2 < r2.minZ || t2 > r2.maxZ) continue;
    if (r2.kind === 2) {
      let n4 = e4 - r2.cx, i2 = t2 - r2.cz;
      if (n4 * n4 + i2 * i2 > r2.r * r2.r) continue;
    }
    let s2 = Dy(r2, e4, t2);
    s2 <= o && s2 > i && (i = s2);
  }
  return i;
}
function ky(e4, t2, n2, r) {
  let i = vy.get(by(Math.floor(e4 / _y), Math.floor(t2 / _y)));
  if (!i) return 1 / 0;
  let a = 1 / 0;
  for (let o = 0; o < i.length; o++) {
    let s2 = i[o];
    if (e4 < s2.minX || e4 > s2.maxX || t2 < s2.minZ || t2 > s2.maxZ) continue;
    let c;
    if (s2.kind === 0) c = s2.minY;
    else if (s2.kind === 2) continue;
    else c = Dy(s2, e4, t2) - 0.3;
    c >= n2 - 0.08 && c <= n2 + r && c < a && (a = c);
  }
  return a;
}
function Ay(e4, t2, n2, r) {
  let i = n2 + hp, a = n2 + r, o = null;
  for (let n3 = 0; n3 < 2; n3++) {
    let n4 = Math.floor((e4.x - t2) / _y), r2 = Math.floor((e4.x + t2) / _y), s2 = Math.floor((e4.z - t2) / _y), c = Math.floor((e4.z + t2) / _y);
    yy++;
    let l2 = false;
    for (let u = s2; u <= c; u++) for (let s3 = n4; s3 <= r2; s3++) {
      let n5 = vy.get(by(s3, u));
      if (n5) for (let r3 = 0; r3 < n5.length; r3++) {
        let s4 = n5[r3];
        if (s4.solid && s4.stamp !== yy && (s4.stamp = yy, !(s4.maxY <= i || s4.minY >= a))) {
          if (s4.kind === 2) {
            let n6 = e4.x - s4.cx, r4 = e4.z - s4.cz, i2 = t2 + s4.r, a2 = n6 * n6 + r4 * r4;
            if (a2 >= i2 * i2) continue;
            let c2 = Math.sqrt(a2) || 1e-4;
            e4.x = s4.cx + n6 / c2 * i2, e4.z = s4.cz + r4 / c2 * i2, o = s4, l2 = true;
          } else {
            let n6 = e4.x < s4.minX ? s4.minX : e4.x > s4.maxX ? s4.maxX : e4.x, r4 = e4.z < s4.minZ ? s4.minZ : e4.z > s4.maxZ ? s4.maxZ : e4.z, i2 = e4.x - n6, a2 = e4.z - r4, c2 = i2 * i2 + a2 * a2;
            if (c2 >= t2 * t2) continue;
            if (c2 > 1e-9) {
              let n7 = Math.sqrt(c2), r5 = t2 - n7;
              e4.x += i2 / n7 * r5, e4.z += a2 / n7 * r5;
            } else {
              let n7 = e4.x - s4.minX, r5 = s4.maxX - e4.x, i3 = e4.z - s4.minZ, a3 = s4.maxZ - e4.z, o2 = Math.min(n7, r5, i3, a3);
              o2 === n7 ? e4.x = s4.minX - t2 : o2 === r5 ? e4.x = s4.maxX + t2 : e4.z = o2 === i3 ? s4.minZ - t2 : s4.maxZ + t2;
            }
            o = s4, l2 = true;
          }
        }
      }
    }
    if (!l2) break;
  }
  return o;
}
var jy = () => ({ t: 0, x: 0, y: 0, z: 0, nx: 0, ny: 1, nz: 0, collider: null, terrain: false }), My = 0, Ny = 0, Py = 0;
function Fy(e4, t2, n2, r, i, a, o, s2) {
  if (e4.kind === 2) {
    let c2 = t2 - e4.cx, l3 = r - e4.cz, u2 = i * i + o * o;
    if (u2 > 1e-9) {
      let t3 = c2 * i + l3 * o, r2 = c2 * c2 + l3 * l3 - e4.r * e4.r, d2 = t3 * t3 - u2 * r2;
      if (d2 < 0) return -1;
      let f2 = (-t3 - Math.sqrt(d2)) / u2;
      if (f2 > 0 && f2 < s2) {
        let t4 = n2 + a * f2;
        if (t4 >= e4.minY && t4 <= e4.maxY) return My = (c2 + i * f2) / e4.r, Ny = 0, Py = (l3 + o * f2) / e4.r, f2;
      }
    }
    if (a < 0 && n2 > e4.maxY) {
      let t3 = (e4.maxY - n2) / a, r2 = c2 + i * t3, u3 = l3 + o * t3;
      if (t3 < s2 && r2 * r2 + u3 * u3 <= e4.r * e4.r) return My = 0, Ny = 1, Py = 0, t3;
    }
    return -1;
  }
  let c = 0, l2 = s2, u = -1, d = 0;
  if (Math.abs(i) < 1e-9) {
    if (t2 < e4.minX || t2 > e4.maxX) return -1;
  } else {
    let n3 = (e4.minX - t2) / i, r2 = (e4.maxX - t2) / i, a2 = -1;
    if (n3 > r2) {
      let e5 = n3;
      n3 = r2, r2 = e5, a2 = 1;
    }
    if (n3 > c && (c = n3, u = 0, d = a2), r2 < l2 && (l2 = r2), c > l2) return -1;
  }
  if (Math.abs(a) < 1e-9) {
    if (n2 < e4.minY || n2 > e4.maxY) return -1;
  } else {
    let t3 = (e4.minY - n2) / a, r2 = (e4.maxY - n2) / a, i2 = -1;
    if (t3 > r2) {
      let e5 = t3;
      t3 = r2, r2 = e5, i2 = 1;
    }
    if (t3 > c && (c = t3, u = 1, d = i2), r2 < l2 && (l2 = r2), c > l2) return -1;
  }
  if (Math.abs(o) < 1e-9) {
    if (r < e4.minZ || r > e4.maxZ) return -1;
  } else {
    let t3 = (e4.minZ - r) / o, n3 = (e4.maxZ - r) / o, i2 = -1;
    if (t3 > n3) {
      let e5 = t3;
      t3 = n3, n3 = e5, i2 = 1;
    }
    if (t3 > c && (c = t3, u = 2, d = i2), n3 < l2 && (l2 = n3), c > l2) return -1;
  }
  if (e4.kind === 0) return u < 0 ? -1 : (My = u === 0 ? d : 0, Ny = u === 1 ? d : 0, Py = u === 2 ? d : 0, c);
  let f = e4.kind === 1 ? 1 : 6, p = c, m = n2 + a * p - Dy(e4, t2 + i * p, r + o * p);
  for (let s3 = 1; s3 <= f; s3++) {
    let u2 = c + (l2 - c) * s3 / f, d2 = n2 + a * u2 - Dy(e4, t2 + i * u2, r + o * u2);
    if (m === 0 || m * d2 < 0) {
      let t3 = m === d2 ? p : p + (u2 - p) * m / (m - d2), n3 = (e4.maxY - e4.minY) / (e4.kind === 1 ? e4.dir & 1 ? e4.maxX - e4.minX : e4.maxZ - e4.minZ : (e4.maxX - e4.minX) / 2), r2 = 1 / Math.sqrt(1 + n3 * n3), i2 = m >= 0 ? 1 : -1;
      return My = 0, Py = 0, Ny = r2 * i2, e4.kind === 1 && (e4.dir === 0 ? Py = -n3 * r2 * i2 : e4.dir === 1 ? My = -n3 * r2 * i2 : e4.dir === 2 ? Py = n3 * r2 * i2 : My = n3 * r2 * i2), t3;
    }
    p = u2, m = d2;
  }
  return -1;
}
var Iy = { x: 0, y: 1, z: 0 };
function Ly(e4, t2, n2, r, i, a, o, s2, c = null, l2 = true) {
  let u = o, d = false;
  s2.collider = null, s2.terrain = false, yy++;
  let f = Math.floor(e4 / _y), p = Math.floor(n2 / _y), m = r > 0 ? 1 : -1, h = a > 0 ? 1 : -1, g2 = Math.abs(r) > 1e-9 ? Math.abs(_y / r) : 1 / 0, _2 = Math.abs(a) > 1e-9 ? Math.abs(_y / a) : 1 / 0, v = g2 === 1 / 0 ? 1 / 0 : ((r > 0 ? (f + 1) * _y : f * _y) - e4) / r, y = _2 === 1 / 0 ? 1 / 0 : ((a > 0 ? (p + 1) * _y : p * _y) - n2) / a;
  for (let o2 = 0; o2 < 160; o2++) {
    let o3 = vy.get(by(f, p));
    if (o3) for (let l3 = 0; l3 < o3.length; l3++) {
      let f2 = o3[l3];
      if (f2.stamp === yy || (f2.stamp = yy, c && f2.owner === c)) continue;
      let p2 = Fy(f2, e4, t2, n2, r, i, a, u);
      p2 >= 0 && p2 < u && (u = p2, d = true, s2.collider = f2, s2.nx = My, s2.ny = Ny, s2.nz = Py);
    }
    if ((v < y ? v : y) > u) break;
    v < y ? (f += m, v += g2) : (p += h, y += _2);
  }
  if (l2) {
    let o2 = 0, c2 = t2, l3 = ay(e4, n2);
    if (c2 >= l3) for (; o2 < u && !(i >= 0 && c2 > 110); ) {
      let f2 = Math.max(0.7, (c2 - l3) * 0.45), p2 = Math.min(o2 + f2, u), m2 = t2 + i * p2, h2 = ay(e4 + r * p2, n2 + a * p2);
      if (m2 < h2) {
        let c3 = o2, l4 = p2;
        for (let o3 = 0; o3 < 9; o3++) {
          let o4 = (c3 + l4) / 2;
          t2 + i * o4 < ay(e4 + r * o4, n2 + a * o4) ? l4 = o4 : c3 = o4;
        }
        u = c3, d = true, s2.collider = null, s2.terrain = true, sy(e4 + r * c3, n2 + a * c3, Iy), s2.nx = Iy.x, s2.ny = Iy.y, s2.nz = Iy.z;
        break;
      }
      if (p2 >= u) break;
      o2 = p2, c2 = m2, l3 = h2;
    }
  }
  return s2.t = u, s2.x = e4 + r * u, s2.y = t2 + i * u, s2.z = n2 + a * u, d;
}
var Ry = jy();
function zy(e4, t2, n2, r, i, a) {
  let o = r - e4, s2 = i - t2, c = a - n2, l2 = Math.sqrt(o * o + s2 * s2 + c * c);
  return l2 < 0.5 || !Ly(e4, t2, n2, o / l2, s2 / l2, c / l2, l2 - 0.4, Ry);
}
function By(e4, t2, n2, r, i, a, o) {
  o.length = 0, yy++;
  let s2 = Math.floor(e4 / _y), c = Math.floor(r / _y), l2 = Math.floor(n2 / _y), u = Math.floor(a / _y);
  for (let d = l2; d <= u; d++) for (let l3 = s2; l3 <= c; l3++) {
    let s3 = vy.get(by(l3, d));
    if (s3) for (let c2 = 0; c2 < s3.length; c2++) {
      let l4 = s3[c2];
      l4.stamp !== yy && (l4.stamp = yy, l4.maxX < e4 || l4.minX > r || l4.maxY < t2 || l4.minY > i || l4.maxZ < n2 || l4.minZ > a || o.push(l4));
    }
  }
  return o;
}
var Vy = jy(), Hy = new R(), Uy = new R(), Wy = { x: 0, y: 0 }, Gy = {}, Ky = { f: null, t: 0, head: false };
function qy(e4, t2, n2, r, i, a, o, s2) {
  let c = o, l2 = false;
  for (let o2 of G.fighters) {
    if (!o2.alive || o2 === s2 || o2.mode === `bus`) continue;
    let u = o2.pos.x - e4, d = o2.pos.y + 0.9 - t2, f = o2.pos.z - n2, p = u * r + d * i + f * a;
    if (p < -1 || p > c + 1.5 || u * u + d * d + f * f - p * p > 1.6) continue;
    let m = o2.pos.y + o2.headH, h = -1;
    {
      let s3 = o2.pos.x - e4, c2 = m - t2, l3 = o2.pos.z - n2, u2 = s3 * r + c2 * i + l3 * a, d2 = s3 * s3 + c2 * c2 + l3 * l3 - 0.0625, f2 = u2 * u2 - d2;
      if (f2 >= 0) {
        let e5 = u2 - Math.sqrt(f2);
        e5 > 0 && (h = e5);
      }
    }
    let g2 = -1;
    {
      let s3 = e4 - o2.pos.x, c2 = n2 - o2.pos.z, l3 = r * r + a * a, u2 = o2.pos.y, d2 = m - 0.2;
      if (l3 > 1e-8) {
        let e5 = s3 * r + c2 * a, n3 = s3 * s3 + c2 * c2 - 0.16, o3 = e5 * e5 - l3 * n3;
        if (o3 >= 0) {
          let n4 = (-e5 - Math.sqrt(o3)) / l3, r2 = t2 + i * n4;
          n4 > 0 && r2 >= u2 && r2 <= d2 && (g2 = n4);
        }
      }
      if (g2 < 0 && i < 0 && t2 > d2) {
        let e5 = (d2 - t2) / i, n3 = s3 + r * e5, o3 = c2 + a * e5;
        n3 * n3 + o3 * o3 < 0.16 && (g2 = e5);
      }
    }
    let _2 = -1, v = false;
    h > 0 && (g2 < 0 || h <= g2 + 0.12) ? (_2 = h, v = true) : g2 > 0 && (_2 = g2), _2 > 0 && _2 < c && (c = _2, l2 = true, Ky.f = o2, Ky.t = _2, Ky.head = v);
  }
  return l2 ? Ky : null;
}
function Jy(e4, t2, n2, r, i, a, o, s2) {
  if(e4.networkId){if(n2?.isPlayer&&window.__game?.online?.started){e4.lastNetworkHit=Date.now();window.__game.online.action('hit',{target:e4.networkId,damage:t2,weapon:r});}return;}
  if (!e4.alive || e4.mode === `bus` || G.phase === `over` || e4.isPlayer && Sf.cheats.god || (n2 && n2.isPlayer && (Sf.cheats.oneShot || Sf.s.eventMode === `oneshot`) && n2 !== e4 && (t2 = 9999), n2 && !n2.isPlayer && !e4.isPlayer && (t2 *= 0.7), t2 = Math.round(t2), t2 <= 0)) return;
  // Downed teammates remain vulnerable. Fifty downed HP and increased incoming
  // damage make finishing shots effective, without instantly deleting the knock.
  if(e4.downed){e4.hp-=Math.max(1,Math.round(t2*1.5));if(n2&&n2!==e4)e4.lastHurtBy=n2;e4.char.flinch();am.spark(a??e4.pos.x,o??e4.pos.y+1,s2??e4.pos.z,0xff6b5c,5,3,.1,.25);if(e4.hp<=0){e4.hp=0;e4.downed=false;G.onElim(e4,n2||e4.lastHurtBy,r);}return;}
  if(e4.isPlayer && e4.guardianUntil>G.time && r!==`storm` && r!==`fall`) {am.spark(e4.pos.x,e4.pos.y+1,e4.pos.z,0x66ddff,8,3,.1,.3,0,1);return;}
  if(e4.isPlayer && window.__game?.islandUpgrade?.activeVehicle && r!==`storm` && r!==`fall`) window.__game.islandUpgrade.activeVehicle.hp-=t2*.7;
  let c = t2, l2 = false, u = r === `storm` || r === `fall`;
  if (e4.shield > 0 && !u) {
    let t3 = Math.min(e4.shield, c);
    e4.shield -= t3, c -= t3, l2 = true, e4.shield <= 0 && (am.shieldPop(e4.pos.x, e4.pos.y + 1.1, e4.pos.z), W.play(`shield_break`, { x: a, y: o, z: s2 }));
  }
  if (e4.hp -= c, n2 && n2 !== e4 && (e4.lastHurtBy = n2, e4.lastHurtTime = G.time, n2.damageDealt += Math.min(t2, 200)), e4.char.flinch(), u || (W.play(l2 ? `hit_shield` : `hit_flesh`, { x: a, y: o, z: s2, volume: 0.7 }), am.spark(a, o, s2, l2 ? 4571903 : 16771496, 5, 3.5, 0.12, 0.25, 4, 2.2)), n2 && n2.isPlayer && n2 !== e4 && (G.hud.hitMarker(e4.hp <= 0 ? `kill` : i ? `head` : l2 ? `shield` : `body`), W.play(i ? `headshot` : `hitmarker`, { volume: i ? 0.85 : 0.6 }), i && (am.spark(a, o, s2, 16765498, 12, 5, 0.15, 0.32, 3, 3.2), am.ring(a, o + 0.05, s2, 16769126, 0.9, 0.28), G.shake(0.07)), Sf.s.damageNumbers && G.project(a + K(-0.2, 0.2), o + 0.35, s2, Wy) && G.hud.floatText(Wy.x, Wy.y, String(Math.min(t2, 999)), i ? `crit` : l2 ? `shield` : `dmg`)), e4.isPlayer) {
    if (G.hud.hurtFlash(wp(t2 / 60)), n2 && n2 !== e4) {
      let t3 = Math.sin(e4.yaw), r2 = Math.cos(e4.yaw), i2 = n2.pos.x - e4.pos.x, a2 = n2.pos.z - e4.pos.z;
      G.hud.damageFrom(Math.atan2(i2 * r2 - a2 * t3, i2 * t3 + a2 * r2));
    }
    r !== `storm` && (W.play(`hurt`, { volume: 0.8 }), G.shake(0.25 + t2 / 120));
  }
  if(e4.hp<=0 && e4.isTeammate && !e4.isPlayer && !e4.wasDowned && window.__game?.player?.alive) {
    e4.hp=50;e4.shield=0;e4.downed=true;e4.wasDowned=true;e4.bleed=25;e4.reviveProgress=0;e4.crouch=true;e4.sprint=false;e4.wantJump=false;e4.jumpBuf=0;e4.vel.set(0,0,0);e4.char.setHeld(null,`none`);
    G.hud.banner(`TEAMMATE DOWN`,`Hold E nearby to revive • teammates can help`,2500,`info`);
  } else e4.hp <= 0 && (e4.hp = 0, G.onElim(e4, n2, r));
}
var Yy = 10259046;
function Xy(e4) {
  return e4 && e4.owner ? Hh[e4.owner.mat] : Yy;
}
function Zy(e4) {
  let t2 = [];
  for (let [n2, r, i] of e4) for (let e5 = 0; e5 < n2; e5++) {
    let a = (e5 + i) / n2 * Math.PI * 2;
    t2.push(Math.cos(a) * r, Math.sin(a) * r);
  }
  return new Float32Array(t2);
}
var Qy = { pump: Zy([[1, 0, 0], [3, 0.34, 0.25], [6, 0.8, 0]]), tac: Zy([[2, 0.16, 0], [8, 0.78, 0.5]]) };
function $y(e4, t2, n2, r, i, a, o, s2 = 0) {
  let c = e4.weapon, l2 = e4.current;
  if (!c || !l2 || e4.fireCd > 0 || e4.reloadT > 0 || e4.useT > 0 || e4.burstLeft > 0) return false;
  if (c.thrown) return Ab(e4, c, l2, t2, n2, r, i, a, o, s2);
  let u = e4.isPlayer ? Sf.cheats : null;
  if (l2.count <= 0) return !e4.startReload() && e4.isPlayer ? (W.play(`empty`), e4.fireCd = 0.25) : e4.isPlayer && W.play(`reload`, { volume: 0.7 }), false;
  if (e4.fireCd = 1 / c.fireRate, eb(e4, c, l2, t2, n2, r, i, a, o, s2, 0), c.burst && c.burst > 1 && l2.count > 0) {
    e4.burstLeft = c.burst - 1, e4.burstT = c.burstGap ?? 0.08;
    let l3 = e4.burstAim;
    l3.ox = t2 - e4.pos.x, l3.oy = n2 - e4.pos.y, l3.oz = r - e4.pos.z, l3.dx = i, l3.dy = a, l3.dz = o, l3.yaw = e4.yaw, l3.pitch = e4.pitch, l3.inacc = s2, l3.slot = e4.active;
  }
  return l2.count <= 0 && !u?.noReload && (e4.fireCd = Math.max(e4.fireCd, 0.3)), true;
}
function eb(e4, t2, n2, r, i, a, o, s2, c, l2, u) {
  (e4.isPlayer ? Sf.cheats : null)?.noReload || n2.count--, e4.shots++;
  let d = Math.hypot(e4.vel.x, e4.vel.z) > 1.5, f = (e4.aiming ? t2.adsSpread : t2.spread) * (1 + e4.bloom) * (e4.grounded ? 1 : 1.5) * (d ? 1.25 : 1) * (e4.crouch ? 0.8 : 1);
  t2.pellets === 1 && e4.bloom < 0.05 && e4.grounded && !d && u === 0 && (f *= e4.aiming ? 0.25 : 0.55), f += l2, t2.id === `sniper` && e4.aiming && e4.grounded && (f = l2), e4.bloom = Math.min(1.3, e4.bloom + (t2.burst ? 0.13 : t2.auto ? 0.16 : 0.3)), e4.char.recoil(t2.recoil > 2 ? 1.6 : 1), e4.char.getMuzzle(Uy);
  let p = e4.isPlayer || e4.pos.distanceToSquared(G.camera.position) < 8100;
  p && am.muzzle(Uy.x, Uy.y, Uy.z, o, s2, c, t2.pellets > 1 || t2.id === `sniper` || t2.id === `rpg`, e4.isPlayer || e4.visible);
  let m = `shot_` + t2.id;
  if (e4.isPlayer ? W.play(m, { volume: 0.9 }) : W.play(m, { x: e4.pos.x, y: e4.pos.y + 1.4, z: e4.pos.z }), t2.id === `pump` && e4.isPlayer && setTimeout(() => W.play(`pump_rack`, { volume: 0.6 }), 420), Gy.onShot?.(e4, t2, u), t2.id === `rpg`) {
    Ly(r, i, a, o, s2, c, 260, Vy);
    let l3 = qy(r, i, a, o, s2, c, Vy.t, e4), u2 = l3 ? l3.t : Vy.t, d2 = r + o * u2 - Uy.x, f2 = i + s2 * u2 - Uy.y, p2 = a + c * u2 - Uy.z, m2 = Math.hypot(d2, f2, p2) || 1;
    lb(e4, Uy.x, Uy.y, Uy.z, d2 / m2, f2 / m2, p2 / m2, t2.damage * (1 + n2.rarity * 0.05), t2.structDamage);
    return;
  }
  let h = t2.damage * (1 + n2.rarity * 0.05), g2 = Math.tan(f * Math.PI / 180), _2 = -c, v = o, y = Math.hypot(_2, v) || 1;
  // Mythic weapon abilities
  if (n2.rarity === 5) {
    if (t2.id === `ar` || t2.id === `burst`) {
      // Mythic AR/Burst: Explosive rounds (AoE damage)
      h *= 1.2;
    } else if (t2.id === `sniper`) {
      // Mythic Sniper: Pierces walls (increased range)
      h *= 1.3;
    } else if (t2.id === `pump` || t2.id === `tac`) {
      // Mythic Shotgun: Knockback (increased damage)
      h *= 1.4;
    }
  }
  _2 /= y, v /= y;
  let b = s2 * v - c * 0, x = c * _2 - o * v, S = o * 0 - s2 * _2, C = t2.pellets > 1 ? Qy[t2.id] : void 0, w = K(0, Math.PI * 2), T2 = Math.cos(w), E = Math.sin(w), D = false;
  for (let n3 = 0; n3 < t2.pellets; n3++) {
    let l3, u2;
    if (C && n3 * 2 + 1 < C.length) {
      let e5 = C[n3 * 2] + K(-0.09, 0.09), t3 = C[n3 * 2 + 1] + K(-0.09, 0.09);
      l3 = (e5 * T2 - t3 * E) * g2, u2 = (e5 * E + t3 * T2) * g2;
    } else l3 = Fp() * g2 * 0.5, u2 = Fp() * g2 * 0.5;
    let d2 = o + _2 * l3 + b * u2, f2 = s2 + 0 * l3 + x * u2, m2 = c + v * l3 + S * u2, y2 = Math.hypot(d2, f2, m2);
    d2 /= y2, f2 /= y2, m2 /= y2;
    let w2 = Ly(r, i, a, d2, f2, m2, 320, Vy), O = qy(r, i, a, d2, f2, m2, Vy.t, e4), k = Vy.x, A = Vy.y, ee = Vy.z;
    if (O) {
      let n4 = O.t;
      k = r + d2 * n4, A = i + f2 * n4, ee = a + m2 * n4;
      let o2 = Tp(1, t2.minFalloff, wp((n4 - t2.falloffStart) / (t2.falloffEnd - t2.falloffStart)));
      D = true, Jy(O.f, h * o2 * (O.head ? t2.headMult : 1), e4, t2.name, O.head, k, A, ee);
    } else if (w2) {
      let r2 = Vy.collider;
      (p || n3 === 0) && am.impact(Vy.x, Vy.y, Vy.z, Vy.nx, Vy.ny, Vy.nz, Xy(r2)), r2 && r2.owner && r2.owner.damage(t2.structDamage, e4, false), n3 === 0 && p && W.play(`impact`, { x: Vy.x, y: Vy.y, z: Vy.z, volume: 0.5 });
    }
    if (p && n3 < 4 && am.tracer(Uy.x, Uy.y, Uy.z, k, A, ee), !e4.isPlayer && n3 === 0 && G.player.alive && !(O && O.f === G.player)) {
      let e5 = G.player, t3 = e5.pos.x - r, n4 = e5.eyeY - i, o2 = e5.pos.z - a, s3 = t3 * d2 + n4 * f2 + o2 * m2;
      s3 > 3 && s3 < Vy.t + 2 && t3 * t3 + n4 * n4 + o2 * o2 - s3 * s3 < 6 && W.play(`bullet_whiz`, { volume: 0.5, pitch: K(0.85, 1.2) });
    }
  }
  D && e4.hits++;
}
function tb(e4) {
  for (let t2 of G.fighters) {
    if (t2.burstLeft <= 0) continue;
    let n2 = t2.weapon, r = t2.current, i = t2.burstAim;
    if (!n2 || !r || !t2.alive || t2.mode !== `ground` || t2.buildMode || t2.active !== i.slot || t2.reloadT > 0 || t2.useT > 0) t2.burstLeft = 0;
    else for (t2.burstT -= e4; t2.burstT <= 0 && t2.burstLeft > 0; ) {
      if (r.count <= 0) {
        t2.burstLeft = 0;
        break;
      }
      let e5 = Math.atan2(i.dx, i.dz) + (t2.yaw - i.yaw), a = Math.asin(Cp(i.dy, -1, 1)) + (t2.pitch - i.pitch), o = Math.cos(a);
      eb(t2, n2, r, t2.pos.x + i.ox, t2.pos.y + i.oy, t2.pos.z + i.oz, Math.sin(e5) * o, Math.sin(a), Math.cos(e5) * o, i.inacc, (n2.burst ?? 1) - t2.burstLeft), t2.burstLeft--, t2.burstT += n2.burstGap ?? 0.08;
    }
  }
}
var nb = { target: null, fighter: null, x: 0, y: 0, z: 0, nx: 0, ny: 1, nz: 0, terrain: false };
function rb(e4, t2, n2, r, i, a, o, s2, c = 1) {
  let l2 = Ly(t2, n2, r, i, a, o, s2, Vy), u = qy(t2, n2, r, i, a, o, Math.min(Vy.t, s2), e4), d = nb;
  if (d.target = null, d.fighter = null, d.terrain = false, u) return d.fighter = u.f, d.x = t2 + i * u.t, d.y = n2 + a * u.t, d.z = r + o * u.t, Jy(u.f, 20 + (e4.meleeCombo === 2 ? 20 : 0), e4, `Pickaxe`, false, d.x, d.y, d.z), e4.meleeCombo === 2 && G.uiShake?.(0.2), d;
  if (!l2) return null;
  d.x = Vy.x, d.y = Vy.y, d.z = Vy.z, d.nx = Vy.nx, d.ny = Vy.ny, d.nz = Vy.nz;
  let f = Vy.collider;
  if (f && f.owner) {
    let t3 = f.owner;
    d.target = t3;
    let n3 = Hh[t3.mat];
    am.chips(Vy.x, Vy.y, Vy.z, Vy.nx, Vy.ny, Vy.nz, n3, c > 1 ? 12 : 7, 4.5, 0.13), am.puff(Vy.x, Vy.y, Vy.z, n3, 2, 0.4, 0.4, 0.8, 0.5, 0.4), W.play(`hit_` + t3.mat, e4.isPlayer ? { volume: 0.85 } : { x: Vy.x, y: Vy.y, z: Vy.z }), t3.damage(50 * c, e4, true);
  } else d.terrain = true, am.chips(Vy.x, Vy.y, Vy.z, Vy.nx, Vy.ny, Vy.nz, 9075285, 5, 3.5, 0.1), am.dust(Vy.x, Vy.y, Vy.z, 2), W.play(`impact`, e4.isPlayer ? { volume: 0.6 } : { x: Vy.x, y: Vy.y, z: Vy.z });
  return d;
}
var ib = [];
function ab(e4, t2, n2, r) {
  return zy(e4, t2, n2, r.pos.x, r.pos.y + 1, r.pos.z) || zy(e4, t2, n2, r.pos.x, r.pos.y + r.headH, r.pos.z) || zy(e4, t2, n2, r.pos.x, r.pos.y + 0.3, r.pos.z);
}
function ob(e4, t2, n2, r, i, a, o, s2 = `Rocket Launcher`, c = 0.25) {
  am.explosion(e4, t2, n2, r / 5), W.play(`explosion`, { x: e4, y: t2, z: n2 });
  let l2 = G.camera.position.distanceTo(Hy.set(e4, t2, n2));
  G.shake(Math.max(0, 1.6 - l2 / 22));
  for (let a2 of G.fighters) {
    if (!a2.alive || a2.mode === `bus`) continue;
    let l3 = Cp(t2, a2.pos.y + 0.2, a2.pos.y + a2.headH), u2 = Math.max(0, Math.hypot(a2.pos.x - e4, l3 - t2, a2.pos.z - n2) - 0.35);
    if (u2 > r || !ab(e4, t2, n2, a2)) continue;
    let d = 1 - wp((u2 - 0.6) / Math.max(0.5, r - 0.6)) * (1 - c);
    if (Jy(a2, i * d * (a2 === o ? 0.5 : 1), o, s2, false, a2.pos.x, a2.pos.y + 1.2, a2.pos.z), a2.alive) {
      let t3 = 9 * d / Math.max(u2 + 0.8, 1);
      a2.vel.x += (a2.pos.x - e4) * t3, a2.vel.z += (a2.pos.z - n2) * t3, a2.vel.y += 7 * d, a2.grounded = false;
    }
  }
  let u = /* @__PURE__ */ new Set();
  for (let i2 of By(e4 - r, t2 - r, n2 - r, e4 + r, t2 + r, n2 + r, ib)) {
    let a2 = i2.owner;
    if (!a2 || u.has(a2) || !a2.alive) continue;
    let o2 = Math.max(i2.minX, Math.min(e4, i2.maxX)), s3 = Math.max(i2.minY, Math.min(t2, i2.maxY)), c2 = Math.max(i2.minZ, Math.min(n2, i2.maxZ));
    Math.hypot(o2 - e4, s3 - t2, c2 - n2) > r || u.add(a2);
  }
  for (let e5 of u) e5.damage(a, o, false);
}
var sb = [], cb = new Pn();
function lb(e4, t2, n2, r, i, a, o, s2, c) {
  let l2 = sb.find((e5) => !e5.active);
  l2 || (l2 = { mesh: g_(), pos: new R(), dir: new R(), owner: e4, life: 0, damage: 0, structDamage: 0, active: false }, cb.add(l2.mesh), sb.push(l2)), l2.pos.set(t2, n2, r), l2.dir.set(i, a, o), l2.owner = e4, l2.life = 6, l2.damage = s2, l2.structDamage = c, l2.active = true, l2.mesh.visible = true, l2.mesh.position.copy(l2.pos), l2.mesh.lookAt(t2 + i, n2 + a, r + o);
}
function ub(e4) {
  for (let t2 of sb) {
    if (!t2.active) continue;
    t2.life -= e4;
    let n2 = 46 * e4;
    t2.dir.y -= 0.035 * e4, t2.dir.normalize();
    let r = Ly(t2.pos.x, t2.pos.y, t2.pos.z, t2.dir.x, t2.dir.y, t2.dir.z, n2, Vy), i = qy(t2.pos.x, t2.pos.y, t2.pos.z, t2.dir.x, t2.dir.y, t2.dir.z, Vy.t, t2.owner);
    if (r || i || t2.life <= 0) {
      let e5 = i ? i.t : Vy.t;
      t2.active = false, t2.mesh.visible = false, ob(t2.pos.x + t2.dir.x * (e5 - 0.2), t2.pos.y + t2.dir.y * (e5 - 0.2), t2.pos.z + t2.dir.z * (e5 - 0.2), 5.5, t2.damage, t2.structDamage, t2.owner);
    } else t2.pos.addScaledVector(t2.dir, n2), t2.mesh.position.copy(t2.pos), t2.mesh.lookAt(t2.pos.x + t2.dir.x, t2.pos.y + t2.dir.y, t2.pos.z + t2.dir.z), am.puff(t2.pos.x - t2.dir.x * 0.5, t2.pos.y - t2.dir.y * 0.5, t2.pos.z - t2.dir.z * 0.5, 14211288, 1, 0.45, 0.8, 0.3, 0.3, 0.5), am.spark(t2.pos.x - t2.dir.x * 0.4, t2.pos.y - t2.dir.y * 0.4, t2.pos.z - t2.dir.z * 0.4, 16752704, 1, 1.5, 0.3, 0.12, 0, 3);
  }
}
var db = 0.11, fb = 0.36, pb = 15, mb = 0.45, hb = 1 / 60, gb = 3.2, _b = 0.5, vb = 1.8;
function yb() {
  return h_();
}
var bb = [], xb = new R(), Sb = new R(), Cb = { rest: false }, wb = jy();
function Tb(e4, t2, n2, r, i, a) {
  let o = -Math.cos(e4.yaw), s2 = Math.sin(e4.yaw), c = e4.pos.x, l2 = e4.eyeY + 0.05, u = e4.pos.z, d = c + o * 0.28 + t2 * 0.45, f = l2 + n2 * 0.45, p = u + s2 * 0.28 + r * 0.45, m = d - c, h = f - l2, g2 = p - u, _2 = Math.hypot(m, h, g2) || 1;
  if (Ly(c, l2, u, m / _2, h / _2, g2 / _2, _2 + db, wb)) {
    let e5 = Math.max(0, wb.t - db - 0.05);
    d = c + m / _2 * e5, f = l2 + h / _2 * e5, p = u + g2 / _2 * e5;
  }
  i.set(d, f, p), a.set(t2 * 24 + e4.vel.x * _b, n2 * 24 + gb + Math.max(0, e4.vel.y) * 0.3, r * 24 + e4.vel.z * _b);
}
function Eb(e4, t2, n2, r) {
  let i = e4.x * t2 + e4.y * n2 + e4.z * r;
  if (i >= 0) return 0;
  let a = e4.x - i * t2, o = e4.y - i * n2, s2 = e4.z - i * r, c = -i > 1.6, l2 = c ? -i * fb : 0, u = c ? 1 - 0.55 * wp(-i / 7) : 1;
  return e4.set(a * u + t2 * l2, o * u + n2 * l2, s2 * u + r * l2), -i;
}
function Db(e4, t2, n2, r) {
  if (r.rest) {
    if (e4.y - db - Oy(e4.x, e4.z, e4.y) < 0.08) return 0;
    r.rest = false;
  }
  t2.y -= 27 * n2;
  let i = n2, a = 0, o = false;
  for (let n3 = 0; n3 < 4 && i > 1e-5; n3++) {
    let n4 = t2.length();
    if (n4 < 1e-4) break;
    let r2 = n4 * i, s3 = t2.x / n4, c = t2.y / n4, l2 = t2.z / n4;
    if (!Ly(e4.x, e4.y, e4.z, s3, c, l2, r2 + db, wb)) {
      e4.addScaledVector(t2, i), i = 0;
      break;
    }
    let u = Math.max(0, wb.t - db);
    e4.x += s3 * u, e4.y += c * u, e4.z += l2 * u, i *= 1 - Math.min(1, u / r2);
    let d = wb.nx, f = wb.ny, p = wb.nz;
    a = Math.max(a, Eb(t2, d, f, p)), f > 0.55 && (o = true), e4.x += d * 5e-3, e4.y += f * 5e-3, e4.z += p * 5e-3;
  }
  let s2 = Math.max(Oy(e4.x, e4.z, e4.y - db, 0.04), ay(e4.x, e4.z));
  if (e4.y - db - s2 < 0.03 && t2.y <= 0.5 && (e4.y < s2 + db && (e4.y = s2 + db), o = true, a = Math.max(a, Eb(t2, 0, 1, 0))), o && Math.abs(t2.y) < 1.6) {
    let e5 = Math.hypot(t2.x, t2.z), i2 = Math.max(0, e5 - pb * n2);
    e5 > 1e-5 && (t2.x *= i2 / e5, t2.z *= i2 / e5), i2 < mb && Math.abs(t2.y) < 0.8 && (r.rest = true, t2.set(0, 0, 0));
  }
  return a;
}
function Ob(e4, t2, n2, r, i, a, o, s2, c) {
  Ly(t2, n2, r, i, a, o, 40, Vy);
  let l2 = qy(t2, n2, r, i, a, o, Vy.t, e4), u = (l2 ? l2.t : Math.min(Vy.t, 40)) * 0.82, d = t2 + i * u, f = r + o * u, p = n2 + a * u - 1;
  Tb(e4, i, a, o, xb, Sb);
  let m = d - xb.x, h = f - xb.z, g2 = Math.max(0.5, Math.hypot(m, h)), _2 = p - xb.y, v = 331776 - 27 * (27 * g2 * g2 + 2 * _2 * 24 * 24), y = v >= 0 ? Math.atan((576 - Math.sqrt(v)) / (27 * g2)) : Math.PI / 4, b = s2 * Math.PI / 180;
  y += Fp() * b * 0.5;
  let x = Math.atan2(m, h) + Fp() * b * 0.5, S = 24 * Math.sin(y) - gb, C = 24 * Math.cos(y), w = Math.hypot(S, C) || 1;
  c.set(Math.sin(x) * C / w, S / w, Math.cos(x) * C / w);
}
var kb = new R();
function Ab(e4, t2, n2, r, i, a, o, s2, c, l2) {
  if (n2.count <= 0) return e4.slots[e4.active] = null, e4.select(-1), false;
  let u = e4.isPlayer && Sf.cheats.infiniteAmmo;
  return e4.isPlayer || (Ob(e4, r, i, a, o, s2, c, l2, kb), o = kb.x, s2 = kb.y, c = kb.z), Tb(e4, o, s2, c, xb, Sb), jb(e4, xb, Sb, t2.damage, t2.structDamage, t2.fuse ?? bp, t2.id), u || n2.count--, e4.shots++, e4.fireCd = 1 / t2.fireRate + (e4.isPlayer ? 0 : vb), e4.char.recoil(0.8), e4.isPlayer ? W.play(`throw`, { volume: 0.9 }) : W.play(`throw`, { x: e4.pos.x, y: e4.pos.y + 1.4, z: e4.pos.z }), Gy.onShot?.(e4, t2, 0), n2.count <= 0 && (e4.slots[e4.active] = null, e4.select(-1)), true;
}
function jb(e4, t2, n2, r = 100, i = 375, a = bp, s3 = `grenade`) {
  let o = bb.find((e5) => !e5.active);
  o || (o = { mesh: yb(), pos: new R(), prev: new R(), vel: new R(), owner: null, fuse: 0, acc: 0, active: false, rest: false, damage: 0, structDamage: 0, spin: new R(), blinkT: 0, kind: `grenade` }, cb.add(o.mesh), bb.push(o)), o.pos.copy(t2), o.prev.copy(t2), o.vel.copy(n2), o.owner = e4, o.fuse = a, o.acc = 0, o.active = true, o.rest = false, o.damage = r, o.structDamage = i, o.blinkT = 0, o.kind = s3, o.spin.set(K(-14, 14), K(-6, 6), K(-14, 14)), o.mesh.visible = true, o.mesh.position.copy(t2);
}
function Mb(e4) {
  for (let t2 of bb) {
    if (!t2.active) continue;
    t2.fuse -= e4, t2.acc += e4;
    let n2 = 0;
    for (; t2.acc >= hb; ) t2.acc -= hb, t2.prev.copy(t2.pos), Cb.rest = t2.rest, n2 = Math.max(n2, Db(t2.pos, t2.vel, hb, Cb)), t2.rest = Cb.rest;
    t2.fuse <= 0 ? (t2.active = false, t2.mesh.visible = false, G.detonate(t2)) : (n2 > 2.2 && W.play(`nade_bounce`, { x: t2.pos.x, y: t2.pos.y, z: t2.pos.z, volume: Math.min(1, 0.25 + n2 / 14), pitch: K(0.9, 1.15) }), n2 > 0 && t2.spin.multiplyScalar(0.7), t2.mesh.position.lerpVectors(t2.prev, t2.pos, t2.acc / hb), t2.rest || (t2.mesh.rotation.x += t2.spin.x * e4, t2.mesh.rotation.y += t2.spin.y * e4, t2.mesh.rotation.z += t2.spin.z * e4), !t2.rest && Math.random() < 0.6 && am.grenadeTrail(t2.mesh.position.x, t2.mesh.position.y, t2.mesh.position.z), t2.blinkT -= e4, t2.blinkT <= 0 && (t2.blinkT = t2.fuse < 0.8 ? 0.12 : 0.32, t2.pos.distanceToSquared(G.camera.position) < 6400 && am.spark(t2.pos.x, t2.pos.y + 0.16, t2.pos.z, 16726570, 2, 0.6, 0.12, 0.16, 0, 3.2)));
  }
}
function Nb(e4, t2, n2, r, i, a) {
  let o = Math.floor(i.length / 3);
  Tb(e4, t2, n2, r, xb, Sb), Cb.rest = false, i[0] = xb.x, i[1] = xb.y, i[2] = xb.z;
  let s2 = 1;
  a.set(0, 1, 0);
  let c = Math.ceil(bp / hb);
  for (let e5 = 1; e5 <= c && s2 < o; e5++) if (Db(xb, Sb, hb, Cb), (Cb.rest || e5 === c || !(e5 & 1)) && (i[s2 * 3] = xb.x, i[s2 * 3 + 1] = xb.y, i[s2 * 3 + 2] = xb.z, s2++), Cb.rest) {
    a.set(wb.nx, wb.ny, wb.nz), a.y < 0.55 && a.set(0, 1, 0);
    break;
  }
  return s2;
}
function Pb(e4) {
  tb(e4), ub(e4), Mb(e4);
}
function Fb() {
  for (let e4 of sb) e4.active = false, e4.mesh.visible = false;
  for (let e4 of bb) e4.active = false, e4.mesh.visible = false;
  for (let e4 of G.fighters) e4.burstLeft = 0;
}
function Ib() {
  return bb.filter((e4) => e4.active).length;
}
var Lb = class {
  size;
  c;
  h;
  cx;
  hx;
  constructor(e4) {
    this.size = e4, this.c = document.createElement(`canvas`), this.h = document.createElement(`canvas`), this.c.width = this.c.height = this.h.width = this.h.height = e4, this.cx = this.c.getContext(`2d`), this.hx = this.h.getContext(`2d`, { willReadFrequently: true });
  }
  rect(e4, t2, n2, r, i, a) {
    this.cx.fillStyle = i, this.cx.fillRect(e4, t2, n2, r), this.hx.fillStyle = zb(a), this.hx.fillRect(e4, t2, n2, r);
  }
  circle(e4, t2, n2, r, i) {
    for (let [a, o] of [[this.cx, r], [this.hx, zb(i)]]) a.fillStyle = o, a.beginPath(), a.arc(e4, t2, n2, 0, Math.PI * 2), a.fill();
  }
  line(e4, t2, n2, r, i, a, o) {
    for (let [s2, c] of [[this.cx, a], [this.hx, zb(o)]]) s2.strokeStyle = c, s2.lineWidth = i, s2.lineCap = `butt`, s2.beginPath(), s2.moveTo(e4, t2), s2.lineTo(n2, r), s2.stroke();
  }
  block(e4, t2, n2, r, i, a, o = {}) {
    let s2 = o.bev ?? 4, c = o.rad ?? 3, l2 = o.light ?? 0.22, u = o.dark ?? 0.22, d = this.cx, f = d.createLinearGradient(0, t2, 0, t2 + r);
    f.addColorStop(0, Bb(i, 1.06)), f.addColorStop(0.6, Bb(i, 1)), f.addColorStop(1, Bb(i, 0.92)), d.fillStyle = f, Rb(d, e4, t2, n2, r, c), d.fill(), d.save(), Rb(d, e4, t2, n2, r, c), d.clip(), d.fillStyle = `rgba(255,250,235,${l2})`, d.fillRect(e4, t2, n2, s2), d.fillRect(e4, t2, s2 * 0.7, r), d.fillStyle = `rgba(40,25,20,${u})`, d.fillRect(e4, t2 + r - s2, n2, s2), d.fillRect(e4 + n2 - s2 * 0.7, t2, s2 * 0.7, r), d.restore();
    let p = this.hx;
    for (let i2 = 0; i2 < 3; i2++) {
      let o2 = i2 * s2 * 0.45;
      p.fillStyle = zb(a * (0.82 + i2 * 0.09)), Rb(p, e4 + o2, t2 + o2, n2 - o2 * 2, r - o2 * 2, Math.max(0, c - o2 * 0.5)), p.fill();
    }
  }
  strokes(e4, t2, n2, r, i, a, o, s2, c = [20, 90], l2 = false) {
    let u = this.cx;
    u.save(), u.beginPath(), u.rect(n2, r, i, a), u.clip();
    for (let d = 0; d < t2; d++) {
      u.fillStyle = e4.chance(0.5) ? `rgba(255,${l2 ? 240 : 252},${l2 ? 215 : 245},${e4.range(0.3, 1) * s2})` : `rgba(${l2 ? `70,40,20` : `30,35,45`},${e4.range(0.3, 1) * s2})`;
      let t3 = e4.range(c[0], c[1]), d2 = e4.range(1, 2.6), f = e4.range(n2, n2 + i), p = e4.range(r, r + a);
      o === 1 ? u.fillRect(f, p - t3 / 2, d2, t3) : u.fillRect(f - t3 / 2, p, t3, d2);
    }
    u.restore();
  }
  grain(e4, t2, n2, r = 1) {
    let i = this.cx, a = this.size;
    for (let o = 0; o < n2; o++) {
      let n3 = e4.range(0.02, t2);
      i.fillStyle = e4.chance(0.5) ? `rgba(0,0,0,${n3 * 0.7})` : `rgba(255,255,255,${n3 * 0.8})`, i.fillRect(e4.range(0, a), e4.range(0, a), e4.range(1, 2.5), e4.range(1, 2.5 * r));
    }
  }
  mottle(e4, t2, n2, r = [20, 70]) {
    let i = this.cx, a = this.size;
    for (let o = 0; o < t2; o++) {
      let t3 = e4.range(0, a), o2 = e4.range(0, a), s2 = e4.range(r[0], r[1]), c = i.createRadialGradient(t3, o2, 0, t3, o2, s2), l2 = e4.chance(0.5) ? `255,255,255` : `70,60,55`;
      c.addColorStop(0, `rgba(${l2},${e4.range(0.4, 1) * n2})`), c.addColorStop(1, `rgba(${l2},0)`), i.fillStyle = c, i.fillRect(t3 - s2, o2 - s2, s2 * 2, s2 * 2);
    }
  }
};
function Rb(e4, t2, n2, r, i, a) {
  e4.beginPath(), a <= 0.5 || typeof e4.roundRect != `function` ? e4.rect(t2, n2, r, i) : e4.roundRect(t2, n2, r, i, Math.min(a, r / 2, i / 2));
}
var zb = (e4) => {
  let t2 = Math.round(Math.min(1, Math.max(0, e4)) * 255);
  return `rgb(${t2},${t2},${t2})`;
};
function Bb(e4, t2) {
  return `rgb(${Math.min(255, Math.max(0, Math.round((e4 >> 16 & 255) * t2)))},${Math.min(255, Math.max(0, Math.round((e4 >> 8 & 255) * t2)))},${Math.min(255, Math.max(0, Math.round((e4 & 255) * t2)))})`;
}
function Vb(e4, n2) {
  let r = e4.width, i = e4.getContext(`2d`, { willReadFrequently: true }).getImageData(0, 0, r, r).data, a = document.createElement(`canvas`);
  a.width = a.height = r;
  let o = a.getContext(`2d`), s2 = o.createImageData(r, r), c = new Float32Array(r * r);
  for (let e5 = 0; e5 < r * r; e5++) c[e5] = i[e5 * 4] / 255;
  let l2 = new Float32Array(r * r);
  for (let e5 = 0; e5 < r; e5++) for (let t2 = 0; t2 < r; t2++) {
    let n3 = 0;
    for (let i2 = -1; i2 <= 1; i2++) for (let a2 = -1; a2 <= 1; a2++) n3 += c[(e5 + i2 + r) % r * r + (t2 + a2 + r) % r];
    l2[e5 * r + t2] = n3 / 9;
  }
  let u = (e5, t2) => l2[(t2 + r) % r * r + (e5 + r) % r];
  for (let e5 = 0; e5 < r; e5++) for (let t2 = 0; t2 < r; t2++) {
    let i2 = (u(t2 + 1, e5) - u(t2 - 1, e5)) * n2, a2 = (u(t2, e5 + 1) - u(t2, e5 - 1)) * n2, o2 = 1 / Math.sqrt(i2 * i2 + a2 * a2 + 1), c2 = (e5 * r + t2) * 4;
    s2.data[c2] = (-i2 * o2 * 0.5 + 0.5) * 255, s2.data[c2 + 1] = (a2 * o2 * 0.5 + 0.5) * 255, s2.data[c2 + 2] = (o2 * 0.5 + 0.5) * 255, s2.data[c2 + 3] = 255;
  }
  o.putImageData(s2, 0, 0);
  let d = new Na(a);
  return d.wrapS = d.wrapT = t, d.anisotropy = 4, d;
}
function Hb(e4, n2) {
  let r = new Na(e4.c);
  return r.colorSpace = He, r.wrapS = r.wrapT = t, r.anisotropy = 8, { map: r, normalMap: Vb(e4.h, n2) };
}
function Ub() {
  let e4 = new Lb(512), t2 = new jp(11);
  e4.rect(0, 0, 512, 512, `#6a4527`, 0.1);
  let n2 = [13803362, 13144663, 14330220, 12552786, 13474398];
  for (let r = 0; r < 8; r++) {
    let i = n2[(r * 3 + t2.int(0, 4)) % n2.length];
    e4.block(r * 64 + 2, -4, 60, 520, i, 0.62 + t2.range(-0.04, 0.04), { bev: 5, rad: 2, light: 0.18, dark: 0.2 }), e4.cx.save(), e4.cx.beginPath(), e4.cx.rect(r * 64 + 3, 0, 58, 512), e4.cx.clip();
    for (let n3 = 0; n3 < 7; n3++) {
      let n4 = r * 64 + 6 + t2.range(0, 52), i2 = t2.range(1.5, 4), a = t2.range(0, 6);
      e4.cx.strokeStyle = `rgba(120,70,30,${t2.range(0.1, 0.2)})`, e4.cx.lineWidth = t2.range(1, 2), e4.cx.beginPath();
      for (let t3 = 0; t3 <= 512; t3 += 16) {
        let r2 = n4 + Math.sin(t3 * 0.02 + a) * i2;
        t3 === 0 ? e4.cx.moveTo(r2, t3) : e4.cx.lineTo(r2, t3);
      }
      e4.cx.stroke();
    }
    if (e4.cx.restore(), t2.chance(0.55)) {
      let n3 = r * 64 + 32 + t2.range(-10, 10), i2 = t2.range(70, 442);
      e4.cx.fillStyle = `rgba(110,62,28,0.45)`, e4.cx.beginPath(), e4.cx.ellipse(n3, i2, 6, 11, 0, 0, 7), e4.cx.fill(), e4.cx.strokeStyle = `rgba(110,62,28,0.25)`, e4.cx.lineWidth = 2, e4.cx.beginPath(), e4.cx.ellipse(n3, i2, 10, 17, 0, 0, 7), e4.cx.stroke();
    }
  }
  e4.line(40, 472, 472, 40, 36, Bb(9067056, 1), 0.82), e4.line(40, 472, 472, 40, 30, Bb(12420425, 1), 0.88), e4.cx.strokeStyle = `rgba(255,240,210,0.25)`, e4.cx.lineWidth = 3, e4.cx.beginPath(), e4.cx.moveTo(34, 462), e4.cx.lineTo(462, 34), e4.cx.stroke(), e4.block(0, 0, 512, 40, 11762243, 0.96, { bev: 6, rad: 2 }), e4.block(0, 472, 512, 40, 11104831, 0.96, { bev: 6, rad: 2 }), e4.block(0, 38, 40, 436, 12157e3, 0.95, { bev: 6, rad: 2 }), e4.block(472, 38, 40, 436, 11367999, 0.95, { bev: 6, rad: 2 }), e4.strokes(t2, 60, 0, 0, 512, 40, 0, 0.06, [30, 120], true), e4.strokes(t2, 60, 0, 472, 512, 40, 0, 0.06, [30, 120], true);
  for (let [t3, n3] of [[20, 20], [492, 20], [20, 492], [492, 492], [256, 20], [256, 492], [20, 256], [492, 256]]) e4.circle(t3, n3, 5.5, `#5a3c22`, 1), e4.circle(t3, n3, 4, `#b9b3a8`, 1), e4.circle(t3 - 1.2, n3 - 1.2, 1.6, `#f2eee6`, 1);
  return e4.grain(t2, 0.04, 900, 3), e4;
}
function Wb() {
  let e4 = new Lb(512), t2 = new jp(23);
  e4.rect(0, 0, 512, 512, `#e4d9c6`, 0.3), e4.mottle(t2, 30, 0.05);
  let n2 = 440 / 13, r = 512 / 6, i = [13200709, 12543040, 13794128, 12082750, 13398857, 14191196];
  for (let a = 0; a < 13; a++) {
    let o = a % 2 * r * 0.5;
    for (let s2 = -1; s2 < 7; s2++) {
      let c = t2.pick(i);
      e4.block(s2 * r + o + 3, 36 + a * n2 + 3, 79.33333333333333, 27.846153846153847, c, 0.74 + t2.range(-0.05, 0.05), { bev: 3.5, rad: 3, light: 0.2, dark: 0.18 }), t2.chance(0.35) && e4.strokes(t2, 4, s2 * r + o + 6, 36 + a * n2 + 6, 73.33333333333333, 21.846153846153847, 0, 0.08, [10, 30], true);
    }
  }
  for (let t3 = 0; t3 < 4; t3++) e4.block(t3 * 512 / 4 + 2, 1, 124, 32, 14274495, 0.95, { bev: 5, rad: 2 }), e4.block(t3 * 512 / 4 + 2, 479, 124, 32, 13484721, 0.95, { bev: 5, rad: 2 });
  return e4.grain(t2, 0.035, 900), e4;
}
function Gb() {
  let e4 = new Lb(512), t2 = new jp(37);
  e4.rect(0, 0, 512, 512, `#6f7c89`, 0.2);
  for (let n2 = 0; n2 < 2; n2++) {
    let r = 30 + n2 * 452 / 2 + 3, i = 220 / 9;
    for (let t3 = 0; t3 < 9; t3++) {
      let n3 = r + t3 * i, a2 = e4.cx.createLinearGradient(n3, 0, n3 + i, 0);
      a2.addColorStop(0, `#8c99a6`), a2.addColorStop(0.35, `#c9d3dc`), a2.addColorStop(0.55, `#b4c0cb`), a2.addColorStop(1, `#7f8c99`), e4.cx.fillStyle = a2, e4.cx.fillRect(n3, 33, 24.944444444444443, 446);
      let o = e4.hx.createLinearGradient(n3, 0, n3 + i, 0);
      o.addColorStop(0, zb(0.45)), o.addColorStop(0.5, zb(0.75)), o.addColorStop(1, zb(0.45)), e4.hx.fillStyle = o, e4.hx.fillRect(n3, 33, 24.944444444444443, 446);
    }
    let a = e4.cx.createLinearGradient(0, 33, 0, 479);
    a.addColorStop(0, `rgba(255,255,255,0.08)`), a.addColorStop(1, `rgba(40,50,70,0.10)`), e4.cx.fillStyle = a, e4.cx.fillRect(r, 33, 220, 446);
    for (let n3 = 0; n3 < 5; n3++) {
      let n4 = t2.range(r, r + 220), i2 = t2.range(40, 160), a2 = e4.cx.createLinearGradient(0, 33, 0, 33 + i2);
      a2.addColorStop(0, `rgba(120,90,70,0.10)`), a2.addColorStop(1, `rgba(120,90,70,0)`), e4.cx.fillStyle = a2, e4.cx.fillRect(n4, 33, t2.range(4, 9), i2);
    }
  }
  e4.block(0, 0, 512, 30, 10727355, 0.95, { bev: 5, rad: 2 }), e4.block(0, 482, 512, 30, 9806253, 0.95, { bev: 5, rad: 2 }), e4.block(0, 28, 30, 456, 10398390, 0.95, { bev: 5, rad: 2 }), e4.block(482, 28, 30, 456, 9806253, 0.95, { bev: 5, rad: 2 }), e4.block(246, 28, 20, 456, 10135218, 0.93, { bev: 4, rad: 2 });
  for (let t3 = 0; t3 < 6; t3++) {
    let n2 = 20 + t3 * 472 / 5;
    for (let [t4, r] of [[n2, 15], [n2, 497], [15, n2], [497, n2], [256, n2]]) e4.circle(t4, r, 5, `#55606b`, 1), e4.circle(t4, r, 3.8, `#d6dee6`, 1), e4.circle(t4 - 1, r - 1, 1.5, `#ffffff`, 1);
  }
  return e4.grain(t2, 0.03, 700), e4;
}
function Kb() {
  let e4 = new Lb(512), t2 = new jp(41);
  e4.rect(0, 0, 512, 512, `#ffffff`, 0.5);
  let n2 = 488 / 12;
  for (let r = 0; r < 12; r++) {
    let i = r * n2, a = e4.hx.createLinearGradient(0, i, 0, i + n2);
    a.addColorStop(0, zb(0.35)), a.addColorStop(0.92, zb(0.85)), a.addColorStop(1, zb(0.25)), e4.hx.fillStyle = a, e4.hx.fillRect(0, i, 512, n2);
    let o = e4.cx.createLinearGradient(0, i, 0, i + n2), s2 = t2.range(0.97, 1.01);
    o.addColorStop(0, Bb(15328991, s2)), o.addColorStop(0.85, Bb(16316145, s2)), o.addColorStop(1, Bb(16513782, s2)), e4.cx.fillStyle = o, e4.cx.fillRect(0, i, 512, n2), e4.cx.fillStyle = `rgba(80,90,110,0.22)`, e4.cx.fillRect(0, i + n2 - 4, 512, 4), e4.cx.fillStyle = `rgba(255,255,255,0.6)`, e4.cx.fillRect(0, i, 512, 2), e4.strokes(t2, 10, 0, i + 3, 512, 32.666666666666664, 0, 0.035, [40, 160]);
  }
  return e4.block(0, 0, 16, 512, 15855336, 1, { bev: 4, rad: 0 }), e4.block(496, 0, 16, 512, 15328733, 1, { bev: 4, rad: 0 }), e4.block(0, 488, 512, 24, 14472907, 1, { bev: 5, rad: 0 }), e4.grain(t2, 0.02, 500, 3), e4;
}
function qb() {
  let e4 = new Lb(512), t2 = new jp(53);
  e4.rect(0, 0, 512, 512, `#7c7c84`, 0.2);
  for (let n2 = 0; n2 < 10; n2++) {
    let r = n2 % 2 * 64 * 0.5 + t2.range(-4, 4);
    for (let i = -1; i < 9; i++) {
      let a = t2.range(0.9, 1.08), o = i * 64 + r + 2, s2 = n2 * 51.2 + 1, c = 60 + t2.range(-3, 3), l2 = 49.2, u = e4.hx.createLinearGradient(0, s2, 0, s2 + l2);
      u.addColorStop(0, zb(0.45)), u.addColorStop(1, zb(0.95)), e4.hx.fillStyle = u, Rb(e4.hx, o, s2, c, l2, 4), e4.hx.fill();
      let d = e4.cx.createLinearGradient(0, s2, 0, s2 + l2);
      d.addColorStop(0, Bb(13619156, a)), d.addColorStop(1, Bb(15461358, a)), e4.cx.fillStyle = d, Rb(e4.cx, o, s2, c, l2, 4), e4.cx.fill(), e4.cx.fillStyle = `rgba(30,30,45,0.2)`, e4.cx.fillRect(o, s2 + l2 - 5, c, 5), e4.cx.fillStyle = `rgba(255,255,255,0.25)`, e4.cx.fillRect(o + 2, s2 + l2 - 9, c - 4, 2);
    }
  }
  return e4.grain(t2, 0.035, 900), e4;
}
function Jb() {
  let e4 = new Lb(512), t2 = new jp(67);
  e4.rect(0, 0, 512, 512, `#dcd9d2`, 0.6), e4.mottle(t2, 70, 0.06, [30, 110]), e4.strokes(t2, 80, 0, 0, 512, 512, 0, 0.03, [40, 140]);
  for (let t3 of [0, 256]) e4.line(0, t3 + 1, 512, t3 + 1, 3, `#b8b5ae`, 0.45), e4.line(t3 + 1, 0, t3 + 1, 512, 3, `#b8b5ae`, 0.45), e4.cx.fillStyle = `rgba(255,255,255,0.35)`, e4.cx.fillRect(0, t3 + 3, 512, 1.5), e4.cx.fillRect(t3 + 3, 0, 1.5, 512);
  for (let t3 = 0; t3 < 2; t3++) for (let n2 = 0; n2 < 2; n2++) for (let [r, i] of [[40, 40], [216, 40], [40, 216], [216, 216]]) {
    let a = n2 * 512 / 2 + r, o = t3 * 512 / 2 + i;
    e4.circle(a, o, 4.5, `#a9a59d`, 0.35), e4.circle(a + 0.8, o + 0.8, 2.5, `#8e8a83`, 0.3);
  }
  return e4.grain(t2, 0.03, 1200), e4;
}
function Yb() {
  let e4 = new Lb(512), t2 = new jp(71);
  e4.rect(0, 0, 512, 512, `#6a4527`, 0.15);
  let n2 = 512 / 9, r = [13606243, 12947802, 14199408, 12487251];
  for (let i = 0; i < 9; i++) {
    let a = -t2.range(0, 200);
    for (; a < 512; ) {
      let o = t2.range(160, 340);
      e4.block(i * n2 + 1.5, a + 1.5, 53.888888888888886, o - 3, t2.pick(r), 0.7 + t2.range(-0.04, 0.04), { bev: 4, rad: 2, light: 0.16, dark: 0.18 }), e4.strokes(t2, 6, i * n2 + 4, a + 4, 48.888888888888886, o - 8, 1, 0.08, [30, 110], true), a += o;
    }
  }
  return e4.grain(t2, 0.03, 700, 3), e4;
}
function Xb() {
  let e4 = new Lb(512), t2 = new jp(83);
  e4.rect(0, 0, 512, 512, `#8d8577`, 0.12);
  let n2 = 512 / 7, r = [12893097, 11906203, 13616821, 11116688, 12432289];
  for (let i = 0; i < 7; i++) {
    let a = -t2.range(0, 60);
    for (; a < 512; ) {
      let o = t2.range(62, 128);
      e4.block(a + 4, i * n2 + 4 + t2.range(-1.5, 1.5), o - 8, 65.14285714285714, t2.pick(r), 0.72 + t2.range(-0.1, 0.1), { bev: 7, rad: 10, light: 0.26, dark: 0.26 }), e4.strokes(t2, 5, a + 8, i * n2 + 8, o - 16, 57.14285714285714, 0, 0.07, [8, 30]), a += o;
    }
  }
  return e4.grain(t2, 0.04, 1200), e4;
}
function Zb() {
  let e4 = new Lb(512), t2 = new jp(97);
  e4.rect(0, 0, 512, 512, `#f6f3ec`, 0.55), e4.mottle(t2, 60, 0.035, [20, 80]), e4.strokes(t2, 70, 0, 40, 512, 432, 0, 0.025, [30, 120], true);
  for (let n2 = 0; n2 < 14; n2++) {
    let n3 = t2.range(0, 512), r = t2.range(30, 120), i = e4.cx.createLinearGradient(0, 40, 0, 40 + r);
    i.addColorStop(0, `rgba(120,108,96,0.07)`), i.addColorStop(1, `rgba(120,108,96,0)`), e4.cx.fillStyle = i, e4.cx.fillRect(n3, 40, t2.range(4, 10), r);
  }
  return e4.block(0, 0, 512, 24, 16777215, 0.96, { bev: 5, rad: 0, light: 0.3, dark: 0.15 }), e4.block(0, 24, 512, 12, 14867923, 0.84, { bev: 3, rad: 0 }), e4.block(0, 480, 512, 32, 15262681, 0.9, { bev: 5, rad: 0 }), e4.block(0, 36, 14, 444, 16447731, 0.74, { bev: 4, rad: 0, light: 0.2, dark: 0.08 }), e4.block(498, 36, 14, 444, 15723491, 0.74, { bev: 4, rad: 0, light: 0.1, dark: 0.12 }), e4.grain(t2, 0.02, 800, 2), e4;
}
function Qb() {
  let e4 = new Lb(512), t2 = new jp(101);
  e4.rect(0, 0, 512, 512, `#d3dbe4`, 0.9);
  for (let n2 = 0; n2 < 2; n2++) for (let r = 0; r < 2; r++) {
    let i = r * 256 + 10, a = n2 * 208 + 10, o = e4.cx.createLinearGradient(i, a, i + 118, a + 188);
    o.addColorStop(0, `#b5e0f7`), o.addColorStop(0.4, `#62a3d6`), o.addColorStop(1, `#3a73aa`), e4.cx.fillStyle = o, e4.cx.fillRect(i, a, 236, 188), e4.hx.fillStyle = zb(0.35), e4.hx.fillRect(i, a, 236, 188), e4.cx.save(), e4.cx.beginPath(), e4.cx.rect(i, a, 236, 188), e4.cx.clip();
    let s2 = i + t2.range(0, 0.5) * 236;
    for (let [t3, n3, r2] of [[0, 34, 0.24], [48, 12, 0.18]]) e4.cx.fillStyle = `rgba(255,255,255,${r2})`, e4.cx.beginPath(), e4.cx.moveTo(s2 + t3, a + 188), e4.cx.lineTo(s2 + t3 + n3, a + 188), e4.cx.lineTo(s2 + t3 + n3 + 103.4, a), e4.cx.lineTo(s2 + t3 + 103.4, a), e4.cx.fill();
    e4.cx.fillStyle = `rgba(255,255,255,0.35)`, e4.cx.fillRect(i, a, 236, 3), e4.cx.fillStyle = `rgba(10,30,60,0.18)`, e4.cx.fillRect(i, a + 188 - 10, 236, 10), e4.cx.restore();
  }
  return e4.block(0, 420, 512, 88, 6715018, 0.7, { bev: 5, rad: 0 }), e4.rect(0, 420, 512, 6, `#97a5b6`, 0.85), e4.grain(t2, 0.015, 500), e4;
}
function $b() {
  let e4 = new Lb(512), t2 = new jp(109);
  e4.rect(0, 0, 512, 512, `#c2bbaf`, 0.2);
  for (let n2 = 0; n2 < 4; n2++) for (let r = 0; r < 4; r++) {
    let i = (r + n2) % 2 == 0 ? 15986403 : 14471613;
    e4.block(r * 128 + 3, n2 * 128 + 3, 122, 122, i, 0.75, { bev: 4, rad: 3, light: 0.3, dark: 0.12 }), e4.strokes(t2, 4, r * 128 + 10, n2 * 128 + 10, 108, 108, 0, 0.04, [20, 60]);
  }
  return e4.grain(t2, 0.02, 600), e4;
}
function ex() {
  let e4 = new Lb(512), t2 = new jp(113);
  e4.rect(0, 0, 512, 512, `#aea594`, 0.2);
  for (let n2 = 0; n2 < 4; n2++) {
    let r = n2 % 2 * 64;
    for (let i = -1; i < 4; i++) e4.block(i * 128 + r + 3, 60 + n2 * 113 + 3, 122, 107, t2.pick([15393490, 14932422, 15722714]), 0.72 + t2.range(-0.03, 0.03), { bev: 5, rad: 2 }), e4.strokes(t2, 4, i * 128 + r + 8, 60 + n2 * 113 + 8, 112, 97, 0, 0.04, [20, 60], true);
  }
  return e4.block(0, 0, 512, 26, 16117733, 0.98, { bev: 5, rad: 0, light: 0.3 }), e4.block(0, 26, 512, 14, 14208700, 0.85, { bev: 3, rad: 0 }), e4.block(0, 40, 512, 16, 15261647, 0.9, { bev: 4, rad: 0 }), e4.grain(t2, 0.025, 800), e4;
}
var tx = { planks: [Ub, 2.4], brick: [Wb, 2.4], metal: [Gb, 2], siding: [Kb, 2.2], shingle: [qb, 2.4], concrete: [Jb, 0.9], floorwood: [Yb, 2], stonewall: [Xb, 2.8], stucco: [Zb, 1.3], glass: [Qb, 1.8], tile: [$b, 1.6], panel: [ex, 2] }, nx = /* @__PURE__ */ new Map();
function rx(e4) {
  let t2 = nx.get(e4);
  if (!t2) {
    let [n2, r] = tx[e4];
    const surface=n2();
    if(e4!==`glass`) {const wear=new jp(900+e4.length*31);surface.mottle(wear,18,.022,[12,38]);surface.grain(wear,.045,1100,1.3);}
    t2 = Hb(surface, r), e4 === `shingle` && (t2.map.repeat.set(2.5, 2.5), t2.normalMap.repeat.set(2.5, 2.5)), nx.set(e4, t2);
  }
  return t2;
}
function ix(e4, t2, n2, r) {
  let i = Math.floor(e4), a = Math.floor(t2), o = e4 - i, s2 = t2 - a, c = o * o * (3 - 2 * o), l2 = s2 * s2 * (3 - 2 * s2), u = (e5) => (e5 % n2 + n2) % n2, d = Wp(u(i) + r * 57, u(a)), f = Wp(u(i + 1) + r * 57, u(a)), p = Wp(u(i) + r * 57, u(a + 1)), m = Wp(u(i + 1) + r * 57, u(a + 1));
  return Tp(Tp(d, f, c), Tp(p, m, c), l2);
}
function ax(e4, t2, n2, r, i) {
  let a = 0.5, o = n2, s2 = 0, c = 0;
  for (let n3 = 0; n3 < r; n3++) s2 += a * ix(e4 * o, t2 * o, o, i + n3 * 13), c += a, a *= 0.5, o *= 2;
  return s2 / c;
}
function ox() {
  let e4 = new Uint8Array(262144);
  for (let t2 = 0; t2 < 256; t2++) for (let n3 = 0; n3 < 256; n3++) {
    let r = n3 / 256, i = t2 / 256, a = (t2 * 256 + n3) * 4;
    e4[a] = ax(r, i, 4, 5, 1) * 255, e4[a + 1] = ax(r, i, 6, 4, 9) * 255;
    let o = ax(r, i, 32, 3, 21) * 0.6 + ax(r, i, 8, 2, 33) * 0.4;
    e4[a + 2] = Math.min(255, Math.max(0, (o - 0.5) * 1.9 + 0.5) * 255), e4[a + 3] = 255;
  }
  let n2 = new Ki(e4, 256, 256, T);
  return n2.wrapS = n2.wrapT = t, n2.magFilter = s, n2.minFilter = l, n2.generateMipmaps = true, n2.anisotropy = 4, n2.needsUpdate = true, n2;
}
function sx(e4 = 128, t2 = 2) {
  let n2 = document.createElement(`canvas`);
  n2.width = n2.height = e4;
  let r = n2.getContext(`2d`), i = r.createImageData(e4, e4);
  for (let n3 = 0; n3 < e4; n3++) for (let r2 = 0; r2 < e4; r2++) {
    let a2 = (r2 + 0.5) / e4 * 2 - 1, o = (n3 + 0.5) / e4 * 2 - 1, s2 = (1 - Math.min(1, Math.sqrt(a2 * a2 + o * o))) ** t2, c = (n3 * e4 + r2) * 4;
    i.data[c] = i.data[c + 1] = i.data[c + 2] = 255, i.data[c + 3] = s2 * 255;
  }
  r.putImageData(i, 0, 0);
  let a = new Na(n2);
  return a.colorSpace = He, a;
}
var cx = class {
  geo;
  mat;
  parent;
  shadows;
  mesh;
  items = [];
  cap;
  constructor(e4, t2, n2, r = 32, i = true) {
    this.geo = e4, this.mat = t2, this.parent = n2, this.shadows = i, this.cap = r, this.mesh = this.make(r);
  }
  make(e4) {
    let t2 = new ia(this.geo, this.mat, e4);
    return t2.count = 0, t2.frustumCulled = false, t2.castShadow = this.shadows, t2.receiveShadow = true, t2.instanceMatrix.setUsage(Je), t2.setColorAt(0, new B(1, 1, 1)), t2.instanceColor.setUsage(Je), this.parent.add(t2), t2;
  }
  add(e4) {
    if (this.items.length === this.cap) {
      let e5 = this.mesh;
      this.cap *= 2, this.mesh = this.make(this.cap), this.parent.remove(e5), e5.dispose();
      for (let e6 of this.items) this.writeRaw(e6);
    }
    e4.index = this.items.length, this.items.push(e4), this.mesh.count = this.items.length, this.write(e4);
  }
  remove(e4) {
    if (e4.index < 0) return;
    let t2 = this.items.pop();
    t2 !== e4 && (this.items[e4.index] = t2, t2.index = e4.index, this.write(t2)), e4.index = -1, this.mesh.count = this.items.length;
  }
  writeRaw(e4) {
    this.mesh.setMatrixAt(e4.index, e4.matrix), this.mesh.setColorAt(e4.index, e4.color);
  }
  write(e4) {
    e4.index < 0 || (this.writeRaw(e4), this.mesh.instanceMatrix.needsUpdate = true, this.mesh.instanceColor.needsUpdate = true);
  }
  clear() {
    for (let e4 of this.items) e4.index = -1;
    this.items.length = 0, this.mesh.count = 0;
  }
}, lx = 0.32, ux = 2.5, dx = 3.0, fx = { wallGrid: true, wallTriL: true, wallTriR: true, wall: true, wallDoor: true, wallWin: true, half: true, gable: true, floor: false, floorHalf: false, stairs: false, roof: false, pyr: false, wallShop: true, wallWin2: true, parapet: true, pad: false }, px = 1.95, mx = 3, hx = 1.05, gx = 1.25, _x = 0.55, vx = 1.1, yx = 2.8;
function bx(e4, t2) {
  let n2 = [], r = [], i = [], a = [];
  e4.forEach((e5, o2) => {
    let s2 = e5.index ? e5.toNonIndexed() : e5, c = s2.getAttribute(`position`), l2 = s2.getAttribute(`normal`);
    for (let e6 = 0; e6 < c.count; e6++) {
      let s3 = c.getX(e6), u = c.getY(e6), d = c.getZ(e6), f = l2.getX(e6), p = l2.getY(e6), m = l2.getZ(e6);
      n2.push(s3, u, d), r.push(f, p, m);
      let h = Math.abs(f), g2 = Math.abs(p), _2 = Math.abs(m);
      g2 >= h && g2 >= _2 ? i.push(s3 / 5 + 0.5, d / 5 + 0.5) : _2 >= h ? i.push(s3 / 5 + 0.5, u / 4) : i.push(d / 5 + 0.5, u / 4);
      let v = t2(s3, u, d, o2);
      a.push(v, v, v);
    }
  });
  let o = new Hr();
  return o.setAttribute(`position`, new V(n2, 3)), o.setAttribute(`normal`, new V(r, 3)), o.setAttribute(`uv`, new V(i, 2)), o.setAttribute(`color`, new V(a, 3)), o.computeBoundingSphere(), o;
}
var xx = (e4, t2, n2, r, i, a) => new La(e4, t2, n2).translate(r, i, a), Sx = (e4, t2) => 0.95 + 0.2 * Math.min(1, t2 / 1.6), Cx = /* @__PURE__ */ new Map();
function wx(e4, mask = 0) {
  const cacheKey=e4===`wallGrid` ? `${e4}:${mask}` : e4;
  let t2 = Cx.get(cacheKey);
  if (t2) return t2;
  switch (e4) {
    case `wallTriL`:
    case `wallTriR`: {
      const sh=new To();sh.moveTo(-2.5,0);sh.lineTo(2.5,0);
      sh.lineTo(e4===`wallTriR`?2.5:-2.5,4);sh.closePath();
      t2=bx([new ls(sh,{depth:lx,bevelEnabled:false}).translate(0,0,-lx/2)],Sx);break;
    }
    case `wallGrid`: {
      const boxes=[];
      for(let row=0;row<3;row++) for(let col=0;col<3;col++) if(!(mask & (1 << (row*3+col))))
        boxes.push(xx(5/3,4/3,lx,-2.5+(col+.5)*5/3,4-(row+.5)*4/3,0));
      t2=bx(boxes,Sx);break;
    }
    case `wall`:
      // Chapter 2: framed Skyfall wall — main panel + top/bottom beams + center pillar
      t2 = bx([xx(5, 4, lx, 0, 2, 0), xx(5.1, 0.32, lx + 0.1, 0, 3.84, 0), xx(5.1, 0.32, lx + 0.1, 0, 0.16, 0), xx(0.42, 4, lx + 0.08, 0, 2, 0), xx(0.3, 4, lx + 0.06, -2.35, 2, 0), xx(0.3, 4, lx + 0.06, 2.35, 2, 0)], (e6, t3, n3, r) => r === 0 ? Sx(e6, t3) : 1.18);
      break;
    case `half`:
      t2 = bx([xx(5, ux, lx, 0, ux / 2, 0)], Sx);
      break;
    case `wallDoor`: {
      let e5 = 0.8, n2 = 2.75;
      t2 = bx([xx(5 / 2 - e5, 4, lx, -3.3 / 2, 2, 0), xx(5 / 2 - e5, 4, lx, 3.3 / 2, 2, 0), xx(e5 * 2, 1.25, lx, 0, 6.75 / 2, 0), xx(0.14, n2, 0.33999999999999997, -0.8 - 0.05, n2 / 2, 0), xx(0.14, n2, 0.33999999999999997, 0.8500000000000001, n2 / 2, 0), xx(1.98, 0.16, 0.33999999999999997, 0, 2.81, 0)], (e6, t3, n3, r) => r >= 3 ? 0.55 : Sx(e6, t3));
      break;
    }
    case `wallWin`: {
      let e5 = 0.95, n2 = 1.15;
      t2 = bx([xx(5 / 2 - e5, 4, lx, -3.45 / 2, 2, 0), xx(5 / 2 - e5, 4, lx, 3.45 / 2, 2, 0), xx(e5 * 2, n2, lx, 0, n2 / 2, 0), xx(e5 * 2, 1.25, lx, 0, 6.75 / 2, 0), xx(2.1999999999999997, 0.12, 0.4, 0, 1.1199999999999999, 0), xx(2.1, 0.1, 0.32, 0, 2.78, 0), xx(0.1, 1.6, 0.32, -0.98, 3.9 / 2, 0), xx(0.1, 1.6, 0.32, 0.98, 3.9 / 2, 0), xx(0.06, 1.6, 0.06, 0, 3.9 / 2, 0), xx(e5 * 2, 0.06, 0.06, 0, 3.9 / 2, 0)], (e6, t3, n3, r) => r >= 4 ? 1.25 : Sx(e6, t3));
      break;
    }
    case `wallShop`: {
      let e5 = 5 / 2 - px;
      t2 = bx([xx(e5, 4, lx, -(5 / 2 + px) / 2, 2, 0), xx(e5, 4, lx, (5 / 2 + px) / 2, 2, 0), xx(px * 2, 4 - mx, lx, 0, (4 + mx) / 2, 0), xx(4.4, 0.5, 0.44, 0, 3.35, 0), xx(px * 2, 0.08, 0.08, 0, 2.55, 0), xx(0.1, mx, 0.36, -1.98, mx / 2, 0), xx(0.1, mx, 0.36, 1.98, mx / 2, 0), xx(e5 + 0.06, 0.4, 0.33999999999999997, -(5 / 2 + px) / 2, 0.2, 0), xx(e5 + 0.06, 0.4, 0.33999999999999997, (5 / 2 + px) / 2, 0.2, 0)], (e6, t3, n2, r) => r === 3 ? 1.22 : r >= 4 ? 0.62 : Sx(e6, t3));
      break;
    }
    case `wallWin2`: {
      let e5 = [], n2 = 5 / 2 - 1.8;
      e5.push(xx(n2, 4, lx, -2.15, 2, 0), xx(n2, 4, lx, 5 / 2 - n2 / 2, 2, 0)), e5.push(xx(1.4, 4, lx, 0, 2, 0));
      for (let t3 of [-1, 1]) e5.push(xx(_x * 2, vx, lx, t3 * gx, vx / 2, 0), xx(_x * 2, 4 - yx, lx, t3 * gx, (4 + yx) / 2, 0));
      let r = e5.length;
      for (let t3 of [-1, 1]) e5.push(xx(1.36, 0.12, 0.4, t3 * gx, 1.07, 0), xx(1.26, 0.1, 0.32, t3 * gx, 2.8299999999999996, 0)), e5.push(xx(0.09, 1.6999999999999997, 0.32, t3 * gx - _x - 0.02, 3.9 / 2, 0), xx(0.09, 1.6999999999999997, 0.32, t3 * gx + _x + 0.02, 3.9 / 2, 0)), e5.push(xx(_x * 2, 0.05, 0.05, t3 * gx, 2.154, 0));
      t2 = bx(e5, (e6, t3, n3, i) => i >= r ? 1.25 : Sx(e6, t3));
      break;
    }
    case `parapet`:
      t2 = bx([xx(5, hx, lx, 0, hx / 2, 0), xx(5.02, 0.14, 0.42, 0, 1.07, 0)], (e5, t3, n2, r) => r === 1 ? 1.2 : Sx(e5, t3 * 2));
      break;
    case `gable`: {
      let e5 = new To();
      e5.moveTo(-5 / 2, 0), e5.lineTo(5 / 2, 0), e5.lineTo(5 / 2, ux), e5.closePath(), t2 = bx([new ls(e5, { depth: lx, bevelEnabled: false }).translate(0, 0, -0.24 / 2)], () => 1);
      break;
    }
    case `floorHalf`:
      t2 = bx([xx(2.5,.42,5,-1.25,-.12,0),xx(.16,.18,5,0,.02,0)],()=>1);
      break;
    case `floor`:
      // Chapter 2: Skyfall floor — thick slab + raised edge frame
      t2 = bx([xx(5, 0.42, 5, 0, -0.12, 0), xx(5.08, 0.18, 0.34, 0, 0.02, -2.37), xx(5.08, 0.18, 0.34, 0, 0.02, 2.37), xx(0.34, 0.18, 5.08, -2.37, 0.02, 0), xx(0.34, 0.18, 5.08, 2.37, 0.02, 0)], (e6, t3, n3, r) => r === 0 ? 1 : 1.15);
      break;
    case `pad`:
      // Chapter 2: Launch Pad — base plate + glowing rim + center core
      t2 = bx([xx(5, 0.3, 5, 0, -0.06, 0), xx(5.06, 0.22, 0.3, 0, 0.14, -2.38), xx(5.06, 0.22, 0.3, 0, 0.14, 2.38), xx(0.3, 0.22, 5.06, -2.38, 0.14, 0), xx(0.3, 0.22, 5.06, 2.38, 0.14, 0), xx(2.2, 0.24, 2.2, 0, 0.16, 0)], (e6, t3, n3, r) => r === 5 ? 1.6 : r === 0 ? 1 : 1.25);
      break;
    case `stairs`: {
      // Chapter 2: Skyfall stairs — ramp + steps + chunky railings + center spine
      let e5 = Math.hypot(5, 4), n2 = -Math.atan2(4, 5), r = [new La(5, 0.22, e5).rotateX(n2).translate(0, 2 - 0.14, 0)], i = 5 / 8, a = 4 / 8;
      for (let e6 = 0; e6 < 8; e6++) r.push(xx(5, a, i, 0, (e6 + 0.5) * a, -5 / 2 + (e6 + 0.5) * i));
      r.push(new La(0.22, 0.62, e5).rotateX(n2).translate(-2.39, 2.08, 0)), r.push(new La(0.22, 0.62, e5).rotateX(n2).translate(5 / 2 - 0.11, 2.08, 0)), r.push(xx(0.5, 0.3, 5, 0, 0.15, 0)), t2 = bx(r, (e6, t3, n3, r2) => r2 === 0 ? 0.72 : r2 > 8 ? 1.1 : 0.9 + r2 % 2 * 0.1);
      break;
    }
    case `roof`: {
      // Exact 5 m by 2.5 m pitch. The old oversize panel, centre finial
      // and raised crossbeam left visible gaps and spikes on every roof.
      const length = Math.hypot(5, ux), angle = -Math.atan2(ux, 5);
      t2 = bx([new La(5.02, .18, length).rotateX(angle).translate(0, ux / 2, 0)], () => 1);
      break;
    }
    default:
      t2 = bx([new Va(5 / 2 * Math.SQRT2, dx, 4, 1).rotateY(Math.PI / 4).translate(0, dx / 2, 0)], () => 1);
  }
  return Cx.set(cacheKey, t2), t2;
}
var Tx = /* @__PURE__ */ new Map();
function Ex(e4) {
  let t2 = Tx.get(e4);
  if (!t2) {
    let n2 = rx(e4), [r, i] = { metal: [0.5, 0.3], glass: [0.22, 0.28], tile: [0.45, 0], stucco: [0.92, 0], panel: [0.8, 0] }[e4] ?? [0.88, 0];
    t2 = new Os({ map: n2.map, normalMap: n2.normalMap, vertexColors: true, roughness: r, metalness: i }), t2.normalScale.set(0.9, 0.9), Tx.set(e4, t2);
  }
  return t2;
}
var Dx = new It(), Ox = new R(), kx = new R(), Ax = new R(0, 1, 0), jx = new B(), Mx = new z();
function Nx(e4) {
  return fx[e4.shape] ? `W${e4.rot & 1}:${e4.gx}:${e4.gy}:${e4.gz}` : (e4.shape === `floor` || e4.shape === `floorHalf` || e4.shape === `pad`) ? `F:${e4.gx}:${e4.gy}:${e4.gz}` : `S:${e4.gx}:${e4.gy}:${e4.gz}`;
}
var Px = class {
  spec;
  world;
  hp = 1;
  maxHp = 1;
  mat;
  alive = true;
  label;
  yieldTotal = 0;
  cx = 0;
  cy = 0;
  cz = 0;
  index = -1;
  matrix = new z();
  color = new B();
  base = new z();
  tint = new B();
  colliders = [];
  minX = 0;
  minY = 0;
  minZ = 0;
  maxX = 0;
  maxY = 0;
  maxZ = 0;
  key;
  grounded = false;
  pop = 0;
  shake = 0;
  buildTo = 0;
  pool;
  owner = null;
  constructor(e4, t2) {
    this.spec = e4, this.world = t2, this.mat = e4.mat, this.key = Nx(e4), this.label = t2 ? `Structure` : `Build`, this.yieldTotal = t2 ? 26 : 0, this.tint.setHex(e4.tint);
  }
  damage(e4, t2, n2) {
    return Fx.damage(this, e4, t2, n2);
  }
}, Fx = new class {
  group = new Pn();
  pieces = /* @__PURE__ */ new Map();
  pools = /* @__PURE__ */ new Map();
  animating = /* @__PURE__ */ new Set();
  worldSpecs = [];
  collapseQueue = [];
  events = {};
  ghosts = /* @__PURE__ */ new Map();
  ghostMat = new bi({ color: new B(0.25, 0.75, 1.6), transparent: true, opacity: 0.32, depthWrite: false, side: 2, toneMapped: false });
  ghostLine = new da({ color: new B(0.6, 1.4, 2.4), transparent: true, opacity: 0.9, toneMapped: false });
  ghostShown = null;
  tmp = [];
  setWorldSpecs(e4) {
    this.worldSpecs = e4;
  }
  reset() {
    for (let e4 of this.pieces.values()) {
      for (let t2 of e4.colliders) Ey(t2);
      e4.alive = false;
    }
    this.pieces.clear();
    for (let e4 of this.pools.values()) e4.clear();
    this.animating.clear(), this.collapseQueue.length = 0;
    for (let e4 of this.worldSpecs) this.place(e4, true, null, true);
  }
  poolFor(e4) {
    let t2 = `${e4.shape}|${e4.tex}|${e4.mask ?? 0}`, n2 = this.pools.get(t2);
    return n2 || (n2 = new cx(wx(e4.shape, e4.mask ?? 0), Ex(e4.tex), this.group, 64), this.pools.set(t2, n2)), n2;
  }
  layout(e4) {
    let t2 = e4.spec, n2 = t2.gy * 4, r = 0, i = (t3) => {
      e4.colliders.push(t3);
    };
    if (fx[t2.shape]) {
      let a = t2.rot & 1, o = !!(t2.rot & 2);
      a === 0 ? (kx.set((t2.gx + 0.5) * 5, n2, t2.gz * 5), r = o ? Math.PI : 0) : (kx.set(t2.gx * 5, n2, (t2.gz + 0.5) * 5), r = o ? -Math.PI / 2 : Math.PI / 2);
      let s2 = (t3, r2, o2, s3) => {
        i(a === 0 ? xy(kx.x + t3, n2 + o2, kx.z - lx / 2, kx.x + r2, n2 + s3, kx.z + lx / 2, e4) : xy(kx.x - lx / 2, n2 + o2, kx.z + t3, kx.x + lx / 2, n2 + s3, kx.z + r2, e4));
      }, c = 5 / 2;
      if(t2.shape===`wallTriL` || t2.shape===`wallTriR`) {
        const sign=(t2.rot===0 || t2.rot===3)?1:-1;
        for(let col=0;col<3;col++) {
          let x0=(-2.5+col*5/3)*sign,x1=(-2.5+(col+1)*5/3)*sign;
          const height=(t2.shape===`wallTriR`?col+1:3-col)*4/3;
          s2(Math.min(x0,x1),Math.max(x0,x1),0,height);
        }
      } else if (t2.shape === `wallGrid`) {
        const sign=(t2.rot===0 || t2.rot===3)?1:-1;
        for(let row=0;row<3;row++) for(let col=0;col<3;col++) if(!((t2.mask||0)&(1<<(row*3+col)))) {
          let x0=(-2.5+col*5/3)*sign,x1=(-2.5+(col+1)*5/3)*sign;
          s2(Math.min(x0,x1),Math.max(x0,x1),4-(row+1)*4/3,4-row*4/3);
        }
      } else if (t2.shape === `wall`) s2(-2.5, c, 0, 4);
      else if (t2.shape === `half`) s2(-2.5, c, 0, ux);
      else if (t2.shape === `gable`) s2(-2.5, c, 0, ux * 0.5);
      else if (t2.shape === `wallDoor`) s2(-2.5, -0.8, 0, 4), s2(0.8, c, 0, 4), s2(-0.8, 0.8, 2.75, 4);
      else if (t2.shape === `wallShop`) s2(-2.5, -1.95, 0, 4), s2(px, c, 0, 4), s2(-1.95, px, mx, 4);
      else if (t2.shape === `parapet`) s2(-2.5, c, 0, 1.1400000000000001);
      else if (t2.shape === `wallWin2`) {
        let e5 = 0.7, t3 = 1.8;
        s2(-2.5, -1.8, 0, 4), s2(-0.7, e5, 0, 4), s2(t3, c, 0, 4), s2(-1.8, -0.7, 0, vx), s2(e5, t3, 0, vx), s2(-1.8, -0.7, yx, 4), s2(e5, t3, yx, 4);
      } else s2(-2.5, -0.95, 0, 4), s2(0.95, c, 0, 4), s2(-0.95, 0.95, 0, 1.15), s2(-0.95, 0.95, 2.75, 4);
    } else {
      let a = t2.gx * 5, o = t2.gz * 5;
      kx.set(a + 5 / 2, n2, o + 5 / 2), t2.shape === `floorHalf` ? (r=(t2.rot&3)*Math.PI/2, i((t2.rot&1) ? xy(a,n2-.24,o+((t2.rot&2)?0:2.5),a+5,n2+.06,o+((t2.rot&2)?2.5:5),e4) : xy(a+((t2.rot&2)?2.5:0),n2-.24,o,a+((t2.rot&2)?5:2.5),n2+.06,o+5,e4))) : t2.shape === `floor` || t2.shape === `pad` ? i(xy(a, n2 - 0.24, o, a + 5, n2 + 0.06, o + 5, e4)) : t2.shape === `stairs` ? (r = t2.rot * Math.PI / 2, i(Sy(a, n2, o, a + 5, n2 + 4, o + 5, t2.rot & 3, e4))) : t2.shape === `roof` ? (r = t2.rot * Math.PI / 2, i(Sy(a, n2, o, a + 5, n2 + ux, o + 5, t2.rot & 3, e4))) : i(Cy(a, n2, o, a + 5, n2 + dx, o + 5, e4));
    }
    Dx.setFromAxisAngle(Ax, r), e4.base.compose(kx, Dx, Ox.set(1, 1, 1)), e4.matrix.copy(e4.base), e4.minX = e4.minY = e4.minZ = 1 / 0, e4.maxX = e4.maxY = e4.maxZ = -1 / 0;
    for (let t3 of e4.colliders) e4.minX = Math.min(e4.minX, t3.minX), e4.minY = Math.min(e4.minY, t3.minY), e4.minZ = Math.min(e4.minZ, t3.minZ), e4.maxX = Math.max(e4.maxX, t3.maxX), e4.maxY = Math.max(e4.maxY, t3.maxY), e4.maxZ = Math.max(e4.maxZ, t3.maxZ);
    e4.cx = (e4.minX + e4.maxX) / 2, e4.cy = (e4.minY + e4.maxY) / 2, e4.cz = (e4.minZ + e4.maxZ) / 2;
  }
  touchesTerrain(e4) {
    let t2 = [e4.minX, e4.maxX, e4.cx], n2 = [e4.minZ, e4.maxZ, e4.cz];
    for (let r of t2) for (let t3 of n2) {
      let n3 = ay(r, t3);
      if (n3 >= e4.minY - 0.45 && n3 <= e4.maxY + 3) return true;
    }
    return false;
  }
  neighbours(e4, t2) {
    t2.length = 0;
    let n2 = 0.32;
    By(e4.minX - n2, e4.minY - n2, e4.minZ - n2, e4.maxX + n2, e4.maxY + n2, e4.maxZ + n2, this.tmp);
    for (let n3 of this.tmp) {
      let r = n3.owner;
      r instanceof Px && r !== e4 && r.alive && !t2.includes(r) && t2.push(r);
    }
    return t2;
  }
  canPlace(e4) {
    if (this.pieces.has(Nx(e4))) return false;
    let t2 = new Px(e4, false);
    if (this.layout(t2), t2.maxY < ay(t2.cx, t2.cz) - 0.3) return false;
    if (this.touchesTerrain(t2)) return true;
    let n2 = 0.32;
    By(t2.minX - n2, t2.minY - n2, t2.minZ - n2, t2.maxX + n2, t2.maxY + n2, t2.maxZ + n2, this.tmp);
    for (let e5 of this.tmp) if (e5.owner && e5.owner.alive) return true;
    return false;
  }
  place(e4, t2, n2, r = false) {
    let i = Nx(e4);
    if (this.pieces.has(i)) return null;
    let a = new Px(e4, t2);
    a.owner = n2, this.layout(a), a.grounded = this.touchesTerrain(a);
    let o = xp[e4.mat] * (e4.shape === `half` || e4.shape === `gable` || e4.shape === `parapet` ? 0.6 : 1);
    a.maxHp = o, r ? a.hp = o : (a.hp = o * 0.5, a.buildTo = o, a.pop = 0.28, this.animating.add(a));
    for (let e5 of a.colliders) Ty(e5);
    return a.pool = this.poolFor(e4), this.applyColor(a), a.pool.add(a), this.pieces.set(i, a), r || this.events.onPlaced?.(a), a;
  }
  applyColor(e4) {
    let t2 = 0.55 + 0.45 * (e4.hp / e4.maxHp);
    e4.color.copy(e4.tint).multiplyScalar(t2), e4.pop > 0 && e4.color.lerp(jx.setRGB(0.5, 0.95, 1.7), Math.min(1, e4.pop / 0.28) * 0.8);
  }
  damage(e4, t2, n2, r) {
    return e4.alive ? (e4.hp -= t2, e4.buildTo = 0, e4.shake = 0.16, this.animating.add(e4), this.events.onDamaged?.(e4, t2, n2, r), e4.hp <= 0 ? (this.destroy(e4, n2, false), true) : (this.applyColor(e4), e4.pool.write(e4), false)) : false;
  }
  destroy(e4, t2, n2) {
    if (!e4.alive) return;
    e4.alive = false;
    // Piece origins are stored as centre coordinates (not fighter positions).
    let debrisColor = e4.mat === `wood` ? 0x8a6a3a : e4.mat === `stone` ? 0x8a8a8a : 0x6a6a6a;
    for (let i = 0; i < 8; i++) {
      am.spark(e4.cx + K(-1, 1), e4.cy + K(-.5, .5), e4.cz + K(-1, 1), debrisColor, 1, 1.5, .1, .35);
    }
    let r = this.neighbours(e4, []);
    for (let t3 of e4.colliders) Ey(t3);
    e4.pool.remove(e4), this.pieces.delete(e4.key), this.animating.delete(e4), this.events.onDestroyed?.(e4, t2, n2);
    let i = /* @__PURE__ */ new Set();
    for (let e5 of r) {
      if (!e5.alive || i.has(e5)) continue;
      let t3 = this.component(e5, 260);
      if (t3) {
        for (let e6 of t3) i.add(e6);
        t3.some((e6) => e6.grounded) || t3.forEach((e6, t4) => this.collapseQueue.push({ p: e6, t: 0.1 + t4 * 0.035 }));
      }
    }
  }
  component(e4, t2) {
    let n2 = [e4], r = /* @__PURE__ */ new Set([e4]), i = [];
    for (let e5 = 0; e5 < n2.length; e5++) {
      if (n2[e5].grounded) return null;
      for (let a of this.neighbours(n2[e5], i)) if (!r.has(a) && (r.add(a), n2.push(a), n2.length > t2)) return null;
    }
    return n2;
  }
  edit(e4, shape = null, rotation = e4.spec.rot, mask = 0) {
    let t2 = [`wall`, `wallGrid`, `wallTriL`, `wallTriR`, `wallDoor`, `wallWin`, `half`, `floor`, `floorHalf`, `stairs`, `pyr`, `roof`], n2 = t2.indexOf(e4.spec.shape);
    if (n2 < 0 || !e4.alive || (shape && !t2.includes(shape))) return false;
    let r = { ...e4.spec, shape: shape ?? t2[(n2 + 1) % 3], rot:rotation, mask:shape===`wallGrid`?mask:undefined }, i = e4.hp, a = e4.owner, o = e4.world;
    for (let t3 of e4.colliders) Ey(t3);
    e4.pool.remove(e4), e4.alive = false, this.pieces.delete(e4.key), this.animating.delete(e4);
    let s2 = this.place(r, o, a, true);
    return s2 && (s2.hp = i, this.applyColor(s2), s2.pool.write(s2), this.events.onEdited?.(e4,s2)), s2;
  }
  pieceAt(e4) {
    return this.pieces.get(e4);
  }
  update(e4) {
    for (let t2 of this.animating) {
      let n2 = false;
      t2.pop > 0 && (t2.pop = Math.max(0, t2.pop - e4), n2 = true), t2.shake > 0 && (t2.shake = Math.max(0, t2.shake - e4), n2 = true), t2.buildTo > 0 && t2.hp < t2.buildTo ? (t2.hp = Math.min(t2.buildTo, t2.hp + t2.buildTo * e4 * 0.45), n2 = true) : t2.buildTo = 0;
      let r = t2.pop / 0.28, i = 1 - r * r * 0.22 + Math.sin(r * Math.PI) * 0.1, a = t2.shake > 0 ? Math.sin(t2.shake * 90) * t2.shake * 0.25 : 0;
      t2.matrix.copy(t2.base), (i !== 1 || a !== 0) && (Mx.makeScale(i, i, i), Mx.elements[12] = a * 0.3, Mx.elements[13] = (1 - i) * 1.2, t2.matrix.multiply(Mx)), this.applyColor(t2), t2.pool.write(t2), n2 || this.animating.delete(t2);
    }
    if (this.collapseQueue.length) for (let t2 = this.collapseQueue.length - 1; t2 >= 0; t2--) {
      let n2 = this.collapseQueue[t2];
      n2.t -= e4, n2.t <= 0 && (this.collapseQueue.splice(t2, 1), n2.p.alive && this.destroy(n2.p, null, true));
    }
  }
  showGhost(e4, t2) {
    if (this.ghostShown && (this.ghostShown.visible = false), this.ghostShown = null, !e4) return;
    let n2 = this.ghosts.get(e4.shape);
    if (!n2) {
      n2 = new Pn();
      let t3 = wx(e4.shape), r2 = new Mi(t3, this.ghostMat);
      r2.renderOrder = 20;
      let i = new Ca(new qa(t3, 25), this.ghostLine);
      i.renderOrder = 21, n2.add(r2, i), n2.matrixAutoUpdate = false, this.group.add(n2), this.ghosts.set(e4.shape, n2);
    }
    let r = new Px(e4, false);
    this.layout(r), n2.matrix.copy(r.base), n2.matrixWorldNeedsUpdate = true, n2.visible = true, this.ghostMat.color.setRGB(t2 ? 0.25 : 1.6, t2 ? 0.75 : 0.2, t2 ? 1.6 : 0.2), this.ghostLine.color.setRGB(t2 ? 0.6 : 2.2, t2 ? 1.4 : 0.4, t2 ? 2.4 : 0.4), this.ghostShown = n2;
  }
}(), Ix = { wood: { tex: `planks`, tint: 16777215 }, stone: { tex: `brick`, tint: 16777215 }, metal: { tex: `metal`, tint: 16777215 } };
function Lx(e4, t2, n2, r, i, a, o, s2 = -1) {
  let c = Math.sin(i), l2 = Math.cos(i), u = Ix[o], d = Math.floor((n2 + 0.7) / 4), f = Math.abs(c) > Math.abs(l2) ? c > 0 ? 1 : 3 : l2 > 0 ? 0 : 2, p = { tex: u.tex, tint: u.tint, mat: o };
  if (e4 === `wall`) {
    let e5 = 2.9, n3 = t2 + c * e5, i2 = r + l2 * e5, o2 = d + (a > 0.6 ? 1 : a < -0.85 ? -1 : 0);
    if (Math.abs(c) > Math.abs(l2)) {
      let e6 = Math.round(n3 / 5);
      return Math.abs(e6 * 5 - t2) < 0.45 && (e6 += c > 0 ? 1 : -1), { shape: `wall`, gx: e6, gy: o2, gz: Math.floor(r / 5 + l2 * 0.35), rot: 1, ...p };
    }
    let s3 = Math.round(i2 / 5);
    return Math.abs(s3 * 5 - r) < 0.45 && (s3 += l2 > 0 ? 1 : -1), { shape: `wall`, gx: Math.floor(t2 / 5 + c * 0.35), gy: o2, gz: s3, rot: 0, ...p };
  }
  let m = a < -0.9 ? 0.6 : 2.7, h = Math.floor((t2 + c * m) / 5), g2 = Math.floor((r + l2 * m) / 5);
  if (e4 === `floor` || e4 === `pad`) {
    let e5;
    return a > 0.3 ? e5 = Math.ceil((n2 + 0.9) / 4) : (e5 = Math.floor((n2 + 0.9) / 4), ay((h + 0.5) * 5, (g2 + 0.5) * 5) > e5 * 4 + 0.6 && (e5 += 1)), { shape: e4, gx: h, gy: e5, gz: g2, rot: 0, ...p };
  }
  let _2 = Math.floor((n2 + 0.35) / 4) + +(a > 0.75);
  return e4 === `stairs` ? { shape: `stairs`, gx: h, gy: _2, gz: g2, rot: s2 >= 0 ? s2 : f, ...p } : { shape: `pyr`, gx: h, gy: _2, gz: g2, rot: 0, ...p };
}
var Rx = [[`ar`, 22], [`smg`, 16], [`pump`, 18], [`pistol`, 12], [`sniper`, 11], [`rpg`, 5], [`tac`, 13], [`burst`, 13], [`grenade`, 10], [`pulse`, 15], [`sky`, 14], [`smoke`, 8], [`stink`, 7], [`shock`, 7], [`bounce`, 8]], zx = [[`ar`, 24], [`burst`, 20], [`pump`, 18], [`tac`, 10], [`sniper`, 14], [`rpg`, 10], [`smg`, 6], [`pulse`, 12], [`sky`, 12], [`smoke`, 6], [`stink`, 5], [`shock`, 5], [`bounce`, 6]], Bx = 95, Vx = 4.2;
function Hx(e4) {
  return Ih[e4].thrown ? 3 : Ih[e4].mag;
}
function Ux() {
  return xv();
}
var Wx = [40, 30, 18, 9, 3, 1];
function Gx(e4) {
  let t2 = Wx.map((t3, n3) => t3 * 1.5 ** (e4 * (n3 - 1.5))), n2 = Math.random() * t2.reduce((e5, t3) => e5 + t3, 0);
  for (let e5 = 0; e5 < 6; e5++) if (n2 -= t2[e5], n2 <= 0) return e5;
  return 0;
}
function Kx(e4 = 0) {
  let t2 = Math.random() * Rx.reduce((e5, t3) => e5 + t3[1], 0), n2 = `ar`;
  for (let [e5, r2] of Rx) if (t2 -= r2, t2 <= 0) {
    n2 = e5;
    break;
  }
  let r = Ih[n2];
  return { id: n2, rarity: Math.min(r.maxRarity, Math.max(r.minRarity, Gx(e4))) };
}
function qx() {
  let e4 = Math.random() * zx.reduce((e5, t3) => e5 + t3[1], 0), t2 = `ar`;
  for (let [n2, r] of zx) if (e4 -= r, e4 <= 0) {
    t2 = n2;
    break;
  }
  return { id: t2, rarity: Cp(Pp(0.42) ? 4 : 3, Ih[t2].minRarity, Ih[t2].maxRarity) };
}
function Jx() {
  let e4 = Math.random();
  return e4 < 0.26 ? `mini` : e4 < 0.44 ? `big` : e4 < 0.62 ? `bandage` : e4 < 0.72 ? `medkit` : e4 < 0.82 ? `chug` : e4 < 0.9 ? `launchpad` : e4 < 0.94 ? `spiketrap` : e4 < 0.97 ? `riftbeacon` : `fortress`;
}
var Yx = new R(), Xx = new class {
  group = new Pn();
  items = [];
  boxes = [];
  glowTex;
  discGeo = new ms(1, 1).rotateX(-Math.PI / 2);
  discMats = [];
  pillarGeo = new ms(1, 1).translate(0, 0.5, 0);
  goldMat;
  sparkT = 0;
  init() {
    this.glowTex = sx(128, 2.2);
    for (let e4 = 0; e4 < Fh.length; e4++) {
      let t2 = new bi({ map: this.glowTex, transparent: true, depthWrite: false, blending: 2, toneMapped: false, side: 2 });
      t2.color.setHex(Fh[e4]).multiplyScalar(e4 === 0 ? 0.9 : 1.7), this.discMats.push(t2);
    }
    this.goldMat = new bi({ map: this.glowTex, transparent: true, depthWrite: false, blending: 2, toneMapped: false, side: 2 }), this.goldMat.color.setRGB(2.4, 1.7, 0.5);
  }
  reset(e4, t2, n2, r) {
    for (let e5 of this.items) this.group.remove(e5.root);
    this.items.length = 0;
    for (let e5 of this.boxes) this.group.remove(e5.root), e5.flare?.stop();
    this.boxes.length = 0;
    for (let t3 of e4) this.addBox(`chest`, t3);
    for (let e5 of t2) this.addBox(`ammo`, e5);
    for (let e5 of n2) this.addBox(`llama`, e5);
    for (let e5 of r) this.spawnFloor(e5.x, e5.y, e5.z);
  }
  addBox(e4, t2) {
    let n2, r = null, i = null, a = null;
    if (e4 === `chest`) {
      let e5 = iv();
      n2 = e5.root, r = e5.lid, i = e5.glow, a = new Mi(this.discGeo, this.goldMat), a.scale.setScalar(3.2), a.position.y = 0.06, a.renderOrder = 8, n2.add(a);
    } else if (e4 === `ammo`) {
      let e5 = lv();
      n2 = e5.root, r = e5.lid;
    } else n2 = Gv();
    n2.position.set(t2.x, t2.y, t2.z), n2.rotation.y = t2.rot, this.group.add(n2);
    let o = { kind: e4, pos: new R(t2.x, t2.y, t2.z), opened: false, lidT: 0, root: n2, lid: r, glow: i, halo: a };
    return this.boxes.push(o), o;
  }
  spawn(e4, t2, n2, r, i, a, o, s2 = true, c = null) {
    let l2 = new Pn(), u, d = 1.5;
    e4 === `weapon` ? u = m_(t2, n2) : e4 === `consumable` ? (u = z_(t2), d = 2) : e4 === `ammo` ? (u = H_(t2), d = 1.25) : (u = W_(t2), d = 1.1);
    let f = new Pn();
    u.scale.setScalar(d), u.traverse((e5) => {
      e5.isMesh && (e5.castShadow = false);
    }), e4 === `weapon` && (u.rotation.set(0, 0, 0.35), u.position.set(0, 0, -0.25 * d)), f.add(u), f.position.y = e4 === `weapon` || e4 === `consumable` ? 0.62 : 0.12;
    let p = new Mi(this.discGeo, this.discMats[n2]);
    if (p.scale.setScalar(e4 === `weapon` ? 2.3 : 1.5), p.position.y = 0.05, p.renderOrder = 8, l2.add(f, p), n2 >= 3 && e4 === `weapon`) for (let e5 = 0; e5 < 2; e5++) {
      let t3 = new Mi(this.pillarGeo, this.discMats[n2]);
      t3.scale.set(0.7, 5, 1), t3.rotation.y = e5 * Math.PI / 2, t3.renderOrder = 8, l2.add(t3);
    }
    l2.position.set(i, a, o), this.group.add(l2);
    let m = { kind: e4, id: t2, rarity: n2, count: r, pos: new R(i, a, o), rest: !s2, root: l2, spin: f, age: Math.random() * 6, lock: c, lockT: c ? 1.6 : 0, vel: s2 ? new R(K(-1, 1), 0, K(-1, 1)).normalize().multiplyScalar(K(1.6, 3.4)).setY(K(4.5, 6.5)) : new R() };
    return this.items.push(m), m;
  }
  spawnFloor(e4, t2, n2) {
    let r = Math.random();
    if (r < 0.55) {
      let r2 = Kx(0);
      this.spawn(`weapon`, r2.id, r2.rarity, Hx(r2.id), e4, t2, n2, false);
      let i = Ih[r2.id].ammo;
      Ih[r2.id].thrown || this.spawn(`ammo`, i, 0, Bh[i], e4 + 0.9, t2, n2 + 0.4, false);
    } else if (r < 0.8) {
      let r2 = Jx();
      this.spawn(`consumable`, r2, Lh[r2].rarity, r2 === `bandage` ? 5 : r2 === `mini` ? 2 : r2 === `chug` ? 2 : 1, e4, t2, n2, false);
    } else {
      let r2 = Np([`light`, `medium`, `shells`, `heavy`]);
      this.spawn(`ammo`, r2, 0, Bh[r2] * 2, e4, t2, n2, false);
    }
  }
  open(e4, t2) {
    if (e4.opened || e4.falling) return;
    e4.opened = true;
    let { x: n2, y: r, z: i } = e4.pos, a = r + 0.7;
    if (e4.kind === `chest`) {
      e4.glow && (e4.glow.visible = true), e4.halo && (e4.halo.visible = false);
      let t3 = Kx(1);
      this.spawn(`weapon`, t3.id, t3.rarity, Hx(t3.id), n2, a, i);
      let o = Ih[t3.id].ammo;
      if (Ih[t3.id].thrown || this.spawn(`ammo`, o, 0, Bh[o] * 2, n2, a, i), Pp(0.7)) {
        let e5 = Jx();
        this.spawn(`consumable`, e5, Lh[e5].rarity, e5 === `bandage` ? 5 : e5 === `mini` ? 2 : e5 === `chug` ? 2 : 1, n2, a, i);
      }
      if (Pp(0.18)) {
        let e5 = Kx(0);
        this.spawn(`weapon`, e5.id, e5.rarity, Hx(e5.id), n2, a, i);
      }
      this.spawn(`mats`, Np([`wood`, `stone`, `metal`]), 0, 30, n2, a, i), W.play(`chest_open`, { x: n2, y: r, z: i }), am.spark(n2, a, i, 16766554, 26, 6, 0.2, 0.8, 5, 3), am.flash(n2, a, i, 16763989, 26, 0.5);
    } else if (e4.kind === `ammo`) {
      let e5 = Mp(2, 3);
      for (let t3 = 0; t3 < e5; t3++) {
        let e6 = Np([`light`, `medium`, `shells`, `heavy`, `medium`, `light`]);
        this.spawn(`ammo`, e6, 0, Bh[e6] * 2, n2, a, i);
      }
      Pp(0.12) && this.spawn(`ammo`, `rockets`, 0, 2, n2, a, i), W.play(`ammo`, { x: n2, y: r, z: i });
    } else if (e4.kind === `supply`) {
      let t3 = r + 1.1;
      for (let e5 = 0; e5 < 2; e5++) {
        let e6 = qx();
        this.spawn(`weapon`, e6.id, e6.rarity, Hx(e6.id), n2, t3 + 0.4, i);
        let r2 = Ih[e6.id].ammo;
        this.spawn(`ammo`, r2, 0, Bh[r2] * 3, n2, t3, i);
      }
      this.spawn(`consumable`, `big`, 2, 3, n2, t3, i), Pp(0.5) && this.spawn(`weapon`, `grenade`, 1, 3, n2, t3, i);
      for (let e5 of [`wood`, `stone`, `metal`]) this.spawn(`mats`, e5, 0, 100, n2, t3, i);
      e4.halo && (e4.halo.visible = false), am.spark(n2, t3, i, 5944575, 30, 6.5, 0.2, 0.8, 5, 3), am.flash(n2, t3, i, 6728447, 30, 0.5), am.confetti(n2, r + 1.4, i, 50), W.play(`chest_open`, { x: n2, y: r, z: i, pitch: 0.85 });
    } else {
      for (let e5 = 0; e5 < 2; e5++) {
        let e6 = Kx(3);
        this.spawn(`weapon`, e6.id, e6.rarity, Hx(e6.id), n2, a + 0.6, i);
      }
      this.spawn(`consumable`, `big`, 2, 2, n2, a, i), this.spawn(`consumable`, `medkit`, 1, 2, n2, a, i), this.spawn(`consumable`, `mini`, 1, 4, n2, a, i);
      for (let e5 of [`light`, `medium`, `shells`, `heavy`, `rockets`]) this.spawn(`ammo`, e5, 0, Bh[e5] * 4, n2, a, i);
      for (let e5 of [`wood`, `stone`, `metal`]) this.spawn(`mats`, e5, 0, 200, n2, a, i);
      e4.root.visible = false, am.confetti(n2, r + 1, i, 90), am.puff(n2, r + 1, i, 13081855, 12, 1.4, 0.9, 2.2, 1.4, 0.6), W.play(`chest_open`, { x: n2, y: r, z: i, pitch: 0.8 });
    }
  }
  label(e4) {
    return e4.kind === `ammo` ? `${Rh[e4.id]} x${e4.count}` : e4.kind === `mats` ? `${Vh[e4.id]} x${e4.count}` : e4.kind === `weapon` && Ih[e4.id]?.thrown ? `${Gh(e4.id)} x${e4.count}` : Gh(e4.id);
  }
  remove(e4) {
    let t2 = this.items.indexOf(e4);
    t2 >= 0 && (this.items[t2] = this.items[this.items.length - 1], this.items.pop()), this.group.remove(e4.root);
  }
  pickup(e4, t2, n2) {
    if (t2.kind === `ammo`) e4.ammo[t2.id] = Math.min(999, e4.ammo[t2.id] + t2.count);
    else if (t2.kind === `mats`) e4.addMat(t2.id, t2.count);
    else {
      let r = e4.give(t2.id, t2.rarity, t2.count);
      if (r < 0) {
        if (!n2) return false;
        let i = e4.active >= 0 ? e4.active : 0;
        if (this.dropSlot(e4, i), r = e4.give(t2.id, t2.rarity, t2.count), r < 0) return false;
      }
      (e4.active < 0 || e4.active === r || !e4.current) && (Uh(t2.id) || e4.active === r) && e4.select(r), e4.refreshHeld();
    }
    return this.remove(t2), true;
  }
  dropSlot(e4, t2) {
    let n2 = e4.slots[t2];
    if (!n2) return;
    e4.slots[t2] = null;
    let r = Math.sin(e4.yaw), i = Math.cos(e4.yaw);
    this.spawn(Uh(n2.id) ? `weapon` : `consumable`, n2.id, n2.rarity, n2.count, e4.pos.x + r * 0.6, e4.pos.y + 1.1, e4.pos.z + i * 0.6, true, e4).vel.set(r * 3.2, 3.5, i * 3.2), e4.active === t2 && (e4.reloadT = 0, e4.useT = 0), e4.refreshHeld();
  }
  dropAll(e4) {
    let { x: t2, y: n2, z: r } = e4.pos;
    for (let i = 0; i < 5; i++) {
      let a = e4.slots[i];
      a && this.spawn(Uh(a.id) ? `weapon` : `consumable`, a.id, a.rarity, a.count, t2, n2 + 1, r), e4.slots[i] = null;
    }
    for (let i of Object.keys(e4.ammo)) e4.ammo[i] > 0 && (this.spawn(`ammo`, i, 0, e4.ammo[i], t2, n2 + 1, r), e4.ammo[i] = 0);
    for (let i of Object.keys(e4.mats)) e4.mats[i] > 0 && (this.spawn(`mats`, i, 0, e4.mats[i], t2, n2 + 1, r), e4.mats[i] = 0);
  }
  nearest(e4, t2 = 2.6) {
    let n2 = null, r = t2, i = e4.pos.x, a = e4.pos.y + 0.9, o = e4.pos.z;
    for (let e5 of this.boxes) {
      if (e5.opened || e5.falling) continue;
      let t3 = e5.kind === `supply` ? 0.9 : 0.4, s2 = Math.hypot(e5.pos.x - i, e5.pos.y + 0.4 - a, e5.pos.z - o);
      s2 < r + t3 && (r = s2 - t3, n2 = { type: `box`, box: e5, dist: s2 });
    }
    for (let e5 of this.items) {
      if (e5.kind === `ammo` || e5.kind === `mats`) continue;
      let t3 = Math.hypot(e5.pos.x - i, e5.pos.y + 0.5 - a, e5.pos.z - o);
      t3 < r && (r = t3, n2 = { type: `item`, item: e5, dist: t3 });
    }
    return n2;
  }
  autoPickup(e4, t2) {
    t2.length = 0;
    let n2 = e4.pos.x, r = e4.pos.y, i = e4.pos.z;
    for (let a = this.items.length - 1; a >= 0; a--) {
      let o = this.items[a];
      if (o.lock === e4 && o.lockT > 0) continue;
      let s2 = o.pos.x - n2, c = o.pos.z - i, l2 = o.pos.y - r;
      s2 * s2 + c * c > 2.6 || l2 > 2.2 || l2 < -1.6 || this.pickup(e4, o, false) && t2.push(o);
    }
    return t2;
  }
  update(e4, t2, n2) {
    for (let n3 of this.items) {
      if (n3.age += e4, n3.lockT > 0 && (n3.lockT -= e4), !n3.rest) {
        n3.vel.y -= 20 * e4, n3.pos.addScaledVector(n3.vel, e4);
        let t3 = Math.max(Oy(n3.pos.x, n3.pos.z, n3.pos.y + 0.3), -0.4);
        n3.pos.y <= t3 && n3.vel.y <= 0 && (n3.pos.y = t3, n3.rest = true, n3.vel.set(0, 0, 0)), n3.root.position.copy(n3.pos);
      }
      let r2 = n3.pos.x - t2.x, i2 = n3.pos.z - t2.z, a = r2 * r2 + i2 * i2 < 12100;
      n3.root.visible = a, a && (n3.spin.rotation.y = n3.age * 1.3, (n3.kind === `weapon` || n3.kind === `consumable`) && (n3.spin.position.y = 0.62 + Math.sin(n3.age * 2.2) * 0.07));
    }
    let r = 0;
    this.sparkT -= e4;
    let i = this.sparkT <= 0;
    i && (this.sparkT = 0.09);
    for (let a of this.boxes) {
      let o = Yx.copy(a.pos).sub(t2).length();
      if (a.kind === `supply` && this.updateSupply(a, e4, o, i), a.root.visible = o < (a.kind === `supply` ? 700 : a.kind === `ammo` ? 110 : 180) && !(a.kind === `llama` && a.opened), a.opened) {
        if (a.lid && a.lidT < 1) {
          a.lidT = Math.min(1, a.lidT + e4 * 3.2);
          let t3 = 1 - (1 - a.lidT) * (1 - a.lidT);
          a.lid.rotation.x = -1.85 * t3;
        }
      } else a.kind === `chest` ? (a.halo && a.halo.scale.setScalar(3 + Math.sin(n2 * 3 + a.pos.x) * 0.45), o < 32 && (r = Math.max(r, 1 - o / 32), i && o < 26 && Math.random() < 0.5 && am.sparkle(a.pos.x, a.pos.y + 0.5, a.pos.z))) : a.kind === `llama` && (a.root.rotation.y += e4 * 0.2, i && o < 40 && Math.random() < 0.3 && am.sparkle(a.pos.x, a.pos.y + 1, a.pos.z, 14130431));
    }
    W.setLoop(`chest`, G.phase === `play` ? r * r : 0);
  }
  spawnSupply(e4, t2) {
    let n2 = Oy(e4, t2, 400), r = Ux(), i = new Mi(this.discGeo, this.discMats[2]);
    i.scale.setScalar(3.6), i.position.y = 0.06, i.renderOrder = 8, i.visible = false, r.root.add(i), r.root.position.set(e4, n2 + Bx, t2), r.root.rotation.y = K(0, Math.PI * 2), this.group.add(r.root);
    let a = { kind: `supply`, pos: new R(e4, n2 + Bx, t2), opened: false, lidT: 0, root: r.root, lid: r.lid, glow: null, halo: i, falling: true, balloon: r.balloon, age: 0 };
    return this.boxes.push(a), a;
  }
  supplies(e4 = []) {
    e4.length = 0;
    for (let t2 of this.boxes) t2.kind === `supply` && !t2.opened && e4.push(t2);
    return e4;
  }
  updateSupply(e4, t2, n2, r) {
    e4.age = (e4.age ?? 0) + t2;
    let i = e4.age;
    if (e4.falling) {
      let n3 = Math.max(Oy(e4.pos.x, e4.pos.z, e4.pos.y), -0.5);
      e4.pos.y = Math.max(n3, e4.pos.y - Vx * t2), e4.root.position.copy(e4.pos), e4.root.rotation.z = Math.sin(i * 0.9) * 0.05, e4.root.rotation.x = Math.cos(i * 0.7) * 0.04, e4.pos.y <= n3 + 1e-3 && (e4.falling = false, e4.root.rotation.x = e4.root.rotation.z = 0, e4.balloon && (e4.balloon.visible = false, am.puff(e4.pos.x, e4.pos.y + 5.6, e4.pos.z, 16738890, 10, 1.4, 0.8, 2.2, 0.6, 0.6), am.confetti(e4.pos.x, e4.pos.y + 5.6, e4.pos.z, 40)), e4.halo && (e4.halo.visible = true), am.dust(e4.pos.x, e4.pos.y, e4.pos.z, 8), e4.flare = am.flare(e4.pos.x, e4.pos.y + 0.4, e4.pos.z, 4186367, 1 / 0), W.play(`land`, { x: e4.pos.x, y: e4.pos.y, z: e4.pos.z, volume: 1, pitch: 0.6 }));
    } else e4.opened ? e4.flare &&= (e4.flare.stop(), void 0) : e4.halo && e4.halo.scale.setScalar(3.4 + Math.sin(i * 3) * 0.4);
    e4.falling && r && n2 < 220 && Math.random() < 0.55 && am.puff(e4.pos.x + K(-0.3, 0.3), e4.pos.y + (e4.falling ? 0.2 : 1.2), e4.pos.z + K(-0.3, 0.3), 4892927, 1, 0.9, 2.2, 0.4, 2.4, 0.45);
  }
}(), Zx = { easy: { sigma: 6.6, react: 1.2, view: 50, burst: 0.7, build: 0.32, bstep: 0.55, nade: 0, move: 0.55, swap: 0.4, box: false, rush: false, healAt: 110 }, normal: { sigma: 3.9, react: 0.75, view: 68, burst: 1, build: 0.85, bstep: 0.22, nade: 0.55, move: 1, swap: 0.12, box: true, rush: true, healAt: 165 }, hard: { sigma: 2.3, react: 0.42, view: 88, burst: 1.3, build: 1.25, bstep: 0.1, nade: 1, move: 1.35, swap: 0.03, box: true, rush: true, healAt: 185 } }, Qx = { aggro: { build: 0.8, brave: 1, hot: 0.85, quiet: 0.06, hear: 1.45, sight: 1.15, grace: [2.5, 5], early: 4, matWant: 120, flee: 30, lootMul: 0.9 }, builder: { build: 1.3, brave: 0.75, hot: 0.5, quiet: 0.14, hear: 1.1, sight: 1, grace: [4, 8], early: 12, matWant: 300, flee: 45, lootMul: 1 }, looter: { build: 0.6, brave: 0.35, hot: 0.1, quiet: 0.42, hear: 0.6, sight: 0.75, grace: [8, 14], early: 26, matWant: 150, flee: 65, lootMul: 1.4 }, sniper: { build: 0.75, brave: 0.5, hot: 0.3, quiet: 0.28, hear: 0.85, sight: 1.55, grace: [6, 11], early: 20, matWant: 150, flee: 50, lootMul: 1.1 } }, $x = [`sg`, `ar`, `smg`, `pistol`, `snp`, `expl`, `nade`], eS = { pump: `sg`, tac: `sg`, ar: `ar`, burst: `ar`, smg: `smg`, pistol: `pistol`, sniper: `snp`, rpg: `expl`, grenade: `nade` }, tS = { sg: 10, ar: 10, smg: 6.5, pistol: 3, snp: 6, expl: 7, nade: 5 }, nS = { sg: 5, ar: 26, smg: 12, pistol: 15, snp: 60, expl: 28, nade: 15 }, rS = new Float32Array($x.length), iS = new Float32Array($x.length), aS = { sg: 0, ar: 1, smg: 2, pistol: 3, snp: 4, expl: 5, nade: 6 };
function oS(e4, t2) {
  switch (e4) {
    case `sg`:
      return t2 < 7 ? 10 : t2 < 12 ? 7 : t2 < 18 ? 3 : 0.5;
    case `smg`:
      return t2 < 18 ? 7.5 : t2 < 35 ? 5 : 2;
    case `ar`:
      return t2 < 7 ? 4 : t2 < 15 ? 7 : t2 < 70 ? 9 : 6.5;
    case `pistol`:
      return t2 < 25 ? 4 : 2;
    case `snp`:
      return t2 < 18 ? 0.5 : t2 < 40 ? 5 : 11;
    case `expl`:
      return t2 < 9 ? -6 : t2 < 60 ? 4.5 : 2;
    default:
      return -9;
  }
}
var sS = /* @__PURE__ */ new Set([`salty`, `retail`, `pleasant`]), cS = [0, 1, 0, -1], lS = [1, 0, -1, 0], uS = 7.5, dS = [0.45, -0.45, 0.9, -0.9, 1.35, -1.35, 1.8, -1.8], fS = 3.8, pS = 19.2, mS = 135, hS = [], gS = jy(), _S = { x: 0, y: 0, z: 0 }, vS = { id: `ar`, rarity: 0, count: 0 }, yS = { gain: 0, drop: -1 }, bS = (e4) => Math.floor(e4 / 5), xS = (e4) => Math.floor((e4 + 1.2) / 4), SS = (e4) => Math.floor((e4 + 0.35) / 4), CS = (e4, t2) => Math.abs(e4) > Math.abs(t2) ? e4 > 0 ? 1 : 3 : t2 > 0 ? 0 : 2;
function wS(e4, t2, n2, r, i) {
  switch (e4) {
    case 0:
      return n2 - i * 5;
    case 1:
      return t2 - r * 5;
    case 2:
      return (i + 1) * 5 - n2;
    default:
      return (r + 1) * 5 - t2;
  }
}
function TS(e4, t2, n2, r, i, a, o, s2) {
  let c = r - e4, l2 = a - n2, u = Math.hypot(c, l2), d = i - t2;
  if (u < 0.5) return false;
  let f = 331776 - 27 * (27 * u * u + 2 * d * 576);
  if (f < 0) return false;
  let p = Math.atan((576 + (o ? 1 : -1) * Math.sqrt(f)) / (27 * u)), m = Math.cos(p);
  return s2.x = c / u * m, s2.y = Math.sin(p), s2.z = l2 / u * m, true;
}
function ES(e4) {
  return e4 < 24 ? 1 : e4 < 60 ? Tp(1, 0.67, (e4 - 24) / 36) : e4 < 210 ? 0.67 * (0.23 / 0.67) ** ((e4 - 60) / 150) : 0.23 * Math.max(0, 1 - (e4 - 210) / 245) ** 1.5;
}
var DS = -1, OS = 1;
function kS() {
  return DS >= 0 && Math.abs(G.time - DS) < 0.5 || (DS = G.time, OS = G.alive / Math.max(1.5, G.fighters.length * ES(G.time))), OS;
}
function AS() {
  return Cp(Tp(11, 24, wp((G.time - 25) / 40)) + (kS() - 1) * 75, 7, 72);
}
function jS() {
  let e4 = kS();
  return Cp(65 * e4 * e4, 22, 175);
}
var MS = [], NS = /* @__PURE__ */ new Map(), PS = -99;
function FS() {
  if (G.time < PS && (MS.length = 0, NS.clear(), PS = -99), G.time - PS < 0.6) return;
  let e4 = PS;
  PS = G.time;
  for (let t2 of G.fighters) {
    if (!t2.alive || t2.mode === `bus`) continue;
    let n2 = NS.get(t2.id);
    if (NS.set(t2.id, t2.shots), !(n2 !== void 0 && t2.shots > n2 || t2.lastHurtTime > e4 && t2.lastHurtBy !== null)) continue;
    let r = false;
    for (let e5 of MS) if (Math.abs(e5.x - t2.pos.x) < 18 && Math.abs(e5.z - t2.pos.z) < 18) {
      e5.x = t2.pos.x, e5.y = t2.pos.y, e5.z = t2.pos.z, e5.t = G.time, r = true;
      break;
    }
    r || (MS.length >= 24 && MS.shift(), MS.push({ x: t2.pos.x, y: t2.pos.y, z: t2.pos.z, t: G.time }));
  }
  for (let e5 = MS.length - 1; e5 >= 0; e5--) G.time - MS[e5].t > 8 && MS.splice(e5, 1);
}
var IS = /* @__PURE__ */ new WeakMap(), LS = /* @__PURE__ */ new WeakMap(), RS = /* @__PURE__ */ new Map(), zS = 1 / 0;
function BS(e4) {
  let t2 = IS.get(e4);
  return t2 === void 0 && (t2 = Oy(e4.pos.x, e4.pos.z, 400), IS.set(e4, t2)), t2;
}
var VS = { wallDoor: true, wallShop: true }, HS = 0, US = 1, WS = 2, GS = 6, KS = 2500, qS = 9e3, JS = 0, YS = -99, XS = { plans: 0, found: 0, expanded: 0 }, ZS = (e4, t2, n2, r) => ((e4 + 200) * 400 + (n2 + 200)) * 64 + (t2 + 16) << 1 | r, QS = { cx: 0, lv: 0, cz: 0 };
function $S(e4) {
  let t2 = Math.floor((e4 >>> 1) / 64), n2 = t2 % 400;
  QS.lv = (e4 >>> 1) - t2 * 64 - 16, QS.cz = n2 - 200, QS.cx = (t2 - n2) / 400 - 200;
}
var eC = [], tC = [], nC = /* @__PURE__ */ new Map(), rC = /* @__PURE__ */ new Map(), iC = /* @__PURE__ */ new Map(), aC = /* @__PURE__ */ new Set(), oC = [];
function sC(e4, t2) {
  let n2 = eC.length;
  for (eC.push(e4), tC.push(t2); n2 > 0; ) {
    let e5 = n2 - 1 >> 1;
    if (tC[e5] <= t2) break;
    eC[n2] = eC[e5], tC[n2] = tC[e5], n2 = e5;
  }
  eC[n2] = e4, tC[n2] = t2;
}
function cC() {
  let e4 = eC[0], t2 = eC.pop(), n2 = tC.pop(), r = eC.length;
  if (r) {
    let e5 = 0;
    for (; ; ) {
      let t3 = 2 * e5 + 1;
      if (t3 >= r || (t3 + 1 < r && tC[t3 + 1] < tC[t3] && t3++, tC[t3] >= n2)) break;
      eC[e5] = eC[t3], tC[e5] = tC[t3], e5 = t3;
    }
    eC[e5] = t2, tC[e5] = n2;
  }
  return e4;
}
var lC = { parapet: true, gable: true };
function uC(e4, t2, n2, r, i = false) {
  let a = Fx.pieceAt(`W${e4}:${t2}:${n2}:${r}`);
  return !a || !a.alive || VS[a.spec.shape] || i && lC[a.spec.shape] ? 0 : a.owner ? 1 : 2;
}
function dC(e4, t2, n2, r, i = false) {
  switch (n2) {
    case 0:
      return uC(0, e4, r, t2 + 1, i);
    case 1:
      return uC(1, e4 + 1, r, t2, i);
    case 2:
      return uC(0, e4, r, t2, i);
    default:
      return uC(1, e4, r, t2, i);
  }
}
function fC(e4, t2, n2, r, i = false) {
  let a = Math.floor((r + 0.5) / 4), o = Math.floor((r + 1.7) / 4), s2 = dC(e4, t2, n2, a, i);
  return s2 === 2 || o === a ? s2 : Math.max(s2, dC(e4, t2, n2, o, i));
}
var pC = 3;
function mC(e4, t2, n2) {
  let r = Fx.pieceAt(`S:${e4}:${t2}:${n2}`);
  return r && r.alive && r.spec.shape === `stairs` ? r.spec.rot & 3 : -1;
}
function hC(e4, t2, n2) {
  let r = Fx.pieceAt(`F:${e4}:${t2}:${n2}`);
  return !!r && r.alive;
}
function gC(e4, t2, n2) {
  let r = Math.round(t2 / 4);
  return Math.abs(t2 - r * 4) < 0.6 && hC(bS(e4), r, bS(n2));
}
function _C(e4, t2, n2) {
  if (gC(e4, t2, n2)) return true;
  let r = Math.floor(t2 / 4), i = bS(e4), a = bS(n2);
  return mC(i, r, a) >= 0 || t2 - r * 4 < 0.4 && mC(i, r - 1, a) >= 0;
}
function vC(e4, t2, n2, r) {
  return e4 === HS || e4 === GS ? n2 * 4 + 0.06 : e4 === US ? ay((t2 + 0.5) * 5, (r + 0.5) * 5) : n2 * 4 + 2;
}
function yC(e4, t2, n2, r, i, a, o, s2) {
  if ((G.time - YS > 0.25 || G.time < YS) && (JS = qS, YS = G.time), JS < 250) return -1;
  XS.plans++;
  let c = bS(e4), l2 = bS(n2), u = Math.floor(t2 / 4), d = -1, f = mC(c, u, l2);
  if (f < 0 && t2 - u * 4 < 0.4 && (f = mC(c, u - 1, l2), f >= 0 && u--), f >= 0 && t2 - u * 4 < 0.35 && u * 4 + wS(f, e4, n2, c, l2) * (4 / 5) - t2 > 0.8 && hC(c, u, l2)) d = GS;
  else if (f >= 0) d = WS + f;
  else if (gC(e4, t2, n2)) u = Math.round(t2 / 4), d = HS;
  else {
    let r2 = ay(e4, n2);
    if (Math.abs(r2 - t2) > 1.2) return 0;
    u = Math.round(ay((c + 0.5) * 5, (l2 + 0.5) * 5) / 4), d = US;
  }
  let p = bS(r), m = bS(a), h = Math.round(i / 4), g2 = Math.min(c, p) - 9, _2 = Math.max(c, p) + 9, v = Math.min(l2, m) - 9, y = Math.max(l2, m) + 9, b = (e5, t3, n3) => (Math.abs(e5 - p) + Math.abs(n3 - m) + Math.abs(t3 - h) * 0.8) * 1.15;
  eC.length = 0, tC.length = 0, nC.clear(), rC.clear(), iC.clear(), aC.clear();
  let x = ZS(c, u, l2, +(d === GS));
  nC.set(x, 0), iC.set(x, d), sC(x, b(c, u, l2));
  let S = -1, C = 0, w = 0, T2 = 0, E = (e5, t3, n3, r2, i2) => {
    if (e5 < g2 || e5 > _2 || n3 < v || n3 > y) return;
    let a2 = ZS(e5, t3, n3, +(r2 === GS));
    if (aC.has(a2)) return;
    let o2 = w + i2, s3 = nC.get(a2);
    s3 !== void 0 && s3 <= o2 || (nC.set(a2, o2), rC.set(a2, T2), iC.set(a2, r2), sC(a2, o2 + b(e5, t3, n3)));
  };
  for (; eC.length && C < KS; ) {
    let e5 = cC();
    if (aC.has(e5)) continue;
    aC.add(e5), C++, $S(e5);
    let t3 = QS.cx, n3 = QS.lv, r2 = QS.cz, a2 = iC.get(e5), s3 = vC(a2, t3, n3, r2);
    if (w = nC.get(e5), T2 = e5, o ? a2 === US && e5 !== x : t3 === p && r2 === m && Math.abs(s3 - i) < 1.8) {
      S = e5;
      break;
    }
    if (a2 >= WS && a2 < GS) {
      let e6 = a2 - WS, i2 = t3 + cS[e6], o2 = r2 + lS[e6], s4 = (n3 + 1) * 4, c2 = fC(t3, r2, e6, s4);
      if (c2 < 2) {
        let t4 = mC(i2, n3 + 1, o2), r3 = 1.3 + c2 * pC;
        if (t4 === e6) E(i2, n3 + 1, o2, a2, r3);
        else if (t4 < 0) {
          if (hC(i2, n3 + 1, o2)) E(i2, n3 + 1, o2, HS, r3);
          else {
            let e7 = ay((i2 + 0.5) * 5, (o2 + 0.5) * 5);
            e7 > 0.3 && Math.abs(e7 - s4) < 1 && E(i2, Math.round(e7 / 4), o2, US, r3);
          }
        }
      }
      for (let i3 = 1; i3 < 4; i3++) {
        let o3 = e6 + i3 & 3, s5 = t3 + cS[o3], c3 = r2 + lS[o3], l3 = n3 * 4, u2 = fC(t3, r2, o3, l3);
        if (u2 === 2) continue;
        let d2 = 1.1 + u2 * pC;
        if (o3 === (e6 + 2 & 3) && mC(s5, n3 - 1, c3) === e6) E(s5, n3 - 1, c3, a2, d2 + 0.2);
        else if (!(mC(s5, n3, c3) >= 0)) {
          if (hC(s5, n3, c3)) E(s5, n3, c3, HS, d2);
          else {
            let e7 = ay((s5 + 0.5) * 5, (c3 + 0.5) * 5);
            e7 > 0.3 && Math.abs(e7 - l3) < 1 && E(s5, Math.round(e7 / 4), c3, US, d2);
          }
        }
      }
    } else for (let e6 = 0; e6 < 4; e6++) {
      let i2 = t3 + cS[e6], o2 = r2 + lS[e6], c2 = e6 + 2 & 3, l3 = fC(t3, r2, e6, s3);
      if (l3 === 2) continue;
      let u2 = l3 * pC, d2 = mC(i2, n3, o2);
      if (d2 >= 0) {
        Math.abs(s3 - n3 * 4) < 0.9 && (d2 !== c2 && E(i2, n3, o2, WS + d2, 1.3 + u2), d2 !== e6 && hC(i2, n3, o2) && E(i2, n3, o2, GS, 3 + u2));
        continue;
      }
      if (d2 = mC(i2, n3 - 1, o2), d2 === c2 && Math.abs(s3 - n3 * 4) < 0.9) {
        E(i2, n3 - 1, o2, WS + d2, 1.3 + u2);
        continue;
      }
      if ((a2 === HS || Math.abs(s3 - n3 * 4) < 0.9) && hC(i2, n3, o2)) {
        E(i2, n3, o2, HS, 1 + u2);
        continue;
      }
      let f2 = ay((i2 + 0.5) * 5, (o2 + 0.5) * 5);
      if (f2 < 0.3 || Math.abs(f2 - s3) > (a2 === US ? 2.6 : 1)) continue;
      let p2 = Math.round(f2 / 4);
      if (hC(i2, p2, o2) && Math.abs(f2 - p2 * 4) < 0.9) {
        E(i2, p2, o2, HS, 1 + u2);
        continue;
      }
      let m2 = fC(t3, r2, e6, f2);
      m2 !== 2 && E(i2, p2, o2, US, 1 + Math.abs(f2 - s3) * 0.15 + Math.max(l3, m2) * pC);
    }
  }
  if (XS.expanded += C, JS -= C, S < 0) return 0;
  XS.found++, oC.length = 0;
  for (let e5 = S; e5 !== x; e5 = rC.get(e5)) oC.push(e5);
  oC.push(x), oC.reverse(), s2.length = 0;
  let D = (c + 0.5) * 5, O = (l2 + 0.5) * 5, k = t2;
  for (let e5 = 1; e5 < oC.length; e5++) {
    let t3 = oC[e5], n3 = iC.get(t3);
    $S(t3);
    let r2 = QS.cx, i2 = QS.lv, a2 = QS.cz, o2 = (r2 + 0.5) * 5, c2 = (a2 + 0.5) * 5;
    if (n3 >= WS && n3 < GS) {
      let t4 = n3 - WS, r3 = t4 & 1, a3 = { x: o2 - cS[t4] * 1.9, y: i2 * 4 + 0.3, z: c2 - lS[t4] * 1.9, ramp: true }, l3 = { x: o2 + cS[t4] * 1.9, y: i2 * 4 + 3.6, z: c2 + lS[t4] * 1.9, ramp: true }, u2 = r3 ? a3.x : D, d2 = r3 ? O : a3.z, f2 = Math.hypot(u2 - a3.x, d2 - a3.z) > 0.6;
      if (k > i2 * 4 + 2) {
        if (s2.push(l3, a3), e5 + 1 < oC.length) {
          $S(oC[e5 + 1]);
          let t5 = r3 ? a3.x : (QS.cx + 0.5) * 5, n4 = r3 ? (QS.cz + 0.5) * 5 : a3.z;
          Math.hypot(t5 - a3.x, n4 - a3.z) > 0.6 && s2.push({ x: t5, y: i2 * 4 + 0.1, z: n4, ramp: false });
        }
      } else f2 && s2.push({ x: u2, y: i2 * 4 + 0.1, z: d2, ramp: false }), s2.push(a3, l3);
      D = o2, O = c2, k = i2 * 4 + 2;
    } else k = vC(n3, r2, i2, a2), s2.push({ x: o2, y: k, z: c2, ramp: false }), D = o2, O = c2;
  }
  return 1;
}
var bC = class {
  f;
  state = `loot`;
  target = null;
  arch = `aggro`;
  dropT = 5;
  dropX = 0;
  dropZ = 0;
  teleports = 0;
  P = Qx.aggro;
  skill = 1;
  thinkT = K(0, 0.4);
  los = false;
  blockOwn = false;
  blockEnemy = false;
  lsx = 0;
  lsy = 0;
  lsz = 0;
  seenT = -99;
  reactT = 0;
  tdist = 99;
  tac = `duel`;
  wantSlot = -1;
  swapT = 0;
  burstT = 0;
  pauseT = 0;
  acc = 0;
  aimT = 0;
  comboT = 0;
  strafe = 1;
  strafeT = 0;
  peekDir = 1;
  peekT = 0;
  nadeSlot = -1;
  nadeT = 0;
  nadeCd = K(3, 8);
  reactHurt = -99;
  buildCd = K(1, 3);
  defRamp = null;
  chain = null;
  bq = [];
  bqT = 0;
  gx = 0;
  gz = 0;
  hasGoal = false;
  route = 0;
  rx = 0;
  rz = 0;
  rx2 = 0;
  rz2 = 0;
  routeT = 0;
  routeSafe = false;
  steer = 0;
  steerSide = 1;
  avoidT = 0;
  avoidDir = 1;
  quickT = 0;
  lx = 0;
  lz = 0;
  winT = 0;
  winX = 0;
  winZ = 0;
  winWant = 0;
  stuckS = 0;
  bcX = 0;
  bcY = 0;
  bcZ = 0;
  edgeT = -99;
  edgeDir = 0;
  edgeN = 0;
  dropOkT = -99;
  edgeHeld = false;
  digT = 0;
  digMiss = 0;
  path = [];
  pi = 0;
  pathT = 0;
  pgx = 0;
  pgy = 0;
  pgz = 0;
  navRetryT = 0;
  ancX = 0;
  ancY = 0;
  ancZ = 0;
  ancT = 0;
  ancG = true;
  task = null;
  rescanT = 0;
  openT = 0;
  harvestT = 0;
  reloadCycleT = 0;
  perchT = 0;
  ign = [];
  ignT = [];
  graceT = 0;
  wasAir = true;
  matT = 0;
  giftT = 30;
  stormKey = -1;
  busStage = 0;
  bx0 = 0;
  bz0 = 0;
  dropBox = null;
  constructor(e4) {
    this.f = e4;
  }
  get D() {
    return Zx[Sf.s.difficulty] ?? Zx.normal;
  }
  reset() {
    let e4 = Math.random();
    this.arch = e4 < 0.3 ? `aggro` : e4 < 0.55 ? `builder` : e4 < 0.85 ? `looter` : `sniper`, this.P = Qx[this.arch], this.skill = K(0.85, 1.65) * (this.arch === `sniper` ? 1.15 : 1), this.state = `loot`, this.target = null, this.los = false, this.seenT = -99, this.reactT = 0, this.tac = `duel`, this.wantSlot = -1, this.acc = 0, this.aimT = 0, this.nadeSlot = -1, this.nadeCd = K(3, 8), this.reactHurt = -99, this.buildCd = K(1, 3), this.defRamp = null, this.chain = null, this.bq.length = 0, this.hasGoal = false, this.route = 0, this.steer = 0, this.avoidT = 0, this.quickT = 0, this.stuckS = 0, this.winT = 0, this.edgeT = -99, this.edgeN = 0, this.dropOkT = -99, this.digT = 0, this.path.length = 0, this.pi = 0, this.navRetryT = 0, this.ancT = 0, this.task = null, this.openT = 0, this.harvestT = 0, this.perchT = 0, this.ign.length = 0, this.ignT.length = 0, this.graceT = 0, this.wasAir = true, this.matT = 0, this.giftT = K(14, 30), this.stormKey = -1, this.busStage = 0, this.dropBox = null, this.teleports = 0;
    let t2 = qv[Math.floor(Math.random() * qv.length)];
    this.dropX = t2.x, this.dropZ = t2.z;
  }
  update(e4) {
    let t2 = this.f;
    if (t2.downed) {
      // Slowly crawl toward the player, stopping close enough for a revive.
      const p=G.player,dx=(p?.pos.x??t2.pos.x)-t2.pos.x,dz=(p?.pos.z??t2.pos.z)-t2.pos.z,d=Math.hypot(dx,dz);
      t2.wishX=d>2.2?dx/d:0;t2.wishZ=d>2.2?dz/d:0;t2.crouch=true;t2.sprint=false;t2.wantJump=false;t2.jumpBuf=0;t2.wantDash=false;
      if(d>2.2)t2.yaw=Math.atan2(dx,dz);t2.step(e4);return;
    }
    if (t2.alive && t2.mode !== `dead`) {
      if (t2.mode === `bus`) this.busThink();
      else if (Sf.cheats.freezeBots) t2.wishX = t2.wishZ = 0, t2.wantJump = false, t2.step(e4);
      else if (t2.fireCd = Math.max(0, t2.fireCd - e4), t2.swingCd = Math.max(0, t2.swingCd - e4), t2.bloom = Math.max(0, t2.bloom - e4 * 1.6), t2.reloadT > 0 && (t2.reloadT -= e4, t2.reloadT <= 0 && (t2.finishReload(), this.topUp())), t2.useT > 0 && this.tickUse(e4), t2.mode === `skydive` || t2.mode === `glide`) this.air(e4);
      else {
        if (this.wasAir && this.landed(), this.graceT > 0 && (this.graceT -= e4), this.swapT -= e4, this.buildCd -= e4, this.nadeCd -= e4, this.comboT -= e4, t2.wantJump = false, this.thinkT -= e4, this.thinkT <= 0 && (this.thinkT = K(0.28, 0.42), this.think()), this.matT += e4, this.matT > 5 && (this.matT = 0, t2.mats.wood = Math.min(200, t2.mats.wood + 12)), this.giftT -= e4, this.giftT <= 0 && this.armedSlot() < 0) {
          let e5 = Kx(0);
          t2.give(e5.id, e5.rarity, Ih[e5.id].mag), this.topUp(), this.giftT = 9999;
        }
        this.reactToHits(), this.tickBuild(e4), this.chain && this.climbStep(), this.digT > 0 ? this.dig(e4) : this.state === `fight` && this.target ? this.fight(e4) : this.state === `heal` ? this.healFrame() : this.openT > 0 ? this.openFrame(e4) : this.harvestT > 0 ? this.harvestFrame(e4) : this.travel(e4), this.guardEdge(), t2.step(e4), this.unstick(e4);
      }
    }
  }
  busThink() {
    let e4 = this.f;
    if (this.busStage === 0) {
      this.bx0 = e4.pos.x, this.bz0 = e4.pos.z, this.busStage = 1;
      return;
    }
    if (this.busStage !== 1) return;
    let t2 = e4.pos.x - this.bx0, n2 = e4.pos.z - this.bz0, r = Math.hypot(t2, n2);
    if (r < 0.3) return;
    let i = t2 / r, a = n2 / r;
    this.chooseDrop(e4.pos.x - i * 44 * G.time, e4.pos.z - a * 44 * G.time, i, a), this.busStage = 2;
  }
  chooseDrop(e4, t2, n2, r) {
    let i = this.P;
    G.time < zS && RS.clear(), zS = G.time;
    let a = [], o = 0;
    for (let s3 of qv) {
      let c2 = Cp((s3.x - e4) * n2 + (s3.z - t2) * r, fS * 44, pS * 44), l3 = Math.hypot(s3.x - (e4 + n2 * c2), s3.z - (t2 + r * c2)), u2 = 0;
      l3 < mS + s3.r * 0.5 && (u2 = Tp(1, (s3.r / 50) ** 2 * (sS.has(s3.id) ? 1.8 : 1), i.hot) * (l3 < mS * 0.7 ? 1 : 0.35) / (1 + (RS.get(s3.id) ?? 0) / 3.5), this.arch === `sniper` && (s3.kind === `summit` || s3.kind === `castle`) && (u2 *= 3)), a.push(u2), o += u2;
    }
    let s2 = 0, c = 0;
    if (this.dropBox = null, o > 0 && !Pp(i.quiet)) {
      let e5 = Math.random() * o, t3 = qv[0];
      for (let n4 = 0; n4 < qv.length; n4++) if (e5 -= a[n4], e5 <= 0) {
        t3 = qv[n4];
        break;
      }
      RS.set(t3.id, (RS.get(t3.id) ?? 0) + 1);
      let n3 = this.spotIn(t3);
      s2 = n3[0], c = n3[1];
    } else for (let i2 = 0; i2 < 16; i2++) {
      let i3 = K(fS, pS) * 44, a2 = K(25, mS * 0.85) * (Pp(0.5) ? 1 : -1);
      if (s2 = e4 + n2 * i3 - r * a2, c = t2 + r * i3 + n2 * a2, ay(s2, c) > 2 && Math.abs(s2) < 350 && Math.abs(c) < 350) break;
    }
    this.dropX = s2, this.dropZ = c;
    let l2 = (s2 - e4) * n2 + (c - t2) * r, u = Cp(Math.abs(-(s2 - e4) * r + (c - t2) * n2) / 75, 0, 1.4) + K(-0.5, 0.5);
    this.dropT = Cp(l2 / 44 - u, Math.max(3.6999999999999997, G.time + 0.05), 19.3);
  }
  spotIn(e4) {
    let t2 = 0, n2 = [], r = [];
    for (let i2 of Xx.boxes) {
      if (i2.opened || i2.kind === `llama` || Math.hypot(i2.pos.x - e4.x, i2.pos.z - e4.z) > e4.r * 1.05) continue;
      let a2 = (i2.kind === `chest` ? 1 : 0.25) / (1 + (LS.get(i2) ?? 0) * 4);
      BS(i2) - i2.pos.y > 9 && (a2 *= 0.3), n2.push(i2), r.push(a2), t2 += a2;
    }
    if (t2 > 0 && Pp(0.85)) {
      let e5 = Math.random() * t2;
      for (let t3 = 0; t3 < n2.length; t3++) if (e5 -= r[t3], e5 <= 0) {
        let e6 = n2[t3];
        return this.dropBox = e6, LS.set(e6, (LS.get(e6) ?? 0) + 1), [e6.pos.x + K(-1.2, 1.2), e6.pos.z + K(-1.2, 1.2)];
      }
    }
    let i = K(0, Math.PI * 2), a = Math.sqrt(Math.random()) * e4.r * 0.75;
    return [e4.x + Math.cos(i) * a, e4.z + Math.sin(i) * a];
  }
  air(e4) {
    let t2 = this.f, n2 = this.dropX - t2.pos.x, r = this.dropZ - t2.pos.z, i = Math.hypot(n2, r);
    if (t2.mode === `skydive`) {
      let e5 = (t2.pos.y - Math.max(ay(t2.pos.x, t2.pos.z), 0) - 42) / Math.max(0.25, i / 21);
      t2.pitch = e5 < 44 ? -0.15 : -(0.25 + 0.9 * wp((e5 - 44) / 32));
    } else t2.pitch = -0.3;
    if (i > 1.2) {
      let a = i < 5 ? i / 5 : 1;
      t2.wishX = n2 / i * a, t2.wishZ = r / i * a, t2.yaw = Ap(t2.yaw, Math.atan2(n2, r), 4, e4);
    } else t2.wishX = t2.wishZ = 0;
    t2.step(e4);
  }
  landed() {
    let e4 = this.f;
    this.wasAir = false;
    let t2 = kS();
    this.graceT = K(this.P.grace[0], this.P.grace[1]) * (t2 > 1.15 ? 0.6 : t2 < 0.9 ? 1.6 : 1) * (G.time < 40 ? 1.3 : 1), this.bcX = this.winX = this.lx = e4.pos.x, this.bcY = e4.pos.y, this.bcZ = this.winZ = this.lz = e4.pos.z, this.dropBox && !this.dropBox.opened && (this.task = this.mkTask(`box`, this.dropBox.pos.x, this.dropBox.pos.z, 25, this.dropBox, null, null));
  }
  think() {
    let e4 = this.f;
    // Teammates follow the player when not fighting
    if (e4.isTeammate && G.player && G.player.alive && !this.target && !window.__game?.squadOrder) {
      let dist = Math.hypot(G.player.pos.x - e4.pos.x, G.player.pos.z - e4.pos.z);
      if (dist > 6) this.setGoal(G.player.pos.x + K(-3, 3), G.player.pos.z + K(-3, 3));
      else if (dist < 3) this.hasGoal = false;
    }
    if(e4.isTeammate && !this.target && !G.storm.isOutside(e4.pos.x,e4.pos.z)) {
      const down=G.fighters.find(f=>f!==e4&&f.isTeammate&&f.alive&&f.downed);
      if(down){this.state=`roam`;this.task=null;e4.squadTask=e4.pos.distanceTo(down.pos)<3?`REVIVING`:`GOING TO REVIVE`;this.setGoal(down.pos.x,down.pos.z);this.computeSteer();return;}
    }
    if(!this.target && this.heardShot && G.time-this.heardShot.t<4 && !e4.isTeammate) {this.setGoal(this.heardShot.x,this.heardShot.z);this.heardShot=null;}
    if (FS(), this.pickups(), this.perceive(), this.defRamp && (G.time > this.defRamp.until || !Fx.pieceAt(Nx(this.spec(`stairs`, this.defRamp.cx, this.defRamp.gy, this.defRamp.cz, this.defRamp.d)))) && (this.defRamp = null), !this.target && G.time - this.edgeT < 0.6 && this.handleEdge(), this.stormCheck()) {
      if (!(this.target && this.los && this.tdist < 20 && G.storm.margin(e4.pos.x, e4.pos.z) > 5)) {
        this.state === `storm` && this.stormKey === G.storm.phase && this.hasGoal || this.stormGoal(), this.state = `storm`, this.task = null, this.harvestT = 0, this.openT = 0, e4.useT > 0 && G.storm.margin(e4.pos.x, e4.pos.z) < 6 && (e4.useT = 0), this.target && (this.wantSlot = this.pickWeapon(this.tdist, false)), this.navExit(), this.computeSteer();
        return;
      }
    } else this.state === `storm` && (this.state = `roam`, this.hasGoal = false);
    const order=window.__game?.squadOrder;
    if(e4.isTeammate && order && !this.target && G.time<order.until){
      const down=order.kind===`revive`?G.fighters.find(f=>f.isTeammate&&f.alive&&f.downed):null;
      if(order.kind!==`revive`||down){const x=down?down.pos.x:order.x,z=down?down.pos.z:order.z;this.state=`roam`;this.task=null;this.harvestT=0;this.openT=0;if(Math.hypot(e4.pos.x-x,e4.pos.z-z)<(down?2.5:3)){this.hasGoal=false;e4.squadTask=down?`REVIVING`:order.kind===`watch`?`WATCHING`:`IN POSITION`;}else{this.setGoal(x,z);this.navExit();this.computeSteer();e4.squadTask=down?`GOING TO REVIVE`:order.kind===`watch`?`MOVING TO WATCH`:`MOVING`; }return;}
    }
    if(e4.isTeammate)e4.squadTask=this.target?`FIGHTING`:`FOLLOWING`;
    this.target ? (this.state = `fight`, this.fightThink()) : (this.state === `fight` && (this.state = `roam`), this.healCheck() || (this.reloadCalm(), this.taskThink(), this.computeSteer()));
  }
  perceive() {
    let e4 = this.f, t2 = this.D, n2 = this.P, r = this.graceT > 0, i = e4.lastHurtBy, a = !!i && i.alive && i.mode !== `bus` && G.time - e4.lastHurtTime < 4, o = null, s2 = 1 / 0;
    if (a && i) o = i, s2 = Math.hypot(i.pos.x - e4.pos.x, i.pos.z - e4.pos.z);
    else {
      let i2 = AS() * n2.sight * (this.arch === `sniper` && this.hasCat(`snp`) ? 1.25 : 1);
      for (let n3 of G.fighters) {
        if (n3 === e4 || !n3.alive || n3.mode === `bus` || n3.mode === `skydive`) continue;
        if (e4.isTeammate && n3.isTeammate) continue;
        let a2 = n3.pos.x - e4.pos.x, c2 = n3.pos.z - e4.pos.z, l2 = a2 * a2 + c2 * c2, u = n3.isPlayer ? r ? 13 : t2.view : r ? 0 : i2;
        l2 > u * u || l2 >= s2 * s2 || Math.abs(n3.pos.y - e4.pos.y) > 45 || (s2 = Math.sqrt(l2), o = n3);
      }
    }
    let c = this.target;
    if (c) {
      if (!c.alive || c.mode === `dead`) this.dropTarget();
      else {
        this.los = this.losTo(c), this.tdist = Math.hypot(c.pos.x - e4.pos.x, c.pos.z - e4.pos.z), this.los && (this.seenT = G.time, this.lsx = c.pos.x, this.lsy = c.pos.y, this.lsz = c.pos.z);
        let t3 = this.arch === `aggro` ? 6 : 3.5;
        G.time - this.seenT > t3 && !(a && i === c) && this.dropTarget();
      }
    }
    if (o && o !== this.target) {
      let e5 = a && o === i;
      if ((!this.target || e5 && !this.los || s2 < this.tdist * 0.5) && (e5 || this.willEngage(o, s2))) {
        let n3 = this.losTo(o);
        (n3 || e5) && (this.target = o, this.los = n3, this.tdist = s2, this.lsx = o.pos.x, this.lsy = o.pos.y, this.lsz = o.pos.z, this.seenT = n3 ? G.time : G.time - 0.5, this.reactT = t2.react * K(0.7, 1.3) / this.skill, this.tac = `duel`, this.acc = 0, this.aimT = 0, this.harvestT = 0, this.openT = 0, this.digT = 0, this.clearPath());
      }
    }
  }
  willEngage(e4, t2) {
    let n2 = this.f;
    if (this.armedSlot() < 0) return false;
    let r = n2.hp + n2.shield;
    switch (this.arch) {
      case `aggro`:
        return true;
      case `builder`:
        return r > 40;
      case `looter`:
        return t2 < AS() * 0.5 || e4.hp + e4.shield < 60 || r >= 150 && this.weaponCount() >= 3 || kS() > 1.25;
      default:
        return this.hasCat(`snp`) || this.hasCat(`ar`) || t2 < 25;
    }
  }
  losTo(e4) {
    let t2 = this.f, n2 = t2.pos.x, r = t2.eyeY, i = t2.pos.z, a = e4.pos.x - n2, o = e4.pos.y + (e4.crouch ? 1 : 1.35) - r, s2 = e4.pos.z - i, c = Math.hypot(a, o, s2);
    if (this.blockOwn = this.blockEnemy = false, c < 0.6 || !Ly(n2, r, i, a / c, o / c, s2 / c, c - 0.4, gS)) return true;
    let l2 = gS.collider ? gS.collider.owner : null;
    return l2 instanceof Px && l2.owner && (l2.owner === t2 ? this.blockOwn = true : this.blockEnemy = true), false;
  }
  dropTarget() {
    this.target = null, this.los = false, this.tac = `duel`, this.nadeSlot = -1, this.defRamp = null, this.state === `fight` && (this.state = `roam`);
  }
  stormCheck() {
    let e4 = G.storm, t2 = this.f;
    if (e4.state === `done`) return false;
    let n2 = e4.margin(t2.pos.x, t2.pos.z), r = Math.hypot(t2.pos.x - e4.tx, t2.pos.z - e4.tz);
    if (n2 < 10) return true;
    if (this.state === `storm` && this.stormKey === e4.phase && r < e4.tr * 0.8 || r <= e4.tr * 0.9) return false;
    if (e4.state === `shrink`) return true;
    let i = Math.max(0, r - e4.tr * 0.6) / 7.2;
    return e4.timer < i * 1.35 + this.P.early;
  }
  stormGoal() {
    let e4 = G.storm, t2 = this.f;
    this.stormKey = e4.phase;
    let n2 = Math.atan2(t2.pos.z - e4.tz, t2.pos.x - e4.tx), r = -1 / 0, i = e4.tx, a = e4.tz, o = this.arch === `sniper` ? 7 : 4;
    for (let s2 = 0; s2 < o; s2++) {
      let o2 = n2 + K(-0.75, 0.75), s3 = Math.max(4, e4.tr * K(0.3, 0.72)), c = e4.tx + Math.cos(o2) * s3, l2 = e4.tz + Math.sin(o2) * s3, u = ay(c, l2);
      if (u < 0.8) continue;
      let d = (this.arch === `sniper` ? u * 0.6 : 0) - Math.hypot(c - t2.pos.x, l2 - t2.pos.z) * 0.04 + K(0, 2);
      d > r && (r = d, i = c, a = l2);
    }
    this.setGoal(i, a);
  }
  safe(e4, t2) {
    let n2 = G.storm;
    return n2.state === `done` ? true : n2.state === `shrink` || n2.timer < 35 ? Math.hypot(e4 - n2.tx, t2 - n2.tz) < n2.tr * 0.9 : n2.margin(e4, t2) > 8;
  }
  fightThink() {
    let e4 = this.f, t2 = this.target, n2 = this.D, r = this.P, i = t2.pos.x - e4.pos.x, a = t2.pos.z - e4.pos.z, o = this.tdist, s2 = t2.pos.y - e4.pos.y, c = e4.hp + e4.shield, l2 = t2.hp + t2.shield, u = this.armedSlot() >= 0, d = G.time - this.seenT, f = this.matsTotal();
    if (this.wantSlot = this.pickWeapon(o, this.blockEnemy), this.harvestT = 0, this.openT = 0, this.nadeSlot < 0 && this.nadeCd <= 0 && n2.nade > 0 && d < 4 && o > 5 && o < 20.5 && (!this.los || this.blockEnemy)) {
      let e5 = this.thrownSlot();
      e5 >= 0 && Pp(n2.nade * 0.6) ? (this.nadeSlot = e5, this.nadeT = 1.5) : this.nadeCd = 1.5;
    }
    if (e4.useT > 0) {
      this.tac = `heal`;
      return;
    }
    let p = this.isBoxed(), m = this.healSlot() >= 0;
    if (p && m && c < n2.healAt) {
      this.startHeal(), this.tac = `heal`;
      return;
    }
    if (c < r.flee && (l2 > c + 15 || !u)) {
      if (!this.los && d > 1 && m) {
        this.healUp(CS(i, a));
        return;
      }
      this.tac = `retreat`;
      return;
    }
    if (m && c < 75 && !this.los && d > 1.5) {
      this.healUp(CS(i, a));
      return;
    }
    if (this.chain) {
      this.tac = `climb`;
      return;
    }
    if (this.defRamp) {
      this.tac = `cover`;
      return;
    }
    let h = !this.ceiling();
    if (n2.rush && u && h && f >= 30 && s2 > 3.2 && o < 45 && Pp(wp(n2.build * r.build))) {
      this.startClimb(CS(i, a), Math.min(6, Math.ceil(s2 / 4) + 1), t2.pos.y + 1), this.tac = `climb`;
      return;
    }
    if (n2.rush && u && h && r.build >= 1 && f >= 60 && o > 8 && o < 32 && Math.abs(s2) < 2 && Pp(0.07 * n2.build)) {
      this.startClimb(CS(i, a), 2, e4.pos.y + 7), this.tac = `climb`;
      return;
    }
    if (!u) {
      this.tac = o < 4 && t2.weapon === null ? `push` : `retreat`;
      return;
    }
    if (!this.los) {
      this.tac = (r.brave > 0.7 || o < 12) && c > 60 ? `push` : `peek`, this.tac === `push` ? this.chasePath() : this.clearPath();
      return;
    }
    this.clearPath();
    let g2 = this.wantSlot >= 0 ? e4.slots[this.wantSlot] : null, _2 = !!g2 && Uh(g2.id) && eS[g2.id] === `sg`;
    this.tac = _2 && o > 8 && r.brave > 0.5 && c >= l2 - 10 ? `push` : `duel`;
  }
  chasePath() {
    let e4 = this.f;
    if (this.pi < this.path.length && Math.hypot(this.pgx - this.lsx, this.pgz - this.lsz) < 3 && Math.abs(this.pgy - this.lsy) < 2 || G.time < this.navRetryT || !e4.grounded) return;
    if (Math.abs(this.lsy - e4.pos.y) < 2.4 && !_C(e4.pos.x, e4.pos.y, e4.pos.z) && !gC(this.lsx, this.lsy, this.lsz)) {
      this.clearPath();
      return;
    }
    let t2 = yC(e4.pos.x, e4.pos.y, e4.pos.z, this.lsx, this.lsy, this.lsz, false, this.path);
    t2 > 0 ? this.startPath(this.lsx, this.lsy, this.lsz) : (this.clearPath(), this.navRetryT = G.time + (t2 < 0 ? 0.4 : 3));
  }
  healUp(e4) {
    this.D.box && this.matsTotal() >= 50 && !this.isBoxed() && this.f.grounded && !this.bq.length && this.boxUp(e4), this.startHeal(), this.tac = `heal`;
  }
  fight(e4) {
    let t2 = this.f, n2 = this.target, r = this.los, i = r ? n2.pos.x : this.lsx, a = r ? n2.pos.z : this.lsz, o = (r ? n2.pos.y : this.lsy) + (n2.crouch ? 0.95 : 1.3), s2 = i - t2.pos.x, c = a - t2.pos.z, l2 = Math.hypot(s2, c), u = o - t2.eyeY;
    t2.yaw = Ap(t2.yaw, Math.atan2(s2, c), 8 + 6 * this.skill, e4), t2.pitch = Math.atan2(u, Math.max(l2, 0.5)), r && t2.aiming ? this.aimT += e4 : t2.aiming || (this.aimT = 0), this.reactT -= e4;
    let d = s2 / (l2 || 1), f = c / (l2 || 1);
    this.tac === `cover` ? this.coverMove() : this.fightMove(e4, l2, d, f), this.nadeSlot >= 0 ? this.throwNade(e4, i, o - 1, a, r) : t2.useT > 0 || (this.wantSlot !== t2.active && this.swapT <= 0 && t2.reloadT <= 0 && (t2.select(this.wantSlot), this.swapT = this.D.swap + 0.1), this.shoot(e4, l2, s2, u, c));
  }
  fightMove(e4, t2, n2, r) {
    let i = this.f, a = this.D, o = this.P, s2 = i.weapon;
    i.crouch = false, i.sprint = false, this.strafeT -= e4, this.strafeT <= 0 && (this.strafeT = K(0.35, 1.3) / a.move, this.strafe = Pp(0.5) ? 1 : -1, Pp(0.15 / a.move) && (this.strafe = 0));
    let c = 0, l2 = 0;
    switch (this.tac) {
      case `climb`:
        if (this.chain) {
          this.climbMove();
          return;
        }
        break;
      case `heal`:
        i.wishX = i.wishZ = 0, i.crouch = true, i.aiming = false;
        return;
      case `retreat`:
        c = -1, l2 = this.strafe * 0.5, i.sprint = true;
        break;
      case `push`: {
        let o2 = this.los ? null : this.pathTarget();
        if (o2) {
          let e5 = o2.x - i.pos.x, t3 = o2.z - i.pos.z, a2 = Math.hypot(e5, t3) || 1;
          n2 = e5 / a2, r = t3 / a2, c = 1, l2 = 0, i.sprint = !o2.ramp;
          break;
        }
        c = 1, l2 = this.strafe * 0.35, i.sprint = t2 > 14, t2 < 12 && Pp(e4 * 0.9 * a.move) && (i.wantJump = true);
        break;
      }
      case `peek`:
        this.peekT -= e4, this.peekT <= 0 && (this.peekT = K(0.6, 1.4), this.peekDir = -this.peekDir), l2 = this.peekDir, c = o.brave > 0.7 ? 0.35 : 0, Pp(e4 * 0.5 * a.move) && (i.wantJump = true);
        break;
      default: {
        let n3 = s2 && !s2.thrown ? nS[eS[s2.id]] : 2;
        c = t2 > n3 * 1.3 ? 1 : t2 < n3 * 0.55 ? -0.7 : 0, l2 = this.strafe * 0.85, t2 < 16 && Pp(e4 * 0.7 * a.move) && (i.wantJump = true), s2 && t2 > 18 && this.strafe === 0 && (eS[s2.id] === `ar` || eS[s2.id] === `snp`) && (i.crouch = true);
      }
    }
    this.armedSlot() < 0 && (c = 1, l2 *= 0.3);
    let u = n2 * c - r * l2, d = r * c + n2 * l2, f = Math.hypot(u, d);
    f > 1 && (u /= f, d /= f), i.wishX = u, i.wishZ = d, i.aiming = !!s2 && !s2.thrown && t2 > 22 && this.tac !== `retreat` && this.tac !== `push`;
  }
  coverMove() {
    let e4 = this.f, t2 = this.defRamp;
    if (e4.sprint = false, e4.crouch = false, e4.aiming = false, !t2) {
      e4.wishX = e4.wishZ = 0;
      return;
    }
    let n2 = bS(e4.pos.x) === t2.cx && bS(e4.pos.z) === t2.cz, r = wS(t2.d, e4.pos.x, e4.pos.z, t2.cx, t2.cz), i = t2.gy * 4 + Cp(r, 0, 5) * (4 / 5), a = 0, o = 0;
    if (n2) e4.pos.y < i - 0.45 && r > 0.4 ? (a = -cS[t2.d], o = -lS[t2.d]) : r < 4.1 && !this.los && (a = cS[t2.d] * 0.8, o = lS[t2.d] * 0.8);
    else {
      a = (t2.cx + 0.5) * 5 - e4.pos.x, o = (t2.cz + 0.5) * 5 - e4.pos.z;
      let n3 = Math.hypot(a, o) || 1;
      a /= n3, o /= n3;
    }
    e4.wishX = a, e4.wishZ = o;
  }
  shoot(e4, t2, n2, r, i) {
    let a = this.f, o = this.target, s2 = this.D, c = a.weapon;
    if (!c || c.thrown) {
      if (a.active !== -1 && this.armedSlot() < 0 && a.useT <= 0 && a.select(-1), t2 < 2.6 && a.swingCd <= 0 && this.armedSlot() < 0) {
        let e5 = Math.hypot(n2, r, i) || 1;
        this.swing(n2 / e5, r / e5, i / e5, 3);
      }
      return;
    }
    if (this.reactT > 0) return;
    let l2 = this.blockEnemy && this.P.brave > 0.6 && t2 < 40;
    if (!this.los && !l2) return;
    if (this.pauseT > 0) {
      this.pauseT -= e4;
      return;
    }
    if (c.auto && (this.burstT -= e4, this.burstT <= 0)) {
      this.burstT = K(0.5, 1.3) * s2.burst, this.pauseT = K(0.3, 0.9) / s2.burst, this.acc = 0;
      return;
    }
    if (a.fireCd > 0 || a.reloadT > 0 || c.id === `sniper` && (a.aiming = true, this.aimT < 0.55 / this.skill)) return;
    if (!c.auto && Pp(0.4)) {
      a.fireCd = K(0.05, 0.25);
      return;
    }
    let u = Math.hypot(n2, r, i) || 1, d = Math.hypot(o.vel.x, o.vel.z), f = s2.sigma / this.skill * (1 + d * 0.09) * (o.grounded ? 1 : 1.35) * Math.max(0.6, 1 - this.acc * 0.12);
    c.id === `sniper` && (f *= 0.45), this.los || (f *= 1.5);
    let p = kS();
    if (!o.isPlayer && p < 1 && (f *= 1 + wp((1 - p) * 2.5) * 0.9), this.acc++, $y(a, a.pos.x, a.eyeY, a.pos.z, n2 / u, r / u, i / u, f)) {
      if (!o.isPlayer) {
        let e5 = Cp(p ** 2.6, 0.3, 1);
        e5 < 1 && (a.fireCd /= e5);
      }
      eS[c.id] === `sg` && c.fireRate < 1 && t2 < 14 && s2.swap < 0.2 && (this.comboT = 0.8);
    } else {
      let e5 = a.current;
      e5 && e5.count <= 0 && a.reloadT <= 0 && !a.startReload() && this.topUp();
    }
  }
  throwNade(e4, t2, n2, r, i) {
    let a = this.f, o = this.nadeSlot;
    this.nadeT -= e4;
    let s2 = a.slots[o];
    if (!s2 || !Uh(s2.id) || !Ih[s2.id].thrown || s2.count <= 0 || this.nadeT <= 0) {
      this.nadeSlot = -1, s2 && s2.count <= 0 && Uh(s2.id) && Ih[s2.id].thrown && (a.slots[o] = null);
      return;
    }
    if (a.active !== o) {
      a.useT <= 0 && a.select(o);
      return;
    }
    if (a.fireCd > 0) return;
    let c = a.pos.x, l2 = a.eyeY, u = a.pos.z;
    TS(c, l2, u, t2, n2 + 0.3, r, !i || this.blockEnemy, _S) ? (a.yaw = Math.atan2(_S.x, _S.z), a.pitch = Math.asin(Cp(_S.y, -1, 1)), $y(a, c, l2, u, _S.x, _S.y, _S.z, this.D === Zx.hard ? 0.5 : 1.5), this.nadeCd = K(5, 10)) : this.nadeCd = 2, s2.count <= 0 && (a.slots[o] = null), this.nadeSlot = -1;
  }
  pickWeapon(e4, t2) {
    let n2 = this.f, r = -1, i = -1 / 0;
    for (let a = 0; a < 5; a++) {
      let o = n2.slots[a];
      if (!o || !Uh(o.id)) continue;
      let s2 = Ih[o.id];
      if (s2.thrown || o.count <= 0 && n2.ammo[s2.ammo] <= 0) continue;
      let c = eS[o.id], l2 = oS(c, e4) + o.rarity * 0.35;
      c === `snp` && this.arch === `sniper` && (l2 += 2), c === `expl` && t2 && (l2 += 5), this.comboT > 0 && c !== `sg` && c !== `snp` && c !== `expl` && (l2 += 6), a === n2.active && (l2 += 1), o.count <= 0 && (l2 -= 2), l2 > i && (i = l2, r = a);
    }
    return r;
  }
  reactToHits() {
    let e4 = this.f;
    if (e4.lastHurtTime <= this.reactHurt || G.time - e4.lastHurtTime > 0.3) return;
    this.reactHurt = e4.lastHurtTime;
    let t2 = e4.lastHurtBy;
    if (!t2 || !t2.alive) return;
    let n2 = this.D, r = this.P, i = this.state === `heal` || this.tac === `heal` ? this.isBoxed() : false;
    if (e4.useT > 0 && !i && e4.hp + e4.shield < 60 && (e4.useT = 0), this.buildCd > 0 || !e4.grounded || this.bq.length || this.chain || i) return;
    let a = t2.pos.x - e4.pos.x, o = t2.pos.z - e4.pos.z;
    if (!(Math.hypot(a, o) < 4 || this.matsTotal() < 10)) {
      if (!Pp(wp(n2.build * r.build * 0.85))) this.buildCd = 1.2;
      else {
        if (n2.rush && this.matsTotal() >= 20 && !this.ceiling() && Pp(0.75)) this.wallRamp(CS(a, o));
        else {
          let t3 = Lx(`wall`, e4.pos.x, e4.pos.y, e4.pos.z, Math.atan2(a, o), 0, this.pickMat());
          this.placeNow(t3);
        }
        this.buildCd = K(2, 4.5) / (r.build * n2.build + 0.3);
      }
    }
  }
  pickMat() {
    let e4 = this.f.mats;
    return this.D === Zx.hard && e4.stone >= 30 && e4.stone >= e4.metal ? `stone` : this.D === Zx.hard && e4.metal >= 30 ? `metal` : e4.wood >= e4.stone && e4.wood >= e4.metal ? `wood` : e4.stone >= e4.metal ? `stone` : `metal`;
  }
  spec(e4, t2, n2, r, i) {
    let a = this.pickMat(), o = Ix[a];
    return { shape: e4, gx: t2, gy: n2, gz: r, rot: i, tex: o.tex, tint: o.tint, mat: a };
  }
  wallAt(e4, t2, n2, r) {
    switch (r) {
      case 0:
        return this.spec(`wall`, e4, t2, n2 + 1, 0);
      case 1:
        return this.spec(`wall`, e4 + 1, t2, n2, 1);
      case 2:
        return this.spec(`wall`, e4, t2, n2, 0);
      default:
        return this.spec(`wall`, e4, t2, n2, 1);
    }
  }
  placeNow(e4) {
    let t2 = this.f;
    if (t2.mats[e4.mat] < 10) {
      let n2 = [`wood`, `stone`, `metal`].find((e5) => t2.mats[e5] >= 10);
      if (!n2) return false;
      let r = Ix[n2];
      e4.mat = n2, e4.tex = r.tex, e4.tint = r.tint;
    }
    return !Fx.canPlace(e4) || !Fx.place(e4, false, t2) ? false : (t2.mats[e4.mat] -= 10, t2.builds++, t2.visible && W.play(`build_` + e4.mat, { x: t2.pos.x, y: t2.pos.y + 1, z: t2.pos.z, volume: 0.8 }), true);
  }
  tickBuild(e4) {
    if (!this.bq.length || (this.bqT -= e4, this.bqT > 0)) return;
    let t2 = this.bq.shift();
    this.placeNow(t2), this.bqT = this.D.bstep * K(0.8, 1.25);
  }
  wallRamp(e4) {
    let t2 = this.f, n2 = bS(t2.pos.x), r = bS(t2.pos.z), i = SS(t2.pos.y);
    this.placeNow(this.wallAt(n2, xS(t2.pos.y), r, e4)), this.bq.push(this.spec(`stairs`, n2, i, r, e4)), this.bqT = this.D.bstep, this.defRamp = { cx: n2, cz: r, gy: i, d: e4, until: G.time + K(4, 7) }, this.state === `fight` && (this.tac = `cover`);
  }
  boxUp(e4) {
    let t2 = this.f, n2 = bS(t2.pos.x), r = bS(t2.pos.z), i = xS(t2.pos.y);
    for (let t3 of [0, 1, 3, 2]) this.bq.push(this.wallAt(n2, i, r, (e4 + t3) % 4));
    this.bq.push(this.spec(`floor`, n2, i + 1, r, 0));
  }
  isBoxed() {
    let e4 = this.f, t2 = bS(e4.pos.x), n2 = bS(e4.pos.z), r = xS(e4.pos.y), i = 0;
    for (let e5 = 0; e5 < 4; e5++) Fx.pieceAt(Nx(this.wallAt(t2, r, n2, e5))) && i++;
    return i >= 3;
  }
  ceiling() {
    let e4 = this.f;
    return ky(e4.pos.x, e4.pos.z, e4.pos.y + 1.8, 3.2) !== 1 / 0;
  }
  startClimb(e4, t2, n2) {
    let r = this.f, i = bS(r.pos.x), a = bS(r.pos.z);
    wS(e4, r.pos.x, r.pos.z, i, a) > 0.5 && (i += cS[e4], a += lS[e4]);
    let o = SS(r.pos.y), s2 = this.spec(`stairs`, i, o, a, e4);
    Fx.canPlace(s2) && (this.bq.push(s2, this.wallAt(i, o, a, e4)), this.bqT = Math.min(this.bqT, 0), this.chain = { cx: i, cz: a, gy: o, gy0: o, d: e4, n: 1, max: t2, stopY: n2, until: G.time + 4 + t2 * 2, ok: false }, this.defRamp = null);
  }
  climbStep() {
    let e4 = this.f, t2 = this.chain;
    if (e4.pos.y >= t2.stopY || G.time > t2.until || e4.pos.y < t2.gy0 * 4 - 1.5 || this.matsTotal() < 20 && !this.bq.length) (!this.bq.length || e4.pos.y >= t2.stopY) && (this.chain = null);
    else {
      if (!this.bq.length && !t2.ok) {
        if (!Fx.pieceAt(Nx(this.spec(`stairs`, t2.cx, t2.gy, t2.cz, t2.d)))) {
          this.chain = null;
          return;
        }
        t2.ok = true;
      }
      t2.n < t2.max && !this.bq.length && e4.grounded && e4.pos.y >= t2.gy * 4 + 1 ? (t2.cx += cS[t2.d], t2.cz += lS[t2.d], t2.gy++, t2.n++, t2.ok = false, this.bq.push(this.spec(`stairs`, t2.cx, t2.gy, t2.cz, t2.d), this.wallAt(t2.cx, t2.gy, t2.cz, t2.d))) : t2.n >= t2.max && !this.bq.length && e4.pos.y >= t2.gy * 4 + 3.2 && (this.chain = null);
    }
  }
  climbMove() {
    let e4 = this.f, t2 = this.chain, n2 = cS[t2.d], r = lS[t2.d];
    t2.d === 0 || t2.d === 2 ? n2 = Cp(((t2.cx + 0.5) * 5 - e4.pos.x) * 0.5, -0.7, 0.7) : r = Cp(((t2.cz + 0.5) * 5 - e4.pos.z) * 0.5, -0.7, 0.7), e4.wishX = n2, e4.wishZ = r, e4.sprint = false, e4.crouch = false, this.target || (e4.yaw = Ap(e4.yaw, Math.atan2(cS[t2.d], lS[t2.d]), 8, 0.05));
  }
  rampDown(e4) {
    let t2 = this.f, n2 = bS(t2.pos.x + cS[e4] * 1.6), r = bS(t2.pos.z + lS[e4] * 1.6);
    n2 === bS(t2.pos.x) && r === bS(t2.pos.z) && (n2 += cS[e4], r += lS[e4]);
    let i = Math.round(t2.pos.y / 4) - 1;
    if (Math.abs(i * 4 + 4 - t2.pos.y) > 0.9) return false;
    let a = this.spec(`stairs`, n2, i, r, (e4 + 2) % 4);
    if (!this.placeNow(a)) return false;
    let o = (n2 + 0.5) * 5, s2 = (r + 0.5) * 5;
    return this.rx = o, this.rz = s2, this.rx2 = o + cS[e4] * 2.2, this.rz2 = s2 + lS[e4] * 2.2, this.route = 1, this.routeT = G.time + 4, this.routeSafe = true, this.clearPath(), true;
  }
  healCheck() {
    let e4 = this.f;
    return e4.useT > 0 ? (this.state = `heal`, true) : (this.state === `heal` && (this.state = `roam`), e4.hp + e4.shield >= this.D.healAt && e4.hp >= 75 || this.healSlot() < 0 ? false : (G.time - e4.lastHurtTime < 12 && e4.hp + e4.shield < 120 ? this.healUp(CS(Math.sin(e4.yaw), Math.cos(e4.yaw))) : this.startHeal(), this.state = e4.useT > 0 ? `heal` : `roam`, e4.useT > 0));
  }
  healFrame() {
    let e4 = this.f;
    e4.wishX = e4.wishZ = 0, e4.sprint = false, e4.crouch = true, e4.aiming = false, e4.useT <= 0 && (e4.crouch = false, this.state = `roam`);
  }
  startHeal() {
    let e4 = this.f;
    if (e4.useT > 0) return true;
    let t2 = this.healSlot();
    return t2 < 0 ? false : (e4.select(t2), e4.useT = 1e-3, e4.useTotal = Lh[e4.slots[t2].id].useTime, true);
  }
  healSlot() {
    let e4 = this.f, t2 = -1, n2 = 0;
    for (let r = 0; r < 5; r++) {
      let i = e4.slots[r];
      if (!i || Uh(i.id)) continue;
      let a = Lh[i.id], o = 0;
      if (a.shield > 0 && e4.shield < a.cap) o = e4.hp < 40 ? 2 : 6, i.id === `mini` && e4.shield < 50 && (o += 2);
      else if (a.heal > 0 && e4.hp < a.cap) {
        let t3 = a.cap - e4.hp;
        o = e4.hp < 40 ? 7 : t3 > 20 ? 3 : 0, i.id === `medkit` && e4.hp > 60 && (o -= 2);
      }
      o > n2 && (n2 = o, t2 = r);
    }
    return t2;
  }
  tickUse(e4) {
    let t2 = this.f, n2 = t2.current;
    if (!n2 || Uh(n2.id)) t2.useT = 0;
    else if (t2.useT += e4, t2.useT >= t2.useTotal) {
      let e5 = Lh[n2.id];
      e5.heal && (t2.hp = Math.min(e5.heal >= 100 ? 100 : e5.cap, t2.hp + e5.heal)), e5.shield && (t2.shield = Math.min(e5.cap, t2.shield + e5.shield)), t2.useT = 0, --n2.count <= 0 && (t2.slots[t2.active] = null), (this.target && this.los || !this.startHeal()) && t2.select(this.pickWeapon(this.target ? this.tdist : 25, false));
    }
  }
  reloadCalm() {
    let e4 = this.f;
    if (e4.reloadT > 0 || e4.useT > 0) return;
    let t2 = e4.current, n2 = e4.weapon;
    if (t2 && n2 && !n2.thrown && t2.count < n2.mag * 0.75) e4.startReload() || this.topUp();
    else if (!(G.time < this.reloadCycleT)) {
      this.reloadCycleT = G.time + 2.5;
      for (let t3 = 0; t3 < 5; t3++) {
        let n3 = e4.slots[t3];
        if (n3 && Uh(n3.id) && !Ih[n3.id].thrown && n3.count < Ih[n3.id].mag * 0.5) {
          e4.select(t3), e4.startReload() || this.topUp();
          return;
        }
      }
      if (!e4.current || !Uh(e4.current.id)) {
        let t3 = this.pickWeapon(25, false);
        t3 >= 0 && e4.select(t3);
      }
    }
  }
  topUp() {
    let e4 = this.f;
    for (let t2 of e4.slots) {
      if (!t2 || !Uh(t2.id)) continue;
      let n2 = Ih[t2.id];
      n2.thrown || e4.ammo[n2.ammo] < n2.mag * 2 && (e4.ammo[n2.ammo] = n2.mag * 2);
    }
  }
  armedSlot() {
    let e4 = this.f;
    for (let t2 = 0; t2 < 5; t2++) {
      let n2 = e4.slots[t2];
      if (n2 && Uh(n2.id) && !Ih[n2.id].thrown) return t2;
    }
    return -1;
  }
  thrownSlot() {
    let e4 = this.f;
    for (let t2 = 0; t2 < 5; t2++) {
      let n2 = e4.slots[t2];
      if (n2 && Uh(n2.id) && Ih[n2.id].thrown && n2.count > 0) return t2;
    }
    return -1;
  }
  weaponCount() {
    let e4 = 0;
    for (let t2 of this.f.slots) t2 && Uh(t2.id) && e4++;
    return e4;
  }
  hasCat(e4) {
    for (let t2 of this.f.slots) if (t2 && Uh(t2.id) && eS[t2.id] === e4) return true;
    return false;
  }
  matsTotal() {
    let e4 = this.f.mats;
    return e4.wood + e4.stone + e4.metal;
  }
  score(e4, t2, n2) {
    rS.fill(0), iS.fill(0);
    let r = 0, i = 0;
    for (let a2 = 0; a2 < 5; a2++) {
      let o = a2 === t2 ? n2 : e4[a2];
      if (o) {
        if (Uh(o.id)) {
          let e5 = eS[o.id], t3 = aS[e5], n3 = (e5 === `snp` && this.arch === `sniper` ? 11 : tS[e5]) + o.rarity * 1.6;
          iS[t3] += n3, n3 > rS[t3] && (rS[t3] = n3);
        } else o.id === `mini` ? r += Math.min(o.count, 4) * 0.6 : o.id === `big` ? r += Math.min(o.count, 3) : o.id === `medkit` ? i += Math.min(o.count, 3) : i += Math.min(o.count, 10) * 0.18;
      }
    }
    let a = 0;
    for (let e5 = 0; e5 < $x.length; e5++) a += rS[e5] + (iS[e5] - rS[e5]) * 0.1;
    return a + Math.min(r, 2.5) * 3.2 + Math.min(i, 2) * 2.4;
  }
  gain(e4, t2, n2) {
    let r = this.f.slots;
    if (yS.drop = -1, !Uh(e4)) {
      for (let t3 of r) if (t3 && t3.id === e4) return yS.gain = +(t3.count < Lh[e4].stack), yS;
    }
    let i = this.score(r, -1, null);
    vS.id = e4, vS.rarity = t2, vS.count = n2;
    let a = r.indexOf(null);
    if (a >= 0) return yS.gain = this.score(r, a, vS) - i, yS;
    let o = -1 / 0;
    for (let e5 = 0; e5 < 5; e5++) {
      let t3 = this.score(r, e5, vS) - i;
      t3 > o && (o = t3, yS.drop = e5);
    }
    return yS.gain = o, yS;
  }
  pickups() {
    let e4 = this.f, t2 = e4.pos.x, n2 = e4.pos.y, r = e4.pos.z, i = Xx.items;
    for (let a = i.length - 1; a >= 0; a--) {
      let o = i[a];
      if (!o) continue;
      let s2 = o.pos.x - t2, c = o.pos.z - r;
      if (s2 * s2 + c * c > 2.6) continue;
      let l2 = o.pos.y - n2;
      if (l2 > 2.2 || l2 < -1.6 || o.lock === e4 && o.lockT > 0) continue;
      if (o.kind === `ammo` || o.kind === `mats`) {
        Xx.pickup(e4, o, false);
        continue;
      }
      let u = this.gain(o.id, o.rarity, o.count);
      if (u.gain < 0.6) continue;
      let d = o.kind === `weapon`;
      u.drop < 0 ? Xx.pickup(e4, o, false) && d && this.topUp() : e4.useT <= 0 && (e4.select(u.drop), Xx.pickup(e4, o, true) && d && this.topUp());
    }
  }
  mkTask(e4, t2, n2, r, i, a, o) {
    return { kind: e4, x: t2, z: n2, until: G.time + r, box: i, item: a, col: o };
  }
  ignored(e4) {
    let t2 = this.ign.indexOf(e4);
    return t2 >= 0 && this.ignT[t2] > G.time;
  }
  ignoreBox(e4, t2) {
    let n2 = this.ign.indexOf(e4);
    n2 >= 0 ? this.ignT[n2] = G.time + t2 : (this.ign.length >= 12 && (this.ign.shift(), this.ignT.shift()), this.ign.push(e4), this.ignT.push(G.time + t2));
  }
  taskValid(e4) {
    if (G.time > e4.until) return false;
    switch (e4.kind) {
      case `box`:
        return !!e4.box && !e4.box.opened && !this.ignored(e4.box);
      case `item`:
        return !!e4.item && Xx.items.includes(e4.item);
      case `harvest`:
        return !!e4.col && !!e4.col.owner && e4.col.owner.alive && this.matsTotal() < this.P.matWant;
      default:
        return this.safe(e4.x, e4.z);
    }
  }
  taskThink() {
    let e4 = this.f, t2 = this.task;
    if (t2 && !this.taskValid(t2) && (t2.kind === `box` && t2.box && !t2.box.opened && this.ignoreBox(t2.box, 30), t2 = this.task = null, this.route = 0, this.clearPath()), t2 && (t2.kind === `roam` || t2.kind === `hunt`) && G.time > this.rescanT) {
      this.rescanT = G.time + 2.5;
      let e5 = this.chooseTask(false);
      e5 && (t2 = this.task = e5);
    }
    if (t2 || (t2 = this.task = this.chooseTask(true), this.rescanT = G.time + 2.5), !t2) return;
    let n2 = Math.hypot(t2.x - e4.pos.x, t2.z - e4.pos.z);
    switch (t2.kind) {
      case `box`: {
        let r = t2.box, i = r.pos.y - e4.pos.y;
        n2 < 2 && Math.abs(i) < 1.7 ? (this.openT = 0.4, this.hasGoal = false, this.route = 0, this.clearPath()) : (this.setGoal(t2.x, t2.z), this.navTo(t2.x, r.pos.y, t2.z, n2));
        break;
      }
      case `item`: {
        let r = t2.item;
        t2.x = r.pos.x, t2.z = r.pos.z, n2 < 0.8 && Math.abs(r.pos.y - e4.pos.y) < 1.5 ? (this.ignoreBox(r, 30), this.task = null, this.clearPath(), this.hasGoal = false) : (this.setGoal(t2.x, t2.z), this.navTo(t2.x, r.pos.y, t2.z, n2));
        break;
      }
      case `harvest`:
        this.surfDist(t2.col) < 1.4 ? (this.harvestT = 6, this.hasGoal = false) : this.setGoal(t2.x, t2.z);
        break;
      case `perch`:
        n2 < 3 ? (this.hasGoal = false, e4.crouch = true) : this.setGoal(t2.x, t2.z);
        break;
      default:
        n2 < 4 ? (this.task = null, this.hasGoal = false) : this.setGoal(t2.x, t2.z);
    }
    this.state = t2.kind === `roam` || t2.kind === `hunt` || t2.kind === `perch` ? `roam` : `loot`, this.task && (t2.kind === `roam` || t2.kind === `hunt` || t2.kind === `perch` || t2.kind === `harvest`) && this.navExit();
  }
  chooseTask(e4) {
    let t2 = this.f, n2 = this.P, r = t2.pos.x, i = t2.pos.z, a = null, o = 0.7;
    for (let e5 of Xx.items) {
      let s3 = e5.pos.x - r, c = e5.pos.z - i, l2 = s3 * s3 + c * c;
      if (l2 > 676) continue;
      let u = e5.pos.y - t2.pos.y;
      if (u > 13 || u < -13 || e5.lock === t2 && e5.lockT > 0 || this.ignored(e5)) continue;
      let d;
      d = e5.kind === `ammo` ? 0.2 : e5.kind === `mats` ? this.matsTotal() < n2.matWant ? 1.4 : 0.1 : this.gain(e5.id, e5.rarity, e5.count).gain;
      let f = d - Math.sqrt(l2) * 0.09 - Math.abs(u) * (u > 0 ? 0.13 : 0.09);
      f > o && (o = f, a = this.mkTask(`item`, e5.pos.x, e5.pos.z, 12, null, e5, null));
    }
    let s2 = this.weaponCount();
    for (let e5 of Xx.boxes) {
      if (e5.opened) continue;
      let c = e5.pos.x - r, l2 = e5.pos.z - i, u = c * c + l2 * l2;
      if (u > 6400 || this.ignored(e5) || !this.safe(e5.pos.x, e5.pos.z)) continue;
      let d = Math.sqrt(u), f = e5.pos.y - t2.pos.y, p = (e5.kind === `chest` ? 6 + (s2 < 2 ? 6 : s2 < 3 ? 2 : 0) : e5.kind === `llama` ? 18 : d < 20 ? 1.6 : 0) * n2.lootMul - d * 0.09 - Math.abs(f) * 0.25;
      p > o && (o = p, a = this.mkTask(`box`, e5.pos.x, e5.pos.z, 12 + d / 4, e5, null, null));
    }
    if (this.matsTotal() < n2.matWant * (this.D === Zx.easy ? 0.5 : 1) && o < 3) {
      let e5 = this.findHarvest();
      e5 && (o = 2.4, a = this.mkTask(`harvest`, (e5.minX + e5.maxX) / 2, (e5.minZ + e5.maxZ) / 2, 14, null, null, e5));
    }
    if (this.armedSlot() >= 0 && t2.hp + t2.shield >= 70 && this.graceT <= 0) {
      let e5 = jS() * n2.hear, t3 = kS();
      for (let s3 of MS) {
        let c = Math.hypot(s3.x - r, s3.z - i);
        if (c > e5 || c < 12 || G.time - s3.t > 6 || !this.safe(s3.x, s3.z)) continue;
        let l2 = 1.2 + n2.brave * 3.6 * (t3 > 1 ? 1.3 : 0.75) - c / e5;
        l2 > o && (o = l2, a = this.mkTask(`hunt`, s3.x + K(-6, 6), s3.z + K(-6, 6), c / 6 + 8, null, null, null));
      }
    }
    if (this.arch === `sniper` && this.hasCat(`snp`) && G.time > this.perchT && o < 3) {
      this.perchT = G.time + K(25, 45);
      let e5 = t2.pos.y + 4, n3 = 0, s3 = 0, c = false;
      for (let t3 = 0; t3 < 8; t3++) {
        let t4 = K(0, Math.PI * 2), a2 = K(15, 55), o2 = r + Math.cos(t4) * a2, l2 = i + Math.sin(t4) * a2, u = ay(o2, l2);
        u > e5 && this.safe(o2, l2) && (e5 = u, n3 = o2, s3 = l2, c = true);
      }
      c && (o = 3, a = this.mkTask(`perch`, n3, s3, K(25, 40), null, null, null));
    }
    return a || !e4 ? a : this.roamTask();
  }
  roamTask() {
    let e4 = this.f, t2 = G.storm;
    for (let n2 = 0; n2 < 10; n2++) {
      let n3 = K(0, Math.PI * 2);
      Pp(0.6) && (n3 = Math.atan2(t2.tz - e4.pos.z, t2.tx - e4.pos.x) + K(-1.1, 1.1));
      let r = K(25, 85), i = e4.pos.x + Math.cos(n3) * r, a = e4.pos.z + Math.sin(n3) * r;
      if (ay(i, a) > 0.6 && this.safe(i, a)) return this.mkTask(`roam`, i, a, 30, null, null, null);
    }
    return this.mkTask(`roam`, t2.tx + K(-10, 10), t2.tz + K(-10, 10), 30, null, null, null);
  }
  findHarvest() {
    let e4 = this.f, t2 = e4.pos.x, n2 = e4.pos.z;
    By(t2 - 18, e4.pos.y - 2, n2 - 18, t2 + 18, e4.pos.y + 3, n2 + 18, hS);
    let r = null, i = 1 / 0;
    for (let a = 0; a < 3; a++) {
      r = null, i = 1 / 0;
      for (let e5 of hS) {
        let a3 = e5.owner;
        if (!a3 || !a3.alive || a3.yieldTotal <= 0 || a3 instanceof Px || !e5.solid || this.ignored(e5)) continue;
        let o2 = Math.hypot((e5.minX + e5.maxX) / 2 - t2, (e5.minZ + e5.maxZ) / 2 - n2);
        o2 < i && (i = o2, r = e5);
      }
      if (!r) return null;
      let a2 = (r.minX + r.maxX) / 2, o = (r.minZ + r.maxZ) / 2, s2 = Cp(e4.pos.y + 1, r.minY + 0.2, r.maxY - 0.2), c = a2 - t2, l2 = s2 - (e4.pos.y + 1), u = o - n2, d = Math.hypot(c, l2, u);
      if (d < 1 || !Ly(t2, e4.pos.y + 1, n2, c / d, l2 / d, u / d, d, gS) || gS.collider === r || gS.collider && gS.collider.owner === r.owner) return r;
      this.ignoreBox(r, 20);
    }
    return null;
  }
  surfDist(e4) {
    let t2 = this.f;
    if (e4.r > 0) return Math.hypot(e4.cx - t2.pos.x, e4.cz - t2.pos.z) - e4.r;
    let n2 = Cp(t2.pos.x, e4.minX, e4.maxX), r = Cp(t2.pos.z, e4.minZ, e4.maxZ);
    return Math.hypot(n2 - t2.pos.x, r - t2.pos.z);
  }
  openFrame(e4) {
    let t2 = this.f;
    if (t2.wishX = t2.wishZ = 0, t2.sprint = false, this.openT -= e4, this.openT > 0) return;
    let n2 = this.task ? this.task.box : null;
    n2 && !n2.opened && Math.hypot(n2.pos.x - t2.pos.x, n2.pos.z - t2.pos.z) < 2.8 && Math.abs(n2.pos.y - t2.pos.y) < 2 && Xx.open(n2, t2), this.task = null, this.rescanT = 0;
  }
  harvestFrame(e4) {
    let t2 = this.f, n2 = this.task ? this.task.col : null;
    if (this.harvestT -= e4, t2.wishX = t2.wishZ = 0, t2.sprint = false, !n2 || !n2.owner || !n2.owner.alive || this.matsTotal() >= this.P.matWant) {
      this.harvestT = 0, this.task = null;
      return;
    }
    let r = n2.r > 0 ? n2.cx : Cp(t2.pos.x, n2.minX, n2.maxX), i = n2.r > 0 ? n2.cz : Cp(t2.pos.z, n2.minZ, n2.maxZ), a = Cp(t2.eyeY - 0.3, n2.minY + 0.2, n2.maxY - 0.2), o = r - t2.pos.x, s2 = a - t2.eyeY, c = i - t2.pos.z, l2 = Math.hypot(o, s2, c) || 1;
    t2.yaw = Ap(t2.yaw, Math.atan2(o, c), 10, e4), t2.swingCd <= 0 && this.swing(o / l2, s2 / l2, c / l2, 3.2), this.harvestT <= 0 && (this.task = null);
  }
  swing(e4, t2, n2, r) {
    let i = this.f;
    if (i.active !== -1) {
      if (i.useT > 0) return null;
      i.select(-1);
    }
    return i.swingCd = 0.5, i.char.swing(), rb(i, i.pos.x, i.eyeY, i.pos.z, e4, t2, n2, r);
  }
  setGoal(e4, t2) {
    (!this.hasGoal || Math.abs(e4 - this.gx) > 1.5 || Math.abs(t2 - this.gz) > 1.5) && (this.route && !this.routeSafe && (this.route = 0), this.steer = 0), this.gx = e4, this.gz = t2, this.hasGoal = true;
  }
  clearPath() {
    this.path.length = 0, this.pi = 0;
  }
  navTo(e4, t2, n2, r) {
    if (this.chain || this.digT > 0 || this.route && this.routeSafe) return;
    let i = this.f, a = t2 - i.pos.y;
    if (this.pi < this.path.length && Math.abs(this.pgx - e4) < 2 && Math.abs(this.pgz - n2) < 2 && Math.abs(this.pgy - t2) < 2) return;
    let o = _C(i.pos.x, i.pos.y, i.pos.z);
    if (a < -2.6 && a > -5.5 && r < 3 && i.grounded && (!o || Pp(0.5))) {
      this.clearPath(), this.digT = 3.2;
      return;
    }
    if (r > 32) {
      o && this.navExit();
      return;
    }
    if (Math.abs(a) < 2 && !o && !gC(e4, t2, n2) || G.time < this.navRetryT || !i.grounded) return;
    let s2 = yC(i.pos.x, i.pos.y, i.pos.z, e4, t2, n2, false, this.path);
    if (s2 === 0 && o && r > 8 && (s2 = yC(i.pos.x, i.pos.y, i.pos.z, e4, t2, n2, true, this.path)), s2 > 0) {
      this.startPath(e4, t2, n2);
      return;
    }
    if (this.clearPath(), s2 < 0) {
      this.navRetryT = G.time + K(0.3, 0.6);
      return;
    }
    if (this.navRetryT = G.time + 2.5, Math.abs(a) < 2) return;
    let c = this.task;
    if (c) {
      let e5 = c.box ?? c.item;
      e5 && this.ignoreBox(e5, 45), this.task = null, this.hasGoal = false;
    }
  }
  navExit() {
    if (!this.hasGoal || this.pi < this.path.length || this.chain || this.digT > 0 || this.route || G.time < this.navRetryT) return;
    let e4 = this.f;
    if (!e4.grounded || Math.hypot(this.gx - e4.pos.x, this.gz - e4.pos.z) < 6 || !_C(e4.pos.x, e4.pos.y, e4.pos.z)) return;
    let t2 = Math.max(0.5, ay(this.gx, this.gz)), n2 = gC(this.gx, t2, this.gz) && Math.hypot(this.gx - e4.pos.x, this.gz - e4.pos.z) < 20, r = yC(e4.pos.x, e4.pos.y, e4.pos.z, this.gx, t2, this.gz, !n2, this.path);
    r > 0 ? this.startPath(this.gx, t2, this.gz) : (this.clearPath(), this.navRetryT = G.time + (r < 0 ? K(0.3, 0.6) : 4));
  }
  startPath(e4, t2, n2) {
    this.pi = 0, this.pgx = e4, this.pgy = t2, this.pgz = n2, this.pathT = G.time + 5 + this.path.length * 1.4, this.steer = 0, this.route = 0, this.routeSafe = false, this.avoidT = 0;
  }
  pathTarget() {
    let e4 = this.f;
    if (this.pi >= this.path.length) return null;
    if (G.time > this.pathT) return this.clearPath(), this.navRetryT = G.time + 2, null;
    for (; ; ) {
      let t2 = this.path[this.pi], n2 = Math.hypot(t2.x - e4.pos.x, t2.z - e4.pos.z), r = e4.pos.y - t2.y;
      if (n2 < (t2.ramp ? 0.75 : 1.2) && Math.abs(r) < 2.4) {
        if (++this.pi >= this.path.length) return this.clearPath(), null;
      } else return e4.grounded && (t2.ramp ? n2 < 1.6 && r < -2.6 : r < -3.3) ? (this.clearPath(), this.navRetryT = 0, null) : t2;
    }
  }
  computeSteer() {
    if (this.steer = 0, !this.hasGoal || this.route || this.chain || this.pi < this.path.length) return;
    let e4 = this.f, t2 = this.gx - e4.pos.x, n2 = this.gz - e4.pos.z, r = Math.hypot(t2, n2);
    if (r < 8 || ay(this.gx, this.gz) < 0.2) return;
    t2 /= r, n2 /= r;
    let i = Math.min(r, 14);
    if (!this.dry(t2, n2, i)) {
      for (let e5 of dS) {
        let r2 = e5 * this.steerSide, a = Math.cos(r2), o = Math.sin(r2);
        if (this.dry(t2 * a - n2 * o, t2 * o + n2 * a, i)) {
          this.steer = r2;
          return;
        }
      }
      this.steerSide = -this.steerSide;
    }
  }
  dry(e4, t2, n2) {
    let r = this.f, i = r.pos.y + 1;
    return Oy(r.pos.x + e4 * n2 * 0.5, r.pos.z + t2 * n2 * 0.5, i) > 0.1 && Oy(r.pos.x + e4 * n2, r.pos.z + t2 * n2, i) > 0.1;
  }
  travel(e4) {
    let t2 = this.f;
    if (t2.aiming = false, t2.crouch = false, this.chain) {
      this.climbMove(), this.runGun(e4);
      return;
    }
    if (!this.hasGoal || t2.useT > 0) {
      t2.wishX = t2.wishZ = 0, t2.sprint = false, this.runGun(e4);
      return;
    }
    let n2 = this.gx, r = this.gz, i = this.route && this.routeSafe ? null : this.pathTarget();
    i ? (n2 = i.x, r = i.z) : this.route && (G.time > this.routeT ? (this.route = 0, this.routeSafe = false) : (this.route === 1 && (n2 = this.rx, r = this.rz, Math.hypot(n2 - t2.pos.x, r - t2.pos.z) < 0.8 && (this.route = 2)), this.route === 2 && (n2 = this.rx2, r = this.rz2, Math.hypot(n2 - t2.pos.x, r - t2.pos.z) < 0.9 && (this.route = 0, this.routeSafe = false, n2 = this.gx, r = this.gz))));
    let a = n2 - t2.pos.x, o = r - t2.pos.z, s2 = Math.hypot(a, o);
    if (s2 < 1 && !this.route && !i) {
      t2.wishX = t2.wishZ = 0, t2.sprint = false, this.state === `storm` && (this.hasGoal = false), this.runGun(e4);
      return;
    }
    if (a /= s2, o /= s2, this.steer !== 0 && !this.route && !i) {
      let e5 = Math.cos(this.steer), t3 = Math.sin(this.steer), n3 = a * e5 - o * t3;
      o = a * t3 + o * e5, a = n3;
    }
    if (this.avoidT > 0) {
      this.avoidT -= e4;
      let t3 = -o * this.avoidDir, n3 = a * this.avoidDir;
      a = a * 0.3 + t3, o = o * 0.3 + n3;
      let r2 = Math.hypot(a, o) || 1;
      a /= r2, o /= r2;
    }
    let c = s2 < 2.5 && !this.route && !i ? 0.5 + s2 / 5 : 1;
    t2.wishX = a * c, t2.wishZ = o * c, t2.sprint = i ? !i.ramp && this.path.length - this.pi > 3 : !this.route && (this.state === `storm` || s2 > 14), this.runGun(e4) || (t2.yaw = Ap(t2.yaw, Math.atan2(a, o), 9, e4));
  }
  runGun(e4) {
    let t2 = this.f, n2 = this.target;
    if (!n2 || !n2.alive || !this.los || this.tdist > 45 || t2.useT > 0) return false;
    let r = n2.pos.x - t2.pos.x, i = n2.pos.z - t2.pos.z, a = Math.hypot(r, i), o = n2.pos.y + 1.3 - t2.eyeY;
    return t2.yaw = Ap(t2.yaw, Math.atan2(r, i), 10, e4), t2.pitch = Math.atan2(o, Math.max(a, 0.5)), this.reactT -= e4, this.wantSlot !== t2.active && this.swapT <= 0 && this.wantSlot >= 0 && (t2.select(this.wantSlot), this.swapT = this.D.swap + 0.1), this.shoot(e4, a, r, o, i), true;
  }
  guardEdge() {
    let e4 = this.f;
    if (!e4.grounded || this.routeSafe || G.time < this.dropOkT) return;
    let t2 = Math.hypot(e4.wishX, e4.wishZ);
    if (t2 < 0.2) return;
    let n2 = e4.wishX / t2, r = e4.wishZ / t2, i = e4.pos.x + n2 * 1.5, a = e4.pos.z + r * 1.5, o = Oy(i, a, e4.pos.y + 0.5);
    if (e4.pos.y - o <= uS) return;
    let s2 = bS(e4.pos.x), c = bS(e4.pos.z), l2 = bS(i), u = bS(a);
    l2 !== s2 && fC(s2, c, l2 > s2 ? 1 : 3, e4.pos.y, true) || u !== c && fC(s2, c, u > c ? 0 : 2, e4.pos.y, true) || (e4.wishX = e4.wishZ = 0, e4.sprint = false, this.edgeT = G.time, this.edgeDir = CS(n2, r), this.edgeHeld = true);
  }
  handleEdge() {
    if (!(this.bq.length || this.digT > 0 || this.route || this.pi < this.path.length)) {
      if (this.edgeN++, this.edgeN > 12) this.dropOkT = G.time + 1.2, this.edgeN = 0;
      else {
        if (this.hasGoal && this.f.grounded && _C(this.f.pos.x, this.f.pos.y, this.f.pos.z)) {
          let e4 = yC(this.f.pos.x, this.f.pos.y, this.f.pos.z, this.gx, Math.max(0.5, ay(this.gx, this.gz)), this.gz, true, this.path);
          if (e4 > 0) {
            this.startPath(this.gx, ay(this.gx, this.gz), this.gz), this.edgeN = 0;
            return;
          }
          if (this.clearPath(), e4 < 0) return;
        }
        this.D.rush && this.matsTotal() >= 10 && this.rampDown(this.edgeDir) || (this.digT = 3.2);
      }
    }
  }
  dig(e4) {
    let t2 = this.f;
    if (this.digT -= e4, t2.wishX = t2.wishZ = 0, t2.sprint = false, t2.swingCd > 0 || !t2.grounded || t2.useT > 0) return;
    let n2 = this.swing(0, -1, 0, 3);
    !n2 || !n2.target ? ++this.digMiss >= 2 && (this.digT = 0, this.digMiss = 0, this.edgeN += 4) : this.digMiss = 0;
  }
  unstick(e4) {
    let t2 = this.f, n2 = Math.hypot(t2.pos.x - this.lx, t2.pos.z - this.lz);
    this.lx = t2.pos.x, this.lz = t2.pos.z;
    let r = Math.hypot(t2.wishX, t2.wishZ) > 0.45 && t2.useT <= 0, i = this.state !== `fight` || this.tac === `push` || this.tac === `retreat` || this.tac === `climb`, a = this.edgeHeld || this.digT > 0 && this.hasGoal;
    if (this.edgeHeld = false, this.winT += e4, (r || a) && i && (this.winWant += e4), this.winT >= 1) {
      let e5 = Math.hypot(t2.pos.x - this.winX, t2.pos.z - this.winZ);
      this.winWant > 0.5 * this.winT && e5 < 1 ? this.stuckS += this.winT : (e5 > 1.6 || this.winWant < 0.2) && (this.stuckS = Math.max(0, this.stuckS - 2));
      let n3 = Math.hypot(t2.pos.x - this.ancX, t2.pos.y - this.ancY, t2.pos.z - this.ancZ) > 4, r2 = !this.hasGoal || this.openT > 0 || this.harvestT > 0 || this.digT > 0 || t2.useT > 0 || this.state === `fight` || this.state === `heal` || this.bq.length > 0;
      if (n3 || r2) n3 && this.ancG && (this.bcX = this.ancX, this.bcY = this.ancY, this.bcZ = this.ancZ), this.ancX = t2.pos.x, this.ancY = t2.pos.y, this.ancZ = t2.pos.z, this.ancT = G.time, this.ancG = t2.grounded;
      else {
        let e6 = G.time - this.ancT;
        this.stuckS = Math.max(this.stuckS, e6 > 6 ? 7 : e6 > 5 ? 5.5 : e6 > 4 ? 4.5 : e6 > 2.8 ? 2.5 : 0);
      }
      this.winT = 0, this.winWant = 0, this.winX = t2.pos.x, this.winZ = t2.pos.z, this.escalate();
    }
    if (!r || n2 > 1.6 * e4) {
      this.quickT = Math.max(0, this.quickT - e4 * 2);
      return;
    }
    this.quickT += e4, this.quickT > 0.25 && t2.grounded && (t2.wantJump = true), this.quickT > 0.8 && this.avoidT <= 0 && (this.avoidT = K(0.7, 1.5), this.avoidDir = Pp(0.5) ? 1 : -1);
    let o = t2.blockedBy, s2 = o ? o.owner : null;
    if (o && s2 && s2.alive && t2.swingCd <= 0 && !(this.state === `fight` && this.los)) {
      let e5 = s2 instanceof Px && s2.owner === t2 ? 0.15 : s2 instanceof Px ? s2.owner ? 0.5 : 1 : 1.3;
      if (this.quickT > e5) {
        let e6 = Cp(t2.pos.x, o.minX, o.maxX), n3 = Cp(t2.pos.z, o.minZ, o.maxZ), r2 = Cp(t2.eyeY - 0.5, o.minY + 0.2, o.maxY - 0.2), i2 = e6 - t2.pos.x, a2 = n3 - t2.pos.z;
        Math.hypot(i2, a2) < 0.05 && (i2 = t2.wishX, a2 = t2.wishZ);
        let s3 = r2 - t2.eyeY, c = Math.hypot(i2, s3, a2) || 1;
        t2.yaw = Math.atan2(i2, a2), this.swing(i2 / c, s3 / c, a2 / c, 3.2);
      }
    }
  }
  escalate() {
    let e4 = this.stuckS, t2 = this.f;
    if (!(e4 < 2.5)) {
      if (e4 < 3.5) {
        if (this.hasGoal && this.state !== `fight` && this.pi >= this.path.length && t2.grounded) {
          let e5 = this.task ? this.task.box ?? this.task.item : null, n2 = e5 ? e5.pos.y : Math.max(0.5, ay(this.gx, this.gz)), r = !e5 && _C(t2.pos.x, t2.pos.y, t2.pos.z) && !gC(this.gx, n2, this.gz);
          if (yC(t2.pos.x, t2.pos.y, t2.pos.z, this.gx, n2, this.gz, r, this.path) > 0 && this.path.length > 1) {
            this.startPath(this.gx, n2, this.gz), this.stuckS = 1;
            return;
          }
          this.clearPath();
        }
        if (this.clearPath(), _C(t2.pos.x, t2.pos.y, t2.pos.z)) {
          this.navRetryT = G.time + 1.2, this.avoidT = K(0.8, 1.4), this.avoidDir = Pp(0.5) ? 1 : -1;
          return;
        }
        this.navRetryT = G.time + 4, this.hasGoal && !this.chain && this.D.rush && this.matsTotal() >= 20 && !this.ceiling() && this.startClimb(CS(this.gx - t2.pos.x, this.gz - t2.pos.z), 2, t2.pos.y + 6), this.chain || this.detour();
      } else if (e4 >= 4.5 && e4 < 5.5) _C(t2.pos.x, t2.pos.y, t2.pos.z) ? (this.clearPath(), this.navRetryT = 0, this.avoidT = K(0.8, 1.4), this.avoidDir = -this.avoidDir) : this.detour();
      else if (e4 >= 5.5 && e4 < 6.5) {
        let e5 = this.task;
        if (e5) {
          let t3 = e5.box ?? e5.item ?? e5.col;
          t3 && this.ignoreBox(t3, 40);
        }
        this.task = null, this.hasGoal = false, this.chain = null, this.route = 0, this.clearPath();
      } else if (e4 >= 7) {
        let e5 = this.task;
        if (e5) {
          let t3 = e5.box ?? e5.item ?? e5.col;
          t3 && this.ignoreBox(t3, 40);
        }
        let n2 = false;
        for (let e6 of G.fighters) if (e6.isPlayer && e6.alive && Math.hypot(e6.pos.x - t2.pos.x, e6.pos.z - t2.pos.z) < 60) {
          n2 = true;
          break;
        }
        n2 || (t2.pos.set(this.bcX, this.bcY + 0.05, this.bcZ), t2.vel.set(0, 0, 0), this.teleports++), this.lx = this.winX = this.ancX = t2.pos.x, this.lz = this.winZ = this.ancZ = t2.pos.z, this.ancY = t2.pos.y, this.ancT = G.time, this.ancG = true, this.stuckS = 0, this.chain = null, this.route = 0, this.routeSafe = false, this.task = null, this.hasGoal = false, this.bq.length = 0, this.clearPath();
      }
    }
  }
  detour() {
    let e4 = this.f, t2 = Math.atan2(this.gz - e4.pos.z, this.gx - e4.pos.x) + (Pp(0.5) ? 1 : -1) * K(1.1, 2), n2 = K(6, 12);
    this.rx2 = e4.pos.x + Math.cos(t2) * n2, this.rz2 = e4.pos.z + Math.sin(t2) * n2, this.route = 2, this.routeT = G.time + 3.5, this.routeSafe = false, this.clearPath(), this.hasGoal = true, !this.gx && !this.gz && (this.gx = this.rx2, this.gz = this.rz2);
  }
}, xC = [{ id: `ranger`, name: `Trailblazer`, color: `#7c9a3c`, fem: false, build: 1, tone: 14919548, top: 7774268, pants: 10783836, boots: 6964264, hair: 5912352 }, { id: `sentinel`, name: `Sentinel`, color: `#4b5d43`, fem: false, build: 2, tone: 8343863, top: 5926476, pants: 4609084, boots: 2434859, hair: 1577486 }, { id: `neon`, name: `Glitch`, color: `#19d8ff`, fem: true, build: 0, tone: 16109748, top: 3422822, pants: 2896214, boots: 3817840, hair: 15922431 }, { id: `dune`, name: `Dune Runner`, color: `#d9b06a`, fem: true, build: 1, tone: 12155984, top: 14861450, pants: 8808778, boots: 6965806, hair: 12603436 }, { id: `frost`, name: `Frostbite`, color: `#f1f3f6`, fem: false, build: 1, tone: 16111040, top: 16054009, pants: 10466508, boots: 3883856, hair: 16742943 }, { id: `kick`, name: `Kickflip`, color: `#ff5fb0`, fem: true, build: 1, tone: 9329211, top: 8474848, pants: 3820138, boots: 16053492, hair: 16736176 }, { id: `valor`, name: `Valor`, color: `#b9c2cf`, fem: false, build: 2, tone: 14725264, top: 13029339, pants: 7305352, boots: 10134448, hair: 13029339 }, { id: `orbit`, name: `Orbit`, color: `#2a6cf0`, fem: false, build: 1, tone: 7293491, top: 16053751, pants: 15264752, boots: 13818080, hair: 16053751 }, { id: `rumble`, name: `Rumble`, color: `#e8402e`, fem: false, build: 2, tone: 13603426, top: 15220782, pants: 2372970, boots: 16053492, hair: 16747039 }, { id: `rex`, name: `Rex Onesie`, color: `#4fbf4a`, fem: false, build: 1, tone: 15910048, top: 5620812, pants: 5620812, boots: 4168250, hair: 5620812 }, { id: `patch`, name: `Patch`, color: `#22b3a8`, fem: true, build: 1, tone: 7555635, top: 15659765, pants: 4151400, boots: 2764342, hair: 1708560 }, { id: `shade`, name: `Nightshade`, color: `#8a4fe0`, fem: true, build: 0, tone: 13802610, top: 2893380, pants: 2235699, boots: 2893372, hair: 6963120 }, { id: `valkyrie`, name: `Valkyrie`, color: `#f5f0e0`, fem: true, build: 1, tone: 16109748, top: 16777215, pants: 16772865, boots: 16777215, hair: 16772865 }, { id: `mirage`, name: `Mirage`, color: `#ff7ad9`, fem: true, build: 0, tone: 15595584, top: 16746495, pants: 11115711, boots: 16746495, hair: 16746495 }, { id: `sable`, name: `Sable`, color: `#e8402e`, fem: true, build: 1, tone: 13802610, top: 2893380, pants: 16711680, boots: 2893380, hair: 16711680 }, { id: `aurora`, name: `Aurora`, color: `#3ce0c0`, fem: true, build: 0, tone: 16109748, top: 5636095, pants: 3715072, boots: 5636095, hair: 5636095 }, { id: `ember`, name: `Ember`, color: `#ff8c1a`, fem: true, build: 1, tone: 14919548, top: 16753920, pants: 11141120, boots: 16753920, hair: 16753920 }, { id: `titan`, name: `Titan`, color: `#5a7a9a`, fem: false, build: 2, tone: 8343863, top: 5926476, pants: 4609084, boots: 2434859, hair: 1577486 }, { id: `viper`, name: `Viper`, color: `#3cb043`, fem: false, build: 1, tone: 9329211, top: 3715072, pants: 2893380, boots: 3715072, hair: 2893380 }, { id: `cobalt`, name: `Cobalt`, color: `#2a6cf0`, fem: false, build: 1, tone: 14725264, top: 3119615, pants: 13816575, boots: 3119615, hair: 13816575 }, { id: `onyx`, name: `Onyx`, color: `#1a1a1a`, fem: false, build: 2, tone: 13802610, top: 2893380, pants: 2893380, boots: 16772865, hair: 2893380 }, { id: `blaze`, name: `Blaze`, color: `#ff5a1a`, fem: false, build: 1, tone: 14919548, top: 16711680, pants: 16753920, boots: 16711680, hair: 16753920 }, { id: `nova`, name: `Nova`, color: `#00e5ff`, fem: true, build: 0, tone: 16109748, top: 16777215, pants: 2896214, boots: 16777215, hair: 16777215 }, { id: `vortex`, name: `Vortex`, color: `#7b2fff`, fem: false, build: 2, tone: 13802610, top: 2893380, pants: 2235699, boots: 2893380, hair: 2893380 }, { id: `phoenix`, name: `Phoenix`, color: `#ff8c1a`, fem: true, build: 0, tone: 14919548, top: 16753920, pants: 16711680, boots: 16753920, hair: 16711680 }, { id: `ghost`, name: `Ghost`, color: `#e8ecf1`, fem: false, build: 0, tone: 16111040, top: 16777215, pants: 13816575, boots: 16777215, hair: 16777215 }, { id: `storm`, name: `Storm`, color: `#4a90e2`, fem: true, build: 0, tone: 15595584, top: 3119615, pants: 4609084, boots: 3119615, hair: 3119615 }, { id: `lunar`, name: `Lunar`, color: `#c8b8ff`, fem: false, build: 0, tone: 16109748, top: 13816575, pants: 2893380, boots: 13816575, hair: 16777215 }, { id: `solar`, name: `Solar`, color: `#ffd700`, fem: true, build: 1, tone: 14919548, top: 16777215, pants: 16753920, boots: 16777215, hair: 16753920 }, { id: `webhero`, name: `Web Hero`, color: `#e33c40`, fem: false, build: 1, tone: 0xba383a, top: 0xd62d35, pants: 0x284686, boots: 0xc72d37, hair: 0xb42e31 }, { id: `cosmicllama`, name: `Cosmic Llama`, color: `#db7de7`, fem: true, build: 1, tone: 0x9f68a8, top: 0x733f98, pants: 0x453c75, boots: 0x252b55, hair: 0xf0a2e8 }, { id: `foundation`, name: `Foundation Guard`, color: `#68f5c1`, fem: false, build: 2, tone: 0x83614d, top: 0x37474a, pants: 0x26353c, boots: 0x222f35, hair: 0x26353c }, { id: `islandscout`, name: `Island Scout`, color: `#f4c75f`, fem: true, build: 1, tone: 0xc88d68, top: 0x698469, pants: 0x3e5f50, boots: 0x594432, hair: 0x503528 }, { id: `icewarden`, name: `Ice Warden`, color: `#a6e7ff`, fem: false, build: 1, tone: 0xd4b398, top: 0x587c92, pants: 0x304959, boots: 0x304958, hair: 0xb1d1d7 }, { id: `echo`, name: `Echo`, color: `#3ce0c0`, fem: false, build: 0, tone: 9329211, top: 3715072, pants: 2896214, boots: 3715072, hair: 3715072 }], SC = Math.PI, CC = SC * 2, wC = 0.96, TC = -0.05, EC = 0.415, DC = 0.415, OC = 0.08, kC = 0.08, AC = 0.17, jC = 0.285, MC = 0.155, NC = 0.212, PC = 0.29, FC = 0.3, IC = -0.88, LC = 0.97, RC = 0.06, zC = 0.42, BC = 0.06, VC = 0.2, HC = 0.095, UC = 0.161, WC = Math.hypot(OC, VC), GC = Math.atan2(OC, VC), KC = Math.hypot(OC, HC), qC = Math.atan2(HC, OC), JC = 0.818, YC = 0.62, XC = 0.5, ZC = 0.3, QC = 0.34, $C = (e4, t2, n2) => e4 < t2 ? t2 : e4 > n2 ? n2 : e4, Y = (e4, t2, n2) => e4 + (t2 - e4) * n2, ew = (e4, t2, n2) => {
  let r = $C((n2 - e4) / (t2 - e4), 0, 1);
  return r * r * (3 - 2 * r);
}, tw = (e4, t2, n2, r) => t2 + (e4 - t2) * Math.exp(-n2 * r);
function nw(e4) {
  return e4 = (e4 + SC) % CC, e4 < 0 && (e4 += CC), e4 - SC;
}
var rw = new R(), iw = new R(), aw = new R(), ow = new R(), sw = new R(), cw = new R(), lw = new z();
function uw(e4, t2, n2, r, i, a, o, s2, c, l2, u) {
  rw.set(n2, r, i);
  let d = rw.length();
  d > 1e-5 ? rw.multiplyScalar(1 / d) : (rw.set(0, -1, 0), d = 1e-5);
  let f = $C(d, Math.abs(c - l2) + 0.03, c + l2 - 3e-3);
  iw.set(a, o, s2), iw.addScaledVector(rw, -iw.dot(rw)), iw.lengthSq() < 1e-7 && (iw.set(0, 0, u ? -1 : 1).addScaledVector(rw, u ? rw.z : -rw.z), iw.lengthSq() < 1e-7 && iw.set(1, 0, 0).addScaledVector(rw, -rw.x)), iw.normalize();
  let p = $C((c * c + f * f - l2 * l2) / (2 * c * f), -1, 1), m = Math.sqrt(1 - p * p);
  aw.copy(rw).multiplyScalar(p).addScaledVector(iw, m), sw.copy(aw).negate(), u ? ow.crossVectors(rw, iw) : ow.crossVectors(iw, rw), cw.crossVectors(ow, sw), e4.quaternion.setFromRotationMatrix(lw.makeBasis(ow, sw, cw));
  let h = SC - Math.acos($C((c * c + l2 * l2 - f * f) / (2 * c * l2), -1, 1));
  t2.rotation.set(u ? -h : h, 0, 0);
}
function dw(e4) {
  return e4.fem ? { shX: e4.build === 0 ? 0.176 : 0.184, hipX: 0.092 } : e4.build === 2 ? { shX: 0.222, hipX: 0.1 } : { shX: 0.2, hipX: 0.095 };
}
var fw = [`hips`, `spine`, `chest`, `head`, `eyes`, `armU_L`, `armL_L`, `armU_R`, `armL_R`, `legU_L`, `legL_L`, `legU_R`, `legL_R`, `foot_L`, `foot_R`], pw = /* @__PURE__ */ new Map(), mw = /* @__PURE__ */ new Map(), hw = new z();
function gw(e4, t2) {
  let n2 = null;
  return e4.traverse((e5) => {
    let r = e5;
    !n2 && r.isSkinnedMesh && (r.userData.name === t2 || r.name === t2) && (n2 = r);
  }), n2;
}
function _w(e4, t2) {
  let n2 = t2 + `_`, r = e4.skeleton.bones.map((e5) => {
    let t3 = String(e5.userData.name ?? e5.name), r2 = fw.indexOf(t3.startsWith(n2) ? t3.slice(n2.length) : t3);
    if (r2 < 0) throw Error(`unknown bone ${t3}`);
    return r2;
  }), i = e4.geometry, a = i.getAttribute(`skinIndex`), o = new Uint8Array(a.count * 4);
  for (let e5 = 0; e5 < a.count; e5++) for (let t3 = 0; t3 < 4; t3++) o[e5 * 4 + t3] = r[a.getComponent(e5, t3)] ?? 0;
  let s2 = new Hr();
  s2.setIndex(i.getIndex());
  for (let e5 of [`position`, `normal`, `color`, `skinWeight`]) {
    let t3 = i.getAttribute(e5);
    t3 && s2.setAttribute(e5, t3);
  }
  return s2.setAttribute(`skinIndex`, new Or(o, 4)), s2.name = e4.name, s2;
}
function vw() {
  return null;
}
function yw(e4, t2) {
  let n2 = new B(t2), r = e4.getAttribute(`position`).count, i = new Float32Array(r * 3);
  for (let e5 = 0; e5 < r; e5++) i[e5 * 3] = n2.r, i[e5 * 3 + 1] = n2.g, i[e5 * 3 + 2] = n2.b;
  return e4.setAttribute(`color`, new Dr(i, 3)), e4;
}
function bw(e4, t2, n2, r) {
  return yw(new Ra(e4, t2, 3, 10).translate(0, r, 0), n2);
}
var xw = /* @__PURE__ */ new Map();
function Sw(e4) {
  let t2 = xw.get(e4.id);
  if (!t2) {
    let n2 = new gs(0.115, 14, 10).translate(0, MC, 5e-3), r = new La(0.1, 0.09, 0.24).translate(0, -0.415 - 0.035, 0.045);
    t2 = { hips: bw(0.13, 0.06, e4.pants, -0.04), torso: bw(0.14, 0.24, e4.top, 0.2), head: yw(n2, e4.tone), armU: bw(0.052, 0.22999999999999998, e4.top, -0.29 / 2), armL: bw(0.045, 0.26, e4.tone, -0.3 / 2), legU: bw(0.075, 0.33499999999999996, e4.pants, -0.415 / 2), legL: yw(Cw(new Ra(0.058, 0.31499999999999995, 3, 10).translate(0, -0.415 / 2, 0), r), e4.boots) }, xw.set(e4.id, t2);
  }
  return t2;
}
function Cw(e4, t2) {
  let n2 = e4.index ? e4.toNonIndexed() : e4, r = t2.index ? t2.toNonIndexed() : t2, i = new Hr();
  for (let e5 of [`position`, `normal`]) {
    let t3 = n2.getAttribute(e5).array, a = r.getAttribute(e5).array, o = new Float32Array(t3.length + a.length);
    o.set(t3), o.set(a, t3.length), i.setAttribute(e5, new Dr(o, 3));
  }
  return i;
}
var ww = null, Tw = null;
function Ew() {
  return Tw ??= buildBlueprintTabletGeo();
}
var Dw = (() => {
  let e4 = new Os({ vertexColors: true, roughness: 0.74, metalness: 0 });
  return e4.onBeforeCompile = (e5) => {
    e5.fragmentShader = e5.fragmentShader.replace(`#include <emissivemap_fragment>`, `#include <emissivemap_fragment>
      {
        float ndv = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0);
        float rim = pow(1.0 - ndv, 3.2);
        totalEmissiveRadiance += mix(diffuseColor.rgb, vec3(0.62, 0.78, 1.0), 0.45) * rim * 0.42;
        float lum = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
        totalEmissiveRadiance += diffuseColor.rgb * (0.06 + 0.16 * ndv) * mix(2.4, 0.5, smoothstep(0.03, 0.45, lum));
      }`);
  }, e4.customProgramCacheKey = () => `hero-fill`, e4;
})(), Ow = new bi({ color: 3844351, toneMapped: false });
Ow.color.multiplyScalar(2.6);
var kw = 0, Aw = 1, jw = 2, Mw = 3, Nw = 4, Pw = 5, Fw = 6, Iw = 7, Lw = 8, Rw = 9, zw = 10, Bw = 11, Vw = 12, Hw = 13, Uw = 14, Ww = 15, Gw = 16, Kw = 17, qw = 18, Jw = 19, Yw = 31, Xw = 43, Zw = 44, Qw = 45, $w = 47, eT = 0, tT = 7, nT = 14, rT = 15, iT = 16, aT = new It().setFromEuler(new gn(SC / 2, 0, 0)), oT = new It().setFromEuler(new gn(-1.05, 0.15, 0.25, `YXZ`)), sT = new It().setFromEuler(new gn(1.3, 0.3, 0.4, `YXZ`)), cT = new It().setFromEuler(new gn(0.55, 1.05, 0, `YXZ`)), lT = new It().setFromEuler(new gn(0.6, 0.2, 0, `YXZ`)), uT = new It().setFromEuler(new gn(-0.55, 0.15, -0.15, `YXZ`)), dT = new gn(), fT = new R(), pT = new R(), mT = new R(), hT = new R(), gT = new It(), _T = new It(), vT = new It(), yT = new R(), bT = new R(), xT = new It(), ST = new It();
function CT(e4, t2, n2, r, i, a, o, s2) {
  e4[t2] = n2, e4[t2 + 1] = r, e4[t2 + 2] = i, e4[t2 + 3] = a, e4[t2 + 4] = o, e4[t2 + 5] = s2;
}
var wT = [0, 2, 0, 0, 0, 0.12, 3, 0.03, -0.01, 0, 0.22, 3, 0.03, -0.09, 0, 0.33, 1, 0.24, -0.34, 0.22, 0.45, 1, 0.17, -0.4, 0.06, 0.6, 3, 0.03, -0.08, 0, 0.7, 3, 0.03, -0.01, 0, 0.8, 0, 0.06, 0.11, 0, 0.92, 2, 0, 0, 0, 1, 2, 0, 0, 0], TT = (() => {
  let e4 = [0, 2, 0, 0, 0], t2 = 0.76 / 4;
  for (let n2 = 0; n2 < 4; n2++) {
    let r = 0.1 + t2 * n2;
    e4.push(r, 1, 0.17, -0.36, 0.14, r + t2 * 0.45, 3, 0.02, -0.05, 0, r + t2 * 0.62, 3, 0.02, 0.01, 0.04);
  }
  return e4.push(0.93, 2, 0, 0, 0, 1, 2, 0, 0, 0), e4;
})(), ET = [0, 2, 0, 0, 0, 0.22, 1, 0.16, 0, -0.2, 0.46, 3, 0.03, 0.04, 0.1, 0.62, 3, 0.03, 0, -0.06, 0.85, 2, 0, 0, 0, 1, 2, 0, 0, 0], DT = [0, 1, -0.17, 0, 0.27, 0.07, 1, -0.3, 0.3, -0.12, 0.16, 1, -0.14, 0.36, 0.42, 0.3, 1, 0.08, -0.16, 0.36, 0.62, 1, -0.17, 0, 0.27], OT = [0, 1, 0.26, -0.34, 0.08, 0.07, 1, 0.14, 0.16, 0.46, 0.16, 1, 0.2, 0.02, 0.38, 0.3, 1, 0.27, -0.34, -0.06, 0.62, 1, 0.26, -0.34, 0.08], kT = [0, 0, 0.07, -0.5, 0.16, 0.3, 0.3, 0.45, 0.62, 0], AT = [0, 0, 0.07, -0.1, 0.16, 0.12, 0.3, 0.26, 0.62, 0];
function jT(e4, t2) {
  let n2 = e4.length / 2, r = 0;
  for (; r < n2 - 2 && t2 >= e4[(r + 1) * 2]; ) r++;
  let i = r * 2;
  return Y(e4[i + 1], e4[i + 3], ew(e4[i], e4[i + 2], t2));
}
xC.push(
 {id:`starlight`,name:`Starlight`,color:`#62e6db`,fem:true,build:0,tone:0xe3aa91,top:0x31bcb5,pants:0xc75a9d,boots:0x384969,hair:0x7cebd8},
 {id:`oathguard`,name:`Oathguard`,color:`#c8d6e3`,fem:false,build:2,tone:0xb88e79,top:0x73889d,pants:0x354963,boots:0x253a4e,hair:0x322a29},
 {id:`moonrunner`,name:`Moonrunner`,color:`#a575ff`,fem:true,build:1,tone:0xc99479,top:0x402a67,pants:0x202844,boots:0x27283a,hair:0x6a5cc8},
 {id:`frostknight`,name:`Frost Knight`,color:`#9ee7ff`,fem:false,build:2,tone:0xd4b398,top:0x85adbf,pants:0x425a72,boots:0x2d435a,hair:0xd9edf4},
 {id:`dustrider`,name:`Dust Rider`,color:`#efac59`,fem:true,build:1,tone:0xaa785d,top:0xae6b38,pants:0x5f4b3f,boots:0x473a32,hair:0x422a25},
 {id:`dreamer`,name:`Dreamer`,color:`#ff91d5`,fem:true,build:0,tone:0xe0b99b,top:0x8053a1,pants:0x39356b,boots:0x3f3b62,hair:0xdb89d9},
 {id:`riftwarden`,name:`Rift Warden`,color:`#51bfff`,fem:false,build:2,tone:0x98705b,top:0x324f8b,pants:0x202d54,boots:0x1e2643,hair:0x292a40},
 {id:`eternalknight`,name:`Eternal Knight`,color:`#efdb9c`,fem:false,build:2,tone:0xc09378,top:0x999078,pants:0x484657,boots:0x30313d,hair:0x554334});
var MT = { speed: 0, moveAngle: 0, grounded: true, vy: 0, crouch: false, sprint: false, aimPitch: 0, aiming: false, mode: `ground`, using: 0 }, NT = class {
  root = new Pn();
  skin;
  dis = new Pn();
  body = new Pn();
  hips = new Gi();
  spine = new Gi();
  chest = new Gi();
  head = new Gi();
  eyes = new Gi();
  armU = [];
  armL = [];
  legU = [];
  legL = [];
  foot = [];
  grip = new Nn();
  gliderSocket = new Nn();
  meshes = [];
  skinned = null;
  lodGeo = null;
  tablet;
  glowMesh = null;
  glowMeshes = [];
  held = null;
  glider = null;
  kind = `none`;
  shX;
  hipX;
  lod = 0;
  t = Math.random() * 20;
  phase = Math.random();
  gD = 0.6;
  gA = 0;
  footYaw = 0;
  stepT = -1;
  stepFrom = 0;
  stepTo = 0;
  stepLead = 0;
  stanceS = 0;
  mantleW = 0;
  ledgeS = 0;
  reloadW = 0;
  lastMantle = 0;
  reloadP = 0;
  throwT = -1;
  pumpT = -1;
  tapT = -1;
  deadW = 0;
  headX = 0;
  headY = 0;
  torsoY = 0;
  torsoX = 0;
  lastS = MT;
  fore = new R(0, 0.035, 0.26);
  magP = new R(0, -0.12, 0.15);
  reloadStyle = `mag`;
  action = ``;
  useStyle = `drink`;
  moveW = 0;
  crouchW = 0;
  slideW = 0;
  airW = 0;
  sprintW = 0;
  aimW = 0;
  useS = 0;
  vyS = 0;
  dir = 0;
  back = false;
  twist = 0;
  leanP = 0;
  leanR = 0;
  lastSpeed = 0;
  accel = 0;
  land = 0;
  landAmt = 0;
  wasGrounded = true;
  lastVy = 0;
  wSky = 0;
  wGlide = 0;
  wSeat = 0;
  emoteId = 0;
  emoteShown = 0;
  emoteW = 0;
  emoteT = 0;
  swingT = -1;
  swA = 0;
  swB = 0;
  recoilK = 0;
  flinchK = 0;
  flinchSide = 1;
  holdBlend = 1;
  dissolveT = 0;
  lastYaw = 0;
  turn = 0;
  hop = 0;
  blinkT = 1 + Math.random() * 3;
  blink = 0;
  lookT = 0;
  look = 0;
  lookTo = 0;
  P = new Float32Array($w);
  Q = new Float32Array($w);
  K = new Float32Array(iT);
  KN = new Float32Array(iT);
  KS = new Float32Array(iT);
  gripSnap = new It().copy(aT);
  gripW = 0;
  snap = true;
  constructor(e4) {
    this.skin = e4;
    let t2 = dw(e4);
    this.shX = t2.shX, this.hipX = t2.hipX, this.root.add(this.dis), this.dis.add(this.body), this.body.position.y = wC, this.body.rotation.order = `YXZ`;
    let n2 = (e5, t3, n3, r2, i, a) => (e5.name = a, e5.position.set(n3, r2, i), e5.rotation.order = `YXZ`, t3.add(e5), e5);
    n2(this.hips, this.body, 0, 0, 0, `hips`), n2(this.spine, this.hips, 0, kC, 0, `spine`), n2(this.chest, this.spine, 0, AC, 0, `chest`), n2(this.head, this.chest, 0, jC, 0, `head`), n2(this.eyes, this.head, 0, UC, 0, `eyes`);
    for (let e5 = 0; e5 < 2; e5++) {
      let t3 = e5 ? -1 : 1, r2 = e5 ? `R` : `L`;
      this.armU.push(n2(new Gi(), this.chest, t3 * this.shX, NC, 0, `armU_` + r2)), this.armL.push(n2(new Gi(), this.armU[e5], 0, -0.29, 0, `armL_` + r2)), this.legU.push(n2(new Gi(), this.hips, t3 * this.hipX, TC, 0, `legU_` + r2)), this.legL.push(n2(new Gi(), this.legU[e5], 0, -0.415, 0, `legL_` + r2)), this.foot.push(n2(new Gi(), this.legL[e5], 0, -0.415, 0, `foot_` + r2));
    }
    let r = vw(e4.id);
    r ? this.skinUp(r) : this.mannequin(), this.tablet = new Mi(Ew(), _m.std), this.tablet.position.set(0, -0.31, 0.06), this.tablet.rotation.set(0.25, 0, 0), this.tablet.visible = false, this.armL[0].add(this.tablet), this.grip.position.set(0, -0.3, 0), this.grip.quaternion.copy(aT), this.armL[1].add(this.grip), this.gliderSocket.position.set(0, wC + LC, RC), this.root.add(this.gliderSocket), this.update(0, MT);
  }
  boneList() {
    return [this.hips, this.spine, this.chest, this.head, this.eyes, this.armU[0], this.armL[0], this.armU[1], this.armL[1], this.legU[0], this.legL[0], this.legU[1], this.legL[1], this.foot[0], this.foot[1]];
  }
  skinUp(e4) {
    let t2 = this.boneList(), n2 = `${this.shX}/${this.hipX}`, r = mw.get(n2);
    r || (this.root.updateMatrixWorld(true), r = t2.map((e5) => e5.matrixWorld.clone().invert()), mw.set(n2, r));
    let i = new Yi(t2, r), a = (e5, t3) => {
      let n3 = new Wi(e5, t3);
      return n3.bind(i, hw), n3.boundingSphere = new Pr(new R(0, 0.95, 0), 1.5), this.dis.add(n3), n3;
    };
    this.skinned = a(e4.body, Dw), this.skinned.castShadow = true, this.skinned.receiveShadow = true, this.meshes.push(this.skinned), this.lodGeo = [e4.body, e4.far], e4.glow && (this.glowMesh = a(e4.glow, _m.glow));
  }
  mannequin() {
    let e4 = getProceduralCharacterParts(this.skin), t2 = (bone, geo) => {
      if (!geo) return;
      let n2 = new Mi(geo, Dw);
      n2.castShadow = true;
      n2.receiveShadow = true;
      bone.add(n2);
      this.meshes.push(n2);
    }, g2 = (bone, geo) => {
      if (!geo) return;
      let n2 = new Mi(geo, _m.glow);
      bone.add(n2);
      this.glowMeshes.push(n2);
    };
    t2(this.hips, e4.hips);
    t2(this.spine, e4.spine);
    t2(this.chest, e4.chest);
    t2(this.head, e4.head);
    t2(this.eyes, e4.eyes);
    t2(this.armU[0], e4.armUL);
    t2(this.armU[1], e4.armUR);
    t2(this.armL[0], e4.armLL);
    t2(this.armL[1], e4.armLR);
    t2(this.legU[0], e4.legUL);
    t2(this.legU[1], e4.legUR);
    t2(this.legL[0], e4.legLL);
    t2(this.legL[1], e4.legLR);
    t2(this.foot[0], e4.footL);
    t2(this.foot[1], e4.footR);
    g2(this.chest, e4.chestGlow);
    g2(this.head, e4.headGlow);
    g2(this.eyes, e4.eyesGlow);
    g2(this.legU[0], e4.legGlowL);
    g2(this.legU[1], e4.legGlowR);
  }
  setHeld(e4, t2) {
    if (this.held && this.held !== e4 && this.held.parent === this.grip && (this.grip.remove(this.held), this.held.visible = true), this.held = e4, e4) {
      e4.position.set(0, 0, 0), e4.quaternion.identity(), e4.parent !== this.grip && this.grip.add(e4);
      let t3 = e4.userData;
      t3.fore && t3.fore.isVector3 ? this.fore.copy(t3.fore) : this.fore.set(0, 0.035, 0.26), t3.mag && t3.mag.isVector3 ? this.magP.copy(t3.mag) : this.magP.set(0, -0.12, 0.15), this.reloadStyle = t3.reload ?? `mag`, this.action = t3.action ?? ``, this.useStyle = t3.use ?? `drink`;
    }
    t2 !== this.kind && (this.pumpT = -1), t2 !== this.kind && (this.KS.set(this.K), this.gripSnap.copy(this.grip.quaternion), this.holdBlend = 0, this.kind = t2), this.tablet.visible = t2 === `blueprint`;
  }
  setGlider(e4) {
    this.glider && this.glider !== e4 && this.glider.parent === this.gliderSocket && this.gliderSocket.remove(this.glider), this.glider = e4, e4 && (e4.position.set(0, 0, 0), e4.quaternion.identity(), e4.parent !== this.gliderSocket && this.gliderSocket.add(e4));
  }
  swing() {
    this.swingT = 0;
  }
  recoil(e4 = 1) {
    this.kind === `throwable` ? this.throwT = 0 : (this.recoilK = Math.min(2, Math.max(this.recoilK, e4)), this.action === `pump` && (this.pumpT = 0));
  }
  build() {
    this.tapT = 0;
  }
  flinch() {
    this.flinchK = 1, this.flinchSide = Math.random() < 0.5 ? -1 : 1;
  }
  emote(e4) {
    let t2 = e4 >= 1 && e4 <= 8 ? Math.floor(e4) : 0;
    t2 && t2 !== this.emoteId && (this.emoteShown = t2, this.emoteT = 0), this.emoteId = t2;
    // Full-body dance animations
    if (t2 > 0) {
      this.emoteT = 0;
      // Dance: bounce + spin
      if (t2 === 1) { this.danceBounce = 0.5; this.danceSpin = 6.28; }
      // Wave: arm wave
      else if (t2 === 2) { this.armWave = 2; }
      // Point: point forward
      else if (t2 === 3) { this.pointArm = 1; }
      // Jump: celebratory jump
      else if (t2 === 4) { this.celebrateJump = 1; }
    }
  }
  get emoting() {
    return this.emoteId > 0;
  }
  getMuzzle(e4) {
    let t2 = this.held, n2 = t2 ? t2.userData.muzzle : void 0;
    return t2 && n2 && n2.isVector3 ? (t2.updateWorldMatrix(true, false), e4.copy(n2).applyMatrix4(t2.matrixWorld)) : (this.grip.updateWorldMatrix(true, false), e4.setFromMatrixPosition(this.grip.matrixWorld));
  }
  getHead(e4) {
    return this.head.updateWorldMatrix(true, false), e4.set(0, MC, 0).applyMatrix4(this.head.matrixWorld);
  }
  setShadows(e4) {
    for (let t2 of this.meshes) t2.castShadow = e4;
  }
  setDissolve(e4) {
    let t2 = $C(e4, 0, 1), n2 = t2 > 0;
    if (n2 !== this.dissolveT > 0) {
      for (let e5 of this.meshes) e5.material = n2 ? Ow : Dw;
      this.tablet.material = n2 ? Ow : _m.std, this.glowMesh && (this.glowMesh.material = n2 ? Ow : _m.glow);
      for (let m of this.glowMeshes) m.material = n2 ? Ow : _m.glow;
    }
    this.dissolveT = t2;
    let r = Math.max(1e-3, 1 - t2);
    this.dis.scale.set(r, 1 + 2.5 * t2, r), t2 > 0 && t2 < 1 ? (this.deadW = Math.min(1, t2 * 4), this.update(1 / 60, this.lastS)) : this.deadW = 0;
  }
  dispose() {
    this.held && this.held.parent === this.grip && this.grip.remove(this.held), this.glider && this.glider.parent === this.gliderSocket && this.gliderSocket.remove(this.glider), this.held = null, this.glider = null;
    for (let e4 of this.meshes) e4.material = Dw;
    this.skinned?.skeleton.dispose(), this.root.removeFromParent();
  }
  setLod(e4) {
    if (e4 !== this.lod) {
      this.lod = e4;
      this.skinned && this.lodGeo && (this.skinned.geometry = this.lodGeo[e4]);
      this.glowMesh && (this.glowMesh.visible = e4 === 0);
      for (let m of this.glowMeshes) m.visible = e4 === 0;
    }
  }
  poseGround(e4, t2) {
    e4.fill(0);
    let n2 = this.t, r = this.moveW, i = this.crouchW, a = this.airW, o = this.sprintW * r, s2 = Math.min(t2.speed, 9), c = 1 - r, l2 = $C(this.vyS * 0.5 + 0.5, 0, 1), u = 0;
    if (this.land > 0) {
      let e5 = 1 - this.land;
      u = Math.sin(SC * e5 ** 0.6) * (1 - 0.3 * e5) * this.landAmt;
    }
    let d = Math.sin(n2 * 1.6), f = Math.sin(n2 * 0.47) * c * (1 - i), p = 1 - a, m = $C(s2 / 6, 0, 1) * r, h = this.gA, g2 = this.gD, _2 = Math.min(0.42, 0.05 + 0.03 * s2 + 0.08 * o) * (1 - 0.45 * i) * r, v = (0.075 + 0.04 * $C((s2 - 4.5) / 3, 0, 1)) * Math.min(1, h / 0.3) * r * (1 - i) * ew(-0.2, 0.5, Math.cos(this.dir - this.twist)), y = 0.75 - 0.22 * o, b = $C((s2 - 3) / 3, 0, 1) * r * (1 - i), x = 0, S = 0, C = 0, w = 0, T2 = 0, E = 0, D = 0.05 * $C((s2 - 2.6) / 3, 0, 1) * (1 - i), O = 0;
    for (let t3 = 0; t3 < 2; t3++) {
      let n3 = (this.phase + (t3 ? 0.5 : 0)) % 1, i2, o2 = 0, s3, c2;
      if (n3 < g2) i2 = h * (0.84 - 2 * n3 / g2), o2 = c2 = v * ew(0.5 * g2, g2, n3), s3 = Y(-0.35, 0.9, ew(0.25 * g2, 0.8 * g2, n3));
      else {
        let e5 = (n3 - g2) / (1 - g2), t4 = e5 * e5 * (3 - 2 * e5);
        i2 = h * (2 * t4 - 1.16 + 0.22 * b * Math.sin(SC * ew(0.25, 1, e5)) ** 2), c2 = v * (1 - t4), o2 = _2 * Math.sin(SC * e5 ** +y) + c2, s3 = e5 < 0.5 ? Y(0.9, 0.25, ew(0, 0.5, e5)) : Y(0.25, -0.3, ew(0.5, 1, e5));
      }
      e4[Qw + t3] = Y(s3 * r, Y(0.22, 0.45, l2), a);
      let u2 = VC - Math.sqrt(WC * WC - (OC + c2) * (OC + c2));
      O = Math.max(O, 0.846 - o2 - Math.sqrt(JC * JC - Math.min(i2 * i2, 0.6))), n3 < g2 && (O = Math.max(O, D * Math.sin(SC * n3 / g2))), t3 ? (S = i2, w = o2, E = u2) : (x = i2, C = o2, T2 = u2);
    }
    let k = $C((x - S) / Math.max(0.16, 2 * h), -1, 1) * r, A = Math.cos(CC * (this.phase - g2 / 2)), ee = (0.014 * c + 6e-3 * r + Math.max(O * r, (0.32 - 0.06 * r) * i) + 0.2 * u) * p, te = $C(this.turn * (0.02 + 0.012 * s2), -0.3, 0.3) * r * p, ne = $C(-this.stanceS / 0.35, 0, 1) * c * (1 - i), j = this.stanceS * 0.5 * c, re = this.stepT >= 0, M = this.footOff(0, re) * c, ie = this.footOff(1, re) * c;
    e4[kw] = this.leanP * 0.4, e4[jw] = this.leanR * 0.4 + te, e4[Nw] = f * 0.022, e4[Pw] = -ee + d * 3e-3 * c, e4[Fw] = -0.08 * i, e4[Iw] = 0.1 * i + 0.06 * o, e4[Lw] = this.twist - k * (0.11 + 0.05 * o) + j + (M + ie) * 0.3, e4[Rw] = A * 0.05 * r - f * 0.05, e4[zw] = this.leanP * 0.6 + 0.3 * i + 0.22 * u - 0.08 * a * l2 + 0.12 * o, e4[Bw] = -this.twist * 0.55 - j * 0.4 - (M + ie) * 0.15, e4[Vw] = this.leanR * 0.6 - A * 0.035 * r + f * 0.04, e4[Hw] = 0.12 * i - d * 0.016 * c + 0.08 * o, e4[Uw] = -this.twist * 0.45 + k * (0.19 + 0.09 * o) - j * 0.6 - (M + ie) * 0.15, e4[Ww] = f * 0.02, e4[Gw] = -0.3 * i - this.leanP * 0.8 - 0.12 * u - 0.2 * o, e4[Kw] = -k * 0.08 + this.look * c, e4[qw] = -f * 0.03 - te * 0.3, e4[Xw] = 1, e4[Zw] = 1;
    let ae = Math.sin(this.dir), oe = Math.cos(this.dir);
    gT.setFromEuler(dT.set(e4[kw], 0, e4[jw], `YXZ`)).invert();
    let se = Math.min(1, 0.22 + 0.1 * s2) * r * (1 - 0.5 * i);
    for (let t3 = 0; t3 < 2; t3++) {
      let s3 = t3 ? -1 : 1, u2 = t3 ? S : x, p2 = (t3 ? w : C) + this.stepLift(t3), h2 = this.twist + (t3 ? ie : M) + this.stanceS * 0.4 * c, g3 = Math.cos(h2), _3 = Math.sin(h2), v2 = s3 * (Y(0.13, 0.085, m) + 5e-3 * c + 0.06 * i + f * s3 * 0.01), y2 = (s3 * (0.012 + 0.16 * i) + (t3 ? -0.045 : 0.065) * ne) * c + (t3 ? E : T2);
      fT.set(v2 * g3 + y2 * _3 + ae * u2, IC + p2 + Math.max(0, f * s3) * 0.012, y2 * g3 - v2 * _3 + oe * u2).applyQuaternion(gT);
      let b2 = t3 === 1, D2 = s3 * Y(0.14, 0.12, l2), O2 = Y(b2 ? -0.75 : -0.82, b2 ? -0.56 : -0.67, l2) + Math.sin(n2 * 7 + t3 * 2) * 0.012 * (1 - l2), A2 = Y(b2 ? 0.12 : -0.08, b2 ? 0.16 : -0.03, l2);
      CT(e4, Jw + t3 * 6, Y(fT.x, D2, a), Y(fT.y, O2, a), Y(fT.z, A2, a), s3 * (0.2 * c + 0.18 * i + 0.1 * a), 0, 1);
      let ee2 = t3 ? k : -k, te2 = se * ee2 * (1 + 0.35 * o) + 0.1 + 0.3 * m + 0.25 * o + 0.5 * i, j2 = Y(0.565, 0.43, m) - 0.08 * o - 0.05 * Math.max(0, ee2) * r - 0.1 * i, re2 = s3 * (this.shX + 0.055 + 0.02 * m - 0.07 * Math.max(0, Math.sin(te2)) * m - 0.04 * i + 0.012 * c), ce2 = NC - j2 * Math.cos(te2) + d * 4e-3, le2 = j2 * Math.sin(te2) + 0.03, ue = s3 * (this.shX + Y(0.25, 0.1, l2)), N = NC - Y(0.2, 0.26, l2) + Math.sin(n2 * 9 + t3 * 1.7) * 0.02 * (1 - l2), de = Y(0.1, 0.24, l2);
      CT(e4, Yw + t3 * 6, Y(re2, ue, a), Y(ce2, N, a), Y(le2, de, a), s3 * Y(0.25, 0.5, a), Y(-0.3, -1, a), Y(-1, -0.35, a));
    }
    let ce = this.slideW * p;
    if (ce > 1e-3) {
      let t3 = Math.cos(this.twist), n3 = Math.sin(this.twist);
      e4[Pw] = Y(e4[Pw], -0.4, ce), e4[Iw] = Y(e4[Iw], -0.22, ce), e4[Lw] = Y(e4[Lw], this.twist, ce), e4[zw] = Y(e4[zw], -0.2, ce), e4[Hw] = Y(e4[Hw], -0.06, ce), e4[Uw] = Y(e4[Uw], -this.twist * 0.45, ce), e4[Gw] = Y(e4[Gw], 0.6, ce);
      for (let r2 = 0; r2 < 2; r2++) {
        let i2 = r2 ? -1 : 1, a2 = r2 === 1, o2 = a2 ? 0.6 : 0.02, s3 = i2 * (a2 ? 0.1 : 0.2);
        fT.set(s3 * t3 + ae * o2, IC + (a2 ? 0.06 : 0), -s3 * n3 + oe * o2).applyQuaternion(gT);
        let c2 = Jw + r2 * 6;
        CT(e4, c2, Y(e4[c2], fT.x, ce), Y(e4[c2 + 1], fT.y, ce), Y(e4[c2 + 2], fT.z, ce), Y(e4[c2 + 3], i2 * (a2 ? 0.05 : 0.45), ce), e4[c2 + 4], e4[c2 + 5]), e4[Qw + r2] = Y(e4[Qw + r2], a2 ? -0.5 : 0.6, ce);
        let l3 = Yw + r2 * 6;
        CT(e4, l3, Y(e4[l3], i2 * (this.shX + 0.3), ce), Y(e4[l3 + 1], -0.088, ce), Y(e4[l3 + 2], a2 ? 0.12 : -0.18, ce), e4[l3 + 3], e4[l3 + 4], e4[l3 + 5]);
      }
    }
    let le = this.mantleW;
    if (le > 1e-3) {
      let t3 = this.lastMantle, n3 = ew(0.2, 0.75, t3), r2 = ew(0.82, 1, t3);
      e4[Pw] = Y(e4[Pw], -0.05 - 0.1 * n3 * (1 - r2), le), e4[Iw] = Y(e4[Iw], 0.18 * n3 * (1 - r2), le), e4[Lw] = Y(e4[Lw], 0, le), e4[zw] = Y(e4[zw], 0.18 + 0.4 * n3 * (1 - r2), le), e4[Bw] = Y(e4[Bw], 0, le), e4[Hw] = Y(e4[Hw], 0.12, le), e4[Uw] = Y(e4[Uw], 0, le), e4[Gw] = Y(e4[Gw], -0.4 + 0.3 * n3, le);
      let i2 = ew(0, 0.22, t3) * (1 - r2);
      for (let t4 = 0; t4 < 2; t4++) {
        let a2 = t4 ? -1 : 1, o2 = t4 === 1, s3 = Jw + t4 * 6, c2 = this.ledgeS - wC + OC + 0.02, l3 = o2 ? Y(IC + 0.3 * i2, $C(c2, IC, -0.33999999999999997), n3) : IC + (0.2 * i2 + 0.1 * n3) * (1 - r2), u2 = o2 ? 0.08 + 0.2 * n3 : -0.12 + 0.1 * n3;
        CT(e4, s3, Y(e4[s3], a2 * 0.13, le), Y(e4[s3 + 1], l3, le), Y(e4[s3 + 2], u2, le), Y(e4[s3 + 3], a2 * 0.25, le), e4[s3 + 4], e4[s3 + 5]), e4[Qw + t4] = Y(e4[Qw + t4], o2 ? 0 : 0.5, le);
      }
    }
  }
  footOff(e4, t2) {
    let n2 = this.root.rotation.y;
    if (!t2) return nw(this.footYaw - n2);
    let r = e4 === this.stepLead ? ew(0, 0.6, this.stepT) : ew(0.4, 1, this.stepT);
    return nw(this.stepFrom + nw(this.stepTo - this.stepFrom) * r - n2);
  }
  stepLift(e4) {
    if (this.stepT < 0) return 0;
    let t2 = e4 === this.stepLead ? this.stepT / 0.6 : (this.stepT - 0.4) / 0.6;
    return t2 > 0 && t2 < 1 ? 0.075 * Math.sin(SC * t2) : 0;
  }
  poseSky(e4, t2) {
    e4.fill(0);
    let n2 = this.t, r = ew(0.05, 1.1, -t2.aimPitch), i = ew(0, 0.8, t2.aimPitch), a = 1 - r, o = $C(this.turn * 0.25, -0.5, 0.5);
    e4[kw] = SC / 2 + r * (SC / 2 - 0.14) - i * 0.25 + Math.sin(n2 * 2.3) * 0.03, e4[jw] = Math.sin(n2 * 1.7) * 0.05 * a - o, e4[zw] = -0.18 * a, e4[Hw] = -0.14 * a, e4[Gw] = Y(-0.8, -0.2, r), e4[Qw] = e4[46] = Y(0.55, 0.9, r);
    for (let t3 = 0; t3 < 2; t3++) {
      let i2 = t3 ? -1 : 1, s2 = Math.sin(n2 * 15 + t3 * 2.1), c = Math.sin(n2 * 11.3 + t3 * 1.3);
      CT(e4, Jw + t3 * 6, i2 * Y(0.3, 0.11, r), Y(-0.62, -0.83, r) + s2 * 0.012, Y(-0.36, -0.06, r) + c * 0.025 * a, i2 * 0.5, 0, 1), CT(e4, Yw + t3 * 6, i2 * Y(0.58, 0.3, r), Y(0.34, -0.22, r) + c * 0.018 - i2 * o * 0.1, Y(-0.08, -0.16, r) + s2 * 0.025 * a, i2, Y(-0.2, 0.4, r), Y(0.5, -1, r));
    }
  }
  poseGlide(e4, t2) {
    e4.fill(0);
    let n2 = this.t, r = Math.min(t2.speed, 20), i = $C(this.turn * 0.22, -0.35, 0.35);
    e4[kw] = 0.08 + 8e-3 * r + Math.sin(n2 * 0.9) * 0.03, e4[jw] = Math.sin(n2 * 1.4) * 0.05 - i, e4[zw] = -0.06, e4[Vw] = i * 0.3, e4[Hw] = -0.08, e4[Gw] = 0.15, e4[qw] = i * 0.4, e4[Qw] = 0.5, e4[46] = 0.35;
    for (let t3 = 0; t3 < 2; t3++) {
      let a = t3 ? -1 : 1, o = Math.sin(n2 * 1.9 + t3 * 1.2) * (0.04 + 4e-3 * r);
      CT(e4, Jw + t3 * 6, a * 0.11 + i * 0.08, -0.79 + t3 * 0.05 - Math.max(0, o) * 0.15, -0.1 - 8e-3 * r + o + (t3 ? -0.08 : 0.06), a * 0.15, 0, 1), CT(e4, Yw + t3 * 6, a * 0.27, 0.72, 0.08, a, -0.3, -0.4);
    }
  }
  poseSeat(e4) {
    e4.fill(0);
    let t2 = this.t;
    e4[Pw] = -0.42, e4[kw] = -0.06, e4[zw] = 0.04, e4[Gw] = 0.02 + Math.sin(t2 * 0.7) * 0.03, e4[Kw] = Math.sin(t2 * 0.43) * 0.15, e4[Xw] = 0.3;
    for (let t3 = 0; t3 < 2; t3++) {
      let n2 = t3 ? -1 : 1;
      CT(e4, Jw + t3 * 6, n2 * 0.13, IC, 0.42 + t3 * 0.03, n2 * 0.1, 1, 0.3), CT(e4, Yw + t3 * 6, n2 * 0.15, -0.2, 0.3, n2 * 0.8, -0.3, -0.6);
    }
  }
  poseEmote(e4) {
    e4.fill(0);
    let t2 = this.emoteShown, n2 = this.emoteT;
    e4[Xw] = 0.15;
    let r = this.shX;
    if (t2 === 1) {
      let t3 = n2 * 2.1 * SC, i = Math.abs(Math.sin(t3)), a = Math.sin(t3 * 0.5), o = Math.sin(t3 * 0.5 + 0.6);
      e4[Nw] = a * 0.09, e4[Pw] = -0.04 - i * 0.07, e4[Rw] = a * 0.14, e4[Lw] = a * 0.18, e4[zw] = 0.1 * i, e4[Vw] = -a * 0.12, e4[Bw] = -a * 0.22, e4[Ww] = -a * 0.08, e4[Hw] = -0.06 * i, e4[Gw] = 0.12 * i - 0.05, e4[qw] = a * 0.12, e4[Kw] = a * 0.2;
      for (let t4 = 0; t4 < 2; t4++) {
        let n3 = t4 ? -1 : 1, s2 = Math.max(0, n3 * a);
        CT(e4, Jw + t4 * 6, n3 * (0.13 + s2 * 0.08), IC + Math.max(0, -n3 * a) * 0.06 * i, 0.02 + s2 * 0.03, n3 * 0.4, 0, 1);
        let c = Math.max(0, n3 * o);
        CT(e4, Yw + t4 * 6, n3 * (r + 0.05 + c * 0.04) - a * 0.06, Y(0.02, 0.6, c) + i * 0.04, Y(0.3, 0.12, c), n3 * 0.9, -0.5, Y(-0.4, 0.2, c));
      }
    } else if (t2 === 2) {
      let t3 = n2 % 3.2, i = t3 < 0.35 ? ew(0, 0.35, t3) : t3 < 0.45 ? 1 - ew(0.35, 0.45, t3) : 0, a = t3 >= 0.42 && t3 < 0.98 ? Math.sin(SC * (t3 - 0.42) / 0.56) : 0, o = t3 >= 0.98 && t3 < 1.25 ? Math.sin(SC * (t3 - 0.98) / 0.27) : 0, s2 = t3 >= 1.25 && t3 < 2.3 ? (t3 - 1.25) / 1.05 : -1, c = t3 >= 2.3 ? ew(2.3, 3.1, t3) : 0, l2 = s2 >= 0 ? Math.abs(Math.sin(s2 * SC * 3)) : 0;
      e4[Aw] = c * CC, e4[Mw] = a * 0.42, e4[Pw] = -0.2 * i - 0.14 * o - 0.05 * l2, e4[zw] = 0.3 * i + 0.15 * o - 0.15 * a + 0.06 * l2, e4[Hw] = -0.12 * a, e4[Gw] = -0.35 * a + 0.15 * i - 0.12 * l2, e4[Kw] = Math.sin(c * SC) * 0.3;
      for (let t4 = 0; t4 < 2; t4++) {
        let n3 = t4 ? -1 : 1, o2 = a * (t4 ? 0.16 : 0.22);
        if (CT(e4, Jw + t4 * 6, n3 * (0.14 + 0.06 * c * (1 - c) * 4), IC + o2, o2 * 0.4, n3 * 0.3, 0, 1), s2 >= 0) {
          let n4 = t4 === 1 ? l2 : 0;
          t4 === 1 ? CT(e4, 37, -r - 0.02, Y(0.25, 0.68, n4), Y(0.18, 0.12, n4), -1, -0.6, -0.4) : CT(e4, Yw, r - 0.02, 0.02, 0.2, 1, -0.4, -0.6);
        } else if (c > 0) CT(e4, Yw + t4 * 6, n3 * (r + 0.5), 0.292 + 0.1 * Math.sin(c * SC), 0.04, n3 * 0.3, -1, -0.3);
        else {
          let o3 = Math.max(a, i * 0);
          CT(e4, Yw + t4 * 6, n3 * Y(r + 0.06, r + 0.14, o3), Y(-0.12, 0.7, o3), Y(0.22, 0.06, o3), n3 * 0.8, Y(-0.4, -0.8, o3), Y(-0.5, 0.1, o3));
        }
      }
    } else {
      let t3 = n2 % 3.4, i = ew(1.6, 1.85, t3) * (1 - ew(3.15, 3.4, t3)), a = 1 - i, o = Math.sin(n2 * 9), s2 = Math.sin(n2 * 2.2), c = Math.abs(Math.sin(n2 * 6)) * i;
      e4[Nw] = s2 * 0.03 * a, e4[Pw] = -0.02 - 0.06 * i - 0.03 * c, e4[Rw] = s2 * 0.04 * a, e4[Vw] = (-s2 * 0.06 + 0.05) * a, e4[zw] = -0.1 * i, e4[Hw] = -0.1 * i, e4[qw] = (s2 * 0.06 - 0.06) * a, e4[Gw] = -0.08 * i;
      for (let t4 = 0; t4 < 2; t4++) {
        let n3 = t4 ? -1 : 1;
        CT(e4, Jw + t4 * 6, n3 * (0.13 + 0.05 * i), IC, n3 * 0.02 * a, n3 * 0.3, 0, 1);
      }
      fT.set(0.2, -0.24, 0.04).lerp(pT.set(r + 0.2, 0.432 + c * 0.03, -0.02), i), CT(e4, Yw, fT.x, fT.y, fT.z, 1, Y(0, -0.4, i), Y(-0.8, 0.2, i)), fT.set(-0.4 + o * 0.13, 0.62 - Math.abs(o) * 0.03, 0.12).lerp(pT.set(-r - 0.2, 0.432 + c * 0.03, -0.02), i), CT(e4, 37, fT.x, fT.y, fT.z, -1, Y(-0.5, -0.4, i), Y(-0.2, 0.2, i));
    }
  }
  poseDead(e4) {
    e4.fill(0);
    let t2 = this.t;
    e4[Mw] = 0.05, e4[zw] = -0.14, e4[Hw] = -0.1, e4[Gw] = -0.45, e4[Zw] = 0.25, e4[Qw] = e4[46] = 0.75;
    for (let n2 = 0; n2 < 2; n2++) {
      let r = n2 ? -1 : 1;
      CT(e4, Jw + n2 * 6, r * 0.12, -0.84 + n2 * 0.04, n2 ? 0.07 : -0.04, r * 0.2, 0, 1), CT(e4, Yw + n2 * 6, r * (this.shX + 0.42), 0.07199999999999998 + Math.sin(t2 * 3 + n2) * 0.02, 0.05, r * 0.4, -1, -0.2);
    }
  }
  keyPoint(e4, t2, n2, r, i) {
    let a = t2[n2 + 1];
    return e4.set(t2[n2 + 2], t2[n2 + 3], t2[n2 + 4]), a === 1 ? e4 : (a === 2 ? e4.add(this.fore) : a === 3 && e4.add(this.magP), e4.applyQuaternion(i).add(r));
  }
  pathAt(e4, t2, n2, r, i) {
    let a = t2.length / 5, o = 0;
    for (; o < a - 2 && n2 >= t2[(o + 1) * 5]; ) o++;
    let s2 = o * 5, c = s2 + 5;
    return this.keyPoint(e4, t2, s2, r, i), e4.lerp(this.keyPoint(bT, t2, c, r, i), ew(t2[s2], t2[c], n2));
  }
  holdPose(e4, t2) {
    let n2 = this.t, r = this.aimW, i = this.moveW, a = this.P, o = Math.sin(CC * 2 * this.phase) * 0.01 * i + Math.sin(n2 * 1.6) * 4e-3, s2 = 1, c = 1, l2 = 1, u = true, d = -0.6, f = -0.7, p = -0.3, m = 0.4, h = -0.9, g2 = -0.1, _2 = mT.set(0, 0, 0), v = ST.identity();
    hT.copy(this.fore);
    let y = 0, b = 0;
    switch (this.kind) {
      case `rifle`:
        _2.set(Y(-0.12, 0.02, r), Y(-0.01, 0.325, r), Y(0.12 - 0.9 * Math.max(0, this.fore.z - 0.36), 0.22, r)).lerp(fT.set(-0.2, -0.08, 0.18), t2), v.copy(xT).multiply(vT.setFromEuler(dT.set(0.1 * (1 - r), 0, 0, `YXZ`))).slerp(cT, t2), d = -0.5, f = -0.45 - 0.35 * r, p = -0.8 + 0.5 * r, m = 0.35, h = -0.9, g2 = -0.1;
        break;
      case `pistol`:
        _2.set(Y(-0.06, -0.02, r), Y(0.03, 0.33, r), Y(0.32, 0.44, r)).lerp(fT.set(-0.12, -0.02, 0.28), t2), v.copy(xT).multiply(vT.setFromEuler(dT.set(0.14 * (1 - r), 0, 0, `YXZ`))).slerp(lT, t2), d = -0.5, f = -0.85, p = -0.1, m = 0.5, h = -0.85, g2 = -0.1;
        break;
      case `launcher`:
        _2.set(-0.195 + 0.015 * r, 0.25 + 0.03 * r, 0.16 + 0.01 * r), v.copy(xT), d = -0.6, f = -0.7, p = -0.2, m = 0.2, h = -0.95, g2 = 0;
        break;
      case `pickaxe`:
        c = 0, u = false, _2.set(-this.shX - 0.06, -0.12, 0.15 + 0.012 * Math.sin(n2 * 0.9)), _2.lerp(fT.set(a[37] + 0.02, a[38] + 0.1, a[39] + 0.02), 0.8 * i), v.copy(uT), d = -0.4, f = -0.3, p = -1;
        break;
      case `consumable`: {
        let e5 = this.useS, t3 = this.useStyle, r2 = n2 * CC;
        if (c = 0, u = false, _2.set(-0.16, -0.2, 0.24), v.setFromEuler(dT.set(0.15, 0.35, 0, `YXZ`)), d = -0.7, f = -0.8, p = -0.1, e5 > 1e-3) {
          if (t3 === `drink`) _2.lerp(fT.set(-0.035, 0.4 + Math.sin(n2 * 8) * 8e-3, 0.16), e5), v.slerp(vT.setFromEuler(dT.set(-1.75, 0.2, 0, `YXZ`)), e5), d = Y(d, -1, e5), f = Y(f, -0.5, e5), p = Y(p, 0, e5), y -= 0.3 * e5;
          else if (t3 === `wrap`) {
            let t4 = r2 * 2.2;
            _2.lerp(fT.set(0.09 + 0.02 * Math.sin(r2 * 0.6), -0.07 + 0.07 * Math.sin(t4), 0.29 + 0.07 * Math.cos(t4)), e5), v.slerp(vT.setFromEuler(dT.set(Math.sin(t4) * 0.6, 0.4, 0, `YXZ`)), e5), c = e5, pT.set(-0.03, -0.07, 0.29), m = 1, h = -0.7, g2 = -0.3, y += 0.38 * e5;
          } else {
            let t4 = 0.5 - 0.5 * Math.cos(r2 * 0.85);
            _2.lerp(fT.set(-0.08, -0.15, 0.28), e5), v.slerp(vT.setFromEuler(dT.set(0.5, 0.1, 0, `YXZ`)), e5), c = e5, pT.set(0.06, -0.11, 0.33).lerp(bT.set(-0.07, 0.07, 0.17), t4), m = 0.8, h = -0.8, g2 = -0.2, y += 0.34 * e5;
          }
        }
        break;
      }
      case `throwable`:
        c = 0, u = false, _2.set(-0.17, 0, 0.27), v.setFromEuler(dT.set(-0.2, 0.3, 0, `YXZ`)), d = -0.9, f = -0.6, p = -0.2;
        break;
      case `blueprint`:
        l2 = 0, u = false, _2.set(-0.05, 0.02, 0.3), pT.set(0.12, 0.06 + o, 0.34), d = -0.7, f = -0.8, p = -0.1, m = 0.6, h = -0.8, g2 = -0.2;
        break;
      default:
        s2 = 0, c = 0, l2 = 0, u = false;
    }
    if(this.kind===`consumable` && this.lastS?.swinging) {
      // Reach upward as the rope supports the character; the airborne leg pose
      // remains driven by the existing locomotion rig.
      _2.set(-.17,.48,.22); v.setFromEuler(dT.set(-1.4,.25,0,`YXZ`));
      d=-1.15;f=-.55;p=-.2; y-=.12; s2=1;l2=1;
    }
    _2.y += o;
    let x = this.kind === `rifle` || this.kind === `pistol` || this.kind === `launcher` ? this.reloadW : 0;
    if (x > 1e-3) {
      let e5 = this.reloadP, t3 = this.reloadStyle, n3;
      if (t3 === `tube`) n3 = ew(0.1, 0.32, e5) * (1 - ew(0.7, 0.9, e5)) * x, _2.lerp(fT.set(-0.2, -0.1, 0.28), n3), v.multiply(vT.setFromEuler(dT.set(-0.6 * n3, 0, 0, `YXZ`)));
      else {
        let r2 = +(t3 === `shells`);
        n3 = ew(0, 0.12, e5) * (1 - ew(0.84, 0.98, e5)) * x, _2.x += 0.04 * n3, _2.y -= (0.06 + 0.03 * r2) * n3, _2.z -= 0.05 * n3, v.multiply(vT.setFromEuler(dT.set(-(0.22 + 0.14 * r2) * n3, 0, (0.5 + 0.2 * r2) * n3, `YXZ`)));
      }
      y += 0.24 * n3, b -= 0.14 * n3, this.pathAt(yT, t3 === `shells` ? TT : t3 === `tube` ? ET : wT, e5, _2, v);
    }
    if (this.pumpT >= 0 && this.kind === `rifle`) {
      let e5 = Math.sin(SC * $C((this.pumpT - 0.1) / 0.3, 0, 1));
      hT.z -= 0.1 * e5, _2.y -= 0.012 * e5;
    }
    if ((this.swA > 0 || this.swB > 0) && (s2 === 0 && _2.set(a[37], a[38], a[39]), _2.lerp(fT.set(-0.3, 0.52, -0.04), this.swA).lerp(fT.set(-0.04, 0, 0.46), this.swB), v.slerp(oT, this.swA).slerp(sT, this.swB), s2 = Math.max(s2, Math.min(1, (this.swA + this.swB) * 4)), l2 = Math.max(l2, s2), c === 0 && (c = Math.min(1, (this.swA + this.swB) * 2) * 0.8, pT.set(this.shX + 0.12, -0.2, 0.3).lerp(fT.set(this.shX + 0.18, -0.34, -0.12), this.swB), m = 0.6, h = -0.8, g2 = -0.3)), this.throwT >= 0) {
      let e5 = this.throwT;
      this.pathAt(fT, DT, e5, _2, v), _2.copy(fT), v.setFromEuler(dT.set(-0.2 - 1.6 * ew(0.04, 0.2, e5) * (1 - ew(0.3, 0.6, e5)), 0.3, 0, `YXZ`)), s2 = 1, l2 = 1, d = -0.9, f = -0.4, p = -0.3, c === 0 && (c = ew(0, 0.06, e5) * (1 - ew(0.32, 0.58, e5)), this.pathAt(pT, OT, e5, _2, v), m = 0.7, h = -0.7, g2 = -0.2);
    }
    if (this.tapT >= 0 && (this.kind === `blueprint` || this.kind === `none`)) {
      let e5 = Math.sin(SC * $C(this.tapT / ZC, 0, 1));
      s2 === 0 && (_2.set(a[37], a[38], a[39]), s2 = 1), _2.lerp(fT.set(-0.1, 0.17, 0.52), e5);
    }
    if (u && pT.copy(hT).applyQuaternion(v).add(_2), x > 1e-3 && pT.lerp(yT, x), s2 > 0) CT(e4, eT, _2.x, _2.y, _2.z, d, f, p);
    else for (let t3 = 0; t3 < 6; t3++) e4[eT + t3] = a[37 + t3];
    if (c > 0) CT(e4, tT, pT.x, pT.y, pT.z, m, h, g2);
    else for (let t3 = 0; t3 < 6; t3++) e4[tT + t3] = a[Yw + t3];
    e4[6] = s2, e4[13] = c, this.gripW = l2, this.headX = y, this.headY = b;
  }
  mix(e4) {
    let t2 = this.P, n2 = this.Q;
    for (let r = 0; r < $w; r++) t2[r] += n2[r] * e4;
    return e4;
  }
  update(e4, t2) {
    e4 = $C(e4, 0, 0.1), this.t += e4, this.lastS = t2;
    let n2 = this.snap, r = (t3, r2, i2) => n2 ? r2 : tw(t3, r2, i2, e4), i = t2.speed, a = t2.mode === `ground`, o = G.camera;
    if (o) {
      let e5 = this.root.position.distanceToSquared(o.position);
      this.setLod(this.lod ? +(e5 > 1369) : +(e5 > 1764));
    }
    this.held && (this.held.visible = t2.mode !== `glide` && t2.mode !== `skydive` && t2.mode !== `seated`);
    this.wSky = r(this.wSky, +(t2.mode === `skydive`), 7), this.wGlide = r(this.wGlide, +(t2.mode === `glide`), 7), this.wSeat = r(this.wSeat, +(t2.mode === `seated`), 9), this.emoteId && (i > 0.5 || !a) && (this.emoteId = 0), this.emoteW = r(this.emoteW, +!!this.emoteId, 9), this.emoteT += e4, this.moveW = r(this.moveW, a ? ew(0.1, 1.4, i) : 0, 10), this.crouchW = r(this.crouchW, t2.crouch && a ? 1 : 0, 11), this.slideW = r(this.slideW, t2.slide && a ? 1 : 0, 12);
    let s2 = a && t2.mantle ? t2.mantle : 0;
    s2 > 0 && (this.lastMantle = s2, this.ledgeS = t2.ledge ?? 0.9), this.mantleW = r(this.mantleW, +(s2 > 0), s2 > 0 ? 45 : 12), this.airW = r(this.airW, a && !t2.grounded ? 1 : 0, t2.grounded ? 16 : 9), this.sprintW = r(this.sprintW, t2.sprint && i > 4 ? 1 : 0, 8), this.aimW = r(this.aimW, +!!t2.aiming, 14), this.useS = r(this.useS, +(t2.using > 0), 10);
    let c = t2.reload ?? 0;
    c > 0 && (this.reloadP = c), this.reloadW = r(this.reloadW, +(c > 0), 14), this.vyS = r(this.vyS, $C(t2.vy / 7, -1, 1), 10), e4 > 0 && (this.accel = tw(this.accel, $C((i - this.lastSpeed) / e4, -30, 30), 6, e4)), this.lastSpeed = i, a && t2.grounded && !this.wasGrounded && !n2 && (this.land = 1, this.landAmt = $C(-this.lastVy / 14, 0.25, 1)), a && !t2.grounded && this.wasGrounded && t2.vy > 2 && !n2 && (this.hop = 1), this.wasGrounded = t2.grounded, this.lastVy = t2.vy, this.land = Math.max(0, this.land - e4 / 0.34), this.hop = Math.max(0, this.hop - e4 / 0.22);
    let l2 = this.root.rotation.y;
    if (e4 > 0 && (this.turn = tw(this.turn, n2 ? 0 : $C(nw(l2 - this.lastYaw) / e4, -6, 6), 6, e4)), this.lastYaw = l2, !(a && t2.grounded && this.moveW < 0.3 && this.slideW < 0.1 && !this.emoteId && this.wSky + this.wGlide + this.wSeat < 0.05) || n2) this.footYaw = l2, this.stepT = -1;
    else if (this.stepT >= 0) this.stepTo = l2, this.stepT += e4 / QC, this.stepT >= 1 && (this.footYaw = l2, this.stepT = -1);
    else {
      let e5 = nw(l2 - this.footYaw);
      Math.abs(e5) > 1.2 && (e5 = Math.sign(e5) * 1.2, this.footYaw = l2 - e5), Math.abs(e5) > 0.5 && (this.stepT = 0, this.stepFrom = this.footYaw, this.stepTo = l2, this.stepLead = e5 > 0 ? 0 : 1);
    }
    if (this.blinkT -= e4, this.blinkT <= 0 && (this.blink = 1, this.blinkT = 1.8 + Math.random() * 3.5), this.blink = Math.max(0, this.blink - e4 / 0.14), this.lookT -= e4, this.lookT <= 0 && (this.lookT = 1.5 + Math.random() * 3, this.lookTo = Math.random() < 0.55 ? 0 : (Math.random() - 0.5) * 0.9), this.look = tw(this.look, this.lookTo, 3, e4), this.eyes && this.lod === 0) {
      let e5 = Math.max(Math.sin(this.blink * SC), this.flinchK * 0.7);
      this.eyes.scale.y = Math.max(0.08, 1 - e5);
    }
    a && i > 0.15 && (this.dir = nw(n2 ? t2.moveAngle : this.dir + nw(t2.moveAngle - this.dir) * (1 - Math.exp(-12 * e4))));
    let u = Math.abs(this.dir);
    u > 1.75 ? this.back = true : u < 1.4 && (this.back = false), this.twist = r(this.twist, $C(this.back ? nw(this.dir - SC) : this.dir, -0.87, 0.87) * this.moveW, 10);
    let d = Math.min(i, 9), f = (1.1 + 0.125 * d) * (1 - 0.08 * this.crouchW), p = Math.min(0.45, 0.16 + 0.04 * d) + 0.08 * this.crouchW, m = $C(i > 0.05 ? 2 * p * f / i : 0.62, 0.2, 0.62);
    this.gD = m, this.gA = Math.min(0.56, i * m / (2 * f)), this.phase = (this.phase + e4 * f * (t2.grounded ? 1 : 0.35)) % 1;
    let h = this.moveW * (1 - this.airW);
    this.leanP = r(this.leanP, h * Math.cos(this.dir) * (0.017 * d + $C(this.accel * 0.012, -0.1, 0.12) + 0.07 * this.sprintW), 8), this.leanR = r(this.leanR, -h * Math.sin(this.dir) * 0.014 * d, 8), this.swA = 0, this.swB = 0;
    let g2 = 0, _2 = 0;
    if (this.swingT >= 0) {
      this.swingT += e4;
      let t3 = this.swingT / zC;
      if (t3 >= 1) this.swingT = -1;
      else {
        let e5 = ew(0, 0.26, t3), n3 = ew(0.26, 0.45, t3), r2 = ew(0.55, 1, t3);
        this.swA = e5 * (1 - r2), this.swB = n3 * (1 - r2), g2 = e5 * (1 - n3), _2 = this.swB;
      }
    }
    let v = 0, y = 0;
    this.throwT >= 0 && (this.throwT += e4, this.throwT >= YC ? (this.throwT = -1, this.held && (this.held.visible = true)) : (this.held && (this.held.visible = this.throwT >= 0.42), v = jT(kT, this.throwT), y = jT(AT, this.throwT))), this.pumpT >= 0 && (this.pumpT += e4, this.pumpT >= XC && (this.pumpT = -1)), this.tapT >= 0 && (this.tapT += e4, this.tapT >= ZC && (this.tapT = -1)), this.recoilK *= Math.exp(-e4 / 0.035), this.flinchK = Math.max(0, this.flinchK - e4 / 0.28), this.holdBlend = n2 ? 1 : Math.min(1, this.holdBlend + e4 / 0.12);
    let b = this.recoilK, x = this.flinchK > 0 ? Math.sin(Math.sqrt(1 - this.flinchK) * SC) : 0, S = this.P, C = this.Q;
    S.fill(0);
    let w = this.wSky, T2 = this.wGlide, E = this.wSeat, D = Math.max(0, 1 - w - T2 - E), O = D * this.emoteW;
    D -= O;
    let k = 0;
    D > 2e-3 && (this.poseGround(C, t2), k += this.mix(D)), O > 2e-3 && (this.poseEmote(C), k += this.mix(O)), w > 2e-3 && (this.poseSky(C, t2), k += this.mix(w)), T2 > 2e-3 && (this.poseGlide(C, t2), k += this.mix(T2)), E > 2e-3 && (this.poseSeat(C), k += this.mix(E)), k <= 0 && (this.poseGround(C, t2), k = this.mix(1));
    let A = 1 / k;
    for (let e5 = 0; e5 < $w; e5++) S[e5] *= A;
    if (this.deadW > 0) {
      this.poseDead(C);
      for (let e5 = 0; e5 < $w; e5++) S[e5] = Y(S[e5], C[e5], this.deadW);
    }
    let ee = this.K, te = this.KN, ne = this.KS, j = this.kind, re = ew(0, 1, this.holdBlend), M = S[Zw], ie = this.sprintW * (1 - this.aimW) * this.moveW;
    te[nT] = j === `rifle` || j === `pistol` || j === `launcher` ? 0.8 : j === `none` || j === `pickaxe` ? 0.3 : 0.5, te[rT] = j === `rifle` ? -(0.35 + 0.07 * this.aimW) * (1 - ie) : j === `launcher` ? -0.2 : j === `pistol` ? -0.1 : 0, ee[nT] = Y(ne[nT], te[nT], re), ee[rT] = Y(ne[rT], te[rT], re);
    let ae = Y(0.3, ee[nT], M), oe = ee[rT] * M;
    this.stanceS = oe;
    let se = $C(t2.aimPitch, -1.45, 1.45) * S[Xw], ce = -se * ae, le = this.body, ue = this.hips, N = this.spine, de = this.chest, fe = this.head;
    le.position.y = wC + S[Mw], le.rotation.set(S[kw], S[Aw], S[jw]), ue.position.set(S[Nw], S[Pw] - 0.05 * _2, S[Fw]), ue.rotation.set(S[Iw], S[Lw] + 0.08 * _2 + 0.25 * v, S[Rw]);
    let pe = (this.land > 0 ? Math.sin(SC * (1 - this.land)) * this.landAmt * 0.07 : 0) - Math.sin(SC * this.hop) * 0.05;
    N.scale.set(1 + pe * 0.6, 1 - pe, 1 + pe * 0.6), N.rotation.set(S[zw] + ce * 0.45 + 0.3 * _2 - 0.12 * g2 + 0.1 * x + 0.45 * y, S[Bw] + oe * 0.4 - 0.25 * g2 + 0.25 * _2 + 0.3 * v, S[Vw] + 0.06 * x * this.flinchSide), de.rotation.set(S[Hw] + ce * 0.55 - 0.035 * b + 0.08 * x + 0.55 * y, S[Uw] + oe * 0.6 - 0.32 * g2 + 0.32 * _2 + 0.45 * v, S[Ww]);
    let me = j === `rifle` ? 0.1 * this.aimW * M * re : 0;
    fe.rotation.set(S[Gw] - se * (0.92 - ae) + 0.14 * x + this.headX * M - 0.8 * y, S[Kw] - oe * 0.9 + 0.4 * (g2 - _2) + this.headY * M - 0.85 * v, S[qw] + me + 0.1 * x * this.flinchSide);
    let he = (D + O) * A * (1 - this.airW) * (1 - this.deadW);
    gT.copy(ue.quaternion).invert();
    for (let e5 = 0; e5 < 2; e5++) {
      let t3 = Jw + e5 * 6, n3 = e5 ? -this.hipX : this.hipX, r2 = this.legU[e5], i2 = this.legL[e5];
      fT.set(S[t3] - ue.position.x, S[t3 + 1] - ue.position.y, S[t3 + 2] - ue.position.z).applyQuaternion(gT);
      let a2 = fT.y - TC, o2 = 0;
      for (let e6 = 0; e6 < 3 && (uw(r2, i2, fT.x - n3, a2, fT.z, S[t3 + 3], S[t3 + 4], S[t3 + 5], EC, DC, false), _T.copy(le.quaternion).multiply(ue.quaternion), o2 = le.position.y + pT.copy(ue.position).applyQuaternion(le.quaternion).y + pT.set(n3, TC, 0).applyQuaternion(_T).y, _T.multiply(r2.quaternion), o2 += pT.set(0, -0.415, 0).applyQuaternion(_T).y, _T.multiply(i2.quaternion), o2 += pT.set(0, -0.415, 0).applyQuaternion(_T).y, !(e6 === 2 || he < 0.01 || o2 > 0.078)); e6++) a2 += (OC - o2) * he;
      let s3 = S[Qw + e5];
      if (he > 0.01) {
        let e6 = Math.asin(Math.min(1, o2 / WC)) - GC, t4 = Math.acos(Math.min(1, o2 / KC)) - qC;
        s3 = Y(s3, $C(s3, Math.min(t4, e6), e6), he);
      }
      pT.set(1, 0, 0).applyQuaternion(_T);
      let c2 = Math.atan2(-pT.z, pT.x);
      vT.setFromEuler(dT.set(BC + s3, c2 + nw(this.twist + S[Aw] - c2) * he * this.moveW, 0, `YXZ`)), this.foot[e5].quaternion.copy(_T.invert()).multiply(vT);
    }
    _T.copy(le.quaternion).multiply(ue.quaternion).multiply(N.quaternion).multiply(de.quaternion).invert(), xT.setFromEuler(dT.set(-se - 0.07 * b, 0, 0, `YXZ`)).premultiply(_T), this.holdPose(te, ie);
    for (let e5 = 0; e5 < nT; e5++) ee[e5] = Y(ne[e5], te[e5], re);
    let ge = ew(0.15, 0.9, this.wGlide), _e = this.mantleW * (1 - ge) * (1 - this.deadW), ve = ew(0.2, 0.75, this.lastMantle), ye = this.shX;
    for (let e5 = 0; e5 < 2; e5++) {
      let t3 = e5 ? -1 : 1, n3 = Yw + e5 * 6, r2 = e5 ? eT : tT, i2 = ee[r2 + 6] * M, a2 = Y(S[n3], ee[r2], i2), o2 = Y(S[n3 + 1], ee[r2 + 1], i2) + 0.012 * b * i2, s3 = Y(S[n3 + 2], ee[r2 + 2], i2) - 0.045 * b * i2, c2 = Y(S[n3 + 3], ee[r2 + 3], i2), l3 = Y(S[n3 + 4], ee[r2 + 4], i2), u2 = Y(S[n3 + 5], ee[r2 + 5], i2), d2 = ge + _e;
      d2 > 1e-3 && (ge > 0 ? fT.set(t3 * 0.27, LC, RC) : fT.set(t3 * 0.21, $C(this.ledgeS - wC + 0.05, -0.45, 0.85), Y(0.36, 0.16, ve)), fT.sub(ue.position).applyQuaternion(gT), fT.y -= kC, fT.applyQuaternion(vT.copy(N.quaternion).invert()), fT.y -= AC, fT.applyQuaternion(vT.copy(de.quaternion).invert()), a2 = Y(a2, fT.x, d2), o2 = Y(o2, fT.y, d2), s3 = Y(s3, fT.z, d2), _e > 0 && (c2 = Y(c2, t3 * 0.7, _e), l3 = Y(l3, -0.3, _e), u2 = Y(u2, -0.8, _e))), uw(this.armU[e5], this.armL[e5], a2 - t3 * ye, o2 - NC, s3, c2, l3, u2, PC, FC, true);
    }
    _T.copy(this.armU[1].quaternion).multiply(this.armL[1].quaternion).invert(), ST.premultiply(_T), _T.copy(aT).slerp(ST, this.gripW * M), this.grip.quaternion.copy(this.gripSnap).slerp(_T, re), e4 > 0 && (this.snap = false);
  }
}, PT = 1, FT = 0.12, IT = 3.2, LT = 11.6, RT = 4.4, zT = 2.6, BT = 1.95, VT = [0.2, 0.35, 0.5, 0.65, 0.8, 0.95, 1.1].map((e4) => pp + e4), HT = [0.15, 0.3, 0.45, 0.6].map((e4) => pp + e4), UT = [0.4], WT = [0.05], GT = 1.05, KT = 1.6, qT = [0.75, 1.1], JT = { x: 0, z: 0 }, YT = { x: 0, y: 1, z: 0 }, XT = [3112432, 15747642, 4177754, 16099379, 12082421, 2279367, 16740272, 15658734], ZT = class e2 {
  name;
  isPlayer;
  static events = {};
  id = PT++;
  char;
  skin;
  pos = new R();
  vel = new R();
  yaw = 0;
  pitch = 0;
  grounded = false;
  crouch = false;
  sprint = false;
  aiming = false;
  mode = `bus`;
  alive = true;
  hp = 100;
  shield = 0;
  slots = [null, null, null, null, null];
  active = -1;
  ammo = { light: 0, medium: 0, heavy: 0, shells: 0, rockets: 0 };
  mats = { wood: 0, stone: 0, metal: 0 };
  buildMode = false;
  buildPiece = `wall`;
  buildMat = `wood`;
  stairRot = -1;
  kills = 0;
  damageDealt = 0;
  shots = 0;
  hits = 0;
  gathered = 0;
  builds = 0;
  placement = 0;
  fireCd = 0;
  reloadT = 0;
  reloadTotal = 0;
  swingCd = 0;
  swingHit = -1;
  useT = 0;
  useTotal = 0;
  bloom = 0;
  lastHurtBy = null;
  lastHurtTime = -99;
  wishX = 0;
  wishZ = 0;
  wantJump = false;
  blockedBy = null;
  jumpBuf = 0;
  jumps = 2;
  dashCd = 0;
  dashT = 0;
  wantDash = false;
  padCd = 0;
  sliding = false;
  slideT = 0;
  airT = 0;
  jumped = false;
  mantleT = -1;
  mantleDur = 0.3;
  mantlePeak = 0;
  mantleFall = false;
  mantleStill = false;
  mantleDir = new R();
  mantleFrom = new R();
  mantleTo = new R();
  burstLeft = 0;
  burstT = 0;
  burstAim = { ox: 0, oy: 0, oz: 0, dx: 0, dy: 0, dz: 0, yaw: 0, pitch: 0, inacc: 0, slot: -1 };
  dissolve = -1;
  visible = false;
  stepDist = 0;
  held = /* @__PURE__ */ new Map();
  heldKey = ``;
  glider = null;
  anim = { speed: 0, moveAngle: 0, grounded: true, vy: 0, crouch: false, sprint: false, aimPitch: 0, aiming: false, mode: `ground`, using: 0 };
  animBuilds = 0;
  constructor(e4, t2, n2) {
    this.name = e4, this.isPlayer = t2, this.skin = n2, this.char = new NT(n2), this.char.root.visible = false;
    // Teammate marker (floating dot above head)
    if (!ZT._markerTex) {
      let c = document.createElement(`canvas`);
      c.width = c.height = 64;
      let g = c.getContext(`2d`);
      g.fillStyle = `#37e0ff`;
      g.beginPath(), g.arc(32, 32, 22, 0, Math.PI * 2), g.fill();
      g.fillStyle = `#ffffff`;
      g.beginPath(), g.arc(32, 32, 13, 0, Math.PI * 2), g.fill();
      g.fillStyle = `#37e0ff`;
      g.beginPath(), g.arc(32, 32, 6, 0, Math.PI * 2), g.fill();
      ZT._markerTex = new Na(c);
    }
    this.marker = new pi(new $r({ map: ZT._markerTex, depthTest: false, transparent: true }));
    this.marker.scale.set(0.9, 0.9, 1);
    this.marker.position.y = 2.6;
    this.marker.renderOrder = 999;
    this.marker.visible = false;
    this.char.root.add(this.marker);
  }
  setTeammate(e4) {
    this.isTeammate = e4;
    if (this.marker) this.marker.visible = !!e4;
  }
  setSkin(e4) {
    if (e4.id === this.skin.id) return;
    let t2 = this.char, n2 = t2.root.parent;
    t2.setHeld(null, `none`), t2.setGlider(null), this.skin = e4, this.char = new NT(e4), this.char.root.position.copy(t2.root.position), this.char.root.rotation.copy(t2.root.rotation), this.char.root.visible = t2.root.visible, n2 && (n2.remove(t2.root), n2.add(this.char.root)), t2.dispose(), this.heldKey = ``, this.refreshHeld();
  }
  reset() {
    this.alive = true, this.hp = 100, this.shield = 0, this.downed=false, this.wasDowned=false, this.reviveProgress=0, this.reviveCooldownUntil=0, this.mode = `bus`, this.slots.fill(null), this.active = -1;
    for (let e4 in this.ammo) this.ammo[e4] = 0;
    for (let e4 in this.mats) this.mats[e4] = 0;
    this.buildMode = false, this.buildPiece = `wall`, this.buildMat = `wood`, this.stairRot = -1, this.kills = this.damageDealt = this.shots = this.hits = this.gathered = this.builds = this.placement = 0, this.fireCd = this.reloadT = this.swingCd = this.useT = this.bloom = 0, this.swingHit = -1, this.lastHurtBy = null, this.lastHurtTime = -99, this.vel.set(0, 0, 0), this.grounded = false, this.crouch = this.sprint = this.aiming = false, this.sliding = false, this.slideT = 0, this.mantleT = -1, this.jumpBuf = 0, this.airT = 0, this.jumped = false, this.burstLeft = 0, this.burstT = 0, this.dissolve = -1, this.char.setDissolve(0), this.char.emote(0), this.setGlider(false), this.heldKey = ``, this.refreshHeld();
  }
  get current() {
    return this.active >= 0 ? this.slots[this.active] : null;
  }
  get weapon() {
    let e4 = this.current;
    return e4 && Uh(e4.id) ? Ih[e4.id] : null;
  }
  get eyeY() {
    return this.pos.y + (this.sliding ? 0.9 : this.crouch ? 1.12 : 1.58);
  }
  get height() {
    return this.sliding ? 1 : this.crouch ? 1.35 : mp;
  }
  get headH() {
    return this.sliding ? 0.92 : this.crouch ? 1.27 : 1.64;
  }
  refreshHeld() {
    const item=this.current,kind=this.buildMode?`blueprint`:item?item.id:`pickaxe`;
    const cosmetic=this.isPlayer?(kind===`pickaxe`?Sf.s.pickaxe:Uh(kind)?Sf.s.wrap:`default`):`default`;
    const key=kind+`:`+cosmetic;
    if(key===this.heldKey)return;
    this.heldKey=key;if(kind===`blueprint`){this.char.setHeld(null,`blueprint`);return;}
    let model=this.held.get(key);
    if(!model){model=kind===`pickaxe`?(cosmetic===`default`?b_():makePickaxe(cosmetic)):Uh(kind)?applyWeaponWrap(m_(kind),cosmetic):z_(kind);this.held.set(key,model);}
    this.char.setHeld(model,kind===`pickaxe`?`pickaxe`:Uh(kind)?Ih[kind].hold:`consumable`);
  }
  setGlider(enabled) {
    if(!enabled){this.char.setGlider(null);return;}
    const id=this.isPlayer?(Sf.s.glider||`default`):`bot`;
    if(!this.glider||this.gliderCosmetic!==id){this.char.setGlider(null);this.glider=id===`bot`?C_(XT[this.id%XT.length]):id===`default`?C_(3112432):makeGlider(id);this.glider.userData.cosmeticId=id;this.gliderCosmetic=id;}
    this.char.setGlider(this.glider);
  }
  select(e4) {
    if (e4 === this.active && !this.buildMode) return;
    this.active = e4, this.buildMode = false, this.reloadT = 0, this.useT = 0, this.aiming = false, this.burstLeft = 0;
    let t2 = this.weapon;
    this.fireCd = Math.max(this.fireCd, t2 ? t2.equip ?? 0.22 : 0), e4 < 0 && (this.swingCd = Math.max(this.swingCd, 0.12)), this.refreshHeld();
  }
  give(e4, t2, n2) {
    if (Uh(e4) && Ih[e4].thrown) {
      let t3 = Ih[e4].mag;
      for (let r = 0; r < 5; r++) {
        let i = this.slots[r];
        if (i && i.id === e4 && i.count < t3) return i.count = Math.min(t3, i.count + n2), r;
      }
      n2 = Math.min(n2, t3);
    }
    if (!Uh(e4)) {
      let t3 = Lh[e4].stack;
      for (let r = 0; r < 5; r++) {
        let i = this.slots[r];
        if (i && i.id === e4 && i.count < t3) return i.count = Math.min(t3, i.count + n2), r;
      }
    }
    for (let r = 0; r < 5; r++) if (!this.slots[r]) return this.slots[r] = { id: e4, rarity: t2, count: n2 }, r;
    return -1;
  }
  addMat(e4, t2) {
    this.mats[e4] = Math.min(999, this.mats[e4] + t2), t2 > 0 && (this.gathered += t2);
  }
  startReload() {
    let e4 = this.weapon, t2 = this.current;
    return !e4 || !t2 || e4.thrown || this.reloadT > 0 || t2.count >= e4.mag || this.ammo[e4.ammo] <= 0 && !(this.isPlayer && Sf.cheats.infiniteAmmo) ? false : (this.reloadT = this.reloadTotal = e4.reload * (1 - t2.rarity * 0.04), true);
  }
  finishReload() {
    let e4 = this.weapon, t2 = this.current;
    if (!e4 || !t2 || e4.thrown) return;
    let n2 = this.isPlayer && Sf.cheats.infiniteAmmo, r = e4.mag - t2.count, i = n2 ? r : Math.min(r, this.ammo[e4.ammo]);
    t2.count += i, n2 || (this.ammo[e4.ammo] -= i);
  }
  step(t2) {
    if (this.mode === `dead` || this.mode === `bus`) return;
    let n2 = this.pos, r = this.vel, i = this.isPlayer ? Sf.cheats : null;
    if (this.blockedBy = null, this.mode === `skydive` || this.mode === `glide`) {
      let i2 = this.mode === `glide`, a2 = i2 ? 14.5 : 21, o2 = 1 - Math.exp(-(i2 ? 2.4 : 1.7) * t2);
      r.x += (this.wishX * a2 - r.x) * o2, r.z += (this.wishZ * a2 - r.z) * o2;
      let s3 = i2 ? -7.2 : Tp(-44, -76, wp((-this.pitch - 0.25) / 0.9));
      r.y += (s3 - r.y) * (1 - Math.exp(-(i2 ? 4.5 : 1.5) * t2));
      let c2 = n2.y;
      n2.x = Cp(n2.x + r.x * t2, -397, 397), n2.z = Cp(n2.z + r.z * t2, -397, 397), n2.y += r.y * t2;
      let l3 = Math.max(Oy(n2.x, n2.z, c2), -1.1);
      !i2 && n2.y - l3 < 42 && (this.mode = `glide`, this.setGlider(true), e2.events.onDeploy?.(this)), n2.y <= l3 + 0.05 && (n2.y = l3, r.y = 0, this.mode = `ground`, this.grounded = true, this.setGlider(false), e2.events.onLand?.(this, 0, true));
      return;
    }
    if (i?.fly) {
      let e4 = this.sprint ? 34 : 16;
      r.set(this.wishX * e4, !!this.wantJump * 12 - (this.crouch ? 12 : 0), this.wishZ * e4), n2.x = Cp(n2.x + r.x * t2, -397, 397), n2.z = Cp(n2.z + r.z * t2, -397, 397), n2.y = Math.max(n2.y + r.y * t2, Oy(n2.x, n2.z, n2.y)), this.grounded = false;
      return;
    }
    if (this.jumpBuf > 0 && (this.jumpBuf -= t2), this.mantleT >= 0) {
      this.stepMantle(t2);
      return;
    }
    let a = this.downed ? 1.25 : this.crouch ? yp : this.sprint ? vp : _p;
    if(this.isPlayer && this.guardianUntil>G.time) a*=.55;
    this.aiming && (a *= 0.62), this.useT > 0 && (a *= 0.6), i?.speed && (a *= 2.3);
    let o = Math.hypot(this.wishX, this.wishZ);
    if (this.sliding) this.slidePhysics(t2);
    else if (this.grounded) {
      let e4 = 1 - Math.exp(-13 * t2);
      r.x += (this.wishX * a - r.x) * e4, r.z += (this.wishZ * a - r.z) * e4;
    } else {
      let e4 = Math.hypot(r.x, r.z);
      if (o > 0.01) {
        let n3 = Math.max(a, Math.min(e4, LT)) * Math.min(1, o), i2 = 1 - Math.exp(-5.5 * t2);
        r.x += (this.wishX / o * n3 - r.x) * i2, r.z += (this.wishZ / o * n3 - r.z) * i2;
      } else {
        let e5 = Math.exp(-0.7 * t2);
        r.x *= e5, r.z *= e5;
      }
    }
    // Chapter 2: Sky Dash (Shift in air) + Double Jump
    this.dashCd > 0 && (this.dashCd -= t2), this.dashT > 0 && (this.dashT -= t2), this.padCd > 0 && (this.padCd -= t2);
    if (this.wantDash && !this.grounded && this.dashCd <= 0 && o > 0.1) {
      let e4 = 24;
      r.x = this.wishX / o * e4, r.z = this.wishZ / o * e4, r.y = Math.max(r.y, 1.5), this.dashCd = 1.1, this.dashT = 0.22, this.wantDash = false, this.jumped = true, e2.events.onDash?.(this), this.isPlayer && W.play(`dash`, { volume: 0.7 });
    }
    this.wantDash = false;
    if (this.grounded) this.jumps = 2;
    let s2 = this.grounded || !this.jumped && this.airT < FT && r.y <= 0.5;
    if ((this.wantJump || this.jumpBuf > 0) && (s2 || this.jumps > 0)) {
      if (this.tryMantle(true)) return;
      let isDouble = !s2;
      r.y = gp * (i?.superJump ? 2.4 : 1) * (isDouble ? 0.85 : 1), this.grounded = false, this.jumped = true, this.jumpBuf = 0, this.jumps--, this.sliding && this.endSlide(), e2.events.onJump?.(this), isDouble && this.isPlayer && W.play(`doublejump`, { volume: 0.5 });
    }
    let c = Math.hypot(r.x, r.z) * t2, l2 = Math.max(1, Math.ceil(c / 0.3));
    for (let e4 = 0; e4 < l2; e4++) {
      n2.x += r.x * t2 / l2, n2.z += r.z * t2 / l2;
      let e5 = Ay(n2, pp, n2.y, this.height);
      e5 && (this.blockedBy = e5);
    }
    if (n2.x = Cp(n2.x, -397, 397), n2.z = Cp(n2.z, -397, 397), !(!this.grounded && o > 0.1 && r.y < 4 && this.airT > 0.04 && this.tryMantle(false)) && !(this.grounded && this.sprint && this.blockedBy && o > 0.1 && this.tryMantle(true, 0.7, 1.35, true))) {
      if (this.grounded) {
        let t3 = Math.max(Oy(n2.x, n2.z, n2.y), -1.1);
        t3 >= n2.y - 0.8 ? (n2.y = t3, r.y = 0) : (this.grounded = false, this.jumped = false, this.airT = 0), this.stepDist += c, this.stepDist > (this.sprint ? 2.6 : 2.1) && (this.stepDist = 0, this.sliding || e2.events.onStep?.(this));
      }
      if (!this.grounded) {
        this.airT += t2, r.y -= 27 * t2;
        let i2 = n2.y + r.y * t2;
        if (r.y > 0) {
          let e4 = ky(n2.x, n2.z, n2.y + this.height, r.y * t2 + 0.06);
          e4 !== 1 / 0 && (i2 = e4 - this.height - 0.02, r.y = 0);
        }
        let a2 = Math.max(Oy(n2.x, n2.z, n2.y), -1.1);
        if (r.y <= 0 && i2 <= a2) {
          let t3 = -r.y;
          n2.y = a2, r.y = 0, this.grounded = true, this.airT = 0, this.jumped = false, e2.events.onLand?.(this, t3, false);
        } else n2.y = i2;
      }
      this.sliding && !this.grounded && this.airT > 0.3 && this.endSlide();
      // Chapter 2: Launch Pad bounce
      if (this.grounded && this.padCd <= 0 && this.mode === `ground`) {
        for (let e4 of Fx.pieces.values()) {
          if (e4.spec.shape !== `pad` || !e4.alive) continue;
          let t3 = Math.hypot(n2.x - e4.cx, n2.z - e4.cz);
          if (t3 < 2.4 && Math.abs(n2.y - e4.maxY) < 1.2) {
            r.y = 27, r.x += this.wishX * 10, r.z += this.wishZ * 10, this.grounded = false, this.jumped = true, this.jumps = 1, this.padCd = 0.5, this.isPlayer && W.play(`launchpad`, { volume: 0.8 }), am.spark(n2.x, n2.y + 0.5, n2.z, 0x00e5ff, 12, 4, 0.3, 0.6, 4, 2);
            break;
          }
        }
      }
    }
  }
  startSlide() {
    if (this.sliding || !this.grounded || this.mode !== `ground` || this.mantleT >= 0) return false;
    let t2 = Math.hypot(this.vel.x, this.vel.z);
    if (t2 < 7.9 * 0.78) return false;
    let n2 = Math.min(LT, t2 + IT) / t2;
    return this.vel.x *= n2, this.vel.z *= n2, this.sliding = true, this.slideT = 0, this.crouch = false, this.sprint = false, e2.events.onSlide?.(this), true;
  }
  endSlide(e4 = false) {
    this.sliding && (this.sliding = false, this.crouch = e4 || ky(this.pos.x, this.pos.z, this.pos.y + 1, 1.8 - 0.95) !== 1 / 0);
  }
  slidePhysics(e4) {
    let t2 = this.vel, n2 = this.pos;
    this.slideT += e4;
    let r = Math.hypot(t2.x, t2.z);
    if (r < 0.01) {
      this.endSlide();
      return;
    }
    let i = t2.x / r, a = t2.z / r;
    if (Math.hypot(this.wishX, this.wishZ) > 0.1) {
      let t3 = Cp(Math.atan2(i * this.wishZ - a * this.wishX, i * this.wishX + a * this.wishZ), -1.6 * e4, 1.6 * e4), n3 = Math.cos(t3), r2 = Math.sin(t3), o2 = i * n3 - a * r2, s2 = i * r2 + a * n3;
      i = o2, a = s2;
    }
    let o = -6.2;
    this.grounded && n2.y - ay(n2.x, n2.z) < 0.15 && (sy(n2.x, n2.z, YT), o += (YT.x * i + YT.z * a) * 24), r = Math.min(13.6, r + o * e4), t2.x = i * r, t2.z = a * r, (r < RT || this.slideT > zT && o < 0 || this.slideT > 8 || this.aiming && this.slideT > 0.35) && this.endSlide();
  }
  tryMantle(e4, t2 = e4 ? 1 : 0.3, n2 = BT, r = false) {
    if (this.mode !== `ground` || this.mantleT >= 0) return false;
    let i = this.pos, a = Math.hypot(this.wishX, this.wishZ);
    if (a < 0.1) return false;
    let o = this.wishX / a, s2 = this.wishZ / a;
    for (let a2 of e4 ? VT : HT) {
      let e5 = i.x + o * a2, c = i.z + s2 * a2, l2 = Oy(e5, c, i.y + BT, 0), u = l2 - i.y;
      if (u < t2 || u > n2 || l2 - Oy(i.x + o * (a2 - 0.45), i.z + s2 * (a2 - 0.45), i.y + BT, 0) < 0.4) continue;
      let d = ky(e5, c, l2 + 0.05, 1.7) === 1 / 0 && ky(i.x, i.z, i.y + this.height, l2 + 1.8 - i.y - this.height) === 1 / 0;
      if (d && this.mantleOnto(o, s2, a2, l2, u, UT) || this.vaultOver(e5, c, o, s2, a2, l2, u, true) || !r && (d && this.mantleOnto(o, s2, a2, l2, u, WT) || this.vaultOver(e5, c, o, s2, a2, l2, u, false))) return true;
    }
    return false;
  }
  mantleOnto(e4, t2, n2, r, i, a) {
    let o = this.pos;
    for (let s2 of a) {
      let c = o.x + e4 * (n2 + s2), l2 = o.z + t2 * (n2 + s2);
      if (JT.x = c, JT.z = l2, Ay(JT, pp, r + 0.02, mp), Math.hypot(JT.x - c, JT.z - l2) > 0.3) continue;
      let u = Oy(JT.x, JT.z, r + 0.05);
      if (!(Math.abs(u - r) > 0.62) && zy(o.x, r + 1, o.z, JT.x, r + 1, JT.z)) return this.beginMantle(e4, t2, JT.x, u + 0.01, JT.z, u + 0.13, false, 0.2 + Math.max(0, i) * 0.07 + Math.max(0, n2 - 0.8) * 0.12, i), this.mantleStill = a === WT, true;
    }
    return false;
  }
  vaultOver(e4, t2, n2, r, i, a, o, s2) {
    let c = this.pos;
    if (ky(e4, t2, a + 0.05, GT) !== 1 / 0) return false;
    let l2 = a + GT - (c.y + this.height);
    if (l2 > 0 && ky(c.x, c.z, c.y + this.height, l2) !== 1 / 0) return false;
    for (let e5 of qT) {
      let t3 = c.x + n2 * (i + e5), l3 = c.z + r * (i + e5), u = Oy(t3, l3, a + 0.05), d = a - u;
      if (d < -0.05 || d > KT || s2 && Math.abs(u - c.y) > 0.5 || (JT.x = t3, JT.z = l3, Ay(JT, pp, u + 0.02, mp), Math.hypot(JT.x - t3, JT.z - l3) > 0.3)) continue;
      let f = Oy(JT.x, JT.z, a + 0.05);
      if (Math.abs(f - u) > 0.62) continue;
      let p = Math.max(f, a) + 0.02;
      if (ky(JT.x, JT.z, f + 0.05, p - f + 1.8 - 0.1) === 1 / 0 && zy(c.x, a + 0.45, c.z, JT.x, a + 0.45, JT.z)) return this.beginMantle(n2, r, JT.x, p, JT.z, a + 0.32, p > f + 0.3, 0.3 + Math.max(0, o) * 0.06 + Math.max(0, i - 0.8) * 0.1, o), true;
    }
    return false;
  }
  beginMantle(t2, n2, r, i, a, o, s2, c, l2) {
    this.mantleFrom.copy(this.pos), this.mantleTo.set(r, i, a), this.mantlePeak = Math.max(o, i), this.mantleFall = s2, this.mantleStill = false, this.mantleDir.set(t2, 0, n2), this.mantleDur = c, this.mantleT = 0, this.sliding && this.endSlide(), this.vel.set(t2 * 2.5, 0, n2 * 2.5), this.grounded = false, this.jumped = true, this.jumpBuf = 0, e2.events.onMantle?.(this, l2);
  }
  stepMantle(t2) {
    this.mantleT = Math.min(1, this.mantleT + t2 / this.mantleDur);
    let n2 = this.mantleT, r = this.mantleFrom, i = this.mantleTo, a = 0.62, o = n2 < a ? Tp(r.y, this.mantlePeak, 1 - (1 - n2 / a) ** 3) : Tp(this.mantlePeak, i.y, ((n2 - a) / 0.38) ** 2), s2 = n2 < 0.3 ? 0 : (n2 - 0.3) / 0.7, c = s2 * s2 * (3 - 2 * s2);
    this.pos.set(Tp(r.x, i.x, c), o, Tp(r.z, i.z, c)), n2 >= 1 && (this.pos.copy(i), this.mantleT = -1, this.airT = 0, this.mantleFall ? (this.grounded = false, this.jumped = true, this.vel.set(this.mantleDir.x * 3.2, 0, this.mantleDir.z * 3.2)) : (this.grounded = true, this.jumped = false, this.vel.y = 0, this.mantleStill && (this.vel.x = 0, this.vel.z = 0), e2.events.onLand?.(this, 2, false)));
  }
  animate(e4) {
    let t2 = this.anim, n2 = this.vel;
    t2.speed = Math.hypot(n2.x, n2.z);
    let r = Math.sin(this.yaw), i = Math.cos(this.yaw);
    t2.moveAngle = t2.speed > 0.2 ? Math.atan2(n2.x * i - n2.z * r, n2.x * r + n2.z * i) : 0;
    let a = this.isPlayer && Sf.cheats.fly && this.mode === `ground`;
    t2.grounded = (this.grounded || a) && this.mantleT < 0, t2.vy = this.mantleT >= 0 ? 3 : a ? 0 : n2.y, t2.crouch = this.crouch || this.sliding, t2.sprint = this.sprint && t2.speed > 6, t2.slide = this.sliding, t2.mantle = this.mantleT >= 0 ? Math.max(1e-3, this.mantleT) : 0, t2.ledge = this.mantleT >= 0 ? this.mantleTo.y - this.pos.y : 0, t2.aimPitch = this.pitch, t2.aiming = this.aiming, t2.mode = this.mode === `skydive` ? `skydive` : this.mode === `glide` ? `glide` : this.mode === `bus` ? `seated` : `ground`, t2.using = this.useTotal > 0 ? wp(this.useT / this.useTotal) : 0, t2.swinging=!!this.webSwing, t2.reload = this.reloadT > 0 && this.reloadTotal > 0 ? wp(1 - this.reloadT / this.reloadTotal) : 0, this.builds !== this.animBuilds && (this.builds > this.animBuilds && this.char.build(), this.animBuilds = this.builds), this.char.root.position.copy(this.pos), this.char.root.rotation.y = this.yaw, this.char.update(e4, t2);
    this.webTrickT=Math.max(0,(this.webTrickT||0)-e4);this.webRollT=Math.max(0,(this.webRollT||0)-e4);
    this.char.root.rotation.x=(this.mode===`glide`||this.mode===`skydive`)?0:this.webRollT ? Math.sin((1-this.webRollT/.55)*Math.PI)*1.1 : this.webTrickT&&!this.grounded ? Math.sin((1.3-this.webTrickT)*5)*Math.min(.45,t2.speed/35) : 0;
  }
}, X = new class {
  down = /* @__PURE__ */ new Set();
  pressed = /* @__PURE__ */ new Set();
  released = /* @__PURE__ */ new Set();
  mouseDX = 0;
  mouseDY = 0;
  wheel = 0;
  locked = false;
  enabled = true;
  allow = null;
  canvas = null;
  onLockChange;
  onAnyKey;
  // Gamepad support
  gamepad = null;
  gamepadAxes = [0, 0, 0, 0];
  gamepadButtons = [];
  pollGamepad() {
    let pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (let pad of pads) {
      if (pad && pad.connected) {
        this.gamepad = pad;
        this.gamepadAxes = pad.axes;
        this.gamepadButtons = pad.buttons;
        // Map gamepad buttons to keys
        let map = { 0: `Space`, 1: `KeyE`, 2: `Mouse0`, 3: `KeyR`, 4: `KeyQ`, 5: `KeyC`, 6: `KeyF`, 7: `KeyV`, 8: `Tab`, 9: `Escape`, 12: `KeyW`, 13: `KeyS`, 14: `KeyA`, 15: `KeyD` };
        for (let i in map) {
          if (pad.buttons[i] && pad.buttons[i].pressed) {
            if (!this.down.has(map[i])) this.pressed.add(map[i]);
            this.down.add(map[i]);
          } else {
            this.down.delete(map[i]);
          }
        }
        // Left stick for movement
        if (Math.abs(pad.axes[0]) > 0.2) {
          pad.axes[0] > 0 ? this.down.add(`KeyD`) : this.down.add(`KeyA`);
        }
        if (Math.abs(pad.axes[1]) > 0.2) {
          pad.axes[1] > 0 ? this.down.add(`KeyS`) : this.down.add(`KeyW`);
        }
        // Right stick for look
        this.mouseDX += pad.axes[2] * 5;
        this.mouseDY += pad.axes[3] * 5;
        break;
      }
    }
  }
  translate(e4) {
    let t2 = Sf.s.keybinds;
    if (!t2) return e4;
    for (let n2 in t2) if (t2[n2] === e4) {
      let r = { forward: `KeyW`, back: `KeyS`, left: `KeyA`, right: `KeyD`, jump: `Space`, sprint: `ShiftLeft`, crouch: `KeyZ`, interact: `KeyE`, reload: `KeyR`, wall: `KeyQ`, floor: `KeyC`, stairs: `KeyF`, roof: `KeyV`, switchMat: `KeyX`, edit: `KeyG`, inventory: `KeyI`, map: `Tab`, emote: `KeyB`, cheats: `KeyP` }[n2];
      return r || e4;
    }
    return e4;
  }
  init(e4) {
    this.canvas = e4, window.addEventListener(`keydown`, (e5) => {
      (e5.code === `Tab` || e5.code === `F1` || this.locked && (e5.code === `Space` || e5.code.startsWith(`Arrow`))) && e5.preventDefault(), e5.repeat || (this.down.add(this.translate(e5.code)), this.pressed.add(this.translate(e5.code)), this.onAnyKey?.(e5.code));
    }), window.addEventListener(`keyup`, (e5) => {
      this.down.delete(this.translate(e5.code)), this.released.add(this.translate(e5.code));
    }), window.addEventListener(`blur`, () => this.down.clear()), e4.addEventListener(`mousedown`, (e5) => {
      let t2 = `Mouse${e5.button}`;
      this.down.add(t2), this.pressed.add(t2);
    }), window.addEventListener(`mouseup`, (e5) => {
      let t2 = `Mouse${e5.button}`;
      this.down.delete(t2), this.released.add(t2);
    }), window.addEventListener(`mousemove`, (e5) => {
      this.locked && (this.mouseDX += e5.movementX, this.mouseDY += e5.movementY);
    }), window.addEventListener(`wheel`, (e5) => {
      this.locked && (this.wheel += Math.sign(e5.deltaY));
    }, { passive: true }), e4.addEventListener(`contextmenu`, (e5) => e5.preventDefault()), document.addEventListener(`pointerlockchange`, () => {
      if (this.locked = document.pointerLockElement === e4, !this.locked) {
        if (this.allow) for (let e5 of [...this.down]) this.allow.has(e5) || this.down.delete(e5);
        else this.down.clear();
      }
      this.onLockChange?.(this.locked);
    });
  }
  lock() {
    if (this.canvas && !this.locked) try {
      let e4 = this.canvas.requestPointerLock();
      e4 && typeof e4.catch == `function` && e4.catch(() => {
      });
    } catch {
    }
  }
  unlock() {
    this.locked && document.exitPointerLock();
  }
  ok(e4) {
    return this.enabled && (!this.allow || this.allow.has(e4));
  }
  held(e4) {
    return this.ok(e4) && this.down.has(e4);
  }
  hit(e4) {
    return this.ok(e4) && this.pressed.has(e4);
  }
  up(e4) {
    return this.released.has(e4);
  }
  rawHit(e4) {
    return this.pressed.has(e4);
  }
  set(e4, t2) {
    t2 ? (this.down.has(e4) || this.pressed.add(e4), this.down.add(e4)) : (this.down.delete(e4), this.released.add(e4));
  }
  endFrame() {
    this.pollGamepad();
    this.pressed.clear(), this.released.clear(), this.mouseDX = 0, this.mouseDY = 0, this.wheel = 0;
  }
}(), QT = [`wood`, `stone`, `metal`], $T = [[`KeyQ`, `wall`], [`KeyC`, `floor`], [`KeyF`, `stairs`], [`KeyV`, `roof`], [`KeyT`, `pad`]], eE = jy(), tE = new R(), nE = new R(), rE = new R(), iE = new R(), aE = new R(), oE = new It(), sE = new R(0, 1, 0), cE = new z(), lE = [], uE = { ar: [0, 0.22, 0.38, 0.3, 0.05, -0.25, -0.42, -0.3, -0.05, 0.25, 0.4, 0.2], smg: [0.25, -0.3, 0.4, -0.15, 0.3, -0.45, 0.2, -0.25], burst: [0, 0.28, 0.5], pistol: [0.12, -0.18, 0.2, -0.1], pump: [0.2, -0.2], tac: [0.15, -0.25, 0.25, -0.15], sniper: [0.1], rpg: [0] }, dE = 0.75, fE = 34, pE = [[0, 0], [0.2, 0.16], [-0.2, 0.16], [0.2, -0.14], [-0.2, -0.14]], mE = 0.28, hE = class {
  f;
  camera;
  hooks;
  yaw = 0;
  pitch = 0;
  camDist = 4;
  camSide = 0.85;
  fov = 80;
  pivotY = 0;
  eyeH = 1.58;
  camFree = 99;
  shakeAmt = 0;
  kickPitch = 0;
  kickYaw = 0;
  recoilN = 0;
  lastShot = -9;
  fireBuf = 0;
  scoped = false;
  interact = null;
  interactT = 0;
  openT = 0;
  lastPlaced = ``;
  weakTarget = null;
  weakPos = new R();
  weakSprite;
  arc = new Pn();
  arcDots;
  arcRing;
  arcPts = new Float32Array(276);
  prevSel = -1;
  pickupT = 0;
  orbitDist = 26;
  spread = 0;
  // Edit mode (Fortnite-style bubble editing)
  editMode = false;
  editPiece = null;
  editBubble = null;
  editTiles = [];
  editOriginalShape = null;
  webRope = null;
  // Vehicle
  inVehicle = false;
  vehicleSpeed = 0;
  constructor(e4, t2, n2) {
    this.f = e4, this.camera = t2, this.hooks = n2;
    let r = document.createElement(`canvas`);
    r.width = r.height = 128;
    let i = r.getContext(`2d`);
    i.strokeStyle = `#ffffff`, i.lineWidth = 9, i.beginPath(), i.arc(64, 64, 46, 0, 7), i.stroke(), i.strokeStyle = `#49c8ff`, i.lineWidth = 14, i.beginPath(), i.arc(64, 64, 28, 0, 7), i.stroke(), i.fillStyle = `#ffffff`, i.beginPath(), i.arc(64, 64, 9, 0, 7), i.fill();
    let a = new Na(r);
    a.colorSpace = He;
    let o = new $r({ map: a, depthTest: false, transparent: true, toneMapped: false });
    o.color.setScalar(1.6), this.weakSprite = new pi(o), this.weakSprite.visible = false, this.weakSprite.renderOrder = 40;
    let s2 = new bi({ color: new B(1.5, 1.5, 1.5), transparent: true, opacity: 0.85, depthWrite: false, toneMapped: false });
    this.arcDots = new ia(new gs(1, 8, 6), s2, fE), this.arcDots.frustumCulled = false, this.arcDots.renderOrder = 30;
    let c = new bi({ color: new B(1.8, 0.55, 0.3), transparent: true, opacity: 0.9, depthWrite: false, side: 2, toneMapped: false });
    this.arcRing = new Mi(new hs(0.78, 1, 36).rotateX(-Math.PI / 2), c), this.arcRing.renderOrder = 30, this.arc.add(this.arcDots, this.arcRing), this.arc.visible = false, Gy.onShot = (e5, t3, n3) => {
      e5 === this.f && (this.recoil(t3, n3), this.shake(t3.pellets>1?.09:t3.id===`sniper`?.12:.025));
      for(const bot of window.__game?.bots||[]) if(bot.f.alive && bot.f!==e5 && !(bot.f.isTeammate&&e5.isTeammate) && bot.f.pos.distanceTo(e5.pos)<65) bot.heardShot={x:e5.pos.x,z:e5.pos.z,t:G.time};
    };
  }
  reset() {
    this.inVehicle=false; this.releaseWeb(), this.editMode && this.exitEditMode(false), this.pitch = -0.2, this.kickPitch = 0, this.kickYaw = 0, this.shakeAmt = 0, this.scoped = false, this.interact = null, this.weakTarget = null, this.weakSprite.visible = false, this.lastPlaced = ``, this.openT = 0, this.fireBuf = 0, this.recoilN = 0, this.lastShot = -9, this.camFree = 99, this.arc.visible = false, this.pivotY = this.f.pos.y;
  }
  shake(e4) {
    this.shakeAmt = Math.min(1.8, this.shakeAmt + e4 * (Sf.s.shakeScale ?? 1));
  }
  aimRay(e4, t2) {
    this.camera.getWorldDirection(t2);
    let n2 = this.camera.position, r = this.f, i = Math.max(0, (r.pos.x - n2.x) * t2.x + (r.eyeY - n2.y) * t2.y + (r.pos.z - n2.z) * t2.z);
    e4.set(n2.x + t2.x * i, n2.y + t2.y * i, n2.z + t2.z * i);
  }
  recoil(e4, t2) {
    if (e4.thrown) return;
    let n2 = this.f;
    this.recoilN = G.time - this.lastShot < 0.42 ? this.recoilN + 1 : 0, this.lastShot = G.time;
    let r = e4.recoil * 0.0175 * (n2.aiming ? 0.62 : 1) * (n2.crouch ? 0.85 : 1), i = uE[e4.id] ?? [0], a = this.recoilN;
    this.kickPitch = Math.min(0.17, this.kickPitch + r * (1 + Math.min(a, 8) * 0.06) * K(0.9, 1.05)), this.kickYaw = Cp(this.kickYaw + r * (i[a % i.length] + K(-0.1, 0.1)), -0.07, 0.07), this.shake(e4.recoil * (t2 > 0 ? 0.04 : 0.07));
  }
  look(e4) {
    let t2 = this.f, n2 = t2.aiming ? Cp(this.fov / Sf.s.fov, 0.2, 1) * Sf.s.adsSensitivity : 1, r = 23e-4 * Sf.s.sensitivity * n2;
    this.yaw -= X.mouseDX * r, this.pitch -= X.mouseDY * r * (Sf.s.invertY ? -1 : 1), this.pitch = Cp(this.pitch, -1.45, 1.45);
    let i = G.time - this.lastShot < 0.2 ? 2.6 : 8;
    this.kickPitch = Dp(this.kickPitch, 0, i, e4), this.kickYaw = Dp(this.kickYaw, 0, i * 0.8, e4), Sf.cheats.aimbot && t2.mode === `ground` && (X.held(`Mouse0`) || X.held(`Mouse2`)) && t2.weapon && this.aimbot(e4);
    // Aim Assist (controller) - gentle pull toward enemies
    if (Sf.s.aimAssist > 0 && X.gamepad && t2.mode === `ground` && t2.weapon && (X.held(`Mouse0`) || X.held(`Mouse2`))) {
      this.aimAssist(e4);
    }
  }
  aimAssist(e4) {
    let t2 = this.f, n2 = null, r = 0.3, i = Math.sin(this.yaw) * Math.cos(this.pitch), a = Math.sin(this.pitch), o = Math.cos(this.yaw) * Math.cos(this.pitch);
    for (let e5 of G.fighters) {
      if (e5 === t2 || !e5.alive || e5.mode === `bus`) continue;
      let s3 = e5.pos.x - t2.pos.x, c2 = e5.pos.y + 1.6 - t2.eyeY, l3 = e5.pos.z - t2.pos.z, u2 = Math.hypot(s3, c2, l3);
      if (u2 > 150 || u2 < 0.5) continue;
      let d2 = Math.acos(Cp((s3 * i + c2 * a + l3 * o) / u2, -1, 1));
      d2 < r && (r = d2, n2 = e5);
    }
    if (!n2) return;
    this.aimRay(nE, tE);
    let s2 = n2.pos.x - nE.x, c = n2.pos.y + n2.headH - nE.y, l2 = n2.pos.z - nE.z, u = Math.atan2(s2, l2), d = Math.atan2(c, Math.hypot(s2, l2)), f = Sf.s.aimAssist * 0.3, p = u - this.yaw - this.kickYaw;
    for (; p > Math.PI; ) p -= Math.PI * 2;
    for (; p < -Math.PI; ) p += Math.PI * 2;
    this.yaw += p * f, this.pitch += (d - this.pitch - this.kickPitch) * f;
  }
  aimbot(e4) {
    let t2 = this.f, n2 = null, r = 0.6, i = Math.sin(this.yaw) * Math.cos(this.pitch), a = Math.sin(this.pitch), o = Math.cos(this.yaw) * Math.cos(this.pitch);
    for (let e5 of G.fighters) {
      if (e5 === t2 || !e5.alive || e5.mode === `bus`) continue;
      let s3 = e5.pos.x - t2.pos.x, c2 = e5.pos.y + 1.6 - t2.eyeY, l3 = e5.pos.z - t2.pos.z, u2 = Math.hypot(s3, c2, l3);
      if (u2 > 220 || u2 < 0.5) continue;
      let d2 = Math.acos(Cp((s3 * i + c2 * a + l3 * o) / u2, -1, 1));
      d2 < r && zy(t2.pos.x, t2.eyeY, t2.pos.z, e5.pos.x, e5.pos.y + 1.5, e5.pos.z) && (r = d2, n2 = e5);
    }
    if (!n2) return;
    this.aimRay(nE, tE);
    let s2 = n2.pos.x - nE.x, c = n2.pos.y + n2.headH - nE.y, l2 = n2.pos.z - nE.z, u = Math.atan2(s2, l2), d = Math.atan2(c, Math.hypot(s2, l2)), f = 1 - Math.exp(-28 * e4), p = u - this.yaw - this.kickYaw;
    for (; p > Math.PI; ) p -= Math.PI * 2;
    for (; p < -Math.PI; ) p += Math.PI * 2;
    this.yaw += p * f, this.pitch += (d - this.pitch - this.kickPitch) * f;
  }
  update(e4) {
    let t2 = this.f;
    this.look(e4), t2.yaw = this.yaw + this.kickYaw, t2.pitch = this.pitch + this.kickPitch;
    let n2 = +!!X.held(`KeyW`) - !!X.held(`KeyS`), r = +!!X.held(`KeyD`) - !!X.held(`KeyA`), i = Math.sin(this.yaw), a = Math.cos(this.yaw), o = i * n2 - a * r, s2 = a * n2 + i * r, c = Math.hypot(o, s2);
    c > 0 && (o /= c, s2 /= c), t2.wishX = o * (this.inVehicle ? 3 : 1), t2.wishZ = s2 * (this.inVehicle ? 3 : 1), t2.mode === `bus` ? (this.arc.visible = false, X.hit(`Space`) && this.hooks.requestDrop()) : t2.mode === `skydive` || t2.mode === `glide` ? (this.arc.visible = false, X.hit(`Space`) && (t2.mode === `skydive` ? (t2.mode = `glide`, t2.setGlider(true), W.play(`glider_open`)) : t2.pos.y - Oy(t2.pos.x, t2.pos.z, t2.pos.y) > 54 && (t2.mode = `skydive`, t2.setGlider(false))), c === 0 && t2.mode === `skydive` && (t2.wishX = i * 0.25, t2.wishZ = a * 0.25), c === 0 && t2.mode === `glide` && (t2.wishX = i * 0.6, t2.wishZ = a * 0.6), this.interact = null) : t2.mode === `ground` ? (t2.wantJump = X.held(`Space`), X.hit(`Space`) && (t2.jumpBuf = 0.14), X.hit(`ShiftLeft`) && !t2.grounded && (t2.wantDash = true), X.hit(`KeyZ`) && (t2.sliding ? t2.endSlide(true) : X.held(`ShiftLeft`) && n2 > 0 && !t2.aiming && t2.startSlide() || (t2.crouch = !t2.crouch)), t2.wantJump && t2.crouch && (t2.crouch = false), t2.sprint = X.held(`ShiftLeft`) && n2 > 0 && !t2.aiming && !t2.crouch && !t2.sliding, c > 0 && t2.char.emoting && t2.char.emote(0), X.hit(`KeyB`) && !this.emoteWheel && (G.hud.openEmoteWheel(), this.emoteWheel = true, this.emoteAng = 0, this.emoteSel = 0, G.hud.setEmoteSel(0)), this.emoteWheel && (this.emoteAng += X.mouseDX * 0.02, this.emoteSel = ((Math.round(this.emoteAng / (Math.PI / 4)) % 8) + 8) % 8, G.hud.setEmoteSel(this.emoteSel), X.up(`KeyB`) && (t2.char.emote(this.emoteSel + 1), W.play(`emote`), W.playStinger(`emote`), G.hud.closeEmoteWheel(), this.emoteWheel = false)), X.hit(`KeyH`) && this.inspectWeapon(), X.hit(`KeyK`) && this.pingTarget(), this.selection(), this.timers(e4), t2.buildMode && !this.editMode ? this.building(e4) : (Fx.showGhost(null, false), this.lastPlaced = ``, this.actions(e4)), this.updateArc(), this.interaction(e4), this.updateWeak(e4)) : this.arc.visible = false;
  }
  selection() {
    if (this.editMode) { if (X.hit(`KeyG`)) this.edit(); return; }
    let e4 = this.f;
    X.hit(`Digit1`) && e4.select(-1);
    for (let t2 = 0; t2 < 5; t2++) X.hit(`Digit` + (t2 + 2)) && (e4.select(t2), W.play(`swap`, { volume: 0.6 }));
    if (X.wheel !== 0) {
      let t2 = [-1, ...[0, 1, 2, 3, 4].filter((t3) => e4.slots[t3])], n2 = Math.max(0, t2.indexOf(e4.buildMode ? this.prevSel : e4.active));
      e4.select(t2[(n2 + Math.sign(X.wheel) + t2.length) % t2.length]), W.play(`swap`, { volume: 0.5 });
    }
    for (let [t2, n2] of $T) X.hit(t2) && (e4.buildMode && e4.buildPiece === n2 ? e4.select(this.prevSel) : (e4.buildMode || (this.prevSel = e4.active), e4.buildMode = true, e4.buildPiece = n2, e4.aiming = false, e4.reloadT = 0, e4.useT = 0, e4.burstLeft = 0, e4.refreshHeld(), W.play(`edit`, { volume: 0.5 })));
    (X.hit(`KeyX`) || e4.buildMode && X.hit(`Mouse2`)) && (e4.buildMat = QT[(QT.indexOf(e4.buildMat) + 1) % 3], W.play(`swap`, { volume: 0.5 })), X.hit(`KeyG`) && this.edit();
  }
  timers(e4) {
    let t2 = this.f;
    this.inspectT > 0 && (this.inspectT -= e4, this.inspectT <= 0 && t2.char.emote(0));
    if (t2.fireCd = Math.max(0, t2.fireCd - e4), t2.swingCd = Math.max(0, t2.swingCd - e4), t2.bloom = Math.max(0, t2.bloom - e4 * (t2.aiming ? 2.6 : 1.8)), t2.reloadT > 0 && (t2.reloadT -= e4, t2.reloadT <= 0 && (t2.finishReload(), W.play(`reload`, { volume: 0.5, pitch: 1.25 }))), t2.swingHit >= 0 && (t2.swingHit -= e4, t2.swingHit < 0 && this.swingImpact()), t2.useT > 0) {
      let n2 = t2.current;
      if (!n2 || Uh(n2.id)) t2.useT = 0;
      else if (t2.useT += e4, t2.useT >= t2.useTotal) {
        let e5 = Lh[n2.id];
        e5.heal && (t2.hp = Math.min(e5.heal >= 100 ? 100 : e5.cap, t2.hp + e5.heal)), e5.shield && (t2.shield = Math.min(e5.cap, t2.shield + e5.shield)), e5.place && G.usePlaceItem(t2, e5), e5.splash && G.splashHeal(t2, 20), W.play(e5.place ? `edit` : e5.shield ? `shield_up` : `heal_done`), am.spark(t2.pos.x, t2.pos.y + 1.1, t2.pos.z, e5.shield ? 4571903 : 7330876, 18, 3, 0.14, 0.7, -2, 2.6), G.hud.floatText(innerWidth / 2, innerHeight * 0.62, `+${e5.shield || e5.heal}`, e5.shield ? `shield` : `heal`), t2.useT = 0, --n2.count <= 0 && (t2.slots[t2.active] = null, t2.select(-1));
      }
    }
  }
  actions(e4) {
    let t2 = this.f, n2 = t2.current, r = t2.weapon;
    // Hold the mouse over the grid to paint a selection; release and press G to confirm.
    if (this.editMode) {
      if (!this.editPiece?.alive) { this.exitEditMode(false); return; }
      if (X.hit(`KeyR`)) this.resetEdit();
      this.updateEditGrid();
      return;
    }
    if (t2.aiming = !!r && X.held(`Mouse2`) && !t2.sprint, t2.active < 0) X.held(`Mouse0`) && t2.swingCd <= 0 && (t2.swingCd = 0.46, t2.swingHit = 0.19, t2.meleeCombo = G.time - (t2.meleeLast || -9) < 1.2 ? (t2.meleeCombo || 0) + 1 : 0, t2.meleeLast = G.time, t2.meleeCombo > 2 && (t2.meleeCombo = 0), t2.char.swing(), W.play(`swing`, { volume: 0.55, pitch: 0.92 + t2.meleeCombo * 0.08 }));
    else if (n2) {
      if (n2.id === `web`) { if (X.hit(`Mouse0`) && !this.webRope && t2.fireCd <= 0 && n2.count>0) this.shootWeb(n2); return; }
      if (r) !r.thrown && (X.hit(`KeyR`) || n2.count <= 0 && t2.fireCd <= 0) && t2.startReload() && W.play(`reload`, { volume: 0.8 }), this.fireBuf = X.hit(`Mouse0`) ? 0.14 : Math.max(0, this.fireBuf - e4), (r.auto ? X.held(`Mouse0`) : r.thrown ? this.fireBuf > 0 : this.fireBuf > 0 || X.held(`Mouse0`) && t2.fireCd <= 0 && r.fireRate < 1.5) && t2.fireCd <= 0 && t2.burstLeft <= 0 && (this.aimRay(nE, tE), $y(t2, nE.x, nE.y, nE.z, tE.x, tE.y, tE.z) && (this.fireBuf = 0));
      else if (X.hit(`Mouse0`) && t2.useT <= 0) {
        let e5 = Lh[n2.id];
        (!e5.place && (e5.heal ? t2.hp >= e5.cap : t2.shield >= e5.cap)) ? (W.play(`build_deny`, { volume: 0.5 }), G.hud.banner(``, e5.heal ? `Health is already high enough` : `Shield is already high enough`, 1200)) : (t2.useT = 1e-3, t2.useTotal = e5.useTime, W.play(e5.shield ? `drink` : `bandage`));
      }
    }
  }
  // Hold fire to keep the rope attached; releasing preserves tangential momentum.
  shootWeb(slot) {
    const fighter=this.f;
    this.aimRay(nE,tE);
    if(!Ly(nE.x,nE.y,nE.z,tE.x,tE.y,tE.z,65,eE,fighter,true) || eE.t<3) {
      W.play(`build_deny`,{volume:.35}); G.hud.banner(`WEB SHOOTERS`,`Aim at a nearby surface`,1000); return;
    }
    const target=new R(eE.x,eE.y,eE.z), start=new R(fighter.pos.x,fighter.eyeY,fighter.pos.z);
    const pull=target.clone().sub(start).normalize();
    fighter.vel.addScaledVector(pull, 8); fighter.vel.y=Math.max(5,fighter.vel.y);
    fighter.grounded=false; fighter.jumped=true; fighter.airT=0; fighter.fireCd=.3;
    const geo=new Hr(); geo.setAttribute(`position`,new V(new Float32Array(24),3));
    const mat=new da({color:0xd5f5ff,transparent:true,opacity:.95,depthWrite:false});
    const line=new Ca(geo,mat); line.frustumCulled=false; Fx.group.add(line);
    this.webRope={target,length:Math.max(4,start.distanceTo(target)*.92),line,time:0,bends:[],wrapCheck:0}; fighter.webSwing=true;
    am.spark(target.x,target.y,target.z,0xd9f5ff,8,2,.12,.35,-1,1);
    W.play(`edit`,{volume:.5,pitch:1.3});
    if(!Sf.cheats.infiniteAmmo && --slot.count<=0) slot.count=0;
  }
  releaseWeb() {
    if(!this.webRope) return;
    const {line}=this.webRope; line.removeFromParent(); line.geometry.dispose(); line.material.dispose(); this.webRope=null; if(this.f){this.f.webSwing=false;if(!this.f.grounded && Math.hypot(this.f.vel.x,this.f.vel.z)>9)this.f.webTrickT=1.3;}
    if(this.f?.current?.id===`web` && this.f.current.count<=0) {this.f.slots[this.f.active]=null;this.f.select(-1);}
  }
  updateWeb(dt) {
    const rope=this.webRope, f=this.f;
    if(!rope) return;
    if(!f.alive || f.mode!==`ground` || f.current?.id!==`web` || f.buildMode || !X.held(`Mouse0`)) {this.releaseWeb();return;}
    rope.time+=dt;
    if(X.hit(`Space`) && rope.time>.25 && !rope.trickCooldown){rope.trickCooldown=.8;f.vel.y+=4;f.webTrickT=2;G.hud.banner(`WEB TRICK`,`Air flip • keep your momentum`,900,`good`);am.spark(f.pos.x,f.pos.y+1,f.pos.z,0x9deaff,7,2,.1,.25,0,1);}
    rope.trickCooldown=Math.max(0,(rope.trickCooldown||0)-dt);
    const hand=new R(f.pos.x,f.eyeY,f.pos.z);
    // Approximate wrapping using exposed AABB corners, with a small clearance.
    rope.wrapCheck-=dt;
    if(rope.wrapCheck<=0){
      rope.wrapCheck=.09;
      const aim=rope.bends.length ? rope.bends[rope.bends.length-1] : rope.target;
      const dir=aim.clone().sub(hand),dist=dir.length();dir.normalize();const hit=jy();
      if(dist>2 && rope.bends.length<3 && Ly(hand.x,hand.y,hand.z,dir.x,dir.y,dir.z,dist-.5,hit,f,false) && hit.collider && hit.t>1){
        const c=hit.collider,candidates=[];
        for(const x of [c.minX-.3,c.maxX+.3])for(const z of [c.minZ-.3,c.maxZ+.3]){
          const v=new R(x,Math.max(c.minY+.15,Math.min(c.maxY+.15,hit.y)),z);
          candidates.push(v);
        }
        candidates.sort((a,b)=>a.distanceTo(hand)+a.distanceTo(aim)-b.distanceTo(hand)-b.distanceTo(aim));
        if(candidates[0].distanceTo(aim)>1)rope.bends.push(candidates[0]);
      } else if(rope.bends.length){
        const prev=rope.bends.length>1?rope.bends[rope.bends.length-2]:rope.target;
        const d=prev.clone().sub(hand),len=d.length();d.normalize();
        if(!Ly(hand.x,hand.y,hand.z,d.x,d.y,d.z,Math.max(0,len-.6),hit,f,false))rope.bends.pop();
      }
    }
    const anchor=rope.bends.length?rope.bends[rope.bends.length-1]:rope.target;
    let used=0,previous=rope.target;for(const bend of rope.bends){used+=previous.distanceTo(bend);previous=bend;}
    const radial=hand.clone().sub(anchor), distance=radial.length();
    if(distance<.01 || distance>90 || rope.time>8) {this.releaseWeb();return;}
    radial.multiplyScalar(1/distance);
    // A soft, bounded spring keeps the rope taut without teleporting through walls.
    const stretch=Math.max(0,distance-Math.max(3,rope.length-used)), outward=f.vel.dot(radial);
    if(stretch>0 || outward>0) {
      const correction=Math.min(55,stretch*14+Math.max(0,outward)*7);
      f.vel.addScaledVector(radial,-correction*dt);
      f.grounded=false; f.jumped=true;
    }
    const a=rope.line.geometry.getAttribute(`position`);
    const points=[hand,...rope.bends.slice().reverse(),rope.target];
    for(let i=0;i<4;i++){const p=points[Math.min(i,points.length-1)],q=points[Math.min(i+1,points.length-1)];a.setXYZ(i*2,p.x,p.y,p.z);a.setXYZ(i*2+1,q.x,q.y,q.z);}a.needsUpdate=true;
  }
  updateArc() {
    let e4 = this.f, t2 = e4.weapon, n2 = !!t2 && !!t2.thrown && !e4.buildMode && e4.alive && e4.mode === `ground` && e4.useT <= 0;
    if (this.arc.visible = n2, !n2) return;
    this.aimRay(nE, tE);
    let r = Nb(e4, tE.x, tE.y, tE.z, this.arcPts, aE), i = this.arcPts, a = 0;
    for (let e5 = 1; e5 < r; e5++) a += Math.hypot(i[e5 * 3] - i[e5 * 3 - 3], i[e5 * 3 + 1] - i[e5 * 3 - 2], i[e5 * 3 + 2] - i[e5 * 3 - 1]);
    let o = Math.max(0.45, a / fE), s2 = 1, c = 0, l2 = r > 1 ? Math.hypot(i[3] - i[0], i[4] - i[1], i[5] - i[2]) : 0, u = 0;
    for (let e5 = 1; e5 <= fE; e5++) {
      let t3 = e5 * o;
      for (; s2 < r - 1 && c + l2 < t3; ) c += l2, s2++, l2 = Math.hypot(i[s2 * 3] - i[s2 * 3 - 3], i[s2 * 3 + 1] - i[s2 * 3 - 2], i[s2 * 3 + 2] - i[s2 * 3 - 1]);
      if (c + l2 < t3 || s2 >= r) break;
      let n3 = l2 > 1e-5 ? (t3 - c) / l2 : 0, a2 = (s2 - 1) * 3, d2 = s2 * 3;
      rE.set(Tp(i[a2], i[d2], n3), Tp(i[a2 + 1], i[d2 + 1], n3), Tp(i[a2 + 2], i[d2 + 2], n3));
      let f2 = 0.085 * (1 - e5 / fE * 0.4);
      cE.makeScale(f2, f2, f2).setPosition(rE), this.arcDots.setMatrixAt(u++, cE);
    }
    this.arcDots.count = u, this.arcDots.instanceMatrix.needsUpdate = true;
    let d = (r - 1) * 3;
    this.arcRing.position.set(i[d], i[d + 1] + 0.04, i[d + 2]), oE.setFromUnitVectors(sE, aE.lengthSq() > 0.5 ? aE : sE), this.arcRing.quaternion.copy(oE);
    let f = 1 + Math.sin(G.time * 8) * 0.06;
    this.arcRing.scale.setScalar(0.9 * f);
  }
  building(dt) {
    let e4 = this.f;
    e4.aiming = false, X.hit(`KeyR`) && (e4.stairRot = ((e4.stairRot < 0 ? 0 : e4.stairRot) + 1) % 4, W.play(`edit`, { volume: 0.4 }));
    let t2 = Sf.cheats.infiniteMats, n2 = Lx(e4.buildPiece, e4.pos.x, e4.pos.y, e4.pos.z, this.yaw, this.pitch, e4.buildMat, e4.buildPiece === `stairs` ? e4.stairRot : -1), r = Nx(n2), i = !!Fx.pieceAt(r), a = !i && Fx.canPlace(n2), o = t2 || e4.mats[e4.buildMat] >= 10;
    if (Fx.showGhost(n2, i || a && o), !X.held(`Mouse0`)) {
      this.lastPlaced = ``;
      this.turboT = 0;
      return;
    }
    // Turbo Build: allow holding LMB to place pieces rapidly
    this.turboT = (this.turboT || 0) + dt;
    if (i || (r === this.lastPlaced && this.turboT < 0.08 && Fx.pieceAt(r))) return;
    if (!a || !o) {
      X.hit(`Mouse0`) && (W.play(`build_deny`, { volume: 0.6 }), o || G.hud.banner(``, `Not enough ${Vh[e4.buildMat]}`, 1100));
      return;
    }
    let s2 = Fx.place(n2, false, e4);
    s2 && (this.lastPlaced = r, t2 || (e4.mats[e4.buildMat] -= 10), e4.builds++, e4.stairRot = -1, W.play(`build_` + e4.buildMat, { volume: 0.8, pitch: K(0.94, 1.06) }), am.buildPlace(s2.cx, s2.cy, s2.cz));
  }
  edit() {
    if (this.editMode) { this.exitEditMode(true); return; }
    this.aimRay(nE,tE);
    if (!Ly(nE.x,nE.y,nE.z,tE.x,tE.y,tE.z,7,eE,null,false)) return;
    const piece=eE.collider?.owner;
    if (piece instanceof Px && !piece.world && [`wall`,`wallGrid`,`wallTriL`,`wallTriR`,`wallDoor`,`wallWin`,`half`,`floor`,`floorHalf`,`stairs`,`pyr`,`roof`].includes(piece.spec.shape)) {
      this.enterEditMode(piece); W.play(`edit`);
    } else { W.play(`build_deny`,{volume:.5}); G.hud.banner(`WALL EDIT`, `Aim at a player-built piece`, 1200); }
  }
  enterEditMode(piece) {
    this.editMode=true; this.editPiece=piece; this.editOriginalShape=piece.spec.shape;
    Fx.showGhost(null,false);
    if (!this.editBubble) {
      const group=this.editBubble=new Pn();
      group.matrixAutoUpdate=false; group.renderOrder=100;
      const geo=new La(5/3-.055,4/3-.055,.025);
      for(let row=0;row<3;row++) for(let col=0;col<3;col++) {
        const mat=new bi({color:0x43c5ff,transparent:true,opacity:.58,depthWrite:false,depthTest:false,side:2});
        const tile=new Mi(geo,mat); tile.position.set(-5/2+(col+.5)*5/3,4-(row+.5)*4/3,0); tile.renderOrder=101; group.add(tile);
      }
      Fx.group.add(group);
    }
    const wall=[`wall`,`wallGrid`,`wallTriL`,`wallTriR`,`wallDoor`,`wallWin`,`half`].includes(piece.spec.shape);
    this.editHorizontal=!wall;
    this.editPlaneY=piece.spec.shape===`stairs`?2:piece.spec.shape===`pyr`||piece.spec.shape===`roof`?1.5:.08;
    this.editBubble.children.forEach((tile,i)=>{
      const row=Math.floor(i/3),col=i%3;
      tile.rotation.x=wall?0:-Math.PI/2;
      tile.scale.set(1,wall?1:1.25,1);
      tile.position.set(-2.5+(col+.5)*5/3,wall?4-(row+.5)*4/3:this.editPlaneY,wall?0:2.5-(row+.5)*5/3);
    });
    this.editBubble.matrix.copy(piece.base); this.editBubble.matrixWorldNeedsUpdate=true; this.editBubble.visible=true;
    const selectedMask=piece.spec.shape===`wallGrid` ? piece.spec.mask : piece.spec.shape===`wallTriR` ? 31 : piece.spec.shape===`wallTriL` ? 55 : piece.spec.shape===`wallWin` ? 1<<4 : piece.spec.shape===`wallDoor` ? (1<<4)|(1<<7) : piece.spec.shape===`half` ? 7 : 0;
    this.editTiles=Array.from({length:9},(_,i)=>({on:!(selectedMask&(1<<i))})); this.editLast=-1;
    this.updateEditColors(-1);
    G.hud.banner(`BUILD EDIT`, `Drag tiles • G confirm • R reset • release options in Settings`, 3000, `info`);
  }
  updateEditColors(hover) {
    if(!this.editBubble) return;
    this.editBubble.children.forEach((mesh,i)=>{
      const selected=!this.editTiles[i]?.on;
      mesh.material.color.setHex(selected ? 0xbceaff : i===hover ? 0x9ceeff : 0x36a9f6);
      mesh.material.opacity=selected ? .78 : i===hover ? .72 : .48;
    });
  }
  updateEditGrid() {
    this.aimRay(nE,tE);
    const inv=new z().copy(this.editPiece.base).invert();
    const origin=nE.clone().applyMatrix4(inv), direction=tE.clone().transformDirection(inv);
    let hover=-1;
    const axis=this.editHorizontal?direction.y:direction.z;
    if(Math.abs(axis)>1e-5) {
      const distance=this.editHorizontal?(this.editPlaneY-origin.y)/axis:-origin.z/axis;
      if(distance>=0 && distance<=12) {
        const x=origin.x+direction.x*distance, y=this.editHorizontal?origin.z+direction.z*distance:origin.y+direction.y*distance;
        if(x>=-2.5 && x<2.5 && (this.editHorizontal?y>=-2.5 && y<2.5:y>=0 && y<4)) {
          const row=this.editHorizontal?Math.floor((2.5-y)*3/5):Math.floor((4-y)*3/4);
          hover=Math.min(2,row)*3+Math.floor((x+2.5)*3/5);
        }
      }
    }
    if(X.held(`Mouse0`) && hover>=0 && this.editTiles[hover].on) {
      this.editTiles[hover].on=false; W.play(`edit`,{volume:.25,pitch:1.2});
    }
    this.updateEditColors(hover);
    if(X.up(`Mouse0`)) {
      if(Sf.s.editConfirmOnRelease) this.exitEditMode(true);
      else if(Sf.s.editResetOnRelease) this.resetEdit();
    }
  }
  exitEditMode(confirm = true) {
    if(confirm && this.editPiece?.alive) {
      const selected=this.editTiles.map((t,i)=>!t.on?i:-1).filter(i=>i>=0);
      const original=this.editPiece.spec.shape; let shape=null, rotation=this.editPiece.spec.rot;
      if([`wall`,`wallGrid`,`wallTriL`,`wallTriR`,`wallDoor`,`wallWin`,`half`].includes(original)) {
        if(selected.length===0) shape=`wall`;
        else if(selected.length===1 && selected[0]===4) shape=`wallWin`;
        else if(selected.length===2 && selected.includes(4) && selected.includes(7)) shape=`wallDoor`;
        else if(selected.length===3 && [0,1,2].every(i=>selected.includes(i))) shape=`half`;
        else if(selected.length===5 && [0,1,2,3,4].every(i=>selected.includes(i))) shape=`wallTriR`;
        else if(selected.length===5 && [0,1,2,4,5].every(i=>selected.includes(i))) shape=`wallTriL`;
        else if(selected.length>0 && selected.length<9) shape=`wallGrid`;
      } else if(original===`floor` || original===`floorHalf`) {
        if(!selected.length) shape=`floor`;
        else if([0,3,6].every(i=>selected.includes(i)) && selected.length===3) {shape=`floorHalf`; rotation=2;}
        else if([2,5,8].every(i=>selected.includes(i)) && selected.length===3) {shape=`floorHalf`; rotation=0;}
      } else if(original===`stairs`) {shape=`stairs`; if(selected.length) rotation=(rotation+(selected[0]%3===0?3:1))%4;}
      else if(original===`pyr` || original===`roof`) {shape=selected.length?`roof`:`pyr`; if(selected.length) rotation=selected[0]%3===0?3:selected[0]%3===2?1:0;}
      if(!shape) { W.play(`build_deny`,{volume:.5}); G.hud.banner(`INVALID EDIT`,`Try a center window, top row, or a full side column`,2600); return; }
      const mask=selected.reduce((bits,i)=>bits|(1<<i),0);
      if(original!==shape || rotation!==this.editPiece.spec.rot || (shape===`wallGrid` && mask!==this.editPiece.spec.mask)) Fx.edit(this.editPiece,shape,rotation,mask);
      W.play(`edit`,{volume:.6});
    }
    this.editMode=false; this.editPiece=null; this.editOriginalShape=null;
    if(this.editBubble) this.editBubble.visible=false;
    this.editTiles=[];
  }
  resetEdit() { for(const tile of this.editTiles) tile.on=true; this.updateEditColors(-1); W.play(`edit`,{volume:.5}); }
  // Weapon Inspect: raise weapon, show stats banner
  inspectWeapon() {
    let e4 = this.f;
    if (!e4.weapon || this.inspectT > 0 || !e4.alive || e4.buildMode) return;
    let t2 = e4.current && Ih[e4.current.id];
    if (!t2) return;
    this.inspectT = 2.2, e4.char.emote(3), W.play(`swap`, { volume: 0.5, pitch: 0.8 });
    let r = `${t2.damage} DMG · ${t2.fireRate.toFixed(1)}/s · MAG ${t2.mag}`;
    G.hud.banner(t2.name.toUpperCase(), r, 1500, `info`);
  }
  // Ping: mark aim location for teammates
  pingTarget() {
    let e4 = this.f;
    if (!e4.alive) return;
    this.aimRay(nE, tE);
    let t2 = rb(e4, nE.x, nE.y, nE.z, tE.x, tE.y, tE.z, 60);
    t2 ? G.pingAt(t2.x, t2.y + 0.5, t2.z) : G.pingAt(nE.x + tE.x * 40, nE.y + tE.y * 40, nE.z + tE.z * 40);
  }
  swingImpact() {
    let e4 = this.f;
    this.aimRay(nE, tE);
    let t2 = rb(e4, nE.x, nE.y, nE.z, tE.x, tE.y, tE.z, 3.3);
    if (!t2) return;
    this.shake(0.16);
    let n2 = t2.target;
    if (n2) {
      if (n2 === this.weakTarget && n2.alive && rE.set(t2.x, t2.y, t2.z).distanceTo(this.weakPos) < 0.5 && (W.play(`weakpoint`, { volume: 0.9 }), am.spark(t2.x, t2.y, t2.z, 7328511, 14, 5, 0.16, 0.4, 4, 3), n2.damage(50, e4, true)), n2.alive) {
        let r = Math.abs(t2.ny) < 0.6, i = r ? -t2.nz : 1, a = r ? t2.nx : 0, o = (n2.maxHp <= 240 && n2.mat === `wood` && n2.label !== `Build` && n2.label !== `Structure` ? 0.1 : 0.55) * K(-1, 1);
        this.weakPos.set(t2.x + i * o + t2.nx * 0.06, Cp(t2.y + K(-0.5, 0.5), e4.pos.y + 0.55, e4.pos.y + 2), t2.z + a * o + t2.nz * 0.06), this.weakTarget = n2;
      } else this.weakTarget = null;
    }
  }
  updateWeak(e4) {
    let t2 = this.weakSprite, n2 = this.weakTarget, r = !!n2 && n2.alive && this.f.active < 0 && !this.f.buildMode && this.weakPos.distanceTo(this.f.pos) < 6;
    if (t2.visible = r, !r) {
      n2 && (!n2.alive || this.weakPos.distanceTo(this.f.pos) > 9) && (this.weakTarget = null);
      return;
    }
    t2.position.copy(this.weakPos);
    let i = 0.46 + Math.sin(G.time * 9) * 0.05;
    t2.scale.set(i, i, 1);
  }
  interaction(e4) {
    let t2 = this.f, n2 = G.hud;
    const target=window.__game?.reviveTarget;
    if(target&&target.alive&&target.downed){
      const wait=Math.max(0,(t2.reviveCooldownUntil||0)-G.time);
      n2.setPrompt(`E`,wait>0?`Revive cooldown ${Math.ceil(wait)}s`:`Hold to Revive ${target.name} (${Math.max(0,5-(target.reviveProgress||0)).toFixed(1)}s)`,wait>0?undefined:wp((target.reviveProgress||0)/5));
      this.openT=0;return;
    }
    const door=(G.doors||[]).find(d=>d.piece.alive && Math.abs(t2.pos.y-d.center.y)<2 && Math.hypot(t2.pos.x-d.center.x,t2.pos.z-d.center.z)<2.2);
    const closeLoot=Xx.nearest(t2);
    if(door && !closeLoot && !this.inVehicle) {
      const locked=door.vault && door.lockedBy?.alive;
      n2.setPrompt(`E`,locked?`Vault locked — defeat Citadel Commander`:door.open?`Close Door`:door.vault?`Open Vault`:`Open Door`);
      if(X.hit(`KeyE`)) {
        if(locked) {W.play(`build_deny`,{volume:.4});G.hud.banner(`VAULT LOCKED`,`Defeat the Cavern Commander`,1500);return;}
        if(door.open && Math.hypot(t2.pos.x-door.center.x,t2.pos.z-door.center.z)<.8) {G.hud.banner(`DOOR`,`Step back to close`,900);return;}
        door.open=!door.open; door.hinge.rotation.y=door.open?Math.PI*.48:0;
        if(door.open) Ey(door.collider); else Ty(door.collider);
        W.play(`car_door`,{volume:.5});
      }
      return;
    }
    if (this.pickupT -= e4, this.pickupT <= 0) {
      this.pickupT = 0.08;
      for (let e5 of Xx.autoPickup(t2, lE)) this.toast(e5);
    }
    // Pressing interact in open water no longer creates random loot.
    this.interactT -= e4, this.interactT <= 0 && (this.interactT = 0.07, this.interact = Xx.nearest(t2));
    let r = this.interact;
    if (!r) this.openT = 0, n2.setPrompt(null);
    else if (r.type === `box`) {
      let i = r.box;
      if (i.kind === `supply`) {
        let r2 = X.held(`KeyE`);
        this.openT = r2 ? this.openT + e4 : 0, n2.setPrompt(`E`, `Hold to Open Supply Drop`, r2 ? wp(this.openT / dE) : void 0), this.openT >= dE && (Xx.open(i, t2), this.openT = 0, this.interact = null, this.interactT = 0);
        return;
      }
      this.openT = 0, n2.setPrompt(`E`, i.kind === `chest` ? `Open Chest` : i.kind === `ammo` ? `Search Ammo Box` : `Open Supply Llama`), X.hit(`KeyE`) && (Xx.open(i, t2), this.interact = null, this.interactT = 0);
    } else {
      this.openT = 0;
      let e5 = t2.slots.every((e6) => e6);
      {
        let t3 = r.item, i = this.hooks.icon(t3.kind === `ammo` ? `ammo_` + t3.id : t3.kind === `mats` ? `mat_` + t3.id : t3.id);
        n2.setPromptItem(`E`, e5 ? `Swap` : `Pick up`, { kind: t3.kind, id: t3.id, rarity: t3.rarity, count: t3.count, icon: i });
      }
      if (X.hit(`KeyE`)) {
        let e6 = r.item;
        Xx.pickup(t2, e6, true) && this.toast(e6), this.interact = null, this.interactT = 0;
      }
    }
  }
  toast(e4) {
    let t2 = G.hud;
    e4.kind === `ammo` ? (W.play(`ammo`, { volume: 0.6 }), t2.pickupToast(this.hooks.icon(`ammo_` + e4.id), `+${e4.count} ${Xx.label(e4).replace(/ x\d+$/, ``)}`, null)) : e4.kind === `mats` ? (W.play(`mats`, { volume: 0.7 }), t2.pickupToast(this.hooks.icon(`mat_` + e4.id), `+${e4.count} ${Vh[e4.id]}`, null)) : (W.play(`pickup`, { volume: 0.8 }), t2.pickupToast(this.hooks.icon(e4.id), Gh(e4.id), e4.rarity));
  }
  updateCamera(e4, t2, n2 = !t2) {
    let r = this.f, i = this.camera, a = this.yaw + this.kickYaw, o = this.pitch + this.kickPitch, s2 = Math.cos(o);
    tE.set(Math.sin(a) * s2, Math.sin(o), Math.cos(a) * s2), iE.set(-Math.cos(a), 0, Math.sin(a));
    let c = 3.9, l2 = 0.85, u = Sf.s.fov, d = 0.22, f = r.weapon, p = Math.hypot(r.vel.x, r.vel.z);
    this.scoped = false, t2 ? (c = this.orbitDist, l2 = 0, d = 2) : r.mode === `skydive` ? (c = 7.5, l2 = 0, u += 10, d = 0.6) : r.mode === `glide` ? (c = 6.8, l2 = 0, u += 4, d = 1) : r.aiming && f ? (f.id === `sniper` ? (this.scoped = true, c = 0, l2 = 0, d = 0) : (c = 2.15, l2 = 0.62), u = f.adsFov) : r.sliding ? (u += 7, c = 3.6) : r.sprint && r.grounded && p > 6.5 && (u += 4), r.dashT > 0 && (u += 11), r.char.emoting && !t2 && (c = 5.2, l2 = 0);
    let m = r.aiming && !!f, h = 1 - Math.exp(-(this.scoped ? 30 : m ? 15 : 10) * e4);
    this.camDist += (c - this.camDist) * h, this.camSide += (l2 - this.camSide) * h, this.fov += (u - this.fov) * (1 - Math.exp(-(m || this.scoped ? 16 : Math.abs(u - this.fov) > 6 ? 11 : 6) * e4)), Math.abs(i.fov - this.fov) > 0.01 && (i.fov = this.fov, i.updateProjectionMatrix()), t2 ? nE.copy(t2) : (this.pivotY = Math.abs(r.pos.y - this.pivotY) > 3 ? r.pos.y : Dp(this.pivotY, r.pos.y, 22, e4), this.eyeH = Dp(this.eyeH, r.sliding ? 1.05 : r.crouch ? 1.15 : 1.58, 12, e4), nE.set(r.pos.x, this.pivotY + this.eyeH, r.pos.z)), rE.copy(nE).addScaledVector(iE, this.camSide).addScaledVector(tE, -this.camDist), rE.y += d;
    let g2 = rE.x - nE.x, _2 = rE.y - nE.y, v = rE.z - nE.z, y = Math.hypot(g2, _2, v);
    if (y > 0.05 && n2) {
      g2 /= y, _2 /= y, v /= y;
      let t3 = y;
      for (let [e5, n4] of pE) Ly(nE.x + iE.x * e5, nE.y + n4, nE.z + iE.z * e5, g2, _2, v, y + mE, eE) && (t3 = Math.min(t3, eE.t - mE));
      t3 = Math.max(0.15, t3), this.camFree = t3 < this.camFree ? t3 : Dp(this.camFree, t3, 5, e4);
      let n3 = Math.min(y, this.camFree);
      rE.set(nE.x + g2 * n3, nE.y + _2 * n3, nE.z + v * n3);
    } else this.camFree = y;
    if (i.position.copy(rE), rE.addScaledVector(tE, 10), i.lookAt(rE), this.shakeAmt > 1e-3) {
      let t3 = this.shakeAmt * 0.012;
      i.rotation.x += K(-t3, t3), i.rotation.y += K(-t3, t3), i.rotation.z += K(-t3, t3) * 0.6, this.shakeAmt = Dp(this.shakeAmt, 0, 7, e4);
    }
    r.char.root.visible = r.visible && !this.scoped && i.position.distanceTo(nE) > 0.7;
    let b = f && !f.thrown ? (r.aiming ? f.adsSpread : f.spread) * (1 + r.bloom) * (r.grounded ? 1 : 1.5) : 0;
    this.spread = Tp(this.spread, Math.tan(b * Math.PI / 180) / Math.tan(this.fov * Math.PI / 360) * (innerHeight / 2), 0.35);
  }
}, Z = { uTime: { value: 0 }, uNoise: { value: null }, uSunDir: { value: fp.clone() }, uStorm: { value: 0 }, uWind: { value: new L(0.8, 0.6) }, uPlayer: { value: new R() }, uCam: { value: new R() }, uDay: { value: 1 }, uHorizon: { value: new B(11853055) }, uZenith: { value: new B(2783464) }, uSunCol: { value: new B(16773594) } };
function gE() {
  Z.uNoise.value = ox();
}
var _E = `
uniform sampler2D uNoise;
uniform float uTime;
/** 0 = in a cloud's shadow, 1 = open sun. Big soft-edged blobs drifting with the wind. */
float cloudLit(vec2 p) {
  // ~100 m cloud shadows drifting east with the cloud deck (about 3 m/s), edges broken up by a finer octave
  vec2 q = p - vec2(3.0, 1.2) * uTime;
  float a = texture2D(uNoise, q * 0.0024).r;
  float b = texture2D(uNoise, q * 0.0061 + 0.37).g;
  return smoothstep(0.425, 0.5, a * 0.68 + b * 0.32);
}
float cloudShade(vec2 p) { return mix(0.76, 1.0, cloudLit(p)); }
/** cloud shadow as a colour: the shade loses the warm sun first, so it reads cool blue rather than grey */
vec3 cloudTint(vec2 p) { return mix(vec3(0.63, 0.71, 0.91), vec3(1.0), cloudLit(p)); }
`, vE = { name: `CopyShader`, uniforms: { tDiffuse: { value: null }, opacity: { value: 1 } }, vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`, fragmentShader: `

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}` }, yE = class {
  constructor() {
    this.isPass = true, this.enabled = true, this.needsSwap = true, this.clear = false, this.renderToScreen = false;
  }
  setSize() {
  }
  render() {
    console.error(`THREE.Pass: .render() must be implemented in derived pass.`);
  }
  dispose() {
  }
}, bE = new Nc(-1, 1, 1, -1, 0, 1), xE = new class extends Hr {
  constructor() {
    super(), this.setAttribute(`position`, new V([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)), this.setAttribute(`uv`, new V([0, 2, 0, 0, 2, 0], 2));
  }
}(), SE = class {
  constructor(e4) {
    this._mesh = new Mi(xE, e4);
  }
  dispose() {
    this._mesh.geometry.dispose();
  }
  render(e4) {
    e4.render(this._mesh, bE);
  }
  get material() {
    return this._mesh.material;
  }
  set material(e4) {
    this._mesh.material = e4;
  }
}, CE = class extends yE {
  constructor(e4, t2 = `tDiffuse`) {
    super(), this.textureID = t2, this.uniforms = null, this.material = null, e4 instanceof Es ? (this.uniforms = e4.uniforms, this.material = e4) : e4 && (this.uniforms = Cs.clone(e4.uniforms), this.material = new Es({ name: e4.name === void 0 ? `unspecified` : e4.name, defines: Object.assign({}, e4.defines), uniforms: this.uniforms, vertexShader: e4.vertexShader, fragmentShader: e4.fragmentShader })), this._fsQuad = new SE(this.material);
  }
  render(e4, t2, n2) {
    this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = n2.texture), this._fsQuad.material = this.material, this.renderToScreen ? (e4.setRenderTarget(null), this._fsQuad.render(e4)) : (e4.setRenderTarget(t2), this.clear && e4.clear(e4.autoClearColor, e4.autoClearDepth, e4.autoClearStencil), this._fsQuad.render(e4));
  }
  dispose() {
    this.material.dispose(), this._fsQuad.dispose();
  }
}, wE = class extends yE {
  constructor(e4, t2) {
    super(), this.scene = e4, this.camera = t2, this.clear = true, this.needsSwap = false, this.inverse = false;
  }
  render(e4, t2, n2) {
    let r = e4.getContext(), i = e4.state;
    i.buffers.color.setMask(false), i.buffers.depth.setMask(false), i.buffers.color.setLocked(true), i.buffers.depth.setLocked(true);
    let a, o;
    this.inverse ? (a = 0, o = 1) : (a = 1, o = 0), i.buffers.stencil.setTest(true), i.buffers.stencil.setOp(r.REPLACE, r.REPLACE, r.REPLACE), i.buffers.stencil.setFunc(r.ALWAYS, a, 4294967295), i.buffers.stencil.setClear(o), i.buffers.stencil.setLocked(true), e4.setRenderTarget(n2), this.clear && e4.clear(), e4.render(this.scene, this.camera), e4.setRenderTarget(t2), this.clear && e4.clear(), e4.render(this.scene, this.camera), i.buffers.color.setLocked(false), i.buffers.depth.setLocked(false), i.buffers.color.setMask(true), i.buffers.depth.setMask(true), i.buffers.stencil.setLocked(false), i.buffers.stencil.setFunc(r.EQUAL, 1, 4294967295), i.buffers.stencil.setOp(r.KEEP, r.KEEP, r.KEEP), i.buffers.stencil.setLocked(true);
  }
}, TE = class extends yE {
  constructor() {
    super(), this.needsSwap = false;
  }
  render(e4) {
    e4.state.buffers.stencil.setLocked(false), e4.state.buffers.stencil.setTest(false);
  }
}, EE = class {
  constructor(e4, t2) {
    if (this.renderer = e4, this._pixelRatio = e4.getPixelRatio(), t2 === void 0) {
      let n2 = e4.getSize(new L());
      this._width = n2.width, this._height = n2.height, t2 = new rn(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: _ }), t2.texture.name = `EffectComposer.rt1`;
    } else this._width = t2.width, this._height = t2.height;
    this.renderTarget1 = t2, this.renderTarget2 = t2.clone(), this.renderTarget2.texture.name = `EffectComposer.rt2`, this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2, this.renderToScreen = true, this.passes = [], this.copyPass = new CE(vE), this.copyPass.material.blending = 0, this.timer = new Gc();
  }
  swapBuffers() {
    let e4 = this.readBuffer;
    this.readBuffer = this.writeBuffer, this.writeBuffer = e4;
  }
  addPass(e4) {
    this.passes.push(e4), e4.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  insertPass(e4, t2) {
    this.passes.splice(t2, 0, e4), e4.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  removePass(e4) {
    let t2 = this.passes.indexOf(e4);
    t2 !== -1 && this.passes.splice(t2, 1);
  }
  isLastEnabledPass(e4) {
    for (let t2 = e4 + 1; t2 < this.passes.length; t2++) if (this.passes[t2].enabled) return false;
    return true;
  }
  render(e4) {
    this.timer.update(), e4 === void 0 && (e4 = this.timer.getDelta());
    let t2 = this.renderer.getRenderTarget(), n2 = false;
    for (let t3 = 0, r = this.passes.length; t3 < r; t3++) {
      let r2 = this.passes[t3];
      if (r2.enabled !== false) {
        if (r2.renderToScreen = this.renderToScreen && this.isLastEnabledPass(t3), r2.render(this.renderer, this.writeBuffer, this.readBuffer, e4, n2), r2.needsSwap) {
          if (n2) {
            let t4 = this.renderer.getContext(), n3 = this.renderer.state.buffers.stencil;
            n3.setFunc(t4.NOTEQUAL, 1, 4294967295), this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, e4), n3.setFunc(t4.EQUAL, 1, 4294967295);
          }
          this.swapBuffers();
        }
        wE !== void 0 && (r2 instanceof wE ? n2 = true : r2 instanceof TE && (n2 = false));
      }
    }
    this.renderer.setRenderTarget(t2);
  }
  reset(e4) {
    if (e4 === void 0) {
      let t2 = this.renderer.getSize(new L());
      this._pixelRatio = this.renderer.getPixelRatio(), this._width = t2.width, this._height = t2.height, e4 = this.renderTarget1.clone(), e4.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
    }
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.renderTarget1 = e4, this.renderTarget2 = e4.clone(), this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2;
  }
  setSize(e4, t2) {
    this._width = e4, this._height = t2;
    let n2 = this._width * this._pixelRatio, r = this._height * this._pixelRatio;
    this.renderTarget1.setSize(n2, r), this.renderTarget2.setSize(n2, r);
    for (let e5 = 0; e5 < this.passes.length; e5++) this.passes[e5].setSize(n2, r);
  }
  setPixelRatio(e4) {
    this._pixelRatio = e4, this.setSize(this._width, this._height);
  }
  dispose() {
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.copyPass.dispose();
  }
}, DE = class extends yE {
  constructor(e4, t2, n2 = null, r = null, i = null) {
    super(), this.scene = e4, this.camera = t2, this.overrideMaterial = n2, this.clearColor = r, this.clearAlpha = i, this.clear = true, this.clearDepth = false, this.needsSwap = false, this.isRenderPass = true, this._oldClearColor = new B();
  }
  render(e4, t2, n2) {
    let r = e4.autoClear;
    e4.autoClear = false;
    let i, a;
    this.overrideMaterial !== null && (a = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial), this.clearColor !== null && (e4.getClearColor(this._oldClearColor), e4.setClearColor(this.clearColor, e4.getClearAlpha())), this.clearAlpha !== null && (i = e4.getClearAlpha(), e4.setClearAlpha(this.clearAlpha)), this.clearDepth == 1 && e4.clearDepth(), e4.setRenderTarget(this.renderToScreen ? null : n2), this.clear === true && e4.clear(e4.autoClearColor, e4.autoClearDepth, e4.autoClearStencil), e4.render(this.scene, this.camera), this.clearColor !== null && e4.setClearColor(this._oldClearColor), this.clearAlpha !== null && e4.setClearAlpha(i), this.overrideMaterial !== null && (this.scene.overrideMaterial = a), e4.autoClear = r;
  }
}, OE = { name: `LuminosityHighPassShader`, uniforms: { tDiffuse: { value: null }, luminosityThreshold: { value: 1 }, smoothWidth: { value: 1 }, defaultColor: { value: new B(0) }, defaultOpacity: { value: 0 } }, vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`, fragmentShader: `

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}` }, kE = class e3 extends yE {
  constructor(e4, t2 = 1, n2, r) {
    super(), this.strength = t2, this.radius = n2, this.threshold = r, this.resolution = e4 === void 0 ? new L(256, 256) : new L(e4.x, e4.y), this.clearColor = new B(0, 0, 0), this.needsSwap = false, this.renderTargetsHorizontal = [], this.renderTargetsVertical = [], this.nMips = 5;
    let i = Math.round(this.resolution.x / 2), a = Math.round(this.resolution.y / 2);
    this.renderTargetBright = new rn(i, a, { type: _, depthBuffer: false }), this.renderTargetBright.texture.name = `UnrealBloomPass.bright`, this.renderTargetBright.texture.generateMipmaps = false;
    for (let e5 = 0; e5 < this.nMips; e5++) {
      let t3 = new rn(i, a, { type: _, depthBuffer: false });
      t3.texture.name = `UnrealBloomPass.h` + e5, t3.texture.generateMipmaps = false, this.renderTargetsHorizontal.push(t3);
      let n3 = new rn(i, a, { type: _, depthBuffer: false });
      n3.texture.name = `UnrealBloomPass.v` + e5, n3.texture.generateMipmaps = false, this.renderTargetsVertical.push(n3), i = Math.round(i / 2), a = Math.round(a / 2);
    }
    let o = OE;
    this.highPassUniforms = Cs.clone(o.uniforms), this.highPassUniforms.luminosityThreshold.value = r, this.highPassUniforms.smoothWidth.value = 0.01, this.materialHighPassFilter = new Es({ uniforms: this.highPassUniforms, vertexShader: o.vertexShader, fragmentShader: o.fragmentShader }), this.separableBlurMaterials = [];
    let s2 = [6, 10, 14, 18, 22];
    i = Math.round(this.resolution.x / 2), a = Math.round(this.resolution.y / 2);
    for (let e5 = 0; e5 < this.nMips; e5++) this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s2[e5])), this.separableBlurMaterials[e5].uniforms.invSize.value = new L(1 / i, 1 / a), i = Math.round(i / 2), a = Math.round(a / 2);
    this.compositeMaterial = this._getCompositeMaterial(this.nMips), this.compositeMaterial.uniforms.blurTexture1.value = this.renderTargetsVertical[0].texture, this.compositeMaterial.uniforms.blurTexture2.value = this.renderTargetsVertical[1].texture, this.compositeMaterial.uniforms.blurTexture3.value = this.renderTargetsVertical[2].texture, this.compositeMaterial.uniforms.blurTexture4.value = this.renderTargetsVertical[3].texture, this.compositeMaterial.uniforms.blurTexture5.value = this.renderTargetsVertical[4].texture, this.compositeMaterial.uniforms.bloomStrength.value = t2, this.compositeMaterial.uniforms.bloomRadius.value = 0.1;
    let c = [1, 0.8, 0.6, 0.4, 0.2];
    this.compositeMaterial.uniforms.bloomFactors.value = c, this.bloomTintColors = [new R(1, 1, 1), new R(1, 1, 1), new R(1, 1, 1), new R(1, 1, 1), new R(1, 1, 1)], this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors, this.copyUniforms = Cs.clone(vE.uniforms), this.blendMaterial = new Es({ uniforms: this.copyUniforms, vertexShader: vE.vertexShader, fragmentShader: vE.fragmentShader, premultipliedAlpha: true, blending: 2, depthTest: false, depthWrite: false, transparent: true }), this._oldClearColor = new B(), this._oldClearAlpha = 1, this._basic = new bi(), this._fsQuad = new SE(null);
  }
  dispose() {
    for (let e4 = 0; e4 < this.renderTargetsHorizontal.length; e4++) this.renderTargetsHorizontal[e4].dispose();
    for (let e4 = 0; e4 < this.renderTargetsVertical.length; e4++) this.renderTargetsVertical[e4].dispose();
    this.renderTargetBright.dispose();
    for (let e4 = 0; e4 < this.separableBlurMaterials.length; e4++) this.separableBlurMaterials[e4].dispose();
    this.compositeMaterial.dispose(), this.blendMaterial.dispose(), this._basic.dispose(), this._fsQuad.dispose();
  }
  setSize(e4, t2) {
    let n2 = Math.round(e4 / 2), r = Math.round(t2 / 2);
    this.renderTargetBright.setSize(n2, r);
    for (let e5 = 0; e5 < this.nMips; e5++) this.renderTargetsHorizontal[e5].setSize(n2, r), this.renderTargetsVertical[e5].setSize(n2, r), this.separableBlurMaterials[e5].uniforms.invSize.value = new L(1 / n2, 1 / r), n2 = Math.round(n2 / 2), r = Math.round(r / 2);
  }
  render(t2, n2, r, i, a) {
    t2.getClearColor(this._oldClearColor), this._oldClearAlpha = t2.getClearAlpha();
    let o = t2.autoClear;
    t2.autoClear = false, t2.setClearColor(this.clearColor, 0), a && t2.state.buffers.stencil.setTest(false), this.renderToScreen && (this._fsQuad.material = this._basic, this._basic.map = r.texture, t2.setRenderTarget(null), t2.clear(), this._fsQuad.render(t2)), this.highPassUniforms.tDiffuse.value = r.texture, this.highPassUniforms.luminosityThreshold.value = this.threshold, this._fsQuad.material = this.materialHighPassFilter, t2.setRenderTarget(this.renderTargetBright), t2.clear(), this._fsQuad.render(t2);
    let s2 = this.renderTargetBright;
    for (let n3 = 0; n3 < this.nMips; n3++) this._fsQuad.material = this.separableBlurMaterials[n3], this.separableBlurMaterials[n3].uniforms.colorTexture.value = s2.texture, this.separableBlurMaterials[n3].uniforms.direction.value = e3.BlurDirectionX, t2.setRenderTarget(this.renderTargetsHorizontal[n3]), t2.clear(), this._fsQuad.render(t2), this.separableBlurMaterials[n3].uniforms.colorTexture.value = this.renderTargetsHorizontal[n3].texture, this.separableBlurMaterials[n3].uniforms.direction.value = e3.BlurDirectionY, t2.setRenderTarget(this.renderTargetsVertical[n3]), t2.clear(), this._fsQuad.render(t2), s2 = this.renderTargetsVertical[n3];
    this._fsQuad.material = this.compositeMaterial, this.compositeMaterial.uniforms.bloomStrength.value = this.strength, this.compositeMaterial.uniforms.bloomRadius.value = this.radius, this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors, t2.setRenderTarget(this.renderTargetsHorizontal[0]), t2.clear(), this._fsQuad.render(t2), this._fsQuad.material = this.blendMaterial, this.copyUniforms.tDiffuse.value = this.renderTargetsHorizontal[0].texture, a && t2.state.buffers.stencil.setTest(true), this.renderToScreen ? (t2.setRenderTarget(null), this._fsQuad.render(t2)) : (t2.setRenderTarget(r), this._fsQuad.render(t2)), t2.setClearColor(this._oldClearColor, this._oldClearAlpha), t2.autoClear = o;
  }
  _getSeparableBlurMaterial(e4) {
    let t2 = [], n2 = e4 / 3;
    for (let r2 = 0; r2 < e4; r2++) t2.push(0.39894 * Math.exp(-0.5 * r2 * r2 / (n2 * n2)) / n2);
    let r = [], i = [];
    for (let n3 = 1; n3 < e4; n3 += 2) {
      let a = t2[n3], o = n3 + 1 < e4 ? t2[n3 + 1] : 0, s2 = a + o;
      r.push((n3 * a + (n3 + 1) * o) / s2), i.push(s2);
    }
    return new Es({ defines: { KERNEL_PAIRS: r.length }, uniforms: { colorTexture: { value: null }, invSize: { value: new L(0.5, 0.5) }, direction: { value: new L(0.5, 0.5) }, centerWeight: { value: t2[0] }, gaussianOffsets: { value: r }, gaussianWeights: { value: i } }, vertexShader: `

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`, fragmentShader: `

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}` });
  }
  _getCompositeMaterial(e4) {
    return new Es({ defines: { NUM_MIPS: e4 }, uniforms: { blurTexture1: { value: null }, blurTexture2: { value: null }, blurTexture3: { value: null }, blurTexture4: { value: null }, blurTexture5: { value: null }, bloomStrength: { value: 1 }, bloomFactors: { value: null }, bloomTintColors: { value: null }, bloomRadius: { value: 0 } }, vertexShader: `

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`, fragmentShader: `

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}` });
  }
};
kE.BlurDirectionX = new L(1, 0), kE.BlurDirectionY = new L(0, 1);
var AE = { uniforms: { tDiffuse: { value: null }, tAO: { value: null }, tDepth: { value: null }, uProjInv: { value: new z() }, uAOTexel: { value: new L(1, 1) }, uTexel: { value: new L(1, 1) }, uAO: { value: 0 }, uSharpen: { value: 0 }, uExposure: { value: 0.8 }, uVibrance: { value: 0.32 }, uSaturation: { value: 1.04 }, uContrast: { value: 1.04 }, uVignette: { value: 0.22 }, uStorm: { value: 0 }, uTime: { value: 0 }, uScope: { value: 0 }, uDebugAO: { value: 0 }, uSunRay: { value: new R() }, uAspect: { value: 1 } }, vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`, fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D tAO;
    uniform sampler2D tDepth;
    uniform mat4 uProjInv;
    uniform vec2 uAOTexel, uTexel;
    uniform float uDebugAO;
    uniform float uAO, uSharpen, uExposure, uVibrance, uSaturation, uContrast, uVignette, uStorm, uTime, uScope, uAspect;
    uniform vec3 uSunRay;
    varying vec2 vUv;
    vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      // light luma sharpening (unsharp mask on the HDR image, before tone mapping)
      if (uSharpen > 0.0) {
        vec3 n = texture2D(tDiffuse, vUv + vec2(uTexel.x, 0.0)).rgb + texture2D(tDiffuse, vUv - vec2(uTexel.x, 0.0)).rgb
               + texture2D(tDiffuse, vUv + vec2(0.0, uTexel.y)).rgb + texture2D(tDiffuse, vUv - vec2(0.0, uTexel.y)).rgb;
        float l0 = luma(c), dl = l0 - luma(n) * 0.25;
        dl = clamp(dl, -0.08 - l0 * 0.15, 0.08 + l0 * 0.15);
        c *= max(0.0, 1.0 + uSharpen * dl / max(l0, 1e-3));
      }
      // ambient occlusion: depth-aware 3x3 upsample of the half-res AO buffer
      if (uAO > 0.0) {
        float d = texture2D(tDepth, vUv).x;
        if (d < 0.99999) {
          vec4 vp = uProjInv * vec4(vec3(vUv, d) * 2.0 - 1.0, 1.0);
          float zc = -vp.z / vp.w;
          float sum = 0.0, wsum = 0.0;
          for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
            vec2 s = textureLod(tAO, vUv + vec2(float(i), float(j)) * uAOTexel, 0.0).rg;
            float w = max(0.0, 1.0 - abs(s.y - zc) / (zc * 0.06 + 0.08)) + 1e-4;
            sum += s.x * w; wsum += w;
          }
          float ao = sum / wsum;
          c *= mix(1.0, ao, uAO);
          if (uDebugAO > 0.5) { gl_FragColor = vec4(vec3(ao), 1.0); return; }
        }
      }
      // soft sun shafts: march toward the sun through the depth buffer; open sky lets light through, leaves, roofs
      // and cloud puffs cut it into rays. Only runs while the sun is near the screen.
      if (uSunRay.z > 0.001) {
        vec2 dir = uSunRay.xy - vUv;
        float j = hash(gl_FragCoord.xy + fract(uTime) * 17.0);
        float acc = 0.0;
        for (int i = 0; i < 18; i++) {
          float t = (float(i) + j) / 18.0;
          vec2 p = clamp(vUv + dir * t, vec2(0.001), vec2(0.999));
          acc += step(0.99999, textureLod(tDepth, p, 0.0).x) * (1.0 - t * 0.6);
        }
        acc /= 18.0 * 0.7;
        float r = length(dir * vec2(uAspect, 1.0));
        float fall = pow(max(0.0, 1.0 - r * 0.85), 2.2);
        c += vec3(1.0, 0.84, 0.58) * acc * fall * uSunRay.z;
      }
      c *= uExposure;
      c = mix(c, c * vec3(0.80, 0.66, 1.16), uStorm * 0.55);
      c = aces(c);
      // vibrance: lift the muted colours more than the already saturated ones
      float l = luma(c);
      float mx = max(c.r, max(c.g, c.b)), mn = min(c.r, min(c.g, c.b));
      float sat = (mx - mn) / max(mx, 1e-4);
      c = mix(vec3(l), c, uSaturation + uVibrance * (1.0 - sat) * smoothstep(0.02, 0.2, mx));
      c = max(c, 0.0);
      // gentle S-curve around the mid grey, then lift the toe a touch so shadows never crush
      c = mix(c, c * c * (3.0 - 2.0 * c), uContrast - 1.0);
      c = c * 0.985 + vec3(0.010, 0.013, 0.020);
      c += (l - 0.45) * vec3(0.03, 0.012, -0.03);            // warm highlights, cool shadows (split tone)
      vec2 q = (vUv - 0.5) * vec2(1.0, 0.88);
      float vig = smoothstep(0.95, 0.30, length(q) * 1.3);
      c *= mix(1.0, vig, uVignette + uStorm * 0.25 + uScope * 0.45);
      c += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;
      c = clamp(c, 0.0, 1.0);
      vec3 lo = c * 12.92, hi = 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055;
      gl_FragColor = vec4(mix(lo, hi, step(vec3(0.0031308), c)), 1.0);
    }` }, jE = `
uniform sampler2D tDepth;
uniform mat4 uProjInv;
uniform vec2 uTexel;
uniform float uRadius, uIntensity, uBias, uProjScale, uAspect, uMaxScreen;
varying vec2 vUv;
vec3 vpos(vec2 uv) {
  float d = textureLod(tDepth, uv, 0.0).x;
  vec4 p = uProjInv * vec4(vec3(uv, d) * 2.0 - 1.0, 1.0);
  return p.xyz / p.w;
}
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
void main() {
  float d0 = texture2D(tDepth, vUv).x;
  if (d0 >= 0.99999) { gl_FragColor = vec4(1.0, 1.0e5, 0.0, 1.0); return; }
  vec3 P = vpos(vUv);
  float z = -P.z;
  vec2 t = uTexel;
  vec3 pr = vpos(vUv + vec2(t.x, 0.0)), pl = vpos(vUv - vec2(t.x, 0.0));
  vec3 pu = vpos(vUv + vec2(0.0, t.y)), pd = vpos(vUv - vec2(0.0, t.y));
  vec3 dx = abs(pr.z - P.z) < abs(P.z - pl.z) ? pr - P : P - pl;
  vec3 dy = abs(pu.z - P.z) < abs(P.z - pd.z) ? pu - P : P - pd;
  vec3 N = normalize(cross(dx, dy));
  // world radius grows a little with distance so far buildings still get contact shading
  float R = uRadius * (1.0 + z * 0.012);
  float rUv = min(R * uProjScale / z, uMaxScreen);
  float fade = 1.0 - smoothstep(140.0, 260.0, z);
  if (rUv < t.y * 1.5 || fade <= 0.0) { gl_FragColor = vec4(1.0, z, 0.0, 1.0); return; }
  float a0 = ign(gl_FragCoord.xy) * 6.2831853;
  float occ = 0.0, R2 = R * R;
  const int NS = 12;
  for (int i = 0; i < NS; i++) {
    float fi = float(i);
    float a = a0 + fi * 2.3999632;
    float r = sqrt((fi + 0.5) / float(NS));
    vec3 S = vpos(vUv + vec2(cos(a) / uAspect, sin(a)) * r * rUv);
    vec3 v = S - P;
    float vv = dot(v, v);
    occ += max(0.0, dot(v, N) * inversesqrt(vv + 1e-4) - uBias) * max(0.0, 1.0 - vv / R2);
  }
  occ /= float(NS);
  float ao = clamp(1.0 - occ * uIntensity * fade, 0.0, 1.0);
  gl_FragColor = vec4(ao, z, 0.0, 1.0);
}`, ME = class extends yE {
  finalU;
  getCamera;
  strength;
  rt;
  fsq;
  mat;
  on = false;
  constructor(e4, t2, n2) {
    super(), this.finalU = e4, this.getCamera = t2, this.strength = n2, this.needsSwap = false, this.rt = new rn(2, 2, { type: _, depthBuffer: false, magFilter: s, minFilter: s }), this.mat = new Es({ vertexShader: AE.vertexShader, fragmentShader: jE, depthTest: false, depthWrite: false, uniforms: { tDepth: { value: null }, uProjInv: { value: new z() }, uTexel: { value: new L() }, uRadius: { value: 1.25 }, uIntensity: { value: 2 }, uBias: { value: 0.12 }, uProjScale: { value: 1 }, uAspect: { value: 1 }, uMaxScreen: { value: 0.09 } } }), this.fsq = new SE(this.mat);
  }
  setStrength(e4) {
    this.strength = e4;
  }
  setSize(e4, t2) {
    let n2 = Math.max(1, Math.round(e4 / 2)), r = Math.max(1, Math.round(t2 / 2));
    this.rt.setSize(n2, r), this.mat.uniforms.uTexel.value.set(1 / n2, 1 / r), this.mat.uniforms.uAspect.value = e4 / Math.max(1, t2), this.finalU.uAOTexel.value.set(1 / n2, 1 / r), this.finalU.uTexel.value.set(1 / Math.max(1, e4), 1 / Math.max(1, t2));
  }
  render(e4, t2, n2) {
    let r = this.getCamera();
    if (n2.depthTexture && (this.finalU.tDepth.value = n2.depthTexture), !this.on || !n2.depthTexture) {
      this.finalU.uAO.value = 0;
      return;
    }
    let i = this.mat.uniforms;
    i.tDepth.value = n2.depthTexture, i.uProjInv.value.copy(r.projectionMatrixInverse), i.uProjScale.value = r.projectionMatrix.elements[5] * 0.5, this.finalU.tDepth.value = n2.depthTexture, this.finalU.uProjInv.value.copy(r.projectionMatrixInverse), this.finalU.tAO.value = this.rt.texture, this.finalU.uAO.value = this.strength, e4.setRenderTarget(this.rt), this.fsq.render(e4);
  }
  dispose() {
    this.rt.dispose(), this.mat.dispose(), this.fsq.dispose();
  }
};
function NE(e4) {
  let t2 = new Un(), n2 = new Es({ side: 1, depthWrite: false, vertexShader: `varying vec3 vD; void main() { vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`, fragmentShader: `
      varying vec3 vD;
      void main() {
        vec3 d = normalize(vD);
        vec3 zen = vec3(0.30, 0.55, 1.00), hor = vec3(0.92, 0.97, 1.05), gnd = vec3(0.42, 0.44, 0.34);
        vec3 c = d.y > 0.0 ? mix(hor, zen, pow(d.y, 0.6)) : mix(hor * 0.75, gnd, pow(min(1.0, -d.y * 2.5), 0.7));
        // a broad warm glow toward the sun so metals pick up a warm side
        float s = max(dot(d, normalize(vec3(0.52, 0.7, 0.42))), 0.0);
        c += vec3(1.0, 0.85, 0.6) * pow(s, 6.0) * 0.9;
        gl_FragColor = vec4(c, 1.0);
      }` });
  t2.add(new Mi(new gs(10, 32, 16), n2));
  let r = new Ol(e4), i = r.fromScene(t2, 0.02, 0.1, 100);
  return r.dispose(), n2.dispose(), i.texture;
}
var PE = { low: { pixelRatio: 0.75, msaa: 0, bloom: false, shadow: 1024, shadowRange: 70, grass: 22e3, grassPatch: 46, ao: 0, sharpen: 0 }, medium: { pixelRatio: 1, msaa: 2, bloom: true, shadow: 2048, shadowRange: 90, grass: 55e3, grassPatch: 58, ao: 0, sharpen: 0.25 }, high: { pixelRatio: 1, msaa: 4, bloom: true, shadow: 2048, shadowRange: 105, grass: 95e3, grassPatch: 68, ao: 0.85, sharpen: 0.35 }, epic: { pixelRatio: 1.5, msaa: 4, bloom: true, shadow: 4096, shadowRange: 130, grass: 17e4, grassPatch: 84, ao: 1, sharpen: 0.25 }, ultra: { pixelRatio: 2, msaa: 8, bloom: true, shadow: 8192, shadowRange: 180, grass: 28e4, grassPatch: 110, ao: 1, sharpen: 0.4 } }, FE = 0.5, IE = 0.32, LE = new R(), RE = new R(), zE = new R(), BE = class {
  renderer;
  composer;
  bloom;
  final;
  ao;
  renderPass;
  preset = PE.high;
  scene;
  constructor(e4, t2, n2) {
    this.renderer = e4, this.scene = t2, this.renderPass = new DE(t2, n2), e4.shadowMap.type = 1;
    try {
      t2.environment = NE(e4), t2.environmentIntensity = FE;
    } catch {
    }
    this.build();
  }
  build() {
    let e4 = this.renderer.getSize(new L()), t2 = this.renderer.getPixelRatio(), n2 = Math.max(2, Math.round(e4.x * t2)), r = Math.max(2, Math.round(e4.y * t2)), i = new rn(n2, r, { type: _, samples: this.preset.msaa, depthBuffer: true, depthTexture: new Pa(n2, r, g) });
    this.composer?.dispose(), this.ao?.dispose(), this.composer = new EE(this.renderer, i), this.composer.addPass(this.renderPass), this.final = new CE(AE), this.ao = new ME(this.final.uniforms, () => this.renderPass.camera, this.preset.ao ?? 0), this.ao.on = (this.preset.ao ?? 0) > 0, this.composer.addPass(this.ao), this.bloom = new kE(new L(e4.x / 2, e4.y / 2), 0.24, 0.5, 1.15), this.bloom.enabled = this.preset.bloom, this.composer.addPass(this.bloom), this.composer.addPass(this.final), this.final.uniforms.uSharpen.value = this.preset.sharpen ?? 0;
  }
  setQuality(e4) {
    let t2 = e4.msaa !== this.preset.msaa;
    this.preset = e4, t2 && this.build(), this.bloom.enabled = e4.bloom, this.ao.on = (e4.ao ?? 0) > 0, this.ao.setStrength(e4.ao ?? 0), this.final.uniforms.uSharpen.value = e4.sharpen ?? 0;
  }
  setSize(e4, t2) {
    this.composer.setPixelRatio(this.renderer.getPixelRatio()), this.composer.setSize(e4, t2);
  }
  set camera(e4) {
    this.renderPass.camera = e4;
  }
  render(e4, t2) {
    let n2 = this.final.uniforms, r = this.renderPass.camera;
    LE.copy(fp).multiplyScalar(1e3).add(r.position).project(r);
    let i = LE.z > 1 || RE.copy(fp).dot(r.getWorldDirection(zE)) < 0, a = Math.max(Math.abs(LE.x), Math.abs(LE.y)), o = i ? 0 : (1 - Math.min(1, Math.max(0, (a - 0.9) / 0.6))) * (1 - Z.uStorm.value) * !!this.preset.bloom;
    n2.uSunRay.value.set(LE.x * 0.5 + 0.5, LE.y * 0.5 + 0.5, o * IE), n2.uAspect.value = r.aspect || 1, n2.uStorm.value = Z.uStorm.value, n2.uTime.value = Z.uTime.value, n2.uScope.value = t2, this.scene.environmentIntensity = FE * (1 - Z.uStorm.value * 0.5), this.composer.render(e4);
  }
}, VE = `
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * p;
  gl_Position.z = gl_Position.w; // pin to the far plane
}`, HE = `
uniform vec3 uSunDir;
uniform float uStorm;
uniform float uTime;
uniform sampler2D uNoise;
uniform vec3 uHorizon;
uniform vec3 uZenith;
uniform float uDay;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  float h = max(d.y, 0.0);
  // gradient: luminous haze at the horizon into a saturated blue overhead
  vec3 col = mix(uHorizon, uZenith, pow(h, 0.46));
  // soft bright band hugging the horizon (high-key look)
  col = mix(col, uHorizon * 1.08 + vec3(0.02, 0.02, 0.0), pow(1.0 - h, 10.0) * 0.7);
  // below the horizon keep the haze colour so the far ocean melts into it
  if (d.y < 0.0) col = mix(uHorizon, uHorizon * 0.9, clamp(-d.y * 3.0, 0.0, 1.0));

  float sd = max(dot(d, uSunDir), 0.0);
  vec3 sunCol = vec3(1.0, 0.92, 0.76);
  col += sunCol * (pow(sd, 5.0) * 0.14 + pow(sd, 32.0) * 0.32 + pow(sd, 400.0) * 0.8);
  col += sunCol * smoothstep(0.99955, 0.99975, sd) * 20.0;  // disc (blooms)
  
  // Stars at night
  if (uDay < 0.5 && d.y > 0.1) {
    vec2 starPos = d.xz / (d.y + 0.5) * 50.0;
    float star = fract(sin(dot(floor(starPos), vec2(12.9898, 78.233))) * 43758.5453);
    float starBrightness = smoothstep(0.98, 1.0, star) * (0.5 - uDay) * 2.0;
    col += vec3(starBrightness) * 0.8;
  }

  // thin high cirrus streaks
  if (d.y > 0.02) {
    vec2 p = d.xz / (d.y + 0.18);
    float n = texture2D(uNoise, p * vec2(0.07, 0.16) + vec2(uTime * 0.0016, 0.0)).r * 0.6 + texture2D(uNoise, p * 0.31 - vec2(0.0, uTime * 0.0022)).g * 0.4;
    float c = smoothstep(0.54, 0.80, n) * smoothstep(0.03, 0.25, d.y) * 0.38;
    col = mix(col, vec3(1.0, 0.99, 0.97) * (1.0 + pow(sd, 8.0) * 0.5), c);
  }

  // storm: bruise the sky purple and dim it
  vec3 stormCol = mix(vec3(0.18, 0.08, 0.34), vec3(0.44, 0.24, 0.66), pow(1.0 - h, 2.0));
  col = mix(col, stormCol, uStorm * 0.9);
  gl_FragColor = vec4(col, 1.0);
}`, UE = `
varying vec3 vN;
varying vec3 vW;
varying float vBase;
attribute float aBase;
void main() {
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vBase = aBase;
  gl_Position = projectionMatrix * viewMatrix * w;
}`, WE = `
uniform vec3 uSunDir;
uniform float uStorm;
uniform vec3 uHorizon;
uniform vec3 uCam;
varying vec3 vN;
varying vec3 vW;
varying float vBase;
void main() {
  vec3 n = normalize(vN);
  float sun = dot(n, uSunDir) * 0.5 + 0.5;
  float up = n.y * 0.5 + 0.5;
  float lit = clamp(sun * 0.75 + up * 0.35, 0.0, 1.0);
  vec3 shadow = vec3(0.66, 0.74, 0.90);
  vec3 light = vec3(1.0, 0.985, 0.96);
  // two-tone cel-ish split with a soft edge
  vec3 col = mix(shadow, light, smoothstep(0.30, 0.70, lit));
  col = mix(col, shadow * 0.95, (1.0 - vBase) * 0.5);        // flat bluer bellies
  vec3 v = normalize(uCam - vW);
  col += vec3(1.0, 0.95, 0.85) * pow(1.0 - max(dot(n, v), 0.0), 3.0) * 0.22 * sun; // silver lining
  col *= 1.1;
  col = mix(col, vec3(0.33, 0.22, 0.50), uStorm * 0.8);
  float dist = length(vW - uCam);
  col = mix(col, uHorizon, clamp(dist / 2600.0, 0.0, 1.0) * 0.7);
  gl_FragColor = vec4(col, 1.0);
}`, GE = 16771532, KE = 3.4, qE = 13550079, JE = 13086207, YE = 1.05, XE = 14543359, ZE = 0.3, QE = 95e-5, $E = class {
  group = new Pn();
  sun;
  hemi;
  fog;
  amb;
  dome;
  clouds;
  dayHorizon = new B(11984383);
  dayZenith = new B(2520294);
  dayFog = new B(11064312);
  stormFog = new B(5978764);
  stormSun = new B(13215487);
  stormSky = new B(12029183);
  duskHorizon = new B(0xffb47b);
  duskFog = new B(0xe7b9a5);
  duskSun = new B(0xffa454);
  valleyFog = new B(0x91a9a9);
  shadowRange = 110;
  _v = new R();
  constructor(e4) {
    Z.uHorizon.value.copy(this.dayHorizon), Z.uZenith.value.copy(this.dayZenith), this.dome = new Mi(new gs(1, 32, 16), new Es({ vertexShader: VE, fragmentShader: HE, side: 1, depthWrite: false, depthTest: true, fog: false, uniforms: { uSunDir: Z.uSunDir, uStorm: Z.uStorm, uTime: Z.uTime, uNoise: Z.uNoise, uHorizon: Z.uHorizon, uZenith: Z.uZenith, uDay: Z.uDay } })), this.dome.scale.setScalar(3e3), this.dome.frustumCulled = false, this.dome.renderOrder = -100, this.group.add(this.dome), this.sun = new Fc(GE, KE), this.sun.castShadow = true, this.sun.shadow.bias = -4e-4, this.sun.shadow.normalBias = 0.06, this.sun.shadow.radius = 2.6, this.sun.shadow.intensity = 0.9, this.group.add(this.sun, this.sun.target), this.hemi = new gc(qE, JE, YE), this.group.add(this.hemi), this.amb = new Ic(XE, ZE), this.group.add(this.amb), this.fog = new Hn(this.dayFog.getHex(), QE), e4.fog = this.fog, this.clouds = this.buildClouds(), this.group.add(this.clouds), e4.add(this.group), this.setShadowQuality(2048, 110);
  }
  buildClouds() {
    let e4 = new jp(77), t2 = [], n2 = [], r = [], i = new fs(1, 2), a = i.getAttribute(`position`), o = new R(), s2 = new R();
    for (let i2 = 0; i2 < 80; i2++) {
      let c2 = i2 >= 50, l3 = e4.range(0, Math.PI * 2), u = c2 ? e4.range(900, 2e3) : e4.range(60, 760), d = Math.cos(l3) * u, f = Math.sin(l3) * u, p = c2 ? e4.range(150, 420) : e4.range(150, 235), m = c2 ? e4.range(2, 4.2) : e4.range(0.8, 1.7), h = e4.int(10, 18), g2 = e4.range(40, 80) * m, _2 = e4.range(0, Math.PI);
      for (let i3 = 0; i3 < h; i3++) {
        let c3 = h === 1 ? 0 : i3 / (h - 1) - 0.5, l4 = (1 - Math.abs(c3) * 1.2) * e4.range(16, 28) * m + 7 * m, u2 = d + Math.cos(_2) * c3 * g2 + e4.range(-8, 8) * m, v = f + Math.sin(_2) * c3 * g2 + e4.range(-8, 8) * m, y = p + l4 * 0.42 + e4.range(-2, 5) * m, b = e4.range(0.62, 0.86);
        for (let e5 = 0; e5 < a.count; e5++) {
          o.fromBufferAttribute(a, e5), s2.copy(o);
          let i4 = o.y * b;
          i4 < -0.28 && (i4 = -0.28 + (i4 + 0.28) * 0.18), t2.push(u2 + o.x * l4, y + i4 * l4, v + o.z * l4), n2.push(s2.x, s2.y, s2.z), r.push(Math.min(1, Math.max(0, (i4 + 0.3) / 0.5)));
        }
      }
    }
    i.dispose();
    let c = new Hr();
    c.setAttribute(`position`, new V(t2, 3)), c.setAttribute(`normal`, new V(n2, 3)), c.setAttribute(`aBase`, new V(r, 1));
    let l2 = new Mi(c, new Es({ vertexShader: UE, fragmentShader: WE, fog: false, uniforms: { uSunDir: Z.uSunDir, uStorm: Z.uStorm, uCam: Z.uCam, uHorizon: Z.uHorizon } }));
    return l2.frustumCulled = false, l2;
  }
  setShadowQuality(e4, t2) {
    let n2 = this.sun.shadow;
    this.shadowRange = t2, n2.mapSize.x !== e4 && (n2.mapSize.set(e4, e4), n2.map?.dispose(), n2.map = null);
    let r = n2.camera;
    r.left = -t2, r.right = t2, r.top = t2, r.bottom = -t2, r.near = 1, r.far = 700, r.updateProjectionMatrix(), n2.radius = Math.max(1.2, Math.min(4, e4 / 2048 * 2.6 * (105 / Math.max(40, t2)))), this.sun.castShadow = e4 > 0;
  }
  update(e4, t2, n2, r) {
    this.dome.position.copy(t2.position), Z.uCam.value.copy(t2.position), this.clouds.position.x = (Z.uTime.value * 2.2 + 400) % 800 - 400;
    let i = this.shadowRange * 2 / this.sun.shadow.mapSize.x, a = Math.round(n2.x / i) * i, o = Math.round(n2.z / i) * i;
    this.sun.target.position.set(a, n2.y, o), this._v.copy(fp).multiplyScalar(340), this.sun.position.set(a + this._v.x, n2.y + this._v.y, o + this._v.z), this.sun.target.updateMatrixWorld();
    let s2 = r;
    // Day/Night cycle: 5-minute cycle (300s), night at ~50% through
    let dn = 0.5 + 0.5 * Math.cos((G.time / 300) * Math.PI * 2); // Start matches in daylight, then cycle to night
    let night = 1 - dn; // 0=day, 1=night
    Z.uHorizon.value.copy(this.dayHorizon).lerp(this.stormFog, s2 * 0.9).lerp(new B(2880), night * 0.6), Z.uZenith.value.copy(this.dayZenith).lerp(new B(1536), night * 0.7), this.fog.color.copy(this.dayFog).lerp(this.stormFog, s2 * 0.9).lerp(new B(2048), night * 0.5), this.fog.density = QE + s2 * 52e-4 + night * 30e-4, this.sun.intensity = KE * (1 - s2 * 0.62) * (0.25 + 0.75 * dn), this.sun.color.setHex(GE).lerp(this.stormSun, s2 * 0.7).lerp(new B(16750848), night * 0.5), Z.uSunCol.value.copy(this.sun.color), this.hemi.intensity = YE * (1 - s2 * 0.25) * (0.4 + 0.6 * dn), this.hemi.color.setHex(qE).lerp(this.stormSky, s2 * 0.8).lerp(new B(4096), night * 0.5), this.amb.color.setHex(XE).lerp(this.stormSky, s2 * 0.6), Z.uDay.value = (1 - s2 * 0.5) * (0.3 + 0.7 * dn);
    // A warm golden-hour band as daylight fades or returns, muted by storms.
    const goldenHour = 4 * dn * (1-dn) * (1-s2);
    Z.uHorizon.value.lerp(this.duskHorizon, goldenHour*.45);
    this.fog.color.lerp(this.duskFog, goldenHour*.24);
    this.sun.color.lerp(this.duskSun, goldenHour*.42);
    Z.uSunCol.value.copy(this.sun.color);
    // Low-lying, site-local atmospheric haze without another render pass.
    const cavern=Jv(`covert`), lake=Yv;
    const local=Math.max(0,1-Math.hypot(n2.x-cavern.x,n2.z-cavern.z)/95)*.65 + Math.max(0,1-Math.hypot(n2.x-lake.x,n2.z-lake.z)/70)*.35;
    const nearGround=1-Math.min(1,Math.max(0,n2.y-ay(n2.x,n2.z))/35);
    this.fog.density+=local*nearGround*.0008;
    this.fog.color.lerp(this.valleyFog,local*nearGround*.12*(1-s2));
    // Aurora borealis at night (green/purple glow in sky)
    if (night > 0.7) {
      Z.uHorizon.value.lerp(new B(0x1a4a3a), night * 0.3);
      Z.uZenith.value.lerp(new B(0x2a1a4a), night * 0.4);
    }
  }
};
function Q(e4, t2, n2, r) {
  let i = document.createElement(e4);
  return t2 && (i.className = t2), r !== void 0 && (i.textContent = r), n2 && n2.appendChild(i), i;
}
function eD(e4, t2, n2) {
  let r = document.createElement(`i`);
  return r.className = t2 ? `ic ` + t2 : `ic`, r.innerHTML = e4, n2 && n2.appendChild(r), r;
}
var tD = (e4, t2, n2) => e4 < t2 ? t2 : e4 > n2 ? n2 : e4, nD = /* @__PURE__ */ new WeakMap();
function rD(e4, t2, n2) {
  nD.get(e4)?.cancel(), nD.set(e4, e4.animate(t2, n2));
}
var iD = [{ transform: `scale(1.3)` }, { transform: `scale(1)` }], aD = [{ transform: `scale(1.3)`, color: `#ff6b5a` }, { transform: `scale(1)` }], oD = { duration: 240, easing: `cubic-bezier(.2,1.4,.4,1)` };
function sD(e4, t2 = false) {
  rD(e4, t2 ? aD : iD, oD);
}
var cD = (e4, t2 = `0 0 24 24`) => `<svg viewBox="${t2}" aria-hidden="true" focusable="false">${e4}</svg>`, lD = `fill="currentColor" fill-opacity=".24" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"`, uD = `fill="none" stroke="currentColor" stroke-width="1" opacity=".7"`, dD = { wood: cD(`<rect x="2" y="4" width="20" height="4.6" rx="1" fill="#dba463"/><rect x="2" y="9.7" width="20" height="4.6" rx="1" fill="#c48a4a"/><rect x="2" y="15.4" width="20" height="4.6" rx="1" fill="#a5703b"/><path d="M6 6.3h7M11 12h8M5 17.7h9" stroke="#74491f" stroke-width="1" stroke-linecap="round" fill="none"/>`), stone: cD(`<rect x="2" y="4" width="20" height="16" rx="1.5" fill="#bdb7ae"/><path d="M2 9.3h20M2 14.7h20M9 4v5.3M16 9.3v5.4M7 14.7V20M14 14.7V20" stroke="#6c6760" stroke-width="1.3" fill="none"/>`), metal: cD(`<rect x="2" y="4" width="20" height="16" rx="1.5" fill="#9fb4c6"/><path d="M4 5.6h16" stroke="#dbe7f1" stroke-width="1"/><path d="M2 12h20" stroke="#5a6e82" stroke-width="1.3"/><g fill="#5a6e82"><circle cx="5.6" cy="8.3" r="1.1"/><circle cx="18.4" cy="8.3" r="1.1"/><circle cx="5.6" cy="16" r="1.1"/><circle cx="18.4" cy="16" r="1.1"/></g>`), storm: cD(`<path d="M13.6 1.5 4.6 13.6h6.2L9.4 22.5l10-13h-6.2z" fill="currentColor"/>`), person: cD(`<circle cx="12" cy="7" r="4.2" fill="currentColor"/><path d="M3.8 21.5c0-4.6 3.7-8 8.2-8s8.2 3.4 8.2 8z" fill="currentColor"/>`), crosshair: cD(`<circle cx="12" cy="12" r="6.4" fill="none" stroke="currentColor" stroke-width="2.3"/><path d="M12 1.6v5.6M12 16.8v5.6M1.6 12h5.6M16.8 12h5.6" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/>`), slash: cD(`<path d="M2.5 21.5C9.5 17 15.5 10.5 21.5 2.5c-2.2 9-8 15.2-16 18.4z" fill="currentColor"/><path d="M13 21.5c3.4-1.9 6-4.6 8.5-8.4-.8 4.3-3.3 7-6.5 8.6z" fill="currentColor" opacity=".8"/>`), shield: cD(`<path d="M12 2l8.2 3v6.2c0 5-3.4 8.9-8.2 10.8C7.2 20.1 3.8 16.2 3.8 11.2V5z" fill="currentColor"/>`), health: cD(`<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="currentColor"/>`), wall: cD(`<path d="M4 6.5l16-3v14l-16 3z" ${lD}/><path d="M4 13.5l16-3M12 5v14" ${uD}/>`), floor: cD(`<path d="M12 7l10 5-10 5-10-5z" ${lD}/><path d="M7 9.5l10 5M17 9.5l-10 5" ${uD}/>`), stairs: cD(`<path d="M3 20.5V16h4.5v-4.5H12V7h4.5V2.5H21v18z" ${lD}/>`), roof: cD(`<path d="M12 3.5 22 16l-10 4.5L2 16z" ${lD}/><path d="M12 3.5v17" ${uD}/>`), pad: cD(`<path d="M12 3l9 4-9 4-9-4z" ${lD}/><path d="M3 13l9 4 9-4M3 17l9 4 9-4" ${uD}/>`), close: cD(`<path d="M5 5l14 14M19 5 5 19" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" fill="none"/>`), figure: cD(`<circle cx="12" cy="5.4" r="3.6" fill="currentColor"/><path d="M6.2 10.4h11.6l1.7 7.2h-3l-.7-3V23h-3.1v-6h-1.4v6H8.2v-8.4l-.7 3h-3z" fill="currentColor"/>`), skull: cD(`<path d="M12 2.2c-5 0-8.6 3.4-8.6 8 0 2.7 1.2 4.6 3 5.8V19c0 .9.7 1.6 1.6 1.6h.9v-2.1h1.6v2.1h3v-2.1h1.6v2.1h.9c.9 0 1.6-.7 1.6-1.6v-3c1.8-1.2 3-3.1 3-5.8 0-4.6-3.6-8-8.6-8z" fill="currentColor"/><circle cx="8.4" cy="11" r="2.1" fill="#0a1a3f"/><circle cx="15.6" cy="11" r="2.1" fill="#0a1a3f"/><path d="M12 13.4l-1.3 2.3h2.6z" fill="#0a1a3f"/>`), bullet: cD(`<path d="M9 9.5c0-4.2 1.5-7 3-8 1.5 1 3 3.8 3 8V21H9z" fill="currentColor"/><path d="M8 18h8v4.5H8z" fill="currentColor" opacity=".7"/>`), target: cD(`<circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="12" cy="12" r="3.2" fill="currentColor"/>`), crown: cD(`<path d="M2.5 7.5l5 4.3L12 4l4.5 7.8 5-4.3-2 11.5h-15z" fill="currentColor"/><path d="M4.6 20.6h14.8v1.9H4.6z" fill="currentColor"/>`), pick: cD(`<path d="M3.2 8.6C7.7 3.3 14.5 2 20.6 4.6c-4.9-.2-9.4 1.3-12.6 4.6z" fill="currentColor"/><path d="M10.3 7.6l2.2-1.4L21.5 20l-2.3 1.5z" fill="currentColor"/>`), gun: cD(`<path d="M1.5 9h14.2l1.3-1.6h5.5v3.2h-3.2l-.6 1.6H11l-1.4 1.3.9 4.6H6.9l-.8-3.9H4.2l-.9-1.6H1.5z" fill="currentColor"/>`), burst: cD(`<path d="M12 1.5l2.2 5.4 5.6-2.2-2.2 5.6 5.4 2.2-5.4 2.2 2.2 5.6-5.6-2.2-2.2 5.4-2.2-5.4-5.6 2.2 2.2-5.6-5.4-2.2 5.4-2.2-2.2-5.6 5.6 2.2z" fill="currentColor"/>`), fall: cD(`<path d="M10 2.5h4v11.2h4.6L12 21.5l-6.6-7.8H10z" fill="currentColor"/>`), star: cD(`<path d="M12 1.8l3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.6l-6.3 3.6 1.5-7.1-5.4-4.9 7.2-.8z" fill="currentColor"/>`) }, fD = Math.PI * 2, pD = `"Luckiest Guy", Impact, "Arial Black", sans-serif`;
function mD(e4, t2) {
  let n2 = Math.min(t2, e4.size), r = (e4.size - n2) / 2;
  return { cx: Math.max(-r, Math.min(r, e4.px)), cz: Math.max(-r, Math.min(r, e4.pz)), span: n2 };
}
function hD(e4, t2) {
  let n2 = null, r = 1 / 0;
  for (let i of qv) {
    let a = Math.hypot(e4 - i.x, t2 - i.z) / (i.r * 1.12);
    a < 1 && a < r && (r = a, n2 = i.name);
  }
  return n2;
}
function gD(e4) {
  return !e4 || e4.dataset.labels === `off`;
}
function _D(e4, t2, n2, r, i, a) {
  e4.beginPath(), e4.moveTo(t2 + a, n2), e4.arcTo(t2 + r, n2, t2 + r, n2 + i, a), e4.arcTo(t2 + r, n2 + i, t2, n2 + i, a), e4.arcTo(t2, n2 + i, t2, n2, a), e4.arcTo(t2, n2, t2 + r, n2, a), e4.closePath();
}
function vD(e4) {
  let t2 = e4.split(` `);
  if (t2.length < 2) return [e4];
  let n2 = 1, r = 1 / 0;
  for (let e5 = 1; e5 < t2.length; e5++) {
    let i = t2.slice(0, e5).join(` `).length, a = t2.slice(e5).join(` `).length, o = Math.abs(i - a);
    o < r && (r = o, n2 = e5);
  }
  return [t2.slice(0, n2).join(` `), t2.slice(n2).join(` `)];
}
function yD(e4, t2, n2, r, i, a, o, s2) {
  let c = Math.max(8, Math.round(a * (o ? 6.2 : 5.4)));
  e4.font = `${c}px ${pD}`, e4.textAlign = `center`, e4.textBaseline = `middle`, e4.lineJoin = `round`, e4.miterLimit = 2;
  let l2 = t2 * (o ? 0.3 : 0.5), u = c * 1.02, d = a * 1.6;
  for (let a2 of qv) {
    let f = n2(a2.x), p = r(a2.z), m = a2.r * i, h = m * 0.4;
    if (f < -h || f > t2 + h || p < -h || p > t2 + h) continue;
    let g2 = [a2.name];
    e4.measureText(a2.name).width > l2 && (g2 = vD(a2.name));
    let _2 = 0;
    for (let t3 of g2) _2 = Math.max(_2, e4.measureText(t3).width);
    let v = g2.length * u, y = f, b = o ? p - m * 0.86 - v * 0.5 : p - Math.min(m * 0.55, m - v * 0.5);
    y = Math.max(_2 / 2 + d, Math.min(t2 - _2 / 2 - d, y)), b = Math.max(v / 2 + d, Math.min(t2 - v / 2 - d, b));
    let x = a2.name === s2;
    e4.lineWidth = Math.max(2.5, c * 0.3), e4.strokeStyle = `rgba(8, 18, 46, 0.92)`, e4.fillStyle = x ? `#ffe838` : `#ffffff`;
    for (let t3 = 0; t3 < g2.length; t3++) {
      let n3 = b - v / 2 + u * (t3 + 0.5) + c * 0.06;
      e4.strokeText(g2[t3], y, n3), e4.fillText(g2[t3], y, n3);
    }
  }
}
function bD(e4, t2, n2, r, i, a, o, s2 = null) {
  let c = t2 / i.span, l2 = i.cx - i.span / 2, u = i.cz - i.span / 2, d = (e5) => (e5 - l2) * c, f = (e5) => (e5 - u) * c;
  if (e4.setTransform(1, 0, 0, 1, 0, 0), e4.globalAlpha = 1, e4.shadowBlur = 0, e4.setLineDash([]), e4.lineCap = `butt`, e4.lineJoin = `round`, n2 && n2.width > 0 && n2.height > 0) {
    let a2 = n2.width / r.size, o2 = n2.height / r.size;
    e4.imageSmoothingEnabled = true, e4.imageSmoothingQuality = `high`, e4.drawImage(n2, (l2 + r.size / 2) * a2, (u + r.size / 2) * o2, i.span * a2, i.span * o2, 0, 0, t2, t2);
  } else {
    let n3 = e4.createLinearGradient(0, 0, t2, t2);
    n3.addColorStop(0, `#2c7396`), n3.addColorStop(1, `#1a3d6b`), e4.fillStyle = n3, e4.fillRect(0, 0, t2, t2);
  }
  if (o) {
    let n3 = t2 / 8;
    e4.beginPath();
    for (let r2 = 1; r2 < 8; r2++) {
      let i2 = Math.round(r2 * n3) + 0.5;
      e4.moveTo(i2, 0), e4.lineTo(i2, t2), e4.moveTo(0, i2), e4.lineTo(t2, i2);
    }
    e4.lineWidth = 1, e4.strokeStyle = `rgba(255,255,255,0.13)`, e4.stroke(), e4.font = `700 ${Math.round(a * 4.4)}px "Barlow Condensed", sans-serif`, e4.textAlign = `left`, e4.textBaseline = `top`, e4.fillStyle = `rgba(255,255,255,0.5)`;
    for (let t3 = 0; t3 < 8; t3++) for (let r2 = 0; r2 < 8; r2++) e4.fillText(String.fromCharCode(65 + t3) + (r2 + 1), t3 * n3 + a * 1.4, r2 * n3 + a * 1.2);
  }
  let p = r.storm, m = d(p.x), h = f(p.z), g2 = Math.max(0, p.r * c);
  e4.beginPath(), e4.rect(0, 0, t2, t2), e4.moveTo(m + g2, h), e4.arc(m, h, g2, 0, fD), e4.fillStyle = `rgba(122, 52, 236, 0.46)`, e4.fill(`evenodd`), e4.beginPath(), e4.arc(m, h, g2, 0, fD), e4.lineWidth = a * 2.6, e4.strokeStyle = `rgba(52, 10, 120, 0.55)`, e4.stroke(), e4.lineWidth = a * 1.3, e4.strokeStyle = `#e2c4ff`, e4.shadowColor = `#a35cff`, e4.shadowBlur = a * 3, e4.stroke(), e4.shadowBlur = 0;
  let _2 = r.next;
  if (_2) {
    let t3 = d(_2.x), n3 = f(_2.z), i2 = Math.max(0, _2.r * c);
    e4.beginPath(), e4.arc(t3, n3, i2, 0, fD), e4.fillStyle = `rgba(255,255,255,0.07)`, e4.fill(), e4.lineWidth = a * 2.4, e4.strokeStyle = `rgba(6, 16, 44, 0.45)`, e4.stroke(), e4.lineWidth = a * 1.15, e4.strokeStyle = `#ffffff`, e4.stroke();
    let o2 = r.px - _2.x, s3 = r.pz - _2.z, l3 = Math.hypot(o2, s3);
    l3 > _2.r + 1 && (e4.beginPath(), e4.moveTo(d(r.px), f(r.pz)), e4.lineTo(d(_2.x + o2 / l3 * _2.r), f(_2.z + s3 / l3 * _2.r)), e4.setLineDash([a * 2.2, a * 1.6]), e4.lineCap = `round`, e4.lineWidth = a * 1.6, e4.strokeStyle = `rgba(6, 16, 44, 0.4)`, e4.stroke(), e4.lineWidth = a * 0.8, e4.strokeStyle = `rgba(255,255,255,0.95)`, e4.stroke(), e4.setLineDash([]), e4.lineCap = `butt`);
  }
  gD(n2) && yD(e4, t2, d, f, c, a, o, s2);
  let v = r.bus;
  v && (e4.beginPath(), e4.moveTo(d(v.ax), f(v.az)), e4.lineTo(d(v.bx), f(v.bz)), e4.setLineDash([a * 2.6, a * 2]), e4.lineWidth = a * 0.9, e4.strokeStyle = `rgba(255,255,255,0.85)`, e4.stroke(), e4.setLineDash([]), e4.save(), e4.translate(d(v.x), f(v.z)), e4.rotate(Math.atan2(v.bz - v.az, v.bx - v.ax)), _D(e4, -a * 3.4, -a * 2, a * 6.8, a * 4, a), e4.fillStyle = `#1f8fff`, e4.fill(), e4.lineWidth = a * 0.8, e4.strokeStyle = `#ffffff`, e4.stroke(), e4.fillStyle = `#d6efff`, e4.fillRect(a * 1.2, -a * 1.2, a * 1.2, a * 2.4), e4.fillStyle = `#ffe838`, e4.fillRect(-a * 2.4, -a * 1.2, a * 2.6, a * 2.4), e4.restore());
  for (let t3 of r.pings) e4.beginPath(), e4.arc(d(t3.x), f(t3.z), a * 1.6, 0, fD), e4.fillStyle = t3.color, e4.fill(), e4.lineWidth = a * 0.6, e4.strokeStyle = `#ffffff`, e4.stroke();
  if (e4.save(), e4.translate(d(r.px), f(r.pz)), e4.rotate(Math.PI - r.yaw), o) e4.beginPath(), e4.arc(0, 0, a * 5.5, 0, fD), e4.fillStyle = `rgba(255, 232, 56, 0.28)`, e4.fill();
  else {
    let t3 = e4.createRadialGradient(0, 0, 0, 0, 0, a * 22);
    t3.addColorStop(0, `rgba(255,255,255,0.34)`), t3.addColorStop(1, `rgba(255,255,255,0)`), e4.beginPath(), e4.moveTo(0, 0), e4.arc(0, 0, a * 22, -Math.PI / 2 - 0.55, -Math.PI / 2 + 0.55), e4.closePath(), e4.fillStyle = t3, e4.fill();
  }
  let y = o ? 1.25 : 1;
  e4.beginPath(), e4.moveTo(0, -a * 3.8 * y), e4.lineTo(a * 2.8 * y, a * 2.9 * y), e4.lineTo(0, a * 1.4 * y), e4.lineTo(-a * 2.8 * y, a * 2.9 * y), e4.closePath(), e4.lineWidth = a * 1.3, e4.strokeStyle = `#0a1a3f`, e4.stroke(), e4.fillStyle = o ? `#ffe838` : `#ffffff`, e4.fill(), e4.restore();
}
var xD = 180 / Math.PI, SD = 260, CD = 0.46, wD = [`N`, `NE`, `E`, `SE`, `S`, `SW`, `W`, `NW`], TD = [`wood`, `stone`, `metal`], ED = { wood: `WOOD`, stone: `STONE`, metal: `METAL` }, DD = [{ id: `wall`, key: `Q` }, { id: `floor`, key: `C` }, { id: `stairs`, key: `F` }, { id: `roof`, key: `V` }, { id: `pad`, key: `T` }], OD = 6, kD = 5, AD = 28, jD = `<svg viewBox="-100 -100 200 200" aria-hidden="true"><defs><linearGradient id="sr-arc-g" x1="0" y1="-100" x2="0" y2="-60" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ff2a2a" stop-opacity=".95"/><stop offset="1" stop-color="#ff2a2a" stop-opacity="0"/></linearGradient></defs><path d="M-46 -82 A94 94 0 0 1 46 -82 L30 -62 A70 70 0 0 0 -30 -62 Z" fill="url(#sr-arc-g)"/><path d="M-44.5 -80 A92 92 0 0 1 44.5 -80" fill="none" stroke="#ff4a3a" stroke-width="5" stroke-linecap="round"/><path d="M-7 -95 L0 -103 L7 -95 Z" fill="#ff4a3a"/></svg>`, MD = (e4) => Number.isFinite(e4) ? String(Math.max(0, Math.floor(e4))) : `\u221E`, ND = (e4, t2 = 1) => Math.abs(e4 - Math.round(e4)) < 0.05 ? String(Math.round(e4)) : e4.toFixed(t2), PD = () => Math.min(24, Math.max(5.5, Math.min(window.innerHeight * 0.01, window.innerWidth * 5625e-6)));
function FD(e4) {
  let t2 = e4.toLowerCase();
  return t2 === `storm` ? dD.storm : t2 === `fall` ? dD.fall : t2.includes(`pickaxe`) ? dD.pick : t2.includes(`rocket`) || t2.includes(`grenade`) || t2.includes(`explo`) ? dD.burst : t2 === `cheats` ? dD.star : dD.gun;
}
function ID(e4) {
  let t2 = e4.toLowerCase();
  return t2 === `storm` ? `lost to the storm` : t2 === `fall` ? `took a nasty fall` : t2.includes(`rocket`) || t2.includes(`grenade`) ? `blew themselves up` : e4 || `was eliminated`;
}
function LD(e4, t2, n2) {
  let r = Q(`div`, `vrow ` + t2, e4);
  eD(n2, `vic`, r);
  let i = Q(`span`, `vnum`, r, `0`), a = Q(`div`, `bar`, r), o = Q(`i`, `bar-ghost`, a), s2 = Q(`i`, `bar-fill`, a);
  return Q(`i`, `bar-seg`, a), Q(`span`, `vmax`, r, `100`), { row: r, num: i, fill: s2, ghost: o, key: -1, shown: -1 };
}
function RD(e4, t2) {
  let n2 = tD(t2, 0, 100), r = Math.round(n2 * 4);
  if (r !== e4.key) {
    e4.key = r;
    let t3 = `scaleX(${r / 400})`;
    e4.fill.style.transform = t3, e4.ghost.style.transform = t3;
  }
  let i = Math.ceil(n2 - 1e-4);
  if (i !== e4.shown) {
    let t3 = e4.shown < 0, n3 = i < e4.shown;
    e4.shown = i, e4.num.textContent = String(i), e4.row.classList.toggle(`zero`, i === 0), e4.row.classList.toggle(`full`, i >= 100), t3 || sD(e4.num, n3);
  }
}
function zD(e4, t2, n2 = ``) {
  let r = Q(`div`, `slot empty` + n2, e4);
  Q(`div`, `slot-bg`, r);
  let i = Q(`img`, `slot-img`, r);
  i.alt = ``, i.draggable = false, i.decoding = `async`, Q(`span`, `slot-key`, r, t2);
  let a = Q(`span`, `slot-count`, r);
  return Q(`i`, `slot-caret`, r), { root: r, img: i, count: a, icon: ``, rarity: -1, countText: ``, empty: true };
}
function BD(e4, t2) {
  t2 ? e4.src = t2 : e4.removeAttribute(`src`);
}
function VD(e4) {
  let t2 = e4.clientWidth;
  if (!t2) return 0;
  let n2 = Math.round(t2 * Math.min(window.devicePixelRatio || 1, 2));
  return (e4.width !== n2 || e4.height !== n2) && (e4.width = n2, e4.height = n2), n2;
}
var HD = class {
  root;
  visible = true;
  stormEl;
  stormKey = 0;
  hurtEl;
  scopeEl;
  scoped = false;
  fpsEl;
  fpsOn = false;
  fpsVal = -1;
  specEl;
  spec = null;
  compStrip;
  compNumEl;
  compKey = -1;
  compNum = -1;
  miniCv;
  miniCtx;
  miniPx = 0;
  locEl;
  loc = ``;
  distEl;
  distText;
  dist = -1;
  timerEl;
  timerText;
  timerLabelEl;
  timerShown = ``;
  timerLabel = ``;
  timerUrgent = false;
  aliveEl;
  killsEl;
  alive = -1;
  kills = -1;
  hp;
  sh;
  lowHp = false;
  brEl;
  mats;
  ammoEl;
  ammoMag;
  ammoRes;
  mag = null;
  reserve = null;
  magPeak = 0;
  pieceEls;
  bMatIcon;
  bMatName;
  bMatCount;
  bMatEl;
  building = false;
  bPiece = null;
  bMat = null;
  bCount = -1;
  nameEl;
  shownName = ``;
  pick;
  slots = [];
  active = -2;
  pickIcon = ``;
  centerEl;
  xhair;
  xKind = `none`;
  xGap = -1;
  hitEl;
  hitRing;
  hitKind = `body`;
  arcs = [];
  arcI = 0;
  promptEl;
  promptKey;
  promptText;
  promptBar;
  promptFill;
  pOn = false;
  pKey = ``;
  pText = ``;
  pProg = -1;
  cardEl;
  cardImg;
  cardName;
  cardRar;
  cardCount;
  cardStats;
  cardKey;
  cardVerb;
  cardOn = false;
  cardSig = ``;
  useEl;
  useLabelEl;
  useFill;
  useOn = false;
  useLabel = ``;
  useKey = -1;
  elimEl;
  elimName;
  elimCount;
  elimUnit;
  feedEl;
  toastEl;
  banEl;
  banTitle;
  banSub;
  banIcon;
  banText;
  banTimer = 0;
  busEl;
  busTitle;
  busAct;
  busInfoEl;
  busMode = `hidden`;
  busInfo = ``;
  floats = [];
  floatI = 0;
  fullEl;
  fullCv;
  fullCtx;
  fullLoc;
  fullPx = 0;
  fullOpen = false;
  base = null;
  view = null;
  constructor(e4) {
    let t2 = this.root = Q(`div`, `sr-hud`, e4);
    this.stormEl = Q(`div`, `ov-storm`, t2), Q(`i`, ``, this.stormEl), this.hurtEl = Q(`div`, `ov-hurt`, t2);
    let n2 = this.scopeEl = Q(`div`, `ov-scope`, t2);
    Q(`div`, `scope-lens`, n2), Q(`div`, `scope-mask`, n2), Q(`div`, `scope-post l`, n2), Q(`div`, `scope-post r`, n2), Q(`div`, `scope-post b`, n2), Q(`div`, `scope-h`, n2), Q(`div`, `scope-v`, n2), Q(`div`, `scope-dots`, n2), Q(`div`, `scope-dots v`, n2);
    let r = Q(`div`, `floats`, t2);
    for (let e5 = 0; e5 < AD; e5++) {
      let e6 = Q(`div`, `ft`, r);
      this.floats.push({ root: e6, inner: Q(`span`, `ft-in`, e6) });
    }
    let i = this.centerEl = Q(`div`, `hud-center`, t2), a = Q(`div`, `dmg-ring`, i);
    for (let e5 = 0; e5 < 4; e5++) {
      let e6 = Q(`div`, `dmg-arc`, a);
      e6.innerHTML = jD, this.arcs.push(e6);
    }
    this.xhair = Q(`div`, `xhair k-none`, i);
    for (let e5 of [`xh-t`, `xh-b`, `xh-l`, `xh-r`, `xh-dot`, `xh-ring`, `xh-dia`]) Q(`i`, e5, this.xhair);
    this.hitEl = Q(`div`, `hitm hm-body`, i);
    for (let e5 = 0; e5 < 4; e5++) Q(`i`, `hm-t`, this.hitEl);
    Q(`i`, `hm-dia`, this.hitEl), this.hitRing = Q(`b`, `hm-ring`, i);
    let o = Q(`div`, `anchor a-prompt`, i);
    this.promptEl = Q(`div`, `prompt`, o);
    let s2 = Q(`div`, `prompt-row pl`, this.promptEl);
    this.promptKey = Q(`kbd`, `keycap`, s2), this.promptText = Q(`span`, `prompt-text`, s2), this.promptBar = Q(`div`, `pbar`, this.promptEl), this.promptFill = Q(`i`, ``, this.promptBar);
    let c = this.cardEl = Q(`div`, `lootcard r0`, i), l2 = Q(`div`, `lc-head`, c), u = Q(`div`, `lc-art`, l2);
    this.cardImg = Q(`img`, `lc-img`, u), this.cardImg.alt = ``, this.cardImg.draggable = false, this.cardCount = Q(`span`, `lc-count`, u);
    let d = Q(`div`, `lc-txt`, l2);
    this.cardRar = Q(`span`, `lc-rar`, d), this.cardName = Q(`b`, `lc-name`, d), this.cardStats = Q(`div`, `lc-stats`, c);
    let f = Q(`div`, `lc-foot`, c);
    this.cardKey = Q(`kbd`, `keycap`, f), this.cardVerb = Q(`span`, `lc-verb`, f);
    let p = Q(`div`, `anchor a-use`, i);
    this.useEl = Q(`div`, `usebar`, p), this.useLabelEl = Q(`div`, `use-label`, this.useEl), this.useFill = Q(`i`, ``, Q(`div`, `use-track`, this.useEl));
    let m = Q(`div`, `anchor a-elim`, i);
    this.elimEl = Q(`div`, `elim`, m);
    let h = Q(`div`, `elim-row`, this.elimEl);
    eD(dD.skull, `elim-ic`, h), Q(`span`, `elim-l`, h, `ELIMINATED`), this.elimName = Q(`b`, `elim-name`, h);
    let g2 = Q(`div`, `elim-count`, this.elimEl);
    this.elimCount = Q(`b`, ``, g2, `0`), this.elimUnit = Q(`span`, ``, g2, `ELIMINATIONS`);
    let _2 = Q(`div`, `hud-tl`, t2);
    this.fpsEl = Q(`div`, `fps`, _2), this.specEl = Q(`div`, `spectate pl`, _2);
    let v = Q(`div`, `compass`, t2), y = Q(`div`, `compass-win`, v), b = this.compStrip = Q(`div`, `compass-strip`, y);
    for (let e5 = -90; e5 <= 450; e5 += 5) {
      let t3 = (e5 % 360 + 360) % 360, n3 = t3 % 45 == 0, r2 = t3 % 15 == 0, i2 = Q(`div`, `ct` + (n3 ? ` cardinal` : r2 ? ` mid` : ``) + (t3 === 0 ? ` north` : ``), b);
      i2.style.left = `calc(var(--u) * ${(e5 * CD).toFixed(2)})`, n3 ? Q(`span`, ``, i2, wD[t3 / 45]) : r2 && Q(`span`, ``, i2, String(t3));
    }
    Q(`div`, `compass-caret`, v), this.compNumEl = Q(`div`, `compass-num`, v, `0`);
    let x = Q(`div`, `hud-mini`, t2), S = Q(`div`, `mini-frame`, x);
    this.miniCv = Q(`canvas`, ``, S), this.miniCtx = this.miniCv.getContext(`2d`), Q(`span`, `mini-n`, S, `N`), this.distEl = Q(`div`, `mini-dist`, S), eD(dD.target, ``, this.distEl), this.distText = Q(`b`, ``, this.distEl), this.locEl = Q(`div`, `mini-loc`, S);
    let C = Q(`div`, `mini-stats`, x);
    this.timerEl = Q(`div`, `stat pl storm`, C), eD(dD.storm, ``, this.timerEl), this.timerText = Q(`b`, ``, this.timerEl, `0:00`);
    let w = Q(`div`, `stat pl`, C);
    eD(dD.person, ``, w), this.aliveEl = Q(`b`, ``, w, `0`);
    let T2 = Q(`div`, `stat pl kills`, C);
    eD(dD.skull, ``, T2), this.killsEl = Q(`b`, ``, T2, `0`), this.timerLabelEl = Q(`div`, `mini-label`, x);
    this.teamEl = Q(`div`, `team-hud`, t2);
    let E = Q(`div`, `hud-vitals`, t2);
    this.sh = LD(E, `sh`, dD.shield), this.hp = LD(E, `hp`, dD.health);
    let D = this.brEl = Q(`div`, `hud-br`, t2), O = Q(`div`, `mats`, D), k = {};
    for (let e5 of TD) {
      let t3 = Q(`div`, `mat pl`, O);
      eD(dD[e5], ``, t3), k[e5] = { root: t3, num: Q(`b`, ``, t3, `0`), val: -1 };
    }
    this.mats = k, this.ammoEl = Q(`div`, `ammo`, D), this.ammoMag = Q(`b`, `ammo-mag`, this.ammoEl), Q(`i`, `ammo-sep`, this.ammoEl);
    let A = Q(`span`, `ammo-resw`, this.ammoEl);
    eD(dD.bullet, `ammo-ic`, A), this.ammoRes = Q(`span`, `ammo-res`, A);
    let ee = Q(`div`, `buildbar`, D), te = this.bMatEl = Q(`div`, `buildmat pl`, ee);
    this.bMatIcon = Q(`i`, `ic`, te), this.bMatCount = Q(`b`, ``, te, `0`), this.bMatName = Q(`span`, ``, te);
    let ne = {};
    for (let e5 of DD) {
      let t3 = Q(`div`, `piece`, ee);
      eD(dD[e5.id], ``, t3), Q(`kbd`, `piece-key`, t3, e5.key), ne[e5.id] = t3;
    }
    this.pieceEls = ne, this.nameEl = Q(`div`, `hotbar-name`, D);
    let j = Q(`div`, `hotbar`, D);
    this.pick = zD(j, `1`, ` pick`);
    for (let e5 = 0; e5 < 5; e5++) this.slots.push(zD(j, String(e5 + 2)));
    let re = Q(`div`, `hotbar-inv`, D);
    Q(`kbd`, `keycap sm`, re, `I`), Q(`span`, ``, re, `INVENTORY`), this.feedEl = Q(`div`, `feed`, t2), this.toastEl = Q(`div`, `toasts`, t2);
    // In-game chat (Fortnite-style team chat)
    let chatW = this.chatWrap = Q(`div`, `chat-wrap`, t2);
    this.chatLog = Q(`div`, `chat-log`, chatW);
    let chatIn = this.chatInput = Q(`input`, `chat-in`, chatW);
    chatIn.placeholder = `Press ENTER to chat...`, chatIn.maxLength = 60, chatIn.style.display = `none`;
    // Emote wheel (hold B, move mouse to pick, release to play)
    let ew = this.emoteEl = Q(`div`, `emote-wheel`, t2);
    this.emoteSegs = [];
    let emNames = [`DANCE`, `WAVE`, `POINT`, `JUMP`, `SPIN`, `BOW`, `CHEER`, `SALUTE`];
    for (let e5 = 0; e5 < 8; e5++) {
      let seg = Q(`div`, `em-seg`, ew, emNames[e5]);
      seg.style.transform = `rotate(${e5 * 45}deg) translateY(calc(var(--u) * -16)) rotate(${-e5 * 45}deg)`;
      this.emoteSegs.push(seg);
    }
    // Touch controls (mobile)
    `ontouchstart` in window && this.setupTouch(t2);
    let M = Q(`div`, `anchor bus-a`, t2);
    this.busEl = Q(`div`, `busui m-hidden`, M), this.busTitle = Q(`div`, `bus-title dsp ol`, this.busEl);
    let ie = Q(`div`, `bus-row`, this.busEl);
    Q(`kbd`, `keycap lg`, ie, `SPACE`), this.busAct = Q(`span`, `bus-act`, ie), this.busInfoEl = Q(`div`, `bus-info pl`, this.busEl);
    let ae = Q(`div`, `anchor banner-a`, t2);
    this.banEl = Q(`div`, `banner t-info`, ae), this.banTitle = Q(`div`, `banner-title dsp ol`, this.banEl), this.banSub = Q(`div`, `banner-sub`, this.banEl), this.banIcon = Q(`i`, `ic banner-ic`, this.banSub), this.banText = Q(`span`, `banner-text`, this.banSub);
    let oe = Q(`div`, `fm-panel`, this.fullEl = Q(`div`, `fullmap`, t2)), se = Q(`div`, `fm-head`, oe), ce = Q(`div`, `fm-titles`, se);
    Q(`div`, `fm-title dsp ol`, ce, `ISLAND MAP`), this.fullLoc = Q(`div`, `fm-loc`, ce);
    let le = Q(`div`, `fm-hint`, se);
    Q(`kbd`, `keycap sm`, le, `TAB`), Q(`kbd`, `keycap sm`, le, `M`), Q(`span`, ``, le, `CLOSE`), this.fullCv = Q(`canvas`, ``, Q(`div`, `fm-frame`, oe)), this.fullCtx = this.fullCv.getContext(`2d`);
    let ue = Q(`div`, `fm-legend`, oe);
    for (let [e5, t3] of [[`you`, `You`], [`safe`, `Next safe zone`], [`storm`, `Storm`], [`bus`, `Battle Bus`]]) {
      let n3 = Q(`span`, ``, ue);
      Q(`i`, `lgd ` + e5, n3), Q(`b`, ``, n3, t3);
    }
    this.syncFps(), Sf.onChange((e5) => {
      e5 === `showFps` && this.syncFps();
    }), window.addEventListener(`resize`, () => {
      this.miniPx = 0, this.fullPx = 0;
    });
  }
  setVisible(e4) {
    e4 !== this.visible && (this.visible = e4, this.root.style.display = e4 ? `` : `none`, e4 && (this.miniPx = 0, this.fullPx = 0));
  }
  setVitals(e4, t2) {
    RD(this.hp, e4), RD(this.sh, t2);
    let n2 = this.hp.shown > 0 && this.hp.shown <= 25;
    n2 !== this.lowHp && (this.lowHp = n2, this.hp.row.classList.toggle(`low`, n2));
  }
  setTeam(e4) {
    if (!this.teamEl) return;
    let t2 = e4.length;
    if (this.teamEl.childElementCount !== t2) {
      this.teamEl.innerHTML = ``;
      for (let n2 = 0; n2 < t2; n2++) {
        let r = Q(`div`, `team-row pl`, this.teamEl);
        Q(`span`, `team-name`, r, ``); Q(`small`, `team-task`, r, ``);
        let i = Q(`div`, `team-bars`, r);
        Q(`div`, `team-sh`, i), Q(`div`, `team-hp`, i);
      }
    }
    for (let n2 = 0; n2 < t2; n2++) {
      let r = this.teamEl.children[n2], i = e4[n2];
      r.classList.toggle(`dead`, !i.alive);
      r.querySelector(`.team-name`).textContent = i.name; r.querySelector(`.team-task`).textContent = i.task || ``;
      r.querySelector(`.team-sh`).style.width = (i.shield || 0) + `%`;
      r.querySelector(`.team-hp`).style.width = (i.hp || 0) + `%`;
    }
  }
  setMats(e4, t2, n2) {
    this.setMat(`wood`, e4), this.setMat(`stone`, t2), this.setMat(`metal`, n2);
  }
  setMat(e4, t2) {
    let n2 = this.mats[e4];
    if (t2 === n2.val) return;
    let r = n2.val >= 0 && t2 > n2.val;
    n2.val = t2, n2.num.textContent = MD(t2), r && sD(n2.num);
  }
  setHotbar(e4, t2, n2) {
    n2 !== this.pickIcon && (this.pickIcon = n2, BD(this.pick.img, n2), this.pick.root.classList.toggle(`empty`, !n2));
    for (let t3 = 0; t3 < 5; t3++) {
      let n3 = e4[t3] ?? null, r2 = this.slots[t3];
      if (!n3) {
        r2.empty || (r2.empty = true, r2.root.classList.add(`empty`), r2.rarity >= 0 && r2.root.classList.remove(`r` + r2.rarity), r2.rarity = -1, r2.icon = ``, r2.countText = ``, r2.img.removeAttribute(`src`), r2.count.textContent = ``);
        continue;
      }
      r2.empty && (r2.empty = false, r2.root.classList.remove(`empty`)), n3.icon !== r2.icon && (r2.icon = n3.icon, BD(r2.img, n3.icon)), n3.rarity !== r2.rarity && (r2.rarity >= 0 && r2.root.classList.remove(`r` + r2.rarity), r2.rarity = n3.rarity, r2.root.classList.add(`r` + n3.rarity));
      let i2 = n3.count === null ? `` : MD(n3.count);
      i2 !== r2.countText && (r2.countText = i2, r2.count.textContent = i2);
    }
    let r = t2 >= 0 && t2 < 5 ? t2 : -1, i = r < 0 ? null : e4[r] ?? null, a = r < 0 ? `Pickaxe` : i ? i.name : ``, o = r !== this.active;
    if (o) {
      this.slotAt(this.active)?.root.classList.remove(`active`), this.active = r;
      let e5 = this.slotAt(r);
      e5 && (e5.root.classList.add(`active`), rD(e5.root, [{ translate: `0 calc(var(--u) * .5)` }, { translate: `0 0` }], { duration: 180, easing: `cubic-bezier(.2,1.6,.4,1)` })), this.magPeak = 0;
    }
    (o || a !== this.shownName) && (this.shownName = a, a && (this.nameEl.replaceChildren(), i && Q(`span`, `hn-rar`, this.nameEl, (Ph[i.rarity] ?? ``).toUpperCase()), Q(`span`, `hn-name`, this.nameEl, a), this.nameEl.className = `hotbar-name` + (i ? ` r` + i.rarity : ``), rD(this.nameEl, [{ opacity: 0, transform: `translateY(40%)` }, { opacity: 1, transform: `translateY(0)`, offset: 0.07 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }], { duration: 2400 })));
  }
  slotAt(e4) {
    return e4 === -1 ? this.pick : e4 >= 0 && e4 < this.slots.length ? this.slots[e4] : null;
  }
  setAmmo(e4, t2) {
    if (e4 === this.mag && t2 === this.reserve) return;
    let n2 = e4 !== null && this.mag !== null && e4 < this.mag;
    this.mag = e4, this.reserve = t2, e4 !== null && e4 > this.magPeak && (this.magPeak = e4);
    let r = this.ammoEl.classList;
    r.toggle(`on`, e4 !== null || t2 !== null), r.toggle(`solo`, e4 === null || t2 === null), r.toggle(`dry`, e4 === 0), r.toggle(`low`, e4 !== null && e4 > 0 && this.magPeak >= 4 && e4 <= this.magPeak * 0.25), this.ammoMag.textContent = e4 === null ? `` : MD(e4), this.ammoRes.textContent = t2 === null ? `` : MD(t2), n2 && rD(this.ammoMag, [{ transform: `scale(1.14)` }, { transform: `scale(1)` }], { duration: 120, easing: `ease-out` });
  }
  setBuild(e4, t2, n2, r) {
    let i = r[n2];
    (e4 !== this.building || t2 !== this.bPiece || n2 !== this.bMat || i !== this.bCount) && (e4 !== this.building && (this.building = e4, this.brEl.classList.toggle(`building`, e4)), t2 !== this.bPiece && (this.bPiece && this.pieceEls[this.bPiece].classList.remove(`on`), this.bPiece = t2, this.pieceEls[t2].classList.add(`on`)), n2 !== this.bMat && (this.bMat && this.mats[this.bMat].root.classList.remove(`sel`), this.bMat = n2, this.mats[n2].root.classList.add(`sel`), this.bMatIcon.innerHTML = dD[n2], this.bMatName.textContent = ED[n2]), i !== this.bCount && (this.bCount = i, this.bMatCount.textContent = MD(i), this.bMatEl.classList.toggle(`out`, i < 10)));
  }
  setMatch(e4, t2) {
    if (e4 !== this.alive) {
      let t3 = this.alive < 0;
      this.alive = e4, this.aliveEl.textContent = MD(e4), t3 || sD(this.aliveEl);
    }
    if (t2 !== this.kills) {
      let e5 = this.kills < 0;
      this.kills = t2, this.killsEl.textContent = MD(t2), e5 || sD(this.killsEl);
    }
  }
  setStormTimer(e4, t2, n2) {
    let r = `--:--`;
    if (Number.isFinite(t2)) {
      let e5 = Math.max(0, Math.ceil(t2)), n3 = e5 % 60;
      r = Math.floor(e5 / 60) + `:` + (n3 < 10 ? `0` : ``) + n3;
    }
    r !== this.timerShown && (this.timerShown = r, this.timerText.textContent = r), e4 !== this.timerLabel && (this.timerLabel = e4, this.timerLabelEl.textContent = e4), n2 !== this.timerUrgent && (this.timerUrgent = n2, this.timerEl.classList.toggle(`urgent`, n2), this.timerLabelEl.classList.toggle(`urgent`, n2));
  }
  setCompass(e4) {
    let t2 = (180 - e4 * xD) % 360;
    t2 < 0 && (t2 += 360);
    let n2 = Math.round(t2 * 20);
    if (n2 === this.compKey) return;
    this.compKey = n2, this.compStrip.style.transform = `translate3d(calc(var(--u) * ${(-t2 * CD).toFixed(3)}),0,0)`;
    let r = Math.round(t2) % 360;
    r !== this.compNum && (this.compNum = r, this.compNumEl.textContent = String(r));
  }
  setFps(e4) {
    if (!this.fpsOn) return;
    let t2 = Math.round(e4);
    t2 !== this.fpsVal && (this.fpsVal = t2, this.fpsEl.textContent = t2 + ` FPS`);
  }
  syncFps() {
    let e4 = Sf.s.showFps;
    e4 !== this.fpsOn && (this.fpsOn = e4, this.fpsEl.classList.toggle(`on`, e4));
  }
  setSpectate(e4) {
    e4 !== this.spec && (this.spec = e4, this.specEl.classList.toggle(`on`, e4 !== null), e4 !== null && (this.specEl.textContent = e4));
  }
  setCrosshair(e4, t2) {
    e4 !== this.xKind && (this.xKind = e4, this.xhair.className = `xhair k-` + e4);
    let n2 = Math.round(tD(t2, 0, 400) * 2);
    n2 !== this.xGap && (this.xGap = n2, this.xhair.style.setProperty(`--gap`, n2 / 2 + `px`));
  }
  hitMarker(e4) {
    e4 !== this.hitKind && (this.hitKind = e4, this.hitEl.className = `hitm hm-` + e4, this.hitRing.className = `hm-ring hm-` + e4);
    let t2 = e4 === `kill`, n2 = e4 === `head`;
    rD(this.hitEl, [{ opacity: 1, transform: `scale(${t2 ? 2.4 : n2 ? 2 : 1.65})` }, { opacity: 1, transform: `scale(${t2 ? 1.3 : n2 ? 1.1 : 1})`, offset: 0.35 }, { opacity: 0, transform: `scale(${t2 ? 1.2 : n2 ? 1.05 : 0.9})` }], { duration: t2 ? 620 : n2 ? 380 : 240, easing: `cubic-bezier(.2,.9,.3,1)` }), (t2 || n2) && rD(this.hitRing, [{ opacity: 0.95, transform: `translate(-50%,-50%) scale(.35)` }, { opacity: 0, transform: `translate(-50%,-50%) scale(${t2 ? 2.1 : 1.5})` }], { duration: t2 ? 560 : 360, easing: `cubic-bezier(.1,.7,.3,1)` });
  }
  damageFrom(e4) {
    let t2 = this.arcs[this.arcI];
    this.arcI = (this.arcI + 1) % this.arcs.length, t2.style.transform = `rotate(${(-e4 * xD).toFixed(1)}deg)`, rD(t2, [{ opacity: 1, scale: `1.08` }, { opacity: 1, scale: `1`, offset: 0.25 }, { opacity: 0, scale: `1` }], { duration: 1100, easing: `ease-in` });
  }
  hurtFlash(e4) {
    let t2 = tD(0.3 + e4 * 0.7, 0, 1);
    rD(this.hurtEl, [{ opacity: t2 }, { opacity: 0 }], { duration: 420 + 480 * t2, easing: `ease-out` });
  }
  setStormOverlay(e4) {
    let t2 = Math.round(tD(e4, 0, 1) * 50);
    if (t2 === this.stormKey) return;
    let n2 = this.stormKey > 0;
    this.stormKey = t2, t2 > 0 !== n2 && this.stormEl.classList.toggle(`on`, t2 > 0), this.stormEl.style.opacity = String(t2 / 50);
  }
  setScope(e4) {
    e4 !== this.scoped && (this.scoped = e4, this.scopeEl.classList.toggle(`on`, e4), this.centerEl.classList.toggle(`scoped`, e4));
  }
  setPrompt(e4, t2, n2) {
    if (this.hideCard(), e4 === null) {
      this.pOn && (this.pOn = false, this.promptEl.classList.remove(`on`));
      return;
    }
    this.pOn || (this.pOn = true, this.promptEl.classList.add(`on`)), e4 !== this.pKey && (this.pKey = e4, this.promptKey.textContent = e4);
    let r = t2 ?? ``;
    r !== this.pText && (this.pText = r, this.promptText.textContent = r);
    let i = n2 === void 0 ? -1 : Math.round(tD(n2, 0, 1) * 200);
    i !== this.pProg && (i >= 0 != this.pProg >= 0 && this.promptBar.classList.toggle(`on`, i >= 0), this.pProg = i, i >= 0 && (this.promptFill.style.transform = `scaleX(${i / 200})`));
  }
  setPromptItem(e4, t2 = `Pick up`, n2 = null) {
    if (e4 === null || !n2) {
      e4 === null ? this.setPrompt(null) : this.setPrompt(e4, t2);
      return;
    }
    this.pOn && (this.pOn = false, this.promptEl.classList.remove(`on`));
    let r = `${e4}|${t2}|${n2.kind}|${n2.id}|${n2.rarity}|${n2.count}|${n2.icon ?? ``}`;
    if (r !== this.cardSig) {
      let i = !this.cardOn || this.cardSig.split(`|`).slice(2, 5).join(`|`) !== `${n2.kind}|${n2.id}|${n2.rarity}`;
      this.cardSig = r, this.fillCard(e4, t2, n2), i && rD(this.cardEl, [{ opacity: 0, transform: `translateX(-14%) scale(.92)` }, { opacity: 1, transform: `none` }], { duration: 180, easing: `cubic-bezier(.2,1.3,.4,1)` });
    }
    this.cardOn || (this.cardOn = true, this.cardEl.classList.add(`on`));
  }
  hideCard() {
    this.cardOn && (this.cardOn = false, this.cardSig = ``, this.cardEl.classList.remove(`on`));
  }
  fillCard(e4, t2, n2) {
    let r = tD(Math.round(n2.rarity), 0, 4), i = n2.id, a = [], o = ``;
    if (n2.kind === `weapon` && Uh(n2.id)) {
      let e5 = Ih[n2.id];
      i = e5.name;
      let t3 = e5.damage * (1 + r * 0.05) * e5.pellets;
      e5.thrown ? (a.push([`DMG`, ND(t3, 0)], [`RADIUS`, ND(e5.falloffEnd) + `m`]), o = `x` + MD(n2.count)) : a.push([`DMG`, ND(t3, 0)], [`RATE`, ND(e5.burst ? e5.fireRate * e5.burst : e5.fireRate)], [`MAG`, String(e5.mag)], [`RELOAD`, ND(e5.reload * (1 - r * 0.04)) + `s`]);
    } else if (n2.kind === `consumable` && Wh(n2.id)) {
      let e5 = Lh[n2.id];
      i = e5.name, e5.heal && a.push([`HEALTH`, `+` + e5.heal]), e5.shield && a.push([`SHIELD`, `+` + e5.shield]), a.push([`MAX`, String(e5.cap)], [`USE`, ND(e5.useTime) + `s`]), o = `x` + MD(n2.count);
    } else n2.kind === `ammo` ? (i = Rh[n2.id] ?? n2.id, o = `x` + MD(n2.count)) : n2.kind === `mats` && (i = Vh[n2.id] ?? n2.id, o = `x` + MD(n2.count));
    let s2 = n2.kind === `weapon` || n2.kind === `consumable`;
    this.cardEl.className = `lootcard r` + (s2 ? r : 0) + (s2 ? `` : ` plain`) + (this.cardOn ? ` on` : ``), n2.icon ? this.cardImg.src = n2.icon : this.cardImg.removeAttribute(`src`), this.cardCount.textContent = o, this.cardRar.textContent = s2 ? Ph[r].toUpperCase() : n2.kind === `ammo` ? `AMMO` : `MATERIALS`, this.cardName.textContent = i, this.cardStats.replaceChildren();
    for (let [e5, t3] of a) {
      let n3 = Q(`div`, `lc-stat`, this.cardStats);
      Q(`b`, ``, n3, t3), Q(`span`, ``, n3, e5);
    }
    this.cardStats.style.display = a.length ? `` : `none`, this.cardKey.textContent = e4, this.cardVerb.textContent = t2;
  }
  setUseProgress(e4, t2) {
    if (e4 === null) {
      this.useOn && (this.useOn = false, this.useEl.classList.remove(`on`));
      return;
    }
    this.useOn || (this.useOn = true, this.useEl.classList.add(`on`)), e4 !== this.useLabel && (this.useLabel = e4, this.useLabelEl.textContent = e4);
    let n2 = Math.round(tD(t2, 0, 1) * 400);
    n2 !== this.useKey && (this.useKey = n2, this.useFill.style.transform = `scaleX(${n2 / 400})`);
  }
  elimPopup(e4, t2) {
    this.elimName.textContent = e4, this.elimCount.textContent = MD(t2), this.elimUnit.textContent = t2 === 1 ? `ELIMINATION` : `ELIMINATIONS`, rD(this.elimEl, [{ opacity: 0, transform: `scale(1.8) rotate(-2deg)` }, { opacity: 1, transform: `scale(0.94) rotate(0deg)`, offset: 0.05 }, { opacity: 1, transform: `scale(1.03)`, offset: 0.08 }, { opacity: 1, transform: `scale(1)`, offset: 0.11 }, { opacity: 1, transform: `scale(1)`, offset: 0.88 }, { opacity: 0, transform: `scale(0.94) translateY(-20%)` }], { duration: 3200 }), rD(this.elimCount, [{ transform: `scale(1)` }, { transform: `scale(1.5)`, offset: 0.5 }, { transform: `scale(1)` }], { duration: 360, delay: 160, easing: `cubic-bezier(.2,1.4,.4,1)` });
  }
  killFeed(e4, t2, n2, r, i2, a2) {
    let i = Q(`div`, `feed-row` + (r ? ` hl` : ``)), a = Q(`div`, `feed-in`, i);
    if (e4) {
      let k2 = Q(`b`, `feed-k`, a, e4);
      i2 && (k2.style.color = i2);
      let r2 = Q(`span`, `feed-how`, a);
      eD(FD(n2), ``, r2), n2 && n2.toLowerCase() !== `cheats` && Q(`small`, ``, r2, n2);
      let v2 = Q(`b`, `feed-v`, a, t2);
      a2 && (v2.style.color = a2);
    } else {
      let e5 = Q(`span`, `feed-how`, a);
      eD(FD(n2), ``, e5), Q(`b`, `feed-v`, a, t2), Q(`span`, `feed-txt`, a, ID(n2));
    }
    for (i.addEventListener(`animationend`, (e5) => {
      e5.animationName === `sr-feed-life` && i.remove();
    }), this.feedEl.appendChild(i); this.feedEl.childElementCount > OD; ) this.feedEl.firstElementChild?.remove();
  }
  openEmoteWheel() {
    this.emoteEl.classList.add(`open`), W.play(`swap`, { volume: 0.4 });
  }
  setEmoteSel(e4) {
    for (let t2 = 0; t2 < 8; t2++) this.emoteSegs[t2].classList.toggle(`on`, t2 === e4);
  }
  closeEmoteWheel() {
    this.emoteEl.classList.remove(`open`);
  }
  addChat(e4, t2, n2) {
    let r = Q(`div`, `chat-line`, this.chatLog);
    Q(`b`, `chat-name`, r, e4 + `: `).style.color = n2 || `#00e5ff`, Q(`span`, ``, r, t2);
    for (; this.chatLog.childElementCount > 6; ) this.chatLog.firstElementChild?.remove();
    this.chatLog.classList.add(`show`), clearTimeout(this.chatHideT), this.chatHideT = setTimeout(() => this.chatLog.classList.remove(`show`), 9e3);
  }
  setupTouch(e4) {
    let t2 = Q(`div`, `touch-ui`, e4);
    let n2 = Q(`div`, `t-joy`, t2), r = Q(`div`, `t-knob`, n2), i = null, a = [0, 0];
    n2.addEventListener(`touchstart`, (e5) => { i = e5.changedTouches[0].identifier; }, { passive: true });
    n2.addEventListener(`touchmove`, (e5) => {
      for (let t3 of e5.changedTouches) if (t3.identifier === i) {
        let o = n2.getBoundingClientRect(), s2 = Math.max(-1, Math.min(1, (t3.clientX - o.left - o.width / 2) / (o.width / 2))), c = Math.max(-1, Math.min(1, (t3.clientY - o.top - o.height / 2) / (o.height / 2)));
        a = [s2, c], r.style.transform = `translate(${s2 * 30}px, ${c * 30}px)`;
        X.set(`KeyW`, c < -0.3), X.set(`KeyS`, c > 0.3), X.set(`KeyA`, s2 < -0.3), X.set(`KeyD`, s2 > 0.3), X.set(`ShiftLeft`, Math.hypot(s2, c) > 0.92);
      }
    }, { passive: true });
    let endJoy = () => { a = [0, 0], r.style.transform = ``, X.set(`KeyW`), X.set(`KeyS`), X.set(`KeyA`), X.set(`KeyD`), X.set(`ShiftLeft`); };
    n2.addEventListener(`touchend`, endJoy, { passive: true }), n2.addEventListener(`touchcancel`, endJoy, { passive: true });
    let o = Q(`div`, `t-btns`, t2), mk = (t3, n3) => {
      let i2 = Q(`div`, `t-btn`, o, t3);
      i2.addEventListener(`touchstart`, (a2) => { a2.preventDefault(), X.set(n3, true); }, { passive: false }), i2.addEventListener(`touchend`, () => X.set(n3, false), { passive: true });
      return i2;
    };
    mk(`FIRE`, `Mouse0`), mk(`JUMP`, `Space`), mk(`USE`, `KeyE`), mk(`BUILD`, `KeyQ`);
    let s2 = null, c = [0, 0];
    e4.addEventListener(`touchstart`, (t3) => {
      for (let n3 of t3.changedTouches) n3.clientX > innerWidth / 2 && s2 === null && !(n3.target.closest && n3.target.closest(`.t-btn`)) && (s2 = n3.identifier, c = [n3.clientX, n3.clientY]);
    }, { passive: true });
    e4.addEventListener(`touchmove`, (t3) => {
      for (let n3 of t3.changedTouches) n3.identifier === s2 && (X.mouseDX += (n3.clientX - c[0]) * 0.9, X.mouseDY += (n3.clientY - c[1]) * 0.9, c = [n3.clientX, n3.clientY]);
    }, { passive: true });
    let endLook = (t3) => { for (let n3 of t3.changedTouches) n3.identifier === s2 && (s2 = null); };
    e4.addEventListener(`touchend`, endLook, { passive: true }), e4.addEventListener(`touchcancel`, endLook, { passive: true });
  }
  pickupToast(e4, t2, n2) {
    let r = Q(`div`, `toast` + (n2 === null ? `` : ` rar r` + n2)), i = Q(`div`, `toast-in pl`, r);
    if (e4) {
      let t3 = Q(`img`, `toast-img`, i);
      t3.alt = ``, t3.draggable = false, t3.src = e4;
    }
    for (Q(`span`, `toast-text`, i, t2), r.addEventListener(`animationend`, (e5) => {
      e5.animationName === `sr-toast-life` && r.remove();
    }), this.toastEl.appendChild(r); this.toastEl.childElementCount > kD; ) this.toastEl.firstElementChild?.remove();
  }
  banner(e4, t2, n2 = 3e3, r = `info`) {
    let i = !e4;
    this.banTitle.textContent = e4, this.banTitle.style.display = i ? `none` : ``, this.banText.textContent = t2 ?? ``, this.banSub.style.display = t2 ? `` : `none`, this.banIcon.innerHTML = i ? `` : r === `storm` ? dD.storm : r === `good` ? dD.crown : dD.target, this.banIcon.style.display = i ? `none` : ``, this.banEl.className = `banner t-` + (i ? `notice` : r) + ` on`, i ? rD(this.banSub, [{ transform: `translateY(30%)`, opacity: 0 }, { transform: `none`, opacity: 1 }], { duration: 160, easing: `ease-out` }) : (rD(this.banTitle, [{ transform: `scale(1.5)`, opacity: 0 }, { transform: `scale(.96)`, opacity: 1, offset: 0.55 }, { transform: `scale(1)` }], { duration: 460, easing: `cubic-bezier(.2,1.4,.4,1)` }), rD(this.banSub, [{ clipPath: `inset(0 50% 0 50%)` }, { clipPath: `inset(0 0 0 0)` }], { duration: 360, delay: 120, easing: `cubic-bezier(.2,.9,.3,1)`, fill: `backwards` })), window.clearTimeout(this.banTimer), this.banTimer = window.setTimeout(() => this.banEl.classList.remove(`on`), Math.max(300, n2));
  }
  floatText(e4, t2, n2, r) {
    if (!Sf.s.damageNumbers && (r === `dmg` || r === `crit` || r === `shield`)) return;
    let i = this.floats[this.floatI];
    this.floatI = (this.floatI + 1) % this.floats.length, i.inner.textContent = n2, i.inner.className = `ft-in ft-` + r, i.root.style.transform = `translate3d(${Math.round(e4)}px,${Math.round(t2)}px,0)`;
    let a = PD(), o = (Math.random() - 0.5) * 7 * a, s2 = (r === `crit` ? 9 : 7) * a, c = r === `crit` ? 1.6 : 1.3, l2 = r === `crit` ? Math.random() < 0.5 ? -8 : 8 : 0;
    rD(i.inner, [{ opacity: 0, transform: `translate(0px,0px) scale(0.4) rotate(${l2}deg)` }, { opacity: 1, transform: `translate(${(o * 0.2).toFixed(1)}px,${(-s2 * 0.3).toFixed(1)}px) scale(${c}) rotate(${-l2 / 2}deg)`, offset: 0.14 }, { opacity: 1, transform: `translate(${(o * 0.65).toFixed(1)}px,${(-s2 * 0.75).toFixed(1)}px) scale(1) rotate(0deg)`, offset: 0.62 }, { opacity: 0, transform: `translate(${o.toFixed(1)}px,${(-s2).toFixed(1)}px) scale(0.9)` }], { duration: r === `crit` ? 1050 : 850, easing: `ease-out` });
  }
  setBusUi(e4, t2) {
    e4 !== this.busMode && (this.busMode = e4, this.busEl.className = `busui m-` + e4 + (e4 === `hidden` ? `` : ` on`), e4 === `riding` ? this.busTitle.textContent = `BATTLE BUS LAUNCHING` : e4 === `canDrop` ? this.busAct.textContent = `DROP` : e4 === `skydive` ? this.busAct.textContent = `Deploy Glider` : e4 === `glide` && (this.busAct.textContent = `Close Glider`));
    let n2 = t2 ?? ``;
    n2 !== this.busInfo && (this.busInfo = n2, this.busInfoEl.textContent = n2, this.busInfoEl.classList.toggle(`on`, n2 !== ``));
  }
  setMapBase(e4) {
    this.base = e4, this.view && this.updateMap(this.view);
  }
  updateMap(e4) {
    if (this.view = e4, !this.visible) return;
    let t2 = hD(e4.px, e4.pz), n2 = t2 ?? ``;
    n2 !== this.loc && (this.loc = n2, this.locEl.textContent = n2, this.locEl.classList.toggle(`on`, n2 !== ``), this.fullLoc.textContent = n2 ? `YOU ARE IN ` + n2 : ``, n2 && rD(this.locEl, [{ opacity: 0, transform: `translateY(60%)` }, { opacity: 1, transform: `none` }], { duration: 260, easing: `ease-out` }));
    let r = -1;
    if (e4.next) {
      let t3 = Math.hypot(e4.px - e4.next.x, e4.pz - e4.next.z) - e4.next.r;
      t3 > 2 && (r = Math.round(t3));
    }
    r !== this.dist && (r < 0 != this.dist < 0 && this.distEl.classList.toggle(`on`, r >= 0), this.dist = r, r >= 0 && (this.distText.textContent = r + ` m`)), this.miniCtx && (this.miniPx ||= VD(this.miniCv), this.miniPx && bD(this.miniCtx, this.miniPx, this.base, e4, mD(e4, SD), this.miniPx / 100, false, t2)), this.fullOpen && this.drawFull(e4);
  }
  drawFull(e4) {
    this.fullCtx && (this.fullPx ||= VD(this.fullCv), this.fullPx && bD(this.fullCtx, this.fullPx, this.base, e4, { cx: 0, cz: 0, span: e4.size }, this.fullPx / 240, true, hD(e4.px, e4.pz)));
  }
  toggleFullMap(e4) {
    let t2 = e4 ?? !this.fullOpen;
    return t2 !== this.fullOpen && (this.fullOpen = t2, this.fullEl.classList.toggle(`open`, t2), t2 && (this.fullPx = 0, this.view && this.visible && this.drawFull(this.view))), t2;
  }
}, UD = [`light`, `medium`, `heavy`, `shells`, `rockets`], WD = [`wood`, `stone`, `metal`], GD = 5;
function KD(e4, t2) {
  t2 ? e4.src = t2 : e4.removeAttribute(`src`);
}
var qD = class {
  cb;
  root;
  panel;
  tiles = [];
  pick;
  ammo = {};
  mats = {};
  dTile;
  dImg;
  dRar;
  dName;
  dKind;
  dStats;
  dBtns;
  dEmpty;
  dBody;
  dropZone;
  data = null;
  sel = -1;
  shown = ``;
  drag = null;
  open_ = false;
  constructor(e4, t2, n2 = null) {
    this.cb = t2;
    let r = this.root = Q(`div`, `sr-menus inv-root`);
    e4.insertBefore(r, n2);
    let i = Q(`div`, `inv-back`, r);
    i.addEventListener(`pointerdown`, (e5) => {
      e5.target === i && this.cb.onClose();
    }), this.dropZone = Q(`div`, `inv-dropzone`, r), Q(`b`, ``, this.dropZone, `DROP ITEM`), Q(`span`, ``, this.dropZone, `Release to throw it on the ground`);
    let a = this.panel = Q(`div`, `inv-panel`, r), o = Q(`div`, `inv-head`, a);
    Q(`div`, `inv-title`, o, `INVENTORY`);
    let s2 = Q(`button`, `inv-close`, o);
    s2.type = `button`, s2.tabIndex = -1, Q(`kbd`, `keycap sm`, s2, `I`), Q(`span`, ``, s2, `CLOSE`), s2.addEventListener(`click`, () => {
      this.cb.onSound(`click`), this.cb.onClose();
    });
    let c = Q(`div`, `inv-row`, a);
    this.pick = this.makeTile(c, `1`, -1), this.pick.root.classList.add(`pick`), this.pick.name.textContent = `Pickaxe`, Q(`i`, `inv-lock`, this.pick.root, `FIXED`);
    for (let e5 = 0; e5 < GD; e5++) this.tiles.push(this.makeTile(c, String(e5 + 2), e5));
    let l2 = Q(`div`, `inv-low`, a), u = Q(`div`, `inv-detail`, l2);
    this.dEmpty = Q(`div`, `inv-none`, u, `Pick up weapons and healing items to fill your slots.`), this.dBody = Q(`div`, `inv-dbody`, u), this.dTile = Q(`div`, `slot inv-dtile`, this.dBody), Q(`div`, `slot-bg`, this.dTile), this.dImg = Q(`img`, `slot-img`, this.dTile), this.dImg.alt = ``, this.dImg.draggable = false;
    let d = Q(`div`, `inv-dinfo`, this.dBody);
    this.dRar = Q(`div`, `inv-drar`, d), this.dName = Q(`div`, `inv-dname`, d), this.dKind = Q(`div`, `inv-dkind`, d), this.dStats = Q(`div`, `inv-dstats`, d), this.dBtns = Q(`div`, `inv-dbtns`, u), this.button(`EQUIP`, `ENTER`, `inv-b-eq`, () => {
      this.item(this.sel) && this.cb.onEquip(this.sel);
    }), this.button(`DROP`, `X`, `inv-b-drop`, () => this.dropSel());
    let f = Q(`div`, `inv-side`, l2);
    Q(`div`, `inv-sub`, f, `AMMO`);
    let p = Q(`div`, `inv-grid`, f);
    for (let e5 of UD) this.ammo[e5] = this.makeRow(p, Rh[e5]);
    Q(`div`, `inv-sub`, f, `MATERIALS`);
    let m = Q(`div`, `inv-grid`, f);
    for (let e5 of WD) this.mats[e5] = this.makeRow(m, Vh[e5]);
    let h = Q(`div`, `inv-foot`, a);
    for (let [e5, t3] of [[`DRAG`, `Swap slots`], [`DRAG OUT`, `Drop`], [`RIGHT-CLICK`, `Drop`], [`DOUBLE-CLICK`, `Equip`], [`2 - 6`, `Select`]]) {
      let n3 = Q(`span`, `inv-hint`, h);
      Q(`kbd`, `keycap sm`, n3, e5), Q(`span`, ``, n3, t3);
    }
  }
  get isOpen() {
    return this.open_;
  }
  open(e4) {
    this.open_ = true, this.sel = e4.active >= 0 && e4.slots[e4.active] ? e4.active : e4.slots.findIndex((e5) => !!e5), this.shown = ``, this.update(e4), this.root.classList.add(`open`);
  }
  close() {
    this.open_ && (this.open_ = false, this.endDrag(false), this.root.classList.remove(`open`));
  }
  key(e4) {
    if (!this.open_) return false;
    if (e4.startsWith(`Digit`)) {
      let t2 = Number(e4.slice(5)) - 2;
      return t2 >= 0 && t2 < GD && (this.select(t2), this.cb.onSound(`hover`), true);
    }
    return e4 === `KeyX` || e4 === `Delete` || e4 === `Backspace` ? (this.dropSel(), true) : e4 === `Enter` || e4 === `NumpadEnter` ? (this.item(this.sel) && this.cb.onEquip(this.sel), true) : false;
  }
  update(e4) {
    this.data = e4, e4.pickaxeIcon !== this.pick.icon && (this.pick.icon = e4.pickaxeIcon, KD(this.pick.img, e4.pickaxeIcon), this.pick.root.classList.remove(`empty`)), this.pick.root.classList.toggle(`active`, e4.active === -1);
    for (let t2 = 0; t2 < GD; t2++) {
      let n2 = e4.slots[t2] ?? null, r = this.tiles[t2];
      if (r.root.classList.toggle(`active`, e4.active === t2), r.root.classList.toggle(`sel`, this.sel === t2), !n2) {
        r.empty || (r.empty = true, r.root.classList.add(`empty`), r.rarity >= 0 && r.root.classList.remove(`r` + r.rarity), r.rarity = -1, r.icon = ``, r.text = ``, r.label = ``, r.img.removeAttribute(`src`), r.count.textContent = ``, r.name.textContent = `Empty`);
        continue;
      }
      r.empty && (r.empty = false, r.root.classList.remove(`empty`)), n2.icon !== r.icon && (r.icon = n2.icon, KD(r.img, n2.icon)), n2.rarity !== r.rarity && (r.rarity >= 0 && r.root.classList.remove(`r` + r.rarity), r.rarity = n2.rarity, r.root.classList.add(`r` + n2.rarity));
      let i = String(n2.count);
      i !== r.text && (r.text = i, r.count.textContent = i), n2.name !== r.label && (r.label = n2.name, r.name.textContent = n2.name);
    }
    for (let t2 of UD) this.setRow(this.ammo[t2], e4.ammo[t2], e4.icon(`ammo_` + t2));
    for (let t2 of WD) this.setRow(this.mats[t2], e4.mats[t2], e4.icon(`mat_` + t2));
    this.detail();
  }
  item(e4) {
    return e4 >= 0 && this.data ? this.data.slots[e4] ?? null : null;
  }
  select(e4) {
    if (e4 !== this.sel) {
      this.sel = e4;
      for (let t2 = 0; t2 < GD; t2++) this.tiles[t2].root.classList.toggle(`sel`, t2 === e4);
      this.detail();
    }
  }
  dropSel() {
    this.item(this.sel) ? this.cb.onDrop(this.sel) : this.cb.onSound(`deny`);
  }
  detail() {
    let e4 = this.item(this.sel), t2 = e4 ? `${this.sel}|${e4.name}|${e4.rarity}|${e4.count}|${this.data.active === this.sel}` : `none`;
    if (t2 !== this.shown && (this.shown = t2, this.dEmpty.style.display = e4 ? `none` : ``, this.dBody.style.display = e4 ? `` : `none`, this.dBtns.style.display = e4 ? `` : `none`, e4)) {
      this.dTile.className = `slot inv-dtile r` + e4.rarity, KD(this.dImg, e4.icon), this.dRar.textContent = (Ph[e4.rarity] ?? ``).toUpperCase(), this.dRar.className = `inv-drar r` + e4.rarity, this.dName.textContent = e4.name, this.dKind.textContent = e4.kind + (this.data.active === this.sel ? `  -  EQUIPPED` : ``), this.dStats.replaceChildren();
      for (let [t3, n2] of e4.stats) {
        let e5 = Q(`div`, `inv-stat`, this.dStats);
        Q(`span`, ``, e5, t3), Q(`b`, ``, e5, n2);
      }
    }
  }
  button(e4, t2, n2, r) {
    let i = Q(`button`, `inv-btn ` + n2, this.dBtns);
    i.type = `button`, i.tabIndex = -1, Q(`span`, ``, i, e4), Q(`kbd`, `keycap sm`, i, t2), i.addEventListener(`mouseenter`, () => this.cb.onSound(`hover`)), i.addEventListener(`click`, () => {
      r(), i.blur();
    });
  }
  makeRow(e4, t2) {
    let n2 = Q(`div`, `inv-res zero`, e4), r = Q(`img`, ``, n2);
    return r.alt = ``, r.draggable = false, Q(`span`, ``, n2, t2), { root: n2, num: Q(`b`, ``, n2, `0`), val: -1 };
  }
  setRow(e4, t2, n2) {
    let r = e4.root.firstElementChild;
    n2 && r.getAttribute(`src`) !== n2 && (r.src = n2), t2 !== e4.val && (e4.val = t2, e4.num.textContent = String(t2), e4.root.classList.toggle(`zero`, t2 <= 0));
  }
  makeTile(e4, t2, n2) {
    let r = Q(`div`, `inv-cell`, e4), i = Q(`div`, `slot inv-slot empty`, r);
    i.dataset.slot = String(n2), Q(`div`, `slot-bg`, i);
    let a = Q(`img`, `slot-img`, i);
    a.alt = ``, a.draggable = false, a.decoding = `async`, Q(`span`, `slot-key`, i, t2);
    let o = Q(`span`, `slot-count`, i), s2 = Q(`div`, `inv-name`, r, n2 < 0 ? `` : `Empty`);
    return n2 >= 0 && (i.addEventListener(`pointerenter`, () => {
      !this.drag && this.item(n2) && this.cb.onSound(`hover`);
    }), i.addEventListener(`pointerdown`, (e5) => {
      if (!(e5.button !== 0 || this.drag) && (this.select(n2), this.item(n2))) {
        this.drag = { from: n2, x: e5.clientX, y: e5.clientY, id: e5.pointerId, live: false, ghost: null, target: -1, out: false };
        try {
          i.setPointerCapture(e5.pointerId);
        } catch {
        }
        e5.preventDefault();
      }
    }), i.addEventListener(`pointermove`, (e5) => this.moveDrag(e5)), i.addEventListener(`pointerup`, (e5) => {
      this.drag && e5.pointerId === this.drag.id && (this.moveDrag(e5), this.endDrag(true));
    }), i.addEventListener(`pointercancel`, () => this.endDrag(false)), i.addEventListener(`contextmenu`, (e5) => {
      e5.preventDefault(), this.item(n2) && (this.select(n2), this.cb.onDrop(n2));
    }), i.addEventListener(`dblclick`, () => {
      this.item(n2) && this.cb.onEquip(n2);
    })), { root: i, img: a, count: o, name: s2, icon: ``, rarity: -1, text: ``, label: ``, empty: true };
  }
  slotAt(e4, t2) {
    let n2 = document.elementFromPoint(e4, t2), r = n2 ? n2.closest(`[data-slot]`) : null, i = r ? Number(r.dataset.slot) : -1;
    return i >= 0 && i < GD ? i : -1;
  }
  moveDrag(e4) {
    let t2 = this.drag;
    if (!t2 || e4.pointerId !== t2.id) return;
    if (!t2.live) {
      if (Math.hypot(e4.clientX - t2.x, e4.clientY - t2.y) < 7) return;
      t2.live = true;
      let n3 = this.tiles[t2.from], r2 = this.item(t2.from), i2 = t2.ghost = Q(`div`, `slot inv-ghost r` + (r2 ? r2.rarity : 0), this.root);
      Q(`div`, `slot-bg`, i2);
      let a2 = Q(`img`, `slot-img`, i2);
      a2.alt = ``, r2 && KD(a2, r2.icon), n3.root.classList.add(`dragging`), this.root.classList.add(`dragging`);
    }
    let n2 = t2.ghost;
    n2.style.left = e4.clientX + `px`, n2.style.top = e4.clientY + `px`;
    let r = this.slotAt(e4.clientX, e4.clientY), i = this.panel.getBoundingClientRect(), a = e4.clientX < i.left || e4.clientX > i.right || e4.clientY < i.top || e4.clientY > i.bottom;
    r !== t2.target && (t2.target >= 0 && this.tiles[t2.target].root.classList.remove(`target`), t2.target = r, r >= 0 && r !== t2.from && (this.tiles[r].root.classList.add(`target`), this.cb.onSound(`hover`))), a !== t2.out && (t2.out = a, this.root.classList.toggle(`drop-out`, a), n2.classList.toggle(`out`, a));
  }
  endDrag(e4) {
    let t2 = this.drag;
    if (t2) {
      this.drag = null, this.tiles[t2.from].root.classList.remove(`dragging`), t2.target >= 0 && this.tiles[t2.target].root.classList.remove(`target`), this.root.classList.remove(`dragging`, `drop-out`), t2.ghost?.remove();
      try {
        this.tiles[t2.from].root.releasePointerCapture(t2.id);
      } catch {
      }
      e4 && t2.live && (t2.out ? this.cb.onDrop(t2.from) : t2.target >= 0 && t2.target !== t2.from ? (this.sel = t2.target, this.shown = ``, this.cb.onSwap(t2.from, t2.target)) : this.cb.onSound(`deny`));
    }
  }
}, JD = [{ id: `lobby`, label: `PLAY` }, { id: `shop`, label: `SHOP` }, { id: `battlepass`, label: `BATTLE PASS` }, { id: `quests`, label: `QUESTS` }, { id: `locker`, label: `LOCKER` }, { id: `stats`, label: `STATS` }, { id: `settings`, label: `SETTINGS` }, { id: `bbucks`, label: `B-BUCKS` }], YD = [[[`W`, `A`, `S`, `D`], `Move`], [[`SPACE`], `Jump / Double Jump`], [[`SHIFT`], `Sprint / Sky Dash (air)`], [[`Z`], `Crouch / Slide`], [[`MOUSE`], `Aim`], [[`LMB`], `Fire / harvest / place`], [[`RMB`], `Aim (ADS) / switch material while building`], [[`1`], `Pickaxe`], [[`2 - 6`], `Weapons`], [[`WHEEL`], `Cycle items`], [[`R`], `Reload / rotate piece`], [[`E`], `Interact / pick up`], [[`Q`], `Wall`], [[`C`], `Floor`], [[`F`], `Stairs`], [[`V`], `Roof`], [[`T`], `Launch Pad`], [[`X`], `Switch material`], [[`G`], `Edit piece`], [[`I`], `Inventory (drag slots to rearrange)`], [[`TAB`, `M`], `Map`], [[`B`], `Emote`], [[`P`], `Cheats`], [[`ESC`], `Pause`]], XD = [[[`WASD`], `Move`], [[`SPACE`], `Jump / Double Jump`], [[`SHIFT`], `Sprint / Dash`], [[`LMB`], `Fire / build`], [[`RMB`], `Aim`], [[`Q`, `C`, `F`, `V`, `T`], `Build`], [[`E`], `Pick up`], [[`R`], `Reload`], [[`TAB`], `Map`], [[`B`], `Emote`], [[`P`], `Cheats`]], ZD = [[`god`, `God Mode`, `Take no damage`], [`aimbot`, `Aimbot`, `Shots snap to the nearest enemy`], [`infiniteAmmo`, `Infinite Ammo`, `Reserve ammo never runs out`], [`infiniteMats`, `Infinite Materials`, `Build without spending`], [`noReload`, `No Reload`, `Magazines never empty`], [`oneShot`, `One-Shot Kills`, `Every hit eliminates`], [`speed`, `Super Speed`, `Run much faster`], [`superJump`, `Super Jump`, `Jump far higher`], [`fly`, `Fly`, `Free flight, Space up and Z down`], [`esp`, `ESP / Wallhack`, `See enemies through walls`], [`noStorm`, `No Storm Damage`, `The storm cannot hurt you`], [`freezeBots`, `Freeze Bots`, `Bots stop moving and shooting`]], QD = [[`giveAll`, `Assorted Loadout`], [`giveMythic`, `Mythic Loadout + Web Shooters`], [`giveWeb`, `Refill Web Shooters`], [`maxAmmo`, `Max All Ammo`], [`maxMats`, `Max Materials`], [`fullHeal`, `Full Heal + Shield`], [`killAll`, `Eliminate All Bots`], [`skipStorm`, `Skip Storm Phase`], [`tpZone`, `Teleport to Safe Zone`], [`spawnChest`, `Spawn Chest`], [`win`, `Instant Win`]], $D = [`Chests glow and hum. Listen for them through walls.`, `High ground wins fights. Build stairs before you push.`, `Shield potions stack on top of health. Drink before the fight, not during it.`, `The storm closes faster every phase. Rotate early.`, `Hit the glowing weak point while harvesting for double materials.`, `Wood builds fast, metal lasts longest.`, `Shotguns up close, rifles at range, snipers when they stand still.`, `Deploy your glider late to land first.`, `A wall placed in time blocks more damage than any shield.`, `Crouching tightens your aim.`, `Cook a grenade over a wall: it bounces before it blows.`, `Craggy Cliffs make great sniper nests. So does everyone else think.`], eO = [`NEW ISLAND`, `NEW LOCATIONS`, `BUILD & EDIT`, `SLIDE`, `SWIMMING`, `SNOWY PEAKS`], tO = [`Eliminations`, `Damage`, `Accuracy`, `Materials`, `Builds`, `Time Alive`], nO = [`#ffe838`, `#1f8fff`, `#45c2ff`, `#ffffff`, `#ff5fa2`, `#6fdc3c`, `#a35cff`], rO = (e4) => Math.round(e4 * 100) + `%`, iO = (e4) => e4.toFixed(2), aO = (e4) => {
  let t2 = Math.max(0, Math.floor(e4)), n2 = t2 % 60;
  return Math.floor(t2 / 60) + `:` + (n2 < 10 ? `0` : ``) + n2;
};
function oO(e4) {
  return e4.tabIndex = -1, e4;
}
function sO(e4, t2, n2) {
  let r = Q(`span`, `gtext ol ` + t2, e4, n2);
  return r.dataset.t = n2, r;
}
function cO(e4, t2) {
  e4.textContent = t2, e4.dataset.t = t2;
}
var lO = class {
  cb;
  skins;
  root;
  syncs = /* @__PURE__ */ new Map();
  state = { loading: false, lobby: false, pause: false, cheats: false, result: false };
  focusBack = null;
  releaseFocus = () => {
    let e4 = document.activeElement;
    if (!(e4 instanceof HTMLElement) || !this.root.contains(e4)) return;
    e4.blur();
    let t2 = this.focusBack;
    t2 && t2.isConnected && t2.focus({ preventScroll: true });
  };
  loadingEl;
  loadTip;
  loadText;
  loadPct;
  loadBar;
  loadFill;
  loadTimer = 0;
  loadShown = ``;
  lobbyEl;
  tabBtns = {};
  panes = {};
  pauseEl;
  pauseRight;
  pauseSettingsBtn;
  pauseView = `controls`;
  cheatsEl;
  resultEl;
  confetti;
  stars;
  resRank;
  resTitle;
  resPlace;
  resPlaceTotal;
  resKicker;
  resSub;
  resStats = [];
  resVals = [];
  countRaf = 0;
  constructor(e4, t2, n2) {
    this.cb = t2, this.skins = n2;
    let r = this.root = Q(`div`, `sr-menus`, e4);
    r.addEventListener(`mousedown`, (e5) => {
      e5.target instanceof HTMLInputElement || e5.preventDefault();
    });
    let i = this.lobbyEl = Q(`div`, `m-screen m-lobby`, r);
    Q(`div`, `lobby-shade`, i);
    let a = Q(`div`, `lobby-top`, i);
    this.logo(a, ``);
    let bb = Q(`div`, `bbucks`, i);
    Q(`span`, `bbucks-ic`, bb, `V`), Q(`span`, `bbucks-val`, bb, Sf.s.bbucks);
    let bpCounter = Q(`div`, `bp-level-counter`, i);
    Q(`span`, ``, bpCounter, `BATTLE PASS`), Q(`span`, `bp-lc-num`, bpCounter, `LVL ` + Sf.s.bpLevel);
    let o = Q(`div`, `tabs`, i);
    for (let e5 of JD) this.tabBtns[e5.id] = this.btn(e5.label, `tab`, o, () => this.setTab(e5.id));
    let s2 = Q(`div`, `lobby-me pl`, i), c = Q(`span`, `me-av`, s2);
    eD(dD.figure, ``, c);
    let l2 = Q(`div`, `me-txt`, s2), u = Q(`b`, `me-name`, l2);
    Q(`span`, `me-sub`, l2, `OUTFIT  \xB7  READY`);
    let d = () => {
      let e5 = this.skins.find((e6) => e6.id === Sf.s.skin) ?? this.skins[0];
      e5 && (u.textContent = e5.name.toUpperCase(), c.style.setProperty(`--c`, e5.color));
    };
    this.onSync(`skin`, d), d();
    let frBtn = this.btn(`FRIENDS`, `friends-btn`, i, () => this.cb.onOnline());
    this.friendsEl = Q(`div`, `friends-panel`, i);
    this.buildFriends();
    let f = this.panes.lobby = Q(`div`, `tabpane pane-play`, i), p = Q(`div`, `season-in`, Q(`div`, `season`, f));
    Q(`span`, `season-tag`, p, `CHAPTER 4 • SEASON 1`), sO(p, `season-name`, `A NEW BEGINNING`), Q(`div`, `season-sub`, p, `A NEW ISLAND AWAITS`);
    let m = Q(`div`, `season-chips`, p);
    for (let e5 of eO) Q(`b`, ``, Q(`span`, `chip`, m), e5);
    let h = Q(`div`, `card howto`, f);
    Q(`div`, `card-title`, h, `QUICK CONTROLS`), this.controls(h, `mini`, XD);
    let g2 = Q(`div`, `howto-foot`, h);
    Q(`span`, ``, g2, `FULL LIST IN THE PAUSE MENU`), Q(`kbd`, `keycap sm`, g2, `ESC`);
    let _2 = Q(`div`, `playcol`, f), v = Q(`div`, `modecard`, _2), y = Q(`div`, `mode-tag`, v);
    Q(`i`, ``, y), Q(`span`, ``, y, `GAME MODE`);
    let b = Q(`div`, `mode-name`, v);
    let modeNameEl = Q(`span`, ``, b, `SOLO`);
    Q(`i`, ``, b), Q(`span`, ``, b, `BATTLE ROYALE`);
    let modeBtns = Q(`div`, `mode-btns`, v);
    let modeBtnMap = {};
    for (let [e5, t3] of [[`solo`, `SOLO`], [`duo`, `DUO`], [`trios`, `TRIOS`], [`squad`, `SQUAD`]]) {
      modeBtnMap[e5] = this.btn(t3, `mode-btn` + (Sf.s.gameMode === e5 ? ` on` : ``), modeBtns, () => {
        Sf.set(`gameMode`, e5), this.cb.onUiSound(`click`);
        for (let n3 in modeBtnMap) modeBtnMap[n3].classList.toggle(`on`, n3 === e5);
        modeNameEl.textContent = t3;
      });
    }
    // Event mode selector
    let evTag = Q(`div`, `mode-tag`, v);
    Q(`i`, ``, evTag), Q(`span`, ``, evTag, `EVENT MODE`);
    let evBtns = Q(`div`, `mode-btns`, v);
    let evBtnMap = {};
    for (let [e5, t3] of [[`normal`, `NORMAL`], [`oneshot`, `ONE-SHOT`], [`sniper`, `SNIPER ONLY`], [`highmat`, `HIGH MATS`]]) {
      evBtnMap[e5] = this.btn(t3, `mode-btn` + (Sf.s.eventMode === e5 ? ` on` : ``), evBtns, () => {
        Sf.set(`eventMode`, e5), this.cb.onUiSound(`click`);
        for (let n3 in evBtnMap) evBtnMap[n3].classList.toggle(`on`, n3 === e5);
      });
    }
    let x = Q(`div`, `mode-sub`, v), S = () => {
      let e5 = Sf.s.botCount;
      let t3 = { solo: 1, duo: 2, trios: 3, squad: 4 }[Sf.s.gameMode] || 1;
      x.textContent = `${e5 + 1} PLAYERS  \xB7  ${e5 - (t3 - 1)} BOTS  \xB7  ${Sf.s.difficulty.toUpperCase()}`;
    };
    this.onSync(`botCount`, S), this.onSync(`difficulty`, S), this.onSync(`gameMode`, S), S(), this.btn(`PLAY`, `btn-play`, _2, () => this.cb.onPlay(), `play`);
    this.btn(`▶ JOIN LIVE EVENT`, `event-launch`, _2, () => this.cb.onEvent());
    let C = Q(`div`, `panel`, this.panes.locker = Q(`div`, `tabpane pane-locker`, i));
    Q(`div`, `panel-title`, C, `LOCKER`), Q(`div`, `panel-sub`, C, `CUSTOMIZE YOUR LOADOUT`);
    let lkTabs = Q(`div`, `locker-tabs`, C);
    let lkCats = [[`outfits`, `OUTFITS`], [`wraps`, `GUN WRAPS`], [`gliders`, `GLIDERS`], [`pickaxes`, `PICKAXES`]];
    let lkCur = `outfits`;
    let lkBtns = {};
    for (let [e5, t3] of lkCats) {
      lkBtns[e5] = this.btn(t3, `lk-tab` + (e5 === lkCur ? ` on` : ``), lkTabs, () => {
        lkCur = e5, this.cb.onUiSound(`click`);
        for (let n3 in lkBtns) lkBtns[n3].classList.toggle(`on`, n3 === e5);
        lkShow(e5);
      });
    }
    let w = Q(`div`, `skins scroll`, C), T2 = [];
    let lkShow = (e5) => {
      w.innerHTML = ``, T2 = [];
      let owned = Sf.s.shopOwned || [];
      // Battle Pass owned items (from claimed tiers)
      let bpOwned = [];
      if (Sf.s.battlePassOwned && Sf.s.bpClaimed) {
        for (let tier of Sf.s.bpClaimed) {
          let item = bpTiers[tier - 1];
          if (item && item.type !== `bbucks`) bpOwned.push(item.id);
        }
      }
      let allOwned = [...owned, ...bpOwned];
      if (e5 === `outfits`) {
        // Only show default (ranger) + owned skins
        let availableSkins = this.skins.filter(s => [`ranger`, `foundation`, `islandscout`, `icewarden`, `webhero`, `cosmicllama`].includes(s.id) || allOwned.includes(s.id));
        for (let t3 of availableSkins) {
          let n3 = oO(Q(`button`, `skin`, w));
          n3.type = `button`, Q(`span`, `skin-eq`, n3, `EQUIPPED`);
          let r = Q(`span`, `skin-sw`, n3);
          r.style.setProperty(`--c`, t3.color), eD(dD.figure, ``, r), Q(`span`, `skin-name`, n3, t3.name), n3.addEventListener(`mouseenter`, () => this.cb.onUiSound(`hover`)), n3.addEventListener(`click`, () => {
            this.cb.onUiSound(`click`), Sf.set(`skin`, t3.id), this.cb.onSkin(t3.id);
          }), T2.push({ id: t3.id, root: n3 });
        }
        if (availableSkins.length === 1) {
          Q(`div`, `locker-hint`, w, `Buy more outfits in the Item Shop or earn them from the Battle Pass!`);
        }
        let i2 = () => { for (let t3 of T2) t3.root.classList.toggle(`on`, t3.id === Sf.s.skin); };
        this.onSync(`skin`, i2), i2();
      } else {
        let allItems = { wraps: [[`default`, `Default Wrap`, `#888`], [`camo`, `Camo Wrap`, `#4a5d3a`], [`gold`, `Gold Wrap`, `#f2c230`], [`neon`, `Neon Wrap`, `#19d8ff`], [`galaxy`, `Galaxy Wrap`, `#8a4fe0`]], gliders: [[`default`, `Default Glider`, `#888`], [`sky`, `Sky Glider`, `#1f8fff`], [`cloud`, `Cloud Glider`, `#e8f4ff`], [`dragon`, `Dragon Glider`, `#e8402e`], [`phoenix`, `Phoenix Glider`, `#ff8c1a`]], pickaxes: [[`default`, `Default Pickaxe`, `#888`], [`axe`, `Ranger Axe`, `#7c9a3c`], [`hammer`, `War Hammer`, `#5a7a9a`], [`scythe`, `Reaper Scythe`, `#8a4fe0`], [`frost`, `Frost Blade`, `#b8f7ff`]] }[e5];
        let items = allItems.filter(([id]) => id === `default` || allOwned.includes(id));
        let key = { wraps: `wrap`, gliders: `glider`, pickaxes: `pickaxe` }[e5];
        for (let [t3, n3, r] of items) {
          let i2 = oO(Q(`button`, `skin`, w));
          i2.type = `button`, Q(`span`, `skin-eq`, i2, `EQUIPPED`);
          let a = Q(`span`, `skin-sw`, i2);
          a.style.setProperty(`--c`, r), eD(dD.figure, ``, a), Q(`span`, `skin-name`, i2, n3), i2.addEventListener(`mouseenter`, () => this.cb.onUiSound(`hover`)), i2.addEventListener(`click`, () => {
            this.cb.onUiSound(`click`), Sf.set(key, t3);
          }), T2.push({ id: t3, root: i2 });
        }
        if (items.length === 1) {
          Q(`div`, `locker-hint`, w, `Buy more in the Item Shop or earn from Battle Pass!`);
        }
        let o2 = () => { for (let t3 of T2) t3.root.classList.toggle(`on`, t3.id === Sf.s[key]); };
        this.onSync(key, o2), o2();
      }
    };
    this.refreshLocker=()=>lkShow(lkCur);lkShow(`outfits`);
    let bp = Q(`div`, `panel bp-panel`, this.panes.battlepass = Q(`div`, `tabpane pane-battlepass`, i));
    Q(`div`, `panel-title`, bp, `BATTLE PASS`), Q(`div`, `panel-sub`, bp, `CHAPTER 4 SEASON 1: A NEW BEGINNING`);
    this.buildBattlePass(Q(`div`, `scroll bp-scroll`, bp));
    // SHOP pane
    let shopP = Q(`div`, `panel shop-panel`, this.panes.shop = Q(`div`, `tabpane pane-shop`, i));
    Q(`div`, `panel-title`, shopP, `ITEM SHOP`), Q(`div`, `panel-sub`, shopP, `ROTATES EVERY HOUR • SIMULATED B-BUCKS`);
    this.shopEl = Q(`div`, `scroll shop-scroll`, shopP);
    this.buildShop();
    setInterval(()=>{const hour=Math.floor(Date.now()/3600000);if(hour!==this.shopHour)this.buildShop();else{const clock=this.shopEl?.querySelector(`.shop-countdown`),sec=Math.ceil(((hour+1)*3600000-Date.now())/1000);if(clock)clock.textContent=`NEXT ROTATION IN ${Math.floor(sec/60)}:${String(sec%60).padStart(2,`0`)}`;}},1000);
    // No payments are taken: the packs are a local currency demo.
    const bucksPane=this.panes.bbucks=Q(`div`,`tabpane pane-bbucks`,i);
    const bucksPanel=Q(`div`,`panel bucks-panel`,bucksPane);
    Q(`div`,`panel-title`,bucksPanel,`B-BUCKS`);
    Q(`div`,`panel-sub`,bucksPanel,`DEMO ONLY • NO CHARGE • SAVED IN THIS BROWSER`);
    const packs=Q(`div`,`bucks-grid`,bucksPanel);
    for(const [amount,bonus] of [[1000,``],[2800,`12% EXTRA`],[5000,`25% EXTRA`],[13500,`35% EXTRA`]]) {
      const pack=Q(`div`,`bucks-pack`,packs);
      if(bonus) Q(`div`,`bucks-bonus`,pack,bonus);
      Q(`div`,`bucks-coins`,pack,`◉ ◉ ◉`);Q(`strong`,`bucks-amount`,pack,amount.toLocaleString());Q(`span`,`bucks-label`,pack,`B-BUCKS`);
      this.btn(`ADD FREE • DEMO`,`btn-y`,pack,()=>{Sf.set(`bbucks`,Math.min(9999999,Sf.s.bbucks+amount));this.syncBBucks();this.buildShop();});
    }
    // QUESTS pane
    let questP = Q(`div`, `panel quest-panel`, this.panes.quests = Q(`div`, `tabpane pane-quests`, i));
    Q(`div`, `panel-title`, questP, `QUESTS`), Q(`div`, `panel-sub`, questP, `DAILY QUESTS • EARN LEVELS`);
    this.questEl = Q(`div`, `scroll quest-scroll`, questP);
    this.buildQuests();
    // STATS pane
    let statsP = Q(`div`, `panel stats-panel`, this.panes.stats = Q(`div`, `tabpane pane-stats`, i));
    Q(`div`, `panel-title`, statsP, `CAREER STATS`), Q(`div`, `panel-sub`, statsP, `YOUR LIFETIME PERFORMANCE`);
    this.statsEl = Q(`div`, `scroll stats-scroll`, statsP);
    this.buildStats();
    let D = Q(`div`, `panel`, this.panes.settings = Q(`div`, `tabpane pane-settings`, i));
    Q(`div`, `panel-title`, D, `SETTINGS`), this.buildSettings(Q(`div`, `scroll`, D), true);
    let O = this.resultEl = Q(`div`, `m-screen m-result`, r);
    Q(`div`, `res-rays`, O), this.confetti = Q(`div`, `res-confetti`, O);
    let k = Q(`div`, `res-main`, O), A = Q(`div`, `res-head`, k);
    eD(dD.crown, `res-crown`, A), this.stars = Q(`div`, `res-stars`, A);
    let ee = Q(`div`, `res-line`, A);
    this.resRank = sO(ee, `res-rank`, `#1`), this.resTitle = sO(ee, `res-title`, `VICTORY ROYALE`);
    let te = Q(`div`, `res-place pl`, A);
    this.resPlace = Q(`b`, ``, te, `#2`), this.resPlaceTotal = Q(`span`, ``, te, `/ 100`), this.resKicker = Q(`div`, `res-kicker`, A), this.resSub = Q(`div`, `res-sub`, A);
    let ne = Q(`div`, `res-stats`, k);
    for (let e5 of tO) {
      let t3 = Q(`div`, `rstat`, ne);
      this.resStats.push(t3), this.resVals.push(Q(`b`, ``, t3, `0`)), Q(`span`, ``, t3, e5);
    }
    let j = Q(`div`, `res-btns`, k);
    this.btn(`PLAY AGAIN`, `btn-y btn-lg`, j, () => this.cb.onRestart(), `play`), this.btn(`LOBBY`, `btn-b btn-lg`, j, () => this.cb.onLobby());
    let re = Q(`div`, `pause-wrap`, this.pauseEl = Q(`div`, `m-screen m-pause`, r)), M = Q(`div`, `pause-left`, re);
    sO(M, `pause-title`, `PAUSED`), this.btn(`RESUME`, `btn-y`, M, () => {
      this.showPause(false), this.cb.onResume();
    }), this.pauseSettingsBtn = this.btn(`SETTINGS`, ``, M, () => this.setPauseView(this.pauseView === `settings` ? `controls` : `settings`)), this.btn(`CHEATS`, ``, M, () => this.toggleCheats(true)), this.btn(`RETURN TO LOBBY`, `btn-r`, M, () => this.cb.onLobby());
    let pauseBp = Q(`div`, `pause-bp`, M);
    Q(`span`, ``, pauseBp, `BATTLE PASS`), Q(`span`, `bp-lc-num`, pauseBp, `LVL ` + Sf.s.bpLevel);
    let ie = this.pauseRight = Q(`div`, `pause-right panel v-controls`, re), ae = Q(`div`, `pause-controls`, ie);
    Q(`div`, `panel-title`, ae, `CONTROLS`), this.controls(ae, `two`, YD);
    let oe = Q(`div`, `pause-settings`, ie);
    Q(`div`, `panel-title`, oe, `SETTINGS`), this.buildSettings(Q(`div`, `scroll`, oe), true);
    let se = this.cheatsEl = Q(`div`, `m-cheats`, r), ce = Q(`div`, `cheats-head`, se);
    sO(ce, `cheats-title`, `CHEATS`);
    let le = oO(Q(`button`, `xbtn`, ce));
    le.type = `button`, eD(dD.close, ``, le), le.addEventListener(`mouseenter`, () => this.cb.onUiSound(`hover`)), le.addEventListener(`click`, () => {
      this.cb.onUiSound(`click`), this.toggleCheats(false);
      let e5 = this.state;
      e5.pause || e5.lobby || e5.result || e5.loading || this.cb.onResume();
    });
    let ue = Q(`div`, `cheats-body scroll`, se);
    Q(`div`, `set-title`, ue, `TOGGLES`);
    let N = Q(`div`, `set-group`, ue);
    for (let [e5, t3, n3] of ZD) this.toggle(N, t3, e5, () => Sf.cheats[e5], (t4) => Sf.setCheat(e5, t4), n3);
    Q(`div`, `set-title`, ue, `ACTIONS`);
    let de = Q(`div`, `cheat-actions`, ue);
    for (let [e5, t3] of QD) this.btn(t3, `btn-sm` + (e5 === `win` ? ` btn-y` : e5 === `killAll` ? ` btn-r` : ` btn-b`), de, () => this.cb.onCheatAction(e5));
    let fe = Q(`div`, `cheats-foot`, se);
    Q(`kbd`, `keycap sm`, fe, `P`), Q(`span`, ``, fe, `TOGGLE THIS PANEL`);
    let pe = this.loadingEl = Q(`div`, `m-loading`, r);
    Q(`div`, `load-rays`, pe), Q(`div`, `load-season`, pe, `CHAPTER 4 • SEASON 1`), Q(`div`, `load-mode`, pe, `A NEW BEGINNING`), this.logo(pe, `lg`);
    let me = Q(`div`, `load-bottom`, pe), he = Q(`div`, `load-tip`, me);
    Q(`b`, ``, he, `TIP`), this.loadTip = Q(`span`, ``, he);
    let ge = Q(`div`, `load-row`, me);
    this.loadText = Q(`span`, `load-text`, ge), this.loadPct = Q(`span`, `load-pct`, ge), this.loadBar = Q(`div`, `load-bar indet`, me), this.loadFill = Q(`i`, ``, this.loadBar), Sf.onChange((e5) => {
      let t3 = this.syncs.get(e5);
      if (t3) for (let e6 of t3) e6();
    });
  }
  get anyOpen() {
    let e4 = this.state;
    return e4.loading || e4.lobby || e4.pause || e4.cheats || e4.result;
  }
  showLoading(e4, t2) {
    if (e4 === null) {
      if (!this.state.loading) return;
      this.state.loading = false, this.loadingEl.classList.add(`out`), window.clearTimeout(this.loadTimer), this.loadTimer = window.setTimeout(() => this.loadingEl.classList.remove(`open`, `out`), 520);
    } else if (this.state.loading || (this.state.loading = true, window.clearTimeout(this.loadTimer), this.loadingEl.classList.remove(`out`), this.loadingEl.classList.add(`open`), this.loadTip.textContent = $D[Math.floor(Math.random() * $D.length)]), e4 !== this.loadShown && (this.loadShown = e4, this.loadText.textContent = e4), t2 === void 0) this.loadBar.classList.add(`indet`), this.loadPct.textContent = ``;
    else {
      let e5 = tD(t2, 0, 1);
      this.loadBar.classList.remove(`indet`), this.loadFill.style.transform = `scaleX(${e5.toFixed(3)})`, this.loadPct.textContent = Math.round(e5 * 100) + `%`;
    }
  }
  showLobby(e4) {
    if (e4 === this.state.lobby) return;
    this.state.lobby = e4, this.lobbyEl.classList.toggle(`open`, e4), e4 ? this.setTab(`lobby`, false) : this.releaseFocus();
    let t2 = e4 ? `lobby` : `none`;
    queueMicrotask(() => this.cb.onScreen(t2));
  }
  showPause(e4) {
    e4 !== this.state.pause && (this.state.pause = e4, this.pauseEl.classList.toggle(`open`, e4), e4 ? this.setPauseView(`controls`) : this.releaseFocus());
  }
  toggleCheats(e4) {
    let t2 = e4 ?? !this.state.cheats;
    return t2 !== this.state.cheats && (this.state.cheats = t2, this.cheatsEl.classList.toggle(`open`, t2), this.root.classList.toggle(`cheats-open`, t2)), t2;
  }
  showResult(e4) {
    if (cancelAnimationFrame(this.countRaf), cancelAnimationFrame(this.replayRaf), !e4) {
      if (!this.state.result) return;
      this.state.result = false, this.resultEl.classList.remove(`open`), this.confetti.textContent = ``, this.stars.textContent = ``;
      return;
    }
    if (this.state.result = true, this.resultEl.className = `m-screen m-result open ` + (e4.victory ? `victory` : `defeat`), e4.victory) cO(this.resTitle, `VICTORY ROYALE`), this.resKicker.textContent = `LAST ONE STANDING`, this.resSub.textContent = `You outlasted ${Math.max(0, e4.total - 1)} opponents • +100 simulated B-Bucks`, this.spawnConfetti(), this.spawnStars();
    else {
      cO(this.resTitle, `ELIMINATED`), this.resPlace.textContent = `#` + e4.place, this.resPlaceTotal.textContent = `/ ` + e4.total, this.resKicker.textContent = e4.killer ? `ELIMINATED BY ${e4.killer.toUpperCase()}` : `TAKEN OUT BY THE ISLAND`;
      let t3 = e4.total > 0 ? e4.place / e4.total : 1;
      this.resSub.textContent = e4.place <= 10 ? `TOP 10 FINISH` : t3 <= 0.25 ? `TOP 25%` : `DROP BACK IN AND TRY AGAIN`, this.confetti.textContent = ``, this.stars.textContent = ``;
    }
    let t2 = e4.accuracy <= 1 ? e4.accuracy * 100 : e4.accuracy, n2 = [[e4.kills, (e5) => String(Math.round(e5))], [Math.round(e4.damage), (e5) => String(Math.round(e5))], [Math.round(tD(t2, 0, 100)), (e5) => Math.round(e5) + `%`], [Math.round(e4.mats), (e5) => String(Math.round(e5))], [e4.builds, (e5) => String(Math.round(e5))], [Math.floor(e4.timeSec), (e5) => aO(e5)]];
    for (let t3 = 0; t3 < this.resVals.length; t3++) this.resVals[t3].textContent = n2[t3][1](0), this.resStats[t3].classList.toggle(`hi`, t3 === 0 && e4.kills > 0);
    let r = performance.now(), i = (e5) => {
      let t3 = false;
      for (let i2 = 0; i2 < this.resVals.length; i2++) {
        let a = 450 + i2 * 70 + 150, o = tD((e5 - r - a) / 900, 0, 1);
        o < 1 && (t3 = true);
        let s2 = 1 - (1 - o) ** 3;
        this.resVals[i2].textContent = n2[i2][1](n2[i2][0] * s2);
      }
      t3 && this.state.result && (this.countRaf = requestAnimationFrame(i));
    };
    this.countRaf = requestAnimationFrame(i);
    // Match replay: animated path of your match on the map
    cancelAnimationFrame(this.replayRaf), this.replayEl?.remove();
    if (G.replay?.length > 8 && G.hud.base) {
      let n3 = Q(`div`, `replay`, this.resultEl), r2 = Q(`canvas`, ``, n3);
      r2.width = 220, r2.height = 220;
      Q(`div`, `replay-tag`, n3, `MATCH REPLAY`);
      let i2 = r2.getContext(`2d`), a = 0, o = () => {
        if (!this.state.result) return;
        let s2 = G.hud.base, c = 220 / 800;
        i2.clearRect(0, 0, 220, 220), i2.drawImage(s2, 0, 0, s2.width, s2.height, 0, 0, 220, 220);
        let l2 = G.replay, u = Math.min(l2.length, Math.floor(a));
        i2.strokeStyle = `#00e5ff`, i2.lineWidth = 1.6, i2.shadowColor = `#00e5ff`, i2.shadowBlur = 4, i2.beginPath();
        for (let d = 0; d < u; d++) {
          let f = (l2[d][1] + 400) * c, p = (l2[d][2] + 400) * c;
          d ? i2.lineTo(f, p) : i2.moveTo(f, p);
        }
        i2.stroke(), u > 0 && (i2.shadowBlur = 0, i2.fillStyle = `#fff`, i2.beginPath(), i2.arc((l2[u - 1][1] + 400) * c, (l2[u - 1][2] + 400) * c, 2.6, 0, 7), i2.fill());
        a += 0.32, this.replayRaf = requestAnimationFrame(o);
      };
      this.replayEl = n3, this.replayRaf = requestAnimationFrame(o);
    }
  }
  onSync(e4, t2) {
    let n2 = this.syncs.get(e4);
    n2 ? n2.push(t2) : this.syncs.set(e4, [t2]);
  }
  btn(e4, t2, n2, r, i = `click`) {
    let a = oO(Q(`button`, t2 ? `btn ` + t2 : `btn`, n2));
    return a.type = `button`, Q(`span`, `btn-l`, a, e4), a.addEventListener(`mouseenter`, () => this.cb.onUiSound(`hover`)), a.addEventListener(`click`, () => {
      this.cb.onUiSound(i), r();
    }), a;
  }
  logo(e4, t2) {
    let n2 = Q(`div`, t2 ? `logo ` + t2 : `logo`, e4);
    return sO(n2, `logo-a`, `SKYDROP`), Q(`span`, ``, Q(`div`, `logo-b`, n2), `ROYALE`), n2;
  }
  controls(e4, t2, n2) {
    let r = Q(`div`, t2 === `one` ? `binds` : `binds ` + t2, e4);
    for (let [e5, t3] of n2) {
      let n3 = Q(`div`, `bind`, r), i = Q(`span`, `bind-keys`, n3);
      for (let t4 of e5) Q(`kbd`, `keycap sm`, i, t4);
      Q(`span`, `bind-what`, n3, t3);
    }
  }
  setTab(e4, t2 = true) {
    for (let t3 of JD) this.tabBtns[t3.id].classList.toggle(`on`, t3.id === e4), this.panes[t3.id].classList.toggle(`on`, t3.id === e4);
    if(e4===`locker`)this.refreshLocker?.();
    if(e4===`battlepass`){const panel=this.panes.battlepass.querySelector(`.bp-scroll`);if(panel){panel.innerHTML=``;this.buildBattlePass(panel);this.startPassPreview();}}else this.stopPassPreview();
    t2 && this.cb.onScreen(e4);
  }
  setPauseView(e4) {
    this.pauseView = e4, this.pauseRight.className = `pause-right panel v-` + e4, this.pauseSettingsBtn.classList.toggle(`on`, e4 === `settings`);
  }
  buildSettings(e4, t2) {
    let n2 = Q(`div`, t2 ? `set wide` : `set`, e4), r = (e5) => {
      let t3 = Q(`div`, `set-sec`, n2);
      return Q(`div`, `set-title`, t3, e5), Q(`div`, `set-group`, t3);
    }, i = r(`AUDIO`);
    this.slider(i, `Master`, `master`, 0, 1, 0.01, rO), this.slider(i, `Effects`, `sfx`, 0, 1, 0.01, rO), this.slider(i, `Ambience`, `ambience`, 0, 1, 0.01, rO), this.slider(i, `Interface`, `ui`, 0, 1, 0.01, rO);
    let a = r(`VIDEO`);
    this.slider(a, `Field of View`, `fov`, 60, 120, 1, (e5) => Math.round(e5) + `\xB0`), this.slider(a, `Camera Shake`, `shakeScale`, 0, 2, 0.05, (e5) => Math.round(e5 * 100) + `%`), this.settingToggle(a, `High Contrast HUD`, `hudContrast`), this.settingToggle(a, `Confirm Edit on Release`, `editConfirmOnRelease`), this.settingToggle(a, `Reset Selection on Release`, `editResetOnRelease`), this.segmented(a, `Graphics`, `quality`, [[`low`, `LOW`], [`medium`, `MED`], [`high`, `HIGH`], [`epic`, `EPIC`], [`ultra`, `ULTRA`]]), this.settingToggle(a, `Shadows`, `shadows`), this.settingToggle(a, `Bloom`, `bloom`), this.slider(a, `Render Scale`, `renderScale`, 0.5, 2, 0.05, (e5) => Math.round(e5 * 100) + `%`), this.settingToggle(a, `Show FPS`, `showFps`), this.settingToggle(a, `Damage Numbers`, `damageNumbers`), this.settingToggle(a, `Performance Mode (max 24 bots)`, `performanceMode`);
    let o = r(`MOUSE`);
    this.slider(o, `Sensitivity`, `sensitivity`, 0.1, 3, 0.05, iO), this.slider(o, `ADS Sensitivity`, `adsSensitivity`, 0.1, 2, 0.05, iO), this.settingToggle(o, `Invert Y Axis`, `invertY`), this.slider(o, `Aim Assist`, `aimAssist`, 0, 1, 0.05, rO);
    let h2 = r(`HUD`);
    this.slider(h2, `HUD Scale`, `hudScale`, 0.5, 2, 0.05, (e5) => Math.round(e5 * 100) + `%`), this.segmented(h2, `Colorblind Mode`, `colorblind`, [[`off`, `OFF`], [`deuteranopia`, `DEUT`], [`tritanopia`, `TRIT`]]);
    let s2 = r(`MATCH`);
    this.segmented(s2, `Difficulty`, `difficulty`, [[`easy`, `EASY`], [`normal`, `NORMAL`], [`hard`, `HARD`]]), this.slider(s2, `Bot Count`, `botCount`, 9, 99, 1, (e5) => String(Math.round(e5)));
    let c2 = r(`CONTROLS`);
    this.keybindList(c2);
    let p2 = r(`PARTY`);
    this.partySection(p2);
  }
  partySection(e4) {
    Q(`div`,`party-code-label`,e4,`ONLINE ROOMS`);
    Q(`div`,`party-member`,e4,`Use FRIENDS in the lobby to create or join a real room with a code.`);
    this.btn(`OPEN FRIENDS`, `btn-b btn-sm`, e4, () => this.cb.onOnline());
  }
  keybindList(e4) {
    let t2 = [[`forward`, `Move Forward`], [`back`, `Move Back`], [`left`, `Move Left`], [`right`, `Move Right`], [`jump`, `Jump / Double Jump`], [`sprint`, `Sprint / Sky Dash`], [`crouch`, `Crouch / Slide`], [`interact`, `Interact`], [`reload`, `Reload`], [`wall`, `Build Wall`], [`floor`, `Build Floor`], [`stairs`, `Build Stairs`], [`roof`, `Build Roof`], [`pad`, `Build Launch Pad`], [`switchMat`, `Switch Material`], [`edit`, `Edit Piece`], [`inventory`, `Inventory`], [`map`, `Map`], [`emote`, `Emote`], [`inspect`, `Inspect Weapon`], [`ping`, `Ping`], [`chat`, `Chat`], [`cheats`, `Cheats`]];
    let n2 = (e5) => {
      if (!e5) return `—`;
      let r = { Space: `SPACE`, Tab: `TAB`, Escape: `ESC`, ShiftLeft: `SHIFT`, ShiftRight: `SHIFT`, ControlLeft: `CTRL`, ControlRight: `CTRL`, AltLeft: `ALT`, AltRight: `ALT`, ArrowUp: `↑`, ArrowDown: `↓`, ArrowLeft: `←`, ArrowRight: `→`, CapsLock: `CAPS`, Backquote: '`' }[e5];
      if (r) return r;
      if (e5.startsWith(`Key`)) return e5.slice(3);
      if (e5.startsWith(`Digit`)) return e5.slice(5);
      if (e5.startsWith(`Numpad`)) return `NUM ` + e5.slice(6);
      if (e5.startsWith(`F`) && /^F\d+$/.test(e5)) return e5;
      return e5.toUpperCase();
    };
    for (let [r, i] of t2) {
      let a = Q(`div`, `set-row bind`, e4);
      Q(`span`, `set-label`, a, i);
      let o = Q(`button`, `bind-btn`, a, n2(Sf.s.keybinds[r]));
      o.addEventListener(`click`, () => {
        o.blur(), o.textContent = `...`, o.classList.add(`listening`);
        let s2 = (c) => {
          c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation();
          if (c.code === `Escape`) {
            o.textContent = n2(Sf.s.keybinds[r]);
          } else {
            Sf.s.keybinds[r] = c.code, Sf.save(), o.textContent = n2(c.code);
          }
          o.classList.remove(`listening`), window.removeEventListener(`keydown`, s2, true);
        };
        window.addEventListener(`keydown`, s2, true);
      });
    }
    let s2 = Q(`button`, `bind-reset`, e4, `RESET DEFAULTS`);
    s2.addEventListener(`click`, () => {
      Sf.s.keybinds = { forward: `KeyW`, back: `KeyS`, left: `KeyA`, right: `KeyD`, jump: `Space`, sprint: `ShiftLeft`, crouch: `KeyZ`, interact: `KeyE`, reload: `KeyR`, wall: `KeyQ`, floor: `KeyC`, stairs: `KeyF`, roof: `KeyV`, pad: `KeyT`, switchMat: `KeyX`, edit: `KeyG`, inventory: `KeyI`, map: `Tab`, emote: `KeyB`, cheats: `KeyP`, inspect: `KeyH`, ping: `KeyK`, chat: `Enter` };
      Sf.save(), e4.innerHTML = ``, this.keybindList(e4);
    });
  }
  buildBattlePass(root) {
    const shell=Q(`div`,`c4-pass`,root),hero=Q(`div`,`c4-pass-hero`,shell),copy=Q(`div`,`c4-pass-copy`,hero);
    Q(`div`,`c4-eyebrow`,copy,`CHAPTER 4 • SEASON 1`);Q(`h2`,`c4-pass-heading`,copy,`BATTLE PASS`);
    const name=Q(`div`,`c4-reward-name`,copy,``),type=Q(`div`,`c4-reward-type`,copy,``),state=Q(`p`,`c4-reward-state`,copy,``);
    Q(`div`,`c4-level`,copy,`LEVEL ${Sf.s.bpLevel} / 100   •   ${Sf.s.bpXp||0} / ${Sf.s.bpLevel*100} XP`);
    const claim=Q(`button`,`c4-claim`,copy,``);claim.type=`button`;
    const viewport=Q(`div`,`c4-preview`,hero);const canvas=Q(`canvas`,`c4-preview-canvas`,viewport);canvas.width=360;canvas.height=440;canvas.setAttribute(`aria-label`,`3D battle pass character preview`);
    const note=Q(`span`,`c4-preview-note`,viewport,`3D REWARD PREVIEW`);
    const paging=Q(`div`,`c4-paging`,shell),prev=Q(`button`,`c4-page-button`,paging,`← PREV`),pageLabel=Q(`b`,`c4-page-label`,paging,``),next=Q(`button`,`c4-page-button`,paging,`NEXT →`);const bar=Q(`div`,`c4-rewards`,shell);this.passCanvas=canvas;this.passSelect=0;let page=0;const showPage=()=>{pageLabel.textContent=`PAGE ${page+1} / 10`;prev.disabled=page===0;next.disabled=page===9;for(const b of bar.children)b.style.display=Math.floor(+b.dataset.index/10)===page?``:`none`;};prev.onclick=()=>{if(page>0){page--;showPage();update(page*10);}};next.onclick=()=>{if(page<9){page++;showPage();update(page*10);}};
    const update=(index)=>{this.passSelect=index;const item=bpTiers[index],tier=index+1;name.textContent=item.name;type.textContent=`${item.type.toUpperCase()} • REWARD ${tier}`;state.textContent=Sf.s.bpClaimed.includes(tier)?`CLAIMED`:tier>Sf.s.bpLevel?`Reach level ${tier} to unlock`:!Sf.s.battlePassOwned?`Get the Battle Pass to claim`:`READY TO CLAIM`;claim.disabled=Sf.s.bpClaimed.includes(tier)||tier>Sf.s.bpLevel||!Sf.s.battlePassOwned;claim.textContent=Sf.s.bpClaimed.includes(tier)?`CLAIMED`:`CLAIM REWARD`;for(const b of bar.children)b.classList.toggle(`selected`,+b.dataset.index===index);this.setPassPreview(item.type===`skin`?item.id:`starlight`);};
    claim.onclick=()=>{const tier=this.passSelect+1,item=bpTiers[this.passSelect];if(claim.disabled)return;Sf.set(`bpClaimed`,[...Sf.s.bpClaimed,tier]);if(item.type===`bbucks`)Sf.set(`bbucks`,Sf.s.bbucks+100);else Sf.set(`shopOwned`,[...new Set([...Sf.s.shopOwned,item.id])]);this.syncBBucks();update(this.passSelect);};
    for(let i=0;i<bpTiers.length;i++){const item=bpTiers[i],button=Q(`button`,`c4-reward`,bar);button.dataset.index=i;button.type=`button`;button.innerHTML=`<b>${i+1}</b><span></span><small>${item.type.toUpperCase()}</small>`;button.querySelector(`span`).textContent=item.name;if(Sf.s.bpClaimed.includes(i+1))button.classList.add(`claimed`);if(i+1>Sf.s.bpLevel)button.classList.add(`locked`);button.onclick=()=>update(i);}
    const footer=Q(`div`,`c4-pass-footer`,shell);if(!Sf.s.battlePassOwned){const buy=this.btn(`GET BATTLE PASS • 900 B-BUCKS`,`btn-y`,footer,()=>{if(Sf.s.bbucks<900)return;Sf.set(`bbucks`,Sf.s.bbucks-900);Sf.set(`battlePassOwned`,true);this.syncBBucks();root.innerHTML=``;this.stopPassPreview();this.buildBattlePass(root);this.startPassPreview();});buy.disabled=Sf.s.bbucks<900;}else Q(`b`,``,footer,`BATTLE PASS OWNED`);
    Q(`span`,``,footer,`SIMULATED CURRENCY • 100 REWARDS`);showPage();update(0);
  }
  setPassPreview(id){this.passSkin=id;if(!this.passScene)return;if(this.passCharacter){this.passScene.remove(this.passCharacter.root);this.passCharacter.dispose();}const skin=xC.find(s=>s.id===id)||xC[0];this.passCharacter=new NT(skin);this.passScene.add(this.passCharacter.root);this.passCharacter.root.rotation.y=Math.PI+.35;}
  startPassPreview(){if(!this.passCanvas||this.passRenderer)return;try{this.passRenderer=new vf({canvas:this.passCanvas,alpha:true,antialias:true});this.passRenderer.setPixelRatio(1);this.passRenderer.setSize(360,440,false);this.passRenderer.outputColorSpace=He;this.passScene=new Un();this.passScene.add(new Ic(0xffffff,2));const light=new Fc(0xc9efff,2.8);light.position.set(3,5,4);this.passScene.add(light);this.passCamera=new Oc(32,360/440,.1,100);this.passCamera.position.set(0,1.15,4.3);this.passCamera.lookAt(0,1,0);this.setPassPreview(this.passSkin||`starlight`);const loop=()=>{if(!this.passRenderer)return;this.passCharacter.root.rotation.y+=.006;this.passRenderer.render(this.passScene,this.passCamera);this.passRaf=requestAnimationFrame(loop);};loop();}catch(e){this.passCanvas.style.display=`none`;this.passCanvas.parentElement.querySelector(`.c4-preview-note`).textContent=`3D preview unavailable on this device`;}}
  stopPassPreview(){if(this.passRaf)cancelAnimationFrame(this.passRaf);if(this.passCharacter){this.passCharacter.dispose();this.passCharacter=null;}if(this.passRenderer){this.passRenderer.dispose();this.passRenderer.forceContextLoss();this.passRenderer=null;}this.passScene=null;}

  syncBBucks() {
    let e4 = document.querySelector(`.bbucks-val`);
    e4 && (e4.textContent = Sf.s.bbucks);
  }
  toggleFriends() {
    this.friendsEl.classList.toggle(`open`);
    this.cb.onUiSound(`click`);
  }
  buildWeekly(e4) {
    let t2 = Q(`div`, `bp-weekly`, e4);
    Q(`div`, `panel-title`, t2, `WEEKLY CHALLENGES`), Q(`div`, `bp-buy-sub`, t2, `Complete challenges to earn Battle Pass XP`);
    let n2 = Sf.s.stats || {}, r = Sf.s.weeklyClaimed || [], i = [
      [`Eliminate 50 players total`, (n2.kills || 0) >= 50],
      [`Play 10 matches`, (n2.matches || 0) >= 10],
      [`Win a match`, (n2.wins || 0) >= 1],
      [`Deal 5000 total damage`, (n2.damage || 0) >= 5e3],
      [`Survive 300 seconds in one match`, (n2.bestTime || 0) >= 300]
    ];
    for (let [a, o] of i) {
      let s2 = Q(`div`, `wk-row`, t2), c = r.includes(a);
      Q(`span`, `wk-name`, s2, a), Q(`b`, `wk-xp`, s2, `+250 XP`);
      c ? Q(`span`, `wk-done`, s2, `CLAIMED`) : o ? this.btn(`CLAIM`, `btn-y btn-sm`, s2, () => {
        Sf.set(`weeklyClaimed`, [...r, a]), G.gainXp(250), this.cb.onUiSound(`play`), this.setTab(`battlepass`, true);
      }) : Q(`span`, `wk-lock`, s2, `IN PROGRESS`);
    }
  }
  buildFriends() {
    let e4 = this.friendsEl;
    e4.innerHTML = ``;
    Q(`div`, `friends-title`, e4, `FRIENDS`);
    let t2 = Q(`div`, `friends-add`, e4);
    let n2 = Q(`input`, `friends-input`, t2);
    n2.placeholder = `Enter username...`;
    n2.maxLength = 16;
    let r = this.btn(`ADD`, `btn-y`, t2, () => {
      let i = n2.value.trim();
      if (i && !Sf.s.friends?.includes(i)) {
        let a = [...(Sf.s.friends || []), i];
        Sf.set(`friends`, a), this.cb.onUiSound(`play`), this.buildFriends();
      } else {
        this.cb.onUiSound(`deny`);
      }
    });
    let o = Q(`div`, `friends-list`, e4);
    let s2 = Sf.s.friends || [];
    if (s2.length === 0) {
      Q(`div`, `friends-empty`, o, `No friends yet. Add someone by username!`);
    }
    for (let c of s2) {
      let l2 = Q(`div`, `friend-row`, o);
      Q(`span`, `friend-name`, l2, c);
      Q(`span`, `friend-status`, l2, `OFFLINE`);
      this.btn(`INVITE`, `btn-b btn-sm`, l2, () => {
        this.cb.onUiSound(`play`);
        Q(`span`, `friend-status`, l2, `INVITED`);
      });
      this.btn(`SPECTATE`, `btn-b btn-sm`, l2, () => {
        this.cb.onUiSound(`click`), G.spectateFriend(c);
      });
      this.btn(`✕`, `btn-r btn-sm`, l2, () => {
        let u = (Sf.s.friends || []).filter((d) => d !== c);
        Sf.set(`friends`, u), this.buildFriends();
      });
    }
  }
  // ===== SHOP =====
  buildShop() {
    let e4 = this.shopEl;
    if (!e4) return;
    e4.innerHTML = ``;
    const seed=Math.floor(Date.now()/3600000);this.shopHour=seed;
    let clock=Q(`div`,`shop-countdown`,e4);const sec=Math.ceil(((seed+1)*3600000-Date.now())/1000);clock.textContent=`NEXT ROTATION IN ${Math.floor(sec/60)}:${String(sec%60).padStart(2,`0`)}`;
    let items = [
      { id: `nova`, name: `Nova`, type: `OUTFIT`, price: 1500, color: `#00e5ff` },
      { id: `vortex`, name: `Vortex`, type: `OUTFIT`, price: 1500, color: `#7b2fff` },
      { id: `phoenix`, name: `Phoenix`, type: `OUTFIT`, price: 1500, color: `#ff8c1a` },
      { id: `ghost`, name: `Ghost`, type: `OUTFIT`, price: 1200, color: `#e8ecf1` },
      { id: `storm`, name: `Storm`, type: `OUTFIT`, price: 1200, color: `#4a90e2` },
      { id: `lunar`, name: `Lunar`, type: `OUTFIT`, price: 1500, color: `#c8b8ff` },
      { id: `solar`, name: `Solar`, type: `OUTFIT`, price: 1500, color: `#ffd700` },
      { id: `echo`, name: `Echo`, type: `OUTFIT`, price: 1200, color: `#3ce0c0` },
      { id: `gold`, name: `Gold Wrap`, type: `GUN WRAP`, price: 500, color: `#f2c230` },
      { id: `galaxy`, name: `Galaxy Wrap`, type: `GUN WRAP`, price: 500, color: `#8a4fe0` },
      { id: `dragon`, name: `Dragon Glider`, type: `GLIDER`, price: 800, color: `#e8402e` },
      { id: `phoenix`, name: `Phoenix Glider`, type: `GLIDER`, price: 800, color: `#ff8c1a` },
      { id: `scythe`, name: `Reaper Scythe`, type: `PICKAXE`, price: 800, color: `#8a4fe0` },
      { id: `frost`, name: `Frost Blade`, type: `PICKAXE`, price: 800, color: `#b8f7ff` }
    ];
    items.push(...chapterFourOutfits.slice(0,8).map(id=>{const sk=xC.find(x=>x.id===id);return {id,name:sk.name,type:`OUTFIT`,price:1200,color:sk.color};}));
    let picks = [];
    for (let i = 0; i < 6; i++) picks.push(items[((seed*7)%items.length+i*3)%items.length]);
    for (let it of picks) {
      let owned = Sf.s.shopOwned.includes(it.id);
      let row = Q(`div`, `shop-item`, e4);
      let sw = Q(`span`, `shop-sw`, row);
      sw.style.setProperty(`--c`, it.color);
      Q(`span`, `shop-name`, row, it.name);
      Q(`span`, `shop-type`, row, it.type);
      let btn = Q(`button`, `shop-buy` + (owned ? ` owned` : ``), row, owned ? `OWNED` : `${it.price} B-BUCKS`);
      btn.disabled = owned || Sf.s.bbucks < it.price;
      btn.addEventListener(`click`, () => {
        if (Sf.s.bbucks < it.price) return;
        Sf.set(`bbucks`, Sf.s.bbucks - it.price);
        Sf.set(`shopOwned`, [...Sf.s.shopOwned, it.id]);
        if (it.type === `OUTFIT`) { Sf.set(`skin`, it.id); this.cb.onSkin(it.id); }
        else { const slot={"GUN WRAP":`wrap`,GLIDER:`glider`,PICKAXE:`pickaxe`}[it.type]; if(slot) Sf.set(slot,it.id); }
        this.cb.onUiSound(`play`);
        this.syncBBucks();
        this.buildShop();
      });
    }
  }
  // ===== QUESTS =====
  buildQuests() {
    let e4 = this.questEl;
    if (!e4) return;
    e4.innerHTML = ``;
    let today = new Date().toISOString().slice(0, 10);
    if (Sf.s.quests.date !== today) {
      let templates = [
        { text: `Get 3 eliminations`, stat: `kills`, target: 3, reward: 50 },
        { text: `Deal 500 damage`, stat: `damage`, target: 500, reward: 75 },
        { text: `Play 2 matches`, stat: `matches`, target: 2, reward: 50 },
        { text: `Get 1 Victory Royale`, stat: `wins`, target: 1, reward: 150 },
        { text: `Survive 5 minutes total`, stat: `time`, target: 300, reward: 60 },
        { text: `Get 5 eliminations`, stat: `kills`, target: 5, reward: 100 },
        { text: `Deal 1000 damage`, stat: `damage`, target: 1000, reward: 120 }
      ];
      let seed = today.split(`-`).reduce((a, b) => a + +b, 0);
      let list = [];
      for (let i = 0; i < 3; i++) list.push(templates[(seed + i * 2) % templates.length]);
      Sf.set(`quests`, { date: today, list, claimed: [] });
    }
    let q = Sf.s.quests;
    for (let i = 0; i < q.list.length; i++) {
      let quest = q.list[i];
      let progress = Math.min(Sf.s.stats[quest.stat] || 0, quest.target);
      let done = progress >= quest.target;
      let claimed = q.claimed.includes(i);
      let row = Q(`div`, `quest-row` + (done ? ` done` : ``), e4);
      Q(`span`, `quest-text`, row, quest.text);
      Q(`span`, `quest-prog`, row, `${progress} / ${quest.target}`);
      let btn = Q(`button`, `quest-claim` + (claimed ? ` claimed` : ``), row, claimed ? `CLAIMED` : done ? `CLAIM +1 LEVEL` : `IN PROGRESS`);
      btn.disabled = !done || claimed;
      btn.addEventListener(`click`, () => {
        Sf.set(`quests`, { ...q, claimed: [...q.claimed, i] });
        G.gainXp(Sf.s.bpLevel*100);
        this.cb.onUiSound(`play`);
        this.syncBBucks();
        this.buildQuests();
      });
    }
  }
  // ===== STATS =====
  buildStats() {
    let e4 = this.statsEl;
    if (!e4) return;
    e4.innerHTML = ``;
    let s = Sf.s.stats;
    let kd = s.deaths > 0 ? (s.kills / s.deaths).toFixed(2) : s.kills.toFixed(2);
    let winRate = s.matches > 0 ? ((s.wins / s.matches) * 100).toFixed(1) : `0.0`;
    // Ranked section
    let elo = Sf.s.elo;
    let ranks = [[0, `BRONZE`, `#cd7f32`], [1000, `SILVER`, `#c0c0c0`], [1200, `GOLD`, `#ffd700`], [1400, `PLATINUM`, `#7fffd4`], [1600, `DIAMOND`, `#b9f2ff`], [1800, `CHAMPION`, `#ff6b9d`]];
    let cur = ranks[0];
    for (let r of ranks) if (elo >= r[0]) cur = r;
    let next = ranks[ranks.indexOf(cur) + 1];
    let rankHead = Q(`div`, `ranked-head`, e4);
    let badge = Q(`div`, `rank-badge`, rankHead, cur[1]);
    badge.style.setProperty(`--rc`, cur[2]);
    Q(`div`, `rank-elo`, rankHead, `${elo} ELO`);
    if (next) Q(`div`, `rank-next`, rankHead, `Next: ${next[1]} at ${next[0]} ELO`);
    else Q(`div`, `rank-next`, rankHead, `MAX RANK REACHED!`);
    Q(`div`, `rank-matches`, rankHead, `${Sf.s.rankedMatches} ranked matches played`);
    let toggle = Q(`button`, `ranked-toggle` + (Sf.s.ranked ? ` on` : ``), e4, Sf.s.ranked ? `RANKED: ON` : `RANKED: OFF`);
    toggle.addEventListener(`click`, () => {
      Sf.set(`ranked`, !Sf.s.ranked);
      this.cb.onUiSound(`click`);
      this.buildStats();
    });
    Q(`div`, `ranked-info`, e4, `Earn ELO by placing high and getting eliminations. Lose ELO for early deaths.`);
    // Stats rows
    let rows = [
      [`MATCHES PLAYED`, s.matches],
      [`VICTORIES`, s.wins],
      [`WIN RATE`, winRate + `%`],
      [`TOTAL ELIMINATIONS`, s.kills],
      [`K/D RATIO`, kd],
      [`TOTAL DAMAGE`, s.damage],
      [`DEATHS`, s.deaths]
    ];
    for (let [label, val] of rows) {
      let row = Q(`div`, `stat-row`, e4);
      Q(`span`, `stat-label`, row, label);
      Q(`span`, `stat-val`, row, String(val));
    }
  }
  // ===== RANKED (removed - merged into Stats) =====
  buildRanked() {
    let e4 = this.rankedEl;
    if (!e4) return;
    e4.innerHTML = ``;
    let elo = Sf.s.elo;
    let ranks = [[0, `BRONZE`, `#cd7f32`], [1000, `SILVER`, `#c0c0c0`], [1200, `GOLD`, `#ffd700`], [1400, `PLATINUM`, `#7fffd4`], [1600, `DIAMOND`, `#b9f2ff`], [1800, `CHAMPION`, `#ff6b9d`]];
    let cur = ranks[0];
    for (let r of ranks) if (elo >= r[0]) cur = r;
    let next = ranks[ranks.indexOf(cur) + 1];
    let head = Q(`div`, `ranked-head`, e4);
    let badge = Q(`div`, `rank-badge`, head, cur[1]);
    badge.style.setProperty(`--rc`, cur[2]);
    Q(`div`, `rank-elo`, head, `${elo} ELO`);
    if (next) Q(`div`, `rank-next`, head, `Next: ${next[1]} at ${next[0]} ELO`);
    else Q(`div`, `rank-next`, head, `MAX RANK REACHED!`);
    Q(`div`, `rank-matches`, head, `${Sf.s.rankedMatches} ranked matches played`);
    let toggle = Q(`button`, `ranked-toggle` + (Sf.s.ranked ? ` on` : ``), e4, Sf.s.ranked ? `RANKED: ON` : `RANKED: OFF`);
    toggle.addEventListener(`click`, () => {
      Sf.set(`ranked`, !Sf.s.ranked);
      this.cb.onUiSound(`click`);
      this.buildRanked();
    });
    Q(`div`, `ranked-info`, e4, `Earn ELO by placing high and getting eliminations. Lose ELO for early deaths.`);
  }
  // ===== PARTY =====
  slider(e4, t2, n2, r, i, a, o) {
    let s2 = n2 === `master` || n2 === `sfx` || n2 === `ambience` || n2 === `ui`, c = Q(`div`, s2 ? `set-row vol` : `set-row`, e4), l2 = Q(`span`, `set-label`, c), u = null;
    if (s2) {
      u = Q(`span`, `vol-meter`, l2);
      for (let e5 = 0; e5 < 4; e5++) Q(`i`, ``, u);
    }
    Q(`span`, ``, l2, t2);
    let d = Q(`input`, `range`, c);
    d.type = `range`, d.tabIndex = -1, d.min = String(r), d.max = String(i), d.step = String(a);
    let f = Q(`span`, `set-val`, c), p = () => {
      let e5 = Sf.s[n2];
      Number(d.value) !== e5 && (d.value = String(e5));
      let t3 = tD((e5 - r) / (i - r), 0, 1);
      d.style.setProperty(`--p`, (t3 * 100).toFixed(1) + `%`), f.textContent = o(e5), u && (u.dataset.l = String(t3 <= 0 ? 0 : Math.min(4, 1 + Math.floor(t3 * 3.999))));
    };
    d.addEventListener(`input`, () => Sf.set(n2, Number(d.value))), d.addEventListener(`focus`, (e5) => {
      let t3 = e5.relatedTarget;
      this.focusBack = t3 instanceof HTMLElement && !this.root.contains(t3) ? t3 : null;
    }), d.addEventListener(`pointerup`, () => window.setTimeout(this.releaseFocus, 0)), d.addEventListener(`change`, () => {
      this.releaseFocus(), n2 === `sfx` ? (W.init(), W.play(`pickup`, { volume: 0.8 })) : this.cb.onUiSound(`click`);
    }), this.onSync(n2, p), p();
  }
  segmented(e4, t2, n2, r) {
    let i = Q(`div`, `set-row`, e4);
    Q(`span`, `set-label`, i, t2);
    let a = Q(`div`, `seg`, i), o = [];
    for (let [e5, t3] of r) {
      let r2 = oO(Q(`button`, ``, a));
      r2.type = `button`, Q(`span`, ``, r2, t3), r2.addEventListener(`mouseenter`, () => this.cb.onUiSound(`hover`)), r2.addEventListener(`click`, () => {
        this.cb.onUiSound(`click`), Sf.set(n2, e5);
      }), o.push({ value: e5, root: r2 });
    }
    let s2 = () => {
      for (let e5 of o) e5.root.classList.toggle(`on`, e5.value === Sf.s[n2]);
    };
    this.onSync(n2, s2), s2();
  }
  settingToggle(e4, t2, n2) {
    this.toggle(e4, t2, n2, () => Sf.s[n2], (e5) => Sf.set(n2, e5));
  }
  toggle(e4, t2, n2, r, i, a) {
    let o = oO(Q(`button`, `set-row tog`, e4));
    o.type = `button`;
    let s2 = Q(`span`, `set-label`, o, t2);
    a && Q(`small`, ``, s2, a), Q(`i`, ``, Q(`span`, `switch`, o));
    let c = () => {
      o.classList.toggle(`on`, r());
    };
    o.addEventListener(`mouseenter`, () => this.cb.onUiSound(`hover`)), o.addEventListener(`click`, () => {
      this.cb.onUiSound(`click`), i(!r());
    }), this.onSync(n2, c), c();
  }
  spawnConfetti() {
    let e4 = document.createDocumentFragment();
    for (let t2 = 0; t2 < 80; t2++) {
      let n2 = document.createElement(`i`), r = n2.style;
      r.setProperty(`--x`, (Math.random() * 100).toFixed(1) + `%`), r.setProperty(`--dx`, ((Math.random() - 0.5) * 28).toFixed(1) + `vw`), r.setProperty(`--d`, (3.2 + Math.random() * 3.4).toFixed(2) + `s`), r.setProperty(`--l`, (-Math.random() * 6.5).toFixed(2) + `s`), r.setProperty(`--r`, (Math.random() < 0.5 ? -1 : 1) * Math.round(360 + Math.random() * 1080) + `deg`), r.setProperty(`--w`, (0.7 + Math.random() * 0.9).toFixed(2)), r.setProperty(`--c`, nO[t2 % nO.length]), e4.appendChild(n2);
    }
    this.confetti.replaceChildren(e4);
  }
  spawnStars() {
    let e4 = document.createDocumentFragment();
    for (let t2 = 0; t2 < 14; t2++) {
      let n2 = t2 / 14 * Math.PI * 2 + Math.random() * 0.3, r = 26 + Math.random() * 22, i = eD(dD.star, ``, null), a = i.style;
      a.setProperty(`--tx`, `calc(var(--u) * ${(Math.cos(n2) * r * 1.7).toFixed(1)})`), a.setProperty(`--ty`, `calc(var(--u) * ${(Math.sin(n2) * r * 0.6).toFixed(1)})`), a.setProperty(`--s`, (1.6 + Math.random() * 2).toFixed(2)), a.setProperty(`--dl`, (0.6 + Math.random() * 2.4).toFixed(2) + `s`), e4.appendChild(i);
    }
    this.stars.replaceChildren(e4);
  }
}, uO = class {
  mesh = null;
  parent;
  hm;
  albedo;
  uni = { uPatch: { value: 64 } };
  constructor(e4, t2, n2) {
    this.parent = e4, this.hm = t2, this.albedo = n2;
  }
  rebuild(e4, t2) {
    if (this.mesh &&= (this.parent.remove(this.mesh), this.mesh.geometry.dispose(), this.mesh.material.dispose(), null), e4 <= 0) return;
    this.uni.uPatch.value = t2;
    let n2 = [], r = [];
    for (let e5 = 0; e5 < 2; e5++) {
      let t3 = e5 * 1.75 + 0.3, i2 = Math.cos(t3), a2 = Math.sin(t3), o2 = (e5 - 0.5) * 0.1, s3 = (e5 - 0.5) * -0.07, c2 = n2.length / 3, l3 = (e5 - 0.5) * 0.22;
      for (let [e6, t4] of [[-1, 0], [1, 0], [-0.66, 0.5], [0.66, 0.5], [0, 1]]) {
        let r2 = e6 * 0.5;
        n2.push(o2 + i2 * r2 + l3 * t4 * t4, t4, s3 + a2 * r2 + l3 * t4 * t4 * 0.5);
      }
      r.push(c2, c2 + 1, c2 + 2, c2 + 1, c2 + 3, c2 + 2, c2 + 2, c2 + 3, c2 + 4);
    }
    let i = new Rc();
    i.setAttribute(`position`, new V(n2, 3)), i.setAttribute(`normal`, new V(new Float32Array(n2.length).map((e5, t3) => +(t3 % 3 == 1)), 3)), i.setIndex(r);
    let a = new jp(4242), o = new Float32Array(e4 * 2), s2 = new Float32Array(e4 * 4), c = Math.ceil(Math.sqrt(e4)), l2 = t2 / c;
    for (let t3 = 0; t3 < e4; t3++) {
      let e5 = t3 % c, n3 = Math.floor(t3 / c);
      o[t3 * 2] = (e5 + a.next()) * l2, o[t3 * 2 + 1] = (n3 + a.next()) * l2, s2[t3 * 4] = a.range(0, Math.PI * 2), s2[t3 * 4 + 1] = a.range(0.55, 1.25), s2[t3 * 4 + 2] = a.range(0.8, 1.3), s2[t3 * 4 + 3] = a.next();
    }
    i.setAttribute(`aOff`, new Xi(o, 2)), i.setAttribute(`aPar`, new Xi(s2, 4)), i.instanceCount = e4, i.boundingSphere = new Pr(new R(), 1e6);
    let u = new As({ side: 2 });
    u.onBeforeCompile = (e5) => {
      Object.assign(e5.uniforms, { uHM: { value: this.hm }, uAlb: { value: this.albedo }, uNoise: Z.uNoise, uTime: Z.uTime, uCam: Z.uCam, uPlayer: Z.uPlayer, uWind: Z.uWind, uPatch: this.uni.uPatch }), e5.vertexShader = e5.vertexShader.replace(`#include <common>`, `#include <common>
          attribute vec2 aOff; attribute vec4 aPar;
          uniform sampler2D uHM; uniform sampler2D uAlb; uniform sampler2D uNoise;
          uniform float uTime; uniform vec3 uCam; uniform vec3 uPlayer; uniform vec2 uWind; uniform float uPatch;
          varying vec3 vGCol; varying float vTip; varying vec2 vWxz; varying float vRand; varying float vGust;`).replace(`#include <beginnormal_vertex>`, `vec3 objectNormal = vec3(0.0, 1.0, 0.0);`).replace(`#include <begin_vertex>`, `
          vec2 wp = mod(aOff - uCam.xz, uPatch) + uCam.xz - uPatch * 0.5;
          vec2 huv = wp / ${800 .toFixed(1)} + 0.5;
          vec4 hm = texture2D(uHM, huv);
          float dist = length(wp - uCam.xz);
          float sc = smoothstep(0.35, 0.7, hm.g) * (1.0 - smoothstep(uPatch * 0.34, uPatch * 0.49, dist));
          // from high up (skydiving, gliding, tall roofs) blades are sub-pixel: seen top-down their sunlit tips bloom into a
          // glowing smear with AO specks, so the patch fades out with the camera's height above the ground
          sc *= 1.0 - smoothstep(20.0, 38.0, uCam.y - hm.r);
          float ca = cos(aPar.x), sa = sin(aPar.x);
          vec3 lp = vec3(position.x * ca - position.z * sa, position.y, position.x * sa + position.z * ca);
          float hgt = (0.17 + 0.2 * aPar.y) * sc;
          float t = position.y;
          // collapse culled tufts to zero area (a flat blade left on the ground pokes through slopes as a black speck)
          lp.xz *= 0.2 * aPar.z * (0.6 + 0.4 * sc) * step(0.02, sc);
          // wind: rolling gusts from a scrolling noise + a fast flutter
          float gust = texture2D(uNoise, wp * 0.012 + uWind * uTime * 0.035).r;
          float flut = sin(uTime * 3.3 + wp.x * 1.7 + wp.y * 1.3 + aPar.w * 6.28);
          vec2 bend = uWind * ((gust - 0.35) * 0.42 + flut * 0.03) * t * t;
          // lean away from the player
          vec2 pd = wp - uPlayer.xz;
          float pl = length(pd);
          float push = (1.0 - smoothstep(0.25, 1.25, pl)) * step(abs(uPlayer.y - hm.r), 1.6);
          bend += (pd / max(pl, 0.05)) * push * 0.34 * t;
          vec3 transformed = vec3(wp.x + lp.x + bend.x, hm.r + t * hgt * (1.0 - push * 0.45) - 0.02, wp.y + lp.z + bend.y);
          // same painterly hue drift as the terrain shader so blades and ground agree
          float hN = texture2D(uNoise, wp * 0.043).b * 0.6 + texture2D(uNoise, wp * 0.21).b * 0.4;
          vGCol = texture2D(uAlb, huv).rgb * mix(vec3(0.90, 0.98, 1.06), vec3(1.08, 1.05, 0.84), smoothstep(0.3, 0.7, hN) * 0.7 + 0.15);
          vTip = t; vWxz = wp; vRand = aPar.w;
          // a gust bends the blades over and shows their paler, sunlit sides: bright waves rolling across the field
          vGust = smoothstep(0.5, 0.78, gust);`), e5.fragmentShader = e5.fragmentShader.replace(`#include <common>`, `#include <common>
          varying vec3 vGCol; varying float vTip; varying vec2 vWxz; varying float vRand; varying float vGust;
          ${_E}`).replace(`#include <color_fragment>`, `
          vec3 gc = vGCol * mix(0.62, 1.1, vTip * vTip * (3.0 - 2.0 * vTip)) + vec3(0.01, 0.018, 0.0) * vTip;
          gc *= 0.9 + 0.2 * vRand;
          // a few flower heads
          float fl = step(0.988, vRand) * smoothstep(0.72, 0.9, vTip);
          vec3 fcol = mix(vec3(1.0, 0.95, 0.9), mix(vec3(1.0, 0.82, 0.15), vec3(1.0, 0.45, 0.75), step(0.996, vRand)), step(0.992, vRand));
          gc = mix(gc, fcol, fl);
          gc *= 1.0 + vGust * vTip * vec3(0.30, 0.26, 0.12);
          diffuseColor.rgb = gc * cloudTint(vWxz);`).replace(`#include <normal_fragment_begin>`, `vec3 normal = normalize(vNormal);
vec3 nonPerturbedNormal = normal;`);
    }, this.mesh = new Mi(i, u), this.mesh.frustumCulled = false, this.mesh.receiveShadow = true, this.mesh.matrixAutoUpdate = false, this.parent.add(this.mesh);
  }
};
function dO(e4, t2, n2, r, i, a, o, s2 = true, c = 1) {
  return { id: e4, size: [t2, n2, r], mat: i, hp: a, yield: o, solid: s2, variants: c };
}
var fO = { officeDesk: dO(`officeDesk`,1.5,1.35,.8,`wood`,120,15), workshopBench: dO(`workshopBench`,1.7,1.3,.8,`metal`,160,20), serverRack: dO(`serverRack`,.85,1.8,.5,`metal`,160,20), interiorBed: dO(`interiorBed`, 1.4, 1, 2.1, `wood`, 150, 20), interiorTable: dO(`interiorTable`, 1.5, 1.2, 1, `wood`, 100, 15), interiorShelf: dO(`interiorShelf`, 1.15, 1.7, .4, `wood`, 120, 15), interiorSofa: dO(`interiorSofa`, 1.7, 1.1, .9, `wood`, 120, 15), sanctuaryArch: dO(`sanctuaryArch`, 8, 7.2, 1.7, `stone`, 600, 50), bugleSign: dO(`bugleSign`, 7.5, 5.8, .5, `metal`, 500, 40), cuddleMascot: dO(`cuddleMascot`, 3, 4.5, 3, `wood`, 350, 30), desertWindmill: dO(`desertWindmill`, 4, 9.5, 1, `metal`, 400, 40), car: dO(`car`, 1.9, 1.5, 4.4, `metal`, 400, 40, true, 5), truck: dO(`truck`, 2, 1.85, 5.2, `metal`, 450, 45, true, 3), tractor: dO(`tractor`, 2, 2.6, 3.6, `metal`, 400, 40, true, 2), container: dO(`container`, 2.5, 2.6, 6.1, `metal`, 600, 60, true, 5), dumpster: dO(`dumpster`, 2, 1.3, 1.2, `metal`, 300, 30), barrel: dO(`barrel`, 0.62, 0.9, 0.62, `metal`, 250, 12, true, 3), crate: dO(`crate`, 1, 1, 1, `wood`, 100, 20), pallet: dO(`pallet`, 1.2, 0.45, 1, `wood`, 60, 15), tires: dO(`tires`, 0.85, 0.88, 0.85, `metal`, 250, 10), haybale: dO(`haybale`, 1.3, 1.5, 1.5, `wood`, 80, 15), silo: dO(`silo`, 4.5, 12, 4.5, `metal`, 600, 60, true, 2), watertower: dO(`watertower`, 4.2, 12, 4.2, `metal`, 600, 60), logpile: dO(`logpile`, 3, 1.64, 1.9, `wood`, 200, 40), stump: dO(`stump`, 0.85, 0.6, 0.85, `wood`, 60, 10, false), lamp: dO(`lamp`, 0.3, 5.3, 0.3, `metal`, 250, 12), bench: dO(`bench`, 1.8, 0.9, 0.6, `wood`, 80, 15), mailbox: dO(`mailbox`, 0.3, 1.3, 0.55, `wood`, 60, 6), hydrant: dO(`hydrant`, 0.45, 0.8, 0.45, `metal`, 250, 10), fence: dO(`fence`, 2.5, 1, 0.12, `wood`, 60, 12), picnic: dO(`picnic`, 1.8, 0.78, 1.56, `wood`, 120, 25), umbrella: dO(`umbrella`, 2.5, 2.35, 2.5, `wood`, 80, 10, false, 3), boat: dO(`boat`, 1.4, 0.66, 3.4, `wood`, 150, 30), campfire: dO(`campfire`, 1.2, 0.7, 1.2, `stone`, 100, 10, false), tent: dO(`tent`, 2.2, 1.5, 2.6, `wood`, 100, 15, true, 3), billboard: dO(`billboard`, 6, 6, 0.6, `wood`, 300, 45, true, 3), windmill: dO(`windmill`, 2.3, 11, 2.3, `metal`, 400, 40), clocktower: dO(`clocktower`, 7.6, 23.1, 7.6, `stone`, 1e9, 80), fountain: dO(`fountain`, 7.4, 0.84, 7.4, `stone`, 1e9, 40), awning: dO(`awning`, 4.4, 3.4, 1.8, `wood`, 100, 10, false, 4), blade: dO(`blade`, 0.4, 5, 1.7, `metal`, 150, 10, false, 6), roofsign: dO(`roofsign`, 16.6, 8.5, 1.6, `metal`, 600, 40, false), rooftank: dO(`rooftank`, 2.8, 6.6, 2.8, `wood`, 400, 40), acunit: dO(`acunit`, 2.3, 1.25, 1.5, `metal`, 250, 20), trafficlight: dO(`trafficlight`, 0.34, 5.7, 0.34, `metal`, 250, 12), busstop: dO(`busstop`, 4.4, 2.75, 1.7, `metal`, 300, 25), cafe: dO(`cafe`, 2.6, 2.5, 2.6, `wood`, 80, 10, false, 3), planter: dO(`planter`, 2.3, 0.76, 2.3, `stone`, 300, 20), plazalamp: dO(`plazalamp`, 0.36, 4.3, 0.36, `metal`, 250, 12), kiosk: dO(`kiosk`, 2.6, 2.6, 1.8, `metal`, 300, 25), bollard: dO(`bollard`, 0.36, 1, 0.36, `metal`, 200, 6), rebootvan: dO(`rebootvan`, 2.2, 2.9, 5.2, `metal`, 500, 50, true, 1), piling: dO(`piling`, 0.6, 9, 0.6, `stone`, 1e9, 0, true, 2) }, pO = { clocktower: 15325368, fountain: 15391158, awning: 15221562, blade: 2826568, roofsign: 16765503, rooftank: 11039295, acunit: 14278114, trafficlight: 4015698, busstop: 4165592, cafe: 15221562, planter: 13223357, plazalamp: 2897216, kiosk: 3055191, bollard: 2897216 }, mO = Math.PI, hO = mO / 2, gO = [-1, 1], $ = { tyre: 1776930, rubber: 2500911, black: 1381914, steel: 10727355, steelDark: 5595244, chrome: 13883872, glass: 1782341, glassTop: 5936307, wood: 11827778, woodLight: 14461803, woodDark: 8080939, bark: 6964784, barkDark: 5584936, concrete: 11117980, white: 15987178, headlight: 16773826, tail: 14824235, warm: 16769952 }, _O = (e4, t2, n2) => e4 + (t2 - e4) * n2;
function vO(e4, t2) {
  return e4[t2 % e4.length];
}
function yO(e4, t2) {
  let n2 = e4 >> 16 & 255, r = e4 >> 8 & 255, i = e4 & 255;
  if (t2 <= 1) n2 *= t2, r *= t2, i *= t2;
  else {
    let e5 = Math.min(t2 - 1, 1);
    n2 += (255 - n2) * e5, r += (255 - r) * e5, i += (255 - i) * e5;
  }
  return Math.round(n2) << 16 | Math.round(r) << 8 | Math.round(i);
}
var bO = class {
  p = [];
  tri(e4, t2, n2) {
    return this.p.push(e4[0], e4[1], e4[2], t2[0], t2[1], t2[2], n2[0], n2[1], n2[2]), this;
  }
  quad(e4, t2, n2, r) {
    return this.tri(e4, t2, n2).tri(e4, n2, r);
  }
  geo() {
    let e4 = new Hr();
    return e4.setAttribute(`position`, new V(this.p, 3)), e4.computeVertexNormals(), e4;
  }
};
function xO(e4, t2, n2, r) {
  let i = [[t2[0], e4, t2[2]], [t2[1], e4, t2[2]], [t2[1], e4, t2[3]], [t2[0], e4, t2[3]], [r[0], n2, r[2]], [r[1], n2, r[2]], [r[1], n2, r[3]], [r[0], n2, r[3]]], a = new bO(), o = (e5, t3, n3, r2) => {
    a.quad(i[e5], i[t3], i[n3], i[r2]);
  };
  return o(3, 2, 6, 7), o(1, 0, 4, 5), o(2, 1, 5, 6), o(0, 3, 7, 4), o(7, 6, 5, 4), o(0, 1, 2, 3), a.geo();
}
var SO = new R(), CO = new R(), wO = new R(), TO = new R(0, 1, 0), EO = new It(), DO = new R(1, 1, 1);
function OO(e4, t2) {
  SO.set(e4[0], e4[1], e4[2]), CO.set(t2[0], t2[1], t2[2]), wO.subVectors(CO, SO);
  let n2 = wO.length();
  return EO.setFromUnitVectors(TO, wO.normalize()), SO.add(CO).multiplyScalar(0.5), { m: new z().compose(SO, EO, DO), len: n2 };
}
function kO(e4, t2, n2, r, i, a = r) {
  let o = OO(t2, n2);
  e4.box(r, o.len, a, i, o.m);
}
function AO(e4, t2, n2, r, i, a = 6) {
  let o = OO(t2, n2);
  e4.cyl(r, r, o.len, i, o.m, a);
}
function jO(e4, t2, n2, r, i = 8) {
  e4.add(new za(t2, i), n2, r);
}
function MO(e4, t2, n2, r, i, a, o, s2 = 10) {
  let c = t2 < 0 ? -1 : 1;
  e4.cyl(i, i, a, $.tyre, q(t2, n2, r, 0, 0, hO), s2), e4.cyl(i * 0.58, i * 0.58, 0.05, o, q(t2 + c * a * 0.5, n2, r, 0, 0, hO), 8), e4.cyl(i * 0.2, i * 0.2, 0.08, yO(o, 0.55), q(t2 + c * a * 0.5, n2, r, 0, 0, hO), 5);
}
function NO(e4, t2, n2, r, i, a, o) {
  e4.add(new Ba(i, i, a, 7, 1, false, 0, mO), o, q(t2, n2, r, 0, 0, hO));
}
function PO(e4, t2, n2, r, i, a, o) {
  e4.add(xO(t2, n2, r, i), yO(a, 0.86), void 0, a);
  let s2 = (e5) => [_O(n2[0], i[0], e5), _O(n2[1], i[1], e5), _O(n2[2], i[2], e5), _O(n2[3], i[3], e5)], c = s2(0.16), l2 = s2(0.84), u = _O(t2, r, 0.16), d = _O(t2, r, 0.84), f = 0.025, p = 0.1, m = 0.13;
  if (e4.add(xO(u, [c[0] + p, c[1] - p, c[2] - f, c[3] + f], d, [l2[0] + p, l2[1] - p, l2[2] - f, l2[3] + f]), $.glass, void 0, $.glassTop), e4.add(xO(u, [c[0] - f, c[1] + f, c[2] + m, c[3] - m], d, [l2[0] - f, l2[1] + f, l2[2] + m, l2[3] - m]), $.glass, void 0, $.glassTop), o !== null) {
    let t3 = f * 1.7;
    e4.add(xO(u, [c[0] - t3, c[1] + t3, o - 0.05, o + 0.05], d, [l2[0] - t3, l2[1] + t3, o - 0.05, o + 0.05]), a);
  }
}
var FO = { car: (e4, t2) => {
  let n2 = vO([14826292, 3112416, 16237873, 15855592, 2078886], t2), r = yO(n2, 0.7);
  e4.box(1.5, 0.22, 3.9, $.black, q(0, 0.34, 0)), e4.rbox(1.72, 0.62, 4.3, 0.16, r, q(0, 0.66, 0), n2), PO(e4, 0.93, [-0.8, 0.8, -1.4, 0.95], 1.5, [-0.64, 0.64, -0.95, 0.28], n2, -0.2), e4.rbox(1.76, 0.22, 0.24, 0.08, $.steelDark, q(0, 0.47, 2.08), void 0, 1), e4.rbox(1.76, 0.22, 0.24, 0.08, $.steelDark, q(0, 0.47, -2.08), void 0, 1), e4.box(0.74, 0.16, 0.05, $.black, q(0, 0.7, 2.14)), e4.box(0.42, 0.13, 0.04, $.white, q(0, 0.62, -2.15));
  for (let t3 of gO) {
    for (let n3 of [1.38, -1.38]) NO(e4, t3 * 0.78, 0.36, n3, 0.47, 0.24, $.rubber), MO(e4, t3 * 0.82, 0.36, n3, 0.36, 0.26, $.chrome);
    e4.box(0.32, 0.14, 0.08, $.headlight, q(t3 * 0.56, 0.74, 2.13)), e4.box(0.34, 0.12, 0.08, $.tail, q(t3 * 0.56, 0.76, -2.13)), e4.box(0.14, 0.1, 0.08, r, q(t3 * 0.84, 1.05, 0.72));
    for (let n3 of [0.3, -0.72]) e4.box(0.03, 0.035, 0.14, $.chrome, q(t3 * 0.865, 0.84, n3));
  }
}, truck: (e4, t2) => {
  let n2 = vO([14242859, 2908072, 15328988], t2), r = yO(n2, 0.7);
  e4.box(1.5, 0.3, 4.7, $.black, q(0, 0.47, 0)), e4.rbox(1.84, 0.72, 2.8, 0.16, r, q(0, 0.86, 1.1), n2), PO(e4, 1.18, [-0.84, 0.84, -0.3, 1.2], 1.86, [-0.72, 0.72, -0.24, 0.7], n2, null), e4.box(1.84, 0.72, 0.14, r, q(0, 0.86, -0.3), n2), e4.box(1.84, 0.72, 0.12, r, q(0, 0.86, -2.5), n2), e4.box(1.62, 0.1, 2.2, $.rubber, q(0, 0.74, -1.4)), e4.box(0.3, 0.05, 0.03, $.black, q(0, 1.05, -2.565)), e4.rbox(1.9, 0.26, 0.26, 0.08, $.chrome, q(0, 0.6, 2.47), void 0, 1), e4.rbox(1.9, 0.2, 0.22, 0.07, $.chrome, q(0, 0.52, -2.5), void 0, 1), e4.box(1, 0.3, 0.05, $.black, q(0, 0.96, 2.49)), e4.box(1, 0.035, 0.06, $.chrome, q(0, 0.96, 2.49));
  for (let t3 of gO) {
    e4.box(0.12, 0.72, 2.34, r, q(t3 * 0.86, 0.86, -1.39), n2), e4.box(0.16, 0.05, 2.34, $.black, q(t3 * 0.86, 1.235, -1.39)), e4.box(0.2, 0.22, 1, $.rubber, q(t3 * 0.72, 0.86, -1.55));
    for (let n3 of [1.55, -1.55]) NO(e4, t3 * 0.82, 0.44, n3, 0.56, 0.26, $.rubber), MO(e4, t3 * 0.84, 0.44, n3, 0.44, 0.3, $.chrome);
    e4.box(0.3, 0.2, 0.08, $.headlight, q(t3 * 0.68, 0.98, 2.48)), e4.box(0.1, 0.3, 0.05, $.tail, q(t3 * 0.86, 0.95, -2.57)), e4.box(0.16, 0.14, 0.08, $.black, q(t3 * 0.9, 1.3, 0.95));
  }
}, tractor: (e4, t2) => {
  let n2 = vO([4168506, 14039599], t2), r = vO([16107059, 15262938], t2), i = yO(n2, 0.68), a = -0.8, o = 1.25;
  e4.box(0.5, 0.4, 2.9, $.steelDark, q(0, 0.7, 0.3)), e4.rbox(0.82, 0.72, 1.95, 0.14, i, q(0, 1.2, 0.8), n2), e4.box(0.85, 0.1, 1.2, r, q(0, 1.32, 0.8)), e4.box(0.6, 0.46, 0.05, $.black, q(0, 1.2, 1.77)), e4.box(1.1, 0.7, 1.3, i, q(0, 1.15, a), n2), e4.box(1.2, 0.12, 0.14, $.steelDark, q(0, 0.42, o)), e4.box(1.2, 0.2, 0.2, $.steelDark, q(0, 0.8, a)), e4.box(0.12, 0.08, 0.3, $.steelDark, q(0, 0.6, -1.52));
  for (let t3 of gO) {
    MO(e4, t3 * 0.78, 0.8, a, 0.8, 0.44, r, 12), MO(e4, t3 * 0.68, 0.42, o, 0.42, 0.26, r);
    for (let r2 of [-0.9, 0, 0.9]) e4.box(0.5, 0.07, 0.86, n2, q(t3 * 0.78, 0.8 + 0.9 * Math.cos(r2), a + 0.9 * Math.sin(r2), r2, 0, 0));
    e4.cyl(0.08, 0.08, 0.06, $.headlight, q(t3 * 0.26, 1.44, 1.775, hO, 0, 0), 6);
    for (let n3 of [-1.4, -0.20000000000000007]) e4.box(0.07, 1.04, 0.07, $.black, q(t3 * 0.52, 2.02, n3));
  }
  e4.rbox(1.3, 0.12, 1.5, 0.05, i, q(0, 2.56, a), n2, 1), e4.box(0.5, 0.1, 0.46, $.black, q(0, 1.55, -0.8500000000000001)), e4.box(0.5, 0.42, 0.1, $.black, q(0, 1.78, -1.1)), AO(e4, [0, 1.5, -0.2], [0, 1.98, -0.42], 0.03, $.steelDark, 5), e4.torus(0.17, 0.025, $.black, OO([0, 1.96, -0.41], [0, 2, -0.43]).m.multiply(q(0, 0, 0, hO, 0, 0)), 4, 8), e4.cyl(0.045, 0.045, 1, $.steelDark, q(0.24, 2, 1.25), 6), e4.cyl(0.06, 0.06, 0.16, $.black, q(0.24, 2.48, 1.25), 6), e4.cyl(0.07, 0.07, 0.3, $.black, q(-0.24, 1.68, 1), 6);
}, container: (e4, t2) => {
  let n2 = vO([2977720, 13123631, 3906135, 15238955, 9147548], t2), r = yO(n2, 0.66), i = yO(n2, 0.8), a = yO(n2, 1.12);
  e4.box(2.36, 2.44, 5.96, r, q(0, 1.3, 0), n2);
  for (let t3 = 0; t3 < 12; t3++) {
    let n3 = -2.64 + t3 * 0.48;
    for (let t4 of gO) e4.box(0.07, 2.24, 0.24, i, q(t4 * 1.195, 1.3, n3), a);
  }
  for (let t3 = 0; t3 < 6; t3++) e4.box(2.2, 0.05, 0.32, a, q(0, 2.535, -2.5 + t3));
  for (let t3 = 0; t3 < 4; t3++) e4.box(0.3, 2.24, 0.07, i, q(-0.84 + t3 * 0.56, 1.3, -2.995), a);
  for (let t3 of gO) {
    for (let n3 of gO) e4.box(0.16, 2.6, 0.16, i, q(t3 * 1.17, 1.3, n3 * 2.97)), e4.box(0.14, 0.14, 6.1, i, q(t3 * 1.18, n3 > 0 ? 2.53 : 0.07, 0)), e4.box(2.5, 0.14, 0.14, i, q(0, n3 > 0 ? 2.53 : 0.07, t3 * 2.98));
    e4.box(1.08, 2.26, 0.05, n2, q(t3 * 0.56, 1.3, 2.99), a);
    for (let n3 of [0.2, 0.86]) e4.cyl(0.03, 0.03, 2.3, $.steel, q(t3 * n3, 1.3, 3.035), 6);
    e4.box(0.26, 0.05, 0.05, $.steel, q(t3 * 0.33, 1.1, 3.04)), e4.box(0.26, 0.05, 0.05, $.steel, q(t3 * 0.73, 1.25, 3.04));
  }
  e4.box(0.03, 2.26, 0.06, r, q(0, 1.3, 2.99));
}, dumpster: (e4) => {
  let t2 = 3112262, n2 = yO(t2, 0.75);
  e4.add(xO(0.14, [-0.8, 0.8, -0.44, 0.44], 1.12, [-0.94, 0.94, -0.55, 0.55]), t2, void 0, 4630623), e4.box(1.96, 0.08, 1.18, n2, q(0, 1.12, 0)), e4.cyl(0.035, 0.035, 1.9, $.steelDark, q(0, 1.26, -0.58, 0, 0, hO), 6), e4.box(0.5, 0.25, 0.02, $.white, q(0, 0.75, 0.519, 0.112, 0, 0));
  for (let t3 of gO) {
    e4.box(0.95, 0.06, 1.2, $.black, q(t3 * 0.485, 1.21, 0, 0.1, 0, 0)), e4.box(0.12, 0.22, 0.8, n2, q(t3 * 0.93, 0.8, 0)), e4.box(0.08, 0.9, 0.04, n2, q(t3 * 0.6, 0.63, 0.515, 0.112, 0, 0));
    for (let n3 of [-0.36, 0.36]) e4.cyl(0.08, 0.08, 0.06, $.tyre, q(t3 * 0.7, 0.08, n3, 0, 0, hO), 6);
  }
}, barrel: (e4, t2) => {
  let n2 = vO([3110089, 13910063, 10246964], t2), r = yO(n2, 0.64), i = yO(n2, 1.18);
  e4.cyl(0.29, 0.29, 0.86, r, q(0, 0.45, 0), 10, n2);
  for (let t3 of [0.03, 0.31, 0.59, 0.87]) e4.cyl(0.31, 0.31, 0.05, i, q(0, t3, 0), 10);
  e4.cyl(0.255, 0.255, 0.02, r, q(0, 0.892, 0), 10), e4.cyl(0.04, 0.04, 0.03, $.steel, q(0.13, 0.905, 0.05), 6);
}, crate: (e4) => {
  let t2 = $.woodLight, n2 = 13079639;
  e4.box(0.9, 0.9, 0.9, $.woodDark, q(0, 0.5, 0), $.wood);
  for (let r of gO) {
    for (let n3 of gO) e4.box(0.1, 1, 0.1, t2, q(r * 0.45, 0.5, n3 * 0.45));
    for (let n3 of [0.05, 0.95]) e4.box(0.8, 0.1, 0.1, t2, q(0, n3, r * 0.45)), e4.box(0.1, 0.1, 0.8, t2, q(r * 0.45, n3, 0));
    for (let t3 of [mO / 4, -mO / 4]) e4.box(0.09, 1.12, 0.04, n2, q(0, 0.5, r * 0.46, 0, 0, t3)), e4.box(0.04, 1.12, 0.09, n2, q(r * 0.46, 0.5, 0, t3, 0, 0));
  }
}, pallet: (e4) => {
  let t2 = [$.wood, $.woodLight, 13079639], n2 = [0.03, -0.07, 0.05];
  for (let r = 0; r < 3; r++) {
    let i = q(r === 1 ? 0.03 : -0.01, r * 0.146, r === 2 ? 0.02 : 0, 0, n2[r], 0), a = (e5, t3, n3) => i.clone().multiply(q(e5, t3, n3));
    for (let t3 of [-0.43, 0.43]) e4.box(1.2, 0.02, 0.14, $.woodDark, a(0, 0.01, t3));
    for (let t3 of [-0.555, 0, 0.555]) e4.box(0.09, 0.1, 1, $.woodDark, a(t3, 0.07, 0), $.wood);
    for (let n3 = 0; n3 < 5; n3++) e4.box(1.2, 0.024, 0.15, t2[r], a(0, 0.132, -0.425 + n3 * 0.2125));
  }
}, tires: (e4) => {
  let t2 = [[0, 0, 0], [0.03, -0.02, 0.4], [-0.025, 0.03, 1.1], [0.02, 0.012, 1.9]], n2 = 0;
  for (let [r, i, a] of t2) e4.torus(0.29, 0.115, n2 % 2 ? $.rubber : $.tyre, q(r, 0.115 + n2 * 0.215, i, hO, 0, a), 5, 9), n2++;
}, haybale: (e4) => {
  let t2 = 15124058, n2 = 13214271;
  e4.cyl(0.75, 0.75, 1.3, t2, q(0, 0.74, 0, 0, 0, hO), 12);
  for (let r of gO) e4.cyl(0.765, 0.765, 0.07, 11106095, q(r * 0.36, 0.74, 0, 0, 0, hO), 12), jO(e4, 0.6, n2, q(r * 0.656, 0.74, 0, 0, r * hO, 0), 12), jO(e4, 0.4, t2, q(r * 0.662, 0.74, 0, 0, r * hO, 0), 10), jO(e4, 0.18, n2, q(r * 0.668, 0.74, 0, 0, r * hO, 0), 8);
}, silo: (e4, t2) => {
  let n2 = vO([12174541, 12863290], t2), r = vO([8885667, 14278371], t2), i = yO(n2, 0.7), a = yO(n2, 0.8);
  e4.cyl(2.25, 2.25, 0.3, $.concrete, q(0, 0.15, 0), 12), e4.cyl(2.2, 2.2, 9.9, i, q(0, 5.15, 0), 12, n2);
  for (let t3 = 0; t3 < 4; t3++) e4.cyl(2.24, 2.24, 0.16, a, q(0, 2.1 + t3 * 2, 0), 12);
  e4.cyl(2.25, 2.25, 0.18, a, q(0, 10.1, 0), 12), e4.add(new gs(2.25, 12, 4, 0, mO * 2, 0, hO), yO(r, 0.78), q(0, 10.15, 0, 0, 0, 0, 1, 0.8, 1), r), e4.cyl(0.18, 0.26, 0.2, a, q(0, 11.98, 0), 8);
  for (let t3 of gO) e4.box(0.05, 9.6, 0.05, $.steelDark, q(t3 * 0.24, 5.2, 2.36));
  for (let t3 = 0; t3 < 14; t3++) e4.box(0.48, 0.04, 0.04, $.steelDark, q(0, 0.8 + t3 * 0.68, 2.36));
  e4.box(0.8, 1.4, 0.1, yO(n2, 0.55), q(Math.SQRT1_2 * 2.15, 1, Math.SQRT1_2 * 2.15, 0, mO / 4, 0)), e4.cyl(0.1, 0.1, 10.3, $.steelDark, q(-2.3, 5.45, 0), 6), AO(e4, [-2.3, 10.55, 0], [-1.35, 11.25, 0], 0.1, $.steelDark, 6);
}, watertower: (e4) => {
  let t2 = 8226708, n2 = 12832466, r = 13191226, i = 1.85, a = 1.35, o = (e5) => _O(i, a, e5 / 8);
  for (let n3 of gO) {
    for (let r2 of gO) e4.box(0.5, 0.3, 0.5, $.concrete, q(n3 * i, 0.15, r2 * i)), kO(e4, [n3 * i, 0.2, r2 * i], [n3 * a, 8, r2 * a], 0.16, t2);
    for (let r2 of [2.9, 5.5]) {
      let i2 = o(r2);
      kO(e4, [-i2, r2, n3 * i2], [i2, r2, n3 * i2], 0.1, t2), kO(e4, [n3 * i2, r2, -i2], [n3 * i2, r2, i2], 0.1, t2);
    }
  }
  let s2 = [0.3, 2.9, 5.5, 7.9];
  for (let n3 = 0; n3 < 3; n3++) {
    let r2 = s2[n3], i2 = s2[n3 + 1], a2 = o(r2), c = o(i2), l2 = n3 % 2 ? -1 : 1;
    for (let n4 of gO) kO(e4, [-l2 * a2, r2, n4 * a2], [l2 * c, i2, n4 * c], 0.06, t2), kO(e4, [n4 * a2, r2, -l2 * a2], [n4 * c, i2, l2 * c], 0.06, t2);
  }
  e4.cyl(0.18, 0.18, 7.5, t2, q(0, 3.75, 0), 6), e4.cone(2, 0.5, yO(n2, 0.75), q(0, 7.7, 0, mO, 0, 0), 12), e4.cyl(2.45, 2.45, 0.1, yO(t2, 0.8), q(0, 8, 0), 12), e4.cyl(2.1, 2.1, 3, n2, q(0, 9.55, 0), 12, 15922417), e4.cyl(2.13, 2.13, 0.8, 3121092, q(0, 9.6, 0), 12, void 0, true);
  for (let n3 of [8.3, 10.8]) e4.cyl(2.14, 2.14, 0.1, t2, q(0, n3, 0), 12);
  e4.cone(2.35, 0.9, yO(r, 0.78), q(0, 11.5, 0), 12, r), e4.ico(0.12, t2, q(0, 12, 0), 0), e4.torus(2.38, 0.03, t2, q(0, 8.8, 0, hO, 0, 0), 3, 12);
  for (let n3 = 0; n3 < 6; n3++) {
    let r2 = mO / 3 * n3 + mO / 6;
    e4.box(0.05, 0.75, 0.05, t2, q(Math.sin(r2) * 2.38, 8.42, Math.cos(r2) * 2.38));
  }
  for (let n3 of gO) kO(e4, [n3 * 0.2, 0.1, 2], [n3 * 0.2, 7.98, 2.42], 0.05, t2);
  for (let n3 = 1; n3 < 12; n3++) e4.box(0.4, 0.04, 0.04, t2, q(0, _O(0.1, 7.98, n3 / 12), _O(2, 2.42, n3 / 12)));
}, logpile: (e4) => {
  let t2 = [[-0.6, 0.3, 3, 0], [0, 0.3, 2.9, 0.05], [0.6, 0.3, 3, -0.04], [-0.3, 0.82, 2.95, 0.02], [0.3, 0.82, 3, -0.02], [0, 1.34, 2.9, 0.03]], n2 = 0;
  for (let [r, i, a, o] of t2) {
    e4.cyl(0.3, 0.3, a, n2 % 2 ? $.bark : 8016438, q(o, i, r, 0, 0, hO), 8);
    for (let t3 of gO) {
      let n3 = o + t3 * (a / 2 + 6e-3);
      jO(e4, 0.25, $.woodLight, q(n3, i, r, 0, t3 * hO, 0), 8), jO(e4, 0.11, $.wood, q(n3 + t3 * 6e-3, i, r, 0, t3 * hO, 0), 6);
    }
    n2++;
  }
  for (let t3 of gO) e4.box(2.2, 0.14, 0.12, $.woodDark, q(0, 0.07, t3 * 0.93));
}, stump: (e4) => {
  let t2 = 13211482;
  e4.cyl(0.385, 0.42, 0.2, $.barkDark, q(0, 0.1, 0), 9, $.bark), e4.cyl(0.27, 0.27, 0.12, $.woodLight, q(0, 0.25, -0.09), 9, void 0, true), e4.cyl(0.33, 0.37, 0.2, $.bark, q(0, 0.4, 0), 9, 8016438), jO(e4, 0.2, t2, q(0, 0.203, 0.17, -hO, 0, 0), 8), jO(e4, 0.18, $.wood, q(0, 0.297, 0.16, hO, 0, 0), 8), e4.cyl(0.3, 0.33, 0.03, $.woodLight, q(0, 0.51, 0), 9), jO(e4, 0.2, t2, q(0, 0.528, 0, -hO, 0, 0), 9), jO(e4, 0.08, $.wood, q(0, 0.531, 0, -hO, 0, 0), 6), e4.add(new Ba(0.25, 0.27, 0.09, 5, 1, false, hO, mO), $.woodLight, q(0, 0.57, -0.06)), e4.box(0.52, 0.09, 0.02, t2, q(0, 0.57, -0.07));
  for (let t3 = 0; t3 < 4; t3++) {
    let n2 = t3 * hO + 0.5, r = OO([Math.sin(n2) * 0.3, 0.14, Math.cos(n2) * 0.3], [Math.sin(n2) * 0.74, 0, Math.cos(n2) * 0.74]);
    e4.cone(0.13, r.len, $.barkDark, r.m, 5);
  }
}, lamp: (e4) => {
  let t2 = 4015952, n2 = 5924466;
  e4.cyl(0.15, 0.2, 0.45, t2, q(0, 0.225, 0), 8), e4.cyl(0.11, 0.11, 0.06, n2, q(0, 0.48, 0), 8), e4.cyl(0.06, 0.085, 4.5, t2, q(0, 2.7, 0), 8, n2), AO(e4, [0, 4.85, 0], [0, 5.2, 0.5], 0.05, n2), AO(e4, [0, 5.2, 0.5], [0, 5.25, 1], 0.045, n2), AO(e4, [0, 4.4, 0.05], [0, 5.02, 0.28], 0.025, t2, 5), e4.rbox(0.34, 0.14, 0.66, 0.06, t2, q(0, 5.24, 1.2), n2, 1), e4.box(0.24, 0.05, 0.46, $.warm, q(0, 5.155, 1.22));
}, bench: (e4) => {
  let t2 = 2896184;
  for (let n2 of gO) {
    let r = n2 * 0.78;
    e4.box(0.06, 0.44, 0.06, t2, q(r, 0.22, 0.2)), kO(e4, [r, 0, -0.2], [r, 0.9, -0.34], 0.06, t2), e4.box(0.06, 0.05, 0.5, t2, q(r, 0.43, 0)), e4.box(0.07, 0.04, 0.5, t2, q(r, 0.64, 0.02)), e4.box(0.05, 0.2, 0.05, t2, q(r, 0.54, 0.22));
  }
  for (let t3 = 0; t3 < 3; t3++) {
    e4.box(1.8, 0.04, 0.14, t3 === 1 ? $.woodLight : $.wood, q(0, 0.475, -0.14 + t3 * 0.165));
    let n2 = 0.58 + t3 * 0.14;
    e4.box(1.8, 0.11, 0.035, t3 === 1 ? $.wood : $.woodLight, q(0, n2, -0.165 - 0.1556 * n2, -0.155, 0, 0));
  }
}, mailbox: (e4) => {
  let t2 = 14673130, n2 = 11187391;
  e4.box(0.1, 1, 0.1, $.woodDark, q(0, 0.5, 0), $.wood), e4.box(0.16, 0.04, 0.4, $.wood, q(0, 0.99, 0.02)), e4.box(0.24, 0.14, 0.5, n2, q(0, 1.08, 0.02), t2), e4.add(new Ba(0.12, 0.12, 0.5, 6, 1, false, hO, mO), t2, q(0, 1.15, 0.02, hO, 0, 0)), e4.box(0.19, 0.2, 0.012, n2, q(0, 1.11, 0.274)), e4.box(0.03, 0.03, 0.02, $.steelDark, q(0, 1.19, 0.285)), e4.box(0.015, 0.2, 0.035, $.tail, q(0.128, 1.2, 0.1)), e4.box(0.015, 0.08, 0.12, $.tail, q(0.128, 1.27, 0.14));
}, hydrant: (e4) => {
  let t2 = 14233383, n2 = 10362651, r = 15779898;
  e4.cyl(0.17, 0.19, 0.07, n2, q(0, 0.035, 0), 8), e4.cyl(0.115, 0.135, 0.5, n2, q(0, 0.32, 0), 8, t2), e4.cyl(0.155, 0.155, 0.05, t2, q(0, 0.58, 0), 8), e4.add(new gs(0.135, 8, 3, 0, mO * 2, 0, hO), t2, q(0, 0.6, 0)), e4.cyl(0.035, 0.045, 0.08, r, q(0, 0.76, 0), 5), e4.cyl(0.06, 0.06, 0.4, t2, q(0, 0.42, 0, 0, 0, hO), 8);
  for (let t3 of gO) e4.cyl(0.07, 0.07, 0.05, r, q(t3 * 0.21, 0.42, 0, 0, 0, hO), 6);
  e4.cyl(0.075, 0.075, 0.2, t2, q(0, 0.38, 0.12, hO, 0, 0), 8), e4.cyl(0.085, 0.085, 0.05, r, q(0, 0.38, 0.225, hO, 0, 0), 6);
}, fence: (e4) => {
  let t2 = 14276300, n2 = 16250351;
  for (let n3 of [0.3, 0.7]) e4.box(2.5, 0.08, 0.04, t2, q(0, n3, -0.02));
  for (let r = 0; r < 8; r++) {
    let i = -1 + 2 / 7 * r;
    e4.box(0.15, 0.78, 0.035, t2, q(i, 0.45, 0.0175), n2), e4.add(xO(0.84, [i - 0.075, i + 0.075, 0, 0.035], 1, [i - 8e-3, i + 8e-3, 0, 0.035]), n2);
  }
  for (let r of gO) e4.box(0.11, 0.92, 0.11, t2, q(r * 1.195, 0.46, 0), n2), e4.cone(0.09, 0.1, n2, q(r * 1.195, 0.97, 0, 0, mO / 4, 0), 4);
}, picnic: (e4) => {
  let t2 = $.woodDark;
  for (let t3 = 0; t3 < 4; t3++) e4.box(1.8, 0.045, 0.19, t3 % 2 ? $.wood : $.woodLight, q(0, 0.75, -0.3 + t3 * 0.2));
  for (let n2 of gO) {
    e4.box(1.8, 0.045, 0.26, $.woodLight, q(0, 0.44, n2 * 0.64));
    for (let r of [-0.65, 0.65]) kO(e4, [r, 0, n2 * 0.72], [r, 0.73, n2 * 0.22], 0.05, t2, 0.1);
    e4.box(0.05, 0.08, 1.5, t2, q(n2 * 0.7, 0.39, 0)), e4.box(0.05, 0.08, 0.78, t2, q(n2 * 0.7, 0.69, 0)), kO(e4, [n2 * 0.6, 0.42, 0], [n2 * 0.14, 0.72, 0], 0.05, t2);
  }
}, umbrella: (e4, t2) => {
  let [n2, r] = vO([[15024442, 16184298], [3117024, 16184298], [16237873, 2078886]], t2), i = 15263455;
  e4.cyl(0.2, 0.26, 0.09, 13223096, q(0, 0.045, 0), 8), e4.cyl(0.03, 0.03, 2.25, i, q(0, 1.125, 0), 6), e4.ico(0.06, i, q(0, 2.33, 0), 0);
  let a = new bO(), o = new bO(), s2 = new bO(), c = [0, 2.3, 0], l2 = 1.25;
  for (let e5 = 0; e5 < 8; e5++) {
    let t3 = e5 / 8 * mO * 2, n3 = (e5 + 1) / 8 * mO * 2, r2 = [Math.sin(t3) * l2, 1.85, Math.cos(t3) * l2], i2 = [Math.sin(n3) * l2, 1.85, Math.cos(n3) * l2], u2 = [r2[0], 1.71, r2[2]], d2 = [i2[0], 1.71, i2[2]];
    (e5 % 2 ? o : a).tri(c, r2, i2).quad(u2, d2, i2, r2), s2.tri(c, i2, r2).quad(d2, u2, r2, i2);
  }
  e4.add(a.geo(), n2), e4.add(o.geo(), r), e4.add(s2.geo(), 11906463);
  let u = 0.7, d = 0.75, f = 0.7, p = 0.3, m = -0.375, h = Math.sin(d), g2 = Math.cos(d);
  e4.box(0.62, 0.06, 1.25, $.white, q(u, p, 0.25)), e4.box(0.56, 0.04, 1.17, n2, q(u, 0.35, 0.25)), e4.box(0.62, 0.06, f, $.white, q(u, p + h * f / 2, m - g2 * f / 2, d, 0, 0)), e4.box(0.56, 0.04, 0.62, n2, q(u, p + h * f / 2 + g2 * 0.05, m - g2 * f / 2 + h * 0.05, d, 0, 0));
  for (let t3 of gO) {
    for (let n3 of [0.75, -0.25]) e4.box(0.05, 0.28, 0.05, $.white, q(u + t3 * 0.26, 0.14, n3));
    e4.box(0.05, 0.5, 0.05, $.white, q(u + t3 * 0.26, 0.25, -0.62));
  }
  e4.ico(0.17, r, q(-0.75, 0.17, 0.55), 1, n2);
}, boat: (e4) => {
  let t2 = [[-1.62, 0.54, 0.38, 0.08, 0.52], [-0.6, 0.68, 0.46, 0, 0.5], [0.5, 0.63, 0.4, 0, 0.52], [1.25, 0.38, 0.18, 0.07, 0.58], [1.72, 0.04, 0.03, 0.26, 0.66]], n2 = [], r = [], i = t2.length - 1;
  t2.forEach(([e5, t3, a2, o2, s3], c2) => {
    n2.push({ gl: [-t3, s3, e5], cl: [-a2, o2, e5], cr: [a2, o2, e5], gr: [t3, s3, e5] });
    let l3 = Math.max(t3 - 0.07, 0.012), u2 = Math.max(a2 - 0.06, 8e-3), d2 = c2 === 0 ? e5 + 0.07 : c2 === i ? e5 - 0.1 : e5;
    r.push({ gl: [-l3, s3, d2], cl: [-u2, o2 + 0.07, d2], cr: [u2, o2 + 0.07, d2], gr: [l3, s3, d2] });
  });
  let a = new bO(), o = new bO(), s2 = new bO();
  for (let e5 = 0; e5 < i; e5++) {
    let t3 = n2[e5], i2 = n2[e5 + 1], c2 = r[e5], l3 = r[e5 + 1];
    a.quad(i2.cr, t3.cr, t3.gr, i2.gr).quad(t3.cl, i2.cl, i2.gl, t3.gl).quad(t3.cl, t3.cr, i2.cr, i2.cl), o.quad(c2.cr, l3.cr, l3.gr, c2.gr).quad(l3.cl, c2.cl, c2.gl, l3.gl).quad(c2.cl, l3.cl, l3.cr, c2.cr), s2.quad(c2.gr, l3.gr, i2.gr, t3.gr).quad(t3.gl, i2.gl, l3.gl, c2.gl);
  }
  let c = n2[0], l2 = r[0], u = n2[i], d = r[i];
  a.quad(c.cr, c.cl, c.gl, c.gr).quad(u.cl, u.cr, u.gr, u.gl), o.quad(l2.cl, l2.cr, l2.gr, l2.gl).quad(d.cr, d.cl, d.gl, d.gr), s2.quad(c.gl, l2.gl, l2.gr, c.gr).quad(d.gl, u.gl, u.gr, d.gr), e4.add(a.geo(), 2060190, void 0, 4171734), e4.add(o.geo(), $.wood, void 0, $.woodLight), e4.add(s2.geo(), $.white), e4.box(1.1, 0.05, 0.26, $.wood, q(0, 0.36, -0.55)), e4.box(0.92, 0.05, 0.24, $.wood, q(0, 0.38, 0.6)), e4.box(0.86, 0.05, 0.3, $.wood, q(0, 0.36, -1.38));
  for (let t3 of gO) AO(e4, [t3 * 0.26, 0.44, 0.8], [t3 * 0.3, 0.42, -0.9], 0.022, $.woodLight, 5), kO(e4, [t3 * 0.3, 0.42, -0.9], [t3 * 0.31, 0.415, -1.35], 0.13, $.woodLight, 0.02), e4.box(0.05, 0.08, 0.08, $.steelDark, q(t3 * 0.63, 0.55, -0.05));
}, campfire: (e4) => {
  e4.cyl(0.46, 0.5, 0.04, 2762275, q(0, 0.02, 0), 8);
  for (let t2 = 0; t2 < 8; t2++) {
    let n2 = t2 / 8 * mO * 2, r = 0.12 + t2 * 7 % 3 * 0.02;
    e4.ico(r, t2 % 2 ? 9276036 : 10262672, q(Math.sin(n2) * 0.5, r * 0.55, Math.cos(n2) * 0.5, 0, n2 * 1.7, 0, 1.15, 0.75, 1), 0, 12170668);
  }
  for (let t2 = 0; t2 < 4; t2++) {
    let n2 = t2 * hO + 0.4;
    AO(e4, [Math.sin(n2) * 0.36, 0.06, Math.cos(n2) * 0.36], [-Math.sin(n2) * 0.06, 0.46, -Math.cos(n2) * 0.06], 0.055, t2 % 2 ? $.barkDark : 3811872, 5);
  }
  e4.cone(0.2, 0.62, 16734751, q(0, 0.4, 0), 6, 16765498), e4.cone(0.12, 0.4, 16742943, q(0.12, 0.28, 0.06, 0, 0, -0.25), 5, 16769126), e4.cone(0.11, 0.36, 16742943, q(-0.1, 0.26, -0.08, 0.2, 0, 0.22), 5, 16769126);
}, tent: (e4, t2) => {
  let n2 = vO([15764011, 5217610, 3835609], t2), r = yO(n2, 0.68), i = 16052712, a = 1.1, o = 1.3, s2 = 1.5, c = 0.02, l2 = [-1.1, c, o], u = [a, c, o], d = [-1.1, c, -1.3], f = [a, c, -1.3], p = [0, s2, o], m = [0, s2, -1.3], h = [-0.38, c, o], g2 = [0.38, c, o], _2 = [0, 1.05, o];
  e4.add(new bO().quad(u, f, m, p).quad(d, l2, p, m).tri(f, d, m).quad(l2, h, _2, p).quad(g2, u, p, _2).geo(), r, void 0, n2), e4.add(new bO().tri(h, g2, _2).geo(), 1777188);
  let v = (e5, t3) => [e5 * 1.0877000000000001, 0.057100000000000005, t3], y = (e5, t3) => [e5 * 0.9337000000000001, 0.2471, t3];
  e4.add(new bO().quad(v(1, o), v(1, -1.3), y(1, -1.3), y(1, o)).quad(v(-1, -1.3), v(-1, o), y(-1, o), y(-1, -1.3)).geo(), i), e4.box(2.1, 0.03, 2.5, 3817287, q(0, 0.015, 0)), AO(e4, [0, 1.52, -1.45], [0, 1.52, 1.45], 0.03, $.woodDark, 5);
  for (let t3 of gO) for (let n3 of gO) kO(e4, [t3 * 1.1400000000000001, 0, n3 * 1.33], [0, 1.56, n3 * 1.33], 0.05, $.wood), e4.box(0.04, 0.22, 0.04, $.woodDark, q(t3 * 1.36, 0.08, n3 * 1.05, 0, 0, t3 * 0.4)), kO(e4, [t3 * 1.34, 0.16, n3 * 1.05], [t3 * 0.55, 0.76, n3 * 1.05], 0.015, i);
}, billboard: (e4, t2) => {
  let [n2, r, i, a] = vO([[16747039, 16765498, 2078886, 16777215], [8011729, 16736168, 16769354, 16777215], [1209289, 3526888, 16731998, 16774872]], t2), o = t2 === 1 ? 1 : -1, s2 = 7031344, c = 2830391;
  for (let t3 of gO) e4.box(0.3, 5.7, 0.3, yO(s2, 0.72), q(t3 * 1.9, 2.85, -0.12), s2);
  kO(e4, [-1.9, 0.5, -0.12], [1.9, 2.3, -0.12], 0.1, s2, 0.08), kO(e4, [1.9, 0.5, -0.12], [-1.9, 2.3, -0.12], 0.1, s2, 0.08), e4.box(6, 3.5, 0.18, c, q(0, 4.25, 0.12)), e4.box(5.72, 3.22, 0.04, n2, q(0, 4.25, 0.22), r), e4.box(6, 0.08, 0.6, c, q(0, 2.46, 0.45));
  let l2 = o * 1.55, u = 4.3;
  jO(e4, 1.05, i, q(l2, u, 0.245), 16), jO(e4, 0.66, a, q(l2, u, 0.25), 12), jO(e4, 0.3, i, q(l2, u, 0.255), 10);
  let d = l2 - o * 0.9;
  e4.box(0.62, 0.62, 0.03, a, q(d, 5.3, 0.262)), e4.box(0.62, 0.62, 0.03, a, q(d, 5.3, 0.262, 0, 0, mO / 4)), jO(e4, 0.2, i, q(d, 5.3, 0.28), 8);
  let f = o < 0 ? 0.25 : -2.6;
  e4.box(2.3, 0.36, 0.03, a, q(f + 1.15, 5.05, 0.25)), e4.box(1.7, 0.2, 0.03, a, q(f + 0.85, 4.52, 0.25)), e4.box(1.25, 0.2, 0.03, a, q(f + 0.625, 4.16, 0.25)), e4.box(1.3, 0.44, 0.03, i, q(f + 0.65, 3.4, 0.25)), e4.box(0.8, 0.12, 0.03, a, q(f + 0.65, 3.4, 0.262));
  for (let t3 of [-2, 0, 2]) e4.box(0.05, 0.05, 0.75, c, q(t3, 6.03, 0.55)), e4.box(0.36, 0.1, 0.2, c, q(t3, 6, 0.95)), e4.box(0.28, 0.03, 0.14, $.warm, q(t3, 5.94, 0.95));
}, windmill: (e4) => {
  let t2 = 9279651, n2 = 6450553, r = 13776943, i = 1.1, a = 0.2, o = (e5) => _O(i, a, e5 / 9);
  for (let n3 of gO) for (let r2 of gO) kO(e4, [n3 * i, 0, r2 * i], [n3 * a, 9, r2 * a], 0.09, t2);
  let s2 = [0.25, 2.1, 4, 5.8, 7.5, 8.9];
  for (let r2 = 0; r2 < 5; r2++) {
    let i2 = s2[r2], a2 = s2[r2 + 1], c = o(i2), l2 = o(a2), u = r2 % 2 ? -1 : 1;
    for (let r3 of gO) kO(e4, [-l2, a2, r3 * l2], [l2, a2, r3 * l2], 0.06, t2), kO(e4, [r3 * l2, a2, -l2], [r3 * l2, a2, l2], 0.06, t2), kO(e4, [-u * c, i2, r3 * c], [u * l2, a2, r3 * l2], 0.045, n2), kO(e4, [r3 * c, i2, -u * c], [r3 * l2, a2, u * l2], 0.045, n2);
  }
  e4.cyl(0.3, 0.34, 0.5, $.concrete, q(0, 0.25, 0), 8), e4.cyl(0.03, 0.03, 9, n2, q(0, 4.5, 0), 5), e4.box(0.9, 0.06, 0.9, $.wood, q(0, 7.3, 0)), e4.box(0.34, 0.4, 0.8, n2, q(0, 9.2, 0.05)), e4.cyl(0.13, 0.13, 0.3, n2, q(0, 9.2, 0.58, hO, 0, 0), 8);
  for (let t3 = 0; t3 < 12; t3++) {
    let n3 = q(0, 9.2, 0.62, 0, 0, t3 / 12 * mO * 2).multiply(q(0, 0, 0, 0, 0.38, 0));
    e4.add(xO(0.35, [-0.07, 0.07, -0.012, 0.012], 1.72, [-0.21, 0.21, -0.012, 0.012]), 11845318, n3, 15659506);
  }
  e4.torus(0.62, 0.022, n2, q(0, 9.2, 0.62), 3, 12), e4.torus(1.45, 0.022, n2, q(0, 9.2, 0.62), 3, 14), kO(e4, [0, 9.2, -0.3], [0, 9.2, -1.6], 0.05, n2), e4.add(xO(0, [-0.015, 0.015, -0.16, 0.16], 1, [-0.015, 0.015, -0.48, 0.48]), r, q(0, 9.2, -1.5, -hO, 0, 0), yO(r, 1.25));
}, piling: (e4, t2) => {
  t2 === 0 ? (e4.cyl(0.3, 0.33, 5, 8223347, q(0, 2.5, 0), 10), e4.cyl(0.31, 0.31, 0.35, 6257994, q(0, 5.05, 0), 10), e4.cyl(0.29, 0.3, 3.65, 11841702, q(0, 7.05, 0), 10), e4.cyl(0.36, 0.36, 0.2, 13223355, q(0, 8.9, 0), 10, 14078664)) : (e4.cyl(0.22, 0.25, 5, 5126952, q(0, 2.5, 0), 8), e4.cyl(0.23, 0.23, 0.3, 5599295, q(0, 5.05, 0), 8), e4.cyl(0.21, 0.22, 3.75, 9069632, q(0, 7.1, 0), 8, 10779215), e4.cyl(0.245, 0.245, 0.14, 14270602, q(0, 7.9, 0), 8));
}, ...Object.fromEntries(Object.keys(pO).map((e4) => [e4, (t2) => {
  let [n2, r, i] = fO[e4].size;
  t2.box(n2, r, i, pO[e4], q(0, r / 2, e4 === `awning` || e4 === `blade` ? i / 2 : 0));
}])) }, IO = /* @__PURE__ */ new Map();
function LO(e4, t2 = 0) {
  let n2 = fO[e4].variants, r = Number.isFinite(t2) ? (Math.floor(t2) % n2 + n2) % n2 : 0, i = `${e4}:${r}`, a = IO.get(i);
  if (!a && e4 in TOWN_KIT_BUILDERS) {
    let b = new GeoBuilder();
    TOWN_KIT_BUILDERS[e4](b, r);
    a = b.build();
    a.name = `prop_${i}`;
    IO.set(i, a);
  }
  if (!a) {
    let t3 = new gm();
    FO[e4](t3, r), a = t3.build(), a.name = `prop_${i}`, IO.set(i, a);
  }
  return a;
}
// Extra hand-built Chapter 4 landmark models. Vertex-coloured procedural geometry
// keeps the landmarks usable both in the battle royale and the 3D flip event.
fO.castleKnight=dO(`castleKnight`,2.8,9,2.8,`stone`,900,65,true);
FO.castleKnight=(g)=>{const stone=0x888178,edge=0x5d5a55;g.box(2.8,.65,2.8,edge,q(0,.33,0));g.box(2.2,.4,2.2,stone,q(0,.85,0));
 for(const x of [-.54,.54]){g.box(.67,2.35,.8,stone,q(x,2.2,0));g.box(.75,.35,1.15,edge,q(x,1.18,.12));}g.box(2.0,2.4,1.05,stone,q(0,4.42,0));g.box(2.2,.3,1.2,edge,q(0,5.45,0));g.box(1.2,1.15,1,stone,q(0,6.25,0));g.box(.9,.15,1.08,edge,q(0,6.3,.1));g.cone(.75,.9,edge,q(0,7.2,0),6);
 for(const x of [-1.15,1.15])g.box(.45,2,.55,stone,q(x,4.25,.05,0,0,x*.09));g.box(.22,4.8,.35,edge,q(0,2.95,.84));g.box(1.1,.18,.4,stone,q(0,4.4,.84));};
fO.labRoof=dO(`labRoof`,15,3.2,15,`metal`,600,0,false);
FO.labRoof=(g)=>{for(let i=0;i<8;i++){let a=-Math.PI/2+(i+.5)*Math.PI/8,x=Math.sin(a)*7,y=Math.cos(a)*2.8;g.box(3, .35,15,0x283743,q(x,y,0,0,0,-a*.36));}for(const z of [-7,0,7])g.box(14,.13,.16,0xef893b,q(0,1.6,z));};
fO.timberTrim=dO(`timberTrim`,15,8,.16,`wood`,100,0,false);
FO.timberTrim=(g)=>{const c=0x49372d;for(const x of [-7.3,-3.7,0,3.7,7.3])g.box(.25,8,.16,c,q(x,4,0));for(const y of [.2,4,7.8])g.box(15,.25,.16,c,q(0,y,0));for(const x of [-5.5,2])g.box(4.6,.2,.17,c,q(x,5.9,0,0,0,x<0?.58:-.58));};
fO.quarryBlock=dO(`quarryBlock`,4,4,4,`stone`,900,55,true,3);
FO.quarryBlock=(g,v)=>{const colors=[0xbab9ad,0x999d96,0xd0cbc1];g.box(4,4,4,colors[v%3],q(0,2,0));for(const y of [1.2,2.8])g.box(4.01,.035,4.01,0x898b86,q(0,y,0));};
fO.factoryStack=dO(`factoryStack`,3,18,3,`metal`,950,60,true);
FO.factoryStack=(g)=>{g.cyl(1.15,1.6,16,0xb65d2c,q(0,8,0),12);for(const y of [2,6,10,14])g.cyl(1.25,1.25,.5,0xe5a64d,q(0,y,0),12);g.cyl(1.45,1.45,1,0x3d4142,q(0,16.5,0),12);};
var RO = /* @__PURE__ */ new Set([`castleKnight`,`quarryBlock`,`factoryStack`,`fence`, `lamp`, `plazalamp`, `trafficlight`, `bollard`, `silo`, `watertower`, `windmill`, `clocktower`, `fountain`, `awning`, `blade`, `roofsign`, `rooftank`, `acunit`, `container`, `boat`, `billboard`, `cafe`, `kiosk`, `planter`, `busstop`, `piling`]), zO = /* @__PURE__ */ new Set([`labRoof`,`timberTrim`,`awning`, `blade`, `roofsign`, `umbrella`, `stump`, `campfire`, `cafe`]), BO = { wall: 4, wallDoor: 4, wallWin: 4, wallWin2: 4, wallShop: 4, half: 2, gable: 4, parapet: 1.2 };
function VO(e4, t2) {
  let n2 = fO[e4.id], r = Math.abs(Math.cos(e4.rot)), i = Math.abs(Math.sin(e4.rot)), a = Math.max(0.05, (n2.size[0] * r + n2.size[2] * i) / 2 - t2), o = Math.max(0.05, (n2.size[0] * i + n2.size[2] * r) / 2 - t2);
  return { x0: e4.x - a, x1: e4.x + a, y0: e4.y + 0.05, y1: e4.y + n2.size[1], z0: e4.z - o, z1: e4.z + o };
}
function HO(e4, t2) {
  let n2 = e4.gy * 4, r = e4.gx * 5, i = e4.gz * 5, a = BO[e4.shape];
  if (a !== void 0) {
    let o = 0.22, s2 = e4.shape === `wallDoor` || e4.shape === `wallShop` ? 1.3 : 0;
    e4.rot & 1 ? (t2.push({ x0: r - o, x1: r + o, y0: n2, y1: n2 + a, z0: i, z1: i + 5 }), s2 && t2.push({ x0: r - s2, x1: r + s2, y0: n2, y1: n2 + 2.2, z0: i + 1.25, z1: i + 3.75 })) : (t2.push({ x0: r, x1: r + 5, y0: n2, y1: n2 + a, z0: i - o, z1: i + o }), s2 && t2.push({ x0: r + 1.25, x1: r + 3.75, y0: n2, y1: n2 + 2.2, z0: i - s2, z1: i + s2 }));
  } else e4.shape === `stairs` && t2.push({ x0: r + 0.1, x1: r + 5 - 0.1, y0: n2, y1: n2 + 4 + 2, z0: i + 0.1, z1: i + 5 - 0.1 });
}
var UO = (e4, t2) => e4.x0 < t2.x1 && e4.x1 > t2.x0 && e4.z0 < t2.z1 && e4.z1 > t2.z0 && e4.y0 < t2.y1 && e4.y1 > t2.y0, WO = class {
  m = /* @__PURE__ */ new Map();
  k(e4, t2) {
    return (e4 + 512) * 1024 + (t2 + 512);
  }
  add(e4) {
    for (let t2 = Math.floor(e4.x0 / 8); t2 <= Math.floor(e4.x1 / 8); t2++) for (let n2 = Math.floor(e4.z0 / 8); n2 <= Math.floor(e4.z1 / 8); n2++) {
      let r = this.k(t2, n2), i = this.m.get(r);
      i || this.m.set(r, i = []), i.push(e4);
    }
  }
  blocked(e4, t2) {
    for (let n2 = Math.floor(e4.x0 / 8); n2 <= Math.floor(e4.x1 / 8); n2++) for (let r = Math.floor(e4.z0 / 8); r <= Math.floor(e4.z1 / 8); r++) {
      let i = this.m.get(this.k(n2, r));
      if (i) {
        for (let n3 of i) if (n3 !== t2 && UO(e4, n3)) return true;
      }
    }
    return false;
  }
}, GO = [0.7, 1.4, 2.1, 2.8, 3.6];
function KO(e4, t2) {
  let n2 = new WO();
  for (let t3 of e4) {
    let e5 = [];
    HO(t3, e5);
    for (let t4 of e5) n2.add(t4);
  }
  let r = t2.filter((e5) => e5.id === `busstop`).map((e5) => VO(e5, -0.4));
  for (let e5 = t2.length - 1; e5 >= 0; e5--) {
    let n3 = t2[e5];
    (n3.id === `lamp` || n3.id === `plazalamp` || n3.id === `trafficlight`) && r.some((e6) => n3.x > e6.x0 && n3.x < e6.x1 && n3.z > e6.z0 && n3.z < e6.z1) && t2.splice(e5, 1);
  }
  let i = [];
  for (let e5 of t2) zO.has(e5.id) || (RO.has(e5.id) ? n2.add(VO(e5, 0.05)) : i.push(e5));
  let a = 0, o = 0, s2 = /* @__PURE__ */ new Set();
  for (let e5 of i) {
    let t3 = fO[e5.id].size[2] > 3 || fO[e5.id].size[0] > 3, r2 = VO(e5, 0.08);
    if (!n2.blocked(r2)) {
      n2.add(r2);
      continue;
    }
    let i2 = e5.x, c = e5.z, l2 = e5.y, u = Math.abs(ay(i2, c) - l2) < 0.35, d = false;
    for (let a2 of t3 ? GO.concat([4.5, 5.5]) : GO) {
      for (let t4 = 0; t4 < 8 && !d; t4++) {
        let o2 = t4 / 8 * Math.PI * 2 + a2;
        if (e5.x = i2 + Math.cos(o2) * a2, e5.z = c + Math.sin(o2) * a2, u) {
          let t5 = ay(e5.x, e5.z);
          if (Math.abs(t5 - l2) > 0.3) continue;
          e5.y = Math.max(l2, t5);
        }
        r2 = VO(e5, 0.08), n2.blocked(r2) || (d = true);
      }
      if (d) break;
    }
    d ? (n2.add(r2), a++) : (e5.x = i2, e5.z = c, e5.y = l2, s2.add(e5), o++);
  }
  if (s2.size) {
    let e5 = 0;
    for (let n3 of t2) s2.has(n3) || (t2[e5++] = n3);
    t2.length = e5;
  }
  return { moved: a, dropped: o };
}
function qO(e4, t2) {
  let n2 = /* @__PURE__ */ new Map(), r = (e5, t3) => {
    let r2 = n2.get(e5);
    (r2 === void 0 || t3 < r2) && n2.set(e5, t3);
  };
  for (let t3 of e4) BO[t3.shape] === void 0 ? r(`c:${t3.gx},${t3.gz}`, t3.gy) : r(t3.rot & 1 ? `e1:${t3.gx},${t3.gz}` : `e0:${t3.gx},${t3.gz}`, t3.gy);
  let i = (e5) => {
    for (let t3 of [`c:${e5.gx},${e5.gz}`, `e0:${e5.gx},${e5.gz}`, `e0:${e5.gx},${e5.gz + 1}`, `e1:${e5.gx},${e5.gz}`, `e1:${e5.gx + 1},${e5.gz}`]) {
      let r2 = n2.get(t3);
      if (r2 !== void 0 && r2 < e5.gy - 0.01) return true;
    }
    return false;
  }, a = /* @__PURE__ */ new Set(), o = 0;
  for (let n3 of e4) {
    if (n3.shape !== `floor` || i(n3)) continue;
    let e5 = n3.gy * 4;
    for (let [r2, i2] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      let s2 = `${n3.gx + r2},${n3.gz + i2}`;
      if (a.has(s2)) continue;
      let c = (n3.gx + r2) * 5 + (r2 ? -0.45 : 0.45), l2 = (n3.gz + i2) * 5 + (i2 ? -0.45 : 0.45);
      let ground = ay(c, l2), gap = e5 - ground;
      if (gap >= 1.2) {
        const variant = n3.mat === `stone` ? 0 : 1, modelHeight = variant === 0 ? 9 : 8;
        a.add(s2);
        t2.push({ id: `piling`, variant, x: c, y: ground - .18, z: l2, rot: 0, scaleY: (gap + .24) / modelHeight });
        o++;
      }
    }
  }
  return o;
}
var JO = [1.1, 1.35, 0.95, 1.3], YO = [1, 0.6, 2, 1.45];
// Ground every vegetation instance against the actual heightmap, including POI
// decorations and distant procedural trees. Sink roots slightly on slopes so the
// trunk never appears suspended above the surrounding ground.
function XO(trees) {
  const grounded = [];
  for (const tree of trees) {
    const scale = tree.scale || 1;
    const radius = (tree.type === `rock` ? (JO[Math.floor(tree.variant) & 3] || 1) * .55 : tree.type === `bush` ? .35 : .24) * scale;
    const center = ay(tree.x, tree.z);
    if (!Number.isFinite(center)) continue;
    let high = center;
    for (let i=0; i<8; i++) {
      const angle = i * Math.PI / 4;
      high = Math.max(high, ay(tree.x + Math.cos(angle)*radius, tree.z + Math.sin(angle)*radius));
    }
    // Root origin is deliberately just below the centre of the heightmap.
    const inset = tree.type === `rock` ? .18*scale : tree.type === `flower` ? .04 : tree.type === `bush` ? .10 : .32*scale;
    tree.y = Math.min(center, high) - inset;
    grounded.push(tree);
  }
  return grounded;
}

var ZO = 2048, QO = 1024, $O = 1024, ek = (e4) => [e4 >> 16 & 255, e4 >> 8 & 255, e4 & 255], tk = ek(8176207), nk = ek(6203718), rk = ek(4689725), ik = ek(10925658), ak = ek(4029754), ok = ek(16180927), sk = ek(14469017), ck = ek(10473390), lk = ek(4162713), uk = ek(11183003), dk = ek(9208957), fk = ek(16186111), pk = ek(8825944), mk = (e4, t2, n2) => {
  e4[0] += (t2[0] - e4[0]) * n2, e4[1] += (t2[1] - e4[1]) * n2, e4[2] += (t2[2] - e4[2]) * n2;
};
function hk(e4, t2, n2, r) {
  let i = Tp(0.36, 0.2, Ep(20, 58, n2 + Hp(e4 * 8e-3 - 4, t2 * 8e-3 + 9, 2) * 14)), a = Hp(e4 * 0.021 + 7.7, t2 * 0.021 - 3.1, 2) * 0.12 + Vp(e4 * 0.09, t2 * 0.09) * 0.03;
  return Ep(i - 0.035, i + 0.035, r + a) * Ep(0.5, 2.5, n2);
}
function gk(e4, t2, n2, r) {
  let i = Hp(e4 * 0.02 + 3, t2 * 0.02 - 8, 2) * 12 + Vp(e4 * 0.07, t2 * 0.07) * 3;
  return wp(Ep(69, 76, n2 + i) * (1 - Ep(0.22, 0.32, r + i * 4e-3)) + Ep(91, 96, n2) * 0.7);
}
function _k(e4, t2, n2) {
  e4.globalAlpha = n2 ? 1 : t2.alpha ?? 1;
  let r = n2 ?? t2.color;
  if (e4.fillStyle = r, e4.strokeStyle = r, t2.kind === `rect`) e4.fillRect(t2.x - t2.w / 2, t2.z - t2.d / 2, t2.w, t2.d), t2.soft && !n2 && (e4.globalAlpha = (t2.alpha ?? 1) * 0.35, e4.lineWidth = t2.soft, e4.strokeRect(t2.x - t2.w / 2, t2.z - t2.d / 2, t2.w, t2.d));
  else if (t2.kind === `circle`) {
    if (t2.soft && !n2) {
      let n3 = e4.createRadialGradient(t2.x, t2.z, Math.max(0, t2.r - t2.soft), t2.x, t2.z, t2.r), i = parseInt(r.slice(1), 16);
      n3.addColorStop(0, r), n3.addColorStop(1, `rgba(${i >> 16 & 255},${i >> 8 & 255},${i & 255},0)`), e4.fillStyle = n3;
    }
    e4.beginPath(), e4.arc(t2.x, t2.z, t2.r, 0, Math.PI * 2), e4.fill();
  } else {
    e4.lineWidth = t2.width ?? 1, e4.lineJoin = `round`, e4.lineCap = t2.dash ? `butt` : `round`, e4.setLineDash(t2.dash ?? []), e4.beginPath();
    let n3 = t2.pts;
    e4.moveTo(n3[0][0], n3[0][1]);
    for (let t3 = 1; t3 < n3.length; t3++) e4.lineTo(n3[t3][0], n3[t3][1]);
    e4.stroke(), e4.setLineDash([]);
  }
  e4.globalAlpha = 1;
}
var vk = [255, 0, 0], yk = [0, 255, 0], bk = [0, 0, 255], xk = [0, 0, 0];
function Sk(e4) {
  let t2 = parseInt(e4.color.slice(1, 7), 16);
  if (!Number.isFinite(t2)) return null;
  let n2 = (t2 >> 16 & 255) / 255, r = (t2 >> 8 & 255) / 255, i = (t2 & 255) / 255, a = Math.max(n2, r, i), o = a > 0 ? (a - Math.min(n2, r, i)) / a : 0, s2 = 0.2126 * n2 + 0.7152 * r + 0.0722 * i;
  return (e4.kind === `path` ? (e4.width ?? 1) <= 0.9 : e4.kind === `rect` && Math.min(e4.w ?? 9, e4.d ?? 9) <= 0.9) && s2 > 0.55 ? bk : o < 0.13 && s2 < 0.52 && i >= n2 - 0.02 ? vk : o < 0.22 && s2 >= 0.5 && s2 < 0.86 && i <= n2 + 0.02 && n2 - i < 0.15 ? yk : null;
}
function Ck(e4, t2) {
  let n2 = Sk(t2), r = t2.alpha ?? 1;
  if (!n2) {
    if (r < 0.6) return;
    n2 = xk;
  }
  let i = `rgb(${n2[0]},${n2[1]},${n2[2]})`;
  if (e4.globalAlpha = r, e4.fillStyle = i, e4.strokeStyle = i, t2.kind === `rect`) e4.fillRect(t2.x - t2.w / 2, t2.z - t2.d / 2, t2.w, t2.d);
  else if (t2.kind === `circle`) {
    if (t2.soft) {
      let r2 = e4.createRadialGradient(t2.x, t2.z, Math.max(0, t2.r - t2.soft), t2.x, t2.z, t2.r);
      r2.addColorStop(0, i), r2.addColorStop(1, `rgba(${n2[0]},${n2[1]},${n2[2]},0)`), e4.fillStyle = r2;
    }
    e4.beginPath(), e4.arc(t2.x, t2.z, t2.r, 0, Math.PI * 2), e4.fill();
  } else {
    e4.lineWidth = t2.width ?? 1, e4.lineJoin = `round`, e4.lineCap = t2.dash ? `butt` : `round`, e4.setLineDash(t2.dash ?? []), e4.beginPath();
    let n3 = t2.pts;
    e4.moveTo(n3[0][0], n3[0][1]);
    for (let t3 = 1; t3 < n3.length; t3++) e4.lineTo(n3[t3][0], n3[t3][1]);
    e4.stroke(), e4.setLineDash([]);
  }
  e4.globalAlpha = 1;
}
function wk(e4, t2, n2, r) {
  e4.lineJoin = `round`, e4.lineCap = `round`;
  let i = (n3, r2, i2) => {
    e4.globalAlpha = i2, e4.strokeStyle = r2, e4.lineWidth = n3, e4.beginPath(), e4.moveTo(t2[0][0], t2[0][1]);
    for (let n4 = 1; n4 < t2.length; n4++) e4.lineTo(t2[n4][0], t2[n4][1]);
    e4.stroke();
  };
  r ? (i(n2 + 0.6, `#000`, 1), e4.globalAlpha = 1) : (i(n2 + 4.2, `#8f7a45`, 0.2), i(n2 + 1.8, `#a98b52`, 0.5), i(n2, `#cfac72`, 1), i(n2 * 0.5, `#dcbd86`, 0.5), e4.globalAlpha = 1);
}
var Tk = `
varying vec3 vW;
varying vec3 vWN;
uniform sampler2D uClass;
uniform sampler2D uHM;
uniform float uTexel;
uniform vec3 uSunDir;
${_E}
float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
/** crisp, anti-aliased threshold of a smoothly interpolated coverage value */
float crisp(float v, float th) { float w = fwidth(v) * 0.8 + 0.012; return smoothstep(th - w, th + w, v); }
/** thin grid joint lines every s metres (w = half width, m) */
/** cliff blocks along one strata row: x = block hash, y = position along the block 0..1, z = block length (m) */
vec3 cliffBlock(float u, float row) {
  float L = 3.2 + 5.0 * hash12(vec2(row, 1.7));
  float s = u / L + hash12(vec2(row, 9.1)) * 7.0;
  return vec3(hash12(vec2(floor(s), row + 0.37)), fract(s), L);
}
float joint(float x, float s, float w) { float f = abs(fract(x / s + 0.5) - 0.5) * s; float aa = fwidth(x) * 0.8 + 1e-4; return (1.0 - smoothstep(w - aa, w + aa, f)) * (1.0 - smoothstep(0.02, 0.06, fwidth(x))); }
`, Ek = `
  vec2 tuv = vMapUv;
  vec3 alb = texture2D(map, tuv).rgb;
  vec3 cls = texture2D(uClass, tuv).rgb;
  float pav = cls.r + cls.g + cls.b;
  vec3 baseCol = alb, lightCol = alb;
  if (pav > 0.004) {
    // painted edges are blurred in the 0.39 m albedo: step back to pure colour on each side of the crisp edge
    vec3 cx = texture2D(uClass, tuv + vec2(uTexel, 0.0)).rgb;
    vec3 cy = texture2D(uClass, tuv + vec2(0.0, uTexel)).rgb;
    vec2 gP = vec2(cx.r + cx.g + cx.b - pav, cy.r + cy.g + cy.b - pav);
    vec2 gL = vec2(cx.g - cls.g, cy.g - cls.g);
    // only at real edges: 1-LSB steps inside a pad would otherwise trace dashed contour lines across it
    if (dot(gP, gP) > 4e-4) baseCol = texture2D(map, tuv - normalize(gP) * uTexel * 1.7).rgb;
    if (dot(gL, gL) > 4e-4) lightCol = texture2D(map, tuv + normalize(gL) * uTexel * 1.7).rgb;
  }
  vec3 nW = normalize(vWN);
  vec2 xz = vW.xz;
  float hgt = vW.y;
  float nF = texture2D(uNoise, xz * 0.21).b;
  float nM = texture2D(uNoise, xz * 0.043).b;
  float nB = texture2D(uNoise, xz * 0.0061).r;
  float lumB = dot(baseCol, vec3(0.2126, 0.7152, 0.0722));
  float grassW = smoothstep(0.0, 0.035, baseCol.g - max(baseCol.r, baseCol.b));
  float sandW = (1.0 - grassW) * smoothstep(0.42, 0.6, lumB) * smoothstep(5.5, 3.0, hgt);
  float dirtW = (1.0 - grassW) * (1.0 - sandW) * smoothstep(0.03, 0.10, baseCol.r - baseCol.b);
  vec3 col = baseCol * (0.86 + 0.28 * nF) * (0.93 + 0.14 * nM) * (0.94 + 0.12 * nB);
  // grass: painterly mottling, yellow-green lights and blue-green lows
  col = mix(col, col * mix(vec3(0.90, 0.98, 1.06), vec3(1.08, 1.05, 0.84), smoothstep(0.3, 0.7, nM * 0.6 + nF * 0.4)), grassW * 0.7);
  // dirt: pebbles and darker clods
  float peb = texture2D(uNoise, xz * 0.6).b;
  col = mix(col, col * (1.0 + 0.32 * smoothstep(0.68, 0.76, peb) - 0.16 * smoothstep(0.34, 0.26, peb)), dirtW);
  // sand: wind ripples that fade before they can alias
  float ripP = dot(xz, vec2(0.86, 0.5)) * 2.4 + nM * 8.0;
  float rip = sin(ripP) * (1.0 - smoothstep(0.6, 2.2, fwidth(ripP)));
  col = mix(col, col * (0.975 + 0.045 * rip) * (0.96 + 0.08 * nF), sandW);

  // ---- rock cliffs: coverage is baked on the CPU (hm.b rock, hm.a snow); the shader carves layered, faceted blocks ----
  vec4 hmS = texture2D(uHM, xz / ${800 .toFixed(1)} + 0.5);
  float rN2 = texture2D(uNoise, xz * 0.0071 + 0.3).g;
  // crisp, anti-aliased coverage edges broken up by two noise octaves
  float rv = hmS.b + (nF - 0.5) * 0.28 + (nM - 0.5) * 0.4;
  float rockW = smoothstep(0.5 - fwidth(rv) - 0.025, 0.5 + fwidth(rv) + 0.025, rv);
  float topE = 0.0, tri = 0.5, bandF = 0.5, farB = 1.0;
  vec3 blk = vec3(0.5);
  vec3 hz = normalize(vec3(nW.x, 0.0, nW.z) + vec3(1e-4, 0.0, 0.0));
  if (rockW > 0.001) {
    float warp = (texture2D(uNoise, xz * 0.011).g - 0.5) * 12.0 + (texture2D(uNoise, xz * 0.047).r - 0.5) * 1.6;
    float by = (hgt + warp) / 3.2;
    float row = floor(by);
    bandF = fract(by);
    farB = smoothstep(0.05, 0.22, fwidth(by));               // fine lines fade with distance: no contour stripes from the air
    // blocks along each layer, projected on the dominant horizontal axis (narrow cross-fade near 45 degrees)
    vec3 an = abs(nW) + 1e-4;
    float wx = smoothstep(0.44, 0.56, an.x / (an.x + an.z));
    vec3 bA = cliffBlock(vW.z, row), bB = cliffBlock(vW.x, row);
    blk = mix(bB, bA, wx);
    float eA = min(bA.y, 1.0 - bA.y) * bA.z, eB = min(bB.y, 1.0 - bB.y) * bB.z;   // metres to the block's end
    float crack = mix(1.0 - smoothstep(0.05, 0.07 + fwidth(vW.x) * 1.5, eB), 1.0 - smoothstep(0.05, 0.07 + fwidth(vW.z) * 1.5, eA), wx);
    crack *= smoothstep(0.12, 0.3, bandF) * (1.0 - farB);   // cracks stop at the ledge above
    float tx = texture2D(uNoise, vec2(vW.z * 0.23, hgt * 0.06)).b, tz = texture2D(uNoise, vec2(vW.x * 0.23, hgt * 0.06)).b;
    tri = mix(tz, tx, wx);
    vec3 rA = vec3(0.125, 0.112, 0.102), rB = vec3(0.29, 0.262, 0.232);
    float tone = mix(blk.x, 0.5, farB * 0.35) * 0.72 + rN2 * 0.28;
    vec3 rc = mix(rA, rB, tone);
    rc = mix(rc, rc * vec3(1.1, 0.98, 0.86), step(0.68, hash12(vec2(row, 3.0))) * 0.85);   // warm sandstone layers
    rc *= 0.88 + 0.24 * tri;
    rc *= mix(mix(0.72, 1.0, smoothstep(0.0, 0.3, bandF)), 0.94, farB);   // shaded crease at the foot of each layer
    rc *= 1.0 - 0.42 * crack;
    topE = smoothstep(0.8, 0.9, bandF) * (1.0 - smoothstep(0.965, 1.0, bandF)) * step(0.3, fract(blk.x * 5.31));
    rc = mix(rc, rc * 1.45 + vec3(0.02, 0.02, 0.015), topE * (1.0 - farB * 0.7));   // sunlit lip on top of most blocks
    col = mix(col, rc, rockW);
  }
  // ---- snow cap (plus snow lying on the rock ledges up high) ----
  float sN = texture2D(uNoise, xz * 0.019).g;
  float sv = hmS.a + (nF - 0.5) * 0.24 + (nM - 0.5) * 0.34;
  float snowW = smoothstep(0.5 - fwidth(sv) - 0.02, 0.5 + fwidth(sv) + 0.02, sv);
  snowW = max(snowW, topE * rockW * smoothstep(50.0, 64.0, hgt + (sN - 0.5) * 12.0) * (1.0 - farB * 0.6));
  vec3 snN = nW;
  float snGlint = 0.0;
  if (snowW > 0.001) {
    // wind-sculpted drifts: long ripples lying across the wind (sastrugi), patchy, warped by noise
    vec2 wd = vec2(0.8, 0.6);
    float warpS = (texture2D(uNoise, xz * 0.0093 + 0.61).r - 0.5) * 22.0 + (nM - 0.5) * 4.0;
    float dP = dot(xz, wd) * 0.9 + warpS;
    float dAA = 1.0 - smoothstep(0.35, 1.3, fwidth(dP));
    float rm = smoothstep(0.32, 0.68, texture2D(uNoise, xz * 0.027 + 0.2).g);
    float slope = (cos(dP) + 0.4 * cos(dP * 2.0 + 0.7)) * rm * dAA;
    // broad wind-scoured hummocks from the noise gradient
    float hb = texture2D(uNoise, xz * 0.041 + 0.33).r;
    float hx = texture2D(uNoise, (xz + vec2(0.8, 0.0)) * 0.041 + 0.33).r;
    float hzz = texture2D(uNoise, (xz + vec2(0.0, 0.8)) * 0.041 + 0.33).r;
    vec2 hg = vec2(hx - hb, hzz - hb) / 0.8;
    snN = normalize(nW + vec3(wd.x, 0.0, wd.y) * slope * 0.42 - vec3(hg.x, 0.0, hg.y) * 3.3);
    // hollows (lower than the ground 6 m around) collect cool blue shade
    float hc = (texture2D(uHM, (xz + vec2(6.0, 0.0)) / ${800 .toFixed(1)} + 0.5).r + texture2D(uHM, (xz - vec2(6.0, 0.0)) / ${800 .toFixed(1)} + 0.5).r
              + texture2D(uHM, (xz + vec2(0.0, 6.0)) / ${800 .toFixed(1)} + 0.5).r + texture2D(uHM, (xz - vec2(0.0, 6.0)) / ${800 .toFixed(1)} + 0.5).r) * 0.25 - hmS.r;
    float hollow = smoothstep(-0.2, 1.4, hc);
    // stylised two-tone: warm white toward the sun, soft lavender-blue away from it
    float ndl = dot(snN, uSunDir);
    vec3 sc = mix(vec3(0.44, 0.53, 0.80), vec3(0.77, 0.79, 0.84), smoothstep(0.05, 0.62, ndl));
    // sun-catching crest on each drift ripple
    sc *= 1.0 + 0.07 * smoothstep(0.75, 1.0, sin(dP)) * rm * dAA;
    sc = mix(sc, sc * vec3(0.80, 0.87, 1.0), hollow * 0.7);
    sc *= 0.95 + 0.07 * nF + 0.04 * (nM - 0.5);
    // keep the drifts readable with the sun behind the viewer: ripple sides and grazing slopes turn icy blue
    vec3 vD = normalize(cameraPosition - vW);
    sc *= 1.0 + 0.05 * slope;
    float graze = 1.0 - max(dot(snN, vD), 0.0);
    sc = mix(sc, sc * vec3(0.80, 0.88, 1.0), graze * graze * 0.55);
    col = mix(col, sc, snowW);
    // glitter: sparse sub-cell points that twinkle as the view moves, strongest in the sun's mirror direction
    vec2 gq = xz * 6.0;
    vec2 gc = floor(gq);
    float gh = hash12(gc);
    vec2 gp = fract(gq) - 0.2 - 0.6 * vec2(hash12(gc + 3.1), hash12(gc + 7.7));
    float tw = step(0.5, hash12(gc + floor(vD.xz * 14.0) * 1.37 + floor(uTime * 3.0 + gh * 9.0) * 0.11));
    float spec = pow(max(dot(reflect(-uSunDir, snN), vD), 0.0), 4.0);
    float aaG = 1.0 - smoothstep(0.12, 0.3, fwidth(gq.x));
    snGlint = step(0.9, gh) * (1.0 - smoothstep(0.03, 0.09, length(gp))) * tw * (0.35 + 2.4 * spec) * aaG * snowW;
  }

  // ---- crisp paving ----
  float sA = crisp(cls.r, 0.5), sL = crisp(cls.g, 0.5), sM = crisp(cls.b, 0.3);
  float edgeAL = smoothstep(0.82, 0.95, cls.r + cls.g);
  float curb = (crisp(cls.g, 0.5) - crisp(cls.g, 0.82)) * edgeAL;
  float gutter = (crisp(cls.r, 0.5) - crisp(cls.r, 0.78)) * edgeAL;
  // sidewalk / concrete: slabs with joints and per-slab tone
  vec3 lc = lightCol * (0.94 + 0.10 * hash12(floor(xz / 2.0) + 3.1)) * (0.93 + 0.12 * nF);
  // concrete washes out in full sun: pull it down, neutralise any tint from the ground under the paint, then weather it
  lc = mix(vec3(dot(lc, vec3(0.2126, 0.7152, 0.0722))), lc, 0.6) * vec3(0.84, 0.83, 0.80);
  float stain = smoothstep(0.5, 0.78, texture2D(uNoise, xz * 0.019 + 0.47).g) * (0.6 + 0.4 * nF);
  float oil = smoothstep(0.74, 0.8, texture2D(uNoise, xz * 0.083 + 0.13).r) * smoothstep(0.45, 0.6, texture2D(uNoise, xz * 0.011 + 0.7).b);
  lc *= (1.0 - 0.14 * stain) * (1.0 - 0.3 * oil);
  lc *= 1.0 - 0.22 * max(joint(vW.x, 2.0, 0.03), joint(vW.z, 2.0, 0.03));
  lc *= 1.0 - 0.18 * max(joint(vW.x + 1.0, 6.0, 0.045), joint(vW.z + 1.0, 6.0, 0.045));
  lc = mix(lc, lc * 1.18 + 0.02, curb);
  // asphalt: aggregate, repair patches and tar-sealed cracks
  float agg = texture2D(uNoise, xz * 0.7).b;
  float pn = texture2D(uNoise, xz * 0.04 + 0.21).r;
  vec3 ac = vec3(0.150, 0.162, 0.190) * (0.9 + 0.2 * agg) * (0.92 + 0.16 * pn);
  float cn = texture2D(uNoise, xz * 0.09).g;
  float crack = (1.0 - smoothstep(0.0, 0.008 + fwidth(cn) * 1.2, abs(cn - 0.5))) * smoothstep(0.56, 0.7, texture2D(uNoise, xz * 0.021 + 0.37).r);
  ac *= (1.0 - 0.3 * crack) * (1.0 - 0.38 * gutter);
  // markings: yellow or white from the painted colour, slightly worn
  float yel = smoothstep(0.02, 0.08, (alb.r + alb.g) * 0.5 - alb.b);
  vec3 mc = mix(vec3(0.84, 0.84, 0.80), vec3(0.88, 0.60, 0.06), yel) * (0.94 + 0.08 * nF);
  sM *= 1.0 - 0.5 * smoothstep(0.55, 0.8, texture2D(uNoise, xz * 0.37 + 0.5).b) * smoothstep(0.45, 0.7, texture2D(uNoise, xz * 0.05).r);
  col = mix(col, lc, sL);
  col = mix(col, ac, sA);
  col = mix(col, mc, sM);
  col *= cloudTint(xz);
  diffuseColor.rgb *= col;
`, Dk = `
  if (snowW > 0.01) {
    vec3 nS = normalize(mix(nW, snN, snowW));
    normal = normalize((viewMatrix * vec4(nS, 0.0)).xyz);
  }
  if (rockW > 0.01) {
    // chunky facets: each block faces a slightly different way, the lip of each layer tilts up into a ledge
    float yaw = (fract(blk.x * 7.13) - 0.5) * 1.1 * (1.0 - farB * 0.65);
    float cy = cos(yaw), sy = sin(yaw);
    vec3 fh = vec3(hz.x * cy - hz.z * sy, 0.0, hz.x * sy + hz.z * cy);
    vec3 face = normalize(fh + vec3(0.0, 0.3 + 0.35 * fract(blk.x * 3.71), 0.0) + vec3(tri - 0.5, 0.0, 0.5 - tri) * 0.25);
    vec3 ledge = normalize(vec3(0.0, 1.0, 0.0) + hz * 0.25);
    vec3 st = normalize(mix(face, ledge, topE));
    vec3 nP = normalize(mix(nW, st, rockW * 0.75 * (1.0 - snowW)));
    normal = normalize((viewMatrix * vec4(nP, 0.0)).xyz);
  }
`, Ok = class {
  mesh;
  albedo;
  classMap;
  hm;
  mapCanvas;
  grassMask;
  build(e4, t2, r) {
    let i = document.createElement(`canvas`);
    i.width = i.height = QO;
    let a = i.getContext(`2d`), o = a.createImageData(QO, QO), c = document.createElement(`canvas`);
    c.width = c.height = QO;
    let l2 = c.getContext(`2d`, { willReadFrequently: true }), u = l2.createImageData(QO, QO), d = [0, 0, 0], f = new Uint8Array(QO * QO * 2);
    for (let e5 = 0; e5 < QO; e5++) {
      let t3 = (e5 + 0.5) / QO * 800 - 400;
      for (let n2 = 0; n2 < QO; n2++) {
        let r2 = (n2 + 0.5) / QO * 800 - 400, i2 = ay(r2, t3), a2 = oy(r2, t3), s2 = Hp(r2 * 0.0105, t3 * 0.0105, 3), c2 = Hp(r2 * 0.045 + 50, t3 * 0.045, 2), l3 = Vp(r2 * 0.33, t3 * 0.33);
        d[0] = nk[0], d[1] = nk[1], d[2] = nk[2], mk(d, tk, Ep(-0.2, 0.4, s2) * 0.85), mk(d, rk, Ep(0.05, 0.55, -s2) * 0.7), mk(d, ik, Ep(0.2, 0.55, c2) * 0.45), mk(d, ak, ly(r2, t3) * 0.4);
        const snowBiome = Ep(-65,-190,t3 - Math.max(0,r2-20)*.35 + s2*25) * Ep(-35,45,r2) * Ep(-10,7,i2);
        const desertBiome = 0;
        const autumnBiome = Ep(75,-30,r2+s2*25) * Ep(-310,-245,t3) * Ep(200,120,t3) * Ep(-2,8,i2);
        mk(d, [216, 232, 227], snowBiome * .94);
        mk(d, [218, 176, 122], desertBiome * .88);
        mk(d, [152, 125, 65], autumnBiome * .36);
        let p2 = 1 + l3 * 0.045;
        d[0] *= p2, d[1] *= p2, d[2] *= p2;
        let m2 = +(i2 > 1.9), h2 = Ep(42, 60, i2 + c2 * 5);
        mk(d, pk, h2 * 0.6);
        let g3 = hk(r2, t3, i2, a2), _2 = Math.max(gk(r2, t3, i2, a2), snowBiome * .85);
        f[(e5 * QO + n2) * 2] = g3 * 255, f[(e5 * QO + n2) * 2 + 1] = _2 * 255;
        let v2 = Ep(3.1, 1.5, i2 + c2 * 0.9);
        mk(d, ok, v2), mk(d, sk, Ep(0.7, 0, i2) * v2), i2 < 0 && (mk(d, ck, Ep(0, -1.5, i2)), mk(d, lk, Ep(-1.5, -7, i2))), m2 *= (1 - desertBiome * .93) * (1 - Ep(0.08, 0.3, g3)) * (1 - Ep(0.1, 0.3, _2)) * (1 - v2) * (1 - h2 * 0.5);
        let y2 = (e5 * QO + n2) * 4;
        o.data[y2] = d[0], o.data[y2 + 1] = d[1], o.data[y2 + 2] = d[2], o.data[y2 + 3] = 255;
        let b2 = m2 * 255;
        u.data[y2] = u.data[y2 + 1] = u.data[y2 + 2] = b2, u.data[y2 + 3] = 255;
      }
    }
    a.putImageData(o, 0, 0), l2.putImageData(u, 0, 0);
    let p = document.createElement(`canvas`);
    p.width = p.height = ZO;
    let m = p.getContext(`2d`, { willReadFrequently: true });
    m.imageSmoothingEnabled = true, m.imageSmoothingQuality = `high`, m.drawImage(i, 0, 0, ZO, ZO);
    let h = document.createElement(`canvas`);
    h.width = h.height = ZO;
    let g2 = h.getContext(`2d`);
    g2.fillStyle = `#000`, g2.fillRect(0, 0, ZO, ZO);
    let v = ZO / 800, y = QO / 800;
    m.setTransform(v, 0, 0, v, ZO / 2, ZO / 2), g2.setTransform(v, 0, 0, v, ZO / 2, ZO / 2), l2.setTransform(y, 0, 0, y, QO / 2, QO / 2);
    for (let e5 of uy) wk(m, e5.pts, e5.width, false), wk(l2, e5.pts, e5.width, true);
    for (let t3 of e4) _k(m, t3), Ck(g2, t3), t3.noGrass && _k(l2, t3, `#000`);
    let b = -fp.x / fp.y, x = -fp.z / fp.y;
    for (let e5 of t2) {
      let t3 = e5.x + b * e5.r * 0.5, n2 = e5.z + x * e5.r * 0.5, r2 = m.createRadialGradient(t3, n2, e5.r * 0.15, t3, n2, e5.r * 1.25);
      r2.addColorStop(0, `rgba(26,62,48,${e5.a * 0.85})`), r2.addColorStop(1, `rgba(26,62,48,0)`), m.fillStyle = r2, m.beginPath(), m.ellipse(t3, n2, e5.r * 1.25, e5.r * 1.25, 0, 0, Math.PI * 2), m.fill();
    }
    m.setTransform(1, 0, 0, 1, 0, 0), g2.setTransform(1, 0, 0, 1, 0, 0), l2.setTransform(1, 0, 0, 1, 0, 0), this.albedo = new Na(p), this.albedo.colorSpace = He, this.albedo.anisotropy = 8, this.albedo.wrapS = this.albedo.wrapT = n, this.albedo.flipY = false, this.classMap = new Na(h), this.classMap.colorSpace = ``, this.classMap.anisotropy = 8, this.classMap.wrapS = this.classMap.wrapT = n, this.classMap.flipY = false;
    let S = l2.getImageData(0, 0, QO, QO).data;
    this.grassMask = new Uint8Array(QO * QO);
    let C = new Uint16Array(QO * QO * 4);
    for (let e5 = 0; e5 < QO; e5++) {
      let t3 = (e5 + 0.5) / QO * 800 - 400;
      for (let n2 = 0; n2 < QO; n2++) {
        let r2 = e5 * QO + n2;
        this.grassMask[r2] = S[r2 * 4], C[r2 * 4] = Cr.toHalfFloat(ay((n2 + 0.5) / QO * 800 - 400, t3)), C[r2 * 4 + 1] = Cr.toHalfFloat(S[r2 * 4] / 255), C[r2 * 4 + 2] = Cr.toHalfFloat(f[r2 * 2] / 255), C[r2 * 4 + 3] = Cr.toHalfFloat(f[r2 * 2 + 1] / 255);
      }
    }
    this.hm = new Ki(C, QO, QO, T, _), this.hm.magFilter = this.hm.minFilter = s, this.hm.wrapS = this.hm.wrapT = n, this.hm.needsUpdate = true, this.buildMesh(), this.buildMap(p, r, f);
  }
  buildMesh() {
    let e4 = new Float32Array(309123), t2 = new Float32Array(309123), n2 = new Float32Array(206082), r = { x: 0, y: 1, z: 0 };
    for (let i2 = 0; i2 < 321; i2++) for (let a2 = 0; a2 < 321; a2++) {
      let o2 = i2 * 321 + a2, s3 = -400 + a2 * Kv, c2 = -400 + i2 * Kv;
      e4[o2 * 3] = s3, e4[o2 * 3 + 1] = Zv[o2], e4[o2 * 3 + 2] = c2, sy(s3, c2, r), t2[o2 * 3] = r.x, t2[o2 * 3 + 1] = r.y, t2[o2 * 3 + 2] = r.z, n2[o2 * 2] = a2 / 320, n2[o2 * 2 + 1] = i2 / 320;
    }
    let i = new Uint32Array(614400), a = 0;
    for (let e5 = 0; e5 < 320; e5++) for (let t3 = 0; t3 < 320; t3++) {
      let n3 = e5 * 321 + t3, r2 = n3 + 1, o2 = n3 + 321, s3 = o2 + 1;
      i[a++] = n3, i[a++] = o2, i[a++] = r2, i[a++] = r2, i[a++] = o2, i[a++] = s3;
    }
    let o = new Hr();
    o.setAttribute(`position`, new Dr(e4, 3)), o.setAttribute(`normal`, new Dr(t2, 3)), o.setAttribute(`uv`, new Dr(n2, 2)), o.setIndex(new Dr(i, 1)), o.computeBoundingSphere(), o.computeBoundingBox();
    let s2 = new Os({ map: this.albedo, roughness: 0.94, metalness: 0 }), c = this.classMap, l2 = this.hm;
    s2.onBeforeCompile = (e5) => {
      e5.uniforms.uHM = { value: l2 }, e5.uniforms.uNoise = Z.uNoise, e5.uniforms.uTime = Z.uTime, e5.uniforms.uClass = { value: c }, e5.uniforms.uTexel = { value: 1 / ZO }, e5.uniforms.uSunDir = Z.uSunDir, e5.vertexShader = e5.vertexShader.replace(`#include <common>`, `#include <common>
varying vec3 vW;
varying vec3 vWN;`).replace(`#include <begin_vertex>`, `#include <begin_vertex>
vW = position;
vWN = normal;`), e5.fragmentShader = e5.fragmentShader.replace(`#include <common>`, `#include <common>
${Tk}`).replace(`#include <map_fragment>`, Ek).replace(`#include <normal_fragment_maps>`, `#include <normal_fragment_maps>
${Dk}`).replace(`#include <emissivemap_fragment>`, `#include <emissivemap_fragment>
totalEmissiveRadiance += vec3(0.9, 0.95, 1.0) * snGlint * 2.6;`);
    }, this.mesh = new Mi(o, s2), this.mesh.receiveShadow = true, this.mesh.matrixAutoUpdate = false;
  }
  buildMap(e4, t2, n2) {
    let r = document.createElement(`canvas`);
    r.width = r.height = $O;
    let i = r.getContext(`2d`);
    i.drawImage(e4, 0, 0, $O, $O);
    let a = i.getImageData(0, 0, $O, $O), o = a.data, s2 = { x: 0, y: 1, z: 0 };
    for (let e5 = 0; e5 < $O; e5++) {
      let t3 = (e5 + 0.5) / $O * 800 - 400;
      for (let r2 = 0; r2 < $O; r2++) {
        let i2 = (r2 + 0.5) / $O * 800 - 400, a2 = (e5 * $O + r2) * 4, c2 = ay(i2, t3);
        if (c2 < 0) {
          let e6 = Ep(0, -6, c2), t4 = c2 > -0.35 ? 0.55 : 0;
          o[a2] = Tp(Tp(64, 22, e6), 255, t4), o[a2 + 1] = Tp(Tp(196, 112, e6), 255, t4), o[a2 + 2] = Tp(Tp(226, 196, e6), 255, t4);
        } else {
          let c3 = (Math.min(1023, e5 * QO / $O | 0) * QO + Math.min(1023, r2 * QO / $O | 0)) * 2, l2 = Ep(0.35, 0.65, n2[c3] / 255), u = Ep(0.35, 0.65, n2[c3 + 1] / 255);
          if (l2 > 0 || u > 0) {
            let e6 = wp(0.5 + Hp(i2 * 0.05, t3 * 0.05, 2)), n3 = [o[a2], o[a2 + 1], o[a2 + 2]];
            mk(n3, [Tp(uk[0], dk[0], e6), Tp(uk[1], dk[1], e6), Tp(uk[2], dk[2], e6)], l2), mk(n3, fk, u), o[a2] = n3[0], o[a2 + 1] = n3[1], o[a2 + 2] = n3[2];
          }
          sy(i2, t3, s2);
          let d = 0.72 + 0.62 * Math.max(0, s2.x * -0.55 + s2.y * 0.62 + s2.z * -0.56);
          o[a2] = Math.min(255, o[a2] * d), o[a2 + 1] = Math.min(255, o[a2 + 1] * d), o[a2 + 2] = Math.min(255, o[a2 + 2] * d);
        }
      }
    }
    i.putImageData(a, 0, 0);
    let c = $O / 800;
    i.setTransform(c, 0, 0, c, $O / 2, $O / 2);
    for (let e5 of t2) i.fillStyle = `rgba(0,0,0,0.35)`, i.fillRect(e5.x - e5.w / 2 + 1.2, e5.z - e5.d / 2 + 1.2, e5.w, e5.d), i.fillStyle = e5.color, i.fillRect(e5.x - e5.w / 2, e5.z - e5.d / 2, e5.w, e5.d), i.strokeStyle = `rgba(30,30,40,0.7)`, i.lineWidth = 0.6, i.strokeRect(e5.x - e5.w / 2, e5.z - e5.d / 2, e5.w, e5.d);
    i.setTransform(1, 0, 0, 1, 0, 0), r.dataset.labels = `off`, this.mapCanvas = r;
  }
}, kk = { autumn: 4, oak: 4, pine: 3, palm: 2, bush: 3, rock: 4, birch: 2, flower: 3 }, Ak = { autumn: { mat:`wood`, hp:200, yield:50, radius:.42, height:5.5, shadow:3.4, label:`Autumn Tree` }, oak: { mat: `wood`, hp: 200, yield: 50, radius: 0.42, height: 5.5, shadow: 3.4, label: `Tree` }, pine: { mat: `wood`, hp: 240, yield: 60, radius: 0.36, height: 7, shadow: 2.6, label: `Pine` }, palm: { mat: `wood`, hp: 120, yield: 30, radius: 0.3, height: 6, shadow: 2.2, label: `Palm` }, bush: { mat: `wood`, hp: 40, yield: 8, radius: 0, height: 0, shadow: 1.1, label: `Bush` }, rock: { mat: `stone`, hp: 260, yield: 45, radius: 1, height: 1.15, shadow: 1.5, label: `Rock` }, birch: { mat: `wood`, hp: 150, yield: 40, radius: 0.26, height: 6, shadow: 2.3, label: `Birch` }, flower: { mat: `wood`, hp: 10, yield: 0, radius: 0, height: 0, shadow: 0, label: `Flowers` } }, jk = { autumn: 200, oak: 200, pine: 200, palm: 200, bush: 400, rock: 200, birch: 200, flower: 400 }, Mk = new R(), Nk = (e4) => new B().setHex(e4);
function Pk(e4, t2, n2, r, i, a, o, s2, c = 1, l2 = 0.45) {
  let u = new fs(1, c), d = u.getAttribute(`position`);
  for (let c2 = 0; c2 < d.count; c2++) {
    Mk.fromBufferAttribute(d, c2);
    let u2 = a * (1 + Vp(Mk.x * 1.9 + Mk.y * 1.3 + s2, Mk.z * 1.9 - Mk.y * 0.9 + s2 * 0.37) * 0.22), f = Mk.y;
    f < -l2 && (f = -l2 + (f + l2) * 0.35), e4.push(n2 + Mk.x * u2, r + f * u2 * o, i + Mk.z * u2), t2.push(Mk.x, Mk.y, Mk.z);
  }
  u.dispose();
}
function Fk(e4, t2, n2, r, i, a, o, s2, c, l2) {
  let u = 1 / 0, d = -1 / 0;
  for (let e5 = 1; e5 < t2.length; e5 += 3) u = Math.min(u, t2[e5]), d = Math.max(d, t2[e5]);
  let f = Nk(o), p = Nk(s2), m = Nk(c), h = new B(), g2 = [];
  for (let e5 = 0; e5 < t2.length; e5 += 3) {
    Mk.set(t2[e5] - r, (t2[e5 + 1] - i) * 1.2, t2[e5 + 2] - a).normalize();
    let o2 = n2[e5] * 0.45 + Mk.x * 0.55, s3 = n2[e5 + 1] * 0.45 + Mk.y * 0.55, c2 = n2[e5 + 2] * 0.45 + Mk.z * 0.55, _3 = 1 / Math.hypot(o2, s3, c2);
    n2[e5] = o2 * _3, n2[e5 + 1] = s3 * _3, n2[e5 + 2] = c2 * _3;
    let v = (t2[e5 + 1] - u) / Math.max(1e-3, d - u);
    v = Math.min(1, Math.max(0, v * 0.7 + n2[e5 + 1] * 0.32 + Vp(t2[e5] * 0.9 + l2, t2[e5 + 2] * 0.9) * 0.14)), v < 0.5 ? h.copy(f).lerp(p, v * 2) : h.copy(p).lerp(m, (v - 0.5) * 2), g2.push(h.r, h.g, h.b);
  }
  let _2 = e4;
  for (let e5 = 0; e5 < t2.length; e5++) _2.pos.push(t2[e5]), _2.nor.push(n2[e5]), _2.col.push(g2[e5]);
}
function Ik(e4, t2, n2, r, i, a, o = 0) {
  e4.cyl(r, n2, t2, i, q(o * t2 * 0.5, t2 / 2, 0, 0, 0, -o), 8, a), e4.cone(n2 * 1.7, 0.9, Lk(i, 0.9), q(0, 0.38, 0), 8, i);
}
function Lk(e4, t2) {
  let n2 = Math.min(255, Math.round((e4 >> 16 & 255) * t2)), r = Math.min(255, Math.round((e4 >> 8 & 255) * t2)), i = Math.min(255, Math.round((e4 & 255) * t2));
  return n2 << 16 | r << 8 | i;
}
function Rk(e4, t2, n2, r, i, a, o, s2, c) {
  e4.cyl(s2 * 0.55, s2, o, c, q(t2 + Math.cos(i) * o * 0.35, n2 + o * 0.4 * a, r + Math.sin(i) * o * 0.35, Math.sin(i) * (1.25 - a), 0, -Math.cos(i) * (1.25 - a)), 5);
}
function zk(e4, autumn = false) {
  let t2 = new jp(100 + e4 * 17), n2 = new gm(), r = [], i = [], a = 7228464, o = 8675391, s2 = 0, c = 0;
  if (e4 === 0) {
    let e5 = 3.2, l3 = 0.03;
    s2 = l3 * e5, c = 4.800000000000001, Ik(n2, e5, 0.42, 0.22, a, o, l3);
    for (let e6 = 0; e6 < 3; e6++) Rk(n2, s2, 2.6, 0, e6 * 2.1 + 0.4, 0.55, 1.7, 0.13, 7755066);
    Pk(r, i, s2, c, 0, 2.1, 0.86, 9.1, 2);
    for (let e6 = 0; e6 < 6; e6++) {
      let n3 = e6 / 6 * 6.283 + t2.range(-0.3, 0.3), a2 = t2.range(1.5, 1.95);
      Pk(r, i, s2 + Math.cos(n3) * a2, c + t2.range(-0.7, 0.2), Math.sin(n3) * a2, t2.range(1.15, 1.5), 0.82, 5.3 + e6 * 2.7);
    }
    for (let e6 = 0; e6 < 3; e6++) {
      let t3 = e6 * 2.1 + 0.9;
      Pk(r, i, s2 + Math.cos(t3) * 0.8, c + 1.3, Math.sin(t3) * 0.8, 1.15, 0.8, 40 + e6);
    }
  } else if (e4 === 1) {
    c = 4.3, Ik(n2, 2.6, 0.48, 0.26, a, o, -0.02);
    for (let e5 = 0; e5 < 4; e5++) Rk(n2, 0, 2.2, 0, e5 / 4 * 6.283 + 0.3, 0.45, 2.4, 0.17, 7755066);
    for (let e5 = 0; e5 < 8; e5++) {
      let n3 = e5 / 8 * 6.283 + t2.range(-0.25, 0.25), a2 = t2.range(2, 2.7);
      Pk(r, i, Math.cos(n3) * a2, c + t2.range(-0.4, 0.3), Math.sin(n3) * a2, t2.range(1.25, 1.6), 0.7, 3.3 + e5 * 1.9);
    }
    Pk(r, i, 0, c + 0.5, 0, 2, 0.7, 11.7, 2);
    for (let e5 = 0; e5 < 3; e5++) {
      let t3 = e5 * 2.1;
      Pk(r, i, Math.cos(t3) * 1.1, c + 1.25, Math.sin(t3) * 1.1, 1.2, 0.72, 60 + e5);
    }
  } else if (e4 === 2) {
    let e5 = -0.04;
    s2 = e5 * 4, c = 5.4, Ik(n2, 5.6, 0.4, 0.2, a, o, e5);
    for (let e6 = 0; e6 < 5; e6++) {
      let n3 = e6 / 5 * 6.283 + t2.range(-0.3, 0.3), a2 = t2.range(1.3, 1.7);
      Pk(r, i, s2 + Math.cos(n3) * a2, c + t2.range(-0.4, 0.2), Math.sin(n3) * a2, t2.range(1.1, 1.4), 0.8, 7.7 + e6 * 2.1);
    }
    Pk(r, i, s2, c + 0.3, 0, 1.7, 0.85, 17.1, 1);
    for (let e6 = 0; e6 < 4; e6++) {
      let n3 = e6 / 4 * 6.283 + 0.6;
      Pk(r, i, s2 * 1.4 + Math.cos(n3) * 1, c + 2, Math.sin(n3) * 1, t2.range(1, 1.25), 0.82, 27 + e6 * 3.1);
    }
    Pk(r, i, s2 * 1.6, c + 3, 0, 1.15, 0.85, 33.3);
  } else {
    c = 3.5, Ik(n2, 2.3, 0.3, 0.16, a, o, 0.02), Pk(r, i, 0, c, 0, 1.6, 0.9, 44.4, 2);
    for (let e5 = 0; e5 < 4; e5++) {
      let n3 = e5 / 4 * 6.283 + 0.4;
      Pk(r, i, Math.cos(n3) * 1.05, c + t2.range(-0.3, 0.4), Math.sin(n3) * 1.05, t2.range(0.95, 1.15), 0.85, 50 + e5 * 1.7);
    }
  }
  // The crown must overlap the trunk, rather than hovering above a short stump.
  const trunkTop = [3.2, 2.6, 5.6, 2.3][e4 % 4];
  const crownJoint = [4.35, 4.05, 5.7, 3.35][e4 % 4];
  if (crownJoint > trunkTop) {
    const height = crownJoint - trunkTop + .3;
    n2.cyl(.16, .23, height, a, q(s2, trunkTop + height / 2 - .15, 0), 8, o);
  }
  let l2 = (autumn ? [[0x702b19,0xb44a20,0xffa241],[0x85251b,0xd44e24,0xffbc50],[0x6c2819,0xaf3e24,0xf68138],[0x823019,0xd65e1d,0xffb751]] : [[2383914, 4954675, 10146901], [2778406, 5676337, 10932558], [2054702, 4427578, 9096024], [2910756, 5939764, 11392850]])[e4 % 4];
  return Fk(n2, r, i, s2, c, 0, l2[0], l2[1], l2[2], e4 * 7), n2.build();
}
function Bk(e4, t2, n2) {
  let r = new ps([new L(1e-4, t2 * 0.16), new L(e4 * 0.86, -t2 * 0.06), new L(e4, -t2 * 0.02), new L(e4 * 0.74, t2 * 0.28), new L(e4 * 0.36, t2 * 0.66), new L(1e-4, t2)], 11), i = r.getAttribute(`position`);
  for (let t3 = 0; t3 < i.count; t3++) {
    let r2 = i.getX(t3), a = i.getY(t3), o = i.getZ(t3);
    if (Math.hypot(r2, o) > e4 * 0.8) {
      let e5 = Math.atan2(o, r2), s2 = 1 + Math.sin(e5 * 5.5 + n2) * 0.1;
      i.setX(t3, r2 * s2), i.setZ(t3, o * s2), i.setY(t3, a - 0.12 - (Math.cos(e5 * 5.5 + n2 * 1.3) * 0.5 + 0.5) * 0.22);
    }
  }
  return r.computeVertexNormals(), r;
}
function Vk(e4) {
  let t2 = new jp(300 + e4 * 31), n2 = new gm(), r = [{ th: 2.1, layers: 5, rad: 2.6, shrink: 0.76, h: 2.4 }, { th: 2.6, layers: 6, rad: 2.2, shrink: 0.8, h: 2.3 }, { th: 1.5, layers: 4, rad: 3, shrink: 0.72, h: 2.5 }][e4 % 3];
  n2.cyl(0.15, 0.36, r.th + 2.6, 6111272, q(0, (r.th + 2.6) / 2, 0), 7, 7228980), n2.cone(0.62, 0.8, 5519647, q(0, 0.32, 0), 7, 6111272);
  let i = r.th, a = r.rad, o = [[1920816, 5216850], [2120245, 5941339], [1788461, 4689484]][e4 % 3];
  for (let s2 = 0; s2 < r.layers; s2++) {
    let c = r.h - s2 * 0.1, l2 = Bk(a, c, s2 * 1.7 + e4);
    n2.add(l2, o[0], q(t2.range(-0.05, 0.05), i, t2.range(-0.05, 0.05), 0, t2.range(0, 6)), s2 === r.layers - 1 ? 7125090 : o[1]), l2.dispose(), i += c * 0.5, a *= r.shrink;
  }
  return n2.build();
}
function Hk(e4, t2, n2) {
  let r = [], i = (t3) => [t3 * e4, Math.sin(t3 * Math.PI * 0.62) * e4 * 0.22 - t3 * t3 * n2 * e4], a = (e5, t3, n3, i2) => {
    r.push(...e5, ...t3, ...n3, ...t3, ...i2, ...n3), r.push(...e5, ...n3, ...t3, ...t3, ...n3, ...i2);
  };
  for (let e5 = 0; e5 < 9; e5++) {
    let n3 = e5 / 9, r2 = (e5 + 1) / 9, [o2, s2] = i(n3), [c, l2] = i(r2), u = (e6, n4) => t2 * Math.sin(Math.min(1, e6 * 1.15) * Math.PI) * (n4 % 2 ? 0.78 : 1), d = u(n3, e5), f = u(r2, e5 + 1), p = d * 0.3, m = f * 0.3;
    for (let e6 of [-1, 1]) a([0, s2, o2], [e6 * d, s2 + p - 0.04, o2 + 0.12], [0, l2, c], [e6 * f, l2 + m - 0.04, c + 0.12]);
  }
  let o = new Hr();
  return o.setAttribute(`position`, new V(r, 3)), o.computeVertexNormals(), o;
}
function Uk(e4) {
  let t2 = new jp(500 + e4 * 13), n2 = new gm(), r = 5.6 + e4 % 2 * 0.9, i = 0.9 + e4 % 2 * 0.6, a = 0, o = 0;
  for (let e5 = 0; e5 < 8; e5++) {
    let t3 = e5 / 8, s2 = (e5 + 1) / 8, c = i * s2 * s2, l2 = r * s2, u = Math.atan2(c - a, l2 - o), d = Math.hypot(c - a, l2 - o);
    n2.cyl(0.22 - s2 * 0.06, 0.19 - t3 * 0.05, d + 0.04, e5 % 2 ? 11045980 : 9992524, q((a + c) / 2, (o + l2) / 2, 0, 0, 0, -u), 7, 12623980), a = c, o = l2;
  }
  for (let e5 = 0; e5 < 10; e5++) {
    let r2 = e5 / 10 * 6.283 + t2.range(-0.2, 0.2), i2 = t2.range(2.5, 3.2), s2 = t2.range(-0.15, 0.35), c = Hk(i2, t2.range(0.45, 0.58), t2.range(0.55, 0.9)), l2 = new z().makeTranslation(a, o + 0.05, 0).multiply(new z().makeRotationY(r2)).multiply(new z().makeRotationX(-s2));
    n2.add(c, 3115573, l2, 9425746), c.dispose();
  }
  n2.ico(0.32, 7047738, q(a, o + 0.05, 0, 0, 0, 0, 1, 0.7, 1), 1);
  for (let e5 = 0; e5 < 3; e5++) n2.sphere(0.17, 5913892, q(a + Math.cos(e5 * 2.1) * 0.24, o - 0.16, Math.sin(e5 * 2.1) * 0.24), 7, 5);
  return n2.build();
}
function Wk(e4) {
  let t2 = new jp(900 + e4 * 23), n2 = new gm(), r = 4.2 + e4 * 0.9, i = (e4 ? -1 : 1) * 0.04;
  n2.cyl(0.13, 0.24, r + 1.4, 15328732, q(i * r * 0.5, (r + 1.4) / 2, 0, 0, 0, -i), 8, 16052714), n2.cone(0.38, 0.6, 14209734, q(0, 0.25, 0), 8, 15328732);
  for (let e5 = 0; e5 < 9; e5++) {
    let e6 = t2.range(0.6, r + 0.8), a2 = t2.range(0, 6.28), o2 = 0.2 - e6 / (r + 1.4) * 0.08;
    n2.box(0.16, t2.range(0.05, 0.1), 0.05, 3814961, q(Math.cos(a2) * o2 + i * e6, e6, Math.sin(a2) * o2, 0, -a2 + Math.PI / 2, 0));
  }
  for (let e5 = 0; e5 < 2; e5++) Rk(n2, i * r, r - 0.3, 0, e5 * 3.1 + 0.6, 0.6, 1.3, 0.07, 14275527);
  let a = [], o = [], s2 = i * r * 1.1, c = r + 1.4;
  Pk(a, o, s2, c, 0, 1.45, 1.25, 71.7 + e4, 1);
  for (let e5 = 0; e5 < 5; e5++) {
    let n3 = e5 / 5 * 6.283 + t2.range(-0.3, 0.3), r2 = t2.range(0.85, 1.15);
    Pk(a, o, s2 + Math.cos(n3) * r2, c + t2.range(-0.9, 1), Math.sin(n3) * r2, t2.range(0.8, 1.05), 1.2, 80 + e5 * 2.3);
  }
  return Pk(a, o, s2, c + 1.7, 0, 0.9, 1.2, 99.1), Fk(n2, a, o, s2, c, 0, 4885034, 9224509, 13822066, e4 * 5 + 30), n2.build();
}
function Gk(e4) {
  let t2 = new jp(700 + e4 * 7), n2 = new gm(), r = [], i = [], a = e4 === 1 ? 6 : 4 + e4;
  for (let n3 = 0; n3 < a; n3++) {
    let o = n3 / a * 6.283, s2 = n3 === 0 ? 0 : t2.range(0.45, e4 === 1 ? 1.05 : 0.8);
    Pk(r, i, Math.cos(o) * s2, t2.range(0.35, 0.6) * (e4 === 1 ? 0.8 : 1), Math.sin(o) * s2, t2.range(0.55, 0.85), e4 === 1 ? 0.7 : 0.85, e4 * 4 + n3 * 3.1);
  }
  if (Fk(n2, r, i, 0, 0.3, 0, 2779688, 5413941, 10278232, e4 * 3 + 60), e4 === 2) for (let e5 = 0; e5 < 16; e5++) {
    let r2 = t2.range(0, 6.28), i2 = t2.range(0.2, 1), a2 = 0.95 - i2 * i2 * 0.45 + t2.range(-0.05, 0.1);
    n2.ico(0.09, e5 % 3 ? 16748472 : 16773878, q(Math.cos(r2) * i2, a2, Math.sin(r2) * i2), 0);
  }
  return n2.build();
}
function Kk(e4) {
  let t2 = [], n2 = new jp(1300 + e4 * 41), r = (e5, n3, r2, i2, a2, o2, s3 = 0.55) => {
    let c2 = new fs(1, e5), l3 = c2.getAttribute(`position`);
    for (let e6 = 0; e6 < l3.count; e6++) {
      Mk.fromBufferAttribute(l3, e6);
      let t3 = 1 + Vp(Mk.x * 1.4 + a2, Mk.z * 1.4 + Mk.y * 1.9 + a2 * 0.3) * 0.28, o3 = Mk.y * t3;
      o3 > s3 && (o3 = s3 + (o3 - s3) * 0.3), l3.setXYZ(e6, Mk.x * t3 * n3, Math.max(-0.3, o3) * r2 + 0.3 * r2, Mk.z * t3 * i2);
    }
    t2.push({ g: c2, m: o2 });
  };
  if (e4 === 0) r(1, 1.25, 0.85, 1, 11, q());
  else if (e4 === 1) r(1, 1.55, 0.55, 1.2, 23, q(), 0.35);
  else if (e4 === 2) r(0, 0.75, 1.5, 0.7, 31, q(0, 0, 0, 0.12, 0, -0.1)), r(0, 0.6, 1.05, 0.55, 37, q(0.75, 0, 0.25, -0.1, 0.6, 0.25)), r(0, 0.55, 0.7, 0.6, 43, q(-0.55, 0, 0.5, 0.2, 1.3, 0.1));
  else {
    let e5 = 0;
    for (let t3 = 0; t3 < 4; t3++) {
      let i2 = 1.35 - t3 * 0.22;
      r(1, i2 * n2.range(0.95, 1.15), 0.34, i2 * n2.range(0.8, 1), 50 + t3 * 7, q(n2.range(-0.15, 0.15), e5, n2.range(-0.15, 0.15), 0, n2.range(0, 6.28), 0), 0.2), e5 += 0.36;
    }
  }
  let i = [];
  for (let { g: e5, m: n3 } of t2) {
    let t3 = e5.index ? e5.toNonIndexed() : e5;
    t3.applyMatrix4(n3);
    let r2 = t3.getAttribute(`position`);
    for (let e6 = 0; e6 < r2.count; e6++) i.push(r2.getX(e6), r2.getY(e6), r2.getZ(e6));
    t3 !== e5 && t3.dispose(), e5.dispose();
  }
  let a = new Hr();
  a.setAttribute(`position`, new V(i, 3)), a.computeVertexNormals();
  let o = a.getAttribute(`normal`), s2 = a.getAttribute(`position`), c = Nk(12827305), l2 = Nk(10195589), u = Nk(7893350), d = Nk(8365646), f = new B(), p = [];
  for (let t3 = 0; t3 < s2.count; t3 += 3) {
    let n3 = o.getY(t3), r2 = 0.5 + 0.5 * Vp(s2.getX(t3) * 2.2 + e4 * 3, s2.getZ(t3) * 2.2 + s2.getY(t3));
    n3 > 0.55 ? f.copy(l2).lerp(c, 0.55 + r2 * 0.45) : n3 > -0.2 ? f.copy(u).lerp(l2, 0.55 + r2 * 0.4) : f.copy(u).multiplyScalar(0.92), n3 > 0.8 && r2 > 0.45 && f.lerp(d, 0.55);
    for (let e5 = 0; e5 < 3; e5++) p.push(f.r, f.g, f.b);
  }
  return a.setAttribute(`color`, new V(p, 3)), a.computeBoundingSphere(), a;
}
function qk(e4) {
  let t2 = new jp(1700 + e4 * 19), n2 = new gm(), r = [[16777215, 16765498], [16740250, 16769898], [9076223, 16773536]][e4 % 3];
  for (let e5 = 0; e5 < 9; e5++) {
    let e6 = t2.range(0, 6.28), i = Math.sqrt(t2.next()) * 0.75, a = Math.cos(e6) * i, o = Math.sin(e6) * i, s2 = t2.range(0.28, 0.5);
    n2.cyl(0.012, 0.018, s2, 5216821, q(a, s2 / 2, o), 3), n2.box(0.16, 0.02, 0.06, 6073148, q(a, s2 * 0.4, o, 0, e6, 0.5)), n2.ico(0.075, r[0], q(a, s2 + 0.01, o, 0, t2.range(0, 3), 0, 1, 0.45, 1), 0), n2.ico(0.032, r[1], q(a, s2 + 0.035, o), 0);
  }
  return n2.build();
}
var Jk = { autumn: (variant) => zk(variant, true), oak: zk, pine: Vk, palm: Uk, bush: Gk, rock: Kk, birch: Wk, flower: qk };
function Yk(e4, t2) {
  let n2 = new Os({ vertexColors: true, roughness: 0.88, metalness: 0 });
  return n2.onBeforeCompile = (n3) => {
    n3.uniforms.uTime = Z.uTime, n3.uniforms.uWind = Z.uWind, n3.vertexShader = n3.vertexShader.replace(`#include <common>`, `#include <common>
uniform float uTime; uniform vec2 uWind; varying float vLeaf; varying float vDown; varying float vLeafY;`).replace(`#include <begin_vertex>`, `#include <begin_vertex>
        vLeaf = step(${t2.toFixed(2)}, position.y);
        vDown = max(0.0, -normal.y);
        vLeafY = position.y;
        #ifdef USE_INSTANCING
          vec3 ip = instanceMatrix[3].xyz;
          float sw = sin(uTime * 1.25 + ip.x * 0.21 + ip.z * 0.17) * 0.6 + sin(uTime * 2.6 + ip.x * 0.53 + ip.z * 0.31) * 0.25;
          float hf = max(position.y - 1.2, 0.0);
          transformed.xz += uWind * sw * hf * hf * ${e4.toFixed(4)};
          float fl = sin(uTime * 3.7 + position.x * 2.9 + position.y * 2.3 + position.z * 3.3 + ip.x);
          transformed += normal * fl * 0.022 * step(2.2, position.y);
        #endif`), n3.fragmentShader = n3.fragmentShader.replace(`#include <common>`, `#include <common>
varying float vLeaf; varying float vDown; varying float vLeafY;`).replace(`#include <emissivemap_fragment>`, `#include <emissivemap_fragment>
totalEmissiveRadiance += diffuseColor.rgb * (0.22 + 0.8 * vDown) * vLeaf;`);
  }, n2;
}
var Xk = [16777215, 15925209, 14874052, 16775113, 14086352, 16777215, 15400928];
function Zk() {
  let e4 = [], t2 = new jp(90210), n2 = 5.9;
  for (let r = -392; r < 392; r += n2) for (let i = -392; i < 392; i += n2) {
    let a = i + t2.next() * n2, o = r + t2.next() * n2, s2 = t2.next(), c = t2.next(), l2 = ay(a, o);
    if (l2 < 1.25 || cy(a, o, 1.1) || gy(a, o) < 5.2) continue;
    let u = oy(a, o), d = t2.range(0.85, 1.3), f = t2.range(0, 6.283), p = t2.pick(Xk);
    if (l2 < 3.3) {
      u < 0.2 && s2 < 0.1 ? e4.push({ type: `palm`, variant: t2.int(0, 1), x: a, y: l2 - 0.15, z: o, scale: d, rot: f, tint: 16777215 }) : s2 > 0.985 && e4.push({ type: `rock`, variant: t2.int(0, 2), x: a, y: l2 - 0.1, z: o, scale: t2.range(0.6, 1.1), rot: f, tint: 16774108 });
      continue;
    }
    if (l2 > 66) {
      s2 < 0.06 && e4.push({ type: `rock`, variant: s2 < 0.025 ? 3 : t2.int(0, 2), x: a, y: l2 - 0.3, z: o, scale: t2.range(1, 2.3), rot: f, tint: 16054527 });
      continue;
    }
    if (u > 0.15) {
      if (l2 < 60 && hk(a, o, l2, u) < 0.12) {
        s2 < 0.07 + ly(a, o) * 0.22 ? e4.push({ type: `pine`, variant: t2.int(0, 2), x: a, y: l2 - 0.35, z: o, scale: d * 1.05, rot: f, tint: p }) : s2 > 0.95 ? e4.push({ type: `rock`, variant: t2.int(0, 2), x: a, y: l2 - 0.3, z: o, scale: t2.range(0.8, 1.6), rot: f, tint: 16777215 }) : s2 > 0.9 && e4.push({ type: `bush`, variant: t2.int(0, 2), x: a, y: l2 - 0.05, z: o, scale: t2.range(0.8, 1.3), rot: f, tint: p });
        continue;
      }
      s2 < 0.12 ? e4.push({ type: `rock`, variant: s2 < 0.06 ? 3 : t2.int(0, 2), x: a, y: l2 - 0.35, z: o, scale: t2.range(1.1, 2.6), rot: f, tint: 16777215 }) : s2 < 0.15 && l2 < 50 && e4.push({ type: `bush`, variant: t2.int(0, 1), x: a, y: l2 - 0.05, z: o, scale: t2.range(0.8, 1.3), rot: f, tint: p });
      continue;
    }
    let m = ly(a, o), h = 0.06 + m * 0.56;
    if (s2 < h) {
      let n3 = l2 > 34 || Vp(a * 0.011 + 77, o * 0.011) > 0.22, r2 = l2 < 32 && Vp(a * 0.013 + 31, o * 0.013 - 9) > 0.28;
      n3 && c < 0.78 ? e4.push({ type: `pine`, variant: t2.int(0, 2), x: a, y: l2 - 0.2, z: o, scale: d * 1.05, rot: f, tint: p }) : r2 && c < 0.55 ? e4.push({ type: `birch`, variant: t2.int(0, 1), x: a, y: l2 - 0.2, z: o, scale: d * 0.95, rot: f, tint: p }) : e4.push({ type: a < 35 && o < 160 && o > -300 ? `autumn` : `oak`, variant: t2.int(0, 3), x: a, y: l2 - 0.2, z: o, scale: d, rot: f, tint: a < 35 && o < 160 && o > -300 ? 16777215 : p });
    } else s2 < h + 0.06 ? e4.push({ type: `bush`, variant: t2.int(0, 2), x: a, y: l2 - 0.05, z: o, scale: t2.range(0.8, 1.5), rot: f, tint: p }) : s2 < h + 0.077 ? e4.push({ type: `rock`, variant: t2.int(0, 2), x: a, y: l2 - 0.2, z: o, scale: t2.range(0.55, 1.25), rot: f, tint: 16777215 }) : s2 < h + 0.14 && m < 0.5 && u < 0.09 && e4.push({ type: `flower`, variant: t2.int(0, 2), x: a, y: l2 - 0.02, z: o, scale: t2.range(0.9, 1.5), rot: f, tint: 16777215 });
  }
  return XO(e4);
}
var Qk = new z().makeScale(0, 0, 0), $k = new z(), eA = new It(), tA = new gn(), nA = new R(), rA = new R(), iA = class {
  spec;
  mesh;
  index;
  hp;
  maxHp;
  mat;
  alive = true;
  label;
  yieldTotal;
  cx;
  cy;
  cz;
  base = new z();
  collider = null;
  shake = 0;
  constructor(e4, t2, n2) {
    this.spec = e4, this.mesh = t2, this.index = n2;
    let r = Ak[e4.type];
    this.hp = this.maxHp = r.hp, this.mat = r.mat, this.label = r.label, this.yieldTotal = r.yield, this.cx = e4.x, this.cz = e4.z, this.cy = e4.y + (e4.type === `rock` ? 0.6 * e4.scale : 1.3);
  }
  damage(e4, t2, n2) {
    return oA.damage(this, e4, t2, n2);
  }
}, aA = class {
  group = new Pn();
  items = [];
  shaking = /* @__PURE__ */ new Set();
  dead = [];
  events = {};
  static blobs(e4) {
    return e4.filter((e5) => Ak[e5.type].shadow > 0).map((e5) => ({ x: e5.x, z: e5.z, r: Ak[e5.type].shadow * e5.scale, a: e5.type === `bush` ? 0.24 : e5.type === `rock` ? 0.28 : 0.38 }));
  }
  build(e4) {
    let t2 = /* @__PURE__ */ new Map();
    for (let n3 of e4) {
      let e5 = jk[n3.type] ?? 200, r2 = 800 / e5, i2 = (Math.floor(n3.variant) % kk[n3.type] + kk[n3.type]) % kk[n3.type], a2 = Math.min(r2 - 1, Math.max(0, Math.floor((n3.x + 400) / e5))), o2 = Math.min(r2 - 1, Math.max(0, Math.floor((n3.z + 400) / e5))), s3 = `${n3.type}|${i2}|${a2}|${o2}`, c = t2.get(s3);
      c || t2.set(s3, c = []), c.push(n3);
    }
    let n2 = /* @__PURE__ */ new Map(), r = Yk(55e-4, 2.4), i = Yk(8e-3, 5.2), a = Yk(0, -1), o = new Os({ vertexColors: true, roughness: 0.92, metalness: 0, flatShading: true }), s2 = new B();
    for (let [e5, c] of t2) {
      let [t3, l2] = e5.split(`|`), u = `${t3}|${l2}`, d = n2.get(u);
      d || (d = Jk[t3](Number(l2)), n2.set(u, d));
      let f = new ia(d, t3 === `rock` ? o : t3 === `palm` ? i : t3 === `bush` || t3 === `flower` ? a : r, c.length);
      f.castShadow = t3 !== `bush` && t3 !== `flower`, f.receiveShadow = true, c.forEach((e6, n3) => {
        let r2 = new iA(e6, f, n3), i2 = t3 === `rock` ? 0.18 : t3 === `flower` ? 0 : 0.035;
        eA.setFromEuler(tA.set(Math.sin(e6.rot * 3.1) * i2, e6.rot, Math.cos(e6.rot * 2.3) * i2));
        let a2 = t3 === `rock` ? e6.scale : e6.scale * (0.92 + n3 * 37 % 17 / 100);
        r2.base.compose(rA.set(e6.x, e6.y, e6.z), eA, nA.set(e6.scale, a2, e6.scale)), f.setMatrixAt(n3, r2.base), f.setColorAt(n3, s2.setHex(e6.tint));
        let o2 = Ak[t3];
        o2.radius > 0 && (r2.collider = Ty(wy(e6.x, e6.z, o2.radius * e6.scale, e6.y - 1.5, e6.y + o2.height * e6.scale, r2))), this.items.push(r2);
      }), f.instanceMatrix.needsUpdate = true, f.computeBoundingSphere(), this.group.add(f);
    }
  }
  damage(e4, t2, n2, r) {
    return e4.alive ? (e4.hp -= t2, e4.shake = 0.3, this.shaking.add(e4), this.events.onDamaged?.(e4, t2, n2, r), e4.hp <= 0 && (e4.alive = false, this.shaking.delete(e4), e4.collider && Ey(e4.collider), e4.mesh.setMatrixAt(e4.index, Qk), e4.mesh.instanceMatrix.needsUpdate = true, this.dead.push(e4), this.events.onDestroyed?.(e4, n2), true)) : false;
  }
  reset() {
    for (let e4 of this.dead) e4.alive = true, e4.hp = e4.maxHp, e4.shake = 0, e4.mesh.setMatrixAt(e4.index, e4.base), e4.mesh.instanceMatrix.needsUpdate = true, e4.collider && Ty(e4.collider);
    this.dead.length = 0;
    for (let e4 of this.items) e4.hp = e4.maxHp;
    this.shaking.clear();
  }
  update(e4) {
    for (let t2 of this.shaking) {
      if (t2.shake -= e4, t2.shake <= 0) t2.mesh.setMatrixAt(t2.index, t2.base), this.shaking.delete(t2);
      else {
        let e5 = Math.sin(t2.shake * 55) * t2.shake * 0.16;
        $k.makeRotationZ(e5), $k.premultiply(t2.base), t2.mesh.setMatrixAt(t2.index, $k);
      }
      t2.mesh.instanceMatrix.needsUpdate = true;
    }
  }
}, oA = new aA(), sA = aA.blobs, cA = (e4, t2, n2) => ({ tex: e4, tint: t2, mat: n2 }), lA = [16777215, 16181185, 12573938, 13232335, 16107944, 16244874, 14272494, 10466504], uA = [5922667, 9067076, 11884604, 5599375, 5208666, 7031354], dA = cA(`floorwood`, 16777215, `wood`), fA = cA(`concrete`, 16777215, `stone`), pA = cA(`concrete`, 9277849, `stone`), mA = cA(`tile`, 16777215, `stone`), hA = (e4) => `#` + e4.toString(16).padStart(6, `0`), gA = { asphalt: `#707279`, line: `#f4d75a`, walk: `#c6c2b8`, concrete: `#b3afa6`, dirt: `#b3905c`, dark: `#8a7048`, sand: `#f4e7c6`, field: `#93713f`, crop: `#86b83e`, plank: `#b88955` }, _A = class {
  plan = { pieces: [], props: [], paint: [], footprints: [], chests: [], loot: [], ammo: [], llamas: [], trees: [] };
  r = new jp(20261109);
  cx = 0;
  cz = 0;
  gy = 0;
  px = 0;
  pz = 0;
  py = 0;
  begin(e4) {
    this.px = e4.x, this.pz = e4.z, this.py = e4.y, this.cx = e4.x / 5, this.cz = e4.z / 5, this.gy = e4.y / 4;
  }
  piece(e4, t2, n2, r, i, a) {
    this.plan.pieces.push({ shape: e4, gx: this.cx + t2, gy: this.gy + n2, gz: this.cz + r, rot: i, tex: a.tex, tint: a.tint, mat: a.mat });
  }
  prop(e4, t2, n2, r = 0, i = -1, a = 0) {
    const x = this.px + t2, z = this.pz + n2;
    // Explicit elevations are used for upper floors and roofs; ordinary scenery
    // sits on the sampled terrain rather than the centre elevation of the POI.
    const y = a !== 0 ? this.py + a : ay(x, z) - .04;
    this.plan.props.push({ id: e4, variant: i < 0 ? this.r.int(0, 9) : i, x, y, z, rot: r });
  }
  propW(e4, t2, n2, r = 0, i = 0) {
    let a = this.px + t2, o = this.pz + n2;
    this.plan.props.push({ id: e4, variant: i, x: a, y: Math.max(ay(a, o) - 0.05, -0.22), z: o, rot: r });
  }
  rect(e4, t2, n2, r, i, a = true, o = 1, s2 = 0) {
    this.plan.paint.push({ kind: `rect`, x: this.px + e4, z: this.pz + t2, w: n2, d: r, color: i, noGrass: a, alpha: o, soft: s2 });
  }
  circle(e4, t2, n2, r, i = true, a = 1, o = 0) {
    this.plan.paint.push({ kind: `circle`, x: this.px + e4, z: this.pz + t2, r: n2, color: r, noGrass: i, alpha: a, soft: o });
  }
  path(e4, t2, n2, r = true, i, a = 1) {
    this.plan.paint.push({ kind: `path`, pts: e4.map(([e5, t3]) => [this.px + e5, this.pz + t3]), width: t2, color: n2, noGrass: r, dash: i, alpha: a });
  }
  chest(e4, t2, n2 = 0, r = 0) {
    this.plan.chests.push({ x: this.px + e4, y: this.py + n2 + 0.07, z: this.pz + t2, rot: r });
  }
  loot(e4, t2, n2 = 0) {
    this.plan.loot.push({ x: this.px + e4, y: this.py + n2 + 0.07, z: this.pz + t2, rot: 0 });
  }
  ammo(e4, t2, n2 = 0) {
    this.plan.ammo.push({ x: this.px + e4, y: this.py + n2 + 0.07, z: this.pz + t2, rot: this.r.range(0, 6.28) });
  }
  tree(e4, t2, n2, r = 1) {
    this.plan.trees.push({ type: e4, variant: this.r.int(0, 1), x: this.px + t2, y: ay(this.px+t2,this.pz+n2) - 0.2, z: this.pz + n2, scale: r, rot: this.r.range(0, 6.28), tint: 16777215 });
  }
  fence(e4, t2, n2, r) {
    let i = Math.hypot(n2 - e4, r - t2), a = Math.max(1, Math.round(i / 2.5)), o = Math.abs(n2 - e4) > Math.abs(r - t2);
    for (let i2 = 0; i2 < a; i2++) {
      let s2 = (i2 + 0.5) / a;
      this.prop(`fence`, e4 + (n2 - e4) * s2, t2 + (r - t2) * s2, o ? 0 : Math.PI / 2, 0);
    }
  }
  stairCell(e4) {
    return e4 % 2 == 0 ? { i: 0, k: 0, dir: 0 } : { i: 1, k: 1, dir: 2 };
  }
  // Continuous roof shared by houses, barns, cabins and greenhouses. Each
  // pair of slopes meets at one ridge; end walls fill the triangular space.
  gableRoof(x, z, w, d, level, wall, roof) {
    const alongZ = d % 2 === 0 && (w % 2 !== 0 || w >= d);
    const alongX = !alongZ && w % 2 === 0;
    if (!alongZ && !alongX) {
      // Odd-by-odd footprints cannot form a symmetric roof from 5 m panels.
      for(let ix=0;ix<w;ix++) for(let iz=0;iz<d;iz++) this.piece(`floor`,x+ix,level,z+iz,0,roof);
      return;
    }
    if (alongZ) {
      for(let iz=0;iz<d;iz++) {
        const near = iz < d/2, step = near ? iz : d-1-iz, y = level + step*.625;
        for(let ix=0;ix<w;ix++) this.piece(`roof`,x+ix,y,z+iz,near ? 0 : 2,roof);
        for(const edge of [x,x+w]) {
          if(step>0) this.piece(`half`,edge,level,z+iz,1,wall);
          this.piece(`gable`,edge,y,z+iz,near ? 3 : 1,wall);
        }
      }
    } else {
      for(let ix=0;ix<w;ix++) {
        const near = ix < w/2, step = near ? ix : w-1-ix, y = level + step*.625;
        for(let iz=0;iz<d;iz++) this.piece(`roof`,x+ix,y,z+iz,near ? 1 : 3,roof);
        for(const edge of [z,z+d]) {
          if(step>0) this.piece(`half`,x+ix,level,edge,0,wall);
          this.piece(`gable`,x+ix,y,edge,near ? 0 : 2,wall);
        }
      }
    }
  }
  house(e4) {
    let { x: t2, z: n2, w: r, d: i } = e4, a = this.r, o = r >= 2 && i >= 2, s2 = o ? e4.floors : 1, c = e4.floor ?? dA, l2 = cA(`planks`, 16777215, `wood`), u = e4.open ?? ``;
    for (let e5 = 0; e5 < r; e5++) for (let r2 = 0; r2 < i; r2++) this.piece(`floor`, t2 + e5, 0, n2 + r2, 0, c);
    for (let d2 = 0; d2 < s2; d2++) {
      let f2 = (t3, n3, r2) => d2 === 0 && u.includes(t3) ? null : d2 === 0 && e4.doors.includes(t3) && n3 === Math.floor(r2 / 2) ? `wallDoor` : a.chance(e4.win) ? `wallWin` : `wall`;
      for (let a2 = 0; a2 < r; a2++) {
        let o2 = f2(`n`, a2, r), s3 = f2(`s`, a2, r);
        o2 && this.piece(o2, t2 + a2, d2, n2, 0, e4.wall), s3 && this.piece(s3, t2 + a2, d2, n2 + i, 0, e4.wall);
      }
      for (let a2 = 0; a2 < i; a2++) {
        let o2 = f2(`w`, a2, i), s3 = f2(`e`, a2, i);
        o2 && this.piece(o2, t2, d2, n2 + a2, 1, e4.wall), s3 && this.piece(s3, t2 + r, d2, n2 + a2, 1, e4.wall);
      }
      if (o && (d2 < s2 - 1 || e4.roof === `flat` && e4.roofAccess === true)) {
        let e5 = this.stairCell(d2);
        this.piece(`stairs`, t2 + e5.i, d2, n2 + e5.k, e5.dir, l2);
      }
      if (d2 < s2 - 1) {
        let e5 = this.stairCell(d2);
        for (let a2 = 0; a2 < r; a2++) for (let r2 = 0; r2 < i; r2++) (a2 !== e5.i || r2 !== e5.k) && this.piece(`floor`, t2 + a2, d2 + 1, n2 + r2, 0, c);
      }
    }
    let d = s2, f = e4.roof, p = i === 2 || i === 4, m = r === 2 || r === 4;
    if (f === `gable` && !p && !m && (f = `flat`), f === `flat`) {
      let a2 = e4.roofAccess && o ? this.stairCell(s2 - 1) : null;
      for (let o2 = 0; o2 < r; o2++) for (let r2 = 0; r2 < i; r2++) a2 && o2 === a2.i && r2 === a2.k || this.piece(`floor`, t2 + o2, d, n2 + r2, 0, e4.roofSkin);
    } else if (f === `pyr`) for (let a2 = 0; a2 < r; a2++) for (let r2 = 0; r2 < i; r2++) this.piece(`pyr`, t2 + a2, d, n2 + r2, 0, e4.roofSkin);
    else if (f === `gable`) this.gableRoof(t2,n2,r,i,d,e4.wall,e4.roofSkin);
    let h = (t2 + r / 2) * 5, g2 = (n2 + i / 2) * 5;
    this.rect(h, g2, r * 5 + 2.4, i * 5 + 2.4, `#a39883`, true, 0.95, 1.5), this.plan.footprints.push({ x: this.px + h, z: this.pz + g2, w: r * 5, d: i * 5, color: hA(f === `flat` ? 11120053 : e4.roofSkin.tint) });
    let _2 = [];
    for (let e5 = 0; e5 < s2; e5++) for (let t3 = 0; t3 < r; t3++) for (let n3 = 0; n3 < i; n3++) {
      let r2 = this.stairCell(e5), i2 = this.stairCell(e5 - 1);
      o && (t3 === r2.i && n3 === r2.k || e5 > 0 && t3 === i2.i && n3 === i2.k) || _2.push([t3, n3, e5]);
    }
    // Individually modeled furnishings in reachable rooms. The existing
    // settlement pass keeps them clear of doorways, stairs and other props.
    const furnished = new Set();
    for (const [cx,cz,cy] of _2) {
      if(furnished.has(cy) || cx === 0 && cz === 0) continue;
      const furnishings=[`interiorTable`,`interiorSofa`,`interiorShelf`,`interiorBed`];
      const id=furnishings[(Math.abs(t2+n2+cx+cz+cy))%furnishings.length];
      this.prop(id,(t2+cx+.5)*5,(n2+cz+.5)*5,0,0,cy*4+.04);
      furnished.add(cy);
    }
    for (let r2 = 0; r2 < (e4.chests ?? 0) && _2.length; r2++) {
      let [e5, r3, i2] = _2.splice(a.int(0, _2.length - 1), 1)[0];
      this.chest((t2 + e5 + 0.5) * 5 + a.range(-1, 1), (n2 + r3 + 0.5) * 5 + a.range(-1, 1), i2 * 4, a.int(0, 3) * Math.PI / 2);
    }
    for (let [e5, r2, i2] of _2) {
      let o2 = a.next();
      o2 < 0.3 ? this.loot((t2 + e5 + 0.5) * 5 + a.range(-1.2, 1.2), (n2 + r2 + 0.5) * 5 + a.range(-1.2, 1.2), i2 * 4) : o2 < 0.38 && this.ammo((t2 + e5 + 0.5) * 5 + a.range(-1.5, 1.5), (n2 + r2 + 0.5) * 5 + a.range(-1.5, 1.5), i2 * 4);
    }
  }
  // A-Frame cabin: triangular prism with steep roof slopes
  aFrame(e4) {
    // A compact cabin: one continuous peaked roof with real end walls and doors.
    this.house({...e4, floors:1, roof:`gable`, doors:e4.doors ?? `s`, win:.55});
    const {x,z,w,d}=e4;
    // A porch makes this cabin distinct while remaining attached to the building.
    for(let ix=0;ix<w;ix++) this.piece(`floor`,x+ix,0,z+d,0,e4.floor ?? dA);
  }
  // Pagoda: stacked pyramid roofs getting smaller
  pagoda(e4) {
    const {x,z,w,d} = e4, tiers = e4.tiers ?? 3, a = this.r;
    for(let ix=0;ix<w;ix++) for(let iz=0;iz<d;iz++) this.piece(`floor`,x+ix,0,z+iz,0,e4.floor ?? dA);
    // Receding tiers stand on the completed deck below; no unsupported roofs.
    for(let tier=0;tier<tiers;tier++) {
      const tw=w-tier*2, td=d-tier*2, tx=x+ tier, tz=z+tier, y=tier;
      if(tw<1 || td<1) break;
      for(let ix=0;ix<tw;ix++) {
        this.piece(tier===0 && ix===Math.floor(tw/2)?`wallDoor`:`wall`,tx+ix,y,tz,0,e4.wall);
        this.piece(`wallWin`,tx+ix,y,tz+td,0,e4.wall);
      }
      for(let iz=0;iz<td;iz++) { this.piece(`wall`,tx,y,tz+iz,1,e4.wall); this.piece(`wall`,tx+tw,y,tz+iz,1,e4.wall); }
      const hasNext = tier+1<tiers && tw>2 && td>2;
      if(hasNext) {
        for(let ix=0;ix<tw;ix++) for(let iz=0;iz<td;iz++) this.piece(`floor`,tx+ix,y+1,tz+iz,0,e4.roofSkin);
        for(let ix=0;ix<tw;ix++){this.piece(`parapet`,tx+ix,y+1,tz,0,e4.wall);this.piece(`parapet`,tx+ix,y+1,tz+td,0,e4.wall);}
      } else {
        this.gableRoof(tx,tz,tw,td,y+1,e4.wall,e4.roofSkin);
      }
    }
    const h=(x+w/2)*5, g=(z+d/2)*5;
    this.rect(h,g,w*5+2,d*5+2,`#a39883`,true,.95,1.2);
    this.plan.footprints.push({x:this.px+h,z:this.pz+g,w:w*5,d:d*5,color:hA(e4.roofSkin.tint)});
    for(let i=0;i<(e4.chests??1);i++) this.chest(h+a.range(-3,3),g+a.range(-3,3),0,a.int(0,3)*Math.PI/2);
    this.loot(h,g);
  }
  // Castle turret: tall tower with cone roof and crenellations
  turret(e4) {
    let { x: t2, z: n2, w: r, d: i } = e4, a = this.r, floors = e4.floors ?? 4;
    // Base
    for (let e5 = 0; e5 < r; e5++) for (let r2 = 0; r2 < i; r2++) this.piece(`floor`, t2 + e5, 0, n2 + r2, 0, e4.floor ?? fA);
    // Tower walls
    for (let y = 0; y < floors; y++) {
      for (let e5 = 0; e5 < r; e5++) {
        this.piece(y === 0 && e5 === Math.floor(r / 2) ? `wallDoor` : a.chance(0.3) ? `wallWin` : `wall`, t2 + e5, y, n2, 0, e4.wall);
        this.piece(a.chance(0.3) ? `wallWin` : `wall`, t2 + e5, y, n2 + i, 0, e4.wall);
      }
      for (let e5 = 0; e5 < i; e5++) {
        this.piece(a.chance(0.3) ? `wallWin` : `wall`, t2, y, n2 + e5, 1, e4.wall);
        this.piece(a.chance(0.3) ? `wallWin` : `wall`, t2 + r, y, n2 + e5, 1, e4.wall);
      }
      // Floor between levels
      if (y < floors - 1) { const opening = this.stairCell(y); for (let e5 = 0; e5 < r; e5++) for (let r2 = 0; r2 < i; r2++) if (e5 !== opening.i || r2 !== opening.k) this.piece(`floor`, t2 + e5, y + 1, n2 + r2, 0, e4.floor ?? fA); }
      // Stairs
      let sc = this.stairCell(y);
      this.piece(`stairs`, t2 + sc.i, y, n2 + sc.k, sc.dir, cA(`planks`, 16777215, `wood`));
    }
    // Crenellations (parapet ring)
    for (let e5 = 0; e5 < r; e5++) {
      this.piece(`parapet`, t2 + e5, floors, n2, 0, e4.wall);
      this.piece(`parapet`, t2 + e5, floors, n2 + i, 0, e4.wall);
    }
    for (let e5 = 0; e5 < i; e5++) {
      this.piece(`parapet`, t2, floors, n2 + e5, 1, e4.wall);
      this.piece(`parapet`, t2 + r, floors, n2 + e5, 1, e4.wall);
    }
    // The cap rests directly on a roof deck instead of hovering above the parapet.
    for (let e5 = 0; e5 < r; e5++) for (let r2 = 0; r2 < i; r2++) this.piece(`floor`,t2+e5,floors,n2+r2,0,e4.roofSkin);
    this.piece(`pyr`,t2+Math.floor((r-1)/2),floors,n2+Math.floor((i-1)/2),0,e4.roofSkin);
    // Footprint + loot
    let h = (t2 + r / 2) * 5, g2 = (n2 + i / 2) * 5;
    this.rect(h, g2, r * 5 + 2, i * 5 + 2, `#a39883`, true, 0.95, 1.2);
    this.plan.footprints.push({ x: this.px + h, z: this.pz + g2, w: r * 5, d: i * 5, color: hA(e4.roofSkin.tint) });
    for (let e5 = 0; e5 < (e4.chests ?? 1); e5++) this.chest(h + a.range(-3, 3), g2 + a.range(-3, 3), a.int(0, floors - 1) * 4, a.int(0, 3) * Math.PI / 2);
    this.loot(h, g2);
  }
  // Barn: wide building with big doors and gambrel-style roof
  barn(e4) {
    let { x: t2, z: n2, w: r, d: i } = e4, a = this.r;
    // Floor
    for (let e5 = 0; e5 < r; e5++) for (let r2 = 0; r2 < i; r2++) this.piece(`floor`, t2 + e5, 0, n2 + r2, 0, e4.floor ?? dA);
    // Walls (2 floors tall)
    for (let y = 0; y < 2; y++) {
      for (let e5 = 0; e5 < r; e5++) {
        // Big barn doors on front
        let isDoor = y === 0 && e4.doors.includes(`s`) && e5 >= Math.floor(r / 2) - 1 && e5 <= Math.floor(r / 2);
        this.piece(isDoor ? `wallDoor` : y === 1 && e5 === Math.floor(r / 2) ? `wallWin` : `wall`, t2 + e5, y, n2 + i, 0, e4.wall);
        this.piece(`wall`, t2 + e5, y, n2, 0, e4.wall);
      }
      for (let e5 = 0; e5 < i; e5++) {
        this.piece(`wall`, t2, y, n2 + e5, 1, e4.wall);
        this.piece(`wall`, t2 + r, y, n2 + e5, 1, e4.wall);
      }
    }
    this.gableRoof(t2,n2,r,i,2,e4.wall,e4.roofSkin);
    // Footprint + loot
    let h = (t2 + r / 2) * 5, g2 = (n2 + i / 2) * 5;
    this.rect(h, g2, r * 5 + 2, i * 5 + 2, `#a39883`, true, 0.95, 1.2);
    this.plan.footprints.push({ x: this.px + h, z: this.pz + g2, w: r * 5, d: i * 5, color: hA(e4.roofSkin.tint) });
    for (let e5 = 0; e5 < (e4.chests ?? 1); e5++) this.chest(h + a.range(-4, 4), g2 + a.range(-4, 4), 0, a.int(0, 3) * Math.PI / 2);
    this.loot(h, g2);
  }
  // Church: tall nave with steeple
  church(e4) {
    let { x: t2, z: n2, w: r, d: i } = e4, a = this.r;
    // Floor
    for (let e5 = 0; e5 < r; e5++) for (let r2 = 0; r2 < i; r2++) this.piece(`floor`, t2 + e5, 0, n2 + r2, 0, e4.floor ?? fA);
    // Tall walls (3 floors)
    for (let y = 0; y < 3; y++) {
      for (let e5 = 0; e5 < r; e5++) {
        this.piece(y === 0 && e5 === Math.floor(r / 2) ? `wallDoor` : a.chance(0.4) ? `wallWin` : `wall`, t2 + e5, y, n2, 0, e4.wall);
        this.piece(a.chance(0.4) ? `wallWin` : `wall`, t2 + e5, y, n2 + i, 0, e4.wall);
      }
      for (let e5 = 0; e5 < i; e5++) {
        this.piece(a.chance(0.4) ? `wallWin` : `wall`, t2, y, n2 + e5, 1, e4.wall);
        this.piece(a.chance(0.4) ? `wallWin` : `wall`, t2 + r, y, n2 + e5, 1, e4.wall);
      }
    }
    this.gableRoof(t2,n2,r,i,3,e4.wall,e4.roofSkin);
    // Steeple (small tower on top)
    let sx = t2 + Math.floor(r / 2), sz = n2 + Math.floor(i / 2);
    this.piece(`wall`, sx, 3, sz, 0, e4.wall);
    this.piece(`wall`, sx, 3, sz + 1, 0, e4.wall);
    this.piece(`wall`, sx, 3, sz, 1, e4.wall);
    this.piece(`wall`, sx + 1, 3, sz, 1, e4.wall);
    this.piece(`pyr`, sx, 4, sz, 0, e4.roofSkin);
    // Footprint + loot
    let h = (t2 + r / 2) * 5, g2 = (n2 + i / 2) * 5;
    this.rect(h, g2, r * 5 + 2, i * 5 + 2, `#a39883`, true, 0.95, 1.2);
    this.plan.footprints.push({ x: this.px + h, z: this.pz + g2, w: r * 5, d: i * 5, color: hA(e4.roofSkin.tint) });
    for (let e5 = 0; e5 < (e4.chests ?? 1); e5++) this.chest(h + a.range(-3, 3), g2 + a.range(-3, 3), 0, a.int(0, 3) * Math.PI / 2);
    this.loot(h, g2);
  }
  // Lighthouse: tall narrow tower with glowing top
  lighthouse(e4) {
    let { x: t2, z: n2, w: r, d: i } = e4, a = this.r, floors = e4.floors ?? 6;
    // Base
    for (let e5 = 0; e5 < r; e5++) for (let r2 = 0; r2 < i; r2++) this.piece(`floor`, t2 + e5, 0, n2 + r2, 0, e4.floor ?? fA);
    // Tower walls
    for (let y = 0; y < floors; y++) {
      for (let e5 = 0; e5 < r; e5++) {
        this.piece(y === 0 && e5 === Math.floor(r / 2) ? `wallDoor` : `wall`, t2 + e5, y, n2, 0, e4.wall);
        this.piece(`wall`, t2 + e5, y, n2 + i, 0, e4.wall);
      }
      for (let e5 = 0; e5 < i; e5++) {
        this.piece(`wall`, t2, y, n2 + e5, 1, e4.wall);
        this.piece(`wall`, t2 + r, y, n2 + e5, 1, e4.wall);
      }
      if (y < floors - 1) { const opening = this.stairCell(y); for (let e5 = 0; e5 < r; e5++) for (let r2 = 0; r2 < i; r2++) if (e5 !== opening.i || r2 !== opening.k) this.piece(`floor`, t2 + e5, y + 1, n2 + r2, 0, e4.floor ?? fA); }
      let sc = this.stairCell(y);
      this.piece(`stairs`, t2 + sc.i, y, n2 + sc.k, sc.dir, cA(`planks`, 16777215, `wood`));
    }
    // Glowing light room (pad on top)
    for (let e5 = 0; e5 < r; e5++) for (let r2 = 0; r2 < i; r2++) this.piece(`floor`, t2 + e5, floors, n2 + r2, 0, e4.roofSkin);
    // Lantern cap is attached to the deck, not floating a storey above it.
    this.piece(`pyr`, t2 + Math.floor((r-1)/2), floors, n2 + Math.floor((i-1)/2), 0, e4.roofSkin);
    // Footprint + loot
    let h = (t2 + r / 2) * 5, g2 = (n2 + i / 2) * 5;
    this.rect(h, g2, r * 5 + 2, i * 5 + 2, `#a39883`, true, 0.95, 1.2);
    this.plan.footprints.push({ x: this.px + h, z: this.pz + g2, w: r * 5, d: i * 5, color: hA(e4.roofSkin.tint) });
    for (let e5 = 0; e5 < (e4.chests ?? 1); e5++) this.chest(h + a.range(-2, 2), g2 + a.range(-2, 2), a.int(0, floors - 1) * 4, a.int(0, 3) * Math.PI / 2);
    this.loot(h, g2);
  }
  // Treehouse: elevated on stilts with stairs
  treehouse(e4) {
    let { x: t2, z: n2, w: r, d: i } = e4, a = this.r;
    // Elevated floor. The foundation pass installs timber/stone pilings from
    // the terrain all the way to the underside of this deck.
    // Elevated floor
    for (let e5 = 0; e5 < r; e5++) for (let r2 = 0; r2 < i; r2++) this.piece(`floor`, t2 + e5, 1, n2 + r2, 0, e4.floor ?? dA);
    // Walls on elevated floor
    for (let e5 = 0; e5 < r; e5++) {
      this.piece(e5 === Math.floor(r / 2) ? `wallDoor` : `wall`, t2 + e5, 1, n2, 0, e4.wall);
      this.piece(a.chance(0.5) ? `wallWin` : `wall`, t2 + e5, 1, n2 + i, 0, e4.wall);
    }
    for (let e5 = 0; e5 < i; e5++) {
      this.piece(`wall`, t2, 1, n2 + e5, 1, e4.wall);
      this.piece(`wall`, t2 + r, 1, n2 + e5, 1, e4.wall);
    }
    this.gableRoof(t2,n2,r,i,2,e4.wall,e4.roofSkin);
    // Stairs up to treehouse
    this.piece(`stairs`, t2 + Math.floor(r / 2), 0, n2 - 1, 0, cA(`planks`, 16777215, `wood`));
    // Footprint + loot
    let h = (t2 + r / 2) * 5, g2 = (n2 + i / 2) * 5;
    this.rect(h, g2, r * 5 + 2, i * 5 + 2, `#a39883`, true, 0.95, 1.2);
    this.plan.footprints.push({ x: this.px + h, z: this.pz + g2, w: r * 5, d: i * 5, color: hA(e4.roofSkin.tint) });
    for (let e5 = 0; e5 < (e4.chests ?? 1); e5++) this.chest(h + a.range(-3, 3), g2 + a.range(-3, 3), 4, a.int(0, 3) * Math.PI / 2);
    this.loot(h, g2);
  }
  // Greenhouse: glass walls with arched roof
  greenhouse(e4) {
    let { x: t2, z: n2, w: r, d: i } = e4, a = this.r;
    // Floor
    for (let e5 = 0; e5 < r; e5++) for (let r2 = 0; r2 < i; r2++) this.piece(`floor`, t2 + e5, 0, n2 + r2, 0, e4.floor ?? dA);
    // Glass walls
    for (let e5 = 0; e5 < r; e5++) {
      this.piece(e5 === Math.floor(r / 2) ? `wallDoor` : `wallWin`, t2 + e5, 0, n2, 0, e4.wall);
      this.piece(`wallWin`, t2 + e5, 0, n2 + i, 0, e4.wall);
    }
    for (let e5 = 0; e5 < i; e5++) {
      this.piece(`wallWin`, t2, 0, n2 + e5, 1, e4.wall);
      this.piece(`wallWin`, t2 + r, 0, n2 + e5, 1, e4.wall);
    }
    this.gableRoof(t2,n2,r,i,1,e4.wall,e4.roofSkin);
    // Footprint + loot
    let h = (t2 + r / 2) * 5, g2 = (n2 + i / 2) * 5;
    this.rect(h, g2, r * 5 + 2, i * 5 + 2, `#a39883`, true, 0.95, 1.2);
    this.plan.footprints.push({ x: this.px + h, z: this.pz + g2, w: r * 5, d: i * 5, color: hA(e4.roofSkin.tint) });
    for (let e5 = 0; e5 < (e4.chests ?? 1); e5++) this.chest(h + a.range(-3, 3), g2 + a.range(-3, 3), 0, a.int(0, 3) * Math.PI / 2);
    this.loot(h, g2);
  }
  suburb(e4) {
    this.begin(e4);
    let t2 = this.r, n2 = [[-30, -20], [30, -20], [30, 20], [-30, 20], [-30, -20], [30, -20]];
    this.path(n2, 10, gA.walk), this.path([[30, 0], [62, 0]], 10, gA.walk), this.path([[-30, 0], [-62, 0]], 10, gA.walk), this.path(n2, 7, gA.asphalt), this.path([[30, 0], [62, 0]], 7, gA.asphalt), this.path([[-30, 0], [-62, 0]], 7, gA.asphalt), this.path(n2, 0.3, gA.line, true, [2.4, 2.4]), this.circle(0, 0, 14, `#9be055`, false, 0.5, 6), this.path([[-24, 0], [24, 0]], 2.2, `#dccba0`), this.path([[0, -15], [0, 15]], 2.2, `#dccba0`), this.circle(0, 0, 3.4, `#dccba0`), [[-8, -8, 3, 2, `s`], [-2, -8, 3, 2, `s`], [4, -8, 3, 2, `s`], [-8, 6, 3, 2, `n`], [-2, 6, 3, 2, `n`], [4, 6, 3, 2, `n`], [9, -1, 2, 3, `w`], [-11, -2, 2, 3, `e`]].forEach(([e5, n3, r, i, a], o) => {
      let wall = cA(`siding`, lA[o % lA.length], `wood`), roofSkin = cA(`shingle`, uA[o % uA.length], `wood`);
      o === 2 ? this.aFrame({ x: e5, z: n3, w: r, d: i, wall, roofSkin, floor: dA, chests: 1 }) : o === 5 ? this.treehouse({ x: e5, z: n3, w: r, d: i, wall, roofSkin, floor: dA, chests: 1 }) : this.house({ x: e5, z: n3, w: r, d: i, floors: o % 3 == 1 ? 1 : 2, wall, roof: `gable`, roofSkin, doors: a, win: 0.5, chests: +(o % 2 == 0) });
      let s2 = (e5 + Math.floor(r / 2) + 0.5) * 5, c = (n3 + Math.floor(i / 2) + 0.5) * 5;
      a === `s` && (this.rect(s2, (n3 + i) * 5 + 3.4, 3.4, 7, gA.concrete), this.prop(`mailbox`, s2 + 3, -24.5, 0), t2.chance(0.6) && this.prop(`car`, s2 - 5.5, (n3 + i) * 5 + 3.6, 0)), a === `n` && (this.rect(s2, n3 * 5 - 3.4, 3.4, 7, gA.concrete), this.prop(`mailbox`, s2 - 3, 24.5, Math.PI), t2.chance(0.6) && this.prop(`car`, s2 + 5.5, n3 * 5 - 3.6, Math.PI)), a === `w` && (this.rect(e5 * 5 - 5, c, 10, 3.4, gA.concrete), this.prop(`mailbox`, 35, c + 3, -Math.PI / 2)), a === `e` && (this.rect((e5 + r) * 5 + 5, c, 10, 3.4, gA.concrete), this.prop(`mailbox`, -35, c - 3, Math.PI / 2)), a === `s` && this.fence(e5 * 5 - 1, n3 * 5 - 4, (e5 + r) * 5 + 1, n3 * 5 - 4), a === `n` && this.fence(e5 * 5 - 1, (n3 + i) * 5 + 4, (e5 + r) * 5 + 1, (n3 + i) * 5 + 4);
    });
    for (let [e5, t3] of [[-35, -25], [35, -25], [35, 25], [-35, 25]]) this.prop(`lamp`, e5, t3, 0);
    this.prop(`bench`, -6, -3.2, 0), this.prop(`bench`, 6, 3.2, Math.PI), this.prop(`picnic`, 9, -8, 0.4), this.prop(`hydrant`, 26, -16, 0), this.prop(`hydrant`, -26, 16, 0), this.prop(`car`, 12, -17.6, Math.PI / 2), this.prop(`car`, -14, 22.4, Math.PI / 2), this.prop(`truck`, 33, 9, 0), this.tree(`oak`, -9, -8, 1.15), this.tree(`oak`, 10, 8, 1), this.tree(`oak`, -10, 9, 0.95), this.tree(`oak`, 46, -30, 1.1), this.tree(`oak`, -47, 30, 1.2), this.loot(0, 0), this.loot(-18, 0), this.loot(18, 0), this.ammo(3, 9), this.chest(0, -11, 0, 0);
  }
  tower(e4) {
    let { x: t2, z: n2, w: r, d: i, floors: a } = e4, o = this.r, s2 = e4.base ?? e4.wall, c = e4.floor ?? fA, l2 = cA(`concrete`, 14276044, `stone`);
    for (let e5 = 0; e5 < r; e5++) for (let r2 = 0; r2 < i; r2++) this.piece(`floor`, t2 + e5, 0, n2 + r2, 0, mA);
    for (let u2 = 0; u2 < a; u2++) {
      let d2 = u2 === 0 ? s2 : e4.wall, f2 = (t3, n3, r2) => {
        if (u2 === 0) return e4.shops.includes(t3) ? `wallShop` : e4.doors.includes(t3) && n3 === Math.floor(r2 / 2) ? `wallDoor` : o.chance(0.55) ? `wallWin` : `wall`;
        if (e4.glass) return o.chance(0.22) ? `wallWin` : `wall`;
        let i2 = o.next();
        return i2 < e4.win ? `wallWin2` : i2 < e4.win + 0.22 ? `wallWin` : `wall`;
      };
      for (let e5 = 0; e5 < r; e5++) this.piece(f2(`n`, e5, r), t2 + e5, u2, n2, 0, d2), this.piece(f2(`s`, e5, r), t2 + e5, u2, n2 + i, 0, d2);
      for (let e5 = 0; e5 < i; e5++) this.piece(f2(`w`, e5, i), t2, u2, n2 + e5, 1, d2), this.piece(f2(`e`, e5, i), t2 + r, u2, n2 + e5, 1, d2);
      let p2 = this.stairCell(u2);
      this.piece(`stairs`, t2 + p2.i, u2, n2 + p2.k, p2.dir, l2);
      for (let e5 = 0; e5 < r; e5++) for (let r2 = 0; r2 < i; r2++) (e5 !== p2.i || r2 !== p2.k) && this.piece(`floor`, t2 + e5, u2 + 1, n2 + r2, 0, u2 === a - 1 ? pA : c);
    }
    for (let o2 = 0; o2 < r; o2++) this.piece(`parapet`, t2 + o2, a, n2, 0, e4.wall), this.piece(`parapet`, t2 + o2, a, n2 + i, 0, e4.wall);
    for (let o2 = 0; o2 < i; o2++) this.piece(`parapet`, t2, a, n2 + o2, 1, e4.wall), this.piece(`parapet`, t2 + r, a, n2 + o2, 1, e4.wall);
    let u = (t2 + r / 2) * 5, d = (n2 + i / 2) * 5;
    this.rect(u, d, r * 5 + 1.2, i * 5 + 1.2, `#aaa496`, true, 0.95, 0.6), this.plan.footprints.push({ x: this.px + u, z: this.pz + d, w: r * 5, d: i * 5, color: hA(e4.glass ? 9418968 : e4.wall.tint === 16777215 ? 12038826 : e4.wall.tint) });
    let f = e4.awn ?? o.int(0, 3), p = 0.13;
    for (let a2 of e4.shops) {
      let e5 = a2 === `n` || a2 === `s` ? r : i;
      for (let o2 = 0; o2 < e5; o2++) a2 === `n` && this.prop(`awning`, (t2 + o2 + 0.5) * 5, n2 * 5 - p, Math.PI, f), a2 === `s` && this.prop(`awning`, (t2 + o2 + 0.5) * 5, (n2 + i) * 5 + p, 0, f), a2 === `w` && this.prop(`awning`, t2 * 5 - p, (n2 + o2 + 0.5) * 5, -Math.PI / 2, f), a2 === `e` && this.prop(`awning`, (t2 + r) * 5 + p, (n2 + o2 + 0.5) * 5, Math.PI / 2, f);
    }
    for (let [a2, o2, s3] of e4.signs ?? []) {
      let e5 = 4.7;
      a2 === `n` && this.prop(`blade`, (t2 + o2) * 5, n2 * 5 - p, Math.PI, s3, e5), a2 === `s` && this.prop(`blade`, (t2 + o2) * 5, (n2 + i) * 5 + p, 0, s3, e5), a2 === `w` && this.prop(`blade`, t2 * 5 - p, (n2 + o2) * 5, -Math.PI / 2, s3, e5), a2 === `e` && this.prop(`blade`, (t2 + r) * 5 + p, (n2 + o2) * 5, Math.PI / 2, s3, e5);
    }
    let m = [];
    for (let e5 = 0; e5 < a; e5++) for (let t3 = 0; t3 < r; t3++) for (let n3 = 0; n3 < i; n3++) {
      let r2 = this.stairCell(e5), i2 = this.stairCell(e5 - 1);
      t3 === r2.i && n3 === r2.k || e5 > 0 && t3 === i2.i && n3 === i2.k || m.push([t3, n3, e5]);
    }
    for (let r2 = 0; r2 < e4.chests && m.length; r2++) {
      let [e5, r3, i2] = m.splice(o.int(0, m.length - 1), 1)[0];
      this.chest((t2 + e5 + 0.5) * 5 + o.range(-1, 1), (n2 + r3 + 0.5) * 5 + o.range(-1, 1), i2 * 4, o.int(0, 3) * Math.PI / 2);
    }
    for (let [e5, r2, i2] of m) {
      let a2 = o.next(), s3 = (t2 + e5 + 0.5) * 5, c2 = (n2 + r2 + 0.5) * 5;
      a2 < 0.06 ? this.loot(s3 + o.range(-1.2, 1.2), c2 + o.range(-1.2, 1.2), i2 * 4) : a2 < 0.09 ? this.ammo(s3 + o.range(-1.5, 1.5), c2 + o.range(-1.5, 1.5), i2 * 4) : a2 < 0.17 && i2 > 0 && this.prop(o.chance(0.5) ? `crate` : o.chance(0.5) ? `pallet` : `barrel`, s3 + o.range(-1.4, 1.4), c2 + o.range(-1.4, 1.4), o.range(0, 3), -1, i2 * 4);
    }
    let h = a * 4 + 0.06, g2 = this.stairCell(a - 1), _2 = [];
    for (let t3 = 0; t3 < r; t3++) for (let n3 = 0; n3 < i; n3++) t3 === g2.i && n3 === g2.k || (e4.keepRoofClear ?? []).some(([e5, r2]) => e5 === t3 && r2 === n3) || _2.push([t3, n3]);
    let v = () => _2.length ? _2.splice(o.int(0, _2.length - 1), 1)[0] : null;
    if (a >= 5) {
      let e5 = v();
      e5 && this.chest((t2 + e5[0] + 0.5) * 5, (n2 + e5[1] + 0.5) * 5, h - 0.06, o.int(0, 3) * Math.PI / 2);
    }
    {
      let e5 = v();
      e5 && this.loot((t2 + e5[0] + 0.5) * 5, (n2 + e5[1] + 0.5) * 5, h - 0.06);
    }
    if (e4.tank) {
      let e5 = v();
      e5 && this.prop(`rooftank`, (t2 + e5[0] + 0.5) * 5, (n2 + e5[1] + 0.5) * 5, o.range(0, 1.5), 0, h);
    }
    for (let e5 = 0; e5 < Math.min(3, Math.floor(r * i / 5)); e5++) {
      let e6 = v();
      e6 && this.prop(`acunit`, (t2 + e6[0] + 0.5) * 5 + o.range(-0.8, 0.8), (n2 + e6[1] + 0.5) * 5 + o.range(-0.8, 0.8), o.int(0, 3) * Math.PI / 2, 0, h);
    }
  }
  towers(e4) {
    this.begin(e4);
    let t2 = this.r;
    this.circle(0, 0, 77, `#b8b3a7`, true, 0.92, 9);
    let n2 = [];
    for (let e5 = 0; e5 <= 64; e5++) {
      let t3 = e5 / 64 * Math.PI * 2;
      n2.push([Math.cos(t3) * 68, Math.sin(t3) * 68]);
    }
    this.path(n2, 11, gA.walk), this.path(n2, 7, gA.asphalt), this.path(n2, 0.3, gA.line, true, [2.6, 2.6]);
    for (let [e5, t3] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) this.rect(e5 * 44, t3 * 44, 38, 38, `#9e9b94`, true, 0.95, 1);
    let r = [[-20, -20], [20, -20], [20, 20], [-20, 20], [-20, -20], [20, -20]], i = [[[0, -25], [0, -66]], [[0, 25], [0, 66]], [[-25, 0], [-66, 0]], [[25, 0], [66, 0]]];
    this.path(r, 10, gA.walk);
    for (let e5 of i) this.path(e5, 10, gA.walk);
    this.path(r, 6.2, gA.asphalt);
    for (let e5 of i) this.path(e5, 6.2, gA.asphalt);
    for (let [e5, t3] of [[1, -1], [1, 1], [-1, 1], [-1, -1]]) this.path([[e5 * 3.4, t3 * 20], [e5 * 20, t3 * 20], [e5 * 20, t3 * 3.4]], 0.25, gA.line, true, [2.4, 2.4]);
    for (let [[e5, t3], [n3, r2]] of i) {
      let i2 = 30.5 / 25;
      this.path([[e5 * i2, t3 * i2], [n3, r2]], 0.3, gA.line, true, [2.6, 2.6]);
    }
    for (let e5 of i) for (let t3 of [-1, 1]) {
      let [[n3, r2], [i2, a2]] = e5, o2 = n3 === 0, s3 = o2 ? t3 * 2.9 : 0, c2 = o2 ? 0 : t3 * 2.9;
      this.path([[n3 + s3, r2 + c2], [i2 + s3, a2 + c2]], 0.18, `#eeece6`);
    }
    for (let e5 = -2; e5 <= 2; e5++) {
      let t3 = e5 * 1.2;
      this.rect(t3, -27.5, 0.6, 4.4, `#efeee9`), this.rect(t3, 27.5, 0.6, 4.4, `#efeee9`), this.rect(-27.5, t3, 4.4, 0.6, `#efeee9`), this.rect(27.5, t3, 4.4, 0.6, `#efeee9`), this.rect(t3, -20, 0.6, 5.4, `#efeee9`), this.rect(t3, 20, 0.6, 5.4, `#efeee9`), this.rect(-20, t3, 5.4, 0.6, `#efeee9`), this.rect(20, t3, 5.4, 0.6, `#efeee9`);
    }
    this.rect(0, 0, 30, 30, `#e3d5b4`);
    for (let e5 = -10; e5 <= 10; e5 += 5) this.path([[e5, -14.5], [e5, 14.5]], 0.25, `#d5c49f`), this.path([[-14.5, e5], [14.5, e5]], 0.25, `#d5c49f`);
    this.path([[-14.6, -14.6], [14.6, -14.6], [14.6, 14.6], [-14.6, 14.6], [-14.6, -14.6]], 1, `#c3ad86`), this.circle(0, 8, 6.4, `#d2bc93`), this.circle(0, 8, 5.4, `#ebdfc4`), this.rect(0, -6, 10.5, 10.5, `#cdb791`);
    for (let t3 of uy) {
      let [n3, r2] = t3.pts[0], i2 = n3 - this.px, a2 = r2 - this.pz, o2 = Math.hypot(i2, a2);
      o2 > e4.r * 1.05 || o2 < 1 || this.path([[i2, a2], [i2 / o2 * 65, a2 / o2 * 65]], t3.width + 1, gA.asphalt);
    }
    let a = cA(`glass`, 16777215, `stone`), o = cA(`glass`, 14086890, `stone`), s2 = cA(`panel`, 16777215, `stone`), c = cA(`panel`, 15918804, `stone`), l2 = cA(`brick`, 16777215, `stone`), u = cA(`brick`, 16769232, `stone`), d = (e5) => cA(`stucco`, e5, `stone`), f = dA, p = [{ x: -5, z: -9, w: 4, d: 4, floors: 9, wall: a, base: s2, glass: true, shops: `se`, doors: ``, win: 0, chests: 3, tank: false }, { x: -5, z: -11, w: 4, d: 2, floors: 3, wall: d(16167875), shops: `en`, doors: ``, win: 0.6, chests: 1, tank: true, floor: f }, { x: 1, z: -9, w: 4, d: 4, floors: 6, wall: l2, base: c, shops: `sw`, doors: ``, win: 0.6, chests: 2, tank: true, signs: [[`s`, 3, 3]] }, { x: 1, z: -11, w: 4, d: 2, floors: 2, wall: s2, shops: `wn`, doors: ``, win: 0.5, chests: 1, tank: false }, { x: -5, z: 5, w: 4, d: 4, floors: 7, wall: d(11462351), shops: `ne`, doors: ``, win: 0.65, chests: 2, tank: true, signs: [[`n`, 1, 2]], floor: f }, { x: -5, z: 9, w: 4, d: 2, floors: 3, wall: u, shops: `es`, doors: ``, win: 0.55, chests: 1, tank: false }, { x: 1, z: 5, w: 4, d: 4, floors: 6, wall: s2, shops: `nw`, doors: ``, win: 0.6, chests: 2, tank: false, keepRoofClear: [[0, 0], [1, 0], [2, 0], [3, 0]] }, { x: 1, z: 9, w: 4, d: 2, floors: 2, wall: d(16375948), shops: `ws`, doors: ``, win: 0.55, chests: 1, tank: true, floor: f }, { x: -9, z: -5, w: 4, d: 4, floors: 8, wall: d(16245685), base: c, shops: `es`, doors: ``, win: 0.7, chests: 2, tank: true, signs: [[`e`, 2, 0]], floor: f }, { x: -11, z: -5, w: 2, d: 4, floors: 3, wall: l2, shops: `sw`, doors: ``, win: 0.5, chests: 1, tank: false }, { x: -9, z: 1, w: 4, d: 4, floors: 10, wall: o, base: s2, glass: true, shops: `en`, doors: ``, win: 0, chests: 3, tank: false }, { x: -11, z: 1, w: 2, d: 4, floors: 4, wall: d(11785458), shops: `nw`, doors: ``, win: 0.6, chests: 1, tank: true }, { x: 5, z: -5, w: 4, d: 4, floors: 7, wall: u, base: s2, shops: `ws`, doors: ``, win: 0.6, chests: 2, tank: true }, { x: 9, z: -5, w: 2, d: 4, floors: 2, wall: d(16167875), shops: `se`, doors: ``, win: 0.5, chests: 1, tank: false, floor: f }, { x: 5, z: 1, w: 4, d: 4, floors: 5, wall: d(13811951), shops: `wn`, doors: ``, win: 0.65, chests: 2, tank: true, floor: f }, { x: 9, z: 1, w: 2, d: 4, floors: 3, wall: c, shops: `ne`, doors: ``, win: 0.55, chests: 1, tank: false }, { x: 6, z: -9, w: 3, d: 3, floors: 4, wall: d(16234890), shops: `ws`, doors: ``, win: 0.6, chests: 2, tank: true, signs: [[`w`, 1, 1]], floor: f }, { x: -9, z: 6, w: 3, d: 3, floors: 3, wall: l2, shops: `en`, doors: ``, win: 0.6, chests: 1, tank: false, signs: [[`e`, 1, 4]] }, { x: 6, z: 6, w: 3, d: 3, floors: 3, wall: d(13215472), shops: `wn`, doors: ``, win: 0.6, chests: 2, tank: false, signs: [[`n`, 2, 5]] }];
    for (let e5 of p) this.tower(e5);
    this.turret({ x: -16, z: -16, w: 2, d: 2, floors: 4, wall: cA(`stonewall`, 12433064, `stone`), roofSkin: cA(`shingle`, 9067076, `wood`), floor: fA, chests: 1 });
    this.turret({ x: 14, z: 14, w: 2, d: 2, floors: 3, wall: cA(`stonewall`, 12433064, `stone`), roofSkin: cA(`shingle`, 5198684, `wood`), floor: fA, chests: 1 });
    this.prop(`roofsign`, 15, 26.6, Math.PI, 0, 24.06), this.prop(`clocktower`, 0, -6, 0, 0), this.prop(`fountain`, 0, 8, 0, 0);
    for (let [e5, t3] of [[-9.5, -1.5], [9.5, -1.5], [-9.5, 12.5], [9.5, 12.5], [-9.5, -12], [9.5, -12]]) this.prop(`plazalamp`, e5, t3, 0, 0);
    for (let [e5, t3] of [[-12.6, -12.6], [12.6, -12.6], [-12.6, 12.6], [12.6, 12.6]]) this.prop(`planter`, e5, t3, 0, 0);
    this.prop(`bench`, -6.6, 8, Math.PI / 2), this.prop(`bench`, 6.6, 8, -Math.PI / 2), this.prop(`bench`, 0, 14, Math.PI), this.prop(`bench`, -6.8, -6, Math.PI / 2), this.prop(`bench`, 6.8, -6, -Math.PI / 2), this.prop(`kiosk`, 11.5, 4, -Math.PI / 2, 0), this.prop(`cafe`, -11.5, 5, 0, 0), this.prop(`cafe`, -11.5, 0.5, 0, 2);
    for (let e5 = -4; e5 <= 4; e5++) {
      if (Math.abs(e5) <= 1) continue;
      let t3 = e5 * 3.2;
      this.prop(`bollard`, t3, -15.4, 0, 0), this.prop(`bollard`, t3, 15.4, 0, 0), this.prop(`bollard`, -15.4, t3, 0, 0), this.prop(`bollard`, 15.4, t3, 0, 0);
    }
    this.chest(0, -11.3, 0, Math.PI), this.loot(-4, 2), this.loot(5, -1), this.loot(0, 14.6);
    for (let e5 of [-1, 1]) this.prop(`trafficlight`, e5 * 6.2, -24.1, 0, 0), this.prop(`trafficlight`, e5 * 6.2, 24.1, Math.PI, 0), this.prop(`trafficlight`, -24.1, e5 * 6.2, Math.PI / 2, 0), this.prop(`trafficlight`, 24.1, e5 * 6.2, -Math.PI / 2, 0);
    let m = [[-11, -21.7, Math.PI / 2], [12, -18.3, -Math.PI / 2], [21.7, 10, 0], [-18.3, -11, Math.PI], [9, 21.7, Math.PI / 2], [-21.7, 13, 0], [2.1, -40, 0], [-2.1, 46, Math.PI], [40, 2.1, Math.PI / 2], [-46, -2.1, -Math.PI / 2], [-2.1, -52, Math.PI], [52, -2.1, -Math.PI / 2]];
    for (let [e5, n3, r2] of m) this.prop(t2.chance(0.2) ? `truck` : `car`, e5, n3, r2);
    this.prop(`busstop`, 4.15, -44, -Math.PI / 2, 0), this.prop(`busstop`, -4.15, 50, Math.PI / 2, 0), this.prop(`busstop`, 44, 4.15, Math.PI, 0);
    for (let e5 of [32, 44, 56]) for (let t3 of [-1, 1]) this.prop(`lamp`, t3 * 4.4, -e5, t3 > 0 ? 0 : Math.PI), this.prop(`lamp`, t3 * 4.4, e5, t3 > 0 ? 0 : Math.PI), this.prop(`lamp`, -e5, t3 * 4.4, t3 > 0 ? Math.PI / 2 : -Math.PI / 2), this.prop(`lamp`, e5, t3 * 4.4, t3 > 0 ? Math.PI / 2 : -Math.PI / 2);
    for (let [e5, t3] of [[5.6, -30], [-5.6, 34], [30, 5.6], [-34, -5.6]]) this.prop(`hydrant`, e5, t3, 0);
    this.circle(-37.5, -37.5, 9, `#8fd34e`, false, 0.95, 3), this.path([[-46, -37.5], [-29, -37.5]], 2, `#dccba0`), this.path([[-37.5, -46], [-37.5, -29]], 2, `#dccba0`), this.tree(`oak`, -42, -42, 1.15), this.tree(`oak`, -33, -42.5, 1), this.tree(`oak`, -42.5, -33, 1.05), this.prop(`cafe`, -34, -34, 0, 1), this.prop(`cafe`, -31.5, -38.5, 0, 0), this.prop(`bench`, -37.5, -31, Math.PI), this.prop(`planter`, -37.5, -37.5, 0, 0), this.chest(-44, -37.5, 0, Math.PI / 2), this.loot(-34, -44);
    let h = [[27.5, 33, 0], [-27.5, -50, Math.PI / 2], [50, 27.5, 0], [-50, 27.5, Math.PI], [27.5, -48, 0], [-27.5, 40, 0]];
    for (let [e5, t3, n3] of h) this.prop(`dumpster`, e5, t3, n3), this.prop(`crate`, e5 + 1.6, t3 + 1.8, n3 + 0.3), this.ammo(e5 - 1.2, t3 + 2.5);
    this.prop(`container`, 52, 38, Math.PI / 2), this.prop(`container`, 38, 52, 0), this.prop(`pallet`, -52, 40, 0.3), this.prop(`barrel`, -40, 52, 0), this.loot(0, -30), this.loot(30, 0), this.loot(-30, 0), this.loot(0, 30), this.ammo(40, 40), this.ammo(-40, 40), this.ammo(40, -40);
  }
  farm(e4) {
    this.begin(e4);
    let t2 = this.r;
    this.circle(-5, -8, 34, gA.dirt, true, 0.85, 14), this.barn({ x: -3, z: -6, w: 4, d: 5, wall: cA(`planks`, 12271671, `wood`), roofSkin: cA(`shingle`, 5198684, `wood`), floor: dA, doors: `s`, chests: 2 }), this.house({ x: 4, z: 3, w: 3, d: 2, floors: 2, wall: cA(`siding`, 16777215, `wood`), roof: `gable`, roofSkin: cA(`shingle`, 5599375, `wood`), doors: `w`, win: 0.55, chests: 1 }), this.barn({ x: -10, z: 2, w: 2, d: 4, wall: cA(`planks`, 14202250, `wood`), roofSkin: cA(`shingle`, 9067076, `wood`), floor: dA, doors: `e`, chests: 1 }), this.prop(`silo`, -24, -30, 0, 0), this.prop(`silo`, -30, -24, 0, 1), this.prop(`windmill`, 40, -34, 0.5), this.prop(`tractor`, 8, -22, 0.3), this.prop(`truck`, 28, 6, Math.PI / 2);
    for (let [e5, n2, r, i] of [[34, 36, 44, 30], [-22, 44, 40, 26], [38, -6, 30, 22]]) {
      this.rect(e5, n2, r, i, gA.field, true, 1, 2);
      for (let t3 = -i / 2 + 2; t3 < i / 2 - 1; t3 += 2.6) this.path([[e5 - r / 2 + 1.5, n2 + t3], [e5 + r / 2 - 1.5, n2 + t3]], 1.1, gA.crop);
      this.fence(e5 - r / 2 - 1, n2 - i / 2 - 1, e5 + r / 2 + 1, n2 - i / 2 - 1), this.fence(e5 - r / 2 - 1, n2 + i / 2 + 1, e5 + r / 2 + 1, n2 + i / 2 + 1), this.loot(e5 + t2.range(-8, 8), n2 + t2.range(-6, 6));
    }
    for (let e5 = 0; e5 < 12; e5++) {
      let e6 = t2.range(0, 6.28), n2 = t2.range(14, 52);
      this.prop(`haybale`, Math.cos(e6) * n2, Math.sin(e6) * n2, t2.range(0, 6.28));
    }
    this.prop(`haybale`, 2, 6, 0), this.prop(`haybale`, 3.6, 6.4, 1.2), this.prop(`haybale`, 2.8, 6.2, 0.4, 0, 1.45), this.prop(`crate`, -16, -14, 0.2), this.prop(`barrel`, -17.5, -13, 0), this.prop(`pallet`, 12, -4, 0.2), this.prop(`logpile`, -20, 14, Math.PI / 2), this.tree(`oak`, 18, 22, 1.25), this.tree(`oak`, -34, 8, 1.1), this.tree(`oak`, 50, 14, 1), this.chest(-25, -36, 0, 0.4), this.ammo(10, -18), this.ammo(-12, 26), this.loot(20, -8), this.loot(-30, -12), this.loot(0, 30);
  }
  lumber(e4) {
    this.begin(e4);
    let t2 = this.r;
    this.circle(0, 0, 44, gA.dark, true, 0.8, 16);
    let n2 = cA(`planks`, 13214330, `wood`), r = cA(`shingle`, 5208666, `wood`);
    this.treehouse({ x: -7, z: -6, w: 2, d: 2, wall: n2, roofSkin: r, floor: dA, chests: 1 }), this.aFrame({ x: 3, z: -7, w: 2, d: 3, wall: n2, roofSkin: r, floor: dA, chests: 1 }), this.treehouse({ x: -6, z: 3, w: 3, d: 2, wall: n2, roofSkin: cA(`shingle`, 7031354, `wood`), floor: dA, chests: 1 }), this.house({ x: 2, z: 2, w: 3, d: 4, floors: 1, wall: cA(`planks`, 16777215, `wood`), roof: `flat`, roofSkin: cA(`planks`, 11569756, `wood`), doors: ``, win: 0, open: `nw`, chests: 1 });
    for (let [e5, t3, n3] of [[-2, -14, 0], [3, -15.5, 0.1], [-20, -2, Math.PI / 2], [-22, 4, Math.PI / 2], [12, 26, 0], [-4, 20, 0.2], [24, -4, Math.PI / 2], [-14, 22, 0], [8, 12, Math.PI / 2], [10.5, 17, Math.PI / 2]]) this.prop(`logpile`, e5, t3, n3);
    for (let e5 = 0; e5 < 16; e5++) {
      let e6 = t2.range(0, 6.28), n3 = t2.range(18, 46);
      this.prop(`stump`, Math.cos(e6) * n3, Math.sin(e6) * n3, t2.range(0, 6.28));
    }
    this.prop(`campfire`, -1, -2, 0), this.prop(`tent`, -5, -1, 0.5, 0), this.prop(`tent`, 2, -5, -0.4, 1), this.prop(`truck`, 22, 8, 0.1), this.prop(`crate`, 16, 14, 0.3), this.prop(`crate`, 17.2, 15.2, 0.9), this.prop(`pallet`, 6, 24, 0), this.prop(`watertower`, -32, -22, 0), this.tree(`pine`, 30, -20, 1.2), this.tree(`pine`, -30, 24, 1.3), this.tree(`pine`, 34, 22, 1.1), this.tree(`pine`, -12, -30, 1.25), this.loot(0, 6), this.loot(-12, -4), this.loot(20, -10), this.ammo(4, -1), this.ammo(-18, 14), this.chest(-33, -18, 0, 1.2);
  }
  junk(e4) {
    this.begin(e4);
    let t2 = this.r;
    this.circle(0, 0, 47, `#8d7a5c`, true, 0.92, 9);
    for (let e5 = 0; e5 < 14; e5++) this.circle(t2.range(-34, 34), t2.range(-34, 34), t2.range(2, 5), `#5f5548`, true, 0.35, 2);
    let n2 = cA(`metal`, 14263172, `metal`);
    for (let e5 = -7; e5 < 7; e5++) {
      let r2 = e5 >= -1 && e5 <= 0;
      !r2 && t2.chance(0.86) && this.piece(`wall`, e5, 0, -7, 0, n2), !r2 && t2.chance(0.86) && this.piece(`wall`, e5, 0, 7, 0, n2), !r2 && t2.chance(0.86) && this.piece(`wall`, -7, 0, e5, 1, n2), !r2 && t2.chance(0.86) && this.piece(`wall`, 7, 0, e5, 1, n2);
    }
    this.house({ x: -6, z: -6, w: 3, d: 4, floors: 1, wall: cA(`metal`, 12175318, `metal`), roof: `flat`, roofSkin: cA(`metal`, 10135219, `metal`), floor: fA, doors: `es`, win: 0.1, roofAccess: true, chests: 2 }), this.house({ x: 4, z: -6, w: 2, d: 2, floors: 2, wall: cA(`siding`, 10466504, `wood`), roof: `gable`, roofSkin: cA(`shingle`, 9067076, `wood`), doors: `s`, win: 0.5, chests: 1 });
    let r = () => t2.int(0, 4);
    for (let [e5, t3, n3, i] of [[18, 8, 0, 0], [21, 8, 0, 0], [18, 8, 0, 1], [24.2, 16, Math.PI / 2, 0], [16, 24, Math.PI / 2, 0], [16, 27, Math.PI / 2, 0], [16, 25.5, Math.PI / 2, 1], [28, 26, 0, 0]]) this.prop(`container`, e5, t3, n3, r(), i * 2.6);
    for (let [e5, n3] of [[-22, 14], [-14, 22], [-24, 26], [-4, 26]]) {
      let r2 = t2.int(2, 3);
      for (let i = 0; i < r2; i++) this.prop(`car`, e5 + t2.range(-0.3, 0.3), n3 + t2.range(-0.3, 0.3), t2.int(0, 1) * Math.PI / 2 + t2.range(-0.06, 0.06), -1, i * 1.5);
    }
    for (let [e5, t3, n3] of [[-8, 12, 0.05], [4, 14, Math.PI / 2], [10, -18, 0], [-18, 2, Math.PI / 2], [26, -12, 0]]) this.prop(`car`, e5, t3, n3);
    this.prop(`truck`, -2, 4, 0.1), this.prop(`truck`, 26, -24, Math.PI / 2);
    for (let e5 = 0; e5 < 9; e5++) this.prop(`tires`, t2.range(-30, 30), t2.range(-30, 30), t2.range(0, 6));
    for (let e5 = 0; e5 < 9; e5++) this.prop(`barrel`, t2.range(-30, 30), t2.range(-30, 30), 0);
    this.prop(`dumpster`, 12, -30, 0), this.prop(`dumpster`, -30, -8, Math.PI / 2), this.prop(`crate`, 6, 6, 0.4), this.prop(`crate`, 7.3, 6.6, 1.1), this.prop(`pallet`, -10, -2, 0.2), this.prop(`pallet`, 30, 4, 0), this.chest(19.5, 8, 5.2, 0), this.chest(-23, 20, 0, 0.8), this.loot(0, 0), this.loot(12, 20), this.loot(-12, -14), this.loot(26, -4), this.ammo(-28, 30), this.ammo(22, -30), this.ammo(2, 30);
  }
  beach(e4) {
    this.begin(e4);
    let t2 = this.r;
    this.circle(0, 4, 56, gA.sand, true, 0.95, 16);
    let n2 = (e5) => cA(`planks`, [16771524, 13233397, 16765120, 14874048, 16773544][e5 % 5], `wood`), r = cA(`shingle`, 15124846, `wood`);
    [[-8, -6, 1, 1, `s`], [-5, -7, 1, 1, `s`], [5, -7, 1, 1, `s`], [8, -6, 1, 1, `s`], [-9, -1, 2, 1, `e`], [8, -1, 2, 1, `w`]].forEach(([e5, t3, i, a, o], s2) => s2 === 2 ? this.pagoda({ x: e5, z: t3, w: 2, d: 2, tiers: 2, wall: n2(s2), roofSkin: r, floor: dA, chests: 1 }) : this.house({ x: e5, z: t3, w: i, d: a, floors: 1, wall: n2(s2), roof: `pyr`, roofSkin: r, doors: o, win: 0.4, chests: +(s2 % 3 == 0) })), this.house({ x: -2, z: -5, w: 3, d: 2, floors: 1, wall: cA(`planks`, 16777215, `wood`), roof: `flat`, roofSkin: cA(`floorwood`, 14858111, `wood`), doors: ``, win: 0.3, open: `s`, chests: 1, roofAccess: false });
    for (let e5 = -3; e5 < 13; e5++) for (let t3 = -1; t3 < 1; t3++) this.piece(`floor`, t3, 0, e5, 0, dA);
    for (let e5 = -3; e5 < 3; e5++) for (let t3 = 11; t3 < 13; t3++) this.piece(`floor`, e5, 0, t3, 0, dA);
    this.chest(0, 61, 0, Math.PI), this.loot(-11, 58), this.ammo(11, 58), this.loot(0, 30);
    for (let e5 = 0; e5 < 9; e5++) this.prop(`umbrella`, t2.range(-40, 40), t2.range(6, 30) * (e5 % 2 ? 1 : 0.7), t2.range(0, 6.28), e5);
    for (let e5 = 0; e5 < 4; e5++) this.propW(`boat`, -30 + e5 * 18 + t2.range(-3, 3), 44 + t2.range(-4, 4), t2.range(-0.6, 0.6));
    this.prop(`campfire`, -22, 4, 0), this.prop(`tent`, -27, 1, 0.8, 2), this.prop(`tent`, -24, 9, -0.5, 0), this.prop(`crate`, 6, -2, 0.2), this.prop(`barrel`, 7.4, -2.6, 0);
    for (let e5 = 0; e5 < 12; e5++) {
      let e6 = t2.range(0, 6.28), n3 = t2.range(24, 50);
      this.tree(`palm`, Math.cos(e6) * n3, Math.sin(e6) * n3 * 0.7 - 6, t2.range(0.9, 1.3));
    }
    this.loot(-20, -12), this.loot(20, -12), this.loot(-30, 20), this.loot(30, 20), this.ammo(0, -14);
  }
  docks(e4) {
    this.begin(e4);
    let t2 = this.r;
    this.circle(0, 0, 50, gA.concrete, true, 1, 8), this.barn({ x: -2, z: -8, w: 4, d: 5, wall: cA(`metal`, 15258280, `metal`), roofSkin: cA(`metal`, 10135219, `metal`), floor: fA, doors: `s`, chests: 2 }), this.barn({ x: -2, z: 3, w: 4, d: 4, wall: cA(`metal`, 10469600, `metal`), roofSkin: cA(`metal`, 8885667, `metal`), floor: fA, doors: `n`, chests: 2 });
    for (let e5 = -14; e5 < -4; e5++) for (let t3 = -1; t3 < 1; t3++) this.piece(`floor`, e5, 0, t3, 0, fA);
    for (let e5 = -14; e5 < -12; e5++) for (let t3 = -3; t3 < 3; t3++) this.piece(`floor`, e5, 0, t3, 0, fA);
    this.chest(-66, 0, 0, Math.PI / 2), this.loot(-62, -11), this.ammo(-62, 11), this.loot(-40, 0);
    let n2 = () => t2.int(0, 4);
    for (let [e5, t3, r, i] of [[26, -22, 0, 0], [29, -22, 0, 0], [32, -22, 0, 0], [27.5, -22, 0, 1], [26, -12, 0, 0], [29, -12, 0, 0], [28, 6, Math.PI / 2, 0], [28, 9, Math.PI / 2, 0], [28, 7.5, Math.PI / 2, 1], [36, 18, 0, 0], [36, 28, 0, 0]]) this.prop(`container`, e5, t3, r, n2(), i * 2.6);
    this.prop(`truck`, 14, -2, 0), this.prop(`truck`, 16, 30, Math.PI / 2);
    for (let e5 = 0; e5 < 6; e5++) this.prop(`pallet`, t2.range(-14, 22), t2.range(-30, 34), t2.range(0, 3));
    for (let e5 = 0; e5 < 6; e5++) this.prop(`barrel`, t2.range(-16, 22), t2.range(-32, 34), 0);
    for (let e5 = 0; e5 < 5; e5++) this.prop(`crate`, t2.range(-14, 22), t2.range(-32, 34), t2.range(0, 3));
    for (let [e5, t3] of [[-20, -8], [-20, 8], [20, -32], [20, 34]]) this.prop(`lamp`, e5, t3, 0);
    this.prop(`dumpster`, 12, 14, Math.PI / 2), this.propW(`boat`, -76, 12, 0.3), this.propW(`boat`, -80, -11, -0.2), this.chest(28, -17, 0, 0), this.chest(27.5, -22, 5.2, 0), this.loot(10, -16), this.loot(22, 0), this.loot(8, 26), this.ammo(-10, -18), this.ammo(30, 24);
  }
  summit(e4) {
    this.begin(e4), this.circle(0, 0, 20, `#e9eef5`, true, 0.6, 8), this.turret({ x: -2, z: -2, w: 2, d: 2, floors: 3, wall: cA(`stonewall`, 15002868, `stone`), roofSkin: cA(`shingle`, 9067076, `wood`), floor: fA, chests: 1 }), this.house({ x: 1, z: -3, w: 2, d: 2, floors: 1, wall: cA(`planks`, 13209434, `wood`), roof: `gable`, roofSkin: cA(`metal`, 3041960, `metal`), floor: dA, doors: `w`, win: 0.6, chests: 0 }), this.prop(`watertower`, 11, 4, 0), this.prop(`crate`, 3, -2, 0.2), this.prop(`crate`, 3.6, -0.8, 0.9), this.prop(`barrel`, 5, 8, 0), this.prop(`tent`, -6, 10, 0.4, 1), this.prop(`campfire`, -1, 9, 0), this.prop(`logpile`, 12, -8, Math.PI / 2), this.prop(`tent`, -12, 3, -0.6, 2), this.prop(`barrel`, 6.6, 8.6, 0), this.prop(`crate`, -9, -9, 0.6);
    for (let [e5, t2, n2] of [[-17, -6, 1.1], [-15, 9, 0.95], [-6, 17, 1.05], [16, 11, 1], [18, -2, 1.15], [8, 17, 0.9], [-12, -15, 1]]) this.tree(`pine`, e5, t2, n2);
    for (let [e5, t2] of [[-19, 2], [14, -15], [2, 19], [-4, -19], [19, 6]]) {
      this.tree(`rock`, e5, t2, this.r.range(1, 1.6));
      let n2 = this.plan.trees[this.plan.trees.length - 1];
      n2.variant = this.r.int(0, 3), n2.tint = 15660026;
    }
    this.chest(4, 4, 0, -0.6), this.chest(-5, -5, 4, 0.5), this.loot(8, -8), this.loot(-10, 4), this.ammo(0, 13), this.plan.llamas.push({ x: e4.x - 12, y: e4.y, z: e4.z - 10, rot: 0.8 });
  }
  castle(e4) {
    this.begin(e4);
    let t2 = this.r;
    this.circle(0, 0, 34, `#a59c8c`, true, 0.75, 10);
    let n2 = cA(`stonewall`, 16777215, `stone`), r = cA(`stonewall`, 14275268, `stone`);
    for (let e5 = -5; e5 < 5; e5++) {
      let r2 = e5 === -1 || e5 === 0;
      for (let i = 0; i < 2; i++) {
        let a = i === 0 ? 0.9 : 0.55;
        t2.chance(a) && this.piece(i === 1 && t2.chance(0.3) ? `wallWin` : `wall`, e5, i, -5, 0, n2), !r2 && t2.chance(a) && this.piece(`wall`, e5, i, 5, 0, n2), t2.chance(a) && this.piece(`wall`, -5, i, e5, 1, n2), t2.chance(a) && this.piece(`wall`, 5, i, e5, 1, n2);
      }
    }
    this.turret({ x: -2, z: -2, w: 3, d: 3, floors: 4, wall: r, roofSkin: cA(`shingle`, 9067076, `wood`), floor: cA(`stonewall`, 13222580, `stone`), chests: 2 }), this.turret({ x: -5, z: -5, w: 2, d: 2, floors: 3, wall: n2, roofSkin: cA(`shingle`, 5198684, `wood`), floor: cA(`stonewall`, 13222580, `stone`), chests: 1 }), this.church({ x: 3, z: 3, w: 2, d: 2, wall: n2, roofSkin: cA(`shingle`, 9067076, `wood`), floor: cA(`stonewall`, 13222580, `stone`), chests: 1 }), this.chest(0, 0, 12, 0), this.loot(-18, 12), this.loot(14, -16), this.loot(0, 18), this.ammo(-12, -4), this.ammo(18, 6), this.prop(`campfire`, -12, 14, 0), this.prop(`tent`, -16, 17, 0.6, 2), this.prop(`crate`, 12, -14, 0.3), this.prop(`barrel`, 13.3, -15, 0), this.prop(`haybale`, -14, -12, 0.4), this.plan.llamas.push({ x: e4.x + 16, y: e4.y, z: e4.z + 14, rot: -2.2 });
  }
  market(e4) {
    this.begin(e4);
    let t2 = this.r;
    this.circle(0, 0, 46, gA.concrete, true, 0.9, 12);
    this.circle(0, 0, 10, gA.walk, true, 0.95, 4);
    let n2 = cA(`planks`, 16777215, `wood`), r = cA(`shingle`, 15124846, `wood`);
    [[-14, -10, 3, 2, `s`], [12, -12, 3, 2, `s`], [-13, 9, 3, 2, `n`], [13, 10, 3, 2, `n`], [-16, 0, 2, 3, `e`], [16, 0, 2, 3, `w`]].forEach(([e5, t3, i, a, o], s2) => s2 === 0 ? this.pagoda({ x: e5, z: t3, w: i, d: a, tiers: 3, wall: n2, roofSkin: r, floor: dA, chests: 1 }) : s2 === 3 ? this.pagoda({ x: e5, z: t3, w: i, d: a, tiers: 2, wall: n2, roofSkin: r, floor: dA, chests: 1 }) : this.house({ x: e5, z: t3, w: i, d: a, floors: 2, wall: n2, roof: `pyr`, roofSkin: r, doors: o, win: 0.45, chests: +(s2 % 2 == 0) }));
    this.prop(`fountain`, 0, 0, 0, 0);
    for (let e5 = 0; e5 < 8; e5++) {
      let i = e5 / 8 * Math.PI * 2;
      this.prop(`kiosk`, Math.cos(i) * 16, Math.sin(i) * 16, i + Math.PI / 2, e5 % 3);
      this.prop(`awning`, Math.cos(i) * 20, Math.sin(i) * 20, i + Math.PI / 2, e5 % 4);
    }
    this.prop(`clocktower`, -22, -18, 0.4, 0);
    this.chest(-6, 6, 0, 0.5), this.chest(6, -6, 0, -0.5), this.loot(0, 14), this.loot(0, -14), this.ammo(-14, 0), this.ammo(14, 0);
    for (let e5 = 0; e5 < 6; e5++) this.propW(`planter`, t2.range(-30, 30), t2.range(-30, 30), t2.range(0, 6.28));
    for (let e5 = 0; e5 < 4; e5++) this.prop(`plazalamp`, -20 + e5 * 13, -20 + (e5 % 2) * 40, 0, 0);
    this.loot(-24, 20), this.loot(24, -20), this.loot(-24, -20), this.loot(24, 20);
  }
  outpost(e4) {
    this.begin(e4);
    let t2 = this.r;
    this.circle(0, 0, 42, gA.sand, true, 0.95, 18);
    this.circle(0, 0, 14, gA.dirt, true, 0.9, 8);
    let n2 = cA(`stonewall`, 14275268, `stone`), r = cA(`stonewall`, 12433064, `stone`);
    this.greenhouse({ x: -3, z: -3, w: 4, d: 3, wall: cA(`glass`, 16777215, `metal`), roofSkin: cA(`metal`, 10135219, `metal`), floor: dA, chests: 2 });
    this.house({ x: 6, z: -6, w: 3, d: 3, floors: 1, wall: n2, roof: `flat`, roofSkin: r, doors: `w`, win: 0.3, chests: 1 });
    this.greenhouse({ x: -8, z: 5, w: 3, d: 2, wall: cA(`glass`, 16777215, `metal`), roofSkin: cA(`metal`, 8885667, `metal`), floor: dA, chests: 1 });
    for (let e5 = 0; e5 < 10; e5++) {
      let i = e5 / 10 * Math.PI * 2;
      this.piece(`wall`, Math.round(Math.cos(i) * 12), 0, Math.round(Math.sin(i) * 12), Math.round(i / (Math.PI / 2)) % 2, n2);
    }
    this.prop(`watertower`, 10, 8, 0, 0), this.prop(`silo`, -10, -8, 0, 0), this.prop(`windmill`, 12, -10, 0.5, 0);
    this.chest(0, 0, 0, 0), this.loot(-14, -14), this.loot(14, 14), this.loot(-14, 14), this.ammo(0, -16), this.ammo(0, 16);
    for (let e5 = 0; e5 < 8; e5++) this.prop(`crate`, t2.range(-18, 18), t2.range(-18, 18), t2.range(0, 6.28));
    for (let e5 = 0; e5 < 5; e5++) this.prop(`barrel`, t2.range(-16, 16), t2.range(-16, 16), 0);
    for (let e5 = 0; e5 < 10; e5++) {
      let i = t2.range(0, 6.28), a = t2.range(20, 40);
      this.tree(`oak`, Math.cos(i) * a, Math.sin(i) * a, t2.range(0.7, 1.1));
    }
  }
  village(e4) {
    this.begin(e4);
    let t2 = this.r;
    this.circle(0, 0, 44, gA.dirt, true, 0.85, 14);
    let n2 = cA(`planks`, 16777215, `wood`), r = cA(`shingle`, 15124846, `wood`);
    [[-8, -8, 2, 2, `s`], [6, -10, 2, 2, `s`], [-10, 4, 2, 2, `e`], [8, 6, 2, 2, `w`], [-4, 10, 3, 2, `n`], [10, -2, 2, 3, `w`]].forEach(([e5, t3, i, a, o], s2) => s2 === 1 ? this.pagoda({ x: e5, z: t3, w: i, d: a, tiers: 2, wall: n2, roofSkin: r, floor: dA, chests: 1 }) : s2 === 3 ? this.church({ x: e5, z: t3, w: i, d: a, wall: n2, roofSkin: r, floor: dA, chests: 1 }) : this.house({ x: e5, z: t3, w: i, d: a, floors: 1, wall: n2, roof: `pyr`, roofSkin: r, doors: o, win: 0.5, chests: +(s2 % 3 == 0) }));
    this.church({ x: -2, z: -2, w: 3, d: 3, wall: cA(`planks`, 16777215, `wood`), roofSkin: r, floor: dA, chests: 2 });
    this.prop(`campfire`, 0, 2, 0), this.prop(`tent`, -6, 6, 0.8, 1), this.prop(`tent`, 6, -4, -0.6, 2);
    this.prop(`haybale`, -12, -6, 0.3), this.prop(`haybale`, 12, 8, -0.4), this.prop(`crate`, 4, 12, 0.2), this.prop(`barrel`, 5.4, 12.6, 0);
    this.chest(-2, 0, 0, 0), this.loot(-16, -16), this.loot(16, 16), this.loot(-16, 16), this.ammo(0, -18), this.ammo(0, 18);
    for (let e5 = 0; e5 < 16; e5++) {
      let i = t2.range(0, 6.28), a = t2.range(18, 42);
      this.tree(t2.chance(0.5) ? `pine` : `oak`, Math.cos(i) * a, Math.sin(i) * a, t2.range(0.9, 1.4));
    }
    this.plan.llamas.push({ x: e4.x - 14, y: e4.y, z: e4.z + 12, rot: 1.2 });
  }
  harbor(e4) {
    this.begin(e4);
    let t2 = this.r;
    this.circle(0, 0, 40, gA.concrete, true, 0.9, 12);
    this.circle(0, -8, 16, gA.sand, true, 0.9, 8);
    let n2 = cA(`planks`, 16777215, `wood`), r = cA(`shingle`, 15124846, `wood`);
    this.lighthouse({ x: -6, z: -6, w: 2, d: 2, floors: 5, wall: cA(`stucco`, 16777215, `stone`), roofSkin: cA(`metal`, 8885667, `metal`), floor: fA, chests: 1 });
    this.house({ x: 6, z: -8, w: 3, d: 2, floors: 1, wall: n2, roof: `pyr`, roofSkin: r, doors: `s`, win: 0.4, chests: 1 });
    this.house({ x: 0, z: 4, w: 4, d: 2, floors: 1, wall: cA(`planks`, 16777215, `wood`), roof: `flat`, roofSkin: cA(`floorwood`, 14858111, `wood`), doors: `n`, win: 0.3, open: `n`, chests: 1, roofAccess: false });
    for (let e5 = -3; e5 < 4; e5++) for (let t3 = 8; t3 < 10; t3++) this.piece(`floor`, e5, 0, t3, 0, dA);
    // Pond bridge: wooden footbridge over the lake inlet
    for (let e5 = -2; e5 <= 2; e5++) this.piece(`floor`, e5, 0, 12, 0, cA(`planks`, 16777215, `wood`));
    for (let e5 = -2; e5 <= 2; e5++) { this.piece(`wall`, e5, 0, 11, 0, cA(`planks`, 16777215, `wood`)); this.piece(`wall`, e5, 0, 13, 0, cA(`planks`, 16777215, `wood`)); }
    this.prop(`clocktower`, -14, -14, 0.3, 0);
    for (let e5 = 0; e5 < 4; e5++) this.propW(`boat`, -24 + e5 * 16 + t2.range(-3, 3), 16 + t2.range(-4, 4), t2.range(-0.6, 0.6));
    this.prop(`lamp`, -10, 2, 0), this.prop(`lamp`, 10, 2, 0), this.prop(`bench`, -4, 6, 0), this.prop(`bench`, 4, 6, 0);
    this.chest(0, 0, 0, 0), this.loot(-18, -18), this.loot(18, -18), this.loot(-18, 12), this.loot(18, 12), this.ammo(0, -16);
    for (let e5 = 0; e5 < 6; e5++) this.prop(`crate`, t2.range(-16, 16), t2.range(-14, 8), t2.range(0, 6.28));
    for (let e5 = 0; e5 < 8; e5++) {
      let i = t2.range(0, 6.28), a = t2.range(20, 38);
      this.tree(`palm`, Math.cos(i) * a, Math.sin(i) * a * 0.8 - 4, t2.range(0.9, 1.3));
    }
  }
  volcano(e4) {
    this.begin(e4);
    let t2 = this.r;
    // Volcano crater with lava
    this.circle(0, 0, 45, `#2a2a2a`, true, 1.2, 16);
    this.circle(0, 0, 18, `#ff6a00`, true, 0.5, 12);
    // Obsidian rocks (use trees/rocks from nature)
    for (let e5 = 0; e5 < 12; e5++) {
      let i = t2.range(0, 6.28), a = t2.range(22, 42);
      this.tree(`rock`, Math.cos(i) * a, Math.sin(i) * a, t2.range(0.8, 1.5));
    }
    // Lava pools
    for (let e5 = 0; e5 < 4; e5++) {
      let i = t2.range(0, 6.28), a = t2.range(25, 38);
      this.circle(Math.cos(i) * a, Math.sin(i) * a, 6, `#ff6a00`, true, 0.3, 8);
    }
    // Volcanic structures
    this.house({ x: -10, z: -10, w: 3, d: 2, floors: 2, wall: cA(`stonewall`, 2893312, `stone`), roof: `flat`, roofSkin: cA(`stonewall`, 2893312, `stone`), doors: `s`, win: 0.3, chests: 2 });
    this.house({ x: 10, z: -8, w: 3, d: 2, floors: 1, wall: cA(`stonewall`, 2893312, `stone`), roof: `pyr`, roofSkin: cA(`brick`, 16753920, `stone`), doors: `n`, win: 0.4, chests: 1 });
    this.prop(`clocktower`, 0, -20, 0.5, 0);
    // Loot
    this.chest(0, 0, 0, 0), this.chest(-12, -12, 0, 0), this.chest(12, -10, 0, 0);
    this.loot(-20, 10), this.loot(20, 10), this.loot(0, 20), this.ammo(0, -15);
    for (let e5 = 0; e5 < 6; e5++) this.prop(`crate`, t2.range(-18, 18), t2.range(-16, 16), t2.range(0, 6.28));
  }
  oasis(e4) {
    this.begin(e4);
    let t2 = this.r;
    // Desert oasis with water and palms
    this.circle(0, 0, 40, `#f4e7c6`, true, 0.95, 12);
    this.circle(0, 0, 15, `#4a90e2`, true, 0.9, 8);
    // Palm trees around water
    for (let e5 = 0; e5 < 10; e5++) {
      let i = t2.range(0, 6.28), a = t2.range(16, 35);
      this.tree(`palm`, Math.cos(i) * a, Math.sin(i) * a, t2.range(0.9, 1.3));
    }
    // Desert structures
    this.pagoda({ x: -8, z: -8, w: 3, d: 2, tiers: 2, wall: cA(`stucco`, 16777215, `stone`), roofSkin: cA(`stucco`, 16777215, `stone`), floor: dA, chests: 1 });
    this.house({ x: 8, z: -6, w: 3, d: 2, floors: 1, wall: cA(`stucco`, 16777215, `stone`), roof: `flat`, roofSkin: cA(`stucco`, 16777215, `stone`), doors: `n`, win: 0.3, chests: 1 });
    this.prop(`campfire`, 0, 0, 0), this.prop(`tent`, -12, 5, 0.5, 1), this.prop(`tent`, 12, 5, -0.5, 1);
    this.chest(0, 0, 0, 0), this.loot(-15, -10), this.loot(15, -10), this.loot(0, 15), this.ammo(0, -12);
    for (let e5 = 0; e5 < 4; e5++) this.prop(`crate`, t2.range(-20, 20), t2.range(-15, 15), t2.range(0, 6.28));
  }
  neon(e4) {
    this.begin(e4);
    let t2 = this.r;
    // Neon city with cyberpunk buildings
    this.circle(0, 0, 45, `#1a1a2e`, true, 0.9, 12);
    // Tall buildings with neon signs
    for (let e5 = 0; e5 < 8; e5++) {
      let i = t2.range(-30, 30), a = t2.range(-30, 30);
      e5 % 3 === 0 ? this.turret({ x: i, z: a, w: 2, d: 2, floors: 4, wall: cA(`metal`, 2893312, `metal`), roofSkin: cA(`metal`, 2893312, `metal`), floor: fA, chests: 1 }) : this.house({ x: i, z: a, w: 3, d: 3, floors: 3, wall: cA(`metal`, 2893312, `metal`), roof: `flat`, roofSkin: cA(`metal`, 2893312, `metal`), doors: `s`, win: 0.5, chests: 1 });
    }
    this.prop(`clocktower`, 0, 0, 0.5, 0);
    this.prop(`lamp`, -10, -10, 0), this.prop(`lamp`, 10, -10, 0), this.prop(`lamp`, -10, 10, 0), this.prop(`lamp`, 10, 10, 0);
    this.chest(0, 0, 0, 0), this.chest(-15, -15, 0, 0), this.chest(15, 15, 0, 0);
    this.loot(-20, 0), this.loot(20, 0), this.loot(0, -20), this.loot(0, 20), this.ammo(0, 0);
    for (let e5 = 0; e5 < 6; e5++) this.prop(`crate`, t2.range(-25, 25), t2.range(-25, 25), t2.range(0, 6.28));
  }
  spires(e4) {
    this.begin(e4);
    let t2 = this.r;
    // Skyfall Spires: futuristic sky towers
    this.circle(0, 0, 46, `#1a0b2e`, true, 0.9, 12);
    this.circle(0, 0, 20, `#00e5ff`, true, 0.5, 8);
    // Central mega-tower
    this.turret({ x: -1, z: -1, w: 3, d: 3, floors: 6, wall: cA(`metal`, 2893312, `metal`), roofSkin: cA(`metal`, 2893312, `metal`), floor: fA, chests: 3 });
    // Satellite spires
    for (let e5 = 0; e5 < 6; e5++) {
      let i = t2.range(-32, 32), a = t2.range(-32, 32);
      e5 % 2 === 0 ? this.turret({ x: i, z: a, w: 2, d: 2, floors: 4, wall: cA(`metal`, 2893312, `metal`), roofSkin: cA(`metal`, 2893312, `metal`), floor: fA, chests: 1 }) : this.house({ x: i, z: a, w: 2, d: 2, floors: 3, wall: cA(`metal`, 2893312, `metal`), roof: `pyr`, roofSkin: cA(`metal`, 2893312, `metal`), doors: `s`, win: 0.5, chests: 1 });
    }
    this.prop(`clocktower`, 0, -18, 0.5, 0);
    this.prop(`lamp`, -12, -12, 0), this.prop(`lamp`, 12, -12, 0), this.prop(`lamp`, -12, 12, 0), this.prop(`lamp`, 12, 12, 0);
    this.chest(0, 0, 0, 0), this.chest(-18, -18, 0, 0), this.chest(18, 18, 0, 0), this.chest(-18, 18, 0, 0);
    this.loot(-22, 0), this.loot(22, 0), this.loot(0, -22), this.loot(0, 22), this.ammo(0, 0);
    for (let e5 = 0; e5 < 8; e5++) this.prop(`crate`, t2.range(-28, 28), t2.range(-28, 28), t2.range(0, 6.28));
  }
  caves(e4) {
    this.begin(e4);
    let t2 = this.r;
    // Crystal Caves: glowing crystal formations
    this.circle(0, 0, 44, `#2a1a3a`, true, 0.95, 12);
    this.circle(0, 0, 16, `#7b2fff`, true, 0.6, 8);
    // Crystal rocks (use rock trees with purple tint via scale)
    for (let e5 = 0; e5 < 14; e5++) {
      let i = t2.range(0, 6.28), a = t2.range(18, 40);
      this.tree(`rock`, Math.cos(i) * a, Math.sin(i) * a, t2.range(1.2, 2.2));
    }
    // Cave houses
    this.turret({ x: -8, z: -8, w: 2, d: 2, floors: 3, wall: cA(`stonewall`, 2893312, `stone`), roofSkin: cA(`brick`, 2893312, `stone`), floor: fA, chests: 2 });
    this.house({ x: 8, z: -6, w: 3, d: 2, floors: 1, wall: cA(`stonewall`, 2893312, `stone`), roof: `pyr`, roofSkin: cA(`brick`, 2893312, `stone`), doors: `n`, win: 0.4, chests: 1 });
    this.prop(`campfire`, 0, 0, 0), this.prop(`tent`, -12, 5, 0.5, 1), this.prop(`tent`, 12, 5, -0.5, 1);
    this.chest(0, 0, 0, 0), this.chest(-14, -14, 0, 0), this.chest(14, 14, 0, 0);
    this.loot(-16, -10), this.loot(16, -10), this.loot(0, 16), this.ammo(0, -12);
    for (let e5 = 0; e5 < 5; e5++) this.prop(`crate`, t2.range(-20, 20), t2.range(-15, 15), t2.range(0, 6.28));
  }
  slurpy(e4) {
    this.begin(e4);
    let t2 = this.r;
    // Slurpy Swamp: murky green swamp with shacks and slurp pools
    this.circle(0, 0, 48, `#3a4a2a`, true, 0.95, 12);
    this.circle(0, 0, 18, `#6a9a3a`, true, 0.7, 8);
    this.circle(-14, 10, 10, `#8ac83a`, true, 0.6, 6);
    this.circle(14, -10, 10, `#8ac83a`, true, 0.6, 6);
    // Swamp shacks on stilts
    this.treehouse({ x: -8, z: -8, w: 3, d: 2, wall: cA(`planks`, 10134445, `wood`), roofSkin: cA(`shingle`, 5922667, `wood`), floor: dA, chests: 2 });
    this.aFrame({ x: 8, z: -6, w: 3, d: 2, wall: cA(`planks`, 10134445, `wood`), roofSkin: cA(`shingle`, 5922667, `wood`), floor: dA, chests: 1 });
    this.treehouse({ x: 0, z: 8, w: 2, d: 2, wall: cA(`planks`, 10134445, `wood`), roofSkin: cA(`shingle`, 5922667, `wood`), floor: dA, chests: 1 });
    for (let e5 = 0; e5 < 12; e5++) {
      let i = t2.range(0, 6.28), a = t2.range(20, 42);
      this.tree(t2.chance(0.5) ? `pine` : `oak`, Math.cos(i) * a, Math.sin(i) * a, t2.range(0.9, 1.5));
    }
    this.prop(`campfire`, 0, 0, 0), this.prop(`tent`, -12, 5, 0.5, 1), this.prop(`tent`, 12, 5, -0.5, 1);
    this.chest(0, 0, 0, 0), this.chest(-14, -14, 0, 0), this.chest(14, 14, 0, 0);
    this.loot(-16, -10), this.loot(16, -10), this.loot(0, 16), this.ammo(0, -12);
    for (let e5 = 0; e5 < 5; e5++) this.prop(`crate`, t2.range(-20, 20), t2.range(-15, 15), t2.range(0, 6.28));
  }
  steamy(e4) {
    this.begin(e4);
    let t2 = this.r;
    // Steamy Stacks: industrial factory with cooling towers
    this.circle(0, 0, 46, `#5a5a5a`, true, 0.9, 12);
    this.circle(0, 0, 20, `#7a7a7a`, true, 0.8, 8);
    // Factory buildings
    this.barn({ x: -6, z: -6, w: 4, d: 3, wall: cA(`metal`, 10134445, `metal`), roofSkin: cA(`metal`, 10134445, `metal`), floor: fA, doors: `s`, chests: 2 });
    this.barn({ x: 6, z: -4, w: 3, d: 3, wall: cA(`metal`, 10134445, `metal`), roofSkin: cA(`metal`, 10134445, `metal`), floor: fA, doors: `w`, chests: 1 });
    this.house({ x: 0, z: 8, w: 3, d: 2, floors: 1, wall: cA(`metal`, 10134445, `metal`), roof: `flat`, roofSkin: cA(`metal`, 10134445, `metal`), doors: `n`, win: 0.3, chests: 1 });
    // Cooling towers (use clocktower props as stacks)
    this.prop(`clocktower`, -14, -14, 0.5, 0), this.prop(`clocktower`, 14, -14, -0.5, 0);
    this.prop(`watertower`, 0, -18, 0, 0), this.prop(`silo`, -18, 10, 0, 0);
    this.prop(`lamp`, -10, -10, 0), this.prop(`lamp`, 10, -10, 0), this.prop(`lamp`, -10, 10, 0), this.prop(`lamp`, 10, 10, 0);
    this.chest(0, 0, 0, 0), this.chest(-16, -16, 0, 0), this.chest(16, 16, 0, 0);
    this.loot(-20, 0), this.loot(20, 0), this.loot(0, -20), this.loot(0, 20), this.ammo(0, 0);
    for (let e5 = 0; e5 < 8; e5++) this.prop(`crate`, t2.range(-25, 25), t2.range(-25, 25), t2.range(0, 6.28));
    for (let e5 = 0; e5 < 6; e5++) this.prop(`barrel`, t2.range(-20, 20), t2.range(-20, 20), 0);
  }
  wild() {
    let e4 = this.r, t2 = 0, n2 = 0, r = 0, i = 0;
    for (; (t2 < 20 || n2 < 34 || r < 14) && i++ < 5e3; ) {
      let i2 = e4.range(-340, 340), a = e4.range(-340, 340), o = ay(i2, a);
      if (o < 2.6 || oy(i2, a) > 0.14 || cy(i2, a, 1.25) || gy(i2, a) < 4) continue;
      let s2 = { x: i2, y: o + 0.02, z: a, rot: e4.range(0, 6.28) };
      t2 < 20 ? (this.plan.chests.push(s2), t2++) : n2 < 34 ? (this.plan.loot.push(s2), n2++) : (this.plan.ammo.push(s2), r++);
    }
    for (let t3 = 0; t3 < 400; t3++) {
      let t4 = e4.range(-200, 200), n3 = e4.range(-200, 200), r2 = ay(t4, n3);
      if (r2 > 14 && r2 < 30 && oy(t4, n3) < 0.1 && !cy(t4, n3, 1.4)) {
        this.plan.llamas.push({ x: t4, y: r2, z: n3, rot: e4.range(0, 6.28) });
        break;
      }
    }
    // Reboot vans at strategic locations
    let vans = [[0, 60], [-150, -50], [150, 50], [-50, 150], [50, -150], [-200, 150], [200, -100]];
    for (let [t3, n3] of vans) {
      let r2 = ay(t3, n3);
      if (r2 > 1 && oy(t3, n3) < 0.2) {
        this.plan.props.push({ id: `rebootvan`, variant: 0, x: t3, y: r2, z: n3, rot: e4.range(0, 6.28) });
      }
    }
    // Extra wilderness trees for lush forests
    for (let t3 = 0; t3 < 550; t3++) {
      let n3 = e4.range(-380, 380), r2 = e4.range(-380, 380), i2 = ay(n3, r2);
      if (i2 < 2 || oy(n3, r2) > 0.12 || cy(n3, r2, 2) || gy(n3, r2) < 3) continue;
      let a = r2 < -150 && n3 < 40 ? `pine` : r2 > 170 && n3 > -30 ? (e4.chance(.65) ? `palm` : `rock`) : e4.chance(0.4) ? `pine` : e4.chance(0.5) ? `oak` : `birch`;
      this.plan.trees.push({ type: a, variant: e4.int(0, 1), x: n3, y: i2 - 0.2, z: r2, scale: e4.range(0.8, 1.5), rot: e4.range(0, 6.28), tint: 16777215 });
    }
    // Landmark rock at Sanctuary
    this.plan.trees.push({ type: `rock`, variant: 0, x: 175, y: ay(175, 25), z: 25, rot: 0, scale: 3, tint: 16777215 });
    // Dynamic events: meteor shower spots
    for (let t3 = 0; t3 < 5; t3++) {
      let n3 = e4.range(-200, 200), r2 = e4.range(-200, 200);
      this.plan.trees.push({ type: `rock`, variant: 1, x: n3, y: ay(n3, r2), z: r2, rot: e4.range(0, 6.28), scale: 1.5, tint: 16777215 });
    }
    // Interior details: furniture in houses (tables, beds)
    for (let t3 = 0; t3 < 20; t3++) {
      let n3 = e4.range(-100, 100), r2 = e4.range(-100, 100), i2 = ay(n3, r2);
      if (i2 > 2 && oy(n3, r2) < 0.1) {
        this.plan.props.push({ id: `crate`, variant: 0, x: n3, y: i2, z: r2, rot: e4.range(0, 6.28) });
      }
    }
    // Underground bunkers: hidden loot caches
    for (let t3 = 0; t3 < 3; t3++) {
      let n3 = e4.range(-150, 150), r2 = e4.range(-150, 150), i2 = ay(n3, r2);
      if (i2 > 2 && oy(n3, r2) < 0.1) {
        this.plan.chests.push({ x: n3, y: i2, z: r2, rot: e4.range(0, 6.28) });
      }
    }

  }
};
// Assemble each Chapter 3 POI from a bespoke footprint, landmark and palette.
_A.prototype.bunker = function(opts) {
  const concrete=cA(`concrete`,0x81928c,`stone`), metal=cA(`metal`,0x4b615e,`metal`);
  // Two-storey fortified entry with recessed door, stairwell, parapets and vents.
  this.house({...opts, wall:concrete, roofSkin:metal, floor:fA, roof:`flat`, doors:`s`, win:.16, roofAccess:true});
  const {x,z,w,d}=opts;
  // The upper-floor security room is separated from the public stairwell.
  // Its middle wall cell is a lockable vault door during a match.
  if(w>=4 && d>=3) for(let iz=0;iz<d;iz++) this.piece(iz===1?`wallDoor`:`wall`,x+2,1,z+iz,1,concrete);
  for(let i=0;i<w;i++){this.piece(`half`,x+i,2,z,0,metal);this.piece(`half`,x+i,2,z+d,0,metal);}
  for(let i=0;i<d;i++){this.piece(`half`,x,2,z+i,1,metal);this.piece(`half`,x+w,2,z+i,1,metal);}
  this.prop(`barrel`,(x+w/2)*5,(z+d)*5+5,0);
};
_A.prototype.chapter3Site = function(site) {
  this.begin(site);
  const spec = chapter3Sites[site.kind];
  if (!spec) throw new Error(`Unknown Chapter 3 location: ${site.kind}`);
  const wall = cA(`siding`, spec.wall, `wood`), roofSkin = cA(`shingle`, spec.roof, `wood`);
  const stone = cA(`stonewall`, spec.wall, `stone`), metal = cA(`metal`, spec.roof, `metal`);
  this.circle(0, 0, site.r * .83, spec.ground, true, .90, 5);
  this.path([[-site.r*.75, 0],[site.r*.75, 0]], 6, spec.road);
  this.path([[0,-site.r*.65],[0,site.r*.65]], 5, spec.road);
  for (const [type,x,z,w,d,floors] of spec.buildings) {
    const durable = type === `turret` || type === `church` || site.kind === `tilted` || site.kind === `bugle`;
    const opts = {x,z,w,d,floors,wall:durable ? stone : wall,roofSkin:durable ? metal : roofSkin,
      floor:durable ? fA : dA, roof:durable ? `flat` : `gable`, doors:`s`, win:.55, chests:floors > 2 ? 2 : 1};
    this[type](opts);
  }
  const feature = spec.feature;
  // Site-specific props, placed in the first structure away from its entry.
  const [specialType,sx,sz,sw,sd]=spec.buildings[0];
  const unique = site.kind===`bugle` ? `officeDesk` : site.kind===`logjam` ? `workshopBench` : site.kind===`covert` ? `serverRack` : [ `workshopBench`,`officeDesk`,`serverRack` ][Math.abs(Math.round(site.x+site.z))%3];
  this.prop(unique,(sx+.55)*5,(sz+.55)*5,0,0,.04);
  if(site.kind===`bugle`) this.prop(`officeDesk`,(sx+sw-1.2)*5,(sz+.6)*5,Math.PI,0,4.04);
  if(site.kind===`covert`) {this.prop(`serverRack`,(sx+sw-.5)*5,(sz+.6)*5,0,0,4.04);this.chest((sx+sw-.5)*5,(sz+sd-.5)*5,4);}
  for (const [type,x,z,w,d] of spec.buildings) {
    if (type === `house` || type === `aFrame` || type === `bunker`) continue;
    const choices = type === `barn` ? [`interiorTable`,`interiorShelf`] : type === `treehouse` ? [`interiorBed`,`interiorShelf`] : [`interiorTable`,`interiorSofa`];
    this.prop(choices[0],(x+.5)*5,(z+.5)*5,0,0,type===`treehouse`?4.04:.04);
    this.prop(choices[1],(x+w-.5)*5,(z+d-.5)*5,0,0,type===`treehouse`?4.04:.04);
  }
  if (feature === `sanctuary` || feature === `outpost`) {
    if (feature === `sanctuary`) this.prop(`sanctuaryArch`, 0, 17, 0, 0);
    this.circle(0,0,9,`#9acfc2`,true,.9,1);
    for (let i=0;i<8;i++) { let a=i*Math.PI/4; this.prop(`lamp`,Math.cos(a)*13,Math.sin(a)*13,a); }
    this.prop(`rebootvan`, 20, 12, 0, 0);
  } else if (feature === `covert`) {
    this.rect(0,10,24,18,`#74817d`); this.prop(`container`, -18, 15, 0, 0); this.prop(`truck`, 18, 10, Math.PI/2);
    for(let i=-2;i<=2;i++) this.tree(`rock`, i*8, -35, 2);
  } else if (feature === `race`) {
    this.path([[-38,-23],[34,-23],[43,-8],[43,17],[32,28],[-34,28],[-43,14],[-43,-9],[-38,-23]], 8, `#55575c`);
    this.path([[-38,-23],[34,-23],[43,-8],[43,17],[32,28],[-34,28],[-43,14],[-43,-9],[-38,-23]], .5, `#f5d46d`, true, [3,3]);
    this.prop(`car`, -24, -23, Math.PI/2); this.prop(`truck`, 24, 28, Math.PI/2);
    for(let x=-30;x<=30;x+=10) this.prop(`barrel`,x, -18, 0);
  } else if (feature === `drivein`) {
    this.rect(0,15,44,25,`#595754`); for(let x=-18;x<=18;x+=9) {this.prop(`car`,x,14,Math.PI); this.rect(x,14,2.5,6,`#d9c59d`,true,.5);}
    // Tall freestanding screen with a broad rectangular silhouette.
    for(let x=-3;x<=3;x++) for(let y=0;y<3;y++) this.piece(`wall`,x,y,-8,0,stone);
  } else if (feature === `lumber` || feature === `mine`) {
    for(let i=0;i<7;i++) this.prop(`logpile`, -30+i*8, 22, Math.PI/2, 0);
    this.prop(`watertower`,27,20,0,0); this.prop(`truck`,-22,0,Math.PI/2);
    if(feature === `mine`) for(let i=0;i<5;i++) this.tree(`rock`, 18+i*4, -22, 1.4);
  } else if (feature === `harbor` || feature === `beach` || feature === `lake`) {
    this.rect(0,23,32,7,`#bc905d`); for(let i=-2;i<=2;i++) this.piece(`floor`,i,0,5,0,dA);
    this.prop(`bench`,0,19,0); this.prop(`barrel`,12,20,0); this.prop(`lamp`,-13,20,0);
  } else if (feature === `camp` || feature === `snow`) {
    this.circle(0,0,8,`#d1b591`,true,.8,2); if (site.kind === `cuddle`) this.prop(`cuddleMascot`, 14, 12, 0, 0); this.prop(`campfire`,0,0,0); this.prop(`tent`,-10,4,.6,1); this.prop(`tent`,9,7,-.5,2);
    for(let i=0;i<8;i++){let a=i*Math.PI/4;this.tree(`pine`,Math.cos(a)*42,Math.sin(a)*42,1.1);}
  } else if (feature === `city` || feature === `news`) {
    this.rect(0,0,18,18,`#b8b3a9`); this.prop(`clocktower`,0,0,0,0); if (feature === `news`) this.prop(`bugleSign`, 0, 18, 0, 0);
    for(let x of [-14,14]) for(let z of [-14,14]) this.prop(`lamp`,x,z,0);
    this.prop(`car`,-20,0,Math.PI/2); this.prop(`dumpster`,20,15,0);
  } else if (feature === `ranch` || feature === `restaurant`) {
    this.fence(-33,20,33,20); if (feature === `ranch`) this.prop(`desertWindmill`, 24, -18, 0, 0); this.prop(`tractor`,23,16,0); this.prop(`picnic`,-10,10,0);
    this.prop(`barrel`,12,12,0); this.prop(`barrel`,14,12,0);
  } else {
    this.circle(0,0,8,`#bcb2a1`,true,.8,1); this.prop(`bench`,-6,0,0); this.prop(`lamp`,7,0,0);
    this.prop(`car`,18,10,Math.PI/2);
  }
  for (let i=0;i<4;i++){let a=i*Math.PI/2+.4; this.tree(site.kind === `frosty` || site.kind === `logjam` ? `pine` : `oak`, Math.cos(a)*site.r*.72,Math.sin(a)*site.r*.72, .9);}
  this.loot(0,5); this.loot(18,-8); this.ammo(-12,10); this.chest(0,-12,0,0);
};
for (const kind of Object.keys(chapter3Sites)) _A.prototype[kind] = _A.prototype.chapter3Site;
_A.prototype.mall=function(site){this.begin(site);const wall=cA(`concrete`,0xb8c6b6,`stone`),roof=cA(`metal`,0x637d70,`metal`);this.circle(0,0,32,`#829b7c`,true,.9,4);this.rect(8,13,26,16,`#62696a`);this.house({x:-4,z:-3,w:5,d:4,floors:2,wall,roofSkin:roof,floor:mA,roof:`flat`,doors:`s`,win:.7,roofAccess:true,chests:4});for(let j=0;j<3;j++)this.prop(`interiorShelf`,(-3+j*2)*5+2.5,-7.5,0,0,.04);for(let i=0;i<5;i++)this.tree(`bush`,-19+i*9,15,.9);for(let i=0;i<4;i++)this.prop(`barrel`,12+i*3,15,0);this.piece(`stairs`,2,0,3,2,cA(`concrete`,0x929b8b,`stone`));this.chest(8,5,8);};
_A.prototype.ironworks=function(site){this.begin(site);const wall=cA(`metal`,0x7d9296,`metal`),roof=cA(`metal`,0x505b5d,`metal`);this.circle(0,0,34,`#817b69`,true,.95,3);this.rect(0,15,50,20,`#565a58`);this.house({x:-4,z:-2,w:5,d:3,floors:1,wall,roofSkin:roof,floor:fA,roof:`flat`,doors:`n`,open:`s`,win:.2,roofAccess:true,chests:3});this.house({x:2,z:-4,w:2,d:2,floors:1,wall,roofSkin:roof,floor:fA,roof:`flat`,doors:`n`,open:`s`,win:.2,roofAccess:true,chests:1});this.prop(`workshopBench`,-13,-5,0,0,.04);this.prop(`container`,15,-18,0);this.prop(`truck`,-24,-15,0);this.loot(0,14);this.ammo(7,15);};
_A.prototype.observatory=function(site){this.begin(site);const wall=cA(`concrete`,0xc5d1cd,`stone`),roof=cA(`metal`,0x829da7,`metal`);this.circle(0,0,33,`#aab8b7`,true,.9,3);const start=this.plan.pieces.length;this.house({x:-3,z:-2,w:4,d:3,floors:2,wall,roofSkin:roof,floor:fA,roof:`flat`,doors:`s`,win:.35,roofAccess:true,chests:3});
  // Open a stairwell in the main floor and furnish the dug-out lab below it.
  this.plan.pieces=this.plan.pieces.filter((p,i)=>!(i>=start&&p.shape===`floor`&&p.gx===this.cx-2&&p.gz===this.cz-2&&p.gy===this.gy));
  for(let x=-3;x<1;x++)for(let z=-2;z<1;z++)this.piece(`floor`,x,-1,z,0,fA);
  for(let x=-3;x<1;x++){this.piece(`wall`,x,-1,-2,0,wall);this.piece(`wall`,x,-1,1,0,wall);}for(let z=-2;z<1;z++){this.piece(`wall`,-3,-1,z,1,wall);this.piece(`wall`,1,-1,z,1,wall);}this.piece(`stairs`,-2,-1,-2,0,cA(`metal`,0x879aa2,`metal`));
  this.prop(`serverRack`,-12,-5,0,0,-3.96);this.house({x:2,z:0,w:2,d:2,floors:1,wall,roofSkin:roof,floor:fA,roof:`flat`,doors:`s`,win:.2,roofAccess:true,chests:1});this.prop(`serverRack`,-12,-7,0,0,.04);this.prop(`officeDesk`,-7,-6,0,0,4.04);this.chest(-7,1,0);for(let i=0;i<4;i++)this.tree(`rock`,22*Math.cos(i*Math.PI/2),22*Math.sin(i*Math.PI/2),1.2);};

// Purpose-built Chapter 4 districts, based on distinct accessible buildings and landmarks.
_A.prototype.chapter4District=function(site){
 this.begin(site);
 const snow=[`bastion4`,`labs4`].includes(site.kind), medieval=[`citadel4`,`anvil4`,`bay4`].includes(site.kind);
 const stone=cA(`stonewall`,snow?0xabb9bf:0xc7bb9f,`stone`), timber=cA(`siding`,0xdacdb3,`wood`), woodroof=cA(`shingle`,0x6d4940,`wood`), metal=cA(`metal`,0x667b81,`metal`), brick=cA(`siding`,0xc65837,`wood`), grey=cA(`concrete`,0xa4a9a7,`stone`), farmwall=cA(`siding`,0xe2c05c,`wood`);
 this.circle(0,0,site.r*.92,snow?`#dbe7e9`:medieval?`#b7a67e`:`#a8aa95`,true,.94,4);
 const house=(x,z,w,d,floors,wall=timber,roof=woodroof,extra={})=>this.house({x,z,w,d,floors,wall,roofSkin:roof,floor:fA,roof:`gable`,doors:`s`,win:.42,chests:floors>1?2:1,...extra});
 const tower=(x,z,floors,wall=stone)=>this.turret({x,z,w:2,d:2,floors,wall,roofSkin:metal,floor:fA,doors:`s`,win:.15,chests:1});
 const street=(pts,width=5,color=`#777b78`)=>this.path(pts,width,color,true);
 const trim=(x,z,y=0)=>this.prop(`timberTrim`,x,z,0,0,y+.04);
 const lamp=(x,z)=>this.prop(`plazalamp`,x,z,0,0);
 if(site.kind===`citadel4`){
   // Gate bridge, two sentinel statues, fortified keep and flanking towers.
   house(-3,-3,5,4,3,stone,metal,{roof:`flat`,roofAccess:true,win:.16});tower(-6,-4,4);tower(3,-3,4);
   for(let x=-3;x<2;x++){this.piece(`parapet`,x,3,-3,0,stone);this.piece(`parapet`,x,3,1,0,stone);}
   for(let z=2;z<7;z++){for(let x=-1;x<1;x++)this.piece(`floor`,x,0,z,0,stone);this.piece(`parapet`,-1,0,z,1,stone);this.piece(`parapet`,1,0,z,1,stone);}
   this.prop(`castleKnight`,-9,29,0,0);this.prop(`castleKnight`,9,29,0,0);street([[0,35],[0,5]],10,`#a8a198`);this.prop(`barrel`,-24,14,0);this.prop(`crate`,22,15,0);
 }else if(site.kind===`bay4`){
   // Medieval port: timber buildings, quays and a timber pier with boats.
   house(-6,-4,3,2,2);house(1,-4,3,2,2);house(-2,0,3,2,2);trim(-22.5,-9.9);trim(12.5,-9.9);tower(4,1,3);
   street([[-32,4],[28,4]],6,`#ae9d7b`);for(let x=-4;x<4;x++)for(let z=4;z<6;z++)this.piece(`floor`,x,0,z,0,dA);
   for(let x=-4;x<4;x++)this.piece(`parapet`,x,0,6,0,dA);
   this.prop(`boat`,-14,35,Math.PI/2);this.prop(`boat`,10,35,Math.PI/2);this.prop(`barrel`,-15,24);this.prop(`crate`,13,24);this.prop(`logpile`,0,22);
 }else if(site.kind===`anvil4`){
   // Close-knit half-timbered village surrounding a square and tall clock tower.
   house(-7,-5,3,2,2);house(-3,-5,3,2,2);house(1,-5,3,2,2);house(-7,1,3,2,2);house(3,1,3,2,2);
   trim(-27.5,-14.9);trim(-7.5,-14.9);trim(12.5,-14.9);trim(-27.5,15.1);trim(22.5,15.1);tower(-1,1,4);
   this.rect(0,0,42,9,`#b7a992`);this.prop(`fountain`,15,0);lamp(-17,0);lamp(23,0);this.prop(`bench`,-12,4);this.prop(`crate`,17,17);
 }else if(site.kind===`bastion4`){
   // Snow fortress: stone keep, defensive parapets and watch towers.
   house(-4,-4,5,4,2,stone,metal,{roof:`flat`,roofAccess:true,win:.15});tower(-7,-3,3);tower(3,-3,3);tower(-6,2,2);tower(3,2,2);
   for(let x=-4;x<1;x++){this.piece(`parapet`,x,2,-4,0,stone);this.piece(`parapet`,x,2,0,0,stone);}street([[0,25],[0,0]],8,`#b2c6cd`);
   this.prop(`serverRack`,-5,-12,0,0,.04);this.prop(`crate`,20,22);this.prop(`barrel`,-23,18);lamp(4,25);
 }else if(site.kind===`labs4`){
   // Orange polar research huts with segmented arched dark roofs and equipment.
   house(-6,-4,3,3,1,brick,metal,{roof:`flat`,roofAccess:false,win:.2});house(-2,-4,3,3,1,brick,metal,{roof:`flat`,roofAccess:false,win:.2});house(2,-4,3,3,1,brick,metal,{roof:`flat`,roofAccess:false,win:.2});
   for(const x of [-22.5,-2.5,17.5])this.prop(`labRoof`,x,-12.5,0,0,4.04);
   this.prop(`serverRack`,-23,-13,0,0,.04);this.prop(`serverRack`,-4,-13,0,0,.04);this.prop(`container`,22,15);this.prop(`container`,-20,19);this.prop(`truck`,7,19,Math.PI/2);lamp(0,12);
 }else if(site.kind===`shores4`){
   // Slap factory, twin smokestacks, street bridge and a residential bank.
   house(-6,-4,4,3,2,grey,metal,{roof:`flat`,roofAccess:true});house(-1,-4,3,3,1,brick,metal,{roof:`flat`});house(4,-4,2,2,2,timber,woodroof);house(3,2,3,2,2,timber,woodroof);
   this.prop(`factoryStack`,-26,4);this.prop(`factoryStack`,-21,4);street([[-32,12],[32,12]],8,`#6d7474`);for(let x=-1;x<3;x++)this.piece(`floor`,x,0,3,0,metal);
   this.prop(`truck`,-22,17,Math.PI/2);this.prop(`container`,-7,24,Math.PI/2);this.prop(`car`,22,11);this.prop(`rebootvan`,5,23);lamp(15,15);
 }else if(site.kind===`quarry4`){
   // Pale cut-stone benches and an excavated blue pool, with miners' huts.
   house(-6,-5,3,2,1,timber,woodroof);house(3,-5,3,2,1,timber,woodroof);this.circle(0,5,12,`#438794`,true,.95,2);this.circle(0,5,7,`#28697b`,true,.95,1);
   for(const [x,z] of [[-26,10],[-21,18],[-16,24],[19,8],[24,14],[29,20],[-7,-2],[11,-3]])this.prop(`quarryBlock`,x,z,0,Math.abs(x+z)%3);
   street([[-30,28],[-15,12],[0,20],[20,24]],2,`#8b765b`);this.prop(`truck`,27,-3);this.prop(`crate`,15,22);this.prop(`barrel`,-17,3);
 }else if(site.kind===`splits4`){
   // Flat-roofed commercial centre and smaller storefronts, road and parking.
   house(-5,-3,5,4,2,grey,metal,{roof:`flat`,roofAccess:true});house(2,-4,3,2,2,grey,metal,{roof:`flat`});house(-7,2,2,2,2,grey,metal,{roof:`flat`});house(2,2,3,2,1,brick,metal,{roof:`flat`});
   street([[-35,9],[35,9]],8);street([[27,-32],[27,33]],7);this.prop(`roofsign`,-12,-17,0,0,8.04);this.prop(`acunit`,-12,-5,0,0,8.04);this.prop(`car`,20,10,Math.PI/2);this.prop(`car`,-8,20,Math.PI/2);this.prop(`busstop`,27,20);this.prop(`trafficlight`,19,5);lamp(-28,10);
 }else if(site.kind===`farm4`){
   // Yellow farmhouse, white barn, silos, fenced crop rows and hay.
   this.barn({x:-5,z:-4,w:4,d:2,floors:1,wall:timber,roofSkin:metal,floor:dA,doors:`s`,win:.3,chests:2});house(2,-4,3,2,2,farmwall,woodroof);house(-5,1,2,2,1,timber,woodroof);
   this.prop(`silo`,-28,12);this.prop(`silo`,-22,12);this.prop(`tractor`,8,14);this.prop(`haybale`,16,20);this.prop(`haybale`,21,20);this.prop(`haybale`,26,20);this.fence(-3,25,29,25);
   for(let z=15;z<=23;z+=3)this.rect(8,z,20,1.4,`#9b7e43`,true,1);street([[-35,3],[35,3]],5,`#b89d6e`);
 }
 for(let k=0;k<7;k++){let a=k*Math.PI*2/7+.3;this.tree(snow?`pine`:medieval?`autumn`:`oak`,Math.cos(a)*site.r*.83,Math.sin(a)*site.r*.83,.9);}
 this.loot(0,10);this.ammo(14,8);this.chest(-8,10);
};
for(const kind of [`bay4`,`citadel4`,`anvil4`,`bastion4`,`labs4`,`shores4`,`quarry4`,`splits4`,`farm4`])_A.prototype[kind]=_A.prototype.chapter4District;
// Build event-only instance buffers from the same detailed meshes and materials
// as battle royale. No gameplay colliders or original buffers are modified.
function makeEventScenery(game){
  const locations=[[`logjam`,-220,-235],[`shifty`,-100,-235],[`covert`,-270,-80],[`sanctuary`,175,40],[`bugle`,215,-125],[`sleepy`,270,-225],[`joneses`,230,165],[`coney`,20,-70],[`tilted`,-105,20],[`greasy`,-235,100],[`cuddle`,-270,-15],[`canyon`,145,215],[`butter`,-60,240],[`speedway`,20,180],[`reels`,-35,105],[`seaside`,-215,245],[`crystallake`,90,-220],[`seven`,55,-285]];
  const builder=new _A();for(const [kind,x,z] of locations)builder.chapter3Site({kind,id:kind,x,z,r:40,y:Math.round(ay(x,z)/4)*4});
  const buildGroup=(plan)=>{
    const group=new Pn(), pieces=new Map(), props=new Map();
    for(const spec of plan.pieces){const key=`${spec.shape}|${spec.tex}|${spec.mask??0}`;if(!pieces.has(key))pieces.set(key,[]);pieces.get(key).push(spec);}
    for(const entries of pieces.values()){
      const first=entries[0],mesh=new ia(wx(first.shape,first.mask??0),Ex(first.tex),entries.length);mesh.frustumCulled=false;mesh.userData.eventShared=true;
      entries.forEach((spec,index)=>{const piece=new Px(spec,true);Fx.layout(piece);mesh.setMatrixAt(index,piece.base);mesh.setColorAt(index,new B(spec.tint));});mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;group.add(mesh);
    }
    for(const spec of plan.props){const def=fO[spec.id];if(!def)continue;const variant=((spec.variant??0)%def.variants+def.variants)%def.variants,key=`${spec.id}|${variant}`;if(!props.has(key))props.set(key,[]);props.get(key).push({...spec,variant});}
    for(const entries of props.values()){
      const first=entries[0],mesh=new ia(LO(first.id,first.variant),_m.std,entries.length);mesh.frustumCulled=false;mesh.userData.eventShared=true;
      entries.forEach((spec,index)=>{const matrix=new z().compose(new R(spec.x,spec.y,spec.z),new It().setFromAxisAngle(new R(0,1,0),spec.rot||0),new R(1,spec.scaleY??1,1));mesh.setMatrixAt(index,matrix);});mesh.instanceMatrix.needsUpdate=true;group.add(mesh);
    }
    const trees=oA.group.clone(true),copies=new Map();
    oA.group.children.forEach((original,index)=>copies.set(original,trees.children[index]));
    for(const item of oA.items){const copy=copies.get(item.mesh);if(copy){copy.setMatrixAt(item.index,item.base);copy.instanceMatrix.needsUpdate=true;}}
    trees.traverse(node=>{if(node.isMesh)node.userData.eventShared=true;});group.add(trees);return group;
  };
  return {old:buildGroup(builder.plan),current:buildGroup(game.plan)};
}
function vA() {
  let e4 = new _A();
  for (let t3 of qv) e4[t3.kind](t3);
  e4.wild();
  let t2 = { ...KO(e4.plan.pieces, e4.plan.props), pilings: qO(e4.plan.pieces, e4.plan.props) };
  return e4.plan.trees = XO(e4.plan.trees), typeof window < `u` && (window.__settle = t2), e4.plan;
}
var yA = new It(), bA = new R(0, 1, 0), xA = new R(), SA = new R(1, 1, 1), CA = new z(), wA = class {
  spec;
  hp;
  maxHp;
  mat;
  alive = true;
  label;
  yieldTotal;
  cx;
  cy;
  cz;
  index = -1;
  matrix = new z();
  base = new z();
  color = new B(1, 1, 1);
  collider = null;
  pool;
  shake = 0;
  constructor(e4) {
    this.spec = e4;
    let t2 = fO[e4.id];
    this.hp = this.maxHp = t2.hp, this.mat = t2.mat, this.yieldTotal = t2.yield, this.label = e4.id.charAt(0).toUpperCase() + e4.id.slice(1), this.cx = e4.x, this.cz = e4.z, this.cy = e4.y + t2.size[1] * 0.5;
  }
  damage(e4, t2, n2) {
    return TA.damage(this, e4, t2, n2);
  }
}, TA = new class {
  group = new Pn();
  pools = /* @__PURE__ */ new Map();
  specs = [];
  items = [];
  shaking = /* @__PURE__ */ new Set();
  events = {};
  setSpecs(e4) {
    this.specs = e4;
  }
  reset() {
    for (let e4 of this.items) e4.collider && e4.alive && Ey(e4.collider), e4.alive = false;
    this.items.length = 0, this.shaking.clear();
    for (let e4 of this.pools.values()) e4.clear();
    for (let e4 of this.specs) this.add(e4);
  }
  add(e4) {
    let t2 = fO[e4.id], n2 = (e4.variant % t2.variants + t2.variants) % t2.variants, r = `${e4.id}|${n2}`, i = this.pools.get(r);
    i || (i = new cx(LO(e4.id, n2), _m.std, this.group, 8), this.pools.set(r, i));
    let a = new wA(e4);
    if (yA.setFromAxisAngle(bA, e4.rot), a.base.compose(xA.set(e4.x, e4.y, e4.z), yA, e4.scaleY == null ? SA : new R(1, e4.scaleY, 1)), a.matrix.copy(a.base), a.pool = i, i.add(a), t2.solid) {
      let n3 = Math.abs(Math.cos(e4.rot)), r2 = Math.abs(Math.sin(e4.rot)), i2 = (t2.size[0] * n3 + t2.size[2] * r2) / 2, o = (t2.size[0] * r2 + t2.size[2] * n3) / 2;
      a.collider = Ty(xy(e4.x - i2, e4.y, e4.z - o, e4.x + i2, e4.y + t2.size[1] * (e4.scaleY ?? 1), e4.z + o, a));
    }
    return this.items.push(a), a;
  }
  damage(e4, t2, n2, r) {
    return e4.alive ? (e4.hp -= t2, e4.shake = 0.2, this.shaking.add(e4), this.events.onDamaged?.(e4, t2, n2, r), e4.hp <= 0 && (e4.alive = false, this.shaking.delete(e4), e4.collider && Ey(e4.collider), e4.pool.remove(e4), this.events.onDestroyed?.(e4, n2), true)) : false;
  }
  update(e4) {
    for (let t2 of this.shaking) {
      if (t2.shake -= e4, t2.shake <= 0) t2.matrix.copy(t2.base), this.shaking.delete(t2);
      else {
        let e5 = Math.sin(t2.shake * 70) * t2.shake * 0.35;
        CA.makeTranslation(e5, 0, e5 * 0.5), t2.matrix.copy(t2.base).premultiply(CA);
      }
      t2.pool.write(t2);
    }
  }
}(), EA = [{ wait: 85, shrink: 50, radius: 265, dps: 1 }, { wait: 60, shrink: 45, radius: 165, dps: 1 }, { wait: 50, shrink: 40, radius: 100, dps: 2 }, { wait: 40, shrink: 35, radius: 58, dps: 5 }, { wait: 30, shrink: 30, radius: 28, dps: 8 }, { wait: 22, shrink: 36, radius: 0, dps: 10 }], DA = `
varying vec3 vW;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`, OA = `
uniform sampler2D uNoise;
uniform float uTime;
uniform vec3 uCam;
uniform vec2 uCenter;
varying vec3 vW;
varying vec2 vUv;
// seamless noise on the cylinder: project along x and z and blend by the wall normal
vec4 wallNoise(vec2 scale, vec2 scroll, vec2 w) {
  return texture2D(uNoise, vec2(vW.z * scale.x, vW.y * scale.y) + scroll) * w.x
       + texture2D(uNoise, vec2(vW.x * scale.x, vW.y * scale.y) + scroll) * w.y;
}
float h11(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
void main() {
  vec2 rel = vW.xz - uCenter;
  vec2 nrm = normalize(rel);
  vec2 w = nrm * nrm;
  float y = vW.y;
  float ang = atan(rel.y, rel.x);                         // -pi..pi around the circle
  // slow rolling curtains of cloud, distorted so they churn
  float n1 = wallNoise(vec2(0.0042, 0.0026), vec2(uTime * 0.006, -uTime * 0.011), w).r;
  float n2 = wallNoise(vec2(0.0115, 0.0064), vec2(-uTime * 0.009, -uTime * 0.024), w).g;
  float n = n1 * 0.62 + n2 * 0.38;
  // swirling diagonal bands spiralling up the wall (integer angular frequency keeps them seamless)
  float sw = sin(ang * 18.0 + y * 0.045 - uTime * 0.55 + n * 7.0);
  float sw2 = sin(ang * 7.0 - y * 0.028 + uTime * 0.32 + n2 * 5.0);
  float bands = smoothstep(0.35, 0.95, sw) * 0.65 + smoothstep(0.55, 1.0, sw2) * 0.45;
  vec3 deep = vec3(0.10, 0.025, 0.30), mid = vec3(0.34, 0.09, 0.78), hot = vec3(0.86, 0.48, 1.0);
  vec3 col = mix(deep, mid, smoothstep(0.22, 0.62, n + bands * 0.26));
  col = mix(col, hot, clamp(smoothstep(0.62, 0.86, n) * 0.45 + smoothstep(0.5, 1.0, bands) * 0.5, 0.0, 1.0));
  // rain streaks sliding down the wall
  float streak = wallNoise(vec2(0.11, 0.0045), vec2(0.0, uTime * 0.33), w).b;
  col += vec3(0.55, 0.4, 0.95) * smoothstep(0.66, 0.92, streak) * 0.18;
  // glowing, pulsing hem where the wall meets the ground
  float hem = exp(-max(y, 0.0) * 0.05);
  col += vec3(0.85, 0.5, 1.0) * hem * (0.55 + 0.15 * sin(uTime * 2.0 + ang * 9.0));
  // lightning: each of 28 sectors fires a jagged bolt now and then, with a sheet flash around it
  float sec = (ang + 3.14159265) / 6.2831853 * 28.0;
  float sid = floor(sec), sf = fract(sec);
  float ft = uTime * 0.55 + h11(sid) * 17.0;
  float fire = step(0.9, h11(floor(ft) + sid * 3.7));
  float env = fire * pow(1.0 - fract(ft), 4.0) * (0.6 + 0.4 * step(0.5, fract(fract(ft) * 9.0)));
  float bx = 0.5 + (texture2D(uNoise, vec2(sid * 0.137, y * 0.006 + floor(ft) * 0.31)).r - 0.5) * 0.7
                 + (texture2D(uNoise, vec2(sid * 0.71, y * 0.03 + floor(ft) * 0.17)).g - 0.5) * 0.12;
  float bolt = 1.0 - smoothstep(0.0, 0.012, abs(sf - bx));
  float glow = 1.0 - smoothstep(0.0, 0.12, abs(sf - bx));
  float bandY = smoothstep(260.0, 120.0, y) * smoothstep(-5.0, 20.0, y);
  col += vec3(0.95, 0.88, 1.0) * (bolt * 3.0 + glow * 0.35) * env * bandY;
  col += vec3(0.6, 0.5, 1.0) * env * 0.35 * smoothstep(0.35, 0.7, n);
  float dist = length(vW.xz - uCam.xz);
  float alpha = (0.6 + 0.25 * n + bands * 0.12 + hem * 0.22) * smoothstep(240.0, 40.0, y);
  alpha = max(alpha, bolt * env * bandY);
  alpha *= mix(0.5, 1.0, smoothstep(2.0, 45.0, dist));   // thin out right at the camera
  alpha *= mix(1.0, 0.25, smoothstep(140.0, 480.0, dist)); // far walls melt into the haze
  gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.92));
}`, kA = class {
  mesh;
  x = 0;
  z = 0;
  r = 520;
  fx = 0;
  fz = 0;
  fr = 520;
  tx = 0;
  tz = 0;
  tr = 520;
  phase = 0;
  state = `wait`;
  timer = 0;
  uCenter = { value: new L() };
  onPhase;
  constructor() {
    let e4 = new Ba(1, 1, 420, 96, 1, true);
    e4.translate(0, 190, 0), this.mesh = new Mi(e4, new Es({ vertexShader: DA, fragmentShader: OA, transparent: true, depthWrite: false, side: 2, fog: false, uniforms: { uNoise: Z.uNoise, uTime: Z.uTime, uCam: Z.uCam, uCenter: this.uCenter } })), this.mesh.renderOrder = 12, this.mesh.frustumCulled = false, this.reset();
  }
  pickNext() {
    let e4 = EA[this.phase];
    this.tr = e4.radius;
    let t2 = Math.max(0, this.r - e4.radius) * 0.85;
    for (let e5 = 0; e5 < 40; e5++) {
      let seed=window.__game?.onlineActive?window.__game.onlineRoomSeed:null;
      let rnd=seed==null?Math.random():((Math.sin((seed+1)*12345+this.phase*401+e5*97)*43758.5453)%1+1)%1;
      let angleRnd=seed==null?Math.random():((Math.sin((seed+1)*54321+this.phase*709+e5*71)*24634.6345)%1+1)%1;
      let e6 = angleRnd*Math.PI*2, n2 = Math.sqrt(rnd) * t2;
      if (this.tx = this.x + Math.cos(e6) * n2, this.tz = this.z + Math.sin(e6) * n2, ay(this.tx, this.tz) > 3 && Math.hypot(this.tx, this.tz) < 250) break;
    }
  }
  reset() {
    this.phase = 0, this.state = `wait`, this.x = window.__game?.onlineActive?(window.__game.onlineRoomSeed*83%1)*80-40:K(-40,40), this.z = window.__game?.onlineActive?(window.__game.onlineRoomSeed*151%1)*80-40:K(-40,40), this.r = 520, this.pickNext(), this.timer = EA[0].wait, this.sync();
  }
  get dps() {
    return EA[Math.min(this.phase, EA.length - 1)].dps;
  }
  isOutside(e4, t2) {
    if (this.state === `done`) return true;
    let n2 = e4 - this.x, r = t2 - this.z;
    return n2 * n2 + r * r > this.r * this.r;
  }
  margin(e4, t2) {
    return this.r - Math.hypot(e4 - this.x, t2 - this.z);
  }
  skip() {
    this.timer = 0.01;
  }
  update(e4) {
    if (this.state !== `done`) {
      if (this.timer -= e4, this.state === `wait`) this.timer <= 0 && (this.state = `shrink`, this.fx = this.x, this.fz = this.z, this.fr = this.r, this.timer = EA[this.phase].shrink, this.onPhase?.(`shrink`, this.phase));
      else {
        let e5 = EA[this.phase], t2 = 1 - Math.max(0, this.timer) / e5.shrink;
        this.x = Tp(this.fx, this.tx, t2), this.z = Tp(this.fz, this.tz, t2), this.r = Tp(this.fr, this.tr, t2), this.timer <= 0 && (this.phase++, this.phase >= EA.length ? (this.state = `done`, this.r = 0.01) : (this.state = `wait`, this.timer = EA[this.phase].wait, this.pickNext(), this.onPhase?.(`wait`, this.phase)));
      }
      this.sync();
    }
  }
  get formed() {
    return this.phase > 0 || this.state !== `wait`;
  }
  sync() {
    this.mesh.visible = this.formed, this.mesh.position.set(this.x, -20, this.z), this.mesh.scale.set(this.r, 1, this.r), this.uCenter.value.set(this.x, this.z);
  }
}, AA = `
varying vec3 vW;
#include <fog_pars_vertex>
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  vec4 mvPosition = viewMatrix * w;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`, jA = `
uniform sampler2D uHM;
uniform sampler2D uNoise;
uniform float uTime;
uniform float uDay;
uniform float uStorm;
uniform vec3 uSunDir;
uniform vec3 uSunCol;
uniform vec3 uCam;
uniform vec3 uHorizon;
uniform vec3 uZenith;
varying vec3 vW;
#include <fog_pars_fragment>
void main() {
  vec2 uv = vW.xz / ${800 .toFixed(1)} + 0.5;
  float inMap = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  float h = mix(-8.0, texture2D(uHM, uv).r, inMap);
  float depth = max(-h, 0.0);

  // scrolling noise layers -> ripple normal
  vec2 p = vW.xz;
  vec2 n1 = texture2D(uNoise, p * 0.021 + vec2(uTime * 0.012, uTime * 0.008)).rg;
  vec2 n2 = texture2D(uNoise, p * 0.057 - vec2(uTime * 0.016, -uTime * 0.011)).gr;
  vec2 n3 = texture2D(uNoise, p * 0.19 + vec2(-uTime * 0.03, uTime * 0.022)).rg;
  vec3 v = normalize(uCam - vW);
  float dist = length(uCam - vW);
  float nearK = smoothstep(900.0, 160.0, dist);            // calm the pattern toward the horizon so it never reads as tiles
  vec2 rip = ((n1 - 0.5) * 0.55 + (n2 - 0.5) * 0.35 + (n3 - 0.5) * 0.2) * (0.3 + 0.7 * nearK);

  // swells: near shore they roll in along the depth gradient (toward the beach), out at sea a long open-ocean swell
  float hE = texture2D(uHM, uv + vec2(3.0 / ${800 .toFixed(1)}, 0.0)).r, hN = texture2D(uHM, uv + vec2(0.0, 3.0 / ${800 .toFixed(1)})).r;
  vec2 sg = vec2(hE - h, hN - h) * inMap;
  vec2 shoreDir = dot(sg, sg) > 1e-5 ? normalize(sg) : vec2(0.0, 1.0);
  float warpW = (n1.y - 0.5) * 5.0;
  float shoreK = smoothstep(0.25, 1.2, depth) * (1.0 - smoothstep(3.5, 12.0, depth)) * inMap;
  float phS = depth * 1.15 + uTime * 1.25 + warpW;              // crests travel toward shallower water
  float phO = dot(p, vec2(0.62, 0.78)) * 0.085 - uTime * 0.7 + warpW * 1.6 + n1.x * 3.0;
  vec2 swell = -shoreDir * cos(phS) * 0.16 * shoreK + vec2(0.62, 0.78) * cos(phO) * 0.09 * (1.0 - shoreK) * nearK;
  vec3 n = normalize(vec3(rip.x + swell.x, 1.0, rip.y + swell.y));

  // depth colour: soft bands, turquoise shallows (seabed showing through), lagoon blue, deep ocean blue
  vec3 shallow = vec3(0.17, 0.74, 0.70);
  vec3 mid = vec3(0.025, 0.46, 0.74);
  vec3 deep = vec3(0.010, 0.15, 0.46);
  float t = 1.0 - exp(-depth * 0.42);
  float tb = t + (n2.x - 0.5) * 0.08;
  vec3 col = mix(shallow, mid, smoothstep(0.08, 0.5, tb));
  col = mix(col, deep, smoothstep(0.55, 0.95, tb));
  col *= mix(1.0, 0.86 + 0.14 * (n1.x + n2.y), 0.2 + 0.6 * nearK);
  // darker reef / weed patches on the shallow shelf
  float reef = smoothstep(0.56, 0.68, texture2D(uNoise, p * 0.017 + 0.37).g * 0.7 + n2.y * 0.3);
  col = mix(col, col * vec3(0.62, 0.78, 0.86), reef * smoothstep(0.6, 1.6, depth) * (1.0 - smoothstep(3.0, 7.0, depth)) * 0.55);
  // swell crests catch the light: soft lighter bands rolling in
  float crestS = smoothstep(0.55, 0.95, sin(phS)) * shoreK;
  float crestO = smoothstep(0.7, 0.98, sin(phO)) * (1.0 - shoreK) * nearK;
  col = mix(col, col * 1.2 + vec3(0.03, 0.07, 0.07), crestS * 0.5 + crestO * 0.22);

  // caustics: bright wobbling lines in the shallows (where the seabed shows through)
  vec2 cp = p * 0.33;
  float c1 = texture2D(uNoise, cp + vec2(uTime * 0.035, uTime * 0.02)).b;
  float c2 = texture2D(uNoise, cp * 1.31 - vec2(uTime * 0.03, -uTime * 0.025)).b;
  float caus = pow(1.0 - clamp(abs(c1 - c2) * 3.2, 0.0, 1.0), 5.0);
  col += vec3(0.75, 1.0, 0.95) * caus * 0.22 * (1.0 - smoothstep(0.4, 3.5, depth)) * smoothstep(120.0, 15.0, dist) * uDay;

  // sky fresnel
  // A view-dependent approximation of reflected sky (not a scene reflection).
  vec3 sky = mix(uHorizon, uZenith, clamp(0.16 + 0.5 * abs(v.y) + rip.y * 0.08, 0.08, 0.68));
  float fres = pow(1.0 - max(dot(n, v), 0.0), 4.0);
  col = mix(col, sky, clamp(fres, 0.0, 1.0) * mix(0.72, 0.55, nearK));

  // sun glitter: a broad sheen plus a tight hot core
  vec3 r = reflect(-uSunDir, n);
  float rv = max(dot(r, v), 0.0);
  col += uSunCol * (pow(rv, 220.0) * 5.5 + pow(rv, 24.0) * 0.12) * uDay;
  // twinkling sparkles on wave crests (strongest toward the sun)
  float sp = texture2D(uNoise, p * 0.47 + vec2(uTime * 0.05, -uTime * 0.04)).b * 0.55 + n3.x * 0.45;
  float tw = 0.5 + 0.5 * sin(uTime * 9.0 + n2.x * 40.0);
  float fleck = smoothstep(0.76, 0.8, sp) * tw * smoothstep(260.0, 15.0, dist);
  col += vec3(1.0, 0.98, 0.9) * fleck * (0.45 + 1.6 * pow(rv, 6.0)) * uDay;
  // toon whitecaps: sparse little white dashes riding the open-water swell crests
  float wc = texture2D(uNoise, p * vec2(0.09, 0.13) + vec2(uTime * 0.012, uTime * 0.02)).b;
  float cap = smoothstep(0.83, 0.87, wc * 0.75 + n3.y * 0.25) * smoothstep(0.35, 0.95, sin(phO)) * smoothstep(2.5, 6.0, depth) * smoothstep(320.0, 40.0, dist);
  col = mix(col, vec3(0.93, 0.98, 1.0), cap * 0.8);

  // shore foam: crisp toon lip at the waterline + surf bands rolling in + foam patches in the shallows
  float wob = (n2.x - 0.5) * 0.6 + (n3.y - 0.5) * 0.3;
  float lipW = 0.42 + wob * 0.35 + 0.14 * sin(uTime * 1.1 + p.x * 0.05 + p.y * 0.04);   // the wash surges up and back
  float lip = 1.0 - smoothstep(lipW - 0.06, lipW + 0.04, depth);
  float wave = sin(depth * 4.6 + uTime * 1.4 + wob * 8.0);   // surf bands roll in toward the beach
  float band = smoothstep(0.78, 0.86, wave * 0.5 + 0.5) * (1.0 - smoothstep(0.35, 2.4, depth)) * smoothstep(0.35, 0.6, n3.x + 0.15);
  float patchN = texture2D(uNoise, p * 0.11 + vec2(uTime * 0.01, 0.0)).g * 0.6 + n3.y * 0.4;
  float patches = smoothstep(0.66, 0.70, patchN) * (1.0 - smoothstep(0.6, 3.0, depth)) * 0.6;
  float foam = clamp(max(lip, max(band * 0.9, patches)), 0.0, 1.0) * inMap * step(0.001, depth);
  col = mix(col, vec3(0.97, 1.0, 1.0) * (0.9 + 0.1 * uDay), foam * 0.95);

  col *= mix(1.0, 0.55, uStorm);
  col = mix(col, col * vec3(0.72, 0.6, 1.0), uStorm * 0.7);

  float alpha = mix(0.55, 0.97, smoothstep(0.0, 0.7, t));
  alpha = max(alpha, foam);
  alpha = max(alpha, fres * 0.9);
  gl_FragColor = vec4(col * (0.35 + 0.65 * uDay), alpha);
  #include <fog_fragment>
}`, MA = class {
  mesh;
  constructor(e4) {
    let t2 = new Es({ vertexShader: AA, fragmentShader: jA, transparent: true, depthWrite: false, fog: true, uniforms: Cs.merge([H.fog, {}]) });
    Object.assign(t2.uniforms, { uHM: { value: e4 }, uNoise: Z.uNoise, uTime: Z.uTime, uDay: Z.uDay, uStorm: Z.uStorm, uSunDir: Z.uSunDir, uSunCol: Z.uSunCol, uCam: Z.uCam, uHorizon: Z.uHorizon, uZenith: Z.uZenith });
    let n2 = new ms(7e3, 7e3, 1, 1);
    n2.rotateX(-Math.PI / 2), this.mesh = new Mi(n2, t2), this.mesh.position.y = 0, this.mesh.renderOrder = 5, this.mesh.frustumCulled = false;
  }
}, NA = 128, PA = 800 / NA, FA = `
uniform float uTime;
uniform float uStorm;
uniform vec3 uSunDir;
attribute vec4 iA;   // flock centre xyz, circle radius
attribute vec4 iB;   // angular speed (signed), phase, size, kind (0 songbird, 1 gull, 2 hawk)
attribute vec4 iC;   // trail angle, radial offset, height offset, seed
attribute float aTone; // 0 body, 1 inner wing, 2 wing tip
varying float vLit;
varying float vTone;
varying float vKind;
#include <fog_pars_vertex>
void main() {
  float t = uTime, kind = iB.w, seed = iC.w, w = iB.x;
  // the flock's centre wanders slowly across its area and bobs up and down
  vec3 C = iA.xyz + vec3(sin(t * 0.017 + iB.y * 3.1), 0.0, cos(t * 0.013 + iB.y * 2.3)) * iA.w * 0.7;
  C.y += sin(t * 0.11 + iB.y) * 4.0;
  float ang = iB.y + t * w - iC.x * sign(w);
  float R = iA.w + iC.y + sin(t * 0.6 + seed * 6.28) * (kind < 0.5 ? 1.2 : 3.0);
  vec3 P = C + vec3(cos(ang) * R, iC.z + sin(t * 0.9 + seed * 9.0) * (kind < 0.5 ? 0.6 : 1.5), sin(ang) * R);
  vec3 fwd = normalize(vec3(-sin(ang) * w, 0.0, cos(ang) * w));
  vec3 inward = -vec3(cos(ang), 0.0, sin(ang));
  vec3 up = normalize(vec3(0.0, 1.0, 0.0) + inward * (kind < 0.5 ? 0.5 : 0.3));
  vec3 right = normalize(cross(fwd, up));
  up = cross(right, fwd);
  // wing beat: songbirds flap fast with short glides, gulls flap lazily and glide a lot, hawks mostly soar
  float fr = kind < 0.5 ? 12.0 : (kind < 1.5 ? 4.6 : 2.4);
  float glide = kind < 0.5 ? smoothstep(0.55, 0.8, sin(t * 0.9 + seed * 13.0))
              : kind < 1.5 ? smoothstep(-0.3, 0.3, sin(t * 0.35 + seed * 7.0))
              : 0.85 + 0.15 * smoothstep(-0.2, 0.2, sin(t * 0.2 + seed * 5.0));
  float ph = t * fr + seed * 20.0;
  float a1 = mix(sin(ph) * 0.8 + 0.1, 0.1, glide);
  float a2 = mix(sin(ph - 0.9) * 0.95 + 0.1, kind > 1.5 ? 0.22 : 0.02, glide);
  float ax = abs(position.x), sx = position.x < 0.0 ? -1.0 : 1.0;
  float e = 0.42;
  vec2 wg = ax <= e ? vec2(ax * cos(a1), ax * sin(a1)) : vec2(e * cos(a1) + (ax - e) * cos(a2), e * sin(a1) + (ax - e) * sin(a2));
  float aa = ax <= e ? a1 : a2;
  float s = iB.z * (1.0 - uStorm);        // the birds take shelter in the storm
  vec3 lp = vec3(sx * wg.x, position.y + wg.y, position.z) * s;
  vec3 ln = ax < 0.09 ? vec3(0.0, 1.0, 0.0) : vec3(-sx * sin(aa), cos(aa), 0.0);
  vec3 wpos = P + right * lp.x + up * lp.y + fwd * lp.z;
  vec3 wn = right * ln.x + up * ln.y + fwd * ln.z;
  vLit = dot(wn, uSunDir);
  vTone = aTone;
  vKind = kind;
  vec4 mvPosition = viewMatrix * vec4(wpos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`, IA = `
uniform float uDay;
uniform float uStorm;
varying float vLit;
varying float vTone;
varying float vKind;
#include <fog_pars_fragment>
void main() {
  vec3 col;
  if (vKind < 0.5) col = mix(vec3(0.10, 0.12, 0.19), vec3(0.06, 0.07, 0.12), smoothstep(1.0, 2.0, vTone));          // swallows: dark slate
  else if (vKind < 1.5) col = mix(mix(vec3(0.95), vec3(0.80, 0.83, 0.88), smoothstep(0.3, 1.0, vTone)), vec3(0.09), smoothstep(1.4, 2.0, vTone)); // gulls
  else col = mix(mix(vec3(0.55, 0.40, 0.26), vec3(0.36, 0.23, 0.13), smoothstep(0.3, 1.0, vTone)), vec3(0.14, 0.09, 0.06), smoothstep(1.5, 2.0, vTone)); // hawks
  float lit = 0.62 + 0.5 * max(vLit, 0.0) + 0.18 * max(-vLit, 0.0);
  col *= lit * (0.55 + 0.45 * uDay);
  col = mix(col, col * vec3(0.7, 0.6, 0.95), uStorm * 0.6);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;
function LA() {
  let e4 = [], t2 = [], n2 = [], r = (n3, r2, i2, a2) => (e4.push(n3, r2, i2), t2.push(a2), e4.length / 3 - 1), i = r(0, 0, 0.46, 0), a = r(-0.08, 0, 0.06, 0), o = r(0, 0, -0.42, 0), s2 = r(0.08, 0, 0.06, 0), c = r(0, -0.07, 0.02, 0);
  n2.push(i, a, o, i, o, s2, i, c, o);
  let l2 = r(-0.12, 0, -0.56, 1), u = r(0.12, 0, -0.56, 1);
  n2.push(o, l2, u);
  for (let e5 of [-1, 1]) {
    let t3 = r(e5 * 0.06, 0, 0.14, 1), i2 = r(e5 * 0.06, 0, -0.12, 1), a2 = r(e5 * 0.42, 0, 0.13, 1), o2 = r(e5 * 0.42, 0, -0.16, 1), s3 = r(e5 * 1, 0, -0.14, 2), c2 = r(e5 * 0.78, 0, -0.24, 2);
    n2.push(t3, a2, i2, i2, a2, o2, a2, s3, o2, o2, s3, c2);
  }
  let d = new Rc();
  return d.setAttribute(`position`, new V(e4, 3)), d.setAttribute(`aTone`, new V(t2, 1)), d.setIndex(n2), d.boundingSphere = new Pr(new R(), 1e6), d;
}
var RA = `
uniform float uTime;
uniform float uPatch;
uniform float uStorm;
uniform vec3 uCam;
uniform vec2 uWind;
uniform vec3 uSunDir;
uniform sampler2D uHM;
uniform sampler2D uZone;
attribute vec4 iP;   // home x, home z (in the patch), seed, kind (0 butterfly, 1 leaf)
attribute vec4 iQ;   // colour (0..1 picks a palette entry), size, speed, spare
varying vec2 vUv;
varying float vKind;
varying float vHue;
varying float vLit;
#include <fog_pars_vertex>
mat3 rotXYZ(vec3 a) {
  float cx = cos(a.x), sx = sin(a.x), cy = cos(a.y), sy = sin(a.y), cz = cos(a.z), sz = sin(a.z);
  return mat3(cy * cz, cy * sz, -sy, sx * sy * cz - cx * sz, sx * sy * sz + cx * cz, sx * cy, cx * sy * cz + sx * sz, cx * sy * sz - sx * cz, cx * cy);
}
void main() {
  float t = uTime, seed = iP.z, kind = iP.w, sp = iQ.z;
  vec2 home = mod(iP.xy - uCam.xz, uPatch) + uCam.xz - uPatch * 0.5;
  vec2 zuv = home / ${800 .toFixed(1)} + 0.5;
  vec4 hm = texture2D(uHM, zuv);
  vec4 zn = texture2D(uZone, zuv);
  float fade = 1.0 - smoothstep(uPatch * 0.3, uPatch * 0.47, length(home - uCam.xz));
  vec3 P, fwd;
  float mask, fold;
  mat3 tumble = mat3(1.0);
  bool leaf = kind > 0.5;
  if (!leaf) {
    // butterfly: meanders in loops around its patch of flowers, bobbing up and down
    vec2 o1 = vec2(sin(t * 0.37 * sp + seed * 6.3) + 0.5 * sin(t * 0.83 * sp + seed * 2.1), cos(t * 0.29 * sp + seed * 4.7) + 0.5 * cos(t * 0.71 * sp + seed * 1.3));
    float t2 = t + 0.05;
    vec2 o2 = vec2(sin(t2 * 0.37 * sp + seed * 6.3) + 0.5 * sin(t2 * 0.83 * sp + seed * 2.1), cos(t2 * 0.29 * sp + seed * 4.7) + 0.5 * cos(t2 * 0.71 * sp + seed * 1.3));
    P = vec3(home.x + o1.x * 2.4, hm.r + 0.5 + 0.7 * (0.5 + 0.5 * sin(t * 0.9 * sp + seed * 3.0)) + 0.1 * sin(t * 6.0 + seed * 10.0), home.y + o1.y * 2.4);
    vec2 d = o2 - o1;
    fwd = normalize(vec3(d.x, 0.15 * cos(t * 6.0 + seed * 10.0), d.y) + vec3(1e-4, 0.0, 0.0));
    mask = smoothstep(0.25, 1.0, zn.g) * smoothstep(0.4, 0.7, hm.g) * (1.0 - zn.a);
    fold = 0.15 + 1.2 * (0.5 + 0.5 * sin(t * 17.0 * (0.85 + 0.3 * fract(seed * 7.0)) + seed * 30.0));
  } else {
    // leaf: drops from the canopy, swaying and tumbling, drifting downwind, rests a moment on the ground and fades
    float cyc = fract(t * sp * 0.075 + seed);
    float top = 5.0 + fract(seed * 13.0) * 4.0;
    float y = max(hm.r + 0.04, hm.r + top * (1.0 - cyc * 1.18));
    vec2 sway = vec2(sin(t * 1.6 + seed * 20.0), cos(t * 1.25 + seed * 11.0)) * 0.7 * (1.0 - smoothstep(0.82, 0.86, cyc)) + uWind * min(cyc, 0.85) * 3.5;
    P = vec3(home.x + sway.x, y, home.y + sway.y);
    fwd = vec3(0.0, 0.0, 1.0);
    float air = 1.0 - smoothstep(0.8, 0.85, cyc);
    tumble = rotXYZ(vec3(sin(t * 1.9 + seed * 7.0) * 1.1 * air, t * 0.8 * air + seed * 6.3, cos(t * 2.3 + seed * 3.0) * 0.9 * air));
    mask = smoothstep(0.15, 0.7, zn.r) * smoothstep(0.0, 0.03, cyc) * (1.0 - smoothstep(0.93, 1.0, cyc));
    fold = 0.32;
  }
  // the zone level is a density: each instance shows up only where the level beats its own random threshold
  float pick = 0.08 + 0.84 * fract(seed * 17.31);
  float s = iQ.y * smoothstep(pick - 0.07, pick + 0.07, mask) * fade * (1.0 - uStorm);
  // the two halves hinge on the body axis (z): butterfly wings beat, a leaf folds slightly along its vein
  float ax = abs(position.x), sx = position.x < 0.0 ? -1.0 : 1.0;
  vec3 lp = vec3(sx * ax * cos(fold), ax * sin(fold), position.z) * s;
  vec3 ln = vec3(-sx * sin(fold), cos(fold), 0.0);
  vec3 wpos;
  vec3 wn;
  if (leaf) { wpos = P + tumble * lp; wn = tumble * ln; }
  else {
    vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, fwd);
    wpos = P + right * lp.x + up * lp.y + fwd * lp.z;
    wn = right * ln.x + up * ln.y + fwd * ln.z;
  }
  vUv = vec2(ax, position.z);
  vKind = kind;
  vHue = iQ.x;
  vLit = dot(wn, uSunDir);
  vec4 mvPosition = viewMatrix * vec4(wpos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`, zA = `
uniform float uDay;
uniform float uStorm;
varying vec2 vUv;
varying float vKind;
varying float vHue;
varying float vLit;
#include <fog_pars_fragment>
void main() {
  vec3 col;
  float x = vUv.x, z = vUv.y;
  if (vKind < 0.5) {
    // two rounded lobes per wing (fore and hind), dark rim, a pale spot or two
    vec2 f = (vec2(x, z) - vec2(0.5, 0.13)) / vec2(0.48, 0.36);
    vec2 h = (vec2(x, z) - vec2(0.36, -0.2)) / vec2(0.34, 0.26);
    float df = length(f), dh = length(h);
    float d = min(df, dh);
    if (d > 1.0 || x < 0.04) discard;
    vec3 base = vHue < 0.3 ? vec3(1.0, 0.78, 0.08) : vHue < 0.5 ? vec3(1.0, 0.45, 0.06) : vHue < 0.68 ? vec3(0.96, 0.96, 1.0) : vHue < 0.85 ? vec3(0.22, 0.55, 1.0) : vec3(1.0, 0.4, 0.7);
    col = mix(base, vec3(0.06, 0.05, 0.07), smoothstep(0.72, 0.8, d));
    float spot = 1.0 - smoothstep(0.08, 0.11, length(vec2(x, z) - vec2(0.72, 0.24)));
    col = mix(col, vec3(1.0), spot * step(0.7, d) * 0.9);
    col = mix(col, vec3(0.08), 1.0 - smoothstep(0.04, 0.09, x));
  } else {
    // leaf outline: pointed ellipse, paler vein
    float w = 0.95 * pow(max(1.0 - pow(abs(z) * 2.0, 2.0), 0.0), 0.65);
    if (x > w) discard;
    vec3 a = vHue < 0.55 ? vec3(0.32, 0.62, 0.16) : vHue < 0.85 ? vec3(0.62, 0.70, 0.14) : vec3(0.85, 0.52, 0.12);
    col = mix(a * 1.25, a, smoothstep(0.03, 0.12, x));
  }
  float lit = 0.6 + 0.45 * abs(vLit);
  col *= lit * (0.55 + 0.45 * uDay);
  col = mix(col, col * vec3(0.7, 0.6, 0.95), uStorm * 0.6);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;
function BA() {
  let e4 = new Rc();
  return e4.setAttribute(`position`, new V([-1, 0, -0.5, 0, 0, -0.5, 0, 0, 0.5, -1, 0, 0.5, 0, 0, -0.5, 1, 0, -0.5, 1, 0, 0.5, 0, 0, 0.5], 3)), e4.setIndex([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7]), e4.boundingSphere = new Pr(new R(), 1e6), e4;
}
var VA = `
uniform float uTime;
uniform float uPatch;
uniform float uStorm;
uniform vec3 uCam;
uniform vec2 uWind;
uniform sampler2D uHM;
uniform sampler2D uZone;
attribute vec4 iP;   // home x, home z, height fraction, seed
varying vec2 vUv;
varying vec4 vCol;
void main() {
  float t = uTime, seed = iP.w;
  // pollen drifts lazily; up on the snow the same specks become spindrift streaming downwind
  vec2 baseH = mod(iP.xy - uCam.xz, uPatch) + uCam.xz - uPatch * 0.5;
  vec4 zn0 = texture2D(uZone, baseH / ${800 .toFixed(1)} + 0.5);
  float alp = smoothstep(0.25, 0.6, zn0.a);
  vec2 drift = vec2(sin(t * 0.13 + seed * 6.3), cos(t * 0.11 + seed * 4.1)) * 1.4 + uWind * t * mix(0.25, 7.0, alp);
  vec2 home = mod(iP.xy + drift - uCam.xz, uPatch) + uCam.xz - uPatch * 0.5;
  vec2 zuv = home / ${800 .toFixed(1)} + 0.5;
  vec4 hm = texture2D(uHM, zuv);
  vec4 zn = texture2D(uZone, zuv);
  float hgt = mix(0.3 + iP.z * 4.2, 0.1 + iP.z * iP.z * 2.2, alp) + sin(t * 0.21 + seed * 9.0) * 0.35 + sin(t * 3.1 + seed * 17.0) * 0.15 * alp;
  vec3 P = vec3(home.x, hm.r + hgt, home.y);
  float dist = length(P - uCam);
  float fade = (1.0 - smoothstep(uPatch * 0.28, uPatch * 0.46, length(home - uCam.xz))) * smoothstep(0.8, 2.0, dist);
  float place = max(max(zn.r * 1.0, zn.g * 0.75), max(alp * 1.2, 0.22));
  float tw = 0.55 + 0.45 * sin(t * (1.3 + fract(seed * 3.7) * 2.0) + seed * 30.0);
  float a = fade * place * tw * (1.0 - uStorm);
  float size = mix(0.07, 0.05, alp) * (0.7 + 0.6 * fract(seed * 5.3));
  vec4 mv = viewMatrix * vec4(P, 1.0);
  // spindrift streaks stretch along their motion
  vec2 q = position.xy;
  q.x *= 1.0 + alp * 2.5;
  mv.xy += q * size;
  gl_Position = projectionMatrix * mv;
  vUv = position.xy;
  vCol = vec4(mix(vec3(1.0, 0.93, 0.7), vec3(0.9, 0.95, 1.0), alp), a * mix(0.55, 0.75, alp));
}`, HA = `
uniform float uDay;
varying vec2 vUv;
varying vec4 vCol;
void main() {
  float d = length(vUv * 2.0);
  float a = pow(max(1.0 - d, 0.0), 1.6) * vCol.a;
  if (a < 0.003) discard;
  gl_FragColor = vec4(vCol.rgb * a * (0.5 + 0.5 * uDay), a);
}`, UA = class {
  group = new Pn();
  zoneTex;
  zone;
  flyers;
  bugs;
  motes;
  bugU = { uPatch: { value: 56 } };
  moteU = { uPatch: { value: 36 } };
  zones = { forest: 0, meadow: 0, coast: 0, alpine: 0, town: 0 };
  smooth = { forest: 0, meadow: 0, coast: 0, alpine: 0, town: 0 };
  hm;
  build(e4, t2, n2) {
    this.hm = n2, this.buildZones(e4, t2, Math.round(Math.sqrt(t2.length))), this.buildFlyers(), this.buildBugs(40, 220), this.buildMotes(240), this.group.add(this.flyers, this.bugs, this.motes);
  }
  buildZones(e4, t2, r) {
    let i = 16384, a = new Float32Array(i), o = new Float32Array(i), c = new Float32Array(i), l2 = (e5, t3) => {
      let n2 = Math.floor((e5 + 400) / PA), r2 = Math.floor((t3 + 400) / PA);
      return n2 < 0 || r2 < 0 || n2 >= NA || r2 >= NA ? -1 : r2 * NA + n2;
    };
    for (let t3 of e4) {
      let e5 = l2(t3.x, t3.z);
      e5 < 0 || (t3.type === `oak` || t3.type === `birch` ? a[e5] += 1 : t3.type === `pine` ? a[e5] += 0.45 : t3.type === `flower` ? o[e5] += 1 : t3.type === `bush` && (o[e5] += 0.3));
    }
    let u = new Float32Array(i);
    for (let e5 = 0; e5 < NA; e5++) for (let t3 = 0; t3 < NA; t3++) {
      let n2 = ay(-400 + (t3 + 0.5) * PA, -400 + (e5 + 0.5) * PA);
      u[e5 * NA + t3] = n2, c[e5 * NA + t3] = +(n2 < -0.3);
    }
    WA(a, 2), WA(a, 2), WA(o, 3), WA(c, 6), WA(c, 5), this.zone = new Uint8Array(i * 4);
    let d = r / NA;
    for (let e5 = 0; e5 < NA; e5++) for (let n2 = 0; n2 < NA; n2++) {
      let i2 = e5 * NA + n2, s2 = u[i2], l3 = 0, f2 = 0;
      for (let i3 = Math.floor(e5 * d); i3 < Math.floor((e5 + 1) * d); i3++) for (let e6 = Math.floor(n2 * d); e6 < Math.floor((n2 + 1) * d); e6++) l3 += t2[i3 * r + e6], f2++;
      let p = f2 ? l3 / f2 / 255 : 0, m = wp(a[i2] * 0.9), h = wp(p * (1 - m * 0.85) * (0.55 + o[i2] * 2.2)) * (1 - Ep(45, 60, s2)), g2 = s2 > -2.5 ? wp(c[i2] * 2.6) : 0, _2 = Ep(52, 72, s2);
      this.zone[i2 * 4] = m * 255, this.zone[i2 * 4 + 1] = h * 255, this.zone[i2 * 4 + 2] = g2 * 255, this.zone[i2 * 4 + 3] = _2 * 255;
    }
    let f = new Ki(this.zone, NA, NA, T);
    f.magFilter = f.minFilter = s, f.wrapS = f.wrapT = n, f.needsUpdate = true, this.zoneTex = f;
  }
  sampleZones(e4, t2, n2) {
    let r = (e4 + 400) / PA - 0.5, i = (t2 + 400) / PA - 0.5, a = Math.max(0, Math.min(126, Math.floor(r))), o = Math.max(0, Math.min(126, Math.floor(i))), s2 = wp(r - a), c = wp(i - o), l2 = (o * NA + a) * 4, u = l2 + 4, d = l2 + 512, f = d + 4;
    n2.forest = this.bilerp(l2, u, d, f, 0, s2, c), n2.meadow = this.bilerp(l2, u, d, f, 1, s2, c), n2.coast = this.bilerp(l2, u, d, f, 2, s2, c), n2.alpine = this.bilerp(l2, u, d, f, 3, s2, c);
    let p = qv[0];
    n2.town = 1 - Ep(p.r * 0.75, p.r * 1.3, Math.hypot(e4 - p.x, t2 - p.z));
  }
  bilerp(e4, t2, n2, r, i, a, o) {
    let s2 = this.zone, c = s2[e4 + i], l2 = s2[t2 + i], u = s2[n2 + i], d = s2[r + i];
    return ((c + (l2 - c) * a) * (1 - o) + (u + (d - u) * a) * o) / 255;
  }
  buildFlyers() {
    let e4 = new jp(9157), t2 = [], n2 = [], r = [], i = this.zone, a = (e5, t3, n3) => {
      let r2 = Math.max(0, Math.min(127, Math.floor((e5 + 400) / PA))), a2 = Math.max(0, Math.min(127, Math.floor((t3 + 400) / PA)));
      return i[(a2 * NA + r2) * 4 + n3] / 255;
    }, o = (e5, t3, n3) => {
      let r2 = 0;
      for (let i2 = 0; i2 < 8; i2++) for (let a2 of [0.4, 1]) r2 = Math.max(r2, ay(e5 + Math.cos(i2 * 0.785) * n3 * a2, t3 + Math.sin(i2 * 0.785) * n3 * a2));
      return Math.max(r2, ay(e5, t3), 0);
    }, s2 = (i2, a2, s3, c2, l3, u2) => {
      let d2 = (e4.chance(0.5) ? 1 : -1) * (s3 === 0 ? e4.range(0.16, 0.26) * 40 : s3 === 1 ? e4.range(0.22, 0.32) * 20 : e4.range(0.05, 0.08) * 60) / l3, f2 = e4.range(0, Math.PI * 2), p2 = (s3 === 1 ? Math.max(0, ay(i2, a2)) : o(i2, a2, l3 * 1.3)) + u2;
      for (let o2 = 0; o2 < c2; o2++) {
        let c3 = s3 === 0 ? e4.range(0.8, 0.95) : s3 === 1 ? e4.range(1.15, 1.35) : e4.range(1.7, 2);
        t2.push(i2, p2, a2, l3), n2.push(d2, f2, c3, s3), s3 === 0 ? r.push(o2 * 0.045 + e4.range(-0.02, 0.02), e4.range(-2.5, 2.5), e4.range(-1.5, 1.5), e4.next()) : r.push(e4.range(0, Math.PI * 2), e4.range(-l3 * 0.35, l3 * 0.35), e4.range(-4, 6), e4.next());
      }
    }, c = [];
    for (let t3 = 0; t3 < 400 && c.length < 8; t3++) {
      let t4 = e4.range(-320, 320), n3 = e4.range(-320, 320);
      ay(t4, n3) < 2 || a(t4, n3, 0) + a(t4, n3, 1) < 0.45 || c.some(([e5, r2]) => Math.hypot(e5 - t4, r2 - n3) < 150) || c.push([t4, n3]);
    }
    for (let [t3, n3] of c) s2(t3, n3, 0, e4.int(6, 10), e4.range(24, 40), e4.range(15, 24));
    let l2 = qv.find((e5) => e5.id === `joneses`), u = qv.find((e5) => e5.id === `sleepy`), d = [];
    l2 && d.push([l2.x, l2.z + 25]), u && d.push([u.x - 30, u.z]);
    for (let t3 = 0; t3 < 600 && d.length < 5; t3++) {
      let t4 = e4.range(0, Math.PI * 2), n3 = e4.range(240, 380), r2 = Math.cos(t4) * n3, i2 = Math.sin(t4) * n3;
      a(r2, i2, 2) < 0.5 || Math.abs(ay(r2, i2)) > 3 || d.some(([e5, t5]) => Math.hypot(e5 - r2, t5 - i2) < 180) || d.push([r2, i2]);
    }
    for (let [t3, n3] of d) s2(t3, n3, 1, e4.int(4, 6), e4.range(14, 26), e4.range(9, 16));
    let f = qv.find((e5) => e5.id === `covert`), p = qv.find((e5) => e5.id === `sanctuary`);
    f && (s2(f.x + 20, f.z + 10, 2, 1, 55, 38), s2(f.x - 30, f.z - 20, 2, 1, 70, 52)), p && s2(p.x, p.z, 2, 1, 60, 60);
    let m = LA();
    m.setAttribute(`iA`, new Xi(new Float32Array(t2), 4)), m.setAttribute(`iB`, new Xi(new Float32Array(n2), 4)), m.setAttribute(`iC`, new Xi(new Float32Array(r), 4)), m.instanceCount = t2.length / 4;
    let h = new Es({ vertexShader: FA, fragmentShader: IA, side: 2, fog: true, uniforms: Cs.merge([H.fog, {}]) });
    Object.assign(h.uniforms, { uTime: Z.uTime, uStorm: Z.uStorm, uSunDir: Z.uSunDir, uDay: Z.uDay }), this.flyers = new Mi(m, h), this.flyers.frustumCulled = false, this.flyers.matrixAutoUpdate = false;
  }
  buildBugs(e4, t2) {
    let n2 = new jp(5521), r = e4 + t2, i = this.bugU.uPatch.value, a = new Float32Array(r * 4), o = new Float32Array(r * 4);
    for (let t3 = 0; t3 < r; t3++) {
      let r2 = t3 < e4;
      a[t3 * 4] = n2.range(0, i), a[t3 * 4 + 1] = n2.range(0, i), a[t3 * 4 + 2] = n2.next(), a[t3 * 4 + 3] = +!r2, o[t3 * 4] = n2.next(), o[t3 * 4 + 1] = r2 ? n2.range(0.15, 0.21) : n2.range(0.12, 0.16), o[t3 * 4 + 2] = r2 ? n2.range(0.8, 1.3) : n2.range(0.75, 1.3);
    }
    let s2 = BA();
    s2.setAttribute(`iP`, new Xi(a, 4)), s2.setAttribute(`iQ`, new Xi(o, 4)), s2.instanceCount = r;
    let c = new Es({ vertexShader: RA, fragmentShader: zA, side: 2, fog: true, uniforms: Cs.merge([H.fog, {}]) });
    Object.assign(c.uniforms, { uTime: Z.uTime, uStorm: Z.uStorm, uSunDir: Z.uSunDir, uDay: Z.uDay, uCam: Z.uCam, uWind: Z.uWind, uHM: { value: this.hm }, uZone: { value: this.zoneTex }, uPatch: this.bugU.uPatch }), this.bugs = new Mi(s2, c), this.bugs.frustumCulled = false, this.bugs.matrixAutoUpdate = false;
  }
  buildMotes(e4) {
    let t2 = new jp(733), n2 = this.moteU.uPatch.value, r = new Float32Array(e4 * 4);
    for (let i2 = 0; i2 < e4; i2++) r[i2 * 4] = t2.range(0, n2), r[i2 * 4 + 1] = t2.range(0, n2), r[i2 * 4 + 2] = t2.next(), r[i2 * 4 + 3] = t2.next();
    let i = new Rc();
    i.setAttribute(`position`, new V([-0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0], 3)), i.setIndex([0, 1, 2, 0, 2, 3]), i.setAttribute(`iP`, new Xi(r, 4)), i.instanceCount = e4, i.boundingSphere = new Pr(new R(), 1e6);
    let a = new Es({ vertexShader: VA, fragmentShader: HA, transparent: true, depthWrite: false, blending: 5, blendSrc: 201, blendDst: 201, uniforms: { uTime: Z.uTime, uStorm: Z.uStorm, uDay: Z.uDay, uCam: Z.uCam, uWind: Z.uWind, uHM: { value: this.hm }, uZone: { value: this.zoneTex }, uPatch: this.moteU.uPatch } });
    this.motes = new Mi(i, a), this.motes.frustumCulled = false, this.motes.matrixAutoUpdate = false, this.motes.renderOrder = 6;
  }
  update(e4, t2, n2, r) {
    this.sampleZones(t2.x, t2.z, this.zones);
    let i = this.zones, a = this.smooth, o = 1 - Math.exp(-e4 * 1.5), s2 = n2 ? 1 - Ep(12, 45, t2.y - Math.max(0, ay(t2.x, t2.z))) : 0, c = 1 - Ep(0.2, 0.7, r);
    a.forest += (i.forest * s2 - a.forest) * o, a.meadow += (i.meadow * s2 - a.meadow) * o, a.coast += (i.coast * (0.35 + 0.65 * s2) - a.coast) * o, a.alpine += (i.alpine * s2 - a.alpine) * o, a.town += (i.town * s2 - a.town) * o;
    let l2 = Math.max(a.forest, a.meadow) * (1 - a.town * 0.7) * (1 - a.alpine);
    W.setLoop(`wind`, 0.18 + wp(t2.y / 160) * 0.2 + a.alpine * 0.06 + a.coast * 0.05), W.setLoop(`birds`, n2 ? (0.08 + 0.34 * l2) * c * (1 - a.coast * 0.5) : 0), W.setLoop(`surf`, a.coast * 0.7 * (0.5 + 0.5 * c)), W.setLoop(`town`, a.town * 0.75 * c), W.setLoop(`alpine`, a.alpine * 0.65), W.setLoop(`forest`, a.forest * 0.7 * c), W.setLoop(`meadow`, a.meadow * (1 - a.forest) * 0.6 * c);
  }
};
function WA(e4, t2) {
  let n2 = new Float32Array(e4.length);
  for (let r = 0; r < NA; r++) for (let i = 0; i < NA; i++) {
    let a = 0, o = 0;
    for (let n3 = -t2; n3 <= t2; n3++) {
      let t3 = i + n3;
      t3 >= 0 && t3 < NA && (a += e4[r * NA + t3], o++);
    }
    n2[r * NA + i] = a / o;
  }
  for (let r = 0; r < NA; r++) for (let i = 0; i < NA; i++) {
    let a = 0, o = 0;
    for (let e5 = -t2; e5 <= t2; e5++) {
      let t3 = r + e5;
      t3 >= 0 && t3 < NA && (a += n2[t3 * NA + i], o++);
    }
    e4[r * NA + i] = a / o;
  }
}
var GA = `Sweaty.Noob.Cranky.Turbo.Sneaky.Lil.Big.Captain.Salty.Epic.Dank.Wobbly.Mega.Sir.Dr.Lazy.Crispy.Spicy.Fuzzy.Shadow.Zesty.Goofy.Mister.Rapid.Toxic.Chill.Hyper.Grumpy.Lucky.Stealthy`.split(`.`), KA = `Llama.Pickaxe.Banana.Bush.Builder.Sniper.Potato.Ninja.Waffle.Goblin.Nugget.Pumpkin.Wizard.Raptor.Taco.Yeti.Muffin.Bandit.Noodle.Pirate.Pancake.Gremlin.Cactus.Walrus.Pickle.Rocket.Biscuit.Phantom.Dumpling.Hamster`.split(`.`), qA = 0.72, JA = () => new Promise((e4) => setTimeout(e4, 0)), YA = new R(), XA = new R(), ZA = new R(), QA = /* @__PURE__ */ new Set([`KeyW`, `KeyA`, `KeyS`, `KeyD`, `Space`, `ShiftLeft`, `KeyZ`]), $A = [`Digit2`, `Digit3`, `Digit4`, `Digit5`, `Digit6`, `KeyX`, `Delete`, `Backspace`, `Enter`, `NumpadEnter`], ej = class {
  canvas;
  renderer;
  scene = new Un();
  camera = new Oc(80, 1, 0.12, 4200);
  post;
  sky;
  terrain;
  water;
  grass;
  storm;
  ambient = new UA();
  plan;
  hud;
  menus;
  player;
  pc;
  bots = [];
  fighterGroup = new Pn();
  state = `loading`;
  icons = /* @__PURE__ */ new Map();
  bus = { model: null, ax: 0, az: 0, dx: 1, dz: 0, t: 0, dur: 20, active: false, pos: new R() };
  DOORS = 3.4;
  lobby = { pos: new R(), yaw: 0, cam: new R(), look: new R(), zoom: 0, zoomT: 0 };
  last = 0;
  frameNo = 0;
  hudT = 0;
  mapT = 0;
  stormT = 0;
  fpsT = 0;
  fpsN = 0;
  stormMix = 0;
  weather = `clear`; // clear, rain, storm, fog, snow
  weatherT = 0;
  pauseOpen = false;
  cheatsOpen = false;
  inv;
  invOpen = false;
  overT = -1;
  killer = null;
  resultShown = false;
  scr = { x: 0, y: 0 };
  espSprites = [];
  espMat = null;
  softwareGl = false;
  timeScale = 1;
  matchTotal = 0;
  hotbar = [null, null, null, null, null];
  supplyList = [];
  constructor(e4) {
    this.canvas = e4, this.renderer = new vf({ canvas: e4, antialias: false, powerPreference: `high-performance`, stencil: false }), this.renderer.outputColorSpace = He, this.renderer.toneMapping = 4, this.renderer.toneMappingExposure = 1.15, this.renderer.shadowMap.enabled = true, this.renderer.shadowMap.type = 1, this.renderer.setPixelRatio(1), this.renderer.setSize(innerWidth, innerHeight, false);
    try {
      let e5 = this.renderer.getContext(), t2 = e5.getExtension(`WEBGL_debug_renderer_info`), n2 = t2 ? String(e5.getParameter(t2.UNMASKED_RENDERER_WEBGL)) : ``;
      this.softwareGl = /swiftshader|llvmpipe|software/i.test(n2), console.info(`[skydrop] GPU:`, n2 || `unknown`);
    } catch {
    }
  }
  async init() {
    let e4 = document.getElementById(`ui`);
    this.hud = new HD(e4), this.hud.setVisible(false), this.inv = new qD(e4, { onSwap: (e5, t3) => this.swapSlots(e5, t3), onDrop: (e5) => this.dropFromInventory(e5), onEquip: (e5) => {
      this.player.slots[e5] && (this.player.select(e5), W.play(`swap`, { volume: 0.6 }), this.closeInventory());
    }, onClose: () => this.closeInventory(), onSound: (e5) => {
      W.init(), e5 === `hover` ? W.play(`ui_hover`) : e5 === `click` ? W.play(`ui_click`) : e5 === `swap` ? W.play(`swap`, { volume: 0.6 }) : e5 === `drop` ? W.play(`drop`, { volume: 0.7 }) : W.play(`build_deny`, { volume: 0.5 });
    } }), this.menus = new lO(e4, { onPlay: () => this.openMatchPreparation(), onOnline:()=>this.openOnlineRooms(), onEvent: () => this.playIslandFlip(), onResume: () => this.resume(), onLobby: () => this.toLobby(), onRestart: () => {this.toLobby();this.openMatchPreparation();}, onSkin: (e5) => this.setSkin(e5), onCheatAction: (e5) => this.cheat(e5), onScreen: (e5) => {
      this.lobby.zoomT = +(e5 === `locker`);
    }, onUiSound: (e5) => {
      W.init(), W.play(e5 === `play` ? `ui_play` : e5 === `hover` ? `ui_hover` : `ui_click`);
    } }, xC.map((e5) => ({ id: e5.id, name: e5.name, color: e5.color })));
    let t2 = async (e5, t3) => {
      this.menus.showLoading(e5, t3), await JA(), await JA();
    };
    await t2(`Raising the island\u2026`, 0.05), gE(), await wh(), ry(), hy(), await t2(`Building towns\u2026`, 0.2), this.plan = vA();
    let n2 = Zk().concat(this.plan.trees);
    await t2(`Painting the landscape\u2026`, 0.35);
    try {
      await document.fonts.load(`19px "Luckiest Guy"`);
    } catch {
    }
    this.terrain = new Ok(), this.terrain.build(this.plan.paint, sA(n2), this.plan.footprints), this.scene.add(this.terrain.mesh), await t2(`Planting forests\u2026`, 0.55), this.sky = new $E(this.scene), this.water = new MA(this.terrain.hm), this.scene.add(this.water.mesh), this.grass = new uO(this.scene, this.terrain.hm, this.terrain.albedo), this.ambient.build(n2, this.terrain.grassMask, this.terrain.hm), this.scene.add(this.ambient.group), oA.build(n2), this.scene.add(oA.group), await t2(`Raising walls\u2026`, 0.7), Fx.setWorldSpecs(this.plan.pieces), Fx.reset(), TA.setSpecs(this.plan.props), TA.reset(), this.scene.add(Fx.group, TA.group), await t2(`Stocking chests\u2026`, 0.82), Xx.init(), am.init(), this.storm = new kA(), this.storm.mesh.visible = false, this.bus.model = Iv(), this.bus.model.visible = false, this.scene.add(Xx.group, am.group, this.storm.mesh, this.bus.model, this.fighterGroup, cb), this.makeIcons(), await t2(`Waking the bots\u2026`, 0.92);
    let r = xC.find((e5) => e5.id === Sf.s.skin) ?? xC[0];
    this.player = new ZT(`You`, true, r), Sf.onChange((key)=>{if((key===`pickaxe`||key===`wrap`)&&this.player){this.player.heldKey=``;this.player.refreshHeld();}if(key===`glider`&&this.player?.mode===`glide`)this.player.setGlider(true);}), this.fighterGroup.add(this.player.char.root), this.pc = new hE(this.player, this.camera, { icon: (e5) => this.icons.get(e5) ?? ``, requestDrop: () => this.dropPlayer() }), this.scene.add(this.pc.weakSprite, this.pc.arc), this.post = new BE(this.renderer, this.scene, this.camera), this.wire(), this.applyQuality(), this.pickLobbySpot(n2), this.hud.setMapBase(this.terrain.mapCanvas), addEventListener(`resize`, () => this.resize()), this.resize(), this.toLobby(), this.renderer.compile(this.scene, this.camera), await t2(`Ready`, 1), this.menus.showLoading(null), this.softwareGl && this.hud.banner(`SOFTWARE RENDERING`, `Enable hardware acceleration in your browser for full quality`, 6e3), this.last = performance.now();
    // Shark Loot system
    this.sharks = [];
    this.sharkGroup = new Pn();
    this.scene.add(this.sharkGroup);
    for (let i = 0; i < 3; i++) {
      let shark = this.makeShark();
      shark.userData = { angle: Math.random() * Math.PI * 2, radius: 30 + i * 20, speed: 0.15 + Math.random() * 0.05, dropT: 0, centerIdx: i };
      this.sharkGroup.add(shark);
      this.sharks.push(shark);
    }
    let i = (e5) => {
      requestAnimationFrame(i), this.eventOverlay || this.frame(e5);
    };
    requestAnimationFrame(i);
  }
  wire() {
    Object.assign(G, { scene:this.scene, usePlaceItem:(...args)=>this.usePlaceItem(...args), splashHeal:(...args)=>this.splashHeal(...args), pingAt:(...args)=>this.pingAt(...args), gainXp:(...args)=>this.gainXp(...args) });
    Object.assign(G, { fighters: [this.player], player: this.player, storm: this.storm, hud: this.hud, camera: this.camera, time: 0, phase: `lobby`, alive: 1, shake: (e5) => this.pc.shake(e5), project: (e5, t3, n2, r) => (YA.set(e5, t3, n2).project(this.camera), YA.z > 1 ? false : (r.x = (YA.x * 0.5 + 0.5) * innerWidth, r.y = (-YA.y * 0.5 + 0.5) * innerHeight, true)), onElim: (e5, t3, n2) => this.eliminate(e5, t3, n2) }), X.init(this.canvas), X.onLockChange = (e5) => {
      e5 || this.state !== `match` || this.cheatsOpen || this.resultShown || this.invOpen || (this.pauseOpen = true, this.menus.showPause(true));
    }, this.canvas.addEventListener(`mousedown`, () => {
      W.init(), this.state !== `match` && this.state !== `over` || this.pauseOpen || this.cheatsOpen || this.resultShown || X.lock();
    }), addEventListener(`keydown`, (e5) => {
      // In-game chat: ENTER opens the chat box (team chat, bots reply)
      if (e5.code === `Enter` && this.state === `match` && !this.invOpen && !this.cheatsOpen && !this.resultShown && !this.pauseOpen && document.activeElement !== this.hud.chatInput) {
        e5.preventDefault(), this.hud.chatInput.style.display = ``, this.hud.chatInput.value = ``, this.hud.chatInput.focus(), X.enabled = false, X.unlock();
      }
    }), this.hud.chatInput.addEventListener(`keydown`, (e5) => {
      if (e5.stopPropagation(), e5.code === `Enter`) {
        let e6 = this.hud.chatInput.value.trim();
        e6 && (this.hud.addChat(`You`, e6, Sf.s.hudColor || `#ffffff`), W.play(`swap`, { volume: 0.4 }), this.onlineActive?this.online.action(`chat`,{text:e6}):this.botChatReply()), this.hud.chatInput.style.display = `none`, this.hud.chatInput.blur(), X.enabled = true, this.state === `match` && X.lock();
      } else e5.code === `Escape` && (this.hud.chatInput.style.display = `none`, this.hud.chatInput.blur(), X.enabled = true, this.state === `match` && X.lock());
    }), Sf.onChange((e5) => {
      (e5 === `quality` || e5 === `shadows` || e5 === `bloom` || e5 === `renderScale` || e5 === `performanceMode`) && this.applyQuality(), e5 === `fov` && this.camera.updateProjectionMatrix();
      if (e5 === `hudColor` || e5 === `hudScale`) {
        let hudEl = document.querySelector(`.sr-hud`);
        if (hudEl) {
          hudEl.style.setProperty(`--hud-color`, Sf.s.hudColor);
          hudEl.style.setProperty(`--hud-scale`, Sf.s.hudScale);
          hudEl.style.fontSize = `calc(1em * ${Sf.s.hudScale})`;
        }
      }
      // High contrast HUD: stronger outlines across the whole UI
      if (e5 === `hudContrast` || !e5) {
        document.body.classList.toggle(`hc`, !!Sf.s.hudContrast);
      }
      // Colorblind mode: CSS filter presets
      if (e5 === `colorblind` || !e5) {
        document.body.classList.toggle(`cb-deut`, Sf.s.colorblind === `deuteranopia`);
        document.body.classList.toggle(`cb-trit`, Sf.s.colorblind === `tritanopia`);
      }
    }), ZT.events.onJump = (e5) => {
      e5.isPlayer && W.play(`jump`, { volume: 0.5 });
    }, ZT.events.onDash = (e5) => {
      (e5.isPlayer || e5.visible) && am.spark(e5.pos.x, e5.pos.y + 1, e5.pos.z, 0x00e5ff, 10, 5, 0.25, 0.5, 3, 2), e5.isPlayer && this.pc.shake(0.12);
    }, ZT.events.onSlide = (e5) => {
      e5.isPlayer ? W.play(`slide`, { volume: 0.75 }) : e5.visible && W.play(`slide`, { x: e5.pos.x, y: e5.pos.y, z: e5.pos.z, volume: 0.6 }), (e5.isPlayer || e5.visible) && am.dust(e5.pos.x, e5.pos.y, e5.pos.z, 3);
    }, ZT.events.onMantle = (e5) => {
      e5.isPlayer ? W.play(`mantle`, { volume: 0.7 }) : e5.visible && W.play(`mantle`, { x: e5.pos.x, y: e5.pos.y + 1, z: e5.pos.z, volume: 0.6 });
    }, ZT.events.onDeploy = (e5) => {
      (e5.isPlayer || e5.visible) && am.gliderPuff(e5.pos.x, e5.pos.y, e5.pos.z), e5.isPlayer ? W.play(`glider_open`) : e5.visible && W.play(`glider_open`, { x: e5.pos.x, y: e5.pos.y, z: e5.pos.z, volume: 0.6 });
    }, ZT.events.onStep = (e5) => {
      e5.isPlayer ? W.play(`step`, { volume: e5.crouch ? 0.15 : 0.32, pitch: K(0.9, 1.1) }) : e5.visible && W.play(`step`, { x: e5.pos.x, y: e5.pos.y, z: e5.pos.z, volume: 0.5 });
    }, ZT.events.onLand = (e5, t3, n2) => {
      if(e5.webTrickT>0 && t3>4){e5.webRollT=.55;e5.webTrickT=0;const speed=Math.hypot(e5.vel.x,e5.vel.z);if(speed>8){e5.vel.x*=1.12;e5.vel.z*=1.12;} if(e5.isPlayer) this.hud.banner(`MOMENTUM ROLL`,`${Math.round(speed)} speed retained`,1000,`good`);}
      (e5.visible || e5.isPlayer) && am.dust(e5.pos.x, e5.pos.y, e5.pos.z, n2 ? 6 : t3 > 9 ? 5 : 2), e5.isPlayer && (W.play(`land`, { volume: n2 ? 0.7 : Math.min(1, 0.3 + t3 / 25) }), n2 && this.pc.shake(0.3)), !n2 && !e5.webRollT && t3 > 21 && Jy(e5, (t3 - 21) * 5.5, null, `fall`, false, e5.pos.x, e5.pos.y + 1, e5.pos.z);
    };
    let e4 = (e5, t3, n2) => {
      if (!(n2 instanceof ZT) || e5.yieldTotal <= 0) return;
      let r = Math.max(1, Math.round(e5.yieldTotal * Math.min(t3, e5.maxHp) / e5.maxHp));
      n2.addMat(e5.mat, r), n2.isPlayer && this.hud.floatText(innerWidth / 2 + K(30, 70), innerHeight / 2 + K(-30, 10), `+${r}`, `mat`);
    }, t2 = (e5, t3) => {
      YA.set(e5.cx, e5.cy, e5.cz).distanceToSquared(this.camera.position) > 22500 || (am.buildBreak(e5.cx, e5.cy, e5.cz, Hh[e5.mat], t3), W.play(`break_` + e5.mat, { x: e5.cx, y: e5.cy, z: e5.cz }));
    };
    Fx.events.onPlaced = piece=>{if(this.onlineActive&&!this.onlineApplying&&piece.owner===this.player)this.online.action('build',{spec:piece.spec});};
    Fx.events.onEdited = (oldPiece,newPiece)=>{if(this.onlineActive&&!this.onlineApplying)this.online.action('edit',{oldKey:oldPiece.key,spec:newPiece.spec});};
    Fx.events.onDamaged = (t3, n2, r, i) => {
      i && t3.owner !== r && e4(t3, n2, r);
    }, Fx.events.onDestroyed = (e5,attacker) => {t2(e5,1);if(this.onlineActive&&!this.onlineApplying&&!e5.world&&attacker===this.player)this.online.action('destroy',{oldKey:e5.key,spec:e5.spec});}, oA.events.onDamaged = (t3, n2, r, i) => {
      i && e4(t3, n2, r), t3.spec.type !== `rock` && r instanceof ZT && (r.isPlayer || r.visible) && am.leaves(t3.spec.x, t3.spec.y + 4.5 * t3.spec.scale, t3.spec.z, 7323450, 7);
    }, oA.events.onDestroyed = (e5) => {
      t2(e5, 1.4), e5.spec.type !== `rock` && am.leaves(e5.spec.x, e5.spec.y + 4 * e5.spec.scale, e5.spec.z, 7323450, 34);
    }, TA.events.onDamaged = (t3, n2, r, i) => {
      i && e4(t3, n2, r);
    }, TA.events.onDestroyed = (e5) => t2(e5, 1.2), this.storm.onPhase = (e5, t3) => {
      if (this.state !== `match` && this.state !== `over`) return;
      if (e5 === `shrink`) {
        this.hud.banner(`STORM EYE SHRINKING`, `Get to the safe zone!`, 3200, `storm`), W.play(`storm_warn`);
        return;
      }
      let n2 = t3 >= 1 && this.state === `match` && this.spawnSupplyDrop();
      this.hud.banner(t3 >= EA.length - 1 ? `FINAL CIRCLE` : `NEW SAFE ZONE`, n2 ? `Supply drop incoming! Check your map` : `Check your map`, 2600, `info`);
    };
  }
  makeShark() {
    let g = new Pn();
    let bodyMat = new Os({ color: 0x5a7a9a, roughness: 0.6 });
    let bellyMat = new Os({ color: 0xe8f4ff, roughness: 0.5 });
    // Body
    let body = new Mi(new gs(1.2, 12, 8), bodyMat);
    body.scale.set(2.5, 1, 0.8);
    g.add(body);
    // Belly
    let belly = new Mi(new gs(1.1, 12, 8), bellyMat);
    belly.scale.set(2.3, 0.8, 0.7);
    belly.position.y = -0.3;
    g.add(belly);
    // Tail fin
    let tail = new Mi(new Va(0.6, 1.5, 4), bodyMat);
    tail.position.set(-2.8, 0.3, 0);
    tail.rotation.z = Math.PI / 2;
    g.add(tail);
    // Dorsal fin
    let dorsal = new Mi(new Va(0.4, 0.8, 4), bodyMat);
    dorsal.position.set(0, 1, 0);
    g.add(dorsal);
    // Pectoral fins
    for (let s of [-1, 1]) {
      let fin = new Mi(new Va(0.3, 1, 4), bodyMat);
      fin.position.set(0.5, -0.5, s * 0.8);
      fin.rotation.x = s * Math.PI / 3;
      g.add(fin);
    }
    // Eyes
    for (let s of [-1, 1]) {
      let eye = new Mi(new gs(0.15, 8, 8), new Os({ color: 0x000000 }));
      eye.position.set(2, 0.3, s * 0.6);
      g.add(eye);
    }
    g.scale.setScalar(1.5);
    return g;
  }
  updateSharks(dt) {
    if (!this.sharks) return;
    for (let shark of this.sharks) {
      let u = shark.userData;
      u.angle += u.speed * dt;
      // Sharks swim in water near Sweaty Sands, Lazy Lake, and Dirty Docks
      let centers = [[-95, -75], [300, 80], [60, -330]];
      let center = centers[u.centerIdx || 0];
      let x = center[0] + Math.cos(u.angle) * u.radius;
      let z = center[1] + Math.sin(u.angle) * u.radius;
      let y = 0.5; // Water level
      shark.position.set(x, y, z);
      shark.rotation.y = -u.angle + Math.PI / 2;
      // Sharks only appear in deep water and bite nearby swimmers on a cooldown.
      shark.visible=ay(x,z)<-.5;
      u.dropT -= dt;
      if(shark.visible && u.dropT<=0 && this.player?.alive && this.player.mode===`ground` && this.player.pos.y<2 && Math.hypot(this.player.pos.x-x,this.player.pos.z-z)<4) {
        Jy(this.player,15,null,`shark`,false,x,y,z); u.dropT=3;
        W.play(`splash`,{x,y,z,volume:.8});
      }
    }
  }
  makeIcons() {
    let e4 = new vf({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    e4.setSize(256, 256), e4.setPixelRatio(1), e4.outputColorSpace = He, e4.toneMapping = 4, e4.toneMappingExposure = 1.05;
    let t2 = new Un();
    t2.add(new gc(16777215, 8952234, 2));
    let n2 = new Fc(16777215, 3.2);
    n2.position.set(2, 4, 3), t2.add(n2);
    const rim=new Fc(0x9bdcff,2.4);rim.position.set(-4,2,-3);t2.add(rim);
    const fill=new Fc(0xffe9c8,1.1);fill.position.set(4,1,-4);t2.add(fill);
    let r = new Nc(-1, 1, 1, -1, 0.1, 50), i = new ir(), a = new R(), o = new R(), s2 = (n3, s3, c2) => {
      let l3 = new Pn();
      l3.add(s3), c2 && l3.rotation.set(0, Math.PI / 2, 0), t2.add(l3), l3.updateMatrixWorld(true), i.setFromObject(l3), i.getCenter(a), i.getSize(o);
      let u = Math.max(o.x, o.y) * 0.56 + 0.01;
      r.left = -u, r.right = u, r.top = u, r.bottom = -u, r.updateProjectionMatrix(), r.position.set(a.x + (c2 ? 0 : 0.8) * u, a.y + (c2 ? 0.25 : 0.9) * u, a.z + 8), r.lookAt(a), l3.rotation.z = c2 ? 0.32 : 0, e4.render(t2, r), this.icons.set(n3, e4.domElement.toDataURL(`image/png`)), t2.remove(l3);
    };
    for (let e5 of Object.keys(Ih)) s2(e5, m_(e5), true);
    for (let e5 of Object.keys(Lh)) s2(e5, z_(e5), false);
    for (let e5 of Object.keys(Bh)) s2(`ammo_` + e5, H_(e5), false);
    for (let e5 of [`wood`, `stone`, `metal`]) s2(`mat_` + e5, W_(e5), false);
    let c = b_();
    c.rotation.y = -Math.PI / 2;
    let l2 = new Pn();
    l2.add(c), l2.rotation.z = -0.6, s2(`pickaxe`, l2, false), e4.dispose(), e4.forceContextLoss();
  }
  spawnSupplyDrop() {
    let e4 = this.storm;
    if (e4.tr < 12) return false;
    for (let t2 = 0; t2 < 40; t2++) {
      let t3 = K(0, Math.PI * 2), n2 = Math.sqrt(Math.random()) * e4.tr * qA, r = e4.tx + Math.cos(t3) * n2, i = e4.tz + Math.sin(t3) * n2;
      if (!(ay(r, i) < 1.5 || oy(r, i) > 0.35 || Math.abs(r) > 380 || Math.abs(i) > 380)) return Xx.spawnSupply(r, i), W.play(`supply_drop`, { volume: 0.8 }), true;
    }
    return false;
  }
  pickLobbySpot(e4) {
    let t2 = -1e9, n2 = 60, r = -40, i = -1, a = 0;
    for (let o2 = -230; o2 <= 230; o2 += 10) for (let s2 = -230; s2 <= 230; s2 += 10) {
      let c = ay(s2, o2);
      if (c < 12 || c > 40 || oy(s2, o2) > 0.09 || cy(s2, o2, 1.2)) continue;
      let l2 = -110 - s2, u = -70 - o2, d = Math.hypot(l2, u);
      if (d < 120 || (l2 /= d, u /= d, ay(s2 - l2 * 4.7, o2 - u * 4.7) > c + 0.35 || ay(s2 - l2 * 9, o2 - u * 9) > c + 1.2)) continue;
      let f = c - ay(s2 + l2 * 22, o2 + u * 22) + (c - ay(s2 + l2 * 55, o2 + u * 55)) * 0.7;
      if (f < 4) continue;
      let p = true;
      for (let t3 of e4) if (Math.abs(t3.x - s2) < 8 && Math.abs(t3.z - o2) < 8) {
        p = false;
        break;
      }
      if (!p) continue;
      let m = c * 0.8 + Math.min(f, 22);
      m > t2 && (t2 = m, n2 = s2, r = o2, i = l2, a = u);
    }
    let o = this.lobby;
    o.pos.set(n2, ay(n2, r), r), o.yaw = Math.atan2(-i, -a) + 0.35, o.cam.set(n2 - i * 4.7 - a * 0.55, 0, r - a * 4.7 + i * 0.55), o.cam.y = Math.max(o.pos.y + 1.5, ay(o.cam.x, o.cam.z) + 1.25), o.look.set(n2 + i * 2 - a * 0.5, o.pos.y + 1.22, r + a * 2 + i * 0.5);
  }
  applyQuality() {
    let e4 = { ...PE[Sf.s.quality] };
    Sf.s.shadows === false && (e4.shadow = 0), Sf.s.bloom === false && (e4.bloom = false), Sf.s.renderScale && (e4.pixelRatio = Math.min(2, e4.pixelRatio * Sf.s.renderScale));
    // Performance Mode is a fixed low-cost preset, not a dormant FPS guess.
    if(Sf.s.performanceMode)e4={...e4,pixelRatio:Math.min(.7,e4.pixelRatio),msaa:0,bloom:false,shadow:0,shadowRange:45,grass:3500,grassPatch:35,ao:0,sharpen:0};
    if(this.softwareGl)e4={...e4,pixelRatio:Math.min(e4.pixelRatio,.6),msaa:0,bloom:false,shadow:0,grass:Math.min(e4.grass,3000),ao:0,sharpen:0};
    this.renderer.shadowMap.enabled=e4.shadow>0;
    if(this.ambient?.group)this.ambient.group.visible=!Sf.s.performanceMode;
    if(this.terrain?.albedo){if(this._normalTerrainFilter===undefined)this._normalTerrainFilter=this.terrain.albedo.magFilter;this.terrain.albedo.magFilter=Sf.s.performanceMode?perfNearest:this._normalTerrainFilter;this.terrain.albedo.needsUpdate=true;}
    this.renderer.setPixelRatio(e4.pixelRatio);this.post?.setQuality(e4);this.sky?.setShadowQuality(Math.max(1,e4.shadow),e4.shadowRange);if(this.sky)this.sky.sun.castShadow=e4.shadow>0;this.grass?.rebuild(e4.grass,e4.grassPatch);this.resize();
  }
  resize() {
    let e4 = innerWidth, t2 = innerHeight;
    this.renderer.setSize(e4, t2, false), this.camera.aspect = e4 / t2, this.camera.updateProjectionMatrix(), this.post?.setSize(e4, t2);
  }
  setSkin(e4) {
    let t2 = xC.find((t3) => t3.id === e4);
    t2 && (this.player.setSkin(t2), this.player.char.root.visible = true); this.updateLobbyTheme(e4);
  }
  toLobby() {
    if(this.online?.session)this.online.leave();
    this.clearOnlinePlayers();this.onlineActive=false;
    this.updateLobbyTheme(Sf.s.skin); this.clearIslandUpgrade();
    this.clearBossEffects();
    this.pc?.releaseWeb();
    this.menus.stopPassPreview(); this.state = `lobby`, G.phase = `lobby`, this.pauseOpen = this.cheatsOpen = this.resultShown = false, this.closeInventory(false), X.unlock(), X.enabled = false, this.menus.showPause(false), this.menus.toggleCheats(false), this.menus.showResult(null), this.hud.setVisible(false), this.hud.toggleFullMap(false), this.menus.showLobby(true), this.storm.mesh.visible = false, this.bus.model.visible = false, this.bus.active = false, W.startMusic();
    for (let e5 of this.bots) e5.f.char.root.visible = false, e5.f.visible = false, e5.f.setTeammate(false);
    let e4 = this.player, t2 = this.lobby;
    e4.reset(), e4.mode = `ground`, e4.grounded = true, e4.pos.copy(t2.pos), e4.yaw = t2.yaw, e4.pitch = 0, e4.vel.set(0, 0, 0), e4.visible = true, e4.char.root.visible = true, e4.char.setShadows(true), e4.char.setHeld(null, `none`), Fx.showGhost(null, false), this.pc.weakSprite.visible = false, this.timeScale = 1, Z.uStorm.value = 0, this.stormMix = 0, this.camera.fov = 42, this.camera.updateProjectionMatrix();
    for (let e5 of [`storm`, `rain`, `skydive`, `glide`, `bus`, `chest`]) W.setLoop(e5, 0);
  }
  openOnlineRooms(){
    if(this.state!==`lobby`){this.hud.banner(`ONLINE ROOMS`,`Return to the lobby first`,1600);return;}
    if(this.online){this.online.openPanel();return;}
    this.online=new OnlineMatch({
      skin:()=>Sf.s.skin,
      start:(state,session)=>this.startOnlineMatch(state,session),
      snapshot:(state,session)=>{if(this.onlineActive)this.syncOnlinePlayers(state,session);},
      readState:()=>{const p=this.player;return {x:p.pos.x,y:p.pos.y,z:p.pos.z,yaw:p.yaw,pitch:p.pitch,mode:p.mode,alive:p.alive,crouch:p.crouch,speed:Math.hypot(p.vel.x,p.vel.z),weapon:p.current?.id||`pickaxe`};},
      action:(action,session)=>this.applyOnlineAction(action,session),
      leave:()=>{this.clearOnlinePlayers();if(this.onlineActive){this.onlineActive=false;this.toLobby();}},
      disconnected:()=>{this.hud.banner(`ONLINE DISCONNECTED`,`Return to lobby to reconnect`,5000);this.clearOnlinePlayers();this.onlineActive=false;}
    });
  }
  startOnlineMatch(state,session){
    if(this.state!==`lobby`){this.hud.banner(`ONLINE`,`Return to lobby to join your room`,3500);return;}
    this.onlineActive=true;this.onlineRoomSeed=state.seed;const oldCount=Sf.s.botCount,oldMode=Sf.s.gameMode;
    try{Sf.s.botCount=0;Sf.s.gameMode=`solo`;this.startMatch();}finally{Sf.s.botCount=oldCount;Sf.s.gameMode=oldMode;}
    this.player.name=state.players.find(p=>p.id===session.id)?.name||`You`;this.syncOnlinePlayers(state,session);
    this.hud.banner(`ONLINE PLAYTEST`,`Click the game to capture mouse • real-player free-for-all`,4500,`info`);
  }
  clearOnlinePlayers(){
    if(!this.onlinePlayers)return;
    for(const f of this.onlinePlayers.values()){const i=G.fighters.indexOf(f);if(i>=0)G.fighters.splice(i,1);f.networkLabel?.material.map?.dispose();f.networkLabel?.material.dispose();f.char.dispose();}
    this.onlinePlayers.clear();
  }
  syncOnlinePlayers(state,session){
    if(!this.onlineActive)return;this.onlinePlayers||=new Map();const ids=new Set(state.players.filter(p=>p.id!==session.id).map(p=>p.id));
    for(const [id,f] of this.onlinePlayers)if(!ids.has(id)){if(f.alive&&this.state===`match`)this.eliminate(f,null,`disconnected`);f.networkLabel?.material.map?.dispose();f.networkLabel?.material.dispose();f.char.dispose();this.onlinePlayers.delete(id);const index=G.fighters.indexOf(f);if(index>=0)G.fighters.splice(index,1);}
    for(const p of state.players){if(p.id===session.id)continue;let f=this.onlinePlayers.get(p.id);
      if(!f){f=new ZT(p.name,false,xC.find(s=>s.id===p.skin)||xC[0]);f.networkId=p.id;f.mode=p.mode;f.pos.set(p.x,p.y,p.z);f.netTarget=new R(p.x,p.y,p.z);f.netMode=p.mode;f.netYaw=p.yaw;
        const canvas=document.createElement(`canvas`);canvas.width=256;canvas.height=64;const ctx=canvas.getContext(`2d`);ctx.fillStyle=`rgba(3,22,39,.85)`;ctx.fillRect(0,5,256,52);ctx.fillStyle=`#d8f8ff`;ctx.textAlign=`center`;ctx.font=`bold 25px sans-serif`;ctx.fillText(p.name,128,40,240);const tex=new Na(canvas);f.networkLabel=new pi(new $r({map:tex,transparent:true,depthTest:false}));f.networkLabel.position.y=2.5;f.networkLabel.scale.set(2.6,.65,1);f.char.root.add(f.networkLabel);
        this.onlinePlayers.set(p.id,f);G.fighters.push(f);this.fighterGroup.add(f.char.root);G.alive++;this.matchTotal++;}
      if(!p.alive&&f.alive){this.eliminate(f,Date.now()-(f.lastNetworkHit||0)<8000?this.player:null,`online`);continue;}
      if(!f.alive)continue;f.netTarget.set(p.x,p.y,p.z);f.netYaw=p.yaw;f.pitch=p.pitch;f.crouch=p.crouch;f.netSpeed=p.speed;
      const weapon=Ih[p.weapon]?p.weapon:`pickaxe`;if(weapon!==f.netWeapon){f.netWeapon=weapon;f.slots.fill(null);f.active=-1;if(weapon!==`pickaxe`){f.slots[0]={id:weapon,rarity:0,count:1};f.active=0;}f.heldKey=``;f.refreshHeld();}
      if(f.mode!==p.mode){f.mode=p.mode;f.setGlider(p.mode===`glide`);}
    }
  }
  updateOnlinePlayers(dt){if(!this.onlineActive||!this.onlinePlayers)return;for(const f of this.onlinePlayers.values()){if(!f.alive)continue;if(f.mode!==`bus`)f.pos.lerp(f.netTarget,1-Math.exp(-10*dt));f.yaw=f.netYaw;f.vel.set(Math.sin(f.yaw)*(f.netSpeed||0),0,Math.cos(f.yaw)*(f.netSpeed||0));}}
  applyOnlineAction(action,session){
    if(!this.onlineActive)return;const actor=this.onlinePlayers?.get(action.from);
    if(action.type===`chat`){this.hud.addChat(actor?.name||`PLAYER`,action.text,`#61dfff`);return;}
    if(action.type===`hit`){if(action.target===session.id&&this.player.alive){Jy(this.player,action.damage,actor||null,action.weapon||`Player`,false,this.player.pos.x,this.player.pos.y+1,this.player.pos.z);}return;}
    const s=action.spec;if(!s)return;const spec={...s,...Ix[s.mat]};this.onlineApplying=true;
    try{if(action.type===`build`)Fx.place(spec,false,actor,true);else if(action.type===`edit`){let old=Fx.pieceAt(action.oldKey);if(old&&!old.world)Fx.edit(old,s.shape,s.rot,s.mask);}else if(action.type===`destroy`){let old=Fx.pieceAt(action.oldKey);if(old&&!old.world)Fx.destroy(old,actor,false);}}
    finally{this.onlineApplying=false;}
  }
  playIslandFlip(){
    if(this.online?.session){this.online.openPanel();this.online.status(`Leave your match room before joining the live event.`);return;}
    if(this.eventOverlay)return;this.menus.stopPassPreview();X.unlock();X.enabled=false;
    this.eventOverlay=openLiveEvent({Character:NT,skins:xC,animationDefaults:MT,selectedSkin:Sf.s.skin,performanceMode:Sf.s.performanceMode,islandData:{geometry:this.terrain.mesh.geometry,texture:this.terrain.albedo,footprints:this.plan.footprints,sites:chapter4Sites,height:ay,scenery:makeEventScenery(this)},onClose:()=>{this.eventOverlay=null;this.last=performance.now();}});
  }
  openMatchPreparation() {
    if(this.online?.session){this.online.openPanel();this.online.status(`Leave your online room to play a bot match.`);return;}
    if(this.prepEl)return;
    this.menus.buildQuests();const size=teamPreviewSize(Sf.s.gameMode,Sf.s.botCount);this.preparedSquad=Array.from({length:size-1},(_,i)=>`SQUAD BOT ${i+1}`);
    const overlay=document.createElement(`div`);overlay.className=`match-prep`;overlay.setAttribute(`role`,`dialog`);overlay.setAttribute(`aria-modal`,`true`);overlay.setAttribute(`aria-label`,`Match preparation`);this.prepEl=overlay;
    overlay.innerHTML=`<div class="prep-card"><div class="prep-top"><div><span class="prep-kicker">CHAPTER 4 • A NEW BEGINNING</span><h1>MATCH PREPARATION</h1><p>Plan your drop before the battle bus launches.</p></div><button class="prep-close" aria-label="Back to lobby">×</button></div><div class="prep-columns"><section><h2>YOUR MATCH</h2><div class="prep-mode"></div><h3>SQUAD</h3><ul class="prep-squad"></ul><h3>DAILY QUESTS</h3><ul class="prep-quests"></ul><h3>FIRST STORM ANOMALY</h3><div class="prep-anomaly">⚡ LIGHTNING <small>Later anomalies rotate through ice and low gravity.</small></div></section><section><h2>FAVORITE LANDING SPOT</h2><p>A gold marker will appear on your map each match.</p><label for="drop-choice">Choose a named location</label><select id="drop-choice"></select><canvas class="prep-map" width="420" height="420" aria-label="Island landing spot preview"></canvas><p class="prep-story"><b>THE FRACTURE:</b> The old island fractured and flipped. Explore a new island of castles, autumn forests and snow while the rift continues to unfold.</p></section></div><div class="prep-actions"><button class="prep-back">BACK</button><button class="prep-launch">LAUNCH MATCH →</button></div></div>`;
    document.getElementById(`ui`).appendChild(overlay);overlay.querySelector(`.prep-mode`).textContent=`${String(Sf.s.gameMode).toUpperCase()} • ${Math.min(Sf.s.performanceMode ? 24 : 99,Math.round(Sf.s.botCount))+1} PLAYERS • ${String(Sf.s.difficulty).toUpperCase()}`;
    const squad=overlay.querySelector(`.prep-squad`);for(const name of [`YOU`,...this.preparedSquad]){const li=document.createElement(`li`);li.textContent=name+(name===`YOU`?``:` • ALLIED BOT`);squad.appendChild(li);}
    const quests=overlay.querySelector(`.prep-quests`);for(const q of Sf.s.quests.list||[]){const li=document.createElement(`li`);li.textContent=`${q.text} — ${Math.min(Sf.s.stats[q.stat]||0,q.target)}/${q.target}`;quests.appendChild(li);}
    const select=overlay.querySelector(`select`);const empty=document.createElement(`option`);empty.value=``;empty.textContent=`No favorite`;select.appendChild(empty);for(const site of qv){const option=document.createElement(`option`);option.value=site.id;option.textContent=site.name;select.appendChild(option);}select.value=Jv(Sf.s.favoriteDrop)?Sf.s.favoriteDrop:``;
    const cv=overlay.querySelector(`canvas`),ctx=cv.getContext(`2d`),draw=()=>{ctx.fillStyle=`#153e53`;ctx.fillRect(0,0,420,420);if(this.hud.base)ctx.drawImage(this.hud.base,0,0,420,420);for(const p of qv){const x=(p.x+400)/800*420,y=(p.z+400)/800*420;ctx.beginPath();ctx.arc(x,y,p.id===select.value?7:3,0,Math.PI*2);ctx.fillStyle=p.id===select.value?`#ffe838`:`#b9d4d9`;ctx.fill();ctx.strokeStyle=`#082535`;ctx.stroke();}};select.addEventListener(`change`,()=>{Sf.set(`favoriteDrop`,select.value);draw();});draw();
    const close=()=>{overlay.remove();this.prepEl=null;};overlay.addEventListener(`keydown`,e=>{if(e.key===`Escape`){e.preventDefault();close();}});overlay.querySelector(`.prep-close`).onclick=close;overlay.querySelector(`.prep-back`).onclick=close;overlay.querySelector(`.prep-launch`).onclick=()=>{Sf.set(`favoriteDrop`,select.value);close();this.menus.showLoading(`JOINING MATCH...`,.15);setTimeout(()=>{this.menus.showLoading(`SPAWNING PLAYERS...`,.55);setTimeout(()=>this.startMatch(),380);},380);};overlay.querySelector(`.prep-launch`).focus();
  }
  issueSquadOrder(kind){
    if(!this.teammates?.some(f=>f.alive&&!f.downed)){this.hud.banner(`SQUAD COMMAND`,`No active allied bots`,1500);return;}
    const down=this.teammates.find(f=>f.alive&&f.downed);if(kind===`revive`&&!down){this.hud.banner(`SQUAD COMMAND`,`No teammate needs reviving`,1500);return;}
    if(kind!==`revive`&&!this.lastPing){this.hud.banner(`SQUAD COMMAND`,`Press K to mark a location first`,1500);return;}
    this.squadOrder={kind,x:down&&kind===`revive`?down.pos.x:this.lastPing?.x,z:down&&kind===`revive`?down.pos.z:this.lastPing?.z,until:G.time+45};
    for(const bot of this.bots)if(bot.f.isTeammate&&!bot.f.downed)bot.thinkT=0;
    const name=kind===`move`?`MOVE HERE`:kind===`watch`?`WATCH THIS AREA`:`REVIVE TEAMMATE`;this.hud.banner(`SQUAD: ${name}`,`Allied bots acknowledged • 45 seconds`,2000,`good`);this.hud.addChat(`SQUAD`,`${name} — on our way!`,`#61dfff`);
  }
  removeScoutDrone(destroyed=false){const u=this.islandUpgrade,d=u?.drone;if(!d)return;d.alive=false;if(d.collider)Ey(d.collider);d.mesh.removeFromParent();d.mesh.geometry.dispose();d.mesh.material.dispose();u.drone=null;if(destroyed)this.hud.banner(`SCOUT DRONE DESTROYED`,`Enemy fire disabled your scout`,1800);}
  updateLobbyTheme(skin) {
    const shade=document.querySelector(`.lobby-shade`);if(!shade)return;
    let hash=0;for(const ch of String(skin||`ranger`))hash=(hash*31+ch.charCodeAt(0))>>>0;
    const colors=[`22,100,140`,`116,66,155`,`34,119,92`,`155,92,37`,`53,80,155`];
    shade.style.background=`radial-gradient(ellipse at 50% 40%, rgba(${colors[hash%colors.length]},.12), rgba(${colors[hash%colors.length]},.6)), linear-gradient(0deg, rgba(5,20,40,.6), transparent 65%)`;
  }
  clearIslandUpgrade() {
    const u=this.islandUpgrade;if(!u)return;
    if(this.pc)this.pc.inVehicle=false;
    if(u.drone?.collider)Ey(u.drone.collider);for(const tank of u.tanks||[])if(tank.collider?.keys.length)Ey(tank.collider);
    u.group.removeFromParent();u.group.traverse(o=>{if(o.isMesh){o.geometry.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();}});
    u.clueTexture?.dispose();for(const t of u.chapterTextures||[])t.dispose();u.panel.remove();u.commandHint?.remove();this.islandUpgrade=null;
  }
  setupIslandUpgrade() {
    const group=new Pn();this.scene.add(group);
    const panel=document.createElement(`div`);panel.className=`island-upgrade-hud`;document.getElementById(`ui`).appendChild(panel);
    const commandHint=document.createElement(`div`);commandHint.className=`squad-command-hint`;commandHint.textContent=Sf.s.gameMode===`solo`?``:`K PING  •  7 MOVE  •  8 WATCH  •  9 REVIVE`;document.getElementById(`ui`).appendChild(commandHint);
    const u=this.islandUpgrade={group,panel,commandHint,vehicles:[],activeVehicle:null,ability:null,abilityCd:0,hazardT:0,hazard:null,hazardIndex:-1,story:0,storyT:0,train:null,drone:null,tanks:[],conveyors:[],chapterStage:0};
    const box=(parent,w,h,d,color,x,y,z)=>{const m=new Mi(new La(w,h,d),new Os({color,roughness:.6,metalness:.25}));m.position.set(x,y,z);parent.add(m);return m;};
    const makeVehicle=(type,x,z)=>{const root=new Pn(), y=Math.max(ay(x,z),type===`boat`?0:-100);root.position.set(x,y,z);group.add(root);
      const body=box(root,type===`bike`?1:2.3,.65,type===`bike`?2.7:4.2,type===`boat`?0x329bba:0xd65343,0,.9,0);
      if(type===`car`)box(root,1.8,.75,1.9,0x84c3d4,0,1.55,-.2);
      if(type===`bike`)box(root,.35,.7,1.2,0x262b36,0,1.4,0);
      if(type!==`boat`)for(const dx of type===`bike`?[0]:[-1.1,1.1])for(const dz of [-1.25,1.25])box(root,.5,.65,.65,0x19222a,dx,.42,dz);
      else box(root,1.5,.45,1.1,0x415364,0,1.35,-.3);
      u.vehicles.push({type,root,body,hp:180,fuel:100,color:0,speed:0});};
    makeVehicle(`car`,178,45);makeVehicle(`bike`,210,-120);const iron=Jv(`ironworks`);makeVehicle(`car`,iron.x+20,iron.z+18);makeVehicle(`bike`,iron.x+24,iron.z+13);
    // Place the boat on water within reach of a shoreline, rather than on dry land.
    let coast=null,best=Infinity;for(let x=-360;x<=360;x+=4)for(let z=-360;z<=360;z+=4){if(ay(x,z)>=0)continue;if(![[4,0],[-4,0],[0,4],[0,-4]].some(([dx,dz])=>ay(x+dx,z+dz)>0))continue;const d=(x-92)**2+(z-165)**2;if(d<best){best=d;coast=[x,z];}}makeVehicle(`boat`,...(coast||[350,350]));
    const train=new Pn();group.add(train);box(train,5,1,24,0x333e48,0,.5,0);for(let z=-8;z<=8;z+=8){box(train,4.5,2,7.5,z===0?0x7e6541:0x586e83,0,2,z);box(train,3.2,.5,2.4,0xd3a638,0,3.25,z===0?0: z);}
    const hazardRing=new Mi(new hs(23,25,64).rotateX(-Math.PI/2),new bi({color:0x9ddfff,transparent:true,opacity:.48,depthWrite:false,side:2}));hazardRing.visible=false;group.add(hazardRing);u.hazardRing=hazardRing;
    const clueCanvas=document.createElement(`canvas`);clueCanvas.width=512;clueCanvas.height=160;const cx=clueCanvas.getContext(`2d`);cx.fillStyle=`#122c3e`;cx.fillRect(0,0,512,160);cx.strokeStyle=`#e9c64d`;cx.lineWidth=8;cx.strokeRect(4,4,504,152);cx.fillStyle=`#fff4c6`;cx.textAlign=`center`;cx.font=`bold 34px sans-serif`;cx.fillText(`FRACTURE FILE 01`,256,54);cx.font=`24px sans-serif`;cx.fillText(`FOLLOW THE MOVING VAULT`,256,100);cx.fillText(`THE STORM IS CHANGING`,256,136);const clueTex=new Na(clueCanvas);clueTex.needsUpdate=true;const clue=new Mi(new ms(5,1.56),new bi({map:clueTex,side:2}));clue.position.set(176,ay(176,35)+3,35);group.add(clue);u.clueTexture=clueTex;
    // Match-specific props: vulnerable fuel tanks, animated factory machinery and Observatory hardware.
    for(let k=0;k<2;k++){const x=iron.x-19+k*5,z=iron.z+18,y=iron.y;const mesh=new Mi(new Ba(1,1,2.8,12),new Os({color:0xd94d31,metalness:.5}));mesh.position.set(x,y+1.4,z);group.add(mesh);
      const tank={alive:true,mat:`metal`,hp:80,mesh,damage(d,attacker){if(!this.alive)return;this.hp-=d;if(this.hp<=0){this.alive=false;Ey(this.collider);this.mesh.visible=false;ob(x,y+1,z,7,65,attacker,`fuel tank`);}}};tank.collider=Ty(wy(x,z,1,y,y+2.8,tank));u.tanks.push(tank);}
    for(let k=0;k<4;k++){const belt=box(group,1,.3,2,0xe8b641,iron.x-12+k*4,iron.y+.22,iron.z+9);u.conveyors.push(belt);}
    const obs=Jv(`observatory`), dome=new Mi(new gs(5.3,24,12,0,Math.PI*2,0,Math.PI/2),new Os({color:0x86c8e3,transparent:true,opacity:.48,metalness:.35,roughness:.25,side:2,depthWrite:false}));dome.position.set(obs.x-5,obs.y+8.2,obs.z-2.5);group.add(dome);
    const telescope=box(group,1.2,1.2,6,0xd1dbe2,obs.x-5,obs.y+10.7,obs.z-2.5);telescope.rotation.x=-.35;u.telescope=telescope;
    const gravityRing=new Mi(new hs(20,22,64).rotateX(-Math.PI/2),new bi({color:0xc078ff,transparent:true,opacity:.6,depthWrite:false,side:2}));gravityRing.position.set(obs.x,obs.y+.1,obs.z);gravityRing.visible=false;group.add(gravityRing);u.gravityRing=gravityRing;
    // Roof glazing and parking-garage rubble at the Overgrown Mall.
    const mall=Jv(`mall`);for(let k=0;k<3;k++){const glass=new Mi(new La(3.8,.16,5),new Os({color:0x9ce9df,metalness:.2,transparent:true,opacity:.5}));glass.position.set(mall.x-14+k*6,mall.y+8.15,mall.z-4);group.add(glass);}for(let k=0;k<4;k++){const rubble=box(group,4,.6,2,0x707977,mall.x+13+k*2,mall.y+.5,mall.z+20-k);rubble.rotation.z=(k-1)*.14;}
    const storyDefs=[{site:mall,dx:-20,dz:20,title:`FRACTURE FILE 01`,text:`THE MALL SIGNAL MATCHES THE TRAIN VAULT`},{site:obs,dx:14,dz:15,title:`FRACTURE FILE 02`,text:`THE OBSERVATORY EXPERIMENT IS UNSTABLE`},{site:iron,dx:6,dz:19,title:`FRACTURE FILE 03`,text:`IRONWORKS IS BUILDING A STABILIZER`}];u.storyClues=[];u.chapterTextures=[];
    for(const def of storyDefs){const cv=document.createElement(`canvas`);cv.width=512;cv.height=160;const c=cv.getContext(`2d`);c.fillStyle=`#152a3e`;c.fillRect(0,0,512,160);c.strokeStyle=`#bb81ff`;c.lineWidth=8;c.strokeRect(4,4,504,152);c.textAlign=`center`;c.fillStyle=`#f9e989`;c.font=`bold 32px sans-serif`;c.fillText(def.title,256,55);c.fillStyle=`#d2efff`;c.font=`bold 20px sans-serif`;c.fillText(def.text,256,104,480);const tex=new Na(cv);tex.needsUpdate=true;u.chapterTextures.push(tex);const sign=new Mi(new ms(5,1.56),new bi({map:tex,side:2}));const x=def.site.x+def.dx,z=def.site.z+def.dz,y=ay(x,z);sign.position.set(x,y+2.7,z);group.add(sign);box(group,.18,2,.18,0x4a5b62,x,y+1,z);u.storyClues.push({x,y,z,title:def.title,text:def.text,seen:false});}
    const fracture=new Mi(new Va(2.3,7,6),new Os({color:0x995cff,emissive:0x3d125d,transparent:true,opacity:.85}));fracture.position.set(obs.x-5,obs.y+16,obs.z-2.5);fracture.visible=false;group.add(fracture);u.fracture=fracture;
    const stabilizer=box(group,3,5,3,0x48c5d6,iron.x+10,iron.y+2.5,iron.z+22);stabilizer.visible=false;u.stabilizer=stabilizer;
    const guardianBubble=new Mi(new gs(1.6,24,16),new bi({color:0x5ad9ff,transparent:true,opacity:.21,depthWrite:false,side:2}));guardianBubble.visible=false;group.add(guardianBubble);u.guardianBubble=guardianBubble;
    const stationVault=box(group,2,2,2,0xd6a939,obs.x-6,obs.y-3,obs.z);u.stationVault={mesh:stationVault,opened:false,x:obs.x-6,z:obs.z,y:obs.y-4};
    const vault=box(train,2.2,1.5,2.2,0xe5ba41,0,4,0);u.train={group:train,vault,x:190,z:0,y:0,angle:0,opened:false};
    this.hud.banner(`THE FRACTURE BEGINS`,`Storm anomalies detected • investigate the moving vault`,4000,`info`);
  }
  updateIslandUpgrade(dt) {
    const u=this.islandUpgrade,p=this.player;if(!u)return;
    u.abilityCd=Math.max(0,u.abilityCd-dt);u.guardianBubble.visible=p.alive&&p.guardianUntil>G.time;if(u.guardianBubble.visible)u.guardianBubble.position.set(p.pos.x,p.pos.y+1,p.pos.z);
    // Move the train before fighters step; carry anyone standing on its roof.
    const tr=u.train, old={x:tr.x,y:tr.y,z:tr.z}, a=G.time*.032;
    tr.x=Math.cos(a)*190;tr.z=Math.sin(a)*145;tr.y=Math.max(ay(tr.x,tr.z),0)+1;tr.angle=Math.atan2(-Math.sin(a)*190,Math.cos(a)*145);
    for(const f of G.fighters) if(f.alive && f.mode===`ground` && f.grounded){const dx=f.pos.x-old.x,dz=f.pos.z-old.z;const lx=dx*Math.cos(tr.prevAngle||0)-dz*Math.sin(tr.prevAngle||0),lz=dx*Math.sin(tr.prevAngle||0)+dz*Math.cos(tr.prevAngle||0);if(Math.abs(lx)<2.8&&Math.abs(lz)<11.5&&Math.abs(f.pos.y-(old.y+3))<.7){f.pos.x+=tr.x-old.x;f.pos.z+=tr.z-old.z;f.pos.y+=tr.y-old.y;}}
    tr.prevAngle=tr.angle;tr.group.position.set(tr.x,tr.y,tr.z);tr.group.rotation.y=tr.angle;
    // A single nearby teammate owns the interaction, taking priority over
    // vehicles, vaults, doors and pickups. Continuous hold required for 5s.
    const downed=(this.teammates||[]).filter(f=>f.alive&&f.downed);
    const near=f=>Math.hypot(p.pos.x-f.pos.x,p.pos.z-f.pos.z)<3 && Math.abs(p.pos.y-f.pos.y)<2;
    this.reviveTarget=p.alive&&p.mode===`ground`?downed.filter(near).sort((a,b)=>p.pos.distanceToSquared(a.pos)-p.pos.distanceToSquared(b.pos))[0]||null:null;
    for(const f of downed){
      f.bleed-=dt;
      const playerHelping=this.reviveTarget===f&&X.held(`KeyE`)&&(p.reviveCooldownUntil||0)<=G.time;
      const bot=(this.teammates||[]).find(m=>m!==f&&m.alive&&!m.downed&&m.mode===`ground`&&(m.reviveCooldownUntil||0)<=G.time&&m.pos.distanceTo(f.pos)<3);
      const rescuer=playerHelping?p:bot;
      f.reviveProgress=rescuer?(f.reviveProgress||0)+dt:0;
      if(f.reviveProgress>=5){f.downed=false;f.wasDowned=false;f.hp=35;f.crouch=false;f.heldKey=``;f.refreshHeld();f.reviveProgress=0;rescuer.reviveCooldownUntil=G.time+5;this.hud.banner(`TEAMMATE REVIVED`,`${f.name} • revive cooldown 5s`,1800,`good`);if(this.reviveTarget===f)this.reviveTarget=null;}
      else if(f.bleed<=0){f.downed=false;f.hp=0;if(this.reviveTarget===f)this.reviveTarget=null;this.eliminate(f,f.lastHurtBy,`bleed out`);}
    }
    if(this.reviveTarget&&X.hit(`KeyE`))X.pressed.delete(`KeyE`);
    u.conveyors.forEach((b,i)=>b.position.x=ironBeltX(i,G.time));u.telescope.rotation.y=G.time*.15;
    if(this.squadOrder && G.time>this.squadOrder.until)this.squadOrder=null;
    if(p.alive && p.mode===`ground` && X.hit(`Digit7`))this.issueSquadOrder(`move`);
    if(p.alive && p.mode===`ground` && X.hit(`Digit8`))this.issueSquadOrder(`watch`);
    if(p.alive && p.mode===`ground` && X.hit(`Digit9`))this.issueSquadOrder(`revive`);
    const obs=Jv(`observatory`), gravity=G.time>=90&&G.time<160;u.gravityRing.visible=gravity;
    if(gravity)for(const f of G.fighters)if(f.alive && f.mode===`ground` && !f.grounded && Math.hypot(f.pos.x-obs.x,f.pos.z-obs.z)<22 && Math.abs(f.pos.y-obs.y)<25)f.vel.y+=16*dt;
    const chapter=G.time<30?0:G.time<90?1:G.time<160?2:3;u.fracture.visible=chapter>=2;u.fracture.rotation.y=G.time*.5;u.stabilizer.visible=chapter>=3;
    if(chapter>u.chapterStage){u.chapterStage=chapter;const entries=[null,[`FRACTURE FILE 01`,`The Observatory detected a signal hidden in the train vault.`],[`FRACTURE FILE 02`,`The Observatory experiment ruptured: low gravity is active!`],[`FRACTURE FILE 03`,`Ironworks is building a stabilizer. The next signal points underground.`]];this.hud.banner(entries[chapter][0],entries[chapter][1],4500,`info`);}
    if(!p.alive||p.mode!==`ground`)return;
    if(X.hit(`KeyJ`)&&u.ability&&u.abilityCd<=0){
      u.abilityCd=22;
      if(u.ability===`sanctuary`){p.guardianUntil=G.time+6;this.hud.banner(`GUARDIAN SHIELD`,`Blocks weapon damage; movement slowed for 6 seconds`,1800,`good`);}
      else if(u.ability===`bugle`){p.vel.y=20;p.vel.x+=Math.sin(this.pc.yaw)*13;p.vel.z+=Math.cos(this.pc.yaw)*13;p.grounded=false;p.jumped=true;this.hud.banner(`SENTINEL LEAP`,`Launch!`,1400,`good`);}
      else {this.removeScoutDrone();const mesh=new Mi(new gs(.65,12,8),new Os({color:0x60e8ff,emissive:0x15566b}));u.group.add(mesh);const d=u.drone={mesh,ttl:18,hp:65,mat:`metal`,alive:true,scanned:[],botFire:1,damage(amount,attacker){if(!this.alive||attacker?.isTeammate)return;this.hp-=amount;am.spark(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z,0x7de9ff,6,2,.1,.3,0,1);if(this.hp<=0)window.__game.removeScoutDrone(true);}};d.collider=Ty(wy(p.pos.x+2,p.pos.z,.7,p.pos.y+2.3,p.pos.y+3.7,d,false));this.hud.banner(`COMMANDER SCOUT`,`Marks nearby enemies • enemies can shoot it down`,2300,`good`);}
    }
    if(u.drone){const d=u.drone;d.ttl-=dt;d.botFire-=dt;d.mesh.position.set(p.pos.x+Math.cos(G.time*2)*2,p.pos.y+3,p.pos.z+Math.sin(G.time*2)*2);Ey(d.collider);const x=d.mesh.position.x,y=d.mesh.position.y,z=d.mesh.position.z;d.collider=Ty(wy(x,z,.7,y-.7,y+.7,d,false));d.scanned=G.fighters.filter(f=>f.alive&&!f.isTeammate&&f.mode===`ground`&&f.pos.distanceTo(p.pos)<45);
      if(d.botFire<=0){d.botFire=2;const bot=d.scanned.find(f=>f.weapon&&f.fireCd<=0&&f.pos.distanceTo(d.mesh.position)<30);if(bot){const dx=x-bot.pos.x,dy=y-bot.eyeY,dz=z-bot.pos.z,len=Math.hypot(dx,dy,dz);const hit=jy();if(Ly(bot.pos.x,bot.eyeY,bot.pos.z,dx/len,dy/len,dz/len,len+1,hit,bot,true)&&hit.collider?.owner===d)$y(bot,bot.pos.x,bot.eyeY,bot.pos.z,dx/len,dy/len,dz/len,0);}}
      if(d.ttl<=0)this.removeScoutDrone();}

    let v=u.activeVehicle;
    if(X.hit(`KeyE`)){
      if(v){u.activeVehicle=null;this.pc.inVehicle=false;p.pos.x+=2;v=null;X.pressed.delete(`KeyE`);this.hud.banner(`VEHICLE`,`Exited`,900);}
      else if(u.storyClues.some(c=>Math.hypot(p.pos.x-c.x,p.pos.z-c.z)<3 && Math.abs(p.pos.y-c.y)<4)){const clue=u.storyClues.find(c=>Math.hypot(p.pos.x-c.x,p.pos.z-c.z)<3 && Math.abs(p.pos.y-c.y)<4);clue.seen=true;this.hud.banner(clue.title,clue.text,3500,`info`);X.pressed.delete(`KeyE`);}
      else if(!u.stationVault.opened && Math.hypot(p.pos.x-u.stationVault.x,p.pos.z-u.stationVault.z)<3 && Math.abs(p.pos.y-u.stationVault.y)<2){u.stationVault.opened=true;u.stationVault.mesh.material.color.setHex(0x56636b);Xx.spawn(`weapon`,`sniper`,5,1,p.pos.x+1,p.pos.y+1,p.pos.z,false);this.hud.banner(`OBSERVATORY VAULT`,`Mythic sniper recovered • anomaly data found`,2400,`good`);X.pressed.delete(`KeyE`);}
      else if(!this.teammates?.some(f=>f.downed&&f.pos.distanceTo(p.pos)<3) && !tr.opened && Math.hypot(p.pos.x-tr.x,p.pos.z-tr.z)<4 && Math.abs(p.pos.y-(tr.y+3))<3){tr.opened=true;tr.vault.material.color.setHex(0x5e6a71);Xx.spawn(`weapon`,`pulse`,5,Ih.pulse.mag,p.pos.x+1,p.pos.y+1,p.pos.z,false);Xx.spawn(`consumable`,`web`,5,20,p.pos.x-1,p.pos.y+1,p.pos.z,false);this.hud.banner(`MOVING VAULT OPEN`,`Mythic pulse rifle and web shooters`,3000,`good`);X.pressed.delete(`KeyE`);}
      else {v=u.vehicles.find(q=>q.hp>0&&Math.hypot(q.root.position.x-p.pos.x,q.root.position.z-p.pos.z)<4);if(v){u.activeVehicle=v;this.pc.inVehicle=true;X.pressed.delete(`KeyE`);this.hud.banner(v.type.toUpperCase(),`WASD drive • E exit • L repaint car`,2200,`info`);}}
    }
    if(u.activeVehicle && X.hit(`KeyL`) && u.activeVehicle.type===`car`){v=u.activeVehicle;v.color=(v.color+1)%4;v.body.material.color.setHex([0xd65343,0x46a7e8,0xf0c642,0x83d576][v.color]);}
    u.hazardT-=dt;if(u.hazardT<=0){u.hazardT=35;const angle=G.time*.08, radius=Math.min(385,Math.max(30,this.storm.r+18));u.hazard={kind:[`lightning`,`ice`,`low gravity`][++u.hazardIndex%3],angle,radius,ttl:35,cool:0};this.hud.banner(`STORM ANOMALY`,`${u.hazard.kind.toUpperCase()} moving through the storm`,2200,`info`);}
    const h=u.hazard;if(h){h.angle+=dt*.08;h.x=Cp(this.storm.x+Math.cos(h.angle)*h.radius,-390,390);h.z=Cp(this.storm.z+Math.sin(h.angle)*h.radius,-390,390);h.cool-=dt;u.hazardRing.position.set(h.x,ay(h.x,h.z)+.3,h.z);u.hazardRing.visible=this.storm.isOutside(h.x,h.z);u.hazardRing.material.color.setHex(h.kind===`lightning`?0xffdc6b:h.kind===`ice`?0x95eaff:0xb683ff);if(this.storm.isOutside(p.pos.x,p.pos.z)&&Math.hypot(p.pos.x-h.x,p.pos.z-h.z)<25){if(h.kind===`low gravity`&&!p.grounded)p.vel.y+=16*dt;if(h.kind===`ice`){p.vel.x*=1+dt*.35;p.vel.z*=1+dt*.35;}if(h.kind===`lightning`&&h.cool<=0){h.cool=4;Jy(p,12,null,`storm`,false,p.pos.x,p.pos.y+1,p.pos.z);am.beam(p.pos.x,p.pos.y,p.pos.z);this.hud.banner(`LIGHTNING STRIKE`,`Leave the storm anomaly!`,1000);}}}

    const nearRide=u.vehicles.find(q=>q.hp>0&&Math.hypot(q.root.position.x-p.pos.x,q.root.position.z-p.pos.z)<4);
    const rideHint=!u.activeVehicle&&nearRide?`E ENTER ${nearRide.type.toUpperCase()}   •   `:``;
    const vaultHint=!tr.opened&&Math.hypot(p.pos.x-tr.x,p.pos.z-tr.z)<4&&Math.abs(p.pos.y-(tr.y+3))<3?`E OPEN MOVING VAULT   •   `:``;
    const clueHint=u.storyClues.some(c=>Math.hypot(p.pos.x-c.x,p.pos.z-c.z)<3&&Math.abs(p.pos.y-c.y)<4)?`E READ FRACTURE FILE   •   `:``;
    const stationHint=!u.stationVault.opened&&Math.hypot(p.pos.x-u.stationVault.x,p.pos.z-u.stationVault.z)<3&&Math.abs(p.pos.y-u.stationVault.y)<2?`E OPEN OBSERVATORY VAULT   •   `:``;
    u.panel.textContent=rideHint+vaultHint+stationHint+clueHint+(u.activeVehicle?`${u.activeVehicle.type.toUpperCase()}  FUEL ${Math.max(0,Math.ceil(u.activeVehicle.fuel))}%  HP ${Math.max(0,Math.ceil(u.activeVehicle.hp))}  •  E EXIT  •  L PAINT`:`TRAIN VAULT: ${tr.opened?`OPEN`:`MOVING`}   •   ${u.ability?`J: ${u.ability===`sanctuary`?`GUARDIAN SHIELD`:u.ability===`bugle`?`SENTINEL LEAP`:`COMMANDER DRONE`} ${u.abilityCd>0?Math.ceil(u.abilityCd)+`s`:`READY`}`:`DEFEAT A BOSS FOR A MYTHIC ABILITY`}`);
  }
  finishVehicleStep(dt) {
    const u=this.islandUpgrade,v=u?.activeVehicle,p=this.player;if(!v)return;
    const moving=Math.hypot(p.wishX,p.wishZ)>.1&&v.fuel>0;
    if(moving)v.fuel=Math.max(0,v.fuel-dt*1.25);
    if(p.blockedBy&&moving){v.hp-=dt*16;p.vel.x*=.7;p.vel.z*=.7;}
    if(v.fuel<=0){p.vel.x*=.88;p.vel.z*=.88;this.pc.inVehicle=false;}else this.pc.inVehicle=true;
    if(v.type===`boat` && ay(p.pos.x,p.pos.z)<0 && p.pos.y<0){p.pos.y=0;p.vel.y=0;p.grounded=true;}
    v.root.position.copy(p.pos);v.root.rotation.y=this.pc.yaw;
    if(v.hp<=0){u.activeVehicle=null;this.pc.inVehicle=false;v.root.visible=false;am.spark(p.pos.x,p.pos.y+1,p.pos.z,0xffaa22,25,5,.2,.6,2,3);Jy(p,20,null,`vehicle`,false,p.pos.x,p.pos.y+1,p.pos.z);this.hud.banner(`VEHICLE DESTROYED`,`Find another ride`,1800);}
  }
  setupPoiSigns() {
    if(this.poiSigns) return;
    const group=this.poiSigns=new Pn();
    for(const site of qv) {
      const canvas=document.createElement(`canvas`);canvas.width=512;canvas.height=128;
      const ctx=canvas.getContext(`2d`);ctx.fillStyle=`#213b4b`;ctx.fillRect(0,0,512,128);
      ctx.strokeStyle=`#d3bd7d`;ctx.lineWidth=9;ctx.strokeRect(5,5,502,118);
      ctx.fillStyle=`#fff4d7`;ctx.textAlign=`center`;ctx.font=`bold 33px sans-serif`;ctx.fillText(site.name,256,58,470);
      ctx.font=`19px sans-serif`;ctx.fillStyle=`#8adfe4`;ctx.fillText(`CHAPTER 4  •  ISLAND DISTRICT`,256,98);
      const tex=new Na(canvas);tex.colorSpace=He;tex.needsUpdate=true;
      const sign=new Mi(new ms(5,1.25),new bi({map:tex,side:2}));
      sign.position.set(site.x,ay(site.x,site.z+site.r*.68)+3,site.z+site.r*.68);group.add(sign);
      const post=new Mi(new La(.18,2.5,.18),new Os({color:0x5e4a36}));post.position.set(sign.position.x,sign.position.y-1.8,sign.position.z);group.add(post);
    }
    this.scene.add(group);
  }
  setupPoiDoors() {
    if(this.poiDoors) for(const d of this.poiDoors){if(!d.open) Ey(d.collider);d.root.removeFromParent();d.root.traverse(x=>{if(x.isMesh){x.geometry.dispose();x.material.dispose()}});}
    this.poiDoors=[];
    for(const target of [...qv.map(site=>({site,vault:false})),{site:Jv(`covert`),vault:true}]) {
      const {site,vault}=target; let piece=null, best=1e9;
      for(const p of Fx.pieces.values()) if(p.world && p.spec.shape===`wallDoor`) {
        if(vault) {
          if(p.spec.gx===site.x/5-2 && p.spec.gz===site.z/5-2 && Math.abs(p.spec.gy*4-(site.y+4))<.01) {piece=p;break;}
        } else if(p.spec.gy*4<=site.y+1) {
          const dist=(p.cx-site.x)**2+(p.cz-site.z)**2;
          if(dist<site.r**2 && dist<best){best=dist;piece=p;}
        }
      }
      if(!piece) continue;
      const root=new Pn();root.matrixAutoUpdate=false;root.matrix.copy(piece.base);root.matrixWorldNeedsUpdate=true;
      const hinge=new Pn();hinge.position.set(-.76,0,0);root.add(hinge);
      const panel=new Mi(new La(1.5,2.5,.13),new Os({color:site.id===`covert`?0x52666a:0x806247,roughness:.8}));panel.position.set(.76,1.25,0);hinge.add(panel);
      const handle=new Mi(new gs(.055,8,6),new Os({color:0xf0c66f,metalness:.7,roughness:.3}));handle.position.set(1.3,1.2,.1);hinge.add(handle);
      const center=new R().setFromMatrixPosition(piece.base), vertical=piece.spec.rot&1;
      const col=xy(center.x-(vertical?.12:.75),center.y,center.z-(vertical?.75:.12),center.x+(vertical?.12:.75),center.y+2.5,center.z+(vertical?.75:.12),piece);
      Ty(col); Fx.group.add(root);this.poiDoors.push({root,hinge,center,collider:col,piece,open:false,site:site.id,vault,lockedBy:null});
    }
    G.doors=this.poiDoors;
  }
  seedPoiLoot() {
    const themed={bugle:[`burst`,3],logjam:[`pump`,3],covert:[`pulse`,4],sanctuary:[`sky`,4],tilted:[`ar`,3],speedway:[`smg`,2]};
    for(const site of qv) {
      const [gun,rarity]=themed[site.id]||[`ar`,2], x=site.x+site.r*.4,z=site.z+site.r*.35;
      Xx.spawn(`weapon`,gun,rarity,Ih[gun].mag,x,ay(x,z)+.12,z,false);
    }
  }
  configureBosses(teamSize) {
    const defs=[{id:`covert`,name:`CITADEL COMMANDER`,gun:`pulse`},{id:`sanctuary`,name:`ANVIL GUARDIAN`,gun:`sky`},{id:`bugle`,name:`BASTION SENTINEL`,gun:`burst`}];
    this.bossControllers=[];this.bossDrones=[];this.bossWalls=[];this.bossEffects=new Pn();this.scene.add(this.bossEffects);
    const active=this.bots.filter((b,i)=>b.f.alive && i>=teamSize-1).slice(-defs.length);
    active.forEach((bot,i)=>{
      const def=defs[i], site=Jv(def.id), f=bot.f;
      f.boss={...def,site,phase:1,patrolT:0}; f.name=def.name; f.hp=320;f.shield=100;
      f.mode=`ground`;f.visible=true;f.char.root.visible=true;f.grounded=true;
      const x=site.x+site.r*.65,z=site.z+site.r*.2;f.pos.set(x,ay(x,z)+.1,z);f.vel.set(0,0,0);
      f.slots.fill(null);f.give(def.gun,5,Ih[def.gun].mag);f.ammo[Ih[def.gun].ammo]=999;f.select(0);
      bot.wasAir=false;bot.arch=`aggro`;bot.P=Qx.aggro;bot.skill=1.2;bot.state=`roam`;bot.setGoal(site.x+10,site.z+8);
      this.bossControllers.push(bot);
    });
    const vault=(this.poiDoors||[]).find(d=>d.vault), guardian=this.bossControllers.find(b=>b.f.boss?.id===`covert`);
    if(vault) vault.lockedBy=guardian?.f||null;
    this.poiEventT=0;this.poiEventNo=0;
  }
  updatePoiEvents(dt) {
    for(const wall of this.bossWalls||[]){wall.ttl-=dt;if((wall.ttl<=0||!wall.boss.alive)&&wall.p.alive)Fx.destroy(wall.p,null,false);}
    this.bossWalls=(this.bossWalls||[]).filter(w=>w.ttl>0&&w.boss.alive&&w.p.alive);
    for(const drone of this.bossDrones||[]){
      if(!drone.boss.alive){drone.mesh.visible=false;continue;}
      drone.t+=dt;const f=drone.boss;drone.mesh.position.set(f.pos.x+Math.cos(drone.t*2+drone.side)*3,f.pos.y+3.2,f.pos.z+Math.sin(drone.t*2+drone.side)*3);
      drone.cool-=dt;
      if(drone.cool<=0 && this.player.alive && this.player.pos.distanceTo(f.pos)<40){drone.cool=3.5;const p=this.player;Jy(p,8,f,`pulse`,false,p.pos.x,p.pos.y+1,p.pos.z);am.spark(p.pos.x,p.pos.y+1,p.pos.z,0x51d9ff,6,2,.12,.3,0,1);}
    }
    for(const d of this.poiDoors||[]) if(!d.piece.alive && !d.open){Ey(d.collider);d.open=true;d.root.visible=false;}
    for(const bot of this.bossControllers||[]) {
      const f=bot.f, b=f.boss;if(!f.alive||!b) continue;
      if(!b.announced && this.player.alive && this.player.mode===`ground` && this.player.pos.distanceTo(f.pos)<60) {
        b.announced=true;this.hud.banner(`BOSS NEARBY`,`${b.name} patrols this location`,2500,`info`);
      }
      b.abilityT=(b.abilityT||0)-dt;
      if(b.abilityT<=0 && this.player.alive && this.player.pos.distanceTo(f.pos)<45){
        b.abilityT=9;
        if(b.id===`sanctuary`){
          const gx=Math.round((f.pos.x+this.player.pos.x)/10),gz=Math.round((f.pos.z+this.player.pos.z)/10),gy=Math.round(f.pos.y/4);
          const piece=Fx.place({shape:`wall`,gx,gy,gz,rot:Math.abs(this.player.pos.x-f.pos.x)>Math.abs(this.player.pos.z-f.pos.z)?1:0,mat:`metal`,...Ix.metal},false,f,true);
          if(piece){piece.grounded=true;this.bossWalls.push({p:piece,boss:f,ttl:7});this.hud.banner(`GUARDIAN SHIELD WALL`,`Break the temporary barrier`,1600,`info`);}
        } else if(b.id===`covert` && !b.drones){
          b.drones=true;for(let side=0;side<2;side++){const mesh=new Mi(new gs(.45,12,8),new Os({color:0x54dfff,emissive:0x145c80,metalness:.6}));this.bossEffects.add(mesh);this.bossDrones.push({mesh,boss:f,side:side*Math.PI,t:0,cool:1+side});}
          this.hud.banner(`SECURITY DRONES`,`Commander drones are firing`,1800,`info`);
        } else if(b.id===`bugle` && f.grounded){
          const dir=this.player.pos.clone().sub(f.pos);dir.y=0;if(dir.length()>1)dir.normalize();f.vel.addScaledVector(dir,12);f.vel.y=17;f.grounded=false;f.jumped=true;
          this.hud.banner(`SENTINEL REPOSITIONING`,`Watch the rooftops`,1500,`info`);
        }
      }
      if(b.phase===1 && f.hp<=160) {
        b.phase=2;
        // Open one nearby destructible world wall as the encounter changes phase.
        let route=null,best=25*25;for(const p of Fx.pieces.values()) if(p.world&&[`wall`,`wallDoor`,`wallWin`].includes(p.spec.shape)){
          const d=(p.cx-f.pos.x)**2+(p.cz-f.pos.z)**2;if(d<best && Math.abs(p.cy-f.pos.y)<5){route=p;best=d;}
        }
        if(route)Fx.damage(route,route.hp+1,f,true);
        f.shield=Math.max(f.shield,50);bot.skill=1.65;bot.buildCd=0;
        if(this.player.pos.distanceTo(f.pos)<100) this.hud.banner(b.name,`ENRAGED — shields restored`,1800,`info`);
        am.spark(f.pos.x,f.pos.y+1,f.pos.z,0xffc451,18,3,.15,.5,1,2);W.play(`shield_up`,{x:f.pos.x,y:f.pos.y,z:f.pos.z,volume:.6});
      }
      b.patrolT-=dt;
      if(b.patrolT<=0 && bot.state!==`fight` && bot.state!==`storm`) {
        b.patrolT=7;const angle=(G.time*.3+f.id)%6.28;
        bot.setGoal(b.site.x+Math.cos(angle)*20,b.site.z+Math.sin(angle)*20);
      }
    }
    this.poiEventT+=dt;
    if(this.poiEventT>100) {
      this.poiEventT=0;
      const choices=qv.filter(p=>!this.storm.isOutside(p.x,p.z));
      if(!choices.length) return;
      const site=choices[this.poiEventNo++%choices.length], x=site.x+site.r*.5,z=site.z;
      Xx.addBox(`chest`,{x,y:ay(x,z)+.08,z,rot:0});
      // If the road is empty, deliver a destructible container roadblock too.
      const bx=x+6, by=ay(bx,z), nearby=[];
      By(bx-1.3,by+.1,z-3.1,bx+1.3,by+2.5,z+3.1,nearby);
      const clear=nearby.length===0 && G.fighters.every(f=>!f.alive || Math.hypot(f.pos.x-bx,f.pos.z-z)>10);
      if(clear) TA.add({id:`container`,variant:this.poiEventNo%4,x:bx,y:by,z,rot:0});
      this.hud.banner(`ISLAND EVENT`,`${site.name}: supply cache${clear?` and roadblock`:``} arrived`,4000,`good`);
      W.play(`supply_drop`,{volume:.6});
    }
  }
  startMatch() {
    this.clearIslandUpgrade(); this.clearBossEffects();
    W.init();
    this.menus.showLoading(`JOINING MATCH...`, 0.1);
    let e4 = Math.min(Sf.s.performanceMode ? 24 : 99,Math.round(Sf.s.botCount)) + 1;
    for (this.matchTotal = e4, Fx.reset(), TA.reset(), oA.reset(), Fb(), Xx.reset(this.plan.chests, this.plan.ammo, this.plan.llamas, this.plan.loot), this.storm.reset(); this.bots.length < e4 - 1; ) {
      let e5 = new ZT(``, false, Np(xC));
      this.fighterGroup.add(e5.char.root), this.bots.push(new bC(e5));
    }
    this.setupPoiSigns(); this.setupPoiDoors(); this.seedPoiLoot();
    let t2 = [this.player], n2 = /* @__PURE__ */ new Set();
    this.bots.forEach((r2, i2) => {
      let a2 = i2 < e4 - 1;
      if (r2.f.alive = a2, r2.f.visible = false, r2.f.char.root.visible = false, !a2) {
        r2.f.mode = `dead`;
        return;
      }
      r2.f.reset(), r2.f.downed=false, r2.f.wasDowned=false, r2.f.setTeammate(false), r2.f.boss=null, r2.reset();
      let o2 = ``;
      do
        o2 = Np(GA) + Np(KA) + (Math.random() < 0.4 ? String(Math.floor(K(1, 99))) : ``);
      while (n2.has(o2));
      if(i2 < teamPreviewSize(Sf.s.gameMode,Sf.s.botCount)-1 && this.preparedSquad?.[i2]) o2=this.preparedSquad[i2];
      n2.add(o2), r2.f.name = o2, t2.push(r2.f);
    }), this.player.reset(), this.pc.reset(), Object.assign(G, { fighters: t2, time: 0, phase: `play`, alive: t2.length });
    this.menus.showLoading(`LOADING MAP...`, 0.4);
    // Mythic supplies near Sanctuary
    Xx.spawn(`weapon`, `sniper`, 5, 1, 175, ay(175, 25) + 1, 33, false), Xx.spawn(`weapon`, `rpg`, 5, 1, 183, ay(175, 25) + 1, 27, false), Xx.spawn(`consumable`, `riftbeacon`, 4, 1, 169, ay(175, 25) + 1, 29, false);
    Xx.spawn(`consumable`, `web`, 5, 20, 215, ay(215,-135)+1, -135, false);
    Xx.spawn(`consumable`, `web`, 5, 20, 175, ay(175,20)+1, 20, false);
    // Event mode effects
    if (Sf.s.eventMode === `highmat`) {
      this.player.mats.wood = this.player.mats.stone = this.player.mats.metal = 999;
      for (let b of this.bots) b.f.mats.wood = b.f.mats.stone = b.f.mats.metal = 999;
    }
    if (Sf.s.eventMode === `sniper`) {
      // Give everyone a sniper at start
      let snip = { id: `sniper`, rarity: 3, count: 1 };
      this.player.slots[1] = snip;
      this.player.ammo.heavy = 30;
      for (let b of this.bots) { b.f.slots[1] = { id: `sniper`, rarity: 2, count: 1 }; b.f.ammo.heavy = 20; }
    }
    // Designate teammates based on game mode
    let teamSize = { solo: 1, duo: 2, trios: 3, squad: 4 }[Sf.s.gameMode] || 1;
    this.teammates = [], this.hazards = [], this.traps = [], this.replay = [], this.replayT = 0;
    this.recT = 0;
    this.player.guardianUntil=0; this.player.setTeammate(true);
    for (let i2 = 0; i2 < Math.min(teamSize - 1, this.bots.length); i2++) {
      let mate = this.bots[i2].f;
      mate.setTeammate(true);
      this.teammates.push(mate);
    }
    this.squadOrder=null;this.lastPing=null; this.configureBosses(teamSize); this.setupIslandUpgrade();
    let r = this.onlineActive?this.onlineRoomSeed*Math.PI*2:K(0,Math.PI*2), i = this.onlineActive?(this.onlineRoomSeed*137%1)*140-70:K(-70,70), a = this.onlineActive?(this.onlineRoomSeed*271%1)*140-70:K(-70,70), o = this.bus;
    o.dx = Math.cos(r), o.dz = Math.sin(r), o.ax = i - o.dx * 440, o.az = a - o.dz * 440, o.t = 0, o.dur = 20, o.active = true, o.model.visible = true, o.model.rotation.y = Math.atan2(o.dx, o.dz);
    for (let e5 of this.bots) e5.f.alive && (e5.dropT = this.DOORS + 0.3 + Math.random() ** 0.8 * (o.dur - this.DOORS - 1.2));
    this.menus.showLoading(`SPAWNING PLAYERS...`, 0.7);
    this.pc.yaw = Math.atan2(o.dx, o.dz), this.pc.pitch = -0.35, this.pc.orbitDist = 26, this.state = `match`, this.overT = -1, this.killer = null, this.resultShown = false, this.pauseOpen = false, this.cheatsOpen = false, this.timeScale = 1, this.closeInventory(false), this.menus.showLobby(false), this.menus.showResult(null), this.menus.showPause(false), this.menus.toggleCheats(false), this.hud.setVisible(true), this.hud.setSpectate(null), this.hud.setPrompt(null), this.hud.setUseProgress(null, 0), this.hud.banner(`BATTLE ROYALE`, `${e4} players \xB7 last one standing wins`, 3200, `good`), X.enabled = true, X.lock(), W.play(`bus_horn`, { volume: 0.7 }), this.hudT = 0, this.updateBus(0);
    this.menus.showLoading(`READY!`, 1);
    setTimeout(() => this.menus.showLoading(null), 600);
  }
  clearBossEffects() {
    if(this.bossEffects){this.bossEffects.removeFromParent();this.bossEffects.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});this.bossEffects=null;}
    this.bossDrones=[];this.bossWalls=[];
  }
  invData() {
    let e4 = this.player, t2 = [];
    for (let n2 = 0; n2 < 5; n2++) {
      let r = e4.slots[n2];
      if (!r) {
        t2.push(null);
        continue;
      }
      let i = this.icons.get(r.id) ?? ``;
      if (Uh(r.id)) {
        let n3 = Ih[r.id], a = Math.round(n3.damage * (1 + r.rarity * 0.05)), o = n3.thrown ? [[`Damage`, String(a)], [`Blast radius`, `${n3.falloffEnd} m`], [`Vs builds`, String(n3.structDamage)], [`Stack`, `${r.count} / ${n3.mag}`]] : [[`Damage`, n3.pellets > 1 ? `${a} x ${n3.pellets}` : String(a)], [`Fire rate`, `${n3.fireRate.toFixed(1)} / s`], [`Magazine`, `${r.count} / ${n3.mag}`], [`Reload`, `${n3.reload.toFixed(1)} s`], [`Headshot`, `x ${n3.headMult}`], [`Reserve`, String(Sf.cheats.infiniteAmmo ? 999 : e4.ammo[n3.ammo])]];
        t2.push({ icon: i, rarity: r.rarity, count: r.count, name: n3.name, kind: n3.thrown ? `Throwable` : `Weapon - ${Rh[n3.ammo]}`, stats: o });
      } else {
        let e5 = Lh[r.id], n3 = [];
        e5.heal && n3.push([`Health`, `+${e5.heal}`]), e5.shield && n3.push([`Shield`, `+${e5.shield}`]), n3.push([`Works up to`, String(e5.cap)], [`Use time`, `${e5.useTime.toFixed(1)} s`], [`Stack`, `${r.count} / ${e5.stack}`]), t2.push({ icon: i, rarity: r.rarity, count: r.count, name: e5.name, kind: e5.mobility ? `Mobility item` : e5.shield && !e5.heal ? `Shield item` : `Healing item`, stats: n3 });
      }
    }
    return { slots: t2, active: e4.buildMode ? -2 : e4.active, pickaxeIcon: this.icons.get(`pickaxe`) ?? ``, mats: e4.mats, ammo: e4.ammo, icon: (e5) => this.icons.get(e5) ?? `` };
  }
  openInventory() {
    let e4 = this.player;
    !this.invOpen && this.state === `match` && e4.alive && (this.invOpen = true, this.hud.toggleFullMap(false), e4.aiming = false, this.inv.open(this.invData()), X.allow = QA, X.unlock(), W.play(`ui_click`));
  }
  closeInventory(e4 = true) {
    this.invOpen && (this.invOpen = false, this.inv.close(), X.allow = null, e4 && this.state === `match` && !this.pauseOpen && !this.cheatsOpen && !this.resultShown && X.lock());
  }
  swapSlots(e4, t2) {
    let n2 = this.player, r = n2.slots[e4], i = n2.slots[t2];
    if (e4 === t2 || e4 < 0 || t2 < 0 || e4 > 4 || t2 > 4 || !r) return;
    let a = Uh(r.id) ? Ih[r.id].thrown ? Ih[r.id].mag : 0 : Lh[r.id].stack;
    if (i && i.id === r.id && a > 0 && i.count < a) {
      let o = Math.min(r.count, a - i.count);
      i.count += o, r.count -= o, r.count <= 0 && (n2.slots[e4] = null, n2.active === e4 && (n2.active = t2, n2.reloadT = 0, n2.useT = 0));
    } else n2.slots[e4] = i, n2.slots[t2] = r, n2.active === e4 ? n2.active = t2 : n2.active === t2 && (n2.active = e4);
    n2.refreshHeld(), W.play(`swap`, { volume: 0.6 }), this.hudT = 0, this.inv.update(this.invData());
  }
  dropFromInventory(e4) {
    let t2 = this.player;
    if (!t2.slots[e4]) return;
    let n2 = t2.active === e4;
    Xx.dropSlot(t2, e4), n2 && t2.select(-1), W.play(`drop`, { volume: 0.7 }), this.hudT = 0, this.inv.update(this.invData());
  }
  resume() {
    this.pauseOpen = false, this.cheatsOpen = false, this.menus.showPause(false), this.menus.toggleCheats(false), X.enabled = true, X.lock();
  }
  dropPlayer() {
    let e4 = this.bus, t2 = this.player;
    !e4.active || t2.mode !== `bus` || e4.t < this.DOORS || (t2.mode = `skydive`, t2.pos.set(e4.pos.x - e4.dx * 3, 182.5, e4.pos.z - e4.dz * 3), t2.vel.set(e4.dx * 44 * 0.5, -6, e4.dz * 44 * 0.5), t2.grounded = false, this.pc.pitch = -0.75, W.play(`bus_jump`));
  }
  updateBus(e4) {
    let t2 = this.bus;
    if (!t2.active) return;
    t2.t += e4;
    let n2 = t2.t * 44;
    t2.pos.set(t2.ax + t2.dx * n2, 185 + Math.sin(t2.t * 0.9) * 0.6, t2.az + t2.dz * n2), t2.model.position.copy(t2.pos);
    let r = t2.model.userData.balloon;
    r && (r.rotation.z = Math.sin(t2.t * 0.7) * 0.03);
    let i = this.player;
    for (let e5 of G.fighters) e5.mode === `bus` && e5.pos.copy(t2.pos);
    if (t2.t >= this.DOORS) {
      for (let e5 of this.bots) {
        let n3 = e5.f;
        n3.alive && n3.mode === `bus` && (t2.t >= e5.dropT || t2.t >= t2.dur - 0.6) && (n3.mode = `skydive`, n3.pos.set(t2.pos.x + K(-2, 2), 182.5, t2.pos.z + K(-2, 2)), n3.vel.set(t2.dx * 12, -8, t2.dz * 12), n3.yaw = Math.atan2(e5.dropX - n3.pos.x, e5.dropZ - n3.pos.z));
      }
      i.mode === `bus` && t2.t >= t2.dur - 0.6 && this.dropPlayer();
    }
    t2.t > t2.dur + 6 && (t2.active = false, t2.model.visible = false);
  }
  eliminate(e4, t2, n2) {
    if (!e4.alive) return;
    e4.alive = false, e4.mode = `dead`, e4.hp = 0, e4.placement = G.alive, G.alive--, t2 && t2 !== e4 || (t2 = e4.lastHurtBy && e4.lastHurtBy.alive && G.time - e4.lastHurtTime < 8 ? e4.lastHurtBy : null), t2 && t2.kills++, e4.marker && (e4.marker.visible = false);
    if(e4.boss) {
      if(t2?.isPlayer && this.islandUpgrade){this.islandUpgrade.ability=e4.boss.id;this.islandUpgrade.abilityCd=0;this.hud.banner(`MYTHIC ABILITY ACQUIRED`,`Press J to use ${e4.boss.id===`sanctuary`?`Guardian Shield`:e4.boss.id===`bugle`?`Sentinel Leap`:`Commander Drone`}`,3500,`good`);}
      Xx.addBox(`chest`,{x:e4.pos.x,y:e4.pos.y+.08,z:e4.pos.z,rot:0});
      if(t2?.isPlayer) this.hud.banner(`BOSS DEFEATED`,`${e4.boss.name} dropped a mythic weapon and cache`,3000,`good`);
    }
    let r = e4.isPlayer || (t2?.isPlayer ?? false);
    this.hud.killFeed(t2 ? t2.name : ``, e4.name, n2, r, this.skinColor(t2), this.skinColor(e4)), Xx.dropAll(e4), e4.setGlider(false), e4.visible || e4.isPlayer ? (am.beam(e4.pos.x, e4.pos.y, e4.pos.z), W.play(`death`, { x: e4.pos.x, y: e4.pos.y + 1, z: e4.pos.z }), e4.dissolve = 0) : e4.char.root.visible = false, t2?.isPlayer && (this.hud.elimPopup(e4.name, t2.kills), W.play(`elim`), this.killEffect(n2, e4), this.gainXp(Sf.s.bpLevel*100)), e4.isPlayer ? (this.killer = t2, this.overT = 1.6, this.state = `over`, Fx.showGhost(null, false), W.play(`defeat`), W.playStinger(`defeat`), W.stopMusic()) : G.fighters.every(f=>!f.alive||f===this.player||f.isTeammate) && this.player.alive && this.state === `match` && (this.player.placement = 1, this.overT = 3.6, this.state = `over`, this.timeScale = 0.35, this.hud.banner(`#1 VICTORY ROYALE`, `Last one standing!`, 3400, `good`), W.play(`victory`), W.playStinger(`victory`), W.stopMusic(), this.player.char.emote(2), am.confetti(this.player.pos.x, this.player.pos.y + 2.5, this.player.pos.z, 140), Fx.showGhost(null, false));
  }
  showResult() {
    let e4 = this.player;
    if(this.resultShown)return; if(e4.alive){Sf.set(`bbucks`,Sf.s.bbucks+100);this.menus.syncBBucks();}
    this.resultShown = true, X.unlock(), this.gainXp(e4.alive ? 150 : 40), this.menus.showResult({ victory: e4.alive, place: e4.alive ? 1 : Math.max(2, e4.placement), total: this.matchTotal, kills: e4.kills, timeSec: G.time, damage: Math.round(e4.damageDealt), accuracy: e4.shots > 0 ? e4.hits / e4.shots : 0, killer: this.killer ? this.killer.name : null, mats: e4.gathered, builds: e4.builds });
    // Update stats
    let s = Sf.s.stats;
    s.matches++;
    if (e4.alive) s.wins++;
    s.kills += e4.kills;
    s.damage += Math.round(e4.damageDealt);
    if (!e4.alive) s.deaths++; s.time=(s.time||0)+G.time;s.bestTime=Math.max(s.bestTime||0,G.time);
    Sf.set(`stats`, s);
    // Update ranked ELO
    if (Sf.s.ranked) {
      let place = e4.alive ? 1 : Math.max(2, e4.placement);
      let total = this.matchTotal;
      let placementScore = (total - place) / total; // 0-1
      let eloChange = Math.round(-20 + placementScore * 50 + e4.kills * 3);
      let newElo = Math.max(0, Sf.s.elo + eloChange);
      Sf.set(`elo`, newElo);
      Sf.set(`rankedMatches`, Sf.s.rankedMatches + 1);
    }
  }
  cheat(e4) {
    let t2 = this.player;
    if (this.state !== `match` || !t2.alive) return;
    let n2 = (e5, n3) => {
      let r = t2.slots.findIndex((e6) => !e6);
      r >= 0 && (t2.slots[r] = { id: e5, rarity: n3, count: Ih[e5].mag }), t2.ammo[Ih[e5].ammo] = 999;
    };
    switch (e4) {
      case `giveAll`:
        t2.slots.fill(null), n2(`ar`, 3), n2(`tac`, 3), n2(`burst`, 3), n2(`sniper`, 3), n2(`grenade`, 1), t2.select(0);
        break;
      case `giveMythic`:
        t2.slots.fill(null), n2(`ar`, 5), n2(`pump`, 5), n2(`sniper`, 5), n2(`rpg`, 5), t2.slots[4] = { id: `web`, rarity: 5, count: 80 }, t2.select(0);
        this.hud.banner(`MYTHIC LOADOUT`, `Mythic weapons + web shooters equipped`, 2000, `good`);
        break;
      case `giveWeb`: {
        let slot=t2.slots.findIndex(item=>item?.id===`web`);
        if(slot<0) slot=t2.slots.findIndex(item=>!item);
        if(slot<0) slot=4;
        t2.slots[slot]={id:`web`,rarity:5,count:80}; t2.select(slot);
        this.hud.banner(`WEB SHOOTERS`, `80 charges added`, 1500, `good`); break;
      }
      case `maxAmmo`:
        for(const kind of Object.keys(t2.ammo)) t2.ammo[kind]=999;
        this.hud.banner(`MAX AMMO`, `All reserves refilled`, 1200, `good`); break;
      case `maxMats`:
        t2.mats.wood = t2.mats.stone = t2.mats.metal = 999;
        break;
      case `fullHeal`:
        t2.hp = 100, t2.shield = 100, W.play(`shield_up`);
        break;
      case `killAll`:
        for (let e5 of [...G.fighters]) e5.alive && !e5.isPlayer && Jy(e5, 9999, t2, `Cheats`, false, e5.pos.x, e5.pos.y + 1, e5.pos.z);
        break;
      case `skipStorm`:
        this.storm.skip();
        break;
      case `tpZone`:
      case `tpPing`:
        t2.mode === `ground` && (t2.pos.set(this.storm.tx, Oy(this.storm.tx, this.storm.tz, 400) + 0.1, this.storm.tz), t2.vel.set(0, 0, 0));
        break;
      case `spawnChest`: {
        let e5 = Math.sin(t2.yaw), n3 = Math.cos(t2.yaw), r = t2.pos.x + e5 * 2.6, i = t2.pos.z + n3 * 2.6;
        Xx.addBox(`chest`, { x: r, y: Oy(r, i, t2.pos.y + 1) + 0.03, z: i, rot: t2.yaw + Math.PI });
        break;
      }
      case `win`:
        for (let e5 of [...G.fighters]) e5.alive && !e5.isPlayer && this.eliminate(e5, t2, `Cheats`);
    }
    t2.refreshHeld(), this.hudT = 0;
  }
  frame(e4) {
    let t2 = (e4 - this.last) / 1e3;
    this.last = e4, t2 > 0.1 && (t2 = 0.1), t2 <= 0 && (t2 = 1e-3), this.fpsN++, this.fpsT += t2, this.fpsT >= 0.5 && (this.hud.setFps(Math.round(this.fpsN / this.fpsT)), this.fpsN = 0, this.fpsT = 0), this.tick(t2), this.render(t2), X.endFrame();
  }
  tick(e4) {
    if (this.frameNo++, Z.uTime.value += e4, this.state === `lobby`) {
      this.tickLobby(e4);
      return;
    }
    if (this.state === `loading`) return;
    X.rawHit(`KeyP`) && !this.resultShown && (this.closeInventory(false), this.cheatsOpen = this.menus.toggleCheats(), this.cheatsOpen ? X.unlock() : this.pauseOpen || X.lock()), (X.rawHit(`Tab`) || X.rawHit(`KeyM`)) && !this.pauseOpen && !this.invOpen && this.hud.toggleFullMap();
    let t2 = false;
    if (this.invOpen && (!this.player.alive || this.resultShown || this.pauseOpen || this.cheatsOpen || this.state !== `match`) && this.closeInventory(false), X.rawHit(`KeyI`) && !this.pauseOpen && !this.cheatsOpen && !this.resultShown) this.invOpen ? this.closeInventory() : this.openInventory();
    else if (this.invOpen) {
      if (X.rawHit(`Escape`)) this.closeInventory(), t2 = true;
      else for (let e5 of $A) X.rawHit(e5) && this.inv.key(e5);
    }
    t2 || !X.rawHit(`Escape`) || X.locked || this.resultShown || this.cheatsOpen || (this.pauseOpen = !this.pauseOpen, this.menus.showPause(this.pauseOpen));
    let n2 = this.pauseOpen;
    if (X.enabled = !n2 && !this.cheatsOpen && !this.resultShown, X.allow = this.invOpen ? QA : null, n2 && !this.onlineActive) return;
    let r = e4 * this.timeScale;
    G.time += r;
    let i = this.player;
    this.updateOnlinePlayers(r);
    this.updateBus(r), this.storm.update(r), this.updateSharks(r), this.updatePoiEvents(r), this.updateIslandUpgrade(r), i.alive && (this.pc.update(r), i.step(r), this.pc.updateWeb(r), this.finishVehicleStep(r));
    if (!i.alive) this.pc.releaseWeb();
    let a = this.camera.position;
    for (let e5 of this.bots) {
      let t3 = e5.f;
      if (!t3.alive) continue;
      let d2 = t3.pos.distanceToSquared(a);
      if (d2 > 90000) (this.frameNo + t3.id) % 6 == 0 && e5.update(r * 6);
      else if (d2 > 40000) (this.frameNo + t3.id) % 3 == 0 && e5.update(r * 3);
      else if (d2 > 10000) (this.frameNo + t3.id) % 2 == 0 && e5.update(r * 2);
      else e5.update(r);
    }
    if (Pb(r), this.stormT += r, this.stormT >= 1) {
      --this.stormT;
      for (let e5 of G.fighters) if (e5.alive && e5.mode !== `bus` && this.storm.isOutside(e5.pos.x, e5.pos.z)) {
        if (e5.isPlayer) {
          if (Sf.cheats.noStorm) continue;
          W.play(`storm_tick`, { volume: 0.6 });
        }
        Jy(e5, this.storm.dps, null, `storm`, false, e5.pos.x, e5.pos.y + 1, e5.pos.z);
      }
    }
    Fx.update(r), oA.update(r), TA.update(r), Xx.update(r, i.pos, Z.uTime.value), am.update(r);
    for (let e5 of G.fighters) {
      if (e5.dissolve >= 0) {
        e5.dissolve += r / 0.55, e5.char.setDissolve(Math.min(1, e5.dissolve)), e5.dissolve >= 1 && (e5.dissolve = -1, e5.visible = false, e5.char.root.visible = false);
        continue;
      }
      if (!e5.alive) continue;
      let t3 = e5.pos.distanceToSquared(a), n3 = e5.mode !== `bus` && t3 < 72900;
      if (n3 !== e5.visible && (e5.visible = n3, e5.char.root.visible = n3), !n3) continue;
      (t3 < 12100 || (this.frameNo + e5.id) % 2 == 0) && e5.animate(t3 < 12100 ? r : r * 2);
      let i2 = t3 < 5625;
      i2 !== e5.char.root.userData.sh && (e5.char.root.userData.sh = i2, e5.char.setShadows(i2));
    }
    if (i.alive) i.mode === `bus` ? (YA.copy(this.bus.pos), YA.y += 3, this.pc.updateCamera(r, YA)) : this.pc.updateCamera(r, null, i.mode !== `glide` && i.mode !== `skydive`);
    else {
      let t3 = this.killer && this.killer.alive ? this.killer : null;
      t3 ? YA.set(t3.pos.x, t3.pos.y + 1.6, t3.pos.z) : YA.set(i.pos.x, i.pos.y + 1.6, i.pos.z), this.pc.orbitDist = 7, this.pc.yaw += e4 * 0.25 - X.mouseDX * 3e-3, this.pc.pitch = Math.max(-1.2, Math.min(0.3, this.pc.pitch - X.mouseDY * 3e-3)), this.pc.pitch > -0.1 && (this.pc.pitch = Dp(this.pc.pitch, -0.3, 2, e4)), this.pc.updateCamera(r, YA, true), this.hud.setSpectate(t3 ? `SPECTATING  ${t3.name}` : null);
    }
    this.overT > 0 && (this.overT -= e4, this.overT <= 0 && !this.resultShown && this.showResult()), this.ambience(e4), this.updateHud(e4), this.updateEsp();
  }
  tickLobby(e4) {
    let t2 = this.player, n2 = this.lobby;
    t2.wishX = t2.wishZ = 0, t2.wantJump = false, t2.pos.copy(n2.pos), t2.yaw = n2.yaw + Math.sin(Z.uTime.value * 0.3) * 0.05, t2.animate(e4), n2.zoom = Dp(n2.zoom, n2.zoomT, 4, e4);
    let r = Math.sin(Z.uTime.value * 0.22) * 0.25;
    this.camera.position.copy(n2.cam).lerp(XA.copy(n2.pos).setY(n2.pos.y + 1.45).lerp(n2.cam, 0.62), n2.zoom), this.camera.position.x += Math.cos(n2.yaw) * r, this.camera.position.z -= Math.sin(n2.yaw) * r, this.camera.lookAt(YA.copy(n2.look).lerp(XA.copy(n2.pos).setY(n2.pos.y + 1.2), n2.zoom * 0.7)), am.update(e4), this.ambient.update(e4, this.camera.position, true, 0), W.setListener(this.camera.position.x, this.camera.position.y, this.camera.position.z, Math.sin(n2.yaw), Math.cos(n2.yaw));
  }
  ambience(e4) {
    let t2 = this.player, n2 = this.camera.position, r = +!!this.storm.isOutside(n2.x, n2.z);
    // Weather system: cycles every 60s
    this.weatherT += e4;
    if (this.weatherT > 60) {
      this.weatherT = 0;
      let weathers = [`clear`, `clear`, `rain`, `fog`, `storm`, `clear`, `snow`];
      this.weather = weathers[Math.floor(Math.random() * weathers.length)];
      if (this.weather !== `clear`) {
        this.hud.banner(`WEATHER`, this.weather.toUpperCase(), 2000, `info`);
      }
    }
    // Weather effects
    let weatherMix = 0;
    if (this.weather === `rain`) weatherMix = 0.5;
    else if (this.weather === `storm`) weatherMix = 1;
    else if (this.weather === `fog`) weatherMix = 0.3;
    else if (this.weather === `snow`) weatherMix = 0.4;
    this.stormMix = Dp(this.stormMix, Math.max(r, weatherMix), 2.2, e4), Z.uStorm.value = this.stormMix, this.hud.setStormOverlay(this.storm.isOutside(t2.pos.x, t2.pos.z) && t2.alive ? this.stormMix : this.stormMix * 0.5), this.stormMix > 0.2 && am.rain(n2.x, n2.y, n2.z, Math.round(this.stormMix * 7)), this.camera.getWorldDirection(ZA), W.setListener(n2.x, n2.y, n2.z, ZA.x, ZA.z), W.setLoop(`storm`, this.stormMix * 0.8), W.setLoop(`rain`, this.stormMix * 0.5), W.setLoop(`skydive`, t2.alive && t2.mode === `skydive` ? 0.75 : 0), W.setLoop(`glide`, t2.alive && t2.mode === `glide` ? 0.6 : 0), W.setLoop(`bus`, t2.mode === `bus` && t2.alive ? 0.55 : 0), this.ambient.update(e4, n2, t2.mode === `ground` || !t2.alive, this.stormMix);
    // Rain splashes on ground
    // POI ambience is a small mix layered on the existing biome soundscape.
    const nearby=qv.find(site=>Math.hypot(t2.pos.x-site.x,t2.pos.z-site.z)<site.r*.7);
    if(nearby && t2.mode===`ground`) {
      const loop=nearby.id===`covert`||nearby.id===`shifty` ? `alpine` : nearby.id===`logjam`||nearby.id===`cuddle`||nearby.id===`joneses` ? `forest` : nearby.id===`sleepy` ? `surf` : `town`;
      W.setLoop(loop, .35*(1-this.stormMix*.5));
    }
    if (this.weather === `rain` || this.weather === `storm`) {
      if (Math.random() < 0.3) am.spark(n2.x + K(-8, 8), n2.y, n2.z + K(-8, 8), 0x4a90e2, 0.3, 0.2, 0.3);
    }
    // Lightning strikes during storm
    if (this.weather === `storm` && Math.random() < 0.02) {
      let lx = n2.x + K(-100, 100), lz = n2.z + K(-100, 100);
      am.spark(lx, 50, lz, 0xffffff, 2, 1, 1);
      W.play(`thunder`, { volume: 0.5 });
      // Flash the sky
      this.ambient.sun.intensity = 2;
      setTimeout(() => { this.ambient.sun.intensity = 1; }, 100);
    }
    // Snow accumulation (visual: white tint on ground)
    if (this.weather === `snow`) {
      this.snowAccum = Math.min(1, (this.snowAccum || 0) + e4 * 0.01);
    } else {
      this.snowAccum = Math.max(0, (this.snowAccum || 0) - e4 * 0.02);
    }
    // Fog rolling through valleys
    if (this.weather === `fog`) {
      this.fogRoll = Math.min(1, (this.fogRoll || 0) + e4 * 0.1);
      this.ambient.fog.density = 0.01 + this.fogRoll * 0.02;
    } else {
      this.fogRoll = Math.max(0, (this.fogRoll || 0) - e4 * 0.05);
    }
    // Snow slows movement
    if (this.weather === `snow` && t2.mode === `ground`) {
      t2.wishX *= 0.8;
      t2.wishZ *= 0.8;
    }
    // Water physics: ripples, splashes, underwater fog
    let waterY = Oy(t2.pos.x, t2.pos.z, t2.pos.y);
    let inWater = waterY < 1 && t2.pos.y < waterY + 1.5;
    if (inWater && t2.mode === `ground`) {
      // Splash particles when moving in water
      if (Math.hypot(t2.wishX, t2.wishZ) > 0.5 && Math.random() < 0.3) {
        am.spark(t2.pos.x, waterY + 0.2, t2.pos.z, 0x4a90e2, 0.5, 0.3, 0.5);
      }
      // Slow movement in water
      t2.wishX *= 0.6;
      t2.wishZ *= 0.6;
    }
    // Underwater fog effect
    if (t2.pos.y < waterY - 0.5) {
      this.ambient.fog.density = 0.05;
      this.ambient.fog.color.setHex(0x1a4a6a);
    }
    // Swimming: breath when submerged, drowning damage after 4s
    if (t2.pos.y < waterY - 1.4) {
      this.breathT = (this.breathT || 0) + e4, this.breathT > 4 && Jy(t2, 5 * e4, null, `drowning`, false, t2.pos.x, t2.pos.y + 1, t2.pos.z), Math.random() < 0.2 && am.spark(t2.pos.x, waterY + 0.1, t2.pos.z, 4882930, 1, 0.4, 0.2, 0.5, 0, 1);
    } else this.breathT = 0;
    // Glider trails: colored particles while gliding
    t2.mode === `glide` && Math.random() < 0.45 && am.spark(t2.pos.x, t2.pos.y + 1.4, t2.pos.z, { default: 57610, sky: 8069119, cloud: 16777215, bolt: 16746495, flame: 16742400 }[Sf.s.glider] ?? 16723878, 2, 0.5, 0.15, 0.4, -1, 1.2);
    // Grenade hazards: lingering smoke / stink clouds
    if (this.hazards?.length) for (let e5 = this.hazards.length - 1; e5 >= 0; e5--) {
      let t3 = this.hazards[e5];
      if (t3.t -= e4, t3.t <= 0) {
        this.hazards.splice(e5, 1);
        continue;
      }
      if (t3.kind === `smoke` && Math.random() < 0.5) am.spark(t3.x + K(-2, 2), t3.y + Math.random() * 2, t3.z + K(-2, 2), 11184810, 2, 0.4, 0.7, 1.1, 0, 1.4);
      if (t3.kind === `stink` && (Math.random() < 0.4 && am.spark(t3.x + K(-2, 2), t3.y + 0.4, t3.z + K(-2, 2), 7330876, 2, 0.5, 0.35, 0.8, 0, 1.6), true)) for (let n3 of this.fighters) n3.alive && n3.mode === `ground` && n3 !== t3.owner && Math.hypot(n3.pos.x - t3.x, n3.pos.z - t3.z) < 4 && Math.abs(n3.pos.y - t3.y) < 3 && Jy(n3, 6 * e4, t3.owner ?? null, `Stink Bomb`, false, n3.pos.x, n3.pos.y + 1, n3.pos.z);
    }
    // Spike traps: damage enemies that step on them
    if (this.traps?.length) for (let e5 = this.traps.length - 1; e5 >= 0; e5--) {
      let t3 = this.traps[e5];
      if (t3.t -= e4, t3.t <= 0) {
        this.traps.splice(e5, 1);
        continue;
      }
      Math.random() < 0.04 && am.spark(t3.x, t3.y + 0.15, t3.z, 16746495, 2, 0.5, 0.1, 0.3, 0, 1.2);
      for (let n3 of this.fighters) n3.alive && n3 !== t3.owner && n3.mode === `ground` && Math.hypot(n3.pos.x - t3.x, n3.pos.z - t3.z) < 2.2 && Math.abs(n3.pos.y - t3.y) < 2.5 && Jy(n3, 15 * e4, t3.owner ?? null, `Spike Trap`, false, n3.pos.x, n3.pos.y + 1, n3.pos.z);
    }
    // Replay recorder: sample player position each 0.5s for match replay
    this.replayT += e4, this.replayT > 0.5 && this.replay?.length < 1200 && (this.replayT = 0, this.replay.push([Math.round(G.time * 10) / 10, Math.round(t2.pos.x), Math.round(t2.pos.z), t2.alive ? 1 : 0]));
  }
  // Resolve a fighter's skin color for kill feed avatars
  skinColor(e4) {
    if (!e4) return void 0;
    let t2 = e4.skin, n2 = typeof t2 === `string` ? xC.find((r) => r.id === t2) : t2;
    return n2?.color;
  }
  // Grenade type detonation dispatcher (frag/smoke/stink/shockwave/bounce)
  detonate(p) {
    let k = p.kind || `grenade`;
    if (k === `smoke`) {
      this.hazards.push({ kind: `smoke`, x: p.pos.x, y: p.pos.y, z: p.pos.z, t: 9 });
      am.spark(p.pos.x, p.pos.y + 0.5, p.pos.z, 11184810, 24, 2.4, 0.6, 1.6, -1, 2.2), W.play(`explosion`, { x: p.pos.x, y: p.pos.y, z: p.pos.z, volume: 0.35, pitch: 0.7 });
      return;
    }
    if (k === `stink`) {
      this.hazards.push({ kind: `stink`, x: p.pos.x, y: p.pos.y, z: p.pos.z, t: 10, owner: p.owner });
      am.spark(p.pos.x, p.pos.y + 0.5, p.pos.z, 7330876, 24, 2.4, 0.5, 1.4, -1, 2), W.play(`explosion`, { x: p.pos.x, y: p.pos.y, z: p.pos.z, volume: 0.35, pitch: 0.85 });
      ob(p.pos.x, p.pos.y, p.pos.z, 3, 8, 60, p.owner, `Stink Bomb`, 0.1);
      return;
    }
    if (k === `shock`) {
      ob(p.pos.x, p.pos.y + 0.25, p.pos.z, 1.5, 0, 120, p.owner, `Shockwave Grenade`, 0);
      for (let f2 of G.fighters) {
        if (!f2.alive || f2.mode === `bus`) continue;
        let dx2 = f2.pos.x - p.pos.x, dy2 = f2.pos.y - p.pos.y, dz3 = f2.pos.z - p.pos.z, d2v = Math.hypot(dx2, dy2, dz3);
        d2v < 8 && (f2.vel.x += dx2 * 26 / Math.max(1.5, d2v), f2.vel.z += dz3 * 26 / Math.max(1.5, d2v), f2.vel.y += 12 * (1 - d2v / 8) + 4, f2.grounded = false);
      }
      p.owner?.isPlayer && this.pc.shake(0.4);
      return;
    }
    if (k === `bounce`) {
      ob(p.pos.x, p.pos.y + 0.25, p.pos.z, 5, 70, 250, p.owner, `Bounce Grenade`, 0.4);
      return;
    }
    ob(p.pos.x, p.pos.y + 0.25, p.pos.z, 5, p.damage, p.structDamage, p.owner, Ih[k] ? Ih[k].name : `Frag Grenade`, 0.2);
  }
  // Battle Pass XP (100 XP per level)
  gainXp(e4) {
    let t2 = (Sf.s.bpXp || 0) + e4, n2 = Sf.s.bpLevel;
    for (; t2 >= n2 * 100 && n2 < 100; ) t2 -= n2 * 100, n2++;
    Sf.set(`bpXp`, Math.round(t2)), n2 !== Sf.s.bpLevel && (Sf.set(`bpLevel`, n2), this.hud.banner(`BATTLE PASS LEVEL UP!`, `LEVEL ` + n2, 2200, `good`), W.play(`level_up`, { volume: 0.7 }));
  }
  // Kill effects: custom elimination visuals per weapon
  killEffect(e4, t2) {
    let n2 = String(e4 || ``);
    if (/Rocket|Grenade|Stink/.test(n2)) am.explosion(t2.pos.x, t2.pos.y + 1, t2.pos.z, 0.6), am.spark(t2.pos.x, t2.pos.y + 1.2, t2.pos.z, 16749440, 20, 6, 0.3, 0.6, -2, 3);
    else if (/Sniper/.test(n2)) am.spark(t2.pos.x, t2.pos.y + 3, t2.pos.z, 11842815, 18, 5, 0.2, 0.5, -1, 1), am.spark(t2.pos.x, t2.pos.y + 1.5, t2.pos.z, 16777215, 10, 3, 0.15, 0.4, -1, 1);
    else if (/Shotgun/.test(n2)) am.spark(t2.pos.x, t2.pos.y + 1.2, t2.pos.z, 16723878, 18, 5, 0.3, 0.5, -2, 3);
    else /Pickaxe/.test(n2) && am.spark(t2.pos.x, t2.pos.y + 1.2, t2.pos.z, 16777600, 14, 4, 0.2, 0.5, -1, 2);
  }
  // Chug Splash: heal nearby teammates
  splashHeal(e4, t2) {
    for (let n2 of this.teammates) n2.alive && Math.hypot(n2.pos.x - e4.pos.x, n2.pos.z - e4.pos.z) < 6 && (n2.hp = Math.min(100, n2.hp + t2), n2.shield = Math.min(100, n2.shield + t2), am.spark(n2.pos.x, n2.pos.y + 1.1, n2.pos.z, 7330876, 12, 3, 0.14, 0.6, -1, 2.2));
  }
  // Deployable items: Launch Pad / Port-a-Fortress / Rift Beacon / Spike Trap
  usePlaceItem(e4, t2) {
    let n2 = t2.place;
    this.hud.banner(`DEPLOYED`, t2.name.toUpperCase(), 1400, `good`), W.play(`build_place`, { volume: 0.7 });
    if (n2 === `rift`) {
      e4.pos.x = tD(e4.pos.x + K(-50, 50), -320, 320), e4.pos.z = tD(e4.pos.z + K(-50, 50), -320, 320), e4.pos.y = 170, e4.vel.set(0, 0, 0), e4.mode = `skydive`, e4.grounded = false, e4.groundedB = false, am.spark(e4.pos.x, e4.pos.y, e4.pos.z, 41215, 30, 6, 0.3, 0.8, -2, 3), this.hud.banner(`RIFTED!`, `Redeploying from the sky`, 2000, `good`);
      return;
    }
    if (n2 === `spike`) {
      this.traps.push({ kind: `spike`, x: e4.pos.x, y: e4.pos.y, z: e4.pos.z, t: 90, owner: e4 });
      return;
    }
    let r = Math.floor(e4.pos.x / 5), i = Math.floor(e4.pos.z / 5), a = Math.floor((e4.pos.y + 0.9) / 4);
    if (n2 === `pad`) {
      let o = Ix.metal;
      Fx.place({ shape: `pad`, gx: r, gy: a, gz: i, rot: 0, tex: o.tex, tint: o.tint, mat: `metal` }, false, e4, true);
      return;
    }
    if (n2 === `fort`) {
      let o = Ix.metal, s2 = (c, l2, u, d, f) => Fx.place({ shape: c, gx: l2, gy: u, gz: d, rot: f, tex: o.tex, tint: o.tint, mat: `metal` }, false, e4, true);
      s2(`wall`, r, a, i, 1), s2(`wall`, r + 1, a, i, 1), s2(`wall`, r, a, i, 0), s2(`wall`, r, a, i + 1, 0), s2(`floor`, r, a + 1, i, 0), s2(`pyr`, r, a + 2, i, 0);
    }
  }
  // Spectate a friend's match: jump camera to a random alive bot
  spectateFriend(e4) {
    let t2 = (this.fighters || []).filter((n2) => n2.alive && !n2.isPlayer);
    if (this.state === `match` && t2.length) (!this.player.alive || this.state === `over` ? this.hud.setSpectate(Np(t2)) : this.hud.setSpectate(t2[0]) , this.hud.banner(`SPECTATING`, `Watching a match — press E / click to exit`, 2200, `info`));
    else this.hud.banner(`SPECTATE`, `Join a match first, then spectate from the Friends panel`, 2200, `info`);
  }
  // Bots occasionally reply in team chat
  botChatReply() {
    let e4 = (this.fighters || []).filter((t2) => t2.alive && !t2.isPlayer);
    if (!e4.length || this.state !== `match`) return;
    let t2 = Np(e4), n2 = [`gg`, `nice play!`, `drop me loot!`, `watch the storm`, `pushing now`, `i need heals`, `cover me!`, `lets go!`, `gl hf`, `this zone is far`, `build fast!`, `on my way`];
    setTimeout(() => {
      this.state === `match` && t2.alive && this.hud.addChat(t2.name, Np(n2), this.skinColor(t2) || `#ff2ea6`);
    }, K(800, 2600));
  }
  // Ping: mark a location (Fortnite ping)
  pingAt(e4, t2, n2) {
    this.lastPing={x:e4,y:t2,z:n2}; this.pingT = 6, am.spark(e4, t2, n2, 16746495, 16, 4, 0.2, 0.6, -1, 2), am.beam(e4, t2, n2), W.play(`edit`, { volume: 0.6, pitch: 1.3 }), this.hud.banner(`PING`, `Location marked for your team`, 1600, `info`);
  }
  updateHud(e4) {
    let t2 = this.player, n2 = this.hud, r = this.pc;
    n2.setCompass(r.yaw), n2.setScope(r.scoped && t2.alive);
    let i = t2.weapon;
    if (!t2.alive || t2.mode !== `ground` ? n2.setCrosshair(t2.mode === `bus` || !t2.alive ? `none` : `dot`, 0) : t2.buildMode ? n2.setCrosshair(`build`, 0) : i ? r.scoped ? n2.setCrosshair(`none`, 0) : i.thrown ? n2.setCrosshair(`dot`, 0) : n2.setCrosshair(i.pellets > 1 ? `shotgun` : `gun`, r.spread) : n2.setCrosshair(`dot`, 0), t2.reloadT > 0 ? n2.setUseProgress(`RELOADING`, 1 - t2.reloadT / t2.reloadTotal) : t2.useT > 0 ? n2.setUseProgress(t2.current ? Lh[t2.current.id]?.name.toUpperCase() ?? `` : ``, t2.useT / t2.useTotal) : n2.setUseProgress(null, 0), this.hudT -= e4, this.hudT <= 0) {
      this.hudT = 0.09, n2.setVitals(t2.hp, t2.shield), n2.setMats(t2.mats.wood, t2.mats.stone, t2.mats.metal);
      let teamData = [];
      if (this.teammates) for (let e6 of this.teammates) teamData.push({ name: e6.name || `TEAMMATE`, hp: e6.hp != null ? e6.hp : 100, shield: e6.shield != null ? e6.shield : 0, alive: e6.alive !== false, task:e6.downed?`DOWNED`:e6.squadTask||`FOLLOWING` });
      n2.setTeam(teamData);
      for (let e6 = 0; e6 < 5; e6++) {
        let n3 = t2.slots[e6];
        this.hotbar[e6] = n3 ? { icon: this.icons.get(n3.id) ?? ``, rarity: n3.rarity, count: (Uh(n3.id), n3.count), name: Uh(n3.id) ? Ih[n3.id].name : Lh[n3.id].name } : null;
      }
      n2.setHotbar(this.hotbar, t2.active, this.icons.get(`pickaxe`) ?? ``), this.invOpen && this.inv.update(this.invData()), i && t2.current && !t2.buildMode ? n2.setAmmo(t2.current.count, i.thrown ? null : Sf.cheats.infiniteAmmo ? 999 : t2.ammo[i.ammo]) : n2.setAmmo(null, null), n2.setBuild(t2.buildMode, t2.buildPiece, t2.buildMat, t2.mats), n2.setMatch(G.alive, t2.kills);
      let e5 = this.storm;
      e5.state === `wait` ? n2.setStormTimer(e5.phase === 0 ? `STORM FORMS IN` : `STORM EYE SHRINKS IN`, e5.timer, e5.timer < 10) : e5.state === `shrink` ? n2.setStormTimer(`STORM EYE SHRINKING`, e5.timer, true) : n2.setStormTimer(`FINAL ZONE`, 0, true);
      let r2 = this.bus;
      t2.alive ? t2.mode === `bus` ? r2.t < this.DOORS ? n2.setBusUi(`riding`, `Doors open in ${Math.ceil(this.DOORS - r2.t)}`) : n2.setBusUi(`canDrop`, `Auto-drop in ${Gp(r2.dur - r2.t)}`) : t2.mode === `skydive` ? n2.setBusUi(`skydive`, `${Math.max(0, Math.round(t2.pos.y - Oy(t2.pos.x, t2.pos.z, t2.pos.y)))} m`) : t2.mode === `glide` ? n2.setBusUi(`glide`, `${Math.max(0, Math.round(t2.pos.y - Oy(t2.pos.x, t2.pos.z, t2.pos.y)))} m`) : n2.setBusUi(`hidden`) : n2.setBusUi(`hidden`);
    }
    if (this.mapT -= e4, this.mapT <= 0) {
      this.mapT = 0.07;
      let e5 = this.storm, i2 = this.bus, a = t2.mode === `bus` ? i2.pos : t2.alive ? t2.pos : this.camera.position, o = [];
      if (Sf.cheats.esp) for (let e6 of G.fighters) e6.alive && !e6.isPlayer && e6.mode !== `bus` && o.push({ x: e6.pos.x, z: e6.pos.z, color: `#ff4a4a` });
      const favorite=Jv(Sf.s.favoriteDrop);if(favorite)o.push({x:favorite.x,z:favorite.z,color:`#ffe838`});
      if(this.lastPing)o.push({x:this.lastPing.x,z:this.lastPing.z,color:`#ff59d5`});
      if(this.islandUpgrade?.drone)for(const f of this.islandUpgrade.drone.scanned||[])if(f.alive)o.push({x:f.pos.x,z:f.pos.z,color:`#ff625b`});
      for (let e6 of Xx.supplies(this.supplyList)) o.push({ x: e6.pos.x, z: e6.pos.z, color: `#2f8dff` });
      n2.updateMap({ size: 800, px: a.x, pz: a.z, yaw: r.yaw, storm: { x: e5.x, z: e5.z, r: e5.r }, next: e5.state === `done` ? null : { x: e5.tx, z: e5.tz, r: e5.tr }, bus: i2.active ? { x: i2.pos.x, z: i2.pos.z, ax: i2.ax, az: i2.az, bx: i2.ax + i2.dx * 880, bz: i2.az + i2.dz * 880 } : null, pings: o });
    }
  }
  updateEsp() {
    let e4 = Sf.cheats.esp && this.state !== `lobby`, t2 = 0;
    if (e4) {
      if (!this.espMat) {
        let e5 = document.createElement(`canvas`);
        e5.width = e5.height = 64;
        let t3 = e5.getContext(`2d`);
        t3.fillStyle = `#ff3b3b`, t3.strokeStyle = `#ffffff`, t3.lineWidth = 5, t3.beginPath(), t3.moveTo(32, 6), t3.lineTo(58, 32), t3.lineTo(32, 58), t3.lineTo(6, 32), t3.closePath(), t3.fill(), t3.stroke(), this.espMat = new $r({ map: new Na(e5), depthTest: false, transparent: true, sizeAttenuation: false, toneMapped: false });
      }
      for (let e5 of G.fighters) {
        if (!e5.alive || e5.isPlayer || e5.mode === `bus`) continue;
        let n2 = this.espSprites[t2];
        n2 || (n2 = new pi(this.espMat), n2.scale.set(0.022, 0.022, 1), n2.renderOrder = 50, this.scene.add(n2), this.espSprites.push(n2)), n2.visible = true, n2.position.set(e5.pos.x, e5.pos.y + 2.3, e5.pos.z), t2++;
      }
    }
    for (let e5 = t2; e5 < this.espSprites.length; e5++) this.espSprites[e5].visible = false;
  }
  render(e4) {
    let t2 = this.player, n2 = this.state === `lobby` ? this.lobby.pos : t2.mode === `bus` ? this.bus.pos : t2.alive ? t2.pos : this.camera.position;
    Z.uPlayer.value.copy(t2.pos), this.sky.update(e4, this.camera, n2, this.stormMix);
    if(Sf.s.performanceMode)this.renderer.render(this.scene,this.camera);else this.post.render(e4, this.pc.scoped && t2.alive ? 1 : 0);
  }
  debugStep(e4, t2 = 1 / 60) {
    for (let n2 = 0; n2 < e4; n2++) this.tick(t2), X.endFrame();
  }
  debugSetTime(seconds) { G.time=Math.max(0,Number(seconds)||0); }
  debugGround(x,z) { return ay(x,z); }
  debugPiece(key) { return Fx.pieceAt(key)?.spec.shape||null; }
  debugDamage(fighter,amount,attacker=null) { Jy(fighter,amount,attacker,`test`,false,fighter.pos.x,fighter.pos.y+1,fighter.pos.z); }
  debugRender() {
    this.render(1 / 60);
  }
  debugInfo() {
    let e4 = this.player;
    return { state: this.state, time: +G.time.toFixed(1), alive: G.alive, mode: e4.mode, hp: e4.hp, shield: e4.shield, pos: [+e4.pos.x.toFixed(1), +e4.pos.y.toFixed(1), +e4.pos.z.toFixed(1)], kills: e4.kills, storm: { r: +this.storm.r.toFixed(0), phase: this.storm.phase, state: this.storm.state }, pieces: Fx.pieces.size, loot: Xx.items.length, draw: this.renderer.info.render.calls, tris: this.renderer.info.render.triangles, supplies: Xx.supplies(this.supplyList).map((e5) => ({ x: Math.round(e5.pos.x), y: +e5.pos.y.toFixed(1), z: Math.round(e5.pos.z), falling: !!e5.falling })), grenades: Ib(), sliding: e4.sliding, mantling: e4.mantleT >= 0, pois: qv.length, half: 400 };
  }
};
function ironBeltX(i,t){return -275-12+i*4+(t*1.5)%4;}
function teamPreviewSize(mode,count) {return Math.min(({solo:1,duo:2,trios:3,squad:4}[mode]||1),Math.max(1,Math.round(count)+1));}
function bootGame() {
  const canvas = document.getElementById("game");
  const bootEl = document.getElementById("boot");
  const game = new ej(canvas);
  window.__game = game;
  game.init().then(() => bootEl?.remove()).catch((err) => {
    console.error(err);
    if (bootEl) {
      bootEl.textContent = "Failed to start: " + (err instanceof Error ? err.message : String(err));
    }
  });
  return game;
}
export {
  bootGame
};
