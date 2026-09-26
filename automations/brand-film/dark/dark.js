/*
 * Rast Creative — "Karanlık Oda" · picture engine
 * ------------------------------------------------------------------
 * A dark room with one light: the ra.st dot of the logo. The sun travels
 * through every scene (intro → progress head → logo → pipeline → end card),
 * so the cuts stay seamless without any zoom move.
 *
 * 128 BPM, one bar = 4 beats = 1.875 s. Scenes sit on bars:
 *   A  b0–8   "Her hikâye karanlıkta başlar."
 *   B  b8–16  the studio boots (terminal + render bar)
 *   C  b16–24 light burst → logo
 *   D  b24–32 idea → screen pipeline
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
  const LABEL = { A: "01 — KARANLIK", B: "02 — SET", C: "03 — IŞIK", D: "04 — SÜREÇ", E: "05 — İŞLER", F: "06 — HİZMETLER", G: "07 — VURUŞ", H: "08 — RAST" };
  const CUTS = [8, 24, 32, 40, 48, 52].map(b);

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
  const DOT_C = logoDot(110, 700, 860), DOT_H = logoDot(190, 470, 700);

  /* ───── B · terminal lines ───── */
  const TERM = [
    [8.3, `<span class="p">$</span> rast yeni-proje --marka <span class="ok">"siz"</span>`, 1.3],
    [9.75, `<span class="d">→</span> brief okunuyor ........ <span class="ok">✓</span>`],
    [10.25, `<span class="d">→</span> senaryo yazılıyor ..... <span class="ok">✓</span>`],
    [10.75, `<span class="d">→</span> ekip + ekipman ........ <span class="ok">✓</span>`],
    [11.25, `<span class="d">→</span> ışık kuruluyor ........ <span class="ok">✓</span>`],
    [11.75, `<span class="d">→</span> kamera ................ <span class="rec">● REC</span>`],
    [12.25, `<span class="d">→</span> kurgu · renk · ses .... <span class="ok">✓</span>`],
  ];
  // Visible prefix of an HTML line (tags are free, characters count).
  function typed(html, n) {
    let out = "", c = 0;
    for (let i = 0; i < html.length && c < n; ) {
      if (html[i] === "<") { const j = html.indexOf(">", i); out += html.slice(i, j + 1); i = j + 1; continue; }
      out += html[i++]; c++;
    }
    return out.replace(/<span[^>]*>$/, "") + (out.split("<span").length > out.split("</span>").length ? "</span>" : "");
  }
  const textLen = (html) => html.replace(/<[^>]+>/g, "").length;

  /* ───── D · pipeline ───── */
  const NODES = [
    ["01", "FİKİR", "brief · strateji", "✓ ONAY"],
    ["02", "SENARYO", "metin · storyboard", "✓ YAZILDI"],
    ["03", "ÇEKİM", "set · ışık · drone", "● REC"],
    ["04", "KURGU", "renk · ses · motion", "✓ BİTTİ"],
    ["05", "YAYIN", "reels · reklam · web", "✓ CANLI"],
  ];
  const NY = (i) => 620 + i * 170;

  /* ───── F · wall ───── */
  const WALL = ["REKLAM FİLMİ", "MARKA FİLMİ", "REELS", "DRONE", "FOTOĞRAF", "SENARYO", "KURGU", "RENK", "MOTION", "SES TASARIMI", "SOSYAL MEDYA", "VFX"];
  const WALL_HI = [3, 7, 1, 9, 5, 10, 2, 6];

  /* ───── G · slams ───── */
  const SLAM = [["FİKİR", "f1", "ALTOTEKS"], ["IŞIK", "f2", "CANDLELIT BALLET"], ["EMEK", "f3", "CANEX"], ["RAST", "f4", "ADATIP × SAKARYASPOR"]];

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
      hud: $("#hud"), htc: $("#htc"), hsc: $("#hsc"), rec: $("#hud .t2 i"), wipe: $("#wipe"), bloom: $("#bloom"), black: $("#black"),
      tb: $("#tb"), pf: $("#pf"), pct: $("#pct"), term: $("#term"), ready: $("#ready"),
      logoC: $("#logoC"), tagC: $("#tagC"), subC: $("#subC"),
      railF: $("#railF"), tc: $("#tc"), pipeT: $("#pipeT"),
      ring: $("#ring"), galN: $("#galN span"), galH: $("#galH"), galK: $("#galK"),
      wall: $("#wall"), wallK: $("#wallK"),
      slamW: $("#slamW"), slamO: $("#slamO"), slamK: $("#slamK"),
      logoH: $("#logoH"), endL: $("#endL"), endP: $("#endP"), endS: $("#endS"),
    });
    // Terminal rows.
    el.rows = TERM.map(() => { const d = document.createElement("div"); d.className = "l"; el.tb.append(d); return d; });
    // Pipeline nodes.
    el.nodes = NODES.map(([n, nm, sb, ck], i) => {
      const d = document.createElement("div"); d.className = "node"; d.style.top = NY(i) + "px";
      d.innerHTML = `<div class="ring"></div><p class="num">${n}</p><p class="nm">${nm}</p><p class="sb">${sb}</p><p class="ck">${ck}</p>`;
      $("#nodes").append(d);
      return { d, ring: d.querySelector(".ring"), nm: d.querySelector(".nm"), sb: d.querySelector(".sb"), num: d.querySelector(".num"), ck: d.querySelector(".ck") };
    });
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
      const k = 960 / el.slamO.firstChild.getBoundingClientRect().width; el.slamO._w = null; return 200 * k;
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
    // A: centre high → B: progress head → C: logo dot → D: rail head → E: gone → H: end logo dot.
    const A = { x: 540, y: 640, s: 1 };
    const barY = 560 + 760 - 70 - 6, bx = (p) => 120 + 840 * p;
    const pr = progress(t);
    if (t < b(7.6)) {
      const ign = E.outExpo(P(t, 0.12, 0.9));
      const flick = t < 0.9 ? 0.75 + 0.25 * Math.sin(t * 90) * Math.sin(t * 37) : 1;
      return { ...A, s: ign * flick, g: ign * (0.55 + 0.45 * P(t, 0.9, b(6))) };
    }
    if (t < b(8.6)) { const p = E.ioC(P(t, b(7.6), b(8.6))); return { x: mix(A.x, bx(0), p), y: mix(A.y, barY, p), s: mix(1, 0.5, p), g: mix(1, 0.45, p) }; }
    if (t < b(15)) return { x: bx(pr), y: barY, s: 0.5 + 0.2 * pr, g: 0.45 + 0.35 * pr };
    if (t < b(16)) { const p = E.ioC(P(t, b(15), b(15.85))); return { x: mix(bx(1), DOT_C.x, p), y: mix(barY, DOT_C.y, p), s: mix(0.7, DOT_C.d / 52, p), g: mix(0.8, 1.2, p) }; }
    if (t < b(23.4)) return { x: DOT_C.x, y: DOT_C.y, s: DOT_C.d / 52, g: 1 };
    if (t < b(24.4)) { const p = E.ioC(P(t, b(23.4), b(24.4))); return { x: mix(DOT_C.x, 150, p), y: mix(DOT_C.y, NY(0), p), s: mix(DOT_C.d / 52, 0.62, p), g: mix(1, 0.7, p) }; }
    if (t < b(31.5)) { const y = railY(t); return { x: 150, y, s: 0.62, g: 0.7 }; }
    if (t < b(32)) { const p = E.inC(P(t, b(31.5), b(32))); return { x: 150, y: NY(4), s: 0.62 * (1 - p), g: 0.7 * (1 - p) }; }
    if (t < b(52)) return { x: 540, y: 960, s: 0, g: 0 };
    const p = E.outExpo(P(t, b(52), b(53)));
    return { x: DOT_H.x, y: DOT_H.y, s: (DOT_H.d / 52) * p, g: p };
  }
  function progress(t) {
    // A render bar that breathes: fast, a stall, then the last push.
    const x = P(t, b(12.5), b(15));
    return clamp(E.ioS(clamp(x * 1.25)) * 0.62 + E.outC(P(x, 0.55, 1)) * 0.38);
  }
  function railY(t) {
    // One node per beat from b25, each step eased.
    const s = clamp((t - b(24.6)) / BT, 0, 4);
    const k = Math.floor(s), f = s - k;
    return NY(Math.min(4, k + E.outExpo(clamp(f / 0.55))));
  }

  const tcode = (t) => { const f = Math.floor(t * FPS); const s = Math.floor(f / FPS); return `00:00:${String(s).padStart(2, "0")}:${String(f % FPS).padStart(2, "0")}`; };

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
    const gx = scene === "E" || scene === "F" || scene === "G" ? 540 : S.x, gy = scene === "E" ? 990 : scene === "F" || scene === "G" ? 960 : S.y;
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

    /* HUD */
    st(el.hud, { opacity: String((P(t, 0.3, 1.2) * (scene === "G" ? 0.5 : 1)).toFixed(3)) });
    el.htc.textContent = tcode(t);
    st(el.rec, { opacity: Math.floor(t / BT) % 2 ? "0.25" : "1" });
    el.hsc.innerHTML = `SAHNE <b>${LABEL[scene]}</b>`;
    // Light line sweeps on the bar cuts.
    let wy = -10, wo = 0;
    for (const c of CUTS) { const p = P(t, c - 0.05, c + 0.16); if (p > 0 && p < 1) { wy = mix(-10, 1930, E.ioS(p)); wo = Math.sin(p * Math.PI); } }
    st(el.wipe, { top: wy.toFixed(1) + "px", opacity: (wo * 0.7).toFixed(3) });
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
    st($("#aK"), { opacity: String((P(t, 0.8, 1.3) * (1 - P(t, b(7), b(7.6)))).toFixed(3)) });
    rise($("#a1 span"), t, b(2), 0.45, b(7.5));
    rise($("#a2 span"), t, b(4), 0.45, b(7.55));
    rise($("#a3 span"), t, b(6), 0.45, b(7.6));
    // The hollow word fills with light for a beat when the kick lands.
    const f = beatPulse(t, b(5), b(7.5), 6);
    st($("#a2 span"), { webkitTextStroke: `2.5px rgba(244, 238, 229, ${(0.6 + 0.4 * f).toFixed(3)})`, textShadow: `0 0 ${(30 * f).toFixed(0)}px rgba(255, 138, 61, ${(0.7 * f).toFixed(3)})` });
  }

  function sceneB(t) {
    const open = E.outExpo(P(t, b(8), b(8.8)));
    const close = E.inC(P(t, b(15), b(15.7)));
    st(el.term, { clipPath: `inset(${((1 - open) * 50).toFixed(2)}% 0 ${((1 - open) * 50).toFixed(2)}% 0 round 26px)`, opacity: String((1 - close).toFixed(3)),
      transform: `translate3d(0, ${(close * -60).toFixed(1)}px, 0)` });
    st($("#bK"), { opacity: String((P(t, b(8.4), b(9)) * (1 - close)).toFixed(3)) });
    let last = -1;
    TERM.forEach(([bt, html, dur], i) => {
      const a = b(bt);
      if (t < a) { if (el.rows[i].innerHTML) el.rows[i].innerHTML = ""; return; }
      last = i;
      const n = dur ? Math.floor(textLen(html) * P(t, a, a + b(dur))) : 1e9;
      const h = n >= 1e9 ? html : typed(html, n);
      if (el.rows[i]._h !== h) { el.rows[i].innerHTML = h; el.rows[i]._h = h; }
    });
    // cursor on the newest row
    el.rows.forEach((r, i) => { const c = r.querySelector(".cur"); if (c && i !== last) c.remove(); });
    if (last >= 0) {
      let c = el.rows[last].querySelector(".cur");
      if (!c) { c = document.createElement("i"); c.className = "cur"; el.rows[last].append(c); }
      c.style.opacity = Math.floor(t / (BT / 2)) % 2 ? "0" : "1";
    }
    const pr = progress(t);
    st(el.pf, { width: (pr * 100).toFixed(2) + "%" });
    el.pct.textContent = Math.round(pr * 100) + "%";
    const rd = E.outExpo(P(t, b(15), b(15.5)));
    st(el.ready, { opacity: String(rd.toFixed(3)), transform: `translate3d(0, ${((1 - rd) * 30).toFixed(1)}px, 0)`, letterSpacing: `${(0.02 + 0.1 * (1 - rd)).toFixed(3)}em` });
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
    rise($("#pipeH .line1 span"), t, b(24), 0.45);
    rise($("#pipeH .line2 span"), t, b(24.5), 0.45);
    st(el.pipeT, { opacity: String(P(t, b(25), b(25.5)).toFixed(3)) });
    el.tc.textContent = (() => { const x = Math.max(0, t - b(24.5)) * 11.3; const h = Math.floor(x / 3600), mi = Math.floor(x / 60) % 60, s = Math.floor(x) % 60; return [h, mi, s].map((v) => String(v).padStart(2, "0")).join(":"); })();
    const y = railY(t);
    st(el.railF, { height: Math.max(0, y - NY(0)).toFixed(1) + "px", opacity: t > b(24.6) ? "1" : "0" });
    el.nodes.forEach((n, i) => {
      const a = b(24.3 + i * 0.25);
      const e = E.outExpo(P(t, a, a + 0.5));
      st(n.d, { opacity: String(e.toFixed(3)), transform: `translate3d(${((1 - e) * -60).toFixed(1)}px, 0, 0)` });
      const lit = t >= b(24.6 + i) - 0.02 ? 1 : 0;
      const hit = lit ? Math.exp(-(t - b(24.6 + i)) * 5) : 0;
      n.ring.style.setProperty("--on", String(lit));
      st(n.ring, { borderColor: lit ? `rgba(255, 150, 80, ${(0.6 + 0.4 * hit).toFixed(3)})` : "rgba(255,255,255,.2)", boxShadow: lit ? `0 0 ${(18 + 40 * hit).toFixed(0)}px rgba(255, 138, 61, ${(0.4 + 0.5 * hit).toFixed(3)})` : "none" });
      st(n.nm, { color: lit ? "#f4eee5" : "rgba(244, 238, 229, .28)" });
      const ck = E.outExpo(P(t, b(24.6 + i) + 0.04, b(24.6 + i) + 0.4));
      st(n.ck, { opacity: String(ck.toFixed(3)), transform: `translate3d(${((1 - ck) * 30).toFixed(1)}px, 0, 0)`, background: i === 2 ? "#ff4a3a" : "", boxShadow: i === 2 ? "0 0 24px rgba(255, 74, 58, .6)" : "" });
    });
    const out = E.inC(P(t, b(31.4), b(32)));
    st(el.D, { opacity: String((1 - out).toFixed(3)) });
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
    st(el.wallK, { opacity: String(P(t, b(40.3), b(41)).toFixed(3)) });
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
    el.slamK.textContent = `// ${name}`;
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
