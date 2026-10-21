import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { de } from "@/content/de";
import { useDevice, type Device } from "@/lib/device";
import { useStoredSettings } from "@/lib/storage";
import { findScene } from ".";
import { ScenePlay } from "./ScenePlay";
import {
  DEFAULT_SCENES_SETTINGS,
  isQuestMode,
  SCENES_SETTINGS_KEY,
  type SceneAnnounce,
  type SceneMode,
  type SceneTrigger,
} from "./settings";

const pack = de;

export function ScenesGame({ sceneId }: { sceneId: string }) {
  const [stored, update] = useStoredSettings(SCENES_SETTINGS_KEY, DEFAULT_SCENES_SETTINGS);
  const device = useDevice();
  // Tablets and phones have no keys, and the finger is right on the picture anyway.
  const settings = device.touchOnly && stored.trigger === "keys" ? { ...stored, trigger: "tap" as const } : stored;
  const scene = findScene(sceneId);
  if (!scene) return null;
  const questMode = isQuestMode(settings.mode);

  return (
    <GameShell
      title={scene.title}
      emoji={scene.emoji}
      backHref="/bilder/"
      backLabel="Alle Bilder"
      settings={
        <>
          <SettingsGroup title="Spielart">
            <Choice<SceneMode>
              label="Spiel"
              value={settings.mode}
              onChange={(mode) => update({ mode })}
              options={[
                { value: "explore", label: "👆 Entdecken" },
                { value: "find", label: "🔍 Suchen" },
                { value: "sounds", label: "🔊 Geräusch-Rätsel" },
                { value: "questions", label: "❓ Fragen („Was ist rot?“)" },
                { value: "colour", label: "🖍️ Ausmalen" },
              ]}
            />
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
            {!questMode && (
              <Toggle
                label="Mitzählen – wenn alles entdeckt ist, gibt es eine Party"
                checked={settings.goal}
                onChange={(goal) => update({ goal })}
              />
            )}
            {questMode && (
              <Toggle
                label="Tipp zeigen, wenn es länger dauert"
                checked={settings.hints}
                onChange={(hints) => update({ hints })}
              />
            )}
          </SettingsGroup>

          <SettingsGroup title="Ton">
            <Toggle label="Vorlesen" checked={settings.speech} onChange={(speech) => update({ speech })} />
            {settings.speech && <VoiceSetting lang={pack.speechLang} sample="Der Bagger baggert!" />}
            {settings.speech && !questMode && (
              <Choice<SceneAnnounce>
                label="Ansage"
                value={settings.announce}
                onChange={(announce) => update({ announce })}
                options={[
                  { value: "sentence", label: "„Der Bagger baggert!“" },
                  { value: "name", label: "„Der Bagger!“" },
                ]}
              />
            )}
            {/* The sound riddle needs its sounds, so they can't be switched off there. */}
            {settings.mode !== "sounds" && (
              <Toggle label="Geräusche" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
            )}
          </SettingsGroup>

          <SettingsGroup title="Verhalten">
            <Toggle
              label="Ruhiger Modus (leiser, weniger Bewegung)"
              checked={settings.calm}
              onChange={(calm) => update({ calm })}
            />
            {!settings.calm && (
              <Toggle
                label="Bild bewegt sich auch von allein (Wolken, Rotor, Blinklichter …)"
                checked={settings.ambient}
                onChange={(ambient) => update({ ambient })}
              />
            )}
          </SettingsGroup>
        </>
      }
    >
      <ScenePlay scene={scene} settings={settings} speechLang={pack.speechLang} />
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
