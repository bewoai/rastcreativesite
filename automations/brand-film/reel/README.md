# Sinematik Reels — "İyi iş kendini izletir."

Instagram Reels için 9:16, 40 saniyelik, Türkçe seslendirmeli sinematik film.
Yalnızca stüdyonun gerçek işleri kullanıldı. Çıktı: `../out/rast-creative-reels.mp4`
(6 Mbps) · master: `node render.mjs --page reel/reel.html --name reel --master` (20 Mbps, git'e girmez).

## Hikâye

| Zaman | Görüntü | Seslendirme |
|---|---|---|
| 0–4 | Duru Optik: dünyanın üzerinde gün doğumu → bulutlar | "Her hikâye… bir ışıkla başlar." |
| 4–8 | Bulutlardan şehre iniş → Altoteks fabrikası (drone) | "Biz o ışığı bulmak için sahaya iniyoruz." |
| 8–10 | Canex üretim hattı · Altoteks tezgâhı | "Bir fabrikanın ritmi…" |
| 10–12 | Candlelit Ballet (Sapanca) | "bir sahnenin ışığı…" |
| 12–14 | Aytaş Home | "bir mağazanın sıcaklığı…" |
| 14–16 | Adatıp × Sakaryaspor, gün batımında şut (50p slow-motion) | "bir sahanın nabzı." |
| 16–18 | Set fotoğrafı: kameranın ekranına dalış → ekrandaki sokak Newlife'ın gerçek sokak planına dönüşür | "Kadrajı kuruyor, ışığı bekliyor…" |
| 19–22 | Işık kurulumu (set) · Aytaş kumaş açılışı | "ve hikâyeyi kurguda tamamlıyoruz." |
| 22–30 | 18 planlık vuruşlu montaj (drop) | — |
| 30–34 | Letterbox, müzik kesilir: bale, sonra dünyaya geri dönüş | "Çünkü iyi bir iş… anlatılmaz." |
| 34–40 | Işık patlaması → "İyi iş / kendini izletir." → logo, güneş noktası iner | "Kendini izletir." · "Rast Creative Studio." |

Geçişler (shots.json `tr`): vuruşta temiz kesme, 16 kopyalı gerçek radyal hareket bulanıklığıyla zoom-through,
sakin anlarda çözülme, kamera monitörüne dalış, siyaha iniş. SFX müziğin altında (-8 dB).
Müzik 120 BPM re minör (Dm · B♭ · F · C); tek majör akor "kendini izletir."de çalar.
Seslendirme konuşurken müzik otomatik alçalır; altyazılar kelime kelime gelir.

## Kaynaklar

- Sitedeki klipler: `public/videos/projeler/*.mp4`
- Stüdyonun Drive arşivi (bağlantıyla paylaşılan klasör): Candlelit Ballet, Altoteks, Canex,
  Adatıp × Sakaryaspor — `shots.json → sources` içindeki Drive ID'leriyle `prepare-reel.mjs` indirir.
- Set fotoğrafları: `src/assets/photos/bts/`
- Seslendirme: ElevenLabs · **Onur Büyü** (imaj reklam anlatıcısı) · `eleven_multilingual_v2` → `vo/*.mp3` (repoda, yeniden üretmeye gerek yok)

## Yeniden üretmek

```bash
cd automations/brand-film
node reel/prepare-reel.mjs                              # planları kare dizisine çevirir, seslendirme zamanlarını ölçer
node render.mjs --page reel/reel.html --name reel       # → out/rast-creative-reels.mp4
node render.mjs --page reel/reel.html --name reel --master   # 20 Mbps master
# metni değiştirdiyseniz: vo.json → ELEVENLABS_API_KEY=… node reel/voice.mjs
```
