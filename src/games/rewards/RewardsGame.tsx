import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { MenuHead } from "@/components/MenuTop";
import { categoryHref, categoryOf } from "@/content/games";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import { useStoredSettings } from "@/lib/storage";
import { type Board, boardFromTemplate, newId, startOver, type StarLog, withKind } from "./board";
import { BoardScreen } from "./BoardScreen";
import { useBoardTitle } from "./BoardSheet";
import { type BoardKind, KINDS, MARK_BY_ID, TEMPLATES } from "./catalog";
import { Editor } from "./Editor";
import { loadLinkedDays } from "./linked";
import { PrintPanel } from "./PrintPanel";
import { DEFAULT_REWARDS_SETTINGS, NO_STARS, REWARDS_SETTINGS_KEY, REWARDS_STARS_KEY } from "./settings";
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

/** Ready-made boards in the order of the row of views: the day ones first, collecting last. */
const PRESETS = [...TEMPLATES].sort((a, b) => KINDS.findIndex((k) => k.id === a.kind) - KINDS.findIndex((k) => k.id === b.kind));

/**
 * The Belohnungstafel: the current board as big as the screen allows, and above it, from the
 * first visit on, what is easy to switch – the view (Tag, Woche, Monat, Sammeln, the same stars)
 * and a row of ready-made boards, each its own board with its own stars once tapped, plus the
 * grown-ups' own ones. On a computer „Gestalten“ and „Drucken“ lie open below the board (scroll
 * down); on phones and tablets they open from the buttons on top. Not a game: no GameShell, no
 * play time counted, so a star after the evening brushing still comes when play time is over.
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
  const title = useBoardTitle();
  const board = settings.boards.find((b) => b.id === settings.current) ?? settings.boards[0];
  const log = stored.log;
  const setLog = (next: StarLog) => setStored({ log: next });
  const own = settings.boards.filter((b) => !b.template || !TEMPLATES.some((tpl) => tpl.id === b.template));

  const changeBoard = (patch: Partial<Board>) => update({ boards: settings.boards.map((b) => (b.id === board.id ? { ...b, ...patch } : b)) });
  const setKind = (kind: BoardKind) => {
    const template = TEMPLATES.find((tpl) => tpl.id === board.template);
    changeBoard(withKind(board, kind, template?.title?.de));
  };
  // On a computer the panels are always open below the board: the buttons on top only scroll there.
  const toggle = (which: Panel) => {
    if (computer && which !== "info") document.getElementById(`rw-${which}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    else setPanel(panel === which ? null : which);
  };
  /** A ready-made board: the one made from it before, with its stars, or a new one. */
  const pickPreset = (templateId: string) => {
    const made = settings.boards.find((b) => b.template === templateId);
    if (made) return update({ current: made.id });
    const template = TEMPLATES.find((tpl) => tpl.id === templateId) ?? TEMPLATES[0];
    const fresh = boardFromTemplate(template);
    update({ boards: [...settings.boards, fresh], current: fresh.id });
  };
  /** An own board, starting as a copy of the one shown, to change at once. */
  const addOwn = () => {
    const fresh: Board = { ...board, id: newId(), template: undefined, title: t({ de: "Eigene Tafel" }) };
    update({ boards: [...settings.boards, fresh], current: fresh.id });
    if (computer) requestAnimationFrame(() => document.getElementById("rw-edit")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    else setPanel("edit");
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
      onStartOver={() => setLog(startOver(log, board, new Date()))}
      onRemove={settings.boards.length > 1 ? removeBoard : undefined}
    />
  );
  const print = <PrintPanel board={board} options={settings.print} onChange={(patch) => update({ print: { ...settings.print, ...patch } })} />;
  const screen = <BoardScreen board={board} log={log} setLog={setLog} linked={linked} sounds={settings.sounds} speech={settings.speech} />;

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
          <div className="rw-views" role="group" aria-label={t({ de: "Ansicht" })}>
            {KINDS.map((kind) => (
              <button
                key={kind.id}
                type="button"
                className={kind.id === board.kind ? "selected" : undefined}
                aria-pressed={kind.id === board.kind}
                onClick={() => setKind(kind.id)}
              >
                <span aria-hidden>{kind.emoji}</span> {t(kind.label)}
              </button>
            ))}
          </div>
          <nav className="rw-boards" aria-label={t({ de: "Tafeln" })}>
            {PRESETS.map((tpl) => {
              const made = settings.boards.find((b) => b.template === tpl.id);
              const on = made?.id === board.id;
              return (
                <button key={tpl.id} type="button" className={on ? "selected" : undefined} aria-pressed={on} onClick={() => pickPreset(tpl.id)}>
                  <span aria-hidden>{tpl.emoji}</span> {made && (made.childName.trim() || made.kind !== tpl.kind) ? title(made) : t(tpl.label)}
                </button>
              );
            })}
            {own.map((b) => (
              <button
                key={b.id}
                type="button"
                className={b.id === board.id ? "selected" : undefined}
                aria-pressed={b.id === board.id}
                onClick={() => update({ current: b.id })}
              >
                <span aria-hidden>{MARK_BY_ID.get(b.mark)?.emoji}</span> {title(b)}
              </button>
            ))}
            <button type="button" className="rw-add" onClick={addOwn}>
              ＋ {t({ de: "Eigene Tafel" })}
            </button>
          </nav>
        </div>

        {panel === "info" && <Info />}
        {!computer && panel === "edit" && editor}
        {computer || panel !== "print" ? screen : print}
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
          de: "Eine Tafel, auf der Ihr Kind Sterne sammelt – auf dem Bildschirm und, genau gleich, zum Ausdrucken. Oben wechseln Sie die Ansicht: Tag (die Aufgaben von heute als große Bilder), Woche (Aufgaben × Tage), Monat (ein Kalender) oder Sammeln (ein Weg bis zur Belohnung) – Tag, Woche und Monat zeigen dieselben Sterne. Darunter stehen fertige Tafeln zum Antippen; jede behält ihre eigenen Sterne. Unter „Gestalten“ ändern Sie alles: Name, Aufgaben, Tage, Ziel, Belohnung, Zeichen und Farben. Mit „Eigene Tafel“ kommt eine weitere dazu, z. B. eine pro Kind.",
        })}
      </p>
      <p>
        {t({
          de: "So kommt ein Stern auf die Tafel: Sie halten ein Feld gedrückt, bis sein Ring voll ist – dann erscheint ein großer Stern, und Ihr Kind tippt ihn an. Er fliegt in sein Feld. Ein kurzes Tippen allein gibt keinen Stern, das Feld wackelt nur. Sterne aus „Zähne putzen“ und „Aufs Töpfchen“ kommen von selbst, wenn die Aufgabe aus dem Katalog stammt. Haben Sie das falsche Feld erwischt, gibt es kurz danach „Stern zurück“.",
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
