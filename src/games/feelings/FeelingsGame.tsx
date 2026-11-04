import { GameShell, type GameMode } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { FeelingsPlay } from "./FeelingsPlay";
import { groupById, playableGroups } from "./groups";
import { ALLTAG_TITLE } from "./names";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY } from "./settings";
import "./feelings.css";

/**
 * „Alltagssituationen“: one card per feeling (`GROUPS`). The group played last comes first, and goes on with the
 * scene where the child stopped; the others follow in their fixed order.
 */
export function FeelingsGame() {
  const [settings, update] = useGameSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);
  const t = useT();
  const last = groupById(settings.group);
  const groups = playableGroups();

  const modes: GameMode[] = [last, ...groups.filter((g) => g !== last)].map(({ id, emoji, title }) => ({ id, emoji, title: t(title) }));

  return (
    <GameShell
      title={t(ALLTAG_TITLE)}
      modes={modes}
      mode={last.id}
      // Another group starts with its first scene; the one played last goes on where it stopped.
      onMode={(group) => update({ group, scene: group === settings.group ? settings.scene : 0 })}
    >
      <FeelingsPlay settings={settings} update={update} />
    </GameShell>
  );
}
