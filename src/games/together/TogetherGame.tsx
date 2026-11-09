import { GameShell } from "@/components/GameShell";
import { PlayOptions } from "@/components/PlayOptions";
import { Choice } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import { TOGETHER_TITLE } from "./names";
import { KIND_ORDER, type RoundKind } from "./levels";
import { DEFAULT_TOGETHER_SETTINGS, type Difficulty, TOGETHER_SETTINGS_KEY } from "./settings";
import { TogetherRounds } from "./TogetherRounds";
import { KIND_SIGNS } from "./RoundTopic";
import "./together.css";

/** All kinds taking turns, the first choice of „Was drankommt“ (worded as Schatten finden's „Gemischt“). */
const MIXED: Localized = { de: "Gemischt", ru: "Вперемешку", en: "Mixed", zh: "混合", hi: "मिले-जुले", es: "Mezclado", ar: "منوعة" };

/** The names of the two kinds of rounds, to choose one of them (after their sign, `KIND_SIGNS`). */
const KIND_NAMES: Record<RoundKind, Localized> = {
  pair: {
    de: "Dinge aus dem Alltag",
    ru: "Вещи на каждый день",
    en: "Everyday things",
    zh: "日常用品",
    hi: "रोज़ की चीज़ें",
    es: "Cosas de todos los días",
    ar: "أشياء من الحياة اليومية",
  },
  helper: {
    de: "Helfer und ihr Werkzeug",
    ru: "Помощники и их инструменты",
    en: "Helpers and their tools",
    zh: "帮手和他们的工具",
    hi: "मददगार और उनके औज़ार",
    es: "Ayudantes y sus herramientas",
    ar: "المساعدون وأدواتهم",
  },
};

export function TogetherGame() {
  const t = useT();
  const [settings, update] = useGameSettings(TOGETHER_SETTINGS_KEY, DEFAULT_TOGETHER_SETTINGS);

  return (
    <GameShell
      title={t(TOGETHER_TITLE)}
      // Nothing to choose first: its two kinds of rounds take turns and the game finds the difficulty itself, so its
      // card plays at once; ✕ and „Menü“ go back to the table of contents (GameShell), there is no start screen.
      // Grown-ups change both while playing (⚙️ held in the corner).
      startMode="play"
    >
      <TogetherRounds settings={settings} />
      <PlayOptions iconOnly>
        <Choice<"all" | RoundKind>
          label={t({
            de: "Was drankommt",
            ru: "Что будет в игре",
            en: "What comes up",
            zh: "出现哪些内容",
            hi: "क्या-क्या आएगा",
            es: "Qué aparece",
            ar: "ما الذي يظهر",
          })}
          value={settings.kinds}
          onChange={(kinds) => update({ kinds })}
          // All kinds taking turns, or just one – never a mix of some (user feedback, November 2026).
          options={[{ value: "all", label: t(MIXED) }, ...KIND_ORDER.map((kind) => ({ value: kind, label: `${KIND_SIGNS[kind]} ${t(KIND_NAMES[kind])}` }))]}
        />
        <Choice<Difficulty>
          label={t({ de: "Schwierigkeit", ru: "Сложность", en: "Difficulty", zh: "难度", hi: "कठिनाई", es: "Dificultad", ar: "الصعوبة" })}
          value={settings.difficulty}
          onChange={(difficulty) => update({ difficulty })}
          options={[
            { value: "auto", label: t({ de: "Von selbst", ru: "Автоматически", en: "Automatic", zh: "自动", hi: "अपने-आप", es: "Automática", ar: "تلقائي" }) },
            { value: "easy", label: t({ de: "Leicht", ru: "Легко", en: "Easy", zh: "简单", hi: "आसान", es: "Fácil", ar: "سهل" }) },
            { value: "medium", label: t({ de: "Mittel", ru: "Средне", en: "Medium", zh: "中等", hi: "मध्यम", es: "Media", ar: "متوسط" }) },
            { value: "hard", label: t({ de: "Schwer", ru: "Сложно", en: "Hard", zh: "困难", hi: "कठिन", es: "Difícil", ar: "صعب" }) },
          ]}
        />
      </PlayOptions>
    </GameShell>
  );
}
