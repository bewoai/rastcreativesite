# Rast Creative Hero — Uygulama Notları

Bu doküman ana sayfanın güncel hero bölümünde alınan tasarım kararlarını ve teknik uygulamayı özetler.

## Amaç

Hero, proje görsellerini tekrar eden bir portfolyo alanı olmak yerine Rast Creative’in çalışma sistemini anlatır:

**Fikir → Prodüksiyon → Post → Teslim**

Sol tarafta stüdyonun ana söylemi ve aksiyonları, sağ tarafta ise bu üretim sürecini temsil eden hareketli güneş sistemi bulunur.

## Kompozisyon

### Sol alan

- Ana mesaj: `İyi iş kendini izletir.`
- Açıklama: Sakarya merkezli prodüksiyon stüdyosu konumlandırması.
- Birincil CTA: `İşleri Gör`
- İkincil CTA: `Bir Proje Başlatalım`
- Alt meta satırı: `Film / Fotoğraf / İçerik / AI`

### Sağ alan — üretim güneş sistemi

- Merkezde gerçek Rast Creative logosunun kullanıldığı koyu güneş çekirdeği bulunur.
- Logo, SVG içindeki gereksiz boşluklar kırpıldıktan sonra kürenin geometrik merkezine sabitlenmiştir.
- Merkez logo yatay ve dikey olarak `50% / 50%` noktasındadır; kürenin dairesel maskesinin dışına taşmaz.
- Dış yörüngede dört bağımsız cam küre dolaşır:
  - `01 / Fikir` — kıvılcım
  - `02 / Prodüksiyon` — kamera apertürü
  - `03 / Post` — kurgu kanalları
  - `04 / Teslim` — onay işareti
- Küreler proje veya müşteri kartı değildir; üretim aşamalarını temsil eder.

## Hareket sistemi

Hareketin amacı dekorasyon değil, üretim döngüsünü görünür kılmaktır.

- Dört üretim küresi dış yörüngede `40s linear infinite` ritmiyle ilerler.
- Küreler eşit aralıklarla yerleştirilmiştir; her biri `-10s` kademeli gecikme kullanır.
- Dış çizgideki turuncu sinyal akışı `28s` sürer.
- Orta yörünge X ekseni perspektifini taklit eden kontrollü bir dikey projeksiyon hareketi yapar:
  - `scaleY(0.56 → 0.76)`
  - `15s`, yumuşak giriş/çıkış, ileri–geri
- İç yörünge Y ekseni perspektifini taklit eden yatay projeksiyon hareketi yapar:
  - `scaleX(0.52 → 0.82)`
  - `18s`, yumuşak giriş/çıkış, ileri–geri
- Büyük şeffaf SVG yüzeylerine gerçek 3D `perspective()` uygulanmaz. Bu tercih bazı GPU’larda oluşan katman kırpılmasını önlerken aynı derinlik hissini korur.
- Merkez güneşin ışığı `7s` süren çok düşük genlikli bir corona hareketi kullanır.

## Görsel dil

- Zemin: near-black.
- Ana vurgu: kontrollü Rast turuncusu.
- Yörüngeler: düşük opaklıklı, ince SVG çizgileri.
- Cam küreler: koyu radyal yüzey, ince beyaz hairline ve hafif turuncu iç yansıma.
- Logo: beyaz, düşük yoğunluklu ışıkla; sert neon veya aşırı bloom kullanılmaz.
- Hero içerisinde seçili iş, müşteri logosu veya showreel kapağı gösterilmez.

## Responsive davranış

- Desktop’ta hero iki kolonludur; güneş sistemi sağ kolonda `576px` genişliğe kadar büyür.
- Tablet ve mobilde sistem arka plan katmanına dönüşür.
- Küçük ekranlarda yalnızca fikir küresi korunur; diğer etiket ve aşamalar metinle rekabet etmemesi için gizlenir.
- Hero içeriği kısa ekranlarda kırpılmak yerine sayfanın doğal biçimde uzamasına izin verir.

## Erişilebilirlik ve performans

- Güneş sistemi dekoratiftir: `aria-hidden="true"` ve `pointer-events: none` kullanır.
- Hareketler `transform`, `offset-distance`, `opacity` ve SVG `stroke-dashoffset` ile sınırlıdır.
- `prefers-reduced-motion: reduce` durumunda tüm yörünge, sinyal, corona ve sembol animasyonları durur.
- Logo eager yüklenir; yörünge sistemi kullanıcı etkileşimini engellemez.
- Animasyon sırasında layout değiştiren özellikler kullanılmaz.

## İlgili dosyalar

- `src/pages/index.astro` — hero içerik yapısı, grid, CTA ve alt meta satırı.
- `src/components/HeroSolarSystem.astro` — güneş sistemi, cam küreler ve bütün hareket sistemi.
- `src/components/HeroAtmosphere.astro` — düşük kontrastlı arka plan ışık atmosferi.
- `src/components/VideoHero.astro` — hero yerleşim kabı ve viewport davranışı.
- `src/components/GlassNav.astro` — hero ile dengelenen kompakt navbar.
- `public/hero/rast-sun-logo.svg` — merkez güneş için optimize edilmiş Rast logosu.
- `src/styles/fonts.css`, `src/styles/tokens.css`, `src/styles/global.css` — grotesk tipografi sistemi.

## Kontrol sonucu

- Yerel önizleme: `http://localhost:4455/`
- Dört üretim küresi çalışıyor.
- Kürelerde viewport taşması bulunmuyor.
- Merkez logo geometrik olarak tam ortada.
- Tarayıcı konsolunda hata bulunmuyor.
