/*
 * Rast Creative — "Planda Olmayan Kare" · picture engine
 * ------------------------------------------------------------------
 * A film hand-inked on linen: brush strokes with taper and pressure, drawn on stroke by
 * stroke, a 12 fps line boil, one red accent (the REC light). Two cats, a butterfly, a
 * camera on a tripod — and the best frame nobody planned.
 * Deterministic: window.__render(t) draws any frame. No zoom anywhere.
 */
(() => {
  "use strict";
  const K = window.INK, C = K.CUE, W = K.W, H = K.H, GY = K.GY, DUR = K.DUR, FPS = K.FPS;
  const INK = K.ink, RED = K.red;
  const $ = (s) => document.querySelector(s);
  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const P = (t, a, b) => clamp((t - a) / (b - a));
  const mix = (a, b, p) => a + (b - a) * p;
  const sm = (x) => x * x * (3 - 2 * x);
  const E = {
    outC: (x) => 1 - (1 - x) ** 3, inC: (x) => x ** 3, inQ: (x) => x * x,
    ioC: (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
    outBack: (x) => 1 + 2.4 * (x - 1) ** 3 + 1.4 * (x - 1) ** 2,
    outExpo: (x) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x)),
  };
  const f1 = (n) => n.toFixed(1);

  /* ───── noise + line boil ───── */
  function hash(n) { const s = Math.sin(n) * 43758.5453123; return s - Math.floor(s); }
  const h2 = (a, b) => hash(a * 127.1 + b * 311.7);
  function vnoise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = sm(xf), v = sm(yf);
    return mix(mix(h2(xi, yi), h2(xi + 1, yi), u), mix(h2(xi, yi + 1), h2(xi + 1, yi + 1), u), v);
  }
  let FR = 0;                       // boil frame (12 fps)
  const BOIL = 1.6;
  function wob(x, y, seed) {
    return [(vnoise(x * 0.009 + FR * 3.7 + seed * 5.1, y * 0.009 + 1.3) - 0.5) * 2, (vnoise(x * 0.009 + 7.7, y * 0.009 + FR * 2.9 + seed * 3.3) - 0.5) * 2];
  }

  /* ───── 2D matrices [a b c d e f] ───── */
  const mI = () => [1, 0, 0, 1, 0, 0];
  const mMul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
  const mT = (x, y) => [1, 0, 0, 1, x, y];
  const mR = (a) => [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0];
  const mS = (x, y = x) => [x, 0, 0, y, 0, 0];
  const mm = (...ms) => ms.reduce((a, b) => mMul(a, b));
  const xf = (M, x, y) => [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]];
  const pivot = (M, px, py, a) => mm(M, mT(px, py), mR(a), mT(-px, -py));

  /* ───── path → uniformly resampled polyline ───── */
  let SID = 1;
  function mk(d, step = 5) {
    const tk = d.match(/[MLCQZ]|-?\d*\.?\d+/g); const dense = []; let i = 0, cx = 0, cy = 0, sx = 0, sy = 0;
    const line = (x, y) => { const n = Math.max(2, Math.ceil(Math.hypot(x - cx, y - cy) / 2)); for (let k = 1; k <= n; k++) dense.push([cx + (x - cx) * k / n, cy + (y - cy) * k / n]); cx = x; cy = y; };
    while (i < tk.length) {
      const c = tk[i++];
      if (c === "M") { cx = +tk[i++]; cy = +tk[i++]; sx = cx; sy = cy; dense.push([cx, cy]); }
      else if (c === "L") line(+tk[i++], +tk[i++]);
      else if (c === "C") {
        const x1 = +tk[i++], y1 = +tk[i++], x2 = +tk[i++], y2 = +tk[i++], x = +tk[i++], y = +tk[i++];
        for (let k = 1; k <= 24; k++) { const u = k / 24, v = 1 - u; dense.push([v * v * v * cx + 3 * v * v * u * x1 + 3 * v * u * u * x2 + u * u * u * x, v * v * v * cy + 3 * v * v * u * y1 + 3 * v * u * u * y2 + u * u * u * y]); }
        cx = x; cy = y;
      } else if (c === "Q") {
        const x1 = +tk[i++], y1 = +tk[i++], x = +tk[i++], y = +tk[i++];
        for (let k = 1; k <= 16; k++) { const u = k / 16, v = 1 - u; dense.push([v * v * cx + 2 * v * u * x1 + u * u * x, v * v * cy + 2 * v * u * y1 + u * u * y]); }
        cx = x; cy = y;
      } else if (c === "Z") line(sx, sy);
    }
    const cum = [0]; for (let k = 1; k < dense.length; k++) cum.push(cum[k - 1] + Math.hypot(dense[k][0] - dense[k - 1][0], dense[k][1] - dense[k - 1][1]));
    const len = cum[cum.length - 1] || 1, n = Math.max(3, Math.ceil(len / step) + 1), pts = []; let j = 1;
    for (let k = 0; k < n; k++) {
      const dist = (k / (n - 1)) * len; while (j < cum.length - 1 && cum[j] < dist) j++;
      const a = dense[j - 1], b = dense[j], seg = cum[j] - cum[j - 1] || 1, u = clamp((dist - cum[j - 1]) / seg);
      pts.push([mix(a[0], b[0], u), mix(a[1], b[1], u)]);
    }
    return { pts, len, id: SID++ };
  }
  function circ(cx, cy, r, seed = 1, j = 0.05) {
    const k = 0.5523, q = [0, 1, 2, 3].map((i) => r * (1 + j * (hash(seed * 7.3 + i) - 0.5) * 2)), [a, b, c, d] = q;
    return `M ${f1(cx + a)} ${f1(cy)} C ${f1(cx + a)} ${f1(cy + b * k)} ${f1(cx + b * k)} ${f1(cy + b)} ${f1(cx)} ${f1(cy + b)} C ${f1(cx - c * k)} ${f1(cy + b)} ${f1(cx - c)} ${f1(cy + c * k)} ${f1(cx - c)} ${f1(cy)} C ${f1(cx - c)} ${f1(cy - d * k)} ${f1(cx - d * k)} ${f1(cy - d)} ${f1(cx)} ${f1(cy - d)} C ${f1(cx + a * k)} ${f1(cy - d)} ${f1(cx + a)} ${f1(cy - a * k)} ${f1(cx + a)} ${f1(cy)}`;
  }

  /* ───── the brush ───── */
  function drawStroke(g, S, M, o) {
    const p = o.p === undefined ? 1 : o.p; if (p <= 0) return;
    const n = S.pts.length, cnt = Math.min(n, Math.floor(p * (n - 1)) + 2); if (cnt < 2) return;
    const W0 = o.w || 6, amp = o.boil === undefined ? BOIL : o.boil, seed = (o.seed || 0) + S.id, PT = new Array(cnt), WD = new Array(cnt);
    for (let i = 0; i < cnt; i++) {
      const [x, y] = xf(M, S.pts[i][0], S.pts[i][1]), d = wob(x, y, seed); PT[i] = [x + d[0] * amp, y + d[1] * amp];
      const s = i / (n - 1), a = Math.min(1, s / 0.07), b = Math.min(1, (1 - s) / 0.1), tp = Math.sqrt(a) * Math.sqrt(b);
      WD[i] = W0 * (0.3 + 0.7 * tp) * (0.86 + 0.3 * vnoise(i * 0.22 + seed * 3.1, S.id * 1.7));
    }
    const L = [], R = [];
    for (let i = 0; i < cnt; i++) {
      const a = PT[Math.max(0, i - 1)], b = PT[Math.min(cnt - 1, i + 1)]; let tx = b[0] - a[0], ty = b[1] - a[1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      L.push([PT[i][0] - ty * WD[i] / 2, PT[i][1] + tx * WD[i] / 2]); R.push([PT[i][0] + ty * WD[i] / 2, PT[i][1] - tx * WD[i] / 2]);
    }
    g.fillStyle = o.color || INK; g.beginPath(); g.moveTo(L[0][0], L[0][1]);
    for (let i = 1; i < cnt; i++) g.lineTo(L[i][0], L[i][1]);
    for (let i = cnt - 1; i >= 0; i--) g.lineTo(R[i][0], R[i][1]);
    g.closePath(); g.fill();
    g.beginPath(); g.arc(PT[0][0], PT[0][1], WD[0] / 2, 0, 7); g.arc(PT[cnt - 1][0], PT[cnt - 1][1], WD[cnt - 1] / 2, 0, 7); g.fill();
  }
  function fillShape(g, S, M, color, o = {}) {           // a filled closed shape (rough edge, optional mis-registration)
    const ox = o.ox || 0, oy = o.oy || 0, amp = o.amp === undefined ? 1.6 : o.amp, seed = o.seed || S.id; g.fillStyle = color; g.beginPath();
    S.pts.forEach((q, i) => { const [x, y] = xf(M, q[0], q[1]), d = wob(x, y, seed); (i ? g.lineTo : g.moveTo).call(g, x + ox + d[0] * amp, y + oy + d[1] * amp); });
    g.closePath(); g.fill();
  }

  /* ───── linen ───── */
  function makeLinen() {
    const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d"), img = x.createImageData(W, H), d = img.data;
    const row = new Float32Array(H), col = new Float32Array(W); for (let i = 0; i < H; i++) row[i] = hash(i * 1.37) + 0.5 * hash(i * 0.31 + 5); for (let i = 0; i < W; i++) col[i] = hash(i * 1.91 + 9) + 0.5 * hash(i * 0.27 + 2);
    const mc = document.createElement("canvas"); mc.width = 90; mc.height = 160; const mx = mc.getContext("2d"), mi = mx.createImageData(90, 160);
    for (let j = 0; j < 160; j++) for (let i = 0; i < 90; i++) { const v = vnoise(i * 0.09, j * 0.09) * 0.6 + vnoise(i * 0.31 + 9, j * 0.31) * 0.4; const o = (j * 90 + i) * 4; mi.data[o] = mi.data[o + 1] = mi.data[o + 2] = 128 + (v - 0.5) * 60; mi.data[o + 3] = 255; }
    mx.putImageData(mi, 0, 0);
    let seed = 12345; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let y = 0; y < H; y++) for (let xx = 0; xx < W; xx++) {
      const wv = ((xx / 3 | 0) + (y / 3 | 0)) & 1, t = (wv ? row[y] : col[xx]) - 0.75, n = (rnd() - 0.5) * 7, k = t * 15 + n + (wv ? 2 : -2), o = (y * W + xx) * 4;
      d[o] = 219 + k; d[o + 1] = 212 + k; d[o + 2] = 190 + k * 0.9; d[o + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    x.globalCompositeOperation = "multiply"; x.imageSmoothingEnabled = true; x.globalAlpha = 0.5; x.drawImage(mc, 0, 0, W, H); x.globalAlpha = 1;
    const vg = x.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 0.72); vg.addColorStop(0, "rgba(255,255,255,1)"); vg.addColorStop(1, "rgba(196,186,160,1)"); x.fillStyle = vg; x.fillRect(0, 0, W, H);
    return c;
  }
  function makeGrain() {
    const c = document.createElement("canvas"); c.width = c.height = 256; const x = c.getContext("2d"), img = x.createImageData(256, 256); let s = 777; const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < 256 * 256; i++) { const v = 200 + rnd() * 55; img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255; }
    x.putImageData(img, 0, 0); return c;
  }

  /* ───── audio events ───── */
  const reg = (t, dur, x = 540) => K.events.push({ t, dur, pan: clamp((x / 540 - 1) * 0.7, -0.8, 0.8) });
  const blinkAt = (t, list, wd = 0.1) => list.reduce((m, b) => Math.max(m, clamp(1 - Math.abs(t - b) / wd)), 0);

  /* ═════════════ the cat ═════════════ */
  function buildCat(patch) {
    const A = (d, w, off, dur, extra = {}) => ({ S: mk(d), w, off, dur, ...extra });
    const cat = {
      body: [
        A("M 14 -226 C -18 -212 -66 -176 -86 -124 C -100 -84 -96 -36 -58 -4", 7, 0.0, 0.5),
        A("M -58 -4 C -30 4 10 3 44 0 C 58 -1 68 -3 70 -10", 6.5, 0.45, 0.35),
        A("M 70 -10 C 72 -26 62 -48 58 -64 C 56 -98 62 -128 54 -160 C 50 -190 48 -212 40 -228", 7, 0.7, 0.55),
        A("M 50 -60 C 46 -36 48 -18 52 -4", 4.5, 1.15, 0.2),
        A("M -72 -112 C -30 -132 6 -84 0 -34 C -2 -20 8 -8 24 -4", 5, 1.0, 0.35),
        A("M 56 -122 L 46 -116", 3.4, 1.4, 0.08), A("M 58 -102 L 47 -99", 3.4, 1.45, 0.08), A("M -62 -152 L -52 -143", 3.4, 1.5, 0.08),
      ],
      tail: [A("M 0 0 C -46 6 -74 -44 -64 -100 C -60 -124 -42 -138 -26 -130", 6.5, 0.95, 0.4)],
      skull: [A("M -30 4 C -46 -16 -46 -40 -32 -54 C -22 -62 -8 -64 4 -62 C 20 -54 34 -46 48 -36 C 56 -30 52 -22 43 -22 C 38 -8 30 2 20 6 C 6 12 -14 12 -30 4", 7, 1.25, 0.55)],
      earB: [A("M -32 -50 C -36 -66 -32 -80 -26 -92 C -18 -82 -10 -72 -4 -62", 6, 1.7, 0.18)],
      earF: [A("M 6 -62 C 8 -76 14 -88 20 -98 C 26 -86 30 -70 28 -52", 6, 1.8, 0.18)],
      face: [
        A("M 46 -20 C 42 -13 36 -11 30 -14", 3.6, 1.95, 0.1),
        A("M 44 -25 C 58 -30 68 -32 80 -32", 2.6, 2.05, 0.1, { whisk: 1 }), A("M 44 -22 C 60 -22 72 -20 82 -16", 2.6, 2.08, 0.1, { whisk: 1 }), A("M 44 -19 C 56 -16 66 -10 74 -4", 2.6, 2.1, 0.1, { whisk: 1 }),
      ],
      eyeClosed: mk("M 18 -33 C 22 -29 28 -29 32 -33", 3),
      eyeOpen: mk(circ(25, -33, 3.6, 3, 0.02), 2),
      nose: mk(circ(51, -30, 3.6, 5, 0.02), 2),
      mouthO: mk(circ(38, -12, 1, 9, 0), 2),
      patch: patch ? [mk("M -32 -54 C -46 -40 -46 -16 -30 4 C -20 -8 -14 -24 -12 -46 C -18 -52 -24 -56 -32 -54 Z", 3), mk("M -32 -50 C -36 -66 -32 -80 -26 -92 C -18 -82 -10 -72 -4 -62 Z", 3)] : [],
      end: 2.25,
    };
    return cat;
  }
  const CAT1 = buildCat(true), CAT2 = buildCat(false);
  const eachCatStroke = (cat, fn) => ["body", "tail", "skull", "earB", "earF", "face"].forEach((k) => cat[k].forEach((s) => fn(s, k)));
  const rootM = (st) => mm(mT(st.x, st.y), mR(st.tilt * st.sx), mS(st.sx * st.s, st.sy * st.s));
  const headPivotWorld = (st) => xf(rootM(st), 30, -236);
  function lookAngle(st, tx, ty) {
    const R = rootM(st), [hx, hy] = xf(R, 30, -236), vx = tx - hx, vy = ty - hy, det = R[0] * R[3] - R[1] * R[2] || 1e-6;
    const lx = (R[3] * vx - R[2] * vy) / det, ly = (-R[1] * vx + R[0] * vy) / det;
    return clamp(Math.atan2(ly, Math.abs(lx) < 1e-3 ? 1e-3 : lx), -1.0, 0.8);
  }
  function drawCat(g, cat, T0, st, t) {
    const pr = (off, dur) => (T0 === undefined ? 1 : P(t, T0 + off, T0 + off + dur));
    const root = rootM(st), tailM = pivot(root, -90, -30, st.tail), headM = mm(root, mT(30, -236), mR(st.headRot));
    const eB = pivot(headM, -18, -56, st.earB), eF = pivot(headM, 16, -56, st.earF);
    const seed = st.seed || 0;
    // patch first (under the ink)
    const pp = pr(cat.end - 0.15, 0.3);
    cat.patch.forEach((S, i) => fillShape(g, S, i ? eB : headM, INK, { amp: 1.2, seed: 40 + i }));
    if (cat.patch.length && pp < 1) { /* patch shows up when the head is drawn */ }
    cat.body.forEach((s) => drawStroke(g, s.S, root, { w: s.w, p: pr(s.off, s.dur), seed }));
    cat.tail.forEach((s) => drawStroke(g, s.S, tailM, { w: s.w, p: pr(s.off, s.dur), seed }));
    cat.skull.forEach((s) => drawStroke(g, s.S, headM, { w: s.w, p: pr(s.off, s.dur), seed }));
    cat.earB.forEach((s) => drawStroke(g, s.S, eB, { w: s.w, p: pr(s.off, s.dur), seed }));
    cat.earF.forEach((s) => drawStroke(g, s.S, eF, { w: s.w, p: pr(s.off, s.dur), seed }));
    cat.face.forEach((s) => {
      const M = s.whisk ? pivot(headM, 44, -22, st.whisk + (s.S.id % 3 - 1) * 0.04) : headM;
      drawStroke(g, s.S, M, { w: s.w, p: pr(s.off, s.dur), seed });
    });
    const fp = pr(1.95, 0.2);
    if (fp > 0) {
      const eyeOpen = st.blink < 0.55;
      if (eyeOpen) { const sc = st.eyeS || 1; fillShape(g, cat.eyeOpen, mm(headM, mT(25, -33), mS(sc, sc * (1 - st.blink * 1.4)), mT(-25, 33)), INK, { amp: 0.4 }); }
      else drawStroke(g, cat.eyeClosed, headM, { w: 3.8, seed });
      fillShape(g, cat.nose, headM, INK, { amp: 0.4 });
      if (st.mouth > 0.06) fillShape(g, cat.mouthO, mm(headM, mT(38, -12), mS(4 + st.mouth * 3, 2 + st.mouth * 8), mT(-38, 12)), INK, { amp: 0.4 });
    }
  }
  function catShadow(g, x, y, w, a) {
    for (let i = 0; i < 4; i++) { g.fillStyle = `rgba(80,68,50,${a * 0.09})`; g.beginPath(); g.ellipse(x, y + 6, w * (1 - i * 0.16), 15 * (1 - i * 0.14), 0, 0, 7); g.fill(); }
  }

  /* ═════════════ camera + tripod ═════════════ */
  const CAMSC = 0.95, BODY0 = [190, GY - 344 * CAMSC];
  const camA = (d, w, off, dur, extra = {}) => ({ S: mk(d), w, off, dur, ...extra });
  const TRI = [
    camA("M 0 -330 L -90 0", 7, 0.0, 0.4), camA("M 0 -330 L 90 -2", 7, 0.4, 0.4), camA("M 0 -330 L 14 -4", 5.5, 0.75, 0.3),
    camA("M -24 -330 L 24 -330 L 15 -346 L -15 -346 Z", 6, 1.05, 0.3),
    camA("M -52 -160 L 52 -160", 3.6, 1.25, 0.2),
  ];
  const BODY = [
    camA("M -95 0 L -95 -118 C -95 -128 -90 -132 -80 -132 L 46 -132 C 54 -132 58 -128 58 -118 L 58 0 Z", 7, 0.0, 0.7),
    camA("M 58 -112 L 116 -126 L 116 -14 L 58 -26", 6, 0.6, 0.4),
    camA("M 116 -126 C 132 -100 132 -40 116 -14", 5.5, 0.9, 0.25),
    camA("M 122 -106 C 128 -88 128 -52 122 -34", 3.4, 1.05, 0.15),
    camA(circ(-58, -178, 44, 2, 0.05), 6, 0.9, 0.5), camA(circ(4, -170, 36, 4, 0.05), 6, 1.15, 0.45),
    camA("M -58 -178 L -58 -206", 3.4, 1.5, 0.1), camA("M -58 -178 L -34 -164", 3.4, 1.55, 0.1), camA("M -58 -178 L -80 -158", 3.4, 1.6, 0.1),
    camA("M 4 -170 L 4 -192", 3.4, 1.55, 0.1), camA("M 4 -170 L 22 -158", 3.4, 1.6, 0.1), camA("M 4 -170 L -12 -154", 3.4, 1.65, 0.1),
    camA("M -76 -40 L -30 -40", 3.4, 1.7, 0.1), camA("M -76 -28 L -44 -28", 3.4, 1.75, 0.1),
  ];
  const BAND = mk("M -95 -84 L 58 -84 L 58 -56 L -95 -56 Z", 4);
  const BODYWASH = mk("M -95 0 L -95 -118 C -95 -128 -90 -132 -80 -132 L 46 -132 C 54 -132 58 -128 58 -118 L 58 0 Z", 6);
  const TALLY = [-72, -108];
  const camBase = (t) => { const T0 = C.cam0; return { tri: T0, body: T0 + 1.6 }; };

  // camera body physics after the hit
  const CAMSIM = (() => {
    const g = 2600, dt = 1 / 480, N = Math.ceil(5 / dt), out = new Array(N), corners = [[-95, 0], [58, 0], [-95, -132], [58, -132], [116, -126], [116, -14], [-58, -222], [4, -206]];
    let x = BODY0[0], y = BODY0[1], vx = -150, vy = -560, a = 0, w = -5, rest = false; const bounces = [];
    for (let i = 0; i < N; i++) {
      out[i] = [x, y, a];
      if (!rest) {
        vy += g * dt; x += vx * dt; y += vy * dt; a += w * dt;
        let maxY = -1e9; for (const [cx, cy] of corners) maxY = Math.max(maxY, y + (cx * Math.sin(a) + cy * Math.cos(a)) * CAMSC);
        if (maxY > GY) {
          y -= maxY - GY;
          if (Math.abs(vy) > 130) { bounces.push(C.hit + i * dt); vy *= -0.36; vx *= 0.72; w *= -0.5; } else { vy = 0; w *= 0.4; vx *= 0.9; if (Math.abs(vx) < 8) { vx = 0; w = 0; rest = true; } }
        }
      } else { vx = 0; }
    }
    K.derived.camBounces = bounces;
    return (t) => out[Math.min(N - 1, Math.max(0, Math.floor((t - C.hit) / dt)))];
  })();
  const camBodyM = (t) => {
    if (t < C.hit) return mm(mT(BODY0[0], BODY0[1]), mS(CAMSC));
    const [x, y, a] = CAMSIM(t); return mm(mT(x, y), mR(a), mS(CAMSC));
  };
  const triM = (t) => {
    let w = 0; if (t > C.hit) { const d = t - C.hit; w = 0.13 * Math.exp(-3.2 * d) * Math.sin(16 * d); }
    return mm(mT(BODY0[0], GY), mR(w), mS(CAMSC));
  };

  /* ═════════════ the butterfly ═════════════ */
  const BW = [camA("M 0 -6 C 26 -46 70 -34 56 -2 C 46 10 16 8 0 0", 5, 0, 0.3), camA("M 0 4 C 20 6 44 22 32 44 C 22 50 6 32 0 10", 5, 0.2, 0.3)];
  const BBODY = camA("M 0 -16 C 3 -4 3 8 0 22", 6, 0.35, 0.15);
  const BANT = [camA("M 0 -16 C -6 -30 -14 -34 -20 -30", 3, 0.45, 0.1), camA("M 0 -16 C 4 -32 10 -38 18 -34", 3, 0.45, 0.1)];
  const BWASH = [mk("M 0 -6 C 26 -46 70 -34 56 -2 C 46 10 16 8 0 0 Z", 4), mk("M 0 4 C 20 6 44 22 32 44 C 22 50 6 32 0 10 Z", 4)];
  function bflyPos(t) {
    if (t < C.bfly0) return [800, 640, 0];
    if (t < C.flyA) return [800 + Math.sin(t * 9) * 4, 640 + Math.sin(t * 7) * 6, 0.3];
    if (t < C.hit) {
      const u = P(t, C.flyA, C.flyB), e = E.ioC(u);
      return [mix(800, 250, e) + 26 * Math.sin(u * 22), 630 + 55 * Math.sin(u * 11) - 70 * Math.sin(Math.PI * u), 0.3 * Math.cos(u * 22)];
    }
    const v = P(t, C.hit, C.hit + 1.7);
    return [250 + 190 * v + 26 * Math.sin(v * 22), 560 - 900 * E.inC(v) + 20 * Math.sin(v * 9), 0.3];
  }
  function drawButterfly(g, t) {
    if (t < C.bfly0 || t > C.hit + 1.8) return;
    const [bx, by, rot] = bflyPos(t), p = (off, dur) => P(t, C.bfly0 + off, C.bfly0 + off + dur);
    const flap = t < C.bfly0 + 0.6 ? 0.6 : 0.2 + 0.8 * Math.abs(Math.cos(t * 2 * Math.PI * 4.2));
    const base = mm(mT(bx, by), mR(rot), mS(1.15));
    for (const s of [1, -1]) {
      const Mw = mm(base, mS(s * flap, 1));
      BW.forEach((w, i) => { drawStroke(g, w.S, Mw, { w: w.w, p: p(w.off, w.dur) }); if (p(w.off + 0.2, 0.2) > 0.9) fillShape(g, BWASH[i], Mw, "rgba(96,86,70,0.22)", { amp: 0.8 }); });
    }
    drawStroke(g, BBODY.S, base, { w: BBODY.w, p: p(BBODY.off, BBODY.dur) });
    BANT.forEach((a) => drawStroke(g, a.S, base, { w: a.w, p: p(a.off, a.dur) }));
  }

  /* ═════════════ the cats' scripts ═════════════ */
  const CAT_TIMES = { c1: C.cat1, c2: C.cat2 };
  let cat2Head = [560, GY - 250];
  function cat1State(t) {
    const st = { x: 850, y: GY, s: 1.15, sx: -1, sy: 1 + 0.01 * Math.sin(t * 2.1), tilt: 0, headRot: -0.26, earB: 0, earF: 0, tail: 0.1 * Math.sin(t * 2.3 + 1), blink: blinkAt(t, [6.0, 8.2, 12.9, 15.0, 16.6]), mouth: 0, whisk: 0.05 * Math.sin(t * 6), seed: 1, eyeS: 1 };
    st.mouth = Math.sin(Math.PI * P(t, C.meow1, C.meow1 + 0.5)) * 0.8;
    if (t > C.meow1 && t < C.meow1 + 0.5) st.headRot -= 0.12 * Math.sin(Math.PI * P(t, C.meow1, C.meow1 + 0.5));
    st.earB = -0.18 * blinkAt(t, [6.6, 9.4, 12.3], 0.12); st.earF = 0.14 * blinkAt(t, [6.7, 9.5, 12.4], 0.1);
    st.tail += 0.35 * blinkAt(t, [9.9, 10.2], 0.22) - 0.25 * P(t, C.hit, C.hit + 0.3) * (1 - P(t, C.hit + 0.6, C.hit + 1.2));
    const [bx, by] = bflyPos(Math.max(0, t - 0.12)), wB = P(t, 8.7, 9.1) * (1 - P(t, C.hit - 0.1, C.hit + 0.3));
    const wC = P(t, C.look1, C.look1 + 0.5) * (1 - P(t, 13.4, 13.9)), wD = P(t, 13.4, 14.0);
    let rot = st.headRot;
    rot = mix(rot, lookAngle(st, bx, by), wB); rot = mix(rot, lookAngle(st, cat2Head[0], cat2Head[1]), wC); rot = mix(rot, lookAngle(st, 582, 991), wD);
    st.headRot = rot;
    st.eyeS = 1 + 0.35 * wB;
    if (t > C.hit && t < C.hit + 0.3) st.eyeS = 1.6;
    return st;
  }
  function cat2State(t) {
    const st = { x: 560, y: GY, s: 1.08, sx: -1, sy: 1 + 0.01 * Math.sin(t * 2.1 + 1), tilt: 0, headRot: -0.26, earB: 0, earF: 0, tail: 0.1 * Math.sin(t * 2.3 + 2), blink: blinkAt(t, [7.1, 8.9, 13.0]), mouth: 0, whisk: 0.05 * Math.sin(t * 6 + 2), seed: 2, eyeS: 1, air: 0 };
    st.mouth = Math.sin(Math.PI * P(t, C.meow2, C.meow2 + 0.45)) * 0.55;
    st.earB = -0.2 * blinkAt(t, [6.9, 9.2], 0.12);
    const dotPos = [582, 991];
    if (t < C.launch) {
      const cr = E.ioC(P(t, C.crouch, C.crouch + 0.55)), [bx, by] = bflyPos(Math.max(0, t - 0.12)), wB = P(t, 8.8, 9.2);
      st.sy *= 1 - 0.17 * cr; st.tilt = 0.1 * cr; st.eyeS = 1 + 0.6 * cr;
      st.x += P(t, C.crouch + 0.45, C.launch) * Math.sin(t * 46) * 5;
      st.tail += 0.5 * P(t, C.crouch + 0.3, C.launch) * Math.sin(t * 30);
      st.headRot = mix(-0.26, lookAngle(st, bx, by), wB);
      st.blink *= 1 - wB;
    } else if (t < C.hit) {
      const u = P(t, C.launch, C.hit);
      st.x = mix(560, 610, u); st.y = GY - (GY - 745) * u - 250 * 4 * u * (1 - u) * (1 - 0.4 * u);
      st.tilt = 1.15 * E.outC(u); st.sy = 1 + 0.2 * Math.sin(Math.PI * u); st.sx = -1; st.headRot = -0.02; st.eyeS = 1.6; st.tail = -0.3; st.earB = -0.25; st.earF = -0.2;
      st.mouth = 0.5 * u; st.air = 1 - u * 0.2;
    } else {
      const v = P(t, C.hit, C.land);
      st.y = mix(745, GY, E.inQ(v)); st.x = mix(610, 470, E.ioC(v));
      st.tilt = mix(1.15, 0, E.outC(v)); st.sx = mix(-1, 1, sm(P(t, C.hit + 0.15, C.hit + 0.5)));
      st.sy = 1;
      const sq = Math.sin(Math.PI * P(t, C.land, C.land + 0.3)); st.sy = 1 - 0.2 * sq;
      const guilt = P(t, C.hit + 0.3, C.land + 0.2) * (1 - P(t, 13.4, 14.2));
      st.earB = mix(-0.15, -0.95, guilt); st.earF = mix(-0.1, -0.85, guilt);
      st.headRot = mix(-0.02, 0.38, guilt); st.blink = Math.max(st.blink, guilt * 0.9); st.tail = mix(-0.3, -0.55, guilt) + 0.08 * Math.sin(t * 3) * guilt;
      st.eyeS = 1; st.mouth = 0; st.air = 1 - v;
      const wD = P(t, 13.4, 14.2); st.headRot = mix(st.headRot, lookAngle(st, dotPos[0], dotPos[1]), wD);
      if (t > C.land + 0.4) { st.x = 470; st.y = GY; st.tilt = 0; st.sx = 1; }
    }
    const H = headPivotWorld(st); cat2Head = [H[0], H[1]];
    return st;
  }

  /* ═════════════ the REC dot ═════════════ */
  function dotState(t) {
    if (t < C.rec) return null;
    const rBase = 28;
    if (t < C.hit) {
      const M = camBodyM(t), [x, y] = xf(M, TALLY[0], TALLY[1]), pop = E.outBack(P(t, C.rec, C.rec + 0.3));
      return { x, y, r: 11.5 * pop, blink: true, out: true };
    }
    const d = t - C.hit, r = mix(11.5, rBase, E.outC(P(t, C.hit, C.hit + 0.5)));
    const x0 = 121, y0 = 594, gy = GY - rBase;
    const bounce = (a, b, xa, xb, hgt, ya) => { const u = P(t, a, b); return [mix(xa, xb, u), mix(ya, gy, 0) - hgt * 4 * u * (1 - u)]; };
    let x, y;
    if (t < 11.65) { const u = P(t, C.hit, 11.65); x = mix(x0, 215, u); y = mix(y0, gy, u * u) - 300 * Math.sin(Math.PI * u) * (1 - u * 0.6); if (u >= 1) y = gy; }
    else if (t < 11.9) [x, y] = bounce(11.65, 11.9, 215, 255, 110, gy);
    else if (t < 12.02) [x, y] = bounce(11.9, 12.02, 255, 280, 30, gy);
    else { const u = P(t, 12.02, C.dotStop); x = mix(280, 582, E.outC(u)); y = gy; }
    return { x, y, r, blink: t > C.dotStop, out: t < C.erase1 };
  }
  // roll ticks the audio follows
  K.derived.dotHops = [11.65, 11.9, 12.02];
  K.derived.dotRoll = (() => { const a = []; let t = 12.1, gap = 0.05; while (t < C.dotStop) { a.push(t); gap *= 1.09; t += gap; } return a; })();

  /* ═════════════ text ═════════════ */
  const tcache = new Map();
  function measure(g, str, size) {
    const key = str + size; if (tcache.has(key)) return tcache.get(key);
    g.font = `600 ${size}px Caveat`; const ws = [...str].map((c) => g.measureText(c).width), o = { ws, total: ws.reduce((a, b) => a + b, 0) }; tcache.set(key, o); return o;
  }
  const CPS = 0.062;
  function writeText(g, str, cx, y, size, a, out, t, o = {}) {
    if (t < a) return; const m = measure(g, str, size), fade = 1 - P(t, out, out + 0.4); if (fade <= 0) return;
    g.font = `600 ${size}px Caveat`; g.textBaseline = "alphabetic"; g.textAlign = "left"; g.fillStyle = INK;
    let x = cx - m.total / 2; const rot = o.rot === undefined ? -0.012 : o.rot;
    [...str].forEach((c, i) => {
      const ti = a + i * CPS, al = clamp((t - ti) / 0.1) * fade; if (al > 0 && c !== " ") {
        const [dx, dy] = wob(x, y, i + 3); g.globalAlpha = al; g.save(); g.translate(x + dx * 0.8, y + dy * 0.8 + Math.sin(i * 1.7) * 2.4 + (x - cx) * rot); g.rotate(rot + Math.sin(i * 2.1) * 0.02); g.fillText(c, 0, 0); g.restore();
      }
      x += m.ws[i];
    });
    g.globalAlpha = 1;
  }
  K.CAPS.forEach((c) => { const n = [...c.t].length; reg(c.a, n * CPS, 540); });

  /* ═════════════ fx ═════════════ */
  const IMP = [300, 640];
  const BURST = (() => { const a = []; for (let i = 0; i < 16; i++) { const ang = (i / 16) * Math.PI * 2 + (hash(i * 3.1) - 0.5) * 0.2, r0 = 70 + hash(i) * 30, r1 = r0 + 60 + hash(i + 9) * 80; a.push(mk(`M ${f1(IMP[0] + Math.cos(ang) * r0)} ${f1(IMP[1] + Math.sin(ang) * r0)} L ${f1(IMP[0] + Math.cos(ang) * r1)} ${f1(IMP[1] + Math.sin(ang) * r1)}`, 4)); } return a; })();
  const DUST = [0, 1, 2].map((i) => ({ S: mk(circ(0, 0, 1, 20 + i, 0.15), 3), dx: [-90, -20, 60][i], k: [0.9, 1.15, 0.8][i] }));
  const CLAP = [mk("M 0 0 L 0 0 L 1 1", 3)];

  /* ═════════════ logo (canvas paths) ═════════════ */
  const VB = { x: 220, y: 340, w: 660 }, LS = 700 / VB.w, LDOT = { x: 190 + (589.63 - VB.x) * LS, y: 748 + (568.91 - 340) * LS, r: 26.43 * LS };
  let LOGO = [];
  async function loadLogo() {
    const doc = new DOMParser().parseFromString(await (await fetch("/public/hero/rast-sun-logo.svg")).text(), "image/svg+xml");
    for (const n of doc.querySelectorAll("path, polygon, rect")) {
      if (n.tagName === "path") LOGO.push(new Path2D(n.getAttribute("d")));
      else if (n.tagName === "polygon") { const pts = n.getAttribute("points").trim().split(/[\s,]+/).map(Number), p = new Path2D(); for (let i = 0; i < pts.length; i += 2) (i ? p.lineTo : p.moveTo).call(p, pts[i], pts[i + 1]); p.closePath(); LOGO.push(p); }
      else { const p = new Path2D(); p.rect(+n.getAttribute("x"), +n.getAttribute("y"), +n.getAttribute("width"), +n.getAttribute("height")); LOGO.push(p); }
    }
  }

  /* ═════════════ CTA pill ═════════════ */
  const PILL = mk("M 300 1352 C 300 1322 318 1310 350 1310 L 740 1310 C 772 1310 790 1322 790 1352 C 790 1384 772 1396 740 1396 L 350 1396 C 318 1396 300 1384 300 1352 Z", 5);
  const CTA_T = 22.4, PILL_T = 23.1;
  reg(PILL_T, 1.0, 540);

  /* ═════════════ register the pen scratches ═════════════ */
  (() => {
    const cams = C.cam0;
    TRI.forEach((s) => reg(cams + s.off, s.dur, BODY0[0])); BODY.forEach((s) => reg(cams + 1.6 + s.off, s.dur, BODY0[0]));
    eachCatStroke(CAT1, (s) => reg(C.cat1 + s.off, s.dur, 850)); eachCatStroke(CAT2, (s) => reg(C.cat2 + s.off, s.dur, 560));
    BW.forEach((s) => reg(C.bfly0 + s.off, s.dur, 800)); reg(C.bfly0 + 0.35, 0.3, 800);
    [[0.4, 60, 150], [1.0, 60, 320]].forEach(([o]) => reg(cams + 1.7 + o, 0.3, 200));
  })();

  /* ═════════════ the frame ═════════════ */
  const cv = $("#c"), g = cv.getContext("2d"), layer = document.createElement("canvas"); layer.width = W; layer.height = H; const L = layer.getContext("2d");
  let LINEN, GRAIN;
  const GROUND = [
    ["M 70 1040 L 200 1038", C.cam0 + 1.5], ["M 250 1046 L 330 1044", C.cam0 + 1.62], ["M 690 1044 L 800 1042", C.cat1 + 2.0], ["M 900 1040 L 990 1042", C.cat1 + 2.12], ["M 470 1048 L 590 1046", C.cat2 + 2.0],
  ].map(([d, t0]) => ({ S: mk(d, 5), t0 }));
  GROUND.forEach((s) => reg(s.t0, 0.25, 540));

  function render(t) {
    FR = Math.floor(t * 12);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "source-over"; g.globalAlpha = 1; g.drawImage(LINEN, 0, 0);
    // ── the ink layer ──
    L.setTransform(1, 0, 0, 1, 0, 0); L.clearRect(0, 0, W, H);
    const shk = t > C.hit ? 11 * Math.exp(-9 * (t - C.hit)) : 0; L.setTransform(1, 0, 0, 1, Math.sin(t * 90) * shk, Math.cos(t * 77) * shk);
    const cs1 = cat1State(t), cs2 = cat2State(t);
    // shadows
    if (t > C.cam0 + 1.4) catShadow(L, BODY0[0], GY, 120 * CAMSC, clamp((t - C.cam0 - 1.4) * 2));
    if (t > C.cat1 + 1.4) catShadow(L, cs1.x - 10, GY, 190, clamp((t - C.cat1 - 1.4) * 2));
    if (t > C.cat2 + 1.4) catShadow(L, cs2.x + (cs2.sx < 0 ? -10 : 10), GY, 170 * (1 - 0.45 * (cs2.air || 0)), clamp((t - C.cat2 - 1.4) * 2) * (1 - 0.5 * (cs2.air || 0)));
    GROUND.forEach((s) => drawStroke(L, s.S, mI(), { w: 3.4, p: P(t, s.t0, s.t0 + 0.25) }));
    // tripod + camera
    const tm = triM(t);
    TRI.forEach((s) => drawStroke(L, s.S, tm, { w: s.w, p: P(t, C.cam0 + s.off, C.cam0 + s.off + s.dur) }));
    const bm = camBodyM(t), bT = C.cam0 + 1.6;
    if (t > bT + 0.6) fillShape(L, BODYWASH, bm, "rgba(96,86,70,0.13)", { amp: 0.6 });
    const bandP = E.outC(P(t, bT + 1.1, bT + 1.4));
    if (bandP > 0) fillShape(L, BAND, mm(bm, mT(0, -70), mS(1, bandP), mT(0, 70)), RED, { ox: 7, oy: 5, amp: 2.4, seed: 5 });
    BODY.forEach((s) => drawStroke(L, s.S, bm, { w: s.w, p: P(t, bT + s.off, bT + s.off + s.dur) }));
    // cats (cat 2 in front)
    drawCat(L, CAT1, C.cat1, cs1, t); drawCat(L, CAT2, C.cat2, cs2, t);
    drawButterfly(L, t);
    // impact fx
    const hp = t - C.hit;
    if (hp >= 0 && hp < 0.7) BURST.forEach((s) => { L.globalAlpha = 1 - P(hp, 0.15, 0.65); drawStroke(L, s, mI(), { w: 5, p: E.outC(P(hp, 0, 0.12)) }); L.globalAlpha = 1; });
    const dp = t - C.land;
    if (dp >= 0 && dp < 0.9) DUST.forEach((d) => { const u = P(dp, 0, 0.9); L.globalAlpha = (1 - u) * 0.9; drawStroke(L, d.S, mm(mT(cs2.x + d.dx, GY - 26 - 24 * u), mS(16 + 70 * d.k * E.outC(u))), { w: 4, p: 1 }); L.globalAlpha = 1; });
    // compose
    const er = P(t, C.erase0, C.erase1); g.globalCompositeOperation = "multiply"; g.globalAlpha = 1 - er; g.drawImage(layer, 0, 0); g.globalAlpha = 1;
    // the dot
    const ds = dotState(t);
    if (ds && ds.r > 0.5) {
      const on = !ds.blink || ((t - C.rec) % 1.0) < 0.62;
      if (on) {
        g.save(); g.setTransform(1, 0, 0, 1, t > C.hit ? Math.sin(t * 90) * shk : 0, 0);
        const C0 = { x: ds.x, y: ds.y };
        const S = mk(circ(0, 0, 1, 31, 0.06), 3);
        fillShape(g, S, mm(mT(C0.x + 3, C0.y + 2), mS(ds.r)), RED, { amp: 0.8, seed: 9 });
        if (ds.out) { const o = 1 - P(t, C.erase0, C.erase1); g.globalAlpha = o; drawStroke(g, S, mm(mT(C0.x, C0.y), mS(ds.r * 0.98)), { w: 4.2 * Math.min(1, ds.r / 20), p: 1, seed: 6 }); g.globalAlpha = 1; }
        g.restore();
      }
    }
    // GÜM!
    if (hp >= 0 && hp < 1.2) {
      const al = 1 - P(hp, 0.85, 1.2), sc = E.outBack(P(hp, 0, 0.16)); g.save(); g.globalAlpha = al; g.translate(330, 470); g.rotate(-0.14 + Math.sin(hp * 60) * 0.02 * (1 - hp)); g.scale(sc, sc);
      g.font = "600 210px Caveat"; g.fillStyle = INK; g.textAlign = "center"; g.fillText("GÜM!", 0, 0); g.restore(); g.globalAlpha = 1;
    }
    // captions
    K.CAPS.forEach((c) => writeText(g, c.t, 540, c.y, c.size, c.a, c.out, t));
    // logo
    if (t >= C.logo0) {
      const rp = E.outC(P(t, C.logo0 + 0.05, C.logo1)), r = mix(0, 900, rp);
      g.save(); g.beginPath();
      for (let i = 0; i <= 72; i++) { const a = (i / 72) * Math.PI * 2, rr = r * (1 + 0.05 * (vnoise(Math.cos(a) * 3 + 5, Math.sin(a) * 3 + FR * 0.3) - 0.5)); (i ? g.lineTo : g.moveTo).call(g, LDOT.x + Math.cos(a) * rr, LDOT.y + Math.sin(a) * rr); }
      g.closePath(); g.clip(); g.translate(190 - VB.x * LS, 748 - VB.y * LS); g.scale(LS, LS); g.fillStyle = INK; LOGO.forEach((p) => g.fill(p)); g.restore();
      // the dot stays red on top
      const S = mk(circ(0, 0, 1, 31, 0.03), 3); fillShape(g, S, mm(mT(LDOT.x, LDOT.y), mS(LDOT.r + 0.6)), RED, { amp: 0.4 });
    }
    // CTA
    writeText(g, "Ücretsiz ön görüşme için", 540, 1235, 62, CTA_T, 99, t, { rot: 0 });
    if (t > PILL_T) {
      drawStroke(g, PILL, mI(), { w: 5, p: P(t, PILL_T, PILL_T + 0.8) });
      writeText(g, "rastcreative.com", 540, 1372, 78, PILL_T + 0.5, 99, t, { rot: 0 });
    }
    g.globalCompositeOperation = "source-over";
    // grain + fade to linen
    g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.22; g.fillStyle = g.createPattern(GRAIN, "repeat"); g.save(); g.translate(hash(FR * 1.3) * 256, hash(FR * 2.7) * 256); g.fillRect(-256, -256, W + 512, H + 512); g.restore(); g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
    const fin = 1 - P(t, 0, 0.5), fo = P(t, C.end0, DUR - 0.05); const fade = Math.max(0, fo);
    if (fade > 0) { g.globalAlpha = fade; g.drawImage(LINEN, 0, 0); g.globalAlpha = 1; }
    if (fin > 0) { g.globalAlpha = fin * 0.0; }
  }

  async function init() {
    await document.fonts.load("600 100px Caveat", "Bugün çekim günü. ğışİçöÜÇ");
    await loadLogo();
    LINEN = makeLinen(); GRAIN = makeGrain();
  }
  const raf = () => new Promise((r) => requestAnimationFrame(() => r()));
  window.__ready = init();
  window.__meta = { fps: FPS, duration: DUR, width: W, height: H };
  window.__render = async (t) => { render(t); await raf(); };

  if (/[?&]preview/.test(location.search)) {
    const ui = $("#ui"), play = $("#play"), scrub = $("#scrub"), tc = $("#tcu"), stage = $("#stage");
    ui.style.display = "flex";
    const fit = () => (stage.style.transform = `scale(${Math.min(innerWidth / 1080, (innerHeight - 44) / 1920)})`);
    window.__ready.then(() => { fit(); render(0); });
    addEventListener("resize", fit);
    let playing = false, t0 = 0, from = 0, actx = null, buf = null, node = null;
    const loop = () => { if (!playing) return; const t = from + (performance.now() - t0) / 1000; if (t >= DUR) { playing = false; return; } render(t); scrub.value = t; tc.textContent = t.toFixed(2); requestAnimationFrame(loop); };
    play.onclick = async () => {
      if (playing) { playing = false; node?.stop(); return; }
      if (!buf && window.InkAudio) { play.textContent = "…"; actx = new AudioContext(); buf = await window.InkAudio.render(); }
      from = +scrub.value; t0 = performance.now(); playing = true; play.textContent = "❚❚";
      if (buf) { node = actx.createBufferSource(); node.buffer = buf; node.connect(actx.destination); node.start(0, from); }
      loop();
    };
    scrub.oninput = () => { if (!playing) { render(+scrub.value); tc.textContent = (+scrub.value).toFixed(2); } };
  }
})();
