/*
 * Rast Creative — "Bir Saniye" · sound
 * ------------------------------------------------------------------
 * A projector (motor hum + 24 clicks a second — the film's own heartbeat),
 * a felt piano in A minor that only resolves to C major on "teşekkürler",
 * and the voice-over on top with the music ducking under it.
 * Cue times come from timing.js (window.SECOND), shared with the picture.
 *
 *   window.SecondAudio.render() → AudioBuffer
 *   window.__audio()            → base64 WAV
 */
(() => {
  "use strict";
  const SR = 48000;
  const BASE = "/automations/brand-film/second";
  const hz = (m) => 440 * 2 ** ((m - 69) / 12);
  function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let r = Math.imul(seed ^ (seed >>> 15), 1 | seed); r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r; return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
  const CH = {
    Am: [45, 57, 60, 64, 71], F: [41, 57, 60, 65, 69], C: [48, 55, 60, 64, 67, 74], G: [43, 55, 59, 62, 67], Fmaj7: [41, 57, 60, 64, 69], Cadd9: [36, 48, 55, 62, 64, 67, 74],
  };

  async function render() {
    const S = window.SECOND, C = S.CUE, DUR = S.DUR;
    const ctx = new OfflineAudioContext(2, SR * DUR, SR);
    const R = rng(24);
    const master = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 2.5; comp.knee.value = 10; comp.attack.value = 0.01; comp.release.value = 0.25;
    comp.connect(master).connect(ctx.destination);
    const bus = ctx.createGain(); bus.connect(comp);
    const music = ctx.createGain(); music.gain.value = 0.85; music.connect(bus);   // ducked under the voice
    const sfx = ctx.createGain(); sfx.gain.value = 0.5; sfx.connect(bus);

    const ir = ctx.createBuffer(2, SR * 4, SR);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let lp = 0; for (let i = 0; i < d.length; i++) { lp += 0.22 * ((R() * 2 - 1) - lp); d[i] = lp * Math.exp(-i / SR / 1.3); } }
    const verb = ctx.createConvolver(); verb.buffer = ir;
    const verbIn = ctx.createGain(); verbIn.connect(verb).connect(bus);

    const noise = ctx.createBuffer(1, SR * 2, SR);
    { const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = R() * 2 - 1; }
    const nsrc = (t, dur) => { const s = ctx.createBufferSource(); s.buffer = noise; s.loop = true; s.start(t, R() * 1.5); s.stop(t + dur + 0.1); return s; };
    const osc = (type, f, t, dur, det = 0) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; o.detune.value = det; o.start(t); o.stop(t + dur + 0.05); return o; };
    const env = (g, t, a, peak, d) => { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setTargetAtTime(0, t + a, d / 4); };
    const out = (node, { to = music, pan = 0, send = 0, gain = 1 } = {}) => {
      const g = ctx.createGain(); g.gain.value = gain; const p = ctx.createStereoPanner(); p.pan.value = pan;
      node.connect(g).connect(p).connect(to);
      if (send) { const x = ctx.createGain(); x.gain.value = send; p.connect(x).connect(verbIn); }
    };

    /* ───── instruments ───── */
    function piano(t, m, vol = 1, pan = 0, dec = 3.2) {
      [[1, 1], [2, 0.35], [3, 0.12], [4.02, 0.05]].forEach(([r, a], i) => {
        const g = ctx.createGain(); env(g, t, 0.004, 0.08 * vol * a, dec / (1 + i * 0.7));
        osc(i ? "sine" : "triangle", hz(m) * r, t, dec + 0.5, (R() - 0.5) * 4).connect(g); out(g, { pan, send: 0.55 });
      });
      const n = nsrc(t, 0.03); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = hz(m) * 4; bp.Q.value = 2;
      const ng = ctx.createGain(); env(ng, t, 0.001, 0.01 * vol, 0.02); n.connect(bp).connect(ng); out(ng, { pan });
    }
    function chord(t, name, vol = 1, spread = 0.03) { CH[name].forEach((m, i) => piano(t + i * spread, m, vol * (m < 50 ? 1.1 : 0.8), (i / CH[name].length - 0.5) * 0.6)); }
    function pad(t, dur, name, { vol = 1, cut = 900, cut2 = cut, att = 1.2 } = {}) {
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.Q.value = 0.5; f.frequency.setValueAtTime(cut, t); f.frequency.linearRampToValueAtTime(cut2, t + dur);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.035 * vol, t + att); g.gain.setValueAtTime(0.035 * vol, t + dur); g.gain.linearRampToValueAtTime(0, t + dur + 1.5);
      f.connect(g); out(g, { send: 0.7 });
      CH[name].forEach((m, i) => { for (const d of [-7, 7]) { const o = osc("sawtooth", hz(m), t, dur + 1.6, d); const og = ctx.createGain(); og.gain.value = 0.3; const p = ctx.createStereoPanner(); p.pan.value = (i / 5 - 0.5) * 0.8 * Math.sign(d); o.connect(og).connect(p).connect(f); } });
    }
    function bell(t, m, vol = 1, dec = 2.6, pan = 0) { [[1, 1], [2, 0.4], [3.01, 0.2], [4.2, 0.1]].forEach(([r, a], i) => { const g = ctx.createGain(); env(g, t, 0.003, 0.06 * vol * a, dec / (1 + i * 0.6)); osc("sine", hz(m) * r, t, dec + 0.5).connect(g); out(g, { pan, send: 0.6 }); }); }
    function heart(t, vol = 1) { [0, 0.2].forEach((o, i) => { const s = ctx.createOscillator(); s.type = "sine"; s.frequency.setValueAtTime(68, t + o); s.frequency.exponentialRampToValueAtTime(38, t + o + 0.15); s.start(t + o); s.stop(t + o + 0.35); const g = ctx.createGain(); env(g, t + o, 0.004, (i ? 0.3 : 0.5) * vol, 0.22); s.connect(g); out(g); }); }
    function thump(t, vol = 1, f0 = 110) { const o = ctx.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.2); o.start(t); o.stop(t + 0.4); const g = ctx.createGain(); env(g, t, 0.002, 0.5 * vol, 0.25); o.connect(g); out(g, { to: sfx }); }
    function click(t, vol = 1, f = 2400, q = 2, pan = 0) { const n = nsrc(t, 0.03); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = f; bp.Q.value = q; const g = ctx.createGain(); env(g, t, 0.0005, 0.3 * vol, 0.012); n.connect(bp).connect(g); out(g, { to: sfx, pan }); }
    function tick(t, vol = 1, f = 2800, pan = 0) { const g = ctx.createGain(); env(g, t, 0.001, 0.08 * vol, 0.03); osc("sine", f, t, 0.08).connect(g); out(g, { to: sfx, pan, send: 0.2 }); }
    function whoosh(t, dur = 0.5, vol = 1, f0 = 500, f1 = 6000) {
      const a = t - dur * 0.5, n = nsrc(a, dur + 0.1); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.2;
      bp.frequency.setValueAtTime(f0, a); bp.frequency.exponentialRampToValueAtTime(f1, t); bp.frequency.exponentialRampToValueAtTime(f0 * 2, a + dur);
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.4 * vol, t); g.gain.exponentialRampToValueAtTime(0.0001, a + dur);
      n.connect(bp).connect(g); out(g, { to: sfx, send: 0.15 });
    }
    function swell(a, b, vol = 1) { const n = nsrc(a, b - a); const hp = ctx.createBiquadFilter(); hp.type = "bandpass"; hp.Q.value = 0.8; hp.frequency.setValueAtTime(400, a); hp.frequency.exponentialRampToValueAtTime(3000, b); const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, a); g.gain.exponentialRampToValueAtTime(0.12 * vol, b - 0.02); g.gain.linearRampToValueAtTime(0, b + 0.02); n.connect(hp).connect(g); out(g, { send: 0.5 }); }
    function pop(t, vol = 1) { const o = ctx.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(420, t); o.frequency.exponentialRampToValueAtTime(900, t + 0.08); o.start(t); o.stop(t + 0.2); const g = ctx.createGain(); env(g, t, 0.003, 0.18 * vol, 0.1); o.connect(g); out(g, { to: sfx, send: 0.3 }); }

    /* ───── the projector ───── */
    const on = C.lampOn, off = C.lampOff;
    thump(on, 0.8, 90); click(on, 1.2, 1200, 1.5); swell(on - 0.05, on + 0.5, 0.6);
    { // motor hum
      const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 220;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, on); g.gain.linearRampToValueAtTime(0.05, on + 0.6); g.gain.setValueAtTime(0.05, off); g.gain.linearRampToValueAtTime(0, off + 0.9);
      const o = osc("sawtooth", 48, on, off - on + 1); o.frequency.setValueAtTime(48, off); o.frequency.exponentialRampToValueAtTime(18, off + 0.9);
      o.connect(f).connect(g); out(g, { to: sfx });
      const n = nsrc(on, off - on + 1); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 900; bp.Q.value = 0.6;
      const ng = ctx.createGain(); ng.gain.setValueAtTime(0, on); ng.gain.linearRampToValueAtTime(0.02, on + 0.6); ng.gain.setValueAtTime(0.02, off); ng.gain.linearRampToValueAtTime(0, off + 0.8);
      n.connect(bp).connect(ng); out(ng, { to: sfx });
    }
    // 24 clicks a second; louder while the strip runs, winding down when the lamp goes out
    for (let t = on + 0.2; t < off + 0.9; ) {
      const strip = t > C.strip[0] && t < C.strip[1] ? 1.8 : 1;
      const fade = Math.min(1, (t - on) / 0.8) * (t > off ? 1 - (t - off) / 0.9 : 1);
      click(t, 0.12 * strip * fade, 2600 + R() * 600, 3, -0.15);
      t += t > off ? (1 / 24) * (1 + (t - off) * 3) : 1 / 24;
    }
    thump(off, 0.6, 80); click(off, 1, 900, 1.2);

    /* ───── score ───── */
    // I · the finger waits (1–9): almost nothing — a low A, two notes.
    pad(1.0, 8.0, "Am", { vol: 0.35, cut: 400, cut2: 700, att: 3 });
    piano(C.hesitate, 76, 0.5, 0.2); piano(C.freeze, 72, 0.7, -0.2); piano(C.freeze + 0.02, 64, 0.5, 0.2);
    for (let k = 0; k < 4; k++) tick(1.2 + k, 0.35, 3200);
    tick(3.2, 0.6, 3600); // two seconds
    // II · the secret (9–14)
    swell(9.6, C.rulerDraw, 0.8);
    tick(C.rulerDraw, 0.9, 2000); bell(C.rulerDraw + 0.02, 81, 0.5, 2.5);
    for (let i = 0; i < 24; i++) tick(C.ticks + i * 0.022, 0.25 + i * 0.01, 2600 + i * 40, (i / 23 - 0.5) * 1.2);
    // III · the strip and the nights (13.7–24.2): a pulse and a turning progression
    for (let t = 13.9; t < C.frameEnd - 0.2; t += 60 / 72) heart(t, t < 17 ? 0.5 : 0.7);
    pad(13.7, 3.3, "Am", { vol: 0.7, cut: 700, cut2: 1800, att: 1.2 });
    const PROG = [["Am", C.frames[0]], ["F", C.frames[1]], ["C", C.frames[2]], ["G", C.frames[3]]];
    PROG.forEach(([c, t], i) => {
      const end = i < 3 ? PROG[i + 1][1] : C.frameEnd;
      chord(t, c, 0.8); pad(t, end - t, c, { vol: 0.6, cut: 1100, cut2: 1500, att: 0.3 });
      const arp = CH[c].slice(1).concat(CH[c].slice(2).map((m) => m + 12));
      for (let k = 0, tt = t + 0.42; tt < end - 0.1; k++, tt += 0.21) piano(tt, arp[k % arp.length] + 12, 0.28, k % 2 ? 0.4 : -0.4, 1.6);
      click(t, 0.9, 1400, 1.2); thump(t, 0.35, 70);            // frame advance
    });
    { // the clapper
      const n = nsrc(C.clap, 0.08); const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1600; bp.Q.value = 1.2;
      const g = ctx.createGain(); env(g, C.clap, 0.0005, 0.9, 0.04); n.connect(bp).connect(g); out(g, { to: sfx, send: 0.3 });
    }
    // IV · the swipe… "olsun." (24.2–30)
    whoosh(C.swipe + 0.15, 0.45, 1.1, 700, 8000);
    piano(C.backIn, 69, 0.8, 0); pad(C.backIn, 3.4, "Fmaj7", { vol: 0.7, cut: 700, cut2: 1300, att: 1 });
    chord(C.oneFrame, "C", 0.55, 0.06); bell(C.oneFrame + 0.1, 84, 0.4, 3);
    for (let t = C.oneFrame + 0.8; t < C.tapIn; t += 60 / 72) heart(t, 0.35);
    // V · two taps, a heart, "teşekkürler" — the only resolution
    pad(C.tapIn, 2.7, "G", { vol: 0.6, cut: 800, cut2: 2000, att: 1.5 });
    C.taps.forEach((t) => { thump(t, 0.5, 160); click(t, 0.5, 3000, 2); });
    pop(C.heart, 1); bell(C.heart + 0.05, 88, 0.4, 1.8, 0.2);
    chord(C.thanks, "Cadd9", 1.1, 0.05);
    pad(C.thanks, DUR - C.thanks - 1.6, "Cadd9", { vol: 1, cut: 1800, cut2: 900, att: 0.4 });
    [76, 79, 84, 88, 91].forEach((m, i) => bell(C.thanks + 0.1 + i * 0.09, m, 0.35, 3.2, (i - 2) * 0.3));
    // VI · the logo
    thump(C.logo, 0.5, 60); bell(C.logo + 0.05, 84, 0.6, 4); bell(C.logo + 0.2, 91, 0.35, 3.5, 0.3);
    piano(C.logo + 1.3, 72, 0.5); piano(C.logo + 1.32, 76, 0.4); piano(C.logo + 1.34, 79, 0.35);

    /* ───── voice-over, music ducks under it ───── */
    const voBus = ctx.createGain(); voBus.gain.value = 1.35;
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 80;
    const pres = ctx.createBiquadFilter(); pres.type = "peaking"; pres.frequency.value = 3000; pres.gain.value = 2.5; pres.Q.value = 0.9;
    const vc = ctx.createDynamicsCompressor(); vc.threshold.value = -20; vc.ratio.value = 3; vc.attack.value = 0.005; vc.release.value = 0.15;
    voBus.connect(hp).connect(pres).connect(vc).connect(bus);
    const vs = ctx.createGain(); vs.gain.value = 0.14; vc.connect(vs).connect(verbIn);
    for (const l of S.LINES) {
      const raw = await (await fetch(`${BASE}/vo/${l.id}.mp3`)).arrayBuffer();
      const buf = await ctx.decodeAudioData(raw);
      const src = ctx.createBufferSource(); src.buffer = buf; src.connect(voBus);
      src.start(l.at, l.lead);
      music.gain.setTargetAtTime(0.5, l.at - 0.15, 0.06);
      music.gain.setTargetAtTime(0.85, l.at + l.speech + 0.25, 0.2);
    }

    master.gain.setValueAtTime(1, DUR - 1.2);
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
  window.SecondAudio = { render };
  window.__audio = async () => toWav(await render());
})();
