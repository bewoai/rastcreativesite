/**
 * Minimal i18n for the English free-tools section (/en/tools/).
 * The site is Turkish; only the free tools have English twins. Each pair below
 * gets reciprocal hreflang alternates (tr, en, x-default → en) from BaseLayout,
 * a "English / Türkçe" switch in ToolHeader, and the EN copy lives next to the
 * TR copy inside the shared tool component (lang prop) — one logic, two languages.
 * Adding a twin = one line here + `en` fields in src/data/araclar.ts + an
 * /en/tools/<slug>.astro page that renders the shared component with lang="en".
 */
export type Lang = "tr" | "en";

export const TR_TO_EN: Record<string, string> = {
  "/araclar/": "/en/tools/",
  "/araclar/guvenli-alan/": "/en/tools/reels-safe-zone-checker/",
  "/araclar/bitrate-hesaplayici/": "/en/tools/video-bitrate-calculator/",
  "/araclar/en-boy-orani/": "/en/tools/aspect-ratio-calculator/",
  "/araclar/altyazi-kontrolu/": "/en/tools/srt-subtitle-checker/",
  "/araclar/webp-jpg-cevirici/": "/en/tools/webp-to-jpg/",
  "/araclar/sfx-paketi/": "/en/tools/free-sound-effects-pack/",
  "/araclar/lut-paketi/": "/en/tools/free-lut-pack/",
};

export const EN_TO_TR: Record<string, string> = Object.fromEntries(
  Object.entries(TR_TO_EN).map(([tr, en]) => [en, tr]),
);

/** Twin path in the other language, or undefined. */
export const twinOf = (path: string): string | undefined => TR_TO_EN[path] ?? EN_TO_TR[path];

/** hreflang alternates for a path that has a twin (both directions + x-default → EN). */
export function alternatesFor(path: string): { hreflang: string; path: string }[] {
  const en = TR_TO_EN[path] ?? (EN_TO_TR[path] ? path : undefined);
  const tr = EN_TO_TR[path] ?? (TR_TO_EN[path] ? path : undefined);
  if (!en || !tr) return [];
  return [
    { hreflang: "tr", path: tr },
    { hreflang: "en", path: en },
    { hreflang: "x-default", path: en },
  ];
}

export const langOfPath = (path: string): Lang => (path.startsWith("/en/") ? "en" : "tr");
