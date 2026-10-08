/**
 * Hekim İçerik Sistemi — monthly package tiers for /hekim-icerik-sistemi/.
 *
 * !! PRICES ARE PROVISIONAL — owner decision pending. Do not lift the page's
 * `noindex` until the owner confirms the numbers and the tier contents. !!
 *
 * Edit prices and scope here; the page renders straight from this file.
 * All prices: monthly, VAT excluded, "starting from" (PRICE_NOTE).
 *
 * Regulatory rule (binding, from the owner): for physicians in Turkey paid
 * advertising is NOT a continuous service. It is only possible as an opening
 * announcement in the first 30 days after the practice licence (ruhsat), or
 * where specific permission exists. So NO monthly tier may list Meta/Google
 * ad management. Promotion lives only in HEKIM_ADDONS (one-off, labelled).
 */

export interface HekimPackage {
  /** Stable id, used as an anchor (#paket-<id>). */
  id: string;
  name: string;
  /** One line: who this tier is for. */
  fit: string;
  /** Monthly price in TL (VAT excluded, starting from). */
  priceTl: number;
  /** Shown above the feature list, e.g. "Standart paketteki her şey, artı:". */
  includesPrevious?: string;
  features: string[];
  /** Visually emphasised tier. */
  recommended?: boolean;
}

export interface HekimAddon {
  id: string;
  name: string;
  /** When / under which condition it is offered. */
  when: string;
  text: string;
}

export const PRICE_NOTE = "KDV hariç, aylık başlangıç fiyatı";

export const HEKIM_PACKAGES: readonly HekimPackage[] = [
  {
    id: "baslangic",
    name: "Başlangıç",
    fit: "Sosyal medyada düzenli ve güvenilir bir görünürlüğe başlamak isteyen hekimler için.",
    priceTl: 15000,
    features: ["Ayda 4 konu-anlatım videosu", "Sosyal medya yönetimi"],
  },
  {
    id: "standart",
    name: "Standart",
    fit: "Hastaların sizi hem sosyal medyada hem aramada bulmasını isteyen hekimler için.",
    priceTl: 25000,
    recommended: true,
    features: [
      "Ayda 8 konu-anlatım videosu",
      "Sosyal medya yönetimi",
      "Video kapak tasarımı",
      "Google İşletme Profili yönetimi",
      "YouTube ve arama optimizasyonu",
    ],
  },
  {
    id: "klinik",
    name: "Klinik",
    fit: "Birden fazla kanalda tam kapsamlı, sürekli içerik isteyen klinikler için.",
    priceTl: 40000,
    includesPrevious: "Standart paketteki her şey, artı:",
    features: [
      "Ayda 12 konu-anlatım videosu",
      "Story yönetimi",
      "Ayda 1 uzun YouTube videosu",
      "Web sitesi bakımı",
    ],
  },
];

/** One-off add-ons — never monthly, priced in the call. */
export const ADDON_PRICE_NOTE = "Tek seferlik · fiyat görüşmede belirlenir";

export const HEKIM_ADDONS: readonly HekimAddon[] = [
  {
    id: "acilis",
    name: "Açılış dönemi tanıtımı",
    when: "Ruhsat sonrası ilk 30 gün",
    text: "Muayenehane ya da kliniğin açılışını duyuran, yalnızca bu döneme ait tek seferlik tanıtım çalışması.",
  },
  {
    id: "izinli",
    name: "İzinli tanıtım desteği",
    when: "İzin alınabilen durumlarda",
    text: "Tanıtım için ayrıca izin alınabilen özel durumlarda, izin kapsamıyla sınırlı tek seferlik destek.",
  },
];

/** "25.000 TL" — Turkish thousands separator. */
export const formatTl = (amount: number) => `${amount.toLocaleString("tr-TR")} TL`;
