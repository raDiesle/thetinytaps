// The names and first lines of Kettenreaktion's levels in every language the
// game speaks. The lines said along the way sit next to their moment in the
// level's own file (`say: { de, ru }`), so timing and words stay together.

import type { Localized } from "@/lib/language";
import type { MarbleLevel } from "./settings";

/** The game's name, on its start screen and in the browser tab. */
export const GAME_TITLE: Localized = {
  de: "Kettenreaktion",
  en: "Chain Reaction",
  zh: "连锁反应",
  hi: "चेन रिएक्शन",
  es: "Reacción en cadena",
  ar: "تفاعل متسلسل",
  ru: "Цепная реакция",
};

/** Each level's name (mode card, „Weiter“ button, the picture's label) and the line said when it starts. */
export const LEVEL_TEXTS: Record<MarbleLevel, { name: Localized; intro: Localized }> = {
  track: {
    name: {
      de: "Klingende Kugelbahn",
      en: "Ringing Marble Run",
      zh: "叮当弹珠轨道",
      hi: "बजते कंचों का रास्ता",
      es: "Canicas musicales",
      ar: "مسار الكرات الرنّانة",
      ru: "Звонкие шарики",
    },
    intro: {
      de: "Tipp! Dann rollen die Kugeln.",
      en: "Tap! Then the marbles roll.",
      zh: "点一下！弹珠就滚起来啦。",
      hi: "छुओ! फिर कंचे लुढ़केंगे।",
      es: "¡Toca! Y las canicas ruedan.",
      ar: "لمسة! فتتدحرج الكرات.",
      ru: "Нажми — и шарики покатятся!",
    },
  },
  machine: {
    name: { de: "Große Maschine", en: "Big Machine", zh: "大机器", hi: "बड़ी मशीन", es: "La gran máquina", ar: "الآلة الكبيرة", ru: "Большая машина" },
    intro: {
      de: "Tipp! Dann läuft die große Maschine.",
      en: "Tap! Then the big machine starts.",
      zh: "点一下！大机器就动起来啦。",
      hi: "छुओ! फिर बड़ी मशीन चलेगी।",
      es: "¡Toca! Y la gran máquina se pone en marcha.",
      ar: "لمسة! فتعمل الآلة الكبيرة.",
      ru: "Нажми — и большая машина заработает!",
    },
  },
  sneeze: {
    name: { de: "Hatschi-Kette", en: "Achoo Chain", zh: "阿嚏连连", hi: "आछू की चेन", es: "Cadena de achís", ar: "سلسلة العطسات", ru: "Апчхи-цепочка" },
    intro: {
      de: "Tipp! Dann kitzelt die Feder die Maus.",
      en: "Tap! Then the feather tickles the mouse.",
      zh: "点一下！羽毛就去挠小老鼠。",
      hi: "छुओ! फिर पंख चूहे को गुदगुदाएगा।",
      es: "¡Toca! Y la pluma le hace cosquillas al ratón.",
      ar: "لمسة! فتدغدغ الريشة الفأر.",
      ru: "Нажми — и пёрышко пощекочет мышку!",
    },
  },
  kitchen: {
    name: { de: "Verrückte Küche", en: "Crazy Kitchen", zh: "疯狂厨房", hi: "मज़ेदार रसोई", es: "La cocina loca", ar: "المطبخ العجيب", ru: "Чудо-кухня" },
    intro: {
      de: "Tipp! Dann wird in der Küche gezaubert.",
      en: "Tap! Then the kitchen does magic.",
      zh: "点一下！厨房里就变起魔术来。",
      hi: "छुओ! फिर रसोई में जादू होगा।",
      es: "¡Toca! Y en la cocina empieza la magia.",
      ar: "لمسة! فيبدأ السحر في المطبخ.",
      ru: "Нажми — и на кухне начнётся волшебство!",
    },
  },
  garden: {
    name: { de: "Im Garten", en: "In the Garden", zh: "在花园里", hi: "बगीचे में", es: "En el jardín", ar: "في الحديقة", ru: "В саду" },
    intro: {
      de: "Tipp! Dann wacht der Garten auf.",
      en: "Tap! Then the garden wakes up.",
      zh: "点一下！花园就醒来啦。",
      hi: "छुओ! फिर बगीचा जाग जाएगा।",
      es: "¡Toca! Y el jardín se despierta.",
      ar: "لمسة! فتستيقظ الحديقة.",
      ru: "Нажми — и сад проснётся!",
    },
  },
  pegs: {
    name: { de: "Nagelbrett", en: "Peg Board", zh: "钉板", hi: "कीलों वाला बोर्ड", es: "Tablero de clavos", ar: "لوح المسامير", ru: "Доска с гвоздиками" },
    intro: {
      de: "Tipp oben hin! Dort fällt die Kugel los.",
      en: "Tap up top! The marble drops from there.",
      zh: "点上面！弹珠从那里掉下来。",
      hi: "ऊपर छुओ! वहाँ से कंचा गिरेगा।",
      es: "¡Toca arriba! De ahí cae la canica.",
      ar: "لمسة في الأعلى! من هناك تسقط الكرة.",
      ru: "Нажми наверху! Оттуда упадёт шарик.",
    },
  },
  topple: {
    name: { de: "Alles fällt um", en: "Everything Falls Over", zh: "全倒啦", hi: "सब गिर जाता है", es: "Todo se cae", ar: "كل شيء يسقط", ru: "Всё падает" },
    intro: {
      de: "Tipp an, dann fällt alles um!",
      en: "Give it a tap, and everything falls over!",
      zh: "推一下，全都倒啦！",
      hi: "धक्का दो, और सब गिर जाएगा!",
      es: "¡Dale un toque y todo se cae!",
      ar: "دفعة صغيرة، فيسقط كل شيء!",
      ru: "Толкни — и всё упадёт!",
    },
  },
  building: {
    name: { de: "Baustelle", en: "Building Site", zh: "建筑工地", hi: "निर्माण स्थल", es: "La obra", ar: "موقع البناء", ru: "Стройка" },
    intro: {
      de: "Tipp! Dann geht es los auf der Baustelle.",
      en: "Tap! Then the building site gets going.",
      zh: "点一下！工地就开工啦。",
      hi: "छुओ! फिर निर्माण शुरू होगा।",
      es: "¡Toca! Y empieza el trabajo en la obra.",
      ar: "لمسة! فيبدأ العمل في موقع البناء.",
      ru: "Нажми — и на стройке закипит работа!",
    },
  },
  water: {
    name: { de: "Wasserbahn", en: "Water Run", zh: "水道", hi: "पानी का रास्ता", es: "El canal de agua", ar: "مجرى الماء", ru: "Водная горка" },
    intro: {
      de: "Tipp auf das Tor! Dann schwimmt die Ente weiter.",
      en: "Tap the gate! Then the duck swims on.",
      zh: "点闸门！小鸭子就接着往前游。",
      hi: "फाटक को छुओ! फिर बत्तख आगे तैरेगी।",
      es: "¡Toca la compuerta! Y el pato sigue nadando.",
      ar: "لمسة على البوابة! فتسبح البطة إلى الأمام.",
      ru: "Нажми на ворота — и уточка поплывёт дальше!",
    },
  },
  circus: {
    name: { de: "Zirkus", en: "Circus", zh: "马戏团", hi: "सर्कस", es: "El circo", ar: "السيرك", ru: "Цирк" },
    intro: {
      de: "Tipp! Manege frei!",
      en: "Tap! On with the show!",
      zh: "点一下！表演开始啦！",
      hi: "छुओ! शो शुरू!",
      es: "¡Toca! ¡Que empiece la función!",
      ar: "لمسة! يبدأ العرض!",
      ru: "Нажми! Представление начинается!",
    },
  },
  space: {
    name: { de: "Raketenstart", en: "Rocket Launch", zh: "火箭发射", hi: "रॉकेट उड़ान", es: "Despegue del cohete", ar: "إطلاق الصاروخ", ru: "Запуск ракеты" },
    intro: {
      de: "Tipp! Dann startet die Rakete.",
      en: "Tap! Then the rocket takes off.",
      zh: "点一下！火箭就起飞啦。",
      hi: "छुओ! फिर रॉकेट उड़ेगा।",
      es: "¡Toca! Y el cohete despega.",
      ar: "لمسة! فينطلق الصاروخ.",
      ru: "Нажми — и ракета взлетит!",
    },
  },
  light: {
    name: { de: "Licht-Kette", en: "Light Chain", zh: "灯光连锁", hi: "रोशनी की चेन", es: "Cadena de luz", ar: "سلسلة الضوء", ru: "Световая цепочка" },
    intro: {
      de: "Tipp! Dann geht das Licht an.",
      en: "Tap! Then the light comes on.",
      zh: "点一下！灯就亮啦。",
      hi: "छुओ! फिर रोशनी जलेगी।",
      es: "¡Toca! Y se enciende la luz.",
      ar: "لمسة! فيُضاء النور.",
      ru: "Нажми — и зажжётся свет!",
    },
  },
  bath: {
    name: { de: "Badezimmer" },
    intro: { de: "Tipp auf den Knopf! Dann geht es ins Bad." },
  },
  farm: {
    name: { de: "Bauernhof" },
    intro: { de: "Tipp! Dann kräht der Hahn." },
  },
};
