import { describe, expect, test } from "@rstest/core";
import { SCENES } from ".";
import { assignKeys, SCENE_KEYS } from "./keys";
import { questsFor } from "./quests";
import { PLACES, ROADS } from "./roads";
import { placeBox, type SceneItem } from "./types";

// The checks from the neue-szene skill that need no browser: they run on the
// scene data alone, so a new or changed picture can't break them unnoticed.

/** The smallest tap area a finger must still hit; the skill aims for ~60. */
const MIN_TAP = 40;

const hitAreas = (item: SceneItem) => (item.hitAreas ?? [item.box]).map((box) => placeBox(box, item.place));

describe.each(SCENES.map((scene) => [scene.id, scene] as const))("scene %s", (_, scene) => {
  const ids = scene.items.map((item) => item.id);

  test("items have unique ascii ids", () => {
    expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  test("names have an article and every item says something", () => {
    for (const item of scene.items) {
      expect(item.name, item.id).toMatch(/^(der|die|das) /);
      expect(item.sentences.length, item.id).toBeGreaterThan(0);
    }
  });

  test("every item can be hit by a small finger", () => {
    for (const item of scene.items) {
      const biggest = Math.max(...hitAreas(item).map(([, , w, h]) => Math.min(w, h)));
      expect(biggest, item.id).toBeGreaterThanOrEqual(MIN_TAP);
    }
  });

  test("items stay inside the picture", () => {
    for (const item of scene.items) {
      for (const [x, y, w, h] of hitAreas(item)) {
        expect(x + w, item.id).toBeGreaterThan(0);
        expect(y + h, item.id).toBeGreaterThan(0);
        expect(x, item.id).toBeLessThan(scene.width);
        expect(y, item.id).toBeLessThan(scene.height);
      }
    }
  });

  test("animations have a sensible length", () => {
    for (const item of scene.items) {
      expect(item.durationMs, item.id).toBeGreaterThanOrEqual(500);
      expect(item.durationMs, item.id).toBeLessThanOrEqual(8000);
    }
  });

  test("chains only use items of the picture", () => {
    for (const chain of scene.chains ?? []) {
      expect(ids).toContain(chain.start);
      for (const step of chain.steps) expect(ids).toContain(step.item);
    }
  });

  test("every item gets a key and every key does something", () => {
    for (const item of scene.items) if (item.key) expect(SCENE_KEYS, item.id).toContain(item.key);
    const { byKey, keyOf } = assignKeys(scene.items);
    expect(keyOf.size).toBe(scene.items.length);
    for (const key of SCENE_KEYS) expect(byKey.get(key)?.length, key).toBeGreaterThan(0);
  });

  test("wished keys are not wished twice", () => {
    const wished = scene.items.flatMap((item) => (item.key ? [item.key] : []));
    expect(wished.filter((key, i) => wished.indexOf(key) !== i)).toEqual([]);
  });

  test("questions talk about the item with the right verb", () => {
    for (const mode of ["find", "questions"] as const) {
      for (const quest of questsFor(mode, scene)) {
        expect(quest.answers.length, quest.id).toBeGreaterThan(0);
        for (const item of quest.answers) {
          const praise = quest.praise(item);
          expect(praise.toLowerCase(), praise).toContain(item.name.toLowerCase());
          if (item.plural) expect(praise, praise).not.toMatch(/ (ist|war|kann|hat) /);
          else expect(praise, praise).not.toMatch(/ (sind|waren|können|haben) /);
        }
      }
    }
  });
});

test("scene ids are unique", () => {
  const ids = SCENES.map((scene) => scene.id);
  expect(new Set(ids).size).toBe(ids.length);
});

describe("roads between pictures", () => {
  test.each(ROADS.map((road) => [`${road.from}.${road.item} → ${road.to}`, road] as const))("%s", (_, road) => {
    const from = SCENES.find((scene) => scene.id === road.from);
    const to = SCENES.find((scene) => scene.id === road.to);
    expect(from?.items.map((item) => item.id)).toContain(road.item);
    expect(to).toBeDefined();
    expect(PLACES[road.from]).toBeDefined();
    expect(PLACES[road.to]).toBeDefined();
    const [x, y] = road.park;
    expect(x).toBeGreaterThan(0);
    expect(x).toBeLessThan(to!.width);
    expect(y).toBeLessThan(to!.height);
  });
});
