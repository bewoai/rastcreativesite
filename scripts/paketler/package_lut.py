#!/usr/bin/env python3
"""Build public/araclar/lut-paketi/rast-lut-pack.zip from generated .cube files.

    python3 scripts/paketler/package_lut.py <cube_dir> [license_txt]   (default: scripts/paketler/LISANS-CC-BY-4.0.txt)

Layout: Rast-LUT-Pack/{OKU-BENI.txt, README.txt, LISANS-CC-BY-4.0.txt, Looks/*.cube, Log-to-Rec709/*.cube}
Readmes come from scripts/paketler/OKU-BENI-lut-tr.txt + README-lut-en.txt (written with CRLF).
"""
import os, sys, zipfile, time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
ZIP = os.path.join(ROOT, "public/araclar/lut-paketi/rast-lut-pack.zip")
LOOKS = ["rast-sicak-film", "rast-soguk-gece", "rast-dogal-kontrast", "rast-soluk-matte", "rast-altin-saat-hafif",
         "rast-teal-orange", "rast-mono-kontrast", "rast-bleach-bypass"]
LOGS = ["rast-slog3-to-rec709", "rast-vlog-to-rec709", "rast-clog3-to-rec709", "rast-applelog-to-rec709"]
R = "Rast-LUT-Pack/"


def crlf(path):
    t = open(path, encoding="utf-8").read().replace("\r\n", "\n")
    return t.replace("\n", "\r\n").encode("utf-8")


def main(cubes, lic):
    dt = time.localtime()[:6]
    with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        def add(name, data):
            zi = zipfile.ZipInfo(R + name, dt)
            zi.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(zi, data)
        add("OKU-BENI.txt", crlf(os.path.join(HERE, "OKU-BENI-lut-tr.txt")))
        add("README.txt", crlf(os.path.join(HERE, "README-lut-en.txt")))
        add("LISANS-CC-BY-4.0.txt", open(lic, "rb").read())
        for s in LOOKS:
            add(f"Looks/{s}.cube", open(f"{cubes}/{s}.cube", "rb").read())
        for s in LOGS:
            add(f"Log-to-Rec709/{s}.cube", open(f"{cubes}/{s}.cube", "rb").read())
    print(ZIP, os.path.getsize(ZIP), "bytes")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, "LISANS-CC-BY-4.0.txt"))
