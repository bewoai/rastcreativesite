/*
 * Rast Creative — "Karanlık Oda" · picture engine
 * ------------------------------------------------------------------
 * A dark room with one light: the ra.st dot of the logo. The sun travels
 * through every scene (centre → behind the aperture → logo → around the
 * orbit → end card), so the cuts stay seamless without any zoom move.
 * Everything sits on the centre axis inside the Instagram safe zone
 * (content y 280–1480); the logo is dead centre (540, 960).
 *
 * 128 BPM, one bar = 4 beats = 1.875 s. Scenes sit on bars:
 *   A  b0–8   "Her hikâye karanlıkta başlar."
 *   B  b8–16  "Işığı topluyoruz." — an aperture closes stop by stop
 *   C  b16–24 light burst → logo
 *   D  b24–32 idea → screen: five steps on one orbit
 *   E  b32–40 real work on a ring (one card per beat)
 *   F  b40–48 service wall, one row lit per beat
 *   G  b48–52 footage-filled slams
 *   H  b52–   end card
 */
(() => {
  "use strict";
  const FPS = 60, DUR = 29, BPM = 128, BT = 60 / BPM;
  const b = (n) => n * BT;
  const BASE = "/automations/brand-film";
  const $ = (s, r = document) => r.querySelector(s);
  const clamp = (x, a = 0, c = 1) => (x < a ? a : x > c ? c : x);
  const P = (t, a, c) => (!(t > a) ? 0 : t >= c ? 1 : (t - a) / (c - a));
  const mix = (a, c, p) => a + (c - a) * p;
  const E = {
    inC: (x) => x ** 3, outC: (x) => 1 - (1 - x) ** 3,
    ioC: (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
    outQ: (x) => 1 - (1 - x) ** 2,
    outExpo: (x) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x)),
    ioS: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
  };
  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  const st = (el, o) => { for (const k in o) { const v = o[k]; if (el.style[k] !== v) el.style[k] = v; } };
  const show = (el, on) => st(el, { display: on ? "block" : "none" });
  /** Masked line reveal: in over [a, a+d], out over [o, o+d2]. */
  const rise = (el, t, a, d = 0.42, o = Infinity, d2 = 0.28) => {
    const i = E.outExpo(P(t, a, a + d)), x = E.inC(P(t, o, o + d2));
    st(el, { transform: `translate3d(0, ${((1 - i) * 112 - x * 112).toFixed(2)}%, 0)` });
  };

  const SC = { A: [0, b(8)], B: [b(8), b(16)], C: [b(16), b(24)], D: [b(24), b(32)], E: [b(32), b(40)], F: [b(40), b(48)], G: [b(48), b(52)], H: [b(52), DUR] };
  const CX = 540, CY = 960;
  const SVGNS = "http://www.w3.org/2000/svg";
  const mk = (tag, attrs = {}, parent) => { const n = document.createElementNS(SVGNS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.append(n); return n; };
  const sa = (n, o) => { for (const k in o) { const v = String(o[k]); if (n.getAttribute(k) !== v) n.setAttribute(k, v); } };

  let CLIPS = {}, MAN = {}, pending = [];
  const el = {};
  const imgFrame = (img, id, k) => {
    const n = MAN[id].count, f = String(1 + (((k % n) + n) % n)).padStart(4, "0");
    const src = `${BASE}/.cache/dark/${id}/${f}.jpg`;
    if (img.getAttribute("src") !== src) { img.setAttribute("src", src); pending.push(img.decode().catch(() => {})); }
  };
  const preload = (src) => { const i = new Image(); i.src = src; pending.push(i.decode().catch(() => {})); return src; };

  /* ───── logo (site SVG), dot centre in viewBox units ───── */
  const VB = { x: 220, y: 340, w: 660, h: 400 }, DOT = { x: 589.63, y: 568.91, r: 26.43 };
  async function buildLogos() {
    const doc = new DOMParser().parseFromString(await (await fetch("/public/hero/rast-sun-logo.svg")).text(), "image/svg+xml");
    for (const host of [$("#logoC"), $("#logoH")]) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", `${VB.x} ${VB.y} ${VB.w} ${VB.h}`);
      for (const sh of doc.querySelectorAll("path, polygon, rect")) {
        const node = document.importNode(sh, true); node.removeAttribute("class"); node.setAttribute("class", "lt"); svg.append(node);
      }
      host.append(svg);
    }
  }
  const logoDot = (left, top, width) => { const s = width / VB.w; return { x: left + (DOT.x - VB.x) * s, y: top + (DOT.y - VB.y) * s, d: 2 * DOT.r * s }; };
  const DOT_C = logoDot(110, 700, 860), DOT_H = logoDot(190, 748, 700);

  /* ───── B · aperture ───── */
  const IR = 252;                                   // iris rim radius
  const FST = ["f/1.4", "f/2", "f/2.8", "f/4", "f/5.6", "f/8", "f/11", "f/16"];
  function aperture(t) {
    // Open until b9, then one stop per beat; shut at b15.5; blown open by the drop.
    if (t < b(9)) return { a: IR, k: 0 };
    if (t < b(15.5)) {
      const s = (t - b(9)) / BT, k = Math.min(7, Math.floor(s) + 1), f = s - Math.floor(s);
      const from = IR * 0.94 / Math.SQRT2 ** (k - 1), to = IR * 0.94 / Math.SQRT2 ** k;
      return { a: mix(k === 1 ? IR : from, to, E.outExpo(clamp(f / 0.16))), k };
    }
    if (t < b(16)) return { a: mix(IR * 0.94 / Math.SQRT2 ** 7, 0, E.outC(P(t, b(15.5), b(15.5) + 0.09))), k: 7 };
    return { a: mix(0, IR * 1.4, E.outExpo(P(t, b(16), b(16) + 0.3))), k: 7 };
  }
  function irisGeom(a, rot) {
    const V = Array.from({ length: 8 }, (_, k) => { const th = ((k * 45 + rot) * Math.PI) / 180; return [CX + a * Math.cos(th), CY + a * Math.sin(th)]; });
    const hole = "M" + V.map((v) => v[0].toFixed(2) + "," + v[1].toFixed(2)).join("L") + "Z";
    const rim = `M${CX - IR},${CY}a${IR},${IR} 0 1,0 ${2 * IR},0a${IR},${IR} 0 1,0 ${-2 * IR},0Z`;
    const lines = V.map((v, k) => {
      const w = V[(k + 1) % 8]; let ux = w[0] - v[0], uy = w[1] - v[1]; const L = Math.hypot(ux, uy) || 1; ux /= L; uy /= L;
      if (a < 0.5) { const th = ((k * 45 + rot + 90) * Math.PI) / 180; ux = Math.cos(th); uy = Math.sin(th); }
      const px = v[0] - CX, py = v[1] - CY, d = px * ux + py * uy, s = -d + Math.sqrt(Math.max(0, d * d - (px * px + py * py) + IR * IR));
      return [v[0], v[1], v[0] + ux * s, v[1] + uy * s];
    });
    return { d: rim + hole, lines };
  }

  /* ───── D · orbit process ───── */
  const NODES = [
    ["FİKİR", "brief · strateji"],
    ["SENARYO", "metin · storyboard"],
    ["ÇEKİM", "set · ışık · drone"],
    ["KURGU", "renk · ses · motion"],
    ["YAYIN", "reels · reklam · web"],
  ];
  const OR = 300;
  const orbitAngle = (t) => {
    if (t < b(24.6)) return -90;
    // Travel to node i during the half beat before b(24.6 + i), land on the beat.
    if (t < b(29.6)) { const s = (t - b(24.6)) / BT + 0.55, k = Math.floor(s), f = s - k; return -90 + 72 * clamp(k - 1 + E.ioC(clamp(f / 0.55)), 0, 4); }
    return 198 + 72 * E.ioC(P(t, b(29.6), b(31)));
  };
  const onOrbit = (deg, r = OR) => ({ x: CX + r * Math.cos((deg * Math.PI) / 180), y: CY + r * Math.sin((deg * Math.PI) / 180) });

  /* ───── F · wall ───── */
  const WALL = ["REKLAM FİLMİ", "MARKA FİLMİ", "REELS", "DRONE", "FOTOĞRAF", "SENARYO", "KURGU", "RENK", "MOTION", "SES TASARIMI", "SOSYAL MEDYA", "VFX"];
  const WALL_HI = [4, 7, 3, 8, 5, 2, 6, 5];

  /* ───── G · slams ───── */
  const SLAM = [["FİKİR", "f1", "ALTOTEKS"], ["IŞIK", "f2", "CANDLELIT BALLET"], ["EMEK", "f3", "CANEX"], ["RAST", "f4", "ADATIP × SAKARYASPOR"]];

  /* ───── vector layer ───── */
  function buildFx() {
    const fx = el.fx, defs = mk("defs", {}, fx);
    const gr = mk("radialGradient", { id: "irisFill", cx: CX, cy: CY, r: IR, gradientUnits: "userSpaceOnUse" }, defs);
    mk("stop", { offset: "0", "stop-color": "#2a1c14" }, gr); mk("stop", { offset: "1", "stop-color": "#0d0a09" }, gr);
    mk("path", { id: "cpath", d: `M${CX},${CY} m-306,0 a306,306 0 1,1 612,0 a306,306 0 1,1 -612,0` }, defs);
    // A · rings, dial ticks, satellites
    const gA = el.gA = mk("g", {}, fx);
    el.rings = [118, 184, 246].map((r) => mk("circle", { cx: CX, cy: CY, r, class: "thin", pathLength: 1, "stroke-dasharray": "1 1", transform: `rotate(-90 ${CX} ${CY})` }, gA));
    el.ticks = mk("g", {}, gA);
    for (let k = 0; k < 90; k++) { const th = (k * 4 * Math.PI) / 180, r0 = 268, r1 = k % 15 === 0 ? 290 : 278; mk("line", { x1: CX + r0 * Math.cos(th), y1: CY + r0 * Math.sin(th), x2: CX + r1 * Math.cos(th), y2: CY + r1 * Math.sin(th), class: "tick" }, el.ticks); }
    el.sats = [[118, 70, 0], [184, -42, 2], [246, 28, 4.2]].map(([r, v, p]) => ({ c: mk("circle", { r: 5, class: "sat" }, gA), r, v, p }));
    // B · aperture, progress arc, circular text
    const gB = el.gB = mk("g", {}, fx);
    el.ctext = mk("g", {}, gB);
    const tx = mk("text", { class: "ctext" }, el.ctext);
    const tp = mk("textPath", { href: "#cpath", textLength: String(2 * Math.PI * 306 - 4), lengthAdjust: "spacing" }, tx);
    tp.textContent = "FİKİR • SENARYO • IŞIK • ÇEKİM • KURGU • RENK • SES • MOTION • ";
    el.parc = mk("circle", { cx: CX, cy: CY, r: 278, class: "amb", pathLength: 1, "stroke-dasharray": "0 1", transform: `rotate(-90 ${CX} ${CY})` }, gB);
    mk("circle", { cx: CX, cy: CY, r: 278, class: "thin" }, gB);
    el.iris = mk("path", { fill: "url(#irisFill)", "fill-rule": "evenodd" }, gB);
    el.blades = Array.from({ length: 8 }, () => mk("line", { class: "blade" }, gB));
    mk("circle", { cx: CX, cy: CY, r: IR, fill: "none", stroke: "rgba(255, 175, 120, .45)", "stroke-width": 2.5 }, gB);
    // D · orbit
    const gD = el.gD = mk("g", {}, fx);
    mk("circle", { cx: CX, cy: CY, r: OR, class: "thin" }, gD);
    el.oarc = mk("circle", { cx: CX, cy: CY, r: OR, class: "amb", pathLength: 1, "stroke-dasharray": "0 1", transform: `rotate(-90 ${CX} ${CY})` }, gD);
    el.onodes = NODES.map((_, i) => {
      const deg = -90 + 72 * i, p = onOrbit(deg), q = onOrbit(deg, OR + 58);
      const ring = mk("circle", { cx: p.x, cy: p.y, r: 20, class: "node" }, gD);
      const dot = mk("circle", { cx: p.x, cy: p.y, r: 8, fill: "#ff8a3d", opacity: 0 }, gD);
      const num = mk("text", { x: q.x, y: q.y + 8, "text-anchor": "middle", class: "nnum" }, gD); num.textContent = "0" + (i + 1);
      return { ring, dot, num };
    });
    // Shockwave ring, fired on the cuts.
    el.shock = mk("circle", { cx: CX, cy: CY, r: 0, fill: "none", stroke: "#ffb070", "stroke-width": 3, opacity: 0 }, fx);
  }
  const SHOCKS = [[8, CX, CY], [16, 0, 0], [24, CX, CY], [32, CX, CY], [40, CX, CY], [48, CX, CY], [52, 0, 1]];

  async function init() {
    const J = await (await fetch(`${BASE}/dark/clips.json`)).json();
    for (const c of J.clips) CLIPS[c.id] = c;
    MAN = await (await fetch(`${BASE}/.cache/dark/manifest.json`)).json();
    await Promise.all([
      document.fonts.load('900 120px "Inter"'), document.fonts.load('600 30px "Inter"'),
      document.fonts.load('italic 440 100px "Fraunces"'),
    ]);
    await buildLogos();
    for (const id of ["A", "B", "C", "D", "E", "F", "G", "H"]) el[id] = $("#" + id);
    Object.assign(el, {
      glow: $("#glow"), grid: $("#grid"), rays: $("#rays"), dust: $("#dust"), sun: $("#sun"), halo: $("#halo"), flare: $("#flare"),
      bloom: $("#bloom"), black: $("#black"), fx: $("#fx"),
      fstop: $("#fstop"), fstopK: $("#fstopK"),
      logoC: $("#logoC"), tagC: $("#tagC"), subC: $("#subC"),
      stepW: $("#stepW span"), stepS: $("#stepS"), stepN: $("#stepN"), pipeF: $("#pipeF"),
      ring: $("#ring"), galN: $("#galN span"), galH: $("#galH"), galK: $("#galK"),
      wall: $("#wall"), wallK: $("#wallK"),
      slamW: $("#slamW"), slamO: $("#slamO"), slamK: $("#slamK"),
      logoH: $("#logoH"), endL: $("#endL"), endP: $("#endP"), endS: $("#endS"),
    });
    buildFx();
    // Ring cards.
    el.cards = J.clips.filter((c) => c.id[0] === "g").map((c, i, a) => {
      const d = document.createElement("div"); d.className = "card";
      const img = new Image(); img.alt = c.name;
      const sh = document.createElement("div"); sh.className = "sh";
      const gl = document.createElement("div"); gl.className = "gl";
      d.append(img, sh, gl); el.ring.append(d);
      return { d, img, sh, gl, c, a0: (360 / a.length) * i };
    });
    // Wall rows.
    el.wrows = WALL.map((w, i) => {
      const d = document.createElement("p"); d.className = "wrow"; d.style.top = i * 112 + "px";
      d.innerHTML = Array.from({ length: 5 }, () => w).join("<b>•</b>") + "<b>•</b>";
      el.wall.append(d);
      return d;
    });
    el.wall.style.display = "block";
    show(el.F, true); el.wrows.forEach((r) => (r.w = r.scrollWidth)); show(el.F, false);
    // Slam sizes: each word fills 980 px.
    show(el.G, true);
    el.slams = SLAM.map(([w]) => {
      el.slamO.style.fontSize = "200px"; el.slamO.innerHTML = `<span>${w}.</span>`;
      const k = 900 / el.slamO.firstChild.getBoundingClientRect().width; el.slamO._w = null; return 200 * k;
    });
    show(el.G, false);
    // Dust.
    const R = rng(7);
    el.motes = Array.from({ length: 46 }, () => {
      const i = document.createElement("i"); el.dust.append(i);
      return { i, x: R() * 1080, y: R() * 1920, v: 18 + R() * 50, s: 0.4 + R() * 1.1, ph: R() * 6.28, a: 0.25 + R() * 0.6 };
    });
    // Grain.
    const cv = document.createElement("canvas"); cv.width = cv.height = 256;
    const cx = cv.getContext("2d"), id = cx.createImageData(256, 256), r2 = rng(11);
    for (let k = 0; k < id.data.length; k += 4) { const v = 128 + (r2() - 0.5) * 255; id.data[k] = id.data[k + 1] = id.data[k + 2] = v; id.data[k + 3] = 255; }
    cx.putImageData(id, 0, 0);
    $("#grain").style.backgroundImage = `url(${cv.toDataURL()})`;
  }

  /* beat pulse: 1 on each beat, decays */
  const beatPulse = (t, from, to, k = 7) => { if (t < from || t >= to) return 0; const x = (t - from) % BT; return Math.exp(-x * k); };

  function sunPath(t) {
    // Centre → behind the aperture → logo dot → around the orbit → gone → end logo dot.
    if (t < b(8)) {
      const ign = E.outExpo(P(t, 0.12, 0.9));
      const flick = t < 0.9 ? 0.75 + 0.25 * Math.sin(t * 90) * Math.sin(t * 37) : 1;
      return { x: CX, y: CY, s: ign * flick * 1.2, g: ign * (0.55 + 0.45 * P(t, 0.9, b(6))) };
    }
    if (t < b(15.6)) { const o = aperture(t).a / IR; return { x: CX, y: CY, s: 1.35, g: 0.25 + 0.75 * o }; }
    if (t < b(16)) { const p = E.ioC(P(t, b(15.6), b(16))); return { x: mix(CX, DOT_C.x, p), y: mix(CY, DOT_C.y, p), s: mix(1.35, DOT_C.d / 52, p), g: 0.2 }; }
    if (t < b(23.4)) return { x: DOT_C.x, y: DOT_C.y, s: DOT_C.d / 52, g: 1 };
    const top = onOrbit(-90);
    if (t < b(24.4)) { const p = E.ioC(P(t, b(23.4), b(24.4))); return { x: mix(DOT_C.x, top.x, p), y: mix(DOT_C.y, top.y, p), s: mix(DOT_C.d / 52, 0.7, p), g: mix(1, 0.75, p) }; }
    if (t < b(32)) { const q = onOrbit(orbitAngle(t)), f = 1 - E.inC(P(t, b(31.3), b(32))); return { x: q.x, y: q.y, s: 0.7 * f, g: 0.75 * f }; }
    if (t < b(52)) return { x: CX, y: CY, s: 0, g: 0 };
    const p = E.outExpo(P(t, b(52), b(53)));
    return { x: DOT_H.x, y: DOT_H.y, s: (DOT_H.d / 52) * p, g: p };
  }

  function renderAt(t) {
    const scene = Object.keys(SC).find((k) => t >= SC[k][0] && t < SC[k][1]) || "H";
    for (const k in SC) show(el[k], k === scene);

    /* room + sun */
    const S = sunPath(t);
    const kick = beatPulse(t, b(16), b(48)) * 0.35 + beatPulse(t, b(4), b(8), 5) * 0.2 + beatPulse(t, b(48), b(52), 4) * 0.6;
    const burst = Math.exp(-Math.max(0, t - b(16)) * 2.2) * (t >= b(16) ? 1 : 0);
    const endBurst = Math.exp(-Math.max(0, t - b(52)) * 3) * (t >= b(52) ? 1 : 0);
    const g = clamp(S.g * (1 + kick) + burst * 1.2);
    st(el.sun, { transform: `translate3d(${S.x.toFixed(1)}px, ${S.y.toFixed(1)}px, 0) scale(${S.s.toFixed(4)})`, opacity: S.s > 0.01 ? "1" : "0",
      boxShadow: `0 0 ${(30 + 40 * g).toFixed(0)}px ${(6 + 10 * g).toFixed(0)}px rgba(255, 140, 60, ${(0.4 + 0.3 * clamp(g)).toFixed(3)})` });
    st(el.halo, { transform: `translate3d(${S.x.toFixed(1)}px, ${S.y.toFixed(1)}px, 0) scale(${(0.35 + 0.9 * g).toFixed(3)})`, opacity: String(clamp(g * 1.1).toFixed(3)) });
    const gx = scene === "E" || scene === "F" || scene === "G" ? CX : S.x, gy = scene === "E" || scene === "F" || scene === "G" ? CY : S.y;
    const ga = scene === "E" ? 0.22 + kick * 0.3 : scene === "F" ? 0.12 + kick * 0.2 : scene === "G" ? 0.1 + kick * 0.25 : 0.3 * g;
    st(el.glow, { background: `radial-gradient(900px 900px at ${gx.toFixed(0)}px ${gy.toFixed(0)}px, rgba(255, 110, 40, ${ga.toFixed(3)}), rgba(120, 36, 8, ${(ga * 0.45).toFixed(3)}) 45%, transparent 75%)` });
    st(el.grid, { opacity: String((0.05 + 0.06 * clamp(g)).toFixed(3)), backgroundPosition: `20px ${(20 - t * 14).toFixed(1)}px`,
      webkitMaskImage: `radial-gradient(700px 700px at ${gx.toFixed(0)}px ${gy.toFixed(0)}px, #000, transparent 80%)` });
    st(el.rays, { opacity: String((burst * 0.9 + endBurst * 0.5 + (scene === "C" ? 0.12 : 0)).toFixed(3)),
      left: (scene === "H" ? DOT_H.x : DOT_C.x) + "px", top: (scene === "H" ? DOT_H.y : DOT_C.y) + "px", transform: `rotate(${(t * 6).toFixed(2)}deg)` });
    const fl = burst * 1.0 + endBurst * 0.7;
    st(el.flare, { top: (scene === "H" ? DOT_H.y : DOT_C.y) + "px", opacity: String(clamp(fl).toFixed(3)), transform: `scaleY(${(0.6 + fl).toFixed(3)})` });
    st(el.bloom, { opacity: String(clamp(burst * 0.55 + endBurst * 0.25 + beatPulse(t, b(48), b(52), 10) * 0.12).toFixed(3)) });
    // dust drifts up through the light
    const dv = scene === "C" || scene === "H" ? 1 : 0.35;
    for (const m of el.motes) {
      const y = (((m.y - m.v * t) % 1920) + 1920) % 1920, x = m.x + Math.sin(t * 0.7 + m.ph) * 24;
      const near = clamp(1 - Math.hypot(x - S.x, y - S.y) / 900);
      st(m.i, { transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${m.s.toFixed(2)})`, opacity: String((m.a * dv * (0.3 + 0.7 * near) * P(t, 0.5, 2)).toFixed(3)) });
    }

    /* shockwave ring on the cuts */
    let so = 0;
    for (const [n, x, y] of SHOCKS) {
      const p = P(t, b(n), b(n) + 0.7);
      if (p > 0 && p < 1) {
        const c = y === 1 ? DOT_H : x === 0 ? DOT_C : { x, y };
        sa(el.shock, { cx: c.x.toFixed(1), cy: c.y.toFixed(1), r: mix(30, 1150, E.outC(p)).toFixed(1), "stroke-width": (1 + 5 * (1 - p)).toFixed(2) });
        so = 0.85 * (1 - p) ** 1.5;
      }
    }
    sa(el.shock, { opacity: so.toFixed(3) });
    show(el.gA, scene === "A"); show(el.gB, scene === "B"); show(el.gD, scene === "D");
    st(el.black, { opacity: String(Math.max(1 - P(t, 0.02, 0.12), P(t, DUR - 0.45, DUR - 0.05)).toFixed(3)) });

    if (scene === "A") sceneA(t);
    if (scene === "B") sceneB(t);
    if (scene === "C") sceneC(t);
    if (scene === "D") sceneD(t);
    if (scene === "E") sceneE(t);
    if (scene === "F") sceneF(t);
    if (scene === "G") sceneG(t);
    if (scene === "H") sceneH(t);
  }

  function sceneA(t) {
    rise($("#a1 span"), t, b(2), 0.45, b(7.5));
    rise($("#a2 span"), t, b(4), 0.45, b(7.55));
    rise($("#a3 span"), t, b(6), 0.45, b(7.6));
    // The hollow word fills with light for a beat when the kick lands.
    const f = beatPulse(t, b(5), b(7.5), 6);
    st($("#a2 span"), { webkitTextStroke: `2.5px rgba(244, 238, 229, ${(0.6 + 0.4 * f).toFixed(3)})`, textShadow: `0 0 ${(30 * f).toFixed(0)}px rgba(255, 138, 61, ${(0.7 * f).toFixed(3)})` });
    // Rings draw on around the sun, the dial turns, satellites orbit.
    const out = 1 - E.inC(P(t, b(7.4), b(8)));
    el.rings.forEach((r, i) => { const p = E.ioC(P(t, 0.5 + i * 0.35, 2.2 + i * 0.35)); sa(r, { "stroke-dasharray": `${p.toFixed(4)} 1`, opacity: out.toFixed(3) }); });
    const tk = P(t, 1.2, 2.4);
    sa(el.ticks, { transform: `rotate(${(t * 5).toFixed(2)} ${CX} ${CY})`, opacity: (tk * out * (0.7 + 0.3 * beatPulse(t, b(4), b(8), 5))).toFixed(3) });
    for (const s of el.sats) { const th = ((t * s.v + s.p * 57) * Math.PI) / 180; sa(s.c, { cx: (CX + s.r * Math.cos(th)).toFixed(1), cy: (CY + s.r * Math.sin(th)).toFixed(1), opacity: (P(t, 1.5 + s.p * 0.2, 2.5 + s.p * 0.2) * out).toFixed(3) }); }
  }

  function sceneB(t) {
    rise($("#b1 span"), t, b(8.5), 0.45, b(15.3));
    rise($("#b2 span"), t, b(9), 0.45, b(15.35));
    const { a, k } = aperture(t);
    const g = irisGeom(a, 22 * (1 - a / IR) + (t - b(8)) * 3);
    sa(el.iris, { d: g.d });
    g.lines.forEach((l, i) => sa(el.blades[i], { x1: l[0].toFixed(2), y1: l[1].toFixed(2), x2: l[2].toFixed(2), y2: l[3].toFixed(2) }));
    const on = E.outExpo(P(t, b(8), b(8.8)));
    sa(el.gB, { opacity: on.toFixed(3) });
    sa(el.parc, { "stroke-dasharray": `${(k / 7).toFixed(4)} 1` });
    sa(el.ctext, { transform: `rotate(${(-(t - b(8)) * 14).toFixed(2)} ${CX} ${CY})` });
    el.fstop.textContent = FST[k];
    const fo = E.outExpo(P(t, b(9), b(9.6))) * (1 - P(t, b(15.4), b(15.8)));
    const kick = t >= b(9) && t < b(15.5) ? Math.exp(-((t - b(9)) % BT) * 9) : 0;
    st(el.fstop, { opacity: fo.toFixed(3), transform: `translate3d(0, ${(-8 * kick).toFixed(1)}px, 0)` });
    st(el.fstopK, { opacity: (fo * 0.9).toFixed(3) });
  }

  function sceneC(t) {
    // The logo is lit from its own dot: a radial light-mask grows out of the sun.
    const p = E.outC(P(t, b(16), b(18.5)));
    const cx = DOT_C.x - 110, cy = DOT_C.y - 700, r = mix(0, 1100, p);
    const m = `radial-gradient(circle ${r.toFixed(0)}px at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, #000 ${Math.max(0, r - 260).toFixed(0)}px, transparent ${r.toFixed(0)}px)`;
    const rim = Math.exp(-Math.max(0, t - b(16)) * 1.2);
    st(el.logoC, { webkitMaskImage: m, maskImage: m, filter: `drop-shadow(0 0 ${(6 + 30 * rim).toFixed(1)}px rgba(255, 138, 61, ${(0.35 + 0.5 * rim).toFixed(3)}))`,
      transform: `translate3d(0, ${(-18 * E.ioS(P(t, b(16), b(24)))).toFixed(2)}px, 0)` });
    const tg = E.outExpo(P(t, b(18), b(19)));
    st(el.tagC, { opacity: String(tg.toFixed(3)), letterSpacing: `${mix(0.9, 0.5, tg).toFixed(3)}em` });
    st(el.subC, { opacity: String((E.outC(P(t, b(19), b(20))) * 0.9).toFixed(3)) });
    const out = E.inC(P(t, b(23.2), b(24)));
    st(el.C, { opacity: String((1 - out).toFixed(3)) });
  }

  function sceneD(t) {
    rise($("#d1 span"), t, b(24), 0.45);
    rise($("#d2 span"), t, b(24.5), 0.45);
    const ang = orbitAngle(t);
    const on = E.outExpo(P(t, b(24), b(24.8)));
    sa(el.gD, { opacity: on.toFixed(3) });
    sa(el.oarc, { "stroke-dasharray": `${((ang + 90) / 360).toFixed(4)} 1`, opacity: t > b(24.6) ? "1" : "0" });
    const k = t < b(24.6) ? -1 : Math.min(4, Math.floor((t - b(24.6)) / BT + 1e-6));
    el.onodes.forEach((n, i) => {
      const lit = i <= k, hit = lit ? Math.exp(-(t - b(24.6 + i)) * 5) : 0;
      sa(n.ring, { fill: lit || i === 0 ? "none" : "#0b0908", stroke: lit ? `rgba(255, 150, 80, ${(0.6 + 0.4 * hit).toFixed(3)})` : "rgba(255,255,255,.25)", r: (20 + 8 * hit).toFixed(2) });
      sa(n.dot, { opacity: lit ? "1" : "0" });
      sa(n.num, { fill: lit ? "#ff8a3d" : "rgba(244, 238, 229, .4)" });
    });
    // The step name in the middle of the orbit, one per beat.
    if (k >= 0) {
      const [w, sub] = NODES[k];
      if (el.stepW._w !== w) { el.stepW.textContent = w; el.stepW._w = w; el.stepS.textContent = sub; el.stepN.textContent = `0${k + 1} / 05`; }
      const a = b(24.6 + k), last = k === 4;
      rise(el.stepW, t, a, 0.35, last ? b(31.3) : a + BT - 0.1, 0.1);
      const e = E.outC(P(t, a + 0.05, a + 0.3)) * (last ? 1 - P(t, b(31.2), b(31.6)) : 1 - P(t, a + BT - 0.12, a + BT - 0.02));
      st(el.stepS, { opacity: (e * 0.9).toFixed(3) }); st(el.stepN, { opacity: e.toFixed(3) });
    } else { st(el.stepS, { opacity: "0" }); st(el.stepN, { opacity: "0" }); st(el.stepW, { transform: "translate3d(0,112%,0)" }); }
    const pf = E.outExpo(P(t, b(30), b(30.8)));
    st(el.pipeF, { opacity: pf.toFixed(3), letterSpacing: `${mix(0.8, 0.42, pf).toFixed(3)}em` });
    const out = E.inC(P(t, b(31.4), b(32)));
    st(el.D, { opacity: String((1 - out).toFixed(3)) });
    sa(el.gD, { opacity: (on * (1 - out)).toFixed(3) });
  }

  function sceneE(t) {
    const k = Math.floor((t - b(32)) / BT), f = (t - b(32)) / BT - k;
    const turn = k + E.outExpo(clamp(f / 0.6));
    const ang = -45 * (turn - 1);
    const enter = E.outExpo(P(t, b(32), b(33)));
    st(el.ring, { transform: `translate3d(0, ${((1 - enter) * 380).toFixed(1)}px, 0) rotateX(-7deg) rotateY(${ang.toFixed(3)}deg)` });
    st($("#ringWrap"), { opacity: String(enter.toFixed(3)) });
    let front = null, best = -2;
    for (const c of el.cards) {
      const a = ((c.a0 + ang) % 360 + 360) % 360, cos = Math.cos((a * Math.PI) / 180);
      st(c.d, { transform: `rotateY(${c.a0}deg) translateZ(480px)` });
      st(c.sh, { opacity: String((0.9 - 0.9 * clamp((cos + 0.2) / 1.2) ** 1.6).toFixed(3)) });
      st(c.gl, { transform: `translate3d(${(((a + 180) % 360) - 180) * -4}px, 0, 0)` });
      st(c.d, { borderColor: cos > 0.97 ? "rgba(255, 170, 100, .9)" : "rgba(255, 190, 140, .25)", boxShadow: cos > 0.97 ? "0 0 60px rgba(255, 138, 61, .35)" : "none" });
      if (cos > -0.2) imgFrame(c.img, c.c.id, Math.floor((t - b(32)) * 30) + c.a0);
      if (cos > best) { best = cos; front = c; }
    }
    el.galN.textContent = front ? front.c.name : "";
    st($("#galN"), { opacity: String((enter * (0.35 + 0.65 * clamp((best - 0.9) / 0.1))).toFixed(3)) });
    const h = E.outExpo(P(t, b(32), b(32.8)));
    st(el.galH, { opacity: String(h.toFixed(3)), transform: `translate3d(0, ${((1 - h) * 40).toFixed(1)}px, 0)` });
    st(el.galK, { opacity: String(P(t, b(32.5), b(33.2)).toFixed(3)) });
    const out = E.inC(P(t, b(39.5), b(40)));
    st(el.E, { opacity: String((1 - out).toFixed(3)) });
  }

  function sceneF(t) {
    const k = Math.floor((t - b(40)) / BT);
    const hi = WALL_HI[clamp(k, 0, 7)];
    el.wrows.forEach((r, i) => {
      const dir = i % 2 ? 1 : -1, sp = 150 + (i % 3) * 40;
      const period = r.w / 5.2; // one "word • " cell
      const x0 = -((i * 173) % period) - period * 0.5;
      const x = x0 + ((dir * sp * (t - b(40))) % period);
      const e = E.outExpo(P(t, b(40) + i * 0.03, b(40) + i * 0.03 + 0.5));
      const on = i === hi && t >= b(40);
      r.classList.toggle("hi", on);
      st(r, { transform: `translate3d(${(x + (1 - e) * dir * -300).toFixed(1)}px, 0, 0)`, opacity: String(e.toFixed(3)) });
    });
    st(el.wallK, { opacity: String((P(t, b(40.3), b(41)) * 0.9).toFixed(3)) });
  }

  function sceneG(t) {
    const k = clamp(Math.floor((t - b(48)) / BT), 0, 3);
    const [w, clip, name] = SLAM[k], size = el.slams[k];
    const local = t - b(48 + k);
    const top = 960 - size * 0.6;
    const drift = (1 - E.outExpo(clamp(local / 0.35))) * 26;
    const frame = Math.floor(local * 30);
    const n = MAN[clip].count, src = `${BASE}/.cache/dark/${clip}/${String(1 + (frame % n)).padStart(4, "0")}.jpg`;
    preload(src);
    const html = `${w}<span style="-webkit-text-fill-color:#ff8a3d;color:#ff8a3d">.</span>`;
    for (const e of [el.slamW, el.slamO]) {
      if (e._w !== w) { e.innerHTML = html; e._w = w; }
      st(e, { fontSize: size.toFixed(2) + "px", top: (top + drift).toFixed(1) + "px" });
    }
    st(el.slamW, { backgroundImage: `url(${src})`, backgroundPosition: `0px ${(-(top + drift)).toFixed(1)}px`, filter: `brightness(${(1.15 + 0.4 * Math.exp(-local * 9)).toFixed(3)}) saturate(1.1)` });
    st(el.slamO, { opacity: String((0.8 * Math.exp(-local * 3)).toFixed(3)) });
    el.slamK.textContent = name;
    st(el.slamK, { opacity: String(E.outC(P(local, 0.05, 0.2)).toFixed(3)) });
  }

  function sceneH(t) {
    const p = E.outC(P(t, b(52), b(53.6)));
    const cx = DOT_H.x - 190, cy = DOT_H.y - 470, r = mix(0, 900, p);
    const m = `radial-gradient(circle ${r.toFixed(0)}px at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, #000 ${Math.max(0, r - 220).toFixed(0)}px, transparent ${r.toFixed(0)}px)`;
    const rim = Math.exp(-Math.max(0, t - b(52)) * 1.5);
    st(el.logoH, { webkitMaskImage: m, maskImage: m, filter: `drop-shadow(0 0 ${(6 + 24 * rim).toFixed(1)}px rgba(255, 138, 61, ${(0.3 + 0.5 * rim).toFixed(3)}))` });
    const l = E.outExpo(P(t, b(53.5), b(54.5)));
    st(el.endL, { opacity: String(l.toFixed(3)), transform: `translate3d(0, ${((1 - l) * 40).toFixed(1)}px, 0)` });
    const pp = E.outExpo(P(t, b(55), b(56)));
    st(el.endP, { opacity: String(pp.toFixed(3)), transform: `translate3d(-50%, ${((1 - pp) * 30).toFixed(1)}px, 0)`,
      boxShadow: `0 0 ${(40 + 30 * beatPulse(t, b(56), b(62), 3)).toFixed(0)}px rgba(255, 138, 61, .3), inset 0 0 24px rgba(255, 138, 61, .12)` });
    const s = E.outC(P(t, b(56), b(57)));
    st(el.endS, { opacity: String(s.toFixed(3)) });
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
    let playing = false, t0 = 0, from = 0, ctx = null, buf = null, node = null;
    const loop = () => { if (!playing) return; const t = from + (performance.now() - t0) / 1000; if (t >= DUR) { playing = false; return; } renderAt(t); scrub.value = t; tc.textContent = t.toFixed(2); requestAnimationFrame(loop); };
    play.onclick = async () => {
      if (playing) { playing = false; node?.stop(); return; }
      if (!buf && window.DarkAudio) { play.textContent = "…"; ctx = new AudioContext(); buf = await window.DarkAudio.render(); }
      from = +scrub.value; t0 = performance.now(); playing = true; play.textContent = "❚❚";
      if (buf) { node = ctx.createBufferSource(); node.buffer = buf; node.connect(ctx.destination); node.start(0, from); }
      loop();
    };
    scrub.oninput = () => { if (!playing) { renderAt(+scrub.value); tc.textContent = (+scrub.value).toFixed(2); } };
  }
})();
