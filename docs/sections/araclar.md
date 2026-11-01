# Araçlar (/araclar/)

Ücretsiz, bağlantı kazandırmak için yapılmış tarayıcı araçları. Fiyat yok, kayıt yok, üçüncü taraf script yok.

## /araclar/guvenli-alan/ — Reels / TikTok / Shorts güvenli alan kontrolü (2026-10-30)
- Sayfa: `src/pages/araclar/guvenli-alan.astro` (vanilla TS `<script>`, tek `<canvas>` 1080×1920). Dosya tarayıcıda açılır, sunucuya gitmez.
- Veri: `src/data/safe-zones.json` (platform başına üst/alt/sol/sağ px + sağ buton sütunu + yorum yanıtı etiketi). Tablo, araç ve şablonlar aynı veriden beslenir; değer değişirse JSON'u düzenle.
- Şablonlar: `python3 scripts/generate-safe-zone-templates.py` → `public/araclar/guvenli-alan/rast-guvenli-alan-<id>-1080x1920.png` + `rast-guvenli-alan-sablonlari.zip` (OKU-BENI.txt, LISANS.txt) + `rast-logo-beyaz.png` (dışa aktarma imzası). JSON değişince scripti çalıştır, PNG'leri commit'le.
- Marka: her şablon ve "PNG olarak indir" çıktısında alt arayüz bandında küçük, %60 opak Rast imzası; PNG metadata (Author/Source/License). Lisans CC BY 4.0.
- Değerler yaklaşık; kaynaklar sayfadaki "Kaynaklar ve notlar" bölümünde (Meta Ads Guide, Google Ads Help, TikTok Ads Manager, topluluk ölçümleri, kendi ölçümümüz). Arayüz değişince yeniden kontrol et.
- İç linkler: footer "Araçlar", `/sosyal-medya-icerigi/` rehber linkleri (`service-hub.ts`), iki blog yazısı, llms.txt / llms-full.txt.

## Görsel galeri ve araç-önce sayfa düzeni (2026-10-30)
Bewo geri bildirimi: "çok yazı tabanlı, ne olduğu anlaşılmıyor". Yeni düzen:
- Veri tek yerde: `src/data/araclar.ts` (slug, href, kısa başlık, tür ARAÇ/ŞABLON/BELGE/PAKET/REHBER, 3–5 kelime fayda, tek satır amaç, çipler). /araclar/ galerisi, ItemList JSON-LD, ToolHeader ve alt şerit buradan beslenir. Yeni araç = buraya bir kayıt + kart görseli.
- Bileşenler (`src/components/araclar/`): `ToolCard` (önizleme + rozet + fayda + çipler + Aç/İndir), `ToolHeader` (kırıntı, rozet, H1 aynen korunur, amaç, çipler, ana CTA; eski giriş paragrafı "Ayrıntılar" altında katlı; sağda kart önizlemesi — araçlarda 1000px altı gizli), `ToolFaq` (<details> akordeon; FAQPage metni HTML'de kalır), `MoreTools` ("Diğer ücretsiz araçlar", 4 kart, telefonda yatay kaydırma). Ortak stil `src/styles/araclar.css` (adım kartları `.at-steps`, katlanır bölüm `.at-fold`).
- Kaynaklar / Kaynak göster / In English bölümleri `<details class="at-fold">` içinde (silinmedi). Eski "İlgili araçlar" link listeleri şeritle değişti (`data/belgeler/kardes-araclar.ts` artık kullanılmıyor; sayfaların `related` prop'u zararsız).
- Galeri filtresi yalnızca CSS (radyo + `:has`); JS yok, destek yoksa her kart görünür.
- Kart görselleri: `public/araclar/kartlar/<slug>.webp` (960×720) + `-480.webp`. Üretim: build → `python3 -m http.server <port> --directory dist` → `python3 scripts/araclar-kartlar/kartlar.py http://127.0.0.1:<port>`. Script her aracı headless Chromium'da kullanım alanına uygun Pexels karesiyle (konuşan kafa, ızgara kapakları, 4K kare; liste ve lisans: `docs/sections/araclar-gorseller.md`)/SRT/plan ile çalıştırıp yakalar, belgelerde PDF sayfa önizlemelerini, LUT'ta önce/sonra, SFX'te ffmpeg dalga formunu koyu sinematik karta yerleştirir. Araç arayüzü değişince yeniden çalıştır.
- Ana sayfaya araç şeridi eklenmedi: evren sahne akışı lead odaklı; footer'daki "Araçlar" linki yeterli.

## English twins (/en/tools/, 31.10.2026)
- Routes: `/en/tools/` (gallery) + `reels-safe-zone-checker`, `video-bitrate-calculator`, `aspect-ratio-calculator`, `srt-subtitle-checker`, `free-sound-effects-pack`, `free-lut-pack`. Pairs live in `src/lib/i18n.ts` (`TR_TO_EN`); BaseLayout derives `lang` from the path (`/en/` → `en`) and emits reciprocal hreflang (tr, en, x-default → en) for every pair.
- One page body per tool: `src/components/araclar/tools/<Name>.astro` with a `lang` prop; `src/pages/araclar/<slug>.astro` and `src/pages/en/tools/<slug>.astro` are 3-line wrappers. TR copy stays the original text inside `en ? (EN) : (TR)` blocks; client scripts pick strings with `L(tr, en)` from `document.documentElement.lang` (safe-zone uses a `data-i18n` JSON).
- English cards: `en` field per entry in `src/data/araclar.ts` (`ARACLAR_EN`, `localize`); ToolHeader/ToolCard/MoreTools/Extras switch labels by href or `lang`. Header/footer show English labels on `/en/` (links still go to TR pages; CTA = email). Footer on TR pages has "Free tools (English)".
- Downloads are the same files (TR file names). Card images still show Turkish sample text: English captures are a follow-up.

## Gömülebilir araçlar + atıf kodları (/embed/, 1.11.2026)
- Rotalar: `/embed/<tr-slug>/` ve `/en/embed/<en-slug>/` (güvenli alan, bitrate, en-boy oranı, altyazı kontrolü). Liste + varsayılan iframe yüksekliği: `src/data/embeds.ts`; sayfalar `src/pages/embed/[slug].astro`, `src/pages/en/embed/[slug].astro`.
- Aynı araç bileşeni `embed` prop'uyla render edilir: `src/layouts/EmbedLayout.astro` (header/footer/çerez bandı/GA yok, `noindex, follow`, canonical → tam araç sayfası, sabit alt bant "Powered by / Ücretsiz araç: Rast Creative Studio" → tam sayfa, `target=_blank rel=noopener`, nofollow YOK). Bileşende ToolHeader, nasıl kullanılır adımları ve ilk Section'dan sonraki her şey `!embed` ile gizli.
- Yükseklik: sayfa `{type:"rast-embed-height", height, path}` postMessage gönderir; gömme kutusundaki "Otomatik yükseklik" seçeneği küçük bir dinleyici betik ekler (origin kontrolü `https://rastcreative.com`).
- Çerçeveleme yalnızca bu klasörlerde açık: `public/embed/.htaccess` + `public/en/embed/.htaccess` X-Frame-Options'ı kaldırır; kök .htaccess'teki SAMEORIGIN diğer her yerde geçerli. Sitemap filtresi (`astro.config.mjs`) `/embed/` ve `/en/embed/` yollarını dışlar.
- Tam araç sayfalarında araçtan hemen sonra `EmbedBox` ("Bu aracı sitene göm / Embed this tool"): tek satır iframe + `<p>Araç: <a href="…/araclar/<slug>/">Rast Creative Studio</a></p>` (yalnız marka adı anchor).
- İndirme sayfalarında (belgeler/BelgeSayfasi, Extras kullanan şablonlar, güvenli alan, LUT, SFX; TR+EN) "Kaynak göster" katlamasının içinde `CcByAttribution`: CC BY 4.0 atıf HTML'i (marka anchor + lisans linki) + kopyala düğmesi. Yeni araç gömülecekse: `embeds.ts` kaydı + bileşene `embed` desteği (aynı desen) + EmbedBox.

## /araclar/webp-jpg-cevirici/ + /en/tools/webp-to-jpg/ — toplu resim dönüştürücü (1.11.2026)
- Bileşen `src/components/araclar/tools/WebpJpgCevirici.astro` (lang + embed). WebP/AVIF/PNG/JPG/GIF/BMP/SVG → JPG/PNG/WebP, kalite, en fazla genişlik, tek tek ya da ZIP (bağımlılıksız STORE zip yazıcı, UTF-8 adlar). Dosya türü baytlardan okunur (".jpg" adlı WebP, HEIC uyarısı); format+boyut aynıysa orijinal dosya aynen verilir; JPG'de şeffaflık beyaz; SVG ≥1024 px; hareketli GIF/WebP ilk kare. Yapıştırma (Ctrl+V) destekli. Yükleme yok.
- PixSwap Chrome eklentisinin (repo `bewoai/pixswap-extension`, private) web aracı; eklenti bölümü sayfada "incelemede" diyor — yayınlanınca Chrome Web Mağazası linkini `cv-ext` bloğuna ekle. Gizlilik politikası `/en/tools/pixswap-privacy/` (eklentideki PRIVACY.md ile aynı metin; iki yerde birlikte güncelle).
- Örnek görsel `public/araclar/webp-jpg-cevirici/rast-ornek-istanbul.webp` (Pexels; `rast-` öneki + kök .htaccess no-transform FilesMatch'e `webp` eklendi, CDN yeniden kodlamasın — mağaza inceleyicisi bu WebP'ye sağ tıklıyor).
- Gömme: `/embed/webp-jpg-cevirici/`, `/en/embed/webp-to-jpg/` (embeds.ts). Kart: kartlar.py `cevirici` yakalaması + `webp-jpg-cevirici` kartı (TR + EN), fotoğraflar kaynaklar.json `cv-*`.
