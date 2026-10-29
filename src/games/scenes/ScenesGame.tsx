import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useAppLanguage } from "@/lib/language";
import { findScene } from ".";
import { localizeScene } from "./localize";
import { ScenePlay } from "./ScenePlay";
import { carryOverScenesSettings, DEFAULT_SCENES_SETTINGS, SCENES_SETTINGS_KEY } from "./settings";

carryOverScenesSettings();

/**
 * A picture plays as soon as it is opened, in the mode picked on `/bilder/`: it has no start screen of its own,
 * and leaving it (✕, Esc, „Menü“) goes back to the pictures.
 */
export function ScenesGame({ sceneId }: { sceneId: string }) {
  const [settings, update] = useGameSettings(SCENES_SETTINGS_KEY, DEFAULT_SCENES_SETTINGS);
  const language = useAppLanguage();
  const found = findScene(sceneId);
  if (!found) return null;
  const scene = localizeScene(found, language.id);

  return (
    <GameShell title={scene.title} emoji={scene.emoji} startMode={settings.mode} leaveTo="/bilder/">
      {/* A new picture (a vehicle was followed into it) starts afresh. */}
      <ScenePlay key={scene.id} scene={scene} settings={settings} onKeys={(keys) => update({ keys })} />
    </GameShell>
  );
}
