# Bölüm: Hero / Live Set Entry

## Amaç (iş açısından)

Ana sayfanın ilk temasında Rast Creative Studio’nun film-set kimliğini premium ama hızlı bir hareket diliyle hissettirmek; kullanıcıyı geciktirmeden “Ücretsiz Ön Görüşme” CTA’sına taşımak.

## Konum & teknik

- Sayfa: `src/pages/index.astro`
- Layout entegrasyonu: `<BaseLayout jsonLd={pageJsonLd} entryAnimation>`
- Hero bileşeni: `src/components/VideoHero.astro`
- Entry katmanı: `src/components/EntryOverlay.astro`
- Header katmanı: `src/components/GlassNav.astro`
- Stil dosyası: `src/styles/live-set.css`
- Motion standardı: `docs/context/motion-parallax.md`

## Live Set entry davranışı

- Sadece ana sayfada render edilir; diğer sayfa/detail/blog akışlarında yoktur.
- Overlay CSS tarafında default görünmez; ana sayfanın head bootstrap’i `html.entry-pending` class’ını ilk paint’ten önce eklerse viewport’u hemen kapatır, böylece header animasyondan önce flash etmez.
- JS çalışmazsa `entry-pending` eklenmediği için içerik ve CTA erişilebilir kalır.
- `sessionStorage` anahtarı: `rc_entry_played`. Aynı browser session’ında tekrar oynatılmaz.
- `prefers-reduced-motion: reduce` durumunda overlay DOM’dan kaldırılır.
- Kullanıcı pointer/touch/keyboard etkileşimi yaparsa animasyon kısa yoldan biter.
- Animasyon konsepti (v4, "film banyosu / exposure"): Logo karanlık bir film karesinden pozlanır gibi blur + düşük brightness durumundan net, sıcak beyaz forma çözülür. Hareketli çubuk/beam yoktur; premium his ışık, fokus ve çok hafif amber vignette nefesiyle verilir.
- Süre: desktop ~2.6s, mobil ~2.35s, ardından 700ms yumuşak dissolve reveal (skip'te 200ms).
- Süreler `src/styles/tokens.css` içindeki `--ls-dur-entry-expose`, `--ls-dur-entry-mobile` ve `--ls-dur-entry-fade` tokenlarından yönetilir.

## Header progress

Kullanıcı geri bildirimiyle navigation içindeki REC, sahne etiketi ve timecode slate’i kaldırıldı. Header artık yalnızca mevcut link/CTA yapısını ve dekoratif scroll progress hairline’ı taşır:

- Progress hairline: scroll derinliğine göre `scaleX()` ve hue değişimi.
- Header/nav kalıcı kalır; `Ücretsiz Ön Görüşme` CTA’sı animasyon tarafından gizlenmez.
- Mobil rail + bottom tabbar davranışı korunur; ekstra slate UI eklenmez.

## Reveal motifleri

Ana sayfa v1 uygulaması:

- Stats: `data-reveal="odometer"`
- Proje/hizmet/süreç/blog gridleri: `data-reveal="frame-advance"`
- Görsel odaklı blok: `data-reveal="exposure-fade"`
- SEO copy: `data-reveal="focus-pull"`

Kartların kendi `data-reveal` attribute'u kullanılmaz; grid container `data-reveal="frame-advance"` ile çocukları açar. Böylece nested reveal opacity çakışması proje görsellerini görünmez bırakmaz.

## Performans ve erişilebilirlik notları

- Hero poster/LCP akışı değiştirilmedi.
- Entry overlay asset beklemez; içerik DOM’da hazır kalır.
- Hareketler CSS transform/opacity/filter/clip-path ile sınırlıdır.
- Header/nav kalıcıdır; CTA animasyon tarafından kalıcı olarak gizlenmez.
- Site arka planındaki scroll-driven `Clapperboard` dekorasyonu kaldırıldı; hero/poster/LCP akışı ve içerik yapısı korunur.
- Seçili işler kartları aynı görsel oranı korur; aktif kartlar her yükleme/resize sonrası en yüksek karta göre eşitlenir.
- Odometer rakamlarında tabular numeric kullanılır; CLS riskini azaltmak için minimum genişlik verilir.

## Son doğrulama

- 2026-07-15: Astro dev sunucusundaki `/_image` 500 hatasının dış kabuktan kalıtılan `NODE_ENV=production` nedeniyle oluştuğu doğrulandı. `npm run dev`, `NODE_ENV=development` değerini açıkça ayarlayacak şekilde güncellendi; `<Image>`, `<Picture>` ve `getImage()` responsive optimizasyon akışı korunarak Chromium'da tüm görsel yanıtları hatasız yüklendi.
- 2026-07-15: Hero güven satırı proje koleksiyonundaki gerçek marka/içerik sayılarına bağlandı; H1 DOM metni `Sakarya Video Çekimi ve Prodüksiyon` olarak düzeltildi. Desktop ve 390px mobil Chromium testlerinde metin, CTA'lar ve satır kırılımı doğrulandı; yatay taşma görülmedi.
- 2026-07-15: Reduced-motion fallback'i dekoratif intro glow/statement animasyonlarını açıkça `none` yapacak şekilde sağlamlaştırıldı. Chromium testinde entry overlay kaldırıldı, hero/CTA ilk anda görünür kaldı ve reveal transform/opacity fallback'leri doğrulandı.
- 2026-07-15: Entry skip, tema geçişi, desktop scroll nav, mobile condensed tabbar ve altı native FAQ öğesinin toggle davranışı gerçek Chromium akışında çalıştı; console, runtime, request ve HTTP 4xx/5xx hatası görülmedi.
- 2026-07-15: Entry overlay ilk paint'te header flash etmeyecek şekilde `entry-pending` bootstrap'iyle güncellendi; süre desktop ~2.6s / mobil ~2.35s'e uzatıldı; `npm run build` başarılı, 204 sayfa üretildi.
- 2026-07-15: Seçili işler kartlarında nested reveal kaldırıldı; posterler içerikteki orijinal YouTube JPG URL'sinden basılır. Logo wall Astro dev `/_image` transform endpoint'i yerine import edilen hashed `/_astro` asset path'lerini düz `<img>` ile kullanır; build'de 34 logo yolu dosya olarak doğrulandı.
- 2026-07-15: Entry animasyonu knife-pass v3'e geçirilmişti (staccato çarpma ritmi); kullanıcı geri bildirimiyle kaldırıldı.
- 2026-07-15: Son `npm run build` başarılı; 204 sayfa ve 161 optimize görsel üretildi. Production preview Chromium smoke testi hatasız tamamlandı. Lighthouse mobil varsayılan profili: Performance 63, LCP 3.9s, CLS 0, TBT 750ms; layout-shift regresyonu görülmedi, LCP/TBT iyileştirmesi ayrı performans işi olarak izlenmeli.
- 2026-07-14: `npm run build` başarılı; 204 sayfa üretildi.

## Açık notlar

- Live Set v1 ana sayfayla sınırlı. Diğer sayfalara yaymadan önce aynı browser ve performans kontrolleri tekrarlanmalı.
