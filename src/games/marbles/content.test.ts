import { describe, expect, test } from "bun:test";
import type { Localized } from "@/lib/language";
import { buildBath } from "./bath";
import { buildBuilding } from "./building";
import { buildCircus } from "./circus";
import { GAME_TITLE, LEVEL_TEXTS } from "./content";
import { buildGarden } from "./garden";
import { buildKitchen } from "./kitchen";
import { buildLight } from "./light";
import { buildMachine } from "./machine";
import { buildNight } from "./night";
import { buildSpace } from "./space";
import { buildWater } from "./water";

// Translations come only on request, so a text may be German alone (it is said in German then); but the German is
// always there, a Russian, Chinese, Hindi or Arabic one is in its own script, and one with Russian has en, zh, hi, es and ar too.
// The other languages that are written in their own script: no Latin letter may slip into them.
const SCRIPTS = {
  ru: /^[^A-Za-z]*\p{Script=Cyrillic}[^A-Za-z]*$/u,
  zh: /^[^A-Za-z]*\p{Script=Han}[^A-Za-z]*$/u,
  hi: /^[^A-Za-z]*\p{Script=Devanagari}[^A-Za-z]*$/u,
  ar: /^[^A-Za-z]*\p{Script=Arabic}[^A-Za-z]*$/u,
} as const;
const complete = (text: Localized) =>
  text.de.trim().length > 0 &&
  Object.entries(SCRIPTS).every(([id, script]) => {
    const own = text[id as keyof typeof SCRIPTS];
    return own === undefined || script.test(own);
  }) &&
  // A text translated is translated into all of them (October 2026); a new German-only line has none yet.
  (text.ru === undefined || (["en", "zh", "hi", "es", "ar"] as const).every((id) => (text[id] ?? "").trim().length > 0));

describe("Kettenreaktion texts", () => {
  test("the title and every level's name and first line have their German, and their translations are complete and in their own script", () => {
    expect(complete(GAME_TITLE)).toBe(true);
    for (const [id, { name, intro }] of Object.entries(LEVEL_TEXTS)) {
      expect({ id, name: complete(name), intro: complete(intro) }).toEqual({ id, name: true, intro: true });
    }
  });

  test("every line a machine or the Wasserbahn says has its German, and its translations are complete and in their own script", () => {
    const water = { events: buildWater().stretches.flatMap((s) => s.events) };
    const machines = {
      buildMachine,
      buildKitchen,
      buildGarden,
      buildBuilding,
      buildCircus,
      buildSpace,
      buildLight,
      buildBath,
      buildNight,
      buildWater: () => water,
    };
    for (const [name, build] of Object.entries(machines)) {
      const lines = build().events.flatMap((e) => (e.say ? [e.say] : []));
      expect({ name, said: lines.length > 0 }).toEqual({ name, said: true });
      for (const line of lines) expect({ name, line, complete: complete(line) }).toEqual({ name, line, complete: true });
    }
  });
});
