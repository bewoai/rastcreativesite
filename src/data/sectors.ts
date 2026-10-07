/**
 * Sector landing pages (/sektorler/<slug>/). The location pages answer
 * "where?"; these answer "for businesses like mine?" — with the real projects
 * we shot in that sector as proof. Keep copy factual: no invented clients,
 * numbers or prices. `clients` must match `client` in src/content/projects.
 */

export interface Sector {
  slug: string;
  /** Short name for cards and breadcrumbs. */
  name: string;
  /** H1 / primary keyword phrase. */
  heading: string;
  /** <title> (brand suffix is added by the layout). */
  title: string;
  description: string;
  tagline: string;
  intro: string[];
  /** What we typically produce for this sector. */
  deliverables: { title: string; text: string }[];
  /** How a shoot day is planned in this sector. */
  process: string[];
  faqs: { question: string; answer: string }[];
  /** Project `client` values shown as proof. */
  clients: string[];
  services: { label: string; href: string }[];
  posts: { label: string; href: string }[];
}

export const SECTORS: readonly Sector[] = [
  {
    slug: "doktor-klinik-video-cekimi",
    name: "Sağlık ve klinikler",
    heading: "Doktor ve klinik video çekimi",
    title: "Doktor ve Klinik Video Çekimi, Sağlık Sosyal Medyası",
    description:
      "Doktorlar ve klinikler için video çekimi: bilgilendirici YouTube serileri, Reels, klinik tanıtımı ve sosyal medya yönetimi. Gerçek sağlık projelerimizi inceleyin.",
    tagline: "Hekimin uzmanlığını anlaşılır, güvenilir ve düzenli içeriğe çeviriyoruz",
    intro: [
      "Sağlıkta video, reklamdan çok güven işidir. Hasta adayları bir hekimi ya da kliniği seçmeden önce onu dinlemek, nasıl anlattığını görmek ister. Bu yüzden sağlık alanındaki içeriklerde en güçlü format, hekimin kendi sesinden kısa ve net bilgilendirici videolardır.",
      "Kadın doğum uzmanının YouTube eğitim serisinden medikal estetik kliniğinin tanıtım ve uygulama videolarına, sağlık derneklerinin sempozyum çekimlerine kadar sağlık alanında düzenli üretim yapıyoruz. Bir çekim gününde birden fazla konu çekip ay boyunca yayınlanacak içerik setini birlikte hazırlıyoruz.",
    ],
    deliverables: [
      { title: "Bilgilendirici video serileri", text: "Hastaların en sık sorduğu soruları hekimin anlattığı YouTube videoları ve kısa dikey kesitler." },
      { title: "Klinik tanıtımı", text: "Kliniği, ekibi ve hasta deneyimini anlatan tanıtım filmi ve web sitesi videoları." },
      { title: "Uygulama anlatımları", text: "Tedavi ve uygulama süreçlerini sakin ve anlaşılır bir dille anlatan içerikler." },
      { title: "Sosyal medya yönetimi", text: "İçerik planı, paylaşım takvimi, açıklama metinleri ve aylık rapor." },
    ],
    process: [
      "Ön görüşmede hasta adaylarının en çok sorduğu konuları listeliyoruz; her biri bir video başlığına dönüşüyor.",
      "Hekimin muayene düzenini bozmayacak bir çekim gününde birden fazla konuyu art arda çekiyoruz.",
      "Kurguda her konudan bir uzun YouTube videosu ve birkaç kısa dikey kesit çıkarıyoruz.",
      "Paylaşım takvimiyle içerikler haftalara yayılıyor; kanal ve hesap düzenli büyüyor.",
    ],
    faqs: [
      {
        question: "Kameraya alışkın olmayan bir hekim için çekim zor olur mu?",
        answer:
          "Hayır. Konuları önceden birlikte belirliyor, çekimde soru-cevap akışıyla ilerliyoruz. Ezber metin yerine hekimin her gün hastasına anlattığı gibi konuşması hem daha kolay hem daha güvenilir sonuç veriyor.",
      },
      {
        question: "Sağlık içeriklerinde nelere dikkat ediyorsunuz?",
        answer:
          "Abartılı vaat içermeyen, bilgilendirici ve hasta mahremiyetine saygılı bir dil kullanıyoruz. Yayın öncesinde içerikler hekimin onayından geçiyor.",
      },
      {
        question: "Bir çekim gününden kaç video çıkar?",
        answer:
          "Konunun uzunluğuna göre değişir; iyi planlanmış bir günde birden fazla YouTube videosu ve bunlardan kesilmiş kısa dikey videolar çekilebilir. Kesin listeyi ön görüşmede birlikte çıkarıyoruz.",
      },
    ],
    clients: ["Op. Dr. Duygu Cebecik Özmüş", "Dr. Erdem Çalışkan", "PARHAD — Paramedik ve Hastane Öncesi Acil Tıp Derneği"],
    services: [
      { label: "Sosyal medya yönetimi", href: "/sosyal-medya-icerigi/sakarya/" },
      { label: "Tanıtım filmi", href: "/tanitim-filmi/sakarya/" },
      { label: "Video çekimi", href: "/video-cekimi/sakarya/" },
    ],
    posts: [
      { label: "Sosyal medya videosu neden izlenmiyor?", href: "/blog/sosyal-medya-videosu-neden-izlenmiyor-durust-bir-cevap/" },
      { label: "Tek çekim gününden kaç içerik çıkar?", href: "/blog/tek-cekim-gununden-kac-icerik-cikar/" },
    ],
  },
  {
    slug: "fabrika-tanitim-filmi",
    name: "Sanayi ve fabrikalar",
    heading: "Fabrika ve sanayi tanıtım filmi",
    title: "Fabrika Tanıtım Filmi ve Sanayi Video Prodüksiyonu",
    description:
      "Fabrika, tersane, lojistik ve enerji firmaları için kurumsal tanıtım filmi, ürün videosu ve drone çekimi. Sanayi projelerimizi ve çekim sürecimizi inceleyin.",
    tagline: "Üretim kapasitenizi, kalitenizi ve ekibinizi güven veren bir filme dönüştürüyoruz",
    intro: [
      "Sanayi firmaları için tanıtım filmi; fuarda, yeni müşteri sunumunda, web sitesinde ve işe alımda aynı soruya cevap verir: bu firmayla neden çalışmalıyım? İyi bir fabrika filmi makineleri sıralamaz; kapasiteyi, kalite süreçlerini, ekibi ve teslim ettiği işi anlaşılır bir hikâyeyle anlatır.",
      "Tekstilden gemi inşasına, lojistikten enerji ekipmanlarına kadar farklı sanayi kollarında tanıtım filmi ve ürün videosu ürettik. Çekimleri üretimi aksatmayacak, iş güvenliği kurallarına uyan bir planla yapıyor; tesisin ölçeğini gerektiğinde drone ile havadan gösteriyoruz.",
    ],
    deliverables: [
      { title: "Kurumsal tanıtım filmi", text: "Firmanın kapasitesini, süreçlerini ve ekibini anlatan ana film; yatay ve fuar ekranı versiyonları." },
      { title: "Ürün ve proje videoları", text: "Ürünü kullanımda, sahada ya da kurulumda gösteren kısa videolar." },
      { title: "Drone ile tesis çekimi", text: "Tesisin büyüklüğünü, yerleşimini ve bağlantılarını gösteren havadan planlar." },
      { title: "İşveren markası ve LinkedIn", text: "Ekip röportajları ve işe alım videoları; aynı çekimden LinkedIn kesitleri." },
    ],
    process: [
      "Ön keşifte çekim noktalarını, iş güvenliği kurallarını ve röportaj yapılacak kişileri belirliyoruz.",
      "Çekim akışını vardiyalara göre planlıyor, üretim hattı çalışırken çekim yapıyoruz.",
      "Ana film, sosyal medya kesitleri ve drone planları aynı gün çekiliyor.",
      "Gerekirse yabancı müşteriler için İngilizce altyazı ya da seslendirme hazırlıyoruz.",
    ],
    faqs: [
      {
        question: "Fabrika çekimi sırasında üretimi durdurmak gerekir mi?",
        answer:
          "Genellikle gerekmez. Çekimi vardiya düzenine göre planlıyor, hat çalışırken iş güvenliği kurallarına uyarak çekiyoruz. Bazı özel planlar için kısa süreli düzenleme gerekebilir.",
      },
      {
        question: "Tanıtım filmi kaç dakika olmalı?",
        answer:
          "Kullanım yerine göre değişir. Web sitesi ve sunum için 1,5–3 dakikalık bir ana film, fuar ve sosyal medya için 15–60 saniyelik kısa versiyonlar en sık tercih edilen yapı.",
      },
      {
        question: "Yurt dışı müşteriler için İngilizce versiyon hazırlıyor musunuz?",
        answer: "Evet; altyazı ya da İngilizce seslendirmeli versiyonu kurgu aşamasında planlayabiliyoruz.",
      },
    ],
    clients: ["Altoteks", "Mavi Vatan", "Meteors Shipping", "Chint Power", "Canex", "Federal"],
    services: [
      { label: "Tanıtım filmi", href: "/tanitim-filmi/sakarya/" },
      { label: "Drone çekimi", href: "/drone-cekimi/sakarya/" },
      { label: "Gebze'de tanıtım filmi", href: "/tanitim-filmi/gebze/" },
    ],
    posts: [
      { label: "Fabrika tanıtım filmi nasıl çekilir?", href: "/blog/fabrika-tanitim-filmi-sanayi/" },
      { label: "Tanıtım filmi çektirmeden önce", href: "/blog/tanitim-filmi-cektirmeden-once/" },
    ],
  },
  {
    slug: "magaza-sosyal-medya-icerigi",
    name: "Mağaza ve perakende",
    heading: "Mağaza ve perakende için sosyal medya içeriği",
    title: "Mağaza Sosyal Medya Yönetimi ve Reels Çekimi",
    description:
      "Mobilya, optik ve perakende mağazaları için Reels çekimi, kampanya videoları ve sosyal medya yönetimi. Aytaş Home vaka çalışması dahil gerçek projeler.",
    tagline: "Ürünü, mağazayı ve kampanyayı her hafta yeniden görünür kılıyoruz",
    intro: [
      "Perakendede sosyal medya bir vitrin gibidir: düzenli yenilenmezse bakılmaz. Mağazalar için en etkili içerik; ürünün kullanımda görüldüğü, mağaza atmosferini hissettiren ve kampanyayı net söyleyen kısa dikey videolardır.",
      "Bir mobilya mağazasının sosyal medyasını aylardır yönetiyor, bir optik mağazası için koleksiyon tanıtımı ürettik. Ayın kampanyalarını ve ürün gruplarını tek çekim gününe toplayıp haftalara yayılan bir içerik akışı kuruyoruz.",
    ],
    deliverables: [
      { title: "Ürün ve koleksiyon Reels'leri", text: "Yeni gelen ürünleri, trendleri ve kullanım fikirlerini gösteren kısa dikey videolar." },
      { title: "Kampanya videoları", text: "İndirim, sezon ve özel gün kampanyaları için net mesajlı kısa kurgular." },
      { title: "Mağaza tanıtımı", text: "Mağazanın atmosferini ve hizmetini anlatan sinematik tanıtım videosu." },
      { title: "Reklam yönetimi", text: "Meta reklamlarıyla videoları mağaza çevresindeki doğru kitleye ulaştırma." },
    ],
    process: [
      "Ayın kampanyalarını, öne çıkacak ürünleri ve özel günleri birlikte planlıyoruz.",
      "Mağaza sakin saatlerinde, tek çekim gününde ayın tüm içeriklerini çekiyoruz.",
      "Videoları haftalara yayan paylaşım takvimi ve açıklama metinlerini hazırlıyoruz.",
      "Aylık raporla hangi içeriğin işe yaradığına bakıp bir sonraki ayı düzenliyoruz.",
    ],
    faqs: [
      {
        question: "Mağazamız için ayda kaç video gerekir?",
        answer:
          "Hesabın hedefine göre değişir; düzenli görünürlük için haftada birkaç kısa video iyi bir başlangıçtır. Bunları her hafta ayrı çekmek yerine aylık tek çekim gününde topluca üretiyoruz.",
      },
      {
        question: "Mağaza açıkken çekim yapabiliyor musunuz?",
        answer: "Evet; müşteri trafiğinin az olduğu saatleri seçerek mağazanın işleyişini bozmadan çekiyoruz.",
      },
    ],
    clients: ["Aytaş Home", "Duru Optik"],
    services: [
      { label: "Sosyal medya yönetimi", href: "/sosyal-medya-icerigi/sakarya/" },
      { label: "Ürün & mekan çekimi", href: "/urun-mekan-cekimi/sakarya/" },
      { label: "Aytaş Home vaka çalışması", href: "/projeler/vaka/aytas-home/" },
    ],
    posts: [
      { label: "Sosyal medya yönetimi fiyatı neye göre belirlenir?", href: "/blog/sosyal-medya-yonetimi-fiyati-neye-gore-belirlenir/" },
      { label: "Ürün çekimi: fotoğraf mı, video mu?", href: "/blog/eticaret-urun-cekimi-foto-mu-video-mu/" },
    ],
  },
  {
    slug: "davet-salonu-etkinlik-videosu",
    name: "Mekan ve etkinlik",
    heading: "Davet salonu, kafe ve etkinlik videosu",
    title: "Davet Salonu, Kafe ve Etkinlik Video Çekimi",
    description:
      "Davet salonu, kafe, otel ve etkinlik mekanları için tanıtım videosu, etkinlik çekimi ve sosyal medya içeriği. Mekanınızı rezervasyon getiren videolara dönüştürün.",
    tagline: "Mekanın atmosferini ve misafirin yaşayacağı deneyimi hissettiriyoruz",
    intro: [
      "Davet salonu, kafe, otel ve etkinlik mekanlarında karar çoğu zaman bir videoyla verilir. Misafir adayı salonu gezmeden önce Instagram'da görür; ışık, dekor ve atmosfer onu ikna etmelidir. Bu yüzden mekan videolarında teknik çekim kadar doğru saat, doğru ışık ve doğru akış önemlidir.",
      "Davet salonu ve kafe tanıtım videolarını, Sapanca'daki mum ışığında bale gösterimi gibi etkinlik çekimlerini mekanın hem boş hem dolu halini gösterecek şekilde planlıyoruz. Aynı çekimden tanıtım videosu, Reels kesitleri ve fotoğraflar birlikte çıkıyor.",
    ],
    deliverables: [
      { title: "Mekan tanıtım videosu", text: "Salonu, dekoru ve hizmetleri anlatan sinematik tanıtım filmi." },
      { title: "Etkinlik çekimi", text: "Konser, davet ve organizasyonların atmosferini yakalayan kısa ve uzun kurgular." },
      { title: "Sosyal medya kesitleri", text: "Rezervasyon döneminde düzenli paylaşılacak dikey videolar." },
      { title: "Drone planları", text: "Mekanın konumunu ve çevresini gösteren havadan görüntüler." },
    ],
    process: [
      "Mekanın en iyi göründüğü saatleri ve dekor düzenini ön keşifte belirliyoruz.",
      "Boş mekan çekimi ile etkinlik çekimini aynı ya da ardışık günlere planlıyoruz.",
      "Tanıtım videosu, Reels kesitleri ve fotoğrafları birlikte teslim ediyoruz.",
    ],
    faqs: [
      {
        question: "Etkinlik sırasında misafirleri rahatsız etmeden çekim yapabiliyor musunuz?",
        answer:
          "Evet; organizasyonun akışını önceden öğrenip kamerayı akışı bozmayacak noktalara yerleştiriyoruz. Yakın planlar için uygun anları organizatörle birlikte belirliyoruz.",
      },
      {
        question: "Mekan videosu için en iyi zaman ne?",
        answer:
          "Dekorun hazır olduğu ve ışığın mekanı en iyi gösterdiği saatler. Dış mekan ve manzara için sabah veya gün batımı, iç mekan için dekor kurulumunun tamamlandığı an idealdir.",
      },
    ],
    clients: ["Newlife Davet Salonu", "Hörnhauss", "Candles and Echoes"],
    services: [
      { label: "Tanıtım filmi", href: "/tanitim-filmi/sakarya/" },
      { label: "Sapanca'da tanıtım filmi", href: "/tanitim-filmi/sapanca/" },
      { label: "Drone çekimi", href: "/drone-cekimi/sakarya/" },
    ],
    posts: [
      { label: "Restoran ve kafe tanıtım videosu", href: "/blog/restoran-kafe-tanitim-videosu/" },
      { label: "Drone çekimi gerçekten gerekli mi?", href: "/blog/drone-cekimi-gerekli-mi/" },
    ],
  },
  {
    slug: "youtube-egitim-icerigi",
    name: "Eğitim ve YouTube",
    heading: "YouTube ve eğitim içeriği prodüksiyonu",
    title: "YouTube Eğitim Videosu ve Kurs İçeriği Prodüksiyonu",
    description:
      "Uzmanlar, eğitmenler ve kurumlar için YouTube eğitim serileri ve kurs videoları: konu planı, çekim, kurgu ve kanal düzeni. Gerçek eğitim projelerimizi inceleyin.",
    tagline: "Bilginizi düzenli, izlenebilir ve aranabilir bir video kütüphanesine çeviriyoruz",
    intro: [
      "Eğitim içeriğinde başarının anahtarı süreklilik ve düzen. Tek tek çekilen videolar yerine konu planı olan bir seri, hem izleyicinin kanalda kalmasını hem de videoların aramada bulunmasını sağlar.",
      "Bir kadın doğum uzmanı için gebelik sürecini haftalara bölen YouTube serisini, bir mimarlık eğitim stüdyosu için de kurs tanıtım videosunu ürettik. Konuları önceden planlayıp tek çekim gününde birden fazla bölüm çekiyor, kurguda başlık, bölüm ve kapak düzenini de hazırlıyoruz.",
    ],
    deliverables: [
      { title: "YouTube eğitim serisi", text: "Konu planına göre bölümlenmiş, düzenli yayınlanan video serisi." },
      { title: "Kurs ve ders videoları", text: "Ekran kaydı ve anlatımı birleştiren, temiz sesli eğitim videoları." },
      { title: "Shorts ve Reels kesitleri", text: "Uzun videolardan kesilen, kanala izleyici çeken kısa videolar." },
      { title: "Kanal düzeni", text: "Başlık, açıklama, kapak ve oynatma listesi düzeni ile aranabilirlik." },
    ],
    process: [
      "İzleyicinin sorularından bir konu listesi ve yayın sırası çıkarıyoruz.",
      "Bir çekim gününde art arda birden fazla bölüm çekiyoruz.",
      "Her bölümden uzun video ve kısa kesitler kurgulanıyor; kapak ve başlıklar hazırlanıyor.",
      "Yayın takvimiyle seri haftalara yayılıyor.",
    ],
    faqs: [
      {
        question: "Bir YouTube eğitim serisine nasıl başlanır?",
        answer:
          "İzleyicinin en sık sorduğu 8–12 soruyla bir konu listesi çıkarmak en iyi başlangıçtır. Her soru bir bölüme dönüşür; ilk çekim gününde bu bölümlerin bir kısmı birlikte çekilir.",
      },
      {
        question: "Ekran kaydı gerektiren eğitimleri de çekiyor musunuz?",
        answer: "Evet; anlatım çekimini ekran kaydıyla birleştirip ses ve görüntüyü temizleyerek kurguluyoruz.",
      },
    ],
    clients: ["Op. Dr. Duygu Cebecik Özmüş", "Mars Stüdyo"],
    services: [
      { label: "Video çekimi", href: "/video-cekimi/sakarya/" },
      { label: "Sosyal medya yönetimi", href: "/sosyal-medya-icerigi/sakarya/" },
    ],
    posts: [
      { label: "Video değil, içerik sistemi kurmak", href: "/blog/video-cektirmek-degil-icerik-sistemi-kurmak/" },
      { label: "Sosyal medya videosu neden dikey?", href: "/blog/sosyal-medya-videosu-neden-dikey/" },
    ],
  },
];

export const getSector = (slug: string) => SECTORS.find((s) => s.slug === slug);
