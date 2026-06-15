import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Portfolio projects. Vimeo/YouTube IDs and posters are filled in by the
// client later (roadmap §5) — keep them optional so a project can exist
// poster-only. If both IDs are set, Vimeo takes precedence.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    category: z.enum([
      "Reklam",
      "Marka Hikayesi",
      "Ürün",
      "Kurumsal",
      "Medikal",
      "Sosyal Medya",
    ]),
    vimeoId: z.string().optional(),
    youtubeId: z.string().optional(), // YouTube video ID (e.g. "dQw4w9WgXcQ")
    externalUrl: z.string().optional(), // links out instead of playing (e.g. Instagram)
    vertical: z.boolean().default(false), // 9:16 reels/shorts (YouTube Shorts)
    poster: z.string(), // root-relative path or full URL (e.g. YouTube thumbnail)
    posterAlt: z.string().optional(),
    // Optional short silent loop (e.g. "/previews/altoteks.mp4") played in-card
    // on the homepage. Lazy + in-view only; falls back to the poster.
    preview: z.string().optional(),
    summary: z.string().optional(),
    client: z.string().optional(),
    year: z.number().int().optional(),
    duration: z.string().optional(), // timecode shown on the card, e.g. "01:24"
    featured: z.boolean().default(false), // surfaces in homepage "Seçili işler"
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

// The 3 core services (roadmap §2.4).
const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(), // short line for the service card
    features: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

// FAQ — question in frontmatter, answer in the markdown body.
const faq = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/faq" }),
  schema: z.object({
    question: z.string(),
    order: z.number().default(0),
  }),
});

// Blog — long-form SEO content (roadmap §6). Markdown body holds the article.
// `cover` uses the image() helper so covers are optimised like any local asset.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string().default("Berat Değirmenci"),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects, services, faq, blog };
