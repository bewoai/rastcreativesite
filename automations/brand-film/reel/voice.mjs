/**
 * Voice-over for the reel.
 *
 *   ELEVENLABS_API_KEY=… node automations/brand-film/reel/voice.mjs
 *
 * Reads vo.json and writes one mp3 per line to vo/ (committed: the current
 * takes were made with ElevenLabs, voice Aykut Akkaşoğlu, eleven_multilingual_v2).
 * Re-run only to change the script. With ELEVENLABS_API_KEY it calls the API; Without a key it
 * falls back to a placeholder neural voice via voice_edge.py so the edit can
 * be built and timed anyway. reel-audio.js trims leading silence and places
 * each line at its `start`.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "vo");
fs.mkdirSync(out, { recursive: true });
const { lines } = JSON.parse(fs.readFileSync(path.join(here, "vo.json"), "utf8"));
const key = process.env.ELEVENLABS_API_KEY;
const voice = process.env.ELEVENLABS_VOICE_ID || "VtLFdkOJSt8TuXqwEzD8"; // Aykut Akkaşoğlu

for (const [i, l] of lines.entries()) {
  const file = path.join(out, `${l.id}.mp3`);
  if (key) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_192`, {
      method: "POST",
      headers: { "xi-api-key": key, "content-type": "application/json", accept: "audio/mpeg" },
      body: JSON.stringify({
        text: l.text,
        model_id: process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2",
        language_code: "tr",
        previous_text: lines[i - 1]?.text,
        next_text: lines[i + 1]?.text,
        voice_settings: { stability: 0.42, similarity_boost: 0.82, style: 0.35, use_speaker_boost: true, speed: 0.92 },
      }),
    });
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  } else {
    execFileSync("python3", [path.join(here, "voice_edge.py"), "tr-TR-AhmetNeural", "-10%", "-6Hz", l.text, file], { stdio: "inherit" });
  }
  console.log(`✓ ${l.id} ${key ? "(ElevenLabs)" : "(yer tutucu)"} — ${l.text}`);
}

