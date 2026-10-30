#!/usr/bin/env python3
"""Generate the downloadable guides for the creator tool pages:

  /araclar/en-boy-orani/            crop-frame overlays for 16:9 footage
  /araclar/instagram-grid-sablonu/  layered PNG set for Reels covers + grid posts
  /araclar/kapak-sablonlari/        Reels cover + YouTube thumbnail guides (PNG + layered SVG)

    python3 scripts/generate-creator-templates.py

Needs Pillow and node (sharp, already a site dependency) for the logo.
All files are CC BY 4.0, credited to Rast Creative Studio; the credit is small and
sits in an area that the guide already marks as "not for content".
Zone values are approximations; sources and dates are on each page.
"""
import base64
import io
import json
import re
import subprocess
import zipfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from PIL.PngImagePlugin import PngInfo

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://rastcreative.com"
CHECKED = "2026-10-30"
ZONES = json.loads((ROOT / "src/data/safe-zones.json").read_text())
REELS = ZONES["platforms"][0]

FONT_DIRS = ["/usr/share/fonts/truetype/dejavu", "/usr/share/fonts/dejavu"]


def font(size, bold=False):
    name = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    for d in FONT_DIRS:
        p = Path(d) / name
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default(size)


def _logo_raster():
    tmp = ROOT / ".logo-tmp.png"
    js = (
        "const sharp=require('sharp');"
        f"sharp('{ROOT / 'public/logo-white.svg'}',{{density:300}}).resize(2000).trim().png()"
        f".toFile('{tmp}').then(()=>process.exit(0)).catch(e=>{{console.error(e);process.exit(1)}});"
    )
    subprocess.run(["node", "-e", js], cwd=ROOT, check=True)
    img = Image.open(tmp).convert("RGBA")
    img.load()
    tmp.unlink()
    return img


LOGO_SRC = _logo_raster()


def logo(height):
    r = height / LOGO_SRC.height
    return LOGO_SRC.resize((max(1, round(LOGO_SRC.width * r)), height), Image.LANCZOS)


# --- inline SVG logo (for layered SVGs): trimmed viewBox of public/logo-white.svg
def _svg_logo_parts():
    raw = (ROOT / "public/logo-white.svg").read_text()
    body = raw.split("</defs>", 1)[1].rsplit("</svg>", 1)[0]
    body = body.replace('class="cls-1"', 'fill="#fff"')
    # bbox from an untrimmed 1080 raster
    tmp = ROOT / ".logo-full.png"
    js = (
        "const sharp=require('sharp');"
        f"sharp('{ROOT / 'public/logo-white.svg'}',{{density:72}}).resize(1080,1080).png()"
        f".toFile('{tmp}').then(()=>process.exit(0)).catch(e=>{{console.error(e);process.exit(1)}});"
    )
    subprocess.run(["node", "-e", js], cwd=ROOT, check=True)
    im = Image.open(tmp)
    bbox = im.getchannel("A").getbbox()
    tmp.unlink()
    return body.strip(), bbox


SVG_LOGO_BODY, SVG_LOGO_BBOX = _svg_logo_parts()


def svg_logo(x, y, h):
    x1, y1, x2, y2 = SVG_LOGO_BBOX
    w = h * (x2 - x1) / (y2 - y1)
    return (
        f'<svg x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" viewBox="{x1} {y1} {x2 - x1} {y2 - y1}">'
        f"{SVG_LOGO_BODY}</svg>"
    ), w


# ---------------------------------------------------------------- helpers
DIM = (12, 12, 16, 150)
DIM_SOFT = (12, 12, 16, 90)
GREEN = (61, 220, 132, 255)
AMBER = (255, 184, 0, 255)
BLUE = (77, 163, 255, 255)
PINK = (255, 92, 138, 255)
RED = (255, 77, 77, 235)
WHITE = (255, 255, 255, 235)


def blank(w, h):
    return Image.new("RGBA", (w, h), (0, 0, 0, 0))


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


def pill(img, xy, text, fnt, fg, bg=(12, 12, 16, 185), pad=(14, 8), anchor="lt"):
    d = ImageDraw.Draw(img)
    x, y = xy
    tw = d.textlength(text, font=fnt)
    th = fnt.size
    if anchor == "rt":
        x = x - tw - pad[0] * 2
    if anchor == "rb":
        x, y = x - tw - pad[0] * 2, y - th - pad[1] * 2
    if anchor == "lb":
        y = y - th - pad[1] * 2
    layer = blank(*img.size)
    ImageDraw.Draw(layer).rounded_rectangle([x, y, x + tw + pad[0] * 2, y + th + pad[1] * 2], radius=(th + pad[1] * 2) // 2, fill=bg)
    img.alpha_composite(layer)
    ImageDraw.Draw(img).text((x + pad[0], y + pad[1] + th / 2), text, font=fnt, fill=fg, anchor="lm")


def credit(img, x, y, scale, path, align="left", alpha=0.6):
    """Small Rast credit: logo + 2 lines. (x, y) = top-left (or top-right if align=right)."""
    lh = round(34 * scale)
    lg = logo(lh)
    f1, f2 = font(round(19 * scale), True), font(round(17 * scale))
    l1, l2 = "Rast Creative Studio · CC BY 4.0", f"rastcreative.com{path}"
    tmpd = ImageDraw.Draw(img)
    tw = max(tmpd.textlength(l1, font=f1), tmpd.textlength(l2, font=f2))
    total = lg.width + 12 * scale + tw
    x0 = x - total if align == "right" else x
    layer = blank(*img.size)
    layer.alpha_composite(lg, (round(x0), round(y)))
    cd = ImageDraw.Draw(layer)
    tx = x0 + lg.width + 12 * scale
    cd.text((tx, y + lh / 2 - 1), l1, font=f1, fill=(255, 255, 255, 255), anchor="ls")
    cd.text((tx, y + lh / 2 + 3), l2, font=f2, fill=(255, 255, 255, 255), anchor="lt")
    layer.putalpha(layer.getchannel("A").point(lambda a: int(a * alpha)))
    img.alpha_composite(layer)


def save(img, path, title, page):
    info = PngInfo()
    info.add_text("Title", title)
    info.add_text("Author", "Rast Creative Studio")
    info.add_text("Source", SITE + page)
    info.add_text("License", "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/deed.tr)")
    info.add_text("Copyright", "Rast Creative Studio — rastcreative.com")
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, pnginfo=info, optimize=True)
    print("wrote", path.relative_to(ROOT))


def write_zip(zpath, page, title, usage, files, base=None):
    base = base or zpath.parent
    readme = f"""Rast Creative Studio — {title}

Kaynak ve canlı araç: {SITE}{page}

{usage}

Değerler yaklaşıktır; platformlar arayüzü cihaza ve uygulama sürümüne göre değiştirir.
Son kontrol: {CHECKED}.

Lisans: CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/deed.tr
Paylaşabilir, uyarlayabilir, müşteri işlerinde ve ticari projelerde kullanabilirsiniz;
tek şart atıf: "Rast Creative Studio — rastcreative.com"
Web'de paylaşırken bağlantı: {SITE}{page}

Dosyalar:
""" + "\n".join(f"  - {f}" for f in files) + "\n"
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("OKU-BENI.txt", readme)
        z.writestr("LISANS.txt", f"CC BY 4.0 — Rast Creative Studio — {SITE}{page}\nhttps://creativecommons.org/licenses/by/4.0/legalcode.tr\n")
        for f in files:
            z.write(base / f, f)
    print("wrote", zpath.relative_to(ROOT))


# ================================================================ 1) en-boy-orani
P1 = "/araclar/en-boy-orani/"
OUT1 = ROOT / "public" / P1.strip("/")
RATIOS = [("9x16", "9:16", 9, 16, GREEN), ("3x4", "3:4", 3, 4, AMBER), ("4x5", "4:5", 4, 5, BLUE), ("1x1", "1:1", 1, 1, PINK)]
SW, SH = 1920, 1080


def crop_box(rw, rh, w=SW, h=SH):
    cw = round(h * rw / rh)
    if cw > w:
        ch = round(w * rh / rw)
        return (0, (h - ch) // 2, w, (h - ch) // 2 + ch)
    return ((w - cw) // 2, 0, (w - cw) // 2 + cw, h)


def ratio_mask(slug, label, rw, rh, color):
    img = blank(SW, SH)
    d = ImageDraw.Draw(img)
    x1, y1, x2, y2 = crop_box(rw, rh)
    d.rectangle([0, 0, x1 - 1, SH - 1], fill=DIM)
    d.rectangle([x2, 0, SW - 1, SH - 1], fill=DIM)
    d.rectangle([x1, y1, x2 - 1, y2 - 1], outline=color, width=5)
    # rule-of-thirds inside the crop
    for i in (1, 2):
        gx = x1 + (x2 - x1) * i / 3
        gy = y1 + (y2 - y1) * i / 3
        d.line([(gx, y1), (gx, y2)], fill=(255, 255, 255, 70), width=2)
        d.line([(x1, gy), (x2, gy)], fill=(255, 255, 255, 70), width=2)
    pill(img, (x1 + 14, 16), f"{label} · {x2 - x1}×{y2 - y1} px (ortadan)", font(26, True), color)
    ImageDraw.Draw(img).text((40, 60), f"16:9 → {label}", font=font(44, True), fill=WHITE)
    ImageDraw.Draw(img).text((40, 116), "Koyu alan kırpılır.", font=font(26), fill=(255, 255, 255, 200))
    credit(img, SW - 40, SH - 40 - 34, 1.0, P1, align="right")
    return img


def all_frames():
    img = blank(SW, SH)
    d = ImageDraw.Draw(img)
    for i, (slug, label, rw, rh, color) in enumerate(RATIOS):
        x1, y1, x2, y2 = crop_box(rw, rh)
        dashed_rect(d, (x1, y1 + 4, x2, y2 - 4), color, width=5)
        pill(img, (x1 + 10, 18 + i * 52), f"{label} · {x2 - x1}×{y2 - y1}", font(24, True), color)
    d.text((40, SH - 120), "16:9 kaynakta ortadan kırpma çerçeveleri", font=font(30, True), fill=WHITE)
    d.text((40, SH - 78), "9:16 · 3:4 · 4:5 · 1:1 — yaklaşık değil, matematiksel merkez kırpma", font=font(22), fill=(255, 255, 255, 200))
    credit(img, SW - 40, SH - 40 - 34, 1.0, P1, align="right")
    return img


files1 = []
fn = "rast-kirpma-cerceveleri-16x9-1920x1080.png"
save(all_frames(), OUT1 / fn, "16:9 kırpma çerçeveleri 1920x1080", P1)
files1.append(fn)
for slug, label, rw, rh, color in RATIOS:
    fn = f"rast-kirpma-16x9-to-{slug}-1920x1080.png"
    save(ratio_mask(slug, label, rw, rh, color), OUT1 / fn, f"16:9 → {label} kırpma maskesi 1920x1080", P1)
    files1.append(fn)
write_zip(
    OUT1 / "rast-kirpma-cerceveleri.zip", P1, "16:9 kırpma çerçeveleri (1920x1080, şeffaf PNG)",
    "Kullanım: PNG'yi 16:9 (1920x1080) zaman çizelgenizin en üst katmanına koyun. Koyu alan,\n"
    "dikey (9:16), 3:4, 4:5 ya da kare (1:1) kırpmada kaybolacak kısımdır. 4K (3840x2160)\n"
    "projede katmanı %200 ölçekleyin. Dışa aktarmadan önce katmanı kapatın.",
    files1,
)

# ================================================================ 2) instagram grid
P2 = "/araclar/instagram-grid-sablonu/"
OUT2 = ROOT / "public" / P2.strip("/")
CW, CH = 1080, 1920
GRID = (0, 240, 1080, 1680)  # 3:4 centre crop of 9:16 (1080x1440)
FEED = (0, 285, 1080, 1635)  # 4:5 centre crop (1080x1350)
TEXT_SAFE = (90, 360, 990, 1560)
GRID_ICON = (GRID[2] - 150, GRID[1] + 20, GRID[2] - 20, GRID[1] + 140)  # reels/multi-photo indicator corner (approx.)


def layer_grid():
    img = blank(CW, CH)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, CW - 1, GRID[1] - 1], fill=DIM)
    d.rectangle([0, GRID[3], CW - 1, CH - 1], fill=DIM)
    d.rectangle(GRID, outline=AMBER, width=5)
    pill(img, (24, GRID[1] - 60), "Profil ızgarası 3:4 · 1080×1440 (ortadan)", font(26, True), AMBER)
    return img


def layer_feed():
    img = blank(CW, CH)
    d = ImageDraw.Draw(img)
    dashed_rect(d, (3, FEED[1], CW - 3, FEED[3]), BLUE, width=4)
    pill(img, (CW - 24, FEED[3] + 14), "Akışta 4:5 · 1080×1350", font(24, True), BLUE, anchor="rt")
    return img


def layer_text():
    img = blank(CW, CH)
    d = ImageDraw.Draw(img)
    dashed_rect(d, TEXT_SAFE, GREEN, width=5)
    d.rounded_rectangle(GRID_ICON, radius=18, outline=(255, 255, 255, 200), width=3, fill=(12, 12, 16, 90))
    d.text(((GRID_ICON[0] + GRID_ICON[2]) / 2, (GRID_ICON[1] + GRID_ICON[3]) / 2), "simge", font=font(22, True), fill=(255, 255, 255, 220), anchor="mm")
    pill(img, (TEXT_SAFE[0] + 10, TEXT_SAFE[1] + 12), "Başlık + yüz güvenli alanı · 900×1200", font(24, True), GREEN)
    return img


def layer_labels(with_credit=True):
    img = blank(CW, CH)
    d = ImageDraw.Draw(img)
    d.text((40, 70), "Reels kapağı 1080×1920", font=font(40, True), fill=WHITE)
    d.text((40, 124), "Izgarada üstten ve alttan ≈240 px görünmez", font=font(26), fill=(255, 255, 255, 205))
    d.text((40, CH - 210), "Tam ekran 9:16 · alt kısım kapağın tamamında görünür", font=font(24), fill=(255, 255, 255, 205))
    if with_credit:
        credit(img, 40, CH - 40 - 34, 1.0, P2)
    return img


def layer_reels_ui():
    """Faint Reels UI bands (from safe-zones.json) — matters only when the cover frame plays."""
    img = blank(CW, CH)
    d = ImageDraw.Draw(img)
    t, b, r = REELS["top"], REELS["bottom"], REELS["rail"]
    d.rectangle([0, 0, CW - 1, t - 1], fill=DIM_SOFT)
    d.rectangle([0, CH - b, CW - 1, CH - 1], fill=DIM_SOFT)
    d.rectangle([r["x"], r["y1"], CW - 1, r["y2"]], fill=DIM_SOFT)
    d.line([(0, t), (CW, t)], fill=RED, width=2)
    d.line([(0, CH - b), (CW, CH - b)], fill=RED, width=2)
    return img


layers = [
    ("rast-ig-kapak-katman-1-izgara-3x4.png", layer_grid(), "Katman 1 — profil ızgarası 3:4 kırpma"),
    ("rast-ig-kapak-katman-2-akis-4x5.png", layer_feed(), "Katman 2 — akış 4:5 kırpma"),
    ("rast-ig-kapak-katman-3-metin-guvenli.png", layer_text(), "Katman 3 — başlık/yüz güvenli alanı"),
    ("rast-ig-kapak-katman-4-reels-arayuz.png", layer_reels_ui(), "Katman 4 — Reels arayüzü (yaklaşık)"),
    ("rast-ig-kapak-katman-5-etiket-imza.png", layer_labels(), "Katman 5 — etiketler ve imza"),
]
files2 = []
for fn, img, title in layers:
    save(img, OUT2 / "katmanlar" / fn, title + " (1080x1920)", P2)
combo = blank(CW, CH)
for fn, img, _ in [layers[3], layers[0], layers[1], layers[2], layers[4]]:
    combo.alpha_composite(img)
save(combo, OUT2 / "rast-ig-reels-kapak-izgara-rehberi-1080x1920.png", "Reels kapağı ızgara kırpma rehberi 1080x1920", P2)
files2.append("rast-ig-reels-kapak-izgara-rehberi-1080x1920.png")


def post_guide(w, h, title, slug):
    img = blank(w, h)
    d = ImageDraw.Draw(img)
    gw = min(w, round(h * 3 / 4))
    gh = min(h, round(w * 4 / 3))
    gx, gy = (w - gw) // 2, (h - gh) // 2
    if gx > 0:
        d.rectangle([0, 0, gx - 1, h - 1], fill=DIM)
        d.rectangle([gx + gw, 0, w - 1, h - 1], fill=DIM)
    if gy > 0:
        d.rectangle([0, 0, w - 1, gy - 1], fill=DIM)
        d.rectangle([0, gy + gh, w - 1, h - 1], fill=DIM)
    d.rectangle([gx, gy, gx + gw - 1, gy + gh - 1], outline=AMBER, width=5)
    m = round(gw * 0.08)
    dashed_rect(d, (gx + m, gy + m, gx + gw - m, gy + gh - m), GREEN, width=4)
    pill(img, (gx + 14, gy + 14), f"Izgarada görünen: {gw}×{gh} (3:4)", font(24, True), AMBER)
    d.text((gx + m + 6, gy + gh - m - 40), f"{title} · {w}×{h}", font=font(26, True), fill=WHITE)
    credit(img, gx + gw - 24, gy + gh - 24 - 30, 0.88, P2, align="right")
    save(img, OUT2 / f"rast-ig-{slug}-{w}x{h}.png", f"Instagram {title} ızgara rehberi {w}x{h}", P2)
    files2.append(f"rast-ig-{slug}-{w}x{h}.png")


post_guide(1080, 1440, "Gönderi 3:4", "gonderi-3x4")
post_guide(1080, 1350, "Gönderi 4:5", "gonderi-4x5")
post_guide(1080, 1080, "Gönderi 1:1", "gonderi-1x1")


def grid_planner():
    tw, th, gap = 360, 480, 4
    W, H = tw * 3 + gap * 2, th * 3 + gap * 2 + 90
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    n = 1
    for row in range(3):
        for col in range(3):
            x, y = col * (tw + gap), row * (th + gap)
            d.rectangle([x, y, x + tw - 1, y + th - 1], outline=(255, 255, 255, 220), width=2, fill=(12, 12, 16, 40))
            d.text((x + tw / 2, y + th / 2), str(n), font=font(64, True), fill=(255, 255, 255, 120), anchor="mm")
            n += 1
    d.text((8, H - 74), "Profil ızgarası planlayıcı · 3 sütun · 3:4 kutu (360×480, %33)", font=font(22, True), fill=WHITE)
    credit(img, W - 8, H - 40, 0.8, P2, align="right")
    save(img, OUT2 / "rast-ig-profil-izgara-planlayici-3x3.png", "Instagram profil ızgarası planlayıcı 3x3", P2)
    files2.append("rast-ig-profil-izgara-planlayici-3x3.png")


grid_planner()
write_zip(
    OUT2 / "rast-instagram-grid-sablonlari.zip", P2, "Instagram profil ızgarası ve Reels kapağı şablonları",
    "Kullanım:\n"
    "- rast-ig-reels-kapak-izgara-rehberi-1080x1920.png: Reels kapağınızın üstüne koyun. Turuncu çerçeve\n"
    "  profil ızgarasında görünen 3:4 alan, mavi kesikli çizgi akıştaki 4:5 alan, yeşil kesikli çerçeve\n"
    "  başlık ve yüz için güvenli alan.\n"
    "- katmanlar/: aynı rehber 5 ayrı şeffaf PNG katman (Photoshop, Figma, Canva'da üst üste koyun;\n"
    "  hepsi 1080x1920 ve aynı hizada). Photoshop: Dosya > Komut Dosyaları > Dosyaları Yığına Yükle.\n"
    "- rast-ig-gonderi-*.png: 3:4, 4:5 ve 1:1 gönderilerin ızgarada nasıl kırpıldığını gösterir.\n"
    "- rast-ig-profil-izgara-planlayici-3x3.png: 9 gönderiyi yan yana planlamak için.\n"
    "Dışa aktarmadan önce rehber katmanlarını kapatın.",
    files2 + [f"katmanlar/{fn}" for fn, _, _ in layers],
)

# ================================================================ 3) kapak sablonlari
P3 = "/araclar/kapak-sablonlari/"
OUT3 = ROOT / "public" / P3.strip("/")
files3 = []

# Reels cover PNG = same layers as the grid guide, credit path of this page
rc = blank(CW, CH)
for img in [layer_reels_ui(), layer_grid(), layer_feed(), layer_text()]:
    rc.alpha_composite(img)
lab = layer_labels(with_credit=False)
rc.alpha_composite(lab)
credit(rc, 40, CH - 40 - 34, 1.0, P3)
save(rc, OUT3 / "rast-reels-kapak-1080x1920.png", "Reels kapağı şablonu 1080x1920", P3)
files3.append("rast-reels-kapak-1080x1920.png")

# YouTube thumbnail (approximate overlays; YouTube publishes no pixel geometry)
YT = {
    "w": 1280, "h": 720,
    "margin": (77, 43),          # ~6% action-safe margin
    "text": (128, 86, 1152, 634),  # central 80% x 76% for text/faces
    "badge": (1024, 600, 1280, 720),  # bottom-right fifth x sixth (duration)
    "badgeLeft": (0, 600, 256, 720),  # live / subtitle badges on some surfaces
    "progress": 22,               # bottom ~3% (resume bar)
}


def yt_png(scale):
    w, h = YT["w"] * scale, YT["h"] * scale
    s = lambda v: round(v * scale)
    img = blank(w, h)
    d = ImageDraw.Draw(img)
    bx = [s(v) for v in YT["badge"]]
    bl = [s(v) for v in YT["badgeLeft"]]
    d.rectangle([bx[0], bx[1], bx[2] - 1, bx[3] - 1], fill=DIM)
    d.rectangle([bl[0], bl[1], bl[2] - 1, bl[3] - 1], fill=DIM_SOFT)
    d.rectangle([0, h - s(YT["progress"]), w - 1, h - 1], fill=(255, 40, 40, 120))
    d.rectangle([bx[0], bx[1], bx[2] - 1, bx[3] - 1], outline=RED, width=s(3))
    # duration-badge silhouette
    d.rounded_rectangle([w - s(14) - s(96), h - s(14) - s(40) - s(22), w - s(14), h - s(14) - s(22)], radius=s(8), fill=(0, 0, 0, 200))
    d.text((w - s(14) - s(48), h - s(14) - s(20) - s(22)), "12:34", font=font(s(24), True), fill=(255, 255, 255, 240), anchor="mm")
    mx, my = s(YT["margin"][0]), s(YT["margin"][1])
    d.rectangle([mx, my, w - mx, h - my], outline=(255, 255, 255, 150), width=s(2))
    t = [s(v) for v in YT["text"]]
    dashed_rect(d, t, GREEN, width=s(4), dash=s(22), gap=s(12))
    for i in (1, 2):
        d.line([(w * i / 3, 0), (w * i / 3, h)], fill=(255, 255, 255, 50), width=s(1))
        d.line([(0, h * i / 3), (w, h * i / 3)], fill=(255, 255, 255, 50), width=s(1))
    pill(img, (t[0] + s(8), t[1] + s(8)), "Metin + yüz güvenli alanı (yaklaşık)", font(s(20), True), GREEN, pad=(s(12), s(6)))
    pill(img, (bx[0] - s(6), bx[1] - s(8)), "Süre etiketi", font(s(18), True), (255, 140, 140, 255), pad=(s(10), s(5)), anchor="rb")
    pill(img, (bl[0] + s(8), bl[1] - s(8)), "Canlı/altyazı rozeti (bazen)", font(s(16), True), WHITE, pad=(s(10), s(5)), anchor="lb")
    d = ImageDraw.Draw(img)
    d.text((mx + s(4), my - s(30)), f"YouTube küçük resmi {w}×{h} · 16:9", font=font(s(20), True), fill=WHITE)
    credit(img, bl[2] + s(16), h - s(22) - s(10) - s(28), 0.8 * scale, P3)
    return img


for sc in (1, 3):
    img = yt_png(sc)
    fn = f"rast-youtube-kucuk-resim-{1280 * sc}x{720 * sc}.png"
    save(img, OUT3 / fn, f"YouTube küçük resim şablonu {1280 * sc}x{720 * sc}", P3)
    files3.append(fn)


# --- layered SVGs (Figma/Illustrator/Inkscape keep each <g> as a named layer)
def svg_doc(w, h, title, layers_xml):
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" '
        f'width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n'
        f"<title>{title} — Rast Creative Studio (CC BY 4.0)</title>\n"
        f"<desc>Kaynak: {SITE}{P3} · Lisans: CC BY 4.0 · Atıf: Rast Creative Studio — rastcreative.com · "
        f"Değerler yaklaşıktır, son kontrol {CHECKED}. Dışa aktarmadan önce rehber katmanlarını gizleyin.</desc>\n"
        '<style>text{font-family:Inter,"Segoe UI",Roboto,Arial,sans-serif}</style>\n'
        + "\n".join(layers_xml)
        + "\n</svg>\n"
    )


def L(id_, label, inner, hidden=False):
    style = ' style="display:none"' if hidden else ""
    return f'<g id="{id_}" inkscape:groupmode="layer" inkscape:label="{label}"{style}>\n{inner}\n</g>'


def dash(x1, y1, x2, y2, color, sw=4, da="24 14"):
    return f'<rect x="{x1}" y="{y1}" width="{x2 - x1}" height="{y2 - y1}" fill="none" stroke="{color}" stroke-width="{sw}" stroke-dasharray="{da}"/>'


def svg_credit(x, y, h, path, anchor_right=False):
    lg, lw = svg_logo(0, 0, h)
    approx_text = 300 * h / 34
    total = lw + 12 + approx_text
    x0 = x - total if anchor_right else x
    lg, lw = svg_logo(x0, y, h)
    tx = x0 + lw + 12
    return (
        f'<g opacity="0.6">{lg}'
        f'<text x="{tx:.1f}" y="{y + h * 0.45:.1f}" fill="#fff" font-size="{h * 0.56:.1f}" font-weight="700">Rast Creative Studio · CC BY 4.0</text>'
        f'<text x="{tx:.1f}" y="{y + h * 0.98:.1f}" fill="#fff" font-size="{h * 0.5:.1f}">rastcreative.com{path}</text></g>'
    )


reels_svg = svg_doc(
    CW, CH, "Reels kapağı şablonu 1080x1920",
    [
        L("arka-plan", "Arka plan (görselinizi buraya)", f'<rect width="{CW}" height="{CH}" fill="#2c2a33"/>'
          f'<text x="{CW / 2}" y="1380" fill="#ffffff" fill-opacity=".35" font-size="40" text-anchor="middle">Görselinizi bu katmana koyun</text>', hidden=False),
        L("baslik", "Başlık (düzenlenebilir)",
          f'<text x="{CW / 2}" y="900" fill="#fff" font-size="110" font-weight="800" text-anchor="middle">BAŞLIK</text>'
          f'<text x="{CW / 2}" y="1010" fill="#fff" font-size="64" font-weight="600" text-anchor="middle">3–5 kelime</text>'),
        L("reels-arayuz", "Rehber · Reels arayüzü (yaklaşık)",
          f'<rect width="{CW}" height="{REELS["top"]}" fill="#0c0c10" fill-opacity=".35"/>'
          f'<rect y="{CH - REELS["bottom"]}" width="{CW}" height="{REELS["bottom"]}" fill="#0c0c10" fill-opacity=".35"/>'
          f'<rect x="{REELS["rail"]["x"]}" y="{REELS["rail"]["y1"]}" width="{CW - REELS["rail"]["x"]}" height="{REELS["rail"]["y2"] - REELS["rail"]["y1"]}" fill="#0c0c10" fill-opacity=".35"/>'),
        L("izgara-3x4", "Rehber · Profil ızgarası 3:4",
          f'<rect width="{CW}" height="{GRID[1]}" fill="#0c0c10" fill-opacity=".59"/>'
          f'<rect y="{GRID[3]}" width="{CW}" height="{CH - GRID[3]}" fill="#0c0c10" fill-opacity=".59"/>'
          f'<rect x="2.5" y="{GRID[1]}" width="{CW - 5}" height="{GRID[3] - GRID[1]}" fill="none" stroke="#ffb800" stroke-width="5"/>'
          f'<text x="24" y="{GRID[1] - 22}" fill="#ffb800" font-size="26" font-weight="700">Profil ızgarası 3:4 · 1080×1440</text>'),
        L("akis-4x5", "Rehber · Akış 4:5", dash(3, FEED[1], CW - 3, FEED[3], "#4da3ff")
          + f'<text x="{CW - 24}" y="{FEED[3] + 40}" fill="#4da3ff" font-size="24" font-weight="700" text-anchor="end">Akışta 4:5 · 1080×1350</text>'),
        L("guvenli-alan", "Rehber · Başlık + yüz güvenli alanı", dash(*TEXT_SAFE, "#3ddc84", 5)
          + f'<rect x="{GRID_ICON[0]}" y="{GRID_ICON[1]}" width="{GRID_ICON[2] - GRID_ICON[0]}" height="{GRID_ICON[3] - GRID_ICON[1]}" rx="18" fill="#0c0c10" fill-opacity=".35" stroke="#fff" stroke-opacity=".8" stroke-width="3"/>'
          + f'<text x="{TEXT_SAFE[0] + 14}" y="{TEXT_SAFE[1] + 40}" fill="#3ddc84" font-size="24" font-weight="700">Başlık + yüz güvenli alanı · 900×1200</text>'),
        L("imza", "Rast imza (rehberle birlikte gizleyin)", svg_credit(40, CH - 74, 34, P3)),
    ],
)
(OUT3 / "rast-reels-kapak-1080x1920.svg").write_text(reels_svg)
files3.append("rast-reels-kapak-1080x1920.svg")
print("wrote rast-reels-kapak-1080x1920.svg")

b, bl_, t = YT["badge"], YT["badgeLeft"], YT["text"]
yt_svg = svg_doc(
    1280, 720, "YouTube küçük resim şablonu 1280x720",
    [
        L("arka-plan", "Arka plan (görselinizi buraya)", '<rect width="1280" height="720" fill="#2c2a33"/>'
          '<text x="860" y="560" fill="#fff" fill-opacity=".35" font-size="28" text-anchor="middle">Görselinizi bu katmana koyun</text>'),
        L("baslik", "Başlık (düzenlenebilir)", '<text x="160" y="330" fill="#fff" font-size="96" font-weight="800">BAŞLIK</text>'
          '<text x="160" y="410" fill="#fff" font-size="48" font-weight="600">en fazla 3–4 kelime</text>'),
        L("ucte-bir", "Rehber · Üçte bir çizgileri",
          "".join(f'<line x1="{1280 * i / 3:.1f}" y1="0" x2="{1280 * i / 3:.1f}" y2="720" stroke="#fff" stroke-opacity=".2"/>'
                  f'<line x1="0" y1="{720 * i / 3:.1f}" x2="1280" y2="{720 * i / 3:.1f}" stroke="#fff" stroke-opacity=".2"/>' for i in (1, 2))),
        L("kenar-payi", "Rehber · %6 kenar payı",
          f'<rect x="{YT["margin"][0]}" y="{YT["margin"][1]}" width="{1280 - 2 * YT["margin"][0]}" height="{720 - 2 * YT["margin"][1]}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>'),
        L("guvenli-alan", "Rehber · Metin + yüz güvenli alanı", dash(*t, "#3ddc84", 4, "22 12")),
        L("sure-etiketi", "Rehber · Süre etiketi + ilerleme çubuğu (yaklaşık)",
          f'<rect x="{b[0]}" y="{b[1]}" width="{b[2] - b[0]}" height="{b[3] - b[1]}" fill="#0c0c10" fill-opacity=".59" stroke="#ff4d4d" stroke-width="3"/>'
          f'<rect x="{bl_[0]}" y="{bl_[1]}" width="{bl_[2] - bl_[0]}" height="{bl_[3] - bl_[1]}" fill="#0c0c10" fill-opacity=".35"/>'
          f'<rect y="{720 - YT["progress"]}" width="1280" height="{YT["progress"]}" fill="#ff2828" fill-opacity=".47"/>'
          '<rect x="1170" y="644" width="96" height="40" rx="8" fill="#000" fill-opacity=".78"/>'
          '<text x="1218" y="672" fill="#fff" font-size="24" font-weight="700" text-anchor="middle">12:34</text>'),
        L("imza", "Rast imza (rehberle birlikte gizleyin)", svg_credit(272, 720 - 22 - 10 - 28, 28, P3)),
    ],
)
(OUT3 / "rast-youtube-kucuk-resim-1280x720.svg").write_text(yt_svg)
files3.append("rast-youtube-kucuk-resim-1280x720.svg")
print("wrote rast-youtube-kucuk-resim-1280x720.svg")

write_zip(
    OUT3 / "rast-kapak-sablonlari.zip", P3, "Reels kapağı ve YouTube küçük resim şablonları",
    "Kullanım:\n"
    "- PNG'ler şeffaf rehberdir: tasarımınızın en üst katmanına koyun, metni ve yüzü yeşil kesikli\n"
    "  çerçevenin içinde tutun, dışa aktarmadan önce katmanı kapatın.\n"
    "- SVG'ler katmanlıdır (Arka plan, Başlık, Rehber katmanları, İmza). Figma'ya sürükleyin ya da\n"
    "  Illustrator/Inkscape'te açın; Canva'da PNG'yi kullanın. Rehber ve imza katmanlarını\n"
    "  dışa aktarmadan önce gizleyin.\n"
    "- YouTube: Google artık 3840x2160 küçük resim öneriyor; 1280x720 hâlâ standart en düşük\n"
    "  kalite boyutudur. 3840x2160 PNG ve ölçeklenebilir SVG pakette.\n"
    "- Süre etiketi, ilerleme çubuğu ve kırpma değerleri YouTube ve Instagram tarafından piksel\n"
    "  olarak yayımlanmaz; buradakiler gözleme dayalı yaklaşık değerlerdir.",
    files3,
)

# --- data file the pages share (keeps page copy and PNGs in sync)
data = {
    "_note": "Generated by scripts/generate-creator-templates.py; approximate values, see page sources.",
    "checked": CHECKED,
    "cover": {"w": CW, "h": CH, "grid": GRID, "feed": FEED, "textSafe": TEXT_SAFE, "gridIcon": GRID_ICON},
    "youtube": YT,
}
(ROOT / "src/pages/araclar/_yaratici/templates.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
print("wrote src/pages/araclar/_yaratici/templates.json")
