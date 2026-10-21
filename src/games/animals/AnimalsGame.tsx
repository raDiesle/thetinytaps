import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { de } from "@/content/de";
import { useStoredSettings } from "@/lib/storage";
import { AnimalsPlay } from "./AnimalsPlay";
import { ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS, type AnimalsMode, type ChoiceCount } from "./settings";
import "./animals.css";

export function AnimalsGame() {
  const [settings, update] = useStoredSettings(ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS);

  return (
    <GameShell
      title="Was gehört zum Tier?"
      emoji="🐰"
      settings={
        <>
          <SettingsGroup title="Spielart">
            <Choice<AnimalsMode>
              label="Spiel"
              value={settings.mode}
              onChange={(mode) => update({ mode })}
              options={[
                { value: "feed", label: "🥕 Tiere füttern" },
                { value: "home", label: "🏠 Wer wohnt wo?" },
                { value: "mix", label: "🔀 Abwechselnd" },
              ]}
            />
            <Choice<ChoiceCount>
              label="Zur Auswahl"
              value={settings.choices}
              onChange={(choices) => update({ choices })}
              options={[
                { value: "2", label: "2 Dinge" },
                { value: "3", label: "3 Dinge" },
                { value: "4", label: "4 Dinge" },
              ]}
            />
          </SettingsGroup>

          <SettingsGroup title="Anzeige">
            <Toggle label="Namen zeigen (Hase, Möhre …)" checked={settings.names} onChange={(names) => update({ names })} />
          </SettingsGroup>

          <SettingsGroup title="Ton">
            <Toggle label="Vorlesen" checked={settings.speech} onChange={(speech) => update({ speech })} />
            {settings.speech && <VoiceSetting lang={de.speechLang} sample="Der Hase hat Hunger!" />}
            <Toggle label="Töne" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
          </SettingsGroup>

          <SettingsGroup title="Verhalten">
            <Toggle
              label="Antippen reicht (sonst muss man ziehen)"
              checked={settings.tap}
              onChange={(tap) => update({ tap })}
            />
            <Toggle
              label="Ruhiger Modus (leiser, weniger Bewegung)"
              checked={settings.calm}
              onChange={(calm) => update({ calm })}
            />
          </SettingsGroup>
        </>
      }
    >
      <AnimalsPlay lang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
