import { Link, useLocation } from "react-router";
import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { FullscreenButton, FullscreenCorner } from "@/components/FullscreenButton";
import { Sky } from "@/components/Sky";
import { categoryHref, categoryOf } from "@/content/games";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { useFitGrid } from "@/lib/fitGrid";
import { enterKidMode, exitKidMode } from "@/lib/fullscreen";
import { useAppLanguage, useT } from "@/lib/language";
import { countGame, isPlaytimeOver, usePlaytime, usePlaytimeState } from "@/lib/playtime";
import { playLullaby, setSfxVolume, unlockAudio } from "@/lib/sfx";
import { speak, stopSpeaking, unlockSpeech } from "@/lib/speech";
import { forwardNearTaps } from "@/lib/tapTargets";

/** How long ✕ has to be held to leave the game; the ring fills meanwhile. */
const EXIT_DELAY_MS = 500;

/** Esc has to be held, since children press it while typing. */
const ESC_HOLD_MS = 1000;

/** How long the "Zurück zum Menü" note shows next to ✕ when a game starts. */
const EXIT_HINT_MS = 4000;

/** Leaves the game for its start screen, like holding ✕; the end of a level offers it as „Menü“. */
const LeaveGame = createContext<() => void>(() => {});

/** The way back to the game's start screen, for the „Menü“ button at the end of a level. */
export const useLeaveGame = () => useContext(LeaveGame);

/** One way to play a game, picked on its start screen with a big card. */
export interface GameMode {
  id: string;
  emoji: string;
  title: string;
  /** Drawn bigger and across the whole row, e.g. for "all of them in turn". */
  featured?: boolean;
  /** A small tag for the parent, what sort of level it is when a game has several (e.g. „🛗 Aufzug“). */
  kind?: string;
}

interface GameShellProps {
  title: string;
  emoji: string;
  /** Ways to play, as big cards: tapping one picks it and starts the game. Without them there is one start button. */
  modes?: GameMode[];
  /** The mode played last, marked on its card. */
  mode?: string;
  onMode?: (id: string) => void;
  /** A level or difficulty choice shown above the mode cards. */
  level?: ReactNode;
  /** What the game is, how it is played and what helps; behind its own button on the start screen, apart from the settings. */
  info: ReactNode;
  /** Parent-facing options shown on the start screen. */
  settings?: ReactNode;
  /** The game itself; only mounted while playing. */
  children: ReactNode;
  /** Where the start screen's back link leads; by default the game's category on the home menu. */
  backHref?: string;
  backLabel?: string;
}

/**
 * Wraps a game with a parent start screen (pick the way to play, options),
 * fullscreen (kept after the game) + keyboard lock while playing, and the exit: a click on the corner
 * button, or holding Esc.
 */
export function GameShell({ title, emoji, modes, mode, onMode, level, info, settings, children, backHref, backLabel }: GameShellProps) {
  const location = useLocation();
  const t = useT();
  const category = categoryOf(location.pathname);
  const back = backHref ?? (category ? categoryHref(category) : "/");
  const backText = backLabel ?? (category ? t(category.title) : t({ de: "Alle Spiele", ru: "Все игры" }));
  const [playing, setPlaying] = useState(false);
  // The panel opened below the two buttons, if any: folded away by default, so the start screen stays short.
  const [panel, setPanel] = useState<"info" | "settings" | null>(null);
  const playtime = usePlaytime(playing);
  const grid = useFitGrid(modes?.length ?? 0, modes?.filter((m) => m.featured).length);
  // The background song runs on from the menus into the game (BackgroundMusic), until the play time is over.
  useNoBackgroundMusic(playing && playtime.goodNight);
  // Taps a little next to something the child can tap still count for it (see tapTargets.ts).
  const playArea = useRef<HTMLDivElement>(null);
  useEffect(() => (playing && playArea.current ? forwardNearTaps(playArea.current) : undefined), [playing]);

  const start = async () => {
    // The menus are locked then (PlaytimeLock); this also stops a key that slips past it.
    if (isPlaytimeOver()) return;
    countGame();
    // These need the click as a user gesture, so run them before any await.
    unlockAudio();
    unlockSpeech();
    setPlaying(true);
    await enterKidMode();
  };

  const stop = () => {
    stopSpeaking();
    setPlaying(false);
    // Only the keyboard lock ends: fullscreen stays on, the menus are part of the app too.
    exitKidMode();
  };
  const stopRef = useRef(stop);
  stopRef.current = stop;

  useEffect(() => {
    if (!playing) return;
    let escDownAt: number | null = null;

    // Capture phase so this runs before the game's own handlers.
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key !== "Escape") return;
      if (!e.repeat) escDownAt = performance.now();
      else if (escDownAt !== null && performance.now() - escDownAt >= ESC_HOLD_MS) stopRef.current();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Escape") escDownAt = null;
    };
    const block = (e: Event) => e.preventDefault();

    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("keyup", onKeyUp, { capture: true });
    window.addEventListener("contextmenu", block);
    window.addEventListener("beforeunload", block);
    // Safari on iPad zooms on pinch even with touch-action: none.
    window.addEventListener("gesturestart", block);
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("keyup", onKeyUp, { capture: true });
      window.removeEventListener("contextmenu", block);
      window.removeEventListener("beforeunload", block);
      window.removeEventListener("gesturestart", block);
    };
  }, [playing]);

  if (playing) {
    return (
      // Resuming audio on any tap helps after a reload, when no "Los" click unlocked it.
      <div ref={playArea} className="play-area" onPointerDownCapture={unlockAudio}>
        {playtime.goodNight ? <GoodNight /> : <LeaveGame value={stop}>{children}</LeaveGame>}
        {!playtime.goodNight && playtime.dusk > 0 && <Dusk level={playtime.dusk} />}
        <ExitButton onExit={stop} label={t({ de: "Zurück zum Menü", ru: "Назад в меню" })} />
      </div>
    );
  }

  const pick = (id: string) => {
    onMode?.(id);
    void start();
  };

  return (
    <main className="start-screen">
      <Sky />
      <FullscreenCorner />
      <Link to={back} className="back-link">
        ← {backText}
      </Link>
      <h1 className="menu-title">
        <span aria-hidden>{emoji}</span> {title}
      </h1>
      {/* Right under the title, so it stays in sight however long the options get. */}
      {modes ? (
        <section className="mode-picker" aria-label={t({ de: "Spielart wählen", ru: "Выбрать игру" })}>
          <h2 className="mode-heading">{t({ de: "Was spielen wir?", ru: "Во что играем?" })}</h2>
          {level && <div className="mode-level">{level}</div>}
          <ul ref={grid.ref} className={`game-list mode-list ${grid.className}`} style={grid.style}>
            {modes.map((m) => (
              <li key={m.id} className={m.featured ? "mode-featured" : undefined}>
                <button type="button" className="game-card mode-card" onClick={() => pick(m.id)}>
                  <span className="game-emoji" aria-hidden>
                    {m.emoji}
                  </span>
                  <span className="game-title">{m.title}</span>
                  {m.kind && <span className="mode-kind">{m.kind}</span>}
                  <span className="game-go" aria-hidden>
                    ▶
                  </span>
                  {m.id === mode && modes.length > 1 && <span className="badge">{t({ de: "zuletzt", ru: "в прошлый раз" })}</span>}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <button type="button" className="start-button" onClick={start}>
          <span className="start-icon" aria-hidden>
            ▶
          </span>
          {t({ de: "Los geht’s!", ru: "Поехали!" })}
        </button>
      )}
      <PlaytimeNote />
      <div className="settings-panel">
        <div className="panel-buttons">
          <PanelButton
            open={panel === "info"}
            onClick={() => setPanel(panel === "info" ? null : "info")}
            emoji="ℹ️"
            label={t({ de: "Über das Spiel", ru: "Об игре" })}
          />
          {settings && (
            <PanelButton
              open={panel === "settings"}
              onClick={() => setPanel(panel === "settings" ? null : "settings")}
              emoji="⚙️"
              label={t({ de: "Einstellungen", ru: "Настройки" })}
            />
          )}
        </div>
        {panel === "info" && <section className="settings game-info">{info}</section>}
        {panel === "settings" && settings && <section className="settings">{settings}</section>}
      </div>
    </main>
  );
}

/** On the start screen, for the grown-up: how much of today's play time is used. */
function PlaytimeNote() {
  const t = useT();
  const { settings, played } = usePlaytimeState();
  if (settings.by === "none") return null;
  const playedMinutes = Math.min(Math.floor(played.ms / 60_000), settings.minutes);
  return (
    <p className="shared-settings-note">
      <span aria-hidden>⏳</span>{" "}
      {settings.by === "time"
        ? t({
            de: `Spielzeit heute: ${playedMinutes} von ${settings.minutes} Min.`,
            ru: `Время игры сегодня: ${playedMinutes} из ${settings.minutes} мин.`,
          })
        : t({ de: `Spiele heute: ${Math.min(played.games, settings.games)} von ${settings.games}` })}
    </p>
  );
}

/** One of the buttons under the mode cards that opens its panel below them, or folds it away again. */
function PanelButton({ open, onClick, emoji, label }: { open: boolean; onClick: () => void; emoji: string; label: string }) {
  return (
    <button type="button" className="panel-button" aria-expanded={open} onClick={onClick}>
      <span aria-hidden>{emoji}</span> {label}
    </button>
  );
}

/**
 * The last minute of play time: the screen slowly darkens, sounds get quieter
 * and every animation slows down.
 */
function Dusk({ level }: { level: number }) {
  useEffect(() => {
    setSfxVolume(1 - 0.7 * level);
    const rate = 1 - 0.6 * level;
    for (const animation of document.getAnimations()) {
      const target = (animation.effect as KeyframeEffect | null)?.target;
      // The exit ring must keep matching its timer.
      if (target?.closest(".hold-exit")) continue;
      animation.playbackRate = rate;
    }
  }, [level]);

  useEffect(() => () => setSfxVolume(1), []);

  return <div className="playtime-dusk" style={{ opacity: 0.65 * level }} aria-hidden />;
}

/** Play time is over: a quiet night sky that ignores taps and keys until a grown-up exits. */
function GoodNight() {
  const t = useT();
  const language = useAppLanguage();
  const sentence = t({ de: "Gute Nacht! Die Spielzeit ist vorbei.", ru: "Спокойной ночи! Время игры закончилось." });
  useEffect(() => {
    playLullaby();
    const timer = setTimeout(() => speak(sentence, language.speechLang, { rate: 0.7 }), 1200);
    return () => clearTimeout(timer);
  }, [sentence, language.speechLang]);

  return (
    <div className="good-night" role="status">
      {STARS.map(([x, y, delay], i) => (
        <span key={i} className="good-night-star" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${delay}s` }} aria-hidden>
          ✦
        </span>
      ))}
      <span className="good-night-moon" aria-hidden>
        🌙
      </span>
      <span className="good-night-sleeper" aria-hidden>
        🧸<span className="good-night-zzz">💤</span>
      </span>
      <p className="good-night-text">{t({ de: "Gute Nacht!", ru: "Спокойной ночи!" })}</p>
      <p className="good-night-hint">
        {t({
          de: "Die Spielzeit ist vorbei. Zum Beenden ✕ oben rechts gedrückt halten.",
          ru: "Время игры закончилось. Чтобы выйти, удерживайте ✕ справа вверху.",
        })}
      </p>
    </div>
  );
}

/** Star positions in percent of the screen, with a twinkle delay in seconds. */
const STARS: [number, number, number][] = [
  [8, 12, 0],
  [22, 30, 1.2],
  [35, 8, 2.1],
  [52, 22, 0.6],
  [68, 10, 1.7],
  [84, 26, 0.3],
  [92, 8, 2.4],
  [14, 52, 1.9],
  [78, 48, 0.9],
  [44, 40, 2.8],
];

/**
 * The ✕ in the corner: it has to be held for half a second while the ring
 * fills; letting go earlier keeps playing. A short note next to it says what
 * it does when the game starts.
 */
function ExitButton({ onExit, label }: { onExit: () => void; label: string }) {
  const t = useT();
  const [holding, setHolding] = useState(false);
  const [hint, setHint] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const hide = setTimeout(() => setHint(false), EXIT_HINT_MS);
    return () => {
      clearTimeout(hide);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const press = () => {
    if (timer.current) return;
    setHolding(true);
    timer.current = setTimeout(onExit, EXIT_DELAY_MS);
  };

  const release = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  };

  const isPressKey = (key: string) => key === "Enter" || key === " ";

  return (
    <div className={`exit-corner${hint || holding ? " hinted" : ""}`} data-tap-keep>
      <span className="exit-hint" aria-hidden>
        {label} · {t({ de: "halten", ru: "удерживать" })}
      </span>
      {/* On computers only (CSS): a finger on a tablet would end fullscreen by accident. */}
      <FullscreenButton className="play-fullscreen" />
      <button
        type="button"
        className={`hold-exit${holding ? " holding" : ""}`}
        style={{ "--hold-ms": `${EXIT_DELAY_MS}ms` } as CSSProperties}
        aria-label={`${label} (${t({ de: "gedrückt halten", ru: "удерживать" })})`}
        onPointerDown={(e: PointerEvent<HTMLButtonElement>) => {
          // Keep the game from reacting to the tap on the button.
          e.stopPropagation();
          // A finger that slides a little still counts as holding.
          e.currentTarget.setPointerCapture(e.pointerId);
          press();
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (!isPressKey(e.key)) return;
          e.preventDefault();
          if (!e.repeat) press();
        }}
        onKeyUp={(e) => isPressKey(e.key) && release()}
        onBlur={release}
      >
        ✕
      </button>
    </div>
  );
}
