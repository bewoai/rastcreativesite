# Site Analiz Raporu — Rast Creative Studio
**Tarih:** 2026-06-20 · **Branch:** `codex/hero-showreel-3d` · **Odak:** Yeni 3B Showreel + genel site

---

## 0. Yönetici özeti
Yeni `HeroShowreel3D` bileşeni görsel olarak iddialı (3B tilt, parallax katmanlar, marka tonunda ambient ışık) ama
**kuzey yıldızına** ("ilk 5 saniyede prodüksiyon kalitesini kanıtla") henüz hizmet etmiyor: çünkü **oynayan görüntü yok**.
Bölüm bir "showreel" gibi konumlanmış ama içerik tamamen statik fotoğraf + sahte playhead. Bu, master plan'daki
**Faz 1 ("Showreel'i gerçek yap")** işinin hâlâ açık olduğu anlamına geliyor — en yüksek etkili tek iş bu.

İkincil olarak performans/akıcılık (Faz 2) detayları yeni bileşene büyük ölçüde taşınmamış: `will-change` yok,
rAF + lerp yumuşatma yok, pin geçişi `position: fixed` ile yapıldığı için layout zıplaması (CLS) riski taşıyor.

**Tek cümlede:** Tasarım kabuğu hazır; içine gerçek video + akıcılık katmanı girince bölüm "vay" anına dönüşür.

---

## 1. Showreel (HeroShowreel3D.astro) — detaylı

### Güçlü yanlar
- 3B `rotateX/rotateY` tilt + `translateZ` katmanlaması gerçek derinlik veriyor.
- Adım listesi (01/02/03) scroll ilerlemesiyle senkron açılıyor (`--p1/--p2/--p3` segment mantığı temiz).
- Ambient glow marka turuncusunda; `prefers-reduced-motion` için tam bir fallback bloğu var (`--p:1`).
- Görsellerde `aspect-ratio`/sabit kutu var, `Image` responsive `widths` veriyor → bu bölümde CLS düşük.

### Kritik açıklar (öncelik sırasıyla)

**P0 — Gerçek video yok (en büyük kayıp).**
Repoda hiç `.mp4/.webm/.mov` yok (`find` = 0 sonuç). `story__deck` içindeki ekran sabit `film-crew-red-camera.jpg`.
`story__playhead` scroll'a bağlı, gerçek `currentTime`'a değil → "showreel" sözü tutulmuyor.
→ Master plan Faz 1: YouTube işlerinden 20–30 sn sessiz kurgu, ffmpeg ile muted/loop/poster'lı mp4+webm,
`<video muted loop playsinline preload="metadata" poster=...>` ekrana göm. + VideoObject JSON-LD.

**P1 — Akıcılık (Faz 2 yeni bileşene taşınmamış):**
- `will-change: transform` **yok** (`grep` = YOK) → tilt/parallax'ta repaint riski. Hareketli katmanlara ekle.
- `.story__deck { transition: transform 80ms linear }` → hızlı scroll'da hâlâ "lastik/gecikme" hissi.
  rAF zaten var ama **lerp (yumuşatma) yok**; `--p` doğrudan atanıyor. Hedef değere doğru lerp ekle.
- `translate3d` yerine `translateY/translateX` kullanılmış (GPU katmanı garantisi için 3d tercih edilebilir, ama
  `transform-style: preserve-3d` zaten compositor'a alıyor — düşük öncelik).

**P1 — Pin geçişi CLS riski:**
`.is-pinned` → `position: fixed`, `.is-after` → `position: absolute`. Sticky blok akıştan çıkıp girerken
yükseklik rezervasyonu JS state'ine bağlı; `getBoundingClientRect` + `offsetHeight` her frame okunuyor
(**layout thrashing**). `position: sticky`'ye geçmek hem daha pürüzsüz hem daha az kırılgan olur
(showreel-production-story.md Faz 2 de bunu öneriyor). Mevcut haliyle resize sırasında zıplama görülebilir.

**P2 — Bölüm çok uzun, içerik az:**
`min-height: 230dvh` (mobil 260dvh). İçerik payload'ına göre uzun scroll → "boş" hissi.
Video girince haklı çıkar; girmezse beat'leri sıkıştır (~180dvh).

**Çözülmüş görünenler (eski dokümandaki sorunlar yeni bileşende yok):**
- "4K Brand Film" etiketi artık `story__frameOverlay` içinde, kırpılma yapısal olarak giderilmiş görünüyor → **canlıda doğrula**.
- Kart çakışması: yeni konumlandırmada `z-index` katmanları ayrılmış → **orta-scroll'da drone/başlık çakışmasını gözle test et**.

### Showreel "Bitti" kontrol listesi
- [ ] Gerçek video oynuyor (mobil dahil)
- [ ] `will-change` + rAF lerp ile 60fps
- [ ] Pin geçişinde zıplama yok (sticky'ye geçiş değerlendirildi)
- [ ] reduced-motion gerçekten kapatıyor (canlı test)
- [ ] VideoObject JSON-LD eklendi
- [ ] Lighthouse LCP/CLS regresyon yok

---

## 2. Genel site (ana sayfa)

**İyi durumda:**
- Hero (`VideoHero`) doğru kurgulanmış: poster = LCP, video `preload="none"` + `window.load` sonrası, reduced-motion/Save-Data'da hiç oynamıyor. **Ama hero videosu da yok** — poster tek başına taşıyor (webm/mp4 prop'ları boş).
- WhatsApp kanalı zaten var (Footer + ContactForm deep-link) → master plan Faz 3'ün bu kısmı büyük ölçüde tamam.
- Günlük proje rotasyonu (seed'li, İstanbul saatine göre) zarif ve deterministik.
- Stats / süreç / neden-Rast / SSS / blog blokları içerik ve SEO açısından sağlam; FAQ + LocalBusiness JSON-LD mevcut.

**Açıklar:**
- **İki "showreel" de videosuz.** Site iki ayrı yerde video vaat edip ikisinde de statik gösteriyor — en büyük tutarsızlık.
- **Sosyal kanıt eksik:** logo bandı + sayılar var ama **testimonial/müşteri sözü yok** (Faz 3).
- **alt metin borcu:** master plan ~96 görselin ~26'sında alt eksik diyor — site geneli tarama gerekiyor (showreel dekoratif görselleri `alt=""` doğru).
- **Doküman/repo dağınıklığı:** kökte 6+ rapor .md dosyası + `rast-knowledge-base.zip` + `calistigimiz_markalarin_logolari` klasörü duruyor. CLAUDE.md `docs/` yapısı vaat ediyor ama `docs/` sadece 2 dosya içeriyor (knowledge base henüz açılmamış/yerleşmemiş).

---

## 3. Önerilen sıra (etki/efor)
1. **Showreel'e gerçek video** (P0, çok yüksek etki) — hero + showreel için tek kurgu üretip ikisinde de kullan.
2. **Showreel akıcılık paketi** (P1): `will-change`, rAF lerp, sticky'ye geçiş, CLS doğrulama.
3. **Canlı doğrulama**: 4K etiketi kırpılması + orta-scroll kart çakışması + mobil pin (preview'da gözle).
4. **Testimonial bloğu** (Faz 3 sosyal kanıt).
5. **Alt metin denetimi** site geneli (Faz 4).
6. **Repo temizliği**: knowledge base'i `docs/` altına yerleştir, kök rapor dosyalarını arşivle.

---

## Notlar
- Stack doğrulandı: Astro 6.4, Tailwind 4.3 (Vite), sharp; Node ≥22.12.
- Repoda video varlığı: **0** dosya (`public/`, `src/assets/`).
- `astro build` / Lighthouse bu rapor kapsamında çalıştırılmadı — kod incelemesine dayalı bulgular.
