import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { AnimalsPlay } from "./AnimalsPlay";
import { ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS, type AnimalsMode, type ChoiceCount } from "./settings";
import "./animals.css";

export function AnimalsGame() {
  const [settings, update] = useGameSettings(ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS);

  return (
    <GameShell
      title="Was gehört zum Tier?"
      emoji="🐰"
      modes={[
        { id: "feed", emoji: "🥕", title: "Tiere füttern" },
        { id: "home", emoji: "🏠", title: "Wer wohnt wo?" },
        { id: "mix", emoji: "🔀", title: "Abwechselnd" },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as AnimalsMode })}
      level={
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
      }
      settings={
        <>
          <SettingsGroup title="Anzeige">
            <Toggle label="Namen zeigen (Hase, Möhre …)" checked={settings.names} onChange={(names) => update({ names })} />
          </SettingsGroup>

          <SettingsGroup title="Verhalten">
            <Toggle
              label="Antippen reicht (sonst muss man ziehen)"
              checked={settings.tap}
              onChange={(tap) => update({ tap })}
            />
          </SettingsGroup>
        </>
      }
    >
      <AnimalsPlay lang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
