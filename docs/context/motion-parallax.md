# Motion & Parallax Standardı

Bu doküman Rast Creative Studio sitesindeki hareket dilinin sınırlarını belirler. Amaç; film-set hissini güçlendirirken lead CTA erişimini, SEO içeriğini ve performansı korumaktır.

## İlkeler

- **İçerik önce gelir:** Metin, CTA ve görseller server-rendered kalır; animasyon hiçbir zaman içeriği yüklenene kadar bloklayan bir preloader'a dönüşmez.
- **JS güvenli fallback:** JS yoksa içerik görünür kalır. Gizleme yalnızca `html.js` ve `prefers-reduced-motion: no-preference` altında yapılır.
- **Scroll hijack yok:** Native scroll davranışı korunur; Lenis/GSAP/WebGL gibi ağır veya scroll'u ele geçiren katmanlar kullanılmaz.
- **Reduced motion zorunlu:** `prefers-reduced-motion: reduce` durumunda giriş animasyonu kaldırılır, reveal/flip/pulse hareketleri pratikte sıfırlanır.
- **Mobil kısa ve hafif:** Mobilde giriş hareketi desktop’tan kısa tutulur; header’da ekstra slate/REC UI kullanılmaz.
- **Performans bütçesi:** Hareketler `transform`, `opacity`, `filter` ve ölçülü `clip-path` ile sınırlanır. Layout tetikleyen animasyonlardan kaçınılır.
- **CTA görünürlüğü:** “Ücretsiz Ön Görüşme” aksiyonu animasyon nedeniyle kaybolmaz; overlay skip edilebilir ve kısa sürede DOM’dan kaldırılır.

## Kullanılan motifler

- `focus-pull`: metin/SEO bloklarında blur → sharp + opacity.
- `exposure-fade`: görsel/video alanlarında opacity + hafif scale-in.
- `frame-advance`: grid çocuklarında kısa stagger reveal.
- `odometer`: istatistik rakamlarında tek seferlik sayım; non-numeric değerler sabit kalır.
- Header progress: navigation içinde yalnızca dekoratif scroll progress çizgisi; REC, sahne etiketi veya timecode slate’i yok.
- Entry overlay: ana sayfaya özel, session başına bir kez çalışan; logoyu karanlık film karesinden pozlanır gibi blur/brightness çözülmesi ve hafif amber vignette ile açan kısa exposure sekansı.

## Uygulama notları

- Reveal sistemi `src/layouts/BaseLayout.astro` içindeki `initReveal()` fonksiyonuna bağlıdır.
- Live Set stilleri `src/styles/live-set.css` içinde tutulur; genel reveal kurallarını ezmek için varyant selector’ları daha özgüldür.
- Entry animasyonu sadece `BaseLayout` üzerinde `entryAnimation` prop’u verilirse render edilir.
- Odometer, `.stats__n` metninde baştaki sayısal kısmı sayar (`13+`, `33`); `4K` gibi formatlarda sayım yapmaz.

## Doğrulama

Her motion işi için minimum kontrol:

1. `npm run build` hatasız.
2. Desktop’ta giriş animasyonu, skip ve header progress davranışı kontrol edildi.
3. Mobilde taşma ve jank yok.
4. Reduced-motion’da overlay kalkıyor, içerik görünür kalıyor.
5. LCP poster ve CLS üzerinde bariz regresyon yok.
