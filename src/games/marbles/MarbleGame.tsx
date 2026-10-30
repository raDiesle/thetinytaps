import { GameShell } from "@/components/GameShell";
import { Choice } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { GAME_TITLE, LEVEL_TEXTS } from "./content";
import { MarblePlay } from "./MarblePlay";
import { DEFAULT_MARBLE_SETTINGS, MARBLE_SETTINGS_KEY, type MarbleLevel, type MarbleSettings } from "./settings";

/** The mode cards in menu order, one per level; „Weiter“ at a level's end goes on with the next. */
const MODES: { id: MarbleLevel; emoji: string }[] = [
  { id: "track", emoji: "🎢" },
  { id: "machine", emoji: "⚙️" },
  { id: "sneeze", emoji: "🤧" },
  { id: "kitchen", emoji: "🍳" },
  { id: "garden", emoji: "🌻" },
  { id: "pegs", emoji: "📍" },
  { id: "topple", emoji: "📚" },
  { id: "building", emoji: "🚧" },
  { id: "water", emoji: "🦆" },
  { id: "circus", emoji: "🎪" },
  { id: "space", emoji: "🚀" },
  { id: "light", emoji: "🔦" },
  { id: "bath", emoji: "🛁" },
  { id: "farm", emoji: "🐓" },
  { id: "night", emoji: "🌙" },
  { id: "tidy", emoji: "🧸" },
];

export function MarbleGame() {
  const t = useT();
  const [settings, update] = useGameSettings(MARBLE_SETTINGS_KEY, DEFAULT_MARBLE_SETTINGS);
  // Older saves may hold a choice that is gone ("all", "both", "machines"): those begin with the first level.
  const mode = MODES.some((m) => m.id === settings.levels) ? settings.levels : MODES[0].id;
  const modes = MODES.map((m) => ({ ...m, title: t(LEVEL_TEXTS[m.id].name) }));

  return (
    <GameShell
      title={t(GAME_TITLE)}
      emoji="🎳"
      modes={modes}
      mode={mode}
      onMode={(levels) => update({ levels: levels as MarbleLevel })}
      level={
        // For all levels; so far only the marble run has something that waits for a tap (the barrier, K-02) or is set by the child (the switch, K-01).
        <Choice<MarbleSettings["play"]>
          label={t({ de: "Schranke und Weiche" })}
          value={settings.play}
          onChange={(play) => update({ play })}
          options={[
            { value: "join", label: t({ de: "👆 Kind tippt" }) },
            { value: "watch", label: t({ de: "🔄 Von selbst" }) },
          ]}
        />
      }
    >
      <MarblePlay settings={settings} />
    </GameShell>
  );
}
