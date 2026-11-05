/**
 * CSV download of every stat on /arastirma/meta-reklam-maliyetleri-2026/
 * (third-party figures with source + URL, and Rast's own aggregated ranges).
 */
import type { APIRoute } from "astro";
import { ALL_STATS, SOURCES, OWN, UPDATED } from "../../../data/arastirma/meta-reklam-maliyetleri-2026";

const q = (v: string) => `"${String(v).replace(/"/g, '""')}"`;

export const GET: APIRoute = () => {
  const rows: string[][] = [["bolum", "istatistik", "deger", "donem", "kaynak", "kaynak_baslik", "kaynak_tarih", "url"]];
  for (const r of OWN.rows) {
    const src = `Rast Creative yönettiği hesaplar (n=${OWN.accounts} hesap, ${OWN.campaigns} kampanya)`;
    const url = "https://rastcreative.com/arastirma/meta-reklam-maliyetleri-2026/";
    rows.push(["rast", `${r.goal}: sonuç başı maliyet (${r.n})`, r.result, OWN.period, src, "Meta Ads API, kampanya düzeyi", UPDATED, url]);
    rows.push(["rast", `${r.goal}: CPM`, r.cpm, OWN.period, src, "Meta Ads API, kampanya düzeyi", UPDATED, url]);
    rows.push(["rast", `${r.goal}: TO (tümü)`, r.ctr, OWN.period, src, "Meta Ads API, kampanya düzeyi", UPDATED, url]);
  }
  for (const o of OWN.overall) {
    rows.push(["rast", o.label, o.value, OWN.period, `Rast Creative yönettiği hesaplar (n=${OWN.accounts} hesap, ${OWN.campaigns} kampanya)`, "Meta Ads API, kampanya düzeyi", UPDATED, "https://rastcreative.com/arastirma/meta-reklam-maliyetleri-2026/"]);
  }
  for (const s of ALL_STATS) {
    const src = SOURCES[s.src];
    rows.push(["kaynak", s.label, s.value, s.period, src.name, src.title, src.date, src.url]);
  }
  const body = "\uFEFF" + rows.map((r) => r.map(q).join(",")).join("\r\n") + "\r\n";
  return new Response(body, { headers: { "Content-Type": "text/csv; charset=utf-8" } });
};
