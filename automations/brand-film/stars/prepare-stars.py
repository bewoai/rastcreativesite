"""
"Takımyıldız" step 1 — maps + footage.

  python3 automations/brand-film/stars/prepare-stars.py [--force]

1. Projects geoBoundaries (CC BY 4.0) Turkey ADM1/ADM2 into the two map frames
   the film uses and writes stars/data/geo.json (committed, small):
     sak  Sakarya + neighbours + its 16 districts + Lake Sapanca, fitted 820×840
     tr   all 81 provinces, fitted 960 wide
   plus the pixel position of every star (studio, 6 Sakarya brands, 2 far brands).
2. Cuts each brand's clip into a 400×400 JPEG sequence under .cache/stars/<id>/.

Boundary files are downloaded once into .cache/ (media.githubusercontent.com, LFS).
"""
import json, math, os, subprocess, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "../../.."))
CACHE = os.path.abspath(os.path.join(HERE, "../.cache"))
FFMPEG = os.environ.get("FFMPEG", "ffmpeg")
FORCE = "--force" in sys.argv
GB = "https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/TUR/{0}/geoBoundaries-TUR-{0}_simplified.geojson"

def load(level):
    p = os.path.join(CACHE, f"{level}.geojson")
    if not os.path.exists(p):
        print("↓", level); urllib.request.urlretrieve(GB.format(level), p)
    return json.load(open(p, encoding="utf-8"))["features"]

def polys(g):
    return g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]

def centroid(g):
    # Area-weighted centroid of the largest polygon's outer ring.
    ring = max((p[0] for p in polys(g)), key=len)
    a = cx = cy = 0.0
    for i in range(len(ring) - 1):
        x0, y0 = ring[i]; x1, y1 = ring[i + 1]
        c = x0 * y1 - x1 * y0; a += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c
    a *= 0.5
    return (cx / (6 * a), cy / (6 * a))

def dp(pts, eps):
    # Douglas–Peucker simplification in pixel space.
    if len(pts) < 3: return pts
    (x0, y0), (x1, y1) = pts[0], pts[-1]
    dx, dy = x1 - x0, y1 - y0; L = math.hypot(dx, dy) or 1e-9
    i, dmax = 0, 0
    for k in range(1, len(pts) - 1):
        d = abs(dy * pts[k][0] - dx * pts[k][1] + x1 * y0 - y1 * x0) / L
        if d > dmax: i, dmax = k, d
    if dmax <= eps: return [pts[0], pts[-1]]
    return dp(pts[: i + 1], eps)[:-1] + dp(pts[i:], eps)

class Proj:
    def __init__(self, bbox, cx, cy, w, h):
        (lo0, la0, lo1, la1) = bbox
        self.c = math.cos(math.radians((la0 + la1) / 2))
        self.k = min(w / ((lo1 - lo0) * self.c), h / (la1 - la0))
        self.lo, self.la = (lo0 + lo1) / 2, (la0 + la1) / 2
        self.cx, self.cy = cx, cy
    def __call__(self, lon, lat):
        return (self.cx + (lon - self.lo) * self.c * self.k, self.cy - (lat - self.la) * self.k)

def path(g, P, eps=0.6):
    out = []
    for p in polys(g):
        for ring in p[:1]:
            q = [P(x, y) for x, y in ring]; m = len(q) // 2
            pts = dp(q[: m + 1], eps)[:-1] + dp(q[m:], eps)  # split: a closed ring has no chord
            if len(pts) < 4: continue
            out.append("M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + "Z")
    return "".join(out)

def bbox(g):
    xs = [x for p in polys(g) for x, _ in p[0]]; ys = [y for p in polys(g) for _, y in p[0]]
    return (min(xs), min(ys), max(xs), max(ys))

adm1, adm2 = load("ADM1"), load("ADM2")
prov = {f["properties"]["shapeName"]: f["geometry"] for f in adm1}
B = json.load(open(os.path.join(HERE, "brands.json"), encoding="utf-8"))

# ── Sakarya frame ──
sak = prov["Sakarya"]; sb = bbox(sak)
PS = Proj(sb, 540, 1010, 820, 840)
inS = lambda g: (lambda c: sb[0] <= c[0] <= sb[2] and sb[1] <= c[1] <= sb[3])(centroid(g))
dist = {f["properties"]["shapeName"]: f["geometry"] for f in adm2 if inS(f["geometry"]) and f["properties"]["shapeName"] in {
    "Adapazarı", "Akyazı", "Arifiye", "Erenler", "Ferizli", "Geyve", "Hendek", "Karapürçek", "Karasu",
    "Kaynarca", "Kocaali", "Pamukova", "Sapanca", "Serdivan", "Söğütlü", "Taraklı"}}
assert len(dist) == 16, sorted(dist)
wide = (sb[0] - 1.2, sb[1] - 0.8, sb[2] + 1.2, sb[3] + 0.8)
neigh = [n for n, g in prov.items() if n != "Sakarya" and (lambda b: b[2] > wide[0] and b[0] < wide[2] and b[3] > wide[1] and b[1] < wide[3])(bbox(g))]
# Lake Sapanca (not in the boundary data): hand-traced outline, lon/lat.
LAKE = [(30.135, 40.715), (30.16, 40.735), (30.20, 40.742), (30.24, 40.738), (30.28, 40.728), (30.315, 40.712),
        (30.30, 40.698), (30.26, 40.690), (30.22, 40.688), (30.18, 40.693), (30.15, 40.702), (30.135, 40.715)]
lake = "M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in (PS(*p) for p in LAKE)) + "Z"

def at(district, off):
    x, y = PS(*centroid(dist[district])); return [round(x + off[0], 1), round(y + off[1], 1)]

# ── Turkey frame ──
tb = (25.6, 35.8, 44.9, 42.2)
PT = Proj(tb, 540, 960, 960, 999)
sak_tr = [round(v, 1) for v in PT(*centroid(sak))]

geo = {
    "sak": {
        "outline": path(sak, PS, 0.5),
        "districts": {n: path(g, PS, 0.8) for n, g in dist.items()},
        "neighbours": {n: path(prov[n], PS, 0.8) for n in neigh},
        "lake": lake,
        "label": [round(v, 1) for v in PS(30.62, 40.33)],
        "studio": at(B["studio"]["district"], B["studio"]["off"]),
        "stars": {b["id"]: at(b["district"], b["off"]) for b in B["sakarya"]},
    },
    "tr": {
        "provinces": {n: path(g, PT, 0.7) for n, g in prov.items()},
        "sakarya": sak_tr,
        "stars": {b["id"]: [round(v, 1) for v in PT(*centroid(prov[b["province"]]))] for b in B["turkey"]},
    },
}
os.makedirs(os.path.join(HERE, "data"), exist_ok=True)
with open(os.path.join(HERE, "data/geo.json"), "w", encoding="utf-8") as f:
    json.dump(geo, f, ensure_ascii=False, separators=(",", ":"))
print("✓ geo.json", os.path.getsize(os.path.join(HERE, "data/geo.json")) // 1024, "KB ·", len(neigh), "komşu il")

# ── footage: 400×400 circles ──
reel = json.load(open(os.path.join(HERE, "../reel/shots.json"), encoding="utf-8")).get("sources", {})
def source(src):
    site = os.path.join(ROOT, "public/videos/projeler", src + ".mp4")
    if os.path.exists(site): return site
    local = os.path.join(CACHE, "drive", src + ".mp4")
    if not os.path.exists(local):
        os.makedirs(os.path.dirname(local), exist_ok=True)
        print("↓", src, "(Drive)")
        subprocess.run(["curl", "-sSL", "-o", local, f"https://drive.usercontent.google.com/download?id={reel[src]['drive']}&export=download&confirm=t"], check=True)
    return local

man = {}
for b in B["sakarya"] + B["turkey"]:
    d = os.path.join(CACHE, "stars", b["id"])
    if FORCE or not os.path.isdir(d) or not os.listdir(d):
        os.makedirs(d, exist_ok=True)
        for f in os.listdir(d): os.remove(os.path.join(d, f))
        cy = b.get("cy", 0.5)
        vf = f"fps=30,scale=400:400:force_original_aspect_ratio=increase:flags=lanczos,crop=400:400:(iw-400)/2:(ih-400)*{cy}"
        subprocess.run([FFMPEG, "-loglevel", "error", "-ss", str(b["in"]), "-i", source(b["src"]), "-t", "2.6",
                        "-vf", vf, "-q:v", "3", os.path.join(d, "%04d.jpg")], check=True)
    man[b["id"]] = {"count": len(os.listdir(d))}
    print("✓", b["id"], b["name"], man[b["id"]]["count"], "kare")
json.dump(man, open(os.path.join(CACHE, "stars", "manifest.json"), "w"))
