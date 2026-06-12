# Rast Creative Studio — Web Sitesi

Sakarya merkezli video prodüksiyon ve kreatif ajansın web sitesi. Açık, ferah,
hızlı; mobil öncelikli statik site.

> Yol haritası ve kesin kurallar: [`RAST-CREATIVE-YOL-HARITASI.md`](./RAST-CREATIVE-YOL-HARITASI.md)

## Teknoloji

- **Astro** (static output) + **Tailwind CSS 4** (`@tailwindcss/vite`)
- TypeScript (strict)
- Self-host fontlar: Fraunces (başlık), Inter (gövde), Space Grotesk (etiket) —
  `latin` + `latin-ext` altküme, `public/fonts/`
- Video: Vimeo (facade pattern) · Form: Web3Forms · Deploy: GitHub Actions → FTP → Hostinger

## Komutlar

| Komut             | İşlev                                  |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Geliştirme sunucusu (`localhost:4321`) |
| `npm run build`   | `dist/` üretimi (statik)               |
| `npm run preview` | Build çıktısını yerelde önizle         |

## Yapı

```
public/fonts/        Self-host woff2 (latin + latin-ext)
src/
  styles/
    tokens.css       Tasarım tokenları (renk, tipografi) — tek doğruluk kaynağı
    fonts.css        @font-face tanımları
    global.css       Tailwind + token @theme eşlemesi + base stiller
  layouts/
    BaseLayout.astro lang="tr", meta/OG şablonu, favicon, font preload
  components/        (Faz 2)
  content/           (Faz 3)
  pages/             Sayfalar
  consts.ts          Site sabitleri
```

## Durum

- [x] **Faz 1** — Proje iskeleti (tasarım tokenları, fontlar, base layout)
- [ ] Faz 2 — Çekirdek bileşenler
- [ ] Faz 3 — İçerik koleksiyonları
- [ ] Faz 4 — Sayfalar
- [ ] Faz 5 — Performans & SEO
- [ ] Faz 6 — Panel (Pages CMS)
- [ ] Faz 7 — Dağıtım (Hostinger)
- [ ] Faz 8 — Yayına geçiş
