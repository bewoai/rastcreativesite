/**
 * CSV download for /arastirma/sakarya-dijital-gorunurluk/ — aggregate rows only
 * (overall, by sector, by district). No business names (KVKK). Generated from the
 * same data file as the page.
 */
import type { APIRoute } from "astro";
import { METRICS, SECTORS, DISTRICTS, RATINGS, INDEX_NAME, INDEX_FINDINGS, UPDATED, PERIOD, MIN_N, type Rate } from "../../../data/arastirma/sakarya-dijital-gorunurluk";

const q = (v: string | number | null | boolean) => `"${String(v ?? "").replace(/"/g, '""')}"`;
const PAGE = "https://rastcreative.com/arastirma/sakarya-dijital-gorunurluk/";
const SRC = `Rast Creative, ${INDEX_NAME}`;

export const GET: APIRoute = () => {
  const rows: (string | number | null | boolean)[][] = [
    ["bolum", "olcu", "payda", "kirilim", "oran_yuzde", "evet", "n", "bilinmiyor", "ga95_alt", "ga95_ust", "yayinlandi", "donem", "kaynak", "url"],
  ];
  for (const s of INDEX_FINDINGS) rows.push(["endeks", s, "", "", "", "", "", "", "", "", true, PERIOD, SRC, PAGE]);
  // Cells below MIN_N are listed with their counts but without a rate (oran_yuzde empty).
  const add = (bolum: string, label: string, payda: string, kirilim: string, r: Rate) =>
    rows.push([bolum, label, payda, kirilim, r.yayin ? r.oran : "", r.evet, r.n, r.bilinmiyor, r.yayin ? r.gaAlt : "", r.yayin ? r.gaUst : "", r.yayin, PERIOD, SRC, PAGE]);
  for (const m of METRICS) add("genel", m.label, m.payda, "tümü", m.genel);
  for (const m of METRICS) for (const s of SECTORS) add("sektor", m.label, m.payda, s.name, m.sektor[s.key]);
  for (const m of METRICS) for (const d of DISTRICTS) add("ilce", m.label, m.payda, d.name, m.ilce[d.name]);
  for (const r of RATINGS)
    rows.push(["google_puan", "medyan puan / medyan yorum sayısı", "puanı görünen işletmeler", r.name, `${r.medianRating ?? ""} / ${r.medianReviews ?? ""}`, "", r.n, "", "", "", true, PERIOD, SRC, PAGE]);
  rows.push(["not", `Oran = evet / (evet + hayır); bilinmiyor paydadan düşüldü. n < ${MIN_N} olan kırılımlarda oran yayımlanmadı. Güncelleme ${UPDATED}.`, "", "", "", "", "", "", "", "", "", PERIOD, SRC, PAGE]);
  const body = "\uFEFF" + rows.map((r) => r.map(q).join(",")).join("\r\n") + "\r\n";
  return new Response(body, { headers: { "Content-Type": "text/csv; charset=utf-8" } });
};
