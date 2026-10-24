import { GameShell } from "@/components/GameShell";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { ElevatorPlay } from "./ElevatorPlay";
import { DEFAULT_ELEVATOR_SETTINGS, ELEVATOR_SETTINGS_KEY } from "./settings";
import "./elevator.css";

export function ElevatorGame() {
  const [settings, update] = useGameSettings(ELEVATOR_SETTINGS_KEY, DEFAULT_ELEVATOR_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title="Aufzug"
      emoji="🛗"
      modes={[
        { id: "hunger", emoji: "🥞", title: "Pfannkuchen", text: "Hunger! Eier holen, backen, den Bruder rufen und zusammen essen." },
        { id: "gutenacht", emoji: "🌙", title: "Gute Nacht", text: "Baden, Milch, Zähne putzen, den Teddy holen und ab ins Bett." },
        { id: "pfuetzen", emoji: "🌧️", title: "Pfützen", text: "Stiefel, Regenjacke, Schirm und Boot – dann ab in die Pfützen." },
      ]}
      mode={settings.story}
      onMode={(story) => update({ story })}
      settings={
        device.touchOnly ? undefined : (
          <p className="setting-note">
            Jede Geschichte dauert etwa 2 Minuten. Mit der Tastatur: 1–4 holen den Aufzug, Pfeil hoch und runter fahren einen Stock weiter;
            am Ende wählen 1–3 die nächste Geschichte.
          </p>
        )
      }
    >
      <ElevatorPlay lang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
