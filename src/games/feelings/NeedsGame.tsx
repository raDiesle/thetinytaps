import { useMemo } from "react";
import { useLocation } from "react-router";
import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { NEEDS_TITLE, needsCameFrom } from "./needs";
import { NeedsPlay } from "./NeedsPlay";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY } from "./settings";
import "./feelings.css";

/**
 * „Was brauche ich?“: the child picks what it needs or wants to do now, and its card stays marked. Plays at once. Opened from a
 * feeling of „Wie geht's dir?“, its way back leads there again, the screen seen before.
 */
export function NeedsGame() {
  const [stored] = useGameSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);
  const settings = useMemo(() => ({ ...stored, voice: true }), [stored]);
  const t = useT();
  const leaveTo = needsCameFrom(useLocation().state);
  return (
    <GameShell title={t(NEEDS_TITLE)} startMode="play" leaveTo={leaveTo}>
      <NeedsPlay settings={settings} />
    </GameShell>
  );
}
