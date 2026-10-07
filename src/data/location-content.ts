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
