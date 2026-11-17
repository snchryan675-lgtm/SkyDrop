import {
  BoxGeometry,
  BufferGeometry,
  CapsuleGeometry,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Euler,
  Float32BufferAttribute,
  IcosahedronGeometry,
  Matrix3,
  Matrix4,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Quaternion,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from 'three';

const _uvVec = new Vector3();

function computeRoundedBoxUv(faceDir, normal, uAxis, vAxis, radius, sideLen) {
  const arcLen = (2 * Math.PI * radius) / 4;
  const edgeLen = Math.max(sideLen - 2 * radius, 0);
  const quarterPi = Math.PI / 4;
  _uvVec.copy(normal);
  _uvVec[vAxis] = 0;
  _uvVec.normalize();
  const cornerRatio = (0.5 * arcLen) / (arcLen + edgeLen);
  const angleRatio = 1 - _uvVec.angleTo(faceDir) / quarterPi;
  if (Math.sign(_uvVec[uAxis]) === 1) {
    return angleRatio * cornerRatio;
  }
  return edgeLen / (arcLen + edgeLen) + cornerRatio + cornerRatio * (1 - angleRatio);
}

export class RoundedBoxGeometry extends BoxGeometry {
  constructor(width = 1, height = 1, depth = 1, segments = 2, radius = 0.1) {
    const segs = segments * 2 + 1;
    radius = Math.min(width / 2, height / 2, depth / 2, radius);
    super(1, 1, 1, segs, segs, segs);
    this.type = 'RoundedBoxGeometry';
    this.parameters = { width, height, depth, segments, radius };
    if (segs === 1) return;

    const nonIndexed = this.toNonIndexed();
    this.index = null;
    this.attributes.position = nonIndexed.attributes.position;
    this.attributes.normal = nonIndexed.attributes.normal;
    this.attributes.uv = nonIndexed.attributes.uv;

    const pos = new Vector3();
    const norm = new Vector3();
    const halfInner = new Vector3(width, height, depth).divideScalar(2).subScalar(radius);
    const positions = this.attributes.position.array;
    const normals = this.attributes.normal.array;
    const uvs = this.attributes.uv.array;
    const faceStride = positions.length / 6;
    const faceDir = new Vector3();
    const nudge = 0.5 / segs;

    for (let i = 0, j = 0; i < positions.length; i += 3, j += 2) {
      pos.fromArray(positions, i);
      norm.copy(pos);
      norm.x -= Math.sign(norm.x) * nudge;
      norm.y -= Math.sign(norm.y) * nudge;
      norm.z -= Math.sign(norm.z) * nudge;
      norm.normalize();

      positions[i + 0] = halfInner.x * Math.sign(pos.x) + norm.x * radius;
      positions[i + 1] = halfInner.y * Math.sign(pos.y) + norm.y * radius;
      positions[i + 2] = halfInner.z * Math.sign(pos.z) + norm.z * radius;
      normals[i + 0] = norm.x;
      normals[i + 1] = norm.y;
      normals[i + 2] = norm.z;

      switch (Math.floor(i / faceStride)) {
        case 0:
          faceDir.set(1, 0, 0);
          uvs[j + 0] = computeRoundedBoxUv(faceDir, norm, 'z', 'y', radius, depth);
          uvs[j + 1] = 1 - computeRoundedBoxUv(faceDir, norm, 'y', 'z', radius, height);
          break;
        case 1:
          faceDir.set(-1, 0, 0);
          uvs[j + 0] = 1 - computeRoundedBoxUv(faceDir, norm, 'z', 'y', radius, depth);
          uvs[j + 1] = 1 - computeRoundedBoxUv(faceDir, norm, 'y', 'z', radius, height);
          break;
        case 2:
          faceDir.set(0, 1, 0);
          uvs[j + 0] = 1 - computeRoundedBoxUv(faceDir, norm, 'x', 'z', radius, width);
          uvs[j + 1] = computeRoundedBoxUv(faceDir, norm, 'z', 'x', radius, depth);
          break;
        case 3:
          faceDir.set(0, -1, 0);
          uvs[j + 0] = 1 - computeRoundedBoxUv(faceDir, norm, 'x', 'z', radius, width);
          uvs[j + 1] = 1 - computeRoundedBoxUv(faceDir, norm, 'z', 'x', radius, depth);
          break;
        case 4:
          faceDir.set(0, 0, 1);
          uvs[j + 0] = 1 - computeRoundedBoxUv(faceDir, norm, 'x', 'y', radius, width);
          uvs[j + 1] = 1 - computeRoundedBoxUv(faceDir, norm, 'y', 'x', radius, height);
          break;
        case 5:
          faceDir.set(0, 0, -1);
          uvs[j + 0] = computeRoundedBoxUv(faceDir, norm, 'x', 'y', radius, width);
          uvs[j + 1] = 1 - computeRoundedBoxUv(faceDir, norm, 'y', 'x', radius, height);
          break;
      }
    }
  }
}

const _euler = new Euler();
const _quat = new Quaternion();
const _pos = new Vector3();
const _scale = new Vector3();

export function xform(x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
  _quat.setFromEuler(_euler.set(rx, ry, rz, 'XYZ'));
  return new Matrix4().compose(_pos.set(x, y, z), _quat, _scale.set(sx, sy, sz));
}

const _colA = new Color();
const _colB = new Color();

function toColor(input, target) {
  return typeof input === 'number' ? target.setHex(input) : target.copy(input);
}

export function shadeHex(hex, factor) {
  let r = (hex >> 16) & 255;
  let g = (hex >> 8) & 255;
  let b = hex & 255;
  if (factor <= 1) {
    r *= factor;
    g *= factor;
    b *= factor;
  } else {
    const t = Math.min(factor - 1, 1);
    r += (255 - r) * t;
    g += (255 - g) * t;
    b += (255 - b) * t;
  }
  return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
}

export class TriMeshBuilder {
  constructor() {
    this.p = [];
  }
  tri(a, b, c) {
    this.p.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    return this;
  }
  quad(a, b, c, d) {
    return this.tri(a, b, c).tri(a, c, d);
  }
  geo() {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(this.p, 3));
    g.computeVertexNormals();
    return g;
  }
}

export class GeoBuilder {
  constructor() {
    this.pos = [];
    this.nor = [];
    this.col = [];
    this.nm = new Matrix3();
    this.v = new Vector3();
  }

  add(geo, col, mat4, topCol) {
    const g = geo.index ? geo.toNonIndexed() : geo;
    const posAttr = g.getAttribute('position');
    let norAttr = g.getAttribute('normal');
    if (!norAttr) {
      g.computeVertexNormals();
      norAttr = g.getAttribute('normal');
    }

    const c0 = toColor(col, _colA);
    const c1 = topCol === undefined ? null : toColor(topCol, _colB);
    let minY = Infinity;
    let maxY = -Infinity;
    if (c1) {
      for (let i = 0; i < posAttr.count; i++) {
        const y = posAttr.getY(i);
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      if (maxY - minY < 1e-6) maxY = minY + 1;
    }

    if (mat4) this.nm.getNormalMatrix(mat4);
    const v = this.v;

    for (let i = 0; i < posAttr.count; i++) {
      const ly = posAttr.getY(i);
      v.set(posAttr.getX(i), ly, posAttr.getZ(i));
      if (mat4) v.applyMatrix4(mat4);
      this.pos.push(v.x, v.y, v.z);

      v.set(norAttr.getX(i), norAttr.getY(i), norAttr.getZ(i));
      if (mat4) v.applyMatrix3(this.nm).normalize();
      this.nor.push(v.x, v.y, v.z);

      if (c1) {
        const t = (ly - minY) / (maxY - minY);
        this.col.push(
          c0.r + (c1.r - c0.r) * t,
          c0.g + (c1.g - c0.g) * t,
          c0.b + (c1.b - c0.b) * t
        );
      } else {
        this.col.push(c0.r, c0.g, c0.b);
      }
    }

    if (g !== geo) g.dispose();
    return this;
  }

  box(w, h, d, col, mat4, topCol) {
    return this.add(new BoxGeometry(w, h, d), col, mat4, topCol);
  }

  rbox(w, h, d, r, col, mat4, topCol, segs = 2) {
    return this.add(
      new RoundedBoxGeometry(w, h, d, segs, Math.min(r, w / 2, h / 2, d / 2)),
      col,
      mat4,
      topCol
    );
  }

  cyl(rt, rb, h, col, mat4, segs = 12, topCol, openEnded = false) {
    return this.add(new CylinderGeometry(rt, rb, h, segs, 1, openEnded), col, mat4, topCol);
  }

  cone(r, h, col, mat4, segs = 12, topCol) {
    return this.add(new ConeGeometry(r, h, segs), col, mat4, topCol);
  }

  sphere(r, col, mat4, wSegs = 14, hSegs = 10, topCol) {
    return this.add(new SphereGeometry(r, wSegs, hSegs), col, mat4, topCol);
  }

  ico(r, col, mat4, detail = 1, topCol) {
    return this.add(new IcosahedronGeometry(r, detail), col, mat4, topCol);
  }

  capsule(r, len, col, mat4, topCol, capSegs = 4, radSegs = 10) {
    return this.add(new CapsuleGeometry(r, len, capSegs, radSegs), col, mat4, topCol);
  }

  torus(r, tube, col, mat4, radSegs = 8, tubSegs = 16, arc = Math.PI * 2) {
    return this.add(new TorusGeometry(r, tube, radSegs, tubSegs, arc), col, mat4);
  }

  disc(r, col, mat4, segs = 12) {
    return this.add(new CircleGeometry(r, segs), col, mat4);
  }

  get vertexCount() {
    return this.pos.length / 3;
  }

  build() {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new Float32BufferAttribute(this.nor, 3));
    g.setAttribute('color', new Float32BufferAttribute(this.col, 3));
    g.computeBoundingBox();
    g.computeBoundingSphere();
    return g;
  }
}

const _upAxis = new Vector3(0, 1, 0);
const _unitScale = new Vector3(1, 1, 1);
const _pA = new Vector3();
const _pB = new Vector3();
const _dir = new Vector3();
const _qSpan = new Quaternion();

export function spanTransform(a, b) {
  _pA.set(a[0], a[1], a[2]);
  _pB.set(b[0], b[1], b[2]);
  _dir.subVectors(_pB, _pA);
  const len = _dir.length();
  _qSpan.setFromUnitVectors(_upAxis, _dir.normalize());
  _pA.add(_pB).multiplyScalar(0.5);
  return { m: new Matrix4().compose(_pA, _qSpan, _unitScale), len };
}

export function strutBox(builder, a, b, wx, col, wz = wx) {
  const s = spanTransform(a, b);
  builder.box(wx, s.len, wz, col, s.m);
}

export function strutCyl(builder, a, b, r, col, segs = 6) {
  const s = spanTransform(a, b);
  builder.cyl(r, r, s.len, col, s.m, segs);
}

export const modelMaterials = {
  std: new MeshStandardMaterial({ vertexColors: true, roughness: 0.78, metalness: 0 }),
  metal: new MeshStandardMaterial({ vertexColors: true, roughness: 0.34, metalness: 0.85 }),
  glow: (() => {
    const m = new MeshBasicMaterial({ vertexColors: true, toneMapped: false });
    m.color.setScalar(2.2);
    return m;
  })(),
};

for (const mat of [modelMaterials.std, modelMaterials.metal]) {
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `#include <emissivemap_fragment>
      {
        float rim = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.2);
        totalEmissiveRadiance += mix(diffuseColor.rgb, vec3(0.62, 0.78, 1.0), 0.45) * rim * 0.42;
      }`
    );
  };
}
