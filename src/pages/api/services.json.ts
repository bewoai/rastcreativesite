import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../../consts";
import { apiResponse } from "../../lib/api-response";

export const GET: APIRoute = async () => {
  const services = (await getCollection("services"))
    .sort((a, b) => a.data.order - b.data.order)
    .map((service) => ({
      id: service.id,
      name: service.data.title,
      summary: service.data.summary,
      features: service.data.features,
      // Services are grouped on the canonical services page; the collection id
      // is still exposed above for agents that need a stable identifier.
      url: `${SITE.url}/hizmetler#${service.id}`,
    }));

  return apiResponse({
    name: SITE.name,
    updatedAt: new Date().toISOString(),
    services,
  });
};
