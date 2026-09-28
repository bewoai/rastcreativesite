/**
 * Çekim Günü (papercraft) step 1 — Kling clips (clips/pNN.mp4, ~1072×1928 @ 24 fps)
 * → 1080×1920 JPEG sequences at 30 fps (60 fps motion-interpolated for the slow-mo shot)
 * under .cache/cekim-paper/<id>/.
 *
 *   node automations/brand-film/cekim-paper/prepare-paper.mjs [--force]
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const cache = path.resolve(here, "../.cache/cekim-paper");
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const SLOW = new Set(["p07"]);
const manifest = {};
for (const f of fs.readdirSync(path.join(here, "clips")).filter((f) => f.endsWith(".mp4")).sort()) {
  const id = f.replace(".mp4", ""), fps = SLOW.has(id) ? 60 : 30, dir = path.join(cache, id);
  if (!fs.existsSync(dir) || process.argv.includes("--force")) {
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const rate = fps === 60 ? "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:vsbmc=1" : "fps=30";
    execFileSync(ffmpeg, ["-loglevel", "error", "-i", path.join(here, "clips", f), "-vf",
      `${rate},scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920`, "-q:v", "2", path.join(dir, "%04d.jpg")], { stdio: "inherit" });
  }
  manifest[id] = { fps, count: fs.readdirSync(dir).length };
  console.log(`✓ ${id} → ${manifest[id].count} kare @${fps}`);
}
fs.writeFileSync(path.join(cache, "manifest.json"), JSON.stringify(manifest));
