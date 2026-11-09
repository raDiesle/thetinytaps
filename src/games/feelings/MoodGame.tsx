import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { GameShell, type GameMode } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { routineReturn } from "@/lib/routine";
import { MoodPlay } from "./MoodPlay";
import { MOOD_BLURB, MOOD_TITLE } from "./names";
import { NeedsPlay } from "./NeedsPlay";
import { NEEDS_BLURB, NEEDS_TITLE } from "./needs";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY } from "./settings";
import "./feelings.css";

/** The two games under „Wie geht's dir?“: the feeling (the first card) and what the child needs (the second). */
const FEELING = "gefuehl";
const NEED = "brauche";

/**
 * „Wie geht's dir?“ with „Was brauche ich?“ under it (user wish, November 2026): the start screen is a small sub-menu of
 * two cards, and the one picked plays. Nothing is picked by the game itself, so a grown-up or the child chooses which
 * one comes. The feeling's screen links on to the needs with a turn of the page (`NeedsLink`), and ✕ goes back to the
 * sub-menu. A routine's card (the Tagesplan, `{ returnTo }`) plays the feeling at once, as it always did.
 */
export function MoodGame() {
  const [stored] = useGameSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);
  // The voice switch is „Alltagssituationen“'s alone: here everything is always said.
  const settings = useMemo(() => ({ ...stored, voice: true }), [stored]);
  const t = useT();
  const [choice, setChoice] = useState(FEELING);
  const routed = !!routineReturn(useLocation().state);

  const modes: GameMode[] = [
    { id: FEELING, emoji: "😊", title: t(MOOD_TITLE), note: t(MOOD_BLURB) },
    { id: NEED, emoji: "🤗", title: t(NEEDS_TITLE), note: t(NEEDS_BLURB) },
  ];

  return (
    <GameShell title={t(MOOD_TITLE)} modes={modes} mode={choice} onMode={setChoice} startMode={routed ? FEELING : undefined}>
      {choice === NEED ? <NeedsPlay settings={settings} /> : <MoodPlay settings={settings} onNeeds={() => setChoice(NEED)} />}
    </GameShell>
  );
}
