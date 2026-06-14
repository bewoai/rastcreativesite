# Rast Creative Studio — rastcreative.com

Sakarya merkezli video prodüksiyon ve kreatif ajans. Astro ile inşa edilmiş, statik çıktılı, performansa ve SEO'ya odaklı kurumsal web sitesi.

🌐 **Canlı:** [rastcreative.com](https://rastcreative.com)

---

## Teknoloji

| Araç | Kullanım |
|------|---------|
| [Astro](https://astro.build) | Statik site üreteci |
| TypeScript | Strict mod |
| Vanilla CSS + CSS Custom Properties | Tasarım sistemi (tokenlar) |
| Self-host fontlar | Fraunces · Inter · Space Grotesk |
| Web3Forms | İletişim formu backend |
| Google Analytics 4 | Ziyaretçi & dönüşüm takibi |
| GitHub Actions | Otomatik build pipeline |
| Hostinger | Hosting (Git deploy) |

---

## Deploy Akışı

```
git push main
    ↓
GitHub Actions → npm ci → npm run build → deploy branch'e push
    ↓
Hostinger webhook → public_html otomatik güncellenir (~1 dk)
```

**Secrets (GitHub Repository Settings → Secrets):**
- Gerekmez — deploy branch yaklaşımında FTP/SSH secret kullanılmaz.

---

## Komutlar

```bash
npm run dev      # Geliştirme sunucusu → localhost:4321
npm run build    # dist/ üretimi (statik)
npm run preview  # Build çıktısını yerelde önizle
```

---

## Proje Yapısı

```
.github/
  workflows/
    deploy.yml       # Build & deploy branch pipeline

public/
  covers/            # Proje kapak görselleri
  fonts/             # Self-host woff2 (latin + latin-ext alt küme)
  placeholders/      # SVG placeholder posterler
  videos/            # Hero video (public/videos/hero-reel.mp4)

src/
  assets/
    logos/           # Marka logoları (PNG/SVG/AVIF)
    photos/          # Ekip & set fotoğrafları

  components/        # Yeniden kullanılabilir Astro bileşenleri
    GlassNav.astro   # Liquid-glass navigasyon (mobil tab bar dahil)
    Footer.astro     # Footer + sosyal linkler
    LogoWall.astro   # Müşteri logo duvarı (grayscale → renkli hover)
    VideoFacade.astro# YouTube facade pattern (tıklamada yükle)
    AreaIndex.astro  # Bölgesel SEO linker (Sakarya ilçeleri × hizmetler)
    ProjectCard.astro# Proje kartı
    ContactForm.astro# İletişim formu (Web3Forms)
    WhatsAppFab.astro # Sabit WhatsApp butonu
    …

  content/
    projects/        # Her proje için ayrı .md (17 proje)
    services/        # Hizmet açıklamaları (3 hizmet)
    faq/             # SSS içerikleri (6 soru)

  data/
    locations.ts     # Sakarya ilçe listesi (SEO)
    seo-services.ts  # SEO hizmet slug & tagline listesi

  layouts/
    BaseLayout.astro # lang="tr", meta/OG, GA4, font preload

  pages/
    index.astro      # Ana sayfa
    hizmetler.astro  # Hizmetler
    hakkimizda.astro # Hakkımızda
    iletisim.astro   # İletişim
    kvkk.astro       # KVKK / Gizlilik
    404.astro        # Özel hata sayfası
    projeler/        # Proje listesi + detay sayfaları
    [hizmet]/        # Bölgesel SEO sayfaları (hizmet × ilçe)

  styles/
    tokens.css       # Tasarım tokenları — tek doğruluk kaynağı
    fonts.css        # @font-face tanımları
    global.css       # Base stiller + reset

  consts.ts          # Site sabitleri (iletişim, CTA, sosyal linkler)
  content.config.ts  # Content Collection şemaları
```

---

## İçerik Güncelleme

### Yeni Proje Eklemek

`src/content/projects/` altına yeni bir `.md` dosyası oluştur:

```yaml
---
title: "Proje Başlığı"
category: "Kurumsal"          # Kurumsal | Reklam | Sosyal Medya | Drone
youtubeId: "VIDEO_ID"
poster: "https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg"
summary: "Kısa açıklama."
client: "Marka Adı"
year: 2025
featured: true                # Ana sayfada öne çıkıyor mu?
order: 1                      # Sıralama (küçük = önde)
posterAlt: "SEO uyumlu görsel açıklaması"
duration: "02:30"             # Video süresi
---

Proje detay metni buraya.
```

### Logo Eklemek

1. Logo dosyasını `src/assets/logos/` klasörüne koy (PNG/SVG/AVIF)
2. `src/components/LogoWall.astro` dosyasına import et ve `logos` dizisine ekle

---

## Tasarım Sistemi

Renkler, tipografi ve boşluklar `src/styles/tokens.css` dosyasında CSS custom property olarak tanımlıdır.

| Token | Değer | Kullanım |
|-------|-------|---------|
| `--paper` | `#faf9f6` | Ana yüzey |
| `--ink` | `#111110` | Başlık & gövde metni |
| `--amber` | `#e25303` | Marka aksanı (CTA, hover) |
| `--font-display` | Fraunces | H1–H3 başlıklar |
| `--font-body` | Inter | Gövde metni |
| `--font-utility` | Space Grotesk | Etiket, nav, buton |

---

## Durum

| Faz | Açıklama | Durum |
|-----|---------|-------|
| 1 | Proje iskeleti, tasarım tokenları, fontlar | ✅ |
| 2 | Çekirdek bileşenler | ✅ |
| 3 | İçerik koleksiyonları (17 proje, 3 hizmet, 6 SSS) | ✅ |
| 4 | Tüm sayfalar | ✅ |
| 5 | Performans & SEO (VideoObject schema, bölgesel SEO) | ✅ |
| 6 | GA4 & dönüşüm takibi | ✅ |
| 7 | Deploy (GitHub Actions → Hostinger Git) | ✅ |
| 8 | Yayında | ✅ **rastcreative.com** |
