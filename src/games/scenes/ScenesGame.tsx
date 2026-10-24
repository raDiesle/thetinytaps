import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { useDevice, type Device } from "@/lib/device";
import { findScene } from ".";
import { ScenePlay } from "./ScenePlay";
import {
  carryOverScenesSettings,
  DEFAULT_SCENES_SETTINGS,
  SCENES_SETTINGS_KEY,
  type SceneAnnounce,
  type SceneMode,
  type SceneTrigger,
} from "./settings";

const pack = de;

carryOverScenesSettings();

export function ScenesGame({ sceneId }: { sceneId: string }) {
  const [stored, update] = useGameSettings(SCENES_SETTINGS_KEY, DEFAULT_SCENES_SETTINGS);
  const device = useDevice();
  // Tablets and phones have no keys, and the finger is right on the picture anyway.
  const settings = device.touchOnly && stored.trigger === "keys" ? { ...stored, trigger: "tap" as const } : stored;
  const scene = findScene(sceneId);
  if (!scene) return null;

  return (
    <GameShell
      title={scene.title}
      emoji={scene.emoji}
      backHref="/bilder/"
      backLabel="Alle Bilder"
      modes={[
        { id: "colour", emoji: "🖍️", title: "Ausmalen" },
        { id: "find", emoji: "🔍", title: "Suchen" },
        { id: "questions", emoji: "❓", title: "Fragen" },
        { id: "explore", emoji: "👆", title: "Freies Entdecken" },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as SceneMode })}
      settings={
        <>
          <SettingsGroup title="Spiel">
            <Choice<SceneTrigger>
              label="Auslösen"
              value={settings.trigger}
              onChange={(trigger) => update({ trigger })}
              options={triggerOptions(device)}
            />
            {settings.trigger === "keys" && (
              <Toggle
                label="Tasten im Bild zeigen"
                checked={settings.showKeys}
                onChange={(showKeys) => update({ showKeys })}
              />
            )}
            <Toggle
              label="Entdecken und Ausmalen: Mitzählen – wenn alles entdeckt ist, gibt es eine Party"
              checked={settings.goal}
              onChange={(goal) => update({ goal })}
            />
            <Toggle
              label="Entdecken: Fahrzeuge fahren in andere Bilder – am Rand antippen und mitfahren"
              checked={settings.roads}
              onChange={(roads) => update({ roads })}
            />
            <Toggle
              label="Fragen: Tipp zeigen, wenn es länger dauert"
              checked={settings.hints}
              onChange={(hints) => update({ hints })}
            />
            {settings.speech && (
              <Choice<SceneAnnounce>
                label="Ansage beim Entdecken"
                value={settings.announce}
                onChange={(announce) => update({ announce })}
                options={[
                  { value: "sentence", label: "„Der Bagger baggert!“" },
                  { value: "name", label: "„Der Bagger!“" },
                ]}
              />
            )}
          </SettingsGroup>

          <SettingsGroup title="Bild">
            <Toggle
              label="Bild bewegt sich auch von allein, ohne Ton (Wolken, Rotor, Blinklichter …)"
              checked={settings.ambient}
              onChange={(ambient) => update({ ambient })}
            />
          </SettingsGroup>
        </>
      }
    >
      {/* A new picture (a vehicle was followed into it) starts afresh. */}
      <ScenePlay key={scene.id} scene={scene} settings={settings} speechLang={pack.speechLang} />
    </GameShell>
  );
}

/** The ways to bring the picture to life, worded for this device; the keys only where there is a keyboard. */
function triggerOptions(device: Device): { value: SceneTrigger; label: string }[] {
  if (device.touchOnly) {
    return [
      { value: "tap", label: "👆 Antippen" },
      { value: "hover", label: "👆 Wischen (Finger übers Bild ziehen)" },
    ];
  }
  // With a mouse, keys are often easier for the youngest than aiming and clicking.
  const keys = { value: "keys" as const, label: "⌨️ Jedes Ding hat eine Taste, oder Pfeile + Leertaste" };
  if (!device.hasTouch) {
    return [{ value: "tap", label: "🖱️ Klicken" }, { value: "hover", label: "🖱️ Mit der Maus darüberfahren" }, keys];
  }
  return [{ value: "tap", label: "👆 Antippen / Klicken" }, { value: "hover", label: "🖱️ Darüberfahren / Wischen" }, keys];
}
