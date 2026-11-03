import { GameShell } from "@/components/GameShell";
import { PlayOptions } from "@/components/PlayOptions";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import { TOGETHER_TITLE } from "./names";
import { KIND_ORDER, type RoundKind } from "./levels";
import { DEFAULT_TOGETHER_SETTINGS, type Difficulty, TOGETHER_SETTINGS_KEY } from "./settings";
import { TogetherRounds } from "./TogetherRounds";
import { KIND_SIGNS } from "./TopicBubble";
import "./together.css";

/** The names of the two kinds of rounds, for switching them on and off (after their sign, `KIND_SIGNS`). */
const KIND_NAMES: Record<RoundKind, Localized> = {
  pair: { de: "Dinge aus dem Alltag" },
  helper: { de: "Helfer und ihr Werkzeug" },
};

export function TogetherGame() {
  const t = useT();
  const [settings, update] = useGameSettings(TOGETHER_SETTINGS_KEY, DEFAULT_TOGETHER_SETTINGS);
  const kindsOn = KIND_ORDER.filter((k) => settings[k]).length;

  return (
    <GameShell
      title={t(TOGETHER_TITLE)}
      // Nothing to choose first: its two kinds of rounds take turns and the game finds the difficulty itself, so its
      // card plays at once; ✕ and „Menü“ go back to the table of contents (GameShell), there is no start screen.
      // Grown-ups change both while playing (⚙️ held in the corner).
      startMode="play"
    >
      <TogetherRounds settings={settings} />
      <PlayOptions>
        <SettingsGroup title={t({ de: "Was drankommt" })}>
          {KIND_ORDER.map((kind) => (
            <Toggle
              key={kind}
              label={`${KIND_SIGNS[kind]} ${t(KIND_NAMES[kind])}`}
              checked={settings[kind]}
              // One kind always stays on: the last one can't be switched off.
              onChange={(on) => (on || kindsOn > 1) && update({ [kind]: on })}
            />
          ))}
        </SettingsGroup>
        <Choice<Difficulty>
          label={t({ de: "Schwierigkeit" })}
          value={settings.difficulty}
          onChange={(difficulty) => update({ difficulty })}
          options={[
            { value: "auto", label: t({ de: "Von selbst" }) },
            { value: "easy", label: t({ de: "Leicht" }) },
            { value: "medium", label: t({ de: "Mittel" }) },
            { value: "hard", label: t({ de: "Schwer" }) },
          ]}
        />
      </PlayOptions>
    </GameShell>
  );
}
