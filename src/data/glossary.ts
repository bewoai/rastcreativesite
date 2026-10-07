/**
 * Video production glossary (/sozluk/). Short, citable definitions — the kind
 * of answer search engines and AI assistants quote. Each term gets an anchor
 * (#slug) and, where we have one, a link to the page that goes deeper.
 */

export interface GlossaryTerm {
  slug: string;
  term: string;
  /** Alternative names / spellings people search for. */
  alt?: string;
  definition: string;
  link?: { label: string; href: string };
}

export const GLOSSARY: readonly GlossaryTerm[] = [
  { slug: "4k", term: "4K", definition: "Yaklaşık 3840×2160 piksel çözünürlük. 4K çekim, kurguda kadrajı kırpmaya ve aynı görüntüden dikey video çıkarmaya alan bırakır." },
  { slug: "a-roll", term: "A-roll", definition: "Videonun ana anlatımını taşıyan görüntüler; genellikle röportaj ya da kameraya konuşan kişinin çekimi." },
  { slug: "b-roll", term: "B-roll", definition: "Ana anlatımı destekleyen ara görüntüler: ürün detayları, mekan, üretim hattı, ekip. Kurguda A-roll'un üzerine yerleştirilerek anlatımı görsel olarak zenginleştirir." },
  { slug: "brief", term: "Brief", definition: "Projenin amacını, hedef kitlesini, mesajını, kullanım alanını ve teslim beklentilerini özetleyen kısa doküman. İyi bir brief, doğru teklifin ve doğru filmin başlangıcıdır.", link: { label: "Tanıtım filmi çektirmeden önce", href: "/blog/tanitim-filmi-cektirmeden-once/" } },
  { slug: "call-to-action", term: "Çağrı (CTA)", alt: "Call to action", definition: "Videonun sonunda izleyiciden istenen tek ve net eylem: arayın, mesaj atın, randevu alın, mağazaya gelin." },
  { slug: "cekim-gunu", term: "Çekim günü", definition: "Ekibin ve ekipmanın sette olduğu planlı çalışma günü. İyi planlanmış tek bir çekim gününden ana film, dikey kesitler ve fotoğraflar birlikte çıkarılabilir.", link: { label: "Tek çekim gününden kaç içerik çıkar?", href: "/blog/tek-cekim-gununden-kac-icerik-cikar/" } },
  { slug: "cekim-listesi", term: "Çekim listesi", alt: "Shot list", definition: "Çekim gününde alınacak planların sıralı listesi. Setteki herkesin aynı planı takip etmesini ve hiçbir sahnenin unutulmamasını sağlar." },
  { slug: "color-grading", term: "Renk düzenleme", alt: "Color grading", definition: "Görüntülerin renk, kontrast ve tonunun kurgu sonrasında düzenlenmesi. Markanın görsel dilini oluşturur ve farklı kameralardan gelen görüntüleri birbirine uydurur." },
  { slug: "color-correction", term: "Renk düzeltme", alt: "Color correction", definition: "Renk düzenlemenin teknik ilk adımı: beyaz dengesi, pozlama ve kontrastın doğal ve tutarlı hale getirilmesi." },
  { slug: "dikey-video", term: "Dikey video", alt: "9:16", definition: "Telefon ekranını tam dolduran 9:16 oranlı video. Instagram Reels, TikTok ve YouTube Shorts'un ana formatıdır.", link: { label: "Sosyal medya videosu neden dikey?", href: "/blog/sosyal-medya-videosu-neden-dikey/" } },
  { slug: "dis-ses", term: "Dış ses", alt: "Voice-over", definition: "Görüntü üzerine sonradan eklenen anlatıcı sesi. Kurumsal filmlerde ve reklamlarda mesajı netleştirmek için kullanılır." },
  { slug: "drone-cekimi", term: "Drone çekimi", definition: "İnsansız hava aracıyla yapılan havadan çekim. Tesisin ölçeğini, konumunu ve çevresini tek planda gösterir; uçuş izinleri ve hava koşulları önceden planlanmalıdır.", link: { label: "Drone çekimi gerekli mi?", href: "/blog/drone-cekimi-gerekli-mi/" } },
  { slug: "fpv", term: "FPV drone", definition: "Pilotun gözlükle drone'un kamerasından gördüğü, hızlı ve akıcı hareketlere uygun drone türü. Mekanların içinden geçen dinamik planlar için kullanılır." },
  { slug: "fps", term: "FPS (kare hızı)", alt: "Frame rate", definition: "Bir saniyedeki kare sayısı. 24/25 fps sinematik görünüm verir; 50/60 fps ve üzeri çekimler kurguda yavaş çekim (slow motion) için kullanılır." },
  { slug: "gimbal", term: "Gimbal", definition: "Kamerayı titreşimden arındıran motorlu sabitleyici. Yürürken ya da hareket halindeyken akıcı görüntü almayı sağlar." },
  { slug: "hook", term: "Kanca", alt: "Hook", definition: "Videonun ilk 2–3 saniyesinde izleyicinin kaydırmayı bırakmasını sağlayan görüntü ya da cümle. Sosyal medya videolarında izlenme süresini en çok etkileyen bölümdür.", link: { label: "Reklam senaryosu nasıl yazılır?", href: "/blog/reklam-senaryosu-nasil-yazilir/" } },
  { slug: "isik-kurulumu", term: "Işık kurulumu", definition: "Setteki ışık kaynaklarının konumu ve şiddeti. Ana ışık, dolgu ışığı ve arka ışıktan oluşan üç nokta aydınlatma en temel kurulumdur." },
  { slug: "kurgu", term: "Kurgu", alt: "Montaj, edit", definition: "Çekilen görüntülerin seçilip sıralanarak hikâyeye dönüştürülmesi. Ritim, müzik, geçişler ve yazılar kurguda belirlenir." },
  { slug: "kadraj", term: "Kadraj", definition: "Kameranın gördüğü alanın sınırları ve bu alanın içindeki öğelerin yerleşimi." },
  { slug: "lut", term: "LUT", definition: "Görüntüye belirli bir renk görünümü uygulayan hazır renk tablosu. Renk düzenlemede başlangıç noktası olarak kullanılır." },
  { slug: "log-profil", term: "Log profil", definition: "Kameranın görüntüyü düşük kontrastlı ve geniş dinamik aralıkla kaydettiği mod. Renk düzenlemede çok daha fazla esneklik sağlar." },
  { slug: "motion-graphics", term: "Motion graphics", alt: "Hareketli grafik", definition: "Videoya eklenen animasyonlu yazı, logo, ikon ve infografikler. Teknik bilgiyi ve rakamları anlaşılır kılar." },
  { slug: "on-produksiyon", term: "Ön prodüksiyon", alt: "Pre-production", definition: "Çekimden önceki hazırlık aşaması: brief, senaryo, storyboard, mekan keşfi, çekim planı ve izinler. Projenin başarısının büyük kısmı burada belirlenir." },
  { slug: "on-gorusme", term: "Ön görüşme", definition: "Proje başlamadan önce ihtiyaç, kapsam, takvim ve bütçenin konuşulduğu ilk toplantı. Rast Creative'de ücretsizdir.", link: { label: "Ücretsiz ön görüşme", href: "/iletisim/" } },
  { slug: "post-produksiyon", term: "Post-prodüksiyon", definition: "Çekim sonrası yapılan tüm işler: kurgu, renk düzenleme, ses tasarımı, grafik, altyazı ve teslim formatları." },
  { slug: "produksiyon", term: "Prodüksiyon", definition: "Çekimin kendisi: ekip, ekipman, ışık, ses ve sette yönetim. Geniş anlamda bir videonun fikirden teslime üretim sürecinin tamamı." },
  { slug: "reels", term: "Reels", definition: "Instagram ve Facebook'un kısa dikey video formatı. Keşfet akışında takipçi olmayan kişilere de ulaşabildiği için markaların en güçlü organik erişim aracıdır." },
  { slug: "reklam-filmi", term: "Reklam filmi", definition: "İzleyiciyi tek bir eyleme (satın alma, arama, ziyaret) yönlendirmek için çekilen kısa film. Tanıtım filminden farkı, tek bir mesaja ve çağrıya odaklanmasıdır.", link: { label: "Reklam filmi nedir?", href: "/blog/reklam-filmi-nedir/" } },
  { slug: "revizyon", term: "Revizyon", definition: "Kurgu teslim edildikten sonra müşterinin isteğine göre yapılan düzeltmeler. Kaç revizyon turunun dahil olduğu teklifte belirtilmelidir." },
  { slug: "roportaj", term: "Röportaj çekimi", definition: "Bir kişinin sorulara kameraya ya da kamera yanındaki kişiye cevap verdiği çekim. Kurumsal filmlerde ve uzman içeriklerinde güvenilirliği artırır." },
  { slug: "ses-tasarimi", term: "Ses tasarımı", definition: "Müzik, efekt, ortam sesi ve konuşmanın kurguda dengelenmesi. İzleyici kötü görüntüyü tolere edebilir, kötü sesi etmez." },
  { slug: "senaryo", term: "Senaryo", definition: "Videoda ne görüneceğini ve ne duyulacağını sırasıyla yazıya döken metin. Kısa videolarda görüntü–ses iki sütunlu tablo pratik bir formattır.", link: { label: "Reklam senaryosu nedir?", href: "/blog/reklam-senaryosu-nasil-yazilir/" } },
  { slug: "shorts", term: "YouTube Shorts", definition: "YouTube'un kısa dikey video formatı. Uzun videolardan kesilen Shorts, kanala yeni izleyici çekmenin etkili yoludur." },
  { slug: "slow-motion", term: "Yavaş çekim", alt: "Slow motion", definition: "Yüksek kare hızıyla çekilip normal hızda oynatılan görüntü. Ürün detaylarını ve hareketi dramatik biçimde gösterir." },
  { slug: "storyboard", term: "Storyboard", definition: "Senaryodaki sahnelerin çizim ya da referans görsellerle kare kare planlanması. Çekim öncesinde herkesin aynı filmi hayal etmesini sağlar." },
  { slug: "tanitim-filmi", term: "Tanıtım filmi", alt: "Kurumsal film", definition: "Bir firmanın kim olduğunu, ne yaptığını ve neden güvenilir olduğunu anlatan film. Web sitesinde, fuarlarda ve satış sunumlarında kullanılır.", link: { label: "Fabrika tanıtım filmi", href: "/sektorler/fabrika-tanitim-filmi/" } },
  { slug: "teslim-formatlari", term: "Teslim formatları", definition: "Videonun kullanılacağı mecraya göre hazırlanan versiyonlar: yatay 16:9 ana film, dikey 9:16 Reels/Shorts, kare 1:1 ve farklı süreler." },
  { slug: "timelapse", term: "Timelapse", definition: "Uzun bir süreyi aralıklı karelerle birkaç saniyeye sıkıştıran çekim tekniği. İnşaat, kurulum ve üretim süreçlerini göstermek için kullanılır." },
  { slug: "ugc", term: "UGC tarzı video", definition: "Kullanıcının kendi telefonuyla çekmiş gibi görünen doğal, samimi video stili. Sosyal medya reklamlarında güven ve yakınlık hissi verir." },
  { slug: "yatay-video", term: "Yatay video", alt: "16:9", definition: "Televizyon ve bilgisayar ekranına uygun 16:9 oranlı video. Tanıtım filmleri, YouTube videoları ve web sitesi videoları için standarttır." },
];
