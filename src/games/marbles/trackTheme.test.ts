import { describe, expect, test } from "bun:test";
import { LEVEL_TEXTS } from "./content";
import { SITE_TRACK } from "./siteTrack";
import { SLIDE_TRACK } from "./slideTrack";
import { SNOW_TRACK } from "./snowTrack";
import { SPACE_TRACK } from "./spaceTrack";
import { BASKET_FULL, TRACK_H, TRACK_W } from "./track";
import { WOODEN } from "./TrackLevel";

const WORLDS = [WOODEN, SNOW_TRACK, SPACE_TRACK, SLIDE_TRACK, SITE_TRACK];

describe("marble run worlds", () => {
  test("each world is a level of its own, with a name and a first line", () => {
    expect(new Set(WORLDS.map((w) => w.level)).size).toBe(WORLDS.length);
    for (const w of WORLDS) {
      expect(LEVEL_TEXTS[w.level].name.de).toBeTruthy();
      expect(LEVEL_TEXTS[w.level].intro.de).toBeTruthy();
      expect(w.full.de).toBeTruthy();
    }
  });

  test("each world has its own animals to look out of the tunnel", () => {
    for (const w of WORLDS) {
      expect(w.peekers.length).toBeGreaterThanOrEqual(2);
      expect(new Set(w.peekers).size).toBe(w.peekers.length);
    }
  });

  test("where things land stays on the wall", () => {
    for (const w of WORLDS) {
      if (!w.landAt) continue;
      for (let i = 0; i < BASKET_FULL + 2; i++) {
        const p = w.landAt(i);
        expect(p.x).toBeGreaterThan(0);
        expect(p.x).toBeLessThan(TRACK_W);
        expect(p.y).toBeGreaterThan(TRACK_H / 2);
        expect(p.y).toBeLessThan(TRACK_H);
      }
    }
  });
});
