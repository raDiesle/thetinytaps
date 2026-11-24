import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { LEVELS, loadLevel } from "./catalog";
import { GAME_TITLE, LEVEL_TEXTS } from "./content";
import { MarblePlay } from "./MarblePlay";
import { DEFAULT_MARBLE_SETTINGS, MARBLE_SETTINGS_KEY, type MarbleLevel } from "./settings";
import previews from "./vorschau/*.webp?glob";

export function MarbleGame() {
  const t = useT();
  const [settings, update] = useGameSettings(MARBLE_SETTINGS_KEY, DEFAULT_MARBLE_SETTINGS);
  // Older saves may hold a choice that is gone ("all", "both", "machines"): those begin with the first level.
  const mode = LEVELS.some((m) => m.id === settings.levels) ? settings.levels : LEVELS[0].id;
  const modes = LEVELS.map((m) => ({ id: m.id, emoji: m.emoji, title: t(LEVEL_TEXTS[m.id].name) }));

  return (
    <GameShell
      previews={previews}
      labelOnPicture
      title={t(GAME_TITLE)}
      modes={modes}
      mode={mode}
      onMode={(levels) => update({ levels: levels as MarbleLevel })}
      // A tap on a card waits a moment for its level's code, so the level is drawn before the page turns to it.
      prepare={(id) => loadLevel(LEVELS.find((l) => l.id === (id ?? mode)) ?? LEVELS[0])}
    >
      <MarblePlay settings={settings} />
    </GameShell>
  );
}
