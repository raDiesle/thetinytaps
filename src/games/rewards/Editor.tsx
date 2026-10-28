import { Choice, SettingsGroup, Slider, Toggle } from "@/components/SettingControls";
import { useT } from "@/lib/language";
import { type Board, type BoardTask, COLLECT_GOALS, fieldCount, MAX_TASKS, newId, rewardFromCatalog, taskFromCatalog } from "./board";
import { useBoardTitle, useRewardLabel, useTaskLabel } from "./BoardSheet";
import { MARKS, REWARDS, TASK_BY_ID, TASKS, THEMES } from "./catalog";

const DAY_NAMES = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

/**
 * Everything a grown-up can change on a board, live under the board's preview:
 * name and heading (the kind is the row of views above the board), tasks (from pictures or their own), weekdays, goal,
 * reward, mark and colours – and starting over or removing the board.
 */
export function Editor({
  board,
  onChange,
  onStartOver,
  onRemove,
}: {
  board: Board;
  onChange: (patch: Partial<Board>) => void;
  onStartOver: () => void;
  /** Missing when it is the only board. */
  onRemove?: () => void;
}) {
  const t = useT();
  const taskLabel = useTaskLabel();
  const rewardLabel = useRewardLabel();
  const autoTitle = useBoardTitle()({ ...board, title: "" });
  const fields = fieldCount(board, new Date());
  const unused = TASKS.filter((task) => !board.tasks.some((own) => own.catalog === task.id));

  const setTask = (id: string, patch: Partial<BoardTask>) => onChange({ tasks: board.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)) });
  const move = (index: number, by: number) => {
    const tasks = [...board.tasks];
    const [task] = tasks.splice(index, 1);
    tasks.splice(index + by, 0, task);
    onChange({ tasks });
  };
  const addTask = (task: BoardTask) => board.tasks.length < MAX_TASKS && onChange({ tasks: [...board.tasks, task] });

  return (
    <section className="settings rw-editor">
      <SettingsGroup title={t({ de: "Name und Überschrift" })}>
        <label className="rw-input">
          <span>{t({ de: "Name des Kindes (steht in der Überschrift, bleibt auf diesem Gerät)" })}</span>
          <input
            type="text"
            value={board.childName}
            maxLength={24}
            placeholder={t({ de: "z. B. Lena" })}
            onChange={(e) => onChange({ childName: e.target.value })}
          />
        </label>
        <label className="rw-input">
          <span>{t({ de: "Überschrift" })}</span>
          <input type="text" value={board.title} maxLength={40} placeholder={autoTitle} onChange={(e) => onChange({ title: e.target.value })} />
        </label>
      </SettingsGroup>

      <SettingsGroup title={board.kind === "collect" ? t({ de: "Wofür gibt es Sterne?" }) : t({ de: "Aufgaben" })}>
        <ol className="rw-tasks">
          {board.tasks.map((task, i) => {
            const catalog = task.catalog ? TASK_BY_ID.get(task.catalog) : undefined;
            return (
              <li key={task.id} className="rw-task-edit">
                <input
                  type="text"
                  className="rw-emoji-input"
                  value={task.emoji}
                  maxLength={8}
                  aria-label={t({ de: "Bild (Emoji)" })}
                  onChange={(e) => setTask(task.id, { emoji: e.target.value })}
                />
                <input
                  type="text"
                  className="rw-label-input"
                  value={task.label ?? ""}
                  maxLength={32}
                  placeholder={catalog ? t(catalog.label) : t({ de: "Was soll klappen?" })}
                  aria-label={t({ de: "Wort zur Aufgabe" })}
                  onChange={(e) => setTask(task.id, { label: e.target.value || undefined })}
                />
                <span className="rw-task-buttons">
                  <button type="button" disabled={i === 0} aria-label={t({ de: "Nach oben" })} onClick={() => move(i, -1)}>
                    ↑
                  </button>
                  <button type="button" disabled={i === board.tasks.length - 1} aria-label={t({ de: "Nach unten" })} onClick={() => move(i, 1)}>
                    ↓
                  </button>
                  <button
                    type="button"
                    aria-label={t({ de: `${taskLabel(task)} entfernen` })}
                    onClick={() => onChange({ tasks: board.tasks.filter((own) => own.id !== task.id) })}
                  >
                    ✕
                  </button>
                </span>
                {catalog?.linked && board.kind !== "collect" && (
                  <span className="rw-linked">
                    <Toggle
                      label={
                        catalog.linked === "teeth"
                          ? t({ de: "Stern kommt von selbst, wenn im Spiel „Zähne putzen“ fertig geputzt ist" })
                          : t({ de: "Stern kommt von selbst, wenn im Spiel „Aufs Töpfchen“ ein Haken getippt ist" })
                      }
                      checked={!!task.linked}
                      onChange={(on) => setTask(task.id, { linked: on ? catalog.linked : undefined })}
                    />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        {board.tasks.length === 0 && <p className="setting-note">{t({ de: "Noch keine Aufgabe – unten eine antippen." })}</p>}
        <p className="setting-note">
          {t({
            de: "Für Zwei- und Dreijährige am besten eine bis drei Aufgaben, eine davon leicht – so gibt es bald den ersten Stern. Etwas Bestimmtes („Zähne putzen“) statt „lieb sein“.",
          })}
        </p>
        {board.tasks.length < MAX_TASKS && (
          <div className="rw-chips" role="group" aria-label={t({ de: "Aufgabe dazu" })}>
            {unused.map((task) => (
              <button key={task.id} type="button" onClick={() => addTask(taskFromCatalog(task.id))}>
                + {task.emoji} {t(task.label)}
              </button>
            ))}
            <button type="button" onClick={() => addTask({ id: newId(), emoji: "⭐", label: "" })}>
              + ✏️ {t({ de: "Eigene Aufgabe" })}
            </button>
          </div>
        )}
      </SettingsGroup>

      {(board.kind === "week" || board.kind === "month") && (
        <SettingsGroup title={t({ de: "Tage" })}>
          <div className="rw-chips" role="group" aria-label={t({ de: "Wochentage" })}>
            {DAY_NAMES.map((name, i) => {
              const on = board.days.includes(i);
              return (
                <button
                  key={name}
                  type="button"
                  className={on ? "selected" : undefined}
                  aria-pressed={on}
                  // At least one day stays.
                  onClick={() => onChange({ days: on ? (board.days.length > 1 ? board.days.filter((d) => d !== i) : board.days) : [...board.days, i].sort() })}
                >
                  {name}
                </button>
              );
            })}
          </div>
          <p className="setting-note">
            {t({ de: "Zum Beispiel nur Kita-Tage, oder ohne die Tage bei Oma. Die Woche beginnt jeden Montag von selbst neu, der Monat an jedem Ersten." })}
          </p>
        </SettingsGroup>
      )}

      <SettingsGroup title={t({ de: "Ziel und Belohnung" })}>
        {board.kind === "collect" && (
          <Choice
            label={t({ de: "Felder bis zur Belohnung" })}
            value={String(board.goal)}
            onChange={(goal) => onChange({ goal: Number(goal) })}
            options={COLLECT_GOALS.map((n) => ({ value: String(n), label: String(n) }))}
          />
        )}
        {(board.kind === "week" || board.kind === "month") && fields > 1 && (
          <Slider
            label={board.kind === "week" ? t({ de: "Sterne in der Woche bis zur Belohnung" }) : t({ de: "Sterne im Monat bis zur Belohnung" })}
            value={Math.min(board.goal, fields)}
            min={1}
            max={fields}
            format={(n) => (n === fields ? t({ de: `${n} (alle)` }) : String(n))}
            onChange={(goal) => onChange({ goal })}
          />
        )}
        {board.kind === "day" && <p className="setting-note">{t({ de: "Gefeiert wird, wenn alle Aufgaben des Tages ihren Stern haben." })}</p>}
        <div className="rw-chips" role="group" aria-label={t({ de: "Belohnung" })}>
          <button type="button" className={board.reward ? undefined : "selected"} aria-pressed={!board.reward} onClick={() => onChange({ reward: null })}>
            🎉 {t({ de: "Nur zusammen freuen" })}
          </button>
          {REWARDS.map((reward) => {
            const on = board.reward?.catalog === reward.id;
            return (
              <button
                key={reward.id}
                type="button"
                className={on ? "selected" : undefined}
                aria-pressed={on}
                onClick={() => onChange({ reward: rewardFromCatalog(reward.id) })}
              >
                {reward.emoji} {t(reward.label)}
              </button>
            );
          })}
        </div>
        {board.reward && (
          <div className="rw-task-edit">
            <input
              type="text"
              className="rw-emoji-input"
              value={board.reward.emoji}
              maxLength={8}
              aria-label={t({ de: "Bild der Belohnung (Emoji)" })}
              onChange={(e) => onChange({ reward: { ...board.reward, emoji: e.target.value } })}
            />
            <input
              type="text"
              className="rw-label-input"
              value={board.reward.label ?? ""}
              maxLength={32}
              placeholder={rewardLabel(board.reward)}
              aria-label={t({ de: "Eigene Worte für die Belohnung" })}
              onChange={(e) => onChange({ reward: { emoji: board.reward?.emoji ?? "🎁", catalog: board.reward?.catalog, label: e.target.value || undefined } })}
            />
          </div>
        )}
        <p className="setting-note">
          {t({
            de: "Am meisten freuen sich Kleine über Zeit zusammen: Spielplatz, ein Buch, backen. Die Belohnung kommt bald – bei Zweijährigen lieber nach wenigen Sternen als nach einer ganzen Woche.",
          })}
        </p>
      </SettingsGroup>

      <SettingsGroup title={t({ de: "Aussehen" })}>
        <Choice
          label={t({ de: "Was kommt ins Feld?" })}
          value={board.mark}
          onChange={(mark) => onChange({ mark })}
          options={MARKS.map((m) => ({ value: m.id, label: `${m.emoji} ${t(m.label)}` }))}
        />
        <Choice
          label={t({ de: "Farben" })}
          value={board.theme}
          onChange={(theme) => onChange({ theme })}
          options={THEMES.map((th) => ({ value: th.id, label: t(th.label) }))}
        />
      </SettingsGroup>

      <SettingsGroup title={t({ de: "Neu anfangen" })}>
        <p className="setting-note">
          {board.kind === "collect"
            ? t({ de: "Leert den Weg für die nächste Runde. Sterne verschwinden sonst nie – auch nicht nach einem schlechten Tag." })
            : t({
                de: "Nimmt die Sterne dieser Woche weg, z. B. nach dem Ausprobieren. Sterne verschwinden sonst nie – auch nicht nach einem schlechten Tag.",
              })}
        </p>
        <div className="rw-chips">
          <button type="button" onClick={() => window.confirm(t({ de: "Alle Sterne dieser Tafel wegnehmen?" })) && onStartOver()}>
            🔄 {t({ de: "Sterne wegnehmen und neu anfangen" })}
          </button>
          {onRemove && (
            <button type="button" onClick={() => window.confirm(t({ de: "Diese Tafel ganz löschen?" })) && onRemove()}>
              🗑️ {t({ de: "Diese Tafel löschen" })}
            </button>
          )}
        </div>
      </SettingsGroup>
    </section>
  );
}
