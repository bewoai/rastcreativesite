// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical origin — used for canonical URLs, OG tags and (Faz 5) sitemap.
  site: 'https://rastcreative.com',

  // Inline all CSS into the HTML so first paint isn't blocked by a CSS fetch
  // (our total CSS is ~12KB gzip — small enough to inline everywhere).
  build: { inlineStylesheets: 'always' },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    sitemap({
      // keep the temporary component gallery out of the sitemap
      filter: (page) => !page.includes('/dev'),
    }),
  ]
});