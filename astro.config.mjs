// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// Secondary programmatic location pages are emitted as `noindex, follow`
// (see PRIMARY_LOCATION_SLUGS in src/data/locations.ts), so they must stay out
// of the sitemap too — a sitemap should only list indexable URLs.
// Keep these two lists in sync with src/data/seo-services.ts and locations.ts.
const SERVICE_SLUGS = [
  'video-cekimi',
  'drone-cekimi',
  'tanitim-filmi',
  'reklam-filmi',
  'sosyal-medya-icerigi',
  'urun-mekan-cekimi',
];
const SECONDARY_LOCATION_SLUGS = [
  'akyazi',
  'karasu',
  'ferizli',
  'geyve',
  'pamukova',
  'kartepe',
  'basiskele',
  'golcuk',
  'darica',
  'duzce',
  'bolu',
  'bilecik',
];
const NOINDEX_LOCATION_PATHS = new Set(
  SERVICE_SLUGS.flatMap((service) =>
    SECONDARY_LOCATION_SLUGS.map((location) => `/${service}/${location}`),
  ),
);
const isNoindexLocationPage = (page) =>
  NOINDEX_LOCATION_PATHS.has(new URL(page).pathname.replace(/\/$/, ''));

// https://astro.build/config
export default defineConfig({
  // Canonical origin — used for canonical URLs, OG tags and (Faz 5) sitemap.
  site: 'https://rastcreative.com',

  devToolbar: {
    enabled: false,
  },

  build: { inlineStylesheets: 'always' },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['aria-query', 'axobject-query', 'astro/dist/runtime/client/dev-toolbar/entrypoint.js'],
    },
  },

  integrations: [
    sitemap({
      // keep the temporary component gallery + noindex location pages out
      filter: (page) => !page.includes('/dev') && !isNoindexLocationPage(page),
    }),
  ]
});
