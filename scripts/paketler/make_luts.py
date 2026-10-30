#!/usr/bin/env python3
"""Rast LUT Pack: 5 creative 33^3 .cube LUTs for Rec.709 (display-referred) footage.
Math only (numpy). Skin-safe: a soft skin-hue mask pulls graded chroma back toward the
tone-only version so faces don't go orange/green/grey."""
import numpy as np, os, sys

N = 33
OUT = sys.argv[1] if len(sys.argv) > 1 else "cube"
os.makedirs(OUT, exist_ok=True)
W = np.array([0.2126, 0.7152, 0.0722])


def luma(x):
    return x @ W


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def scurve(y, amt, pivot=0.45):
    """Filmic S around pivot; amt 0..1. Monotonic, keeps 0->0, 1->1."""
    lo = pivot * (y / pivot) ** (1 + amt)
    hi = 1 - (1 - pivot) * ((1 - y) / (1 - pivot)) ** (1 + amt)
    return np.where(y < pivot, lo, hi)


def rolloff(y, knee=0.82):
    """Soft highlight shoulder above knee (keeps 1->~0.985)."""
    # quadratic shoulder: slope 1 at the knee, ends at 1-0.4*(1-knee) with slope 0.2 (monotonic)
    k = knee
    c = 0.4 / (1 - k)
    t = np.clip(y - k, 0, None)
    return np.where(y > k, y - c * t * t, y)


def hue_sat(x):
    mx, mn = x.max(1), x.min(1)
    d = mx - mn + 1e-9
    r, g, b = x[:, 0], x[:, 1], x[:, 2]
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    s = np.where(mx > 1e-6, (mx - mn) / (mx + 1e-9), 0)
    return h, s


def skin_mask(x):
    h, s = hue_sat(x)
    y = luma(x)
    # skin hue ~ 8..45 deg, moderate saturation, not too dark
    hm = smooth(0, 12, h) * (1 - smooth(40, 55, h))
    sm = smooth(0.08, 0.18, s) * (1 - smooth(0.6, 0.8, s))
    ym = smooth(0.08, 0.2, y)
    return hm * sm * ym


def set_luma(x, ynew):
    y = luma(x)[:, None]
    return x + (ynew[:, None] - y)  # additive keeps chroma; clip later


def saturate(x, k):
    y = luma(x)[:, None]
    return y + (x - y) * (k[:, None] if np.ndim(k) else k)


def split_tone(x, sh, hi, amt_s, amt_h):
    y = luma(x)
    ws = (1 - smooth(0.0, 0.5, y))[:, None] * amt_s
    wh = smooth(0.45, 1.0, y)[:, None] * amt_h
    return x + ws * (np.array(sh) - 0.5) + wh * (np.array(hi) - 0.5)


def finish(x0, x, skin_keep):
    """Skin protection: blend graded chroma toward tone-only for skin pixels."""
    m = skin_mask(x0)[:, None] * skin_keep
    tone_only = set_luma(x0, luma(x))
    x = x * (1 - m) + tone_only * m
    return np.clip(x, 0, 1)


def sicak_film(x0):
    y = luma(x0)
    yn = rolloff(scurve(y, 0.18, 0.42)) * 0.965 + 0.025          # gentle S, soft blacks
    x = set_luma(x0, yn)
    x = split_tone(x, (0.47, 0.52, 0.53), (0.56, 0.515, 0.43), 0.22, 0.30)  # teal-green shadows, warm highs
    x = x * np.array([1.035, 1.003, 0.955])
    x = saturate(x, 0.93)
    return finish(x0, x, 0.45)


def soguk_gece(x0):
    y = luma(x0)
    yn = rolloff(scurve(y, 0.14, 0.45) * 0.97, 0.8) * 0.97 + 0.012
    x = set_luma(x0, yn)
    x = split_tone(x, (0.44, 0.49, 0.6), (0.49, 0.505, 0.53), 0.42, 0.16)
    x = x * np.array([0.965, 0.995, 1.04])
    h, s = hue_sat(x0)
    x = saturate(x, 0.84)
    return finish(x0, x, 0.6)


def dogal_kontrast(x0):
    y = luma(x0)
    yn = rolloff(scurve(y, 0.26, 0.44), 0.86)
    x = set_luma(x0, yn)
    # chroma scales with contrast a little, less on low-sat pixels
    h, s = hue_sat(x0)
    k = 1.06 + 0.04 * (1 - smooth(0.2, 0.6, s))
    x = saturate(x, k)
    return finish(x0, x, 0.5)


def soluk_matte(x0):
    y = luma(x0)
    yn = scurve(y, 0.08, 0.5)
    yn = 0.075 + yn * (0.925 - 0.075)                            # lifted blacks, softened whites
    x = set_luma(x0, yn)
    x = split_tone(x, (0.49, 0.515, 0.5), (0.52, 0.505, 0.48), 0.22, 0.14)
    x = saturate(x, 0.8)
    return finish(x0, x, 0.35)


def altin_saat(x0):
    y = luma(x0)
    yn = rolloff(scurve(y, 0.1, 0.45), 0.84)
    x = set_luma(x0, yn)
    x = split_tone(x, (0.51, 0.5, 0.48), (0.57, 0.525, 0.415), 0.12, 0.36)
    x = x * np.array([1.03, 1.008, 0.955])
    h, s = hue_sat(x0)
    warm = smooth(15, 30, h) * (1 - smooth(60, 75, h))           # oranges/yellows a bit richer
    x = saturate(x, 1.0 + 0.1 * warm)
    return finish(x0, x, 0.5)


LUTS = [
    ("rast-sicak-film", "Rast Sicak Film", sicak_film),
    ("rast-soguk-gece", "Rast Soguk Gece", soguk_gece),
    ("rast-dogal-kontrast", "Rast Dogal Kontrast", dogal_kontrast),
    ("rast-soluk-matte", "Rast Soluk Matte", soluk_matte),
    ("rast-altin-saat-hafif", "Rast Altin Saat Hafif", altin_saat),
]

if __name__ == "__main__":
    g = np.linspace(0, 1, N)
    b, gg, r = np.meshgrid(g, g, g, indexing="ij")   # R fastest in .cube order
    grid = np.stack([r.ravel(), gg.ravel(), b.ravel()], 1)
    for slug, title, fn in LUTS:
        out = fn(grid.copy())
        assert out.min() >= 0 and out.max() <= 1 and np.isfinite(out).all()
        with open(f"{OUT}/{slug}.cube", "w") as f:
            f.write(f'TITLE "{title}"\n')
            f.write("# Rast LUT Pack - Rast Creative Studio - rastcreative.com/araclar/lut-paketi/\n")
            f.write("# Creative look for Rec.709 (Gamma 2.4) footage. Not a log conversion LUT.\n")
            f.write("# License: CC BY 4.0 - credit: Rast Creative Studio - rastcreative.com\n")
            f.write(f"LUT_3D_SIZE {N}\nDOMAIN_MIN 0.0 0.0 0.0\nDOMAIN_MAX 1.0 1.0 1.0\n")
            for v in out:
                f.write(f"{v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")
        # neutral axis check
        idx = [i for i in range(N)]
        neutral = out[[i * N * N + i * N + i for i in idx]]
        print(slug, "black", neutral[0].round(3), "mid", neutral[N // 2].round(3), "white", neutral[-1].round(3))
