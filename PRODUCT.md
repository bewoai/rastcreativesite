# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Sakarya ve çevre illerdeki (Kocaeli, Gebze, Düzce) işletme sahipleri ve pazarlama
sorumluları: dükkan, firma, fabrika, hastane ve bireysel müşteriler. Ağırlıklı olarak
35+ yaş bandı, mobil ve masaüstü karışık. Geldikleri an yaptıkları iş: "bu ekip benim
markam için iyi iş çıkarır mı?" sorusunu birkaç saniyede yanıtlamak, sonra fiyat/kapsam
konuşmak için iletişime geçmek.

Sektör dağılımı portföyden doğrulanabilir: sanayi/üretim (Altoteks, Canex, ThermoWay,
Isıtan, Chint Power), medikal (Adatıp Hastanesi, Op. Dr. Duygu Cebecik Özmüş),
lojistik/denizcilik (Meteors Shipping, Mavi Vatan), inşaat (Buyapı), perakende
(Aytaş Home, Rosa Coffee).

## Product Purpose

Rast Creative Studio'nun portföyünü ve üretim standardını kanıtlayan, ziyaretçiyi
"Ücretsiz Ön Görüşme" lead'ine taşıyan site.

Birincil başarı ölçütü: iletişim formu gönderimi / WhatsApp tıklaması.
İkincil: portföy izlenme oranı, scroll derinliği, organik trafik.

## Positioning

Sakarya merkezli, fikirden teslime kadar tek elden yürüyen prodüksiyon akışı: keşif,
planlama, çekim, kurgu, renk ve teslim aynı ekipte kalır ve projenin muhatabı süreç
boyunca değişmez. Ajans zinciri veya freelancer havuzu değil; sahaya yakın, yerinde
çekim yapan tek bir ekip.

Tek çekim gününden birden çok formatın (ana film + dikey kesit + drone planı) baştan
planlanarak çıkarılması, tekrarlanan ve doğrulanabilir bir üretim yaklaşımı.

## Operating Context

- Merkez: Serdivan, Sakarya. Yerinde çekim bölgesi: Sakarya ve ilçeleri, Kocaeli,
  Gebze, Düzce, Bolu, Bilecik.
- Tipik teslim süresi: kapsama göre genellikle 2–4 hafta.
- Teslim formatları: 16:9 yatay (web/YouTube), 9:16 dikey (Reels/Shorts), reklam kesitleri.
- Site canlıda; geliştirme kenardan (incremental) yürüyor, kırıcı değişiklikten kaçınılır.

## Capabilities and Constraints

Onaylı hizmetler (içerik koleksiyonunda tanımlı):
- Video Prodüksiyon — reklam/marka filmi, ürün ve kurumsal çekim, medikal tanıtım
- Kreatif Strateji & Yönetim — içerik/kampanya stratejisi, senaryo, sosyal medya yönetimi
- Post-Prodüksiyon & Kurgu — kurgu, renk düzenleme, motion graphics, ses tasarımı, VFX

Ayrıca sitede üretim alanı olarak beyan edilen: video, fotoğraf, içerik, AI
(kullanıcı tarafından 2026-08-16'da onaylandı).

Teknik kısıtlar:
- Astro; içerik `src/content/*` altında Markdown + Zod şeması ile.
- Fontlar Fontsource'tan self-host (KVKK + performans); Google'a istek gitmez.
- 110 yerel SEO landing page (22 bölge × 5 hizmet) canlıda ve korunmalı.
- Görsellerde `alt` ve boyut/aspect-ratio zorunlu (CLS).
- `prefers-reduced-motion` desteği zorunlu.

Açıkça karara bağlanmamış / iddia edilmemesi gerekenler:
- İstanbul veya "worldwide" hizmet iddiası **doğrulanmadı** — kullanılmayacak.
- Fiyat, ödül, müşteri yorumu, sertifika: sitede yok, uydurulmayacak.
- TikTok / X profilleri: doğru URL'ler yok.

## Brand Commitments

- İsim: Rast Creative Studio (kısa: Rast Creative). Marka tanımı: Creative Production Studio.
- Ana mesaj / manifesto: **"İyi iş kendini izletir."** (2026-08-16'da onaylandı)
- Ses tonu: sıcak, doğrudan, gözlemci; ajans klişesi ve şişirilmiş iddia yok.
  Birinci çoğul "biz" (kurumsal değil, samimi ekip sesi), ikinci çoğul "siz".
- Dil: içerik Türkçe, kod ve değişken adları İngilizce.
- Blog yazarı: Berat Değirmenci.
- İletişim: Serdivan/Sakarya · 0543 838 2404 · studio@rastcreative.com
- Doğrulanmış sosyal: Instagram (@rastcreative), YouTube (@RastCreativeStudio).

## Evidence on Hand

- 38 gerçek proje kaydı (`src/content/projects/`), 13 marka; her biri gerçek
  YouTube ID, kapak görseli, süre ve müşteri adı taşıyor.
- 7 proje `featured: true` — ana sayfada kanıt olarak kullanılabilir.
- 17 gerçek müşteri logosu (`LogoWall`).
- 6+ blog yazısı, gerçek üretim deneyiminden yazılmış.
- Site içi fotoğraflar: `src/assets/photos/` (set, ekip, drone, dikey içerik).
- Rakamlar içerikten türetiliyor (marka sayısı, içerik sayısı) — elle bakım yok,
  bu yüzden asla bayatlamaz.

## Product Principles

1. **Lead her şeyin önünde.** Her karar "Ücretsiz Ön Görüşme" adımına katkısına göre
   değerlendirilir; ikinci öncelik portföy ve prestij.
2. **Kanıt iddiadan güçlüdür.** Gerçek iş, gerçek marka, gerçek rakam gösterilir;
   sıfat yığmak yerine işin kendisi konuşur.
3. **Uydurma yok.** Repo, müşteri beyanı ve doğrulanmış kaynak dışında hiçbir sonuç,
   ödül, yorum, fiyat veya bölge iddia edilmez.
4. **Canlı siteye saygı.** Değişiklikler kenardan, geri alınabilir ve kırıcı olmayacak
   şekilde yapılır; SEO altyapısı korunur.
5. **Erişim pazarlıksız.** Reduced-motion, klavye erişimi, kontrast ve mobil
   davranış hiçbir görsel hedef için feda edilmez.

## Accessibility & Inclusion

- Hedef kitle 35+ ağırlıklı: gövde metni minimum 18px, cömert satır yüksekliği,
  dokunma hedefi minimum 48px.
- Metin/zemin kontrastı WCAG AA.
- `prefers-reduced-motion: reduce` durumunda dekoratif hareket durur, içerik
  tam erişilebilir kalır.
- JS olmadan da içerik görünür kalır.
