import { GameShell } from "@/components/GameShell";
import { Choice } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { LEVELS, loadLevel } from "./catalog";
import { GAME_TITLE, LEVEL_TEXTS } from "./content";
import { MarblePlay } from "./MarblePlay";
import { DEFAULT_MARBLE_SETTINGS, MARBLE_SETTINGS_KEY, type MarbleLevel, type MarbleSettings } from "./settings";
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
      level={
        // For all levels: whether what waits for a tap waits – the marble run's barrier (K-02) and switch (K-01), the machines' stops (R-03).
        <Choice<MarbleSettings["play"]>
          label={t({ de: "Mitmachen", en: "Join in", zh: "一起参与", hi: "साथ में खेलना", es: "Participar", ar: "المشاركة", ru: "Участие" })}
          value={settings.play}
          onChange={(play) => update({ play })}
          options={[
            {
              value: "join",
              label: t({
                de: "👆 Kind tippt",
                en: "👆 Child taps",
                zh: "👆 孩子来点",
                hi: "👆 बच्चा छूता है",
                es: "👆 Con un toque",
                ar: "👆 الطفل ينقر",
                ru: "👆 Нажимает ребёнок",
              }),
            },
            {
              value: "watch",
              label: t({ de: "🔄 Von selbst", en: "🔄 By itself", zh: "🔄 自动", hi: "🔄 अपने-आप", es: "🔄 Automático", ar: "🔄 تلقائيًا", ru: "🔄 Само" }),
            },
          ]}
        />
      }
    >
      <MarblePlay settings={settings} />
    </GameShell>
  );
}
