"""Content for the free production documents under /araclar/ (Turkish).

Single source of truth: scripts/generate-uretim-belgeleri.py renders these
blocks to PDF (fillable), DOCX, Markdown (Notion) and XLSX/CSV, and dumps a
JSON copy to src/data/belgeler/<slug>.json so the Astro pages can list what is
inside each document. No prices, no cost fields — by design.

Block types (tuples):
  ("h", text)                         section heading
  ("p", text)                         paragraph
  ("note", text) / ("warn", text)     shaded box / disclaimer box
  ("row", [(label, name, flex), ...]) one row of single-line fields
  ("area", label, name, height_mm)    multi-line field
  ("checks", label, name, [options])  checkbox group ("…:" option gets a line)
  ("checklist", name, [(item, tip)])  checklist rows: box · item · note line
  ("table", name, [(header, pct)], rows, row_h_mm)
  ("sign", [label, ...])              signature row (name, date, signature)
  ("signrow", who, [label, ...], key) signature row with a "who" caption
  ("dl", [(term, text), ...])         definition list
  ("bullets", [text, ...]) / ("small", text) / ("ref",) shot vocab tables
  ("break",)                          new page
"""

SITE = "https://rastcreative.com"

# --------------------------------------------------------------------------
# Shot list vocab (also used as XLSX dropdowns and on the page)
# --------------------------------------------------------------------------
OLCEKLER = [
    ("ÇGP / EWS", "Çok geniş plan", "Mekânı ve ölçeği kurar; açılış planı."),
    ("GP / WS", "Genel plan", "Kişi ve çevresi birlikte; nerede olduğumuzu anlatır."),
    ("BYP / FS", "Boy plan", "Kişi baştan ayağa; yürüyüş, beden dili."),
    ("DP / MLS", "Diz plan", "Dizden yukarısı; iki kişilik sahneler, hareket."),
    ("BLP / MS", "Bel plan", "Belden yukarısı; sunum, konuşma, ürün gösterimi."),
    ("GÖP / MCU", "Göğüs plan", "Röportajın klasik ölçeği; yüz ve jest birlikte."),
    ("YP / CU", "Yakın plan", "Yüz; duygu ve vurgu anları."),
    ("ÇYP / ECU", "Çok yakın plan", "Göz, dudak, küçük detay; ritim ve gerilim."),
    ("DTY / INS", "Detay (insert)", "Ürün, el, ekran, malzeme; kurgu için ara plan."),
    ("OÜ / OTS", "Omuz üstü", "Bir kişinin omzunun üstünden diğerine; diyalog."),
    ("BA / POV", "Bakış açısı", "Karakterin gözünden; izleyiciyi içeri alır."),
]
HAREKETLER = [
    ("Sabit", "Tripod; hareket kadrajın içinde olur."),
    ("Pan", "Kamera yerinde, yatayda döner."),
    ("Tilt", "Kamera yerinde, dikeyde döner."),
    ("Dolly / kaydırma", "Kamera öne ya da arkaya ilerler."),
    ("Truck / yanal", "Kamera yana kayar (slider, ray)."),
    ("Takip (gimbal)", "Konuyu yürüyerek, akıcı izler."),
    ("Omuz / el", "Canlı, belgesel hissi; hafif titreşim kabul."),
    ("Zoom", "Odak uzaklığı değişir, kamera yerinde kalır."),
    ("Kaldırma (jib)", "Kamera yükselir ya da alçalır."),
    ("Drone", "Havadan; açılış, mekân ve ölçek."),
]
ACILAR = [
    ("Göz hizası", "Nötr, en doğal açı."),
    ("Alt açı", "Konuyu güçlü, büyük gösterir."),
    ("Üst açı", "Konuyu küçük, kırılgan gösterir."),
    ("Tepe (kuş bakışı)", "Masa üstü, yemek, düzen; grafik etki."),
    ("Yatık (dutch)", "Huzursuzluk, enerji; dozunda kullanın."),
]

SHOT_COLS = [
    ("#", 4), ("Sahne", 5), ("Plan", 5), ("Ölçek", 8), ("Açı", 8), ("Hareket", 9),
    ("Lens / ekipman", 9), ("Açıklama / aksiyon", 25), ("Ses", 8), ("Süre", 5),
    ("Lokasyon", 9), ("✓", 5),
]
SHOT_EXAMPLES = [
    ["1", "1", "1A", "ÇGP / EWS", "Göz hizası", "Drone", "Drone", "ÖRNEK: Fabrikanın havadan açılışı, gün doğumu", "Müzik", "0:06", "Dış cephe", ""],
    ["2", "1", "1B", "DTY / INS", "Tepe (kuş bakışı)", "Sabit", "Makro lens", "ÖRNEK: Ürünün bant üzerindeki detayı", "Ortam", "0:03", "Üretim hattı", ""],
    ["3", "2", "2A", "GÖP / MCU", "Göz hizası", "Sabit", "2 kamera, yaka mik.", "ÖRNEK: Genel müdür röportajı, ana soru seti", "Yaka + boom", "—", "Toplantı odası", ""],
]

SHOT_RULES = [
    "Her sahneye bir açılış planıyla (ÇGP/GP) başlayın; izleyici önce nerede olduğunu görsün.",
    "Kurguyu kurtaran ara planları (detay, el, ekran, ortam) ayrı satır olarak yazın.",
    "Satırları hikâye sırasına değil, lokasyon ve ışık sırasına göre çekin; # sütunu çekim sırasıdır.",
    "Dikey (9:16) teslim edilecek planları açıklamaya “9:16” diye not edin; kadraj buna göre kurulur.",
    "Tamamlanan planı ✓ ile işaretleyin, iyi çekimin numarasını yanına yazın (ör. ✓ 3).",
]

# --------------------------------------------------------------------------
# 1. Storyboard + shot list
# --------------------------------------------------------------------------
STORYBOARD = {
    "slug": "storyboard-sablonu",
    "title": "Storyboard ve Plan Listesi Şablonu",
    "short": "Storyboard ve plan listesi",
    "files": {
        "sb169": "rast-storyboard-16x9",
        "sb916": "rast-storyboard-9x16",
        "shot": "rast-plan-listesi",
    },
    "shot_blocks": [
        ("row", [("Proje", "proje", 3), ("Çekim günü / tarih", "tarih", 2), ("Lokasyon", "lokasyon", 2), ("Yönetmen", "yonetmen", 2), ("Sayfa", "sayfa", 1)]),
        ("table", "plan", SHOT_COLS, 16, 8.6),
        ("break",),
        ("h", "Hızlı başvuru: plan ölçekleri, açılar ve kamera hareketleri"),
        ("ref",),
        ("h", "İyi bir plan listesi için beş kural"),
        ("bullets", SHOT_RULES),
    ],
}

# --------------------------------------------------------------------------
# 2. Brief form
# --------------------------------------------------------------------------
BRIEF = {
    "slug": "brief-formu",
    "title": "Video Brief Formu",
    "subtitle": "Bir video projesine başlamadan önce doldurup ajansınızla ya da ekibinizle paylaşın.",
    "file": "rast-video-brief-formu",
    "blocks": [
        ("h", "1. Proje ve iletişim"),
        ("row", [("Marka / şirket", "marka", 1), ("Proje adı", "proje", 1)]),
        ("row", [("İletişim kişisi", "iletisim_kisi", 3), ("Görevi", "gorev", 2), ("Telefon / e-posta", "iletisim", 3)]),
        ("row", [("Formun doldurulduğu tarih", "form_tarih", 1), ("Son onayı verecek kişi", "onay_kisi", 2)]),
        ("h", "2. Amaç"),
        ("checks", "Bu video ne için?", "amac", ["Marka bilinirliği", "Ürün / hizmet tanıtımı", "Satış ya da talep toplama", "Lansman", "İşe alım / işveren markası", "Eğitim / bilgilendirme", "Etkinlik kaydı", "Sosyal medya içerik serisi", "Diğer:"]),
        ("area", "İzleyici videoyu izledikten sonra ne yapmalı? (tek cümle)", "eylem", 12),
        ("area", "Başarıyı neye bakarak ölçeceksiniz? (izlenme, mesaj, başvuru, satış…)", "olcum", 17),
        ("h", "3. Hedef kitle ve mesaj"),
        ("area", "Hedef kitle: kim, nerede, neye ihtiyacı var, hangi itirazı var?", "kitle", 30),
        ("area", "Tek cümlelik ana mesaj", "mesaj", 11),
        ("area", "Mutlaka söylenmesi ya da gösterilmesi gerekenler", "mutlaka", 24),
        ("area", "Kesinlikle olmaması gerekenler (söz, görsel, rakip, iddia)", "olmasin", 20),
        ("break",),
        ("h", "4. Teslimatlar"),
        ("checks", "Video türü", "tur", ["Tanıtım filmi", "Reklam filmi", "Reels / TikTok / Shorts", "Ürün videosu", "Röportaj / müşteri yorumu", "Etkinlik / aftermovie", "Drone görüntüsü", "Eğitim / anlatım", "Diğer:"]),
        ("checks", "En-boy oranı", "oran", ["16:9 yatay", "9:16 dikey", "1:1 kare", "4:5 dikey gönderi", "Diğer:"]),
        ("checks", "Yayın kanalları", "kanal", ["Instagram", "TikTok", "YouTube", "LinkedIn", "Web sitesi", "Ücretli dijital reklam", "TV / sinema", "Fuar / ekran / etkinlik", "Şirket içi", "Diğer:"]),
        ("row", [("Video adedi", "adet", 1), ("Hedef süre(ler)", "sure", 2), ("Dil(ler)", "dil", 2)]),
        ("checks", "Altyazı ve metin", "metin", ["Türkçe altyazı", "İngilizce altyazı", "Ekran yazıları", "Dış ses (seslendirme)", "Gerekmez"]),
        ("h", "5. Ton, tarz ve referanslar"),
        ("checks", "Ton", "ton", ["Samimi", "Kurumsal", "Enerjik", "Sinematik", "Esprili", "Duygusal", "Sade / bilgilendirici", "Prestijli"]),
        ("area", "Beğendiğiniz referans videolar (bağlantı + neyini beğendiğiniz)", "referans", 34),
        ("area", "Beğenmediğiniz örnekler ve nedeni", "sevmedik", 20),
        ("checks", "Elinizdeki marka varlıkları", "varlik", ["Logo (vektör)", "Kurumsal kimlik kılavuzu", "Yazı tipleri", "Renk kodları", "Müzik / ses logosu", "Eski videolar / arşiv", "Ürün görselleri"]),
        ("break",),
        ("h", "6. Çekim bilgileri"),
        ("area", "Çekim yeri / yerleri (adres, iç-dış mekân, izin gereken alanlar)", "mekan", 15),
        ("row", [("Uygun çekim tarihleri", "cekim_tarih", 1), ("Saat kısıtları (mesai, müşteri trafiği…)", "saat", 1)]),
        ("checks", "Kadrajda kimler olacak?", "kisi", ["Çalışanlar", "Yöneticiler", "Müşteriler", "Profesyonel oyuncu", "Çocuk (veli izni gerekir)", "Kimse (yalnızca ürün / mekân)"]),
        ("note", "Kadrajda tanınabilir kişiler olacaksa çekimden önce yazılı kullanım izni alın. Ücretsiz taslak: rastcreative.com/araclar/cekim-izin-formu/"),
        ("checks", "Özel gereksinimler", "ozel", ["Drone", "Ürün / masa üstü çekim", "Röportaj sesi", "Stüdyo", "Makyaj / stil", "Seslendirme sanatçısı", "Lisanslı müzik", "Hiçbiri"]),
        ("h", "7. Takvim, onay ve teslim"),
        ("row", [("İlk taslak için beklenen tarih", "taslak_tarih", 1), ("Yayın / son teslim tarihi", "yayin_tarih", 1)]),
        ("area", "Onay süreci: kimler onaylar, kaç tur düzeltme öngörülüyor?", "onay", 12),
        ("row", [("Teslim formatı (MP4, ProRes, ham görüntü…)", "format", 1), ("Teslim yolu (bağlantı, disk…)", "teslim", 1)]),
        ("checks", "Kullanım kapsamı", "hak", ["Yalnızca organik paylaşım", "Ücretli reklamda da kullanılacak", "Belirli süre", "Süresiz kullanım isteniyor", "Yurt dışında da kullanılacak"]),
        ("area", "Eklemek istedikleriniz", "ek", 24),
        ("note", "Kapsamı ve bütçeyi bu formu birlikte gözden geçirirken konuşmak en sağlıklısı: aynı brief farklı kapsamlarla çekilebilir."),
    ],
}

# --------------------------------------------------------------------------
# 3. Shoot-day checklist
# --------------------------------------------------------------------------
CHECKLIST_SECTIONS = [
    ("Bir gün önce", [
        ("Çekim planı (call sheet) ekibe gönderildi", "Saat, adres, iletişim, park ve giriş bilgisi"),
        ("Plan listesi ve storyboard son hali elde", "Basılı ya da telefonda, çevrimdışı açılıyor"),
        ("Hava durumu ve gün ışığı saatleri kontrol edildi", "Dış çekimde B planı hazır"),
        ("Mekân sorumlusuyla giriş saati teyit edildi", "Elektrik noktaları, asansör, yük girişi"),
        ("Oyuncu / katılımcılara saat ve kıyafet bilgisi verildi", "Logo, yoğun desen ve parlak beyazdan kaçının"),
    ]),
    ("Kamera", [
        ("Gövdeler açılıyor, tarih / saat ve timecode ayarlı", "Çok kamerada timecode ya da klaket senkronu"),
        ("Çözünürlük, kare hızı, codec, renk profili plana uygun", "Tüm kameralarda aynı ayar"),
        ("Beyaz dengesi manuel, enstantane kare hızına uygun", "Genelde kare hızının iki katı (180° kuralı)"),
        ("Lensler temiz; kapaklar ve filtreler (ND, polarize) tamam", "Mikrofiber bez, hava pompası"),
        ("Tripod, plaka, gimbal dengeli; monitör ve kablolar", "Gimbal kalibrasyonu yapıldı"),
        ("Test kaydı alındı ve izlendi", "Odak, pozlama, ses kanalı kontrolü"),
    ]),
    ("Ses", [
        ("Yaka mikrofonları ve vericiler eşlendi, yedek pil var", "Kanal ve frekans çakışması yok"),
        ("Shotgun / boom ve rüzgârlık hazır", "Dış mekânda tüylü rüzgârlık"),
        ("Seviyeler ayarlandı, tepe noktaları güvenli", "Konuşmada yaklaşık −12 / −6 dBFS"),
        ("Klima, buzdolabı, müzik gibi sesler kapatıldı", "Bitince geri açmayı unutmayın"),
        ("30 saniye oda sesi kaydedildi; kulaklıkla dinlendi", "Kurguda boşlukları doldurmak için"),
    ]),
    ("Işık", [
        ("Işıklar, ayaklar, kum torbaları, softbox ve difüzörler", "Ayak başına bir kum torbası"),
        ("Renk sıcaklığı tutarlı", "Pencere ışığı ile ampul karışımına dikkat"),
        ("Titreme (flicker) testi yapıldı", "LED / floresan altında enstantane uyumu"),
        ("Reflektör, bayrak, siyah bez; güvenli kablo geçişleri", "Kablolar bantlı, geçiş yolları açık"),
    ]),
    ("Medya ve veri", [
        ("Hafıza kartları kamerada formatlandı, alan yeterli", "Kartlar numaralı (A001, A002…)"),
        ("Yedek kartlar ve kart okuyucu çantada", "Okuyucu kablosu dahil"),
        ("Dolu / boş kart ayrımı belli", "Kart kutusu ya da renkli bant"),
        ("Gün sonunda kart sayısı kayıt sayısıyla eşleşti", "Kayıp kart = kayıp gün"),
    ]),
    ("Güç", [
        ("Tüm bataryalar dolu ve sayıldı", "Kamera, ışık, ses, monitör, drone"),
        ("Şarj cihazları, çoklu priz, uzatma kablosu", "Kablo makarası tamamen açılarak kullanılır"),
        ("Mekânın priz yerleri ve sigorta kapasitesi biliniyor", "Yüksek watt ışıkları aynı hatta toplamayın"),
        ("Telefon ve gimbal için powerbank", "Ekip iletişimi kesilmesin"),
    ]),
    ("İzin ve evrak", [
        ("Mekân çekim izni yazılı olarak alındı", "E-posta da yeterli bir kayıt olur"),
        ("Kadrajdaki kişilerin görüntü ve ses kullanım izinleri", "18 yaş altı için veli / vasi imzası"),
        ("Kamusal alan için gereken izinler soruldu", "Belediye, AVM, site yönetimi"),
        ("Drone: kayıt, uçuş izni ve yasak bölge kontrolü", "SHGM kuralları; uçuş öncesi bölge kontrolü"),
        ("Kadrajdaki başka marka, logo ve müzik düşünüldü", "Gerekirse kadraj dışına alın"),
    ]),
    ("Set ve güvenlik", [
        ("Kablolar bantlandı, ayaklar sabitlendi", "Geçiş yolları boş"),
        ("İlk yardım çantası var, en yakın sağlık kuruluşu biliniyor", "Adres çekim planında yazılı"),
        ("Yemek ve su molası planlandı", "Uzun günlerde 5–6 saatte bir mola"),
        ("Mekân çekimden önce fotoğraflandı", "Eşyaları ilk haline döndürmek için"),
    ]),
    ("Yedekleme", [
        ("Kartlar gün içinde en az iki ayrı diske kopyalandı", "3-2-1: üç kopya, iki ortam, biri ayrı yerde"),
        ("Kopyalama doğrulandı", "Dosya sayısı ve boyutu ya da checksum"),
        ("Klasörler adlandırıldı", "TARİH_PROJE_KAMERA_KART"),
        ("Hiçbir kart, yedeği doğrulanmadan formatlanmadı", "Altın kural"),
    ]),
    ("Toparlanma (wrap)", [
        ("Ekipman listeyle sayıldı, eksik ve hasar not edildi", "Kiralık ekipman ayrıca kontrol"),
        ("Mekân ilk haline getirildi, çöp toplandı", "Çekim öncesi fotoğraflarla karşılaştırın"),
        ("İmzalı izin formları toplandı ve sayıldı", "Kişi sayısıyla eşleşiyor"),
        ("Çekilemeyen planlar ve ek çekim ihtiyacı not edildi", "Plan listesinde işaretli"),
        ("Gün raporu ekiple paylaşıldı", "Kart sayısı, sorunlar, yarın için notlar"),
        ("Bataryalar şarja takıldı", "Bir sonraki çekime hazır"),
    ]),
]


def _cl(i):
    name, items = CHECKLIST_SECTIONS[i]
    return [("h", name), ("checklist", f"s{i+1}", items)]


CHECKLIST = {
    "slug": "cekim-kontrol-listesi",
    "title": "Çekim Günü Kontrol Listesi",
    "subtitle": "Kamera, ses, ışık, medya, güç, izinler, yedekleme ve toparlanma: sete çıkmadan ve setten ayrılmadan önce.",
    "file": "rast-cekim-gunu-kontrol-listesi",
    "sections": CHECKLIST_SECTIONS,
    "blocks": [
        ("row", [("Proje", "proje", 3), ("Çekim tarihi", "tarih", 2), ("Lokasyon", "lokasyon", 3), ("Kontrol eden", "kontrol", 2)]),
        *_cl(0), *_cl(1), *_cl(2), *_cl(3),
        ("break",),
        *_cl(4), *_cl(5), *_cl(6), *_cl(7),
        ("break",),
        *_cl(8), *_cl(9),
        ("h", "Notlar"),
        ("area", "Sorunlar, eksikler, bir sonraki çekim için", "notlar", 34),
        ("sign", ["Kontrol eden", "Saat"]),
    ],
}

# --------------------------------------------------------------------------
# 4. Consent form (KVKK-aware draft)
# --------------------------------------------------------------------------
DISCLAIMER = (
    "Genel bir taslaktır, hukuki danışmanlık değildir; kullanmadan önce bir avukata kontrol ettirin. "
    "Projenize göre sadeleştirin; gerekmeyen seçenekleri silin."
)

HAKLAR = (
    "KVKK m.11 uyarınca veri sorumlusuna başvurarak kişisel verilerinizin işlenip işlenmediğini öğrenme, "
    "işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, "
    "yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse "
    "düzeltilmesini, KVKK m.7 çerçevesinde silinmesini veya yok edilmesini ve bu işlemlerin aktarılan üçüncü "
    "kişilere bildirilmesini isteme, münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir "
    "sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın "
    "giderilmesini talep etme haklarına sahipsiniz. Başvurunuzu yukarıdaki iletişim adresine yazılı olarak "
    "yapabilirsiniz; talebiniz en geç otuz gün içinde, kural olarak ücretsiz sonuçlandırılır."
)

IZIN = {
    "slug": "cekim-izin-formu",
    "title": "Görüntü ve Ses Kullanım İzin Formu",
    "subtitle": "KVKK (6698) esas alınarak hazırlanmış genel taslak · Aydınlatma metni ve açık rıza ayrı bölümlerdedir.",
    "file": "rast-goruntu-ve-ses-kullanim-izin-formu",
    "blocks": [
        ("warn", DISCLAIMER),
        ("h", "Bölüm A — Aydınlatma metni (KVKK m.10)"),
        ("row", [("Veri sorumlusu (şirket / kişi unvanı)", "vs_unvan", 1), ("Adres", "vs_adres", 1)]),
        ("row", [("İletişim (e-posta / telefon)", "vs_iletisim", 1), ("Proje / çekim adı", "proje", 1)]),
        ("row", [("Çekim tarihi", "cekim_tarih", 1), ("Çekim yeri", "cekim_yer", 2)]),
        ("dl", [
            ("İşlenen veriler", "Çekim sırasında kaydedilen görüntünüz (fotoğraf ve video) ile sesiniz; bu formdaki ad-soyad, iletişim bilgisi ve imzanız. 18 yaşından küçük katılımcılar için ayrıca veli veya vasinin aynı bilgileri."),
            ("Amaç", "Bölüm B'de işaretlenen kanallarda yer alacak video ve fotoğrafların çekilmesi, kurgulanması, yayımlanması ve arşivlenmesi; verilen iznin ispatı."),
            ("Hukuki sebep ve yöntem", "Görüntü ve sesinizin yayımlanması açık rızanıza dayanır (KVKK m.5/1). Bu formdaki bilgiler, bir hakkın tesisi, kullanılması veya korunması (m.5/2-e) ve veri sorumlusunun meşru menfaati (m.5/2-f) kapsamında saklanır. Veriler çekim sırasında kamera ve ses kayıt cihazlarıyla ve bu formla toplanır."),
            ("Aktarım", "Veriler yalnızca bu amaçlarla prodüksiyon ekibine, işin sahibi olan markaya ve yayın yapılacak kanalların hizmet sağlayıcılarına aktarılabilir. Sosyal medya ve video platformlarının sunucuları yurt dışında bulunabilir; bu aktarımlar KVKK m.9'daki şartlara uygun yapılır."),
            ("Saklama süresi", "İzin formu, rıza geri alınsa da olası uyuşmazlıklar için yasal zamanaşımı süresince saklanır. Yayımlanmayan ham görüntüler aşağıda yazan süre sonunda silinir."),
            ("Haklarınız", HAKLAR),
        ]),
        ("row", [("Ham görüntülerin saklama süresi", "ham_sure", 1), ("Başvuru adresi (yukarıdakinden farklıysa)", "basvuru", 2)]),
        ("signrow", "Aydınlatma metnini okudum, bilgilendirildim.", ["Ad soyad", "Tarih"], "a"),
        ("break",),
        ("warn", DISCLAIMER),
        ("h", "Bölüm B — Açık rıza ve kullanım izni"),
        ("row", [("Katılımcının adı soyadı", "katilimci", 3), ("Telefon / e-posta", "k_iletisim", 2)]),
        ("p", "Bölüm A'daki aydınlatma metnini okudum. Aşağıda işaretlediğim kapsamla sınırlı olmak üzere görüntü ve sesimin kaydedilmesine, kurgulanmasına ve yayımlanmasına özgür irademle açık rıza veriyorum."),
        ("checks", "Kullanılabilecek kanallar (yalnızca işaretlenenler)", "kanal", ["Markanın web sitesi", "Sosyal medya hesapları (organik paylaşım)", "Ücretli dijital reklamlar", "YouTube ve video platformları", "TV / sinema reklamı", "Basılı ve açık hava (afiş, broşür, pano)", "Fuar, etkinlik ve sunumlar", "Şirket içi iletişim", "Prodüksiyon şirketinin portföyü"]),
        ("checks", "Kullanım süresi", "sure", ["Proje süresince", "1 yıl", "2 yıl", "3 yıl", "Diğer:"]),
        ("checks", "Bölge", "bolge", ["Yalnızca Türkiye", "Türkiye ve yurt dışı (internet yayını dahil)"]),
        ("checks", "Adımın gösterilmesi", "isim", ["Adım ve soyadım gösterilebilir", "Yalnızca adım gösterilebilir", "Adım gösterilmesin"]),
        ("checks", "Karşılık", "karsilik", ["Bedelsiz", "Ayrı bir sözleşmeyle belirlenen karşılık"]),
        ("dl", [
            ("Kurgu sınırları", "Görüntü ve sesim kesilip kısaltılabilir; renk ve ses düzeltmesi yapılabilir, altyazı ve grafik eklenebilir. Sözlerimin anlamını değiştiren, beni farklı biri gibi gösteren, itibarımı zedeleyen ya da yüzümü veya sesimi yapay zekâyla yeniden üreten düzenlemeler ayrıca yazılı iznim olmadan yapılamaz."),
            ("Geri alma", "Açık rızamı dilediğim zaman, Bölüm A'daki iletişim adresine yazılı olarak bildirerek geri alabilirim. Geri alma ileriye dönük sonuç doğurur: veri sorumlusu makul süre içinde kendi kontrolündeki dijital yayınları kaldırır ve yeni kullanım yapmaz; geri almadan önce basılmış veya dağıtılmış materyallerin toplanması mümkün olmayabilir. Rıza vermemem ya da geri almam nedeniyle aleyhime bir sonuç doğmaz."),
        ]),
        ("area", "Özel koşullar / notlar", "kosul", 13),
        ("signrow", "Katılımcı", ["Ad soyad", "Tarih"], "b"),
        ("signrow", "Veri sorumlusu adına", ["Ad soyad / unvan", "Tarih"], "vs"),
        ("break",),
        ("warn", DISCLAIMER),
        ("h", "Bölüm C — 18 yaşından küçükler için veli / vasi onayı"),
        ("note", "18 yaşını doldurmamış katılımcılar için bu bölümü veli veya vasi doldurup imzalar. Çocuğun ayırt etme gücü varsa görüşü alınmalı, tercihen o da imzalamalıdır. Çocukların okul, adres gibi bilgileri yayımlanmamalı; içerikte çocuğun üstün yararı gözetilmelidir."),
        ("row", [("Çocuğun adı soyadı", "cocuk", 3), ("Doğum yılı", "dogum", 1)]),
        ("row", [("Veli / vasinin adı soyadı", "veli", 3), ("Yakınlığı", "yakinlik", 1), ("Telefon / e-posta", "v_iletisim", 2)]),
        ("p", "Velisi / vasisi olduğum çocuğun görüntü ve sesinin, Bölüm A'daki aydınlatma metni çerçevesinde ve Bölüm B'de işaretlenen kapsamla sınırlı olarak işlenmesine açık rıza veriyorum. Bu rızayı çocuk adına dilediğim zaman geri alabileceğimi biliyorum."),
        ("checks", "Kapsam", "c_kapsam", ["Bölüm B'deki seçimler geçerli", "Aşağıdaki notla daraltılmış kapsam geçerli"]),
        ("area", "Kapsam notu", "c_not", 11),
        ("signrow", "Veli / vasi", ["Ad soyad", "Tarih"], "v"),
        ("signrow", "Çocuğun görüşü alındı (isteğe bağlı)", ["Çocuğun adı", "Tarih"], "c"),
        ("h", "Veri sorumlusu için kullanım notları"),
        ("bullets", [
            "Formu kişi kayda girmeden önce imzalatın; önce Bölüm A'yı okutun. Aydınlatma ve açık rıza ayrı imzalanır.",
            "Kanalları ve süreyi projeye göre daraltın; “her yerde, süresiz” geniş rıza yerine somut kapsam yazın.",
            "Kalabalık ve etkinlik çekimlerinde alana görünür bilgilendirme yazısı koyun; öne çıkan kişilerden ayrıca izin alın.",
            "Hasta, sağlık verisi ya da diğer özel nitelikli veriler içeren çekimler bu taslağın kapsamı dışındadır.",
            "İmzalı formları erişimi sınırlı bir yerde saklayın, bir kopyasını katılımcıya verin.",
        ]),
        ("small", "Dayanak: 6698 sayılı KVKK m.5, 9, 10, 11 · Aydınlatma Yükümlülüğü Tebliği ve Veri Sorumlusuna Başvuru Tebliği (RG 10.03.2018, 30356) · Kişisel Verileri Koruma Kurulu'nun 18.02.2026 tarihli, 2026/347 sayılı ilke kararı (aydınlatma ve açık rıza metinleri ayrı düzenlenmeli) · 4721 sayılı TMK m.24 (kişilik hakkı) · 5846 sayılı FSEK m.86 (resim ve portreler)."),
    ],
}
