/*
 * "Planda Olmayan Kare" — the shared clock (picture: ink.js · sound: ink-audio.js).
 * Hand-inked cats on linen, one red accent. Everything is code: brush strokes with
 * taper + a 12 fps line boil, drawn on stroke by stroke (each stroke also registers
 * a pen-scratch event the audio follows).
 */
window.INK = {
  W: 1080, H: 1920, FPS: 30, DUR: 26, GY: 1020,
  ink: "#17130f", red: "#ff4a2a",
  events: [],          // {t, dur, pan} pen scratches, filled by ink.js at init
  derived: {},         // physics results the audio follows (bounces, landing, roll ticks)
  CUE: {
    cam0: 0.6, rec: 3.0, cat1: 3.6, cat2: 5.0, meow1: 7.3, meow2: 7.75,
    bfly0: 8.0, flyA: 8.6, flyB: 10.9, crouch: 9.8, launch: 10.75, hit: 11.2,
    land: 11.85, settle: 12.15, look1: 12.4, dot0: 11.2, dotStop: 13.9,
    erase0: 17.8, erase1: 18.6, logo0: 18.6, logo1: 19.9, end0: 25.0,
  },
  CAPS: [
    { t: "Bugün çekim günü.", a: 1.2, out: 3.4, y: 1290, size: 108 },
    { t: "Oyuncular hazır.", a: 5.6, out: 8.0, y: 1290, size: 108 },
    { t: "Sahne: kelebek.", a: 8.4, out: 11.0, y: 1290, size: 108 },
    { t: "En güzel kare,", a: 14.2, out: 17.8, y: 1245, size: 112 },
    { t: "planda olmayandı.", a: 15.5, out: 17.8, y: 1355, size: 112 },
    { t: "Planda olmayan kareyi", a: 20.1, out: 99, y: 1290, size: 86 },
    { t: "de yakalarız.", a: 21.2, out: 99, y: 1380, size: 86 },
  ],
};
