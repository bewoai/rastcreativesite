# Bölüm: Google yorumları (`#yorumlar`, ana sayfa VI)

## Amaç (iş açısından)

Kurucuların "telefonu çekimi yönetenler açar" sözünü müşterinin kendi cümleleriyle
doğrulamak; ziyaretçiyi güvenle Süreç'e ("İlk durak: ücretsiz ön görüşme") ve forma
taşımak. Yorumlar Google İşletme Profili'ndeki gerçek yorumlardır, kelimesi kelimesine.

## Yer ve gerekçe

- Ana sayfada **#ekip (V) ile #surec arasında**, yorum varken **VI**.
- Ekip vaadi verir, yorumlar müşterinin ağzından doğrular, ardından Süreç gelir.
- IV'ün (markalar levhası) hemen ardına konmadı: iki yoğun ızgara üst üste biner.
- Formun hemen önü sayfanın ~%85 derinliğinde; ziyaretçilerin çoğu oraya inmiyor.

## Dosyalar

| Dosya | Ne |
|---|---|
| `src/data/google-reviews.ts` | Gerçek yorumlar (`GOOGLE_REVIEWS`) ve Google'ın puanı (`GOOGLE_RATING`). Sahibin düzenlediği tek dosya. |
| `src/data/google-reviews.fixture.ts` | 7 örnek yorum + örnek puan. Yalnız test. |
| `src/lib/reviews.ts` | Kaynak seçimi, build doğrulaması, biçimlendirme, açık/kapalı bölme. |
| `src/components/evren/EvReview.astro` | Tek kart. |
| `src/pages/index.astro` | Bölüm bloğu, `sceneNo`, "Reviews" CSS bloğu. |

## Davranış

- **Liste boşsa hiçbir şey basılmaz:** bölüm, önündeki bulut ve numarası yok. Sonraki
  bölümlerin numaraları (`sceneNo`) kendiliğinden kayar; Günlük boşken de boşluk kalmaz.
  Bölümün bulutu aynalanmaz (`ev-cloud--flip` yok); sonraki bulutlar yönlerini korur.
- **Puan plakası** ("4,9 · Google'da 9 yorum · Ekim 2026 itibarıyla") yalnız
  `GOOGLE_RATING`'den gelir. Google yalnız yıldız verilen oyları da saydığı için ortalama
  ve sayı **asla** listeden hesaplanmaz. `GOOGLE_RATING = null` plakayı gizler.
- **Açık / kapalı:** ilk 3 yorum açık, kalanlar "Diğer N yorumu okuyun" (`<details>`)
  içinde. 4 veya daha az yorumda hepsi açık. Ana sayfada en çok 12 yorum; fazlası
  "Tüm yorumları Google'da okuyun" linkinde.
- **Uzunluk** (code point):
  - ≤50 → serif italik alıntı. Üç sütunda kartın boş kalan yüksekliğinin ortasına oturur.
  - 261–450 → üç sütunda (≥1100 px) 6 satırda kırpılır, "Devamını okuyun" ile açılır;
    tek sütunda tamamı görünür. Üç sütunda satır en uzun kart kadar uzadığı için
    gerekli: kırpılmasa 426 karakterlik yorum 15 satır, yanındaki kırpılmış uzun yorum
    6 satır kalıyordu.
  - >450 → her genişlikte 6 satırda kırpılır.
  - Kırpma JS'siz: boş `<details>` + `:has()`; desteklemeyen tarayıcı tam metni gösterir.
    Metne yapılan tek şey dış boşlukların kırpılması.
  - Kırpma yalnız görsel; ekran okuyucu tam metni zaten okur. Kontrolün erişilebilir adı
    bunu söyler: "Devamını okuyun: Ad S. (tam metin ekranda açılır)" / "Daha az gösterin:
    Ad S. (metin ekranda kısalır)".
  - Kontrol `.ev-link` kalıbında: mürekkep renk, güneş yalnız hover'da. `--sun-text` gerçek
    kart camında ~4,1:1 ölçüldü (4,5'in altında).
  - Chromium kırpılan son satıra "…" ekler; satır noktayla bitiyorsa "yazıldı.…" görünür.
    Kabul edildi: altındaki "Devamını okuyun" devamı zaten haber veriyor.
- **Ad:** veri dosyasındaki gibi basılır. Avatar yok; baş harflerden monogram
  ("Dr.", "Op." gibi unvanlar atlanır, Türkçe büyük harf: i → İ).
- **Dış istek yok:** Google'a, gstatic'e veya avatar sunucusuna istek gitmez; yıldızlar
  tek bir CSS data-URI maskesi.
- **JSON-LD yok:** işletmenin kendi sitesinde kendisi hakkında gösterdiği yorumlar Google
  için "self-serving"; Review / AggregateRating rich result'a uygun değil, manuel işlem
  riski taşır. Bölüm düz HTML kalır.
- **Yeni JS dosyası veya istek yok.** Ana sayfanın mevcut script'ine birkaç satır eklendi:
  uzun yorum kapatılınca kontrol header'ın altında kaldıysa kart, header'ın altına geri
  getirilir (`jumpTo`, `.ev-review { scroll-margin-top: 5.5rem }`). Gerekçe: 320×568'de
  sona kadar okuyup "Daha az gösterin"e basınca odaktaki kontrol y=4–52'ye, header'ın
  (73'e kadar) altına kaçıyor, yorumun başı ekrandan çıkıyordu (WCAG 2.4.11). Daha geniş
  ekranlarda kontrol görünür kaldığı için script bir şey yapmaz.
- Linkler `data-cta-location` (`evren_reviews`, `evren_reviews_google`) ile
  BaseLayout'taki `cta_click` takibine girer.

## Sabitler (`src/lib/reviews.ts`)

| Sabit | Değer | Not |
|---|---|---|
| `REVIEWS_OPEN` | 3 | Açık duran yorum sayısı |
| `REVIEWS_ON_HOME` | 12 | Ana sayfadaki en çok yorum |
| `LONG_AT` | 450 | Her genişlikte kırpma eşiği. Tek sütun ölçüsü (`max-width: 33rem`) ile birlikte değişir: 6 satıra en çok 403 karakter sığdı (çok kısa kelimeli metin; tipik metin 365) |
| `MID_AT` | 260 | Yalnız üç sütunda kırpma eşiği. Üç sütun ölçüsü (en çok ~317 px) ile birlikte değişir: 6 satıra en çok 246 karakter sığdı (tipik 215) |
| `SHORT_AT` | 50 | Alıntı (pull-quote) eşiği; üç sütunda da yaklaşık iki satır |

Eşikler, "Devamını okuyun"un her genişlikte gerçekten metin açması için ölçüyle seçildi.
Ölçü (font, `max-width`, kart genişliği) değişirse yeniden ölçün.

## Örnek veri (fixture) kuralı

- Gerçek liste boşken örnek yorumlar **yalnızca** şuralarda görünür:
  - `npm run dev` (varsayılan; `REVIEWS_FIXTURE=0 npm run dev` boş durumu gösterir),
  - yerel `REVIEWS_FIXTURE=1 npm run build` (uyarı basar, "Örnek veri · yayında
    görünmez" damgası çıkar).
- CI'da (`CI` tanımlı) `REVIEWS_FIXTURE=1` build'i durdurur (dev sunucusu etkilenmez).
  Canlıda veri gelene kadar bölüm hiç basılmaz.
- Örnek D (371 karakter) orta uzunluk durumunu, C (597) uzun durumu dener.
- Gerçek listede `[Örnek]` ile başlayan metin build'i durdurur.

## Build doğrulaması

Hatalı kayıt build'i Türkçe mesajla durdurur (yorum sırası + isim + alan): boş
`author`/`text`, 1–5 dışı veya kesirli `rating`, "YYYY-MM" olmayan veya gelecekteki `date`,
boş `service`, listedeki yorum sayısından küçük `GOOGLE_RATING.count`, geçersiz (ör.
"2026-02-31") veya gelecekteki `asOf`. "Gelecek" bir gün payıyla ölçülür (Türkiye saati).
`asOf` 90 günden eskiyse uyarı verir.

## Sahibin adımları (yorum ekleme / güncelleme)

1. Google'da yorumun **"Orijinali göster"** metnini aynen kopyalayın (çeviriyi değil).
   Yazım hataları, emoji ve satır sonları kalır; paragrafları boş satırla ayırın
   (metni `` ` `` ters tırnak içine yapıştırın).
2. `author`: "Ad S." biçiminde (ad + soyadın baş harfi).
3. `rating`: o yorumun verdiği yıldız (1–5).
4. `date`: "YYYY-MM". Ayı yorum bildirim e-postasından veya İşletme Profili
   yöneticisinden alın; bilinmiyorsa uydurmayın, sorun.
5. `service`: yalnız kesin biliniyorsa ve yalnız hizmet türü olarak ("Tanıtım filmi"),
   firma adı değil.
6. Sıra = sayfadaki sıra. İlk üçün sırasını seçebilirsiniz, ama yıldızına göre yorum
   çıkarmayın.
7. `GOOGLE_RATING`: puanı, toplam sayıyı ve kopyaladığınız günü (`asOf`) Google'da
   görünen haliyle yazın.
8. Google'dan silinen yorumu buradan da silin. Yorumcu isterse aynı gün kaldırın (KVKK).
9. Bu yorumlar hekim sayfalarına konmaz.
10. `npm run build` hatasız bitmeli; yayından sonra ana sayfadaki bölümü kontrol edin.

**Operasyon notu:** yorum isteme teslimden sonra WhatsApp'tan yapılır (kısa link
`/yorum/`). Ana sayfaya "yorum bırakın" linki konmaz.

## Test listesi

1. `npm run build` (boş veri): `dist/index.html`'de `id="yorumlar"` yok; etiketler II…XI;
   ld+json değişmedi; konsolda "Veri yok" bilgisi.
2. `REVIEWS_FIXTURE=1 npm run build`: II…XII kesintisiz, bölüm #ekip'ten sonra, damga
   görünür, "yayına alınmamalı" uyarısı çıkar.
3. `CI=1 REVIEWS_FIXTURE=1 npm run build` durmalı.
4. 320 / 360 / 390 / 768 / 1099 / 1100 / 1440 px: yatay taşma yok; kırpılan metin
   gerçekten taşıyor; bir yorumu açınca komşu kartlar uzamıyor; üç sütunda kısa alıntı
   kartın ortasında, orta uzunluktaki yorum (örnek D) kırpılı.
5. 320×568: uzun yorumu açın, sonuna inin, "Daha az gösterin": kart header'ın altına
   gelmeli, kontrol odakta ve görünür kalmalı.
6. Klavye, ekran okuyucu (yıldız metni, puan cümlesi, yeni sekme uyarısı, `lang="en"`),
   reduced-motion, JS kapalı, forced-colors.
7. Network: google / gstatic / googleusercontent isteği yok.
8. `contain-intrinsic-size` içerik kutusu yüksekliğidir (padding hariç): ≥1100 px 840,
   561–1099 px 1300, ≤560 px 1550. Örnek veri (damga hariç) ve 426/12/600 karakterlik bir
   setle ölçülen: 828–852 / 1223–1395 / 1249–1719 (360–430 px telefonlarda 1427–1651).
9. Soğuk `/#on-gorusme` (1440, 4× CPU): CLS ≈ 0,30, yorumsuz sürümle aynı; `/#yorumlar` da
   ≈ 0,30. Bulut aynalaması `:nth-of-type` ile sayılsaydı ikisi de 0,48 oluyordu.

## Bilinen ödünler

- **761–1099 px tek sütun:** iPad yatay (1024) ve küçük dizüstünde kartlar ortalanmış tek
  sütun (en çok 38rem); yanlarda boşluk kalıyor, hemen altındaki Süreç dört sütun. Yalnız
  kalan kart olmasın diye bilerek seçildi; üç sütunu ~1000 px'te başlatmak sahibin tasarım
  kararı (yapılırsa `MID_AT` ve `contain-intrinsic-size` yeniden ölçülmeli).
- **Boş yıldız soluk:** 5'ten az yıldızlı yorumda boş yıldız camda ~1,5:1. Puan ekran
  okuyucuya metin olarak veriliyor; görsel çözüm (çerçeveli boş yıldız veya görünür "4/5")
  ilk 5'ten düşük yorum girildiğinde ele alınacak.
- **Ortak stiller (ayrı iş):** `.ev-label__n` numarası çıplak gökyüzünde 3,8–4,8:1;
  `html`'de `scroll-padding-top` olmadığı için Shift+Tab, yarısı ekran dışında kalan bir
  kontrolü header'ın altına kaydırabiliyor; soğuk derin linklerde (`/#…`) üstteki
  sahneler çizilince hedef kayıyor (CLS 0,2–1,0, Lighthouse görmez). Üçü de tüm sayfayı
  ilgilendiriyor; bu bölümle gelmedi.

## Açık sorular (sahibe)

- H2: "Sözü *müşterilere* bırakalım." Yorumcuların hepsi müşteri değilse yedek:
  "Bir de *müşterilerden* dinleyin."
- Açık duracak ilk üç yorumun sırası.
- `service` etiketleri doldurulsun mu?
- Puan birkaç ay sabit kalırsa ayrı iş: `#on-gorusme` lede'sinin altına düz metin
  "5,0 · Google'da N yorum"; hero kanıt satırına "Google 5,0" (v11 CLS kilidi nedeniyle
  ölçüm gerekir).

## Güncelleme 20 Ekim 2026: ilk gerçek veri

- 5 yorum girildi (sahibin ekran görüntülerinden, metinler aynen). Sıra: Aytaş Home,
  E. Ç., M., M. S., A. A.; ilk üçü açık, iki yorum "Diğer 2 yorumu okuyun" altında.
- İsimler yalnız baş harf (sahibin kararı). Aytaş Home bir işletme, adı kaldı.
  `service` yalnız işini bildiğimiz iki müşteride var.
- Listede yok: yalnız yıldız veren 2 değerlendirme; yazanın müşteri olduğu sahipten
  teyit edilene kadar bekleyen 1 yorum (soyadı bir kurucuyla aynı; akraba yorumu hem
  Google kurallarına aykırı hem sitede yanıltıcı olur).
- `GOOGLE_RATING` henüz null: ekran görüntülerinde Google'ın üstteki puan/sayı satırı
  yoktu. Sahip o satırı gönderince plaka açılır.
- Hizmet + tarih satırı kart ~22rem'den darsa (320–360px telefon, 1100px'te üçlü)
  alt alta iner (container query); "Ekim / 2026" bölünmesi ve asılı "·" kalmadı.
