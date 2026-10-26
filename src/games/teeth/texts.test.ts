import { expect, test } from "@rstest/core";
import { targetLanguageFor } from "@/content/targetLanguages";
import { DAYTIME } from "./daytime";
import { DAYTIME_RU } from "./daytime.ru";
import { spokenIn } from "@/lib/language";
import { KAI, STEPS, stepText } from "./steps";
import { STEP_TEXTS_RU } from "./steps.ru";
import { sungLanguageFor } from "./sung";

// Translations are made only when the user asks, so a text may lack its Russian: it is
// then said in German with the German voice. The Russian that is there must be Russian
// and belong to a step that still exists.

const CYRILLIC = /[а-яё]/i;
const russian = targetLanguageFor("ru");

test("every step has its own id, and the Russian step texts are Cyrillic and belong to a step", () => {
  const ids = STEPS.map((s) => s.id);
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
  if (KAI.ru) expect(KAI.ru).toMatch(CYRILLIC);
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
