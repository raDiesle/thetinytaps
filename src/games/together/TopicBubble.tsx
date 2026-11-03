import { type Localized, useT } from "@/lib/language";
import type { RoundKind } from "./levels";

/**
 * The sign of each kind of round, in its bubble while playing and before its name under ⚙️. Never something the child
 * picks from (no 🔑, no ✂️), or the bubble would give the answer away or look like one more choice.
 */
export const KIND_SIGNS: Record<RoundKind, string> = { pair: "🤝", helper: "🦺" };

/** The round's question, as the one above would ask it. */
const KIND_QUESTIONS: Record<RoundKind, Localized> = {
  pair: { de: "Was gehört zu mir?" },
  helper: { de: "Was brauche ich?" },
};

/**
 * A speech bubble telling grown-ups what this round is about: the kind's sign big, its question small below it. The
 * child needs neither – it plays from the pictures – so it stays out of the way of every tap.
 */
export function TopicBubble({ kind }: { kind: RoundKind }) {
  const t = useT();
  return (
    <div className="tg-topic">
      <span className="tg-topic-sign" aria-hidden>
        {KIND_SIGNS[kind]}
      </span>
      <span className="tg-topic-text">{t(KIND_QUESTIONS[kind])}</span>
    </div>
  );
}
