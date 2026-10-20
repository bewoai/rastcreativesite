/**
 * TEST DATA, not real reviews. Used only while GOOGLE_REVIEWS is empty, by
 * `astro dev` and local REVIEWS_FIXTURE=1 builds (refused in CI). Every text
 * starts with "[Örnek]"; the section shows an "Örnek veri" stamp.
 */
import type { GoogleRating, GoogleReview } from "./google-reviews";

export const FIXTURE_REVIEWS: readonly GoogleReview[] = [
  { author: "Örnek A.", rating: 5, date: "2026-09", service: "Tanıtım filmi",
    text: `[Örnek] Örnek yorum metni, gerçek bir müşteri yorumu değildir. Tanıtım filmimizin planlamasından teslimine kadar her adımda bilgilendirildik; çekim günü programa uyuldu, revizyonlar kısa sürede geldi. Ekibe teşekkür ederiz.` },
  { author: "Örnek B.", rating: 5, date: "2026-08",
    text: `[Örnek] Çok memnun kaldık, teşekkürler.` },
  { author: "Örnek C.", rating: 5, date: "2026-07", service: "Drone çekimi",
    text: `[Örnek] Örnek yorum metni, gerçek bir müşteri yorumu değildir; uzun yorumların altı satırda kesilip “Devamını okuyun” ile açıldığını denemek için yazıldı. Fabrikamızın tanıtım filmi ve drone çekimleri için birlikte çalıştık. İlk görüşmede ne istediğimizi dinlediler, çekimden önce sahne sahne bir plan gönderdiler. Çekim günü üretimi durdurmadan, vardiya aralarına göre ilerlediler. Kurgunun ilk taslağında istediğimiz değişiklikleri iki gün içinde yaptılar. Teslimde uzun filmin yanında sosyal medya için dikey kısa versiyonlar da geldi. Süreç boyunca telefonu her zaman çekimi yöneten kişi açtı.` },
  { author: "Örnek D.", rating: 4, date: "2026-06", service: "Sosyal medya içeriği",
    text: `[Örnek] Örnek yorum metni, gerçek bir müşteri yorumu değildir. Mağazamız için aylık Reels içerikleri hazırlattık.

İkinci paragraf: satır sonlarının korunduğunu göstermek için. Dört yıldız, kısmi puan görünümünü denemek için. Orta uzunlukta bir yorum: üç sütunlu düzende altı satırda kesilip "Devamını okuyun" ile açıldığını, tek sütunda tamamen göründüğünü denemek için.` },
  { author: "Örnek E.", rating: 5, date: "2026-05",
    text: `[Örnek] Kliniğimizin tanıtım videosu için çalıştık, sonuçtan memnunuz \u{1F44D} #rastcreativestudiosakaryavideoprodüksiyonçekimi` },
  { author: "örnek i.", rating: 5, date: "2026-03",
    text: `[Örnek] Örnek yorum metni, gerçek bir müşteri yorumu değildir. Küçük harfle yazılmış adın monogramda Türkçe büyük harfe (i → İ) döndüğünü denemek için.` },
  { author: "Dr. Örnek G.", rating: 5, date: "2025-12", lang: "en",
    text: `[Örnek] Sample review text in English, not a real customer review. It checks that a non-Turkish review is marked with lang="en" for screen readers.` },
];

/** 4.9 tests the partial star fill; count ≥ list length passes the guard. */
export const FIXTURE_RATING: GoogleRating = { rating: 4.9, count: 9, asOf: "2026-10-20" };
