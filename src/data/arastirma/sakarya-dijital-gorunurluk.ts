/**
 * Data for /arastirma/sakarya-dijital-gorunurluk/ — 2026 Rast Sakarya Dijital Görünürlük Endeksi.
 *
 * GENERATED FILE — do not edit by hand. Produced by site_veri_uret.py from
 * sonuc.json, which hesapla.py computes from the raw sheet (ham.csv). The raw
 * sheet (business names, profile links) is NOT in this repo (KVKK): only
 * aggregate rates with their sample size are published.
 * Generated: 2026-11-10T13:48:10+00:00
 */

export const UPDATED = "2026-11-10";
export const UPDATED_TR = "10 Kasım 2026";
export const PERIOD = "10 Kasım 2026";
export const INDEX_NAME = "2026 Rast Sakarya Dijital Görünürlük Endeksi";
export const MIN_N = 30;
export const SAMPLE_N = 464;

export type Rate = { evet: number; n: number; bilinmiyor: number; oran: number | null; gaAlt: number | null; gaUst: number | null; yayin: boolean };
export type Metric = { key: string; label: string; payda: string; genel: Rate; sektor: Record<string, Rate>; ilce: Record<string, Rate> };

export const SECTORS: { key: string; name: string; query: string; n: number }[] = [
  {
    "key": "yeme_icme",
    "name": "Restoran",
    "query": "restoran",
    "n": 76
  },
  {
    "key": "guzellik",
    "name": "Kuaför ve güzellik salonu",
    "query": "kuaför",
    "n": 79
  },
  {
    "key": "mobilya",
    "name": "Mobilya",
    "query": "mobilya mağazası",
    "n": 75
  },
  {
    "key": "giyim",
    "name": "Giyim / butik",
    "query": "giyim mağazası",
    "n": 78
  },
  {
    "key": "oto",
    "name": "Oto servis",
    "query": "oto servis",
    "n": 79
  },
  {
    "key": "emlak",
    "name": "Emlak ofisi",
    "query": "emlak ofisi",
    "n": 77
  }
];

export const DISTRICTS: { name: string; n: number }[] = [
  {
    "name": "Adapazarı",
    "n": 59
  },
  {
    "name": "Serdivan",
    "n": 61
  },
  {
    "name": "Erenler",
    "n": 58
  },
  {
    "name": "Arifiye",
    "n": 48
  },
  {
    "name": "Hendek",
    "n": 60
  },
  {
    "name": "Akyazı",
    "n": 60
  },
  {
    "name": "Sapanca",
    "n": 60
  },
  {
    "name": "Karasu",
    "n": 58
  }
];

export const METRICS: Metric[] = [
  {
    "key": "web_sitesi",
    "label": "Google profilinde kendi web sitesi bağlantısı olan",
    "payda": "tüm işletmeler",
    "genel": {
      "evet": 151,
      "n": 464,
      "bilinmiyor": 0,
      "oran": 33,
      "gaAlt": 28,
      "gaUst": 37,
      "yayin": true
    },
    "sektor": {
      "yeme_icme": {
        "evet": 26,
        "n": 76,
        "bilinmiyor": 0,
        "oran": 34,
        "gaAlt": 25,
        "gaUst": 45,
        "yayin": true
      },
      "guzellik": {
        "evet": 7,
        "n": 79,
        "bilinmiyor": 0,
        "oran": 9,
        "gaAlt": 4,
        "gaUst": 17,
        "yayin": true
      },
      "mobilya": {
        "evet": 40,
        "n": 75,
        "bilinmiyor": 0,
        "oran": 53,
        "gaAlt": 42,
        "gaUst": 64,
        "yayin": true
      },
      "giyim": {
        "evet": 30,
        "n": 78,
        "bilinmiyor": 0,
        "oran": 38,
        "gaAlt": 28,
        "gaUst": 50,
        "yayin": true
      },
      "oto": {
        "evet": 20,
        "n": 79,
        "bilinmiyor": 0,
        "oran": 25,
        "gaAlt": 17,
        "gaUst": 36,
        "yayin": true
      },
      "emlak": {
        "evet": 28,
        "n": 77,
        "bilinmiyor": 0,
        "oran": 36,
        "gaAlt": 27,
        "gaUst": 48,
        "yayin": true
      }
    },
    "ilce": {
      "Adapazarı": {
        "evet": 28,
        "n": 59,
        "bilinmiyor": 0,
        "oran": 47,
        "gaAlt": 35,
        "gaUst": 60,
        "yayin": true
      },
      "Serdivan": {
        "evet": 24,
        "n": 61,
        "bilinmiyor": 0,
        "oran": 39,
        "gaAlt": 28,
        "gaUst": 52,
        "yayin": true
      },
      "Erenler": {
        "evet": 15,
        "n": 58,
        "bilinmiyor": 0,
        "oran": 26,
        "gaAlt": 16,
        "gaUst": 38,
        "yayin": true
      },
      "Arifiye": {
        "evet": 14,
        "n": 48,
        "bilinmiyor": 0,
        "oran": 29,
        "gaAlt": 18,
        "gaUst": 43,
        "yayin": true
      },
      "Hendek": {
        "evet": 21,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 35,
        "gaAlt": 24,
        "gaUst": 48,
        "yayin": true
      },
      "Akyazı": {
        "evet": 14,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 23,
        "gaAlt": 14,
        "gaUst": 35,
        "yayin": true
      },
      "Sapanca": {
        "evet": 21,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 35,
        "gaAlt": 24,
        "gaUst": 48,
        "yayin": true
      },
      "Karasu": {
        "evet": 14,
        "n": 58,
        "bilinmiyor": 0,
        "oran": 24,
        "gaAlt": 15,
        "gaUst": 37,
        "yayin": true
      }
    }
  },
  {
    "key": "site_acilir",
    "label": "Web sitesi açılan (HTTP 200, işletmeye ait içerik)",
    "payda": "sitesi olanlar",
    "genel": {
      "evet": 114,
      "n": 149,
      "bilinmiyor": 2,
      "oran": 77,
      "gaAlt": 69,
      "gaUst": 83,
      "yayin": true
    },
    "sektor": {
      "yeme_icme": {
        "evet": 17,
        "n": 26,
        "bilinmiyor": 0,
        "oran": 65,
        "gaAlt": 46,
        "gaUst": 81,
        "yayin": false
      },
      "guzellik": {
        "evet": 7,
        "n": 7,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 65,
        "gaUst": 100,
        "yayin": false
      },
      "mobilya": {
        "evet": 32,
        "n": 39,
        "bilinmiyor": 1,
        "oran": 82,
        "gaAlt": 67,
        "gaUst": 91,
        "yayin": true
      },
      "giyim": {
        "evet": 25,
        "n": 29,
        "bilinmiyor": 1,
        "oran": 86,
        "gaAlt": 69,
        "gaUst": 95,
        "yayin": false
      },
      "oto": {
        "evet": 15,
        "n": 20,
        "bilinmiyor": 0,
        "oran": 75,
        "gaAlt": 53,
        "gaUst": 89,
        "yayin": false
      },
      "emlak": {
        "evet": 18,
        "n": 28,
        "bilinmiyor": 0,
        "oran": 64,
        "gaAlt": 46,
        "gaUst": 79,
        "yayin": false
      }
    },
    "ilce": {
      "Adapazarı": {
        "evet": 23,
        "n": 28,
        "bilinmiyor": 0,
        "oran": 82,
        "gaAlt": 64,
        "gaUst": 92,
        "yayin": false
      },
      "Serdivan": {
        "evet": 21,
        "n": 24,
        "bilinmiyor": 0,
        "oran": 88,
        "gaAlt": 69,
        "gaUst": 96,
        "yayin": false
      },
      "Erenler": {
        "evet": 11,
        "n": 15,
        "bilinmiyor": 0,
        "oran": 73,
        "gaAlt": 48,
        "gaUst": 89,
        "yayin": false
      },
      "Arifiye": {
        "evet": 8,
        "n": 12,
        "bilinmiyor": 2,
        "oran": 67,
        "gaAlt": 39,
        "gaUst": 86,
        "yayin": false
      },
      "Hendek": {
        "evet": 16,
        "n": 21,
        "bilinmiyor": 0,
        "oran": 76,
        "gaAlt": 55,
        "gaUst": 89,
        "yayin": false
      },
      "Akyazı": {
        "evet": 12,
        "n": 14,
        "bilinmiyor": 0,
        "oran": 86,
        "gaAlt": 60,
        "gaUst": 96,
        "yayin": false
      },
      "Sapanca": {
        "evet": 15,
        "n": 21,
        "bilinmiyor": 0,
        "oran": 71,
        "gaAlt": 50,
        "gaUst": 86,
        "yayin": false
      },
      "Karasu": {
        "evet": 8,
        "n": 14,
        "bilinmiyor": 0,
        "oran": 57,
        "gaAlt": 33,
        "gaUst": 79,
        "yayin": false
      }
    }
  },
  {
    "key": "https",
    "label": "Sitesi HTTPS olan",
    "payda": "sitesi açılanlar",
    "genel": {
      "evet": 111,
      "n": 114,
      "bilinmiyor": 0,
      "oran": 97,
      "gaAlt": 93,
      "gaUst": 99,
      "yayin": true
    },
    "sektor": {
      "yeme_icme": {
        "evet": 17,
        "n": 17,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 82,
        "gaUst": 100,
        "yayin": false
      },
      "guzellik": {
        "evet": 7,
        "n": 7,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 65,
        "gaUst": 100,
        "yayin": false
      },
      "mobilya": {
        "evet": 32,
        "n": 32,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 89,
        "gaUst": 100,
        "yayin": true
      },
      "giyim": {
        "evet": 25,
        "n": 25,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 87,
        "gaUst": 100,
        "yayin": false
      },
      "oto": {
        "evet": 13,
        "n": 15,
        "bilinmiyor": 0,
        "oran": 87,
        "gaAlt": 62,
        "gaUst": 96,
        "yayin": false
      },
      "emlak": {
        "evet": 17,
        "n": 18,
        "bilinmiyor": 0,
        "oran": 94,
        "gaAlt": 74,
        "gaUst": 99,
        "yayin": false
      }
    },
    "ilce": {
      "Adapazarı": {
        "evet": 22,
        "n": 23,
        "bilinmiyor": 0,
        "oran": 96,
        "gaAlt": 79,
        "gaUst": 99,
        "yayin": false
      },
      "Serdivan": {
        "evet": 21,
        "n": 21,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 85,
        "gaUst": 100,
        "yayin": false
      },
      "Erenler": {
        "evet": 11,
        "n": 11,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 74,
        "gaUst": 100,
        "yayin": false
      },
      "Arifiye": {
        "evet": 8,
        "n": 8,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 68,
        "gaUst": 100,
        "yayin": false
      },
      "Hendek": {
        "evet": 16,
        "n": 16,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 81,
        "gaUst": 100,
        "yayin": false
      },
      "Akyazı": {
        "evet": 12,
        "n": 12,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 76,
        "gaUst": 100,
        "yayin": false
      },
      "Sapanca": {
        "evet": 14,
        "n": 15,
        "bilinmiyor": 0,
        "oran": 93,
        "gaAlt": 70,
        "gaUst": 99,
        "yayin": false
      },
      "Karasu": {
        "evet": 7,
        "n": 8,
        "bilinmiyor": 0,
        "oran": 88,
        "gaAlt": 53,
        "gaUst": 98,
        "yayin": false
      }
    }
  },
  {
    "key": "mobil_viewport",
    "label": "Sitesinde mobil viewport etiketi olan",
    "payda": "sitesi açılanlar",
    "genel": {
      "evet": 112,
      "n": 114,
      "bilinmiyor": 0,
      "oran": 98,
      "gaAlt": 94,
      "gaUst": 100,
      "yayin": true
    },
    "sektor": {
      "yeme_icme": {
        "evet": 17,
        "n": 17,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 82,
        "gaUst": 100,
        "yayin": false
      },
      "guzellik": {
        "evet": 7,
        "n": 7,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 65,
        "gaUst": 100,
        "yayin": false
      },
      "mobilya": {
        "evet": 32,
        "n": 32,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 89,
        "gaUst": 100,
        "yayin": true
      },
      "giyim": {
        "evet": 25,
        "n": 25,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 87,
        "gaUst": 100,
        "yayin": false
      },
      "oto": {
        "evet": 14,
        "n": 15,
        "bilinmiyor": 0,
        "oran": 93,
        "gaAlt": 70,
        "gaUst": 99,
        "yayin": false
      },
      "emlak": {
        "evet": 17,
        "n": 18,
        "bilinmiyor": 0,
        "oran": 94,
        "gaAlt": 74,
        "gaUst": 99,
        "yayin": false
      }
    },
    "ilce": {
      "Adapazarı": {
        "evet": 23,
        "n": 23,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 86,
        "gaUst": 100,
        "yayin": false
      },
      "Serdivan": {
        "evet": 21,
        "n": 21,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 85,
        "gaUst": 100,
        "yayin": false
      },
      "Erenler": {
        "evet": 11,
        "n": 11,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 74,
        "gaUst": 100,
        "yayin": false
      },
      "Arifiye": {
        "evet": 8,
        "n": 8,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 68,
        "gaUst": 100,
        "yayin": false
      },
      "Hendek": {
        "evet": 16,
        "n": 16,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 81,
        "gaUst": 100,
        "yayin": false
      },
      "Akyazı": {
        "evet": 12,
        "n": 12,
        "bilinmiyor": 0,
        "oran": 100,
        "gaAlt": 76,
        "gaUst": 100,
        "yayin": false
      },
      "Sapanca": {
        "evet": 14,
        "n": 15,
        "bilinmiyor": 0,
        "oran": 93,
        "gaAlt": 70,
        "gaUst": 99,
        "yayin": false
      },
      "Karasu": {
        "evet": 7,
        "n": 8,
        "bilinmiyor": 0,
        "oran": 88,
        "gaAlt": 53,
        "gaUst": 98,
        "yayin": false
      }
    }
  },
  {
    "key": "whatsapp_sitede",
    "label": "Sitesinde WhatsApp bağlantısı olan",
    "payda": "sitesi açılanlar",
    "genel": {
      "evet": 52,
      "n": 114,
      "bilinmiyor": 0,
      "oran": 46,
      "gaAlt": 37,
      "gaUst": 55,
      "yayin": true
    },
    "sektor": {
      "yeme_icme": {
        "evet": 3,
        "n": 17,
        "bilinmiyor": 0,
        "oran": 18,
        "gaAlt": 6,
        "gaUst": 41,
        "yayin": false
      },
      "guzellik": {
        "evet": 3,
        "n": 7,
        "bilinmiyor": 0,
        "oran": 43,
        "gaAlt": 16,
        "gaUst": 75,
        "yayin": false
      },
      "mobilya": {
        "evet": 16,
        "n": 32,
        "bilinmiyor": 0,
        "oran": 50,
        "gaAlt": 34,
        "gaUst": 66,
        "yayin": true
      },
      "giyim": {
        "evet": 12,
        "n": 25,
        "bilinmiyor": 0,
        "oran": 48,
        "gaAlt": 30,
        "gaUst": 67,
        "yayin": false
      },
      "oto": {
        "evet": 6,
        "n": 15,
        "bilinmiyor": 0,
        "oran": 40,
        "gaAlt": 20,
        "gaUst": 64,
        "yayin": false
      },
      "emlak": {
        "evet": 12,
        "n": 18,
        "bilinmiyor": 0,
        "oran": 67,
        "gaAlt": 44,
        "gaUst": 84,
        "yayin": false
      }
    },
    "ilce": {
      "Adapazarı": {
        "evet": 10,
        "n": 23,
        "bilinmiyor": 0,
        "oran": 43,
        "gaAlt": 26,
        "gaUst": 63,
        "yayin": false
      },
      "Serdivan": {
        "evet": 9,
        "n": 21,
        "bilinmiyor": 0,
        "oran": 43,
        "gaAlt": 24,
        "gaUst": 63,
        "yayin": false
      },
      "Erenler": {
        "evet": 8,
        "n": 11,
        "bilinmiyor": 0,
        "oran": 73,
        "gaAlt": 43,
        "gaUst": 90,
        "yayin": false
      },
      "Arifiye": {
        "evet": 3,
        "n": 8,
        "bilinmiyor": 0,
        "oran": 38,
        "gaAlt": 14,
        "gaUst": 69,
        "yayin": false
      },
      "Hendek": {
        "evet": 8,
        "n": 16,
        "bilinmiyor": 0,
        "oran": 50,
        "gaAlt": 28,
        "gaUst": 72,
        "yayin": false
      },
      "Akyazı": {
        "evet": 7,
        "n": 12,
        "bilinmiyor": 0,
        "oran": 58,
        "gaAlt": 32,
        "gaUst": 81,
        "yayin": false
      },
      "Sapanca": {
        "evet": 5,
        "n": 15,
        "bilinmiyor": 0,
        "oran": 33,
        "gaAlt": 15,
        "gaUst": 58,
        "yayin": false
      },
      "Karasu": {
        "evet": 2,
        "n": 8,
        "bilinmiyor": 0,
        "oran": 25,
        "gaAlt": 7,
        "gaUst": 59,
        "yayin": false
      }
    }
  },
  {
    "key": "calisan_site",
    "label": "Google profilinden çalışan, HTTPS'li ve mobil uyumlu siteye ulaşılan",
    "payda": "tüm işletmeler",
    "genel": {
      "evet": 111,
      "n": 462,
      "bilinmiyor": 2,
      "oran": 24,
      "gaAlt": 20,
      "gaUst": 28,
      "yayin": true
    },
    "sektor": {
      "yeme_icme": {
        "evet": 17,
        "n": 76,
        "bilinmiyor": 0,
        "oran": 22,
        "gaAlt": 14,
        "gaUst": 33,
        "yayin": true
      },
      "guzellik": {
        "evet": 7,
        "n": 79,
        "bilinmiyor": 0,
        "oran": 9,
        "gaAlt": 4,
        "gaUst": 17,
        "yayin": true
      },
      "mobilya": {
        "evet": 32,
        "n": 74,
        "bilinmiyor": 1,
        "oran": 43,
        "gaAlt": 33,
        "gaUst": 55,
        "yayin": true
      },
      "giyim": {
        "evet": 25,
        "n": 77,
        "bilinmiyor": 1,
        "oran": 32,
        "gaAlt": 23,
        "gaUst": 44,
        "yayin": true
      },
      "oto": {
        "evet": 13,
        "n": 79,
        "bilinmiyor": 0,
        "oran": 16,
        "gaAlt": 10,
        "gaUst": 26,
        "yayin": true
      },
      "emlak": {
        "evet": 17,
        "n": 77,
        "bilinmiyor": 0,
        "oran": 22,
        "gaAlt": 14,
        "gaUst": 33,
        "yayin": true
      }
    },
    "ilce": {
      "Adapazarı": {
        "evet": 22,
        "n": 59,
        "bilinmiyor": 0,
        "oran": 37,
        "gaAlt": 26,
        "gaUst": 50,
        "yayin": true
      },
      "Serdivan": {
        "evet": 21,
        "n": 61,
        "bilinmiyor": 0,
        "oran": 34,
        "gaAlt": 24,
        "gaUst": 47,
        "yayin": true
      },
      "Erenler": {
        "evet": 11,
        "n": 58,
        "bilinmiyor": 0,
        "oran": 19,
        "gaAlt": 11,
        "gaUst": 31,
        "yayin": true
      },
      "Arifiye": {
        "evet": 8,
        "n": 46,
        "bilinmiyor": 2,
        "oran": 17,
        "gaAlt": 9,
        "gaUst": 31,
        "yayin": true
      },
      "Hendek": {
        "evet": 16,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 27,
        "gaAlt": 17,
        "gaUst": 39,
        "yayin": true
      },
      "Akyazı": {
        "evet": 12,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 20,
        "gaAlt": 12,
        "gaUst": 32,
        "yayin": true
      },
      "Sapanca": {
        "evet": 14,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 23,
        "gaAlt": 14,
        "gaUst": 35,
        "yayin": true
      },
      "Karasu": {
        "evet": 7,
        "n": 58,
        "bilinmiyor": 0,
        "oran": 12,
        "gaAlt": 6,
        "gaUst": 23,
        "yayin": true
      }
    }
  },
  {
    "key": "sahiplenilmemis",
    "label": "Google profili sahiplenilmemiş görünen",
    "payda": "tüm işletmeler",
    "genel": {
      "evet": 61,
      "n": 464,
      "bilinmiyor": 0,
      "oran": 13,
      "gaAlt": 10,
      "gaUst": 17,
      "yayin": true
    },
    "sektor": {
      "yeme_icme": {
        "evet": 5,
        "n": 76,
        "bilinmiyor": 0,
        "oran": 7,
        "gaAlt": 3,
        "gaUst": 14,
        "yayin": true
      },
      "guzellik": {
        "evet": 13,
        "n": 79,
        "bilinmiyor": 0,
        "oran": 16,
        "gaAlt": 10,
        "gaUst": 26,
        "yayin": true
      },
      "mobilya": {
        "evet": 10,
        "n": 75,
        "bilinmiyor": 0,
        "oran": 13,
        "gaAlt": 7,
        "gaUst": 23,
        "yayin": true
      },
      "giyim": {
        "evet": 13,
        "n": 78,
        "bilinmiyor": 0,
        "oran": 17,
        "gaAlt": 10,
        "gaUst": 26,
        "yayin": true
      },
      "oto": {
        "evet": 7,
        "n": 79,
        "bilinmiyor": 0,
        "oran": 9,
        "gaAlt": 4,
        "gaUst": 17,
        "yayin": true
      },
      "emlak": {
        "evet": 13,
        "n": 77,
        "bilinmiyor": 0,
        "oran": 17,
        "gaAlt": 10,
        "gaUst": 27,
        "yayin": true
      }
    },
    "ilce": {
      "Adapazarı": {
        "evet": 7,
        "n": 59,
        "bilinmiyor": 0,
        "oran": 12,
        "gaAlt": 6,
        "gaUst": 23,
        "yayin": true
      },
      "Serdivan": {
        "evet": 5,
        "n": 61,
        "bilinmiyor": 0,
        "oran": 8,
        "gaAlt": 4,
        "gaUst": 18,
        "yayin": true
      },
      "Erenler": {
        "evet": 11,
        "n": 58,
        "bilinmiyor": 0,
        "oran": 19,
        "gaAlt": 11,
        "gaUst": 31,
        "yayin": true
      },
      "Arifiye": {
        "evet": 6,
        "n": 48,
        "bilinmiyor": 0,
        "oran": 12,
        "gaAlt": 6,
        "gaUst": 25,
        "yayin": true
      },
      "Hendek": {
        "evet": 10,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 17,
        "gaAlt": 9,
        "gaUst": 28,
        "yayin": true
      },
      "Akyazı": {
        "evet": 6,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 10,
        "gaAlt": 5,
        "gaUst": 20,
        "yayin": true
      },
      "Sapanca": {
        "evet": 8,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 13,
        "gaAlt": 7,
        "gaUst": 24,
        "yayin": true
      },
      "Karasu": {
        "evet": 8,
        "n": 58,
        "bilinmiyor": 0,
        "oran": 14,
        "gaAlt": 7,
        "gaUst": 25,
        "yayin": true
      }
    }
  },
  {
    "key": "instagram_bulundu",
    "label": "Google profilinden ya da sitesinden Instagram hesabına bağlantı veren",
    "payda": "tüm işletmeler",
    "genel": {
      "evet": 96,
      "n": 464,
      "bilinmiyor": 0,
      "oran": 21,
      "gaAlt": 17,
      "gaUst": 25,
      "yayin": true
    },
    "sektor": {
      "yeme_icme": {
        "evet": 18,
        "n": 76,
        "bilinmiyor": 0,
        "oran": 24,
        "gaAlt": 16,
        "gaUst": 34,
        "yayin": true
      },
      "guzellik": {
        "evet": 13,
        "n": 79,
        "bilinmiyor": 0,
        "oran": 16,
        "gaAlt": 10,
        "gaUst": 26,
        "yayin": true
      },
      "mobilya": {
        "evet": 24,
        "n": 75,
        "bilinmiyor": 0,
        "oran": 32,
        "gaAlt": 23,
        "gaUst": 43,
        "yayin": true
      },
      "giyim": {
        "evet": 25,
        "n": 78,
        "bilinmiyor": 0,
        "oran": 32,
        "gaAlt": 23,
        "gaUst": 43,
        "yayin": true
      },
      "oto": {
        "evet": 10,
        "n": 79,
        "bilinmiyor": 0,
        "oran": 13,
        "gaAlt": 7,
        "gaUst": 22,
        "yayin": true
      },
      "emlak": {
        "evet": 6,
        "n": 77,
        "bilinmiyor": 0,
        "oran": 8,
        "gaAlt": 4,
        "gaUst": 16,
        "yayin": true
      }
    },
    "ilce": {
      "Adapazarı": {
        "evet": 24,
        "n": 59,
        "bilinmiyor": 0,
        "oran": 41,
        "gaAlt": 29,
        "gaUst": 53,
        "yayin": true
      },
      "Serdivan": {
        "evet": 22,
        "n": 61,
        "bilinmiyor": 0,
        "oran": 36,
        "gaAlt": 25,
        "gaUst": 49,
        "yayin": true
      },
      "Erenler": {
        "evet": 7,
        "n": 58,
        "bilinmiyor": 0,
        "oran": 12,
        "gaAlt": 6,
        "gaUst": 23,
        "yayin": true
      },
      "Arifiye": {
        "evet": 5,
        "n": 48,
        "bilinmiyor": 0,
        "oran": 10,
        "gaAlt": 5,
        "gaUst": 22,
        "yayin": true
      },
      "Hendek": {
        "evet": 11,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 18,
        "gaAlt": 11,
        "gaUst": 30,
        "yayin": true
      },
      "Akyazı": {
        "evet": 8,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 13,
        "gaAlt": 7,
        "gaUst": 24,
        "yayin": true
      },
      "Sapanca": {
        "evet": 12,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 20,
        "gaAlt": 12,
        "gaUst": 32,
        "yayin": true
      },
      "Karasu": {
        "evet": 7,
        "n": 58,
        "bilinmiyor": 0,
        "oran": 12,
        "gaAlt": 6,
        "gaUst": 23,
        "yayin": true
      }
    }
  },
  {
    "key": "son30_gonderi",
    "label": "Son 30 günde Instagram'da paylaşım yapan",
    "payda": "bağlantılı Instagram hesabı olanlar",
    "genel": {
      "evet": 72,
      "n": 94,
      "bilinmiyor": 2,
      "oran": 77,
      "gaAlt": 67,
      "gaUst": 84,
      "yayin": true
    },
    "sektor": {
      "yeme_icme": {
        "evet": 11,
        "n": 18,
        "bilinmiyor": 0,
        "oran": 61,
        "gaAlt": 39,
        "gaUst": 80,
        "yayin": false
      },
      "guzellik": {
        "evet": 9,
        "n": 13,
        "bilinmiyor": 0,
        "oran": 69,
        "gaAlt": 42,
        "gaUst": 87,
        "yayin": false
      },
      "mobilya": {
        "evet": 21,
        "n": 23,
        "bilinmiyor": 1,
        "oran": 91,
        "gaAlt": 73,
        "gaUst": 98,
        "yayin": false
      },
      "giyim": {
        "evet": 21,
        "n": 24,
        "bilinmiyor": 1,
        "oran": 88,
        "gaAlt": 69,
        "gaUst": 96,
        "yayin": false
      },
      "oto": {
        "evet": 7,
        "n": 10,
        "bilinmiyor": 0,
        "oran": 70,
        "gaAlt": 40,
        "gaUst": 89,
        "yayin": false
      },
      "emlak": {
        "evet": 3,
        "n": 6,
        "bilinmiyor": 0,
        "oran": 50,
        "gaAlt": 19,
        "gaUst": 81,
        "yayin": false
      }
    },
    "ilce": {
      "Adapazarı": {
        "evet": 20,
        "n": 24,
        "bilinmiyor": 0,
        "oran": 83,
        "gaAlt": 64,
        "gaUst": 93,
        "yayin": false
      },
      "Serdivan": {
        "evet": 17,
        "n": 21,
        "bilinmiyor": 1,
        "oran": 81,
        "gaAlt": 60,
        "gaUst": 92,
        "yayin": false
      },
      "Erenler": {
        "evet": 4,
        "n": 7,
        "bilinmiyor": 0,
        "oran": 57,
        "gaAlt": 25,
        "gaUst": 84,
        "yayin": false
      },
      "Arifiye": {
        "evet": 4,
        "n": 5,
        "bilinmiyor": 0,
        "oran": 80,
        "gaAlt": 38,
        "gaUst": 96,
        "yayin": false
      },
      "Hendek": {
        "evet": 8,
        "n": 11,
        "bilinmiyor": 0,
        "oran": 73,
        "gaAlt": 43,
        "gaUst": 90,
        "yayin": false
      },
      "Akyazı": {
        "evet": 5,
        "n": 7,
        "bilinmiyor": 1,
        "oran": 71,
        "gaAlt": 36,
        "gaUst": 92,
        "yayin": false
      },
      "Sapanca": {
        "evet": 8,
        "n": 12,
        "bilinmiyor": 0,
        "oran": 67,
        "gaAlt": 39,
        "gaUst": 86,
        "yayin": false
      },
      "Karasu": {
        "evet": 6,
        "n": 7,
        "bilinmiyor": 0,
        "oran": 86,
        "gaAlt": 49,
        "gaUst": 97,
        "yayin": false
      }
    }
  },
  {
    "key": "son30_reels",
    "label": "Son 30 günde Reels paylaşan",
    "payda": "bağlantılı Instagram hesabı olanlar",
    "genel": {
      "evet": 68,
      "n": 94,
      "bilinmiyor": 2,
      "oran": 72,
      "gaAlt": 63,
      "gaUst": 80,
      "yayin": true
    },
    "sektor": {
      "yeme_icme": {
        "evet": 11,
        "n": 18,
        "bilinmiyor": 0,
        "oran": 61,
        "gaAlt": 39,
        "gaUst": 80,
        "yayin": false
      },
      "guzellik": {
        "evet": 9,
        "n": 13,
        "bilinmiyor": 0,
        "oran": 69,
        "gaAlt": 42,
        "gaUst": 87,
        "yayin": false
      },
      "mobilya": {
        "evet": 18,
        "n": 23,
        "bilinmiyor": 1,
        "oran": 78,
        "gaAlt": 58,
        "gaUst": 90,
        "yayin": false
      },
      "giyim": {
        "evet": 21,
        "n": 24,
        "bilinmiyor": 1,
        "oran": 88,
        "gaAlt": 69,
        "gaUst": 96,
        "yayin": false
      },
      "oto": {
        "evet": 6,
        "n": 10,
        "bilinmiyor": 0,
        "oran": 60,
        "gaAlt": 31,
        "gaUst": 83,
        "yayin": false
      },
      "emlak": {
        "evet": 3,
        "n": 6,
        "bilinmiyor": 0,
        "oran": 50,
        "gaAlt": 19,
        "gaUst": 81,
        "yayin": false
      }
    },
    "ilce": {
      "Adapazarı": {
        "evet": 19,
        "n": 24,
        "bilinmiyor": 0,
        "oran": 79,
        "gaAlt": 60,
        "gaUst": 91,
        "yayin": false
      },
      "Serdivan": {
        "evet": 17,
        "n": 21,
        "bilinmiyor": 1,
        "oran": 81,
        "gaAlt": 60,
        "gaUst": 92,
        "yayin": false
      },
      "Erenler": {
        "evet": 4,
        "n": 7,
        "bilinmiyor": 0,
        "oran": 57,
        "gaAlt": 25,
        "gaUst": 84,
        "yayin": false
      },
      "Arifiye": {
        "evet": 4,
        "n": 5,
        "bilinmiyor": 0,
        "oran": 80,
        "gaAlt": 38,
        "gaUst": 96,
        "yayin": false
      },
      "Hendek": {
        "evet": 6,
        "n": 11,
        "bilinmiyor": 0,
        "oran": 55,
        "gaAlt": 28,
        "gaUst": 79,
        "yayin": false
      },
      "Akyazı": {
        "evet": 5,
        "n": 7,
        "bilinmiyor": 1,
        "oran": 71,
        "gaAlt": 36,
        "gaUst": 92,
        "yayin": false
      },
      "Sapanca": {
        "evet": 7,
        "n": 12,
        "bilinmiyor": 0,
        "oran": 58,
        "gaAlt": 32,
        "gaUst": 81,
        "yayin": false
      },
      "Karasu": {
        "evet": 6,
        "n": 7,
        "bilinmiyor": 0,
        "oran": 86,
        "gaAlt": 49,
        "gaUst": 97,
        "yayin": false
      }
    }
  },
  {
    "key": "aktif_ig",
    "label": "Bağlantılı Instagram hesabında son 30 günde paylaşım yapan",
    "payda": "tüm işletmeler",
    "genel": {
      "evet": 72,
      "n": 462,
      "bilinmiyor": 2,
      "oran": 16,
      "gaAlt": 13,
      "gaUst": 19,
      "yayin": true
    },
    "sektor": {
      "yeme_icme": {
        "evet": 11,
        "n": 76,
        "bilinmiyor": 0,
        "oran": 14,
        "gaAlt": 8,
        "gaUst": 24,
        "yayin": true
      },
      "guzellik": {
        "evet": 9,
        "n": 79,
        "bilinmiyor": 0,
        "oran": 11,
        "gaAlt": 6,
        "gaUst": 20,
        "yayin": true
      },
      "mobilya": {
        "evet": 21,
        "n": 74,
        "bilinmiyor": 1,
        "oran": 28,
        "gaAlt": 19,
        "gaUst": 40,
        "yayin": true
      },
      "giyim": {
        "evet": 21,
        "n": 77,
        "bilinmiyor": 1,
        "oran": 27,
        "gaAlt": 19,
        "gaUst": 38,
        "yayin": true
      },
      "oto": {
        "evet": 7,
        "n": 79,
        "bilinmiyor": 0,
        "oran": 9,
        "gaAlt": 4,
        "gaUst": 17,
        "yayin": true
      },
      "emlak": {
        "evet": 3,
        "n": 77,
        "bilinmiyor": 0,
        "oran": 4,
        "gaAlt": 1,
        "gaUst": 11,
        "yayin": true
      }
    },
    "ilce": {
      "Adapazarı": {
        "evet": 20,
        "n": 59,
        "bilinmiyor": 0,
        "oran": 34,
        "gaAlt": 23,
        "gaUst": 47,
        "yayin": true
      },
      "Serdivan": {
        "evet": 17,
        "n": 60,
        "bilinmiyor": 1,
        "oran": 28,
        "gaAlt": 19,
        "gaUst": 41,
        "yayin": true
      },
      "Erenler": {
        "evet": 4,
        "n": 58,
        "bilinmiyor": 0,
        "oran": 7,
        "gaAlt": 3,
        "gaUst": 16,
        "yayin": true
      },
      "Arifiye": {
        "evet": 4,
        "n": 48,
        "bilinmiyor": 0,
        "oran": 8,
        "gaAlt": 3,
        "gaUst": 20,
        "yayin": true
      },
      "Hendek": {
        "evet": 8,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 13,
        "gaAlt": 7,
        "gaUst": 24,
        "yayin": true
      },
      "Akyazı": {
        "evet": 5,
        "n": 59,
        "bilinmiyor": 1,
        "oran": 8,
        "gaAlt": 4,
        "gaUst": 18,
        "yayin": true
      },
      "Sapanca": {
        "evet": 8,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 13,
        "gaAlt": 7,
        "gaUst": 24,
        "yayin": true
      },
      "Karasu": {
        "evet": 6,
        "n": 58,
        "bilinmiyor": 0,
        "oran": 10,
        "gaAlt": 5,
        "gaUst": 21,
        "yayin": true
      }
    }
  },
  {
    "key": "aktif_reels",
    "label": "Bağlantılı Instagram hesabında son 30 günde Reels paylaşan",
    "payda": "tüm işletmeler",
    "genel": {
      "evet": 68,
      "n": 462,
      "bilinmiyor": 2,
      "oran": 15,
      "gaAlt": 12,
      "gaUst": 18,
      "yayin": true
    },
    "sektor": {
      "yeme_icme": {
        "evet": 11,
        "n": 76,
        "bilinmiyor": 0,
        "oran": 14,
        "gaAlt": 8,
        "gaUst": 24,
        "yayin": true
      },
      "guzellik": {
        "evet": 9,
        "n": 79,
        "bilinmiyor": 0,
        "oran": 11,
        "gaAlt": 6,
        "gaUst": 20,
        "yayin": true
      },
      "mobilya": {
        "evet": 18,
        "n": 74,
        "bilinmiyor": 1,
        "oran": 24,
        "gaAlt": 16,
        "gaUst": 35,
        "yayin": true
      },
      "giyim": {
        "evet": 21,
        "n": 77,
        "bilinmiyor": 1,
        "oran": 27,
        "gaAlt": 19,
        "gaUst": 38,
        "yayin": true
      },
      "oto": {
        "evet": 6,
        "n": 79,
        "bilinmiyor": 0,
        "oran": 8,
        "gaAlt": 4,
        "gaUst": 16,
        "yayin": true
      },
      "emlak": {
        "evet": 3,
        "n": 77,
        "bilinmiyor": 0,
        "oran": 4,
        "gaAlt": 1,
        "gaUst": 11,
        "yayin": true
      }
    },
    "ilce": {
      "Adapazarı": {
        "evet": 19,
        "n": 59,
        "bilinmiyor": 0,
        "oran": 32,
        "gaAlt": 22,
        "gaUst": 45,
        "yayin": true
      },
      "Serdivan": {
        "evet": 17,
        "n": 60,
        "bilinmiyor": 1,
        "oran": 28,
        "gaAlt": 19,
        "gaUst": 41,
        "yayin": true
      },
      "Erenler": {
        "evet": 4,
        "n": 58,
        "bilinmiyor": 0,
        "oran": 7,
        "gaAlt": 3,
        "gaUst": 16,
        "yayin": true
      },
      "Arifiye": {
        "evet": 4,
        "n": 48,
        "bilinmiyor": 0,
        "oran": 8,
        "gaAlt": 3,
        "gaUst": 20,
        "yayin": true
      },
      "Hendek": {
        "evet": 6,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 10,
        "gaAlt": 5,
        "gaUst": 20,
        "yayin": true
      },
      "Akyazı": {
        "evet": 5,
        "n": 59,
        "bilinmiyor": 1,
        "oran": 8,
        "gaAlt": 4,
        "gaUst": 18,
        "yayin": true
      },
      "Sapanca": {
        "evet": 7,
        "n": 60,
        "bilinmiyor": 0,
        "oran": 12,
        "gaAlt": 6,
        "gaUst": 22,
        "yayin": true
      },
      "Karasu": {
        "evet": 6,
        "n": 58,
        "bilinmiyor": 0,
        "oran": 10,
        "gaAlt": 5,
        "gaUst": 21,
        "yayin": true
      }
    }
  }
];

export const RATINGS: { key: string; name: string; n: number; medianRating: number | null; medianReviews: number | null }[] = [
  {
    "key": "yeme_icme",
    "name": "Restoran",
    "n": 76,
    "medianRating": 4.4,
    "medianReviews": 678.0
  },
  {
    "key": "guzellik",
    "name": "Kuaför ve güzellik salonu",
    "n": 79,
    "medianRating": 4.8,
    "medianReviews": 45
  },
  {
    "key": "mobilya",
    "name": "Mobilya",
    "n": 68,
    "medianRating": 4.5,
    "medianReviews": 23.0
  },
  {
    "key": "giyim",
    "name": "Giyim / butik",
    "n": 76,
    "medianRating": 4.7,
    "medianReviews": 11.0
  },
  {
    "key": "oto",
    "name": "Oto servis",
    "n": 78,
    "medianRating": 4.9,
    "medianReviews": 32.5
  },
  {
    "key": "emlak",
    "name": "Emlak ofisi",
    "n": 72,
    "medianRating": 4.95,
    "medianReviews": 14.0
  },
  {
    "key": "_genel",
    "name": "Tümü",
    "n": 449,
    "medianRating": 4.7,
    "medianReviews": 35
  }
];

export const SAMPLE_META = {
  "ilceKaynak": {
    "adres": 456,
    "koordinat_osm_sinir": 8
  },
  "gbpLinkTuru": {
    "web": 151,
    "yok": 245,
    "sosyal": 33,
    "platform": 35
  },
  "igKaynak": {
    "web_sitesi": 75,
    "google_profili": 30
  },
  "igDurum": {
    "acik": 94,
    "yok": 9,
    "izgara_yok": 2
  }
};

export const METRIC = Object.fromEntries(METRICS.map((m) => [m.key, m])) as Record<string, Metric>;

/** Named index sentences: every number comes from METRICS above (generated together). */
export const INDEX_FINDINGS: string[] = [
  "2026 Rast Sakarya Dijital Görünürlük Endeksi, Google Haritalar’da görünen 464 Sakarya işletmesine (10 Kasım 2026) göre işletmelerin %33’ünün Google profilinde kendi web sitesine bağlantı olduğunu buldu (n=464).",
  "2026 Rast Sakarya Dijital Görünürlük Endeksi, Google Haritalar’da görünen 464 Sakarya işletmesine (10 Kasım 2026) göre işletmelerin yalnız %24’ünün Google profilinden açılan, HTTPS’li ve mobil uyumlu bir siteye ulaştırdığını buldu (n=462).",
  "2026 Rast Sakarya Dijital Görünürlük Endeksi, Google Haritalar’da görünen 464 Sakarya işletmesine (10 Kasım 2026) göre Google profilindeki web sitesi bağlantılarının %23’ünün açılmadığını buldu (n=149 site).",
  "2026 Rast Sakarya Dijital Görünürlük Endeksi, Google Haritalar’da görünen 464 Sakarya işletmesine (10 Kasım 2026) göre sitesi açılan işletmelerin %46’sının sitesinde WhatsApp bağlantısı olduğunu buldu (n=114).",
  "2026 Rast Sakarya Dijital Görünürlük Endeksi, Google Haritalar’da görünen 464 Sakarya işletmesine (10 Kasım 2026) göre işletmelerin %21’inin Google profilinden ya da sitesinden bir Instagram hesabına bağlantı verdiğini buldu (n=464).",
  "2026 Rast Sakarya Dijital Görünürlük Endeksi, Google Haritalar’da görünen 464 Sakarya işletmesine (10 Kasım 2026) göre bağlantılı Instagram hesabı okunabilen işletmelerin %77’sinin son 30 günde paylaşım, %72’sinin Reels yaptığını buldu (n=94).",
  "2026 Rast Sakarya Dijital Görünürlük Endeksi, Google Haritalar’da görünen 464 Sakarya işletmesine (10 Kasım 2026) göre Google profillerinin %13’ünün sahiplenilmemiş göründüğünü buldu (n=464).",
  "2026 Rast Sakarya Dijital Görünürlük Endeksi, Google Haritalar’da görünen 464 Sakarya işletmesine (10 Kasım 2026) göre çalışan, HTTPS’li ve mobil uyumlu siteye ulaşma oranının sektöre göre %9 (kuaför ve güzellik salonu) ile %43 (mobilya) arasında değiştiğini buldu."
];

/** FAQ answers and prose sentences that contain numbers (generated, suffixes fitted to the number). */
export const FAQS_DATA: { question: string; answer: string }[] = [
  {
    "question": "Sakarya’daki işletmelerin kaçının web sitesi var?",
    "answer": "2026 Rast Sakarya Dijital Görünürlük Endeksi kapsamında Google Haritalar’da görünen 464 Sakarya işletmesinin %33’ünün Google profilinde kendi alan adına giden bir web sitesi bağlantısı vardı (n=464). Bu bağlantıların %23’ü açılmadı (n=149). Çalışan, HTTPS’li ve mobil uyumlu bir siteye ulaştıran işletmelerin oranı %24 (n=462). Ölçüm 10 Kasım 2026 tarihinde yapıldı."
  },
  {
    "question": "Sakarya’da işletmeler Instagram’ı ne kadar aktif kullanıyor?",
    "answer": "İşletmelerin %21’i Google profilinden ya da web sitesinden bir Instagram hesabına bağlantı veriyordu (n=464). Bu hesaplardan herkese açık profili okunabilenlerin %77’si son 30 günde paylaşım, %72’si Reels yapmıştı (n=94). Bağlantı vermeyen işletmelerin de Instagram hesabı olabilir; bu yüzden gerçek Instagram kullanımı bağlantı oranından yüksektir."
  },
  {
    "question": "Sahiplenilmemiş Google İşletme Profili ne demek?",
    "answer": "Google Haritalar’da bir işletmenin profili, sahibi doğrulamadan da var olabilir; böyle profillerde “Bu işletmenin sahibi misiniz?” bağlantısı görünür. Sahibi doğrulanmamış profilde fotoğraf, çalışma saati, web sitesi ve yorum yanıtları işletmenin kontrolünde değildir. Örneklemimizde profillerin %13’ü sahiplenilmemiş görünüyordu (n=464)."
  },
  {
    "question": "Sakarya’da işletme sitelerinde WhatsApp butonu yaygın mı?",
    "answer": "Sitesi açılan işletmelerin %46’sı sitesinde WhatsApp’a geçiren bir bağlantı (wa.me, api.whatsapp.com ya da whatsapp://) vardı (n=114). Sitesi olmayan ya da açılmayan işletmelerde bu yol zaten yok."
  }
];
export const PROSE: Record<string, string> = {
  "wa": "Sitesi açılan işletmelerin yalnız %46’sı sitesinde bu bağlantı vardı.",
  "site": "Profilde bağlantısı olan sitelerin %23’ü açılmadı (n=149)."
};
