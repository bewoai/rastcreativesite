# "Karanlık Oda" — karanlık motion-graphic kreatif

Instagram için 9:16, 29 saniye, 60 fps motion-graphic. Seslendirme yok, müzik + ince SFX.
Çıktı: `../out/rast-creative-karanlik-oda.mp4` (6 Mbps).

## Fikir

Karanlık bir oda, tek bir ışık: logodaki **ra.st noktası**. Bu güneş her sahneye taşınır
(merkez → diyaframın arkası → logo → yörünge → kapanış logosu), bu yüzden kesmeler zoom'suz
ama kopuksuz akar. Tek vurgu rengi amber (#ff8a3d), zemin neredeyse siyah.

Kompozisyon kuralları: kamera kadrajı / sahne etiketi / HUD yok; her şey merkez eksende,
logo tam merkezde (540, 960); içerik Instagram güvenli alanında (y 280–1480).
Kesmelerde merkezden yayılan ince bir ışık halkası (şok dalgası) var.

| Vuruş (128 BPM) | Saniye | Sahne |
|---|---|---|
| b0–8 | 0–3.75 | "HER HİKÂYE / KARANLIKTA … BAŞLAR." · merkezde güneş yanar, halkalar çizilir, uydular döner |
| b8–16 | 3.75–7.5 | "IŞIĞI TOPLUYORUZ." · 8 bıçaklı diyafram her vuruşta bir durak kapanır (f/1.4 → f/16), dönen dairesel yazı; b15.5'te tamamen kapanır |
| b16–24 | 7.5–11.25 | Drop: ışık patlaması, logo kendi noktasından aydınlanır · CREATIVE STUDIO |
| b24–32 | 11.25–15 | "FİKİRDEN EKRANA." · güneş bir yörüngede 5 düğümü dolaşır, merkezde adımın adı değişir |
| b32–40 | 15–18.75 | "SAHNE BİZDE." · gerçek işler 3B halkada, her vuruşta bir kart öne gelir |
| b40–48 | 18.75–22.5 | Hizmet duvarı, her vuruşta bir satır yanar |
| b48–52 | 22.5–24.4 | 4 vuruş: FİKİR. IŞIK. EMEK. RAST. — harflerin içi gerçek çekimlerle dolu |
| b52– | 24.4–29 | "Işığı biz kurarız." · logo tam merkezde · rastcreative.com · ücretsiz ön görüşme |

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
