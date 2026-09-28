# Hero showreel — buraya koy

Hero/header arkaplanında oynayan sessiz loop. İki dosya gerekiyor (ikisi de bu klasöre):

    public/videos/showreel.webm
    public/videos/showreel.mp4

Poster (ilk kare / güçlü bir still) ise: `src/assets/photos/showreel-poster.jpg`
olarak verirsen onu optimize edip poster yaparım (şu an geçici olarak hero-cinema.jpg kullanılıyor).

## Üretim için kesin değerler

- **En-boy:** 16:9 (yatay). Önemli aksiyonu ORTADA tut — telefon kenarları kırpar.
- **Çözünürlük:** 1920×1080 (ideal). Daha hafif istersen 1280×720 da yeterli
  (arkada scrim + yazı olduğu için 720p fark etmez, dosya çok küçülür).
- **Süre:** 12–20 sn, **kesintisiz loop** (ilk ve son kare uyumlu olsun).
- **FPS:** 24 veya 30.
- **Ses:** YOK — ses kanalını sil (zaten muted; boyutu düşürür).
- **Format (İKİSİNİ de ver):** WebM (VP9/AV1) + MP4 (H.264).
- **Hedef boyut:** her dosya **≤ 2–3 MB** (performans bütçesi).

## ffmpeg ile encode (boyutu tutturmak için)

    # WebM (VP9), sessiz, 1080p, 2-pass
    ffmpeg -i master.mov -an -c:v libvpx-vp9 -b:v 1.4M -vf "scale=1920:-2,fps=30" -pass 1 -f null /dev/null
    ffmpeg -i master.mov -an -c:v libvpx-vp9 -b:v 1.4M -vf "scale=1920:-2,fps=30" -pass 2 showreel.webm

    # MP4 (H.264), sessiz
    ffmpeg -i master.mov -an -c:v libx264 -crf 26 -preset slow -vf "scale=1920:-2,fps=30" -movflags +faststart showreel.mp4

    # Poster (ilk kare)
    ffmpeg -i master.mov -frames:v 1 -q:v 3 showreel-poster.jpg

≤2 MB için: süreyi kısa tut (12–15 sn), 720p'ye in ya da bitrate'i ~1M yap.
Bittiğinde dosyaları bana ver, ekleyip yayına alırım.
