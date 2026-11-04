import { useMemo, useState } from "react";
import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { groupById } from "./groups";
import { MoodPlay } from "./MoodPlay";
import { MOOD_TITLE } from "./names";
import { PassPlay } from "./PassPlay";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY } from "./settings";
import "./feelings.css";

/**
 * „Wie geht's dir?“: the child picks the weather that fits how it feels, then the scenes of that feeling play, one
 * choice each. Nothing to choose before, so it plays at once; „Nochmal“ asks for the weather again.
 */
export function MoodGame() {
  const [stored, update] = useGameSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);
  // The voice switch is „Alltagssituationen“'s alone: here everything is always said.
  const settings = useMemo(() => ({ ...stored, voice: true }), [stored]);
  const t = useT();

  return (
    <GameShell title={t(MOOD_TITLE)} startMode="play">
      <MoodRounds settings={settings} update={update} />
    </GameShell>
  );
}

function MoodRounds({ settings, update }: Pick<Parameters<typeof PassPlay>[0], "settings" | "update">) {
  const [now, setNow] = useState<{ group?: string; key: number }>({ key: 0 });
  if (!now.group) return <MoodPlay key={now.key} settings={settings} onPick={(group) => setNow({ group, key: now.key + 1 })} />;
  // Its scenes go on with their next choices, but „Alltagssituationen“ keeps its own place to go on from.
  return (
    <PassPlay key={now.key} group={groupById(now.group)} settings={settings} update={update} remember={false} onAgain={() => setNow({ key: now.key + 1 })} />
  );
}
