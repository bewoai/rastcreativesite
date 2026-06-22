/**
 * YouTube thumbnail helpers.
 *
 * Project posters are remote ytimg URLs (i.ytimg.com/vi/<id>/<size>.jpg).
 * ytimg also serves lighter WebP variants from the vi_webp host, so we rewrite
 * the JPG thumbnails to WebP to cut poster weight. Non-ytimg, already-webp or
 * local posters pass through unchanged.
 *
 *  - "card"  → small hqdefault.webp; right for the grid cards.
 *  - "large" → keep maxres resolution as WebP for full-width posters; smaller
 *              source sizes pass through so we never upscale or request a
 *              missing webp variant.
 */
const YT_THUMB =
  /^https:\/\/i\.ytimg\.com\/vi\/([^/]+)\/(maxresdefault|sddefault|hqdefault|oardefault)\.jpg$/;

export function ytThumbToWebp(poster: string, size: "card" | "large" = "card"): string {
  const match = poster.match(YT_THUMB);
  if (!match) return poster;
  const [, id, variant] = match;
  if (size === "large") {
    // Only the high-res maxres variant is safe to keep at full size as WebP;
    // smaller variants stay as-is so detail posters never get upscaled.
    return variant === "maxresdefault"
      ? `https://i.ytimg.com/vi_webp/${id}/maxresdefault.webp`
      : poster;
  }
  return `https://i.ytimg.com/vi_webp/${id}/hqdefault.webp`;
}
