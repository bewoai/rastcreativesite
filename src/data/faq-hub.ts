/**
 * /sss/ — every question prospects actually ask, grouped. Short, direct answers
 * (GEO: assistants quote these). Only state what the site already commits to
 * elsewhere; anything policy-dependent is "agreed in the preliminary call".
 */

export interface FaqGroup {
  id: string;
  title: string;
  items: { q: string; a: string; link?: { label: string; href: string } }[];
}

export const FAQ_GROUPS: readonly FaqGroup[] = [
  {
    id: "baslangic",
    title: "Başlangıç ve süreç",
    items: [
      { q: "Rast Creative Studio ne yapar?", a: "Serdivan/Sakarya merkezli bir video prodüksiyon ve kreatif içerik ajansıyız. Reklam filmi, tanıtım filmi, sosyal medya videoları, ürün ve mekan çekimi, drone çekimi ve sosyal medya yönetimini tek ekip olarak planlayıp çekiyor, kurguluyor ve teslim ediyoruz." },
      { q: "Süreç nasıl başlıyor?", a: "Ücretsiz bir ön görüşmeyle. Amacınızı, hedef kitlenizi, videoların nerede kullanılacağını ve takvimi dinliyor; kapsamı ve size uygun formatları birlikte netleştiriyoruz.", link: { label: "Ön görüşme talep edin", href: "/iletisim/" } },
      { q: "Ön görüşme ücretli mi?", a: "Hayır, ön görüşme ücretsizdir ve bir taahhüt gerektirmez." },
      { q: "Çekim ve kurguyu kim yapıyor?", a: "Ön görüşmeden teslime kadar süreci Rast Creative ekibi birebir yürütür; kurucu ortaklar projelerde bizzat yer alır. Projenin ölçeğine göre ekip genişletilir." },
      { q: "Ne kadar önceden planlama yapmalıyım?", a: "İdeal olarak çekimden 1–2 hafta önce görüşmek senaryoyu, çekim listesini ve izinleri rahatça netleştirmeye yeter. Daha kısa sürede de planlama yapmaya çalışırız." },
      { q: "Senaryoyu siz mi yazıyorsunuz?", a: "Evet, ihtiyaç varsa senaryo veya konu listesini birlikte hazırlıyoruz. Kısa videolarda görüntü–ses tablosu şeklinde çalışıyoruz.", link: { label: "Reklam senaryosu nasıl yazılır?", href: "/blog/reklam-senaryosu-nasil-yazilir/" } },
    ],
  },
  {
    id: "fiyat",
    title: "Fiyat ve teklif",
    items: [
      { q: "Video çekimi ne kadar?", a: "Her proje kapsamına göre fiyatlanır. Çekim günü sayısı, lokasyon, ekip ve ekipman, drone, kurgu kapsamı ve teslim edilecek içerik sayısı fiyatı belirler. Ön görüşmeden sonra net bir teklif sunuyoruz.", link: { label: "Fiyatı neler belirler?", href: "/blog/video-cekimi-fiyati-neye-gore-belirlenir/" } },
      { q: "Sosyal medya yönetimi fiyatı neye göre belirlenir?", a: "Ayda üretilecek video ve gönderi sayısı, çekim günü sayısı, yönetilecek platformlar, reklam yönetimi ve raporlama kapsamına göre.", link: { label: "Sosyal medya yönetimi fiyatı", href: "/blog/sosyal-medya-yonetimi-fiyati-neye-gore-belirlenir/" } },
      { q: "Drone çekimi ayrıca mı ücretlendirilir?", a: "Drone, projeye değer katıyorsa kapsama eklenir ve teklifte ayrı bir kalem olarak görünür. Her projede gerekli değildir.", link: { label: "Drone çekim ücreti", href: "/blog/drone-cekimi-fiyati-neye-gore-belirlenir/" } },
      { q: "Teklifleri nasıl karşılaştırmalıyım?", a: "Toplam rakam yerine kapsamı karşılaştırın: kaç gün çekim, hangi ekip, hangi ekipman, kaç teslim dosyası, kaç revizyon turu ve hangi formatlar dahil." },
    ],
  },
  {
    id: "cekim",
    title: "Çekim günü",
    items: [
      { q: "Bir çekim gününden kaç içerik çıkar?", a: "Sabit bir sayı yok; plana bağlı. İyi planlanmış bir günden ana film, dikey Reels/Shorts kesitleri, reklam versiyonları ve fotoğraflar birlikte çıkarılabilir.", link: { label: "Çekim günü planlayıcıyı deneyin", href: "/cekim-planlayici/" } },
      { q: "Çekim sırasında işletmemin işleyişi durur mu?", a: "Genellikle hayır. Fabrikalarda vardiya düzenine, mağaza ve kliniklerde sakin saatlere göre plan yapıp işleyişi aksatmadan çekiyoruz." },
      { q: "Çekimden önce ne hazırlamalıyım?", a: "Ana mesajı, öncelikli ürün/hizmetleri, çekilecek alanları ve onay verecek kişiyi netleştirin; ürünleri ve mekanı hazır tutun. Kameraya konuşacak kişiler ezber yerine anlatacakları ana fikirleri bilsin yeterli." },
      { q: "Kameraya konuşmaya alışkın değilim, sorun olur mu?", a: "Olmaz. Soru-cevap akışıyla ilerliyoruz; ezber metin yerine doğal anlatım hem daha kolay hem daha güvenilir sonuç veriyor." },
      { q: "Drone çekimi için izin gerekir mi?", a: "Uçuşun yapılacağı bölgeye göre değişir; havalimanı, askeri alan ve bazı tesislerin yakınında kısıtlama vardır. Konumu çekim öncesinde kontrol edip gerekli koşulları birlikte netleştiriyoruz." },
    ],
  },
  {
    id: "teslim",
    title: "Teslim ve formatlar",
    items: [
      { q: "Video ne kadar sürede teslim edilir?", a: "Kapsamına göre genellikle 2–4 hafta. Kesin takvimi ön görüşmede birlikte belirliyoruz." },
      { q: "Revizyon hakkım var mı?", a: "Evet. Teslim öncesinde geri bildirim ve revizyon turları planlanır; kapsamı ve sayısı ön görüşmede netleştirilir." },
      { q: "Hangi formatlarda teslim ediyorsunuz?", a: "Kullanım yerine göre: web sitesi ve YouTube için yatay 16:9, Reels/Shorts/TikTok için dikey 9:16, gerektiğinde kare 1:1; reklamlar için farklı süre versiyonları ve altyazılı/sessiz izlenebilir kurgular." },
      { q: "Ham görüntüler teslim ediliyor mu?", a: "İhtiyacınız varsa ham görüntü teslimini ön görüşmede kapsama ekleyebiliriz." },
      { q: "Videolarda hangi müziği kullanıyorsunuz?", a: "Müziği, videonun yayınlanacağı platformun telif kurallarına uygun şekilde seçiyoruz; markanın kendi müziği varsa onu da kullanabiliyoruz." },
    ],
  },
  {
    id: "sosyal-medya",
    title: "Sosyal medya yönetimi",
    items: [
      { q: "Sosyal medya yönetimi neleri kapsıyor?", a: "İçerik planı, planlı çekim günleri, kurgu, açıklama metinleri, paylaşım takvimi ve aylık rapor. İsterseniz Meta reklam yönetimi de eklenir." },
      { q: "Her hafta çekime mi geliyorsunuz?", a: "Genellikle ayda bir ya da iki planlı çekim günü yapıyor, o günden çıkan içerikleri ay boyunca yayına alıyoruz." },
      { q: "Sonuçları nasıl ölçüyorsunuz?", a: "Her ay erişim, etkileşim, profil ziyareti, takipçi ve varsa reklam/mesaj sonuçlarını raporluyor; bir sonraki ayın planını bu verilere göre düzenliyoruz.", link: { label: "Aytaş Home vaka çalışması", href: "/projeler/vaka/aytas-home/" } },
      { q: "Hesabımı kendim yönetmek istersem sadece içerik üretiyor musunuz?", a: "Evet; yalnızca çekim ve kurgu hizmeti de alabilirsiniz." },
    ],
  },
  {
    id: "hekimler",
    title: "Hekimler",
    items: [
      { q: "Hekimler için sosyal medyada reklam yapabilir miyiz?", a: "Genel olarak hayır. 12.11.2025 tarihli Sağlık Hizmetlerinde Tanıtım ve Bilgilendirme Faaliyetleri Hakkında Yönetmeliğe göre hekimler sosyal medyada ücretli, sponsorlu ve öne çıkmaya yönelik olmayan kayıt ve bilgilendirme yapabilir; fiyat, kampanya, garanti ve hasta yorumu paylaşılamaz. Bu yüzden hekim paketlerimizde sürekli reklam yönetimi yok, bilgilendirme odaklı video ve sosyal medya yönetimi var. Bu yanıt hukuki görüş değildir; tabip odası ve hukuk danışmanı esastır.", link: { label: "Hekimler için içerik sistemi", href: "/hekim-icerik-sistemi/" } },
      { q: "Muayenehane veya klinik açılışında reklam yapılabilir mi?", a: "Yönetmelik metnine göre sağlık tesisleri açılış tarihini izleyen ilk bir ay boyunca yönetmeliğe uygun sponsorlu tanıtım yapabilir; fiyat, kampanya ve hasta görseli bu dönemde de yasaktır. Açılış tarihinin neyi ifade ettiğini tabip odanızdan teyit etmenizi öneririz. Açılış dönemi çalışmasını aylık paketlerden ayrı, tek seferlik bir iş olarak yürütürüz." },
      { q: "Hekim videolarında öncesi/sonrası görseli kullanıyor musunuz?", a: "Varsayılan olarak üretmiyoruz. Yönetmelik bu tür görsellere yazılı açık rıza, aynı çekim koşulları, işlem ve çekim tarihi, filtre kullanılmaması ve zorunlu uyarı metni gibi koşullarla izin veriyor; sponsorlu yayınlanamaz. Kullanılacaksa önce tabip odası görüşü alınır, karar hekimindir." },
      { q: "Hekim videolarında içerik onayı nasıl işliyor?", a: "Her senaryo çekimden önce, her video yayından önce hekimin yazılı onayına gelir ve onay kaydı saklanır. Onaylanmayan içerik yayınlanmaz; tereddüt edilen içerikte tabip odası görüşü gelene kadar yayın bekletilir. Fiyat, kampanya, hasta görseli ve sponsorlu yayın üretmeyiz." },
    ],
  },
  {
    id: "bolge",
    title: "Bölgeler ve sektörler",
    items: [
      { q: "Hangi bölgelerde çekim yapıyorsunuz?", a: "Stüdyomuz Serdivan'da. Sakarya'nın tüm ilçelerine, Kocaeli (İzmit, Gebze, Gölcük, Darıca, Kartepe, Başiskele) ve Düzce'ye aynı gün; Bolu, Bilecik ve daha uzak bölgelere proje bazlı geliyoruz." },
      { q: "Hangi sektörlerle çalışıyorsunuz?", a: "Sağlık ve klinikler, sanayi ve fabrikalar, mağaza ve perakende, davet salonu/kafe/etkinlik mekanları ve eğitim/YouTube içerikleri en çok çalıştığımız alanlar.", link: { label: "Sektörlere göz atın", href: "/sektorler/" } },
      { q: "Daha önce kimlerle çalıştınız?", a: "Aytaş Home, Dr. Erdem Çalışkan, Op. Dr. Duygu Cebecik Özmüş, Altoteks, Chint Power, Meteors Shipping, Mavi Vatan ve daha fazlası; tüm işler projeler sayfasında.", link: { label: "Projeler", href: "/projeler/" } },
    ],
  },
];
