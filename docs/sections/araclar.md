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
