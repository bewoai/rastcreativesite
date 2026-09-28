/*
 * "Çekim Günü" — the shared clock. Picture (cekim.js) and sound (cekim-audio.js)
 * both read this. 120 BPM: every cut sits on a beat (0.5 s).
 *   SHOTS  id · film [a, b) · src in-point (s) · optional speed map
 *   WORDS  white captions, centred, inside the safe zone
 */
window.CEKIM = {
  DUR: 30, FPS: 30, BPM: 120,
  SHOTS: [
    { id: "s01", a: 0.0, b: 2.5, in: 0.3 },            // studio, arms crossed
    { id: "s02", a: 2.5, b: 4.5, in: 0.6 },            // sunglasses glint
    { id: "s03", a: 4.5, b: 8.5, in: 0.0 },            // highway, drone alongside
    { id: "s04", a: 8.5, b: 10.5, in: 0.6 },           // inside the car
    { id: "s05", a: 10.5, b: 13.0, in: 0.0, ramp: [1.3, 0.45, 1.9] }, // slow through the gap, then snap
    { id: "s06", a: 13.0, b: 15.5, in: 0.3 },          // catch + fist bump
    { id: "s07", a: 15.5, b: 17.5, in: 0.3 },          // clinic, clapper
    { id: "s08", a: 17.5, b: 21.5, in: 0.0 },          // the doctor: "ten seconds?"
    { id: "s09", a: 21.5, b: 23.5, in: 0.8 },          // Enter
    { id: "s10", a: 23.5, b: 27.5, in: 0.0 },          // jaws dropped
  ],
  WORDS: [
    { a: 0.45, b: 2.35, text: "Bir çekim günü." },
    { a: 5.0, b: 8.3, text: "Otoyolda," },
    { a: 15.7, b: 17.35, text: "klinikte," },
    { a: 18.0, b: 21.3, text: "“Sadece on saniye mi?”", quote: true },
    { a: 21.75, b: 23.35, text: "kurguda." },
  ],
  CUE: {
    glint: 3.35, drop: 4.5, truck: 11.8, snap: 11.8, bump: 13.8, clap: 15.92,
    enter: 23.42, freeze: 23.5, beeps: [24.4, 25.4, 26.4], logo: 27.5, line: 28.3, pill: 28.8,
  },
};
