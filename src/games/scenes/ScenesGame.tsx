"use client";

import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { de } from "@/content/de";
import { useStoredSettings } from "@/lib/storage";
import { findScene } from ".";
import { ScenePlay } from "./ScenePlay";
import { DEFAULT_SCENES_SETTINGS, SCENES_SETTINGS_KEY, type SceneAnnounce, type SceneMode, type SceneTrigger } from "./settings";

const pack = de;

export function ScenesGame({ sceneId }: { sceneId: string }) {
  const [settings, update] = useStoredSettings(SCENES_SETTINGS_KEY, DEFAULT_SCENES_SETTINGS);
  const scene = findScene(sceneId);
  if (!scene) return null;

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
              ]}
            />
            <Choice<SceneTrigger>
              label="Auslösen"
              value={settings.trigger}
              onChange={(trigger) => update({ trigger })}
              options={[
                { value: "tap", label: "👆 Antippen / Klicken" },
                { value: "hover", label: "🖱️ Darüberfahren / Wischen" },
                { value: "keys", label: "⌨️ Jedes Ding hat eine Taste" },
              ]}
            />
            {settings.trigger === "keys" && (
              <Toggle
                label="Tasten im Bild zeigen"
                checked={settings.showKeys}
                onChange={(showKeys) => update({ showKeys })}
              />
            )}
            {settings.mode === "find" && (
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
            {settings.speech && settings.mode === "explore" && (
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
            <Toggle label="Geräusche" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
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
