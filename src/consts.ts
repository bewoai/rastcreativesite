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
