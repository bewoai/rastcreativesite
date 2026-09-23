# Taslak: "Işık Masası" ana sayfa konsepti

Durum: **prototip** — `/taslak/` adresinde, `noindex`, sitemap dışı. Canlı ana sayfa
(`src/pages/index.astro`) değişmedi. Beğenilirse bölüm bölüm ana sayfaya taşınır.

## Neden

Mevcut ana sayfa (güneş sistemi hero + koyu/açık bantlar + scroll reveal) ile önceki
hâli ikisi de "genel ajans sitesi" gibi okunuyordu. İstenen: daha karakteristik,
kullanımı kolay, fazla minimal değil, ama **klasik scroll-animasyon sitesi değil**.

## Fikir

Site bir kurgucunun masası gibi davranır. Deneyim, kaydırınca kendiliğinden olan
şeylerden değil, **ziyaretçinin yaptığı şeylerden** gelir:

| Bölüm | Metafor | Ziyaretçi ne yapar |
|---|---|---|
| Hero | Saha monitörü + film şeridi | Şeritten bir kare seçer → iş monitöre gelir, "Burada izle" ile sayfadan çıkmadan YouTube oynar |
| İşler | Kontakt baskı | Kategori sekmesiyle süzer; hover/focus'ta yağlı kalemle kare işaretlenir, müşteri adı el yazısıyla çıkar |
| Süreç | Kurgu timeline'ı (NLE) | Oynatma kafasını sürükler / Oynat'a basar → hangi hafta ne olduğunu görür |
| Hizmetler | Film kutusu etiketleri | Okur — sade, bantlı etiketler |
| Lead | Çekim föyü | Tek cümlelik "boşluk doldurma" formu doldurur |

## Görsel sistem

- Zemin: sıcak ışık masası `#ebe5d9`; iş gösteren yüzeyler film siyahı `#141210`.
- Tek aksan: Rast amber `#e25303` (CTA) + yağlı kalem turuncusu `#d63d12` (işaretler).
- Tipografi: Inter (gövde/başlık) + **Instrument Serif italik** (başlıklarda tek vurgu
  kelimesi) + **Caveat** (el yazısı notlar). Hepsi self-host, latin + latin-ext.
- Hareket yalnızca etkileşime cevap: kare seçiminde "cut" flaşı, kalem çizimi,
  timeline oynatma. Scroll'a bağlı reveal yok.

## Kullanılabilirlik / erişim kararları

- Film şeridi `<button aria-pressed>`; kontakt baskı hücreleri düz link (SEO + basitlik).
- Timeline oynatma kafası native `<input type="range">` → klavye, dokunmatik, ekran
  okuyucu hazır. Dört aşama metni her zaman altta okunur; kafa sadece vurgular.
- Mobilde (<760px) timeline gizlenir, aşamalar düz liste olur.
- `prefers-reduced-motion`: tüm geçişler kapalı; Oynat butonu aşama aşama atlar;
  monitör videosu otomatik oynamaz.
- Monitör videosu ve timecode sadece monitör görünürken çalışır (IntersectionObserver).
- Form: `/iletisim/` ile aynı Web3Forms uç noktası ve aynı zorunlu alanlar (ad + telefon).
  Konu satırı `(taslak)` ekiyle gelir → hangi tasarımdan lead geldiği ayrışır.
  GA4 olayı: `lead_form_submit_success` / `form_id: taslak_call_sheet`.

## Bilinen açıklar / sonraki adımlar

- Showreel monitörde şimdilik mevcut `showreel-board` videosu; gerçek reel gelince
  değişecek (Faz 1).
- SSS, blog ve bölgesel SEO bloğu (AreaIndex) taslakta yok; ana sayfaya taşırken
  SEO içeriği korunmalı (FAQ schema dahil).
- Taslak `bare` layout + kendi sticky header'ı ile çalışıyor; beğenilirse GlassNav
  bu dile uyarlanmalı (mobil alt bar dahil).
- Lighthouse ölçümü prod preview'da yapılmadı.
