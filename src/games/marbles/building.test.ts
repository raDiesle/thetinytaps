import { describe, expect, test } from "bun:test";
import { buildBuilding, crankKnob, EXC, FLOOR, HEAP, JACK, moundY, onScoop, PILE, ROLLER, SCOOP, SPOOL, WINCH, WORLD_W } from "./building";

describe("Baustelle", () => {
  const site = buildBuilding();
  const times = (from: number, to: number, step = 0.02) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);
  /** A spot of the scoop in site coordinates. */
  const scoopSpot = (t: number, p: { x: number; y: number }) => {
    const { face, w, cup } = site.excavatorAt(t);
    const q = onScoop(w, cup, p);
    return { x: EXC.x + face * q.x, y: EXC.y + q.y };
  };
  const bottom = { x: SCOOP.mouth * 0.4, y: SCOOP.deep };

  test("the machine runs 39 to 43 seconds and ends after everything else", () => {
    expect(site.duration).toBeGreaterThan(39);
    expect(site.duration).toBeLessThan(43);
    expect(Math.max(...site.events.map((e) => e.at))).toBe(site.duration);
    expect(site.events[site.events.length - 1].done).toBe(true);
  });

  test("one thing sets off the next, in the order of the story", () => {
    const order = [
      site.tChute,
      site.tRelease,
      site.tHit,
      site.tPlof,
      site.tBonk,
      site.tDig,
      site.tSwing,
      site.tSwung,
      site.tTip,
      site.tPat,
      site.tRollerGo,
      site.tJack,
      site.tCrank,
      site.tRest,
      site.tRoofLand,
      site.tTree,
      site.duration,
    ];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
  });

  test("nothing new moves before the thing before it reaches it", () => {
    expect(site.excavatorAt(site.tBonk - 0.01)).toEqual(site.excavatorAt(-1));
    expect(site.rollerAt(site.tPat - 0.01)).toEqual(site.rollerAt(-1));
    expect(site.jackAt(site.tJack - 0.01)).toEqual(site.jackAt(-1));
  });

  test("the cable drum plops onto the sand pile, rolls over it and stops at the excavator's tracks", () => {
    const landed = site.spoolAt(site.tPlof).pt;
    let nearest = Infinity;
    for (let x = PILE.x - PILE.w; x <= PILE.x + PILE.w; x += 1)
      nearest = Math.min(nearest, Math.hypot(landed.x - x, landed.y - moundY(PILE.x, PILE.w, PILE.h, x)));
    expect(Math.abs(nearest - SPOOL.r)).toBeLessThan(4);
    for (const t of times(site.tPlof, site.duration)) {
      const { pt } = site.spoolAt(t);
      expect(pt.y).toBeLessThanOrEqual(FLOOR - SPOOL.r + 0.5);
      expect(pt.y).toBeLessThanOrEqual(moundY(PILE.x, PILE.w, PILE.h, pt.x) - SPOOL.r + 6);
    }
    expect(site.spoolAt(site.tBonk).pt.x + SPOOL.r).toBeCloseTo(EXC.x - EXC.track - 2, 0);
  });

  test("the excavator digs into the pile, tips the sand onto the heap's spot and pats the roller's roof", () => {
    const dig = scoopSpot(site.tDig, { x: SCOOP.mouth, y: 0 });
    expect(Math.abs(dig.x - PILE.x)).toBeLessThan(PILE.w * 0.6);
    expect(dig.y).toBeGreaterThan(moundY(PILE.x, PILE.w, PILE.h, dig.x) + 10);
    expect(site.excavatorAt(site.tDig - 0.5).face).toBe(-1);
    expect(site.excavatorAt(site.tTip).face).toBe(1);
    const pour = scoopSpot(site.tTip + 0.5, { x: SCOOP.mouth / 2, y: 0 });
    expect(Math.abs(pour.x - HEAP.x)).toBeLessThan(6);
    const pat = scoopSpot(site.tPat, bottom);
    expect(Math.abs(pat.y - ROLLER.roof)).toBeLessThan(4);
    expect(Math.abs(pat.x - (ROLLER.x0 + ROLLER.patX))).toBeLessThan(30);
  });

  test("the scoop never goes into the ground and touches the roller only at the pat", () => {
    for (const t of times(0, site.duration)) {
      const b = scoopSpot(t, bottom);
      expect(b.y).toBeLessThan(FLOOR);
      const overRoof = b.x > ROLLER.x0 + ROLLER.patX - 70 && b.x < ROLLER.x0 + ROLLER.patX + 70;
      if (overRoof && Math.abs(t - site.tPat) > 0.3) expect(b.y).toBeLessThan(ROLLER.roof - 4);
    }
  });

  test("the roller flattens the whole heap and its drum really reaches the jackhammer", () => {
    expect(site.rollerAt(site.tJack).x + ROLLER.drum).toBeCloseTo(JACK.x - JACK.w / 2, 0);
    for (let x = HEAP.x - HEAP.w; x <= HEAP.x + HEAP.w; x += 4) expect(site.heapY(site.duration, x)).toBe(FLOOR);
    expect(site.heapH(site.tTip + 1)).toBeCloseTo(HEAP.h, 3);
    for (const t of times(0, site.duration)) expect(site.rollerAt(t).lift).toBeLessThan(HEAP.h);
  });

  test("the jackhammer hops onto the winch's knob and stays in the site", () => {
    const k = crankKnob(0);
    const tip = site.jackAt(site.tCrank - 0.001).tip;
    expect(Math.hypot(tip.x - k.x, tip.y - (k.y - WINCH.knob))).toBeLessThan(4);
    for (const t of times(0, site.duration)) {
      const j = site.jackAt(t).tip;
      expect(j.y).toBeLessThanOrEqual(FLOOR);
      expect(j.x).toBeGreaterThan(0);
      expect(j.x).toBeLessThan(WORLD_W);
    }
  });

  test("the camera stays inside the site", () => {
    for (const t of times(-1, site.duration, 0.1)) {
      expect(site.cameraTarget(t)).toBeGreaterThanOrEqual(0);
      expect(site.cameraTarget(t)).toBeLessThanOrEqual(WORLD_W - 1600);
    }
  });
});
