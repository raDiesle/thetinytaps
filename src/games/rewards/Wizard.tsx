import { useState } from "react";
import { Slider } from "@/components/SettingControls";
import { useT } from "@/lib/language";
import {
  type Board,
  type BoardTask,
  boardFromTemplate,
  COLLECT_GOALS,
  fieldCount,
  MAX_TASKS,
  newId,
  rewardFromCatalog,
  taskFromCatalog,
  withKind,
} from "./board";
import { useTaskLabel } from "./BoardSheet";
import { KINDS, MARKS, REWARDS, type Template, TASKS, THEMES } from "./catalog";
import { SlotChips } from "./Editor";
import { TemplateGallery, Thumb } from "./Gallery";

/** The wizard's steps, in order; a board can be made from any step after the first. */
const STEPS = [
  { id: "start", emoji: "🧩", label: { de: "Vorlage" } },
  { id: "kind", emoji: "📅", label: { de: "Ansicht" } },
  { id: "tasks", emoji: "🪥", label: { de: "Aufgaben" } },
  { id: "goal", emoji: "🎁", label: { de: "Belohnung" } },
  { id: "look", emoji: "🎨", label: { de: "Name und Farben" } },
] as const;

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

/**
 * „Neue Tafel“ step by step: a template (or empty), the view, the tasks with their times of day, the reward and goal,
 * name and colours – with the board as it will look, example stars and all, beside it. „Fertig“ makes it from any step
 * after the first; everything can still be changed later under „Gestalten“. Opened on a template from the gallery,
 * it starts on the second step with that template.
 */
export function Wizard({ start, onDone, onCancel }: { start?: Template; onDone: (board: Board) => void; onCancel: () => void }) {
  const t = useT();
  const taskLabel = useTaskLabel();
  const [draft, setDraft] = useState<Board | null>(() => (start ? { ...boardFromTemplate(start), id: newId() } : null));
  const [step, setStep] = useState(start ? 1 : 0);
  const change = (patch: Partial<Board>) => setDraft((b) => (b ? { ...b, ...patch } : b));
  const pick = (board: Board) => {
    setDraft({ ...board, id: newId() });
    setStep(1);
  };

  const id = STEPS[step].id;
  const fields = draft ? fieldCount(draft, new Date()) : 0;
  const setTask = (taskId: string, patch: Partial<BoardTask>) =>
    draft && change({ tasks: draft.tasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task)) });
  const addTask = (catalogId: string) => draft && draft.tasks.length < MAX_TASKS && change({ tasks: [...draft.tasks, taskFromCatalog(catalogId)] });

  return (
    <section className="rw-wizard" aria-label={t({ de: "Neue Tafel" })}>
      <header className="rw-wizard-head">
        <ol className="rw-steps">
          {STEPS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className={i === step ? "selected" : undefined}
                aria-current={i === step ? "step" : undefined}
                disabled={!draft && i > 0}
                onClick={() => setStep(i)}
              >
                <span className="rw-step-number">{i + 1}</span> <span className="rw-step-label">{t(s.label)}</span>
              </button>
            </li>
          ))}
        </ol>
        <button type="button" className="rw-wizard-close" aria-label={t({ de: "Abbrechen" })} onClick={onCancel}>
          ✕
        </button>
      </header>

      <div className={`rw-wizard-body${id === "start" ? " rw-wizard-wide" : ""}`}>
        <div className="rw-wizard-step">
          {id === "start" && (
            <>
              <h2>{t({ de: "Womit fangen wir an?" })}</h2>
              <p className="setting-note">{t({ de: "Eine Vorlage antippen – danach lässt sich alles ändern." })}</p>
              <TemplateGallery onPick={(tpl) => pick(boardFromTemplate(tpl))} blank={() => pick(blankBoard())} />
            </>
          )}

          {draft && id === "kind" && (
            <>
              <h2>{t({ de: "Wie lange geht die Tafel?" })}</h2>
              <div className="rw-kind-cards">
                {KINDS.map((kind) => (
                  <button
                    key={kind.id}
                    type="button"
                    className={kind.id === draft.kind ? "selected" : undefined}
                    aria-pressed={kind.id === draft.kind}
                    onClick={() => setDraft(withKind(draft, kind.id))}
                  >
                    <span className="rw-kind-emoji" aria-hidden>
                      {kind.emoji}
                    </span>
                    <span className="rw-kind-label">{t(kind.label)}</span>
                    <span className="rw-kind-hint">{t(kind.hint)}</span>
                  </button>
                ))}
              </div>
              <p className="setting-note">
                {t({
                  de: "Tag, Woche und Monat zeigen dieselben Sterne – oben über der Tafel lässt sich jederzeit umschalten. Für Zweijährige ist ein Tag oder ein kurzer Weg mit 5 Sternen oft genug.",
                })}
              </p>
            </>
          )}

          {draft && id === "tasks" && (
            <>
              <h2>{draft.kind === "collect" ? t({ de: "Wofür gibt es Sterne?" }) : t({ de: "Was soll klappen?" })}</h2>
              {draft.tasks.length > 0 && (
                <ul className="rw-wizard-tasks">
                  {draft.tasks.map((task) => (
                    <li key={task.id}>
                      <span className="rw-wizard-task">
                        <span aria-hidden>{task.emoji}</span> {taskLabel(task) || t({ de: "Eigene Aufgabe" })}
                        <button
                          type="button"
                          aria-label={t({ de: `${taskLabel(task)} entfernen` })}
                          onClick={() => change({ tasks: draft.tasks.filter((own) => own !== task) })}
                        >
                          ✕
                        </button>
                      </span>
                      {draft.kind !== "collect" && <SlotChips task={task} onChange={(patch) => setTask(task.id, patch)} />}
                    </li>
                  ))}
                </ul>
              )}
              <div className="rw-chips" role="group" aria-label={t({ de: "Aufgabe dazu" })}>
                {TASKS.filter((task) => !draft.tasks.some((own) => own.catalog === task.id)).map((task) => (
                  <button key={task.id} type="button" disabled={draft.tasks.length >= MAX_TASKS} onClick={() => addTask(task.id)}>
                    + {task.emoji} {t(task.label)}
                  </button>
                ))}
              </div>
              <p className="setting-note">
                {t({
                  de: "Am besten eine bis drei Aufgaben, eine davon leicht. Zähne putzen bekommt morgens ☀️ und abends 🌙 je einen Stern – das Spiel „Zähne putzen“ setzt beide von selbst.",
                })}
              </p>
            </>
          )}

          {draft && id === "goal" && (
            <>
              <h2>{t({ de: "Worauf freut ihr euch?" })}</h2>
              <div className="rw-chips" role="group" aria-label={t({ de: "Belohnung" })}>
                <button type="button" className={draft.reward ? undefined : "selected"} aria-pressed={!draft.reward} onClick={() => change({ reward: null })}>
                  🎉 {t({ de: "Nur zusammen freuen" })}
                </button>
                {REWARDS.map((reward) => {
                  const on = draft.reward?.catalog === reward.id;
                  return (
                    <button
                      key={reward.id}
                      type="button"
                      className={on ? "selected" : undefined}
                      aria-pressed={on}
                      onClick={() => change({ reward: rewardFromCatalog(reward.id) })}
                    >
                      {reward.emoji} {t(reward.label)}
                    </button>
                  );
                })}
              </div>
              {draft.kind === "collect" && (
                <div className="rw-chips" role="group" aria-label={t({ de: "Sterne bis zur Belohnung" })}>
                  {COLLECT_GOALS.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={n === draft.goal ? "selected" : undefined}
                      aria-pressed={n === draft.goal}
                      onClick={() => change({ goal: n })}
                    >
                      {n} ⭐
                    </button>
                  ))}
                </div>
              )}
              {(draft.kind === "week" || draft.kind === "month") && fields > 1 && (
                <Slider
                  label={draft.kind === "week" ? t({ de: "Sterne in der Woche bis zur Belohnung" }) : t({ de: "Sterne im Monat bis zur Belohnung" })}
                  value={Math.min(draft.goal, fields)}
                  min={1}
                  max={fields}
                  format={(n) => (n === fields ? t({ de: `${n} (alle)` }) : String(n))}
                  onChange={(goal) => change({ goal })}
                />
              )}
              {draft.kind === "day" && <p className="setting-note">{t({ de: "Gefeiert wird, wenn alle Aufgaben des Tages ihren Stern haben." })}</p>}
              <p className="setting-note">{t({ de: "Kleine freuen sich am meisten über Zeit zusammen – und über eine Belohnung, die bald kommt." })}</p>
            </>
          )}

          {draft && id === "look" && (
            <>
              <h2>{t({ de: "Für wen ist die Tafel?" })}</h2>
              <label className="rw-input">
                <span>{t({ de: "Name des Kindes (steht in der Überschrift, bleibt auf diesem Gerät)" })}</span>
                <input
                  type="text"
                  value={draft.childName}
                  maxLength={24}
                  placeholder={t({ de: "z. B. Lena" })}
                  onChange={(e) => change({ childName: e.target.value })}
                />
              </label>
              <div className="rw-chips" role="group" aria-label={t({ de: "Was kommt ins Feld?" })}>
                {MARKS.map((mark) => (
                  <button
                    key={mark.id}
                    type="button"
                    className={mark.id === draft.mark ? "selected" : undefined}
                    aria-pressed={mark.id === draft.mark}
                    onClick={() => change({ mark: mark.id })}
                  >
                    {mark.emoji} {t(mark.label)}
                  </button>
                ))}
              </div>
              <div className="rw-chips" role="group" aria-label={t({ de: "Farben" })}>
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    className={theme.id === draft.theme ? "selected" : undefined}
                    aria-pressed={theme.id === draft.theme}
                    onClick={() => change({ theme: theme.id })}
                  >
                    {t(theme.label)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {draft && id !== "start" && (
          <div className="rw-wizard-preview">
            <Thumb board={draft} />
          </div>
        )}
      </div>

      <footer className="rw-wizard-foot">
        <button type="button" className="rw-wizard-back" disabled={step === 0} onClick={() => setStep(step - 1)}>
          ‹ {t({ de: "Zurück" })}
        </button>
        {draft && step < STEPS.length - 1 && step > 0 && (
          <button type="button" className="rw-wizard-next" onClick={() => setStep(step + 1)}>
            {t({ de: "Weiter" })} ›
          </button>
        )}
        {draft && step > 0 && (
          <button type="button" className="rw-wizard-done" disabled={draft.tasks.length === 0 && draft.kind !== "collect"} onClick={() => onDone(draft)}>
            ✓ {step === STEPS.length - 1 ? t({ de: "Tafel anlegen" }) : t({ de: "So nehmen" })}
          </button>
        )}
      </footer>
    </section>
  );
}
