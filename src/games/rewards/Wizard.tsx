import { useState } from "react";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { useAppLanguage, useT } from "@/lib/language";
import { boardFromTemplate, newId } from "./board";
import type { PlanTemplate, Template } from "./catalog";
import { ChartEditor, type Draft, defaultDraft } from "./ChartEditor";
import { Editor } from "./Editor";
import { counting, planFromTemplate } from "./plan";
import { PlanEditor } from "./PlanEditor";

export type { Draft } from "./ChartEditor";

/** Where the wizard starts: on a template picked in the gallery beside the board. */
export type WizardStart = { type: "board"; template: Template } | { type: "plan"; template: PlanTemplate };

/** A draft made from a template, with an id of its own (the template's board made before keeps its stars). */
const fromStart = (start: WizardStart, language: TargetLanguageId): Draft =>
  start.type === "board"
    ? { type: "board", board: { ...boardFromTemplate(start.template, language), id: newId() } }
    : { type: "plan", plan: planFromTemplate(start.template, language) };

/** Whether a draft can be made as it is: a board needs a task (a collecting board none), a plan a card. */
const ready = (draft: Draft) =>
  draft.type === "board" ? draft.board.tasks.length > 0 || draft.board.kind === "collect" : draft.plan.days.some((day) => day.length > 0);

/**
 * „＋ Neu“, for a Belohnungstafel and a Zeitplan alike: the very chart that will be made, changed right on it with the
 * same `ChartEditor` as „Gestalten“ on the page (user decision, November 2026), so the wizard and the page look and work
 * the same. It starts on „Mein Tag“ – morning and evening on one sheet, three cards each, a star a card and a reward –
 * and its Zeitraum makes it a week, a month, an Erst – Dann or a path to collect on. „✓ Anlegen“ makes it. Opened on a
 * template from the gallery it starts on that template. Without `onCancel` (nothing made yet) it can't be closed: the
 * page has nothing else to show.
 */
export function Wizard({ start, onDone, onCancel }: { start?: WizardStart; onDone: (draft: Draft) => void; onCancel?: () => void }) {
  const t = useT();
  const { id: language } = useAppLanguage();
  const [draft, setDraft] = useState<Draft>(() => (start ? fromStart(start, language) : defaultDraft(language)));
  const reward = draft.type === "board" || counting(draft.plan);
  const done = reward
    ? t({ de: "Tafel anlegen", en: "Create chart", zh: "创建奖励表", hi: "चार्ट बनाएँ", es: "Crear tabla", ar: "إنشاء اللوحة", ru: "Создать таблицу" })
    : t({ de: "Plan anlegen", en: "Create plan", zh: "创建日程表", hi: "योजना बनाएँ", es: "Crear plan", ar: "إنشاء الخطة", ru: "Создать план" });
  return (
    <section
      className="rw-wizard"
      aria-label={t({ de: "Neu anlegen", en: "Create new", zh: "新建", hi: "नया बनाएँ", es: "Crear nuevo", ar: "إنشاء جديد", ru: "Создать" })}
    >
      {/* On top and in sight while the page scrolls (user feedback, November 2026): printing, and the one button that makes it. */}
      <header className="rw-wizard-head">
        <PrintBadge />
        <span className="rw-wizard-actions">
          {onCancel && (
            <button type="button" className="rw-wizard-back" onClick={onCancel}>
              {t({ de: "Abbrechen", en: "Cancel", zh: "取消", hi: "रद्द करें", es: "Cancelar", ar: "إلغاء", ru: "Отмена" })}
            </button>
          )}
          {ready(draft) && (
            <button type="button" className="rw-wizard-done" onClick={() => onDone(draft)}>
              <span aria-hidden>✓</span> {done}
            </button>
          )}
        </span>
      </header>
      <ChartEditor
        draft={draft}
        onChange={setDraft}
        making
        more={
          draft.type === "board" ? (
            <Editor board={draft.board} onChange={(patch) => setDraft({ type: "board", board: { ...draft.board, ...patch } })} />
          ) : (
            <PlanEditor plan={draft.plan} day={new Date()} onChange={(plan) => setDraft({ type: "plan", plan })} />
          )
        }
      />
    </section>
  );
}

/**
 * That the chart prints, said on the first page a visitor sees (user feedback, November 2026): on A4, as photo prints
 * for a Velcro board, or used right here on the screen. A stamp, not a button – there is nothing to print before it is made.
 */
function PrintBadge() {
  const t = useT();
  return (
    <p className="rw-print-badge">
      <span className="rw-print-badge-pic" aria-hidden>
        🖨️
      </span>
      <span>
        <strong>{t({ de: "Zum Ausdrucken" })}</strong>{" "}
        <span className="rw-print-badge-more">{t({ de: "auf A4 oder als Fotoabzug – oder hier am Bildschirm abhaken" })}</span>
      </span>
    </p>
  );
}
