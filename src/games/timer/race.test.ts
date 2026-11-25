import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { flagBox, kidBox, lampBox, MAT, MAT_XS, matOf, POST, project, RACE_KIDS, RaceScene, TRACK } from "./race";
import type { Players } from "./settings";
import { TURN_CHILDREN } from "./swap";

/** The children playing for each count, as the run picks them: the first of `TURN_CHILDREN`. */
const COUNTS = [2, 3, 4].map((n) => TURN_CHILDREN.slice(0, n));

type Box = { x: number; y: number; w: number; h: number };
const overlap = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/** Where the kart waits on the start line with its driver: the driver sits over the kart's middle. */
function driverBox(): Box {
  const p = TRACK.points[0];
  const q = project(p.x, p.z);
  return { x: q.x - 62 * q.s, y: q.y - 190 * q.s, w: 124 * q.s, h: 190 * q.s };
}

/** The start light's pole from the box down to the ground. */
function poleBox(): Box {
  const q = project(POST.x, POST.z);
  const box = lampBox();
  return { x: q.x - 6 * q.s, y: box.y, w: 12 * q.s, h: q.y - box.y };
}

describe("Rennstrecke", () => {
  test("every child taking turns has its colours", () => {
    for (const kind of TURN_CHILDREN) expect(RACE_KIDS[kind]).toBeDefined();
  });

  test("the mats lie off the track and apart, for 2, 3 and 4 children", () => {
    for (const kids of COUNTS) {
      const mats = kids.map((kind) => matOf(kids, kind));
      expect(MAT_XS[kids.length as 2 | 3 | 4]).toHaveLength(kids.length);
      for (const m of mats) {
        // Half the road, its kerb and the mat's radius: the mat never lies on the road.
        const nearest = Math.min(...TRACK.points.map((p) => Math.hypot(p.x - m.x, p.z - m.z)));
        expect(nearest).toBeGreaterThanOrEqual(167);
      }
      for (let i = 0; i < mats.length; i++)
        for (let j = i + 1; j < mats.length; j++) expect(Math.hypot(mats[i].x - mats[j].x, mats[i].z - mats[j].z)).toBeGreaterThanOrEqual(2 * MAT.r);
    }
  });

  test("no waiting child is hidden, on the 4:3 cut too", () => {
    const things: [string, Box][] = [
      ["the start light", lampBox()],
      ["the pole", poleBox()],
      ["the flag", flagBox()],
      ["the kart on the line", driverBox()],
    ];
    for (const kids of COUNTS) {
      const boxes = kids.map((kind) => [kind, kidBox(matOf(kids, kind))] as const);
      for (const [kind, box] of boxes) {
        // The tablet's 4:3 cut shows the stage from x 200 to 1400; the picture's foot holds the end's buttons.
        expect(box.x, `${kind} of ${kids.length}`).toBeGreaterThanOrEqual(200);
        expect(box.x + box.w, `${kind} of ${kids.length}`).toBeLessThanOrEqual(1400);
        expect(box.y, `${kind} of ${kids.length}`).toBeGreaterThanOrEqual(80);
        expect(box.y + box.h, `${kind} of ${kids.length}`).toBeLessThanOrEqual(770);
        for (const [what, thing] of things) expect(overlap(box, thing), `${kind} of ${kids.length} behind ${what}`).toBe(false);
      }
      for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++) expect(overlap(boxes[i][1], boxes[j][1]), `${boxes[i][0]} and ${boxes[j][0]}`).toBe(false);
    }
  });

  test("the scene draws every child with its photo and name", () => {
    const photo = "data:image/png;base64,iVBORw0KGgo=";
    const players: Players = { fox: { name: "Mia" }, rabbit: { photo }, frog: { name: "Ole", photo } };
    for (const kids of COUNTS) {
      const html = renderToStaticMarkup(
        createElement(RaceScene, {
          kids,
          holder: kids[1],
          prev: kids[0],
          turn: { name: "tm-race-test", startedAt: 0, ms: 60_000, handover: true },
          done: false,
          poke: 0,
          elapsed: 20_000,
          quiet: true,
          players,
        }),
      );
      expect(html).not.toContain("NaN");
      expect(html).toContain("Mia");
      if (kids.length >= 3) expect(html).toContain(photo);
      if (kids.length === 4) expect(html).toContain("Ole");
    }
  });
});
