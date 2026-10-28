import type { CSSProperties } from "react";
import { dayKey } from "@/games/teeth/daytime";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { type TapState, tapState } from "@/lib/tapTargets";
import { type Board, type BoardTask, boardDays, cellKey, isFilled, type LinkedDays, monthOf, possessive, progress, taskSlots, weekday } from "./board";
import { type CatalogMark, MARK_BY_ID, MARKS, REWARD_BY_ID, type Slot, SLOT_BY_ID, TASK_BY_ID, THEME_BY_ID, THEMES } from "./catalog";

const DAY_NAMES: Localized<string[]> = { de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] };

/** Goals up to this many stars show one dot each under the reward; more show a bar. */
const MAX_DOTS = 15;

/** What a field is now: has its star, can get one, or lies in the future (a later day of the week or month). */
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
    if (board.kind === "month") return name ? t({ de: `${possessive(name)} Sterne-Monat` }) : t({ de: "Mein Sterne-Monat" });
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
  examples,
  linked,
  today,
  day = today,
  look,
  aspect,
  fresh,
  holding,
}: {
  board: Board;
  stars: Record<string, number> | undefined;
  /** Example stars to show pale where there is no real one (`exampleStars`); never on paper. */
  examples?: Record<string, number> | null;
  linked: LinkedDays;
  /** The real today: highlighted, and the days after it can't get a star yet. */
  today: Date;
  /** A day of the week, month or day shown – today's unless a grown-up looks back. */
  day?: Date;
  look: SheetLook;
  /** Width / height of the sheet, for the path of a collecting board. */
  aspect: number;
  /** The field that just got its star, to pop it in. */
  fresh?: string | null;
  /** The field a grown-up is holding, to fill its ring. */
  holding?: string | null;
}) {
  const t = useT();
  const { speechLang } = useAppLanguage();
  const title = useBoardTitle()(board);
  const rewardLabel = useRewardLabel();
  const theme = THEME_BY_ID.get(board.theme) ?? THEMES[0];
  const mark = MARK_BY_ID.get(board.mark) ?? MARKS[0];
  // Paper starts empty: the stars come on it with stickers or crayons.
  const real = look.print ? undefined : stars;
  const example = look.print || !examples ? undefined : examples;
  const shown = example ? { ...example, ...real, count: Math.max(real?.count ?? 0, example.count ?? 0) } : real;
  const { count, goal } = progress(board, shown, linked, day);
  const realCount = example ? progress(board, real, linked, day).count : count;
  // Grey prints take their colours from .rw-grey; inline ones would win over it.
  const grey = look.print && !look.color;
  const style = grey ? undefined : ({ "--rw-paper": theme.paper, "--rw-main": theme.main, "--rw-ink": theme.ink } as CSSProperties);
  const fieldProps = { mark, look, fresh, holding, example };
  const dateFormat = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(speechLang, options);
  const week = board.kind === "week" ? boardDays({ ...board, days: [0, 1, 2, 3, 4, 5, 6] }, day) : [];

  return (
    <div
      className={`rw-sheet rw-kind-${board.kind}${look.print ? " rw-on-paper" : ""}${grey ? " rw-grey" : ""}${example ? " rw-with-examples" : ""}`}
      style={style}
    >
      <header className="rw-head">
        <span className="rw-title">
          <span className="rw-title-mark" aria-hidden>
            {mark.emoji}
          </span>{" "}
          {title}
        </span>
        {look.print && board.kind === "week" && <span className="rw-blank">{t({ de: "Woche vom" })} ____________</span>}
        {look.print && board.kind === "day" && <span className="rw-blank">{t({ de: "Datum" })} ____________</span>}
        {!look.print && board.kind === "week" && (
          <span className="rw-blank">{dateFormat({ day: "numeric", month: "short" }).formatRange(week[0], week[6])}</span>
        )}
        {!look.print && board.kind === "day" && <span className="rw-blank">{dateFormat({ weekday: "long", day: "numeric", month: "long" }).format(day)}</span>}
        {board.kind === "month" && <span className="rw-blank">{dateFormat({ month: "long", year: "numeric" }).format(day)}</span>}
      </header>
      <div className="rw-body">
        {board.kind === "week" && <WeekGrid board={board} stars={shown} real={real} linked={linked} today={today} day={day} {...fieldProps} />}
        {board.kind === "month" && <MonthGrid board={board} stars={shown} real={real} linked={linked} today={today} day={day} {...fieldProps} />}
        {board.kind === "day" && <DayCards board={board} stars={shown} real={real} linked={linked} today={today} day={day} {...fieldProps} />}
        {board.kind === "collect" && (
          <CollectPath board={board} count={count} real={Math.min(real?.count ?? 0, board.goal)} aspect={aspect} rewardLabel={rewardLabel} {...fieldProps} />
        )}
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
                <span key={i} className={i < count ? `rw-dot filled${i >= realCount ? " example" : ""}` : "rw-dot"}>
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
  /** Example stars shown, if any. */
  example?: Record<string, number>;
}

/**
 * One field: a dashed ring, with the mark in it once it has its star. `hint` shows pale in an empty ring which task
 * it is for, where a day has several small fields (month); `slot` puts a small sun or moon on its edge, filled or not.
 * An example star (`isExample`) looks filled but stays open: holding it gives the real star.
 */
function Field({
  id,
  state,
  mark,
  look,
  fresh,
  holding,
  next = false,
  hint,
  slot,
  isExample = false,
}: FieldLook & { id: string; state: FieldState; next?: boolean; hint?: string; slot?: Slot; isExample?: boolean }) {
  const real = isExample ? (state === "filled" ? "open" : state) : state;
  const tap: TapState = look.print || real === "future" ? "" : tapState({ goal: next || real === "open", done: real === "filled" });
  return (
    <div
      className={`rw-field ${state}${isExample ? " example" : ""}${next ? " next" : ""}${fresh === id ? " fresh" : ""}${holding === id ? " holding" : ""}`}
      data-field={look.print ? undefined : id}
      data-state={real}
      data-tap={look.print ? undefined : tap}
    >
      <span className="rw-ring">
        {slot && (
          <span className="rw-slot" aria-hidden>
            {SLOT_BY_ID.get(slot)?.emoji}
          </span>
        )}
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
        ) : hint ? (
          <span className="rw-mark pale">{hint}</span>
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

/** A task's picture and words; `span` rows high where the task has a row per time of day. */
function TaskHead({ task, span = 1 }: { task: BoardTask; span?: number }) {
  const label = useTaskLabel()(task);
  return (
    <div className="rw-task" style={span > 1 ? { gridRow: `span ${span}` } : undefined}>
      <span className="rw-task-emoji" aria-hidden>
        {task.emoji}
      </span>
      <span className="rw-task-label">{label}</span>
    </div>
  );
}

type GridProps = FieldLook & {
  board: Board;
  /** Real stars and example ones together. */
  stars: Record<string, number> | undefined;
  /** Only the real ones: a field filled by an example alone stays open. */
  real: Record<string, number> | undefined;
  linked: LinkedDays;
  today: Date;
  day: Date;
};

/** The state of a task's field on a day, and whether only an example star fills it. */
function fieldOf({ stars, real, linked, today, look }: GridProps, day: Date, task: BoardTask, slot: Slot | undefined) {
  // On paper every day is just a day: no today, no future.
  if (look.print) return { state: "open" as FieldState, isExample: false };
  const filled = isFilled(stars, linked, day, task, slot);
  const state: FieldState = filled ? "filled" : dayKey(day) > dayKey(today) ? "future" : "open";
  return { state, isExample: filled && !isFilled(real, linked, day, task, slot) };
}

/** The props of `Field` that come from the sheet, without the grid's own. */
const fieldLook = ({ mark, look, fresh, holding, example }: GridProps): FieldLook => ({ mark, look, fresh, holding, example });

/** Tasks in rows (a row per time of day where a task has several), the chosen weekdays in columns, today's column marked on screen. */
function WeekGrid(props: GridProps) {
  const { board, today, day, look } = props;
  const t = useT();
  const names = t(DAY_NAMES);
  const days = boardDays(board, day);
  const todayKey = dayKey(today);
  const rows = board.tasks.flatMap((task) => taskSlots(task).map((slot, i) => ({ task, slot, first: i === 0, span: taskSlots(task).length })));
  const isToday = (d: Date) => !look.print && dayKey(d) === todayKey;
  // A row is never much taller than a day column is wide: with one or two tasks the field can't grow
  // beyond its column anyway, so the rows stay together in the middle instead of stretching.
  const rowMax = `${(110 / (1.7 + days.length)).toFixed(1)}cqw`;
  return (
    <div
      className="rw-grid"
      style={{
        gridTemplateColumns: `minmax(0, 1.7fr) repeat(${days.length}, minmax(0, 1fr))`,
        gridTemplateRows: `auto repeat(${rows.length}, minmax(0, ${rowMax}))`,
      }}
    >
      <span />
      {days.map((d) => (
        <span key={dayKey(d)} className={`rw-day${isToday(d) ? " today" : ""}`}>
          {names[weekday(d)]}
        </span>
      ))}
      {rows.map(({ task, slot, first, span }) => (
        <div key={`${task.id}|${slot}`} className="rw-row">
          {/* A task with several times of day has one head over all its rows. */}
          {first && <TaskHead task={task} span={span} />}
          {days.map((d) => (
            <div key={dayKey(d)} className={`rw-cell${isToday(d) ? " today" : ""}`}>
              <Field id={cellKey(d, task.id, slot)} slot={slot} {...fieldOf(props, d, task, slot)} {...fieldLook(props)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * A calendar of the month: weekdays in columns, a box per day with its number and one field per task and time of day
 * (the task's picture pale in it when there are several tasks). Weekdays the board leaves out stay as plain boxes.
 */
function MonthGrid(props: GridProps) {
  const { board, today, day, look } = props;
  const t = useT();
  const names = t(DAY_NAMES);
  const days = monthOf(day);
  const lead = weekday(days[0]);
  const weeks = Math.ceil((lead + days.length) / 7);
  const todayKey = dayKey(today);
  const several = board.tasks.length > 1;
  return (
    <div className="rw-calendar" style={{ gridTemplateRows: `auto repeat(${weeks}, minmax(0, 1fr))` }}>
      {names.map((name) => (
        <span key={name} className="rw-day">
          {name}
        </span>
      ))}
      {days.map((d, i) => {
        const on = board.days.includes(weekday(d));
        const isToday = !look.print && dayKey(d) === todayKey;
        return (
          <div key={dayKey(d)} className={`rw-mday${isToday ? " today" : ""}${on ? "" : " off"}`} style={i === 0 ? { gridColumnStart: lead + 1 } : undefined}>
            <span className="rw-mnum">{d.getDate()}</span>
            {on && (
              <span className="rw-mfields">
                {board.tasks.flatMap((task) =>
                  taskSlots(task).map((slot) => (
                    <span key={`${task.id}|${slot}`} className="rw-cell">
                      <Field
                        id={cellKey(d, task.id, slot)}
                        slot={slot}
                        hint={several ? task.emoji : undefined}
                        {...fieldOf(props, d, task, slot)}
                        {...fieldLook(props)}
                      />
                    </span>
                  )),
                )}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** The day's tasks as big cards side by side, each with its fields below (one per time of day). */
function DayCards(props: GridProps) {
  const { board, day } = props;
  const cols = board.tasks.length > 4 ? Math.ceil(board.tasks.length / 2) : Math.max(1, board.tasks.length);
  return (
    <div className="rw-cards" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {board.tasks.map((task) => (
        <div key={task.id} className="rw-card">
          <TaskHead task={task} />
          <div className="rw-card-fields">
            {taskSlots(task).map((slot) => (
              <div key={String(slot)} className="rw-cell">
                <Field id={cellKey(day, task.id, slot)} slot={slot} {...fieldOf(props, day, task, slot)} {...fieldLook(props)} />
              </div>
            ))}
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
  real,
  aspect,
  rewardLabel,
  ...look
}: FieldLook & {
  board: Board;
  /** Stars shown, examples included. */
  count: number;
  /** Real stars: the next free field is the one after them. */
  real: number;
  aspect: number;
  rewardLabel: (r: { label?: string; catalog?: string }) => string;
}) {
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
          <Field
            id={`c${i}`}
            state={!look.look.print && i < count ? "filled" : "open"}
            isExample={!look.look.print && i >= real && i < count}
            next={!look.look.print && i === real}
            {...look}
          />
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
