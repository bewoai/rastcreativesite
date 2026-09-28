/*
 * Rast Creative — "Çekim Günü" · sound
 * ------------------------------------------------------------------
 * Energetic pop at 120 BPM (D · A · Bm · G): a filtered tease in the studio,
 * a build on the sunglasses, the drop on the highway, a muffled slow-mo
 * through the truck gap that snaps back, the groove through the clinic, a
 * riser into Enter — then the music stops dead on the jaw drop: only the
 * heart monitor. The logo lands on the tonic.
 * SFX stay subtle: engine, drone, whooshes, a fist bump, the clapper, a key.
 *
 *   window.CekimAudio.render() → AudioBuffer
 *   window.__audio()           → base64 WAV
 */
(() => {
  "use strict";
  const SR = 48000;
  const hz = (m) => 440 * 2 ** ((m - 69) / 12);
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let r = Math.imul(seed ^ (seed >>> 15), 1 | seed); r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
  // chord: bass + voicing
  const CH = {
    D: { bass: 38, v: [62, 66, 69, 74] }, A: { bass: 33, v: [61, 64, 69, 73] },
    Bm: { bass: 35, v: [62, 66, 71, 74] }, G: { bass: 31, v: [62, 67, 71, 74] },
  };
  const LOOP = ["D", "A", "Bm", "G"];
  // hook: [16th in a 2-bar phrase, midi, length in 16ths]
  const MEL = {
    D: [[0, 69, 2], [3, 66, 2], [6, 69, 2], [8, 71, 2], [10, 69, 2], [12, 66, 2], [14, 64, 2], [16, 62, 5], [22, 64, 2], [24, 66, 6]],
    A: [[0, 76, 2], [3, 73, 2], [6, 69, 2], [8, 71, 2], [10, 73, 2], [12, 76, 2], [14, 74, 2], [16, 73, 5], [22, 71, 2], [24, 69, 6]],
    Bm: [[0, 78, 2], [3, 74, 2], [6, 71, 2], [8, 73, 2], [10, 74, 2], [12, 78, 2], [14, 76, 2], [16, 74, 5], [22, 73, 2], [24, 71, 6]],
    G: [[0, 74, 2], [3, 71, 2], [6, 67, 2], [8, 69, 2], [10, 71, 2], [12, 74, 2], [14, 76, 2], [16, 78, 5], [22, 76, 2], [24, 73, 6]],
  };

  async function render() {
    const K = window.CEKIM, C = K.CUE, DUR = K.DUR;
    const BEAT = 60 / K.BPM, S16 = BEAT / 4, BAR = BEAT * 4;
    const ctx = new OfflineAudioContext(2, SR * DUR, SR);
    const R = rng(47);
    const master = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 3; comp.knee.value = 8; comp.attack.value = 0.006; comp.release.value = 0.2;
    comp.connect(master).connect(ctx.destination);
    const bus = ctx.createGain(); bus.connect(comp);
    // music runs through a filter the slow-mo can close
    const mlp = ctx.createBiquadFilter(); mlp.type = "lowpass"; mlp.frequency.value = 20000; mlp.Q.value = 0.7;
    const music = ctx.createGain(); music.gain.value = 0.9; music.connect(mlp).connect(bus);
    const sfx = ctx.createGain(); sfx.gain.value = 0.55; sfx.connect(bus);

    const ir = ctx.createBuffer(2, SR * 3, SR);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let lp = 0; for (let i = 0; i < d.length; i++) { lp += 0.3 * ((R() * 2 - 1) - lp); d[i] = lp * Math.exp(-i / SR / 0.7); } }
    const verb = ctx.createConvolver(); verb.buffer = ir;
    const verbIn = ctx.createGain(); verbIn.connect(verb).connect(bus);

    const noise = ctx.createBuffer(1, SR * 2, SR);
    { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = R() * 2 - 1; }
    const nsrc = (t, dur) => { const s = ctx.createBufferSource(); s.buffer = noise; s.loop = true; s.start(Math.max(0, t), R() * 1.5); s.stop(t + dur + 0.1); return s; };
    const osc = (type, f, t, dur, det = 0) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = det; o.start(Math.max(0, t)); o.stop(t + dur + 0.05); return o; };
    const env = (g, t, a, peak, d) => { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setTargetAtTime(0, t + a, d / 4); };
    const out = (node, { to = music, pan = 0, send = 0, gain = 1 } = {}) => {
      const g = ctx.createGain(); g.gain.value = gain; const p = ctx.createStereoPanner(); p.pan.value = pan;
      node.connect(g).connect(p).connect(to);
      if (send) { const x = ctx.createGain(); x.gain.value = send; p.connect(x).connect(verbIn); }
    };

    /* ───── drums ───── */
    function kick(t, v = 1) {
      const o = ctx.createOscillator(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12); o.start(t); o.stop(t + 0.45);
      const g = ctx.createGain(); env(g, t, 0.002, 0.9 * v, 0.34); o.connect(g); out(g);
      const n = nsrc(t, 0.02); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2500; const ng = ctx.createGain(); env(ng, t, 0.001, 0.12 * v, 0.012); n.connect(hp).connect(ng); out(ng);
    }
    function snare(t, v = 1) {
      const n = nsrc(t, 0.25); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2200; bp.Q.value = 0.6;
      const g = ctx.createGain(); env(g, t, 0.001, 0.32 * v, 0.18); n.connect(bp).connect(g); out(g, { send: 0.18 });
      const o = osc("triangle", 190, t, 0.12); const og = ctx.createGain(); env(og, t, 0.001, 0.22 * v, 0.08); o.connect(og); out(og);
    }
    function clap(t, v = 1) {
      [0, 0.011, 0.023].forEach((o, i) => { const n = nsrc(t + o, 0.12); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1400; bp.Q.value = 1.1; const g = ctx.createGain(); env(g, t + o, 0.001, 0.22 * v, i === 2 ? 0.14 : 0.02); n.connect(bp).connect(g); out(g, { send: 0.25 }); });
    }
    function hat(t, v = 1, open = false, pan = 0.25) {
      const n = nsrc(t, open ? 0.3 : 0.05); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 8000;
      const g = ctx.createGain(); env(g, t, 0.001, 0.09 * v, open ? 0.22 : 0.035); n.connect(hp).connect(g); out(g, { pan });
    }
    function crash(t, v = 1) {
      const n = nsrc(t, 2.2); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 5000;
      const g = ctx.createGain(); env(g, t, 0.002, 0.14 * v, 1.8); n.connect(hp).connect(g); out(g, { send: 0.3 });
    }
    /* ───── synths ───── */
    function supersaw(t, c, dur, v = 1, cut = 3200) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 0.8; f.frequency.value = cut;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.03 * v, t + 0.006); g.gain.setTargetAtTime(0.022 * v, t + 0.02, 0.06); g.gain.setTargetAtTime(0, t + dur, 0.025);
      CH[c].v.forEach((m) => { for (const d of [-16, -6, 6, 16]) { const o = osc("sawtooth", hz(m), t, dur + 0.2, d + (R() - 0.5) * 4); const p = ctx.createStereoPanner(); p.pan.value = d / 26; o.connect(p).connect(f); } });
      f.connect(g); out(g, { send: 0.2 });
    }
    function lead(t, m, dur, v = 1) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 1.2; f.frequency.setValueAtTime(2000, t); f.frequency.linearRampToValueAtTime(4200, t + 0.05);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.06 * v, t + 0.012); g.gain.setTargetAtTime(0.045 * v, t + 0.03, 0.08); g.gain.setTargetAtTime(0, t + dur, 0.03);
      for (const [type, d, a] of [["square", -6, 0.55], ["sawtooth", 7, 0.5], ["sine", 0, 0.5]]) { const o = osc(type, hz(m), t, dur + 0.2, d); const og = ctx.createGain(); og.gain.value = a; o.connect(og).connect(f); }
      f.connect(g); out(g, { send: 0.3 });
    }
    function sub(t, m, dur, v = 1) {
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.3 * v, t + 0.008); g.gain.setTargetAtTime(0.24 * v, t + 0.03, 0.12); g.gain.setTargetAtTime(0, t + dur, 0.02);
      osc("sine", hz(m), t, dur + 0.2).connect(g);
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 650; const s2 = osc("sawtooth", hz(m + 12), t, dur + 0.2); const sg = ctx.createGain(); sg.gain.value = 0.12; s2.connect(sg).connect(f).connect(g);
      out(g);
    }
    function riser(a, b, v = 1, to = music) {
      const n = nsrc(a, b - a); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.4; bp.frequency.setValueAtTime(300, a); bp.frequency.exponentialRampToValueAtTime(7000, b);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.16 * v, b - 0.02); g.gain.linearRampToValueAtTime(0, b + 0.01);
      n.connect(bp).connect(g); out(g, { to, send: 0.3 });
    }

    /* ───── SFX ───── */
    function whoosh(t, dur = 0.5, v = 1, f0 = 400, f1 = 5000, pan = 0) {
      const a = t - dur * 0.55, n = nsrc(a, dur + 0.1); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.1;
      bp.frequency.setValueAtTime(f0, a); bp.frequency.exponentialRampToValueAtTime(f1, t); bp.frequency.exponentialRampToValueAtTime(f0 * 1.5, a + dur);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.35 * v, t); g.gain.exponentialRampToValueAtTime(0.0001, a + dur);
      n.connect(bp).connect(g); out(g, { to: sfx, pan, send: 0.1 });
    }
    function thump(t, v = 1, f0 = 120) { const o = ctx.createOscillator(); o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.2); o.start(t); o.stop(t + 0.4); const g = ctx.createGain(); env(g, t, 0.002, 0.55 * v, 0.25); o.connect(g); out(g, { to: sfx }); }
    function click(t, v = 1, f = 2600, q = 2, pan = 0) { const n = nsrc(t, 0.03); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = f; bp.Q.value = q; const g = ctx.createGain(); env(g, t, 0.0005, 0.35 * v, 0.014); n.connect(bp).connect(g); out(g, { to: sfx, pan }); }
    function beep(t, v = 1) { const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.07 * v, t + 0.005); g.gain.setValueAtTime(0.07 * v, t + 0.14); g.gain.linearRampToValueAtTime(0, t + 0.16); osc("sine", 1000, t, 0.2).connect(g); out(g, { to: sfx, send: 0.35, pan: -0.2 }); }
    function shing(t, v = 1) { [2637, 3951, 5274].forEach((f, i) => { const g = ctx.createGain(); env(g, t + i * 0.012, 0.002, 0.035 * v, 0.9); osc("sine", f, t, 1.1).connect(g); out(g, { to: sfx, send: 0.5, pan: 0.2 }); }); whoosh(t + 0.05, 0.3, 0.35, 2000, 9000, 0.2); }

    /* ───── score ───── */
    const chordAt = (t) => LOOP[Math.floor((t + 1e-6) / (BAR * 2)) % 4];
    const endMusic = C.freeze;
    for (let n = 0; n * S16 < endMusic - 1e-6; n++) {
      const t = n * S16, s = n % 16, s32 = n % 32, bar = Math.floor(n / 16);
      const c = chordAt(t), root = CH[c].bass;
      if (t < 2.5) {                                   // tease: filtered chord pulses, ticking hat
        if (s % 2 === 0) supersaw(t, c, S16 * 1.1, 0.6, 500 + 500 * t);
        if (s % 4 === 2) hat(t, 0.5);
        continue;
      }
      if (t < C.drop) {                                // build on the sunglasses
        if (s % 4 === 0) kick(t, 0.75);
        hat(t, s % 2 ? 0.35 : 0.6);
        if (s % 2 === 0) supersaw(t, c, S16 * 1.1, 0.7, 1200 + 1400 * P(t, 2.5, C.drop));
        if (t >= C.drop - 1) snare(t, 0.25 + 0.6 * P(t, C.drop - 1, C.drop));   // snare roll
        continue;
      }
      const lift = t >= 21.5;                          // the edit: build to Enter
      // drums
      if ([0, 7, 10].includes(s) || (lift && s % 4 === 0)) kick(t, 1);
      if (s === 4 || s === 12) { clap(t, 0.9); snare(t, 0.6); }
      if (lift && t >= 22.5) snare(t, 0.3 + 0.5 * P(t, 22.5, C.enter));
      if (s % 2 === 0 || (s >= 12 && bar % 2 === 1)) hat(t, s % 4 === 2 ? 0.7 : 0.4);
      if (s === 6 || s === 14) hat(t, 0.6, true, -0.1);
      // bass
      if (s === 0) sub(t, root, S16 * 6);
      if (s === 7) sub(t, root + 12, S16 * 2, 0.7);
      if (s === 10) sub(t, root, S16 * 5, 0.9);
      // chords + hook
      if ([0, 3, 6, 10, 12].includes(s)) supersaw(t, c, S16 * 2.2, 1.05, 4800);
      for (const [pos, m, len] of MEL[c]) if (pos === s32 && !lift) lead(t, m + (t >= 15.5 ? 12 : 0), S16 * len * 0.92, t >= 15.5 ? 0.8 : 1);
    }
    crash(C.drop, 1); crash(15.5, 0.7);
    riser(C.drop - 2, C.drop, 0.9);
    riser(21.5, C.enter, 1.1);
    // slow-mo through the truck gap: the mix goes underwater, then snaps back
    const s5 = K.SHOTS.find((x) => x.id === "s05");
    mlp.frequency.setValueAtTime(20000, s5.a);
    mlp.frequency.exponentialRampToValueAtTime(700, s5.a + 0.25);
    mlp.frequency.setValueAtTime(700, C.snap - 0.02);
    mlp.frequency.exponentialRampToValueAtTime(20000, C.snap + 0.05);
    crash(C.snap, 0.8);
    // the music stops dead on the jaw drop
    music.gain.setValueAtTime(0.9, C.enter + 0.02);
    music.gain.linearRampToValueAtTime(0, C.freeze + 0.03);
    // the logo: tonic chord, sub, hook tail
    const L = C.logo;
    const mus2 = ctx.createGain(); mus2.gain.value = 0.9; mus2.connect(bus);
    const endOut = (node, o = {}) => out(node, { ...o, to: mus2 });
    {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(5000, L); f.frequency.exponentialRampToValueAtTime(900, L + 2.4);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, L); g.gain.linearRampToValueAtTime(0.03, L + 0.01); g.gain.setTargetAtTime(0, L + 0.3, 0.7);
      CH.D.v.concat([78, 81]).forEach((m) => { for (const d of [-16, -6, 6, 16]) { const o = osc("sawtooth", hz(m), L, 2.6, d); const p = ctx.createStereoPanner(); p.pan.value = d / 26; o.connect(p).connect(f); } });
      f.connect(g); endOut(g, { send: 0.4 });
      const sg = ctx.createGain(); env(sg, L, 0.006, 0.34, 1.6); osc("sine", hz(38), L, 2).connect(sg); endOut(sg);
      const k = ctx.createOscillator(); k.frequency.setValueAtTime(150, L); k.frequency.exponentialRampToValueAtTime(45, L + 0.12); k.start(L); k.stop(L + 0.5);
      const kg = ctx.createGain(); env(kg, L, 0.002, 0.9, 0.4); k.connect(kg); endOut(kg);
      const n = nsrc(L, 2.4); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 5000; const ng = ctx.createGain(); env(ng, L, 0.002, 0.14, 1.8); n.connect(hp).connect(ng); endOut(ng, { send: 0.3 });
      [[C.line, 74, 0.3], [C.line + 0.25, 78, 0.3], [C.line + 0.5, 81, 1.2]].forEach(([t, m, d]) => {
        const lg = ctx.createGain(); env(lg, t, 0.01, 0.05, d + 0.6); osc("triangle", hz(m), t, d + 0.8).connect(lg); endOut(lg, { send: 0.5 });
      });
    }

    /* ───── SFX (subtle) ───── */
    // studio: room tone
    { const n = nsrc(0, 4.5); const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 500; const g = ctx.createGain(); g.gain.setValueAtTime(0.04, 0); g.gain.setValueAtTime(0.04, 4.3); g.gain.linearRampToValueAtTime(0, 4.5); n.connect(lp).connect(g); out(g, { to: sfx }); }
    shing(C.glint, 1);
    // road: engine + tyres, drone buzz
    {
      const a = C.drop, b = 15.5;
      const n = nsrc(a, b - a); const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 260;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, a); g.gain.linearRampToValueAtTime(0.16, a + 0.2); g.gain.setValueAtTime(0.16, b - 0.3); g.gain.linearRampToValueAtTime(0, b);
      n.connect(lp).connect(g); out(g, { to: sfx });
      const e = osc("sawtooth", 58, a, b - a); const ef = ctx.createBiquadFilter(); ef.type = "lowpass"; ef.frequency.value = 180; const eg = ctx.createGain(); eg.gain.setValueAtTime(0, a); eg.gain.linearRampToValueAtTime(0.05, a + 0.3); eg.gain.setValueAtTime(0.05, b - 0.3); eg.gain.linearRampToValueAtTime(0, b); e.connect(ef).connect(eg); out(eg, { to: sfx });
      const d = osc("sawtooth", 210, a, b - a); const dl = osc("sine", 31, a, b - a); const dlg = ctx.createGain(); dlg.gain.value = 9; dl.connect(dlg).connect(d.frequency);
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 900; bp.Q.value = 0.9;
      const dg = ctx.createGain(); dg.gain.setValueAtTime(0, a); dg.gain.linearRampToValueAtTime(0.022, a + 0.4); dg.gain.setValueAtTime(0.022, 13.0); dg.gain.linearRampToValueAtTime(0.04, C.bump - 0.4); dg.gain.linearRampToValueAtTime(0, C.bump);
      d.connect(bp).connect(dg); out(dg, { to: sfx, pan: -0.3 });
    }
    whoosh(C.drop, 0.6, 1, 300, 4000);
    whoosh(8.5, 0.4, 0.5, 500, 5000, 0.3);
    whoosh(C.snap, 0.9, 1.2, 200, 3000, -0.3);                   // the truck
    thump(C.bump, 0.9, 140); click(C.bump, 0.5, 900, 1);         // fist bump
    whoosh(15.5, 0.35, 0.5, 600, 7000);
    { // clapper crack
      const n = nsrc(C.clap, 0.08); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1700; bp.Q.value = 1.2;
      const g = ctx.createGain(); env(g, C.clap, 0.0005, 1.0, 0.05); n.connect(bp).connect(g); out(g, { to: sfx, send: 0.35 });
    }
    [18.3, 19.3, 20.3, 21.3].forEach((t) => beep(t, 0.5));        // clinic monitor
    click(C.enter - 0.02, 1, 2200, 2); thump(C.enter, 1.2, 90);  // Enter
    { // the silence after: room tone + monitor
      const n = nsrc(C.freeze, C.logo - C.freeze); const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 600;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, C.freeze); g.gain.linearRampToValueAtTime(0.05, C.freeze + 0.3); g.gain.setValueAtTime(0.05, C.logo - 0.1); g.gain.linearRampToValueAtTime(0, C.logo);
      n.connect(lp).connect(g); out(g, { to: sfx });
      C.beeps.forEach((t) => beep(t, 1));
      riser(C.logo - 1.2, C.logo, 0.7, sfx);
    }

    master.gain.setValueAtTime(1, DUR - 1.0);
    master.gain.linearRampToValueAtTime(0, DUR - 0.05);
    const o = await ctx.startRendering();
    let peak = 0;
    for (let c = 0; c < 2; c++) { const d = o.getChannelData(c); for (let i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i])); }
    const k = 0.891 / (peak || 1);
    for (let c = 0; c < 2; c++) { const d = o.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] *= k; }
    return o;
  }
  const P = (t, a, c) => (!(t > a) ? 0 : t >= c ? 1 : (t - a) / (c - a));

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
  window.CekimAudio = { render };
  window.__audio = async () => toWav(await render());
})();
