// Client helpers shared by the creator tool pages (no dependencies).

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes: Uint8Array) {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function textChunk(key: string, val: string) {
  const data = new TextEncoder().encode(`${key}\0${val}`); // keep values ASCII
  const out = new Uint8Array(12 + data.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length);
  out.set([0x74, 0x45, 0x58, 0x74], 4);
  out.set(data, 8);
  dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

/** Insert tEXt chunks (author/source/license) right after IHDR. */
export function pngWithMeta(png: Uint8Array, source: string, software: string, license = "CC BY 4.0 (overlay/guides); your own footage stays yours") {
  const chunks = [
    textChunk("Author", "Rast Creative Studio"),
    textChunk("Source", source),
    textChunk("License", license),
    textChunk("Software", software),
  ];
  const at = 33;
  const size = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(png.length + size);
  out.set(png.subarray(0, at), 0);
  let o = at;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  out.set(png.subarray(at), o);
  return out;
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function exportCanvasPng(canvas: HTMLCanvasElement, name: string, source: string, software: string, license?: string) {
  canvas.toBlob(async (blob) => {
    if (!blob) return;
    const bytes = pngWithMeta(new Uint8Array(await blob.arrayBuffer()), source, software, license);
    downloadBlob(new Blob([bytes], { type: "image/png" }), name);
  }, "image/png");
}

/** Small, semi-transparent Rast credit (logo + two lines) on a canvas. */
export function drawCredit(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement,
  x: number,
  y: number,
  scale: number,
  path: string,
  align: "left" | "right" = "left",
) {
  const lh = 34 * scale;
  ctx.save();
  ctx.globalAlpha = 0.62;
  ctx.font = `700 ${19 * scale}px system-ui, sans-serif`;
  const l1 = "Rast Creative Studio";
  const l2 = `rastcreative.com${path}`;
  const w1 = ctx.measureText(l1).width;
  ctx.font = `500 ${17 * scale}px system-ui, sans-serif`;
  const w2 = ctx.measureText(l2).width;
  const lw = logo.complete && logo.naturalWidth ? (logo.naturalWidth / logo.naturalHeight) * lh : 0;
  const total = lw + (lw ? 14 * scale : 0) + Math.max(w1, w2);
  const x0 = align === "right" ? x - total : x;
  if (lw) ctx.drawImage(logo, x0, y, lw, lh);
  const tx = x0 + lw + (lw ? 14 * scale : 0);
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "rgba(0,0,0,.6)";
  ctx.shadowBlur = 4 * scale;
  ctx.textAlign = "left";
  ctx.font = `700 ${19 * scale}px system-ui, sans-serif`;
  ctx.fillText(l1, tx, y + 15 * scale);
  ctx.font = `500 ${17 * scale}px system-ui, sans-serif`;
  ctx.fillText(l2, tx, y + 34 * scale);
  ctx.restore();
}

export function loadLogo() {
  const logo = new Image();
  logo.src = "/araclar/guvenli-alan/rast-logo-beyaz.png";
  return logo;
}

/** Wire a drop zone + file input. */
export function wireDrop(drop: HTMLElement, input: HTMLInputElement, onFiles: (files: File[]) => void) {
  input.addEventListener("change", () => input.files && input.files.length && onFiles([...input.files]));
  ["dragenter", "dragover"].forEach((e) =>
    drop.addEventListener(e, (ev) => {
      ev.preventDefault();
      drop.classList.add("is-over");
    }),
  );
  ["dragleave", "drop"].forEach((e) => drop.addEventListener(e, () => drop.classList.remove("is-over")));
  drop.addEventListener("drop", (ev) => {
    ev.preventDefault();
    const fl = (ev as DragEvent).dataTransfer?.files;
    if (fl && fl.length) onFiles([...fl]);
  });
}

export const isVideoFile = (f: File) => f.type.startsWith("video/") || /\.(mp4|mov|webm|m4v)$/i.test(f.name);
export const isImageFile = (f: File) => /^image\/(jpeg|png|webp|gif|avif)$/.test(f.type) || /\.(jpe?g|png|webp|gif|avif)$/i.test(f.name);
export const fmtTime = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

/** Map a pointer event on a CSS-scaled canvas to canvas pixels. */
export function canvasPoint(canvas: HTMLCanvasElement, ev: PointerEvent | MouseEvent) {
  const r = canvas.getBoundingClientRect();
  return { x: ((ev.clientX - r.left) / r.width) * canvas.width, y: ((ev.clientY - r.top) / r.height) * canvas.height };
}
