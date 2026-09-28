# Çekim Günü — 30 sn 3D animasyon (9:16)

İki karakter; stüdyo → otoyolda drone → klinik → kurgu → ağzı açık kalan hayalî bir doktor.
Slogan: **"Ağızları açık kalsın."** Çıktı: `out/rast-creative-cekim-gunu.mp4`.

## Akış
| sn | çekim | olay |
|---|---|---|
| 0–2.5 | S01 stüdyo | "Bir çekim günü." |
| 2.5–4.5 | S02 gözlük | parlama (shing), build |
| 4.5–8.5 | S03 otoyol | drop · "Otoyolda," |
| 8.5–10.5 | S04 araç içi | |
| 10.5–13 | S05 TIR arası | slow-mo (müzik su altı) → 11.8'de hız geri |
| 13–15.5 | S06 yakalama | 13.8 drone avuca iner · manga hız çizgisi |
| 15.5–17.5 | S07 klinik | 15.92 klaket · "klinikte," |
| 17.5–21.5 | S08 doktor | "“Sadece on saniye mi?”" |
| 21.5–23.5 | S09 Enter | "kurguda." · riser → Enter flaşı |
| 23.5–27.5 | S10 ağızlar açık | müzik susar, sadece monitör bip |
| 27.5–30 | logo kartı | logo tam merkez · "Ağızları açık kalsın." · rastcreative.com |

Tüm kesmeler 120 BPM vuruşta. Zoom yok, HUD/sahne etiketi yok, yazılar beyaz ve safe zone içinde.

## Dosyalar
- `refs/` karakter + Drive kareleri · `frames/` Gemini/Kling ile üretilen ilk kareler
- `kling-jobs.json` Kling video iş ID'leri (kling-video-v3_0_turbo, 1080p, 3–4 sn, sessiz)
- `timing.js` saat · `cekim.html` + `cekim.js` görüntü · `cekim-audio.js` müzik + SFX
- `clips/` Kling klipleri (filigransız) · `prepare-cekim.mjs` klipleri 1080×1920 kare dizilerine çevirir

## Üretim
```bash
node automations/brand-film/cekim-gunu/prepare-cekim.mjs
node automations/brand-film/render.mjs --page cekim-gunu/cekim.html --name cekim --out rast-creative-cekim-gunu
# sonra loudnorm I=-14:TP=-1.2
```

## Maliyet
- Kareler: ElevenLabs · Gemini 3 Pro Image, 12 görsel ≈ 29k kredi (fazlaydı — 1 varyasyon 1K yeterli).
- Kling: S10 karesi 15 + 10 klip 330 = **345 kredi**.

## Ses
Referans (Rien) analizine göre: D minör, sinematik/spor trailer; stomp-clap, taiko, yaylı ostinato,
braam darbeleri, riser + kalabalık kükremesi, Enter'da tape stop ve gerçek sessizlik. SFX yoğun:
deklanşör, gözlük parlaması, rüzgâr, motor, drone geçişleri, TIR kornası, yumruk, gimbal, klaket, klavye, şaşkınlık nidası.
