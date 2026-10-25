import { GameShell } from "@/components/GameShell";
import { SettingsGroup, Toggle } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { MarblePlay } from "./MarblePlay";
import { DEFAULT_MARBLE_SETTINGS, MARBLE_SETTINGS_KEY, type MarbleLevels } from "./settings";

const MODES = [
  { id: "all", emoji: "🌈", title: "Alle nacheinander", featured: true },
  { id: "track", emoji: "🎢", title: "Klingende Kugelbahn" },
  { id: "machine", emoji: "⚙️", title: "Große Maschine" },
  { id: "sneeze", emoji: "🤧", title: "Hatschi-Kette" },
  { id: "kitchen", emoji: "🍳", title: "Verrückte Küche" },
  { id: "garden", emoji: "🌻", title: "Im Garten" },
  { id: "pegs", emoji: "📍", title: "Nagelbrett" },
  { id: "topple", emoji: "📚", title: "Alles fällt um" },
  { id: "building", emoji: "🚧", title: "Baustelle" },
  { id: "water", emoji: "🦆", title: "Wasserbahn" },
  { id: "circus", emoji: "🎪", title: "Zirkus" },
  { id: "space", emoji: "🚀", title: "Raketenstart" },
  { id: "light", emoji: "🔦", title: "Licht-Kette" },
];

export function MarbleGame() {
  const [settings, update] = useGameSettings(MARBLE_SETTINGS_KEY, DEFAULT_MARBLE_SETTINGS);
  // Older saves may hold a choice that is gone ("both", "machines"): those play all.
  const mode = MODES.some((m) => m.id === settings.levels) ? settings.levels : "all";

  return (
    <GameShell
      title="Kettenreaktion"
      emoji="🎳"
      modes={MODES}
      mode={mode}
      onMode={(levels) => update({ levels: levels as MarbleLevels })}
      info={
        <p>
          Ein Tipp, und dann stößt eins das nächste an: Jedes Level läuft bis zum Ende, und das Bild fährt mit. Auf der Klingenden Kugelbahn rollen die Kugeln
          über Xylophon, Wippe, Looping, Trommeln und Klangröhren bis in den Korb.
        </p>
      }
      settings={
        <>
          <SettingsGroup title="Kugelbahn: Was rollt denn da?">
            <Toggle label="Oben liegen drei Dinge zur Wahl, ein Tipp lässt genau dieses los" checked={settings.pick} onChange={(pick) => update({ pick })} />
            <p className="setting-note">
              Murmel, Tennisball, Eisenkugel, Apfel und Seifenblase rollen jedes anders; am Computer lassen die Tasten 1, 2 und 3 sie los. Ausgeschaltet öffnet
              ein Tipp den Trichter, und sechs Kugeln rollen von selbst.
            </p>
          </SettingsGroup>
          <SettingsGroup title="Kugelbahn: Umbauen">
            <Toggle label="Tippen auf einen der sechs Plätze mit 🔧 wechselt das Teil" checked={settings.rebuild} onChange={(rebuild) => update({ rebuild })} />
            <p className="setting-note">
              Glocke, Trampolin, Trichter und Wasserrad gehen reihum; die nächste Kugel nimmt den neuen Weg. Am Computer baut die Leertaste die Bahn Schritt für
              Schritt um. Ausgeschaltet bleibt die Bahn wie immer.
            </p>
          </SettingsGroup>
        </>
      }
    >
      <MarblePlay speechLang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
