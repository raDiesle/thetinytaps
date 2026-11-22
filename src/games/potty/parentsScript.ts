import { dayKey, weekOf } from "@/lib/days";
import type { EnglishFirst } from "@/lib/language";
import type { StepId } from "./content";
import type { StarLog } from "./stars";

// The parents' video of Aufs Töpfchen (idea Y-29): the real game on a drawn tablet, a grown-up's drawn hand tapping
// through it after a fixed script, and a short line for the grown-ups beside the tablet at every part. For YouTube as a
// video for grown-ups („not made for kids“), so it may end on a slate with the address, under YouTube's end screen.

/** What the hand taps in the game: its button for that, found by its class (PottyPlay.tsx). */
export type HandTarget = "next" | "said-pipi" | "pause" | "check-pipi";

/** The button of each target (the first of its kind: the 💧 comes first among what was said and among the ✓). */
export const TARGET_SELECTORS: Record<HandTarget, string> = {
  next: ".pt-next",
  "said-pipi": ".pt-said",
  pause: ".pt-pause",
  "check-pipi": ".pt-finish:not(.pt-nothing)",
};

/** One beat of the script: once the story is at `at`, its line shows, and `wait` ms later the hand taps `tap`. */
export interface Beat {
  /** The step the beat waits for (PottyPlay's root carries `pt-at-<step>`). */
  at: StepId;
  /** How long the picture is looked at, from the step's start (or the beat before), before the hand has tapped. */
  wait: number;
  /** The button the hand taps at the end of the beat; none: the beat only waits (the last one, on the stars). */
  tap?: HandTarget;
  /** The line for grown-ups beside the tablet from this beat on; none keeps the line before. */
  line?: EnglishFirst;
}

/**
 * The parents' video, about a minute and a half: the story starts at once, the hand taps on, picks what the child said,
 * lets Tapsi sit with the song and the thoughts, pauses and goes on, taps the ✓ of what came, and goes on to the week's
 * star. Lines for grown-ups, short enough to read while the picture plays: written English first (root CLAUDE.md) and
 * translated into every app language (22 November 2026), each addressing grown-ups formally.
 */
export const PARENTS_SCRIPT: Beat[] = [
  {
    at: "eat",
    wait: 5500,
    tap: "next",
    line: {
      en: "Your child has to go? Open Potty Time – the story starts at once.",
      de: "Ihr Kind muss mal? Öffnen Sie „Aufs Töpfchen“ – die Geschichte beginnt sofort.",
      zh: "孩子要上厕所了？打开“坐便盆”，故事马上开始。",
      hi: "आपके बच्चे को जाना है? “पॉटी पर चलो” खोलिए – कहानी तुरंत शुरू होती है।",
      es: "¿Su peque tiene que ir? Abra «Al orinal»: la historia empieza enseguida.",
      ar: "طفلكم بحاجة إلى النونية؟ افتحوا «إلى النونية» – تبدأ القصة فورًا.",
      ru: "Вашему ребёнку надо на горшок? Откройте «На горшок» – история начнётся сразу.",
    },
  },
  {
    at: "need",
    wait: 4500,
    tap: "next",
    line: {
      en: "Tapsi the fox has to go too. One tap on the picture or ▶ goes on.",
      de: "Auch Fuchs Tapsi muss mal. Ein Tipp aufs Bild oder auf ▶, und es geht weiter.",
      zh: "小狐狸塔普西也要上厕所。点一下图片或 ▶，故事就继续。",
      hi: "लोमड़ी टैप्सी को भी जाना है। तस्वीर या ▶ पर एक टैप से कहानी आगे बढ़ती है।",
      es: "El zorrito Tapsi también tiene que ir. Un toque en la imagen o en ▶, y sigue.",
      ar: "الثعلب تابسي بحاجة إلى النونية أيضًا. لمسة على الصورة أو على ▶ وتستمر القصة.",
      ru: "Лисёнку Тапси тоже надо на горшок. Одно касание картинки или ▶ – и дальше.",
    },
  },
  {
    at: "call",
    wait: 5500,
    tap: "said-pipi",
    line: {
      en: "Tapsi calls Mama and Papa. You tap what your child said: pee, poop or both.",
      de: "Tapsi ruft Mama und Papa. Sie tippen an, was Ihr Kind gesagt hat: Pipi, Kaka oder beides.",
      zh: "塔普西叫妈妈和爸爸。请点孩子说的：尿尿、便便，或者都有。",
      hi: "अब टैप्सी की पुकार: मम्मी! पापा! आप वह टैप कीजिए जो आपके बच्चे ने कहा: सू-सू, पॉटी या दोनों।",
      es: "Tapsi llama a mamá y papá. Usted toca lo que dijo su peque: pipí, popó o las dos cosas.",
      ar: "الآن نداء تابسي: ماما! بابا! المسوا ما قاله طفلكم: بيبي أو كاكا أو الاثنين.",
      ru: "Тапси зовёт маму и папу. Нажмите то, что сказал ваш ребёнок: пи-пи, ка-ка или и то и другое.",
    },
  },
  {
    at: "go",
    wait: 4000,
    tap: "next",
    line: {
      en: "Off to the bathroom together – at your child's pace.",
      de: "Gemeinsam ins Bad – im Tempo Ihres Kindes.",
      zh: "一起去卫生间——按孩子自己的节奏来。",
      hi: "साथ मिलकर बाथरूम की ओर – आपके बच्चे की रफ़्तार से।",
      es: "Juntos al baño, al ritmo de su peque.",
      ar: "معًا إلى الحمّام – بإيقاع طفلكم.",
      ru: "Вместе в ванную – в темпе вашего ребёнка.",
    },
  },
  {
    at: "down",
    wait: 4500,
    tap: "next",
    line: {
      en: "Trousers down. Your child does it too, Tapsi shows how.",
      de: "Hose runter. Ihr Kind macht mit, Tapsi zeigt, wie es geht.",
      zh: "脱裤子。孩子也跟着做，塔普西来示范。",
      hi: "पैंट नीचे। आपका बच्चा भी साथ में करे – टैप्सी को देखकर।",
      es: "Pantalón abajo. Su peque lo hace también; Tapsi le enseña cómo.",
      ar: "ننزل البنطال. طفلكم يفعل مثل تابسي تمامًا.",
      ru: "Штаны вниз. Ваш ребёнок делает так же, Тапси показывает как.",
    },
  },
  {
    at: "sit",
    wait: 18000,
    tap: "pause",
    line: {
      en: "While your child sits, a song plays and Tapsi thinks of things that help to let go.",
      de: "Während Ihr Kind sitzt, läuft ein Lied, und Tapsi denkt an Dinge, die beim Loslassen helfen.",
      zh: "孩子坐着的时候，会放一首歌，塔普西想着能帮忙放松的事情。",
      hi: "बैठे रहने के दौरान एक गाना बजता है, और टैप्सी के मन में ऐसी चीज़ें आती हैं जो हल्का होने में मदद करती हैं।",
      es: "Mientras su peque espera en el orinal, suena una canción y Tapsi piensa en cosas que ayudan a soltar.",
      ar: "أثناء الجلوس تُعزف أغنية، وتظهر في أفكار تابسي أشياء تساعد على الاسترخاء.",
      ru: "Пока ребёнок сидит, звучит песенка, а Тапси думает о том, что помогает расслабиться.",
    },
  },
  {
    at: "sit",
    wait: 4500,
    tap: "pause",
    line: {
      en: "Need a moment? The waiting pauses and goes on where it stopped.",
      de: "Brauchen Sie einen Moment? Das Warten hält an und geht dort weiter, wo es stand.",
      zh: "需要停一下？等待会暂停，之后从停下的地方继续。",
      hi: "थोड़ा रुकना है? इंतज़ार रुक जाता है और वहीं से आगे चलता है जहाँ रुका था।",
      es: "¿Necesita un momento? La espera se detiene y sigue donde se quedó.",
      ar: "تحتاجون إلى لحظة؟ يتوقف الانتظار ثم يستمر من حيث توقف.",
      ru: "Нужна минутка? Ожидание встаёт на паузу и продолжается с того же места.",
    },
  },
  {
    at: "sit",
    wait: 8000,
    tap: "check-pipi",
    line: {
      en: "Something came? Tap the ✓ of what is really in the potty – or “nothing”.",
      de: "Ist etwas gekommen? Tippen Sie auf das ✓ dessen, was wirklich im Töpfchen ist – oder auf „nichts“.",
      zh: "有了吗？点一下小马桶里真正有的那个 ✓，或者点“没有”。",
      hi: "कुछ आया? जो सच में पॉटी में है, उसका ✓ टैप कीजिए – या “कुछ नहीं”।",
      es: "¿Salió algo? Toque el ✓ de lo que de verdad hay en el orinal, o «nada».",
      ar: "هل نزل شيء؟ المسوا ✓ لما في النونية حقًا – أو «لا شيء».",
      ru: "Что-то получилось? Нажмите ✓ того, что правда есть в горшке, – или «ничего».",
    },
  },
  {
    at: "wipe",
    wait: 2600,
    tap: "next",
    line: {
      en: "Wipe, trousers up, flush, wash hands – one tap for each.",
      de: "Abwischen, Hose hoch, abziehen, Hände waschen – je ein Tipp.",
      zh: "擦一擦、穿裤子、冲水、洗手——每一步点一下。",
      hi: "पोंछना, पैंट ऊपर, फ़्लश, हाथ धोना – हर एक के लिए एक टैप।",
      es: "Limpiarse, subir el pantalón, tirar de la cadena, lavarse las manos: un toque para cada cosa.",
      ar: "المسح، رفع البنطال، شدّ السيفون، غسل اليدين – لمسة لكلّ خطوة.",
      ru: "Вытереться, надеть штаны, смыть, помыть руки – по одному касанию на каждое.",
    },
  },
  { at: "up", wait: 2200, tap: "next" },
  { at: "flush", wait: 3200, tap: "next" },
  { at: "wash", wait: 3200, tap: "next" },
  { at: "party", wait: 3200, tap: "next" },
  {
    at: "stars",
    wait: 6500,
    line: {
      en: "A star for this week – only for what really came.",
      de: "Ein Stern für diese Woche – nur für das, was wirklich kam.",
      zh: "本周的一颗星星——只给真正成功的那次。",
      hi: "इस हफ़्ते के लिए एक तारा – सिर्फ़ उसके लिए जो सच में आया।",
      es: "Una estrella para esta semana, solo por lo que de verdad salió.",
      ar: "نجمة لهذا الأسبوع – فقط لما نزل حقًا.",
      ru: "Звёздочка за эту неделю – только за то, что правда получилось.",
    },
  },
];

/** The slate at the end, under YouTube's end screen (which may stand 5 to 20 s): the name and the game's address. */
export const END_SLATE_MS = 15_000;

/** How long the hand takes to come to a button from below the picture; it comes that long before its tap. */
export const HAND_IN_MS = 900;
/** How long a finger rests on the button. */
export const PRESS_MS = 220;

/** The video's length without the waits that follow the game (its steps' own pauses): for the check that it stays 1–2 minutes. */
export const scriptMs = (script: Beat[] = PARENTS_SCRIPT) => script.reduce((sum, beat) => sum + beat.wait + (beat.tap ? PRESS_MS : 0), 0) + END_SLATE_MS;

/**
 * The week shown at the end: a star or two on every day before today, as a family a few days into potty training would
 * have, so the new star lands on a filled week. Never the stored week of whoever records.
 */
export function sampleWeek(today: Date): StarLog {
  const log: StarLog = {};
  for (const [i, day] of weekOf(today).entries()) {
    if (dayKey(day) >= dayKey(today)) break;
    log[dayKey(day)] = i % 3 === 1 ? 2 : 1;
  }
  return log;
}
