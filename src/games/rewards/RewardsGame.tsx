import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { MenuHead } from "@/components/MenuTop";
import { categoryHref, categoryOf } from "@/content/games";
import { useGameSettings } from "@/lib/common";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { takeFinishedStep } from "@/lib/routine";
import { useStoredSettings } from "@/lib/storage";
import { addStar, type Board, isTemplateTitle, OLDEST_BACK, samePeriod, shiftPeriod, type StarLog, startOver, withKind } from "./board";
import { BoardScreen } from "./BoardScreen";
import { useBoardTitle } from "./BoardSheet";
import {
  type BoardKind,
  type ChartType,
  KINDS,
  MARK_BY_ID,
  PLAN_TEMPLATES,
  PLAN_VIEWS,
  type PlanTemplate,
  type PlanView,
  type Template,
  TEMPLATES,
} from "./catalog";
import { Editor } from "./Editor";
import { TemplateGallery } from "./Gallery";
import { BoardInfo, PlanInfo } from "./Info";
import { loadLinkedDays } from "./linked";
import { PanelButton, PRINT, useComputer, VIEW } from "./pageParts";
import { type Plan, parseRoutineStep, restartDay } from "./plan";
import { PlanEditor } from "./PlanEditor";
import { PlanGallery } from "./PlanGallery";
import { PlanPrint } from "./PlanPrint";
import { PlanScreen } from "./PlanScreen";
import { TODAY, usePlanTitle } from "./PlanSheet";
import { PLANNER_SETTINGS_KEY, plannerDefaults } from "./planSettings";
import { PrintPanel } from "./PrintPanel";
import { EARLIER, LATER, REVIEW, Review, usePeriodLabel, YESTERDAY } from "./Review";
import { CHARTS_KEY, type ChartsSettings, NO_STARS, REWARDS_SETTINGS_KEY, REWARDS_STARS_KEY, rewardsDefaults } from "./settings";
import { type Draft, Wizard, type WizardStart } from "./Wizard";
import "./rewards.css";
import "./planner.css";

/** The page's name, in the menu head and the browser tab: both things it makes, as parents search for them. */
export const REWARDS_TITLE: Localized = {
  de: "Belohnungstafel & Tagesplan",
  en: "Reward Chart & Day Plan",
  zh: "奖励表和日程表",
  hi: "इनाम चार्ट और दिन की योजना",
  es: "Tabla de premios y plan del día",
  ar: "لوحة المكافآت وخطة اليوم",
  ru: "Таблица наград и план дня",
};

/** „✏️ Gestalten“: the button on top and the heading of the editor below the chart. */
const DESIGN: Localized = { de: "Gestalten", en: "Design", zh: "设计", hi: "डिज़ाइन", es: "Diseñar", ar: "تصميم", ru: "Оформление" };
/** „🧩 Vorlagen“: beside the chart, and the button where there is no room for it. */
const TEMPLATES_LABEL: Localized = { de: "Vorlagen", en: "Templates", zh: "模板", hi: "टेम्पलेट", es: "Plantillas", ar: "القوالب", ru: "Шаблоны" };

type Panel = "info" | "edit" | "print" | "review";

/** The main views of a board: the same stars for a day, a week or a month. Collecting stands apart in the switch. */
const MAIN_KINDS = KINDS.filter((k) => k.id !== "collect");
const COLLECT_KIND = KINDS.find((k) => k.id === "collect");

/** How far a plan's day view goes back and ahead: a week either way. */
const DAYS_BACK = 7;
const DAYS_AHEAD = 6;

/** The wizard: closed, open on its first step, or on a template picked in the gallery. */
type WizardState = null | { start?: WizardStart };

/**
 * The Belohnungstafel and the Tagesplan on one page: the grown-up's boards (stars to collect) and plans (the day in
 * pictures) side by side in one row on top, the one chosen as big as the screen allows. „＋ Neu“ opens the wizard,
 * which asks step by step – kind, view, Vorlage, tasks or cards, reward, look – and shows every choice as a picture
 * of what it makes; with nothing made yet (a first visit) the page is the wizard. Above the chart its switch of views (a board's Tag, Woche, Monat and
 * Sammeln, a plan's Tag and Woche) with arrows to earlier days; beside it on wide screens the Vorlagen of its kind. On
 * a computer „Gestalten“ and „Drucken“ lie open below (scroll down); on phones and tablets they open from the buttons
 * on top. Not a game: no GameShell, no play time counted, so the evening routine and its star still work when play
 * time is over. `/tagesplan/` opens the same page on a plan.
 */
export function RewardsGame({ type: routeType = "board" }: { type?: ChartType }) {
  const t = useT();
  const location = useLocation();
  const category = categoryOf(location.pathname);
  const computer = useComputer();
  const [stored, setStored] = useStoredSettings(REWARDS_STARS_KEY, { log: NO_STARS });
  const [boards, updateBoards] = useGameSettings(REWARDS_SETTINGS_KEY, rewardsDefaults(stored.log));
  const [plans, updatePlans] = useGameSettings(PLANNER_SETTINGS_KEY, plannerDefaults(stored.log));
  const [page, updatePage] = useStoredSettings<ChartsSettings>(CHARTS_KEY, {});
  const [linked] = useState(loadLinkedDays);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [wizardState, setWizard] = useState<WizardState>(null);
  /** Weeks (days, months) back from the current one on a board, days from today on a plan; 0 is now. */
  const [back, setBack] = useState(0);
  const boardTitle = useBoardTitle();
  const planTitle = usePlanTitle();

  // `/tagesplan/` always opens on a plan; the home card's address on what was shown last.
  const [wanted, setType] = useState<ChartType>(() => (routeType === "plan" ? "plan" : (page.shown ?? routeType)));
  const board: Board | undefined = boards.boards.find((b) => b.id === boards.current) ?? boards.boards[0];
  const plan: Plan | undefined = plans.plans.find((p) => p.id === plans.current) ?? plans.plans[0];
  // Nothing made yet (a first visit): the page is the wizard, which can't be closed, as there is nothing behind it.
  const empty = !board && !plan;
  const wizard = wizardState ?? (empty ? {} : null);
  // The kind asked for while there is one; else the one there is (only plans made: /belohnungstafel/ shows a plan).
  const type: ChartType = empty || (wanted === "board" ? board : plan) ? wanted : wanted === "board" ? "plan" : "board";
  const log = stored.log;
  const setLog = (next: StarLog) => setStored({ log: next });
  const today = new Date();
  const boardDay = back === 0 || !board ? today : shiftPeriod(board.kind, today, -back);
  const planDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (plan?.view === "day" ? -back : 0), 12);

  // Back from a game a plan's card opened (the brushing): that card gets its tick, whatever time of day the game counted.
  useEffect(() => {
    const finished = takeFinishedStep(location.pathname);
    if (!finished) return;
    const { planId, key } = parseRoutineStep(finished);
    if (!log[planId]?.[key]) setLog(addStar(log, planId, key, new Date()));
  }, []);

  // Another board, plan or view starts at today again.
  const shownId = type === "board" ? `${board?.id}|${board?.kind}` : `${plan?.id}|${plan?.view}`;
  useEffect(() => setBack(0), [shownId]);

  // A tab says which board or plan it is: its own heading or the child's name, else the template's name.
  const boardTab = (b: Board) => {
    const template = TEMPLATES.find((tpl) => tpl.id === b.template);
    return b.title.trim() || b.childName.trim() || !template ? boardTitle(b) : t(template.label);
  };
  const planTab = (p: Plan) => {
    const template = PLAN_TEMPLATES.find((tpl) => tpl.id === p.template);
    return p.childName.trim() || !template ? planTitle(p) : t(template.label);
  };

  const changeBoard = (patch: Partial<Board>) => updateBoards({ boards: boards.boards.map((b) => (b.id === board?.id ? { ...b, ...patch } : b)) });
  const changePlan = (next: Plan) => updatePlans({ plans: plans.plans.map((p) => (p.id === next.id ? next : p)) });
  const setKind = (kind: BoardKind) => {
    if (!board) return;
    const template = TEMPLATES.find((tpl) => tpl.id === board.template);
    changeBoard(withKind(board, kind, isTemplateTitle(board.title, template?.title) ? board.title : ""));
  };
  const setView = (view: PlanView) => plan && changePlan({ ...plan, view });
  const show = (shown: ChartType) => {
    setWizard(null);
    setType(shown);
    updatePage({ shown });
  };
  const showBoard = (id: string) => {
    updateBoards({ current: id });
    show("board");
  };
  const showPlan = (id: string) => {
    updatePlans({ current: id });
    show("plan");
  };
  // On a computer the panels are always open below the chart: the buttons on top only scroll there.
  const toggle = (which: Panel) => {
    setWizard(null);
    if (computer && which !== "info" && which !== "review") document.getElementById(`rw-${which}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    else setPanel(panel === which ? null : which);
  };
  const openWizard = (start?: WizardStart) => {
    setPanel(null);
    setWizard({ start });
  };
  // Closing the wizard saves the page's choice, so a first visit that looked and left starts on the chart next time.
  const closeWizard = () => show(type);
  /** A template from the gallery: the board or plan made from it before, with its stars, or the wizard on it. */
  const pickTemplate = (template: Template) => {
    const made = boards.boards.find((b) => b.template === template.id);
    if (made) showBoard(made.id);
    else openWizard({ type: "board", template });
  };
  const pickPlanTemplate = (template: PlanTemplate) => {
    const made = plans.plans.find((p) => p.template === template.id);
    if (made) showPlan(made.id);
    else openWizard({ type: "plan", template });
  };
  const add = (draft: Draft) => {
    if (draft.type === "board") updateBoards({ boards: [...boards.boards, draft.board], current: draft.board.id });
    else updatePlans({ plans: [...plans.plans, draft.plan], current: draft.plan.id });
    show(draft.type);
  };
  const removeBoard = (gone: Board) => {
    const rest = boards.boards.filter((b) => b.id !== gone.id);
    setLog(Object.fromEntries(Object.entries(log).filter(([id]) => id !== gone.id)));
    updateBoards({ boards: rest, current: rest[0].id });
    setPanel(null);
  };
  const removePlan = (gone: Plan) => {
    const rest = plans.plans.filter((p) => p.id !== gone.id);
    setLog(Object.fromEntries(Object.entries(log).filter(([id]) => id !== gone.id)));
    updatePlans({ plans: rest, current: rest[0].id });
    setPanel(null);
  };

  const editor =
    type === "board"
      ? board && (
          <Editor
            board={board}
            onChange={changeBoard}
            onStartOver={() => setLog(startOver(log, board, boardDay))}
            onRemove={boards.boards.length > 1 ? () => removeBoard(board) : undefined}
          />
        )
      : plan && (
          <PlanEditor
            key={plan.id}
            plan={plan}
            day={planDay}
            onChange={changePlan}
            onRestartToday={() => setLog(restartDay(log, plan.id, today))}
            onRemove={plans.plans.length > 1 ? () => removePlan(plan) : undefined}
          />
        );
  const print =
    type === "board"
      ? board && <PrintPanel board={board} options={boards.print} onChange={(patch) => updateBoards({ print: { ...boards.print, ...patch } })} />
      : plan && <PlanPrint plan={plan} day={planDay} options={plans.print} onChange={(patch) => updatePlans({ print: { ...plans.print, ...patch } })} />;
  const screen =
    type === "board"
      ? board && (
          <BoardScreen
            board={board}
            log={log}
            setLog={setLog}
            linked={linked}
            day={boardDay}
            sounds={boards.sounds}
            speech={boards.speech}
            onExamplesOff={() => changeBoard({ examples: false })}
          />
        )
      : plan && (
          <PlanScreen
            plan={plan}
            log={log}
            setLog={setLog}
            linked={linked}
            day={planDay}
            sounds={plans.sounds}
            speech={plans.speech}
            onExamplesOff={() => changePlan({ ...plan, examples: false })}
          />
        );
  const review = type === "board" && !!board && board.kind !== "collect";
  const main = wizard ? (
    <Wizard
      key={wizard.start ? `${wizard.start.type}-${wizard.start.template.id}` : "new"}
      type={type}
      start={wizard.start}
      onDone={add}
      onCancel={empty ? undefined : closeWizard}
    />
  ) : !computer && panel === "print" ? (
    print
  ) : panel === "review" && review && board ? (
    <Review board={board} log={log} linked={linked} sounds={boards.sounds} onClose={() => setPanel(null)} />
  ) : (
    <div className="rw-main">
      {screen}
      <aside className="rw-side" aria-label={t(TEMPLATES_LABEL)}>
        <h2 className="rw-side-title">🧩 {t(TEMPLATES_LABEL)}</h2>
        {type === "board" ? (
          <TemplateGallery selected={board?.template} onPick={pickTemplate} />
        ) : (
          <PlanGallery selected={plan?.template} onPick={pickPlanTemplate} />
        )}
      </aside>
    </div>
  );

  return (
    <main className={`start-screen rw-page-screen${computer ? " rw-computer" : ""}`}>
      {/* The first screen: everything down to the chart, which fills what is left of it. */}
      <div className="rw-first">
        <MenuHead
          to={category ? categoryHref(category) : "/"}
          back={
            category
              ? t(category.title)
              : t({ de: "Alle Spiele", en: "All games", zh: "全部游戏", hi: "सभी खेल", es: "Todos los juegos", ar: "كل الألعاب", ru: "Все игры" })
          }
          title={
            <>
              <span aria-hidden>🌟</span> {t(REWARDS_TITLE)}
            </>
          }
        >
          {/* While the wizard is open, nothing on top belongs to the chart behind it. */}
          {!wizard && (
            <div className="panel-buttons">
              <PanelButton
                open={panel === "info"}
                onClick={() => toggle("info")}
                emoji="ℹ️"
                label={
                  type === "board"
                    ? t({
                        de: "Über die Tafel",
                        en: "About the chart",
                        zh: "关于奖励表",
                        hi: "इनाम चार्ट के बारे में",
                        es: "Sobre la tabla",
                        ar: "عن اللوحة",
                        ru: "О таблице",
                      })
                    : t({
                        de: "Über den Plan",
                        en: "About the plan",
                        zh: "关于日程表",
                        hi: "योजना के बारे में",
                        es: "Sobre el plan",
                        ar: "عن الخطة",
                        ru: "О плане",
                      })
                }
              />
              <PanelButton open={!computer && panel === "edit"} onClick={() => toggle("edit")} emoji="✏️" label={t(DESIGN)} />
              <PanelButton open={!computer && panel === "print"} onClick={() => toggle("print")} emoji="🖨️" label={t(PRINT)} />
              {review && <PanelButton open={panel === "review"} onClick={() => toggle("review")} emoji="📜" label={t(REVIEW)} />}
            </div>
          )}
        </MenuHead>

        {/* Nothing made yet: no row of tabs, the wizard has the page. */}
        {!empty && (
          <div className="rw-pickers">
            {/* While the wizard is open its own steps choose the view. */}
            {!wizard && type === "board" && board && (
              <div className="rw-switch">
                <ViewSwitch views={MAIN_KINDS} selected={board.kind} onPick={setKind} />
                {COLLECT_KIND && (
                  <button
                    type="button"
                    className={`rw-collect-view${board.kind === "collect" ? " selected" : ""}`}
                    aria-pressed={board.kind === "collect"}
                    title={t(COLLECT_KIND.hint)}
                    onClick={() => setKind("collect")}
                  >
                    <span aria-hidden>{COLLECT_KIND.emoji}</span> {t(COLLECT_KIND.label)}
                  </button>
                )}
                {board.kind !== "collect" && panel !== "review" && <PeriodNav kind={board.kind} day={boardDay} back={back} setBack={setBack} />}
              </div>
            )}
            {!wizard && type === "plan" && plan && (
              <div className="rw-switch">
                <ViewSwitch views={PLAN_VIEWS} selected={plan.view} onPick={setView} />
                {plan.view === "day" && <DayNav day={planDay} shift={-back} setShift={(shift) => setBack(-shift)} />}
              </div>
            )}
            <nav
              className="rw-boards"
              aria-label={t({
                de: "Tafeln und Pläne",
                en: "Charts and plans",
                zh: "奖励表和日程表",
                hi: "चार्ट और योजनाएँ",
                es: "Tablas y planes",
                ar: "اللوحات والخطط",
                ru: "Таблицы и планы",
              })}
            >
              {boards.boards.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={type === "board" && b.id === board?.id && !wizard ? "selected" : undefined}
                  aria-pressed={type === "board" && b.id === board?.id}
                  onClick={() => showBoard(b.id)}
                >
                  <span aria-hidden>{TEMPLATES.find((tpl) => tpl.id === b.template)?.emoji ?? MARK_BY_ID.get(b.mark)?.emoji}</span> {boardTab(b)}
                </button>
              ))}
              {plans.plans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={type === "plan" && p.id === plan?.id && !wizard ? "selected" : undefined}
                  aria-pressed={type === "plan" && p.id === plan?.id}
                  onClick={() => showPlan(p.id)}
                >
                  <span aria-hidden>{PLAN_TEMPLATES.find((tpl) => tpl.id === p.template)?.emoji ?? "🗓️"}</span> {planTab(p)}
                </button>
              ))}
              <button type="button" className="rw-add" aria-pressed={!!wizard && !wizard.start} onClick={() => openWizard()}>
                ＋ {t({ de: "Neu", en: "New", zh: "新建", hi: "नया", es: "Nuevo", ar: "جديد", ru: "Создать" })}
              </button>
              <button type="button" className="rw-templates-button" onClick={() => openWizard()}>
                🧩 {t(TEMPLATES_LABEL)}
              </button>
            </nav>
          </div>
        )}

        {panel === "info" && (type === "board" ? <BoardInfo /> : <PlanInfo />)}
        {!computer && panel === "edit" && !wizard && editor}
        {main}
      </div>
      {computer && !wizard && (
        <div className="rw-below">
          <section id="rw-edit" className="rw-below-part">
            <h2 className="rw-panel-title">✏️ {t(DESIGN)}</h2>
            {editor}
          </section>
          <section id="rw-print" className="rw-below-part">
            {print}
          </section>
        </div>
      )}
    </main>
  );
}

/** The big switch of views above the chart: a board's Tag, Woche, Monat or a plan's Tag, Woche. */
function ViewSwitch<V extends string>({
  views,
  selected,
  onPick,
}: {
  views: { id: V; emoji: string; label: Localized; hint: Localized }[];
  selected: V;
  onPick: (view: V) => void;
}) {
  const t = useT();
  return (
    <div className="rw-views" role="group" aria-label={t(VIEW)}>
      {views.map((view) => (
        <button
          key={view.id}
          type="button"
          className={view.id === selected ? "selected" : undefined}
          aria-pressed={view.id === selected}
          title={t(view.hint)}
          onClick={() => onPick(view.id)}
        >
          <span className="rw-view-emoji" aria-hidden>
            {view.emoji}
          </span>{" "}
          {t(view.label)}
        </button>
      ))}
    </div>
  );
}

/** ‹ and › around the day, week or month of a board: back to earlier ones to add a forgotten star, never into the future. */
function PeriodNav({ kind, day, back, setBack }: { kind: BoardKind; day: Date; back: number; setBack: (back: number) => void }) {
  const t = useT();
  const label = usePeriodLabel();
  return (
    <span className="rw-period">
      <button type="button" aria-label={t(EARLIER)} disabled={back >= OLDEST_BACK[kind]} onClick={() => setBack(back + 1)}>
        ‹
      </button>
      <span className={`rw-period-label${samePeriod(kind, day, new Date()) ? "" : " past"}`}>{label(kind, back, day)}</span>
      <button type="button" aria-label={t(LATER)} disabled={back === 0} onClick={() => setBack(back - 1)}>
        ›
      </button>
    </span>
  );
}

/** ‹ and › around a plan's day: a week back and ahead, to see what tomorrow brings or tick yesterday's. */
function DayNav({ day, shift, setShift }: { day: Date; shift: number; setShift: (shift: number) => void }) {
  const t = useT();
  const { speechLang } = useAppLanguage();
  const label =
    shift === 0
      ? t(TODAY)
      : shift === 1
        ? t({ de: "Morgen", en: "Tomorrow", zh: "明天", hi: "आने वाला कल", es: "Mañana", ar: "غدًا", ru: "Завтра" })
        : shift === -1
          ? t(YESTERDAY)
          : new Intl.DateTimeFormat(speechLang, { weekday: "short", day: "numeric", month: "numeric" }).format(day);
  return (
    <span className="rw-period">
      <button type="button" aria-label={t(EARLIER)} disabled={shift <= -DAYS_BACK} onClick={() => setShift(shift - 1)}>
        ‹
      </button>
      <span className={`rw-period-label${shift === 0 ? "" : " past"}`}>{label}</span>
      <button type="button" aria-label={t(LATER)} disabled={shift >= DAYS_AHEAD} onClick={() => setShift(shift + 1)}>
        ›
      </button>
    </span>
  );
}
