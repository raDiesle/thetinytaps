import type { Localized, Texts } from "@/lib/language";

// What Zähne putzen says before and after the brushing, in every language it has: plain data, so the list of
// recordings (src/content/recordedLines.ts) reads it without loading the game's drawings.

/**
 * Before the clock starts: where the monsters come from, get the brush, toothpaste on, then straight to the lion (X-26):
 * the lion seen beside the child and roaring with it, one phase (user requests, November 2026); only then the mirror,
 * the mouth already wide open, and the monsters seen on the teeth before the song begins.
 */
export type Prelude = "sweets" | "grow" | "brush" | "paste" | "lion" | "monsters";

/**
 * What each part before the clock is called (on the progress bar) and what the voice says in it; its timing and sounds
 * are added in TeethPlay.tsx. A part with no `cue` says nothing.
 */
export const PRELUDE_TEXTS: Record<Prelude, { title: Texts; cue?: Texts }> = {
  // An apple and a lollipop, the same at any time of day (user request, November 2026: before, the morning had
  // breakfast and the evening sweets).
  sweets: {
    title: {
      de: "🍎 Essen",
      en: "🍎 Eating",
      zh: "🍎 吃东西",
      hi: "🍎 कुछ खाना",
      es: "🍎 Comer",
      ar: "🍎 نأكل",
      ru: "🍎 Едим",
    },
    cue: {
      de: "Mmh, lecker! Ein bisschen Zucker bleibt an den Zähnen.",
      en: "Mmm, yummy! A little sugar stays on the teeth.",
      zh: "嗯，真好吃！一点点糖留在了牙齿上。",
      hi: "म्म, स्वादिष्ट! थोड़ी-सी चीनी दाँतों पर रह जाती है।",
      es: "¡Mmm, qué rico! Un poco de azúcar se queda en los dientes.",
      ar: "مممم، لذيذ! يبقى قليل من السكر على الأسنان.",
      ru: "Ммм, вкусно! Немного сахара остаётся на зубках.",
    },
  },
  // The same at any time of day (user request, November 2026: before, the night or the day went by).
  grow: {
    title: {
      de: "👾 Zuckermonster wachsen",
      en: "👾 Sugar monsters grow",
      zh: "👾 糖怪兽长大了",
      hi: "👾 चीनी-मॉन्स्टर बढ़ते हैं",
      es: "👾 Crecen los monstruos de azúcar",
      ar: "👾 وحوش السكر تكبر",
      ru: "👾 Растут сахарные монстры",
    },
    cue: {
      de: "Aus dem Zucker wachsen kleine Zuckermonster.",
      en: "The sugar grows into little sugar monsters.",
      zh: "糖慢慢长成了小小的糖怪兽。",
      hi: "इस चीनी से छोटे-छोटे चीनी-मॉन्स्टर बन जाते हैं।",
      es: "El azúcar se convierte en pequeños monstruos de azúcar.",
      ar: "من السكر تنمو وحوش سكر صغيرة.",
      ru: "Из сахара вырастают маленькие сахарные монстры.",
    },
  },
  brush: {
    title: {
      de: "🪥 Zahnbürste holen",
      en: "🪥 Get the toothbrush",
      zh: "🪥 拿牙刷",
      hi: "🪥 टूथब्रश लेना",
      es: "🪥 Tomar el cepillo",
      ar: "🪥 نُحضر الفرشاة",
      ru: "🪥 Берём щётку",
    },
    cue: {
      de: "Zuerst holen wir die Zahnbürste!",
      en: "First we get the toothbrush!",
      zh: "先拿牙刷！",
      hi: "पहले हम टूथब्रश लेते हैं!",
      es: "¡Primero tomamos el cepillo de dientes!",
      ar: "أولًا نُحضر فرشاة الأسنان!",
      ru: "Сначала берём зубную щётку!",
    },
  },
  paste: {
    title: {
      de: "🫧 Zahnpasta drauf",
      en: "🫧 Toothpaste on",
      zh: "🫧 挤牙膏",
      hi: "🫧 टूथपेस्ट लगाना",
      es: "🫧 Un poco de pasta",
      ar: "🫧 قليل من المعجون",
      ru: "🫧 Немного пасты",
    },
    cue: {
      de: "Jetzt ein kleiner Klecks Zahnpasta drauf.",
      en: "Now a little blob of toothpaste.",
      zh: "现在挤一点点牙膏。",
      hi: "अब थोड़ा-सा टूथपेस्ट।",
      es: "Ahora, un poquito de pasta de dientes.",
      ar: "والآن قليل من معجون الأسنان.",
      ru: "Теперь капельку зубной пасты.",
    },
  },
  monsters: {
    title: {
      de: "😱 Zuckermonster!",
      en: "😱 Sugar monsters!",
      zh: "😱 糖怪兽！",
      hi: "😱 चीनी-मॉन्स्टर!",
      es: "😱 ¡Monstruos de azúcar!",
      ar: "😱 وحوش السكر!",
      ru: "😱 Сахарные монстры!",
    },
    cue: {
      de: "Oh je, da sind sie! Komm, wir putzen sie alle weg!",
      en: "Oh no, there they are! Come on, let's brush them all away!",
      zh: "哎呀，它们在这儿！来，我们把它们都刷掉！",
      hi: "अरे, ये रहे! चलो, इन सबको ब्रश से भगाएँ!",
      es: "¡Ay, ahí están! ¡Ven, vamos a cepillarlos todos!",
      ar: "يا إلهي، ها هي! هيّا ننظّفها كلها!",
      ru: "Ой-ой, вот они! Давай прогоним их щёткой!",
    },
  },
  // The lion seen close, then the child beside it in a lion costume's mane, and roaring with it – one phase (X-26,
  // written English first; user requests, November 2026: the lion's and the roaring's phases became one). The voice
  // tells the child what comes; before each round a call of its own (`LION_CALLS`) says to roar (lion.tsx).
  lion: {
    title: {
      en: "🦁 Roar like a lion",
      de: "🦁 Brüllen wie ein Löwe",
      zh: "🦁 像狮子一样吼",
      hi: "🦁 शेर की तरह दहाड़ें",
      es: "🦁 Rugir como un león",
      ar: "🦁 نزأر مثل الأسد",
      ru: "🦁 Рычим, как лев",
    },
    cue: {
      en: "Before we brush, let's roar like a lion – three times!",
      de: "Bevor wir putzen, brüllen wir dreimal wie ein Löwe!",
      zh: "刷牙之前，我们像狮子一样吼三次！",
      hi: "ब्रश करने से पहले, चलो शेर की तरह तीन बार दहाड़ें!",
      es: "Antes de cepillarnos, ¡vamos a rugir como un león, tres veces!",
      ar: "قبل أن ننظّف أسناننا، هيّا نزأر مثل الأسد – ثلاث مرات!",
      ru: "Прежде чем чистить зубы, давай три раза зарычим, как лев!",
    },
  },
};

/**
 * What the voice calls before each round of roaring with the lion (lion.tsx's `ROUNDS`, said `CALL_BEATS` before the
 * roar), so the child knows when to roar (user request, November 2026: explained by the voice, never by marks on the
 * picture). Written English first.
 */
export const LION_CALLS: Texts[] = [
  {
    en: "Open wide – and roar!",
    de: "Mund weit auf – und brüllen!",
    zh: "嘴巴张大——吼！",
    hi: "चलो, मुँह पूरा खोलें – और दहाड़ें!",
    es: "¡Abre bien la boca… y ruge!",
    ar: "هيّا نفتح فمنا جيدًا – ونزأر!",
    ru: "Открой рот пошире – и рычи!",
  },
  {
    en: "Once more – even louder!",
    de: "Noch einmal – noch lauter!",
    zh: "再来一次——更大声！",
    hi: "एक बार और – और भी ज़ोर से!",
    es: "¡Otra vez, todavía más fuerte!",
    ar: "مرة أخرى – بصوت أعلى!",
    ru: "Ещё раз – ещё громче!",
  },
  {
    en: "And one last time – really loud!",
    de: "Und ein letztes Mal – ganz laut!",
    zh: "最后一次——超大声！",
    hi: "और आख़िरी बार – ख़ूब ज़ोर से!",
    es: "¡Y una última vez, muy fuerte!",
    ar: "ومرة أخيرة – بصوت عالٍ جدًا!",
    ru: "И последний раз – очень громко!",
  },
];

/** The name of spitting's phase on the bar (its tooltip), a phase of its own after the song (user request, November 2026). */
export const SPIT_TITLE: Texts = {
  en: "Spit out the foam",
  de: "Schaum ausspucken",
  zh: "把泡沫吐出来",
  hi: "झाग थूकना",
  es: "Escupir la espuma",
  ar: "بصق الرغوة",
  ru: "Выплёвываем пену",
};

/** Said at the end, before the daytime's goodbye (unless the sung finale sings it). */
export const DONE_SAY: Localized = {
  de: "Fertig! Alle Zuckermonster sind weg. Jetzt den Schaum ausspucken. Blitzeblank!",
  en: "Done! All the sugar monsters are gone. Now spit out the foam. Sparkling clean!",
  zh: "刷好啦！糖怪兽都没有了。现在把泡沫吐掉。亮晶晶！",
  hi: "हो गया! सारे चीनी-मॉन्स्टर चले गए। अब झाग थूक दो। चमचमाते दाँत!",
  es: "¡Listo! Ya no quedan monstruos de azúcar. Ahora escupe la espuma. ¡Relucientes!",
  ar: "انتهينا! لم تعد هناك وحوش سكر. والآن هيّا نبصق الرغوة. نظيفة لامعة!",
  ru: "Готово! Сахарных монстров больше нет. Теперь сплюнь пенку. Чисто-чисто!",
};

/** Said while the brush is rinsed and put away (unless the song sings). */
export const TIDY_SAY: Localized = {
  de: "Zahnbürste ausspülen und zurück in den Becher. Geschafft!",
  en: "Rinse the toothbrush and back into the cup. All done!",
  zh: "把牙刷冲干净，放回杯子里。完成啦！",
  hi: "टूथब्रश धोकर वापस गिलास में। हो गया!",
  es: "Enjuagamos el cepillo y de vuelta al vaso. ¡Listo!",
  ar: "نشطف الفرشاة ونعيدها إلى الكوب. انتهينا!",
  ru: "Споласкиваем щётку и ставим в стаканчик. Готово!",
};
