# Araçlar (/araclar/)

Ücretsiz, bağlantı kazandırmak için yapılmış tarayıcı araçları. Fiyat yok, kayıt yok, üçüncü taraf script yok.

## /araclar/guvenli-alan/ — Reels / TikTok / Shorts güvenli alan kontrolü (2026-10-30)
- Sayfa: `src/pages/araclar/guvenli-alan.astro` (vanilla TS `<script>`, tek `<canvas>` 1080×1920). Dosya tarayıcıda açılır, sunucuya gitmez.
- Veri: `src/data/safe-zones.json` (platform başına üst/alt/sol/sağ px + sağ buton sütunu + yorum yanıtı etiketi). Tablo, araç ve şablonlar aynı veriden beslenir; değer değişirse JSON'u düzenle.
- Şablonlar: `python3 scripts/generate-safe-zone-templates.py` → `public/araclar/guvenli-alan/rast-guvenli-alan-<id>-1080x1920.png` + `rast-guvenli-alan-sablonlari.zip` (OKU-BENI.txt, LISANS.txt) + `rast-logo-beyaz.png` (dışa aktarma imzası). JSON değişince scripti çalıştır, PNG'leri commit'le.
- Marka: her şablon ve "PNG olarak indir" çıktısında alt arayüz bandında küçük, %60 opak Rast imzası; PNG metadata (Author/Source/License). Lisans CC BY 4.0.
- Değerler yaklaşık; kaynaklar sayfadaki "Kaynaklar ve notlar" bölümünde (Meta Ads Guide, Google Ads Help, TikTok Ads Manager, topluluk ölçümleri, kendi ölçümümüz). Arayüz değişince yeniden kontrol et.
- İç linkler: footer "Araçlar", `/sosyal-medya-icerigi/` rehber linkleri (`service-hub.ts`), iki blog yazısı, llms.txt / llms-full.txt.
