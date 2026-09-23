# Evren — görsel üretim listesi (GPT Image 2 → Kling)

Akış: görseli GPT Image 2 ile üret → bana gönder → onaylanan kareyi Kling
`image_to_video` ile 5–10 sn'lik sessiz döngüye çeviririm → siteye `webm` + `mp4`
olarak girer. Video çevrilmeyecek kareler durağan görsel olarak kullanılır.

## Ortak stil çapası

Her promptun **başına** bunu ekle; evrenin tutarlı görünmesi buna bağlı.

```
Minimal cinematic still, pale warm-grey fog atmosphere (#E9E8E5), fine 35mm film
grain, near-monochrome palette with a single warm amber (#E25303) light source,
generous negative space, soft diffused light, shallow depth of field, weightless and
calm, premium editorial aesthetic. No text, no logos, no watermark, no people.
```

İpucu: 1 numarayı önce üret. Beğendiğin küreyi **referans görsel** olarak diğerlerine
ver ("same glowing sphere as the reference"), böylece küre her karede aynı kalır.

## 1 — Hero: Rast güneşi *(videoya çevrilecek)*
Boyut: **1536×1024** (masaüstü) + aynı sahnenin **1024×1536** dikey versiyonu (mobil).

```
A single luminous sphere floating in pale grey fog. The sphere is frosted glass
with a glowing amber core, like a small sun seen through mist. Faint concentric
halo rings and soft volumetric rays dissolve into the haze. The sphere fills about
18% of the frame and sits right of center at eye level; the left half of the frame
is empty soft fog for typography. A barely visible horizon line. Dreamlike, still.
```
Dikey versiyon: *"…the sphere sits in the upper third, the lower 60% is empty fog."*

Kling hareketi (bilgi için): küre yavaşça nefes alır (parlaklık ±), sis soldan sağa
süzülür, kamera sabit, başı ve sonu aynı kare → kesintisiz döngü.

## 2 — Föy bölümü: şafak *(videoya çevrilecek)*
Boyut: **1536×1024**

```
The same glowing sphere seen closer, at dawn. The fog is thinner and warmer, the
amber core brighter as if the sun is rising behind it. Sphere at bottom center,
partly below the frame edge; the top 60% is empty luminous haze.
```

## 3–6 — Yörünge durakları *(durağan; istersen sonra hafif hareket)*
Boyut: **1024×1024**. Obje merkezde, etrafı boş sis. Dördü aynı ışık ve açıyla.

**3 · Fikir**
```
A single sheet of paper floating in fog, with a loose graphite pencil sketch of a
film frame on it: a rectangle, rule-of-thirds lines and a small arrow. A pencil
lies diagonally across the page. Edges of the paper fade into the mist.
```

**4 · Set**
```
A cinema camera on a tripod standing alone in pale fog, three-quarter view, matte
black body, a tiny amber tally light glowing. The silhouette is softened by haze.
```

**5 · Kurgu**
```
A loop of 35mm film strip floating and gently curling in the fog. The frames are
slightly translucent, and warm amber light passes through them.
```

**6 · Teslim**
```
Two floating glass screens in fog, one horizontal 16:9 and one vertical 9:16, both
blank and glowing softly with warm white light, with subtle reflections. Weightless.
```

## 7 — Sis dokusu *(videoya çevrilecek, bölüm arka planı)*
Boyut: **1536×1024**

```
Seamless abstract texture of pale grey fog and fine film grain, no subject, a very
subtle light gradient from the upper right. For a website background.
```

## Teslim
PNG olarak, numarasıyla adlandır (`01-hero-yatay.png`, `01-hero-dikey.png`,
`02-safak.png` …). Sohbete sürükleyip bırakman yeterli.

Kling kredi tahmini (686 kredi var): 4 video (hero yatay, hero dikey, şafak, sis) ×
~5 sn. Hangi model ve ayarla üreteceğimi üretimden önce sana söyleyip onay alacağım.

## Videolar (2026-09-23)

Kling web'de kullanıcı tarafından üretildi: Kling 2.6, 1080p, 5 sn, ilk kare = son
kare (kesintisiz döngü), ses yok. Yukarıdaki promptlar kullanıldı.

| Dosya | Kaynak | webm | mp4 |
|---|---|---|---|
| `public/evren/hero.*` | 1916×1080 → 1600w | ~112 KB | ~500 KB |
| `public/evren/hero-dikey.*` | 1176×1764 → 900w | ~92 KB | ~376 KB |
| `public/evren/safak.*` | 1916×1080 → 1600w | ~144 KB | ~512 KB |

Encode: VP9 CRF 28 / H.264 CRF 22, 24 fps, ses kanalı silindi. Döngü dikişi
(ilk/son kare PSNR) 33–39 dB, gözle fark edilmiyor. Videolar yalnızca ekrandayken
oynar; `prefers-reduced-motion` açıksa poster (webp) kalır.
