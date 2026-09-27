/*
 * Rast Creative — "Bir Saniye" · picture engine
 * ------------------------------------------------------------------
 * One projector in a dark room; its lamp is the Rast sun. Everything the
 * film shows is projected on one screen (centre axis, safe zone):
 *   1.2–9    a hand's shadow waits to scroll; a timer counts the seconds
 *   11–14    one second → a line → 24 frames
 *   13.7–17  a real strip of 24 frames runs through the beam
 *   17–24    four frames, four nights (idea · sunrise · take 7 · cut v11)
 *   24–30    the swipe… "olsun." · a single frame
 *   30–34    the finger taps twice: a heart · "teşekkürler."
 *   34–38    the lamp becomes the dot of the logo
 * Line art "boils" at 12 fps like hand-drawn animation. No camera moves.
 */
(() => {
  "use strict";
  const FPS = 60, S = window.SECOND, C = S.CUE, DUR = S.DUR;
  const $ = (s, r = document) => r.querySelector(s);
  const clamp = (x, a = 0, c = 1) => (x < a ? a : x > c ? c : x);
  const P = (t, a, c) => (!(t > a) ? 0 : t >= c ? 1 : (t - a) / (c - a));
  const mix = (a, c, p) => a + (c - a) * p;
  const E = {
    inC: (x) => x ** 3, outC: (x) => 1 - (1 - x) ** 3,
    ioC: (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
    outBack: (x) => 1 + 2.4 * (x - 1) ** 3 + 1.4 * (x - 1) ** 2,
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
  const st = (el, o) => { for (const k in o) { const v = o[k]; if (el.style[k] !== v) el.style[k] = v; } };
  const sa = (n, o) => { for (const k in o) { const v = String(o[k]); if (n.getAttribute(k) !== v) n.setAttribute(k, v); } };
  const NS = "http://www.w3.org/2000/svg";
  const LENS = { x: 540, y: 330 };
  const SCR = { x: 120, y: 560, w: 840, h: 760 };
  const VB = { x: 220, y: 340, w: 660, h: 400 }, DOT = { x: 589.63, y: 568.91, r: 26.43 };
  const LS = 700 / VB.w, LDOT = { x: 190 + (DOT.x - VB.x) * LS, y: 748 + (DOT.y - VB.y) * LS, d: 2 * DOT.r * LS };

  /* ───── the drawings (screen space 840×760) ───── */
  // Pointing hand, index finger at the thumb side, three curled fingers stepping down to the right.
  const HAND = "M -34 36 C -34 -10 34 -10 34 36 L 38 262 C 62 244 108 248 118 276 C 150 266 186 280 192 308 C 222 304 250 326 248 356 C 272 360 290 384 284 414 L 270 530 C 256 606 204 646 140 656 L 128 900 L -120 900 L -110 650 C -146 616 -156 560 -140 500 C -150 470 -130 420 -96 380 C -76 356 -52 330 -38 296 Z";
  const HEART = "M 420 560 C 250 440 180 350 230 270 C 275 200 370 205 420 285 C 470 205 565 200 610 270 C 660 350 590 440 420 560 Z";
  const hand12 = (h, m) => { const a = ((h % 12) + m / 60) * 30, b = m * 6, r = (d) => (d - 90) * Math.PI / 180; return [a, b].map((d, i) => [620 + Math.cos(r(d)) * (i ? 52 : 34), 200 + Math.sin(r(d)) * (i ? 52 : 34)]); };
  const [hh, mm] = hand12(3, 14);
  const V = {
    // 03:14 — lamp, notebook, cup, clock
    v1: `<g class="ln"><path d="M60 600 H780"/><ellipse cx="180" cy="600" rx="60" ry="12"/><path d="M180 588 L250 430 L372 380"/><path d="M352 352 L418 344 L474 428 L376 452 Z"/>
      <path d="M440 560 L660 560 L700 600 L470 600 Z"/><path d="M500 575 H640 M512 588 H652" class="thin"/><path d="M620 520 H680 V600 H620 Z"/><path d="M680 540 C712 540 712 580 680 580"/>
      <path class="thin" d="M636 500 C626 480 646 468 636 448 M660 500 C650 480 670 468 660 448"/><circle cx="620" cy="200" r="72"/>
      <path d="M620 200 L${hh[0].toFixed(1)} ${hh[1].toFixed(1)} M620 200 L${mm[0].toFixed(1)} ${mm[1].toFixed(1)}"/></g>
      <path class="amb" opacity=".35" d="M418 446 L560 600 L330 600 Z"/><circle class="fill" cx="620" cy="200" r="6"/>
      <text class="txt" x="60" y="90">03:14</text>`,
    // 06:12 — the sunrise we waited for, camera on a tripod
    v2: `<path class="amb" d="M450 520 A110 110 0 0 1 670 520 Z"/><g class="ln"><path d="M40 520 H800"/><path d="M560 380 V340 M470 420 L445 395 M650 420 L675 395 M430 480 L395 470 M690 480 L725 470"/>
      <path d="M40 560 C200 540 300 580 520 560 C640 548 720 570 800 560" class="thin"/><path d="M220 400 L160 600 M222 400 L222 600 M224 400 L284 600"/>
      <path d="M160 310 H280 V390 H160 Z"/><circle cx="302" cy="350" r="24"/><path d="M190 310 V292 H236 V310"/></g>
      <path class="thin" d="M600 200 l14 10 l14 -10 M660 160 l12 8 l12 -8"/><text class="txt" x="60" y="90">06:12</text>`,
    // take 7 — the clapperboard
    v3: `<g class="ln"><path d="M200 330 H640 V600 H200 Z"/><path d="M200 420 H640 M200 510 H640 M420 420 V600"/></g>
      <g id="clapper"><path class="fill" d="M200 290 H640 V330 H200 Z"/><path fill="#efe3cf" d="M240 290 L280 290 L260 330 L220 330 Z M330 290 L370 290 L350 330 L310 330 Z M420 290 L460 290 L440 330 L400 330 Z M510 290 L550 290 L530 330 L490 330 Z M600 290 L640 290 L620 330 L580 330 Z"/></g>
      <text class="txt" x="222" y="385">RAST CREATIVE</text><text class="txt" x="222" y="475">SAHNE</text><text class="txt" x="442" y="475">ÇEKİM</text>
      <text class="big" x="262" y="580">1</text><text class="big" x="482" y="580">7</text><text class="txt" x="60" y="90">ÇEKİM 7</text>`,
    // cut v11 — the timeline
    v4: `<g class="ln"><path d="M80 210 H760 V590 H80 Z"/><path d="M80 270 H760" class="thin"/></g>
      <g class="thin"><path d="M110 300 H330 V350 H110 Z M340 300 H520 V350 H340 Z M530 300 H730 V350 H530 Z"/><path d="M110 370 H250 V420 H110 Z M400 370 H640 V420 H400 Z"/>
      <path d="M110 470 ${Array.from({ length: 62 }, (_, i) => `L${110 + i * 10} ${470 + (i % 2 ? -1 : 1) * (6 + ((i * 37) % 23))}`).join(" ")}"/></g>
      <path class="amb" opacity=".3" d="M340 300 H520 V350 H340 Z"/><text class="txt" x="100" y="252">kurgu_v11_final.mp4</text>
      <g id="playhead"><path class="amb" d="M-3 280 H3 V580 H-3 Z"/><path class="amb" d="M-12 280 H12 L0 296 Z"/></g><text class="txt" x="60" y="90">v11</text>`,
  };

  let pending = [], el = {}, R0 = rng(5), dust = [], bctx, dctx, sctx;
  const mk = (tag, attrs = {}, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.append(n); return n; };

  async function init() {
    await Promise.all([document.fonts.load('700 46px "Inter"'), document.fonts.load('800 64px "Inter"'), document.fonts.load('italic 440 60px "Fraunces"')]);
    const svg = $("#scrSvg");
    const defs = mk("defs", {}, svg);
    const f = mk("filter", { id: "boil", x: "-5%", y: "-5%", width: "110%", height: "110%" }, defs);
    el.turb = mk("feTurbulence", { type: "fractalNoise", baseFrequency: "0.018", numOctaves: "2", seed: "1" }, f);
    mk("feDisplacementMap", { in: "SourceGraphic", scale: "5" }, f);
    const g = (id, html = "", attrs = {}) => { const n = mk("g", { id, ...attrs }, svg); n.innerHTML = html; return n; };
    el.art = mk("g", { filter: "url(#boil)" }, svg);
    const ga = (id, html) => { const n = mk("g", { id }, el.art); n.innerHTML = html; return n; };
    el.v = ["v1", "v2", "v3", "v4"].map((k) => ga(k, V[k]));
    el.clapper = $("#clapper"); el.playhead = $("#playhead");
    el.ruler = ga("ruler", `<path class="ln" id="rl" d="M120 380 H720" pathLength="1" stroke-dasharray="0 1"/>` +
      Array.from({ length: 25 }, (_, i) => `<path class="thin tk" d="M${120 + i * 25} ${i % 6 === 0 ? 350 : 362} V398" opacity="0"/>`).join("") +
      `<text class="big" id="rlA" x="420" y="300" text-anchor="middle">1 SANİYE</text><text class="big" id="rlB" x="420" y="500" text-anchor="middle" opacity="0">= 24 KARE</text>`);
    el.one = ga("one", `<g class="ln"><path d="M270 230 H570 V460 H270 Z"/></g>` +
      Array.from({ length: 6 }, (_, i) => `<path class="fill" d="M240 ${238 + i * 38} h16 v20 h-16 Z M584 ${238 + i * 38} h16 v20 h-16 Z"/>`).join("") +
      `<circle class="amb" cx="420" cy="345" r="26"/><text class="big" x="420" y="560" text-anchor="middle">1 / 24</text>`);
    el.heart = ga("heart", `<path class="ln" id="hs" d="${HEART}" pathLength="1" stroke-dasharray="0 1"/><path class="amb" id="hf" d="${HEART}" opacity="0"/>`);
    el.timer = g("timerG", `<text id="timer" class="txt" x="56" y="96">0,0 sn</text>`);
    el.timerT = $("#timer");
    el.hand = g("hand", "");
    el.handCopies = [0.5, 0.25, 1].map((o) => mk("path", { d: HAND, fill: `rgba(18, 9, 4, ${0.82 * o})` }, el.hand));
    el.handT = el.handCopies;
    Object.assign(el, {
      screen: $("#screen"), scrBase: $("#scrBase"), scr: $("#scr"), shade: $("#scrShade"), cap: $("#cap"), strip: $("#strip"), stripIn: $("#stripIn"),
      lens: $("#lens"), halo: $("#halo"), logo: $("#logo"), endL: $("#endL"), endP: $("#endP"), black: $("#black"),
      tks: [...svg.querySelectorAll(".tk")], rl: $("#rl"), rlA: $("#rlA"), rlB: $("#rlB"), hs: $("#hs"), hf: $("#hf"),
    });
    // Film strip: 24 frames, each a small print of the four drawings.
    for (let i = 0; i < 24; i++) {
      const d = document.createElement("div"); d.className = "fr";
      d.innerHTML = `<div class="pic"><svg viewBox="0 0 840 760" preserveAspectRatio="xMidYMid slice">${V["v" + ((i % 4) + 1)]}</svg></div><span class="n">${i + 1}</span>`;
      el.stripIn.append(d);
    }
    el.stripIn.querySelectorAll(".pic .ln,.pic .thin").forEach((n) => { n.setAttribute("stroke", "#2a1a10"); n.setAttribute("fill", "none"); n.setAttribute("stroke-width", "6"); });
    el.stripIn.querySelectorAll(".pic .fill,.pic text").forEach((n) => n.setAttribute("fill", "#2a1a10"));
    el.stripIn.querySelectorAll(".pic .amb").forEach((n) => n.setAttribute("fill", "#e07a2e"));
    el.stripIn.querySelectorAll(".pic text").forEach((n) => { n.setAttribute("font-family", "DejaVu Sans Mono"); n.setAttribute("font-size", n.classList.contains("big") ? "64" : "30"); n.setAttribute("font-weight", "700"); });
    // Logo
    const doc = new DOMParser().parseFromString(await (await fetch("/public/hero/rast-sun-logo.svg")).text(), "image/svg+xml");
    const lsvg = mk("svg", { viewBox: `${VB.x} ${VB.y} ${VB.w} ${VB.h}` });
    for (const sh of doc.querySelectorAll("path, polygon, rect")) { const n = document.importNode(sh, true); n.removeAttribute("class"); n.setAttribute("class", "lt"); lsvg.append(n); }
    el.logo.append(lsvg);
    // canvases
    bctx = $("#beam").getContext("2d"); dctx = $("#dust").getContext("2d"); sctx = $("#scrFx").getContext("2d");
    const R = rng(9);
    dust = Array.from({ length: 220 }, () => ({ x: R() * 1080, y: 330 + R() * 1000, v: 6 + R() * 18, ph: R() * 6.28, s: 0.8 + R() * 2.2, a: 0.2 + R() * 0.6 }));
    // grain
    const cv = document.createElement("canvas"); cv.width = cv.height = 256;
    const cx = cv.getContext("2d"), id = cx.createImageData(256, 256), r2 = rng(11);
    for (let k = 0; k < id.data.length; k += 4) { const v = 128 + (r2() - 0.5) * 255; id.data[k] = id.data[k + 1] = id.data[k + 2] = v; id.data[k + 3] = 255; }
    cx.putImageData(id, 0, 0);
    $("#grain").style.backgroundImage = `url(${cv.toDataURL()})`;
  }

  /* ───── helpers ───── */
  const lampLevel = (t) => E.outC(P(t, C.lampOn, C.lampOn + 0.7)) * (1 - E.inC(P(t, C.lampOff, C.lampOff + 0.9)));
  const flick = (t) => { const k = Math.floor(t * 24); const r = rng(k * 7 + 3)(); return 0.95 + 0.05 * r; };
  const gate = (t) => { const k = Math.floor(t * 24); const r = rng(k * 13 + 1); return [(r() - 0.5) * 1.6, (r() - 0.5) * 2.2]; };
  // frame-advance blink at each projected cut
  const CUTS = [...C.frames, C.frameEnd, C.oneFrame, C.tapIn];
  const shutter = (t) => { for (const c of CUTS) { const p = (t - c) / 0.1; if (p > -0.5 && p < 1) return 1 - Math.abs(p - 0.25) * 1.3; } return 0; };

  function handPose(t) {
    // [x, y, visible, blur] in screen space (fingertip).
    const base = { x: 440, y: 250 };
    const trem = Math.sin(t * 2.1) * 3 + Math.sin(t * 3.7) * 2;
    if (t < C.handOut + 1) {
      const inn = E.ioC(P(t, C.handIn, C.handIn + 0.9)), out = E.inC(P(t, C.handOut, C.handOut + 0.8));
      const hes = Math.sin(clamp((t - C.hesitate) / 1.1) * Math.PI) * -34;
      const fr = E.outC(P(t, C.freeze, C.freeze + 0.6)) * 36;
      return { x: base.x + trem, y: base.y + (1 - inn) * 760 + out * 760 + hes + fr, on: t > C.handIn && t < C.handOut + 0.9, blur: 7 };
    }
    if (t > 24.2 && t < C.oneFrame + 0.6) {
      const inn = E.ioC(P(t, 24.3, 24.85)), sw = E.inC(P(t, C.swipe, C.swipe + 0.32)), back = E.outC(P(t, C.backIn, C.backIn + 0.8)), out = E.inC(P(t, 27.1, 27.6));
      let y = base.y + (1 - inn) * 760;
      if (t >= C.swipe && t < C.backIn) y = base.y - sw * 1100;
      if (t >= C.backIn) y = base.y + 40 + (1 - back) * 760 + out * 760;
      return { x: base.x + trem, y, on: true, blur: 7, streak: t >= C.swipe && t < C.swipe + 0.35 ? 1 : 0 };
    }
    if (t > C.tapIn - 0.1 && t < 33.4) {
      const inn = E.ioC(P(t, C.tapIn, C.tapIn + 0.7)), out = E.inC(P(t, 32.4, 33.2));
      let tap = 0, sharp = 0;
      for (const k of C.taps) { const p = (t - k) / 0.18; if (p > -1 && p < 1) { tap = Math.max(tap, 1 - Math.abs(p)); } }
      sharp = tap;
      return { x: 430 + trem * 0.5, y: 330 + (1 - inn) * 760 + out * 760 - tap * 26, on: true, blur: 7 - 4 * sharp };
    }
    return { x: 0, y: 2000, on: false, blur: 7 };
  }

  function drawBeam(t, L) {
    bctx.clearRect(0, 0, 1080, 1920);
    if (L <= 0.001) return;
    const fl = flick(t);
    const top = LENS, sx0 = SCR.x - 30, sx1 = SCR.x + SCR.w + 30, sy0 = SCR.y + 10, sy1 = SCR.y + SCR.h;
    // main cone
    const g = bctx.createLinearGradient(0, top.y, 0, sy1);
    g.addColorStop(0, `rgba(255, 214, 160, ${0.34 * L * fl})`); g.addColorStop(0.35, `rgba(255, 190, 130, ${0.12 * L * fl})`); g.addColorStop(1, `rgba(255, 170, 110, ${0.03 * L})`);
    bctx.fillStyle = g; bctx.beginPath(); bctx.moveTo(top.x - 16, top.y); bctx.lineTo(top.x + 16, top.y); bctx.lineTo(sx1, sy1); bctx.lineTo(sx0, sy1); bctx.closePath(); bctx.fill();
    // rays
    const R = rng(Math.floor(t * 12) + 99);
    for (let i = 0; i < 14; i++) {
      const u = (i + 0.5) / 14 + (R() - 0.5) * 0.02, w = 0.006 + R() * 0.02;
      const xa = mix(sx0, sx1, u - w), xb = mix(sx0, sx1, u + w);
      bctx.fillStyle = `rgba(255, 220, 170, ${(0.035 + R() * 0.03) * L * fl})`;
      bctx.beginPath(); bctx.moveTo(top.x, top.y); bctx.lineTo(xb, sy1); bctx.lineTo(xa, sy1); bctx.closePath(); bctx.fill();
    }
  }
  function drawDust(t, L) {
    dctx.clearRect(0, 0, 1080, 1920);
    if (L <= 0.001) return;
    const sx0 = SCR.x - 30, sx1 = SCR.x + SCR.w + 30, sy1 = SCR.y + SCR.h;
    for (const d of dust) {
      const y = 330 + ((((d.y - 330) - d.v * t) % 1000) + 1000) % 1000, x = d.x + Math.sin(t * 0.4 + d.ph) * 18;
      const u = (y - LENS.y) / (sy1 - LENS.y); if (u < 0.02 || u > 1) continue;
      const half = mix(16, (sx1 - sx0) / 2, u); const dx = Math.abs(x - 540);
      if (dx > half) continue;
      const a = d.a * L * (1 - dx / half) ** 0.5 * (0.6 + 0.4 * Math.sin(t * 3 + d.ph)) * (1 - u * 0.6);
      dctx.fillStyle = `rgba(255, 230, 190, ${a.toFixed(3)})`; dctx.beginPath(); dctx.arc(x, y, d.s * (0.6 + u * 0.6), 0, 6.283); dctx.fill();
    }
  }
  function drawFilm(t, L) {
    // grain specks, a scratch now and then, projector flicker — at film rate (24 fps)
    sctx.clearRect(0, 0, 840, 760);
    if (L <= 0.001) return;
    const k = Math.floor(t * 24), R = rng(k * 31 + 7);
    sctx.fillStyle = `rgba(40, 22, 10, ${(0.06 + (1 - flick(t)) * 1.4) * L})`; sctx.fillRect(0, 0, 840, 760);
    for (let i = 0; i < 26; i++) { sctx.fillStyle = `rgba(30, 16, 8, ${0.25 + R() * 0.4})`; const s = 1 + R() * 3.5; sctx.beginPath(); sctx.arc(R() * 840, R() * 760, s, 0, 6.283); sctx.fill(); }
    if (R() < 0.35) { const x = R() * 840; sctx.fillStyle = "rgba(40, 22, 10, .25)"; sctx.fillRect(x, 0, 1.4, 760); }
    if (R() < 0.12) { sctx.strokeStyle = "rgba(40, 22, 10, .4)"; sctx.lineWidth = 2; sctx.beginPath(); const x = R() * 840, y = R() * 760; sctx.moveTo(x, y); sctx.bezierCurveTo(x + 20, y + 10, x - 10, y + 30, x + 14, y + 44); sctx.stroke(); }
  }

  function caption(t) {
    for (const l of S.LINES) {
      for (let i = 0; i < l.parts.length; i++) {
        const a = l.at + l.parts[i][0], z = i + 1 < l.parts.length ? l.at + l.parts[i + 1][0] - 0.05 : l.at + l.speech + 0.45;
        if (t >= a - 0.05 && t < z) return { text: l.parts[i][1], o: P(t, a - 0.05, a + 0.12) * (1 - P(t, z - 0.18, z)) };
      }
    }
    return { text: "", o: 0 };
  }

  function renderAt(t) {
    const L = lampLevel(t), fl = flick(t);
    drawBeam(t, L); drawDust(t, L); drawFilm(t, L);
    // lens / sun
    const lp = E.ioC(P(t, 34.2, 35.2));
    const lx = mix(LENS.x, LDOT.x, lp), ly = mix(LENS.y, LDOT.y, lp);
    const on = E.outExpo(P(t, C.lampOn - 0.05, C.lampOn + 0.25));
    const s = mix(1, LDOT.d / 56, lp) * on;
    st(el.lens, { transform: `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0) scale(${Math.max(0.001, s).toFixed(4)})`, opacity: on > 0.01 ? "1" : "0",
      boxShadow: `0 0 ${(40 + 30 * L).toFixed(0)}px ${(8 + 8 * L).toFixed(0)}px rgba(255, 150, 70, ${(0.35 + 0.3 * L * fl).toFixed(3)})` });
    st(el.halo, { transform: `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0) scale(${(0.4 + 0.7 * Math.max(L, lp)).toFixed(3)})`, opacity: (on * Math.max(L * fl, lp * 0.8)).toFixed(3) });

    // the screen: lit by the lamp, dark between projected frames
    const sh = shutter(t);
    const [gx, gy] = gate(t);
    st(el.screen, { opacity: (Math.max(0.04, L)).toFixed(3) });
    st(el.scrBase, { filter: `brightness(${(0.25 + 0.75 * L * fl * (1 - 0.8 * sh)).toFixed(3)})` });
    st(el.scr, { transform: `translate3d(${gx.toFixed(2)}px, ${gy.toFixed(2)}px, 0)`, opacity: (1 - 0.9 * sh).toFixed(3) });
    sa(el.turb, { seed: String(1 + (Math.floor(t * 12) % 7)) });

    // timer
    const tOn = t > 1.1 && t < C.handOut + 0.6;
    st(el.timer, { display: tOn ? "" : "none" });
    if (tOn) {
      const v = Math.max(0, t - 1.2);
      el.timerT.textContent = v.toFixed(1).replace(".", ",") + " sn";
      sa(el.timerT, { fill: v > 2 ? "#b8561b" : "#2a1a10", opacity: (P(t, 1.1, 1.4) * (1 - P(t, C.handOut, C.handOut + 0.5))).toFixed(3) });
    }
    // hand shadow
    const H = handPose(t);
    st(el.hand, { display: H.on ? "" : "none", filter: `blur(${H.blur.toFixed(1)}px)` });
    if (H.on) el.handCopies.forEach((p, i) => {
      const trail = i < 2 && H.streak ? (i + 1) * 120 : 0;
      sa(p, { transform: `translate(${H.x.toFixed(1)} ${(H.y + trail).toFixed(1)}) rotate(-14)`, opacity: i < 2 ? (H.streak ? "1" : "0") : "1" });
    });

    // one second → 24 frames
    const rOn = t > 10.8 && t < 14.1;
    st(el.ruler, { display: rOn ? "" : "none" });
    if (rOn) {
      const out = 1 - P(t, 13.6, 14.0);
      sa(el.rl, { "stroke-dasharray": `${E.ioC(P(t, C.rulerDraw, C.rulerDraw + 0.8)).toFixed(4)} 1`, opacity: out.toFixed(3) });
      sa(el.rlA, { opacity: (E.outC(P(t, C.rulerDraw + 0.2, C.rulerDraw + 0.6)) * out).toFixed(3) });
      sa(el.rlB, { opacity: (E.outC(P(t, C.ticks + 0.3, C.ticks + 0.7)) * out).toFixed(3) });
      el.tks.forEach((n, i) => sa(n, { opacity: (P(t, C.ticks + i * 0.022, C.ticks + i * 0.022 + 0.06) * out).toFixed(3) }));
    }
    // film strip through the beam
    const [s0, s1] = C.strip;
    const sOn = t > s0 && t < s1 + 0.1;
    st(el.strip, { display: sOn ? "block" : "none" });
    st(el.shade, { opacity: (0.45 * P(t, s0, s0 + 0.4) * (1 - P(t, s1 - 0.4, s1))).toFixed(3) });
    if (sOn) {
      const p = P(t, s0, s1), travel = 24 * 250 + 1100;
      const y = 1500 - travel * (0.35 * p + 0.65 * (1 - (1 - p) ** 2));
      st(el.stripIn, { transform: `translate3d(${gx.toFixed(1)}px, ${y.toFixed(1)}px, 0)` });
      st(el.strip, { opacity: (P(t, s0, s0 + 0.3) * (1 - P(t, s1 - 0.25, s1))).toFixed(3), filter: `brightness(${(0.9 + 0.2 * fl).toFixed(3)})` });
    }
    // four frames, four nights
    el.v.forEach((n, i) => {
      const a = C.frames[i], z = i < 3 ? C.frames[i + 1] : C.frameEnd;
      st(n, { display: t >= a && t < z ? "" : "none" });
    });
    if (t >= C.frames[2] && t < C.frames[3]) sa(el.clapper, { transform: `rotate(${(-18 * (1 - E.inC(P(t, C.clap - 0.35, C.clap)))).toFixed(2)} 200 330)` });
    if (t >= C.frames[3] && t < C.frameEnd) sa(el.playhead, { transform: `translate(${mix(130, 720, P(t, C.frames[3], C.frameEnd)).toFixed(1)} 0)` });
    // a single frame
    st(el.one, { display: t >= C.oneFrame && t < C.tapIn ? "" : "none", opacity: (E.outC(P(t, C.oneFrame, C.oneFrame + 0.4)) * (1 - P(t, C.tapIn - 0.3, C.tapIn))).toFixed(3) });
    // the heart
    const hOn = t >= C.heart - 0.02 && t < 34.4;
    st(el.heart, { display: hOn ? "" : "none" });
    if (hOn) {
      const pop = E.outBack(clamp((t - C.heart) / 0.35));
      sa(el.heart, { transform: `translate(420 380) scale(${(0.2 + 0.8 * pop).toFixed(4)}) translate(-420 -380)` });
      sa(el.hs, { "stroke-dasharray": `${E.outC(P(t, C.heart, C.heart + 0.5)).toFixed(4)} 1` });
      sa(el.hf, { opacity: (0.25 * P(t, C.heart + 0.2, C.heart + 0.5) + 0.75 * E.outC(P(t, C.thanks - 0.05, C.thanks + 0.35))).toFixed(3) });
    }

    // captions (white, under the screen)
    const cp = caption(t);
    if (el.cap.textContent !== cp.text) el.cap.textContent = cp.text;
    st(el.cap, { opacity: cp.o.toFixed(3), transform: `translate3d(0, ${((1 - clamp(cp.o * 1.5)) * 10).toFixed(1)}px, 0)` });

    // end: the lamp becomes the dot of the logo
    const rp = E.outC(P(t, C.logo, C.logo + 1.2));
    const cx = LDOT.x - 190, cy = LDOT.y - 748, r = mix(0, 900, rp);
    const m = `radial-gradient(circle ${r.toFixed(0)}px at ${cx.toFixed(0)}px ${cy.toFixed(0)}px, #000 ${Math.max(0, r - 200).toFixed(0)}px, transparent ${r.toFixed(0)}px)`;
    st(el.logo, { opacity: t > C.logo ? "1" : "0", webkitMaskImage: m, maskImage: m, filter: `drop-shadow(0 0 ${(8 + 20 * (1 - rp)).toFixed(1)}px rgba(255, 138, 61, .45))` });
    const e1 = E.outExpo(P(t, 35.9, 36.8)), e2 = E.outExpo(P(t, 36.5, 37.3));
    st(el.endL, { opacity: e1.toFixed(3), transform: `translate3d(0, ${((1 - e1) * 24).toFixed(1)}px, 0)` });
    st(el.endP, { opacity: e2.toFixed(3), transform: `translate3d(-50%, ${((1 - e2) * 20).toFixed(1)}px, 0)` });
    st(el.black, { opacity: Math.max(1 - P(t, 0.05, 0.25), P(t, DUR - 0.5, DUR - 0.05)).toFixed(3) });
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
      if (!buf && window.SecondAudio) { play.textContent = "…"; actx = new AudioContext(); buf = await window.SecondAudio.render(); }
      from = +scrub.value; t0 = performance.now(); playing = true; play.textContent = "❚❚";
      if (buf) { node = actx.createBufferSource(); node.buffer = buf; node.connect(actx.destination); node.start(0, from); }
      loop();
    };
    scrub.oninput = () => { if (!playing) { renderAt(+scrub.value); tc.textContent = (+scrub.value).toFixed(2); } };
  }
})();
