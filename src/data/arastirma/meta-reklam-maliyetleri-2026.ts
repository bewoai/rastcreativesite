/**
 * Data for /arastirma/meta-reklam-maliyetleri-2026/.
 *
 * Rule: every figure below was read from the linked page on the access date
 * (05.11.2026). Nothing is typed from memory. If a source changes, update the
 * figure or drop it. Rast's own numbers come from the Meta Ads API (read-only,
 * campaign level, 01–31.10.2026) and are published only as ranges/medians
 * across accounts — never a client name or a single account's total.
 * Raw pull + aggregation: vault 07-Research/2026-11-05-istatistik-sayfalari.md.
 */

export const UPDATED = "2026-11-05";
export const UPDATED_TR = "5 Kasım 2026";
export const ACCESSED = "05.11.2026";

/** TCMB indicative rate (döviz satış) used for our own USD→TL conversions. */
export const USD_TRY = 49.8644;
export const USD_TRY_DATE = "30.10.2026";

export type Source = {
  name: string;
  title: string;
  date: string; // publication / data date as shown by the source
  url: string;
};

export const SOURCES = {
  datareportal: {
    name: "DataReportal (Kepios, We Are Social, Meltwater)",
    title: "Digital 2026: Turkey",
    date: "Yayın: 2025 sonu · veri: Ekim 2025",
    url: "https://datareportal.com/reports/digital-2026-turkey",
  },
  deloitte: {
    name: "Deloitte, IAB Türkiye, RD, RVD, ARVAK, URYAD, MMA TR",
    title: "Türkiye’de Tahmini Medya ve Reklam Yatırımları 2024 Raporu",
    date: "Nisan 2025 · veri: 2024",
    url: "https://www.rvd.org.tr/haberler/T%C3%BCrkiye%202024%20Y%C4%B1l%C4%B1%20Tahmini%20Medya%20ve%20Reklam%20Yat%C4%B1r%C4%B1mlar%C4%B1%20A%C3%A7%C4%B1kland%C4%B1",
  },
  metaQ3: {
    name: "Meta Platforms",
    title: "Meta Reports Third Quarter 2026 Results",
    date: "21 Ekim 2026 · veri: 3. çeyrek 2026",
    url: "https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Third-Quarter-2026-Results/default.aspx",
  },
  adkitTR: {
    name: "AdKit Ad Benchmarks (Türkiye filtresi)",
    title: "Meta Ads benchmarks, Türkiye, Ekim 2026",
    date: "Ekim 2026 · 30+ reklamveren, 120+ kampanya",
    url: "https://adkit.so/benchmarks?country=TR&period=2026-10",
  },
  adkit: {
    name: "AdKit Ad Benchmarks (tüm ülkeler)",
    title: "Meta Ads benchmarks, Ekim 2026",
    date: "Ekim 2026 · 1.600+ reklamveren, 8.900+ kampanya",
    url: "https://adkit.so/benchmarks?period=2026-10",
  },
  localiq: {
    name: "LocaliQ / WordStream",
    title: "Facebook Advertising Benchmarks for 2026",
    date: "Güncelleme: 23 Eylül 2026",
    url: "https://localiq.com/blog/facebook-advertising-benchmarks",
  },
  adtribute: {
    name: "adtribute",
    title: "Facebook (Meta) Ads CPM Benchmark for DTC Brands",
    date: "Eylül 2026 · Avrupa DTC marka paneli",
    url: "https://www.adtribute.io/data/benchmarks/meta-ads-cpm",
  },
  metaLocation: {
    name: "Meta İşletme Yardım Merkezi",
    title: "About location fees for ads on Meta technologies",
    date: "Erişim 05.11.2026",
    url: "https://www.facebook.com/business/help/1238737454289085",
  },
  metaVat: {
    name: "Meta İşletme Yardım Merkezi",
    title: "Türkiye Katma Değer Vergisi (KDV) Hakkında",
    date: "Erişim 05.11.2026",
    url: "https://www.facebook.com/business/help/1020947424780313",
  },
  aaDst: {
    name: "Anadolu Ajansı",
    title: "Dijital hizmet vergisi oranı yeniden belirlendi",
    date: "25 Aralık 2025",
    url: "https://www.aa.com.tr/tr/ekonomi/dijital-hizmet-vergisi-orani-yeniden-belirlendi/3780348",
  },
  turmobKdv: {
    name: "TÜRMOB",
    title: "KDV oranları artırıldı (7346 sayılı Cumhurbaşkanı Kararı)",
    date: "7 Temmuz 2023",
    url: "https://www.turmob.org.tr/ekutuphane/Read/80868166-ffee-4934-8469-2e287fa42470",
  },
  tcmbTufe: {
    name: "TÜİK verisi, TCMB tablosu",
    title: "Tüketici Fiyatları (TÜFE)",
    date: "Ekim 2026",
    url: "https://www.tcmb.gov.tr/wps/wcm/connect/TR/TCMB+TR/Main+Menu/Istatistikler/Enflasyon+Verileri/Tuketici+Fiyatlari",
  },
  tcmbKur2026: {
    name: "TCMB",
    title: "Gösterge niteliğindeki döviz kurları, 30.10.2026",
    date: "30 Ekim 2026",
    url: "https://www.tcmb.gov.tr/kurlar/202610/30102026.xml",
  },
  tcmbKur2025: {
    name: "TCMB",
    title: "Gösterge niteliğindeki döviz kurları, 31.10.2025",
    date: "31 Ekim 2025",
    url: "https://www.tcmb.gov.tr/kurlar/202510/31102025.xml",
  },
  metaThruplay: {
    name: "Meta İşletme Yardım Merkezi",
    title: "About ThruPlay",
    date: "Erişim 05.11.2026",
    url: "https://www.facebook.com/business/help/2051461368219124",
  },
  metaMsg: {
    name: "Meta İşletme Yardım Merkezi",
    title: "Messaging conversations started",
    date: "Erişim 05.11.2026",
    url: "https://www.facebook.com/business/help/2038363993156008",
  },
} satisfies Record<string, Source>;

export type SourceKey = keyof typeof SOURCES;

export type Stat = {
  /** What is measured, in Turkish. */
  label: string;
  /** The figure as published (plus our TL conversion where marked). */
  value: string;
  /** Year / period the figure describes. */
  period: string;
  src: SourceKey;
};

const tl = (usd: number) =>
  `≈${(usd * USD_TRY).toLocaleString("tr-TR", { maximumFractionDigits: usd * USD_TRY < 20 ? 2 : 0 })} TL`;

/** Türkiye benchmarks (third party), Ekim 2026. */
export const TR_BENCH: Stat[] = [
  { label: "CPM (1.000 gösterim maliyeti), medyan", value: `2,64 $ (${tl(2.6374)})`, period: "Ekim 2026", src: "adkitTR" },
  { label: "CPM, reklamverenlerin ortadaki yarısı (25.–75. yüzdelik)", value: `1,20–4,33 $ (${tl(1.199)}–${tl(4.3277)})`, period: "Ekim 2026", src: "adkitTR" },
  { label: "CPC (tıklama başı maliyet), medyan", value: `0,087 $ (${tl(0.0865)})`, period: "Ekim 2026", src: "adkitTR" },
  { label: "CPC, 25.–75. yüzdelik", value: "0,037–0,172 $", period: "Ekim 2026", src: "adkitTR" },
  { label: "TO (tıklama oranı, tümü), medyan", value: "%2,27 (ortadaki yarı: %1,07–3,36)", period: "Ekim 2026", src: "adkitTR" },
  { label: "Giden (outbound) tıklama oranı, medyan", value: "%0,92", period: "Ekim 2026", src: "adkitTR" },
  { label: "Açılış sayfası görüntüleme başı maliyet, medyan", value: `0,20 $ (${tl(0.2042)})`, period: "Ekim 2026", src: "adkitTR" },
];

/** Global benchmarks, 2026. */
export const GLOBAL_BENCH: Stat[] = [
  { label: "CPM, medyan (tüm ülkeler)", value: "8,82 $ (ortadaki yarı: 3,15–19,44 $)", period: "Ekim 2026", src: "adkit" },
  { label: "CPM medyanı bir yılda", value: "7,22 $ (Kasım 2025) → 8,82 $ (Ekim 2026)", period: "Kas 2025–Eki 2026", src: "adkit" },
  { label: "CPC, medyan", value: "0,33 $ (ortadaki yarı: 0,13–0,74 $)", period: "Ekim 2026", src: "adkit" },
  { label: "TO (tümü), medyan", value: "%2,56 (ortadaki yarı: %1,68–3,97)", period: "Ekim 2026", src: "adkit" },
  { label: "Giden tıklama oranı, medyan", value: "%1,04", period: "Ekim 2026", src: "adkit" },
  { label: "Potansiyel müşteri (lead) başı maliyet, medyan", value: "23,08 $ (ortadaki yarı: 9,13–79,25 $)", period: "Ekim 2026", src: "adkit" },
  { label: "Trafik kampanyası ortalama TO", value: "%1,93 (bir önceki yıl %1,71)", period: "2026 raporu", src: "localiq" },
  { label: "Trafik kampanyası ortalama CPC", value: "0,60 $ (bir önceki yıl 0,70 $)", period: "2026 raporu", src: "localiq" },
  { label: "Lead kampanyası ortalama TO", value: "%2,70", period: "2026 raporu", src: "localiq" },
  { label: "Lead kampanyası ortalama CPC", value: "1,80 $", period: "2026 raporu", src: "localiq" },
  { label: "Lead kampanyası ortalama dönüşüm oranı", value: "%8,54", period: "2026 raporu", src: "localiq" },
  { label: "Lead başı ortalama maliyet", value: "27,39 $ (bir önceki yıl 27,66 $)", period: "2026 raporu", src: "localiq" },
  { label: "Mobilya sektörü: trafik TO / CPC", value: "%1,90 / 0,64 $", period: "2026 raporu", src: "localiq" },
  { label: "Mobilya sektörü: lead TO / dönüşüm / lead başı maliyet", value: "%3,78 / %5,66 / 39,25 $", period: "2026 raporu", src: "localiq" },
  { label: "Ev ve ev geliştirme sektörü: lead başı maliyet", value: "42,95 $", period: "2026 raporu", src: "localiq" },
  { label: "Avrupa DTC markaları CPM medyanı", value: "12,76 € (bir yıl önce 10,30 €, ≈%24 artış)", period: "Eylül 2026", src: "adtribute" },
  { label: "Avrupa DTC markaları CPM, ortadaki yarı", value: "9,19–16,56 €", period: "Eylül 2026", src: "adtribute" },
];

/** Meta platform-level context. */
export const META_STATS: Stat[] = [
  { label: "Meta reklam gösterimi, yıllık değişim", value: "+%10", period: "3. çeyrek 2026", src: "metaQ3" },
  { label: "Reklam başına ortalama fiyat, yıllık değişim", value: "+%14", period: "3. çeyrek 2026", src: "metaQ3" },
  { label: "Meta reklam geliri", value: "63,06 milyar $ (yıllık +%26)", period: "3. çeyrek 2026", src: "metaQ3" },
  { label: "Meta uygulamalarının günlük aktif kişi sayısı (DAP)", value: "3,64 milyar (yıllık +%3)", period: "Eylül 2026 ortalaması", src: "metaQ3" },
];

/** Turkey audience (DataReportal). */
export const AUDIENCE: Stat[] = [
  { label: "Türkiye’de internet kullanıcısı", value: "77,5 milyon", period: "Ekim 2025", src: "datareportal" },
  { label: "Sosyal medya kullanıcı kimliği", value: "62,3 milyon (nüfusun %70,9’u)", period: "Ekim 2025", src: "datareportal" },
  { label: "Instagram reklam erişimi", value: "62,3 milyon (nüfusun %70,9’u)", period: "2025 sonu", src: "datareportal" },
  { label: "Instagram reklam erişimi, 18 yaş üstü yetişkinlere oranı", value: "%92,1", period: "2025 sonu", src: "datareportal" },
  { label: "Instagram reklam erişimi, internet kullanıcılarına oranı", value: "%80,4", period: "2025 sonu", src: "datareportal" },
  { label: "Instagram reklam erişimi, yıllık değişim", value: "+5,8 milyon (+%10,3)", period: "Eki 2024–Eki 2025", src: "datareportal" },
  { label: "Instagram yetişkin reklam kitlesi, kadın / erkek", value: "%46,5 / %53,5", period: "2025 sonu", src: "datareportal" },
  { label: "Facebook reklam erişimi", value: "34,7 milyon (nüfusun %39,5’i)", period: "2025 sonu", src: "datareportal" },
  { label: "Facebook reklam erişimi, yıllık değişim", value: "+350 bin (+%1,0)", period: "Eki 2024–Eki 2025", src: "datareportal" },
  { label: "Facebook reklam erişimi, üç aylık değişim", value: "−450 bin (−%1,3)", period: "Tem–Eki 2025", src: "datareportal" },
  { label: "Facebook yetişkin reklam kitlesi, kadın / erkek", value: "%34,2 / %64,4", period: "2025 sonu", src: "datareportal" },
];

/** Turkey ad market (Deloitte report for IAB TR and partners). */
export const MARKET: Stat[] = [
  { label: "Toplam medya ve reklam yatırımı", value: "253,6 milyar TL (yıllık +%78,9)", period: "2024", src: "deloitte" },
  { label: "Medya yatırımları", value: "213 milyar TL", period: "2024", src: "deloitte" },
  { label: "Dijitalin medya yatırımlarındaki payı", value: "%74,2 (158 milyar TL’nin üzeri)", period: "2024", src: "deloitte" },
  { label: "Dijital yatırımların yıllık büyümesi", value: "+%83", period: "2024", src: "deloitte" },
  { label: "Sosyal medya reklamlarının dijital içindeki payı", value: "%47,08", period: "2024", src: "deloitte" },
  { label: "Dijital reklamların mobilde yapılan kısmı", value: "%79,4", period: "2024", src: "deloitte" },
  { label: "Influencer kampanyalarının toplam hacmi", value: "6,75 milyar TL", period: "2024", src: "deloitte" },
  { label: "Televizyon yatırımları (karşılaştırma için)", value: "38,86 milyar TL (payı %18,3)", period: "2024", src: "deloitte" },
];

/** Tax, fees and currency. */
export const TAX_FX: Stat[] = [
  { label: "Meta’nın Türkiye’ye gösterilen reklamlara eklediği konum ücreti (DST karşılığı)", value: "%5", period: "Kasım 2026’daki liste", src: "metaLocation" },
  { label: "Diğer ülkelerde aynı ücret (karşılaştırma)", value: "Avusturya %5 · Fransa, İtalya, İspanya %3 · Birleşik Krallık %2", period: "Kasım 2026’daki liste", src: "metaLocation" },
  { label: "Türkiye dijital hizmet vergisi oranı", value: "%5 (1 Ocak 2026’dan), %2,5 (1 Ocak 2027’den)", period: "2026–2027", src: "aaDst" },
  { label: "Meta Ireland’ın Türkiye’de KDV mükellefi olarak kayıtlı olduğu tarih", value: "1 Nisan 2019’dan beri", period: "2019–", src: "metaVat" },
  { label: "Genel KDV oranı", value: "%20 (10 Temmuz 2023’ten beri, önce %18)", period: "2023–", src: "turmobKdv" },
  { label: "TÜFE, yıllık", value: "%29,77", period: "Ekim 2026", src: "tcmbTufe" },
  { label: "TÜFE, aylık", value: "%2,58", period: "Ekim 2026", src: "tcmbTufe" },
  { label: "ABD doları döviz satış kuru", value: "49,8644 TL", period: "30.10.2026", src: "tcmbKur2026" },
  { label: "ABD doları döviz satış kuru, bir yıl önce", value: "41,9677 TL (bir yılda ≈%18,8 artış, bizim hesabımız)", period: "31.10.2025", src: "tcmbKur2025" },
];

/** Metric definitions from Meta (also counted: they carry numbers). */
export const DEFINITIONS: Stat[] = [
  { label: "ThruPlay sayılma koşulu", value: "6 sn ya da 15 sn izleme (video daha kısaysa %97’si)", period: "2026", src: "metaThruplay" },
  { label: "“Başlatılan mesajlaşma konuşması” sayılma koşulu", value: "İlk mesaj ya da en az 7 gün sessizlikten sonraki mesaj", period: "2026", src: "metaMsg" },
];

/**
 * Rast Creative-managed accounts, October 2026 (Meta Ads API, campaign level).
 * n = 3 ad accounts (Rast's own + 2 client accounts; no health client),
 * 19 campaigns with spend. Ranges are min–max across campaigns; "havuz" =
 * total spend / total results within that goal. Single-account goals (lead
 * form, link-click) are left out of the goal table.
 */
export const OWN = {
  period: "1–31 Ekim 2026",
  accounts: 3,
  campaigns: 19,
  spendApprox: "≈56 bin TL",
  impressionsApprox: "≈1,09 milyon",
  rows: [
    {
      goal: "Video izlenme (ThruPlay)",
      n: "4 kampanya · 2 hesap",
      result: "ThruPlay başı 0,02–0,19 TL (havuz 0,04 TL)",
      cpm: "13,38–41,15 TL (havuz 16,51 TL)",
      ctr: "%0,10–1,72",
      note: "Gösterimlerin %46’sı ThruPlay’e dönüştü.",
    },
    {
      goal: "Instagram profil ziyareti",
      n: "10 kampanya · 2 hesap",
      result: "Profil ziyareti başı 0,49–3,66 TL (medyan 2,13 TL, havuz 0,84 TL)",
      cpm: "41,99–108,95 TL (medyan 64,80 TL)",
      ctr: "%1,83–8,35 (medyan %3,66)",
      note: "Aynı hedefte en pahalı ziyaret, en ucuzunun 7 katından fazlaydı: kreatif ve kitle farkı fiyatı belirliyor.",
    },
    {
      goal: "Mesaj (Instagram DM / Messenger)",
      n: "3 kampanya · 2 hesap · 116 konuşma",
      result: "Başlatılan konuşma başı 76–211 TL (havuz 78 TL)",
      cpm: "148,75–171,22 TL",
      ctr: "%1,85–2,81",
      note: "Örnek küçük; tek bir kampanya konuşmaların çoğunu getirdi. Aralık olarak okuyun.",
    },
  ],
  overall: [
    { label: "CPM, 19 kampanyanın medyanı", value: "67,11 TL (ortadaki yarı: 41,99–108,95 TL)" },
    { label: "CPM, toplam harcama / toplam gösterim", value: "51,45 TL (≈1,03 $)" },
    { label: "TO (tümü), kampanya medyanı", value: "%2,62 (ortadaki yarı: %1,83–5,02)" },
    { label: "ThruPlay başı maliyet, 19 kampanyanın medyanı (hedef ne olursa olsun)", value: "0,61 TL" },
    { label: "Bağlantı tıklaması başı maliyet, kampanya medyanı (20’den fazla tıklama alanlar)", value: "2,45 TL" },
    { label: "Kampanya başına ortalama frekans", value: "1,27" },
    { label: "Meta’nın reklama atfettiği takip başı maliyet (havuz, 269 takip)", value: "≈208 TL" },
  ],
};

/** Every third-party stat on the page (used for the count and the CSV). */
export const ALL_STATS: Stat[] = [...TR_BENCH, ...GLOBAL_BENCH, ...META_STATS, ...AUDIENCE, ...MARKET, ...TAX_FX, ...DEFINITIONS];
