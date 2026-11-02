import type { CSSProperties } from "react";
import { dayKey, weekOf } from "@/games/teeth/daytime";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { tapState } from "@/lib/tapTargets";
import { AUTO_TITLES, cellKey, isTemplateTitle, type LinkedDays, weekday } from "./board";
import { useRewardLabel } from "./BoardSheet";
import { DAY_NAMES, PLAN_TEMPLATES, SLOT_BY_ID, type Slot, STEP_BY_ID, THEME_BY_ID, THEMES } from "./catalog";
import { ItemPic, SheetStrip } from "./pictures";
import {
  counting,
  MAX_PART_STEPS,
  MAX_STEPS,
  nightsUntil,
  nowSteps,
  pairsOf,
  partsOf,
  type Plan,
  type PlanStep,
  planProgress,
  splitDone,
  starsGot,
  starsOf,
  stepDone,
  stepsOn,
} from "./plan";

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
 * A plan as one picture, the same on screen, on paper and while it is made or changed: the heading (no date – the
 * switch above says the day), and the cards in the plan's view: Jetzt – Dann (every step in its order, the day's parts
 * in rows of their own, a marker on the one to do – or that one apart and big in a „Jetzt“ field), Erst – Dann (pairs,
 * up to four on a page) or the week in seven columns with moons for the nights until each day. Where the cards count
 * stars (a Zähler above 0, `counting`), each card has its row of star fields and the arrow is left out – the stars show
 * what is done –, and the reward stands at the sheet's end with how many stars are there. With `edit` (the wizard and
 * „Gestalten“) the same sheet shows where to add a card (＋), take a line of the day away (✕) or set a reward, and its
 * cards and reward are taps of `ChartEditor`. Pure markup – PlanScreen and ChartEditor add the taps through
 * `data-step` and `data-edit` – sized in container units like BoardSheet.
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
  edit = false,
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
  /** Being made or changed: the places to add, take away and choose are drawn (`data-edit`), never on paper. */
  edit?: boolean;
}) {
  const { speechLang } = useAppLanguage();
  const title = usePlanTitle()(plan);
  const theme = THEME_BY_ID.get(plan.theme) ?? THEMES[0];
  const grey = look.print && !look.color;
  const style = grey ? undefined : ({ "--rw-paper": theme.paper, "--rw-main": theme.main, "--rw-ink": theme.ink } as CSSProperties);
  const shown = look.print ? undefined : ticks;
  // Only a printed day of a plan whose weekdays differ says which day it is; the screen has the switch above.
  const sub = look.print && plan.view !== "week" && !plan.same ? new Intl.DateTimeFormat(speechLang, { weekday: "long" }).format(day) : "";
  const editing = edit && !look.print;
  const props: StepsProps = { plan, ticks: shown, linked, today, day, look, fresh, counts: counting(plan), edit: editing };

  return (
    <div
      className={`rw-sheet pl-sheet pl-view-${plan.view}${look.print ? " rw-on-paper" : ""}${grey ? " rw-grey" : ""}${editing ? " pl-editing" : ""}`}
      style={style}
    >
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
        {props.counts && (plan.reward || editing) && <PlanGoal {...props} />}
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
  /** The cards count stars: star fields on them, no arrow, every open card of today tapped for its star. */
  counts: boolean;
  /** Being made or changed (`PlanSheet`'s `edit`). */
  edit: boolean;
}

/**
 * The state of each step of a day: today done, now or later; another day's are done where ticked, else later. Where
 * the cards count stars every open card of today is „now“ – the stars, not an order, show what is done.
 */
function statesOf({ plan, ticks, linked, today, look, counts }: StepsProps, day: Date, steps: PlanStep[]): StepState[] {
  if (look.print) return steps.map(() => "later");
  const isToday = dayKey(day) === dayKey(today);
  const now = !isToday ? [] : counts ? steps.map((_, i) => i) : nowSteps(plan.view, steps, ticks, linked, day);
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
  got = 0,
  small = false,
}: {
  day: Date;
  step: PlanStep;
  state: StepState;
  number?: number;
  look: PlanLook;
  fresh?: string | null;
  /** Its stars there today, where it counts stars (`PlanStep.stars`). */
  got?: number;
  small?: boolean;
}) {
  const label = useStepLabel()(step);
  const key = cellKey(day, step.id);
  const stars = starsOf(step);
  return (
    <div
      className={`pl-card ${state}${small ? " small" : ""}${stars ? " has-stars" : ""}${fresh === key ? " fresh" : ""}`}
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
      {stars > 0 && <StarFields stars={stars} got={look.print ? 0 : got} />}
      {state === "done" && !stars && (
        <span className="pl-tick" aria-hidden>
          ✓
        </span>
      )}
    </div>
  );
}

/**
 * A card's star fields along its foot, one per star of its Zähler: filled as the child taps, the newest popping in. On
 * paper empty rings, for a sticker or a crayon.
 */
function StarFields({ stars, got }: { stars: number; got: number }) {
  return (
    <span className="pl-stars" aria-hidden>
      {Array.from({ length: stars }, (_, i) => (
        <span key={i} className={`pl-star${i < got ? " filled" : ""}${i === got - 1 ? " last" : ""}`}>
          {i < got ? "⭐" : ""}
        </span>
      ))}
    </span>
  );
}

/**
 * The reward at the end of a plan that counts stars: its picture, its name and how many stars are there of how many
 * lead to it (on paper the number to reach). While the plan is made it is a tap to change it, and where it has none a
 * dashed „＋ Belohnung“ to add one – without it the stars stay, only the picture goes.
 */
function PlanGoal({ plan, ticks, linked, day, look, edit }: StepsProps) {
  const t = useT();
  const rewardLabel = useRewardLabel();
  const { count, goal } = planProgress(plan, ticks, linked, day);
  const reward = plan.reward;
  if (!reward)
    return (
      <div className="pl-goal pl-goal-add" data-edit="reward" role="button" tabIndex={0}>
        <span aria-hidden>🎁</span>
        <span className="pl-goal-label">＋ {t({ de: "Belohnung" })}</span>
      </div>
    );
  const label = rewardLabel(reward);
  return (
    <div className={`pl-goal${!look.print && count >= goal ? " reached" : ""}`} data-edit={edit ? "reward" : undefined} title={label}>
      <span className="pl-goal-pic" aria-hidden>
        <ItemPic item={reward} kind="reward" lines={look.print && !look.color} />
      </span>
      <span className="pl-goal-label">{label}</span>
      <span className="pl-goal-count" role="img" aria-label={`${look.print ? goal : count} / ${goal}`}>
        <span aria-hidden>⭐</span> {look.print ? goal : `${Math.min(count, goal)} / ${goal}`}
      </span>
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
function PartName({ part, edit = false }: { part: Slot; edit?: boolean }) {
  const t = useT();
  const slot = SLOT_BY_ID.get(part);
  if (!slot) return null;
  return (
    <span className="pl-part" role="img" aria-label={t(slot.label)} title={t(slot.label)}>
      {slot.emoji}
      {/* While the plan is made: the line of this part of the day goes (its cards with it). */}
      {edit && (
        <span className="pl-row-remove" data-edit="row" data-part={part} role="button" tabIndex={0} aria-label={t({ de: "Zeile entfernen" })}>
          ✕
        </span>
      )}
    </span>
  );
}

/** While a plan is made: where a card is added – at the end of a part's line, or of a day's column in the week. */
function AddCard({ part, day, small = false }: { part?: Slot; day?: string; small?: boolean }) {
  const t = useT();
  return (
    <span
      className={`pl-add${small ? " small" : ""}`}
      data-edit="add"
      data-part={part}
      data-day={day}
      role="button"
      tabIndex={0}
      aria-label={t({ de: "Karte dazu" })}
      title={t({ de: "Karte dazu" })}
    >
      ＋
    </span>
  );
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
  const { plan, ticks, linked, day, look, aspect, fresh, counts, edit } = props;
  const steps = stepsOn(plan, day);
  // Cards that count stars stay in their place: the stars show what is done, no field and no arrow are needed.
  const field = !!plan.nowField && !counts && !edit;
  if (field && look.print) return <FieldFrames count={steps.length} aspect={aspect} />;
  const states = statesOf(props, day, steps);
  const { open, done } = field ? splitDone(steps, ticks, linked, day) : { open: steps, done: [] };
  const lead = field ? open.find((step) => states[steps.indexOf(step)] === "now") : undefined;
  const rest = open.filter((step) => step !== lead);
  const parts = partsOf(rest);
  // A part's name only where the day has more than one, also once the morning's cards are all done.
  const named = partsOf(steps).length > 1;
  const box = field ? dayBox(props, steps, done, open) : null;
  // The room for the rows: the sheet less its heading and the box, less the „Jetzt“ column and the reward; each part a row of it.
  const width = (lead ? 0.62 : 1) * (counts && (plan.reward || edit) ? 0.82 : 1);
  const card = (step: PlanStep) => (
    <StepCard
      day={day}
      step={step}
      state={states[steps.indexOf(step)]}
      number={steps.indexOf(step) + 1}
      look={look}
      fresh={fresh}
      got={starsGot(ticks, linked, day, step)}
    />
  );
  // While it is made, a line can take another card where there is room for it.
  const roomIn = (row: PlanStep[], part?: Slot) => edit && row.length < (part ? MAX_PART_STEPS : MAX_STEPS);
  return (
    <div className={`pl-dayview${field ? "" : " pl-marked"}`}>
      {steps.length === 0 &&
        (edit ? (
          <ol className="pl-steps pl-line">
            <li className="pl-slot">
              <AddCard />
            </li>
          </ol>
        ) : (
          <NoSteps />
        ))}
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
                const adding = roomIn(row, part);
                const { cols, rows } = planLayout(row.length + (adding ? 1 : 0), aspect * (box ? 1.5 : 1.12) * width);
                return (
                  <div key={`${part}-${i}`} className={`pl-row${part && (named || edit) ? " pl-row-named" : ""}`}>
                    {part && (named || edit) && <PartName part={part} edit={edit && named} />}
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
                          {/* The marker the child moves on, under the card to do (never printed: on paper it is a real
                              one) – only where the cards count no stars, which show what is done by themselves. */}
                          {!field && !counts && !edit && !look.print && states[steps.indexOf(step)] === "now" && <PaperArrow className="pl-marker" />}
                          {card(step)}
                        </li>
                      ))}
                      {adding && (
                        <li className="pl-slot">
                          <AddCard part={part} />
                        </li>
                      )}
                    </ol>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {/* A day in two with one line taken away: while it is made, the missing part can come back. */}
      {edit && named === false && steps.some((step) => step.part) && <MissingPart steps={steps} />}
      {box}
    </div>
  );
}

/** While a plan is made: the part of the day whose line was taken away, as a ＋ before its sun or moon to bring it back. */
function MissingPart({ steps }: { steps: PlanStep[] }) {
  const t = useT();
  const gone = (["morning", "evening"] as Slot[]).find((part) => !steps.some((step) => step.part === part));
  const slot = gone && SLOT_BY_ID.get(gone);
  if (!slot) return null;
  return (
    <span className="pl-part-back" data-edit="add" data-part={slot.id} role="button" tabIndex={0}>
      ＋ {slot.emoji} {t(slot.label)}
    </span>
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
  // While it is made, a pair more to fill where the page has room for one.
  const more = props.edit && steps.length % 2 === 0 && steps.length < MAX_STEPS;
  const pairs = more ? [...pairsOf(steps), []] : pairsOf(steps);
  const { cols, rows } = pairLayout(pairs.length, aspect * 1.12);
  if (steps.length === 0 && !props.edit) return <NoSteps />;
  return (
    <div className="pl-pairs" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
      {pairs.map((pair) => (
        <div key={pair[0]?.id ?? "more"} className={`pl-pair${pair.length > 0 && pair.every((step) => states[steps.indexOf(step)] === "done") ? " done" : ""}`}>
          {[0, 1].map((i) => (
            <div key={i} className="pl-pair-slot" role="group" aria-label={t(i === 0 ? FIRST : THEN)}>
              <div className="pl-slot">
                {pair[i] ? (
                  <StepCard
                    day={day}
                    step={pair[i]}
                    state={states[steps.indexOf(pair[i])]}
                    look={look}
                    fresh={fresh}
                    got={starsGot(props.ticks, props.linked, day, pair[i])}
                  />
                ) : props.edit && (i === 0 || pair.length === 1) ? (
                  <AddCard />
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
  const { plan, today, day, look, fresh, edit } = props;
  const t = useT();
  const names = t(DAY_NAMES);
  const week = weekOf(day);
  const most = Math.max(1, ...week.map((d) => stepsOn(plan, d).length + (edit ? 1 : 0)));
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
              <StepCard
                key={step.id}
                day={d}
                step={step}
                state={states[i]}
                look={look}
                fresh={fresh}
                got={starsGot(props.ticks, props.linked, d, step)}
                small
              />
            ))}
            {edit && steps.length < MAX_STEPS && <AddCard day={dayKey(d)} small />}
          </div>
        );
      })}
    </div>
  );
}
