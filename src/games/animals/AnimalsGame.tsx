import { GameShell } from "@/components/GameShell";
import { PlayOptions } from "@/components/PlayOptions";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import "@/games/shadows/shadows.css";
import { AnimalsRounds } from "./AnimalsRounds";
import { KIND_ORDER, type RoundKind } from "./levels";
import { ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS, type Difficulty } from "./settings";
import "./animals.css";

/** The game's name, on its start screen and in the browser tab. */
export const ANIMALS_TITLE: Localized = {
  de: "Was gehört zum Tier?",
  ru: "Что нужно зверюшке?",
  en: "What Does the Animal Need?",
  zh: "小动物要什么？",
  hi: "जानवर को क्या चाहिए?",
  es: "¿Qué necesita el animal?",
  ar: "ماذا يحتاج الحيوان؟",
};

/** The names of the four kinds of rounds, for switching them on and off. */
const KIND_NAMES: Record<RoundKind, Localized> = {
  peek: {
    de: "🙈 Wer schaut da raus?",
    ru: "🙈 Кто там выглядывает?",
    en: "🙈 Who's peeking out?",
    zh: "🙈 谁在偷偷看？",
    hi: "🙈 कौन झाँक रहा है?",
    es: "🙈 ¿Quién se asoma?",
    ar: "🙈 من يطل من هناك؟",
  },
  feed: {
    de: "🥕 Tiere füttern",
    ru: "🥕 Покорми зверюшку",
    en: "🥕 Feed the animals",
    zh: "🥕 喂小动物",
    hi: "🥕 जानवरों को खिलाओ",
    es: "🥕 Dar de comer",
    ar: "🥕 إطعام الحيوانات",
  },
  gift: { de: "🥛 Was gibt uns das Tier?" },
  home: {
    de: "🏠 Wer wohnt wo?",
    ru: "🏠 Кто где живёт?",
    en: "🏠 Who lives where?",
    zh: "🏠 谁住在哪里？",
    hi: "🏠 कौन कहाँ रहता है?",
    es: "🏠 ¿Quién vive dónde?",
    ar: "🏠 من يعيش أين؟",
  },
};

export function AnimalsGame() {
  const t = useT();
  const [settings, update] = useGameSettings(ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS);
  const kindsOn = KIND_ORDER.filter((k) => settings[k]).length;

  return (
    <GameShell
      title={t(ANIMALS_TITLE)}
      // Nothing to choose first: its four kinds of rounds take turns and the game finds the difficulty itself, so its
      // card plays at once; ✕ and „Menü“ go back to the table of contents (GameShell), there is no start screen.
      // Grown-ups change both while playing (⚙️ held in the corner).
      startMode="play"
    >
      <AnimalsRounds settings={settings} />
      <PlayOptions>
        <SettingsGroup title={t({ de: "Was drankommt" })}>
          {KIND_ORDER.map((kind) => (
            <Toggle
              key={kind}
              label={t(KIND_NAMES[kind])}
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
