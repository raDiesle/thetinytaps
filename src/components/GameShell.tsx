import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { Sky } from "@/components/Sky";
import { de } from "@/content/de";
import { useDevice } from "@/lib/device";
import { enterKidMode, exitKidMode } from "@/lib/fullscreen";
import {
  clearPlaytime,
  DEFAULT_PLAYTIME_SETTINGS,
  isPlaytimeOver,
  PLAYTIME_OPTIONS,
  PLAYTIME_SETTINGS_KEY,
  startPlaytime,
  usePlaytime,
} from "@/lib/playtime";
import { playLullaby, setSfxVolume, unlockAudio } from "@/lib/sfx";
import { speak, stopSpeaking, unlockSpeech } from "@/lib/speech";
import { useStoredSettings } from "@/lib/storage";

const EXIT_HOLD_MS = 1000;

/** The child-friendly home page (idea A-04). */
export const KID_HOME = "/kinder/";

/**
 * Navigation state of a game opened from the child-friendly home page: it
 * skips the start screen (fullscreen is already on), and its exit leads back
 * there instead of to the grown-ups' options.
 */
export const KID_STATE = { kid: true };

const isKidState = (state: unknown) => (state as { kid?: boolean } | null)?.kid === true;

interface GameShellProps {
  title: string;
  emoji: string;
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
 * Wraps a game with a parent start screen, fullscreen + keyboard lock while
 * playing, and an exit that toddlers won't trigger by accident: hold the
 * corner button or the Esc key for two seconds.
 */
export function GameShell({
  title,
  emoji,
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
  const [playtimeSettings, updatePlaytime] = useStoredSettings(PLAYTIME_SETTINGS_KEY, DEFAULT_PLAYTIME_SETTINGS);
  const playtime = usePlaytime();

  const start = async () => {
    // These need the click as a user gesture, so run them before any await.
    unlockAudio();
    unlockSpeech();
    startPlaytime(playtimeSettings.minutes);
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
    clearPlaytime();
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
      else if (escDownAt !== null && performance.now() - escDownAt >= EXIT_HOLD_MS) stopRef.current();
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
        <HoldToExit onExit={stop} />
      </div>
    );
  }

  const minutes = playtimeSettings.minutes;

  return (
    <main className="start-screen">
      <Sky />
      <Link to={backHref} className="back-link">
        ← {backLabel}
      </Link>
      <h1 className="menu-title">
        <span aria-hidden>{emoji}</span> {title}
      </h1>
      {/* Right under the title, so it stays in sight however long the options get. */}
      <button className="start-button" onClick={start}>
        <span className="start-icon" aria-hidden>
          ▶
        </span>
        Los geht&apos;s!
      </button>
      {/* Folded away by default, so the start screen stays short; the play time shows in the summary. */}
      <details className="settings-panel">
        <summary>
          <span aria-hidden>⚙️</span> Einstellungen
          {minutes > 0 && <span className="settings-summary-note">⏳ {minutes} Min.</span>}
        </summary>
        <section className="settings">
          {settings}
          <SettingsGroup title="Spielzeit">
            <Choice
              label="Spielzeit"
              value={String(minutes)}
              onChange={(value) => updatePlaytime({ minutes: Number(value) })}
              options={PLAYTIME_OPTIONS.map((m) => ({ value: String(m), label: m ? `${m} Min.` : "∞ Ohne" }))}
            />
            <p className="setting-note">
              In der letzten Minute wird alles dunkler, leiser und langsamer. Dann sagt das Spiel „Gute Nacht“ und endet von selbst.
            </p>
          </SettingsGroup>
        </section>
      </details>
      <ExitHelp />
    </main>
  );
}

/** Tells the grown-up, before the game starts, how to get back out of fullscreen. Tablets and phones have no Esc key. */
function ExitHelp() {
  const seconds = EXIT_HOLD_MS / 1000;
  const { touchOnly } = useDevice();
  return (
    <section className="exit-help" aria-label="So kommt man zurück zum Menü">
      <h2>Zurück zum Menü und raus aus dem Vollbild</h2>
      <ul>
        {!touchOnly && (
          <li>
            <span aria-hidden>⌨️</span> Die Taste <kbd>Esc</kbd> {seconds}&nbsp;Sekunde gedrückt halten
          </li>
        )}
        <li>
          <span aria-hidden>👆</span> {touchOnly ? "Den" : "oder den"} Knopf <span className="exit-sample">✕</span> oben rechts{" "}
          {seconds}&nbsp;Sekunde gedrückt halten, bis der Ring voll ist
        </li>
      </ul>
      <p>
        Kurz drücken reicht absichtlich nicht, damit Kinder das Spiel nicht aus Versehen beenden.
        {!touchOnly && (
          <>
            {" "}
            In Safari und Firefox beendet schon ein kurzer Druck auf <kbd>Esc</kbd> das Vollbild; zurück zum Menü geht es dann mit dem
            Knopf <span className="exit-sample">✕</span>.
          </>
        )}
      </p>
    </section>
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
      <p className="good-night-hint">Die Spielzeit ist vorbei. Zum Beenden ✕ oben rechts gedrückt halten.</p>
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

function HoldToExit({ onExit }: { onExit: () => void }) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const begin = (e: PointerEvent) => {
    e.stopPropagation();
    setHolding(true);
    timer.current = setTimeout(onExit, EXIT_HOLD_MS);
  };
  const cancel = () => {
    setHolding(false);
    if (timer.current) clearTimeout(timer.current);
  };

  useEffect(() => cancel, []);

  return (
    <button
      className={`hold-exit${holding ? " holding" : ""}`}
      style={{ "--hold-ms": `${EXIT_HOLD_MS}ms` } as CSSProperties}
      aria-label="Zum Beenden gedrückt halten"
      onPointerDown={begin}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
    >
      ✕
    </button>
  );
}
