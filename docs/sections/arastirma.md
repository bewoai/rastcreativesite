# Araştırma / veri sayfaları (/arastirma/)

Amaç: istatistik backlink'i. Blog yazarları, gazeteciler ve ajansların alıntılayıp bağlantı verdiği veri sayfaları.

## Sayfalar
- `/arastirma/` — `src/pages/arastirma/index.astro`. Kartlar `PAGES` dizisinden gelir; bir kart yalnızca sayfa dosyası varsa görünür (`import.meta.glob`), paralel eklenen sayfalar kendiliğinden listelenir.
- `/arastirma/meta-reklam-maliyetleri/` — sayfa `src/pages/arastirma/meta-reklam-maliyetleri.astro`, tüm rakamlar `src/data/arastirma/meta-reklam-maliyetleri.ts`. CSV uç noktası `src/pages/arastirma/meta-reklam-maliyetleri/rast-meta-reklam-maliyetleri.csv.ts` (aynı veriden üretilir), `public/arastirma/meta-reklam-maliyetleri/.htaccess` CSV MIME türünü verir, OG görseli `og.jpg` aynı klasörde.
- `/arastirma/reels-istatistikleri/` — aynı düzen (`reels-istatistikleri.astro`, `src/data/arastirma/reels-istatistikleri.ts`, CSV `rast-reels-istatistikleri.csv`).

## URL kuralı (10.11.2026)
- URL'de yıl YOK; yıl yalnız title/H1/eyebrow'da. Yıl değişince başlık güncellenir, adres aynı kalır. Eski `-2026` adresleri (sayfa, CSV, og.jpg) `public/.htaccess`'te 301 ile yeni adrese gider. Geri dönüş etiketi: `arastirma-yedek-2026-11-10`.

## Adlandırılmış endeks
- Her sayfanın üstünde `INDEX_NAME` + `INDEX_FINDINGS` (veri dosyasında): Rast'ın kendi rakamları, ad + örnek sayısı + dönem içeren tek satırlık cümleler ("2026 Rast Meta Reklam Maliyet Endeksi, … buldu"). Yeni rakam yok; `OWN*` nesnelerindeki değerlerden türetilir, onlar değişince cümleler de güncellenir. CSV'de `endeks` satırları olarak da çıkar.
- İç bağlantılar (araştırma kanıtı): blog `etkili-meta-google-ads-reklami`, `sosyal-medya-videosu-neden-dikey`, `sosyal-medya-videosu-neden-izlenmiyor…`, `sakarya-isletmem-icin-reels-mi-tanitim-filmi-mi`, `sakarya-daki-i-sletmeler…`; `service-hub.ts` (reklam-filmi, sosyal-medya-icerigi) ve `location-content.ts` (sosyal-medya-icerigi/sakarya, reklam-filmi/sakarya). Yeni bir istatistik bloga girerse sayfaya da ekleyip bağlantı ver.

## Kurallar
- Her üçüncü taraf rakamı: kaynak adı, başlık, tarih/dönem ve URL ile `Stat` olarak veri dosyasına girer; tablo, sayaç ("N kaynaklı istatistik") ve CSV buradan üretilir. Doğrulanamayan rakam girmez.
- Rast'ın kendi verisi: yalnızca hesaplar arası aralık/medyan/havuz; müşteri adı yok, tek hesabın toplamı yok, tek hesapta kalan hedef tabloya girmez, sağlık müşterisi verisi kullanılmaz. Etiket: "Rast Creative'in yönettiği hesaplar, <ay>, n=<hesap>/<kampanya>".
- Güncellerken `UPDATED`/`UPDATED_TR` değişir; JSON-LD dateModified ve "Son güncelleme" buradan okunur.
- JSON-LD: BreadcrumbList + Article + Dataset (CSV distribution) + FAQPage (SSS metni görünür).
