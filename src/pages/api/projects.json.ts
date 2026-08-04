import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../../consts";
import { apiResponse } from "../../lib/api-response";

export const GET: APIRoute = async () => {
  const projects = (await getCollection("projects"))
    .filter((project) => !project.data.draft)
    .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
    .map((project) => ({
      id: project.id,
      title: project.data.title,
      category: project.data.category,
      client: project.data.client ?? null,
      sector: project.data.sector ?? null,
      projectType: project.data.projectType ?? null,
      year: project.data.year ?? null,
      summary: project.data.summary ?? null,
      url: `${SITE.url}/projeler/${project.id}`,
      media: {
        vimeoId: project.data.vimeoId ?? null,
        youtubeId: project.data.youtubeId ?? null,
        externalUrl: project.data.externalUrl ?? null,
      },
    }));

  return apiResponse({
    name: SITE.name,
    updatedAt: new Date().toISOString(),
    count: projects.length,
    projects,
  });
};
