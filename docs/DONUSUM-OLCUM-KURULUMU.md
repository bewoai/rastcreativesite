# Donusum Olcum Kurulumu

Google Ads acilmadan once ana donusum olarak yalnizca gercek basarili form
gonderimi kullanilmalidir. Bu projede form, Web3Forms API'den basarili cevap
aldiktan sonra GA4'e `lead_form_submit_success` event'i yollar ve ziyaretciyi
`/tesekkurler` sayfasina yonlendirir.

## GA4 key event

GA4 tarafinda key event icin onerilen hedef:

```text
event_name = lead_form_submit_success
```

Alternatif kontrol hedefi:

```text
page_path = /tesekkurler
```

WhatsApp, telefon ve e-posta tiklamalari ana form donusumu degildir. Ayrica
olculen destek event'leri:

```text
contact_whatsapp_click
contact_phone_click
contact_email_click
```

## Ekip trafigini ayirma

Kod, `localhost`, `127.0.0.1` ve `/admin` sayfalarinda GA4 gondermez.

Ekip tarayicilarinda canli site icin bir kez su adres acilabilir:

```text
https://rastcreative.com/?rc_analytics=off
```

Ayni tarayicida tekrar olcumu acmak icin:

```text
https://rastcreative.com/?rc_analytics=on
```

IP bazli filtre icin GA4 Admin alaninda Internal traffic rule eklenmeli ve
ekip/ofis IP adresleri dislanmalidir. Bu ayar koddan guvenilir sekilde
yapilamaz.

## Google Ads

GA4 ile Google Ads baglandiktan sonra Google Ads'e aktarilacak ana donusum:

```text
lead_form_submit_success
```

WhatsApp, telefon ve e-posta tiklamalari baslangicta sadece gozlem olarak
tutulmalidir. Otomatik teklif stratejileri icin ana optimizasyon sinyali
basarili form gonderimi olmalidir.
