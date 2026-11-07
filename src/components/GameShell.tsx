import { useLocation, useNavigate } from "react-router";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { FullscreenButton } from "@/components/FullscreenButton";
import { MenuHead } from "@/components/MenuTop";
import { PageCornerArt } from "@/components/PageCornerArt";
import { SeoText } from "@/components/SeoText";
import { Sky } from "@/components/Sky";
import { categoryHref, categoryOf, isUnfinished, pagesBetween } from "@/content/games";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { putBookBack } from "@/lib/bookTravel";
import { useFitGrid } from "@/lib/fitGrid";
import { enterKidMode, exitKidMode } from "@/lib/fullscreen";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { useCommonSettings } from "@/lib/common";
import { goBack } from "@/lib/goBack";
import { countGame, isPlaytimeOver, usePlaytime, usePlaytimeState } from "@/lib/playtime";
import { routineReturn } from "@/lib/routine";
import { playLullaby, setSfxVolume, unlockAudio } from "@/lib/sfx";
import { stopSpeaking, unlockSpeech } from "@/lib/speech";
import { useHold } from "@/lib/hold";
import { turnPageWith } from "@/lib/look";
import { forwardNearTaps } from "@/lib/tapTargets";
import { hush as hushVoice, recordedVoice } from "@/lib/voice";
import goodNightFiles from "./stimme/**/*.mp3?glob";

/** How long ✕ has to be held to leave the game, where grown-ups chose holding (`leave`); the ring fills meanwhile. */
const EXIT_DELAY_MS = 500;

/** Esc has to be held, since children press it while typing. */
const ESC_HOLD_MS = 1000;

/** Leaves the game for the menu before it, like ✕. */
const LeaveGame = createContext<() => void>(() => {});

/** The way back to the menu before the game, for a game that has a way out of its own (the Timer). */
export const useLeaveGame = () => useContext(LeaveGame);

/**
 * Tells GameShell whether the end of a level (`GameEnd`) is on screen: then the corner in the top left is the way back,
 * with one tap – the ribbon onto the shelf where the game goes back there – and the end shows no „Menü“ button of its own.
 */
const EndShown = createContext<(shown: boolean) => void>(() => {});

/** For `GameEnd`: says it is on screen (true) or gone again (false). */
export const useEndShown = () => useContext(EndShown);

/**
 * A screen inside the game to go back from (a feeling picked in „Wie geht's dir?“, back to all feelings): while a game
 * sets one, the corner in the top left is the way back to the game's screen before, with one tap, and turns the page
 * back – „Back is always the screen seen before“ (root CLAUDE.md, user feedback, November 2026).
 */
const InnerBack = createContext<(back: (() => void) | undefined) => void>(() => {});

/**
 * For a game with screens of its own inside (a card picked, then its page): `back` leads to the screen before, and
 * while it is given the corner's ✕ becomes the way back to it (an arrow, one tap; holding Esc goes there too). Leave it
 * undefined on the game's first screen, where the corner leaves the game as always.
 */
export function useInnerBack(back: (() => void) | undefined) {
  const set = useContext(InnerBack);
  const latest = useRef(back);
  latest.current = back;
  const on = !!back;
  useEffect(() => {
    if (!on) return;
    set(() => latest.current?.());
    return () => set(undefined);
  }, [on, set]);
}

/** Whether what plays counts as play time: not a tool for the day (`GameShellProps.tool`) nor a routine's step. */
const CountsPlaytime = createContext(true);

/** Whether the game on screen counts as play time, for the „Nochmal“ and „Weiter“ at the end of a level. */
export const useCountsPlaytime = () => useContext(CountsPlaytime);

/** One way to play a game, picked on its start screen with a big card. */
export interface GameMode {
  id: string;
  emoji: string;
  title: string;
  /**
   * What sort of level it is when a game has several (e.g. „🛗 Aufzug“): the cards of one sort stand together in a
   * frame, with the sort's name once above them.
   */
  kind?: string;
  /** A short line for grown-ups under the card's name (what is special about it), shown only where the card has room. */
  note?: string;
  /**
   * A picture filling the card in place of its emoji, name and note, which are then only read out and its tooltip – for
   * cards whose picture says it all (the Timer's pictures as they look at their end).
   */
  art?: ReactNode;
}

/** How much wider than tall a card that is a picture (`GameMode.art`) looks best: about a screen's shape. */
const ART_ASPECT = 1.6;

/** The modes in runs of one `kind` each, in the order the kinds first come; one run without kinds when none has one. */
function byKind(modes: GameMode[]) {
  const groups = new Map<string | undefined, GameMode[]>();
  for (const m of modes) groups.set(m.kind, [...(groups.get(m.kind) ?? []), m]);
  return [...groups].map(([kind, modes]) => ({ kind, modes }));
}

interface GameShellProps {
  title: string;
  /** Ways to play, as big cards: tapping one picks it and starts the game. Without them there is one start button. */
  modes?: GameMode[];
  /** The mode played last, marked on its card. */
  mode?: string;
  onMode?: (id: string) => void;
  /**
   * Plays this mode as soon as the page opens, without a start screen, for a game a grown-up opens in the moment (the
   * child has to go now) or one with nothing to pick first. Leaving it (✕, Esc, „Menü“) goes back to the page it was
   * opened from, its category's page (or the shelf): never to a start screen the child didn't see before playing.
   */
  startMode?: string;
  /** With `startMode`: the menu before the game when it isn't its category's page (a picture of Lebendige Bilder: `/bilder/`). */
  leaveTo?: string;
  /** A level or difficulty choice shown above the mode cards. */
  level?: ReactNode;
  /**
   * Puts `level` into the menu's head, as Lebendige Bilder's menu does: on a phone on its side beside the way back, in
   * the room the corner or ribbon takes anyway, so a menu with many cards (the Timer's twelve) still shows them all.
   */
  levelInHead?: boolean;
  /** Parent-facing options shown on the start screen; left out where the game needs none. */
  settings?: ReactNode;
  /** The game itself; only mounted while playing. */
  children: ReactNode;
  /**
   * A tool for the day rather than a game (the Timer): no play time counted or checked, so it still works when play
   * time is over, like the Belohnungstafel (add its address to `PlaytimeLock` too).
   */
  tool?: boolean;
  /** Where the start screen's back link leads; by default the game's category on the home menu. */
  backHref?: string;
  backLabel?: string;
}

/**
 * Where leaving a game (✕, Esc, „Menü“) goes when it played at once: the menu seen before it, its `leaveTo` or `back`
 * (its category's table of contents, or the shelf). None for a game started from its own start screen, which shows
 * again.
 */
export function menuAfterPlay(game: Pick<GameShellProps, "startMode" | "leaveTo">, back: string) {
  return game.leaveTo ?? (game.startMode ? back : undefined);
}

/**
 * Wraps a game with a parent start screen (pick the way to play, options),
 * fullscreen (kept after the game) + keyboard lock while playing, and the exit: the corner's ✕ (a tap, or held where
 * grown-ups chose so), or holding Esc – children press Esc while typing, so it is always held.
 */
export function GameShell({
  title,
  modes,
  mode,
  onMode,
  startMode,
  leaveTo,
  level,
  levelInHead,
  settings,
  tool,
  children,
  backHref,
  backLabel,
}: GameShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const t = useT();
  // Opened as a step of a routine (the Tagesplan): plays at once, without play time, and goes back there afterwards.
  const returnTo = routineReturn(location.state);
  // Neither a routine's step nor a tool counts as play, nor stops when play time is over.
  const free = !!returnTo || !!tool;
  // A game still being built is opened from the management page only, so its way back leads there.
  const unfinished = isUnfinished(location.pathname);
  const category = unfinished ? undefined : categoryOf(location.pathname);
  const back = backHref ?? (unfinished ? "/management/" : category ? categoryHref(category) : "/");
  const backText =
    backLabel ??
    (unfinished
      ? "Management"
      : category
        ? t(category.title)
        : t({ de: "Alle Spiele", ru: "Все игры", en: "All Games", zh: "全部游戏", hi: "सभी खेल", es: "Todos los juegos", ar: "كل الألعاب" }));
  const menu = menuAfterPlay({ startMode, leaveTo }, back);
  const [playing, setPlaying] = useState(false);
  // The end of a level is on screen (GameEnd): the corner is then the way back, not a „Menü“ button.
  const [ended, setEnded] = useState(false);
  // A screen inside the game to go back from (`useInnerBack`): the corner then goes there instead of leaving.
  const innerBack = useRef<(() => void) | undefined>(undefined);
  const [inner, setInner] = useState(false);
  const setInnerBack = useRef((back: (() => void) | undefined) => {
    innerBack.current = back;
    setInner(!!back);
  }).current;
  const goInner = () => {
    const back = innerBack.current;
    if (back) turnPageWith("back", back);
  };
  const goInnerRef = useRef(goInner);
  goInnerRef.current = goInner;
  // The settings panel below the top row: folded away by default, so the start screen stays short.
  const [settingsOpen, setSettingsOpen] = useState(false);
  const playtime = usePlaytime(playing && !free);
  const groups = modes?.some((m) => m.kind) ? byKind(modes) : undefined;
  const grid = useFitGrid(
    modes?.length ?? 0,
    groups?.map((g) => g.modes.length),
    // Cards that are a picture come about as wide as a screen, the shape of the picture.
    modes?.some((m) => m.art) ? ART_ASPECT : undefined,
  );
  // The background song runs on from the menus into the game (BackgroundMusic), until the play time is over.
  useNoBackgroundMusic(playing && playtime.goodNight);
  // Taps a little next to something the child can tap still count for it (see tapTargets.ts).
  const playArea = useRef<HTMLDivElement>(null);
  useEffect(() => (playing && playArea.current ? forwardNearTaps(playArea.current) : undefined), [playing]);

  /** Starts playing; `turn` turns the page into the game (not when the page opens playing). */
  const start = async (turn = false) => {
    // The menus are locked then (PlaytimeLock); this also stops a key that slips past it. A routine's step is no game.
    if (!free) {
      if (isPlaytimeOver()) return;
      countGame();
    }
    // These need the click as a user gesture, so run them before any await.
    unlockAudio();
    unlockSpeech();
    if (turn) turnPageWith("forward", () => setPlaying(true));
    else setPlaying(true);
    await enterKidMode();
  };

  const stop = () => {
    stopSpeaking();
    hushVoice();
    // Only the keyboard lock ends: fullscreen stays on, the menus are part of the app too.
    exitKidMode();
    const leave = () => {
      setPlaying(false);
      // Back in the history too, so the phone's back button doesn't open the game again (goBack.ts).
      if (returnTo) goBack(navigate, returnTo);
      else if (menu) goBack(navigate, menu);
    };
    // The page turns back from the game to its menu: as many pages as lie between them, or the book
    // closes and goes back on the shelf.
    if (!returnTo && menu === "/") putBookBack(location.pathname, leave);
    else turnPageWith("back", leave, !returnTo && menu ? pagesBetween(location.pathname, menu) : 1);
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
      else if (escDownAt !== null && performance.now() - escDownAt >= ESC_HOLD_MS) {
        escDownAt = null;
        if (innerBack.current) goInnerRef.current();
        else stopRef.current();
      }
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

  // A game that starts at once (or a routine's step) does so only when the page opens, once (React runs effects twice
  // while developing).
  const started = useRef(false);
  useEffect(() => {
    if ((!startMode && !returnTo) || started.current) return;
    started.current = true;
    if (startMode) onMode?.(startMode);
    // Play time is over: no start screen to wait on, so back to the menu, which the lock covers.
    if (menu && !free && isPlaytimeOver()) goBack(navigate, menu);
    else void start();
  }, []);

  if (playing) {
    const backToMenu = t({
      de: "Zurück zum Menü",
      ru: "Назад в меню",
      en: "Back to menu",
      zh: "返回菜单",
      hi: "मेन्यू पर वापस",
      es: "Volver al menú",
      ar: "العودة إلى القائمة",
    });
    // Leaving closes the book and puts it back on the shelf (see `stop`).
    const toShelf = !returnTo && menu === "/";
    return (
      // Resuming audio on any tap helps after a reload, when no "Los" click unlocked it.
      <div ref={playArea} className="play-area" onPointerDownCapture={unlockAudio}>
        {playtime.goodNight ? (
          <GoodNight />
        ) : (
          <LeaveGame value={stop}>
            <EndShown value={setEnded}>
              <InnerBack value={setInnerBack}>
                <CountsPlaytime value={!free}>{children}</CountsPlaytime>
              </InnerBack>
            </EndShown>
          </LeaveGame>
        )}
        {!free && !playtime.goodNight && playtime.dusk > 0 && <Dusk level={playtime.dusk} />}
        {/* The edge of the book's page round the picture (`book.css`). */}
        <div className="book-frame" aria-hidden />
        {inner && !ended && !playtime.goodNight ? (
          // Back to the game's screen before (`useInnerBack`): one tap, held or not, since nothing is left.
          <TapExit onExit={goInner} sign="back" label={t({ de: "Zurück", ru: "Назад", en: "Back", zh: "返回", hi: "वापस", es: "Atrás", ar: "رجوع" })} />
        ) : ended && !playtime.goodNight ? (
          // At the end of a level the corner is the way back, as in a menu: one tap, held or not (the „Menü“ button it
          // replaces was a tap too), and onto the shelf it is the book's ribbon, since the book closes and goes back.
          <TapExit
            onExit={stop}
            sign={toShelf ? "shelf" : "close"}
            label={
              toShelf
                ? t({
                    de: "Zurück zum Bücherregal",
                    ru: "Назад к книжной полке",
                    en: "Back to the bookshelf",
                    zh: "返回书架",
                    hi: "किताबों की अलमारी पर वापस",
                    es: "Volver a la estantería",
                    ar: "العودة إلى رف الكتب",
                  })
                : backToMenu
            }
          />
        ) : (
          <ExitButton onExit={stop} label={backToMenu} />
        )}
      </div>
    );
  }

  // Nothing to show before the game starts at once, or after it was left.
  if (menu) return null;

  /** One mode's card. */
  const card = (m: GameMode) => (
    <li key={m.id}>
      <button
        type="button"
        className={`game-card mode-card${m.art ? " mode-art-card" : ""}`}
        onClick={() => pick(m.id)}
        aria-label={m.art ? [m.title, m.note].filter(Boolean).join(": ") : undefined}
        title={m.art ? [m.title, m.note].filter(Boolean).join(": ") : undefined}
      >
        {m.art ? (
          <span className="mode-art">{m.art}</span>
        ) : (
          <>
            <span className="game-emoji" aria-hidden>
              {m.emoji}
            </span>
            <span className="game-title">
              {m.title}
              {m.note && <small className="game-note">{m.note}</small>}
            </span>
          </>
        )}
        {m.id === mode && (modes?.length ?? 0) > 1 && (
          <span className="badge">
            {t({ de: "zuletzt", ru: "в прошлый раз", en: "last time", zh: "上次玩的", hi: "पिछली बार", es: "la última vez", ar: "آخر مرة" })}
          </span>
        )}
      </button>
    </li>
  );

  const pick = (id: string) => {
    onMode?.(id);
    void start(true);
  };

  return (
    <main className="start-screen">
      <Sky />
      {/* The settings' small round sign right next to the way back: for grown-ups, out of the cards' way, taking no row of their own. */}
      <MenuHead
        to={back}
        back={backText}
        title={title}
        tools={
          settings && (
            <PanelButton
              open={settingsOpen}
              onClick={() => setSettingsOpen(!settingsOpen)}
              icon={<span>⚙️</span>}
              label={t({ de: "Einstellungen", ru: "Настройки", en: "Settings", zh: "设置", hi: "सेटिंग्स", es: "Ajustes", ar: "الإعدادات" })}
            />
          )
        }
      >
        {levelInHead && level && <div className="mode-level">{level}</div>}
      </MenuHead>
      {settingsOpen && settings && <section className="settings">{settings}</section>}
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
          {!levelInHead && level && <div className="mode-level">{level}</div>}
          <ul ref={grid.ref} className={`game-list mode-list ${grid.className}`} style={grid.style}>
            {groups
              ? groups.map((g, i) => (
                  <li key={g.kind ?? ""} className="mode-group" style={grid.places?.[i]}>
                    {g.kind && <span className="mode-group-label">{g.kind}</span>}
                    <ul className="mode-group-cards" aria-label={g.kind}>
                      {g.modes.map(card)}
                    </ul>
                  </li>
                ))
              : modes.map(card)}
          </ul>
        </section>
      ) : (
        <button type="button" className="start-button" data-spread onClick={() => void start(true)}>
          <span className="start-icon" aria-hidden>
            ▶
          </span>
          {t({ de: "Los geht’s!", ru: "Поехали!", en: "Let’s go!", zh: "出发！", hi: "चलो!", es: "¡Vamos!", ar: "هيّا بنا!" })}
        </button>
      )}
      <PlaytimeNote />
      <SeoText />
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

/**
 * The small round sign next to the way back (⚙️): opens its panel below the top row, or folds it away
 * again. Its name is only a tooltip and read out, so it takes no more room than the sign.
 */
function PanelButton({ open, onClick, icon, label }: { open: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button type="button" className="home-menu-button icon-only panel-icon" aria-expanded={open} aria-label={label} title={label} onClick={onClick}>
      {icon}
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

/** The good-night sentence's recordings. */
const goodNightVoice = recordedVoice(goodNightFiles);

/** Said when play time is over, from its recording (src/components/stimme/). */
export const GOOD_NIGHT: Localized = {
  de: "Gute Nacht! Die Spielzeit ist vorbei.",
  ru: "Спокойной ночи! Время игры закончилось.",
  en: "Good night! Play time is over.",
  zh: "晚安！游戏时间结束了。",
  hi: "शुभ रात्रि! खेलने का समय ख़त्म हो गया।",
  es: "¡Buenas noches! Se acabó el tiempo de juego.",
  ar: "ليلة سعيدة! انتهى وقت اللعب.",
};

/** Play time is over: a quiet night sky that ignores taps and keys until a grown-up exits. */
function GoodNight() {
  const t = useT();
  const language = useAppLanguage();
  const [{ leave }] = useCommonSettings();
  useEffect(() => {
    playLullaby();
    const timer = setTimeout(() => goodNightVoice.say(GOOD_NIGHT[language.id] ?? GOOD_NIGHT.de, language.id, { english: GOOD_NIGHT.en }), 1200);
    return () => {
      clearTimeout(timer);
      hushVoice();
    };
  }, [language.id]);

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
      {/* No side named: the ✕ is the page's corner, top left. */}
      <p className="good-night-hint">
        {leave === "hold"
          ? t({
              de: "Die Spielzeit ist vorbei. Zum Beenden ✕ gedrückt halten.",
              ru: "Время игры закончилось. Чтобы выйти, удерживайте ✕.",
              en: "Play time is over. To leave, hold ✕.",
              zh: "游戏时间结束了。按住 ✕ 即可退出。",
              hi: "खेलने का समय ख़त्म हो गया। बाहर निकलने के लिए ✕ दबाए रखें।",
              es: "Se acabó el tiempo de juego. Para salir, mantenga pulsada la ✕.",
              ar: "انتهى وقت اللعب. للخروج اضغطوا مطولًا على ✕.",
            })
          : t({
              de: "Die Spielzeit ist vorbei. Zum Beenden auf ✕ tippen.",
              ru: "Время игры закончилось. Чтобы выйти, нажмите ✕.",
              en: "Play time is over. To leave, tap ✕.",
              zh: "游戏时间结束了。轻点 ✕ 即可退出。",
              hi: "खेलने का समय ख़त्म हो गया। बाहर निकलने के लिए ✕ पर टैप करें।",
              es: "Se acabó el tiempo de juego. Para salir, toque la ✕.",
              ar: "انتهى وقت اللعب. للخروج انقروا على ✕.",
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
 * The ✕ in the corner (the page's turned-up corner): one tap leaves the game, or – where grown-ups chose
 * holding (`leave`, under ⏳ on the home page) – it has to be held for half a second while the ring fills (the corner
 * lifts), and letting go earlier keeps playing. No note beside it says what it does: grown-ups know ✕ and the corner
 * (user feedback, November 2026); its name is only read out.
 */
function ExitButton({ onExit, label }: { onExit: () => void; label: string }) {
  const [{ leave }] = useCommonSettings();
  return leave === "hold" ? <HoldExit onExit={onExit} label={label} /> : <TapExit onExit={onExit} label={label} />;
}

/**
 * The ✕ left with one tap; `shelf` draws the book's ribbon instead, the way back onto the shelf, and `back` the page's
 * corner with an arrow, back to the game's screen before (`useInnerBack`).
 */
function TapExit({ onExit, label, sign = "close" }: { onExit: () => void; label: string; sign?: "close" | "back" | "shelf" }) {
  const shelf = sign === "shelf";
  return (
    <ExitCorner>
      <button
        type="button"
        className={shelf ? "hold-exit exit-ribbon" : "hold-exit"}
        aria-label={label}
        // Keeps the game from reacting to the tap on the button.
        onPointerDown={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.preventDefault()}
        // A click, not pointer down: leaving on the way down would let the lifted finger tap the menu.
        onClick={onExit}
      >
        {sign === "close" ? <ExitSign /> : <PageCornerArt sign={sign} />}
      </button>
    </ExitCorner>
  );
}

/** The ✕ that has to be held. */
function HoldExit({ onExit, label }: { onExit: () => void; label: string }) {
  const t = useT();
  const { holding, props } = useHold(onExit, EXIT_DELAY_MS);
  return (
    <ExitCorner>
      <button
        type="button"
        className={`hold-exit${holding ? " holding" : ""}`}
        aria-label={`${label} (${t({ de: "gedrückt halten", ru: "удерживать", en: "hold", zh: "按住", hi: "दबाए रखें", es: "mantener pulsado", ar: "ضغط مطوّل" })})`}
        {...props}
      >
        <ExitSign />
      </button>
    </ExitCorner>
  );
}

/**
 * The corner the ✕ sits in, alone in the top left; the fullscreen button goes to the far top right, with ⚙️ (if the
 * game has one) right beside it on its left (user feedback, November 2026: beside the ✕ it hung on its own up there).
 */
function ExitCorner({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="exit-corner" data-tap-keep>
        {children}
      </div>
      <div className="play-fullscreen-corner" data-tap-keep>
        {/* Only to get back into fullscreen: a child's finger must not end it. */}
        <FullscreenButton className="play-fullscreen" playing />
      </div>
    </>
  );
}

/** The ✕: the page's turned-up corner with a ✕ on it (`book.css`), lifting further while held. */
function ExitSign() {
  return <PageCornerArt sign="close" />;
}
