import { expect, test } from "bun:test";
import { STORIES, texts } from "./content";
import { PHRASEBOOKS } from "./phrases";
import { TRAIL_LEVELS } from "./trail/levels";
import type { Station, Way } from "./trail/types";

// Translations come only on request, so a German sentence may lack its translation (it is said in German then);
// but nothing in a phrasebook is left over from a sentence that changed, and what is there is in its language.
// The languages translated so far have every shared text, and every sentence of each story and level they have
// the title of: a new level comes in German only, and plays all in German until it is translated whole.

/** The German texts of each story and level (its title first), and the shared ones under "". */
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
  return parts;
}

/** Every German text of the stories and levels that is spoken or shown to grown-ups. */
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
