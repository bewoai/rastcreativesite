/**
 * Sakarya district × service pages consolidated into their /<service>/sakarya/
 * page (Sakarya plan, wave 2 — approved by Bewo 1.11.2026).
 *
 * Rule (GSC 2026-08-02..10-30): 0 clicks AND <10 impressions in 90 days AND no
 * distinct local content (no project, no tourism/OSB angle). Drone district
 * pages and every page with a click or ≥10 impressions stay.
 *
 * Effects (keep in sync — one list drives all of them):
 * - `[hizmet]/[konum].astro` getStaticPaths skips these routes (so the sitemap drops them).
 * - Every internal link goes through `serviceLocationHref()` / `isConsolidated()`.
 * - `public/.htaccess` carries one 301 per URL → `/<service>/sakarya/`.
 * - The Sakarya page keeps the district names as text in its "#ilceler" section.
 */
export const CONSOLIDATED: Readonly<Record<string, readonly string[]>> = {
  "urun-mekan-cekimi": [
    "serdivan", "adapazari", "arifiye", "erenler", "hendek", "akyazi",
    "sapanca", "karasu", "ferizli", "geyve", "pamukova",
  ],
  "video-cekimi": ["arifiye", "ferizli", "geyve", "pamukova"],
  "sosyal-medya-icerigi": ["adapazari", "erenler", "akyazi", "ferizli", "pamukova"],
  "tanitim-filmi": ["serdivan", "adapazari", "arifiye", "erenler", "ferizli", "geyve", "pamukova"],
  "reklam-filmi": [
    "serdivan", "adapazari", "arifiye", "erenler", "akyazi", "karasu",
    "ferizli", "geyve", "pamukova",
  ],
};

export const CONSOLIDATION_TARGET = "sakarya";
export const DISTRICT_ANCHOR = "ilceler";

export const isConsolidated = (service: string, location: string) =>
  (CONSOLIDATED[service] ?? []).includes(location);

/** Live URL for a service × location link (consolidated → Sakarya page district section). */
export const serviceLocationHref = (service: string, location: string) =>
  isConsolidated(service, location)
    ? `/${service}/${CONSOLIDATION_TARGET}/#${DISTRICT_ANCHOR}`
    : `/${service}/${location}/`;

/** True for a path like "/reklam-filmi/serdivan/" that now 301s. */
export const isConsolidatedPath = (href: string) => {
  const m = href.match(/^\/([a-z-]+)\/([a-z]+)\/(?:[#?].*)?$/);
  return Boolean(m && isConsolidated(m[1], m[2]));
};

export const CONSOLIDATED_PATHS: readonly string[] = Object.entries(CONSOLIDATED).flatMap(
  ([service, locs]) => locs.map((l) => `/${service}/${l}/`),
);
