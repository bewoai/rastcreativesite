/*
 * Rast Creative — "Takımyıldız" · sound
 * ------------------------------------------------------------------
 * 120 BPM (beat 0.5 s), D minor, rendered offline on the picture's grid.
 * Each star is a note: the Sakarya stars climb a D-minor pentatonic, the far
 * stars ring an octave up. The logo lands on the only D-major chord.
 *   b0–6 sky · b6–24 Sakarya (pulse wakes) · b24–40 Turkey (full groove)
 *   b40–44 the sky gathers (riser, groove out) · b44 hit · end card
 *
 *   window.StarsAudio.render() → AudioBuffer
 *   window.__audio()           → base64 WAV
 */
(() => {
  "use strict";
  const SR = 48000, DUR = 26, BT = 0.5, S16 = BT / 4;
  const b = (n) => n * BT;
  const hz = (m) => 440 * 2 ** ((m - 69) / 12);
  const CH = {
    Dm: { pad: [50, 57, 62, 65, 69], bass: 26, arp: [62, 65, 69, 74] },
    Bb: { pad: [46, 53, 58, 62, 65], bass: 22, arp: [58, 62, 65, 70] },
    F: { pad: [41, 53, 57, 60, 65], bass: 29, arp: [60, 65, 69, 72] },
    C: { pad: [48, 55, 60, 64, 67], bass: 24, arp: [60, 64, 67, 72] },
    D: { pad: [50, 57, 62, 66, 69, 74], bass: 26, arp: [62, 66, 69, 74] },
  };
  const HARM = [[0, "Dm"], [24, "Dm"], [28, "Bb"], [32, "F"], [36, "C"], [40, "Bb"], [44, "D"]];
  const chordAt = (t) => { let c = "Dm"; for (const [n, k] of HARM) if (t >= b(n) - 1e-6) c = k; return c; };
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let r = Math.imul(seed ^ (seed >>> 15), 1 | seed); r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }

  async function render() {
    const ctx = new OfflineAudioContext(2, SR * DUR, SR);
    const R = rng(128);
    const master = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -12; comp.ratio.value = 3.5; comp.knee.value = 6; comp.attack.value = 0.006; comp.release.value = 0.16;
    comp.connect(master).connect(ctx.destination);
    const bus = ctx.createGain(); bus.connect(comp);
    const sfx = ctx.createGain(); sfx.gain.value = 0.35; sfx.connect(bus); // SFX stay subtle
    const pumpG = ctx.createGain(); pumpG.connect(bus);                   // sidechained music

    const ir = ctx.createBuffer(2, SR * 3.5, SR);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let lp = 0; for (let i = 0; i < d.length; i++) { lp += 0.25 * ((R() * 2 - 1) - lp); d[i] = lp * Math.exp(-i / SR / 1.1); } }
    const verb = ctx.createConvolver(); verb.buffer = ir;
    const verbIn = ctx.createGain(); verbIn.connect(verb).connect(bus);
    const dly = ctx.createDelay(2); dly.delayTime.value = BT * 0.75;
    const fb = ctx.createGain(); fb.gain.value = 0.35;
    const dlp = ctx.createBiquadFilter(); dlp.type = "lowpass"; dlp.frequency.value = 2400;
    const dlyIn = ctx.createGain(); dlyIn.connect(dly).connect(dlp).connect(fb).connect(dly);
    const dOut = ctx.createGain(); dOut.gain.value = 0.5; dlp.connect(dOut); dOut.connect(pumpG);

    const noise = ctx.createBuffer(1, SR * 2, SR);
    { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = R() * 2 - 1; }
    const nsrc = (t, dur) => { const s = ctx.createBufferSource(); s.buffer = noise; s.loop = true; s.start(t, R() * 1.5); s.stop(t + dur + 0.1); return s; };
    const osc = (type, f, t, dur, det = 0) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = det; o.start(t); o.stop(t + dur + 0.05); return o; };
    const env = (g, t, a, peak, d) => { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setTargetAtTime(0, t + a, d / 4); };
    const out = (node, { to = bus, pan = 0, send = 0, delay = 0, gain = 1 } = {}) => {
      const g = ctx.createGain(); g.gain.value = gain;
      const p = ctx.createStereoPanner(); p.pan.value = pan;
      node.connect(g).connect(p).connect(to);
      if (send) { const x = ctx.createGain(); x.gain.value = send; p.connect(x).connect(verbIn); }
      if (delay) { const x = ctx.createGain(); x.gain.value = delay; p.connect(x).connect(dlyIn); }
      return p;
    };
    const M = (node, o = {}) => out(node, { ...o, to: pumpG });
    const pump = (t, depth = 0.25) => { pumpG.gain.setTargetAtTime(depth, t, 0.004); pumpG.gain.setTargetAtTime(1, t + 0.03, 0.06); };

    /* ───── instruments ───── */
    function kick(t, vol = 1, lp = 20000) {
      const o = ctx.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(52, t + 0.07); o.frequency.exponentialRampToValueAtTime(42, t + 0.3);
      o.start(t); o.stop(t + 0.5);
      const sh = ctx.createWaveShaper(); const cv = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; cv[i] = Math.tanh(x * 2.2); } sh.curve = cv;
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = lp;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.9 * vol, t + 0.002); g.gain.setTargetAtTime(0.45 * vol, t + 0.01, 0.08); g.gain.setTargetAtTime(0, t + 0.2, 0.05);
      o.connect(sh).connect(f).connect(g); out(g, { gain: 0.8 });
      const n = nsrc(t, 0.015); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 3000;
      const ng = ctx.createGain(); env(ng, t, 0.0005, 0.18 * vol * (lp > 5000 ? 1 : 0.15), 0.006); n.connect(hp).connect(ng); out(ng);
      pump(t);
    }
    function rumble(t, root, vol = 1) {
      // Techno rumble: the kick's tail through a dark reverb-ish low band, on the offbeat.
      const o = osc("sine", hz(root + 12), t, BT * 0.5); const o2 = osc("triangle", hz(root + 12), t, BT * 0.5, 8);
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 180;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16 * vol, t + 0.03); g.gain.setTargetAtTime(0, t + 0.08, 0.06);
      o.connect(f); o2.connect(f); f.connect(g); M(g);
    }
    function clap(t, vol = 1) {
      [0, 0.01, 0.021].forEach((o, i) => { const n = nsrc(t + o, 0.3); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1300; bp.Q.value = 0.9; const g = ctx.createGain(); env(g, t + o, 0.001, (i === 2 ? 0.26 : 0.14) * vol, i === 2 ? 0.24 : 0.02); n.connect(bp).connect(g); out(g, { send: 0.45 }); });
    }
    function hat(t, vol = 1, open = false, pan = 0.2) {
      const n = nsrc(t, open ? 0.3 : 0.06); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = open ? 7000 : 8500;
      const g = ctx.createGain(); env(g, t, 0.001, 0.08 * vol, open ? 0.2 : 0.028); n.connect(hp).connect(g); out(g, { pan, send: 0.05 });
    }
    function ride(t, vol = 1) {
      [1, 1.47, 2.09, 2.76].forEach((r) => { const g = ctx.createGain(); env(g, t, 0.001, 0.012 * vol, 0.35); osc("square", 520 * r, t, 0.5).connect(g); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 6000; g.connect(hp); out(hp, { pan: -0.3, send: 0.1 }); });
    }
    function rbass(t, m, vol = 1, cut = 700) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 5; f.frequency.setValueAtTime(cut * 2, t); f.frequency.exponentialRampToValueAtTime(cut * 0.3, t + 0.08);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.2 * vol, t + 0.004); g.gain.setTargetAtTime(0, t + S16 * 0.7, 0.012);
      osc("sawtooth", hz(m), t, S16 + 0.1).connect(f); const sub = osc("sine", hz(m), t, S16 + 0.1); sub.connect(g); f.connect(g); M(g);
    }
    function acid(t, m, vol = 1, cut = 800, acc = false) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 14;
      f.frequency.setValueAtTime(cut * (acc ? 3.2 : 1.8), t); f.frequency.exponentialRampToValueAtTime(cut * 0.35, t + S16 * 0.9);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.06 * vol * (acc ? 1.4 : 1), t + 0.003); g.gain.setTargetAtTime(0, t + S16 * 0.8, 0.02);
      osc("sawtooth", hz(m), t, S16 + 0.1).connect(f);
      const sh = ctx.createWaveShaper(); const cv = new Float32Array(512); for (let i = 0; i < 512; i++) { const x = i / 255.5 - 1; cv[i] = Math.tanh(x * 3); } sh.curve = cv;
      f.connect(sh).connect(g); M(g, { pan: 0.1, delay: 0.25, send: 0.08 });
    }
    function pad(t, dur, ch, { vol = 1, cut = 900, cut2 = cut, att = 0.8 } = {}) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 0.7;
      f.frequency.setValueAtTime(cut, t); f.frequency.linearRampToValueAtTime(cut2, t + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.04 * vol, t + att);
      g.gain.setValueAtTime(0.04 * vol, t + dur); g.gain.linearRampToValueAtTime(0, t + dur + 1.2);
      f.connect(g); M(g, { send: 0.6 });
      CH[ch].pad.forEach((m, i) => { for (const d of [-9, 9]) { const o = osc("sawtooth", hz(m), t, dur + 1.3, d + (R() - 0.5) * 5); const og = ctx.createGain(); og.gain.value = 0.35; const p = ctx.createStereoPanner(); p.pan.value = (i / 4 - 0.5) * 0.9 * Math.sign(d); o.connect(og).connect(p).connect(f); } });
    }
    function stab(t, ch, vol = 1, cut = 1800) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(cut, t); f.frequency.exponentialRampToValueAtTime(cut * 0.3, t + 0.2); f.Q.value = 3;
      const g = ctx.createGain(); env(g, t, 0.003, 0.05 * vol, 0.16);
      CH[ch].pad.slice(1).forEach((m) => { for (const d of [-10, 10]) osc("sawtooth", hz(m + 12), t, 0.35, d).connect(f); });
      f.connect(g); M(g, { send: 0.3, delay: 0.4 });
    }
    function drone(t, dur, root = 29, vol = 1) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(140, t); f.frequency.linearRampToValueAtTime(420, t + dur); f.Q.value = 3;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.2 * vol, t + 1.5); g.gain.setValueAtTime(0.2 * vol, t + dur - 0.6); g.gain.linearRampToValueAtTime(0, t + dur);
      osc("sawtooth", hz(root), t, dur, -6).connect(f); osc("sawtooth", hz(root + 12), t, dur, 5).connect(f); osc("sawtooth", hz(root + 7), t, dur, 3).connect(f);
      osc("sine", hz(root), t, dur).connect(g); f.connect(g); out(g, { send: 0.35 });
    }
    function braam(t, vol = 1, dur = 2, root = 29) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 3;
      f.frequency.setValueAtTime(120, t); f.frequency.exponentialRampToValueAtTime(1100, t + 0.2); f.frequency.exponentialRampToValueAtTime(150, t + dur);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.26 * vol, t + 0.04); g.gain.setTargetAtTime(0, t + 0.3, dur / 3);
      [root, root + 7, root + 12, root + 15].forEach((m, i) => { for (const d of [-14, 0, 14]) osc("sawtooth", hz(m), t, dur + 0.4, d + i).connect(f); });
      f.connect(g); out(g, { send: 0.5 });
    }
    function boom(t, vol = 1) {
      vol *= 0.7;
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(80, t); o.frequency.exponentialRampToValueAtTime(29, t + 1.4); o.start(t); o.stop(t + 2.6);
      const g = ctx.createGain(); env(g, t, 0.003, 0.9 * vol, 1.8); o.connect(g); out(g, { send: 0.2 });
      const n = nsrc(t, 1.4); const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 320;
      const ng = ctx.createGain(); env(ng, t, 0.003, 0.5 * vol, 0.9); n.connect(lp).connect(ng); out(ng, { send: 0.5 });
    }
    function crash(t, vol = 1) { const n = nsrc(t, 2.5); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 5000; const g = ctx.createGain(); env(g, t, 0.002, 0.14 * vol, 2.2); n.connect(hp).connect(g); out(g, { send: 0.4, pan: 0.1 }); }
    function riser(a, c, vol = 1) {
      vol *= 0.55;
      const n = nsrc(a, c - a); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.4;
      bp.frequency.setValueAtTime(300, a); bp.frequency.exponentialRampToValueAtTime(9000, c);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.3 * vol, c - 0.02); g.gain.linearRampToValueAtTime(0, c + 0.02);
      n.connect(bp).connect(g); out(g, { send: 0.4 });
      const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(hz(41), a); o.frequency.exponentialRampToValueAtTime(hz(77), c); o.start(a); o.stop(c + 0.05);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1600;
      const og = ctx.createGain(); og.gain.setValueAtTime(0.0001, a); og.gain.exponentialRampToValueAtTime(0.04 * vol, c - 0.02); og.gain.linearRampToValueAtTime(0, c + 0.02);
      o.connect(lp).connect(og); out(og, { send: 0.3 });
    }
    function reverse(a, c, vol = 1) {
      vol *= 0.55;
      const n = nsrc(a, c - a); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.setValueAtTime(1800, a); hp.frequency.exponentialRampToValueAtTime(5000, c);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.22 * vol, c - 0.01); g.gain.linearRampToValueAtTime(0, c + 0.01);
      n.connect(hp).connect(g); out(g, { send: 0.5 });
    }
    function snare(t, vol = 1) { const n = nsrc(t, 0.2); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1800; bp.Q.value = 0.8; const g = ctx.createGain(); env(g, t, 0.001, 0.18 * vol, 0.08); n.connect(bp).connect(g); out(g, { send: 0.25 }); }
    function roll(a, c, vol = 1) { let t = a; while (t < c - 0.01) { const p = (t - a) / (c - a); snare(t, (0.2 + 0.8 * p * p) * vol); t += p < 0.5 ? BT / 2 : p < 0.8 ? BT / 4 : BT / 8; } }
    function heart(t, vol = 1) { [0, 0.19].forEach((o, i) => { const s = ctx.createOscillator(); s.type = "sine"; s.frequency.setValueAtTime(72, t + o); s.frequency.exponentialRampToValueAtTime(38, t + o + 0.15); s.start(t + o); s.stop(t + o + 0.35); const g = ctx.createGain(); env(g, t + o, 0.004, (i ? 0.32 : 0.55) * vol, 0.22); s.connect(g); out(g); }); }
    function bell(t, m, vol = 1, dec = 2.4, pan = 0) { [[1, 1], [2, 0.4], [3.01, 0.2], [4.2, 0.1]].forEach(([r, a], i) => { const g = ctx.createGain(); env(g, t, 0.003, 0.07 * vol * a, dec / (1 + i * 0.6)); osc("sine", hz(m) * r, t, dec + 0.5).connect(g); out(g, { pan, send: 0.6, delay: 0.3 }); }); }
    // SFX
    function blip(t, f = 1800, vol = 1, pan = 0) { const g = ctx.createGain(); env(g, t, 0.002, 0.1 * vol, 0.08); osc("sine", f, t, 0.15).connect(g); out(g, { to: sfx, pan, send: 0.2 }); }
    function swish(t, vol = 1, dir = 1) {
      const dur = 0.3, a = t - dur * 0.55, n = nsrc(a, dur + 0.1);
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.2; bp.frequency.setValueAtTime(700, a); bp.frequency.exponentialRampToValueAtTime(5200, t); bp.frequency.exponentialRampToValueAtTime(1200, a + dur);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.35 * vol, t); g.gain.exponentialRampToValueAtTime(0.0001, a + dur);
      const p = ctx.createStereoPanner(); p.pan.setValueAtTime(-0.7 * dir, a); p.pan.linearRampToValueAtTime(0.7 * dir, a + dur);
      n.connect(bp).connect(g).connect(p).connect(sfx);
    }
    function click(t, vol = 1) {
      const n = nsrc(t, 0.03); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2400; bp.Q.value = 3;
      const g = ctx.createGain(); env(g, t, 0.0005, 0.4 * vol, 0.014); n.connect(bp).connect(g); out(g, { to: sfx, send: 0.15 });
      const o = ctx.createGain(); env(o, t, 0.001, 0.12 * vol, 0.03); osc("triangle", 180, t, 0.06).connect(o); out(o, { to: sfx });
    }
    function zap(t, vol = 1) { const o = ctx.createOscillator(); o.type = "square"; o.frequency.setValueAtTime(2400, t); o.frequency.exponentialRampToValueAtTime(120, t + 0.12); o.start(t); o.stop(t + 0.14); const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3000; const g = ctx.createGain(); env(g, t, 0.001, 0.06 * vol, 0.08); o.connect(lp).connect(g); out(g, { to: sfx }); }

    /* ═════════ SCORE ═════════ */
    // I · the sky (b0–6): drone, the sun wakes, glassy shimmer.
    drone(0.1, b(10), 26, 0.8);
    pad(0.2, b(12), "Dm", { vol: 0.6, cut: 400, cut2: 1300, att: 2.5 });
    zap(0.16, 0.5); bell(0.2, 74, 0.5, 3.5);
    for (let n = 2; n < 6; n++) bell(b(n) + 0.02, [81, 86, 84, 89][n - 2], 0.18, 2.4, (n % 2 ? 0.5 : -0.5));
    reverse(b(4.2), b(6), 0.6);
    // II · Sakarya (b6–24): the map draws, the pulse wakes, a note per star.
    riser(b(6), b(9), 0.45);
    for (let n = 8; n < 24; n++) {
      const lp = 300 + Math.min(1, (n - 8) / 10) * 5000;
      if (n >= 10) kick(b(n), 0.75, lp);
      hat(b(n + 0.5), n < 14 ? 0.25 : 0.5, false, 0.25);
      for (const q of [1, 2, 3]) if (n >= 12) rbass(b(n) + q * S16, CH.Dm.bass + 12, 0.55, 400 + (n - 12) * 60);
    }
    for (let n = 16; n < 24; n += 0.5) hat(b(n) + S16, 0.14, false, -0.3);
    [74, 77, 79, 81, 84, 86].forEach((m, i) => { const t = b(10 + 2 * i); bell(t, m, 0.75, 2.6, (i - 2.5) * 0.2); swish(t - 0.02, 0.35, i % 2 ? 1 : -1); });
    pad(b(12), b(12), "Dm", { vol: 0.35, cut: 900, cut2: 1600, att: 0.8 });
    riser(b(21), b(24), 1); roll(b(22), b(24), 0.8); reverse(b(23), b(24), 1);
    // III · Turkey (b24–40): full groove, arcs whoosh, far stars ring an octave up.
    boom(b(24), 1); braam(b(24), 0.55, 2, 26); crash(b(24), 0.8);
    for (let n = 24 * 4; n < 40 * 4; n++) {
      const t = n * S16, q = n % 4, beat = Math.floor(n / 4), c = chordAt(t);
      if (q === 0) kick(t, 1);
      if (q === 0 && beat % 2 === 1) clap(t, 0.8);
      hat(t, q === 2 ? 0.7 : 0.25, q === 2, 0.22);
      if (q !== 0) rbass(t, CH[c].bass + 12 + (q === 3 && beat % 4 === 3 ? 12 : 0), 0.95, 700);
      if (n % 2 === 0) acid(t, CH[c].arp[(n / 2) % 4] - 12, 0.55, 900, n % 8 === 6);
      if (q === 3 && beat % 2 === 1) stab(t, c, 0.7, 1800);
    }
    [[24, "Dm"], [28, "Bb"], [32, "F"], [36, "C"]].forEach(([n, c]) => pad(b(n), b(4), c, { vol: 0.4, cut: 1200, cut2: 1800, att: 0.1 }));
    [27.1, 31.1].forEach((n) => riser(b(n), b(n + 1.9), 0.35));
    bell(b(28), 86, 0.9, 3, -0.4); bell(b(28) + 0.12, 93, 0.4, 2.5, -0.4);
    bell(b(32), 89, 0.9, 3, 0.4); bell(b(32) + 0.12, 98, 0.4, 2.5, 0.4);
    crash(b(32), 0.5); crash(b(36), 0.6);
    for (let k = 0; k < 10; k++) blip(b(36.5) + k * 0.085, 1600 + k * 90, 0.35, (k % 2 ? 0.3 : -0.3));
    // IV · the sky gathers (b40–44): groove out, everything rises.
    pad(b(40), b(4), "Bb", { vol: 0.9, cut: 700, cut2: 3000, att: 0.4 });
    riser(b(40), b(44), 1.2); reverse(b(42.5), b(44), 1.2);
    for (let k = 0; k < 24; k++) bell(b(40) + k * 0.145, [74, 77, 81, 84, 86, 89][k % 6] + (k > 12 ? 12 : 0), 0.16 + k * 0.012, 1.6, Math.sin(k) * 0.7);
    // V · the logo (b44): the only D-major chord.
    boom(b(44), 1.2); braam(b(44), 0.6, 2.6, 26); crash(b(44), 1);
    pad(b(44), DUR - b(44) - 1.2, "D", { vol: 1.1, cut: 2600, cut2: 900, att: 0.05 });
    [74, 78, 81, 86, 90].forEach((m, i) => bell(b(44) + 0.04 + i * 0.07, m, 0.45, 3.2, (i - 2) * 0.3));
    drone(b(44), DUR - b(44), 26, 0.6);
    for (let n = 45; n < 51; n++) kick(b(n), 0.5 * (1 - (n - 45) / 7), 450);
    bell(b(46.5), 86, 0.5, 3); bell(b(47.5), 90, 0.35, 3, 0.3);

    master.gain.setValueAtTime(1, DUR - 0.9);
    master.gain.linearRampToValueAtTime(0, DUR - 0.05);
    const o = await ctx.startRendering();
    let peak = 0;
    for (let c = 0; c < 2; c++) { const d = o.getChannelData(c); for (let i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i])); }
    const k = 0.891 / (peak || 1);
    for (let c = 0; c < 2; c++) { const d = o.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] *= k; }
    return o;
  }

  function toWav(buf) {
    const n = buf.length, bytes = new ArrayBuffer(44 + n * 4), v = new DataView(bytes);
    const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, "RIFF"); v.setUint32(4, 36 + n * 4, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
    v.setUint32(24, SR, true); v.setUint32(28, SR * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 4, true);
    const L = buf.getChannelData(0), Rr = buf.getChannelData(1); let o = 44;
    for (let i = 0; i < n; i++) for (const d of [L, Rr]) { const s = Math.max(-1, Math.min(1, d[i])); v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true); o += 2; }
    const u8 = new Uint8Array(bytes); let bin = "";
    for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  window.StarsAudio = { render };
  window.__audio = async () => toWav(await render());
})();
