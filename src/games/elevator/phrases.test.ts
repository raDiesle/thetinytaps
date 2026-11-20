import { expect, test } from "bun:test";
import { targetLanguageFor } from "@/content/targetLanguages";
import { STORIES, texts } from "./content";
import { FILMS } from "./film/films";
import type { Film } from "./film/types";
import { PHRASEBOOKS, spokenIn, titleIn, translationOf } from "./phrases";
import { TRAIL_LEVELS } from "./trail/levels";
import type { Station, Way } from "./trail/types";

// Translations come only on request, so a German sentence may lack its translation (it is said in German then);
// but nothing in a phrasebook is left over from a sentence that changed, and what is there is in its language.
// The languages translated so far have every shared text, and every sentence of each story and level they have
// the title of: a new level comes in German only, and plays all in German until it is translated whole. A film written
// English first is keyed by its English text, and German has a phrasebook of those films alone.

/** Every line of a film along every way through it: the title first, then each scene's beats and choice, and the end. */
function filmTexts(film: Film): string[] {
  const all = [film.title];
  const walk = (picks: string[]) => {
    const scenes = film.scenes(picks);
    for (const scene of scenes) {
      for (const beat of scene.beats) for (const line of [beat.ask, beat.say]) if (line !== undefined) all.push(line);
      if (scene.choice) all.push(scene.choice.ask, ...scene.choice.options.map((o) => o.say));
    }
    const last = scenes[scenes.length - 1];
    if (last.choice) for (const o of last.choice.options) walk([...picks, o.id]);
  };
  walk([]);
  all.push(film.end);
  return [...new Set(all)];
}

/** The German texts of each story, level and film (its title first), and the shared ones under "". */
function germanTextsByPart(): Record<string, string[]> {
  const parts: Record<string, string[]> = { "": [...Object.values(texts)] };
  for (const story of STORIES) {
    const all = [story.title, story.need.say];
    for (const step of story.steps) {
      all.push(step.ask, step.done);
      for (const task of step.tasks ?? []) {
        if (task.wish) all.push(task.wish.ask);
        if (task.done) all.push(task.done);
      }
    }
    parts[story.title] = all;
  }
  for (const level of TRAIL_LEVELS) {
    const all = [level.title, level.away.say, level.finale.say];
    const station = (s: Station) => {
      all.push(s.ask, s.done);
      if (s.kind === "obstacle" && s.befriends) all.push(s.befriends.say);
    };
    const way = (w: Way) => {
      all.push(w.say);
      w.stations.forEach(station);
    };
    for (const s of level.stations) {
      if (s.kind === "fork") {
        all.push(s.ask);
        s.ways.forEach(way);
      } else station(s);
    }
    parts[level.title] = all;
  }
  for (const film of FILMS) parts[film.title] = filmTexts(film);
  return parts;
}

/** Every German text of the stories, levels and films that is spoken or shown to grown-ups. */
const germanTexts = () => Object.values(germanTextsByPart()).flat();

/** Each language's own letters; Latin-letter languages are only checked for being there and complete. */
const SCRIPTS: Record<string, RegExp> = { ru: /\p{Script=Cyrillic}/u, zh: /\p{Script=Han}/u, hi: /\p{Script=Devanagari}/u, ar: /\p{Script=Arabic}/u };

/** The languages translated whole so far. */
const COMPLETE = ["en", "zh", "hi", "es", "ar", "ru"];

test("no phrasebook has anything left over", () => {
  const used = new Set(germanTexts());
  for (const [language, book] of Object.entries(PHRASEBOOKS))
    expect(
      Object.keys(book ?? {}).filter((german) => !used.has(german)),
      language,
    ).toEqual([]);
});

test("the translated languages have the shared texts and every sentence of the stories and levels they have", () => {
  for (const language of COMPLETE) {
    const book = PHRASEBOOKS[language as keyof typeof PHRASEBOOKS] ?? {};
    for (const [title, all] of Object.entries(germanTextsByPart())) {
      if (title && !book[title]) continue;
      expect(
        all.filter((german) => !book[german]),
        `${language}: ${title || "shared texts"}`,
      ).toEqual([]);
    }
  }
});
test("sentences in another script are in its letters, with no Latin letters", () => {
  for (const [language, script] of Object.entries(SCRIPTS)) {
    for (const [german, text] of Object.entries(PHRASEBOOKS[language as keyof typeof PHRASEBOOKS] ?? {})) {
      expect({ german, own: script.test(text), latin: /[A-Za-z]/.test(text) }, language).toEqual({ german, own: true, latin: false });
    }
  }
});

test("an English-first line is said in English until it is translated, never in German", () => {
  const line = "A line nobody has translated yet.";
  expect(translationOf(line, "en", "en")).toBe(line);
  expect(translationOf(line, "de", "en")).toBeUndefined();
  expect(titleIn(line, "de", "en")).toBe(line);
  for (const id of ["de", "en", "ru"] as const) {
    const said = spokenIn(line, targetLanguageFor(id), "en");
    expect(said.text).toBe(line);
    expect(said.speechLang.startsWith("en")).toBe(true);
  }
});

test("German has only English-first films, each whole where it has the title", () => {
  const book = PHRASEBOOKS.de ?? {};
  const english = FILMS.filter((f) => f.first === "en");
  const theirs = new Set(english.flatMap(filmTexts));
  expect(Object.keys(book).filter((line) => !theirs.has(line))).toEqual([]);
  for (const film of english) {
    if (!book[film.title]) continue;
    expect(
      filmTexts(film).filter((line) => !book[line]),
      `de: ${film.title}`,
    ).toEqual([]);
    const said = spokenIn(film.title, targetLanguageFor("de"), "en");
    expect(said.speechLang.startsWith("de")).toBe(true);
  }
});
