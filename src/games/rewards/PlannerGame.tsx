import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { MenuHead } from "@/components/MenuTop";
import { categoryHref, categoryOf } from "@/content/games";
import { useGameSettings } from "@/lib/common";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { useStoredSettings } from "@/lib/storage";
import { newId, type StarLog } from "./board";
import { PLAN_TEMPLATES, PLAN_VIEWS, type PlanTemplate, type PlanView } from "./catalog";
import { loadLinkedDays } from "./linked";
import { type Plan, planFromTemplate, restartDay } from "./plan";
import { PlanEditor } from "./PlanEditor";
import { PlanGallery } from "./PlanGallery";
import { PlanPrint } from "./PlanPrint";
import { PlanScreen } from "./PlanScreen";
import { usePlanTitle } from "./PlanSheet";
import { PanelButton, useComputer } from "./pageParts";
import { DEFAULT_PLANNER_SETTINGS, PLANNER_SETTINGS_KEY } from "./planSettings";
import { NO_STARS, REWARDS_STARS_KEY } from "./settings";
import "./rewards.css";
import "./planner.css";

/** The page's name, in the menu head and the browser tab. */
export const PLANNER_TITLE: Localized = { de: "Tagesplan" };

type Panel = "info" | "edit" | "print";

/** How far the day view goes back and ahead: a week either way. */
const DAYS_BACK = 7;
const DAYS_AHEAD = 6;

/**
 * The Tagesplan (a picture schedule, „Strukturtafel“): the current plan as big as the screen allows. Above it, from
 * the first visit on, the switch Tag (today's steps as cards, the one to do now glowing) and Woche (what is on which
 * day, with moons for the nights until then), arrows to other days, and the row of plans with „＋ Neuer Plan“. Beside
 * it on wide screens the Vorlagen (Morgenroutine, Abendroutine, Erst–Dann, Tagesablauf mit Kita, Wochenplan); on a
 * computer „Gestalten“ and „Drucken“ lie open below. Like the Belohnungstafel not a game: no GameShell, no play
 * time, so the evening routine still works when play time is over.
 */
export function PlannerGame() {
  const t = useT();
  const location = useLocation();
  const category = categoryOf(location.pathname);
  const computer = useComputer();
  const [settings, update] = useGameSettings(PLANNER_SETTINGS_KEY, DEFAULT_PLANNER_SETTINGS);
  const [stored, setStored] = useStoredSettings(REWARDS_STARS_KEY, { log: NO_STARS });
  const [linked] = useState(loadLinkedDays);
  const [panel, setPanel] = useState<Panel | null>(null);
  /** „＋ Neuer Plan“: the Vorlagen in place of the plan. */
  const [picking, setPicking] = useState(false);
  /** Days from today (negative: back) in the day view. */
  const [shift, setShift] = useState(0);
  const title = usePlanTitle();
  const plan = settings.plans.find((p) => p.id === settings.current) ?? settings.plans[0];
  const log = stored.log;
  const setLog = (next: StarLog) => setStored({ log: next });
  const today = new Date();
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (plan.view === "day" ? shift : 0), 12);

  // Another plan or view starts at today again.
  useEffect(() => setShift(0), [plan.id, plan.view]);

  const changePlan = (next: Plan) => update({ plans: settings.plans.map((p) => (p.id === plan.id ? next : p)) });
  const setView = (view: PlanView) => changePlan({ ...plan, view });
  const toggle = (which: Panel) => {
    setPicking(false);
    if (computer && which !== "info") document.getElementById(`pl-${which}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    else setPanel(panel === which ? null : which);
  };
  const addPlan = (fresh: Plan) => {
    update({ plans: [...settings.plans, fresh], current: fresh.id });
    setPicking(false);
  };
  /** A template: the plan made from it before (with its ticks), or a new one from it. */
  const pickTemplate = (template: PlanTemplate) => {
    const made = settings.plans.find((p) => p.template === template.id);
    if (made) {
      setPicking(false);
      update({ current: made.id });
    } else addPlan(planFromTemplate(template));
  };
  /** An empty plan, with Gestalten open to fill it. */
  const addBlank = () => {
    addPlan({ id: newId(), view: "day", childName: "", title: "", days: [[]], same: true, theme: "sonne" });
    toggle("edit");
  };
  const removePlan = () => {
    const plans = settings.plans.filter((p) => p.id !== plan.id);
    setLog(Object.fromEntries(Object.entries(log).filter(([id]) => id !== plan.id)));
    update({ plans, current: plans[0].id });
    setPanel(null);
  };
  const tabLabel = (p: Plan) => {
    const template = PLAN_TEMPLATES.find((tpl) => tpl.id === p.template);
    return p.childName.trim() || !template ? title(p) : t(template.label);
  };

  const editor = (
    <PlanEditor
      key={plan.id}
      plan={plan}
      day={day}
      onChange={changePlan}
      onRestartToday={() => setLog(restartDay(log, plan.id, today))}
      onRemove={settings.plans.length > 1 ? removePlan : undefined}
    />
  );
  const print = <PlanPrint plan={plan} day={day} options={settings.print} onChange={(patch) => update({ print: { ...settings.print, ...patch } })} />;
  const main = picking ? (
    <section className="pl-picker">
      <div className="rw-wizard-head">
        <h2 className="rw-panel-title">＋ {t({ de: "Neuer Plan: womit anfangen?" })}</h2>
        <button type="button" className="rw-wizard-close" aria-label={t({ de: "Abbrechen" })} onClick={() => setPicking(false)}>
          ✕
        </button>
      </div>
      <PlanGallery onPick={(tpl) => addPlan(planFromTemplate(tpl))} blank={addBlank} />
    </section>
  ) : !computer && panel === "print" ? (
    print
  ) : (
    <div className="rw-main">
      <PlanScreen
        plan={plan}
        log={log}
        setLog={setLog}
        linked={linked}
        day={day}
        sounds={settings.sounds}
        speech={settings.speech}
        onExamplesOff={() => changePlan({ ...plan, examples: false })}
      />
      <aside className="rw-side" aria-label={t({ de: "Vorlagen" })}>
        <h2 className="rw-side-title">🧩 {t({ de: "Vorlagen" })}</h2>
        <PlanGallery selected={plan.template} onPick={pickTemplate} />
      </aside>
    </div>
  );

  return (
    <main className={`start-screen rw-page-screen${computer ? " rw-computer" : ""}`}>
      <div className="rw-first">
        <MenuHead
          to={category ? categoryHref(category) : "/"}
          back={category ? t(category.title) : t({ de: "Alle Spiele" })}
          title={
            <>
              <span aria-hidden>🗓️</span> {t(PLANNER_TITLE)}
            </>
          }
        >
          <div className="panel-buttons">
            <PanelButton open={panel === "info"} onClick={() => toggle("info")} emoji="ℹ️" label={t({ de: "Über den Plan" })} />
            <PanelButton open={!computer && panel === "edit"} onClick={() => toggle("edit")} emoji="✏️" label={t({ de: "Gestalten" })} />
            <PanelButton open={!computer && panel === "print"} onClick={() => toggle("print")} emoji="🖨️" label={t({ de: "Drucken" })} />
          </div>
        </MenuHead>

        <div className="rw-pickers">
          {!picking && (
            <div className="rw-switch">
              <div className="rw-views" role="group" aria-label={t({ de: "Ansicht" })}>
                {PLAN_VIEWS.map((view) => (
                  <button
                    key={view.id}
                    type="button"
                    className={view.id === plan.view ? "selected" : undefined}
                    aria-pressed={view.id === plan.view}
                    title={t(view.hint)}
                    onClick={() => setView(view.id)}
                  >
                    <span className="rw-view-emoji" aria-hidden>
                      {view.emoji}
                    </span>{" "}
                    {t(view.label)}
                  </button>
                ))}
              </div>
              {plan.view === "day" && <DayNav day={day} shift={shift} setShift={setShift} />}
            </div>
          )}
          <nav className="rw-boards" aria-label={t({ de: "Pläne" })}>
            {settings.plans.map((p) => (
              <button
                key={p.id}
                type="button"
                className={p.id === plan.id && !picking ? "selected" : undefined}
                aria-pressed={p.id === plan.id}
                onClick={() => {
                  setPicking(false);
                  update({ current: p.id });
                }}
              >
                <span aria-hidden>{PLAN_TEMPLATES.find((tpl) => tpl.id === p.template)?.emoji ?? "🗓️"}</span> {tabLabel(p)}
              </button>
            ))}
            <button type="button" className="rw-add" aria-pressed={picking} onClick={() => setPicking(true)}>
              ＋ {t({ de: "Neuer Plan" })}
            </button>
            <button type="button" className="rw-templates-button" onClick={() => setPicking(true)}>
              🧩 {t({ de: "Vorlagen" })}
            </button>
          </nav>
        </div>

        {panel === "info" && <Info />}
        {!computer && panel === "edit" && !picking && editor}
        {main}
      </div>
      {computer && (
        <div className="rw-below">
          <section id="pl-edit" className="rw-below-part">
            <h2 className="rw-panel-title">✏️ {t({ de: "Gestalten" })}</h2>
            {editor}
          </section>
          <section id="pl-print" className="rw-below-part">
            {print}
          </section>
        </div>
      )}
    </main>
  );
}

/** ‹ and › around the day shown: a week back and ahead, to see what tomorrow brings or tick yesterday's. */
function DayNav({ day, shift, setShift }: { day: Date; shift: number; setShift: (shift: number) => void }) {
  const t = useT();
  const { speechLang } = useAppLanguage();
  const label =
    shift === 0
      ? t({ de: "Heute" })
      : shift === 1
        ? t({ de: "Morgen" })
        : shift === -1
          ? t({ de: "Gestern" })
          : new Intl.DateTimeFormat(speechLang, { weekday: "short", day: "numeric", month: "numeric" }).format(day);
  return (
    <span className="rw-period">
      <button type="button" aria-label={t({ de: "Früher" })} disabled={shift <= -DAYS_BACK} onClick={() => setShift(shift - 1)}>
        ‹
      </button>
      <span className={`rw-period-label${shift === 0 ? "" : " past"}`}>{label}</span>
      <button type="button" aria-label={t({ de: "Später" })} disabled={shift >= DAYS_AHEAD} onClick={() => setShift(shift + 1)}>
        ›
      </button>
    </span>
  );
}

/** For grown-ups: what the plan is for, how a child uses it, and what helps toddlers with routines. */
function Info() {
  const t = useT();
  return (
    <section className="settings game-info">
      <p>
        {t({
          de: "Ein Tagesplan in Bildern (auch Strukturtafel, Bildfahrplan oder Routinekarten genannt): Kleine Kinder können noch keine Uhr lesen, aber sie verstehen Bilder in einer Reihe. So sehen sie, was jetzt kommt und was danach – das macht Übergänge leichter und den Tag vorhersehbar.",
        })}
      </p>
      <p>
        {t({
          de: "„Tag“ zeigt die Schritte von heute als große Karten. Die Karte, die jetzt dran ist, leuchtet („Jetzt“), darüber steht, was „Dann“ kommt. Ist ein Schritt geschafft, tippt Ihr Kind selbst auf die leuchtende Karte: sie bekommt einen Haken, und die nächste leuchtet. Nach dem letzten Schritt gibt es ein kleines Fest. Ein Plan mit zwei Karten ist eine Erst–Dann-Tafel: erst das eine, dann das Schöne. „Woche“ zeigt, was an welchem Tag ist (Kita, Oma, Schwimmen), und Monde über den nächsten Tagen zeigen, wie oft man noch schlafen muss.",
        })}
      </p>
      <p>
        {t({
          de: "Zähne putzen hakt sich von selbst ab, wenn im Spiel „Zähne putzen“ fertig geputzt ist – in der Morgenroutine nur das Putzen am Morgen. Hat Ihr Kind zu früh getippt, gibt es kurz danach „Zurück“; „Von vorn“ beginnt den Tag neu. Mit ‹ › sehen Sie andere Tage, etwa was morgen kommt.",
        })}
      </p>
      <p>
        {t({
          de: "Was hilft: wenige Bilder (drei bis sechs), immer dieselbe Reihenfolge, den Plan gemeinsam anschauen, bevor es losgeht. Zum Ausdrucken gibt es jedes Bild auch als Karte zum Ausschneiden, für eine Klett-Tafel. Alles bleibt auf diesem Gerät, ohne Anmeldung.",
        })}
      </p>
    </section>
  );
}
