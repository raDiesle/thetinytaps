import { GameShell } from "@/components/GameShell";
import { Choice } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { SocksPlay } from "./SocksPlay";
import { DEFAULT_SOCKS_SETTINGS, SOCKS_SETTINGS_KEY, type SockMode, type StartPairs } from "./settings";
import "./socks.css";

export function SocksGame() {
  const [settings, update] = useGameSettings(SOCKS_SETTINGS_KEY, DEFAULT_SOCKS_SETTINGS);
  const device = useDevice();

  return (
    <GameShell
      title="Socken-Paare"
      emoji="🧦"
      modes={[
        { id: "colors", emoji: "🌈", title: "Farben" },
        { id: "patterns", emoji: "⭐", title: "Muster" },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as SockMode })}
      level={
        <Choice<StartPairs>
          label="Am Anfang"
          value={settings.pairs}
          onChange={(pairs) => update({ pairs })}
          options={[
            { value: "2", label: "2 Paare" },
            { value: "3", label: "3 Paare" },
            { value: "4", label: "4 Paare" },
          ]}
        />
      }
      info={
        <>
          <p>
            Die Waschmaschine ist voll. Ein Tipp startet sie, dann purzeln die Socken auf den Boden. Eine Socke antippen hebt sie hoch und lässt ihren Ton
            klingen; ihre Partnerin dazu, und beide hüpfen an die Wäscheleine. Eine andere Socke ist nie falsch: Die erste geht einfach zurück.
          </p>
          <p>„Farben“: jedes Paar hat seine Farbe. „Muster“: jedes Paar hat sein Muster in nur drei Farben. „Weiter“ bringt ein Paar mehr.</p>
          {!device.touchOnly && (
            <p>Mit der Tastatur: jede Taste startet die Waschmaschine. Dann wählen Pfeiltasten eine Socke, Leertaste oder Enter nimmt sie, 1–9 direkt.</p>
          )}
        </>
      }
    >
      <SocksPlay lang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
