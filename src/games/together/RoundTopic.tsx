import { pick, useAppLanguage } from "@/lib/language";
import type { RoundKind } from "./levels";
import { type Pair, TOGETHER_TEXTS } from "./pairs";

/**
 * The sign of each kind of round, before its name under ⚙️ (never while playing). Never something the child picks from
 * (no 🔑, no ✂️), or it would give the answer away or look like one more choice.
 */
export const KIND_SIGNS: Record<RoundKind, string> = { pair: "🤝", helper: "🦺" };

/**
 * What this round is about, under the picture: its caption as plain small text – no sign, no bubble, no frame (user
 * feedback, November 2026). It is the wish and a question about what is needed, in the app language (`caption`, e.g.
 * „Die Blume hat Durst. Womit bekommt sie Wasser?“). The child plays from the pictures and hears the wish, so this
 * stays quiet and lets every tap through.
 */
export function RoundTopic({ pair }: { pair: Pair }) {
  const { id } = useAppLanguage();
  return <p className="tg-topic">{pick(TOGETHER_TEXTS, id).caption(pair)}</p>;
}
