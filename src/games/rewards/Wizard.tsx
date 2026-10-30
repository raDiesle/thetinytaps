import { useState } from "react";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { type Board, boardFromTemplate, newId } from "./board";
import { CHART_TYPES, type ChartType, PLAN_TEMPLATES, type PlanTemplate, type Template, TEMPLATES } from "./catalog";
import { TemplateGallery, Thumb } from "./Gallery";
import { Pick } from "./pageParts";
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

/** The two steps every chart begins with; the type's own steps follow. */
const FIRST_STEPS: WizardStep[] = [
  { id: "type", label: { de: "Art", en: "Type", zh: "类型", hi: "प्रकार", es: "Tipo", ar: "النوع", ru: "Тип" } },
  { id: "template", label: { de: "Vorlage", en: "Template", zh: "模板", hi: "टेम्पलेट", es: "Plantilla", ar: "القالب", ru: "Шаблон" } },
];

/** A board with nothing on it yet, for „Leer anfangen“. */
function blankBoard(): Board {
  return {
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
}

/** A plan with no cards yet, for „Leer anfangen“: a day, the same every day. */
function blankPlan(): Plan {
  return { id: newId(), view: "day", childName: "", title: "", days: [[]], same: true, theme: "sonne", examples: true };
}

/** The first board and plan of the gallery, as the pictures of the first step: what each kind looks like in use. */
const TYPE_PICTURES = { board: boardFromTemplate(TEMPLATES[0]), plan: planFromTemplate(PLAN_TEMPLATES[0]) };

/** A draft made from a template, with an id of its own (the template's board made before keeps its stars). */
const fromStart = (start: WizardStart, language: TargetLanguageId): Draft =>
  start.type === "board"
    ? { type: "board", board: { ...boardFromTemplate(start.template, language), id: newId() } }
    : { type: "plan", plan: planFromTemplate(start.template, language) };

/**
 * „＋ Neu“ step by step, for a Belohnungstafel and a Tagesplan alike: 1 the kind (two big pictures), 2 a Vorlage (or
 * „Leer anfangen“), then the kind's own steps – a board's view, tasks, reward and look, a plan's view, cards and look.
 * Every choice shows what it makes (a small picture of the board or plan as it would be, or a big picture card), and
 * the whole board or plan stands beside each step. „✓ So nehmen“ makes it from any step after the Vorlage;
 * everything can still be changed under „Gestalten“. Opened on a template from the gallery, it starts on step 3.
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
  onCancel: () => void;
}) {
  const t = useT();
  const { id: language } = useAppLanguage();
  const [type, setType] = useState<ChartType>(start?.type ?? startType);
  const [draft, setDraft] = useState<Draft | null>(() => (start ? fromStart(start, language) : null));
  const [step, setStep] = useState(start ? 2 : 0);
  const steps = [...FIRST_STEPS, ...(type === "board" ? BOARD_STEPS : PLAN_STEPS)];
  const id = steps[step].id;

  const pickType = (next: ChartType) => {
    if (next !== type) setDraft(null);
    setType(next);
    setStep(1);
  };
  const pick = (made: Draft) => {
    setDraft(made);
    setStep(2);
  };
  const ready = draft?.type === "board" ? draft.board.tasks.length > 0 || draft.board.kind === "collect" : !!draft?.plan.days.some((day) => day.length > 0);

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
                disabled={!draft && i > 1}
                onClick={() => setStep(i)}
              >
                <span className="rw-step-number">{i + 1}</span> <span className="rw-step-label">{t(s.label)}</span>
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="rw-wizard-close"
          aria-label={t({ de: "Abbrechen", en: "Cancel", zh: "取消", hi: "रद्द करें", es: "Cancelar", ar: "إلغاء", ru: "Отмена" })}
          onClick={onCancel}
        >
          ✕
        </button>
      </header>

      <div className={`rw-wizard-body${step < 2 ? " rw-wizard-wide" : ""}`}>
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
              <div className="rw-picks rw-picks-type">
                {CHART_TYPES.map((kind) => (
                  <Pick
                    key={kind.id}
                    selected={kind.id === type}
                    onClick={() => pickType(kind.id)}
                    picture={kind.id === "board" ? <Thumb board={TYPE_PICTURES.board} /> : <PlanThumb plan={TYPE_PICTURES.plan} />}
                    label={`${kind.emoji} ${t(kind.label)}`}
                    hint={t(kind.hint)}
                  />
                ))}
              </div>
              <p className="setting-note">
                {t({
                  de: "Beides geht auch zusammen: eine Tafel für die Sterne und ein Plan für den Tag. Sie finden sie danach oben nebeneinander.",
                  en: "You can also have both: a chart for the stars and a plan for the day. You will then find them side by side at the top.",
                  zh: "两者也可以一起用：一张奖励表收集星星，一份日程表安排一天。之后它们会并排显示在上方。",
                  hi: "दोनों साथ भी चल सकते हैं: सितारों के लिए एक चार्ट और दिन के लिए एक योजना। बाद में ये ऊपर साथ-साथ दिखेंगे।",
                  es: "También puede tener las dos: una tabla para las estrellas y un plan para el día. Después las encontrará una al lado de la otra, arriba.",
                  ar: "يمكن الجمع بين الاثنين: لوحة للنجوم وخطة لليوم. ستجدونهما بعد ذلك جنبًا إلى جنب في الأعلى.",
                  ru: "Можно и то и другое: таблицу для звёзд и план на день. Потом они будут рядом наверху.",
                })}
              </p>
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
              <p className="setting-note">
                {t({
                  de: "Eine Vorlage antippen – danach lässt sich alles ändern.",
                  en: "Tap a template – you can change everything afterwards.",
                  zh: "点选一个模板——之后一切都可以修改。",
                  hi: "कोई टेम्पलेट चुनें – बाद में सब कुछ बदला जा सकता है।",
                  es: "Toque una plantilla; después se puede cambiar todo.",
                  ar: "انقروا على قالب – يمكن تغيير كل شيء لاحقًا.",
                  ru: "Выберите шаблон – потом всё можно изменить.",
                })}
              </p>
              {type === "board" ? (
                <TemplateGallery
                  selected={draft?.type === "board" ? draft.board.template : undefined}
                  onPick={(tpl) => pick({ type: "board", board: { ...boardFromTemplate(tpl, language), id: newId() } })}
                  blank={() => pick({ type: "board", board: blankBoard() })}
                />
              ) : (
                <PlanGallery
                  selected={draft?.type === "plan" ? draft.plan.template : undefined}
                  onPick={(tpl) => pick({ type: "plan", plan: planFromTemplate(tpl, language) })}
                  blank={() => pick({ type: "plan", plan: blankPlan() })}
                />
              )}
            </>
          )}

          {draft?.type === "board" && step > 1 && <BoardStep step={id} board={draft.board} onChange={(board) => setDraft({ type: "board", board })} />}
          {draft?.type === "plan" && step > 1 && <PlanStepView step={id} plan={draft.plan} onChange={(plan) => setDraft({ type: "plan", plan })} />}
        </div>

        {draft && step > 1 && (
          <div className="rw-wizard-preview">{draft.type === "board" ? <Thumb board={draft.board} /> : <PlanThumb plan={draft.plan} />}</div>
        )}
      </div>

      <footer className="rw-wizard-foot">
        <button type="button" className="rw-wizard-back" disabled={step === 0} onClick={() => setStep(step - 1)}>
          ‹ {t({ de: "Zurück", en: "Back", zh: "上一步", hi: "पीछे", es: "Atrás", ar: "السابق", ru: "Назад" })}
        </button>
        {(step === 0 || (draft && step > 1 && step < steps.length - 1)) && (
          <button type="button" className="rw-wizard-next" onClick={() => (step === 0 ? pickType(type) : setStep(step + 1))}>
            {t({ de: "Weiter", en: "Next", zh: "下一步", hi: "आगे", es: "Siguiente", ar: "التالي", ru: "Далее" })} ›
          </button>
        )}
        {draft && step > 1 && (
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
