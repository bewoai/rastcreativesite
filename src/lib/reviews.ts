/**
 * Google reviews for the homepage: the real list (or, while it is empty, the
 * labelled test fixture in dev / local REVIEWS_FIXTURE=1 builds), checked and
 * formatted. A bad entry stops the build with a message naming the review and
 * the field: the owner edits a .ts file by hand and `astro build` runs no
 * type check, so nothing wrong may ship silently.
 */
import { GOOGLE_RATING, GOOGLE_REVIEWS, type GoogleRating, type GoogleReview } from "../data/google-reviews";
import { FIXTURE_RATING, FIXTURE_REVIEWS } from "../data/google-reviews.fixture";

const flag = process.env.REVIEWS_FIXTURE;
// Dev shows the sample by default (REVIEWS_FIXTURE=0 shows the empty state);
// a build only with REVIEWS_FIXTURE=1. Real data always wins.
export const reviewsAreFixture =
  GOOGLE_REVIEWS.length === 0 && (flag === "1" || (import.meta.env.DEV && flag !== "0"));
// Builds only: a dev server in a CI-flagged shell (some sandboxes) may still show it.
if (reviewsAreFixture && process.env.CI && !import.meta.env.DEV)
  throw new Error("[google-reviews] REVIEWS_FIXTURE CI'da kullanılamaz: örnek yorumlar yayına çıkamaz.");
if (reviewsAreFixture && !import.meta.env.DEV)
  console.warn("[google-reviews] REVIEWS_FIXTURE=1: ÖRNEK yorumlarla derlendi. Bu build yayına alınmamalı.");

export const reviews: readonly GoogleReview[] = reviewsAreFixture ? FIXTURE_REVIEWS : GOOGLE_REVIEWS;
export const reviewRating: GoogleRating | null = reviewsAreFixture ? FIXTURE_RATING : GOOGLE_RATING;

/** The rest are one link away on Google. */
export const REVIEWS_ON_HOME = 12;
/** Open on the page; the rest wait behind one control. */
export const REVIEWS_OPEN = 3;
/* Lengths are in code points. A text rests at 6 lines behind "Devamını
 * okuyun" only where it is sure to run longer, so the control always opens
 * real text. They pair with the measures of .ev-review__text (index.astro,
 * "Reviews"): one column at most 33rem, three across at most ~317px (≥1100px).
 * Six lines there held at most 403 and 246 chars (Turkish made of very short
 * words; typical text 365 and 215). Change them together. */
/** Over this: 6 lines in every layout. */
export const LONG_AT = 450;
/** Over this: 6 lines three across, where a row is as tall as its tallest card
 *  (a 426-char text stood at 15 lines beside a clamped one); whole in one column. */
export const MID_AT = 260;
/** Up to this (about two lines, also three across), a serif pull-quote. */
export const SHORT_AT = 50;

const homeReviews = reviews.slice(0, REVIEWS_ON_HOME);
// Four would leave a lone "Diğer 1 yorumu okuyun": show them all.
export const openReviews = homeReviews.length <= REVIEWS_OPEN + 1 ? homeReviews : homeReviews.slice(0, REVIEWS_OPEN);
export const moreReviews = homeReviews.slice(openReviews.length);

const size = (t: string) => [...t.trim()].length;
export const isLong = (t: string) => size(t) > LONG_AT;
export const isMid = (t: string) => size(t) > MID_AT && !isLong(t);
export const isShort = (t: string) => size(t) <= SHORT_AT;

const TITLES = new Set(["dr", "op", "uzm", "prof", "doç", "av", "dt", "sn"]);
/** "Ayşe K." → "AK", "Dr. Ayşe K." → "AK", "ismail k." → "İK" (Turkish casing). */
export const initials = (name: string) => {
  const w = name.split(/\s+/).map((s) => s.replace(/[^\p{L}]/gu, "")).filter((s) => s && !TITLES.has(s.toLocaleLowerCase("tr-TR")));
  const first = [...(w[0] ?? "")][0] ?? "";
  const last = w.length > 1 ? [...w[w.length - 1]][0] : "";
  return (first + last).toLocaleUpperCase("tr-TR");
};
const month = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric", timeZone: "UTC" });
/** "2026-09" → "Eylül 2026" (absolute: Google's "3 ay önce" goes stale on a static page). */
export const fmtMonth = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return month.format(new Date(Date.UTC(y, m - 1, 1)));
};
/** 5 → "5,0" */
export const fmtScore = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
/** Star fill in %, without float noise (4.9 → 98). */
export const starFill = (n: number) => Math.round(n * 200) / 10;

/* ---- Build-time checks ---- */
const fail = (msg: string): never => {
  throw new Error(`[google-reviews] ${msg} (src/data/google-reviews.ts)`);
};
// A day's grace: the owner copies in Turkey (UTC+3), the build runs in UTC.
const latest = new Date(Date.now() + 864e5).toISOString();
reviews.forEach((r, i) => {
  const who = `${i + 1}. yorum (${r.author?.trim() || "isimsiz"})`;
  if (!r.author?.trim()) fail(`${who}: author boş.`);
  if (!initials(r.author)) fail(`${who}: author'dan baş harf çıkmıyor (yalnız unvan ya da işaret var).`);
  if (!r.text?.trim()) fail(`${who}: text boş. Yalnız yıldız verilen değerlendirmeler listeye girmez.`);
  if (!Number.isInteger(r.rating) || r.rating < 1 || r.rating > 5) fail(`${who}: rating 1–5 arası tam sayı olmalı.`);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(r.date)) fail(`${who}: date "YYYY-MM" biçiminde olmalı (örn. "2026-09").`);
  if (r.date > latest.slice(0, 7)) fail(`${who}: date (${r.date}) gelecekte olamaz.`);
  if (r.service !== undefined && !r.service.trim()) fail(`${who}: service boş bırakılacaksa alanı silin.`);
  if (!reviewsAreFixture && /^\s*\[(örnek|sample)\]/i.test(r.text)) fail(`${who}: örnek metin gerçek listeye kopyalanmış.`);
});
if (reviewRating) {
  const { rating, count, asOf } = reviewRating;
  if (!(rating >= 1 && rating <= 5)) fail("GOOGLE_RATING.rating 1–5 arası olmalı.");
  if (!Number.isInteger(count) || count < reviews.length)
    fail("GOOGLE_RATING.count, listedeki yorum sayısından az olamaz (Google yalnız yıldızlı oyları da sayar).");
  const t = Date.parse(asOf);
  // The round trip refuses days that don't exist ("2026-02-31" would pass as 3 March).
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf) || Number.isNaN(t) || new Date(t).toISOString().slice(0, 10) !== asOf)
    fail('GOOGLE_RATING.asOf geçerli bir "YYYY-MM-DD" tarihi olmalı.');
  if (asOf > latest.slice(0, 10)) fail(`GOOGLE_RATING.asOf (${asOf}) gelecekte olamaz.`);
  const days = Math.floor((Date.now() - t) / 864e5);
  if (days > 90) console.warn(`[google-reviews] Puan ve sayı ${days} gün önce kopyalandı; Google'daki değerlerle karşılaştırın.`);
}
if (!reviews.length) console.info("[google-reviews] Veri yok; ana sayfada yorum bölümü gösterilmiyor.");
