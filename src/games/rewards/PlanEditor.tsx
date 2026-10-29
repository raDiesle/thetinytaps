import { useState } from "react";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { useT } from "@/lib/language";
import { newId, weekday } from "./board";
import { ACTIVITIES, SLOTS, STEP_BY_ID, TASKS, THEMES } from "./catalog";
import { MAX_STEPS, type Plan, type PlanStep, stepFromCatalog, stepsOn, withSame, withSteps } from "./plan";
import { usePlanTitle, useStepLabel } from "./PlanSheet";

const DAY_NAMES = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

/** Steps a plan offers to add: the day's activities first, then the tasks of the Belohnungstafel. */
const OFFERED = [...ACTIVITIES, ...TASKS];

/**
 * Everything a grown-up can change on a plan: name and heading, every day the same or each weekday its own, the steps
 * of a day (from pictures or their own, in order), when a brushing counts, colours – and starting today over or
 * removing the plan.
 */
export function PlanEditor({
  plan,
  day,
  onChange,
  onRestartToday,
  onRemove,
}: {
  plan: Plan;
  /** The day shown: its weekday is edited first. */
  day: Date;
  onChange: (plan: Plan) => void;
  onRestartToday: () => void;
  /** Missing when it is the only plan. */
  onRemove?: () => void;
}) {
  const t = useT();
  const stepLabel = useStepLabel();
  const autoTitle = usePlanTitle()({ ...plan, title: "" });
  const [editDay, setEditDay] = useState(weekday(day));
  const steps = plan.same ? plan.days[0] : plan.days[editDay];
  const setSteps = (next: PlanStep[]) => onChange(withSteps(plan, editDay, next));
  const setStep = (id: string, patch: Partial<PlanStep>) => setSteps(steps.map((step) => (step.id === id ? { ...step, ...patch } : step)));
  const move = (index: number, by: number) => {
    const next = [...steps];
    const [step] = next.splice(index, 1);
    next.splice(index + by, 0, step);
    setSteps(next);
  };
  const add = (step: PlanStep) => steps.length < MAX_STEPS && setSteps([...steps, step]);
  /** This day's steps on other weekdays too (fresh ids, the ticks of those days are their own anyway). */
  const copyTo = (days: number[]) =>
    onChange({ ...plan, days: plan.days.map((list, i) => (days.includes(i) && i !== editDay ? steps.map((step) => ({ ...step })) : list)) });

  return (
    <section className="settings rw-editor pl-editor">
      <SettingsGroup title={t({ de: "Name und Überschrift" })}>
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
        <label className="rw-input">
          <span>{t({ de: "Überschrift" })}</span>
          <input type="text" value={plan.title} maxLength={40} placeholder={autoTitle} onChange={(e) => onChange({ ...plan, title: e.target.value })} />
        </label>
      </SettingsGroup>

      <SettingsGroup title={t({ de: "Schritte" })}>
        <Choice
          label={t({ de: "Welche Tage?" })}
          value={plan.same ? "same" : "own"}
          onChange={(value) => onChange(withSame(plan, value === "same", editDay))}
          options={[
            { value: "same", label: t({ de: "Jeden Tag gleich" }) },
            { value: "own", label: t({ de: "Jeder Wochentag eigen" }) },
          ]}
        />
        {!plan.same && (
          <>
            <div className="rw-chips pl-day-chips" role="group" aria-label={t({ de: "Tag bearbeiten" })}>
              {DAY_NAMES.map((name, i) => (
                <button key={name} type="button" className={i === editDay ? "selected" : undefined} aria-pressed={i === editDay} onClick={() => setEditDay(i)}>
                  {name} <span className="pl-day-count">{plan.days[i].map((step) => step.emoji).join("")}</span>
                </button>
              ))}
            </div>
            <div className="rw-chips">
              <button type="button" onClick={() => copyTo([0, 1, 2, 3, 4])}>
                {t({ de: `${DAY_NAMES[editDay]} auch für Mo–Fr` })}
              </button>
              <button type="button" onClick={() => copyTo([0, 1, 2, 3, 4, 5, 6])}>
                {t({ de: `${DAY_NAMES[editDay]} für alle Tage` })}
              </button>
            </div>
          </>
        )}
        <ol className="rw-tasks">
          {steps.map((step, i) => {
            const catalog = step.catalog ? STEP_BY_ID.get(step.catalog) : undefined;
            return (
              <li key={step.id} className="rw-task-edit">
                <span className="pl-edit-number" aria-hidden>
                  {i + 1}
                </span>
                <input
                  type="text"
                  className="rw-emoji-input"
                  value={step.emoji}
                  maxLength={8}
                  aria-label={t({ de: "Bild (Emoji)" })}
                  onChange={(e) => setStep(step.id, { emoji: e.target.value })}
                />
                <input
                  type="text"
                  className="rw-label-input"
                  value={step.label ?? ""}
                  maxLength={32}
                  placeholder={catalog ? t(catalog.label) : t({ de: "Was kommt?" })}
                  aria-label={t({ de: "Wort zum Schritt" })}
                  onChange={(e) => setStep(step.id, { label: e.target.value || undefined })}
                />
                <span className="rw-task-buttons">
                  <button type="button" disabled={i === 0} aria-label={t({ de: "Früher" })} onClick={() => move(i, -1)}>
                    ↑
                  </button>
                  <button type="button" disabled={i === steps.length - 1} aria-label={t({ de: "Später" })} onClick={() => move(i, 1)}>
                    ↓
                  </button>
                  <button
                    type="button"
                    aria-label={t({ de: `${stepLabel(step)} entfernen` })}
                    onClick={() => setSteps(steps.filter((own) => own.id !== step.id))}
                  >
                    ✕
                  </button>
                </span>
                {step.linked === "teeth" && (
                  <div className="rw-chips rw-slot-chips" role="group" aria-label={t({ de: "Welches Putzen hakt ab?" })}>
                    <button
                      type="button"
                      className={step.slot ? undefined : "selected"}
                      aria-pressed={!step.slot}
                      onClick={() => setStep(step.id, { slot: undefined })}
                    >
                      🪥 {t({ de: "Jedes Putzen" })}
                    </button>
                    {SLOTS.filter((slot) => slot.id !== "noon").map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        className={step.slot === slot.id ? "selected" : undefined}
                        aria-pressed={step.slot === slot.id}
                        onClick={() => setStep(step.id, { slot: slot.id })}
                      >
                        {slot.emoji} {t(slot.label)}
                      </button>
                    ))}
                  </div>
                )}
                {step.linked === "teeth" && (
                  <div className="rw-chips rw-slot-chips" role="group" aria-label={t({ de: "Was macht ein Tippen auf die Karte?" })}>
                    <button
                      type="button"
                      className={step.noGame ? undefined : "selected"}
                      aria-pressed={!step.noGame}
                      onClick={() => setStep(step.id, { noGame: undefined })}
                    >
                      🦷 {t({ de: "Öffnet „Zähne putzen“" })}
                    </button>
                    <button
                      type="button"
                      className={step.noGame ? "selected" : undefined}
                      aria-pressed={!!step.noGame}
                      onClick={() => setStep(step.id, { noGame: true })}
                    >
                      ✓ {t({ de: "Nur abhaken" })}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        <p className="setting-note">
          {t({
            de: "Drei bis sechs Bilder reichen für Zwei- und Dreijährige. Ist die Zähne-Karte dran, öffnet ein Tippen das Spiel „Zähne putzen“; danach geht es zurück zum Plan, und die Karte ist geschafft. Wer ohne das Spiel putzt, wählt „Nur abhaken“. Aufs Töpfchen hakt sich nach einem Haken im Töpfchen-Spiel ab.",
          })}
        </p>
        <div className="rw-chips" role="group" aria-label={t({ de: "Schritt hinzufügen" })}>
          {OFFERED.map((item) => (
            <button key={item.id} type="button" disabled={steps.length >= MAX_STEPS} onClick={() => add(stepFromCatalog(item.id))}>
              ＋ {item.emoji} {t(item.label)}
            </button>
          ))}
          <button type="button" disabled={steps.length >= MAX_STEPS} onClick={() => add({ id: newId(), emoji: "⭐", label: "" })}>
            ＋ {t({ de: "Eigene Karte" })}
          </button>
        </div>
      </SettingsGroup>

      <SettingsGroup title={t({ de: "Farben" })}>
        <div className="rw-chips" role="group" aria-label={t({ de: "Farben" })}>
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className={plan.theme === theme.id ? "selected" : undefined}
              aria-pressed={plan.theme === theme.id}
              onClick={() => onChange({ ...plan, theme: theme.id })}
            >
              {t(theme.label)}
            </button>
          ))}
        </div>
      </SettingsGroup>

      <SettingsGroup title={t({ de: "Von vorn" })}>
        <div className="rw-chips">
          <button type="button" disabled={stepsOn(plan, new Date()).length === 0} onClick={onRestartToday}>
            ↺ {t({ de: "Heute noch einmal von vorn" })}
          </button>
          {onRemove && (
            <button type="button" onClick={onRemove}>
              🗑️ {t({ de: "Plan löschen" })}
            </button>
          )}
        </div>
      </SettingsGroup>
    </section>
  );
}
