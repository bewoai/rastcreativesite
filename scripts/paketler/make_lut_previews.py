#!/usr/bin/env python3
"""Before/after preview frames for the LUT page (only our own BTS photos, src/assets/photos/bts/).

    ./venv/bin/python scripts/paketler/make_lut_previews.py <cube_dir> <tmp_dir>

<cube_dir> holds the .cube files from make_luts.py + make_log_luts.py. LUTs are applied with
ffmpeg `lut3d=...:interp=tetrahedral` (the same path an NLE takes), never with our own math.
Writes public/araclar/lut-paketi/:
  once-<frame>.webp, sonra-<lut>.webp                 creative looks (1200x676)
  once-log-<cam>.webp, sonra-log-<cam>.webp           simulated log frame (Rec.709 photo inverse-
                                                      encoded into the camera's log) + LUT applied
Only the files listed in LOOKS / LOG_FRAME are (re)written, so the original five previews stay as they are.
"""
import os, subprocess, sys
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
sys.path.insert(0, HERE)
BTS = os.path.join(ROOT, "src/assets/photos/bts")
OUT = os.path.join(ROOT, "public/araclar/lut-paketi")
W, H = 1200, 676

LOOKS = {  # lut slug -> BTS frame
    "rast-teal-orange": "magaza-showroom",
    "rast-mono-kontrast": "sokak-kadraj",
    "rast-bleach-bypass": "medikal-radyoterapi",
}
LOG_FRAME = "kamera-roportaj"
LOG_CAMS = ["slog3", "vlog", "clog3", "applelog"]


def run(*a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)


def base_png(frame, tmp):
    p = f"{tmp}/{frame}.png"
    if not os.path.exists(p):
        Image.open(f"{BTS}/{frame}.jpg").convert("RGB").resize((W, H), Image.LANCZOS).save(p)
    return p


def webp(src, dst):
    Image.open(src).convert("RGB").save(dst, "WEBP", quality=82, method=6)


def apply_lut(src, cube, dst):
    run("-i", src, "-vf", f"lut3d=file={cube}:interp=tetrahedral", "-pix_fmt", "rgb48be", dst)


def main(cubes, tmp):
    os.makedirs(tmp, exist_ok=True)
    for lut, frame in LOOKS.items():
        b = base_png(frame, tmp)
        once = f"{OUT}/once-{frame}.webp"
        if not os.path.exists(once):
            webp(b, once)
        apply_lut(b, f"{cubes}/{lut}.cube", f"{tmp}/{lut}.png")
        webp(f"{tmp}/{lut}.png", f"{OUT}/sonra-{lut}.webp")
        print("look", lut, frame)
    from make_log_luts import encode_png
    b = base_png(LOG_FRAME, tmp)
    for cam in LOG_CAMS:
        ppm = f"{tmp}/log-{cam}.ppm"
        encode_png(cam, b, ppm)
        run("-i", ppm, "-pix_fmt", "rgb24", f"{tmp}/log-{cam}.png")
        webp(f"{tmp}/log-{cam}.png", f"{OUT}/once-log-{cam}.webp")
        apply_lut(ppm, f"{cubes}/rast-{cam}-to-rec709.cube", f"{tmp}/after-{cam}.png")
        webp(f"{tmp}/after-{cam}.png", f"{OUT}/sonra-log-{cam}.webp")
        a = np.asarray(Image.open(f"{tmp}/after-{cam}.png").convert("RGB"), float)
        o = np.asarray(Image.open(b).convert("RGB"), float)
        print("log", cam, "mean |after-original| (0-255): %.1f" % np.abs(a - o).mean())


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
