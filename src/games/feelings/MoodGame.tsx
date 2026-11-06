import { useMemo } from "react";
import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { MoodPlay } from "./MoodPlay";
import { MOOD_TITLE } from "./names";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY } from "./settings";
import "./feelings.css";

/**
 * „Wie geht's dir?“: the child picks the card of the feeling it has, then slides how strong it is. Nothing to choose
 * before, so it plays at once; the corner goes back from a feeling to all of them.
 */
export function MoodGame() {
  const [stored] = useGameSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);
  // The voice switch is „Alltagssituationen“'s alone: here everything is always said.
  const settings = useMemo(() => ({ ...stored, voice: true }), [stored]);
  const t = useT();

  return (
    <GameShell title={t(MOOD_TITLE)} startMode="play">
      <MoodPlay settings={settings} />
    </GameShell>
  );
}
