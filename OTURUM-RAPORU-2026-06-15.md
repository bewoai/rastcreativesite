# Rast Creative Studio — Oturum Devir Raporu

> **Tarih:** 15 Haziran 2026
> **Amaç:** Bu oturumda yapılanların ve sıradaki adımların yeni bir oturuma temiz devri.
> Yeni oturum bu projeyi sıfırdan tanımıyormuş gibi okuyabilir.

---

## 1. Proje özeti

- **Marka:** Rast Creative Studio — Sakarya merkezli video prodüksiyon ve sosyal medya ajansı.
- **Site:** Astro 5 + Tailwind 4, **statik** (sunucu tarafı çalışma zamanı yok).
- **Repo:** `github.com/bewoai/rastcreativesite` (public), ana dal `main`.
- **Hosting:** Hostinger Business Web Hosting. Domain: `rastcreative.com`.
- **Tasarım dili:** Açık/"paper" zemin, Fraunces+Inter+Space Grotesk, amber (#E25303) aksan, sinematik "doğru kare" konsepti.

---

## 2. Bu oturumda yapılanlar (hepsi commit'li, `main`'de)

**Tasarım / içerik**
- Klaket: 3D sürüm geri alınıp **2D** versiyona dönüldü; mobil tıklama-engeli ve footer bug'ı düzeltildi.
- **Stok görseller** (Pexels, video-prodüksiyon temalı) hero/hakkımızda/hizmetler/neden-rast'a; `sharp` + `astro:assets` ile AVIF+WebP.
- **Yerel SEO:** zengin LocalBusiness/ProfessionalService + FAQPage + Service + BreadcrumbList + VideoObject JSON-LD, geo meta (`src/lib/schema.ts`).
- **15 gerçek müşteri logosu** "trusted by" duvarı (chip tedavisi, gri-ton→hover renk; Serdivan/NewLife kırpıldı, küçükler büyütüldü).
- **Animasyonlu preloader** (oturumda bir kez, reduced-motion'da kapalı).
- **YouTube portfolyo:** 15 video (7 yatay film + 8 dikey Shorts), `VideoFacade` (Vimeo+YouTube, nocookie), poster'lar YouTube thumbnail'inden.
- **Projeler yeniden düzenlendi:** kategori başlıkları altında **marka klasörleri** (`BrandFolder`, `lib/brands.ts`); tek videolu marka doğrudan videoya, çok videolu marka sayfasına. Aytaş Home → Instagram dış link.
- **Favicon:** vizör yerine **"r" monogram** (koyu kare + amber nokta).

**UI/UX**
- Yüzen **WhatsApp FAB**, dinamik **istatistik barı**, **3 adımlı süreç** bölümü.
- **Scroll-reveal** (fade+8px), **hizmet ikonları**, **liquid glass nav** (daha belirgin blur/scrim).
- Mobil sıkışıklık giderildi (üst bar sadece logo, FAB küçültüldü).
- Denetim raporu düzeltmeleri: global `:focus-visible` outline, prose link stilleri, kontrast (amber→amber-text), her hizmete + proje detayına **CTA**, `.btn:disabled`, tab yazısı 0.68rem.

**Yeni (bu oturumun sonu): Hero showreel videosu**
- `VideoHero.astro` bileşeni: tam-genişlik arkaplan video + scrim + açık metin. Ana sayfa **ve** projeler başlığında kullanılıyor.
- Performans/mobil: poster = LCP, video `preload=none` + load sonrası oynar, `muted+loop+playsinline`, `reduced-motion`/save-data'da sadece poster, `flush` ile nav altına yaslanır.
- **Video dosyaları henüz YOK** — şu an poster (`hero-cinema.jpg`) taşıyor. Spec'ler `public/videos/README.md`'de.

---

## 3. YAYIN DURUMU (en kritik konu)

| Durum | |
|---|---|
| Site build | ✅ `npm run build` → 32 sayfa, sorunsuz |
| Manuel yayın | ✅ Bir kez yapıldı, site açıldı |
| Otomatik deploy (FTP) | ❌ **Terk edildi** — `connect ETIMEDOUT 147.79.103.188:21`; Hostinger CI IP'lerine FTP'yi engelliyor |
| Otomatik deploy (yeni) | ✅ **Kuruldu:** GitHub Actions build alıp **`deploy` branch'ine** koyuyor (doğrulandı, içerik = build'lenmiş site) |
| Hostinger'ın `deploy`'u çekmesi | ⏳ **BEKLİYOR** — kullanıcı bağlamalı (aşağıda) |
| Domain | ⏳ Squarespace'te kayıtlı; nameserver'lar **zaten Hostinger'da** (`lunar/solar.dns-parking.com`); "bağlanıyor" |
| SSL | ⏳ "Kuruluyor" (domain aktifleşince otomatik biter) |

**Neden FTP yerine `deploy` branch:** GitHub→Hostinger FTP bağlantısı kuramıyor (timeout). Yön tersine çevrildi — GitHub sadece build edip `deploy` branch'ine yazar; **Hostinger o branch'i kendi çeker** (Hostinger→GitHub her zaman çalışır, secret gerekmez). Workflow: `.github/workflows/deploy.yml` (peaceiris/actions-gh-pages → `deploy` branch).

---

## 4. Sıradaki adımlar (yapılacaklar)

1. **Hostinger native GitHub dağıtımını bağla:** hPanel → Web Sitesi → Gelişmiş → GIT
   - Repository: `bewoai/rastcreativesite`
   - **Branch: `deploy`** (main DEĞİL — build edilmiş site orada)
   - Path: `public_html`
   - Otomatik dağıtım/webhook'u aç → her push otomatik yayınlanır.
2. **Domain + SSL** tamamlanmasını bekle (otomatik). Bitince `https://rastcreative.com` açılır.
3. Yayın sonrası **CDN önbelleğini temizle** (hPanel → Önbellek).
4. **Showreel videosu:** kullanıcı `public/videos/README.md`'deki spec'lere göre üretir → `public/videos/showreel.webm` + `showreel.mp4` (+ poster). Eklenip push'lanınca arkaplanda oynar.
5. Canlı doğrulama: hero, projeler, marka klasörleri, favicon, iletişim formu (e-posta `studio@rastcreative.com`), Vimeo/YouTube oynatma.

---

## 5. Teknik notlar (yeni oturum için)

- **Build/dev (bu makine):** `npm` PATH'te değil. Node tam yolu: `C:\Program Files\nodejs\node.exe`. Build: `node node_modules/astro/bin/astro.mjs build`. Dev/preview sabit port **4455** (`.claude/launch.json`).
- **git push BU ortamdan çalışıyor** (kullanıcının diğer araçları push edemiyordu, biz edebiliyoruz).
- `sharp` kurulu (astro:assets için, package.json'da).
- **GitHub Secrets** mevcut (FTP_SERVER=147.79.103.188, FTP_USERNAME=u584633029, FTP_PASSWORD) — ama FTP terk edildi, kullanılmıyor.
- Git geçmişi diğer araçlarca yeniden yazılmış olabilir; `origin/main` doğru kaynak.
- Hafıza: `working-style.md` (Fable 5 prompt rehberi çalışma tarzı) ve `preview-launch-setup.md` kayıtlı.

---

## 6. İçerik bekleyenler (kullanıcıdan)

- **Müşteri yorumları (testimonial)** — en güçlü sosyal kanıt, henüz yok.
- **Ekip tanıtımı** (isim/rol/foto), **ekipman markaları** (RED/ARRI vb.), **fiyat referansı**.
- **Showreel video dosyaları** (spec yukarıda).
- Gerçek **Vimeo ID'leri** (YouTube zaten eklendi; Vimeo gelince VideoObject otomatik aktif).

---

## 7. Net sonuç

Site kodu, içeriği ve build'i **hazır ve sağlam**. Otomatik deploy artık `deploy` branch + Hostinger-pull yöntemiyle çalışır durumda (GitHub tarafı doğrulandı). Tek bekleyen: **Hostinger'ın `deploy` branch'ine bağlanması** + domain/SSL'in tamamlanması. Bunlar bitince site `rastcreative.com`'da canlı olur ve sonraki her `git push` otomatik yayınlanır.
