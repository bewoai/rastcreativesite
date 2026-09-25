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
