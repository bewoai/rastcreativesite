# Rast Creative Studio — Yayın (Deploy) Durum Raporu

> **Tarih:** 14 Haziran 2026
> **Konu:** Siteyi Hostinger'da canlıya alma — mevcut durum, engel ve yapılacaklar

---

## 1. Özet

Site **tamamen hazır ve GitHub'da**. Build (derleme) sorunsuz çalışıyor. Tek kalan ve şu an **takıldığımız nokta:** derlenen dosyaların Hostinger sunucusuna **FTP ile yüklenmesi** — FTP bağlantısı tekrar tekrar zaman aşımına uğruyor.

| Aşama | Durum |
|---|---|
| Sitenin kodu + içeriği | ✅ Bitti |
| GitHub deposu (`bewoai/rastcreativesite`) | ✅ Güncel (push'landı) |
| GitHub Actions **build** | ✅ Başarılı |
| GitHub Actions **FTP yükleme** | ❌ Başarısız — `Timeout (control socket)` |
| Domain (rastcreative.com) | 🟡 Nameserver'lar Hostinger'da, "bağlanıyor" |
| SSL sertifikası | 🟡 Kuruluyor |
| **Canlı site** | ❌ Henüz açılmadı (dosyalar sunucuya gitmedi) |

---

## 2. Bugün tamamlananlar

- Tüm site geliştirmeleri bitti ve commit'lendi (görseller, SEO, logolar, preloader, mobil header, YouTube portfolyo, marka klasörleri, UI/UX denetim düzeltmeleri, favicon).
- **Domain Squarespace'ten Hostinger'a yönlendirildi** — nameserver'lar zaten `lunar/solar.dns-parking.com` (Hostinger).
- **8+ commit GitHub'a push'landı.**
- **GitHub Actions CI/CD kuruldu** — `main`'e her push'ta otomatik build + deploy.
- FTP secret'ları (server/username/password) GitHub'a eklendi.
- **İlk deploy denemesi BAŞARILI oldu** (dosyalar yüklendi).

### Sonra çıkan sorun: çift dağıtım çakışması
- Meğer Hostinger'ın **kendi "GitHub üzerinden dağıtım"** özelliği de bağlıymış; o, **ham repoyu** (build almadan, `src/`, `.git`, `package.json` ile) `public_html`'e klonladı → `index.html` yok → **403 Forbidden**.
- Çözüm: Hostinger'ın native git dağıtımı **kaldırıldı**, `public_html` **elle boşaltıldı**.
- Sonrasında bizim FTP deploy'unu yeniden tetikledik → **FTP artık `Timeout (control socket)` veriyor** (build hep başarılı, sadece yükleme adımı patlıyor).

---

## 3. Mevcut engel — neden FTP patlıyor?

İlk deploy çalıştı, sonrakiler tutarlı şekilde **kontrol soketi zaman aşımı** veriyor. En olası neden:

> **Hostinger'ın FTP güvenliği, kısa sürede yapılan çok sayıda bağlantı denemesi sonrası GitHub Actions IP'lerini geçici olarak engelliyor/kısıtlıyor.** (Özellikle başarısız `clean-slate` denemesi yüzlerce FTP işlemi yaptı.)

Timeout süresini 120 sn'ye çıkarmak işe yaramadı → sorun süre değil, **bağlantının kurulamaması** (network/güvenlik seviyesi).

---

## 4. Yapılması gerekenler — seçenekler

### 🥇 Seçenek A — Tek seferlik elle yükleme (en hızlı, siteyi HEMEN açar)
1. Bilgisayarda site derlenir (`dist/` klasörü) → **zip**'lenir.
2. hPanel **Dosya Yöneticisi** → `public_html` → **zip'i yükle** → **çıkart (extract)**.
3. CDN önbelleği temizlenir.
4. Site canlıya gelir. (CI'ı sonra ayrı düzeltiriz.)

### 🥈 Seçenek B — FTP'yi onar
- **~1 saat bekle** (Hostinger throttle'ı düşsün) → deploy'u tekrar dene; **veya**
- Workflow'da **FTPS'e geç** (`protocol: ftps`) → tekrar dene; **veya**
- hPanel'de FTP erişimini/izinlerini kontrol et.

### 🥉 Seçenek C — FTP'siz, Hostinger native GitHub dağıtımı (en sağlam uzun vade)
- CI, **derlenmiş `dist/`'i ayrı bir `deploy` branch'ine** atar.
- Hostinger'ın "GitHub üzerinden dağıtım"ı **o branch'i** çeker (FTP yok, secret yok, çakışma yok).
- Kurulumu biraz iş ama en temiz otomatik akış.

---

## 5. Önerilen plan

1. **Şimdi:** **Seçenek A** ile siteyi canlıya al (elle zip yükle) — beklemeden yayında olur.
2. **Sonra:** **Seçenek C**'yi kur (deploy branch + Hostinger native) → bundan sonra her `git push` FTP'siz, otomatik yayınlar.
3. Domain "bağlanıyor" tamamlanınca + SSL kurulunca `https://rastcreative.com` tam canlı olur.

---

## 6. Domain & SSL (paralel, otomatik ilerliyor)

- Nameserver'lar Hostinger'da ✅
- Domain "bağlanıyor" — birkaç dk–24 saat
- SSL "kuruluyor" — domain aktifleşince tamamlanır (gerekirse hPanel → Güvenlik → SSL → yeniden kur)

> **Not:** Bu ikisi dosya yüklemeden bağımsız; dosyalar `public_html`'e girer girmez (Seçenek A veya B/C) site açılır.
