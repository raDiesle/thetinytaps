import { expect, test } from "bun:test";
import { STORIES, texts } from "./content";
import { PHRASEBOOKS } from "./phrases";
import { TRAIL_LEVELS } from "./trail/levels";
import type { Station, Way } from "./trail/types";

// Translations come only on request, so a German sentence may lack its translation (it is said in German then);
// but nothing in a phrasebook is left over from a sentence that changed, and what is there is in its language.
// The languages translated so far have every sentence – except in a level that came later in German only (its
// title has no translation yet), which is translated all at once when the grown-up asks for it.

/** Every German text of the stories and levels that is spoken or shown to grown-ups; `translatedOnly` leaves out the
 * levels whose title has no translation in `language` yet. */
function germanTexts(translatedOnly?: string): string[] {
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
  const station = (s: Station) => all.push(s.ask, s.done);
  const way = (w: Way) => {
    all.push(w.say);
    w.stations.forEach(station);
  };
  for (const level of TRAIL_LEVELS) {
    if (translatedOnly && !PHRASEBOOKS[translatedOnly as keyof typeof PHRASEBOOKS]?.[level.title]) continue;
    all.push(level.title, level.away.say, level.finale.say);
    for (const s of level.stations) {
      if (s.kind === "fork") {
        all.push(s.ask);
        s.ways.forEach(way);
      } else station(s);
    }
  }
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

test("the translated languages have every sentence and title, of every level translated into them", () => {
  for (const language of COMPLETE) {
    const all = [...new Set(germanTexts(language))];
    const book = PHRASEBOOKS[language as keyof typeof PHRASEBOOKS] ?? {};
    expect(
      all.filter((german) => !book[german]),
      language,
    ).toEqual([]);
  }
});

test("sentences in another script are in its letters, with no Latin letters", () => {
  for (const [language, script] of Object.entries(SCRIPTS)) {
    for (const [german, text] of Object.entries(PHRASEBOOKS[language as keyof typeof PHRASEBOOKS] ?? {})) {
      expect({ german, own: script.test(text), latin: /[A-Za-z]/.test(text) }, language).toEqual({ german, own: true, latin: false });
    }
  }
});
