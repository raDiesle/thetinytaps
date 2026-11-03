import type { CSSProperties } from "react";
import { dayKey, weekOf } from "@/games/teeth/daytime";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { tapState } from "@/lib/tapTargets";
import { AUTO_TITLES, cellKey, isTemplateTitle, type LinkedDays, weekday } from "./board";
import { useRewardLabel } from "./BoardSheet";
import { DAY_NAMES, MARK_BY_ID, MARKS, PLAN_TEMPLATES, SLOT_BY_ID, type Slot, STEP_BY_ID, THEME_BY_ID, THEMES } from "./catalog";
import { ItemPic, MarkPic, SheetStrip } from "./pictures";
import { RewardActions, SheetAction } from "./SheetAction";
import {
  bigDayStep,
  counting,
  MAX_PART_STEPS,
  MAX_STARS,
  MAX_STEPS,
  moonsLeft,
  nightsUntil,
  nowSteps,
  pairsOf,
  partsOf,
  type Plan,
  type PlanStep,
  planProgress,
  sameCards,
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

/** „Noch 3-mal schlafen, dann Geburtstag“: a Countdown's moons and its big day, said to the child (H-41). */
export const SLEEPS_UNTIL: Localized<(nights: number, what: string) => string> = {
  de: (n, what) => `${SLEEPS_LEFT.de(n)}, dann ${what}`,
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
    return t(AUTO_TITLES[plan.view === "week" ? "planWeek" : plan.view === "countdown" ? "planCountdown" : "day"])(plan.childName.trim());
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

/** Width / height of a card with star fields: taller than wide, the picture on top and the big fields below it. */
const STAR_CARD = 0.8;

/**
 * A plan as one picture, the same on screen, on paper and while it is made or changed: the heading (no date – the
 * switch above says the day), and the cards in the plan's view: Jetzt – Dann (every step in its order, the day's parts
 * in rows of their own, a marker on the one to do – or that one apart and big in a „Jetzt“ field), Erst – Dann (pairs,
 * up to four on a page) or the week in seven columns with moons for the nights until each day. Where the cards count
 * stars (a Zähler above 0, `counting`), each card has its row of star fields and the arrow is left out – the stars show
 * what is done –, and the reward stands at the sheet's end with how many stars are there. With `edit` (the wizard and
 * „Gestalten“) the same sheet shows where to add a card (＋), ⚙️ and 🗑️ on each card, the reward and a part's sign, − ＋
 * at a card's stars, or where to set a reward, and its cards and reward are taps of `ChartEditor`. Pure markup – PlanScreen and ChartEditor add the taps through
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
  const sub =
    look.print && plan.view !== "week" && plan.view !== "countdown" && !plan.same ? new Intl.DateTimeFormat(speechLang, { weekday: "long" }).format(day) : "";
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
        {plan.view === "countdown" ? (
          <Countdown {...props} aspect={aspect} />
        ) : plan.view === "week" ? (
          <WeekColumns {...props} />
        ) : plan.view === "first-then" ? (
          <FirstThen {...props} aspect={aspect} />
        ) : (
          <DaySteps {...props} aspect={aspect} />
        )}
        {props.counts && plan.view !== "countdown" && (plan.reward || editing) && <PlanGoal {...props} />}
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
 * One step as a card: its picture, and a tick once done – its number in the day only where grown-ups chose it
 * (`Plan.numbers`, user feedback, November 2026). No word on it – the child doesn't read (user feedback, November
 * 2026); the word is only its name for a mouse's tooltip and read out. While it is made it has ⚙️ and 🗑️ in its top
 * corners and − ＋ beside its stars.
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
  counts = false,
  edit = false,
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
  /** The plan counts stars: the card keeps the room for them, also with none of its own. */
  counts?: boolean;
  /** Being made or changed: ⚙️ and 🗑️ on it, and its own number of stars set right at them (`StarStep`). */
  edit?: boolean;
}) {
  const t = useT();
  const label = useStepLabel()(step);
  const key = cellKey(day, step.id);
  const stars = starsOf(step);
  return (
    <div
      className={`pl-card ${state}${small ? " small" : ""}${stars || counts ? " has-stars" : ""}${fresh === key ? " fresh" : ""}`}
      data-step={look.print ? undefined : key}
      data-state={look.print ? undefined : state}
      data-tap={look.print ? undefined : tapState({ goal: state === "now", done: state === "done" })}
      role="img"
      aria-label={label}
      title={look.print ? undefined : label}
    >
      {number !== undefined && <span className="pl-number">{number}</span>}
      {edit && <CardActions cell={key} label={label} />}
      <span className="pl-emoji" aria-hidden>
        <ItemPic item={step} lines={look.print && !look.color} />
      </span>
      {(stars > 0 || counts) && <StarFields stars={stars} got={look.print ? 0 : got} edit={edit ? { cell: key } : undefined} />}
      {/* A plain plan's card: its first star turns the plan into one that counts. */}
      {edit && !counts && (
        <span className="pl-star-add" data-edit="stars" data-cell={key} data-by={1} role="button" tabIndex={0} title={t(MORE_STARS)} aria-label={t(MORE_STARS)}>
          ＋⭐
        </span>
      )}
      {state === "done" && !stars && (
        <span className="pl-tick" aria-hidden>
          ✓
        </span>
      )}
    </div>
  );
}

/** The star a plan's fields get: the Belohnungstafel's own sticker, so both kinds of chart fill alike. */
const STAR = MARK_BY_ID.get("stern") ?? MARKS[0];

/** − and ＋ at a card's stars. */
const FEWER_STARS: Localized = { de: "Ein Stern weniger" };
const MORE_STARS: Localized = { de: "Ein Stern mehr" };

/**
 * A card's star fields along its foot, one per star of its Zähler: big dashed rings like the Belohnungstafel's fields
 * (user feedback, November 2026: the small dots of the generalised plan looked poorer than the board of before), filled
 * with its star sticker as the child taps, the newest popping in. On paper empty rings, for a sticker or a crayon.
 * While it is made (`edit`) − and ＋ stand at the row's ends – no number: the rings show how many (user feedback,
 * November 2026) –, and under the mouse ＋ shows the ring it would add (`ghost`) and − marks the one it would take.
 */
function StarFields({ stars, got, edit, ghost = !!edit }: { stars: number; got: number; edit?: { cell: string; every?: boolean }; ghost?: boolean }) {
  return (
    <span className={`pl-stars${edit ? " pl-stars-edit" : ""}`} aria-hidden={!edit}>
      {edit && <StarStep {...edit} by={-1} off={stars <= 0} />}
      {Array.from({ length: stars }, (_, i) => (
        <span key={i} className={`pl-star rw-field${i < got ? " filled" : ""}${i === got - 1 ? " last" : ""}${i === stars - 1 ? " pl-star-end" : ""}`}>
          <span className="rw-ring">
            {i < got && (
              <span className="rw-mark">
                <MarkPic mark={STAR} />
              </span>
            )}
          </span>
        </span>
      ))}
      {ghost && stars < MAX_STARS && (
        <span className="pl-star rw-field pl-star-ghost">
          <span className="rw-ring" />
        </span>
      )}
      {edit && <StarStep {...edit} by={1} off={stars >= MAX_STARS} />}
    </span>
  );
}

/**
 * While a chart is made: − or ＋ at a card's stars, its own number of them (user feedback, November 2026: every single
 * task its own count, right where its stars are). `ChartEditor` does the change by `data-edit="stars"`; one that can do
 * nothing keeps its place unseen, so the other doesn't jump.
 */
function StarStep({ cell, by, off, every = false }: { cell: string; by: 1 | -1; off: boolean; every?: boolean }) {
  const t = useT();
  const label = t(by > 0 ? MORE_STARS : FEWER_STARS);
  return (
    <span
      className={`pl-star-step ${by > 0 ? "more" : "less"}${off ? " off" : ""}`}
      data-edit={off ? undefined : "stars"}
      data-cell={cell}
      data-by={by}
      data-every={every ? "" : undefined}
      role="button"
      tabIndex={off ? -1 : 0}
      aria-label={label}
      aria-hidden={off}
      title={label}
    >
      {by > 0 ? "＋" : "−"}
    </span>
  );
}

/** ⚙️ and 🗑️ in the top corners of a card while it is made – with `every` the week grid's row, every day's card alike. */
function CardActions({ cell, label, every = false }: { cell: string; label: string; every?: boolean }) {
  const t = useT();
  const where = { "data-cell": cell, "data-every": every ? "" : undefined };
  return (
    <>
      <SheetAction act="configure" ask={t({ de: "„{name}“ ändern" }).replace("{name}", label)} data={{ "data-edit": "card", ...where }} />
      <SheetAction act="delete" ask={t(DELETE_ASK).replace("{name}", label)} data={{ "data-edit": "delete-card", ...where }} />
    </>
  );
}

/** The question beside a 🗑️ under the mouse, with the name of what it takes. */
const DELETE_ASK: Localized = { de: "„{name}“ löschen?" };

/**
 * The reward at the end of a plan that counts stars: its picture and its name – no count of stars under it (user
 * feedback, November 2026: on paper it is in the way, and the fields show the stars anyway). While the plan is made it
 * is a tap to change it, with ⚙️ and 🗑️ in its corners, and where it has none a dashed „＋ Belohnung“ to add one –
 * without it the stars stay, only the picture goes.
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
      {edit && <RewardActions />}
      <span className="pl-goal-pic" aria-hidden>
        <ItemPic item={reward} kind="reward" lines={look.print && !look.color} />
      </span>
      <span className="pl-goal-label">{label}</span>
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

/**
 * A part's sign before its row: ☀️ for the morning, 🌙 for the evening – a picture, not a word („Morgens“ only read out),
 * big, as it stands for the whole row. While the plan is made a 🗑️ sits above it: with another part beside it, it takes
 * the whole line away (`remove="row"`); on the last part only the sign, so the day becomes one line (`"sign"`, user
 * feedback, November 2026). Under the mouse it asks („„Abends“ löschen?“) and marks red what would go.
 */
function PartName({ part, remove }: { part: Slot; remove?: "row" | "sign" }) {
  const t = useT();
  const slot = SLOT_BY_ID.get(part);
  if (!slot) return null;
  return (
    <span className="pl-part">
      {remove && (
        <SheetAction
          act="delete"
          side="left"
          ask={remove === "row" ? t(DELETE_ASK).replace("{name}", t(slot.label)) : t({ de: "Zeichen löschen?" })}
          data={{ "data-edit": remove, "data-part": part }}
        />
      )}
      <span className="pl-part-sign" role="img" aria-label={t(slot.label)} title={t(slot.label)}>
        {slot.emoji}
      </span>
    </span>
  );
}

/** While a day in one line is made: ☀️ and 🌙, pale, to give the line a sign again – its cards become the morning's or the evening's. */
function SignBack() {
  const t = useT();
  return (
    <span className="pl-part pl-sign-back">
      {(["morning", "evening"] as Slot[]).map((id) => {
        const slot = SLOT_BY_ID.get(id);
        if (!slot) return null;
        const label = t({ de: "„{name}“ davor" }).replace("{name}", t(slot.label));
        return (
          <span key={id} className="pl-sign-add" data-edit="sign-back" data-part={id} role="button" tabIndex={0} aria-label={label} title={label}>
            {slot.emoji}
          </span>
        );
      })}
    </span>
  );
}

/**
 * While a plan is made: where a card is added – at the end of a part's line, of a day's column in the week, or (`every`)
 * to every day of a week's grid.
 */
function AddCard({ part, day, small = false, every = false }: { part?: Slot; day?: string; small?: boolean; every?: boolean }) {
  const t = useT();
  return (
    <span
      className={`pl-add${small ? " small" : ""}`}
      data-edit="add"
      data-part={part}
      data-day={day}
      data-every={every ? "" : undefined}
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
      number={plan.numbers ? steps.indexOf(step) + 1 : undefined}
      look={look}
      fresh={fresh}
      got={starsGot(ticks, linked, day, step)}
      counts={counts}
      edit={edit}
    />
  );
  // Cards with star fields stand taller than wide, so the fields under the picture are big (`STAR_CARD`).
  const cardAspect = counts ? STAR_CARD : 1;
  // While it is made, a line can take another card where there is room for it.
  const roomIn = (row: PlanStep[], part?: Slot) => edit && row.length < (part ? MAX_PART_STEPS : MAX_STEPS);
  return (
    <div className={`pl-dayview${field ? "" : " pl-marked"}${counts ? " pl-counts" : ""}`}>
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
                const { cols, rows } = planLayout(row.length + (adding ? 1 : 0), (aspect * (box ? 1.5 : 1.12) * width) / cardAspect);
                return (
                  <div key={`${part}-${i}`} className={`pl-row${(part && (named || edit)) || edit ? " pl-row-named" : ""}`}>
                    {part && (named || edit) && <PartName part={part} remove={edit ? (named ? "row" : "sign") : undefined} />}
                    {!part && edit && <SignBack />}
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
                    counts={props.counts}
                    edit={props.edit}
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

/**
 * A day's head in the week: its name (or „Heute“), and on screen moons for the nights until it. A tap says them
 * (`data-day`, PlanScreen).
 */
function DayHead({ d, today, look }: { d: Date; today: Date; look: PlanLook }) {
  const t = useT();
  const nights = look.print ? 0 : nightsUntil(today, d);
  const isToday = !look.print && nights === 0;
  return (
    <span className={`pl-day${isToday ? " today" : ""}`} data-day={look.print ? undefined : dayKey(d)} data-tap={look.print ? undefined : ""}>
      <span className="pl-day-name">{isToday ? t(TODAY) : t(DAY_NAMES)[weekday(d)]}</span>
      {nights > 0 && nights <= MAX_MOONS && (
        <span className="pl-moons" role="img" aria-label={t(SLEEPS_LEFT)(nights)}>
          {"🌙".repeat(nights)}
        </span>
      )}
    </span>
  );
}

/**
 * A week of stars: the same cards every day (`sameCards`) with a Zähler, drawn as a reward chart always was – a row per
 * card with its picture at the start, a column per day, big star fields in each cell, today's column marked (user
 * feedback, November 2026: the week's columns of small cards looked poorer than the board of before). A cell is tapped
 * like a card (`data-step`). While it is made a row's picture (or its ⚙️) opens the card for every day, − ＋ under it set
 * its stars, marked in the row's fields under the mouse, and 🗑️ takes the row out of the whole week; ＋ below adds a
 * card to every day.
 */
function WeekStars(props: StepsProps) {
  const { plan, today, day, look, fresh, edit, ticks, linked } = props;
  const label = useStepLabel();
  const week = weekOf(day);
  const steps = stepsOn(plan, day);
  const isToday = (d: Date) => !look.print && dayKey(d) === dayKey(today);
  // A row is never much taller than a day's column is wide, so a week of one card keeps round fields in the middle.
  const rowMax = 100 / (1.5 + week.length);
  const rows = `auto repeat(${steps.length}, minmax(0, ${rowMax.toFixed(1)}cqw))${edit ? ` minmax(0, ${(rowMax * 0.55).toFixed(1)}cqw)` : ""}`;
  return (
    <div className="pl-wgrid" style={{ gridTemplateRows: rows }}>
      <span />
      {week.map((d) => (
        <span key={dayKey(d)} className={`pl-wday${isToday(d) ? " today" : ""}`}>
          <DayHead d={d} today={today} look={look} />
        </span>
      ))}
      {steps.map((step) => (
        // A row as one element for its 🗑️ and − ＋ to mark it whole, its cells still the grid's (display: contents).
        <div key={step.id} className="pl-wrow">
          <div
            className="pl-whead"
            data-step={edit ? cellKey(day, step.id) : undefined}
            data-every={edit ? "" : undefined}
            data-row={step.id}
            role="img"
            aria-label={label(step)}
            title={look.print ? undefined : label(step)}
          >
            {edit && <CardActions cell={cellKey(day, step.id)} label={label(step)} every />}
            <span className="pl-emoji" aria-hidden>
              <ItemPic item={step} lines={look.print && !look.color} />
            </span>
            {edit && (
              <span className="pl-whead-steps">
                <StarStep cell={cellKey(day, step.id)} by={-1} off={starsOf(step) <= 0} every />
                <StarStep cell={cellKey(day, step.id)} by={1} off={starsOf(step) >= MAX_STARS} every />
              </span>
            )}
          </div>
          {week.map((d) => {
            const own = stepsOn(plan, d).find((s) => s.id === step.id) ?? step;
            const key = cellKey(d, own.id);
            const [state] = statesOf(props, d, [own]);
            return (
              <div
                key={key}
                className={`pl-wcell ${state}${isToday(d) ? " today" : ""}${fresh === key ? " fresh" : ""}`}
                data-step={look.print ? undefined : key}
                data-state={look.print ? undefined : state}
                data-row={step.id}
                data-tap={look.print ? undefined : tapState({ goal: state === "now", done: state === "done" })}
              >
                <StarFields stars={starsOf(own)} got={look.print ? 0 : starsGot(ticks, linked, d, own)} ghost={edit} />
              </div>
            );
          })}
        </div>
      ))}
      {edit && steps.length < MAX_STEPS && (
        <span className="pl-wadd">
          <AddCard every />
        </span>
      )}
    </div>
  );
}

/** The week: a reward chart's grid where every day has the same cards and they count stars, else a column per day. */
function WeekColumns(props: StepsProps) {
  return props.counts && sameCards(props.plan) && stepsOn(props.plan, props.day).length > 0 ? <WeekStars {...props} /> : <DayColumns {...props} />;
}

/** A column per day with its steps; today's marked, and moons over the days to come – one per night until then. */
function DayColumns(props: StepsProps) {
  const { today, day, look, fresh, edit, plan } = props;
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
                counts={props.counts}
                edit={edit}
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

/**
 * A moon for a night still to sleep, drawn as a crescent with a sleepy face: yellow on screen and in colour, white on a
 * grey print, so the child can colour one in (or cross it out) every morning.
 */
function MoonPic() {
  return (
    <svg className="pl-moon-pic" viewBox="0 0 100 100" aria-hidden>
      <path d="M70 15.4 A40 40 0 1 0 70 84.6 A36 36 0 0 1 70 15.4 Z" />
      <path className="pl-moon-face" d="M21 47 q5 5 10 0 M27 62 q6 4 12 -1" />
    </svg>
  );
}

/** Where a tap opens the big day's window while the plan is made: its picture and its date (`data-edit="big-day"`). */
const BIG_DAY_EDIT = { "data-edit": "big-day", role: "button", tabIndex: 0 } as const;

/** What the window of the big day is called, also the tooltip of the places that open it. */
export const BIG_DAY: Localized = { de: "Der große Tag" };

/**
 * The Countdown (H-41): „Wie oft noch schlafen?“ – a moon for every night until the big day, in rows read from the top
 * left, then an arrow to the day's picture (Geburtstag, Urlaub, Oma kommt). Each morning one moon fewer; on the day
 * itself the picture alone stands big in the middle. No date and no number: the child counts moons. On paper the moons
 * of the day it is printed, to colour in or cross out one each morning. While it is made, a tap on the moons or the
 * picture opens the big day's window (its date and its picture).
 */
function Countdown({ plan, day, look, edit, aspect }: StepsProps & { aspect: number }) {
  const t = useT();
  const label = useStepLabel();
  const step = bigDayStep(plan);
  const moons = moonsLeft(plan, day);
  // Upright, the picture goes under the moons; wide, beside them – the moons get the room the picture leaves.
  const tall = aspect < 1.25;
  const { cols, rows } = planLayout(moons, tall ? aspect / 0.55 : Math.max(0.4, aspect - 0.95));
  const sleeps = t(SLEEPS_LEFT)(moons);
  return (
    <div className={`pl-countdown${tall ? " tall" : ""}${moons === 0 ? " arrived" : ""}`}>
      {moons > 0 && (
        <>
          <div
            className="pl-moons-field"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
            role="img"
            aria-label={sleeps}
            title={look.print ? undefined : edit ? t(BIG_DAY) : sleeps}
            {...(edit ? BIG_DAY_EDIT : {})}
          >
            {Array.from({ length: moons }, (_, i) => (
              <span key={i} className="pl-moon" data-moon={look.print || edit ? undefined : i} data-tap={look.print || edit ? undefined : ""}>
                <MoonPic />
              </span>
            ))}
          </div>
          <span className="pl-cd-arrow" aria-hidden>
            ➜
          </span>
        </>
      )}
      {step ? (
        <div
          className="pl-card pl-big-day"
          data-big-day={look.print || edit ? undefined : ""}
          data-tap={look.print || edit ? undefined : "goal"}
          role="img"
          aria-label={label(step)}
          title={look.print ? undefined : label(step)}
          {...(edit ? BIG_DAY_EDIT : {})}
        >
          {edit && <SheetAction act="configure" ask={t(BIG_DAY)} data={{ "data-edit": "big-day" }} />}
          <span className="pl-emoji" aria-hidden>
            <ItemPic item={step} lines={look.print && !look.color} />
          </span>
        </div>
      ) : edit ? (
        <span className="pl-big-day pl-add" {...BIG_DAY_EDIT} aria-label={t(BIG_DAY)} title={t(BIG_DAY)}>
          ＋
        </span>
      ) : (
        <NoSteps />
      )}
    </div>
  );
}
