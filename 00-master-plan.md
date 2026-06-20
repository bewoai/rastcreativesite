# 00 — Master Plan (Rast Creative Studio)

## Kuzey yıldızı
Sakarya ve çevre illerdeki dükkan, firma, fabrika, hastane ve bireysel müşterileri
**"Ücretsiz Ön Görüşme"** adımına taşıyan, prodüksiyon kalitesini ilk 5 saniyede
kanıtlayan bir site.

## Faz planı

### Faz 0 — Knowledge base (BU İŞ) ✅
Bu iskeleti repoya koy, CLAUDE.md'yi kök dizine al. Artık her iş bağlamla başlıyor.

### Faz 1 — Showreel'i gerçek yap (en yüksek etki)
- Pano içine sessiz + loop gerçek reel videosu (YouTube'daki işlerden kurgu).
- Detay ve teknik plan: `docs/sections/showreel-production-story.md`
- Çıktı: ana sayfada "izlenecek" bir an; lead niyetini artırır.

### Faz 2 — Görsel bug + akıcılık
- Kart çakışması, kırpılan "4K" etiketi, `transition: all` → `transform`,
  `will-change`, rAF yumuşatma, pin durum makinesi sağlamlaştırma.
- Detay: `docs/context/motion-parallax.md` + showreel section.

### Faz 3 — Dönüşüm (conversion) optimizasyonu
- CTA tutarlılığı, WhatsApp hızlı kanal, form sürtünmesini azaltma.
- Sosyal kanıt (logo bandı, sayılar, kısa testimonial).

### Faz 4 — SEO derinleştirme
- Eksik alt metinler (96 görselin ~26'sı), görsel boyutları, schema genişletme,
  ilçe sayfaları, blog ritmi. Detay: `docs/context/seo.md`

### Faz 5 — İçerik motoru
- Blog + portföy ekleme akışını playbook'a bağla, üretimi haftalık ritme oturt.

## Backlog (öncelik sırası)
| # | İş | Faz | Etki | Efor |
|---|----|-----|------|------|
| 1 | Panoya gerçek loop video | 1 | Çok yüksek | Orta |
| 2 | Kart çakışması + 4K etiketi fix | 2 | Yüksek | Düşük |
| 3 | transition/will-change/rAF refactor | 2 | Yüksek | Orta |
| 4 | Tüm görsellere alt + boyut | 4 | Orta | Düşük |
| 5 | Mobil pin degradasyonu doğrula | 2 | Orta | Düşük |
| 6 | Prod Lighthouse + bütçe | 4 | Orta | Düşük |
| 7 | WhatsApp + CTA tutarlılığı | 3 | Orta | Düşük |

## Ölçüm
- Birincil KPI: ön görüşme formu / WhatsApp tıklaması.
- İkincil: showreel izlenme oranı, ortalama scroll derinliği, organik trafik.
