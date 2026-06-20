# CLAUDE.md — Rast Creative Studio

> Bu dosyayı Claude Code her oturumda otomatik okur. Projenin "anayasası" budur.
> Kod yazmadan önce ilgili `docs/context/*` ve `docs/sections/*` dosyasını oku.

## Proje özeti
Rast Creative Studio — Sakarya merkezli video prodüksiyon + kreatif ajans.
Site canlıda, geliştirme kenardan (incremental) yürüyor. Stack: **Astro**.
Repo kök klasörü: `rastcreativesite` (PNY harici disk).

## İş hedefi (önce bunu hatırla)
1. **Birincil:** Müşteri çekmek → "Ücretsiz Ön Görüşme" lead'i. Her kararı buna göre ver.
2. **İkincil:** Portföy + prestij.
Detay: `docs/context/business.md`

## Çalışma kuralları (Claude Code için)
- Türkçe konuş, kod ve değişken adları İngilizce kalsın.
- Küçük, gözden geçirilebilir commit'ler. Tek PR = tek iş.
- Canlı site var: **kırıcı değişiklikten kaçın**, önce branch + preview.
- Bir bölüme dokunmadan önce `docs/sections/<bölüm>.md` dosyasını oku ve iş bitince güncelle.
- Görsel eklerken: `alt` zorunlu, `width/height` veya `aspect-ratio` zorunlu (CLS).
- Animasyon eklerken `docs/context/motion-parallax.md` standardına uy.
- Emin değilsen dur ve sor; tahminle canlıya yazma.

## Knowledge base haritası
- `docs/00-master-plan.md` — yol haritası, faz planı, backlog
- `docs/context/` — iş, marka, tasarım, stack, SEO, içerik, motion
- `docs/sections/` — her "sahne" için ayrı bağlam dosyası
- `docs/playbooks/` — tekrarlanan işler (yeni iş ekle, blog ekle, yayın checklist)
- `docs/decisions/` — mimari kararlar (ADR)
- `.claude/commands/` — özel slash komutları
- `automations/` — script ve CI fikirleri

## "Bitti" tanımı (her iş için)
- [ ] İlgili section.md güncellendi
- [ ] Görsellerde alt + boyut var
- [ ] Mobil + reduced-motion test edildi
- [ ] `astro build` hatasız
- [ ] Lighthouse'ta LCP/CLS regresyonu yok
