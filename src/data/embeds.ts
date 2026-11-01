/**
 * Embeddable tool widgets: /embed/<slug>/ (TR) and /en/embed/<slug>/ (EN).
 * Each renders the same tool component as the full page with `embed` set
 * (src/layouts/EmbedLayout.astro: no chrome, no tracking, noindex, canonical →
 * full page). The "Bu aracı sitene göm / Embed this tool" box on the full page
 * (src/components/araclar/EmbedBox.astro) builds its snippet from this list.
 * `height` = default iframe height in px (≈ widget height at ~400 px width);
 * the optional snippet script then auto-resizes from postMessage.
 */
export interface EmbedTool {
  /** Key passed to the embed route (TR slug). */
  slug: string;
  tr: { full: string; embed: string; title: string };
  en: { full: string; embed: string; title: string };
  height: number;
}

export const EMBEDS: EmbedTool[] = [
  {
    slug: "guvenli-alan",
    tr: { full: "/araclar/guvenli-alan/", embed: "/embed/guvenli-alan/", title: "Reels / TikTok / Shorts güvenli alan kontrolü" },
    en: { full: "/en/tools/reels-safe-zone-checker/", embed: "/en/embed/reels-safe-zone-checker/", title: "Reels / TikTok / Shorts safe zone checker" },
    height: 1600,
  },
  {
    slug: "bitrate-hesaplayici",
    tr: { full: "/araclar/bitrate-hesaplayici/", embed: "/embed/bitrate-hesaplayici/", title: "Video bitrate ve dosya boyutu hesaplayıcı" },
    en: { full: "/en/tools/video-bitrate-calculator/", embed: "/en/embed/video-bitrate-calculator/", title: "Video bitrate and file size calculator" },
    height: 1450,
  },
  {
    slug: "en-boy-orani",
    tr: { full: "/araclar/en-boy-orani/", embed: "/embed/en-boy-orani/", title: "En-boy oranı ve kırpma önizleyici" },
    en: { full: "/en/tools/aspect-ratio-calculator/", embed: "/en/embed/aspect-ratio-calculator/", title: "Aspect ratio and crop previewer" },
    height: 2600,
  },
  {
    slug: "altyazi-kontrolu",
    tr: { full: "/araclar/altyazi-kontrolu/", embed: "/embed/altyazi-kontrolu/", title: "SRT / VTT altyazı kontrolü" },
    en: { full: "/en/tools/srt-subtitle-checker/", embed: "/en/embed/srt-subtitle-checker/", title: "SRT / VTT subtitle checker" },
    height: 2750,
  },
];

/** Embed entry + language for a full tool page path (TR or EN). */
export function embedForFull(full: string): { tool: EmbedTool; lang: "tr" | "en" } | undefined {
  for (const tool of EMBEDS) {
    if (tool.tr.full === full) return { tool, lang: "tr" };
    if (tool.en.full === full) return { tool, lang: "en" };
  }
  return undefined;
}

export const isEmbedPath = (p: string) => /^\/(en\/)?embed\//.test(p);
