import { type CSSProperties, useState } from "react";
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

/** The first step of every chart: its kind and its view, with the Vorlagen of each view to pick, one or several. */
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
 * „＋ Neu“, for a Belohnungstafel and a Zeitplan alike. The first step is the whole choice of form: on top the kind
 * (Belohnungstafel or Zeitplan, plain words, no pictures), below it every view of that kind under its name in big
 * letters – Tag, Woche, … or Ablaufplan, Jetzt – Dann, Erst – Dann, Woche – with its Vorlagen as pictures beneath. A
 * tap picks a Vorlage, another tap puts it back, so several (of both kinds) are made at once with „✓ Anlegen“. With
 * one picked, „Weiter“ goes on to its own steps – a board's tasks, reward and look, a plan's cards and look – with the
 * whole board or plan beside each step. „Leer anfangen“ in a view goes there at once. Opened on a template from the
 * gallery it starts on that template's own steps. Without `onCancel` (nothing made yet) it can't be closed: the page
 * has nothing else to show.
 */
export function Wizard({
  type: startType,
  start,
  onDone,
  onCancel,
}: {
  /** The kind shown first (the address or the chart shown). */
  type: ChartType;
  start?: WizardStart;
  onDone: (drafts: Draft[]) => void;
  onCancel?: () => void;
}) {
  const t = useT();
  const { id: language } = useAppLanguage();
  const [type, setType] = useState<ChartType>(start?.type ?? startType);
  /** What is picked, by key, as the board or plan it makes (changed by the later steps where only one is picked). */
  const [picked, setPicked] = useState<Map<string, Draft>>(() =>
    start ? new Map([[start.type === "board" ? boardKey(start.template.id) : planKey(start.template.id), fromStart(start, language)]]) : new Map(),
  );
  const [step, setStep] = useState(start ? 1 : 0);
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

  const groups =
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

  return (
    <section
      className="rw-wizard"
      aria-label={t({ de: "Neu anlegen", en: "Create new", zh: "新建", hi: "नया बनाएँ", es: "Crear nuevo", ar: "إنشاء جديد", ru: "Создать" })}
    >
      <header className={`rw-wizard-head${id === FIRST_STEP.id ? " has-kinds" : ""}`}>
        <ol className="rw-steps">
          {(only ? steps : [FIRST_STEP]).map((s, i) => (
            <li key={s.id}>
              <button type="button" className={i === step ? "selected" : undefined} aria-current={i === step ? "step" : undefined} onClick={() => setStep(i)}>
                <span className="rw-step-number">{i + 1}</span> <span className="rw-step-label">{t(s.label)}</span>
              </button>
            </li>
          ))}
        </ol>
        {/* The kind: plain words, no pictures – the views below show what each makes. */}
        {id === FIRST_STEP.id && (
          <div className="rw-kinds" role="group" aria-label={t({ de: "Art", en: "Type", zh: "类型", hi: "प्रकार", es: "Tipo", ar: "النوع", ru: "Тип" })}>
            {CHART_TYPES.map((kind) => (
              <button
                key={kind.id}
                type="button"
                className={kind.id === type ? "selected" : undefined}
                aria-pressed={kind.id === type}
                onClick={() => setType(kind.id)}
              >
                <span aria-hidden>{kind.emoji}</span> {t(kind.label)}
                {drafts.some((d) => d.type === kind.id) && kind.id !== type && (
                  <span className="rw-kind-count">{drafts.filter((d) => d.type === kind.id).length}</span>
                )}
              </button>
            ))}
          </div>
        )}
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
            <>
              <div className="rw-view-groups">
                {groups.map((group) => (
                  <section key={group.id} className="rw-view-group" style={{ "--rw-tiles": Math.max(1, group.tiles.length) } as CSSProperties}>
                    {/* The view's name stands over its pictures, as the name of what they show. */}
                    <div className="rw-view-head">
                      <h2 className="rw-view-name">
                        <span aria-hidden>{group.emoji}</span> {t(group.label)}
                      </h2>
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
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            </>
          )}

          {only?.type === "board" && own && <BoardStep step={id} board={only.board} onChange={(board) => change({ type: "board", board })} />}
          {only?.type === "plan" && own && <PlanStepView step={id} plan={only.plan} onChange={(plan) => change({ type: "plan", plan })} />}
        </div>

        {only && own && <div className="rw-wizard-preview">{only.type === "board" ? <Thumb board={only.board} /> : <PlanThumb plan={only.plan} />}</div>}
      </div>

      <footer className="rw-wizard-foot">
        <button type="button" className="rw-wizard-back" disabled={step === 0} onClick={() => setStep(step - 1)}>
          ‹ {t({ de: "Zurück", en: "Back", zh: "上一步", hi: "पीछे", es: "Atrás", ar: "السابق", ru: "Назад" })}
        </button>
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
