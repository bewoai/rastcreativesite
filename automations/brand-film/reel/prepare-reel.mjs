/**
 * Reel step 1 — cut every shot into a 1080×1920 JPEG sequence (.cache/reel/<id>/)
 * and measure voice-over timing (.cache/reel/vo-timing.json).
 * Shots slower than 0.8× get motion-interpolated to 60 fps first, so slow
 * motion stays smooth instead of stuttering on duplicated frames.
 *
 *   node automations/brand-film/reel/prepare-reel.mjs
 */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const cache = path.resolve(here, "../.cache/reel");
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const { shots, sources = {} } = JSON.parse(fs.readFileSync(path.join(here, "shots.json"), "utf8"));
const manifest = {};
const driveDir = path.resolve(here, "../.cache/drive");

/** Local file for a source: site footage, else the studio's Drive archive
 *  (downloaded once; the folder is link-shared). */
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
function probe(file) {
  const r = spawnSync(ffmpeg, ["-hide_banner", "-i", file], { encoding: "utf8" });
  const m = r.stderr.match(/Video:.*?(\d{3,5})x(\d{3,5}).*?([\d.]+) fps/);
  return { w: +m[1], h: +m[2], fps: +m[3] };
}

for (const s of shots) {
  if (s.src === "photo") continue;
  const dir = path.join(cache, s.id);
  const file = sourceFile(s.src);
  const info = probe(file);
  const slow = s.sp < 0.8;
  const fps = slow ? 60 : 30;
  const span = (s.d + 0.5) * s.sp + 0.1; // + transition handles
  if (!fs.existsSync(dir) || process.argv.includes("--force")) {
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    // Landscape sources (16:9 films) → a 9:16 slice at cx.
    const crop = info.w > info.h ? `crop=ih*9/16:ih:(iw-ih*9/16)*${s.cx ?? 0.5}:0` : null;
    // 50–60p sources already hold real slow-motion frames; only 24–30p gets interpolated.
    const time = !slow ? "fps=30" : info.fps >= 49 ? "fps=60" : "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1";
    const vf = [crop, time, "scale=1080:1920:flags=lanczos"].filter(Boolean).join(",");
    execFileSync(ffmpeg, ["-loglevel", "error", "-ss", String(Math.max(0, s.in - 0.25)), "-i",
      file, "-t", String(span + 0.25), "-vf", vf, "-q:v", "2",
      path.join(dir, "%04d.jpg")], { stdio: "inherit" });
  }
  // Frames before s.in are the 0.25 s pre-roll used by incoming transitions.
  manifest[s.id] = { fps, count: fs.readdirSync(dir).length, pre: Math.min(0.25, s.in) };
  console.log(`✓ ${s.id} ${s.src} @${s.in}s ×${s.sp} → ${manifest[s.id].count} kare`);
}
fs.writeFileSync(path.join(cache, "manifest.json"), JSON.stringify(manifest));

// Voice-over: where speech really starts and ends inside each file.
const vo = JSON.parse(fs.readFileSync(path.join(here, "vo.json"), "utf8")).lines;
const timing = vo.map((l) => {
  const f = path.join(here, "vo", `${l.id}.mp3`);
  const r = spawnSync(ffmpeg, ["-hide_banner", "-i", f, "-af", "silencedetect=n=-42dB:d=0.1", "-f", "null", "-"], { encoding: "utf8" });
  const dur = +r.stderr.match(/Duration: (\d+):(\d+):([\d.]+)/).slice(1).reduce((a, v, i) => a + v * [3600, 60, 1][i], 0);
  const starts = [...r.stderr.matchAll(/silence_start: ([\d.]+)/g)].map((m) => +m[1]);
  const ends = [...r.stderr.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
  const lead = starts[0] === 0 ? ends[0] : 0;
  const tail = starts.filter((s) => s > lead).pop();
  const speech = (tail && tail > lead ? tail : dur) - lead;
  if (speech > l.max) console.warn(`! ${l.id} ${speech.toFixed(2)} sn > slot ${l.max} sn`);
  return { ...l, lead, speech };
});
fs.writeFileSync(path.join(cache, "vo-timing.json"), JSON.stringify(timing, null, 2));
console.log("✓ vo-timing.json", timing.map((l) => `${l.id}:${l.speech.toFixed(2)}`).join(" "));
