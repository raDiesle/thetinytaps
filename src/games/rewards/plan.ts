import { dayKey } from "@/games/teeth/daytime";
import { cellKey, type LinkedDays, newId, type StarLog, weekday } from "./board";
import { type LinkedGame, type PlanTemplate, type PlanView, type Slot, STEP_BY_ID } from "./catalog";

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
}

/** At most this many steps a day: more would not fit as pictures a child can follow. */
export const MAX_STEPS = 8;

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
 * A plan made from a ready-made one. Its steps keep their catalogue ids (unique within a day), so the default plan,
 * made anew on every load until something is saved, finds its ticks again.
 */
export function planFromTemplate(template: PlanTemplate): Plan {
  const lists = typeof template.days[0] === "string" ? [template.days as string[]] : (template.days as string[][]);
  return {
    id: newId(),
    template: template.id,
    view: template.view,
    childName: "",
    title: template.title?.de ?? "",
    days: lists.map((ids) => ids.map((id) => ({ ...stepFromCatalog(id, template.slots?.[id]), id }))),
    same: lists.length === 1,
    theme: template.theme,
    examples: true,
  };
}

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

/** Example ticks so a new plan looks like one in use: today's first step or two, never all of them. */
export function exampleTicks(plan: Plan, today: Date): Record<string, number> {
  const steps = stepsOn(plan, today);
  const count = Math.min(steps.length - 1, Math.max(1, Math.floor(steps.length / 3)));
  return Object.fromEntries(steps.slice(0, Math.max(0, count)).map((step) => [cellKey(today, step.id), 1]));
}

/** The log without a day's ticks: the routine starts over (after an Erst–Dann, or a tick by mistake). */
export function restartDay(log: StarLog, planId: string, day: Date): StarLog {
  const key = dayKey(day);
  return { ...log, [planId]: Object.fromEntries(Object.entries(log[planId] ?? {}).filter(([k]) => k.slice(0, 10) !== key)) };
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

/** Every different card of a plan, once each, for the page of cards to cut out. */
export function distinctSteps(plan: Plan): PlanStep[] {
  const seen = new Set<string>();
  return plan.days.flat().filter((step) => {
    const key = `${step.emoji}|${step.label ?? step.catalog ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
