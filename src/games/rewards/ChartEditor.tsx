import { type ReactNode, useEffect, useRef, useState } from "react";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { dayKey } from "@/games/teeth/daytime";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import {
  type Board,
  type BoardReward,
  boardFromTemplate,
  COLLECT_GOALS,
  fieldCount,
  type LinkedDays,
  MAX_TASKS,
  NO_LINKED,
  newId,
  parseCellKey,
  rewardFromCatalog,
  type StarLog,
  taskFromCatalog,
  weekday,
  withKind,
} from "./board";
import { BoardSheet, SCREEN_LOOK, useRewardLabel, useTaskLabel } from "./BoardSheet";
import {
  ACTIVITIES,
  type BoardKind,
  type CatalogTask,
  type ChartType,
  DAY_NAMES,
  KINDS,
  NOW_WAYS,
  PLAN_TEMPLATES,
  PLAN_VIEWS,
  type PlanView,
  REWARDS,
  type Slot,
  TASKS,
  TEMPLATES,
  THEMES,
} from "./catalog";
import { SlotChips } from "./Editor";
import { RITUALS } from "./rituals";
import { emptyHistory, type History, record, redo, undo } from "./history";
import { CHILD_NAME, Pick } from "./pageParts";
import { ItemPic } from "./pictures";
import {
  allStars,
  bigDayOf,
  bigDayStep,
  counterOf,
  counting,
  daysLater,
  defaultReward,
  exampleTicks,
  MAX_NIGHTS,
  MAX_STARS,
  moonsLeft,
  type Plan,
  type PlanStep,
  planFromTemplate,
  planGoal,
  starsOf,
  stepFromCatalog,
  stepLimit,
  stepsOn,
  withCounter,
  withSame,
  withEveryDay,
  withStepStars,
  withSteps,
} from "./plan";
import { BIG_DAY, PaperArrow, PLAN_SCREEN, PlanSheet, useStepLabel } from "./PlanSheet";

/** A chart while it is made or changed: a board or a plan. */
export type Draft = { type: "board"; board: Board } | { type: "plan"; plan: Plan };

/** The time a chart covers, by the id of its view of either kind. */
export type SpanId = "day" | "week" | "month" | "countdown" | "first-then" | "collect";

/** A time span of the „Zeitraum“ switch, and the kind of chart and view it makes in the wizard. */
interface Span {
  id: SpanId;
  label: Localized;
  type: ChartType;
  /** What it shows, in a line for grown-ups (its tooltip). */
  hint?: Localized;
}

const kindLabel = (id: BoardKind) => KINDS.find((kind) => kind.id === id)?.label ?? { de: id };
const kindHint = (id: BoardKind) => KINDS.find((kind) => kind.id === id)?.hint;
const planLabel = (id: PlanView) => PLAN_VIEWS.find((view) => view.id === id)?.label ?? { de: id };
const planHint = (id: PlanView) => PLAN_VIEWS.find((view) => view.id === id)?.hint;

/**
 * „Zeitraum“ in the wizard, by the time a chart covers (user feedback, November 2026): a day, a week, a month, the
 * Countdown to a big day (H-41), then Erst – Dann, seldom used, and Sammeln last, which counts stars whatever the day.
 * Tag, Woche, Countdown and Erst – Dann are plans (Tag, Woche and Erst – Dann with a Zähler a Belohnungstafel), Monat
 * and Sammeln boards.
 */
export const SPANS: Span[] = [
  { id: "day", label: kindLabel("day"), type: "plan", hint: kindHint("day") },
  { id: "week", label: kindLabel("week"), type: "plan", hint: kindHint("week") },
  { id: "month", label: kindLabel("month"), type: "board", hint: kindHint("month") },
  { id: "countdown", label: planLabel("countdown"), type: "plan", hint: planHint("countdown") },
  { id: "first-then", label: planLabel("first-then"), type: "plan", hint: planHint("first-then") },
  { id: "collect", label: kindLabel("collect"), type: "board", hint: kindHint("collect") },
];

/** The span a draft is in: its view, of either kind. */
const spanOf = (draft: Draft): SpanId => (draft.type === "board" ? draft.board.kind : draft.plan.view);

/** The first chart of the wizard (user decision, November 2026): „Mein Tag“, morning and evening on one sheet, a star a card and a reward. */
export function defaultDraft(language: TargetLanguageId): Draft {
  const template = PLAN_TEMPLATES.find((tpl) => tpl.view === "day") ?? PLAN_TEMPLATES[0];
  return { type: "plan", plan: { ...withCounter(planFromTemplate(template, language), 1), reward: defaultReward() } };
}

/** The reward of a draft, null where there is none. */
const rewardOf = (draft: Draft): BoardReward | null => (draft.type === "board" ? draft.board.reward : (draft.plan.reward ?? null));

/**
 * A draft in another span, in the wizard: the span's first Vorlage, keeping the child's name, the colours, the reward
 * and the Zähler – a board counts a star a field, so a plan made from one counts one a card.
 */
export function draftInSpan(span: Span, from: Draft, language: TargetLanguageId): Draft {
  const { childName, theme } = from.type === "board" ? from.board : from.plan;
  const reward = rewardOf(from);
  if (span.type === "plan") {
    const template = PLAN_TEMPLATES.find((tpl) => tpl.view === span.id) ?? PLAN_TEMPLATES[0];
    // A Countdown counts nights, not stars: its card has no Zähler (the reward stays kept for a span that counts).
    const stars = span.id === "countdown" ? 0 : from.type === "plan" ? counterOf(from.plan) : 1;
    const made = { ...planFromTemplate(template, language), childName, theme };
    // A week that counts stars is a reward chart's week: the same tasks every day, a row each (`WeekStars`), not the
    // Kita's Wochenplan, whose days differ.
    const week = span.id === "week" && stars > 0 ? rewardWeek(made) : made;
    return { type: "plan", plan: { ...withCounter(week, stars), reward } };
  }
  const template = TEMPLATES.find((tpl) => tpl.kind === span.id) ?? TEMPLATES[0];
  return { type: "board", board: { ...boardFromTemplate(template, language), id: newId(), childName, theme, reward } };
}

/** The Belohnungstafel's week as a plan: the board Vorlage „woche“'s tasks, the same every day. */
function rewardWeek(plan: Plan): Plan {
  const tasks = TEMPLATES.find((tpl) => tpl.id === "woche")?.tasks ?? [];
  return { ...plan, days: [tasks.map((id) => ({ ...stepFromCatalog(id), id }))], same: true };
}

/** Cards a plan offers: the day's activities first, then the tasks of the Belohnungstafel. */
const OFFERED = [...ACTIVITIES, ...TASKS];

/** What a tap on the sheet opened: a card, a place to add one, the reward, or a board's task. */
type Editing =
  | { what: "card"; key: string; every?: boolean }
  | { what: "add"; part?: Slot; day?: string; every?: boolean }
  | { what: "reward" }
  | { what: "task"; id: string }
  | { what: "add-task" }
  | { what: "big-day" };

/** „Zeitraum“: what time the chart covers. */
const SPAN: Localized = { de: "Zeitraum", en: "Time span", zh: "时间范围", hi: "समय-अवधि", es: "Periodo", ar: "المدة", ru: "Период" };

/** The chart itself of a draft: what changes when anything on it changes (the draft around it is made anew on every render). */
const chartOf = (draft: Draft): Board | Plan => (draft.type === "board" ? draft.board : draft.plan);

/** Letters typed within this time join one change, so ↶ takes back a word, not a letter. */
const TYPING_MS = 1500;

/** Whether the focus is in a box for words, where Ctrl+Z belongs to the browser's own undo of the letters. */
const inTextBox = (el: Element | null) => el instanceof HTMLTextAreaElement || (el instanceof HTMLInputElement && el.type === "text");

/**
 * ↶ and ↷ for a chart being made or changed (user feedback, November 2026): every change of the draft – on the sheet,
 * in the options or under „Weitere Einstellungen“ – is noted, and Ctrl+Z / Ctrl+Shift+Z (⌘ on a Mac) and Ctrl+Y work
 * too, outside a box for words.
 */
function useDraftHistory(draft: Draft, onChange: (draft: Draft) => void) {
  const [history, setHistory] = useState<History<Draft>>(emptyHistory);
  const seen = useRef(draft);
  const jumped = useRef<Board | Plan | null>(null);
  const typed = useRef(0);

  useEffect(() => {
    const before = seen.current;
    seen.current = draft;
    if (chartOf(before) === chartOf(draft)) return;
    if (jumped.current === chartOf(draft)) {
      jumped.current = null;
      return;
    }
    const typing = inTextBox(document.activeElement);
    const merge = typing && Date.now() - typed.current < TYPING_MS;
    typed.current = typing ? Date.now() : 0;
    setHistory((h) => record(h, before, merge));
  }, [draft]);

  const jump = (step: { history: History<Draft>; value: Draft } | null) => {
    if (!step) return;
    jumped.current = chartOf(step.value);
    typed.current = 0;
    setHistory(step.history);
    onChange(step.value);
  };
  const back = () => jump(undo(history, draft));
  const forward = () => jump(redo(history, draft));

  const keys = useRef({ back, forward });
  keys.current = { back, forward };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey || inTextBox(document.activeElement)) return;
      const key = event.key.toLowerCase();
      if (key === "z" && !event.shiftKey) keys.current.back();
      else if ((key === "z" && event.shiftKey) || key === "y") keys.current.forward();
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return { canUndo: history.past.length > 0, canRedo: history.future.length > 0, back, forward };
}

/**
 * A chart as it will look, changed right on it – the same in the wizard and under „Gestalten“ (user decision,
 * November 2026: „exakt gleiche Seite für Assistent und Seite“). On top only what the sheet has no place to tap for:
 * the Zeitraum (in the wizard any span, a new chart from its Vorlage; on the page only views of the same kind, its
 * cards kept), what moves where nothing counts, the colours and the child's name – what a tap on the sheet changes
 * (stars, reward, cards, the day's parts) is never there twice (user feedback, November 2026). Below, the sheet itself
 * in edit mode: each card and the reward have ⚙️ and 🗑️ in their corners (`SheetAction`), a card − ＋ at its stars; a
 * tap on a card swaps it, sets its stars for a day, moves or removes it; ＋ adds one; a part's sign takes its line
 * away (the last one only its sign, which ☀️ / 🌙 bring back); the reward is swapped, removed (the stars stay) or its
 * goal set. `more` holds the rest („Weitere Einstellungen“: own words, own emoji, weekdays).
 */
export function ChartEditor({
  draft,
  onChange,
  making,
  day = new Date(),
  log,
  linked = NO_LINKED,
  more,
}: {
  draft: Draft;
  onChange: (draft: Draft) => void;
  /** In the wizard: the chart is new, so the Zeitraum may change its kind. */
  making: boolean;
  /** The day the sheet shows. */
  day?: Date;
  /** The real stars, on a chart already made. */
  log?: StarLog;
  linked?: LinkedDays;
  /** „Weitere Einstellungen“, under the sheet. */
  more?: ReactNode;
}) {
  const t = useT();
  const { id: language } = useAppLanguage();
  const box = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState(1.6);
  const [editing, setEditing] = useState<Editing | null>(null);
  const today = new Date();
  const { canUndo, canRedo, back, forward } = useDraftHistory(draft, onChange);
  const setReward = (next: BoardReward | null) =>
    onChange(draft.type === "board" ? { type: "board", board: { ...draft.board, reward: next } } : { type: "plan", plan: { ...draft.plan, reward: next } });
  const setPlan = (next: Plan) => onChange({ type: "plan", plan: next });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setAspect(el.clientWidth / Math.max(1, el.clientHeight)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onClick = (event: React.MouseEvent) => {
    const el = (event.target as Element).closest<HTMLElement>("[data-edit], [data-step]");
    if (!el) return;
    const { edit, part, day: dayId, task, step, cell, by, every } = el.dataset;
    const all = every !== undefined;
    // The day's cards changed, as a part's sign or line does: the day shown, or every day where they are alike.
    const dayChanged = (plan: Plan, edit: (steps: PlanStep[]) => PlanStep[]) => withSteps(plan, weekday(day), edit(stepsOn(plan, day)));
    if (draft.type === "plan" && edit === "stars" && cell) {
      // − ＋ at a card's stars: its own, on every day where the days are alike or in a week's grid, else that weekday's.
      const plan = draft.plan;
      const { day: cellDay, taskId } = parseCellKey(cell);
      const own = stepsOn(plan, cellDay).find((s) => s.id === taskId);
      if (!own) return;
      const n = Math.max(0, Math.min(MAX_STARS, starsOf(own) + Number(by)));
      const next = withStepStars(plan, all || (plan.same && plan.view !== "week") ? null : weekday(cellDay), taskId, n);
      // A plain plan's first star makes it count; one that never had a reward gets the default (Belohnung is on by default).
      setPlan(!counting(plan) && plan.reward === undefined ? { ...next, reward: defaultReward() } : next);
    } else if (draft.type === "plan" && edit === "card" && cell) setEditing({ what: "card", key: cell, every: all });
    else if (draft.type === "plan" && edit === "delete-card" && cell) setPlan(withoutCard(draft.plan, cell, all));
    else if (edit === "no-reward") setReward(null);
    else if (draft.type === "plan" && edit === "row" && part) {
      setPlan(dayChanged(draft.plan, (steps) => steps.filter((s) => s.part !== part)));
    } else if (draft.type === "plan" && edit === "sign") {
      // The last part's sun or moon taken off: its cards stay, as a day in one.
      setPlan(dayChanged(draft.plan, (steps) => steps.map(({ part: _, ...s }) => s)));
    } else if (draft.type === "plan" && edit === "sign-back" && part) {
      setPlan(dayChanged(draft.plan, (steps) => steps.map((s) => ({ ...s, part: part as Slot }))));
    } else if (edit === "add")
      setEditing(draft.type === "board" ? { what: "add-task" } : { what: "add", part: part as Slot | undefined, day: dayId, every: all });
    else if (edit === "reward") setEditing({ what: "reward" });
    else if (edit === "big-day") setEditing({ what: "big-day" });
    else if (edit === "task" && task) setEditing({ what: "task", id: task });
    else if (step) setEditing({ what: "card", key: step, every: all });
  };

  // A Countdown is a chart of its own, like a board beside a plan: on the page it never turns into a day's plan or back.
  const spans = making
    ? SPANS
    : draft.type === "plan"
      ? draft.plan.view === "countdown"
        ? []
        : SPANS.filter((span) => span.type === "plan" && span.id !== "countdown")
      : KINDS.map((kind): Span => ({ id: kind.id, label: kind.label, type: "board" }));
  const pickSpan = (span: Span) => {
    if (span.id === spanOf(draft)) return;
    if (making) onChange(draftInSpan(span, draft, language));
    else if (draft.type === "plan") onChange({ type: "plan", plan: { ...draft.plan, view: span.id as PlanView } });
    else onChange({ type: "board", board: withKind(draft.board, span.id as BoardKind) });
  };

  const plan = draft.type === "plan" ? draft.plan : undefined;
  const counts = plan ? counting(plan) : true;
  const ticks = draft.type === "plan" ? log?.[draft.plan.id] : log?.[draft.board.id];

  return (
    <div className="rw-chart-editor">
      <section
        className="rw-options-band"
        aria-label={t({
          de: "Art der Tafel und Einstellungen",
          en: "Kind of chart and settings",
          zh: "表的类型和设置",
          hi: "चार्ट का प्रकार और सेटिंग",
          es: "Tipo de tabla y ajustes",
          ar: "نوع اللوحة والإعدادات",
          ru: "Вид таблицы и настройки",
        })}
      >
        {spans.length > 0 && (
          <div className="rw-spans" role="group" aria-label={t(SPAN)}>
            <span className="rw-band-label">{t(SPAN)}</span>
            {spans.map((span) => (
              <button
                key={span.id}
                type="button"
                className="rw-span"
                aria-pressed={span.id === spanOf(draft)}
                title={span.hint ? t(span.hint) : undefined}
                onClick={() => pickSpan(span)}
              >
                <SpanPic id={span.id} />
                <span className="rw-span-name">{t(span.label)}</span>
              </button>
            ))}
          </div>
        )}
        {making && (
          <p className="rw-tip">
            <span className="rw-tip-arrow" aria-hidden>
              ⤴
            </span>
            {t({
              de: "Wechseln Sie hier frei zwischen Tag, Woche, Monat, Countdown, Erst – Dann und Sammeln, und stellen Sie darunter alles ein. Auch später lässt sich alles ändern.",
              en: "Switch freely here between Day, Week, Month, Countdown, First – Then and Collect, and set everything up below. You can change it all later, too.",
              zh: "在这里可以随意切换日、周、月、倒数、先 – 然后和收集，并在下面设置一切。以后也都可以修改。",
              hi: "यहाँ आप दिन, हफ़्ता, महीना, उलटी गिनती, पहले – फिर और जमा करना के बीच आसानी से बदल सकते हैं, और नीचे सब कुछ सेट कर सकते हैं। बाद में भी सब कुछ बदला जा सकता है।",
              es: "Cambie aquí libremente entre Día, Semana, Mes, Cuenta atrás, Primero – Después y Juntar, y ajuste todo debajo. Más adelante también se puede cambiar todo.",
              ar: "بدّلوا هنا بحرية بين يوم وأسبوع وشهر والعدّ التنازلي وأولًا – ثم وجمع، واضبطوا كل شيء في الأسفل. ويمكن تغيير كل شيء لاحقًا أيضًا.",
              ru: "Здесь можно свободно переключаться между видами «День», «Неделя», «Месяц», «Обратный отсчёт», «Сначала – потом» и «Копилка», а ниже всё настроить. Позже всё тоже можно изменить.",
            })}
          </p>
        )}
        <div className="rw-options">
          {/* Only where nothing counts: with star fields the stars show what is done, and nothing moves. */}
          {plan?.view === "day" && !counts && (
            <span
              className="rw-opt-segments"
              role="group"
              aria-label={t({
                de: "Was wandert?",
                en: "What moves along?",
                zh: "移动的是什么？",
                hi: "क्या आगे बढ़ता है?",
                es: "¿Qué se mueve?",
                ar: "ما الذي يتحرّك؟",
                ru: "Что передвигается?",
              })}
            >
              {NOW_WAYS.map((way) => (
                <button
                  key={way.emoji}
                  type="button"
                  aria-pressed={way.field === !!plan.nowField}
                  title={t(way.print)}
                  onClick={() => setPlan({ ...plan, nowField: way.field })}
                >
                  <span className="rw-opt-pic" aria-hidden>
                    {way.field ? way.emoji : <PaperArrow />}
                  </span>
                  {t(way.label)}
                  <span className="rw-opt-print" aria-hidden>
                    {way.field ? "✂️" : "🖨️"}
                  </span>
                </button>
              ))}
            </span>
          )}
          <span
            className="rw-opt-group rw-swatches"
            role="group"
            aria-label={t({ de: "Farben", en: "Colours", zh: "颜色", hi: "रंग", es: "Colores", ar: "الألوان", ru: "Цвета" })}
          >
            {THEMES.map((theme) => {
              const on = (draft.type === "board" ? draft.board.theme : draft.plan.theme) === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  className="rw-swatch"
                  aria-pressed={on}
                  aria-label={t(theme.label)}
                  title={t(theme.label)}
                  style={{ background: theme.paper, borderColor: theme.ink, boxShadow: `inset 0 0 0 5px ${theme.main}` }}
                  onClick={() =>
                    onChange(
                      draft.type === "board"
                        ? { type: "board", board: { ...draft.board, theme: theme.id } }
                        : { type: "plan", plan: { ...draft.plan, theme: theme.id } },
                    )
                  }
                />
              );
            })}
          </span>
          <input
            className="rw-opt-name-input"
            type="text"
            value={draft.type === "board" ? draft.board.childName : draft.plan.childName}
            maxLength={24}
            aria-label={t(CHILD_NAME)}
            title={t(CHILD_NAME)}
            placeholder={`👧 ${t({ de: "Name des Kindes", en: "Child’s name", zh: "孩子的名字", hi: "बच्चे का नाम", es: "Nombre", ar: "اسم الطفل", ru: "Имя ребёнка" })}`}
            onChange={(e) =>
              onChange(
                draft.type === "board"
                  ? { type: "board", board: { ...draft.board, childName: e.target.value } }
                  : { type: "plan", plan: { ...draft.plan, childName: e.target.value } },
              )
            }
          />
        </div>
      </section>

      <div className="rw-edit-bar">
        <p className="rw-wysiwyg">
          <span className="rw-wysiwyg-pic" aria-hidden>
            ✏️
          </span>
          <span>
            <strong>
              {t({
                de: "Direkt auf der Tafel ändern:",
                en: "Change it right on the chart:",
                zh: "直接在表上修改：",
                hi: "सीधे चार्ट पर बदलें:",
                es: "Cambie directamente en la tabla:",
                ar: "عدّلوا مباشرة على اللوحة:",
                ru: "Меняйте прямо в таблице:",
              })}
            </strong>{" "}
            {t({
              de: "Tippen Sie auf Karten, Sterne und Belohnung. So wie Sie die Tafel hier sehen, wird sie auch gedruckt.",
              en: "Tap cards, stars and the reward. The chart prints just as you see it here.",
              zh: "点按卡片、星星和奖励。您在这里看到的样子，就是打印出来的样子。",
              hi: "कार्ड, सितारों और इनाम पर टैप करें। चार्ट जैसा यहाँ दिखता है, वैसा ही प्रिंट होता है।",
              es: "Toque las tarjetas, las estrellas y el premio. La tabla se imprime tal como la ve aquí.",
              ar: "انقروا على البطاقات والنجوم والمكافأة. تُطبع اللوحة تمامًا كما ترونها هنا.",
              ru: "Нажимайте на карточки, звёзды и награду. Таблица напечатается такой, какой вы видите её здесь.",
            })}
          </span>
        </p>
        <span
          className="rw-history"
          role="group"
          aria-label={t({
            de: "Rückgängig und Wiederholen",
            en: "Undo and redo",
            zh: "撤销和重做",
            hi: "पहले जैसा करें और फिर से करें",
            es: "Deshacer y rehacer",
            ar: "تراجع وإعادة",
            ru: "Отменить и повторить",
          })}
        >
          <UndoButton
            sign="↶"
            label={t({ de: "Rückgängig", en: "Undo", zh: "撤销", hi: "पहले जैसा करें", es: "Deshacer", ar: "تراجع", ru: "Отменить" })}
            on={canUndo}
            onClick={back}
          />
          <UndoButton
            sign="↷"
            label={t({ de: "Wiederholen", en: "Redo", zh: "重做", hi: "फिर से करें", es: "Rehacer", ar: "إعادة", ru: "Повторить" })}
            on={canRedo}
            onClick={forward}
          />
        </span>
      </div>

      {/* In a row, like the chart on the page (`rw-main`): only there the sheet gets the box's whole height. */}
      <div className="rw-main">
        <div className="rw-screen">
          {/* The sheet's own places to tap: one listener for all of them. */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: the places inside are buttons (role, tabIndex), and Enter on one reaches this listener */}
          <div
            ref={box}
            className="rw-screen-box rw-edit-box"
            onClick={onClick}
            onKeyDown={(e) => e.key === "Enter" && onClick(e as unknown as React.MouseEvent)}
          >
            {draft.type === "plan" ? (
              <PlanSheet
                plan={draft.plan}
                ticks={draft.plan.examples ? { ...exampleTicks(draft.plan, today), ...ticks } : ticks}
                linked={linked}
                today={today}
                day={day}
                look={PLAN_SCREEN}
                aspect={aspect}
                edit
              />
            ) : (
              <BoardSheet board={draft.board} stars={ticks} linked={linked} today={today} day={day} look={SCREEN_LOOK} aspect={aspect} edit />
            )}
          </div>
        </div>
      </div>

      {more && (
        <details className="rw-more">
          <summary>
            {t({
              de: "Weitere Einstellungen",
              en: "More settings",
              zh: "更多设置",
              hi: "और सेटिंग",
              es: "Más ajustes",
              ar: "إعدادات أخرى",
              ru: "Другие настройки",
            })}
          </summary>
          {more}
        </details>
      )}

      {editing && plan && editing.what === "card" && (
        <CardDialog plan={plan} cellKey={editing.key} every={editing.every} onChange={setPlan} onClose={() => setEditing(null)} />
      )}
      {editing && plan && editing.what === "add" && (
        <AddDialog
          plan={plan}
          day={editing.day ? parseCellKey(`${editing.day}|x`).day : day}
          part={editing.part}
          every={editing.every}
          onChange={setPlan}
          onClose={() => setEditing(null)}
        />
      )}
      {editing && editing.what === "reward" && <RewardDialog draft={draft} day={day} onChange={onChange} onClose={() => setEditing(null)} />}
      {editing && plan && editing.what === "big-day" && <BigDayDialog plan={plan} onChange={setPlan} onClose={() => setEditing(null)} />}
      {editing && draft.type === "board" && (editing.what === "task" || editing.what === "add-task") && (
        <TaskDialog
          board={draft.board}
          taskId={editing.what === "task" ? editing.id : undefined}
          onChange={(board) => onChange({ type: "board", board })}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

/**
 * ↶ or ↷ with its word. With nothing to undo it is hidden but keeps its place, so the other doesn't jump (a button that
 * can do nothing is never shown greyed).
 */
function UndoButton({ sign, label, on, onClick }: { sign: string; label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`rw-history-button${on ? "" : " off"}`} tabIndex={on ? 0 : -1} aria-hidden={!on} title={label} onClick={onClick}>
      <span className="rw-history-sign" aria-hidden>
        {sign}
      </span>
      <span className="rw-history-name">{label}</span>
    </button>
  );
}

/**
 * A Zeitraum's small picture: the shape its chart has – a day's cards in a row, a week's seven columns, a month's
 * calendar, two cards with an arrow, a path of dots to the reward – so the choice reads at a glance as another chart.
 */
function SpanPic({ id }: { id: SpanId }) {
  const box = (x: number, y: number, w: number, h: number, key?: string | number) => <rect key={key} x={x} y={y} width={w} height={h} rx={1.5} />;
  return (
    <svg className="rw-span-pic" viewBox="0 0 48 32" aria-hidden>
      {id === "day" && [4, 18, 32].map((x) => box(x, 9, 12, 14, x))}
      {id === "week" && Array.from({ length: 7 }, (_, i) => box(3 + i * 6.2, 5, 4.6, 22, i))}
      {id === "month" && Array.from({ length: 20 }, (_, i) => box(4 + (i % 5) * 8.2, 4 + Math.floor(i / 5) * 6.2, 6.4, 4.8, i))}
      {id === "first-then" && (
        <>
          {box(4, 8, 15, 16)}
          <path d="M22 16h6m-3-3 3 3-3 3" fill="none" />
          {box(30, 8, 15, 16)}
        </>
      )}
      {id === "countdown" && (
        <>
          {[5, 14, 23].map((x) => (
            <path key={x} d={`M${x + 4} 10.5a5 5 0 1 0 0 9 5.5 5.5 0 0 1 0-9z`} />
          ))}
          <path d="M30 15h3m-1.5-1.5 1.5 1.5-1.5 1.5" fill="none" />
          {box(36, 8, 9, 14)}
        </>
      )}
      {id === "collect" && (
        <>
          {[6, 14, 22, 30].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 ? 12 : 21} r={3} />
          ))}
          <path d="M38 13h7v9h-7z M41.5 13v9 M38 16h7" fill="none" />
        </>
      )}
    </svg>
  );
}

/** A small switch of a few choices side by side, as wide as its words: the chosen one plainly marked. */
function Segments<I extends string>({
  label,
  items,
  selected,
  onPick,
}: {
  label: string;
  items: { id: I; label: string }[];
  selected: I;
  onPick: (id: I) => void;
}) {
  return (
    <span className="rw-opt-segments" role="group" aria-label={label}>
      {items.map((item) => (
        <button key={item.id} type="button" aria-pressed={item.id === selected} onClick={() => onPick(item.id)}>
          {item.label}
        </button>
      ))}
    </span>
  );
}

/** − n + with its sign (⭐, ☀️, 🌙): the Zähler, the cards of a part, the stars of a card or until the reward. */
function Counter({
  emoji,
  label,
  value,
  min,
  max,
  onChange,
  wide = false,
}: {
  emoji?: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  /** With its name written beside it, not only read out. */
  wide?: boolean;
}) {
  const t = useT();
  return (
    <span className="rw-opt-counter" role="group" aria-label={label} title={label}>
      {emoji && <span aria-hidden>{emoji}</span>}
      {(wide || !emoji) && <span className="rw-opt-name">{label}</span>}
      <button
        type="button"
        disabled={value <= min}
        aria-label={t({ de: "Weniger", en: "Fewer", zh: "减少", hi: "कम", es: "Menos", ar: "أقل", ru: "Меньше" })}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <span className="rw-opt-number">{value}</span>
      <button
        type="button"
        disabled={value >= max}
        aria-label={t({ de: "Mehr", en: "More", zh: "增加", hi: "ज़्यादा", es: "Más", ar: "أكثر", ru: "Больше" })}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </span>
  );
}

/** A window over the chart for one thing on it, closed by ✕, Esc or a tap beside it. */
function EditDialog({ title, onClose, children }: { title: ReactNode; onClose: () => void; children: ReactNode }) {
  const t = useT();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: a tap beside the window closes it; Esc does the same
    <dialog ref={ref} className="rw-edit-dialog" onClose={onClose} onClick={(event) => event.target === event.currentTarget && ref.current?.close()}>
      <div className="rw-edit-dialog-head">
        <h3>{title}</h3>
        <button
          type="button"
          className="rw-edit-close"
          aria-label={t({ de: "Schließen", ru: "Закрыть", en: "Close", zh: "关闭", hi: "बंद करें", es: "Cerrar", ar: "إغلاق" })}
          onClick={() => ref.current?.close()}
        >
          ✕
        </button>
      </div>
      {children}
    </dialog>
  );
}

/** A card taken off by its 🗑️: from the day it is on, or with `every` (a week's grid) from every day. */
function withoutCard(plan: Plan, cell: string, every: boolean): Plan {
  const { day, taskId } = parseCellKey(cell);
  const drop = (list: PlanStep[]) => list.filter((s) => s.id !== taskId);
  return every ? withEveryDay(plan, drop) : withDay(plan, day, drop(stepsOn(plan, day)));
}

/** A day's cards changed: in a week whose days are alike, only the day tapped (its column) changes. */
function withDay(plan: Plan, day: Date, steps: PlanStep[]): Plan {
  const own = plan.same && plan.view === "week" ? withSame(plan, false, weekday(day)) : plan;
  return withSteps(own, weekday(day), steps);
}

/** A card from the catalogue in a part of the day: a card a game ticks counts for that part's time. */
const cardIn = (id: string, part: Slot | undefined, stars: number): PlanStep => {
  const step = stepFromCatalog(id, part);
  return { ...step, ...(part ? { part } : {}), ...(stars > 0 ? { stars } : {}) };
};

/** A card tapped: its stars (that day or every day), earlier or later, removed, or swapped for another picture. */
function CardDialog({
  plan,
  cellKey,
  every = false,
  onChange,
  onClose,
}: {
  plan: Plan;
  cellKey: string;
  /** Tapped at the head of a week's grid: the card of every day changes alike. */
  every?: boolean;
  onChange: (plan: Plan) => void;
  onClose: () => void;
}) {
  const t = useT();
  const stepLabel = useStepLabel();
  const { day, taskId } = parseCellKey(cellKey);
  const steps = stepsOn(plan, day);
  const index = steps.findIndex((s) => s.id === taskId);
  const step = steps[index];
  const weekdayName = t(DAY_NAMES)[weekday(day)];
  // In the week a card is that day's; on a day's plan alike every day the stars are every day's, or only this weekday's.
  const [onlyToday, setOnlyToday] = useState(!every && (plan.view === "week" || !plan.same));
  if (!step) return null;
  /** The tapped day's cards changed, or with `every` each day's alike. */
  const change = (edit: (list: PlanStep[]) => PlanStep[]) => onChange(every ? withEveryDay(plan, edit) : withDay(plan, day, edit(steps)));
  const move = (by: number) =>
    change((list) => {
      const at = list.findIndex((s) => s.id === step.id);
      if (at < 0) return list;
      const next = [...list];
      next.splice(at, 1);
      next.splice(at + by, 0, list[at]);
      return next;
    });
  return (
    <EditDialog
      title={
        <>
          <span className="rw-edit-dialog-pic" aria-hidden>
            <ItemPic item={step} />
          </span>{" "}
          {stepLabel(step)}
        </>
      }
      onClose={onClose}
    >
      <div className="rw-edit-row">
        <Counter
          emoji="⭐"
          wide
          label={t({ de: "Sterne", en: "Stars", zh: "星星", hi: "सितारे", es: "Estrellas", ar: "النجوم", ru: "Звёзды" })}
          value={starsOf(step)}
          min={0}
          max={MAX_STARS}
          onChange={(n) => onChange(withStepStars(plan, onlyToday ? weekday(day) : null, step.id, n))}
        />
        {plan.view !== "week" && !every && (
          <Segments
            label={t({
              de: "Für welche Tage?",
              en: "For which days?",
              zh: "哪几天？",
              hi: "किन दिनों के लिए?",
              es: "¿Para qué días?",
              ar: "لأيّ الأيام؟",
              ru: "На какие дни?",
            })}
            items={[
              { id: "all", label: t({ de: "Jeden Tag", en: "Every day", zh: "每天", hi: "हर दिन", es: "Todos los días", ar: "كل يوم", ru: "Каждый день" }) },
              {
                id: "one",
                label: t({
                  de: (d: string) => `Nur ${d}`,
                  en: (d: string) => `Only ${d}`,
                  zh: (d: string) => `仅${d}`,
                  hi: (d: string) => `सिर्फ़ ${d}`,
                  es: (d: string) => `Solo ${d}`,
                  ar: (d: string) => `${d} فقط`,
                  ru: (d: string) => `Только ${d}`,
                })(weekdayName),
              },
            ]}
            selected={onlyToday ? "one" : "all"}
            onPick={(id) => setOnlyToday(id === "one")}
          />
        )}
      </div>
      <div className="rw-edit-row">
        <button type="button" className="rw-edit-button" disabled={index === 0 || steps[index - 1].part !== step.part} onClick={() => move(-1)}>
          ‹ {t({ de: "Früher", en: "Move earlier", zh: "往前移", hi: "पहले करें", es: "Mover antes", ar: "تقديم", ru: "Раньше" })}
        </button>
        <button type="button" className="rw-edit-button" disabled={index === steps.length - 1 || steps[index + 1].part !== step.part} onClick={() => move(1)}>
          {t({ de: "Später", en: "Move later", zh: "往后移", hi: "बाद में करें", es: "Mover después", ar: "تأخير", ru: "Позже" })} ›
        </button>
        <button
          type="button"
          className="rw-edit-button"
          onClick={() => {
            change((list) => list.filter((s) => s.id !== step.id));
            onClose();
          }}
        >
          🗑️ {t({ de: "Entfernen", en: "Remove", zh: "删除", hi: "हटाएँ", es: "Quitar", ar: "إزالة", ru: "Убрать" })}
        </button>
      </div>
      <h4 className="rw-edit-sub">
        {t({ de: "Tauschen gegen", en: "Swap for", zh: "换成", hi: "इससे बदलें", es: "Cambiar por", ar: "استبدال بـ", ru: "Заменить на" })}
      </h4>
      <CardPicks
        selected={step.catalog}
        onPick={(id) => {
          // One new id for every day's card, so a week's row stays one row.
          const fresh = newId();
          change((list) => list.map((s) => (s.id === step.id ? { ...cardIn(id, s.part, starsOf(s)), id: fresh } : s)));
          onClose();
        }}
      />
    </EditDialog>
  );
}

/** ＋ tapped: a card for that part of the day (or that day of the week, or with `every` every day of a week's grid), at its end. */
function AddDialog({
  plan,
  day,
  part,
  every = false,
  onChange,
  onClose,
}: {
  plan: Plan;
  day: Date;
  part?: Slot;
  every?: boolean;
  onChange: (plan: Plan) => void;
  onClose: () => void;
}) {
  const t = useT();
  const steps = stepsOn(plan, day);
  const add = (id: string) => {
    const card = cardIn(id, part, counterOf(plan));
    // After the part's last card; a morning that was taken away comes back before the evening.
    const placed = (list: PlanStep[]) => {
      const last = list.findLastIndex((s) => s.part === part);
      const at = last >= 0 ? last + 1 : part === "morning" ? 0 : list.length;
      return [...list.slice(0, at), card, ...list.slice(at)];
    };
    onChange(every ? withEveryDay(plan, placed) : withDay(plan, day, placed(steps)));
    onClose();
  };
  return (
    <EditDialog
      title={t({ de: "Karte dazu", en: "Add a card", zh: "添加卡片", hi: "कार्ड जोड़ें", es: "Añadir tarjeta", ar: "إضافة بطاقة", ru: "Добавить карточку" })}
      onClose={onClose}
    >
      {steps.length >= stepLimit(steps) ? (
        <p className="setting-note">
          {t({
            de: "Mehr Karten passen nicht auf den Plan.",
            en: "No more cards fit on the plan.",
            zh: "日程表上放不下更多卡片了。",
            hi: "योजना में और कार्ड नहीं आ सकते।",
            es: "No caben más tarjetas en el plan.",
            ar: "لا تتسع الخطة لبطاقات أخرى.",
            ru: "Больше карточек в план не поместится.",
          })}
        </p>
      ) : (
        <CardPicks onPick={add} />
      )}
    </EditDialog>
  );
}

/** Every card to pick, as big pictures; first the rituals (H-58), whose cards bring their words for the grown-up. */
function CardPicks({ selected, onPick }: { selected?: string; onPick: (id: string) => void }) {
  const t = useT();
  const pick = (item: CatalogTask) => (
    <Pick
      key={item.id}
      selected={item.id === selected}
      onClick={() => onPick(item.id)}
      emoji={<ItemPic item={{ emoji: item.emoji, catalog: item.id }} />}
      label={t(item.label)}
    />
  );
  return (
    <>
      <h4 className="rw-edit-sub">{t({ de: "Rituale – mit Worten für Sie auf der Karte" })}</h4>
      <div className="rw-picks rw-picks-tiles">{RITUALS.map(pick)}</div>
      <h4 className="rw-edit-sub">{t({ de: "Bilder für den Tag" })}</h4>
      <div className="rw-picks rw-picks-tiles">{OFFERED.map(pick)}</div>
    </>
  );
}

/**
 * A Countdown's big day tapped (its moons or its picture): when it is – by date, or by its nights with − + – and which
 * picture stands for it. The sheet never shows the date, only the moons.
 */
function BigDayDialog({ plan, onChange, onClose }: { plan: Plan; onChange: (plan: Plan) => void; onClose: () => void }) {
  const t = useT();
  const today = new Date();
  const step = bigDayStep(plan);
  const on = (key: string) => onChange({ ...plan, bigDay: key });
  return (
    <EditDialog title={t(BIG_DAY)} onClose={onClose}>
      <div className="rw-edit-row">
        <label className="rw-opt-counter">
          <span aria-hidden>📅</span>
          <span className="rw-opt-name">{t({ de: "Datum", en: "Date", zh: "日期", hi: "तारीख़", es: "Fecha", ar: "التاريخ", ru: "Дата" })}</span>
          <input
            className="rw-big-day-date"
            type="date"
            value={dayKey(bigDayOf(plan, today))}
            min={dayKey(today)}
            max={dayKey(daysLater(today, MAX_NIGHTS))}
            onChange={(e) => e.target.value && on(e.target.value)}
          />
        </label>
        <Counter
          emoji="🌙"
          wide
          label={t({
            de: "Noch so oft schlafen",
            en: "Sleeps to go",
            zh: "还要睡几觉",
            hi: "कितनी बार और सोना है",
            es: "Noches que faltan",
            ar: "الليالي الباقية",
            ru: "Сколько ещё спать",
          })}
          value={moonsLeft(plan, today)}
          min={0}
          max={MAX_NIGHTS}
          onChange={(n) => on(dayKey(daysLater(today, n)))}
        />
      </div>
      <h4 className="rw-edit-sub">
        {t({
          de: "Bild für den Tag",
          en: "Picture for the day",
          zh: "这一天的图片",
          hi: "दिन के लिए तस्वीर",
          es: "Imagen para el día",
          ar: "صورة لهذا اليوم",
          ru: "Картинка для этого дня",
        })}
      </h4>
      <CardPicks
        selected={step?.catalog}
        onPick={(id) => {
          onChange({ ...plan, days: [[{ ...stepFromCatalog(id), id }]], same: true });
          onClose();
        }}
      />
    </EditDialog>
  );
}

/** The reward tapped: another one, none (the stars stay), and how many stars lead to it. */
function RewardDialog({ draft, day, onChange, onClose }: { draft: Draft; day: Date; onChange: (draft: Draft) => void; onClose: () => void }) {
  const t = useT();
  const rewardLabel = useRewardLabel();
  const reward = rewardOf(draft);
  const set = (next: BoardReward | null) =>
    onChange(draft.type === "board" ? { type: "board", board: { ...draft.board, reward: next } } : { type: "plan", plan: { ...draft.plan, reward: next } });
  const goal =
    draft.type === "plan"
      ? { value: planGoal(draft.plan, day), max: allStars(draft.plan, day), set: (n: number) => onChange({ type: "plan", plan: { ...draft.plan, goal: n } }) }
      : {
          value: draft.board.goal,
          max: draft.board.kind === "collect" ? (COLLECT_GOALS.at(-1) ?? 30) : fieldCount(draft.board, day),
          set: (n: number) => onChange({ type: "board", board: { ...draft.board, goal: n } }),
        };
  return (
    <EditDialog
      title={reward ? rewardLabel(reward) : t({ de: "Belohnung", en: "Reward", zh: "奖励", hi: "इनाम", es: "Premio", ar: "المكافأة", ru: "Награда" })}
      onClose={onClose}
    >
      <div className="rw-edit-row">
        {draft.type !== "board" || draft.board.kind !== "day" ? (
          <Counter
            emoji="⭐"
            wide
            label={t({
              de: "Sterne bis zur Belohnung",
              en: "Stars to the reward",
              zh: "得到奖励需要的星星",
              hi: "इनाम तक सितारे",
              es: "Estrellas hasta el premio",
              ar: "النجوم حتى المكافأة",
              ru: "Звёзд до награды",
            })}
            value={goal.value}
            min={1}
            max={Math.max(1, goal.max)}
            onChange={goal.set}
          />
        ) : null}
        {reward && (
          <button
            type="button"
            className="rw-edit-button"
            onClick={() => {
              set(null);
              onClose();
            }}
          >
            🗑️ {t({ de: "Ohne Belohnung", en: "No reward", zh: "不要奖励", hi: "बिना इनाम", es: "Sin premio", ar: "دون مكافأة", ru: "Без награды" })}
          </button>
        )}
      </div>
      <div className="rw-picks rw-picks-tiles">
        {REWARDS.map((item) => (
          <Pick
            key={item.id}
            selected={item.id === reward?.catalog}
            onClick={() => {
              set(rewardFromCatalog(item.id));
              onClose();
            }}
            emoji={<ItemPic item={{ emoji: item.emoji, catalog: item.id }} kind="reward" />}
            label={t(item.label)}
          />
        ))}
      </div>
    </EditDialog>
  );
}

/** A board's task tapped (or ＋): its times of day, removed, or swapped for another; or a new one. */
function TaskDialog({ board, taskId, onChange, onClose }: { board: Board; taskId?: string; onChange: (board: Board) => void; onClose: () => void }) {
  const t = useT();
  const taskLabel = useTaskLabel();
  const task = board.tasks.find((own) => own.id === taskId);
  const setTasks = (tasks: Board["tasks"]) => onChange({ ...board, tasks });
  return (
    <EditDialog
      title={
        task ? (
          <>
            <span className="rw-edit-dialog-pic" aria-hidden>
              <ItemPic item={task} />
            </span>{" "}
            {taskLabel(task)}
          </>
        ) : (
          t({ de: "Aufgabe dazu", en: "Add a task", zh: "添加任务", hi: "काम जोड़ें", es: "Añadir tarea", ar: "إضافة مهمة", ru: "Добавить задание" })
        )
      }
      onClose={onClose}
    >
      {task && (
        <div className="rw-edit-row">
          {board.kind !== "collect" && (
            <SlotChips task={task} onChange={(patch) => setTasks(board.tasks.map((own) => (own.id === task.id ? { ...own, ...patch } : own)))} />
          )}
          {(board.tasks.length > 1 || board.kind === "collect") && (
            <button
              type="button"
              className="rw-edit-button"
              onClick={() => {
                setTasks(board.tasks.filter((own) => own.id !== task.id));
                onClose();
              }}
            >
              🗑️ {t({ de: "Entfernen", en: "Remove", zh: "删除", hi: "हटाएँ", es: "Quitar", ar: "إزالة", ru: "Убрать" })}
            </button>
          )}
        </div>
      )}
      {task && (
        <h4 className="rw-edit-sub">
          {t({ de: "Tauschen gegen", en: "Swap for", zh: "换成", hi: "इससे बदलें", es: "Cambiar por", ar: "استبدال بـ", ru: "Заменить на" })}
        </h4>
      )}
      <div className="rw-picks rw-picks-tiles">
        {TASKS.map((item) => (
          <Pick
            key={item.id}
            selected={item.id === task?.catalog}
            disabled={!task && board.tasks.length >= MAX_TASKS}
            onClick={() => {
              const made = taskFromCatalog(item.id);
              setTasks(task ? board.tasks.map((own) => (own.id === task.id ? made : own)) : [...board.tasks, made]);
              onClose();
            }}
            emoji={<ItemPic item={{ emoji: item.emoji, catalog: item.id }} />}
            label={t(item.label)}
          />
        ))}
      </div>
    </EditDialog>
  );
}
