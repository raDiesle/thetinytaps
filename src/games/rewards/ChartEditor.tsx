import { type ReactNode, useEffect, useRef, useState } from "react";
import type { TargetLanguageId } from "@/content/targetLanguages";
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
  type ChartType,
  DAY_NAMES,
  KINDS,
  NOW_WAYS,
  PLAN_TEMPLATES,
  PLAN_VIEWS,
  type PlanView,
  REWARDS,
  SLOT_BY_ID,
  type Slot,
  TASKS,
  TEMPLATES,
  THEMES,
} from "./catalog";
import { SlotChips } from "./Editor";
import { CHILD_NAME, Pick } from "./pageParts";
import { ItemPic } from "./pictures";
import {
  allStars,
  counterOf,
  counting,
  DAY_PARTS,
  DAY_SHAPES,
  defaultReward,
  exampleTicks,
  MAX_STARS,
  type Plan,
  type PlanStep,
  partFloor,
  partRoom,
  planFromTemplate,
  planGoal,
  shapeOf,
  starsOf,
  stepFromCatalog,
  stepLimit,
  stepsOn,
  withCounter,
  withSame,
  withShape,
  withStepStars,
  withSteps,
} from "./plan";
import { PaperArrow, PLAN_SCREEN, PlanSheet, useStepLabel } from "./PlanSheet";

/** A chart while it is made or changed: a board or a plan. */
export type Draft = { type: "board"; board: Board } | { type: "plan"; plan: Plan };

/** The time a chart covers, by the id of its view of either kind. */
export type SpanId = "day" | "week" | "month" | "first-then" | "collect";

/** A time span of the „Zeitraum“ switch, and the kind of chart and view it makes in the wizard. */
interface Span {
  id: SpanId;
  label: Localized;
  type: ChartType;
}

const kindLabel = (id: BoardKind) => KINDS.find((kind) => kind.id === id)?.label ?? { de: id };
const planLabel = (id: PlanView) => PLAN_VIEWS.find((view) => view.id === id)?.label ?? { de: id };

/**
 * „Zeitraum“ in the wizard, by the time a chart covers (user feedback, November 2026): a day, a week, a month, then
 * Erst – Dann, seldom used, and Sammeln last, which counts stars whatever the day. Tag, Woche and Erst – Dann are plans
 * (with a Zähler, a Belohnungstafel), Monat and Sammeln boards.
 */
export const SPANS: Span[] = [
  { id: "day", label: kindLabel("day"), type: "plan" },
  { id: "week", label: kindLabel("week"), type: "plan" },
  { id: "month", label: kindLabel("month"), type: "board" },
  { id: "first-then", label: planLabel("first-then"), type: "plan" },
  { id: "collect", label: kindLabel("collect"), type: "board" },
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
    const stars = from.type === "plan" ? counterOf(from.plan) : 1;
    const plan = withCounter({ ...planFromTemplate(template, language), childName, theme }, stars);
    return { type: "plan", plan: { ...plan, reward } };
  }
  const template = TEMPLATES.find((tpl) => tpl.kind === span.id) ?? TEMPLATES[0];
  return { type: "board", board: { ...boardFromTemplate(template, language), id: newId(), childName, theme, reward } };
}

/** Cards a plan offers: the day's activities first, then the tasks of the Belohnungstafel. */
const OFFERED = [...ACTIVITIES, ...TASKS];

/** What a tap on the sheet opened: a card, a place to add one, the reward, or a board's task. */
type Editing =
  | { what: "card"; key: string }
  | { what: "add"; part?: Slot; day?: string }
  | { what: "reward" }
  | { what: "task"; id: string }
  | { what: "add-task" };

/** „Belohnung“: the one switch for the whole chart. */
const REWARD: Localized = { de: "Belohnung" };
/** „Zähler“: how many stars each card gets a day; 0 is a plain plan with the paper arrow. */
const COUNTER: Localized = { de: "Zähler" };
/** „Anzahl Karten“: the cards of each part of the day. */
const HOW_MANY: Localized = { de: "Anzahl Karten" };
/** „Zeitraum“: what time the chart covers. */
const SPAN: Localized = { de: "Zeitraum" };

/**
 * A chart as it will look, changed right on it – the same in the wizard and under „Gestalten“ (user decision,
 * November 2026: „exakt gleiche Seite für Assistent und Seite“). On top a row of quiet, compact options: the Zeitraum
 * (in the wizard any span, a new chart from its Vorlage; on the page only views of the same kind, its cards kept), the
 * Zähler (stars a card, 0 the plain plan with the paper arrow), one „Belohnung“ switch for the whole chart, the day's
 * shape and number of cards, what moves where nothing counts, the colours and the child's name. Below the sheet
 * itself in edit mode: a tap on a card swaps it, sets its stars for a day, moves or removes it; ＋ adds one; ✕ takes a
 * line of the day away; the reward is swapped, removed (the stars stay) or its goal set. `more` holds the rest
 * („Weitere Einstellungen“: own words, own emoji, weekdays).
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
    const { edit, part, day: dayId, task, step } = el.dataset;
    if (draft.type === "plan" && edit === "row" && part) {
      const plan = draft.plan;
      onChange({
        type: "plan",
        plan: withSteps(
          plan,
          weekday(day),
          stepsOn(plan, day).filter((s) => s.part !== part),
        ),
      });
    } else if (edit === "add") setEditing(draft.type === "board" ? { what: "add-task" } : { what: "add", part: part as Slot | undefined, day: dayId });
    else if (edit === "reward") setEditing({ what: "reward" });
    else if (edit === "task" && task) setEditing({ what: "task", id: task });
    else if (step) setEditing({ what: "card", key: step });
  };

  const spans = making
    ? SPANS
    : draft.type === "plan"
      ? SPANS.filter((span) => span.type === "plan")
      : KINDS.map((kind): Span => ({ id: kind.id, label: kind.label, type: "board" }));
  const pickSpan = (span: Span) => {
    if (span.id === spanOf(draft)) return;
    if (making) onChange(draftInSpan(span, draft, language));
    else if (draft.type === "plan") onChange({ type: "plan", plan: { ...draft.plan, view: span.id as PlanView } });
    else onChange({ type: "board", board: withKind(draft.board, span.id as BoardKind) });
  };

  const reward = rewardOf(draft);
  const plan = draft.type === "plan" ? draft.plan : undefined;
  const counts = plan ? counting(plan) : true;
  const setReward = (next: BoardReward | null) =>
    onChange(draft.type === "board" ? { type: "board", board: { ...draft.board, reward: next } } : { type: "plan", plan: { ...draft.plan, reward: next } });
  const setPlan = (next: Plan) => onChange({ type: "plan", plan: next });
  /** A new Zähler for every card; from 0 up, a plan that never had a reward gets the default one (Belohnung is on by default). */
  const setCounter = (stars: number) =>
    plan && setPlan({ ...withCounter(plan, stars), reward: plan.reward === undefined && stars > 0 ? defaultReward() : plan.reward });
  const shape = plan ? shapeOf(stepsOn(plan, day)) : undefined;
  const ticks = draft.type === "plan" ? log?.[draft.plan.id] : log?.[draft.board.id];

  return (
    <div className="rw-chart-editor">
      <div className="rw-options">
        <Segments
          label={t(SPAN)}
          items={spans.map((span) => ({ id: span.id, label: t(span.label) }))}
          selected={spanOf(draft)}
          onPick={(id) => pickSpan(spans.find((span) => span.id === id) ?? spans[0])}
        />
        {plan && <Counter emoji="⭐" label={t(COUNTER)} value={counterOf(plan)} min={0} max={MAX_STARS} onChange={setCounter} />}
        {counts && (
          <button
            type="button"
            role="switch"
            aria-checked={!!reward}
            className="rw-reward-switch"
            onClick={() => setReward(reward ? null : draft.type === "board" ? rewardFromCatalog(REWARDS[0].id) : defaultReward())}
          >
            <span aria-hidden>🎁</span> {t(REWARD)}
            <span className="rw-switch-track" aria-hidden />
          </button>
        )}
        {plan?.view === "day" && shape && (
          <>
            <Segments
              label={t({ de: "Tag aufteilen?" })}
              items={[
                { id: "split", label: `☀️🌙 ${t({ de: "Morgens und abends" })}` },
                { id: "whole", label: `🌈 ${t({ de: "Am Stück" })}` },
              ]}
              selected={shape.split ? "split" : "whole"}
              onPick={(id) => setPlan(withShape(plan, id === "split" ? DAY_SHAPES.split : DAY_SHAPES.whole))}
            />
            <span className="rw-opt-group" role="group" aria-label={t(HOW_MANY)}>
              <span className="rw-opt-name">{t(HOW_MANY)}</span>
              {shape.counts.map((count, i) => {
                const slot = shape.split ? SLOT_BY_ID.get(DAY_PARTS[i]) : undefined;
                return (
                  <Counter
                    key={slot?.id ?? "whole"}
                    emoji={slot?.emoji}
                    label={slot ? t(slot.label) : t(HOW_MANY)}
                    value={count}
                    min={partFloor(shape, i)}
                    max={partRoom(shape, i)}
                    onChange={(n) => setPlan(withShape(plan, { ...shape, counts: shape.counts.map((c, j) => (j === i ? n : c)) }))}
                  />
                );
              })}
            </span>
          </>
        )}
        {/* Only where nothing counts: with star fields the stars show what is done, and nothing moves. */}
        {plan?.view === "day" && !counts && (
          <span className="rw-opt-segments" role="group" aria-label={t({ de: "Was wandert?" })}>
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
        <span className="rw-opt-group rw-swatches" role="group" aria-label={t({ de: "Farben" })}>
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
          placeholder={`👧 ${t({ de: "Name des Kindes" })}`}
          onChange={(e) =>
            onChange(
              draft.type === "board"
                ? { type: "board", board: { ...draft.board, childName: e.target.value } }
                : { type: "plan", plan: { ...draft.plan, childName: e.target.value } },
            )
          }
        />
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
          <summary>{t({ de: "Weitere Einstellungen" })}</summary>
          {more}
        </details>
      )}

      {editing && plan && editing.what === "card" && <CardDialog plan={plan} cellKey={editing.key} onChange={setPlan} onClose={() => setEditing(null)} />}
      {editing && plan && editing.what === "add" && (
        <AddDialog
          plan={plan}
          day={editing.day ? parseCellKey(`${editing.day}|x`).day : day}
          part={editing.part}
          onChange={setPlan}
          onClose={() => setEditing(null)}
        />
      )}
      {editing && editing.what === "reward" && <RewardDialog draft={draft} day={day} onChange={onChange} onClose={() => setEditing(null)} />}
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
      <button type="button" disabled={value <= min} aria-label={t({ de: "Weniger" })} onClick={() => onChange(value - 1)}>
        −
      </button>
      <span className="rw-opt-number">{value}</span>
      <button type="button" disabled={value >= max} aria-label={t({ de: "Mehr" })} onClick={() => onChange(value + 1)}>
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
function CardDialog({ plan, cellKey, onChange, onClose }: { plan: Plan; cellKey: string; onChange: (plan: Plan) => void; onClose: () => void }) {
  const t = useT();
  const stepLabel = useStepLabel();
  const { day, taskId } = parseCellKey(cellKey);
  const steps = stepsOn(plan, day);
  const index = steps.findIndex((s) => s.id === taskId);
  const step = steps[index];
  const weekdayName = t(DAY_NAMES)[weekday(day)];
  // In the week a card is that day's; on a day's plan alike every day the stars are every day's, or only this weekday's.
  const [onlyToday, setOnlyToday] = useState(plan.view === "week" || !plan.same);
  if (!step) return null;
  const setSteps = (next: PlanStep[]) => onChange(withDay(plan, day, next));
  const move = (by: number) => {
    const next = [...steps];
    next.splice(index, 1);
    next.splice(index + by, 0, step);
    setSteps(next);
  };
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
          label={t({ de: "Sterne" })}
          value={starsOf(step)}
          min={0}
          max={MAX_STARS}
          onChange={(n) => onChange(withStepStars(plan, onlyToday ? weekday(day) : null, step.id, n))}
        />
        {plan.view !== "week" && (
          <Segments
            label={t({ de: "Für welche Tage?" })}
            items={[
              { id: "all", label: t({ de: "Jeden Tag" }) },
              { id: "one", label: `${t({ de: "Nur" })} ${weekdayName}` },
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
            setSteps(steps.filter((s) => s.id !== step.id));
            onClose();
          }}
        >
          🗑️ {t({ de: "Entfernen" })}
        </button>
      </div>
      <h4 className="rw-edit-sub">{t({ de: "Tauschen gegen" })}</h4>
      <CardPicks
        selected={step.catalog}
        onPick={(id) => {
          setSteps(steps.map((s) => (s.id === step.id ? cardIn(id, s.part, starsOf(s)) : s)));
          onClose();
        }}
      />
    </EditDialog>
  );
}

/** ＋ tapped: a card for that part of the day (or that day of the week), at its end. */
function AddDialog({ plan, day, part, onChange, onClose }: { plan: Plan; day: Date; part?: Slot; onChange: (plan: Plan) => void; onClose: () => void }) {
  const t = useT();
  const steps = stepsOn(plan, day);
  const add = (id: string) => {
    const card = cardIn(id, part, counterOf(plan));
    // After the part's last card; a morning that was taken away comes back before the evening.
    const last = steps.findLastIndex((s) => s.part === part);
    const at = last >= 0 ? last + 1 : part === "morning" ? 0 : steps.length;
    onChange(withDay(plan, day, [...steps.slice(0, at), card, ...steps.slice(at)]));
    onClose();
  };
  return (
    <EditDialog
      title={t({ de: "Karte dazu", en: "Add a card", zh: "添加卡片", hi: "कार्ड जोड़ें", es: "Añadir tarjeta", ar: "إضافة بطاقة", ru: "Добавить карточку" })}
      onClose={onClose}
    >
      {steps.length >= stepLimit(steps) ? <p className="setting-note">{t({ de: "Mehr Karten passen nicht auf den Plan." })}</p> : <CardPicks onPick={add} />}
    </EditDialog>
  );
}

/** Every card to pick, as big pictures. */
function CardPicks({ selected, onPick }: { selected?: string; onPick: (id: string) => void }) {
  const t = useT();
  return (
    <div className="rw-picks rw-picks-tiles">
      {OFFERED.map((item) => (
        <Pick
          key={item.id}
          selected={item.id === selected}
          onClick={() => onPick(item.id)}
          emoji={<ItemPic item={{ emoji: item.emoji, catalog: item.id }} />}
          label={t(item.label)}
        />
      ))}
    </div>
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
    <EditDialog title={reward ? rewardLabel(reward) : t({ de: "Belohnung" })} onClose={onClose}>
      <div className="rw-edit-row">
        {draft.type !== "board" || draft.board.kind !== "day" ? (
          <Counter emoji="⭐" wide label={t({ de: "Sterne bis zur Belohnung" })} value={goal.value} min={1} max={Math.max(1, goal.max)} onChange={goal.set} />
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
            🗑️ {t({ de: "Ohne Belohnung" })}
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
          t({ de: "Aufgabe dazu" })
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
              🗑️ {t({ de: "Entfernen" })}
            </button>
          )}
        </div>
      )}
      {task && <h4 className="rw-edit-sub">{t({ de: "Tauschen gegen" })}</h4>}
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
