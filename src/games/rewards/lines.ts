/**
 * What the Belohnungstafel and the Tagesplan are meant to say to the child, in every language. These lines wait for
 * their recordings: nothing says them yet, since the browser's voice no longer speaks (root CLAUDE.md, „Sounds and
 * voice have no switch“). Once they are recorded, the game says them with `recordedVoice`. Until then they are listed
 * on /management/ (🎙️ Stimmen, `src/content/voiceLines.ts`), so the lines to record are known.
 */
import type { Localized } from "@/lib/language";
import { SLEEPS_LEFT } from "./PlanSheet";

/** The sentences of the board and the day plan, by when they are said. */
export const REWARD_LINES = {
  /** A board full, before the name of its reward. */
  rewardNow: {
    de: "Geschafft! Jetzt gibt es:",
    en: "You did it! Now it’s time for:",
    zh: "完成啦！现在可以：",
    hi: "हो गया! अब बारी है:",
    es: "¡Lo lograste! Ahora toca:",
    ar: "نجحنا! والآن:",
    ru: "Получилось! А теперь:",
  },
  /** A board full that has no reward. */
  boardDone: {
    de: "Geschafft! Hurra!",
    en: "You did it! Hooray!",
    zh: "完成啦！好耶！",
    hi: "हो गया! हुर्रे!",
    es: "¡Lo lograste! ¡Hurra!",
    ar: "نجحنا! يا للفرح!",
    ru: "Получилось! Ура!",
  },
  /** A day of a week or month board with all its stars. */
  dayFull: {
    de: "Super! Der Tag ist voll!",
    en: "Super! The day is full!",
    zh: "太棒了！今天满啦！",
    hi: "शाबाश! आज का दिन पूरा हो गया!",
    es: "¡Genial! ¡El día está completo!",
    ar: "رائع! اكتمل اليوم!",
    ru: "Супер! Весь день в звёздах!",
  },
  /** Any other star or tick. */
  super: { de: "Super!", en: "Super!", zh: "太棒了！", hi: "शाबाश!", es: "¡Genial!", ar: "رائع!", ru: "Супер!" },
  /** The day plan's last card done. */
  allDone: {
    de: "Alles geschafft! Hurra!",
    en: "All done! Hooray!",
    zh: "全部完成啦！好耶！",
    hi: "सब हो गया! हुर्रे!",
    es: "¡Todo listo! ¡Hurra!",
    ar: "انتهينا من كل شيء! يا للفرح!",
    ru: "Всё готово! Ура!",
  },
  /** A card of the day plan done, before the name of the next one. */
  superNow: { de: "Super! Jetzt:", en: "Super! Now:", zh: "太棒了！现在：", hi: "शाबाश! अब:", es: "¡Genial! Ahora:", ar: "رائع! والآن:", ru: "Супер! Теперь:" },
  /** The Fertig-Kiste tapped, before the names of what is in it. */
  alreadyDone: { de: "Schon fertig:", en: "Already done:", zh: "已经完成：", hi: "हो चुका है:", es: "Ya está hecho:", ar: "انتهينا من:", ru: "Уже готово:" },
  /** The Fertig-Kiste tapped while it is empty. */
  boxEmpty: {
    de: "Hier kommt rein, was fertig ist.",
    en: "What’s done goes in here.",
    zh: "做完的放到这里。",
    hi: "जो हो गया, वह यहाँ आता है।",
    es: "Aquí va lo que ya está hecho.",
    ar: "هنا نضع ما انتهينا منه.",
    ru: "Сюда кладём то, что готово.",
  },
  /** A Countdown's big day has come, before its name. */
  todayIsTheDay: {
    de: "Heute ist es so weit:",
    en: "Today is the day:",
    zh: "今天就是这一天：",
    hi: "आज वह दिन आ गया:",
    es: "¡Hoy es el día!",
    ar: "اليوم هو اليوم:",
    ru: "Сегодня этот день:",
  },
  /** Tomorrow's day of the week tapped, before what comes then. */
  tomorrow: {
    de: "Morgen, noch einmal schlafen",
    en: "Tomorrow, one more sleep",
    zh: "明天，再睡一觉",
    hi: "कल, बस एक बार और सोना है",
    es: "Mañana, falta una noche",
    ar: "غدًا، بعد ليلة واحدة",
    ru: "Завтра, ещё разок поспать",
  },
} satisfies Record<string, Localized>;

/** „Noch 3-mal schlafen, dann Geburtstag“: a Countdown's moons and its big day, said to the child (H-41). */
export const SLEEPS_UNTIL: Localized<(nights: number, what: string) => string> = {
  de: (n, what) => `${SLEEPS_LEFT.de(n)}, dann ${what}`,
  en: (n, what) => `${(SLEEPS_LEFT.en ?? SLEEPS_LEFT.de)(n)}, then ${what}`,
  zh: (n, what) => `${(SLEEPS_LEFT.zh ?? SLEEPS_LEFT.de)(n)}，然后就是${what}`,
  hi: (n, what) => `${(SLEEPS_LEFT.hi ?? SLEEPS_LEFT.de)(n)}, फिर ${what}`,
  es: (n, what) => `${(SLEEPS_LEFT.es ?? SLEEPS_LEFT.de)(n)} y luego llega: ${what}`,
  ar: (n, what) => `${(SLEEPS_LEFT.ar ?? SLEEPS_LEFT.de)(n)}، ثم ${what}`,
  ru: (n, what) => `${(SLEEPS_LEFT.ru ?? SLEEPS_LEFT.de)(n)}, а потом – ${what}`,
};
