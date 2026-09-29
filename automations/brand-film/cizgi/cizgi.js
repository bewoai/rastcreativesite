/*
 * Rast Creative — "Tek Çizgi" · picture
 * One ember dot draws one hairline: aperture → clapper → film strip → sunrise → the logo's own dot.
 * The dot then glides home and the loop restarts (frame 0 ≡ frame DUR).
 * Deterministic: window.__render(t) draws any frame. No zoom anywhere.
 */
(() => {
  "use strict";
  const { W, H, FPS, DUR, T, TEXT } = window.CIZGI;
  const cv = document.getElementById("c"), ctx = cv.getContext("2d");
  const INK = "#efe8da", EMBER = "#ff8a3d", BG = "#0b0a09";
  const CX = 540, CY = 960;
  const LOGO = { x: 190, y: 748, w: 700, h: 424, dot: [582, 991], dotR: 28 };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const P = (t, a, b) => clamp((t - a) / (b - a));
  const ease = (x) => x * x * (3 - 2 * x);
  const easeOut = (x) => 1 - (1 - x) ** 3;
  const lerp = (a, b, x) => a + (b - a) * x;
  const rot = (p, o, a) => { const c = Math.cos(a), s = Math.sin(a), dx = p[0] - o[0], dy = p[1] - o[1]; return [o[0] + dx * c - dy * s, o[1] + dx * s + dy * c]; };
  const arc = (cx, cy, r, a0, a1, n = 48) => Array.from({ length: n + 1 }, (_, i) => { const a = lerp(a0, a1, i / n); return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
  const poly = (...pts) => pts;

  /* ---------- scenes: each returns polylines (drawn in order) ---------- */
  function aperture() {
    const R = 250, r = 105, th0 = -Math.PI / 2, out = [];
    const sp = []; const N = 160;
    for (let i = 0; i <= N; i++) { const u = i / N, a = th0 - 4.5 * Math.PI * (1 - u) * -1 * -1; const rr = lerp(9, R, u); const ang = th0 + 4 * Math.PI * u; sp.push([CX + rr * Math.cos(ang), CY + rr * Math.sin(ang)]); }
    out.push(sp);
    const V = (k) => [CX + R * Math.cos(th0 + k * Math.PI / 3), CY + R * Math.sin(th0 + k * Math.PI / 3)];
    const U = (k) => { const a = th0 + k * Math.PI / 3 + 1.25; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; };
    out.push(arc(CX, CY, R, th0, th0 + Math.PI * 2, 120));
    for (let k = 0; k < 6; k++) out.push(poly(V(k), U(k), U(k + 1)));
    out.push(arc(CX, CY, r * 0.55, th0, th0 + Math.PI * 2, 48));
    return out;
  }
  const HING = [310, 880];
  function clapper(t) {
    const clap = T.clap, open = -0.36 - 0.05 * Math.sin(t * 2.2);
    const a = t < clap ? open * (1 - 0.0 * 0) : -0.36 * Math.exp(-(t - clap) * 38) * Math.cos((t - clap) * 60) * (t - clap < 0.35 ? 1 : 0);
    const ang = t < clap ? open : a;
    const body = [[310, 880], [770, 880], [770, 1140], [310, 1140], [310, 880]];
    const out = [body, poly([310, 960], [770, 960]), poly([310, 1050], [770, 1050]), poly([540, 960], [540, 1140])];
    const st = [[0, 0], [460, 0], [460, -72], [0, -72], [0, 0]].map(([x, y]) => rot([HING[0] + x, HING[1] + y], HING, ang));
    out.push(st);
    for (let i = 0; i < 6; i++) out.push([[76 * i + 20, 0], [76 * i + 72, -72]].map(([x, y]) => rot([HING[0] + x, HING[1] + y], HING, ang)));
    return out;
  }
  function strip() {
    const c = [CX, 980], a = -0.07, o = [];
    const T2 = (pts) => pts.map((p) => rot(p, c, a));
    o.push(T2([[110, 850], [970, 850], [970, 1110], [110, 1110], [110, 850]]));
    for (let i = 0; i < 14; i++) { const x = 140 + i * 60; o.push(T2([[x, 868], [x + 26, 868], [x + 26, 890], [x, 890], [x, 868]])); }
    for (let i = 0; i < 14; i++) { const x = 140 + i * 60; o.push(T2([[x, 1070], [x + 26, 1070], [x + 26, 1092], [x, 1092], [x, 1070]])); }
    for (let i = 0; i < 3; i++) { const x = 150 + i * 270; o.push(T2([[x, 915], [x + 240, 915], [x + 240, 1045], [x, 1045], [x, 915]])); }
    return o;
  }
  function playTri() { const c = rot([CX + 6, 980], [CX, 980], -0.07); return [[[c[0] - 32, c[1] - 40], [c[0] + 44, c[1]], [c[0] - 32, c[1] + 40], [c[0] - 32, c[1] - 40]].map((p) => rot(p, [CX, 980], 0))]; }
  function sunrise() {
    const y = 1010, o = [poly([110, y], [970, y])];
    o.push(arc(CX, y, 190, Math.PI, Math.PI * 2, 90));
    for (let i = 0; i < 11; i++) { const a = Math.PI + (i + 0.5) * Math.PI / 11; o.push(poly([CX + 235 * Math.cos(a), y + 235 * Math.sin(a)], [CX + 320 * Math.cos(a), y + 320 * Math.sin(a)])); }
    o.push(poly([300, y + 44], [780, y + 44]), poly([390, y + 88], [690, y + 88]));
    return o;
  }

  /* ---------- polyline drawing with head tracking ---------- */
  function measure(polys) { let L = 0; const segs = polys.map((p) => { let s = 0; for (let i = 1; i < p.length; i++) s += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); L += s; return s; }); return { L, segs }; }
  // draws the arc-length window [s0, s1] of the polys; returns head point
  function drawWindow(polys, s0, s1, style) {
    const { L, segs } = measure(polys); const A = s0 * L, B = s1 * L; let base = 0, head = null;
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (const pass of [{ w: 5, a: 0.07 }, { w: 1.7, a: 1 }]) {
      ctx.strokeStyle = style.color; ctx.lineWidth = pass.w; ctx.globalAlpha = style.alpha * pass.a; base = 0;
      polys.forEach((p, pi) => {
        const plen = segs[pi], lo = A - base, hi = B - base; base += plen;
        if (hi <= 0 || lo >= plen) return;
        ctx.beginPath(); let acc = 0, started = false;
        for (let i = 1; i < p.length; i++) {
          const sl = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); const a0 = acc, a1 = acc + sl; acc = a1;
          if (a1 < lo || a0 > hi || sl === 0) continue;
          const u0 = clamp((lo - a0) / sl), u1 = clamp((hi - a0) / sl);
          const x0 = lerp(p[i - 1][0], p[i][0], u0), y0 = lerp(p[i - 1][1], p[i][1], u0), x1 = lerp(p[i - 1][0], p[i][0], u1), y1 = lerp(p[i - 1][1], p[i][1], u1);
          if (!started) { ctx.moveTo(x0, y0); started = true; }
          ctx.lineTo(x1, y1);
          if (pass.w < 3 && hi <= a1 + 1e-6 && hi >= a0) head = [x1, y1];
        }
        ctx.stroke();
      });
    }
    ctx.restore();
    if (!head) { const last = polys[polys.length - 1]; head = s1 >= 1 ? last[last.length - 1] : polys[0][0]; }
    return head;
  }

  /* ---------- scene table (drives pen dot as well) ---------- */
  const S = [
    { id: "ap", draw: T.s1, fade: T.s1fade, build: aperture },
    { id: "cl", draw: T.s2, fade: T.s2fade, build: clapper },
    { id: "st", draw: T.s3, fade: T.s3fade, build: strip },
    { id: "su", draw: T.s4, fade: T.s4fade, build: sunrise },
  ];
  const ends = {}, starts = {};
  function endpoints() { for (const s of S) { const p = s.build(s.id === "cl" ? T.clap + 1 : 0); starts[s.id] = p[0][0]; const last = p[p.length - 1]; ends[s.id] = last[last.length - 1]; } }

  function penState(t) {
    // returns {pos, r}
    const home = [CX, CY], ld = LOGO.dot;
    let pos, r = 9;
    const exit = T.exit;
    if (t >= exit[0]) { const u = ease(P(t, exit[0], exit[1])); pos = [lerp(ld[0], home[0], u), lerp(ld[1], home[1], u)]; r = lerp(LOGO.dotR, 9, u); return { pos, r }; }
    if (t >= T.logo[0] - 0.55) { const u = ease(P(t, T.logo[0] - 0.55, T.logo[0])); const from = ends.su; pos = [lerp(from[0], ld[0], u), lerp(from[1], ld[1], u)]; r = lerp(9, LOGO.dotR, ease(P(t, T.logo[0] - 0.2, T.logo[0] + 0.4))); return { pos, r }; }
    let prevEnd = home;
    for (let i = 0; i < S.length; i++) {
      const s = S[i], a = s.draw[0], b = s.draw[1];
      const gapStart = i === 0 ? 0 : S[i - 1].draw[1];
      if (t < a) { const u = ease(P(t, Math.max(gapStart, a - 0.6), a)); const st = starts[s.id]; return { pos: [lerp(prevEnd[0], st[0], u), lerp(prevEnd[1], st[1], u)], r: 9 }; }
      if (t <= b) return { pos: s._head || starts[s.id], r: 9 };
      prevEnd = ends[s.id];
    }
    return { pos: prevEnd, r: 9 };
  }

  /* ---------- assets ---------- */
  let logoImg = null; const grain = [];
  function makeGrain() {
    for (let k = 0; k < 6; k++) {
      const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d"), im = g.createImageData(256, 256);
      let s = 1234 + k * 977; const R = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
      for (let i = 0; i < im.data.length; i += 4) { const v = 120 + R() * 135 | 0; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = R() < 0.5 ? 0 : 255; }
      g.putImageData(im, 0, 0); grain.push(c);
    }
  }
  async function init() {
    endpoints(); makeGrain();
    await document.fonts.load('italic 400 84px "Fraunces"'); await document.fonts.load('500 30px "Inter"');
    logoImg = new Image(); logoImg.src = "/public/hero/rast-sun-logo.svg"; await logoImg.decode();
  }

  function glowDot(x, y, r, t, a = 1) {
    const pulse = 1 + 0.14 * Math.sin((t / 2.5) * Math.PI * 2);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 7 * pulse);
    g.addColorStop(0, "rgba(255,138,61,0.42)"); g.addColorStop(0.35, "rgba(255,138,61,0.10)"); g.addColorStop(1, "rgba(255,138,61,0)");
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 7 * pulse, 0, 7); ctx.fill();
    ctx.fillStyle = EMBER; ctx.beginPath(); ctx.arc(x, y, r * (0.97 + 0.03 * pulse), 0, 7); ctx.fill(); ctx.restore();
  }

  function text(t) {
    const rows = [
      { s: TEXT.l1, y: 1290, a: T.t1[0], size: 66, font: 'italic 400 66px "Fraunces"' },
      { s: TEXT.l2, y: 1372, a: T.t2[0], size: 66, font: 'italic 400 66px "Fraunces"' },
    ];
    const fade = 1 - ease(P(t, T.exit[0], T.exit[0] + 0.8));
    ctx.save(); ctx.textBaseline = "alphabetic"; ctx.fillStyle = INK;
    for (const row of rows) {
      ctx.font = row.font; const chars = [...row.s]; const ws = chars.map((c) => ctx.measureText(c).width); const tot = ws.reduce((a, b) => a + b, 0); let x = CX - tot / 2;
      chars.forEach((c, i) => { const u = ease(P(t, row.a + i * 0.045, row.a + i * 0.045 + 0.35)); if (u > 0) { ctx.globalAlpha = u * fade; ctx.fillText(c, x, row.y + (1 - u) * 14); } x += ws[i]; });
    }
    // swash under "çizelim."
    const sw = P(t, T.swash[0], T.swash[1]);
    if (sw > 0) {
      ctx.font = rows[1].font; const w2 = ctx.measureText(TEXT.l2).width, x0 = CX - w2 / 2 - 8, x1 = CX + w2 / 2 + 8, y0 = 1398;
      const pts = Array.from({ length: 60 }, (_, i) => { const u = i / 59; return [lerp(x0, x1, u), y0 + Math.sin(u * Math.PI * 1.6) * 6 + u * 4]; });
      drawWindow([pts], 0, easeOut(sw), { color: EMBER, alpha: fade });
    }
    // url
    const u = ease(P(t, T.url[0], T.url[1]));
    if (u > 0) { ctx.font = '500 30px "Inter"'; ctx.letterSpacing = "6px"; ctx.globalAlpha = u * fade * 0.85; ctx.textAlign = "center"; ctx.fillText(TEXT.url, CX + 3, 1452); ctx.letterSpacing = "0px"; }
    ctx.restore();
  }

  function render(t) {
    ctx.globalAlpha = 1; ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
    // faint vignette
    const v = ctx.createRadialGradient(CX, CY, 200, CX, CY, 1150); v.addColorStop(0, "rgba(255,240,220,0.035)"); v.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);

    for (const s of S) {
      const p = P(t, s.draw[0], s.draw[1]); const polys = s.build(t);
      const e = ease(P(t, s.fade[0], s.fade[1]));
      s._head = null;
      if (t < s.draw[0] || (e >= 1)) continue;
      const head = drawWindow(polys, e, easeOut(p) * 0.999 + (p >= 1 ? 0.001 : 0), { color: INK, alpha: 1 - 0.0 * e });
      s._head = head;
      if (s.id === "cl") {
        const dt = t - T.clap;
        if (dt > 0 && dt < 0.5) { ctx.save(); ctx.strokeStyle = EMBER; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.globalAlpha = (1 - dt / 0.5) * (1 - e); for (let i = 0; i < 5; i++) { const a = -Math.PI * (0.15 + i * 0.17) ; const r0 = 30 + dt * 240, r1 = r0 + 34 * (1 - dt / 0.5); ctx.beginPath(); ctx.moveTo(HING[0] + 460 + r0 * Math.cos(a), HING[1] + r0 * Math.sin(a)); ctx.lineTo(HING[0] + 460 + r1 * Math.cos(a), HING[1] + r1 * Math.sin(a)); ctx.stroke(); } ctx.restore(); }
      }
      if (s.id === "st") {
        const pp = P(t, T.play[0], T.play[1]);
        if (pp > 0) drawWindow(playTri(), e, easeOut(pp) * 0.999 + (pp >= 1 ? 0.001 : 0), { color: EMBER, alpha: 1 - e });
      }
    }

    // logo reveal from the dot
    if (t >= T.logo[0]) {
      const ru = easeOut(P(t, T.logo[0], T.logo[1])), fade = 1 - ease(P(t, T.exit[0], T.exit[0] + 0.9));
      ctx.save(); ctx.beginPath(); ctx.arc(LOGO.dot[0], LOGO.dot[1], ru * 1100, 0, 7); ctx.clip(); ctx.globalAlpha = fade * 0.96;
      ctx.drawImage(logoImg, LOGO.x, LOGO.y, LOGO.w, LOGO.h); ctx.restore();
    }
    text(t);

    const pen = penState(t); glowDot(pen.pos[0], pen.pos[1], pen.r, t);

    // film grain (12 fps, wraps with the loop)
    const gi = Math.floor(t * 12) % (DUR * 12);
    ctx.save(); ctx.globalCompositeOperation = "overlay"; ctx.globalAlpha = 0.11;
    const gc = grain[gi % 6], ox = (gi * 97) % 256, oy = (gi * 53) % 256;
    for (let x = -ox; x < W; x += 256) for (let y = -oy; y < H; y += 256) ctx.drawImage(gc, x, y);
    ctx.restore();
  }

  const raf = () => new Promise((r) => requestAnimationFrame(() => r()));
  window.__ready = init();
  window.__meta = { fps: FPS, duration: DUR, width: W, height: H };
  window.__render = async (t) => { render(t); await raf(); };

  if (/[?&]preview/.test(location.search)) {
    const $ = (s) => document.querySelector(s);
    const ui = $("#ui"), play = $("#play"), scrub = $("#scrub"), tc = $("#tcu"), stage = $("#stage");
    ui.style.display = "flex";
    const fit = () => (stage.style.transform = `scale(${Math.min(innerWidth / 1080, (innerHeight - 44) / 1920)})`);
    window.__ready.then(() => { fit(); render(0); });
    addEventListener("resize", fit);
    let playing = false, t0 = 0, from = 0, actx = null, buf = null, node = null;
    const loop = () => { if (!playing) return; const t = (from + (performance.now() - t0) / 1000) % DUR; render(t); scrub.value = t; tc.textContent = t.toFixed(2); requestAnimationFrame(loop); };
    play.onclick = async () => {
      if (playing) { playing = false; node?.stop(); return; }
      if (!buf && window.CizgiAudio) { play.textContent = "…"; actx = new AudioContext(); buf = await window.CizgiAudio.render(); }
      from = +scrub.value; t0 = performance.now(); playing = true; play.textContent = "❚❚";
      if (buf) { node = actx.createBufferSource(); node.buffer = buf; node.loop = true; node.connect(actx.destination); node.start(0, from); }
      loop();
    };
    scrub.oninput = () => { if (!playing) { render(+scrub.value); tc.textContent = (+scrub.value).toFixed(2); } };
  }
})();
