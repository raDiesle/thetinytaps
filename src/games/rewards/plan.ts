import { dayKey } from "@/games/teeth/daytime";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { pick } from "@/lib/language";
import { cellKey, type LinkedDays, newId, type StarLog, weekday } from "./board";
import { DAY_CARDS, type LinkedGame, type PlanTemplate, type PlanView, type Slot, STEP_BY_ID } from "./catalog";

// A Tagesplan (a picture schedule, „Strukturtafel“): the steps of each day in their order, and which of today's
// are done. Plain data and pure functions like board.ts; the ticks share its star log, keyed by plan id.

/** One card of a plan: a meal, Kita, brushing teeth … */
export interface PlanStep {
  /** Unique within its day. */
  id: string;
  emoji: string;
  /** The grown-up's own words; without them the catalogue's label. */
  label?: string;
  /** The catalogue task or activity it came from. */
  catalog?: string;
  /** Its game ticks it by itself (Zähne putzen, Aufs Töpfchen). */
  linked?: LinkedGame;
  /** The time of day of a linked step: only a brushing in the morning ticks a morning routine's teeth. */
  slot?: Slot;
  /** The part of the day it belongs to, on a plan of parts (Mein Tag: Morgen and Abend on one page). */
  part?: Slot;
  /** A tap ticks it like any card instead of opening its game: for a family that brushes without the app. */
  noGame?: boolean;
}

/** A plan as it is shown and printed. */
export interface Plan {
  id: string;
  view: PlanView;
  /** The child's first name, for the heading; may be empty. */
  childName: string;
  /** The heading; empty means one made from the name. */
  title: string;
  /** Seven lists of steps, Monday first; with `same` only the first one, for every day. */
  days: PlanStep[][];
  /** Every day the same steps (a morning routine), or each weekday its own (a week with Kita). */
  same: boolean;
  /** Catalogue theme id. */
  theme: string;
  /** The ready-made plan it came from. */
  template?: string;
  /** Shows example ticks until the first real one, so a new plan looks like one in use. */
  examples?: boolean;
  /**
   * Jetzt – Dann only: the card to do moves into a „Jetzt“ field and done cards into the Fertig-Kiste, so on paper the
   * cards are cut out and moved. Without it every card stays in its place on one sheet and a marker shows the one to do.
   */
  nowField?: boolean;
}

/** A plan as an older version saved it: its two-card „Jetzt – Dann“ view is now a Jetzt – Dann plan with the „Jetzt“ field. */
export function fromOlder(plan: Plan): Plan {
  return (plan.view as string) === "now-next" ? { ...plan, view: "day", nowField: true } : plan;
}

/** At most this many steps a day: more would not fit as pictures a child can follow. */
export const MAX_STEPS = 8;

/** At most this many steps in each part of a day in parts (Morgen, Abend): each is a routine of its own, in a row of its own. */
export const MAX_PART_STEPS = 6;

/** The most steps a day may have: `MAX_STEPS`, or `MAX_PART_STEPS` in each part of a day in parts. */
export const stepLimit = (steps: PlanStep[]): number => (steps.some((step) => step.part) ? DAY_PARTS.length * MAX_PART_STEPS : MAX_STEPS);

/** The game a linked card opens when the child taps it under „Jetzt“; it comes back to the plan afterwards. */
const GAME_ROUTES: Partial<Record<LinkedGame, string>> = { teeth: "/zaehne/" };

/** The page a step's tap opens (Zähne putzen for the teeth card), or none when a tap ticks it. */
export const gameOf = (step: PlanStep): string | undefined => (step.linked && !step.noGame ? GAME_ROUTES[step.linked] : undefined);

/** A card as the routine hands it to the game it opens (`waitForStep`): plan id and field key in one string. */
export const routineStep = (planId: string, key: string) => `${planId}\n${key}`;

/** The plan id and field key of a card a game finished (`takeFinishedStep`). */
export function parseRoutineStep(step: string): { planId: string; key: string } {
  const at = step.indexOf("\n");
  return { planId: step.slice(0, at), key: step.slice(at + 1) };
}

/** A step from the catalogue, linked to its game where it has one. */
export function stepFromCatalog(id: string, slot?: Slot): PlanStep {
  const found = STEP_BY_ID.get(id);
  if (!found) throw new Error(`No step ${id}`);
  const step: PlanStep = { id: newId(), emoji: found.emoji, catalog: id };
  if (found.linked) step.linked = found.linked;
  if (found.linked && slot) step.slot = slot;
  return step;
}

/**
 * A card added at the end of a day: in a plan of parts (morning and evening) it joins the last part, and a card a game
 * ticks counts for that part's time of day.
 */
export function joinLastPart(steps: PlanStep[], step: PlanStep): PlanStep {
  const part = steps.at(-1)?.part;
  if (!part) return step;
  return step.linked ? { ...step, part, slot: part } : { ...step, part };
}

/** A template's lists of catalogue ids: one for every day, seven (Monday first), or the parts of the day in one. */
export function templateLists(template: PlanTemplate): string[][] {
  if (template.parts) return [template.parts.flatMap((part) => part.steps)];
  const days = template.days ?? [];
  return typeof days[0] === "string" ? [days as string[]] : (days as string[][]);
}

/**
 * A plan made from a ready-made one. Its steps keep their catalogue ids (unique within a day; in a plan of parts with
 * the part's time of day, as Zähne putzen comes in the morning and the evening), so the plan, made anew on every
 * load until something is saved, finds its ticks again.
 */
export function planFromTemplate(template: PlanTemplate, language: TargetLanguageId = "de"): Plan {
  const days = template.parts
    ? [template.parts.flatMap(({ slot, steps }) => steps.map((id) => ({ ...stepFromCatalog(id, slot), id: `${id}@${slot}`, part: slot })))]
    : templateLists(template).map((ids) => ids.map((id) => ({ ...stepFromCatalog(id, template.slots?.[id]), id })));
  return {
    id: newId(),
    template: template.id,
    view: template.view,
    childName: "",
    title: template.title ? pick(template.title, language) : "",
    days,
    same: days.length === 1,
    theme: template.theme,
    examples: true,
  };
}

/** How a Jetzt – Dann day is cut: in two parts (morning and evening) or one, and how many cards each part has. */
export interface DayShape {
  split: boolean;
  /** Cards per part, in the parts' order: two for a day in parts, one for a day without. */
  counts: number[];
}

/** The parts of a day in two, in their order. */
export const DAY_PARTS: Slot[] = ["morning", "evening"];

/** Fewest cards a part can have on the wizard's first step: one card is no order. */
export const MIN_PART_STEPS = 2;

/** Each cut as the wizard first fills it: four in the morning and four in the evening („Mein Tag“), seven for the whole day. */
export const DAY_SHAPES: Record<"split" | "whole", DayShape> = { split: { split: true, counts: [4, 4] }, whole: { split: false, counts: [7] } };

/** How a day's cards are cut now. */
export function shapeOf(steps: PlanStep[]): DayShape {
  if (!steps.some((step) => step.part)) return { split: false, counts: [steps.length] };
  return { split: true, counts: DAY_PARTS.map((part) => steps.filter((step) => step.part === part).length) };
}

/** The most cards the wizard gives a part: what its pool holds, at most `MAX_PART_STEPS` (a day in parts) or `MAX_STEPS`. */
export function partRoom(shape: DayShape, index: number): number {
  const pool = DAY_CARDS[shape.split ? (DAY_PARTS[index] as "morning" | "evening") : "whole"];
  return Math.min(pool.length, shape.split ? MAX_PART_STEPS : MAX_STEPS);
}

/**
 * A part's cards (or a whole day's, without `part`) as the wizard fills them from `DAY_CARDS`: the `count` of lowest
 * rank, in the day's order. Their ids carry the time of day where there is one, as in a template of parts, so the
 * morning's and the evening's teeth card stay apart.
 */
export function dayCards(part: Slot | undefined, count: number): PlanStep[] {
  const pool = DAY_CARDS[part === "morning" || part === "evening" ? part : "whole"];
  const taken = new Set([...pool].sort((a, b) => a.rank - b.rank).slice(0, count));
  return pool
    .filter((card) => taken.has(card))
    .map(({ id, slot }) => {
      const time = part ?? slot;
      const step = { ...stepFromCatalog(id, time), id: time ? `${id}@${time}` : id };
      return part ? { ...step, part } : step;
    });
}

/**
 * The plan with its day cut as `shape`, every day alike: a part whose count changed (or every part, where the cut
 * changed) is filled anew from its pool; a part as it was keeps its cards, also those the grown-up chose.
 */
export function withShape(plan: Plan, shape: DayShape): Plan {
  const parts = shape.split ? DAY_PARTS : [undefined];
  const days = plan.days.map((steps) => {
    const was = shapeOf(steps);
    return parts.flatMap((part, i) => {
      const kept = steps.filter((step) => step.part === part);
      return was.split === shape.split && kept.length === shape.counts[i] ? kept : dayCards(part, shape.counts[i]);
    });
  });
  return { ...plan, days };
}

/** A day's steps in its parts (Morgen, Abend), each with its time of day; a plan without parts is one part without one. */
export function partsOf(steps: PlanStep[]): { part?: Slot; steps: PlanStep[] }[] {
  const parts: { part?: Slot; steps: PlanStep[] }[] = [];
  for (const step of steps) {
    const last = parts.at(-1);
    if (last && last.part === step.part) last.steps.push(step);
    else parts.push({ part: step.part, steps: [step] });
  }
  return parts;
}

/** An Erst–Dann plan's pairs: the steps two by two, in their order (a last one alone stays a pair of one). */
export const pairsOf = <T>(steps: T[]): T[][] => Array.from({ length: Math.ceil(steps.length / 2) }, (_, i) => steps.slice(i * 2, i * 2 + 2));

/** The steps of a day, in their order. */
export const stepsOn = (plan: Plan, day: Date): PlanStep[] => (plan.same ? plan.days[0] : plan.days[weekday(day)]) ?? [];

/**
 * Whether a step is done on a day: ticked by the child, or by its game that day – at its time of day where it has one
 * (a morning routine's brushing only by a brushing in the morning).
 */
export function stepDone(ticks: Record<string, number> | undefined, linked: LinkedDays, day: Date, step: PlanStep): boolean {
  if (ticks?.[cellKey(day, step.id)]) return true;
  const done = step.linked ? linked[step.linked][dayKey(day)] : undefined;
  if (!done || done.count === 0) return false;
  return !step.slot || done.slots.length === 0 || done.slots.includes(step.slot);
}

/** The step to do now: the first of the day not done yet; -1 when all are. */
export function currentStep(steps: PlanStep[], ticks: Record<string, number> | undefined, linked: LinkedDays, day: Date): number {
  return steps.findIndex((step) => !stepDone(ticks, linked, day, step));
}

/**
 * The steps to do now, by their place in the day: the first not done – or on an Erst–Dann, where each pair stands on
 * its own and is used when it fits, the first not done of every pair.
 */
export function nowSteps(view: PlanView, steps: PlanStep[], ticks: Record<string, number> | undefined, linked: LinkedDays, day: Date): number[] {
  if (view !== "first-then") {
    const now = currentStep(steps, ticks, linked, day);
    return now < 0 ? [] : [now];
  }
  return pairsOf(steps.map((step, i) => ({ step, i })))
    .map((pair) => pair.find(({ step }) => !stepDone(ticks, linked, day, step))?.i ?? -1)
    .filter((i) => i >= 0);
}

/**
 * A day's steps parted for the day view: those still to do stay in the row, the done ones lie in the Fertig-Kiste –
 * both in the day's order, so the row gets shorter from the front until only the last card (the bed) is left.
 */
export function splitDone(steps: PlanStep[], ticks: Record<string, number> | undefined, linked: LinkedDays, day: Date): { open: PlanStep[]; done: PlanStep[] } {
  const open: PlanStep[] = [];
  const done: PlanStep[] = [];
  for (const step of steps) (stepDone(ticks, linked, day, step) ? done : open).push(step);
  return { open, done };
}

/** Example ticks so a new plan looks like one in use: today's first step or two (an Erst–Dann's first card), never all of them. */
export function exampleTicks(plan: Plan, today: Date): Record<string, number> {
  const steps = stepsOn(plan, today);
  const count = plan.view === "first-then" ? 1 : Math.min(steps.length - 1, Math.max(1, Math.floor(steps.length / 3)));
  return Object.fromEntries(steps.slice(0, Math.max(0, count)).map((step) => [cellKey(today, step.id), 1]));
}

/** The log without a day's ticks – or only those of some steps: the routine starts over (a tick by mistake, an Erst–Dann done). */
export function restartDay(log: StarLog, planId: string, day: Date, stepIds?: string[]): StarLog {
  const key = dayKey(day);
  const gone = (k: string) => k.slice(0, 10) === key && (!stepIds || stepIds.some((id) => k === cellKey(day, id)));
  return { ...log, [planId]: Object.fromEntries(Object.entries(log[planId] ?? {}).filter(([k]) => !gone(k))) };
}

/** Nights from today until a day: 0 today, 1 tomorrow; negative for a day gone by. */
export function nightsUntil(today: Date, day: Date): number {
  const start = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((start(day) - start(today)) / 86_400_000);
}

/** The plan with a day's steps changed; with `same` that is every day's. */
export function withSteps(plan: Plan, weekdayIndex: number, steps: PlanStep[]): Plan {
  const index = plan.same ? 0 : weekdayIndex;
  return { ...plan, days: plan.days.map((list, i) => (i === index ? steps : list)) };
}

/**
 * The plan with each day its own steps, or every day the same. Splitting copies the one list to all seven days;
 * joining keeps the list of `weekdayIndex` (the day the grown-up was looking at).
 */
export function withSame(plan: Plan, same: boolean, weekdayIndex: number): Plan {
  if (same === plan.same) return plan;
  if (!same) return { ...plan, same, days: Array.from({ length: 7 }, () => plan.days[0].map((step) => ({ ...step }))) };
  return { ...plan, same, days: [plan.days[weekdayIndex] ?? plan.days[0]] };
}

/**
 * Every different card of a plan, for the page of cards to cut out: once each – or as often as one day has it, as
 * „Mein Tag“ has the teeth card in the morning and the evening, both on the board at once.
 */
export function distinctSteps(plan: Plan): PlanStep[] {
  const kept = new Map<string, number>();
  return plan.days.flatMap((day) => {
    const inDay = new Map<string, number>();
    return day.filter((step) => {
      const key = `${step.emoji}|${step.label ?? step.catalog ?? ""}`;
      const n = (inDay.get(key) ?? 0) + 1;
      inDay.set(key, n);
      if (n <= (kept.get(key) ?? 0)) return false;
      kept.set(key, n);
      return true;
    });
  });
}
