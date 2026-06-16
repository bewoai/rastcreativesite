// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Canonical origin — used for canonical URLs, OG tags and (Faz 5) sitemap.
  site: 'https://rastcreative.com',

  build: { inlineStylesheets: 'never' },

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
