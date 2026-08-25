# Deploy talimatı — reklam dönüşüm düzeltmeleri

Yama dosyası: **`reklam-donusum-duzeltmeleri.patch`** (bu klasörde)
Temel alınan: `a426ae6` — yani **şu an canlıda olan kod**

---

## Neden bu adımı siz atıyorsunuz

Push işlemi GitHub kimlik doğrulaması istiyor. Şifrenizi/token'ınızı
kullanmam doğru olmaz, o yüzden son adım sizde. Geri kalan her şey
hazır ve doğrulandı.

---

## Doğrulama — deploy öncesi yapılanlar

Değişiklikler, GitHub'dan **temiz bir klon** üzerine uygulanıp test edildi:

| Kontrol | Sonuç |
|---|---|
| Yama canlı koda temiz uygulanıyor mu | ✅ çakışma yok |
| `npm run build` | ✅ hatasız |
| Üretilen sayfa sayısı | ✅ 216 (baseline ile aynı) |
| Kaybolan / eklenen sayfa | ✅ yok |
| WhatsApp linki gerçekten `wa.me` mi | ✅ 3 yerde, eski yönlendirme 0 |
| Form zorunlu alan sayısı | ✅ 5 → 2 |
| Hero birincil buton `/iletisim`'e mi gidiyor | ✅ evet |
| Animasyon mantığı (9 senaryo) | ✅ 9/9 |

---

## Adımlar

### 1. Yerel depoyu toparlayın

Yarım kalan bir rebase var (sandbox `.git` kilit dosyası oluşturamadığı için
takıldı). Önce onu temizleyin:

```bash
cd ~/Desktop/rastsite

rm -f .git/*.lock .git/refs/heads/*.lock
rm -rf .git/rebase-merge .git/rebase-apply
git rebase --abort 2>/dev/null

git checkout main
git fetch origin
git reset --hard origin/main
```

> `reset --hard` yereldeki yarım kalan değişiklikleri siler. **Sorun değil** —
> tüm düzeltmeler yama dosyasında duruyor.

### 2. Düzeltmeleri uygulayın

```bash
git am --3way reklam-donusum-duzeltmeleri.patch
```

Beklenen çıktı: `Applying: fix: reklam trafigi icin donusum engellerini kaldir`

### 3. Kendi makinenizde de build alın

```bash
npm ci
npm run build
```

`216 page(s) built` görmelisiniz.

### 4. Yerelde son bir göz atın

```bash
npm run preview
```

Tarayıcıda kontrol edin:

- `http://localhost:4321/` → giriş animasyonu **oynamalı** (organik ziyaret)
- `http://localhost:4321/?gclid=test` → animasyon **oynamamalı**, içerik anında gelmeli
- Mobil görünümde (F12 → cihaz modu) alt bardaki WhatsApp butonu → gerçek
  WhatsApp'a gitmeli, mesaj hazır gelmeli
- `/iletisim` → sadece Ad Soyad ve Telefon yıldızlı olmalı
- Ana sayfada birincil buton "Proje Başlat" olmalı

### 5. Deploy

```bash
git push origin main
```

Sonrası otomatik:
`main`'e push → GitHub Actions build → `deploy` branch → Hostinger çeker.

İlerlemeyi buradan izleyebilirsiniz:
https://github.com/bewoai/rastcreativesite/actions

---

## Bir şey ters giderse

Deploy'u geri almak için:

```bash
git revert HEAD
git push origin main
```

Aynı otomatik hat çalışır, site bir önceki haline döner.

---

## Deploy sonrası kontrol

Site yayına girdikten sonra:

- [ ] `rastcreative.com/?gclid=test` → siyah ekran beklemeden içerik geliyor
- [ ] Telefondan girip alt bardaki WhatsApp'a basın → sohbet açılıyor,
      mesaj hazır
- [ ] Formu sadece ad + telefonla gönderin → `/tesekkurler` sayfası açılıyor
- [ ] GA4'te `lead_form_submit_success` olayı düşüyor

### Ölçümde dikkat edilecek nokta

`contact_whatsapp_click` olayı **4 Ağustos'tan beri hiç tetiklenmiyordu**
(buton `wa.me` yerine forma gidiyordu, ölçüm ise `href` içinde `wa.me` arıyor).
Bu düzeltmeden sonra tekrar veri gelmeye başlayacak. Geçmişle kıyaslarken bu
kırılmayı hesaba katın — artış gerçek bir artış değil, ölçümün yeniden
başlaması olacak.

---

## Google Ads tarafında yapılanlar (hatırlatma)

- Günlük bütçe: ₺200 → **₺100**
- Teklif stratejisi: Hedef EBM ₺320 → **Hedef EBM'siz** "Dönüşüm sayısını
  en üst düzeye çıkarma"

Sebep: ayda 2 dönüşümle Hedef EBM çalışmaz (Google'ın eşiği 30/ay). Site
düzeldikten sonra 2-3 hafta veri toplayıp bütçeyi yeniden değerlendirelim.
