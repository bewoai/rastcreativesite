# Nasıl çalışıyoruz — `/nasil-calisiyoruz/` (TASLAK)

Sayfa: `src/pages/nasil-calisiyoruz.astro`. Tarih: 2026-10-12. Durum: taslak,
`noindex, follow`, sitemap dışı (`NOINDEX_PATHS`), site menüsünde **yok**.

## Amaç

Müşteriye (hekim, esnaf, marka) video sürecini şeffaf anlatmak.
Konumlandırma: **"Kurguyu makine hızlandırır, kararı biz veririz."**
Kaynak: vault `04-Knowledge/Growth/rast-reklam-ve-icerik-fikirleri-2026-10.md` §1
(slogan 1) ve Kurgu Masası (`Dahili Projeler/videolar`, Akış'ın 5 aşaması).

## Bölümler

| # | Bölüm | Not |
|---|---|---|
| — | Giriş + tez | H1 = slogan; altında üç kısa iddia (Hız · Karar · Onay) |
| I | Süreç (`#surec`) | 4 adım: `#brief`, `#kurgu`, `#onay`, `#teslim`. Kurgu adımında Kurgu Masası'nın 5 karar noktası; onay adımında hekim notu |
| II | Yapay zekâ (`#yapay-zeka`) | "Kullanıyoruz" tablosu (iş / makine ne yapar / kararı kim verir) + "Kullanmıyoruz" listesi + etiket kuralı. Telefonda tablo satırları blok olur, ARIA rolleri açık |
| III | Süreler (`#sureler`) | Temkinli: "ilk kurgu genellikle aynı hafta"; ölçülmemiş süre yok |
| IV | SSS (`#sss`) | 5 soru, FAQPage JSON-LD |
| — | Son CTA | `EV_CTA` → `/iletisim/?kaynak=surec#teklif-formu` + telefon |

## Kopya kuralları

- "Ertesi gün teslim" yazılmaz. Kurgu Masası'nın gerçek ham çekimle ilk uçtan uca
  üretimi ölçülünce süreler güncellenebilir.
- Yasak: hayallerinizdeki, eşsiz, yaratıcı çözümler, en iyi, garanti.
- AI "kurguya yardım ediyor" diye tarif edilir; gerçek kişi/ürün kopyası üretilmez;
  AI sahne kullanılırsa videoda etiketlenir.
- Hekim: "tanıtım yönetmeliğine uyum editörün kontrolünde", son onay hekimin.

## Yayına alma kontrol listesi

- [ ] Bewo + Mami metni onayladı
- [ ] Dört `data-placeholder` figür gerçek ekran görüntüsüyle değişti (`<img>`: `alt`,
      `width`/`height`, `loading="lazy"`). Hekim görüntüsü yalnızca yazılı izinle;
      varsayılan Rast'ın kendi ya da Aytaş çekimi
- [ ] İnceleme ekranının müşteri tarafında nasıl açıldığı (bağlantı, giriş gerekip
      gerekmediği) doğrulandı; gerekiyorsa 3. adım metni netleşti
- [ ] `ROBOTS` → `undefined`, `astro.config.mjs` `NOINDEX_PATHS`'ten çıkar
- [ ] Menüye/footer'a eklenip eklenmeyeceği kararı (`EV_NAV`)
- [ ] `llms.txt` ve iç linkler (hizmetler, hekim sayfası) güncellendi
