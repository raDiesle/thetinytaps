import { expect, test } from "@rstest/core";
import { DAYTIME } from "./daytime";
import { DAYTIME_RU } from "./daytime.ru";
import { KAI, STEPS, stepTexts } from "./steps";
import { STEP_TEXTS_RU } from "./steps.ru";
import { SUNG_LABELS, sungLanguageFor } from "./sung";

// Everything the child sees and hears while brushing comes in Russian too, and the
// sung song falls back sensibly where a language has none yet.

const CYRILLIC = /[а-яё]/i;

test("every step has its own id and its texts in Russian", () => {
  expect(new Set(STEPS.map((s) => s.id)).size).toBe(STEPS.length);
  expect(Object.keys(STEP_TEXTS_RU).sort()).toEqual(STEPS.map((s) => s.id).sort());
  for (const step of STEPS) {
    const ru = stepTexts(step, "ru");
    for (const text of [ru.title, ru.hint, ru.cue]) expect(text, step.id).toMatch(CYRILLIC);
    // The title keeps the German one's emoji, which shows the way.
    expect(ru.title.split(" ")[0], step.id).toBe(step.title.split(" ")[0]);
    expect(stepTexts(step, "de")).toMatchObject({ title: step.title, hint: step.hint, cue: step.cue });
  }
});

test("morning and evening are said in Russian too", () => {
  for (const daytime of ["morning", "evening"] as const) {
    for (const key of Object.keys(DAYTIME[daytime]) as (keyof (typeof DAYTIME)["morning"])[]) {
      expect(DAYTIME_RU[daytime][key], `${daytime}.${key}`).toMatch(CYRILLIC);
    }
  }
  expect(KAI.ru).toMatch(CYRILLIC);
});

test("every sung language is named in Russian too", () => {
  for (const [lang, label] of Object.entries(SUNG_LABELS)) expect(label.ru, lang).toMatch(CYRILLIC);
});

test("the song is sung in the app language by default, and without a song there it is the plain tune", () => {
  const songs = ["de", "en"];
  expect(sungLanguageFor("auto", "de", songs)).toBe("de");
  expect(sungLanguageFor("auto", "ru", songs)).toBeNull();
  expect(sungLanguageFor("auto", "ru", [...songs, "ru"])).toBe("ru");
  expect(sungLanguageFor("en", "ru", songs)).toBe("en");
  expect(sungLanguageFor("off", "de", songs)).toBeNull();
  expect(sungLanguageFor("ru", "de", songs)).toBeNull();
});
