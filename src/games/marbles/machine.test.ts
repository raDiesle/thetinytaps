import { describe, expect, test } from "bun:test";
import { VIEW_W } from "./level";
import {
  BUTTON,
  buildMachine,
  CAR_BACK,
  CRADLE,
  cradleX,
  cupHalf,
  CUPS,
  cupLying,
  DRAWER,
  FLOOR,
  HOOP,
  HOOP_X0,
  HOOP_X1,
  KEY_Y,
  KNOB_TOP,
  KREISEL,
  PENGUIN,
  penguinParts,
  REGISTER,
  TABLE,
  TOWER,
  TOWER_TOP,
  TRAIN_STOP,
  WHEEL,
  WORLD_W,
} from "./machine";

describe("Große Maschine", () => {
  const m = buildMachine();

  test("the machine runs about a minute and ends after everything else", () => {
    expect(m.duration).toBeGreaterThan(56);
    expect(m.duration).toBeLessThan(64);
    const last = m.events[m.events.length - 1];
    expect(last.at).toBe(m.duration);
    expect(last.done).toBe(true);
  });

  test("one thing sets off the next, in the order of the story", () => {
    const order = [
      m.tBell,
      m.tHit,
      ...m.taps,
      m.tCar,
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
      m.tKey,
      m.tHoop,
      m.tHoopHit,
      m.tFlat,
      m.tTop,
      m.tLeap,
      m.tFloat,
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
    expect(m.keyPress(m.tKey - 0.2)).toBe(0);
    expect(m.drawerOut(m.tKey)).toBe(0);
    expect(m.hoopAt(m.tHoop - 0.001)).toEqual(m.hoopAt(-1));
    expect(m.wheelTurn(m.tHoopHit - 0.001)).toBeCloseTo(0);
    expect(m.jumperAt(m.tHoopHit - 0.001)).toEqual(m.jumperAt(-1));
    expect(m.buttonPress(m.tButton - 0.001)).toBe(0);
  });

  test("the marble really knocks the cradle's first ball, the last one taps the penguin, and the penguin's head bonks the car", () => {
    const ballR = CRADLE.r;
    expect(m.marbleAt(m.tHit).pt.x).toBeCloseTo(cradleX(0) - 2 * ballR, 0);
    expect(m.marbleAt(m.tHit).pt.y).toBeCloseTo(m.cradleBall(0, m.tHit).y, 0);
    // At each tap the last ball, swung out all the way, touches the upright penguin's belly.
    for (const t of m.taps) {
      const ball = m.cradleBall(CRADLE.n - 1, t);
      const { body } = penguinParts(m.penguinTilt(t));
      expect(Math.abs(Math.hypot(ball.x - body.x, ball.y - body.y) - (PENGUIN.body + ballR))).toBeLessThan(1);
    }
    // Leaning furthest, its head just touches the top of the car's back.
    const { head } = penguinParts(m.penguinTilt(m.tCar));
    expect(Math.hypot(head.x - CAR_BACK.x, head.y - CAR_BACK.y)).toBeCloseTo(PENGUIN.head, 0);
    expect(m.carAt(m.tCar - 0.01).pt.x).toBe(m.carAt(-1).pt.x);
    expect(m.carAt(m.tCar + 0.3).pt.x).toBeGreaterThan(m.carAt(-1).pt.x);
  });

  test("the cradle's balls never sink into each other, the marble or the penguin, and the penguin never into the car", () => {
    const r = CRADLE.r;
    for (let t = m.tHit; t < m.tCar + 4; t += 0.01) {
      const balls = Array.from({ length: CRADLE.n }, (_, i) => m.cradleBall(i, t));
      for (let i = 1; i < CRADLE.n; i++) expect(balls[i].x - balls[i - 1].x).toBeGreaterThan(2 * r - 0.5);
      const marble = m.marbleAt(t).pt;
      expect(Math.hypot(balls[0].x - marble.x, balls[0].y - marble.y)).toBeGreaterThan(2 * r - 1);
      const { body, head } = penguinParts(m.penguinTilt(t));
      expect(Math.hypot(balls[CRADLE.n - 1].x - body.x, balls[CRADLE.n - 1].y - body.y)).toBeGreaterThan(PENGUIN.body + r - 1);
      if (t <= m.tCar) expect(Math.hypot(head.x - CAR_BACK.x, head.y - CAR_BACK.y)).toBeGreaterThan(PENGUIN.head - 0.5);
      // The penguin rocks on the table, never further than its last rock.
      expect(Math.abs(m.penguinTilt(t))).toBeLessThanOrEqual(PENGUIN.leans[PENGUIN.leans.length - 1] + 1e-9);
      expect(body.y).toBeLessThan(TABLE.y);
    }
  });

  test("the plane rings the register, the drawer pushes the hoop, and the hoop rolls into the lowest gondola", () => {
    const hit = m.planeAt(m.tKey - 0.001).pt;
    expect(Math.abs(hit.x - (REGISTER.x - REGISTER.key + REGISTER.press))).toBeLessThan(6);
    expect(Math.abs(hit.y - KEY_Y)).toBeLessThan(6);
    expect(m.keyPress(m.tKey)).toBe(REGISTER.press);
    // The drawer's front meets the hoop's ring at the drawer's height.
    const front = REGISTER.x + REGISTER.w + m.drawerOut(m.tHoop);
    const hoop0 = m.hoopAt(m.tHoop).pt;
    expect(Math.hypot(front - hoop0.x, DRAWER.y - hoop0.y)).toBeCloseTo(HOOP.r, 0);
    expect(hoop0.x).toBeCloseTo(HOOP_X0);
    // The drawer never reaches into the rolling hoop.
    for (let t = m.tHoop; t < m.tHoop + 1; t += 0.01) {
      const pt = m.hoopAt(t).pt;
      expect(Math.hypot(REGISTER.x + REGISTER.w + m.drawerOut(t) - pt.x, DRAWER.y - pt.y)).toBeGreaterThan(HOOP.r - 1);
    }
    // It reaches the lowest gondola's top left corner.
    const end = m.hoopAt(m.tHoopHit - 0.001).pt;
    expect(end.x).toBeCloseTo(HOOP_X1, 0);
    const gondola = m.gondolaAt(0, m.tHoopHit).pin;
    expect(Math.hypot(gondola.x - WHEEL.w / 2 - end.x, gondola.y + WHEEL.hang - end.y)).toBeCloseTo(HOOP.r, 0);
  });

  test("the hoop stays on the floor and never runs into a gondola, also while it falls over and the wheel turns", () => {
    for (let t = m.tHoop; t < m.duration; t += 0.01) {
      const { pt, round } = m.hoopAt(t);
      expect(pt.y + HOOP.r * round).toBeCloseTo(FLOOR, 5);
      for (let i = 0; i < WHEEL.n; i++) {
        const { pin } = m.gondolaAt(i, t);
        const box = { x0: pin.x - WHEEL.w / 2, x1: pin.x + WHEEL.w / 2, y0: pin.y + WHEEL.hang, y1: pin.y + WHEEL.hang + WHEEL.h };
        for (let k = 0; k < 72; k++) {
          const a = (k * Math.PI) / 36;
          const x = pt.x + HOOP.r * Math.cos(a);
          const y = pt.y + HOOP.r * round * Math.sin(a);
          const inside = x > box.x0 + 1 && x < box.x1 - 1 && y > box.y0 + 1 && y < box.y1 - 1;
          expect({ t: Math.round(t * 100) / 100, i, inside }).toEqual({ t: Math.round(t * 100) / 100, i, inside: false });
        }
      }
    }
  });

  test("the wheel carries the parachutist to the top, and he floats down onto the button's knob, inside the room", () => {
    expect(m.gondolaAt(0, -1).pin.y).toBeCloseTo(WHEEL.cy + WHEEL.r);
    const top = m.gondolaAt(0, m.tTop).pin;
    expect(top.x).toBeCloseTo(WHEEL.cx);
    expect(top.y).toBeCloseTo(WHEEL.cy - WHEEL.r);
    // He rides in his gondola until he leaps.
    for (let t = 0; t < m.tLeap; t += 0.05) {
      const { feet } = m.jumperAt(t);
      const { pin } = m.gondolaAt(0, t);
      expect(Math.hypot(feet.x - pin.x, feet.y - pin.y)).toBeLessThan(WHEEL.hang + WHEEL.h);
    }
    for (let t = m.tLeap; t < m.duration; t += 0.02) {
      const { feet, open } = m.jumperAt(t);
      expect(feet.x).toBeLessThan(WORLD_W - 100);
      // The open parachute, about 150 above his feet, stays below the top of the picture.
      expect(feet.y - 150 * open).toBeGreaterThan(30);
      expect(feet.y).toBeLessThanOrEqual(FLOOR);
      // Floating down he stays clear of the wheel's rim.
      if (t > m.tFloat && t < m.tButton) expect(Math.hypot(feet.x - WHEEL.cx, feet.y - WHEEL.cy)).toBeGreaterThan(WHEEL.r + 40);
    }
    const land = m.jumperAt(m.tButton).feet;
    expect(land.x).toBeCloseTo(BUTTON.x + BUTTON.w / 2);
    expect(land.y).toBeCloseTo(KNOB_TOP);
    expect(m.buttonPress(m.tButton + 1)).toBe(BUTTON.press);
    expect(m.jumperAt(m.duration).feet.y).toBeCloseTo(KNOB_TOP + BUTTON.press);
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

  test("the paper plane sits on the tower and flies inside the room", () => {
    expect(m.planeAt(0).pt.y).toBeLessThan(TOWER_TOP);
    for (let t = m.tSplit; t < m.tKey; t += 0.02) {
      const { pt } = m.planeAt(t);
      expect(pt.x).toBeGreaterThan(0);
      expect(pt.x).toBeLessThan(WORLD_W);
      expect(pt.y).toBeGreaterThan(60);
      expect(pt.y).toBeLessThan(FLOOR - 20);
    }
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
