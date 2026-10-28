import { expect, test } from "bun:test";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { ITEMS, SHADOW_TEXTS, SHADOW_TRANSLATIONS } from "./content";
import { RUSSIAN_NAMES } from "./content.ru";

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
