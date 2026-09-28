/*
 * Rast Creative — "Çekim Günü" · picture engine
 * ------------------------------------------------------------------
 * Ten Kling shots cut on the beat, white captions, manga speed-line hits on
 * the impacts (fist bump, clapper, Enter, the jaw drop), then the logo card
 * dead-centre: "Ağızları açık kalsın."
 * Deterministic: window.__render(t) draws any frame; no zoom anywhere.
 */
(() => {
  "use strict";
  const K = window.CEKIM, C = K.CUE, FPS = K.FPS, DUR = K.DUR;
  const CACHE = "/automations/brand-film/.cache/cekim";
  const $ = (s, r = document) => r.querySelector(s);
  const P = (t, a, c) => (!(t > a) ? 0 : t >= c ? 1 : (t - a) / (c - a));
  const mix = (a, c, p) => a + (c - a) * p;
  const E = {
    outC: (x) => 1 - (1 - x) ** 3,
    ioC: (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
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
  const NS = "http://www.w3.org/2000/svg";

  // Impact hits: [time, centre x, centre y, life, flash strength]
  const HITS = [
    [C.bump, 560, 1010, 0.42, 0.35],
    [C.clap, 700, 1180, 0.36, 0.3],
    [C.enter, 570, 1350, 0.12, 0.85],
    [C.freeze, 540, 720, 0.55, 0.25],
    [C.logo, 540, 960, 0.5, 0],
  ];
  // logo geometry (same sun logo as the other films; its dot sits at LDOT)
  const VB = { x: 220, y: 340, w: 660 }, DOT = { x: 589.63, y: 568.91, r: 26.43 };
  const LS = 700 / VB.w, LDOT = { x: 190 + (DOT.x - VB.x) * LS, y: 748 + (DOT.y - VB.y) * LS };

  const el = {};
  let manifest = {}, pending = [], fx, gctx, lastWord = -1;

  async function init() {
    manifest = await (await fetch(`${CACHE}/manifest.json`)).json();
    const doc = new DOMParser().parseFromString(await (await fetch("/public/hero/rast-sun-logo.svg")).text(), "image/svg+xml");
    const lsvg = document.createElementNS(NS, "svg");
    lsvg.setAttribute("viewBox", doc.documentElement.getAttribute("viewBox"));
    for (const sh of doc.querySelectorAll("path, polygon, rect, circle, ellipse")) { const n = document.importNode(sh, true); n.removeAttribute("class"); n.setAttribute("class", "lt"); lsvg.append(n); }
    // the sun: an ember dot over the logo's own dot
    const sun = document.createElementNS(NS, "circle");
    Object.entries({ cx: DOT.x, cy: DOT.y, r: DOT.r + 0.6, fill: "#ff8a3d" }).forEach(([k, v]) => sun.setAttribute(k, v));
    lsvg.append(sun);
    $("#logo").append(lsvg);
    Object.assign(el, { shot: $("#shot"), word: $("#word"), end: $("#end"), logo: $("#logo"), endL: $("#endL"), endP: $("#endP"), flash: $("#flash"), black: $("#black") });
    fx = $("#fx").getContext("2d");
    gctx = $("#grain").getContext("2d");
    await document.fonts.load('800 76px "Inter"');
    await document.fonts.load('italic 500 68px "Fraunces"');
    // warm the first frame of every shot
    await Promise.all(K.SHOTS.map((s) => { const i = new Image(); i.src = frameSrc(s.id, 1); return i.decode().catch(() => {}); }));
  }

  const frameSrc = (id, k) => `${CACHE}/${id}/${String(k).padStart(4, "0")}.jpg`;
  function shotAt(t) { return K.SHOTS.find((s) => t >= s.a && t < s.b); }
  function srcTime(s, t) {
    const u = t - s.a;
    if (!s.ramp) return s.in + u;
    const [knee, slow, fast] = s.ramp;
    return s.in + (u < knee ? u * slow : knee * slow + (u - knee) * fast);
  }

  /* ───── manga speed lines ───── */
  function burst(t, [t0, cx, cy, life]) {
    const p = (t - t0) / life;
    if (p < 0 || p >= 1) return;
    const R = rng(Math.floor((t - t0) * 12) * 7919 + Math.round(t0 * 100));   // boils at 12 fps
    const a = (1 - p) ** 1.4;
    fx.save();
    fx.fillStyle = "#fff";
    const n = 84;
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + (R() - 0.5) * 0.07;
      const r0 = (300 + R() * 260) * (1 + p * 0.35), r1 = 1700;
      const w = (3 + R() * 16) * (R() < 0.15 ? 2 : 1);
      const ca = Math.cos(ang), sa = Math.sin(ang), nx = -sa, ny = ca;
      fx.globalAlpha = a * (0.45 + R() * 0.5);
      fx.beginPath();
      fx.moveTo(cx + ca * r0, cy + sa * r0);
      fx.lineTo(cx + ca * r1 + nx * w, cy + sa * r1 + ny * w);
      fx.lineTo(cx + ca * r1 - nx * w, cy + sa * r1 - ny * w);
      fx.closePath();
      fx.fill();
    }
    fx.restore();
  }

  /* ───── captions: word by word, rising in ───── */
  function words(t) {
    const i = K.WORDS.findIndex((w) => t >= w.a && t < w.b);
    if (i !== lastWord) {
      lastWord = i;
      el.word.innerHTML = "";
      el.word.className = i >= 0 && K.WORDS[i].quote ? "quote" : "";
      if (i >= 0) {
        const d = document.createElement("div");
        K.WORDS[i].text.split(" ").forEach((w) => { const s = document.createElement("span"); s.className = "w"; s.textContent = w; d.append(s); });
        el.word.append(d);
      }
    }
    if (i < 0) return;
    const w = K.WORDS[i], out = 1 - P(t, w.b - 0.16, w.b);
    el.word.querySelectorAll(".w").forEach((s, k) => {
      const p = E.outExpo(P(t, w.a + k * 0.07, w.a + k * 0.07 + 0.32));
      st(s, { opacity: (p * out).toFixed(3), transform: `translate3d(0, ${((1 - p) * 30).toFixed(1)}px, 0)` });
    });
  }

  function grain(t) {
    const R = rng(Math.floor(t * 12) + 11);
    const img = gctx.createImageData(600, 1067), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const v = R() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
    gctx.putImageData(img, 0, 0);
  }

  function renderAt(t) {
    // picture
    const s = shotAt(t);
    if (s) {
      const m = manifest[s.id];
      const k = Math.max(1, Math.min(m.count, Math.floor(srcTime(s, t) * m.fps) + 1));
      const src = frameSrc(s.id, k);
      if (el.shot.getAttribute("src") !== src) { el.shot.setAttribute("src", src); pending.push(el.shot.decode().catch(() => {})); }
      st(el.shot, { opacity: "1" });
    } else st(el.shot, { opacity: "0" });

    // hits
    fx.clearRect(0, 0, 1080, 1920);
    HITS.forEach((h) => burst(t, h));
    let fl = 0;
    HITS.forEach(([t0, , , , f]) => { if (f) fl = Math.max(fl, f * (1 - P(t, t0, t0 + 0.1)) * (t >= t0 ? 1 : 0)); });
    fl = Math.max(fl, 0.9 * (1 - P(t, C.enter + 0.02, C.freeze + 0.12)) * (t >= C.enter ? 1 : 0));
    st(el.flash, { opacity: fl.toFixed(3) });

    words(t);

    // end card
    const onEnd = t >= C.logo;
    st(el.end, { opacity: onEnd ? "1" : "0" });
    const rp = E.outC(P(t, C.logo + 0.05, C.logo + 1.0));
    const lx = LDOT.x - 190, ly = LDOT.y - 748, r = mix(0, 900, rp);
    const msk = `radial-gradient(circle ${r.toFixed(0)}px at ${lx.toFixed(0)}px ${ly.toFixed(0)}px, #000 ${Math.max(0, r - 200).toFixed(0)}px, transparent ${r.toFixed(0)}px)`;
    st(el.logo, { opacity: onEnd ? "1" : "0", webkitMaskImage: msk, maskImage: msk, filter: `drop-shadow(0 0 ${(8 + 22 * (1 - rp)).toFixed(1)}px rgba(255, 138, 61, .45))` });
    const e1 = E.outExpo(P(t, C.line, C.line + 0.8)), e2 = E.outExpo(P(t, C.pill, C.pill + 0.8));
    st(el.endL, { opacity: e1.toFixed(3), transform: `translate3d(0, ${((1 - e1) * 24).toFixed(1)}px, 0)` });
    st(el.endP, { opacity: e2.toFixed(3), transform: `translate3d(-50%, ${((1 - e2) * 20).toFixed(1)}px, 0)` });

    grain(t);
    st(el.black, { opacity: Math.max(1 - P(t, 0, 0.15), P(t, DUR - 0.4, DUR - 0.03)).toFixed(3) });
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
      if (!buf && window.CekimAudio) { play.textContent = "…"; actx = new AudioContext(); buf = await window.CekimAudio.render(); }
      from = +scrub.value; t0 = performance.now(); playing = true; play.textContent = "❚❚";
      if (buf) { node = actx.createBufferSource(); node.buffer = buf; node.connect(actx.destination); node.start(0, from); }
      loop();
    };
    scrub.oninput = () => { if (!playing) { renderAt(+scrub.value); tc.textContent = (+scrub.value).toFixed(2); } };
  }
})();
