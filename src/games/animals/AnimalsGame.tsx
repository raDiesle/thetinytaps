import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { PeekPlay } from "@/games/shadows/PeekPlay";
import "@/games/shadows/shadows.css";
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
        { id: "peek", emoji: "🙈", title: "Wer schaut da raus?" },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as AnimalsMode })}
      level={
        <>
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
          <Toggle label="Abwechselnd füttern und Zuhause finden" checked={settings.mix} onChange={(mix) => update({ mix })} />
        </>
      }
      info={
        <>
          <p>Tiere füttern: Ein Tier hat Hunger, und das Kind zieht das passende Futter zu ihm – die Möhre zum Hasen, den Knochen zum Hund.</p>
          <p>Wer wohnt wo? Das Kind bringt das Tier in sein Zuhause: den Vogel ins Nest, die Kuh in den Stall.</p>
          <p>
            Wer schaut da raus? Nur ein Stück von einem Tier schaut aus dem Busch oder dem Teich. Das Kind tippt unten auf das ganze Tier, und es kommt heraus.
          </p>
        </>
      }
      settings={
        <>
          <SettingsGroup title="Anzeige">
            <Toggle label="Namen zeigen (Hase, Möhre …)" checked={settings.names} onChange={(names) => update({ names })} />
          </SettingsGroup>

          <SettingsGroup title="Verhalten">
            <Toggle
              label="Antippen reicht (sonst muss man ziehen; bei „Wer schaut da raus?“ wird immer getippt)"
              checked={settings.tap}
              onChange={(tap) => update({ tap })}
            />
          </SettingsGroup>
        </>
      }
    >
      {settings.mode === "peek" ? <PeekPlay lang={de.speechLang} settings={settings} /> : <AnimalsPlay lang={de.speechLang} settings={settings} />}
    </GameShell>
  );
}
