# /araclar/ kart ve örnek görselleri — kaynaklar

Bewo geri bildirimi (30.10.2026): kartlar hep aynı etkinlik/BTS fotoğrafını kullanıyordu; her kart kendi kullanım alanını göstermeli (güvenli alan için konuşan kafa vb.). Belgeler ortalı değildi.

## Kural
- Her kartta farklı fotoğraf (aynı anahtar iki kartta kullanılmaz). Liste: `scripts/araclar-kartlar/kaynaklar.json`.
- Kaynak sırası: (1) sitede zaten yayınlı kendi görüntümüz, (2) Pexels/Unsplash ücretsiz lisans, (3) yapay zekâ (ücretli çağrı yok). Bu turda proje sayfalarındaki konuşan kafa kareleri müşteri yüzleri olduğu için kullanılmadı; hepsi Pexels.
- Lisans: Pexels License — ticari kullanım serbest, atıf gerekmez; tanınmış kişi/marka/logo içeren kareler seçilmedi. Kontrol tarihi 2026-10-30.
- Ekrandaki Türkçe kanca/altyazı metinleri `kartlar.py` içinde HTML ile basılır (Space Grotesk, latin-ext), kapak başlığı araç içinde `toLocaleUpperCase('tr')` ile.
- Güvenli alan aracındaki **Örnek kareyle dene** düğmesi `public/araclar/guvenli-alan/rast-ornek-kare-1080x1920.jpg` dosyasını yükler (script üretir).
- Belge kartları: iki sayfa flex ile ortalanır, sayfa tam görünür, hafif simetrik perspektif, gerçek masa fotoğrafı arka planda. Hizalama sayısal kontrol edilir (getBoundingClientRect; sol/sağ boşluk farkı ≤4 px).

## Üretim
```
npx astro build
python3 -m http.server <port> --bind 127.0.0.1 --directory dist   # arka planda
python3 scripts/araclar-kartlar/kartlar.py http://127.0.0.1:<port>          # her şey
python3 scripts/araclar-kartlar/kartlar.py http://127.0.0.1:<port> all      # yalnızca kart kompozisyonu
```
Pexels kareleri `scripts/araclar-kartlar/.cache/` içine indirilir (gitignore).

## Kaynak listesi

- `th-reels` — guvenli-alan (Reels) + tool sample 'Örnek kareyle dene': “Woman Talking In Front of the Camera” — https://www.pexels.com/video/8048443/ (stok videonun poster karesi)
- `th-tiktok` — guvenli-alan (TikTok): “Man Talking While Looking at Camera” — https://www.pexels.com/video/8360267/ (stok videonun poster karesi)
- `th-altyazi` — altyazi-kontrolu: “Woman Talking while Sitting” — https://www.pexels.com/video/5147319/ (stok videonun poster karesi)
- `th-kapak` — kapak-sablonlari (Reels kapağı): “A Man Vlogging” — https://www.pexels.com/video/8135595/ (stok videonun poster karesi)
- `th-youtube` — kapak-sablonlari (YouTube küçük resim): “A Woman Explaining while Doing Hand Gestures” — https://www.pexels.com/video/8136027/ (stok videonun poster karesi)
- `th-enboy` — en-boy-orani: “Man Talking While Looking at Camera” — https://www.pexels.com/video/8135343/ (stok videonun poster karesi)
- `g-th1` — instagram-grid-sablonu: “Close Up Video of a Woman Wearing Hijab Talking” — https://www.pexels.com/video/8685427/ (stok videonun poster karesi)
- `g-th2` — instagram-grid-sablonu: “Woman Smiling and Looking at the Camera” — https://www.pexels.com/video/8202010/ (stok videonun poster karesi)
- `g-th3` — instagram-grid-sablonu: “Man Talking to Camera” — https://www.pexels.com/video/7262665/ (stok videonun poster karesi)
- `g-urun` — instagram-grid-sablonu: “Woman Vlogging About Her Product” — https://www.pexels.com/video/7668404/ (stok videonun poster karesi)
- `g-burger` — instagram-grid-sablonu: “Burger on Black Background” — https://www.pexels.com/photo/28272159/
- `g-latte` — instagram-grid-sablonu: “Close-up of Latte Art in a Cozy Coffee Shop” — https://www.pexels.com/photo/30157168/
- `g-pasta` — instagram-grid-sablonu: “Assorted Pastries and Croissants in Bakery Display” — https://www.pexels.com/photo/35183327/
- `g-cilt` — instagram-grid-sablonu: “Elegant Minimalist Skincare Product Flatlay” — https://www.pexels.com/photo/34939703/
- `g-istanbul` — instagram-grid-sablonu: “Bustling Street Scene in Historic Istanbul” — https://www.pexels.com/photo/35611167/
- `lut` — lut-paketi (önce/sonra, rast-soguk-gece): “Golden Hour Portrait of Woman Outdoors” — https://www.pexels.com/photo/29415527/
- `bitrate` — bitrate-hesaplayici (4K kare): “Scenic Road Trip through Mountainous Landscape” — https://www.pexels.com/photo/35746669/
- `export` — video-export-ayarlari (kurgu ekranı): “Professional Video Editing Interface on Computer Screen” — https://www.pexels.com/photo/31718971/
- `planlayici` — cekim-planlayici (masa): “Dark Office Workspace with Laptop and Notebook” — https://www.pexels.com/photo/38041122/
- `d-storyboard` — storyboard-sablonu (masa): “A Grayscale of a Clapperboard beside Camera Lens” — https://www.pexels.com/photo/5627838/
- `d-brief` — brief-formu (masa): “Black Notebook and Pen Near a Laptop on the Wooden Surface” — https://www.pexels.com/photo/5827789/
- `d-checklist` — cekim-kontrol-listesi (ekipman): “Traveler Equipment on Black Background Flat Lay” — https://www.pexels.com/photo/7263910/
- `d-izin` — cekim-izin-formu (masa): “Wooden Table with Laptop and a Cup of Coffee on Top” — https://www.pexels.com/photo/5827790/
- `d-plan` — cekim-plani (masa): “Cup of Coffee on a Dark Wooden Surface” — https://www.pexels.com/photo/15404793/
