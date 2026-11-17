/**
 * Leaving a game in `GameShell`: the corner's ✕ (tapped, or held where grown-ups chose so), Esc held, the inner way back
 * (`useInnerBack`), the end's ribbon onto the shelf, and the contexts that tell a game where leaving goes. GameShell
 * puts them together and re-exports the hooks games use.
 */
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { FullscreenButton } from "@/components/FullscreenButton";
import { PageCornerArt } from "@/components/PageCornerArt";
import { useCommonSettings } from "@/lib/common";
import { useHold } from "@/lib/hold";
import { useT } from "@/lib/language";
import { turnPageWith } from "@/lib/look";
import { BACK_TO_SHELF } from "@/lib/sharedTexts";

/** How long ✕ has to be held to leave the game, where grown-ups chose holding (`leave`); the ring fills meanwhile. */
const EXIT_DELAY_MS = 500;

/** Esc has to be held, since children press it while typing. */
const ESC_HOLD_MS = 1000;

/** Leaves the game for the menu before it, like ✕. */
export const LeaveGame = createContext<() => void>(() => {});

/** The way back to the menu before the game, for a game that has a way out of its own (the Timer). */
export const useLeaveGame = () => useContext(LeaveGame);

/** Whether leaving the game closes its book and puts it back on the shelf (not back to a menu or a routine). */
export const LeavesToShelf = createContext(false);

/** For `GameEnd`'s „Menü“ button: it shows the shelf only where that is where it leads. */
export const useLeavesToShelf = () => useContext(LeavesToShelf);

/**
 * Tells GameShell whether the end of a level (`GameEnd`) is on screen: then the corner in the top left is the way back,
 * with one tap – the ribbon onto the shelf where the game goes back there. The end shows no „Menü“ button of its own,
 * except in Zähne putzen and Aufs Töpfchen (`GameEnd`'s `menu`).
 */
export const EndShown = createContext<(shown: boolean) => void>(() => {});

/** For `GameEnd`: says it is on screen (true) or gone again (false). */
export const useEndShown = () => useContext(EndShown);

/**
 * A screen inside the game to go back from (a feeling picked in „Wie geht's dir?“, back to all feelings): while a game
 * sets one, the corner in the top left is the way back to the game's screen before, with one tap, and turns the page
 * back – „Back is always the screen seen before“ (root CLAUDE.md, user feedback, November 2026).
 */
export const InnerBack = createContext<(back: (() => void) | undefined) => void>(() => {});

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

/**
 * GameShell's side of `useInnerBack`: the way back a game set (`innerBack`), whether there is one (`inner`), the setter
 * the game's `InnerBack` context gets, and `goInner`, which turns the page back to it (`goInnerRef` for the Esc handler,
 * which outlives the render it was made in).
 */
export function useInnerBackState() {
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
  return { innerBack, inner, setInnerBack, goInner, goInnerRef };
}

/**
 * While playing: Esc held for `ESC_HOLD_MS` calls `onEscHeld` (made in the render where `playing` turned on, so it
 * should read refs), every other key is kept from the browser, and no context menu, leaving the page, pinch zoom or
 * pan gets through.
 */
export function usePlayGuards(playing: boolean, onEscHeld: () => void) {
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
        onEscHeld();
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
    // A whole hand or a touch at the very edge must not scroll, pull down or start a browser gesture (A-13).
    const noPan = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
    };
    window.addEventListener("touchmove", noPan, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("keyup", onKeyUp, { capture: true });
      window.removeEventListener("contextmenu", block);
      window.removeEventListener("beforeunload", block);
      window.removeEventListener("gesturestart", block);
      window.removeEventListener("touchmove", noPan);
    };
  }, [playing]);
}

/**
 * The corner in the top left while playing: back to the game's screen before (`inner`), the way back at a level's end
 * (`ended`), else the ✕ that leaves the game.
 */
export function GameExit({
  inner,
  ended,
  goodNight,
  toShelf,
  onInner,
  onLeave,
}: {
  inner: boolean;
  ended: boolean;
  goodNight: boolean;
  /** Leaving closes the book and puts it back on the shelf (GameShell's `stop`). */
  toShelf: boolean;
  onInner: () => void;
  onLeave: () => void;
}) {
  const t = useT();
  const backToMenu = t({
    de: "Zurück zum Menü",
    ru: "Назад в меню",
    en: "Back to menu",
    zh: "返回菜单",
    hi: "मेन्यू पर वापस",
    es: "Volver al menú",
    ar: "العودة إلى القائمة",
  });
  return inner && !ended && !goodNight ? (
    // Back to the game's screen before (`useInnerBack`): one tap, held or not, since nothing is left.
    <TapExit onExit={onInner} sign="back" label={t({ de: "Zurück", ru: "Назад", en: "Back", zh: "返回", hi: "वापस", es: "Atrás", ar: "رجوع" })} />
  ) : ended && !goodNight ? (
    // At the end of a level the corner is the way back, as in a menu: one tap, held or not (the „Menü“ button it
    // replaces was a tap too), and onto the shelf it is the book's ribbon, since the book closes and goes back.
    <TapExit onExit={onLeave} sign={toShelf ? "shelf" : "close"} label={toShelf ? t(BACK_TO_SHELF) : backToMenu} />
  ) : (
    <ExitButton onExit={onLeave} label={backToMenu} />
  );
}

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
