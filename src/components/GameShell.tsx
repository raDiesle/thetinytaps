import { useLocation, useNavigate } from "react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { GoodNight } from "@/components/GoodNight";
import { CardPicture, pictureCard, UNFINISHED_LABEL } from "@/components/GameCard";
import { EndShown, GameExit, InnerBack, LeaveGame, LeavesToShelf, useInnerBackState, usePlayGuards } from "@/components/gameExit";
import { LevelOnScreen, useLevelAddress, useLevelSync } from "@/components/gameLevelAddress";
import { MenuHead } from "@/components/MenuTop";
import { CountsPlaytime, Dusk, PlaytimeNote } from "@/components/playtimeUi";
import { SeoText, SeoWords } from "@/components/SeoText";
import { Sky } from "@/components/Sky";
import { categoryHref, categoryOf, isHidden, pagesBetween } from "@/content/games";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { putBookBack } from "@/lib/bookTravel";
import { PICTURE_CARDS, useFitGrid } from "@/lib/fitGrid";
import { enterKidMode, exitKidMode } from "@/lib/fullscreen";
import { useT } from "@/lib/language";
import { codeSoon } from "@/lib/lazyPart";
import { backFrom, goBack } from "@/lib/goBack";
import { levelHref } from "@/lib/levelAddress";
import { countGame, isPlaytimeOver, usePlaytime } from "@/lib/playtime";
import { track } from "@/lib/analytics";
import { routineReturn } from "@/lib/routine";
import { unlockAudio } from "@/lib/sfx";
import { stopSpeaking, unlockSpeech } from "@/lib/speech";
import { useHold } from "@/lib/hold";
import { UNLOCK_HOLD_MS, canPlayUnfinished, unlockUnfinished } from "@/lib/localTest";
import { turnPageWith } from "@/lib/look";
import { forwardNearTaps } from "@/lib/tapTargets";
import { hush as hushVoice } from "@/lib/voice";

// Leaving, the level's address and play time live in modules of their own; games keep importing their hooks from here.
export { useEndShown, useInnerBack, useLeaveGame, useLeavesToShelf } from "@/components/gameExit";
export { useLevelOnScreen } from "@/components/gameLevelAddress";
export { useCountsPlaytime } from "@/components/playtimeUi";

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
  /**
   * Still being built: the card says „in Bearbeitung“ and starts only where it may be tested (`canTestUnfinished`: the
   * dev server or this computer); on the real site it stands greyed out and does nothing – unless held for
   * `UNLOCK_HOLD_MS`, a way only the grown-up who makes the app knows, which starts it with no sign (`unlockUnfinished`).
   */
  unfinished?: true;
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
  /**
   * The code the level `id` (none: the one picked) needs, in a game that loads each level by its own `import()`
   * (`lazyPart`): fetched as the finger lands on its card and waited for a moment (`codeSoon`) before the page turns,
   * so the level is drawn before the motion, not in its middle. Still missing then, the page turns to the loading paper.
   */
  prepare?: (id?: string) => Promise<unknown>;
  /**
   * The game's `vorschau/` folder (`import previews from "./vorschau/*.webp?glob"`): `<mode id>.webp` is a framed cut of
   * the game as that card plays it, shown on the card in place of its emoji (user request, November 2026). `bun run
   * previews` makes them; a still picture costs a phone nothing, where the game's own svg in every card would.
   */
  previews?: Record<string, string>;
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
  prepare,
  previews,
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
  // Opened from another page that is to come back (the trophy room's play sign, `BackVisit`): ✕ goes back there.
  const backTo = returnTo ? undefined : backFrom(location.state);
  // Neither a routine's step nor a tool counts as play, nor stops when play time is over.
  const free = !!returnTo || !!tool;
  // A game still being built and on no shelf is opened from the management page only, so its way back leads there.
  const unfinished = isHidden(location.pathname);
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
  const address = useLevelAddress({ modes, startMode, returnTo, pathname: location.pathname });
  const { addressed, levels, home, shownLevel, setOnScreen } = address;
  const [playing, setPlaying] = useState(false);
  // The end of a level is on screen (GameEnd): the corner is then the way back, not a „Menü“ button.
  const [ended, setEnded] = useState(false);
  // A screen inside the game to go back from (`useInnerBack`): the corner then goes there instead of leaving.
  const { innerBack, inner, setInnerBack, goInner, goInnerRef } = useInnerBackState();
  // The settings panel below the top row: folded away by default, so the start screen stays short.
  const [settingsOpen, setSettingsOpen] = useState(false);
  const playtime = usePlaytime(playing && !free);
  // How often the day's play time runs out in a game, for the grown-ups who make the app (src/lib/analytics.ts).
  useEffect(() => {
    if (playtime.goodNight) track("gute-nacht", { spiel: location.pathname });
  }, [playtime.goodNight, location.pathname]);
  const groups = modes?.some((m) => m.kind) ? byKind(modes) : undefined;
  const grid = useFitGrid(
    modes?.length ?? 0,
    groups?.map((g) => g.modes.length),
    // Cards that are a picture come about as wide as a screen, the shape of the picture; cards with a preview picture
    // above their name get the biggest pictures.
    modes?.some((m) => m.art) ? ART_ASPECT : modes?.some((m) => previews?.[`${m.id}.webp`]) ? PICTURE_CARDS : undefined,
  );
  // The background song runs on from the menus into the game (BackgroundMusic), until the play time is over.
  useNoBackgroundMusic(playing && playtime.goodNight);
  // Taps a little next to something the child can tap still count for it (see tapTargets.ts).
  const playArea = useRef<HTMLDivElement>(null);
  useEffect(() => (playing && playArea.current ? forwardNearTaps(playArea.current) : undefined), [playing]);

  const starting = useRef(false);
  /**
   * Starts playing; `turn` turns the page into the game (not when the page opens playing). A card's level `id` gets its
   * own address, a new step in the history, so the phone's back button comes back to the cards.
   */
  const start = async (turn = false, id?: string) => {
    // A second tap while the first still waits for its level's code starts nothing again.
    if (starting.current) return;
    // The menus are locked then (PlaytimeLock); this also stops a key that slips past it. A routine's step is no game.
    if (!free) {
      if (isPlaytimeOver()) return;
      countGame();
    }
    // These need the click as a user gesture, so run them before any await.
    unlockAudio();
    unlockSpeech();
    const play = () => {
      setPlaying(true);
      if (!id || !levels) return;
      shownLevel.current = id;
      navigate(levelHref(home, id));
    };
    if (turn && prepare) {
      // Fullscreen needs the tap as its gesture, so it is asked for before the wait.
      const kid = enterKidMode();
      starting.current = true;
      await codeSoon(prepare(id));
      starting.current = false;
      turnPageWith("forward", play);
      await kid;
      return;
    }
    if (turn) turnPageWith("forward", play);
    else play();
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
      else if (backTo) goBack(navigate, backTo);
      else if (menu) goBack(navigate, menu);
      else if (levels && addressed) {
        shownLevel.current = undefined;
        goBack(navigate, home);
      }
    };
    // The page turns back from the game to its menu: as many pages as lie between them, or the book
    // closes and goes back on the shelf.
    if (!returnTo && !backTo && menu === "/") putBookBack(location.pathname, leave);
    else turnPageWith("back", leave, !returnTo && !backTo && menu ? pagesBetween(location.pathname, menu) : 1);
  };
  const stopRef = useRef(stop);
  stopRef.current = stop;

  // A greyed-out card „in Bearbeitung“ held for three seconds starts anyway, for this visit (unlockUnfinished): with no
  // ring, glow or sound while it is held, since only the grown-up who makes the app is to know it.
  const heldMode = useRef<string | undefined>(undefined);
  const unlockHold = useHold(() => {
    const id = heldMode.current;
    if (!id) return;
    unlockUnfinished();
    onMode?.(id);
    void start(true, id);
  }, UNLOCK_HOLD_MS);

  usePlayGuards(playing, () => {
    if (innerBack.current) goInnerRef.current();
    else stopRef.current();
  });

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

  useLevelSync({ ...address, navigate, playing, setPlaying, mode, onMode, free, start, backTo });

  if (playing) {
    // Leaving closes the book and puts it back on the shelf (see `stop`).
    const toShelf = !returnTo && !backTo && menu === "/";
    return (
      // Resuming audio on any tap helps after a reload, when no "Los" click unlocked it.
      <div ref={playArea} className="play-area" onPointerDownCapture={unlockAudio}>
        {playtime.goodNight ? (
          <GoodNight />
        ) : (
          <LeaveGame value={stop}>
            <LeavesToShelf value={toShelf}>
              <EndShown value={setEnded}>
                <InnerBack value={setInnerBack}>
                  <LevelOnScreen value={setOnScreen}>
                    <CountsPlaytime value={!free}>{children}</CountsPlaytime>
                  </LevelOnScreen>
                </InnerBack>
              </EndShown>
            </LeavesToShelf>
          </LeaveGame>
        )}
        {!free && !playtime.goodNight && playtime.dusk > 0 && <Dusk level={playtime.dusk} />}
        {/* The edge of the book's page round the picture (`book.css`). */}
        <div className="book-frame" aria-hidden />
        {/* What the page is, unseen: Google reads the page after the app ran, and a game that plays at once replaced the
            built page's text with a picture and left Google a page without words (pages „gecrawlt – zurzeit nicht indexiert“, November 2026).
            Their title is the page's main heading here (`main`): while playing no menu's title stands above them. */}
        <div hidden>
          <SeoWords main />
        </div>
        <GameExit inner={inner} ended={ended} goodNight={playtime.goodNight} toShelf={toShelf} onInner={goInner} onLeave={stop} />
      </div>
    );
  }

  // Nothing to show before the game starts at once, or after it was left.
  if (menu) return null;

  /** „in Bearbeitung“ on a card still being built (`GameMode.unfinished`). */
  const unfinishedBadge = <span className="badge">{t(UNFINISHED_LABEL)}</span>;

  /** One mode's card; one still being built stands greyed out where it can't be tested. */
  const card = (m: GameMode) =>
    m.unfinished && !canPlayUnfinished() ? (
      <li key={m.id}>
        <div
          className={`game-card mode-card disabled${pictureCard(previews?.[`${m.id}.webp`])}`}
          role="button"
          aria-disabled
          data-mode={m.id}
          onPointerDown={(e) => {
            heldMode.current = m.id;
            unlockHold.props.onPointerDown(e);
          }}
          onPointerUp={unlockHold.props.onPointerUp}
          onPointerCancel={unlockHold.props.onPointerCancel}
          onContextMenu={unlockHold.props.onContextMenu}
        >
          <CardPicture emoji={m.emoji} picture={previews?.[`${m.id}.webp`]} />
          <span className="game-title">{m.title}</span>
          {unfinishedBadge}
        </div>
      </li>
    ) : (
      <li key={m.id}>
        <button
          type="button"
          className={`game-card mode-card${m.art ? " mode-art-card" : pictureCard(previews?.[`${m.id}.webp`])}`}
          onPointerDown={() => void prepare?.(m.id).catch(() => undefined)}
          onClick={() => pick(m.id)}
          data-mode={m.id}
          aria-label={m.art ? [m.title, m.note].filter(Boolean).join(": ") : undefined}
          title={m.art ? [m.title, m.note].filter(Boolean).join(": ") : undefined}
        >
          {m.art ? (
            <span className="mode-art">{m.art}</span>
          ) : (
            <>
              <CardPicture emoji={m.emoji} picture={previews?.[`${m.id}.webp`]} />
              <span className="game-title">
                {m.title}
                {m.note && <small className="game-note">{m.note}</small>}
              </span>
            </>
          )}
          {m.unfinished
            ? unfinishedBadge
            : m.id === mode &&
              (modes?.length ?? 0) > 1 && (
                <span className="badge">
                  {t({ de: "zuletzt", ru: "в прошлый раз", en: "last time", zh: "上次玩的", hi: "पिछली बार", es: "la última vez", ar: "آخر مرة" })}
                </span>
              )}
        </button>
      </li>
    );

  const pick = (id: string) => {
    onMode?.(id);
    void start(true, id);
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
