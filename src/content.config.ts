import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Portfolio projects. Vimeo IDs/posters are filled in by the client later
// (roadmap §5) — keep `vimeoId` optional so a project can exist poster-only.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(["Reklam", "Marka Hikayesi", "Ürün", "Kurumsal", "Medikal"]),
    vimeoId: z.string().optional(),
    poster: z.string(), // root-relative image path
    posterAlt: z.string().optional(),
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

export const collections = { projects, services, faq };
