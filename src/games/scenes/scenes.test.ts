import { describe, expect, test } from "@rstest/core";
import { isCyrillic, RUSSIAN_KEYBOARD_ROWS } from "@/lib/cyrillicKeys";
import { APP_LANGUAGES, pick } from "@/lib/language";
import { SCENES } from ".";
import { assignKeys, pressedKey, RUSSIAN_SCENE_KEYS, SCENE_KEYS, sceneKeysFor } from "./keys";
import { localizeScene, sceneLanguage } from "./localize";
import { SCENE_PHRASES } from "./phrases";
import { questsFor } from "./quests";
import { ROADS } from "./roads";
import { SCENE_TRANSLATIONS } from "./translations";
import { placeBox, type Scene, type SceneItem, type SceneTranslation } from "./types";

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
    for (const language of APP_LANGUAGES) {
      const { places } = pick(SCENE_PHRASES, language);
      expect(places[road.from], `${language} ${road.from}`).toBeDefined();
      expect(places[road.to], `${language} ${road.to}`).toBeDefined();
    }
    const [x, y] = road.park;
    expect(x).toBeGreaterThan(0);
    expect(x).toBeLessThan(to!.width);
    expect(y).toBeLessThan(to!.height);
  });
});

/** What is wrong with a scene's translation: missing or unknown items, empty sentences, chains of the wrong shape, grammar left out. */
function translationProblems(scene: Scene, translation: SceneTranslation): string[] {
  const problems: string[] = [];
  const ids = new Set(scene.items.map((item) => item.id));
  if (!translation.title.trim()) problems.push("no title");
  if (!translation.description.trim()) problems.push("no description");
  // Items and chains may be missing (translations come only on request; the picture then plays in German), what is there must be whole.
  for (const [id, words] of Object.entries(translation.items)) {
    if (!ids.has(id)) problems.push(`${id}: not an item of the scene`);
    if (!words.name.trim()) problems.push(`${id}: no name`);
    if (words.sentences.length === 0 || words.sentences.some((s) => !s.trim())) problems.push(`${id}: no sentence`);
    if (words.plural && words.gender) problems.push(`${id}: plural with a gender`);
    if (!words.plural && !words.gender) problems.push(`${id}: no gender`);
  }
  const chains = scene.chains ?? [];
  if ((translation.chains?.length ?? 0) > chains.length) problems.push(`chains: ${translation.chains?.length} instead of ${chains.length}`);
  chains.forEach((chain, c) => {
    const steps = translation.chains?.[c];
    if (steps?.length && steps.length !== chain.steps.length)
      problems.push(`chain ${c + 1} (${chain.start}): ${steps.length} steps instead of ${chain.steps.length}`);
    if (steps?.some((s) => !s.trim())) problems.push(`chain ${c + 1} (${chain.start}): empty step`);
  });
  return problems;
}

test("the Russian keys are exactly the letters of the Russian keyboard and the digits", () => {
  expect([...RUSSIAN_SCENE_KEYS].sort()).toEqual([...RUSSIAN_KEYBOARD_ROWS.join(""), "Ё", ..."1234567890"].sort());
});

describe("scene translations", () => {
  const translations = Object.entries(SCENE_TRANSLATIONS).flatMap(([sceneId, byLanguage]) =>
    Object.entries(byLanguage).map(([language, translation]) => ({ sceneId, language, translation: translation as SceneTranslation })),
  );

  test("belong to scenes, and what they translate is whole and has its grammar", () => {
    for (const { sceneId, language, translation } of translations) {
      const scene = SCENES.find((s) => s.id === sceneId);
      expect(scene, sceneId).toBeDefined();
      expect(translationProblems(scene!, translation), `${sceneId} ${language}`).toEqual([]);
    }
  });

  test("Russian names start with a Cyrillic letter, so keys mode can give them their own key", () => {
    for (const { sceneId, language, translation } of translations) {
      if (language !== "ru") continue;
      for (const [id, words] of Object.entries(translation.items)) expect(isCyrillic(words.name.charAt(0)), `${sceneId}.${id} „${words.name}“`).toBe(true);
    }
  });

  test("in every app language each scene gets a key for every item, and every key does something", () => {
    for (const language of APP_LANGUAGES) {
      for (const scene of SCENES) {
        const { byKey, keyOf } = assignKeys(localizeScene(scene, language).items, language);
        expect(keyOf.size, `${scene.id} ${language}`).toBe(scene.items.length);
        for (const key of sceneKeysFor(language)) expect(byKey.get(key)?.length, `${scene.id} ${language} ${key}`).toBeGreaterThan(0);
      }
    }
  });

  test("every language has the engine's sentences for every trait and every picture a vehicle drives to", () => {
    for (const language of APP_LANGUAGES) {
      const words = pick(SCENE_PHRASES, language);
      expect(Object.keys(words.traits).sort(), language).toEqual(Object.keys(SCENE_PHRASES.de.traits).sort());
      expect(Object.keys(words.places).sort(), language).toEqual(Object.keys(SCENE_PHRASES.de.places).sort());
    }
  });
});

/** A made-up Russian translation of part of the Baustelle, to try the engine before (and besides) the real ones. */
describe("a scene in Russian (fixture)", () => {
  const baustelle = SCENES.find((s) => s.id === "baustelle")!;
  const [first, second] = baustelle.items;
  const fixture: SceneTranslation = {
    title: "Стройка",
    description: "Машины работают.",
    items: {
      ...Object.fromEntries(baustelle.items.map((item, i) => [item.id, { name: `предмет ${i}`, sentences: ["Привет!"], gender: "m" as const }])),
      [first.id]: { name: "экскаватор", sentences: ["Экскаватор копает!"], gender: "m" },
      [second.id]: { name: "санки", sentences: ["Санки едут!"], plural: true },
    },
    chains: baustelle.chains?.map((chain) => chain.steps.map((_, i) => `Шаг ${i + 1}`)),
  };
  /** The fixture with its last item left out: the picture is not translated completely. */
  const partial: SceneTranslation = { ...fixture, items: Object.fromEntries(Object.entries(fixture.items).slice(0, -1)) };

  // The fixture goes in for these tests only and comes out again, so the real translations stay as they are.
  const before = SCENE_TRANSLATIONS.baustelle;
  const withFixture = (translation = fixture) => {
    SCENE_TRANSLATIONS.baustelle = { ...before, ru: translation };
    try {
      return { scene: localizeScene({ ...baustelle }, "ru"), language: sceneLanguage("baustelle", "ru") };
    } finally {
      if (before) SCENE_TRANSLATIONS.baustelle = before;
      else delete SCENE_TRANSLATIONS.baustelle;
    }
  };

  test("a completely translated picture has Russian items, title and chains", () => {
    const { scene, language } = withFixture();
    expect(language).toBe("ru");
    expect(scene.title).toBe("Стройка");
    expect(scene.items[0].name).toBe("экскаватор");
    expect(scene.items[1].plural).toBe(true);
    if (baustelle.chains?.length) expect(scene.chains?.[0].steps[0].sentence).toBe("Шаг 1");
    expect(localizeScene(baustelle, "de")).toBe(baustelle);
  });

  test("a picture missing one item plays entirely in German", () => {
    const { scene, language } = withFixture(partial);
    expect(language).toBe("de");
    expect(scene.title).toBe(baustelle.title);
    expect(scene.items[0].name).toBe(first.name);
  });

  test("questions and praise follow the Russian grammar of the name", () => {
    const { scene } = withFixture();
    const [find] = questsFor("find", scene, "ru");
    expect(find.question).toBe("Где экскаватор?");
    expect(find.praise(scene.items[0])).toBe("Вот экскаватор!");
    const { traits } = SCENE_PHRASES.ru!;
    expect(traits.red.praise(scene.items[0])).toBe("Экскаватор красный!");
    expect(traits.red.praise(scene.items[1])).toBe("Санки красные!");
    expect(traits.red.praise({ ...scene.items[0], gender: "f" })).toBe("Экскаватор красная!");
    expect(traits.flies.praise(scene.items[1])).toBe("Санки летают!");
  });

  test("keys mode gives the first Cyrillic letter and counts a German keyboard's keys as Russian", () => {
    const { keyOf } = assignKeys(withFixture().scene.items, "ru");
    expect(keyOf.get(first.id)).toBe("Э");
    expect(keyOf.get(second.id)).toBe("С");
    for (const key of keyOf.values()) expect(RUSSIAN_SCENE_KEYS).toContain(key);
    // "Э" sits on the German "Ä" key, "Ё" left of 1.
    expect(pressedKey({ key: "ä", code: "Quote" }, "ru")).toBe("Э");
    expect(pressedKey({ key: "^", code: "Backquote" }, "ru")).toBe("Ё");
    expect(pressedKey({ key: "3", code: "Digit3" }, "ru")).toBe("3");
    expect(pressedKey({ key: "b", code: "KeyB" }, "de")).toBe("B");
  });
});
