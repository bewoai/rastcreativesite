/*
 * Rast Creative — "Çekim Günü 3D" · picture engine
 * ------------------------------------------------------------------
 * Everything is built from primitives in code: toy-clay characters (toon shading,
 * ink outlines, blob shadows), colour-blocked sets, a car, a drone with a boom mic,
 * a truck, an operating room, an edit suite. Twenty shots cut on the beat.
 * The absurd beats: the drone records sound, the car parks inside the OR, the
 * doctor's jaw falls to the floor and bounces, the nurses' jaws follow like dominos.
 * Deterministic: window.__render(t) poses and draws any frame. No zoom anywhere.
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const K = window.CEKIM3D, C = K.CUE, FPS = K.FPS, DUR = K.DUR;
const $ = (s) => document.querySelector(s);
const P = (t, a, c) => (!(t > a) ? 0 : t >= c ? 1 : (t - a) / (c - a));
const mix = (a, c, p) => a + (c - a) * p;
const clamp = (x, a = 0, c = 1) => Math.max(a, Math.min(c, x));
const E = {
  outC: (x) => 1 - (1 - x) ** 3, inC: (x) => x ** 3,
  ioC: (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
  outBack: (x) => 1 + 2.7 * (x - 1) ** 3 + 1.7 * (x - 1) ** 2,
  outExpo: (x) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x)),
};
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
// a bouncing fall: from h to 0 starting at t0, with n decaying bounces
function bounceY(t, t0, h, g = 22, e = 0.42) {
  if (t < t0) return h;
  let dt = t - t0, v = 0, y = h;
  const tf = Math.sqrt((2 * h) / g);
  if (dt < tf) return h - 0.5 * g * dt * dt;
  dt -= tf; v = g * tf * e;
  for (let k = 0; k < 6; k++) { const tb = (2 * v) / g; if (dt < tb) return v * dt - 0.5 * g * dt * dt; dt -= tb; v *= e; }
  return 0;
}

/* ═════════════ renderer + materials ═════════════ */
const renderer = new THREE.WebGLRenderer({ canvas: $("#gl"), antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(1080, 1920, false);
const camera = new THREE.PerspectiveCamera(32, 1080 / 1920, 0.05, 400);

const grad = new THREE.DataTexture(new Uint8Array([70, 150, 215, 255]), 4, 1, THREE.RedFormat);
grad.minFilter = grad.magFilter = THREE.NearestFilter; grad.needsUpdate = true;
const MATS = new Map();
const toon = (c, extra = {}) => {
  const k = c + JSON.stringify(extra);
  if (!MATS.has(k)) MATS.set(k, new THREE.MeshToonMaterial({ color: c, gradientMap: grad, ...extra }));
  return MATS.get(k);
};
const basic = (c, extra = {}) => new THREE.MeshBasicMaterial({ color: c, ...extra });
const INK = new THREE.MeshBasicMaterial({ color: "#1b1422", side: THREE.BackSide });

// mesh + ink outline (inverted hull)
function part(geo, color, { at = [0, 0, 0], rot = [0, 0, 0], sc = [1, 1, 1], ol = 0.06, mat = null, parent = null } = {}) {
  const m = new THREE.Mesh(geo, mat || toon(color));
  m.position.set(...at); m.rotation.set(...rot); m.scale.set(...sc);
  if (ol) { const o = new THREE.Mesh(geo, INK); o.scale.setScalar(1 + ol); m.add(o); }
  if (parent) parent.add(m);
  return m;
}
const G = {
  sph: (r, ...a) => new THREE.SphereGeometry(r, 32, 20, ...a),
  cap: (r, l) => new THREE.CapsuleGeometry(r, l, 8, 20),
  box: (w, h, d, r = 0.02) => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2)),
  cyl: (r1, r2, h, s = 28) => new THREE.CylinderGeometry(r1, r2, h, s),
  tor: (r, tube, arc = Math.PI * 2) => new THREE.TorusGeometry(r, tube, 12, 32, arc),
};
const group = (parent, at = [0, 0, 0]) => { const g = new THREE.Group(); g.position.set(...at); if (parent) parent.add(g); return g; };

// soft blob shadow
const blobTex = (() => {
  const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d");
  const g = x.createRadialGradient(64, 64, 4, 64, 64, 64); g.addColorStop(0, "rgba(20,10,30,.55)"); g.addColorStop(1, "rgba(20,10,30,0)");
  x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
})();
function blob(parent, w, d, at = [0, 0.005, 0]) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2; m.position.set(...at); parent.add(m); return m;
}
function canvasTex(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return { c, x: c.getContext("2d"), t }; }

/* ═════════════ palette ═════════════ */
const PAL = {
  skin: "#eab48d", skinD: "#d99b74", black: "#1f1d24", beige: "#d6c2a0", denim: "#2c3444", white: "#f6f2ea",
  beard: "#2b1d18", hair: "#231a17", grey: "#c9c6c2", silver: "#dfe3e8", teal: "#37b3a4", tealD: "#23887c",
  coat: "#f7f6f2", red: "#ef5b3b", cream: "#f4ecdc", orange: "#ff8a3d",
};

/* ═════════════ characters ═════════════ */
function person(kind) {
  const R = { kind }; const root = new THREE.Group(); R.root = root;
  const isA = kind === "A", isB = kind === "B", isDoc = kind === "doc", isN = kind === "nurse";
  const shirt = isA ? PAL.black : isB ? PAL.beige : isDoc ? PAL.coat : PAL.teal;
  const pants = isA ? PAL.denim : isB ? "#26252b" : isDoc ? "#566074" : PAL.tealD;
  const skin = isDoc ? "#f0c3a0" : isN ? "#e2a883" : PAL.skin;
  const bulk = isB ? 1.22 : isDoc ? 1.1 : 1;
  R.hips = group(root, [0, 0.92, 0]);
  blob(root, 0.9 * bulk, 0.6 * bulk);
  // legs
  for (const s of [-1, 1]) {
    const leg = group(R.hips, [s * 0.12 * bulk, 0, 0]);
    part(G.cap(0.1 * bulk, 0.6), pants, { at: [0, -0.4, 0], parent: leg });
    part(G.box(0.17, 0.11, 0.32, 0.05), isA ? "#f4f4f4" : "#2a2a30", { at: [0, -0.86, 0.05], parent: leg });
    R[s < 0 ? "legL" : "legR"] = leg;
  }
  // torso
  R.torso = group(R.hips);
  part(G.cap(0.26, 0.36), shirt, { at: [0, 0.37, 0], sc: [1.12 * bulk, 1, 0.74 * bulk], parent: R.torso });
  if (isDoc) {   // lab coat skirt + stethoscope
    part(G.cyl(0.3, 0.37, 0.62), PAL.coat, { at: [0, 0.02, 0], sc: [bulk, 1, 0.8 * bulk], parent: R.torso });
    part(G.tor(0.13, 0.014, Math.PI), "#4c5566", { at: [0, 0.62, 0.12], rot: [0.4, 0, Math.PI], ol: 0, parent: R.torso });
  }
  // neck + head
  part(G.cyl(0.075, 0.08, 0.14), skin, { at: [0, 0.72, 0], ol: 0, parent: R.torso });
  R.head = group(R.torso, [0, 0.78, 0]);
  const H = R.head;
  part(G.sph(0.2), skin, { at: [0, 0.14, 0], sc: [0.95, 1.08, 0.98], parent: H });
  for (const s of [-1, 1]) part(G.sph(0.045), skin, { at: [s * 0.19, 0.13, 0], sc: [0.6, 1, 1], parent: H });
  part(G.sph(0.034), PAL.skinD, { at: [0, 0.11, 0.2], parent: H, ol: 0.1 });
  R.eyes = []; R.brows = [];
  for (const s of [-1, 1]) {
    const e = part(G.sph(0.024), "#141218", { at: [s * 0.072, 0.16, 0.178], ol: 0, mat: basic("#141218"), parent: H }); R.eyes.push(e);
    const b = part(G.box(0.075, 0.019, 0.02, 0.008), isDoc ? PAL.grey : PAL.hair, { at: [s * 0.072, 0.225, 0.185], rot: [0, 0, s * -0.08], ol: 0, parent: H }); R.brows.push(b);
  }
  // mouth (a dark ellipse we can open)
  R.mouth = part(G.sph(0.04), "#3a1420", { at: [0, 0.035, 0.178], sc: [1, 0.22, 0.4], ol: 0, mat: basic("#3a1420"), parent: H });
  if (isA) {
    part(G.sph(0.216, 0, Math.PI * 2, 0, Math.PI / 2), PAL.black, { at: [0, 0.17, -0.005], rot: [-0.08, 0, 0], parent: H });
    part(G.box(0.3, 0.024, 0.2, 0.012), PAL.black, { at: [0, 0.2, 0.2], rot: [-0.12, 0, 0], parent: H });
    R.shades = group(H, [0, 0.16, 0.19]);
    for (const s of [-1, 1]) part(G.box(0.118, 0.076, 0.03, 0.02), "#0d0c10", { at: [s * 0.068, 0, 0], parent: R.shades, ol: 0.05 });
    part(G.box(0.04, 0.014, 0.02, 0.005), "#0d0c10", { at: [0, 0.018, 0], parent: R.shades, ol: 0 });
    R.glint = part(new THREE.PlaneGeometry(0.03, 0.2), null, { at: [0, 0, 0.02], rot: [0, 0, 0.6], mat: basic("#ffffff", { transparent: true, opacity: 0 }), ol: 0, parent: R.shades });
    part(G.box(0.1, 0.014, 0.02, 0.006), PAL.hair, { at: [0, 0.065, 0.19], ol: 0, parent: H });            // thin moustache
    part(G.box(0.05, 0.06, 0.03, 0.012), PAL.hair, { at: [0, -0.035, 0.17], ol: 0, parent: H });           // goatee
    part(G.tor(0.018, 0.005), PAL.silver, { at: [0.205, 0.07, 0.02], rot: [0, Math.PI / 2, 0], ol: 0, parent: H });
  }
  if (isB) {
    part(G.sph(0.214, 0, Math.PI * 2, 0, Math.PI * 0.42), PAL.hair, { at: [0, 0.16, -0.01], parent: H });
    part(G.box(0.22, 0.07, 0.12, 0.03), PAL.hair, { at: [0, 0.34, 0.06], rot: [0.3, 0, 0], ol: 0.04, parent: H });  // quiff
    part(G.sph(0.205, 0, Math.PI * 2, Math.PI * 0.64, Math.PI * 0.36), PAL.beard, { at: [0, 0.15, 0.018], sc: [1.03, 1.2, 1.05], parent: H });
    for (const s of [-1, 1]) part(G.box(0.05, 0.14, 0.12, 0.02), PAL.beard, { at: [s * 0.17, 0.08, 0.05], ol: 0, parent: H });   // sideburns
    part(G.box(0.13, 0.03, 0.03, 0.012), PAL.beard, { at: [0, 0.065, 0.195], ol: 0, parent: H });
    R.mouth.position.z = 0.205;
    R.shades = group(H, [0, 0.16, 0.19]); R.shades.visible = false;   // B's own pair, for the exit
    for (const s of [-1, 1]) part(G.box(0.118, 0.076, 0.03, 0.02), "#0d0c10", { at: [s * 0.068, 0, 0], parent: R.shades, ol: 0.05 });
  }
  if (isDoc) {
    for (const s of [-1, 1]) part(G.sph(0.1), PAL.grey, { at: [s * 0.16, 0.16, -0.06], sc: [0.7, 1, 1.1], parent: H });
    part(G.sph(0.12), PAL.grey, { at: [0, 0.14, -0.13], sc: [1.4, 1, 0.8], parent: H });
    for (const s of [-1, 1]) part(G.tor(0.047, 0.008), "#2c2a33", { at: [s * 0.072, 0.16, 0.19], ol: 0, parent: H });
    part(G.cyl(0.075, 0.075, 0.012), PAL.silver, { at: [0, 0.33, 0.14], rot: [1.25, 0, 0], parent: H, ol: 0.08 }); // head mirror
    part(G.tor(0.2, 0.012), "#2c2a33", { at: [0, 0.29, 0], rot: [Math.PI / 2 - 0.25, 0, 0], ol: 0, parent: H });
    R.stache = group(H, [0, 0.07, 0.2]);
    for (const s of [-1, 1]) part(G.cap(0.03, 0.1), PAL.grey, { at: [s * 0.06, 0, 0], rot: [0, 0, s * 1.2], parent: R.stache });
    // the jaw: chin + teeth, can fall off
    R.jaw = group(H, [0, 0, 0.02]);
    part(G.sph(0.17, 0, Math.PI * 2, Math.PI * 0.55, Math.PI * 0.45), "#f0c3a0", { at: [0, 0.07, 0], sc: [1.05, 1.3, 1.08], parent: R.jaw });
    part(G.box(0.14, 0.025, 0.03, 0.008), "#ffffff", { at: [0, 0.02, 0.16], ol: 0, parent: R.jaw });
    part(new THREE.CircleGeometry(0.16, 32), "#c9505e", { at: [0, 0.03, 0.01], rot: [-Math.PI / 2, 0, 0], sc: [1.05, 1.05, 1], ol: 0, parent: R.jaw });
    R.mouth.position.set(0, 0.035, 0.175);
  }
  if (isN) {
    part(G.cyl(0.2, 0.21, 0.1), PAL.teal, { at: [0, 0.3, -0.01], parent: H });
    R.mask = group(H, [0, 0.07, 0.17]);
    part(G.box(0.26, 0.13, 0.05, 0.03), "#eef6f4", { at: [0, 0, 0], parent: R.mask, ol: 0.05 });
  }
  // arms: shoulder → elbow → hand
  R.arms = {};
  for (const s of [-1, 1]) {
    const sh = group(R.torso, [s * 0.34 * bulk, 0.62, 0]);
    const r = 0.085 * bulk;
    part(G.cap(r + 0.02, 0.1), shirt, { at: [0, -0.06, 0], parent: sh });
    part(G.cap(r, 0.22), isDoc ? PAL.coat : skin, { at: [0, -0.18, 0], parent: sh });
    const el = group(sh, [0, -0.33, 0]);
    part(G.cap(r * 0.9, 0.2), isDoc ? PAL.coat : skin, { at: [0, -0.13, 0], parent: el });
    const hand = group(el, [0, -0.3, 0]);
    part(G.sph(0.07), skin, { parent: hand });
    if (isB && s < 0) part(G.tor(r * 0.95, 0.022), PAL.silver, { at: [0, 0.07, 0], rot: [Math.PI / 2, 0, 0], ol: 0.2, parent: el.children[0] });
    R.arms[s < 0 ? "L" : "R"] = { sh, el, hand };
  }
  R.finger = part(G.cap(0.02, 0.08), skin, { at: [0.03, -0.1, 0.03], rot: [0, 0, 0.25], ol: 0.15, parent: R.arms.R.hand });
  part(G.sph(0.028), skin, { at: [-0.08, 0.05, 0.02], ol: 0.2, parent: R.finger });
  R.finger.visible = false;
  // crossed forearms prop (B's signature pose)
  R.crossed = part(G.cap(0.1, 0.46), skin, { at: [0, 0.4, 0.22], rot: [0, 0, Math.PI / 2], sc: [1, 1, 0.9], parent: R.torso });
  part(G.tor(0.09, 0.022), PAL.silver, { at: [0, 0.14, 0], rot: [Math.PI / 2, 0, 0], ol: 0.2, parent: R.crossed });
  R.crossed.visible = false;
  pose(R, {});
  return R;
}
// pose: arms as [shoulderX, shoulderZ, elbowX] per side (radians); head [x, y, z]; torso [x, y, z]
function pose(R, { L = [0, 0.1, 0], Rt = [0, 0.1, 0], head = [0, 0, 0], torso = [0, 0, 0], legs = [0, 0], crossed = false, brows = [0, 0], mouth = 0, eyes = 1 } = {}) {
  const set = (arm, [x, z, e], side) => { arm.sh.rotation.set(x, 0, side * z); arm.el.rotation.set(e, 0, 0); };
  set(R.arms.L, L, -1); set(R.arms.R, Rt, 1);
  R.head.rotation.set(...head); R.torso.rotation.set(...torso);
  R.legL.rotation.x = legs[0]; R.legR.rotation.x = legs[1];
  R.crossed.visible = crossed;
  for (const a of ["L", "R"]) R.arms[a].sh.visible = !crossed || a === "none";
  if (crossed) { R.arms.L.sh.visible = R.arms.R.sh.visible = true; set(R.arms.L, [-0.35, -0.25, -1.9], -1); set(R.arms.R, [-0.35, -0.25, -1.9], 1); }
  R.brows.forEach((b, i) => { b.position.y = 0.225 + brows[i]; b.rotation.z = (i ? 1 : -1) * (0.08 - brows[i] * 2.5); });
  R.mouth.scale.set(1 + mouth * 0.6, 0.22 + mouth * 1.6, 0.4);
  R.eyes.forEach((e) => e.scale.setScalar(eyes));
}

/* ═════════════ props ═════════════ */
function makeCar() {
  const car = new THREE.Group();
  blob(car, 3.2, 1.8);
  part(G.box(2.3, 0.5, 1.16, 0.16), PAL.cream, { at: [0, 0.5, 0], parent: car });
  part(G.box(2.32, 0.08, 1.18, 0.03), PAL.red, { at: [0, 0.46, 0], ol: 0, parent: car });
  part(G.box(0.9, 0.12, 1.0, 0.05), "#8a3b2c", { at: [-0.25, 0.78, 0], ol: 0.02, parent: car });            // seats
  part(G.box(0.1, 0.36, 1.0, 0.04), "#8a3b2c", { at: [-0.62, 0.95, 0], parent: car });
  part(new THREE.PlaneGeometry(1.0, 0.36), null, { at: [0.5, 0.92, 0], rot: [0, Math.PI / 2, 0.35], mat: new THREE.MeshBasicMaterial({ color: "#9fd8e8", transparent: true, opacity: 0.35, side: THREE.DoubleSide }), ol: 0, parent: car });
  car.wheels = [];
  for (const [x, z] of [[0.75, 0.56], [0.75, -0.56], [-0.75, 0.56], [-0.75, -0.56]]) {
    const w = group(car, [x, 0.3, z]);
    part(G.cyl(0.3, 0.3, 0.22), "#26232b", { rot: [Math.PI / 2, 0, 0], parent: w });
    part(G.cyl(0.14, 0.14, 0.235), PAL.silver, { rot: [Math.PI / 2, 0, 0], ol: 0, parent: w });
    part(G.box(0.05, 0.22, 0.24, 0.01), "#9aa0aa", { ol: 0, parent: w });
    car.wheels.push(w);
  }
  for (const z of [0.36, -0.36]) part(G.sph(0.08), "#fff3b0", { at: [1.14, 0.56, z], mat: basic("#fff3b0"), parent: car });
  car.wheelSpin = (a) => car.wheels.forEach((w) => (w.rotation.z = -a));
  car.wheel = part(G.tor(0.14, 0.022), "#2a2830", { at: [0.3, 0.95, -0.28], rot: [0, Math.PI / 2 - 0.5, 0], ol: 0, parent: car });
  return car;
}
function makeDrone() {
  const d = new THREE.Group();
  part(G.box(0.3, 0.1, 0.3, 0.04), PAL.white, { parent: d });
  for (const r of [Math.PI / 4, -Math.PI / 4]) part(G.box(0.62, 0.03, 0.045, 0.01), "#8d939c", { rot: [0, r, 0], ol: 0.1, parent: d });
  d.props = [];
  for (const [x, z] of [[0.22, 0.22], [-0.22, 0.22], [0.22, -0.22], [-0.22, -0.22]]) {
    part(G.cyl(0.03, 0.03, 0.05), "#3a3d45", { at: [x, 0.03, z], ol: 0, parent: d });
    const p = group(d, [x, 0.065, z]);
    part(G.cyl(0.13, 0.13, 0.004), null, { mat: new THREE.MeshBasicMaterial({ color: "#d9dde3", transparent: true, opacity: 0.35 }), ol: 0, parent: p });
    part(G.box(0.25, 0.006, 0.03, 0.003), "#50545c", { ol: 0, parent: p });
    d.props.push(p);
  }
  part(G.sph(0.045), "#1c1c22", { at: [0.13, -0.07, 0], parent: d, ol: 0.1 });
  // the absurd bit: a boom mic hanging off the drone
  d.boom = group(d, [0, -0.04, 0]);
  part(G.cyl(0.008, 0.008, 0.9, 8), "#3a3d45", { at: [0, -0.4, 0.12], rot: [0.3, 0, 0], ol: 0, parent: d.boom });
  part(G.cap(0.05, 0.16), "#8e8a86", { at: [0, -0.84, 0.25], rot: [Math.PI / 2 + 0.3, 0, 0], parent: d.boom, ol: 0.12 });
  d.spin = (t) => d.props.forEach((p, i) => (p.rotation.y = t * 90 * (i % 2 ? 1 : -1)));
  return d;
}
function makeTruck() {
  const tr = new THREE.Group();
  blob(tr, 8, 2.4);
  part(G.box(1.5, 1.6, 1.4, 0.12), "#2f6fdc", { at: [3.6, 1.2, 0], parent: tr });
  part(new THREE.PlaneGeometry(1.1, 0.6), null, { at: [4.36, 1.55, 0], rot: [0, Math.PI / 2, 0], mat: basic("#9fd8e8"), ol: 0, parent: tr });
  part(G.box(6.2, 2.0, 1.45, 0.06), "#ece6da", { at: [-0.4, 2.2, 0], parent: tr });
  part(G.box(6.2, 0.12, 1.3, 0.02), "#6b6f78", { at: [-0.4, 1.12, 0], ol: 0, parent: tr });
  tr.wheels = [];
  for (const x of [3.6, -2.2, -2.9, 0.2]) for (const z of [0.62, -0.62]) {
    const w = group(tr, [x, 0.45, z]);
    part(G.cyl(0.45, 0.45, 0.3), "#232128", { rot: [Math.PI / 2, 0, 0], parent: w });
    part(G.cyl(0.2, 0.2, 0.31), "#b8bec8", { rot: [Math.PI / 2, 0, 0], ol: 0, parent: w });
    part(G.box(0.06, 0.3, 0.32, 0.01), "#80858f", { ol: 0, parent: w });
    tr.wheels.push(w);
  }
  tr.spin = (a) => tr.wheels.forEach((w) => (w.rotation.z = -a));
  return tr;
}
function makeClapper() {
  const c = new THREE.Group();
  part(G.box(0.36, 0.26, 0.03, 0.01), "#17161b", { parent: c });
  for (let i = 0; i < 3; i++) part(G.box(0.34, 0.006, 0.032, 0.002), "#ffffff", { at: [0, -0.02 - i * 0.06, 0], ol: 0, parent: c });
  c.stick = group(c, [-0.18, 0.15, 0]);
  const st = part(G.box(0.37, 0.05, 0.03, 0.008), "#17161b", { at: [0.185, 0, 0], parent: c.stick });
  for (let i = 0; i < 4; i++) part(G.box(0.045, 0.052, 0.034, 0.004), "#ffffff", { at: [-0.14 + i * 0.09, 0, 0], rot: [0, 0, 0.5], ol: 0, parent: st });
  return c;
}
function makeGimbal() {
  const g = new THREE.Group();
  part(G.cyl(0.03, 0.03, 0.3), "#2a2b31", { at: [0, -0.15, 0], parent: g });
  part(G.box(0.05, 0.2, 0.05, 0.015), "#3a3b43", { at: [0.06, 0.05, 0], parent: g });
  part(G.box(0.2, 0.13, 0.12, 0.02), "#1c1c21", { at: [0.1, 0.16, 0.04], parent: g });
  part(G.cyl(0.05, 0.055, 0.1), "#111", { at: [0.1, 0.16, 0.14], rot: [Math.PI / 2, 0, 0], parent: g });
  return g;
}
function makeController() {
  const c = new THREE.Group();
  part(G.box(0.26, 0.05, 0.14, 0.03), "#2a2b31", { parent: c });
  part(new THREE.PlaneGeometry(0.16, 0.1), null, { at: [0, 0.03, -0.01], rot: [-Math.PI / 2 + 0.5, 0, 0], mat: basic("#56c7ff"), ol: 0, parent: c });
  return c;
}

/* ═════════════ canvas screens ═════════════ */
const ECG = canvasTex(512, 320), TL = canvasTex(1024, 640), PHONE = canvasTex(360, 720), TILE = canvasTex(256, 256);
function drawECG(t, heart) {
  const { x, c } = ECG; x.fillStyle = "#07261f"; x.fillRect(0, 0, c.width, c.height);
  x.strokeStyle = "#5dffb0"; x.lineWidth = 7; x.lineJoin = "round"; x.beginPath();
  if (heart > 0) {   // the line draws a heart
    const n = Math.floor(160 * heart);
    for (let i = 0; i <= n; i++) { const a = (i / 160) * Math.PI * 2; const hx = 16 * Math.sin(a) ** 3, hy = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a); const px = 256 + hx * 7.5, py = 150 - hy * 7.5; i ? x.lineTo(px, py) : x.moveTo(px, py); }
  } else {
    for (let i = 0; i <= 512; i += 4) { const ph = ((i / 512) * 2.2 + t * 1.6) % 1; let y = 160; if (ph > 0.45 && ph < 0.5) y = 160 - Math.sin((ph - 0.45) / 0.05 * Math.PI) * 110; if (ph > 0.5 && ph < 0.53) y = 160 + 40; i ? x.lineTo(i, y) : x.moveTo(i, y); }
  }
  x.stroke(); ECG.t.needsUpdate = true;
}
function drawTimeline(t) {
  const { x, c } = TL; x.fillStyle = "#101426"; x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = "#1c2240"; x.fillRect(40, 40, 560, 320);
  const R = rng(5); const cols = ["#ff8a3d", "#56c7ff", "#ffd166", "#ef476f", "#7bdff2", "#b388ff"];
  // the preview: a tiny sunset + a car silhouette sliding
  const g = x.createLinearGradient(0, 40, 0, 360); g.addColorStop(0, "#3b2466"); g.addColorStop(1, "#ff8a3d"); x.fillStyle = g; x.fillRect(40, 40, 560, 320);
  x.fillStyle = "#ffd27a"; x.beginPath(); x.arc(320, 300, 70, 0, Math.PI * 2); x.fill();
  x.fillStyle = "#241a33"; x.fillRect(40, 300, 560, 60); x.fillStyle = "#f4ecdc"; x.fillRect(40 + ((t * 420) % 620) - 60, 280, 90, 30);
  for (let row = 0; row < 4; row++) {
    let xx = 40 - ((t * 380 * (1 + row * 0.2)) % 200);
    while (xx < 1000) { const w = 60 + R() * 160; x.fillStyle = cols[Math.floor(R() * cols.length)]; x.fillRect(xx, 400 + row * 52, w - 8, 40); xx += w; }
  }
  x.fillStyle = "#fff"; x.fillRect(520, 390, 4, 230);
  x.fillStyle = "#2a3050"; x.fillRect(640, 40, 344, 320);
  for (let i = 0; i < 6; i++) { x.fillStyle = cols[i]; x.fillRect(660, 60 + i * 48, 120 + ((t * 300 + i * 70) % 180), 26); }
  TL.t.needsUpdate = true;
}
function drawPhone(t) {
  const { x, c } = PHONE; const w = c.width, h = c.height;
  const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#3b2466"); g.addColorStop(0.6, "#ff8a3d"); g.addColorStop(1, "#ffcf7a"); x.fillStyle = g; x.fillRect(0, 0, w, h);
  x.fillStyle = "#ffd27a"; x.beginPath(); x.arc(w / 2, h * 0.55, 80, 0, Math.PI * 2); x.fill();
  x.fillStyle = "#2a1f3a"; x.fillRect(0, h * 0.62, w, h * 0.38);
  for (let i = 0; i < 6; i++) { x.fillStyle = "#f6efe4"; x.fillRect(((i * 90 - t * 900) % 540 + 540) % 540 - 90, h * 0.8, 50, 8); }
  const cx = w * 0.45 + Math.sin(t * 9) * 6; x.fillStyle = "#f4ecdc"; x.fillRect(cx - 70, h * 0.66, 140, 50); x.fillRect(cx - 40, h * 0.62, 80, 30);
  x.fillStyle = "#ef5b3b"; x.fillRect(cx - 70, h * 0.7, 140, 6); x.fillStyle = "#222"; x.beginPath(); x.arc(cx - 40, h * 0.73, 16, 0, 7); x.arc(cx + 40, h * 0.73, 16, 0, 7); x.fill();
  x.fillStyle = "#fff"; x.fillRect(cx + 90, h * 0.58 + Math.sin(t * 14) * 8, 34, 10);
  x.strokeStyle = "#fff"; x.lineWidth = 5; for (let i = 0; i < 3; i++) { x.beginPath(); x.arc(w - 44, h * 0.62 + i * 70, 16, 0, 7); x.stroke(); }
  x.fillStyle = "rgba(255,255,255,.6)"; x.fillRect(20, h - 30, (w - 40) * ((t * 0.9) % 1), 5);
  PHONE.t.needsUpdate = true;
}
{ const { x } = TILE; x.fillStyle = "#f3f6f4"; x.fillRect(0, 0, 256, 256); x.strokeStyle = "#cfe3de"; x.lineWidth = 6; x.strokeRect(0, 0, 256, 256); TILE.t.wrapS = TILE.t.wrapT = THREE.RepeatWrapping; TILE.t.repeat.set(14, 14); TILE.t.needsUpdate = true; }

/* ═════════════ sets ═════════════ */
function lights(scene, { sky = "#ffffff", ground = "#886677", key = "#ffffff", dir = [3, 5, 4], k = 2.2, h = 1.3 } = {}) {
  scene.add(new THREE.HemisphereLight(sky, ground, h));
  const d = new THREE.DirectionalLight(key, k); d.position.set(...dir); scene.add(d);
}
function gradientBg(top, mid, bot) {
  const { c, x, t } = canvasTex(4, 512); const g = x.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, top); g.addColorStop(0.55, mid); g.addColorStop(1, bot); x.fillStyle = g; x.fillRect(0, 0, 4, 512); t.needsUpdate = true; return t;
}
const S = {};
const A = person("A"), B = person("B"), DOC = person("doc"), N1 = person("nurse"), N2 = person("nurse"), N3 = person("nurse");
const car = makeCar(), drone = makeDrone(), truck = makeTruck(), clapper = makeClapper(), gimbal = makeGimbal(), ctrl = makeController();

// studio: deep blue cyclorama with a spotlight pool
S.studio = new THREE.Scene(); S.studio.background = gradientBg("#0f1740", "#1d2d78", "#26399a");
lights(S.studio, { sky: "#c9d6ff", ground: "#1a1d44", key: "#fff1dc", dir: [2, 4, 5], k: 2.4 });
part(new THREE.CircleGeometry(40, 48), "#2a3da8", { rot: [-Math.PI / 2, 0, 0], ol: 0, parent: S.studio });
{ const m = new THREE.Mesh(new THREE.CircleGeometry(1.8, 48), new THREE.MeshBasicMaterial({ color: "#5b6fe0", transparent: true, opacity: 0.5 })); m.rotation.x = -Math.PI / 2; m.position.y = 0.004; S.studio.add(m); }

// road: sunset, purple asphalt, scrolling dashes, hills
S.road = new THREE.Scene(); S.road.background = gradientBg("#2c1b5c", "#ff7a4d", "#ffc978");
S.road.fog = new THREE.Fog("#ff9a62", 30, 120);
lights(S.road, { sky: "#ffd2b0", ground: "#5a2b4a", key: "#ffc58a", dir: [-6, 5, 3], k: 2.6 });
part(new THREE.PlaneGeometry(600, 600), "#d77a4e", { rot: [-Math.PI / 2, 0, 0], at: [0, -0.01, 0], ol: 0, parent: S.road });
part(new THREE.PlaneGeometry(600, 9), "#3d3150", { rot: [-Math.PI / 2, 0, 0], at: [0, 0, -1.5], ol: 0, parent: S.road });
const dashes = [];
for (let i = 0; i < 60; i++) { const m = part(new THREE.BoxGeometry(2.2, 0.02, 0.16), "#f6efe4", { ol: 0, parent: S.road }); m.position.set(0, 0.01, -1.5); dashes.push(m); }
for (const z of [2.9, -5.9]) part(new THREE.BoxGeometry(600, 0.02, 0.12), "#f6efe4", { at: [0, 0.01, z], ol: 0, parent: S.road });
const hills = [], poles = [];
{ const Rr = rng(3); for (let i = 0; i < 40; i++) { const m = part(new THREE.ConeGeometry(4 + Rr() * 6, 3 + Rr() * 5, 5), Rr() < 0.5 ? "#b85a45" : "#c96a4c", { ol: 0.02, parent: S.road }); m.userData = { x0: i * 14 + Rr() * 6, z: -18 - Rr() * 30 }; hills.push(m); } }
for (let i = 0; i < 16; i++) { const p = group(S.road); part(G.cyl(0.05, 0.05, 3.2, 8), "#5a3a55", { at: [0, 1.6, 0], ol: 0, parent: p }); p.userData.x0 = i * 12; poles.push(p); }
{ const sun = new THREE.Mesh(new THREE.CircleGeometry(9, 48), basic("#ffd88a", { fog: false })); sun.position.set(-60, 6, -110); sun.lookAt(0, 6, 0); S.road.add(sun); S.road.userData.sun = sun; }

// hospital facade
S.facade = new THREE.Scene(); S.facade.background = gradientBg("#2c1b5c", "#ff7a4d", "#ffc978");
lights(S.facade, { sky: "#ffd2b0", ground: "#5a2b4a", key: "#ffc58a", dir: [-4, 6, 6], k: 2.4 });
part(new THREE.PlaneGeometry(200, 200), "#3d3150", { rot: [-Math.PI / 2, 0, 0], ol: 0, parent: S.facade });
part(G.box(14, 7, 1, 0.05), "#8fd8c8", { at: [0, 3.5, -0.5], parent: S.facade, ol: 0.01 });
part(G.box(3.6, 3.2, 0.2, 0.05), "#e9f6f2", { at: [0, 1.6, 0.05], parent: S.facade, ol: 0.02 });
const doors = [];
for (const s of [-1, 1]) {
  const hinge = group(S.facade, [s * 1.5, 0, 0.2]);
  const dmesh = part(G.box(1.46, 2.9, 0.1, 0.03), "#ffffff", { at: [-s * 0.73, 1.45, 0], parent: hinge });
  part(G.cyl(0.25, 0.25, 0.12), "#9fd8e8", { at: [0, 0.5, 0], rot: [Math.PI / 2, 0, 0], parent: dmesh, ol: 0.05 });
  doors.push({ hinge, s });
}
part(G.box(1.6, 0.45, 0.2, 0.08), PAL.red, { at: [0, 5.2, 0.2], parent: S.facade });
part(G.box(0.45, 1.6, 0.2, 0.08), PAL.red, { at: [0, 5.2, 0.2], parent: S.facade });
const debris = []; { const Rr = rng(9); for (let i = 0; i < 26; i++) { const m = part(G.box(0.12 + Rr() * 0.18, 0.1 + Rr() * 0.2, 0.05, 0.02), Rr() < 0.5 ? "#ffffff" : "#8fd8c8", { parent: S.facade, ol: 0.08 }); m.userData = { vx: (Rr() - 0.5) * 7, vy: 3 + Rr() * 5, vz: 2 + Rr() * 5, rs: (Rr() - 0.5) * 20, x: (Rr() - 0.5) * 2.8, y: 0.4 + Rr() * 2.4 }; m.visible = false; debris.push(m); } }

// operating room: mint walls, tiled floor, surgical lamp, softboxes, monitor
S.or = new THREE.Scene(); S.or.background = new THREE.Color("#9fe0d2");
lights(S.or, { sky: "#ffffff", ground: "#6aa89c", key: "#ffffff", dir: [2, 6, 5], k: 2.2, h: 1.5 });
part(new THREE.PlaneGeometry(40, 40), null, { rot: [-Math.PI / 2, 0, 0], mat: new THREE.MeshToonMaterial({ map: TILE.t, gradientMap: grad }), ol: 0, parent: S.or });
part(new THREE.PlaneGeometry(40, 12), "#9fe0d2", { at: [0, 6, -5], ol: 0, parent: S.or });
part(new THREE.PlaneGeometry(40, 1.2), "#7cc9ba", { at: [0, 0.6, -4.98], ol: 0, parent: S.or });
const lamp = group(S.or, [0, 3.6, -1.2]);
part(G.cyl(0.03, 0.03, 1.4, 8), "#c9d2d0", { at: [0, 0.7, 0], ol: 0, parent: lamp });
part(G.cyl(0.8, 0.7, 0.18), "#eef2f1", { parent: lamp });
for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; part(G.cyl(0.14, 0.14, 0.02), null, { at: [Math.cos(a) * 0.45, -0.1, Math.sin(a) * 0.45], mat: basic("#fffbe6"), ol: 0, parent: lamp }); }
for (const s of [-1, 1]) {
  const sb = group(S.or, [s * 2.6, 0, -2.4]);
  part(G.cyl(0.03, 0.03, 2.2, 8), "#2b2c33", { at: [0, 1.1, 0], ol: 0, parent: sb });
  const box = part(G.box(0.9, 0.9, 0.35, 0.05), "#1f2026", { at: [0, 2.3, 0], rot: [0.2, -s * 0.5, 0], parent: sb });
  part(new THREE.PlaneGeometry(0.8, 0.8), null, { at: [0, 0, 0.18], mat: basic("#ffffff"), ol: 0, parent: box });
}
const monitor = group(S.or, [2.0, 0, -1.9]);
part(G.cyl(0.04, 0.04, 1.4, 8), "#8f9a98", { at: [0, 0.7, 0], ol: 0, parent: monitor });
{ const scr = part(G.box(0.9, 0.6, 0.12, 0.04), "#2b2f36", { at: [0, 1.65, 0], rot: [0, -0.35, 0], parent: monitor }); part(new THREE.PlaneGeometry(0.8, 0.5), null, { at: [0, 0, 0.065], mat: new THREE.MeshBasicMaterial({ map: ECG.t }), ol: 0, parent: scr }); }
const orDoor = group(S.or, [2.5, 0, -4.9]);
part(G.box(1.4, 2.6, 0.1, 0.03), "#ffffff", { at: [0, 1.3, 0], parent: orDoor });
const orTable = part(G.box(1.9, 0.12, 0.7, 0.04), "#dfe7e5", { at: [-1.6, 0.85, -1.8], parent: S.or });
part(G.cyl(0.08, 0.1, 0.8), "#9aa6a3", { at: [0, -0.43, 0], ol: 0, parent: orTable });

// edit suite: navy, desk, laptop with a live timeline + a giant ENTER
S.edit = new THREE.Scene(); S.edit.background = new THREE.Color("#141a3a");
lights(S.edit, { sky: "#8fa2ff", ground: "#0b0d20", key: "#ffd9b8", dir: [-2, 4, 3], k: 1.8, h: 1.0 });
part(G.box(6, 0.12, 3, 0.03), "#2a2448", { at: [0, 0.94, 0], parent: S.edit, ol: 0.01 });
const laptop = group(S.edit, [0, 1.0, 0.2]);
part(G.box(1.6, 0.06, 1.05, 0.03), "#c9ced8", { parent: laptop });
const keys = [];
for (let r = 0; r < 5; r++) for (let q = 0; q < 12; q++) { if (r === 2 && q >= 10) continue; keys.push(part(G.box(0.095, 0.03, 0.095, 0.015), "#2c2f3a", { at: [-0.6 + q * 0.11, 0.045, -0.3 + r * 0.115], ol: 0, parent: laptop })); }
const enterKey = part(G.box(0.2, 0.035, 0.1, 0.02), PAL.orange, { at: [0.6, 0.048, -0.07], parent: laptop, ol: 0.08 });
const screenG = group(laptop, [0, 0.02, -0.52]);
part(G.box(1.6, 1.0, 0.04, 0.03), "#c9ced8", { at: [0, 0.5, 0], rot: [-0.25, 0, 0], parent: screenG });
part(new THREE.PlaneGeometry(1.5, 0.92), null, { at: [0, 0.5, 0.025], rot: [-0.25, 0, 0], mat: new THREE.MeshBasicMaterial({ map: TL.t }), ol: 0, parent: screenG });
const editHand = group(S.edit);
{ const skin = PAL.skin; part(G.cap(0.07, 0.5), PAL.black, { at: [0, 0.35, 0.18], rot: [-1.1, 0, 0], parent: editHand });
  part(G.sph(0.08), skin, { at: [0, 0.04, -0.02], sc: [1, 0.8, 1.2], parent: editHand });
  part(G.cap(0.022, 0.1), skin, { at: [0, -0.02, -0.12], rot: [-1.2, 0, 0], parent: editHand, ol: 0.12 }); }
{ const glow = new THREE.PointLight("#56c7ff", 3, 4); glow.position.set(0, 1.6, 0.4); S.edit.add(glow); }

// phone (for the doctor)
const phone = new THREE.Group();
part(G.box(0.2, 0.4, 0.025, 0.03), "#18171c", { parent: phone });
part(new THREE.PlaneGeometry(0.18, 0.37), null, { at: [0, 0, 0.014], mat: new THREE.MeshBasicMaterial({ map: PHONE.t }), ol: 0, parent: phone });

// the loose jaw + moustache (their own objects once they fall)
const looseJaw = group(null); const looseStache = group(null);
{ part(G.sph(0.17, 0, Math.PI * 2, Math.PI * 0.55, Math.PI * 0.45), "#f0c3a0", { at: [0, 0.2, 0], sc: [1.05, 1.3, 1.08], parent: looseJaw });
  part(G.box(0.14, 0.03, 0.03, 0.008), "#ffffff", { at: [0, 0.15, 0.16], ol: 0, parent: looseJaw });
  part(new THREE.CircleGeometry(0.16, 32), "#c9505e", { at: [0, 0.16, 0.01], rot: [-Math.PI / 2, 0, 0], sc: [1.05, 1.05, 1], ol: 0, parent: looseJaw });
  part(G.sph(0.07), "#e0707c", { at: [0, 0.16, 0.03], sc: [1, 0.35, 1.3], ol: 0, parent: looseJaw });
  for (const s of [-1, 1]) part(G.cap(0.03, 0.1), PAL.grey, { at: [s * 0.06, 0, 0], rot: [0, 0, s * 1.2], parent: looseStache }); }

/* ═════════════ helpers for shots ═════════════ */
function place(obj, scene, at = [0, 0, 0], ry = 0) { scene.add(obj); obj.position.set(...at); obj.rotation.set(0, ry, 0); obj.visible = true; return obj; }
function cam(pos, look, fov = 32, roll = 0) { camera.fov = fov; camera.updateProjectionMatrix(); camera.position.set(...pos); camera.up.set(Math.sin(roll), Math.cos(roll), 0); camera.lookAt(...look); }
const shake = (t, amp, seed = 1) => [Math.sin(t * 53 + seed) * amp, Math.sin(t * 71 + seed * 2) * amp];
function roadScroll(dist) {
  dashes.forEach((m, i) => (m.position.x = ((i * 5 - dist) % 300 + 300) % 300 - 150));
  hills.forEach((m) => (m.position.set(((m.userData.x0 - dist * 0.25) % 560 + 560) % 560 - 280, 1.2, m.userData.z)));
  poles.forEach((p) => (p.position.set(((p.userData.x0 - dist) % 192 + 192) % 192 - 96, 0, 3.6)));
}
function seatInCar() {
  // B drives (left, -z), A rides (right, +z); both from the hips up
  car.add(B.root); B.root.position.set(-0.3, -0.36, -0.27); B.root.rotation.set(0, Math.PI / 2, 0); B.root.visible = true;
  pose(B, { L: [-0.2, 0.1, -0.5], Rt: [-1.2, 0.05, -0.25], legs: [-1.5, -1.5] });
  car.add(A.root); A.root.position.set(-0.3, -0.36, 0.27); A.root.rotation.set(0, Math.PI / 2, 0); A.root.visible = true;
}

/* ═════════════ shots ═════════════ */
const SH = {
  studio(t, u) {
    const s = S.studio;
    place(B.root, s, [0.2, 0, 0.3], -0.1); place(A.root, s, [-0.5, 0, -1.1], 0.3);
    const brow = E.outBack(P(t, C.brow, C.brow + 0.25));
    pose(B, { crossed: true, brows: [0, 0.03 * brow], head: [0, -0.05, 0.03 * brow] });
    const fix = Math.sin(P(t, 0.4, 1.6) * Math.PI);
    pose(A, { Rt: [-2.5 * fix - 0.2, -0.3, -0.9 * fix], head: [0.05, 0.25, 0] });
    A.shades.position.y = 0.16;
    cam([0.15 + u * 0.2, 1.3, 5.6], [-0.05, 1.2, 0], 38);
    return s;
  },
  shades(t, u) {
    const s = S.studio; place(A.root, s, [0, 0, 0], 0); B.root.visible = false;
    const p = E.outC(P(t, 2.15, 2.5));
    A.shades.position.y = mix(0.3, 0.16, p); A.shades.rotation.x = mix(-0.5, 0, p);
    pose(A, { Rt: [-2.9 + p * 0.3, -0.35, -1.6 * (1 - p)], head: [0.05 - 0.08 * p, 0, 0], brows: [0.01, 0.01], mouth: 0.1 * p });
    const g = P(t, C.glint - 0.05, C.glint + 0.25); A.glint.material.opacity = Math.sin(g * Math.PI); A.glint.position.x = mix(-0.14, 0.14, g);
    cam([0.02, 1.9, 1.5], [0, 1.86, 0], 30);
    return s;
  },
  wheel(t, u) {
    const s = S.road; place(car, s, [0, 0, 0], 0); roadScroll(u * u * 20); seatInCar(); car.wheelSpin(t * 40 * u);
    drone.visible = false; truck.visible = false;
    const [sx, sy] = shake(t, 0.01 + 0.02 * u);
    cam([1.9 + sx, 0.45 + sy, 3.4], [0.3, 0.5, 0.3], 38);
    return s;
  },
  roadSide(t, u) {
    const s = S.road; place(car, s, [0, 0, 0], 0); roadScroll(t * 30); car.wheelSpin(t * 60); seatInCar();
    pose(A, { L: [-1.0, 0.5, -0.9], Rt: [-1.0, -0.2, -0.9], torso: [0, 0, 0.45], head: [0.1, 0.2, 0], mouth: 0.25 });
    A.root.position.z = 0.34;
    place(ctrl, A.root, [-0.45, 1.25, 0.35]); ctrl.rotation.set(0.3, 0, 0.45);
    place(drone, s, [0.2 + Math.sin(t * 2) * 0.3, 1.6 + Math.sin(t * 3.1) * 0.12, 1.9], 0); drone.spin(t); drone.rotation.z = -0.12;
    const [sx, sy] = shake(t, 0.012);
    cam([0.6 + sx + u * 0.4, 1.0 + sy, 7.2], [0.1, 1.05, 0], 30);
    return s;
  },
  roadFront(t, u) {
    const s = S.road; place(car, s, [0, 0, 0], 0); roadScroll(t * 30); car.wheelSpin(t * 60); seatInCar();
    pose(A, { L: [-1.0, 0.5, -0.9], Rt: [-1.0, -0.2, -0.9], torso: [0, 0, 0.45], head: [0, 0.8, 0], mouth: 0.4 });
    A.root.position.z = 0.34;
    place(drone, s, [0.9, 1.7 + Math.sin(t * 3.1) * 0.1, 1.9], 0); drone.spin(t); drone.rotation.z = 0.1;
    const [sx, sy] = shake(t, 0.02);
    cam([6 + sx, 0.6 + sy, 2.4], [0, 0.9, 0.6], 34, 0.06);
    return s;
  },
  roadTop(t, u) {
    const s = S.road; place(car, s, [0, 0, 0], 0); roadScroll(t * 30); car.wheelSpin(t * 60); seatInCar();
    pose(A, { torso: [0, 0, 0.45], L: [-1.0, 0.5, -0.9], Rt: [-1.0, -0.2, -0.9] }); A.root.position.z = 0.34;
    place(drone, s, [0.3 + Math.sin(t * 4) * 0.4, 1.6, 1.8 + Math.sin(t * 2.3) * 0.3], 0); drone.spin(t);
    cam([0.1, 7.5, 0.4], [0.1, 0, 0.35], 40, Math.PI / 2);
    return s;
  },
  truck(t, u) {
    // slow-mo until the snap, then full speed
    const slow = t < C.snap, lt = slow ? (t - C.slow) * 0.22 : (C.snap - C.slow) * 0.22 + (t - C.snap);
    const s = S.road; place(truck, s, [3 - lt * 4, 0, -3.2], 0); truck.spin(lt * 30); roadScroll(lt * 30);
    car.visible = false;
    const dx = slow ? mix(3.2, 0.2, E.ioC(P(t, C.slow, C.snap))) : mix(0.2, -6, E.outC(P(t, C.snap, C.snap + 0.2)));
    place(drone, s, [dx, 0.62, -3.2], 0); drone.spin(lt); drone.rotation.z = slow ? 0.25 : 0.4; drone.boom.visible = false;
    const [sx, sy] = shake(t, slow ? 0.004 : 0.03);
    cam([dx + 0.5 + sx, 0.5 + sy, 1.8], [dx - 0.2, 0.75, -3.2], 38);
    return s;
  },
  catch(t, u) {
    const s = S.road; place(car, s, [0, 0, 0], 0); roadScroll(t * 30); car.wheelSpin(t * 60); seatInCar();
    const land = E.outC(P(t, 9.5, C.land));
    const bump = P(t, C.bump - 0.18, C.bump) - P(t, C.bump + 0.12, C.bump + 0.4);
    pose(A, { L: [-0.6, 1.1, -0.3], Rt: [-1.0 * clamp(bump + 0.2), 0.7, -0.5], head: [0.1, -0.5, 0], mouth: 0.15 });
    pose(B, { L: [-1.1 * clamp(bump + 0.1), 0.9 * clamp(bump + 0.1), -0.3], Rt: [-1.2, 0.05, -0.25], legs: [-1.5, -1.5], head: [0, -0.3, 0] });
    drone.boom.visible = true;
    place(drone, A.root, [-0.72, mix(1.8, 1.02, land), 0.18], 0); drone.spin(t * (1 - land * 0.9)); drone.scale.setScalar(1);
    const [sx, sy] = shake(t, t > C.bump && t < C.bump + 0.15 ? 0.03 : 0.004);
    cam([1.7 + sx, 1.5 + sy, 2.6], [-0.1, 1.0, 0.55], 40);
    return s;
  },
  doors(t, u) {
    const s = S.facade;
    const x = mix(9, -0.2, E.inC(P(t, 10.5, C.crash)));
    place(car, s, [0.2, 0, 5 - (9 - x)], Math.PI / 2); car.wheelSpin(t * 60); seatInCar(); pose(A, {}); pose(B, { L: [-1.25, 0.1, -0.2], legs: [-1.5, -1.5] });
    const hit = P(t, C.crash, C.crash + 0.25);
    doors.forEach(({ hinge, s: sd }) => (hinge.rotation.y = sd * -1.9 * E.outC(hit)));
    debris.forEach((m) => {
      const d = t - C.crash; m.visible = d > 0;
      if (d > 0) { const u2 = m.userData; m.position.set(u2.x + u2.vx * d, u2.y + u2.vy * d - 9 * d * d, 0.3 + u2.vz * d); m.rotation.set(u2.rs * d, u2.rs * d * 0.7, 0); }
    });
    if (t > C.crash + 0.08) car.visible = false;
    const [sx, sy] = shake(t, t > C.crash ? 0.06 * (1 - P(t, C.crash, C.crash + 0.4)) : 0.005);
    cam([1.6 + sx, 1.4 + sy, 9.5], [0, 2.1, 0], 38);
    return s;
  },
  or(t, u) {
    const s = S.or; drawECG(t, 0);
    place(car, s, [-1.4, 0, -2.6], 0.5); car.wheelSpin(0); car.remove(A.root); car.remove(B.root);
    place(A.root, s, [-0.45, 0, 0.3], 0.25); place(B.root, s, [0.55, 0, 0.1], -0.25);
    pose(A, { L: [-1.1, 0.2, -0.6], Rt: [-1.1, -0.2, -0.6], head: [0.05, 0, 0] });
    place(gimbal, A.root, [0.02, 1.33, 0.52]); gimbal.rotation.set(0, -0.3, 0);
    gimbal.position.z = 0.52 + 0.08 * Math.sin(P(t, 11.6, 13.4) * Math.PI);
    const snap = P(t, C.clap - 0.12, C.clap);
    pose(B, { L: [-1.2, 0.25, -0.5], Rt: [-1.3, -0.2, -0.6], head: [0, -0.2, 0] });
    place(clapper, B.root, [-0.05, 1.42, 0.55]); clapper.rotation.set(0, 0.2, 0); clapper.stick.rotation.z = mix(0.7, 0, E.inC(snap));
    cam([0.05 + u * 0.3, 1.45, 6.2], [0.05, 1.2, 0], 38);
    return s;
  },
  doc(t, u) {
    const s = S.or; drawECG(t, 0);
    place(DOC.root, s, [0, 0, 0.2], 0); place(N1.root, s, [-1.05, 0, -1.0], 0.3); place(N2.root, s, [1.05, 0, -1.1], -0.3);
    DOC.jaw.visible = true; DOC.stache.visible = true;
    const wag = C.wag.reduce((a, w) => a + Math.sin(P(t, w, w + 0.35) * Math.PI * 2) * 0.35, 0);
    DOC.finger.visible = true;
    pose(DOC, { Rt: [-2.3, -0.25 + wag, -0.5], L: [0, 0.12, 0], head: [0, 0, wag * 0.2], brows: [0.02, 0.035], mouth: 0.15 + 0.2 * Math.abs(Math.sin(t * 9)) });
    pose(N1, { head: [0, 0.2, 0] }); pose(N2, { head: [0, -0.2, 0] }); car.visible = false;
    cam([0.3 - u * 0.5, 1.55, 4.8], [0, 1.45, 0], 38);
    return s;
  },
  nurses(t, u) {
    const s = S.or; drawECG(t, 0); DOC.root.visible = false; car.visible = false;
    place(N1.root, s, [-0.42, 0, 0], 0.35); place(N2.root, s, [0.42, 0, 0], -0.35);
    const g = E.outBack(P(t, C.glance, C.glance + 0.2));
    pose(N1, { head: [0, 0.9 * g, 0], brows: [0.02 * g, 0.03 * g], L: [0, 0.1, -0.3], Rt: [0, -0.1, -0.3] });
    pose(N2, { head: [0, -0.9 * g, 0], brows: [0.03 * g, 0.02 * g], L: [0, 0.1, -0.3], Rt: [0, -0.1, -0.3] });
    cam([0 + u * 0.3, 1.8, 3.4], [0, 1.72, 0], 34);
    return s;
  },
  docCU(t, u) {
    const s = S.or; drawECG(t, 0); car.visible = false; N1.root.visible = N2.root.visible = false;
    place(DOC.root, s, [0, 0, 0], 0); DOC.finger.visible = false;
    pose(DOC, { brows: [0, 0.05], mouth: 0.05, head: [0, 0.15, 0.08] });
    DOC.stache.rotation.z = Math.sin(t * 60) * 0.12; DOC.stache.position.y = 0.07 + Math.abs(Math.sin(t * 30)) * 0.01;
    cam([0.08, 1.92, 1.45], [0, 1.88, 0], 28);
    return s;
  },
  edit(t, u) {
    const s = S.edit; drawTimeline(t);
    editHand.position.set(0.2 + Math.sin(t * 16) * 0.12, 1.12 + Math.abs(Math.sin(t * 22)) * 0.05, 0.25);
    if (t > 18.3) editHand.position.set(0.6, 1.1 + E.outC(P(t, 18.3, 18.5)) * 0.25, 0.1);
    enterKey.position.y = 0.048;
    cam([0.9 - u * 0.4, 2.15, 2.6], [0, 1.2, -0.1], 30);
    return s;
  },
  enter(t, u) {
    const s = S.edit; drawTimeline(t);
    const down = E.inC(P(t, 18.5, C.enter));
    editHand.position.set(0.6, mix(1.36, 1.08, down), -0.04);
    enterKey.position.y = t > C.enter ? 0.03 : 0.048;
    const [sx, sy] = shake(t, t > C.enter ? 0.03 : 0);
    cam([0.95 + sx, 1.28 + sy, 0.55], [0.6, 1.06, 0.13], 28, 0.08);
    return s;
  },
  phone(t, u) {
    const s = S.or; drawPhone(t - 19);
    place(DOC.root, s, [0, 0, 0], 0); car.visible = false; N1.root.visible = N2.root.visible = false;
    pose(DOC, { L: [-1.2, 0.35, -0.9], Rt: [-1.2, -0.35, -0.9], head: [0.35, 0, 0] });
    place(phone, DOC.root, [0, 1.45, 0.42]); phone.rotation.set(-0.35, 0, 0);
    cam([0.05, 1.62, 1.75], [0, 1.5, 0.3], 30);
    return s;
  },
  jaw(t, u) {
    const s = S.or; drawECG(t, 0); drawPhone(t - 19);
    place(DOC.root, s, [0, 0, 0], 0); car.visible = false;
    place(phone, DOC.root, [0, 1.32, 0.42]); phone.rotation.set(-0.8, 0, 0);
    const j = t - C.jaw;
    pose(DOC, { L: [-1.0, 0.35, -1.0], Rt: [-1.0, -0.35, -1.0], head: [-0.05, 0, 0], brows: [0.05 * clamp(j * 6), 0.05 * clamp(j * 6)], eyes: 1 + 0.6 * clamp(j * 5) });
    DOC.jaw.visible = j < 0; DOC.stache.visible = t < C.stache;
    DOC.mouth.scale.set(1.5, 0.22 + 2.2 * clamp(j * 8), 0.5); DOC.mouth.position.y = 0.035 - 0.03 * clamp(j * 8);
    if (j >= 0) { place(looseJaw, s, [0, bounceY(t, C.jaw, 1.55) + 0.02, 0.23], 0); looseJaw.rotation.x = clamp(j * 2) * 0.5; }
    else looseJaw.visible = false;
    if (t >= C.stache) { const d = t - C.stache; place(looseStache, s, [0.3 * d, 1.83 + 2.2 * d - 5 * d * d, 0.25 + 0.3 * d], 0); looseStache.rotation.set(d * 9, d * 14, d * 20); }
    else looseStache.visible = false;
    const [sx, sy] = shake(t, j > 0 && j < 0.25 ? 0.02 : 0);
    cam([0.02 + sx, 1.25 + sy, 3.3], [0, 1.15, 0], 36);
    return s;
  },
  domino(t, u) {
    const s = S.or; drawECG(t, 0);
    DOC.root.visible = false; car.visible = false;
    pose(DOC, { L: [-1.0, 0.35, -1.0], Rt: [-1.0, -0.35, -1.0], eyes: 1.6, brows: [0.05, 0.05] }); DOC.mouth.scale.set(1.5, 2.4, 0.5);
    [N1, N2, N3].forEach((n, i) => {
      place(n.root, s, [-0.75 + i * 0.75, 0, -0.8 + (i % 2) * 0.35], (1 - i) * 0.2);
      const j = P(t, C.jaws[i], C.jaws[i] + 0.12);
      pose(n, { mouth: 1.8 * j, eyes: 1 + 0.5 * j, brows: [0.04 * j, 0.04 * j] });
      n.mask.position.y = 0.07 - (t > C.jaws[i] ? Math.min(0.35, (t - C.jaws[i]) * 3) : 0);
      n.mask.rotation.x = t > C.jaws[i] ? 0.4 : 0;
    });
    looseJaw.visible = false; looseStache.visible = false;
    cam([-0.5 + u * 1.0, 1.75, 3.4], [0, 1.65, -0.7], 38);
    return s;
  },
  floor(t, u) {
    const s = S.or; drawECG(t, clamp(P(t, C.heart, C.heart + 0.5)));
    DOC.root.visible = false; car.visible = false; [N1, N2, N3].forEach((n) => (n.root.visible = false));
    const h = C.bounce.reduce((a, b, i) => a + (t > b ? Math.max(0, Math.sin(P(t, b, b + 0.28) * Math.PI) * 0.25 * (0.5 ** i)) : 0), 0);
    place(looseJaw, s, [0, 0.02 + h, 0.2], 0.3); looseJaw.rotation.set(0.1, 0.3, h * 2);
    place(looseStache, s, [0.35, 0.03, 0.45], 0.8); looseStache.rotation.set(Math.PI / 2, 0, 0.3);
    monitor.position.set(0.1, 0, -1.4);
    cam([0.25, 1.0, 2.2], [0.1, 0.15, 0.3], 34);
    return s;
  },
  exit(t, u) {
    const s = S.or; drawECG(t, 1); drawPhone(t - 19);
    monitor.position.set(2.0, 0, -1.9);
    place(DOC.root, s, [0.1, 0, 0.9], 0.15); pose(DOC, { L: [-1.0, 0.35, -1.0], Rt: [-1.0, -0.35, -1.0], eyes: 1.6, brows: [0.05, 0.05] }); DOC.jaw.visible = false; DOC.stache.visible = false; DOC.mouth.scale.set(1.5, 2.4, 0.5);
    place(phone, DOC.root, [0, 1.32, 0.42]); phone.rotation.set(-0.8, 0, 0);
    [N1, N2, N3].forEach((n, i) => { place(n.root, s, [-0.7 + i * 0.7, 0, -1.5], 0.1); pose(n, { mouth: 1.8, eyes: 1.5, brows: [0.04, 0.04] }); n.mask.position.y = -0.28; n.mask.rotation.x = 0.4; });
    place(looseJaw, s, [0.5, 0.02, 1.6], 0.3); place(looseStache, s, [0.9, 0.03, 1.7], 0.8); looseStache.rotation.set(Math.PI / 2, 0, 0.3);
    // the two walk to the door, cool
    const w = E.ioC(P(t, 23.6, 25.5));
    const step = Math.sin(t * 9) * 0.45 * (w > 0 && w < 1 ? 1 : 0);
    place(A.root, s, [mix(1.3, 2.3, w), 0, mix(0.4, -4.2, w)], mix(-0.3, -2.5, P(t, 23.5, 23.8)));
    place(B.root, s, [mix(1.9, 2.8, w), 0, mix(0.1, -4.4, w)], mix(-0.5, -2.5, P(t, 23.5, 23.8)));
    pose(A, { legs: [step, -step], L: [-step * 0.5, 0.1, 0], Rt: [step * 0.5, -0.1, 0] });
    const sh = E.outBack(P(t, C.shades2, C.shades2 + 0.25));
    pose(B, { legs: [-step, step], L: [step * 0.5, 0.1, 0], Rt: [-2.6 * Math.sin(P(t, C.shades2 - 0.3, C.shades2 + 0.3) * Math.PI), -0.3, -1.2 * Math.sin(P(t, C.shades2 - 0.3, C.shades2 + 0.3) * Math.PI)] });
    B.shades.visible = t > C.shades2; B.shades.position.y = mix(0.3, 0.16, sh);
    orDoor.rotation.y = -1.4 * E.outC(P(t, 24.8, 25.1));
    cam([0.9, 2.0, 7.8], [0.9, 1.1, -0.8], 42);
    return s;
  },
};

/* ═════════════ overlay: speed lines, flash, captions, end card ═════════════ */
const HITS = [[C.bump, 560, 900, 0.4, 0.3], [C.crash, 540, 1000, 0.45, 0.5], [C.clap, 610, 900, 0.35, 0.3], [C.enter, 560, 1050, 0.3, 0], [C.jaw, 540, 820, 0.55, 0.3], [C.logo, 540, 960, 0.5, 0]];
const INVERT = [C.bump, C.crash, C.jaw];
const VB = { x: 220, y: 340, w: 660 }, DOT = { x: 589.63, y: 568.91, r: 26.43 };
const LS = 700 / VB.w, LDOT = { x: 190 + (DOT.x - VB.x) * LS, y: 748 + (DOT.y - VB.y) * LS };
const el = {}; let fx, gctx, lastWord = -1, pending = [];

function burst(t, [t0, cx, cy, life]) {
  const p = (t - t0) / life; if (p < 0 || p >= 1) return;
  const R = rng(Math.floor((t - t0) * 12) * 7919 + Math.round(t0 * 100));
  fx.save(); fx.fillStyle = "#fff";
  for (let i = 0, n = 84; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 + (R() - 0.5) * 0.07, r0 = (300 + R() * 260) * (1 + p * 0.35), r1 = 1700, w = (3 + R() * 16) * (R() < 0.15 ? 2 : 1);
    const ca = Math.cos(ang), sa = Math.sin(ang);
    fx.globalAlpha = (1 - p) ** 1.4 * (0.45 + R() * 0.5);
    fx.beginPath(); fx.moveTo(cx + ca * r0, cy + sa * r0); fx.lineTo(cx + ca * r1 - sa * w, cy + sa * r1 + ca * w); fx.lineTo(cx + ca * r1 + sa * w, cy + sa * r1 - ca * w); fx.closePath(); fx.fill();
  }
  fx.restore();
}
function speedStreaks(t, amt) {   // horizontal streaks on the highway
  if (amt <= 0) return; const R = rng(Math.floor(t * 12) + 3);
  fx.save(); fx.fillStyle = "#fff";
  for (let i = 0; i < 26; i++) { const y = R() * 1920, x = R() * 1400 - 200, w = 200 + R() * 500; fx.globalAlpha = amt * (0.1 + R() * 0.25); fx.fillRect(x, y, w, 2 + R() * 3); }
  fx.restore();
}
function words(t) {
  const i = K.WORDS.findIndex((w) => t >= w.a && t < w.b);
  if (i !== lastWord) {
    lastWord = i; el.word.innerHTML = ""; el.word.className = i >= 0 && K.WORDS[i].quote ? "quote" : "";
    if (i >= 0) { const d = document.createElement("div"); K.WORDS[i].text.split(" ").forEach((w) => { const s = document.createElement("span"); s.className = "w"; s.textContent = w; d.append(s); }); el.word.append(d); }
  }
  if (i < 0) return;
  const w = K.WORDS[i], out = 1 - P(t, w.b - 0.14, w.b);
  el.word.querySelectorAll(".w").forEach((s, k) => { const p = E.outExpo(P(t, w.a + k * 0.07, w.a + k * 0.07 + 0.3)); s.style.opacity = (p * out).toFixed(3); s.style.transform = `translate3d(0, ${((1 - p) * 30).toFixed(1)}px, 0)`; });
}
function grain(t) {
  const R = rng(Math.floor(t * 12) + 11), img = gctx.createImageData(600, 1067), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const v = R() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
  gctx.putImageData(img, 0, 0);
}

function renderAt(t) {
  // reset shared actors; each shot places what it needs
  for (const o of [A.root, B.root, DOC.root, N1.root, N2.root, N3.root, car, drone, truck, clapper, gimbal, ctrl, phone, looseJaw, looseStache]) o.visible = false;
  drone.boom.visible = true; drone.scale.setScalar(1);
  DOC.finger.visible = false; DOC.stache.rotation.z = 0; DOC.stache.position.y = 0.07; B.shades.visible = false; A.shades.position.y = 0.16; A.shades.rotation.x = 0; A.glint.material.opacity = 0;
  monitor.position.set(2.0, 0, -1.9); orDoor.rotation.y = 0;
  const shot = K.SHOTS.find((s) => t >= s.a && t < s.b);
  const onEnd = t >= C.stop;
  if (shot && !onEnd) {
    const u = (t - shot.a) / (shot.b - shot.a);
    const scene = SH[shot.id](t, u);
    renderer.render(scene, camera);
    $("#gl").style.opacity = "1";
  } else $("#gl").style.opacity = "0";
  const inv = INVERT.some((c) => t >= c && t < c + 2 / FPS);
  $("#gl").style.filter = inv ? "invert(1) contrast(1.3)" : "none";

  fx.clearRect(0, 0, 1080, 1920);
  speedStreaks(t, (t >= 4 && t < 8 ? 0.8 : 0) + (t >= C.snap && t < 9.5 ? 1 : 0));
  HITS.forEach((h) => burst(t, h));
  let fl = 0;
  HITS.forEach(([t0, , , , f]) => { if (f && t >= t0) fl = Math.max(fl, f * (1 - P(t, t0, t0 + 0.1))); });
  if (t >= C.enter) fl = Math.max(fl, 0.95 * (1 - P(t, C.enter + 0.05, 19.1)));
  el.flash.style.opacity = fl.toFixed(3);
  words(t);

  // end card: the logo's sun drops in like the jaw, bounces, then the letters open from it
  el.end.style.opacity = onEnd ? "1" : "0";
  const dropY = bounceY(t, C.logo, 700, 5200, 0.38);
  const LAND = C.logo + Math.sqrt((2 * 700) / 5200), landed = t >= LAND;
  el.dot.setAttribute("transform", `translate(0 ${(-dropY / LS).toFixed(1)})`);
  el.dot.style.opacity = t >= C.logo ? "1" : "0";
  const rp = E.outC(P(t, LAND, LAND + 0.85)), lx = LDOT.x - 190, ly = LDOT.y - 748, r = mix(0, 900, rp);
  const msk = `radial-gradient(circle ${r.toFixed(0)}px at ${lx.toFixed(0)}px ${ly.toFixed(0)}px, #000 ${Math.max(0, r - 200).toFixed(0)}px, transparent ${r.toFixed(0)}px)`;
  el.letters.style.webkitMaskImage = el.letters.style.maskImage = msk;
  el.letters.style.opacity = landed ? "1" : "0";
  el.logo.style.opacity = onEnd ? "1" : "0";
  const e1 = E.outExpo(P(t, C.line, C.line + 0.8)), e2 = E.outExpo(P(t, C.pill, C.pill + 0.8));
  el.endL.style.opacity = e1.toFixed(3); el.endL.style.transform = `translate3d(0, ${((1 - e1) * 24).toFixed(1)}px, 0)`;
  el.endP.style.opacity = e2.toFixed(3); el.endP.style.transform = `translate3d(-50%, ${((1 - e2) * 20).toFixed(1)}px, 0)`;

  grain(t);
  el.black.style.opacity = Math.max(1 - P(t, 0, 0.12), t >= C.stop && t < C.logo ? 1 : 0, P(t, DUR - 0.4, DUR - 0.03)).toFixed(3);
}

async function init() {
  const doc = new DOMParser().parseFromString(await (await fetch("/public/hero/rast-sun-logo.svg")).text(), "image/svg+xml");
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg"); svg.setAttribute("viewBox", doc.documentElement.getAttribute("viewBox"));
  const letters = document.createElementNS(NS, "g");
  for (const sh of doc.querySelectorAll("path, polygon, rect, circle, ellipse")) { const n = document.importNode(sh, true); n.removeAttribute("class"); n.setAttribute("class", "lt"); letters.append(n); }
  const dot = document.createElementNS(NS, "circle");
  Object.entries({ cx: DOT.x, cy: DOT.y, r: DOT.r + 0.6, fill: "#ff8a3d" }).forEach(([k, v]) => dot.setAttribute(k, v));
  // letters live in a masked HTML wrapper so the mask can open from the dot
  const wrapL = document.createElement("div"); wrapL.style.cssText = "position:absolute;inset:0";
  const svgL = svg.cloneNode(); svgL.append(letters); wrapL.append(svgL);
  const svgD = svg.cloneNode(); svgD.style.cssText = "position:absolute;inset:0"; svgD.append(dot);
  $("#logo").append(wrapL, svgD);
  Object.assign(el, { word: $("#word"), end: $("#end"), logo: $("#logo"), endL: $("#endL"), endP: $("#endP"), flash: $("#flash"), black: $("#black"), letters: wrapL, dot });
  fx = $("#fx").getContext("2d"); gctx = $("#grain").getContext("2d");
  await document.fonts.load('800 78px "Inter"'); await document.fonts.load('italic 500 70px "Fraunces"');
  renderer.compile(S.studio, camera);
}

const raf = () => new Promise((r) => requestAnimationFrame(() => r()));
window.__ready = init();
window.__meta = { fps: FPS, duration: DUR, width: 1080, height: 1920 };
window.__render = async (t) => { pending = []; renderAt(t); await Promise.all(pending); await raf(); };

if (/[?&]preview/.test(location.search)) {
  const ui = $("#ui"), play = $("#play"), scrub = $("#scrub"), tc = $("#tcu"), stage = $("#stage");
  ui.style.display = "flex";
  const fit = () => (stage.style.transform = `scale(${Math.min(innerWidth / 1080, (innerHeight - 44) / 1920)})`);
  window.__ready.then(() => { fit(); renderAt(0); });
  addEventListener("resize", fit);
  let playing = false, t0 = 0, from = 0, actx = null, buf = null, node = null;
  const loop = () => { if (!playing) return; const t = from + (performance.now() - t0) / 1000; if (t >= DUR) { playing = false; return; } renderAt(t); scrub.value = t; tc.textContent = t.toFixed(2); requestAnimationFrame(loop); };
  play.onclick = async () => {
    if (playing) { playing = false; node?.stop(); return; }
    if (!buf && window.Cekim3DAudio) { play.textContent = "…"; actx = new AudioContext(); buf = await window.Cekim3DAudio.render(); }
    from = +scrub.value; t0 = performance.now(); playing = true; play.textContent = "❚❚";
    if (buf) { node = actx.createBufferSource(); node.buffer = buf; node.connect(actx.destination); node.start(0, from); }
    loop();
  };
  scrub.oninput = () => { if (!playing) { renderAt(+scrub.value); tc.textContent = (+scrub.value).toFixed(2); } };
}
