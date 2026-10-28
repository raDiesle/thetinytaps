import type { CSSProperties } from "react";
import { dayKey, weekOf } from "@/games/teeth/daytime";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { tapState } from "@/lib/tapTargets";
import { cellKey, type LinkedDays, possessive, weekday } from "./board";
import { STEP_BY_ID, THEME_BY_ID, THEMES } from "./catalog";
import { currentStep, nightsUntil, type Plan, type PlanStep, stepDone, stepsOn } from "./plan";

const DAY_NAMES: Localized<string[]> = { de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] };

/** At most this many moons count the nights until a day of the week; further days are next week's anyway. */
const MAX_MOONS = 6;

/** What a card is now: done, the one to do now, or one still to come. */
export type StepState = "done" | "now" | "later";

/** How a plan is drawn: on screen with today's ticks, or on paper (no ticks, no today), in colour or grey. */
export interface PlanLook {
  print: boolean;
  color: boolean;
}

export const PLAN_SCREEN: PlanLook = { print: false, color: true };

/** A step's words: the grown-up's own or the catalogue's. */
export function useStepLabel() {
  const t = useT();
  return (step: { label?: string; catalog?: string }) => step.label ?? (step.catalog ? t(STEP_BY_ID.get(step.catalog)?.label ?? { de: "" }) : "");
}

/** The heading: the grown-up's own, or one made from the child's name. */
export function usePlanTitle() {
  const t = useT();
  return (plan: Plan) => {
    if (plan.title.trim()) return plan.title.trim();
    const name = plan.childName.trim();
    if (plan.view === "week") return name ? t({ de: `${possessive(name)} Woche` }) : t({ de: "Meine Woche" });
    return name ? t({ de: `${possessive(name)} Tag` }) : t({ de: "Mein Tag" });
  };
}

/**
 * Rows and columns for `count` cards in a box of width / height `aspect`, so each card is as big as it can be (a card is
 * a little taller than wide: picture over its word). Reading order: left to right, then the next row.
 */
export function planLayout(count: number, aspect: number): { cols: number; rows: number } {
  let best = { cols: Math.max(1, count), rows: 1, size: 0 };
  for (let rows = 1; rows <= Math.max(1, count); rows++) {
    const cols = Math.ceil(count / rows);
    // Width of a card when the box is 1 high, with a card 1.25 times as tall as wide.
    const size = Math.min(aspect / cols, 1 / rows / 1.25);
    if (size > best.size + 1e-9) best = { cols, rows, size };
  }
  return { cols: best.cols, rows: best.rows };
}

/**
 * A plan as one picture, the same on screen and on paper: the heading, and either one day's steps as big cards in
 * their order (Jetzt and Dann above the cards on screen; Erst and Dann on a plan of two) or the week in seven columns
 * with moons for the nights until each day. Pure markup – PlanScreen adds the taps through `data-step` – sized in
 * container units like BoardSheet.
 */
export function PlanSheet({
  plan,
  ticks,
  linked,
  today,
  day = today,
  look,
  aspect,
  fresh,
}: {
  plan: Plan;
  /** Ticks shown: real ones and examples. */
  ticks: Record<string, number> | undefined;
  linked: LinkedDays;
  /** The real today: its column is marked, and only its cards can be ticked. */
  today: Date;
  /** The day shown in the day view (or the week it is in). */
  day?: Date;
  look: PlanLook;
  /** Width / height of the sheet, to lay out the cards. */
  aspect: number;
  /** The card just ticked, to pop its tick in. */
  fresh?: string | null;
}) {
  const t = useT();
  const { speechLang } = useAppLanguage();
  const title = usePlanTitle()(plan);
  const theme = THEME_BY_ID.get(plan.theme) ?? THEMES[0];
  const grey = look.print && !look.color;
  const style = grey ? undefined : ({ "--rw-paper": theme.paper, "--rw-main": theme.main, "--rw-ink": theme.ink } as CSSProperties);
  const shown = look.print ? undefined : ticks;
  const dateFormat = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(speechLang, options);
  const sub =
    plan.view === "week"
      ? look.print
        ? `${t({ de: "Woche vom" })} ____________`
        : dateFormat({ day: "numeric", month: "short" }).formatRange(weekOf(day)[0], weekOf(day)[6])
      : look.print
        ? plan.same
          ? ""
          : dateFormat({ weekday: "long" }).format(day)
        : dateFormat({ weekday: "long", day: "numeric", month: "long" }).format(day);

  return (
    <div className={`rw-sheet pl-sheet pl-view-${plan.view}${look.print ? " rw-on-paper" : ""}${grey ? " rw-grey" : ""}`} style={style}>
      <header className="rw-head">
        <span className="rw-title">{title}</span>
        {sub && <span className="rw-blank">{sub}</span>}
      </header>
      <div className="rw-body">
        {plan.view === "day" ? (
          <DaySteps plan={plan} ticks={shown} linked={linked} today={today} day={day} look={look} aspect={aspect} fresh={fresh} />
        ) : (
          <WeekColumns plan={plan} ticks={shown} linked={linked} today={today} day={day} look={look} fresh={fresh} />
        )}
      </div>
    </div>
  );
}

interface StepsProps {
  plan: Plan;
  ticks: Record<string, number> | undefined;
  linked: LinkedDays;
  today: Date;
  day: Date;
  look: PlanLook;
  fresh?: string | null;
}

/** The state of each step of a day: today done, now or later; another day's are done where ticked, else later. */
function statesOf({ ticks, linked, today, look }: StepsProps, day: Date, steps: PlanStep[]): StepState[] {
  if (look.print) return steps.map(() => "later");
  const now = dayKey(day) === dayKey(today) ? currentStep(steps, ticks, linked, day) : -1;
  return steps.map((step, i) => (stepDone(ticks, linked, day, step) ? "done" : i === now ? "now" : "later"));
}

/** One step as a card: its picture, its word, its number in the day, and a tick once done. */
function StepCard({
  day,
  step,
  state,
  number,
  look,
  fresh,
  small = false,
}: {
  day: Date;
  step: PlanStep;
  state: StepState;
  number?: number;
  look: PlanLook;
  fresh?: string | null;
  small?: boolean;
}) {
  const label = useStepLabel()(step);
  const key = cellKey(day, step.id);
  return (
    <div
      className={`pl-card ${state}${small ? " small" : ""}${fresh === key ? " fresh" : ""}`}
      data-step={look.print ? undefined : key}
      data-state={look.print ? undefined : state}
      data-tap={look.print ? undefined : tapState({ goal: state === "now", done: state === "done" })}
    >
      {number !== undefined && <span className="pl-number">{number}</span>}
      <span className="pl-emoji" aria-hidden>
        {step.emoji}
      </span>
      <span className="pl-label">{label}</span>
      {state === "done" && (
        <span className="pl-tick" aria-hidden>
          ✓
        </span>
      )}
    </div>
  );
}

/** One day's steps as big cards in their order; on screen „Jetzt“ over the one to do and „Dann“ over the next. */
function DaySteps(props: StepsProps & { aspect: number }) {
  const { plan, day, look, aspect, fresh } = props;
  const t = useT();
  const steps = stepsOn(plan, day);
  const states = statesOf(props, day, steps);
  const now = states.indexOf("now");
  // Two cards are an Erst–Dann: always named so, with a big arrow between them.
  if (steps.length === 2) {
    return (
      <div className="pl-firstthen">
        {steps.map((step, i) => (
          <div key={step.id} className="pl-slot">
            <span className="pl-tag">{i === 0 ? t({ de: "Erst" }) : t({ de: "Dann" })}</span>
            <StepCard day={day} step={step} state={states[i]} look={look} fresh={fresh} />
          </div>
        ))}
        <span className="pl-arrow" aria-hidden>
          ➜
        </span>
      </div>
    );
  }
  // The body is a little less wide than the sheet: the heading takes some of its height.
  const { cols, rows } = planLayout(steps.length, aspect * 1.12);
  return (
    <ol className="pl-steps" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
      {steps.map((step, i) => (
        <li key={step.id} className="pl-slot">
          <span className={`pl-tag${i === now || (now >= 0 && i === now + 1) ? "" : " empty"}`}>
            {i === now ? t({ de: "Jetzt" }) : now >= 0 && i === now + 1 ? t({ de: "Dann" }) : " "}
          </span>
          <StepCard day={day} step={step} state={states[i]} number={i + 1} look={look} fresh={fresh} />
        </li>
      ))}
      {steps.length === 0 && <li className="pl-empty">{t({ de: "Noch keine Schritte – unter „Gestalten“ hinzufügen." })}</li>}
    </ol>
  );
}

/** The week: a column per day with its steps; today's marked, and moons over the days to come – one per night until then. */
function WeekColumns(props: StepsProps) {
  const { plan, today, day, look, fresh } = props;
  const t = useT();
  const names = t(DAY_NAMES);
  const week = weekOf(day);
  const most = Math.max(1, ...week.map((d) => stepsOn(plan, d).length));
  return (
    <div className="pl-week" style={{ "--pl-rows": most } as CSSProperties}>
      {week.map((d) => {
        const steps = stepsOn(plan, d);
        const states = statesOf(props, d, steps);
        const nights = look.print ? 0 : nightsUntil(today, d);
        const isToday = !look.print && nights === 0;
        return (
          <div key={dayKey(d)} className={`pl-col${isToday ? " today" : ""}${nights < 0 ? " past" : ""}`}>
            <span className="pl-day" data-day={look.print ? undefined : dayKey(d)} data-tap={look.print ? undefined : ""}>
              <span className="pl-day-name">{isToday ? t({ de: "Heute" }) : names[weekday(d)]}</span>
              {nights > 0 && nights <= MAX_MOONS && (
                <span className="pl-moons" role="img" aria-label={t({ de: `noch ${nights}-mal schlafen` })}>
                  {"🌙".repeat(nights)}
                </span>
              )}
            </span>
            {steps.map((step, i) => (
              <StepCard key={step.id} day={d} step={step} state={states[i]} look={look} fresh={fresh} small />
            ))}
          </div>
        );
      })}
    </div>
  );
}
