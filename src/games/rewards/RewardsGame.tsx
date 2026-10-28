import { useState } from "react";
import { useLocation } from "react-router";
import { MenuHead } from "@/components/MenuTop";
import { categoryHref, categoryOf } from "@/content/games";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import { useStoredSettings } from "@/lib/storage";
import { type Board, boardFromTemplate, startOver, type StarLog } from "./board";
import { BoardScreen } from "./BoardScreen";
import { useBoardTitle } from "./BoardSheet";
import { MARK_BY_ID, TEMPLATES } from "./catalog";
import { Editor } from "./Editor";
import { loadLinkedDays } from "./linked";
import { PrintPanel } from "./PrintPanel";
import { DEFAULT_REWARDS_SETTINGS, NO_STARS, REWARDS_SETTINGS_KEY, REWARDS_STARS_KEY } from "./settings";
import "./rewards.css";

/** The page's name, in the menu head and the browser tab. */
export const REWARDS_TITLE: Localized = { de: "Belohnungstafel" };

type Panel = "info" | "edit" | "print" | "new";

/**
 * The Belohnungstafel: the current board as big as the screen allows, the grown-ups'
 * buttons above it (about, design, print), and a row of boards when there are several
 * (one per child or habit). Not a game: no GameShell, no play time counted, so a star
 * after the evening brushing still comes when today's play time is over.
 */
export function RewardsGame() {
  const t = useT();
  const location = useLocation();
  const category = categoryOf(location.pathname);
  const [settings, update] = useGameSettings(REWARDS_SETTINGS_KEY, DEFAULT_REWARDS_SETTINGS);
  const [stored, setStored] = useStoredSettings(REWARDS_STARS_KEY, { log: NO_STARS });
  const [linked] = useState(loadLinkedDays);
  const [panel, setPanel] = useState<Panel | null>(null);
  const title = useBoardTitle();
  const board = settings.boards.find((b) => b.id === settings.current) ?? settings.boards[0];
  const log = stored.log;
  const setLog = (next: StarLog) => setStored({ log: next });

  const changeBoard = (patch: Partial<Board>) => update({ boards: settings.boards.map((b) => (b.id === board.id ? { ...b, ...patch } : b)) });
  const toggle = (which: Panel) => setPanel(panel === which ? null : which);
  const addBoard = (templateId: string) => {
    const template = TEMPLATES.find((tpl) => tpl.id === templateId) ?? TEMPLATES[0];
    const fresh = boardFromTemplate(template);
    update({ boards: [...settings.boards, fresh], current: fresh.id });
    setPanel("edit");
  };
  const removeBoard = () => {
    const boards = settings.boards.filter((b) => b.id !== board.id);
    setLog(Object.fromEntries(Object.entries(log).filter(([id]) => id !== board.id)));
    update({ boards, current: boards[0].id });
    setPanel(null);
  };

  return (
    <main className="start-screen rw-page-screen">
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
          <PanelButton open={panel === "edit"} onClick={() => toggle("edit")} emoji="✏️" label={t({ de: "Gestalten" })} />
          <PanelButton open={panel === "print"} onClick={() => toggle("print")} emoji="🖨️" label={t({ de: "Drucken" })} />
          <PanelButton open={panel === "new"} onClick={() => toggle("new")} emoji="＋" label={t({ de: "Neue Tafel" })} />
        </div>
      </MenuHead>

      {settings.boards.length > 1 && (
        <nav className="rw-boards" aria-label={t({ de: "Tafeln" })}>
          {settings.boards.map((b) => (
            <button
              key={b.id}
              type="button"
              className={b.id === board.id ? "selected" : undefined}
              aria-pressed={b.id === board.id}
              onClick={() => update({ current: b.id })}
            >
              {MARK_BY_ID.get(b.mark)?.emoji} {title(b)}
            </button>
          ))}
        </nav>
      )}

      {panel === "info" && <Info />}
      {panel === "new" && (
        <section className="settings">
          <h2 className="rw-panel-title">{t({ de: "Womit fangen wir an?" })}</h2>
          <div className="rw-templates">
            {TEMPLATES.map((tpl) => (
              <button key={tpl.id} type="button" className="rw-template" onClick={() => addBoard(tpl.id)}>
                <span aria-hidden>{tpl.emoji}</span> {t(tpl.label)}
              </button>
            ))}
          </div>
          <p className="setting-note">{t({ de: "Danach lässt sich alles ändern: Aufgaben, Tage, Ziel, Belohnung, Farben." })}</p>
        </section>
      )}
      {panel === "edit" && (
        <Editor
          board={board}
          onChange={changeBoard}
          onStartOver={() => setLog(startOver(log, board, new Date()))}
          onRemove={settings.boards.length > 1 ? removeBoard : undefined}
        />
      )}
      {panel === "print" ? (
        <PrintPanel board={board} options={settings.print} onChange={(patch) => update({ print: { ...settings.print, ...patch } })} />
      ) : (
        <BoardScreen board={board} log={log} setLog={setLog} linked={linked} sounds={settings.sounds} speech={settings.speech} />
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
          de: "Eine Tafel, auf der Ihr Kind Sterne sammelt – auf dem Bildschirm und, genau gleich, zum Ausdrucken. Unter „Gestalten“ stellen Sie alles ein: eine Wochentafel (Aufgaben × Tage), eine Tagestafel (die Aufgaben von heute als große Bilder) oder Sterne sammeln (ein Weg bis zur Belohnung); dazu Name, Aufgaben, Tage, Ziel, Belohnung, Zeichen und Farben. Mehrere Tafeln gehen auch, z. B. eine pro Kind.",
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
