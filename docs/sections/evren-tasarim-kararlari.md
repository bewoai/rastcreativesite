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

## v5 (2026-09-23) — güçlü yazı, tek bakışta süreç, site içi oynatıcı

Geri bildirim: süreç hâlâ kötü (her şey tek sayfada okunmalı), fontlar ince/cılız,
Roma rakamı kullanılabilir, kurucular siyah beyaz olmamalı, video oynatıcı site içinde
kalmalı, biraz animasyon. Arayüz yönü için kullanıcı "Mitik levha"yı seçti.

- **Süreç = dört levha yan yana.** Dördü de aynı anda, tam metniyle okunur; tıklama
  gerekmez. Üstlerinde ışık çizgisi, güneş I → IV arasında kendi yürür ve bulunduğu
  durağı hafifçe öne çıkarır (üzerine gelince orada durur). Tablette 2×2, telefonda alt alta.
- **Yazı.** Başlık fontu Fraunces (değişken, 560–620 ağırlık, self-host, latin-ext).
  Etiket, buton, menü ve linkler kalın Inter (600–700). Gövde 430 ağırlık.
- **Roma rakamları:** bölüm etiketleri, süreç durakları (I–IV), vaka sayacı (I / VIII),
  marka levhası (I–XVI).
- **Kurucular renkli**, sise hafif ısıtılmış. Not: Berat Değirmenci'nin kaynak
  fotoğrafı zaten siyah beyaz; renkli versiyonu gerekli.
- **Sinema oynatıcı.** "Filmi izle" tam ekran karartılmış bir pencerede, site içinde
  YouTube (nocookie) oynatır; ESC / kapat / arka plana tıklama ile kapanır, video durur,
  odak butona döner. YouTube'a yönlendirme yok. (Önizleme artifact'ı dış oynatıcı
  barındıramadığı için orada yalnızca kapak ve açıklama görünür.)
- **Animasyon.** Hero başlığı kelime kelime sisten doğar; bölümler ekrana girerken
  yumuşakça belirir (JS yoksa ya da hareket azaltıldıysa hiçbir şey gizlenmez); hero
  görüntüsü imlece hafifçe eğilir; marka levhasının üstünden ara ara ışık geçer.

## v6 (2026-09-23) — hata taraması, dolly-in açılış, beliriş animasyonları

- **Hata taraması** (masaüstü/tablet/390/320, JS kapalı, hareket azaltılmış): 320px
  taşmaları, 44px dokunma alanları, zemini olan logolar (saydamlaştırılmış kopyalar
  `src/assets/logos/levha/`), daha hızlı beliriş.
- **Set arayüzü kaldırıldı:** timecode, REC ışığı, PGM/format/süre şeridi (kullanıcı:
  siteye yakışmıyor). Süre bilgisi kartın bilgi listesinde duruyor.
- **Dolly-in (ortağın brief'i: "kaydırdıkça ilerleyen kamera").** Hero ~2 ekran boyunca
  sabitlenir; kaydırma ilerlemesi (`--p`, 0→1) kamerayı güneşe doğru iter, başlık
  yukarı süzülüp sise dağılır, bulutlar (screen) gelir, güneşin yanından geçerken ışık
  patlaması olur, sahne göğe erir ve ilk bölüm başlar. Scroll ele geçirilmez; yalnızca
  ilerleme okunur (rAF ile). Hareket azaltmada hero normal, sabitsiz.
  Not: `screen` harmanlaması, kapsayıcıda opacity/transform olursa izole olur ve siyah
  görünür — saydamlık görsellere verilir, hero'nun kendi sis zemini vardır.
- **Beliriş animasyonları:** bölüm başlıkları, vaka kaydırmalısı, süreç levhaları,
  ekip kartları, hizmetler, SSS maddeleri, marka levhası hücreleri (satır satır), form
  föyü ve footer kademeli belirir; fısıltı ve etiket çizgileri ardından çizilir.

### v6.1 — dolly'nin düzeltilmesi: yaklaş, sonra alçal

İlk dolly "olduğu yerde kaybolup gidiyordu" (kullanıcı). Hareket iki aşamaya ayrıldı:
A) güneşe yaklaşma (p 0→.45), B) kameranın aşağı eğilip bulutların içinden alçalması
(p .35→1). B'de sahne kadrajdan yukarı çıkar, üç bulut katmanı farklı hızlarla alttan
gelip geçer (uzak/yakın/zemin → derinlik), hiçbir şey yerinde solmaz. Sabitlenen
karenin alt kenarı alçalma bitince göğe erir; "Seçili işler" bulutların altından çıkar.
