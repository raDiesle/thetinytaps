import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { SeoText } from "@/components/SeoText";
import { Sky } from "@/components/Sky";
import { MenuHead } from "@/components/MenuTop";
import { categoryHref, categoryOf } from "@/content/games";
import { useGameSettings } from "@/lib/common";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { takeFinishedStep } from "@/lib/routine";
import { useStoredSettings } from "@/lib/storage";
import { type Board, isTemplateTitle, parseCellKey, OLDEST_BACK, samePeriod, shiftPeriod, type StarLog, startOver, withKind } from "./board";
import { BoardScreen } from "./BoardScreen";
import { useBoardTitle } from "./BoardSheet";
import { Certificate, CERTIFICATE } from "./Certificate";
import { type BoardKind, type ChartType, MARK_BY_ID, PLAN_TEMPLATES, type PlanTemplate, type Template, TEMPLATES } from "./catalog";
import { Editor } from "./Editor";
import { TemplateGallery } from "./Gallery";
import { loadLinkedDays } from "./linked";
import { PanelButton, PRINT, useComputer } from "./pageParts";
import { counting, fromOlder, type Plan, parseRoutineStep, restartDay, starsOf, stepsOn } from "./plan";
import { PlanEditor } from "./PlanEditor";
import { PlanGallery } from "./PlanGallery";
import { PlanPrint } from "./PlanPrint";
import { PlanScreen } from "./PlanScreen";
import { TODAY, usePlanTitle } from "./PlanSheet";
import { PLANNER_SETTINGS_KEY, plannerDefaults } from "./planSettings";
import { PrintPanel } from "./PrintPanel";
import { EARLIER, LATER, REVIEW, Review, usePeriodLabel, YESTERDAY } from "./Review";
import { NO_STARS, pageStart, REWARDS_SETTINGS_KEY, REWARDS_STARS_KEY, rewardsDefaults } from "./settings";
import { ChartEditor } from "./ChartEditor";
import { type Draft, Wizard, type WizardStart } from "./Wizard";
import "./rewards.css";
import "./planner.css";

/** The page's name, in the menu head and the browser tab: both things it makes, as parents search for them. */
export const REWARDS_TITLE: Localized = {
  de: "Belohnungstafel & Zeitplan",
  en: "Reward Chart & Schedule",
  zh: "奖励表和时间表",
  hi: "इनाम चार्ट और समय-सारणी",
  es: "Tabla de premios y horario",
  ar: "لوحة المكافآت والجدول الزمني",
  ru: "Таблица наград и расписание",
};

/** „✏️ Gestalten“: the button on top and the heading of the editor below the chart. */
const DESIGN: Localized = { de: "Gestalten", en: "Design", zh: "设计", hi: "डिज़ाइन", es: "Diseñar", ar: "تصميم", ru: "Оформление" };
/** „🧩 Vorlagen“: beside the chart, and the button where there is no room for it. */
const TEMPLATES_LABEL: Localized = { de: "Vorlagen", en: "Templates", zh: "模板", hi: "टेम्पलेट", es: "Plantillas", ar: "القوالب", ru: "Шаблоны" };

type Panel = "print" | "review" | "certificate";

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
  const [linked] = useState(loadLinkedDays);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [wizardState, setWizard] = useState<WizardState>(null);
  /** „Gestalten“: the chart changed right on it, with the wizard's own editor. */
  const [designing, setDesigning] = useState(false);
  /** Weeks (days, months) back from the current one on a board, days from today on a plan; 0 is now. */
  const [back, setBack] = useState(0);
  const boardTitle = useBoardTitle();
  const planTitle = usePlanTitle();

  // Each address opens its own kind, as each has its own book on the shelf: `/tagesplan/` a plan, `/belohnungstafel/` a board.
  const [wanted, setType] = useState<ChartType>(routeType);
  const board: Board | undefined = boards.boards.find((b) => b.id === boards.current) ?? boards.boards[0];
  // Plans as an older version saved them read as today's (its two-card „Jetzt – Dann“ view).
  const allPlans = plans.plans.map(fromOlder);
  const currentPlan: Plan | undefined = allPlans.find((p) => p.id === plans.current) ?? allPlans[0];
  // A plan whose cards count stars is a Belohnungstafel too: the Belohnungstafel's book opens on it where no board is made.
  const rewardPlan = currentPlan && counting(currentPlan) ? currentPlan : allPlans.find(counting);
  // Nothing made yet (a first visit): the page is the wizard, which can't be closed, as there is nothing behind it.
  const empty = !board && !currentPlan;
  // Only the other kind made (a plan, the Belohnungstafel's book opened): the wizard on the asked kind, the other behind it.
  const start = pageStart(wanted, { board: !!board || !!rewardPlan, plan: !!currentPlan });
  const wizard = wizardState ?? (start.wizard ? {} : null);
  const type: ChartType = start.type === "board" && !board ? "plan" : start.type;
  const plan = start.type === "board" && !board ? rewardPlan : currentPlan;
  const log = stored.log;
  const setLog = (next: StarLog) => setStored({ log: next });
  const today = new Date();
  const boardDay = back === 0 || !board ? today : shiftPeriod(board.kind, today, -back);
  const planDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (plan && plan.view !== "week" ? -back : 0), 12);

  // Back from a game a plan's card opened (the brushing): that card gets its tick, whatever time of day the game counted.
  useEffect(() => {
    const finished = takeFinishedStep(location.pathname);
    if (!finished) return;
    const { planId, key } = parseRoutineStep(finished);
    // A card with a Zähler gets all its stars at once: the game was the whole task.
    const { day, taskId } = parseCellKey(key);
    const routinePlan = allPlans.find((p) => p.id === planId);
    const step = routinePlan && stepsOn(routinePlan, day).find((s) => s.id === taskId);
    const most = step ? Math.max(1, starsOf(step)) : 1;
    if ((log[planId]?.[key] ?? 0) < most) setLog({ ...log, [planId]: { ...log[planId], [key]: most } });
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
  const changePlan = (next: Plan) => updatePlans({ plans: allPlans.map((p) => (p.id === next.id ? next : p)) });
  /** A change made right on the chart (`ChartEditor`): a board's view keeps its heading only while it is a template's. */
  const changeDraft = (draft: Draft) => {
    if (draft.type === "plan") return changePlan(draft.plan);
    if (!board) return;
    const template = TEMPLATES.find((tpl) => tpl.id === board.template);
    const next =
      draft.board.kind === board.kind ? draft.board : withKind(board, draft.board.kind, isTemplateTitle(board.title, template?.title) ? board.title : "");
    changeBoard(next);
  };
  const show = (shown: ChartType) => {
    setWizard(null);
    setDesigning(false);
    setType(shown);
  };
  const showBoard = (id: string) => {
    updateBoards({ current: id });
    show("board");
  };
  const showPlan = (id: string) => {
    updatePlans({ current: id });
    show("plan");
  };
  // On a computer printing is always open below the chart: its button on top only scrolls there.
  const toggle = (which: Panel) => {
    setWizard(null);
    setDesigning(false);
    if (computer && which === "print") document.getElementById("rw-print")?.scrollIntoView({ behavior: "smooth", block: "start" });
    else setPanel(panel === which ? null : which);
  };
  /** „Gestalten“ (also from the Urkunde): the chart in place, changed right on it. */
  const openEditor = () => {
    setPanel(null);
    setDesigning(true);
  };
  const openWizard = (start?: WizardStart) => {
    setPanel(null);
    setDesigning(false);
    setWizard({ start });
  };
  // Closing the wizard shows the chart behind it: where none of the kind asked for is made, the other kind's.
  const closeWizard = () => show(type);
  /** A template from the gallery: the board or plan made from it before, with its stars, or the wizard on it. */
  const pickTemplate = (template: Template) => {
    const made = boards.boards.find((b) => b.template === template.id);
    if (made) showBoard(made.id);
    else openWizard({ type: "board", template });
  };
  const pickPlanTemplate = (template: PlanTemplate) => {
    const made = allPlans.find((p) => p.template === template.id);
    if (made) showPlan(made.id);
    else openWizard({ type: "plan", template });
  };
  /** What the wizard made: it is added and shown. */
  const add = (draft: Draft) => {
    if (draft.type === "board") updateBoards({ boards: [...boards.boards, draft.board], current: draft.board.id });
    else updatePlans({ plans: [...allPlans, draft.plan], current: draft.plan.id });
    show(draft.type);
    // The wizard may have been scrolled far down: the new chart starts at the top of the page.
    window.scrollTo({ top: 0 });
  };
  const removeBoard = (gone: Board) => {
    const rest = boards.boards.filter((b) => b.id !== gone.id);
    setLog(Object.fromEntries(Object.entries(log).filter(([id]) => id !== gone.id)));
    updateBoards({ boards: rest, current: rest[0].id });
    setPanel(null);
    setDesigning(false);
  };
  const removePlan = (gone: Plan) => {
    const rest = allPlans.filter((p) => p.id !== gone.id);
    setLog(Object.fromEntries(Object.entries(log).filter(([id]) => id !== gone.id)));
    updatePlans({ plans: rest, current: rest[0].id });
    setPanel(null);
    setDesigning(false);
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
            onRemove={allPlans.length > 1 ? () => removePlan(plan) : undefined}
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
            onCertificate={() => setPanel("certificate")}
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
  const certificate = type === "board" && !!board && board.tasks.length > 0;
  const main = wizard ? (
    <Wizard
      key={wizard.start ? `${wizard.start.type}-${wizard.start.template.id}` : "new"}
      start={wizard.start}
      onDone={add}
      onCancel={empty ? undefined : closeWizard}
    />
  ) : designing && (type === "board" ? board : plan) ? (
    <ChartEditor
      key={type === "board" ? board?.id : plan?.id}
      draft={type === "board" && board ? { type: "board", board } : { type: "plan", plan: plan as Plan }}
      onChange={changeDraft}
      making={false}
      day={type === "board" ? boardDay : planDay}
      log={log}
      linked={linked}
      more={editor}
    />
  ) : !computer && panel === "print" ? (
    print
  ) : panel === "certificate" && certificate && board ? (
    <Certificate key={board.id} board={board} color={boards.print.color} onChange={changeBoard} onEdit={openEditor} onClose={() => setPanel(null)} />
  ) : panel === "review" && review && board ? (
    <Review board={board} log={log} linked={linked} sounds={boards.sounds} onClose={() => setPanel(null)} />
  ) : (
    <div className="rw-main">
      {screen}
      <aside className="rw-side" aria-label={t(TEMPLATES_LABEL)}>
        <h2 className="rw-side-title">{t(TEMPLATES_LABEL)}</h2>
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
      {/* The page of the book (in the book look) and the families reading at its foot, as on every menu. */}
      <Sky />
      {/* The first screen: everything down to the chart, which fills what is left of it. */}
      <div className="rw-first">
        <MenuHead
          to={category ? categoryHref(category) : "/"}
          back={
            category
              ? t(category.title)
              : t({ de: "Alle Spiele", en: "All games", zh: "全部游戏", hi: "सभी खेल", es: "Todos los juegos", ar: "كل الألعاب", ru: "Все игры" })
          }
          title={t(REWARDS_TITLE)}
        >
          {/* While the wizard is open, nothing on top belongs to the chart behind it. */}
          {!wizard && (
            <div className="panel-buttons">
              <PanelButton open={designing} onClick={() => (designing ? setDesigning(false) : openEditor())} emoji="✏️" label={t(DESIGN)} />
              <PanelButton open={!computer && panel === "print"} onClick={() => toggle("print")} emoji="🖨️" label={t(PRINT)} />
              {review && <PanelButton open={panel === "review"} onClick={() => toggle("review")} emoji="📜" label={t(REVIEW)} />}
              {certificate && <PanelButton open={panel === "certificate"} onClick={() => toggle("certificate")} emoji="🏅" label={t(CERTIFICATE)} />}
            </div>
          )}
        </MenuHead>

        {/* Nothing made yet: no row of tabs, the wizard has the page. */}
        {!empty && (
          <div className="rw-pickers">
            {/* The view is chosen under „Gestalten“ (its Zeitraum); here only the way to earlier days. */}
            {!wizard && type === "board" && board && board.kind !== "collect" && panel !== "review" && (
              <div className="rw-switch">
                <PeriodNav kind={board.kind} day={boardDay} back={back} setBack={setBack} />
              </div>
            )}
            {!wizard && type === "plan" && plan && plan.view !== "week" && (
              <div className="rw-switch">
                <DayNav day={planDay} shift={-back} setShift={(shift) => setBack(-shift)} />
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
              {allPlans.map((p) => (
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

        {main}
      </div>
      {/* The Urkunde prints on its own: the board's print pages below would go to the printer with it. */}
      {computer && !wizard && !designing && !(panel === "certificate" && certificate) && (
        <div className="rw-below">
          <section id="rw-print" className="rw-below-part">
            {print}
          </section>
        </div>
      )}
      <SeoText />
    </main>
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
