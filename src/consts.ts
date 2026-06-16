/**
 * Site-wide constants. Content is Turkish (roadmap 0.1 #6); code is English.
 * Real contact details / social URLs are collected from the client later
 * (roadmap §5) — do not invent them.
 */
export const SITE = {
  name: "Rast Creative Studio",
  shortName: "Rast Creative",
  /** Home-page <title>. Inner pages pass their own `title` to BaseLayout. */
  defaultTitle: "Sakarya Video Çekimi, Tanıtım Filmi ve Prodüksiyon Ajansı — Rast Creative Studio",
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
  { label: "Projeler", href: "/projeler", icon: "projects" },
  { label: "Hizmetler", href: "/hizmetler", icon: "services" },
  { label: "Hakkımızda", href: "/hakkimizda", icon: "about" },
  { label: "İletişim", href: "/iletisim", icon: "contact" },
];

/** The single conversion CTA used across the site (roadmap §2). */
export const PRIMARY_CTA = {
  label: "Ücretsiz Ön Görüşme",
  href: "/iletisim",
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
 * Contact details (provided by the client, 2026-06-13).
 * `whatsapp` is digits only, international format (TR +90, no leading 0).
 */
export const CONTACT = {
  city: "Serdivan, Sakarya",
  addressLocality: "Serdivan",
  addressRegion: "Sakarya",
  addressCountry: "TR",
  phone: "0543 838 2404",
  phoneIntl: "+905438382404", // for tel: links
  email: "studio@rastcreative.com",
  whatsapp: "905438382404", // for wa.me links
} as const;

/**
 * WhatsApp quick-quote deep links (roadmap §2 — primary channel for the 35+
 * audience). Newlines survive URL-encoding as %0A and render in WhatsApp's
 * compose box, so the visitor lands on a ready-to-fill quote request rather
 * than an empty chat. Helpers return `null` when no number is set, so callers
 * can fall back / hide the button.
 */
export const WHATSAPP_QUOTE_MESSAGE = [
  "Merhaba Rast Creative 👋",
  "",
  "Bir proje için teklif almak istiyorum:",
  "",
  "• Proje türü: ",
  "• Tahmini tarih: ",
  "• Lokasyon: ",
  "• Kısaca: ",
].join("\n");

/** Build a wa.me link with a prefilled message (defaults to the quote template). */
export function waLink(message: string = WHATSAPP_QUOTE_MESSAGE): string | null {
  return CONTACT.whatsapp
    ? `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`
    : null;
}

/**
 * Migrated marketing copy (roadmap §2 + old site rastcreative.com).
 * `heroTitle` is the slogan the roadmap says to keep; `heroSubtitle`/`aboutIntro`
 * come from the old site (aboutIntro lightly cleaned — confirm wording with client).
 */
export const COPY = {
  heroTitle: "Sakarya Video Çekimi ve Prodüksiyon",
  heroSubtitle: "Tanıtım filmi, sosyal medya videosu, ürün çekimi ve kurgu için sinematik ekip.",
  heroSecondaryCta: "Projelerimizi İzleyin",
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
