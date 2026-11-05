/**
 * CSV download of every stat on /arastirma/reels-istatistikleri-2026/
 * (third-party figures with source + URL, and Rast's own aggregated data).
 */
import type { APIRoute } from "astro";
import { ALL_STATS, SOURCES, OWN_PAID, OWN_ORGANIC, UPDATED } from "../../../data/arastirma/reels-istatistikleri-2026";

const q = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
const PAGE = "https://rastcreative.com/arastirma/reels-istatistikleri-2026/";

export const GET: APIRoute = () => {
  const rows: string[][] = [["bolum", "istatistik", "deger", "donem", "kaynak", "kaynak_baslik", "kaynak_tarih", "url"]];
  const paidSrc = `Rast Creative yönettiği hesaplar (n=${OWN_PAID.accounts} hesap, ${OWN_PAID.campaigns} kampanya)`;
  for (const r of OWN_PAID.rows) {
    const add = (k: string, v: string) =>
      rows.push(["rast_reklam", `${r.goal}: ${k} (${r.n})`, v, OWN_PAID.period, paidSrc, "Meta Ads API, kampanya düzeyi", UPDATED, PAGE]);
    add("ThruPlay başı maliyet (TL, KDV hariç)", r.thruCost);
    add("CPM (TL, KDV hariç)", r.cpm);
    add("ThruPlay oranı (ThruPlay / oynatma)", r.thruRate);
    add("videonun %25'ini izleyen / oynatma", r.p25);
    add("sonuna kadar izleyen / oynatma", r.p100);
  }
  const o = OWN_ORGANIC;
  const orgSrc = `Rast Creative Instagram hesabı (n=${o.reels} Reels)`;
  const org: [string, string][] = [
    ["Reels başına medyan izlenme", o.medianViews],
    ["Takipçi sayısını aşan izlenme alan Reels", `${o.aboveFollowers} / ${o.reels}`],
    ["En çok izlenen Reels: izlenme", o.peakViews],
    ["En çok izlenen Reels: erişim", o.peakReach],
    ["En çok izlenen Reels: izlenme / takipçi", o.peakRatio],
    ["1.000 izlenme başına paylaşım (en çok izlenen / diğerlerinin medyanı)", `${o.peakSharesPer1k} / ${o.othersSharesPer1k}`],
    ["1.000 izlenme başına kaydetme (en çok izlenen / diğerlerinin medyanı)", `${o.peakSavesPer1k} / ${o.othersSavesPer1k}`],
    ["Atlanma oranı (en çok izlenen / medyan)", `${o.peakSkip} / ${o.medianSkip}`],
    ["Ortalama izlenme süresi (en çok izlenen / medyan)", `${o.peakAvgWatch} / ${o.medianAvgWatch}`],
  ];
  for (const [k, v] of org) rows.push(["rast_organik", k, v, o.period, orgSrc, "Instagram istatistikleri", UPDATED, PAGE]);
  for (const s of ALL_STATS) {
    const src = SOURCES[s.src];
    rows.push(["kaynak", s.label, s.value, s.period, src.name, s.note ? `${src.title}, ${s.note}` : src.title, src.date, src.url]);
  }
  const body = "\uFEFF" + rows.map((r) => r.map(q).join(",")).join("\r\n") + "\r\n";
  return new Response(body, { headers: { "Content-Type": "text/csv; charset=utf-8" } });
};
