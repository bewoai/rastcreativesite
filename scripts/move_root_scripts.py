#!/usr/bin/env python3
"""Sayfa kökündeki (layout kapanışından SONRA gelen) <script> bloklarını layout'un içine, kapanış etiketinden hemen önceye taşır.
Astro bu blokları olduğu yerde basıyor → çıktıda </html>'den sonra <script> kalıyordu (SEO araçları 'HTML kök yapı' hatası)."""
import re, sys
from pathlib import Path

changed = []
for f in Path("src").rglob("*.astro"):
    s = f.read_text()
    m = list(re.finditer(r"^</([A-Z]\w*Layout|Layout|BelgeSayfasi)>\s*$", s, re.M))
    if not m:
        continue
    close = m[-1]
    tail = s[close.end():]
    blocks = list(re.finditer(r"^<script\b[^>]*>.*?^</script>\s*\n?", tail, re.M | re.S))
    if not blocks:
        continue
    moved = "".join(b.group(0).rstrip() + "\n" for b in blocks)
    new_tail = tail
    for b in reversed(blocks):
        new_tail = new_tail[:b.start()] + new_tail[b.end():]
    s2 = s[:close.start()] + moved + s[close.start():close.end()] + new_tail
    if "--dry" not in sys.argv:
        f.write_text(s2)
    changed.append((str(f), len(blocks), close.group(1)))
for c in changed:
    print(*c)
