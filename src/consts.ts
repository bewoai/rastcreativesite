/**
 * Site-wide constants. Content is Turkish (roadmap 0.1 #6); code is English.
 * Real contact details / social URLs are collected from the client later
 * (roadmap §5) — do not invent them.
 */
export const SITE = {
  /** Company founded 1 May 2026 (client, 2026-10-07). */
  foundingDate: "2026-05-01",
  name: "Rast Creative Studio",
  shortName: "Rast Creative",
  /** Home-page <title>. Inner pages pass their own `title` to BaseLayout. */
  defaultTitle: "Rast Creative | Sakarya Video Prodüksiyon ve Kreatif Ajans",
  /** `%s` is replaced by the page title on inner pages. */
  titleTemplate: "%s — Rast Creative Studio",
  description:
    "Sakarya video çekimi, tanıtım filmi, sosyal medya videosu, ürün çekimi, drone çekimi ve kurgu hizmetleri sunan yaratıcı prodüksiyon ajansı.",
  url: "https://rastcreative.com",
  locale: "tr_TR",
  lang: "tr",
  themeColor: "#faf9f6",
  /** 1200×630 social card — asset produced in Faz 5 (SEO/OG). */
  ogImage: "/og-default.png",
} as const;

/** Icon names available in Icon.astro. */
export type IconName =
  | "home"
  | "projects"
  | "services"
  | "about"
  | "contact"
  | "menu"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "linkedin"
  | "arrow-right"
  | "arrow-up-right"
  | "play"
  | "whatsapp"
  | "video"
  | "strategy"
  | "edit"
  | "sun"
  | "moon";

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
}

/** Primary section links (desktop pill center + footer). */
export const NAV: readonly NavItem[] = [
  { label: "Projeler", href: "/projeler/", icon: "projects" },
  { label: "Hizmetler", href: "/hizmetler/", icon: "services" },
  { label: "Hakkımızda", href: "/hakkimizda/", icon: "about" },
  { label: "İletişim", href: "/iletisim/", icon: "contact" },
];

/** The single conversion CTA used across the site (roadmap §2). */
export const PRIMARY_CTA = {
  label: "Bize projenizden bahsedin",
  /** Short form for tight surfaces (the nav pill), where the full sentence
   *  made the button ~246px wide and let it dominate the hero. */
  shortLabel: "Proje Başlat",
  href: "/iletisim/",
} as const;

/**
 * Social profiles. Only Instagram is confirmed correct (roadmap §5).
 * The old site's TikTok/X/YouTube links were WRONG — do not copy them.
 * Add the rest here once the client provides real URLs.
 */
export const SOCIAL: readonly NavItem[] = [
  { label: "Instagram", href: "https://instagram.com/rastcreative", icon: "instagram" },
  { label: "YouTube", href: "https://www.youtube.com/@RastCreativeStudio", icon: "youtube" },
  // { label: "TikTok",  href: "", icon: "tiktok" },    // §5
];

/**
 * Contact details (provided by the client, 2026-06-13; company phone changed 2026-10-19).
 * `whatsapp` is digits only, international format (TR +90, no leading 0).
 */
export const CONTACT = {
  city: "Serdivan, Sakarya",
  /** Google Business Profile (Knowledge Graph id /g/11zxk4gs4x, 2026-10-07).
   *  `googleProfile` is the stable entity URL for schema sameAs/hasMap;
   *  `googleShare` is the short link people tap (opens map, reviews, route). */
  googleProfile: "https://www.google.com/search?kgmid=/g/11zxk4gs4x",
  googleShare: "https://share.google/MQDL2FMsZUpXjq6Vp",
  addressLocality: "Serdivan",
  addressRegion: "Sakarya",
  addressCountry: "TR",
  phone: "0533 128 1080",
  phoneIntl: "+905331281080", // for tel: links
  email: "studio@rastcreative.com",
  whatsapp: "905331281080", // for wa.me links
} as const;

/** Build a wa.me link only from a validated, non-empty message. */
export function waLink(message: string): string | null {
  const cleanMessage = message.trim();
  return CONTACT.whatsapp && cleanMessage
    ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(cleanMessage)}`
    : null;
}

/**
 * Prefilled opener for global WhatsApp shortcuts (nav tab-bar, footer).
 *
 * Pre-filling the first message removes the "what do I even write" pause and
 * tells us on arrival what the person wants, so the reply can be useful
 * immediately.
 */
export const WHATSAPP_CTA_MESSAGE =
  "Merhaba, video çekimi için teklif almak istiyorum.";

/** Ready-to-use WhatsApp href for the global shortcuts; null if unconfigured. */
export const WHATSAPP_CTA_HREF = waLink(WHATSAPP_CTA_MESSAGE);

/**
 * Openers for pages where "video çekimi için teklif" is the wrong first line
 * (a physician or a social-media client isn't asking for a shoot quote).
 * Key = first path segment.
 */
const WHATSAPP_OPENERS: Record<string, string> = {
  "hekim-icerik-sistemi": "Merhaba, Hekim İçerik Sistemi hakkında bilgi almak istiyorum.",
  "sosyal-medya-icerigi": "Merhaba, sosyal medya yönetimi için bilgi almak istiyorum.",
  "drone-cekimi": "Merhaba, drone çekimi için teklif almak istiyorum.",
  "tanitim-filmi": "Merhaba, tanıtım filmi için teklif almak istiyorum.",
  "reklam-filmi": "Merhaba, reklam filmi için teklif almak istiyorum.",
  "urun-mekan-cekimi": "Merhaba, ürün ve mekan çekimi için teklif almak istiyorum.",
  "fotograftan-yapay-zeka-reklam-videosu": "Merhaba, ürün fotoğraflarımdan reklam videosu için bilgi almak istiyorum.",
};

/**
 * The page's opener, tagged with the page it was sent from. GA4 sees the click
 * but not the chat; the tag lets a WhatsApp conversation be traced back to
 * its page (e.g. an organic visit to /video-cekimi/sakarya/).
 */
export const waCtaHref = (path = "/") =>
  waLink(
    `${WHATSAPP_OPENERS[path.split("/")[1]] ?? WHATSAPP_CTA_MESSAGE}\n\n(Sayfa: rastcreative.com${path})`,
  );

/**
 * Migrated marketing copy (roadmap §2 + old site rastcreative.com).
 * `heroTitle` is the slogan the roadmap says to keep; `heroSubtitle`/`aboutIntro`
 * come from the old site (aboutIntro lightly cleaned — confirm wording with client).
 */
export const COPY = {
  heroTitle: "Sakarya Video Çekimi ve Prodüksiyon",
  heroSubtitle:
    "Markanız için reklam filmi, tanıtım filmi ve sosyal medya videoları üretiyoruz. Sinematik görüntü, doğru hikâye ve güçlü kurgu ile dijital yüzünüzü daha profesyonel hale getiriyoruz.",
  // Note: the hero trust line ("X+ marka · Y+ içerik …") is built dynamically
  // in index.astro from real content counts, so it is not hard-coded here.
  heroSecondaryCta: "Projelerimizi inceleyin",
  aboutIntro:
    "Yolculuğumuz boyunca farklı sektörlerden markaların dijital hikâyelerini yönettik. Ekibimizin geçmişindeki bu deneyim, bugün Rast Creative Studio çatısı altında sunduğumuz vizyonun temelini oluşturuyor.",
} as const;

/**
 * Portfolio categories. `label` must match the `category` enum in
 * content.config.ts; `slug` is the URL-safe form for /projeler/kategori/[slug].
 */
export const PROJECT_CATEGORIES = [
  { label: "Reklam", slug: "reklam" },
  { label: "Marka Hikayesi", slug: "marka-hikayesi" },
  { label: "Ürün", slug: "urun" },
  { label: "Kurumsal", slug: "kurumsal" },
  { label: "Medikal", slug: "medikal" },
  { label: "Sosyal Medya", slug: "sosyal-medya" },
  { label: "Web", slug: "web" },
] as const;

/**
 * Web3Forms public access key (web3forms.com — free, static-friendly).
 * The key is meant to live in client HTML, so committing it is fine. Provide it
 * via a PUBLIC_WEB3FORMS_KEY env var, or replace the empty fallback. Until set,
 * the contact form renders but submissions will fail.
 */
export const WEB3FORMS_ACCESS_KEY: string =
  import.meta.env.PUBLIC_WEB3FORMS_KEY ?? "be5b4c14-429d-48c7-a686-6e4e1322f40f";

/**
 * Google Analytics 4 Measurement ID.
 * Used in BaseLayout.astro for the gtag.js snippet.
 */
export const GA4_MEASUREMENT_ID = "G-9TBDM2LX3G";
