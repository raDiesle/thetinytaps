import { describe, expect, test } from "bun:test";
import {
  BREADBOX,
  buildKitchen,
  COFFEE,
  COOKTOP,
  CORK,
  CORK0,
  COUNTER,
  CRANK,
  EGG,
  EGG0,
  HONEY,
  HONEY_MOUTH_X,
  JAR,
  JELLY,
  JELLY_TOP,
  KNOB_Y,
  MILL,
  onPan,
  PAN,
  PAN_DOWN,
  PAN_REST,
  PANCAKE,
  PLATE,
  SPINNER,
  TIMER,
  TRAY,
  WEDGE,
  WORLD_W,
} from "./kitchen";
import { VIEW_W } from "./level";

describe("Verrückte Küche", () => {
  const kitchen = buildKitchen();
  const end = kitchen.duration;
  /** Every moment from the tap to the end, a tenth of a second apart. */
  const moments = Array.from({ length: Math.ceil(end * 10) + 1 }, (_, i) => i / 10);

  test("the machine runs about a minute and ends after everything else", () => {
    expect(end).toBeGreaterThan(56);
    expect(end).toBeLessThan(64);
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
      ...k.nudges,
      k.tPress,
      k.tGrind,
      k.tPour,
      k.tBrewed,
      k.tCork,
      k.tEggHit,
      k.tEggOut,
      k.tTray,
      k.tJar,
      k.tJarDown,
      k.tOoze,
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
    const still = (t: number) => [
      kitchen.crankAngle(t),
      kitchen.lidAt(t),
      kitchen.timerAt(t),
      kitchen.panAngle(t),
      kitchen.pancakeAt(t),
      kitchen.leafAt(0, t),
      kitchen.jellyAt(t),
      kitchen.millTilt(t),
      kitchen.corkAt(t),
      kitchen.eggAt(t),
      kitchen.jarTilt(t),
      kitchen.honeyLidAt(t),
    ];
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

  test("the pancake flies high over the cookie jar and lands flat on the jelly", () => {
    for (let t = kitchen.tToss; t <= kitchen.tCake; t += 0.02) {
      const { pt } = kitchen.pancakeAt(t);
      expect(pt.y - PANCAKE.r).toBeGreaterThan(0);
      expect(pt.x).toBeLessThan(WORLD_W);
      // The timer has left the jar by now; however the pancake turns, it never touches the jar.
      const nearest = { x: Math.min(JAR.x1, Math.max(JAR.x0, pt.x)), y: Math.min(COUNTER, Math.max(JAR.top, pt.y)) };
      expect(Math.hypot(pt.x - nearest.x, pt.y - nearest.y)).toBeGreaterThan(PANCAKE.r + 10);
    }
    const landed = kitchen.pancakeAt(kitchen.tCake);
    expect(landed.pt).toEqual({ x: JELLY.cx, y: JELLY_TOP - PANCAKE.h / 2 });
    expect(landed.angle % 360).toBe(0);
  });

  test("the pancake rides the jelly, whose sways nudge the pepper mill twice and tip it over the third time", () => {
    const k = kitchen;
    const millPivot = MILL.x0 + MILL.w;
    /** The mill's left side at height `up` above the counter, while it tilts. */
    const millLeft = (t: number, up: number) => {
      const a = (k.millTilt(t) * Math.PI) / 180;
      return millPivot - MILL.w * Math.cos(a) + up * Math.sin(a);
    };
    for (let t = k.tCake; t < k.tPress; t += 0.01) {
      const { sway, squash } = k.jellyAt(t);
      expect(k.pancakeAt(t).pt.x).toBeCloseTo(JELLY.cx + sway, 5);
      // The jelly's top right corner never pushes into the mill.
      const up = JELLY.plateH + JELLY.h * squash;
      expect(JELLY.cx + JELLY.top / 2 + sway).toBeLessThan(millLeft(t, up) + 0.5);
    }
    // At each nudge it really touches the upright mill.
    for (const tn of k.nudges) {
      expect(k.millTilt(tn)).toBeCloseTo(0, 5);
      expect(JELLY.cx + JELLY.top / 2 + k.jellyAt(tn).sway).toBeCloseTo(MILL.x0, 3);
    }
    expect(k.millTilt(k.nudges[0] + 0.3)).toBeGreaterThan(2);
    expect(k.millTilt(k.nudges[1] + 0.3)).toBeGreaterThan(k.millTilt(k.nudges[0] + 0.3));
  });

  test("the falling mill comes to rest on the coffee machine's button and pushes it in", () => {
    const k = kitchen;
    expect(k.buttonIn(k.tTopple)).toBe(0);
    expect(k.buttonIn(k.tPress - 0.2)).toBeLessThan(COFFEE.button - COFFEE.pressed);
    expect(k.buttonIn(k.tPress)).toBeCloseTo(COFFEE.button - COFFEE.pressed, 3);
    expect(k.buttonIn(end)).toBeCloseTo(COFFEE.button - COFFEE.pressed, 3);
    // Its top right corner rests at the button's height.
    const a = (k.millTilt(k.tPress) * Math.PI) / 180;
    expect(COUNTER - MILL.h * Math.cos(a)).toBeCloseTo(COFFEE.buttonY, 3);
  });

  test("the machine grinds, then pours the cup full, and only then the cork pops", () => {
    const k = kitchen;
    expect(k.coffeeShake(k.tPress)).toBe(0);
    expect(Math.max(...[0.1, 0.5, 1.3].map((d) => Math.abs(k.coffeeShake(k.tGrind + d))))).toBeGreaterThan(0.5);
    expect(k.coffeeShake(k.tPour + 0.1)).toBe(0);
    expect(k.pouring(k.tGrind + 1)).toBe(false);
    expect(k.pouring(k.tPour + 1)).toBe(true);
    expect(k.cupFull(k.tPour)).toBe(0);
    expect(k.cupFull(k.tBrewed)).toBe(1);
    expect(k.fizz(k.tGrind)).toBe(0);
    expect(k.fizz(k.tBrewed)).toBe(1);
    // Until it pops, the cork sits in the neck (creeping up a little).
    expect(k.corkAt(k.tPour).pt).toEqual(CORK0);
    expect(CORK0.y - k.corkAt(k.tCork - 0.01).pt.y).toBeLessThan(CORK.h);
  });

  test("the cork flies over the machine onto the egg, and drops onto the bread box", () => {
    const k = kitchen;
    for (let t = k.tCork; t < k.tEggHit; t += 0.02) {
      const { pt } = k.corkAt(t);
      expect(pt.y).toBeGreaterThan(20);
      if (pt.x < COFFEE.x0 + COFFEE.w + CORK.h) expect(pt.y).toBeLessThan(COFFEE.top - CORK.h);
    }
    const hit = k.corkAt(k.tEggHit).pt;
    expect(Math.hypot(hit.x - EGG0.x, hit.y - EGG0.y)).toBeLessThan(EGG.ry + CORK.h / 2);
    expect(k.eggAt(k.tEggHit - 0.01).pt).toEqual(EGG0);
    const lying = k.corkAt(end);
    expect(lying.pt.y + CORK.w / 2).toBeCloseTo(BREADBOX.top, 5);
    expect(lying.angle % 180).toBe(90);
  });

  test("the egg wobbles down the tray and along the counter, never sinking in, and lies still against the honey jar", () => {
    const k = kitchen;
    const surface = (x: number) => (x < TRAY.to.x ? TRAY.from.y + ((x - TRAY.from.x) * (TRAY.to.y - TRAY.from.y)) / (TRAY.to.x - TRAY.from.x) : COUNTER);
    for (let t = k.tTray; t <= k.tJar; t += 0.02) {
      const { pt } = k.eggAt(t);
      expect(pt.y).toBeLessThanOrEqual(surface(pt.x) - EGG.rx + 0.5);
    }
    const rest = k.eggAt(k.tJar);
    expect(((rest.angle % 180) + 180) % 180).toBeCloseTo(90, 3);
    expect(rest.pt.x + EGG.ry).toBeCloseTo(HONEY.x0, 3);
    expect(rest.pt.y).toBeCloseTo(COUNTER - EGG.rx, 3);
  });

  test("the honey jar falls on its side, its lid lands clear of the egg, and the honey reaches the touch field at the beep", () => {
    const k = kitchen;
    expect(k.jarTilt(k.tJar - 0.01)).toBe(0);
    expect(k.jarTilt(end)).toBeCloseTo(90, 5);
    expect(HONEY_MOUTH_X).toBeLessThan(COOKTOP.x0);
    const lid = k.honeyLidAt(end);
    expect(lid.pt.y + HONEY.lid / 2).toBeCloseTo(COUNTER, 5);
    expect(lid.pt.x + HONEY.w / 2 + 4).toBeLessThan(k.eggAt(end).pt.x - EGG.ry);
    expect(k.honeyFront(k.tOoze)).toBe(HONEY_MOUTH_X);
    expect(k.honeyFront(k.tBeep - 0.1)).toBeLessThan(COOKTOP.touchX);
    expect(k.honeyFront(k.tBeep)).toBe(COOKTOP.touchX);
  });

  test("the camera never looks past the ends of the kitchen", () => {
    for (const t of [-1, ...moments]) {
      const x = kitchen.cameraTarget(t);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(WORLD_W - VIEW_W);
    }
  });
});
