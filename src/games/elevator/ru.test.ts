import { expect, test } from "bun:test";
import { STORIES, texts } from "./content";
import { RU } from "./ru";
import { TRAIL_LEVELS } from "./trail/levels";
import type { Station, Way } from "./trail/types";

// Translations come only on request, so a German sentence may lack its Russian one (it is said in German then);
// but nothing in `ru.ts` is left over from a sentence that changed, and what is there is Russian.

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
  const station = (s: Station) => all.push(s.ask, s.done);
  const way = (w: Way) => {
    all.push(w.say);
    w.stations.forEach(station);
  };
  for (const level of TRAIL_LEVELS) {
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

test("the Russian phrasebook has nothing left over", () => {
  const used = new Set(germanTexts());
  expect(Object.keys(RU).filter((german) => !used.has(german))).toEqual([]);
});

test("the Russian sentences are Russian: Cyrillic, no Latin letters", () => {
  for (const [german, russian] of Object.entries(RU)) {
    expect({ german, cyrillic: /\p{Script=Cyrillic}/u.test(russian), latin: /[A-Za-z]/.test(russian) }).toEqual({ german, cyrillic: true, latin: false });
  }
});
