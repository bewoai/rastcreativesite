---
name: rastcreative-writing
description: This skill should be used when creating or revising Turkish Rast Creative Studio blog posts, service articles, case studies, or AI-readable editorial content in a clean, conversational question-and-answer style.
---

# Rast Creative Writing

## Purpose

Create publish-ready Turkish articles for Rast Creative Studio. Keep the voice warm, direct, observant, and grounded in real production experience. Make each article easy for a person to read and easy for an answer engine to quote accurately.

## Trigger Conditions

Use this skill for requests about:

- New Rast Creative blog posts or revisions
- Sakarya-focused video production, advertising film, drone, product, social video, editing, or creative strategy content
- FAQ, AEO, GEO, or answer-engine content for the Rast Creative site
- Turning a client question into a useful article or case study

## Editorial Voice

- Write in natural Turkish with short, varied sentences.
- Speak like a producer explaining a real decision to a business owner over coffee.
- Answer the reader's question early; do not hide the point behind a long introduction.
- Use concrete examples from sets, preparation, camera, light, sound, editing, delivery, and publishing.
- Keep confidence calm and specific. Prefer "şu durumda" and "genellikle" over absolute promises.
- Use first-person plural for the studio ("biz", "Rast Creative olarak") and second-person polite form ("siz").
- Avoid agency clichés, inflated claims, keyword stuffing, fake statistics, invented awards, invented clients, and generic AI filler.
- Do not imitate a chatbot transcript. Use real article prose with question-shaped headings and direct answers.

## Article Pattern

Build each article in this order:

1. Open with the exact question or tension a client has.
2. Give a concise direct answer in the first one or two paragraphs.
3. Use 4–6 question-shaped `##` headings.
4. Under each heading, answer first, then explain the reasoning and give one practical example.
5. Include a short "Kısaca" or decision checklist when the topic benefits from one.
6. Close with an honest next step and a single internal link to `/iletisim` or the most relevant service page.

## Answer-Engine Optimization

- Put the main query and location naturally in the title, description, first paragraph, and one heading.
- Write a quotable 40–70 word answer near the beginning.
- Define jargon in plain Turkish the first time it appears.
- Prefer explicit entities: Rast Creative Studio, Serdivan, Sakarya, the service name, and the client type.
- Link only to existing, relevant routes such as `/video-cekimi/sakarya`, `/tanitim-filmi/sakarya`, `/reklam-filmi/sakarya`, `/drone-cekimi/sakarya`, `/urun-mekan-cekimi/sakarya`, `/hizmetler`, and `/iletisim`.
- Add a real date, author, tags, and a useful `description` in frontmatter.
- Keep paragraphs to 2–5 sentences and use lists only when they improve scanning.

## Fact Discipline

- Treat repository content, client-provided facts, and verified sources as the source of truth.
- Never invent a project result, review, address, opening hour, price, permit, legal status, equipment specification, or client approval.
- Mark missing proof as a question for the user or phrase the claim conditionally.
- Browse before making current legal, platform, market, or technical claims; cite primary sources when the article needs them.
- Separate studio experience from general advice with wording such as "bizim sette gördüğümüz".

## Frontmatter Template

Use the site's existing blog schema:

```yaml
---
title: "Soru biçiminde, açık ve doğal başlık"
seoTitle: "Kısa arama başlığı"
description: "Sakarya ve ilgili hizmeti doğal biçimde anlatan 140–165 karakterlik açıklama."
pubDate: 2026-08-04
cover: ../../assets/photos/film-crew-red-camera.jpg
coverAlt: "İçeriği doğru ve açıklayıcı görsel alt metni"
tags: ["video prodüksiyon", "Sakarya", "tanıtım filmi"]
draft: false
---
```

Use a local cover only when it genuinely matches the article. Leave `cover` out rather than inventing a visual relationship.

## Review Checklist

- Confirm the article answers one clear question.
- Confirm the first paragraph contains a useful answer.
- Remove repeated ideas and empty transitions.
- Check Turkish spelling, apostrophes, and sentence rhythm.
- Check every internal link and slug.
- Check that every claim is either known, qualified, or sourced.
- Check title, description, tags, date, and cover alt text.
- Build the site and inspect the generated route before publishing.
