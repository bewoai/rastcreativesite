import numpy as np, sys
sys.path.insert(0, '/home/hermes/.hermes/cache/scratch/lutpack')
from PIL import Image
from make_luts import skin_mask, hue_sat, luma
T = '/home/hermes/.hermes/cache/scratch/lutpack/test/'
L = "rast-sicak-film rast-soguk-gece rast-dogal-kontrast rast-soluk-matte rast-altin-saat-hafif".split()
for f in ["kamera-roportaj", "etkinlik-sahne", "ofis-isik-kurulumu"]:
    o = np.asarray(Image.open(T + f + "_0.png").convert("RGB"), float).reshape(-1, 3) / 255
    m = skin_mask(o) > 0.5
    ho, so = hue_sat(o[m])
    print(f, "skinpx", m.sum(), "orig skin hue %.1f sat %.2f Y %.2f" % (np.median(ho), np.median(so), luma(o[m]).mean()))
    for l in L:
        g = np.asarray(Image.open(T + f + "_" + l + ".png").convert("RGB"), float).reshape(-1, 3) / 255
        hg, sg = hue_sat(g[m])
        d = (g - o).mean(0)
        print("  %-24s meanRGBshift %s  skin hue %.1f sat %.2f Y %.2f | Y p1/p99 %.3f %.3f" % (
            l, np.round(d, 3), np.median(hg), np.median(sg), luma(g[m]).mean(), *np.percentile(luma(g), [1, 99])))
