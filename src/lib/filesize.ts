import fs from "node:fs";
import path from "node:path";

/** Build-time size of a file under public/ ("/araclar/x.png" → "184 KB"), "" if missing. */
export function publicFileSize(href: string): string {
  try {
    const b = fs.statSync(path.join(process.cwd(), "public", decodeURIComponent(href))).size;
    if (b >= 1024 * 1024) return `${(b / 1024 / 1024).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} MB`;
    return `${Math.max(1, Math.round(b / 1024))} KB`;
  } catch {
    return "";
  }
}
/** "PNG", "SVG", "ZIP"… from a file name. */
export const fileExt = (f: string) => (f.split(".").pop() ?? "").toUpperCase();
