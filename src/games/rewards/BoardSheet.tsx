import type { CSSProperties } from "react";
import { dayKey } from "@/games/teeth/daytime";
import { type Localized, useT } from "@/lib/language";
import { type TapState, tapState } from "@/lib/tapTargets";
import { type Board, type BoardTask, boardDays, cellKey, isFilled, type LinkedDays, possessive, progress } from "./board";
import { type CatalogMark, MARK_BY_ID, MARKS, REWARD_BY_ID, TASK_BY_ID, THEME_BY_ID, THEMES } from "./catalog";

const DAY_NAMES: Localized<string[]> = { de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] };

/** Goals up to this many stars show one dot each under the reward; more show a bar. */
const MAX_DOTS = 15;

/** What a field is now: has its star, can get one, or lies in the future (a later day of the week). */
export type FieldState = "filled" | "open" | "future";

/** How a sheet is drawn: on screen with the stars there are, or empty on paper. */
export interface SheetLook {
  print: boolean;
  /** Paper only: grey instead of colours, to save ink. */
  color: boolean;
  /** Paper only: the mark's outline in each field, to colour in. */
  colorIn: boolean;
}

export const SCREEN_LOOK: SheetLook = { print: false, color: true, colorIn: false };

/** The heading: the grown-up's own, or one made from the kind and the child's name. */
export function useBoardTitle() {
  const t = useT();
  return (board: Board) => {
    if (board.title.trim()) return board.title.trim();
    const name = board.childName.trim();
    if (board.kind === "week") return name ? t({ de: `${possessive(name)} Sterne-Woche` }) : t({ de: "Meine Sterne-Woche" });
    if (board.kind === "day") return name ? t({ de: `${possessive(name)} Tag` }) : t({ de: "Mein Tag" });
    return name ? t({ de: `${possessive(name)} Sterne` }) : t({ de: "Meine Sterne" });
  };
}

/** A task's words: the grown-up's own or the catalogue's. */
export function useTaskLabel() {
  const t = useT();
  return (task: { label?: string; catalog?: string }) => task.label ?? (task.catalog ? t(TASK_BY_ID.get(task.catalog)?.label ?? { de: "" }) : "");
}

/** A reward's words: the grown-up's own or the catalogue's. */
export function useRewardLabel() {
  const t = useT();
  return (reward: { label?: string; catalog?: string }) => reward.label ?? (reward.catalog ? t(REWARD_BY_ID.get(reward.catalog)?.label ?? { de: "" }) : "");
}

/**
 * Where the fields of a collecting board go: a path that winds left to right, then right
 * to left, through a grid about as wide as the board, with the reward as the last stop.
 * Returns the grid size and the cell of each stop (`stops` = fields + 1).
 */
export function snakeLayout(stops: number, aspect: number): { cols: number; rows: number; cells: { row: number; col: number }[] } {
  const cols = Math.max(2, Math.min(stops, Math.round(Math.sqrt(stops * aspect))));
  const rows = Math.ceil(stops / cols);
  const cells = Array.from({ length: stops }, (_, i) => {
    const row = Math.floor(i / cols);
    const step = i % cols;
    return { row, col: row % 2 === 0 ? step : cols - 1 - step };
  });
  return { cols, rows, cells };
}

/**
 * A board as one picture, the same on screen and on paper: the heading, the fields
 * (a week grid, today's cards or a winding path) and the reward with a dot per star.
 * Pure markup – the screen adds its taps through `data-field` (see BoardScreen),
 * and every size is relative to the sheet (container units), so it fills a phone, a
 * tablet or an A4 page alike.
 */
export function BoardSheet({
  board,
  stars,
  linked,
  today,
  look,
  aspect,
  fresh,
  holding,
}: {
  board: Board;
  stars: Record<string, number> | undefined;
  linked: LinkedDays;
  today: Date;
  look: SheetLook;
  /** Width / height of the sheet, for the path of a collecting board. */
  aspect: number;
  /** The field that just got its star, to pop it in. */
  fresh?: string | null;
  /** The field a grown-up is holding, to fill its ring. */
  holding?: string | null;
}) {
  const t = useT();
  const title = useBoardTitle()(board);
  const rewardLabel = useRewardLabel();
  const theme = THEME_BY_ID.get(board.theme) ?? THEMES[0];
  const mark = MARK_BY_ID.get(board.mark) ?? MARKS[0];
  // Paper starts empty: the stars come on it with stickers or crayons.
  const shown = look.print ? undefined : stars;
  const { count, goal } = progress(board, shown, linked, today);
  // Grey prints take their colours from .rw-grey; inline ones would win over it.
  const grey = look.print && !look.color;
  const style = grey ? undefined : ({ "--rw-paper": theme.paper, "--rw-main": theme.main, "--rw-ink": theme.ink } as CSSProperties);
  const fieldProps = { mark, look, fresh, holding };

  return (
    <div className={`rw-sheet rw-${board.kind}${look.print ? " rw-on-paper" : ""}${grey ? " rw-grey" : ""}`} style={style}>
      <header className="rw-head">
        <span className="rw-title">
          <span className="rw-title-mark" aria-hidden>
            {mark.emoji}
          </span>{" "}
          {title}
        </span>
        {look.print && board.kind === "week" && <span className="rw-blank">{t({ de: "Woche vom" })} ____________</span>}
        {look.print && board.kind === "day" && <span className="rw-blank">{t({ de: "Datum" })} ____________</span>}
      </header>
      <div className="rw-body">
        {board.kind === "week" && <WeekGrid board={board} stars={shown} linked={linked} today={today} {...fieldProps} />}
        {board.kind === "day" && <DayCards board={board} stars={shown} linked={linked} today={today} {...fieldProps} />}
        {board.kind === "collect" && <CollectPath board={board} count={count} aspect={aspect} rewardLabel={rewardLabel} {...fieldProps} />}
      </div>
      {board.kind !== "collect" && (board.reward || goal <= MAX_DOTS) && (
        <footer className="rw-goal">
          {board.reward && (
            <span className="rw-reward">
              <span className="rw-reward-emoji" aria-hidden>
                {board.reward.emoji}
              </span>
              <span className="rw-reward-label">{rewardLabel(board.reward)}</span>
            </span>
          )}
          {goal <= MAX_DOTS ? (
            <span className="rw-dots" role="img" aria-label={`${count} / ${goal}`}>
              {Array.from({ length: goal }, (_, i) => (
                <span key={i} className={i < count ? "rw-dot filled" : "rw-dot"}>
                  {i < count && mark.emoji}
                </span>
              ))}
            </span>
          ) : (
            <span className="rw-bar" role="img" aria-label={`${count} / ${goal}`}>
              <span style={{ width: `${(100 * count) / goal}%` }} />
            </span>
          )}
        </footer>
      )}
    </div>
  );
}

interface FieldLook {
  mark: CatalogMark;
  look: SheetLook;
  fresh?: string | null;
  holding?: string | null;
}

/** One field: a dashed ring, with the mark in it once it has its star. */
function Field({ id, state, mark, look, fresh, holding, next = false }: FieldLook & { id: string; state: FieldState; next?: boolean }) {
  const tap: TapState = look.print || state === "future" ? "" : tapState({ goal: next || state === "open", done: state === "filled" });
  return (
    <div
      className={`rw-field ${state}${next ? " next" : ""}${fresh === id ? " fresh" : ""}${holding === id ? " holding" : ""}`}
      data-field={look.print ? undefined : id}
      data-state={state}
      data-tap={look.print ? undefined : tap}
    >
      <span className="rw-ring">
        {state === "filled" ? (
          <span className="rw-mark">{mark.emoji}</span>
        ) : look.colorIn ? (
          mark.outline ? (
            <svg className="rw-outline" viewBox="0 0 100 100" aria-hidden>
              <path d={mark.outline} />
            </svg>
          ) : (
            <span className="rw-mark pale">{mark.emoji}</span>
          )
        ) : null}
        {holding === id && (
          <svg className="rw-hold" viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r="46" pathLength={100} />
          </svg>
        )}
      </span>
    </div>
  );
}

function TaskHead({ task }: { task: BoardTask }) {
  const label = useTaskLabel()(task);
  return (
    <div className="rw-task">
      <span className="rw-task-emoji" aria-hidden>
        {task.emoji}
      </span>
      <span className="rw-task-label">{label}</span>
    </div>
  );
}

type GridProps = FieldLook & { board: Board; stars: Record<string, number> | undefined; linked: LinkedDays; today: Date };

const fieldState = (stars: Record<string, number> | undefined, linked: LinkedDays, day: Date, task: BoardTask, today: Date): FieldState =>
  isFilled(stars, linked, day, task) ? "filled" : dayKey(day) > dayKey(today) ? "future" : "open";

/** Tasks in rows, the chosen weekdays in columns, today's column marked on screen. */
function WeekGrid({ board, stars, linked, today, ...look }: GridProps) {
  const t = useT();
  const names = t(DAY_NAMES);
  const days = boardDays(board, today);
  const todayKey = dayKey(today);
  // On paper every day is just a day: no today, no future.
  const state = (day: Date, task: BoardTask): FieldState => (look.look.print ? "open" : fieldState(stars, linked, day, task, today));
  // A row is never much taller than a day column is wide: with one or two tasks the field can't grow
  // beyond its column anyway, so the rows stay together in the middle instead of stretching.
  const rowMax = `${(110 / (1.7 + days.length)).toFixed(1)}cqw`;
  return (
    <div
      className="rw-grid"
      style={{
        gridTemplateColumns: `minmax(0, 1.7fr) repeat(${days.length}, minmax(0, 1fr))`,
        gridTemplateRows: `auto repeat(${board.tasks.length}, minmax(0, ${rowMax}))`,
      }}
    >
      <span />
      {days.map((day) => (
        <span key={dayKey(day)} className={`rw-day${!look.look.print && dayKey(day) === todayKey ? " today" : ""}`}>
          {names[(day.getDay() + 6) % 7]}
        </span>
      ))}
      {board.tasks.map((task) => (
        <div key={task.id} className="rw-row">
          <TaskHead task={task} />
          {days.map((day) => (
            <div key={dayKey(day)} className={`rw-cell${!look.look.print && dayKey(day) === todayKey ? " today" : ""}`}>
              <Field id={cellKey(day, task.id)} state={state(day, task)} {...look} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Today's tasks as big cards side by side, each with its field below. */
function DayCards({ board, stars, linked, today, ...look }: GridProps) {
  const cols = board.tasks.length > 4 ? Math.ceil(board.tasks.length / 2) : Math.max(1, board.tasks.length);
  return (
    <div className="rw-cards" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {board.tasks.map((task) => (
        <div key={task.id} className="rw-card">
          <TaskHead task={task} />
          <div className="rw-cell">
            <Field id={cellKey(today, task.id)} state={look.look.print ? "open" : fieldState(stars, linked, today, task, today)} {...look} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Fields along a winding path, from the tasks it is for to the reward. */
function CollectPath({
  board,
  count,
  aspect,
  rewardLabel,
  ...look
}: FieldLook & { board: Board; count: number; aspect: number; rewardLabel: (r: { label?: string; catalog?: string }) => string }) {
  const { cols, rows, cells } = snakeLayout(board.goal + 1, aspect);
  const points = cells.map(({ row, col }) => `${col + 0.5},${row + 0.5}`).join(" ");
  const end = cells[cells.length - 1];
  return (
    <div className="rw-path" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
      <svg className="rw-path-line" viewBox={`0 0 ${cols} ${rows}`} preserveAspectRatio="none" aria-hidden>
        <polyline points={points} vectorEffect="non-scaling-stroke" />
      </svg>
      {cells.slice(0, -1).map(({ row, col }, i) => (
        <div key={i} className="rw-cell" style={{ gridRow: row + 1, gridColumn: col + 1 }}>
          {i === 0 && board.tasks.length > 0 && (
            <span className="rw-path-start" aria-hidden>
              {board.tasks.map((task) => task.emoji).join("")}
            </span>
          )}
          <Field id={`c${i}`} state={!look.look.print && i < count ? "filled" : "open"} next={!look.look.print && i === count} {...look} />
        </div>
      ))}
      <div className="rw-cell rw-path-end" style={{ gridRow: end.row + 1, gridColumn: end.col + 1 }}>
        <span className="rw-reward-emoji" aria-hidden>
          {board.reward?.emoji ?? "🎉"}
        </span>
        {board.reward && <span className="rw-reward-label">{rewardLabel(board.reward)}</span>}
      </div>
    </div>
  );
}
