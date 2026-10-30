#!/usr/bin/env python3
"""Generate the transparent 1080x1920 safe-zone templates for /araclar/guvenli-alan/.

Reads src/data/safe-zones.json (same table the page uses) and writes
public/araclar/guvenli-alan/rast-guvenli-alan-<id>-1080x1920.png plus a zip
bundle with OKU-BENI.txt. Run after changing the data:

    python3 scripts/generate-safe-zone-templates.py

Needs Pillow and node (sharp, already a site dependency) to rasterise the logo.
Templates are CC BY 4.0, credited to Rast Creative Studio; the small credit sits
inside the bottom UI zone so it never covers the user's content.
"""
import json
import subprocess
import zipfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from PIL.PngImagePlugin import PngInfo

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "src/data/safe-zones.json").read_text())
OUT = ROOT / "public/araclar/guvenli-alan"
OUT.mkdir(parents=True, exist_ok=True)
W, H = DATA["width"], DATA["height"]
PAGE = "https://rastcreative.com/araclar/guvenli-alan/"


FONT_DIRS = ["/usr/share/fonts/truetype/dejavu", "/usr/share/fonts/dejavu"]


def font(size, bold=False):
    name = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    for d in FONT_DIRS:
        p = Path(d) / name
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default(size)


def logo_png(height):
    """Rasterise public/logo-white.svg with sharp, trimmed to the mark."""
    tmp = OUT / ".logo-tmp.png"
    js = (
        "const sharp=require('sharp');"
        f"sharp('{ROOT / 'public/logo-white.svg'}',{{density:300}}).resize(1600).trim().png()"
        f".toFile('{tmp}').then(()=>process.exit(0)).catch(e=>{{console.error(e);process.exit(1)}});"
    )
    subprocess.run(["node", "-e", js], cwd=ROOT, check=True)
    img = Image.open(tmp).convert("RGBA")
    tmp.unlink()
    ratio = height / img.height
    return img.resize((max(1, round(img.width * ratio)), height), Image.LANCZOS)


LOGO = logo_png(40)
# 2x copy for the tool's canvas export credit (same mark, trimmed)
logo_png(80).save(OUT / "rast-logo-beyaz.png", optimize=True)
ZONE = (12, 12, 16, 150)  # dark translucent: reads on any footage
EDGE = (255, 77, 77, 230)
SIDE = (12, 12, 16, 70)
SAFE = (61, 220, 132, 255)
STICKER = (255, 184, 0, 110)


def dashed_rect(d, box, color, width=4, dash=24, gap=14):
    x1, y1, x2, y2 = box
    for (ax, ay, bx, by) in [(x1, y1, x2, y1), (x2, y1, x2, y2), (x2, y2, x1, y2), (x1, y2, x1, y1)]:
        length = abs(bx - ax) + abs(by - ay)
        sx = (bx > ax) - (bx < ax)
        sy = (by > ay) - (by < ay)
        pos = 0
        while pos < length:
            end = min(pos + dash, length)
            d.line([(ax + sx * pos, ay + sy * pos), (ax + sx * end, ay + sy * end)], fill=color, width=width)
            pos = end + gap


def combined():
    ps = DATA["platforms"]
    rails = [p["rail"] for p in ps if p["rail"]]
    return {
        "id": DATA["combined"]["id"],
        "label": DATA["combined"]["label"],
        "top": max(p["top"] for p in ps),
        "bottom": max(p["bottom"] for p in ps),
        "left": max(p["left"] for p in ps),
        "right": max(p["right"] for p in ps),
        "rail": {"x": min(r["x"] for r in rails), "y1": min(r["y1"] for r in rails), "y2": max(r["y2"] for r in rails)},
    }


def render(p, sticker=False, label=None):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    top, bottom, left, right = p["top"], p["bottom"], p["left"], p["right"]
    # side margins (light), then UI bands (dark)
    d.rectangle([0, top, left - 1, H - bottom - 1], fill=SIDE)
    d.rectangle([W - right, top, W - 1, H - bottom - 1], fill=SIDE)
    d.rectangle([0, 0, W - 1, top - 1], fill=ZONE)
    d.rectangle([0, H - bottom, W - 1, H - 1], fill=ZONE)
    rail = p.get("rail")
    if rail:
        d.rectangle([rail["x"], max(rail["y1"], top), W - 1, min(rail["y2"], H - bottom) - 1], fill=ZONE)
        d.line([(rail["x"], max(rail["y1"], top)), (rail["x"], min(rail["y2"], H - bottom))], fill=EDGE, width=3)
    d.line([(0, top), (W, top)], fill=EDGE, width=3)
    d.line([(0, H - bottom), (W, H - bottom)], fill=EDGE, width=3)
    if sticker:
        s = DATA["sticker"]
        d.rounded_rectangle([s["x1"], s["y1"], s["x2"], s["y2"]], radius=28, fill=STICKER, outline=(255, 184, 0, 255), width=4)
        d.text(((s["x1"] + s["x2"]) / 2, (s["y1"] + s["y2"]) / 2), "Yorum yanıtı etiketi (yaklaşık)", font=font(30, True), fill=(20, 20, 20, 255), anchor="mm")
    dashed_rect(d, (left, top, W - right, H - bottom), SAFE)
    img = Image.alpha_composite(img, layer)
    d = ImageDraw.Draw(img)
    name = label or p["label"]
    sw, sh = W - left - right, H - top - bottom
    d.text((40, top / 2 - 18), name, font=font(34, True), fill=(255, 255, 255, 235), anchor="lm")
    d.text((40, top / 2 + 26), f"Üst arayüz ≈ {top} px", font=font(26), fill=(255, 255, 255, 200), anchor="lm")
    lbl = f"Güvenli alan ≈ {sw}×{sh} px"
    tw = d.textlength(lbl, font=font(24, True))
    pill = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(pill).rounded_rectangle([left + 8, top + 10, left + 32 + tw, top + 50], radius=20, fill=(12, 12, 16, 170))
    img = Image.alpha_composite(img, pill)
    d = ImageDraw.Draw(img)
    d.text((left + 20, top + 30), lbl, font=font(24, True), fill=SAFE, anchor="lm")
    d.text((40, H - bottom + 36), f"Alt arayüz ≈ {bottom} px · yaklaşık değerler, cihaza göre değişir", font=font(24), fill=(255, 255, 255, 200), anchor="lm")
    # credit: small, semi-transparent, inside the bottom UI zone
    credit = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    cd = ImageDraw.Draw(credit)
    lx, ly = 40, H - 40 - LOGO.height
    credit.alpha_composite(LOGO, (lx, ly))
    tx = lx + LOGO.width + 18
    cd.text((tx, ly + LOGO.height / 2 - 2), "Rast Creative Studio · @rastcreative", font=font(22, True), fill=(255, 255, 255, 255), anchor="ls")
    cd.text((tx, ly + LOGO.height / 2 + 4), "rastcreative.com/araclar/guvenli-alan · CC BY 4.0", font=font(20), fill=(255, 255, 255, 255), anchor="lt")
    alpha = credit.getchannel("A").point(lambda a: int(a * 0.6))
    credit.putalpha(alpha)
    img = Image.alpha_composite(img, credit)
    return img


def meta(title):
    info = PngInfo()
    info.add_text("Title", title)
    info.add_text("Author", "Rast Creative Studio")
    info.add_text("Source", PAGE)
    info.add_text("License", "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/deed.tr)")
    info.add_text("Copyright", "Rast Creative Studio — rastcreative.com")
    info.add_text("Description", "Yaklaşık güvenli alan şablonu, 1080x1920. Atıf: Rast Creative Studio — rastcreative.com")
    return info


jobs = [(p, False, None, p["id"]) for p in DATA["platforms"]]
reels = DATA["platforms"][0]
jobs.append((reels, True, "Instagram Reels + yorum yanıtı etiketi", "instagram-reels-yorum-yaniti"))
jobs.append((combined(), False, None, DATA["combined"]["id"]))

files = []
for p, sticker, label, slug in jobs:
    fn = f"rast-guvenli-alan-{slug}-1080x1920.png"
    title = f"{label or p['label']} güvenli alan şablonu 1080x1920"
    render(p, sticker, label).save(OUT / fn, pnginfo=meta(title), optimize=True)
    files.append(fn)
    print("wrote", fn)

readme = f"""Rast Creative Studio — Güvenli alan şablonları (1080x1920, şeffaf PNG)

Kaynak ve canlı araç: {PAGE}

Kullanım: Şablonu Premiere Pro, After Effects, CapCut, DaVinci Resolve ya da Canva'da
videonuzun en üst katmanına koyun; metin, altyazı ve logoyu yeşil kesikli çerçevenin
içinde tutun. Dışa aktarmadan önce şablon katmanını kapatın.

Değerler yaklaşıktır; cihaza, uygulama sürümüne ve açıklama uzunluğuna göre değişir.
Son kontrol: {DATA['checked']}.

Lisans: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/deed.tr
Paylaşabilir, uyarlayabilir, ticari işlerde kullanabilirsiniz; tek şart atıf:
  "Güvenli alan şablonu: Rast Creative Studio — rastcreative.com"
Web'de paylaşırken bağlantı: {PAGE}

Dosyalar:
""" + "\n".join(f"  - {f}" for f in files) + "\n"

zpath = OUT / "rast-guvenli-alan-sablonlari.zip"
with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("OKU-BENI.txt", readme)
    z.writestr("LISANS.txt", "CC BY 4.0 — Rast Creative Studio — " + PAGE + "\nhttps://creativecommons.org/licenses/by/4.0/legalcode.tr\n")
    for f in files:
        z.write(OUT / f, f)
print("wrote", zpath.name)
