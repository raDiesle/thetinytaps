import { expect, test } from "bun:test";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { ANIMAL_TEXTS, ANIMAL_TRANSLATIONS, ANIMALS, FOODS } from "./content";
import { RUSSIAN_ANIMALS, RUSSIAN_FOODS, RUSSIAN_HOMES } from "./content.ru";
import { HOMES, type HomeId } from "./homes";

const CYRILLIC = /^[а-яё -]+$/;

/** The languages translated whole so far: every animal, food and home has its words. */
const COMPLETE: TargetLanguageId[] = ["en", "zh", "hi", "es", "ar", "ru"];

/** The languages in a script of their own: no Latin letter may be left in their sentences. */
const OWN_SCRIPT: TargetLanguageId[] = ["zh", "hi", "ar", "ru"];

/** Every string inside a language's words, however deep. */
const stringsIn = (value: unknown): string[] =>
  typeof value === "string" ? [value] : value && typeof value === "object" ? Object.values(value).flatMap(stringsIn) : [];

// Translations come only when asked for, so an animal, food or home may lack its Russian words; those it has must be well formed.
test("every Russian word for an animal, food or home is Cyrillic lower case", () => {
  for (const [id, name] of Object.entries(RUSSIAN_ANIMALS)) expect(name, id).toMatch(CYRILLIC);
  for (const [id, food] of Object.entries(RUSSIAN_FOODS)) {
    expect(food.name, id).toMatch(CYRILLIC);
    expect(food.likes, id).toMatch(CYRILLIC);
  }
  for (const [id, home] of Object.entries(RUSSIAN_HOMES)) {
    expect(home?.name, id).toMatch(CYRILLIC);
    expect(home?.inPhrase, id).toMatch(CYRILLIC);
  }
});

test("no word of any language is left over from an animal, food or home that is gone", () => {
  const animals = new Set(ANIMALS.map((a) => a.id));
  const foods = new Set(FOODS.map((f) => f.id));
  for (const [language, { words }] of Object.entries(ANIMAL_TRANSLATIONS)) {
    for (const id of Object.keys(words.animals)) expect(animals.has(id), `${language} ${id}`).toBe(true);
    for (const id of Object.keys(words.foods)) expect(foods.has(id), `${language} ${id}`).toBe(true);
    for (const id of Object.keys(words.homes)) expect(id in HOMES, `${language} ${id}`).toBe(true);
  }
});

test("the translated languages have words for every animal, food and home", () => {
  for (const language of COMPLETE) {
    const { words } = ANIMAL_TRANSLATIONS[language]!;
    for (const { id } of ANIMALS) expect(words.animals[id], `${language} ${id}`).toBeDefined();
    for (const { id } of FOODS) expect(words.foods[id], `${language} ${id}`).toBeDefined();
    for (const id of Object.keys(HOMES) as HomeId[]) expect(words.homes[id], `${language} ${id}`).toBeDefined();
  }
});

test("the sentences have no German left in them, and none in another script has Latin letters", () => {
  for (const [language, { words }] of Object.entries(ANIMAL_TRANSLATIONS) as [TargetLanguageId, (typeof ANIMAL_TRANSLATIONS)["ru"] & {}][]) {
    const texts = ANIMAL_TEXTS[language]!;
    const german = ANIMAL_TEXTS.de;
    for (const animal of ANIMALS.filter((a) => words.animals[a.id])) {
      // Each sentence next to its German one.
      const pairs: [string, string][] = (["hungry", "yuck", "whereLives", "livesHere"] as const).map((key) => [texts[key](animal), german[key](animal)]);
      if (animal.food && words.foods[animal.food.id]) pairs.push([texts.yummy(animal, animal.food), german.yummy(animal, animal.food)]);
      if (animal.home && words.homes[animal.home]) pairs.push([texts.movedIn(animal, HOMES[animal.home]), german.movedIn(animal, HOMES[animal.home])]);
      for (const [sentence, de] of pairs) expect(sentence, `${language} ${animal.id}`).not.toBe(de);
      if (OWN_SCRIPT.includes(language)) {
        const shown = [...pairs.map(([sentence]) => sentence), texts.animal(animal), texts.yuckBubble, texts.thanksBubble, texts.stars(3)];
        for (const sentence of shown) expect(sentence, `${language} ${animal.id}`).not.toMatch(/[A-Za-zäöüß]/);
      }
    }
    if (OWN_SCRIPT.includes(language)) for (const word of stringsIn(words)) expect(word, language).not.toMatch(/[A-Za-z]/);
  }
});

test("an animal without its words gets the whole German sentence, in every language", () => {
  const withFood = ANIMALS.find((a) => a.food && a.home)!;
  const animal = { ...withFood, id: "not-translated" };
  const de = ANIMAL_TEXTS.de;
  for (const language of Object.keys(ANIMAL_TRANSLATIONS) as TargetLanguageId[]) {
    const texts = ANIMAL_TEXTS[language]!;
    expect(texts.hungry(animal), language).toBe(de.hungry(animal));
    expect(texts.yummy(animal, withFood.food!), language).toBe(de.yummy(animal, withFood.food!));
    expect(texts.movedIn(animal, HOMES[withFood.home!]), language).toBe(de.movedIn(animal, HOMES[withFood.home!]));
  }
});
