# Design

Bu dosya sitede **şu an inşa edilmiş olanı** kaydeder — niyeti değil. Kaynak:
`src/styles/tokens.css`, `src/styles/global.css` ve ana sayfa hero'su.

## İki zemin

Site iki zeminde çalışır ve bu bilinçlidir:

- **Paper (varsayılan):** `--paper #faf9f6` üzerine `--ink #111110`. İçerik, portföy,
  blog ve hizmet sayfalarının tamamı. "Aydınlık galeri" — koyu stüdyo değil.
- **Ink band (sinematik):** `--ink-band #111110` / hero'da `#060505`. Yalnızca hero'lar
  ve seçili tam genişlik bantları. Metin `--on-ink #faf9f6`, ikincil `#8e8e8b`.

Karar kuralı: bir bölüm *işi gösteriyorsa* koyu, *işi anlatıyorsa* açık zemin.

## Renk

| Rol | Token | Değer |
|---|---|---|
| Yüzey | `--paper` | `#faf9f6` |
| Metin | `--ink` / `--ink-soft` | `#111110` / `#4a4845` |
| Hairline | `--line` | `#e5e2dc` |
| Aksan | `--amber` | `#e25303` |
| Aksan (açık zeminde metin) | `--amber-text` → `--amber-deep` | `#b84203` |
| Koyu bant | `--ink-band` / `--on-ink` | `#111110` / `#faf9f6` |

Amber **noktasaldır**: CTA dolgusu, hover, aktif durum, kart ok rozeti. Büyük alan
dolgusu, gradient veya neon glow olarak kullanılmaz. `#e25303` açık zeminde küçük metin
için AA'yı geçmez (3.64:1) — bu yüzden foreground olarak daima `--amber-text` kullanılır.

Hero'nun koyu zemininde tek istisna: atmosfer katmanındaki key light, amber'ın %26
doygunlukta radial gradient'i. Bu bir aksan değil, ışık.

## Tipografi

Tek grotesk: **Inter Variable** hem display hem gövde. Display sesi ikinci bir aileden
değil, **ağırlık + negatif tracking**'ten gelir — bu yüzden başlık fontu sıfır ek byte.

| Rol | Aile | Ağırlık | Tracking |
|---|---|---|---|
| h1 / h2 | `--font-display` (Inter) | 650 | `-0.03em` |
| Hero h1 | Inter | 640 | `-0.038em`, `clamp(3rem, 7vw, 6rem)` |
| h3–h6 | `--font-body` (Inter) | 600 | — |
| Gövde | `--font-body` (Inter) | 400 | `--text-body` 18px / 1.6 |
| Etiket, metadata, buton | `--font-utility` (Space Grotesk) | 500–600 | `0.08–0.2em`, uppercase |

Gövde minimumu 18px'tir ve düşürülmez (35+ hedef kitle). Fontlar Fontsource'tan
self-host, `latin` + `latin-ext` subset — `latin-ext` Türkçe `ğ Ğ ş Ş İ` glyph'lerini
taşır, o yüzden ikisi de preload edilir.

## Malzeme: koyu cam

Koyu zeminde yüzen her yüzeyin (üretim küreleri, aşama etiketleri, güneş
çekirdeği) ortak reçetesi:

```
background:      koyu radyal yüzey + hafif turuncu iç yansıma
border:          1px solid rgba(255,255,255,0.11 … 0.17)
backdrop-filter: blur(18px)
radius:          50% (küre) / 999px (etiket)
```

Hairline opaklığı **derinliği kodlar**: öndeki yüzeyler `0.17`, arkadakiler
`0.065`'e kadar iner. Aynı değeri her yüzeye vermek dashboard gibi okunur.

Gölge daima **offset + geniş blur + siyah**. Renkli halo veya sıfır-offset glow
yok; logo düşük yoğunluklu ışıkla verilir, sert neon veya aşırı bloom kullanılmaz.

Açık zeminde ayrı bir cam sistemi vardır (`--glass-bg` / `--glass-border`, nav ve
kartlar) — ikisi karıştırılmaz.

## Hero sahnesi — üretim güneş sistemi

Hero **hiçbir proje, müşteri, kapak veya showreel taşımaz.** İlk ekran markanın
neye inandığını söyler; işler kendi bölümlerinde durur. Sağ taraf tamamen
dekoratiftir: `aria-hidden`, `pointer-events: none`, içinde tek bir link yoktur.

Sağdaki sistem dekorasyon değil, **üretim akışının şeması**:
`Fikir → Prodüksiyon → Post → Teslim`. Merkezde Rast logosunun taşıdığı güneş
çekirdeği, dış yörüngede dört cam küre dolaşır.

Bileşenler: `HeroAtmosphere` (arka ışık atmosferi) + `HeroSolarSystem` (sistem).

| Katman | Değer | Hareket |
|---|---|---|
| Işık havuzları | opaklık 0.36–0.50, blur 40px | 18–26s nefes |
| Güneş çekirdeği | `clamp(6.5rem, 19%, 7.5rem)`, 1px hairline | corona 7s, düşük genlik |
| Merkez logo | çekirdeğin %82'si, opaklık 0.9 | — (sabit, tam merkezde) |
| Dış yörünge izi | 1.2px stroke | sinyal akışı 28s |
| Orta yörünge | `rotateZ(-8deg) scaleY(.56→.76)` | 15s, ileri–geri |
| İç yörünge | `rotateZ(13deg) scaleX(.52→.82)` | 18s, ileri–geri |
| Üretim küreleri (4) | `--planet-size` 5.6rem, blur(18px) cam | `offset-distance` 40s linear, `-10s` kademeli |
| Kırmızı sinyal noktaları | 4px | 5.2s nabız, faz kaymalı |

İki tasarım kararı burada önemli:

- **Büyük şeffaf SVG yüzeylerine gerçek 3D `perspective()` uygulanmaz.** Yörünge
  eğimi `scaleX`/`scaleY` projeksiyonuyla taklit edilir; bazı GPU'larda oluşan
  katman kırpılmasını önlerken derinlik hissi korunur.
- Küreler **eşit aralıklı** yerleşir (`--stage` × `-10s` gecikme), böylece
  yörüngede kümelenme olmaz.

Ölçülen (1280×720): sistem 576×576, logo çekirdekte `dx=0, dy=0` ile tam
merkezde, hiçbir küre viewport dışına taşmıyor.

Hero'da satüre rengin göründüğü tek yer bu sinyal noktaları ve apertür
detayıdır (`#ff6a2a`).

## Kompozisyon

- Konteyner `--container-max` 75rem, gutter `--container-pad` `clamp(1.25rem, 5vw, 3rem)`.
- Hero: iki kolon — `minmax(0,1fr)` (mesaj) + `minmax(22rem,36rem)` (güneş sistemi).
  Sistem `min(100%, 40rem)`'e kadar büyür.
- **Hero tek viewport'tur**: `height: 100svh`. Başlık, lede, CTA ve alt bilgi
  hattı aynı flex konteynerini paylaşır, bu yüzden dördü de tek bir sol
  çizgiden başlar (1280'de ölçülen: hepsi `x:81`). Alt hat ilk ekranda görünür.
- Kısa masaüstü ekranlarda (`max-height: 700px`) başlık ve ritim küçülür,
  kırpılmaz; `max-height: 560px` altında hero büyür ve sayfa kaydırılır.
- `--vhero-lead`: VideoHero'nun üst boşluğunu sayfanın ayarlayabilmesi için
  açtığı özel değişken. Hero'da nav'ı geçecek kadar, fazlası değil.
- Dokunma hedefi minimum 48px (`--tap-min`); yalnızca en dar/kısa ekranda
  ikincil CTA 40px'e iner.

### Mobil hero (980px altı)

Mobil, masaüstünün küçültülmüş hâli **değildir** — ayrı bir yerleşimdir.
Hero iki dikey bölüme ayrılır ve güneş sistemi **metnin arkasına atılmaz**:
akış içinde, kendine ait bir satıra geçer (`order: -1`), böylece grafik
kenarlardan kesilmez.

Okuma sırası: sistem → başlık → açıklama → birincil CTA → ikincil CTA.

| Kırılma | Görsel alan | Sistem genişliği |
|---|---|---|
| `< 980px` | `clamp(10.5rem, 25svh, 14rem)` | `min(76vw, 20rem)` |
| `< 560px` | `clamp(9.5rem, 23svh, 12rem)` | — |
| `< 420px` | — | ≤ `17.5rem` |
| `< 380px` | `9rem` | `min(68vw, 14.5rem)` |
| `< 380 × 620px` | `7.5rem` | — |

Mobilde grafik opaklığı `0.74`'e iner ki metinden görsel öncelik çalmasın.
**Dört üretim aşamasının sembolü her ekranda korunur**; yalnızca küre etiketleri,
caption, dış akış çizgisi ve küçük sinyal detayları gizlenir. Küre boyutları
kasıtlı olarak birbirinden hafif farklıdır — eşit olsalar kompozisyon mekanik
görünür.

Çok kısa cihazlarda (`380 × 620px` altı) dekoratif alt meta/scroll satırı
kaldırılır ki sabit mobil navigasyonla çakışmasın; **iki CTA da korunur**.
Alt navigasyonun arkasında hiçbir hero içeriği kalmaz.

Ölçülen (390×844 / 375×667 / 320×568): yatay taşma yok, hiçbir küre kenardan
kesilmiyor, dört küre de görünür, CTA'lar sabit navigasyonu geçiyor.

## Hareket

Tam standart: `docs/context/motion-parallax.md`. Özet: `transform`, `opacity`,
`offset-distance` ve SVG `stroke-dashoffset` ile sınırlı — layout tetikleyen
hiçbir özellik animasyona girmez. `--ease-out` `cubic-bezier(0.22,1,0.36,1)`,
`--dur-fast` 160ms / `--dur` 280ms.

`prefers-reduced-motion: reduce` durumunda yörünge, sinyal akışı, corona ve
sembol animasyonlarının tamamı durur; içerik tam erişilebilir kalır.

## Bu sistemin kapsamadıkları

- İkinci bir display ailesi (Fraunces 2026-08-16'da kaldırıldı).
- Hero'da REC / timecode / crosshair gibi set-UI katmanı (aynı tarihte kaldırıldı).
- Hero'da seçili iş, müşteri logosu veya showreel kapağı.
- Mobilde güneş sisteminin metnin arkasına geri taşınması, herhangi bir üretim
  aşamasının kaldırılması veya kürelerin yörüngeden koparılması — bunlar
  bilinçli olarak korunan ilkelerdir, "sadeleştirme" adına bozulmamalı.
- WebGL. Bir ara hero için `three` ile kapsül plakaları render edilmişti; güneş
  sistemine geçilince bırakıldı ve `three` artık hiçbir yerden import edilmiyor.
  Planlanan intro/tünel işi bu kararı yeniden açacaktır.
