import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { Sky } from "@/components/Sky";
import { de } from "@/content/de";
import { useFitGrid } from "@/lib/fitGrid";
import { enterKidMode, exitKidMode } from "@/lib/fullscreen";
import {
  DEFAULT_PLAYTIME_SETTINGS,
  isPlaytimeOver,
  playedToday,
  PLAYTIME_SETTINGS_KEY,
  resetPlaytime,
  usePlaytime,
} from "@/lib/playtime";
import { playLullaby, setSfxVolume, unlockAudio } from "@/lib/sfx";
import { speak, stopSpeaking, unlockSpeech } from "@/lib/speech";
import { useStoredSettings } from "@/lib/storage";

/** A click on ✕ leaves the game after this long; the ring fills meanwhile. */
const EXIT_DELAY_MS = 500;

/** Esc has to be held, since children press it while typing. */
const ESC_HOLD_MS = 1000;

/** How long the "Zurück zum Menü" note shows next to ✕ when a game starts. */
const EXIT_HINT_MS = 4000;

/** The child-friendly home page (idea A-04). */
export const KID_HOME = "/kinder/";

/**
 * Navigation state of a game opened from the child-friendly home page: it
 * skips the start screen (fullscreen is already on), and its exit leads back
 * there instead of to the grown-ups' options.
 */
export const KID_STATE = { kid: true };

const isKidState = (state: unknown) => (state as { kid?: boolean } | null)?.kid === true;

/** One way to play a game, picked on its start screen with a big card. */
export interface GameMode {
  id: string;
  emoji: string;
  title: string;
  /** Drawn bigger and across the whole row, e.g. for "all of them in turn". */
  featured?: boolean;
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
  /** Parent-facing options shown on the start screen. */
  settings?: ReactNode;
  /** The game itself; only mounted while playing. */
  children: ReactNode;
  /** Where the start screen's back link leads. */
  backHref?: string;
  backLabel?: string;
  /** This is the child-friendly home page itself: its exit leaves kid mode for good. */
  kidHome?: boolean;
}

/**
 * Wraps a game with a parent start screen (pick the way to play, options),
 * fullscreen + keyboard lock while playing, and the exit: a click on the corner
 * button, or holding Esc.
 */
export function GameShell({
  title,
  emoji,
  modes,
  mode,
  onMode,
  level,
  settings,
  children,
  backHref = "/",
  backLabel = "Alle Spiele",
  kidHome = false,
}: GameShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const kidMode = isKidState(location.state);
  const [playing, setPlaying] = useState(kidMode);
  const [playtimeSettings] = useStoredSettings(PLAYTIME_SETTINGS_KEY, DEFAULT_PLAYTIME_SETTINGS);
  const playtime = usePlaytime(playing);
  // Bumped when the grown-up starts the play time afresh, to show it at once.
  const [, setResets] = useState(0);
  const grid = useFitGrid(modes?.length ?? 0, modes?.filter((m) => m.featured).length);

  const start = async () => {
    // These need the click as a user gesture, so run them before any await.
    unlockAudio();
    unlockSpeech();
    setPlaying(true);
    await enterKidMode();
  };

  const stop = () => {
    stopSpeaking();
    // A game picked by the child goes back to the picture menu, still in fullscreen;
    // once play time is over the grown-up's exit ends kid mode right away.
    if (kidMode && !kidHome && !isPlaytimeOver()) {
      navigate(KID_HOME, { state: KID_STATE });
      return;
    }
    setPlaying(false);
    void exitKidMode();
    // Drop the kid state, so a reload shows the grown-ups' start screen.
    if (kidMode) navigate(kidHome ? location.pathname : KID_HOME, { replace: kidHome });
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
      <div className="play-area" onPointerDownCapture={unlockAudio}>
        {playtime.over ? <GoodNight /> : children}
        {!playtime.over && playtime.dusk > 0 && <Dusk level={playtime.dusk} />}
        <ExitButton onExit={stop} label={kidHome ? "Beenden" : "Zurück zum Menü"} />
      </div>
    );
  }

  const minutes = playtimeSettings.minutes;
  const playedMinutes = Math.floor(playedToday() / 60_000);
  const over = isPlaytimeOver();

  const pick = (id: string) => {
    onMode?.(id);
    void start();
  };

  return (
    <main className="start-screen">
      <Sky />
      <Link to={backHref} className="back-link">
        ← {backLabel}
      </Link>
      <h1 className="menu-title">
        <span aria-hidden>{emoji}</span> {title}
      </h1>
      {over && (
        <p className="playtime-over-note" role="status">
          <span aria-hidden>🌙</span> Die Spielzeit für heute ({minutes} Min.) ist vorbei.
          <button
            type="button"
            onClick={() => {
              resetPlaytime();
              setResets((n) => n + 1);
            }}
          >
            Noch einmal {minutes} Min.
          </button>
        </p>
      )}
      {/* Right under the title, so it stays in sight however long the options get. */}
      {modes ? (
        <section className="mode-picker" aria-label="Spielart wählen">
          <h2 className="mode-heading">Was spielen wir?</h2>
          {level && <div className="mode-level">{level}</div>}
          <ul ref={grid.ref} className={`game-list mode-list ${grid.className}`} style={grid.style}>
            {modes.map((m) => (
              <li key={m.id} className={m.featured ? "mode-featured" : undefined}>
                <button type="button" className="game-card mode-card" onClick={() => pick(m.id)}>
                  <span className="game-emoji" aria-hidden>
                    {m.emoji}
                  </span>
                  <span className="game-title">{m.title}</span>
                  <span className="game-go" aria-hidden>
                    ▶
                  </span>
                  {m.id === mode && modes.length > 1 && <span className="badge">zuletzt</span>}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <button className="start-button" onClick={start}>
          <span className="start-icon" aria-hidden>
            ▶
          </span>
          Los geht&apos;s!
        </button>
      )}
      {minutes > 0 && (
        <p className="shared-settings-note">
          <span aria-hidden>⏳</span> Spielzeit heute: {Math.min(playedMinutes, minutes)} von {minutes} Min.
        </p>
      )}
      {settings && (
        // Folded away by default, so the start screen stays short.
        <details className="settings-panel">
          <summary>
            <span aria-hidden>⚙️</span> Einstellungen für dieses Spiel
          </summary>
          <section className="settings">{settings}</section>
        </details>
      )}
    </main>
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
  useEffect(() => {
    playLullaby();
    const timer = setTimeout(() => speak("Gute Nacht! Die Spielzeit ist vorbei.", de.speechLang, { rate: 0.7 }), 1200);
    return () => clearTimeout(timer);
  }, []);

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
      <p className="good-night-text">Gute Nacht!</p>
      <p className="good-night-hint">Die Spielzeit ist vorbei. Zum Beenden ✕ oben rechts antippen.</p>
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
 * The ✕ in the corner: a click leaves the game after half a second, while the
 * ring fills. A short note next to it says what it does when the game starts.
 */
function ExitButton({ onExit, label }: { onExit: () => void; label: string }) {
  const [leaving, setLeaving] = useState(false);
  const [hint, setHint] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const hide = setTimeout(() => setHint(false), EXIT_HINT_MS);
    return () => {
      clearTimeout(hide);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const leave = () => {
    if (timer.current) return;
    setLeaving(true);
    timer.current = setTimeout(onExit, EXIT_DELAY_MS);
  };

  return (
    <div className={`exit-corner${hint || leaving ? " hinted" : ""}`}>
      <span className="exit-hint" aria-hidden>
        {label}
      </span>
      <button
        type="button"
        className={`hold-exit${leaving ? " holding" : ""}`}
        style={{ "--hold-ms": `${EXIT_DELAY_MS}ms` } as CSSProperties}
        aria-label={label}
        // Keep the game from reacting to the tap on the button.
        onPointerDown={(e: PointerEvent) => e.stopPropagation()}
        onClick={leave}
      >
        ✕
      </button>
    </div>
  );
}
