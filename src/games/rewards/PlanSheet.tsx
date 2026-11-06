import type { CSSProperties } from "react";
import { dayKey, weekOf } from "@/games/teeth/daytime";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { useFigure } from "@/lib/common";
import { tapState } from "@/lib/tapTargets";
import { AUTO_TITLES, cellKey, isTemplateTitle, type LinkedDays, weekday } from "./board";
import { useRewardLabel } from "./BoardSheet";
import { DAY_NAMES, MARK_BY_ID, MARKS, type NightLook, nightLookOf, PLAN_TEMPLATES, SLOT_BY_ID, type Slot, STEP_BY_ID, THEME_BY_ID, THEMES } from "./catalog";
import { DaySign, type DaySignSet, PARTS_OF, SLOT_EMOJI } from "./daySigns";
import { ItemPic, MarkPic, NightPic, SheetStrip } from "./pictures";
import { SheetTitle, titleMarkOf } from "./SheetTitle";
import { RewardActions, SheetAction } from "./SheetAction";
import {
  bigDayCome,
  bigDayStep,
  counting,
  dayPartsOf,
  MAX_STARS,
  MAX_NIGHTS,
  MAX_STEPS,
  type Night,
  nightsOf,
  nightsUntil,
  nowSteps,
  pairsOf,
  partIn,
  type Plan,
  type PlanStep,
  planProgress,
  canMoveRow,
  weekRows,
  splitDone,
  starsGot,
  starsOf,
  stepDone,
  stepLimit,
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
  en: (n, what) => `${(SLEEPS_LEFT.en ?? SLEEPS_LEFT.de)(n)}, then ${what}`,
  zh: (n, what) => `${(SLEEPS_LEFT.zh ?? SLEEPS_LEFT.de)(n)}，然后就是${what}`,
  hi: (n, what) => `${(SLEEPS_LEFT.hi ?? SLEEPS_LEFT.de)(n)}, फिर ${what}`,
  es: (n, what) => `${(SLEEPS_LEFT.es ?? SLEEPS_LEFT.de)(n)} y luego llega: ${what}`,
  ar: (n, what) => `${(SLEEPS_LEFT.ar ?? SLEEPS_LEFT.de)(n)}، ثم ${what}`,
  ru: (n, what) => `${(SLEEPS_LEFT.ru ?? SLEEPS_LEFT.de)(n)}, а потом – ${what}`,
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
 *
 * The cards always take the best layout for how many there are (user feedback, November 2026: no empty place kept for a
 * ＋ card): a new card is put in with the ＋ at a card's edge, and only then the cards are laid out anew, as big as they
 * can be again.
 */
export function planLayout(count: number, aspect: number, gain = ROW_GAIN): { cols: number; rows: number } {
  let best = { cols: Math.max(1, count), rows: 1, size: 0 };
  for (let rows = 1; rows <= Math.max(1, count); rows++) {
    const cols = Math.ceil(count / rows);
    const size = cardSize({ cols, rows }, aspect);
    if (size > best.size * gain + 1e-9) best = { cols, rows, size };
  }
  return { cols: best.cols, rows: best.rows };
}

/** Width of a card in a grid of `cols` × `rows` when the box is 1 high. */
function cardSize({ cols, rows }: { cols: number; rows: number }, aspect: number): number {
  return Math.min(aspect / cols, 1 / rows);
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
  onTitle,
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
  /** While it is made: the heading is typed right where it stands (the child's name makes it where it is empty). */
  onTitle?: (title: string) => void;
}) {
  const { speechLang } = useAppLanguage();
  const planTitle = usePlanTitle();
  const title = planTitle(plan);
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
        <SheetTitle
          title={title}
          own={!!plan.title.trim()}
          auto={planTitle({ ...plan, title: "" })}
          mark={titleMarkOf(plan.titleMark, undefined)}
          editing={editing}
          onTitle={onTitle}
        />
        {sub && <span className="rw-blank">{sub}</span>}
        {/* No reward by default, and none takes room on the sheet (user feedback, November 2026): while it is made a
            small „＋ Belohnung“ in the heading's corner adds one. */}
        {editing && props.counts && plan.view !== "countdown" && !plan.reward && <AddReward />}
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
        {props.counts && plan.view !== "countdown" && plan.reward && <PlanGoal {...props} />}
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
  insert,
  every = false,
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
  /** While it is made: the ＋ at its edges that put a new card before it (and, `last`, after it), across a line or down a column. */
  insert?: { axis: "row" | "column"; last: boolean };
  /** The ＋ at its edges put the new card into every day (a week alike every day). */
  every?: boolean;
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
      {edit && insert && <InsertCard cell={key} axis={insert.axis} last={insert.last} every={every} />}
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
const FEWER_STARS: Localized = {
  de: "Ein Stern weniger",
  en: "One star fewer",
  zh: "少一颗星",
  hi: "एक सितारा कम",
  es: "Una estrella menos",
  ar: "نجمة أقل",
  ru: "На звезду меньше",
};
const MORE_STARS: Localized = {
  de: "Ein Stern mehr",
  en: "One star more",
  zh: "多一颗星",
  hi: "एक सितारा ज़्यादा",
  es: "Una estrella más",
  ar: "نجمة أكثر",
  ru: "На звезду больше",
};

/**
 * A card's star fields along its foot, one per star of its Zähler: big dashed rings like the Belohnungstafel's fields
 * (user feedback, November 2026: the small dots of the generalised plan looked poorer than the board of before), filled
 * with its star sticker as the child taps, the newest popping in. On paper empty rings, for a sticker or a crayon.
 * While it is made (`edit`) − and ＋ stand at the row's ends – no number: the rings show how many (user feedback,
 * November 2026) –, and under the mouse ＋ shows the ring it would add (`ghost`) and − marks the one it would take. The
 * ghost keeps its place unseen while the mouse is elsewhere, so neither − nor ＋ nor a ring moves when it shows (user
 * feedback, November 2026).
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
      <SheetAction
        act="configure"
        ask={t({
          de: "„{name}“ ändern",
          en: "Change “{name}”",
          zh: "修改“{name}”",
          hi: "“{name}” बदलें",
          es: "Cambiar «{name}»",
          ar: "تغيير «{name}»",
          ru: "Изменить «{name}»",
        }).replace("{name}", label)}
        data={{ "data-edit": "card", ...where }}
      />
      <SheetAction act="delete" ask={t(DELETE_ASK).replace("{name}", label)} data={{ "data-edit": "delete-card", ...where }} />
    </>
  );
}

/** The question beside a 🗑️ under the mouse, with the name of what it takes. */
const DELETE_ASK: Localized = {
  de: "„{name}“ löschen?",
  en: "Delete “{name}”?",
  zh: "删除“{name}”？",
  hi: "“{name}” मिटाएँ?",
  es: "¿Borrar «{name}»?",
  ar: "حذف «{name}»؟",
  ru: "Удалить «{name}»?",
};

/**
 * The reward at the end of a plan that counts stars: its picture and its name – no count of stars under it (user
 * feedback, November 2026: on paper it is in the way, and the fields show the stars anyway). While the plan is made it
 * is a tap to change it, with ⚙️ and 🗑️ in its corners, and where it has none a dashed „＋ Belohnung“ to add one –
 * without it the stars stay, only the picture goes.
 */
function PlanGoal({ plan, ticks, linked, day, look, edit }: StepsProps) {
  const rewardLabel = useRewardLabel();
  const { count, goal } = planProgress(plan, ticks, linked, day);
  const reward = plan.reward;
  if (!reward) return null;
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
 * A part's sign before its line: the set chosen in the band (`Plan.signs`: a drawn sky, the child's pictures, sun and
 * moon …), big, as it stands for the whole line; its name only read out. Without a set the line has no sign, only its
 * tint. The parts themselves are chosen in the band („Tageszeiten“), never taken away here (user feedback, November 2026).
 */
function PartName({ part, set, lines }: { part: Slot; set: DaySignSet; lines: boolean }) {
  const t = useT();
  const slot = SLOT_BY_ID.get(part);
  if (!slot) return null;
  return (
    <span className="pl-part">
      <span className="pl-part-sign" role="img" aria-label={t(slot.label)} title={t(slot.label)}>
        <DaySign set={set} part={part} lines={lines} />
      </span>
    </span>
  );
}

/** „Karte dazu“: the ＋ of a place to add a card, also what it reads out. */
const ADD_CARD: Localized = {
  de: "Karte dazu",
  en: "Add a card",
  zh: "添加卡片",
  hi: "कार्ड जोड़ें",
  es: "Añadir tarjeta",
  ar: "إضافة بطاقة",
  ru: "Добавить карточку",
};

/**
 * While a plan is made, where nothing stands yet: the one place to add a card to an empty day, an empty part of the
 * day or an empty column of the week. Beside cards a new one comes with the ＋ at their edges (`InsertCard`), so no
 * empty place is kept for it (user feedback, November 2026).
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
      aria-label={t(ADD_CARD)}
      title={t(ADD_CARD)}
    >
      ＋
    </span>
  );
}

/**
 * While a plan is made: a small round ＋ on a card's edge – before it, and on the last card after it too – that puts a
 * new card right there (user feedback, November 2026: WYSIWYG, left or right of any card). Under the mouse a bar shows
 * where the card goes. `axis` says whether the cards run across (a line) or down (a week's column).
 */
function InsertCard({ cell, axis, last, every }: { cell: string; axis: "row" | "column"; last: boolean; every: boolean }) {
  const t = useT();
  const sides: ("before" | "after")[] = last ? ["before", "after"] : ["before"];
  const names: Record<"before" | "after", Localized> = {
    before: axis === "row" ? { de: "Karte links davor einfügen" } : { de: "Karte darüber einfügen" },
    after: axis === "row" ? { de: "Karte rechts dahinter einfügen" } : { de: "Karte darunter einfügen" },
  };
  return (
    <>
      {sides.map((side) => (
        <span
          key={side}
          className={`pl-insert pl-insert-${axis} ${side}`}
          data-edit="insert"
          data-cell={cell}
          data-side={side}
          data-every={every ? "" : undefined}
          role="button"
          tabIndex={0}
          aria-label={t(names[side])}
          title={t(names[side])}
        >
          ＋
        </span>
      ))}
    </>
  );
}

/** While a plan that counts is made and has no reward: a small „＋ 🎁 Belohnung“ in the heading's corner, taking no room of the sheet. */
function AddReward() {
  const t = useT();
  return (
    <span className="pl-reward-add" data-edit="reward" role="button" tabIndex={0}>
      ＋ <span aria-hidden>🎁</span> {t({ de: "Belohnung", en: "Reward", zh: "奖励", hi: "इनाम", es: "Premio", ar: "المكافأة", ru: "Награда" })}
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
  // The day's parts as chosen in the band (`Plan.dayParts`): a line each, also while one is still empty – a part whose
  // cards are all done stays out on screen, unless the plan is being made.
  const n = dayPartsOf(plan);
  const lines = PARTS_OF[n]
    .map((part) => ({ part, steps: rest.filter((step) => partIn(step, n) === part) }))
    .filter((line) => line.steps.length > 0 || (edit && steps.length > 0));
  const named = n > 1;
  const signs = named ? plan.signs : undefined;
  const box = field ? dayBox(props, steps, done, open) : null;
  // The room for the rows: the sheet less its heading and the box, less the „Jetzt“ column, the reward and the signs; each part a row of it.
  const width = (lead ? 0.62 : 1) * (counts && plan.reward ? 0.82 : 1) * (signs ? 0.9 : 1);
  const card = (step: PlanStep, line: PlanStep[]) => (
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
      insert={edit && steps.length < stepLimit(steps) ? { axis: "row", last: step === line.at(-1) } : undefined}
    />
  );
  // Cards with star fields stand taller than wide, so the fields under the picture are big (`STAR_CARD`).
  const cardAspect = counts ? STAR_CARD : 1;
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
      {open.length > 0 || (edit && steps.length > 0) ? (
        <div className={`pl-flow${lead ? " has-now" : ""}`}>
          {lead && (
            <div className="pl-now">
              <NowSign />
              <div className="pl-slot">{card(lead, [lead])}</div>
            </div>
          )}
          {lines.length > 0 && (
            <div className="pl-then">
              {lines.map(({ part, steps: row }) => {
                // Several parts (morning, evening): each a line of cards as tall as its row, from the left, on its own tint.
                const { cols, rows } = planLayout(Math.max(1, row.length), (aspect * (box ? 1.5 : 1.12) * width) / cardAspect);
                return (
                  <div
                    key={part ?? "day"}
                    className={`pl-row${signs ? " pl-row-named" : ""}${named ? ` pl-row-part rw-tint-${part === "noon" ? "day" : part}` : ""}`}
                  >
                    {part && signs && <PartName part={part} set={signs} lines={look.print && !look.color} />}
                    <ol
                      className={`pl-steps${lines.length > 1 ? " pl-line" : ""}`}
                      style={
                        lines.length > 1
                          ? undefined
                          : { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }
                      }
                    >
                      {row.map((step) => (
                        <li key={step.id} className="pl-slot">
                          {/* The marker the child moves on, under the card to do (never printed: on paper it is a real
                              one) – only where the cards count no stars, which show what is done by themselves. */}
                          {!field && !counts && !edit && !look.print && states[steps.indexOf(step)] === "now" && <PaperArrow className="pl-marker" />}
                          {card(step, row)}
                        </li>
                      ))}
                      {/* An empty part of the day: the one place to put its first card. */}
                      {row.length === 0 && (
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
      ) : null}
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
  // No empty pair kept for the next card (user feedback, November 2026): the ＋ at a card's edge puts one anywhere, and
  // only a pair still waiting for its „Dann“ shows the place for it; an empty plan has one to start with.
  const pairs = props.edit && steps.length === 0 ? [[]] : pairsOf(steps);
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
                    insert={props.edit && steps.length < MAX_STEPS ? { axis: "row", last: pair[i] === steps.at(-1) } : undefined}
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

/** The part of the day a card stands in, as a row's tint: morning, the day (midday or none), evening. */
const partClass = (part: Slot | undefined) => (part === "morning" ? "morning" : part === "evening" ? "evening" : "day");

/** − or ＋ drawn as a ring with its sign in it, so it plainly adds or takes a circle (user feedback, November 2026). */
function RingStep({ by, data, off = false, label }: { by: 1 | -1; data: Record<`data-${string}`, string | undefined>; off?: boolean; label: string }) {
  return (
    <span
      className={`pl-ring-step ${by > 0 ? "more" : "less"}${off ? " off" : ""}`}
      {...(off ? {} : data)}
      data-by={by}
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

/**
 * One day's cell of a week's row: its circles, as many as that day's card has, laid out to be as big as the cell allows
 * (two rows where that makes them bigger). While it is made a pale ring with ＋ adds one for this day only and − takes
 * one (user feedback, November 2026: a single day's count changed right there); a day without the card shows only that
 * ＋. With `picture` the card's picture stands over the circles (`Plan.weekLook`).
 */
function WeekCell({ plan, d, row, props, picture }: { plan: Plan; d: Date; row: PlanStep; props: StepsProps; picture: boolean }) {
  const { today, look, fresh, edit, ticks, linked } = props;
  const t = useT();
  const label = useStepLabel()(row);
  const own = stepsOn(plan, d).find((s) => s.id === row.id);
  const key = cellKey(d, row.id);
  const [state] = own ? statesOf(props, d, [own]) : ["later" as StepState];
  const stars = own ? starsOf(own) : 0;
  const isToday = !look.print && dayKey(d) === dayKey(today);
  // As big as the cell allows: a cell about as tall as wide stacks two in a column, under a picture (wider) up to three in a row.
  const rings = Math.max(1, stars);
  const cols = picture && rings <= 3 ? rings : Math.ceil(rings / 2);
  const dayName = t(DAY_NAMES)[weekday(d)];
  const tappable = !look.print && !edit && !!own;
  return (
    <div
      className={`pl-wcell ${own ? state : "none"}${isToday ? " today" : ""}${fresh === key ? " fresh" : ""}${picture ? " with-pic" : ""}`}
      data-step={tappable ? key : undefined}
      data-state={tappable ? state : undefined}
      data-row={row.id}
      data-tap={tappable ? tapState({ goal: state === "now", done: state === "done" }) : undefined}
    >
      {picture && own && (
        <span
          className="pl-wpic"
          data-edit={edit ? "swap" : undefined}
          data-cell={edit ? key : undefined}
          title={look.print ? undefined : label}
          aria-hidden={!edit}
        >
          <ItemPic item={own} lines={look.print && !look.color} />
        </span>
      )}
      <span className="pl-stars pl-wstars" style={{ "--pl-cols": cols, "--pl-rows": Math.ceil(rings / cols) } as CSSProperties} aria-hidden>
        {Array.from({ length: stars }, (_, i) => {
          const got = look.print || !own ? 0 : starsGot(ticks, linked, d, own);
          return (
            <span key={i} className={`pl-star rw-field${i < got ? " filled" : ""}${i === got - 1 ? " last" : ""}${i === stars - 1 ? " pl-star-end" : ""}`}>
              <span className="rw-ring">
                {i < got && (
                  <span className="rw-mark">
                    <MarkPic mark={STAR} />
                  </span>
                )}
              </span>
            </span>
          );
        })}
        {edit && stars === 0 && (
          <span
            className="pl-star rw-field pl-cell-add"
            data-edit="cell-stars"
            data-cell={key}
            data-by={1}
            role="button"
            tabIndex={0}
            aria-label={`${dayName}: ${t(MORE_STARS)}`}
            title={`${dayName}: ${t(MORE_STARS)}`}
          >
            <span className="rw-ring">＋</span>
          </span>
        )}
      </span>
      {edit && stars > 0 && (
        <span className="pl-cell-steps">
          <RingStep by={1} off={stars >= MAX_STARS} data={{ "data-edit": "cell-stars", "data-cell": key }} label={`${dayName}: ${t(MORE_STARS)}`} />
          <RingStep by={-1} data={{ "data-edit": "cell-stars", "data-cell": key }} label={`${dayName}: ${t(FEWER_STARS)}`} />
        </span>
      )}
    </div>
  );
}

/**
 * While a week is made, the tools at a row's end (user feedback, November 2026: the circles' − ＋ never inside the
 * card, but beside it and plainly about circles): − ◯ ＋ for one circle less or more on every day, ▲ ▼ to move the row
 * within its part of the day, and – where the band parts the day („Tageszeiten“) – its time of day among those parts,
 * by the chosen signs or sun and moon. In the look with pictures its 🗑️ and the ＋ to put a row before or after it are
 * here too.
 */
function RowTools({ plan, row, key0, withDelete, last }: { plan: Plan; row: PlanStep; key0: string; withDelete: boolean; last: boolean }) {
  const t = useT();
  const label = useStepLabel()(row);
  const most = Math.max(0, ...plan.days.map((day) => day.find((s) => s.id === row.id)).map((s) => (s ? starsOf(s) : 0)));
  const least = Math.min(...plan.days.map((day) => day.find((s) => s.id === row.id)).flatMap((s) => (s ? [starsOf(s)] : [])));
  const n = dayPartsOf(plan);
  const part = partIn(row, n);
  return (
    <div className="pl-wtools" data-row={row.id}>
      {withDelete && (
        <>
          <SheetAction act="delete" ask={t(DELETE_ASK).replace("{name}", label)} data={{ "data-edit": "delete-card", "data-cell": key0, "data-every": "" }} />
          {weekRows(plan).length < MAX_STEPS && <InsertCard cell={key0} axis="column" last={last} every />}
        </>
      )}
      <span className="pl-wtools-line">
        <RingStep
          by={-1}
          off={least <= 1}
          data={{ "data-edit": "row-stars", "data-row": row.id }}
          label={`${label}: ${t(FEWER_STARS)} (${t({ de: "jeden Tag" })})`}
        />
        <RingStep
          by={1}
          off={most >= MAX_STARS}
          data={{ "data-edit": "row-stars", "data-row": row.id }}
          label={`${label}: ${t(MORE_STARS)} (${t({ de: "jeden Tag" })})`}
        />
        <span className="pl-wtools-move">
          {([-1, 1] as const).map((by) => {
            const able = canMoveRow(plan, row.id, by);
            const name = t(by < 0 ? { de: "Nach oben" } : { de: "Nach unten" });
            return (
              <span
                key={by}
                className={`pl-wmove${able ? "" : " off"}`}
                data-edit={able ? "row-move" : undefined}
                data-row={row.id}
                data-by={by}
                role="button"
                tabIndex={able ? 0 : -1}
                aria-hidden={!able}
                aria-label={name}
                title={name}
              >
                {by < 0 ? "▲" : "▼"}
              </span>
            );
          })}
        </span>
      </span>
      {n > 1 && (
        <span className="pl-wtools-line pl-wparts" role="radiogroup" aria-label={t({ de: "Tageszeit" })}>
          {PARTS_OF[n].map((id) => {
            const slot = id && SLOT_BY_ID.get(id);
            if (!slot) return null;
            return (
              <span
                key={slot.id}
                className={`pl-wpart pl-wpart-${slot.id}${slot.id === part ? " on" : ""}`}
                data-edit={slot.id === part ? undefined : "row-part"}
                data-row={row.id}
                data-part={slot.id}
                role="radio"
                aria-checked={slot.id === part}
                tabIndex={0}
                aria-label={t(slot.label)}
                title={t(slot.label)}
              >
                {plan.signs ? <DaySign set={plan.signs} part={slot.id} /> : SLOT_EMOJI[slot.id]}
              </span>
            );
          })}
        </span>
      )}
    </div>
  );
}

/**
 * A week of stars: a plan with a Zähler drawn as a reward chart always was – a row per card (every card of the week once,
 * `weekRows`, in the day's order: the morning's first, then the day's, then the evening's, each part on its own tint),
 * a column per day, big star fields in each cell, today's column marked. Whether one card stands at each row's start or
 * its picture over every day's circles is the grown-up's choice (`Plan.weekLook`), never changed by what the cards are
 * (user feedback, November 2026). A day without a row's card leaves its cell empty. A cell is tapped like a card
 * (`data-step`), only off the editor: there a tap on the circles changes them and opens no window. While it is made a
 * row's picture swaps its card, 🗑️ takes the row out of the whole week, the tools at the row's end (`RowTools`) set its
 * circles, place and time of day, each day's cell its own circles, and the ＋ on a row's top or bottom edge puts a new
 * card into every day right there – no empty row kept for it (user feedback, November 2026).
 */
function WeekStars(props: StepsProps) {
  const { plan, today, day, look, edit } = props;
  const t = useT();
  const label = useStepLabel();
  const week = weekOf(day);
  const rows = weekRows(plan);
  const pictures = plan.weekLook === "pictures";
  const isToday = (d: Date) => !look.print && dayKey(d) === dayKey(today);
  const n = dayPartsOf(plan);
  const tinted = n > 1;
  // The first day that has a row's card names it in the keys of the row's own actions.
  const keyOf = (row: PlanStep) => cellKey(week.find((d) => stepsOn(plan, d).some((s) => s.id === row.id)) ?? day, row.id);
  const head = pictures ? 0 : 1.5;
  const tools = edit ? 1.6 : 0;
  // A row is never much taller than a day's column is wide, so a week of one card keeps round fields in the middle.
  const colWidth = 100 / (head + week.length + tools);
  const rowMax = colWidth * (pictures ? 2.2 : 1.4);
  const columns = `${pictures ? "" : "minmax(0, 1.5fr) "}repeat(7, minmax(0, 1fr))${edit ? " minmax(0, 1.6fr)" : ""}`;
  const template = `auto repeat(${rows.length}, minmax(0, ${rowMax.toFixed(1)}cqw))`;
  return (
    <div className={`pl-wgrid${pictures ? " pl-wgrid-pics" : ""}`} style={{ gridTemplateColumns: columns, gridTemplateRows: template }}>
      {!pictures && <span />}
      {week.map((d) => (
        <span key={dayKey(d)} className={`pl-wday${isToday(d) ? " today" : ""}`}>
          <DayHead d={d} today={today} look={look} />
        </span>
      ))}
      {edit && <span className="pl-wtools-head">{t({ de: "Kreise" })}</span>}
      {rows.map((row, i) => (
        // A row as one element for its 🗑️ to mark it whole, its cells still the grid's (display: contents).
        <div key={row.id} className={`pl-wrow${tinted ? ` pl-tint-${partClass(partIn(row, n))}` : ""}`}>
          {!pictures && (
            <div className="pl-whead" data-row={row.id} role="img" aria-label={label(row)} title={look.print ? undefined : label(row)}>
              {edit && (
                <SheetAction
                  act="delete"
                  ask={t(DELETE_ASK).replace("{name}", label(row))}
                  data={{ "data-edit": "delete-card", "data-cell": keyOf(row), "data-every": "" }}
                />
              )}
              {edit && rows.length < MAX_STEPS && <InsertCard cell={keyOf(row)} axis="column" last={i === rows.length - 1} every />}
              {tinted && plan.signs && (
                <span className="pl-whead-part" aria-hidden>
                  <DaySign set={plan.signs} part={partIn(row, n) ?? "noon"} lines={look.print && !look.color} />
                </span>
              )}
              <span className="pl-emoji" aria-hidden data-edit={edit ? "swap" : undefined} data-cell={edit ? keyOf(row) : undefined}>
                <ItemPic item={row} lines={look.print && !look.color} />
              </span>
            </div>
          )}
          {week.map((d) => (
            <WeekCell key={dayKey(d)} plan={plan} d={d} row={row} props={props} picture={pictures} />
          ))}
          {edit && <RowTools plan={plan} row={row} key0={keyOf(row)} withDelete={pictures} last={i === rows.length - 1} />}
        </div>
      ))}
    </div>
  );
}

/**
 * The week: with a Zähler a reward chart's grid, a row per card, whatever single days have – the layout never changes
 * by itself (user feedback, November 2026) –, else a column per day.
 */
function WeekColumns(props: StepsProps) {
  return props.counts && weekRows(props.plan).length > 0 ? <WeekStars {...props} /> : <DayColumns {...props} />;
}

/** A column per day with its steps; today's marked, and moons over the days to come – one per night until then. */
function DayColumns(props: StepsProps) {
  const { today, day, look, fresh, edit, plan } = props;
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
                insert={edit && steps.length < MAX_STEPS ? { axis: "column", last: i === steps.length - 1 } : undefined}
                small
              />
            ))}
            {edit && steps.length === 0 && <AddCard day={dayKey(d)} small />}
          </div>
        );
      })}
    </div>
  );
}

/** Where a tap opens the big day's window while the plan is made: its picture and its date (`data-edit="big-day"`). */
const BIG_DAY_EDIT = { "data-edit": "big-day", role: "button", tabIndex: 0 } as const;

/** What the window of the big day is called, also the tooltip of the places that open it. */
export const BIG_DAY: Localized = {
  de: "Der große Tag",
  en: "The big day",
  zh: "大日子",
  hi: "बड़ा दिन",
  es: "El gran día",
  ar: "اليوم الكبير",
  ru: "Большой день",
};

/** A night's name: its tooltip and what is read out. */
const NIGHT_NAME: Localized = { de: "Einmal schlafen" };

/**
 * One night of the Countdown as a card of its own (user feedback, November 2026: each night plainly a field): the child
 * asleep in its bed (`NightPic`, the look chosen) and under it one star field like the Belohnungstafel's, filled with
 * its star sticker when the child taps the morning after – on paper an empty ring for a sticker or a crayon. While the
 * Countdown is made ⚙️ chooses the picture of every night, and 🗑️ on a night still to come takes one night away.
 */
function NightCard({
  night,
  look,
  print,
  grey,
  hand,
  edit,
  fresh,
  tappable,
  addAfter = false,
}: {
  night: Night;
  look: NightLook;
  print: boolean;
  grey: boolean;
  /** The 👇 over the first morning waiting for its tap. */
  hand: boolean;
  edit: boolean;
  fresh: boolean;
  tappable: boolean;
  /** While it is made, on the last night: the ＋ on its right edge that adds a night after it. */
  addAfter?: boolean;
}) {
  const t = useT();
  const name = t(NIGHT_NAME);
  return (
    <span className="pl-night-cell">
      <span
        className={`pl-card small has-stars pl-night ${night.state}${fresh ? " fresh" : ""}`}
        data-night={tappable ? night.state : undefined}
        data-key={tappable ? night.key : undefined}
        data-tap={tappable ? tapState({ goal: night.state === "now", done: night.state === "done" }) : undefined}
        role="img"
        aria-label={name}
        title={print ? undefined : name}
      >
        {hand && (
          <span className="pl-night-hand" aria-hidden>
            👇
          </span>
        )}
        {edit && (
          <>
            <SheetAction act="configure" ask={t({ de: "Bild der Nächte ändern" })} data={{ "data-edit": "night" }} />
            {night.state === "later" && <SheetAction act="delete" ask={t({ de: "Eine Nacht weniger?" })} data={{ "data-edit": "delete-night" }} />}
            {addAfter && (
              <span
                className="pl-insert pl-insert-row after"
                data-edit="add-night"
                role="button"
                tabIndex={0}
                aria-label={t(ONE_MORE_NIGHT)}
                title={t(ONE_MORE_NIGHT)}
              >
                ＋
              </span>
            )}
          </>
        )}
        <span className="pl-emoji" aria-hidden>
          <NightPic look={look} lines={grey} />
        </span>
        <StarFields stars={1} got={night.state === "done" ? 1 : 0} ghost={false} />
      </span>
    </span>
  );
}

/** The ＋ after the nights while a Countdown is made. */
const ONE_MORE_NIGHT: Localized = { de: "Eine Nacht mehr" };

/**
 * The Countdown (H-41, H-05): „Wie oft noch schlafen?“ – a card for every night until the big day, the child asleep in
 * its bed with a star field under it like the Belohnungstafel's, in rows read from the top left, then an arrow to the
 * day's picture (Geburtstag, Urlaub, Oma kommt). Each morning the night slept glows, and the child's tap puts the star
 * into its field – so the stars grow as the nights to come get fewer. When the big day has come (its morning tapped),
 * the picture alone stands big in the middle. No date and no number: the child counts the nights. On paper only the
 * nights from the day it is printed, with empty rings for a sticker or a crayon. While it is made everything is changed
 * right here (user feedback, November 2026): ＋ on the last night's edge adds one, 🗑️ on a night to come takes one, ⚙️ on a
 * night chooses how the nights look, and the big day's picture opens its window (its date and its picture).
 */
function Countdown({ plan, day, ticks, look, edit, fresh, aspect }: StepsProps & { aspect: number }) {
  const t = useT();
  const label = useStepLabel();
  const figure = useFigure();
  const step = bigDayStep(plan);
  const nightLook = nightLookOf(plan.night, figure);
  const nights = look.print ? nightsOf(plan, day, undefined).filter((night) => night.state === "later") : nightsOf(plan, day, ticks);
  // The last morning just tapped: its star lands first, then the picture comes big (PlanScreen's party). While it is
  // made the nights stay, so a night can be added after the big day.
  const come = !edit && (look.print ? nights.length === 0 : bigDayCome(plan, day, ticks) && !nights.some((night) => night.key === fresh));
  const shown = come ? [] : nights;
  const moons = nights.filter((night) => night.state === "later").length;
  const first = shown.findIndex((night) => night.state === "now");
  const tappable = !look.print && !edit;
  const adds = edit && moons < MAX_NIGHTS;
  // No empty place kept for the ＋ (user feedback, November 2026): it sits on the last night's edge, alone only with no night.
  const cells = Math.max(shown.length, adds ? 1 : 0);
  // Upright, the picture goes under the nights; wide, beside them – the nights get the room the picture leaves (the
  // sheet's body is wider than the sheet with its heading, and the picture and the arrow take about its height). A
  // night is a card taller than wide (`STAR_CARD`), so the rows are planned in its widths.
  const tall = aspect < 1.25;
  const { cols, rows } = planLayout(cells, (tall ? aspect / 0.55 : Math.max(0.4, aspect * 1.2 - 0.85)) / STAR_CARD);
  const sleeps = t(SLEEPS_LEFT)(moons);
  return (
    <div className={`pl-countdown${tall ? " tall" : ""}${come ? " arrived" : ""}`}>
      {cells > 0 && (
        <>
          <div
            className="pl-nights-field"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
            role="group"
            aria-label={sleeps}
            title={look.print || edit ? undefined : sleeps}
          >
            {shown.map((night, i) => (
              <NightCard
                key={night.key}
                night={night}
                look={nightLook}
                print={look.print}
                grey={look.print && !look.color}
                hand={i === first}
                edit={edit}
                fresh={night.key === fresh}
                tappable={tappable}
                addAfter={adds && i === shown.length - 1}
              />
            ))}
            {adds && shown.length === 0 && (
              <span className="pl-night-cell">
                <span className="pl-add pl-night-add" data-edit="add-night" role="button" tabIndex={0} aria-label={t(ONE_MORE_NIGHT)} title={t(ONE_MORE_NIGHT)}>
                  ＋
                </span>
              </span>
            )}
          </div>
          <span className="pl-cd-arrow" aria-hidden>
            ➜
          </span>
        </>
      )}
      {step ? (
        <div
          className="pl-card pl-big-day"
          data-big-day={tappable ? "" : undefined}
          data-tap={tappable ? (first === -1 ? "goal" : "") : undefined}
          role="img"
          aria-label={label(step)}
          title={look.print ? undefined : edit ? t(BIG_DAY) : label(step)}
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
