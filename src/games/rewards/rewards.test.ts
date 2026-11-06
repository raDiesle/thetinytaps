import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import {
  addStar,
  type Board,
  boardDays,
  boardFromTemplate,
  boardSame,
  boardShift,
  dayFields,
  fourWeeks,
  cellKey,
  dayFull,
  exampleStars,
  fieldCount,
  isFilled,
  type LinkedDays,
  longerGoal,
  monthOf,
  NO_LINKED,
  oncePerDay,
  parseCellKey,
  possessive,
  progress,
  reviewPeriods,
  samePeriod,
  shiftPeriod,
  type StarLog,
  startOver,
  suggestsCertificate,
  takeBackStar,
  toggledSlots,
  withKind,
  withStart,
} from "./board";
import { snakeLayout } from "./BoardSheet";
import { DAY_PARTS } from "./plan";
import { defaultDraft, draftInSpan, SPANS } from "./ChartEditor";
import {
  ACTIVITIES,
  CHART_TYPES,
  KINDS,
  PLAN_VIEWS,
  MARKS,
  PLAN_TEMPLATES,
  REWARDS,
  TASK_BY_ID,
  TASKS,
  TEMPLATES,
  THEMES,
  MARK_BY_ID,
  REWARD_BY_ID,
  THEME_BY_ID,
} from "./catalog";
import { CATEGORIES } from "@/content/games";
import { REWARDS_PICTURE_PROMPTS } from "./bilder/prompts";
import { itemPicture, markPicture, picture } from "./pictures";
import { DEFAULT_REWARDS_SETTINGS, pageStart, rewardsDefaults } from "./settings";
import { STICKER_EXAMPLE, VELCRO_EXAMPLE } from "./shopLinks";

const prompts = REWARDS_PICTURE_PROMPTS.groups.flatMap((g) => g.prompts);
const promptIds = new Set(prompts.map((p) => p.id));

describe("catalogue", () => {
  test("ids are unique within each list", () => {
    for (const list of [TASKS, REWARDS, MARKS, THEMES]) expect(new Set(list.map((x) => x.id)).size).toBe(list.length);
  });

  test("templates name only what the catalogue has", () => {
    for (const t of TEMPLATES) {
      for (const id of t.tasks) expect(TASK_BY_ID.has(id), `${t.id}: ${id}`).toBe(true);
      if (t.reward) expect(REWARD_BY_ID.has(t.reward), `${t.id}: ${t.reward}`).toBe(true);
      expect(MARK_BY_ID.has(t.mark), t.mark).toBe(true);
      expect(THEME_BY_ID.has(t.theme), t.theme).toBe(true);
    }
  });

  // Every view is one tap from the first visit, with at least one ready-made board in it.
  test("every view has a ready-made board, and the first one is a week", () => {
    for (const kind of KINDS)
      expect(
        TEMPLATES.some((t) => t.kind === kind.id),
        kind.id,
      ).toBe(true);
    for (const t of TEMPLATES)
      expect(
        KINDS.some((k) => k.id === t.kind),
        t.id,
      ).toBe(true);
    expect(TEMPLATES[0].kind).toBe("week");
  });

  // Generated pictures will replace the emoji, so nothing in the catalogue may lack a prompt.
  test("every task, reward, mark and colour has a picture prompt, and a line-art twin to colour in", () => {
    const names = [...TASKS.map((t) => `aufgabe-${t.id}`), ...REWARDS.map((r) => `belohnung-${r.id}`)];
    for (const name of names) {
      expect(promptIds.has(name), name).toBe(true);
      expect(promptIds.has(`${name}-linie`), `${name}-linie`).toBe(true);
    }
    for (const { id } of MARKS) expect(promptIds.has(`zeichen-${id}`), id).toBe(true);
    for (const { id } of THEMES) expect(promptIds.has(`streifen-${id}`), id).toBe(true);
  });
});

describe("picture prompts", () => {
  test("ids are unique and files go into the game's bilder folder", () => {
    expect(promptIds.size).toBe(prompts.length);
    for (const p of prompts) {
      expect(p.file, p.id).toStartWith("src/games/rewards/bilder/");
      expect(p.file, p.id).toEndWith(".webp");
      expect(p.prompt.length, p.id).toBeGreaterThan(40);
    }
  });

  test("a cut-out picture never asks for a round shape behind it", () => {
    // Asked for a picture „inside a circle“, Gemini drew a disc in the magenta of the backdrop, which stayed after the cut-out.
    for (const p of prompts.filter((p) => p.options.includes("--transparent"))) expect(p.prompt, p.id).not.toMatch(/in(side)? a circle|round sticker/i);
  });

  test("every reference picture exists", () => {
    const own = new Set(prompts.map((p) => p.file));
    for (const p of prompts) for (const ref of p.ref ?? []) expect(existsSync(ref) || own.has(ref), `${p.id}: ${ref}`).toBe(true);
  });
});

describe("snake layout of a collecting board", () => {
  test("every stop gets its own cell, and the path turns at the end of each row", () => {
    for (const stops of [3, 5, 8, 16, 31]) {
      for (const aspect of [0.7, 1.4, 2.2]) {
        const { cols, rows, cells } = snakeLayout(stops, aspect);
        expect(cells).toHaveLength(stops);
        expect(new Set(cells.map((c) => `${c.row}/${c.col}`)).size).toBe(stops);
        expect(rows * cols).toBeGreaterThanOrEqual(stops);
        // Neighbours on the path are neighbours on the sheet.
        for (let i = 1; i < stops; i++) {
          const [a, b] = [cells[i - 1], cells[i]];
          expect(Math.abs(a.row - b.row) + Math.abs(a.col - b.col)).toBe(1);
        }
      }
    }
  });

  test("a wide sheet gets more columns than a tall one", () => {
    expect(snakeLayout(10, 2).cols).toBeGreaterThan(snakeLayout(10, 0.7).cols);
  });
});

// The default board is made anew on every load until something is saved; random ids lost its stars.
test("a board from a template is the same on every load, but for its own id", () => {
  for (const tpl of TEMPLATES) {
    const { id: _a, ...first } = boardFromTemplate(tpl);
    const { id: _b, ...again } = boardFromTemplate(tpl);
    expect(again).toEqual(first);
  }
});

// A first visit starts with the wizard: no Zähne-Woche nobody chose. An older first board keeps its stars, though.
test("there is no board before the wizard made one, but an old first board with stars stays", () => {
  expect(DEFAULT_REWARDS_SETTINGS.boards).toEqual([]);
  expect(rewardsDefaults({})).toBe(DEFAULT_REWARDS_SETTINGS);
  const old = rewardsDefaults({ erste: { "2026-10-26|zaehne": 1 } });
  expect(old.boards.map((b) => b.id)).toEqual(["erste"]);
  expect(old.current).toBe("erste");
  expect(rewardsDefaults({ erste: {} }).boards[0]).toEqual(old.boards[0]);
});

describe("stars", () => {
  const wednesday = new Date(2026, 9, 28);
  const week = { ...boardFromTemplate(TEMPLATES.find((t) => t.id === "woche") ?? TEMPLATES[0]), id: "w" };
  const collect = { ...boardFromTemplate(TEMPLATES.find((t) => t.kind === "collect") ?? TEMPLATES[0]), id: "c" };

  test("a collecting board counts up to its goal and no further", () => {
    let log: StarLog = {};
    for (let i = 0; i < collect.goal + 3; i++) log = addStar(log, "c", null, wednesday);
    expect(progress(collect, log.c, NO_LINKED, wednesday)).toEqual({ count: collect.goal, goal: collect.goal });
    expect(progress(collect, takeBackStar(log, "c", null).c, NO_LINKED, wednesday).count).toBe(collect.goal);
  });

  test("a week board counts its fields, and starting over clears only this week", () => {
    const task = week.tasks[1].id;
    let log = addStar({}, "w", `2026-10-27|${task}`, wednesday);
    log = addStar(log, "w", `2026-10-28|${task}`, wednesday);
    expect(progress(week, log.w, NO_LINKED, wednesday).count).toBe(2);
    expect(progress(week, takeBackStar(log, "w", `2026-10-28|${task}`).w, NO_LINKED, wednesday).count).toBe(1);
    const older = addStar(log, "w", `2026-10-20|${task}`, wednesday);
    expect(Object.keys(startOver(older, week, wednesday).w)).toEqual([`2026-10-20|${task}`]);
  });

  test("a month board has the chosen weekdays of this month, and starting over clears only this month", () => {
    expect(monthOf(wednesday)).toHaveLength(31);
    expect(monthOf(new Date(2026, 1, 10))).toHaveLength(28);
    const month = { ...withKind(week, "month", "", wednesday), span: "month" as const, days: [0, 1, 2, 3, 4] };
    const days = boardDays(month, wednesday);
    expect(days).toHaveLength(22);
    expect(days.every((d) => d.getMonth() === 9 && d.getDay() !== 0 && d.getDay() !== 6)).toBe(true);
    const task = month.tasks[0].id;
    let log = addStar({}, "w", `2026-10-01|${task}`, wednesday);
    log = addStar(log, "w", `2026-09-30|${task}`, wednesday);
    expect(Object.keys(startOver(log, month, wednesday).w)).toEqual([`2026-09-30|${task}`]);
  });

  test("day, week and month share their stars, and the goal changes to fit the view", () => {
    const task = week.tasks[1].id;
    const log = addStar({}, "w", `2026-10-28|${task}`, wednesday);
    for (const kind of ["day", "week", "month"] as const) expect(progress(withKind(week, kind), log.w, NO_LINKED, wednesday).count, kind).toBe(1);
    expect(withKind(week, "month").goal).toBe(week.goal * 4);
    expect(withKind(withKind(week, "month"), "week").goal).toBe(week.goal);
    expect(withKind({ ...week, goal: 10 }, "collect").goal).toBe(10);
    expect(withKind({ ...week, goal: 12 }, "collect").goal).toBe(5);
    expect(withKind(collect, "month").goal).toBe(20);
    expect(withKind(week, "week")).toBe(week);
  });

  test("a heading that came with a ready-made board goes with a new view, one of the grown-up's stays", () => {
    const morning = boardFromTemplate(TEMPLATES.find((t) => t.title) ?? TEMPLATES[0]);
    expect(withKind(morning, "week", morning.title).title).toBe("");
    expect(withKind({ ...morning, title: "Unsere Tafel" }, "week", morning.title).title).toBe("Unsere Tafel");
  });

  test("stars older than two months are dropped when a new one comes", () => {
    const log = addStar({ w: { "2026-01-01|zaehne": 1 } }, "w", "2026-10-28|zaehne", wednesday);
    expect(Object.keys(log.w)).toEqual(["2026-10-28|zaehne"]);
  });
});

describe("a month of four weeks (user feedback, November 2026)", () => {
  const wednesday = new Date(2026, 9, 28);
  const week = { ...boardFromTemplate(TEMPLATES.find((t) => t.id === "woche") ?? TEMPLATES[0]), id: "w" };

  test("a new month board is four weeks from this week's Monday, without dates; a calendar month is the option", () => {
    const month = withKind(week, "month", "", wednesday);
    expect(fourWeeks(month)).toBe(true);
    expect(month.start).toBe("2026-10-26");
    const days = boardDays({ ...month, days: [0, 1, 2, 3, 4, 5, 6] }, wednesday);
    expect(days).toHaveLength(28);
    expect(days[0]).toEqual(new Date(2026, 9, 26, 12));
    expect(fourWeeks({ ...month, span: "month" })).toBe(false);
    expect(withStart(month, new Date(2026, 11, 1))).toBe(month);
  });

  test("the four weeks follow one another from the start, also back before it", () => {
    const month = withKind(week, "month", "", wednesday);
    expect(boardShift(month, new Date(2026, 10, 22), 0)).toEqual(new Date(2026, 9, 26, 12));
    expect(boardShift(month, new Date(2026, 10, 23), 0)).toEqual(new Date(2026, 10, 23, 12));
    expect(boardShift(month, wednesday, -1)).toEqual(new Date(2026, 8, 28, 12));
    expect(boardSame(month, wednesday, new Date(2026, 10, 22))).toBe(true);
    expect(boardSame(month, wednesday, new Date(2026, 9, 25))).toBe(false);
  });

  test("a day's fields stand morning, day, evening, and a task's times of day switch on and off", () => {
    const [a, b] = week.tasks;
    const board = {
      ...week,
      tasks: [
        { ...a, slots: ["evening", "morning"] as const },
        { ...b, slots: undefined },
      ].map((t) => ({ ...t, slots: t.slots && [...t.slots] })),
    };
    expect(dayFields(board).map((f) => [f.task.id, f.part])).toEqual([
      [a.id, "morning"],
      [b.id, "day"],
      [a.id, "evening"],
    ]);
    expect(toggledSlots({ ...b, slots: undefined }, "morning")).toEqual(["morning", "noon"]);
    expect(toggledSlots({ ...b, slots: ["morning", "noon"] }, "morning")).toBeUndefined();
    expect(toggledSlots({ ...b, slots: ["evening"] }, "evening")).toEqual(["evening"]);
  });
});

test("possessive follows German spelling", () => {
  expect(possessive("Lena")).toBe("Lenas");
  expect(possessive("Max")).toBe("Max’");
  expect(possessive("Hans")).toBe("Hans’");
  expect(possessive("Fritz")).toBe("Fritz’");
});

describe("times of day", () => {
  const wednesday = new Date(2026, 9, 28);
  const teethWeek = { ...boardFromTemplate(TEMPLATES[0]), id: "z" };
  const teeth = teethWeek.tasks[0];

  test("brushing teeth has a field in the morning and one in the evening, everywhere it is picked", () => {
    expect(TASK_BY_ID.get("zaehne")?.slots).toEqual(["morning", "evening"]);
    expect(teeth.slots).toEqual(["morning", "evening"]);
    expect(fieldCount(teethWeek, wednesday)).toBe(14);
    // Mein Tag is the morning and the evening on one board: brushing at both, dressing in the morning, the bath at night.
    const day = boardFromTemplate(TEMPLATES.find((t) => t.id === "mein-tag") ?? TEMPLATES[0]);
    expect(day.tasks.map((t) => [t.catalog, t.slots])).toEqual([
      ["anziehen", ["morning"]],
      ["zaehne", ["morning", "evening"]],
      ["baden", ["evening"]],
    ]);
    for (const tpl of TEMPLATES) for (const id of Object.keys(tpl.slots ?? {})) expect(tpl.tasks, `${tpl.id}: ${id}`).toContain(id);
  });

  test("a field's key has its time of day, and reads back", () => {
    const key = cellKey(wednesday, teeth.id, "evening");
    expect(key).toBe(`2026-10-28|${teeth.id}|evening`);
    expect(parseCellKey(key)).toEqual({ day: new Date("2026-10-28T12:00"), taskId: teeth.id, slot: "evening" });
    expect(parseCellKey(`2026-10-28|${teeth.id}`).slot).toBeUndefined();
  });

  test("a day is full only with every time of day", () => {
    const log = addStar({}, "z", cellKey(wednesday, teeth.id, "morning"), wednesday);
    expect(dayFull(teethWeek, log.z, NO_LINKED, wednesday)).toBe(false);
    const both = addStar(log, "z", cellKey(wednesday, teeth.id, "evening"), wednesday);
    expect(dayFull(teethWeek, both.z, NO_LINKED, wednesday)).toBe(true);
    expect(progress(teethWeek, both.z, NO_LINKED, wednesday).count).toBe(2);
  });

  test("Zähne putzen fills the field of its time of day, Aufs Töpfchen fills them in the order of the day", () => {
    const linked: LinkedDays = { teeth: { "2026-10-28": { count: 1, slots: ["evening"] } }, potty: { "2026-10-28": { count: 2, slots: [] } } };
    expect(isFilled(undefined, linked, wednesday, teeth, "morning")).toBe(false);
    expect(isFilled(undefined, linked, wednesday, teeth, "evening")).toBe(true);
    const potty = { id: "p", emoji: "🚽", linked: "potty" as const, slots: ["morning" as const, "noon" as const, "evening" as const] };
    expect([
      isFilled(undefined, linked, wednesday, potty, "morning"),
      isFilled(undefined, linked, wednesday, potty, "noon"),
      isFilled(undefined, linked, wednesday, potty, "evening"),
    ]).toEqual([true, true, false]);
    // A task without times of day is filled by any of it.
    expect(isFilled(undefined, linked, wednesday, { ...teeth, slots: undefined })).toBe(true);
  });
});

describe("example stars", () => {
  const wednesday = new Date(2026, 9, 28);

  // A new board looks like one in use, but never full: the user asked for Monday and Tuesday with stars.
  test("every template starts with example stars on its first days, and none fills the board", () => {
    for (const tpl of TEMPLATES) {
      const board = boardFromTemplate(tpl);
      expect(board.examples, tpl.id).toBe(true);
      const examples = exampleStars(board, wednesday);
      const { count, goal } = progress(board, examples, NO_LINKED, wednesday);
      expect(count, tpl.id).toBeGreaterThan(0);
      expect(count, tpl.id).toBeLessThan(goal);
    }
    const week = exampleStars(boardFromTemplate(TEMPLATES[0]), wednesday);
    expect(Object.keys(week).map((k) => k.slice(0, 10))).toEqual(["2026-10-26", "2026-10-26", "2026-10-27"]);
  });

  test("a board from a template shows them", () => {
    for (const tpl of TEMPLATES) expect(boardFromTemplate(tpl).examples, tpl.id).toBe(true);
  });
});

describe("looking back", () => {
  const wednesday = new Date(2026, 9, 28);

  test("back by a day, a week (to its Monday) or a month (to its first)", () => {
    expect(shiftPeriod("day", wednesday, -1)).toEqual(new Date(2026, 9, 27));
    expect(shiftPeriod("week", wednesday, -1)).toEqual(new Date(2026, 9, 19));
    expect(shiftPeriod("week", wednesday, 0)).toEqual(new Date(2026, 9, 26));
    expect(shiftPeriod("month", wednesday, -1)).toEqual(new Date(2026, 8, 1));
    expect(shiftPeriod("month", new Date(2026, 0, 31), -1)).toEqual(new Date(2025, 11, 1));
    expect(samePeriod("week", wednesday, new Date(2026, 10, 1))).toBe(true);
    expect(samePeriod("week", wednesday, new Date(2026, 10, 2))).toBe(false);
  });

  test("the Rückblick shows the weeks with stars, newest first, and leaves an empty week out", () => {
    const week = { ...boardFromTemplate(TEMPLATES.find((t) => t.id === "woche") ?? TEMPLATES[0]), id: "w", examples: false };
    const task = (week.tasks.find((t) => !t.slots) ?? week.tasks[0]).id;
    let log: StarLog = {};
    for (const day of [new Date(2026, 9, 27), new Date(2026, 9, 28), new Date(2026, 9, 6), new Date(2026, 7, 1)])
      log = addStar(log, "w", cellKey(day, task), wednesday);
    const periods = reviewPeriods(week, log.w, NO_LINKED, wednesday);
    expect(periods.map((p) => [p.back, p.count])).toEqual([
      [0, 2],
      [3, 1],
    ]);
    expect(periods[1].day).toEqual(new Date(2026, 9, 5));
    // A day board looks back by weeks, a month board by months, a collecting board not at all.
    expect(reviewPeriods({ ...week, kind: "day" }, log.w, NO_LINKED, wednesday).map((p) => p.back)).toEqual([0, 3]);
    expect(reviewPeriods({ ...week, kind: "month", span: "month" }, log.w, NO_LINKED, wednesday).map((p) => [p.back, p.count])).toEqual([
      [0, 3],
      [2, 1],
    ]);
    // Four weeks from 12 October (the epoch's blocks): the 6th lies in the four weeks before, 1 August too far back.
    expect(reviewPeriods({ ...week, kind: "month" }, log.w, NO_LINKED, wednesday).map((p) => [p.back, p.count])).toEqual([
      [0, 2],
      [1, 1],
    ]);
    expect(reviewPeriods({ ...week, kind: "collect" }, { count: 4 }, NO_LINKED, wednesday)).toEqual([]);
  });
});

describe("Urkunde und Ausklingen (T-15)", () => {
  const today = new Date(2026, 9, 28);
  const board: Board = {
    id: "u",
    kind: "week",
    childName: "",
    title: "",
    tasks: [{ id: "z", emoji: "🪥", catalog: "zaehne", slots: ["morning", "evening"] }],
    days: [0, 1, 2, 3, 4, 5, 6],
    goal: 5,
    reward: null,
    mark: "stern",
    theme: "sonne",
  };
  const starsOn = (days: Date[], slots: ("morning" | "evening")[]) =>
    Object.fromEntries(days.flatMap((day) => slots.map((slot) => [cellKey(day, "z", slot), 1])));
  const dayBefore = (n: number) => new Date(2026, 9, 28 - n);

  test("the board offers the certificate once its goal is reached, a day board after a full week, never with examples", () => {
    const four = starsOn([dayBefore(0), dayBefore(1)], ["morning", "evening"]);
    expect(suggestsCertificate(board, four, NO_LINKED, today)).toBe(false);
    const five = { ...four, [cellKey(dayBefore(2), "z", "morning")]: 1 };
    expect(suggestsCertificate(board, five, NO_LINKED, today)).toBe(true);
    expect(suggestsCertificate({ ...board, examples: true }, five, NO_LINKED, today)).toBe(false);
    const day = { ...board, kind: "day" as const };
    const week = starsOn([1, 2, 3, 4, 5, 6, 7].map(dayBefore), ["morning", "evening"]);
    expect(suggestsCertificate(day, week, NO_LINKED, today)).toBe(true);
    // One evening missing in the week: not yet – and today, not over yet, doesn't count.
    expect(suggestsCertificate(day, { ...week, [cellKey(dayBefore(4), "z", "evening")]: 0 }, NO_LINKED, today)).toBe(false);
  });

  test("winding down makes the way to the reward longer, never shorter, and keeps one field a day", () => {
    expect(longerGoal(board, today)).toBe(8);
    expect(longerGoal({ ...board, goal: 12 }, today)).toBe(14);
    expect(longerGoal({ ...board, goal: 14 }, today)).toBe(null);
    expect(longerGoal({ ...board, kind: "collect", goal: 5 }, today)).toBe(7);
    expect(longerGoal({ ...board, kind: "collect", goal: 30 }, today)).toBe(null);
    expect(longerGoal({ ...board, kind: "day" }, today)).toBe(null);
    expect(oncePerDay(board.tasks[0]).slots).toEqual(["evening"]);
    expect(oncePerDay({ id: "a", emoji: "👕" })).toEqual({ id: "a", emoji: "👕" });
  });
});

describe("one page for boards and plans", () => {
  test("the wizard's first step offers both kinds, each with Vorlagen to start from", () => {
    expect(CHART_TYPES.map((kind) => kind.id).sort()).toEqual(["board", "plan"]);
    expect(TEMPLATES.length).toBeGreaterThan(0);
    expect(PLAN_TEMPLATES.length).toBeGreaterThan(0);
  });

  // „Zeitraum“ is sorted by time (user feedback, November 2026): a day, a week and a month first, and Sammeln, which
  // counts stars whatever the day, last. Tag, Woche and Erst – Dann are plans, Monat and Sammeln boards, each with a Vorlage.
  test("the Zeitraum goes from the day to Sammeln, each span a view with a Vorlage", () => {
    expect(SPANS.map((span) => span.id)).toEqual(["day", "week", "month", "countdown", "first-then", "collect"]);
    for (const span of SPANS) {
      if (span.type === "plan") expect(PLAN_TEMPLATES.some((tpl) => tpl.view === span.id)).toBe(true);
      else expect(TEMPLATES.some((tpl) => tpl.kind === span.id)).toBe(true);
    }
  });

  // The wizard starts on „Mein Tag“ with a star a card and a reward (user decision, November 2026), and a new Zeitraum
  // keeps the child's name, the colours and the reward.
  test("the wizard starts on Mein Tag, 3 + 3 cards with a Zähler and a reward, and a span keeps name and reward", () => {
    const draft = defaultDraft("de");
    if (draft.type !== "plan") throw new Error("Mein Tag is a plan");
    expect(draft.plan.view).toBe("day");
    expect(DAY_PARTS.map((part) => draft.plan.days[0].filter((step) => step.part === part).length)).toEqual([3, 3]);
    expect(draft.plan.days[0].every((step) => step.stars === 1)).toBe(true);
    expect(draft.plan.numbers).toBeFalsy();
    expect(draft.plan.reward?.catalog).toBe("spielplatz");
    const named: typeof draft = { type: "plan", plan: { ...draft.plan, childName: "Lena", theme: "meer" } };
    for (const span of SPANS) {
      const moved = draftInSpan(span, named, "de");
      const chart = moved.type === "board" ? moved.board : moved.plan;
      expect(moved.type).toBe(span.type);
      expect([chart.childName, chart.theme, chart.reward?.catalog]).toEqual(["Lena", "meer", "spielplatz"]);
      // A Countdown counts nights, never stars.
      if (moved.type === "plan")
        expect(
          moved.plan.days.flat().every((step) => (step.stars ?? 0) === (span.id === "countdown" ? 0 : 1)),
          span.id,
        ).toBe(true);
    }
  });

  // A week that counts stars looked like a Belohnungstafel before the charts were made one (user feedback, November
  // 2026): the same tasks every day, a row each – never the Kita's Wochenplan with other cards each day.
  test("the week with a Zähler is a reward chart's week: the same tasks every day", () => {
    const week = SPANS.find((span) => span.id === "week");
    if (!week) throw new Error("no week");
    const moved = draftInSpan(week, defaultDraft("de"), "de");
    if (moved.type !== "plan") throw new Error("a week is a plan");
    expect(moved.plan.same).toBe(true);
    expect(moved.plan.days[0].map((step) => step.catalog)).toEqual(TEMPLATES.find((tpl) => tpl.id === "woche")?.tasks ?? []);
  });

  // The wizard asks for the view before the Vorlage and shows only that view's: each needs one besides „Leer anfangen“
  // (a board's views are checked with the ready-made boards).
  test("every view of a plan has a Vorlage", () => {
    for (const view of PLAN_VIEWS)
      expect(
        PLAN_TEMPLATES.some((tpl) => tpl.view === view.id),
        view.id,
      ).toBe(true);
  });

  test("the home menu has one card for both, and /tagesplan/ and /wie-lange-warten/ are other addresses of it", () => {
    const games = CATEGORIES.flatMap((category) => category.games);
    expect(games.find((game) => game.href === "/belohnungstafel/")?.also).toEqual(["/tagesplan/", "/wie-lange-warten/"]);
    expect(games.some((game) => game.href === "/tagesplan/")).toBe(false);
  });
});

describe("pictures in place of the emoji", () => {
  test("every catalogue task, plan card, reward and mark has its picture, and a line-art twin for grey prints", () => {
    for (const entry of [...TASKS, ...ACTIVITIES]) {
      const item = { emoji: entry.emoji, catalog: entry.id };
      expect(itemPicture(item, "task"), entry.id).toBeDefined();
      expect(itemPicture(item, "task", true), entry.id).toBeDefined();
    }
    for (const reward of REWARDS) {
      const item = { emoji: reward.emoji, catalog: reward.id };
      expect(itemPicture(item, "reward"), reward.id).toBeDefined();
      expect(itemPicture(item, "reward", true), reward.id).toBeDefined();
    }
    for (const mark of MARKS) expect(markPicture(mark), mark.id).toBeDefined();
    for (const name of ["fest", "stern-halten", ...THEMES.map((theme) => `streifen-${theme.id}`)]) expect(picture(name), name).toBeDefined();
  });

  test("a task, card or reward keeps the emoji a grown-up picked or typed instead of the catalogue's", () => {
    expect(itemPicture({ emoji: "🦷", catalog: "zaehne" }, "task")).toBeUndefined();
    expect(itemPicture({ emoji: "⭐" }, "task")).toBeUndefined();
    expect(itemPicture({ emoji: "🎈", catalog: "zoo" }, "reward")).toBeUndefined();
    // Spielplatz is a reward and a plan card: each finds its own picture.
    expect(itemPicture({ emoji: "🛝", catalog: "spielplatz" }, "task")).not.toBe(itemPicture({ emoji: "🛝", catalog: "spielplatz" }, "reward"));
  });
});

// Belohnungstafel and Zeitplan are two books on the shelf (user feedback, November 2026): each address opens its own
// kind, and where none of it is made yet, the wizard on that kind – never just the other kind's chart.
test("each address opens its own kind, or the wizard on it", () => {
  expect(pageStart("board", { board: true, plan: true })).toEqual({ type: "board", wizard: false });
  expect(pageStart("plan", { board: true, plan: true })).toEqual({ type: "plan", wizard: false });
  expect(pageStart("board", { board: false, plan: true })).toEqual({ type: "plan", wizard: true });
  expect(pageStart("plan", { board: true, plan: false })).toEqual({ type: "board", wizard: true });
  expect(pageStart("board", { board: false, plan: false })).toEqual({ type: "board", wizard: true });
});

test("the print instructions link the user's stickers and Velcro dots", () => {
  expect(STICKER_EXAMPLE).toContain("amazon.de/dp/B0FN3HCT7Y");
  expect(VELCRO_EXAMPLE).toContain("amazon.de/s?k=klettpunkte+selbstklebend");
  const source = (file: string) => readFileSync(`${import.meta.dir}/${file}`, "utf8");
  // The board's A4 note names stickers and, with the picture cards, Velcro dots; the photo guide and the plan's note Velcro.
  expect(source("PrintPanel.tsx")).toContain("<StickerLink />");
  for (const file of ["PrintPanel.tsx", "PhotoPrint.tsx", "PlanPrint.tsx"]) expect(source(file)).toContain("<VelcroLink />");
});

describe("the black-and-white print to colour in is advertised", () => {
  // Every picture has a `-linie` twin drawn for colouring in: a strength few charts have, so it is named where
  // grown-ups decide – the search texts, the wizard's print stamp and the print panel (CLAUDE.md, Rules).
  test("both search entries name it, in German and English", async () => {
    const { SEO_TEXTS } = await import("@/content/seo");
    const { SEO_EN } = await import("@/content/seo.en");
    for (const path of ["/belohnungstafel/", "/tagesplan/"]) {
      const de = SEO_TEXTS.find((page) => page.path === path);
      expect(`${de?.description} ${de?.text}`, path).toMatch(/Ausmal/);
      expect(de?.text, path).toMatch(/schwarz-weiß/i);
      const en = SEO_EN.pages[path];
      expect(`${en?.description} ${en?.text}`, path).toMatch(/colou?r(ing)? (in|page)|to color/);
      expect(en?.text, path).toMatch(/black and white/);
    }
  });

  test("the wizard's stamp and the print panel name it", () => {
    expect(readFileSync(new URL("./Wizard.tsx", import.meta.url), "utf8")).toContain("rw-print-badge-ink");
    const panel = readFileSync(new URL("./PrintPanel.tsx", import.meta.url), "utf8");
    expect(panel).toContain("Schwarz-weiß zum Ausmalen");
    expect(readFileSync(new URL("./PlanPrint.tsx", import.meta.url), "utf8")).toContain("<InkChoice");
  });
});
