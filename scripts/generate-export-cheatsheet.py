#!/usr/bin/env python3
"""Generate the export-settings cheat sheet (PDF + PNG) for /rehber/video-export-ayarlari/.

Renders an A4 HTML page with headless Chromium (print-to-pdf + screenshot).
Numbers mirror src/data/export-specs.ts — if that file changes, update ROWS
below and re-run:  python3 scripts/generate-export-cheatsheet.py
Needs node (sharp, a site dependency) and a Chromium binary (CHROME env or the
Hermes default path). License of the output: CC BY 4.0.
"""
import base64
import os
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public/rehber/video-export-ayarlari"
OUT.mkdir(parents=True, exist_ok=True)
CHROME = os.environ.get("CHROME", str(Path.home() / ".hermes/tools/chromium-1208/chrome-linux64/chrome"))
ENV = dict(os.environ)
libs = Path.home() / ".hermes/tools/chrome-libs/root/usr/lib/x86_64-linux-gnu"
if libs.exists():
    ENV["LD_LIBRARY_PATH"] = f"{libs}:{ENV.get('LD_LIBRARY_PATH', '')}"


def logo_b64():
    tmp = OUT / ".logo-tmp.png"
    js = (
        "require('sharp')"
        f"('{ROOT / 'public/logo-black.svg'}',{{density:300}}).resize(1600).trim().png()"
        f".toFile('{tmp}').then(()=>process.exit(0))"
    )
    subprocess.run(["node", "-e", js], cwd=ROOT, check=True)
    data = base64.b64encode(tmp.read_bytes()).decode()
    tmp.unlink()
    return data


CARDS = [
    (
        "1080p (Full HD)",
        [
            ("Çözünürlük", "1920×1080 yatay · 1080×1920 dikey"),
            ("Kapsayıcı / codec", "MP4 · H.264, High profil"),
            ("Kare hızı", "Çekildiği gibi (25, 30, 50, 60), sabit"),
            ("Bitrate*", "VBR 2 geçiş · 25/30 fps: 16 Mbps · 50/60 fps: 24 Mbps"),
            ("Renk", "Rec.709 · 4:2:0 · 8-bit"),
            ("Ses", "AAC-LC · 48 kHz · stereo · 320 kbps"),
        ],
    ),
    (
        "4K (UHD)",
        [
            ("Çözünürlük", "3840×2160 yatay · 2160×3840 dikey"),
            ("Kapsayıcı / codec", "MP4 · H.264 High ya da H.265 (HEVC)"),
            ("Kare hızı", "Çekildiği gibi, sabit"),
            ("Bitrate*", "VBR 2 geçiş · 25/30 fps: 45 Mbps · 50/60 fps: 68 Mbps"),
            ("Renk", "SDR: Rec.709 · HDR: Rec.2020 + PQ/HLG, 10-bit"),
            ("Ses", "AAC-LC · 48 kHz · stereo · 320 kbps"),
        ],
    ),
]

ROWS = [
    ("YouTube SDR", "8 / 12 Mbps", "35–45 / 53–68 Mbps", "AAC-LC 48 kHz, stereo 384 kbps"),
    ("YouTube HDR", "10 / 15 Mbps", "44–56 / 66–85 Mbps", "AAC-LC 48 kHz"),
    ("Vimeo", "10–20 Mbps", "30–60 Mbps", "AAC-LC 48 kHz, 320 kb/s"),
    ("Instagram Reels", "yayımlanmıyor", "yayımlanmıyor", "Stereo AAC 128 kbps+ · ≥30 FPS · ≤4 GB (reklam)"),
    ("TikTok reklam", "≥516 kbps", "≥516 kbps", "≤500 MB · .mp4/.mov"),
]

PRORES = [
    ("1080p 25", "85", "122", "184"),
    ("1080p 30", "102", "147", "220"),
    ("4K UHD 25", "342", "492", "737"),
    ("4K UHD 30", "410", "589", "884"),
]

CHECKS = [
    "Kare hızını değiştirmeyin (25 → 30 takılma yapar)",
    "Telefon görüntüsünü (VFR) sabit kare hızına çevirin",
    "Dikey iş için zaman çizelgesi 1080×1920 olsun",
    "Fast Start / hızlı başlat açık (moov başta)",
    "Yayından önce telefonda sesli, baştan sona izleyin",
    "Arşiv için ayrıca ProRes 422 HQ master saklayın",
]


def html(logo):
    cards = "".join(
        f"<section class='card'><h2>{h}</h2><dl>"
        + "".join(f"<dt>{k}</dt><dd>{v}</dd>" for k, v in items)
        + "</dl></section>"
        for h, items in CARDS
    )
    rows = "".join(f"<tr><th>{a}</th><td>{b}</td><td>{c}</td><td>{d}</td></tr>" for a, b, c, d in ROWS)
    pr = "".join(f"<tr><th>{a}</th><td>{b}</td><td>{c}</td><td>{d}</td></tr>" for a, b, c, d in PRORES)
    checks = "".join(f"<li>{c}</li>" for c in CHECKS)
    return f"""<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Video export ayarları — Rast Creative Studio</title>
<style>
@page {{ size: A4; margin: 0; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
html, body {{ width: 210mm; height: 297mm; }}
body {{ font-family: "Inter", "DejaVu Sans", system-ui, sans-serif; color: #17140f; background: #faf7f1; padding: 14mm 14mm 10mm; font-size: 9.6pt; line-height: 1.38; display: flex; flex-direction: column; }}
header {{ display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #17140f; padding-bottom: 4mm; margin-bottom: 5mm; }}
h1 {{ font-size: 21pt; line-height: 1.1; letter-spacing: -0.01em; }}
header p {{ color: #6b6355; margin-top: 1.5mm; }}
.eyebrow {{ font-size: 7.5pt; letter-spacing: .14em; text-transform: uppercase; color: #b4561c; font-weight: 700; margin-bottom: 1.5mm; }}
.cards {{ display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }}
.card {{ background: #fff; border: 1px solid #e3dccf; border-radius: 3mm; padding: 4mm; }}
.card h2 {{ font-size: 13pt; margin-bottom: 2.5mm; }}
dl {{ display: grid; grid-template-columns: 27mm 1fr; gap: 1.6mm 2.5mm; }}
dt {{ font-size: 7pt; text-transform: uppercase; letter-spacing: .06em; color: #6b6355; padding-top: .6mm; }}
dd {{ font-weight: 500; }}
h3 {{ font-size: 11pt; margin: 5.5mm 0 2mm; }}
table {{ width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e3dccf; }}
th, td {{ text-align: left; padding: 1.6mm 2.2mm; border-bottom: 1px solid #eee7da; vertical-align: top; }}
thead th {{ font-size: 7pt; text-transform: uppercase; letter-spacing: .06em; color: #6b6355; background: #f3eee4; }}
tbody th {{ white-space: nowrap; }}
.cols {{ display: grid; grid-template-columns: 1.05fr 1fr; gap: 5mm; }}
ul {{ padding-left: 4.5mm; display: grid; gap: 1.2mm; }}
.note {{ color: #6b6355; font-size: 7.6pt; margin-top: 2mm; }}
footer {{ margin-top: auto; padding-top: 4mm; border-top: 1px solid #d8cfbf; display: flex; align-items: center; gap: 4mm; color: #6b6355; font-size: 7.6pt; }}
footer img {{ height: 9mm; width: auto; opacity: .85; }}
footer b {{ color: #17140f; }}
</style></head><body>
<header><div><p class="eyebrow">Kopya kâğıdı · Ekim 2026</p><h1>1080p ve 4K video export ayarları</h1>
<p>Teslim dosyası için hızlı ayarlar ve platformların resmî değerleri.</p></div></header>
<div class="cards">{cards}</div>
<p class="note">* Bitrate satırları Rast önerisidir (YouTube önerisinin üstü, Vimeo aralığının içi). Platform değerleri aşağıda.</p>
<h3>Platformların resmî değerleri (standart / yüksek kare hızı)</h3>
<table><thead><tr><th>Platform</th><th>1080p</th><th>4K</th><th>Ses ve not</th></tr></thead><tbody>{rows}</tbody></table>
<p class="note">Standart = 24/25/30 fps, yüksek = 48/50/60 fps. Kaynaklar: YouTube Yardım, Vimeo Help Center, Meta Ads Guide, Instagram Yardım, TikTok Ads Manager (erişim 30.10.2026).</p>
<div class="cols">
<div><h3>ProRes master (Mbps)</h3>
<table><thead><tr><th>Format</th><th>422 LT</th><th>422</th><th>422 HQ</th></tr></thead><tbody>{pr}</tbody></table>
<p class="note">Kaynak: Apple ProRes White Paper (Nisan 2022), hedef değerler.</p></div>
<div><h3>Dışa aktarmadan önce</h3><ul>{checks}</ul></div>
</div>
<footer><img src="data:image/png;base64,{logo}" alt="Rast Creative Studio"><div>
<b>Rast Creative Studio</b> · rastcreative.com/rehber/video-export-ayarlari · Bitrate hesaplayıcı: rastcreative.com/araclar/bitrate-hesaplayici<br>
Lisans: CC BY 4.0 — paylaşabilir ve uyarlayabilirsiniz; atıf: “Rast Creative Studio — rastcreative.com”.</div></footer>
</body></html>"""


def chrome(*args):
    subprocess.run(
        [CHROME, "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", *args],
        check=True,
        env=ENV,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main():
    page = html(logo_b64())
    with tempfile.TemporaryDirectory() as td:
        src = Path(td) / "sheet.html"
        src.write_text(page, encoding="utf-8")
        pdf = OUT / "rast-video-export-ayarlari.pdf"
        png = OUT / "rast-video-export-ayarlari.png"
        chrome(f"--print-to-pdf={pdf}", "--no-pdf-header-footer", src.as_uri())
        # A4 at 150 dpi = 1240×1754
        # Headless viewports come out shorter than --window-size, so render
        # taller and crop to the page (otherwise the footer is cut off).
        chrome(f"--screenshot={png}", "--window-size=794,1400", "--force-device-scale-factor=1.5625", src.as_uri())
        from PIL import Image

        Image.open(png).crop((0, 0, 1241, 1754)).save(png, optimize=True)
    for p in sorted(OUT.iterdir()):
        print(p.name, p.stat().st_size)


if __name__ == "__main__":
    main()
