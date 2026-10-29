import { dayKey, weekOf } from "@/games/teeth/daytime";
import { type BoardKind, type LinkedGame, REWARD_BY_ID, type Slot, SLOTS, TASK_BY_ID, type Template } from "./catalog";

// A board as the grown-up made it, and the stars on it. Everything here is plain
// data and pure functions, so the screen, the print and the tests share them.

/** One row (week), card (day) or reason (collect) of a board. */
export interface BoardTask {
  /** Unique on its board. */
  id: string;
  emoji: string;
  /** The grown-up's own words; without them the catalogue's label in the app language. */
  label?: string;
  /** The catalogue task it came from, for its label and picture. */
  catalog?: string;
  /** Its game puts the star on the board by itself (week and day boards only). */
  linked?: LinkedGame;
  /** A field for each of these times of day (brushing in the morning and the evening); none: one field a day. */
  slots?: Slot[];
}

/** What the stars lead to. */
export interface BoardReward {
  emoji: string;
  label?: string;
  catalog?: string;
}

/** A board as it is shown and printed. */
export interface Board {
  id: string;
  kind: BoardKind;
  /** The child's first name, for the heading; may be empty. */
  childName: string;
  /** The heading; empty means one made from the kind and the name. */
  title: string;
  tasks: BoardTask[];
  /** Weekdays of a week or month board, 0 = Monday. */
  days: number[];
  /** Stars until the reward (week, month), or fields to fill (collect); a day board's goal is all its tasks. */
  goal: number;
  /** Null: no reward, only a party together. */
  reward: BoardReward | null;
  /** Catalogue mark id. */
  mark: string;
  /** Catalogue theme id. */
  theme: string;
  /** The ready-made board it was made from: picking it in the gallery again selects this board. */
  template?: string;
  /** Shows example stars (Monday and Tuesday filled), so a new board looks like one in use; gone with the first real star. */
  examples?: boolean;
}

/** Stars per board: "YYYY-MM-DD|taskId" → 1 on week, month and day boards, "count" → n on a collecting board. */
export type StarLog = Record<string, Record<string, number>>;

/** What a linked game did on one day: how often, and at which times of day where the game knows them (Zähne putzen). */
export interface LinkedDay {
  count: number;
  slots: Slot[];
}

/** Per linked game, what it did on each day, by day key. */
export type LinkedDays = Record<LinkedGame, Record<string, LinkedDay>>;

export const NO_LINKED: LinkedDays = { teeth: {}, potty: {} };

/** At most this many tasks; parents' guides advise one to three for toddlers. */
export const MAX_TASKS = 8;
/** Fields of a collecting board. */
export const COLLECT_GOALS = [3, 5, 7, 10, 15, 20, 30];
/** Stars of a week board's day keys are kept this long, so a log never grows without end. */
const KEEP_DAYS = 62;

export const newId = () => Math.random().toString(36).slice(2, 9);

/**
 * A board made from a ready-made one. Its tasks keep their catalogue ids (unique within a template), so
 * the default board, made anew on every load until something is saved, finds its stars again.
 */
export function boardFromTemplate(template: Template): Board {
  return {
    id: newId(),
    template: template.id,
    kind: template.kind,
    childName: "",
    title: template.title?.de ?? "",
    tasks: template.tasks.map((id) => {
      const task = { ...taskFromCatalog(id), id };
      const slots = template.slots?.[id];
      return slots ? { ...task, slots } : task;
    }),
    days: [0, 1, 2, 3, 4, 5, 6],
    goal: template.goal,
    reward: template.reward ? rewardFromCatalog(template.reward) : null,
    mark: template.mark,
    theme: template.theme,
    examples: true,
  };
}

/** About this many stars of a month for one of a week, when a board changes between the two. */
const WEEKS_PER_MONTH = 4;

/**
 * The same board in another view. Day, week and month share their stars (they are kept per day), so only the
 * goal changes to fit: a week's stars times four for a month, a collecting board's fields from COLLECT_GOALS.
 * A heading that came with the ready-made board („Mein Morgen“) goes, the one for the new view comes instead.
 */
export function withKind(board: Board, kind: BoardKind, templateTitle = ""): Board {
  if (kind === board.kind) return board;
  const goal =
    kind === "collect"
      ? COLLECT_GOALS.includes(board.goal)
        ? board.goal
        : 5
      : board.kind === "collect"
        ? kind === "month"
          ? 20
          : 5
        : kind === "month" && board.kind === "week"
          ? board.goal * WEEKS_PER_MONTH
          : kind === "week" && board.kind === "month"
            ? Math.max(1, Math.round(board.goal / WEEKS_PER_MONTH))
            : board.goal;
  return { ...board, kind, goal, title: templateTitle && board.title === templateTitle ? "" : board.title };
}

/** A board task for a catalogue task; linked to its game where it has one. */
export function taskFromCatalog(id: string): BoardTask {
  const task = TASK_BY_ID.get(id);
  if (!task) throw new Error(`No task ${id}`);
  const made: BoardTask = { id: newId(), emoji: task.emoji, catalog: id, linked: task.linked };
  return task.slots ? { ...made, slots: [...task.slots] } : made;
}

export function rewardFromCatalog(id: string): BoardReward {
  const reward = REWARD_BY_ID.get(id);
  if (!reward) throw new Error(`No reward ${id}`);
  return { emoji: reward.emoji, catalog: id };
}

/** "Lenas", "Max’" – the German possessive of a first name. */
export function possessive(name: string): string {
  return /(s|ß|x|z|ce)$/i.test(name) ? `${name}’` : `${name}s`;
}

/** Every day of the month `day` is in. */
export function monthOf(day: Date): Date[] {
  const length = new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate();
  return Array.from({ length }, (_, i) => new Date(day.getFullYear(), day.getMonth(), i + 1));
}

/** Monday = 0 … Sunday = 6. */
export const weekday = (day: Date) => (day.getDay() + 6) % 7;

/**
 * The days a board has fields on: this week's or this month's chosen weekdays, only today, or none (collecting).
 * `today` is the day the board is for – a printed month board may be next month's.
 */
export function boardDays(board: Board, today: Date): Date[] {
  if (board.kind === "day") return [today];
  if (board.kind === "collect") return [];
  return (board.kind === "month" ? monthOf(today) : weekOf(today)).filter((day) => board.days.includes(weekday(day)));
}

/** The fields a task has on a day: one per time of day, or a single one (`undefined`). */
export const taskSlots = (task: BoardTask): (Slot | undefined)[] =>
  task.slots?.length ? SLOTS.map((s) => s.id).filter((s) => task.slots?.includes(s)) : [undefined];

/** A field's key in the log and on screen: "2026-10-28|zaehne", with its time of day "2026-10-28|zaehne|evening". */
export const cellKey = (day: Date, taskId: string, slot?: Slot) => `${dayKey(day)}|${taskId}${slot ? `|${slot}` : ""}`;

/** The parts of a `cellKey`. */
export function parseCellKey(key: string): { day: Date; taskId: string; slot?: Slot } {
  const [day, taskId, slot] = key.split("|");
  return { day: new Date(`${day}T12:00`), taskId, slot: slot as Slot | undefined };
}

/**
 * Whether a field has its star: put there by hand, or by the task's game on that day. A game that knows the time of
 * day (Zähne putzen) fills that time's field; one that only counts (Aufs Töpfchen) fills the fields in the order of the day.
 */
export function isFilled(stars: Record<string, number> | undefined, linked: LinkedDays, day: Date, task: BoardTask, slot?: Slot): boolean {
  if (stars?.[cellKey(day, task.id, slot)]) return true;
  const done = task.linked ? linked[task.linked][dayKey(day)] : undefined;
  if (!done || done.count === 0) return false;
  if (!slot) return true;
  return done.slots.length > 0 ? done.slots.includes(slot) : taskSlots(task).indexOf(slot) < done.count;
}

/** Every field of a task on a day, filled or not. */
const taskFilled = (stars: Record<string, number> | undefined, linked: LinkedDays, day: Date, task: BoardTask) =>
  taskSlots(task).map((slot) => isFilled(stars, linked, day, task, slot));

/** Whether every task of a day has all its stars. */
export function dayFull(board: Board, stars: Record<string, number> | undefined, linked: LinkedDays, day: Date): boolean {
  return board.tasks.length > 0 && board.tasks.every((task) => taskFilled(stars, linked, day, task).every(Boolean));
}

/** Fields of all tasks on one day. */
export const fieldsPerDay = (board: Board) => board.tasks.reduce((sum, task) => sum + taskSlots(task).length, 0);

/** All fields a board shows now. */
export function fieldCount(board: Board, today: Date): number {
  return board.kind === "collect" ? board.goal : fieldsPerDay(board) * boardDays(board, today).length;
}

/** Stars the board has now, and how many lead to the reward (never more than there are fields). */
export function progress(board: Board, stars: Record<string, number> | undefined, linked: LinkedDays, today: Date): { count: number; goal: number } {
  const fields = fieldCount(board, today);
  if (board.kind === "collect") return { count: Math.min(stars?.count ?? 0, board.goal), goal: board.goal };
  const count = boardDays(board, today).reduce(
    (sum, day) => sum + board.tasks.reduce((n, task) => n + taskFilled(stars, linked, day, task).filter(Boolean).length, 0),
    0,
  );
  return { count, goal: board.kind === "day" ? fields : Math.max(1, Math.min(board.goal, fields)) };
}

/**
 * Example stars, so a new board looks like one in use: on a week the first two days of the board (Monday and
 * Tuesday), the second one short of its last field; on a month its first four days alike; on a day all but the last
 * field; two on a collecting board. Shown pale until the first real star, never saved and never printed.
 */
export function exampleStars(board: Board, today: Date): Record<string, number> {
  if (board.kind === "collect") return { count: Math.min(2, board.goal - 1) };
  const keys = (day: Date) => board.tasks.flatMap((task) => taskSlots(task).map((slot) => cellKey(day, task.id, slot)));
  const days = board.kind === "day" ? [today] : boardDays(board, today).slice(0, board.kind === "month" ? 4 : 2);
  const fields = days.flatMap((day, i) => {
    const all = keys(day);
    // Not every day is full, as on a real board: the day board, the second day and the third day of a month lack one.
    return (board.kind === "day" || i === 1 || i === 2) && all.length > 1 ? all.slice(0, -1) : all;
  });
  return Object.fromEntries(fields.map((key) => [key, 1]));
}

/** The first day of the week, month or day `day` is in, `by` periods later (earlier when negative). */
export function shiftPeriod(kind: BoardKind, day: Date, by: number): Date {
  if (kind === "month") return new Date(day.getFullYear(), day.getMonth() + by, 1);
  if (kind === "week") return new Date(day.getFullYear(), day.getMonth(), day.getDate() - weekday(day) + 7 * by);
  return new Date(day.getFullYear(), day.getMonth(), day.getDate() + by);
}

/** Whether two days lie in the same day, week or month of a board. */
export function samePeriod(kind: BoardKind, a: Date, b: Date): boolean {
  return dayKey(shiftPeriod(kind, a, 0)) === dayKey(shiftPeriod(kind, b, 0));
}

/** How many days, weeks or months a grown-up can go back: about as long as stars are kept (`KEEP_DAYS`). */
export const OLDEST_BACK: Record<BoardKind, number> = { day: 60, week: 8, month: 2, collect: 0 };

/** The view a Rückblick shows a board in: months for a month board, weeks for the others (a day is too little to look back on). */
export const reviewKind = (kind: BoardKind): "week" | "month" => (kind === "month" ? "month" : "week");

/** One week (or month) of a Rückblick. */
export interface ReviewPeriod {
  /** Weeks (months) back from the current one; 0 is now. */
  back: number;
  /** Its first day. */
  day: Date;
  /** Stars it got, by hand or from a linked game. */
  count: number;
}

/**
 * The weeks (months on a month board) to look back on together, newest first: the current one and the earlier ones
 * whose stars are still kept, each only with at least one star – an empty week is left out, never shown as a failure.
 */
export function reviewPeriods(board: Board, stars: Record<string, number> | undefined, linked: LinkedDays, today: Date): ReviewPeriod[] {
  if (board.kind === "collect") return [];
  const kind = reviewKind(board.kind);
  const shown = withKind(board, kind);
  return Array.from({ length: OLDEST_BACK[kind] + 1 }, (_, back) => {
    const day = shiftPeriod(kind, today, -back);
    return { back, day, count: progress(shown, stars, linked, day).count };
  }).filter((period) => period.count > 0);
}

/** The log with a star on a field (a key of `cellKey`), or one more collected; old days dropped. */
export function addStar(log: StarLog, boardId: string, key: string | null, today: Date): StarLog {
  const oldest = dayKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - KEEP_DAYS));
  const kept = Object.fromEntries(Object.entries(log[boardId] ?? {}).filter(([k]) => k === "count" || k.slice(0, 10) > oldest));
  const next = key === null ? { ...kept, count: (kept.count ?? 0) + 1 } : { ...kept, [key]: 1 };
  return { ...log, [boardId]: next };
}

/** The log without a star put there by mistake (only right after it was put, never as a punishment). */
export function takeBackStar(log: StarLog, boardId: string, key: string | null): StarLog {
  const stars = { ...(log[boardId] ?? {}) };
  if (key === null) stars.count = Math.max(0, (stars.count ?? 0) - 1);
  else delete stars[key];
  return { ...log, [boardId]: stars };
}

/** The log with a board starting over: a collecting board empty, the others without this week's (or month's) stars. */
export function startOver(log: StarLog, board: Board, today: Date): StarLog {
  if (board.kind === "collect") return { ...log, [board.id]: {} };
  const week = new Set((board.kind === "month" ? monthOf(today) : weekOf(today)).map(dayKey));
  const kept = Object.fromEntries(Object.entries(log[board.id] ?? {}).filter(([k]) => !week.has(k.slice(0, 10))));
  return { ...log, [board.id]: kept };
}
