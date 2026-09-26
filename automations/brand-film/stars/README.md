# "Takımyıldız" — her marka bir yıldız

Instagram için 9:16, 26 saniye, 60 fps. Seslendirme yok, müzik + ince SFX.
Çıktı: `../out/rast-creative-takimyildiz.mp4` (6 Mbps).

| Vuruş (120 BPM) | Saniye | Sahne |
|---|---|---|
| b0–6 | 0–3 | Gökyüzü, merkezde güneş: "HER MARKANIN BİR IŞIĞI VAR." |
| b6–24 | 3–12 | Güneş Serdivan'daki stüdyoya iner, Sakarya haritası oradan ışıkla çizilir (ilçeler, Sapanca Gölü, komşu iller). 6 marka iki vuruşta bir yıldız olur; her yıldız haritanın üstünde gerçek görüntülü bir mercek açar. |
| b24–36 | 12–18 | Kesme: Türkiye haritası. "SAKARYA'DAN TÜRKİYE'YE." Işık yayı Tekirdağ'a (Altoteks) ve Adıyaman'a (Canex) uçar. |
| b36–40 | 18–20 | "HER MARKA BİR YILDIZ." · 8 marka · 3 şehir · 1 gökyüzü |
| b40–44 | 20–22 | Gökyüzündeki bütün yıldızlar uçup Rast logosunu oluşturur (logo tam merkezde). |
| b44–52 | 22–26 | "Sıradaki yıldız sizin markanız." · rastcreative.com · ücretsiz ön görüşme |

Markalar ve konumlar: `brands.json` (konum stüdyodan teyitli; il düzeyinde "SAKARYA" yazanlar
şehir merkezinde temsili noktada). Müzik: 120 BPM re minör; her yıldız bir nota, logo tek majör akorda.

## Kaynaklar

- Harita: geoBoundaries TUR ADM1/ADM2 (CC BY 4.0) → `data/geo.json`. Sapanca Gölü elle çizilmiş yaklaşık hat.
- Görüntü: sitedeki `public/videos/projeler/*.mp4` + Drive arşivi (`../reel/shots.json → sources`).

## Yeniden üretmek

```bash
cd automations/brand-film
python3 stars/prepare-stars.py                      # harita + 400×400 mercek klipleri
node render.mjs --page stars/stars.html --name stars --out rast-creative-takimyildiz
```
