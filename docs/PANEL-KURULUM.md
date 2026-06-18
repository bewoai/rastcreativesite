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
site_domain: vocal-capybara-3732a8.netlify.app
base_url: https://api.netlify.com
auth_endpoint: auth
```

Eger panelde GitHub ile giris yaparken `api.netlify.com/auth ... Not Found`
ekrani gelirse panel yuklenmis, ama GitHub OAuth araci henuz kurulmam demektir.
Decap CMS, GitHub'a guvenli baglanmak icin arada bir OAuth servisi ister;
statik Hostinger sitesinde bu servis kendiliginden gelmez.

En pratik yol:

1. Netlify'de bu GitHub reposuna bagli ucretsiz bir site olusturun.
2. GitHub'da yeni bir OAuth App olusturun.
3. OAuth App icin Authorization callback URL degerini
   `https://api.netlify.com/auth/done` yapin.
4. GitHub'in verdigi Client ID ve Client Secret degerlerini Netlify'de
   `Project configuration > Access & security > OAuth` alanina ekleyin.
5. Paneli Netlify'nin verdigi admin adresinden test edin.
6. Ardindan `https://rastcreative.com/admin/` adresinden tekrar deneyin.

Bu projedeki `public/admin/config.yml` dosyasi Netlify OAuth koprusunu
dogrudan gosterecek sekilde ayarlandi. Buna ragmen GitHub girisi donup
duruyor, `Not Found` veriyor veya panele geri donmuyorsa sorun buyuk ihtimalle
GitHub OAuth App / Netlify OAuth Client ID-Secret eslesmesindedir; bu bilgi
repo kodundan degil Netlify ve GitHub panellerinden tamamlanir.

Site Hostinger'da kalabilir; Netlify burada sadece GitHub girisi icin araci
olarak kullanilir. Bu projede Netlify site domaini:
`vocal-capybara-3732a8.netlify.app`

## Yayin akisi

1. Panelden icerik degistirilir.
2. Degisiklik GitHub'a islenir.
3. Site yeniden derlenir.
4. Derlenen `dist` klasoru Hostinger `public_html` alanina aktarilir.

## Sonraki adim

Hostinger tarafinda otomatik yayin icin GitHub Actions + FTP/SFTP deploy
baglantisi kurulmalidir. Bunun icin Hostinger FTP/SFTP bilgileri GitHub
Secrets alanina eklenir.
