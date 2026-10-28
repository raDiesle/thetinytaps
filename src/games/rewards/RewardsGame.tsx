import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { MenuHead } from "@/components/MenuTop";
import { categoryHref, categoryOf } from "@/content/games";
import { useGameSettings } from "@/lib/common";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { useStoredSettings } from "@/lib/storage";
import { type Board, samePeriod, shiftPeriod, startOver, type StarLog, withKind } from "./board";
import { BoardScreen } from "./BoardScreen";
import { useBoardTitle } from "./BoardSheet";
import { type BoardKind, KINDS, MARK_BY_ID, type Template, TEMPLATES } from "./catalog";
import { Editor } from "./Editor";
import { TemplateGallery } from "./Gallery";
import { loadLinkedDays } from "./linked";
import { PrintPanel } from "./PrintPanel";
import { DEFAULT_REWARDS_SETTINGS, NO_STARS, REWARDS_SETTINGS_KEY, REWARDS_STARS_KEY } from "./settings";
import { Wizard } from "./Wizard";
import "./rewards.css";

/** The page's name, in the menu head and the browser tab. */
export const REWARDS_TITLE: Localized = { de: "Belohnungstafel" };

type Panel = "info" | "edit" | "print";

/** Grown-ups on a computer, with room to scroll: the same limit as the fixed back link (`playing.css`). */
const COMPUTER = "(min-width: 900px) and (any-pointer: fine)";

/** Whether this is a computer with a mouse and a wide window; follows the window as it changes. */
function useComputer() {
  const [computer, setComputer] = useState(() => matchMedia(COMPUTER).matches);
  useEffect(() => {
    const query = matchMedia(COMPUTER);
    const change = () => setComputer(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  return computer;
}

/** The main views: the same stars for a day, a week or a month. Collecting stands apart in the switch. */
const MAIN_KINDS = KINDS.filter((k) => k.id !== "collect");
const COLLECT_KIND = KINDS.find((k) => k.id === "collect");

/**
 * The Belohnungstafel: the current board as big as the screen allows. Above it, from the first visit on, the
 * switch of views – Tag, Woche, Monat (the same stars) and Sammeln – with arrows back to earlier days, weeks or
 * months, and the row of boards with „＋ Neue Tafel“ (a wizard). Beside the board on wide screens the gallery of
 * Vorlagen, each a small picture with example stars; on smaller ones „🧩 Vorlagen“ opens the wizard on them. A new
 * board shows example stars until its first real one. On a computer „Gestalten“ and „Drucken“ lie open below the
 * board (scroll down); on phones and tablets they open from the buttons on top. Not a game: no GameShell, no play
 * time counted, so a star after the evening brushing still comes when play time is over.
 */
export function RewardsGame() {
  const t = useT();
  const location = useLocation();
  const category = categoryOf(location.pathname);
  const computer = useComputer();
  const [settings, update] = useGameSettings(REWARDS_SETTINGS_KEY, DEFAULT_REWARDS_SETTINGS);
  const [stored, setStored] = useStoredSettings(REWARDS_STARS_KEY, { log: NO_STARS });
  const [linked] = useState(loadLinkedDays);
  const [panel, setPanel] = useState<Panel | null>(null);
  /** The wizard, open on its first step (`true`) or on a template picked in the gallery. */
  const [wizard, setWizard] = useState<Template | true | null>(null);
  /** Weeks (days, months) back from the current one; 0 is now. */
  const [back, setBack] = useState(0);
  const title = useBoardTitle();
  // A tab says which board it is: its own heading or the child's name, else the template's name („Zähne-Woche“).
  const tabLabel = (b: Board) => {
    const template = TEMPLATES.find((tpl) => tpl.id === b.template);
    return b.title.trim() || b.childName.trim() || !template ? title(b) : t(template.label);
  };
  const board = settings.boards.find((b) => b.id === settings.current) ?? settings.boards[0];
  const log = stored.log;
  const setLog = (next: StarLog) => setStored({ log: next });
  const today = new Date();
  const day = back === 0 ? today : shiftPeriod(board.kind, today, -back);

  // Another board or view starts at today again.
  useEffect(() => setBack(0), [board.id, board.kind]);

  const changeBoard = (patch: Partial<Board>) => update({ boards: settings.boards.map((b) => (b.id === board.id ? { ...b, ...patch } : b)) });
  const setKind = (kind: BoardKind) => {
    const template = TEMPLATES.find((tpl) => tpl.id === board.template);
    changeBoard(withKind(board, kind, template?.title?.de));
  };
  // On a computer the panels are always open below the board: the buttons on top only scroll there.
  const toggle = (which: Panel) => {
    setWizard(null);
    if (computer && which !== "info") document.getElementById(`rw-${which}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    else setPanel(panel === which ? null : which);
  };
  /** A template from the gallery: the board made from it before, with its stars, or the wizard on it. */
  const pickTemplate = (template: Template) => {
    const made = settings.boards.find((b) => b.template === template.id);
    if (made) {
      setWizard(null);
      update({ current: made.id });
    } else {
      setPanel(null);
      setWizard(template);
    }
  };
  const addBoard = (fresh: Board) => {
    update({ boards: [...settings.boards, fresh], current: fresh.id });
    setWizard(null);
  };
  const openWizard = () => {
    setPanel(null);
    setWizard(true);
  };
  const removeBoard = () => {
    const boards = settings.boards.filter((b) => b.id !== board.id);
    setLog(Object.fromEntries(Object.entries(log).filter(([id]) => id !== board.id)));
    update({ boards, current: boards[0].id });
    setPanel(null);
  };

  const editor = (
    <Editor
      board={board}
      onChange={changeBoard}
      onStartOver={() => setLog(startOver(log, board, day))}
      onRemove={settings.boards.length > 1 ? removeBoard : undefined}
    />
  );
  const print = <PrintPanel board={board} options={settings.print} onChange={(patch) => update({ print: { ...settings.print, ...patch } })} />;
  const screen = (
    <BoardScreen
      board={board}
      log={log}
      setLog={setLog}
      linked={linked}
      day={day}
      sounds={settings.sounds}
      speech={settings.speech}
      onExamplesOff={() => changeBoard({ examples: false })}
    />
  );
  const main = wizard ? (
    <Wizard key={wizard === true ? "new" : wizard.id} start={wizard === true ? undefined : wizard} onDone={addBoard} onCancel={() => setWizard(null)} />
  ) : !computer && panel === "print" ? (
    print
  ) : (
    <div className="rw-main">
      {screen}
      <aside className="rw-side" aria-label={t({ de: "Vorlagen" })}>
        <h2 className="rw-side-title">🧩 {t({ de: "Vorlagen" })}</h2>
        <TemplateGallery selected={board.template} onPick={pickTemplate} />
      </aside>
    </div>
  );

  return (
    <main className={`start-screen rw-page-screen${computer ? " rw-computer" : ""}`}>
      {/* The first screen: everything down to the board, which fills what is left of it. */}
      <div className="rw-first">
        <MenuHead
          to={category ? categoryHref(category) : "/"}
          back={category ? t(category.title) : t({ de: "Alle Spiele" })}
          title={
            <>
              <span aria-hidden>🌟</span> {t(REWARDS_TITLE)}
            </>
          }
        >
          <div className="panel-buttons">
            <PanelButton open={panel === "info"} onClick={() => toggle("info")} emoji="ℹ️" label={t({ de: "Über die Tafel" })} />
            <PanelButton open={!computer && panel === "edit"} onClick={() => toggle("edit")} emoji="✏️" label={t({ de: "Gestalten" })} />
            <PanelButton open={!computer && panel === "print"} onClick={() => toggle("print")} emoji="🖨️" label={t({ de: "Drucken" })} />
          </div>
        </MenuHead>

        <div className="rw-pickers">
          {/* While the wizard is open its own step chooses the view. */}
          {!wizard && (
            <div className="rw-switch">
              <div className="rw-views" role="group" aria-label={t({ de: "Ansicht" })}>
                {MAIN_KINDS.map((kind) => (
                  <button
                    key={kind.id}
                    type="button"
                    className={kind.id === board.kind ? "selected" : undefined}
                    aria-pressed={kind.id === board.kind}
                    title={t(kind.hint)}
                    onClick={() => setKind(kind.id)}
                  >
                    <span className="rw-view-emoji" aria-hidden>
                      {kind.emoji}
                    </span>{" "}
                    {t(kind.label)}
                  </button>
                ))}
              </div>
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
              {board.kind !== "collect" && <PeriodNav kind={board.kind} day={day} back={back} setBack={setBack} />}
            </div>
          )}
          <nav className="rw-boards" aria-label={t({ de: "Tafeln" })}>
            {settings.boards.map((b) => (
              <button
                key={b.id}
                type="button"
                className={b.id === board.id && !wizard ? "selected" : undefined}
                aria-pressed={b.id === board.id}
                onClick={() => {
                  setWizard(null);
                  update({ current: b.id });
                }}
              >
                <span aria-hidden>{TEMPLATES.find((tpl) => tpl.id === b.template)?.emoji ?? MARK_BY_ID.get(b.mark)?.emoji}</span> {tabLabel(b)}
              </button>
            ))}
            <button type="button" className="rw-add" aria-pressed={wizard === true} onClick={openWizard}>
              ＋ {t({ de: "Neue Tafel" })}
            </button>
            <button type="button" className="rw-templates-button" onClick={openWizard}>
              🧩 {t({ de: "Vorlagen" })}
            </button>
          </nav>
        </div>

        {panel === "info" && <Info />}
        {!computer && panel === "edit" && !wizard && editor}
        {main}
      </div>
      {computer && (
        <div className="rw-below">
          <section id="rw-edit" className="rw-below-part">
            <h2 className="rw-panel-title">✏️ {t({ de: "Gestalten" })}</h2>
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

/** ‹ and › around the day, week or month shown: back to earlier ones to add a forgotten star, never into the future. */
function PeriodNav({ kind, day, back, setBack }: { kind: BoardKind; day: Date; back: number; setBack: (back: number) => void }) {
  const t = useT();
  const { speechLang } = useAppLanguage();
  const now = new Date();
  const label =
    back === 0
      ? t(kind === "day" ? { de: "Heute" } : kind === "week" ? { de: "Diese Woche" } : { de: "Dieser Monat" })
      : back === 1
        ? t(kind === "day" ? { de: "Gestern" } : kind === "week" ? { de: "Letzte Woche" } : { de: "Letzter Monat" })
        : kind === "month"
          ? new Intl.DateTimeFormat(speechLang, { month: "long" }).format(day)
          : kind === "week"
            ? `${t({ de: "Woche vom" })} ${new Intl.DateTimeFormat(speechLang, { day: "numeric", month: "numeric" }).format(day)}`
            : new Intl.DateTimeFormat(speechLang, { weekday: "short", day: "numeric", month: "numeric" }).format(day);
  // Stars are kept about two months: no further back than that.
  const oldest = kind === "month" ? 2 : kind === "week" ? 8 : 60;
  return (
    <span className="rw-period">
      <button type="button" aria-label={t({ de: "Früher" })} disabled={back >= oldest} onClick={() => setBack(back + 1)}>
        ‹
      </button>
      <span className={`rw-period-label${samePeriod(kind, day, now) ? "" : " past"}`}>{label}</span>
      <button type="button" aria-label={t({ de: "Später" })} disabled={back === 0} onClick={() => setBack(back - 1)}>
        ›
      </button>
    </span>
  );
}

function PanelButton({ open, onClick, emoji, label }: { open: boolean; onClick: () => void; emoji: string; label: string }) {
  return (
    <button type="button" className="panel-button" aria-expanded={open} onClick={onClick}>
      <span aria-hidden>{emoji}</span> {label}
    </button>
  );
}

/** For grown-ups: how the board works, and what parents' guides advise about rewards for toddlers. */
function Info() {
  const t = useT();
  return (
    <section className="settings game-info">
      <p>
        {t({
          de: "Eine Tafel, auf der Ihr Kind Sterne sammelt – auf dem Bildschirm und, genau gleich, zum Ausdrucken. Oben wechseln Sie die Ansicht: Tag (die Aufgaben von heute als große Bilder), Woche (Aufgaben × Tage) oder Monat (ein Kalender) – alle drei zeigen dieselben Sterne; mit ‹ geht es zu früheren Tagen, Wochen oder Monaten, um einen vergessenen Stern nachzutragen. „Sammeln“ ist ein Weg bis zur Belohnung, ohne Tage. Die Vorlagen zeigen mit Beispiel-Sternen, wie eine Tafel in Benutzung aussieht; „＋ Neue Tafel“ führt Schritt für Schritt zu einer eigenen, z. B. eine pro Kind. Unter „Gestalten“ ändern Sie später alles.",
        })}
      </p>
      <p>
        {t({
          de: "So kommt ein Stern auf die Tafel: Sie halten ein Feld gedrückt, bis sein Ring voll ist – dann erscheint ein großer Stern, und Ihr Kind tippt ihn an. Er fliegt in sein Feld. Ein kurzes Tippen allein gibt keinen Stern, das Feld wackelt nur. Eine Aufgabe kann morgens ☀️, mittags 🌤️ und abends 🌙 je ein eigenes Feld haben – Zähne putzen hat morgens und abends eins. Sterne aus „Zähne putzen“ (zur richtigen Tageszeit) und „Aufs Töpfchen“ kommen von selbst, wenn die Aufgabe aus dem Katalog stammt. Haben Sie das falsche Feld erwischt, gibt es kurz danach „Stern zurück“.",
        })}
      </p>
      <p>
        {t({
          de: "Was Ratgeber für Zwei- und Dreijährige empfehlen: eine bis drei Aufgaben, eine davon leicht; der Stern sofort danach; die Belohnung bald (lieber 5 Sterne als eine ganze Woche) und am liebsten Zeit zusammen statt Süßigkeiten. Sterne werden nie weggenommen und es gibt keine Strafe – ein leeres Feld ist einfach noch frei. Klappt etwas von allein, feiern Sie den Abschluss und lassen die Tafel ausklingen. Beim Töpfchen und beim Schlafen gilt besonders: mitfreuen, nie drängen.",
        })}
      </p>
      <p>
        {t({
          de: "Alles bleibt auf diesem Gerät, ohne Anmeldung. Unter „Drucken“: A4 quer oder hochkant, in Farbe oder Schwarz-weiß, mit Feldern zum Ausmalen und einem Bogen Sterne zum Ausschneiden.",
        })}
      </p>
    </section>
  );
}
