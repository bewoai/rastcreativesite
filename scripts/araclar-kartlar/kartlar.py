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
Sample photos come from src/assets/photos/bts (our own BTS frames). Everything it
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
WORK.mkdir(parents=True, exist_ok=True)
(WORK / "raw").mkdir(exist_ok=True)
bts = ROOT / "src/assets/photos/bts"
for f in bts.glob("*.jpg"):
    Image.open(f).convert("RGB").save(WORK / f.name, quality=86)
im = Image.open(bts / "sokak-kadraj.jpg")
w, h = im.size
cw = int(h * 9 / 16)
im.crop(((w - cw) // 2, 0, (w + cw) // 2, h)).resize((1080, 1920)).save(WORK / "dikey.jpg", quality=86)

# ── 2. live tool captures ───────────────────────────────────────────────────
H = """const st=document.createElement('style');st.textContent='.ev-head,.ev-grain,.ev-wa{display:none!important}';document.head.append(st);
const sl=(m)=>new Promise(r=>setTimeout(r,m));
const load=async(sel,urls,type='image/jpeg')=>{const dt=new DataTransfer();for(const u of urls){const b=await (await fetch(u)).blob();dt.items.add(new File([b],u.split('/').pop(),{type}));}const i=document.querySelector(sel);i.files=dt.files;i.dispatchEvent(new Event('change',{bubbles:true}));};
const rect=(sel)=>{const e=document.querySelector(sel);if(!e)return {missing:sel};e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {clip:{x:r.left+scrollX,y:r.top+scrollY,width:r.width,height:r.height}}};
"""
SIX = "['/_ornek/magaza-showroom.jpg','/_ornek/etkinlik-sahne.jpg','/_ornek/ofis-isik-kurulumu.jpg','/_ornek/kamera-roportaj.jpg','/_ornek/sokak-kadraj.jpg','/_ornek/medikal-radyoterapi.jpg']"
CAP = {
    "guvenli-reels": ("araclar/guvenli-alan", "await load('[data-tool] [data-file]',['/_ornek/dikey.jpg']);await sl(800);return rect('.frame');"),
    "guvenli-tiktok": ("araclar/guvenli-alan", "await load('[data-tool] [data-file]',['/_ornek/dikey.jpg']);await sl(600);document.querySelector('input[name=platform][value=tiktok]').click();await sl(600);return rect('.frame');"),
    "bitrate-col": ("araclar/bitrate-hesaplayici", "return rect('[data-calc] .grid .col');"),
    "bitrate-result": ("araclar/bitrate-hesaplayici", "return rect('[data-calc] .result');"),
    "enboy-src": ("araclar/en-boy-orani", "await load('[data-tool] [data-file]',['/_ornek/kamera-roportaj.jpg']);await sl(800);return rect('[data-canvas]');"),
    "enboy-out": ("araclar/en-boy-orani", "await load('[data-tool] [data-file]',['/_ornek/kamera-roportaj.jpg']);await sl(800);return rect('[data-out]');"),
    "altyazi": ("araclar/altyazi-kontrolu", "document.querySelector('[data-sample]').click();await sl(500);document.querySelector('[data-check]')?.click();await sl(800);return rect('[data-results] table') ;"),
    "kapak-wrap": ("araclar/kapak-sablonlari", "await load('[data-tool] [data-file]',['/_ornek/dikey.jpg']);await sl(1000);return rect('[data-wrap]');"),
    "ig-grid": ("araclar/instagram-grid-sablonu", f"await load('[data-tool] [data-file]',{SIX});await sl(1200);return rect('[data-grid]');"),
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
CSS = """
@font-face{font-family:SG;src:url(/fonts/space-grotesk-latin-wght-normal.woff2) format('woff2');font-weight:300 700}
@font-face{font-family:SG;src:url(/fonts/space-grotesk-latin-ext-wght-normal.woff2) format('woff2');font-weight:300 700;unicode-range:U+0100-02BA}
*{box-sizing:border-box;margin:0}
html,body{width:960px;height:720px;overflow:hidden;background:#110f0d}
.c{position:relative;width:960px;height:720px;overflow:hidden;font-family:SG,sans-serif;color:#f4efe8;
 background:radial-gradient(70% 70% at 88% 0%,rgba(226,83,3,.42),transparent 62%),radial-gradient(60% 60% at 0% 100%,rgba(255,106,26,.12),transparent 70%),linear-gradient(180deg,#1b1714,#0f0d0b)}
.c:after{content:"";position:absolute;inset:0;opacity:.08;pointer-events:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.vf{position:absolute;inset:26px;pointer-events:none}
.vf i{position:absolute;width:34px;height:34px;border:2px solid rgba(244,239,232,.28)}
.vf i:nth-child(1){left:0;top:0;border-right:0;border-bottom:0}.vf i:nth-child(2){right:0;top:0;border-left:0;border-bottom:0}
.vf i:nth-child(3){left:0;bottom:0;border-right:0;border-top:0}.vf i:nth-child(4){right:0;bottom:0;border-left:0;border-top:0}
.rec{position:absolute;left:58px;top:50px;display:flex;gap:10px;align-items:center;font:600 17px/1 SG;letter-spacing:.16em;color:rgba(244,239,232,.62);text-transform:uppercase}
.rec b{width:11px;height:11px;border-radius:50%;background:#FF6A1A;box-shadow:0 0 12px #FF6A1A}
.win{position:absolute;border-radius:16px;overflow:hidden;background:#f4efe8;box-shadow:0 40px 80px -30px rgba(0,0,0,.85),0 0 0 1px rgba(255,255,255,.12)}
.win img,.ph img,.pp img{display:block;width:100%;height:auto}
.ph{position:absolute;border-radius:30px;overflow:hidden;border:7px solid #26211d;background:#000;box-shadow:0 40px 80px -24px rgba(0,0,0,.9),0 0 0 1px rgba(255,255,255,.14)}
.pp{position:absolute;background:#fff;box-shadow:0 40px 70px -28px rgba(0,0,0,.9);border-radius:4px;overflow:hidden}
.tag{position:absolute;padding:9px 16px;border-radius:999px;font:600 18px/1 SG;letter-spacing:.08em;text-transform:uppercase;background:rgba(17,15,13,.78);color:#f4efe8;border:1px solid rgba(255,255,255,.2)}
.tag.o{background:#E25303;border-color:#FF6A1A}
"""
VF = '<div class="vf"><i></i><i></i><i></i><i></i></div>'


def card(body, label=""):
    rec = f'<div class="rec"><b></b>{label}</div>' if label else ""
    return f'<!doctype html><meta charset="utf-8"><style>{CSS}</style><div class="c">{VF}{rec}{body}</div>'


R = "/_ornek/raw/"
CARDS = {
    "guvenli-alan": card(f"""
      <div class="ph" style="left:190px;top:96px;width:330px;transform:rotate(-4deg)"><img src="{R}guvenli-tiktok.png"></div>
      <div class="ph" style="left:440px;top:70px;width:350px;transform:rotate(3deg)"><img src="{R}guvenli-reels.png"></div>
      <span class="tag" style="left:96px;top:560px">TikTok</span><span class="tag o" style="left:690px;top:120px">Reels</span>"""),
    "bitrate-hesaplayici": card(f"""
      <div class="win" style="left:96px;top:104px;width:760px;height:290px"><img src="{R}bitrate-col.png"></div>
      <div class="win" style="left:150px;top:440px;width:700px;height:150px;outline:3px solid #FF6A1A"><img src="{R}bitrate-result.png" style="width:1250px;max-width:none"></div>""", "Hesap"),
    "en-boy-orani": card(f"""
      <div class="win" style="left:70px;top:150px;width:640px;background:#000"><img src="{R}enboy-src.png"></div>
      <span class="tag" style="left:90px;top:540px">16:9 kayıt</span>
      <div class="ph" style="left:600px;top:70px;width:300px"><img src="{R}enboy-out.png"></div>
      <span class="tag o" style="left:760px;top:600px">9:16</span>"""),
    "altyazi-kontrolu": card(f"""
      <div class="win" style="left:56px;top:110px;width:1100px"><img src="{R}altyazi.png" style="width:1300px;max-width:none;margin-left:-40px"></div>
      <span class="tag o" style="left:56px;top:610px">5 altyazıda hata</span><span class="tag" style="left:318px;top:610px">Düzeltilmiş SRT</span>""", "SRT · VTT"),
    "cekim-plani": card(f"""
      <div class="pp" style="left:150px;top:120px;width:380px;transform:rotate(-6deg)"><img src="{A}/cekim-plani/rast-ornek-cekim-plani-onizleme-2.webp"></div>
      <div class="pp" style="left:400px;top:70px;width:420px;transform:rotate(3deg)"><img src="{A}/cekim-plani/rast-ornek-cekim-plani-onizleme-1.webp"></div>"""),
    "cekim-planlayici": card(f"""
      <div class="win" style="left:96px;top:104px;width:900px;background:#efe8df"><img src="{R}planlayici.png"></div>""", "Plan"),
    "video-export-ayarlari": card(f"""
      <div class="win" style="left:70px;top:130px;width:1150px"><img src="{R}export.png"></div>
      <span class="tag o" style="left:70px;top:560px">H.264 · 1080p</span><span class="tag" style="left:330px;top:560px">H.265 · 4K</span>""", "Export"),
    "instagram-grid-sablonu": card(f"""
      <div class="ph" style="left:300px;top:60px;width:360px"><img src="{R}ig-grid.png"></div>
      <span class="tag o" style="left:690px;top:300px">3:4 ızgara</span>"""),
    "kapak-sablonlari": card(f"""
      <div class="win" style="left:70px;top:190px;width:560px;background:#000"><img src="{A}/kapak-sablonlari/rast-youtube-kucuk-resim-1280x720.png" style="background:url(/_ornek/kamera-roportaj.jpg) center/cover"></div>
      <span class="tag" style="left:90px;top:540px">YouTube 1280×720</span>
      <div class="ph" style="left:560px;top:60px;width:330px"><img src="{R}kapak-wrap.png"></div>
      <span class="tag o" style="left:700px;top:610px">Reels kapak</span>"""),
    "storyboard-sablonu": card(f"""
      <div class="pp" style="left:80px;top:160px;width:520px;transform:rotate(-5deg)"><img src="{A}/storyboard-sablonu/rast-storyboard-9x16-onizleme-1.webp"></div>
      <div class="pp" style="left:360px;top:120px;width:540px;transform:rotate(3deg)"><img src="{A}/storyboard-sablonu/rast-storyboard-16x9-onizleme-1.webp"></div>"""),
    "brief-formu": card(f"""
      <div class="pp" style="left:150px;top:120px;width:380px;transform:rotate(-6deg)"><img src="{A}/brief-formu/rast-video-brief-formu-onizleme-2.webp"></div>
      <div class="pp" style="left:400px;top:70px;width:420px;transform:rotate(3deg)"><img src="{A}/brief-formu/rast-video-brief-formu-onizleme-1.webp"></div>"""),
    "cekim-kontrol-listesi": card(f"""
      <div class="pp" style="left:150px;top:120px;width:380px;transform:rotate(-6deg)"><img src="{A}/cekim-kontrol-listesi/rast-cekim-gunu-kontrol-listesi-onizleme-2.webp"></div>
      <div class="pp" style="left:400px;top:70px;width:420px;transform:rotate(3deg)"><img src="{A}/cekim-kontrol-listesi/rast-cekim-gunu-kontrol-listesi-onizleme-1.webp"></div>"""),
    "cekim-izin-formu": card(f"""
      <div class="pp" style="left:150px;top:120px;width:380px;transform:rotate(-6deg)"><img src="{A}/cekim-izin-formu/rast-goruntu-ve-ses-kullanim-izin-formu-onizleme-2.webp"></div>
      <div class="pp" style="left:400px;top:70px;width:420px;transform:rotate(3deg)"><img src="{A}/cekim-izin-formu/rast-goruntu-ve-ses-kullanim-izin-formu-onizleme-1.webp"></div>"""),
    "sfx-paketi": card(
        "".join(
            f'<img src="/_ornek/wave-{n}.png" style="position:absolute;left:70px;top:{120 + i * 104}px;width:820px;height:110px;opacity:{1 - i * 0.12}">'
            f'<span class="tag" style="left:70px;top:{150 + i * 104}px;font-size:15px;padding:7px 12px">{lab}</span>'
            for i, (n, lab) in enumerate(zip(WAVES, ["Whoosh", "Riser", "Impact", "Glitch", "Swell"]))
        ), "WAV · 48 kHz"),
    "lut-paketi": card(f"""
      <div style="position:absolute;inset:0;background:url({A}/lut-paketi/once-sokak-kadraj.webp) center/cover"></div>
      <div style="position:absolute;inset:0;clip-path:inset(0 0 0 50%);background:url({A}/lut-paketi/sonra-rast-soguk-gece.webp) center/cover"></div>
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
