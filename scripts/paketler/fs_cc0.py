#!/usr/bin/env python3
"""Freesound CC0 scraper (no API key): search with CC0 filter, open sound pages,
re-check license on the page, take the -hq.mp3 preview. Usage: fs_cc0.py "query" N outdir"""
import json, re, subprocess, sys, os, urllib.parse, time, html

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"

def get(url):
    return subprocess.run(["curl", "-sL", "--max-time", "40", "-A", UA, url], capture_output=True, text=True).stdout

def search(q, maxdur=5):
    url = ("https://freesound.org/search/?q=" + urllib.parse.quote_plus(q)
           + "&f=" + urllib.parse.quote('license:"Creative Commons 0" duration:[0 TO %d]' % maxdur)
           + "&s=" + urllib.parse.quote("Rating highest first"))
    page = get(url)
    ids = []
    for m in re.findall(r'href="(/people/[^/"]+/sounds/\d+/)"', page):
        if m not in ids:
            ids.append(m)
    return ids

def info(path):
    page = get("https://freesound.org" + path)
    lic = re.search(r'creativecommons\.org/(publicdomain/zero|licenses/[a-z-]+)/[\d.]+', page)
    lic = lic.group(0) if lic else ""
    prev = re.search(r'https://cdn\.freesound\.org/previews/[^"\']+-hq\.mp3', page)
    title = re.search(r'<meta property="og:title" content="([^"]+)"', page)
    dur = re.search(r'"duration":\s*([\d.]+)', page) or re.search(r'data-duration="([\d.]+)"', page)
    author = path.split("/")[2]
    return {"source_url": "https://freesound.org" + path, "author": author,
            "title": html.unescape(title.group(1)) if title else "", "license_url": lic,
            "preview": prev.group(0) if prev else "", "dur": float(dur.group(1)) if dur else None}

if __name__ == "__main__":
    q, n, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
    os.makedirs(out, exist_ok=True)
    got = []
    for p in search(q)[: n * 3]:
        i = info(p)
        time.sleep(1)
        if "publicdomain/zero" not in i["license_url"] or not i["preview"]:
            continue
        fn = os.path.join(out, re.sub(r"\W+", "_", q) + "_" + p.rstrip("/").split("/")[-1] + ".mp3")
        subprocess.run(["curl", "-sL", "--max-time", "60", "-A", UA, "-o", fn, i["preview"]])
        i["file"] = fn
        got.append(i)
        print(json.dumps(i, ensure_ascii=False))
        if len(got) >= n:
            break
    cj = os.path.join(out, "credits.json")
    old = json.load(open(cj)) if os.path.exists(cj) else []
    json.dump(old + got, open(cj, "w"), ensure_ascii=False, indent=1)
