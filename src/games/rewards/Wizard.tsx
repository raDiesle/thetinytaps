import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { type Board, boardFromTemplate, newId, withKind } from "./board";
import {
  type BoardKind,
  CHART_TYPES,
  type ChartType,
  KINDS,
  PLAN_TEMPLATES,
  PLAN_VIEWS,
  type PlanTemplate,
  type PlanView,
  type Template,
  TEMPLATES,
} from "./catalog";
import { Thumb } from "./Gallery";
import { VIEW } from "./pageParts";
import { type Plan, planFromTemplate } from "./plan";
import { PlanThumb } from "./PlanGallery";
import { BOARD_STEPS, BoardStep } from "./WizardBoard";
import { PLAN_STEPS, PlanStepView } from "./WizardPlan";

/** What the wizard makes: a board or a plan, while it is being chosen. */
export type Draft = { type: "board"; board: Board } | { type: "plan"; plan: Plan };

/** Where the wizard starts: on a template picked in the gallery beside the board. */
export type WizardStart = { type: "board"; template: Template } | { type: "plan"; template: PlanTemplate };

/** A wizard step: its id and its name in the row of steps. */
export interface WizardStep {
  id: string;
  label: Localized;
}

/** The first step of every chart: every view of both kinds, with the Vorlagen of each view to pick, one or several. */
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
const BLANK = "leer";

/** A draft made from a template, with an id of its own (the template's board made before keeps its stars). */
const fromStart = (start: WizardStart, language: TargetLanguageId): Draft =>
  start.type === "board"
    ? { type: "board", board: { ...boardFromTemplate(start.template, language), id: newId() } }
    : { type: "plan", plan: planFromTemplate(start.template, language) };

/** Whether a draft can be made as it is: a board needs a task (a collecting board none), a plan a card. */
const ready = (draft: Draft) =>
  draft.type === "board" ? draft.board.tasks.length > 0 || draft.board.kind === "collect" : draft.plan.days.some((day) => day.length > 0);

/**
 * „＋ Neu“, for a Belohnungstafel and a Zeitplan alike. The first step is the whole choice of form, both kinds on one
 * page, each in an area of its own under its name: every view of the kind under its name in big letters – Tag, Woche,
 * … or Ablaufplan, Jetzt – Dann, Erst – Dann, Woche – with its Vorlagen as big pictures beneath. A tap picks a Vorlage,
 * another tap puts it back, so several (of both kinds) are made at once with „✓ Anlegen“. With one picked, „Weiter“
 * goes on to its own steps – a board's tasks, reward and look, a plan's cards and look – with the whole board or plan
 * beside each step. „Leer anfangen“ in a view goes there at once. The steps show only from the second one on; on a big
 * screen they are a column on the left, the two kinds under „Ansicht“ leading back to their areas. Opened on a template from the gallery it starts on that
 * template's own steps. Without `onCancel` (nothing made yet) it can't be closed: the page has nothing else to show.
 */
export function Wizard({
  type: startType,
  start,
  onDone,
  onCancel,
}: {
  /** The kind whose area comes first (the address or the chart shown). */
  type: ChartType;
  start?: WizardStart;
  onDone: (drafts: Draft[]) => void;
  onCancel?: () => void;
}) {
  const t = useT();
  const { id: language } = useAppLanguage();
  const first = start?.type ?? startType;
  const kinds = [...CHART_TYPES].sort((a, b) => Number(b.id === first) - Number(a.id === first));
  /** What is picked, by key, as the board or plan it makes (changed by the later steps where only one is picked). */
  const [picked, setPicked] = useState<Map<string, Draft>>(() =>
    start ? new Map([[start.type === "board" ? boardKey(start.template.id) : planKey(start.template.id), fromStart(start, language)]]) : new Map(),
  );
  const [step, setStep] = useState(start ? 1 : 0);
  /** The Vorlage seen big over the whole screen (🔍), by key. */
  const [zoomed, setZoomed] = useState<string>();
  const drafts = [...picked.values()];
  const [only] = drafts.length === 1 ? drafts : [];
  const steps = [FIRST_STEP, ...(only ? (only.type === "board" ? BOARD_STEPS : PLAN_STEPS) : [])];
  const id = steps[step]?.id ?? FIRST_STEP.id;
  const own = step > 0 && !!only;

  const toggle = (key: string, make: () => Draft) =>
    setPicked((before) => {
      const next = new Map([...before].filter(([k]) => !k.endsWith(BLANK)));
      if (before.has(key)) next.delete(key);
      else next.set(key, make());
      return next;
    });
  // „Leer anfangen“ is one chart of its own: it goes on to its steps at once, as there is nothing to see before.
  const blank = (key: string, draft: Draft) => {
    setPicked(new Map([[key, draft]]));
    setStep(1);
  };
  const change = (draft: Draft) => {
    const [key] = [...picked.keys()];
    setPicked(new Map([[key, draft]]));
  };

  // Back on the first step, the kind's area comes into sight: its views and Vorlagen.
  const showKind = (kind: ChartType) => {
    setStep(0);
    requestAnimationFrame(() => document.getElementById(`rw-area-${kind}`)?.scrollIntoView({ behavior: still() ? "auto" : "smooth", block: "start" }));
  };

  const groupsOf = (type: ChartType) =>
    type === "board"
      ? KINDS.map((kind) => ({
          id: kind.id,
          emoji: kind.emoji,
          label: kind.label,
          blank: { key: boardKey(`${kind.id}-${BLANK}`), make: (): Draft => ({ type: "board", board: blankBoard(kind.id) }) },
          tiles: TEMPLATES.filter((tpl) => tpl.kind === kind.id).map((tpl) => {
            const board = BOARD_PICTURES.get(tpl.id);
            return {
              key: boardKey(tpl.id),
              emoji: tpl.emoji,
              label: tpl.label,
              picture: board && <Thumb board={board} />,
              make: (): Draft => ({ type: "board", board: { ...boardFromTemplate(tpl, language), id: newId() } }),
            };
          }),
        }))
      : PLAN_VIEWS.map((view) => ({
          id: view.id,
          emoji: view.emoji,
          label: view.label,
          blank: { key: planKey(`${view.id}-${BLANK}`), make: (): Draft => ({ type: "plan", plan: blankPlan(view.id) }) },
          tiles: PLAN_TEMPLATES.filter((tpl) => tpl.view === view.id).map((tpl) => {
            const plan = PLAN_PICTURES.get(tpl.id);
            return {
              key: planKey(tpl.id),
              emoji: tpl.emoji,
              label: tpl.label,
              picture: plan && <PlanThumb plan={plan} />,
              make: (): Draft => ({ type: "plan", plan: planFromTemplate(tpl, language) }),
            };
          }),
        }));

  const groups = kinds.map((kind) => ({ kind, views: groupsOf(kind.id) }));
  const tiles = groups.flatMap(({ views }) => views.flatMap((view) => view.tiles));
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
                {/* Under „Ansicht“, on a big screen: the two kinds, each leading to its area, with how many are picked. */}
                {s.id === FIRST_STEP.id && (
                  <ul className="rw-step-kinds" aria-label={t({ de: "Art", en: "Type", zh: "类型", hi: "प्रकार", es: "Tipo", ar: "النوع", ru: "Тип" })}>
                    {kinds.map((kind) => {
                      const count = drafts.filter((d) => d.type === kind.id).length;
                      return (
                        <li key={kind.id}>
                          <button type="button" className={count ? "selected" : undefined} onClick={() => showKind(kind.id)}>
                            <span aria-hidden>{kind.emoji}</span> {t(kind.label)}
                            {count > 0 && <span className="rw-kind-count">{count}</span>}
                          </button>
                        </li>
                      );
                    })}
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
          {id === FIRST_STEP.id &&
            groups.map(({ kind, views }) => (
              <section key={kind.id} id={`rw-area-${kind.id}`} className="rw-kind-area" aria-label={t(kind.label)}>
                <h2 className="rw-kind-name">{t(kind.label)}</h2>
                <div className="rw-view-groups">
                  {views.map((group) => (
                    <section
                      key={group.id}
                      className="rw-view-group"
                      style={{ "--rw-tiles": Math.max(1, group.tiles.length), "--rw-span": Math.min(Math.max(1, group.tiles.length), 3) } as CSSProperties}
                    >
                      {/* The view's name stands big over its pictures, as the name of what they show. */}
                      <div className="rw-view-head">
                        <h3 className="rw-view-name">{t(group.label)}</h3>
                        {/* No picture of anything: a small button beside the view's name, not a tile among the Vorlagen. */}
                        <button type="button" className="rw-view-blank" onClick={() => blank(group.blank.key, group.blank.make())}>
                          <span aria-hidden>✏️</span> {t(START_BLANK)}
                        </button>
                      </div>
                      <ul className="rw-gallery rw-gallery-big">
                        {group.tiles.map((tile) => {
                          const selected = picked.has(tile.key);
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
                      </ul>
                    </section>
                  ))}
                </div>
              </section>
            ))}

          {only?.type === "board" && own && <BoardStep step={id} board={only.board} onChange={(board) => change({ type: "board", board })} />}
          {only?.type === "plan" && own && <PlanStepView step={id} plan={only.plan} onChange={(plan) => change({ type: "plan", plan })} />}
        </div>

        {only && own && <div className="rw-wizard-preview">{only.type === "board" ? <Thumb board={only.board} /> : <PlanThumb plan={only.plan} />}</div>}
      </div>

      {zoomAt >= 0 && (
        <Zoom
          label={t(tiles[zoomAt].label)}
          picture={tiles[zoomAt].picture}
          selected={picked.has(tiles[zoomAt].key)}
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
        {only && step < steps.length - 1 && (
          <button type="button" className="rw-wizard-next" onClick={() => setStep(step + 1)}>
            {t({ de: "Weiter", en: "Next", zh: "下一步", hi: "आगे", es: "Siguiente", ar: "التالي", ru: "Далее" })} ›
          </button>
        )}
        {drafts.length > 0 && (
          <button type="button" className="rw-wizard-done" disabled={!drafts.every(ready)} onClick={() => onDone(drafts)}>
            ✓{" "}
            {drafts.length > 1
              ? t({ de: (n: number) => `${n} anlegen` })(drafts.length)
              : step === steps.length - 1 && only
                ? only.type === "board"
                  ? t({
                      de: "Tafel anlegen",
                      en: "Create chart",
                      zh: "创建奖励表",
                      hi: "चार्ट बनाएँ",
                      es: "Crear tabla",
                      ar: "إنشاء اللوحة",
                      ru: "Создать таблицу",
                    })
                  : t({ de: "Plan anlegen", en: "Create plan", zh: "创建日程表", hi: "योजना बनाएँ", es: "Crear plan", ar: "إنشاء الخطة", ru: "Создать план" })
                : t({ de: "So nehmen", en: "Use as is", zh: "就这样用", hi: "ऐसे ही लें", es: "Usar así", ar: "استخدامها هكذا", ru: "Взять так" })}
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
 * home or ordered as photo prints, and several are picked and made at once, each then a tab of its own. Beside the
 * steps on a big screen and a phone, between the buttons at the foot elsewhere – only one of the two shows.
 */
function Help({ className }: { className: string }) {
  const t = useT();
  return (
    <p className={`rw-wizard-help ${className}`}>
      {t({
        de: "Nutzen Sie Tafeln und Pläne hier am Bildschirm, drucken Sie sie aus und basteln Sie sie selbst – oder bestellen Sie die Bilder als Fotoabzug. Tippen Sie ruhig mehrere Vorlagen an: Sie werden auf einmal angelegt und stehen danach oben als Reiter, zum Wechseln mit einem Tipp.",
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
