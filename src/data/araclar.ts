/**
 * Free tools hub (/araclar/) — one entry per tool, guide, template, document or pack.
 * Feeds the gallery on /araclar/, the ItemList JSON-LD, the compact ToolHeader on
 * every tool page and the "Diğer ücretsiz araçlar" strip. A new tool = one entry here
 * + a card image in public/araclar/kartlar/<slug>.webp (scripts/araclar-kartlar/kartlar.py).
 */
export type AracTur = "arac" | "sablon" | "belge" | "paket" | "rehber";

export interface Arac {
  slug: string;
  href: string;
  /** Full, descriptive name (ItemList, alt text). */
  name: string;
  /** Short card title. */
  title: string;
  type: AracTur;
  /** 3–5 word benefit line. */
  benefit: string;
  /** One-line purpose under the H1 on the tool page. */
  purpose: string;
  chips: string[];
  /** Optional plain-words "what is it for" line on the card, for items whose
   *  name is jargon (bitrate, SRT, LUT…). Usability test: ~40 y/o visitors. */
  plain?: string;
  /** Card image base path without extension (default `/araclar/kartlar/<slug>`); English twins set
   *  their own capture with English sample text (`/araclar/kartlar/en/<slug>`, kartlar.py with KART_LANG=en). */
  card?: string;
  /** English twin (/en/tools/…): same tool component with lang="en". See src/lib/i18n.ts. */
  en?: Omit<Arac, "slug" | "type" | "en">;
}

export const TUR_LABEL_EN: Record<AracTur, string> = {
  arac: "Tool",
  sablon: "Template",
  belge: "Document",
  paket: "Pack",
  rehber: "Guide",
};

export const TUR_LABEL: Record<AracTur, string> = {
  arac: "Araç",
  sablon: "Şablon",
  belge: "Belge",
  paket: "Paket",
  rehber: "Rehber",
};

/** Filter tabs on /araclar/ (plural labels). */
export const TUR_FILTER: { id: AracTur; label: string }[] = [
  { id: "arac", label: "Araçlar" },
  { id: "sablon", label: "Şablonlar" },
  { id: "belge", label: "Belgeler" },
  { id: "paket", label: "Paketler" },
  { id: "rehber", label: "Rehber" },
];

export const ctaLabel = (t: AracTur) => (t === "arac" || t === "rehber" ? "Aç" : "İndir");
export const isDownload = (t: AracTur) => !(t === "arac" || t === "rehber");
export const ctaLabelFor = (t: AracTur, lang: "tr" | "en") =>
  lang === "en" ? (isDownload(t) ? "Download" : "Open") : ctaLabel(t);

export const ARACLAR: Arac[] = [
  {
    slug: "guvenli-alan",
    href: "/araclar/guvenli-alan/",
    name: "Reels / TikTok / Shorts güvenli alan kontrolü",
    title: "Güvenli alan kontrolü",
    type: "arac",
    benefit: "Yazınız arayüzün altında kalmasın",
    purpose: "Görselinizi bırakın; Reels, TikTok ve Shorts arayüzünün neyi kapattığını anında görün.",
    chips: ["Tarayıcıda çalışır", "Reels · TikTok · Shorts", "PNG + ZIP"],
    en: {
      href: "/en/tools/reels-safe-zone-checker/",
      card: "/araclar/kartlar/en/guvenli-alan",
      name: "Reels / TikTok / Shorts safe zone checker",
      title: "Safe zone checker",
      benefit: "Keep text clear of the app UI",
      purpose: "Drop an image or video and see exactly what the Reels, TikTok and Shorts interface covers.",
      chips: ["Runs in your browser", "Reels · TikTok · Shorts", "PNG + ZIP templates"],
    },
  },
  {
    slug: "bitrate-hesaplayici",
    href: "/araclar/bitrate-hesaplayici/",
    name: "Video bitrate ve dosya boyutu hesaplayıcı",
    title: "Bitrate hesaplayıcı",
    type: "arac",
    benefit: "Dosya boyutunu önceden bilin",
    purpose: "Süre ve bitrate'ten dosya boyutunu, hedef boyuttan bitrate'i saniyeler içinde hesaplayın.",
    chips: ["Tarayıcıda çalışır", "MB · GB · Mbps", "FFmpeg komutu"],
    plain: "Videonuz kaç MB olacak, WhatsApp'a ya da siteye sığar mı, önceden görün.",
    en: {
      href: "/en/tools/video-bitrate-calculator/",
      card: "/araclar/kartlar/en/bitrate-hesaplayici",
      name: "Video bitrate and file size calculator",
      title: "Video bitrate calculator",
      benefit: "Know the file size before you export",
      purpose: "Get file size from duration and bitrate, or the bitrate you need to hit a target size.",
      chips: ["Runs in your browser", "MB · GB · Mbps", "FFmpeg command"],
      plain: "See how big your video will be and whether it fits an upload limit, before you export.",
    },
  },
  {
    slug: "en-boy-orani",
    href: "/araclar/en-boy-orani/",
    name: "En-boy oranı ve kırpma önizleyici",
    title: "En-boy oranı ve kırpma",
    type: "arac",
    benefit: "Yatay kaydı dikeye taşıyın",
    purpose: "16:9 kaydınızın 9:16, 4:5, 1:1 ve 3:4'te nasıl kırpılacağını görün, kadrajı ayarlayın.",
    chips: ["Tarayıcıda çalışır", "9:16 · 4:5 · 1:1"],
    plain: "Yatay çektiğiniz videonun telefon ekranına (dikey) nasıl kırpılacağını gösterir.",
    en: {
      href: "/en/tools/aspect-ratio-calculator/",
      card: "/araclar/kartlar/en/en-boy-orani",
      name: "Aspect ratio calculator and crop previewer",
      title: "Aspect ratio & crop",
      benefit: "Reframe 16:9 for vertical",
      purpose: "See how a 16:9 shot crops to 9:16, 4:5, 1:1 and 3:4, and move the frame where you want it.",
      chips: ["Runs in your browser", "9:16 · 4:5 · 1:1"],
      plain: "Shows how a horizontal video gets cropped for a phone screen.",
    },
  },
  {
    slug: "altyazi-kontrolu",
    href: "/araclar/altyazi-kontrolu/",
    name: "Altyazı kontrolü (SRT / VTT)",
    title: "Altyazı kontrolü",
    type: "arac",
    benefit: "SRT hatalarını tek tıkta bulun",
    purpose: "Uzun satır, hızlı okuma, çakışma ve bozuk Türkçe karakterleri bulun; temiz SRT indirin.",
    chips: ["Tarayıcıda çalışır", "SRT · VTT"],
    plain: "Altyazı dosyanızdaki bozuk harfleri, çok uzun ve çok hızlı satırları bulup düzeltir.",
    en: {
      href: "/en/tools/srt-subtitle-checker/",
      card: "/araclar/kartlar/en/altyazi-kontrolu",
      name: "SRT / VTT subtitle checker",
      title: "SRT subtitle checker",
      benefit: "Find subtitle errors in one click",
      purpose: "Catch long lines, fast reading speed, overlaps and broken characters, then download a clean SRT.",
      chips: ["Runs in your browser", "SRT · VTT"],
      plain: "Finds garbled characters and lines that are too long or too fast in a subtitle file.",
    },
  },
  {
    slug: "webp-jpg-cevirici",
    href: "/araclar/webp-jpg-cevirici/",
    name: "WebP JPG çevirici (toplu resim dönüştürücü)",
    title: "WebP JPG çevirici",
    type: "arac",
    benefit: "WebP'yi tek tıkla JPG yapın",
    purpose: "WebP, AVIF, PNG ve JPG resimleri toplu olarak JPG, PNG ya da WebP'ye çevirin; ZIP indirin.",
    chips: ["Tarayıcıda çalışır", "WebP · AVIF · PNG → JPG", "ZIP"],
    plain: "Açılmayan .webp resimleri JPG ya da PNG'ye çevirir; dosyalar yüklenmez.",
    en: {
      href: "/en/tools/webp-to-jpg/",
      card: "/araclar/kartlar/en/webp-jpg-cevirici",
      name: "WebP to JPG converter (bulk image converter)",
      title: "WebP to JPG converter",
      benefit: "Turn WebP into JPG in one go",
      purpose: "Convert WebP, AVIF, PNG and JPG images to JPG, PNG or WebP in bulk, then download a ZIP.",
      chips: ["Runs in your browser", "WebP · AVIF · PNG → JPG", "ZIP"],
      plain: "Turns .webp images that won't open into JPG or PNG; nothing is uploaded.",
    },
  },
  {
    slug: "cekim-plani",
    href: "/araclar/cekim-plani/",
    name: "Çekim planı (call sheet) oluşturucu",
    title: "Çekim planı (call sheet)",
    type: "arac",
    benefit: "Ekibe tek sayfada plan",
    purpose: "Lokasyon, ekip ve saat programını girin; yazdırılabilir, markalı bir çekim planı alın.",
    chips: ["Tarayıcıda çalışır", "Yazdır · PDF · JSON"],
    plain: "Çekim günü kim, nerede, saat kaçta: ekibe gönderilecek tek sayfalık plan.",
  },
  {
    slug: "cekim-planlayici",
    href: "/cekim-planlayici/",
    name: "Çekim günü içerik planlayıcı",
    title: "Çekim günü planlayıcı",
    type: "arac",
    benefit: "Bir günden kaç içerik çıkar?",
    purpose: "Üç soruyu cevaplayın; tek çekim gününden çıkabilecek içerikleri ve hazırlık listesini görün.",
    chips: ["3 soru", "Tarayıcıda çalışır"],
  },
  {
    slug: "video-export-ayarlari",
    href: "/rehber/video-export-ayarlari/",
    name: "1080p ve 4K video export ayarları rehberi",
    title: "Video export ayarları",
    type: "rehber",
    benefit: "Platforma göre doğru ayar",
    purpose: "YouTube, Vimeo, Reels ve TikTok için 1080p ve 4K export ayarları tek sayfada.",
    chips: ["1080p · 4K", "PDF kopya kâğıdı"],
    plain: "Videoyu Instagram, YouTube veya TikTok için hangi ayarla kaydedeceğinizi gösterir.",
  },
  {
    slug: "instagram-grid-sablonu",
    href: "/araclar/instagram-grid-sablonu/",
    name: "Instagram profil ızgarası (3:4) şablonu",
    title: "Instagram grid şablonu",
    type: "sablon",
    benefit: "Kapak ızgarada kesilmesin",
    purpose: "Reels kapağınızın yeni 3:4 profil ızgarasında nasıl kırpıldığını görün, şablonları indirin.",
    chips: ["3:4 önizleme", "PNG + ZIP"],
  },
  {
    slug: "kapak-sablonlari",
    href: "/araclar/kapak-sablonlari/",
    name: "Reels kapağı ve YouTube küçük resim şablonları",
    title: "Kapak şablonları",
    type: "sablon",
    benefit: "Reels kapağı ve küçük resim",
    purpose: "Reels kapağı ve YouTube küçük resmi için güvenli alanlı şablonlar ve kapak kontrolü.",
    chips: ["PNG · SVG", "1080×1920 · 1280×720"],
  },
  {
    slug: "storyboard-sablonu",
    href: "/araclar/storyboard-sablonu/",
    name: "Storyboard ve çekim listesi şablonu",
    title: "Storyboard şablonu",
    type: "belge",
    benefit: "Çekimi kare kare planlayın",
    purpose: "16:9 ve 9:16 storyboard ile plan listesi; doldurulabilir PDF, Excel, Word ve Notion.",
    chips: ["PDF · Word · Excel", "16:9 · 9:16"],
    plain: "Videoyu çekmeden önce sahne sahne kâğıda dökmek için boş şablon.",
  },
  {
    slug: "brief-formu",
    href: "/araclar/brief-formu/",
    name: "Video brief formu",
    title: "Video brief formu",
    type: "belge",
    benefit: "Projeye net başlayın",
    purpose: "Amaç, hedef kitle, mesaj ve teslimatları üç sayfada toplayan doldurulabilir form.",
    chips: ["PDF · Word", "Doldurulabilir"],
  },
  {
    slug: "cekim-kontrol-listesi",
    href: "/araclar/cekim-kontrol-listesi/",
    name: "Çekim günü kontrol listesi",
    title: "Çekim kontrol listesi",
    type: "belge",
    benefit: "Sette hiçbir şey unutulmasın",
    purpose: "Kamera, ses, ışık, medya ve izinler için 47 maddelik çekim günü kontrol listesi.",
    chips: ["47 madde", "PDF · Word · Excel"],
  },
  {
    slug: "cekim-izin-formu",
    href: "/araclar/cekim-izin-formu/",
    name: "Görüntü ve ses kullanım izin formu (KVKK taslağı)",
    title: "Çekim izin formu",
    type: "belge",
    benefit: "Görüntü izni, KVKK taslağı",
    purpose: "Aydınlatma metni, açık rıza ve veli onayı bölümleriyle görüntü ve ses kullanım izni taslağı.",
    chips: ["PDF · Word", "Veli onayı dahil"],
  },
  {
    slug: "sfx-paketi",
    href: "/araclar/sfx-paketi/",
    name: "Rast SFX Pack Vol.1 (40 ses efekti)",
    title: "SFX Pack Vol.1",
    type: "paket",
    benefit: "Kurguya hazır 40 ses",
    purpose: "Whoosh, riser, impact, glitch ve geçiş sesleri; tarayıcıda dinleyin, tek tıkla indirin.",
    chips: ["40 ses · WAV", "Ticari kullanım serbest"],
    plain: "Videolarda geçişlerde ve vurgularda kullanılacak ücretsiz kısa sesler.",
    en: {
      href: "/en/tools/free-sound-effects-pack/",
      name: "Rast SFX Pack Vol.1 (40 free sound effects)",
      title: "Free SFX pack",
      benefit: "40 edit-ready sounds",
      purpose: "Whooshes, risers, impacts, glitches and transitions: preview in the browser, download in one click.",
      chips: ["40 sounds · WAV", "Commercial use OK"],
      plain: "Short free sounds for transitions and accents in your edits.",
    },
  },
  {
    slug: "lut-paketi",
    href: "/araclar/lut-paketi/",
    name: "Rast LUT Pack (5 .cube LUT)",
    title: "LUT Pack",
    type: "paket",
    benefit: "Tek adımda tutarlı renk",
    purpose: "Rec.709 görüntü için ten rengini koruyan 5 hafif renk görünümü; önce/sonra karşılaştırmalı.",
    chips: ["5 LUT · .cube", "Premiere · DaVinci · CapCut"],
    plain: "Videonuzun renk tonunu tek tıkla güzelleştiren hazır renk ayarları.",
    en: {
      href: "/en/tools/free-lut-pack/",
      card: "/araclar/kartlar/en/lut-paketi",
      name: "Rast LUT Pack (5 free .cube LUTs)",
      title: "Free LUT pack",
      benefit: "Consistent color in one step",
      purpose: "Five subtle Rec.709 looks that protect skin tones, with before/after previews.",
      chips: ["5 LUTs · .cube", "Premiere · DaVinci · CapCut"],
      plain: "Ready-made color looks that grade your footage in one click.",
    },
  },
];

/** Item with its English fields swapped in (same slug → same card image). */
export const localize = (a: Arac, lang: "tr" | "en"): Arac => (lang === "en" && a.en ? { ...a, ...a.en } : a);

/** Items that have an English twin, in English. */
export const ARACLAR_EN: Arac[] = ARACLAR.filter((a) => a.en).map((a) => localize(a, "en"));

export const aracByHref = (href: string) => {
  const a = ARACLAR.find((t) => t.href === href) ?? ARACLAR_EN.find((t) => t.href === href);
  if (!a) throw new Error(`araclar.ts: no entry for ${href}`);
  return a;
};

/** 3–4 other items for the bottom strip: same-type siblings first, then a mix. */
export function otherTools(current: string, count = 4): Arac[] {
  const LIST = current.startsWith("/en/") ? ARACLAR_EN : ARACLAR;
  const self = LIST.find((t) => t.href === current);
  const rest = LIST.filter((t) => t.href !== current);
  if (!self) return rest.slice(0, count);
  const same = rest.filter((t) => t.type === self.type);
  const other = rest.filter((t) => t.type !== self.type);
  // rotate "other" by the item's index so each page shows a different mix
  const i = LIST.indexOf(self) % Math.max(other.length, 1);
  const mixed = [...other.slice(i), ...other.slice(0, i)];
  const out: Arac[] = [];
  const pick = [...same.slice(0, 2), ...mixed];
  for (const t of pick) if (out.length < count && !out.includes(t)) out.push(t);
  return out;
}
