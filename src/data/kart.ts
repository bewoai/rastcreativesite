/**
 * Yaka kartı QR sayfaları — /kart/<slug>/
 * Kartlardaki QR kodu bu adrese sabit gider; içerik buradan değiştirilir
 * (kart yeniden basılmadan). Slug'lar src/data/team.ts ile aynı olmalı.
 * Sıra = sayfadaki buton sırası. İlk buton öne çıkar (turuncu).
 */
import { CONTACT, waLink } from "../consts";

export interface KartLink {
  label: string;
  href: string;
  note?: string;
}

const ortak: KartLink[] = [
  { label: "Projelerimiz", href: "/projeler/", note: "Yaptığımız işler" },
  { label: "Instagram · @rastcreative", href: "https://instagram.com/rastcreative" },
  { label: "Web sitesi", href: "/" },
  { label: "E-posta", href: `mailto:${CONTACT.email}`, note: CONTACT.email },
];

export const KART: Record<string, KartLink[]> = {
  "berat-degirmenci": [
    { label: "WhatsApp'tan yazın", href: waLink("Merhaba, kartınızdaki QR'dan ulaşıyorum.") ?? "/iletisim/" },
    ...ortak,
    { label: "Berat · Instagram", href: "https://www.instagram.com/bewonami/" },
    { label: "Berat · LinkedIn", href: "https://www.linkedin.com/in/beratdegirmenci/" },
  ],
  "muhammed-ekrem-adnan": [
    { label: "WhatsApp'tan yazın", href: waLink("Merhaba, kartınızdaki QR'dan ulaşıyorum.") ?? "/iletisim/" },
    ...ortak,
    { label: "Muhammed · Instagram", href: "https://www.instagram.com/muhammed_the_artist/" },
    { label: "Muhammed · LinkedIn", href: "https://www.linkedin.com/in/muhammed-al-sheikhly-2a6b01209/" },
  ],
};
