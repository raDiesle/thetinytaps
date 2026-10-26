import { expect, test } from "@rstest/core";
import { ITEMS, SHADOW_TEXTS } from "./content";
import { RUSSIAN_NAMES } from "./content.ru";

const CYRILLIC = /^[а-яё -]+$/;

test("every picture has a Russian name and the form for „тень …“, in Cyrillic lower case", () => {
  for (const item of ITEMS) {
    const ru = RUSSIAN_NAMES[item.id];
    expect(ru, item.id).toBeDefined();
    expect(ru.name, item.id).toMatch(CYRILLIC);
    expect(ru.of, item.id).toMatch(CYRILLIC);
  }
});

test("no Russian name is left over from a picture that is gone", () => {
  const ids = new Set(ITEMS.map((i) => i.id));
  for (const id of Object.keys(RUSSIAN_NAMES)) expect(ids.has(id), id).toBe(true);
});

test("the Russian sentences have no German left in them", () => {
  const ru = SHADOW_TEXTS.ru!;
  for (const item of ITEMS) {
    for (const sentence of [ru.name(item), ru.search(item), ru.found(item), ru.thatIs(item), ru.there(item)]) {
      expect(sentence, item.id).not.toMatch(/[a-zäöüß]/i);
    }
  }
});
