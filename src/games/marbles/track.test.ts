import { describe, expect, test } from "bun:test";
import { BALL_R, type Pt } from "./path";
import {
  BASKET,
  BASKET_FULL,
  BASKET_IN,
  BASKET_SLOTS,
  buildRoutes,
  DEFAULT_BUILD,
  GATE,
  HOPPER,
  JOIN,
  PIECES,
  pointAt,
  ROLLER,
  ROLLERS,
  ROW1A,
  ROW2,
  rolled,
  rowY,
  type Route,
  type Section,
  SHELF,
  shelfSpot,
  slotBoard,
  SLOTS,
  SONG_HANDOVER,
  SWITCH,
  TRACK_H,
  TRACK_W,
  TURNS,
} from "./track";
import { COLOR_END, STRETCHES } from "./trackStretches";

// The run is many hand-placed numbers; these checks catch a marble that would
// jump between sections or roll off the wall when one of them changes.

const routes = buildRoutes(STRETCHES.wood);
const near = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y) < 1;
const first = (route: { pts: Pt[] }) => route.pts[0];
const last = (route: { pts: Pt[] }) => route.pts[route.pts.length - 1];

/** Every way a marble can take through a section. */
const choices = (sec: Section): Route[] =>
  sec.kind === "fixed" ? [sec.route] : sec.kind === "spot" ? PIECES.map((piece) => routes.pieces[sec.spot][piece]) : Object.values(routes.ways);
const allRoutes = routes.sections.flatMap(choices);

test("every spot has a default part and a section, and the basket has room for a full load", () => {
  expect(DEFAULT_BUILD).toHaveLength(SLOTS.length);
  SLOTS.forEach((_, i) => expect(routes.sections.filter((sec) => sec.kind === "spot" && sec.spot === i)).toHaveLength(1));
  expect(routes.sections.filter((sec) => sec.kind === "switch")).toHaveLength(1);
  expect(routes.sections[0].kind).toBe("fixed");
  expect(routes.sections[routes.sections.length - 1].kind).toBe("fixed");
  expect(BASKET_SLOTS.length).toBeGreaterThanOrEqual(BASKET_FULL);
});

test("the sections join up: every way through a section starts where every way through the one before ends", () => {
  routes.sections.slice(1).forEach((sec, i) => {
    for (const before of choices(routes.sections[i]))
      for (const after of choices(sec)) expect(near(last(before), first(after)), `sections ${i} and ${i + 1}`).toBe(true);
  });
  SLOTS.forEach((slot, i) => {
    for (const piece of PIECES) {
      const route = routes.pieces[i][piece];
      expect(near(first(route), slot.from), `${piece} in spot ${i} starts at its top`).toBe(true);
      expect(near(last(route), slot.to), `${piece} in spot ${i} ends at its bottom`).toBe(true);
    }
  });
  for (const route of Object.values(routes.ways)) expect(near(last(route), JOIN)).toBe(true);
});

test("the whole run stays on the wall, and no step is a jump", () => {
  for (const route of allRoutes) {
    route.pts.forEach((pt, i) => {
      expect(pt.x).toBeGreaterThanOrEqual(BALL_R);
      expect(pt.x).toBeLessThanOrEqual(TRACK_W - BALL_R);
      expect(pt.y).toBeLessThanOrEqual(TRACK_H - BALL_R);
      if (i) expect(Math.hypot(pt.x - route.pts[i - 1].x, pt.y - route.pts[i - 1].y)).toBeLessThan(80);
    });
  }
});

test("spot boards don't overlap, so a tap swaps one part only", () => {
  const boards = SLOTS.map(slotBoard);
  boards.forEach((a, i) =>
    boards.slice(i + 1).forEach((b, k) => {
      const apart = a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y;
      expect(apart, `spots ${i} and ${i + k + 1}`).toBe(true);
    }),
  );
});

test("at every turn the wall is on the far side of where the marble comes from", () => {
  for (const turn of TURNS) {
    expect(Math.sign(turn.x - turn.from.x)).toBe(Math.sign(turn.x - turn.to.x));
    expect(turn.to.y).toBeGreaterThan(turn.from.y + BALL_R);
  }
});

// The shelf of things to pick from (K-07) is easy to break when a thing or a place is added.

test("a thing taken from the shelf always has something new to make room for", () => {
  // The taken one and the two left on the shelf are out; at least two others must be there to pick from.
  expect(ROLLERS.length).toBeGreaterThanOrEqual(SHELF.things.length + 2);
  expect(new Set(ROLLERS).size).toBe(ROLLERS.length);
  for (const kind of ROLLERS) expect(ROLLER[kind].pace, kind).toBeGreaterThan(0);
});

test("the shelf lies between the hopper and the first spot, over row 1a, with room for a finger", () => {
  const xs = SHELF.things;
  for (let i = 1; i < xs.length; i++) expect(xs[i] - xs[i - 1], "places on the shelf").toBeGreaterThanOrEqual(110);
  expect(xs[0] - 58).toBeGreaterThan(HOPPER.x + 58);
  expect(xs[xs.length - 1] + 58).toBeLessThan(SLOTS[0].from.x);
  // The shelf stays above the marbles rolling along row 1a under it.
  for (const x of [SHELF.x0, SHELF.x1]) expect(SHELF.y + 13).toBeLessThan(rowY(ROW1A, x) - BALL_R);
  for (const kind of ROLLERS) expect(shelfSpot(0, kind).y).toBeLessThan(SHELF.y);
});

// The switch (K-01) and the barrier (K-02).

test("both ways of the switch take about as long, and the left one has its xylophone", () => {
  const { left, right } = routes.ways;
  expect(left.total / right.total).toBeGreaterThan(0.8);
  expect(left.total / right.total).toBeLessThan(1.6);
  expect(left.events.filter((e) => e.event.kind === "note")).toHaveLength(4);
  expect(left.events[0].event.kind).toBe("flap");
});

test("the lifted flap stays clear of the right way, and the hanging one stops the marble", () => {
  // Lifted, the flap lies flat to the right of its hinge, above every marble on the right way.
  const lifted = { y: SWITCH.hinge.y + 9 };
  for (const pt of routes.ways.right.pts)
    if (pt.x > SWITCH.hinge.x - 10 && pt.x < SWITCH.hinge.x + SWITCH.length + 10) expect(pt.y - BALL_R).toBeGreaterThan(lifted.y);
  // Hanging, no marble gets past its face.
  for (const pt of routes.ways.left.pts) expect(pt.x + BALL_R).toBeLessThanOrEqual(SWITCH.face + 1);
});

test("the barrier stands on row 2 with room for a long row of waiting marbles behind it", () => {
  const sec = routes.sections[routes.gate.section];
  expect(sec.kind).toBe("fixed");
  expect(routes.gate.s).toBeGreaterThan(0);
  expect(GATE.x).toBeLessThan(ROW2.from.x);
  expect(GATE.x).toBeGreaterThan(ROW2.to.x);
  // At least eight marbles fit between the barrier and the wall at the start of the row.
  expect((ROW2.from.x - GATE.x) / (2 * BALL_R)).toBeGreaterThanOrEqual(8);
  // It stands before the funnel in the default build.
  const next = routes.sections[routes.gate.section + 1];
  expect(next.kind === "spot" && DEFAULT_BUILD[next.spot]).toBe("funnel");
});

// Each world ends in a stretch of its own (`trackStretches.ts`): the same checks for every one of them.

/** Seconds a marble takes along `routes`, rolling as `TrackLevel` rolls it. */
function seconds(rs: Route[], until?: (r: Route, s: number) => boolean) {
  const dt = 1 / 120;
  let t = 0;
  let v = 0;
  for (const r of rs) {
    let s = 0;
    while (s < r.total) {
      if (until?.(r, s)) return t;
      const zone = r.zones.find((z) => s >= z.s0 && s < z.s1);
      v = zone?.speed ?? rolled(v, pointAt(r, s).slope, dt);
      s += v * dt;
      t += dt;
    }
  }
  return t;
}

describe.each(Object.entries(STRETCHES))("the %s stretch", (name, stretch) => {
  const built = buildRoutes(stretch);
  const end = built.sections[built.sections.length - 1];
  const route = end.kind === "fixed" ? end.route : null;

  test("it joins the run and stays on the wall, with no jump", () => {
    expect(route).not.toBeNull();
    if (!route) return;
    route.pts.forEach((pt, i) => {
      expect(pt.x, `${name} point ${i}`).toBeGreaterThanOrEqual(BALL_R);
      expect(pt.x, `${name} point ${i}`).toBeLessThanOrEqual(TRACK_W - BALL_R);
      expect(pt.y, `${name} point ${i}`).toBeLessThanOrEqual(TRACK_H - BALL_R);
      if (i) expect(Math.hypot(pt.x - route.pts[i - 1].x, pt.y - route.pts[i - 1].y), `${name} step ${i}`).toBeLessThan(80);
    });
    for (const rail of stretch.rails)
      for (const pt of [rail.from, rail.to]) {
        expect(pt.x).toBeGreaterThanOrEqual(BALL_R);
        expect(pt.x).toBeLessThanOrEqual(TRACK_W - BALL_R);
        expect(pt.y).toBeLessThan(TRACK_H - BALL_R);
      }
  });

  test("it ends in the basket (or, sorting colours, where the hop into the tubes starts)", () => {
    if (!route) return;
    const last = route.pts[route.pts.length - 1];
    if (name === "color") expect(near(last, COLOR_END)).toBe(true);
    else {
      expect(last.y).toBe(BASKET_IN.y);
      expect(last.x).toBeGreaterThanOrEqual(BASKET.x0 + BALL_R);
      expect(last.x).toBeLessThan(BASKET.x1 - BALL_R);
    }
  });

  test("its walls are on the far side, and every cue fires on the way", () => {
    expect(built.turns.length).toBe(TURNS.length + stretch.turns.length);
    for (const turn of stretch.turns) {
      expect(Math.sign(turn.x - turn.from.x)).toBe(Math.sign(turn.x - turn.to.x));
      expect(turn.to.y).toBeGreaterThan(turn.from.y + BALL_R);
      expect(turn.x).toBeGreaterThanOrEqual(0);
      expect(turn.x).toBeLessThanOrEqual(TRACK_W);
    }
    const fired = (route?.events ?? []).flatMap((e) => (e.event.kind === "cue" ? [e.event.cue] : []));
    expect(new Set(fired)).toEqual(new Set(Array.from({ length: stretch.cues }, (_, i) => i)));
    expect(stretch.cues).toBeGreaterThanOrEqual(3);
  });

  test("a round with things let out promptly takes about a minute", () => {
    // Six things, the child letting out each two seconds after the one before but not before that one has played its
    // line of the song on row 1 (K-11): the last comes five such gaps later and rolls on down. The right way of the switch is the
    // shorter one.
    const seq = built.sections.map((sec) =>
      sec.kind === "fixed" ? sec.route : sec.kind === "spot" ? built.pieces[sec.spot][DEFAULT_BUILD[sec.spot]] : built.ways.right,
    );
    const handover = (r: Route, s: number) => r.events.some((e) => e.event.kind === "note" && e.event.bar === SONG_HANDOVER && e.s <= s);
    const gap = Math.max(2, 0.38 + seconds(seq, handover));
    expect(gap, name).toBeLessThan(3.2);
    const round = (BASKET_FULL - 1) * gap + seconds(seq.slice(0, built.gate.section)) + 1.1 + seconds(seq.slice(built.gate.section)) + 0.8;
    expect(round, name).toBeGreaterThan(55);
    expect(round, name).toBeLessThan(65);
  });
});

test("every world's stretch is its own", () => {
  const all = Object.values(STRETCHES);
  const shapes = all.map((st) => st.parts.map((p) => `${Math.round(p.pts[p.pts.length - 1].x)},${Math.round(p.pts[p.pts.length - 1].y)}`).join(" "));
  expect(new Set(shapes).size).toBe(all.length);
});
