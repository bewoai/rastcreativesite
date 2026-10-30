#!/usr/bin/env python3
"""Build Rast SFX Pack Vol.1: render/collect -> trim -> fade -> normalize -> 48k/16-bit WAV."""
import json, os, re, subprocess, sys
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from plan import PLAN

FF = os.path.expanduser("~/.hermes/tools/ffmpeg-9.0.1-linux-x64/bin/")
E = os.path.expanduser("~/.hermes/tools/earshot/venv/bin/earshot")
HERE = os.path.dirname(os.path.abspath(__file__))
OV = os.path.expanduser("~/.hermes/data/sfx/")
RAW, OUT = f"{HERE}/raw", f"{HERE}/out/Rast-SFX-Pack-Vol1"
SR = 48000
os.makedirs(RAW, exist_ok=True)
for c in set(p[0] for p in PLAN):
    os.makedirs(f"{OUT}/{c}", exist_ok=True)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(" ".join(cmd) + "\n" + r.stderr[-800:])
    return r


def decode(path):
    r = subprocess.run([FF + "ffmpeg", "-v", "error", "-i", path, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                       capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.float32).reshape(-1, 2).copy()


def synth(kind, path, dur=10):
    if kind == "dark":
        f = (f"anoisesrc=c=brown:r={SR}:a=0.5:d={dur}[n];"
             f"aevalsrc='0.35*sin(2*PI*55*t)*(0.75+0.25*sin(2*PI*0.13*t))+0.22*sin(2*PI*82.41*t+0.4)*(0.7+0.3*sin(2*PI*0.09*t))"
             f"+0.08*sin(2*PI*110.3*t)':s={SR}:d={dur}[s];"
             f"[n]lowpass=f=220,lowpass=f=220,volume=0.9[nl];[nl][s]amix=inputs=2:normalize=0,"
             f"aecho=0.8:0.6:180|310:0.25|0.18,pan=stereo|c0=c0|c1=c0,"
             f"aphaser=type=t:speed=0.1:decay=0.35")
    else:  # air
        f = (f"anoisesrc=c=pink:r={SR}:a=0.4:d={dur}:seed=7[n];"
             f"aevalsrc='0.05*sin(2*PI*659.25*t)*(0.6+0.4*sin(2*PI*0.11*t))+0.045*sin(2*PI*987.77*t+1)*(0.6+0.4*sin(2*PI*0.07*t))"
             f"|0.05*sin(2*PI*660.1*t)*(0.6+0.4*sin(2*PI*0.12*t))+0.045*sin(2*PI*988.9*t)*(0.6+0.4*sin(2*PI*0.08*t))':s={SR}:d={dur}[s];"
             f"[n]highpass=f=900,lowpass=f=7000,volume=0.5,pan=stereo|c0=c0|c1=c0,"
             f"aphaser=type=s:speed=0.11:decay=0.5,tremolo=f=0.15:d=0.4[nh];[nh][s]amix=inputs=2:normalize=0,"
             f"aecho=0.8:0.7:240|410:0.3|0.22")
    run([FF + "ffmpeg", "-y", "-v", "error", "-filter_complex", f, "-t", str(dur), "-ar", str(SR), "-c:a", "pcm_f32le", path])


def ebur(path):
    r = subprocess.run([FF + "ffmpeg", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    I = float(re.findall(r"I:\s+(-?[\d.]+|-inf) LUFS", r)[-1].replace("-inf", "-70"))
    tp = float(re.findall(r"Peak:\s+(-?[\d.]+|-inf) dBFS", r)[-1].replace("-inf", "-70"))
    return I, tp


def process(x, maxdur, long_):
    env = np.abs(x).max(1)
    thr = 10 ** (-60 / 20) * max(env.max(), 1e-9) / 1.0
    idx = np.where(env > max(thr, 10 ** (-70 / 20)))[0]
    a = max(0, idx[0] - int(0.004 * SR))
    b = min(len(x), idx[-1] + int(0.03 * SR))
    x = x[a:b]
    if maxdur and len(x) > maxdur * SR:
        x = x[: int(maxdur * SR)]
        fo = int(0.25 * SR)
    else:
        fo = int((0.4 if long_ else 0.02) * SR)
    fi = int((1.0 if long_ else 0.003) * SR)
    fi, fo = min(fi, len(x) // 4), min(fo, len(x) // 3)
    x[:fi] *= np.linspace(0, 1, fi)[:, None]
    x[-fo:] *= (np.linspace(1, 0, fo) ** 2)[:, None]
    x -= x.mean(0)  # DC
    return x


def write(x, path, gain_db=0.0):
    tmp = path + ".f32"
    (x * 10 ** (gain_db / 20)).astype(np.float32).tofile(tmp)
    run([FF + "ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", tmp,
         "-af", "aresample=osf=s16:dither_method=triangular", "-c:a", "pcm_s16le", path])
    os.remove(tmp)


credits = []
for cat, name, src, ref, opt in PLAN:
    fn = f"rast-sfx-{cat}-{name}.wav"
    raw = f"{RAW}/{cat}-{name}.wav"
    if src == "earshot":
        if not os.path.exists(raw):
            run([E, "sfx", "render", ref, "-o", raw, "--sr", str(SR)])
        origin = {"kaynak": "Rast üretimi", "lisans": "CC BY 4.0", "yontem": f"Earshot sentez ({ref}), Rast Creative tarafından işlendi"}
    elif src == "synth":
        if not os.path.exists(raw):
            synth(ref, raw)
        origin = {"kaynak": "Rast üretimi", "lisans": "CC BY 4.0", "yontem": "ffmpeg sentezi (gürültü + sinüs katmanları), Rast Creative"}
    else:
        p = f"{HERE}/{ref}" if ref.startswith("cc0/") else OV + ref
        raw = p
        cj = json.load(open(os.path.join(os.path.dirname(p), "credits.json")))
        cj = cj if isinstance(cj, list) else cj.get("items", [])
        base = os.path.basename(p)
        m = next((c for c in cj if os.path.basename(c.get("file") or c.get("filename") or "") == base), None)
        if not m:
            sid = re.search(r"_(\d+)\.mp3$", base)
            m = next((c for c in cj if sid and sid.group(1) in (c.get("source_url") or "")), None)
        assert m, (ref, "no credit")
        origin = {"kaynak": "CC0", "lisans": "CC0 1.0 (kamu malı)",
                  "orijinal_url": m.get("source_url") or m.get("foreign_landing_url"),
                  "yazar": m.get("author") or m.get("creator"), "orijinal_baslik": m.get("title"),
                  "yontem": "Kırpma, kenar yumuşatma, seviye normalizasyonu (Rast Creative)"}
    x = decode(raw)
    long_ = cat in ("drone",)
    x = process(x, opt.get("maxdur"), long_)
    dur = len(x) / SR
    out = f"{OUT}/{cat}/{fn}"
    write(x, out)
    I, tp = ebur(out)
    if dur >= 2.5 or long_:
        g = min(-16 - I, -1.2 - tp)   # long: -16 LUFS, TP <= -1.2
    else:
        g = -1.5 - tp                  # short: true peak -1.5 dBTP
    write(x, out, g)
    I2, tp2 = ebur(out)
    if tp2 > -1.0:
        write(x, out, g + (-1.3 - tp2))
        I2, tp2 = ebur(out)
    rec = {"dosya": f"{cat}/{fn}", "kategori": cat, "sure_sn": round(dur, 2), "lufs": I2, "true_peak_dbtp": tp2, **origin}
    credits.append(rec)
    print(f"{fn:42s} {dur:5.2f}s I={I2:6.1f} TP={tp2:5.1f} {origin['kaynak']}", flush=True)

json.dump(credits, open(f"{OUT}/credits.json", "w"), ensure_ascii=False, indent=1)
print("TOTAL", len(credits))
