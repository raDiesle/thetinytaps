import { expect, test } from "bun:test";
import { targetLanguageFor } from "@/content/targetLanguages";
import { DAYTIME, DAYTIME_TRANSLATIONS, daytimeText } from "./daytime";
import { DAYTIME_RU } from "./daytime.ru";
import { spokenIn } from "@/lib/language";
import { STEP_TRANSLATIONS, STEPS, stepText } from "./steps";
import { STEP_TEXTS_RU } from "./steps.ru";
import { sungLanguageFor } from "./sung";

// Translations are made only when the user asks, so a text may lack its Russian: it is
// then said in German with the German voice. The Russian that is there must be Russian
// and belong to a step that still exists.

const CYRILLIC = /[а-яё]/i;
const russian = targetLanguageFor("ru");

test("every step has its own id, and the Russian step texts are Cyrillic and belong to a step", () => {
  const ids: string[] = STEPS.map((s) => s.id);
  expect(new Set(ids).size).toBe(STEPS.length);
  for (const [id, texts] of Object.entries(STEP_TEXTS_RU)) {
    expect(ids, id).toContain(id);
    for (const text of Object.values(texts ?? {})) expect(text, id).toMatch(CYRILLIC);
  }
  for (const step of STEPS) {
    // A Russian title keeps the German one's emoji, which shows the way.
    const title = STEP_TEXTS_RU[step.id]?.title;
    if (title) expect(title.split(" ")[0], step.id).toBe(step.title.split(" ")[0]);
  }
});

test("the Russian morning and evening texts are Cyrillic and have a German one", () => {
  for (const daytime of ["morning", "evening"] as const) {
    for (const [key, text] of Object.entries(DAYTIME_RU[daytime])) {
      expect(Object.keys(DAYTIME[daytime]), `${daytime}.${key}`).toContain(key);
      expect(text, `${daytime}.${key}`).toMatch(CYRILLIC);
    }
  }
});

/** The script of each translated language not written in Latin letters: no Latin word may slip into it. */
const SCRIPTS = { zh: /\p{Script=Han}/u, hi: /\p{Script=Devanagari}/u, ar: /\p{Script=Arabic}/u } as const;
const TRANSLATED = ["en", "zh", "hi", "es", "ar"] as const;

// A text with Russian was translated into all of them (October 2026); a new German-only text has none yet.
test("a step or daytime text with Russian is there in en, zh, hi, es and ar too, Chinese, Hindi and Arabic without Latin letters", () => {
  for (const id of TRANSLATED) {
    const language = targetLanguageFor(id);
    const lines = [
      ...STEPS.flatMap((step) =>
        (["title", "hint", "cue"] as const).filter((key) => STEP_TEXTS_RU[step.id]?.[key]).map((key) => stepText(step, key, language)),
      ),
      ...(["morning", "evening"] as const).flatMap((daytime) =>
        (["hello", "grow", "doneTitle", "after"] as const).filter((key) => DAYTIME_RU[daytime][key]).map((key) => daytimeText(daytime, key, language)),
      ),
    ];
    for (const { text, lang } of lines) {
      expect(lang, `${id}: ${text}`).toBe(language.speechLang);
      expect(text.trim(), id).not.toBe("");
      if (id in SCRIPTS) expect(text, id).not.toMatch(/[A-Za-z]/);
    }
    for (const step of STEPS) {
      // A title keeps the German one's emoji, which shows the way.
      const title = STEP_TRANSLATIONS[id]?.[step.id]?.title;
      if (title) expect(title.split(" ")[0], `${id} ${step.id}`).toBe(step.title.split(" ")[0]);
    }
    for (const [daytime, texts] of Object.entries(DAYTIME_TRANSLATIONS[id] ?? {}))
      for (const key of Object.keys(texts)) expect(Object.keys(DAYTIME[daytime as keyof typeof DAYTIME]), `${id} ${daytime}`).toContain(key);
  }
});

test("a text without Russian is said in German with the German voice", () => {
  expect(spokenIn({ de: "Hallo" }, russian)).toEqual({ text: "Hallo", lang: "de-DE" });
  expect(spokenIn({ de: "Hallo", ru: "Привет" }, russian)).toEqual({ text: "Привет", lang: russian.speechLang });
  expect(stepText(STEPS[0], "cue", targetLanguageFor("de"))).toEqual({ text: STEPS[0].cue, lang: "de-DE" });
});

test("the song is always sung in the app language, the language of the texts; German when there is no song in it", () => {
  const songs = ["de", "en", "ru"];
  expect(sungLanguageFor("de", songs)).toBe("de");
  expect(sungLanguageFor("ru", songs)).toBe("ru");
  expect(sungLanguageFor("ru", ["de", "en"])).toBe("de");
});
