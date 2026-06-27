/**
 * schema.org JSON-LD builders for local SEO.
 * Target: "Sakarya video prodüksiyon ajansı" and related local queries.
 * Only facts we actually have are emitted — no invented address/hours/geo.
 */
import { SITE, CONTACT, SOCIAL } from "../consts";

const abs = (path: string) => new URL(path, SITE.url).href;

/** Stable @id so other nodes can reference the business. */
export const BUSINESS_ID = `${SITE.url}#business`;

/** Service area — "Sakarya geneli" per client (2026-06). */
const AREA_SERVED = [
  "Sakarya",
  "Serdivan",
  "Adapazarı",
  "Erenler",
  "Arifiye",
  "Hendek",
  "Sapanca",
  "Kocaeli",
  "İzmit",
  "Gebze",
  "Düzce",
].map((name) => ({ "@type": "City", name }));

const CORE_SERVICES = [
  {
    name: "Video Çekimi",
    description:
      "Sakarya'da profesyonel kamera, ışık, ses, kurgu ve teslim süreçleriyle video çekimi.",
  },
  {
    name: "Video Prodüksiyon",
    description:
      "Sakarya'da sinema standardı ekipmanla reklam, marka filmi, ürün ve kurumsal video prodüksiyonu.",
  },
  {
    name: "Kreatif Strateji & Yönetim",
    description:
      "Marka hikâyesi, senaryo, içerik stratejisi ve sosyal medya yönetimi.",
  },
  {
    name: "Post-Prodüksiyon & Kurgu",
    description: "Kurgu, renk düzenleme (color grading) ve motion graphics.",
  },
];

/**
 * Primary LocalBusiness / ProfessionalService node for the studio.
 * Emitted on the home and contact pages.
 */
export const localBusiness = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  "@id": BUSINESS_ID,
  name: SITE.name,
  alternateName: SITE.shortName,
  description: SITE.description,
  slogan: "Doğru kareyi yakalayan stüdyo",
  url: SITE.url,
  image: abs(SITE.ogImage),
  logo: abs("/logo-black.svg"),
  telephone: CONTACT.phoneIntl,
  email: CONTACT.email,
  inLanguage: "tr",
  address: {
    "@type": "PostalAddress",
    addressLocality: CONTACT.addressLocality,
    addressRegion: CONTACT.addressRegion,
    addressCountry: CONTACT.addressCountry,
  },
  areaServed: AREA_SERVED,
  knowsAbout: [
    "video çekimi",
    "profesyonel video çekimi",
    "video prodüksiyon",
    "reklam filmi",
    "tanıtım filmi",
    "marka hikâyesi filmi",
    "kurumsal video",
    "medikal tanıtım filmi",
    "ürün tanıtım çekimi",
    "post prodüksiyon",
    "kreatif strateji",
    "Sakarya video çekimi",
    "Sakarya video prodüksiyon",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Hizmetler",
    itemListElement: CORE_SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.description,
        areaServed: AREA_SERVED,
        provider: { "@id": BUSINESS_ID },
      },
    })),
  },
  sameAs: SOCIAL.map((s) => s.href),
};

/** Organization identity node for GEO / entity recognition. */
export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE.url}#organization`,
  name: SITE.name,
  alternateName: SITE.shortName,
  description:
    "Rast Creative Studio, Serdivan/Sakarya merkezli video prodüksiyon ve kreatif içerik ajansıdır.",
  url: SITE.url,
  logo: abs("/logo-black.svg"),
  image: abs(SITE.ogImage),
  email: CONTACT.email,
  telephone: CONTACT.phoneIntl,
  address: {
    "@type": "PostalAddress",
    addressLocality: CONTACT.addressLocality,
    addressRegion: CONTACT.addressRegion,
    addressCountry: CONTACT.addressCountry,
  },
  sameAs: SOCIAL.map((s) => s.href),
  knowsAbout: [
    "Sakarya video çekimi",
    "video prodüksiyon",
    "tanıtım filmi",
    "reklam filmi",
    "sosyal medya videosu",
    "ürün çekimi",
    "drone çekimi",
    "kurgu",
  ],
};

/** Website node so assistants/search engines can connect the domain to the brand. */
export const webSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE.url}#website`,
  name: SITE.name,
  alternateName: SITE.shortName,
  url: SITE.url,
  inLanguage: SITE.lang,
  publisher: { "@id": `${SITE.url}#organization` },
  about: { "@id": BUSINESS_ID },
};

/** FAQPage node built from the FAQ collection (question + plain-text answer). */
export function faqPage(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

/** BreadcrumbList for inner pages. Pass [{name, path}] from home → current. */
export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

/** Strip light markdown to plain text for schema answer fields. */
export function toPlainText(md: string): string {
  return md
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[#>`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
