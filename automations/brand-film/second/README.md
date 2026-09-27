# "Bir Saniye" — projeksiyon ışığında bir teşekkür

Instagram için 9:16, 38 saniye, 60 fps. Seslendirmeli (ElevenLabs · Özgür Esat Şentürk), beyaz altyazılı.
Çıktı: `../out/rast-creative-bir-saniye.mp4`.

## Fikir

Video, izleyicinin onu kaydırmak üzere olduğunu biliyor ve onunla konuşuyor. Karanlık bir salon,
tek bir projektör (lambası Rast'ın güneşi) ve bir perde. Her şey perdeye yansıyor:

| Saniye | Görüntü | Ses |
|---|---|---|
| 0–9 | Perdede bekleyen bir el gölgesi, köşede işleyen sayaç | "Bu videoyu muhtemelen kaydıracaksın… Ama hâlâ buradasın." |
| 9–14 | Tek çizgi = 1 saniye → 24 çentik | "O zaman sana bir sır vereyim. Bir saniye… yirmi dört karedir." |
| 14–17 | Işığın önünden gerçek bir film şeridi geçer | "Ve her karenin arkasında birinin gecesi var." |
| 17–24 | Dört kare, dört gece: 03:14 fikir · 06:12 gün doğumu · çekim 7 · kurgu v11 | "Sabaha kadar yazılmış bir fikir…" |
| 24–30 | El kaydırır… geri gelir · tek bir kare "1/24" | "Sen bunu bir saniyede geçersin. Olsun. Biz o bir saniye için çalışıyoruz." |
| 30–34 | Parmak iki kez dokunur, perdede kalp | "Bu saniyeyi bize ayırdığın için… teşekkürler." |
| 34–38 | Lamba sönerken logonun noktasına iner | "Rast Creative." · rastcreative.com |

Çizgiler saniyede 12 kez "kaynar" (el çizimi hissi), perde 24 fps titrer, toz ve çizik film dokusu.
Müzik: projektör motoru + saniyede 24 tık, la minör keçe piyano; tek çözülme "teşekkürler"de do majöre.

## Dosyalar

- `timing.js`: seslendirme zamanları ve sahne ipuçları (görüntü ve ses aynı saati okur)
- `second.js` görüntü · `second-audio.js` ses · `vo/*.mp3` seslendirme (repoda)

```bash
cd automations/brand-film
node render.mjs --page second/second.html --name second --out rast-creative-bir-saniye
```
