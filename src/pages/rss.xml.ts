import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../consts";

/**
 * Blog RSS 2.0 feed — dependency-free (no @astrojs/rss). Pre-rendered to
 * /rss.xml at build. Supports the Faz 4 "blog ritmi": subscribers, aggregators
 * and discovery. Linked from <head> via rel="alternate".
 */
const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const GET: APIRoute = async () => {
  const posts = (await getCollection("blog"))
    .filter((p) => !p.data.draft)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const items = posts
    .map((p) => {
      const url = `${SITE.url}/blog/${p.id}/`;
      const categories = (p.data.tags ?? [])
        .map((t) => `      <category>${escapeXml(t)}</category>`)
        .join("\n");
      return [
        "    <item>",
        `      <title>${escapeXml(p.data.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(p.data.description)}</description>`,
        `      <dc:creator>${escapeXml(p.data.author)}</dc:creator>`,
        `      <pubDate>${p.data.pubDate.toUTCString()}</pubDate>`,
        categories,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE.name)} — Günlük</title>
    <link>${SITE.url}/blog</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>${SITE.lang}</language>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
