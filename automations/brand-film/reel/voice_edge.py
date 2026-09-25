# Placeholder Turkish voice (Microsoft Edge neural TTS) used only when no ElevenLabs key is set.
# usage: python3 voice_edge.py <voice> <rate> <pitch> <text> <out.mp3>
import sys, asyncio, certifi
import os
if os.environ.get("EDGE_CA_BUNDLE"): certifi.where = lambda: os.environ["EDGE_CA_BUNDLE"]
import edge_tts
async def main(voice, rate, pitch, text, out):
    c = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    subs = []
    with open(out, "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio": f.write(ch["data"])
            elif ch["type"] in ("WordBoundary", "SentenceBoundary"): subs.append((ch["offset"]/1e7, ch["duration"]/1e7, ch["text"]))
    with open(out + ".json", "w") as f:
        import json; json.dump(subs, f, ensure_ascii=False)
asyncio.run(main(*sys.argv[1:]))
