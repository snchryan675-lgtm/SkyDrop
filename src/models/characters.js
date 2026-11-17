import { GeoBuilder, shadeHex, strutBox, xform } from './geoBuilder.js';

const HALF_PI = Math.PI / 2;

const partCache = new Map();
let tabletGeoCache = null;

export function buildBlueprintTabletGeo() {
  if (tabletGeoCache) return tabletGeoCache;
  const b = new GeoBuilder();
  // Blueprint clipboard / digital build pad held in left hand while building
  b.rbox(0.22, 0.016, 0.17, 0.006, 0x26344d, xform(0, 0, 0), 0x3b5075, 1);
  b.box(0.185, 0.006, 0.135, 0x3aa0ff, xform(0, 0.009, 0.004), 0x8ad0ff);
  // White blueprint grid lines on screen
  for (let i = -2; i <= 2; i++) {
    b.box(0.165, 0.003, 0.004, 0xd8f0ff, xform(0, 0.012, i * 0.024));
    b.box(0.004, 0.003, 0.115, 0xd8f0ff, xform(i * 0.032, 0.012, 0.004));
  }
  b.rbox(0.07, 0.012, 0.022, 0.004, 0x8e9aa8, xform(0, 0.012, -0.072), 0xcfd7e0, 1);
  tabletGeoCache = b.build();
  return tabletGeoCache;
}

function buildFaceAndEyes(head, eyes, eyesGlow, skin, opts = {}) {
  const tone = skin.tone;
  const toneLight = shadeHex(tone, 1.07);
  const toneDark = shadeHex(tone, 0.86);
  const fem = !!skin.fem;

  // Cranium + sculpted jaw
  const headW = fem ? 0.212 : 0.224;
  const headH = 0.236;
  const headD = 0.224;
  head.rbox(headW, headH, headD, 0.088, toneDark, xform(0, 0.148, 0.004), toneLight, 2);
  // Chin / lower cheek contour
  head.rbox(headW * 0.76, 0.09, headD * 0.78, 0.038, toneDark, xform(0, 0.076, 0.018), tone, 1);

  if (!opts.hideEars) {
    for (const sx of [-1, 1]) {
      head.sphere(0.028, toneDark, xform(sx * (headW * 0.5 + 0.006), 0.142, -0.005, 0, 0, 0, 0.55, 1.05, 0.75), 8, 6, tone);
      // Inner ear detail
      head.sphere(0.014, shadeHex(tone, 0.7), xform(sx * (headW * 0.5 + 0.012), 0.142, -0.005, 0, 0, 0, 0.5, 1, 0.6), 6, 5);
    }
  }
  // Cheek contour + jaw definition
  for (const sx of [-1, 1]) {
    head.rbox(0.05, 0.06, 0.02, 0.012, shadeHex(tone, 0.94), xform(sx * headW * 0.32, 0.115, headD * 0.42), toneLight, 1);
  }
  // Forehead highlight
  head.rbox(headW * 0.5, 0.05, 0.015, 0.008, toneLight, xform(0, 0.21, headD * 0.47), undefined, 1);

  if (!opts.fullHelmet) {
    // Sculpted nose
    head.rbox(0.028, 0.038, 0.032, 0.01, toneDark, xform(0, 0.136, headD * 0.5 + 0.004, -0.18, 0, 0), toneLight, 1);

    // Mouth (mask covers mouth if opts.faceMask)
    if (!opts.faceMask) {
      if (opts.bigSmile) {
        head.rbox(0.068, 0.024, 0.016, 0.006, 0x5c221c, xform(0, 0.094, headD * 0.49), 0x3a1410, 1);
        head.box(0.056, 0.01, 0.018, 0xffffff, xform(0, 0.099, headD * 0.495));
      } else {
        head.rbox(
          fem ? 0.052 : 0.058,
          0.013,
          0.014,
          0.005,
          fem ? 0xc45b56 : shadeHex(tone, 0.62),
          xform(0, 0.095, headD * 0.49),
          undefined,
          1
        );
      }
    }

    // Eyebrows
    const browCol = opts.browColor ?? shadeHex(skin.hair, 0.75);
    for (const sx of [-1, 1]) {
      head.rbox(
        0.044,
        fem ? 0.011 : 0.014,
        0.016,
        0.004,
        browCol,
        xform(sx * 0.046, 0.188, headD * 0.485, 0, 0, sx * (opts.fierceBrow ? -0.14 : 0.05)),
        undefined,
        1
      );
    }

    // Animated eyes (in `eyes` bone local space at y = 0.161 on head)
    const irisCol = opts.irisColor ?? 0x2b6fd6;
    const zEye = headD * 0.482;
    if (opts.glowEyes) {
      for (const sx of [-1, 1]) {
        eyesGlow.rbox(0.038, 0.018, 0.016, 0.006, opts.glowEyes, xform(sx * 0.044, 0, zEye), 0xffffff, 1);
      }
    } else {
      for (const sx of [-1, 1]) {
        eyes.rbox(0.038, 0.028, 0.014, 0.008, 0xfafcff, xform(sx * 0.044, 0, zEye), 0xffffff, 1);
        eyes.sphere(0.0125, irisCol, xform(sx * 0.044, -0.001, zEye + 0.005, 0, 0, 0, 1, 1.1, 0.45), 8, 6);
        eyes.sphere(0.007, 0x101520, xform(sx * 0.044, -0.001, zEye + 0.008, 0, 0, 0, 1, 1.1, 0.4), 7, 5);
        eyes.sphere(0.0038, 0xffffff, xform(sx * 0.044 + 0.004, 0.005, zEye + 0.01), 5, 4);
      }
    }
  }
}

export function getProceduralCharacterParts(skin) {
  let cached = partCache.get(skin.id);
  if (cached) return cached;

  const id = skin.id;
  const fem = !!skin.fem;
  const bulky = skin.build === 2;
  const slim = skin.build === 0;

  const hips = new GeoBuilder();
  const spine = new GeoBuilder();
  const chest = new GeoBuilder();
  const head = new GeoBuilder();
  const eyes = new GeoBuilder();
  const armUL = new GeoBuilder();
  const armUR = new GeoBuilder();
  const armLL = new GeoBuilder();
  const armLR = new GeoBuilder();
  const legUL = new GeoBuilder();
  const legUR = new GeoBuilder();
  const legLL = new GeoBuilder();
  const legLR = new GeoBuilder();
  const footL = new GeoBuilder();
  const footR = new GeoBuilder();

  const chestGlow = new GeoBuilder();
  const headGlow = new GeoBuilder();
  const eyesGlow = new GeoBuilder();
  const legGlowL = new GeoBuilder();
  const legGlowR = new GeoBuilder();

  const tone = skin.tone;
  const toneDark = shadeHex(tone, 0.86);
  const top = skin.top;
  const topDark = shadeHex(top, 0.8);
  const topLight = shadeHex(top, 1.12);
  const pants = skin.pants;
  const pantsDark = shadeHex(pants, 0.8);
  const pantsLight = shadeHex(pants, 1.1);
  const boots = skin.boots;
  const bootsDark = shadeHex(boots, 0.72);
  const bootsLight = shadeHex(boots, 1.14);
  const hair = skin.hair;
  const hairDark = shadeHex(hair, 0.76);
  const hairLight = shadeHex(hair, 1.14);

  const hipW = fem ? 0.275 : bulky ? 0.305 : 0.285;
  const waistW = fem ? 0.235 : bulky ? 0.285 : 0.258;
  const chestW = slim ? 0.275 : fem ? 0.29 : bulky ? 0.365 : 0.325;
  const chestD = bulky ? 0.215 : 0.19;

  // 1. Base Pelvis / Belt (hips)
  hips.rbox(hipW, 0.145, 0.185, 0.055, pantsDark, xform(0, -0.015, 0), pants, 1);
  const beltCol =
    id === 'rumble'
      ? 0x1e2331
      : id === 'ranger'
      ? 0x3d2d20
      : id === 'rex'
      ? topDark
      : id === 'orbit'
      ? 0x8d96a3
      : 0x262a33;
  if (id !== 'rex') {
    hips.rbox(hipW + 0.018, 0.052, 0.198, 0.014, shadeHex(beltCol, 0.8), xform(0, 0.052, 0), beltCol, 1);
    const buckleCol = id === 'rumble' || id === 'ranger' || id === 'valor' ? 0xf2c230 : 0x9aa4b2;
    hips.rbox(
      id === 'rumble' ? 0.095 : 0.056,
      id === 'rumble' ? 0.072 : 0.054,
      0.026,
      0.008,
      shadeHex(buckleCol, 0.85),
      xform(0, 0.054, 0.102),
      buckleCol,
      1
    );
    if (id === 'rumble') {
      hips.sphere(0.022, 0xe8402e, xform(0, 0.054, 0.114), 8, 6);
    }
    // Chapter 2: Belt pouches + holster
    for (const sx of [-1, 1]) {
      hips.rbox(0.07, 0.09, 0.05, 0.012, shadeHex(pants, 0.75), xform(sx * hipW * 0.38, 0.0, 0.09), pants, 1);
    }
    hips.rbox(0.06, 0.1, 0.04, 0.01, shadeHex(boots, 0.8), xform(hipW * 0.42, -0.01, 0.02), boots, 1);
  }

  // 2. Base Waist (spine) & Upper Torso + Neck (chest)
  const waistCol = id === 'rumble' ? top : top;
  spine.rbox(waistW, 0.19, chestD * 0.9, 0.06, shadeHex(waistCol, 0.82), xform(0, 0.085, 0), waistCol, 1);
  chest.rbox(chestW, 0.255, chestD, 0.072, topDark, xform(0, 0.115, 0), topLight, 1);
  // Chest details: center zipper/placket, chest pockets, shoulder seams
  chest.rbox(0.03, 0.2, 0.012, 0.004, shadeHex(top, 0.7), xform(0, 0.115, chestD * 0.5 + 0.002), top, 1);
  // Zipper pull + buttons
  chest.rbox(0.018, 0.03, 0.008, 0.003, 0x9aa4b2, xform(0, 0.06, chestD * 0.5 + 0.006), 0xd8dee9, 1);
  for (let bi = 0; bi < 3; bi++) {
    chest.cyl(0.008, 0.008, 0.006, shadeHex(top, 0.6), xform(0, 0.09 + bi * 0.05, chestD * 0.5 + 0.004, Math.PI / 2, 0, 0), 6);
  }
  for (const sx of [-1, 1]) {
    chest.rbox(0.075, 0.06, 0.014, 0.006, shadeHex(top, 0.82), xform(sx * chestW * 0.26, 0.16, chestD * 0.48), topLight, 1);
    chest.rbox(0.02, 0.05, 0.01, 0.003, shadeHex(top, 0.65), xform(sx * chestW * 0.26, 0.16, chestD * 0.5 + 0.004), top, 1);
    // Pocket flap
    chest.rbox(0.078, 0.02, 0.016, 0.004, shadeHex(top, 0.72), xform(sx * chestW * 0.26, 0.195, chestD * 0.48), top, 1);
    // Shoulder seam
    chest.rbox(0.012, 0.09, 0.05, 0.004, shadeHex(top, 0.75), xform(sx * chestW * 0.42, 0.2, 0), top, 1);
    // Sleeve cuff detail
    chest.rbox(0.02, 0.06, 0.06, 0.006, shadeHex(top, 0.7), xform(sx * chestW * 0.44, 0.08, 0), top, 1);
  }
  // Collar buttons + neckline trim
  chest.rbox(chestW * 0.5, 0.02, 0.014, 0.004, shadeHex(top, 0.68), xform(0, 0.235, chestD * 0.46), top, 1);
  // Collar
  chest.cyl(chestW * 0.28, chestW * 0.32, 0.035, topDark, xform(0, 0.245, 0), 12, top);
  // Neck
  const neckCol = id === 'orbit' || id === 'valor' ? 0x555e6b : id === 'shade' ? 0x221d33 : toneDark;
  chest.cyl(0.054, 0.062, 0.095, neckCol, xform(0, 0.268, 0), 10, id === 'orbit' || id === 'valor' ? neckCol : tone);

  // Chapter 2: High-detail cosmetics — backpack, shoulder pads, chest emblem
  // Backpack (spine, behind back)
  spine.rbox(waistW * 0.85, 0.24, 0.11, 0.03, shadeHex(top, 0.7), xform(0, 0.1, -chestD * 0.5 - 0.05), top, 1);
  spine.rbox(waistW * 0.6, 0.14, 0.04, 0.015, shadeHex(top, 0.6), xform(0, 0.08, -chestD * 0.5 - 0.11), topLight, 1);
  // Backpack straps over shoulders
  for (const sx of [-1, 1]) {
    chest.rbox(0.05, 0.2, 0.02, 0.008, shadeHex(top, 0.65), xform(sx * chestW * 0.28, 0.14, -chestD * 0.5 - 0.01), top, 1);
  }
  // Shoulder pads (bulky skins get armor)
  if (bulky) {
    for (const sx of [-1, 1]) {
      chest.sphere(0.085, topDark, xform(sx * chestW * 0.48, 0.22, 0, 0, 0, 0, 1, 0.7, 1), 10, 8, topLight);
      chest.rbox(0.1, 0.04, 0.12, 0.015, shadeHex(top, 0.6), xform(sx * chestW * 0.48, 0.26, 0), top, 1);
    }
  }
  // Chest emblem (glowing insignia)
  chestGlow.ico(0.022, skin.color ? parseInt(skin.color.slice(1), 16) : 0x00e5ff, xform(0, 0.18, chestD * 0.5 + 0.012), 0);
  // Capes for hero skins
  if (id === 'valkyrie' || id === 'nova' || id === 'solar' || id === 'vortex') {
    const capeCol = id === 'valkyrie' ? 0xf5f0e0 : id === 'nova' ? 0x00e5ff : id === 'solar' ? 0xffd700 : 0x7b2fff;
    spine.rbox(waistW * 0.9, 0.38, 0.02, 0.008, shadeHex(capeCol, 0.85), xform(0, -0.02, -chestD * 0.5 - 0.02, 0.12, 0, 0), capeCol, 1);
  }

  // 3. Arms (armU & armL)
  const bareArms = id === 'rumble';
  const shortSleeves = id === 'ranger' || id === 'kick' || id === 'patch';
  const armR = bulky ? 0.064 : slim ? 0.049 : 0.055;
  const foreR = bulky ? 0.054 : slim ? 0.042 : 0.047;

  for (let side = 0; side < 2; side++) {
    const aU = side === 0 ? armUL : armUR;
    const aL = side === 0 ? armLL : armLR;
    const sx = side === 0 ? 1 : -1;

    if (bareArms) {
      aU.capsule(armR, 0.21, toneDark, xform(0, -0.135, 0), tone);
    } else if (shortSleeves) {
      aU.capsule(armR + 0.006, 0.11, topDark, xform(0, -0.075, 0), topLight);
      aU.cyl(armR + 0.012, armR + 0.012, 0.032, shadeHex(top, 0.72), xform(0, -0.145, 0), 10, top);
      aU.capsule(armR * 0.94, 0.1, toneDark, xform(0, -0.21, 0), tone);
    } else {
      aU.capsule(armR + 0.005, 0.21, topDark, xform(0, -0.135, 0), topLight);
    }

    // Forearms
    const fullSleeve = !bareArms && !shortSleeves;
    const foreCol = fullSleeve ? top : tone;
    aL.capsule(foreR, 0.19, shadeHex(foreCol, 0.84), xform(0, -0.12, 0), foreCol);

    // Wristbands / Watch / Cuffs
    if (id === 'rumble') {
      aL.cyl(foreR + 0.008, foreR + 0.008, 0.052, 0xf2f4f8, xform(0, -0.225, 0), 10, 0xffffff);
    } else if (id === 'ranger' && side === 1) {
      aL.cyl(foreR + 0.007, foreR + 0.007, 0.024, 0x2b2118, xform(0, -0.225, 0), 10);
      aL.box(0.028, 0.024, 0.018, 0xd8dee9, xform(-0.01 * sx, -0.225, 0.045));
    } else if (id === 'orbit') {
      aL.torus(foreR + 0.006, 0.012, 0x2a6cde, xform(0, -0.22, 0, HALF_PI, 0, 0), 6, 12);
    }

    // Hands / Gloves (grip socket is at y = -0.30)
    const hasGloves =
      id === 'rumble' ||
      id === 'sentinel' ||
      id === 'frost' ||
      id === 'valor' ||
      id === 'orbit' ||
      id === 'shade' ||
      id === 'rex';
    const handCol =
      id === 'rumble'
        ? 0x222733
        : id === 'orbit'
        ? 0xdce2ea
        : id === 'valor'
        ? 0x9aa3b0
        : id === 'rex'
        ? topDark
        : hasGloves
        ? 0x282d36
        : tone;
    aL.rbox(0.072, 0.088, 0.082, 0.024, shadeHex(handCol, 0.84), xform(0, -0.285, 0.006), handCol, 1);
    aL.rbox(0.028, 0.048, 0.032, 0.01, handCol, xform(-sx * 0.036, -0.275, 0.035, 0.25, 0, sx * 0.3), undefined, 1);
  }

  // 4. Legs & Articulated Boots (legU, legL, foot)
  const thighR = fem ? 0.076 : bulky ? 0.086 : 0.08;
  const shinR = fem ? 0.06 : bulky ? 0.068 : 0.063;

  for (let side = 0; side < 2; side++) {
    const lU = side === 0 ? legUL : legUR;
    const lL = side === 0 ? legLL : legLR;
    const ft = side === 0 ? footL : footR;
    const sx = side === 0 ? 1 : -1;

    lU.capsule(thighR, 0.31, pantsDark, xform(0, -0.205, 0), pantsLight);

    // Outfit thigh details
    if (id === 'ranger' || id === 'sentinel' || id === 'patch') {
      // Cargo pocket on outer thigh
      lU.rbox(0.036, 0.125, 0.105, 0.01, shadeHex(pants, 0.72), xform(sx * (thighR - 0.005), -0.21, 0), pants, 1);
    } else if (id === 'rumble') {
      // White vertical athletic stripe down outer leg + red knee pad
      lU.box(0.024, 0.34, 0.042, 0xf5f7fa, xform(sx * (thighR - 0.004), -0.2, 0));
      lU.rbox(0.11, 0.095, 0.055, 0.022, 0xc93020, xform(0, -0.39, 0.055), 0xf04835, 1);
    } else if (id === 'neon') {
      const lg = side === 0 ? legGlowL : legGlowR;
      lg.box(0.022, 0.3, 0.032, 0x19d8ff, xform(sx * (thighR - 0.002), -0.2, 0));
    }

    if (id === 'sentinel' || id === 'valor' || id === 'shade') {
      const kpCol = id === 'valor' ? 0xc6cfdb : 0x252932;
      lU.rbox(0.105, 0.09, 0.05, 0.02, shadeHex(kpCol, 0.8), xform(0, -0.39, 0.052), kpCol, 1);
    }

    // Shin + tall boot shaft (legL goes 0 .. -0.415)
    lL.capsule(shinR, 0.19, pantsDark, xform(0, -0.12, 0), pants);
    lL.cyl(shinR + 0.009, shinR + 0.002, 0.21, bootsDark, xform(0, -0.305, 0), 10, bootsLight);
    if (id === 'rumble') {
      lL.cyl(shinR + 0.012, shinR + 0.012, 0.036, 0xe8402e, xform(0, -0.205, 0), 10);
      lL.box(0.036, 0.18, 0.025, 0x24356a, xform(0, -0.3, 0.056));
    } else if (id === 'ranger') {
      // Boot laces
      for (let k = 0; k < 3; k++) {
        lL.box(0.055, 0.014, 0.024, 0x2a1c12, xform(0, -0.24 - k * 0.042, 0.058));
      }
    }

    // Articulated Foot (foot bone at y = -0.415; sole touches ground at y = -0.080)
    ft.rbox(0.112, 0.086, 0.235, 0.028, bootsDark, xform(0, -0.032, 0.044), bootsLight, 1);
    const soleCol = id === 'kick' ? 0xffffff : id === 'rumble' ? 0x24356a : 0x1d2026;
    ft.rbox(0.118, 0.026, 0.245, 0.008, soleCol, xform(0, -0.067, 0.045), shadeHex(soleCol, 1.15), 1);
    if (id === 'rex') {
      // Three white dino claws on each boot!
      for (const cx of [-0.034, 0, 0.034]) {
        ft.cone(0.016, 0.042, 0xf5f5dc, xform(cx, -0.052, 0.172, HALF_PI * 0.85, 0, 0), 6);
      }
    }
  }

  // 5. Outfit-Specific Head, Hair, Helmets & Torso Gear (All 12 Skins!)
  switch (id) {
    case 'ranger': {
      // Trailblazer: swept brown hair, yellow neckerchief, dual leather straps, hip satchel
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0x3b6e4c });
      // Swept brown hair cap + sideburns + front quiff
      head.sphere(0.122, hairDark, xform(0, 0.186, -0.008, 0, 0, 0, 0.98, 0.82, 1.04), 12, 10, hairLight);
      head.rbox(0.215, 0.062, 0.095, 0.026, hair, xform(0.01, 0.238, 0.068, -0.2, 0.08, -0.1), hairLight, 1);
      head.rbox(0.228, 0.13, 0.11, 0.035, hairDark, xform(0, 0.165, -0.068), hair, 1);
      for (const sx of [-1, 1]) {
        head.rbox(0.032, 0.085, 0.075, 0.012, hairDark, xform(sx * 0.106, 0.175, 0.01), hair, 1);
      }
      // Yellow scout neckerchief at collar
      chest.torus(0.086, 0.024, 0xf2c935, xform(0, 0.235, 0.01, HALF_PI + 0.15, 0, 0), 7, 14);
      chest.cone(0.045, 0.095, 0xe0b422, xform(0, 0.195, 0.102, Math.PI - 0.2, 0, 0), 4, 0xffdf59);
      // Brown leather shoulder harness straps + cross-body satchel strap
      const strapCol = 0x4a321f;
      for (const sx of [-1, 1]) {
        chest.box(0.038, 0.25, chestD + 0.022, strapCol, xform(sx * 0.095, 0.118, 0));
        chest.box(0.046, 0.026, 0.018, 0xd9ad3b, xform(sx * 0.095, 0.15, chestD * 0.5 + 0.012));
      }
      strutBox(chest, [-0.12, 0.24, chestD * 0.5 + 0.01], [0.13, -0.02, chestD * 0.5 + 0.01], 0.034, strapCol, 0.018);
      // Side explorer satchel on hip
      hips.rbox(0.065, 0.115, 0.11, 0.018, 0x6b472b, xform(hipW * 0.5 + 0.022, -0.02, 0.01), 0x8c5e3a, 1);
      break;
    }

    case 'rumble': {
      // Rumble: blonde spiky mohawk, red singlet with gold studs, big smile
      buildFaceAndEyes(head, eyes, eyesGlow, skin, {
        irisColor: 0x2f74d0,
        bigSmile: true,
        browColor: 0xc98a2c,
      });
      // Blonde Mohawk crest (5 stylized fins from forehead over crown)
      for (let i = 0; i < 5; i++) {
        const t = i / 4;
        const ang = -0.45 + t * 1.15;
        const my = 0.16 + Math.cos(ang) * 0.125;
        const mz = 0.005 - Math.sin(ang) * 0.115;
        head.rbox(
          0.046,
          0.095 - Math.abs(t - 0.35) * 0.03,
          0.068,
          0.016,
          0xde8e3d,
          xform(0, my, mz, -ang, 0, 0),
          0xffe042,
          1
        );
      }
      // Scoop neckline skin chest plate + gold shoulder studs
      chest.rbox(0.14, 0.085, 0.03, 0.025, toneDark, xform(0, 0.205, chestD * 0.48), tone, 1);
      for (const sx of [-1, 1]) {
        chest.sphere(0.024, 0xffd438, xform(sx * 0.115, 0.238, 0.055), 8, 6);
      }
      break;
    }

    case 'sentinel': {
      // Sentinel: olive combat helmet + dark tactical visor, armored vest & mag pouches
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { hideEars: true, fierceBrow: true, irisColor: 0x3a2a1e });
      head.sphere(0.132, 0x3e4d36, xform(0, 0.188, -0.006, -0.08, 0, 0, 1.04, 0.88, 1.08), 14, 10, 0x5c7050);
      head.rbox(0.255, 0.045, 0.255, 0.016, 0x35422e, xform(0, 0.176, 0.004, -0.08, 0, 0), 0x4b5d43, 1);
      // Dark tactical ballistic goggles over eyes
      head.rbox(0.215, 0.058, 0.05, 0.018, 0x1a1d22, xform(0, 0.165, 0.104), 0x343c47, 1);
      head.box(0.185, 0.036, 0.054, 0x293845, xform(0, 0.165, 0.106));
      // Plate carrier vest + 3 ammo pouches + shoulder pauldrons
      chest.rbox(chestW * 0.88, 0.21, chestD + 0.035, 0.03, 0x323b2d, xform(0, 0.105, 0), 0x4b5d43, 1);
      for (const px of [-0.075, 0, 0.075]) {
        chest.rbox(0.058, 0.085, 0.035, 0.008, 0x232722, xform(px, 0.065, chestD * 0.5 + 0.025), 0x384035, 1);
      }
      for (const side of [armUL, armUR]) {
        side.rbox(0.13, 0.1, 0.13, 0.03, 0x2d3529, xform(0, -0.03, 0), 0x4b5d43, 1);
      }
      chestGlow.sphere(0.014, 0x5cff7a, xform(0.11, 0.19, chestD * 0.5 + 0.02), 6, 5);
      break;
    }

    case 'neon': {
      // Glitch: magenta asymmetrical cyber hair + glowing cyan visor & jacket neon trim
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { glowEyes: 0x19d8ff, browColor: 0x991580 });
      // Neon visor lens
      headGlow.rbox(0.21, 0.048, 0.04, 0.016, 0x19d8ff, xform(0, 0.163, 0.106), 0xb8f7ff, 1);
      // Magenta cyber hair
      head.sphere(0.124, 0x991882, xform(0, 0.19, -0.01, 0, 0, 0, 1.02, 0.86, 1.05), 12, 10, 0xff4ad8);
      head.rbox(0.11, 0.15, 0.16, 0.035, 0xb81d9c, xform(0.075, 0.155, 0.015, 0, 0, -0.18), 0xff5ce0, 1);
      // High cyber collar + glowing cyan strips
      chest.cyl(0.115, 0.13, 0.08, 0x252948, xform(0, 0.24, -0.01), 10, 0x3f487a, true);
      chestGlow.box(0.024, 0.22, 0.02, 0x19d8ff, xform(-0.075, 0.11, chestD * 0.5 + 0.008));
      chestGlow.box(0.024, 0.22, 0.02, 0x19d8ff, xform(0.075, 0.11, chestD * 0.5 + 0.008));
      break;
    }

    case 'dune': {
      // Dune Runner: sand desert cowl/hood + brass goggles on forehead + red desert scarf
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { hideEars: true, irisColor: 0x6e4720 });
      head.sphere(0.132, 0xb89c64, xform(0, 0.168, -0.012, 0, 0, 0, 1.04, 0.98, 1.08), 12, 10, 0xe6cf99);
      // Forehead desert goggles
      head.rbox(0.195, 0.046, 0.045, 0.014, 0x5a3b24, xform(0, 0.222, 0.098, -0.18, 0, 0), 0x8f623d, 1);
      for (const sx of [-1, 1]) {
        head.cyl(0.032, 0.032, 0.024, 0xebb446, xform(sx * 0.048, 0.222, 0.114, HALF_PI - 0.18, 0, 0), 10);
      }
      // Rust-red desert scarf + diagonal sash
      chest.torus(0.105, 0.034, 0xc0502c, xform(0, 0.232, 0, HALF_PI + 0.1, 0, 0), 7, 14);
      strutBox(chest, [-0.11, 0.23, chestD * 0.5 + 0.012], [0.12, -0.02, chestD * 0.5 + 0.012], 0.058, 0xc0502c, 0.02);
      break;
    }

    case 'frost': {
      // Frostbite: fur-trimmed white arctic parka hood + orange ski goggles
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { hideEars: true, faceMask: true });
      // Lower thermal mask
      head.rbox(0.19, 0.09, 0.14, 0.03, 0x2d3542, xform(0, 0.092, 0.055), 0x414c5e, 1);
      // Parka hood + fluffy fur trim ring
      head.sphere(0.138, 0xcfd6de, xform(0, 0.165, -0.018, 0, 0, 0, 1.05, 1.02, 1.1), 12, 10, 0xffffff);
      head.torus(0.118, 0.032, 0xe8edf2, xform(0, 0.152, 0.068, 0.08, 0, 0), 8, 16);
      // Reflective safety-orange ski goggles
      head.rbox(0.195, 0.062, 0.048, 0.02, 0x262c36, xform(0, 0.166, 0.104), 0x3b4350, 1);
      head.rbox(0.175, 0.046, 0.052, 0.014, 0xde701d, xform(0, 0.166, 0.106), 0xffa838, 1);
      // Orange front parka zipper stripe
      chest.box(0.034, 0.25, 0.022, 0xde7a1f, xform(0, 0.115, chestD * 0.5 + 0.008));
      spine.box(0.032, 0.18, 0.02, 0xde7a1f, xform(0, 0.085, chestD * 0.45 + 0.008));
      break;
    }

    case 'kick': {
      // Kickflip: hot-pink hair + backwards purple/mint snapback cap + street graphic
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0x4a2e1b, browColor: 0x3a1c28 });
      // Hot pink hair locks
      head.sphere(0.122, 0xc73892, xform(0, 0.182, -0.006, 0, 0, 0, 1.02, 0.86, 1.04), 12, 10, 0xff6ec4);
      for (const sx of [-1, 1]) {
        head.rbox(0.045, 0.13, 0.085, 0.02, 0xd946a0, xform(sx * 0.102, 0.115, 0.015), 0xff75c8, 1);
      }
      // Backwards skate cap (crown + bill pointing -Z)
      head.sphere(0.126, 0x6b3ec7, xform(0, 0.205, -0.005, -0.1, 0, 0, 1.02, 0.72, 1.04), 12, 8, 0x9262f0);
      head.rbox(0.15, 0.022, 0.12, 0.01, 0x3ddec0, xform(0, 0.186, -0.145, -0.15, 0, 0), 0x72ffe5, 1);
      // Streetwear chest stripe
      chest.box(chestW + 0.012, 0.055, chestD + 0.012, 0x3ddec0, xform(0, 0.145, 0));
      chest.box(chestW + 0.016, 0.024, chestD + 0.016, 0xded23d, xform(0, 0.11, 0));
      break;
    }

    case 'valor': {
      // Valor: silver medieval knight great-helm with gold crown & plume + breastplate & pauldrons
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { fullHelmet: true, hideEars: true });
      head.cyl(0.126, 0.134, 0.255, 0x9aa3b0, xform(0, 0.155, 0.005), 14, 0xdce3ed);
      head.sphere(0.126, 0xb8c0cb, xform(0, 0.265, 0.005, 0, 0, 0, 1, 0.65, 1), 14, 8, 0xeaf0f8);
      // T-shaped dark visor slit + gold cross trim
      head.box(0.16, 0.028, 0.03, 0x161a22, xform(0, 0.172, 0.122));
      head.box(0.028, 0.11, 0.03, 0x161a22, xform(0, 0.135, 0.122));
      head.torus(0.128, 0.018, 0xdeb83a, xform(0, 0.235, 0.005, HALF_PI, 0, 0), 6, 16);
      // Heroic golden-red crest plume
      head.rbox(0.042, 0.11, 0.22, 0.02, 0xc9382b, xform(0, 0.335, -0.02, -0.15, 0, 0), 0xf0b938, 1);
      // Steel breastplate + gold emblem + layered knight pauldrons
      chest.rbox(chestW + 0.025, 0.25, chestD + 0.03, 0.05, 0x8f98a6, xform(0, 0.12, 0), 0xdde5f0, 2);
      chest.rbox(0.08, 0.11, 0.025, 0.015, 0xdeb83a, xform(0, 0.135, chestD * 0.5 + 0.02), 0xffe070, 1);
      for (const side of [armUL, armUR]) {
        side.sphere(0.095, 0x9aa3b0, xform(0, -0.015, 0, 0, 0, 0, 1.05, 0.85, 1.05), 10, 8, 0xe2eaf5);
        side.torus(0.085, 0.014, 0xdeb83a, xform(0, -0.055, 0, HALF_PI, 0, 0), 6, 12);
      }
      break;
    }

    case 'orbit': {
      // Orbit: white astronaut EVA bubble helmet + reflective blue visor + life-support backpack
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { fullHelmet: true, hideEars: true });
      head.sphere(0.158, 0xd8dfe8, xform(0, 0.165, 0.005), 16, 12, 0xffffff);
      head.sphere(0.138, 0x1d4fa8, xform(0, 0.162, 0.038, 0, 0, 0, 0.96, 0.82, 0.92), 14, 10, 0x4fb0ff);
      head.torus(0.12, 0.02, 0x8d96a3, xform(0, 0.042, 0.005, HALF_PI, 0, 0), 6, 16);
      // Comms antenna on right side of helmet
      head.cyl(0.008, 0.012, 0.14, 0x8d96a3, xform(-0.155, 0.24, -0.01), 6);
      headGlow.sphere(0.018, 0x38d6ff, xform(-0.155, 0.315, -0.01), 6, 5);
      // EVA life-support backpack + chest control unit
      chest.rbox(0.24, 0.26, 0.12, 0.03, 0xc5cdd6, xform(0, 0.12, -chestD * 0.5 - 0.055), 0xf5f8fc, 1);
      chest.rbox(0.13, 0.1, 0.035, 0.012, 0x2a6cde, xform(0, 0.13, chestD * 0.5 + 0.016), 0x5aa0ff, 1);
      chestGlow.box(0.075, 0.022, 0.04, 0x4bf07a, xform(0, 0.145, chestD * 0.5 + 0.018));
      for (const side of [armUL, armUR]) {
        side.cyl(armR + 0.012, armR + 0.012, 0.032, 0x2a6cde, xform(0, -0.09, 0), 10);
      }
      break;
    }

    case 'rex': {
      // Rex Onesie: face inside open T-Rex dino hood with snout, teeth, dino eyes, orange spikes & dino tail!
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { hideEars: true, irisColor: 0x3c7828, bigSmile: true });
      // Dino hood back/sides + protruding upper T-Rex snout over forehead
      head.sphere(0.142, 0x3f9a3a, xform(0, 0.175, -0.018, 0, 0, 0, 1.04, 1.02, 1.1), 12, 10, 0x5fd455);
      head.rbox(0.185, 0.095, 0.19, 0.035, 0x44a63e, xform(0, 0.262, 0.055, -0.1, 0, 0), 0x62db58, 1);
      // Googly yellow dino eyes on sides of upper snout
      for (const sx of [-1, 1]) {
        head.sphere(0.026, 0xffe44d, xform(sx * 0.092, 0.285, 0.055), 8, 6);
        head.sphere(0.012, 0x151a15, xform(sx * 0.108, 0.285, 0.064), 6, 5);
      }
      // White triangular T-Rex teeth along upper jaw rim
      for (let t = -3; t <= 3; t++) {
        head.cone(0.014, 0.032, 0xffffff, xform(t * 0.024, 0.208, 0.132, Math.PI, 0, 0), 4);
      }
      // Orange dorsal dino spikes down head, back, and dino tail!
      for (let s = 0; s < 3; s++) {
        head.cone(0.028, 0.068, 0xde8a3a, xform(0, 0.29 - s * 0.075, -0.07 - s * 0.045, -1.0 - s * 0.25, 0, 0), 4, 0xffb347);
      }
      for (let s = 0; s < 3; s++) {
        chest.cone(0.032, 0.075, 0xde8a3a, xform(0, 0.21 - s * 0.09, -chestD * 0.5 - 0.03, -HALF_PI, 0, 0), 4, 0xffb347);
      }
      // Cream dino belly patch
      chest.rbox(chestW * 0.68, 0.21, 0.026, 0.03, 0xcfcba0, xform(0, 0.1, chestD * 0.48), 0xebebc2, 1);
      spine.rbox(waistW * 0.7, 0.16, 0.024, 0.025, 0xcfcba0, xform(0, 0.08, chestD * 0.44), 0xebebc2, 1);
      // Dino tail curving out from hips!
      hips.cone(0.078, 0.34, 0x3f9a3a, xform(0, -0.02, -0.22, -1.18, 0, 0), 8, 0x5fd455);
      hips.cone(0.024, 0.055, 0xde8a3a, xform(0, 0.045, -0.2, -0.35, 0, 0), 4, 0xffb347);
      break;
    }

    case 'patch': {
      // Patch: dark hair + top bun + teal headband + field medic vest with red cross badge
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0x382318 });
      head.sphere(0.122, 0x160e0c, xform(0, 0.184, -0.01, 0, 0, 0, 1.0, 0.88, 1.05), 12, 10, 0x2e1f1b);
      head.sphere(0.058, 0x160e0c, xform(0, 0.278, -0.065), 10, 8, 0x2e1f1b);
      // Teal bandana headband
      head.cyl(0.118, 0.118, 0.036, 0x1b8f86, xform(0, 0.205, 0.002, -0.08, 0, 0), 14, 0x28d1c3, true);
      // Teal utility vest over white shirt + red medic cross emblem
      for (const sx of [-1, 1]) {
        chest.rbox(0.095, 0.23, chestD + 0.025, 0.02, 0x1b8f86, xform(sx * 0.092, 0.112, 0), 0x28cfc2, 1);
      }
      chest.box(0.048, 0.016, 0.02, 0xde3a3a, xform(-0.088, 0.165, chestD * 0.5 + 0.016));
      chest.box(0.016, 0.048, 0.02, 0xde3a3a, xform(-0.088, 0.165, chestD * 0.5 + 0.016));
      break;
    }

    case 'valkyrie': {
      // Valkyrie: flowing blonde hair, white/gold armor, winged circlet
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0x2b6fd6 });
      head.sphere(0.124, hairDark, xform(0, 0.19, -0.01, 0, 0, 0, 1.02, 0.88, 1.05), 12, 10, hairLight);
      head.rbox(0.2, 0.2, 0.1, 0.03, hair, xform(0, 0.12, -0.075), hairLight, 1);
      head.rbox(0.05, 0.16, 0.08, 0.02, hair, xform(-0.09, 0.14, -0.02), hairLight, 1);
      head.rbox(0.05, 0.16, 0.08, 0.02, hair, xform(0.09, 0.14, -0.02), hairLight, 1);
      head.torus(0.11, 0.014, 0xf2c230, xform(0, 0.225, 0.02, 0.3, 0, 0), 6, 16);
      chest.cyl(0.12, 0.15, 0.06, 0xf2c230, xform(0, 0.22, 0), 10, 0xffe838);
      break;
    }
    case 'mirage': {
      // Mirage: pink twin-tails, purple/pink outfit
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0x8a2be2 });
      head.sphere(0.122, hairDark, xform(0, 0.19, -0.01, 0, 0, 0, 1.02, 0.86, 1.05), 12, 10, hairLight);
      for (const sx of [-1, 1]) {
        head.capsule(0.032, 0.16, hair, xform(sx * 0.13, 0.12, -0.02, 0, 0, sx * 0.15), hairLight);
        head.sphere(0.02, 0xff7ad9, xform(sx * 0.115, 0.21, 0), 8, 6);
      }
      chestGlow.box(0.02, 0.18, 0.018, 0xff7ad9, xform(0, 0.12, chestD * 0.5 + 0.008));
      break;
    }
    case 'sable': {
      // Sable: sleek black bob, red accents
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0xe8402e });
      head.sphere(0.123, hairDark, xform(0, 0.185, -0.01, 0, 0, 0, 1.03, 0.9, 1.06), 12, 10, hairLight);
      head.rbox(0.21, 0.14, 0.12, 0.03, hair, xform(0, 0.14, -0.04), hairLight, 1);
      chestGlow.box(0.024, 0.2, 0.02, 0xe8402e, xform(-0.07, 0.11, chestD * 0.5 + 0.008));
      chestGlow.box(0.024, 0.2, 0.02, 0xe8402e, xform(0.07, 0.11, chestD * 0.5 + 0.008));
      break;
    }
    case 'aurora': {
      // Aurora: teal flowing hair, northern lights theme
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0x3ce0c0 });
      head.sphere(0.124, hairDark, xform(0, 0.19, -0.01, 0, 0, 0, 1.02, 0.88, 1.05), 12, 10, hairLight);
      head.rbox(0.19, 0.22, 0.09, 0.03, hair, xform(0, 0.11, -0.07), hairLight, 1);
      headGlow.rbox(0.16, 0.02, 0.03, 0.008, 0x3ce0c0, xform(0, 0.2, 0.1), 0xb8fff0, 1);
      break;
    }
    case 'ember': {
      // Ember: fiery orange ponytail
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0xff8c1a });
      head.sphere(0.123, hairDark, xform(0, 0.19, -0.01, 0, 0, 0, 1.02, 0.87, 1.05), 12, 10, hairLight);
      head.capsule(0.035, 0.18, hair, xform(0, 0.1, -0.1, 0.3, 0, 0), hairLight);
      head.sphere(0.022, 0xff8c1a, xform(0, 0.22, -0.02), 8, 6);
      chestGlow.box(0.022, 0.19, 0.02, 0xff8c1a, xform(0, 0.12, chestD * 0.5 + 0.008));
      break;
    }
    case 'titan': {
      // Titan: bulky steel armor, short dark hair
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0x5a7a9a });
      head.sphere(0.126, hairDark, xform(0, 0.195, -0.01, 0, 0, 0, 1.03, 0.82, 1.05), 12, 10, hairLight);
      chest.rbox(chestW * 0.9, 0.22, chestD + 0.04, 0.04, 0x3d4a5a, xform(0, 0.11, 0), 0x5a6a7a, 1);
      chest.rbox(0.1, 0.08, 0.03, 0.01, 0xf2c230, xform(0, 0.16, chestD * 0.5 + 0.01), 0xffe838, 1);
      break;
    }
    case 'viper': {
      // Viper: green mohawk, tactical gear
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0x3cb043 });
      head.rbox(0.05, 0.09, 0.2, 0.02, hair, xform(0, 0.25, 0), hairLight, 1);
      head.sphere(0.12, hairDark, xform(0, 0.185, -0.01, 0, 0, 0, 1.02, 0.85, 1.05), 12, 10, hairLight);
      chest.rbox(chestW * 0.85, 0.2, chestD + 0.03, 0.03, 0x1e3a1e, xform(0, 0.11, 0), 0x2d5a2d, 1);
      break;
    }
    case 'cobalt': {
      // Cobalt: blue/silver, sleek hair
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0x2a6cf0 });
      head.sphere(0.124, hairDark, xform(0, 0.19, -0.01, 0, 0, 0, 1.02, 0.84, 1.05), 12, 10, hairLight);
      head.rbox(0.2, 0.06, 0.1, 0.025, hair, xform(0, 0.235, 0.05, -0.15, 0, 0), hairLight, 1);
      chestGlow.box(0.02, 0.2, 0.018, 0x2a6cf0, xform(0, 0.12, chestD * 0.5 + 0.008));
      break;
    }
    case 'onyx': {
      // Onyx: black/gold, slicked hair
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0xf2c230 });
      head.sphere(0.124, hairDark, xform(0, 0.19, -0.01, 0, 0, 0, 1.02, 0.84, 1.05), 12, 10, hairLight);
      head.rbox(0.19, 0.05, 0.09, 0.02, hair, xform(0, 0.23, 0.04, -0.1, 0, 0), hairLight, 1);
      chest.rbox(chestW * 0.88, 0.21, chestD + 0.035, 0.03, 0x1a1a1a, xform(0, 0.11, 0), 0x2a2a2a, 1);
      chest.rbox(0.09, 0.07, 0.025, 0.01, 0xf2c230, xform(0, 0.15, chestD * 0.5 + 0.01), 0xffe838, 1);
      break;
    }
    case 'blaze': {
      // Blaze: red/orange, spiky hair
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0xff5a1a });
      head.sphere(0.124, hairDark, xform(0, 0.19, -0.01, 0, 0, 0, 1.02, 0.85, 1.05), 12, 10, hairLight);
      for (let i = 0; i < 4; i++) {
        head.cone(0.025, 0.07, hair, xform(-0.06 + i * 0.04, 0.27, 0.02, 0, 0, -0.2 + i * 0.13), 5, hairLight);
      }
      chestGlow.box(0.022, 0.19, 0.02, 0xff5a1a, xform(0, 0.12, chestD * 0.5 + 0.008));
      break;
    }
    case 'nova': {
      // Nova: white/cyan sky warrior, glowing visor + twin tails
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0x00e5ff, glowEyes: 0x00e5ff });
      head.sphere(0.124, hairDark, xform(0, 0.19, -0.01, 0, 0, 0, 1.02, 0.84, 1.05), 12, 10, hairLight);
      head.rbox(0.2, 0.05, 0.09, 0.02, hair, xform(0, 0.235, 0.04, -0.12, 0, 0), hairLight, 1);
      for (const sx of [-1, 1]) {
        head.rbox(0.045, 0.14, 0.06, 0.018, hair, xform(sx * 0.11, 0.16, -0.06, 0.2, 0, sx * 0.25), hairLight, 1);
      }
      chestGlow.box(0.02, 0.2, 0.018, 0x00e5ff, xform(0, 0.12, chestD * 0.5 + 0.008));
      chest.rbox(chestW * 0.86, 0.2, chestD + 0.03, 0.03, 0xe8f8ff, xform(0, 0.11, 0), 0xffffff, 1);
      break;
    }
    case 'vortex': {
      // Vortex: purple/black void armor, glowing core + horned helm
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0xb96bff, glowEyes: 0x7b2fff, fierceBrow: true });
      head.sphere(0.128, 0x1a1030, xform(0, 0.19, -0.01, 0, 0, 0, 1.04, 0.9, 1.06), 12, 10, 0x3b2863);
      for (const sx of [-1, 1]) {
        head.cone(0.028, 0.1, 0x2c1a4a, xform(sx * 0.1, 0.26, 0, 0, 0, sx * -0.5), 5, 0x7b2fff);
      }
      chest.rbox(chestW * 0.9, 0.22, chestD + 0.04, 0.03, 0x1a1030, xform(0, 0.11, 0), 0x2c1a4a, 1);
      chestGlow.ico(0.03, 0xb96bff, xform(0, 0.15, chestD * 0.5 + 0.015), 0);
      chestGlow.box(0.02, 0.18, 0.018, 0x7b2fff, xform(0, 0.1, chestD * 0.5 + 0.008));
      break;
    }
    case 'phoenix': {
      // Phoenix: orange/red flame, feather crest + ember glow
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0xff8c1a, glowEyes: 0xff5a1a });
      head.sphere(0.124, hairDark, xform(0, 0.19, -0.01, 0, 0, 0, 1.02, 0.85, 1.05), 12, 10, hairLight);
      for (let i = 0; i < 5; i++) {
        head.cone(0.022, 0.09, hair, xform(-0.07 + i * 0.035, 0.28, -0.02, -0.3, 0, -0.3 + i * 0.15), 5, hairLight);
      }
      chestGlow.box(0.022, 0.19, 0.02, 0xff8c1a, xform(0, 0.12, chestD * 0.5 + 0.008));
      chest.rbox(chestW * 0.86, 0.2, chestD + 0.03, 0.03, 0xff5a1a, xform(0, 0.11, 0), 0xff8c1a, 1);
      break;
    }
    case 'ghost': {
      // Ghost: white/grey stealth, full mask + hood
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { hideEars: true, faceMask: true, glowEyes: 0x00e5ff, browColor: 0x8a94a6 });
      head.rbox(0.19, 0.092, 0.135, 0.028, 0xd8dee9, xform(0, 0.09, 0.056), 0xffffff, 1);
      head.sphere(0.134, 0xe8ecf1, xform(0, 0.175, -0.014, 0, 0, 0, 1.04, 1.0, 1.1), 12, 10, 0xffffff);
      head.cone(0.11, 0.12, 0xd8dee9, xform(0, 0.25, -0.035, -0.35, 0, 0), 6, 0xffffff);
      chest.rbox(chestW * 0.88, 0.21, chestD + 0.035, 0.03, 0xe8ecf1, xform(0, 0.11, 0), 0xffffff, 1);
      chestGlow.box(0.018, 0.18, 0.016, 0x00e5ff, xform(0, 0.12, chestD * 0.5 + 0.008));
      break;
    }
    case 'storm': {
      // Storm: blue/grey tempest, lightning streak + windswept hair
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0x4a90e2 });
      head.sphere(0.124, hairDark, xform(0, 0.19, -0.01, 0, 0, 0, 1.02, 0.85, 1.05), 12, 10, hairLight);
      head.rbox(0.2, 0.07, 0.1, 0.025, hair, xform(0, 0.24, 0.03, -0.25, 0, 0.15), hairLight, 1);
      chestGlow.box(0.018, 0.2, 0.016, 0x7ac2ff, xform(0, 0.12, chestD * 0.5 + 0.008));
      chest.rbox(chestW * 0.86, 0.2, chestD + 0.03, 0.03, 0x2a4a7a, xform(0, 0.11, 0), 0x4a90e2, 1);
      break;
    }
    case 'lunar': {
      // Lunar: silver/purple moon knight, crescent helm + star glow
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0xc8b8ff, glowEyes: 0xc8b8ff });
      head.sphere(0.126, 0x9a94b8, xform(0, 0.19, -0.01, 0, 0, 0, 1.03, 0.88, 1.05), 12, 10, 0xd8d0f0);
      head.rbox(0.2, 0.045, 0.09, 0.02, hair, xform(0, 0.235, 0.04, -0.1, 0, 0), hairLight, 1);
      chest.rbox(chestW * 0.88, 0.21, chestD + 0.035, 0.03, 0x8a84a8, xform(0, 0.11, 0), 0xc8b8ff, 1);
      chestGlow.ico(0.026, 0xe8e0ff, xform(0, 0.16, chestD * 0.5 + 0.015), 0);
      break;
    }
    case 'solar': {
      // Solar: gold/white sun warrior, radiant crown + halo glow
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0xffd700, glowEyes: 0xffd700 });
      head.sphere(0.124, hairDark, xform(0, 0.19, -0.01, 0, 0, 0, 1.02, 0.85, 1.05), 12, 10, hairLight);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        head.cone(0.018, 0.06, 0xffd700, xform(Math.cos(a) * 0.09, 0.27, Math.sin(a) * 0.09, 0, 0, 0), 4, 0xfff0a0);
      }
      chestGlow.box(0.022, 0.19, 0.02, 0xffd700, xform(0, 0.12, chestD * 0.5 + 0.008));
      chest.rbox(chestW * 0.86, 0.2, chestD + 0.03, 0.03, 0xffd700, xform(0, 0.11, 0), 0xfff0a0, 1);
      break;
    }
    case 'echo': {
      // Echo: teal/black signal, antenna + sound-wave glow
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0x3ce0c0, glowEyes: 0x3ce0c0 });
      head.sphere(0.124, hairDark, xform(0, 0.19, -0.01, 0, 0, 0, 1.02, 0.85, 1.05), 12, 10, hairLight);
      head.cyl(0.008, 0.008, 0.12, 0x2a2a2a, xform(0.08, 0.3, 0), 6);
      head.sphere(0.016, 0x3ce0c0, xform(0.08, 0.365, 0), 8, 6);
      chestGlow.box(0.02, 0.19, 0.018, 0x3ce0c0, xform(0, 0.12, chestD * 0.5 + 0.008));
      chest.rbox(chestW * 0.86, 0.2, chestD + 0.03, 0.03, 0x1a3a34, xform(0, 0.11, 0), 0x3ce0c0, 1);
      break;
    }
    case 'webhero': {
      // Red and blue acrobat suit with hand-built web seams and expressive white lenses.
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { fullHelmet:true, hideEars:true });
      head.rbox(.235,.245,.23,.083,0xc22e37,xform(0,.15,0),0xf55050,2);
      for (const sx of [-1,1]) {
        head.rbox(.090,.055,.025,.018,0x182335,xform(sx*.05,.17,.115,0,0,sx*.28),0x202531,1);
        head.rbox(.067,.033,.012,.01,0xf5ffff,xform(sx*.05,.17,.132,0,0,sx*.28),0xffffff,1);
        for(let i=0;i<3;i++) strutBox(head,[sx*.01,.07+i*.055,.119],[sx*.105,.08+i*.055,.085],.006,0x521d2a,.006);
        strutBox(head,[sx*.015,.05,.118],[sx*.085,.255,.085],.006,0x521d2a,.006);
      }
      chest.rbox(chestW*.86,.21,chestD+.02,.025,0xc52d37,xform(0,.11,0),0xee5050,1);
      for(let i=0;i<4;i++) chest.box(chestW*.75,.005,.01,0x5b202b,xform(0,.055+i*.045,chestD*.5+.015));
      chest.ico(.027,0x1a2832,xform(0,.16,chestD*.5+.022,0,0,0,1,1.5,.35),0);
      for(const sx of [-1,1]) for(let i=0;i<3;i++) strutBox(chest,[0,.16,chestD*.5+.025],[sx*.06,.19-i*.035,chestD*.5+.025],.006,0x18232b,.006);
      break;
    }
    case 'cosmicllama': {
      // Astronaut-llama silhouette with tall ears, muzzle, visor and luminous backpack panels.
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { fullHelmet:true, hideEars:true });
      head.rbox(.24,.22,.24,.07,0x9c63b4,xform(0,.15,-.01),0xe7a8ee,2);
      for(const sx of [-1,1]) {
        head.rbox(.055,.15,.065,.02,0xa968b8,xform(sx*.075,.31,-.02,0,0,sx*-.12),0xf1afe9,1);
        head.rbox(.025,.095,.02,.009,0xf4a5d6,xform(sx*.075,.32,.02),0xffd6f1,1);
      }
      head.rbox(.19,.07,.05,.025,0x2a344c,xform(0,.175,.12),0x5f6981,1);
      headGlow.rbox(.13,.027,.014,.009,0xf77bdb,xform(0,.175,.15),0xffd8fa,1);
      head.rbox(.115,.06,.09,.02,0xe8b7cb,xform(0,.085,.12),0xffe4e9,1);
      chest.rbox(chestW*.9,.20,chestD+.04,.04,0x684693,xform(0,.11,0),0xb07dd1,1);
      chest.rbox(.12,.13,.035,.015,0xc3944c,xform(0,.13,chestD*.5+.02),0xfbe39b,1);
      chestGlow.ico(.024,0xffc96a,xform(0,.15,chestD*.5+.045),1,0xffffdf);
      break;
    }
    case 'foundation': {
      // Segmented seven-inspired armor: layered helmet, visor, pauldrons and a luminous core.
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { fullHelmet: true, hideEars: true });
      head.rbox(0.25,0.24,0.25,0.065,0x34474a,xform(0,0.16,0),0x819a99,2);
      head.rbox(0.205,0.072,0.035,0.014,0x142e32,xform(0,0.172,0.128),0x597f79,1);
      eyesGlow.rbox(0.145,0.018,0.012,0.004,0x63f8ca,xform(0,0.015,0.15),0xc5fff0,1);
      head.box(0.025,0.16,0.028,0x9cb4ae,xform(0,0.23,0.12));
      for (const sx of [-1,1]) {
        head.rbox(0.035,0.11,0.1,0.012,0x657d79,xform(sx*.122,.12,0),0xaac4b7,1);
        chest.rbox(.105,.08,.15,.018,0x768b83,xform(sx*.17,.225,0,0,0,sx*.18),0xb8cec1,1);
        chest.rbox(.035,.12,.025,.008,0xc79c48,xform(sx*.11,.12,chestD*.55),0xf5d37a,1);
      }
      chest.rbox(chestW*.86,.19,chestD+.045,.025,0x425a58,xform(0,.12,0),0x849b93,1);
      chestGlow.ico(.035,0x5fffd2,xform(0,.15,chestD*.5+.03),1,0xd3fff5);
      break;
    }
    case 'islandscout': {
      // Explorer with swept hair, an asymmetrical scarf, vest, map pocket and field goggles.
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { irisColor: 0x527a55 });
      head.sphere(.125,0x4b3025,xform(0,.19,-.018,0,0,0,1.03,.88,1.04),14,10,0x81573a);
      head.rbox(.23,.055,.12,.018,0x60412c,xform(.015,.235,.05,-.18,.1,-.14),0x99704a,1);
      head.torus(.055,.009,0xe5c982,xform(-.055,.234,.103,0,0,0),6,12);
      head.torus(.055,.009,0xe5c982,xform(.055,.234,.103,0,0,0),6,12);
      chest.torus(.09,.025,0xe6bf57,xform(0,.225,0,HALF_PI,0,0),7,14);
      chest.cone(.045,.10,0xd69d3e,xform(.055,.185,.1,Math.PI-.2,0,-.2),4,0xffdc81);
      chest.rbox(chestW*.84,.18,chestD+.02,.018,0x526d51,xform(0,.11,0),0x8da97c,1);
      for (const sx of [-1,1]) {
        chest.rbox(.068,.07,.022,.008,0x3c513c,xform(sx*.075,.08,chestD*.5+.015),0x95a881,1);
        chest.box(.055,.008,.025,0xd4bd82,xform(sx*.075,.1,chestD*.5+.028));
      }
      hips.rbox(.085,.10,.09,.015,0x775939,xform(.12,-.02,-.02),0xb58c59,1);
      break;
    }
    case 'icewarden': {
      // Arctic expedition suit with insulated collar, snow goggles and ice-blue plates.
      buildFaceAndEyes(head, eyes, eyesGlow, skin, { hideEars:true, faceMask:true });
      head.sphere(.132,0x4a7285,xform(0,.18,-.012,0,0,0,1.04,.96,1.08),14,10,0xa2ced7);
      head.rbox(.21,.10,.10,.025,0x314e60,xform(0,.11,.08),0x7195a3,1);
      head.rbox(.22,.055,.035,.018,0x263e4b,xform(0,.18,.13),0xd7eef1,1);
      headGlow.rbox(.17,.023,.012,.006,0x88e4fa,xform(0,.18,.153),0xe7ffff,1);
      chest.torus(.12,.035,0xcce0df,xform(0,.23,0,HALF_PI,0,0),8,16);
      chest.rbox(chestW*.88,.20,chestD+.04,.03,0x537888,xform(0,.11,0),0xa6cad5,1);
      for(const sx of [-1,1]) {
        chest.rbox(.08,.06,.14,.014,0x9abcc6,xform(sx*.15,.21,0,0,0,sx*.14),0xe0f4f4,1);
        chest.box(.018,.14,.012,0xc8e9f0,xform(sx*.075,.12,chestD*.5+.025));
      }
      chestGlow.ico(.027,0x8fe7ff,xform(0,.15,chestD*.5+.025),1,0xdafaff);
      break;
    }
    case 'shade':
    default: {
      // Nightshade: dark pointed assassin hood, face mask, glowing violet eyes & shoulder cowl
      buildFaceAndEyes(head, eyes, eyesGlow, skin, {
        hideEars: true,
        faceMask: true,
        glowEyes: 0xc278ff,
        browColor: 0x3b245e,
      });
      // Lower assassin mask
      head.rbox(0.19, 0.092, 0.135, 0.028, 0x1c172b, xform(0, 0.09, 0.056), 0x2c2445, 1);
      // Pointed stealth cowl/hood
      head.sphere(0.136, 0x211c33, xform(0, 0.175, -0.014, 0, 0, 0, 1.04, 1.0, 1.1), 12, 10, 0x3b3059);
      head.cone(0.115, 0.14, 0x2c2445, xform(0, 0.255, -0.035, -0.35, 0, 0), 6, 0x6a3fb0);
      // Violet shoulder mantle + glowing amethyst chest sigil
      chest.cyl(0.13, 0.175, 0.09, 0x3b2863, xform(0, 0.215, 0), 10, 0x6a3fb0);
      chestGlow.ico(0.026, 0xb96bff, xform(0, 0.165, chestD * 0.5 + 0.015), 0);
      break;
    }
  }

  const buildOrNull = (gb) => (gb.vertexCount > 0 ? gb.build() : null);

  cached = {
    hips: buildOrNull(hips),
    spine: buildOrNull(spine),
    chest: buildOrNull(chest),
    head: buildOrNull(head),
    eyes: buildOrNull(eyes),
    armUL: buildOrNull(armUL),
    armUR: buildOrNull(armUR),
    armLL: buildOrNull(armLL),
    armLR: buildOrNull(armLR),
    legUL: buildOrNull(legUL),
    legUR: buildOrNull(legUR),
    legLL: buildOrNull(legLL),
    legLR: buildOrNull(legLR),
    footL: buildOrNull(footL),
    footR: buildOrNull(footR),
    chestGlow: buildOrNull(chestGlow),
    headGlow: buildOrNull(headGlow),
    eyesGlow: buildOrNull(eyesGlow),
    legGlowL: buildOrNull(legGlowL),
    legGlowR: buildOrNull(legGlowR),
  };
  partCache.set(skin.id, cached);
  return cached;
}
