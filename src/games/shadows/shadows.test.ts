import { expect, test } from "bun:test";
import { ITEMS, SHADOW_TEXTS } from "./content";
import { RUSSIAN_NAMES } from "./content.ru";

const CYRILLIC = /^[а-яё -]+$/;

// Translations come only when asked for, so a picture may lack its Russian name; one that has it must be well formed.
test("every Russian name and its form for „тень …“ are Cyrillic lower case", () => {
  for (const [id, ru] of Object.entries(RUSSIAN_NAMES)) {
    expect(ru.name, id).toMatch(CYRILLIC);
    expect(ru.of, id).toMatch(CYRILLIC);
  }
});

test("no Russian name is left over from a picture that is gone", () => {
  const ids = new Set(ITEMS.map((i) => i.id));
  for (const id of Object.keys(RUSSIAN_NAMES)) expect(ids.has(id), id).toBe(true);
});

test("the Russian sentences have no German left in them", () => {
  const ru = SHADOW_TEXTS.ru!;
  for (const item of ITEMS.filter((i) => RUSSIAN_NAMES[i.id])) {
    for (const sentence of [ru.name(item), ru.search(item), ru.found(item), ru.thatIs(item), ru.there(item)]) {
      expect(sentence, item.id).not.toMatch(/[a-zäöüß]/i);
    }
  }
});

test("a picture without its Russian name gets the whole German sentence", () => {
  const item = { ...ITEMS[0], id: "not-translated" };
  const [ru, de] = [SHADOW_TEXTS.ru!, SHADOW_TEXTS.de];
  for (const key of ["name", "search", "found", "thatIs", "there"] as const) expect(ru[key](item), key).toBe(de[key](item));
});
