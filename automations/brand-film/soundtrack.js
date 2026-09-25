/*
 * Rast Creative — vertical brand film · soundtrack
 * ------------------------------------------------------------------
 * The whole score and every sound effect are synthesised here with an
 * OfflineAudioContext — no samples, no licences to clear. Cues are written
 * against the same timeline as timeline.js, so a
 * whoosh lands exactly where a cloud sweeps and a tick where a chip pops.
 *
 *   window.Soundtrack.render()  → Promise<AudioBuffer>
 *   window.__audio()            → Promise<string>  (base64 16-bit WAV)
 *
 * Harmony: B minor / D major colour; groove loop Bm · G · D · A.
 * Music: 144 BPM melodic techno — four-on-the-floor, sidechain pump,
 * rolling 16th bass, acid line in the dark section, drops on the cuts.
 */
(() => {
  "use strict";

  const SR = 48000;
  const DUR = 65;
  const BEAT = 60 / 144; // techno tempo: every 2.5 s cut lands on a beat, every 5 s on a bar
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

    /* ═════════════ TECHNO KIT (144 BPM) ═════════════ */
    // Sidechain "pump": music bus ducks under every kick.
    // Music sits ~2.5 dB under the SFX so whooshes, ticks and pops stay on top.
    const musicTrim = ctx.createGain(); musicTrim.gain.value = 0.75;
    musicTrim.connect(bus);
    const duck = ctx.createGain();
    duck.connect(musicTrim);
    const toDuck = (node, { pan = 0, send = 0, delay = 0, gain = 1 } = {}) => {
      const g = ctx.createGain(); g.gain.value = gain;
      const p = ctx.createStereoPanner(); p.pan.value = pan;
      node.connect(g).connect(p).connect(duck);
      if (send) { const x = ctx.createGain(); x.gain.value = send; p.connect(x).connect(verbIn); }
      if (delay) { const x = ctx.createGain(); x.gain.value = delay; p.connect(x).connect(dlyIn); }
    };
    const pump = (t, depth = 0.3) => {
      duck.gain.setTargetAtTime(depth, t, 0.004);
      duck.gain.setTargetAtTime(1, t + 0.035, 0.075);
    };
    const drive = ctx.createWaveShaper();
    { const c = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = i / 511.5 - 1; c[i] = Math.tanh(x * 2.2) / Math.tanh(2.2); } drive.curve = c; }
    const kickBus = ctx.createGain(); kickBus.gain.value = 0.72;
    const kickLp = ctx.createBiquadFilter(); kickLp.type = "lowpass"; kickLp.frequency.value = 20000;
    kickBus.connect(drive).connect(kickLp).connect(bus);

    function tkick(t, vol = 1) {
      const o = ctx.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(190, t);
      o.frequency.exponentialRampToValueAtTime(52, t + 0.07);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.3);
      o.start(t); o.stop(t + 0.45);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.002);
      g.gain.setTargetAtTime(0.5 * vol, t + 0.01, 0.06); g.gain.setTargetAtTime(0, t + 0.14, 0.05);
      o.connect(g).connect(kickBus);
      const n = noiseSrc(t, 0.015);
      const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 3000;
      const ng = ctx.createGain(); env(ng, t, 0.0005, 0.25 * vol, 0.006);
      n.connect(hp).connect(ng).connect(kickBus);
      pump(t);
    }
    function snare(t, vol = 1) {
      const n = noiseSrc(t, 0.25);
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1900; bp.Q.value = 0.8;
      const g = ctx.createGain(); env(g, t, 0.001, 0.22 * vol, 0.09);
      n.connect(bp).connect(g); out(g, { send: 0.2, pan: 0.05 });
      const o = osc("triangle", 200, t, 0.1);
      const og = ctx.createGain(); env(og, t, 0.001, 0.18 * vol, 0.04);
      o.connect(og); out(og);
    }
    function roll(a, b, vol = 1) {
      // Snare roll that accelerates from 8ths to 32nds and swells into the drop.
      let t = a;
      while (t < b - 0.01) {
        const p = (t - a) / (b - a);
        snare(t, (0.25 + 0.75 * p * p) * vol);
        t += p < 0.5 ? BEAT / 2 : p < 0.8 ? BEAT / 4 : BEAT / 8;
      }
    }
    function ride(t, vol = 1) {
      const n = noiseSrc(t, 0.4);
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 9000; bp.Q.value = 0.6;
      const g = ctx.createGain(); env(g, t, 0.001, 0.05 * vol, 0.3);
      n.connect(bp).connect(g); out(g, { pan: -0.3, send: 0.15 });
      [5230, 7350].forEach((f) => {
        const og = ctx.createGain(); env(og, t, 0.001, 0.006 * vol, 0.35);
        osc("square", f, t, 0.45).connect(og); out(og, { pan: -0.3 });
      });
    }
    function rbass(t, m, vol = 1, dur = BEAT / 4) {
      // Rolling techno bass: saw + sub through a plucky low-pass.
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 4;
      f.frequency.setValueAtTime(1300, t); f.frequency.exponentialRampToValueAtTime(240, t + 0.09);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.2 * vol, t + 0.004);
      g.gain.setTargetAtTime(0, t + dur * 0.75, 0.015);
      osc("sawtooth", hz(m), t, dur + 0.1).connect(f);
      const sub = osc("sine", hz(m), t, dur + 0.1);
      const sg = ctx.createGain(); sg.gain.value = 1.1; sub.connect(sg).connect(g);
      f.connect(g);
      toDuck(g);
    }
    function acid(t, m, cut, vol = 1, accent = false) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 14;
      f.frequency.setValueAtTime(cut * (accent ? 4.5 : 3), t);
      f.frequency.exponentialRampToValueAtTime(cut, t + 0.11);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.07 * vol * (accent ? 1.4 : 1), t + 0.003);
      g.gain.setTargetAtTime(0, t + BEAT / 4 * 0.7, 0.02);
      osc("sawtooth", hz(m), t, BEAT / 4 + 0.1).connect(f);
      f.connect(g);
      toDuck(g, { pan: 0.15, delay: 0.2, send: 0.1 });
    }
    function stab(t, chord, vol = 1, cut = 2400) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = cut; f.Q.value = 2;
      const g = ctx.createGain(); env(g, t, 0.003, 0.05 * vol, 0.16);
      CH[chord].pad.slice(2).forEach((m, i) => {
        for (const d of [-9, 9]) osc("sawtooth", hz(m), t, 0.4, d + i).connect(f);
      });
      f.connect(g);
      toDuck(g, { send: 0.35, delay: 0.35 });
    }
    function seq(t, m, vol = 1, cut = 3000, pan = 0) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = cut; f.Q.value = 3;
      const g = ctx.createGain(); env(g, t, 0.002, 0.075 * vol, 0.12);
      osc("square", hz(m), t, 0.3).connect(f);
      const b = osc("sawtooth", hz(m + 12), t, 0.3, 6);
      const bg = ctx.createGain(); bg.gain.value = 0.4; b.connect(bg).connect(f);
      f.connect(g);
      toDuck(g, { pan, send: 0.2, delay: 0.3 });
    }
    function sweep(a, b, up = true, vol = 1) {
      const n = noiseSrc(a, b - a);
      const f = ctx.createBiquadFilter(); f.type = up ? "highpass" : "lowpass"; f.Q.value = 3;
      f.frequency.setValueAtTime(up ? 200 : 9000, a);
      f.frequency.exponentialRampToValueAtTime(up ? 9000 : 150, b);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, a);
      g.gain.exponentialRampToValueAtTime(0.12 * vol, up ? b - 0.02 : a + 0.15);
      g.gain.linearRampToValueAtTime(0, b + 0.02);
      n.connect(f).connect(g); out(g, { send: 0.3 });
    }

    /* ═════════════ SCORE ═════════════ */
    // One-bar chord cycle for the groove (Bm · G · D · A, two bars each).
    const LOOP = ["Bm", "G", "D", "A"];
    const loopChord = (t) => LOOP[Math.floor(t / (BAR * 2)) % 4];
    const ARP = [0, 12, 7, 12, 3, 12, 7, 15]; // offsets from the chord's bass note, two octaves up
    // Groove zones: [from, to, level] — level shapes which layers play.
    //  0 hook (muffled) · 1 build · 2 main · 3 peak (dark wall) · 4 light (map) · 5 CTA
    const ZONES = [
      [0, 3.33, 0], [6.67, 10.0, 1], [10.0, 34.17, 2], [35.0, 41.67, 2],
      [42.5, 49.17, 3], [50.0, 54.58, 4], [58.33, 62.08, 5],
    ];
    const zoneAt = (t) => ZONES.find(([a, b]) => t >= a - 1e-6 && t < b - 1e-6);

    const S16 = BEAT / 4;
    for (let n = 0; n * S16 < 62.1; n++) {
      const t = n * S16;
      const z = zoneAt(t);
      if (!z) continue;
      const lvl = z[2];
      const q = n % 4;            // 16th within the beat
      const beat = Math.floor(n / 4) % 4;
      const bar = Math.floor(n / 16);
      const c = loopChord(t);
      const root = CH[c].bass;

      // Kick: four on the floor (muffled in the hook, sparse in the build).
      if (q === 0) {
        if (lvl === 0) { kickLp.frequency.setValueAtTime(420, t); tkick(t, 0.8); }
        else if (lvl === 1) { kickLp.frequency.setValueAtTime(mix01(t, 6.67, 10, 500, 20000), t); tkick(t, 0.85); }
        else { kickLp.frequency.setValueAtTime(20000, t); tkick(t, lvl === 4 ? 0.85 : 1); }
      }
      // Claps on 2 and 4.
      if (q === 0 && (beat === 1 || beat === 3) && lvl >= 2 && lvl !== 4) clap(t, lvl === 3 ? 1 : 0.8);
      // Hats: 16th ticks, off-beat open hat.
      if (lvl >= 1 || q % 2 === 0) hat(t, (q === 2 ? 0.55 : 0.28) * (lvl === 0 ? 0.8 : 1), false, 0.25);
      if (q === 2 && lvl >= 2) hat(t, 0.75, true, -0.1);
      if (q === 0 && (lvl === 3 || lvl === 5)) ride(t, 0.9);
      // Rolling bass on the three 16ths after each kick.
      if (lvl >= 1 && q !== 0) rbass(t, root + (q === 3 && beat === 3 ? 12 : 0), lvl === 1 ? 0.6 : lvl === 3 ? 1.15 : 0.95);
      if (lvl === 0 && q === 2) rbass(t, 35, 0.5);
      // Sequence / arp (16ths), brighter as the film opens up.
      if (lvl >= 1 && lvl !== 3) {
        const m = root + 24 + ARP[n % 8] - (ARP[n % 8] === 3 && c !== "Bm" ? 0 : 0);
        const cut = lvl === 1 ? mix01(t, 6.67, 10, 600, 2600) : lvl === 4 ? 1800 : 3200 + 800 * Math.sin(t * 0.7);
        seq(t, m, q === 0 ? 0.9 : 0.6, cut, n % 2 ? 0.35 : -0.35);
      }
      // Acid line in the dark section.
      if (lvl === 3) {
        const pat = [0, 12, 0, 7, 0, 12, 15, 12, 0, 12, 0, 10, 0, 7, 12, 19];
        acid(t, root + 12 + pat[n % 16], mix01(t, 42.5, 49.1, 380, 1500), 1, n % 16 === 0 || n % 16 === 6 || n % 16 === 14);
      }
      // Chord stabs on the off-beat "and" of 2 and 4, plus a push at the bar end.
      if (lvl >= 2 && lvl !== 4 && ((q === 2 && (beat === 1 || beat === 3)) || (q === 3 && beat === 3 && bar % 2 === 1))) stab(t, c, lvl === 3 ? 1.1 : 0.85, lvl === 3 ? 1800 : 2600);
    }
    function mix01(t, a, b, v0, v1) { const p = Math.max(0, Math.min(1, (t - a) / (b - a))); return v0 + (v1 - v0) * p; }

    // Pads underneath, quieter and filtered — the groove carries the film now.
    pad(3.3, 1.7, "D", { vol: 0.45, cut: 500, cutEnd: 2600, att: 1.4 });
    pad(5.0, 2.5, "D", { vol: 0.9, cut: 3200, cutEnd: 1500, att: 0.05 });
    pad(7.5, 2.5, "A", { vol: 0.6, cut: 1100, cutEnd: 1700 });
    for (let t = 10; t < 54.5; t += BAR * 2) {
      const c = loopChord(t + 0.01);
      const dark = t >= 42 && t < 49.2;
      pad(t, BAR * 2, c, { vol: dark ? 0.35 : 0.42, cut: dark ? 800 : 1300, cutEnd: dark ? 1100 : 1600, att: 0.2 });
    }

    // Builds and drops, locked to the cuts.
    riser(2.9, 3.33, 0.6);
    roll(3.75, 4.97, 0.8); riser(3.7, 4.97, 1);
    roll(8.33, 10.0, 1); sweep(8.0, 10.0, true, 1);
    sweep(24.9, 26.6, true, 0.6);
    sweep(34.17, 35.0, false, 1); roll(34.17, 35.0, 0.7);
    roll(40.83, 42.5, 1); sweep(40.5, 42.5, true, 1);
    roll(48.33, 49.17, 0.8);
    roll(57.5, 58.33, 1); sweep(56.9, 58.33, true, 1);
    tkick(62.08, 1); stab(62.08, "D", 1.2, 3000);

    /* ═════════════ SFX (unchanged cues) ═════════════ */

    // I · Hook
    [0.62, 1.245, 1.87].forEach((t, i) => swipe(t, 0.8 + i * 0.15));
    whoosh(2.85, 0.9, 1.1, 1, 400, 5000);
    drop(3.4);

    // II · Brand — the sun.
    boom(5.0, 1);
    [86, 90, 93, 98].forEach((m, i) => bell(5.0 + i * 0.09, m, 0.5, 3.5, (i - 1.5) * 0.3));
    bell(7.55, 86, 0.9, 3, 0);
    bell(7.56, 93, 0.35, 2.5, 0.2);
    [0, 0.07, 0.14, 0.21].forEach((d, i) => tick(7.3 + d, 0.45, 3000 + i * 300, (i - 1.5) * 0.3));
    for (let i = 0; i < 8; i++) tick(7.85 + i * 0.055, 0.3, 2600 + i * 120, (i - 3.5) * 0.12);
    whoosh(10.0, 1.2, 0.9, -1);
    boom(10.0, 0.55);

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
    riser(57.4, 58.33, 0.6);
    boom(58.33, 0.6);
    [58.33, 60.4].forEach((t, i) => pad(t, i ? 1.7 : 2.07, i ? "A" : "G", { vol: 0.5, cut: 1600, cutEnd: 2000, att: 0.2 }));
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
