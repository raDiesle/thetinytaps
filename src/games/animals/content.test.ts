import { expect, test } from "bun:test";
import { ANIMAL_TEXTS, ANIMALS, FOODS } from "./content";
import { RUSSIAN_ANIMALS, RUSSIAN_FOODS, RUSSIAN_HOMES } from "./content.ru";
import { HOMES } from "./homes";

const CYRILLIC = /^[а-яё -]+$/;

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

test("no Russian word is left over from an animal or food that is gone", () => {
  const animals = new Set(ANIMALS.map((a) => a.id));
  const foods = new Set(FOODS.map((f) => f.id));
  for (const id of Object.keys(RUSSIAN_ANIMALS)) expect(animals.has(id), id).toBe(true);
  for (const id of Object.keys(RUSSIAN_FOODS)) expect(foods.has(id), id).toBe(true);
});

test("the Russian sentences have no German left in them", () => {
  const ru = ANIMAL_TEXTS.ru!;
  for (const animal of ANIMALS.filter((a) => RUSSIAN_ANIMALS[a.id])) {
    const sentences = [ru.animal(animal), ru.hungry(animal), ru.yuck(animal), ru.whereLives(animal), ru.livesHere(animal)];
    if (animal.food && RUSSIAN_FOODS[animal.food.id]) sentences.push(ru.food(animal.food), ru.yummy(animal, animal.food));
    if (animal.home && RUSSIAN_HOMES[animal.home]) sentences.push(ru.home(HOMES[animal.home]), ru.movedIn(animal, HOMES[animal.home]));
    for (const sentence of sentences) expect(sentence, animal.id).not.toMatch(/[a-zäöüß]/i);
  }
});

test("an animal without its Russian word gets the whole German sentence", () => {
  const withFood = ANIMALS.find((a) => a.food && a.home)!;
  const animal = { ...withFood, id: "not-translated" };
  const [ru, de] = [ANIMAL_TEXTS.ru!, ANIMAL_TEXTS.de];
  expect(ru.hungry(animal)).toBe(de.hungry(animal));
  expect(ru.yummy(animal, withFood.food!)).toBe(de.yummy(animal, withFood.food!));
  expect(ru.movedIn(animal, HOMES[withFood.home!])).toBe(de.movedIn(animal, HOMES[withFood.home!]));
});
