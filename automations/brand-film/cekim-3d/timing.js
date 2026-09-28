/*
 * "Çekim Günü 3D" — the shared clock (picture: cekim3d.js · sound: cekim3d-audio.js).
 * 120 BPM; every cut sits on a beat or half-beat. Fully code-animated (Three.js), no AI video.
 *   SHOTS  id · film [a, b) — the picture engine owns what each shot shows
 *   WORDS  white captions, centred, inside the Instagram safe zone
 */
window.CEKIM3D = {
  DUR: 30, FPS: 30, BPM: 120,
  SHOTS: [
    { id: "studio", a: 0.0, b: 2.0 },      // B arms crossed, A fixes his cap · eyebrow
    { id: "shades", a: 2.0, b: 3.0 },      // A slides the sunglasses on · glint
    { id: "wheel", a: 3.0, b: 4.0 },       // a tyre spins up, smoke
    { id: "roadSide", a: 4.0, b: 6.0 },    // highway, tracking: A out of the window, drone with a boom mic
    { id: "roadFront", a: 6.0, b: 7.0 },   // the car rushes at us
    { id: "roadTop", a: 7.0, b: 8.0 },     // top-down graphic: car + drone + dashes
    { id: "truck", a: 8.0, b: 9.5 },       // slow-mo under the truck, then snap
    { id: "catch", a: 9.5, b: 10.5 },      // drone lands in the palm · fist bump
    { id: "doors", a: 10.5, b: 11.5 },     // the car bursts through the hospital doors
    { id: "or", a: 11.5, b: 13.5 },        // parked in the operating room · gimbal · clapper
    { id: "doc", a: 13.5, b: 15.0 },       // the doctor wags a finger
    { id: "nurses", a: 15.0, b: 16.0 },    // two nurses exchange a look
    { id: "docCU", a: 16.0, b: 16.5 },     // smug mustache
    { id: "edit", a: 16.5, b: 18.5 },      // the edit: timeline flying
    { id: "enter", a: 18.5, b: 19.0 },     // ENTER
    { id: "phone", a: 19.0, b: 20.0 },     // the Reel on the doctor's phone
    { id: "jaw", a: 20.0, b: 21.5 },       // the jaw drops. to the floor.
    { id: "domino", a: 21.5, b: 22.5 },    // the nurses, one by one
    { id: "floor", a: 22.5, b: 23.5 },     // the jaw bouncing on the tiles · ECG draws a heart
    { id: "exit", a: 23.5, b: 26.0 },      // everyone frozen; the two walk out, B puts on shades too
  ],
  WORDS: [
    { a: 0.3, b: 1.9, text: "Bir çekim günü." },
    { a: 4.2, b: 5.9, text: "Otoyolda," },
    { a: 11.7, b: 13.35, text: "klinikte," },
    { a: 13.7, b: 15.9, text: "“Sadece on saniye mi?”", quote: true },
    { a: 16.7, b: 18.35, text: "kurguda." },
  ],
  CUE: {
    brow: 1.0, glint: 2.55, rev: 3.0, drop: 4.0,
    slow: 8.0, snap: 9.3, land: 9.85, bump: 10.1, crash: 11.0, clap: 12.5,
    wag: [13.9, 14.3, 14.7], glance: 15.25, roll: 16.5, enter: 18.7,
    jaw: 20.4, stache: 20.55, jaws: [21.65, 21.9, 22.15], bounce: [22.55, 22.95, 23.25],
    heart: 22.8, back: 23.5, shades2: 24.6, stop: 25.5, logo: 26.0, line: 26.9, pill: 27.4,
  },
};
