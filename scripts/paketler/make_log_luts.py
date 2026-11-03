#!/usr/bin/env python3
"""Rast LUT Pack: log -> Rec.709 conversion LUTs (33^3 .cube), built from published specs.

Needs `colour-science` + numpy (install in a venv, e.g. $TMPDIR/lutwork/venv):
    python3 -m venv venv && ./venv/bin/pip install colour-science numpy pillow
    ./venv/bin/python scripts/paketler/make_log_luts.py <out_dir>           # writes .cube + sanity table
    ./venv/bin/python scripts/paketler/make_log_luts.py --encode <cam> in.png out.ppm
        (inverse: Rec.709 display image -> simulated log frame, 16-bit PPM, for page previews)

Pipeline per camera (input = normalised 10-bit code value 0..1, the convention of the
manufacturers' own LUTs: S-Log3 18% grey = 420/1023, V-Log 433/1023, C-Log3 ~0.331, Apple Log ~0.488):
  1. log decode -> scene-linear reflectance (colour-science, manufacturer formulas)
  2. camera gamut -> Rec.709 primaries (3x3 from published primaries; all D65, so the
     Bradford CAT is an identity, kept for clarity)
  3. soft gamut compression (ACES 1.3 Reference Gamut Compression parameters) so saturated
     colours outside Rec.709 roll in instead of clipping to flat patches
  4. per-channel filmic tone curve Y = W*L^n/(L^n+K): 18% grey -> ~0.435 display code value
     (BT.1886 gamma 2.4), soft highlight shoulder reaching 1.0 at ~6.5 stops over grey
Per-channel operations on a D65-balanced matrix keep the neutral axis exactly neutral.

DJI D-Log M is NOT included: DJI has not published its curve/gamut (only LUTs), and we
don't reverse-engineer curves. These are Rast's LUTs from published specs, not official
manufacturer LUTs.
"""
import sys, os
import numpy as np
import colour
from colour.models import (
    log_decoding_SLog3, log_encoding_SLog3,
    log_decoding_VLog, log_encoding_VLog,
    log_decoding_CanonLog3, log_encoding_CanonLog3,
    log_decoding_AppleLogProfile, log_encoding_AppleLogProfile,
)

N = 33
GAMMA = 2.4            # BT.1886 display
GREY_OUT = 0.435       # display code value for 18% grey
L_WHITE = 16.0         # scene linear that reaches display 1.0 (~6.5 stops over grey)
CONTRAST = 1.18        # curve exponent n

CAMS = {
    # slug: (title, decode, encode, gamut, spec note)
    "slog3": ("Sony S-Log3 / S-Gamut3.Cine", log_decoding_SLog3, log_encoding_SLog3, "S-Gamut3.Cine",
              "Sony S-Log3 / S-Gamut3.Cine technical summary"),
    "vlog": ("Panasonic V-Log / V-Gamut", log_decoding_VLog, log_encoding_VLog, "V-Gamut",
             "Panasonic V-Log/V-Gamut reference manual"),
    "clog3": ("Canon C-Log3 / Cinema Gamut", log_decoding_CanonLog3, log_encoding_CanonLog3, "Cinema Gamut",
              "Canon Log 3 (v1.2) + Cinema Gamut white paper"),
    "applelog": ("Apple Log (iPhone 15 Pro and later) / Rec.2020", log_decoding_AppleLogProfile,
                 log_encoding_AppleLogProfile, "ITU-R BT.2020", "Apple Log Profile white paper (2023)"),
}


def matrix(gamut, inverse=False):
    src = colour.RGB_COLOURSPACES[gamut]
    dst = colour.RGB_COLOURSPACES["ITU-R BT.709"]
    if inverse:
        src, dst = dst, src
    return colour.matrix_RGB_to_RGB(src, dst, chromatic_adaptation_transform="Bradford")


# ---- ACES Reference Gamut Compression (v1.3 default parameters) ----
THR = np.array([0.815, 0.803, 0.880])
LIM = np.array([1.147, 1.264, 1.312])
PWR = 1.2
SCL = (LIM - THR) / (((1 - THR) / (LIM - THR)) ** (-PWR) - 1) ** (1 / PWR)


def gamut_compress(rgb):
    ach = rgb.max(-1, keepdims=True)
    a = np.abs(ach)
    d = np.where(a > 1e-10, (ach - rgb) / np.where(a > 1e-10, a, 1), 0.0)
    x = np.clip((d - THR) / SCL, 0, None)
    cd = np.where(d < THR, d, THR + SCL * x / (1 + x ** PWR) ** (1 / PWR))
    return ach - cd * a


# ---- tone curve Y = W L^n / (L^n + K), solved so f(0.18)=Yg, f(L_WHITE)=1 ----
def _solve():
    n = CONTRAST
    yg = GREY_OUT ** GAMMA
    g, w = 0.18 ** n, L_WHITE ** n
    # W g/(g+K) = yg ; W w/(w+K) = 1  ->  K from ratio
    # yg (g+K)/g = (w+K)/w  ->  K (yg/g - 1/w) = 1 - yg
    K = (1 - yg) / (yg / g - 1 / w)
    W = (w + K) / w
    return n, K, W


TN, TK, TW = _solve()


def tone(L):
    L = np.clip(L, 0, None)
    Ln = L ** TN
    Y = np.minimum(TW * Ln / (Ln + TK), 1.0)
    return Y ** (1 / GAMMA)


def tone_inv(V):
    Y = np.clip(V, 0, 1) ** GAMMA
    Y = np.minimum(Y, TW * 0.9995)
    return (TK * Y / (TW - Y)) ** (1 / TN)


def log_to_709(code, cam):
    _, dec, _, gamut, _ = CAMS[cam]
    lin = dec(code)
    lin = lin @ matrix(gamut).T
    lin = gamut_compress(lin)
    return np.clip(tone(lin), 0, 1)


def rec709_to_log(V, cam):
    """Inverse for preview frames: display Rec.709 -> scene linear -> camera gamut -> log code."""
    _, _, enc, gamut, _ = CAMS[cam]
    lin = tone_inv(V)
    lin = lin @ matrix(gamut, inverse=True).T
    lin = np.clip(lin, 0, None)
    return np.clip(enc(lin), 0, 1)


def grid():
    g = np.linspace(0, 1, N)
    b, gg, r = np.meshgrid(g, g, g, indexing="ij")  # R fastest in .cube order
    return np.stack([r.ravel(), gg.ravel(), b.ravel()], 1)


def write_cube(path, title, spec, out):
    with open(path, "w") as f:
        f.write(f'TITLE "{title}"\n')
        f.write("# Rast LUT Pack - Rast Creative Studio - rastcreative.com/en/tools/free-lut-pack/\n")
        f.write(f"# Log to Rec.709 (Gamma 2.4) conversion LUT built by Rast from published specs ({spec}).\n")
        f.write("# Not an official manufacturer LUT. Input: normalised full-range code values (as the maker's LUTs).\n")
        f.write("# License: CC BY 4.0 - credit: Rast Creative Studio - rastcreative.com\n")
        f.write(f"LUT_3D_SIZE {N}\nDOMAIN_MIN 0.0 0.0 0.0\nDOMAIN_MAX 1.0 1.0 1.0\n")
        for v in out:
            f.write(f"{v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")


def build(out_dir):
    os.makedirs(out_dir, exist_ok=True)
    G = grid()
    ramp = np.linspace(0, 1, 1024)
    for cam, (title, dec, enc, gamut, spec) in CAMS.items():
        out = log_to_709(G, cam)
        assert np.isfinite(out).all() and out.min() >= 0 and out.max() <= 1
        write_cube(f"{out_dir}/rast-{cam}-to-rec709.cube", f"Rast {title} to Rec.709", spec, out)
        # sanity: 18% grey, neutral ramp monotonic + neutral, black/white
        gcode = float(enc(0.18))
        grey = log_to_709(np.array([[gcode] * 3]), cam)[0]
        neu = log_to_709(np.stack([ramp] * 3, 1), cam)
        mono = bool(np.all(np.diff(neu[:, 0]) >= -1e-9))
        nmax = float(np.max(np.abs(neu[:, 0] - neu[:, 1])) + 0)
        nmax = max(nmax, float(np.max(np.abs(neu[:, 1] - neu[:, 2]))))
        # neutral axis of the actual lattice
        idx = [i * N * N + i * N + i for i in range(N)]
        lat = out[idx]
        latn = float(max(np.abs(lat[:, 0] - lat[:, 1]).max(), np.abs(lat[:, 1] - lat[:, 2]).max()))
        black = float(log_to_709(np.array([[float(enc(0.0))] * 3]), cam)[0, 0])
        w90 = float(log_to_709(np.array([[float(enc(0.9))] * 3]), cam)[0, 0])
        print(f"{cam:9s} grey_code={gcode:.4f} -> out={grey.round(4).tolist()} | 0%->{black:.4f} 90%->{w90:.4f} "
              f"code1.0->{neu[-1,0]:.4f} | monotonic={mono} neutral_err={max(nmax, latn):.2e}")


def encode_png(cam, src, dst):
    from PIL import Image
    im = np.asarray(Image.open(src).convert("RGB")).astype(np.float64) / 255.0
    h, w, _ = im.shape
    logim = rec709_to_log(im.reshape(-1, 3), cam).reshape(h, w, 3)
    arr = np.round(logim * 65535).astype(np.uint16)
    # 16-bit RGB PNG via PIL needs per-channel trick; write with raw PPM (P6 16-bit) instead
    with open(dst, "wb") as f:
        f.write(f"P6\n{w} {h}\n65535\n".encode())
        f.write(arr.astype(">u2").tobytes())


if __name__ == "__main__":
    if len(sys.argv) >= 2 and sys.argv[1] == "--encode":
        encode_png(sys.argv[2], sys.argv[3], sys.argv[4])
    else:
        print(f"tone: n={TN} K={TK:.5f} W={TW:.5f}")
        build(sys.argv[1] if len(sys.argv) > 1 else "cube-log")
