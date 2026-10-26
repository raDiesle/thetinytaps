import { expect, test } from "@rstest/core";
import { STORIES, texts } from "./content";
import { RU } from "./ru";
import { TRAIL_LEVELS } from "./trail/levels";
import type { Station, Way } from "./trail/types";

// Every German sentence the game speaks, and every title, has its Russian one in `ru.ts` – a missing one would
// be said in German in the Russian app – and nothing in `ru.ts` is left over from a sentence that changed.

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

test("every German sentence and title has its Russian one", () => {
  const missing = germanTexts().filter((german) => !RU[german]);
  expect(missing).toEqual([]);
});

test("the Russian phrasebook has nothing left over", () => {
  const used = new Set(germanTexts());
  expect(Object.keys(RU).filter((german) => !used.has(german))).toEqual([]);
});

test("the Russian sentences are Russian: Cyrillic, no Latin letters", () => {
  for (const [german, russian] of Object.entries(RU)) {
    expect({ german, cyrillic: /\p{Script=Cyrillic}/u.test(russian), latin: /[A-Za-z]/.test(russian) }).toEqual({ german, cyrillic: true, latin: false });
  }
});
