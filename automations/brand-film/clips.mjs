/**
 * Real project footage used in the film (public/videos/projeler/*.mp4).
 * `from`/`dur` are seconds in the source clip, `w` the export width.
 * Shared by prepare.mjs (export) and composition (playback via ?clips JSON).
 */
export const CLIPS = [
  // Hook: the card the feed stops on. Sunrise over the horizon → clouds,
  // which hands over straight into the fog world.
  { id: "hook", src: "duru-optik-tanitim", from: 0, dur: 2.8, w: 720 },

  // Work wall (scene V) — twelve different jobs, factory to clinic.
  { id: "w01", src: "aytas-home-sinematik-magaza", from: 4, dur: 8, w: 360 },
  { id: "w02", src: "hornhauss-tanitim", from: 0, dur: 8, w: 360 },
  { id: "w03", src: "dr-erdem-caliskan-kimdir", from: 1, dur: 8, w: 360 },
  { id: "w04", src: "aytas-home-yapay-zeka-kurgu", from: 1, dur: 8, w: 360 },
  { id: "w05", src: "duru-optik-tanitim", from: 8, dur: 8, w: 360 },
  { id: "w06", src: "newlife-davet-salonu", from: 1, dur: 8, w: 360 },
  { id: "w07", src: "aytas-home-nisan-yatak", from: 3, dur: 8, w: 360 },
  { id: "w08", src: "aytas-home-neden-aytas", from: 8, dur: 8, w: 360 },
  { id: "w09", src: "dr-erdem-caliskan-fraksiyonel-lazer", from: 1, dur: 8, w: 360 },
  { id: "w10", src: "aytas-home-kutu-trendi", from: 3, dur: 8, w: 360 },
  { id: "w11", src: "hornhauss-tanitim", from: 9, dur: 8, w: 360 },
  { id: "w12", src: "aytas-home-koltuk-trendi", from: 0, dur: 8, w: 360 },
];
