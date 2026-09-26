# "Karanlık Oda" — karanlık motion-graphic kreatif

Instagram için 9:16, 29 saniye, 60 fps motion-graphic. Seslendirme yok, müzik + ince SFX.
Çıktı: `../out/rast-creative-karanlik-oda.mp4` (6 Mbps).

## Fikir

Karanlık bir oda, tek bir ışık: logodaki **ra.st noktası**. Bu güneş her sahneye taşınır
(açılış → render çubuğunun ucu → logo → süreç hattının ucu → kapanış logosu), bu yüzden
kesmeler zoom'suz ama kopuksuz akar. Tek vurgu rengi amber (#ff8a3d), zemin neredeyse siyah.

| Vuruş (128 BPM) | Saniye | Sahne |
|---|---|---|
| b0–8 | 0–3.75 | "HER HİKÂYE / KARANLIKTA / BAŞLAR." · güneş yanar, kalp atışı |
| b8–16 | 3.75–7.5 | Terminal: brief → senaryo → ekip → ışık → REC → kurgu, render çubuğu · "IŞIK HAZIR." |
| b16–24 | 7.5–11.25 | Drop: ışık patlaması, logo kendi noktasından aydınlanır · CREATIVE STUDIO |
| b24–32 | 11.25–15 | "FİKİRDEN EKRANA." · 5 düğümlük süreç hattı, her vuruşta bir düğüm yanar |
| b32–40 | 15–18.75 | "SAHNE BİZDE." · gerçek işler 3B halkada, her vuruşta bir kart öne gelir |
| b40–48 | 18.75–22.5 | Hizmet duvarı, her vuruşta bir satır yanar |
| b48–52 | 22.5–24.4 | 4 vuruş: FİKİR. IŞIK. EMEK. RAST. — harflerin içi gerçek çekimlerle dolu |
| b52– | 24.4–29 | Logo · "Işığı biz kurarız." · rastcreative.com · ücretsiz ön görüşme |

Müzik: karanlık techno, 128 BPM, fa minör (kick, rumble, acid, stab, braam); SFX ayrı bus'ta −9 dB.

## Kaynaklar

- Klipler: `clips.json` (sitedeki `public/videos/projeler/*.mp4` + Drive arşivi, ID'ler `../reel/shots.json → sources`)
- Logo: `public/hero/rast-sun-logo.svg`

## Yeniden üretmek

```bash
cd automations/brand-film
node dark/prepare-dark.mjs                                                   # klipleri kare dizisine çevirir
node render.mjs --page dark/dark.html --name dark --out rast-creative-karanlik-oda            # → out/…mp4
node render.mjs --page dark/dark.html --name dark --out rast-creative-karanlik-oda --master   # 20 Mbps
# önizleme: sunucu açıkken dark/dark.html?preview
```
