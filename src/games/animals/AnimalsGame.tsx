import { GameShell } from "@/components/GameShell";
import { PlayOptions } from "@/components/PlayOptions";
import { Choice } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import "@/games/shadows/shadows.css";
import { AnimalsRounds } from "./AnimalsRounds";
import { KIND_ORDER, type RoundKind } from "./levels";
import { KIND_SIGNS } from "./RoundTopic";
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

/** All kinds taking turns, the first choice of „Was drankommt“ (worded as Schatten finden's „Gemischt“). */
const MIXED: Localized = { de: "Gemischt", ru: "Вперемешку", en: "Mixed", zh: "混合", hi: "मिले-जुले", es: "Mezclado", ar: "منوعة" };

/** The names of the five kinds of rounds, to choose one of them (after their sign, `KIND_SIGNS`). */
const KIND_NAMES: Record<RoundKind, Localized> = {
  peek: {
    de: "Wer schaut da raus?",
    ru: "Кто там выглядывает?",
    en: "Who's peeking out?",
    zh: "谁在偷偷看？",
    hi: "कौन झाँक रहा है?",
    es: "¿Quién se asoma?",
    ar: "من يطل من هناك؟",
  },
  feed: {
    de: "Tiere füttern",
    ru: "Покорми зверюшку",
    en: "Feed the animals",
    zh: "喂小动物",
    hi: "जानवरों को खिलाओ",
    es: "Dar de comer",
    ar: "إطعام الحيوانات",
  },
  gift: {
    de: "Was gibt uns das Tier?",
    ru: "Что нам даёт зверюшка?",
    en: "What does the animal give us?",
    zh: "小动物给我们什么？",
    hi: "जानवर से हमें क्या मिलता है?",
    es: "¿Qué nos da el animal?",
    ar: "ماذا يعطينا الحيوان؟",
  },
  home: {
    de: "Wer wohnt wo?",
    ru: "Кто где живёт?",
    en: "Who lives where?",
    zh: "谁住在哪里？",
    hi: "कौन कहाँ रहता है?",
    es: "¿Quién vive dónde?",
    ar: "من يعيش أين؟",
  },
  grow: {
    de: "Was wird aus mir?",
    ru: "Кем я стану?",
    en: "What do I grow into?",
    zh: "我会变成什么？",
    hi: "मुझसे क्या बनता है?",
    es: "¿En qué me convierto?",
    ar: "إلى ماذا أتحول؟",
  },
};

export function AnimalsGame() {
  const t = useT();
  const [settings, update] = useGameSettings(ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS);

  return (
    <GameShell
      title={t(ANIMALS_TITLE)}
      // Nothing to choose first: its five kinds of rounds take turns and the game finds the difficulty itself, so its
      // card plays at once; ✕ and „Menü“ go back to the table of contents (GameShell), there is no start screen.
      // Grown-ups change both while playing (⚙️ held in the corner).
      startMode="play"
    >
      <AnimalsRounds settings={settings} />
      <PlayOptions>
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
