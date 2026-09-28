/**
 * Çekim Günü step 1 — turn the Kling clips (.cache/cekim/src/sNN.mp4) into
 * 1080×1920 JPEG sequences under .cache/cekim/<id>/ that the page steps through.
 * Clips come from Kling as ~1076×1924 @ 24 fps; they are cover-cropped to the
 * stage and resampled to 30 fps (60 fps motion-interpolated for the slow-mo shot).
 *
 *   node automations/brand-film/cekim-gunu/prepare-cekim.mjs [--force]
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const cache = path.resolve(here, "../.cache/cekim");
const ffmpeg = process.env.FFMPEG || "ffmpeg";
// id → output fps (the page reads the same numbers from timing.js)
const SHOTS = { s01: 30, s02: 30, s03: 30, s04: 30, s05: 60, s06: 30, s07: 30, s08: 30, s09: 30, s10: 30 };

const manifest = {};
for (const [id, fps] of Object.entries(SHOTS)) {
  const src = path.join(cache, "src", `${id}.mp4`);
  if (!fs.existsSync(src)) throw new Error(`klip yok: ${src}`);
  const dir = path.join(cache, id);
  if (!fs.existsSync(dir) || process.argv.includes("--force")) {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const rate = fps === 60 ? "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:vsbmc=1" : `fps=${fps}`;
    const vf = `${rate},scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920`;
    execFileSync(ffmpeg, ["-loglevel", "error", "-i", src, "-vf", vf, "-q:v", "2", path.join(dir, "%04d.jpg")], { stdio: "inherit" });
  }
  manifest[id] = { fps, count: fs.readdirSync(dir).length };
  console.log(`✓ ${id} → ${manifest[id].count} kare @${fps}`);
}
fs.writeFileSync(path.join(cache, "manifest.json"), JSON.stringify(manifest));
