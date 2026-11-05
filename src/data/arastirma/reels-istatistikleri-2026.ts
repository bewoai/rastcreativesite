/**
 * Data for /arastirma/reels-istatistikleri-2026/.
 *
 * Rule: every third-party figure below was read from the linked page on the
 * access date (05.11.2026). Nothing is typed from memory; if a source changes,
 * update the figure or drop it. GWI figures come from the Digital 2026 Global
 * Overview Report PDF (page number in `note`).
 * Rast's own numbers:
 *  - paid: Meta Ads API, read-only, campaign level, 01–31.10.2026, 4 managed
 *    ad accounts / 19 campaigns, published only as pooled ranges/medians
 *    (no client name, no single account's figure, no health account);
 *  - organic: Rast's own @rastcreative Instagram account via Zernio analytics.
 * Raw pull + aggregation: vault 07-Research/2026-11-05-istatistik-sayfalari.md.
 */

export const UPDATED = "2026-11-05";
export const UPDATED_TR = "5 Kasım 2026";
export const ACCESSED = "05.11.2026";

export type Source = {
  name: string;
  title: string;
  date: string;
  url: string;
};

export const SOURCES = {
  drTR: {
    name: "DataReportal (Kepios, We Are Social, Meltwater)",
    title: "Digital 2026: Turkey",
    date: "8 Kasım 2025 · veri: Ekim 2025",
    url: "https://datareportal.com/reports/digital-2026-turkey",
  },
  gdr: {
    name: "We Are Social & Meltwater (veri: GWI)",
    title: "Digital 2026 Global Overview Report",
    date: "Ekim 2025 · anket: 2. çeyrek 2025",
    url: "https://wearesocial.com/wp-content/uploads/2025/10/GDR-2026.pdf",
  },
  meltwater: {
    name: "Meltwater & We Are Social",
    title: "Digital 2026 basın bülteni",
    date: "15 Ekim 2025",
    url: "https://www.meltwater.com/en/press-releases/digital-2026-internet-users-pass-6-billion-social-media-users-become-supermajority-and-ai-use-tops-1-billion",
  },
  tuikAA: {
    name: "TÜİK (aktaran: Anadolu Ajansı)",
    title: "Hanehalkı Bilişim Teknolojileri Kullanım Araştırması 2026",
    date: "5 Ağustos 2026",
    url: "https://www.aa.com.tr/tr/bilim-teknoloji/turkiyede-internet-kullananlarin-orani-bu-yil-yuzde-92-3e-yukseldi/4018733",
  },
  tuik12: {
    name: "TÜİK (aktaran: 12punto)",
    title: "Hanehalkı Bilişim Teknolojileri Kullanım Araştırması 2026",
    date: "Ağustos 2026",
    url: "https://12punto.com.tr/bilim-teknoloji/tuik-verileri-internet-aliskanliklarindaki-degisimi-gosterdi-podcast-yukseliste-video-hala-zirvede-147714",
  },
  rtuk: {
    name: "RTÜK",
    title: "Medyametre 2025: Medya Kullanım Alışkanlıkları Araştırması",
    date: "2026 · 20.202 katılımcı, 26 il",
    url: "https://www.rtuk.gov.tr/rtuk%E2%80%99un-medyametre-2025-arastirmasi-medya-kullanim-aliskanliklari-degisti/5217",
  },
  metaQ3: {
    name: "Meta Platforms",
    title: "Third Quarter 2026 Results Conference Call – Prepared Remarks",
    date: "21 Ekim 2026",
    url: "https://s21.q4cdn.com/399680738/files/content_files/META-Q3-2026-Prepared-Remarks.pdf",
  },
  cnbc3b: {
    name: "CNBC",
    title: "Instagram now has 3 billion monthly active users",
    date: "24 Eylül 2025",
    url: "https://www.cnbc.com/2025/09/24/instagram-now-has-3-billion-monthly-active-users.html",
  },
  cnbcSensor: {
    name: "CNBC (veri: Sensor Tower)",
    title: "Most of Instagram’s ads ran on Reels in 2025, data shows",
    date: "20 Ocak 2026",
    url: "https://www.cnbc.com/2026/01/20/most-of-instagrams-ads-ran-on-reels-in-2025-data-shows.html",
  },
  verge: {
    name: "The Verge",
    title: "Instagram Reels can be 3 minutes long now",
    date: "18 Ocak 2025",
    url: "https://theverge.com/2025/1/18/24346567/instagram-announces-reels-3-minute-video-posts",
  },
  metaDeck: {
    name: "Meta (IAB Ireland üzerinden yayımlanan sunum)",
    title: "Maximising Performance During Peak Season",
    date: "Ekim 2025",
    url: "https://iabireland.ie/wp-content/uploads/2025/10/Meta-Digital-Marketing-Tactics-for-Retailers-to-get-ahead-in-Q4.pdf",
  },
  siBench: {
    name: "Socialinsider",
    title: "2026 Instagram Organic Benchmarks",
    date: "20 Şubat 2026 · 579 bin marka hesabı, 67,5 milyon gönderi",
    url: "https://socialinsider.io/blog/instagram-benchmarks",
  },
  siReels: {
    name: "Socialinsider",
    title: "Instagram Reels Statistics For 2026",
    date: "Güncelleme: 21 Ekim 2026 · Ocak–Haziran 2026, 9,77 milyon Reels",
    url: "https://socialinsider.io/blog/instagram-reels-statistics",
  },
  siVideo: {
    name: "Socialinsider",
    title: "Social Media Video Statistics 2026",
    date: "2026 ilk yarısı · 570 bin marka hesabı, 23,6 milyon video",
    url: "https://socialinsider.io/social-media-benchmarks/social-media-video-statistics",
  },
  emplifi: {
    name: "Emplifi",
    title: "Q3 2025 Social Media Benchmarks (ABD markaları)",
    date: "15 Ekim 2025",
    url: "https://emplifi.io/resources/blog/q3-2025-social-media-benchmarks/",
  },
  sprout: {
    name: "Sprout Social",
    title: "Social media video statistics (Sprout Social 2026 Content Strategy Report)",
    date: "27 Şubat 2026",
    url: "https://sproutsocial.com/insights/social-media-video-statistics",
  },
  hootsuite: {
    name: "Hootsuite (Adam Mosseri’ye atıfla)",
    title: "Instagram algorithm tips for 2026",
    date: "Erişim 05.11.2026",
    url: "https://blog.hootsuite.com/instagram-algorithm/",
  },
  metaThruplay: {
    name: "Meta İşletme Yardım Merkezi",
    title: "About ThruPlay",
    date: "Erişim 05.11.2026",
    url: "https://www.facebook.com/business/help/2051461368219124",
  },
} satisfies Record<string, Source>;

export type SrcKey = keyof typeof SOURCES;
export type Stat = { label: string; value: string; period: string; src: SrcKey; note?: string };

/** Türkiye: who is online and on which platform. */
export const TR_USAGE: Stat[] = [
  { label: "İnternet kullanıcısı", value: "77,5 milyon (nüfusun %88,3’ü)", period: "Ekim 2025", src: "drTR" },
  { label: "Aktif sosyal medya kullanıcı kimliği", value: "62,3 milyon (nüfusun %70,9’u)", period: "Ekim 2025", src: "drTR" },
  { label: "Sosyal medya kullanıcı kimliklerindeki yıllık artış", value: "+4,8 milyon (+%8,3)", period: "2024 sonu → 2025 sonu", src: "drTR" },
  { label: "Instagram reklam erişimi", value: "62,3 milyon kişi", period: "2025 sonu", src: "drTR" },
  { label: "Instagram reklamlarının ulaşabildiği 18+ yetişkin oranı", value: "%92,1 (ölçülen ülkeler arasında 1. sıra)", period: "2025 sonu", src: "gdr", note: "s. 499 ve 501" },
  { label: "Instagram reklam erişimindeki yıllık artış", value: "+5,8 milyon (+%10,3)", period: "Ekim 2024 → Ekim 2025", src: "drTR" },
  { label: "Son bir ayda Instagram kullanan internet kullanıcısı (16+)", value: "%89,5 (56 ülke içinde 2. sıra; dünya %55,1)", period: "2. çeyrek 2025", src: "gdr", note: "s. 493" },
  { label: "TikTok reklam erişimi (18+)", value: "44,9 milyon (yetişkinlerin %68,6’sı)", period: "2025 sonu", src: "drTR" },
  { label: "YouTube reklam erişimi", value: "57,9 milyon", period: "2025 sonu", src: "drTR" },
  { label: "16–74 yaş internet kullanım oranı", value: "%92,3 (2025’te %90,9)", period: "2026", src: "tuikAA" },
  { label: "En çok kullanılan sosyal medya ve mesajlaşma uygulamaları", value: "WhatsApp %90 · YouTube %77,6 · Instagram %71,1", period: "2026", src: "tuikAA" },
  { label: "Medyan mobil indirme hızı", value: "68,19 Mbps (bir yılda +%47,1)", period: "Ağustos 2025", src: "drTR" },
];

/** Türkiye: how much video people watch. */
export const TR_VIDEO: Stat[] = [
  { label: "Haftalık kısa video (Reels, TikTok) izleme süresi", value: "8 sa 13 dk (dünya ortalaması 6 sa 39 dk)", period: "2. çeyrek 2025", src: "gdr", note: "s. 295" },
  { label: "Haftada kaç gün kısa video izleniyor?", value: "4,28 gün (dünya 4,15)", period: "2. çeyrek 2025", src: "gdr", note: "s. 293" },
  { label: "Haftalık çevrim içi video izleme süresi (her uzunluk)", value: "15 sa 07 dk (56 ülke içinde 8. sıra; dünya 11 sa 30 dk)", period: "2. çeyrek 2025", src: "gdr", note: "s. 289" },
  { label: "Her hafta çevrim içi video izleyen internet kullanıcısı", value: "%96,7 (dünya %94,6)", period: "2. çeyrek 2025", src: "gdr", note: "s. 287" },
  { label: "Haftalık uzun video (nasıl yapılır, vlog) izleme süresi", value: "6 sa 54 dk (dünya 4 sa 51 dk)", period: "2. çeyrek 2025", src: "gdr", note: "s. 299" },
  { label: "Sosyal medya + kısa videoya haftada ayrılan süre", value: "18 sa 10 dk (dünya 13 sa 45 dk)", period: "2. çeyrek 2025", src: "gdr", note: "s. 406" },
  { label: "YouTube, Instagram, TikTok gibi servislerden video izleyen internet kullanıcısı", value: "%83,4 (2024’te %80,0)", period: "2026", src: "tuik12" },
  { label: "Günlük sosyal medya süresi", value: "3 sa 7 dk (internet toplamı 4 sa 5 dk)", period: "2025", src: "rtuk" },
  { label: "Cep telefonundan tüketilen sosyal medya içeriği payı", value: "%99,5", period: "2025", src: "rtuk" },
  { label: "Medya kullanırken zamanın geçtiğini fark etmeyenler", value: "%28,1", period: "2025", src: "rtuk" },
];

/** Türkiye: social video and brands. */
export const TR_BRANDS: Stat[] = [
  { label: "Markaları öğrenmek ve içeriklerini görmek için sosyal medyaya giren kullanıcı", value: "%55,9 (dünya %50,4)", period: "2. çeyrek 2025", src: "gdr", note: "s. 428" },
  { label: "Yeni markaları sosyal medya reklamlarından keşfeden internet kullanıcısı", value: "%37,2 (dünya %30,4)", period: "2. çeyrek 2025", src: "gdr", note: "s. 626" },
  { label: "Almayı düşündüğü markayı sosyal medyada araştıran internet kullanıcısı", value: "%73,7", period: "2. çeyrek 2025", src: "gdr", note: "s. 431" },
  { label: "Sosyal medyada influencer ya da uzman takip eden kullanıcı", value: "%11,4 (dünya %22,6)", period: "2. çeyrek 2025", src: "gdr", note: "s. 444" },
  { label: "Sosyal medya reklamlarının dijital reklam harcamasındaki payı (tahmin)", value: "%26,8 (dünya %32,1)", period: "2025", src: "gdr", note: "s. 662, kaynak Statista Market Insights" },
];

/** Global: Reels and Instagram, platform side. */
export const PLATFORM: Stat[] = [
  { label: "Instagram aylık aktif kullanıcı", value: "3 milyar", period: "Eylül 2025", src: "cnbc3b" },
  { label: "Meta uygulamalarını her gün kullanan kişi", value: "3,64 milyar", period: "3. çeyrek 2026", src: "metaQ3" },
  { label: "Önerilen Instagram Reels içinde 1 günden yeni olanların payı", value: "yaklaşık %45 (2. çeyreğe göre +11 puandan fazla)", period: "3. çeyrek 2026", src: "metaQ3" },
  { label: "3. çeyrekteki öneri güncellemelerinin Instagram Reels izleme süresine etkisi", value: "+%4’ün üzerinde", period: "3. çeyrek 2026", src: "metaQ3" },
  { label: "Instagram reklamlarının Reels’te yayınlanan payı", value: "yarıdan fazlası (2024’te %35)", period: "2025", src: "cnbcSensor" },
  { label: "ABD’de Instagram’da geçen sürenin Reels payı", value: "%46 (2024’te %37)", period: "2025", src: "cnbcSensor" },
  { label: "Instagram ve Facebook Reels yıllık gelir hızı", value: "50 milyar $ üzeri", period: "Ekim 2025", src: "cnbcSensor" },
  { label: "Reels’e yüklenebilen azami süre", value: "3 dakika (önceki sınır 90 saniye)", period: "Ocak 2025", src: "verge" },
];

/** Global: organic Reels benchmarks (brand accounts). */
export const BENCH: Stat[] = [
  { label: "Instagram marka hesaplarında ortalama etkileşim oranı (takipçiye göre)", value: "%0,48 (2024’te %0,50)", period: "2025", src: "siBench" },
  { label: "Format bazında etkileşim oranı", value: "Karusel %0,55 · Reels %0,52 · Görsel %0,37", period: "2025", src: "siBench" },
  { label: "Markaların aylık paylaşım sayısı", value: "8 Reels, 7 görsel, 5 karusel (Reels yıllık +%33)", period: "2025", src: "siBench" },
  { label: "1–5 bin takipçili hesaplarda Reels erişim oranı (erişim/takipçi)", value: "%9,78 (karusel %8,80, görsel %7,00)", period: "Ocak–Haziran 2026", src: "siReels" },
  { label: "Reels’in en yüksek erişim aldığı hesap büyüklüğü", value: "50 bin takipçinin altı; üstünde karusel öne geçiyor", period: "Ocak–Haziran 2026", src: "siReels" },
  { label: "Süreye göre Reels erişim oranı", value: "30–60 sn %5,60 en yüksek · 120 sn üstü %3,50", period: "Ocak–Haziran 2026", src: "siReels" },
  { label: "Reels atlanma oranı (ilk 3 saniyede kaydıranlar)", value: "%65,5 (1–5 bin takipçi) → %60,5 (100 bin–1 milyon)", period: "Ocak–Haziran 2026", src: "siReels" },
  { label: "Reels etkileşim oranı en yüksek sektör", value: "Otel ve konaklama %0,38", period: "Ocak–Haziran 2026", src: "siReels" },
  { label: "100 bin–1 milyon takipçili markalarda ortalama video izlenmesi", value: "Instagram Reels 31.076 · TikTok 22.700 · Facebook Reels 6.500", period: "2026 ilk yarısı", src: "siVideo" },
  { label: "Instagram Reels etkileşim oranı aralığı (takipçiye göre)", value: "%0,40–0,80 (TikTok izlenmeye göre %4,40–5,25)", period: "2026 ilk yarısı", src: "siVideo" },
  { label: "Instagram’da en çok kısa videoyla (60 sn altı) etkileşime girmeyi seçen kullanıcı", value: "%52 (60 sn üstü uzun video: %19)", period: "2026", src: "sprout" },
];

/** Global: Reels as an ad placement. */
export const ADS: Stat[] = [
  { label: "9:16, sesli, güvenli alana uygun Reels reklamında edinme başı maliyet (CPA), görsel reklama göre", value: "%34,5 daha düşük", period: "Meta meta-analizi, 15 bölünmüş test (yayın Ekim 2025)", src: "metaDeck" },
  { label: "Aynı reklamın 9:16 olmayan, sessiz videoya göre farkı", value: "%15 daha düşük CPA (Meta’ya göre yönsel sonuç, %70 güven)", period: "Meta meta-analizi, 15 bölünmüş test (yayın Ekim 2025)", src: "metaDeck" },
  { label: "Reels kreatif esaslarına uyan kampanyaların Reels yerleşiminde gösterimi", value: "2 kat", period: "yayın Ekim 2025", src: "metaDeck" },
  { label: "Sesi açık izlenen Instagram Reels oynatmaları", value: "%75", period: "yayın Ekim 2025", src: "metaDeck" },
  { label: "Reels reklamlarında tıklama oranı (ABD markaları)", value: "%1,30 (Facebook akışında %2,23)", period: "3. çeyrek 2025", src: "emplifi" },
];

export const ALL_STATS: Stat[] = [...TR_USAGE, ...TR_VIDEO, ...TR_BRANDS, ...PLATFORM, ...BENCH, ...ADS];

/** Rast Creative's own data (aggregated; see header). */
export const OWN_PAID = {
  period: "1–31 Ekim 2026",
  accounts: 4,
  campaigns: 19,
  impressionsApprox: "yaklaşık 1,09 milyon",
  thruplaysApprox: "yaklaşık 273 bin",
  rows: [
    {
      goal: "Video izlenme (ThruPlay) hedefli",
      n: "4 kampanya, 2 hesap",
      thruCost: "0,02–0,19 TL (medyan 0,04)",
      cpm: "13–41 TL (medyan 16)",
      thruRate: "%22–76 (medyan %42)",
      p25: "medyan %80",
      p100: "medyan %40",
    },
    {
      goal: "Diğer hedefler (profil ziyareti, trafik, mesaj, form)",
      n: "15 kampanya, 4 hesap",
      thruCost: "0,16–15,87 TL (medyan 2,01)",
      cpm: "42–539 TL (medyan 69)",
      thruRate: "%1–42 (medyan %9)",
      p25: "medyan %21",
      p100: "medyan %3",
    },
  ],
};

export const OWN_ORGANIC = {
  period: "24 Ağustos – 2 Kasım 2026",
  reels: 18,
  followersAtPeak: "390",
  followersNow: "458",
  medianViews: "1.960",
  peakViews: "87.754",
  peakReach: "66.332",
  peakRatio: "yaklaşık 225 kat",
  peakShares: "1.239",
  peakSaves: "1.018",
  peakSharesPer1k: "14,1",
  othersSharesPer1k: "1,6",
  peakSavesPer1k: "11,6",
  othersSavesPer1k: "1,8",
  peakSkip: "%54,2",
  medianSkip: "%53 (aralık %35–83)",
  peakAvgWatch: "11,9 sn (30 sn’lik video)",
  medianAvgWatch: "6,8 sn",
  aboveFollowers: "16",
  peakShareOfTotal: "%74",
};
