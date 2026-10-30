# Üretim belgeleri (/araclar/ — 2026-10-30)

Ücretsiz, bağlantı kazandırmak için yapılmış beş sayfa. Fiyat/maliyet yok, kayıt yok, üçüncü taraf script yok. Lisans CC BY 4.0.

| Sayfa | İçerik | Dosyalar (`public/araclar/<slug>/`) |
|---|---|---|
| `/araclar/storyboard-sablonu/` | Storyboard 16:9 + 9:16 (güvenli alan çizgili), plan listesi (shot list) + kısaltma sayfası | PDF (doldurulabilir) ×3, XLSX (açılır listeli), CSV, DOCX, Notion MD, ZIP |
| `/araclar/brief-formu/` | Müşteri video brief formu (7 bölüm, 3 sayfa) | PDF (doldurulabilir), DOCX, MD, ZIP |
| `/araclar/cekim-kontrol-listesi/` | 10 bölüm, 47 madde çekim günü kontrol listesi | PDF (doldurulabilir), XLSX (durum listesi + renk), CSV, DOCX, MD, ZIP |
| `/araclar/cekim-izin-formu/` | Görüntü ve ses kullanım izin formu, KVKK taslağı: Bölüm A aydınlatma, Bölüm B açık rıza (ayrı imza, Kurul 2026/347), Bölüm C 18 yaş altı veli onayı | PDF (doldurulabilir), DOCX, MD, ZIP |
| `/araclar/cekim-plani/` | Tarayıcıda çekim planı / call sheet oluşturucu: proje, lokasyon, ekip, oyuncu, saat programı, ekipman → `window.print` ile markalı PDF, JSON indir/yükle, localStorage otomatik kayıt. Maliyet alanı bilerek yok. | örnek PDF + örnek JSON, `rast-logo-koyu.png` (baskı logosu) |

## Nasıl üretilir
- İçerik tek kaynak: `scripts/belgeler/content.py` (bloklar). Üretici: `scripts/belgeler/generate.py`
  (`~/.hermes/tools/uv-0.13.5-linux-x64/uv run --with pymupdf --with python-docx --with openpyxl --with pillow python scripts/belgeler/generate.py`).
  HTML (sabit A4 sayfalar, site fontları, koyu logo) → headless Chromium PDF → PyMuPDF form alanları (Chromium'un ölçtüğü konumlara) → önizleme WebP; aynı bloklardan DOCX, MD, XLSX/CSV, ZIP (OKU-BENI.txt). Sayfa taşması varsa script `PROBLEMS` yazıp çıkış 2 verir.
- Sayfaların gösterdiği liste/özet `src/data/belgeler/<slug>.json` (scriptin çıktısı) — elle düzenleme, content.py'yi düzenle.
- Çekim planı örnek PDF'i, BUILD edilmiş sayfadan basılır: `npx astro build`, `dist/`i yerel sunucuyla aç, `generate.py --plan-ornek http://127.0.0.1:<port>` (sayfa `?ornek=1&baski=1` ile örnek veriyi yükleyip baskı görünümünü hazırlar). Örnek veri: `src/data/belgeler/ornek-cekim-plani.json`.
- Ortak sayfa iskeleti: `src/components/araclar/BelgeSayfasi.astro` (+ `BelgeIndir.astro`): indirme butonları (boyutlar build'de okunur, dosya yoksa build hata verir), önizlemeler, HowTo + FAQPage JSON-LD (görünür metinle aynı), "Kaynak göster" (marka adı link metni), ilgili araçlar. İlgili araçlar `src/data/belgeler/kardes-araclar.ts`: yalnızca `src/pages`/`src/content`'te var olan rotalar listelenir, henüz yayınlanmamış kardeş araç kırık link olmaz.

## Dikkat
- İzin formu genel taslaktır, hukuki danışmanlık değildir; sayfada ve her PDF sayfasında uyarı var. Sağlık/hasta çekimleri kapsam dışı. Mevzuat değişirse "Kaynaklar ve dayanak" bölümünü ve `content.py` `IZIN` bloklarını birlikte güncelle.
- PDF form alanları Helvetica ile açılır; Türkçe karakterler Acrobat/Chromium'da doğru görünüyor, bazı mobil görüntüleyiciler alan kaydetmeyebilir (SSS'de Word önerisi var).
