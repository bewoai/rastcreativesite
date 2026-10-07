/**
 * Team members — single source for /hakkimizda/, /ekip/<slug>/ profile pages
 * and blog author schema (E-E-A-T: who wrote / who shoots).
 */
import muhammedPhoto from "../assets/photos/muhammed-ekrem-adnan.jpg";
import beratPhoto from "../assets/photos/berat-degirmenci-renkli.jpg";

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  photo: ImageMetadata;
  linkedin: string;
  links: { icon: "linkedin" | "instagram" | "arrow-up-right"; label: string; href: string }[];
  focus: string;
  bio: string;
  highlights: string[];
}

export const TEAM: readonly TeamMember[] = [
  {
    slug: "muhammed-ekrem-adnan",
    name: "Muhammed Ekrem Adnan",
    role: "Kurucu Ortak / Video Director",
    photo: muhammedPhoto,
    linkedin: "https://www.linkedin.com/in/muhammed-al-sheikhly-2a6b01209/",
    links: [
      { icon: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/muhammed-al-sheikhly-2a6b01209/" },
      { icon: "instagram", label: "Instagram", href: "https://www.instagram.com/muhammed_the_artist/" },
    ],
    focus: "Animasyon, storyboard ve görsel anlatı tarafında projeye katkı sağlar.",
    bio:
      "Dumlupınar Üniversitesi Güzel Sanatlar ve Stüdyo Sanatları eğitimiyle güçlü bir görsel anlatı temeline sahip. Adatıp Hastanesi'nde yaratıcı videografi ve kısa video üretim süreçlerine katkı sağlıyor; animasyon, After Effects, storyboard ve kurgu bilgisini hikaye odaklı video üretimine taşıyor.",
    highlights: ["Video yönetmenliği", "Animasyon", "After Effects", "Storyboard", "Kurgu"],
  },
  {
    slug: "berat-degirmenci",
    name: "Berat Değirmenci",
    role: "Kurucu Ortak / Video Director",
    photo: beratPhoto,
    linkedin: "https://www.linkedin.com/in/beratdegirmenci/",
    links: [
      { icon: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/beratdegirmenci/" },
      { icon: "instagram", label: "Instagram", href: "https://www.instagram.com/bewonami/" },
      { icon: "arrow-up-right", label: "Portfolyo", href: "https://beratdegirmenci.studio/" },
    ],
    focus: "Teknik süreçler, dijital reklam planlama ve prodüksiyon akışını düzenli tutar.",
    bio:
      "Adatıp Hastanesi'nde video operasyonları ve podcast prodüksiyonları üzerine çalışıyor. Yönetim Bilişim Sistemleri eğitimiyle süreç planlama, teknik altyapı ve dijital reklam tarafındaki bilgisini prodüksiyon akışlarına dahil ediyor; markalar için daha düzenli, ölçülebilir ve etkili görsel içerikler üretmeye odaklanıyor.",
    highlights: ["Video operasyonları", "Podcast prodüksiyonu", "Meta reklamları", "Teknik süreçler", "Kurgu"],
  },
];

export const getTeamMember = (name: string) => TEAM.find((m) => m.name === name);
