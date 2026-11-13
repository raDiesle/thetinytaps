import { CornerChoices } from "@/components/CornerChoices";
import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import { TOGETHER_TITLE } from "./names";
import { KIND_ORDER, type RoundKind } from "./levels";
import { DEFAULT_TOGETHER_SETTINGS, TOGETHER_SETTINGS_KEY } from "./settings";
import { TogetherRounds } from "./TogetherRounds";
import "./together.css";

/** All kinds taking turns, the first choice of „Was drankommt“ (worded as Schatten finden's „Gemischt“). */
const MIXED: Localized = { de: "Gemischt", ru: "Вперемешку", en: "Mixed", zh: "混合", hi: "मिले-जुले", es: "Mezclado", ar: "منوعة" };

/** What the choices in the corner are about (worded as Was gehört zum Tier?'s). */
const WHAT_COMES_UP: Localized = {
  de: "Was drankommt",
  ru: "Что будет в игре",
  en: "What comes up",
  zh: "出现哪些内容",
  hi: "क्या-क्या आएगा",
  es: "Qué aparece",
  ar: "ما الذي يظهر",
};

/** The names of the two kinds of rounds, to choose one of them in the corner. */
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
      // Grown-ups pick one kind in the top right corner while playing.
      startMode="play"
    >
      <TogetherRounds settings={settings} />
      <CornerChoices
        title={t(WHAT_COMES_UP)}
        value={settings.kinds}
        onChange={(kinds) => update({ kinds })}
        // All kinds taking turns, or just one – never a mix of some (user feedback, November 2026); words only, no signs.
        choices={[{ value: "all", label: t(MIXED) }, ...KIND_ORDER.map((kind) => ({ value: kind, label: t(KIND_NAMES[kind]) }))]}
      />
    </GameShell>
  );
}
