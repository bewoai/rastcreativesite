/*
 * "Tek Çizgi" — the shared clock (picture: cizgi.js · sound: cizgi-audio.js).
 * A seamless 20 s loop: one ember dot draws one unbroken line — a lens, a clapper, a film
 * strip, a sunrise — and becomes the logo's dot; the dot then glides home and it begins again.
 * t = 0 and t = DUR are the same frame (dot at centre, radius 9, same glow phase).
 */
window.CIZGI = {
  W: 1080, H: 1920, FPS: 30, DUR: 20,
  T: {
    s1: [0.5, 3.0], s1hold: [3.0, 3.8], s1fade: [3.9, 4.5],
    s2: [4.1, 5.6], clap: 5.9, s2fade: [6.7, 7.3],
    s3: [6.7, 8.6], play: [8.6, 9.7], s3fade: [9.9, 10.5],
    s4: [10.1, 11.7], collapse: [12.2, 12.9], s4fade: [12.2, 12.8],
    logo: [12.8, 13.9], t1: [13.8, 15.0], t2: [14.8, 15.6], swash: [15.4, 16.2], url: [16.2, 16.8],
    exit: [18.4, 19.7],
  },
  TEXT: { l1: "Hikâyenizi birlikte", l2: "çizelim.", url: "rastcreative.com" },
};
