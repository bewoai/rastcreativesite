/**
 * Group portfolio projects by client ("brand"), so the projects page can show
 * a tidy folder per brand instead of a flat wall of every single video.
 */
import type { CollectionEntry } from "astro:content";
import { PROJECT_CATEGORIES } from "../consts";

type Project = CollectionEntry<"projects">;

const TR: Record<string, string> = {
  ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
  Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u",
};

/** URL-safe slug with Turkish characters folded to ASCII. */
export function slugify(input: string): string {
  return input
    .replace(/[çğıöşüÇĞİIÖŞÜ]/g, (c) => TR[c] ?? c)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface Brand {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  cover: string;
  vertical: boolean;
  projects: Project[];
  count: number;
}

const categorySlug = (label: string) =>
  PROJECT_CATEGORIES.find((c) => c.label === label)?.slug ?? slugify(label);

/** Group projects by `client`, ordered by each brand's lowest project order. */
export function groupByBrand(projects: Project[]): Brand[] {
  const byClient = new Map<string, Project[]>();
  for (const p of projects) {
    const name = p.data.client ?? p.data.title;
    const arr = byClient.get(name) ?? [];
    arr.push(p);
    byClient.set(name, arr);
  }

  const brands: Brand[] = [];
  for (const [name, list] of byClient) {
    const sorted = [...list].sort((a, b) => a.data.order - b.data.order);
    const first = sorted[0];
    brands.push({
      slug: slugify(name),
      name,
      category: first.data.category,
      categorySlug: categorySlug(first.data.category),
      cover: first.data.poster,
      vertical: Boolean(first.data.vertical),
      projects: sorted,
      count: sorted.length,
    });
  }

  return brands.sort(
    (a, b) => a.projects[0].data.order - b.projects[0].data.order,
  );
}

/**
 * A brand folder links to: its external URL (e.g. Instagram) for a single
 * link-out project, the single video's detail page, or the brand page.
 */
export function brandHref(b: Brand): string {
  if (b.count === 1) {
    const p = b.projects[0];
    return p.data.externalUrl ?? `/projeler/${p.id}`;
  }
  return `/projeler/marka/${b.slug}`;
}
