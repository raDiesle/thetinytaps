import { describe, expect, test } from "bun:test";
import { COLOR_TRACK } from "./colorTrack";
import { SORT_COLORS, TUBE_FULL, TUBE_TOP, TUBES, tubeSlot } from "./colors";
import { LEVEL_TEXTS } from "./content";
import { SITE_TRACK } from "./siteTrack";
import { SLIDE_TRACK } from "./slideTrack";
import { SNOW_TRACK } from "./snowTrack";
import { SPACE_TRACK } from "./spaceTrack";
import { BASKET_FULL, SHELF, TRACK_H, TRACK_W } from "./track";
import { COLOR_END, STRETCHES } from "./trackStretches";
import { BALL_R } from "./path";
import { WOODEN } from "./trackParts";

const WORLDS = [WOODEN, COLOR_TRACK, SNOW_TRACK, SPACE_TRACK, SLIDE_TRACK, SITE_TRACK];

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

  test("each world ends in a stretch of its own, drawn and sounded its own way", () => {
    expect(new Set(WORLDS.map((w) => w.stretch)).size).toBe(WORLDS.length);
    expect(new Set(WORLDS.map((w) => w.StretchArt)).size).toBe(WORLDS.length);
    expect(new Set(WORLDS.map((w) => w.cue)).size).toBe(WORLDS.length);
    expect(new Set([...WORLDS.map((w) => w.stretch), ...Object.values(STRETCHES)]).size).toBe(WORLDS.length);
    // A world whose stretch carries things (a chair, a bucket) draws what carries them.
    for (const w of WORLDS) if (w.stretch.parts.some((part) => part.carry)) expect(w.Carrier, w.level).toBeDefined();
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

describe("Farbenbahn (K-10)", () => {
  const sort = COLOR_TRACK.sort;

  test("one marble of each colour on the shelf, each with its own tube", () => {
    expect(sort?.colors).toHaveLength(SHELF.things.length);
    expect(new Set(sort?.colors).size).toBe(SORT_COLORS.length);
    expect(TUBES.x).toHaveLength(SORT_COLORS.length);
  });

  test("a full tube holds its marbles inside the glass, and the tubes don't touch", () => {
    for (let tube = 0; tube < TUBES.x.length; tube++) {
      for (let n = 0; n < TUBE_FULL; n++) {
        const p = tubeSlot(tube, n);
        expect(p.y - BALL_R).toBeGreaterThan(TUBE_TOP);
        expect(p.y + BALL_R).toBeLessThanOrEqual(TUBES.bottom);
      }
      if (tube > 0) expect(TUBES.x[tube] - TUBES.x[tube - 1]).toBeGreaterThan(2 * TUBES.half + 20);
    }
    // Clear of the last row's end, where the marbles hop off, and of the wall's right edge.
    expect(TUBES.x[0] - TUBES.half).toBeGreaterThan(COLOR_END.x + BALL_R);
    expect(TUBES.x[TUBES.x.length - 1] + TUBES.half + 30).toBeLessThan(TRACK_W);
  });

  test("the voice counts every marble up to a full tube, then is quiet", () => {
    for (let tube = 0; tube < SORT_COLORS.length; tube++) {
      for (let n = 1; n <= TUBE_FULL; n++) expect(sort?.count(tube, n)?.de).toBeTruthy();
      expect(sort?.count(tube, TUBE_FULL + 1)).toBeNull();
    }
    expect(sort?.count(0, 3)?.de).toBe("Drei rote!");
  });

  test("the hop ends where the marble rests, from the run's end", () => {
    const from = { ...COLOR_END };
    const to = tubeSlot(2, 0);
    expect(sort?.hop(from, to, 0)).toEqual(from);
    expect(sort?.hop(from, to, 1)).toEqual(to);
    // On the way down into the tube it is above the tube and never beside it.
    expect(sort?.hop(from, to, 0.8).x).toBe(to.x);
  });
});
