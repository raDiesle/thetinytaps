import { useMemo } from "react";
import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { CopyPlay } from "./CopyPlay";
import { COPY_TITLE } from "./copy";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY } from "./settings";
import "./feelings.css";

/** „Gefühle nachmachen“: the little bear's faces, one tapped to show it big and copy it. Plays at once. */
export function CopyGame() {
  const [stored] = useGameSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);
  const settings = useMemo(() => ({ ...stored, voice: true }), [stored]);
  const t = useT();
  return (
    <GameShell title={t(COPY_TITLE)} startMode="play">
      <CopyPlay settings={settings} />
    </GameShell>
  );
}
