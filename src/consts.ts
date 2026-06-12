/**
 * Site-wide constants. Content is Turkish (roadmap 0.1 #6); code is English.
 * Real contact details / social URLs are collected from the client later
 * (roadmap §5) — do not invent them.
 */
export const SITE = {
  name: "Rast Creative Studio",
  shortName: "Rast Creative",
  /** Home-page <title>. Inner pages pass their own `title` to BaseLayout. */
  defaultTitle: "Rast Creative Studio — Sakarya Video Prodüksiyon Ajansı",
  /** `%s` is replaced by the page title on inner pages. */
  titleTemplate: "%s — Rast Creative Studio",
  description:
    "Sakarya merkezli video prodüksiyon ve kreatif ajans. Markanızın sinematik yüzüyle tanışın: reklam, marka hikâyesi, kurumsal ve medikal video.",
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
  | "whatsapp";

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
  // { label: "YouTube", href: "", icon: "youtube" },   // §5
  // { label: "TikTok",  href: "", icon: "tiktok" },    // §5
];

/**
 * Contact details. Real values come from the client (roadmap §5) — do NOT
 * invent them. Empty strings render as a muted placeholder for now.
 * `whatsapp` is digits only in international format (e.g. "905551234567").
 */
export const CONTACT = {
  city: "Sakarya, Türkiye",
  phone: "",
  email: "",
  whatsapp: "",
} as const;

/**
 * Migrated marketing copy (roadmap §2 + old site rastcreative.com).
 * `heroTitle` is the slogan the roadmap says to keep; `heroSubtitle`/`aboutIntro`
 * come from the old site (aboutIntro lightly cleaned — confirm wording with client).
 */
export const COPY = {
  heroTitle: "Markanızın Sinematik Yüzüyle Tanışın",
  heroSubtitle: "Sektörel disiplin, teknolojik üstünlük ve kreatif kurgu.",
  heroSecondaryCta: "Projelerimizi İzleyin",
  aboutIntro:
    "Yolculuğumuz boyunca farklı sektörlerden markaların dijital hikâyelerini yönettik. Ekibimizin geçmişindeki bu deneyim, bugün Rast Creative Studio çatısı altında sunduğumuz vizyonun temelini oluşturuyor.",
} as const;
