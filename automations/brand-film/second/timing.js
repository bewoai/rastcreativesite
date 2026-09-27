/*
 * "Bir Saniye" — the shared clock. Picture (second.js) and sound (second-audio.js)
 * both read this, so every word, swipe and tap sits on the voice.
 *   at     film time the speech starts (s)
 *   lead   silence at the head of the mp3, skipped on playback
 *   speech length of the spoken part
 *   parts  [offset from `at`, on-screen line]
 * Voice: ElevenLabs · Can (SacdY6cqu2yrF7ExGIOe) · eleven_multilingual_v2
 */
window.SECOND = {
  DUR: 38,
  LINES: [
    { id: "v01", at: 1.3, lead: 0.1, speech: 1.75, parts: [[0, "Bu videoyu muhtemelen kaydıracaksın."]] },
    { id: "v02", at: 3.8, lead: 0, speech: 1.8, parts: [[0, "Genelde bir, iki saniye sürer…"]] },
    { id: "v03", at: 6.4, lead: 0.17, speech: 1.03, parts: [[0, "Ama hâlâ buradasın."]] },
    { id: "v04", at: 8.6, lead: 0, speech: 1.27, parts: [[0, "O zaman sana bir sır vereyim."]] },
    { id: "v05", at: 10.6, lead: 0, speech: 2.46, parts: [[0, "Bir saniye…"], [1.59, "yirmi dört karedir."]] },
    { id: "v06", at: 13.6, lead: 0, speech: 2.18, parts: [[0, "Ve her karenin arkasında birinin gecesi var."]] },
    { id: "v07", at: 16.6, lead: 0, speech: 6.93, parts: [[0, "Sabaha kadar yazılmış bir fikir."], [2.64, "Beklenen bir gün doğumu."], [4.76, "Yedinci deneme."], [6.02, "On birinci kurgu."]] },
    { id: "v08", at: 24.3, lead: 0, speech: 2.1, parts: [[0, "Sen bunu bir saniyede geçersin."], [1.74, "Olsun."]] },
    { id: "v09", at: 27.2, lead: 0, speech: 1.89, parts: [[0, "Biz o bir saniye için çalışıyoruz."]] },
    { id: "v10", at: 30.0, lead: 0, speech: 2.5, parts: [[0, "Bu saniyeyi bize ayırdığın için…"], [1.9, "teşekkürler."]] },
    { id: "v11", at: 34.2, lead: 0.18, speech: 0.74, parts: [[0, "Rast Creative."]] },
  ],
  // picture cues the sound follows
  CUE: {
    wake: 0.2, doom: [0.4, 0.8], land: 1.1, hesitate: 4.3, freeze: 6.4, rest: 8.6,
    rulerDraw: 10.6, ticks: 12.19, strip: [13.4, 16.6],
    frames: [16.6, 19.24, 21.36, 22.62], clap: 21.9, frameEnd: 23.9,
    swipe: 24.9, backIn: 26.0, oneFrame: 27.2,
    tapIn: 29.6, taps: [30.9, 31.12], heart: 31.15, thanks: 31.9,
    screenOff: 33.7, logo: 34.8,
  },
};
