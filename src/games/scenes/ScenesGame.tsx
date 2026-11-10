import { Suspense, use } from "react";
import { useLocation } from "react-router";
import { GameShell } from "@/components/GameShell";
import { PageLoading } from "@/components/PageLoading";
import { useGameSettings } from "@/lib/common";
import { useAppLanguage } from "@/lib/language";
import { loadScene, sceneTitle } from "./catalog";
import { localizeScene } from "./localize";
import { tripTo } from "./roads";
import { ScenePlay } from "./ScenePlay";
import { carryOverScenesSettings, DEFAULT_SCENES_SETTINGS, SCENES_SETTINGS_KEY, type ScenesSettings } from "./settings";

carryOverScenesSettings();

/**
 * A picture plays as soon as it is opened, in the mode picked on `/bilder/`: it has no start screen of its own,
 * and leaving it (✕, Esc, „Menü“) goes back to the pictures.
 */
export function ScenesGame({ sceneId }: { sceneId: string }) {
  const [settings, update] = useGameSettings(SCENES_SETTINGS_KEY, DEFAULT_SCENES_SETTINGS);
  const language = useAppLanguage();
  return (
    <GameShell title={sceneTitle(sceneId, language.id)} startMode={settings.mode} leaveTo="/bilder/">
      {/* The picture's own chunk loads inside the game, so following a vehicle into a picture not loaded yet keeps the
          game open (fullscreen, play time) and shows paper with paws for that moment. */}
      <Suspense fallback={<PageLoading />}>
        <LoadedScene sceneId={sceneId} settings={settings} onKeys={(keys) => update({ keys })} />
      </Suspense>
    </GameShell>
  );
}

/** Plays picture `sceneId` once its chunk (and that of a vehicle visiting from another picture) is loaded. */
function LoadedScene({ sceneId, settings, onKeys }: { sceneId: string; settings: ScenesSettings; onKeys: (keys: boolean) => void }) {
  const language = useAppLanguage();
  const location = useLocation();
  const found = use(loadScene(sceneId));
  // A vehicle visiting from another picture is that picture's drawing (guestFor), so its picture loads too.
  const trip = settings.mode === "explore" ? tripTo(sceneId, location.state) : null;
  if (trip && !trip.home) use(loadScene(trip.road.from));
  const scene = localizeScene(found, language.id);
  // A new picture (a vehicle was followed into it) starts afresh.
  return <ScenePlay key={scene.id} scene={scene} settings={settings} onKeys={onKeys} />;
}
