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

### v6.2 — tek çekim: yaklaş + alçal + bölüm değişimi aynı anda

Kullanıcı: üç aşama ayrı ayrı hissettiriyor, tek ve pürüzsüz bir hareket olsun.
Sabitleme (sticky pin) kaldırıldı; sayfa normal kayar ve derinlik katmanları farklı
hızlarda hareket eder: güneş/sahne büyür ve sayfadan geri kalır (yaklaşma + uzak
plan), yazılar sayfadan hızlı yükselir (yakın plan), iki bölümün birleşim yerine
oturan bulut kümesi (üç katman) en hızlı yükselir. Sonuç: yaklaşırken alçalıyoruz ve
bir sonraki bölüm, güneş hâlâ arkadayken bulutların içinden geliyor. Hero'dan sonraki
statik bulut geçişi bu küme ile değiştirildi.

### v6.3 — hero toparlandı

Kullanıcı: hero dağınık. Sorunlar ve kararlar:
- **HUD kaldırıldı.** Koordinat ve "Film · Fotoğraf · İçerik · AI" satırı, dolly'nin
  `translate`'i içerik kutusunu kapsayıcı blok yaptığı için yanlış yere (sol üst, sağ
  üst) düşüyordu; üstelik üst etiketi tekrarlıyordu. Tek etiket: "Video prodüksiyon ·
  Sakarya" (mobilde tek satır).
- **Tek ızgara:** metin + sağda "yan grup" (fısıltı + yayındaki monitör) aynı içerik
  genişliğinde, alt kenarları hizalı. Monitör artık bulutların içine gömülmüyor.
  900px altı monitör gizlenir, fısıltı metin grubunun altına iner; telefonda güneşin
  yanına çıkar.
- **Mobil kadraj:** video hero'dan uzun tutulup yukarı kaydırıldı; güneş yazının
  arkasında değil, üstteki açık gökte. İki buton yan yana sığıyor.
- **Başlık butonu:** "Ücretsiz ön görüşme" arasındaki çift boşluk düzeltildi; dar
  ekranda "Ön görüşme".

### v7 — serbest tur: iletişim yeniden, bütün sayfada UI/UX düzeltmeleri

Kullanıcı iletişim bölümünü beğenmedi ve sitenin geri kalanında serbest bıraktı.
- **İletişim (VIII):** kutu içinde kutu kaldırıldı. Şafak videosu hero gibi tam
  genişlikte, üstten ve alttan sise eriyor; güneş içeriğin altında ufukta. Solda
  başlık, "Sonra ne olur?" (I formu gönderin · II sizi arıyoruz · III kapsam ve
  teklif) ve doğrudan hatlar (WhatsApp, telefon, e-posta); sağda cümle formu. Form
  alanları içerik kadar genişliyor (`field-sizing: content`), cümle tek parça
  okunuyor. Müşteriye yabancı "föy" dili kaldırıldı: buton "Gönder, sizi arayalım".
  Mobilde form, adımlardan önce gelir (önce lead).
- **Süreç (IV):** telefonda her durak küçük görsel + metin satırı; dört durak
  yaklaşık bir buçuk ekranda okunuyor (önce ~2000px). IV. durağın etiketi
  kısaltıldı, kartlar hizalı.
- **Markalar (VII):** 16 marka geniş ekranda 8 × 2, arada 4 × 4; telefonda kompakt
  levha (isimler ekran okuyucu için duruyor).
- **SSS (VI):** "Sorunuz burada yok mu?" + WhatsApp; masaüstünde sol boşluğu
  dolduruyor, telefonda soruların ardından geliyor.
- **Üst menü:** ekrandaki bölümün linkinin altında küçük bir güneş.
- **İşler (II):** kart gölgesi kaydırıcı sınırında kesilip sert bir şerit
  oluşturuyordu; gölgeye sönme payı verildi.
- **Ekip (III):** Berat'ın elimizdeki tek fotoğrafı siyah-beyaz; renkli fotoğraf
  gelene kadar sayfanın ışığına ısıtıldı (`mono`). Renkli kare gelince bayrak kalkar.
- **Footer:** telefonda iki kolon (sayfalar | sosyal), iletişim altta tam genişlik;
  KVKK/Telif dokunma alanı büyütüldü.

### v8 — ana sayfaya taşımaya hazırlık: SEO içeriği evrene girdi

Eski ana sayfanın arama motoru / AI görünürlüğü taşıyan blokları evren diline
çevrilerek taslağa eklendi; taslak artık ana sayfanın yerine geçebilecek durumda.
- **VI · Stüdyo ve bölge (`#bolge`):** "Rast Creative Studio ne yapar?" yanıt-öncelikli
  metni, künye (merkez / bölge / hizmetler), "Sakarya'da video çekimi nasıl
  planlanır?" metni (açılır, içerik DOM'da) ve bölgesel hub: 5 öncelikli hizmet ×
  22 bölge sayfası linki (eski `AreaIndex` ile aynı linkler).
- **IX · Günlük (`#gunluk`):** son 3 blog yazısı, cam kartlar.
- **JSON-LD:** Organization + WebSite + LocalBusiness + FAQPage (eski ana sayfayla aynı).
- **Hero H1:** üst etiket H1'in içine alındı → H1 "Sakarya video prodüksiyon — İyi iş
  kendini izletir." diye okunur (slogan tek başına anahtar kelime taşımıyordu).
- Bölüm numaraları: VI bölge · VII SSS · VIII markalar · IX günlük · X ön görüşme.

Taşıma adımı (onay bekliyor): `src/pages/index.astro` → `taslak/eski-anasayfa.astro`
(noindex, geri dönüş için), `taslak/evren.astro` → `index.astro`; import yolları bir
seviye yukarı; `title/description/noindex` kaldırılır (varsayılan başlık), taslak
URL'si ana sayfaya yönlenir.

### v9 — sıra, mobil menü, performans (canlıya alınmıyor, geliştirme sürüyor)

- **Bölüm sırası:** güven sinyali öne alındı → I hero · II işler · III markalar ·
  IV ekip · V süreç · VI hizmetler · VII SSS · VIII stüdyo ve bölge · IX günlük ·
  X ön görüşme. Bölge (SEO) kullanıcı akışında sona yakın, SSS'den sonra.
- **Mobil menü (≤900px):** çubuğun kardeşi olan cam panel (iç içe backdrop-filter
  sayfayı bulanıklaştıramıyor), romen numaralı bölüm linkleri + ön görüşme,
  WhatsApp, telefon. Açılınca odak ilk linke, Esc/dış tık/link ile kapanır, odak
  butona döner. 380px altında WhatsApp ikonu çubuktan menüye geçer. Bölümlere
  `scroll-margin-top`: başlık, yüzen çubuğun altında kalmıyor.
- **Performans (build + preview, mobil 4× CPU + yavaş 4G):**
  - LCP 2,34 sn → **0,94 sn.** Video `poster`'ı ekrana göre değişemediği için
    telefon geniş kareyi indiriyordu. Durağan kare artık duyarlı `<picture>`,
    ekrana göre önden yükleniyor (`preloadImages`); video oynayınca üstüne eriyor.
  - CLS 0,027 → **0,007.** Fraunces (latin + latin-ext + italik) önden yükleniyor
    (`preloadFonts`), ölçüsü eşlenmiş "Fraunces Fallback" (Times/Liberation/Tinos,
    size-adjust 111,9%), H1 satırları sabit (`nowrap`, 15vw üst sınır), mobil hero
    üstten hizalı (font değişince başlık oynamıyor).
  - Sayfa ağırlığı ~500 KB (eski ana sayfa ~1430 KB).
  - `BaseLayout`'a geriye uyumlu iki isteğe bağlı prop eklendi: `preloadFonts`,
    `preloadImages`; diğer sayfalar etkilenmez.
- **Monitör:** YouTube kapağı yüklenmezse o kare atlanıyor; hiçbiri yüklenmezse
  monitör kırık görsel yerine tamamen gizleniyor.

### v10 — anlatı kameraya, sete ve içeriğe bağlandı

Kullanıcı: site hâlâ "alakasız" kalıyor; daha çok kamera, çekim, video ve içerik
anlatısı istiyor. Karar: sis/güneş dünyası **arka plan ışığı** olarak kalır; sayfanın
anlattığı şey gerçek set, gerçek görüntü ve teslim edilen içeriktir.
(Kural korunuyor: timecode/REC/PGM ve vizör arayüzü yok.)
- **Hero monitörü:** YouTube kapak slaytı yerine gerçek kamera arkası döngüsü
  (Aytaş Home seti, eski showreel-board'dan; `public/evren/set.{webm,mp4,webp}`,
  640px, ~200 KB). Masaüstünde büyüdü, telefonda gökte güneşin önünde, tablette
  metnin altında. Lede: "…sette çekip kurgu masasında bitiriyoruz."
- **Yeni III · Tek çekim günü — "Bir set, çok kadraj." (`#cekim`):** setten gerçek
  bir kare (`set-kare.webp`) üzerinde 16:9 → 4:5 → 9:16 yeniden kadraj rehberi
  (görünürken 2,4 sn'de bir döner; hareket azaltmada 9:16 sabit). Formatlar
  çizilmiş oranlarla listelenir (ana film, dikey kesitler, reklam versiyonları,
  fotoğraf). Aytaş Home'un 6 dikey videosu site içi oynatıcıda **dikey** açılır
  (`.ev-cinema.is-vertical`). CTA + "Bir çekimden kaç içerik çıkar?" blog linki.
- **Süreç:** yapay zekâ sis kareleri yerine gerçek set fotoğrafları (ışık hazırlığı,
  sokak çekimi, renk düzenleme, dikey çekim), sayfanın ışığına ısıtılmış.
  Aşamalar set diliyle: Ön hazırlık · Set · Post · Yayın; süre sağda.
- **Hizmetler:** her masaya bir set fotoğrafı (vinç kamerası, klaket, stüdyo).
- **Markalar:** "Kadrajımıza giren markalar." · "fabrikadan kliniğe, mağazadan sahneye".
- Numaralar: II işler · III tek çekim · IV markalar · V ekip · VI süreç ·
  VII hizmetler · VIII SSS · IX bölge · X günlük · XI ön görüşme.
- Ölçüm (mobil, 4× CPU + yavaş 4G): LCP 1,01 sn · CLS 0,011 · ~730 KB.

### v11 — odak: tek çekimde çok ürün, süreklilik, kalite; menü çubuğu ve CTA

Kullanıcı: odak "tek çekimde çok kadraj" değil; tek çekimden birçok ürün, süreklilik,
kaliteli ve ilgi çekici iş. Kamera arkası fotoğrafları Drive'da
(`rast-evren-gorseller/Kamera arkası`, 6 kare) → `src/assets/photos/bts/`.
- **III · "Bir çekim günü, haftalarca içerik."** Yeniden kadraj gösterimi kaldırıldı.
  Dört vaat: I Tek sette çok ürün · II Süreklilik · III Sinema kalitesi · IV İlgi
  çeken kurgu. Sağda kendi setlerimizden kamera arkası mozaiği (medikal, etkinlik,
  röportaj, showroom) ve "Süreklilik · Aytaş Home düzenli dikey video akışı"
  (6 video, dikey oynatıcı; telefonda kaydırılabilir şerit).
- **Süreç:** I ve II durakları da kendi kamera arkası karelerimiz (ofis ışık kurulumu,
  sokak kadrajı).
- **Menü çubuğu:** linkler İşler · Çekim günü · Ekip · Süreç · SSS. WhatsApp artık
  gerçek dolu logo, yeşil yuvarlak (eski ince çizgi ikon kayboluyordu).
- **CTA:** "Ücretsiz ön görüşme" → **"Çekiminizi planlayalım"** (dar ekranda
  "Planlayalım"); yeni `ev-btn--sun` stili: güneş turuncusu degrade + ışıma, beyaz
  metin (orta ton #b3501a, ≥4.5:1). Hero, menü, çekim bölümü ve form gönder butonunda
  aynı. "Ücretsiz" vaadi kaybolmasın diye hero kanıt satırı "İlk görüşme ücretsiz" ile
  başlıyor (telefonda ayrı satır, CLS için sabit).
- Ölçüm (mobil, 4× CPU + yavaş 4G): LCP 1,01 sn · CLS 0,022.
  Not: `bts/` karelerinin tamamı gerçek çekimlerimizden; yalnızca görüntü iyileştirme
  (enhance) uygulandı. "Setlerimizden kamera arkası" ifadesi doğru.

### v12 — sadeleştirme: reels şeridi çıktı, yeni ekip fotoğrafları, düz ve kısa CTA

- **Aytaş reels şeridi** ana sayfadan kaldırıldı (kullanıcı: orada hoş durmuyor).
  "Tek çekim günü" bölümü artık yalnızca dört vaat + kamera arkası mozaiği.
- **Ekip:** Drive `ekip` klasöründeki yeni renkli portreler
  (`muhammed-al-sheikhly-2026.jpg`, `berat-degirmenci-2026.jpg`); Berat'ın geçici
  renklendirme filtresi (`mono`) kaldırıldı.
- **CTA:** "Çekiminizi planlayalım" → **"Teklif alın"** (kısa, net, kendinden emin).
  Buton düz: tek renk #b3501a (beyaz metin 5,1:1), degrade/ışıma/iç gölge yok;
  hover'da koyulaşır. WhatsApp butonu da gölgesiz. "İlk görüşme ücretsiz" hero kanıt
  satırında kalıyor.

### v13 — "Görüşelim", tek menü, iç sayfalar evren tonunda

- **CTA:** "Görüşelim" (kısa, net); tek kaynak `EV_CTA` (`src/lib/evren.ts`).
- **Menü sekmeleri:** her sayfada aynı dört sayfa — İşler (/projeler/) · Hizmetler ·
  Hakkımızda · Blog; mobil menüde + İletişim. Aktif sayfa altında küçük güneş
  (`aria-current="page"`). Ana sayfada CTA forma (#on-gorusme), iç sayfalarda
  /iletisim/'e gider.
- **Ortak parçalar:** `src/styles/evren.css` (fontlar, token'lar `:root`'ta, cam,
  etiket/başlık/fısıltı, butonlar, menü, footer), `src/components/evren/EvHeader.astro`,
  `EvFooter.astro`, `src/lib/evren.ts` (roman, WA_PATH, EV_NAV, EV_CTA). Taslak ana
  sayfa da bunları kullanıyor — tek kaynak.
- **BaseLayout:** GlassNav/Footer yerine EvHeader/EvFooter; içerik `.ev.ev-site`
  içinde, sis gökyüzü + gren katmanı. Tema tek: açık (koyu tema ve tema düğmesi
  kalktı — evren gün ışığı dünyası).
- **Genel token'lar** (`tokens.css`) evren paletine: kâğıt #f4efe8, mürekkep #1d1915,
  amber #b3501a (düz güneş), başlık fontu Fraunces. Böylece eski bileşenler de tona geçti.
- **Bileşenler:** `Eyebrow` evren etiketi (✦ + çizgi; eski "Sahne 0N ·" öneki
  otomatik düşer), `Button` düz (birincil tek renk güneş, ikincil sis camı),
  `Section tone="ink"` siyah bant yerine aydınlık cam panel. Projeler sayfasının
  koyu video hero'su yerine sis üzerinde başlık ("Seçili işler."). Hakkımızda yeni
  renkli portreler.
- Kullanılmayan kaldı (silinmedi): GlassNav, Footer, ThemeToggle, VideoHero (yalnız eski ana sayfa).
