import { expect, test } from "bun:test";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { ANIMAL_TEXTS, ANIMAL_TRANSLATIONS, ANIMALS, FOODS, GERMAN_ONLY, GIFT_TEXTS, giverOf, GIVERS, wrongFoods, wrongGifts, wrongHomes } from "./content";
import { GIFTS } from "./gifts";
import { RUSSIAN_ANIMALS, RUSSIAN_FOODS, RUSSIAN_HOMES } from "./content.ru";
import { HOMES, type HomeId } from "./homes";
import { lookAlike, lookOf, PEEK_ITEMS, PEEK_LOOKALIKES } from "@/games/shadows/content";
import { GROW_MS, GROW_TEXTS, GROWTHS } from "./growth";
import { DEFAULT_ANIMALS_SETTINGS } from "./settings";
import { KIND_SIGNS } from "./TopicBubble";
import { ANIMAL_LEVELS, dealFeed, dealGift, dealGrow, dealHome, dealPeek, FIXED_LEVELS, KIND_ORDER, nextKind, type RoundKind } from "./levels";

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

test("the translated languages have words for every animal, every food and home, but none yet for those still German only", () => {
  const known = (list: string[], id: string) => !list.includes(id);
  for (const language of COMPLETE) {
    const { words } = ANIMAL_TRANSLATIONS[language]!;
    for (const { id } of ANIMALS) expect(words.animals[id] !== undefined, `${language} ${id}`).toBe(known(GERMAN_ONLY.animals, id));
    for (const { id } of FOODS) expect(words.foods[id] !== undefined, `${language} ${id}`).toBe(known(GERMAN_ONLY.foods, id));
    for (const id of Object.keys(HOMES) as HomeId[]) expect(words.homes[id] !== undefined, `${language} ${id}`).toBe(known(GERMAN_ONLY.homes, id));
  }
  // The list names only what there is.
  for (const id of GERMAN_ONLY.animals)
    expect(
      ANIMALS.some((a) => a.id === id),
      id,
    ).toBe(true);
  for (const id of GERMAN_ONLY.foods)
    expect(
      FOODS.some((f) => f.id === id),
      id,
    ).toBe(true);
  for (const id of GERMAN_ONLY.homes) expect(id in HOMES, id).toBe(true);
  for (const id of GERMAN_ONLY.gifts) expect(id in GIFTS, id).toBe(true);
  for (const id of GERMAN_ONLY.growths)
    expect(
      GROWTHS.some((g) => g.id === id),
      id,
    ).toBe(true);
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
        const shown = [...pairs.map(([sentence]) => sentence), texts.animal(animal)];
        for (const sentence of shown) expect(sentence, `${language} ${animal.id}`).not.toMatch(/[A-Za-zäöüß]/);
      }
    }
    if (OWN_SCRIPT.includes(language)) for (const word of stringsIn(words)) expect(word, language).not.toMatch(/[A-Za-z]/);
  }
});

// "Was gibt uns das Tier?" and "Was wird aus mir?": every sentence of every gift and small one in each translated language.
test("the gift and growth sentences are translated, and none in another script has Latin letters", () => {
  for (const language of COMPLETE) {
    const gift = GIFT_TEXTS[language]!;
    const grow = GROW_TEXTS[language]!;
    const shown: [string, string][] = [];
    // Those still German only say the whole German sentence (checked below).
    for (const animal of GIVERS.filter((a) => !GERMAN_ONLY.animals.includes(a.id) && !GERMAN_ONLY.gifts.includes(a.gives!))) {
      const given = GIFTS[animal.gives!];
      shown.push([gift.whatGives(animal), GIFT_TEXTS.de.whatGives(animal)]);
      shown.push([gift.gives(animal, given), GIFT_TEXTS.de.gives(animal, given)]);
      // A wrong gift names the animal it comes from (`giverOf`), the only one said after it.
      shown.push([gift.comesFrom(given, giverOf(given)), GIFT_TEXTS.de.comesFrom(given, giverOf(given))]);
      shown.push([gift.gift(given), GIFT_TEXTS.de.gift(given)]);
    }
    for (const growth of GROWTHS.filter((g) => !GERMAN_ONLY.growths.includes(g.id))) {
      for (const key of ["young", "adult", "whatBecomes", "becomes", "comesFrom"] as const) shown.push([grow[key](growth), GROW_TEXTS.de![key](growth)]);
    }
    for (const [sentence, de] of shown) {
      expect(sentence, language).not.toBe(de);
      if (OWN_SCRIPT.includes(language)) expect(sentence, language).not.toMatch(/[A-Za-zäöüß]/);
    }
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
    const giver = { ...GIVERS[0], id: "not-translated" };
    expect(GIFT_TEXTS[language]!.whatGives(giver), language).toBe(GIFT_TEXTS.de.whatGives(giver));
    const growth = { ...GROWTHS[0], id: "not-translated" as (typeof GROWTHS)[number]["id"] };
    expect(GROW_TEXTS[language]!.becomes(growth), language).toBe(GROW_TEXTS.de!.becomes(growth));
  }
});

// Grown-ups choose all kinds or exactly one, never a mix of some (user feedback, November 2026).
test("all kinds take turns in their order, or only the one chosen; no kind is switched on or off on its own", () => {
  const turns = (kinds: "all" | RoundKind) => {
    const played = [nextKind(null, kinds)];
    for (let i = 0; i < 6; i++) played.push(nextKind(played[played.length - 1], kinds));
    return played;
  };
  expect(turns("all")).toEqual(["peek", "feed", "gift", "home", "grow", "peek", "feed"]);
  expect(turns("home")).toEqual(["home", "home", "home", "home", "home", "home", "home"]);
  // One kind chosen while another plays: the next round is the chosen one.
  expect(nextKind("feed", "peek")).toBe("peek");
  expect(DEFAULT_ANIMALS_SETTINGS.kinds).toBe("all");
  for (const kind of KIND_ORDER) expect(kind in DEFAULT_ANIMALS_SETTINGS, kind).toBe(false);
  // The fixed difficulties are steps there are, easy to hard.
  expect(FIXED_LEVELS.easy).toBe(0);
  expect(FIXED_LEVELS.medium).toBeGreaterThan(FIXED_LEVELS.easy);
  expect(FIXED_LEVELS.hard).toBe(ANIMAL_LEVELS.length - 1);
});

test("the rounds take turns starting with who peeks out, and the steps only get harder", () => {
  expect(KIND_ORDER[0]).toBe("peek");
  expect(new Set(KIND_ORDER).size).toBe(5);
  ANIMAL_LEVELS.forEach((level, i) => {
    const before = ANIMAL_LEVELS[i - 1];
    expect(level.choices).toBeGreaterThanOrEqual(2);
    expect(level.choices).toBeLessThanOrEqual(4);
    expect(level.peek.choices).toBeLessThanOrEqual(5);
    if (!before) return;
    expect(level.choices).toBeGreaterThanOrEqual(before.choices);
    expect(level.peek.choices).toBeGreaterThanOrEqual(before.peek.choices);
    expect(level.peek.show).toBeLessThanOrEqual(before.peek.show);
    expect(before.peek.alike && !level.peek.alike).toBe(false);
  });
  // The easiest round comes first.
  expect(ANIMAL_LEVELS[0]).toMatchObject({ choices: 2, peek: { choices: 2, alike: false } });
});

test("every round offers exactly one right choice among as many as its step says", () => {
  for (const level of ANIMAL_LEVELS) {
    for (const animal of ANIMALS) {
      if (animal.food) {
        const r = dealFeed(animal, level.choices);
        expect(r.foods.length).toBe(level.choices);
        expect(new Set(r.foods.map((f) => f.id)).size).toBe(level.choices);
        expect(r.foods[r.correct]).toBe(animal.food);
        for (const f of r.foods) if (f !== animal.food) expect(animal.alsoEats, animal.id).not.toContain(f.id);
      }
      if (animal.home) {
        const r = dealHome(animal, level.choices);
        expect(r.homes.length).toBe(level.choices);
        expect(new Set(r.homes).size).toBe(level.choices);
        expect(r.homes[r.correct].id).toBe(animal.home);
        for (const h of r.homes) if (h.id !== animal.home) expect(animal.alsoLives, animal.id).not.toContain(h.id);
      }
    }
    for (const animal of GIVERS) {
      // There are only a few gifts: an animal that gives two gets as many as are left.
      const r = dealGift(animal, level.choices);
      expect(r.gifts.length).toBe(Math.min(level.choices, wrongGifts(animal).length + 1));
      expect(new Set(r.gifts).size).toBe(r.gifts.length);
      expect(r.gifts[r.correct].id).toBe(animal.gives!);
      for (const g of r.gifts) if (g.id !== animal.gives) expect(animal.alsoGives, animal.id).not.toContain(g.id);
    }
    for (const item of PEEK_ITEMS) {
      const choices = dealPeek(item, PEEK_ITEMS, level.peek);
      expect(choices.length).toBe(level.peek.choices);
      expect(new Set(choices).size).toBe(choices.length);
      expect(choices.filter((c) => c === item).length).toBe(1);
      // Easy steps offer animals that look quite different; harder ones as many alike as there are.
      const alike = choices.filter((c) => c !== item && lookOf(c) === lookOf(item)).length;
      const kin = PEEK_ITEMS.filter((c) => c !== item && lookOf(c) === lookOf(item) && !lookAlike(PEEK_LOOKALIKES, c, item)).length;
      expect(alike).toBe(level.peek.alike ? Math.min(kin, level.peek.choices - 1) : 0);
      // Exactly one fits: nothing whose peeking part looks like the hidden animal's is offered with it (X-14).
      for (const c of choices) expect(lookAlike(PEEK_LOOKALIKES, c, item), `${item.id} ${c.id}`).toBe(false);
    }
  }
});

// Exactly one choice may fit (rules in CLAUDE.md): every fed animal says what else it eats, and enough is left that it doesn't.
test("every fed animal has enough wrong foods that it really doesn't eat", () => {
  const most = Math.max(...ANIMAL_LEVELS.map((l) => l.choices)); // the most choices a step offers
  const foods = new Set(FOODS.map((f) => f.id));
  for (const animal of ANIMALS.filter((a) => a.food)) {
    expect(animal.alsoEats, `${animal.id} needs its alsoEats list`).toBeDefined();
    for (const id of animal.alsoEats!) {
      expect(foods.has(id), `${animal.id} ${id}`).toBe(true);
      expect(id, animal.id).not.toBe(animal.food!.id);
    }
    const wrong = wrongFoods(animal).map((f) => f.id);
    expect(wrong, animal.id).not.toContain(animal.food!.id);
    for (const id of animal.alsoEats!) expect(wrong, animal.id).not.toContain(id);
    expect(wrong.length, `${animal.id}: ${wrong.join(", ")}`).toBeGreaterThanOrEqual(most - 1);
  }
});

test("every animal with a home has enough wrong homes it really doesn't live in", () => {
  const most = Math.max(...ANIMAL_LEVELS.map((l) => l.choices)); // the most choices a step offers
  for (const animal of ANIMALS.filter((a) => a.home)) {
    expect(animal.alsoLives, `${animal.id} needs its alsoLives list`).toBeDefined();
    for (const id of animal.alsoLives!) {
      expect(id in HOMES, `${animal.id} ${id}`).toBe(true);
      expect(id, animal.id).not.toBe(animal.home!);
    }
    const wrong = wrongHomes(animal).map((h) => h.id);
    expect(wrong, animal.id).not.toContain(animal.home!);
    for (const id of animal.alsoLives!) expect(wrong, animal.id).not.toContain(id);
    expect(wrong.length, `${animal.id}: ${wrong.join(", ")}`).toBeGreaterThanOrEqual(most - 1);
  }
});

// A wrong home shows who lives there (the first animal with it as its home), so every home needs one; and the animal
// moving in sits inside the drawing, standing no lower than its ground.
test("every home has a resident to peek out, and the animal moving in fits inside it", () => {
  for (const home of Object.values(HOMES)) {
    expect(
      ANIMALS.some((a) => a.home === home.id),
      `${home.id} needs an animal living there`,
    ).toBe(true);
    const half = home.fit * 60;
    expect(home.spot[0] - half, home.id).toBeGreaterThanOrEqual(0);
    expect(home.spot[0] + half, home.id).toBeLessThanOrEqual(120);
    expect(home.spot[1] - half, home.id).toBeGreaterThanOrEqual(0);
    expect(home.spot[1] + half, home.id).toBeLessThanOrEqual(122);
  }
  // Two animals that look the same or share an id could not be told apart.
  expect(new Set(ANIMALS.map((a) => a.id)).size).toBe(ANIMALS.length);
  expect(new Set(ANIMALS.map((a) => a.emoji)).size).toBe(ANIMALS.length);
});

test("the German home sentences read right", () => {
  const de = ANIMAL_TEXTS.de;
  const by = (id: string) => ANIMALS.find((a) => a.id === id)!;
  expect(de.movedIn(by("hund"), HOMES.huette)).toBe("Juhu! Der Hund wohnt in der Hütte.");
  expect(de.movedIn(by("kamel"), HOMES.wueste)).toBe("Juhu! Das Kamel wohnt in der Wüste.");
  expect(de.movedIn(by("wal"), HOMES.meer)).toBe("Juhu! Der Wal wohnt im Meer.");
  expect(de.whereLives(by("fledermaus"))).toBe("Wo wohnt die Fledermaus?");
  expect(de.livesHere(by("biber"))).toBe("Nein, hier wohnt der Biber!");
});

test("every animal that gives us something says what else it gives, and enough is left to choose from", () => {
  for (const animal of GIVERS) {
    expect(animal.alsoGives, `${animal.id} needs its alsoGives list`).toBeDefined();
    for (const id of animal.alsoGives!) {
      expect(id in GIFTS, `${animal.id} ${id}`).toBe(true);
      expect(id, animal.id).not.toBe(animal.gives!);
    }
    const wrong = wrongGifts(animal).map((g) => g.id);
    for (const id of animal.alsoGives!) expect(wrong, animal.id).not.toContain(id);
    expect(wrong.length, animal.id).toBeGreaterThanOrEqual(2);
  }
  for (const gift of Object.values(GIFTS)) {
    // Every gift has an animal it comes from, which pops up when it is given to another, and that animal gives it.
    const giver = giverOf(gift);
    expect(giver, gift.id).toBeDefined();
    expect([giver.gives, ...(giver.alsoGives ?? [])], gift.id).toContain(gift.id);
    // Every gift is some animal's own, so it is also a right answer and its making (`.ap-made`) is seen.
    expect(
      GIVERS.some((a) => a.gives === gift.id),
      gift.id,
    ).toBe(true);
    // Every animal that gives it says so, in `gives` or `alsoGives`: the giver's own gift is never a wrong choice for it.
    for (const animal of GIVERS) if (animal !== giver && animal.gives === gift.id) expect(wrongGifts(animal), animal.id).not.toContain(gift);
  }
});

// The child tells the animals apart by their pictures: two with one emoji (a llama and an alpaca) would be one animal
// with two names.
test("no two animals share a picture", () => {
  const emojis = ANIMALS.map((a) => a.emoji);
  expect(emojis.filter((e, i) => emojis.indexOf(e) !== i)).toEqual([]);
});

test("the German gift sentences say „vom“ and „von der“ right", () => {
  const de = GIFT_TEXTS.de;
  const by = (id: string) => ANIMALS.find((a) => a.id === id)!;
  expect(de.whatGives(by("kuh"))).toBe("Was gibt uns die Kuh?");
  expect(de.gives(by("huhn"), GIFTS.ei)).toBe("Das Huhn gibt uns Eier. Danke!");
  expect(de.comesFrom(GIFTS.ei, by("huhn"))).toBe("Das Ei kommt vom Huhn!");
  expect(de.comesFrom(GIFTS.milch, by("kuh"))).toBe("Die Milch kommt von der Kuh!");
  expect(de.whatGives(by("ziege"))).toBe("Was gibt uns die Ziege?");
  expect(de.gives(by("ziege"), GIFTS.kaese)).toBe("Die Ziege gibt uns Käse. Danke!");
  expect(de.gives(by("lama"), GIFTS.wolle)).toBe("Das Lama gibt uns Wolle. Danke!");
  expect(de.comesFrom(GIFTS.kaese, giverOf(GIFTS.kaese))).toBe("Der Käse kommt von der Kuh!");
  expect(de.comesFrom(GIFTS.wolle, by("lama"))).toBe("Die Wolle kommt vom Lama!");
  // The best-known giver pops up: the hen's egg, not the duck's or the goose's.
  expect(giverOf(GIFTS.ei).id).toBe("huhn");
});

test("what the small one becomes is the one right choice, and the others become something else", () => {
  expect(new Set(GROWTHS.map((g) => g.id)).size).toBe(GROWTHS.length);
  expect(new Set(GROWTHS.map((g) => g.emoji)).size).toBe(GROWTHS.length);
  for (const level of ANIMAL_LEVELS) {
    for (const growth of GROWTHS) {
      const round = dealGrow(growth, level.choices);
      expect(round.grown.length).toBe(Math.min(level.choices, GROWTHS.length));
      expect(new Set(round.grown).size).toBe(round.grown.length);
      expect(round.grown.filter((g) => g === growth).length).toBe(1);
      expect(round.grown[round.correct]).toBe(growth);
    }
  }
  // What it becomes stands inside its box, and its sounds come while it grows.
  for (const g of GROWTHS) {
    for (const xy of g.spot) expect(xy, g.id).toBeGreaterThan(0);
    for (const xy of g.spot) expect(xy, g.id).toBeLessThan(200);
    for (const [ms] of g.sounds) expect(ms, g.id).toBeLessThan(GROW_MS);
  }
});

test("the German sentences of „Was wird aus mir?“ say „aus dem“ and „aus der“ right", () => {
  const de = GROW_TEXTS.de!;
  const byId = Object.fromEntries(GROWTHS.map((g) => [g.id, g]));
  expect(de.whatBecomes(byId.raupe)).toBe("Was wird aus der Raupe?");
  expect(de.becomes(byId.ei)).toBe("Aus dem Ei wird ein Küken. Toll!");
  expect(de.becomes(byId.samen)).toBe("Aus dem Samen wird eine Sonnenblume. Toll!");
  expect(de.comesFrom(byId.kaulquappe)).toBe("Der Frosch kommt aus der Kaulquappe!");
});

// The bubble's sign tells grown-ups what a round is about; were it one of the pictures to pick from, it would give the
// answer away or look like one more choice.
test("no round's sign is a picture the child picks from", () => {
  const pictures = new Set([...ANIMALS, ...FOODS, ...PEEK_ITEMS, ...GROWTHS].map((thing) => thing.emoji));
  expect(Object.values(KIND_SIGNS).filter((sign) => pictures.has(sign))).toEqual([]);
  expect(Object.keys(KIND_SIGNS).sort()).toEqual([...KIND_ORDER].sort());
});

// Two animals share a food by its id (cat and penguin both like fish): an animal added later writes it out again, and
// a different picture or name under the same id would show one food two ways, or say the wrong word.
test("a food shared by several animals looks and is named the same for each", () => {
  for (const animal of ANIMALS.filter((a) => a.food)) {
    const shared = FOODS.find((f) => f.id === animal.food!.id)!;
    expect(animal.food, animal.id).toEqual(shared);
  }
});
