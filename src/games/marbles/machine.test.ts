import { describe, expect, test } from "bun:test";
import { VIEW_W } from "./level";
import { BUTTON, buildMachine, cupHalf, CUPS, cupLying, FLOOR, KNOB_Y, KREISEL, TOWER, TOWER_TOP, TRAIN_STOP, WORLD_W } from "./machine";

describe("Große Maschine", () => {
  const m = buildMachine();

  test("the machine runs 40 to 45 seconds and ends after everything else", () => {
    expect(m.duration).toBeGreaterThan(40);
    expect(m.duration).toBeLessThan(45);
    const last = m.events[m.events.length - 1];
    expect(last.at).toBe(m.duration);
    expect(last.done).toBe(true);
  });

  test("one thing sets off the next, in the order of the story", () => {
    const order = [
      m.tBell,
      m.tLand,
      m.tBucket,
      m.tTrain,
      m.tContact,
      m.tStop,
      m.tGo,
      m.tTower,
      m.tTopple,
      m.tSplit,
      ...m.cupLandings,
      m.tLoopOut,
      m.tButton,
      m.tPop,
      m.duration,
    ];
    order.slice(1).forEach((t, i) => {
      expect(t).toBeGreaterThan(order[i]);
    });
  });

  test("nothing of the new parts moves before the train gets there", () => {
    const still = m.kreiselAt(-1);
    expect(m.kreiselAt(m.tContact - 0.01)).toEqual(still);
    expect(m.cupAt(3, m.tTower - 0.01)).toEqual(m.cupAt(3, -1));
    expect(m.planeAt(m.tTower - 0.01)).toEqual(m.planeAt(-1));
    expect(m.buttonPress(m.tButton - 0.2)).toBe(0);
  });

  test("the locomotive really bumps the top, and the top really reaches the tower", () => {
    expect(m.trainFront(m.tContact) + KREISEL.push).toBeCloseTo(KREISEL.x0, -0.5);
    expect(m.trainFront(m.tStop)).toBe(TRAIN_STOP);
    const atTower = m.kreiselAt(m.tTower - 0.001).pt.x + KREISEL.rx;
    expect(Math.abs(atTower - (TOWER.x - cupHalf(0, KREISEL.mid)))).toBeLessThan(2);
  });

  test("the top stays on the floor, clear of the train and short of the tower", () => {
    for (let t = m.tContact; t < m.duration; t += 0.02) {
      const { pt } = m.kreiselAt(t);
      expect(pt.y).toBeLessThanOrEqual(FLOOR);
      expect(pt.x - KREISEL.push).toBeGreaterThanOrEqual(m.trainFront(t) - 0.5);
      expect(pt.x + KREISEL.rx).toBeLessThanOrEqual(TOWER.x - cupHalf(0, KREISEL.mid) + 0.5);
    }
  });

  test("the cups stack, then each lands on its side on the floor, never sinks into it and lies apart from the others", () => {
    expect(m.cupAt(CUPS.length - 1, 0).pt.y - CUPS[CUPS.length - 1].H / 2).toBeCloseTo(TOWER_TOP);
    const rest = CUPS.map((_, i) => m.cupAt(i, m.duration));
    rest.forEach((cup, i) => {
      expect(cup.pt.y).toBeCloseTo(FLOOR - cupLying(i).lift);
      expect(cup.pt.x).toBeLessThan(WORLD_W);
      if (i > 0) expect(cup.pt.x - rest[i - 1].pt.x).toBeGreaterThan((CUPS[i].H + CUPS[i - 1].H) / 2 + 20);
    });
    for (let i = 0; i < CUPS.length; i++) {
      for (let t = m.cupLandings[i]; t < m.duration; t += 0.02) expect(m.cupAt(i, t).pt.y).toBeLessThanOrEqual(FLOOR - cupLying(i).lift + 0.5);
    }
  });

  test("the paper plane sits on the tower, flies inside the room and pushes in the button", () => {
    expect(m.planeAt(0).pt.y).toBeLessThan(TOWER_TOP);
    for (let t = m.tSplit; t < m.tButton; t += 0.02) {
      const { pt } = m.planeAt(t);
      expect(pt.x).toBeGreaterThan(0);
      expect(pt.x).toBeLessThan(WORLD_W);
      expect(pt.y).toBeGreaterThan(60);
      expect(pt.y).toBeLessThan(FLOOR - 20);
    }
    const hit = m.planeAt(m.tButton - 0.001).pt;
    expect(Math.abs(hit.x - (BUTTON.x - BUTTON.knob + BUTTON.press))).toBeLessThan(6);
    expect(Math.abs(hit.y - KNOB_Y)).toBeLessThan(6);
    expect(m.buttonPress(m.tButton)).toBe(BUTTON.press);
    expect(m.planeAt(m.duration).pt.y).toBeLessThanOrEqual(FLOOR);
  });

  test("the camera never looks past the ends of the playroom", () => {
    for (let t = -1; t <= m.duration; t += 0.05) {
      const x = m.cameraTarget(t);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(WORLD_W - VIEW_W);
    }
  });
});
