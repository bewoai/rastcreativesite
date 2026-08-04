import type { APIRoute } from "astro";
import { SITE } from "../../consts";
import { SEO_LOCATIONS } from "../../data/locations";
import { apiResponse } from "../../lib/api-response";

export const GET: APIRoute = async () =>
  apiResponse({
    name: SITE.name,
    updatedAt: new Date().toISOString(),
    primaryLocation: "Serdivan, Sakarya",
    locations: SEO_LOCATIONS.map((location) => ({
      slug: location.slug,
      name: location.name,
      province: location.province,
      core: location.core,
      description: location.blurb,
      nearby: location.nearby,
      url: `${SITE.url}/video-cekimi/${location.slug}`,
    })),
  });
