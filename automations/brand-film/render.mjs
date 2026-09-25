/**
 * Step 2 — render the film.
 *
 *   node automations/brand-film/render.mjs                 # full film → out/
 *   node automations/brand-film/render.mjs --stills 3.4,8,21.5   # PNG checks
 *   node automations/brand-film/render.mjs --from 17 --to 28      # frame range only
 *
 * Needs: playwright-core (npm i --no-save playwright-core), a Chromium
 * (CHROMIUM env var, default: Playwright's bundled one) and ffmpeg with
 * libx264 (FFMPEG env var, default `ffmpeg`).
 *
 * The page is served from the repo root, so the composition reads the
 * site's real fonts, photos, logos and footage — nothing is copied.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const cache = path.join(here, ".cache");
const outDir = path.join(here, "out");
const ffmpeg = process.env.FFMPEG || "ffmpeg";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith("--")) acc.push([a.slice(2), all[i + 1]?.startsWith("--") ? true : all[i + 1] ?? true]);
    return acc;
  }, []),
);
const WORKERS = Number(args.workers || 4);

/* ───── static server (repo root) ───── */
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".avif": "image/avif", ".woff2": "font/woff2", ".mp4": "video/mp4",
};
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream", "cache-control": "max-age=3600" });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const URL0 = `http://127.0.0.1:${server.address().port}/automations/brand-film/composition.html`;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || undefined,
  args: ["--force-color-profile=srgb", "--font-render-hinting=none", "--disable-lcd-text"],
});
async function openPage() {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.error("pageerror:", e.message));
  page.on("console", (m) => m.type() === "error" && console.error("console:", m.text()));
  page.on("response", (r) => r.status() >= 400 && console.error("http", r.status(), r.url()));
  await page.goto(URL0);
  await page.evaluate(() => window.__ready);
  return page;
}

try {
  const meta = await (await openPage()).evaluate(() => window.__meta);

  /* ───── soundtrack only ───── */
  if (args["audio-only"]) {
    const page = await openPage();
    const b64 = await page.evaluate(() => window.__audio());
    fs.writeFileSync(path.join(cache, "soundtrack.wav"), Buffer.from(b64, "base64"));
    console.log("✓ soundtrack.wav");
  } else if (args.stills) {
    /* ───── stills for checking ───── */
    const page = await openPage();
    const dir = path.join(cache, "stills");
    fs.mkdirSync(dir, { recursive: true });
    for (const s of String(args.stills).split(",")) {
      const t = Number(s);
      await page.evaluate((t) => window.__render(t), t);
      const file = path.join(dir, `t${t.toFixed(2).padStart(6, "0")}.png`);
      await page.screenshot({ path: file });
      console.log("✓", file);
    }
  } else {
    /* ───── frames ───── */
    const framesDir = path.join(cache, "frames");
    fs.mkdirSync(framesDir, { recursive: true });
    const total = Math.round(meta.duration * meta.fps);
    const first = Math.round(Number(args.from || 0) * meta.fps);
    const last = Math.min(total, Math.round(Number(args.to || meta.duration) * meta.fps));
    const todo = [];
    for (let f = first; f < last; f++) {
      const file = path.join(framesDir, `${String(f).padStart(5, "0")}.jpg`);
      if (!args.force && fs.existsSync(file)) continue;
      todo.push(f);
    }
    console.log(`frames ${first}–${last} · ${todo.length} to render · ${WORKERS} workers`);
    const started = Date.now();
    let done = 0;
    const chunk = Math.ceil(todo.length / WORKERS);
    await Promise.all(
      Array.from({ length: WORKERS }, async (_, w) => {
        const mine = todo.slice(w * chunk, (w + 1) * chunk);
        if (!mine.length) return;
        const page = await openPage();
        for (const f of mine) {
          await page.evaluate((t) => window.__render(t), f / meta.fps);
          await page.screenshot({ path: path.join(framesDir, `${String(f).padStart(5, "0")}.jpg`), type: "jpeg", quality: 94 });
          if (++done % 60 === 0) {
            const rate = done / ((Date.now() - started) / 1000);
            console.log(`  ${done}/${todo.length} · ${rate.toFixed(1)} fps · ~${Math.round((todo.length - done) / rate)} s left`);
          }
        }
        await page.close();
      }),
    );

    /* ───── soundtrack ───── */
    const wav = path.join(cache, "soundtrack.wav");
    if (args.force || args.audio || !fs.existsSync(wav)) {
      const page = await openPage();
      const b64 = await page.evaluate(() => window.__audio());
      fs.writeFileSync(wav, Buffer.from(b64, "base64"));
      console.log("✓ soundtrack.wav");
    }

    /* ───── encode ───── */
    if (!args.from && !args.to) {
      fs.mkdirSync(outDir, { recursive: true });
      const out = path.join(outDir, args.master ? "rast-creative-tanitim-dikey-20mbps.mp4" : "rast-creative-tanitim-dikey.mp4");
      await new Promise((resolve, reject) => {
        const p = spawn(ffmpeg, [
          "-y", "-loglevel", "error", "-stats",
          "-framerate", String(meta.fps), "-i", path.join(framesDir, "%05d.jpg"),
          "-i", wav,
          // Capped VBR: Reels/Shorts re-encode anyway; 6 Mbps keeps the grain
          // clean while the file stays small enough to share.
          // --master: 20 Mbps archive/delivery copy (same frames, higher bitrate).
          ...(args.master
            ? ["-c:v", "libx264", "-preset", "slow", "-b:v", "20M", "-maxrate", "26M", "-bufsize", "40M", "-tune", "film"]
            : ["-c:v", "libx264", "-preset", "slow", "-crf", "20", "-maxrate", "6M", "-bufsize", "12M", "-tune", "film"]),
          "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.2",
          "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
          "-c:a", "aac", "-b:a", args.master ? "320k" : "224k", "-ar", "48000",
          "-movflags", "+faststart", "-shortest", out,
        ], { stdio: "inherit" });
        p.on("exit", (c) => (c === 0 ? resolve() : reject(new Error("ffmpeg " + c))));
      });
      console.log("✓", out);
    }
  }
} finally {
  await browser.close();
  server.close();
}
