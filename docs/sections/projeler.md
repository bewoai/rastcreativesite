# Projeler — içerik kaynakları ve yapı

## Kaynaklar
- YouTube'daki işler: `youtubeId` (kapak `i.ytimg.com`).
- Sitede barındırılan dikey işler (YouTube'da olmayanlar): `video: "/videos/projeler/<slug>.mp4"`,
  kapak `/covers/<slug>.webp`. Kaynak: Drive `projeler` klasörü (Eylül 2026).
  Kodlama: 720×1280 H.264, CRF 26, en çok 2,5 Mbit/s, AAC 96k, `+faststart`
  (≈ 2–10 MB/video). Kapak: videodan seçilmiş kare, 720×1280 WebP.
- Web projeleri: `category: "Web"`, `siteUrl`, kapak = sitenin ekran görüntüsü.
- Eklenmeyenler (kullanıcı kararı): BUYAPI / Thermoway, Adatıp × Sakaryaspor ve sitede
  zaten bulunan işler (Altoteks, Canex, Mars Stüdyo, Candellit Balet, Duygu Hoca 01).

## Yönetilen hesaplar
`src/data/managed-accounts.ts` → `InstagramCard` (Projeler sayfası "Yönettiğimiz
hesaplar" ve marka sayfaları). Instagram'ın resmî profil gömmesi olmadığı için kart bizim:
hesaptaki kendi işlerimiz (en yeni 6 dikey video), birkaç rakam ve Instagram linki.

## Vaka çalışması
`/projeler/vaka/aytas-home/` — Aytaş Home Instagram raporu (Meta Business Suite,
1 Oca–30 Nis vs 1 May–31 Ağu 2026). Yalnızca sonuçlar yayında; rapordaki satış ölçüm
açığı, kitle/coğrafya dağılımı ve iç yol haritası müşteride kaldı.

## Marka levhası (ana sayfa)
Logo dosyası olmayan müşteriler (Duygu Cebecik, Duru Optik, Hörnhauss) serif isim olarak
basılıyor (`mode: "word"`); logo gelince `src` ile değiştirilir.

## Güncelleme (25 Eylül)
- Yönetilen hesaplara Duygu Cebecik Özmüş YouTube kanalı (@duygucebecikopdr) eklendi;
  kart artık `platform: "instagram" | "youtube"` alıyor (YouTube'da yatay bölümler, logo yoksa baş harfler).
- Hörnhauss marka levhasından çıkarıldı (projelerde kalıyor).
- Ekip linkleri: Muhammed → LinkedIn, Instagram; Berat → LinkedIn, Instagram, portfolyo
  (beratdegirmenci.studio). Ana sayfa ekip kartları ve Hakkımızda; Person şemasında `sameAs`.

## Güncelleme (20 Ekim)

- "Benzer işler" listesi `hidden: true` projeleri dışlıyor (`projeler/[slug].astro`).
  Adatıp sayfaları doğrudan URL ile açılmaya devam ediyor, ama 22 herkese açık proje
  sayfasından link almıyor.
- Proje detayındaki "← Tüm projeler" okunun dönüşü artık uygulanıyor (`:global`).
- Kategori sayfaları (`/projeler/kategori/<slug>/`) yalnızca içinde iş olan kategoriler
  için üretiliyor. Boş olan web, reklam ve marka-hikayesi sayfaları kalktı. Bunların
  eski URL'leri, sayfaları yeniden üretilene kadar `.htaccess` ile `/projeler/`e 301
  ediliyor.
- `/ekip/` → `/hakkimizda/` ve `/projeler/(vaka|marka|kategori)/` → `/projeler/` 301'leri
  eklendi. Bu adresler eskiden sunucunun ham 403 sayfasını döndürüyordu.
  `ErrorDocument 403` markalı 404 sayfasını gösteriyor.
