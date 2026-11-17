/**
 * Keeps a game's level and its address in step for `GameShell` (`abenteuer/:level?`, `src/lib/levelAddress.ts`): a card
 * picked or a level the game went on to names its level in the address, and an address naming a level (a link, a
 * reload, the browser's forward and back buttons) plays it or goes back to the cards. GameShell starts and stops the
 * game; these hooks only read and follow the address.
 */
import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { NavigateFunction } from "react-router";
import { useParams } from "react-router";
import { exitKidMode } from "@/lib/fullscreen";
import { levelHome, levelHref } from "@/lib/levelAddress";
import { canPlayUnfinished } from "@/lib/localTest";
import { turnPageWith } from "@/lib/look";
import { isPlaytimeOver } from "@/lib/playtime";
import { stopSpeaking } from "@/lib/speech";
import { hush as hushVoice } from "@/lib/voice";

/** Tells GameShell which level is on screen, for its address (`useLevelOnScreen`). */
export const LevelOnScreen = createContext<(id: string | undefined) => void>(() => {});

/**
 * For a game that goes on from level to level by itself, without changing the card picked (`mode`): Kettenreaktion's
 * „Weiter“ plays the next machine, Kleine Abenteuer's the next story. The address then names the level on screen
 * (levelAddress.ts), not the card picked first.
 */
export function useLevelOnScreen(id: string) {
  const set = useContext(LevelOnScreen);
  useEffect(() => set(id), [id, set]);
}

/**
 * The level in the address and what GameShell needs to keep it: `addressed` (the address's level), `levels` (whether
 * this game has levels with addresses), `home` (the game's own address without a level), `playable`, the level last
 * shown (`shownLevel`) and the level a game says is on screen (`onScreen`).
 */
export function useLevelAddress({
  modes,
  startMode,
  returnTo,
  pathname,
}: {
  modes: { id: string; unfinished?: true }[] | undefined;
  startMode: string | undefined;
  returnTo: string | undefined;
  pathname: string;
}) {
  // Each card's level has an address of its own below the game's (`abenteuer/:level?`, levelAddress.ts) – not in a game
  // that plays at once or as a routine's step, which have no cards to come back to.
  const addressed = useParams().level;
  const levels = !!modes?.length && !startMode && !returnTo;
  const home = levelHome(pathname, levels ? addressed : undefined);
  /** Whether a level can be played here: one of the cards, and one still being built only where it may be tested. */
  const playable = (id: string) => !!modes?.some((m) => m.id === id && (!m.unfinished || canPlayUnfinished()));
  /** The level the address was last set to or played from, so a change of address the game made itself isn't handled again. */
  const shownLevel = useRef<string | undefined>(undefined);
  // The level a game says is on screen (`useLevelOnScreen`), where it went on by itself; else the card picked.
  const [onScreen, setOnScreen] = useState<string | undefined>(undefined);
  return { addressed, levels, home, playable, shownLevel, onScreen, setOnScreen };
}

/** What `useLevelAddress` gave, with what GameShell plays and how it starts and stops. */
interface LevelSync extends ReturnType<typeof useLevelAddress> {
  navigate: NavigateFunction;
  playing: boolean;
  setPlaying: Dispatch<SetStateAction<boolean>>;
  /** The card picked last (`GameShellProps.mode`). */
  mode: string | undefined;
  onMode: ((id: string) => void) | undefined;
  /** Neither a routine's step nor a tool: no play time is counted or checked. */
  free: boolean;
  start: () => Promise<void>;
}

/** The two effects that keep the address and the level on screen in step, run after GameShell's own. */
export function useLevelSync({
  addressed,
  levels,
  home,
  playable,
  shownLevel,
  onScreen,
  setOnScreen,
  navigate,
  playing,
  setPlaying,
  mode,
  onMode,
  free,
  start,
}: LevelSync) {
  // The address names another level than the one shown: a link, a reload or the browser's forward button opened it, so
  // it plays at once (an unknown one, or any while play time is over, leads to the cards). No level while playing: the
  // phone's back button went back to the cards, which show again.
  useEffect(() => {
    if (!levels || addressed === shownLevel.current) return;
    shownLevel.current = addressed;
    if (addressed && !playable(addressed)) {
      shownLevel.current = undefined;
      navigate(home, { replace: true });
    } else if (addressed && playing) onMode?.(addressed);
    else if (addressed) {
      if (!free && isPlaytimeOver()) {
        shownLevel.current = undefined;
        navigate(home, { replace: true });
        return;
      }
      onMode?.(addressed);
      void start();
    } else if (playing) {
      stopSpeaking();
      hushVoice();
      exitKidMode();
      turnPageWith("back", () => setPlaying(false));
    }
  }, [addressed]);

  // „Weiter“, or the game itself, went on to another level: the address follows, in place of the one before.
  const current = onScreen ?? mode;
  useEffect(() => {
    if (!playing) setOnScreen(undefined);
    if (!levels || !playing || !current || current === addressed || !playable(current)) return;
    shownLevel.current = current;
    navigate(levelHref(home, current), { replace: true });
  }, [current, playing]);
}
