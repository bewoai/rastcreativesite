/**
 * Buyer-facing content for the six service hub pages (/video-cekimi/, …).
 *
 * The hubs used to be a short intro + a list of city links. Buyers (and AI
 * answers) look for: a direct answer up top, what they get, how the process
 * runs and how long it takes, and answers to the questions they ask before
 * calling. Everything here is rendered visibly; the FAQ also feeds FAQPage
 * JSON-LD from the same array so the two never drift apart.
 *
 * Copy rules: no prices (say "teklif ön görüşmeden sonra"), no invented
 * clients/numbers, no tool or model names for AI work, timelines only as
 * "genellikle" ranges that match /sss/ (2–4 hafta) and the location pages.
 */

export interface HubStep {
  t: string;
  d: string;
}

export interface ServiceHub {
  /** Meta description, ≤ 155 chars. */
  description: string;
  /** Answer-first summary shown right under the H1. */
  summary: string;
  /** What the client receives. */
  deliverables: string[];
  /** Process with typical timing. */
  steps: HubStep[];
  /** One line on overall timing, shown under the steps. */
  timeline: string;
  faqs: { question: string; answer: string }[];
  /** Related guides (blog) and proof pages. */
  links: { href: string; label: string }[];
  /** Portfolio categories for the proof grid (project `category` values). */
  categories: string[];
  /** Hand-picked project ids shown first in the proof grid. */
  projects?: string[];
}

export const SERVICE_HUB: Record<string, ServiceHub> = {
  "video-cekimi": {
    description:
      "Video çekimi: tanıtım, Reels, etkinlik ve ürün videosu. Senaryo, çekim, kurgu tek ekipte; teslim genellikle 2–4 hafta. Sakarya merkezli, ön görüşme ücretsiz.",
    summary:
      "Rast Creative Studio, Serdivan / Sakarya merkezli bir video prodüksiyon stüdyosudur. Tanıtım filmi, sosyal medya videosu, etkinlik ve ürün videolarını fikirden teslime kadar aynı ekip üretir. Yerinde çekimi Sakarya, Kocaeli, Düzce ve çevresinde yapıyoruz; teslim, kapsama göre genellikle 2–4 hafta sürer.",
    deliverables: [
      "Web sitesi ve YouTube için yatay ana video",
      "Instagram, TikTok ve Shorts için dikey kesitler",
      "Reklamlar için kısa süre versiyonları",
      "Altyazı, kapak görseli ve platforma uygun dosya formatları",
      "İsteğe bağlı: drone planları, ham görüntü teslimi",
    ],
    steps: [
      { t: "1 · Ön görüşme", d: "Videonun amacını, kime gösterileceğini ve nerede yayınlanacağını konuşuruz. Ücretsiz ve bağlayıcı değil." },
      { t: "2 · Çekim listesi", d: "Konu, sahneler ve çıkacak video sayısı yazılı hale gelir; çekim gününü işletmenizin sakin saatine koyarız." },
      { t: "3 · Çekim", d: "Yarım ya da tam gün. Kurucu ortaklar sette bizzat çalışır; gerekirse drone eklenir." },
      { t: "4 · Kurgu ve teslim", d: "İlk kurguyu size gönderir, geri bildirime göre düzeltir, tüm formatları teslim ederiz." },
    ],
    timeline:
      "Çekimden 1–2 hafta önce görüşmek planlamayı rahatlatır. Revizyonlar dahil teslim, kapsama göre genellikle 2–4 hafta.",
    faqs: [
      {
        question: "Video çekimi fiyatı neye göre belirlenir?",
        answer:
          "Çekim süresi (yarım ya da tam gün), çıkacak video sayısı, drone, senaryo ve kurgu kapsamı fiyatı belirler. Fiyat için bizimle iletişime geçin; net teklifi ücretsiz ön görüşmeden sonra yazılı olarak veriyoruz.",
      },
      {
        question: "Bir çekim gününden kaç video çıkar?",
        answer:
          "Çekim listesine bağlı. Yarım günlük bir mağaza ya da kafe çekimini genellikle bir yatay tanıtım videosu ve üç Reels olarak planlıyoruz; tam gün kurumsal çekimden ana film, dikey kesitler ve drone planları çıkar.",
      },
      {
        question: "Sakarya dışına da çekime geliyor musunuz?",
        answer:
          "Kocaeli ve Düzce'deki çekimlere Serdivan'dan geliyoruz; Bolu ve Bilecik'e proje bazlı gidiyoruz. Daha uzaktaki işletmeler için ürün fotoğraflarından reklam videosu hizmetimiz uzaktan yürür.",
      },
      {
        question: "Sadece kurgu da yapıyor musunuz?",
        answer:
          "Evet. Elinizde görüntü varsa kurgu, renk, altyazı ve platforma göre format işini tek başına da alıyoruz.",
      },
    ],
    links: [
      { href: "/blog/video-cekimi-fiyati-neye-gore-belirlenir/", label: "Video çekimi fiyatı neye göre belirlenir?" },
      { href: "/blog/tek-cekim-gununden-kac-icerik-cikar/", label: "Bir çekim gününden kaç farklı içerik çıkar?" },
      { href: "/blog/sakarya-video-produksiyon-firmasi-nasil-secilir/", label: "Sakarya'da video prodüksiyon firması nasıl seçilir?" },
      { href: "/projeler/vaka/aytas-home/", label: "Aytaş Home vaka çalışması" },
    ],
    categories: ["Kurumsal", "Ürün", "Sosyal Medya", "Reklam", "Marka Hikayesi"],
    projects: ["altoteks-tanitim-filmi", "aytas-home-sosyal-medya", "duru-optik-tanitim"],
  },

  "drone-cekimi": {
    description:
      "Drone çekimi: fabrika, tesis, arazi ve etkinlik için 4K havadan görüntü. Uçuş öncesi alan ve izin kontrolü, yer çekimiyle aynı plan. Ön görüşme ücretsiz.",
    summary:
      "Drone çekimi, bir tesisin, sahanın ya da mekânın ölçeğini yerden çekimin gösteremediği şekilde anlatır. Rast Creative Studio 4K drone ile havadan çekim yapar ve bu kareleri çoğunlukla tanıtım filmi ya da sosyal medya çekimiyle aynı günde, aynı kurguda kullanır. Uçuştan önce alanı ve izin durumunu kontrol ederiz.",
    deliverables: [
      "Renk düzenlenmiş 4K havadan planlar",
      "Tanıtım filmi veya Reels kurgusuna yerleştirilmiş havadan sahneler",
      "Dikey ve yatay kesitler",
      "İsteğe bağlı: ham havadan görüntü teslimi",
    ],
    steps: [
      { t: "1 · Alan ve izin kontrolü", d: "Çekim yerinin uçuşa uygunluğunu ve gereken izinleri çekimden önce kontrol ederiz; uçulamayan alanları baştan söyleriz." },
      { t: "2 · Plan", d: "Hangi açıların filme gireceğini ve ışığın uygun olduğu saati belirleriz." },
      { t: "3 · Uçuş ve yer çekimi", d: "Havadan planlar, varsa yer çekimiyle aynı gün çekilir. Hava koşulu uymazsa gün birlikte kaydırılır." },
      { t: "4 · Renk ve teslim", d: "Görüntüler renk düzenlenip kurguya girer ya da ayrı dosya olarak teslim edilir." },
    ],
    timeline:
      "Uçuş izni gereken bölgelerde izin süreci takvimi uzatabilir; bunu ön görüşmede söyleriz. Kurgu ve teslim, bağlı olduğu projeyle birlikte ilerler.",
    faqs: [
      {
        question: "Drone çekimi her yerde yapılabilir mi?",
        answer:
          "Hayır. Havalimanı çevresi, askeri alanlar ve bazı şehir merkezleri gibi bölgelerde uçuş kısıtlıdır ya da izin gerekir. Alanı çekimden önce kontrol eder, uçulamıyorsa alternatif planı birlikte kurarız.",
      },
      {
        question: "Hava kötü olursa ne olur?",
        answer:
          "Rüzgâr ve yağış güvenli uçuşu engeller. Böyle bir günde havadan planları başka bir güne kaydırır, yer çekimini mümkünse planlandığı gibi yaparız.",
      },
      {
        question: "Sadece drone çekimi alabilir miyim?",
        answer:
          "Evet, ama havadan görüntü en çok bir tanıtım filmi ya da sosyal medya çekiminin parçası olduğunda işe yarar. Ne istediğinizi dinleyip hangisinin size uygun olduğunu dürüstçe söyleriz.",
      },
      {
        question: "Drone çekimi fiyatı nasıl belirlenir?",
        answer:
          "Uçuş süresi, alanın büyüklüğü, izin gerekip gerekmediği ve kurgu kapsamı belirler. Fiyat için iletişime geçin; teklifi ön görüşmeden sonra yazılı veriyoruz.",
      },
    ],
    links: [
      { href: "/blog/drone-cekimi-gerekli-mi/", label: "Drone çekimi gerçekten gerekli mi?" },
      { href: "/blog/drone-cekimi-fiyati-neye-gore-belirlenir/", label: "Drone çekimi fiyatı neye göre belirlenir?" },
      { href: "/blog/emlak-konut-drone-video-cekimi/", label: "Emlak ve konut projeleri için drone ve video çekimi" },
      { href: "/blog/fabrika-tanitim-filmi-sanayi/", label: "Fabrikanızı en iyi anlatan film nasıl çekilir?" },
    ],
    categories: ["Kurumsal", "Ürün"],
    projects: ["altoteks-tanitim-filmi", "meteors-shipping-tanitim-filmi", "mavi-vatan-gemi-insa"],
  },

  "tanitim-filmi": {
    description:
      "Kurumsal tanıtım filmi: fabrika, kurum ve marka için senaryo, çekim, kurgu. Web, fuar ve satış sunumu için; teslim genellikle 2–4 hafta. Ön görüşme ücretsiz.",
    summary:
      "Tanıtım filmi, bir işletmenin ne yaptığını ve neden güvenilir olduğunu tek videoda anlatır; web sitesinde, fuarda, satış sunumunda ve YouTube'da kullanılır. Rast Creative Studio mesajı ve izleyiciyi çekimden önce netleştirir, filmi senaryodan teslime kadar aynı ekiple üretir. Çekim çoğunlukla bir ya da iki gün, teslim genellikle 2–4 hafta sürer.",
    deliverables: [
      "Kapsama göre 1–3 dakikalık ana tanıtım filmi",
      "Sosyal medya için dikey kısa kesitler",
      "Fuar ekranı ve sunum için sessiz/altyazılı versiyon",
      "İsteğe bağlı: drone planları, röportaj, seslendirme metni",
    ],
    steps: [
      { t: "1 · Mesaj ve izleyici", d: "Filmi kim izleyecek (alıcı, yatırımcı, aday çalışan) ve izledikten sonra ne düşünmeli? Önce bunu netleştiririz." },
      { t: "2 · Senaryo ve çekim planı", d: "Sahneler, röportajlar ve çekilecek alanlar yazılı hale gelir; senaryoyu siz onaylarsınız." },
      { t: "3 · Çekim", d: "Genellikle bir ya da iki gün; üretim akışını ve iş güvenliği kurallarını aksatmadan planlanır." },
      { t: "4 · Kurgu, renk, revizyon", d: "İlk kurgu size gelir, geri bildirimle düzeltilir, tüm versiyonlar teslim edilir." },
    ],
    timeline:
      "Senaryo onayından teslime kadar, kapsama göre genellikle 2–4 hafta. Fuar ya da lansman tarihiniz varsa takvimi ona göre geriye doğru kurarız.",
    faqs: [
      {
        question: "Tanıtım filmi kaç dakika olmalı?",
        answer:
          "Kullanım yerine göre değişir. Web sitesi ve satış sunumu için çoğu zaman 1–3 dakika yeter; sosyal medyada aynı filmin 15–60 saniyelik kesitleri kullanılır. Süreyi izleyiciye ve mesaja göre birlikte belirleriz.",
      },
      {
        question: "Tanıtım filmi ile reklam filmi arasındaki fark nedir?",
        answer:
          "Tanıtım filmi kurumu ve güven veren tarafını anlatır, uzun süre kullanılır. Reklam filmi tek bir ürün ya da kampanya için izleyiciyi harekete geçirmeye odaklanır ve kısadır.",
      },
      {
        question: "Fabrikada çekim için üretimi durdurmak gerekir mi?",
        answer:
          "Genellikle hayır. Çekimi vardiya düzenine ve iş güvenliği kurallarına göre planlıyor, röportajları makine sesinden uzak bir alanda çekiyoruz.",
      },
      {
        question: "Tanıtım filmi fiyatı ne kadar?",
        answer:
          "Çekim günü sayısı, lokasyonlar, drone, röportaj ve kurgu kapsamına göre değişir. Fiyat için iletişime geçin; net teklifi ön görüşmeden sonra yazılı veriyoruz.",
      },
    ],
    links: [
      { href: "/blog/tanitim-filmi-cektirmeden-once/", label: "Tanıtım filmi çektirmeden önce bilmeniz gerekenler" },
      { href: "/blog/fabrika-tanitim-filmi-sanayi/", label: "Fabrikanızı en iyi anlatan film nasıl çekilir?" },
      { href: "/blog/kurumsal-reklam-marka-hikayesi-hangisi/", label: "Kurumsal film mi, reklam filmi mi, marka hikâyesi mi?" },
      { href: "/blog/sakarya-isletmem-icin-reels-mi-tanitim-filmi-mi/", label: "Reels mi, tanıtım filmi mi?" },
    ],
    categories: ["Kurumsal", "Marka Hikayesi"],
    projects: ["altoteks-tanitim-filmi", "canex-tanitim-filmi", "mavi-vatan-gemi-insa"],
  },

  "reklam-filmi": {
    description:
      "Reklam filmi: Instagram, YouTube ve Meta reklamları için fikir, senaryo, çekim ve kurgu. Aynı çekimden farklı süre ve oranlarda versiyonlar. Ön görüşme ücretsiz.",
    summary:
      "Reklam filmi tek bir işi yapar: izleyiciyi harekete geçirmek. Rast Creative Studio reklam filmlerini ilk saniyelerde dikkat çeken bir açılış, net bir teklif ve tek bir çağrı etrafında kurar; aynı çekimden Instagram, YouTube ve Meta reklamları için farklı süre ve oranlarda versiyonlar hazırlar. Böylece reklam yayındayken hangi versiyonun çalıştığını test edebilirsiniz.",
    deliverables: [
      "Ana reklam filmi",
      "6, 15 ve 30 saniye gibi farklı süre versiyonları",
      "Dikey (9:16), kare ve yatay oranlar",
      "Altyazılı versiyonlar (sessiz izlenen akışlar için)",
    ],
    steps: [
      { t: "1 · Hedef ve teklif", d: "Reklam neyi satıyor, kime ve hangi mecrada? Tek bir mesaj ve tek bir çağrı seçeriz." },
      { t: "2 · Fikir ve senaryo", d: "Açılış sahnesi, akış ve metin yazılır; çekimden önce onayınıza gelir." },
      { t: "3 · Çekim", d: "Ürün, mekân ve oyuncu planları çekim listesine göre tek günde toplanır." },
      { t: "4 · Versiyonlar ve teslim", d: "Ana film ve mecraya göre kısa versiyonlar, altyazılarıyla teslim edilir." },
    ],
    timeline:
      "Senaryo onayından sonra çekim ve kurgu, kapsama göre genellikle 2–4 hafta. Kampanya tarihiniz belliyse takvimi ona göre kurarız.",
    faqs: [
      {
        question: "Reklam filmi ne kadar uzun olmalı?",
        answer:
          "Sosyal medya reklamlarında genellikle 6–30 saniye. Ana mesaj ilk saniyelerde görünmeli; uzun versiyonu YouTube ve web için ayrıca hazırlayabiliriz.",
      },
      {
        question: "Reklam yönetimini de yapıyor musunuz?",
        answer:
          "Sosyal medya yönetimi aldığımız markalarda Meta reklamlarını da yönetiyoruz. Reklam bütçesi hizmet bedeline dahil değildir; Meta'ya doğrudan siz ödersiniz.",
      },
      {
        question: "Oyuncu ya da seslendirme gerekir mi?",
        answer:
          "Her zaman değil. Birçok reklam ürün, mekân ve ekran yazısıyla kurulabilir. Oyuncu veya seslendirme gerekiyorsa kapsama ayrı kalem olarak ekler, teklifte yazarız.",
      },
      {
        question: "Reklam filmi fiyatı nasıl belirlenir?",
        answer:
          "Senaryo, çekim günü, oyuncu, lokasyon ve versiyon sayısı belirler. Fiyat için iletişime geçin; teklifi ön görüşmeden sonra yazılı veriyoruz.",
      },
    ],
    links: [
      { href: "/blog/reklam-filmi-nedir/", label: "Reklam filmi nedir, nasıl yapılır?" },
      { href: "/blog/reklam-senaryosu-nasil-yazilir/", label: "Reklam senaryosu nedir, nasıl yazılır?" },
      { href: "/blog/reklam-filmi-neden-ise-yaramiyor/", label: "Reklam filminiz neden işe yaramıyor olabilir?" },
      { href: "/blog/etkili-meta-google-ads-reklami/", label: "Etkili Meta ve Google Ads reklamı nasıl kurulur?" },
    ],
    categories: ["Reklam", "Ürün", "Kurumsal"],
    projects: ["federal-reklam-filmi", "chint-power-milas-urun-tanitimi", "aytas-home-sinematik-magaza"],
  },

  "sosyal-medya-icerigi": {
    description:
      "Sosyal medya yönetimi: aylık plan, çekim günü, Reels kurgusu, paylaşım ve rapor. Video sayısı ve çekim günü teklifte yazılı. Sakarya merkezli, ön görüşme ücretsiz.",
    summary:
      "Rast Creative Studio'nun sosyal medya yönetimi video üzerine kuruludur: ayda kaç video çıkacağı ve kaç çekim günü yapılacağı teklifte yazılıdır. Ay başında plan, ayda bir ya da iki çekim günü, ay boyunca paylaşım ve ay sonunda kısa bir rapor. Aylık paketlerde en az üç ay çalışıyoruz; takipçi ya da satış garantisi vermiyoruz.",
    deliverables: [
      "Aylık içerik planı ve paylaşım takvimi",
      "Teklifte yazılı sayıda çekilip kurgulanmış Reels / dikey video",
      "Açıklama metinleri, kapaklar ve altyazılar",
      "Ay sonu raporu: erişim, etkileşim, profil ziyareti, gelen mesajlar",
      "İsteğe bağlı: Meta reklam yönetimi (bütçe ayrı)",
    ],
    steps: [
      { t: "Ay başı · Plan", d: "Kampanyalarınızı ve öne çıkacak ürün/hizmetleri konuşup ayın video konularını çıkarırız." },
      { t: "Çekim günü", d: "Ayda 4 video için yarım gün, 8 video için bir tam gün ya da iki yarım gün; işletmenizin sakin saatinde." },
      { t: "Ay boyu · Yayın", d: "Kurgulanan videolar ve gönderiler takvime göre paylaşılır; yayından önce onayınıza gelir." },
      { t: "Ay sonu · Rapor", d: "Kısa bir raporla neyin işlediğini gösterir, sonraki ayın planını buna göre düzenleriz." },
    ],
    timeline:
      "Anlaşmadan sonraki ilk ay plan ve ilk çekimle başlar. Düzenli içeriğin etkisi birkaç ayda görünür; bu yüzden en az üç ay çalışıyoruz.",
    faqs: [
      {
        question: "Sosyal medya yönetimi paketinde neler var?",
        answer:
          "İçerik planı, çekim, kurgu, açıklama metinleri, paylaşım takvimi ve aylık rapor. Video sayısı ve çekim günü teklifte yazılıdır. İsterseniz Meta reklam yönetimi de eklenir.",
      },
      {
        question: "Her hafta çekime mi geliyorsunuz?",
        answer:
          "Genellikle hayır. Ayın videolarını bir ya da iki planlı çekim gününde topluca çekip ay boyunca yayına alıyoruz; işletmenizin akışı bölünmez.",
      },
      {
        question: "Sosyal medya yönetimi fiyatı neye göre değişir?",
        answer:
          "Aylık video sayısı, çekim günü, reklam yönetimi olup olmadığı ve platform sayısı belirler. Fiyat için iletişime geçin; teklifi ön görüşmeden sonra yazılı veriyoruz.",
      },
      {
        question: "Hesabı kendim yönetsem, yalnızca video alabilir miyim?",
        answer:
          "Evet. Yalnızca çekim ve kurgu da alabilir, hesabı kendi ekibinizle yönetmeye devam edebilirsiniz.",
      },
    ],
    links: [
      { href: "/projeler/vaka/aytas-home/", label: "Aytaş Home vaka çalışması: 4 ayda etkileşim +%311" },
      { href: "/blog/sosyal-medya-yonetimi-fiyati-neye-gore-belirlenir/", label: "Sosyal medya yönetimi fiyatı neye göre belirlenir?" },
      { href: "/blog/video-cektirmek-degil-icerik-sistemi-kurmak/", label: "Video çektirmek değil, içerik sistemi kurmak" },
      { href: "/blog/sosyal-medya-videosu-neden-izlenmiyor-durust-bir-cevap/", label: "Sosyal medya videosu neden izlenmiyor?" },
      { href: "/blog/sosyal-medya-videosu-neden-dikey/", label: "Sosyal medya videosu neden dikey çekiliyor?" },
    ],
    categories: ["Sosyal Medya"],
    projects: ["aytas-home-sosyal-medya", "duru-optik-tanitim", "candles-and-echoes-golden-swan"],
  },

  "urun-mekan-cekimi": {
    description:
      "Ürün ve mekan çekimi: e-ticaret, katalog ve web için fotoğraf ve kısa video. Mağaza, showroom ve tesis çekimi; dikey ve yatay teslim. Ön görüşme ücretsiz.",
    summary:
      "Ürün ve mekân çekimi, e-ticaret sayfası, katalog, web sitesi ve sosyal medya için kullanılacak fotoğraf ve kısa videoları aynı üretim planında toplar. Rast Creative Studio çekilecek ürün listesini ve kullanım yerlerini çekimden önce netleştirir; mağaza, showroom ve tesis çekimlerini işletmenin sakin saatine planlar.",
    deliverables: [
      "Düzenlenmiş ürün fotoğrafları (web ve e-ticaret ölçülerinde)",
      "Ürünü kullanımda gösteren kısa videolar",
      "Mekân / showroom fotoğrafları ve tanıtım videosu",
      "Sosyal medya için dikey kesitler",
    ],
    steps: [
      { t: "1 · Ürün listesi", d: "Hangi ürünler, kaç açı, hangi platform ölçüleri? Listeyi birlikte çıkarırız." },
      { t: "2 · Çekim planı", d: "Işık düzeni, arka plan ve mekân ön görüşmede belirlenir." },
      { t: "3 · Çekim", d: "Fotoğraf ve video aynı gün çekilir; mağaza ve showroom çekimleri sakin saatlere konur." },
      { t: "4 · Düzenleme ve teslim", d: "Fotoğraflar düzenlenir, videolar kurgulanır, platforma uygun dosyalar teslim edilir." },
    ],
    timeline:
      "Ürün sayısına göre değişir. Teslim takvimini ürün listesi netleşince yazılı olarak veriyoruz.",
    faqs: [
      {
        question: "E-ticaret için fotoğraf mı, video mu çektirmeliyim?",
        answer:
          "İkisi farklı işler yapar: fotoğraf ürünü net gösterir, video kullanımını ve dokusunu anlatır. Çoğu marka için en verimlisi ikisini aynı çekim gününde almaktır.",
      },
      {
        question: "Mağazamı kapatmam gerekir mi?",
        answer:
          "Genellikle hayır. Çekimi sakin saatlere ya da açılış öncesine planlıyoruz.",
      },
      {
        question: "Sakarya dışındayım, ürün çekimi yaptırabilir miyim?",
        answer:
          "Yerinde çekimi Sakarya ve yakın illerde yapıyoruz. Daha uzaktaysanız elinizdeki ürün fotoğraflarından reklam videosu hazırlayabiliyoruz.",
      },
      {
        question: "Ürün çekimi fiyatı nasıl belirlenir?",
        answer:
          "Ürün sayısı, açı sayısı, video isteği ve düzenleme kapsamı belirler. Fiyat için iletişime geçin; teklifi ön görüşmeden sonra yazılı veriyoruz.",
      },
    ],
    links: [
      { href: "/blog/eticaret-urun-cekimi-foto-mu-video-mu/", label: "E-ticarette ürün çekimi: fotoğraf mı, video mu?" },
      { href: "/blog/urun-fotografi-cekimi-rehberi/", label: "Ürün fotoğrafı çekimi rehberi" },
      { href: "/blog/restoran-kafe-tanitim-videosu/", label: "Restoran ve kafeler için tanıtım videosu" },
      { href: "/fotograftan-yapay-zeka-reklam-videosu/", label: "Fotoğraftan reklam videosu (Türkiye geneli, uzaktan)" },
      { href: "/blog/fotograftan-reklam-videosu-mu-cekim-mi/", label: "Fotoğraftan reklam videosu mu, çekim mi?" },
    ],
    categories: ["Ürün", "Kurumsal", "Sosyal Medya"],
    projects: ["chint-power-milas-urun-tanitimi", "aytas-home-sinematik-magaza", "hornhauss-tanitim"],
  },
};

export const getServiceHub = (slug: string) => SERVICE_HUB[slug];
