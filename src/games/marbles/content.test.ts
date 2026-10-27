import { describe, expect, test } from "bun:test";
import type { Localized } from "@/lib/language";
import { buildBuilding } from "./building";
import { buildCircus } from "./circus";
import { ALL_LEVELS, GAME_TITLE, LEVEL_TEXTS } from "./content";
import { buildGarden } from "./garden";
import { buildKitchen } from "./kitchen";
import { buildLight } from "./light";
import { buildMachine } from "./machine";
import { buildSpace } from "./space";
import { buildWater } from "./water";

// Translations come only on request, so a text may be German alone (it is said in German then); but the German is
// always there, and a Russian one that is there is Russian.
const complete = (text: Localized) => text.de.trim().length > 0 && (text.ru === undefined || /^[^A-Za-z]*\p{Script=Cyrillic}[^A-Za-z]*$/u.test(text.ru));

describe("Kettenreaktion texts", () => {
  test("the title and every level's name and first line have their German, and a Russian one is Russian", () => {
    expect(complete(GAME_TITLE)).toBe(true);
    expect(complete(ALL_LEVELS)).toBe(true);
    for (const [id, { name, intro }] of Object.entries(LEVEL_TEXTS)) {
      expect({ id, name: complete(name), intro: complete(intro) }).toEqual({ id, name: true, intro: true });
    }
  });

  test("every line a machine or the Wasserbahn says has its German, and a Russian one is Russian", () => {
    const water = { events: buildWater().stretches.flatMap((s) => s.events) };
    const machines = { buildMachine, buildKitchen, buildGarden, buildBuilding, buildCircus, buildSpace, buildLight, buildWater: () => water };
    for (const [name, build] of Object.entries(machines)) {
      const lines = build().events.flatMap((e) => (e.say ? [e.say] : []));
      expect({ name, said: lines.length > 0 }).toEqual({ name, said: true });
      for (const line of lines) expect({ name, line, complete: complete(line) }).toEqual({ name, line, complete: true });
    }
  });
});
