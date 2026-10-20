/**
 * Google Business Profile reviews on the homepage (#yorumlar), copied by hand
 * from the profile (CONTACT.googleShare). Checked at build time by
 * src/lib/reviews.ts; an empty list renders no section at all, so this file
 * can ship before there is data. Owner steps: docs/sections/google-yorumlari.md
 *
 *  - text: exactly as on Google ("Orijinali göster", not the translation):
 *    typos, emoji and line breaks kept; paragraphs as blank lines inside a
 *    `template literal`. Never shortened or edited; long texts are clamped
 *    by CSS behind "Devamını okuyun".
 *  - author: first name + surname initial ("Ayşe K.").
 *  - rating: the stars this review gave (1–5). Star-only ratings (no text)
 *    are not listed; Google counts them in GOOGLE_RATING.
 *  - date: month it was written, "YYYY-MM".
 *  - service: optional, our label for the job; shown apart from the quote.
 *  - lang: optional BCP 47 tag when the review isn't Turkish ("en").
 *  - Order = display order: the first three are open on the page; do not
 *    leave reviews out because of their stars.
 *
 * No Review / AggregateRating JSON-LD from this data: reviews a business shows
 * about itself are "self-serving" and not eligible for Google's review rich
 * results (and risk a structured-data manual action). They stay plain HTML.
 */
export interface GoogleReview {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** "YYYY-MM" */
  date: string;
  /** Our label for the job, e.g. "Tanıtım filmi"; not the reviewer's words. */
  service?: string;
  /** BCP 47, only when the review isn't Turkish (e.g. "en"). */
  lang?: string;
}

export interface GoogleRating {
  /** As Google shows it, one decimal (4.9). */
  rating: number;
  /** Google's total, star-only ratings included. Never computed from the list. */
  count: number;
  /** Day it was copied from Google, "YYYY-MM-DD". */
  asOf: string;
}

// Copied 2026-10-20 from the owner's screenshots. People appear by initials
// only (owner's call); Aytaş Home is a business, so its name stays. Not listed:
// two star-only ratings, and one review held until the owner confirms the
// writer is a client (shares a surname with a founder).
export const GOOGLE_REVIEWS: readonly GoogleReview[] = [
  {
    author: "Aytaş Home",
    rating: 5,
    date: "2026-10",
    service: "Sosyal medya yönetimi",
    text: `Arkadaşlarla uzun zamandır beraber çalışıyoruz. Özellikle kampanya zamanlarında bizim kadar onlar da koşturuyor sağ olsunlar. Çekimlerimiz de güzel geçiyor, yaptıkları işlerden memnunuz. Ellerine sağlık.`,
  },
  {
    author: "E. Ç.",
    rating: 5,
    date: "2026-10",
    service: "Sosyal medya içeriği",
    text: `İki dostumla bir süredir birlikte çalışıyoruz. Çekimlerimiz hem keyifli geçiyor hem de ortaya güzel işler çıkıyor. İşlerini severek yapmaları ve her zaman yeni fikirlerle gelmeleri de çok güzel. İkisinin de eline emeğine sağlık, iyi ki tanışmışız.`,
  },
  {
    author: "M.",
    rating: 5,
    date: "2026-10",
    text: `İşini severek yapan, güler yüzlü ve yaratıcı bir ekip. Beklentilerimi anlayıp ortaya güzel bir iş çıkardılar. Süreç boyunca iletişim kurmak da çok rahattı. Rast Creative Studio ekibine emekleri için teşekkür ederim, kesinlikle tavsiye ederim!`,
  },
  {
    author: "M. S.",
    rating: 5,
    date: "2026-10",
    text: `Rast Creative Studio’ya özenli çalışmaları ve ilgili yaklaşımları için teşekkür ederim. İletişimleri ve işlerine gösterdikleri titizlikten çok memnun kaldım. Video prodüksiyon hizmeti arayanlara gönül rahatlığıyla tavsiye ederim.`,
  },
  {
    author: "A. A.",
    rating: 5,
    date: "2026-10",
    text: `Rast creative studio ekip arkadaşların emeğine sağlık ilgi ve alakalarından kaynakli ne kadar tecrübeli ekip olduklarını belli etmektedir`,
  },
];

/** null hides the "5,0 · Google'da N yorum" plate. */
export const GOOGLE_RATING: GoogleRating | null = null;
