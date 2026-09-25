/**
 * Social accounts we run end to end (content, shoots, posting, ads).
 * Rendered as profile-style cards on /projeler/ and on each brand page.
 * Instagram offers no official profile embed, so the card is ours: our own
 * work from that account, a few headline numbers, and a link out.
 */
import type { ImageMetadata } from "astro";
import lgAytas from "../assets/logos/aytashome.png";
import lgErdem from "../assets/logos/erdem-caliskan.png";

export interface ManagedAccount {
  /** Must match the projects' `client` field. */
  client: string;
  platform: "instagram" | "youtube";
  handle: string;
  url: string;
  /** Logo for the avatar; without one, the client's initials are shown. */
  logo?: ImageMetadata;
  role: string;
  since?: string;
  stats?: { value: string; label: string }[];
  caseHref?: string;
  siteHref?: string;
}

export const MANAGED_ACCOUNTS: ManagedAccount[] = [
  {
    client: "Aytaş Home",
    platform: "instagram",
    handle: "aytashomeoutlet",
    url: "https://www.instagram.com/aytashomeoutlet/",
    logo: lgAytas,
    role: "İçerik üretimi, reklam ve hesap yönetimi",
    since: "Mayıs 2026",
    stats: [
      { value: "+%134", label: "günlük organik görüntüleme" },
      { value: "+%311", label: "içerik etkileşimi" },
      { value: "28.185", label: "takipçi" },
    ],
    caseHref: "/projeler/vaka/aytas-home/",
  },
  {
    client: "Dr. Erdem Çalışkan",
    platform: "instagram",
    handle: "dr.erdem.caliskan",
    url: "https://www.instagram.com/dr.erdem.caliskan/",
    logo: lgErdem,
    role: "Video içerik, hesap yönetimi ve web sitesi",
    siteHref: "https://serdivanestetik.com/",
  },
  {
    client: "Op. Dr. Duygu Cebecik Özmüş",
    platform: "youtube",
    handle: "duygucebecikopdr",
    url: "https://www.youtube.com/@duygucebecikopdr",
    role: "YouTube gebelik bilgilendirme serisi: çekim, kurgu ve yayın",
  },
];
