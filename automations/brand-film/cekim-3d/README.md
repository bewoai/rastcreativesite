# Çekim Günü 3D — tamamen kodla animasyon (9:16, 30 sn)

Kling / yapay zekâ videosu yok: Three.js ile kodda kurulmuş oyuncak-kil estetiği
(toon shading, mürekkep kontur, blob gölge), renk bloklu setler, 20 çekim, 120 BPM'de kesme.
Slogan: **"Ağızları açık kalsın."** Çıktı: `out/rast-creative-cekim-gunu-3d.mp4`.

## Absürt vuruşlar
- Drone havada bir de **boom mikrofon** taşıyor (sesi de o alıyor).
- Üstü açık araba hastanenin kapısını kırıp **ameliyathaneye park ediyor**.
- Doktor: "Sadece on saniye mi?" → Reel'i izliyor → **çenesi yere düşüp zıplıyor**, bıyığı fırlıyor.
- Hemşirelerin maskeleri iniyor, çeneleri **domino** gibi açılıyor; EKG **kalp** çiziyor.
- İkili havalı çıkıyor; B de kendi gözlüğünü takıyor.
- Logonun güneş noktası da çene gibi düşüp zıplıyor, harfler oradan açılıyor.

## Akış (sn)
0 stüdyo · 2 gözlük parlaması · 3 lastik · 4 otoyol (drop) · 6 önden · 7 kuşbakışı · 8 TIR altı slow-mo → 9.3 snap ·
9.5 drone avuca + yumruk · 10.5 kapı kırma (11.0) · 11.5 ameliyathane, klaket 12.5 · 13.5 doktor · 15 hemşireler ·
16 bıyık · 16.5 kurgu · 18.7 ENTER (tape stop) · 19 telefon · 20.4 çene düşer · 21.5 domino · 22.5 yerde çene ·
23.5 çıkış (müzik geri) · 25.5 kesme · 26 logo.

## Dosyalar
`timing.js` saat · `cekim3d.html` + `cekim3d.js` görüntü (Three.js) · `cekim3d-audio.js` müzik + SFX
(D minör trailer: stomp-clap, taiko, ostinato, braam; boing/clonk/cam kırılması/telefon hoparlörü).

## Üretim
```bash
cd automations/brand-film && npm i --no-save three@0.186.1 playwright-core
node render.mjs --page cekim-3d/cekim3d.html --name c3 --out rast-creative-cekim-gunu-3d
# sonra loudnorm I=-14:TP=-1.2  (render ~7 dk, swiftshader WebGL)
```
