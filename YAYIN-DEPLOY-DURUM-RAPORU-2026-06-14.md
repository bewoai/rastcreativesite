# Rast Creative Studio - Yayın ve Deploy Durum Raporu

Tarih: 14 Haziran 2026  
Kapsam: Son çalışma oturumunda yapılanlar, çözülenler, takıldığımız yerler ve sonraki adımlar.

## Genel Durum

Site dosyaları yerelde sağlıklı build alıyor. `npm run build` çalıştırıldığında Astro site başarıyla üretiliyor ve `dist` klasöründe 32 sayfa oluşuyor.

Şu an temel problem site kodundan çok yayın akışında:

- Manuel yükleme ile site çalışır hale getirildi.
- Domain tarafı hâlâ tam nihayete ermiş değil.
- GitHub Actions FTP deploy hâlâ Hostinger FTP bağlantısında zaman aşımına düşüyor.
- Otomatik deploy henüz stabil hale gelmedi.

## Yapılanlar

### 1. Manuel yayın problemi teşhis edildi

Hostinger `public_html` içine yüklenen dosyalarda şu tip bozuk yapı görüldü:

```text
_astro\camera-closeup...
_astro\hero-cinema...
covers\...
fonts\...
```

Bu yapı Linux sunucuda hatalıdır. Doğrusu klasörlerin ayrı görünmesidir:

```text
_astro/
covers/
fonts/
hizmetler/
projeler/
index.html
```

Bu nedenle görseller kırılıyor, alt sayfalar 404'e düşüyordu.

Sonrasında `dist` klasörünün içeriği manuel olarak doğru şekilde `public_html` içine yerleştirildi. Kullanıcının son geri bildirimiyle sitede genel dosya tarafında artık ciddi bir problem kalmadığı görüldü.

### 2. Aynı görselden çok sayıda dosya olmasının nedeni açıklandı

`_astro` içinde aynı görselin birden fazla versiyonu bulunması normaldir.

Astro görselleri performans için farklı format ve boyutlarda üretir:

```text
.webp
.avif
.jpg
600w
900w
1200w
1600w
```

Bu durum hata değil; hız, SEO ve mobil uyumluluk için beklenen davranıştır.

Sorun sadece bu dosyaların `_astro` klasörü altında durması gerekirken, isimlerinde `\` olacak şekilde tek dosya gibi yüklenmesiydi.

### 3. İletişim sayfasındaki e-posta kontrol edildi

Canlı geçici Hostinger adresinde e-posta şu şekilde görünüyordu:

```text
studio@brown-mandrill-841625.hostingersite.com
```

Yereldeki güncel kaynak ve build çıktısı kontrol edildi:

```text
src/consts.ts
dist/iletisim/index.html
```

Kodda doğru e-posta bulundu:

```text
studio@rastcreative.com
```

Sonuç: Bu problem güncel koddan kaynaklanmıyor. Muhtemel sebepler:

- Hostinger geçici domain önizlemesinin cache'li/eski dosya göstermesi
- `public_html/iletisim/index.html` dosyasının eski versiyon kalmış olması
- Geçici `hostingersite.com` domaini üzerinden Hostinger'ın içerik/domain davranışı

Asıl domain çalıştığında tekrar kontrol edilmeli:

```text
https://rastcreative.com/iletisim/
```

### 4. GitHub Secrets davranışı açıklandı

GitHub'da repository secrets şu şekilde görünüyordu:

```text
FTP_PASSWORD
FTP_SERVER
FTP_USERNAME
```

Kullanıcı secret içine girince değerlerin boş göründüğünü söyledi. Bunun normal olduğu açıklandı.

GitHub Secrets kaydedildikten sonra eski değeri tekrar göstermez. Boş görünmesi silindiği anlamına gelmez.

Doğru kontrol:

- Secret isimleri listede var mı?
- `Last updated` tarihi güncel mi?

Bu ikisi varsa secrets kaydedilmiştir.

### 5. GitHub Actions workflow incelendi

GitHub'daki workflow dosyasında şu yapı vardı:

```yaml
node-version: 20
local-dir: ./dist/
server-dir: ./public_html/
dangerous-clean-slate: false
```

FTP yolu artık doğru görünüyordu:

```yaml
local-dir: ./dist/
server-dir: ./public_html/
dangerous-clean-slate: false
```

Ancak Node sürümü eskiydi. Proje `package.json` içinde şu motoru istiyor:

```json
"node": ">=22.12.0"
```

Bu nedenle workflow yerelde Node 24'e güncellendi.

### 6. Yerelde workflow düzeltildi

Yereldeki dosya:

```text
.github/workflows/deploy.yml
```

şu şekilde düzeltildi:

```yaml
env:
  FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
```

ve:

```yaml
node-version: 24
```

Ayrıca FTP secrets gerçekten boşsa bunu daha anlaşılır gösterecek kontrol adımı eklendi:

```yaml
- name: Verify FTP secrets
  env:
    FTP_SERVER: ${{ secrets.FTP_SERVER }}
    FTP_USERNAME: ${{ secrets.FTP_USERNAME }}
    FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
  run: |
    test -n "$FTP_SERVER" || (echo "FTP_SERVER is empty" && exit 1)
    test -n "$FTP_USERNAME" || (echo "FTP_USERNAME is empty" && exit 1)
    test -n "$FTP_PASSWORD" || (echo "FTP_PASSWORD is empty" && exit 1)
```

Bu sayede sonraki deploy denemesinde secrets boşsa hata net okunabilecek.

### 7. Commit/push denenemedi

Yerelde workflow dosyası hazırlandı ancak commit/push tamamlanamadı.

Alınan hatalar:

```text
fatal: Unable to create 'E:/rastcreativesite/.git/index.lock': Permission denied
fatal: unable to access 'https://github.com/bewoai/rastcreativesite.git/': Failed to connect to github.com port 443
```

Sonuç: Bu ortamdan GitHub'a dosya gönderilemedi. Bu yüzden kullanıcıya GitHub web editöründe `deploy.yml` dosyasını elle değiştirmesi için tam içerik verildi.

### 8. Deploy hatası analiz edildi

Son GitHub Actions ekranında şu hata görüldü:

```text
Error: connect ETIMEDOUT ***:21 (control socket)
```

Bu hata şunu ifade eder:

- Secrets boş değil.
- GitHub runner FTP sunucusuna bağlanmaya çalışıyor.
- Fakat port 21 bağlantısı zaman aşımına düşüyor.

Bu şifre hatası değildir. Şifre hatası olsaydı genelde şu tarz hata olurdu:

```text
530 Login incorrect
```

Mevcut hata bağlantı seviyesinde:

```text
ETIMEDOUT
```

Yani sorun büyük ihtimalle:

- `FTP_SERVER` değerinin yanlış formatta olması
- Hostinger FTP endpoint'inin GitHub Actions runner'lardan erişilememesi
- FTP yerine FTPS/SFTP gerekmesi
- Hostinger tarafında geçici bağlantı/erişim problemi

## Yapılamayanlar

### 1. Otomatik deploy tamamlanamadı

GitHub Actions hâlâ FTP aşamasında hata veriyor.

Şu anki hata:

```text
ETIMEDOUT ***:21
```

Bu nedenle otomatik yayın akışı henüz çalışır durumda değil.

### 2. Domain nihai olarak çözülemedi

Hostinger panelinde domain/nameserver tarafında karışıklık yaşandı.

Panelde iki farklı nameserver ifadesi görüldü:

```text
ns1.dns-parking.com
ns2.dns-parking.com
```

ve:

```text
lunar.dns-parking.com
solar.dns-parking.com
```

Son durumda hangi ikilinin aktif olması gerektiği Hostinger panelinin güncel yönlendirmesine göre tekrar doğrulanmalı.

Önemli not: Domain Squarespace'te yönetiliyor. Eğer custom nameserver kullanılıyorsa Squarespace DNS kayıtları etkisiz kalır; DNS yönetimi Hostinger nameserver tarafına geçer.

### 3. GitHub'a yerelden push yapılamadı

Yerelde hazırlanan workflow düzeltmesi GitHub'a otomatik gönderilemedi.

Sebep:

- `.git/index.lock` oluşturma izni yok
- GitHub bağlantısı sağlanamadı

Bu yüzden GitHub web arayüzüyle manuel düzenleme gerekiyor.

## Şu An Takıldığımız Yer

Ana tıkanıklık GitHub Actions FTP bağlantısıdır.

Hata:

```text
connect ETIMEDOUT ***:21 (control socket)
```

Bu, GitHub'ın Hostinger FTP sunucusuna port 21 üzerinden ulaşamadığını gösterir.

## Kontrol Edilmesi Gereken Değerler

GitHub Secrets:

```text
FTP_SERVER   = 147.79.103.188
FTP_USERNAME = u584633029
FTP_PASSWORD = Hostinger FTP şifresi
```

`FTP_SERVER` içinde bunlar olmamalı:

```text
ftp://147.79.103.188
http://147.79.103.188
147.79.103.188/
```

Doğru format:

```text
147.79.103.188
```

Workflow tarafı:

```yaml
port: 21
protocol: ftp
local-dir: ./dist/
server-dir: ./public_html/
dangerous-clean-slate: false
timeout: 300000
```

## Sonraki Önerilen Adımlar

### 1. GitHub'daki workflow dosyasını güncelle

GitHub web editöründe:

```text
.github/workflows/deploy.yml
```

dosyası Node 24 ve `Verify FTP secrets` adımıyla güncellenmeli.

### 2. Actions tekrar çalıştırılmalı

GitHub'da:

```text
Actions > Deploy to Hostinger FTP > Run workflow > main
```

çalıştırılmalı.

### 3. Hata değişirse ona göre ayrım yapılmalı

Eğer şu hata gelirse:

```text
FTP_SERVER is empty
FTP_USERNAME is empty
FTP_PASSWORD is empty
```

Secrets gerçekten workflow'a gelmiyor demektir.

Eğer yine şu hata gelirse:

```text
ETIMEDOUT ***:21
```

FTP port 21 bağlantısı GitHub tarafından kurulamıyor demektir.

Bu durumda sıradaki deneme:

```yaml
protocol: ftps
port: 21
```

olmalı.

### 4. FTPS de olmazsa SFTP'ye geçilmeli

Hostinger panelinde SSH/SFTP erişimi varsa FTP yerine SFTP deploy daha sağlıklı olur.

Bu durumda workflow SamKirkland FTP action yerine SFTP destekleyen bir action ile değiştirilmeli.

### 5. Otomatik deploy çözülene kadar manuel yayın kullanılabilir

Geçici doğru manuel yayın akışı:

```text
npm run build
E:\rastcreativesite\dist içeriğini public_html içine yükle
```

Burada önemli olan `dist` klasörünün kendisini değil, içeriğini yüklemektir.

## Net Sonuç

Site kodu ve build tarafı çalışıyor.

Manuel yükleme ile site yayınlanabiliyor.

Otomatik deploy henüz çalışmıyor; tıkanma noktası FTP bağlantısında:

```text
ETIMEDOUT ***:21
```

Bir sonraki teknik karar:

1. FTP server değerini son kez doğrula.
2. GitHub workflow'u Node 24 + secrets kontrolüyle güncelle.
3. Aynı timeout devam ederse `protocol: ftps` dene.
4. FTPS de çalışmazsa SFTP deploy'a geç.

