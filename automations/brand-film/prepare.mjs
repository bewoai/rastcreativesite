/**
 * Step 1 — cut the real project clips into still-frame sequences.
 *
 * The composition never plays <video> elements: seeking a video per frame is
 * slow and not frame-accurate in headless Chromium. Instead every clip used in
 * the film is exported once as a numbered JPEG sequence, and the timeline just
 * swaps <img> sources. Output goes to .cache/ (git-ignored).
 *
 *   node automations/brand-film/prepare.mjs
 *
 * FFMPEG env var overrides the ffmpeg binary (default: `ffmpeg` on PATH).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CLIPS } from "./clips.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const cache = path.join(here, ".cache", "clips");

for (const clip of CLIPS) {
  const out = path.join(cache, clip.id);
  const src = path.join(root, "public/videos/projeler", `${clip.src}.mp4`);
  const expected = Math.round(clip.dur * 30);
  if (fs.existsSync(out) && fs.readdirSync(out).length >= expected) {
    console.log(`✓ ${clip.id} (cached)`);
    continue;
  }
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  execFileSync(
    ffmpeg,
    [
      "-loglevel", "error",
      "-ss", String(clip.from),
      "-i", src,
      "-t", String(clip.dur),
      "-vf", `fps=30,scale=${clip.w}:-2:flags=lanczos`,
      "-q:v", "3",
      path.join(out, "%04d.jpg"),
    ],
    { stdio: "inherit" },
  );
  console.log(`✓ ${clip.id} → ${fs.readdirSync(out).length} frames`);
}

// Frame counts per clip — a source can end before `dur`, and the timeline
// must clamp to what actually exists.
const manifest = Object.fromEntries(
  CLIPS.map((c) => [c.id, fs.readdirSync(path.join(cache, c.id)).length]),
);
fs.writeFileSync(path.join(cache, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("✓ manifest.json");
