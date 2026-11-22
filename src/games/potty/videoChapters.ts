import type { EnglishFirst } from "@/lib/language";
import type { StepId } from "./content";

/**
 * The chapters of a potty video for YouTube's description (idea Y-26): the step that begins each one and its name,
 * written English first like everything new and translated into every app language (22 November 2026). Steps between them belong to the chapter
 * before; `VideoRecorder` joins chapters too short for YouTube.
 */
export const STEP_CHAPTERS: Partial<Record<StepId, EnglishFirst>> = {
  eat: { en: "Time to go", de: "Zeit fürs Töpfchen", zh: "该上厕所了", hi: "पॉटी का समय", es: "Hora del orinal", ar: "حان وقت النونية", ru: "Пора на горшок" },
  down: { en: "On the potty", de: "Aufs Töpfchen", zh: "坐上小马桶", hi: "पॉटी-सीट पर", es: "En el orinal", ar: "على النونية", ru: "На горшке" },
  done: { en: "All done!", de: "Fertig!", zh: "完成啦！", hi: "हो गया!", es: "¡Listo!", ar: "انتهينا!", ru: "Готово!" },
  flush: {
    en: "Flush and wash hands",
    de: "Abziehen und Hände waschen",
    zh: "冲水和洗手",
    hi: "फ़्लश और हाथ धोना",
    es: "Tirar de la cadena y lavarse las manos",
    ar: "شدّ السيفون وغسل اليدين",
    ru: "Смыть и помыть руки",
  },
  party: { en: "Party!", de: "Party!", zh: "庆祝啦！", hi: "पार्टी!", es: "¡Fiesta!", ar: "حفلة!", ru: "Праздник!" },
};

/** When nothing came, the rest of the story after sitting is one chapter (idea Y-24): washing and playing are too short for two. */
export const NOTHING_CHAPTERS: Partial<Record<StepId, EnglishFirst>> = {
  wash: {
    en: "Nothing today – that's okay",
    de: "Heute nichts – macht nichts",
    zh: "今天没有——没关系",
    hi: "आज कुछ नहीं – कोई बात नहीं",
    es: "Hoy nada, no pasa nada",
    ar: "لا شيء اليوم – لا بأس",
    ru: "Сегодня ничего – ничего страшного",
  },
};
