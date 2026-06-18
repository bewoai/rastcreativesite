# Rast Creative Panel Kurulumu

Bu kurulum siteyi WordPress'e tasimaz. Site Astro olarak hizli kalir; panel sadece
icerik dosyalarini guvenli formlarla duzenler.

## Panel adresi

Canliya alindiktan sonra panel:

```text
https://rastcreative.com/admin/
```

## Panelden yonetilecek alanlar

- Projeler
- Blog yazilari
- Hizmet kartlari
- SSS cevaplari
- Proje kapak gorselleri
- Blog kapak gorselleri
- Video tarihleri ve VideoObject icin yayin tarihi

## Gerekli harici baglanti

Panel GitHub uzerinden calisir. Bu yuzden Decap CMS icin GitHub oturum acma
baglantisi kurulmalidir.

Hazir repo ayari:

```yaml
repo: bewoai/rastcreativesite
branch: main
```

## Yayin akisi

1. Panelden icerik degistirilir.
2. Degisiklik GitHub'a islenir.
3. Site yeniden derlenir.
4. Derlenen `dist` klasoru Hostinger `public_html` alanina aktarilir.

## Sonraki adim

Hostinger tarafinda otomatik yayin icin GitHub Actions + FTP/SFTP deploy
baglantisi kurulmalidir. Bunun icin Hostinger FTP/SFTP bilgileri GitHub
Secrets alanina eklenir.
