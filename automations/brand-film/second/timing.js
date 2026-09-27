/*
 * "Bir Saniye" — the shared clock. Picture (second.js) and sound (second-audio.js)
 * both read this, so every caption, cue and cut sits on the voice.
 *   at     film time the speech starts (s)
 *   lead   silence at the head of the mp3, skipped on playback
 *   speech length of the spoken part
 *   parts  [offset from `at`, caption]
 * Voice: ElevenLabs · Özgür Esat Şentürk (ENCGnYnwJuI9qJKMYfei) · eleven_multilingual_v2
 */
window.SECOND = {
  DUR: 38,
  LINES: [
    { id: "v01", at: 1.2, lead: 0, speech: 1.97, parts: [[0, "Bu videoyu muhtemelen kaydıracaksın."]] },
    { id: "v02", at: 3.9, lead: 0.2, speech: 1.75, parts: [[0, "Genelde bir, iki saniye sürer…"]] },
    { id: "v03", at: 6.6, lead: 0, speech: 1.38, parts: [[0, "Ama hâlâ buradasın."]] },
    { id: "v04", at: 9.0, lead: 0, speech: 1.38, parts: [[0, "O zaman sana bir sır vereyim."]] },
    { id: "v05", at: 11.0, lead: 0, speech: 2.25, parts: [[0, "Bir saniye…"], [1.29, "yirmi dört karedir."]] },
    { id: "v06", at: 13.9, lead: 0, speech: 2.37, parts: [[0, "Ve her karenin arkasında birinin gecesi var."]] },
    { id: "v07", at: 17.0, lead: 0, speech: 6.41, parts: [[0, "Sabaha kadar yazılmış bir fikir."], [2.44, "Beklenen bir gün doğumu."], [3.98, "Yedinci deneme."], [5.39, "On birinci kurgu."]] },
    { id: "v08", at: 24.4, lead: 0, speech: 2.25, parts: [[0, "Sen bunu bir saniyede geçersin."], [1.82, "Olsun."]] },
    { id: "v09", at: 27.3, lead: 0, speech: 1.97, parts: [[0, "Biz o bir saniye için çalışıyoruz."]] },
    { id: "v10", at: 30.2, lead: 0, speech: 3.27, parts: [[0, "Bu saniyeyi bize ayırdığın için…"], [2.57, "teşekkürler."]] },
    { id: "v11", at: 34.6, lead: 0, speech: 0.82, parts: [[0, "Rast Creative."]] },
  ],
  // picture cues the sound follows
  CUE: {
    lampOn: 0.3, handIn: 1.5, hesitate: 4.3, freeze: 6.6, handOut: 9.2,
    rulerDraw: 11.0, ticks: 12.29, strip: [13.7, 17.0],
    frames: [17.0, 19.44, 20.98, 22.39], clap: 21.3, frameEnd: 24.2,
    swipe: 25.2, backIn: 26.2, oneFrame: 27.3,
    tapIn: 30.0, taps: [31.3, 31.55], heart: 31.6, thanks: 32.77,
    lampOff: 34.0, logo: 35.0,
  },
};
