// Usage: node shoot.mjs jobs.json
// jobs: [{url, out, w, h, mobile, full, js (string, awaited), wait(ms), clip:{x,y,width,height}, scale}]
import { spawn } from "node:child_process";
import fs from "node:fs";
const CH = process.env.CHROME || process.env.HOME + "/.hermes/tools/chromium-1208/chrome-linux64/chrome";
const L = process.env.CHROME_LIBS || process.env.HOME + "/.hermes/tools/chrome-libs/root/usr/lib/x86_64-linux-gnu";
const port = 9400 + Math.floor(Math.random() * 400);
const jobs = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const ch = spawn(CH, ["--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${port}`, "--user-data-dir=" + (process.env.TMPDIR || "/tmp") + "/rast-kart-prof" + port, "about:blank"], { env: { ...process.env, LD_LIBRARY_PATH: L }, stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 50; i++) {
  try {
    const r = await fetch(`http://127.0.0.1:${port}/json/list`);
    const t = (await r.json()).find((x) => x.type === "page");
    if (t) { ws = new WebSocket(t.webSocketDebuggerUrl); break; }
  } catch {}
  await sleep(200);
}
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map(); const events = [];
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } else if (d.method) events.push(d); };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Page.enable"); await send("Runtime.enable");
const logs = [];
for (const j of jobs) {
  const w = j.w || 1440, h = j.h || 900;
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: j.scale || 1, mobile: !!j.mobile });
  await send("Emulation.setTouchEmulationEnabled", { enabled: !!j.mobile });
  events.length = 0;
  await send("Page.navigate", { url: j.url });
  for (let k = 0; k < 100; k++) { await sleep(100); if (events.find((e) => e.method === "Page.loadEventFired")) break; }
  await sleep(j.wait ?? 800);
  await send("Runtime.evaluate", { expression: "document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('is-revealed'));document.documentElement.classList.add('is-revealed')", awaitPromise: true });
  if (j.full) {
    await send("Runtime.evaluate", { expression: "(async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}scrollTo(0,0);await new Promise(r=>setTimeout(r,500));})()", awaitPromise: true });
  }
  if (j.js) {
    const r = await send("Runtime.evaluate", { expression: `(async()=>{${j.js}})()`, awaitPromise: true, returnByValue: true });
    logs.push({ out: j.out, result: r.result?.result?.value, err: r.result?.exceptionDetails?.exception?.description });
    await sleep(j.after ?? 600);
  }
  const errs = events.filter((e) => e.method === "Runtime.exceptionThrown").map((e) => e.params.exceptionDetails?.exception?.description?.slice(0, 200));
  if (errs.length) logs.push({ out: j.out, jsErrors: errs });
  if (j.out) {
    const p = { format: j.out.endsWith(".png") ? "png" : "jpeg", quality: 92, captureBeyondViewport: !!j.full };
    if (j.full) {
      const m = await send("Page.getLayoutMetrics");
      const ch2 = Math.min(Math.ceil(m.result.cssContentSize.height), j.maxH || 9000);
      p.clip = { x: 0, y: 0, width: w, height: ch2, scale: 1 };
    }
    if (j.clip) p.clip = { ...j.clip, scale: 1 };
    const rv = logs.length && logs[logs.length - 1].out === j.out ? logs[logs.length - 1].result : null;
    if (rv && rv.clip) { p.clip = { ...rv.clip, scale: 1 }; p.captureBeyondViewport = true; }
    const s = await send("Page.captureScreenshot", p);
    fs.writeFileSync(j.out, Buffer.from(s.result.data, "base64"));
  }
}
console.log(JSON.stringify(logs, null, 1));
ws.close(); ch.kill("SIGKILL");
process.exit(0);
