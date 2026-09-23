# Evren — çok yönlü inceleme ve tasarım kararları (v3)

Sayfa: `src/pages/taslak/evren.astro` → `/taslak/evren/` (noindex, sitemap dışı).
Tarih: 2026-09-23. v2'nin incelenmesi ve v3'te uygulanan kararlar.

## Ana teşhis

v2'de iki ayrı dünya vardı: sisli, ışıklı, fotoğrafik bir **evren** ve bunun üzerine
konmuş **şablon bir arayüz** (opak beyaz kartlar, siyah hap butonlar, büyük harfli çip
etiketler, kareli defter el yazısı). Kullanıcının hissettiği "ayrıklık" buydu. Arayüz
evrenin malzemesinden yapılmamıştı.

## İnceleme

### Sanat yönetmeni
- Kartlar sisin içinde yüzen **kağıt** gibi duruyordu; evrende kağıt yok, ışık ve sis var.
- Caveat el yazısı bir **defter/masa** dünyasına ait; sisli evrenle çelişiyor.
- Inter + Space Grotesk çipler = SaaS dili. Görseller şiirsel ve sinematik.
- Yörüngenin ortasındaki CSS küre fotoğraftaki küreye benzemiyordu (iki farklı güneş).
- Evren sadece hero'da vardı; aşağıda düz renkli boş alanlar kalıyordu.
- Satüre turuncu `#e25303` (halka, nokta) şeftali ışığıyla çatışıyordu.

### Kullanıcı deneyimi
- Hero CTA'sı ve başlık yapısı doğru; korunmalı.
- Vaka kartındaki "Süre / Yıl / Format" bilgileri karar vermeye yardım etmiyordu.
- Yörünge + panel akışı iyi ("Sonraki durak" ile sıralı okunuyor); korunmalı.
- Formdaki gri el yazısı placeholder'lar düşük kontrastlıydı.
- SSS yoktu: fiyat ve süre sorusunun cevabı sayfada değildi.

### Potansiyel müşteri (35+, Sakarya'da fabrika / klinik / mağaza sahibi)
- İlk ekranda sadece küre vardı: "Bu bir yapay zeka şirketi mi?" riski. Gerçek işin
  ilk ekranda görünmesi lazım.
- "Kiminle konuşacağım?" sorusunun cevabı yoktu. Kurucuların yüzü güven verir.
- Fiyat ve süre soruları sayfada cevaplanmıyordu.

### Teknik / erişim
- Soluk başlık rengi (`#8c847b`) sınırdaydı; küçük metinde kullanılmamalı.
- Caveat 1.3rem ile 35+ okuyucu için zor okunuyordu.
- Performans iyi (video toplam < 1 MB), hareketi azaltma ayarına uyuluyor.

## Kararlar (v3'te uygulandı)

| # | Karar | Neden |
|---|---|---|
| 1 | **Malzeme = sis camı.** Tüm yüzeyler yarı saydam, `backdrop-filter` ile bulanık, üst kenarından ışık alan cam. Opak beyaz kart yok. | Arayüz evrenin içinde yaşasın. |
| 2 | **Sis tüm sayfanın arkasında.** Sabit tek katman (`.ev-sky`, `sis.webp`), sağ üstten sıcak ışık. | Evren hero'da bitmesin. |
| 3 | **Tek ses: Instrument Serif.** Başlıklar serif; vurgu gri renk yerine *italik*. Gövde Inter, etiketler küçük Space Grotesk. | Sinematik "title card" hissi, görsellerle aynı şiirsellik. |
| 4 | **El yazısı → fısıltı.** Notlar kalıyor ama serif italik, önlerinde ince bir ışık çizgisi. Aynı metinler. | Notların sıcaklığı kalsın, dünyası değişsin. |
| 5 | **Işık tek aksan.** Aktif durumlar turuncu çerçeveyle değil **parıltıyla** gösterilir. Metin olarak güneş rengi `#94420f` (AA). | Şeftali ışıkla uyum, kontrast korunur. |
| 6 | **Çipler kalktı.** Bölüm etiketi = numara + küçük harf aralıklı etiket + ince çizgi. | SaaS dilinden çıkış. |
| 7 | **Hero'da gerçek iş.** Sağ altta küçük "Ekranda" monitörü öne çıkan işlerin karelerini döndürür; tıklayınca işlere gider. | "AI şirketi" algısını kırar, kanıt ilk ekrana gelir. |
| 8 | **Yeni: Muhatabınız.** İki kurucu ortağın fotoğrafı (sıcak monokrom), doğrulanmış cümle: kurucu ortaklarla konuşursunuz. | Güven. |
| 9 | **Vaka bilgisi = Sektör / İş / Süre.** | Müşteri "benim sektörümde yapmışlar mı?" diye bakar. |
| 10 | **Yörüngenin merkezinde gerçek küre** (`kure.webp`, hero karesinden kesit, maskeli). | Tek güneş. |
| 11 | **Yeni: SSS** (içerik koleksiyonundaki 6 soru; fiyatlandırma dahil). | Karar öncesi en sık sorular. |
| 12 | **Logo duvarı** cam çiplere, logolar `multiply` ile sise karışır. | Şablon görünümünden çıkış. |
| 13 | **Form cam föy**, şafak videosu arkasında. Doldurulan kelimeler serif italik; placeholder kontrastı yükseltildi. | Bütünlük + okunurluk. |
| 14 | **Header yüzen cam şerit.** | Aynı malzeme. |

## Açık konular

- Ana sayfaya taşınırken: bölgesel SEO bloğu (AreaIndex), blog ve FAQ schema bu taslakta yok.
- GlassNav ve iç sayfalar henüz bu dile çevrilmedi.
- Kurucu fotoğrafları birbirinden çok farklı; CSS ile eşitlendi, ideali aynı ışıkta yeni çekim.
- Gerçek Lighthouse ölçümü (backdrop-filter mobilde maliyetli olabilir) prod önizlemede yapılmalı.

## v4 (2026-09-23) — mitik doku, bulut geçişleri

Kullanıcı geri bildirimi: süreç bölümü çok dikey, animasyon ekranın altında kalıyor;
markalar bölümü değişsin; site daha mitik ve dokulu olsun; bölüm geçişleri bulutla.

- **Süreç tek ekran.** Masaüstünde yörünge (27rem) ve panel yan yana, panel görseli
  21:9. Mobilde yörünge dört duraklı bir "ufuk çizgisine" dönüşür, panelin üstüne
  yapışır (sticky); güneş çizgi boyunca seçili durağa kayar. Dokun, gör; kaydırma yok.
- **Markalar = oyma levha.** Kayan logo bandı kalktı. 16 marka numaralı bir levhada;
  saydam logolar kabartma siluet, kendi zemini olan logolar `multiply` ile sise basılı.
  Üzerine gelince arkasında güneş ışığı doğar. (Logo saydamlıkları dosya dosya kontrol edildi.)
- **Doku.** Cam yüzeylere kağıt/taş greni ve iç oyma çerçeve; etiketler serif büyük harf,
  Roma rakamı ve ✦ yıldız; butonlar, linkler ve menü serif. Gökyüzünde yavaş süzülen ışık tozu.
- **Bulut geçişleri.** Her bölüm arasında, sis karesinin aynalanmış (dikişsiz) şeridi iki
  katmanda zıt yönlere süzülür, üst ve alt kenarı maskeyle erir. Zamana bağlı, scroll'a
  bağlı değil; hareketi azaltma ayarında durur. Hero'nun alt kenarı da artık düz renge
  değil gökyüzüne erir.
- **Düzeltme:** global `body { overflow-x: hidden }` body'yi scroll kabı yapıp sticky'yi
  öldürüyordu; bu sayfada `overflow-x: clip` ile header ve durak şeridi yapışıyor.
