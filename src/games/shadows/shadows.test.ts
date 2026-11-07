import { expect, test } from "bun:test";
import type { TargetLanguageId } from "@/content/targetLanguages";
import {
  GERMAN_ONLY,
  ITEMS,
  lookAlike,
  lookOf,
  PEEK_ITEMS,
  PEEK_LOOKALIKES,
  PEEK_LOOKS,
  SHADOW_LOOKALIKES,
  SHADOW_TEXTS,
  SHADOW_TRANSLATIONS,
} from "./content";
import { GRID, pickPeepholes } from "./glyph";
import { RUSSIAN_NAMES } from "./content.ru";
import { dealPeek, dealShadows, nextLevel, PEEK_LEVELS, poseShadows, QUICK_STEPS, SHADOW_LEVELS, type ShadowLevel } from "./levels";

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

test("the translated languages name every picture, but none yet of those still German only", () => {
  for (const language of COMPLETE) {
    const { names } = SHADOW_TRANSLATIONS[language]!;
    for (const { id } of ITEMS) expect(names[id] !== undefined, `${language} ${id}`).toBe(!GERMAN_ONLY.includes(id));
  }
  // The list names only pictures there are, each once.
  const ids = new Set(ITEMS.map((i) => i.id));
  for (const id of GERMAN_ONLY) expect(ids.has(id), id).toBe(true);
  expect(new Set(GERMAN_ONLY).size).toBe(GERMAN_ONLY.length);
});

test("the sentences have no German left in them, and none in another script has Latin letters", () => {
  const de = SHADOW_TEXTS.de;
  for (const [language, { names }] of Object.entries(SHADOW_TRANSLATIONS) as [TargetLanguageId, { names: Record<string, unknown> }][]) {
    const texts = SHADOW_TEXTS[language]!;
    for (const item of ITEMS.filter((i) => names[i.id])) {
      const sentences = [texts.search(item), texts.found(item), texts.thatIs(item), texts.there(item)];
      sentences.forEach((sentence, i) => expect(sentence, `${language} ${item.id}`).not.toBe([de.search, de.found, de.thatIs, de.there][i](item)));
      if (OWN_SCRIPT.includes(language)) {
        for (const sentence of [...sentences, texts.name(item), texts.peek, texts.shadow(2)]) {
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

test("German sentences agree with plural names („Die Trauben suchen ihren Schatten“)", () => {
  const de = SHADOW_TEXTS.de;
  for (const item of ITEMS) {
    const plural = item.many === true;
    expect(de.search(item), item.id).toContain(plural ? " suchen " : " sucht ");
    expect(de.found(item), item.id).toContain(plural ? " haben " : " hat ");
    expect(de.thatIs(item), item.id).toStartWith(plural ? "Das sind " : "Das ist ");
    if (plural) expect(item.the, item.id).toStartWith("die ");
  }
  for (const id of ["trauben", "kirschen", "spaghetti", "handschuhe"]) expect(ITEMS.find((i) => i.id === id)?.many, id).toBe(true);
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

test("exactly one shadow fits: no shadow that looks like the picture's own is dealt with it (X-14)", () => {
  for (const level of SHADOW_LEVELS) {
    for (const item of ITEMS) {
      for (const pool of [ITEMS, ITEMS.filter((i) => i.theme === item.theme)]) {
        for (const s of dealShadows(item, pool, level)) expect(lookAlike(SHADOW_LOOKALIKES, s, item), `${item.id} ${s.id}`).toBe(false);
      }
    }
  }
});

test("the look-alike pairs name pictures that exist, each pair once", () => {
  for (const [pairs, pool] of [
    [SHADOW_LOOKALIKES, ITEMS],
    [PEEK_LOOKALIKES, PEEK_ITEMS],
  ] as const) {
    const ids = new Set(pool.map((i) => i.id));
    const seen = new Set<string>();
    for (const [a, b] of pairs) {
      expect(ids.has(a) && ids.has(b) && a !== b, `${a} ${b}`).toBe(true);
      const key = [a, b].sort().join(" ");
      expect(seen.has(key), key).toBe(false);
      seen.add(key);
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
  // How hard a step is to see: closer outlines, then turned, then mirrored, then under flaps; within one way, more shadows.
  const way = (l: ShadowLevel) => (l.covered ? 4 : 0) + (l.mirror ? 2 : l.turn ? 1 : 0);
  SHADOW_LEVELS.slice(1).forEach((level, i) => {
    const before = SHADOW_LEVELS[i];
    const more = level.shadows > before.shadows || (level.shadows === before.shadows && level.alike && !before.alike);
    expect(way(level) > way(before) || (way(level) === way(before) && more)).toBe(true);
  });
  expect(SHADOW_LEVELS[0]).toEqual({ shadows: 2, alike: false });
});

test("a new way to look (turned, under flaps) starts again with fewer shadows than the step before", () => {
  SHADOW_LEVELS.slice(1).forEach((level, i) => {
    const before = SHADOW_LEVELS[i];
    if ((level.covered && !before.covered) || (level.turn && !before.turn && !before.covered)) expect(level.shadows).toBeLessThan(before.shadows);
  });
});

test("turned shadows are plainly turned, mirrored steps show at least one mirrored, plain steps lie straight", () => {
  for (const level of SHADOW_LEVELS) {
    for (let k = 0; k < 50; k++) {
      const poses = poseShadows(level.shadows, level);
      expect(poses).toHaveLength(level.shadows);
      for (const { angle } of poses) {
        if (level.turn) expect(Math.abs(angle)).toBeGreaterThanOrEqual(level.turn / 2 - 0.5);
        expect(Math.abs(angle)).toBeLessThanOrEqual(level.turn ?? 0);
      }
      expect(poses.some((p) => p.flip)).toBe(!!level.mirror);
    }
  }
});

test("sure goes up, unsure goes down, never past the ends", () => {
  expect(nextLevel(0, [0])).toBe(0);
  expect(nextLevel(0, [0, 0])).toBe(1);
  expect(nextLevel(SHADOW_LEVELS.length - 1, [0, 0])).toBe(SHADOW_LEVELS.length - 1);
  expect(nextLevel(2, [1, 0])).toBe(2);
  expect(nextLevel(2, [2])).toBe(1);
  expect(nextLevel(2, [1])).toBe(2);
  expect(nextLevel(2, [1, 1])).toBe(1);
  expect(nextLevel(0, [3])).toBe(0);
});

test("the first steps are left after one sure picture, so a child who knows them soon reaches the harder ones", () => {
  const top = SHADOW_LEVELS.length - 1;
  expect(nextLevel(0, [0], top, QUICK_STEPS)).toBe(1);
  expect(nextLevel(QUICK_STEPS - 1, [0], top, QUICK_STEPS)).toBe(QUICK_STEPS);
  expect(nextLevel(QUICK_STEPS, [0], top, QUICK_STEPS)).toBe(QUICK_STEPS);
  expect(nextLevel(1, [2], top, QUICK_STEPS)).toBe(0);
  expect(QUICK_STEPS).toBeLessThan(SHADOW_LEVELS.findIndex((l) => l.turn));
});

test("every peeking animal looks like exactly one group of „Wer schaut da raus?“", () => {
  for (const item of PEEK_ITEMS) expect(PEEK_LOOKS.filter((ids) => ids.includes(item.id)).length, item.id).toBe(1);
  const ids = new Set(PEEK_ITEMS.map((i) => i.id));
  for (const id of PEEK_LOOKS.flat()) expect(ids.has(id), id).toBe(true);
});

test("peepholes lie on drawn cells and never overlap", () => {
  // A shape drawn only in its left half.
  const cover = Array.from({ length: GRID * GRID }, (_, i) => (i % GRID < 2 ? 1 : 0));
  for (let n = 0; n < 20; n++) {
    const holes = pickPeepholes(cover, 180, 180, 3, 60);
    expect(holes.length).toBeGreaterThan(0);
    for (const h of holes) expect(h.x).toBeLessThan(0.4);
    for (const a of holes) for (const b of holes) if (a !== b) expect(Math.hypot((a.x - b.x) * 180, (a.y - b.y) * 180)).toBeGreaterThanOrEqual(60);
  }
  expect(pickPeepholes(new Array(GRID * GRID).fill(0), 180, 180, 3, 60)).toEqual([]);
});

test("the steps of „Wer schaut da raus?“ only get harder, and every round offers exactly one right animal", () => {
  PEEK_LEVELS.forEach((level, i) => {
    const before = PEEK_LEVELS[i - 1];
    expect(level.choices).toBeLessThanOrEqual(5);
    if (before) {
      expect(level.choices).toBeGreaterThanOrEqual(before.choices);
      expect(level.show).toBeLessThanOrEqual(before.show);
      expect(before.alike && !level.alike).toBe(false);
    }
    for (const item of PEEK_ITEMS) {
      const choices = dealPeek(item, PEEK_ITEMS, level);
      expect(choices.length).toBe(level.choices);
      expect(new Set(choices).size).toBe(choices.length);
      expect(choices.filter((c) => c === item).length).toBe(1);
      // Easy steps offer animals that look quite different; harder ones as many alike as there are.
      const alike = choices.filter((c) => c !== item && lookOf(c) === lookOf(item)).length;
      const kin = PEEK_ITEMS.filter((c) => c !== item && lookOf(c) === lookOf(item) && !lookAlike(PEEK_LOOKALIKES, c, item)).length;
      expect(alike).toBe(level.alike ? Math.min(kin, level.choices - 1) : 0);
      // Exactly one fits: nothing whose peeking part looks like the hidden animal's is offered with it (X-14).
      for (const c of choices) expect(lookAlike(PEEK_LOOKALIKES, c, item), `${item.id} ${c.id}`).toBe(false);
    }
  });
  expect(PEEK_LEVELS[0]).toMatchObject({ choices: 2, alike: false });
});
