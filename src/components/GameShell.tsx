import { useLocation } from "react-router";
import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { FullscreenButton } from "@/components/FullscreenButton";
import { MenuHead } from "@/components/MenuTop";
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
  /**
   * Plays this mode as soon as the page opens, without the start screen, for a game a grown-up opens in the
   * moment (the child has to go now). The start screen shows only after leaving the game (✕, Esc, „Menü“).
   */
  startMode?: string;
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
export function GameShell({ title, emoji, modes, mode, onMode, startMode, level, info, settings, children, backHref, backLabel }: GameShellProps) {
  const location = useLocation();
  const t = useT();
  const category = categoryOf(location.pathname);
  const back = backHref ?? (category ? categoryHref(category) : "/");
  const backText =
    backLabel ??
    (category
      ? t(category.title)
      : t({ de: "Alle Spiele", ru: "Все игры", en: "All Games", zh: "全部游戏", hi: "सभी खेल", es: "Todos los juegos", ar: "كل الألعاب" }));
  const [playing, setPlaying] = useState(false);
  // The panel opened below the two buttons, if any: folded away by default, so the start screen stays short.
  const [panel, setPanel] = useState<"info" | "settings" | null>(null);
  const playtime = usePlaytime(playing);
  const grid = useFitGrid(modes?.length ?? 0);
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

  // A game that starts at once does so only when the page opens, once (React runs effects twice while developing).
  const started = useRef(false);
  useEffect(() => {
    if (!startMode || started.current) return;
    started.current = true;
    onMode?.(startMode);
    void start();
  }, []);

  if (playing) {
    return (
      // Resuming audio on any tap helps after a reload, when no "Los" click unlocked it.
      <div ref={playArea} className="play-area" onPointerDownCapture={unlockAudio}>
        {playtime.goodNight ? <GoodNight /> : <LeaveGame value={stop}>{children}</LeaveGame>}
        {!playtime.goodNight && playtime.dusk > 0 && <Dusk level={playtime.dusk} />}
        <ExitButton
          onExit={stop}
          label={t({
            de: "Zurück zum Menü",
            ru: "Назад в меню",
            en: "Back to menu",
            zh: "返回菜单",
            hi: "मेन्यू पर वापस",
            es: "Volver al menú",
            ar: "العودة إلى القائمة",
          })}
        />
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
      {/* Small, at the top next to the way back: for grown-ups, out of the cards' way, never under them. */}
      <MenuHead
        to={back}
        back={backText}
        title={
          <>
            <span aria-hidden>{emoji}</span> {title}
          </>
        }
      >
        <div className="panel-buttons">
          <PanelButton
            open={panel === "info"}
            onClick={() => setPanel(panel === "info" ? null : "info")}
            emoji="ℹ️"
            label={t({ de: "Über das Spiel", ru: "Об игре", en: "About the game", zh: "关于游戏", hi: "खेल के बारे में", es: "Sobre el juego", ar: "عن اللعبة" })}
          />
          {settings && (
            <PanelButton
              open={panel === "settings"}
              onClick={() => setPanel(panel === "settings" ? null : "settings")}
              emoji="⚙️"
              label={t({ de: "Einstellungen", ru: "Настройки", en: "Settings", zh: "设置", hi: "सेटिंग्स", es: "Ajustes", ar: "الإعدادات" })}
            />
          )}
        </div>
      </MenuHead>
      {panel === "info" && <section className="settings game-info">{info}</section>}
      {panel === "settings" && settings && <section className="settings">{settings}</section>}
      {/* Right under the title, so it stays in sight however long the options get. Centred in the room the
          cards leave (data-spread), so the back link and the grown-ups' buttons stay in the top row. */}
      {modes ? (
        <section
          className="mode-picker"
          data-spread
          aria-label={t({
            de: "Spielart wählen",
            ru: "Выбрать игру",
            en: "Choose a way to play",
            zh: "选择玩法",
            hi: "खेलने का तरीका चुनें",
            es: "Elegir modo de juego",
            ar: "اختيار طريقة اللعب",
          })}
        >
          <h2 className="mode-heading">
            {t({
              de: "Was spielen wir?",
              ru: "Во что играем?",
              en: "What shall we play?",
              zh: "我们玩什么？",
              hi: "क्या खेलें?",
              es: "¿A qué jugamos?",
              ar: "ماذا نلعب؟",
            })}
          </h2>
          {level && <div className="mode-level">{level}</div>}
          <ul ref={grid.ref} className={`game-list mode-list ${grid.className}`} style={grid.style}>
            {modes.map((m) => (
              <li key={m.id}>
                <button type="button" className="game-card mode-card" onClick={() => pick(m.id)}>
                  <span className="game-emoji" aria-hidden>
                    {m.emoji}
                  </span>
                  <span className="game-title">{m.title}</span>
                  {m.kind && <span className="mode-kind">{m.kind}</span>}
                  <span className="game-go" aria-hidden>
                    ▶
                  </span>
                  {m.id === mode && modes.length > 1 && (
                    <span className="badge">
                      {t({ de: "zuletzt", ru: "в прошлый раз", en: "last time", zh: "上次玩的", hi: "पिछली बार", es: "la última vez", ar: "آخر مرة" })}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <button type="button" className="start-button" data-spread onClick={start}>
          <span className="start-icon" aria-hidden>
            ▶
          </span>
          {t({ de: "Los geht’s!", ru: "Поехали!", en: "Let’s go!", zh: "出发！", hi: "चलो!", es: "¡Vamos!", ar: "هيّا بنا!" })}
        </button>
      )}
      <PlaytimeNote />
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
            en: `Play time today: ${playedMinutes} of ${settings.minutes} min`,
            zh: `今天的游戏时间：${playedMinutes} / ${settings.minutes} 分钟`,
            hi: `आज खेलने का समय: ${settings.minutes} में से ${playedMinutes} मिनट`,
            es: `Tiempo de juego hoy: ${playedMinutes} de ${settings.minutes} min`,
            ar: `وقت اللعب اليوم: ${playedMinutes} من ${settings.minutes} دقيقة`,
          })
        : t({
            de: `Spiele heute: ${Math.min(played.games, settings.games)} von ${settings.games}`,
            ru: `Игры сегодня: ${Math.min(played.games, settings.games)} из ${settings.games}`,
            en: `Games today: ${Math.min(played.games, settings.games)} of ${settings.games}`,
            zh: `今天的游戏：${Math.min(played.games, settings.games)} / ${settings.games} 局`,
            hi: `आज के खेल: ${settings.games} में से ${Math.min(played.games, settings.games)}`,
            es: `Juegos hoy: ${Math.min(played.games, settings.games)} de ${settings.games}`,
            ar: `ألعاب اليوم: ${Math.min(played.games, settings.games)} من ${settings.games}`,
          })}
    </p>
  );
}

/** One of the small buttons in the top row that opens its panel below that row, or folds it away again. */
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
  const sentence = t({
    de: "Gute Nacht! Die Spielzeit ist vorbei.",
    ru: "Спокойной ночи! Время игры закончилось.",
    en: "Good night! Play time is over.",
    zh: "晚安！游戏时间结束了。",
    hi: "शुभ रात्रि! खेलने का समय ख़त्म हो गया।",
    es: "¡Buenas noches! Se acabó el tiempo de juego.",
    ar: "ليلة سعيدة! انتهى وقت اللعب.",
  });
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
      <p className="good-night-text">
        {t({ de: "Gute Nacht!", ru: "Спокойной ночи!", en: "Good night!", zh: "晚安！", hi: "शुभ रात्रि!", es: "¡Buenas noches!", ar: "ليلة سعيدة!" })}
      </p>
      <p className="good-night-hint">
        {t({
          de: "Die Spielzeit ist vorbei. Zum Beenden ✕ oben rechts gedrückt halten.",
          ru: "Время игры закончилось. Чтобы выйти, удерживайте ✕ справа вверху.",
          en: "Play time is over. To leave, hold ✕ at the top right.",
          zh: "游戏时间结束了。按住右上角的 ✕ 即可退出。",
          hi: "खेलने का समय ख़त्म हो गया। बाहर निकलने के लिए ऊपर दाईं ओर ✕ दबाए रखें।",
          es: "Se acabó el tiempo de juego. Para salir, mantenga pulsada la ✕ arriba a la derecha.",
          ar: "انتهى وقت اللعب. للخروج اضغطوا مطولًا على ✕ في الأعلى يمينًا.",
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
        {label} · {t({ de: "halten", ru: "удерживать", en: "hold", zh: "按住", hi: "दबाए रखें", es: "mantener pulsado", ar: "ضغط مطوّل" })}
      </span>
      {/* On phones and tablets only to get back into fullscreen (CSS): a child's finger must not end it. */}
      <FullscreenButton className="play-fullscreen" playing />
      <button
        type="button"
        className={`hold-exit${holding ? " holding" : ""}`}
        style={{ "--hold-ms": `${EXIT_DELAY_MS}ms` } as CSSProperties}
        aria-label={`${label} (${t({ de: "gedrückt halten", ru: "удерживать", en: "hold", zh: "按住", hi: "दबाए रखें", es: "mantener pulsado", ar: "ضغط مطوّل" })})`}
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
