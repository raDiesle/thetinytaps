import { dayKey, weekOf } from "@/games/teeth/daytime";
import { type BoardKind, type LinkedGame, TASK_BY_ID, type Template, REWARD_BY_ID } from "./catalog";

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
  /** Weekdays of a week board, 0 = Monday. */
  days: number[];
  /** Stars until the reward (week), or fields to fill (collect); a day board's goal is all its tasks. */
  goal: number;
  /** Null: no reward, only a party together. */
  reward: BoardReward | null;
  /** Catalogue mark id. */
  mark: string;
  /** Catalogue theme id. */
  theme: string;
}

/** Stars per board: "YYYY-MM-DD|taskId" → 1 on week and day boards, "count" → n on a collecting board. */
export type StarLog = Record<string, Record<string, number>>;

/** Days that got a star from a linked game, as day keys. */
export type LinkedDays = Record<LinkedGame, Set<string>>;

export const NO_LINKED: LinkedDays = { teeth: new Set(), potty: new Set() };

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
    kind: template.kind,
    childName: "",
    title: template.title?.de ?? "",
    tasks: template.tasks.map((id) => ({ ...taskFromCatalog(id), id })),
    days: [0, 1, 2, 3, 4, 5, 6],
    goal: template.goal,
    reward: template.reward ? rewardFromCatalog(template.reward) : null,
    mark: template.mark,
    theme: template.theme,
  };
}

/** A board task for a catalogue task; linked to its game where it has one. */
export function taskFromCatalog(id: string): BoardTask {
  const task = TASK_BY_ID.get(id);
  if (!task) throw new Error(`No task ${id}`);
  return { id: newId(), emoji: task.emoji, catalog: id, linked: task.linked };
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

/** The days a board shows today: this week's chosen weekdays, only today, or none (collecting). */
export function boardDays(board: Board, today: Date): Date[] {
  if (board.kind === "day") return [today];
  if (board.kind === "collect") return [];
  return weekOf(today).filter((_, i) => board.days.includes(i));
}

export const cellKey = (day: Date, taskId: string) => `${dayKey(day)}|${taskId}`;

/** Whether a field has its star: put there by hand, or by the task's game on that day. */
export function isFilled(stars: Record<string, number> | undefined, linked: LinkedDays, day: Date, task: BoardTask): boolean {
  if (stars?.[cellKey(day, task.id)]) return true;
  return !!task.linked && linked[task.linked].has(dayKey(day));
}

/** Whether every task of a day has its star. */
export function dayFull(board: Board, stars: Record<string, number> | undefined, linked: LinkedDays, day: Date): boolean {
  return board.tasks.length > 0 && board.tasks.every((task) => isFilled(stars, linked, day, task));
}

/** All fields a board shows now. */
export function fieldCount(board: Board, today: Date): number {
  return board.kind === "collect" ? board.goal : board.tasks.length * boardDays(board, today).length;
}

/** Stars the board has now, and how many lead to the reward (never more than there are fields). */
export function progress(board: Board, stars: Record<string, number> | undefined, linked: LinkedDays, today: Date): { count: number; goal: number } {
  const fields = fieldCount(board, today);
  if (board.kind === "collect") return { count: Math.min(stars?.count ?? 0, board.goal), goal: board.goal };
  const count = boardDays(board, today).reduce((sum, day) => sum + board.tasks.filter((task) => isFilled(stars, linked, day, task)).length, 0);
  return { count, goal: board.kind === "day" ? fields : Math.max(1, Math.min(board.goal, fields)) };
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

/** The log with a board starting over: a collecting board empty, a week or day board without this week's stars. */
export function startOver(log: StarLog, board: Board, today: Date): StarLog {
  if (board.kind === "collect") return { ...log, [board.id]: {} };
  const week = new Set(weekOf(today).map(dayKey));
  const kept = Object.fromEntries(Object.entries(log[board.id] ?? {}).filter(([k]) => !week.has(k.slice(0, 10))));
  return { ...log, [board.id]: kept };
}
