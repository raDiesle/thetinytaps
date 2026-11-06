import type { CSSProperties, ReactNode } from "react";
import { dayKey } from "@/games/teeth/daytime";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { type TapState, tapState } from "@/lib/tapTargets";
import {
  AUTO_TITLES,
  type Board,
  type BoardTask,
  boardDays,
  cellKey,
  isFilled,
  isTemplateTitle,
  type LinkedDays,
  MAX_TASKS,
  type DayField,
  type DayPart,
  DAY_ORDER,
  dayFields,
  fourWeeks,
  periodDays,
  progress,
  shownSlots,
  taskSlots,
  weekday,
} from "./board";
import { type CatalogMark, DAY_NAMES, MARK_BY_ID, MARKS, REWARD_BY_ID, type Slot, SLOT_BY_ID, TASK_BY_ID, TEMPLATES, THEME_BY_ID, THEMES } from "./catalog";
import { ItemPic, MarkPic, Pic, picture, SheetStrip } from "./pictures";
import { RewardActions, SheetAction } from "./SheetAction";

/** „Woche vom ____“: the line on a printed week to write its first day on. */
export const WEEK_OF: Localized = { de: "Woche vom", en: "Week of", zh: "起始日期", hi: "हफ़्ता शुरू", es: "Semana del", ar: "أسبوع يبدأ في", ru: "Неделя с" };

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
    const own = board.title.trim();
    const template = TEMPLATES.find((tpl) => tpl.id === board.template)?.title;
    if (own) return isTemplateTitle(own, template) ? t(template) : own;
    return t(AUTO_TITLES[board.kind])(board.childName.trim());
  };
}

/** A task's words: the grown-up's own or the catalogue's. */
export function useTaskLabel() {
  const t = useT();
  return (task: { label?: string; catalog?: string }) => {
    const known = task.catalog ? TASK_BY_ID.get(task.catalog)?.label : undefined;
    return task.label ?? (known ? t(known) : "");
  };
}

/** A reward's words: the grown-up's own or the catalogue's. */
export function useRewardLabel() {
  const t = useT();
  return (reward: { label?: string; catalog?: string }) => {
    const known = reward.catalog ? REWARD_BY_ID.get(reward.catalog)?.label : undefined;
    return reward.label ?? (known ? t(known) : "");
  };
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
  edit = false,
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
  /** Being made or changed: its tasks in a row to tap, and its reward to tap (`data-edit`), never on paper. */
  edit?: boolean;
}) {
  const t = useT();
  const { speechLang } = useAppLanguage();
  const title = useBoardTitle()(board);
  const editing = edit && !look.print;
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
  const grey = greyPrint(look);
  const style = grey ? undefined : ({ "--rw-paper": theme.paper, "--rw-main": theme.main, "--rw-ink": theme.ink } as CSSProperties);
  const fieldProps = { mark, look, fresh, example };
  const dateFormat = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(speechLang, options);

  return (
    <div
      className={`rw-sheet rw-kind-${board.kind}${look.print ? " rw-on-paper" : ""}${grey ? " rw-grey" : ""}${example ? " rw-with-examples" : ""}${editing ? " rw-editing" : ""}`}
      style={style}
    >
      {look.print && look.color && <SheetStrip theme={theme} />}
      <header className="rw-head">
        <span className="rw-title">
          <span className="rw-title-mark" aria-hidden>
            <MarkPic mark={mark} />
          </span>{" "}
          {title}
        </span>
        {look.print && board.kind === "week" && <span className="rw-blank">{t(WEEK_OF)} ____________</span>}
        {look.print && board.kind === "day" && (
          <span className="rw-blank">{t({ de: "Datum", en: "Date", zh: "日期", hi: "तारीख़", es: "Fecha", ar: "التاريخ", ru: "Дата" })} ____________</span>
        )}
        {!look.print && board.kind === "day" && <span className="rw-blank">{dateFormat({ weekday: "long", day: "numeric", month: "long" }).format(day)}</span>}
        {board.kind === "month" && !fourWeeks(board) && <span className="rw-blank">{dateFormat({ month: "long", year: "numeric" }).format(day)}</span>}
      </header>
      {editing && <EditTasks board={board} />}
      <div className="rw-body">
        {board.kind === "week" && <WeekGrid board={board} stars={shown} real={real} linked={linked} today={today} day={day} {...fieldProps} />}
        {board.kind === "month" && <MonthSheet board={board} stars={shown} real={real} linked={linked} today={today} day={day} {...fieldProps} />}
        {board.kind === "day" && <DayCards board={board} stars={shown} real={real} linked={linked} today={today} day={day} {...fieldProps} />}
        {board.kind === "collect" && (
          <CollectPath
            board={board}
            count={count}
            real={Math.min(real?.count ?? 0, board.goal)}
            aspect={aspect}
            rewardLabel={rewardLabel}
            edit={editing}
            {...fieldProps}
          />
        )}
      </div>
      {board.kind !== "collect" && (board.reward || goal <= MAX_DOTS || editing) && (
        <footer className="rw-goal" data-edit={editing ? "reward" : undefined}>
          {editing && !board.reward && (
            <span className="rw-reward rw-reward-add">
              ＋ {t({ de: "Belohnung", en: "Reward", zh: "奖励", hi: "इनाम", es: "Premio", ar: "المكافأة", ru: "Награда" })}
            </span>
          )}
          {board.reward && (
            <span className="rw-reward">
              {editing && <RewardActions />}
              <span className="rw-reward-emoji" aria-hidden>
                <ItemPic item={board.reward} kind="reward" lines={grey} />
              </span>
              <span className="rw-reward-label">{rewardLabel(board.reward)}</span>
            </span>
          )}
          {goal <= MAX_DOTS ? (
            <span className="rw-dots" role="img" aria-label={`${count} / ${goal}`}>
              {Array.from({ length: goal }, (_, i) => (
                <span key={i} className={i < count ? `rw-dot filled${i >= realCount ? " example" : ""}` : "rw-dot"}>
                  {i < count && <MarkPic mark={mark} />}
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

/** The times of day a task's switches offer, in the day's order, with the words under the mouse. */
const SLOT_SWITCHES: { slot: Slot; emoji: string; label: Localized }[] = [
  { slot: "morning", emoji: "☀️", label: { de: "morgens" } },
  { slot: "noon", emoji: "🌤️", label: { de: "am Tag" } },
  { slot: "evening", emoji: "🌙", label: { de: "abends" } },
];

/**
 * While a board is made or changed, its tasks as cards in a row over the sheet – a tap on the picture swaps it, 🗑️ in
 * its corner takes it, and under it ☀️ 🌤️ 🌙 switch its times of day right there, in the order of the day (user
 * feedback, November 2026: WYSIWYG, no window for it) – and ＋ for one more. A collecting board has no times of day.
 */
function EditTasks({ board }: { board: Board }) {
  const t = useT();
  const taskLabel = useTaskLabel();
  const times = board.kind !== "collect";
  return (
    <div className="rw-edit-tasks">
      {board.tasks.map((task) => {
        const on = shownSlots(task);
        return (
          <span key={task.id} className="rw-edit-task">
            <span className="rw-edit-task-card" data-edit="task" data-task={task.id} role="button" tabIndex={0} title={taskLabel(task)}>
              <span className="rw-edit-task-pic" aria-hidden>
                <ItemPic item={task} />
              </span>
              <span className="rw-edit-task-name">{taskLabel(task)}</span>
              {(board.tasks.length > 1 || !times) && (
                <SheetAction act="delete" ask={t({ de: `„${taskLabel(task)}“ löschen?` })} data={{ "data-edit": "delete-task", "data-task": task.id }} />
              )}
            </span>
            {times && (
              <span className="rw-edit-slots">
                {SLOT_SWITCHES.map(({ slot, emoji, label }) => {
                  const active = on.includes(slot);
                  // The last time of day stays: a task without one would have no field.
                  const last = active && on.length === 1;
                  return last ? (
                    <span key={slot} className={`rw-edit-slot on fixed rw-slot-${slot}`} title={t(label)}>
                      {emoji}
                    </span>
                  ) : (
                    <span
                      key={slot}
                      className={`rw-edit-slot rw-slot-${slot}${active ? " on" : ""}`}
                      data-edit="slot"
                      data-task={task.id}
                      data-slot={slot}
                      role="switch"
                      aria-checked={active}
                      tabIndex={0}
                      title={t(label)}
                      aria-label={`${taskLabel(task)}: ${t(label)}`}
                    >
                      {emoji}
                    </span>
                  );
                })}
              </span>
            )}
          </span>
        );
      })}
      {board.tasks.length < MAX_TASKS && (
        <span
          className="rw-edit-task-card rw-edit-add"
          data-edit="add"
          role="button"
          tabIndex={0}
          aria-label={t({ de: "Aufgabe dazu", en: "Add a task", zh: "添加任务", hi: "काम जोड़ें", es: "Añadir tarea", ar: "إضافة مهمة", ru: "Добавить задание" })}
        >
          ＋
        </span>
      )}
    </div>
  );
}

/** A print in grey: line-art pictures to colour in instead of coloured ones. */
const greyPrint = (look: SheetLook) => look.print && !look.color;

interface FieldLook {
  mark: CatalogMark;
  look: SheetLook;
  fresh?: string | null;
  /** Example stars shown, if any. */
  example?: Record<string, number>;
}

/**
 * One field: a dashed ring, with the mark in it once it has its star. `hint` shows pale in an empty ring which task
 * it is for, where a day has several small fields (month); `slot` puts a small sun or moon on its edge, filled or not.
 * An example star (`isExample`) looks filled but stays open: a tap gives the real star.
 */
function Field({
  id,
  state,
  mark,
  look,
  fresh,
  next = false,
  hint,
  slot,
  isExample = false,
}: FieldLook & { id: string; state: FieldState; next?: boolean; hint?: ReactNode; slot?: Slot; isExample?: boolean }) {
  const real = isExample ? (state === "filled" ? "open" : state) : state;
  const tap: TapState = look.print || real === "future" ? "" : tapState({ goal: next || real === "open", done: real === "filled" });
  return (
    <div
      className={`rw-field ${state}${isExample ? " example" : ""}${next ? " next" : ""}${fresh === id ? " fresh" : ""}`}
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
          <span className="rw-mark">
            <MarkPic mark={mark} />
          </span>
        ) : look.colorIn ? (
          mark.outline ? (
            <svg className="rw-outline" viewBox="0 0 100 100" aria-hidden>
              <path d={mark.outline} />
            </svg>
          ) : (
            <span className="rw-mark pale">
              <MarkPic mark={mark} />
            </span>
          )
        ) : hint ? (
          <span className="rw-mark pale">{hint}</span>
        ) : null}
      </span>
    </div>
  );
}

/** A task's picture and words; `span` rows high where the task has a row per time of day. */
function TaskHead({ task, look, span = 1 }: { task: BoardTask; look: SheetLook; span?: number }) {
  const label = useTaskLabel()(task);
  return (
    <div className="rw-task" style={span > 1 ? { gridRow: `span ${span}` } : undefined}>
      <span className="rw-task-emoji" aria-hidden>
        <ItemPic item={task} lines={greyPrint(look)} />
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
const fieldLook = ({ mark, look, fresh, example }: GridProps): FieldLook => ({ mark, look, fresh, example });

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
          {first && <TaskHead task={task} look={look} span={span} />}
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

/** The fields of a board's day, grouped by the part of the day (morning, the day, evening), only parts that have fields. */
function dayGroups(board: Board): { part: DayPart; fields: DayField[] }[] {
  const fields = dayFields(board);
  return DAY_ORDER.map((part) => ({ part, fields: fields.filter((field) => field.part === part) })).filter((group) => group.fields.length > 0);
}

/**
 * A month board: its days (four weeks without dates, or a calendar month) in the look the grown-up chose – a calendar,
 * a table or week blocks. Every field shows its task's picture until it has its star, so no list of tasks is needed
 * over it, and a day's fields stand in the day's order, the morning's first, each part on its own tint (user feedback,
 * November 2026).
 */
function MonthSheet(props: GridProps) {
  const look = props.board.look ?? "calendar";
  if (look === "table") return <MonthTable {...props} />;
  if (look === "blocks") return <MonthBlocks {...props} />;
  return <MonthCalendar {...props} />;
}

/** The days of a month board's sheet, and for a calendar month how many boxes stay empty before its first. */
function monthDays(board: Board, day: Date): { days: Date[]; lead: number; dated: boolean } {
  const days = periodDays(board, day);
  return { days, lead: weekday(days[0]), dated: !fourWeeks(board) };
}

/** One field of a month board's day: the task's picture in its ring until the star comes. */
function MonthField({ props, d, field }: { props: GridProps; d: Date; field: DayField }) {
  return (
    <span className="rw-cell">
      <Field
        id={cellKey(d, field.task.id, field.slot)}
        slot={field.slot}
        hint={<ItemPic item={field.task} lines={greyPrint(props.look)} />}
        {...fieldOf(props, d, field.task, field.slot)}
        {...fieldLook(props)}
      />
    </span>
  );
}

/** A calendar: weekdays in columns, a box per day with its fields in the day's order, each part on its own tint. */
function MonthCalendar(props: GridProps) {
  const { board, today, day, look } = props;
  const t = useT();
  const names = t(DAY_NAMES);
  const { days, lead, dated } = monthDays(board, day);
  const weeks = Math.ceil((lead + days.length) / 7);
  const todayKey = dayKey(today);
  const groups = dayGroups(board);
  const tinted = groups.length > 1;
  return (
    <div className={`rw-calendar${dated ? " dated" : ""}`} style={{ gridTemplateRows: `auto repeat(${weeks}, minmax(0, 1fr))` }}>
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
            {dated && <span className="rw-mnum">{d.getDate()}</span>}
            {on && (
              <span className="rw-mfields">
                {groups.map(({ part, fields }) => (
                  <span key={part} className={`rw-mpart${tinted ? ` rw-tint-${part}` : ""}`} style={{ flexGrow: fields.length }}>
                    {fields.map((field) => (
                      <MonthField key={`${field.task.id}|${field.slot}`} props={props} d={d} field={field} />
                    ))}
                  </span>
                ))}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** The sign of a part of the day: ☀️ morning, 🌤️ the day, 🌙 evening. */
const PART_SIGN: Record<DayPart, string> = { morning: "☀️", day: "🌤️", evening: "🌙" };

/** A field's head in a table or a week block: its task's picture, with its time of day's sign where the day has parts. */
function FieldHead({ field, look, tinted }: { field: DayField; look: SheetLook; tinted: boolean }) {
  const label = useTaskLabel()(field.task);
  return (
    <span className={`rw-mhead${tinted ? ` rw-tint-${field.part}` : ""}`} title={label}>
      <span className="rw-mhead-pic" aria-hidden>
        <ItemPic item={field.task} lines={greyPrint(look)} />
      </span>
      {tinted && (
        <span className="rw-mhead-part" aria-hidden>
          {PART_SIGN[field.part]}
        </span>
      )}
    </span>
  );
}

/** A table: a row per task and time of day (the morning's first), a column per day, the weeks parted by a line. */
function MonthTable(props: GridProps) {
  const { board, today, day, look } = props;
  const t = useT();
  const names = t(DAY_NAMES);
  const { days, dated } = monthDays(board, day);
  const shown = days.filter((d) => board.days.includes(weekday(d)));
  const todayKey = dayKey(today);
  const groups = dayGroups(board);
  const tinted = groups.length > 1;
  const fields = groups.flatMap((group) => group.fields);
  const col = (d: Date) => `rw-tcol${weekday(d) === 6 ? " wk-end" : ""}${!look.print && dayKey(d) === todayKey ? " today" : ""}`;
  return (
    <div
      className="rw-table"
      style={{
        gridTemplateColumns: `minmax(0, 2.4fr) repeat(${shown.length}, minmax(0, 1fr))`,
        gridTemplateRows: `auto repeat(${fields.length}, minmax(0, 1fr))`,
      }}
    >
      <span />
      {shown.map((d) => (
        <span key={dayKey(d)} className={`rw-tday ${col(d)}`}>
          {names[weekday(d)].slice(0, 2)}
          {dated && <b>{d.getDate()}</b>}
        </span>
      ))}
      {fields.map((field) => (
        <div key={`${field.task.id}|${field.slot}`} className={`rw-trow${tinted ? ` rw-tint-${field.part}` : ""}`}>
          <FieldHead field={field} look={look} tinted={tinted} />
          {shown.map((d) => (
            <span key={dayKey(d)} className={`rw-cell ${col(d)}`}>
              <Field id={cellKey(d, field.task.id, field.slot)} slot={field.slot} {...fieldOf(props, d, field.task, field.slot)} {...fieldLook(props)} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Week blocks: each week a small chart of its own (a row per task and time of day, a column per day), two side by side. */
function MonthBlocks(props: GridProps) {
  const { board, today, day, look } = props;
  const t = useT();
  const names = t(DAY_NAMES);
  const { days, lead, dated } = monthDays(board, day);
  const todayKey = dayKey(today);
  const groups = dayGroups(board);
  const tinted = groups.length > 1;
  const fields = groups.flatMap((group) => group.fields);
  // Weeks from Monday to Sunday; a calendar month's first and last week keep empty places outside the month.
  const slots: (Date | null)[] = [...Array.from({ length: lead }, () => null), ...days];
  const weeks = Array.from({ length: Math.ceil(slots.length / 7) }, (_, w) => Array.from({ length: 7 }, (_, i) => slots[w * 7 + i] ?? null));
  const weekdays = [0, 1, 2, 3, 4, 5, 6].filter((wd) => board.days.includes(wd));
  return (
    <div className="rw-blocks" style={{ gridTemplateRows: `repeat(${Math.ceil(weeks.length / 2)}, minmax(0, 1fr))` }}>
      {weeks.map((week, w) => (
        <div
          key={w}
          className="rw-block"
          style={{
            gridTemplateColumns: `minmax(0, 1.6fr) repeat(${weekdays.length}, minmax(0, 1fr))`,
            gridTemplateRows: `auto repeat(${fields.length}, minmax(0, 1fr))`,
          }}
        >
          <span className="rw-block-name">{dated ? "" : t({ de: `${w + 1}. Woche` })}</span>
          {weekdays.map((wd) => {
            const d = week[wd];
            return (
              <span key={wd} className={`rw-tday${d && !look.print && dayKey(d) === todayKey ? " today" : ""}`}>
                {names[wd].slice(0, 2)}
                {dated && d && <b>{d.getDate()}</b>}
              </span>
            );
          })}
          {fields.map((field) => (
            <div key={`${field.task.id}|${field.slot}`} className={`rw-trow${tinted ? ` rw-tint-${field.part}` : ""}`}>
              <FieldHead field={field} look={look} tinted={tinted} />
              {weekdays.map((wd) => {
                const d = week[wd];
                return d ? (
                  <span key={wd} className={`rw-cell${!look.print && dayKey(d) === todayKey ? " today" : ""}`}>
                    <Field id={cellKey(d, field.task.id, field.slot)} slot={field.slot} {...fieldOf(props, d, field.task, field.slot)} {...fieldLook(props)} />
                  </span>
                ) : (
                  <span key={wd} className="rw-cell rw-tnone" />
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** The day's tasks as big cards side by side, each with its fields below (one per time of day). */
function DayCards(props: GridProps) {
  const { board, day, look } = props;
  const cols = board.tasks.length > 4 ? Math.ceil(board.tasks.length / 2) : Math.max(1, board.tasks.length);
  return (
    <div className="rw-cards" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {board.tasks.map((task) => (
        <div key={task.id} className="rw-card">
          <TaskHead task={task} look={look} />
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
  edit,
  ...look
}: FieldLook & {
  board: Board;
  /** Stars shown, examples included. */
  count: number;
  /** Real stars: the next free field is the one after them. */
  real: number;
  aspect: number;
  rewardLabel: (r: { label?: string; catalog?: string }) => string;
  /** Being made or changed: the reward at the end is a tap. */
  edit: boolean;
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
              {board.tasks.map((task) => (
                <ItemPic key={task.id} item={task} lines={greyPrint(look.look)} />
              ))}
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
      <div className="rw-cell rw-path-end" data-edit={edit ? "reward" : undefined} style={{ gridRow: end.row + 1, gridColumn: end.col + 1 }}>
        {edit && board.reward && <RewardActions />}
        <span className="rw-reward-emoji" aria-hidden>
          {board.reward ? <ItemPic item={board.reward} kind="reward" lines={greyPrint(look.look)} /> : <Pic src={picture("fest")} emoji="🎉" />}
        </span>
        {board.reward && <span className="rw-reward-label">{rewardLabel(board.reward)}</span>}
      </div>
    </div>
  );
}
