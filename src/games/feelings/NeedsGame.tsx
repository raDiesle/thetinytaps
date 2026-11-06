import { useMemo } from "react";
import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { NEEDS_TITLE } from "./needs";
import { NeedsPlay } from "./NeedsPlay";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY } from "./settings";
import "./feelings.css";

/** „Was brauche ich?“: the child picks what it needs or wants to do now, and it shows big. Plays at once. */
export function NeedsGame() {
  const [stored] = useGameSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);
  const settings = useMemo(() => ({ ...stored, voice: true }), [stored]);
  const t = useT();
  return (
    <GameShell title={t(NEEDS_TITLE)} startMode="play">
      <NeedsPlay settings={settings} />
    </GameShell>
  );
}
