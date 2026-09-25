/*
 * Rast Creative — cinematic Reel · picture engine
 * ------------------------------------------------------------------
 * Shots come from shots.json (real client footage, pre-cut to JPEG
 * sequences by prepare-reel.mjs). A frame is drawn from at most two shots:
 * the one playing and, inside a transition window, its neighbour.
 *
 * Transitions (key = the incoming shot's `tr`):
 *   flash  exposure blow-out to warm white, cut at the peak
 *   zoom   zoom-through: outgoing punches in, incoming lands from 1.6×
 *   whipL/R  whip pan, both shots on one strip with horizontal motion blur
 *   spin   90° roll-through with blur
 *   lcd    the camera's monitor fills the frame and becomes the next shot
 *   dip    to black and back (the story's pause)
 *   cut    hard cut (montage tail)
 */
(() => {
  "use strict";
  const FPS = 30, DUR = 40;
  const BASE = "/automations/brand-film";
  const $ = (s, r = document) => r.querySelector(s);
  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const P = (t, a, b) => (!(t > a) ? 0 : t >= b ? 1 : (t - a) / (b - a));
  const mix = (a, b, p) => a + (b - a) * p;
  const E = {
    inC: (x) => x ** 3, outC: (x) => 1 - (1 - x) ** 3,
    ioC: (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
    inQ: (x) => x * x, outQ: (x) => 1 - (1 - x) ** 2,
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

  // Half-width of each transition window (seconds either side of the cut).
  const W = { cut: 0, fadein: 0, flash: 0.14, zoom: 0.2, whipL: 0.17, whipR: 0.17, spin: 0.18, lcd: 0.4, dip: 0.45 };

  let SHOTS = [], MAN = {}, VO = [], END = { t: 34.35, d: 5.65 };
  let pending = [];
  const layers = [0, 1, 2].map((i) => ({ el: $("#L" + i), img: $("#L" + i + " img"), blur: $(`#mb${i}s`), src: "" }));
  const photos = {};
  const flash = $("#flash"), leak = $("#leak"), dark = $("#dark"), grain = $("#grain"), bars = $("#bars");
  const tag = $("#tag"), tagText = $("#tag span"), cap = $("#cap"), end = $("#end");

  /* ───────────── one shot into one layer ───────────── */
  function frameSrc(s, lt) {
    const m = MAN[s.id];
    const f = clamp(Math.floor((m.pre + Math.max(-m.pre, lt) * s.sp) * m.fps), 0, m.count - 1) + 1;
    return `${BASE}/.cache/reel/${s.id}/${String(f).padStart(4, "0")}.jpg`;
  }
  function draw(L, s, t, fx) {
    // fx: { x, y, s, r, o, bx, by, bright, blurAll }
    const lt = t - s.t;
    L.el.style.display = "block";
    let src, imgTf;
    if (s.src === "photo") {
      const ph = photos[s.photo];
      src = ph.src;
      const [x0, y0, s0, x1, y1, s1] = s.kb;
      const p = E.ioS(clamp(lt / s.d, 0, 1.15) / 1.15);
      // s10 dives into the camera monitor: the push keeps accelerating through the cut.
      const k = mix(s0, s1, s.tr === "flash" && s.id === "s10" ? E.inC(clamp(lt / s.d, 0, 1.2)) : p) * (1920 / ph.h);
      const fx0 = mix(x0, x1, p), fy0 = mix(y0, y1, p);
      let tx = 540 - fx0 * ph.w * k, ty = 960 - fy0 * ph.h * k;
      tx = Math.min(0, Math.max(1080 - ph.w * k, tx));
      ty = Math.min(0, Math.max(1920 - ph.h * k, ty));
      imgTf = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${k.toFixed(4)})`;
      L.img.className = "photo";
    } else {
      src = frameSrc(s, lt);
      const z = (s.z || 1) * (1 + 0.035 * clamp(lt / Math.max(0.5, s.d)));
      const oy = s.oy ?? 0.5;
      imgTf = `translate(${(540 * (1 - z)).toFixed(1)}px,${(1920 * oy * (1 - z)).toFixed(1)}px) scale(${z.toFixed(4)})`;
      L.img.className = "";
    }
    if (L.src !== src) { L.src = src; L.img.src = src; pending.push(L.img.decode().catch(() => {})); }
    L.img.style.transform = imgTf;
    // Montage cuts land with a small punch.
    const punch = s.id[0] === "m" && s.tr !== "cut" ? 1 + 0.045 * (1 - E.outC(P(lt, 0, 0.22))) : 1;
    const sc = (fx.s ?? 1) * punch;
    L.el.style.transform = `translate3d(${(fx.x || 0).toFixed(1)}px,${(fx.y || 0).toFixed(1)}px,0) rotate(${(fx.r || 0).toFixed(2)}deg) scale(${sc.toFixed(4)})`;
    L.el.style.opacity = String(fx.o ?? 1);
    L.blur.setAttribute("stdDeviation", `${(fx.bx || 0).toFixed(1)} ${(fx.by || 0).toFixed(1)}`);
    const grade = `contrast(1.07) saturate(1.06) brightness(${(fx.bright ?? 1).toFixed(3)})`;
    const mb = (fx.bx || 0) > 0.3 || (fx.by || 0) > 0.3 ? ` url(#mb${layers.indexOf(L)})` : "";
    const ba = fx.blurAll > 0.2 ? ` blur(${fx.blurAll.toFixed(1)}px)` : "";
    L.el.style.filter = grade + mb + ba;
  }

  /* ───────────── transitions ───────────── */
  // u: 0 → 1 across the window, 0.5 = the cut. Returns [fxOut, fxIn].
  function trans(type, u) {
    const a = u < 0.5, v = Math.abs(u - 0.5) * 2; // v: 1 at edges, 0 at the cut
    switch (type) {
      case "flash": {
        const b = 1 + 1.6 * (1 - v) ** 2;
        return [a ? { bright: b } : { o: 0 }, a ? { o: 0 } : { bright: b, s: 1 + 0.06 * (1 - v) }];
      }
      case "zoom": {
        if (a) { const p = E.inC(1 - v); return [{ s: 1 + 0.8 * p, blurAll: 16 * p, bright: 1 + 0.25 * p }, { o: 0 }]; }
        const p = E.outC(1 - v); return [{ o: 0 }, { s: 1.6 - 0.6 * p, blurAll: 16 * (1 - p), bright: 1.25 - 0.25 * p }];
      }
      case "whipL": case "whipR": {
        const dir = type === "whipL" ? -1 : 1;
        const p = E.ioC(u);
        const vel = 1080 * 6 * p * (1 - p); // ∝ derivative of ioC
        return [{ x: dir * 1080 * p, bx: vel * 0.045 }, { x: dir * 1080 * (p - 1), bx: vel * 0.045 }];
      }
      case "spin": {
        if (a) { const p = E.inC(1 - v); return [{ r: 90 * p, s: 1 + 0.5 * p, blurAll: 20 * p }, { o: 0 }]; }
        const p = E.outC(1 - v); return [{ o: 0 }, { r: -90 * (1 - p), s: 1.5 - 0.5 * p, blurAll: 20 * (1 - p) }];
      }
      case "lcd": {
        const p = E.ioS(P(u, 0.25, 0.8));
        return [{ o: 1 - p, blurAll: 6 * p }, { o: p, s: 1.18 - 0.18 * E.outC(u), blurAll: 6 * (1 - p) }];
      }
      case "dip": {
        return [a ? { o: v, blurAll: 10 * (1 - v) } : { o: 0 }, a ? { o: 0 } : { o: E.outC(v), blurAll: 12 * (1 - v) }];
      }
      default:
        return [a ? {} : { o: 0 }, a ? { o: 0 } : {}];
    }
  }

  /* ───────────── overlays ───────────── */
  function drawOverlays(t, cutInfo) {
    // Flash overlay peaks on flash cuts; small leaks on zooms.
    let fl = 0, lk = 0;
    if (cutInfo && cutInfo.type === "flash") fl = (1 - cutInfo.v) ** 2 * 0.92;
    if (cutInfo && (cutInfo.type === "zoom" || cutInfo.type === "spin")) lk = (1 - cutInfo.v) * 0.8;
    // The final blow-out into the end card.
    if (t > 34.0 && t < 35.1) fl = Math.max(fl, t < 34.35 ? E.inQ(P(t, 34.0, 34.35)) : 1 - E.outC(P(t, 34.35, 35.1)));
    flash.style.opacity = fl.toFixed(3);
    leak.style.opacity = lk.toFixed(3);
    leak.style.transform = `translateX(${(Math.sin(t * 3) * 80).toFixed(1)}px)`;
    // Fade in from black; dip-to-black comes from layer opacity.
    dark.style.opacity = (1 - E.outC(P(t, 0, 0.9))).toFixed(3);
    // Letterbox breathes in for the pause, out for the drop.
    const barH = 150 * E.ioS(P(t, 29.8, 30.6)) * (1 - E.ioS(P(t, 33.9, 34.35)));
    bars.style.setProperty("--bar", barH.toFixed(1) + "px");
    const g = rng(Math.floor(t * 12) + 3);
    grain.style.backgroundPosition = `${Math.round(g() * 256)}px ${Math.round(g() * 256)}px`;
  }

  function drawTag(t, s) {
    if (!s || !s.tag || t > END.t) { tag.style.opacity = "0"; return; }
    const lt = t - s.t;
    const o = E.outC(P(lt, 0.15, 0.45)) * (1 - E.inC(P(lt, s.d - 0.35, s.d - 0.08)));
    if (tagText.textContent !== s.tag) tagText.textContent = s.tag;
    tag.style.opacity = o.toFixed(3);
    tag.style.transform = `translateX(${((1 - E.outC(P(lt, 0.15, 0.6))) * -30).toFixed(1)}px)`;
  }

  /* ───────────── captions (voice-over, word by word) ───────────── */
  let capLines = [];
  function buildCaptions() {
    capLines = VO.filter((l) => l.start < END.t - 0.2).map((l) => {
      const clean = l.text.replace(/…/g, "").replace(/\s+/g, " ").trim();
      const words = clean.split(" ");
      const total = words.reduce((a, w) => a + w.length + 1, 0);
      let acc = 0;
      const t0 = l.start; // speech starts at `start` (leading silence is trimmed in the mix)
      const ws = words.map((w) => {
        const a = t0 + (acc / total) * l.speech;
        acc += w.length + 1;
        return { w, a, b: t0 + (acc / total) * l.speech };
      });
      return { t0, t1: t0 + l.speech + 0.4, ws };
    });
  }
  let capCur = -1;
  function drawCaptions(t) {
    const i = capLines.findIndex((c) => t >= c.t0 - 0.05 && t < c.t1);
    if (i !== capCur) {
      capCur = i;
      cap.innerHTML = i < 0 ? "" : capLines[i].ws.map((x) => `<span class="w">${x.w}</span>`).join(" ");
    }
    if (i < 0) return;
    const c = capLines[i];
    const out = 1 - E.inC(P(t, c.t1 - 0.2, c.t1));
    [...cap.children].forEach((el, k) => {
      const w = c.ws[k];
      const p = E.outExpo(P(t, w.a - 0.06, w.a + 0.18));
      el.style.opacity = (p * out).toFixed(3);
      el.style.transform = `translateY(${((1 - p) * 26).toFixed(1)}px) scale(${mix(0.86, 1, p).toFixed(3)})`;
      el.classList.toggle("on", t >= w.a && t < w.b + 0.08);
    });
  }

  /* ───────────── end card ───────────── */
  let letters = [], DOT = { x: 589.63, y: 568.91 };
  function drawEnd(t) {
    const on = t >= END.t - 0.05;
    end.style.display = on ? "block" : "none";
    if (!on) return;
    const l1 = $("#end .l1"), l2 = $("#end .l2");
    const p1 = E.outExpo(P(t, 34.45, 35.2)), p2 = E.outExpo(P(t, 34.55, 35.45));
    const up = E.ioC(P(t, 36.4, 37.1));
    l1.style.opacity = (p1 * (1 - up * 0.0)).toFixed(3);
    l1.style.transform = `translateY(${((1 - p1) * 40 - up * 300).toFixed(1)}px) scale(${mix(1, 0.62, up).toFixed(3)})`;
    l1.style.filter = `blur(${((1 - p1) * 14).toFixed(1)}px)`;
    l2.style.opacity = p2.toFixed(3);
    l2.style.transform = `translateY(${((1 - p2) * 50 - up * 330).toFixed(1)}px) scale(${mix(1, 0.62, up).toFixed(3)})`;
    l2.style.filter = `blur(${((1 - p2) * 16).toFixed(1)}px)`;
    // Logo: letters rise, the dot lands last — the sun, once more.
    letters.forEach((L1, i) => {
      const p = E.outExpo(P(t, 36.9 + i * 0.045, 37.6 + i * 0.045));
      L1.g.style.opacity = p.toFixed(3);
      L1.g.style.transform = `translate(0px,${((1 - p) * 24).toFixed(1)}px)`;
    });
    const dp = E.outExpo(P(t, 37.35, 37.9));
    const dot = $("#end .dot");
    dot.style.left = 250 + (DOT.x - 220) * (580 / 660) + "px";
    dot.style.top = 1060 + (DOT.y - 340) * (580 / 660) + "px";
    dot.style.opacity = dp.toFixed(3);
    dot.style.transform = `scale(${mix(3, 1, dp).toFixed(3)})`;
    const mp = E.outExpo(P(t, 37.8, 38.6));
    const meta = $("#end .meta");
    meta.style.opacity = mp.toFixed(3);
    meta.style.transform = `translateY(${((1 - mp) * 30).toFixed(1)}px)`;
  }

  /* ───────────── frame ───────────── */
  function renderAt(t) {
    t = clamp(t, 0, DUR - 1e-4);
    layers.forEach((L) => (L.el.style.display = "none"));
    let i = 0;
    for (let k = 0; k < SHOTS.length; k++) if (t >= SHOTS[k].t) i = k;
    const s = SHOTS[i], n = SHOTS[i + 1];
    let cutInfo = null;
    const inEnd = t >= END.t;
    // Which cut is active (the next one, or the one we just passed)?
    const nextB = n ? n.t : END.t, nextW = n ? W[n.tr] || 0 : W.flash;
    const prevW = W[s.tr] || 0;
    if (!inEnd && n && t >= nextB - nextW && nextW > 0) {
      const u = (t - (nextB - nextW)) / (2 * nextW);
      const [fo, fi] = trans(n.tr, u);
      draw(layers[0], s, t, fo);
      draw(layers[1], n, t, fi);
      cutInfo = { type: n.tr, v: Math.abs(u - 0.5) * 2 };
    } else if (!inEnd && i > 0 && t < s.t + prevW && prevW > 0) {
      const u = (t - (s.t - prevW)) / (2 * prevW);
      const [fo, fi] = trans(s.tr, u);
      draw(layers[0], SHOTS[i - 1], t, fo);
      draw(layers[1], s, t, fi);
      cutInfo = { type: s.tr, v: Math.abs(u - 0.5) * 2 };
    } else if (!inEnd) {
      draw(layers[0], s, t, {});
    } else {
      // End card over the last shot, pushed back into a warm dark haze.
      const p = E.outC(P(t, END.t, END.t + 1.2));
      draw(layers[0], SHOTS[SHOTS.length - 1], Math.min(t, SHOTS[SHOTS.length - 1].t + 2.4), { blurAll: 26 * p, bright: mix(1, 0.32, p), s: 1.08 });
    }
    drawOverlays(t, cutInfo);
    drawTag(t, inEnd ? null : s);
    drawCaptions(t);
    drawEnd(t);
  }

  async function init() {
    const J = await (await fetch(`${BASE}/reel/shots.json`)).json();
    SHOTS = J.shots; END = J.end || END;
    MAN = await (await fetch(`${BASE}/.cache/reel/manifest.json`)).json();
    VO = await (await fetch(`${BASE}/.cache/reel/vo-timing.json`)).json();
    buildCaptions();
    await document.fonts.load('800 60px "Inter"');
    await document.fonts.load('600 100px "Fraunces"');
    await document.fonts.load('italic 520 100px "Fraunces"');
    for (const s of SHOTS.filter((x) => x.src === "photo")) {
      const img = new Image();
      img.src = `/src/assets/photos/bts/${s.photo}.jpg`;
      await img.decode();
      photos[s.photo] = { src: img.src, w: img.naturalWidth, h: img.naturalHeight };
    }
    // Logo from the site's own SVG.
    const doc = new DOMParser().parseFromString(await (await fetch("/public/hero/rast-sun-logo.svg")).text(), "image/svg+xml");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "220 340 660 400");
    $("#end .logo").append(svg);
    for (const sh of doc.querySelectorAll("path, polygon, rect, circle")) {
      if (sh.tagName === "circle") { DOT = { x: +sh.getAttribute("cx"), y: +sh.getAttribute("cy") }; continue; }
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "lt");
      const node = document.importNode(sh, true); node.removeAttribute("class");
      g.append(node); svg.append(g);
      letters.push({ g });
    }
    end.style.display = "block";
    letters.forEach((L1) => { const b = L1.g.getBBox(); L1.x = b.x; });
    end.style.display = "none";
    letters.sort((a, b) => a.x - b.x);
    // Grain tile.
    const cv = document.createElement("canvas"); cv.width = cv.height = 256;
    const cx = cv.getContext("2d"), id = cx.createImageData(256, 256), r = rng(11);
    for (let k = 0; k < id.data.length; k += 4) { const v = 128 + (r() - 0.5) * 255; id.data[k] = id.data[k + 1] = id.data[k + 2] = v; id.data[k + 3] = 255; }
    cx.putImageData(id, 0, 0);
    grain.style.backgroundImage = `url(${cv.toDataURL()})`;
  }

  const raf = () => new Promise((r) => requestAnimationFrame(() => r()));
  window.__ready = init();
  window.__meta = { fps: FPS, duration: DUR, width: 1080, height: 1920 };
  window.__render = async (t) => { pending = []; renderAt(t); await Promise.all(pending); await raf(); };

  if (/[?&]preview/.test(location.search)) {
    const ui = $("#ui"), play = $("#play"), scrub = $("#scrub"), tc = $("#tc"), stage = $("#stage");
    ui.style.display = "flex";
    const fit = () => (stage.style.transform = `scale(${Math.min(innerWidth / 1080, (innerHeight - 44) / 1920)})`);
    window.__ready.then(() => { fit(); renderAt(0); });
    addEventListener("resize", fit);
    let playing = false, t0 = 0, from = 0, ctx = null, buf = null, node = null;
    const loop = () => { if (!playing) return; const t = from + (performance.now() - t0) / 1000; if (t >= DUR) { playing = false; return; } renderAt(t); scrub.value = t; tc.textContent = t.toFixed(2); requestAnimationFrame(loop); };
    play.onclick = async () => {
      if (playing) { playing = false; node?.stop(); return; }
      if (!buf && window.ReelAudio) { play.textContent = "…"; ctx = new AudioContext(); buf = await window.ReelAudio.render(); }
      from = +scrub.value; t0 = performance.now(); playing = true; play.textContent = "❚❚";
      if (buf) { node = ctx.createBufferSource(); node.buffer = buf; node.connect(ctx.destination); node.start(0, from); }
      loop();
    };
    scrub.oninput = () => { if (!playing) { renderAt(+scrub.value); tc.textContent = (+scrub.value).toFixed(2); } };
  }
})();
