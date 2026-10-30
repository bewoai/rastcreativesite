# /araclar/bitrate-hesaplayici/ + /rehber/video-export-ayarlari/ (2026-10-30)

- Ortak veri: `src/data/export-specs.ts` (YouTube SDR/HDR bitrate tablosu, Vimeo aralıkları, Apple ProRes hedef değerleri, Meta/Instagram/TikTok sınırları, kaynak listesi + `CHECKED` tarihi). Platform sayfası değişirse yalnızca burayı düzenle; iki sayfa da buradan beslenir.
- Hesaplayıcı: `src/pages/araclar/bitrate-hesaplayici.astro` (vanilla TS). Üç mod: bitrate→boyut, hedef boyut→bitrate (%2 pay), kart kayıt süresi. Referans seçici (YouTube/Vimeo/ProRes), FFmpeg 2 geçiş komutu, durum URL query'de (paylaşılabilir). Dosya yok, sunucuya bir şey gitmez. 1 MB = 10^6 bayt; Windows (GiB) değeri ayrıca gösterilir.
- Rehber: `src/pages/rehber/video-export-ayarlari.astro` (TechArticle + HowTo + CreativeWork + FAQPage). "Rast önerisi" bitrate'leri (1080p 16/24, 4K 45/68 Mbps) bizim tavsiyemiz, sayfada öyle etiketli; resmî değerler tabloda.
- Kopya kâğıdı: `python3 scripts/generate-export-cheatsheet.py` → `public/rehber/video-export-ayarlari/rast-video-export-ayarlari.{pdf,png}` (A4, CC BY 4.0, Rast imzası altta). export-specs.ts değişirse scriptteki ROWS'u da güncelle ve yeniden üret.
- /rehber/ index sayfası yok; breadcrumb Araçlar üzerinden gidiyor.
