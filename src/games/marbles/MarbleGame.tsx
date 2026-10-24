import { GameShell } from "@/components/GameShell";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { MarblePlay } from "./MarblePlay";
import { DEFAULT_MARBLE_SETTINGS, MARBLE_SETTINGS_KEY, type MarbleLevels } from "./settings";

const MODES = [
  { id: "all", emoji: "🌈", title: "Alle nacheinander", featured: true },
  { id: "machine", emoji: "⚙️", title: "Große Maschine" },
  { id: "kitchen", emoji: "🍳", title: "Verrückte Küche" },
  { id: "garden", emoji: "🌻", title: "Im Garten" },
  { id: "topple", emoji: "📚", title: "Alles fällt um" },
  { id: "building", emoji: "🚧", title: "Baustelle" },
  { id: "circus", emoji: "🎪", title: "Zirkus" },
  { id: "space", emoji: "🚀", title: "Raketenstart" },
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
      settings={
        <p className="setting-note">Ein Tipp, und dann stößt eins das nächste an: Jedes Level läuft von selbst bis zum Ende, und das Bild fährt mit.</p>
      }
    >
      <MarblePlay speechLang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
