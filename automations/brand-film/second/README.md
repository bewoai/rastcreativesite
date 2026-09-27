# "Bir Saniye" — gece 01:47, bir Reels konuşuyor

Instagram için 9:16, 38 saniye, 60 fps. Seslendirme: ElevenLabs · **Can** (`SacdY6cqu2yrF7ExGIOe`).
Çıktı: `../out/rast-creative-bir-saniye.mp4`.

## Fikir

Gece 01:47. Karanlık, flu bir yatak odası; odadaki tek ışık elde tutulan telefon. Başparmak akışı
kaydırıyor, bizim Reels'e geliyor ve Reels konuşmaya başlıyor. Seslendirmenin her kelimesi Reels'in
içinde beyaz yazı olarak beliriyor (ayrı altyazı yok).

| Saniye | Görüntü | Ses |
|---|---|---|
| 0–1 | Ekran uyanır, iki hızlı kaydırma, bizim Reels | telefonun küçük sesleri |
| 1–10 | Başparmak bekler, tereddüt eder, durur · sayaç | "Bu videoyu muhtemelen kaydıracaksın… Ama hâlâ buradasın. O zaman sana bir sır vereyim." |
| 10–13 | Çizgi = 1 saniye → 24 çentik | "Bir saniye… yirmi dört karedir." |
| 13–17 | Reels'te bir film şeridi akar | "Ve her karenin arkasında birinin gecesi var." |
| 17–24 | Dört kare: 03:14 fikir · 06:12 gün doğumu · çekim 7 · kurgu v11 | "Sabaha kadar yazılmış bir fikir…" |
| 24–27 | Başparmak kaydırır, sonraki gönderi… geri getirir | "Sen bunu bir saniyede geçersin. Olsun." |
| 27–33 | "1 / 24" · çift dokunuş, kalp, beğeni kırmızı | "Biz o bir saniye için çalışıyoruz. Bu saniyeyi bize ayırdığın için… teşekkürler." |
| 33–38 | Ekran kararır, profil fotoğrafındaki güneş logonun noktasına iner | "Rast Creative." · rastcreative.com |

Ses: oda tonu, uzaktan geçen arabalar, kaydırma/dokunma/titreşim sesleri; la minör keçe piyano,
tek çözülme "teşekkürler"de do majöre. Müzik seslendirme altında otomatik kısılır.
Zoom yok; her şey merkez eksende ve güvenli alanda.

## Dosyalar

- `timing.js`: seslendirme zamanları ve sahne ipuçları (görüntü ve ses aynı saati okur)
- `second.js` görüntü · `second-audio.js` ses · `vo/*.mp3` seslendirme · `samples/` ses denemeleri

```bash
cd automations/brand-film
node render.mjs --page second/second.html --name second --out rast-creative-bir-saniye
```
