import { dayKey, weekOf } from "@/games/teeth/daytime";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { pick } from "@/lib/language";
import { type BoardReward, cellKey, type LinkedDays, newId, type StarLog, weekday } from "./board";
import { type LinkedGame, type PlanTemplate, type PlanView, type Slot, STEP_BY_ID } from "./catalog";
import { type DayParts, type DaySignSet, PARTS_OF } from "./daySigns";
import { ritualOf } from "./rituals";

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
  /**
   * Its Zähler: how many stars the card gets on its day (Zähneputzen twice on a Monday), one per tap; none or 0 is a
   * card of a plain plan, done with one tap and shown by the paper arrow.
   */
  stars?: number;
}

/** A plan as it is shown and printed. */
export interface Plan {
  id: string;
  view: PlanView;
  /** The child's first name, for the heading; may be empty. */
  childName: string;
  /** The heading; empty means one made from the name. */
  title: string;
  /** The sign before the heading: a mark's id; missing or `NO_TITLE_MARK`: none. */
  titleMark?: string;
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
  /**
   * What the stars lead to, on a plan whose cards count stars (`counting`): its picture at the sheet's end with how
   * many are there. Null or missing: stars without a reward – „Belohnung“ off, or the reward taken off the sheet.
   */
  reward?: BoardReward | null;
  /** Stars until the reward; missing: all the stars of the day (a week's plan: of the week). */
  goal?: number;
  /**
   * Each card of a day shows its number in the day's order. Off by default (user feedback, November 2026: the pictures
   * say the order), switched on under „Weitere Einstellungen“.
   */
  numbers?: boolean;
  /**
   * Countdown only (H-41): the big day the moons count down to, YYYY-MM-DD; its picture is the plan's one card. Never
   * shown on the sheet as a date – the child sees a moon for every night until then.
   */
  bigDay?: string;
  /**
   * Countdown only (H-05): the day the waiting began, YYYY-MM-DD – a bed for every night from then until the big day,
   * which the child turns from moon to sun each morning. Missing (made before H-05): yesterday, so each morning has one
   * bed to tap.
   */
  since?: string;
  /** Countdown only: how a night looks (`NIGHT_LOOKS`); where missing the child in bed follows „Junge / Mädchen“. */
  night?: string;
  /**
   * A counting week's look (user feedback, November 2026): one card at the start of each row (`"compact"`, the
   * default) or the card's picture over the circles of every day (`"pictures"`). Chosen in the band, never changed by
   * what the cards are.
   */
  weekLook?: WeekLook;
  /**
   * How many parts the day has (user feedback, November 2026): the whole day in one line (missing, the default),
   * morning and evening, or morning, midday and evening – a line (a day) or a group of rows (a week) each, chosen in the
   * band („Tageszeiten“), never by taking a part's line away on the sheet. Older plans without it tell by their cards'
   * parts (`dayPartsOf`).
   */
  dayParts?: DayParts;
  /** The signs of the parts (`DAY_SIGN_SETS`); missing: none, the rows told apart by their tints. */
  signs?: DaySignSet;
}

/** How a counting week is drawn: a card per row, or a picture over every day's circles. */
export type WeekLook = "compact" | "pictures";

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

/** The page a step's tap opens (Zähne putzen for the teeth card, „Wie geht's dir?“ for its ritual), or none when a tap ticks it. */
export const gameOf = (step: PlanStep): string | undefined => (step.noGame ? undefined : step.linked ? GAME_ROUTES[step.linked] : ritualOf(step)?.game);

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
export function planFromTemplate(template: PlanTemplate, language: TargetLanguageId = "de", today = new Date()): Plan {
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
    // A Countdown has nothing to tick, so nothing to show as an example: its moons are there from the start.
    ...(template.view === "countdown" ? { bigDay: dayKey(daysLater(today, COUNTDOWN_NIGHTS)), since: dayKey(today) } : { examples: true }),
  };
}

/** The nights a new Countdown starts with: a big day within the week, which a toddler can still wait for. */
export const COUNTDOWN_NIGHTS = 5;

/** The most nights a Countdown counts: a month of moons still fits a sheet, and is as far as a child looks ahead. */
export const MAX_NIGHTS = 31;

/** A day `n` days after `day`, at noon (no trouble with the clock change). */
export const daysLater = (day: Date, n: number): Date => new Date(day.getFullYear(), day.getMonth(), day.getDate() + n, 12);

/** A Countdown's big day as a date (noon); without one, `COUNTDOWN_NIGHTS` after `today`. */
export const bigDayOf = (plan: Plan, today: Date): Date => (plan.bigDay ? new Date(`${plan.bigDay}T12:00`) : daysLater(today, COUNTDOWN_NIGHTS));

/** The card of a Countdown: the picture of its big day (Geburtstag, Urlaub, Oma kommt). */
export const bigDayStep = (plan: Plan): PlanStep | undefined => plan.days[0]?.[0];

/** Moons left on a day: one for every night until the big day, none on the day itself and after, at most `MAX_NIGHTS`. */
export const moonsLeft = (plan: Plan, day: Date): number => Math.min(MAX_NIGHTS, Math.max(0, nightsUntil(day, bigDayOf(plan, day))));

/**
 * One night of a Countdown's waiting (H-05, „Wie oft noch schlafen?“), drawn as a card of the child asleep in bed with
 * one star field under it: `later` a night still to sleep; `now` slept, its morning come, its field waiting for the
 * child's tap; `done` tapped, the star in its field.
 * `key` is its tick in the log: the morning after the night, with the big day's card.
 */
export interface Night {
  key: string;
  state: "done" | "now" | "later";
}

/** The task id of a night's tick, whatever the big day's picture: choosing another one keeps the suns. */
const NIGHT = "nacht";

/**
 * A Countdown given a new big day: the beds of a waiting already over (its big day today or gone) go, and the new
 * waiting begins today; a day only moved (the trip a day later) keeps the suns tapped so far.
 */
export function withBigDay(plan: Plan, key: string, today: Date): Plan {
  const over = !plan.since || nightsUntil(today, bigDayOf(plan, today)) <= 0;
  return { ...plan, bigDay: key, since: over ? dayKey(today) : plan.since };
}

/**
 * A Countdown with a night more or fewer to wait (＋ and 🗑️ on the sheet while it is made): the big day moves, the
 * nights still to come stay between none and `MAX_NIGHTS`, and the suns tapped so far stay (`withBigDay`).
 */
export function withNightsLeft(plan: Plan, by: number, today: Date): Plan {
  const left = Math.max(0, Math.min(MAX_NIGHTS, moonsLeft(plan, today) + by));
  return withBigDay(plan, dayKey(daysLater(today, left)), today);
}

/** When a Countdown's waiting began (`Plan.since`), or yesterday for one made before. */
const sinceOf = (plan: Plan, today: Date): Date => (plan.since ? new Date(`${plan.since}T12:00`) : daysLater(today, -1));

/**
 * A Countdown's nights on `today`: one bed for every night from `since` to the big day, at most `MAX_NIGHTS` (the last
 * ones). Mornings come and the child taps them, so a night slept is `now` until ticked, then `done`; nights to come are
 * `later` (as many as `moonsLeft`).
 */
export function nightsOf(plan: Plan, today: Date, ticks: Record<string, number> | undefined): Night[] {
  if (!bigDayStep(plan)) return [];
  const big = bigDayOf(plan, today);
  const count = Math.min(MAX_NIGHTS, Math.max(0, nightsUntil(sinceOf(plan, today), big)));
  return Array.from({ length: count }, (_, i) => {
    const morning = daysLater(big, i - count + 1);
    const key = cellKey(morning, NIGHT);
    return { key, state: nightsUntil(today, morning) > 0 ? "later" : ticks?.[key] ? "done" : "now" };
  });
}

/** Whether the big day has come for the child: it is here and the last morning tapped, or it is over. */
export function bigDayCome(plan: Plan, today: Date, ticks: Record<string, number> | undefined): boolean {
  const nights = nightsUntil(today, bigDayOf(plan, today));
  return nights < 0 || (nights === 0 && nightsOf(plan, today, ticks).every((night) => night.state === "done"));
}

/** The parts of a day in two, in their order. */
export const DAY_PARTS: Slot[] = ["morning", "evening"];

/** How many parts a plan's day has: its choice, or for an older plan what its cards say (a midday card makes three). */
export function dayPartsOf(plan: Plan): DayParts {
  if (plan.dayParts) return plan.dayParts;
  const parts = new Set(plan.days.flat().map((step) => step.part));
  return parts.has("noon") ? 3 : parts.has("morning") || parts.has("evening") ? 2 : 1;
}

/** The part a card stands in on a day of `n` parts: none on a whole day, the morning's or the evening's on two. */
export function partIn(step: PlanStep, n: DayParts): Slot | undefined {
  if (n === 1) return undefined;
  if (n === 2) return step.part === "evening" ? "evening" : "morning";
  return step.part ?? "noon";
}

/** A card put into a part of the day: a card its game ticks counts for that part's time (brushing in the evening). */
export function inPart(step: PlanStep, part: Slot | undefined): PlanStep {
  const { part: _, ...rest } = step;
  if (!part) return rest;
  return step.linked && part !== "noon" ? { ...rest, part, slot: part } : { ...rest, part };
}

/**
 * The plan with its day in `n` parts (the band's „Tageszeiten“): one part takes every card's part away; from a whole
 * day the cards are shared out in their order (the first half the morning, the rest the evening – „Mein Tag“ comes back
 * as it was); from two to three the morning and the evening stay and midday starts empty; from three to two the midday
 * cards join the morning. The same card is in the same part on every day.
 */
export function withDayParts(plan: Plan, n: DayParts): Plan {
  const from = dayPartsOf(plan);
  const parts = PARTS_OF[n];
  const rows = weekRows(plan);
  const partOf = new Map<string, Slot | undefined>(
    rows.map((row, i) => [
      row.id,
      n === 1 ? undefined : from === 1 ? parts[Math.min(parts.length - 1, Math.floor((i * parts.length) / Math.max(1, rows.length)))] : partIn(row, n),
    ]),
  );
  const next = withEveryDay(plan, (steps) => inDayOrder(steps.map((step) => inPart(step, partOf.get(step.id) ?? partIn(step, n)))));
  const { dayParts: _, ...rest } = next;
  return n === 1 ? rest : { ...rest, dayParts: n };
}

/**
 * A card put into a day's list: beside the card `at` (before or after it, in its part) – the grown-up's ＋ at a card's
 * edge (user feedback, November 2026: a new card anywhere, WYSIWYG) –, or without `at` at the end of its part, where
 * the part's cards come in the day's order.
 */
export function withInserted(steps: PlanStep[], card: PlanStep, at?: { id: string; side: "before" | "after" }): PlanStep[] {
  const anchor = at ? steps.findIndex((step) => step.id === at.id) : -1;
  if (at && anchor >= 0) {
    const placed = inPart(card, steps[anchor].part);
    const i = at.side === "before" ? anchor : anchor + 1;
    return [...steps.slice(0, i), placed, ...steps.slice(i)];
  }
  const rank = partRank(card.part);
  const last = steps.findLastIndex((step) => partRank(step.part) <= rank);
  return [...steps.slice(0, last + 1), card, ...steps.slice(last + 1)];
}

/** A card with its Zähler; 0 leaves it a plain card. */
const withStars = (step: PlanStep, stars: number): PlanStep => {
  const { stars: _, ...plain } = step;
  return stars > 0 ? { ...plain, stars } : plain;
};

/** The stars a card gets on its day: its Zähler, 0 on a plain plan's card. */
export const starsOf = (step: PlanStep): number => Math.max(0, step.stars ?? 0);

/** Whether a plan's cards count stars (a Zähler above 0 on any card): then it has star fields, and maybe a reward, and no arrow. */
export const counting = (plan: Plan): boolean => plan.days.some((day) => day.some((step) => starsOf(step) > 0));

/** The Zähler shown for the whole plan: the most stars any card has, 0 on a plain plan. */
export const counterOf = (plan: Plan): number => Math.max(0, ...plan.days.flat().map(starsOf));

/** The most a card's Zähler can be: more stars than this for one thing say nothing more to a child. */
export const MAX_STARS = 5;

/** The plan with every card's Zähler set to `stars` (0: a plain plan with the arrow). */
export const withCounter = (plan: Plan, stars: number): Plan => ({ ...plan, days: plan.days.map((day) => day.map((step) => withStars(step, stars))) });

/** Taps that make a card done: one per star, one for a card without. */
const tapsFor = (step: PlanStep): number => Math.max(1, starsOf(step));

/** The stars a card has on a day: its taps, or all of them where its game did it. */
export function starsGot(ticks: Record<string, number> | undefined, linked: LinkedDays, day: Date, step: PlanStep): number {
  if (stepDone(ticks, linked, day, step)) return starsOf(step);
  return Math.min(starsOf(step), ticks?.[cellKey(day, step.id)] ?? 0);
}

/** The days whose stars lead to the reward: the week of a week's plan, else the day shown. */
const goalDays = (plan: Plan, day: Date): Date[] => (plan.view === "week" ? weekOf(day) : [day]);

/** All the stars a plan's cards can get in the days that lead to the reward. */
export const allStars = (plan: Plan, day: Date): number =>
  goalDays(plan, day).reduce((sum, d) => sum + stepsOn(plan, d).reduce((n, step) => n + starsOf(step), 0), 0);

/** Stars until the reward: the grown-up's goal (never more than there are), or all of them. */
export const planGoal = (plan: Plan, day: Date): number => Math.max(1, Math.min(plan.goal ?? Number.POSITIVE_INFINITY, allStars(plan, day)));

/** The stars a plan has in the days that lead to the reward, and how many lead there. */
export function planProgress(plan: Plan, ticks: Record<string, number> | undefined, linked: LinkedDays, day: Date): { count: number; goal: number } {
  const count = goalDays(plan, day).reduce((sum, d) => sum + stepsOn(plan, d).reduce((n, step) => n + starsGot(ticks, linked, d, step), 0), 0);
  return { count, goal: planGoal(plan, day) };
}

/**
 * A card's Zähler on one weekday (Zähneputzen twice on a Monday), or on every day with `null`. In a plan the same every
 * day, one weekday's change parts the days first, so only that day's card changes (the cards keep their ids).
 */
export function withStepStars(plan: Plan, weekdayIndex: number | null, stepId: string, stars: number): Plan {
  const own = plan.same && weekdayIndex !== null ? withSame(plan, false, weekdayIndex) : plan;
  const index = own.same ? 0 : weekdayIndex;
  return {
    ...own,
    days: own.days.map((day, i) => (index === null || i === index ? day.map((step) => (step.id === stepId ? withStars(step, stars) : step)) : day)),
  };
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
  if ((ticks?.[cellKey(day, step.id)] ?? 0) >= tapsFor(step)) return true;
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
  return Object.fromEntries(steps.slice(0, Math.max(0, count)).map((step) => [cellKey(today, step.id), tapsFor(step)]));
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

/** The plan with every day's cards changed alike (`change` gets each day's list): the one list of a plan the same every day, or all seven. */
export function withEveryDay(plan: Plan, change: (steps: PlanStep[]) => PlanStep[]): Plan {
  return { ...plan, days: plan.days.map(change) };
}

/** Where a part of the day stands in the day: the morning first, then the day (midday or none), then the evening. */
export const partRank = (part: Slot | undefined): number => (part === "morning" ? 0 : part === "evening" ? 2 : 1);

/** A day's cards in the day's order (the morning's first, the evening's last), each part keeping its own order. */
export const inDayOrder = (steps: PlanStep[]): PlanStep[] => [...steps].sort((a, b) => partRank(a.part) - partRank(b.part));

/**
 * The rows of a week's grid: every card of the week once, in the day's order (the morning's first, then the day's, then
 * the evening's), each part in the order its cards first come. A day without a row's card leaves its place empty, so
 * the grid keeps its shape whatever single days have (user feedback, November 2026: the layout never changes by
 * itself when one day differs).
 */
export function weekRows(plan: Plan): PlanStep[] {
  const rows: PlanStep[] = [];
  for (const day of plan.same ? plan.days.slice(0, 1) : plan.days) {
    for (const [i, step] of day.entries()) {
      if (rows.some((row) => row.id === step.id)) continue;
      // After the card it follows on its day, so a card only one day has stands where that day has it.
      const before = day.slice(0, i).findLast((s) => rows.some((row) => row.id === s.id));
      const at = before ? rows.findIndex((row) => row.id === before.id) + 1 : 0;
      rows.splice(at, 0, step);
    }
  }
  return inDayOrder(rows);
}

/** Each day's cards sorted as the rows `ids` stand (cards not in it keep their place at the end). */
const inRowOrder = (plan: Plan, ids: string[]): Plan => {
  const rank = (step: PlanStep) => {
    const at = ids.indexOf(step.id);
    return at < 0 ? ids.length : at;
  };
  return withEveryDay(plan, (steps) => [...steps].sort((a, b) => rank(a) - rank(b)));
};

/** A week's row one place up (`by` -1) or down within its part of the day; unchanged at the part's edge. */
export function withRowMoved(plan: Plan, stepId: string, by: -1 | 1): Plan {
  const rows = weekRows(plan);
  const at = rows.findIndex((row) => row.id === stepId);
  const to = at + by;
  if (at < 0 || to < 0 || to >= rows.length || rows[to].part !== rows[at].part) return plan;
  const ids = rows.map((row) => row.id);
  [ids[at], ids[to]] = [ids[to], ids[at]];
  return inRowOrder(plan, ids);
}

/** Whether a week's row can move up (`by` -1) or down within its part of the day. */
export function canMoveRow(plan: Plan, stepId: string, by: -1 | 1): boolean {
  return withRowMoved(plan, stepId, by) !== plan;
}

/** A week's row at another time of day (☀️ morning, 🌤️ the day, 🌙 evening), on every day, its rows in the day's order again. */
export function withRowPart(plan: Plan, stepId: string, part: Slot): Plan {
  const set = (step: PlanStep): PlanStep => {
    if (step.id !== stepId) return step;
    const { part: _, ...rest } = step;
    return part === "noon" ? rest : { ...rest, part };
  };
  const moved = withEveryDay(plan, (steps) => steps.map(set));
  return inRowOrder(
    moved,
    weekRows(moved).map((row) => row.id),
  );
}

/** A week's row with one star more or less on every day it is on (at least 1: 🗑️ takes the row, never −). */
export function withRowStars(plan: Plan, stepId: string, by: number): Plan {
  return withEveryDay(plan, (steps) =>
    steps.map((step) => (step.id === stepId ? withStars(step, Math.max(1, Math.min(MAX_STARS, starsOf(step) + by))) : step)),
  );
}

/**
 * One day's circles of a week's row, one more or less (user feedback, November 2026: a single day's count changed right
 * on its circles): a day without the card gets it with one star, in its row's place; a day's last star taken leaves
 * that day without the card (its place empty), the other days keep theirs.
 */
export function withCellStars(plan: Plan, weekdayIndex: number, stepId: string, by: number): Plan {
  const parted = plan.same ? withSame(plan, false, weekdayIndex) : plan;
  const rows = weekRows(plan);
  const row = rows.find((r) => r.id === stepId);
  if (!row) return plan;
  const steps = parted.days[weekdayIndex] ?? [];
  const own = steps.find((step) => step.id === stepId);
  const n = Math.min(MAX_STARS, (own ? starsOf(own) : 0) + by);
  if (own && n === starsOf(own)) return plan;
  const next =
    n <= 0
      ? steps.filter((step) => step.id !== stepId)
      : own
        ? steps.map((step) => (step.id === stepId ? withStars(step, n) : step))
        : [...steps, withStars({ ...row }, n)];
  const ids = rows.map((r) => r.id);
  const rank = (step: PlanStep) => ids.indexOf(step.id);
  return { ...parted, days: parted.days.map((day, i) => (i === weekdayIndex ? [...next].sort((a, b) => rank(a) - rank(b)) : day)) };
}

/**
 * Whether every day has the same cards in the same order (their stars may differ by day): such a week with a Zähler is
 * drawn as the grid of a reward chart, a row per card and a column per day, as a Belohnungstafel always looked.
 */
export function sameCards(plan: Plan): boolean {
  if (plan.same) return true;
  const ids = (steps: PlanStep[]) => steps.map((step) => step.id).join("|");
  return plan.days.every((day) => ids(day) === ids(plan.days[0]));
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
