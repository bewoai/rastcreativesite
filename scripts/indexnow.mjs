// IndexNow ping after a deploy: tells Bing (and through it ChatGPT search /
// Copilot), Yandex, Seznam and Naver which pages changed, so they re-crawl
// within minutes instead of weeks.
//
// Usage: node scripts/indexnow.mjs <distDir> [prevDir]
//   prevDir = the previously deployed build. When given, only pages whose
//   HTML changed (or are new) are submitted; otherwise every indexable page.
import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const HOST = "rastcreative.com";
const KEY = "61a4c518938445e3800655abeb959f8b";
const [distDir, prevDir] = process.argv.slice(2);
if (!distDir) throw new Error("usage: indexnow.mjs <distDir> [prevDir]");

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name === "index.html") yield path;
  }
}

const exists = (p) => stat(p).then(() => true, () => false);
const urls = [];
for await (const file of htmlFiles(distDir)) {
  const html = await readFile(file, "utf8");
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) continue;
  const rel = relative(distDir, file).split(sep).slice(0, -1).join("/");
  if (prevDir) {
    const prev = join(prevDir, relative(distDir, file));
    if ((await exists(prev)) && (await readFile(prev, "utf8")) === html) continue;
  }
  urls.push(`https://${HOST}/${rel ? `${rel}/` : ""}`);
}

if (urls.length === 0) {
  console.log("IndexNow: no changed pages.");
  process.exit(0);
}
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls.slice(0, 10000),
  }),
});
console.log(`IndexNow: ${urls.length} URL → HTTP ${res.status}`);
urls.slice(0, 20).forEach((u) => console.log("  " + u));
if (!res.ok) process.exitCode = 1;
