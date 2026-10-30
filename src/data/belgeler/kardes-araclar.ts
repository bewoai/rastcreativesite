/**
 * Sibling free tools/guides, linked from the production-document pages
 * (/araclar/storyboard-sablonu/, brief-formu, cekim-kontrol-listesi,
 * cekim-izin-formu, cekim-plani). BelgeSayfasi.astro only renders the ones
 * whose page actually exists in src/pages at build time, so a sibling that
 * hasn't shipped yet never becomes a broken link — it appears on the next build.
 */
import fs from "node:fs";
import nodePath from "node:path";

export const KARDES_ARACLAR: Record<string, string> = {
  "/araclar/storyboard-sablonu/": "Storyboard ve plan listesi şablonu",
  "/araclar/brief-formu/": "Video brief formu",
  "/araclar/cekim-kontrol-listesi/": "Çekim günü kontrol listesi",
  "/araclar/cekim-izin-formu/": "Görüntü ve ses kullanım izin formu",
  "/araclar/cekim-plani/": "Çekim planı (call sheet) oluşturucu",
  "/araclar/guvenli-alan/": "Reels / TikTok / Shorts güvenli alan kontrolü",
  "/araclar/en-boy-orani/": "En-boy oranı hesaplayıcı",
  "/araclar/bitrate-hesaplayici/": "Bitrate ve dosya boyutu hesaplayıcı",
  "/rehber/video-export-ayarlari/": "Video export ayarları rehberi",
  "/araclar/altyazi-kontrolu/": "Altyazı kontrolü",
  "/araclar/instagram-grid-sablonu/": "Instagram grid şablonu",
  "/araclar/kapak-sablonlari/": "Kapak şablonları",
  "/araclar/sfx-paketi/": "Ücretsiz ses efekti (SFX) paketi",
  "/araclar/lut-paketi/": "Ücretsiz LUT paketi",
  "/cekim-planlayici/": "Çekim günü planlayıcı: tek çekimden hangi içerikler çıkar?",
};

/** True when a route for `path` exists (page file or a content entry with that slug). Build-time only. */
export function routeExists(path: string): boolean {
  const p = path.replace(/^\/|\/$/g, "");
  const root = process.cwd();
  const cands = [
    `src/pages/${p}.astro`,
    `src/pages/${p}/index.astro`,
    `src/pages/${p}.md`,
    `src/pages/${p}.mdx`,
    `src/content/${p}.md`,
    `src/content/${p}.mdx`,
    `src/content/${p}/index.md`,
  ];
  return cands.some((c) => fs.existsSync(nodePath.join(root, c)));
}

export function relatedTools(paths: string[], self: string) {
  return paths
    .filter((p) => p !== self && KARDES_ARACLAR[p] && routeExists(p))
    .map((p) => ({ href: p, name: KARDES_ARACLAR[p] }));
}
