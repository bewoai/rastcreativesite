// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

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
      // keep the temporary component gallery out of the sitemap
      filter: (page) => !page.includes('/dev'),
    }),
  ]
});
