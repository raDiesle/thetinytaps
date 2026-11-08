import { pick, useAppLanguage } from "@/lib/language";
import type { RoundKind } from "./levels";
import { type Pair, TOGETHER_TEXTS } from "./pairs";

/**
 * The sign of each kind of round, before its name under ⚙️ (never while playing). Never something the child picks from
 * (no 🔑, no ✂️), or it would give the answer away or look like one more choice.
 */
export const KIND_SIGNS: Record<RoundKind, string> = { pair: "🤝", helper: "🦺" };

/**
 * What this round is about, for grown-ups: its question as plain small text under the picture – no sign, no bubble, no
 * frame (user feedback, November 2026). The child needs none of it – it plays from the pictures and hears the wish –
 * so it stays quiet and lets every tap through. It is the pair's wish in the app language, the very sentence the voice
 * says (Z-25: „Die Blume hat Durst.“, „The flower is thirsty.“).
 */
export function RoundTopic({ pair }: { pair: Pair }) {
  const { id } = useAppLanguage();
  return <p className="tg-topic">{pick(TOGETHER_TEXTS, id).question(pair)}</p>;
}
