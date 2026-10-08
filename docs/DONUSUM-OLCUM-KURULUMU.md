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

## Hekim sayfasi

`/hekim-icerik-sistemi/` ve iki vaka sayfasindaki (`duygu-hoca`,
`dr-erdem-caliskan`) tum CTA'lar iletisim formuna su adresle gider:

```text
/iletisim/?kaynak=hekim&paket=<baslangic|standart|klinik|genel>#teklif-formu
```

`genel` = belirli bir paket secilmedi (hero, final ve vaka CTA'lari).

Form bu degerleri gizli `kaynak` ve `paket` alanlarina yazar; Web3Forms
e-postasinda gorunur. Ayrica proje turu "Hekim Icerik Sistemi" secilir ve
e-posta konusu "Yeni hekim icerik sistemi talebi (paket) - rastcreative.com"
olur. Sadece izin verilen degerler (kaynak=hekim, 4 paket) kabul edilir.

### Event'ler

```text
hekim_cta_click       paket = baslangic|standart|klinik|genel
                      konum = hero|paketler|final|vaka_duygu|vaka_erdem
                      (event_category=hekim, link_url)
hekim_whatsapp_click  hekim sayfalarinda herhangi bir WhatsApp linki tiklandiginda
                      (contact_whatsapp_click ile birlikte gider)
lead_form_submit_success
                      mevcut event; hekim linkinden gelindiyse ek olarak
                      kaynak=hekim ve paket=<...> parametreleri tasir
```

Ikinci bir lead event'i yoktur; hekim formu da ayni ana donusumu sayar.
`hekim_cta_click`/`hekim_whatsapp_click` sadece destek (mikro) event'idir.
Mevcut `rc_analytics=off` ve localhost/admin dislamasi bunlar icin de gecerlidir.

### GA4'te gorme

1. Admin -> Custom definitions -> Create custom dimension: Event scope ile
   `paket`, `konum` ve `kaynak` parametrelerini ekleyin (kayit sonrasi
   veri gelmesi 24 saat surebilir; gecmise donuk dolmaz).
2. Explore -> Free form: Dimension `Event name`, `paket`, `konum`; Metric
   `Event count`. Filtre: `Event name` hekim_cta_click ile baslar.
3. Hekim kaynakli lead sayisi: ayni raporda filtre `Event name` =
   `lead_form_submit_success` ve `kaynak` = `hekim`; kirilim `paket`.
4. Anlik dogrulama: Admin -> DebugView (tarayicida GA debug eklentisi ile)
   veya Reports -> Realtime.

### Search Console notu

Hekim sayfasi ve iki vaka sayfasi su an `noindex, follow` yayindadir
(fiyatlar ve vaka metinleri sahip onayi bekliyor). Bu yuzden Search
Console'da organik gosterim/tiklama gelmez ve "Dizine eklenmedi" gorunmesi
beklenen durumdur; trafik dogrudan, sosyal veya reklam disi baglantilardan
gelir. `noindex` kaldirildiktan sonra URL Inspection ile indexleme
istenmelidir. Canonical query icermedigi icin `?kaynak=hekim` linkleri
iletisim sayfasinin canonical'ini bozmaz.
