import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { type Board, boardFromTemplate, newId, withKind } from "./board";
import { type BoardKind, KINDS, PLAN_TEMPLATES, PLAN_VIEWS, type PlanTemplate, type PlanView, type Template, TEMPLATES } from "./catalog";
import { Thumb } from "./Gallery";
import { VIEW } from "./pageParts";
import { type Plan, planFromTemplate } from "./plan";
import { PlanThumb } from "./PlanGallery";
import { BOARD_STEPS, BoardStep } from "./WizardBoard";
import { DayConfig, PLAN_STEPS, PlanStepView } from "./WizardPlan";

/** What the wizard makes: a board or a plan, while it is being chosen. */
export type Draft = { type: "board"; board: Board } | { type: "plan"; plan: Plan };

/** Where the wizard starts: on a template picked in the gallery beside the board. */
export type WizardStart = { type: "board"; template: Template } | { type: "plan"; template: PlanTemplate };

/** A wizard step: its id and its name in the row of steps. */
export interface WizardStep {
  id: string;
  label: Localized;
}

/** The first step of every chart: every time span, with the Vorlagen of each to pick one from. */
const FIRST_STEP: WizardStep = { id: "view", label: VIEW };

/** „Leer anfangen“: a board or plan of one view with nothing on it yet. */
const START_BLANK: Localized = {
  de: "Leer anfangen",
  en: "Start blank",
  zh: "从空白开始",
  hi: "खाली से शुरू करें",
  es: "Empezar en blanco",
  ar: "البدء من الصفر",
  ru: "Начать с чистого листа",
};

/** A board with nothing on it yet, for „Leer anfangen“, in the view chosen. */
function blankBoard(kind: BoardKind): Board {
  const board: Board = {
    id: newId(),
    kind: "week",
    childName: "",
    title: "",
    tasks: [],
    days: [0, 1, 2, 3, 4, 5, 6],
    goal: 5,
    reward: null,
    mark: "stern",
    theme: "sonne",
    examples: true,
  };
  return withKind(board, kind);
}

/** A plan with no cards yet, for „Leer anfangen“: the same every day, in the view chosen. */
function blankPlan(view: PlanView): Plan {
  return { id: newId(), view, childName: "", title: "", days: [[]], same: true, theme: "sonne", examples: true };
}

/** Every template as the board or plan it makes, once, for the pictures of the first step. */
const BOARD_PICTURES = new Map(TEMPLATES.map((tpl) => [tpl.id, boardFromTemplate(tpl)]));
const PLAN_PICTURES = new Map(PLAN_TEMPLATES.map((tpl) => [tpl.id, planFromTemplate(tpl)]));

/** What can be picked on the first step, by a key of its own: a template of either kind, or „Leer anfangen“ in a view. */
const boardKey = (id: string) => `board:${id}`;
const planKey = (id: string) => `plan:${id}`;

/** The one Vorlage of a Jetzt – Dann plan, „Mein Tag“: its form is chosen beside its picture (`DayConfig`). */
const DAY_TEMPLATE = PLAN_TEMPLATES.find((tpl) => tpl.view === "day");
const DAY_KEY = planKey(DAY_TEMPLATE?.id ?? "");

/**
 * The first step's areas, by the time a chart covers rather than by its kind (user feedback, November 2026): a day, a
 * week, a month, then Erst – Dann, seldom used, and Sammeln last, which counts stars whatever the day. Where both kinds
 * have a view of the span (Tag, Woche), „Belohnung“ switches between them: off (the default) the plan's Vorlagen, on the
 * board's, with stars and a reward. A span's id is the view's id of either kind, so a draft's span is its view.
 */
type SpanId = "day" | "week" | "month" | "first-then" | "collect";

interface Span {
  id: SpanId;
  label: Localized;
  /** The board's view in this span, if any. */
  board?: BoardKind;
  /** The plan's view in this span, if any. */
  plan?: PlanView;
}

const kindLabel = (id: BoardKind) => KINDS.find((kind) => kind.id === id)?.label ?? { de: id };
const planLabel = (id: PlanView) => PLAN_VIEWS.find((view) => view.id === id)?.label ?? { de: id };

/** The time spans of the first step, in their order on the page. */
export const SPANS: Span[] = [
  { id: "day", label: kindLabel("day"), board: "day", plan: "day" },
  { id: "week", label: kindLabel("week"), board: "week", plan: "week" },
  { id: "month", label: kindLabel("month"), board: "month" },
  { id: "first-then", label: planLabel("first-then"), plan: "first-then" },
  { id: "collect", label: kindLabel("collect"), board: "collect" },
];

/** The span a draft belongs to: its view, of either kind. */
const spanOf = (draft: Draft): SpanId => (draft.type === "board" ? draft.board.kind : draft.plan.view);

/** „Belohnung“: the switch in a span's head between a plan and a board with stars and a reward. */
const REWARD: Localized = { de: "Belohnung" };

/** The Vorlage picked and the board or plan it makes, changed by the later steps. */
interface Picked {
  key: string;
  draft: Draft;
}

/** A draft made from a template, with an id of its own (the template's board made before keeps its stars). */
const fromStart = (start: WizardStart, language: TargetLanguageId): Draft =>
  start.type === "board"
    ? { type: "board", board: { ...boardFromTemplate(start.template, language), id: newId() } }
    : { type: "plan", plan: planFromTemplate(start.template, language) };

/** Whether a draft can be made as it is: a board needs a task (a collecting board none), a plan a card. */
const ready = (draft: Draft) =>
  draft.type === "board" ? draft.board.tasks.length > 0 || draft.board.kind === "collect" : draft.plan.days.some((day) => day.length > 0);

/**
 * „＋ Neu“, for a Belohnungstafel and a Zeitplan alike. The first step is the whole choice of form, by time span (`SPANS`):
 * Tag, Woche, Monat, Erst – Dann, Sammeln, each its name over its Vorlagen as big pictures; in Tag and Woche the switch
 * „Belohnung“ (off by default) shows the board's Vorlagen instead of the plan's. The plan's day has one, „Mein Tag“, with
 * its form chosen beside it (`DayConfig`). A tap picks a Vorlage, another puts it back; one chart is made at a
 * time. „Weiter“ goes on to its own steps – a board's tasks, reward and look, a plan's cards and look – with the whole
 * board or plan beside each step, and only the last one makes it: every chart goes through every step (user feedback,
 * November 2026). „Leer anfangen“ in a span goes there at once. The steps show only from the second one on; on a big
 * screen they are a column on the left, the spans under „Ansicht“ leading back to theirs. Opened on a template from the gallery it starts on that
 * template's own steps. Without `onCancel` (nothing made yet) it can't be closed: the page has nothing else to show.
 */
export function Wizard({ start, onDone, onCancel }: { start?: WizardStart; onDone: (draft: Draft) => void; onCancel?: () => void }) {
  const t = useT();
  const { id: language } = useAppLanguage();
  /** „Belohnung“ per span that has both kinds: off by default, on where the wizard starts on a board's Vorlage. */
  const [reward, setReward] = useState<Partial<Record<SpanId, boolean>>>(() => (start?.type === "board" ? { [start.template.kind]: true } : {}));
  /** What is picked, by key, as the board or plan it makes (changed by the later steps). */
  const [picked, setPicked] = useState<Picked | null>(() =>
    start ? { key: start.type === "board" ? boardKey(start.template.id) : planKey(start.template.id), draft: fromStart(start, language) } : null,
  );
  /** „Mein Tag“ as its form is chosen beside it, kept while another Vorlage is picked. */
  const [dayPlan, setDayPlan] = useState<Plan>(() =>
    picked?.key === DAY_KEY && picked.draft.type === "plan" ? picked.draft.plan : planFromTemplate(DAY_TEMPLATE ?? PLAN_TEMPLATES[0], language),
  );
  const [step, setStep] = useState(start ? 1 : 0);
  /** The Vorlage seen big over the whole screen (🔍), by key. */
  const [zoomed, setZoomed] = useState<string>();
  const only = picked?.draft;
  const steps = [FIRST_STEP, ...(only ? (only.type === "board" ? BOARD_STEPS : PLAN_STEPS) : [])];
  const id = steps[step]?.id ?? FIRST_STEP.id;
  const own = step > 0 && !!only;
  const last = step === steps.length - 1;

  const toggle = (key: string, make: () => Draft) => setPicked((before) => (before?.key === key ? null : { key, draft: make() }));
  // „Leer anfangen“ is one chart of its own: it goes on to its steps at once, as there is nothing to see before.
  const blank = (key: string, draft: Draft) => {
    setPicked({ key, draft });
    setStep(1);
  };
  const change = (draft: Draft) => {
    if (!picked) return;
    setPicked({ key: picked.key, draft });
    if (picked.key === DAY_KEY && draft.type === "plan") setDayPlan(draft.plan);
  };
  /** A choice beside „Mein Tag“: it changes the plan and picks it. */
  const configure = (plan: Plan) => {
    setDayPlan(plan);
    setPicked({ key: DAY_KEY, draft: { type: "plan", plan } });
  };

  // Back on the first step, the span's Vorlagen come into sight.
  const showSpan = (span: SpanId) => {
    setStep(0);
    requestAnimationFrame(() => document.getElementById(`rw-span-${span}`)?.scrollIntoView({ behavior: still() ? "auto" : "smooth", block: "start" }));
  };

  // The switch shows the span's other kind: a Vorlage picked there is no longer seen, so it is put back.
  const switchReward = (span: Span) => {
    setReward((before) => ({ ...before, [span.id]: !before[span.id] }));
    if (only && spanOf(only) === span.id) setPicked(null);
  };

  /** A span's Vorlagen: the board's where it has no plan or „Belohnung“ is on, else the plan's (with the day's form). */
  const groupOf = (span: Span) => {
    const kind = span.board && (!span.plan || reward[span.id]) ? span.board : undefined;
    const switchable = !!span.board && !!span.plan;
    return kind
      ? {
          span,
          switchable,
          blank: { key: boardKey(`${kind}-leer`), make: (): Draft => ({ type: "board", board: blankBoard(kind) }) },
          config: undefined,
          tiles: TEMPLATES.filter((tpl) => tpl.kind === kind).map((tpl) => {
            const board = BOARD_PICTURES.get(tpl.id);
            return {
              key: boardKey(tpl.id),
              emoji: tpl.emoji,
              label: tpl.label,
              picture: board && <Thumb board={board} />,
              make: (): Draft => ({ type: "board", board: { ...boardFromTemplate(tpl, language), id: newId() } }),
            };
          }),
        }
      : groupOfPlan(span, span.plan ?? "day", switchable);
  };

  const groupOfPlan = (span: Span, view: PlanView, switchable: boolean) => ({
    span,
    switchable,
    blank: { key: planKey(`${view}-leer`), make: (): Draft => ({ type: "plan", plan: blankPlan(view) }) },
    config: view === "day" ? <DayConfig plan={dayPlan} onChange={configure} /> : undefined,
    tiles: PLAN_TEMPLATES.filter((tpl) => tpl.view === view).map((tpl) => {
      const day = planKey(tpl.id) === DAY_KEY;
      const plan = day ? dayPlan : PLAN_PICTURES.get(tpl.id);
      return {
        key: planKey(tpl.id),
        emoji: tpl.emoji,
        label: tpl.label,
        picture: plan && <PlanThumb plan={plan} />,
        make: (): Draft => ({ type: "plan", plan: day ? dayPlan : planFromTemplate(tpl, language) }),
      };
    }),
  });

  const groups = SPANS.map(groupOf);
  const tiles = groups.flatMap((group) => group.tiles);
  const zoomAt = tiles.findIndex((tile) => tile.key === zoomed);

  return (
    <section
      className={step === 0 ? "rw-wizard rw-wizard-start" : "rw-wizard"}
      aria-label={t({ de: "Neu anlegen", en: "Create new", zh: "新建", hi: "नया बनाएँ", es: "Crear nuevo", ar: "إنشاء جديد", ru: "Создать" })}
    >
      <header className="rw-wizard-head">
        {/* No steps on the first one: a lone „1 Ansicht“ over the pictures only confused (user feedback, October 2026).
            They show from the second step on, when there is a way through them. */}
        {step > 0 && (
          <ol className="rw-steps">
            {steps.map((s, i) => (
              <li key={s.id}>
                <button type="button" className={i === step ? "selected" : undefined} aria-current={i === step ? "step" : undefined} onClick={() => setStep(i)}>
                  <span className="rw-step-number">{i + 1}</span> <span className="rw-step-label">{t(s.label)}</span>
                </button>
                {/* Under „Ansicht“, on a big screen: the spans, each leading back to its Vorlagen, the one picked marked. */}
                {s.id === FIRST_STEP.id && (
                  <ul className="rw-step-kinds" aria-label={t({ de: "Zeitraum" })}>
                    {SPANS.map((span) => (
                      <li key={span.id}>
                        <button type="button" className={only && spanOf(only) === span.id ? "selected" : undefined} onClick={() => showSpan(span.id)}>
                          {t(span.label)}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}
        <Help className="rw-wizard-help-side" />
        {onCancel && (
          <button
            type="button"
            className="rw-wizard-close"
            aria-label={t({ de: "Abbrechen", en: "Cancel", zh: "取消", hi: "रद्द करें", es: "Cancelar", ar: "إلغاء", ru: "Отмена" })}
            onClick={onCancel}
          >
            ✕
          </button>
        )}
      </header>

      <div className={`rw-wizard-body${own ? "" : " rw-wizard-wide"}`}>
        <div className="rw-wizard-step">
          {id === FIRST_STEP.id && (
            <div className="rw-kind-area rw-spans">
              <div className="rw-view-groups">
                {groups.map((group) => {
                  const { span } = group;
                  const on = !!reward[span.id];
                  return (
                    <section
                      key={span.id}
                      id={`rw-span-${span.id}`}
                      className={`rw-view-group${group.config ? " rw-view-config" : ""}`}
                      // The form beside „Mein Tag“ takes the room of two pictures.
                      style={
                        {
                          "--rw-tiles": Math.max(1, group.tiles.length + (group.config ? 2 : 0)),
                          "--rw-span": Math.min(Math.max(1, group.tiles.length + (group.config ? 2 : 0)), 3),
                        } as CSSProperties
                      }
                    >
                      {/* The span's name over its pictures, the switch and „Leer anfangen“ small on the right. */}
                      <div className="rw-view-head">
                        <h3 className="rw-view-name">{t(span.label)}</h3>
                        {group.switchable && (
                          <button type="button" role="switch" aria-checked={on} className="rw-reward-switch" onClick={() => switchReward(span)}>
                            <span aria-hidden>🎁</span> {t(REWARD)}
                            <span className="rw-switch-track" aria-hidden />
                          </button>
                        )}
                        {/* No picture of anything: a small button beside the span's name, not a tile among the Vorlagen. */}
                        <button type="button" className="rw-view-blank" onClick={() => blank(group.blank.key, group.blank.make())}>
                          <span aria-hidden>✏️</span> {t(START_BLANK)}
                        </button>
                      </div>
                      <ul className="rw-gallery rw-gallery-big">
                        {group.tiles.map((tile) => {
                          const selected = picked?.key === tile.key;
                          return (
                            <li key={tile.key}>
                              <button
                                type="button"
                                className={`rw-tpl${selected ? " selected" : ""}`}
                                aria-pressed={selected}
                                onClick={() => toggle(tile.key, tile.make)}
                              >
                                {tile.picture}
                                <span className="rw-tpl-name">
                                  <span aria-hidden>{tile.emoji}</span> {t(tile.label)}
                                </span>
                                <span className="rw-tpl-check" aria-hidden>
                                  ✓
                                </span>
                              </button>
                              {/* Separate from the tile, so looking closer never picks or puts back. */}
                              <button
                                type="button"
                                className="rw-tpl-zoom"
                                aria-label={`${t(ZOOM)}: ${t(tile.label)}`}
                                title={t(ZOOM)}
                                onClick={() => setZoomed(tile.key)}
                              >
                                <span aria-hidden>🔍</span>
                              </button>
                            </li>
                          );
                        })}
                        {/* Beside its one picture, the form of a Jetzt – Dann: changing it changes the picture and picks it. */}
                        {group.config && <li className="rw-day-config-cell">{group.config}</li>}
                      </ul>
                    </section>
                  );
                })}
              </div>
            </div>
          )}

          {only?.type === "board" && own && <BoardStep step={id} board={only.board} onChange={(board) => change({ type: "board", board })} />}
          {only?.type === "plan" && own && <PlanStepView step={id} plan={only.plan} onChange={(plan) => change({ type: "plan", plan })} />}
        </div>

        {only && own && <div className="rw-wizard-preview">{only.type === "board" ? <Thumb board={only.board} /> : <PlanThumb plan={only.plan} />}</div>}
      </div>

      {zoomAt >= 0 && (
        <Zoom
          label={t(tiles[zoomAt].label)}
          picture={tiles[zoomAt].picture}
          selected={picked?.key === tiles[zoomAt].key}
          onToggle={() => toggle(tiles[zoomAt].key, tiles[zoomAt].make)}
          onStep={(by) => setZoomed(tiles[(zoomAt + by + tiles.length) % tiles.length].key)}
          onClose={() => setZoomed(undefined)}
        />
      )}

      <footer className="rw-wizard-foot">
        {/* Nothing to go back to on the first step: no greyed „Zurück“ there. */}
        {step > 0 && (
          <button type="button" className="rw-wizard-back" onClick={() => setStep(step - 1)}>
            ‹ {t({ de: "Zurück", en: "Back", zh: "上一步", hi: "पीछे", es: "Atrás", ar: "السابق", ru: "Назад" })}
          </button>
        )}
        <Help className="rw-wizard-help-foot" />
        {only && !last && (
          <button type="button" className="rw-wizard-next" onClick={() => setStep(step + 1)}>
            {t({ de: "Weiter", en: "Next", zh: "下一步", hi: "आगे", es: "Siguiente", ar: "التالي", ru: "Далее" })} ›
          </button>
        )}
        {/* Only on the last step: no way to skip the steps, every chart is made through all of them. */}
        {only && last && step > 0 && (
          <button type="button" className="rw-wizard-done" disabled={!ready(only)} onClick={() => onDone(only)}>
            ✓{" "}
            {only.type === "board"
              ? t({
                  de: "Tafel anlegen",
                  en: "Create chart",
                  zh: "创建奖励表",
                  hi: "चार्ट बनाएँ",
                  es: "Crear tabla",
                  ar: "إنشاء اللوحة",
                  ru: "Создать таблицу",
                })
              : t({ de: "Plan anlegen", en: "Create plan", zh: "创建日程表", hi: "योجना बनाएँ", es: "Crear plan", ar: "إنشاء الخطة", ru: "Создать план" })}
          </button>
        )}
      </footer>
    </section>
  );
}

/** Whether the grown-up asked for less motion: the jump to a kind's area is then instant. */
const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * What the wizard is for, on every step (user feedback, October 2026): the chart works on screen, printed to make at
 * home or ordered as photo prints, and it is made step by step, each chart then a tab of its own. Beside the steps on
 * a big screen and a phone, between the buttons at the foot elsewhere – only one of the two shows.
 */
function Help({ className }: { className: string }) {
  const t = useT();
  return (
    <p className={`rw-wizard-help ${className}`}>
      {t({
        de: "Nutzen Sie Tafeln und Pläne hier am Bildschirm, drucken Sie sie aus und basteln Sie sie selbst – oder bestellen Sie die Bilder als Fotoabzug. Wählen Sie eine Vorlage und gehen Sie Schritt für Schritt durch; jede Tafel und jeder Plan steht danach oben als Reiter, zum Wechseln mit einem Tipp.",
      })}
    </p>
  );
}

/** The 🔍 on every Vorlage, and its name read out. */
const ZOOM: Localized = { de: "Groß ansehen" };

/**
 * A Vorlage seen big, filling the screen (🔍): even on a big monitor the pictures in the rows are too small to read
 * (user feedback, October 2026). ‹ › and the arrow keys go through all Vorlagen of both kinds, and it can be picked or
 * put back from here; Esc, ✕ or a tap beside the picture close it. A modal `<dialog>` lies above everything, the
 * book's page and its transforms too.
 */
function Zoom({
  label,
  picture,
  selected,
  onToggle,
  onStep,
  onClose,
}: {
  label: string;
  picture: ReactNode;
  selected: boolean;
  onToggle: () => void;
  /** To the Vorlage before (-1) or after (1), round from the last to the first. */
  onStep: (by: number) => void;
  onClose: () => void;
}) {
  const t = useT();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);
  const back = t({ de: "Vorige Vorlage" });
  const next = t({ de: "Nächste Vorlage" });
  return (
    <dialog
      ref={ref}
      className="rw-zoom"
      aria-label={label}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && ref.current?.close()}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") onStep(event.key === "ArrowLeft" ? -1 : 1);
      }}
    >
      <div className="rw-zoom-head">
        <h3 className="rw-zoom-name">{label}</h3>
        <button type="button" className={`rw-zoom-pick${selected ? " selected" : ""}`} aria-pressed={selected} onClick={onToggle}>
          {selected ? `✓ ${t({ de: "Ausgewählt" })}` : t({ de: "Auswählen" })}
        </button>
        <button
          type="button"
          className="rw-zoom-close"
          aria-label={t({ de: "Schließen", ru: "Закрыть", en: "Close", zh: "关闭", hi: "बंद करें", es: "Cerrar", ar: "إغلاق" })}
          onClick={() => ref.current?.close()}
        >
          ✕
        </button>
      </div>
      <div className="rw-zoom-body">
        <button type="button" className="rw-zoom-step" aria-label={back} title={back} onClick={() => onStep(-1)}>
          ‹
        </button>
        <div className="rw-zoom-picture">{picture}</div>
        <button type="button" className="rw-zoom-step" aria-label={next} title={next} onClick={() => onStep(1)}>
          ›
        </button>
      </div>
    </dialog>
  );
}
