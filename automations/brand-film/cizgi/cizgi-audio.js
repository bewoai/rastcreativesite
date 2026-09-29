/*
 * Rast Creative — "Tek Çizgi" · sound
 * A calm, premium bed in D minor (Dm–Bb–F–C, 5 s per chord): warm pad, sparse piano-ish plucks,
 * a low sub, pen scratches under every draw, a wooden clack on the clapper, a shimmer for the logo.
 * Loop-safe: the render has 2 s of pre-roll and a 3 s tail that are folded back onto the loop,
 * so the last chord's reverb melts into the first bar.
 *   window.CizgiAudio.render() → AudioBuffer (exactly DUR seconds)
 *   window.__audio()           → base64 WAV
 */
(() => {
  "use strict";
  const SR = 48000, { DUR, T } = window.CIZGI, PRE = 2, TAIL = 4;
  const hz = (m) => 440 * 2 ** ((m - 69) / 12);
  const P = (t, a, c) => (!(t > a) ? 0 : t >= c ? 1 : (t - a) / (c - a));
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let r = Math.imul(seed ^ (seed >>> 15), 1 | seed); r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
  const CH = [[38, [62, 65, 69, 72]], [34, [62, 65, 70, 74]], [41, [60, 65, 69, 72]], [36, [60, 64, 67, 72]]];
  const ARP = [0, 2, 1, 3, 2, 1]; // voicing indices, sparse

  async function render() {
    const N = Math.round((PRE + DUR + TAIL) * SR), ctx = new OfflineAudioContext(2, N, SR), R = rng(7);
    const noise = ctx.createBuffer(1, SR * 2, SR); { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = R() * 2 - 1; }
    const at = (t) => t + PRE;
    const master = ctx.createGain(); master.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3; comp.attack.value = 0.02; comp.release.value = 0.3;
    master.connect(comp); comp.connect(ctx.destination);
    const ir = ctx.createBuffer(2, SR * 3.5, SR);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let lp = 0; for (let i = 0; i < d.length; i++) { lp += 0.25 * ((R() * 2 - 1) - lp); d[i] = lp * Math.exp(-i / SR / 1.1); } }
    const verb = ctx.createConvolver(); verb.buffer = ir; const vg = ctx.createGain(); vg.gain.value = 0.55; verb.connect(vg); vg.connect(master);
    const out = (node, { send = 0.3, pan = 0, dry = 1 } = {}) => {
      const p = ctx.createStereoPanner(); p.pan.value = pan; node.connect(p);
      const d = ctx.createGain(); d.gain.value = dry; p.connect(d); d.connect(master);
      const s = ctx.createGain(); s.gain.value = send; p.connect(s); s.connect(verb);
    };
    const osc = (type, f, t, dur, det = 0) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = det; o.start(t); o.stop(t + dur + 0.05); return o; };
    const nsrc = (t, dur) => { const s = ctx.createBufferSource(); s.buffer = noise; s.loop = true; s.start(t, R() * 1.5); s.stop(t + dur + 0.1); return s; };

    // ---- pad + sub, one chord per 5 s, overlapping so the bed never dips
    CH.forEach(([bass, notes], k) => {
      const t0 = at(k * 5 - 1.4), dur = 8.2;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.085, t0 + 2.2); g.gain.setValueAtTime(0.085, t0 + dur - 2.6); g.gain.linearRampToValueAtTime(0, t0 + dur);
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 900; f.Q.value = 0.3; f.connect(g);
      notes.forEach((m, i) => { [-7, 7].forEach((dt) => osc("triangle", hz(m), t0, dur, dt).connect(f)); if (i === 0) osc("sine", hz(m - 12), t0, dur).connect(f); });
      out(g, { send: 0.5 });
      const sg = ctx.createGain(); sg.gain.setValueAtTime(0, t0 + 0.6); sg.gain.linearRampToValueAtTime(0.16, t0 + 2.4); sg.gain.setValueAtTime(0.16, t0 + dur - 3); sg.gain.linearRampToValueAtTime(0, t0 + dur - 0.3);
      osc("sine", hz(bass), t0, dur).connect(sg); out(sg, { send: 0.05 });
    });

    // ---- plucks: slow, sparse arpeggio in the upper octave
    const pluck = (t, m, v, pan) => {
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.008); g.gain.setTargetAtTime(0, t + 0.008, 0.55);
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(3200, t); f.frequency.exponentialRampToValueAtTime(700, t + 1.2); f.connect(g);
      osc("triangle", hz(m), t, 3).connect(f); const h = osc("sine", hz(m + 12), t, 2); const hg = ctx.createGain(); hg.gain.value = 0.35; h.connect(hg); hg.connect(f);
      out(g, { send: 0.65, pan });
    };
    CH.forEach(([, notes], k) => {
      const base = k * 5; const offs = k % 2 ? [0.25, 1.0, 1.9, 3.1] : [0.5, 1.4, 2.4, 3.4];
      offs.forEach((o, i) => pluck(at(base + o), notes[ARP[(i + k) % ARP.length]] + 12, 0.075 - i * 0.008, (i % 2 ? 0.25 : -0.25)));
    });

    // ---- pen scratches under every draw
    const scratch = (a, b, vol = 0.05) => {
      const s = nsrc(at(a), b - a); const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 3600; f.Q.value = 1.2;
      const g = ctx.createGain(); const lfo = 1.6 + R();
      g.gain.setValueAtTime(0, at(a)); const steps = Math.floor((b - a) * 14);
      for (let i = 0; i < steps; i++) { const tt = a + (i / steps) * (b - a); g.gain.linearRampToValueAtTime(vol * (0.4 + 0.6 * Math.abs(Math.sin(i * lfo))) * Math.sin(Math.PI * (i / steps)) ** 0.5, at(tt)); }
      g.gain.linearRampToValueAtTime(0, at(b)); s.connect(f); f.connect(g); out(g, { send: 0.15, pan: (R() - 0.5) * 0.4 });
    };
    scratch(T.s1[0], T.s1[1]); scratch(T.s2[0], T.s2[1]); scratch(T.s3[0], T.s3[1]); scratch(T.play[0], T.play[1], 0.035); scratch(T.s4[0], T.s4[1]); scratch(T.swash[0], T.swash[1], 0.045);

    // ---- whooshes for the dot's travels
    const whoosh = (a, b, vol = 0.05) => {
      const s = nsrc(at(a), b - a); const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 0.8; f.frequency.setValueAtTime(400, at(a)); f.frequency.exponentialRampToValueAtTime(2600, at((a + b) / 2)); f.frequency.exponentialRampToValueAtTime(500, at(b));
      const g = ctx.createGain(); g.gain.setValueAtTime(0, at(a)); g.gain.linearRampToValueAtTime(vol, at((a + b) / 2)); g.gain.linearRampToValueAtTime(0, at(b)); s.connect(f); f.connect(g); out(g, { send: 0.3 });
    };
    whoosh(3.5, 4.15); whoosh(6.1, 6.75); whoosh(9.6, 10.15, 0.04); whoosh(12.2, 12.85, 0.06);
    whoosh(T.exit[0], T.exit[1], 0.05);

    // ---- clapper: wood clack + soft thump
    { const t = at(T.clap); const s = nsrc(t, 0.12); const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1900; f.Q.value = 1.4; const g = ctx.createGain(); g.gain.setValueAtTime(0.28, t); g.gain.setTargetAtTime(0, t, 0.018); s.connect(f); f.connect(g); out(g, { send: 0.25 });
      const th = osc("sine", 190, t, 0.3); th.frequency.exponentialRampToValueAtTime(70, t + 0.2); const tg = ctx.createGain(); tg.gain.setValueAtTime(0.22, t); tg.gain.setTargetAtTime(0, t, 0.06); th.connect(tg); out(tg, { send: 0.1 }); }
    // triangle "play" tick
    { const t = at(T.play[1]); const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.06, t + 0.004); g.gain.setTargetAtTime(0, t + 0.004, 0.35); osc("sine", 1568, t, 1.5).connect(g); out(g, { send: 0.7, pan: 0.2 }); }

    // ---- logo: riser into a shimmer chord
    { const a = 11.9, b = T.logo[0]; const s = nsrc(at(a), b - a); const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.setValueAtTime(600, at(a)); f.frequency.exponentialRampToValueAtTime(5000, at(b)); const g = ctx.createGain(); g.gain.setValueAtTime(0, at(a)); g.gain.linearRampToValueAtTime(0.06, at(b)); g.gain.setTargetAtTime(0, at(b), 0.25); s.connect(f); f.connect(g); out(g, { send: 0.4 });
      [74, 81, 86, 90].forEach((m, i) => { const t = at(b + i * 0.07); const e = ctx.createGain(); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.045, t + 0.006); e.gain.setTargetAtTime(0, t + 0.006, 0.7); osc("sine", hz(m), t, 3).connect(e); out(e, { send: 0.9, pan: (i - 1.5) * 0.3 }); });
      const st = at(b), sg = ctx.createGain(); sg.gain.setValueAtTime(0.0, st); sg.gain.linearRampToValueAtTime(0.2, st + 0.02); sg.gain.setTargetAtTime(0, st + 0.02, 0.5); const so = osc("sine", 55, st, 2); so.frequency.exponentialRampToValueAtTime(41, st + 1); so.connect(sg); out(sg, { send: 0.1 }); }
    // text chimes
    [T.t1[0] + 0.05, T.t2[0] + 0.05, T.swash[0]].forEach((tt, i) => { const t = at(tt); const e = ctx.createGain(); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.035, t + 0.004); e.gain.setTargetAtTime(0, t + 0.004, 0.45); osc("sine", hz([81, 86, 93][i]), t, 2).connect(e); out(e, { send: 0.8, pan: i ? 0.2 : -0.2 }); });
    // soft heartbeat-ish tick when the dot lands home (helps the loop point)
    { const t = at(T.exit[1] - 0.05); const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.1, t + 0.01); g.gain.setTargetAtTime(0, t + 0.01, 0.12); const o = osc("sine", 110, t, 0.8); o.frequency.exponentialRampToValueAtTime(60, t + 0.4); o.connect(g); out(g, { send: 0.2 }); }

    const rendered = await ctx.startRendering();
    // fold pre-roll and tail back onto the loop
    const M = Math.round(DUR * SR), buf = new AudioBuffer({ numberOfChannels: 2, length: M, sampleRate: SR });
    for (let c = 0; c < 2; c++) { const src = rendered.getChannelData(c), dst = buf.getChannelData(c); for (let i = 0; i < N; i++) { const j = i - Math.round(PRE * SR); dst[((j % M) + M) % M] += src[i]; } }
    let peak = 0; for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < M; i++) peak = Math.max(peak, Math.abs(d[i])); }
    const k = 0.891 / (peak || 1); for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < M; i++) d[i] *= k; }
    return buf;
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
  window.CizgiAudio = { render };
  window.__audio = async () => toWav(await render());
})();
