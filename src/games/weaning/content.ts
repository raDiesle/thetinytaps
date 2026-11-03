import type { Localized } from "@/lib/language";

/** One page of the story, in the order it is told. */
export type StepId = "baby" | "grow" | "eat" | "cup" | "tell" | "goodbye" | "evening" | "sad" | "cuddle" | "book" | "bed" | "sleep" | "morning";

/** The light outside the window: the day's first half of the story, the evening and night, then the next morning. */
export type Sky = "day" | "night" | "morning";

/** One step of the story: what is drawn (`scene.tsx` by its id), what is said, and how long its moving part lasts. */
export interface Step {
  id: StepId;
  /** The sentence for this page: read out (its recording) and printed small under the picture for the grown-up reading along. */
  line: Localized;
  sky: Sky;
  /** How long its little animation and sounds run, ms; a tap sooner than `TAP_GUARD_MS` only sparkles. */
  ms: number;
}

/**
 * The story of „Abstillen“ (H-44): Tapsi was a baby and drank Mama's milk; now Tapsi is big, eats, drinks from a cup,
 * and says goodbye to Mama's milk. In the evening Tapsi wants it and is sad that it is gone – Mama is close, cuddles,
 * reads, sings – Tapsi falls asleep, and in the morning everybody is proud. Present tense, short, the way a grown-up
 * tells it to a child; nothing is wrong and nobody scolds.
 */
export const STEPS: Step[] = [
  {
    id: "baby",
    sky: "day",
    ms: 2400,
    line: {
      de: "Tapsi ist ein kleines Baby. Tapsi trinkt Milch bei Mama.",
      en: "Tapsi is a little baby. Tapsi drinks Mommy’s milk.",
      zh: "塔普西是个小宝宝。塔普西喝妈妈的奶。",
      hi: "टैप्सी एक नन्हा-सा बच्चा है। टैप्सी मम्मी का दूध पीता है।",
      es: "Tapsi es un bebé. Tapsi toma la leche de mamá.",
      ar: "تابسي طفل صغير. تابسي يشرب حليب ماما.",
      ru: "Тапси ещё совсем малыш. Тапси пьёт мамино молоко.",
    },
  },
  {
    id: "grow",
    sky: "day",
    ms: 1600,
    line: {
      de: "Jetzt ist Tapsi schon groß! Tapsi kann laufen und springen.",
      en: "Now Tapsi is big! Tapsi can run and jump.",
      zh: "现在塔普西长大了！塔普西会跑也会跳。",
      hi: "अब टैप्सी बड़ा हो गया है! टैप्सी दौड़ और कूद सकता है।",
      es: "¡Ahora Tapsi ya es grande! Tapsi corre y salta.",
      ar: "الآن كبر تابسي! تابسي يركض ويقفز.",
      ru: "Теперь Тапси уже большой! Тапси умеет бегать и прыгать.",
    },
  },
  {
    id: "eat",
    sky: "day",
    ms: 1800,
    line: {
      de: "Tapsi isst wie die Großen. Mmh, ein Apfel!",
      en: "Tapsi eats like the big ones. Mmm, an apple!",
      zh: "塔普西像大人一样吃东西。嗯，一个苹果！",
      hi: "टैप्सी बड़ों की तरह खाता है। म्म्म, एक सेब!",
      es: "Tapsi come como los mayores. ¡Mmm, una manzana!",
      ar: "تابسي يأكل مثل الكبار. ممم، تفاحة!",
      ru: "Тапси ест, как взрослые. Ммм, яблоко!",
    },
  },
  {
    id: "cup",
    sky: "day",
    ms: 1600,
    line: {
      de: "Tapsi trinkt aus dem Becher. Ganz allein!",
      en: "Tapsi drinks from a cup. No help needed!",
      zh: "塔普西用杯子喝。自己就会！",
      hi: "टैप्सी कप से पीता है। बिल्कुल अपने आप!",
      es: "Tapsi bebe del vaso. ¡Sin ayuda!",
      ar: "تابسي يشرب من الكوب. وحده تمامًا!",
      ru: "Тапси пьёт из кружки. Совсем сам!",
    },
  },
  {
    id: "tell",
    sky: "day",
    ms: 1600,
    line: {
      de: "Mama sagt: Bald ist die Mama-Milch alle. Tapsi ist ja schon groß.",
      en: "Mommy says: Soon Mommy’s milk is all gone. Tapsi is big now.",
      zh: "妈妈说：妈妈的奶快没有了。塔普西已经长大啦。",
      hi: "मम्मी कहती हैं: जल्दी ही मम्मी का दूध ख़त्म हो जाएगा। टैप्सी तो अब बड़ा है।",
      es: "Mamá dice: pronto se acaba la leche de mamá. Tapsi ya es grande.",
      ar: "تقول ماما: قريبًا ينتهي حليب ماما. فتابسي كبر الآن.",
      ru: "Мама говорит: скоро мамино молоко закончится. Тапси ведь уже большой.",
    },
  },
  {
    id: "goodbye",
    sky: "day",
    ms: 2600,
    line: {
      de: "Tapsi winkt: Tschüss, Mama-Milch! Danke!",
      en: "Tapsi waves: Bye-bye, Mommy’s milk! Thank you!",
      zh: "塔普西挥挥手：再见，妈妈的奶！谢谢你！",
      hi: "टैप्सी हाथ हिलाता है: टाटा, मम्मी का दूध! शुक्रिया!",
      es: "Tapsi dice adiós con la mano: ¡Adiós, leche de mamá! ¡Gracias!",
      ar: "تابسي يلوّح: وداعًا يا حليب ماما! شكرًا!",
      ru: "Тапси машет: пока, мамино молоко! Спасибо!",
    },
  },
  {
    id: "evening",
    sky: "night",
    ms: 1600,
    line: {
      de: "Am Abend ist Tapsi müde. Tapsi möchte Mama-Milch.",
      en: "In the evening Tapsi is tired. Tapsi wants Mommy’s milk.",
      zh: "晚上，塔普西累了。塔普西想喝妈妈的奶。",
      hi: "शाम को टैप्सी थका हुआ है। टैप्सी को मम्मी का दूध चाहिए।",
      es: "Por la noche, Tapsi tiene sueño. Tapsi quiere leche de mamá.",
      ar: "في المساء يشعر تابسي بالتعب. تابسي يريد حليب ماما.",
      ru: "Вечером Тапси хочет спать. И хочет мамино молоко.",
    },
  },
  {
    id: "sad",
    sky: "night",
    ms: 2200,
    line: {
      de: "„Die Milch ist alle“, sagt Mama. Tapsi ist traurig. Mama ist ganz nah.",
      en: "“The milk is all gone,” says Mommy. Tapsi is sad. Mommy is right there.",
      zh: "“奶没有了。”妈妈说。塔普西很难过。妈妈就在身边。",
      hi: "“दूध ख़त्म हो गया,” मम्मी कहती हैं। टैप्सी उदास है। मम्मी बिल्कुल पास हैं।",
      es: "«Ya no hay leche», dice mamá. Tapsi está triste. Mamá está muy cerca.",
      ar: "«انتهى الحليب»، تقول ماما. تابسي حزين. ماما قريبة جدًا.",
      ru: "«Молоко закончилось», – говорит мама. Тапси грустно. Мама совсем рядом.",
    },
  },
  {
    id: "cuddle",
    sky: "night",
    ms: 2000,
    line: {
      de: "Mama nimmt Tapsi fest in den Arm. Kuscheln geht immer!",
      en: "Mommy gives Tapsi a big hug. There’s always time for cuddles!",
      zh: "妈妈紧紧抱住塔普西。抱抱什么时候都可以！",
      hi: "मम्मी टैप्सी को कसकर गले लगाती हैं। झप्पी तो हमेशा मिलती है!",
      es: "Mamá abraza fuerte a Tapsi. ¡Siempre hay mimos!",
      ar: "ماما تضمّ تابسي بقوة. الحضن ممكن دائمًا!",
      ru: "Мама крепко обнимает Тапси. Обниматься можно всегда!",
    },
  },
  {
    id: "book",
    sky: "night",
    ms: 1600,
    line: {
      de: "Mama liest Tapsi ein Buch vor.",
      en: "Mommy reads Tapsi a book.",
      zh: "妈妈给塔普西读一本书。",
      hi: "मम्मी टैप्सी को किताब पढ़कर सुनाती हैं।",
      es: "Mamá le lee un cuento a Tapsi.",
      ar: "ماما تقرأ لتابسي كتابًا.",
      ru: "Мама читает Тапси книжку.",
    },
  },
  {
    id: "bed",
    sky: "night",
    ms: 3200,
    line: {
      de: "Tapsi kuschelt mit dem Teddy. Mama singt ein Schlaflied.",
      en: "Tapsi cuddles the teddy. Mommy sings a lullaby.",
      zh: "塔普西抱着泰迪熊。妈妈唱摇篮曲。",
      hi: "टैप्सी टेडी से लिपटता है। मम्मी लोरी गाती हैं।",
      es: "Tapsi abraza al osito. Mamá canta una canción de cuna.",
      ar: "تابسي يحضن الدبدوب. ماما تغنّي تهويدة.",
      ru: "Тапси обнимает мишку. Мама поёт колыбельную.",
    },
  },
  {
    id: "sleep",
    sky: "night",
    ms: 2000,
    line: {
      de: "Tapsi schläft ein. Mama hat Tapsi lieb – immer.",
      en: "Tapsi falls asleep. Mommy loves Tapsi – always.",
      zh: "塔普西睡着了。妈妈永远爱塔普西。",
      hi: "टैप्सी सो जाता है। मम्मी टैप्सी से प्यार करती हैं – हमेशा।",
      es: "Tapsi se duerme. Mamá quiere a Tapsi, siempre.",
      ar: "تابسي ينام. ماما تحبّ تابسي – دائمًا.",
      ru: "Тапси засыпает. Мама любит Тапси – всегда.",
    },
  },
  {
    id: "morning",
    sky: "morning",
    ms: 2400,
    line: {
      de: "Guten Morgen! Tapsi ist groß – Mama und Papa sind stolz.",
      en: "Good morning! Tapsi is big – Mommy and Daddy are proud.",
      zh: "早上好！塔普西长大了——爸爸妈妈真骄傲。",
      hi: "सुप्रभात! टैप्सी बड़ा हो गया है – मम्मी और पापा को गर्व है।",
      es: "¡Buenos días! Tapsi ya es grande: mamá y papá están orgullosos.",
      ar: "صباح الخير! تابسي كبر – ماما وبابا فخوران.",
      ru: "Доброе утро! Тапси уже большой – мама и папа гордятся.",
    },
  },
];

/** The steps' sentences in German, for the list of what still waits for its recording (voiceLines.ts). */
export const GERMAN_LINES = STEPS.map((s) => s.line.de);
