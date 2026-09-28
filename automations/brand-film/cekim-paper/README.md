# Çekim Günü — kâğıt maket (papercraft) sürümü · 9:16, 30 sn

Referans stil (Rien spotu): low-poly kâğıt maket 3D, buruşuk kâğıt dokusu, sisli spot ışık, bokeh.
Kareler: Kling · Nano Banana 2 (onaylı test karesi + stil referansları) · Video: Kling 3.0 turbo 1080p, 3 sn.
Kurgu, yazılar, hız çizgileri, logo kartı ve trailer ses kodla (`film.html` + `film.js`, ses `../cekim-3d/cekim3d-audio.js`).
Çıktı: `out/rast-creative-cekim-gunu-kagit.mp4`.

## Görev dağılımı
A (şapka + gözlük): arabayı sürer, gimbal · B (sakal): drone'u uçurur, klaket, Enter'a basar.

## Dosyalar
`kling/` kareler + `jobs.json` (Kling iş ID'leri) + `prompts.md` · `clips/p01–p19.mp4` Kling klipleri ·
`timing.js` çekim/klip eşlemesi + ses cue'ları · `prepare-paper.mjs` klip → kare dizisi · `paper.py` Blender denemesi (kullanılmadı).

## Üretim
```bash
node automations/brand-film/cekim-paper/prepare-paper.mjs
node automations/brand-film/render.mjs --page cekim-paper/film.html --name paper --out rast-creative-cekim-gunu-kagit
# sonra loudnorm I=-14:TP=-1.2
```

## Maliyet (Kling)
Test 15 · kareler 18×15 + 2 düzeltme = 300 · klipler 19 (+1 düzeltme) ≈ 600 → toplam ≈ 915 (oturum toplamı 1312, sınır 1700).
