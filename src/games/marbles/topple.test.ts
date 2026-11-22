import { describe, expect, test } from "bun:test";
import { heavyTest } from "@/heavyTest";
import { pickRuns } from "./things";
import { CEILING, createSim, DONE_AFTER_DRUM_S, GROUPS, hitHeight, LINK_KINDS, layOut, linkAge, pushFirst, stepSim, type Layout } from "./topple";

/** Plays a round from the push to the drum at 60 frames a second, as a phone does. */
function play(layout: Layout) {
  const sim = createSim(layout);
  pushFirst(sim);
  const started: number[] = [];
  while (sim.drumAt === null && sim.t < 200) {
    stepSim(sim, 1 / 60);
    sim.tips.forEach((o, i) => {
      if (o.started && started[i] === undefined) started[i] = sim.t;
    });
  }
  return { sim, started };
}

const ROUNDS = Array.from({ length: 12 }, () => layOut(pickRuns(GROUPS)));
let played: ({ layout: Layout } & ReturnType<typeof play>)[] | undefined;
/** The rounds played through, once (about a second): only the heavy tests ask for them. */
const PLAYED = () => {
  played ??= ROUNDS.map((layout) => ({ layout, ...play(layout) }));
  return played;
};

describe("Alles fällt um", () => {
  heavyTest("every round falls all the way to the drum, and from the push to the end takes 56–64 seconds", () => {
    for (const { layout, sim, started } of PLAYED()) {
      expect(sim.drumAt).not.toBeNull();
      expect(started.filter((s) => s !== undefined).length).toBe(layout.things.length);
      const end = (sim.drumAt ?? 0) + DONE_AFTER_DRUM_S;
      expect(end).toBeGreaterThan(56);
      expect(end).toBeLessThan(64);
    }
  });

  heavyTest("between each two runs stands a link of another kind, set off by the run before it and pushing the next run over", () => {
    for (const { layout, sim, started } of PLAYED()) {
      expect(layout.links.map((l) => l.link.kind)).toEqual(LINK_KINDS.slice(0, GROUPS - 1));
      layout.links.forEach(({ link, from, to }, k) => {
        const hit = sim.linkHit[k];
        expect(hit).not.toBeNull();
        // Hit by the last thing of its run, after that one started to fall; the next run starts only when the link gets to it.
        expect(hit ?? 0).toBeGreaterThan(started[from]);
        expect(started[to]).toBeCloseTo((hit ?? 0) + link.hitAt, 1);
      });
    }
  });

  test("what a link pushes with gets to the next thing's top-left side just at its moment, never into it before", () => {
    for (const layout of ROUNDS.slice(0, 6)) {
      layout.links.forEach(({ link, to }) => {
        const next = layout.things[to];
        const at = link.pusher(link.hitAt);
        expect(Math.abs(at.x - link.width)).toBeLessThan(3);
        expect(-at.y).toBeGreaterThan(next.h * 0.5);
        expect(-at.y).toBeLessThan(next.h);
        expect(Math.abs(-at.y - hitHeight(next))).toBeLessThan(12);
        for (let age = 0; age < link.hitAt - 0.02; age += 0.02) expect(link.pusher(age).x).toBeLessThan(link.width + 0.5);
      });
    }
  });

  test("each link sounds at its hit and at the moment it pushes on, and its focus stays in the room", () => {
    const layout = ROUNDS[0];
    for (const { link } of layout.links) {
      expect(link.sounds.some((s) => s.at === link.hitAt)).toBe(true);
      expect(link.sounds.every((s) => s.at >= 0 && s.at <= link.hitAt + 0.5)).toBe(true);
      for (let age = 0; age <= link.hitAt + 4; age += 0.05) {
        const f = link.focus(age);
        expect(f).toBeGreaterThan(-200);
        expect(f).toBeLessThan(link.width + 100);
        const p = link.pusher(age);
        expect(p.y).toBeLessThanOrEqual(0.5);
        expect(p.y).toBeGreaterThan(CEILING);
      }
    }
  });

  test("before the push nothing moves, and the links stand still until they are hit", () => {
    const layout = ROUNDS[1];
    const sim = createSim(layout);
    for (let i = 0; i < 60; i++) stepSim(sim, 1 / 60);
    expect(sim.tips.every((o) => o.angle === 0)).toBe(true);
    layout.links.forEach((_, k) => {
      expect(linkAge(sim, k)).toBe(0);
    });
  });
});
