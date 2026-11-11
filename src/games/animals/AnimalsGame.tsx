import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import "@/games/shadows/shadows.css";
import { AnimalsRounds } from "./AnimalsRounds";
import { KIND_ORDER, type RoundKind } from "./levels";
import { ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS } from "./settings";
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

/** What the choices in the corner are about. */
const WHAT_COMES_UP: Localized = {
  de: "Was drankommt",
  ru: "Что будет в игре",
  en: "What comes up",
  zh: "出现哪些内容",
  hi: "क्या-क्या आएगा",
  es: "Qué aparece",
  ar: "ما الذي يظهر",
};

/** The names of the five kinds of rounds, to choose one of them in the corner. */
const KIND_NAMES: Record<RoundKind, Localized> = {
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
  // German only until translations are asked for (languageStatus.ts).
  sound: { de: "Wer macht das Geräusch?" },
};

export function AnimalsGame() {
  const t = useT();
  const [settings, update] = useGameSettings(ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS);

  return (
    <GameShell
      title={t(ANIMALS_TITLE)}
      // Nothing to choose first: its five kinds of rounds take turns and the game finds the difficulty itself, so its
      // card plays at once; ✕ and „Menü“ go back to the table of contents (GameShell), there is no start screen.
      // Grown-ups pick one kind in the top right corner while playing.
      startMode="play"
    >
      <AnimalsRounds settings={settings} />
      <KindCorner value={settings.kinds} onChange={(kinds) => update({ kinds })} />
    </GameShell>
  );
}

/**
 * „Was drankommt“ while playing, right in the top right corner as a small paper note listing the choices – no ⚙️ to hold
 * and no panel popping up over the game (user decision, November 2026): „Gemischt“ or exactly one kind, the chosen one
 * marked by the highlighter's stroke. Words only, no signs. A change counts from the next round.
 */
function KindCorner({ value, onChange }: { value: "all" | RoundKind; onChange: (kinds: "all" | RoundKind) => void }) {
  const t = useT();
  const choices: { value: "all" | RoundKind; label: string }[] = [
    { value: "all", label: t(MIXED) },
    ...KIND_ORDER.map((kind) => ({ value: kind, label: t(KIND_NAMES[kind]) })),
  ];
  return (
    <nav className="ap-kinds" aria-label={t(WHAT_COMES_UP)} data-tap-root onPointerDown={(e) => e.stopPropagation()}>
      <span className="ap-kinds-title" aria-hidden>
        {t(WHAT_COMES_UP)}
      </span>
      {choices.map((choice) => (
        <button
          key={choice.value}
          type="button"
          className="ap-kind"
          aria-pressed={choice.value === value}
          // No focus left on it, so Space and Enter keep playing the game.
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => onChange(choice.value)}
        >
          <span className="ap-kind-label">{choice.label}</span>
        </button>
      ))}
    </nav>
  );
}
