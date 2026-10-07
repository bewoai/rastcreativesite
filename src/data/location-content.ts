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
      "Sakarya sosyal medya yönetimi: içerik planı, Reels çekimi, paylaşım ve aylık rapor tek ekipte. Yönettiğimiz hesapları inceleyin, ücretsiz görüşelim.",
    heading: "Sakarya'da sosyal medya yönetimi: tek çekim, bir aylık içerik",
    paragraphs: [
      "Sakarya'da yönettiğimiz hesaplarda aynı modeli kullanıyoruz: önce markanın ne anlatacağını ve kime anlatacağını netleştiriyoruz, sonra ayın içeriklerini bir ya da iki çekim gününe topluyoruz. Böylece Instagram ve YouTube'da süreklilik bozulmuyor, her video aynı görsel dili taşıyor.",
      "Mobilya mağazası, medikal estetik kliniği ve uzman hekim kanalı gibi farklı sektörlerde hesap yönetiyoruz; nasıl çalıştığımızı Projeler sayfasındaki yönetilen hesaplarda ve Aytaş Home vaka çalışmasında görebilirsiniz. Serdivan'daki stüdyomuzdan Adapazarı, Erenler, Arifiye, Hendek, Sapanca ve diğer ilçelere aynı gün ulaşıyoruz.",
    ],
    faqs: [
      {
        question: "Sakarya'da sosyal medya yönetimine nasıl başlıyoruz?",
        answer:
          "Ücretsiz ön görüşmede hesabınızı, hedef kitlenizi ve ayda ne kadar içerik gerektiğini konuşuyoruz. Ardından ilk ayın içerik planını ve çekim gününü belirleyip üretime geçiyoruz.",
      },
      {
        question: "Sonuçları nasıl takip ediyoruz?",
        answer:
          "Her ay erişim, etkileşim, takipçi ve (reklam varsa) mesaj/dönüşüm verilerini özetleyen kısa bir rapor paylaşıyoruz; bir sonraki ayın planını bu verilere göre düzenliyoruz.",
      },
    ],
  },

  "video-cekimi/sakarya": {
    description:
      "Sakarya video çekimi: bir çekim gününden ana film, Reels ve fotoğraf. Serdivan'daki ekibimizle her ilçeye aynı gün. Ücretsiz ön görüşme.",
    heading: "Sakarya'da video çekimi: bir çekim gününden çok sayıda içerik",
    paragraphs: [
      "Sakarya'da video çektiren işletmelerin çoğu tek bir film değil, aylarca kullanabileceği içerik istiyor. Bu yüzden çekim gününü baştan çok çıktılı planlıyoruz: aynı setten yatay ana film, dikey Reels/Shorts kesitleri, kısa reklam versiyonları ve fotoğraflar birlikte çıkıyor.",
      "Stüdyomuz Serdivan'da; Adapazarı, Erenler, Arifiye, Hendek, Akyazı, Sapanca ve Karasu'daki fabrika, mağaza, klinik ve otel çekimlerine aynı gün ulaşıyoruz. Senaryo, ışık, ses, kurgu ve renk düzenlemeyi aynı ekip yürüttüğü için iş tek elden ve tutarlı çıkıyor.",
    ],
    faqs: [
      {
        question: "Sakarya'da bir çekim gününden kaç video çıkar?",
        answer:
          "Projeye göre değişir; iyi planlanmış bir günden genellikle bir ana film, birkaç dikey sosyal medya videosu ve fotoğraf seti birlikte çıkar. Hangi çıktıların gerektiğini ön görüşmede birlikte listeliyoruz.",
      },
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
    heading: "Kocaeli'nde video çekimi: İzmit'ten Gebze'ye",
    paragraphs: [
      "Kocaeli, İzmit, Gebze, Gölcük, Kartepe ve Darıca hattında sanayi, lojistik, denizcilik ve turizm işletmeleriyle çok farklı çekim ihtiyaçları barındırıyor. Sakarya'ya komşu olduğumuz için Kocaeli'deki projelere aynı gün içinde gidip dönebiliyoruz.",
      "Kurumsal tanıtım filmi, ürün videosu, sosyal medya içeriği ve drone çekimini tek prodüksiyonda birleştirerek bir çekim gününden olabildiğince çok içerik çıkarıyoruz.",
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
    heading: "Sakarya'da drone çekimi",
    paragraphs: [
      "Sakarya'da drone çekimlerini fabrika ve tesis tanıtımları, Sapanca ve Karasu çevresindeki turizm işletmeleri, gayrimenkul projeleri ve etkinlikler için yapıyoruz. Serdivan'daki stüdyomuzdan ilin her noktasına aynı gün ulaşabiliyoruz.",
      "Drone planları tek başına değil, yerden yapılan çekimlerle birlikte bir hikâyenin parçası olarak kurgulandığında en güçlü sonucu veriyor; bu yüzden havadan ve yerden çekimi aynı günde planlamayı öneriyoruz.",
    ],
  },
};

export const getLocationContent = (service: string, location: string) =>
  LOCATION_CONTENT[`${service}/${location}`];
