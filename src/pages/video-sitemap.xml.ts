/**
 * Video sitemap — lists every project page that carries a real video (same
 * rule as the VideoObject on /projeler/[slug]/: a provider + publishDate), so
 * Google can surface them in video results. Linked from sitemap-index via
 * astro.config `customSitemaps` and from robots.txt.
 */
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../consts";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const seconds = (tc?: string) => {
  if (!tc) return undefined;
  const parts = tc.split(":").map(Number);
  if (parts.some((n) => Number.isNaN(n))) return undefined;
  const [h, m, s] = parts.length === 3 ? parts : [0, ...parts];
  const total = h * 3600 + m * 60 + s;
  return total > 0 ? total : undefined;
};

export const GET: APIRoute = async () => {
  const projects = (await getCollection("projects"))
    .filter((p) => !p.data.draft && !p.data.hidden)
    .sort((a, b) => a.data.order - b.data.order);

  const entries = projects.flatMap((p) => {
    const d = p.data;
    const provider = d.vimeoId ? "vimeo" : d.youtubeId ? "youtube" : d.video ? "file" : null;
    if (!provider || !d.publishDate) return [];
    const loc = new URL(`/projeler/${p.id}/`, SITE.url).href;
    const thumb = new URL(d.poster, SITE.url).href;
    const media =
      provider === "file"
        ? `<video:content_loc>${esc(new URL(d.video!, SITE.url).href)}</video:content_loc>`
        : `<video:player_loc>${esc(
            provider === "vimeo"
              ? `https://player.vimeo.com/video/${d.vimeoId}`
              : `https://www.youtube.com/embed/${d.youtubeId}`,
          )}</video:player_loc>`;
    const dur = seconds(d.duration);
    return [
      `  <url>
    <loc>${esc(loc)}</loc>
    <video:video>
      <video:thumbnail_loc>${esc(thumb)}</video:thumbnail_loc>
      <video:title>${esc(d.title)}</video:title>
      <video:description>${esc(d.summary ?? `${d.title} — ${d.category}`)}</video:description>
      ${media}${dur ? `\n      <video:duration>${dur}</video:duration>` : ""}
      <video:publication_date>${d.publishDate}T00:00:00+03:00</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>
  </url>`,
    ];
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries.join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
