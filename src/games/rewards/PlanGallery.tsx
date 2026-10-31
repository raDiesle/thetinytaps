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
 * The Vorlagen of the Zeitplan: every ready-made plan as a small picture, its name and one line, beside the plan on
 * wide screens – grouped by view, with the view's name over its group, as for boards.
 */
export function PlanGallery({ selected, onPick }: { selected?: string; onPick: (template: PlanTemplate) => void }) {
  const t = useT();
  return (
    <div className="rw-gallery-groups">
      {PLAN_VIEWS.map((view) => {
        const templates = PLAN_TEMPLATES.filter((tpl) => tpl.view === view.id);
        return (
          templates.length > 0 && (
            <section key={view.id} className="rw-gallery-group">
              <h3 className="rw-gallery-view">{t(view.label)}</h3>
              <ul className="rw-gallery">
                {templates.map((tpl) => {
                  const preview = PREVIEWS.get(tpl.id);
                  return (
                    <li key={tpl.id}>
                      <button
                        type="button"
                        className={`rw-tpl${selected === tpl.id ? " selected" : ""}`}
                        aria-pressed={selected === tpl.id}
                        onClick={() => onPick(tpl)}
                      >
                        {preview && <PlanThumb plan={preview} />}
                        <span className="rw-tpl-name">
                          <span aria-hidden>{tpl.emoji}</span> {t(tpl.label)}
                        </span>
                        <span className="rw-tpl-hint">{t(tpl.hint)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )
        );
      })}
    </div>
  );
}
