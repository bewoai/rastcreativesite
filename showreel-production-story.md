# Bölüm: Showreel / Üretim Hikayesi (Sahne 01.5)  ⭐ ODAK

## Amaç (iş açısından)
"Tek çekimden dört ayrı pazarlama çıktısı" mesajını sinematik biçimde kanıtlamak ve
ziyaretçiyi *izlemeye* ikna ederek lead niyetini artırmak. Sitenin "vay" anı burası.

## Konum & teknik
- Bölüm: `<section class="story" data-production-story>` (Astro bileşeni, cid `pysa5me5`).
- Sticky/pin: JS class state machine — `is-before / is-pinned / is-after`.
- Yükseklik ~2169px (~2.9 ekran), sticky iç blok ~867px.
- Katmanlar: `story__deck` (pano), `story__drone`, `story__phone` (Reels),
  `story__steps` (01/02/03 senkron), `story__ambient` (turuncu glow), `story__timeline/playhead`.
- Hareket: kartlarda `matrix3d` 3B tilt var. `deck` `transition: transform .08s linear`;
  `drone`/`phone` `transition: all` (kötü).

## Güçlü yanlar
- 3B tilt derinlik veriyor; adım listesi senkronu akıllıca; ambient ışık marka tonunda.

## Bilinen sorunlar (gözlemlenen)
> Güncelleme 2026-06-20 (branch `codex/hero-showreel-3d`): akıcılık/bug paketi `HeroShowreel3D.astro`'da uygulandı ve preview'da doğrulandı.
- [ ] **Gerçek video yok.** (Kullanıcı kararı: en sona bırakıldı; şimdilik statik kalıyor.)
- [x] **Kart çakışması:** çözüldü. `story__drone` yukarı alınıp kısaltıldı (top:-1rem),
      artık panonun üst kenarının üzerinde yüzen bir hava-çekimi şeridi; "Rast Production
      Board / 01·04" başlık satırı üç breakpoint'te de tamamen açıkta (preview'da doğrulandı).
- [x] **"4K BRAND FİLM" etiketi kırpılıyor** → düzeldi; preview'da etiket tam görünüyor.
- [x] **`transition: all` drone/phone'da** → yeni bileşende yok; sadece `transform`.
- [x] **`will-change` yok** → deck/screen/phone/drone/post/step/focusRing'e eklendi;
      reduced-motion'da `will-change: auto` ile sıfırlanıyor.
- [x] **`.08s linear` transition → lastik hissi** → CSS transition kaldırıldı; JS'te
      rAF + **lerp (0.18)** yumuşatma. Hızlı scroll'da snap yerine süzülme.
- [x] **Pin state machine kırılgan** → metrikler cache'lendi (her frame `offsetHeight`
      okuması kaldırıldı = layout thrashing yok). Preview'da is-pinned/is-after üç fazda da
      doğru (early/mid pinned; after p=1.0; takılma yok).
- [x] **Bölüm uzun / mobil cramped** → **mobil yeniden tasarlandı**: <980px'te pin + 3B
      fly-out kaldırıldı, yerine temiz statik galeri (tam genişlik pano + 3'lü çıktı satırı:
      9:16 Reels / Drone / Final). Kırpılma/çakışma yok; `min-height` mobilde `auto`.
      Masaüstü 3B collage korunuyor. Tablet/360/390/420 preview'da doğrulandı.
- [x] **Mobil "hareketsiz" hissi** → pin'siz hareket eklendi: kartlara scroll-bağlı
      **dikey parallax** (`--p`, yalnız dikey → kırpmaz), **belirgin reveal stagger**
      (opaklık, 0.1/0.2/0.3s — IntersectionObserver `.story--anim`), ve playhead süpürmesi.
- [x] **Metin: "siteyle alakasız gereksiz vaatler"** → siteye dayandırıldı: başlık
      "Tek çekimden web, sosyal ve reklam formatları"; paragraf whyRast "Format uyumu"+
      "Tek elden"den; adımlar "biz" dilinde; "01/04" → "00:14", "Saha+mekan" → "Hava çekimi",
      "Final teslimler" → "Yayına hazır". Eyebrow site `Eyebrow` kalıbında.
- [x] **Tipografi**: gövde Inter, eyebrow/buton/timecode Space Grotesk, başlık Fraunces
      (self-host + subset + swap; `tokens.css`). CLS 0.0026.
- [ ] **Desktop bölüm uzun** (`min-height` ~230dvh): video gelmeden "boş" his — beklemede.
- [x] **reduced-motion**: önce sadece transform sıfırlanıyordu → masaüstünde kartlar
      panonun üstüne biniyordu (preview'da yakalandı). Düzeltildi: reduced-motion artık
      mobildeki **aynı düz galeri** düzenini kullanıyor (pano + 3'lü satır), çakışma yok.
- [x] **Lead CTA**: bölüm sonuna birincil "Ücretsiz Ön Görüşme" butonu eklendi
      (`data-cta-location="showreel"`) — "vay" anında dönüşüm yolu (iş hedefi #1).
- [x] **Production-readiness doğrulandı** (preview): CLS = 0 (pin geçişleri dahil),
      ~60fps+ / 0 uzun görev, dark mode uyumlu, 360/390/768/1440'ta taşma yok.

## Faz 1 planı — gerçek showreel
1. YouTube'daki işlerden **20–30 sn** sessiz kurgu çıkar.
2. `ffmpeg` ile web'e uygun **muted, loop, poster'lı** çıktı (mp4 H.264 + webm),
   `automations/transcode-showreel.md`'deki reçete.
3. Panonun (`story__deck` ekranı) içine `<video muted loop playsinline autoplay preload=metadata poster=...>`.
   Veya: poster + tıkla → lightbox/YouTube embed (autoplay'i bütçeye göre seç).
4. Playhead'i videoya bağla (gerçek currentTime/duration) ya da tamamen dekoratif yap.
5. VideoObject JSON-LD ekle (`docs/context/seo.md`).

## Faz 2 planı — akıcılık & bug
- Çakışmayı düzelt (kart konumları + z-index katmanlaması).
- "4K" etiketinin overflow'unu aç / padding ver.
- `transition: all` → `transform`; `will-change: transform`; `translate3d`.
- Scroll'u `motion-parallax.md` rAF iskeletine taşı; sticky'ye geçmeyi değerlendir.
- Katmanlara farklı hız ver (gerçek parallax derinliği).

## "Bitti"
- [ ] Gerçek video oynuyor (mobil dahil) — **kullanıcı kararı: en sona**
- [x] Çakışma yok  [x] 60fps+  [x] reduced-motion temiz fallback
- [x] CLS regresyon yok (= 0)  [x] dark mode  [x] mobil/tablet temiz  [x] lead CTA
- [ ] VideoObject schema — video gelince  [ ] Prod Lighthouse (deploy sonrası teyit)
