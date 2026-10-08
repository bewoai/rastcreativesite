// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// Unlisted project pages (content.hidden: true, e.g. Adatıp) stay reachable
// by direct URL with a `noindex` meta tag, but must not appear in the
// sitemap either — sitemap should only list pages we want indexed/found.
const isHiddenProjectPage = (page) =>
  new URL(page).pathname.startsWith('/projeler/adatip-');

// Single pages that ship with a `noindex` robots meta while they wait for an
// owner decision. Keep this list in sync with each page's ROBOTS constant:
// when a page is approved, set its ROBOTS to undefined AND remove it here.
const NOINDEX_PATHS = new Set([
  '/hekim-icerik-sistemi/', // prices provisional
  '/projeler/vaka/duygu-hoca/', // client approval for the case study
  '/projeler/vaka/dr-erdem-caliskan/', // client approval for the case study
]);
const isNoindexPage = (page) => NOINDEX_PATHS.has(new URL(page).pathname);

// https://astro.build/config
export default defineConfig({
  // Canonical origin — used for canonical URLs, OG tags and (Faz 5) sitemap.
  site: 'https://rastcreative.com',

  trailingSlash: 'always',

  devToolbar: {
    enabled: false,
  },

  build: { inlineStylesheets: 'always' },

  // Homepage case posters come from YouTube; fetch and resize them at build
  // time so phones get a ~40 KB WebP instead of a 120–330 KB maxres frame.
  image: { domains: ['i.ytimg.com'] },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['aria-query', 'axobject-query', 'astro/dist/runtime/client/dev-toolbar/entrypoint.js'],
    },
  },

  integrations: [
    sitemap({
      customSitemaps: ['https://rastcreative.com/video-sitemap.xml'],
      // Keep the temporary component gallery and hidden/noindex projects out.
      // All service × location pages are indexable after the content-quality pass.
      filter: (page) => !page.includes('/dev') && !page.includes('/taslak') && !page.includes('/tesekkurler') && !isHiddenProjectPage(page) && !isNoindexPage(page),
    }),
  ]
});
