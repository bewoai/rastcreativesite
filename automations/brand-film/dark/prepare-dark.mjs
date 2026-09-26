/**
 * Dark creative step 1 — cut the real-work clips the film shows (gallery ring
 * + footage-filled slam words) into small JPEG sequences under .cache/dark/<id>/.
 *
 *   node automations/brand-film/dark/prepare-dark.mjs [--force]
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const cache = path.resolve(here, "../.cache/dark");
const driveDir = path.resolve(here, "../.cache/drive");
const ffmpeg = process.env.FFMPEG || "ffmpeg";
// Drive IDs of the studio's archive live with the Reel's shot list.
const { sources = {} } = JSON.parse(fs.readFileSync(path.resolve(here, "../reel/shots.json"), "utf8"));
const { clips } = JSON.parse(fs.readFileSync(path.join(here, "clips.json"), "utf8"));

function sourceFile(src) {
  const site = path.join(root, "public/videos/projeler", `${src}.mp4`);
  if (fs.existsSync(site)) return site;
  const local = path.join(driveDir, `${src}.mp4`);
  if (!fs.existsSync(local)) {
    if (!sources[src]?.drive) throw new Error(`kaynak yok: ${src}`);
    fs.mkdirSync(driveDir, { recursive: true });
    console.log(`↓ ${src} (Drive)`);
    execFileSync("curl", ["-sSL", "-o", local, `https://drive.usercontent.google.com/download?id=${sources[src].drive}&export=download&confirm=t`], { stdio: "inherit" });
  }
  return local;
}

const manifest = {};
for (const c of clips) {
  const dir = path.join(cache, c.id);
  const [w, h] = c.size;
  if (!fs.existsSync(dir) || process.argv.includes("--force")) {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    // Cover-crop any source (16:9 or 9:16) to the target box, horizontal anchor cx.
    const vf = `fps=30,scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,crop=${w}:${h}:(iw-${w})*${c.cx ?? 0.5}:(ih-${h})/2`;
    execFileSync(ffmpeg, ["-loglevel", "error", "-ss", String(c.in), "-i", sourceFile(c.src), "-t", String(c.d),
      "-vf", vf, "-q:v", "3", path.join(dir, "%04d.jpg")], { stdio: "inherit" });
  }
  manifest[c.id] = { count: fs.readdirSync(dir).length };
  console.log(`✓ ${c.id} ${c.src} @${c.in}s → ${manifest[c.id].count} kare`);
}
fs.writeFileSync(path.join(cache, "manifest.json"), JSON.stringify(manifest));
