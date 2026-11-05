# Araştırma / veri sayfaları (/arastirma/)

Amaç: istatistik backlink'i. Blog yazarları, gazeteciler ve ajansların alıntılayıp bağlantı verdiği veri sayfaları.

## Sayfalar
- `/arastirma/` — `src/pages/arastirma/index.astro`. Kartlar `PAGES` dizisinden gelir; bir kart yalnızca sayfa dosyası varsa görünür (`import.meta.glob`), paralel eklenen sayfalar kendiliğinden listelenir.
- `/arastirma/meta-reklam-maliyetleri-2026/` — sayfa `src/pages/arastirma/meta-reklam-maliyetleri-2026.astro`, tüm rakamlar `src/data/arastirma/meta-reklam-maliyetleri-2026.ts`. CSV uç noktası `src/pages/arastirma/meta-reklam-maliyetleri-2026/rast-meta-reklam-maliyetleri-2026.csv.ts` (aynı veriden üretilir), `public/arastirma/meta-reklam-maliyetleri-2026/.htaccess` CSV MIME türünü verir, OG görseli `og.jpg` aynı klasörde.

## Kurallar
- Her üçüncü taraf rakamı: kaynak adı, başlık, tarih/dönem ve URL ile `Stat` olarak veri dosyasına girer; tablo, sayaç ("N kaynaklı istatistik") ve CSV buradan üretilir. Doğrulanamayan rakam girmez.
- Rast'ın kendi verisi: yalnızca hesaplar arası aralık/medyan/havuz; müşteri adı yok, tek hesabın toplamı yok, tek hesapta kalan hedef tabloya girmez, sağlık müşterisi verisi kullanılmaz. Etiket: "Rast Creative'in yönettiği hesaplar, <ay>, n=<hesap>/<kampanya>".
- Güncellerken `UPDATED`/`UPDATED_TR` değişir; JSON-LD dateModified ve "Son güncelleme" buradan okunur.
- JSON-LD: BreadcrumbList + Article + Dataset (CSV distribution) + FAQPage (SSS metni görünür).
