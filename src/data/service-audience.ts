const DEFAULT_AUDIENCE = [
  "Markasını daha net anlatmak isteyen işletmeler",
  "Web, sosyal medya ve reklam için kullanıma hazır içerik arayan ekipler",
  "Çekimden teslimata kadar tek muhatapla ilerlemek isteyen markalar",
];

export const SERVICE_AUDIENCES: Record<string, string[]> = {
  "video-cekimi": [
    "Tanıtım, etkinlik veya sosyal medya için profesyonel video isteyen işletmeler",
    "Tek çekim gününden farklı formatlarda içerik çıkarmak isteyen markalar",
    "Kamera, ışık, ses ve kurgu sürecini tek elde toplamak isteyen ekipler",
  ],
  "drone-cekimi": [
    "Tesisini, sahasını veya lokasyonunu havadan göstermek isteyen markalar",
    "Tanıtım filmine ölçek ve hareket katmak isteyen kurumlar",
    "FPV ya da klasik drone görüntüsünü güvenli şekilde kullanmak isteyen ekipler",
  ],
  "tanitim-filmi": [
    "Kurumunu, üretim sürecini veya hizmet yapısını tek videoda anlatmak isteyen markalar",
    "Web sitesi, fuar ve satış sunumları için güçlü bir ana video arayan ekipler",
    "Kurumsal algısını daha profesyonel bir görsel dille güçlendirmek isteyen işletmeler",
  ],
  "reklam-filmi": [
    "Ürününü veya kampanyasını dikkat çekici bir fikirle duyurmak isteyen markalar",
    "Dijital reklam, YouTube ve sosyal medya için kısa ama güçlü video arayan ekipler",
    "Kreatif fikirden çekim ve kurguya kadar planlı ilerlemek isteyen işletmeler",
  ],
  "sosyal-medya-icerigi": [
    "Instagram, TikTok, YouTube Shorts ve Reels için düzenli içerik isteyen markalar",
    "Aylık içerik planını tek çekim günüyle verimli hale getirmek isteyen ekipler",
    "Dikey video, altyazı, kapak ve hızlı kurgu akışına ihtiyaç duyan işletmeler",
  ],
  "urun-mekan-cekimi": [
    "E-ticaret, katalog ve web sitesi için temiz ürün görselleri isteyen markalar",
    "Showroom, klinik, tesis veya mekanını profesyonel göstermek isteyen işletmeler",
    "Fotoğraf ve kısa video çıktısını aynı üretim planında almak isteyen ekipler",
  ],
};

export const getServiceAudience = (slug: string) =>
  SERVICE_AUDIENCES[slug] ?? DEFAULT_AUDIENCE;
