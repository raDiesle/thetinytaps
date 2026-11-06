import { describe, expect, test } from "bun:test";
import { CATEGORIES } from "@/content/games";
import { finishRoutineStep, routineReturn, takeFinishedStep, waitForStep } from "@/lib/routine";
import { addStar, cellKey, type LinkedDays, NO_LINKED, type StarLog } from "./board";
import { REWARDS_PICTURE_PROMPTS } from "./bilder/prompts";
import { ACTIVITIES, NIGHT_LOOKS, nightLookOf, PLAN_TEMPLATES, PLAN_VIEWS, STEP_BY_ID, TASKS, THEME_BY_ID } from "./catalog";
import {
  bigDayCome,
  bigDayStep,
  COUNTDOWN_NIGHTS,
  counterOf,
  counting,
  currentStep,
  distinctSteps,
  fromOlder,
  exampleTicks,
  gameOf,
  MAX_NIGHTS,
  MAX_STEPS,
  moonsLeft,
  nightsOf,
  nightsUntil,
  nowSteps,
  pairsOf,
  parseRoutineStep,
  partsOf,
  planFromTemplate,
  restartDay,
  routineStep,
  sameCards,
  splitDone,
  starsGot,
  stepDone,
  stepFromCatalog,
  stepsOn,
  templateLists,
  withCounter,
  withEveryDay,
  withSame,
  withStepStars,
  withBigDay,
  withNightsLeft,
  withSteps,
} from "./plan";
import { printsCards, ritualsOf } from "./PlanPrint";
import { RITUALS, ritualOf } from "./rituals";
import { PICTURE_QUEUE } from "@/content/pictureQueue";
import { existsSync } from "node:fs";
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
  test("activities and rituals have their own ids, apart from the tasks'", () => {
    const ids = [...ACTIVITIES, ...RITUALS, ...TASKS].map((x) => x.id);
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

  // The old two-card „Jetzt – Dann“ view is now a Jetzt – Dann with the „Jetzt“ field; a marker's plan prints no cards.
  test("an older plan's view reads as today's, and only the „Jetzt“ field needs cards to cut out", () => {
    const old = { ...template("mein-tag"), view: "now-next" } as unknown as ReturnType<typeof template>;
    expect(fromOlder(old)).toMatchObject({ view: "day", nowField: true });
    expect(fromOlder(template("mein-tag"))).toEqual(expect.objectContaining({ view: "day" }));
    expect(printsCards(template("mein-tag"))).toBe("never");
    expect(printsCards({ ...template("mein-tag"), nowField: true })).toBe("always");
    expect(printsCards(template("wochenplan"))).toBe("choice");
  });

  test("every activity and ritual has a picture prompt, and a line-art twin to colour in", () => {
    for (const { id } of [...ACTIVITIES, ...RITUALS]) {
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
      // Cards are numbered only when a grown-up asks for it under „Weitere Einstellungen“.
      expect(a.numbers).toBeFalsy();
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
      // A Countdown has nothing to tick: its moons go by themselves, one a night.
      if (tpl.view === "countdown") {
        expect(plan.examples, tpl.id).toBeFalsy();
        continue;
      }
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
    // As many in a row as fit: five a row, not three and two, where that makes the square cards only a little bigger.
    expect(planLayout(5, 2.4).rows).toBe(1);
    expect(planLayout(6, 0.8).rows).toBeGreaterThan(1);
    for (let n = 1; n <= MAX_STEPS; n++) {
      const { cols, rows } = planLayout(n, 1.4);
      expect(cols * rows).toBeGreaterThanOrEqual(n);
    }
  });

  test("a card more fills the last row first: nothing moves while the layout still has a free place", () => {
    for (const aspect of [0.5, 0.8, 1.4, 2, 3.5]) {
      for (let n = 1; n < MAX_NIGHTS + 1; n++) {
        const before = planLayout(n, aspect);
        const after = planLayout(n + 1, aspect);
        if (n < before.cols * before.rows) expect(after).toEqual(before);
        // Never a grid with a row left empty.
        expect(after.cols * (after.rows - 1)).toBeLessThan(n + 1);
      }
    }
    // Five nights and the ＋ fill two rows of three; ＋ pressed in the last place puts the night there and the ＋ below.
    expect(planLayout(6, 1.34)).toEqual({ cols: 3, rows: 2 });
    expect(planLayout(7, 1.34)).toEqual({ cols: 3, rows: 3 });
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

describe("Zähler", () => {
  const plain = withCounter(template("mein-tag"), 0);

  test("a plan counts stars only with a Zähler above 0, and the Zähler is its card's most", () => {
    expect(counting(plain)).toBe(false);
    expect(counterOf(plain)).toBe(0);
    const counted = withCounter(plain, 2);
    expect(counting(counted)).toBe(true);
    expect(counterOf(counted)).toBe(2);
    expect(counted.days.flat().every((step) => step.stars === 2)).toBe(true);
  });

  test("one card's stars change on one weekday only, and the other days keep theirs", () => {
    const plan = withCounter(plain, 1);
    const id = stepsOn(plan, new Date(2026, 10, 2))[0].id;
    const monday = withStepStars(plan, 0, id, 2);
    expect(monday.same).toBeFalsy();
    expect(monday.days[0].find((step) => step.id === id)?.stars).toBe(2);
    expect(monday.days[1].find((step) => step.id === id)?.stars).toBe(1);
    const everyDay = withStepStars(plan, null, id, 3);
    expect(everyDay.days.every((day) => day.find((step) => step.id === id)?.stars === 3)).toBe(true);
  });

  test("a card never gets more stars than its Zähler from taps", () => {
    const plan = withCounter(plain, 2);
    const day = new Date(2026, 10, 2);
    const step = stepsOn(plan, day)[0];
    expect(starsGot({ [cellKey(day, step.id)]: 5 }, NO_LINKED, day, step)).toBe(2);
    expect(starsGot(undefined, NO_LINKED, day, step)).toBe(0);
  });
});

describe("a week's grid of stars", () => {
  const week = PLAN_TEMPLATES.find((tpl) => tpl.id === "wochenplan");
  if (!week) throw new Error("no Wochenplan");

  test("sameCards: the same cards in the same order every day, whatever their stars", () => {
    const plan = planFromTemplate(week, "de");
    expect(sameCards(plan)).toBe(false);
    const alike = withEveryDay(plan, () => plan.days[0]);
    expect(sameCards(alike)).toBe(true);
    expect(sameCards(withStepStars(alike, 2, plan.days[0][0].id, 3))).toBe(true);
  });

  test("withEveryDay changes every day alike, a row taken out of the whole week", () => {
    const plan = withSame(withCounter(planFromTemplate(week, "de"), 1), false, 0);
    const out = withEveryDay(plan, (steps) => steps.filter((step) => step.catalog !== "kita"));
    expect(out.days.flat().some((step) => step.catalog === "kita")).toBe(false);
    expect(out.days.length).toBe(7);
  });

  // H-41: a moon for every night until the big day, its picture big on the day itself – never a date, a clock or a
  // count below none, and never more moons than a sheet holds.
  test("a Countdown has a moon a night until its big day, none on the day, and prints no cards", () => {
    const tpl = PLAN_TEMPLATES.find((t) => t.view === "countdown");
    if (!tpl) throw new Error("no Countdown template");
    const plan = planFromTemplate(tpl, "de", WED);
    expect(plan.bigDay).toBe("2026-11-02");
    expect(moonsLeft(plan, WED)).toBe(COUNTDOWN_NIGHTS);
    expect(moonsLeft(plan, new Date("2026-11-01T07:00"))).toBe(1);
    expect(moonsLeft(plan, new Date("2026-11-02T23:00"))).toBe(0);
    expect(moonsLeft(plan, new Date("2026-11-09T12:00"))).toBe(0);
    expect(moonsLeft({ ...plan, bigDay: "2027-06-01" }, WED)).toBe(MAX_NIGHTS);
    expect(bigDayStep(plan)?.catalog).toBe("geburtstag");
    expect(plan.days[0].every((step) => !step.stars)).toBe(true);
    expect(printsCards(plan)).toBe("never");
  });

  // H-05: a bed for every night of the waiting; each morning the child taps the night slept from moon to sun, the
  // oldest first when a morning was missed, and the big day comes with its last morning tapped.
  test("a Countdown's nights turn from moon to sun only by the child's tap, one each morning", () => {
    const tpl = PLAN_TEMPLATES.find((t) => t.view === "countdown");
    if (!tpl) throw new Error("no Countdown template");
    const plan = planFromTemplate(tpl, "de", WED);
    const at = (iso: string) => new Date(`${iso}T08:00`);
    const states = (day: Date, ticks?: Record<string, number>) => nightsOf(plan, day, ticks).map((n) => n.state);
    // Made today: five nights to come, nothing to tap yet.
    expect(states(WED)).toEqual(["later", "later", "later", "later", "later"]);
    // The next morning one bed waits; tapped, it is a sun – and the moons left are the nights still to come.
    const thu = at("2026-10-29");
    expect(states(thu)).toEqual(["now", "later", "later", "later", "later"]);
    const first = nightsOf(plan, thu, {})[0].key;
    const log = addStar({}, plan.id, first, thu);
    expect(states(thu, log[plan.id])).toEqual(["done", "later", "later", "later", "later"]);
    expect(moonsLeft(plan, thu)).toBe(4);
    // A morning missed: two beds wait, and nothing turns into a sun by itself.
    expect(states(at("2026-10-31"), log[plan.id])).toEqual(["done", "now", "now", "later", "later"]);
    // On the big day it has come only once its last morning is tapped; after it, always.
    const all = Object.fromEntries(nightsOf(plan, at("2026-11-02"), {}).map((n) => [n.key, 1]));
    expect(bigDayCome(plan, at("2026-11-02"), {})).toBe(false);
    expect(bigDayCome(plan, at("2026-11-02"), all)).toBe(true);
    expect(bigDayCome(plan, at("2026-11-03"), {})).toBe(true);
    // Another picture keeps the suns: a night's tick doesn't hang on the picture.
    const other = { ...plan, days: [[stepFromCatalog("urlaub")]] };
    expect(nightsOf(other, thu, log[plan.id])[0].state).toBe("done");
    // A month at most, the last nights before the big day.
    expect(nightsOf({ ...plan, bigDay: "2027-06-01" }, WED, {}).length).toBe(MAX_NIGHTS);
  });

  test("a new big day starts a new waiting once the old one is over, and a day moved keeps its suns", () => {
    const tpl = PLAN_TEMPLATES.find((t) => t.view === "countdown");
    if (!tpl) throw new Error("no Countdown template");
    const plan = planFromTemplate(tpl, "de", WED);
    expect(withBigDay(plan, "2026-11-05", new Date("2026-10-30T08:00")).since).toBe(plan.since);
    expect(withBigDay(plan, "2026-11-20", new Date("2026-11-04T08:00")).since).toBe("2026-11-04");
    // Made before H-05 (no start): its waiting begins now.
    const { since: _, ...older } = plan;
    expect(nightsOf(older, new Date("2026-10-30T08:00"), {}).map((n) => n.state)).toEqual(["now", "later", "later", "later"]);
    expect(withBigDay(older, "2026-11-05", WED).since).toBe("2026-10-28");
  });

  // ＋ and 🗑️ on the sheet: one night more or less, never past a month or below none, and the stars slept stay.
  test("a night added or taken keeps the stars and stays within a month", () => {
    const tpl = PLAN_TEMPLATES.find((t) => t.view === "countdown");
    if (!tpl) throw new Error("no Countdown template");
    const plan = planFromTemplate(tpl, "de", WED);
    const thu = new Date("2026-10-29T08:00");
    const log = addStar({}, plan.id, nightsOf(plan, thu, {})[0].key, thu)[plan.id];
    const more = withNightsLeft(plan, 1, thu);
    expect(moonsLeft(more, thu)).toBe(moonsLeft(plan, thu) + 1);
    expect(nightsOf(more, thu, log)[0].state).toBe("done");
    expect(moonsLeft(withNightsLeft(plan, -1, thu), thu)).toBe(moonsLeft(plan, thu) - 1);
    expect(moonsLeft(withNightsLeft(plan, -99, thu), thu)).toBe(0);
    expect(moonsLeft(withNightsLeft(plan, 99, thu), thu)).toBe(MAX_NIGHTS);
  });

  test("every look of the nights has its picture and line-art twin, and follows „Junge / Mädchen“ until one is picked", () => {
    for (const { id } of NIGHT_LOOKS) {
      const name = id === "fuchs" ? "schritt-schlafen" : `nacht-${id}`;
      for (const file of [`src/games/rewards/bilder/${name}.webp`, `src/games/rewards/bilder/${name}-linie.webp`]) expect(existsSync(file), file).toBe(true);
      expect(promptIds.has(name), name).toBe(true);
    }
    expect(nightLookOf(undefined, "girl").id).toBe("fuechsin");
    expect(nightLookOf(undefined, "boy").id).toBe("baer");
    expect(nightLookOf("mond", "girl").id).toBe("mond");
  });
});

// H-58, C-33: rituals are cards of the plan whose words help the grown-up; „Wie geht's dir?“ opens its game instead.
describe("rituals", () => {
  test("every ritual says when it belongs, who speaks and how it goes, in a few short lines", () => {
    for (const ritual of RITUALS) {
      expect(ritual.when.de, ritual.id).toBeTruthy();
      expect(ritual.how.de.length, ritual.id).toBeLessThan(320);
      expect(ritual.parts.length, ritual.id).toBeGreaterThan(0);
      const lines = ritual.parts.flatMap((part) => part.lines);
      // A ritual is a moment, not a lesson: few sentences, each short enough to say after a grown-up.
      expect(lines.length, ritual.id).toBeLessThanOrEqual(5);
      for (const line of lines) expect(line.text.de.split(" ").length, `${ritual.id}: ${line.text.de}`).toBeLessThanOrEqual(12);
    }
  });

  test("a ritual's card finds its words; only a ritual with a game opens it, and that game is in the home menu", () => {
    const games = new Set(CATEGORIES.flatMap((c) => c.games).map((g) => g.href));
    for (const ritual of RITUALS) {
      const card = stepFromCatalog(ritual.id);
      expect(ritualOf(card), ritual.id).toBe(ritual);
      expect(gameOf(card), ritual.id).toBe(ritual.game);
      if (ritual.game) expect(games.has(ritual.game), ritual.game).toBe(true);
    }
    expect(gameOf(stepFromCatalog("wiegehts"))).toBe("/wie-gehts-dir/");
    expect(ritualOf(stepFromCatalog("fruehstueck"))).toBeUndefined();
  });

  test("„Mein Tag mit Ritualen“ asks how the child is in the morning and in the evening, and prints every ritual's words once", () => {
    const plan = template("rituale");
    const steps = stepsOn(plan, WED);
    const parts = partsOf(steps);
    for (const part of parts)
      expect(
        part.steps.some((step) => step.catalog === "wiegehts"),
        part.part,
      ).toBe(true);
    expect(
      ritualsOf(plan)
        .map((r) => r.id)
        .sort(),
    ).toEqual(RITUALS.map((r) => r.id).sort());
  });

  test("a ritual's picture is made, or waits in the picture queue with its line-art twin", () => {
    const queued = new Set(PICTURE_QUEUE.map((p) => p.file));
    for (const { id } of RITUALS)
      for (const file of [`src/games/rewards/bilder/schritt-${id}.webp`, `src/games/rewards/bilder/schritt-${id}-linie.webp`])
        expect(existsSync(file) || queued.has(file), file).toBe(true);
  });
});
