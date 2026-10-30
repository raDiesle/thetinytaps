import { describe, expect, test } from "bun:test";
import { buildKitchen, COOKTOP, COUNTER, CRANK, JAR, KNOB_Y, onPan, PAN, PAN_DOWN, PAN_REST, PANCAKE, PLATE, SPINNER, TIMER, WEDGE, WORLD_W } from "./kitchen";
import { VIEW_W } from "./level";

describe("Verrückte Küche", () => {
  const kitchen = buildKitchen();
  const end = kitchen.duration;
  /** Every moment from the tap to the end, a tenth of a second apart. */
  const moments = Array.from({ length: Math.ceil(end * 10) + 1 }, (_, i) => i / 10);

  test("the machine runs about forty seconds and ends after everything else", () => {
    expect(end).toBeGreaterThan(39);
    expect(end).toBeLessThan(43);
    const last = kitchen.events[kitchen.events.length - 1];
    expect(last.at).toBe(end);
    expect(last.done).toBe(true);
    expect(Math.max(...kitchen.events.map((e) => e.at))).toBe(end);
  });

  test("one thing sets off the next, in the order of the story", () => {
    const k = kitchen;
    const order = [
      k.tSpoon,
      k.tRoll,
      k.tPinHit,
      k.tLadle,
      k.tPeg,
      k.tPlateHit,
      k.tCrank,
      k.tLid,
      k.tLeafHit,
      k.tWound,
      k.tRing,
      k.tFall,
      k.tHandle,
      k.tToss,
      k.tCake,
      k.tBeep,
      k.tLever,
      k.tPop,
      k.tToast,
      end,
    ];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
  });

  test("nothing new moves before the plate bumps the crank", () => {
    const still = (t: number) => [kitchen.crankAngle(t), kitchen.lidAt(t), kitchen.timerAt(t), kitchen.panAngle(t), kitchen.pancakeAt(t), kitchen.leafAt(0, t)];
    expect(still(kitchen.tCrank - 0.01)).toEqual(still(-1));
  });

  test("the rolling plate really reaches the crank's knob, without running into the spinner's bowl", () => {
    const knob = { x: SPINNER.cx - CRANK.r, y: KNOB_Y };
    const gap = (t: number) => Math.hypot(kitchen.plateAt(t).pt.x - knob.x, kitchen.plateAt(t).pt.y - knob.y) - PLATE.r - CRANK.knobR;
    expect(Math.abs(gap(kitchen.tCrank))).toBeLessThan(1);
    for (let t = kitchen.tPlateHit; t < kitchen.tCrank; t += 0.05) expect(gap(t)).toBeGreaterThan(-1);
    expect(kitchen.plateStopX + PLATE.r).toBeLessThan(SPINNER.cx - SPINNER.w / 2);
  });

  test("the leaves stay in the kitchen, and the big one reaches the egg timer", () => {
    for (const t of moments) {
      kitchen.leaves.forEach((_, i) => {
        const leaf = kitchen.leafAt(i, t);
        if (!leaf) return;
        expect(leaf.pt.x).toBeGreaterThan(0);
        expect(leaf.pt.x).toBeLessThan(WORLD_W);
        expect(leaf.pt.y).toBeGreaterThan(40);
        expect(leaf.pt.y).toBeLessThan(COUNTER);
      });
    }
    const big = kitchen.leafAt(kitchen.leaves.length - 1, kitchen.tLeafHit - 0.01);
    const timer = kitchen.timerAt(kitchen.tLeafHit - 0.01).pt;
    expect(Math.hypot((big?.pt.x ?? 0) - timer.x, (big?.pt.y ?? 0) - timer.y)).toBeLessThan(TIMER.rx + 30);
  });

  test("the egg timer winds up, ticks its dial back to zero before it rings, and falls clear of the jar onto the handle", () => {
    expect(kitchen.timerAt(kitchen.tWound - 0.01).dial).toBeGreaterThan(250);
    expect(kitchen.timerAt(kitchen.tRing - 0.01).dial).toBe(0);
    expect(kitchen.timerAt(kitchen.tRing + 0.1).ringing).toBe(true);
    // Until it falls it stands on the jar's lid.
    for (let t = 0; t < kitchen.tFall; t += 0.05) expect(kitchen.timerAt(t).pt.y + TIMER.foot).toBeLessThanOrEqual(JAR.top + 0.01);
    for (let t = kitchen.tFall; t < kitchen.tHandle; t += 0.01) {
      const { pt } = kitchen.timerAt(t);
      if (pt.y + TIMER.foot > JAR.top + 5) expect(pt.x + TIMER.rx * 0.6).toBeLessThan(JAR.x0);
    }
    // It lands with its feet on the top of the handle.
    const landed = kitchen.timerAt(kitchen.tHandle).pt;
    expect(landed).toEqual(onPan({ x: TIMER.onHandle, y: -PAN.handleH - TIMER.foot }, PAN_REST));
    expect(landed.x).toBeGreaterThan(WEDGE.x + 100);
  });

  test("the pan rests on its wedge with its left edge on the counter and tips until its handle lies on the counter", () => {
    expect(onPan({ x: -PAN.back, y: 0 }, PAN_REST).y).toBeCloseTo(COUNTER, 5);
    expect(onPan({ x: PAN.handle, y: 0 }, PAN_DOWN).y).toBeCloseTo(COUNTER, 5);
    expect(kitchen.panAngle(kitchen.tHandle - 0.01)).toBe(PAN_REST);
    expect(kitchen.panAngle(kitchen.tToss)).toBeCloseTo(PAN_DOWN, 5);
    expect(kitchen.panAngle(end)).toBeCloseTo(PAN_DOWN, 5);
  });

  test("the pancake flies high over the cookie jar and lands flat on the touch field", () => {
    for (let t = kitchen.tToss; t <= kitchen.tCake; t += 0.02) {
      const { pt } = kitchen.pancakeAt(t);
      expect(pt.y - PANCAKE.r).toBeGreaterThan(0);
      expect(pt.x).toBeLessThan(WORLD_W);
      // The timer has left the jar by now; however the pancake turns, it never touches the jar.
      const nearest = { x: Math.min(JAR.x1, Math.max(JAR.x0, pt.x)), y: Math.min(COUNTER, Math.max(JAR.top, pt.y)) };
      expect(Math.hypot(pt.x - nearest.x, pt.y - nearest.y)).toBeGreaterThan(PANCAKE.r + 10);
    }
    const landed = kitchen.pancakeAt(kitchen.tCake);
    expect(landed.pt).toEqual({ x: COOKTOP.touchX, y: COUNTER - PANCAKE.h / 2 });
    expect(landed.angle % 360).toBe(0);
  });

  test("the camera never looks past the ends of the kitchen", () => {
    for (const t of [-1, ...moments]) {
      const x = kitchen.cameraTarget(t);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(WORLD_W - VIEW_W);
    }
  });
});
