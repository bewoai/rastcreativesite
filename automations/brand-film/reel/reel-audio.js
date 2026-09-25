/*
 * Rast Creative — cinematic Reel · sound
 * ------------------------------------------------------------------
 * Score, sound design and the voice-over mix, rendered offline.
 * 120 BPM (beat 0.5 s) so every cut in shots.json sits on the grid.
 * D minor for the journey (Dm · B♭ · F · C) and a lift to D major on
 * "kendini izletir." — the only major chord in the film.
 *
 *   window.ReelAudio.render() → AudioBuffer
 *   window.__audio()          → base64 WAV
 */
(() => {
  "use strict";
  const SR = 48000, DUR = 40, BEAT = 0.5, S16 = BEAT / 4;
  const BASE = "/automations/brand-film";
  const hz = (m) => 440 * 2 ** ((m - 69) / 12);
  const CH = {
    Dm: { pad: [50, 57, 62, 65, 69], bass: 38, arp: [62, 65, 69, 74, 69, 65, 72, 69] },
    Bb: { pad: [46, 53, 58, 62, 65], bass: 34, arp: [58, 62, 65, 70, 65, 62, 69, 65] },
    F: { pad: [41, 53, 57, 60, 65], bass: 41, arp: [60, 65, 69, 72, 69, 65, 67, 65] },
    C: { pad: [48, 55, 60, 64, 67], bass: 36, arp: [60, 64, 67, 72, 67, 64, 71, 67] },
    D: { pad: [50, 57, 62, 66, 69, 76], bass: 38, arp: [62, 66, 69, 74, 69, 66, 76, 69] },
  };
  const HARM = [[0, "Dm"], [8, "Dm"], [12, "Bb"], [16, "F"], [20, "C"], [22, "Dm"], [24, "Bb"], [26, "F"], [28, "C"], [30, "Bb"], [32, "C"], [34.35, "D"]];
  const chordAt = (t) => { let c = "Dm"; for (const [a, k] of HARM) if (t >= a - 1e-6) c = k; return c; };
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let r = Math.imul(seed ^ (seed >>> 15), 1 | seed); r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }

  async function render() {
    const ctx = new OfflineAudioContext(2, SR * DUR, SR);
    const R = rng(77);
    const master = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 3; comp.knee.value = 8; comp.attack.value = 0.008; comp.release.value = 0.2;
    comp.connect(master).connect(ctx.destination);
    const bus = ctx.createGain(); bus.connect(comp);            // SFX + voice
    const music = ctx.createGain(); music.gain.value = 0.8;     // ducked under the voice
    const pumpG = ctx.createGain(); pumpG.connect(music); music.connect(bus);

    // Reverb + delay.
    const ir = ctx.createBuffer(2, SR * 3, SR);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let lp = 0; for (let i = 0; i < d.length; i++) { lp += 0.3 * ((R() * 2 - 1) - lp); d[i] = lp * Math.exp(-i / SR / 0.85); } }
    const verb = ctx.createConvolver(); verb.buffer = ir;
    const verbIn = ctx.createGain(); verbIn.connect(verb).connect(bus);
    const dly = ctx.createDelay(2); dly.delayTime.value = BEAT * 0.75;
    const fb = ctx.createGain(); fb.gain.value = 0.32;
    const dlp = ctx.createBiquadFilter(); dlp.type = "lowpass"; dlp.frequency.value = 2800;
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
    const pump = (t) => { pumpG.gain.setTargetAtTime(0.35, t, 0.004); pumpG.gain.setTargetAtTime(1, t + 0.03, 0.07); };

    /* ───── instruments ───── */
    function pad(t, dur, ch, { vol = 1, cut = 1400, cut2 = cut, att = 0.6 } = {}) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 0.5;
      f.frequency.setValueAtTime(cut, t); f.frequency.linearRampToValueAtTime(cut2, t + dur);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.045 * vol, t + att);
      g.gain.setValueAtTime(0.045 * vol, t + dur); g.gain.linearRampToValueAtTime(0, t + dur + 1.2);
      f.connect(g); M(g, { send: 0.5 });
      CH[ch].pad.forEach((m, i) => {
        for (const d of [-8, 8]) { const o = osc("sawtooth", hz(m), t, dur + 1.3, d + (R() - 0.5) * 4); const og = ctx.createGain(); og.gain.value = 0.35; const p = ctx.createStereoPanner(); p.pan.value = (i / 4 - 0.5) * 0.8 * Math.sign(d); o.connect(og).connect(p).connect(f); }
      });
    }
    function drone(t, dur, vol = 1) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 260; f.Q.value = 2;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.22 * vol, t + 1.5); g.gain.setValueAtTime(0.22 * vol, t + dur - 1); g.gain.linearRampToValueAtTime(0, t + dur);
      osc("sawtooth", hz(26), t, dur, -5).connect(f); osc("sawtooth", hz(38), t, dur, 6).connect(f);
      const s = osc("sine", hz(26), t, dur); s.connect(g);
      f.connect(g); out(g, { send: 0.3 });
    }
    function kick(t, vol = 1, lp = 20000) {
      const o = ctx.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(170, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.08); o.frequency.exponentialRampToValueAtTime(40, t + 0.3);
      o.start(t); o.stop(t + 0.45);
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = lp;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.95 * vol, t + 0.002); g.gain.setTargetAtTime(0.4 * vol, t + 0.01, 0.07); g.gain.setTargetAtTime(0, t + 0.16, 0.05);
      o.connect(f).connect(g); out(g, { gain: 0.8 });
      const n = nsrc(t, 0.015); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 3000;
      const ng = ctx.createGain(); env(ng, t, 0.0005, 0.2 * vol * (lp > 5000 ? 1 : 0.2), 0.006); n.connect(hp).connect(ng); out(ng);
      pump(t);
    }
    function clap(t, vol = 1) {
      [0, 0.011, 0.022].forEach((o, i) => { const n = nsrc(t + o, 0.3); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1500; bp.Q.value = 0.9; const g = ctx.createGain(); env(g, t + o, 0.001, (i === 2 ? 0.28 : 0.15) * vol, i === 2 ? 0.2 : 0.02); n.connect(bp).connect(g); out(g, { send: 0.3 }); });
    }
    function hat(t, vol = 1, open = false, pan = 0.2) {
      const n = nsrc(t, open ? 0.35 : 0.08); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 7500;
      const g = ctx.createGain(); env(g, t, 0.001, 0.085 * vol, open ? 0.22 : 0.035); n.connect(hp).connect(g); out(g, { pan, send: 0.06 });
    }
    function rbass(t, m, vol = 1) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 4; f.frequency.setValueAtTime(1200, t); f.frequency.exponentialRampToValueAtTime(230, t + 0.09);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.2 * vol, t + 0.004); g.gain.setTargetAtTime(0, t + S16 * 0.75, 0.015);
      osc("sawtooth", hz(m), t, S16 + 0.1).connect(f); const sub = osc("sine", hz(m), t, S16 + 0.1); sub.connect(g); f.connect(g); M(g);
    }
    function pluck(t, m, vol = 1, pan = 0, cut = 3000) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = cut; f.Q.value = 2;
      const g = ctx.createGain(); env(g, t, 0.002, 0.07 * vol, 0.14);
      osc("square", hz(m), t, 0.3).connect(f); const b = osc("sawtooth", hz(m + 12), t, 0.3, 7); const bg = ctx.createGain(); bg.gain.value = 0.35; b.connect(bg).connect(f);
      f.connect(g); M(g, { pan, send: 0.2, delay: 0.35 });
    }
    function stab(t, ch, vol = 1) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 2200; f.Q.value = 2;
      const g = ctx.createGain(); env(g, t, 0.003, 0.05 * vol, 0.18);
      CH[ch].pad.slice(1).forEach((m) => { for (const d of [-9, 9]) osc("sawtooth", hz(m), t, 0.4, d).connect(f); });
      f.connect(g); M(g, { send: 0.35, delay: 0.3 });
    }
    function braam(t, vol = 1, dur = 2.2, root = 26) {
      // Low brass-like swell: detuned saws, filter opens then closes.
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 3;
      f.frequency.setValueAtTime(120, t); f.frequency.exponentialRampToValueAtTime(900, t + 0.25); f.frequency.exponentialRampToValueAtTime(160, t + dur);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.28 * vol, t + 0.06); g.gain.setTargetAtTime(0, t + 0.4, dur / 3);
      [root, root + 7, root + 12, root + 19].forEach((m, i) => { for (const d of [-12, 0, 12]) osc("sawtooth", hz(m), t, dur + 0.4, d + i).connect(f); });
      f.connect(g); out(g, { send: 0.45 });
    }
    function boom(t, vol = 1) {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(75, t); o.frequency.exponentialRampToValueAtTime(30, t + 1.3); o.start(t); o.stop(t + 2.5);
      const g = ctx.createGain(); env(g, t, 0.003, 0.9 * vol, 1.7); o.connect(g); out(g, { send: 0.2 });
      const n = nsrc(t, 1.4); const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 300;
      const ng = ctx.createGain(); env(ng, t, 0.003, 0.5 * vol, 0.8); n.connect(lp).connect(ng); out(ng, { send: 0.5 });
    }
    function whoosh(t, dur = 0.9, vol = 1, dir = 1, f0 = 250, f1 = 3500) {
      const a = t - dur * 0.6; const n = nsrc(a, dur + 0.2);
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.1;
      bp.frequency.setValueAtTime(f0, a); bp.frequency.exponentialRampToValueAtTime(f1, t); bp.frequency.exponentialRampToValueAtTime(f0 * 2, a + dur);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.5 * vol, t); g.gain.exponentialRampToValueAtTime(0.0001, a + dur);
      const p = ctx.createStereoPanner(); p.pan.setValueAtTime(-0.8 * dir, a); p.pan.linearRampToValueAtTime(0.8 * dir, a + dur);
      n.connect(bp).connect(g).connect(p).connect(bus); const x = ctx.createGain(); x.gain.value = 0.3; p.connect(x).connect(verbIn);
    }
    function swish(t, dir = 1, vol = 1) { whoosh(t, 0.34, 0.9 * vol, dir, 900, 7500); }
    function thump(t, vol = 1) { const o = ctx.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.18); o.start(t); o.stop(t + 0.4); const g = ctx.createGain(); env(g, t, 0.002, 0.6 * vol, 0.25); o.connect(g); out(g); }
    function riser(a, b, vol = 1) {
      const n = nsrc(a, b - a); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.4;
      bp.frequency.setValueAtTime(300, a); bp.frequency.exponentialRampToValueAtTime(8000, b);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.3 * vol, b - 0.02); g.gain.linearRampToValueAtTime(0, b + 0.02);
      n.connect(bp).connect(g); out(g, { send: 0.4 });
      const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(110, a); o.frequency.exponentialRampToValueAtTime(880, b); o.start(a); o.stop(b + 0.05);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1800;
      const og = ctx.createGain(); og.gain.setValueAtTime(0.0001, a); og.gain.exponentialRampToValueAtTime(0.045 * vol, b - 0.02); og.gain.linearRampToValueAtTime(0, b + 0.02);
      o.connect(lp).connect(og); out(og, { send: 0.3 });
    }
    function reverse(a, b, vol = 1) {
      // Reverse-cymbal swell into a hit.
      const n = nsrc(a, b - a); const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.setValueAtTime(2000, a); hp.frequency.exponentialRampToValueAtTime(5000, b);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.22 * vol, b - 0.01); g.gain.linearRampToValueAtTime(0, b + 0.01);
      n.connect(hp).connect(g); out(g, { send: 0.5 });
    }
    function snare(t, vol = 1) { const n = nsrc(t, 0.2); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1900; bp.Q.value = 0.8; const g = ctx.createGain(); env(g, t, 0.001, 0.2 * vol, 0.08); n.connect(bp).connect(g); out(g, { send: 0.2 }); }
    function roll(a, b, vol = 1) { let t = a; while (t < b - 0.01) { const p = (t - a) / (b - a); snare(t, (0.25 + 0.75 * p * p) * vol); t += p < 0.5 ? BEAT / 2 : p < 0.8 ? BEAT / 4 : BEAT / 8; } }
    function tick(t, vol = 1, f = 2600, pan = 0) { const g = ctx.createGain(); env(g, t, 0.001, 0.12 * vol, 0.03); osc("sine", f, t, 0.08).connect(g); out(g, { pan, send: 0.08 }); }
    function beep(t) { [0, 0.11].forEach((o) => { const g = ctx.createGain(); env(g, t + o, 0.002, 0.07, 0.06); osc("sine", 2800, t + o, 0.12).connect(g); out(g, { pan: 0.3 }); }); }
    function shutter(t) { [0, 0.07].forEach((o, i) => { const n = nsrc(t + o, 0.05); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = i ? 2600 : 3800; bp.Q.value = 1.5; const g = ctx.createGain(); env(g, t + o, 0.001, 0.35, 0.018); n.connect(bp).connect(g); out(g, { send: 0.15 }); }); }
    function servo(t, dur) { const o = ctx.createOscillator(); o.type = "square"; o.frequency.setValueAtTime(90, t); o.frequency.linearRampToValueAtTime(150, t + dur); o.start(t); o.stop(t + dur + 0.05); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 900; bp.Q.value = 3; const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.03, t + 0.08); g.gain.setValueAtTime(0.03, t + dur - 0.08); g.gain.linearRampToValueAtTime(0, t + dur); o.connect(bp).connect(g); out(g, { pan: -0.2 }); }
    function tapeStop(t, dur = 0.45) { const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(hz(38), t); o.frequency.exponentialRampToValueAtTime(18, t + dur); o.start(t); o.stop(t + dur); const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(1500, t); lp.frequency.exponentialRampToValueAtTime(120, t + dur); const g = ctx.createGain(); g.gain.setValueAtTime(0.25, t); g.gain.linearRampToValueAtTime(0, t + dur); o.connect(lp).connect(g); out(g); }
    function keys(t, ch, vol = 1) {
      CH[ch].pad.slice(1).forEach((m, i) => [[1, 1], [2, 0.3], [3, 0.1]].forEach(([r, a]) => { const g = ctx.createGain(); env(g, t + i * 0.014, 0.006, 0.07 * vol * a, 3 / r); osc("sine", hz(m + 12) * r, t + i * 0.014, 3.6).connect(g); out(g, { pan: (i / 4 - 0.5) * 0.5, send: 0.6 }); }));
      const g = ctx.createGain(); env(g, t, 0.01, 0.15 * vol, 3.5); osc("sine", hz(CH[ch].bass + 12), t, 3.8).connect(g); out(g, { send: 0.3 });
    }
    function bell(t, m, vol = 1, dec = 2.4, pan = 0) { [[1, 1], [2, 0.4], [3.01, 0.2], [4.2, 0.1]].forEach(([r, a], i) => { const g = ctx.createGain(); env(g, t, 0.003, 0.08 * vol * a, dec / (1 + i * 0.6)); osc("sine", hz(m) * r, t, dec + 0.5).connect(g); out(g, { pan, send: 0.6, delay: 0.25 }); }); }
    function heart(t, vol = 1) { [0, 0.2].forEach((o, i) => { const s = ctx.createOscillator(); s.type = "sine"; s.frequency.setValueAtTime(70, t + o); s.frequency.exponentialRampToValueAtTime(38, t + o + 0.15); s.start(t + o); s.stop(t + o + 0.35); const g = ctx.createGain(); env(g, t + o, 0.004, (i ? 0.35 : 0.55) * vol, 0.22); s.connect(g); out(g); }); }

    /* ═════════ SCORE ═════════ */
    // I · light (0–8): drone, heartbeat, shimmer — then the pulse wakes.
    drone(0, 8.4, 1);
    braam(0.05, 0.55, 2.4);
    for (let t = 0.5; t < 4; t += 1) heart(t, 0.8);
    for (let t = 1.0; t < 8; t += BEAT / 2) hat(t, t < 4 ? 0.35 : 0.6, false, 0.3);
    pad(0.2, 7.8, "Dm", { vol: 0.5, cut: 500, cut2: 1600, att: 2 });
    for (let t = 6.0; t < 8; t += BEAT) kick(t, 0.75, 700);
    for (let n = 32; n * S16 < 8; n++) if (n % 4 !== 0) rbass(n * S16, 38, 0.45);

    // II · the four worlds (8–16) and the set (16–22).
    for (let n = 64; n * S16 < 22; n++) {
      const t = n * S16, q = n % 4, beat = Math.floor(n / 4) % 4, c = chordAt(t);
      const set = t >= 16; // the set: pull the kick out, keep the clock
      if (q === 0 && !set) kick(t, 0.95);
      if (q === 0 && !set && t >= 10 && (beat === 1 || beat === 3)) clap(t, 0.75);
      hat(t, q === 2 ? 0.6 : 0.25, false, 0.25);
      if (q === 2 && !set) hat(t, 0.6, true, -0.1);
      if (q !== 0) rbass(t, CH[c].bass + (q === 3 && beat === 3 ? 12 : 0), set ? 0.55 : 0.9);
      if (n % 2 === 0) pluck(t, CH[c].arp[(n / 2) % 8] + (set ? 0 : 12), set ? 0.5 : 0.7, n % 4 ? 0.35 : -0.35, set ? 1600 : 3200);
    }
    [[8, "Dm"], [12, "Bb"], [16, "F"], [20, "C"]].forEach(([t, c]) => pad(t, t === 20 ? 2 : 4, c, { vol: 0.55, cut: 1200, cut2: 1700, att: 0.3 }));
    [8.3, 10.35, 12.4, 14.45].forEach((t, i) => braam(t - 0.02, 0.35, 1.2, [26, 22, 29, 24][i]));
    riser(19.8, 22.0, 1.1); roll(20.5, 22.0, 1); reverse(21.2, 22.0, 1);

    // III · the montage (22–29.5): full drop.
    boom(22.0, 1); braam(22.0, 0.7, 2.0);
    for (let n = 176; n * S16 < 29.5; n++) {
      const t = n * S16, q = n % 4, beat = Math.floor(n / 4) % 4, c = chordAt(t);
      if (q === 0) kick(t, 1);
      if (q === 0 && (beat === 1 || beat === 3)) clap(t, 1);
      hat(t, q === 2 ? 0.7 : 0.3, q === 2, 0.25);
      if (q !== 0) rbass(t, CH[c].bass + (q === 2 ? 12 : 0), 1.1);
      pluck(t, CH[c].arp[n % 8] + 12, q === 0 ? 0.9 : 0.55, n % 2 ? 0.4 : -0.4, 3600);
      if (q === 2 && (beat === 1 || beat === 3)) stab(t, c, 0.9);
    }
    [[22, "Dm"], [24, "Bb"], [26, "F"], [28, "C"]].forEach(([t, c]) => pad(t, t === 28 ? 1.5 : 2, c, { vol: 0.45, cut: 1800, cut2: 2400, att: 0.1 }));
    tapeStop(29.55, 0.45);

    // IV · the pause (30–34.35): "Çünkü iyi bir iş… anlatılmaz."
    reverse(29.4, 30.0, 0.8);
    boom(30.0, 0.5);
    pad(30.0, 2.0, "Bb", { vol: 0.8, cut: 700, cut2: 1400, att: 0.5 });
    pad(32.0, 2.3, "C", { vol: 0.85, cut: 900, cut2: 2200, att: 0.4 });
    keys(30.2, "Bb", 0.9); keys(32.2, "C", 0.9);
    heart(31.0, 0.5); heart(32.0, 0.6); heart(33.0, 0.7);
    riser(33.1, 34.35, 1); reverse(33.6, 34.35, 1.1);

    // V · "Kendini izletir." — the only major chord.
    boom(34.35, 1.1); braam(34.35, 0.6, 2.6, 26);
    pad(34.35, 5.2, "D", { vol: 1.1, cut: 2600, cut2: 1100, att: 0.05 });
    keys(34.5, "D", 1);
    [74, 78, 81, 86, 90].forEach((m, i) => bell(34.4 + i * 0.08, m, 0.45, 3.2, (i - 2) * 0.3));
    for (let t = 35.5; t < 39; t += BEAT) kick(t, 0.35, 500);
    [81, 86, 90, 93].forEach((m, i) => bell(36.9 + i * 0.09, m, 0.3, 2.5, (i - 1.5) * 0.4));
    bell(37.4, 86, 0.8, 3.2, 0); thump(37.4, 0.6);

    /* ═════════ SFX on the cuts ═════════ */
    const J = await (await fetch(`${BASE}/reel/shots.json`)).json();
    J.shots.forEach((s, i) => {
      const t = s.t, dir = i % 2 ? 1 : -1;
      switch (s.tr) {
        case "flash": whoosh(t, 0.7, 0.8, dir, 400, 5000); thump(t, 0.5); break;
        case "zoom": whoosh(t, 0.55, 0.9, dir, 200, 4000); thump(t + 0.02, 0.8); break;
        case "whipL": swish(t, -1); break;
        case "whipR": swish(t, 1); break;
        case "spin": whoosh(t, 0.5, 0.9, dir, 300, 6000); swish(t + 0.05, -dir, 0.6); break;
        case "cut": tick(t, 0.5, 1800 + i * 90, dir * 0.3); break;
        default: break;
      }
    });
    whoosh(2.5, 1.1, 0.9, 1, 300, 6000); reverse(1.8, 2.5, 0.8);
    shutter(16.05); servo(16.3, 1.4); beep(17.25); whoosh(18.0, 0.9, 0.7, 1, 200, 2500);
    whoosh(20.5, 0.5, 0.6, -1, 800, 6000); // the fabric pull

    /* ═════════ Voice-over (ElevenLabs) with ducking ═════════ */
    const vo = await (await fetch(`${BASE}/.cache/reel/vo-timing.json`)).json();
    const voBus = ctx.createGain(); voBus.gain.value = 1.35;
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 85;
    const pres = ctx.createBiquadFilter(); pres.type = "peaking"; pres.frequency.value = 3200; pres.gain.value = 3; pres.Q.value = 0.9;
    const vc = ctx.createDynamicsCompressor(); vc.threshold.value = -20; vc.ratio.value = 3.5; vc.attack.value = 0.005; vc.release.value = 0.12;
    voBus.connect(hp).connect(pres).connect(vc).connect(bus);
    const vs = ctx.createGain(); vs.gain.value = 0.12; vc.connect(vs).connect(verbIn);
    for (const l of vo) {
      const raw = await (await fetch(`${BASE}/reel/vo/${l.id}.mp3`)).arrayBuffer();
      const buf = await ctx.decodeAudioData(raw);
      const src = ctx.createBufferSource(); src.buffer = buf;
      src.connect(voBus);
      src.start(l.start, Math.max(0, l.lead - 0.03));
      const a = l.start - 0.12, b = l.start + l.speech + 0.25;
      music.gain.setTargetAtTime(0.42, a, 0.05);
      music.gain.setTargetAtTime(0.8, b, 0.18);
    }

    master.gain.setValueAtTime(1, 39.2);
    master.gain.linearRampToValueAtTime(0, DUR - 0.02);
    const out0 = await ctx.startRendering();
    let peak = 0;
    for (let c = 0; c < 2; c++) { const d = out0.getChannelData(c); for (let i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i])); }
    const k = 0.891 / (peak || 1);
    for (let c = 0; c < 2; c++) { const d = out0.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] *= k; }
    return out0;
  }

  function toWav(buf) {
    const ch = 2, n = buf.length, bytes = new ArrayBuffer(44 + n * ch * 2), v = new DataView(bytes);
    const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
    w(0, "RIFF"); v.setUint32(4, 36 + n * 4, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
    v.setUint32(24, SR, true); v.setUint32(28, SR * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 4, true);
    const L = buf.getChannelData(0), Rr = buf.getChannelData(1); let o = 44;
    for (let i = 0; i < n; i++) for (const d of [L, Rr]) { const s = Math.max(-1, Math.min(1, d[i])); v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true); o += 2; }
    const u8 = new Uint8Array(bytes); let bin = "";
    for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  window.ReelAudio = { render };
  window.__audio = async () => toWav(await render());
})();
