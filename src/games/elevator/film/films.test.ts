import { describe, expect, test } from "bun:test";
import { FILMS } from "./films";
import type { Point } from "../trail/types";
import type { Box, Film, Scene } from "./types";

/** Every way through a film: the picks of each, made one choice after the other. */
function pathsOf(film: Film, picks: string[] = []): string[][] {
  const scenes = film.scenes(picks);
  const last = scenes[scenes.length - 1];
  if (!last.choice) return [picks];
  return last.choice.options.flatMap((o) => pathsOf(film, [...picks, o.id]));
}

/** Whether the circle round `at` lies wholly in the box. */
const inside = ([x, y, w, h]: Box, [cx, cy]: Point, r: number) => cx - r >= x && cx + r <= x + w && cy - r >= y && cy + r <= y + h;

for (const film of FILMS) {
  describe(film.title, () => {
    const paths = pathsOf(film);
    const all = new Map<string, Scene>(paths.flatMap((picks) => film.scenes(picks).map((s): [string, Scene] => [s.id, s])));

    test("every way through it ends, and a pick only adds scenes after the ones seen so far", () => {
      expect(paths.length).toBeGreaterThan(1);
      for (const picks of paths) {
        for (let n = 0; n < picks.length; n++) {
          const before = film.scenes(picks.slice(0, n)).map((s) => s.id);
          const after = film.scenes(picks.slice(0, n + 1)).map((s) => s.id);
          expect(after.slice(0, before.length)).toEqual(before);
          expect(after.length).toBeGreaterThan(before.length);
        }
      }
    });

    test("no scene comes twice on one way", () => {
      for (const picks of paths) {
        const ids = film.scenes(picks).map((s) => s.id);
        expect(new Set(ids).size).toBe(ids.length);
      }
    });

    test("a choice offers two or three different ways, and every one of them is right", () => {
      for (const scene of all.values()) {
        if (!scene.choice) continue;
        const ids = scene.choice.options.map((o) => o.id);
        expect(ids.length).toBeGreaterThanOrEqual(2);
        expect(ids.length).toBeLessThanOrEqual(3);
        expect(new Set(ids).size).toBe(ids.length);
      }
    });

    test("what the child taps lies wholly in the part of the picture that is always seen", () => {
      for (const scene of all.values()) {
        for (const beat of scene.beats) if (beat.tap) expect(inside(scene.focus, beat.tap.at, beat.tap.r), `${scene.id} ${beat.ask}`).toBe(true);
        for (const o of scene.choice?.options ?? []) expect(inside(scene.focus, o.at, o.r), `${scene.id} ${o.id}`).toBe(true);
      }
    });

    test("every scene has its beats, a tap beat asks for its tap, and every line is a German sentence", () => {
      const lines: string[] = [film.title, film.end];
      for (const scene of all.values()) {
        expect(scene.beats.length).toBeGreaterThan(0);
        for (const beat of scene.beats) {
          expect(beat.ms).toBeGreaterThan(0);
          if (beat.tap) expect(beat.ask, scene.id).toBeTruthy();
          lines.push(...[beat.ask, beat.say].filter((l): l is string => l !== undefined));
        }
        if (scene.choice) lines.push(scene.choice.ask, ...scene.choice.options.map((o) => o.say));
      }
      for (const line of lines) expect(line.trim()).toMatch(/^[A-ZÄÖÜ„]/);
    });
  });
}
