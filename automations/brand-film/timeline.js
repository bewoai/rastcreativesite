/*
 * Rast Creative — vertical brand film · timeline
 * ------------------------------------------------------------------
 * Every visual property is a pure function of t (seconds). Nothing uses CSS
 * animations or transitions, so a frame rendered in isolation is identical
 * to the same frame during live playback.
 *
 *   window.__ready          Promise — fonts, images, measurements done
 *   window.__render(t)      async — draw frame at t, resolves when decoded
 *   window.__audio()        async — soundtrack as base64 WAV (soundtrack.js)
 *
 * Story (96 BPM, 1 bar = 2.5 s):
 *   I    0.0  Hook       — the feed never stops… some work stops you
 *   II   5.0  Brand      — the sun becomes the dot in "ra.st"
 *   III 10.0  Story      — not an agency chain; one team, founders on the call
 *   IV  17.5  Process    — idea → set → edit → delivery, 2–4 weeks
 *   V   27.4  Frames     — one set day, 16:9 / 4:5 / 9:16
 *   VI  35.0  Services   — production, strategy, post
 *   VII 42.4  Work       — real clips, 15+ brands, 100+ pieces, logo board
 *   VIII 50.1 Region     — Serdivan / Sakarya and the on-site area
 *   IX  55.0  Manifesto  — "İyi iş kendini izletir." → free first meeting
 */
(() => {
  "use strict";

  const FPS = 30;
  const DUR = 65;
  const CLIPS = "/automations/brand-film/.cache/clips";
  const NS = "http://www.w3.org/2000/svg";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ───────────── math ───────────── */
  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const P = (t, a, b) => (!(t > a) ? 0 : t >= b ? 1 : (t - a) / (b - a));
  const mix = (a, b, p) => a + (b - a) * p;
  const E = {
    lin: (x) => x,
    inQ: (x) => x * x,
    outQ: (x) => 1 - (1 - x) ** 2,
    inC: (x) => x ** 3,
    outC: (x) => 1 - (1 - x) ** 3,
    ioC: (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
    outQuint: (x) => 1 - (1 - x) ** 5,
    ioQuint: (x) => (x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2),
    outExpo: (x) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x)),
    inExpo: (x) => (x <= 0 ? 0 : 2 ** (10 * x - 10)),
    ioExpo: (x) =>
      x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 2 ** (20 * x - 10) / 2 : (2 - 2 ** (-20 * x + 10)) / 2,
    outBack: (x) => {
      const c1 = 1.6, c3 = c1 + 1;
      return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2;
    },
    ioS: (x) => -(Math.cos(Math.PI * x) - 1) / 2,
  };
  /** Tween v0→v1 across [a,b]. */
  const tw = (t, a, b, v0, v1, e = E.ioC) => mix(v0, v1, e(P(t, a, b)));
  /** Keyframes [[t, v, ease?], …]; ease belongs to the segment ending at that key. */
  function kf(t, keys) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) {
      const [t1, v1, e] = keys[i];
      if (t <= t1) {
        const [t0, v0] = keys[i - 1];
        return mix(v0, v1, (e || E.ioC)(P(t, t0, t1)));
      }
    }
    return keys[keys.length - 1][1];
  }
  /** Keyframes of objects — every numeric field interpolated together. */
  function kfo(t, keys) {
    if (t <= keys[0][0]) return { ...keys[0][1] };
    for (let i = 1; i < keys.length; i++) {
      const [t1, v1, e] = keys[i];
      if (t <= t1) {
        const [t0, v0] = keys[i - 1];
        const p = (e || E.ioC)(P(t, t0, t1));
        const o = {};
        for (const k in v1) o[k] = mix(v0[k], v1[k], p);
        return o;
      }
    }
    return { ...keys[keys.length - 1][1] };
  }
  /** Seeded PRNG so "random" details are identical on every render. */
  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ───────────── style ───────────── */
  function st(el, o) {
    const x = o.x ?? 0, y = o.y ?? 0, s = o.s ?? 1, r = o.r ?? 0;
    const sx = (o.sx ?? 1) * s, sy = (o.sy ?? 1) * s;
    let tr = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
    if (r) tr += ` rotate(${r.toFixed(3)}deg)`;
    if (sx !== 1 || sy !== 1) tr += ` scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    el.style.transform = tr;
    if (o.o !== undefined) {
      const op = clamp(o.o);
      el.style.opacity = op.toFixed(4);
      el.style.visibility = op < 0.003 ? "hidden" : "visible";
    }
    if (o.blur !== undefined || o.bright !== undefined) {
      let f = "";
      if (o.blur > 0.08) f += `blur(${o.blur.toFixed(2)}px) `;
      if (o.bright !== undefined && Math.abs(o.bright - 1) > 0.002) f += `brightness(${o.bright.toFixed(3)})`;
      el.style.filter = f || "none";
    }
  }
  const show = (el, on) => { el.style.display = on ? "block" : "none"; };

  /** Wrap every word of an element (keeping <em>/<br>) in span.w. */
  function splitWords(root) {
    const out = [];
    const walk = (node) => {
      for (const ch of [...node.childNodes]) {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          for (const part of ch.textContent.split(/(\s+)/)) {
            if (!part) continue;
            if (/^\s+$/.test(part)) frag.append(document.createTextNode(" "));
            else {
              const s = document.createElement("span");
              s.className = "w";
              s.textContent = part;
              frag.append(s);
              out.push(s);
            }
          }
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1 && ch.tagName !== "BR" && !ch.classList.contains("w")) walk(ch);
      }
    };
    walk(root);
    return out;
  }
  /** Words rising out of the fog: focus-pull + lift, staggered. */
  function rise(words, t, t0, { stagger = 0.07, dur = 0.8, dy = 60, blur = 14, out = Infinity, outDur = 0.45, outDy = -50 } = {}) {
    words.forEach((w, i) => {
      const p = E.outExpo(P(t, t0 + i * stagger, t0 + i * stagger + dur));
      const q = E.inC(P(t, out + i * 0.025, out + i * 0.025 + outDur));
      st(w, { y: (1 - p) * dy + q * outDy, o: Math.min(p * 1.4, 1) * (1 - q), blur: (1 - p) * blur + q * 12 });
    });
  }
  /** Generic element in/out: fade + lift + focus. */
  function io(el, t, a, b, { din = 0.7, dout = 0.5, dy = 50, outDy = -50, blur = 12, s0 = 1, x0 = 0, ease = E.outExpo } = {}) {
    const p = ease(P(t, a, a + din));
    const q = E.inC(P(t, b - dout, b));
    st(el, { x: (1 - p) * x0, y: (1 - p) * dy + q * outDy, s: mix(s0, 1, p), o: p * (1 - q), blur: (1 - p) * blur + q * blur });
    return p * (1 - q);
  }

  /* ───────────── image sequences (real project footage) ───────────── */
  let pending = [];
  let manifest = {};
  class Seq {
    constructor(img, id, offset = 0) { this.img = img; this.id = id; this.offset = offset; this.f = -1; }
    at(local) {
      const n = manifest[this.id] || 1;
      const f = clamp(Math.floor((local + this.offset) * FPS), 0, n - 1) + 1;
      if (f === this.f) return;
      this.f = f;
      this.img.src = `${CLIPS}/${this.id}/${String(f).padStart(4, "0")}.jpg`;
      pending.push(this.img.decode().catch(() => {}));
    }
  }

  /* ───────────── elements ───────────── */
  const stage = $("#stage");
  const L = {}; // measured layout, filled in init()

  // World
  const fogSky = $("#fog .sky");
  const cloudA = $("#cloudA"), cloudB = $("#cloudB");
  const night = $("#night"), flash = $("#flash"), grain = $("#grain");
  const sun = $("#sun");
  const sunL = $("#sun .light"), sunH = $("#sun .halo"), sunO = $("#sun .orb"), sunC = $("#sun .core"), sunB = $("#sun .bloom");
  const logo = $("#logo");

  // Scene registry: [id, start, end, fn]
  const scenes = [];
  const scene = (id, a, b, fn) => scenes.push({ el: $("#" + id), a, b, fn });

  /* ═════════════════════════ I · HOOK ═════════════════════════ */
  const STEP = 1300, HERO = 6;
  const feedWrap = document.createElement("div");
  feedWrap.className = "full";
  const feed = $("#feed");
  $("#s1").prepend(feedWrap);
  feedWrap.append(feed);
  const cards = [];
  let heroSeq, heroMd, heroHd, heroFt;
  for (let i = 0; i < 9; i++) {
    const c = document.createElement("div");
    c.className = "card" + (i === HERO ? " hero" : "");
    c.style.top = 340 + i * STEP + "px";
    c.innerHTML = `<div class="hd"><span class="av"></span><span class="l1"></span><span class="l2"></span></div><div class="md"></div><div class="ft"><span></span><span></span><span></span><span></span></div>`;
    if (i !== HERO) {
      const r = rng(i * 13 + 5);
      const hue = [18, 28, 200, 330, 40, 160, 260, 12, 190][i];
      const md = $(".md", c);
      md.style.background = `radial-gradient(60% 45% at ${20 + r() * 60}% ${25 + r() * 40}%, hsla(${hue},45%,55%,.55), transparent 70%), radial-gradient(50% 40% at ${20 + r() * 60}% ${50 + r() * 40}%, hsla(${hue + 40},35%,45%,.45), transparent 70%), linear-gradient(${Math.round(r() * 360)}deg, hsl(${hue},18%,16%), hsl(${hue + 20},14%,24%))`;
      const t1 = document.createElement("div");
      Object.assign(t1.style, { position: "absolute", left: "56px", bottom: "70px", width: 300 + r() * 300 + "px", height: "34px", borderRadius: "17px", background: "rgba(255,255,255,.22)" });
      const t2 = t1.cloneNode();
      Object.assign(t2.style, { bottom: "122px", width: 180 + r() * 240 + "px", height: "34px", background: "rgba(255,255,255,.3)" });
      md.append(t1, t2);
    }
    if (i === HERO) {
      const img = document.createElement("img");
      img.alt = "";
      $(".md", c).append(img);
      heroSeq = new Seq(img, "hook");
      heroMd = $(".md", c); heroHd = $(".hd", c); heroFt = $(".ft", c);
      c.style.transformOrigin = "440px 625px";
    }
    feed.append(c);
    cards.push(c);
  }
  const hw = $$("#s1 .hw");
  [124, 146, 176].forEach((px, i) => (hw[i].style.fontSize = px + "px"));
  const stopWords = splitWords($("#s1 .stop"));
  const blurStd = $("#mblurStd");

  const scrollAt = (t) =>
    kf(t, [
      [0, 0], [0.62, 46, E.lin], [1.1, STEP, E.outC], [1.25, STEP + 18, E.lin],
      [1.73, 2 * STEP, E.outC], [1.875, 2 * STEP + 18, E.lin], [2.36, 3 * STEP, E.outC],
      [2.5, 3 * STEP + 14, E.lin], [3.5, HERO * STEP, E.outQuint],
    ]);

  scene("s1", 0, 5.05, (t) => {
    const sc = scrollAt(t);
    const v = sc - scrollAt(t - 1 / FPS);
    const std = Math.min(46, Math.abs(v) * 0.3);
    blurStd.setAttribute("stdDeviation", `0 ${std.toFixed(2)}`);
    feedWrap.style.filter = std > 0.4 ? "url(#mblur)" : "none";
    st(feed, { y: -sc });

    const settle = E.ioC(P(t, 3.15, 3.8));
    const zoom = E.inQ(P(t, 4.2, 5.02));
    cards.forEach((c, i) => {
      const center = 960 + i * STEP - sc;
      const onScreen = center > -700 && center < 2620;
      show(c, onScreen);
      if (!onScreen) return;
      if (i !== HERO) {
      const r = rng(i * 13 + 5);
      const hue = [18, 28, 200, 330, 40, 160, 260, 12, 190][i];
      const md = $(".md", c);
      md.style.background = `radial-gradient(60% 45% at ${20 + r() * 60}% ${25 + r() * 40}%, hsla(${hue},45%,55%,.55), transparent 70%), radial-gradient(50% 40% at ${20 + r() * 60}% ${50 + r() * 40}%, hsla(${hue + 40},35%,45%,.45), transparent 70%), linear-gradient(${Math.round(r() * 360)}deg, hsl(${hue},18%,16%), hsl(${hue + 20},14%,24%))`;
      const t1 = document.createElement("div");
      Object.assign(t1.style, { position: "absolute", left: "56px", bottom: "70px", width: 300 + r() * 300 + "px", height: "34px", borderRadius: "17px", background: "rgba(255,255,255,.22)" });
      const t2 = t1.cloneNode();
      Object.assign(t2.style, { bottom: "122px", width: 180 + r() * 240 + "px", height: "34px", background: "rgba(255,255,255,.3)" });
      md.append(t1, t2);
    }
    if (i === HERO) {
        st(c, { s: mix(1, 2.55, zoom), y: zoom * -40 });
      } else {
        st(c, { o: mix(1, 0.14, settle) * (1 - zoom), blur: settle * 6 });
      }
    });
    heroHd.style.opacity = heroFt.style.opacity = String(1 - E.outC(P(t, 4.2, 4.5)));
    heroMd.style.borderRadius = mix(0, 30, zoom) + "px";
    heroSeq.at(Math.max(0, t - 2.75));

    // "Kaydır. Kaydır. Kaydır." — one per beat, escalating.
    [0.62, 1.245, 1.87].forEach((tb, i) => {
      const p = P(t, tb, tb + 0.24);
      const q = E.inC(P(t, 2.4 + i * 0.04, 2.72 + i * 0.04));
      st(hw[i], { s: mix(1.45, 1, E.outC(p)), o: Math.min(1, p * 3) * (1 - q), y: q * -70, blur: (1 - E.outC(p)) * 10 + q * 16 });
    });
    rise(stopWords, t, 3.3, { stagger: 0.12, dur: 0.9, dy: 50, blur: 16, out: 4.28, outDur: 0.35, outDy: -30 });
  });

  /* ═════════════════════════ II · BRAND ═════════════════════════ */
  const place2 = $("#s2 .place");
  const tag2 = $("#s2 .tag");
  const tagLines = $$("#s2 .tag i");
  scene("s2", 4.9, 10.2, (t) => {
    io(place2, t, 5.7, 7.3, { dy: 30 });
    const p = io(tag2, t, 8.45, 9.95, { dy: 30, din: 0.9 });
    const lp = E.outExpo(P(t, 8.7, 9.4));
    tagLines.forEach((i) => (i.style.transform = `scaleX(${lp.toFixed(3)})`));
    return p;
  });

  // Logo: built once from the site's own SVG, letters animated one by one.
  let letters = [], DOT = { x: 589.63, y: 568.91 };
  const LOGO_BOX = { x: 160, y: 650, s: 760 / 660 };
  const dotStage = () => ({ x: LOGO_BOX.x + (DOT.x - 220) * LOGO_BOX.s, y: LOGO_BOX.y + (DOT.y - 340) * LOGO_BOX.s });
  function drawLogo(t) {
    const inS2 = t >= 7.0 && t < 10.2;
    const inEnd = t >= 62.6;
    show(logo, inS2 || inEnd);
    if (!inS2 && !inEnd) return;
    const t0 = inS2 ? 7.25 : 62.95;
    const exitAt = inS2 ? 9.3 : Infinity;
    letters.forEach((L1) => {
      const q = E.inC(P(t, exitAt + L1.order * 0.02, exitAt + L1.order * 0.02 + 0.45));
      if (L1.top) {
        const p = E.outExpo(P(t, t0 + L1.delay, t0 + L1.delay + 0.95));
        const dx = (DOT.x - L1.cx) * (1 - p) * 0.9;
        const dy = (DOT.y - L1.cy) * (1 - p) * 0.9;
        L1.g.style.transform = `translate(${dx.toFixed(2)}px,${(dy - q * 34).toFixed(2)}px) scale(${mix(0.35, 1, p).toFixed(4)})`;
        L1.g.style.opacity = (Math.min(1, p * 1.6) * (1 - q)).toFixed(4);
      } else {
        const d = 0.55 + L1.order * 0.055;
        const p = E.outExpo(P(t, t0 + d, t0 + d + 0.8));
        L1.g.style.transform = `translate(0px,${((1 - p) * 30 - q * 34).toFixed(2)}px)`;
        L1.g.style.opacity = (p * (1 - q)).toFixed(4);
      }
    });
  }

  /* ═════════════════════════ III · STORY ═════════════════════════ */
  const s3 = {
    label: $("#s3 .label"),
    l1: $("#s3l1"), l2: $("#s3l2"), k1: $("#s3k1"), k2: $("#s3k2"),
    big: $("#s3big"), sw: $("#s3swp"), after: $("#s3after"),
    f1: $("#f1"), f2: $("#f2"), c: $("#s3c"),
  };
  s3.w1 = splitWords(s3.l1);
  s3.w2 = splitWords(s3.l2);
  s3.wb = splitWords(s3.big);
  s3.wa = splitWords(s3.after);
  s3.wc = splitWords(s3.c);
  const ink = [29, 25, 21], mute = [150, 138, 124];
  const rgb = (a, b, p) => `rgb(${a.map((v, i) => Math.round(mix(v, b[i], p))).join(",")})`;

  scene("s3", 9.95, 17.7, (t) => {
    io(s3.label, t, 10.1, 17.6, { dy: 20, blur: 6 });
    const OUT = 14.25;
    rise(s3.w1, t, 10.25, { stagger: 0.07, out: OUT });
    rise(s3.w2, t, 11.2, { stagger: 0.07, out: OUT + 0.05 });
    [[s3.k1, s3.l1, 10.95, "k1"], [s3.k2, s3.l2, 11.9, "k2"]].forEach(([k, l, ts, key]) => {
      const p = E.outC(P(t, ts, ts + 0.35));
      const q = E.inC(P(t, OUT, OUT + 0.45));
      k.style.transform = `translateY(${(q * -50).toFixed(1)}px) scaleX(${p.toFixed(4)})`;
      k.style.opacity = String(1 - q);
      l.style.color = rgb(ink, mute, E.outC(P(t, ts + 0.1, ts + 0.5)));
    });
    rise(s3.wb, t, 12.35, { stagger: 0.1, dur: 0.9, dy: 80, blur: 18, out: OUT + 0.12 });
    const sw = E.ioC(P(t, 13.0, 13.45));
    const swq = E.inC(P(t, OUT + 0.15, OUT + 0.5));
    s3.sw.style.strokeDashoffset = String(L.swLen * (1 - sw));
    s3.sw.style.opacity = String(1 - swq);
    rise(s3.wa, t, 13.3, { stagger: 0.05, dur: 0.8, dy: 30, blur: 10, out: OUT + 0.2 });

    // Founders
    const fl = Math.sin(t * 1.3) * 5;
    [[s3.f1, 14.6, -1], [s3.f2, 14.78, 1]].forEach(([f, ts, side]) => {
      const p = E.outExpo(P(t, ts, ts + 1.1));
      const q = E.inC(P(t, 17.0 + (side > 0 ? 0.05 : 0), 17.55));
      st(f, {
        x: q * side * 260,
        y: (1 - p) * 520 + fl * side,
        r: side * mix(10, 2.5, p) + q * side * 8,
        o: Math.min(1, p * 2) * (1 - q),
      });
      st($(".ph img", f), { s: mix(1.14, 1.0, E.outC(P(t, ts, 17.6))) });
    });
    rise(s3.wc, t, 15.45, { stagger: 0.06, dur: 0.8, dy: 40, blur: 12, out: 16.95 });
  });

  /* ═════════════════════════ IV · PROCESS ═════════════════════════ */
  const STAGES = [
    { n: "I", when: "1. hafta", h: "Fikir & plan", p: "İhtiyacı dinliyor, hangi formatların gerekeceğine baştan karar veriyoruz." },
    { n: "II", when: "1–2. hafta", h: "Set", p: "Yerinde, tek ekip. Ana film, dikey kesitler ve drone planı aynı sette." },
    { n: "III", when: "2–4. hafta", h: "Kurgu, renk, ses", p: "Hepsi aynı masada. Revizyonları projeyi çeken ekiple konuşursunuz." },
    { n: "IV", when: "Teslim", h: "Teslim", p: "16:9 ana film, 9:16 dikey versiyonlar ve reklam kesitleri; her mecraya hazır." },
  ];
  const B = [18.35, 20.45, 22.55, 24.65, 26.9];
  const BLOCKS = [["FİKİR", 0, 22], ["SET", 22, 45], ["KURGU", 45, 84], ["TESLİM", 84, 100]];
  const s4 = {
    label: $("#s4 .label"), title: $("#s4t"), card: $("#s4card"), tl: $("#s4tl"),
    shots: $$("#s4media .shot"), num: $("#s4num"), when: $("#s4when"),
    txt: $("#s4txt"), h: $("#s4txt h3"), p: $("#s4txt p"), head: $("#s4head"), total: $("#s4total"),
    files: $$("#s4files .file"),
  };
  s4.tw = splitWords(s4.title);
  const track = $("#s4track");
  const blockEls = BLOCKS.map(([name, a, b]) => {
    const el = document.createElement("div");
    el.className = "blk";
    el.style.left = a * 8.4 + 4 + "px";
    el.style.width = (b - a) * 8.4 - 8 + "px";
    el.innerHTML = `<div class="fill"></div><span>${name}</span>`;
    track.append(el);
    return { el, fill: $(".fill", el), a, b };
  });
  const wave = $("#s4wave");
  const waveBars = [];
  {
    const r = rng(7);
    for (let i = 0; i < 64; i++) {
      const b = document.createElement("b");
      const x = 4 + i * (832 / 64);
      b.style.left = x + "px";
      b.style.height = 8 + Math.round((0.35 + 0.65 * Math.abs(Math.sin(i * 0.45))) * r() * 32) + "px";
      wave.append(b);
      waveBars.push({ b, x });
    }
  }
  // Check marks on the delivery tiles.
  s4.files.forEach((f) => {
    const ok = document.createElement("span");
    ok.className = "ok";
    ok.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const th = $(".th", f);
    ok.style.left = parseFloat(th.style.width) - 30 + "px";
    ok.style.bottom = parseFloat(th.style.height) + 30 + "px";
    f.append(ok);
    f._ok = ok;
  });
  const pctAt = (t) => kf(t, [[B[0], 0], [B[1], 22, E.ioS], [B[2], 45, E.ioS], [B[3], 84, E.ioS], [B[4] - 0.6, 100, E.ioS]]);
  let s4idx = -1;

  scene("s4", 17.4, 27.7, (t) => {
    const OUT = 26.95;
    io(s4.label, t, 17.5, OUT + 0.6, { dy: 20, blur: 6 });
    rise(s4.tw, t, 17.6, { stagger: 0.08, dur: 0.9, dy: 70, blur: 16, out: OUT });
    st(s4.card, { y: tw(t, 17.9, 18.7, 160, 0, E.outExpo) + E.inC(P(t, OUT + 0.08, OUT + 0.6)) * -90, o: E.outC(P(t, 17.9, 18.4)) * (1 - E.inC(P(t, OUT + 0.08, OUT + 0.6))) });
    st(s4.tl, { y: tw(t, 18.1, 18.9, 160, 0, E.outExpo) + E.inC(P(t, OUT + 0.16, OUT + 0.65)) * -90, o: E.outC(P(t, 18.1, 18.6)) * (1 - E.inC(P(t, OUT + 0.16, OUT + 0.65))) });

    let k = 0;
    for (let i = 0; i < 4; i++) if (t >= B[i]) k = i;
    if (k !== s4idx) {
      s4idx = k;
      s4.h.textContent = STAGES[k].h;
      s4.p.textContent = STAGES[k].p;
      s4.num.textContent = STAGES[k].n;
      s4.when.textContent = STAGES[k].when;
    }
    // Media: each stage slides over the previous one.
    s4.shots.forEach((sh, i) => {
      const p = i === 0 ? 1 : E.ioC(P(t, B[i] - 0.25, B[i] + 0.35));
      const push = P(t, B[i] - 0.25, (B[i + 1] ?? 27) + 0.3);
      st(sh, { x: (1 - p) * 120, o: p, s: i === 3 ? 1 : mix(1.1, 1.0, E.outC(push)) });
    });
    // Text focus-pull between stages.
    const nextB = B.find((b) => b > t) ?? 99;
    const outP = E.inC(P(t, nextB - 0.25, nextB));
    const inP = E.outC(P(t, B[k] + 0.03, B[k] + 0.5));
    const tp = k === 0 ? E.outC(P(t, 18.4, 18.9)) : inP;
    st(s4.txt, { y: (1 - tp) * 18 - outP * 14, o: tp * (1 - (nextB < 26 ? outP : 0)), blur: (1 - tp) * 10 + (nextB < 26 ? outP * 10 : 0) });
    // Numeral + week chip flip at each boundary.
    const flip = Math.min(...B.slice(1, 4).map((b) => Math.abs(t - b)));
    const fs = clamp(flip / 0.16);
    st(s4.num, { sy: E.outC(fs) });
    st(s4.when, { sy: E.outC(fs), o: 1 - E.outC(P(t, B[3] - 0.15, B[3])) });
    // Delivery tiles.
    s4.files.forEach((f, i) => {
      const p = E.outExpo(P(t, B[3] + 0.2 + i * 0.14, B[3] + 0.9 + i * 0.14));
      st(f, { y: (1 - p) * 40, o: p });
      const q = E.outBack(P(t, B[3] + 0.85 + i * 0.16, B[3] + 1.25 + i * 0.16));
      st(f._ok, { s: Math.max(0, q), o: clamp(q * 2) });
    });
    // Timeline.
    const pct = pctAt(t);
    const hx = 40 + pct * 8.4;
    s4.head.style.left = hx.toFixed(2) + "px";
    blockEls.forEach((b) => {
      b.fill.style.transform = `scaleX(${clamp((pct - b.a) / (b.b - b.a)).toFixed(4)})`;
    });
    waveBars.forEach((w) => w.b.classList.toggle("on", w.x + 40 < hx));
    const tp2 = E.outBack(P(t, 26.25, 26.75));
    st(s4.total, { s: Math.max(0, mix(0.6, 1, tp2)), o: clamp(tp2 * 2) * (1 - E.inC(P(t, OUT + 0.2, OUT + 0.7))), y: E.inC(P(t, OUT + 0.2, OUT + 0.7)) * -60 });
  });

  /* ═════════════════════════ V · ONE SET, MANY FRAMES ═════════════════════════ */
  const V = { x: 60, y: 610, w: 960, h: 540 };
  const G = {
    a: { x: 14, y: 14, w: 932, h: 512 },
    b: { x: 384 - 216, y: 0, w: 432, h: 540 },
    c: { x: 384 - 152, y: 0, w: 304, h: 540 },
  };
  const CROPS = { a: { x: 0, y: 0, w: 960, h: 540 }, b: G.b, c: G.c };
  const OUTS = [
    { el: $("#o1"), crop: "a", to: { x: 100, y: 1334, w: 420, h: 236 }, t: 31.85 },
    { el: $("#o2"), crop: "b", to: { x: 560, y: 1280, w: 232, h: 290 }, t: 31.7 },
    { el: $("#o3"), crop: "c", to: { x: 832, y: 1271, w: 168, h: 299 }, t: 31.55 },
  ];
  const s5 = {
    label: $("#s5 .label"), title: $("#s5t"), v: $("#s5v"), g: $("#s5g"), f: $("#s5f"),
    fb: $("#s5f b"), fs: $("#s5f span"), sh: $("#s5sh"), x: $$("#s5x .chip"),
  };
  s5.tw = splitWords(s5.title);
  s5.v.style.left = V.x + "px"; s5.v.style.top = V.y + "px";
  // Rule-of-thirds lines inside the guide.
  $$("i", s5.g).forEach((i, n) => {
    Object.assign(i.style, n < 2
      ? { left: (n + 1) * 33.333 + "%", top: 0, bottom: 0, width: "1.5px" }
      : { top: (n - 1) * 33.333 + "%", left: 0, right: 0, height: "1.5px" });
  });
  const rectMix = (r0, r1, p) => ({ x: mix(r0.x, r1.x, p), y: mix(r0.y, r1.y, p), w: mix(r0.w, r1.w, p), h: mix(r0.h, r1.h, p) });
  const FORMATS = [["16:9", "Ana film"], ["4:5", "Feed"], ["9:16", "Reels"]];
  let s5fmt = -1;

  scene("s5", 27.3, 35.25, (t) => {
    const OUT = 34.55;
    io(s5.label, t, 27.45, OUT + 0.6, { dy: 20, blur: 6 });
    rise(s5.tw, t, 27.55, { stagger: 0.09, dur: 0.9, dy: 70, blur: 16, out: OUT });
    const vp = E.outExpo(P(t, 27.8, 28.7));
    const vq = E.inC(P(t, OUT + 0.1, OUT + 0.6));
    st(s5.v, { y: (1 - vp) * 80 - vq * 80, s: mix(0.92, 1, vp) * mix(1, 1.012, P(t, 28.7, 34.5)), o: vp * (1 - vq) });

    const m1 = E.ioExpo(P(t, 29.25, 29.9));
    const m2 = E.ioExpo(P(t, 30.4, 31.05));
    const g = rectMix(rectMix(G.a, G.b, m1), G.c, m2);
    Object.assign(s5.g.style, { left: g.x + "px", top: g.y + "px", width: g.w + "px", height: g.h + "px" });
    const gp = E.outC(P(t, 28.3, 28.7));
    const gq = E.inC(P(t, 31.5, 31.8));
    s5.g.style.opacity = String(gp * (1 - gq));
    const fi = t < 29.575 ? 0 : t < 30.725 ? 1 : 2;
    if (fi !== s5fmt) { s5fmt = fi; s5.fb.textContent = FORMATS[fi][0]; s5.fs.textContent = FORMATS[fi][1]; }
    const flip = Math.min(Math.abs(t - 29.575), Math.abs(t - 30.725));
    st(s5.f, { x: g.x + 20, y: g.y + 20, sy: E.outC(clamp(flip / 0.15)), o: E.outC(P(t, 28.45, 28.8)) * (1 - gq) });

    OUTS.forEach((o) => {
      const p = E.ioExpo(P(t, o.t, o.t + 0.75));
      const from = { x: V.x + CROPS[o.crop].x, y: V.y + CROPS[o.crop].y, w: CROPS[o.crop].w, h: CROPS[o.crop].h };
      const r = rectMix(from, o.to, p);
      const k = r.w / CROPS[o.crop].w;
      Object.assign(o.el.style, {
        left: r.x + "px", top: r.y + "px", width: r.w + "px", height: r.h + "px",
        backgroundSize: `${960 * k}px ${540 * k}px`,
        backgroundPosition: `${-CROPS[o.crop].x * k}px ${-CROPS[o.crop].y * k}px`,
      });
      const q = E.inC(P(t, OUT + 0.2, OUT + 0.65));
      st(o.el, { y: q * -60, o: clamp(P(t, o.t, o.t + 0.12)) * (1 - q) });
    });
    const shp = P(t, 32.55, 32.95);
    s5.sh.style.opacity = String(shp < 0.2 ? shp * 4.5 : (1 - shp) * 1.1);
    s5.x.forEach((c, i) => {
      const p = E.outBack(P(t, 32.3 + i * 0.4, 32.75 + i * 0.4));
      const q = E.inC(P(t, OUT + 0.1, OUT + 0.5));
      st(c, { s: Math.max(0, mix(0.6, 1, p)), o: clamp(p * 2) * (1 - q), y: q * -40 });
    });
  });

  /* ═════════════════════════ VI · SERVICES ═════════════════════════ */
  const s6 = { label: $("#s6 .label"), title: $("#s6t"), meta: $("#s6m"), cards: ["#c1", "#c2", "#c3"].map((s) => $(s)) };
  s6.tw = splitWords(s6.title);
  s6.cards.forEach((c) => {
    c._chips = $$(".chip", c);
    c._paths = $$(".ic svg > *", c).map((p) => ({ p, len: 0 })); // lengths measured in init()
    c._glint = $(".glint", c);
  });
  scene("s6", 34.9, 42.4, (t) => {
    const OUT = 41.55;
    io(s6.label, t, 35.0, OUT + 0.6, { dy: 20, blur: 6 });
    rise(s6.tw, t, 35.05, { stagger: 0.08, dur: 0.9, dy: 70, blur: 16, out: OUT });
    io(s6.meta, t, 35.55, OUT + 0.5, { dy: 20, blur: 6 });
    s6.cards.forEach((c, i) => {
      const ts = 35.75 + i * 0.5;
      const p = E.outExpo(P(t, ts, ts + 0.9));
      const q = E.inC(P(t, OUT + i * 0.07, OUT + 0.5 + i * 0.07));
      const focus = Math.sin(clamp(P(t, 38.7 + i * 0.95, 39.6 + i * 0.95)) * Math.PI);
      st(c, { x: (1 - p) * 220, y: q * 80 + Math.sin(t * 1.1 + i) * 3, s: 1 + focus * 0.02, o: Math.min(1, p * 1.5) * (1 - q) });
      c._paths.forEach(({ p: path, len }, j) => {
        path.style.strokeDashoffset = String(len * (1 - E.ioC(P(t, ts + 0.3 + j * 0.08, ts + 1.1 + j * 0.08))));
      });
      c._chips.forEach((ch, j) => {
        const cp = E.outBack(P(t, ts + 0.45 + j * 0.08, ts + 0.85 + j * 0.08));
        st(ch, { s: Math.max(0, mix(0.7, 1, cp)), o: clamp(cp * 2) });
      });
      const fs0 = 38.7 + i * 0.95;
      const gl = t < fs0 ? P(t, ts + 0.5, ts + 1.4) : P(t, fs0, fs0 + 0.9);
      c._glint.style.setProperty("--gx", mix(-150, 360, E.ioS(gl)).toFixed(1) + "%");
    });
  });

  /* ═════════════════════════ VII · WORK (dark) ═════════════════════════ */
  const wall = $("#wall");
  const wallSlots = [];
  {
    const cols = [
      ["w12", "w08", "w03", "w11", "w06"],
      ["w01", "w04", "w07", "w10", "w02"],
      ["w06", "w03", "w12", "w05", "w08"],
      ["w09", "w11", "w02", "w07", "w05"],
      ["w10", "w01", "w09", "w04", "w12"],
    ];
    const r = rng(42);
    cols.forEach((ids, ci) => {
      const col = document.createElement("div");
      col.className = "col";
      col.style.left = -165 + (ci - 2) * 356 + "px";
      ids.forEach((id, i) => {
        const cl = document.createElement("div");
        cl.className = "clip";
        cl.style.top = i * 613 + "px";
        const img = document.createElement("img");
        img.alt = "";
        cl.append(img);
        col.append(cl);
        wallSlots.push(new Seq(img, id, r() * 0.4));
      });
      col._dir = ci % 2 ? 1 : -1;
      col._base = ci % 2 ? -1760 + ci * 30 : -1330 + ci * 40;
      wall.append(col);
    });
  }
  const wallCols = $$("#wall .col");
  const s7 = {
    label: $("#s7 .label"), scrim: $("#s7scrim"), n1: $("#n1"), n2: $("#n2"),
    v1: $("#n1 span"), v2: $("#n2 span"), sub: $("#s7sub"), lt: $("#s7lt"),
  };
  s7.sw = splitWords(s7.sub);
  s7.lw = splitWords(s7.lt);
  // Logo board: the brands on the live site's "Markalar" plate.
  const LOGOS = [
    ["aytashome.png", "sil"], ["levha/chint.png", "sil"], ["meteors.png", "sil"],
    ["altoteks.png", "sil"], ["levha/canex.png", "sil"], ["newlife.png", "sil"],
    ["estada.png", "sil"], ["basak.png", "sil"], ["erdem-caliskan.png", "sil"],
    ["oyka.png", "sil"], ["levha/serdivan.png", "sil"], ["allufem-aluminium.webp", "sil"],
    ["parhad.png", "sil"], ["levha/zeminkoleji.png", "knk"], ["candlesandechoes.png", "sil"],
    ["marstudyo.png", "sil"], ["federal.svg", "sil"],
  ];
  const board = $("#board");
  const cells = [];
  for (let i = 0; i < 18; i++) {
    const c = document.createElement("div");
    c.className = "cell";
    const r = Math.floor(i / 3), col = i % 3;
    c.style.left = col * 322 + "px";
    c.style.top = r * 166 + "px";
    if (i < LOGOS.length) {
      const img = document.createElement("img");
      img.src = "/src/assets/logos/" + LOGOS[i][0];
      img.className = LOGOS[i][1];
      img.alt = "";
      c.append(img);
    } else {
      c.classList.add("you");
      c.innerHTML = "+ sizin<br>markanız";
    }
    board.append(c);
    cells.push({ c, r, col });
  }
  const boardGlint = document.createElement("div");
  boardGlint.className = "glint";
  Object.assign(boardGlint.style, { inset: "-20px", borderRadius: "30px", mixBlendMode: "screen" });
  board.append(boardGlint);

  scene("s7", 42.3, 50.3, (t) => {
    const lt = t - 42.3;
    const wp = E.outC(P(t, 42.25, 43.35));
    const wq = E.inC(P(t, 49.25, 50.05));
    const dim = E.ioC(P(t, 46.3, 46.9));
    st(wall, { r: -8, s: mix(1.4, 1.12, wp) + lt * 0.004, o: wp * (1 - wq), blur: dim * 12, bright: mix(1, 0.42, dim) });
    wallCols.forEach((col) => st(col, { y: col._base + col._dir * lt * 72 }));
    wallSlots.forEach((s) => s.at(lt));
    s7.scrim.style.opacity = String(E.ioC(P(t, 42.9, 43.5)) * (1 - wq));
    io(s7.label, t, 42.8, 50.0, { dy: 20, blur: 6 });

    [[s7.n1, s7.v1, 43.25, 15], [s7.n2, s7.v2, 44.1, 100]].forEach(([el, val, ts, n]) => {
      io(el, t, ts, 46.8, { dy: 60, s0: 0.9, din: 0.8, dout: 0.5 });
      val.textContent = String(Math.round(n * E.outC(P(t, ts + 0.05, ts + 1.1))));
    });
    rise(s7.sw, t, 45.3, { stagger: 0.07, dur: 0.8, dy: 40, blur: 12, out: 46.4 });

    rise(s7.lw, t, 46.75, { stagger: 0.08, dur: 0.9, dy: 60, blur: 14, out: 49.1 });
    cells.forEach(({ c, r, col }) => {
      const ts = 46.95 + (r + col) * 0.075;
      const p = E.outExpo(P(t, ts, ts + 0.7));
      const q = E.inC(P(t, 49.1 + r * 0.03, 49.55 + r * 0.03));
      st(c, { y: (1 - p) * 40 - q * 50, s: mix(0.86, 1, p), o: p * (1 - q) });
    });
    boardGlint.style.setProperty("--gx", mix(-150, 360, E.ioS(P(t, 48.5, 49.4))).toFixed(1) + "%");
  });

  /* ═════════════════════════ VIII · REGION ═════════════════════════ */
  // Equirectangular projection of the real coordinates (see README).
  const proj = (lat, lon) => ({ x: 60 + (lon - 29.2) * 380, y: 790 + (41.15 - lat) * 500 });
  const HOME = proj(40.76, 30.36); // Serdivan
  const CITIES = [
    { n: "Kocaeli", ...proj(40.765, 29.94), t: 51.6, lx: 0, ly: -62, al: "c" },
    { n: "Düzce", ...proj(40.84, 31.16), t: 51.85, lx: 0, ly: -62, al: "c" },
    { n: "Gebze", ...proj(40.8, 29.43), t: 52.1, lx: 0, ly: -62, al: "c" },
    { n: "Bolu", ...proj(40.735, 31.61), t: 52.35, lx: 0, ly: 30, al: "c" },
    { n: "Bilecik", ...proj(40.14, 29.98), t: 52.6, lx: 30, ly: -16, al: "l" },
  ];
  const DISTRICTS = [
    [41.1, 30.69], [41.05, 30.85], [40.8, 30.75], [40.68, 30.62], [40.69, 30.27], [40.51, 30.29],
    [40.51, 30.17], [40.4, 30.49], [40.94, 30.49], [41.03, 30.31], [40.9, 30.47], [40.71, 30.36],
    [40.75, 30.41], [40.78, 30.4],
  ].map(([a, b]) => proj(a, b));
  const s8 = { label: $("#s8 .label"), title: $("#s8t"), map: $("#s8map"), foot: $("#s8foot"), layer: $("#s8layer") };
  s8.tw = splitWords(s8.title);
  s8.fw = splitWords(s8.foot);
  const svg8 = document.createElementNS(NS, "svg");
  svg8.setAttribute("width", "1080");
  svg8.setAttribute("height", "1920");
  s8.layer.append(svg8);
  const dists = DISTRICTS.map((d) => {
    const e = document.createElement("span");
    e.className = "dist";
    e.style.left = d.x + "px";
    e.style.top = d.y + "px";
    s8.layer.append(e);
    return e;
  });
  const rings = [0, 1, 2].map(() => {
    const r = document.createElement("span");
    r.className = "ring";
    r.style.left = HOME.x + "px";
    r.style.top = HOME.y + "px";
    s8.layer.append(r);
    return r;
  });
  const arcs = CITIES.map((c) => {
    const mx = (HOME.x + c.x) / 2, my = (HOME.y + c.y) / 2;
    const dx = c.x - HOME.x, dy = c.y - HOME.y;
    const len = Math.hypot(dx, dy);
    const nx = -dy / len, ny = dx / len;
    const bend = Math.min(90, len * 0.28) * (ny > 0 ? -1 : 1);
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", `M${HOME.x},${HOME.y} Q${mx + nx * bend},${my + ny * bend} ${c.x},${c.y}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#94420f");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-dasharray", "2 10");
    svg8.append(path);
    const solid = path.cloneNode();
    solid.setAttribute("stroke-dasharray", "");
    solid.setAttribute("stroke", "#e07a2e");
    solid.setAttribute("stroke-width", "4");
    svg8.append(solid);
    const spark = document.createElementNS(NS, "circle");
    spark.setAttribute("r", "8");
    spark.setAttribute("fill", "#e07a2e");
    svg8.append(spark);
    const city = document.createElement("div");
    city.className = "city";
    city.style.left = c.x + "px";
    city.style.top = c.y + "px";
    city.innerHTML = `<i></i><span>${c.n}</span>`;
    s8.layer.append(city);
    return { c, path, solid, spark, city, dot: $("i", city), lab: $("span", city), len: 0 };
  });
  const home = document.createElement("div");
  home.className = "glass home";
  Object.assign(home.style, { left: HOME.x + 26 + "px", top: HOME.y + 34 + "px", width: "260px", height: "92px", borderRadius: "999px", textAlign: "center", paddingTop: "16px" });
  home.innerHTML = "<b>Serdivan</b><small>MERKEZ</small>";
  s8.layer.append(home);

  scene("s8", 50.1, 55.15, (t) => {
    const OUT = 54.3;
    io(s8.label, t, 50.4, OUT + 0.5, { dy: 20, blur: 6 });
    rise(s8.tw, t, 50.45, { stagger: 0.08, dur: 0.9, dy: 70, blur: 16, out: OUT });
    const mp = E.outExpo(P(t, 50.6, 51.4));
    const mq = E.inC(P(t, OUT, OUT + 0.5));
    st(s8.map, { y: (1 - mp) * 60 - mq * 40, o: mp * (1 - mq) });
    st(s8.layer, { y: -mq * 40, o: 1 - mq });
    dists.forEach((d, i) => {
      const p = E.outBack(P(t, 51.15 + i * 0.035, 51.5 + i * 0.035));
      st(d, { s: Math.max(0, p), o: clamp(p * 2) * 0.85 });
    });
    rings.forEach((r, i) => {
      const cyc = ((t - 51.1 - i * 0.55) % 1.65 + 1.65) % 1.65 / 1.65;
      const live = t > 51.1 + i * 0.55 ? 1 : 0;
      st(r, { s: mix(0.2, 1.3, E.outC(cyc)), o: (1 - cyc) * 0.8 * live });
    });
    arcs.forEach((a) => {
      const p = E.ioC(P(t, a.c.t - 0.5, a.c.t));
      a.solid.style.strokeDasharray = `${a.len} ${a.len}`;
      a.solid.style.strokeDashoffset = String(a.len * (1 - p));
      a.solid.style.opacity = String(1 - P(t, a.c.t, a.c.t + 0.6) * 0.75);
      a.path.style.opacity = String(p);
      const pt = a.path.getPointAtLength(a.len * p);
      a.spark.setAttribute("cx", pt.x.toFixed(1));
      a.spark.setAttribute("cy", pt.y.toFixed(1));
      a.spark.style.opacity = String(p > 0 && p < 1 ? 1 : 0);
      const cp = E.outBack(P(t, a.c.t - 0.05, a.c.t + 0.35));
      st(a.dot, { s: Math.max(0, cp), o: clamp(cp * 2) });
      const lp = E.outExpo(P(t, a.c.t + 0.05, a.c.t + 0.7));
      st(a.lab, { x: a.lp.x + (a.c.al === "l" ? (1 - lp) * -14 : 0), y: a.lp.y + (1 - lp) * 14, o: lp });
    });
    io(home, t, 51.3, 60, { dy: 20, s0: 0.8, blur: 0 });
    rise(s8.fw, t, 52.9, { stagger: 0.06, dur: 0.8, dy: 30, blur: 10, out: OUT });
  });

  /* ═════════════════════════ IX · MANIFESTO + CTA ═════════════════════════ */
  const s9 = { mani: $("#mani"), rows: $$("#mani .row"), cta: $("#cta"), btn: $("#btn"), tap: $("#tap"), ripple: $("#ripple"), r2: $$("#cta .row2"), k: $("#cta .k"), h2: $("#cta h2") };
  s9.hw = splitWords(s9.h2);
  scene("s9", 54.9, 62.95, (t) => {
    const OUT = 62.1;
    const beats = [55.3, 55.925, 56.55];
    s9.rows.forEach((r, i) => {
      const p = E.outExpo(P(t, beats[i], beats[i] + 1.0));
      st(r, { y: (1 - p) * 110, o: Math.min(1, p * 1.5), blur: (1 - p) * 26 });
    });
    const up = E.ioExpo(P(t, 58.3, 59.15));
    const mq = E.inC(P(t, OUT, OUT + 0.5));
    st(s9.mani, { y: mix(0, -205, up) - mq * 40, s: mix(1, 0.46, up) * (1 + P(t, 55.3, 58.3) * 0.03), o: 1 - mq, blur: mq * 10 });

    const cp = E.outExpo(P(t, 58.75, 59.6));
    const cq = E.inC(P(t, OUT + 0.05, OUT + 0.6));
    st(s9.cta, { y: (1 - cp) * 140 - cq * 60, s: mix(0.95, 1, cp), o: Math.min(1, cp * 1.6) * (1 - cq) });
    io(s9.k, t, 59.0, 99, { dy: 16, blur: 6 });
    rise(s9.hw, t, 59.05, { stagger: 0.07, dur: 0.8, dy: 40, blur: 12 });

    // Tap on the button.
    const BTN = { x: 540, y: 570 + 340 + 66 };
    const mv = E.outC(P(t, 59.85, 60.35));
    const tapIn = E.outC(P(t, 59.85, 60.05));
    const tapOut = E.inC(P(t, 60.75, 61.05));
    const press = P(t, 60.35, 60.46), release = E.outBack(P(t, 60.46, 60.8));
    st(s9.tap, { x: mix(880, BTN.x, mv), y: mix(1640, BTN.y, mv) + tapOut * 30, s: t < 60.46 ? mix(1, 0.78, press) : mix(0.78, 1, release), o: tapIn * (1 - tapOut) * 0.95 });
    const rp = E.outC(P(t, 60.4, 61.1));
    st(s9.ripple, { x: BTN.x, y: BTN.y, s: mix(1, 3.4, rp), o: t > 60.4 ? (1 - rp) * 0.9 : 0 });
    const bs = t < 60.46 ? mix(1, 0.955, press) : mix(0.955, 1, release);
    const bp = E.outExpo(P(t, 59.3, 60.0));
    st(s9.btn, { y: (1 - bp) * 30, s: bs * mix(0.94, 1, bp), o: bp, bright: 1 + Math.sin(clamp(P(t, 60.4, 61.2)) * Math.PI) * 0.12 });
    s9.r2.forEach((r, i) => {
      const p = E.outExpo(P(t, 60.65 + i * 0.15, 61.35 + i * 0.15));
      st(r, { x: (1 - p) * -40, o: p, blur: (1 - p) * 8 });
    });
  });

  /* ═════════════════════════ END CARD ═════════════════════════ */
  const endUrl = $("#end .url"), endPlace = $("#end .place");
  scene("end", 62.6, 65.01, (t) => {
    io(endUrl, t, 63.65, 99, { dy: 24, din: 0.9 });
    io(endPlace, t, 63.95, 99, { dy: 20, din: 0.9 });
  });

  /* ═════════════════════════ WORLD ═════════════════════════ */
  const dot = () => dotStage();
  let sunKeys = null;
  function buildSunKeys() {
    const D = dot();
    const dotState = { x: D.x, y: D.y, d: 61, light: 0.35, halo: 0.25, orb: 1, core: 0.95 };
    const key = { x: 880, y: 210, d: 190, light: 0.9, halo: 0.55, orb: 1, core: 0 };
    const off = (o) => ({ ...o, light: 0, halo: 0, orb: 0, core: 0 });
    const pin = { x: HOME.x, y: HOME.y, d: 58, light: 0.22, halo: 0.3, orb: 1, core: 0.95 };
    sunKeys = [
      [0, off({ x: 540, y: 900, d: 300, light: 0, halo: 0, orb: 0, core: 0 })],
      [4.7, off({ x: 540, y: 900, d: 300, light: 0, halo: 0, orb: 0, core: 0 })],
      [5.0, { x: 540, y: 900, d: 330, light: 1, halo: 0.85, orb: 1, core: 0 }, E.lin],
      [6.6, { x: 540, y: 885, d: 410, light: 1, halo: 0.95, orb: 1, core: 0 }, E.ioS],
      [7.55, dotState, E.ioExpo],
      [9.45, dotState],
      [10.5, key, E.ioC],
      [41.9, { ...key, x: 868, y: 226 }, E.ioS],
      [42.7, off({ ...key, y: 140, d: 150 }), E.inC],
      [49.35, off({ x: 540, y: 2050, d: 640 }), E.lin],
      [50.2, { x: 540, y: 1560, d: 580, light: 1, halo: 0.9, orb: 1, core: 0 }, E.outC],
      [51.1, pin, E.ioExpo],
      [54.4, pin],
      [55.35, { x: 540, y: 1300, d: 520, light: 1, halo: 0.9, orb: 1, core: 0 }, E.ioExpo],
      [58.3, { x: 540, y: 1270, d: 560, light: 1, halo: 0.95, orb: 1, core: 0 }, E.ioS],
      [59.2, { x: 540, y: 1560, d: 640, light: 0.85, halo: 0.6, orb: 1, core: 0 }, E.ioC],
      [62.2, { x: 540, y: 1540, d: 660, light: 0.85, halo: 0.6, orb: 1, core: 0 }, E.ioS],
      [63.15, dotState, E.ioExpo],
      [65, dotState],
    ];
  }
  function drawSun(t) {
    const s = kfo(t, sunKeys);
    const breathe = 1 + Math.sin(t * 2 * Math.PI / 7) * 0.025; // 7 s corona, as on the site
    sun.style.transform = `translate3d(${s.x.toFixed(2)}px,${s.y.toFixed(2)}px,0)`;
    const sc = (el, mult, o) => {
      el.style.transform = `scale(${((s.d * mult) / 1000).toFixed(5)})`;
      el.style.opacity = clamp(o).toFixed(4);
      el.style.visibility = o < 0.003 ? "hidden" : "visible";
    };
    sc(sunL, 6.2 * breathe, s.light);
    sc(sunH, 2.7 * breathe, s.halo);
    sc(sunO, 2.08, s.orb);
    sc(sunB, 1.7 * breathe, s.orb * (1 - s.core) * 0.85);
    sc(sunC, 1.0, s.core);
    // The pin in VIII must sit on top of the glass map, not behind it.
    sun.style.zIndex = t > 50.45 && t < 54.72 ? "5" : "";
  }
  const REST = 1420;
  const SWEEPS = [10.0, 17.5, 27.35, 35.0, 54.9];
  function cloudY(t, lag) {
    for (const tc of SWEEPS) {
      const a = tc - 0.75 + lag, b = tc + 0.55 + lag;
      if (t >= a && t < b) return mix(REST, -1100, E.ioC(P(t, a, b)));
      if (t >= b && t < b + 0.9) return mix(1960, REST, E.outC(P(t, b, b + 0.9)));
    }
    return REST;
  }
  function drawWorld(t) {
    night.style.opacity = kf(t, [[0, 1], [4.93, 1], [5.02, 0, E.lin], [41.95, 0], [42.8, 1, E.ioC], [49.45, 1], [50.45, 0, E.ioC]]).toFixed(4);
    flash.style.opacity = kf(t, [[0, 0], [4.45, 0], [4.97, 1, E.inQ], [5.95, 0, E.outC], [49.3, 0], [49.95, 0.8, E.inQ], [50.9, 0, E.outC]]).toFixed(4);
    fogSky.style.transform = `translate3d(${(-Math.sin(t * 0.08) * 30).toFixed(2)}px,${(Math.cos(t * 0.06) * 20).toFixed(2)}px,0) scale(${(1.04 + Math.sin(t * 0.05) * 0.02).toFixed(4)})`;
    st(cloudA, { x: -((t * 26) % 1848), y: cloudY(t, 0) });
    st(cloudB, { x: -((t * 44 + 700) % 1848), y: cloudY(t, 0.12) + 160, o: 0.8 });
    // Film grain, re-seeded every other frame (24-ish fps texture).
    const g = rng(Math.floor(t * 10) + 1);
    grain.style.backgroundPosition = `${Math.round(g() * 256)}px ${Math.round(g() * 256)}px`;
    grain.style.opacity = t < 5 || (t > 42.6 && t < 49.9) ? "0.09" : "0.055";
    drawSun(t);
    drawLogo(t);
  }

  /* ═════════════════════════ RENDER ═════════════════════════ */
  function renderAt(t) {
    t = clamp(t, 0, DUR - 1e-4);
    drawWorld(t);
    for (const s of scenes) {
      const on = t >= s.a && t < s.b;
      show(s.el, on);
      if (on) s.fn(t);
    }
  }

  async function init() {
    await document.fonts.load('600 100px "Fraunces"');
    await document.fonts.load('italic 520 100px "Fraunces"');
    await document.fonts.load('700 40px "Inter"');
    await document.fonts.ready;
    try { manifest = await (await fetch(`${CLIPS}/manifest.json`)).json(); } catch { manifest = {}; }

    // Logo from the site's own file.
    const src = await (await fetch("/public/hero/rast-sun-logo.svg")).text();
    const doc = new DOMParser().parseFromString(src, "image/svg+xml");
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "220 340 660 400");
    logo.append(svg);
    const groups = [];
    for (const sh of doc.querySelectorAll("path, polygon, rect, circle")) {
      const node = document.importNode(sh, true);
      node.removeAttribute("class");
      if (sh.tagName === "circle") {
        DOT = { x: +sh.getAttribute("cx"), y: +sh.getAttribute("cy") };
        continue; // the sun takes this place
      }
      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", "lt");
      g.append(node);
      svg.append(g);
      groups.push(g);
    }
    letters = groups.map((g) => {
      const b = g.getBBox();
      return { g, cx: b.x + b.width / 2, cy: b.y + b.height / 2, top: b.y + b.height / 2 < 610 };
    });
    const tops = letters.filter((l) => l.top).sort((a, b) => Math.abs(a.cx - DOT.x) - Math.abs(b.cx - DOT.x));
    tops.forEach((l, i) => { l.delay = i * 0.07; l.order = i; });
    letters.filter((l) => !l.top).sort((a, b) => a.cx - b.cx).forEach((l, i) => (l.order = i));

    // Grain tile.
    const cv = document.createElement("canvas");
    cv.width = cv.height = 256;
    const cx = cv.getContext("2d");
    const id = cx.createImageData(256, 256);
    const r = rng(99);
    for (let i = 0; i < id.data.length; i += 4) {
      const v = Math.round(128 + (r() - 0.5) * 255);
      id.data[i] = id.data[i + 1] = id.data[i + 2] = v;
      id.data[i + 3] = 255;
    }
    cx.putImageData(id, 0, 0);
    grain.style.backgroundImage = `url(${cv.toDataURL()})`;

    // Measure text geometry with every scene laid out, untransformed.
    scenes.forEach((s) => show(s.el, true));
    const sr = stage.getBoundingClientRect();
    const k = sr.width / 1080;
    const rel = (el) => {
      const b = el.getBoundingClientRect();
      return { x: (b.left - sr.left) / k, y: (b.top - sr.top) / k, w: b.width / k, h: b.height / k };
    };
    const textBox = (line) => {
      const ws = $$(".w", line).map(rel);
      const x0 = Math.min(...ws.map((w) => w.x)), x1 = Math.max(...ws.map((w) => w.x + w.w));
      return { x0, x1, y: ws[0].y, h: ws[0].h };
    };
    // Single-line headlines must fit inside 960px.
    $$("#s3 .line").forEach((l) => {
      let fs = parseFloat(getComputedStyle(l).fontSize);
      while (textBox(l).x1 - textBox(l).x0 > 960 && fs > 40) { fs -= 2; l.style.fontSize = fs + "px"; }
    });
    [[s3.k1, s3.l1], [s3.k2, s3.l2]].forEach(([k1, l]) => {
      const b = textBox(l);
      Object.assign(k1.style, { left: b.x0 - 14 + "px", width: b.x1 - b.x0 + 28 + "px", top: b.y + b.h * 0.56 + "px" });
    });
    const ek = rel($("#s3ekip"));
    const y0 = ek.y + ek.h * 0.93;
    s3.sw.setAttribute("d", `M${ek.x + 8},${y0 + 6} C${ek.x + ek.w * 0.3},${y0 - 6} ${ek.x + ek.w * 0.7},${y0 + 16} ${ek.x + ek.w + 10},${y0 - 4}`);
    L.swLen = s3.sw.getTotalLength();
    s3.sw.style.strokeDasharray = `${L.swLen} ${L.swLen}`;
    arcs.forEach((a) => {
      a.len = a.path.getTotalLength();
      const lb = rel(a.lab);
      a.lp = a.c.al === "l" ? { x: a.c.lx, y: a.c.ly } : { x: -lb.w / 2 + a.c.lx, y: a.c.ly };
    });
    s6.cards.forEach((c) => c._paths.forEach((o) => {
      o.len = o.p.getTotalLength();
      o.p.style.strokeDasharray = `${o.len} ${o.len}`;
    }));
    scenes.forEach((s) => show(s.el, false));
    buildSunKeys();

    // Everything decoded before the first frame.
    const imgs = $$("img").filter((i) => i.src);
    await Promise.all(imgs.map((i) => i.decode().catch(() => {})));
    const bgs = new Set();
    for (const el of $$("*")) {
      const m = getComputedStyle(el).backgroundImage.match(/url\("([^"]+)"\)/g);
      if (m) m.forEach((u) => bgs.add(u.slice(5, -2)));
    }
    await Promise.all([...bgs].filter((u) => !u.startsWith("data:")).map((u) => { const i = new Image(); i.src = u; return i.decode().catch(() => {}); }));
  }

  const raf = () => new Promise((r) => requestAnimationFrame(() => r()));
  window.__ready = init();
  window.__render = async (t) => {
    pending = [];
    renderAt(t);
    await Promise.all(pending);
    await raf();
  };
  window.__meta = { fps: FPS, duration: DUR, width: 1080, height: 1920 };

  /* ───────────── live preview (?preview) ───────────── */
  if (/[?&]preview/.test(location.search)) {
    const ui = $("#ui"), play = $("#play"), scrub = $("#scrub"), tc = $("#tc");
    ui.style.display = "flex";
    const fit = () => {
      const k = Math.min(innerWidth / 1080, (innerHeight - 44) / 1920);
      stage.style.transform = `scale(${k})`;
    };
    window.__ready.then(() => { fit(); renderAt(0); });
    addEventListener("resize", fit);
    let playing = false, t0 = 0, from = 0, ctx = null, buf = null, srcNode = null;
    const loop = () => {
      if (!playing) return;
      const t = from + (performance.now() - t0) / 1000;
      if (t >= DUR) { playing = false; play.textContent = "▶︎"; return; }
      pending = [];
      renderAt(t);
      scrub.value = t; tc.textContent = t.toFixed(2);
      requestAnimationFrame(loop);
    };
    play.onclick = async () => {
      if (playing) { playing = false; play.textContent = "▶︎"; srcNode?.stop(); return; }
      if (!buf && window.Soundtrack) {
        play.textContent = "…";
        ctx = new AudioContext();
        buf = await window.Soundtrack.render();
      }
      from = +scrub.value; t0 = performance.now(); playing = true; play.textContent = "❚❚";
      if (buf) { srcNode = ctx.createBufferSource(); srcNode.buffer = buf; srcNode.connect(ctx.destination); srcNode.start(0, from); }
      loop();
    };
    scrub.oninput = () => { if (!playing) { renderAt(+scrub.value); tc.textContent = (+scrub.value).toFixed(2); } };
  }
})();
