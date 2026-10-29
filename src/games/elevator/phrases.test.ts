import { expect, test } from "bun:test";
import { LANGUAGE_STATUS, type LanguageState } from "@/content/ideas/languageStatus";
import { TARGET_LANGUAGES, type TargetLanguageId } from "@/content/targetLanguages";
import { STORIES, texts } from "./content";
import { PHRASEBOOKS } from "./phrases";
import { TRAIL_LEVELS } from "./trail/levels";
import type { Station, TrailLevel, Way } from "./trail/types";

// Translations come only on request, so a German sentence may lack its translation (it is said in German then);
// but nothing in a phrasebook is left over from a sentence that changed, and what is there is in its language.
// The languages translated so far have every sentence, except in a level that comes in German only so far: it has a
// part of its own in the language table (languageStatus.ts), which says which languages it speaks.

/** The German title and sentences of one trail level. */
function levelTexts(level: TrailLevel): string[] {
  const all = [level.title, level.away.say, level.finale.say];
  const station = (s: Station) => all.push(s.ask, s.done);
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
  return all;
}

/** A level's own part in the language table, its label ending in the level's title; none while it speaks what the
 * whole game speaks. */
const partOf = (level: TrailLevel) => LANGUAGE_STATUS.find((r) => r.href === "/kleine-abenteuer/")?.parts?.find((p) => p.label.endsWith(level.title));

/** Every German text of the stories and levels that is spoken or shown to grown-ups. */
function germanTexts(): string[] {
  const all: string[] = [...Object.values(texts)];
  for (const story of STORIES) {
    all.push(story.title, story.need.say);
    for (const step of story.steps) {
      all.push(step.ask, step.done);
      for (const task of step.tasks ?? []) {
        if (task.wish) all.push(task.wish.ask);
        if (task.done) all.push(task.done);
      }
    }
  }
  for (const level of TRAIL_LEVELS) all.push(...levelTexts(level));
  return all;
}

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

test("the translated languages have every sentence and title, but in levels the language table says lack them", () => {
  const all = [...new Set(germanTexts())];
  for (const language of COMPLETE) {
    const book = PHRASEBOOKS[language as keyof typeof PHRASEBOOKS] ?? {};
    const lacking = new Set(TRAIL_LEVELS.filter((level) => partOf(level) && !partOf(level)?.languages[language as TargetLanguageId]).flatMap(levelTexts));
    expect(
      all.filter((german) => !book[german] && !lacking.has(german)),
      language,
    ).toEqual([]);
  }
});

test("a level with its own part in the language table speaks exactly the languages all its sentences are in", () => {
  for (const level of TRAIL_LEVELS) {
    const part = partOf(level);
    if (!part) continue;
    const spoken = TARGET_LANGUAGES.filter(({ id }) => {
      if (id === "de") return true;
      const book = PHRASEBOOKS[id as keyof typeof PHRASEBOOKS];
      return !!book && levelTexts(level).every((german) => book[german]);
    });
    expect(part.languages, level.title).toEqual(Object.fromEntries(spoken.map(({ id }): [string, LanguageState] => [id, "done"])));
  }
});

test("sentences in another script are in its letters, with no Latin letters", () => {
  for (const [language, script] of Object.entries(SCRIPTS)) {
    for (const [german, text] of Object.entries(PHRASEBOOKS[language as keyof typeof PHRASEBOOKS] ?? {})) {
      expect({ german, own: script.test(text), latin: /[A-Za-z]/.test(text) }, language).toEqual({ german, own: true, latin: false });
    }
  }
});
