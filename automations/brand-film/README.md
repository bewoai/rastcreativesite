# Dikey tanıtım filmi — "İyi iş kendini izletir."

Rast Creative Studio'yu, hikâyesini ve ne yaptığını anlatan **9:16 motion graphic film**.
Reels / Shorts / TikTok için: 1080×1920, 30 fps, 65 sn, H.264 + AAC, sesli.

Çıktı: [`out/rast-creative-tanitim-dikey.mp4`](out/rast-creative-tanitim-dikey.mp4)
(~48 MB, 6 Mbps tavanlı H.264) · Reels kapağı: [`out/kapak.jpg`](out/kapak.jpg) (57,8. sn, manifesto)

Film tamamen kodla üretilir: sahne HTML/CSS, hareket `timeline.js`, müzik ve ses
efektleri `soundtrack.js` (WebAudio ile sentez, lisanslanacak örnek ses yok).
Görseller sitenin kendi dosyalarıdır (fontlar, fotoğraflar, logolar, gerçek iş klipleri);
hiçbir şey kopyalanmaz, repo kökünden okunur.

## Görsel dil

Canlı sitenin "Evren" dili (`src/styles/evren.css`, `docs/sections/evren-tasarim-kararlari.md`):
sis, tek ışık kaynağı olarak **Rast güneşi**, Fraunces başlıklar + kalın Inter arayüz,
her yüzey sis camı, Roma rakamlı bölüm etiketleri. Amber yalnızca ışık ve aksan.

Filmin omurgası güneştir: gün doğumuyla açılır, logodaki "ra**.**st" noktasına iner,
bölümler boyunca sağ üstte anahtar ışık olur, karanlık "işler" bölümünden şafakla çıkar,
haritada Serdivan pini olur, manifestonun arkasında doğar ve kapanışta tekrar logonun
noktasına oturur.

## Akış (96 BPM · 1 ölçü = 2,5 sn)

| # | Zaman | Sahne | Ne anlatıyor |
|---|---|---|---|
| I | 0–5 | Kanca | "Kaydır. Kaydır. Kaydır." — akış durur, gerçek bir işte (Duru Optik gün doğumu) durur: **"Bazı işler durdurur."** |
| II | 5–10 | Marka | Işık patlaması → sis; güneş küçülüp logodaki noktaya iner, harfler noktadan doğar. "Sakarya merkezli video prodüksiyon stüdyosu" |
| III | 10–17,5 | Biz kimiz | "Ajans zinciri değil. Freelancer havuzu değil. Sahaya yakın, tek bir ekip." · iki kurucu ortak · "Projenizi doğrudan kurucu ortaklarla konuşursunuz." |
| IV | 17,5–27,4 | Süreç | Kurgu zaman çizelgesi arayüzü: Fikir → Set → Kurgu → Teslim, playhead ilerler; teslim dosyaları onaylanır. "Genellikle 2–4 hafta" |
| V | 27,4–35 | Tek çekim günü | Gerçek set karesi 16:9 → 4:5 → 9:16 yeniden kadrajlanır, üç format dışa aktarılır. + Reklam versiyonları, + Fotoğraf |
| VI | 35–42,5 | Ne yapıyoruz | Üç hizmet kartı (Video Prodüksiyon · Kreatif Strateji · Post-Prodüksiyon), içerik koleksiyonundaki özelliklerle |
| VII | 42,5–50 | İşler | Karanlık bant: 12 gerçek proje klibinden eğik duvar · **15+ marka · 100+ içerik** · "fabrikadan kliniğe, mağazadan sahneye." · 17 markalık logo levhası + "sizin markanız" |
| VIII | 50–55 | Bölge | Şafak → gerçek koordinatlarla harita: Serdivan merkez; Kocaeli, Düzce, Gebze, Bolu, Bilecik |
| IX | 55–65 | Manifesto + CTA | "İyi iş / kendini / *izletir.*" — her kelime bir akor · "Bize projenizden bahsedin." · Ücretsiz ön görüşme butonuna dokunuş · telefon, e-posta, Instagram · logo kapanışı |

Reels arayüzü alt ~300 px'i kapattığı için kritik metin ve CTA 250–1600 px bandında tutuldu.

## İddiaların kaynağı (uydurma yok)

| Filmde | Kaynak |
|---|---|
| "İyi iş kendini izletir." | `PRODUCT.md` — onaylı manifesto |
| Serdivan / Sakarya, yerinde çekim bölgesi | `PRODUCT.md` → Operating Context |
| Ajans zinciri / freelancer havuzu değil, muhatap değişmez | `PRODUCT.md` → Positioning |
| Kurucu ortaklarla doğrudan görüşme, isimler, fotoğraflar | `src/pages/hakkimizda.astro` |
| Aşamalar ve metinleri, "genellikle 2–4 hafta" | `src/pages/taslak/index.astro`, `src/content/faq/01-teslim-suresi.md` |
| 16:9 / 9:16 / reklam kesitleri, tek çekim gününden çok format | `PRODUCT.md`, ana sayfa "Bir set, çok kadraj." bölümü |
| Hizmetler ve alt başlıkları | `src/content/services/*.md` |
| Film · Fotoğraf · İçerik · AI | `PRODUCT.md` (2026-08-16 onay) |
| 15+ marka | yayındaki projelerin müşteri sayısı (`groupByBrand`, sitedeki hero ile aynı hesap) |
| 100+ içerik | sitede yayında olan rakam (hero + Hakkımızda) |
| Logolar | ana sayfa "Markalar" levhası (`src/assets/logos/`) |
| İletişim | `src/consts.ts` → `CONTACT`, `SOCIAL` |

Fiyat, ödül, müşteri yorumu, İstanbul/"worldwide" iddiası **yok**.

## Yeniden üretmek

```bash
cd automations/brand-film
npm i --no-save playwright-core        # package.json'a yazılmaz; site bağımlılığı değil
npx playwright install chromium        # ya da CHROMIUM=/yol/chrome
node prepare.mjs                        # proje kliplerini kare dizisine çevirir (.cache/)
node render.mjs --stills 3.9,8.9,57.8   # kontrol kareleri → .cache/stills/
node render.mjs                         # tam film → out/rast-creative-tanitim-dikey.mp4
```

- `FFMPEG` (libx264 gerekli) ve `CHROMIUM` ortam değişkenleri ikili dosya yolunu değiştirir.
- Canlı önizleme (sesli): repo kökünde `python3 -m http.server 8080`, sonra
  `http://localhost:8080/automations/brand-film/composition.html?preview` (▶︎ ile oynat, çubukla gez).
  Önizleme de `prepare.mjs` ile üretilen `.cache/clips` karelerini kullanır.
- Render 4 çekirdekte birkaç dakika sürer; `.cache/frames` varsa yalnızca eksik kareler
  çizilir (`--force` hepsini yeniden çizer, `--audio` müziği yeniden üretir).

## Dosyalar

- `composition.html` — sahne, tipografi, malzeme (1080×1920)
- `timeline.js` — zaman çizelgesi; her kare `t`'nin saf fonksiyonu
- `soundtrack.js` — müzik + ses efektleri (OfflineAudioContext → WAV)
- `clips.mjs` — kullanılan gerçek proje klipleri ve kesim noktaları
- `prepare.mjs` / `render.mjs` — kare dizisi çıkarma ve render hattı

Bu klasör sitenin build'ine girmez (Astro yalnızca `src/` ve `public/` okur).
