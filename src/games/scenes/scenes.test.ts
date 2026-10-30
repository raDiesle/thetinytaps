import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { ARABIC_KEYBOARD_ROWS } from "@/lib/arabicKeys";
import { RUSSIAN_KEYBOARD_ROWS } from "@/lib/cyrillicKeys";
import { HINDI_KEYBOARD_ROWS } from "@/lib/devanagariKeys";
import { pick } from "@/lib/language";
import { SCENES } from ".";
import { ARABIC_SCENE_KEYS, assignKeys, HINDI_SCENE_KEYS, pressedKey, RUSSIAN_SCENE_KEYS, SCENE_KEYS, sceneKeysFor } from "./keys";
import { localizeScene, sceneLanguage } from "./localize";
import { SCENE_PHRASES } from "./phrases";
import { questsFor } from "./quests";
import { ROADS } from "./roads";
import { spotAt } from "./spots";
import { SCENE_TRANSLATIONS } from "./translations";
import { placeBox, type Scene, type SceneItem, type SceneItemTranslation, type SceneTranslation } from "./types";

// The checks from the neue-szene skill that need no browser: they run on the
// scene data alone, so a new or changed picture can't break them unnoticed.

/** The smallest tap area a finger must still hit; the skill aims for ~60. */
const MIN_TAP = 40;

/** Things in a background that move when tapped (`<Poke>`, clouds), at least. */
const MIN_POKES = 5;

/** Every language the engine speaks (phrases.ts), German first. */
const LANGUAGES = Object.keys(SCENE_PHRASES) as TargetLanguageId[];

/** The script each language's names and sentences are written in, where it is not Latin: no Latin letter may slip in there. */
const SCRIPTS: Partial<Record<TargetLanguageId, RegExp>> = {
  ru: /\p{Script=Cyrillic}/u,
  zh: /\p{Script=Han}/u,
  hi: /\p{Script=Devanagari}/u,
  ar: /\p{Script=Arabic}/u,
};

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

  test("every tap on the background brings something out: the spots cover the whole picture", () => {
    expect(scene.spots.length).toBeGreaterThan(0);
    for (const spot of scene.spots) expect(spot.kinds.length).toBeGreaterThan(0);
    const uncovered: string[] = [];
    for (let y = 0; y <= scene.height; y += 10) {
      for (let x = 0; x <= scene.width; x += 10) if (spotAt(scene.spots, scene.width, scene.height, x, y) < 0) uncovered.push(`${x},${y}`);
    }
    expect(uncovered.slice(0, 5)).toEqual([]);
  });

  test("things in the background move when tapped, and a moving group has no transform of its own", () => {
    const markup = renderToStaticMarkup(createElement("svg", null, createElement(scene.Background)));
    expect(markup.match(/data-poke=/g)?.length ?? 0).toBeGreaterThanOrEqual(MIN_POKES);
    // The movement is a CSS transform, which would replace the group's own transform attribute.
    expect(markup.match(/<g[^>]*data-poke=[^>]*>/g)?.filter((tag) => / transform=/.test(tag)) ?? []).toEqual([]);
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
    for (const language of LANGUAGES) {
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

/**
 * The grammar each language's names need (see phrases.ts): Russian a gender or `plural`; Spanish, Hindi and Arabic
 * always a gender, plurals too; English only `plural`; Chinese nothing.
 */
function grammarProblem(language: string, words: SceneItemTranslation): string | undefined {
  switch (language) {
    case "ru":
      if (words.plural && words.gender) return "plural with a gender";
      if (!words.plural && !words.gender) return "no gender";
      return undefined;
    case "es":
    case "hi":
    case "ar":
      return words.gender === "m" || words.gender === "f" ? undefined : "no gender (m or f)";
    case "en":
      return words.gender ? "a gender" : undefined;
    case "zh":
      return words.gender || words.plural ? "a gender or plural" : undefined;
    default:
      return undefined;
  }
}

/** What is wrong with a scene's translation: missing or unknown items, empty sentences, chains of the wrong shape, grammar left out. */
function translationProblems(scene: Scene, translation: SceneTranslation, language: string): string[] {
  const problems: string[] = [];
  const ids = new Set(scene.items.map((item) => item.id));
  if (!translation.title.trim()) problems.push("no title");
  if (!translation.description.trim()) problems.push("no description");
  // Items and chains may be missing (translations come only on request; the picture then plays in German), what is there must be whole.
  for (const [id, words] of Object.entries(translation.items)) {
    if (!ids.has(id)) problems.push(`${id}: not an item of the scene`);
    if (!words.name.trim()) problems.push(`${id}: no name`);
    if (words.sentences.length === 0 || words.sentences.some((s) => !s.trim())) problems.push(`${id}: no sentence`);
    const grammar = grammarProblem(language, words);
    if (grammar) problems.push(`${id}: ${grammar}`);
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

test("the Russian, Hindi and Arabic keys are exactly the letters of their keyboard and the digits", () => {
  expect([...RUSSIAN_SCENE_KEYS].sort()).toEqual([...RUSSIAN_KEYBOARD_ROWS.join(""), "Ё", ..."1234567890"].sort());
  expect([...HINDI_SCENE_KEYS].sort()).toEqual([...HINDI_KEYBOARD_ROWS.join(""), ..."1234567890"].sort());
  expect([...ARABIC_SCENE_KEYS].sort()).toEqual([...ARABIC_KEYBOARD_ROWS.join(""), ..."1234567890"].sort());
});

describe("scene translations", () => {
  const translations = Object.entries(SCENE_TRANSLATIONS).flatMap(([sceneId, byLanguage]) =>
    Object.entries(byLanguage).map(([language, translation]) => ({ sceneId, language, translation: translation as SceneTranslation })),
  );

  test("belong to scenes, and what they translate is whole and has its grammar", () => {
    for (const { sceneId, language, translation } of translations) {
      const scene = SCENES.find((s) => s.id === sceneId);
      expect(scene, sceneId).toBeDefined();
      expect(translationProblems(scene!, translation, language), `${sceneId} ${language}`).toEqual([]);
    }
  });

  test("names start with a letter of their language, so keys mode can give them their own key", () => {
    for (const { sceneId, language, translation } of translations) {
      const script = SCRIPTS[language as TargetLanguageId] ?? /\p{Script=Latin}/u;
      for (const [id, words] of Object.entries(translation.items))
        expect(script.test(words.name.charAt(0)), `${sceneId}.${id} ${language} „${words.name}“`).toBe(true);
    }
  });

  test("names come without the article the engine adds (English, Spanish)", () => {
    for (const { sceneId, language, translation } of translations) {
      const article = language === "en" ? /^(the|a|an) /i : language === "es" ? /^(el|la|los|las|un|una) /i : undefined;
      if (!article) continue;
      for (const [id, words] of Object.entries(translation.items)) expect(words.name, `${sceneId}.${id} ${language}`).not.toMatch(article);
    }
  });

  test("Russian, Chinese, Hindi and Arabic say no Latin letters: names, sentences, chains, title", () => {
    for (const { sceneId, language, translation } of translations) {
      if (!SCRIPTS[language as TargetLanguageId]) continue;
      const lines = [
        translation.title,
        translation.description,
        ...Object.values(translation.items).flatMap((words) => [words.name, ...words.sentences]),
        ...(translation.chains ?? []).flat(),
      ];
      expect(
        lines.filter((line) => /[A-Za-z]/.test(line)),
        `${sceneId} ${language}`,
      ).toEqual([]);
    }
  });

  test("in every language each scene gets a key for every item, and every key does something", () => {
    for (const language of LANGUAGES) {
      for (const scene of SCENES) {
        const { byKey, keyOf } = assignKeys(localizeScene(scene, language).items, language, scene.id);
        expect(keyOf.size, `${scene.id} ${language}`).toBe(scene.items.length);
        for (const key of sceneKeysFor(language)) expect(byKey.get(key)?.length, `${scene.id} ${language} ${key}`).toBeGreaterThan(0);
      }
    }
  });

  test("every language has the engine's sentences for every trait and every picture a vehicle drives to", () => {
    for (const language of LANGUAGES) {
      const words = pick(SCENE_PHRASES, language);
      expect(Object.keys(words.traits).sort(), language).toEqual(Object.keys(SCENE_PHRASES.de.traits).sort());
      expect(Object.keys(words.places).sort(), language).toEqual(Object.keys(SCENE_PHRASES.de.places).sort());
    }
  });

  test("the engine's sentences in Russian, Chinese, Hindi and Arabic have no Latin letters", () => {
    for (const language of LANGUAGES) {
      if (!SCRIPTS[language]) continue;
      const words = pick(SCENE_PHRASES, language);
      const item = { ...SCENES[0].items[0], name: "…" };
      const place = Object.values(words.places)[0];
      const lines = [
        ...Object.values(words.prompts),
        ...Object.values(words.colourPrompts),
        ...words.praise,
        words.allColoured,
        words.allFound,
        words.goodNight,
        words.peekaboo("…"),
        words.whereIs(item),
        words.hereIs(item),
        words.thatIs(item, "…"),
        ...Object.values(words.traits).flatMap((trait) => [trait.question, trait.praise(item), trait.part ?? ""]),
        ...Object.values(words.places).flatMap((p) => [p.to, p.from, p.at]),
        words.backHome(item, place),
        words.comesFrom(item, place),
        words.drivesTo(item, place),
        words.follow(item),
        words.of(1, 2),
        words.foundCount(1),
        words.discoveredCount(1, 2),
        words.spaceBar,
        words.rotate,
      ];
      expect(
        lines.filter((line) => /[A-Za-z]/.test(line)),
        language,
      ).toEqual([]);
    }
  });

  test("questions and praise name the item in every language a picture is translated into", () => {
    for (const language of LANGUAGES) {
      for (const scene of SCENES) {
        if (sceneLanguage(scene.id, language) !== language) continue;
        const localized = localizeScene(scene, language);
        for (const mode of ["find", "questions"] as const) {
          for (const quest of questsFor(mode, localized, language)) {
            for (const item of quest.answers) {
              const praise = quest.praise(item);
              expect(praise.toLowerCase(), `${scene.id} ${language}`).toContain(item.name.toLowerCase());
            }
          }
        }
      }
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

/** The engine's sentences with made-up items, one grammar case each: articles, agreement, plurals. */
describe("the engine's grammar in other languages", () => {
  const base = SCENES[0].items[0];
  const item = (name: string, gender?: "m" | "f", plural?: boolean): SceneItem => ({ ...base, name, gender, plural });

  test("English adds “the” and follows the plural", () => {
    const { whereIs, traits, comesFrom, places } = SCENE_PHRASES.en!;
    expect(whereIs(item("bus"))).toBe("Where is the bus?");
    expect(whereIs(item("chicks", undefined, true))).toBe("Where are the chicks?");
    expect(traits.red.praise(item("bus"))).toBe("The bus is red!");
    expect(traits.wheels.praise(item("trucks", undefined, true))).toBe("The trucks have wheels!");
    expect(traits.flies.praise(item("Santa Claus"))).toBe("Santa Claus can fly!");
    expect(whereIs(item("Christmas tree"))).toBe("Where is the Christmas tree?");
    expect(whereIs(item("T. rex"))).toBe("Where is the T. rex?");
    expect(comesFrom(item("bus"), places.zoo)).toBe("Here comes the bus from the zoo!");
  });

  test("Spanish picks el / la / los / las and agrees the adjective", () => {
    const { whereIs, traits, follow } = SCENE_PHRASES.es!;
    expect(whereIs(item("grúa", "f"))).toBe("¿Dónde está la grúa?");
    expect(whereIs(item("pollitos", "m", true))).toBe("¿Dónde están los pollitos?");
    expect(traits.red.praise(item("grúa", "f"))).toBe("¡La grúa es roja!");
    expect(traits.small.praise(item("flores", "f", true))).toBe("¡Las flores son muy pequeñas!");
    expect(traits.yellow.praise(item("agua", "f"))).toBe("¡El agua es amarilla!");
    expect(follow(item("tractor", "m"))).toBe("Seguir al tractor");
  });

  test("Hindi agrees adjectives and verbs with gender and plural", () => {
    const { hereIs, traits } = SCENE_PHRASES.hi!;
    expect(hereIs(item("हाथी", "m"))).toBe("यह रहा हाथी!");
    expect(hereIs(item("गाय", "f"))).toBe("यह रही गाय!");
    expect(traits.yellow.praise(item("केला", "m"))).toBe("केला पीला है!");
    expect(traits.yellow.praise(item("चूज़े", "m", true))).toBe("चूज़े पीले हैं!");
    expect(traits.flies.praise(item("तितली", "f"))).toBe("तितली उड़ सकती है!");
  });

  test("Arabic agrees with gender, things in the plural as feminine, people in the plural as masculine plural", () => {
    const { traits, comesFrom, places } = SCENE_PHRASES.ar!;
    expect(traits.red.praise(item("الحافلة", "f"))).toBe("الحافلة حمراء!");
    expect(traits.red.praise(item("الجرار", "m"))).toBe("الجرار أحمر!");
    expect(traits.small.praise(item("الكتاكيت", "f", true))).toBe("الكتاكيت صغيرة جدا!");
    expect(traits.small.praise(item("الأطفال", "m", true))).toBe("الأطفال صغار جدا!");
    expect(comesFrom(item("الأطفال", "m", true), places.zoo)).toBe("يأتي الأطفال من حديقة الحيوان!");
  });

  test("Chinese says the bare name", () => {
    expect(SCENE_PHRASES.zh!.whereIs(item("公交车"))).toBe("公交车在哪里？");
  });

  test("keys mode: first letters in every script, a Hindi letter on Shift counts without it", () => {
    const keyOf = (name: string, language: TargetLanguageId) => assignKeys([item(name)], language).keyOf.get(base.id);
    expect(keyOf("árbol", "es")).toBe("A");
    expect(keyOf("ñu", "es")).toBe("N");
    expect(keyOf("excavator", "en")).toBe("E");
    expect(keyOf("खरगोश", "hi")).toBe("क");
    expect(keyOf("ज़ेबरा", "hi")).toBe("ज");
    expect(keyOf("ऊँट", "hi")).toBe("ऊ");
    expect(keyOf("الحافلة", "ar")).toBe("ح");
    expect(keyOf("الأسد", "ar")).toBe("ا");
    expect(keyOf("سيارة الإطفاء", "ar")).toBe("س");
    // Chinese plays on the German keys: the German name's first letter (or the wished key).
    const german = SCENES[0].items.find((i) => !i.key)!;
    const zh = assignKeys([{ ...german, name: "…" }], "zh", SCENES[0].id).keyOf.get(german.id);
    expect(zh).toBe(assignKeys([german], "de").keyOf.get(german.id));

    expect(pressedKey({ key: "k", code: "KeyK" }, "hi")).toBe("क");
    expect(pressedKey({ key: "K", code: "KeyK", shiftKey: true }, "hi")).toBe("क");
    expect(pressedKey({ key: "ख", code: "KeyK" }, "hi")).toBe("क");
    expect(pressedKey({ key: "३", code: "Digit3" }, "hi")).toBe("3");
    expect(pressedKey({ key: "h", code: "KeyH" }, "ar")).toBe("ا");
    expect(pressedKey({ key: "أ", code: "KeyH" }, "ar")).toBe("ا");
    expect(pressedKey({ key: "ñ", code: "Semicolon" }, "es")).toBe("N");
    expect(pressedKey({ key: "a", code: "KeyA" }, "en")).toBe("A");
  });
});
