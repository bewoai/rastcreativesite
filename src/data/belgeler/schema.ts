import { SITE } from "../../consts";

const abs = (u: string) => new URL(u, SITE.url).href;
export const CC_BY = "https://creativecommons.org/licenses/by/4.0/deed.tr";

const MIME: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
  md: "text/markdown",
  zip: "application/zip",
  json: "application/json",
};
export const mime = (href: string) => MIME[href.split(".").pop() ?? ""] ?? "application/octet-stream";

/** DigitalDocument (CreativeWork) node for a free downloadable template. */
export function docSchema(o: {
  name: string;
  description: string;
  path: string;
  image?: string;
  files: { href: string; label: string }[];
  keywords: string[];
  about?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: o.name,
    description: o.description,
    url: abs(o.path),
    inLanguage: "tr",
    isAccessibleForFree: true,
    license: CC_BY,
    creator: { "@id": `${SITE.url}#business` },
    publisher: { "@id": `${SITE.url}#business` },
    dateModified: "2026-10-30",
    keywords: o.keywords.join(", "),
    ...(o.about ? { about: o.about } : {}),
    ...(o.image ? { image: abs(o.image) } : {}),
    encodingFormat: [...new Set(o.files.map((f) => mime(f.href)))],
    associatedMedia: o.files.map((f) => ({
      "@type": "MediaObject",
      name: f.label,
      contentUrl: abs(f.href),
      encodingFormat: mime(f.href),
    })),
  };
}
