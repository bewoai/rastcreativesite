/*
 * Rast Creative — "Takımyıldız" · picture engine
 * ------------------------------------------------------------------
 * 120 BPM (beat 0.5 s). Scenes on the beat grid:
 *   b0–6    sky + sun: "HER MARKANIN BİR IŞIĞI VAR."
 *   b6–24   Sakarya drawn from the studio (Serdivan); six brands light up, one
 *           every two beats, each opening a footage lens above the map
 *   b24–36  cut to Turkey: light arcs from Sakarya to Tekirdağ and Adıyaman
 *   b36–40  "HER MARKA BİR YILDIZ." · 8 marka · 3 şehir · 1 gökyüzü
 *   b40–44  every star in the sky flies into the Rast logo
 *   b44–52  "Sıradaki yıldız sizin markanız." · rastcreative.com
 * Everything sits on the centre axis inside the Instagram safe zone
 * (y 280–1480); the logo is dead centre. No camera moves, no zoom.
 */
(() => {
  "use strict";
  const FPS = 60, DUR = 26, BT = 0.5;
  const b = (n) => n * BT;
  const BASE = "/automations/brand-film";
  const $ = (s, r = document) => r.querySelector(s);
  const clamp = (x, a = 0, c = 1) => (x < a ? a : x > c ? c : x);
  const P = (t, a, c) => (!(t > a) ? 0 : t >= c ? 1 : (t - a) / (c - a));
  const mix = (a, c, p) => a + (c - a) * p;
  const E = {
    inC: (x) => x ** 3, outC: (x) => 1 - (1 - x) ** 3,
    ioC: (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
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
  const sa = (n, o) => { for (const k in o) { const v = String(o[k]); if (n.getAttribute(k) !== v) n.setAttribute(k, v); } };
  const SVGNS = "http://www.w3.org/2000/svg";
  const mk = (tag, attrs = {}, parent) => { const n = document.createElementNS(SVGNS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.append(n); return n; };
  const rise = (el, t, a, d = 0.45, o = Infinity, d2 = 0.28) => {
    const i = E.outExpo(P(t, a, a + d)), x = E.inC(P(t, o, o + d2));
    st(el, { transform: `translate3d(0, ${((1 - i) * 112 - x * 112).toFixed(2)}%, 0)` });
  };
  const beatPulse = (t, from, to, k = 7) => (t < from || t >= to ? 0 : Math.exp(-((t - from) % BT) * k));

  /* logo geometry: 760 px wide, centred on (540, 960) */
  const VB = { x: 220, y: 340, w: 660, h: 400 }, DOT = { x: 589.63, y: 568.91, r: 26.43 };
  const LG = { left: 160, top: 960 - (760 * VB.h) / VB.w / 2, w: 760 };
  const LS = LG.w / VB.w;
  const LDOT = { x: LG.left + (DOT.x - VB.x) * LS, y: LG.top + (DOT.y - VB.y) * LS, d: 2 * DOT.r * LS };

  const IGN_S = [10, 12, 14, 16, 18, 20];           // Sakarya stars (beats)
  const IGN_T = [28, 32];                           // Tekirdağ, Adıyaman
  const WIN = { x: 540, y: 520, r: 140 };           // footage lens

  let G, BR, MAN, pending = [];
  const el = {};
  let SKY = [], SAKS = [], TRS = [], ctx;

  async function init() {
    G = await (await fetch(`${BASE}/stars/data/geo.json`)).json();
    BR = await (await fetch(`${BASE}/stars/brands.json`)).json();
    MAN = await (await fetch(`${BASE}/.cache/stars/manifest.json`)).json();
    await Promise.all([document.fonts.load('900 100px "Inter"'), document.fonts.load('800 36px "Inter"'), document.fonts.load('italic 440 92px "Fraunces"')]);
    for (const id of ["i1", "i2", "k1", "t1", "t2", "c1", "c2"]) el[id] = $(`#${id} span`);
    Object.assign(el, {
      glow: $("#glow"), gS: $("#gS"), gT: $("#gT"), win: $("#win"), wimg: $("#win img"), ring: $("#winRing"), wName: $("#wName"), wPlace: $("#wPlace"),
      cnt: $("#cnt"), n1: $("#n1"), n2: $("#n2"), n3: $("#n3"), logo: $("#logo"), endL: $("#endL"), endP: $("#endP"), endS: $("#endS"),
      sun: $("#sun"), halo: $("#halo"), bloom: $("#bloom"), black: $("#black"),
    });
    ctx = $("#sky").getContext("2d");

    // Sakarya map
    el.nb = Object.values(G.sak.neighbours).map((d) => mk("path", { d, class: "nb" }, el.gS));
    el.ds = Object.values(G.sak.districts).map((d) => mk("path", { d, class: "ds" }, el.gS));
    el.lk = mk("path", { d: G.sak.lake, class: "lk" }, el.gS);
    el.ol = mk("path", { d: G.sak.outline, class: "ol", pathLength: 1, "stroke-dasharray": "0 1" }, el.gS);
    // Turkey map: provinces fade in west → east
    el.pv = Object.entries(G.tr.provinces).map(([n, d]) => {
      const p = mk("path", { d, class: "pv" + (n === "Sakarya" ? " home" : "") }, el.gT);
      const xs = [...d.matchAll(/([\d.]+),[\d.]+/g)].map((m) => +m[1]);
      return { p, x: xs.reduce((a, v) => a + v, 0) / xs.length, home: n === "Sakarya" };
    });

    // Stars
    const studio = G.sak.studio;
    SAKS = BR.sakarya.map((s, i) => ({ ...s, pos: G.sak.stars[s.id], ign: b(IGN_S[i]), prev: i ? G.sak.stars[BR.sakarya[i - 1].id] : studio,
      mini: [G.tr.sakarya[0] + (G.sak.stars[s.id][0] - studio[0]) * 0.14, G.tr.sakarya[1] + (G.sak.stars[s.id][1] - studio[1]) * 0.14] }));
    TRS = BR.turkey.map((s, i) => ({ ...s, pos: G.tr.stars[s.id], ign: b(IGN_T[i]) }));

    // Logo (solid) + particle targets sampled from it
    const svgText = await (await fetch("/public/hero/rast-sun-logo.svg")).text();
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const svg = mk("svg", { viewBox: `${VB.x} ${VB.y} ${VB.w} ${VB.h}` });
    for (const sh of doc.querySelectorAll("path, polygon, rect")) { const n = document.importNode(sh, true); n.removeAttribute("class"); n.setAttribute("class", "lt"); svg.append(n); }
    el.logo.append(svg);
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgText.replace('<svg ', `<svg width="${LG.w}" height="${(LG.w * VB.h) / VB.w}" `));
    await img.decode();
    const oc = document.createElement("canvas"); oc.width = LG.w; oc.height = Math.ceil((LG.w * VB.h) / VB.w);
    const ox = oc.getContext("2d"); ox.drawImage(img, 0, 0, oc.width, oc.height);
    const A = ox.getImageData(0, 0, oc.width, oc.height).data;
    const R = rng(21), targets = [];
    for (let y = 0; y < oc.height; y += 7) for (let x = (y / 7) % 2 ? 3 : 0; x < oc.width; x += 7) {
      if (A[(y * oc.width + x) * 4 + 3] > 128) targets.push([LG.left + x, LG.top + y]);
    }
    for (let i = targets.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [targets[i], targets[j]] = [targets[j], targets[i]]; }
    // Every star in the sky has a place in the logo.
    SKY = targets.map((tg) => {
      const x = R() * 1080, y = R() * 1920;
      return { x, y, tx: tg[0] + (R() - 0.5) * 2, ty: tg[1] + (R() - 0.5) * 2, a: 0.22 + R() ** 2 * 0.75, s: 0.9 + R() * 1.5, ph: R() * 6.28, sp: 1.5 + R() * 3,
        d: Math.hypot(x - 540, y - 960) / 1100 * 0.55 + R() * 0.25, bend: (R() - 0.5) * 260 };
    });

    // Grain
    const cv = document.createElement("canvas"); cv.width = cv.height = 256;
    const cx = cv.getContext("2d"), id = cx.createImageData(256, 256), r2 = rng(11);
    for (let k = 0; k < id.data.length; k += 4) { const v = 128 + (r2() - 0.5) * 255; id.data[k] = id.data[k + 1] = id.data[k + 2] = v; id.data[k + 3] = 255; }
    cx.putImageData(id, 0, 0);
    $("#grain").style.backgroundImage = `url(${cv.toDataURL()})`;
  }

  /* ───── the sun: centre → studio (Serdivan) → Sakarya on the Turkey map → logo dot ───── */
  function sunPath(t) {
    const C = { x: 540, y: 960 }, S = G.sak.studio, T = G.tr.sakarya;
    if (t < b(5.5)) { const ign = E.outExpo(P(t, 0.15, 0.9)); const fl = t < 0.9 ? 0.75 + 0.25 * Math.sin(t * 90) * Math.sin(t * 37) : 1; return { x: C.x, y: C.y, s: ign * fl * 1.2, g: ign }; }
    if (t < b(7)) { const p = E.ioC(P(t, b(5.5), b(7))); return { x: mix(C.x, S[0], p), y: mix(C.y, S[1], p), s: mix(1.2, 0.55, p), g: mix(1, 0.7, p) }; }
    if (t < b(24)) return { x: S[0], y: S[1], s: 0.55 * (1 - E.inC(P(t, b(23.3), b(24)))) + 0.001, g: 0.7 * (1 - P(t, b(23.3), b(24))) };
    if (t < b(40)) { const f = 1 - E.inC(P(t, b(39.4), b(40.2))); return { x: T[0], y: T[1], s: 0.42 * f * E.outExpo(P(t, b(24), b(24.6))), g: 0.6 * f }; }
    const p = E.outExpo(P(t, b(43.4), b(44.1)));
    return { x: LDOT.x, y: LDOT.y, s: (LDOT.d / 52) * p, g: p };
  }

  const star = (x, y, r, a, spike = 1) => {
    // A glowing four-point star.
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
    g.addColorStop(0, `rgba(255, 244, 225, ${a})`); g.addColorStop(0.18, `rgba(255, 180, 110, ${a * 0.8})`); g.addColorStop(1, "rgba(255, 120, 40, 0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 5, 0, 6.2832); ctx.fill();
    ctx.strokeStyle = `rgba(255, 220, 180, ${a * 0.8})`; ctx.lineWidth = 1.4;
    const L = r * 4.2 * spike;
    ctx.beginPath(); ctx.moveTo(x - L, y); ctx.lineTo(x + L, y); ctx.moveTo(x, y - L); ctx.lineTo(x, y + L); ctx.stroke();
    ctx.fillStyle = `rgba(255, 250, 240, ${a})`; ctx.beginPath(); ctx.arc(x, y, r * 0.55, 0, 6.2832); ctx.fill();
  };
  const trail = (a, c, p, alpha, head = true) => {
    const x = mix(a[0], c[0], p), y = mix(a[1], c[1], p);
    ctx.strokeStyle = `rgba(255, 160, 90, ${alpha})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(x, y); ctx.stroke();
    if (head && p > 0 && p < 1) star(x, y, 3, 0.9, 0.6);
  };
  const arcPt = (a, c, u, lift) => { const mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2 - lift; const v = 1 - u; return [v * v * a[0] + 2 * v * u * mx + u * u * c[0], v * v * a[1] + 2 * v * u * my + u * u * c[1]]; };
  const arc = (a, c, p, alpha, lift) => {
    ctx.strokeStyle = `rgba(255, 160, 90, ${alpha})`; ctx.lineWidth = 2; ctx.beginPath();
    for (let k = 0; k <= 40; k++) { const q = arcPt(a, c, (k / 40) * p, lift); k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }
    ctx.stroke();
    if (p > 0 && p < 1) { const q = arcPt(a, c, p, lift); star(q[0], q[1], 3.4, 0.95, 0.6); }
  };

  function drawSky(t) {
    ctx.clearRect(0, 0, 1080, 1920);
    ctx.globalCompositeOperation = "lighter";
    // Starfield — dimmed under the maps, then the whole sky gathers into the logo.
    const mapDim = t > b(7) && t < b(40) ? 0.45 : 1;
    const vis = P(t, 0.2, 1.8);
    const mt = P(t, b(40), b(43.4)), solid = P(t, b(43.3), b(44.4));
    for (const s of SKY) {
      const tw = 0.65 + 0.35 * Math.sin(t * s.sp + s.ph);
      let x = s.x + Math.sin(t * 0.05 + s.ph) * 6, y = s.y, a = s.a * tw * vis * mapDim, r = s.s;
      if (mt > 0) {
        const u = E.ioC(clamp((mt - s.d * 0.6) / 0.5));
        const ox = x, oy = y;
        x = mix(ox, s.tx, u) + Math.sin(u * Math.PI) * s.bend * 0.35; y = mix(oy, s.ty, u) + Math.sin(u * Math.PI) * s.bend * -0.2;
        a = mix(a, 0.95, E.outC(clamp(u * 1.4))) * (1 - solid * 0.85); r = mix(r, 2.8, u);
      }
      if (a < 0.01) continue;
      ctx.fillStyle = mt > 0 ? `rgba(255, ${Math.round(mix(240, 200, mt))}, ${Math.round(mix(230, 160, mt))}, ${a.toFixed(3)})` : `rgba(240, 236, 255, ${a.toFixed(3)})`;
      ctx.fillRect(x - r / 2, y - r / 2, r, r);
    }

    // Sakarya: trails from the studio, one star every two beats.
    const sakOut = 1 - P(t, b(23.3), b(24));
    if (t >= b(9) && t < b(24)) {
      for (const s of SAKS) {
        const p = E.ioC(P(t, s.ign - 0.38, s.ign));
        if (p > 0) trail(s.prev, s.pos, p, 0.45 * sakOut);
      }
      for (const s of SAKS) {
        if (t < s.ign) continue;
        const hit = Math.exp(-(t - s.ign) * 4);
        const tw = 0.85 + 0.15 * Math.sin(t * 5 + s.pos[0]);
        const fin = beatPulse(t, b(22), b(24), 5) * 0.5;
        star(s.pos[0], s.pos[1], 4 + 7 * hit + 3 * fin, (0.85 * tw + 0.15) * sakOut, 1 + hit);
      }
    }
    // Turkey: the Sakarya cluster, then arcs to the far brands.
    if (t >= b(24) && t < b(41)) {
      const on = E.outExpo(P(t, b(24), b(25))) * (1 - P(t, b(39.8), b(40.6)));
      const T = G.tr.sakarya;
      for (const s of SAKS) star(s.mini[0], s.mini[1], 1.6, 0.8 * on, 0.6);
      star(T[0], T[1], 5 + 2 * beatPulse(t, b(24), b(40), 4), 0.9 * on);
      TRS.forEach((s, i) => {
        const p = E.ioC(P(t, s.ign - 0.9, s.ign));
        if (p > 0) arc(T, s.pos, p, 0.55 * on, i ? 170 : 110);
        if (t >= s.ign) { const hit = Math.exp(-(t - s.ign) * 4); star(s.pos[0], s.pos[1], 5 + 8 * hit + 2 * beatPulse(t, b(36), b(40), 5), 0.95 * on, 1 + hit); }
      });
    }
    // Lens leader line: star → window.
    const w = activeWindow(t);
    if (w && w.open > 0.05) {
      ctx.strokeStyle = `rgba(255, 170, 100, ${(0.55 * w.open).toFixed(3)})`; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(w.star[0], w.star[1]); ctx.lineTo(mix(w.star[0], WIN.x, w.open), mix(w.star[1], WIN.y + WIN.r + 8, w.open)); ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function activeWindow(t) {
    const list = [...SAKS.map((s, i) => ({ s, a: s.ign, z: i < 5 ? SAKS[i + 1].ign - 0.12 : b(22.6) })), ...TRS.map((s) => ({ s, a: s.ign, z: s.ign + b(3.4) }))];
    for (const w of list) {
      if (t >= w.a && t < w.z + 0.2) {
        const open = E.outExpo(P(t, w.a, w.a + 0.35)) * (1 - E.inC(P(t, w.z, w.z + 0.18)));
        return { ...w, open, star: w.s.pos };
      }
    }
    return null;
  }

  function renderAt(t) {
    drawSky(t);
    const S = sunPath(t);
    const hit = t >= b(44) ? Math.exp(-(t - b(44)) * 2.2) : 0;
    const g = clamp(S.g + hit);
    st(el.sun, { transform: `translate3d(${S.x.toFixed(1)}px, ${S.y.toFixed(1)}px, 0) scale(${Math.max(0.001, S.s).toFixed(4)})`, opacity: S.s > 0.01 ? "1" : "0",
      boxShadow: `0 0 ${(30 + 40 * g).toFixed(0)}px ${(6 + 10 * g).toFixed(0)}px rgba(255, 140, 60, ${(0.35 + 0.35 * g).toFixed(3)})` });
    st(el.halo, { transform: `translate3d(${S.x.toFixed(1)}px, ${S.y.toFixed(1)}px, 0) scale(${(0.3 + 0.8 * g).toFixed(3)})`, opacity: (clamp(g) * (S.s > 0.01 ? 1 : 0)).toFixed(3) });
    const gx = t < b(40) ? S.x : 540, gy = t < b(40) ? S.y : 960, ga = t < b(40) ? 0.22 * S.g : 0.18 + 0.25 * hit;
    st(el.glow, { background: `radial-gradient(900px 900px at ${gx.toFixed(0)}px ${gy.toFixed(0)}px, rgba(255, 110, 40, ${ga.toFixed(3)}), rgba(120, 36, 8, ${(ga * 0.4).toFixed(3)}) 45%, transparent 75%)` });
    st(el.bloom, { opacity: (hit * 0.55 + (t >= b(24) ? Math.exp(-(t - b(24)) * 5) * 0.2 : 0)).toFixed(3) });

    // titles
    rise(el.i1, t, b(1), 0.45, b(5.2)); rise(el.i2, t, b(2.5), 0.45, b(5.3));
    rise(el.k1, t, b(7), 0.45, b(9.4));
    rise(el.t1, t, b(24.5), 0.45, b(26.9)); rise(el.t2, t, b(25), 0.45, b(27));
    rise(el.c1, t, b(36), 0.45, b(39.3)); rise(el.c2, t, b(36.5), 0.45, b(39.4));

    // Sakarya map, drawn out of the studio
    const sOn = t >= b(6) && t < b(24.2);
    st(el.gS, { display: sOn ? "" : "none", opacity: (1 - P(t, b(23.3), b(24))).toFixed(3) });
    if (sOn) {
      sa(el.ol, { "stroke-dasharray": `${E.ioC(P(t, b(6), b(9))).toFixed(4)} 1`, "fill-opacity": P(t, b(8.5), b(9.5)).toFixed(3) });
      const nb = (P(t, b(6.5), b(8.5)) * 0.9).toFixed(3), ds = P(t, b(8), b(9.5)).toFixed(3), lk = P(t, b(8.5), b(9.5)).toFixed(3);
      el.nb.forEach((p) => sa(p, { opacity: nb })); el.ds.forEach((p) => sa(p, { opacity: ds })); sa(el.lk, { opacity: lk });
    }
    // Turkey map
    const tOn = t >= b(24) && t < b(40.6);
    st(el.gT, { display: tOn ? "" : "none", opacity: (1 - P(t, b(39.6), b(40.4))).toFixed(3) });
    if (tOn) {
      for (const v of el.pv) {
        const a = b(24) + ((v.x - 90) / 900) * 0.9;
        const o = E.outC(P(t, a, a + 0.35)) * (t > b(36) && t < b(40) ? 0.6 : 1);
        sa(v.p, { opacity: o.toFixed(3) });
        if (v.home) sa(v.p, { "fill-opacity": (0.6 + 0.4 * beatPulse(t, b(24), b(40), 4)).toFixed(3) });
      }
    }

    // footage lens
    const w = activeWindow(t);
    if (w) {
      const n = MAN[w.s.id].count, f = Math.floor((t - w.a) * 30) % n;
      const src = `${BASE}/.cache/stars/${w.s.id}/${String(f + 1).padStart(4, "0")}.jpg`;
      if (el.wimg.getAttribute("src") !== src) { el.wimg.setAttribute("src", src); pending.push(el.wimg.decode().catch(() => {})); }
      st(el.win, { display: "block", clipPath: `circle(${(WIN.r * w.open).toFixed(1)}px at 50% 50%)` });
      st(el.ring, { display: "block", opacity: w.open.toFixed(3), transform: `scale(${(0.6 + 0.4 * w.open).toFixed(4)})` });
      if (el.wName.textContent !== w.s.name) { el.wName.textContent = w.s.name; el.wPlace.textContent = w.s.place; }
      const lo = E.outC(P(t, w.a + 0.08, w.a + 0.4)) * (1 - P(t, w.z, w.z + 0.15));
      st(el.wName, { opacity: lo.toFixed(3), transform: `translate3d(0, ${((1 - lo) * 14).toFixed(1)}px, 0)` });
      st(el.wPlace, { opacity: lo.toFixed(3) });
    } else { st(el.win, { display: "none" }); st(el.ring, { display: "none" }); st(el.wName, { opacity: "0" }); st(el.wPlace, { opacity: "0" }); }

    // counters
    const co = E.outC(P(t, b(36.3), b(37))) * (1 - P(t, b(39.3), b(39.8)));
    st(el.cnt, { opacity: co.toFixed(3), transform: `translate3d(0, ${((1 - co) * 30).toFixed(1)}px, 0)` });
    const cu = E.outC(P(t, b(36.5), b(38.2)));
    el.n1.textContent = String(Math.round(8 * cu)); el.n2.textContent = String(Math.round(3 * cu)); el.n3.textContent = String(Math.round(1 * cu));

    // logo + end card
    st(el.logo, { opacity: E.outC(P(t, b(43.3), b(44.4))).toFixed(3), filter: `drop-shadow(0 0 ${(6 + 26 * hit).toFixed(1)}px rgba(255, 138, 61, ${(0.3 + 0.5 * hit).toFixed(3)}))` });
    const l = E.outExpo(P(t, b(45), b(46)));
    st(el.endL, { opacity: l.toFixed(3), transform: `translate3d(0, ${((1 - l) * 40).toFixed(1)}px, 0)` });
    const pp = E.outExpo(P(t, b(46.5), b(47.5)));
    st(el.endP, { opacity: pp.toFixed(3), transform: `translate3d(-50%, ${((1 - pp) * 30).toFixed(1)}px, 0)` });
    st(el.endS, { opacity: E.outC(P(t, b(47.5), b(48.5))).toFixed(3) });
    st(el.black, { opacity: Math.max(1 - P(t, 0.02, 0.12), P(t, DUR - 0.45, DUR - 0.05)).toFixed(3) });
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
      if (!buf && window.StarsAudio) { play.textContent = "…"; actx = new AudioContext(); buf = await window.StarsAudio.render(); }
      from = +scrub.value; t0 = performance.now(); playing = true; play.textContent = "❚❚";
      if (buf) { node = actx.createBufferSource(); node.buffer = buf; node.connect(actx.destination); node.start(0, from); }
      loop();
    };
    scrub.oninput = () => { if (!playing) { renderAt(+scrub.value); tc.textContent = (+scrub.value).toFixed(2); } };
  }
})();
