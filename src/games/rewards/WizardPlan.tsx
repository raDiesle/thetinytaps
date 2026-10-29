import { useState } from "react";
import { useT } from "@/lib/language";
import { weekday } from "./board";
import { ACTIVITIES, PLAN_VIEWS, TASKS, THEMES } from "./catalog";
import { Pick } from "./pageParts";
import { MAX_STEPS, type Plan, type PlanStep, stepFromCatalog, withSame, withSteps } from "./plan";
import { PlanThumb } from "./PlanGallery";
import { useStepLabel } from "./PlanSheet";
import type { WizardStep } from "./Wizard";

/** A plan's own steps in the wizard, after the kind and the Vorlage. */
export const PLAN_STEPS: WizardStep[] = [
  { id: "view", label: { de: "Ansicht" } },
  { id: "cards", label: { de: "Bilder" } },
  { id: "look", label: { de: "Aussehen" } },
];

const DAY_NAMES = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

/** Cards a plan offers: the day's activities first, then the tasks of the Belohnungstafel (as under Gestalten). */
const OFFERED = [...ACTIVITIES, ...TASKS];

/**
 * One of a plan's steps in the wizard, every choice as a picture: the views as the plan in each of them, the cards of
 * a day as a row in their order with big picture cards to add, the colours as the plan in each colour.
 */
export function PlanStepView({ step, plan, onChange }: { step: string; plan: Plan; onChange: (plan: Plan) => void }) {
  const t = useT();
  const stepLabel = useStepLabel();
  const [editDay, setEditDay] = useState(() => weekday(new Date()));
  const steps = (plan.same ? plan.days[0] : plan.days[editDay]) ?? [];
  const setSteps = (next: PlanStep[]) => onChange(withSteps(plan, editDay, next));
  const move = (index: number, by: number) => {
    const next = [...steps];
    const [moved] = next.splice(index, 1);
    next.splice(index + by, 0, moved);
    setSteps(next);
  };
  const toggle = (catalogId: string) => {
    const own = steps.find((s) => s.catalog === catalogId);
    if (own) setSteps(steps.filter((s) => s !== own));
    else if (steps.length < MAX_STEPS) setSteps([...steps, stepFromCatalog(catalogId)]);
  };

  if (step === "view")
    return (
      <>
        <h2>{t({ de: "Was soll der Plan zeigen?" })}</h2>
        <div className="rw-picks">
          {PLAN_VIEWS.map((view) => (
            <Pick
              key={view.id}
              selected={view.id === plan.view}
              onClick={() => onChange({ ...plan, view: view.id })}
              picture={<PlanThumb plan={{ ...plan, view: view.id }} />}
              label={`${view.emoji} ${t(view.label)}`}
              hint={t(view.hint)}
            />
          ))}
        </div>
        <h3 className="rw-wizard-sub">{t({ de: "Welche Tage?" })}</h3>
        <div className="rw-picks rw-picks-tiles" role="group" aria-label={t({ de: "Welche Tage?" })}>
          <Pick selected={plan.same} onClick={() => onChange(withSame(plan, true, editDay))} emoji="🔁" label={t({ de: "Jeden Tag gleich" })} />
          <Pick selected={!plan.same} onClick={() => onChange(withSame(plan, false, editDay))} emoji="📅" label={t({ de: "Jeder Wochentag eigen" })} />
        </div>
        <p className="setting-note">
          {t({
            de: "„Tag“ und „Woche“ lassen sich auch später oben über dem Plan umschalten. Eine Routine ist meist jeden Tag gleich, ein Tag mit Kita nicht.",
          })}
        </p>
      </>
    );

  if (step === "cards")
    return (
      <>
        <h2>{t({ de: "Was kommt nacheinander?" })}</h2>
        {!plan.same && (
          <div className="rw-chips pl-day-chips" role="group" aria-label={t({ de: "Tag bearbeiten" })}>
            {DAY_NAMES.map((name, i) => (
              <button key={name} type="button" className={i === editDay ? "selected" : undefined} aria-pressed={i === editDay} onClick={() => setEditDay(i)}>
                {name} <span className="pl-day-count">{plan.days[i].map((s) => s.emoji).join("")}</span>
              </button>
            ))}
          </div>
        )}
        {steps.length > 0 ? (
          <ol className="rw-wizard-row" aria-label={t({ de: "Reihenfolge" })}>
            {steps.map((s, i) => (
              <li key={s.id}>
                <span className="rw-wizard-card">
                  <span className="rw-wizard-card-number" aria-hidden>
                    {i + 1}
                  </span>
                  <span className="rw-pick-emoji" aria-hidden>
                    {s.emoji}
                  </span>
                  <span className="rw-wizard-card-label">{stepLabel(s)}</span>
                </span>
                <span className="rw-wizard-card-buttons">
                  <button type="button" disabled={i === 0} aria-label={t({ de: "Früher" })} onClick={() => move(i, -1)}>
                    ‹
                  </button>
                  <button type="button" aria-label={t({ de: `${stepLabel(s)} entfernen` })} onClick={() => setSteps(steps.filter((own) => own !== s))}>
                    ✕
                  </button>
                  <button type="button" disabled={i === steps.length - 1} aria-label={t({ de: "Später" })} onClick={() => move(i, 1)}>
                    ›
                  </button>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="rw-wizard-empty">{t({ de: "Noch keine Karte – unten antippen, was als Erstes kommt." })}</p>
        )}
        <div className="rw-picks rw-picks-tiles" role="group" aria-label={t({ de: "Karte dazu" })}>
          {OFFERED.map((item) => {
            const on = steps.some((s) => s.catalog === item.id);
            return (
              <Pick
                key={item.id}
                selected={on}
                disabled={!on && steps.length >= MAX_STEPS}
                onClick={() => toggle(item.id)}
                emoji={item.emoji}
                label={t(item.label)}
              />
            );
          })}
        </div>
        <p className="setting-note">
          {t({
            de: "Drei bis sechs Bilder reichen für Zwei- und Dreijährige. Antippen nimmt eine Karte dazu oder wieder weg, ‹ › ändern die Reihenfolge. Eigene Karten und eigene Wörter gibt es danach unter „Gestalten“.",
          })}
        </p>
      </>
    );

  return (
    <>
      <h2>{t({ de: "Für wen ist der Plan?" })}</h2>
      <label className="rw-input">
        <span>{t({ de: "Name des Kindes (steht in der Überschrift, bleibt auf diesem Gerät)" })}</span>
        <input
          type="text"
          value={plan.childName}
          maxLength={24}
          placeholder={t({ de: "z. B. Lena" })}
          onChange={(e) => onChange({ ...plan, childName: e.target.value })}
        />
      </label>
      <h3 className="rw-wizard-sub">{t({ de: "Farben" })}</h3>
      <div className="rw-picks rw-picks-small" role="group" aria-label={t({ de: "Farben" })}>
        {THEMES.map((theme) => (
          <Pick
            key={theme.id}
            selected={theme.id === plan.theme}
            onClick={() => onChange({ ...plan, theme: theme.id })}
            picture={<PlanThumb plan={{ ...plan, theme: theme.id }} />}
            label={t(theme.label)}
          />
        ))}
      </div>
    </>
  );
}
