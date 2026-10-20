/**
 * Regional locations for the programmatic [hizmet]/[konum] SEO pages.
 *
 * Scope = Sakarya core + neighbouring provinces (the studio's real service area).
 * Each location carries a city-specific `blurb` so the generated pages differ in
 * substance, plus `nearby` slugs that build a hub-and-spoke internal link graph.
 *
 * `loc` = the Turkish locative form used inside headings/sentences (e.g.
 * "Sakarya'da", "Kocaeli'nde"). Stored explicitly to avoid wrong suffixes.
 */

export interface SeoLocation {
  /** URL segment, e.g. "kocaeli". */
  slug: string;
  /** Display name, e.g. "Kocaeli". */
  name: string;
  /** Locative form, e.g. "Kocaeli'nde". */
  loc: string;
  /** Province this falls under, for grouping. */
  province: string;
  /** Whether this is part of the Sakarya core area. */
  core: boolean;
  /** Outside the same-day service area (Bolu, Bilecik): visits are planned
   *  per project, travel and stay are quoted. */
  projectBased?: boolean;
  /** City-specific paragraph (2 sentences) — keeps pages from being duplicates. */
  blurb: string;
  /** Nearby location slugs for internal linking. */
  nearby: string[];
}

export const SEO_LOCATIONS: readonly SeoLocation[] = [
  {
    slug: "sakarya",
    name: "Sakarya",
    loc: "Sakarya'da",
    province: "Sakarya",
    core: true,
    blurb:
      "Stüdyomuzun merkezi Serdivan'da; Sakarya'nın her ilçesine aynı gün ulaşıp çekim yapabiliyoruz. Adapazarı, Serdivan, Arifiye, Hendek ve Sapanca başta olmak üzere ilin sanayi tesislerini, mağazalarını, sağlık kuruluşlarını ve doğal dokusunu yakından tanıyoruz. Sakarya'da çekim izni, sahne akışı ve teslim takvimini baştan netleştirir; yerel ekip avantajıyla hem maliyeti hem de organizasyon yükünü azaltırız.",
    nearby: ["serdivan", "adapazari", "sapanca", "kocaeli"],
  },
  {
    slug: "serdivan",
    name: "Serdivan",
    loc: "Serdivan'da",
    province: "Sakarya",
    core: true,
    blurb:
      "Stüdyomuz Serdivan'da olduğu için burada kurulum süresi sıfıra yakın — randevudan kısa süre sonra sette oluruz. AVM, üniversite ve yeni iş merkezleriyle Serdivan markalar için canlı bir vitrin.",
    nearby: ["adapazari", "sakarya", "erenler", "sapanca"],
  },
  {
    slug: "adapazari",
    name: "Adapazarı",
    loc: "Adapazarı'nda",
    province: "Sakarya",
    core: true,
    blurb:
      "Sakarya'nın merkez ilçesi Adapazarı'nın ticaret ve sanayi yoğunluğunu iyi tanıyoruz. İşletme, mağaza ve fabrika çekimlerinde lojistik avantajımız sayesinde hızlı planlama yapıyoruz.",
    nearby: ["serdivan", "erenler", "sakarya", "hendek"],
  },
  {
    slug: "arifiye",
    name: "Arifiye",
    loc: "Arifiye'de",
    province: "Sakarya",
    core: true,
    blurb:
      "Arifiye, ulaşım aksları ve sanayi bağlantılarıyla kurumsal çekimler için güçlü bir merkez. Fabrika, showroom ve lojistik alan çekimlerinde Serdivan'dan hızlı kurulum yapabiliyoruz.",
    nearby: ["serdivan", "adapazari", "sapanca", "erenler"],
  },
  {
    slug: "erenler",
    name: "Erenler",
    loc: "Erenler'de",
    province: "Sakarya",
    core: true,
    blurb:
      "Erenler'in organize sanayi ve üretim tesisleri, kurumsal içerik üretimi için ideal. Serdivan'a komşu olduğu için tesis çekimlerine kısa bir kurulumla aynı gün başlayabiliyoruz.",
    nearby: ["adapazari", "serdivan", "hendek", "sakarya"],
  },
  {
    slug: "hendek",
    name: "Hendek",
    loc: "Hendek'te",
    province: "Sakarya",
    core: true,
    blurb:
      "Hendek'in sanayi bölgesi ve geniş üretim alanları, güçlü kurumsal içerikler için etkileyici bir zemin oluşturur. Serdivan'dan aynı gün ulaşıp tesis tanıtımlarını tek çekim gününde planlayabiliyoruz.",
    nearby: ["akyazi", "adapazari", "sapanca", "duzce"],
  },
  {
    slug: "akyazi",
    name: "Akyazı",
    loc: "Akyazı'da",
    province: "Sakarya",
    core: true,
    blurb:
      "Akyazı'nın termal tesisleri, doğası ve tarımsal işletmeleri görsel açıdan zengin bir çekim ortamı sunar. Termal tesis ve üretim tanıtımlarını gün ışığına göre planlıyoruz.",
    nearby: ["hendek", "adapazari", "sapanca", "sakarya"],
  },
  {
    slug: "sapanca",
    name: "Sapanca",
    loc: "Sapanca'da",
    province: "Sakarya",
    core: true,
    blurb:
      "Sapanca Gölü ve çevresindeki butik oteller, bungalovlar ve etkinlik mekanları için sinematik tanıtım üretiyoruz. Göl çevresindeki çekimleri doğal ışığın en iyi olduğu saatlere göre kuruyoruz.",
    nearby: ["serdivan", "sakarya", "adapazari", "kocaeli"],
  },
  {
    slug: "karasu",
    name: "Karasu",
    loc: "Karasu'da",
    province: "Sakarya",
    core: true,
    blurb:
      "Karasu sahil hattı, liman çevresi ve turizm işletmeleriyle çekim projelerinde görsel zenginliği yüksek planlar verir. Sezon içi çekimleri sahil trafiğine ve ışık saatlerine göre önceden planlıyoruz.",
    nearby: ["ferizli", "hendek", "adapazari", "duzce"],
  },
  {
    slug: "ferizli",
    name: "Ferizli",
    loc: "Ferizli'de",
    province: "Sakarya",
    core: true,
    blurb:
      "Ferizli'nin üretim ve sanayi hattı, tesis iletişimleri ve kurumsal prodüksiyonlar için düzenli planlanabilecek bir bölge. Sakarya merkezden kısa sürede ulaşıp küçük ve orta ölçekli işletmeler için ekonomik çekim günü kuruyoruz.",
    nearby: ["karasu", "hendek", "adapazari", "sakarya"],
  },
  {
    slug: "geyve",
    name: "Geyve",
    loc: "Geyve'de",
    province: "Sakarya",
    core: true,
    blurb:
      "Geyve'nin doğal dokusu, tarımsal üretim alanları ve yol manzaraları görsel projeler için güçlü bir arka plan oluşturur. Ürün, mekan ve turizm odaklı çekimlerde bölgenin atmosferinden yararlanıyoruz.",
    nearby: ["pamukova", "arifiye", "sapanca", "bilecik"],
  },
  {
    slug: "pamukova",
    name: "Pamukova",
    loc: "Pamukova'da",
    province: "Sakarya",
    core: true,
    blurb:
      "Pamukova, tarım, üretim ve açık alan çekimleri için geniş ve ferah sahneler sunar. Üretim ve marka odaklı projelerde gün ışığını doğru saatlerde planlayarak temiz görüntüler üretiyoruz.",
    nearby: ["geyve", "bilecik", "sapanca", "sakarya"],
  },
  {
    slug: "kocaeli",
    name: "Kocaeli",
    loc: "Kocaeli'nde",
    province: "Kocaeli",
    core: false,
    blurb:
      "Sakarya'ya komşu Kocaeli, yoğun sanayi ve lojistik yapısıyla kurumsal video talebinin yüksek olduğu bir il. İzmit ve Gebze hattındaki fabrikalara kısa sürede ulaşıyoruz.",
    nearby: ["izmit", "gebze", "sakarya", "sapanca"],
  },
  {
    slug: "izmit",
    name: "İzmit",
    loc: "İzmit'te",
    province: "Kocaeli",
    core: false,
    blurb:
      "Kocaeli'nin merkezi İzmit, körfez manzarası ve sanayi tesisleriyle tanıtım çekimleri için güçlü bir zemin. Sakarya'dan aynı gün ulaşabildiğimiz için kurumsal ve endüstriyel çekimler ek yol günü gerektirmez.",
    nearby: ["kocaeli", "gebze", "sakarya", "serdivan"],
  },
  {
    slug: "kartepe",
    name: "Kartepe",
    loc: "Kartepe'de",
    province: "Kocaeli",
    core: false,
    blurb:
      "Kartepe, turizm tesisleri, doğa rotaları ve Kocaeli sanayi hattına yakınlığıyla çok yönlü bir çekim bölgesi. Otel, etkinlik ve marka tanıtımlarında hem havadan hem yerden sinematik planlar kuruyoruz.",
    nearby: ["izmit", "basiskele", "sapanca", "sakarya"],
  },
  {
    slug: "basiskele",
    name: "Başiskele",
    loc: "Başiskele'de",
    province: "Kocaeli",
    core: false,
    blurb:
      "Başiskele, körfez çevresi ve gelişen ticari alanlarıyla kurumsal video ve sosyal medya içerikleri için uygun bir hat. Sakarya çıkışlı ekiple bölgeye proje bazlı çekim günü planlıyoruz.",
    nearby: ["izmit", "kartepe", "golcuk", "kocaeli"],
  },
  {
    slug: "golcuk",
    name: "Gölcük",
    loc: "Gölcük'te",
    province: "Kocaeli",
    core: false,
    blurb:
      "Gölcük, sanayi, denizcilik ve yerel işletme çekimleri için güçlü görsel çeşitlilik sunar. Kurumsal tanıtım ve sosyal medya üretimlerinde bölgenin sahil ve üretim karakterini birlikte değerlendiriyoruz.",
    nearby: ["basiskele", "izmit", "kartepe", "kocaeli"],
  },
  {
    slug: "gebze",
    name: "Gebze",
    loc: "Gebze'de",
    province: "Kocaeli",
    core: false,
    blurb:
      "Gebze'nin organize sanayi bölgeleri Türkiye'nin en yoğun üretim merkezlerinden. Sanayi odaklı prodüksiyon ve tesis projelerinde Sakarya'dan aynı gün ulaşıp çekim günü planlıyoruz.",
    nearby: ["izmit", "kocaeli", "sakarya", "serdivan"],
  },
  {
    slug: "darica",
    name: "Darıca",
    loc: "Darıca'da",
    province: "Kocaeli",
    core: false,
    blurb:
      "Darıca, Gebze hattına yakınlığı ve yoğun ticari dokusuyla marka ve sosyal medya içerikleri için hareketli bir çekim alanı. Kısa format videolarda işletmenin günlük akışını temiz ve anlaşılır bir dile çeviriyoruz.",
    nearby: ["gebze", "izmit", "kocaeli", "sakarya"],
  },
  {
    slug: "duzce",
    name: "Düzce",
    loc: "Düzce'de",
    province: "Düzce",
    core: false,
    blurb:
      "Düzce'nin üretim tesisleri ve doğal alanları, hem kurumsal hem turizm odaklı çekimlere ideal bir yapı oluşturuyor. Sakarya'dan kısa mesafede olduğu için ekonomik planlama yapıyoruz.",
    nearby: ["hendek", "akyazi", "bolu", "sakarya"],
  },
  {
    slug: "bolu",
    name: "Bolu",
    loc: "Bolu'da",
    province: "Bolu",
    core: false,
    projectBased: true,
    blurb:
      "Bolu'nun otelleri, yaylaları ve doğa turizmi görsel projeler için zengin bir sahne sunar. Bolu'daki çekimleri proje bazlı planlıyoruz; yol ve konaklama kapsamı teklifte netleşir.",
    nearby: ["duzce", "akyazi", "sakarya", "bilecik"],
  },
  {
    slug: "bilecik",
    name: "Bilecik",
    loc: "Bilecik'te",
    province: "Bilecik",
    core: false,
    projectBased: true,
    blurb:
      "Bilecik'in tarihi dokusu ve sanayi yatırımları, marka hikâyesi ve tanıtım için ilgi çekici bir kontrast yaratır. Bölgedeki işletmelere proje bazlı destek veriyoruz.",
    nearby: ["bolu", "sakarya", "adapazari", "duzce"],
  },
] as const;

export const getLocation = (slug: string) =>
  SEO_LOCATIONS.find((l) => l.slug === slug);


export const AREA_INDEX_LOCATION_SLUGS: readonly string[] = [
  "sakarya",
  "serdivan",
  "adapazari",
  "arifiye",
  "erenler",
  "sapanca",
  "akyazi",
  "hendek",
  "karasu",
  "ferizli",
  "geyve",
  "pamukova",
  "kocaeli",
  "izmit",
  "kartepe",
  "basiskele",
  "golcuk",
  "gebze",
  "darica",
  "duzce",
  "bolu",
  "bilecik",
] as const;
