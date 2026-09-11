// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// Unlisted project pages (content.hidden: true, e.g. Adatıp) stay reachable
// by direct URL with a `noindex` meta tag, but must not appear in the
// sitemap either — sitemap should only list pages we want indexed/found.
const isHiddenProjectPage = (page) =>
  new URL(page).pathname.startsWith('/projeler/adatip-');

// https://astro.build/config
export default defineConfig({
  // Canonical origin — used for canonical URLs, OG tags and (Faz 5) sitemap.
  site: 'https://rastcreative.com',

  trailingSlash: 'always',

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
      // Keep the temporary component gallery and hidden/noindex projects out.
      // All service × location pages are indexable after the content-quality pass.
      filter: (page) => !page.includes('/dev') && !page.includes('/tesekkurler') && !isHiddenProjectPage(page),
    }),
  ]
});
