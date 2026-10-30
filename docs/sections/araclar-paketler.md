# Araçlar: ücretsiz paketler (SFX + LUT)

Bağlantı kazandırmak için ücretsiz indirilebilir paketler. Fiyat yok, kayıt yok. Genel araç notları: `docs/sections/araclar.md`.

## /araclar/sfx-paketi/ — Rast SFX Pack Vol.1 (2026-10-31)
- Sayfa: `src/pages/araclar/sfx-paketi.astro`; liste `src/data/sfx-paketi.json` (dosya, kategori, süre, kaynak, CC0 yazar/url).
- Dosyalar: `public/araclar/sfx-paketi/rast-sfx-pack-vol1.zip` (40 WAV 48 kHz/16-bit + OKU-BENI.txt + credits.json + LISANS-CC-BY-4.0.txt, ~9,5 MB) ve `onizleme/*.mp3` (128 kbps, `<audio preload="none">`).
- Kaynaklar: 32 ses Rast üretimi (Earshot sentezi + ffmpeg ile üretilen 2 drone) → CC BY 4.0; 8 ses Freesound CC0 (yazar + URL credits.json'da) → CC0 kalır. Başka kaynak (ElevenLabs, ticari kütüphane, müşteri sesi) EKLENMEZ.
- Üretim scripti sunucuda: `~/.hermes/cache/scratch/sfxpack/{plan.py,build.py,package.py,fs_cc0.py}` (geçici klasör; kalıcı kopya isteniyorsa `scripts/`e taşı). İşlem: sessizlik kırpma (-60 dB), kenar fade, kısa sesler -1,5 dBTP tepe, ≥2,5 sn sesler ≈ -16 LUFS (TP ≤ -1).

## /araclar/lut-paketi/ — Rast LUT Pack (2026-10-31)
- Sayfa: `src/pages/araclar/lut-paketi.astro` (önce/sonra kaydırıcı: iki `<img>` + `clip-path` + şeffaf range input).
- Dosyalar: `public/araclar/lut-paketi/rast-lut-pack.zip` (5 × 33³ .cube + OKU-BENI.txt + lisans, ~1,9 MB), `once-*.webp` / `sonra-*.webp` (1200×676).
- LUT'lar numpy ile hesaplandı (`~/.hermes/cache/scratch/lutpack/make_luts.py`): Rec.709 yaratıcı görünüm, log dönüşümü değil; cilt tonu maskesiyle renk kayması sınırlı (ölçüm: cilt tonu kayması < 2°). Önizleme kareleri yalnızca kendi kamera arkası fotoğraflarımız (`src/assets/photos/bts/`); müşteri görüntüsü kullanılmaz.
- Doğrulama: ffmpeg `lut3d=…:interp=tetrahedral` ile uygulanıyor; başlık `LUT_3D_SIZE 33`, değerler 0–1.

## İç linkler
- İki sayfa birbirine ve `/araclar/guvenli-alan/`a link verir; CTA'lar hizmet sayfalarına (/sosyal-medya-icerigi/, /reklam-filmi/, /video-cekimi/, /tanitim-filmi/).
- `/araclar/` dizinine, footer'a ve llms.txt'ye kart/link eklemek ayrı iş (paylaşılan dosyalar; bu commit'te dokunulmadı).
