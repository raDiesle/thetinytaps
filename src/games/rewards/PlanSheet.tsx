import type { CSSProperties } from "react";
import { dayKey, weekOf } from "@/games/teeth/daytime";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { tapState } from "@/lib/tapTargets";
import { AUTO_TITLES, cellKey, isTemplateTitle, type LinkedDays, weekday } from "./board";
import { DAY_NAMES, PLAN_TEMPLATES, SLOT_BY_ID, type Slot, STEP_BY_ID, THEME_BY_ID, THEMES } from "./catalog";
import { ItemPic, SheetStrip } from "./pictures";
import { nightsUntil, nowSteps, pairsOf, partsOf, type Plan, type PlanStep, splitDone, stepDone, stepsOn } from "./plan";

/** Over the first of an Erst–Dann pair. */
const FIRST: Localized = { de: "Erst", en: "First", zh: "先", hi: "पहले", es: "Primero", ar: "أولًا", ru: "Сначала" };
/** Over the card to do now. */
const NOW: Localized = { de: "Jetzt", en: "Now", zh: "现在", hi: "अभी", es: "Ahora", ar: "الآن", ru: "Сейчас" };
/** Over the cards after „Jetzt“, and the second of an Erst–Dann pair. */
const THEN: Localized = { de: "Dann", en: "Then", zh: "然后", hi: "फिर", es: "Después", ar: "ثم", ru: "Потом" };
/** Over today's column of a week. */
export const TODAY: Localized = { de: "Heute", en: "Today", zh: "今天", hi: "आज", es: "Hoy", ar: "اليوم", ru: "Сегодня" };

/** „Noch 3-mal schlafen“: the nights until a day of the week, said to the child (each language with its own plural). */
export const SLEEPS_LEFT: Localized<(nights: number) => string> = {
  de: (n) => (n === 1 ? "Noch einmal schlafen" : `Noch ${n}-mal schlafen`),
  en: (n) => (n === 1 ? "One more sleep" : `${n} more sleeps`),
  zh: (n) => (n === 1 ? "再睡一觉" : `再睡${n}觉`),
  hi: (n) => (n === 1 ? "बस एक बार और सोना है" : `बस ${n} बार और सोना है`),
  es: (n) => (n === 1 ? "Falta una noche" : `Faltan ${n} noches`),
  ar: (n) => (n === 1 ? "بقيت ليلة واحدة" : n === 2 ? "بقيت ليلتان" : n <= 10 ? `بقيت ${n} ليالٍ` : `بقيت ${n} ليلة`),
  ru: (n) => (n === 1 ? "Ещё разок поспать" : `Ещё ${n} ${new Intl.PluralRules("ru").select(n) === "few" ? "раза" : "раз"} поспать`),
};

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
  return (step: { label?: string; catalog?: string }) => {
    const known = step.catalog ? STEP_BY_ID.get(step.catalog)?.label : undefined;
    return step.label ?? (known ? t(known) : "");
  };
}

/** The heading: the grown-up's own, or one made from the child's name. */
export function usePlanTitle() {
  const t = useT();
  return (plan: Plan) => {
    const own = plan.title.trim();
    const template = PLAN_TEMPLATES.find((tpl) => tpl.id === plan.template)?.title;
    if (own) return isTemplateTitle(own, template) ? t(template) : own;
    return t(AUTO_TITLES[plan.view === "week" ? "planWeek" : "day"])(plan.childName.trim());
  };
}

/**
 * Rows and columns for `count` cards in a box of width / height `aspect`, so each card is as big as it can be (a card is
 * square: a picture without words, as the child doesn't read). As many as fit stay in one row: another row only where
 * it makes the cards clearly bigger (`ROW_GAIN`, user feedback, November 2026). Reading order: left to right, then the
 * next row.
 */
export function planLayout(count: number, aspect: number): { cols: number; rows: number } {
  let best = { cols: Math.max(1, count), rows: 1, size: 0 };
  for (let rows = 1; rows <= Math.max(1, count); rows++) {
    const cols = Math.ceil(count / rows);
    // Width of a card when the box is 1 high.
    const size = Math.min(aspect / cols, 1 / rows);
    if (size > best.size * ROW_GAIN) best = { cols, rows, size };
  }
  return { cols: best.cols, rows: best.rows };
}

/** How much bigger the cards must get for another row: a day read in one line beats cards a little bigger. */
const ROW_GAIN = 1.15;

/**
 * A plan as one picture, the same on screen and on paper: the heading (no date – the switch above says the day), and
 * the cards in the plan's view: Jetzt – Dann (every step in its order, the day's parts in rows of their own, a marker
 * on the one to do – or that one apart and big in a „Jetzt“ field), Erst – Dann (pairs, up to four on a page) or the
 * week in seven columns with moons for the nights until each day. Pure markup – PlanScreen adds the taps
 * through `data-step` – sized in container units like BoardSheet.
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
  /** The day shown in the day views (or the week it is in). */
  day?: Date;
  look: PlanLook;
  /** Width / height of the sheet, to lay out the cards. */
  aspect: number;
  /** The card just ticked, to pop its tick in. */
  fresh?: string | null;
}) {
  const { speechLang } = useAppLanguage();
  const title = usePlanTitle()(plan);
  const theme = THEME_BY_ID.get(plan.theme) ?? THEMES[0];
  const grey = look.print && !look.color;
  const style = grey ? undefined : ({ "--rw-paper": theme.paper, "--rw-main": theme.main, "--rw-ink": theme.ink } as CSSProperties);
  const shown = look.print ? undefined : ticks;
  // Only a printed day of a plan whose weekdays differ says which day it is; the screen has the switch above.
  const sub = look.print && plan.view !== "week" && !plan.same ? new Intl.DateTimeFormat(speechLang, { weekday: "long" }).format(day) : "";
  const props: StepsProps = { plan, ticks: shown, linked, today, day, look, fresh };

  return (
    <div className={`rw-sheet pl-sheet pl-view-${plan.view}${look.print ? " rw-on-paper" : ""}${grey ? " rw-grey" : ""}`} style={style}>
      {look.print && look.color && <SheetStrip theme={theme} />}
      <header className="rw-head">
        <span className="rw-title">{title}</span>
        {sub && <span className="rw-blank">{sub}</span>}
      </header>
      <div className="rw-body">
        {plan.view === "week" ? (
          <WeekColumns {...props} />
        ) : plan.view === "first-then" ? (
          <FirstThen {...props} aspect={aspect} />
        ) : (
          <DaySteps {...props} aspect={aspect} />
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
function statesOf({ plan, ticks, linked, today, look }: StepsProps, day: Date, steps: PlanStep[]): StepState[] {
  if (look.print) return steps.map(() => "later");
  const now = dayKey(day) === dayKey(today) ? nowSteps(plan.view, steps, ticks, linked, day) : [];
  return steps.map((step, i) => (stepDone(ticks, linked, day, step) ? "done" : now.includes(i) ? "now" : "later"));
}

/**
 * One step as a card: its picture, its number in the day, and a tick once done. No word on it – the child doesn't read
 * (user feedback, November 2026); the word is only its name for a mouse's tooltip and read out.
 */
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
      role="img"
      aria-label={label}
      title={look.print ? undefined : label}
    >
      {number !== undefined && <span className="pl-number">{number}</span>}
      <span className="pl-emoji" aria-hidden>
        <ItemPic item={step} lines={look.print && !look.color} />
      </span>
      {state === "done" && (
        <span className="pl-tick" aria-hidden>
          ✓
        </span>
      )}
    </div>
  );
}

/** The Fertig-Kiste of a day on screen, or nothing on paper and on a day without steps. */
function dayBox({ plan, look, day, fresh }: StepsProps, steps: PlanStep[], done: PlanStep[], open: PlanStep[]) {
  if (look.print || steps.length === 0) return null;
  return <DoneBox day={day} done={done} example={plan.examples} fresh={fresh} full={open.length === 0} />;
}

/** „Noch keine Schritte“: a plan with nothing on this day yet. */
function NoSteps() {
  const t = useT();
  return (
    <p className="pl-empty">
      {t({
        de: "Noch keine Schritte – unter „Gestalten“ hinzufügen.",
        en: "No steps yet – add some under “Design”.",
        zh: "还没有步骤——请在“设计”里添加。",
        hi: "अभी कोई क़दम नहीं – „डिज़ाइन“ में जोड़ें।",
        es: "Aún no hay pasos: añádalos en «Diseñar».",
        ar: "لا توجد خطوات بعد – أضيفوها في «تصميم».",
        ru: "Пока нет шагов – добавьте их в разделе «Оформление».",
      })}
    </p>
  );
}

/** A part's sign before its row: ☀️ for the morning, 🌙 for the evening – a picture, not a word („Morgens“ only read out). */
function PartName({ part }: { part: Slot }) {
  const t = useT();
  const slot = SLOT_BY_ID.get(part);
  return slot ? (
    <span className="pl-part" role="img" aria-label={t(slot.label)} title={t(slot.label)}>
      {slot.emoji}
    </span>
  ) : null;
}

/**
 * The marker of a Jetzt – Dann on screen: an arrow cut out of red card, a strip of tape on its tail, as a grown-up would
 * cut one at home (user feedback, November 2026) – it points up at the card to do from below it. Its edges are a little
 * uneven on purpose, cut by hand. Also the picture of „Pfeil wandert“ in the wizard.
 */
export function PaperArrow({ className = "" }: { className?: string }) {
  return (
    <svg className={`pl-paper-arrow ${className}`} viewBox="0 0 100 120" aria-hidden>
      <path d="M51 3 L95 49 L69 47.5 L67.5 115 L34 117.5 L32.5 49.5 L6 52 Z" fill="#e8590c" stroke="#a83a06" strokeWidth="3" strokeLinejoin="round" />
      {/* The card's lighter grain along one side, and a pencil line left from drawing it before cutting. */}
      <path d="M51 9 L86 47" stroke="#ff8a4c" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d="M40 55 L41 108" stroke="#8a3005" strokeWidth="1.2" strokeDasharray="4 5" opacity="0.5" />
      <rect x="22" y="86" width="58" height="17" rx="1.5" fill="#fffbe6" opacity="0.78" transform="rotate(-8 51 94)" />
    </svg>
  );
}

/**
 * Jetzt – Dann: one day's steps as cards in their order, a row per part of the day (Morgen, Abend) with its sun or moon
 * before it. As it is printed every card stays in its place, read from the top left to the bottom right, and a marker –
 * a paper arrow the child moves on (`PaperArrow`) – points up at the card to do; a done card keeps its place with a
 * tick. With the „Jetzt“ field (`nowField`) the card to do stands apart under a pointing hand, big and in front, the
 * rest follows smaller beyond a line, and a done card leaves for the Fertig-Kiste below, as on a Velcro board
 * at home – so on paper that board is empty frames, and the cards come on a page of their own to cut out.
 */
function DaySteps(props: StepsProps & { aspect: number }) {
  const { plan, ticks, linked, day, look, aspect, fresh } = props;
  const steps = stepsOn(plan, day);
  const field = !!plan.nowField;
  if (field && look.print) return <FieldFrames count={steps.length} aspect={aspect} />;
  const states = statesOf(props, day, steps);
  const { open, done } = field ? splitDone(steps, ticks, linked, day) : { open: steps, done: [] };
  const lead = field ? open.find((step) => states[steps.indexOf(step)] === "now") : undefined;
  const rest = open.filter((step) => step !== lead);
  const parts = partsOf(rest);
  // A part's name only where the day has more than one, also once the morning's cards are all done.
  const named = partsOf(steps).length > 1;
  const box = field ? dayBox(props, steps, done, open) : null;
  // The room for the rows: the sheet less its heading and the box, less the „Jetzt“ column; each part a row of it.
  const width = lead ? 0.62 : 1;
  const card = (step: PlanStep) => (
    <StepCard day={day} step={step} state={states[steps.indexOf(step)]} number={steps.indexOf(step) + 1} look={look} fresh={fresh} />
  );
  return (
    <div className={`pl-dayview${field ? "" : " pl-marked"}`}>
      {steps.length === 0 && <NoSteps />}
      {open.length > 0 && (
        <div className={`pl-flow${lead ? " has-now" : ""}`}>
          {lead && (
            <div className="pl-now">
              <NowSign />
              <div className="pl-slot">{card(lead)}</div>
            </div>
          )}
          {rest.length > 0 && (
            <div className="pl-then">
              {parts.map(({ part, steps: row }, i) => {
                // Several parts (morning, evening): each a line of cards as tall as its row, from the left.
                const { cols, rows } = planLayout(row.length, aspect * (box ? 1.5 : 1.12) * width);
                return (
                  <div key={`${part}-${i}`} className={`pl-row${part && named ? " pl-row-named" : ""}`}>
                    {part && named && <PartName part={part} />}
                    <ol
                      className={`pl-steps${parts.length > 1 ? " pl-line" : ""}`}
                      style={
                        parts.length > 1
                          ? undefined
                          : { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }
                      }
                    >
                      {row.map((step) => (
                        <li key={step.id} className="pl-slot">
                          {/* The marker the child moves on, under the card to do (never printed: on paper it is a real one). */}
                          {!field && !look.print && states[steps.indexOf(step)] === "now" && <PaperArrow className="pl-marker" />}
                          {card(step)}
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {box}
    </div>
  );
}

/** Over the „Jetzt“ field: a hand pointing down at its card, no word („Jetzt“ only read out). */
function NowSign() {
  const t = useT();
  return (
    <span className="pl-tag pl-tag-now" role="img" aria-label={t(NOW)}>
      👇
    </span>
  );
}

/**
 * A Jetzt – Dann board with the „Jetzt“ field on paper: an empty frame under „Jetzt“ and one under „Dann“ for every
 * other card, to stick the cut-out cards on with Velcro.
 */
function FieldFrames({ count, aspect }: { count: number; aspect: number }) {
  if (count === 0) return <NoSteps />;
  const { cols, rows } = planLayout(Math.max(1, count - 1), aspect * 1.12 * 0.62);
  return (
    <div className="pl-dayview">
      <div className="pl-flow has-now">
        <div className="pl-now">
          <NowSign />
          <div className="pl-slot">
            <span className="pl-frame" />
          </div>
        </div>
        {count > 1 && (
          <div className="pl-then">
            <ol className="pl-steps" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
              {Array.from({ length: count - 1 }, (_, i) => (
                <li key={i} className="pl-slot">
                  <span className="pl-frame" />
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

/** Rows and columns for `count` Erst–Dann pairs in a box of width / height `aspect`: each pair about 2.3 times as wide as tall. */
function pairLayout(count: number, aspect: number): { cols: number; rows: number } {
  let best = { cols: 1, rows: Math.max(1, count), size: 0 };
  for (let cols = 1; cols <= Math.max(1, count); cols++) {
    const rows = Math.ceil(count / cols);
    const size = Math.min(aspect / cols / 2.3, 1 / rows);
    if (size > best.size + 1e-9) best = { cols, rows, size };
  }
  return best;
}

/**
 * Erst – Dann: the plan's cards two by two, each pair a small board of its own – a card, an arrow, a card – used when
 * it fits, so each pair's first open card is the one to do. Up to four pairs fill a page, to cut apart. Done cards keep
 * their place with a tick.
 */
function FirstThen(props: StepsProps & { aspect: number }) {
  const { plan, day, look, aspect, fresh } = props;
  const t = useT();
  const steps = stepsOn(plan, day);
  const states = statesOf(props, day, steps);
  const pairs = pairsOf(steps);
  const { cols, rows } = pairLayout(pairs.length, aspect * 1.12);
  if (steps.length === 0) return <NoSteps />;
  return (
    <div className="pl-pairs" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
      {pairs.map((pair) => (
        <div key={pair[0].id} className={`pl-pair${pair.every((step) => states[steps.indexOf(step)] === "done") ? " done" : ""}`}>
          {[0, 1].map((i) => (
            <div key={i} className="pl-pair-slot" role="group" aria-label={t(i === 0 ? FIRST : THEN)}>
              <div className="pl-slot">
                {pair[i] ? (
                  <StepCard day={day} step={pair[i]} state={states[steps.indexOf(pair[i])]} look={look} fresh={fresh} />
                ) : (
                  <span className="pl-frame" />
                )}
              </div>
            </div>
          ))}
          <span className="pl-arrow" aria-hidden>
            ➜
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * The Fertig-Kiste at the bottom edge: the day's done cards stand in it, peeking over its rim, in the order they were
 * done. When every card is in it, it fills the sheet. A card in it can be tapped (it twinkles and says itself), the box
 * too (it names what is done).
 */
function DoneBox({ day, done, example, fresh, full }: { day: Date; done: PlanStep[]; example?: boolean; fresh?: string | null; full: boolean }) {
  const stepLabel = useStepLabel();
  return (
    <div className={`pl-box${full ? " full" : ""}`} data-box="" data-tap="done">
      <div className="pl-box-cards" style={{ "--pl-in-box": Math.max(1, done.length) } as CSSProperties}>
        {done.map((step, i) => {
          const key = cellKey(day, step.id);
          return (
            <span
              key={step.id}
              className={`pl-box-card${fresh === key ? " fresh" : ""}${example ? " example" : ""}`}
              data-step={key}
              data-state="done"
              data-tap="done"
              title={stepLabel(step)}
              style={{ "--pl-tilt": `${(i % 2 ? 1 : -1) * (4 + ((i * 3) % 5))}deg` } as CSSProperties}
            >
              <ItemPic item={step} />
            </span>
          );
        })}
      </div>
      <span className="pl-box-front" aria-hidden />
    </div>
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
              <span className="pl-day-name">{isToday ? t(TODAY) : names[weekday(d)]}</span>
              {nights > 0 && nights <= MAX_MOONS && (
                <span className="pl-moons" role="img" aria-label={t(SLEEPS_LEFT)(nights)}>
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
