#!/usr/bin/env python3
"""Package SFX + LUT packs into the worktree public/ dirs."""
import json, os, shutil, subprocess, zipfile, glob

FF = os.path.expanduser("~/.hermes/tools/ffmpeg-9.0.1-linux-x64/bin/ffmpeg")
REPO = os.path.expanduser("~/repos/rcs-asset-packs")
S = os.path.expanduser("~/.hermes/cache/scratch/sfxpack/out/Rast-SFX-Pack-Vol1")
L = os.path.expanduser("~/.hermes/cache/scratch/lutpack")

# ---------------- SFX ----------------
cr = json.load(open(f"{S}/credits.json"))
for c in cr:
    if c["lufs"] <= -69:
        c["lufs"] = None  # too short for integrated loudness
pack_credits = {
    "paket": "Rast SFX Pack Vol.1",
    "yayinci": "Rast Creative Studio — rastcreative.com",
    "sayfa": "https://rastcreative.com/araclar/sfx-paketi/",
    "lisans_ozet": "Rast üretimi sesler CC BY 4.0; CC0 sesler CC0 1.0 olarak kalır.",
    "format": "WAV, 48 kHz, 16-bit, stereo",
    "seviye": "Kısa sesler tepe -1.5 dBTP; 2.5 sn ve üzeri sesler yaklaşık -16 LUFS, tepe <= -1 dBTP",
    "sesler": cr,
}
json.dump(pack_credits, open(f"{S}/credits.json", "w"), ensure_ascii=False, indent=1)

own = [c for c in cr if c["kaynak"] == "Rast üretimi"]
cc0 = [c for c in cr if c["kaynak"] == "CC0"]
lines = [
    "RAST SFX PACK VOL.1",
    "Rast Creative Studio — rastcreative.com",
    "https://rastcreative.com/araclar/sfx-paketi/",
    "",
    f"{len(cr)} ses efekti, kısa video kurgusu (Reels, TikTok, Shorts, YouTube) için.",
    "Format: WAV, 48 kHz, 16-bit, stereo. Baştaki/sondaki sessizlik kırpıldı, kenarlar yumuşatıldı.",
    "Seviye: kısa sesler tepe -1.5 dBTP; uzun sesler (drone, uzun riser) yaklaşık -16 LUFS.",
    "",
    "KLASÖRLER",
    "  whoosh/   kısa ve uzun geçiş sesleri, ters whoosh",
    "  riser/    yükselen gerilim, sonsuz yükseliş (Shepard), kısa rulo",
    "  impact/   vuruş, darbe, sub drop",
    "  swell/    ters zil, halka, logo parlaması",
    "  glitch/   dijital bozulma, veri, VHS",
    "  ui/       tık, pop, anahtar, klavye",
    "  kamera/   deklanşör (DSLR, film, gerçek kayıt)",
    "  kagit/    kağıt kaydırma, buruşturma, sayfa çevirme, bant yırtma",
    "  bildirim/ ding, zil, chime",
    "  gecis/    zip, bant düşüşü, plak cızırtısı",
    "  drone/    karanlık ve havadar alt katman (10 sn)",
    "",
    "LİSANS",
    f"- Rast üretimi {len(own)} ses: Creative Commons Atıf 4.0 (CC BY 4.0).",
    "  https://creativecommons.org/licenses/by/4.0/deed.tr",
    "  Ticari işler, müşteri videoları, reklamlar dahil serbestçe kullanabilir, düzenleyebilirsiniz.",
    "  Şart: atıf. Örnek: \"Ses efektleri: Rast Creative Studio — rastcreative.com\"",
    "  (video açıklamasında, künyede ya da proje notunda; videonun içine yazmanız gerekmez).",
    f"- CC0 {len(cc0)} ses: kamu malı (CC0 1.0), atıf şartı yok. Orijinal adres ve yazar",
    "  credits.json içinde yine de yazılı; teşekkür etmek isterseniz oradan ulaşabilirsiniz.",
    "- Bu paketi olduğu gibi yeniden satmayın / başka bir ses paketi olarak dağıtmayın.",
    "  Videolarınızın içinde kullanmanız serbest.",
    "",
    "HANGİ SES HANGİ LİSANSTA",
]
for c in cr:
    tag = "CC BY 4.0 (Rast üretimi)" if c["kaynak"] == "Rast üretimi" else f"CC0 — {c['yazar']}, {c['orijinal_url']}"
    lines.append(f"  {c['dosya']:44s} {tag}")
lines += ["", "Rast Creative Studio — video prodüksiyon ve sosyal medya içeriği, Sakarya.", "https://rastcreative.com", ""]
open(f"{S}/OKU-BENI.txt", "w").write("\r\n".join(lines))
shutil.copy(os.path.expanduser("~/.hermes/cache/scratch/sfxpack/LISANS-CC-BY-4.0.txt"), f"{S}/LISANS-CC-BY-4.0.txt")

dst = f"{REPO}/public/araclar/sfx-paketi"
os.makedirs(f"{dst}/onizleme", exist_ok=True)
zp = f"{dst}/rast-sfx-pack-vol1.zip"
with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for f in sorted(glob.glob(f"{S}/**/*", recursive=True)):
        if os.path.isfile(f):
            z.write(f, "Rast-SFX-Pack-Vol1/" + os.path.relpath(f, S))
for c in cr:
    src = f"{S}/{c['dosya']}"
    out = f"{dst}/onizleme/" + os.path.basename(src).replace(".wav", ".mp3")
    subprocess.run([FF, "-v", "error", "-y", "-i", src, "-c:a", "libmp3lame", "-b:a", "128k", out], check=True)
json.dump([{"dosya": c["dosya"], "kategori": c["kategori"], "sure": c["sure_sn"], "kaynak": c["kaynak"],
            "yazar": c.get("yazar"), "url": c.get("orijinal_url")} for c in cr],
          open(f"{REPO}/src/data/sfx-paketi.json", "w"), ensure_ascii=False, indent=1)
print("sfx zip MB", round(os.path.getsize(zp) / 1e6, 2))

# ---------------- LUT ----------------
LD = f"{L}/out/Rast-LUT-Pack"
os.makedirs(LD, exist_ok=True)
for f in glob.glob(f"{L}/cube/*.cube"):
    shutil.copy(f, LD)
shutil.copy(os.path.expanduser("~/.hermes/cache/scratch/sfxpack/LISANS-CC-BY-4.0.txt"), f"{LD}/LISANS-CC-BY-4.0.txt")
open(f"{LD}/OKU-BENI.txt", "w").write("\r\n".join([
    "RAST LUT PACK",
    "Rast Creative Studio — rastcreative.com",
    "https://rastcreative.com/araclar/lut-paketi/",
    "",
    "5 yaratıcı .cube LUT (33x33x33), Rec.709 (normal, renkli) görüntü için.",
    "ÖNEMLİ: Bunlar log dönüşüm LUT'u değildir. S-Log, V-Log, C-Log, D-Log gibi log çekimde önce",
    "kameranızın Rec.709 dönüşüm LUT'unu uygulayın, bu LUT'ları ondan SONRA kullanın.",
    "",
    "LUT'LAR",
    "  rast-sicak-film.cube        Yumuşak siyahlar, sıcak ışıklar, hafif film kontrastı",
    "  rast-soguk-gece.cube        Serin gölgeler, hafif düşük pozlama, gece/şehir havası",
    "  rast-dogal-kontrast.cube    Nötr, biraz daha canlı kontrast; ten rengine dokunmaz",
    "  rast-soluk-matte.cube       Kaldırılmış siyahlar, yumuşak beyazlar, düşük doygunluk",
    "  rast-altin-saat-hafif.cube  Hafif altın saat sıcaklığı, turuncu/sarılar biraz zengin",
    "",
    "Hepsi ten rengini koruyacak şekilde hesaplandı (cilt tonu aralığında renk kayması sınırlı).",
    "İpucu: LUT'u %50–80 yoğunlukta kullanmak çoğu zaman en doğal sonucu verir.",
    "",
    "NASIL KULLANILIR",
    "  Premiere Pro: Lumetri Renk > Yaratıcı (Creative) > Görünüm (Look) > Gözat... > .cube seçin.",
    "               Yoğunluk (Intensity) kaydırıcısıyla gücünü ayarlayın.",
    "  DaVinci Resolve: Proje Ayarları > Renk Yönetimi > LUT Klasörünü Aç; .cube dosyalarını kopyalayın,",
    "               'LUT listesini güncelle'. Color sayfasında node'a sağ tık > 3D LUT > Rast.",
    "  Final Cut Pro: Efektler > Renk > Özel LUT (Custom LUT) > LUT seç > Özel LUT Seç... > .cube.",
    "  CapCut (masaüstü): Ayarla (Adjust) > LUT > İçe aktar; .cube dosyasını seçin.",
    "",
    "LİSANS",
    "  Creative Commons Atıf 4.0 (CC BY 4.0) — https://creativecommons.org/licenses/by/4.0/deed.tr",
    "  Ticari işler ve müşteri projeleri dahil kullanabilir, değiştirebilirsiniz.",
    "  Şart: atıf. Örnek: \"Renk LUT'u: Rast Creative Studio — rastcreative.com\"",
    "  LUT dosyalarını olduğu gibi yeniden satmayın / başka bir paket olarak dağıtmayın.",
    "",
    "Rast Creative Studio — video prodüksiyon, renk ve kurgu, Sakarya.",
    "https://rastcreative.com",
    "",
]))
dl = f"{REPO}/public/araclar/lut-paketi"
os.makedirs(dl, exist_ok=True)
zl = f"{dl}/rast-lut-pack.zip"
with zipfile.ZipFile(zl, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for f in sorted(glob.glob(f"{LD}/*")):
        z.write(f, "Rast-LUT-Pack/" + os.path.basename(f))
for f in glob.glob(f"{L}/web/*.webp"):
    shutil.copy(f, dl)
print("lut zip MB", round(os.path.getsize(zl) / 1e6, 2))
