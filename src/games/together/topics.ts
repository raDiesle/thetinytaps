import type { Localized } from "@/lib/language";
import type { RoundKind } from "./levels";

// The topics the pairs are sorted into, so grown-ups may one day pick what comes up („Berufe“, „Zu Hause“,
// „Unterwegs“). Each topic belongs to one kind of round: things of the day go together, helpers need their tools.
// The wrong choices of a round come from other topics first (`dealRound`), so things of one topic may belong loosely
// together (soap and sponge in the bathroom); a partner that also fits another pair is named in `alsoFits`.

/** A topic's id, the key of its file in `scenes/`. */
export type TopicId = "bad" | "kueche" | "zuhause" | "kleidung" | "kita" | "spielen" | "garten" | "wetter" | "unterwegs" | "feste" | HelperTopicId;

/** The topics of the helpers, by where they work: one each, so the wrong choices come from other places. */
type HelperTopicId = "berufe" | "bauen" | "verkehr" | "gesundheit" | "rettung" | "laden" | "hof" | "musik" | "sport" | "fantasie";

/** One topic: its kind of round and its name for grown-ups. */
export interface Topic {
  kind: RoundKind;
  /** Its name, for grown-ups (a choice behind ⚙️ one day). */
  name: Localized;
}

export const TOPICS: Record<TopicId, Topic> = {
  bad: { kind: "pair", name: { de: "Im Bad", ru: "В ванной", en: "In the bathroom", zh: "在浴室", hi: "बाथरूम में", es: "En el baño", ar: "في الحمّام" } },
  kueche: {
    kind: "pair",
    name: { de: "Küche & Essen", ru: "Кухня и еда", en: "Kitchen & food", zh: "厨房和食物", hi: "रसोई और खाना", es: "Cocina y comida", ar: "المطبخ والطعام" },
  },
  zuhause: { kind: "pair", name: { de: "Zu Hause", ru: "Дома", en: "At home", zh: "在家里", hi: "घर पर", es: "En casa", ar: "في البيت" } },
  kleidung: {
    kind: "pair",
    name: { de: "Anziehen", ru: "Одеваемся", en: "Getting dressed", zh: "穿衣服", hi: "कपड़े पहनना", es: "Vestirse", ar: "ارتداء الملابس" },
  },
  kita: {
    kind: "pair",
    name: {
      de: "Kita & Schule",
      ru: "Детский сад и школа",
      en: "Daycare & school",
      zh: "幼儿园和学校",
      hi: "नर्सरी और स्कूल",
      es: "Guardería y colegio",
      ar: "الحضانة والمدرسة",
    },
  },
  spielen: {
    kind: "pair",
    name: {
      de: "Spielen, Malen & Musik",
      ru: "Игры, рисование и музыка",
      en: "Play, drawing & music",
      zh: "玩耍、画画和音乐",
      hi: "खेल, चित्रकारी और संगीत",
      es: "Jugar, pintar y música",
      ar: "اللعب والرسم والموسيقى",
    },
  },
  garten: {
    kind: "pair",
    name: {
      de: "Garten & Natur",
      ru: "Сад и природа",
      en: "Garden & nature",
      zh: "花园和大自然",
      hi: "बगीचा और प्रकृति",
      es: "Jardín y naturaleza",
      ar: "الحديقة والطبيعة",
    },
  },
  wetter: {
    kind: "pair",
    name: {
      de: "Wetter & Jahreszeiten",
      ru: "Погода и времена года",
      en: "Weather & seasons",
      zh: "天气和四季",
      hi: "मौसम और ऋतुएँ",
      es: "Tiempo y estaciones",
      ar: "الطقس والفصول",
    },
  },
  unterwegs: { kind: "pair", name: { de: "Unterwegs", ru: "В дороге", en: "On the go", zh: "在路上", hi: "सफ़र में", es: "De camino", ar: "في الطريق" } },
  feste: {
    kind: "pair",
    name: {
      de: "Feste & Feiern",
      ru: "Праздники",
      en: "Parties & celebrations",
      zh: "节日和庆祝",
      hi: "त्योहार और जश्न",
      es: "Fiestas y celebraciones",
      ar: "الأعياد والاحتفالات",
    },
  },
  berufe: { kind: "helper", name: { de: "Berufe", ru: "Профессии", en: "Jobs", zh: "职业", hi: "पेशे", es: "Oficios", ar: "المهن" } },
  bauen: {
    kind: "helper",
    name: {
      de: "Bauen & Reparieren",
      ru: "Строить и чинить",
      en: "Building & repairing",
      zh: "建造和修理",
      hi: "बनाना और मरम्मत",
      es: "Construir y reparar",
      ar: "البناء والتصليح",
    },
  },
  verkehr: { kind: "helper", name: { de: "Fahrzeuge", ru: "Транспорт", en: "Vehicles", zh: "交通工具", hi: "गाड़ियाँ", es: "Vehículos", ar: "المركبات" } },
  gesundheit: {
    kind: "helper",
    name: {
      de: "Arzt & Krankenhaus",
      ru: "Врач и больница",
      en: "Doctor & hospital",
      zh: "医生和医院",
      hi: "डॉक्टर और अस्पताल",
      es: "Médico y hospital",
      ar: "الطبيب والمستشفى",
    },
  },
  rettung: {
    kind: "helper",
    name: {
      de: "Feuerwehr, Polizei & Rettung",
      ru: "Пожарные, полиция и спасатели",
      en: "Fire brigade, police & rescue",
      zh: "消防、警察和救援",
      hi: "दमकल, पुलिस और बचाव",
      es: "Bomberos, policía y rescate",
      ar: "الإطفاء والشرطة والإنقاذ",
    },
  },
  laden: {
    kind: "helper",
    name: {
      de: "Laden, Café & Küche",
      ru: "Магазин, кафе и кухня",
      en: "Shop, café & kitchen",
      zh: "商店、咖啡馆和厨房",
      hi: "दुकान, कैफ़े और रसोई",
      es: "Tienda, café y cocina",
      ar: "المتجر والمقهى والمطبخ",
    },
  },
  hof: {
    kind: "helper",
    name: {
      de: "Bauernhof & Wald",
      ru: "Ферма и лес",
      en: "Farm & forest",
      zh: "农场和森林",
      hi: "खेत-खलिहान और जंगल",
      es: "Granja y bosque",
      ar: "المزرعة والغابة",
    },
  },
  musik: {
    kind: "helper",
    name: {
      de: "Musik & Bühne",
      ru: "Музыка и сцена",
      en: "Music & stage",
      zh: "音乐和舞台",
      hi: "संगीत और मंच",
      es: "Música y escenario",
      ar: "الموسيقى والمسرح",
    },
  },
  sport: { kind: "helper", name: { de: "Sport", ru: "Спорт", en: "Sports", zh: "运动", hi: "खेल-कूद", es: "Deporte", ar: "الرياضة" } },
  fantasie: {
    kind: "helper",
    name: {
      de: "Märchen & Abenteuer",
      ru: "Сказки и приключения",
      en: "Fairy tales & adventures",
      zh: "童话和冒险",
      hi: "परीकथाएँ और रोमांच",
      es: "Cuentos y aventuras",
      ar: "الحكايات والمغامرات",
    },
  },
};
