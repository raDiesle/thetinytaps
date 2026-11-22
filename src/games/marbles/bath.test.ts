import { describe, expect, test } from "bun:test";
import {
  ARC_H,
  BUBBLES,
  buildBath,
  DRYER,
  DRYER_SWITCH,
  DUCK,
  DUCK_ON_SOAP,
  FLOOR,
  HANDLE,
  HOLDER,
  LAMP,
  LID_OPEN,
  LID_REST,
  MUG,
  NOZZLE,
  PLUNGER,
  PLUNGER_HIT,
  PLUNGER_PRESSED,
  PULL,
  PULL_DOWN,
  plungerTop,
  ROLL,
  SOAP,
  START,
  TOILET,
  TUB,
  WALK,
  WAND,
  WASHER,
  WHALE,
  WORLD_W,
} from "./bath";

describe("Badezimmer", () => {
  const bath = buildBath();

  test("the machine runs about a minute and ends after everything else", () => {
    expect(bath.duration).toBeGreaterThan(56);
    expect(bath.duration).toBeLessThan(64);
    expect(Math.max(...bath.events.map((e) => e.at))).toBe(bath.duration);
    expect(bath.events.filter((e) => e.done)).toHaveLength(1);
  });

  test("one thing sets off the next, in the order of the story", () => {
    const order = [
      bath.tBlobLand,
      bath.tInMug,
      bath.tTopple,
      bath.tHit,
      bath.tLever,
      bath.tInTub,
      bath.tFull,
      bath.tSurf,
      bath.tOnSoap,
      bath.tKnock,
      bath.tLoose,
      bath.tPress,
      bath.tFlush,
      bath.tLidPop,
      bath.tBonk,
      bath.tRollLand,
      bath.tKey,
      bath.tWound,
      bath.tWake,
      bath.tWalk,
      bath.tStop,
      bath.tFountain,
      bath.tHitStart,
      bath.tFill,
      bath.tTumble,
      bath.tSpin,
      bath.tWalkOff,
      bath.tHitDryer,
      bath.tDryer,
      bath.tCapLand,
      bath.tLast,
      bath.duration,
    ];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
  });

  test("the falling mug really reaches the duck, and nothing moves it before", () => {
    expect(bath.tHit).toBeLessThan(bath.tTopple + 0.5);
    expect(bath.duckAt(bath.tHit - 0.01).pt).toEqual({ x: DUCK.x, y: DUCK.y });
    expect(DUCK.x - MUG.x).toBeGreaterThan(MUG.w);
  });

  test("the duck floats in the tub until it overflows, and the water never rises over the rim", () => {
    for (let t = bath.tInTub; t < bath.tSurf; t += 0.1) {
      const { pt } = bath.duckAt(t);
      expect(pt.x).toBeGreaterThan(TUB.x0 + 40);
      expect(pt.x).toBeLessThan(TUB.x1 - 40);
      expect(pt.y).toBeLessThan(TUB.bottom);
    }
    for (let t = 0; t <= bath.duration; t += 0.1) expect(bath.waterY(t)).toBeGreaterThanOrEqual(TUB.rim);
  });

  test("the wave carries the duck onto the soap, and the soap only slides once the duck sits on it, until it bumps the plunger", () => {
    const landed = bath.duckAt(bath.tOnSoap).pt;
    expect(Math.abs(landed.x - SOAP.x)).toBeLessThan(1);
    expect(landed.y).toBeCloseTo(DUCK_ON_SOAP, 5);
    expect(DUCK_ON_SOAP + 40).toBeLessThanOrEqual(FLOOR - SOAP.h + 4);
    expect(SOAP.x - SOAP.w / 2).toBeGreaterThan(TUB.x1);
    expect(bath.soapX(bath.tGlide - 0.01)).toBe(SOAP.x);
    // Riding along on it, still sliding when it bumps the plunger's cup.
    for (let t = bath.tOnSoap; t <= bath.duration; t += 0.1) expect(Math.abs(bath.duckAt(t).pt.x - bath.soapX(t))).toBeLessThan(1e-9);
    expect(bath.soapX(bath.tKnock) + SOAP.w / 2).toBeCloseTo(PLUNGER.x - PLUNGER.cupW / 2 - 2, 3);
    expect(bath.soapX(bath.tKnock) - bath.soapX(bath.tKnock - 0.05)).toBeGreaterThan(3);
    expect(bath.soapX(bath.duration)).toBe(bath.soapX(bath.tKnock));
    expect(bath.plungerTilt(bath.tKnock)).toBe(0);
  });

  test("the plunger rocks loose and its knob comes down on the pull handle, which only then goes down", () => {
    expect(bath.plungerTilt(bath.tLoose)).toBeCloseTo(12, 5);
    expect(bath.plungerTilt(bath.tPress)).toBeCloseTo(PLUNGER_HIT, 5);
    const knob = plungerTop(PLUNGER_HIT);
    // The knob (r 11) lands on the handle's top (7 above its middle), on the handle's left part.
    expect(PULL.y - 7 - (knob.y + 11)).toBeCloseTo(-1, 0);
    expect(knob.x).toBeGreaterThan(PULL.x - PULL.half);
    expect(plungerTop(PLUNGER_PRESSED).x).toBeLessThan(PULL.x + PULL.half - 8);
    for (let t = -1; t < bath.tPress; t += 0.05) expect(bath.pullAt(t)).toEqual(PULL);
    expect(bath.pullAt(bath.duration).y - PULL.y).toBeCloseTo(PULL_DOWN, 0);
    // Rocking, the knob never reaches the handle; nor does the stick touch the bowl in front of it.
    for (let t = bath.tKnock; t < bath.tLoose; t += 0.02) expect(plungerTop(bath.plungerTilt(t)).x).toBeLessThan(PULL.x - PULL.half - 20);
    const foot = { x: PLUNGER.x + PLUNGER.cupW / 2, y: FLOOR };
    const pressed = plungerTop(PLUNGER_PRESSED);
    const atRim = foot.x + ((pressed.x - foot.x) * (FLOOR - TOILET.hinge.y)) / (FLOOR - pressed.y);
    expect(atRim).toBeLessThan(TOILET.hinge.x - TOILET.bowl - 20);
  });

  test("the flush bursts the lid open, the lid really hits the roll, and nothing it sweeps past is in its way", () => {
    expect(bath.tFlush).toBeGreaterThan(bath.tPress);
    expect(bath.pipeWater(bath.tFlush - 0.01).front).toBe(0);
    expect(bath.pipeWater(bath.tLidPop).front).toBe(1);
    expect(bath.lidAngle(bath.tLidPop)).toBe(0);
    expect(bath.lidGap(bath.lidAngle(bath.tBonk))).toBeLessThanOrEqual(0);
    expect(bath.lidGap(bath.lidAngle(bath.tBonk - 0.01))).toBeGreaterThan(0);
    expect(bath.lidAngle(bath.tBonk)).toBeLessThan(LID_OPEN);
    expect(bath.lidAngle(bath.duration)).toBeCloseTo(LID_REST, 1);
    // The lid's reach stays clear of the pull handle and the plunger's knob leaning on it.
    const reach = TOILET.lid + 8;
    const handleEnd = { x: PULL.x + PULL.half, y: PULL.y + PULL_DOWN + 7 };
    expect(Math.hypot(handleEnd.x - TOILET.hinge.x, handleEnd.y - TOILET.hinge.y)).toBeGreaterThan(reach);
    const knob = plungerTop(PLUNGER_PRESSED);
    expect(Math.hypot(knob.x - TOILET.hinge.x, knob.y - TOILET.hinge.y)).toBeGreaterThan(reach + 11);
    // The roll stays on its holder until the lid hits it.
    expect(bath.rollAt(bath.tBonk - 0.01).pt).toEqual({ x: HOLDER.x, y: HOLDER.y });
    expect(bath.ribbon(bath.tBonk - 0.01)).toBeNull();
    for (let i = 0; i < 6; i++) expect(bath.spray(i, bath.tLidPop - 0.01)).toBeNull();
  });

  test("the roll stays on the floor and in the world, and gets thinner as its paper unrolls", () => {
    let last = ROLL.r;
    for (let t = bath.tBonk; t <= bath.tKey; t += 0.02) {
      const { pt, r } = bath.rollAt(t);
      expect(pt.y + r).toBeLessThanOrEqual(FLOOR + 0.5);
      expect(pt.x - r).toBeGreaterThan(0);
      expect(pt.x + r).toBeLessThan(WORLD_W);
      expect(r).toBeLessThanOrEqual(last + 1e-9);
      expect(r).toBeGreaterThanOrEqual(ROLL.core);
      last = r;
    }
    expect(last).toBeLessThan(ROLL.r - 10);
    // It is still rolling when it gets to the key.
    expect(bath.rollAt(bath.tKey).pt.x - bath.rollAt(bath.tKey - 0.05).pt.x).toBeGreaterThan(3);
  });

  test("the roll really reaches the whale's key, and the whale waits for it", () => {
    const roll = bath.rollAt(bath.tKey);
    const key = bath.keyTip(bath.tKey);
    expect(Math.hypot(key.x - roll.pt.x, key.y - roll.pt.y)).toBeLessThan(roll.r + 5);
    for (let t = -1; t < bath.tWalk; t += 0.1) expect(bath.whaleAt(t).x).toBe(WHALE.x);
    expect(bath.whaleAt(bath.tKey - 0.01).keyTurn).toBe(0);
    expect(bath.whaleAt(bath.tWound).keyTurn).toBeGreaterThan(700);
  });

  test("the whale's fountain arcs over the washer's edge right onto its start button, which only then turns it on", () => {
    expect(bath.whaleAt(bath.tStop).x).toBe(WHALE.stop);
    expect(WHALE.stop + WHALE.half).toBeLessThan(WASHER.x0 - 30);
    expect(bath.fountainAt(bath.tFountain - 0.01)).toBeNull();
    expect(bath.fountainAt(bath.tHitStart)?.reach).toBe(1);
    const end = bath.arcAt(1);
    expect(Math.hypot(end.x - START.x, end.y - START.y)).toBeLessThan(1e-9);
    // The washer is seen face on: the arc crosses its left edge above its top, then falls onto the panel's button.
    for (let k = 0; k <= 1; k += 0.01) {
      const p = bath.arcAt(k);
      if (p.x > WASHER.x0 - 10 && p.x < WASHER.x0 + 20) expect(p.y).toBeLessThan(FLOOR - WASHER.h - 10);
    }
    expect(ARC_H).toBeGreaterThan(0);
    expect(bath.washerAt(bath.tHitStart - 0.01).on).toBe(false);
    expect(bath.washerAt(bath.tHitStart).on).toBe(true);
    expect(bath.washWater(bath.tFill)).toBe(0);
    expect(bath.washWater(bath.tTumble)).toBe(1);
    expect(bath.drumTurn(bath.tTumble)).toBe(0);
  });

  test("the spinning washer walks on its feet until its side presses the dryer's switch, and the dryer waits for it", () => {
    for (let t = -1; t < bath.tWalkOff; t += 0.05) expect(bath.washerAt(t).x).toBe(WASHER.x0);
    let last = WASHER.x0;
    for (let t = bath.tWalkOff; t <= bath.duration; t += 0.02) {
      const { x, lift } = bath.washerAt(t);
      expect(x).toBeGreaterThanOrEqual(last - 1e-9);
      expect(lift).toBeGreaterThanOrEqual(0);
      expect(lift).toBeLessThanOrEqual(10);
      last = x;
    }
    expect(bath.washerAt(bath.tHitDryer - 0.01).x).toBeLessThan(WASHER.x0 + WALK);
    expect(bath.washerAt(bath.tHitDryer).x).toBe(WASHER.x0 + WALK);
    expect(WASHER.x0 + WALK + WASHER.w).toBeCloseTo(DRYER_SWITCH.x - DRYER_SWITCH.r, 5);
    // Its top is above the switch and below the dryer's barrel, so its side meets the switch and nothing else.
    expect(FLOOR - WASHER.h).toBeLessThan(DRYER_SWITCH.y - DRYER_SWITCH.r);
    expect(FLOOR - WASHER.h - 10).toBeGreaterThan(DRYER.y + 36);
    expect(HANDLE.x - 16).toBeGreaterThan(DRYER_SWITCH.x - DRYER_SWITCH.r);
    // The drum stops again after the switch.
    expect(bath.drumTurn(bath.duration)).toBeCloseTo(bath.drumTurn(bath.tHitDryer + 1.6), 5);
    expect(bath.dryerAngle(bath.tHitDryer - 0.01)).toBe(0);
    expect(bath.blowing(bath.tDryer - 0.01)).toBe(0);
    expect(bath.blowing(bath.tDryer + 0.5)).toBe(1);
    // The wand stands in the dryer's air.
    expect(WAND.x).toBeGreaterThan(NOZZLE.x);
    expect(Math.abs(WAND.y - NOZZLE.y)).toBeLessThan(WAND.r);
  });

  test("the shower cap flies onto the lamp and stays in the bathroom on its way", () => {
    for (let t = bath.tDryer; t < bath.tCapLand; t += 0.05) {
      const cap = bath.capAt(t);
      expect(cap).not.toBeNull();
      expect(cap?.pt.y).toBeGreaterThan(60);
      expect(cap?.pt.x).toBeLessThan(WORLD_W - 50);
    }
    const last = bath.capAt(bath.tCapLand - 0.001);
    expect(Math.hypot((last?.pt.x ?? 0) - bath.capOn.x, (last?.pt.y ?? 0) - bath.capOn.y)).toBeLessThan(5);
    expect(bath.capAt(bath.tCapLand)).toBeNull();
    expect(Math.abs(bath.capOn.x - LAMP.x)).toBeLessThan(1);
  });

  test("every bubble pops at the lamp and stays in the bathroom on its way", () => {
    for (let i = 0; i < BUBBLES; i++) {
      const tPop = bath.tPop[i];
      const last = bath.bubbleAt(i, tPop - 0.01);
      expect(last).not.toBeNull();
      expect(Math.hypot((last?.pt.x ?? 0) - LAMP.x, (last?.pt.y ?? 0) - (LAMP.y + LAMP.r))).toBeLessThan(20);
      expect(bath.bubbleAt(i, tPop)).toBeNull();
      for (let t = tPop - 8; t < tPop; t += 0.1) {
        const b = bath.bubbleAt(i, t);
        if (!b) continue;
        expect(b.pt.y).toBeGreaterThan(40);
        expect(b.pt.x).toBeLessThan(WORLD_W);
      }
    }
  });

  test("the camera shows the plunger, the pull handle and the roll together while the toilet flushes", () => {
    for (let t = bath.tKnock; t < bath.tBonk; t += 0.1) {
      const left = bath.cameraTarget(t);
      expect(left).toBeLessThan(PLUNGER.x - 200);
      expect(left + 1600).toBeGreaterThan(HOLDER.x + 200);
    }
  });

  test("the camera stays still before the tap and ends on the dryer and the lamp", () => {
    expect(bath.cameraTarget(-1)).toBe(0);
    const left = bath.cameraTarget(bath.duration);
    expect(left).toBeLessThan(HANDLE.x - 60);
    expect(left + 1600).toBeGreaterThan(LAMP.x + 200);
  });
});
