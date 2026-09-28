/*
 * Rast Creative — "Çekim Günü" · sound
 * ------------------------------------------------------------------
 * Sports-trailer hybrid in D minor at 120 BPM (modelled on the reference
 * spot's shape): ticking percussion and a string ostinato in the studio,
 * a braam + stomp-clap groove with taiko on the highway, the mix going
 * underwater through the truck gap, a drum roll and crowd-roar swell under
 * the doctor, a tape stop on Enter — then real silence and a heart monitor
 * while the jaws hang open. The logo lands on a braam.
 * SFX are dense on purpose: shutters, glint, wind, engine, drone passes,
 * truck horn, fist bump, gimbal whine, clapper, keys, gasp.
 *
 * Two passes: the score renders on its own, then plays into the main mix
 * as one source (so the slow-mo filter and the tape stop can bend it).
 *
 *   window.CekimAudio.render() → AudioBuffer
 *   window.__audio()           → base64 WAV
 */
(() => {
  "use strict";
  const SR = 48000;
  const hz = (m) => 440 * 2 ** ((m - 69) / 12);
  const P = (t, a, c) => (!(t > a) ? 0 : t >= c ? 1 : (t - a) / (c - a));
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let r = Math.imul(seed ^ (seed >>> 15), 1 | seed); r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
  // i–VI–III–VII in D minor, one chord per bar: [bass, voicing]
  const CH = { Dm: [38, [62, 65, 69]], Bb: [34, [62, 65, 70]], F: [41, [60, 65, 69]], C: [36, [60, 64, 67]] };
  const LOOP = ["Dm", "Bb", "F", "C"];
  // string ostinato, 16ths, as offsets from the chord's root (one bar)
  const OST = [0, 12, 7, 12, 0, 12, 7, 15, 0, 12, 7, 12, 0, 10, 7, 12];

  /* shared toolkit bound to one context */
  function kit(ctx, R) {
    const noise = ctx.createBuffer(1, SR * 2, SR);
    { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = R() * 2 - 1; }
    const nsrc = (t, dur) => { const s = ctx.createBufferSource(); s.buffer = noise; s.loop = true; s.start(Math.max(0, t), R() * 1.5); s.stop(t + dur + 0.1); return s; };
    const osc = (type, f, t, dur, det = 0) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = det; o.start(Math.max(0, t)); o.stop(t + dur + 0.05); return o; };
    const env = (g, t, a, peak, d) => { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setTargetAtTime(0, t + a, d / 4); };
    const ir = ctx.createBuffer(2, SR * 3, SR);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let lp = 0; for (let i = 0; i < d.length; i++) { lp += 0.35 * ((R() * 2 - 1) - lp); d[i] = lp * Math.exp(-i / SR / 0.9); } }
    const verb = ctx.createConvolver(); verb.buffer = ir;
    const shaper = ctx.createWaveShaper();
    { const c = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; c[i] = Math.tanh(2.6 * x); } shaper.curve = c; }
    return { nsrc, osc, env, verb };
  }

  /* ═════════════ pass 1 · the score ═════════════ */
  async function renderScore(K) {
    const C = K.CUE, DUR = K.DUR, BEAT = 60 / K.BPM, S16 = BEAT / 4, BAR = BEAT * 4;
    const ctx = new OfflineAudioContext(2, SR * DUR, SR);
    const R = rng(91);
    const { nsrc, osc, env, verb } = kit(ctx, R);
    const bus = ctx.createGain(); bus.connect(ctx.destination);
    const verbIn = ctx.createGain(); verbIn.connect(verb).connect(bus);
    const out = (node, { pan = 0, send = 0, gain = 1 } = {}) => {
      const g = ctx.createGain(); g.gain.value = gain; const p = ctx.createStereoPanner(); p.pan.value = pan;
      node.connect(g).connect(p).connect(bus);
      if (send) { const x = ctx.createGain(); x.gain.value = send; p.connect(x).connect(verbIn); }
    };
    const drive = (node, amt = 2.6) => { const w = ctx.createWaveShaper(); const c = new Float32Array(1024); for (let i = 0; i < 1024; i++) c[i] = Math.tanh(amt * (i / 511.5 - 1)); w.curve = c; node.connect(w); return w; };

    // percussion
    function stomp(t, v = 1) {
      const o = ctx.createOscillator(); o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14); o.start(t); o.stop(t + 0.5);
      const g = ctx.createGain(); env(g, t, 0.002, 1.0 * v, 0.4); o.connect(g); out(g);
      const n = nsrc(t, 0.12); const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 420; const ng = ctx.createGain(); env(ng, t, 0.002, 0.5 * v, 0.1); n.connect(lp).connect(ng); out(ng, { send: 0.25 });
    }
    function clap(t, v = 1) {
      [0, 0.012, 0.024, 0.035].forEach((o, i) => { const n = nsrc(t + o, 0.2); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1300; bp.Q.value = 0.9; const g = ctx.createGain(); env(g, t + o, 0.001, 0.34 * v, i === 3 ? 0.22 : 0.02); n.connect(bp).connect(g); out(g, { send: 0.45, pan: (i - 1.5) * 0.15 }); });
    }
    function taiko(t, v = 1, f0 = 95, pan = 0) {
      const o = ctx.createOscillator(); o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 0.6, t + 0.2); o.start(t); o.stop(t + 0.7);
      const g = ctx.createGain(); env(g, t, 0.003, 0.7 * v, 0.55); o.connect(g); out(g, { pan, send: 0.35 });
      const n = nsrc(t, 0.1); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 260; bp.Q.value = 1; const ng = ctx.createGain(); env(ng, t, 0.001, 0.35 * v, 0.06); n.connect(bp).connect(ng); out(ng, { pan, send: 0.3 });
    }
    function rim(t, v = 1, pan = 0.2) {
      const n = nsrc(t, 0.03); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 3200; bp.Q.value = 3; const g = ctx.createGain(); env(g, t, 0.0005, 0.22 * v, 0.02); n.connect(bp).connect(g); out(g, { pan });
      const o = osc("triangle", 1650, t, 0.05); const og = ctx.createGain(); env(og, t, 0.0005, 0.08 * v, 0.02); o.connect(og); out(og, { pan });
    }
    function shaker(t, v = 1) { const n = nsrc(t, 0.06); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 6500; const g = ctx.createGain(); env(g, t, 0.006, 0.07 * v, 0.04); n.connect(hp).connect(g); out(g, { pan: -0.3 }); }
    function snare(t, v = 1) {
      const n = nsrc(t, 0.2); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2400; bp.Q.value = 0.6; const g = ctx.createGain(); env(g, t, 0.001, 0.3 * v, 0.14); n.connect(bp).connect(g); out(g, { send: 0.3 });
      const o = osc("triangle", 200, t, 0.1); const og = ctx.createGain(); env(og, t, 0.001, 0.18 * v, 0.07); o.connect(og); out(og);
    }
    function crash(t, v = 1) { const n = nsrc(t, 2.4); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 4500; const g = ctx.createGain(); env(g, t, 0.002, 0.16 * v, 2); n.connect(hp).connect(g); out(g, { send: 0.35 }); }
    // tonal
    function braam(t, bassM, v = 1, dur = 2.2) {
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 2; lp.frequency.setValueAtTime(900, t); lp.frequency.exponentialRampToValueAtTime(160, t + dur * 0.6);
      const pre = ctx.createGain(); pre.gain.value = 0.5;
      [bassM, bassM + 12].forEach((m) => { for (const d of [-9, 0, 9]) osc("sawtooth", hz(m), t, dur + 0.3, d).connect(pre); });
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.2 * v, t + 0.03); g.gain.setTargetAtTime(0, t + 0.15, dur / 5);
      drive(pre.connect(lp), 1.6).connect(g); out(g, { send: 0.35 });
      const s = ctx.createOscillator(); s.frequency.setValueAtTime(hz(bassM) * 1.5, t); s.frequency.exponentialRampToValueAtTime(hz(bassM - 12), t + 0.4); s.start(t); s.stop(t + dur);
      const sg = ctx.createGain(); env(sg, t, 0.005, 0.55 * v, dur * 0.8); s.connect(sg); out(sg);
    }
    function ost(t, m, v = 1, cut = 2200) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 3; f.frequency.setValueAtTime(cut * 1.8, t); f.frequency.exponentialRampToValueAtTime(cut * 0.5, t + 0.1);
      const g = ctx.createGain(); env(g, t, 0.003, 0.05 * v, 0.12);
      for (const d of [-7, 7]) osc("sawtooth", hz(m), t, 0.18, d).connect(f);
      f.connect(g); out(g, { send: 0.15, pan: 0.15 });
    }
    function pad(t, dur, c, v = 1, cut = 900) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = cut; f.Q.value = 0.3;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.05 * v, t + 0.25); g.gain.setValueAtTime(0.03 * v, t + dur - 0.1); g.gain.linearRampToValueAtTime(0, t + dur + 0.3);
      CH[c][1].forEach((m, i) => { for (const d of [-10, 10]) { const o = osc("triangle", hz(m - 12), t, dur + 0.4, d); const p = ctx.createStereoPanner(); p.pan.value = (i - 1) * 0.5; o.connect(p).connect(f); } });
      f.connect(g); out(g, { send: 0.5 });
    }
    function stab(t, c, v = 1) {   // short brass-like hit on the chord
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 1.5; f.frequency.setValueAtTime(3500, t); f.frequency.exponentialRampToValueAtTime(700, t + 0.25);
      const g = ctx.createGain(); env(g, t, 0.006, 0.07 * v, 0.35);
      CH[c][1].forEach((m) => { for (const d of [-8, 8]) osc("sawtooth", hz(m - 12), t, 0.5, d).connect(f); });
      f.connect(g); out(g, { send: 0.4 });
    }
    function sub(t, m, dur, v = 1) { const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.3 * v, t + 0.01); g.gain.setTargetAtTime(0, t + dur, 0.03); osc("sine", hz(m), t, dur + 0.2).connect(g); out(g); }
    function riser(a, b, v = 1) {
      const n = nsrc(a, b - a); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.3; bp.frequency.setValueAtTime(250, a); bp.frequency.exponentialRampToValueAtTime(8000, b);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.2 * v, b - 0.02); g.gain.linearRampToValueAtTime(0, b + 0.01);
      n.connect(bp).connect(g); out(g, { send: 0.4 });
      const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(110, a); o.frequency.exponentialRampToValueAtTime(880, b); o.start(a); o.stop(b + 0.05);
      const of = ctx.createBiquadFilter(); of.type = "lowpass"; of.frequency.value = 2500; const og = ctx.createGain(); og.gain.setValueAtTime(0.0001, a); og.gain.exponentialRampToValueAtTime(0.03 * v, b); og.gain.linearRampToValueAtTime(0, b + 0.02);
      o.connect(of).connect(og); out(og, { send: 0.3 });
    }
    function roar(a, b, v = 1) {   // stadium-crowd swell
      [[700, -0.5], [1100, 0.5], [450, 0]].forEach(([f0, pan], i) => {
        const n = nsrc(a, b - a + 0.6); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = f0; bp.Q.value = 0.7;
        const am = osc("sine", 3.1 + i * 1.7, a, b - a + 0.6); const amg = ctx.createGain(); amg.gain.value = 0.25; const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.09 * v, b); g.gain.linearRampToValueAtTime(0, b + 0.4);
        const trem = ctx.createGain(); trem.gain.value = 0.75; am.connect(amg).connect(trem.gain);
        n.connect(bp).connect(trem).connect(g); out(g, { pan, send: 0.5 });
      });
    }

    const chordAt = (t) => LOOP[Math.floor((t + 1e-6) / BAR) % 4];
    const stop = C.enter + 0.08;
    for (let n = 0; n * S16 < stop; n++) {
      const t = n * S16, s = n % 16, c = chordAt(t), root = CH[c][0];
      if (s === 0) pad(t, BAR, c, t < C.drop ? 0.7 : 1, t < C.drop ? 600 : 850);
      if (t < 2.5) {                                  // studio: ticking, a quiet ostinato
        if (s % 2 === 0) rim(t, s % 4 === 0 ? 0.9 : 0.5);
        shaker(t, s % 2 ? 0.5 : 0.9);
        if (t >= 1.0) ost(t, root + 12 + OST[s], 0.5, 900 + 600 * P(t, 1, 2.5));
        continue;
      }
      if (t < C.drop) {                               // build on the sunglasses
        ost(t, root + 12 + OST[s], 0.8, 1600 + 1400 * P(t, 2.5, C.drop));
        if (s % 2 === 0) rim(t, 0.7);
        shaker(t, 0.8);
        if (s % 8 === 0) taiko(t, 0.8, 90);
        if (t >= C.drop - 1) taiko(t, 0.25 + 0.6 * P(t, C.drop - 1, C.drop), 120, (s % 2 ? 0.3 : -0.3));
        continue;
      }
      const slow = t >= 10.5 && t < C.snap;           // truck gap: heartbeat only
      const peak = t >= 21.5;                         // the edit
      const roll = t >= 19.5 && t < 21.5;
      if (slow) { if (s === 0 || s === 3) taiko(t, s ? 0.5 : 0.8, 70); continue; }
      // stomp-clap backbone
      if (s === 0 || s === 8 || (peak && s % 4 === 0)) stomp(t, 1);
      if (s === 4 || s === 12) clap(t, 1);
      if (s === 14 && !peak) stomp(t, 0.6);
      // taiko pattern + rolls
      if ([2, 6, 10, 11].includes(s)) taiko(t, 0.45, s === 11 ? 120 : 95, s % 4 === 2 ? -0.35 : 0.35);
      if (roll) taiko(t, 0.3 + 0.5 * P(t, 19.5, 21.5), 110, s % 2 ? 0.4 : -0.4);
      if (peak) snare(t, 0.35 + 0.6 * P(t, 21.5, C.enter));
      // drive
      ost(t, root + 12 + OST[s] + (peak ? 12 : 0), 1, peak ? 3600 : 2600);
      if (s % 2 === 0) rim(t, 0.5, -0.2);
      shaker(t, 0.7);
      if (s === 0) sub(t, root, BAR * 0.45, 1);
      if (s === 8) sub(t, root, BAR * 0.4, 0.85);
      if (s === 0 || s === 10) stab(t, c, s ? 0.7 : 1);
    }
    // hits
    braam(C.drop, 38, 1.1); crash(C.drop, 1);
    braam(C.snap, 34, 1); crash(C.snap, 0.9);
    braam(15.5, 41, 0.6); crash(15.5, 0.6);
    riser(C.drop - 2, C.drop, 0.8);
    riser(21.5, C.enter, 1.2);
    roar(17.8, 21.5, 1);
    // the logo
    const L = C.logo;
    braam(L, 38, 1.2, 2.4); crash(L, 1);
    stomp(L, 1.1); clap(L + BEAT, 1); stomp(L + BEAT * 2, 0.9); clap(L + BEAT * 3, 1);
    pad(L, 2.2, "Dm", 1.2, 1000);
    [74, 77, 81].forEach((m, i) => ost(C.line + i * 0.18, m, 1.2, 3000));
    return ctx.startRendering();
  }

  /* ═════════════ pass 2 · the mix + SFX ═════════════ */
  async function render() {
    const K = window.CEKIM, C = K.CUE, DUR = K.DUR;
    const score = await renderScore(K);
    const ctx = new OfflineAudioContext(2, SR * DUR, SR);
    const R = rng(47);
    const { nsrc, osc, env, verb } = kit(ctx, R);
    const master = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 3; comp.knee.value = 8; comp.attack.value = 0.005; comp.release.value = 0.18;
    comp.connect(master).connect(ctx.destination);
    const bus = ctx.createGain(); bus.connect(comp);
    const verbIn = ctx.createGain(); verbIn.connect(verb).connect(bus);
    const sfx = ctx.createGain(); sfx.gain.value = 0.85; sfx.connect(bus);
    const out = (node, { pan = 0, send = 0, gain = 1 } = {}) => {
      const g = ctx.createGain(); g.gain.value = gain; const p = ctx.createStereoPanner(); p.pan.value = pan;
      node.connect(g).connect(p).connect(sfx);
      if (send) { const x = ctx.createGain(); x.gain.value = send; p.connect(x).connect(verbIn); }
    };

    // the score, bent: underwater through the truck gap, tape stop on Enter
    {
      const src = ctx.createBufferSource(); src.buffer = score;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 20000; lp.Q.value = 0.8;
      const g = ctx.createGain(); g.gain.value = 0.82;
      src.connect(lp).connect(g).connect(bus);
      const s5 = K.SHOTS.find((x) => x.id === "s05");
      lp.frequency.setValueAtTime(20000, s5.a); lp.frequency.exponentialRampToValueAtTime(600, s5.a + 0.2);
      lp.frequency.setValueAtTime(600, C.snap - 0.02); lp.frequency.exponentialRampToValueAtTime(20000, C.snap + 0.04);
      // dynamics, shaped like the reference: quiet studio → road → a breath in the clinic → the build
      g.gain.setValueAtTime(0.5, 0); g.gain.linearRampToValueAtTime(0.62, C.drop - 0.05);
      g.gain.setValueAtTime(0.8, C.drop); g.gain.setValueAtTime(0.8, 15.45);
      g.gain.linearRampToValueAtTime(0.6, 15.5); g.gain.setValueAtTime(0.62, 17.45);
      g.gain.linearRampToValueAtTime(0.72, 17.5); g.gain.linearRampToValueAtTime(1.0, C.enter);
      src.playbackRate.setValueAtTime(1, C.enter + 0.02);
      src.playbackRate.linearRampToValueAtTime(0.12, C.freeze + 0.18);
      g.gain.setValueAtTime(1.0, C.freeze + 0.02); g.gain.linearRampToValueAtTime(0, C.freeze + 0.2);
      src.start(0); src.stop(C.freeze + 0.3);
      // the logo section is a fresh start of the same score
      const src2 = ctx.createBufferSource(); src2.buffer = score; const g2 = ctx.createGain(); g2.gain.value = 0.82;
      src2.connect(g2).connect(bus); src2.start(C.logo - 0.01, C.logo - 0.01);
    }

    /* ───── SFX kit ───── */
    function whoosh(t, dur = 0.5, v = 1, f0 = 400, f1 = 5000, pan = 0) {
      const a = t - dur * 0.55, n = nsrc(a, dur + 0.1); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.1;
      bp.frequency.setValueAtTime(f0, a); bp.frequency.exponentialRampToValueAtTime(f1, t); bp.frequency.exponentialRampToValueAtTime(f0 * 1.5, a + dur);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.4 * v, t); g.gain.exponentialRampToValueAtTime(0.0001, a + dur);
      const p = ctx.createStereoPanner(); p.pan.setValueAtTime(-pan, a); p.pan.linearRampToValueAtTime(pan, a + dur);
      n.connect(bp).connect(g).connect(p).connect(sfx);
    }
    function impact(t, v = 1, f0 = 120) {
      const o = ctx.createOscillator(); o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(35, t + 0.25); o.start(t); o.stop(t + 0.6);
      const g = ctx.createGain(); env(g, t, 0.002, 0.7 * v, 0.4); o.connect(g); out(g);
      const n = nsrc(t, 0.25); const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1800; const ng = ctx.createGain(); env(ng, t, 0.001, 0.45 * v, 0.15); n.connect(lp).connect(ng); out(ng, { send: 0.4 });
    }
    function click(t, v = 1, f = 2600, q = 2, pan = 0, d = 0.014) { const n = nsrc(t, 0.04); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = f; bp.Q.value = q; const g = ctx.createGain(); env(g, t, 0.0005, 0.4 * v, d); n.connect(bp).connect(g); out(g, { pan }); }
    function shutter(t, v = 1, pan = 0) { click(t, 0.9 * v, 3800, 2.5, pan, 0.01); click(t + 0.055, 0.7 * v, 2400, 2, pan, 0.02); const g = ctx.createGain(); env(g, t + 0.08, 0.02, 0.05 * v, 0.2); osc("sine", 5200, t + 0.08, 0.3).connect(g); out(g, { pan, send: 0.3 }); }
    function beep(t, v = 1) { const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09 * v, t + 0.005); g.gain.setValueAtTime(0.09 * v, t + 0.14); g.gain.linearRampToValueAtTime(0, t + 0.16); osc("sine", 1000, t, 0.2).connect(g); out(g, { send: 0.4, pan: -0.2 }); }
    function shing(t, v = 1) { [2637, 3951, 5274, 7040].forEach((f, i) => { const g = ctx.createGain(); env(g, t + i * 0.015, 0.002, 0.05 * v, 1.0); osc("sine", f, t, 1.2).connect(g); out(g, { send: 0.6, pan: 0.25 }); }); whoosh(t + 0.05, 0.35, 0.5, 2000, 10000, 0.3); }
    function bed(a, b, { f = 300, type = "lowpass", q = 0.7, v = 0.1, pan = 0 } = {}) {
      const n = nsrc(a, b - a); const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, a); g.gain.linearRampToValueAtTime(v, a + 0.08); g.gain.setValueAtTime(v, b - 0.08); g.gain.linearRampToValueAtTime(0, b);
      n.connect(fl).connect(g); out(g, { pan });
    }
    function horn(t, dur = 0.7, v = 1) {
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.07 * v, t + 0.03); g.gain.setValueAtTime(0.07 * v, t + dur - 0.1); g.gain.linearRampToValueAtTime(0, t + dur);
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 700; f.Q.value = 0.8;
      [hz(56), hz(60)].forEach((fr) => { const o = osc("sawtooth", fr, t, dur); o.frequency.setValueAtTime(fr, t); o.frequency.linearRampToValueAtTime(fr * 0.94, t + dur); o.connect(f); });
      f.connect(g); out(g, { pan: 0.4, send: 0.3 });
    }
    function droneBuzz(a, b, v = 1, pan = -0.3) {
      const d = osc("sawtooth", 230, a, b - a); const dl = osc("sine", 29, a, b - a); const dlg = ctx.createGain(); dlg.gain.value = 11; dl.connect(dlg).connect(d.frequency);
            const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 700; bp.Q.value = 0.6;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, a); g.gain.linearRampToValueAtTime(0.035 * v, a + 0.3); g.gain.setValueAtTime(0.035 * v, b - 0.3); g.gain.linearRampToValueAtTime(0, b);
      d.connect(bp); bp.connect(g); out(g, { pan });
    }
    function gasp(t, v = 1) {   // a room full of "oh"
      [[500, 0.6], [900, 0.5], [2400, 0.25]].forEach(([f, a]) => {
        const n = nsrc(t, 0.8); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.setValueAtTime(f * 1.15, t); bp.frequency.linearRampToValueAtTime(f * 0.9, t + 0.6); bp.Q.value = 6;
        const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.5 * a * v, t + 0.08); g.gain.setTargetAtTime(0, t + 0.15, 0.18);
        n.connect(bp).connect(g); out(g, { send: 0.4 });
      });
    }
    function tapeStop(t) { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.3); o.start(t); o.stop(t + 0.35); const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 900; const g = ctx.createGain(); g.gain.setValueAtTime(0.06, t); g.gain.linearRampToValueAtTime(0, t + 0.3); o.connect(f).connect(g); out(g); }

    /* ───── the shoot day ───── */
    // S01 studio: room, shutter bursts, a flash whine
    bed(0, 2.5, { f: 500, v: 0.06 });
    [[0.35, -0.4], [0.62, -0.4], [1.3, 0.3], [1.52, 0.3], [1.74, 0.3], [2.15, -0.2]].forEach(([t, p]) => shutter(t, 0.9, p));
    // S02 glasses: cloth, the glint
    whoosh(2.5, 0.35, 0.7, 500, 6000, 0.3);
    click(2.9, 0.25, 1200, 1, 0, 0.05);
    shing(C.glint, 1.2);
    // S03–S06 road: wind, engine, tyres, drone
    whoosh(C.drop, 0.8, 1.3, 250, 5000, 0.6);
    bed(C.drop, 15.5, { f: 280, v: 0.16 });                                 // tyres / road
    bed(C.drop, 8.5, { f: 1600, type: "bandpass", q: 0.4, v: 0.09, pan: 0.3 }); // wind at the open window
    { const e = osc("sawtooth", 62, C.drop, 11); const ef = ctx.createBiquadFilter(); ef.type = "lowpass"; ef.frequency.value = 200; const eg = ctx.createGain(); eg.gain.setValueAtTime(0, C.drop); eg.gain.linearRampToValueAtTime(0.06, C.drop + 0.3); eg.gain.setValueAtTime(0.06, 15.2); eg.gain.linearRampToValueAtTime(0, 15.5); e.connect(ef).connect(eg); out(eg); }
    droneBuzz(C.drop, 8.5, 1.1, -0.5);
    droneBuzz(8.5, 10.5, 0.5, -0.2);
    whoosh(6.2, 0.9, 0.6, 700, 3000, -0.7);                                 // drone passes
    whoosh(7.6, 0.7, 0.5, 900, 3500, 0.7);
    whoosh(8.5, 0.4, 0.7, 500, 5000, 0.3);
    click(9.4, 0.3, 1800, 3); click(9.6, 0.3, 1900, 3);                     // controller sticks
    whoosh(10.5, 0.5, 0.8, 300, 4000, 0.4);
    { // slow-mo: a low stretched drone + heartbeat thumps
      const o = osc("sawtooth", 46, 10.5, C.snap - 10.5); const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 300; const g = ctx.createGain(); g.gain.setValueAtTime(0, 10.5); g.gain.linearRampToValueAtTime(0.08, 10.8); g.gain.linearRampToValueAtTime(0, C.snap); o.connect(f).connect(g); out(g);
      droneBuzz(10.5, C.snap, 0.6, 0);
    }
    whoosh(C.snap, 1.1, 1.5, 150, 2500, -0.8); impact(C.snap, 0.8, 90); horn(C.snap - 0.05, 0.8, 1);   // the truck
    droneBuzz(C.snap, 14.5, 1.0, 0.2);
    whoosh(13.0, 0.4, 0.7, 500, 5000, -0.3);
    impact(C.bump, 1.2, 150); click(C.bump, 0.8, 900, 1); whoosh(C.bump - 0.02, 0.3, 0.8, 400, 3000);  // drone lands in the palm + fist bump
    // S07 clinic: gimbal whine, clapper
    whoosh(15.5, 0.45, 0.8, 600, 7000, 0.3);
    { const o = osc("square", 520, 15.6, 1.8); o.frequency.setValueAtTime(520, 15.6); o.frequency.linearRampToValueAtTime(690, 16.6); o.frequency.linearRampToValueAtTime(560, 17.4); const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1400; f.Q.value = 3; const g = ctx.createGain(); g.gain.setValueAtTime(0, 15.6); g.gain.linearRampToValueAtTime(0.02, 15.8); g.gain.setValueAtTime(0.02, 17.2); g.gain.linearRampToValueAtTime(0, 17.45); o.connect(f).connect(g); out(g, { pan: -0.3 }); }
    { const n = nsrc(C.clap, 0.1); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1700; bp.Q.value = 1.2; const g = ctx.createGain(); env(g, C.clap, 0.0005, 1.3, 0.06); n.connect(bp).connect(g); out(g, { send: 0.6 }); }
    impact(C.clap, 0.6, 180);
    // S08 doctor: monitor, a sceptical "hm" (two nurse glances = cloth swishes)
    whoosh(17.5, 0.4, 0.6, 400, 4000, -0.3);
    [17.9, 18.7, 19.5, 20.3, 21.1].forEach((t) => beep(t, 0.6));
    whoosh(19.8, 0.3, 0.3, 1200, 5000, 0.5);
    // S09 the edit: typing, then Enter
    whoosh(21.5, 0.4, 0.6, 500, 6000);
    [21.7, 21.84, 21.95, 22.2, 22.31, 22.5, 22.62, 22.9, 23.05].forEach((t, i) => click(t, 0.35, 2200 + (i % 3) * 300, 2.5, 0.1));
    click(C.enter - 0.02, 1.2, 2000, 2); impact(C.enter, 1.6, 100); tapeStop(C.enter + 0.02);
    // S10 the silence: room tone, gasp, monitor, a gulp
    bed(C.freeze, C.logo, { f: 600, v: 0.05 });
    gasp(C.freeze + 0.05, 1);
    C.beeps.forEach((t) => beep(t, 1));
    { const t = 25.9, o = ctx.createOscillator(); o.frequency.setValueAtTime(320, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.12); o.start(t); o.stop(t + 0.2); const g = ctx.createGain(); env(g, t, 0.005, 0.12, 0.1); o.connect(g); out(g); }
    whoosh(26.6, 0.8, 0.5, 300, 2000, 0.6);                                 // the two walking out
    // into the logo: reverse swell, hit, sparkle
    { const a = C.logo - 1.3, n = nsrc(a, 1.3); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 3000; const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.25, C.logo - 0.02); g.gain.linearRampToValueAtTime(0, C.logo); n.connect(hp).connect(g); out(g, { send: 0.3 }); }
    impact(C.logo, 1.3, 90); whoosh(C.logo + 0.05, 0.6, 0.8, 400, 6000);
    [C.line, C.pill].forEach((t, i) => { const g = ctx.createGain(); env(g, t, 0.003, 0.05, 1.2); osc("sine", i ? 3520 : 2637, t, 1.4).connect(g); out(g, { send: 0.6 }); });

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
  window.CekimAudio = { render };
  window.__audio = async () => toWav(await render());
})();
