import type { Daytime } from "@/lib/days";
import type { EnglishFirst, Localized, Texts } from "@/lib/language";

// What Zähne putzen says before and after the brushing, in every language it has: plain data, so the list of
// recordings (src/content/recordedLines.ts) reads it without loading the game's drawings.

/**
 * Before the clock starts: where the monsters come from, get the brush, toothpaste on, then straight to the lion (X-26):
 * the lion seen beside the child, then roaring with it, a phase of its own (user requests, November 2026); only then the
 * mirror, the mouth already wide open, and the monsters seen on the teeth before the song begins.
 */
export type Prelude = "sweets" | "grow" | "brush" | "paste" | "lion" | "roar" | "monsters";

/**
 * What each part before the clock is called (on the progress bar) and what the voice says in it; its timing and sounds
 * are added in TeethPlay.tsx. A part with no `cue` says nothing.
 */
export const PRELUDE_TEXTS: Record<Prelude, { title: Texts; cue?: Texts }> = {
  sweets: {
    title: {
      de: "🍭 Süßes essen",
      en: "🍭 Eating sweets",
      zh: "🍭 吃甜食",
      hi: "🍭 मीठा खाना",
      es: "🍭 Comer dulces",
      ar: "🍭 نأكل الحلوى",
      ru: "🍭 Едим сладкое",
    },
    cue: {
      de: "Mmh, Süßes! Ein bisschen Zucker bleibt an den Zähnen.",
      en: "Mmm, sweets! A little sugar stays on the teeth.",
      zh: "嗯，好甜！一点点糖留在了牙齿上。",
      hi: "म्म, मीठा! थोड़ी-सी चीनी दाँतों पर रह जाती है।",
      es: "¡Mmm, dulces! Un poco de azúcar se queda en los dientes.",
      ar: "مممم، حلوى! يبقى قليل من السكر على الأسنان.",
      ru: "Ммм, сладкое! Немного сахара остаётся на зубках.",
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
  // The lion seen close, then the child beside it in a lion costume's mane (X-26, written English first): no voice, the
  // picture tells it.
  lion: {
    title: {
      en: "🦁 Here comes the lion",
      de: "🦁 Da kommt der Löwe",
      zh: "🦁 狮子来了",
      hi: "🦁 शेर आ गया",
      es: "🦁 Llega el león",
      ar: "🦁 جاء الأسد",
      ru: "🦁 Вот и лев",
    },
  },
  // Roaring with the lion, a phase of its own (user request, November 2026): the voice asks the child to roar along,
  // then three marks fill one after the other and both roar each time one is full (lion.tsx).
  roar: {
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
      en: "Now roar with the lion! Really loud – three times!",
      de: "Jetzt brüllst du mit dem Löwen! Ganz laut – dreimal!",
      zh: "现在和狮子一起吼！大声吼——吼三次！",
      hi: "चलो, शेर के साथ दहाड़ें! ज़ोर से – तीन बार!",
      es: "¡Ahora ruge con el león! ¡Bien fuerte, tres veces!",
      ar: "هيّا نزأر مع الأسد! بصوت عالٍ – ثلاث مرات!",
      ru: "Теперь рычи вместе со львом! Громко – три раза!",
    },
  },
};

/**
 * The story's first part before the morning brushing, where the child eats breakfast instead of sweets (X-19, written
 * English first): its name on the bar and what the voice says.
 */
export const BREAKFAST_TEXTS: { title: EnglishFirst; cue: EnglishFirst } = {
  title: {
    en: "🥣 Eating breakfast",
    de: "🥣 Frühstück essen",
    zh: "🥣 吃早饭",
    hi: "🥣 नाश्ता करना",
    es: "🥣 Desayunar",
    ar: "🥣 نتناول الفطور",
    ru: "🥣 Завтракаем",
  },
  cue: {
    en: "Mmm, breakfast! A little sugar stays on the teeth too.",
    de: "Mmh, Frühstück! Auch davon bleibt ein bisschen Zucker an den Zähnen.",
    zh: "嗯，早饭真好吃！也有一点点糖留在了牙齿上。",
    hi: "म्म, नाश्ता! इससे भी थोड़ी-सी चीनी दाँतों पर रह जाती है।",
    es: "¡Mmm, el desayuno! También se queda un poco de azúcar en los dientes.",
    ar: "مممم، الفطور! يبقى منه أيضًا قليل من السكر على الأسنان.",
    ru: "Ммм, завтрак! И от него немного сахара остаётся на зубках.",
  },
};

/** What a part before the clock is called and says at this time of day: in the morning the story eats breakfast. */
export const preludeTexts = (part: Prelude, daytime: Daytime): { title: Texts; cue?: Texts } =>
  part === "sweets" && daytime === "morning" ? BREAKFAST_TEXTS : PRELUDE_TEXTS[part];

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
