/*
 * "Çekim Günü" (papercraft) — the shared clock. 120 BPM, cuts on the beat.
 * Kept under the same global name as the 3D cut (window.CEKIM3D) so the
 * trailer score (../cekim-3d/cekim3d-audio.js) drives this edit unchanged.
 *   SHOTS  clip id · film [a, b) · in-point in the Kling clip (s) · optional speed ramp
 * Roles: A (cap + shades) drives + gimbal · B (beard) flies the drone + clapper + Enter.
 */
window.CEKIM3D = {
  DUR: 30, FPS: 30, BPM: 120,
  SHOTS: [
    { id: "p01", a: 0.0, b: 2.0, in: 0.5 },     // studio: B arms crossed, A fixes his cap
    { id: "p02", a: 2.0, b: 3.0, in: 0.9 },     // A: shades on, glint
    { id: "p03", a: 3.0, b: 4.0, in: 0.2 },     // tyre spins up
    { id: "p04", a: 4.0, b: 6.0, in: 0.5 },     // highway: A drives, B flies the drone (boom mic)
    { id: "p05", a: 6.0, b: 7.0, in: 0.8 },     // the car rushes at us
    { id: "p06", a: 7.0, b: 8.0, in: 0.8 },     // top-down
    { id: "p07", a: 8.0, b: 9.5, in: 0.5, ramp: [1.3, 0.35, 1.8] }, // under the truck: slow, then snap
    { id: "p08", a: 9.5, b: 10.5, in: 1.0 },    // drone lands in B's palm, fist bump
    { id: "p09", a: 10.5, b: 11.5, in: 0.0 },   // through the hospital doors
    { id: "p10", a: 11.5, b: 13.5, in: 0.3 },   // OR: A gimbal, B clapper
    { id: "p11", a: 13.5, b: 15.0, in: 0.2 },   // the doctor: "only ten seconds?"
    { id: "p12", a: 15.0, b: 16.0, in: 1.0 },   // nurses side-eye
    { id: "p13", a: 16.0, b: 16.5, in: 1.2 },   // smug moustache
    { id: "p14", a: 16.5, b: 19.0, in: 0.15 },  // the edit — B slams Enter
    { id: "p15", a: 19.0, b: 20.0, in: 0.8 },   // the Reel on the doctor's phone
    { id: "p16", a: 20.0, b: 21.5, in: 0.4 },   // his jaw drops
    { id: "p17", a: 21.5, b: 22.5, in: 0.8 },   // nurses, like dominoes
    { id: "p18", a: 22.5, b: 23.5, in: 0.6 },   // dentures + moustache on the floor, ECG heart
    { id: "p19", a: 23.5, b: 25.5, in: 0.4 },   // everyone frozen; the two walk out
  ],
  WORDS: [
    { a: 0.3, b: 1.9, text: "Bir çekim günü." },
    { a: 4.2, b: 5.9, text: "Otoyolda," },
    { a: 11.7, b: 13.35, text: "klinikte," },
    { a: 13.7, b: 14.95, text: "“Sadece on saniye mi?”", quote: true },
    { a: 16.7, b: 18.35, text: "kurguda." },
  ],
  CUE: {
    brow: 1.0, glint: 2.55, rev: 3.0, drop: 4.0,
    slow: 8.0, snap: 9.3, land: 9.85, bump: 10.1, crash: 10.6, clap: 12.5,
    wag: [13.9, 14.3, 14.7], glance: 15.25, roll: 16.5, enter: 18.7,
    jaw: 20.4, stache: 20.55, jaws: [21.65, 21.9, 22.15], bounce: [22.55, 22.95, 23.25],
    heart: 22.8, back: 23.5, shades2: 24.6, stop: 25.5, logo: 26.0, line: 26.9, pill: 27.4,
  },
};
