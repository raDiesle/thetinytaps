import { describe, expect, test } from "bun:test";
import { CATEGORIES } from "@/content/games";
import { finishRoutineStep, routineReturn, takeFinishedStep, waitForStep } from "@/lib/routine";
import { addStar, cellKey, type LinkedDays, NO_LINKED, type StarLog } from "./board";
import { REWARDS_PICTURE_PROMPTS } from "./bilder/prompts";
import { ACTIVITIES, DAY_CARDS, PLAN_TEMPLATES, PLAN_VIEWS, STEP_BY_ID, TASKS, THEME_BY_ID } from "./catalog";
import {
  currentStep,
  DAY_SHAPES,
  dayCards,
  distinctSteps,
  fromOlder,
  exampleTicks,
  gameOf,
  MAX_PART_STEPS,
  MAX_STEPS,
  MIN_PART_STEPS,
  nightsUntil,
  nowSteps,
  pairsOf,
  parseRoutineStep,
  partRoom,
  partsOf,
  planFromTemplate,
  restartDay,
  routineStep,
  shapeOf,
  splitDone,
  stepDone,
  stepLimit,
  stepFromCatalog,
  stepsOn,
  templateLists,
  withSame,
  withShape,
  withSteps,
} from "./plan";
import { printsCards } from "./PlanPrint";
import { planLayout } from "./PlanSheet";
import { DEFAULT_PLANNER_SETTINGS, plannerDefaults } from "./planSettings";

/** A ready-made plan by its id. */
const template = (id: string) => {
  const tpl = PLAN_TEMPLATES.find((t) => t.id === id);
  if (!tpl) throw new Error(`no template ${id}`);
  return planFromTemplate(tpl);
};

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
      const lists = templateLists(tpl);
      expect([1, 7], tpl.id).toContain(lists.length);
      for (const list of lists) {
        expect(list.length, tpl.id).toBeGreaterThan(0);
        expect(list.length, tpl.id).toBeLessThanOrEqual(MAX_STEPS);
        // A plan of parts may have a card in two of them (Zähne putzen morning and evening), never twice in one.
        if (!tpl.parts) expect(new Set(list).size, `${tpl.id}: a step twice in a day`).toBe(list.length);
        for (const id of list) expect(STEP_BY_ID.has(id), `${tpl.id}: ${id}`).toBe(true);
      }
      for (const part of tpl.parts ?? []) expect(new Set(part.steps).size, `${tpl.id}: a step twice in ${part.slot}`).toBe(part.steps.length);
      for (const id of Object.keys(tpl.slots ?? {})) expect(STEP_BY_ID.get(id)?.linked, `${tpl.id}: ${id} has a time but no game`).toBeDefined();
      expect(THEME_BY_ID.has(tpl.theme), tpl.theme).toBe(true);
    }
  });

  // Every view is one tap from the first visit, each with a ready-made plan; an Erst–Dann fills a page with pairs.
  test("every view has a ready-made plan, and the Erst–Dann is whole pairs, at most four", () => {
    for (const view of PLAN_VIEWS)
      expect(
        PLAN_TEMPLATES.some((tpl) => tpl.view === view.id),
        view.id,
      ).toBe(true);
    for (const tpl of PLAN_TEMPLATES.filter((t) => t.view === "first-then"))
      for (const list of templateLists(tpl)) {
        expect(list.length % 2, tpl.id).toBe(0);
        expect(list.length / 2, tpl.id).toBeLessThanOrEqual(4);
      }
  });

  // Morning and evening belong together: nobody wants one without the other, and they print on one page.
  test("„Mein Tag“ is the morning and the evening on one plan, each card once per part", () => {
    const plan = template("mein-tag");
    const steps = stepsOn(plan, WED);
    expect(partsOf(steps).map((p) => p.part)).toEqual(["morning", "evening"]);
    expect(new Set(steps.map((s) => s.id)).size).toBe(steps.length);
    expect(steps.length).toBeLessThanOrEqual(MAX_STEPS);
    // The teeth card is there twice, each for its own time of day.
    expect(steps.filter((s) => s.linked === "teeth").map((s) => s.slot)).toEqual(["morning", "evening"]);
  });

  // The wizard's first step cuts a Jetzt – Dann day (user feedback, November 2026): what were „Mein Tag“ and the day
  // with Kita are one plan, in two parts or one, with as many cards as asked for.
  test("the cards a Jetzt – Dann is filled with are catalogued, each pool ranked once", () => {
    for (const [name, pool] of Object.entries(DAY_CARDS)) {
      for (const card of pool) expect(STEP_BY_ID.has(card.id), `${name}: ${card.id}`).toBe(true);
      expect(new Set(pool.map((c) => c.rank)).size, name).toBe(pool.length);
    }
    // In parts, the four first of each part are „Mein Tag“ as it was; the whole day's seven are the day with Kita.
    const mine = stepsOn(template("mein-tag"), WED);
    for (const part of ["morning", "evening"] as const)
      expect(dayCards(part, 4).map((s) => s.id)).toEqual(mine.filter((s) => s.part === part).map((s) => s.id));
    expect(DAY_SHAPES.split.counts).toEqual([4, 4]);
    expect(dayCards(undefined, DAY_SHAPES.whole.counts[0]).map((s) => s.catalog)).toEqual([
      "fruehstueck",
      "kita",
      "mittagessen",
      "mittagsschlaf",
      "spielplatz",
      "abendessen",
      "schlafen",
    ]);
  });

  test("every count the wizard allows makes a day of few, unique cards, its teeth cards each with their time", () => {
    const base = template("mein-tag");
    for (const shape of [DAY_SHAPES.split, DAY_SHAPES.whole]) {
      const parts = shape.counts.length;
      for (let i = 0; i < parts; i++)
        for (let n = MIN_PART_STEPS; n <= partRoom(shape, i); n++) {
          const counts = shape.counts.map((c, j) => (j === i ? n : c));
          const steps = withShape(base, { split: shape.split, counts }).days[0];
          expect(shapeOf(steps)).toEqual({ split: shape.split, counts });
          expect(steps.length).toBeLessThanOrEqual(stepLimit(steps));
          for (const part of partsOf(steps)) expect(part.steps.length).toBeLessThanOrEqual(shape.split ? MAX_PART_STEPS : MAX_STEPS);
          expect(new Set(steps.map((s) => s.id)).size).toBe(steps.length);
          for (const s of steps.filter((x) => x.linked === "teeth")) expect(s.slot, s.id).toBeDefined();
        }
    }
  });

  test("changing one part's count keeps the other part's cards as the grown-up chose them", () => {
    const base = template("mein-tag");
    const own = withSteps(
      base,
      0,
      base.days[0].map((s) => (s.part === "evening" && s.catalog === "baden" ? { ...s, label: "Duschen" } : s)),
    );
    const more = withShape(own, { split: true, counts: [5, 4] });
    expect(more.days[0].filter((s) => s.part === "evening")).toEqual(own.days[0].filter((s) => s.part === "evening"));
    expect(more.days[0].filter((s) => s.part === "morning")).toHaveLength(5);
    // One flow instead of parts: the whole day's cards, no part.
    expect(withShape(own, DAY_SHAPES.whole).days[0].every((s) => !s.part)).toBe(true);
  });

  // The old two-card „Jetzt – Dann“ view is now a Jetzt – Dann with the „Jetzt“ field; a marker's plan prints no cards.
  test("an older plan's view reads as today's, and only the „Jetzt“ field needs cards to cut out", () => {
    const old = { ...template("mein-tag"), view: "now-next" } as unknown as ReturnType<typeof template>;
    expect(fromOlder(old)).toMatchObject({ view: "day", nowField: true });
    expect(fromOlder(template("mein-tag"))).toEqual(expect.objectContaining({ view: "day" }));
    expect(printsCards(template("mein-tag"))).toBe("never");
    expect(printsCards({ ...template("mein-tag"), nowField: true })).toBe("always");
    expect(printsCards(template("wochenplan"))).toBe("choice");
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
    // No plan before the wizard made one; an old first plan with ticks stays.
    expect(DEFAULT_PLANNER_SETTINGS.plans).toEqual([]);
    expect(plannerDefaults({})).toBe(DEFAULT_PLANNER_SETTINGS);
    const old = plannerDefaults({ "erster-plan": { "2026-10-28|zaehne": 1 } });
    expect(old.plans.map((p) => [p.id, p.examples])).toEqual([["erster-plan", true]]);
  });

  test("a week plan has each weekday's steps, a routine the same every day", () => {
    const week = template("wochenplan");
    expect(stepsOn(week, WED).some((s) => s.catalog === "kita")).toBe(true);
    expect(stepsOn(week, SAT).some((s) => s.catalog === "kita")).toBe(false);
    const day = template("mein-tag");
    expect(stepsOn(day, WED)).toEqual(stepsOn(day, SAT));
  });

  test("the step to do now is the first not done; a tick moves it on, starting over brings it back", () => {
    const plan = template("mein-tag");
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
    const evening = template("mein-tag");
    const steps = stepsOn(evening, WED);
    expect(splitDone(steps, undefined, NO_LINKED, WED)).toEqual({ open: steps, done: [] });
    const allButLast = steps.slice(0, -1).reduce<StarLog>((l, s) => addStar(l, evening.id, cellKey(WED, s.id), WED), {});
    expect(splitDone(steps, allButLast[evening.id], NO_LINKED, WED)).toEqual({ open: steps.slice(-1), done: steps.slice(0, -1) });
    expect(steps.at(-1)?.catalog).toBe("schlafen");
    const again = restartDay(allButLast, evening.id, WED);
    expect(splitDone(steps, again[evening.id], NO_LINKED, WED).done).toEqual([]);
  });

  test("brushing ticks the teeth card of its own time of day only", () => {
    const teeth = stepsOn(template("mein-tag"), WED).find((s) => s.linked === "teeth");
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
    const plan = template("mein-tag");
    const own = withSame(plan, false, 2);
    expect(own.days.length).toBe(7);
    const changed = withSteps(own, 5, []);
    expect(stepsOn(changed, SAT)).toEqual([]);
    expect(stepsOn(changed, WED).length).toBe(stepsOn(plan, WED).length);
    expect(withSame(changed, true, 5).days).toEqual([[]]);
    expect(distinctSteps(own).length).toBe(stepsOn(plan, WED).length);
  });

  // Each Erst–Dann pair stands on its own: its first open card is „now“, and starting over clears only finished pairs.
  test("an Erst–Dann has a „now“ in every pair; starting over takes only the steps asked", () => {
    const plan = template("erst-dann");
    const steps = stepsOn(plan, WED);
    expect(pairsOf(steps).map((p) => p.length)).toEqual([2, 2, 2, 2]);
    expect(nowSteps("first-then", steps, undefined, NO_LINKED, WED)).toEqual([0, 2, 4, 6]);
    const log = [0, 1, 2].reduce<StarLog>((l, i) => addStar(l, plan.id, cellKey(WED, steps[i].id), WED), {});
    expect(nowSteps("first-then", steps, log[plan.id], NO_LINKED, WED)).toEqual([3, 4, 6]);
    expect(nowSteps("day", steps, log[plan.id], NO_LINKED, WED)).toEqual([3]);
    const again = restartDay(log, plan.id, WED, [steps[0].id, steps[1].id]);
    expect(Object.keys(again[plan.id])).toEqual([cellKey(WED, steps[2].id)]);
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

describe("a card that opens its game", () => {
  test("the teeth card opens Zähne putzen, a page of the home menu; „Nur abhaken“ and other cards only tick", () => {
    const teeth = stepFromCatalog("zaehne", "evening");
    const game = gameOf(teeth);
    expect(game).toBe("/zaehne/");
    expect(CATEGORIES.flatMap((c) => c.games).some((g) => g.href === game)).toBe(true);
    expect(gameOf({ ...teeth, noGame: true })).toBeUndefined();
    expect(gameOf(stepFromCatalog("toepfchen"))).toBeUndefined();
  });

  test("the game goes back only to a page of this app", () => {
    expect(routineReturn({ returnTo: "/tagesplan/" })).toBe("/tagesplan/");
    expect(routineReturn({ returnTo: "//example.com/" })).toBeUndefined();
    expect(routineReturn({ returnTo: "https://example.com/" })).toBeUndefined();
    expect(routineReturn(null)).toBeUndefined();
    expect(routineReturn(undefined)).toBeUndefined();
  });
});

describe("a card the game finished", () => {
  // The visit's storage, as in the browser.
  const store = new Map<string, string>();
  globalThis.sessionStorage ??= {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
  } as Storage;

  test("a finished brushing hands back the card it was opened for, once", () => {
    const step = routineStep("erster-plan", cellKey(WED, "zaehne"));
    expect(parseRoutineStep(step)).toEqual({ planId: "erster-plan", key: "2026-10-28|zaehne" });
    waitForStep("/tagesplan/", step);
    finishRoutineStep();
    expect(takeFinishedStep("/belohnungstafel/")).toBeUndefined();
    expect(takeFinishedStep("/tagesplan/")).toBe(step);
    expect(takeFinishedStep("/tagesplan/")).toBeUndefined();
  });

  test("left before the end, nothing is ticked – and a later brushing from the menu ticks nothing either", () => {
    waitForStep("/tagesplan/", routineStep("erster-plan", cellKey(WED, "zaehne")));
    expect(takeFinishedStep("/tagesplan/")).toBeUndefined();
    finishRoutineStep();
    expect(takeFinishedStep("/tagesplan/")).toBeUndefined();
  });
});
