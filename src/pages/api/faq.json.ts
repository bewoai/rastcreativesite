import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "../../consts";
import { apiResponse } from "../../lib/api-response";

export const GET: APIRoute = async () => {
  const questions = (await getCollection("faq"))
    .sort((a, b) => a.data.order - b.data.order)
    .map((item) => ({
      id: item.id,
      question: item.data.question,
      answer: item.body?.trim() ?? "",
      url: `${SITE.url}/hizmetler#${item.id}`,
    }));

  return apiResponse({
    name: SITE.name,
    updatedAt: new Date().toISOString(),
    questions,
  });
};
