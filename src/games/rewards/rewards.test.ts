import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { addStar, boardDays, boardFromTemplate, monthOf, NO_LINKED, type StarLog, possessive, progress, startOver, takeBackStar, withKind } from "./board";
import { snakeLayout } from "./BoardSheet";
import { KINDS, MARKS, REWARDS, TASK_BY_ID, TASKS, TEMPLATES, THEMES, MARK_BY_ID, REWARD_BY_ID, THEME_BY_ID } from "./catalog";
import { REWARDS_PICTURE_PROMPTS } from "./bilder/prompts";
import { DEFAULT_REWARDS_SETTINGS } from "./settings";

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
  expect(DEFAULT_REWARDS_SETTINGS.boards[0].id).toBe(DEFAULT_REWARDS_SETTINGS.current);
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
    const task = week.tasks[0].id;
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
    const month = { ...withKind(week, "month"), days: [0, 1, 2, 3, 4] };
    const days = boardDays(month, wednesday);
    expect(days).toHaveLength(22);
    expect(days.every((d) => d.getMonth() === 9 && d.getDay() !== 0 && d.getDay() !== 6)).toBe(true);
    const task = month.tasks[0].id;
    let log = addStar({}, "w", `2026-10-01|${task}`, wednesday);
    log = addStar(log, "w", `2026-09-30|${task}`, wednesday);
    expect(Object.keys(startOver(log, month, wednesday).w)).toEqual([`2026-09-30|${task}`]);
  });

  test("day, week and month share their stars, and the goal changes to fit the view", () => {
    const task = week.tasks[0].id;
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

test("possessive follows German spelling", () => {
  expect(possessive("Lena")).toBe("Lenas");
  expect(possessive("Max")).toBe("Max’");
  expect(possessive("Hans")).toBe("Hans’");
  expect(possessive("Fritz")).toBe("Fritz’");
});
