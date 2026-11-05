/**
 * Hand-written copy for the service × location pages that actually earn
 * search impressions (Search Console, Jul–Oct 2026). The generated template
 * makes sibling pages ~90% alike; these blocks give the pages people really
 * land on their own substance and extra, page-specific FAQ entries.
 *
 * Keep it factual: no invented clients, numbers or prices. Key = "service/location".
 */

export interface LocationContent {
  /** <title> override, keyword first (from Search Console queries). With the
   *  brand suffix BaseLayout adds, the final title must stay ≤ 65 chars. */
  title?: string;
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
  /** Ordered process with typical durations (no prices), shown as a list. */
  steps?: { title: string; time?: string; text: string }[];
  /** H2 above `steps` (default "Süreç ve teslim süresi"). */
  stepsHeading?: string;
  /** H1 override (default "<Konum> <Hizmet>"); keep the city + buyer's wording. */
  h1?: string;
  /** Answer-first line(s) shown in the top summary box right after the
   *  canonical BRAND.entity sentence (replaces the generic summary text). */
  answer?: string;
  /** Extra H2 blocks after `paragraphs`: optional text and a bullet list
   *  (`title` is bolded). Used for "what's included", proof lists, how-to-choose. */
  sections?: {
    heading: string;
    paragraphs?: string[];
    items?: { title?: string; text: string }[];
    /** Inline links under the section (e.g. district pages). */
    links?: { href: string; label: string }[];
  }[];
  /** Proof-grid heading/intro overrides (the default intro says the work is
   *  2024–2025 pre-studio, which is wrong for pages that lead with 2026 work). */
  projectsHeading?: string;
  projectsIntro?: string;
}

export const LOCATION_CONTENT: Record<string, LocationContent> = {
  "sosyal-medya-icerigi/hendek": {
    title: "Hendek Sosyal Medya Ajansı ve Yönetimi",
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
    title: "Sakarya Sosyal Medya Yönetimi Ajansı",
    h1: "Sakarya Sosyal Medya Yönetimi Ajansı",
    description:
      "Sakarya sosyal medya yönetimi: Adapazarı, Serdivan ve ilçelerde aylık plan, çekim günü, kurgu, paylaşım ve rapor. Aytaş Home'da 4 ayda etkileşim +%311.",
    answer:
      "Sakarya'da sosyal medya yönetimini video üzerine kuruyoruz: aylık içerik planı, işletmenizde bir ya da iki çekim günü, Reels kurgusu, paylaşım takvimi ve ay sonu raporu. Ayda kaç video çıkacağı teklifte yazılı olur. Hesabı kendiniz yönetmek isterseniz yalnızca içerik üretimi ya da danışmanlık da alabilirsiniz.",
    heading: "Sakarya'da sosyal medya ajansı seçerken: ayda kaç video, çekim dahil mi?",
    paragraphs: [
      "Sakarya'da sosyal medya yönetimi için teklif topladığınızda birçok paketin gönderi ve hikâye sayısıyla satıldığını görürsünüz. Bu paketlerin bir kısmında ayda kaç video çekileceği yazmaz. Bizim paketlerimiz video üzerine kurulu: ayda kaç video çıkacağı ve kaç çekim günü yapılacağı teklifte yazılı olur. Böylece neye para verdiğinizi baştan bilir, ay sonunda yayına çıkanla karşılaştırabilirsiniz.",
      "Bir ay bizde şöyle geçiyor. Ay başında kampanyalarınızı ve öne çıkarmak istediğiniz ürün ya da hizmetleri konuşup videoların konu listesini çıkarıyoruz. Ayda 4 video için yarım gün, 8 video için bir tam gün ya da iki yarım gün çekim yapıyoruz ve çekimi işletmenizin sakin saatlerine koyuyoruz. Çekimde ve kurguda kurucu ortaklarımız bizzat yer alıyor; çekimleri Sony FX30 sinema kamerasıyla yapıyoruz. Ay sonunda erişim, etkileşim, profil ziyareti ve gelen mesajları özetleyen kısa bir rapor gönderiyor, sonraki ayın planını bu verilere göre düzenliyoruz.",
      "Bu düzenle yönettiğimiz hesaplardan biri, mobilya perakendecisi Aytaş Home Outlet'in Instagram hesabı. Hesabı Mayıs 2026'da devraldık. Mağazada düzenli çekim günleriyle ürün, kampanya ve festival videoları ürettik, Meta reklamlarını da biz yönettik. Meta Business Suite verisine göre önceki dört ay (Ocak–Nisan) ile ilk dört ayımız (Mayıs–Ağustos 2026) karşılaştırıldığında içerik etkileşimi 18,6 binden 76,5 bine çıktı (+%311). Yeni mesajlaşan kişi sayısı 257'den 730'a yükseldi. Karşılaştırmanın tamamı Aytaş Home vaka çalışmasında.",
      "Yönettiğimiz hesaplardan ikisi hekimlere ait: Serdivan'da medikal estetik hizmeti veren Dr. Erdem Çalışkan'ın Instagram hesabı ve Op. Dr. Duygu Cebecik Özmüş'ün gebelik bilgilendirme serisini yayınladığı YouTube kanalı. Sağlıkta reklam yönetmelikle sınırlı olduğu için bu hesaplarda kampanya, fiyat ya da sonuç vaadi kullanmıyoruz. Hastaların sık sorduğu konuları hekim kendi ağzından, sade bir dille anlatıyor. “Fraksiyonel Lazer Nedir?” ve “Gebelik: İlk 7 Gün” bu düzenle çıkan videolardan.",
    ],
    sections: [
      {
        heading: "Aylık sosyal medya yönetimine neler dahil?",
        items: [
          { title: "Strateji ve aylık plan", text: "Hedef (mesaj, rezervasyon, mağaza ziyareti), ayın konuları, kampanya günleri ve paylaşım takvimi tek listede onayınıza gelir." },
          { title: "Çekim günleri", text: "Ayda bir ya da iki planlı çekim günü; Adapazarı, Serdivan, Erenler, Arifiye, Hendek, Akyazı, Sapanca ve Karasu'ya aynı gün geliyoruz. Ayda kaç video çıkacağı teklifte yazılıdır." },
          { title: "Kurgu ve tasarım", text: "Dikey Reels kurgusu, altyazı, kapak görselleri, gönderi ve hikâye tasarımları." },
          { title: "Metin ve paylaşım", text: "Açıklama metinleri, hashtag ve konum etiketleri; içerikler takvime göre sizin onayınızla yayına alınır." },
          { title: "Raporlama", text: "Ay sonunda erişim, etkileşim, profil ziyareti ve gelen mesajları özetleyen kısa rapor; sonraki ayın planı bu veriyle kurulur." },
          { title: "İsteğe bağlı", text: "Meta (Instagram ve Facebook) reklam yönetimi, Google İşletme Profili gönderileri, YouTube kanalı. Reklam bütçesi hizmet bedeline dahil değildir." },
        ],
      },
      {
        heading: "Portföy: yönettiğimiz ve ürettiğimiz hesaplar",
        items: [
          { title: "Aytaş Home Outlet (mobilya perakende, Instagram)", text: "Mayıs 2026'dan beri yönetim, çekim ve Meta reklamları. Önceki dört aya göre ilk dört ayda içerik etkileşimi 18,6 binden 76,5 bine (+%311), yeni mesajlaşan kişi 257'den 730'a çıktı (Meta Business Suite)." },
          { title: "Dr. Erdem Çalışkan (medikal estetik, Serdivan, Instagram)", text: "Yönetmeliğe uygun bilgilendirme videoları; “Fraksiyonel Lazer Nedir?” ve “Dr. Erdem Çalışkan Kimdir?” bu seriden." },
          { title: "Op. Dr. Duygu Cebecik Özmüş (kadın doğum, YouTube)", text: "Gebelik bilgilendirme serisi; “Gebelik: İlk 7 Gün” ile başlayan bölümler." },
          { title: "Rast Creative (kendi hesabımız)", text: "Motion graphic Reels “7 Saniye (Mermi)” Instagram'da 84 binin üzerinde izlendi ve 1.184 kez paylaşıldı (28 Ekim 2026)." },
        ],
      },
      {
        heading: "Yönetim, içerik üretimi ya da danışmanlık: hangisi size uygun?",
        paragraphs: [
          "Sakarya'da sosyal medya desteği arayan işletmelerin hepsi aynı şeye ihtiyaç duymuyor. Kimi hesabı tamamen devretmek istiyor, kimi paylaşımı kendi ekibiyle sürdürüp yalnızca videoları dışarıdan almak istiyor. Üç düzenin farkı şöyle:",
        ],
        items: [
          { title: "Sosyal medya yönetimi", text: "Plan, çekim, kurgu, metin, paylaşım ve aylık raporun hepsi bizde. Hesapla ilgilenecek kimseniz yoksa ya da paylaşımlar düzensiz gidiyorsa bu düzen uygun." },
          { title: "Yalnızca içerik üretimi", text: "Ayın videolarını planlayıp çekiyor ve kurguluyoruz; paylaşımı ve mesajları kendi ekibiniz yapıyor. Hesabı içeride yöneten biri varsa ama çekim ve kurgu için zaman ya da ekipman yoksa uygun." },
          { title: "Sosyal medya danışmanlığı", text: "Mevcut hesabınıza birlikte bakıyor, neyin işlediğini ve neyin eksik kaldığını konuşuyoruz; içerik planı ve çekim düzeni için yol haritası çıkarıyoruz. Paylaşımı ve çekimi kendiniz yapacaksanız uygun." },
          { title: "Meta reklam yönetimi", text: "Üç düzene de eklenebiliyor: Instagram ve Facebook reklamlarını aynı çekimden çıkan videolarla kuruyor, haftalık takip edip ay sonunda raporluyoruz. Reklam bütçesi Meta'ya doğrudan sizin hesabınızdan ödenir. Hekim ve sağlık kuruluşu hesaplarında yönetmelik gereği reklam yönetimi yapmıyoruz." },
        ],
        links: [
          { href: "/sektorler/magaza-sosyal-medya-icerigi/", label: "Mağaza ve perakende için sosyal medya içeriği" },
          { href: "/sektorler/doktor-klinik-video-cekimi/", label: "Doktor ve klinik hesapları için video" },
          { href: "/sakarya-reklam-ajansi/", label: "Sakarya'daki tüm hizmetlerimiz" },
        ],
      },
      {
        heading: "Sakarya'da sosyal medya yönetimi ajansı nasıl seçilir?",
        items: [
          { title: "Portföy", text: "Ajansın yönettiği gerçek hesapları ve yönetimi devraldıktan sonraki değişimi görün; yalnızca tasarım örneği değil." },
          { title: "Video ve çekim", text: "Ayda kaç video çekileceği ve kaç çekim günü yapılacağı teklifte yazıyor mu, yoksa sadece gönderi sayısı mı var?" },
          { title: "Kim çalışıyor", text: "Çekimi ve kurguyu kim yapıyor, hesabınızla ilgilenen kişi ay ay değişiyor mu?" },
          { title: "Rapor", text: "Her ay hangi rakamlar raporlanıyor (erişim, etkileşim, mesaj), plan bu rakamlara göre değişiyor mu?" },
          { title: "Reklam bütçesi", text: "Reklam bütçesi fiyata dahil mi, reklam hesabı kimin adına açılıyor?" },
          { title: "Sözleşme", text: "En az kaç ay çalışılıyor, takipçi ya da satış garantisi gibi ölçülemeyen sözler var mı?" },
        ],
      },
    ],
    projectsIntro:
      "Yönettiğimiz ve ürettiğimiz hesaplardan 2026 tarihli işler: perakende, medikal estetik, kadın doğum ve etkinlik.",
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
      { href: "/blog/tek-cekim-gununden-kac-icerik-cikar/", label: "Bir çekim gününden kaç farklı içerik çıkar?" },
      { href: "/video-cekimi/sakarya/", label: "Sadece çekim mi lazım? Sakarya video çekimi" },
    ],
    stepsHeading: "İlk ay nasıl başlar, ne zaman yayına çıkar?",
    steps: [
      {
        title: "Ön görüşme ve hesap analizi",
        time: "1. hafta",
        text: "Mevcut hesabınıza birlikte bakıyor, hedefi (mesaj, rezervasyon, mağaza ziyareti) ve öne çıkacak ürün ya da hizmetleri konuşuyoruz. Ayda kaç video ve kaç çekim günü olacağı yazılı teklife giriyor.",
      },
      {
        title: "İçerik planı ve onay",
        time: "1–2. hafta",
        text: "Ayın video konuları, açılış cümleleri ve paylaşım takvimi tek bir listede onayınıza geliyor. Klinik hesaplarında her senaryo hekim onayından geçiyor.",
      },
      {
        title: "Çekim günü",
        time: "yarım ya da tam gün",
        text: "Ayın videolarını işletmenizin sakin saatlerinde, bir ya da iki çekim gününde topluca çekiyoruz. Sette kurucu ortaklar bizzat çalışıyor.",
      },
      {
        title: "Kurgu, kapak ve metin",
        time: "çekimden sonra yaklaşık 1 hafta",
        text: "Dikey kurgu, altyazı, kapak ve açıklama metinleri hazırlanıyor; her video yayından önce onayınıza gidiyor. İlk videolar genellikle ilk ayın ikinci yarısında yayında.",
      },
      {
        title: "Yayın ve aylık rapor",
        time: "ay boyunca + ay sonu",
        text: "Videolar takvime göre yayına çıkıyor. Ay sonunda erişim, etkileşim, profil ziyareti ve gelen mesajları özetleyen kısa rapor geliyor; sonraki ayın planı bu verilerle kuruluyor.",
      },
    ],
  },

  "video-cekimi/sakarya": {
    title: "Sakarya Video Çekimi ve Video Prodüksiyon",
    h1: "Sakarya Video Çekimi ve Video Prodüksiyon",
    answer:
      "Sakarya'da tanıtım filmi, Reels, etkinlik ve kongre çekimi, ürün ve mekân videosu üretiyoruz. Serdivan'dan Sakarya'nın 16 ilçesine aynı gün geliyoruz. Çekim çoğunlukla yarım ya da tam gün sürüyor, revizyonlar dahil teslim genellikle 2–4 hafta. Çekimi ve kurguyu kurucu ortaklar bizzat yapıyor; ön görüşme ücretsiz.",
    description:
      "Sakarya video çekimi ve video prodüksiyon: tanıtım filmi, Reels, etkinlik ve kongre çekimi. 16 ilçeye aynı gün, teslim genelde 2–4 hafta. Ön görüşme ücretsiz.",
    heading: "Sakarya'da video çekimi nasıl ilerler, fiyatı ne belirler?",
    paragraphs: [
      "Hangi videoya ihtiyacınız olduğu, onu nerede kullanacağınıza bağlı. Mağaza videosu Instagram'da ve Google İşletme profilinde yeri tanıtır; Duru Optik için çektiğimiz dikey videoda mağazanın konumu havadan, gözlük koleksiyonu ve göz ölçümü yakından görünüyor. Klinik ve muayenehaneler için bilgilendirme videosu hazırlıyoruz: Serdivan'da medikal estetik hizmeti veren Dr. Erdem Çalışkan'ın Instagram hesabındaki “Fraksiyonel Lazer Nedir?” ve “Dr. Erdem Çalışkan Kimdir?” videoları bu düzenle çıktı. Etkinlik tarafında Candles and Echoes'un Sapanca Kırkpınar Amfi Tiyatro'daki mum ışığında bale gösterimini, davet tarafında Newlife Davet Salonu'nun tanıtım videosunu dikey formatta çektik. Kurumsal tanıtım filmi ise web sitesinde, YouTube'da ve firmayı iş ortaklarına anlatırken kullanılır; tesisi havadan, üretimi ve kalite kontrolü yakından gösterir. Erenler, Akyazı, Hendek ve Karasu'daki çekimlere de Serdivan'dan aynı gün gidiyoruz.",
      "Kendi markamız için ürettiğimiz işler de aynı masadan çıkıyor: motion graphic Reels “7 Saniye (Mermi)” Instagram'da 84 binin üzerinde görüntüleme ve 1.184 paylaşım aldı (28 Ekim 2026). Bir videoyu izleten şey çoğu zaman bütçe değil; ilk saniyedeki fikir, kurgu ritmi ve platforma uygun teslim. Bu yüzden çekimden önce videonun ilk üç saniyesini ve kapanışını birlikte yazıyoruz.",
      "Bir çekim gününden ne çıkacağı, çekim listesiyle baştan belli olur. Yarım günlük bir mağaza ya da kafe çekimini genellikle bir yatay tanıtım videosu ve üç Reels olarak planlıyoruz; kurumsal tanıtım filminde tam gün çekimden 2–3 dakikalık film, dikey kesitler ve drone planları çıkar. Düzenli içerikte ayın videolarını bir ya da iki çekim gününe topluyoruz. Mobilya perakendecisi Aytaş Home'un Instagram hesabını Mayıs 2026'dan beri yönetiyoruz: Meta Business Suite verisine göre içerik etkileşimi Ocak–Nisan 2026'daki 18,6 binden Mayıs–Ağustos'ta 76,5 bine çıktı (+%311), yeni mesajlaşan kişi 257'den 730'a yükseldi.",
      "Süreç ücretsiz ön görüşmeyle başlar: videonun amacını, kime gösterileceğini ve nerede yayınlanacağını konuşuruz. Ardından konu ve çekim listesini çıkarıp çekim gününü belirleriz. Projeyi kurucu ortaklar Berat Değirmenci ve Muhammed Ekrem Adnan ile konuşursunuz; sette ve kurguda da onlar bizzat çalışır, muhatabınız proje boyunca değişmez. Sony FX30 kamera, Sigma 18-50 lens ve DJI RS4 gimbal ile çekiyor, gerektiğinde 4K drone ekliyoruz. Revizyonlarla birlikte teslim, kapsama göre genellikle 2–4 hafta sürer.",
      "Fiyatı belirleyen başlıca kalemler şunlar: yarım ya da tam gün çekim, çıkacak video sayısı, drone, senaryo ve kurgu kapsamı (grafik, altyazı), ham görüntü isteği ve acil teslim. Net rakamı ön görüşmeden sonra yazılı teklifle veriyoruz. Başka tekliflerle karşılaştırırken toplam tutardan önce kapsama bakın: çekim kaç saat sürüyor, kaç video teslim ediliyor, çekimi kim yapıyor, kaç revizyon turu var ve hangi formatlar dahil.",
    ],
    sections: [
      {
        heading: "Sakarya'da çektiğimiz ve ürettiğimiz işler",
        paragraphs: [
          "İlçe adını yalnızca çekim yerinin açıkça bilindiği işlerde yazıyoruz. Diğerlerinde işin türünü ve sonucunu veriyoruz.",
        ],
        items: [
          { title: "Candles and Echoes, Sapanca (etkinlik çekimi)", text: "Sapanca Belediyesi Kırkpınar Amfi Tiyatro'da 1 Ağustos 2026 akşamı düzenlenen mum ışığında bale gösterimi “Candlelit Ballet: Golden Swan”; az ışıkta, seyirciyi rahatsız etmeden dikey sosyal medya çekimi." },
          { title: "Dr. Erdem Çalışkan, Serdivan (klinik videoları)", text: "Medikal estetik kliniğinin Instagram hesabı için “Fraksiyonel Lazer Nedir?” ve “Dr. Erdem Çalışkan Kimdir?” gibi bilgilendirme videoları; hasta yüzü olmadan, yönetmeliğe uygun." },
          { title: "Aytaş Home Outlet (mağaza ve kampanya videoları)", text: "Mayıs 2026'dan beri düzenli çekim günleri: ürün, kampanya ve festival Reels'leri. Önceki dört aya göre içerik etkileşimi 18,6 binden 76,5 bine çıktı (+%311, Meta Business Suite)." },
          { title: "Duru Optik (mağaza tanıtımı, 0:40)", text: "Mağazanın konumu havadan, gözlük koleksiyonu ve göz ölçümü yakından; dikey tanıtım videosu." },
          { title: "Newlife Davet Salonu (mekân tanıtımı, 1:18)", text: "Söz, nişan ve davet organizasyonlarının yapıldığı salonun hazırlıklarını ve atmosferini gösteren dikey video." },
          { title: "Rast Creative “7 Saniye (Mermi)” (kendi markamız, 0:30)", text: "Motion graphic Reels; Instagram'da 84 binin üzerinde görüntüleme ve 1.184 paylaşım (28 Ekim 2026)." },
        ],
      },
      {
        heading: "Etkinlik, kongre ve sempozyum çekimi",
        paragraphs: [
          "Etkinlik çekiminde iş, etkinlik günü değil bir hafta önce başlıyor: program akışını, konuşmacı listesini, sahne ışığını ve sesin nereden alınacağını (salonun ses sisteminden ya da yaka mikrofonundan) önceden konuşuyoruz. Konuşmaların kaydı ile salonun atmosferi farklı planlar istediği için hangi anların mutlaka çekileceğini çekim listesine yazıyoruz. Kalabalığı ve sahneyi rahatsız etmeyen bir yerden çalışıyoruz; etkinlik günü paylaşılacak kısa bir kesit isteniyorsa bunu da plana önceden yazıyoruz.",
          "Kurgu tarafında da çalışıyoruz: PARHAD (Paramedik ve Hastane Öncesi Acil Tıp Derneği) sempozyumunun “Afetlere daha hazır bir sağlık sistemi” oturumunda kayıt görüntülerinin kurgusunu ve montajını biz yaptık. O işte çekim bize ait değildi; çekimi başka ekibin yaptığı etkinliklerde yalnız kurgu da alabilirsiniz.",
        ],
        items: [
          { title: "Özet film", text: "Etkinliği 1–3 dakikada anlatan, web sitesi ve YouTube için yatay video." },
          { title: "Dikey kesitler", text: "Instagram ve LinkedIn için konuşmalardan ve sahneden 15–60 saniyelik kısa videolar." },
          { title: "Oturum kayıtları", text: "Kongre ve sempozyumlarda konuşmaların tam kaydı; sunum ekranı ve konuşmacı birlikte." },
        ],
      },
      {
        heading: "Sakarya'nın hangi ilçelerine geliyoruz?",
        paragraphs: [
          "Stüdyomuz Serdivan'da. Sakarya'nın 16 ilçesinin hepsine aynı gün gidip dönüyoruz. Merkezdeki Adapazarı, Serdivan, Erenler ve Arifiye stüdyoya en yakın ilçeler; kısa çekimler için randevuyu en hızlı burada verebiliyoruz. Sapanca, Hendek, Akyazı, Karasu, Geyve, Pamukova ve Ferizli'deki çekimleri ışığa ve işletmenin saatine göre planlıyoruz. Kocaali, Söğütlü, Kaynarca, Taraklı ve Karapürçek'teki işlere de aynı şekilde geliyoruz; bu ilçeler için ayrı sayfa açmadık, kapsam bu sayfadakiyle aynı.",
          "Fabrika ve tesis çekimlerinde vardiya düzenine, mağaza, klinik ve kafelerde sakin saatlere, otel ve göl kıyısı mekânlarda sabah ve gün batımı ışığına göre saat seçiyoruz.",
        ],
        links: [
          { href: "/video-cekimi/adapazari/", label: "Adapazarı" },
          { href: "/video-cekimi/serdivan/", label: "Serdivan" },
          { href: "/video-cekimi/erenler/", label: "Erenler" },
          { href: "/video-cekimi/arifiye/", label: "Arifiye" },
          { href: "/video-cekimi/sapanca/", label: "Sapanca" },
          { href: "/video-cekimi/hendek/", label: "Hendek" },
          { href: "/video-cekimi/akyazi/", label: "Akyazı" },
          { href: "/video-cekimi/karasu/", label: "Karasu" },
          { href: "/video-cekimi/geyve/", label: "Geyve" },
          { href: "/video-cekimi/pamukova/", label: "Pamukova" },
          { href: "/video-cekimi/ferizli/", label: "Ferizli" },
        ],
      },
      {
        heading: "Google'daki yorumlarımızdan",
        items: [
          { title: "Aytaş Home (sosyal medya yönetimi)", text: "“Arkadaşlarla uzun zamandır beraber çalışıyoruz. Özellikle kampanya zamanlarında bizim kadar onlar da koşturuyor sağ olsunlar. Çekimlerimiz de güzel geçiyor, yaptıkları işlerden memnunuz. Ellerine sağlık.”" },
          { title: "M. S.", text: "“Rast Creative Studio’ya özenli çalışmaları ve ilgili yaklaşımları için teşekkür ederim. İletişimleri ve işlerine gösterdikleri titizlikten çok memnun kaldım. Video prodüksiyon hizmeti arayanlara gönül rahatlığıyla tavsiye ederim.”" },
        ],
      },
    ],
    projectsHeading: "Portföyden Sakarya video çekimi örnekleri",
    projectsIntro:
      "Mağaza, klinik, etkinlik ve davet salonu işleri ile kendi markamızın Reels'i; hepsi 2026 tarihli.",
    faqs: [
      {
        question: "Sakarya'da etkinlik ya da kongre çekimi yapıyor musunuz?",
        answer:
          "Evet. Konser, gösteri, lansman, kongre ve sempozyum çekiyoruz: özet film, dikey kesitler ve istenirse oturumların tam kaydı. Program akışını ve sesin nereden alınacağını etkinlikten önce konuşuyoruz. Çekimi başka bir ekibin yaptığı etkinliklerde yalnız kurgu da yapıyoruz.",
      },
      {
        question: "Kocaali, Taraklı ya da Karapürçek gibi uzak ilçelere de geliyor musunuz?",
        answer:
          "Evet. Sakarya'nın 16 ilçesinin hepsine Serdivan'dan aynı gün gidip dönüyoruz: Adapazarı, Serdivan, Erenler, Arifiye, Hendek, Akyazı, Karasu, Sapanca, Geyve, Pamukova, Ferizli, Kocaali, Söğütlü, Kaynarca, Taraklı ve Karapürçek. Çekim saatini yol süresine göre planlıyoruz.",
      },
      {
        question: "Düğün, nişan ya da kına çekimi yapıyor musunuz?",
        answer:
          "Hayır, düğün, nişan ve kına çekimi yapmıyoruz. Davet salonları ve etkinlik mekânları için tanıtım videosu, firmalar için etkinlik ve lansman çekimi yapıyoruz.",
      },
      {
        question: "Video çekimi ile video prodüksiyon arasında fark var mı?",
        answer:
          "Günlük dilde aynı işi anlatıyorlar. Bizde video prodüksiyon fikirden teslime kadar her aşamayı kapsıyor: konu ve senaryo, çekim listesi, çekim, kurgu, renk, ses, altyazı ve platforma uygun teslim. Yalnız çekim ya da yalnız kurgu da alabilirsiniz.",
      },
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
      "duru-optik-tanitim",
      "dr-erdem-caliskan-fraksiyonel-lazer",
      "rast-mermi-7-saniye",
      "candles-and-echoes-golden-swan",
      "newlife-davet-salonu",
    ],
    links: [
      { href: "/blog/sakarya-video-produksiyon-firmasi-nasil-secilir/", label: "Sakarya'da video prodüksiyon firması nasıl seçilir?" },
      { href: "/blog/video-cekimi-fiyati-neye-gore-belirlenir/", label: "Video çekimi fiyatı neye göre belirlenir?" },
      { href: "/blog/tek-cekim-gununden-kac-icerik-cikar/", label: "Bir çekim gününden kaç farklı içerik çıkar?" },
      { href: "/projeler/vaka/aytas-home/", label: "Aytaş Home vaka çalışması: 4 ayda etkileşim +%311" },
      { href: "/blog/restoran-kafe-tanitim-videosu/", label: "Restoran ve kafe tanıtım filmi çekimi nasıl planlanır?" },
      { href: "/sosyal-medya-icerigi/sakarya/", label: "Her ay video gerekiyorsa: Sakarya sosyal medya yönetimi" },
    ],
    steps: [
      {
        title: "Ücretsiz ön görüşme",
        time: "30–45 dakika, telefonda ya da yerinizde",
        text: "Videonun amacını, kime gösterileceğini ve nerede yayınlanacağını konuşuyoruz. Kapsam netleşince yazılı teklif geliyor.",
      },
      {
        title: "Konu ve çekim listesi",
        time: "çekimden yaklaşık 1 hafta önce",
        text: "Sahne listesi, konuşma metni ya da soru listesi, çekim saati ve çekilecek alanlar onayınıza geliyor; çekim günü sürpriz kalmıyor.",
      },
      {
        title: "Çekim günü",
        time: "yarım ya da tam gün",
        text: "Sakarya'nın her ilçesine aynı gün geliyoruz. İşletmeniz kendi akışında devam ediyor; gerekiyorsa 4K drone planları da aynı gün çekiliyor.",
      },
      {
        title: "İlk kurgu",
        time: "çekimden sonra 1–2 hafta",
        text: "Ana video ve dikey kesitlerin ilk kurgusu size gönderiliyor. Geri bildiriminizi tek listede toplayıp revizyonu yapıyoruz.",
      },
      {
        title: "Teslim",
        time: "toplamda genellikle 2–4 hafta",
        text: "Web sitesi, YouTube, Instagram ve reklam için doğru oran ve sürelerde dosyalar teslim ediliyor. Acil teslim gerekiyorsa takvimi ön görüşmede birlikte kuruyoruz.",
      },
    ],
  },

  "tanitim-filmi/sakarya": {
    title: "Sakarya Tanıtım Filmi: Fabrika ve Kurumsal Film",
    h1: "Sakarya Tanıtım Filmi ve Fabrika Tanıtım Filmi",
    description:
      "Sakarya tanıtım filmi çekimi: OSB fabrikaları ve kurumsal markalar için 1–3 dk film, drone ve röportaj, fuar ve LinkedIn versiyonları. Teslim 2–4 hafta.",
    answer:
      "Sakarya'da kurumsal ve fabrika tanıtım filmi çekiyoruz: organize sanayi bölgelerindeki üretim tesisleri, klinikler ve yerel markalar için 1–3 dakikalık ana film ve aynı çekimden fuar, LinkedIn ve Instagram versiyonları. Çekim çoğunlukla bir ya da iki gün, revizyonlar dahil teslim genellikle 2–4 hafta (fabrika filmlerinde çoğunlukla 3–4 hafta).",
    heading: "Sakarya'da tanıtım filmi nasıl planlanır?",
    paragraphs: [
      "Sakarya'da tanıtım filmlerinin büyük kısmı sanayi tesisleri, sağlık kuruluşları ve köklü yerel markalar için çekiliyor. İyi bir tanıtım filmi tesisin büyüklüğünü değil, işletmenin neden güvenilir olduğunu anlatır; bu yüzden çekimden önce mesajı, izleyiciyi ve filmin nerede kullanılacağını (web sitesi, fuar, satış sunumu, sosyal medya) netleştiriyoruz.",
      "Çekim gününde ana filmin yanında sosyal medya için kısa kesitler ve fotoğraflar da planlıyoruz; böylece tek prodüksiyon hem kurumsal hem dijital iletişimde kullanılıyor. Gerektiğinde drone ile tesisi havadan da gösteriyoruz. Projeyi kurucu ortaklar Berat Değirmenci ve Muhammed Ekrem Adnan ile konuşursunuz; senaryo, çekim ve kurguda da onlar çalışır.",
    ],
    sections: [
      {
        heading: "Sakarya OSB'lerinde fabrika tanıtım filmi çekimi",
        paragraphs: [
          "Sakarya'da üretim yapan altı organize sanayi bölgesi var: Sakarya 1., 2. (Hendek) ve 3. OSB, Ferizli OSB, Karasu OSB ve Kaynarca Mobilya İhtisas OSB. Bu bölgelerdeki bir fabrikanın filmini çoğu zaman tedarikçi arayan bir satın alma ekibi, yurt dışındaki bir alıcı ya da fuarda standın önünden geçen bir mühendis izliyor. Bu izleyici makine listesinden çok üretimin kontrol altında olduğunu görmek istiyor; filmi bu yüzden üretimin akışı üzerine kuruyoruz: hammadde girişi, hat, kalite kontrol, paketleme ve sevkiyat.",
          "Serdivan'dan bütün OSB'lere aynı gün gidip dönüyoruz. Tesisteki çekimi sahanın kurallarına göre planlıyoruz:",
        ],
        items: [
          { title: "İş güvenliği", text: "Baret, yelek, giriş eğitimi, refakat ve forklift yolları gibi saha kurallarını çekimden önce iş güvenliği biriminizle konuşuyor, ekibi bu kurallara göre hazırlıyoruz." },
          { title: "Vardiya ve hat", text: "Hattı vardiyanın dolu saatinde, çalışırken çekiyoruz; üretimi durdurmanız genellikle gerekmiyor. Yalnız belirli bir makine için kısa bir düzenleme isteyebiliriz." },
          { title: "Gizli alanlar", text: "Çekilmeyecek makine, ürün, kalıp ya da belge listesini plana baştan yazıyoruz; gerekirse gizlilik sözleşmesi imzalıyoruz. Film yayından önce yetkilinizin onayına gidiyor." },
          { title: "Ses ve röportaj", text: "Makine sesi röportajı bozduğu için yönetici ya da mühendis konuşmalarını sessiz bir odada çekiyoruz." },
          { title: "Havadan planlar", text: "Tesisin büyüklüğünü ve yol bağlantısını gösteren drone planları, tesis yönetiminin onayı ve SHGM kurallarına göre; ekipte SHGM İHA-1 ticari pilot lisansı var." },
        ],
      },
      {
        heading: "Portföydeki kurumsal ve endüstriyel filmler (gerçek süreler)",
        paragraphs: [
          "Aşağıdaki filmlerin hepsi 16:9 kurumsal film olarak teslim edildi; 2024 tarihli, kurucu ortaklarımızın stüdyoyu kurmadan önceki işleri. Çekim yeri belirtmiyoruz; sektör ve içerik bilgisi proje sayfalarında.",
        ],
        items: [
          { title: "Canex, 1:50 (metal ve alüminyum imalat, 4K)", text: "Fabrika dışı drone ile, içeride hammadde ruloları, pres, kesim ve büküm makineleri, kalite kontrol, paketleme ve sevkiyat." },
          { title: "Mavi Vatan Gemi İnşa, 2:40 (ağır sanayi, 4K)", text: "Blok ve modül transferini gece ve gündüz takip eden operasyon filmi; drone planlarıyla." },
          { title: "Meteors Shipping, 2:10 (denizcilik ve lojistik, 4K)", text: "Liman, römorkör manevraları ve güverte detayları; drone ve yer çekimi birlikte." },
          { title: "Chint Power Milas, 1:30 (enerji, 4K)", text: "Güneş enerjisi sahası için ürün tanıtım videosu." },
          { title: "Federal, 1:10 (kurumsal)", text: "Üretim gücünü ve sahadaki tempoyu anlatan kısa kurumsal film." },
        ],
      },
      {
        heading: "Aynı çekimden hangi versiyonlar çıkar?",
        items: [
          { text: "Web sitesi ve YouTube için 1–3 dakikalık ana film (16:9)" },
          { text: "LinkedIn ve satış sunumu için 30–60 saniyelik kısa versiyon" },
          { text: "İşveren markası ve işe alım ilanları için dikey kesitler (9:16)" },
          { text: "Fuar standı ekranı için sesi kapalı dönen döngü versiyonu" },
          { text: "İstenirse İngilizce altyazılı ihracat versiyonu ve ham görüntü" },
        ],
      },
    ],
    stepsHeading: "Sakarya'da bir tanıtım filmi nasıl ilerler, ne kadar sürer?",
    steps: [
      { title: "Ön görüşme", time: "1. hafta, 30–45 dakika", text: "Filmin kime gösterileceğini (alıcı, fuar, yatırımcı, işe alım) ve nerede kullanılacağını konuşuyoruz. Kapsam netleşince yazılı teklif geliyor." },
      { title: "Keşif, senaryo ve çekim planı", time: "çekimden yaklaşık 1 hafta önce", text: "Gerekirse tesisi önceden görmeye geliyoruz. Senaryo ya da konu akışı, sahne listesi, vardiya saatleri, gizli alanlar ve drone uçuş kontrolü yazılı plana giriyor." },
      { title: "Çekim", time: "1 tam gün ya da iki yarım gün", text: "Hat çalışırken, röportajlar sessiz bir odada, dış cephe ve havadan planlar ışığın uygun olduğu saatte." },
      { title: "Kurgu, renk ve ses", time: "çekimden sonra 1–2 hafta", text: "İlk kurgu size geliyor; geri bildirimi tek listede toplayıp revizyonu yapıyoruz." },
      { title: "Teslim", time: "toplamda genellikle 2–4 hafta", text: "Ana film, kısa versiyonlar ve fuar döngüsü teslim ediliyor. Fuar ya da lansman tarihi varsa takvimi geriye doğru kuruyoruz." },
    ],
    faqs: [
      {
        question: "Sakarya'da tanıtım filmi ne kadar sürede teslim edilir?",
        answer:
          "Ön görüşmeden teslime genellikle 2–4 hafta; fabrika filmlerinde keşif ve izin adımları nedeniyle çoğunlukla 3–4 hafta. Çekim bir ya da iki gün, kurgu ve revizyon çekimden sonra 1–2 hafta sürüyor.",
      },
      {
        question: "OSB'deki fabrikamızda çekim için bizden neler gerekiyor?",
        answer:
          "Çekim günü bizimle olacak bir yetkili, çekilebilecek ve çekilmemesi gereken alanların listesi, vardiya saatleri ve iş güvenliği biriminizin giriş kuralları (baret, yelek, refakat, giriş kaydı). Drone planları için tesis yönetiminin onayı gerekiyor.",
      },
      {
        question: "Tanıtım filmi kaç dakika olmalı?",
        answer:
          "Web sitesi ve satış sunumu için çoğu zaman 1–3 dakika yeter; portföydeki kurumsal filmler 1:10 ile 2:40 arasında. Sosyal medya ve LinkedIn için aynı filmden 15–60 saniyelik kesitler çıkarıyoruz.",
      },
      {
        question: "Yurt dışı müşteriler için İngilizce versiyon hazırlıyor musunuz?",
        answer:
          "Evet, ihracat ve fuar sunumları için İngilizce altyazılı versiyonu aynı kurgudan çıkarıyoruz. Seslendirme gerekiyorsa teklifte ayrıca yazıyoruz.",
      },
    ],
    projects: [
      "canex-tanitim-filmi",
      "mavi-vatan-gemi-insa",
      "meteors-shipping-tanitim-filmi",
      "federal-reklam-filmi",
      "chint-power-milas-urun-tanitimi",
      "duru-optik-tanitim",
    ],
    projectsHeading: "Portföyden kurumsal ve fabrika tanıtım filmleri",
    projectsIntro:
      "Fabrika, tersane, liman ve enerji sahası filmleri 2024 tarihli, kurucu ortaklarımızın stüdyoyu kurmadan önceki işleri; Duru Optik 2026.",
    links: [
      { href: "/sektorler/fabrika-tanitim-filmi/", label: "Fabrika tanıtım filmi: sanayi tesisleri için çekim" },
      { href: "/blog/fabrika-tanitim-filmi-sanayi/", label: "Fabrikanızı en iyi anlatan film nasıl çekilir?" },
      { href: "/blog/tanitim-filmi-cektirmeden-once/", label: "Tanıtım filmi çektirmeden önce bilmeniz gerekenler" },
      { href: "/tanitim-filmi/hendek/", label: "Hendek tanıtım filmi (OSB)" },
      { href: "/drone-cekimi/sakarya/", label: "Sakarya drone çekimi" },
      { href: "/reklam-filmi/sakarya/", label: "Sakarya reklam çekimi ve reklam filmi" },
      { href: "/tanitim-filmi/kocaeli/", label: "Kocaeli fabrika tanıtım filmi" },
    ],
  },

  "reklam-filmi/sakarya": {
    title: "Sakarya Reklam Çekimi ve Reklam Filmi",
    h1: "Sakarya Reklam Çekimi ve Reklam Filmi",
    description:
      "Sakarya reklam çekimi: Instagram, Facebook ve YouTube için 15–60 sn reklam filmi ve dikey reklam videosu. Tek çekimden 2–3 versiyon, teslim genelde 2–4 hafta.",
    answer:
      "Sakarya'da reklam çekimi için Instagram, Facebook ve YouTube reklamlarında dönecek 15–60 saniyelik reklam filmleri ve dikey reklam videoları üretiyoruz. Çoğu reklam çekimi yarım ya da tam gün sürüyor; aynı çekimden farklı açılışlı 2–3 versiyon çıkıyor, teslim genellikle 2–4 hafta.",
    heading: "Sakarya'da reklam çekimi: satışa dönük kurgu",
    paragraphs: [
      "Reklam filmi, tanıtım filminden farklı olarak tek bir işi yapar: izleyiciyi harekete geçirmek. Sakarya'daki işletmeler için reklam çekimlerini ilk 3 saniyede dikkat çeken bir açılış, net bir teklif ve tek bir çağrı etrafında kuruyoruz.",
      "Aynı çekimden Instagram/Facebook ve YouTube reklamları için farklı uzunluk ve oranlarda versiyonlar hazırlıyoruz; böylece reklam yayındayken hangi versiyonun daha iyi çalıştığını test edebiliyorsunuz.",
      "Mağaza, kafe, davet salonu ve hizmet işletmeleri için reklam çekimi çoğunlukla kısa dikey videolar demek. Aytaş Home Outlet'in Instagram hesabında kampanya videolarını üretip Meta reklamlarını da birlikte yönettik: Meta Business Suite verisine göre ilk dört ayda (Mayıs–Ağustos 2026) içerik etkileşimi önceki dört aya göre 18,6 binden 76,5 bine, yeni mesajlaşan kişi 257'den 730'a çıktı. Kendi markamız için ürettiğimiz 30 saniyelik “7 Saniye (Mermi)” Reels'i reklamsız 84 binin üzerinde izlendi (28 Ekim 2026).",
    ],
    sections: [
      {
        heading: "Reels ve dikey reklam örnekleri",
        items: [
          { title: "Aytaş Home, Koltuk Trendi (0:15)", text: "Trend koltuk modellerini hızlı kurguyla gösteren dikey kampanya videosu." },
          { title: "Aytaş Home, Yatak Kampanyası (0:18)", text: "Yatak ve yatak odası ürünleri için dikey kampanya videosu." },
          { title: "Aytaş Home, Düzce Festivali (0:22)", text: "Mağaza festivalini duyuran dikey video; tarih ve yer ilk saniyelerde ekranda." },
          { title: "Rast Creative, 7 Saniye (0:30)", text: "Motion graphic Reels; izleyiciyi sonuna kadar tutan tek bir fikir üzerine kurulu." },
        ],
      },
      {
        heading: "Sakarya'da sanayi ve B2B ürün reklamı",
        paragraphs: [
          "Sakarya'nın OSB'lerinde üretim yapan firmaların reklamı son tüketiciye değil, başka firmalara gidiyor. Bu tür reklamda izleyici hızlı karar vermez ama ilk saniyelerde ürünün ne işe yaradığını anlamak ister; kurguyu problem, ürün, kanıt ve iletişim sırasıyla kuruyoruz. Chint Power için çektiğimiz Milas güneş enerjisi sahası videosu (1:30, 2024) teknik bir ürünü sahanın ölçeğiyle birlikte gösteren bu tür bir iş. Tesis tanıtımı da gerekiyorsa fabrika çekimi aynı güne eklenebilir; ayrıntılar Sakarya tanıtım filmi sayfasında.",
        ],
      },
      {
        heading: "Aynı çekimden hangi reklam versiyonları çıkar?",
        items: [
          { text: "YouTube ve web için 30–60 saniyelik yatay reklam filmi" },
          { text: "Instagram, Facebook ve TikTok reklamları için 9:16 dikey 15–30 saniyelik kesitler" },
          { text: "Aynı mesajın farklı açılışlarla 2–3 versiyonu (hangisinin işlediğini yayında test etmek için)" },
          { text: "LinkedIn ve B2B satış sunumu için sade, altyazılı versiyon" },
        ],
      },
    ],
    stepsHeading: "Sakarya'da reklam çekimi nasıl ilerler, ne kadar sürer?",
    steps: [
      { title: "Ön görüşme", time: "30–45 dakika", text: "Reklamın neyi satacağını, kime gösterileceğini ve hangi platformda döneceğini konuşuyoruz." },
      { title: "Fikir ve senaryo", time: "çekimden yaklaşık 1 hafta önce", text: "Açılış cümlesi, sahne listesi ve çağrı tek sayfada onayınıza geliyor; 2–3 farklı açılış burada yazılıyor." },
      { title: "Reklam çekimi", time: "yarım ya da tam gün", text: "Ürün, mekân ve gerekiyorsa konuşan kişi aynı gün çekiliyor." },
      { title: "Kurgu ve versiyonlar", time: "çekimden sonra 1–2 hafta", text: "Yatay ve dikey versiyonlar, altyazı ve kapak hazırlanıyor; ilk kurgu revizyon için size geliyor." },
      { title: "Teslim", time: "toplamda genellikle 2–4 hafta", text: "Reklam paneline yüklenecek oran ve sürelerde dosyalar teslim ediliyor." },
    ],
    faqs: [
      {
        question: "Sakarya'da reklam çekimi kaç gün sürer?",
        answer:
          "Çoğu reklam çekimi yarım ya da tam günlük tek çekimle tamamlanıyor. Ön görüşmeden teslime, senaryo onayı ve revizyonlar dahil, genellikle 2–4 hafta sürüyor.",
      },
      {
        question: "Reklam filmi ile tanıtım filmi arasındaki fark ne?",
        answer:
          "Tanıtım filmi işletmeyi anlatır ve uzun süre kullanılır (1–3 dakika). Reklam filmi tek bir teklifi satar, kısadır (15–60 saniye) ve yayında test edilip değiştirilir. Aynı çekim gününden ikisi birlikte de çıkabilir.",
      },
      {
        question: "Reklamı yayına da koyuyor musunuz?",
        answer:
          "Evet. Meta (Instagram ve Facebook) reklamlarının kurulumunu, hedeflemesini ve takibini tek başına ya da sosyal medya yönetimiyle birlikte yapıyoruz. Reklam bütçesi hizmet bedeline dahil değil; Meta'ya doğrudan siz ödüyorsunuz. Hekim ve sağlık kuruluşlarına reklam hizmeti vermiyoruz; yönetmelik ücretli tanıtımı kısıtlıyor (md. 5/i, 7/j).",
      },
    ],
    projects: [
      "aytas-home-koltuk-trendi",
      "aytas-home-nisan-yatak",
      "rast-mermi-7-saniye",
      "aytas-home-duzce-festivali",
      "chint-power-milas-urun-tanitimi",
      "aytas-home-sosyal-medya",
    ],
    projectsHeading: "Portföyden reklam ve kampanya videoları",
    projectsIntro:
      "Aytaş Home kampanya videoları ve kendi markamızın Reels'i 2026 tarihli; Chint Power 2024, kurucu ortaklarımızın stüdyo öncesi işi.",
    links: [
      { href: "/tanitim-filmi/sakarya/", label: "Sakarya tanıtım filmi ve fabrika filmi" },
      { href: "/blog/kurumsal-reklam-marka-hikayesi-hangisi/", label: "Kurumsal film mi, reklam filmi mi, marka hikâyesi mi?" },
      { href: "/blog/reklam-filmi-neden-ise-yaramiyor/", label: "Reklam filminiz neden işe yaramıyor olabilir?" },
      { href: "/blog/reklam-senaryosu-nasil-yazilir/", label: "Reklam senaryosu nasıl yazılır?" },
      { href: "/projeler/vaka/aytas-home/", label: "Aytaş Home vaka çalışması: 4 ayda etkileşim +%311" },
      { href: "/sosyal-medya-icerigi/sakarya/", label: "Sakarya sosyal medya yönetimi" },
    ],
  },

  "urun-mekan-cekimi/sakarya": {
    title: "Sakarya Ürün Fotoğrafçısı ve Ürün Video Çekimi",
    h1: "Sakarya Ürün Fotoğrafçısı ve Ürün Video Çekimi",
    description:
      "Sakarya ürün fotoğrafçısı: e-ticaret ve katalog fotoğrafı, ürün videosu, kurumsal fotoğraf ve mekân çekimi aynı gün. Mağaza, showroom ve tesiste yerinde çekim.",
    answer:
      "Sakarya'da ürün fotoğrafı, ürün videosu, kurumsal fotoğraf ve mekân çekimini aynı çekim gününde yapıyoruz: e-ticaret ve katalog için düzenlenmiş fotoğraflar, Reels için kısa ürün videoları, mağaza, showroom, ofis ve tesis görüntüleri. Ürün listesi netleşince teslim takvimini yazılı veriyoruz; ön görüşme ücretsiz.",
    heading: "Sakarya'da ürün ve mekân çekimi: önce liste, sonra ışık",
    paragraphs: [
      "Ürün çekiminde işin yarısı çekimden önce bitiyor. Hangi ürünler çekilecek, her ürün kaç açıdan, hangi varyantlar (renk, ölçü, ambalaj) ayrı kare istiyor ve görseller nerede kullanılacak: pazaryeri, kendi siteniz, katalog, Instagram ya da reklam. Bu liste olmadan yapılan çekimde ya eksik kare kalıyor ya da aynı ürün farklı ışıkta çekildiği için sayfada tutarsız görünüyor. Listeyi ön görüşmede birlikte çıkarıyoruz.",
      "E-ticaret fotoğrafında hedef, ürünün ekranda gerçeğine yakın görünmesi: düz ya da beyaz fonda aynı ışık düzeni, doğru renk, pazaryerinin istediği ölçü ve kenar boşluğu. Aynı setten ürünü kullanımda gösteren kareler ve kısa videolar da çıkıyor; fotoğraf ürünü net gösterir, video dokusunu, ölçeğini ve kullanımını anlatır. İkisini aynı gün almak, ışığı ve düzeni iki kez kurmaktan daha verimli oluyor.",
      "Mobilya, beyaz eşya ve makine gibi taşınması zor ürünleri yerinde, yani mağazada, showroom'da ya da tesiste çekiyoruz. Mobilya perakendecisi Aytaş Home Outlet için mağazada düzenli çekim günleri yapıyoruz: koltuk, yatak ve bahçe takımı videoları bu çekimlerden çıktı. Duru Optik'te gözlük koleksiyonunu ve göz ölçümünü mağazanın içinde çektik.",
    ],
    sections: [
      {
        heading: "Neler çekiyoruz?",
        items: [
          { title: "E-ticaret ve katalog fotoğrafı", text: "Düz fonda ürün, varyant ve detay kareleri; ölçü ve doku gösteren yakın planlar; pazaryeri ve web sitesi ölçülerinde teslim." },
          { title: "Ürün videosu", text: "Ürünü kullanımda ya da dönerken gösteren 10–30 saniyelik kısa videolar; Reels, ürün sayfası ve reklam için dikey ve yatay." },
          { title: "Kurumsal fotoğraf", text: "Ekip ve yönetici portreleri, ofis ve üretim alanı fotoğrafları; web sitesinin “Hakkımızda” sayfası, LinkedIn ve basın için." },
          { title: "Mekân çekimi", text: "Mağaza, showroom, otel, restoran ve klinik için iç ve dış mekân fotoğrafları ve kısa tanıtım videosu; Google İşletme Profili ve rezervasyon siteleri için." },
        ],
      },
      {
        heading: "Portföyden ürün ve mekân işleri",
        paragraphs: [
          "Portföy sayfasında yayında olan ürün ve mekân işlerimiz video. Süreler projelerin kendi sayfalarında da yazıyor.",
        ],
        items: [
          { title: "Aytaş Home, Koltuk Trendi (0:15), Yatak Kampanyası (0:18), Bahçe Takımları (0:19)", text: "Mağazada çekilen dikey ürün videoları; Instagram ve Meta reklamları için." },
          { title: "Aytaş Home, Sinematik Mağaza Filmi (0:23)", text: "Showroom'u kamera hareketleriyle gezdiren dikey mekân filmi." },
          { title: "Duru Optik (0:40)", text: "Mağazanın konumu havadan, gözlük koleksiyonu ve göz ölçümü yakından." },
          { title: "Chint Power Milas (1:30, 2024)", text: "Güneş enerjisi sahasında teknik ürün tanıtımı; kurucu ortaklarımızın stüdyo öncesi işi." },
        ],
      },
    ],
    stepsHeading: "Ürün ve mekân çekimi nasıl ilerler?",
    steps: [
      { title: "Ürün ve kare listesi", time: "ön görüşme, 30–45 dakika", text: "Ürünler, açılar, varyantlar ve kullanım yerleri (pazaryeri, site, katalog, Reels) tek listede yazılıyor." },
      { title: "Çekim planı", time: "çekimden yaklaşık 1 hafta önce", text: "Fon, ışık düzeni, çekim yeri ve sırası netleşiyor; mağaza ve showroom çekimleri sakin saatlere konuyor." },
      { title: "Çekim günü", time: "ürün sayısına göre yarım ya da tam gün", text: "Fotoğraf ve video aynı gün çekiliyor; ürünler sırayla aynı ışık düzeninden geçiyor." },
      { title: "Düzenleme ve teslim", time: "ürün sayısına göre, takvim teklifte yazılı", text: "Fotoğraflar düzenlenip platform ölçülerine göre dışa aktarılıyor, videolar kurgulanıyor; ilk seçki onayınıza geliyor." },
    ],
    faqs: [
      {
        question: "Ürünleri size mi getiriyoruz, siz mi geliyorsunuz?",
        answer:
          "Çoğunlukla biz geliyoruz: mağazada, showroom'da ya da tesiste, ışığı yanımızda getirerek çekiyoruz. Mobilya, makine ve büyük ürünlerde yerinde çekim tek seçenek. Az sayıda küçük ürün için en pratik yolu ön görüşmede birlikte seçiyoruz.",
      },
      {
        question: "Pazaryeri (Trendyol, Hepsiburada, Amazon) için uygun fotoğraf çekiyor musunuz?",
        answer:
          "Evet. Her pazaryerinin istediği arka plan, ölçü ve oran farklı olduğu için hangi platformlarda satış yaptığınızı çekimden önce soruyor, dosyaları ona göre dışa aktarıyoruz.",
      },
      {
        question: "Kurumsal fotoğraf ve ekip portresi çekiyor musunuz?",
        answer:
          "Evet. Ekip ve yönetici portrelerini, ofis ve üretim alanı fotoğraflarını aynı gün çekebiliyoruz; web sitesi, LinkedIn ve basın için. Tanıtım filmi çekimiyle aynı güne de eklenebilir.",
      },
      {
        question: "Düğün, vesikalık ya da bireysel fotoğraf çekiyor musunuz?",
        answer:
          "Hayır. Düğün, nişan, kına, vesikalık ve bireysel portre çekmiyoruz; işletmeler için ürün, mekân ve kurumsal fotoğraf ile video çekiyoruz.",
      },
    ],
    projects: [
      "aytas-home-koltuk-trendi",
      "duru-optik-tanitim",
      "aytas-home-bahce-takimlari",
      "aytas-home-sinematik-magaza",
      "aytas-home-nisan-yatak",
      "chint-power-milas-urun-tanitimi",
    ],
    projectsHeading: "Portföyden ürün ve mekân videoları",
    projectsIntro:
      "Aytaş Home ve Duru Optik işleri 2026 tarihli; Chint Power 2024, kurucu ortaklarımızın stüdyo öncesi işi.",
    links: [
      { href: "/blog/eticaret-urun-cekimi-foto-mu-video-mu/", label: "E-ticarette ürün çekimi: fotoğraf mı, video mu?" },
      { href: "/blog/urun-fotografi-cekimi-rehberi/", label: "Ürün fotoğrafı çekimi rehberi" },
      { href: "/sektorler/magaza-sosyal-medya-icerigi/", label: "Mağaza ve perakende için sosyal medya içeriği" },
      { href: "/fotograftan-yapay-zeka-reklam-videosu/", label: "Elinizdeki ürün fotoğraflarından reklam videosu" },
      { href: "/video-cekimi/sakarya/", label: "Sakarya video çekimi" },
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
      "canex-tanitim-filmi",
      "mavi-vatan-gemi-insa",
      "meteors-shipping-tanitim-filmi",
      "chint-power-milas-urun-tanitimi",
      "aytas-home-sosyal-medya",
      "duru-optik-tanitim",
    ],
    links: [
      { href: "/blog/fabrika-tanitim-filmi-sanayi/", label: "Fabrikanızı en iyi anlatan film nasıl çekilir?" },
      { href: "/sektorler/fabrika-tanitim-filmi/", label: "Fabrika tanıtım filmi: sanayi tesisleri için çekim" },
      { href: "/blog/video-cekimi-fiyati-neye-gore-belirlenir/", label: "Video çekimi fiyatı neye göre belirlenir?" },
      { href: "/projeler/vaka/aytas-home/", label: "Aytaş Home vaka çalışması: 4 ayda etkileşim +%311" },
      { href: "/tanitim-filmi/kocaeli/", label: "Kocaeli fabrika ve kurumsal tanıtım filmi" },
      { href: "/drone-cekimi/kocaeli/", label: "Kocaeli drone çekimi: tesis ve şantiye" },
    ],
    sections: [
      {
        heading: "Endüstriyel video çekimi: portföydeki fabrika, liman ve tersane filmleri",
        items: [
          { title: "Canex, 1:50", text: "Metal ve alüminyum imalat: pres, kesim, büküm, kalite kontrol ve sevkiyat; fabrika dışı drone ile." },
          { title: "Mavi Vatan Gemi İnşa, 2:40", text: "Gece ve gündüz takip edilen blok ve modül transferi; tersane, ağır nakliye ve drone planları." },
          { title: "Meteors Shipping, 2:10", text: "Liman, römorkör manevraları ve güverte detayları; drone ve yer çekimi birlikte." },
          { title: "Chint Power Milas, 1:30", text: "Güneş enerjisi sahasında ürün tanıtım videosu." },
        ],
        paragraphs: [
          "Aşağıdaki filmlerin hepsi 4K çekildi; 2024 tarihli, kurucu ortaklarımızın stüdyoyu kurmadan önceki işleri. Fabrika filmi planlıyorsanız süreç, versiyonlar ve sık sorulanlar Kocaeli tanıtım filmi sayfasında.",
        ],
      },
    ],
    stepsHeading: "Kocaeli'nde bir fabrika filmi nasıl ilerler, ne kadar sürer?",
    steps: [
      {
        title: "Ön görüşme ve saha bilgisi",
        time: "1. hafta",
        text: "Filmin kime gösterileceğini (alıcı, fuar, işe alım) ve çekilebilecek alanları konuşuyoruz. Gerekirse tesisi çekimden önce görmeye geliyoruz.",
      },
      {
        title: "Çekim planı ve izinler",
        time: "çekimden yaklaşık 1 hafta önce",
        text: "Sahne listesi, vardiya ve operasyon saatleri, iş güvenliği kuralları ve drone uçuş kontrolü netleşiyor; plan yetkilinizin onayına gidiyor.",
      },
      {
        title: "Çekim",
        time: "1 tam gün ya da iki yarım gün",
        text: "Üretim hattı çalışırken, röportajlar sessiz bir odada, dış cephe ve havadan planlar ışığın uygun olduğu saatte çekiliyor.",
      },
      {
        title: "Kurgu, renk ve ses",
        time: "çekimden sonra 1–2 hafta",
        text: "2–3 dakikalık ana film ile LinkedIn ve Instagram için kısa kesitler hazırlanıyor; ilk kurgu revizyon için size geliyor.",
      },
      {
        title: "Teslim ve versiyonlar",
        time: "toplamda genellikle 3–4 hafta",
        text: "Web, YouTube ve fuar ekranı için dosyalar teslim ediliyor; istenirse İngilizce altyazılı ihracat versiyonu aynı kurgudan çıkıyor.",
      },
    ],
  },
  "tanitim-filmi/kocaeli": {
    title: "Kocaeli Fabrika ve Kurumsal Tanıtım Filmi Çekimi",
    h1: "Kocaeli Fabrika ve Kurumsal Tanıtım Filmi",
    description:
      "Kocaeli fabrika tanıtım filmi: İzmit, Gebze, Dilovası ve Gölcük'te üretim hattı, drone ve röportaj çekimi. 4 endüstriyel film örneği, teslim genelde 3–4 hafta.",
    heading: "Kocaeli'nde endüstriyel tanıtım filmi: fabrikayı alıcının gözüyle anlatmak",
    paragraphs: [
      "Kocaeli'ndeki bir fabrikanın tanıtım filmini çoğu zaman tedarikçi arayan bir satın alma ekibi, yurt dışındaki bir alıcı ya da fuarda standın önünden geçen bir mühendis izliyor. Bu izleyici makine listesinden çok üretimin kontrol altında olduğunu görmek istiyor. Bu yüzden filmi bir tur gibi değil, üretimin akışı gibi kuruyoruz: hammadde girişi, üretim hattı, kalite kontrol, paketleme ve sevkiyat; açılışta tesisin büyüklüğünü gösteren havadan planlar, aralarda kısa bir yönetici ya da mühendis röportajı.",
      "Serdivan'daki stüdyomuzdan İzmit, Gebze, Dilovası, Körfez, Gölcük, Kartepe ve Başiskele'ye aynı gün gidip dönüyoruz; Kocaeli çekimlerinin teklifine yol ya da konaklama kalemi eklemiyoruz. Çekim saatini tesisin düzenine göre seçiyoruz: üretim hattını vardiyanın dolu saatinde, röportajları makine sesinden uzak bir odada, dış cepheyi ışığın uygun olduğu saatte. Projeyi kurucu ortaklar Berat Değirmenci ve Muhammed Ekrem Adnan ile konuşursunuz; sette ve kurguda da onlar çalışır.",
    ],
    sections: [
      {
        heading: "Portföydeki endüstriyel ve fabrika filmleri",
        paragraphs: [
          "Aşağıdaki filmlerin hepsi 4K çekildi ve 16:9 kurumsal film olarak teslim edildi. 2024 tarihli işler; kurucu ortaklarımızın stüdyoyu kurmadan önce çektiği ve bugün de aynı ekiple ürettiğimiz türden filmler.",
        ],
        items: [
          { title: "Canex (metal ve alüminyum imalat, 1:50)", text: "Fabrika dışı drone ile, içeride hammadde ruloları, forklift taşıma, tam otomatik pres, kesim ve büküm makineleri, kalite kontrol, paketleme ve sevkiyat; grafik ve metin animasyonlarıyla." },
          { title: "Mavi Vatan Gemi İnşa (ağır sanayi, 2:40)", text: "Blok ve modül transferini gece ve gündüz takip eden operasyon belgeseli: hangar, ağır nakliye araçları, mühendislik ekipleri, tersane ve liman, drone planları." },
          { title: "Meteors Shipping (denizcilik ve lojistik, 2:10)", text: "Limanda demirli kargo gemileri, römorkör destekli manevralar, güverte ve pervane detayları; drone ve yer çekimi birlikte kurgulandı." },
          { title: "Chint Power Milas (enerji, 1:30)", text: "Güneş enerjisi sahası için ürün tanıtım videosu: teknik detay ve sahanın ölçeği aynı filmde." },
        ],
      },
      {
        heading: "Fabrika tanıtım filminde neler gösterilir?",
        items: [
          { title: "Tesis ve konum", text: "Havadan açılış: arazinin büyüklüğü, yükleme alanları, otoyol ya da liman bağlantısı (uçuş, konumun kurallarına göre)." },
          { title: "Üretim akışı", text: "Hammaddeden sevkiyata kadar her aşamadan birkaç güçlü plan; makine sesi ve ritimle kurgulanır." },
          { title: "Kalite ve standartlar", text: "Kalite kontrol, laboratuvar testleri, ölçüm; varsa sertifikalar ekranda kısa metinle." },
          { title: "İnsanlar", text: "Ekip, iş güvenliği ekipmanıyla çalışan operatörler, kısa yönetici ya da mühendis röportajı." },
          { title: "Kapanış", text: "Firmanın ne sunduğunu tek cümleyle söyleyen bitiş ve iletişim bilgisi; ihracat için İngilizce altyazı." },
        ],
      },
      {
        heading: "Aynı çekimden hangi versiyonlar çıkar?",
        items: [
          { text: "Web sitesi ve YouTube için 2–3 dakikalık 4K ana film (16:9)" },
          { text: "LinkedIn ve satış sunumu için 30–60 saniyelik kısa versiyon" },
          { text: "Instagram ve işe alım ilanları için dikey kesitler (9:16)" },
          { text: "Fuar standı ekranı için sesi kapalı dönen döngü versiyonu" },
          { text: "İstenirse İngilizce altyazılı ihracat versiyonu ve ham görüntü" },
        ],
      },
    ],
    stepsHeading: "Kocaeli'nde bir fabrika filmi nasıl ilerler, ne kadar sürer?",
    steps: [
      {
        title: "Ön görüşme",
        time: "1. hafta, 30–45 dakika",
        text: "Filmin kime gösterileceğini (alıcı, fuar, yatırımcı, işe alım) ve nerede kullanılacağını konuşuyoruz. Kapsam netleşince yazılı teklif geliyor.",
      },
      {
        title: "Keşif ve çekim planı",
        time: "çekimden yaklaşık 1 hafta önce",
        text: "Gerekirse tesisi önceden görmeye geliyoruz. Sahne listesi, vardiya saatleri, çekilmemesi gereken alanlar, iş güvenliği kuralları ve drone uçuş kontrolü yazılı plana giriyor.",
      },
      {
        title: "Çekim",
        time: "1 tam gün ya da iki yarım gün",
        text: "Hat çalışırken çekiyoruz; üretimi durdurmanız genellikle gerekmiyor. Röportajlar ve havadan planlar aynı gün içinde.",
      },
      {
        title: "Kurgu, renk ve ses",
        time: "çekimden sonra 1–2 hafta",
        text: "İlk kurgu size geliyor; geri bildirimi tek listede toplayıp revizyonu yapıyoruz.",
      },
      {
        title: "Teslim",
        time: "toplamda genellikle 3–4 hafta",
        text: "Ana film, kısa versiyonlar ve fuar döngüsü teslim ediliyor. Fuar tarihi yakınsa takvimi ön görüşmede ona göre kuruyoruz.",
      },
    ],
    faqs: [
      {
        question: "Kocaeli'nde fabrika tanıtım filmi ne kadar sürede teslim edilir?",
        answer:
          "Ön görüşmeden teslime genellikle 3–4 hafta. Çekim bir tam gün ya da iki yarım gün sürüyor, kurgu ve revizyon çekimden sonra 1–2 hafta. Fuar ya da lansman tarihi varsa takvimi geriye doğru planlıyoruz.",
      },
      {
        question: "Endüstriyel işlerinizi nerede görebilirim?",
        answer:
          "Bu sayfadaki portföy bölümünde Canex, Mavi Vatan Gemi İnşa, Meteors Shipping ve Chint Power filmlerini izleyebilirsiniz. Hepsi 4K; fabrika, tersane, liman ve enerji sahası çekimleri. Kurucu ortaklarımızın stüdyoyu kurmadan önceki 2024 tarihli işleri.",
      },
      {
        question: "Çekilmemesi gereken alanlar ve gizli süreçler ne olacak?",
        answer:
          "Çekim planına gizli alanları baştan yazıyoruz; ekranda görünmemesi gereken makine, ürün ya da belge varsa o planı çekmiyor ya da kurguda çıkarıyoruz. Film yayına girmeden önce yetkilinizin onayına gidiyor. Gerekirse gizlilik sözleşmesi imzalıyoruz.",
      },
      {
        question: "Tanıtım filmini kimler çekiyor, dışarıya iş veriyor musunuz?",
        answer:
          "Senaryo, çekim ve kurguyu kurucu ortaklar Berat Değirmenci ve Muhammed Ekrem Adnan bizzat yapıyor; muhatabınız proje boyunca değişmiyor. Seslendirme gibi ayrı uzmanlık isteyen işler gerekiyorsa teklifte ayrıca yazıyoruz.",
      },
    ],
    projects: [
      "canex-tanitim-filmi",
      "mavi-vatan-gemi-insa",
      "meteors-shipping-tanitim-filmi",
      "chint-power-milas-urun-tanitimi",
      "federal-reklam-filmi",
    ],
    projectsHeading: "Portföyden endüstriyel tanıtım filmleri",
    projectsIntro:
      "Fabrika, tersane, liman ve enerji sahası filmleri. 2024 tarihli işler, kurucu ortaklarımızın stüdyoyu kurmadan önceki çalışmaları.",
    links: [
      { href: "/sektorler/fabrika-tanitim-filmi/", label: "Fabrika tanıtım filmi: sanayi tesisleri için çekim" },
      { href: "/blog/fabrika-tanitim-filmi-sanayi/", label: "Fabrikanızı en iyi anlatan film nasıl çekilir?" },
      { href: "/blog/tanitim-filmi-cektirmeden-once/", label: "Tanıtım filmi çektirmeden önce bilmeniz gerekenler" },
      { href: "/video-cekimi/kocaeli/", label: "Kocaeli video çekimi: fabrika, liman ve mağaza" },
      { href: "/drone-cekimi/kocaeli/", label: "Kocaeli drone çekimi: tesis ve şantiye" },
      { href: "/reklam-filmi/kocaeli/", label: "Kocaeli reklam filmi ve ürün videosu" },
    ],
  },

  "reklam-filmi/kocaeli": {
    title: "Kocaeli Reklam Filmi ve Endüstriyel Ürün Videosu",
    description:
      "Kocaeli reklam filmi: endüstriyel ürün videosu, B2B kampanya ve Meta reklam kreatifi. İzmit, Gebze, Gölcük'e aynı gün çekim; tek çekimden çok versiyon.",
    heading: "Kocaeli'nde reklam filmi: ürünü tek mesajla satmak",
    paragraphs: [
      "Kocaeli'ndeki reklam filmi işlerinin bir kısmı son tüketiciye değil, başka firmalara satış yapan üreticilerden geliyor. Endüstriyel bir ürünün reklamında izleyici hızlı karar vermez ama ilk saniyelerde ürünün ne işe yaradığını anlamak ister. Kurguyu buna göre kuruyoruz: problem, ürün, kanıt ve iletişim. Chint Power için çektiğimiz Milas güneş enerjisi sahası videosu, teknik bir ürünü sahanın ölçeğiyle birlikte gösteren bu tür bir işe örnek.",
      "Mağaza, kafe, klinik ve davet salonu gibi yerel işletmeler için reklam filmi çoğunlukla Instagram ve Facebook reklamlarında dönen kısa dikey videolar demek. Aytaş Home'un Instagram hesabında video üretimiyle Meta reklamlarını birlikte yönettik; Meta Business Suite verisine göre ilk dört ayda içerik etkileşimi önceki dört aya göre 18,6 binden 76,5 bine, yeni mesajlaşan kişi 257'den 730'a çıktı. Kendi markamız için ürettiğimiz 30 saniyelik “7 Saniye (Mermi)” Reels'i 84 binin üzerinde izlendi (28 Ekim 2026).",
    ],
    sections: [
      {
        heading: "Aynı çekimden hangi reklam versiyonları çıkar?",
        items: [
          { text: "YouTube ve web için 30–60 saniyelik yatay reklam filmi" },
          { text: "Instagram, Facebook ve TikTok reklamları için 9:16 dikey 15–30 saniyelik kesitler" },
          { text: "Aynı mesajın farklı açılışlarla 2–3 versiyonu (hangisinin işlediğini yayında test etmek için)" },
          { text: "LinkedIn ve B2B satış sunumu için sade, altyazılı versiyon" },
        ],
      },
    ],
    faqs: [
      {
        question: "Kocaeli'nde reklam filmi çekimi kaç gün sürer?",
        answer:
          "Çoğu reklam işi yarım ya da tam günlük tek çekimle tamamlanıyor. Ön görüşmeden teslime, senaryo onayı ve revizyonlar dahil, genellikle 2–4 hafta sürüyor.",
      },
      {
        question: "Reklamı yayına da koyuyor musunuz?",
        answer:
          "İsterseniz Meta (Instagram ve Facebook) reklam kurulumu ve takibini de yapıyoruz. Reklam bütçesi hizmet bedeline dahil değil; Meta'ya doğrudan siz ödüyorsunuz.",
      },
    ],
    projects: [
      "chint-power-milas-urun-tanitimi",
      "aytas-home-sosyal-medya",
      "rast-mermi-7-saniye",
      "canex-tanitim-filmi",
    ],
    links: [
      { href: "/tanitim-filmi/kocaeli/", label: "Kocaeli fabrika ve kurumsal tanıtım filmi" },
      { href: "/blog/kurumsal-reklam-marka-hikayesi-hangisi/", label: "Kurumsal film mi, reklam filmi mi, marka hikâyesi mi?" },
      { href: "/blog/reklam-filmi-neden-ise-yaramiyor/", label: "Reklam filminiz neden işe yaramıyor olabilir?" },
      { href: "/video-cekimi/kocaeli/", label: "Kocaeli video çekimi" },
    ],
  },
  // ── Round 2 (Search Console impressions, Oct 2026) ──

  "sosyal-medya-icerigi/gebze": {
    title: "Gebze Sosyal Medya Ajansı: Sanayi ve B2B Markaları",
    h1: "Gebze Sosyal Medya Ajansı ve Yönetimi",
    description:
      "Gebze sosyal medya ajansı: fabrika ve B2B firmaları için tesiste çekim, LinkedIn ve Instagram videoları, paylaşım takvimi ve aylık performans raporu.",
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
    title: "Darıca Sosyal Medya Ajansı ve Reklam Yönetimi",
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
    title: "İzmit Sosyal Medya Yönetimi ve Danışmanlığı",
    h1: "İzmit Sosyal Medya Yönetimi ve Danışmanlığı",
    description:
      "İzmit sosyal medya yönetimi ve danışmanlığı: aylık içerik planı, işletmenizde çekim günü, Reels kurgusu, paylaşım takvimi ve rapor. Ön görüşme ücretsiz.",
    heading: "İzmit'te sosyal medya yönetimi",
    paragraphs: [
      "İzmit hem Kocaeli'nin ticaret merkezi hem de yoğun bir hizmet sektörüne sahip; sağlık kuruluşları, eğitim kurumları, restoranlar ve perakende markaları için düzenli içerik ihtiyacı yüksek. Sosyal medya yönetimini aylık içerik planı, planlı çekim günü, kurgu, paylaşım takvimi ve rapordan oluşan tek bir akış olarak yürütüyoruz.",
      "Sakarya'dan İzmit'e aynı gün gidip dönebildiğimiz için çekim günlerini işletmenizin yoğunluğuna göre esnek planlayabiliyoruz. Ayın videolarını genellikle bir ya da iki çekim gününde topluca çekiyor, ay boyunca takvime yayıyoruz.",
      "Hesabınızı kendi ekibinizle yönetmek istiyorsanız danışmanlık da veriyoruz: mevcut hesabınıza birlikte bakıp neyin işlediğini, neyin eksik kaldığını konuşuyor, içerik planı ve çekim düzeni için yol haritası çıkarıyoruz. Yalnızca çekim ve kurguyu bize bırakmak da mümkün.",
    ],
    faqs: [
      {
        question: "İzmit'te sosyal medya danışmanlığı ile yönetim arasındaki fark ne?",
        answer:
          "Yönetimde plan, çekim, kurgu, paylaşım ve aylık rapor bizde. Danışmanlıkta hesabı siz yönetiyorsunuz; biz mevcut durumu birlikte inceliyor, içerik planı ve çekim düzeni için öneri veriyoruz. İkisinin arasında bir düzen de var: videoları biz çekip kurguluyoruz, paylaşımı kendi ekibiniz yapıyor.",
      },
      {
        question: "İzmit'e çekim için ne sıklıkla geliyorsunuz?",
        answer:
          "Aylık pakette genellikle ayda bir ya da iki planlı çekim günü yapıyoruz. Kaç çekim günü ve kaç video olacağı teklifte yazılı olur; kampanya ya da etkinlik varsa ek çekim günü planlanabilir.",
      },
    ],
    links: [
      { href: "/sosyal-medya-icerigi/kocaeli/", label: "Kocaeli sosyal medya yönetimi" },
      { href: "/projeler/vaka/aytas-home/", label: "Aytaş Home vaka çalışması: 4 ayda etkileşim +%311" },
      { href: "/blog/sosyal-medya-yonetimi-fiyati-neye-gore-belirlenir/", label: "Sosyal medya yönetimi fiyatı neye göre belirlenir?" },
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
    title: "Karasu Tanıtım Videosu: Otel, Restoran, Yazlık",
    h1: "Karasu Tanıtım Videosu ve Tanıtım Filmi",
    description:
      "Karasu tanıtım videosu: sahil oteli, restoran, plaj işletmesi ve yazlık projeleri için drone açılışlı tanıtım filmi ve Reels. Sezon öncesi planlı çekim.",
    answer:
      "Karasu'da sahil hattındaki otel, restoran, plaj işletmesi ve yazlık konut projeleri için tanıtım videosu çekiyoruz. Çekimi sezon başlamadan, ışığın en iyi olduğu saatlere planlıyor; sahil ve tesisi drone ile, mekânı ve yemeği yerden çekiyoruz. Bir çekim gününden tanıtım videosu, dikey Reels ve kareler çıkıyor; teslim genellikle 2–4 hafta.",
    heading: "Karasu'da tanıtım filmi ve tanıtım videosu",
    paragraphs: [
      "Karasu'da tanıtım videosu talepleri çoğunlukla sahil hattındaki oteller, restoranlar, yazlık projeleri ve turizm işletmelerinden geliyor. Bu tür işletmelerde film, mekanın atmosferini ve misafirin yaşayacağı deneyimi hissettirmeli; bu yüzden ışığın en iyi olduğu saatleri ve sezonu baştan planlıyoruz.",
      "Ana tanıtım videosunun yanında web sitesi, Google İşletme profili ve Instagram için kısa versiyonlar hazırlıyoruz; sahil ve tesis planlarını drone ile tamamlayabiliyoruz.",
      "Karasu'da işin takvimi sezona bağlı. Yaz kalabalığı başladığında hem çekim zorlaşıyor hem de video, kampanya için geç kalmış oluyor. Bu yüzden restoran ve otel videolarını Mayıs–Haziran başında, yazlık ve konut projelerinin satış videolarını ise havanın açık olduğu bahar ve sonbahar günlerinde çekmeyi öneriyoruz. Kışın kapanmayan işletmeler için sezon dışı içerik de aynı planın parçası olabilir.",
    ],
    sections: [
      {
        heading: "Karasu'da hangi işletmeler için ne çekiyoruz?",
        items: [
          { title: "Restoran ve balık restoranları", text: "Tabaklar, mutfak, deniz manzarası ve akşam ışığı; menü kareleri ve dikey Reels." },
          { title: "Otel ve pansiyon", text: "Odalar, kahvaltı, sahile mesafe; havadan açılışlı 60–90 saniyelik tanıtım videosu." },
          { title: "Plaj ve sahil işletmeleri", text: "Şezlong alanı, servis ve gün batımı; sezon açılışı duyurusu için kısa videolar." },
          { title: "Yazlık ve konut projeleri", text: "Parsel, denize ve merkeze uzaklık, örnek daire; drone ve iç mekân çekimiyle satış videosu." },
        ],
      },
    ],
    stepsHeading: "Karasu'da tanıtım videosu nasıl ilerler?",
    steps: [
      { title: "Ön görüşme", time: "30–45 dakika", text: "Hedef misafir ya da alıcı, sezon takvimi ve kullanım yerleri konuşuluyor." },
      { title: "Çekim planı", time: "çekimden yaklaşık 1 hafta önce", text: "Çekim saati (sabah ya da gün batımı), sahne listesi, drone kontrolü ve yedek hava günü netleşiyor." },
      { title: "Çekim", time: "yarım ya da tam gün", text: "Mekân, yemek ve sahil planları aynı gün; havadan planlar ışığın uygun olduğu saatte." },
      { title: "Kurgu ve teslim", time: "toplamda genellikle 2–4 hafta", text: "Tanıtım videosu, dikey kesitler ve kareler teslim ediliyor." },
    ],
    faqs: [
      {
        question: "Karasu'da sezon için videoyu ne zaman çektirmeliyiz?",
        answer:
          "Sezon başlamadan önce, genellikle Mayıs ya da Haziran başında. Böylece video sezon açılışında yayında olur ve çekim kalabalığa denk gelmez. Yazlık projelerin satış videolarında havanın açık olduğu bahar ve sonbahar günleri de uygun.",
      },
      {
        question: "Sahilde drone ile çekim yapılabilir mi?",
        answer:
          "Konuma bağlı. Kalabalıkların üzerinden uçulmaz ve bazı alanlar izne bağlı olabilir; bu yüzden plaj planlarını sabah erken ya da kalabalık olmayan saatlerde çekiyoruz. Konumu çekimden önce SHGM kurallarına göre kontrol ediyoruz.",
      },
    ],
    projects: [
      "newlife-davet-salonu",
      "duru-optik-tanitim",
      "candles-and-echoes-golden-swan",
      "meteors-shipping-tanitim-filmi",
      "aytas-home-sinematik-magaza",
      "canex-tanitim-filmi",
    ],
    projectsHeading: "Portföyden mekân tanıtımı ve havadan çekim örnekleri",
    projectsIntro:
      "Mekân tanıtım videoları ve etkinlik çekimi 2026 tarihli; drone planları içeren Meteors Shipping ve Canex filmleri 2024, kurucu ortaklarımızın stüdyo öncesi işleri.",
    links: [
      { href: "/sosyal-medya-icerigi/karasu/", label: "Karasu sosyal medya yönetimi" },
      { href: "/drone-cekimi/karasu/", label: "Karasu drone çekimi" },
      { href: "/blog/restoran-kafe-tanitim-videosu/", label: "Restoran ve kafe tanıtım filmi çekimi" },
      { href: "/blog/emlak-konut-drone-video-cekimi/", label: "Emlak ve konut projeleri için drone ve video" },
      { href: "/tanitim-filmi/sakarya/", label: "Sakarya tanıtım filmi" },
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
    title: "Sapanca Tanıtım Videosu: Otel, Bungalov, Mekân",
    h1: "Sapanca Tanıtım Videosu: Otel, Bungalov ve Mekân",
    description:
      "Sapanca tanıtım videosu: otel, bungalov, butik konaklama ve etkinlik mekânları için drone açılışlı tanıtım filmi, oda turu ve rezervasyon Reels'i.",
    answer:
      "Sapanca'da otel, bungalov, butik konaklama, restoran ve etkinlik mekânları için tanıtım videosu çekiyoruz: göl ve tesis üzerinde havadan açılış, oda turu, kahvaltı ve deneyim planları. Bir çekim gününden 60–90 saniyelik tanıtım videosu, dikey Reels ve rezervasyon siteleri için kareler çıkıyor; teslim genellikle 2–4 hafta.",
    heading: "Sapanca'da otel ve mekan tanıtım filmi",
    paragraphs: [
      "Sapanca'da tanıtım filmi çektiren işletmelerin çoğu otel, bungalov, butik konaklama ve düğün/etkinlik mekanları. Bu işletmeler için film rezervasyon kararını etkileyen bir araç: göl manzarası, odalar, kahvaltı ve deneyim; misafirin kendini orada hayal edebileceği bir akışla çekiliyor.",
      "Gölün ve doğanın en iyi göründüğü saatlere göre çekim planı yapıyor, havadan planlarla mekanın konumunu gösteriyoruz. Aynı günden rezervasyon sitelerinde ve Instagram'da kullanılacak kısa videolar da çıkıyor.",
      "Bungalov tanıtımında en çok işe yarayan yapı bir günü anlatmak: sabah göl ya da orman manzarasıyla uyanış, kahvaltı, jakuzi ya da havuz, akşam şömine. Misafir aynı günü yaşayacağını hayal ettiğinde video satış yapıyor. Oda sayısı az olan işletmelerde her bungalovun ayrı oda turunu çekip rezervasyon sayfasına ve Instagram öne çıkanlarına koymak da iyi çalışıyor.",
    ],
    sections: [
      {
        heading: "Otel ve bungalov için teslim paketi",
        items: [
          { title: "Tanıtım videosu", text: "Web sitesi ve YouTube için 60–90 saniyelik yatay film; havadan açılış ve deneyim akışıyla." },
          { title: "Oda turu", text: "Her oda ya da bungalov tipi için kısa, tek planlı tur videosu." },
          { title: "Rezervasyon Reels'i", text: "Instagram ve reklam için 15–30 saniyelik dikey videolar; sezon kampanyası için farklı açılışlar." },
          { title: "Kareler", text: "Rezervasyon siteleri ve Google İşletme Profili için yatay görseller." },
        ],
      },
      {
        heading: "Ne zaman çekmeli?",
        paragraphs: [
          "Sezon kampanyasının videosunu sezondan önce çekmek gerekiyor: yaz için ilkbahar sonu, kış ve şömine konsepti için sonbahar. Doluluk düşük hafta içi günler hem boş oda hem rahat çekim demek. Sabah ve gün batımı ışığı gölü en iyi gösteren saatler; çekim planını bu iki pencereye göre kuruyoruz.",
        ],
      },
    ],
    stepsHeading: "Sapanca'da tanıtım videosu nasıl ilerler?",
    steps: [
      { title: "Ön görüşme", time: "30–45 dakika, mümkünse tesiste", text: "Hedef misafir, öne çıkacak odalar ve deneyimler, kullanım yerleri konuşuluyor." },
      { title: "Çekim listesi ve tarih", time: "çekimden yaklaşık 1 hafta önce", text: "Oda sırası, kahvaltı saati, havadan planlar ve yedek hava günü yazılı plana giriyor." },
      { title: "Çekim", time: "yarım ya da tam gün", text: "Sabah ve gün batımı ışığına göre; misafir akışını bozmadan." },
      { title: "Kurgu ve teslim", time: "toplamda genellikle 2–4 hafta", text: "İlk kurgu revizyon için size geliyor; yatay, dikey ve kare dosyalar teslim ediliyor." },
    ],
    faqs: [
      {
        question: "Bungalov tanıtım videosunda misafir oynatmak gerekir mi?",
        answer:
          "Şart değil. Mekânı boş ama yaşanmış gösteren planlarla (masada kahvaltı, yanan şömine, jakuzi) da güçlü bir video çıkıyor. Kişi görünmesi isteniyorsa işletmeden ya da çevrenizden gönüllülerle, izinli olarak çekiyoruz.",
      },
      {
        question: "Sapanca'da tanıtım videosu kaç saniye olmalı?",
        answer:
          "Web sitesi ve YouTube için 60–90 saniye, Instagram ve reklam için 15–30 saniye yeterli. Aynı çekimden ikisini birlikte çıkarıyoruz.",
      },
    ],
    projects: [
      "candles-and-echoes-golden-swan",
      "newlife-davet-salonu",
      "duru-optik-tanitim",
      "aytas-home-sinematik-magaza",
      "rast-mermi-7-saniye",
      "dr-erdem-caliskan-klinigimizde-neler-yapiyoruz",
    ],
    projectsHeading: "Portföyden mekân ve etkinlik videoları",
    projectsIntro:
      "Sapanca Kırkpınar'daki etkinlik çekimi ve mekân tanıtım videoları; hepsi 2026 tarihli. Yayınlanmış bir otel ya da bungalov işimiz henüz yok.",
    links: [
      { href: "/drone-cekimi/sapanca/", label: "Sapanca drone çekimi" },
      { href: "/sosyal-medya-icerigi/sapanca/", label: "Sapanca sosyal medya yönetimi" },
      { href: "/sektorler/davet-salonu-etkinlik-videosu/", label: "Davet salonu, kafe ve etkinlik videosu" },
      { href: "/blog/restoran-kafe-tanitim-videosu/", label: "Restoran ve kafe tanıtım filmi çekimi" },
      { href: "/tanitim-filmi/sakarya/", label: "Sakarya tanıtım filmi" },
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
    title: "Sapanca Drone Çekimi: Otel, Bungalov, Villa, Göl",
    description:
      "Sapanca drone çekimi: otel, bungalov, villa ve etkinlik mekânları için 4K havadan video. Uçuş sabah ve gün batımına, misafiri rahatsız etmeden planlanır.",
    answer:
      "Sapanca'da otel, bungalov, villa, arsa ve etkinlik mekânları için havadan video çekiyoruz. Uçuşu gölün en sakin olduğu sabah saatlerine ya da gün batımına koyuyor, havadan planları oda, havuz ve kahvaltı gibi yer çekimleriyle birleştirip yatay ve dikey teslim ediyoruz. Ekipte SHGM İHA-1 ticari pilot lisansı var.",
    heading: "Sapanca'da drone çekimi",
    paragraphs: [
      "Sapanca Gölü çevresindeki oteller, bungalovlar, villa projeleri ve etkinlik mekanları havadan çekildiğinde konumun ve manzaranın değeri tek planda anlaşılıyor. Drone planlarını yer çekimleriyle birleştirerek tanıtım videosu ve sosyal medya içeriği olarak teslim ediyoruz.",
      "Uçuşları hava durumu, ışık ve bölgedeki uçuş kurallarına göre planlıyoruz; göl yüzeyinin en sakin ve ışığın en yumuşak olduğu sabah ve gün batımı saatlerini tercih ediyoruz.",
      "Bungalov ve butik otellerde misafirin rezervasyondan önce sorduğu üç şey var: göle ne kadar yakın, çevresi nasıl, oda ve havuz neye benziyor. Havadan açılış ilk iki soruyu birkaç saniyede cevaplıyor; odayı, jakuziyi, kahvaltıyı ve şömineyi ise yerden çekiyoruz. İkisi aynı gün çekildiğinde Instagram, Google İşletme Profili ve rezervasyon siteleri için tek seferde içerik çıkıyor.",
    ],
    sections: [
      {
        heading: "Sapanca'da havadan çekim ne için kullanılıyor?",
        items: [
          { title: "Otel ve bungalov", text: "Göl ve orman içindeki konum, tesisin yerleşimi, havuz ve bahçe; rezervasyon videosunun açılışı." },
          { title: "Villa, arsa ve konut projeleri", text: "Parselin sınırları, göle ve yola uzaklık, çevredeki yapılaşma; satış videosu ve ilan görselleri." },
          { title: "Etkinlik ve kır mekânları", text: "Mekânın ve kurulumun genel planı; kalabalığın tam üzerinden uçmadan, alanın kenarından." },
          { title: "Restoran ve kahvaltı mekânları", text: "“Yeriniz nerede?” sorusunu cevaplayan birkaç saniyelik konum planı; dikey Reels için." },
        ],
      },
      {
        heading: "Otel ve bungalov için bir çekim gününden ne çıkar?",
        items: [
          { text: "Göl ve tesis üzerinde havadan açılış planları (yatay ve dikey)" },
          { text: "Oda, jakuzi, havuz ve kahvaltı için yer çekimleri; oda turu videosu" },
          { text: "Instagram ve rezervasyon kampanyası için 15–30 saniyelik dikey Reels" },
          { text: "Web sitesi ve YouTube için 60–90 saniyelik tanıtım videosu" },
          { text: "Rezervasyon siteleri ve Google İşletme Profili için yatay kareler" },
        ],
      },
      {
        heading: "Mevsim, ışık ve hava",
        paragraphs: [
          "Sapanca'da her mevsim farklı bir video çıkarıyor: ilkbaharda yeşil, yazın göl ve havuz, sonbaharda orman renkleri, kışın şömine ve sis. Sezon kampanyası için çekimi sezondan önce yapmanızı öneriyoruz; yaz için ilkbahar sonu, kış için sonbahar. Rüzgâr ve yağmur uçuşu doğrudan etkilediği için havadan planlara her zaman bir yedek gün belirliyoruz; sabah sisi ise çoğu zaman en güzel planları veriyor.",
        ],
      },
    ],
    stepsHeading: "Sapanca'da drone çekimi nasıl ilerler?",
    steps: [
      { title: "Konum ve amaç", time: "ön görüşme, 15–30 dakika", text: "Konum linkini, görüntülerin nerede kullanılacağını ve tarih aralığını konuşuyoruz." },
      { title: "Uçuş uygunluk kontrolü", time: "çekimden önce", text: "Konumu SHGM kurallarına göre kontrol ediyor, gerekiyorsa izin takvimini netleştiriyoruz. Uçuş mümkün değilse bunu çekim gününden önce söylüyoruz." },
      { title: "Çekim", time: "havadan planlar 1–3 saat, yer çekimiyle yarım ya da tam gün", text: "Sabah ya da gün batımı ışığında uçuyoruz; oda ve mekân çekimleri misafir akışına göre araya giriyor." },
      { title: "Kurgu ve teslim", time: "çekimden sonra genellikle 1–2 hafta", text: "Yatay ve dikey kurgular, istenirse ham görüntü teslim ediliyor." },
    ],
    faqs: [
      {
        question: "Otelde misafirler varken çekim yapılabilir mi?",
        answer:
          "Evet. Havadan planları misafirlerin üzerinden uçmadan, çoğunlukla sabah erken çekiyoruz. Oda ve ortak alan çekimlerini boş odalarda ya da sakin saatlerde yapıyoruz; misafir yüzleri yalnızca izinle görünür.",
      },
      {
        question: "Sapanca Gölü çevresinde drone uçurmak serbest mi?",
        answer:
          "Uçuş kuralları noktaya göre değişiyor; kamu tesisleri, kalabalıklar ve bazı alanlar kısıtlı ya da izne bağlı olabilir. Konum linkini gönderdiğinizde uçuşa uygunluğu SHGM kurallarına göre kontrol ediyor, uygun değilse bunu teklif aşamasında söylüyoruz.",
      },
      {
        question: "Sapanca'da otel ya da bungalov işiniz var mı?",
        answer:
          "Sapanca'da Candles and Echoes için Kırkpınar Amfi Tiyatro'daki mum ışığında bale gösterimini çektik (yer çekimi, dikey). Portföyümüzde henüz yayınlanmış bir otel ya da bungalov işi yok; mekân tanıtımına örnek olarak Newlife Davet Salonu ve Duru Optik videolarına bakabilirsiniz.",
      },
    ],
    projects: [
      "candles-and-echoes-golden-swan",
      "duru-optik-tanitim",
      "newlife-davet-salonu",
      "canex-tanitim-filmi",
      "meteors-shipping-tanitim-filmi",
      "aytas-home-sinematik-magaza",
    ],
    projectsHeading: "Portföyden mekân ve havadan çekim örnekleri",
    projectsIntro:
      "Sapanca'daki etkinlik çekimi, mekân tanıtımları (2026) ve drone planları içeren kurumsal filmler (2024, kurucu ortaklarımızın stüdyo öncesi işleri).",
    links: [
      { href: "/tanitim-filmi/sapanca/", label: "Sapanca otel ve bungalov tanıtım videosu" },
      { href: "/video-cekimi/sapanca/", label: "Sapanca video çekimi" },
      { href: "/sosyal-medya-icerigi/sapanca/", label: "Sapanca sosyal medya yönetimi" },
      { href: "/drone-cekimi/sakarya/", label: "Sakarya drone çekimi: lisans, izin, süreç" },
      { href: "/blog/drone-cekimi-gerekli-mi/", label: "Drone çekimi gerçekten gerekli mi?" },
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
    title: "Sakarya Drone Çekimi: Fabrika, İnşaat, Emlak, Etkinlik",
    h1: "Sakarya Drone Çekimi ve Havadan Video",
    description:
      "Sakarya drone çekimi: fabrika, inşaat, emlak ve etkinlik için 4K havadan video. Ekipte SHGM İHA-1 ticari pilot lisansı, uçuş öncesi izin kontrolü, örnek işler.",
    heading: "Sakarya'da drone çekimi: ne zaman gerekir, nasıl planlanır?",
    paragraphs: [
      "Drone en çok iki şeyi anlatırken işe yarıyor: büyüklük ve konum. Örneğin Hendek'te bir üretim tesisinin araziye nasıl yayıldığı ya da Sapanca Gölü kıyısındaki bir otelin suya ne kadar yakın olduğu, yerden çekilen planlarla tam anlaşılmıyor; yukarıdan tek karede görülüyor. Küçük bir iç mekânda, ürün çekiminde ya da röportajda ise drone filme bir şey katmıyor. Böyle işlerde bütçeyi yerden çekime ve kurguya ayırmanızı öneriyoruz.",
      "Aşağıdaki projelerde bunun örnekleri var. Canex tanıtım filminde fabrikanın dışı havadan, üretim hattı içeriden çekildi. Mavi Vatan'ın modül transferini belgeleyen filmde gece ve gündüz yapılan saha çekimleri, Meteors Shipping filminde de tersane ve liman çekimleri drone görüntüleriyle birlikte kurgulandı. Bu filmler 2024 tarihli, kurucu ortaklarımızın stüdyoyu kurmadan önce yaptığı işler. Çekimde ve kurguda bugün de onlar bizzat yer alıyor.",
      "Müşterinin gelip bulması gereken mağazalarda da birkaç saniyelik bir havadan plan işe yarıyor. Mağazalara mesajla gelen en sık sorulardan biri “Yeriniz nerede?” oluyor. Binayı ve çevresindeki tanıdık bir caddeyi ya da meydanı gösteren kısa bir plan, bu soruyu videonun içinde cevaplıyor. Duru Optik için çektiğimiz dikey videoda da mağazanın konumu havadan, gözlük koleksiyonu ve göz ölçümü yakından gösteriliyor.",
      "Teklif için uzun bir dosya hazırlamanız gerekmiyor. Çekim yerinin konum linkini, görüntülerin nerede kullanılacağını (web sitesi, sosyal medya, fuar ya da reklam), yalnız havadan mı yoksa yerden çekimle birlikte mi istediğinizi ve tarih aralığınızı yazmanız yeterli. Kapsamı ücretsiz ön görüşmede birlikte netleştiriyoruz. Ücreti hangi kalemlerin belirlediğini de blogdaki “Drone çekimi fiyatı neye göre belirlenir?” yazısında anlattık.",
    ],
    sections: [
      {
        heading: "Lisans, izin ve güvenlik",
        paragraphs: [
          "Ticari drone çekimini SHGM (Sivil Havacılık Genel Müdürlüğü) kurallarına göre yapıyoruz; ekibimizde, kurucu ortağımız Muhammed Ekrem Adnan'da SHGM İHA-1 ticari pilot lisansı var. Her çekimden önce konumu kontrol ediyoruz: havalimanı ya da askeri alan yakınlığı, kamu tesisi ve kalabalık üzeri gibi kısıtlar varsa bunu teklif aşamasında söylüyor, izin gerekiyorsa takvime baştan koyuyoruz. Fabrika, şantiye ve özel arazilerde uçuştan önce tesis yönetiminin onayını alıyoruz.",
        ],
      },
      {
        heading: "Sakarya'da drone çekimi ne için kullanılıyor?",
        items: [
          { title: "Fabrika ve OSB tesisleri", text: "Tanıtım filminin açılışı: arazinin büyüklüğü, binaların yerleşimi, yükleme alanları ve yol bağlantısı. İçerideki üretim çekimiyle aynı gün." },
          { title: "İnşaat ilerleme takibi", text: "Şantiyeyi her ay aynı noktadan ve aynı açıdan çekip ilerlemeyi karşılaştırılabilir hale getirmek; yatırımcıya ve alıcıya düzenli rapor videosu." },
          { title: "Emlak, arsa ve konut projeleri", text: "Parselin sınırları, yola ve merkeze uzaklık, çevredeki göl, orman ya da sahil; Sapanca, Serdivan ve Karasu çevresindeki satış videoları." },
          { title: "Etkinlik, açılış ve festival", text: "Mekânın ve kalabalığın genel planı. Kalabalığın tam üzerinden uçulmaz; planları alanın kenarından ve kurallara uygun yükseklikten kuruyoruz." },
          { title: "Mağaza, otel ve restoran", text: "Müşterinin “Yeriniz nerede?” sorusunu cevaplayan birkaç saniyelik konum planı; dikey Reels ve Google İşletme Profili için." },
        ],
      },
    ],
    stepsHeading: "Drone çekimi nasıl ilerler, ne kadar sürer?",
    steps: [
      {
        title: "Konum ve amaç",
        time: "ön görüşme, 15–30 dakika",
        text: "Konum linkini, görüntülerin nerede kullanılacağını ve tarih aralığını konuşuyoruz.",
      },
      {
        title: "Uçuş uygunluk kontrolü",
        time: "çekimden önce",
        text: "Konumu SHGM kurallarına göre kontrol ediyor, tesis onayını ve gerekiyorsa izin takvimini netleştiriyoruz. Uçuş mümkün değilse bunu çekim gününden önce söylüyoruz.",
      },
      {
        title: "Çekim",
        time: "havadan planlar genellikle 1–3 saat",
        text: "Işığın ve rüzgârın uygun olduğu saatte uçuyoruz; yerden çekim de varsa aynı güne yarım ya da tam gün olarak planlanıyor. Hava uygun değilse yedek gün belirleniyor.",
      },
      {
        title: "Kurgu ve teslim",
        time: "çekimden sonra genellikle 1–2 hafta",
        text: "Kurgulu video yatay ve dikey formatlarda teslim ediliyor; ham görüntü istenirse kapsama ekleniyor.",
      },
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
        question: "Drone pilotunuzun lisansı var mı?",
        answer:
          "Evet. Kurucu ortağımız Muhammed Ekrem Adnan'ın SHGM İHA-1 ticari pilot lisansı var. Çekimi SHGM kurallarına göre planlıyor, her uçuştan önce konumun kısıtlarını kontrol ediyoruz.",
      },
      {
        question: "İnşaat ya da şantiye için düzenli drone çekimi yapıyor musunuz?",
        answer:
          "Evet. İnşaat ilerlemesini her ay aynı noktalardan, aynı açı ve yükseklikten çekiyoruz; böylece aylar arası karşılaştırma yapılabiliyor. Takvimi ve teslim formatını ilk görüşmede birlikte belirliyoruz.",
      },
      {
        question: "Düğün, festival ya da açılışta drone kullanılabilir mi?",
        answer:
          "Kurallara uygun şekilde evet. Kalabalığın tam üzerinden uçulmaz, bu yüzden planları alanın kenarından kuruyoruz. Etkinlik yerini önceden kontrol edip uçuşun mümkün olup olmadığını teklif aşamasında söylüyoruz.",
      },
      {
        question: "Drone görüntülerinin ham dosyalarını da alabilir miyim?",
        answer:
          "Evet. Kurgulu videonun yanında ham görüntü teslimi de kapsama eklenebilir; bunu ön görüşmede konuşup teklife ayrı kalem olarak yazıyoruz.",
      },
    ],
    projects: [
      "canex-tanitim-filmi",
      "mavi-vatan-gemi-insa",
      "meteors-shipping-tanitim-filmi",
      "duru-optik-tanitim",
      "altoteks-tanitim-filmi",
    ],
    projectsHeading: "Portföyden drone çekimi içeren işler",
    projectsIntro:
      "Fabrika, tersane, liman ve mağaza işleri. Duru Optik 2026 tarihli; diğerleri 2024 tarihli, kurucu ortaklarımızın stüdyoyu kurmadan önceki çalışmaları.",
    links: [
      { href: "/blog/drone-cekimi-gerekli-mi/", label: "Drone çekimi gerçekten gerekli mi?" },
      { href: "/blog/drone-cekimi-fiyati-neye-gore-belirlenir/", label: "Drone çekimi fiyatı neye göre belirlenir?" },
      { href: "/blog/emlak-konut-drone-video-cekimi/", label: "Emlak ve konut projeleri için drone ve video çekimi" },
      { href: "/drone-cekimi/sapanca/", label: "Sapanca drone çekimi: otel, villa ve göl" },
      { href: "/tanitim-filmi/kocaeli/", label: "Fabrika tanıtım filmi örnekleri (Kocaeli)" },
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
    title: "Kartepe Reklam Ajansı: Reklam Filmi ve Reklam Yönetimi",
    h1: "Kartepe Reklam Filmi ve Reklam Yönetimi",
    description:
      "Kartepe reklam ajansı: otel, kayak ve doğa turizmi için reklam filmi ile Instagram ve Facebook reklam yönetimi. Dikey ve yatay versiyonlar, aylık rapor.",
    heading: "Kartepe'de reklam filmi çekimi",
    paragraphs: [
      "Kartepe'de reklam filmi taleplerinin önemli kısmı otel, kayak ve doğa turizmi işletmelerinden geliyor. Bu reklamlarda sezonun atmosferi ve misafir deneyimi ön planda; kar, orman ve manzara planlarını havadan ve yerden çekimle birlikte kurguluyoruz.",
      "Sezon kampanyaları için reklamı önceden hazırlayıp farklı mecralara uygun versiyonlarla teslim ediyoruz.",
      "Reklamın yayınını da yönetebiliyoruz: Instagram ve Facebook (Meta) kampanyalarını aynı çekimden çıkan videolarla kuruyor, hedef kitleyi Kartepe'ye gelecek misafirlere ya da çevredeki müşterilere göre ayarlıyor, sonuçları haftalık takip edip ay sonunda raporluyoruz. Reklam bütçesi Meta'ya doğrudan sizin hesabınızdan ödenir.",
    ],
    faqs: [
      {
        question: "Kartepe'de sadece reklam yönetimi yapıyor musunuz?",
        answer:
          "Reklamı, kullanılacak videoları biz üreterek yönetmeyi tercih ediyoruz; çünkü sonucu en çok reklamın ilk saniyeleri belirliyor. Hazır videolarınız varsa yalnızca Instagram ve Facebook reklam kurulumu ve takibi de konuşulabilir.",
      },
    ],
    links: [
      { href: "/sosyal-medya-icerigi/kartepe/", label: "Kartepe sosyal medya yönetimi" },
      { href: "/projeler/vaka/aytas-home/", label: "Aytaş Home: Meta reklamları ve içerikle 4 ayda etkileşim +%311" },
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
