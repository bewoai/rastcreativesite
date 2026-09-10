# Bağlam: SEO (Yerel odaklı)

## İş hedefi

Organik arama görünürlüğü; ziyaretçiyi portföy ve hizmet kanıtları üzerinden **ücretsiz ön görüşme** akışına taşımaya hizmet eder. Yerel SEO ekseni Sakarya, Serdivan ve çevre konumlar ile video prodüksiyon hizmetlerinin kesişimidir.

## URL ve canonical politikası

Yayımlanan URL’ler kullanım amaçlarına göre ayrılır:

- **Ziyaret edilebilir HTML sayfaları:** root dışındaki yollar tek `/` ile biter. Örnek: `/iletisim/`, `/blog/yazi-slugu/`, `/video-cekimi/sakarya/`.
- **Sayfa + fragment:** slash fragment’ten önce gelir. Örnek: `/hizmetler/#video`.
- **Ana sayfa:** ziyaret edilebilir URL `https://rastcreative.com/` biçimindedir.
- **Origin:** `SITE.url` mutlak URL üretiminin tabanı olarak `https://rastcreative.com` biçiminde, sondaki slash olmadan kalır.
- **Dosya, feed ve API endpoint’leri:** uzantı veya endpoint sözleşmesi korunur; `/rss.xml`, `/api/services.json`, `/auth.md`, `/llms.txt`, `/openapi.json` ve `/.well-known/api-catalog` slash almaz.
- **Asset URL’leri:** görsel, video, font, favicon ve manifest yolları slash almaz.
- **Harici/protokol URL’leri:** proje `externalUrl` değerleri, sosyal ağlar, WhatsApp, `tel:` ve `mailto:` aynen korunur.
- **Stabil schema entity kimlikleri:** `https://rastcreative.com#business`, `https://rastcreative.com#organization` ve `https://rastcreative.com#website` sayfa URL’si değildir; değiştirilmez.

Her HTML sayfası self-referencing canonical üretir. Canonical yalnız normalize edilmiş pathname’i kullanır; query ve fragment içermez. `og:url` canonical ile aynı değeri taşır. İç linkler, breadcrumb öğeleri, ziyaret edilebilir JSON-LD URL’leri, sitemap, RSS channel bağlantısı ve makine tarafından yayımlanan sayfa URL’leri bu politikayla eşleşir.

`src/lib/schema.ts` içindeki ortak mutlak URL helper’ı assetlerde de kullanıldığı için global trailing-slash normalizer değildir. Sayfa yollarını doğru biçimde sağlamak caller’ın sorumluluğudur.

## Yerel SEO ve indexleme

- Hizmet × konum sayfaları programatik olarak üretilir.
- Tüm hizmet × konum sayfaları, hizmete özgü içerik ve konuma özgü açıklama birleştirildikten sonra indexlenebilir hâle getirildi ve sitemap’e dahil edildi.
- Şehre özel kanıt bulunmadığında portföy başlığı bölgesel çalışma iddiasında bulunmaz; genel, gerçek proje seçkisi olarak sunulur.
- Gizli proje sayfaları erişilebilir olsa da `noindex` kalır ve sitemap’e girmez.

## Schema (JSON-LD)

- LocalBusiness / VideoProductionCompany: NAP, çalışma saatleri ve `areaServed`.
- BreadcrumbList: slash’lı ziyaret edilebilir sayfa URL’leri.
- BlogPosting: slash’lı `mainEntityOfPage`.
- AboutPage ve sayfa listeleri: slash’lı page URL’leri.
- Stabil entity `@id` değerleri yukarıdaki kimliklerle korunur.
- VideoObject; gerçek thumbnail, uploadDate, duration ve content/embed URL verileri hazır olduğunda ayrıca ele alınır.

## Apache ve yayın sınırı

Astro’nun `trailingSlash: "always"` ayarı üretim rotalarını tanımlar. Hostinger/Apache katmanı slash’sız fiziksel sayfa dizinlerini HTTPS + apex host + trailing slash canonical hedefine tek 301 ile yönlendirmeli; dosya ve endpoint’lere slash eklememelidir. Eski rota redirect’leri de doğrudan nihai canonical URL’ye gitmelidir.

`astro preview` `.htaccess` çalıştırmaz. Bu nedenle Apache yönlendirme zincirleri uygun vhost ve `AllowOverride` bağlamında test edilmeden “üretimde doğrulandı” sayılmaz. Kaynak denetimi ve Astro build doğrulaması bu sunucu testi yerine geçmez.

## Teknik SEO checklist

- [ ] Tüm yeni/değişen görsellerde açıklayıcı `alt`
- [ ] Görsellerde `width`/`height` veya `aspect-ratio`
- [ ] LCP görselinde uygun preload/eager önceliği
- [x] Canonical = `og:url`; HTML sayfa URL’leri slash’lı — 2026-09-10
- [x] İç linklerde gereksiz canonical redirect yok — 2026-09-10
- [x] Sitemap tüm indexlenebilir canonical URL’leri, hizmet × konum sayfaları dahil içeriyor — 2026-09-10
- [x] API/RSS/discovery çıktılarında page ve endpoint ayrımı korunuyor — 2026-09-10
- [ ] Mobil ve `prefers-reduced-motion` smoke testi
- [ ] Prod Lighthouse’ta LCP/CLS ve SEO regresyonu yok
