# Donusum Olcum Kurulumu

Google Ads acilmadan once ana donusum olarak yalnizca gercek basarili form
gonderimi kullanilmalidir. Bu projede form, Web3Forms API'den basarili cevap
aldiktan sonra GA4'e `generate_lead` event'i yollar (31.10.2026'ya kadar adi
`lead_form_submit_success` idi) ve ziyaretciyi
`/tesekkurler` sayfasina yonlendirir.

## GA4 key event

GA4 -> Admin -> Data display -> Events (veya Key events) altinda su event'ler
**Key event** olarak isaretlenmeli (event ilk kez geldikten sonra listede
gorunur; gelmediyse "New key event" ile adini elle yazin):

```text
generate_lead     ana donusum: iletisim formu (ContactForm, ana sayfa formu)
                  Web3Forms'tan basarili cevap geldikten sonra
whatsapp_click    wa.me / api.whatsapp.com linki
phone_click       tel: linki
```

`email_click` (mailto:) key event yapilmaz; olculur ama hacmi dusuk ve
cogu zaman dogrudan donusum degil.

Tum event'lerde `page_path` (tiklanan/gonderilen sayfa) vardir. Tiklama
event'lerinde ayrica:

```text
link_location  header | callbar (mobil alt cubuk) | footer | body
link_url       tiklanan href
cta_location   linkte data-cta-location varsa (orn. alt_cubuk_whatsapp)
```

Tekillestirme: iletisim linkleri (tel/mailto/WhatsApp) yalnizca kendi
event'ini atar; `data-cta-location` tasisalar bile ayrica `cta_click`
gitmez. `cta_click` artik yalniz form/sayfa CTA'lari icindir. Eski
`contact_whatsapp_click`, `contact_phone_click`, `contact_email_click` ve
`lead_form_submit_success` 31.10.2026'dan sonra gelmez; eski raporlarda
iki ismi birlikte filtreleyin. GA4'te `link_location` icin Event scope
custom dimension ekleyin.

Alternatif kontrol hedefi:

```text
page_path = /tesekkurler
```

WhatsApp, telefon ve e-posta tiklamalari ana form donusumu degildir. Ayrica
olculen destek event'leri:

```text
whatsapp_click
phone_click
email_click
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
generate_lead
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
                      (whatsapp_click ile birlikte gider)
generate_lead
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
   `generate_lead` ve `kaynak` = `hekim`; kirilim `paket`.
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
