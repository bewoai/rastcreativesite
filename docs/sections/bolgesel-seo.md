# Bölüm: Bölgesel Hizmetler + SEO Metni (Sahne 03.5)

## Amaç (iş açısından)

Yerel arama niyetini hizmet × konum sayfalarıyla karşılamak; ziyaretçiyi ilgili iş kanıtı ve net CTA üzerinden ücretsiz ön görüşmeye taşımak.

## Konum ve dosyalar

- Ana sayfa hizmet/konum matrisi: `src/components/AreaIndex.astro`
- Hizmet hub’ı: `src/pages/[hizmet]/index.astro`
- Hizmet × konum sayfası: `src/pages/[hizmet]/[konum].astro`
- Hizmet verisi: `src/data/seo-services.ts`
- Konum ve tier verisi: `src/data/locations.ts`
- Sitemap filtreleri ve trailing-slash politikası: `astro.config.mjs`

## İçerik ve veri

- 6 hizmet × 22 konum = 132 statik rota.
- Her hizmet için bir hub sayfası ve konumlar arası ilgili bağlantılar bulunur.
- Kartlar yalnız gerçek dahili proje sayfasına veya içerikte tanımlı harici proje URL’sine gider.

## URL standardı

- Hizmet hub’ı: `/<hizmet>/`
- Hizmet × konum: `/<hizmet>/<konum>/`
- Dahili proje fallback’i: `/projeler/<proje-id>/`
- Breadcrumb ve JSON-LD öğeleri aynı canonical yolları kullanır.
- Ana sayfa matrisi ve ilgili bağlantılar canonical hedefe doğrudan gider; slash eklemek için ara 301 üretmez.
- Harici proje URL’leri değiştirilmez.

## Indexleme politikası

- Tüm 6 hizmet × 22 konum sayfası indexlenebilir ve sitemap’te yer alır.
- Her rota hizmete özgü giriş, fayda ve SSS içeriğini konuma özgü açıklamayla birleştirir.
- Portföy seçkisi gerçek işlere dayanır; konuma özel proje verisi yoksa o bölgede çekim yapıldığı iddia edilmez.
- Gizli proje sayfaları bu politikadan ayrıdır; `noindex` kalır ve sitemap’e girmez.

## Para sayfaları (güncelleme 20 Ekim 2026)

GSC'de en çok gösterim alan dört sayfa elle yazılmış uzun bloklarla güçlendirildi
(`src/data/location-content.ts`): `/video-cekimi/sakarya/`, `/video-cekimi/kocaeli/`,
`/sosyal-medya-icerigi/sakarya/`, `/drone-cekimi/sakarya/`.

- Her blok: ≤155 karakter description, soru biçiminde H2, 4 paragraf, 4–5 ek SSS
  (şablon SSS'leriyle çakışmaz, FAQPage şemasına girer) ve `projects` listesi.
- `projects`: metinde anılan gerçek işler ızgaranın başına sabitlenir; boş kalan
  yer eskisi gibi hizmet kategorilerinden dolar.
- Kurallar: rakam yalnızca Aytaş Home vaka sayfasındakiler (18,6 bin → 76,5 bin,
  +%311; 257 → 730). 2024 tarihli işler "kurucu ortakların stüdyo öncesi işleri"
  diye anılır, Rast adına "çektik" denmez. Aytaş'a şehir yazılmaz (birden fazla
  mağaza). Projelere kayıtta olmayan şehir eklenmez.
- Kocaeli SSS'si "yol/konaklama ücreti yok" diyor: dayanak fiyat politikası (yol
  farkı yalnızca Bolu/Bilecik). Politika değişirse bu SSS de değişmeli.
- Izgara başlığı "Tamamladığımız son … projeleri" → "Portföyden … örnekleri";
  alt metin 2024–2025 işlerinin stüdyo öncesi olduğunu söylüyor.
- Eşlik eden rehber: `/blog/sakarya-video-produksiyon-firmasi-nasil-secilir/`
  (dört sayfaya ve fiyat yazılarına iç link verir).
- `links`: paragraflar düz metin basıldığı için iç linkler bloğun altında
  "İlgili yazılar" listesi olarak çıkar (blog yazıları, Aytaş vaka sayfası).
- Tüm bölge sayfalarında telefonun yanında "Google'daki yorumlarımız ↗"
  (`CONTACT.googleShare`). SERP karşılaştırması (20 Eki): "sakarya sosyal medya"
  ilk sayfasındaki ajansların 2'si sayfada 45 ve 85 Google yorumu gösteriyor.
- WhatsApp hazır mesajı hizmete göre değişiyor (`WHATSAPP_OPENERS`, `src/consts.ts`):
  sosyal medya sayfasından yazan "video çekimi teklifi" değil "sosyal medya
  yönetimi" diye açılır.


## Tasarım ve motion

Kâğıt zemin ve bölgesel keşif akışı korunur. Bu URL standardizasyonu görsel, layout veya motion davranışını değiştirmemelidir.

## Bilinen sorunlar / kapsam dışı

- [ ] Secondary konumlar için özgün yerel içerik derinliği
- [ ] Arka arkaya gelen sıkı içerik bloklarındaki tekrar hissini azaltma
- [ ] Genel içerik ve dönüşüm metni optimizasyonu

## “Bitti” kontrolleri

- [x] Tüm 132 rota build oluyor (209 toplam sayfa, hata yok) — 2026-09-10
- [x] Hizmet ve konum canonical’ları tek slash ile bitiyor — 2026-09-10
- [x] `og:url` canonical ile eşleşiyor — 2026-09-10
- [x] Primary ve secondary örnekler sitemap’te (`/video-cekimi/sakarya/`, `/video-cekimi/akyazi/`) — 2026-09-10
- [x] Tüm hizmet × konum örnekleri indexlenebilir; yanlış `noindex` kaldırıldı — 2026-09-10
- [x] Dahili kart ve breadcrumb URL’leri canonical hedefe gidiyor — 2026-09-10
- [x] Harici proje URL’leri aynen korunuyor — 2026-09-10
- [ ] Mobil (≤390px), a11y, reduced-motion ve CLS smoke kontrolü
