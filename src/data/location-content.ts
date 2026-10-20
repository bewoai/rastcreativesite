/**
 * Hand-written copy for the service × location pages that actually earn
 * search impressions (Search Console, Jul–Oct 2026). The generated template
 * makes sibling pages ~90% alike; these blocks give the pages people really
 * land on their own substance and extra, page-specific FAQ entries.
 *
 * Keep it factual: no invented clients, numbers or prices. Key = "service/location".
 */

export interface LocationContent {
  /** Meta description override (≤ 155 chars) for pages with low CTR. */
  description?: string;
  /** H2 for the extra block. */
  heading: string;
  paragraphs: string[];
  /** Appended to the page FAQ (and its FAQPage schema). */
  faqs?: { question: string; answer: string }[];
  /** Project ids shown first in the page's proof grid: the real work that
   *  backs this page's copy. The rest of the grid fills from the service's
   *  categories as before. */
  projects?: string[];
  /** Internal links shown under the block (paragraphs are plain text). */
  links?: { href: string; label: string }[];
}

export const LOCATION_CONTENT: Record<string, LocationContent> = {
  "sosyal-medya-icerigi/hendek": {
    description:
      "Hendek sosyal medya yönetimi: aylık içerik planı, tek çekim gününden Reels ve gönderiler, paylaşım takvimi ve rapor. Ücretsiz ön görüşme.",
    heading: "Hendek'te sosyal medya yönetimi nasıl işliyor?",
    paragraphs: [
      "Hendek'teki işletmelerin çoğu için sorun fikir değil, düzenli içerik üretmek. Fabrikada, mağazada ya da klinikte her hafta kamera kurmak mümkün olmadığı için aylık planı tek çekim gününe göre kuruyoruz: Serdivan'dan gelip bir günde ayın Reels'lerini, hikâye kesitlerini ve gönderi fotoğraflarını çekiyoruz, sonra bunları ay boyunca takvime yayıyoruz.",
      "Üretim tesisleri için iş güvenliği, üretim hattı ve ekip odaklı kısa videolar; perakende ve hizmet işletmeleri için ürün, kampanya ve müşteri deneyimi içerikleri öne çıkıyor. Paylaşım takvimi, açıklama metinleri ve aylık performans özeti yönetimin parçası; isterseniz Meta reklam kurulumu da aynı akışa ekleniyor.",
    ],
    faqs: [
      {
        question: "Hendek'te sosyal medya yönetimi için her hafta çekime mi geliyorsunuz?",
        answer:
          "Genellikle hayır. Ayda bir ya da iki planlı çekim günü yapıyor, o günden çıkan içerikleri ay boyunca yayına alıyoruz. Bu, işletmenizin akışını bölmeden düzenli paylaşım sağlıyor.",
      },
      {
        question: "Sadece video mu çekiyorsunuz, hesabı da yönetiyor musunuz?",
        answer:
          "İkisini birlikte yapıyoruz: içerik planı, çekim, kurgu, açıklama metinleri, paylaşım takvimi ve aylık rapor. Hesabı sizin yönetmenizi istiyorsanız yalnızca içerik üretimi de mümkün.",
      },
    ],
  },

  "sosyal-medya-icerigi/sakarya": {
    description:
      "Sakarya sosyal medya yönetimi: video sayısı ve çekim günü teklifte yazılı. Plan, çekim, kurgu, paylaşım, rapor. Aytaş Home'da 4 ayda etkileşim +%311.",
    heading: "Sakarya'da sosyal medya ajansı seçerken: ayda kaç video, çekim dahil mi?",
    paragraphs: [
      "Sakarya'da sosyal medya yönetimi için teklif topladığınızda birçok paketin gönderi ve hikâye sayısıyla satıldığını görürsünüz. Bu paketlerin bir kısmında ayda kaç video çekileceği yazmaz. Bizim paketlerimiz video üzerine kurulu: ayda kaç video çıkacağı ve kaç çekim günü yapılacağı teklifte yazılı olur. Böylece neye para verdiğinizi baştan bilir, ay sonunda yayına çıkanla karşılaştırabilirsiniz.",
      "Bir ay bizde şöyle geçiyor. Ay başında kampanyalarınızı ve öne çıkarmak istediğiniz ürün ya da hizmetleri konuşup videoların konu listesini çıkarıyoruz. Ayda 4 video için yarım gün, 8 video için bir tam gün ya da iki yarım gün çekim yapıyoruz ve çekimi işletmenizin sakin saatlerine koyuyoruz. Çekimde ve kurguda kurucu ortaklarımız bizzat yer alıyor; çekimleri Sony FX30 sinema kamerasıyla yapıyoruz. Ay sonunda erişim, etkileşim, profil ziyareti ve gelen mesajları özetleyen kısa bir rapor gönderiyor, sonraki ayın planını bu verilere göre düzenliyoruz.",
      "Bu düzenle yönettiğimiz hesaplardan biri, mobilya perakendecisi Aytaş Home Outlet'in Instagram hesabı. Hesabı Mayıs 2026'da devraldık. Mağazada düzenli çekim günleriyle ürün, kampanya ve festival videoları ürettik, Meta reklamlarını da biz yönettik. Meta Business Suite verisine göre önceki dört ay (Ocak–Nisan) ile ilk dört ayımız (Mayıs–Ağustos 2026) karşılaştırıldığında içerik etkileşimi 18,6 binden 76,5 bine çıktı (+%311). Yeni mesajlaşan kişi sayısı 257'den 730'a yükseldi. Karşılaştırmanın tamamı Aytaş Home vaka çalışmasında.",
      "Yönettiğimiz hesaplardan ikisi hekimlere ait: Serdivan'da medikal estetik hizmeti veren Dr. Erdem Çalışkan'ın Instagram hesabı ve Op. Dr. Duygu Cebecik Özmüş'ün gebelik bilgilendirme serisini yayınladığı YouTube kanalı. Sağlıkta reklam yönetmelikle sınırlı olduğu için bu hesaplarda kampanya, fiyat ya da sonuç vaadi kullanmıyoruz. Hastaların sık sorduğu konuları hekim kendi ağzından, sade bir dille anlatıyor. “Fraksiyonel Lazer Nedir?” ve “Gebelik: İlk 7 Gün” bu düzenle çıkan videolardan.",
    ],
    faqs: [
      {
        question: "Sakarya'da sosyal medya ajansı tekliflerini nasıl karşılaştırmalıyım?",
        answer:
          "Toplam tutardan önce kapsamı yan yana koyun: ayda kaç video var, çekim dahil mi, kaç çekim günü yapılıyor, kurguyu ve paylaşımı kim yapıyor, her ay rapor geliyor mu. Reklam bütçesinin fiyata dahil olup olmadığını da sorun. Bizde reklam bütçesi hizmet bedeline dahil değildir; Meta'ya doğrudan siz ödersiniz.",
      },
      {
        question: "Sakarya'da sosyal medya danışmanlığı da veriyor musunuz?",
        answer:
          "Evet. Hesabı kendi ekibinizle yönetmek istiyorsanız saatlik danışmanlık alabilirsiniz: mevcut hesabınıza birlikte bakıp neyin işlediğini, neyin eksik kaldığını konuşuruz. Yalnızca çekim ve kurguyu bize bırakmak da mümkün. Günlük paylaşımları kendiniz çekip vitrin ve reklam videolarını bizden aldığınız karma bir düzen de kurulabilir.",
      },
      {
        question: "Klinik ya da muayenehane hesabını da yönetiyor musunuz?",
        answer:
          "Evet. Ayın videolarını çoğunlukla muayenehanede ya da klinikte, muayene düzenini bozmadan, genellikle tek çekim gününde topluca çekiyoruz. Her senaryo çekimden önce, her video yayından önce hekimin onayına gidiyor. Hekim hesaplarında yönetmelik gereği sürekli reklam yönetimi yapmıyoruz; görünürlüğü bilgilendirme videoları, Google İşletme Profili ve YouTube üzerinden kuruyoruz.",
      },
      {
        question: "Kameraya çıkmak zorunda mıyım?",
        answer:
          "Hayır. Ürün, mekan ve ekip videoları siz kameraya geçmeden de çekilip kurgulanabilir. Kameraya çıkacaksanız soru-cevap şeklinde ilerliyoruz: ne söyleyeceğinizi önceden birlikte hazırlıyor, beğenmediğiniz kısmı yeniden çekiyoruz.",
      },
      {
        question: "En az kaç ay çalışmamız gerekiyor?",
        answer:
          "Aylık paketlerde en az üç ay çalışıyoruz, çünkü düzenli içeriğin etkisi birkaç ay içinde görünür hale geliyor. Takipçi ya da satış garantisi vermiyoruz. Söz verdiğimiz şey teklifte yazan video sayısı, çekim günleri ve her ay gelen rapor.",
      },
    ],
    projects: [
      "aytas-home-sosyal-medya",
      "dr-erdem-caliskan-kimdir",
      "aytas-home-sinematik-magaza",
      "dr-erdem-caliskan-fraksiyonel-lazer",
      "gebelik-ilk-7-gun",
      "candles-and-echoes-golden-swan",
    ],
    links: [
      { href: "/projeler/vaka/aytas-home/", label: "Aytaş Home vaka çalışması: 4 ayda etkileşim +%311" },
      { href: "/blog/sosyal-medya-yonetimi-fiyati-neye-gore-belirlenir/", label: "Sosyal medya yönetimi fiyatı neye göre belirlenir?" },
      { href: "/blog/sakarya-video-produksiyon-firmasi-nasil-secilir/", label: "Sakarya'da video prodüksiyon firması nasıl seçilir?" },
    ],
  },

  "video-cekimi/sakarya": {
    description:
      "Sakarya video çekimi: tanıtım, Reels, etkinlik. Kurucu ortaklar çekip kurguluyor; her ilçeye aynı gün, teslim genelde 2–4 hafta. Ön görüşme ücretsiz.",
    heading: "Sakarya'da video çekimi nasıl ilerler, fiyatı ne belirler?",
    paragraphs: [
      "Hangi videoya ihtiyacınız olduğu, onu nerede kullanacağınıza bağlı. Tanıtım filmi web sitesinde, YouTube'da ve firmayı iş ortaklarına anlatırken kullanılır; tekstil üreticisi Altoteks'in 4K tanıtım filmi fabrikayı havadan, dokuma makinelerini ve laboratuvar testlerini gösteriyor. Mağaza videosu Instagram'da ve Google İşletme profilinde yeri tanıtır; Duru Optik için çektiğimiz dikey videoda mağazanın konumu havadan, gözlük koleksiyonu ve göz ölçümü yakından görünüyor. Serdivan'da medikal estetik hizmeti veren Dr. Erdem Çalışkan'ın Instagram hesabı için tanıtım ve bilgilendirme videoları hazırlıyoruz. Candles and Echoes'un Sapanca Kırkpınar Amfi Tiyatro'daki mum ışığında bale gösterimini de dikey formatta çektik. Erenler, Akyazı ve Karasu'daki çekimlere de Serdivan'dan aynı gün gidiyoruz.",
      "Bir çekim gününden ne çıkacağı, çekim listesiyle baştan belli olur. Yarım günlük bir mağaza ya da kafe çekimini genellikle bir yatay tanıtım videosu ve üç Reels olarak planlıyoruz; kurumsal tanıtım filminde tam gün çekimden 2–3 dakikalık film, dikey kesitler ve drone planları çıkar. Düzenli içerikte ayın videolarını bir ya da iki çekim gününe topluyoruz. Mobilya perakendecisi Aytaş Home'un Instagram hesabını Mayıs 2026'dan beri yönetiyoruz: Meta Business Suite verisine göre içerik etkileşimi Ocak–Nisan 2026'daki 18,6 binden Mayıs–Ağustos'ta 76,5 bine çıktı (+%311), yeni mesajlaşan kişi 257'den 730'a yükseldi.",
      "Süreç ücretsiz ön görüşmeyle başlar: videonun amacını, kime gösterileceğini ve nerede yayınlanacağını konuşuruz. Ardından konu ve çekim listesini çıkarıp çekim gününü belirleriz. Projeyi kurucu ortaklar Berat Değirmenci ve Muhammed Ekrem Adnan ile konuşursunuz; sette ve kurguda da onlar bizzat çalışır, muhatabınız proje boyunca değişmez. Sony FX30 kamera, Sigma 18-50 lens ve DJI RS4 gimbal ile çekiyor, gerektiğinde 4K drone ekliyoruz. Revizyonlarla birlikte teslim, kapsama göre genellikle 2–4 hafta sürer.",
      "Fiyatı belirleyen başlıca kalemler şunlar: yarım ya da tam gün çekim, çıkacak video sayısı, drone, senaryo ve kurgu kapsamı (grafik, altyazı), ham görüntü isteği ve acil teslim. Net rakamı ön görüşmeden sonra yazılı teklifle veriyoruz. Başka tekliflerle karşılaştırırken toplam tutardan önce kapsama bakın: çekim kaç saat sürüyor, kaç video teslim ediliyor, çekimi kim yapıyor, kaç revizyon turu var ve hangi formatlar dahil.",
    ],
    faqs: [
      {
        question: "Sakarya'da çekim günü işletmemi kapatmam gerekir mi?",
        answer:
          "Genellikle hayır. Mağaza, klinik ya da fabrikadaki çekimi sakin saatlere veya vardiya düzenine göre planlıyoruz, işletme kendi akışında devam eder. Yalnızca bazı planlar için kısa bir düzenleme gerekebilir.",
      },
      {
        question: "Çekimden önce ne hazırlamam gerekiyor?",
        answer:
          "Ana mesajı, öne çıkmasını istediğiniz ürün ya da hizmetleri, çekilecek alanları ve videoları onaylayacak kişiyi netleştirmeniz yeterli. Çekim günü ürünlerin ve mekânın hazır olması işi hızlandırır. Konu ve çekim listesini ön görüşmeden sonra birlikte çıkarıyoruz.",
      },
      {
        question: "Kameraya çıkmak istemiyorum, yine de video çekilebilir mi?",
        answer:
          "Evet. Video ürün, mekân ve ekip görüntüleriyle, ekran yazılarıyla kurgulanabilir. Çekindiğiniz için uzak duruyorsanız da soru-cevap şeklinde ilerliyor, ne söyleyeceğinizi önceden birlikte hazırlıyor, beğenmediğiniz kısmı yeniden çekiyoruz.",
      },
      {
        question: "İlk kurguyu beğenmezsem ne olur?",
        answer:
          "İlk kurguyu teslimden önce size gönderiyor, geri bildiriminize göre düzeltiyoruz. Revizyon turlarının sayısı ve kapsamı ön görüşmede netleşir.",
      },
      {
        question: "Sosyal medya yönetimi almadan sadece video çektirebilir miyim?",
        answer:
          "Evet. Tek seferlik çekim ve kurgu için aylık anlaşma gerekmez; elinizde görüntü varsa yalnızca kurgu da yapıyoruz. Ham görüntü isterseniz kapsama eklenir. Her ay video gerekiyorsa aylık planla çalışmak genellikle daha uygun olur.",
      },
    ],
    projects: [
      "aytas-home-sosyal-medya",
      "altoteks-tanitim-filmi",
      "dr-erdem-caliskan-kimdir",
      "duru-optik-tanitim",
      "candles-and-echoes-golden-swan",
      "hornhauss-tanitim",
    ],
    links: [
      { href: "/blog/sakarya-video-produksiyon-firmasi-nasil-secilir/", label: "Sakarya'da video prodüksiyon firması nasıl seçilir?" },
      { href: "/blog/video-cekimi-fiyati-neye-gore-belirlenir/", label: "Video çekimi fiyatı neye göre belirlenir?" },
      { href: "/blog/tek-cekim-gununden-kac-icerik-cikar/", label: "Bir çekim gününden kaç farklı içerik çıkar?" },
      { href: "/projeler/vaka/aytas-home/", label: "Aytaş Home vaka çalışması: 4 ayda etkileşim +%311" },
    ],
  },

  "tanitim-filmi/sakarya": {
    heading: "Sakarya'da tanıtım filmi nasıl planlanır?",
    paragraphs: [
      "Sakarya'da tanıtım filmlerinin büyük kısmı sanayi tesisleri, sağlık kuruluşları ve köklü yerel markalar için çekiliyor. İyi bir tanıtım filmi tesisin büyüklüğünü değil, işletmenin neden güvenilir olduğunu anlatır; bu yüzden çekimden önce mesajı, izleyiciyi ve filmin nerede kullanılacağını (web sitesi, fuar, satış sunumu, sosyal medya) netleştiriyoruz.",
      "Çekim gününde ana filmin yanında sosyal medya için kısa kesitler ve fotoğraflar da planlıyoruz; böylece tek prodüksiyon hem kurumsal hem dijital iletişimde kullanılıyor. Gerektiğinde drone ile tesisi havadan da gösteriyoruz.",
    ],
    faqs: [
      {
        question: "Sakarya'da tanıtım filmi ne kadar sürede teslim edilir?",
        answer:
          "Ön görüşme ve senaryo onayından sonra çekim genellikle bir ya da iki günde tamamlanır; kurgu, renk ve revizyonlarla birlikte teslim süresini ilk görüşmede takvimle netleştiriyoruz.",
      },
    ],
  },

  "reklam-filmi/sakarya": {
    heading: "Sakarya'da reklam çekimi: satışa dönük kurgu",
    paragraphs: [
      "Reklam filmi, tanıtım filminden farklı olarak tek bir işi yapar: izleyiciyi harekete geçirmek. Sakarya'daki işletmeler için reklam çekimlerini ilk 3 saniyede dikkat çeken bir açılış, net bir teklif ve tek bir çağrı etrafında kuruyoruz.",
      "Aynı çekimden Instagram/Facebook ve YouTube reklamları için farklı uzunluk ve oranlarda versiyonlar hazırlıyoruz; böylece reklam yayındayken hangi versiyonun daha iyi çalıştığını test edebiliyorsunuz.",
    ],
  },

  "video-cekimi/gebze": {
    heading: "Gebze'de video çekimi: sanayi ve kurumsal odak",
    paragraphs: [
      "Gebze'deki çekim talepleri çoğunlukla organize sanayi bölgelerindeki üretim tesislerinden geliyor: tesis tanıtımı, üretim süreci, iş güvenliği ve işe alım videoları. Bu çekimlerde izin, iş güvenliği kuralları ve üretim akışını aksatmayan bir çekim planı en az kamera kadar önemli.",
      "Sakarya'dan Gebze'ye planlı çekim günleriyle geliyoruz; tek günde ana tanıtım filmini, sosyal medya kesitlerini ve gerekiyorsa drone planlarını birlikte çekiyoruz.",
    ],
  },

  "video-cekimi/kocaeli": {
    description:
      "Kocaeli video çekimi: fabrika ve liman filmleri, mağaza ve kafe için Reels. İzmit, Gebze, Gölcük, Darıca, Kartepe'ye aynı gün. Ücretsiz ön görüşme.",
    heading: "Kocaeli'nde fabrika, liman ve mağaza için video çekimi",
    paragraphs: [
      "Serdivan'daki stüdyomuzdan İzmit, Gebze, Gölcük, Darıca, Kartepe ve Başiskele'ye aynı gün gidip dönüyoruz. Kocaeli'ndeki çekimler konaklama ya da ek yol günü gerektirmediği için saati tesisin düzenine göre seçebiliyoruz: üretim hattını vardiyanın yoğun saatinde, röportajları makine sesinden uzak bir odada, dış cepheyi ve havadan planları ışığın uygun olduğu saatte çekiyoruz. Hat sabah yoğun, dış cephe için uygun ışık akşamüstüyse işi iki ayrı yarım güne bölebiliyoruz. Çekimde ve kurguda kurucu ortaklarımız bizzat yer alıyor.",
      "İzmit Körfezi çevresindeki liman ve lojistik firmalarında çekimin zor tarafı, işin kamera için tekrarlanmaması. Bir gemi manevrası ya da ağır yük transferi bir kez yapılır; bu yüzden çekim planını firmanın operasyon saatine göre kuruyor, gerekirse geceye uzatıyoruz. Portföyde bu tür işlerin iki örneği var: Mavi Vatan Gemi İnşa filmi blok ve modül transferini gece ve gündüz takip ediyor, Meteors Shipping filmi ise limandaki kargo gemilerini, römorkör manevralarını ve güverte detaylarını drone ve yer çekimleriyle birleştiriyor.",
      "İzmit ve Gebze hattındaki bir fabrikanın filmini çoğu zaman tedarikçi arayan bir satın alma ekibi ya da yurt dışındaki bir alıcı izliyor. Bu izleyici makine listesinden çok üretimin kontrol altında olduğunu görmek istiyor, bu yüzden filmi üretimin akışı üzerine kuruyoruz. Canex filminde hammadde rulolarını, pres, kesim ve büküm makinelerini, kalite kontrolü ve sevkiyatı; Altoteks filminde dokuma, laboratuvar testi, dikim ve paketleme aşamalarını görebilirsiniz. Bu dört film 2024 tarihli; kurucu ortaklarımızın stüdyoyu kurmadan önce yaptığı işler.",
      "Kocaeli'nde video ihtiyacı olan her işletme fabrika değil. İzmit, Darıca ve Başiskele'deki mağaza, kafe, klinik ve davet salonları için çoğu zaman yarım günlük bir çekim yetiyor; Portföydeki Hörnhauss, Duru Optik ve Newlife Davet Salonu videoları bu türden işlere örnek. Düzenli içerik isteyen mağazalar Aytaş Home'un vaka çalışmasına bakabilir: Mayıs 2026'da devraldığımız Instagram hesabında dört ayda, önceki dört aya göre içerik etkileşimi 18,6 binden 76,5 bine, yeni mesajlaşan kişi sayısı 257'den 730'a çıktı (Meta Business Suite verisi).",
    ],
    faqs: [
      {
        question: "Kocaeli'ndeki çekim için yol ya da konaklama ücreti ekleniyor mu?",
        answer:
          "Hayır. İzmit, Gebze, Gölcük, Darıca, Kartepe ve Başiskele aynı gün gidip döndüğümüz bölgede; bu ilçelerdeki çekimlerin teklifine ayrı yol ya da konaklama kalemi eklemiyoruz. Bu kalem yalnızca Bolu ve Bilecik gibi proje bazlı gittiğimiz yerlerde var.",
      },
      {
        question: "Fabrika, liman ya da tersanede çekim için bizden neler gerekiyor?",
        answer:
          "Çekim günü bizimle olacak bir yetkili, çekilebilecek ve çekilmemesi gereken alanların listesi ve varsa operasyonun saat planı. Baret, yelek, refakat ve giriş kaydı gibi saha kurallarını çekimden önce iş güvenliği biriminizle konuşuyoruz. Üretimi durdurmanız genellikle gerekmiyor; hat çalışırken çekiyoruz, yalnızca belirli bir makine ya da alan için kısa bir düzenleme isteyebiliriz.",
      },
      {
        question: "Kocaeli'ndeki çekime havadan planlar eklenebilir mi?",
        answer:
          "Konuma bağlı. Gebze'nin Sabiha Gökçen Havalimanı'na yakınlığı, Kartepe'deki Cengiz Topel Havalimanı, Gölcük'teki askeri alanlar ve bazı liman ve enerji tesisleri uçuşu kısıtlayabiliyor. Konumu çekimden önce kontrol ediyoruz; uçuş mümkün değilse bunu teklif aşamasında söylüyor, planı yer çekimleriyle kuruyoruz.",
      },
      {
        question: "Yurt dışındaki alıcılar için İngilizce versiyon hazırlıyor musunuz?",
        answer:
          "Evet, ihracat ve fuar sunumları için filmin İngilizce altyazılı versiyonunu hazırlıyoruz. Fuar standında sesi kapalı dönecek bir ekran versiyonu gerekiyorsa onu da aynı kurgudan çıkarıyoruz.",
      },
    ],
    projects: [
      "mavi-vatan-gemi-insa",
      "meteors-shipping-tanitim-filmi",
      "canex-tanitim-filmi",
      "altoteks-tanitim-filmi",
      "aytas-home-sosyal-medya",
      "duru-optik-tanitim",
    ],
    links: [
      { href: "/blog/fabrika-tanitim-filmi-sanayi/", label: "Fabrikanızı en iyi anlatan film nasıl çekilir?" },
      { href: "/blog/video-cekimi-fiyati-neye-gore-belirlenir/", label: "Video çekimi fiyatı neye göre belirlenir?" },
      { href: "/projeler/vaka/aytas-home/", label: "Aytaş Home vaka çalışması: 4 ayda etkileşim +%311" },
    ],
  },
  // ── Round 2 (Search Console impressions, Oct 2026) ──

  "sosyal-medya-icerigi/gebze": {
    description:
      "Gebze sosyal medya ajansı: içerik planı, Reels ve kurumsal video çekimi, paylaşım takvimi ve aylık rapor. Sanayi ve B2B markaları için.",
    heading: "Gebze'de sosyal medya: B2B ve sanayi markaları için",
    paragraphs: [
      "Gebze'deki markaların büyük kısmı son tüketiciye değil, başka firmalara satış yapıyor. Bu yüzden sosyal medya burada takipçi yarışından çok güven inşa etmekle ilgili: üretim kapasitesini, kalite süreçlerini, ekibi ve teslim ettiğiniz işleri düzenli ve profesyonel biçimde göstermek. LinkedIn ve Instagram için aynı çekimden farklı kurgular çıkarıyoruz.",
      "Tesiste planlı bir çekim gününde üretim hattı, ürün detayları ve ekip röportajlarını birlikte çekiyor, ay boyunca paylaşılacak içerik setine dönüştürüyoruz. İşe alım ve işveren markası videoları da aynı günün içine sığabiliyor.",
    ],
    faqs: [
      {
        question: "Gebze'deki bir fabrika için sosyal medya içeriği nasıl planlanır?",
        answer:
          "Önce iş güvenliği kuralları ve çekilebilecek alanlar netleştirilir; ardından üretim, ürün, ekip ve referans iş içeriklerinden oluşan aylık bir liste çıkarıp bunu tek çekim gününe yerleştiririz.",
      },
    ],
  },

  "sosyal-medya-icerigi/darica": {
    description:
      "Darıca sosyal medya ve reklam yönetimi: Reels çekimi, içerik planı, Instagram/Meta reklamları ve aylık rapor. Yerel işletmeler için görüşelim.",
    heading: "Darıca'da sosyal medya ve reklam yönetimi",
    paragraphs: [
      "Darıca'da sosyal medya desteği arayan işletmelerin çoğu kafe, restoran, klinik, güzellik salonu ve mağaza gibi yerel hizmet veren yerler. Bu işletmeler için hedef net: çevredeki insanların sizi görmesi ve mesaj atması. İçerikleri buna göre kuruyoruz; mekanı, ürünü ve ekibi gösteren kısa dikey videolar ile kampanya duyuruları.",
      "Organik paylaşımın yanında Instagram ve Facebook (Meta) reklamlarını da yönetebiliyoruz; reklamı Darıca ve çevresindeki doğru kitleye göstermek, bütçeyi küçük tutup sonucu ölçmek mümkün.",
    ],
    faqs: [
      {
        question: "Darıca'da sadece Instagram reklamı yönetiyor musunuz?",
        answer:
          "Reklamı, kullanılacak videoları üreterek birlikte yönetmeyi tercih ediyoruz; çünkü reklamın başarısını en çok kreatif belirler. Hazır içeriğiniz varsa yalnızca reklam kurulumu ve takibi de konuşulabilir.",
      },
    ],
  },

  "sosyal-medya-icerigi/izmit": {
    heading: "İzmit'te sosyal medya yönetimi",
    paragraphs: [
      "İzmit hem Kocaeli'nin ticaret merkezi hem de yoğun bir hizmet sektörüne sahip; sağlık kuruluşları, eğitim kurumları, restoranlar ve perakende markaları için düzenli içerik ihtiyacı yüksek. Sosyal medya yönetimini aylık içerik planı, planlı çekim günü, kurgu, paylaşım takvimi ve rapordan oluşan tek bir akış olarak yürütüyoruz.",
      "Sakarya'dan İzmit'e aynı gün gidip dönebildiğimiz için çekim günlerini işletmenizin yoğunluğuna göre esnek planlayabiliyoruz.",
    ],
  },

  "sosyal-medya-icerigi/duzce": {
    heading: "Düzce'de sosyal medya yönetimi",
    paragraphs: [
      "Düzce'deki işletmeler için en sık gördüğümüz ihtiyaç, düzenli paylaşım yapacak zaman ve içeriğin olmaması. Ayın içeriklerini bir çekim gününde topluca üretip paylaşım takvimine yayarak bu sorunu çözüyoruz; böylece hesap haftalarca sessiz kalmıyor.",
      "Üretim tesisleri, sağlık kuruluşları, Akçakoca hattındaki turizm işletmeleri ve yerel mağazalar için içerik dili farklı; planı her markanın müşterisine göre ayrı kuruyoruz.",
    ],
  },

  "tanitim-filmi/hendek": {
    heading: "Hendek'te tanıtım filmi: tesisi değil, güveni anlatmak",
    paragraphs: [
      "Hendek'teki organize sanayi bölgelerinde faaliyet gösteren firmalar için tanıtım filmi genellikle fuarlarda, yeni müşteri sunumlarında ve web sitesinde kullanılıyor. Bu yüzden film; üretim kapasitesini, kalite kontrolü, ekibi ve firmanın neden güvenilir bir tedarikçi olduğunu kısa ve net anlatmalı.",
      "Çekim gününü üretimi aksatmayacak şekilde planlıyor, gerekirse tesisin büyüklüğünü drone ile havadan gösteriyoruz. Aynı çekimden fuar ekranı için sessiz döngü versiyonu ve sosyal medya için kısa kesitler de çıkarıyoruz.",
    ],
    faqs: [
      {
        question: "Fabrika tanıtım filmi çekerken üretim durur mu?",
        answer:
          "Gerek yoktur. Çekim akışını üretim vardiyalarına göre planlıyor, iş güvenliği kurallarına uyarak hat çalışırken çekim yapıyoruz; yalnızca belirli planlar için kısa süreli düzenleme gerekebilir.",
      },
    ],
  },

  "tanitim-filmi/karasu": {
    heading: "Karasu'da tanıtım filmi ve tanıtım videosu",
    paragraphs: [
      "Karasu'da tanıtım videosu talepleri çoğunlukla sahil hattındaki oteller, restoranlar, yazlık projeleri ve turizm işletmelerinden geliyor. Bu tür işletmelerde film, mekanın atmosferini ve misafirin yaşayacağı deneyimi hissettirmeli; bu yüzden ışığın en iyi olduğu saatleri ve sezonu baştan planlıyoruz.",
      "Ana tanıtım videosunun yanında web sitesi, Google İşletme profili ve Instagram için kısa versiyonlar hazırlıyoruz; sahil ve tesis planlarını drone ile tamamlayabiliyoruz.",
    ],
  },

  "tanitim-filmi/gebze": {
    heading: "Gebze'de kurumsal tanıtım filmi",
    paragraphs: [
      "Gebze, organize sanayi bölgeleri ve teknoloji odaklı firmalarıyla kurumsal tanıtım filmi ihtiyacının en yoğun olduğu bölgelerden. Buradaki filmler çoğunlukla yurt dışı müşterilere, yatırımcılara ve fuarlara hitap ettiği için anlatımı sade tutuyor, gerekirse İngilizce altyazı ya da seslendirme planlıyoruz.",
      "Çekimi tek günde tamamlamak için ön keşifte çekim noktalarını, röportaj yapılacak kişileri ve tesis içi rotayı belirliyoruz.",
    ],
  },

  "tanitim-filmi/sapanca": {
    heading: "Sapanca'da otel ve mekan tanıtım filmi",
    paragraphs: [
      "Sapanca'da tanıtım filmi çektiren işletmelerin çoğu otel, bungalov, butik konaklama ve düğün/etkinlik mekanları. Bu işletmeler için film rezervasyon kararını etkileyen bir araç: göl manzarası, odalar, kahvaltı ve deneyim; misafirin kendini orada hayal edebileceği bir akışla çekiliyor.",
      "Gölün ve doğanın en iyi göründüğü saatlere göre çekim planı yapıyor, havadan planlarla mekanın konumunu gösteriyoruz. Aynı günden rezervasyon sitelerinde ve Instagram'da kullanılacak kısa videolar da çıkıyor.",
    ],
  },

  "reklam-filmi/hendek": {
    heading: "Hendek'te reklam filmi çekimi",
    paragraphs: [
      "Hendek'teki üretici ve perakende markalar için reklam filmi, ürünü tek bir net mesajla öne çıkarmak üzerine kurulu. Kurgu, sosyal medya reklamlarında ilk saniyelerde dikkat çekecek şekilde planlanıyor; ürün, fayda ve çağrı sade bir sıra izliyor.",
      "Aynı çekimden farklı süre ve oranlarda reklam versiyonları hazırlıyoruz; hangisinin daha iyi çalıştığını yayında test edebiliyorsunuz.",
    ],
  },

  "video-cekimi/serdivan": {
    heading: "Serdivan'da video çekimi: stüdyomuzun bulunduğu ilçe",
    paragraphs: [
      "Rast Creative'in stüdyosu Serdivan'da. Bu yüzden Serdivan'daki çekimlerde kurulum ve ulaşım süresi neredeyse yok; kısa röportajlar, ürün çekimleri ve sosyal medya içerikleri için hızlı randevu verebiliyoruz.",
      "Üniversite çevresi, AVM'ler, klinikler, kafe ve restoranlarla Serdivan'da çok farklı türde işletme var. Hangisi olursa olsun yaklaşım aynı: tek çekim gününden ana video, dikey Reels kesitleri ve fotoğraflar.",
    ],
  },

  "video-cekimi/darica": {
    heading: "Darıca'da video çekimi",
    paragraphs: [
      "Darıca'da video çekimi talepleri çoğunlukla yerel işletmelerin sosyal medya ve tanıtım ihtiyacından geliyor: mekan tanıtımı, ürün videosu, kampanya duyurusu ve ekip tanıtımı. Bir çekim gününde bunların hepsini planlayıp ay boyunca kullanılacak bir video setine dönüştürüyoruz.",
      "Gebze hattına yakın olduğu için bölgedeki kurumsal çekimlerle aynı günü paylaşabilen projelerde planlamayı daha esnek yapabiliyoruz.",
    ],
  },

  "video-cekimi/izmit": {
    heading: "İzmit'te video çekimi",
    paragraphs: [
      "İzmit'te kurumsal tanıtım, sağlık ve eğitim kurumları için bilgilendirici videolar, perakende markaları için ürün ve kampanya videoları en sık çektiğimiz işler arasında. Körfez manzarası ve şehir merkezi, dış çekimlerde güçlü bir arka plan sunuyor.",
      "Sakarya'dan İzmit'e aynı gün gidip dönerek çekimi tamamlıyor; kurgu, renk ve ses düzenlemeyi stüdyoda bitirip tüm platformlara uygun formatlarda teslim ediyoruz.",
    ],
  },

  "video-cekimi/duzce": {
    heading: "Düzce'de video çekimi",
    paragraphs: [
      "Düzce'de üretim tesisleri, sağlık kuruluşları ve Akçakoca–Melen hattındaki turizm işletmeleri için video çekiyoruz. Sakarya'ya komşu olduğu için çekimi aynı gün içinde planlayabiliyoruz.",
      "Kurumsal tanıtım filmi, ürün videosu ve sosyal medya içeriklerini tek prodüksiyonda birleştirerek bir çekim gününden olabildiğince çok kullanılabilir içerik çıkarıyoruz.",
    ],
  },

  "drone-cekimi/sapanca": {
    heading: "Sapanca'da drone çekimi",
    paragraphs: [
      "Sapanca Gölü çevresindeki oteller, bungalovlar, villa projeleri ve etkinlik mekanları havadan çekildiğinde konumun ve manzaranın değeri tek planda anlaşılıyor. Drone planlarını yer çekimleriyle birleştirerek tanıtım videosu ve sosyal medya içeriği olarak teslim ediyoruz.",
      "Uçuşları hava durumu, ışık ve bölgedeki uçuş kurallarına göre planlıyoruz; göl yüzeyinin en sakin ve ışığın en yumuşak olduğu sabah ve gün batımı saatlerini tercih ediyoruz.",
    ],
  },

  "drone-cekimi/kocaeli": {
    heading: "Kocaeli'nde drone çekimi",
    paragraphs: [
      "Kocaeli'nde drone çekimi en çok fabrika ve lojistik tesislerinin tanıtımı, inşaat ilerleme takibi ve gayrimenkul projeleri için kullanılıyor. Büyük bir tesisin ölçeğini, yerleşimini ve ulaşım bağlantılarını göstermenin en etkili yolu havadan bir plan.",
      "Tesis ve sanayi bölgelerinde uçuş öncesinde izin ve güvenlik koşullarını firma ile birlikte netleştiriyor, çekimi bu çerçevede planlıyoruz.",
    ],
    faqs: [
      {
        question: "Fabrika ya da şantiye üzerinde drone uçurmak için izin gerekir mi?",
        answer:
          "Uçuşun yapılacağı bölgeye ve havalimanı/askeri alan yakınlığına göre izin gereklilikleri değişir. Çekimden önce konumu kontrol edip gerekli koşulları ve tesis yönetiminin onayını birlikte netleştiriyoruz.",
      },
    ],
  },

  "drone-cekimi/gebze": {
    heading: "Gebze'de drone ile tesis çekimi",
    paragraphs: [
      "Gebze'deki organize sanayi bölgelerinde drone çekimi; tesisin büyüklüğünü, yükleme alanlarını ve otoyol/liman bağlantılarını göstermek için kullanılıyor. Bu planlar kurumsal tanıtım filmlerinde, web sitesi açılış videolarında ve fuar sunumlarında güçlü bir açılış sağlıyor.",
      "Havadan çekimi yer çekimiyle aynı gün yaparak tek prodüksiyonda tamamlıyoruz.",
    ],
  },

  "drone-cekimi/sakarya": {
    description:
      "Sakarya drone çekimi: fabrika, tesis ve mağazalar için 4K havadan görüntü, uçuş öncesi izin kontrolü, yerden çekimle aynı gün. Örnek işleri görün.",
    heading: "Sakarya'da drone çekimi: ne zaman gerekir, nasıl planlanır?",
    paragraphs: [
      "Drone en çok iki şeyi anlatırken işe yarıyor: büyüklük ve konum. Örneğin Hendek'te bir üretim tesisinin araziye nasıl yayıldığı ya da Sapanca Gölü kıyısındaki bir otelin suya ne kadar yakın olduğu, yerden çekilen planlarla tam anlaşılmıyor; yukarıdan tek karede görülüyor. Küçük bir iç mekânda, ürün çekiminde ya da röportajda ise drone filme bir şey katmıyor. Böyle işlerde bütçeyi yerden çekime ve kurguya ayırmanızı öneriyoruz.",
      "Aşağıdaki projelerde bunun örnekleri var. Altoteks ve Canex tanıtım filmlerinde fabrikanın dışı havadan, üretim hattı içeriden çekildi. Mavi Vatan'ın modül transferini belgeleyen filmde gece ve gündüz yapılan saha çekimleri, Meteors Shipping filminde de tersane ve liman çekimleri drone görüntüleriyle birlikte kurgulandı. Bu filmler 2024 tarihli, kurucu ortaklarımızın stüdyoyu kurmadan önce yaptığı işler. Çekimde ve kurguda bugün de onlar bizzat yer alıyor.",
      "Müşterinin gelip bulması gereken mağazalarda da birkaç saniyelik bir havadan plan işe yarıyor. Mağazalara mesajla gelen en sık sorulardan biri “Yeriniz nerede?” oluyor. Binayı ve çevresindeki tanıdık bir caddeyi ya da meydanı gösteren kısa bir plan, bu soruyu videonun içinde cevaplıyor. Duru Optik için çektiğimiz dikey videoda da mağazanın konumu havadan, gözlük koleksiyonu ve göz ölçümü yakından gösteriliyor.",
      "Teklif için uzun bir dosya hazırlamanız gerekmiyor. Çekim yerinin konum linkini, görüntülerin nerede kullanılacağını (web sitesi, sosyal medya, fuar ya da reklam), yalnız havadan mı yoksa yerden çekimle birlikte mi istediğinizi ve tarih aralığınızı yazmanız yeterli. Kapsamı ücretsiz ön görüşmede birlikte netleştiriyoruz. Ücreti hangi kalemlerin belirlediğini de blogdaki “Drone çekimi fiyatı neye göre belirlenir?” yazısında anlattık.",
    ],
    faqs: [
      {
        question: "Sakarya'da her yerde drone uçurulabilir mi?",
        answer:
          "Hayır. Havalimanı ve askeri alan çevresi, bazı kamu tesisleri ve kalabalıkların üzeri SHGM kurallarına göre kısıtlıdır ya da ayrı izin ister. Fabrika veya şantiye üzerinde uçmak için tesis yönetiminin onayı da gerekir. Konum linkini gönderdiğinizde uçuşa uygunluğu kontrol ediyoruz; uygun değilse bunu çekim gününden önce söylüyoruz.",
      },
      {
        question: "Hava kötü olursa drone çekimi ne olur?",
        answer:
          "Rüzgâr ve yağmur uçuşu doğrudan etkiler. Havadan planları hava tahminine ve ışığa göre günün uygun saatine koyuyor, uçuş mümkün olmazsa yedek gün belirliyoruz. Yerden çekim de aynı gündeyse iç mekân planları çoğu zaman programdaki gibi çekilebiliyor; o durumda yalnız havadan planlar yedek güne kalıyor.",
      },
      {
        question: "Sadece drone çekimi yaptırabilir miyim?",
        answer:
          "Evet. Tesis, arazi ya da proje alanı için yalnız havadan çekim de yapıyoruz. Tesisin içi, ekip ya da ürün de anlatılacaksa yerden çekimi aynı güne eklemek çoğu zaman daha verimli oluyor; hangisinin gerektiğine ön görüşmede birlikte karar veriyoruz.",
      },
      {
        question: "Drone görüntülerinin ham dosyalarını da alabilir miyim?",
        answer:
          "Evet. Kurgulu videonun yanında ham görüntü teslimi de kapsama eklenebilir; bunu ön görüşmede konuşup teklife ayrı kalem olarak yazıyoruz.",
      },
    ],
    projects: [
      "altoteks-tanitim-filmi",
      "canex-tanitim-filmi",
      "mavi-vatan-gemi-insa",
      "meteors-shipping-tanitim-filmi",
      "duru-optik-tanitim",
    ],
    links: [
      { href: "/blog/drone-cekimi-gerekli-mi/", label: "Drone çekimi gerçekten gerekli mi?" },
      { href: "/blog/drone-cekimi-fiyati-neye-gore-belirlenir/", label: "Drone çekimi fiyatı neye göre belirlenir?" },
    ],
  },
  // ── Round 3 (next tier, 6–13 impressions) ──

  "sosyal-medya-icerigi/golcuk": {
    heading: "Gölcük'te sosyal medya yönetimi",
    paragraphs: [
      "Gölcük'te otomotiv ve denizcilik sanayisinin çevresinde büyüyen tedarikçi firmalar, sahil hattındaki kafe ve restoranlar ve yerel perakende işletmeleri için sosyal medya ihtiyacı farklı. Kurumsal firmalarda güven ve işveren markası, yerel işletmelerde ise çevredeki müşteriye görünür olmak öne çıkıyor.",
      "İçerik planını işletmenin müşterisine göre kurup ayın videolarını planlı bir çekim gününde topluca üretiyoruz.",
    ],
  },
  "sosyal-medya-icerigi/basiskele": {
    heading: "Başiskele'de sosyal medya yönetimi",
    paragraphs: [
      "Başiskele'nin hızla büyüyen konut bölgeleri; restoran, kafe, spor salonu, klinik ve emlak ofisi gibi yerel hizmet işletmelerinin sayısını artırıyor. Bu işletmeler için sosyal medya, mahalledeki müşteriye ulaşmanın en hızlı yolu.",
      "Mekanı, ekibi ve hizmeti gösteren kısa dikey videolarla düzenli bir paylaşım akışı kuruyor, isterseniz bölgeye hedefli Meta reklamlarını da yönetiyoruz.",
    ],
  },
  "sosyal-medya-icerigi/sapanca": {
    heading: "Sapanca'da sosyal medya: oteller ve mekanlar için",
    paragraphs: [
      "Sapanca'da sosyal medya, konaklama ve etkinlik işletmeleri için doğrudan rezervasyon kanalı. Misafirler oteli, bungalovu ya da kahvaltı mekanını önce Instagram'da görüp karar veriyor; bu yüzden içeriklerin sezonu, manzarayı ve deneyimi yansıtması gerekiyor.",
      "Mevsim geçişlerine göre planlanan çekim günleriyle aylarca kullanılacak video ve fotoğraf arşivi oluşturuyoruz.",
    ],
  },
  "sosyal-medya-icerigi/bolu": {
    heading: "Bolu'da sosyal medya yönetimi",
    paragraphs: [
      "Bolu'da sosyal medya içeriği en çok doğa turizmi, konaklama ve yöresel ürün işletmeleri için önem taşıyor. Abant, Gölcük ve kayak merkezleri çevresindeki işletmeler sezon başlamadan önce içerik hazırlığını tamamladığında rezervasyon dönemine hazır giriyor.",
      "Çekim günlerini sezona göre planlayıp yaz ve kış içeriklerini önceden hazırlayabiliyoruz.",
    ],
  },
  "sosyal-medya-icerigi/serdivan": {
    heading: "Serdivan'da sosyal medya yönetimi",
    paragraphs: [
      "Stüdyomuz Serdivan'da olduğu için buradaki markalarla çalışmak en pratik senaryo: çekim günlerini kısa sürede planlayabiliyor, gerektiğinde ay içinde ek içerik için hızlıca gelebiliyoruz.",
      "Üniversite çevresindeki kafe ve restoranlardan klinik ve mağazalara kadar Serdivan'daki işletmeler için aylık içerik planı, Reels çekimi, paylaşım ve rapor tek ekipten yürüyor.",
    ],
  },
  "sosyal-medya-icerigi/kocaeli": {
    heading: "Kocaeli'nde sosyal medya yönetimi",
    paragraphs: [
      "Kocaeli'de sosyal medya ihtiyacı iki uçta toplanıyor: İzmit ve Gebze hattındaki sanayi ve B2B firmaları için kurumsal güven içerikleri, ilçelerdeki yerel işletmeler için ise müşteriye görünür olmayı sağlayan kısa videolar.",
      "Her iki durumda da yaklaşımımız aynı: aylık içerik planı, planlı çekim günü, kurgu, paylaşım takvimi ve aylık rapor.",
    ],
  },
  "sosyal-medya-icerigi/karasu": {
    heading: "Karasu'da sosyal medya yönetimi",
    paragraphs: [
      "Karasu'daki işletmeler için sosyal medya, yaz sezonunda yoğunlaşan ziyaretçi trafiğini yakalamanın en etkili yolu. Restoranlar, oteller, plaj işletmeleri ve yazlık projeleri için sezon öncesi hazırlanan içerikler, sezon boyunca düzenli paylaşım sağlıyor.",
      "Sezonu ve kış dönemini ayrı planlayarak hesabın yıl boyu canlı kalmasını sağlıyoruz.",
    ],
  },
  "reklam-filmi/gebze": {
    heading: "Gebze'de reklam filmi çekimi",
    paragraphs: [
      "Gebze'deki firmaların reklam filmleri çoğunlukla ürün lansmanları, B2B satış kampanyaları ve dijital reklamlar için çekiliyor. Burada reklamın görevi, ürünü ya da hizmeti kısa sürede net bir faydayla anlatmak.",
      "Aynı çekimden LinkedIn, YouTube ve Meta reklamları için farklı süre ve oranlarda versiyonlar hazırlıyoruz.",
    ],
  },
  "reklam-filmi/izmit": {
    heading: "İzmit'te reklam filmi çekimi",
    paragraphs: [
      "İzmit'te perakende, sağlık, eğitim ve hizmet sektöründeki markalar için reklam filmlerini dijital mecralara göre kurguluyoruz: ilk saniyede dikkat çeken bir açılış, tek bir mesaj ve net bir çağrı.",
      "Çekimi aynı gün içinde tamamlayıp reklamın farklı versiyonlarını kurguda hazırlıyoruz.",
    ],
  },
  "reklam-filmi/darica": {
    heading: "Darıca'da reklam filmi ve sosyal medya reklamı",
    paragraphs: [
      "Darıca'daki yerel işletmeler için reklam filmi genellikle Instagram ve Facebook reklamlarında kullanılan kısa dikey videolar anlamına geliyor. Mekanı, ürünü ya da kampanyayı birkaç saniyede anlatan kurgular, çevredeki doğru kitleye gösterildiğinde en iyi sonucu veriyor.",
      "Reklam videosunu çekip, isterseniz reklam kurulumu ve takibini de birlikte yürütüyoruz.",
    ],
  },
  "reklam-filmi/arifiye": {
    heading: "Arifiye'de reklam filmi çekimi",
    paragraphs: [
      "Arifiye, ulaşım bağlantıları ve sanayi yatırımlarıyla ürün ve hizmet reklamlarının çekildiği bir bölge. Showroom, üretim alanı ve ürün detaylarını tek çekim gününde planlayarak reklam ve sosyal medya versiyonlarını birlikte çıkarıyoruz.",
      "Serdivan'a çok yakın olduğu için çekim gününü esnek planlayabiliyoruz.",
    ],
  },
  "reklam-filmi/kartepe": {
    heading: "Kartepe'de reklam filmi çekimi",
    paragraphs: [
      "Kartepe'de reklam filmi taleplerinin önemli kısmı otel, kayak ve doğa turizmi işletmelerinden geliyor. Bu reklamlarda sezonun atmosferi ve misafir deneyimi ön planda; kar, orman ve manzara planlarını havadan ve yerden çekimle birlikte kurguluyoruz.",
      "Sezon kampanyaları için reklamı önceden hazırlayıp farklı mecralara uygun versiyonlarla teslim ediyoruz.",
    ],
  },
  "video-cekimi/sapanca": {
    heading: "Sapanca'da video çekimi",
    paragraphs: [
      "Sapanca'da video çekimlerimizin çoğu otel, bungalov, restoran, düğün ve etkinlik mekanları için. Göl manzarası ve doğa en güçlü görsel unsur olduğu için çekimi ışığın en iyi olduğu saatlere göre planlıyoruz.",
      "Tek çekim gününden tanıtım videosu, sosyal medya kesitleri ve fotoğraflar birlikte çıkıyor; gerekirse drone planlarıyla mekanın konumunu gösteriyoruz.",
    ],
  },
  "video-cekimi/hendek": {
    heading: "Hendek'te video çekimi",
    paragraphs: [
      "Hendek'te video çekimi talepleri büyük ölçüde organize sanayi bölgelerindeki üretim tesislerinden geliyor: tesis tanıtımı, üretim süreci, iş güvenliği ve işe alım videoları. Çekimi üretimi aksatmayacak şekilde vardiyalara göre planlıyoruz.",
      "Aynı gün içinde kurumsal film, sosyal medya kesitleri ve gerekirse drone planları birlikte çekilebiliyor.",
    ],
  },
  "video-cekimi/erenler": {
    heading: "Erenler'de video çekimi",
    paragraphs: [
      "Erenler, sanayi tesisleri ve Adapazarı'na yakın ticari dokusuyla hem kurumsal hem yerel işletme çekimlerinin yapıldığı bir ilçe. Serdivan'dan kısa sürede ulaşıp çekimi aynı gün tamamlıyoruz.",
      "Ürün, tesis ve ekip çekimlerini tek günde planlayarak ana video ile sosyal medya içeriklerini birlikte üretiyoruz.",
    ],
  },
  "video-cekimi/adapazari": {
    heading: "Adapazarı'nda video çekimi",
    paragraphs: [
      "Adapazarı, Sakarya'nın ticaret merkezi; mağazalar, klinikler, restoranlar ve hizmet işletmeleri için tanıtım ve sosyal medya videoları en sık çektiğimiz işler arasında. Stüdyomuza çok yakın olduğu için çekim günlerini kısa sürede planlayabiliyoruz.",
      "Bir çekim gününden ana tanıtım videosu, dikey Reels kesitleri ve fotoğraflar birlikte çıkıyor.",
    ],
  },
  "tanitim-filmi/erenler": {
    heading: "Erenler'de tanıtım filmi",
    paragraphs: [
      "Erenler'deki üretim ve sanayi firmaları için tanıtım filmi; müşteriye, tedarikçiye ve potansiyel çalışana firmanın kapasitesini ve güvenilirliğini anlatan temel iletişim aracı. Filmi üretim akışına, ekibe ve kalite süreçlerine odaklayarak kuruyoruz.",
      "Ana filmin yanında fuar ve sosyal medya için kısa versiyonlar da hazırlıyoruz.",
    ],
  },
  "tanitim-filmi/izmit": {
    heading: "İzmit'te tanıtım filmi",
    paragraphs: [
      "İzmit'te tanıtım filmlerini sanayi firmaları, sağlık ve eğitim kurumları ile köklü yerel markalar için çekiyoruz. Filmin nerede kullanılacağını (web sitesi, fuar, sunum, sosyal medya) baştan netleştirip anlatımı ona göre kuruyoruz.",
      "Gerekirse röportajlar, tesis içi planlar ve havadan görüntüler tek prodüksiyonda birleşiyor.",
    ],
  },
  "tanitim-filmi/akyazi": {
    heading: "Akyazı'da tanıtım filmi",
    paragraphs: [
      "Akyazı'da tanıtım filmi talepleri termal tesisler, doğa turizmi işletmeleri ve tarımsal üretim yapan firmalardan geliyor. Bu filmlerde mekanın atmosferi ve üretimin hikâyesi öne çıkıyor.",
      "Çekimi ışık ve mevsime göre planlayıp, ana filmin yanında sosyal medya için kısa kesitler de hazırlıyoruz.",
    ],
  },
  "tanitim-filmi/basiskele": {
    heading: "Başiskele'de tanıtım filmi",
    paragraphs: [
      "Başiskele'de tanıtım filmi en çok konut projeleri, sağlık ve eğitim kurumları ile yerel markalar için çekiliyor. Körfez manzarası ve gelişen yapılaşma, özellikle gayrimenkul tanıtımlarında güçlü bir görsel zemin sağlıyor.",
      "Proje tanıtımlarında yer çekimlerini drone planlarıyla tamamlıyoruz.",
    ],
  },
  "drone-cekimi/hendek": {
    heading: "Hendek'te drone çekimi",
    paragraphs: [
      "Hendek'teki organize sanayi bölgelerinde drone çekimi, büyük tesislerin ölçeğini ve yerleşimini göstermek için kullanılıyor. Havadan açılış planları, kurumsal tanıtım filmlerinin ve web sitesi videolarının en güçlü sahneleri oluyor.",
      "Uçuş öncesinde tesis yönetimiyle güvenlik ve izin koşullarını birlikte netleştiriyoruz.",
    ],
  },
  "drone-cekimi/adapazari": {
    heading: "Adapazarı'nda drone çekimi",
    paragraphs: [
      "Adapazarı'nda drone çekimlerini gayrimenkul projeleri, ticari binalar, etkinlikler ve kurumsal tanıtımlar için yapıyoruz. Şehir merkezinde uçuş kuralları ve çevre güvenliği daha fazla dikkat gerektirdiği için çekimi önceden planlıyoruz.",
      "Havadan planları yer çekimiyle aynı gün yaparak tek prodüksiyonda tamamlıyoruz.",
    ],
  },
  "drone-cekimi/golcuk": {
    heading: "Gölcük'te drone çekimi",
    paragraphs: [
      "Gölcük'ün körfez kıyısı, sanayi tesisleri ve konut projeleri havadan çekildiğinde konumun değeri tek planda anlaşılıyor. Drone görüntülerini tanıtım filmi, gayrimenkul videosu ve sosyal medya içeriği olarak teslim ediyoruz.",
      "Kıyı ve sanayi alanlarında uçuş kısıtlarını çekim öncesinde kontrol ediyoruz.",
    ],
  },
  "drone-cekimi/izmit": {
    heading: "İzmit'te drone çekimi",
    paragraphs: [
      "İzmit'te drone çekimi; sanayi tesisleri, liman ve lojistik alanları, konut projeleri ve şehir tanıtımları için kullanılıyor. Körfez manzarası havadan planlarda güçlü bir arka plan oluşturuyor.",
      "Uçuş kurallarını ve izin gerekliliklerini önceden kontrol edip çekimi bu çerçevede planlıyoruz.",
    ],
  },
  "drone-cekimi/akyazi": {
    heading: "Akyazı'da drone çekimi",
    paragraphs: [
      "Akyazı'da drone çekimi termal tesisler, doğa alanları, tarım arazileri ve üretim tesisleri için tercih ediliyor. Geniş alanların büyüklüğü ve çevresiyle ilişkisi en iyi havadan anlaşılıyor.",
      "Havadan çekimi yer çekimleriyle birleştirerek tanıtım ve sosyal medya içeriği olarak teslim ediyoruz.",
    ],
  },
  "drone-cekimi/duzce": {
    heading: "Düzce'de drone çekimi",
    paragraphs: [
      "Düzce'de drone çekimlerini üretim tesisleri, Akçakoca sahil hattındaki turizm işletmeleri, konut projeleri ve doğa alanları için yapıyoruz. Sakarya'dan aynı gün ulaşıp çekimi tamamlayabiliyoruz.",
      "Hava durumu ve ışığa göre çekim saatini planlıyor, gerektiğinde yedek gün belirliyoruz.",
    ],
  },
};

export const getLocationContent = (service: string, location: string) =>
  LOCATION_CONTENT[`${service}/${location}`];
