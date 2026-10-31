import { useState } from "react";
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
import { TemplateGallery, Thumb } from "./Gallery";
import { Pick, VIEW } from "./pageParts";
import { type Plan, planFromTemplate } from "./plan";
import { PlanGallery, PlanThumb } from "./PlanGallery";
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

/** The three steps every chart begins with – the kind, how it looks, a Vorlage of that look; the kind's own steps follow. */
const FIRST_STEPS: WizardStep[] = [
  { id: "type", label: { de: "Art", en: "Type", zh: "类型", hi: "प्रकार", es: "Tipo", ar: "النوع", ru: "Тип" } },
  { id: "view", label: VIEW },
  { id: "template", label: { de: "Vorlage", en: "Template", zh: "模板", hi: "टेम्पलेट", es: "Plantilla", ar: "القالب", ru: "Шаблон" } },
];

/** The step of the Vorlage: the kind's own steps come after it. */
const TEMPLATE_STEP = FIRST_STEPS.length - 1;

/** The view marked first for each kind: a week of stars, a plan of one day. */
const FIRST_VIEW: { board: BoardKind; plan: PlanView } = { board: "week", plan: "day" };

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

/** The first board and plan of the gallery, as the pictures of the first steps: what each kind and view looks like in use. */
const TYPE_PICTURES = { board: boardFromTemplate(TEMPLATES[0]), plan: planFromTemplate(PLAN_TEMPLATES[0]) };
/** That board in each view and that plan in each view, made once. */
const BOARD_VIEWS = new Map(KINDS.map((kind) => [kind.id, withKind(TYPE_PICTURES.board, kind.id)]));
const PLAN_VIEW_PICTURES = new Map(PLAN_VIEWS.map((view) => [view.id, { ...TYPE_PICTURES.plan, view: view.id }]));

/** A draft made from a template, with an id of its own (the template's board made before keeps its stars). */
const fromStart = (start: WizardStart, language: TargetLanguageId): Draft =>
  start.type === "board"
    ? { type: "board", board: { ...boardFromTemplate(start.template, language), id: newId() } }
    : { type: "plan", plan: planFromTemplate(start.template, language) };

/**
 * „＋ Neu“ step by step, for a Belohnungstafel and a Tagesplan alike: 1 the kind (two big pictures), 2 the view (Tag,
 * Woche, …, each as a big picture – how it looks, not what is on it), 3 a Vorlage of that view (or „Leer anfangen“,
 * first), then the kind's own steps – a board's tasks, reward and look, a plan's cards and look. Every choice shows
 * what it makes, and from step 4 the whole board or plan stands beside each step. „✓ So nehmen“ makes it from any step
 * after the Vorlage; everything can still be changed under „Gestalten“. Opened on a template from the gallery, it
 * starts on step 4. Without `onCancel` (nothing made yet) it can't be closed: the page has nothing else to show.
 */
export function Wizard({
  type: startType,
  start,
  onDone,
  onCancel,
}: {
  /** The kind marked on the first step (the address or the chart shown). */
  type: ChartType;
  start?: WizardStart;
  onDone: (draft: Draft) => void;
  onCancel?: () => void;
}) {
  const t = useT();
  const { id: language } = useAppLanguage();
  const [type, setType] = useState<ChartType>(start?.type ?? startType);
  const [draft, setDraft] = useState<Draft | null>(() => (start ? fromStart(start, language) : null));
  const [view, setView] = useState<BoardKind | PlanView>(() =>
    start ? (start.type === "board" ? start.template.kind : start.template.view) : FIRST_VIEW[type],
  );
  const [step, setStep] = useState(start ? TEMPLATE_STEP + 1 : 0);
  const steps = [...FIRST_STEPS, ...(type === "board" ? BOARD_STEPS : PLAN_STEPS)];
  const id = steps[step].id;

  const pickType = (next: ChartType) => {
    if (next !== type) {
      setDraft(null);
      setView(FIRST_VIEW[next]);
    }
    setType(next);
    setStep(1);
  };
  // Another view keeps what was chosen so far, as the switch above the chart does.
  const pickView = (next: BoardKind | PlanView) => {
    setView(next);
    if (draft?.type === "board") setDraft({ type: "board", board: withKind(draft.board, next as BoardKind) });
    if (draft?.type === "plan") setDraft({ type: "plan", plan: { ...draft.plan, view: next as PlanView } });
    setStep(TEMPLATE_STEP);
  };
  const pick = (made: Draft) => {
    setDraft(made);
    setStep(TEMPLATE_STEP + 1);
  };
  const ready = draft?.type === "board" ? draft.board.tasks.length > 0 || draft.board.kind === "collect" : !!draft?.plan.days.some((day) => day.length > 0);
  const own = step > TEMPLATE_STEP;

  return (
    <section
      className="rw-wizard"
      aria-label={t({ de: "Neu anlegen", en: "Create new", zh: "新建", hi: "नया बनाएँ", es: "Crear nuevo", ar: "إنشاء جديد", ru: "Создать" })}
    >
      <header className="rw-wizard-head">
        <ol className="rw-steps">
          {steps.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className={i === step ? "selected" : undefined}
                aria-current={i === step ? "step" : undefined}
                disabled={!draft && i > TEMPLATE_STEP}
                onClick={() => setStep(i)}
              >
                <span className="rw-step-number">{i + 1}</span> <span className="rw-step-label">{t(s.label)}</span>
              </button>
            </li>
          ))}
        </ol>
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
          {id === "type" && (
            <>
              <h2>
                {t({
                  de: "Was möchten Sie anlegen?",
                  en: "What would you like to create?",
                  zh: "您想创建什么？",
                  hi: "क्या बनाना है?",
                  es: "¿Qué desea crear?",
                  ar: "ماذا تريدون أن تنشئوا؟",
                  ru: "Что вы хотите создать?",
                })}
              </h2>
              <div className="rw-picks rw-picks-big">
                {CHART_TYPES.map((kind) => (
                  <Pick
                    key={kind.id}
                    selected={kind.id === type}
                    onClick={() => pickType(kind.id)}
                    picture={kind.id === "board" ? <Thumb board={TYPE_PICTURES.board} /> : <PlanThumb plan={TYPE_PICTURES.plan} />}
                    label={`${kind.emoji} ${t(kind.label)}`}
                  />
                ))}
              </div>
            </>
          )}

          {id === "view" && (
            <>
              <h2>
                {type === "board"
                  ? t({
                      de: "Wie lange geht die Tafel?",
                      en: "How long does the chart run?",
                      zh: "奖励表用多久？",
                      hi: "चार्ट कितने समय का हो?",
                      es: "¿Cuánto dura la tabla?",
                      ar: "ما مدة اللوحة؟",
                      ru: "На какой срок таблица?",
                    })
                  : t({
                      de: "Was soll der Plan zeigen?",
                      en: "What should the plan show?",
                      zh: "日程表要显示什么？",
                      hi: "योजना में क्या दिखे?",
                      es: "¿Qué debe mostrar el plan?",
                      ar: "ماذا تعرض الخطة؟",
                      ru: "Что показывать в плане?",
                    })}
              </h2>
              {type === "board" ? (
                <div className="rw-picks rw-picks-views">
                  {KINDS.map((kind) => {
                    const board = BOARD_VIEWS.get(kind.id);
                    return (
                      <Pick
                        key={kind.id}
                        selected={kind.id === view}
                        onClick={() => pickView(kind.id)}
                        picture={board && <Thumb board={board} />}
                        label={`${kind.emoji} ${t(kind.label)}`}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="rw-picks rw-picks-big">
                  {PLAN_VIEWS.map((planView) => {
                    const plan = PLAN_VIEW_PICTURES.get(planView.id);
                    return (
                      <Pick
                        key={planView.id}
                        selected={planView.id === view}
                        onClick={() => pickView(planView.id)}
                        picture={plan && <PlanThumb plan={plan} />}
                        label={`${planView.emoji} ${t(planView.label)}`}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}

          {id === "template" && (
            <>
              <h2>
                {t({
                  de: "Womit fangen wir an?",
                  en: "Where shall we start?",
                  zh: "从哪里开始？",
                  hi: "किससे शुरू करें?",
                  es: "¿Con qué empezamos?",
                  ar: "بماذا نبدأ؟",
                  ru: "С чего начнём?",
                })}
              </h2>
              {type === "board" ? (
                <TemplateGallery
                  kind={view as BoardKind}
                  selected={draft?.type === "board" ? draft.board.template : undefined}
                  onPick={(tpl) => pick({ type: "board", board: { ...boardFromTemplate(tpl, language), id: newId() } })}
                  blank={() => pick({ type: "board", board: blankBoard(view as BoardKind) })}
                />
              ) : (
                <PlanGallery
                  view={view as PlanView}
                  selected={draft?.type === "plan" ? draft.plan.template : undefined}
                  onPick={(tpl) => pick({ type: "plan", plan: planFromTemplate(tpl, language) })}
                  blank={() => pick({ type: "plan", plan: blankPlan(view as PlanView) })}
                />
              )}
            </>
          )}

          {draft?.type === "board" && own && <BoardStep step={id} board={draft.board} onChange={(board) => setDraft({ type: "board", board })} />}
          {draft?.type === "plan" && own && <PlanStepView step={id} plan={draft.plan} onChange={(plan) => setDraft({ type: "plan", plan })} />}
        </div>

        {draft && own && <div className="rw-wizard-preview">{draft.type === "board" ? <Thumb board={draft.board} /> : <PlanThumb plan={draft.plan} />}</div>}
      </div>

      <footer className="rw-wizard-foot">
        <button type="button" className="rw-wizard-back" disabled={step === 0} onClick={() => setStep(step - 1)}>
          ‹ {t({ de: "Zurück", en: "Back", zh: "上一步", hi: "पीछे", es: "Atrás", ar: "السابق", ru: "Назад" })}
        </button>
        {(step < TEMPLATE_STEP || (draft && own && step < steps.length - 1)) && (
          <button type="button" className="rw-wizard-next" onClick={() => (step === 0 ? pickType(type) : step === 1 ? pickView(view) : setStep(step + 1))}>
            {t({ de: "Weiter", en: "Next", zh: "下一步", hi: "आगे", es: "Siguiente", ar: "التالي", ru: "Далее" })} ›
          </button>
        )}
        {draft && own && (
          <button type="button" className="rw-wizard-done" disabled={!ready} onClick={() => onDone(draft)}>
            ✓{" "}
            {step === steps.length - 1
              ? type === "board"
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
