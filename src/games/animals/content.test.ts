import { expect, test } from "@rstest/core";
import { ANIMAL_TEXTS, ANIMALS, FOODS } from "./content";
import { RUSSIAN_ANIMALS, RUSSIAN_FOODS } from "./content.ru";
import { HOMES } from "./homes";

const CYRILLIC = /^[а-яё -]+$/;

test("every animal and every food has its Russian words, in Cyrillic lower case", () => {
  for (const animal of ANIMALS) expect(RUSSIAN_ANIMALS[animal.id], animal.id).toMatch(CYRILLIC);
  for (const food of FOODS) {
    expect(RUSSIAN_FOODS[food.id]?.name, food.id).toMatch(CYRILLIC);
    expect(RUSSIAN_FOODS[food.id]?.likes, food.id).toMatch(CYRILLIC);
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
  for (const animal of ANIMALS) {
    const sentences = [ru.animal(animal), ru.hungry(animal), ru.yuck(animal), ru.whereLives(animal), ru.livesHere(animal)];
    if (animal.food) sentences.push(ru.food(animal.food), ru.yummy(animal, animal.food));
    if (animal.home) sentences.push(ru.home(HOMES[animal.home]), ru.movedIn(animal, HOMES[animal.home]));
    for (const sentence of sentences) expect(sentence, animal.id).not.toMatch(/[a-zäöüß]/i);
  }
});
