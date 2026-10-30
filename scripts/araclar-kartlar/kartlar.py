#!/usr/bin/env python3
"""
Card preview images for the /araclar/ gallery (public/araclar/kartlar/*.webp).

Each card shows the real tool "in action": the built site is opened in headless
Chromium, a sample photo/subtitle/plan is loaded into the tool, the tool element
is captured, and the capture is framed on a dark cinematic card (960×720 + 480×360).
Packs and documents use their own files (PDF page previews, LUT before/after,
SFX waveforms via ffmpeg showwavespic).

Run after `npx astro build`, with dist/ served on a free port:
  (cd dist && python3 -m http.server 48613 --bind 127.0.0.1) &
  python3 scripts/araclar-kartlar/kartlar.py http://127.0.0.1:48613
Needs: node 22+, Chromium (see shoot.mjs env CHROME / CHROME_LIBS), ffmpeg, Pillow.
Sample frames are Pexels stock (kaynaklar.json, one photo per card) composed with Turkish
hook/caption text; sources documented in docs/sections/araclar-gorseller.md. Everything it
writes into dist/_ornek is throwaway (the next build replaces dist/).
"""
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:48613").rstrip("/")
DIST = ROOT / "dist"
WORK = DIST / "_ornek"
OUT = ROOT / "public" / "araclar" / "kartlar"
FFMPEG = os.environ.get("FFMPEG") or shutil.which("ffmpeg") or str(Path.home() / ".hermes/tools/ffmpeg-9.0.1-linux-x64/bin/ffmpeg")
NODE = shutil.which("node") or str(Path.home() / ".hermes/tools/node-26.12.1-linux-x64/bin/node")
ONLY = set(sys.argv[2].split(",")) if len(sys.argv) > 2 else None


def shoot(jobs, name):
    p = WORK / f"{name}.json"
    p.write_text(json.dumps(jobs))
    r = subprocess.run([NODE, str(HERE / "shoot.mjs"), str(p)], capture_output=True, text=True, timeout=600)
    if r.returncode:
        sys.exit(r.stderr)
    for row in json.loads(r.stdout or "[]"):
        if row.get("err") or row.get("jsErrors") or (row.get("result") or {}).get("missing"):
            print("WARN", row)


# ── 1. samples ──────────────────────────────────────────────────────────────
# Stock frames (Pexels License) listed in kaynaklar.json; every card gets its own photo.
WORK.mkdir(parents=True, exist_ok=True)
for d in ("raw", "src", "kare"):
    (WORK / d).mkdir(exist_ok=True)
CACHE = HERE / ".cache"
CACHE.mkdir(exist_ok=True)
SRC = json.loads((HERE / "kaynaklar.json").read_text())["items"]
for key, it in SRC.items():
    f = CACHE / f"{key}-{it['id']}.jpg"
    if not f.exists() or f.stat().st_size < 10000:
        kind = "videos" if it["type"] == "video" else "photos"
        url = f"https://images.pexels.com/{kind}/{it['id']}/pexels-photo-{it['id']}.jpeg?auto=compress&{it['q']}"
        subprocess.run(["curl", "-sfL", "--retry", "4", "--retry-all-errors", "--retry-delay", "2", "-A", "Mozilla/5.0", "-o", str(f), url], check=True)
    Image.open(f).convert("RGB").save(WORK / "src" / f"{key}.jpg", quality=88)

FONT = """@font-face{font-family:SG;src:url(/fonts/space-grotesk-latin-wght-normal.woff2) format('woff2');font-weight:300 700}
@font-face{font-family:SG;src:url(/fonts/space-grotesk-latin-ext-wght-normal.woff2) format('woff2');font-weight:300 700;unicode-range:U+0100-02BA}"""
S = "/_ornek/src/"


def frame(key, w, h, body="", pos="center", extra=""):
    return (f'<!doctype html><html lang="tr"><meta charset="utf-8"><style>{FONT}*{{margin:0;box-sizing:border-box}}'
            f'html,body{{width:{w}px;height:{h}px;overflow:hidden;background:#000;font-family:SG,sans-serif}}'
            f'.bg{{position:absolute;inset:0;background:url({S}{key}.jpg) {pos}/cover}}'
            '.hook{position:absolute;left:50%;transform:translateX(-50%);background:#fff;color:#111;font:700 70px/1.12 SG;padding:20px 34px 24px;border-radius:22px;text-align:center;width:max-content;max-width:880px;box-shadow:0 10px 30px rgba(0,0,0,.35)}'
            '.cap{position:absolute;left:90px;right:170px;text-align:center;color:#fff;font:700 74px/1.12 SG;-webkit-text-stroke:12px #000;paint-order:stroke fill;letter-spacing:-.01em}'
            '.cap em{font-style:normal;color:#FFD23F}'
            '.cov{position:absolute;left:70px;right:70px;text-align:center;color:#fff;font:700 112px/1 SG;letter-spacing:-.02em;text-shadow:0 6px 30px rgba(0,0,0,.6)}'
            '.cov i{display:block;width:120px;height:12px;background:#FF6A1A;margin:0 auto 34px;border-radius:6px}'
            '.shade{position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(0,0,0,.55) 80%)}'
            f'{extra}</style><div class="bg"></div>{body}</html>')


def th(key, hook, cap, pos="center", hook_y=330, cap_y=1230):
    hk = f'<div class="hook" style="top:{hook_y}px">{hook}</div>' if hook else ""
    cp = f'<div class="cap" style="top:{cap_y}px">{cap}</div>' if cap else ""
    return frame(key, 1080, 1920, hk + cp, pos)


def cover(key, title, pos="center"):
    return frame(key, 1080, 1920, f'<div class="shade"></div><div class="cov" style="top:1130px"><i></i>{title}</div>', pos)


KARE = {
    # 9:16 talking heads with Turkish hook + caption (so UI overlays visibly matter)
    "dikey-reels": (th("th-reels", "Bunu kimse söylemiyor…", "Yazını <em>buraya</em> koy", "50% 30%"), 1080, 1920),
    "dikey-tiktok": (th("th-tiktok", "İlk 3 saniye her şey", "Kanca <em>üstte</em> kalsın", "55% 30%"), 1080, 1920),
    "dikey-altyazi": (th("th-altyazi", "", "Sessize alanlar da <em>altyazıyı</em> okur", "40% 40%", cap_y=1180), 1080, 1920),
    "dikey-kapak": (frame("th-kapak", 1080, 1920, "", "50% 30%"), 1080, 1920),
    "yt-kucuk": (frame("th-youtube", 1280, 720,
        '<div style="position:absolute;inset:0;background:linear-gradient(90deg,transparent 35%,rgba(0,0,0,.72) 70%)"></div>'
        '<div style="position:absolute;right:60px;top:150px;width:560px;color:#fff;font:700 96px/.98 SG;letter-spacing:-.03em;text-shadow:0 6px 24px rgba(0,0,0,.6)">'
        'Telefonla <span style="color:#FFD23F">sinematik</span> çekim</div>', "25% 40%"), 1280, 720),
    "yatay-roportaj": (frame("th-enboy", 1920, 1080, "", "center"), 1920, 1080),
    # Instagram grid: nine different, coherent covers
    "g1": (cover("g-th1", "Marka hikâyemiz", "50% 35%"), 1080, 1920),
    "g2": (cover("g-burger", "Yeni menü"), 1080, 1920),
    "g3": (cover("g-th2", "Soru-cevap", "50% 35%"), 1080, 1920),
    "g4": (cover("g-latte", "Sabah kahvesi"), 1080, 1920),
    "g5": (cover("g-urun", "Ürün incelemesi", "50% 30%"), 1080, 1920),
    "g6": (cover("g-pasta", "Taze çıktı"), 1080, 1920),
    "g7": (cover("g-istanbul", "İstanbul'da 24 saat"), 1080, 1920),
    "g8": (cover("g-th3", "Ofiste bir gün", "50% 30%"), 1080, 1920),
    "g9": (cover("g-cilt", "Akşam rutini"), 1080, 1920),
}
for k, (html, w, h) in KARE.items():
    (WORK / "kare" / f"{k}.html").write_text(html)
if not ONLY or "capture" in ONLY:
    shoot([{"url": f"{BASE}/_ornek/kare/{k}.html", "out": str(WORK / f"{k}.jpg"), "w": w, "h": h, "scale": 1, "wait": 900} for k, (_, w, h) in KARE.items()], "kare")
    # sample frame for the safe-zone tool's "Örnek kareyle dene" button (served from public/)
    Image.open(WORK / "dikey-reels.jpg").convert("RGB").save(ROOT / "public/araclar/guvenli-alan/rast-ornek-kare-1080x1920.jpg", quality=80, optimize=True, progressive=True)

# LUT before/after: own .cube from the pack on a golden-hour portrait
lut_src = Image.open(WORK / "src" / "lut.jpg").convert("RGB")
w, h = lut_src.size
ch = int(w * 3 / 4)
lut_src.crop((0, int((h - ch) * 0.3), w, int((h - ch) * 0.3) + ch)).resize((960, 720), Image.Resampling.LANCZOS).save(WORK / "lut-once.jpg", quality=92)
LUT = "rast-soguk-gece"
cube = WORK / f"{LUT}.cube"
subprocess.run(["unzip", "-o", "-j", "-q", str(ROOT / "public/araclar/lut-paketi/rast-lut-pack.zip"), f"*{LUT}.cube", "-d", str(WORK)], check=True)
subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", str(WORK / "lut-once.jpg"), "-vf", f"lut3d={cube}", "-q:v", "2", str(WORK / "lut-sonra.jpg")], check=True)

# ── 2. live tool captures ───────────────────────────────────────────────────
H = """const st=document.createElement('style');st.textContent='.ev-head,.ev-grain,.ev-wa{display:none!important}';document.head.append(st);
const sl=(m)=>new Promise(r=>setTimeout(r,m));
const load=async(sel,urls,type='image/jpeg')=>{const dt=new DataTransfer();for(const u of urls){const b=await (await fetch(u)).blob();dt.items.add(new File([b],u.split('/').pop(),{type}));}const i=document.querySelector(sel);i.files=dt.files;i.dispatchEvent(new Event('change',{bubbles:true}));};
const rect=(sel)=>{const e=document.querySelector(sel);if(!e)return {missing:sel};e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {clip:{x:r.left+scrollX,y:r.top+scrollY,width:r.width,height:r.height}}};
"""
NINE = "[" + ",".join(f"'/_ornek/g{i}.jpg'" for i in range(1, 10)) + "]"
CAP = {
    "guvenli-reels": ("araclar/guvenli-alan", "await load('[data-tool] [data-file]',['/_ornek/dikey-reels.jpg']);await sl(800);return rect('.frame');"),
    "guvenli-tiktok": ("araclar/guvenli-alan", "await load('[data-tool] [data-file]',['/_ornek/dikey-tiktok.jpg']);await sl(600);document.querySelector('input[name=platform][value=tiktok]').click();await sl(600);return rect('.frame');"),
    "bitrate-result": ("araclar/bitrate-hesaplayici", "return rect('[data-calc] .result');"),
    "enboy-src": ("araclar/en-boy-orani", "await load('[data-tool] [data-file]',['/_ornek/yatay-roportaj.jpg']);await sl(800);return rect('[data-canvas]');"),
    "enboy-out": ("araclar/en-boy-orani", "await load('[data-tool] [data-file]',['/_ornek/yatay-roportaj.jpg']);await sl(800);return rect('[data-out]');"),
    "altyazi": ("araclar/altyazi-kontrolu", "document.querySelector('[data-sample]').click();await sl(500);document.querySelector('[data-check]')?.click();await sl(800);return rect('[data-results] table') ;"),
    "kapak-wrap": ("araclar/kapak-sablonlari", "await load('[data-tool] [data-file]',['/_ornek/dikey-kapak.jpg']);await sl(800);const t=document.querySelector('[data-title]');t.value='Çekim günü: 5 hata';t.dispatchEvent(new Event('input',{bubbles:true}));await sl(700);return rect('[data-wrap]');"),
    "ig-grid": ("araclar/instagram-grid-sablonu", f"await load('[data-tool] [data-file]',{NINE});await sl(1500);return rect('[data-grid]');"),
    "planlayici": ("cekim-planlayici", "const gs=[...document.querySelectorAll('[data-planner] .chips')];for(const g of gs){const ls=[...g.querySelectorAll('label')];[0,2,3].forEach(i=>ls[i]&&ls[i].click());}await sl(300);document.querySelector('[data-planner] button[type=submit]')?.click();await sl(800);return rect('[data-planner]');"),
    "export": ("rehber/video-export-ayarlari", "return rect('.quick');"),
}
if not ONLY or "capture" in ONLY:
    shoot([{"url": f"{BASE}/{p}/", "out": str(WORK / "raw" / f"{k}.png"), "w": 1440, "h": 1000, "scale": 2, "wait": 700, "js": H + js, "after": 500} for k, (p, js) in CAP.items()], "capture")

# ── 3. waveforms ────────────────────────────────────────────────────────────
WAVES = ["whoosh-uzun-derin", "riser-gerilim", "impact-derin", "glitch-vhs", "swell-logo-parlama"]
for n in WAVES:
    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", str(ROOT / f"public/araclar/sfx-paketi/onizleme/rast-sfx-{n}.mp3"),
                    "-filter_complex", "aformat=channel_layouts=mono,showwavespic=s=1600x260:colors=#FF6A1A:draw=full", "-frames:v", "1",
                    str(WORK / f"wave-{n}.png")], check=True)

# ── 4. compose cards (HTML → Chromium) ──────────────────────────────────────
A = "/araclar"
CSS = FONT + """
*{box-sizing:border-box;margin:0}
html,body{width:960px;height:720px;overflow:hidden;background:#110f0d}
.c{position:relative;width:960px;height:720px;overflow:hidden;font-family:SG,sans-serif;color:#f4efe8;
 background:radial-gradient(70% 70% at 88% 0%,rgba(226,83,3,.42),transparent 62%),radial-gradient(60% 60% at 0% 100%,rgba(255,106,26,.12),transparent 70%),linear-gradient(180deg,#1b1714,#0f0d0b)}
.c:after{content:"";position:absolute;inset:0;opacity:.08;pointer-events:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.bgp{position:absolute;inset:0;background-size:cover;background-position:center}
.dim{position:absolute;inset:0;background:radial-gradient(80% 80% at 50% 45%,rgba(0,0,0,.15),rgba(0,0,0,.6))}
.vf{position:absolute;inset:26px;pointer-events:none;z-index:5}
.vf i{position:absolute;width:34px;height:34px;border:2px solid rgba(244,239,232,.32)}
.vf i:nth-child(1){left:0;top:0;border-right:0;border-bottom:0}.vf i:nth-child(2){right:0;top:0;border-left:0;border-bottom:0}
.vf i:nth-child(3){left:0;bottom:0;border-right:0;border-top:0}.vf i:nth-child(4){right:0;bottom:0;border-left:0;border-top:0}
.rec{position:absolute;left:58px;top:50px;display:flex;gap:10px;align-items:center;font:600 17px/1 SG;letter-spacing:.16em;color:rgba(244,239,232,.75);text-transform:uppercase;z-index:5;text-shadow:0 1px 6px rgba(0,0,0,.6)}
.rec b{width:11px;height:11px;border-radius:50%;background:#FF6A1A;box-shadow:0 0 12px #FF6A1A}
.win{position:absolute;border-radius:16px;overflow:hidden;background:#f4efe8;box-shadow:0 40px 80px -30px rgba(0,0,0,.85),0 0 0 1px rgba(255,255,255,.12)}
.win img,.ph img{display:block;width:100%;height:auto}
.pp img{display:block;height:100%;width:auto}
.ph{position:absolute;border-radius:30px;overflow:hidden;border:7px solid #26211d;background:#000;box-shadow:0 40px 80px -24px rgba(0,0,0,.9),0 0 0 1px rgba(255,255,255,.14)}
.desk{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;transform:perspective(1600px) rotateX(9deg);transform-origin:50% 50%}
.pp{position:relative;flex:none;background:#fff;border-radius:3px;overflow:hidden;box-shadow:0 2px 2px rgba(0,0,0,.3),0 30px 40px -10px rgba(0,0,0,.75),0 70px 90px -30px rgba(0,0,0,.8);transform-origin:50% 100%}
.pp:after{content:"";position:absolute;inset:0;background:linear-gradient(160deg,rgba(255,255,255,.12),transparent 40%,rgba(0,0,0,.16))}
.tag{position:absolute;padding:9px 16px;border-radius:999px;font:600 18px/1 SG;letter-spacing:.08em;text-transform:uppercase;background:rgba(17,15,13,.8);color:#f4efe8;border:1px solid rgba(255,255,255,.22);z-index:4}
.tag.o{background:#E25303;border-color:#FF6A1A}
.hud{position:absolute;font:600 17px/1 SG;letter-spacing:.12em;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.7);z-index:4}
"""
VF = '<div class="vf"><i></i><i></i><i></i><i></i></div>'


def card(body, label=""):
    rec = f'<div class="rec"><b></b>{label}</div>' if label else ""
    return f'<!doctype html><html lang="tr"><meta charset="utf-8"><style>{CSS}</style><div class="c">{body}{VF}{rec}</div></html>'


def bgp(key, pos="center", f="", dim=True):
    st = f"background-image:url({S}{key}.jpg);background-position:{pos};" + (f"filter:{f};" if f else "")
    return f'<div class="bgp" style="{st}"></div>' + ('<div class="dim"></div>' if dim else "")


def docs(key, back, front, pos="center", f="brightness(.62)", h=520, overlap=250, dy=26, rot=4, sh=-9):
    """Two pages on a real desk photo, centred as a group (flex), fully visible, light symmetric perspective."""
    return card(bgp(key, pos, f) + f"""<div class="desk" style="inset:{max(0, 2 * sh)}px 0 {max(0, -2 * sh)}px 0">
      <div class="pp" style="height:{h}px;margin-right:-{overlap}px;transform:translateY(-{dy}px) rotate(-{rot}deg)"><img src="{back}"></div>
      <div class="pp" style="height:{h}px;transform:translateY({dy}px) rotate({rot}deg)"><img src="{front}"></div></div>""")


R = "/_ornek/raw/"
ICON = {
    "Whoosh": '<path d="M3 9h11a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 17h7" />',
    "Riser": '<path d="M4 20 20 4M20 4h-8M20 4v8" />',
    "Impact": '<path d="M12 2v5M12 17v5M2 12h5M17 12h5M5 5l3.5 3.5M15.5 15.5 19 19M19 5l-3.5 3.5M8.5 15.5 5 19" />',
    "Glitch": '<path d="M3 12h4l2-6 3 12 2-8 2 4h5" />',
    "Swell": '<path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" />',
}
CARDS = {
    "guvenli-alan": card(bgp("th-tiktok", "50% 30%", "blur(18px) brightness(.45)") + f"""
      <div class="ph" style="left:170px;top:80px;width:330px;transform:rotate(-4deg)"><img src="{R}guvenli-tiktok.png"></div>
      <div class="ph" style="left:440px;top:54px;width:350px;transform:rotate(3deg)"><img src="{R}guvenli-reels.png"></div>
      <span class="tag" style="left:86px;top:560px">TikTok</span><span class="tag o" style="left:700px;top:118px">Reels</span>"""),
    "bitrate-hesaplayici": card(bgp("bitrate", "center 60%", "brightness(.85)", dim=False) + f"""
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.25),transparent 30%,transparent 50%,rgba(0,0,0,.75))"></div>
      <div class="hud" style="right:60px;top:52px">UHD 3840×2160 · 25P</div>
      <div style="position:absolute;left:300px;top:150px;width:360px;height:250px;border:2px solid rgba(255,255,255,.55)"></div>
      <div class="hud" style="left:304px;top:410px;font-size:14px;opacity:.8">4K · H.264 / H.265</div>
      <div class="win" style="left:80px;top:470px;width:800px;height:170px;outline:3px solid #FF6A1A"><img src="{R}bitrate-result.png" style="width:1250px;max-width:none"></div>""", "Hesap"),
    "en-boy-orani": card(f"""
      <div class="win" style="left:70px;top:179px;width:640px;background:#000"><img src="{R}enboy-src.png"></div>
      <span class="tag" style="left:90px;top:569px">16:9 kayıt</span>
      <div class="ph" style="left:590px;top:99px;width:300px"><img src="{R}enboy-out.png"></div>
      <span class="tag o" style="left:750px;top:629px">9:16</span>"""),
    "altyazi-kontrolu": card(f"""
      <div class="win" style="left:38px;top:144px;width:560px;height:430px"><img src="{R}altyazi.png" style="width:1150px;max-width:none;margin-left:-20px"></div>
      <div class="ph" style="left:608px;top:74px;width:300px;transform:rotate(3deg)"><img src="/_ornek/dikey-altyazi.jpg"></div>
      <span class="tag o" style="left:38px;top:614px">5 altyazıda hata</span><span class="tag" style="left:300px;top:614px">Düzeltilmiş SRT</span>""", "SRT · VTT"),
    "cekim-plani": docs("d-plan", f"{A}/cekim-plani/rast-ornek-cekim-plani-onizleme-2.webp", f"{A}/cekim-plani/rast-ornek-cekim-plani-onizleme-1.webp", "30% 50%"),
    "cekim-planlayici": card(bgp("planlayici", "center", "blur(3px) brightness(.55)") + f"""
      <div class="win" style="left:110px;top:90px;width:740px;height:540px;background:#efe8df"><img src="{R}planlayici.png"></div>""", "Plan"),
    "video-export-ayarlari": card(bgp("export", "center", "blur(2px) brightness(.55)") + f"""
      <div class="win" style="left:80px;top:215px;width:800px"><img src="{R}export.png"></div>
      <div style="position:absolute;left:0;right:0;top:465px;display:flex;justify-content:center;gap:14px"><span class="tag o" style="position:static">H.264 · 1080p</span><span class="tag" style="position:static">H.265 · 4K</span></div>""", "Export"),
    "instagram-grid-sablonu": card(bgp("g-latte", "center", "blur(22px) brightness(.4)") + f"""
      <div class="ph" style="left:315px;top:65px;width:330px"><img src="{R}ig-grid.png"></div>
      <span class="tag o" style="left:670px;top:330px">3:4 ızgara</span>"""),
    "kapak-sablonlari": card(f"""
      <div class="win" style="left:55px;top:215px;width:580px;background:#000;position:absolute"><img src="/_ornek/yt-kucuk.jpg"><img src="{A}/kapak-sablonlari/rast-youtube-kucuk-resim-1280x720.png" style="position:absolute;inset:0;opacity:.9"></div>
      <span class="tag" style="left:75px;top:577px">YouTube 1280×720</span>
      <div class="ph" style="left:575px;top:81px;width:320px;transform:rotate(2deg)"><img src="{R}kapak-wrap.png"></div>
      <span class="tag o" style="left:715px;top:640px">Reels kapak</span>"""),
    "storyboard-sablonu": docs("d-storyboard", f"{A}/storyboard-sablonu/rast-storyboard-9x16-onizleme-1.webp", f"{A}/storyboard-sablonu/rast-storyboard-16x9-onizleme-1.webp", h=340, overlap=300, dy=70, rot=3, sh=-6),
    "brief-formu": docs("d-brief", f"{A}/brief-formu/rast-video-brief-formu-onizleme-2.webp", f"{A}/brief-formu/rast-video-brief-formu-onizleme-1.webp"),
    "cekim-kontrol-listesi": docs("d-checklist", f"{A}/cekim-kontrol-listesi/rast-cekim-gunu-kontrol-listesi-onizleme-2.webp", f"{A}/cekim-kontrol-listesi/rast-cekim-gunu-kontrol-listesi-onizleme-1.webp", f="brightness(.8)"),
    "cekim-izin-formu": docs("d-izin", f"{A}/cekim-izin-formu/rast-goruntu-ve-ses-kullanim-izin-formu-onizleme-2.webp", f"{A}/cekim-izin-formu/rast-goruntu-ve-ses-kullanim-izin-formu-onizleme-1.webp"),
    "sfx-paketi": card(
        "".join(
            f'<img src="/_ornek/wave-{n}.png" style="position:absolute;left:150px;top:{112 + i * 104}px;width:760px;height:110px;opacity:{1 - i * 0.1}">'
            f'<span style="position:absolute;left:60px;top:{122 + i * 104}px;width:74px;height:74px;border-radius:18px;background:rgba(255,106,26,.14);border:1px solid rgba(255,106,26,.5);display:grid;place-items:center">'
            f'<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF8A45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{ICON[lab]}</svg></span>'
            f'<span class="tag" style="left:160px;top:{150 + i * 104}px;font-size:15px;padding:7px 12px">{lab}</span>'
            for i, (n, lab) in enumerate(zip(WAVES, ["Whoosh", "Riser", "Impact", "Glitch", "Swell"]))
        ), "WAV · 48 kHz"),
    "lut-paketi": card("""
      <div style="position:absolute;inset:0;background:url(/_ornek/lut-once.jpg) center/cover"></div>
      <div style="position:absolute;inset:0;clip-path:inset(0 0 0 50%);background:url(/_ornek/lut-sonra.jpg) center/cover"></div>
      <div style="position:absolute;left:479px;top:0;bottom:0;width:3px;background:#fff;box-shadow:0 0 18px rgba(0,0,0,.6)"></div>
      <div style="position:absolute;left:456px;top:336px;width:48px;height:48px;border-radius:50%;background:#fff;box-shadow:0 6px 18px rgba(0,0,0,.5)"></div>
      <span class="tag" style="left:40px;top:640px">Önce</span><span class="tag o" style="right:40px;top:640px">Sonra · Soğuk Gece</span>"""),
}
(WORK / "kart").mkdir(exist_ok=True)
jobs = []
for slug, html in CARDS.items():
    if ONLY and slug not in ONLY and "all" not in ONLY and "capture" not in ONLY:
        continue
    (WORK / "kart" / f"{slug}.html").write_text(html)
    jobs.append({"url": f"{BASE}/_ornek/kart/{slug}.html", "out": str(WORK / "kart" / f"{slug}.png"), "w": 960, "h": 720, "scale": 1, "wait": 900})
shoot(jobs, "compose")

OUT.mkdir(parents=True, exist_ok=True)
for j in jobs:
    slug = Path(j["out"]).stem
    im = Image.open(j["out"]).convert("RGB")
    im.save(OUT / f"{slug}.webp", quality=78, method=6)
    im.resize((480, 360), Image.Resampling.LANCZOS).save(OUT / f"{slug}-480.webp", quality=76, method=6)
    print(slug, (OUT / f"{slug}.webp").stat().st_size // 1024, "KB")
