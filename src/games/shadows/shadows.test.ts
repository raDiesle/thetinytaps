import { expect, test } from "bun:test";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { ITEMS, SHADOW_TEXTS, SHADOW_TRANSLATIONS } from "./content";
import { RUSSIAN_NAMES } from "./content.ru";
import { dealShadows, nextLevel, SHADOW_LEVELS } from "./levels";

const CYRILLIC = /^[а-яё -]+$/;

/** The languages translated whole so far: every picture has its name. */
const COMPLETE: TargetLanguageId[] = ["en", "zh", "hi", "es", "ar", "ru"];

/** The languages in a script of their own: no Latin letter may be left in their sentences. */
const OWN_SCRIPT: TargetLanguageId[] = ["zh", "hi", "ar", "ru"];

// Translations come only when asked for, so a picture may lack its Russian name; one that has it must be well formed.
test("every Russian name and its form for „тень …“ are Cyrillic lower case", () => {
  for (const [id, ru] of Object.entries(RUSSIAN_NAMES)) {
    expect(ru.name, id).toMatch(CYRILLIC);
    expect(ru.of, id).toMatch(CYRILLIC);
  }
});

test("no name of any language is left over from a picture that is gone", () => {
  const ids = new Set(ITEMS.map((i) => i.id));
  for (const [language, { names }] of Object.entries(SHADOW_TRANSLATIONS)) {
    for (const id of Object.keys(names)) expect(ids.has(id), `${language} ${id}`).toBe(true);
  }
});

test("the translated languages name every picture", () => {
  for (const language of COMPLETE) {
    const { names } = SHADOW_TRANSLATIONS[language]!;
    for (const { id } of ITEMS) expect(names[id], `${language} ${id}`).toBeDefined();
  }
});

test("the sentences have no German left in them, and none in another script has Latin letters", () => {
  const de = SHADOW_TEXTS.de;
  for (const [language, { names }] of Object.entries(SHADOW_TRANSLATIONS) as [TargetLanguageId, { names: Record<string, unknown> }][]) {
    const texts = SHADOW_TEXTS[language]!;
    for (const item of ITEMS.filter((i) => names[i.id])) {
      const sentences = [texts.search(item), texts.found(item), texts.thatIs(item), texts.there(item)];
      sentences.forEach((sentence, i) => expect(sentence, `${language} ${item.id}`).not.toBe([de.search, de.found, de.thatIs, de.there][i](item)));
      if (OWN_SCRIPT.includes(language)) {
        for (const sentence of [...sentences, texts.name(item), texts.peek, texts.shadow(2), texts.stars(3)]) {
          expect(sentence, `${language} ${item.id}`).not.toMatch(/[A-Za-zäöüß]/);
        }
      }
    }
  }
});

test("a picture without its name gets the whole German sentence, in every language", () => {
  const item = { ...ITEMS[0], id: "not-translated" };
  const de = SHADOW_TEXTS.de;
  for (const language of Object.keys(SHADOW_TRANSLATIONS) as TargetLanguageId[]) {
    const texts = SHADOW_TEXTS[language]!;
    for (const key of ["name", "search", "found", "thatIs", "there"] as const) expect(texts[key](item), `${language} ${key}`).toBe(de[key](item));
  }
});

const ANIMAL = ITEMS.find((i) => i.id === "elefant")!;

test("each step deals its number of shadows, the picture's own among them once, and no shadow twice", () => {
  for (const level of SHADOW_LEVELS) {
    for (const pool of [ITEMS, ITEMS.filter((i) => i.theme === "animals"), ITEMS.filter((i) => i.theme === "vehicles")]) {
      const item = pool[0];
      const shadows = dealShadows(item, pool, level);
      expect(shadows.length).toBe(level.shadows);
      expect(new Set(shadows).size).toBe(shadows.length);
      expect(shadows.filter((s) => s === item).length).toBe(1);
      expect(shadows.every((s) => pool.includes(s))).toBe(true);
    }
  }
});

test("mixed pictures: the early steps show shadows of other kinds, the later ones of the same kind", () => {
  for (const level of SHADOW_LEVELS) {
    const others = dealShadows(ANIMAL, ITEMS, level).filter((s) => s !== ANIMAL);
    expect(others.every((s) => (s.theme === ANIMAL.theme) === level.alike)).toBe(true);
  }
});

test("the steps only get harder, and the first is the easiest", () => {
  SHADOW_LEVELS.slice(1).forEach((level, i) => {
    const before = SHADOW_LEVELS[i];
    expect(level.shadows > before.shadows || (level.shadows === before.shadows && level.alike && !before.alike)).toBe(true);
  });
  expect(SHADOW_LEVELS[0]).toEqual({ shadows: 2, alike: false });
});

test("quick and sure goes up, slow or unsure goes down, never past the ends", () => {
  const quick = { misses: 0, ms: 2000 };
  expect(nextLevel(0, [quick])).toBe(0);
  expect(nextLevel(0, [quick, quick])).toBe(1);
  expect(nextLevel(SHADOW_LEVELS.length - 1, [quick, quick])).toBe(SHADOW_LEVELS.length - 1);
  expect(nextLevel(2, [{ misses: 0, ms: 9000 }, quick])).toBe(2);
  expect(nextLevel(2, [{ misses: 2, ms: 3000 }])).toBe(1);
  expect(nextLevel(2, [{ misses: 0, ms: 20000 }])).toBe(1);
  expect(nextLevel(2, [{ misses: 1, ms: 3000 }])).toBe(2);
  expect(
    nextLevel(2, [
      { misses: 1, ms: 3000 },
      { misses: 1, ms: 3000 },
    ]),
  ).toBe(1);
  expect(nextLevel(0, [{ misses: 3, ms: 30000 }])).toBe(0);
});
