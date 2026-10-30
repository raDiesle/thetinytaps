import { useT } from "@/lib/language";
import { NO_LINKED } from "./board";
import { PLAN_TEMPLATES, PLAN_VIEWS, type PlanTemplate } from "./catalog";
import { exampleTicks, type Plan, planFromTemplate } from "./plan";
import { PLAN_SCREEN, PlanSheet } from "./PlanSheet";

/** Width / height of a small picture of a plan, as for boards. */
const THUMB_ASPECT = 1.45;

/** A plan as a small picture with its example ticks. */
export function PlanThumb({ plan, today = new Date() }: { plan: Plan; today?: Date }) {
  return (
    <span className="rw-thumb" aria-hidden>
      <PlanSheet plan={plan} ticks={exampleTicks(plan, today)} linked={NO_LINKED} today={today} look={PLAN_SCREEN} aspect={THUMB_ASPECT} />
    </span>
  );
}

/** The plans made once from each template, for the thumbnails. */
const PREVIEWS = new Map(PLAN_TEMPLATES.map((tpl) => [tpl.id, planFromTemplate(tpl)]));

/**
 * The Vorlagen of the Tagesplan: every ready-made plan as a small picture, its name, view and one line – beside the
 * plan on wide screens, and the second step of the wizard (with „Leer anfangen“ last).
 */
export function PlanGallery({ selected, onPick, blank }: { selected?: string; onPick: (template: PlanTemplate) => void; blank?: () => void }) {
  const t = useT();
  return (
    <ul className="rw-gallery">
      {PLAN_TEMPLATES.map((tpl) => {
        const view = PLAN_VIEWS.find((v) => v.id === tpl.view);
        const preview = PREVIEWS.get(tpl.id);
        return (
          <li key={tpl.id}>
            <button type="button" className={`rw-tpl${selected === tpl.id ? " selected" : ""}`} aria-pressed={selected === tpl.id} onClick={() => onPick(tpl)}>
              {preview && <PlanThumb plan={preview} />}
              <span className="rw-tpl-name">
                <span aria-hidden>{tpl.emoji}</span> {t(tpl.label)}
              </span>
              <span className="rw-tpl-hint">
                {view && (
                  <span className="rw-tpl-kind">
                    {view.emoji} {t(view.label)}
                  </span>
                )}{" "}
                {t(tpl.hint)}
              </span>
            </button>
          </li>
        );
      })}
      {blank && (
        <li>
          <button type="button" className="rw-tpl rw-tpl-blank" onClick={blank}>
            <span className="rw-thumb rw-thumb-blank" aria-hidden>
              ✏️
            </span>
            <span className="rw-tpl-name">
              {t({
                de: "Leer anfangen",
                en: "Start blank",
                zh: "从空白开始",
                hi: "खाली से शुरू करें",
                es: "Empezar en blanco",
                ar: "البدء من الصفر",
                ru: "Начать с чистого листа",
              })}
            </span>
            <span className="rw-tpl-hint">
              {t({
                de: "Alle Bilder selbst aussuchen",
                en: "Choose all the pictures yourself",
                zh: "所有图片自己挑选",
                hi: "सभी तस्वीरें खुद चुनें",
                es: "Elegir usted todas las imágenes",
                ar: "اختاروا كل الصور بأنفسكم",
                ru: "Выбрать все картинки самим",
              })}
            </span>
          </button>
        </li>
      )}
    </ul>
  );
}
