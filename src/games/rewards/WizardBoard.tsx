import { Slider } from "@/components/SettingControls";
import { useT } from "@/lib/language";
import { type Board, type BoardTask, COLLECT_GOALS, fieldCount, MAX_TASKS, rewardFromCatalog, taskFromCatalog, withKind } from "./board";
import { useTaskLabel } from "./BoardSheet";
import { KINDS, MARKS, REWARDS, TASKS, THEMES } from "./catalog";
import { SlotChips } from "./Editor";
import { Thumb } from "./Gallery";
import { Pick } from "./pageParts";
import { ItemPic, MarkPic, Pic, picture } from "./pictures";
import type { WizardStep } from "./Wizard";

/** A board's own steps in the wizard, after the kind and the Vorlage. */
export const BOARD_STEPS: WizardStep[] = [
  { id: "kind", label: { de: "Ansicht" } },
  { id: "tasks", label: { de: "Aufgaben" } },
  { id: "goal", label: { de: "Belohnung" } },
  { id: "look", label: { de: "Aussehen" } },
];

/**
 * One of a board's steps in the wizard, every choice as a picture: the views as the board in each of them, tasks,
 * rewards and marks as big picture cards, the colours as the board in each colour.
 */
export function BoardStep({ step, board, onChange }: { step: string; board: Board; onChange: (board: Board) => void }) {
  const t = useT();
  const taskLabel = useTaskLabel();
  const change = (patch: Partial<Board>) => onChange({ ...board, ...patch });
  const fields = fieldCount(board, new Date());
  const setTask = (taskId: string, patch: Partial<BoardTask>) =>
    change({ tasks: board.tasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task)) });
  const toggleTask = (catalogId: string) => {
    const own = board.tasks.find((task) => task.catalog === catalogId);
    if (own) change({ tasks: board.tasks.filter((task) => task !== own) });
    else if (board.tasks.length < MAX_TASKS) change({ tasks: [...board.tasks, taskFromCatalog(catalogId)] });
  };

  if (step === "kind")
    return (
      <>
        <h2>{t({ de: "Wie lange geht die Tafel?" })}</h2>
        <div className="rw-picks">
          {KINDS.map((kind) => (
            <Pick
              key={kind.id}
              selected={kind.id === board.kind}
              onClick={() => onChange(withKind(board, kind.id))}
              picture={<Thumb board={withKind(board, kind.id)} />}
              label={`${kind.emoji} ${t(kind.label)}`}
              hint={t(kind.hint)}
            />
          ))}
        </div>
        <p className="setting-note">
          {t({
            de: "Tag, Woche und Monat zeigen dieselben Sterne – oben über der Tafel lässt sich jederzeit umschalten. Für Zweijährige ist ein Tag oder ein kurzer Weg mit 5 Sternen oft genug.",
          })}
        </p>
      </>
    );

  if (step === "tasks")
    return (
      <>
        <h2>{board.kind === "collect" ? t({ de: "Wofür gibt es Sterne?" }) : t({ de: "Was soll klappen?" })}</h2>
        {board.tasks.length > 0 && board.kind !== "collect" && (
          <ul className="rw-wizard-tasks">
            {board.tasks.map((task) => (
              <li key={task.id}>
                <span className="rw-wizard-task">
                  <span aria-hidden>
                    <ItemPic item={task} />
                  </span>{" "}
                  {taskLabel(task) || t({ de: "Eigene Aufgabe" })}
                </span>
                <SlotChips task={task} onChange={(patch) => setTask(task.id, patch)} />
              </li>
            ))}
          </ul>
        )}
        <div className="rw-picks rw-picks-tiles" role="group" aria-label={t({ de: "Aufgaben" })}>
          {TASKS.map((task) => {
            const on = board.tasks.some((own) => own.catalog === task.id);
            return (
              <Pick
                key={task.id}
                selected={on}
                disabled={!on && board.tasks.length >= MAX_TASKS}
                onClick={() => toggleTask(task.id)}
                emoji={<ItemPic item={{ emoji: task.emoji, catalog: task.id }} />}
                label={t(task.label)}
              />
            );
          })}
        </div>
        <p className="setting-note">
          {t({
            de: "Am besten eine bis drei Aufgaben, eine davon leicht – antippen nimmt sie dazu oder wieder weg. Zähne putzen bekommt morgens ☀️ und abends 🌙 je einen Stern – das Spiel „Zähne putzen“ setzt beide von selbst. Eigene Aufgaben gibt es danach unter „Gestalten“.",
          })}
        </p>
      </>
    );

  if (step === "goal")
    return (
      <>
        <h2>{t({ de: "Worauf freut ihr euch?" })}</h2>
        <div className="rw-picks rw-picks-tiles" role="group" aria-label={t({ de: "Belohnung" })}>
          <Pick
            selected={!board.reward}
            onClick={() => change({ reward: null })}
            emoji={<Pic src={picture("fest")} emoji="🎉" />}
            label={t({ de: "Nur zusammen freuen" })}
          />
          {REWARDS.map((reward) => (
            <Pick
              key={reward.id}
              selected={board.reward?.catalog === reward.id}
              onClick={() => change({ reward: rewardFromCatalog(reward.id) })}
              emoji={<ItemPic item={{ emoji: reward.emoji, catalog: reward.id }} kind="reward" />}
              label={t(reward.label)}
            />
          ))}
        </div>
        {board.kind === "collect" && (
          <div className="rw-chips" role="group" aria-label={t({ de: "Sterne bis zur Belohnung" })}>
            {COLLECT_GOALS.map((n) => (
              <button
                key={n}
                type="button"
                className={n === board.goal ? "selected" : undefined}
                aria-pressed={n === board.goal}
                onClick={() => change({ goal: n })}
              >
                {n} ⭐
              </button>
            ))}
          </div>
        )}
        {(board.kind === "week" || board.kind === "month") && fields > 1 && (
          <Slider
            label={board.kind === "week" ? t({ de: "Sterne in der Woche bis zur Belohnung" }) : t({ de: "Sterne im Monat bis zur Belohnung" })}
            value={Math.min(board.goal, fields)}
            min={1}
            max={fields}
            format={(n) => (n === fields ? t({ de: `${n} (alle)` }) : String(n))}
            onChange={(goal) => change({ goal })}
          />
        )}
        {board.kind === "day" && <p className="setting-note">{t({ de: "Gefeiert wird, wenn alle Aufgaben des Tages ihren Stern haben." })}</p>}
        <p className="setting-note">{t({ de: "Kleine freuen sich am meisten über Zeit zusammen – und über eine Belohnung, die bald kommt." })}</p>
      </>
    );

  return (
    <>
      <h2>{t({ de: "Für wen ist die Tafel?" })}</h2>
      <label className="rw-input">
        <span>{t({ de: "Name des Kindes (steht in der Überschrift, bleibt auf diesem Gerät)" })}</span>
        <input
          type="text"
          value={board.childName}
          maxLength={24}
          placeholder={t({ de: "z. B. Lena" })}
          onChange={(e) => change({ childName: e.target.value })}
        />
      </label>
      <h3 className="rw-wizard-sub">{t({ de: "Was kommt ins Feld?" })}</h3>
      <div className="rw-picks rw-picks-tiles" role="group" aria-label={t({ de: "Was kommt ins Feld?" })}>
        {MARKS.map((mark) => (
          <Pick
            key={mark.id}
            selected={mark.id === board.mark}
            onClick={() => change({ mark: mark.id })}
            emoji={<MarkPic mark={mark} />}
            label={t(mark.label)}
          />
        ))}
      </div>
      <h3 className="rw-wizard-sub">{t({ de: "Farben" })}</h3>
      <div className="rw-picks rw-picks-small" role="group" aria-label={t({ de: "Farben" })}>
        {THEMES.map((theme) => (
          <Pick
            key={theme.id}
            selected={theme.id === board.theme}
            onClick={() => change({ theme: theme.id })}
            picture={<Thumb board={{ ...board, theme: theme.id }} />}
            label={t(theme.label)}
          />
        ))}
      </div>
    </>
  );
}
