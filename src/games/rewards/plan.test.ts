import { describe, expect, test } from "bun:test";
import { addStar, cellKey, type LinkedDays, NO_LINKED, type StarLog } from "./board";
import { REWARDS_PICTURE_PROMPTS } from "./bilder/prompts";
import { ACTIVITIES, PLAN_TEMPLATES, PLAN_VIEWS, STEP_BY_ID, TASKS, THEME_BY_ID } from "./catalog";
import {
  currentStep,
  distinctSteps,
  exampleTicks,
  MAX_STEPS,
  nightsUntil,
  planFromTemplate,
  restartDay,
  splitDone,
  stepDone,
  stepsOn,
  withSame,
  withSteps,
} from "./plan";
import { planLayout } from "./PlanSheet";
import { DEFAULT_PLANNER_SETTINGS } from "./planSettings";

const promptIds = new Set(REWARDS_PICTURE_PROMPTS.groups.flatMap((g) => g.prompts).map((p) => p.id));
/** A Wednesday. */
const WED = new Date("2026-10-28T12:00");
const SAT = new Date("2026-10-31T12:00");

describe("plan catalogue", () => {
  test("activities have their own ids, apart from the tasks'", () => {
    const ids = [...ACTIVITIES, ...TASKS].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("templates name only what the catalogue has, with one list or seven, and few steps a day", () => {
    for (const tpl of PLAN_TEMPLATES) {
      const lists = typeof tpl.days[0] === "string" ? [tpl.days as string[]] : (tpl.days as string[][]);
      expect([1, 7], tpl.id).toContain(lists.length);
      for (const list of lists) {
        expect(list.length, tpl.id).toBeGreaterThan(0);
        expect(list.length, tpl.id).toBeLessThanOrEqual(MAX_STEPS);
        expect(new Set(list).size, `${tpl.id}: a step twice in a day`).toBe(list.length);
        for (const id of list) expect(STEP_BY_ID.has(id), `${tpl.id}: ${id}`).toBe(true);
      }
      for (const id of Object.keys(tpl.slots ?? {})) expect(STEP_BY_ID.get(id)?.linked, `${tpl.id}: ${id} has a time but no game`).toBeDefined();
      expect(THEME_BY_ID.has(tpl.theme), tpl.theme).toBe(true);
    }
  });

  // Both views are one tap from the first visit, each with a ready-made plan; an Erst–Dann is among them.
  test("every view has a ready-made plan, and there is an Erst–Dann of two cards", () => {
    for (const view of PLAN_VIEWS)
      expect(
        PLAN_TEMPLATES.some((tpl) => tpl.view === view.id),
        view.id,
      ).toBe(true);
    expect(PLAN_TEMPLATES.some((tpl) => tpl.days.length === 2 && typeof tpl.days[0] === "string")).toBe(true);
  });

  test("every activity has a picture prompt, and a line-art twin to colour in", () => {
    for (const { id } of ACTIVITIES) {
      expect(promptIds.has(`schritt-${id}`), id).toBe(true);
      expect(promptIds.has(`schritt-${id}-linie`), id).toBe(true);
    }
  });
});

describe("plans", () => {
  test("a plan from a template is the same on every load, but for its own id", () => {
    for (const tpl of PLAN_TEMPLATES) {
      const a = planFromTemplate(tpl);
      const b = planFromTemplate(tpl);
      expect({ ...a, id: "" }).toEqual({ ...b, id: "" });
      for (const day of a.days) expect(new Set(day.map((s) => s.id)).size).toBe(day.length);
    }
    expect(DEFAULT_PLANNER_SETTINGS.plans[0].id).toBe("erster-plan");
    expect(DEFAULT_PLANNER_SETTINGS.plans[0].examples).toBe(true);
  });

  test("a week plan has each weekday's steps, a routine the same every day", () => {
    const kita = planFromTemplate(PLAN_TEMPLATES.find((tpl) => tpl.id === "kita-tag") ?? PLAN_TEMPLATES[0]);
    expect(stepsOn(kita, WED).some((s) => s.catalog === "kita")).toBe(true);
    expect(stepsOn(kita, SAT).some((s) => s.catalog === "kita")).toBe(false);
    const morning = planFromTemplate(PLAN_TEMPLATES[0]);
    expect(stepsOn(morning, WED)).toEqual(stepsOn(morning, SAT));
  });

  test("the step to do now is the first not done; a tick moves it on, starting over brings it back", () => {
    const plan = planFromTemplate(PLAN_TEMPLATES[0]);
    const steps = stepsOn(plan, WED);
    expect(currentStep(steps, undefined, NO_LINKED, WED)).toBe(0);
    let log = addStar({}, plan.id, cellKey(WED, steps[0].id), WED);
    log = addStar(log, plan.id, cellKey(new Date("2026-10-27T12:00"), steps[1].id), WED);
    expect(currentStep(steps, log[plan.id], NO_LINKED, WED)).toBe(1);
    const all = steps.reduce((l, s) => addStar(l, plan.id, cellKey(WED, s.id), WED), log);
    expect(currentStep(steps, all[plan.id], NO_LINKED, WED)).toBe(-1);
    const again = restartDay(all, plan.id, WED);
    expect(currentStep(steps, again[plan.id], NO_LINKED, WED)).toBe(0);
    expect(Object.keys(again[plan.id])).toEqual([cellKey(new Date("2026-10-27T12:00"), steps[1].id)]);
  });

  // H-42: the row gets shorter from the front until only the last card (the bed) is left; „Von vorn“ empties the box.
  test("done cards leave the row for the Fertig-Kiste, both in the day's order", () => {
    const evening = planFromTemplate(PLAN_TEMPLATES.find((tpl) => tpl.id === "abendroutine") ?? PLAN_TEMPLATES[0]);
    const steps = stepsOn(evening, WED);
    expect(splitDone(steps, undefined, NO_LINKED, WED)).toEqual({ open: steps, done: [] });
    const allButLast = steps.slice(0, -1).reduce<StarLog>((l, s) => addStar(l, evening.id, cellKey(WED, s.id), WED), {});
    expect(splitDone(steps, allButLast[evening.id], NO_LINKED, WED)).toEqual({ open: steps.slice(-1), done: steps.slice(0, -1) });
    expect(steps.at(-1)?.catalog).toBe("schlafen");
    const again = restartDay(allButLast, evening.id, WED);
    expect(splitDone(steps, again[evening.id], NO_LINKED, WED).done).toEqual([]);
  });

  test("brushing ticks the teeth card of its own time of day only", () => {
    const morning = planFromTemplate(PLAN_TEMPLATES.find((tpl) => tpl.id === "morgenroutine") ?? PLAN_TEMPLATES[0]);
    const teeth = stepsOn(morning, WED).find((s) => s.linked === "teeth");
    if (!teeth) throw new Error("no teeth step");
    expect(teeth.slot).toBe("morning");
    const evening: LinkedDays = { ...NO_LINKED, teeth: { "2026-10-28": { count: 1, slots: ["evening"] } } };
    const both: LinkedDays = { ...NO_LINKED, teeth: { "2026-10-28": { count: 2, slots: ["morning", "evening"] } } };
    expect(stepDone(undefined, evening, WED, teeth)).toBe(false);
    expect(stepDone(undefined, both, WED, teeth)).toBe(true);
    expect(stepDone(undefined, both, WED, { ...teeth, slot: undefined })).toBe(true);
  });

  test("example ticks show a plan in use, but never all of a day", () => {
    for (const tpl of PLAN_TEMPLATES) {
      const plan = planFromTemplate(tpl);
      const ticks = exampleTicks(plan, WED);
      const steps = stepsOn(plan, WED);
      expect(Object.keys(ticks).length, tpl.id).toBeGreaterThan(0);
      expect(currentStep(steps, ticks, NO_LINKED, WED), tpl.id).toBeGreaterThan(0);
    }
  });

  test("each weekday its own steps copies the list; every day the same keeps the day looked at", () => {
    const plan = planFromTemplate(PLAN_TEMPLATES[0]);
    const own = withSame(plan, false, 2);
    expect(own.days.length).toBe(7);
    const changed = withSteps(own, 5, []);
    expect(stepsOn(changed, SAT)).toEqual([]);
    expect(stepsOn(changed, WED).length).toBe(stepsOn(plan, WED).length);
    expect(withSame(changed, true, 5).days).toEqual([[]]);
    expect(distinctSteps(own).length).toBe(stepsOn(plan, WED).length);
  });

  test("nights until a day", () => {
    expect(nightsUntil(WED, new Date("2026-10-28T23:00"))).toBe(0);
    expect(nightsUntil(WED, SAT)).toBe(3);
    expect(nightsUntil(WED, new Date("2026-10-26T08:00"))).toBe(-2);
    // Across the change to winter time (25 October 2026).
    expect(nightsUntil(new Date("2026-10-24T12:00"), new Date("2026-10-26T12:00"))).toBe(2);
  });
});

describe("cards of a day", () => {
  test("two cards stand side by side, many in a tall box go into rows", () => {
    expect(planLayout(2, 1.6)).toEqual({ cols: 2, rows: 1 });
    expect(planLayout(5, 2.4).rows).toBe(1);
    expect(planLayout(6, 0.8).rows).toBeGreaterThan(1);
    for (let n = 1; n <= MAX_STEPS; n++) {
      const { cols, rows } = planLayout(n, 1.4);
      expect(cols * rows).toBeGreaterThanOrEqual(n);
    }
  });
});
