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
};

export const getLocationContent = (service: string, location: string) =>
  LOCATION_CONTENT[`${service}/${location}`];
