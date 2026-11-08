import type { TargetLanguageId } from "@/content/targetLanguages";
import { type Localized, pick } from "@/lib/language";
import { recordedVoice } from "@/lib/voice";
import type { TimerPicture, TurnPicture } from "./settings";
import type { Holder } from "./swap";
import voiceFiles from "./stimme/**/*.mp3?glob";

// What the Timer says (H-72, November 2026): where a picture goes as it starts, „Gleich ist es so weit!“ with the bell a
// while before the end (H-49), and what is there at the end; Abwechseln and Tennis say who begins and whose turn it is.
// In the app language, from the recordings in ./stimme/ (`bun run voice make --only timer`): a line not recorded in the
// app language plays its English recording, else nothing – never the browser's voice.

/** The Timer's voice: its recordings in ./stimme/ and the language folders below it. */
export const timerVoice = recordedVoice(voiceFiles);

/** Says `line` in the app language (its English recording standing in where that language has none); `queue` waits for the line before. */
export const timerSay = (line: Localized, language: TargetLanguageId, queue = false) =>
  timerVoice.say(pick(line, language), language, { queue, english: line.en });

/** Starts loading the recordings of `lines` in the app language, so each plays right when it is due. */
export const timerLoad = (lines: Localized[], language: TargetLanguageId) =>
  timerVoice.load(
    lines.map((line) => pick(line, language)),
    language,
  );

/** A picture that runs until the time is up. */
export type TimedPicture = Exclude<TimerPicture, TurnPicture>;

/** Each picture's two lines: where it goes, said as it starts, and what is there at the end. */
export const PICTURE_LINES: Record<TimedPicture, { start: Localized; end: Localized }> = {
  disc: {
    start: {
      de: "Die rote Scheibe wird kleiner.",
      en: "The red disc gets smaller.",
      zh: "红色的圆盘在变小。",
      hi: "लाल गोला छोटा हो रहा है।",
      es: "El disco rojo se hace más pequeño.",
      ar: "القرص الأحمر يصغر.",
      ru: "Красный круг становится меньше.",
    },
    end: {
      de: "Die Scheibe ist weg!",
      en: "The disc is gone!",
      zh: "圆盘不见了！",
      hi: "गोला गायब हो गया!",
      es: "¡El disco ya no está!",
      ar: "اختفى القرص!",
      ru: "Круга больше нет!",
    },
  },
  sand: {
    start: {
      de: "Der Sand rieselt.",
      en: "The sand trickles down.",
      zh: "沙子在往下流。",
      hi: "रेत नीचे गिर रही है।",
      es: "La arena cae.",
      ar: "الرمل ينساب.",
      ru: "Песок сыплется.",
    },
    end: {
      de: "Der Sand ist durch!",
      en: "All the sand is through!",
      zh: "沙子漏完了！",
      hi: "सारी रेत नीचे आ गई!",
      es: "¡Ya pasó toda la arena!",
      ar: "نزل كل الرمل!",
      ru: "Весь песок пересыпался!",
    },
  },
  candle: {
    start: {
      de: "Die Kerzen brennen.",
      en: "The candles are burning.",
      zh: "蜡烛在燃烧。",
      hi: "मोमबत्तियाँ जल रही हैं।",
      es: "Las velas arden.",
      ar: "الشموع مشتعلة.",
      ru: "Свечи горят.",
    },
    end: {
      de: "Alle Kerzen sind aus!",
      en: "All the candles are out!",
      zh: "蜡烛都灭了！",
      hi: "सारी मोमबत्तियाँ बुझ गईं!",
      es: "¡Todas las velas están apagadas!",
      ar: "انطفأت كل الشموع!",
      ru: "Все свечи погасли!",
    },
  },
  apple: {
    start: {
      de: "Der Apfelbaum wächst.",
      en: "The apple tree is growing.",
      zh: "苹果树在长大。",
      hi: "सेब का पेड़ बड़ा हो रहा है।",
      es: "El manzano crece.",
      ar: "شجرة التفاح تكبر.",
      ru: "Яблоня растёт.",
    },
    end: {
      de: "Alle Äpfel sind im Wagen!",
      en: "All the apples are in the cart!",
      zh: "苹果都在小车里了！",
      hi: "सारे सेब गाड़ी में हैं!",
      es: "¡Todas las manzanas están en el carrito!",
      ar: "كل التفاح في العربة!",
      ru: "Все яблоки в тележке!",
    },
  },
  flower: {
    start: {
      de: "Die Blume bekommt Wasser.",
      en: "The flower gets water.",
      zh: "花儿在喝水。",
      hi: "फूल को पानी मिल रहा है।",
      es: "La flor recibe agua.",
      ar: "الزهرة تشرب الماء.",
      ru: "Цветок пьёт водичку.",
    },
    end: {
      de: "Die Blume blüht!",
      en: "The flower is blooming!",
      zh: "花开了！",
      hi: "फूल खिल गया!",
      es: "¡La flor florece!",
      ar: "الزهرة تتفتح!",
      ru: "Цветок цветёт!",
    },
  },
  pizza: {
    start: {
      de: "Wir essen die Pizza.",
      en: "We are eating the pizza.",
      zh: "我们在吃披萨。",
      hi: "चलो, पिज़्ज़ा खाते हैं।",
      es: "Comemos la pizza.",
      ar: "هيّا نأكل البيتزا.",
      ru: "Мы едим пиццу.",
    },
    end: {
      de: "Die Pizza ist aufgegessen!",
      en: "The pizza is all eaten up!",
      zh: "披萨吃完了！",
      hi: "पिज़्ज़ा ख़त्म हो गया!",
      es: "¡Ya no queda pizza!",
      ar: "انتهت البيتزا!",
      ru: "Пицца съедена!",
    },
  },
  clock: {
    start: {
      de: "Der Wecker zählt.",
      en: "The alarm clock is counting.",
      zh: "闹钟在数时间。",
      hi: "अलार्म घड़ी गिन रही है।",
      es: "El despertador cuenta.",
      ar: "المنبه يعدّ.",
      ru: "Будильник считает.",
    },
    end: {
      de: "Der Wecker klingelt!",
      en: "The alarm clock is ringing!",
      zh: "闹钟响了！",
      hi: "अलार्म घड़ी बज रही है!",
      es: "¡Suena el despertador!",
      ar: "المنبه يرن!",
      ru: "Будильник звенит!",
    },
  },
  train: {
    start: {
      de: "Der Zug fährt zum Bahnhof.",
      en: "The train goes to the station.",
      zh: "火车开往车站。",
      hi: "रेलगाड़ी स्टेशन जा रही है।",
      es: "El tren va a la estación.",
      ar: "القطار يذهب إلى المحطة.",
      ru: "Поезд едет на станцию.",
    },
    end: {
      de: "Der Zug ist am Bahnhof!",
      en: "The train is at the station!",
      zh: "火车到站了！",
      hi: "रेलगाड़ी स्टेशन पहुँच गई!",
      es: "¡El tren está en la estación!",
      ar: "القطار في المحطة!",
      ru: "Поезд на станции!",
    },
  },
  caterpillar: {
    start: {
      de: "Die Raupe frisst das Blatt.",
      en: "The caterpillar eats the leaf.",
      zh: "毛毛虫在吃叶子。",
      hi: "इल्ली पत्ता खा रही है।",
      es: "La oruga se come la hoja.",
      ar: "اليرقة تأكل الورقة.",
      ru: "Гусеница ест листок.",
    },
    end: {
      de: "Das Blatt ist weg. Ein Schmetterling!",
      en: "The leaf is gone. A butterfly!",
      zh: "叶子没了。一只蝴蝶！",
      hi: "पत्ता ख़त्म। एक तितली!",
      es: "La hoja ya no está. ¡Una mariposa!",
      ar: "الورقة اختفت. فراشة!",
      ru: "Листка больше нет. Бабочка!",
    },
  },
  sunset: {
    start: {
      de: "Der Mond geht schlafen.",
      en: "The moon goes to sleep.",
      zh: "月亮要去睡觉了。",
      hi: "चाँद सोने जा रहा है।",
      es: "La luna se va a dormir.",
      ar: "القمر يذهب لينام.",
      ru: "Луна идёт спать.",
    },
    end: {
      de: "Die Sonne ist da!",
      en: "The sun is here!",
      zh: "太阳出来了！",
      hi: "सूरज आ गया!",
      es: "¡Aquí está el sol!",
      ar: "أشرقت الشمس!",
      ru: "Вот и солнышко!",
    },
  },
};

/** Said with the bell a while before the end (H-49). */
export const SOON_LINE: Localized = {
  de: "Gleich ist es so weit!",
  en: "It's nearly time!",
  zh: "时间快到了！",
  hi: "बस, थोड़ी ही देर और!",
  es: "¡Ya casi es la hora!",
  ar: "اقترب الوقت!",
  ru: "Уже совсем скоро!",
};

/** Abwechseln and Tennis: said as the lamps start to draw who begins. */
export const WHO_BEGINS: Localized = {
  de: "Wer fängt an?",
  en: "Who goes first?",
  zh: "谁先来？",
  hi: "पहले किसकी बारी है?",
  es: "¿Quién empieza?",
  ar: "من يبدأ؟",
  ru: "Кто начинает?",
};

/** Said as the lamps have drawn the first child. */
export const BEGINS: Record<Holder, Localized> = {
  fox: {
    de: "Das Fuchskind fängt an!",
    en: "The little fox goes first!",
    zh: "小狐狸先来！",
    hi: "पहले लोमड़ी के बच्चे की बारी!",
    es: "¡Empieza el zorrito!",
    ar: "يبدأ الثعلب الصغير!",
    ru: "Начинает лисёнок!",
  },
  bear: {
    de: "Das Bärenkind fängt an!",
    en: "The little bear goes first!",
    zh: "小熊先来！",
    hi: "पहले भालू के बच्चे की बारी!",
    es: "¡Empieza el osito!",
    ar: "يبدأ الدب الصغير!",
    ru: "Начинает медвежонок!",
  },
};

/** Said at every change of turn, and when a grown-up gives the turn to a child behind ⚙️. */
export const TURN_TO: Record<Holder, Localized> = {
  fox: {
    de: "Tauschen! Jetzt ist das Fuchskind dran.",
    en: "Swap! Now it's the little fox's turn.",
    zh: "换人！现在轮到小狐狸了。",
    hi: "अदला-बदली! अब लोमड़ी के बच्चे की बारी है।",
    es: "¡Cambio! Ahora le toca al zorrito.",
    ar: "تبديل! الآن دور الثعلب الصغير.",
    ru: "Меняемся! Теперь очередь лисёнка.",
  },
  bear: {
    de: "Tauschen! Jetzt ist das Bärenkind dran.",
    en: "Swap! Now it's the little bear's turn.",
    zh: "换人！现在轮到小熊了。",
    hi: "अदला-बदली! अब भालू के बच्चे की बारी है।",
    es: "¡Cambio! Ahora le toca al osito.",
    ar: "تبديل! الآن دور الدب الصغير.",
    ru: "Меняемся! Теперь очередь медвежонка.",
  },
};

/** Every line Abwechseln and Tennis can say, in the order they come. */
export const TURN_LINES: Localized[] = [WHO_BEGINS, ...Object.values(BEGINS), ...Object.values(TURN_TO)];

/**
 * Every line the Timer can say in `language`, each once: the pictures' start and end lines, the bell's, and Abwechseln's
 * and Tennis's. A language without a translation of a line gets its German text, as `pick` gives it.
 */
export function timerSaid(language: TargetLanguageId): string[] {
  const pictures = Object.values(PICTURE_LINES);
  const lines = [...pictures.map((p) => p.start), SOON_LINE, ...pictures.map((p) => p.end), ...TURN_LINES];
  return [...new Set(lines.map((line) => pick(line, language)))];
}
