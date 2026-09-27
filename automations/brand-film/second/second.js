/*
 * Rast Creative — "Bir Saniye" · picture engine (night-room version)
 * ------------------------------------------------------------------
 * 01:47. A dark bedroom, out of focus; a phone held above the bed is the
 * only light. The thumb flicks through a feed, lands on our Reel — and the
 * Reel talks back (its words appear on screen as the voice says them):
 *   0–9     the thumb hovers, hesitates, freezes · a timer counts
 *   10–13   one second → 24 frames
 *   13–17   a film strip runs through the Reel
 *   16–24   four frames, four nights (idea · sunrise · take 7 · cut v11)
 *   24–27   the thumb swipes it away… and brings it back ("Olsun.")
 *   27–33   "1 / 24" · a double tap, a heart · "teşekkürler."
 *   33–38   the screen goes dark; the avatar's sun becomes the logo's dot
 * Everything on the centre axis, inside the Instagram safe zone. No zoom.
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
  const mk = (tag, attrs = {}, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.append(n); return n; };

  /* phone geometry: 520×1080 at (280, 360), rotated -4° about its centre */
  const PH = { cx: 540, cy: 900, rot: (-4 * Math.PI) / 180, k: 1.08 };
  const toStage = (sx, sy) => { const x = 18 + sx - 260, y = 18 + sy - 540, c = Math.cos(PH.rot), s = Math.sin(PH.rot); return [PH.cx + PH.k * (x * c - y * s), PH.cy + PH.k * (x * s + y * c)]; };
  const SW = 484, SH = 1044;
  const VB = { x: 220, y: 340, w: 660, h: 400 }, DOT = { x: 589.63, y: 568.91, r: 26.43 };
  const LS = 700 / VB.w, LDOT = { x: 190 + (DOT.x - VB.x) * LS, y: 748 + (DOT.y - VB.y) * LS, d: 2 * DOT.r * LS };
  const AVATAR = [48, 930];

  /* ───── the drawings (840×760 space, white line on the dark Reel) ───── */
  const hand12 = (h, m) => { const a = ((h % 12) + m / 60) * 30, b = m * 6, r = (d) => (d - 90) * Math.PI / 180; return [a, b].map((d, i) => [620 + Math.cos(r(d)) * (i ? 52 : 34), 200 + Math.sin(r(d)) * (i ? 52 : 34)]); };
  const [hh, mm] = hand12(3, 14);
  const V = {
    v1: `<g class="ln"><path d="M60 600 H780"/><ellipse cx="180" cy="600" rx="60" ry="12"/><path d="M180 588 L250 430 L372 380"/><path d="M352 352 L418 344 L474 428 L376 452 Z"/>
      <path d="M440 560 L660 560 L700 600 L470 600 Z"/><path d="M500 575 H640 M512 588 H652" class="thin"/><path d="M620 520 H680 V600 H620 Z"/><path d="M680 540 C712 540 712 580 680 580"/>
      <path class="thin" d="M636 500 C626 480 646 468 636 448 M660 500 C650 480 670 468 660 448"/><circle cx="620" cy="200" r="72"/>
      <path d="M620 200 L${hh[0].toFixed(1)} ${hh[1].toFixed(1)} M620 200 L${mm[0].toFixed(1)} ${mm[1].toFixed(1)}"/></g>
      <path class="amb" opacity=".45" d="M418 446 L560 600 L330 600 Z"/><circle class="fill" cx="620" cy="200" r="6"/><text class="txt" x="60" y="90">03:14</text>`,
    v2: `<path class="amb" d="M450 520 A110 110 0 0 1 670 520 Z"/><g class="ln"><path d="M40 520 H800"/><path d="M560 380 V340 M470 420 L445 395 M650 420 L675 395 M430 480 L395 470 M690 480 L725 470"/>
      <path d="M40 560 C200 540 300 580 520 560 C640 548 720 570 800 560" class="thin"/><path d="M220 400 L160 600 M222 400 L222 600 M224 400 L284 600"/>
      <path d="M160 310 H280 V390 H160 Z"/><circle cx="302" cy="350" r="24"/><path d="M190 310 V292 H236 V310"/></g>
      <path class="thin" d="M600 200 l14 10 l14 -10 M660 160 l12 8 l12 -8"/><text class="txt" x="60" y="90">06:12</text>`,
    v3: `<g class="ln"><path d="M200 330 H640 V600 H200 Z"/><path d="M200 420 H640 M200 510 H640 M420 420 V600"/></g>
      <g class="clapper"><path class="fill" d="M200 290 H640 V330 H200 Z"/><path fill="#000" d="M240 290 L280 290 L260 330 L220 330 Z M330 290 L370 290 L350 330 L310 330 Z M420 290 L460 290 L440 330 L400 330 Z M510 290 L550 290 L530 330 L490 330 Z M600 290 L640 290 L620 330 L580 330 Z"/></g>
      <text class="txt" x="222" y="385">RAST CREATIVE</text><text class="txt" x="222" y="475">SAHNE</text><text class="txt" x="442" y="475">ÇEKİM</text>
      <text class="big" x="262" y="580">1</text><text class="big" x="482" y="580" fill="#ff8a3d">7</text><text class="txt" x="60" y="90">ÇEKİM 7</text>`,
    v4: `<g class="ln"><path d="M80 210 H760 V590 H80 Z"/><path d="M80 270 H760" class="thin"/></g>
      <g class="thin"><path d="M110 300 H330 V350 H110 Z M340 300 H520 V350 H340 Z M530 300 H730 V350 H530 Z"/><path d="M110 370 H250 V420 H110 Z M400 370 H640 V420 H400 Z"/>
      <path d="M110 470 ${Array.from({ length: 62 }, (_, i) => `L${110 + i * 10} ${470 + (i % 2 ? -1 : 1) * (6 + ((i * 37) % 23))}`).join(" ")}"/></g>
      <path class="amb" opacity=".5" d="M340 300 H520 V350 H340 Z"/><text class="txt" x="100" y="252">kurgu_v11_final.mp4</text>
      <g class="playhead"><path class="amb" d="M-3 280 H3 V580 H-3 Z"/><path class="amb" d="M-12 280 H12 L0 296 Z"/></g><text class="txt" x="60" y="90">v11</text>`,
  };
  const HEART = (cx, cy, s) => `M ${cx} ${cy + 0.62 * s} C ${cx - 0.85 * s} ${cy + 0.02 * s} ${cx - 1.2 * s} ${cy - 0.45 * s} ${cx - 0.95 * s} ${cy - 0.85 * s} C ${cx - 0.72 * s} ${cy - 1.2 * s} ${cx - 0.25 * s} ${cy - 1.15 * s} ${cx} ${cy - 0.75 * s} C ${cx + 0.25 * s} ${cy - 1.15 * s} ${cx + 0.72 * s} ${cy - 1.2 * s} ${cx + 0.95 * s} ${cy - 0.85 * s} C ${cx + 1.2 * s} ${cy - 0.45 * s} ${cx + 0.85 * s} ${cy + 0.02 * s} ${cx} ${cy + 0.62 * s} Z`;
  // other people's posts in the feed: colour and soft shapes only
  const POSTS = [["#3b1d5c", "#e0567a", 11], ["#0f3d4a", "#39c3b0", 23], ["#4a2a10", "#f0b049", 37]];

  let pending = [], el = {}, sctx;

  async function init() {
    await Promise.all([document.fonts.load('800 44px "Inter"'), document.fonts.load('700 26px "Inter"'), document.fonts.load('italic 440 60px "Fraunces"')]);
    // room: bokeh in the window, folds on the bed
    const R = rng(3), win = $("#win");
    for (let i = 0; i < 34; i++) { const d = 6 + R() * 26, warm = R() < 0.55; const s = document.createElement("i");
      Object.assign(s.style, { left: `${R() * 400}px`, top: `${60 + R() * 520}px`, width: `${d}px`, height: `${d}px`, background: warm ? "#ffb35c" : "#bcd4ff", opacity: String(0.25 + R() * 0.6) }); win.append(s); }
    const bed = $("#room .bed");
    for (let i = 0; i < 5; i++) { const f = document.createElement("div"); f.className = "fold"; Object.assign(f.style, { left: `${100 + R() * 900}px`, top: `${60 + i * 90}px`, width: `${300 + R() * 400}px`, transform: `rotate(${(R() - 0.5) * 16}deg)` }); bed.append(f); }

    // feed: posts stacked vertically, ours at index 0
    const feed = $("#feed"), defs = mk("defs", {}, feed);
    el.feedG = mk("g", {}, feed);
    const post = (k, [c1, c2, seed]) => {
      const g = mk("g", { transform: `translate(0 ${k * SH})` }, el.feedG);
      const gid = `pg${k + 3}`, lg = mk("linearGradient", { id: gid, x1: 0, y1: 0, x2: 0.4, y2: 1 }, defs);
      mk("stop", { offset: 0, "stop-color": c1 }, lg); mk("stop", { offset: 1, "stop-color": c2 }, lg);
      mk("rect", { width: SW, height: SH, fill: `url(#${gid})` }, g);
      const r = rng(seed); for (let i = 0; i < 6; i++) mk("circle", { cx: r() * SW, cy: r() * SH, r: 60 + r() * 160, fill: "#fff", opacity: (0.05 + r() * 0.12).toFixed(2) }, g);
      mk("circle", { cx: 48, cy: 930, r: 22, fill: "rgba(255,255,255,.55)" }, g);
      mk("rect", { x: 80, y: 918, width: 150, height: 22, rx: 11, fill: "rgba(255,255,255,.55)" }, g);
      mk("rect", { x: 24, y: 972, width: 300, height: 16, rx: 8, fill: "rgba(255,255,255,.35)" }, g);
      [610, 700, 790].forEach((y) => mk("circle", { cx: 440, cy: y, r: 16, fill: "none", stroke: "rgba(255,255,255,.8)", "stroke-width": 3.4 }, g));
      return g;
    };
    post(-2, POSTS[0]); post(-1, POSTS[1]); post(1, POSTS[2]);
    // our Reel
    const ours = mk("g", {}, el.feedG);
    mk("rect", { width: SW, height: SH, fill: "#050507" }, ours);
    mk("rect", { width: SW, height: SH, fill: "url(#ourGlow)" }, ours);
    const rg = mk("radialGradient", { id: "ourGlow", cx: 0.5, cy: 0.45, r: 0.7 }, defs);
    mk("stop", { offset: 0, "stop-color": "#2a1a10" }, rg); mk("stop", { offset: 1, "stop-color": "#050507" }, rg);
    el.timer = mk("text", { x: 26, y: 150, class: "txt", "font-size": 26 }, ours); el.timer.textContent = "0,0 sn";
    // one second → 24 ticks
    el.ruler = mk("g", {}, ours);
    el.rl = mk("path", { d: "M52 560 H432", class: "ln", pathLength: 1, "stroke-dasharray": "0 1" }, el.ruler);
    el.tks = Array.from({ length: 25 }, (_, i) => mk("path", { d: `M${52 + i * (380 / 24)} ${i % 6 === 0 ? 532 : 544} V576`, class: "thin", opacity: 0 }, el.ruler));
    el.rlA = mk("text", { x: 242, y: 500, "text-anchor": "middle", class: "big", "font-size": 46 }, el.ruler); el.rlA.textContent = "1 SANİYE";
    el.rlB = mk("text", { x: 242, y: 650, "text-anchor": "middle", class: "big", "font-size": 46, fill: "#ff8a3d", opacity: 0 }, el.ruler); el.rlB.textContent = "= 24 KARE";
    // the strip
    const clip = mk("clipPath", { id: "stripClip" }, defs); mk("rect", { x: 0, y: 330, width: SW, height: 520 }, clip);
    el.strip = mk("g", { "clip-path": "url(#stripClip)" }, ours);
    el.stripIn = mk("g", {}, el.strip);
    for (let i = 0; i < 24; i++) {
      const y = i * 170, g = mk("g", { transform: `translate(122 ${y})` }, el.stripIn);
      mk("rect", { width: 240, height: 170, fill: "#140d09" }, g);
      for (let k = 0; k < 4; k++) { mk("rect", { x: 8, y: 14 + k * 40, width: 12, height: 18, rx: 2, fill: "rgba(255,210,160,.55)" }, g); mk("rect", { x: 220, y: 14 + k * 40, width: 12, height: 18, rx: 2, fill: "rgba(255,210,160,.55)" }, g); }
      mk("rect", { x: 30, y: 12, width: 180, height: 146, fill: "#0a0a0c", stroke: "rgba(244,238,229,.25)" }, g);
      const pic = mk("g", { transform: "translate(30 12) scale(0.214 0.192)" }, g); pic.innerHTML = V["v" + ((i % 4) + 1)];
      const n = mk("text", { x: 204, y: 152, "text-anchor": "end", class: "txt", "font-size": 16 }, g); n.textContent = String(i + 1);
    }
    // four nights
    el.v = ["v1", "v2", "v3", "v4"].map((k) => { const g = mk("g", { transform: "translate(22 330) scale(0.524)" }, ours); g.innerHTML = V[k]; return g; });
    el.clapper = el.v[2].querySelector(".clapper"); el.playhead = el.v[3].querySelector(".playhead");
    // a single frame
    el.one = mk("g", {}, ours);
    el.one.innerHTML = `<rect x="122" y="400" width="240" height="190" fill="none" stroke="#f4eee5" stroke-width="5"/>` +
      Array.from({ length: 5 }, (_, i) => `<rect x="96" y="${408 + i * 36}" width="14" height="20" fill="#f4eee5"/><rect x="374" y="${408 + i * 36}" width="14" height="20" fill="#f4eee5"/>`).join("") +
      `<circle cx="242" cy="495" r="24" fill="#ff8a3d"/><text x="242" y="690" text-anchor="middle" class="big" font-size="56">1 / 24</text>`;
    // double-tap heart
    el.bigHeart = mk("path", { d: HEART(242, 560, 120), fill: "#fff" }, ours);
    el.ripple = mk("circle", { cx: 242, cy: 520, r: 0, fill: "none", stroke: "#fff", "stroke-width": 3, opacity: 0 }, ours);

    // Reel chrome (moves with our post)
    const ch = $("#chrome");
    el.chrome = mk("g", {}, ch);
    const top = mk("text", { x: 24, y: 70, class: "ui", "font-size": 30 }, el.chrome); top.textContent = "Reels";
    mk("path", { d: "M428 52 h24 l6 -8 h14 l6 8 h8 v30 h-58 Z", class: "ico", transform: "translate(-20 0)" }, el.chrome);
    mk("circle", { cx: 443, cy: 67, r: 9, class: "ico" }, el.chrome);
    el.likeIco = mk("path", { d: HEART(440, 614, 22), class: "ico" }, el.chrome);
    mk("path", { d: "M422 686 h36 a10 10 0 0 1 10 10 v18 a10 10 0 0 1 -10 10 h-22 l-14 12 v-12 a10 10 0 0 1 -10 -10 v-18 a10 10 0 0 1 10 -10 Z", class: "ico" }, el.chrome);
    mk("path", { d: "M420 790 L462 772 L446 812 L438 796 Z", class: "ico" }, el.chrome);
    [864, 876, 888].forEach((y) => mk("circle", { cx: 440, cy: y, r: 3.2, fill: "#fff" }, el.chrome));
    mk("circle", { cx: AVATAR[0], cy: AVATAR[1], r: 23, fill: "#1a1410", stroke: "#fff", "stroke-width": 2 }, el.chrome);
    el.avDot = mk("circle", { cx: AVATAR[0], cy: AVATAR[1], r: 9, fill: "#ff8a3d" }, el.chrome);
    const un = mk("text", { x: 82, y: 938, class: "ui", "font-size": 24 }, el.chrome); un.textContent = "rastcreative";
    mk("rect", { x: 244, y: 914, width: 104, height: 34, rx: 9, fill: "none", stroke: "rgba(255,255,255,.8)", "stroke-width": 2 }, el.chrome);
    const fo = mk("text", { x: 296, y: 938, "text-anchor": "middle", class: "ui", "font-size": 19 }, el.chrome); fo.textContent = "Takip et";
    const cap = mk("text", { x: 24, y: 984, class: "uis" }, el.chrome); cap.textContent = "Bir saniye ayırır mısın? ✦";
    const au = mk("text", { x: 24, y: 1016, class: "uis", "font-size": 18 }, el.chrome); au.textContent = "♫  Orijinal ses · rastcreative";
    mk("rect", { x: 0, y: 1040, width: SW, height: 4, fill: "rgba(255,255,255,.25)" }, el.chrome);
    el.prog = mk("rect", { x: 0, y: 1040, width: 0, height: 4, fill: "#fff" }, el.chrome);
    // status bar (fixed)
    el.status = mk("g", {}, ch);
    const clock = mk("text", { x: 58, y: 36, class: "ui", "font-size": 22 }, el.status); clock.textContent = "01:47";
    mk("rect", { x: 400, y: 22, width: 36, height: 17, rx: 5, fill: "none", stroke: "#fff", "stroke-width": 2 }, el.status);
    mk("rect", { x: 403, y: 25, width: 12, height: 11, rx: 2, fill: "#ff3b30" }, el.status);
    mk("rect", { x: 172, y: 16, width: 140, height: 34, rx: 17, fill: "#000" }, el.status);

    el.say = $("#say");
    // left hand, wrapped round the phone's edge (rotates with the phone)
    const lh = $("#lhand"), lgd = mk("linearGradient", { id: "lhg", x1: 0, x2: 1, y1: 0, y2: 0 }, mk("defs", {}, lh));
    mk("stop", { offset: 0, "stop-color": "#07060a" }, lgd); mk("stop", { offset: 0.8, "stop-color": "#16151d" }, lgd); mk("stop", { offset: 1, "stop-color": "#2a2a38" }, lgd);
    mk("path", { d: "M-260 40 C-120 0 40 60 70 180 L80 560 L-260 560 Z", fill: "#06050a" }, lh);
    [[40, 92], [140, 100], [240, 96], [340, 84]].forEach(([y, w]) => mk("rect", { x: 20, y, width: w, height: 74, rx: 37, fill: "url(#lhg)" }, lh));
    // right thumb (stage space)
    const hs = $("#hands"), hd = mk("defs", {}, hs);
    const tg = mk("linearGradient", { id: "thg", x1: 0, y1: 0, x2: 1, y2: 1 }, hd);
    mk("stop", { offset: 0, "stop-color": "#2b2833" }, tg); mk("stop", { offset: 1, "stop-color": "#0c0b10" }, tg);
    el.palm = mk("ellipse", { cx: 1010, cy: 1900, rx: 270, ry: 250, fill: "#07060a" }, hs);
    el.th1 = mk("line", { stroke: "#0d0c12", "stroke-width": 118, "stroke-linecap": "round" }, hs);
    el.th2 = mk("line", { stroke: "url(#thg)", "stroke-width": 92, "stroke-linecap": "round" }, hs);
    el.rim = mk("line", { stroke: "rgba(170, 195, 255, .28)", "stroke-width": 5, "stroke-linecap": "round" }, hs);
    el.nail = mk("ellipse", { rx: 25, ry: 33, fill: "#3a3642", opacity: 0.9 }, hs);

    // logo
    const doc = new DOMParser().parseFromString(await (await fetch("/public/hero/rast-sun-logo.svg")).text(), "image/svg+xml");
    const lsvg = mk("svg", { viewBox: `${VB.x} ${VB.y} ${VB.w} ${VB.h}` });
    for (const sh of doc.querySelectorAll("path, polygon, rect")) { const n = document.importNode(sh, true); n.removeAttribute("class"); n.setAttribute("class", "lt"); lsvg.append(n); }
    $("#logo").append(lsvg);
    Object.assign(el, { phone: $("#phone"), scr: $("#scr"), room: $("#room"), dot: $("#dot"), halo: $("#halo"), logo: $("#logo"), endL: $("#endL"), endP: $("#endP"), black: $("#black"), hands: $("#hands") });
    sctx = $("#spill").getContext("2d");
    const cv = document.createElement("canvas"); cv.width = cv.height = 256;
    const cx = cv.getContext("2d"), id = cx.createImageData(256, 256), r2 = rng(11);
    for (let k = 0; k < id.data.length; k += 4) { const v = 128 + (r2() - 0.5) * 255; id.data[k] = id.data[k + 1] = id.data[k + 2] = v; id.data[k + 3] = 255; }
    cx.putImageData(id, 0, 0);
    $("#grain").style.backgroundImage = `url(${cv.toDataURL()})`;
  }

  /* ───── motion ───── */
  // which post is on screen (float index: -2, -1 = other posts, 0 = ours, 1 = next)
  function feedPos(t) {
    const sw = (a, from, to, d = 0.3) => mix(from, to, E.outC(P(t, a, a + d)));
    if (t < C.doom[0]) return -2;
    if (t < C.doom[1]) return sw(C.doom[0], -2, -1);
    if (t < C.swipe) return sw(C.doom[1], -1, 0);
    if (t < C.backIn) return sw(C.swipe, 0, 1, 0.34);
    return sw(C.backIn, 1, 0, 0.4);
  }
  // thumb tip in screen space + whether it touches the glass
  function thumb(t) {
    const rest = [330, 860], trem = [Math.sin(t * 1.7) * 3, Math.sin(t * 2.3) * 4];
    let p = rest.slice(), touch = 0;
    const flick = (a, d = 0.3) => { const u = P(t, a - 0.12, a + d); if (u > 0 && u < 1) { const k = u < 0.3 ? 0 : E.outC((u - 0.3) / 0.7); p = [330, mix(860, 380, k) + (u < 0.3 ? 0 : 0)]; touch = u < 0.85 ? 1 : 0; if (u > 0.85) p[1] = mix(380, 860, (u - 0.85) / 0.15); } };
    flick(C.doom[0]); flick(C.doom[1]);
    // hesitation (lift and settle), freeze (pull back), rest aside while the Reel talks
    const hes = Math.sin(clamp((t - C.hesitate) / 1.2) * Math.PI);
    p[1] -= hes * 46;
    const back = E.ioC(P(t, C.freeze, C.freeze + 0.7)) * (1 - E.ioC(P(t, C.swipe - 0.9, C.swipe - 0.3)));
    const aside = E.ioC(P(t, C.rest, C.rest + 0.9)) * (1 - E.ioC(P(t, C.swipe - 0.9, C.swipe - 0.3)));
    p[0] += back * 30 + aside * 90; p[1] += back * 60 + aside * 130;
    // the swipe away, and back
    { const u = P(t, C.swipe - 0.1, C.swipe + 0.34); if (u > 0 && u < 1) { p = [330, mix(860, 300, E.outC(u))]; touch = u < 0.8 ? 1 : 0; } }
    { const u = P(t, C.swipe + 0.34, C.backIn - 0.2); if (u > 0 && u < 1) p = [mix(330, 300, u), mix(300, 330, E.ioC(u))]; }
    { const u = P(t, C.backIn - 0.2, C.backIn + 0.4); if (u > 0 && u < 1) { p = [300, mix(330, 880, E.outC(u))]; touch = u < 0.8 ? 1 : 0; } }
    // come in for the double tap, then leave
    const tapIn = E.ioC(P(t, C.tapIn, C.tapIn + 0.8)), out = E.inC(P(t, 32.6, 33.5));
    if (t > C.backIn + 0.4) { p = [mix(300, 250, tapIn), mix(880, 560, tapIn)]; p[0] += out * 260; p[1] += out * 700; }
    for (const k of C.taps) { const u = (t - k) / 0.16; if (u > -1 && u < 1) { const d = 1 - Math.abs(u); p[1] -= d * 10; if (Math.abs(u) < 0.45) touch = 1; } }
    return { x: p[0] + trem[0], y: p[1] + trem[1], touch };
  }

  function words(text, t, a, dur) {
    if (el.say._t !== text) { el.say.innerHTML = `<div>${text.split(" ").map((w) => `<span class="w">${w}</span>`).join(" ")}</div>`; el.say._t = text; el.say._w = [...el.say.querySelectorAll(".w")]; }
    const n = el.say._w.length;
    el.say._w.forEach((w, i) => { const s = a + (i / n) * dur * 0.85, e = E.outC(P(t, s - 0.05, s + 0.2)); st(w, { opacity: e.toFixed(3), transform: `translate3d(0, ${((1 - e) * 16).toFixed(1)}px, 0)` }); });
  }
  function line(t) {
    for (const l of S.LINES) for (let i = 0; i < l.parts.length; i++) {
      const a = l.at + l.parts[i][0], z = i + 1 < l.parts.length ? l.at + l.parts[i + 1][0] - 0.05 : l.at + l.speech + 0.55;
      const zEnd = i + 1 < l.parts.length ? l.at + l.parts[i + 1][0] : l.at + l.speech;
      if (t >= a - 0.05 && t < z) return { text: l.parts[i][1], a, dur: zEnd - a, o: 1 - P(t, z - 0.2, z) };
    }
    return null;
  }

  function renderAt(t) {
    const on = E.outC(P(t, C.wake, C.wake + 0.3)), off = E.inC(P(t, C.screenOff, C.screenOff + 0.35));
    const bright = on * (1 - off);
    const fp = feedPos(t);
    // phone + screen
    const phoneFade = 1 - E.inC(P(t, 34.1, 35.0));
    st(el.phone, { transform: `rotate(-4deg) scale(${PH.k})`, opacity: phoneFade.toFixed(3) });
    st(el.scr, { filter: `brightness(${(0.05 + 0.95 * bright).toFixed(3)})` });
    sa(el.feedG, { transform: `translate(0 ${(-fp * SH).toFixed(1)})` });
    sa(el.chrome, { transform: `translate(0 ${(-fp * SH).toFixed(1)})` });
    st(el.say, { transform: `translate3d(0, ${(-fp * SH).toFixed(1)}px, 0)` });
    // room light spilling from the screen
    sctx.clearRect(0, 0, 1080, 1920);
    const col = Math.abs(fp) > 0.5 ? [200, 140, 220] : [180, 170, 255];
    const I = bright * phoneFade * (Math.abs(fp) > 0.5 ? 0.3 : 0.18);
    if (I > 0.002) {
      const g = sctx.createRadialGradient(540, 900, 80, 540, 1000, 900);
      g.addColorStop(0, `rgba(${col}, ${I})`); g.addColorStop(0.5, `rgba(${col}, ${I * 0.35})`); g.addColorStop(1, "rgba(0,0,0,0)");
      sctx.fillStyle = g; sctx.fillRect(0, 0, 1080, 1920);
    }
    st(el.room, { opacity: (0.55 + 0.45 * bright * phoneFade).toFixed(3) });

    // timer
    const tv = Math.max(0, t - C.land);
    el.timer.textContent = tv.toFixed(1).replace(".", ",") + " sn";
    sa(el.timer, { opacity: (P(t, C.land, C.land + 0.3) * (1 - P(t, 9.8, 10.3))).toFixed(3), fill: tv > 2 ? "#ff8a3d" : "#f4eee5" });
    // words of the voice
    const ln = line(t);
    const small = t > 10.3 && t < 29.9;
    if (el.say.classList.contains("small") !== small) el.say.classList.toggle("small", small);
    if (ln && t < C.screenOff) { words(ln.text, t, ln.a, ln.dur); st(el.say, { opacity: ln.o.toFixed(3) }); } else st(el.say, { opacity: "0" });
    // ruler
    const rOn = t > 10.4 && t < 13.7;
    st(el.ruler, { display: rOn ? "" : "none" });
    if (rOn) {
      const out = 1 - P(t, 13.2, 13.6);
      sa(el.rl, { "stroke-dasharray": `${E.ioC(P(t, C.rulerDraw, C.rulerDraw + 0.8)).toFixed(4)} 1`, opacity: out.toFixed(3) });
      sa(el.rlA, { opacity: (E.outC(P(t, C.rulerDraw + 0.2, C.rulerDraw + 0.6)) * out).toFixed(3) });
      sa(el.rlB, { opacity: (E.outC(P(t, C.ticks + 0.3, C.ticks + 0.7)) * out).toFixed(3) });
      el.tks.forEach((n, i) => sa(n, { opacity: (P(t, C.ticks + i * 0.022, C.ticks + i * 0.022 + 0.06) * out).toFixed(3) }));
    }
    // strip
    const [s0, s1] = C.strip, sOn = t > s0 && t < s1;
    st(el.strip, { display: sOn ? "" : "none" });
    if (sOn) { const p = P(t, s0, s1), travel = 24 * 170 + 520; sa(el.stripIn, { transform: `translate(0 ${(850 - travel * (0.35 * p + 0.65 * (1 - (1 - p) ** 2))).toFixed(1)})` }); sa(el.strip, { opacity: (P(t, s0, s0 + 0.3) * (1 - P(t, s1 - 0.25, s1))).toFixed(3) }); }
    // four nights
    el.v.forEach((n, i) => { const a = C.frames[i], z = i < 3 ? C.frames[i + 1] : C.frameEnd; st(n, { display: t >= a && t < z ? "" : "none", opacity: E.outC(P(t, a, a + 0.25)).toFixed(3) }); });
    if (t >= C.frames[2] && t < C.frames[3]) sa(el.clapper, { transform: `rotate(${(-18 * (1 - E.inC(P(t, C.clap - 0.35, C.clap)))).toFixed(2)} 200 330)` });
    if (t >= C.frames[3] && t < C.frameEnd) sa(el.playhead, { transform: `translate(${mix(130, 720, P(t, C.frames[3], C.frameEnd)).toFixed(1)} 0)` });
    // one frame
    st(el.one, { display: t >= C.oneFrame && t < C.tapIn + 1.2 ? "" : "none", opacity: (E.outC(P(t, C.oneFrame, C.oneFrame + 0.4)) * (1 - P(t, C.taps[1], C.taps[1] + 0.3))).toFixed(3) });
    // double tap
    const hOn = t >= C.heart && t < C.heart + 1.4;
    st(el.bigHeart, { display: hOn ? "" : "none" });
    if (hOn) { const u = (t - C.heart) / 1.4, pop = E.outBack(clamp(u * 4)); sa(el.bigHeart, { transform: `translate(242 520) scale(${(0.2 + 0.8 * pop).toFixed(4)}) translate(-242 -520)`, opacity: (1 - E.inC(clamp((u - 0.55) / 0.45))).toFixed(3) }); }
    sa(el.likeIco, { fill: t >= C.heart ? "#ff3040" : "none", stroke: t >= C.heart ? "#ff3040" : "#fff" });
    // touch ripple
    const th = thumb(t);
    { let rp = 0; for (const k of [...C.doom, C.swipe, C.backIn, ...C.taps]) { const u = (t - k + 0.05) / 0.45; if (u > 0 && u < 1) rp = u; }
      sa(el.ripple, { cx: th.x.toFixed(1), cy: (th.y + fp * SH).toFixed(1), r: (10 + 50 * rp).toFixed(1), opacity: (rp > 0 ? 0.4 * (1 - rp) : 0).toFixed(3) }); }
    // progress bar + avatar dot
    sa(el.prog, { width: (SW * clamp((t - C.land) / (C.screenOff - C.land))).toFixed(1) });

    // the thumb (stage space): the whole hand follows the tip, the thumb bends at the knuckle
    const tip = toStage(th.x, th.y);
    const base = [tip[0] + 250 + Math.max(0, tip[1] - 1250) * 0.1, tip[1] + 190];
    const dx = tip[0] - base[0], dy = tip[1] - base[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    const nx = -uy, ny = ux;                         // normal, bulging up/out
    const joint = [base[0] + dx * 0.52 - nx * 22, base[1] + dy * 0.52 - ny * 22];
    sa(el.th1, { x1: base[0].toFixed(1), y1: base[1].toFixed(1), x2: joint[0].toFixed(1), y2: joint[1].toFixed(1) });
    sa(el.th2, { x1: joint[0].toFixed(1), y1: joint[1].toFixed(1), x2: tip[0].toFixed(1), y2: tip[1].toFixed(1) });
    sa(el.palm, { cx: (base[0] + 110).toFixed(1), cy: (base[1] + 150).toFixed(1), rx: 190, ry: 230, transform: `rotate(-28 ${(base[0] + 110).toFixed(1)} ${(base[1] + 150).toFixed(1)})` });
    sa(el.rim, { x1: (joint[0] - nx * 44).toFixed(1), y1: (joint[1] - ny * 44).toFixed(1), x2: (tip[0] - nx * 38 - ux * 18).toFixed(1), y2: (tip[1] - ny * 38 - uy * 18).toFixed(1), opacity: (0.4 + 0.6 * bright).toFixed(3) });
    const ang = (Math.atan2(uy, ux) * 180) / Math.PI + 90;
    sa(el.nail, { cx: (tip[0] - ux * 24).toFixed(1), cy: (tip[1] - uy * 24).toFixed(1), transform: `rotate(${ang.toFixed(1)} ${(tip[0] - ux * 24).toFixed(1)} ${(tip[1] - uy * 24).toFixed(1)})`, opacity: (0.5 + 0.4 * bright).toFixed(3) });
    st(el.hands, { opacity: (phoneFade * (0.35 + 0.65 * Math.max(bright, 0.2))).toFixed(3) });

    // end: the avatar's sun becomes the logo's dot
    const a0 = toStage(AVATAR[0], AVATAR[1] - fp * SH);
    const dp = E.ioC(P(t, C.screenOff + 0.2, C.logo + 0.3));
    const dOn = t > C.screenOff;
    const dx2 = mix(a0[0], LDOT.x, dp), dy2 = mix(a0[1], LDOT.y, dp), ds = mix(18 / 56, LDOT.d / 56, dp);
    st(el.dot, { opacity: dOn ? "1" : "0", transform: `translate3d(${dx2.toFixed(1)}px, ${dy2.toFixed(1)}px, 0) scale(${ds.toFixed(4)})`, boxShadow: "0 0 50px 10px rgba(255, 140, 60, .5)" });
    st(el.halo, { opacity: dOn ? (0.6 + 0.3 * dp).toFixed(3) : "0", transform: `translate3d(${dx2.toFixed(1)}px, ${dy2.toFixed(1)}px, 0) scale(${(0.3 + 0.6 * dp).toFixed(3)})` });
    const rp = E.outC(P(t, C.logo, C.logo + 1.2));
    const lx = LDOT.x - 190, ly = LDOT.y - 748, r = mix(0, 900, rp);
    const m = `radial-gradient(circle ${r.toFixed(0)}px at ${lx.toFixed(0)}px ${ly.toFixed(0)}px, #000 ${Math.max(0, r - 200).toFixed(0)}px, transparent ${r.toFixed(0)}px)`;
    st(el.logo, { opacity: t > C.logo ? "1" : "0", webkitMaskImage: m, maskImage: m, filter: `drop-shadow(0 0 ${(8 + 20 * (1 - rp)).toFixed(1)}px rgba(255, 138, 61, .45))` });
    const e1 = E.outExpo(P(t, 35.9, 36.8)), e2 = E.outExpo(P(t, 36.5, 37.3));
    st(el.endL, { opacity: e1.toFixed(3), transform: `translate3d(0, ${((1 - e1) * 24).toFixed(1)}px, 0)` });
    st(el.endP, { opacity: e2.toFixed(3), transform: `translate3d(-50%, ${((1 - e2) * 20).toFixed(1)}px, 0)` });
    st(el.black, { opacity: Math.max(1 - P(t, 0.02, 0.2), P(t, DUR - 0.5, DUR - 0.05)).toFixed(3) });
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
