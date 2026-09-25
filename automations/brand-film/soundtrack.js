/*
 * Rast Creative — vertical brand film · soundtrack
 * ------------------------------------------------------------------
 * The whole score and every sound effect are synthesised here with an
 * OfflineAudioContext — no samples, no licences to clear. Cues are written
 * against the same timeline as timeline.js (96 BPM, 1 bar = 2.5 s), so a
 * whoosh lands exactly where a cloud sweeps and a tick where a chip pops.
 *
 *   window.Soundtrack.render()  → Promise<AudioBuffer>
 *   window.__audio()            → Promise<string>  (base64 16-bit WAV)
 *
 * Harmony: D major, I–V–vi–IV colour (Dadd9 · A/C# · Bm7 · Gmaj9).
 */
(() => {
  "use strict";

  const SR = 48000;
  const DUR = 65;
  const BEAT = 60 / 96;
  const BAR = BEAT * 4;

  const hz = (m) => 440 * 2 ** ((m - 69) / 12);
  // MIDI voicings
  const CH = {
    D: { pad: [50, 57, 62, 66, 69, 76], bass: 38, arp: [74, 69, 78, 76, 81, 78] },
    A: { pad: [49, 57, 64, 69, 73, 71], bass: 37, arp: [73, 76, 69, 71, 81, 76] },
    Bm: { pad: [47, 54, 62, 66, 69, 73], bass: 35, arp: [74, 78, 71, 69, 81, 78] },
    G: { pad: [43, 50, 59, 62, 66, 69], bass: 31, arp: [71, 74, 78, 69, 79, 74] },
  };
  // [start, chord] — the harmonic map of the film.
  const CHORDS = [
    [3.3, "D"], [5.0, "D"], [7.5, "A"],
    [10, "Bm"], [12.5, "G"], [15, "D"], [17.5, "A"], [20, "Bm"], [22.5, "G"], [25, "D"],
    [27.5, "A"], [30, "Bm"], [32.5, "G"], [35, "D"], [37.5, "A"], [40, "Bm"],
    [42.5, "G"], [45, "D"], [47.5, "A"], [50, "Bm"], [52.5, "G"],
    [55.3, "Bm"], [55.925, "G"], [56.55, "D"], [58.3, "G"], [60.4, "A"], [62.2, "D"],
  ];
  const chordAt = (t) => {
    let c = CHORDS[0];
    for (const k of CHORDS) if (t >= k[0]) c = k;
    return c[1];
  };

  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  async function render() {
    const ctx = new OfflineAudioContext(2, SR * DUR, SR);
    const R = rng(2024);

    /* ───── buses ───── */
    const master = ctx.createGain();
    master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 10; comp.ratio.value = 3;
    comp.attack.value = 0.01; comp.release.value = 0.25;
    comp.connect(master).connect(ctx.destination);
    const bus = ctx.createGain();
    bus.connect(comp);

    // Reverb: generated stereo impulse, dark and ~3 s.
    const ir = ctx.createBuffer(2, SR * 3.2, SR);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      let lp = 0;
      for (let i = 0; i < d.length; i++) {
        const t = i / SR;
        lp += 0.28 * ((R() * 2 - 1) - lp);
        d[i] = lp * Math.exp(-t / 0.9) * (t < 0.02 ? t / 0.02 : 1);
      }
    }
    const verb = ctx.createConvolver();
    verb.buffer = ir;
    const verbIn = ctx.createGain();
    verbIn.gain.value = 0.9;
    verbIn.connect(verb).connect(bus);

    // Dotted-eighth delay for plucks and pings.
    const dly = ctx.createDelay(2);
    dly.delayTime.value = BEAT * 0.75;
    const fb = ctx.createGain();
    fb.gain.value = 0.34;
    const dlyLp = ctx.createBiquadFilter();
    dlyLp.type = "lowpass"; dlyLp.frequency.value = 2600;
    const dlyIn = ctx.createGain();
    dlyIn.connect(dly).connect(dlyLp).connect(fb).connect(dly);
    const dlyOut = ctx.createGain();
    dlyOut.gain.value = 0.55;
    dlyLp.connect(dlyOut);
    dlyOut.connect(bus);
    dlyOut.connect(verbIn);

    // Shared noise.
    const noise = ctx.createBuffer(1, SR * 2, SR);
    { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = R() * 2 - 1; }

    /* ───── helpers ───── */
    const out = (node, { gain = 1, pan = 0, send = 0, delay = 0 } = {}) => {
      const g = ctx.createGain();
      g.gain.value = gain;
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      node.connect(g).connect(p).connect(bus);
      if (send) { const s = ctx.createGain(); s.gain.value = send; p.connect(s).connect(verbIn); }
      if (delay) { const s = ctx.createGain(); s.gain.value = delay; p.connect(s).connect(dlyIn); }
      return p;
    };
    const env = (g, t, a, peak, d, sustain = 0, rel = 0.05, hold = 0) => {
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(peak, t + a);
      if (hold) g.gain.setValueAtTime(peak, t + a + hold);
      g.gain.setTargetAtTime(sustain, t + a + hold, d / 4);
      if (!sustain) return;
      g.gain.setTargetAtTime(0, t + a + hold + d, rel / 4);
    };
    const noiseSrc = (t, dur) => {
      const s = ctx.createBufferSource();
      s.buffer = noise;
      s.loop = true;
      s.start(t, R() * 1.5);
      s.stop(t + dur + 0.1);
      return s;
    };
    const osc = (type, f, t, dur, detune = 0) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      o.detune.value = detune;
      o.start(t);
      o.stop(t + dur + 0.05);
      return o;
    };

    /* ───── instruments ───── */
    function pad(t, dur, chord, { vol = 1, cut = 1400, cutEnd = cut, att = 1.2 } = {}) {
      const f = ctx.createBiquadFilter();
      f.type = "lowpass"; f.Q.value = 0.4;
      f.frequency.setValueAtTime(cut, t);
      f.frequency.linearRampToValueAtTime(cutEnd, t + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05 * vol, t + att);
      g.gain.setValueAtTime(0.05 * vol, t + dur);
      g.gain.linearRampToValueAtTime(0, t + dur + 1.6);
      f.connect(g);
      out(g, { send: 0.55 });
      CH[chord].pad.forEach((m, i) => {
        const pan = (i / 5 - 0.5) * 0.7;
        for (const det of [-7, 7]) {
          const o = osc("sawtooth", hz(m), t, dur + 1.8, det + (R() - 0.5) * 3);
          const og = ctx.createGain(); og.gain.value = m < 52 ? 0.5 : 0.32;
          const p = ctx.createStereoPanner(); p.pan.value = pan * (det > 0 ? 1 : -1);
          o.connect(og).connect(p).connect(f);
        }
        const tri = osc("triangle", hz(m), t, dur + 1.8);
        const tg = ctx.createGain(); tg.gain.value = 0.35;
        tri.connect(tg).connect(f);
      });
    }
    function pluck(t, m, vel = 1, pan = 0) {
      const f = ctx.createBiquadFilter();
      f.type = "lowpass"; f.frequency.value = 2400 + vel * 1600;
      const g = ctx.createGain();
      env(g, t, 0.004, 0.13 * vel, 0.5);
      const a = osc("triangle", hz(m), t, 0.9);
      const b = osc("sine", hz(m + 12), t, 0.9);
      const bg = ctx.createGain(); bg.gain.value = 0.35;
      a.connect(f); b.connect(bg).connect(f);
      f.connect(g);
      out(g, { pan, send: 0.25, delay: 0.45 });
    }
    function bell(t, m, vol = 1, dec = 2.4, pan = 0) {
      [[1, 1], [2.0, 0.42], [3.01, 0.2], [4.23, 0.12], [5.4, 0.06]].forEach(([r, a], i) => {
        const g = ctx.createGain();
        env(g, t, 0.003, 0.09 * vol * a, dec / (1 + i * 0.6));
        osc("sine", hz(m) * r, t, dec + 0.5).connect(g);
        out(g, { pan, send: 0.6, delay: 0.25 });
      });
    }
    function keys(t, chord, vol = 1) {
      // Soft felt-piano hit: fundamental + decaying harmonics, low octave doubled.
      CH[chord].pad.slice(1).forEach((m, i) => {
        [[1, 1], [2, 0.3], [3, 0.12]].forEach(([r, a]) => {
          const g = ctx.createGain();
          env(g, t + i * 0.012, 0.006, 0.07 * vol * a, 2.8 / r);
          osc("sine", hz(m) * r, t + i * 0.012, 3.5).connect(g);
          out(g, { pan: (i / 4 - 0.5) * 0.5, send: 0.6 });
        });
      });
      const g = ctx.createGain();
      env(g, t, 0.01, 0.16 * vol, 3.2);
      osc("sine", hz(CH[chord].bass + 12), t, 3.6).connect(g);
      out(g, { send: 0.3 });
    }
    function kick(t, vol = 1) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(44, t + 0.13);
      o.start(t); o.stop(t + 0.6);
      const g = ctx.createGain();
      env(g, t, 0.002, 0.95 * vol, 0.42);
      o.connect(g);
      out(g, { gain: 1 });
      const c = noiseSrc(t, 0.02);
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2500;
      const cg = ctx.createGain(); env(cg, t, 0.001, 0.12 * vol, 0.012);
      c.connect(hp).connect(cg);
      out(cg);
    }
    function clap(t, vol = 1) {
      [0, 0.011, 0.023].forEach((o, i) => {
        const n = noiseSrc(t + o, 0.3);
        const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1500; bp.Q.value = 0.9;
        const g = ctx.createGain(); env(g, t + o, 0.001, (i === 2 ? 0.3 : 0.16) * vol, i === 2 ? 0.2 : 0.02);
        n.connect(bp).connect(g);
        out(g, { send: 0.35, pan: 0.05 });
      });
    }
    function hat(t, vol = 1, open = false, pan = 0.2) {
      const n = noiseSrc(t, open ? 0.35 : 0.08);
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 7200;
      const g = ctx.createGain(); env(g, t, 0.001, 0.09 * vol, open ? 0.2 : 0.035);
      n.connect(hp).connect(g);
      out(g, { pan, send: 0.08 });
    }
    function bass(t, m, dur, vol = 1) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 420;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.3 * vol, t + 0.012);
      g.gain.setTargetAtTime(0.22 * vol, t + 0.02, 0.1);
      g.gain.setTargetAtTime(0, t + dur, 0.03);
      osc("sine", hz(m), t, dur + 0.3).connect(f);
      const tr = osc("triangle", hz(m + 12), t, dur + 0.3);
      const tg = ctx.createGain(); tg.gain.value = 0.28;
      tr.connect(tg).connect(f);
      f.connect(g);
      out(g);
    }
    function boom(t, vol = 1) {
      const o = ctx.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(70, t);
      o.frequency.exponentialRampToValueAtTime(30, t + 1.4);
      o.start(t); o.stop(t + 2.6);
      const g = ctx.createGain(); env(g, t, 0.004, 0.9 * vol, 1.8);
      o.connect(g); out(g, { send: 0.2 });
      const n = noiseSrc(t, 1.5);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 260;
      const ng = ctx.createGain(); env(ng, t, 0.004, 0.5 * vol, 0.9);
      n.connect(lp).connect(ng); out(ng, { send: 0.5 });
    }
    function whoosh(t, dur = 1.1, vol = 1, dir = 1, f0 = 250, f1 = 3200) {
      // Peaks at t (centre of the sweep).
      const a = t - dur * 0.6;
      const n = noiseSrc(a, dur + 0.2);
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.1;
      bp.frequency.setValueAtTime(f0, a);
      bp.frequency.exponentialRampToValueAtTime(f1, t);
      bp.frequency.exponentialRampToValueAtTime(f0 * 2, a + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, a);
      g.gain.exponentialRampToValueAtTime(0.5 * vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, a + dur);
      const p = ctx.createStereoPanner();
      p.pan.setValueAtTime(-0.7 * dir, a);
      p.pan.linearRampToValueAtTime(0.7 * dir, a + dur);
      n.connect(bp).connect(g).connect(p).connect(bus);
      const s = ctx.createGain(); s.gain.value = 0.35; p.connect(s).connect(verbIn);
    }
    function riser(t0, t1, vol = 1) {
      const n = noiseSrc(t0, t1 - t0);
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.4;
      bp.frequency.setValueAtTime(300, t0);
      bp.frequency.exponentialRampToValueAtTime(7000, t1);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.32 * vol, t1 - 0.02);
      g.gain.linearRampToValueAtTime(0, t1 + 0.02);
      n.connect(bp).connect(g);
      out(g, { send: 0.4 });
      const o = ctx.createOscillator(); o.type = "sawtooth";
      o.frequency.setValueAtTime(110, t0);
      o.frequency.exponentialRampToValueAtTime(880, t1);
      o.start(t0); o.stop(t1 + 0.05);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1800;
      const og = ctx.createGain();
      og.gain.setValueAtTime(0.0001, t0);
      og.gain.exponentialRampToValueAtTime(0.05 * vol, t1 - 0.02);
      og.gain.linearRampToValueAtTime(0, t1 + 0.02);
      o.connect(lp).connect(og);
      out(og, { send: 0.3 });
    }
    function tick(t, vol = 1, f = 2400, pan = 0) {
      const g = ctx.createGain(); env(g, t, 0.001, 0.12 * vol, 0.03);
      osc("sine", f, t, 0.08).connect(g);
      out(g, { pan, send: 0.1 });
      const n = noiseSrc(t, 0.02);
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 5000;
      const ng = ctx.createGain(); env(ng, t, 0.001, 0.08 * vol, 0.008);
      n.connect(hp).connect(ng); out(ng, { pan });
    }
    function pop(t, vol = 1, f = 520, pan = 0) {
      const o = ctx.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * 1.9, t + 0.05);
      o.start(t); o.stop(t + 0.2);
      const g = ctx.createGain(); env(g, t, 0.002, 0.16 * vol, 0.07);
      o.connect(g); out(g, { pan, send: 0.15 });
    }
    function swipe(t, vol = 1) {
      const n = noiseSrc(t - 0.05, 0.25);
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 2;
      bp.frequency.setValueAtTime(900, t - 0.05);
      bp.frequency.exponentialRampToValueAtTime(5200, t + 0.12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t - 0.05);
      g.gain.exponentialRampToValueAtTime(0.35 * vol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      n.connect(bp).connect(g); out(g, { pan: 0.1, send: 0.1 });
      const o = ctx.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.14);
      o.start(t); o.stop(t + 0.3);
      const og = ctx.createGain(); env(og, t, 0.002, 0.55 * vol, 0.14);
      o.connect(og); out(og);
    }
    function shutter(t) {
      [0, 0.075].forEach((o, i) => {
        const n = noiseSrc(t + o, 0.05);
        const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = i ? 2600 : 3800; bp.Q.value = 1.5;
        const g = ctx.createGain(); env(g, t + o, 0.001, 0.35, 0.018);
        n.connect(bp).connect(g); out(g, { send: 0.15 });
        const k = osc("sine", i ? 180 : 240, t + o, 0.06);
        const kg = ctx.createGain(); env(kg, t + o, 0.001, 0.2, 0.02);
        k.connect(kg); out(kg);
      });
    }
    function servo(t, dur) {
      const o = ctx.createOscillator(); o.type = "square";
      o.frequency.setValueAtTime(95, t); o.frequency.linearRampToValueAtTime(140, t + dur);
      o.start(t); o.stop(t + dur + 0.05);
      const lp = ctx.createBiquadFilter(); lp.type = "bandpass"; lp.frequency.value = 900; lp.Q.value = 3;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.03, t + 0.05);
      g.gain.setValueAtTime(0.03, t + dur - 0.06); g.gain.linearRampToValueAtTime(0, t + dur);
      o.connect(lp).connect(g); out(g, { pan: -0.15 });
    }
    function drop(t) {
      // Feed coming to rest: a pitch-falling "whomp".
      const o = ctx.createOscillator(); o.type = "triangle";
      o.frequency.setValueAtTime(340, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.5);
      o.start(t); o.stop(t + 0.7);
      const g = ctx.createGain(); env(g, t, 0.005, 0.28, 0.35);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900;
      o.connect(lp).connect(g); out(g, { send: 0.3 });
    }

    /* ═════════════ SCORE ═════════════ */

    // I · Hook — clock-like tension under the scrolling feed.
    for (let t = 0; t < 2.5; t += BEAT / 2) hat(t, 0.6 + (Math.round(t / (BEAT / 2)) % 2 ? 0 : 0.4), false, 0.3);
    for (let t = 0; t < 2.5; t += BEAT) {
      const g = ctx.createGain(); env(g, t, 0.004, 0.35, 0.18);
      osc("sine", hz(38), t, 0.3).connect(g); out(g);
    }
    [0.62, 1.245, 1.87].forEach((t, i) => swipe(t, 0.8 + i * 0.15));
    whoosh(2.85, 0.9, 1.1, 1, 400, 5000);
    drop(3.4);
    pad(3.3, 1.7, "D", { vol: 0.55, cut: 500, cutEnd: 2600, att: 1.4 });
    riser(3.7, 4.97, 1);

    // II · Brand — the sun.
    boom(5.0, 1);
    pad(5.0, 2.5, "D", { vol: 1.0, cut: 3200, cutEnd: 1500, att: 0.05 });
    [86, 90, 93, 98].forEach((m, i) => bell(5.0 + i * 0.09, m, 0.5, 3.5, (i - 1.5) * 0.3));
    pad(7.5, 2.5, "A", { vol: 0.9, cut: 1300, cutEnd: 1700 });
    bell(7.55, 86, 0.9, 3, 0);
    bell(7.56, 93, 0.35, 2.5, 0.2);
    [0, 0.07, 0.14, 0.21].forEach((d, i) => tick(7.3 + d, 0.45, 3000 + i * 300, (i - 1.5) * 0.3));
    for (let i = 0; i < 8; i++) tick(7.85 + i * 0.055, 0.3, 2600 + i * 120, (i - 3.5) * 0.12);
    for (let i = 0; i < 8; i++) pluck(8.75 + i * (BEAT / 2), CH.A.arp[i % 6] - 12, 0.5 + 0.3 * (i % 2 ? 0 : 1), (i % 2 ? 0.3 : -0.3));
    whoosh(10.0, 1.2, 0.9, -1);

    // Chords, bass, arpeggio from 10 s — the groove of the film.
    for (let i = 3; i < CHORDS.length; i++) {
      const [t, c] = CHORDS[i];
      if (t >= 55) break;
      const next = CHORDS[i + 1] ? Math.min(CHORDS[i + 1][0], 55) : t + BAR;
      const dark = t >= 42.5 && t < 50;
      pad(t, next - t, c, { vol: dark ? 0.75 : 0.85, cut: dark ? 900 : 1500, cutEnd: dark ? 1400 : 1900, att: 0.35 });
    }
    const grooveZones = [
      [10.0, 42.2, "A"], [42.5, 49.35, "B"], [50.4, 54.6, "C"], [58.8, 62.1, "D"],
    ];
    for (const [a, b, kind] of grooveZones) {
      for (let t = a; t < b - 0.01; t += BEAT / 2) {
        const step = Math.round((t - a) / (BEAT / 2)) % 8; // 8 eighths per bar
        const c = chordAt(t + 0.01);
        const beat = step / 2;
        // Kick
        if (kind === "A" && (step === 0 || step === 4 || (step === 5 && t > 17.5))) kick(t, step === 5 ? 0.6 : 0.85);
        if (kind === "B" && step % 2 === 0) kick(t, 0.95);
        if (kind === "C" && step === 0) kick(t, 0.6);
        if (kind === "D" && (step === 0 || step === 4)) kick(t, 0.75);
        // Clap on 2 and 4
        if ((kind === "A" && t >= 17.5) || kind === "B" || kind === "D") if (step === 2 || step === 6) clap(t, kind === "B" ? 1 : 0.8);
        // Hats
        const swing = step % 2 ? BEAT * 0.04 : 0;
        hat(t + swing, step % 2 ? 0.75 : 0.45, kind === "B" && step % 2 === 1, 0.22);
        if (kind !== "C") hat(t + BEAT / 4 + swing, 0.22, false, -0.25);
        // Bass
        const root = CH[c].bass;
        if (kind === "B") bass(t, step % 2 ? root + 12 : root, BEAT / 2 - 0.04, 1);
        else if (step === 0) bass(t, root, BEAT * 1.4, 0.9);
        else if (step === 3) bass(t, root + 12, BEAT * 0.4, 0.6);
        else if (step === 4) bass(t, root, BEAT * 0.9, 0.8);
        else if (step === 7) bass(t, root + 7, BEAT * 0.4, 0.55);
        // Arp
        if (kind !== "B" || step % 2 === 0) {
          const notes = CH[c].arp;
          pluck(t, notes[(step + Math.floor(beat)) % notes.length], step % 2 ? 0.55 : 0.85, step % 2 ? 0.35 : -0.35);
        }
        void beat;
      }
    }

    // III · Story
    [10.95, 11.9].forEach((t) => { swipe(t, 0.5); tick(t + 0.02, 0.5, 1800); });
    whoosh(13.1, 0.5, 0.5, 1, 800, 5000);
    [14.65, 14.83].forEach((t, i) => { whoosh(t + 0.25, 0.8, 0.6, i ? 1 : -1, 200, 1800); pop(t + 0.5, 0.6, 300); });

    // IV · Process
    whoosh(17.5, 1.2, 0.9, 1);
    [18.35, 20.45, 22.55, 24.65].forEach((t, i) => { tick(t, 0.8, 1900 + i * 200); pop(t + 0.03, 0.45, 420 + i * 60); });
    [25.5, 25.66, 25.82].forEach((t, i) => bell(t, 81 + [0, 4, 7][i], 0.55, 1.2, (i - 1) * 0.4));
    pop(26.3, 0.8, 600);

    // V · One set, many frames
    whoosh(27.35, 1.2, 0.9, -1);
    servo(29.25, 0.62); servo(30.4, 0.62);
    tick(29.575, 0.7, 2200); tick(30.725, 0.7, 2400);
    [31.55, 31.7, 31.85].forEach((t, i) => { whoosh(t + 0.4, 0.6, 0.45, 1, 400, 3600); pop(t + 0.55, 0.5, 480 + i * 90, (i - 1) * 0.5); });
    pop(32.35, 0.6, 700);
    shutter(32.55);
    pop(32.75, 0.6, 800);

    // VI · Services
    whoosh(35.0, 1.2, 0.9, 1);
    [35.75, 36.25, 36.75].forEach((t, i) => {
      whoosh(t + 0.3, 0.6, 0.4, -1, 300, 2400);
      for (let j = 0; j < 4 + (i === 2 ? 1 : 0); j++) tick(t + 0.5 + j * 0.08, 0.35, 2800 + j * 150, (j - 2) * 0.2);
    });

    // VII · Work — into the dark, more energy.
    riser(41.6, 42.45, 0.8);
    boom(42.5, 0.9);
    // Counter ticks follow the eased count (value = n · outCubic(p)).
    const counter = (t0, n, every) => {
      let last = 0;
      for (let i = 0; i <= 200; i++) {
        const p = i / 200;
        const v = Math.round(n * (1 - (1 - p) ** 3));
        if (v - last >= every) { tick(t0 + 0.05 + p * 1.05, 0.5, 3200, 0.1); last = v; }
      }
      bell(t0 + 1.1, 90, 0.4, 1.4);
    };
    counter(43.25, 15, 1);
    counter(44.1, 100, 5);
    whoosh(46.5, 0.8, 0.6, -1, 300, 2000);
    for (let d = 0; d <= 7; d++) tick(46.95 + d * 0.075, 0.35, 2000 + d * 180, (d - 3.5) * 0.2);
    whoosh(48.9, 0.9, 0.5, 1, 1500, 7000);

    // VIII · Region — dawn.
    riser(49.3, 50.2, 0.8);
    bell(50.2, 86, 0.5, 3); bell(50.25, 93, 0.35, 3, 0.3);
    [51.6, 51.85, 52.1, 52.35, 52.6].forEach((t, i) => {
      const g = ctx.createGain(); env(g, t, 0.002, 0.07, 0.35);
      osc("sine", hz(88 + [0, 2, 4, 7, 9][i]), t, 0.5).connect(g);
      out(g, { pan: [-0.3, 0.6, -0.7, 0.8, -0.2][i], delay: 0.6, send: 0.3 });
    });

    // IX · Manifesto — the band drops out; one chord per word.
    whoosh(54.9, 1.3, 0.8, -1);
    keys(55.3, "Bm", 1);
    keys(55.925, "G", 1);
    keys(56.55, "D", 1.15);
    bell(56.6, 86, 0.6, 3.5, 0);
    pad(55.3, 3.0, "D", { vol: 0.6, cut: 800, cutEnd: 2400, att: 1.5 });
    riser(57.7, 58.75, 0.5);
    [58.3, 60.4].forEach((t, i) => pad(t, i ? 1.8 : 2.1, i ? "A" : "G", { vol: 0.8, cut: 1600, cutEnd: 2000, att: 0.3 }));
    whoosh(58.9, 0.8, 0.5, 1, 300, 2400);
    // The tap.
    tick(60.35, 0.9, 1500); pop(60.37, 0.8, 380);
    bell(60.5, 81, 0.5, 1.2, -0.2); bell(60.64, 86, 0.55, 1.6, 0.2);
    [60.65, 60.8, 60.95].forEach((t, i) => tick(t, 0.3, 2600 + i * 200));

    // End card — resolve, the sun lands in the dot once more.
    whoosh(62.4, 1.0, 0.6, -1);
    pad(62.2, 2.2, "D", { vol: 1, cut: 2400, cutEnd: 900, att: 0.4 });
    keys(63.15, "D", 0.9);
    [86, 90, 93, 98, 102].forEach((m, i) => bell(63.15 + i * 0.07, m, 0.45, 3.5, (i - 2) * 0.3));
    boom(63.15, 0.45);

    master.gain.setValueAtTime(0.9, 63.6);
    master.gain.linearRampToValueAtTime(0, DUR - 0.05);

    const buf = await ctx.startRendering();
    // Normalise to -1 dBFS.
    let peak = 0;
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i]));
    }
    const k = peak > 0 ? 0.891 / peak : 1;
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < d.length; i++) d[i] *= k;
    }
    return buf;
  }

  function toWav(buf) {
    const ch = buf.numberOfChannels, n = buf.length;
    const bytes = new ArrayBuffer(44 + n * ch * 2);
    const v = new DataView(bytes);
    const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, "RIFF"); v.setUint32(4, 36 + n * ch * 2, true); w(8, "WAVE");
    w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, ch, true);
    v.setUint32(24, SR, true); v.setUint32(28, SR * ch * 2, true); v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true);
    w(36, "data"); v.setUint32(40, n * ch * 2, true);
    const data = [...Array(ch)].map((_, c) => buf.getChannelData(c));
    let o = 44;
    for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) {
      const s = Math.max(-1, Math.min(1, data[c][i]));
      v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      o += 2;
    }
    const u8 = new Uint8Array(bytes);
    let bin = "";
    for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(bin);
  }

  window.Soundtrack = { render };
  window.__audio = async () => toWav(await render());
})();
