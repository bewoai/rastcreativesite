# RAST CREATIVE STUDIO — Web Sitesi Yeniden Yapım Projesi

> Bu dosya Claude Code için hazırlanmış proje brifi ve adım adım yol haritasıdır.
> Her fazı sırayla uygula. Bir faz bitmeden diğerine geçme. Her fazın sonunda
> kullanıcıya ne yapıldığını özetle ve onay al.

---

## 0. PROJE ÖZETİ

- **Marka:** Rast Creative Studio — Sakarya merkezli video prodüksiyon ve sosyal medya ajansı.
- **Mevcut durum:** Site Framer'da (rastcreative.com). Yavaş, mobilde kullanışsız, karanlık tema müşteriyi itiyor, aylık abonelik maliyeti var. Tamamen yeniden yapılacak.
- **Hedef kitle:** 35 yaş üstü, kurumsal karar vericiler (KOBİ sahipleri, pazarlama müdürleri, medikal sektör). Teknoloji okuryazarlığı orta düzey → okunabilirlik ve netlik kritik.
- **Sitenin tek işi:** Ziyaretçiyi portfolyoyu izlemeye ve ücretsiz ön görüşme talebine (iletişim) yönlendirmek.
- **Hosting:** Hostinger Business Web Hosting (paylaşımlı, Node.js sunucusu YOK, statik dosya + PHP destekli). Domain: rastcreative.com (şu an Framer'a yönlü, geçiş en sonda).
- **Dağıtım hedefi:** GitHub → GitHub Actions build → FTP ile Hostinger `public_html`.

## 0.1 KESİN KURALLAR (her fazda geçerli)

1. **Statik site.** Sunucu tarafı çalışma zamanı yok. Astro static output.
2. **Mobil öncelikli.** Her bileşen önce 390px genişlikte tasarlanır, sonra desktop'a genişletilir.
3. **Performans bütçesi:** Mobil Lighthouse Performance ≥ 95, LCP < 2.0s, CLS < 0.05, toplam JS < 60KB (gzip). Bu bütçeyi aşan hiçbir özellik eklenemez.
4. **Video asla self-host edilmez.** Tüm portfolyo videoları Vimeo'da durur; sayfada poster görseli + tıkla-oynat facade kullanılır (lite-vimeo-embed yaklaşımı). Otomatik oynayan video YOK (yalnızca hero'da sessiz, kısa, ≤2MB, AV1/H.264 optimize edilmiş tek bir loop opsiyonel — Faz 4'te karar verilecek).
5. **Görseller:** AVIF + WebP fallback, `srcset` ile responsive, lazy loading, Astro `<Image />` bileşeni. Ham yükleme yasak.
6. **Dil:** Site içeriği Türkçe. `lang="tr"`. Kod/değişken isimleri İngilizce.
7. **Erişilebilirlik:** Kontrast oranı metinde ≥ 7:1 (35+ kitle), klavye odağı görünür, `prefers-reduced-motion` saygısı.
8. **Bağımlılık disiplini:** Framework olarak Astro + Tailwind CSS. Ağır animasyon kütüphanesi (GSAP, Framer Motion, Lottie) EKLENMEZ. Animasyonlar CSS + minimal vanilla JS (IntersectionObserver) ile yapılır.

---

## 1. TASARIM SİSTEMİ

### 1.1 Konsept: "Doğru Kare"

"Rast" hem Türk müziğinin en köklü makamı hem de isabet/doğruluk anlamı taşır.
Site bu fikri taşır: gösteriş değil, doğru kareyi yakalamış bir stüdyonun
özgüveni. Açık, ferah, ışıklı bir galeri hissi — karanlık stüdyo değil,
gün ışığında izlenen bir film perdesi.

### 1.2 Renk paleti

| Token | Hex | Kullanım |
|---|---|---|
| `--paper` | `#FAF9F6` | Ana zemin (sıcak beyaz) |
| `--ink` | `#111110` | Başlık ve gövde metni |
| `--ink-soft` | `#4A4845` | İkincil metin |
| `--line` | `#E5E2DC` | Çizgiler, kart kenarları |
| `--amber` | `#E25303` | İmza renk "Rast Amber" — CTA, vurgular, hover |
| `--amber-deep` | `#B84203` | Amber hover/aktif durumu |

- Amber yalnızca **vurgu** içindir: butonlar, link hover, timecode etiketleri, küçük grafik detaylar. Geniş yüzeylerde kullanılmaz.
- Footer ve hero alt bandı gibi sınırlı bölgelerde `--ink` zeminli koyu blok kullanılabilir (kontrast ritmi için) ama sitenin geneli açıktır.

### 1.3 Tipografi

| Rol | Font | Not |
|---|---|---|
| Display (başlıklar) | **Fraunces** (Google Fonts, optical sizing açık) | Sinematik-editoryal karakter. Yalnızca h1–h2. |
| Gövde | **Inter** | Tam Türkçe destek, yüksek okunabilirlik. |
| Utility (etiketler) | **Space Grotesk** | Timecode/eyebrow etiketleri, buton metinleri. |

- Gövde metni **min. 18px** (35+ kitle), satır yüksekliği 1.6.
- h1 mobilde ~clamp(2.4rem → 4.5rem). Fontlar `font-display: swap` + subset (latin-ext) ile self-host edilir (Google sunucusuna istek atılmaz — hem hız hem KVKK).

### 1.4 İmza unsurlar

1. **Liquid glass navigasyon:** Sayfa üstünde yüzen, `backdrop-filter: blur(16px) saturate(1.4)` + yarı saydam beyaz pill formunda nav. Scroll'da hafifçe küçülür. Mobilde alt kenara yakın glass tab-bar'a dönüşür (başparmak erişimi — 35+ kitle için büyük dokunma alanları, min 48px).
2. **Timecode motifi:** Her bölüm başlığının üstünde Space Grotesk ile `SAHNE 01 · PORTFOLYO` tarzı eyebrow etiketi. Film setinden gelen gerçek bir dil; dekoratif numara değil, gezinme yardımı.
3. **Glass kartlar:** Portfolyo ve hizmet kartlarında ince blur + 1px `--line` kenar; hover'da poster görseli hafif zoom + amber timecode görünür.
4. **Motion disiplini:** Tek orkestrasyon — sayfa yüklenirken hero metni satır satır maskeli reveal. Onun dışında yalnızca scroll-reveal (fade+8px yukarı) ve hover micro-interaction. Başka animasyon yok.

### 1.5 Yasaklar

- Karanlık tema yok (footer/koyu bant hariç).
- Sonsuz otomatik kayan marquee video şeritleri yok (eski sitenin hatası).
- Stok "AI sitesi" görünümü yok: mor-mavi gradyanlar, emoji ikonlar, kart gölgesi yığınları yasak.

---

## 2. SİTE HARİTASI VE İÇERİK

### Sayfalar

1. **/** Ana sayfa
2. **/projeler** Portfolyo (filtrelenebilir: Reklam, Marka Hikayesi, Ürün, Kurumsal, Medikal)
3. **/projeler/[slug]** Proje detay (Vimeo embed, künye, ilgili projeler)
4. **/hizmetler** 3 ana hizmet: Video Prodüksiyon, Kreatif Strateji & Yönetim, Post-Prodüksiyon & Kurgu
5. **/hakkimizda** Ekip, ekipman (Sony Cinema Line), Sakarya vurgusu
6. **/iletisim** Form + WhatsApp butonu + harita

### Ana sayfa bölüm sırası

1. **Hero:** "Markanızın Sinematik Yüzüyle Tanışın" (mevcut slogan korunur) + tek CTA "Ücretsiz Ön Görüşme" + ikincil link "Projelerimizi İzleyin". Arka plan: tam ekran video DEĞİL; yüksek kaliteli tek kare (poster) üzerinde glass detay.
2. **Seçili işler:** 4–6 proje kartı (poster + tıkla-oynat), "Tümünü gör" → /projeler.
3. **Referans logoları:** Tek satır, gri tonda, sessiz.
4. **Hizmetler özeti:** 3 kart → /hizmetler.
5. **Neden Rast:** Sakarya'da yerinde hizmet + sinema standardı ekipman + 2-4 hafta teslim. (35+ kitle somut güven sinyali ister: rakam, süre, süreç.)
6. **SSS:** Mevcut sitedeki 6 soru korunur, accordion.
7. **Son CTA bandı:** Koyu (`--ink`) zemin, amber buton.

### İletişim formu (statik hosting çözümü)

- Form servisi: **Web3Forms** (ücretsiz, statik siteyle çalışır, e-postaya iletir). Alternatif: Formspree.
- Alanlar: Ad, Firma, Telefon, Mesaj. KVKK onay kutusu.
- Ek olarak belirgin **WhatsApp** butonu (35+ kitlenin birincil kanalı).

---

## 3. TEKNİK MİMARİ

```
Astro 5 (static) + Tailwind CSS 4
İçerik: Astro Content Collections (markdown + frontmatter)
  └─ src/content/projects/*.md  → başlık, kategori, vimeoId, poster, müşteri, yıl, slug
  └─ src/content/services/*.md
Panel: Pages CMS (pagescms.org) — GitHub tabanlı, ücretsiz, OAuth kurulumu gerektirmez.
  └─ .pages.yml ile koleksiyonlar tanımlanır; kullanıcı tarayıcıdan içerik düzenler.
  └─ (Yedek plan: Sveltia/Decap CMS — Pages CMS sorun çıkarırsa)
Video: Vimeo (embed, facade pattern)
Deploy: GitHub Actions → build → SamKirkland/FTP-Deploy-Action → Hostinger public_html
```

---

## 4. FAZLAR — ADIM ADIM UYGULAMA

### FAZ 1 — Proje iskeleti
- [ ] `npm create astro@latest` (minimal, TypeScript strict), Tailwind ekle.
- [ ] Klasör yapısı: `src/components`, `src/layouts`, `src/content`, `src/styles`.
- [ ] `src/styles/tokens.css`: Bölüm 1.2–1.3'teki tüm tasarım tokenları CSS değişkeni olarak.
- [ ] Fontları self-host et (fontsource veya manuel woff2 subset).
- [ ] Base layout: `<html lang="tr">`, meta/OG şablonu, favicon.
- [ ] Git repo başlat, `main` dalına ilk commit.
- **Çıktı kontrolü:** `npm run dev` boş ama tokenlı bir sayfa gösteriyor.

### FAZ 2 — Çekirdek bileşenler
- [ ] `GlassNav` (desktop pill + mobil alt tab-bar, scroll davranışı).
- [ ] `Eyebrow` (timecode etiketi), `Button` (primary amber / secondary ink), `SectionHeading`.
- [ ] `ProjectCard` (poster, kategori, hover timecode) ve `VimeoFacade` (poster → tıklayınca iframe yükler; iframe önceden YÜKLENMEZ).
- [ ] `Footer` (koyu bant, sosyal linkler — gerçek URL'ler kullanıcıdan alınacak; eski sitede TikTok/X/YouTube linkleri yanlıştı, kopyalama).
- **Çıktı kontrolü:** Storybook gerekmez; `/dev` adlı geçici sayfada tüm bileşenler sergilenir, mobilde test edilir.

### FAZ 3 — İçerik koleksiyonları
- [ ] Content Collections şemaları (zod): project, service, faq.
- [ ] Eski siteden içerik taşı: 3 hizmet metni, 6 SSS, slogan ve tanıtım metinleri (rastcreative.com'dan; metinler kullanıcının kendi içeriği).
- [ ] Placeholder 6 proje girişi oluştur (kullanıcı Vimeo ID'lerini sonra dolduracak).
- **Çıktı kontrolü:** İçerik dosyası eklemek yeni kart oluşturuyor.

### FAZ 4 — Sayfalar
- [ ] Ana sayfa (Bölüm 2'deki sıra ile). Hero görseli için kullanıcıdan yüksek çözünürlüklü 1 kare iste; geçici olarak eski sitedeki görsel optimizasyonlu kullanılabilir.
- [ ] /projeler (kategori filtresi: URL paramlı, JS'siz çalışan fallback ile).
- [ ] /projeler/[slug], /hizmetler, /hakkimizda, /iletisim (Web3Forms entegrasyonu — kullanıcıdan access key iste).
- [ ] 404 sayfası.
- **Çıktı kontrolü:** Tüm sayfalar mobil 390px ve desktop 1440px'te ekran görüntüsüyle gözden geçirilir; kullanıcıya gösterilir.

### FAZ 5 — Performans ve SEO
- [ ] `astro build` sonrası Lighthouse (mobil) ölç; bütçe sağlanana kadar optimize et.
- [ ] Sitemap, robots.txt, canonical, OG görselleri, JSON-LD (`LocalBusiness` — Sakarya adresi + `VideoObject` proje detaylarında).
- [ ] Meta açıklamaları her sayfa için özgün yaz ("Sakarya video prodüksiyon" vb. yerel arama hedefli).
- **Çıktı kontrolü:** Lighthouse raporu kullanıcıya sunulur.

### FAZ 6 — Panel (Pages CMS)
- [ ] `.pages.yml` yaz: projects, services, faq koleksiyonları + medya klasörü.
- [ ] Kullanıcıya pagescms.org üzerinden GitHub ile giriş yapıp depoyu açmasını anlat; birlikte test proje girişi yapılır.
- **Çıktı kontrolü:** Kullanıcı panelden proje ekleyip commit oluşturabiliyor.

### FAZ 7 — Dağıtım (Hostinger)
- [ ] `.github/workflows/deploy.yml`: push to main → `npm ci && npm run build` → FTP-Deploy-Action ile `dist/` → `public_html/`.
- [ ] Kullanıcıdan hPanel → Dosyalar → FTP Hesapları bilgilerini GitHub repo Secrets'a eklemesini iste (FTP_SERVER, FTP_USERNAME, FTP_PASSWORD). Şifre asla koda yazılmaz.
- [ ] İlk deploy'u Hostinger'ın geçici önizleme URL'sinde test et.
- **Çıktı kontrolü:** main'e push → 2 dk içinde site Hostinger'da güncelleniyor.

### FAZ 8 — Yayına geçiş
- [ ] Son tur test: gerçek telefonda gezinme, form gönderimi, tüm Vimeo embedler.
- [ ] Kullanıcı hPanel'deki "domaini bağla" rehberini izleyerek rastcreative.com'u Hostinger'a yönlendirir (DNS). SSL'in otomatik kurulduğu doğrulanır.
- [ ] hPanel'de CDN aktif edilir, önbellek temizlenir.
- [ ] Framer'daki eski sayfa URL'leri kontrol edilir (/projelerimiz, /hizmetlerimiz, /iletisim) — yeni yapıda yol değiştiyse `public_html/.htaccess` ile 301 yönlendirme eklenir.
- [ ] Google Search Console'a sitemap gönderilir.
- [ ] Her şey doğrulandıktan sonra kullanıcı Framer aboneliğini iptal eder.

---

## 5. KULLANICIDAN İSTENECEKLER (zamanı gelince sor)

- Logo dosyaları (SVG tercih) ve varsa marka görselleri.
- Portfolyo videolarının Vimeo'ya yüklenmesi + ID listesi.
- Hero için 1 adet yüksek çözünürlüklü kare.
- Gerçek sosyal medya URL'leri (Instagram: instagram.com/rastcreative doğru; TikTok/X/YouTube linkleri eski sitede hatalıydı).
- İletişim bilgileri: telefon, e-posta, Sakarya adresi, WhatsApp numarası.
- Web3Forms access key (ücretsiz kayıt) ve FTP bilgileri (Faz 7'de).
