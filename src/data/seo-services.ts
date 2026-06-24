/**
 * Local-SEO service definitions for the programmatic [hizmet]/[konum] pages.
 *
 * Each entry carries genuinely distinct copy (intro + benefits + a service-specific
 * FAQ angle) so the generated city pages are not near-duplicate "doorway" pages.
 * Combined with the per-city `blurb` in locations.ts, every page reads uniquely.
 */

export interface SeoServiceBenefit {
  title: string;
  text: string;
}

export interface SeoService {
  /** URL segment, e.g. "drone-cekimi". */
  slug: string;
  /** Display name, e.g. "Drone Çekimi". */
  name: string;
  /** One-line tagline shown under the H1. */
  tagline: string;
  /** Service-unique opening paragraph (city name is appended in the page). */
  intro: string;
  /** Three distinct value points. */
  benefits: SeoServiceBenefit[];
  /** Keywords for meta / knowsAbout. */
  keywords: string[];
}

export const SEO_SERVICES: readonly SeoService[] = [
  {
    slug: "video-cekimi",
    name: "Video Çekimi",
    tagline: "Markanız için profesyonel çekim, kurgu ve teslim",
    intro:
      "Video çekimi, bir işletmenin kendini dijitalde en hızlı ve en güçlü anlatma yollarından biridir. Rast Creative Studio olarak tanıtım filmi, sosyal medya videosu, etkinlik kaydı, ürün ve kurumsal video ihtiyaçlarını tek bir çekim planında toplarız; senaryo, kamera, ışık, ses, kurgu ve renk düzenleme süreçlerini baştan sona aynı ekip yürütür. Çekimi yalnızca güzel görüntü almak için değil, markanın web sitesinde, sosyal medyasında ve reklamlarında gerçekten kullanabileceği bir içerik havuzu oluşturmak için planlarız; böylece aynı prodüksiyondan yatay ana film, dikey Reels/Shorts ve kısa reklam kurguları birlikte çıkar.",
    benefits: [
      {
        title: "İhtiyaca göre çekim planı",
        text: "Tanıtım filmi, sosyal medya videosu, ürün videosu veya etkinlik kaydı için ayrı akış kurar; çekim gününü markanın hedefiyle eşleştiririz.",
      },
      {
        title: "Profesyonel ekipman ve ekip",
        text: "Sinema kamerası, ışık, ses, gimbal ve gerektiğinde drone desteğiyle temiz, güvenilir ve yayına hazır görüntüler üretiriz.",
      },
      {
        title: "Sosyal medya ve web için teslim",
        text: "Aynı çekimden yatay, dikey ve kısa format kurgular çıkararak web sitesi, Instagram, YouTube ve reklam kampanyalarına uygun dosyalar teslim ederiz.",
      },
    ],
    keywords: [
      "video çekimi",
      "profesyonel video çekimi",
      "kurumsal video çekimi",
      "sosyal medya video çekimi",
      "etkinlik video çekimi",
    ],
  },
  {
    slug: "drone-cekimi",
    name: "Drone Çekimi",
    tagline: "Havadan sinematik görüntüler ve FPV hareketleri",
    intro:
      "Tesisinizi, sahanızı ya da etkinliğinizi havadan gösteren görüntüler, markanıza ölçek ve prestij katar. Lisanslı pilotlarımız ve sinema kararındaki drone'larımızla 4K ve RAW formatında, stabilize ve renk düzenlenmiş kareler üretiyoruz.",
    benefits: [
      {
        title: "FPV ve klasik drone bir arada",
        text: "Geniş, sakin yörünge çekimlerinden nefes kesen FPV dalışlarına kadar her ihtiyaca uygun hava planı.",
      },
      {
        title: "Mevzuata uygun, sigortalı uçuş",
        text: "SHGM kurallarına uygun, izinli alanlarda güvenli operasyon — kayıt ve pilot belgeleriyle.",
      },
      {
        title: "Teslime hazır renk",
        text: "Çekim sonrası color grading ile görüntüler doğrudan reklam veya tanıtımda kullanılabilir gelir.",
      },
    ],
    keywords: ["drone çekimi", "havadan çekim", "fpv drone", "hava fotoğrafçılığı"],
  },
  {
    slug: "tanitim-filmi",
    name: "Tanıtım Filmi",
    tagline: "Kurumunuzu anlatan, akılda kalan kısa film",
    intro:
      "İyi bir tanıtım filmi, müşteriniz sizi tanımadan önce markanızı hissettirir. Senaryodan kurguya tek elden çalışır; tesisinizi, ekibinizi ve üretim sürecinizi sinematik bir anlatıya dönüştürürüz.",
    benefits: [
      {
        title: "Senaryo + kurgu tek elden",
        text: "Mesajınızı netleştiren senaryo, profesyonel seslendirme ve ritmi yüksek kurgu birlikte planlanır.",
      },
      {
        title: "Her platform için doğru süre",
        text: "Web sitesi, fuar ve sosyal medya için 30 sn'den 3 dk'ya farklı kurgular aynı çekimden çıkar.",
      },
      {
        title: "Çok dilli seçenek",
        text: "İhracat ve yurt dışı sunumlar için altyazı ve seslendirme ile çok dilli versiyonlar.",
      },
    ],
    keywords: ["tanıtım filmi", "kurumsal film", "fabrika tanıtım", "şirket tanıtım videosu"],
  },
  {
    slug: "reklam-filmi",
    name: "Reklam Filmi",
    tagline: "Satışa dönüşen kreatif reklam prodüksiyonu",
    intro:
      "Reklam filmi, bir ürünü değil bir hissi satar. Kreatif fikir, oyuncu yönetimi ve sinema standardında görüntüyle, dijital ve TV mecralarında dikkat çeken reklamlar üretiyoruz.",
    benefits: [
      {
        title: "Kreatif konsept geliştirme",
        text: "Hedef kitleye göre kurgulanan fikir ve storyboard ile çekime net bir planla başlanır.",
      },
      {
        title: "Sinema kararında görüntü",
        text: "Sinema kamera ve ışık ekipmanıyla, markanızı premium gösteren bir görsel dil.",
      },
      {
        title: "Mecraya özel kurgular",
        text: "Aynı çekimden Instagram Reels, YouTube ön-reklam ve TV spotu çıkacak şekilde planlama.",
      },
    ],
    keywords: ["reklam filmi", "reklam çekimi", "tv reklamı", "dijital reklam videosu"],
  },
  {
    slug: "sosyal-medya-icerigi",
    name: "Sosyal Medya İçeriği",
    tagline: "Reels, Shorts ve dikey video üretimi",
    intro:
      "Sosyal medyada düzenli ve kaliteli içerik, takipçiyi müşteriye çevirir. Markanız için aylık içerik planı kurar; dikey video, Reels ve Shorts'u çekimden paylaşıma hazır teslim ederiz.",
    benefits: [
      {
        title: "Aylık içerik planı",
        text: "Tek çekim gününde haftalarca yetecek dikey video ve fotoğraf bankası oluşturulur.",
      },
      {
        title: "Platforma özgü kurgu",
        text: "Reels, Shorts ve TikTok'un ritmine uygun, ilk 3 saniyede tutan kurgular.",
      },
      {
        title: "Akış halinde teslim",
        text: "Altyazı, kapak ve formatıyla paylaşıma hazır; sadece yükleyip yayınlarsınız.",
      },
    ],
    keywords: ["sosyal medya içeriği", "reels çekimi", "dikey video", "shorts üretimi"],
  },
  {
    slug: "urun-mekan-cekimi",
    name: "Ürün & Mekan Çekimi",
    tagline: "Ürün, katalog ve iç-dış mekan fotoğrafı",
    intro:
      "Online satışta ve sunumlarda fark, görselin kalitesinden başlar. Ürünlerinizi stüdyo ışığında, mekanlarınızı ise doğru kompozisyonla; e-ticaret, katalog ve web sitesi için temiz ve tutarlı görsellere çeviririz.",
    benefits: [
      {
        title: "E-ticaret standardı",
        text: "Beyaz fon, tutarlı ışık ve doğru renk ile pazaryeri kurallarına uygun ürün görselleri.",
      },
      {
        title: "İç ve dış mekan",
        text: "Showroom, tesis ve işletmeleriniz için davetkâr, mimariyi öne çıkaran çekim.",
      },
      {
        title: "Video ile birlikte",
        text: "Aynı sette ürün videosu ve 360° döndürme görüntüleri de alınabilir.",
      },
    ],
    keywords: ["ürün çekimi", "ürün fotoğrafçılığı", "mekan çekimi", "katalog çekimi"],
  },
] as const;

export const getService = (slug: string) =>
  SEO_SERVICES.find((s) => s.slug === slug);
