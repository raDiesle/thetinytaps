import { type Localized, useAppLanguage, useT } from "@/lib/language";
import type { RoundKind } from "./levels";
import type { Pair } from "./pairs";

/**
 * The sign of each kind of round, before its name under ⚙️ (never while playing). Never something the child picks from
 * (no 🔑, no ✂️), or it would give the answer away or look like one more choice.
 */
export const KIND_SIGNS: Record<RoundKind, string> = { pair: "🤝", helper: "🦺" };

/** The round's question, as the one above would ask it, where the pair's wish isn't said in the app language yet. */
const KIND_QUESTIONS: Record<RoundKind, Localized> = {
  pair: {
    de: "Was gehört zu mir?",
    ru: "Что подходит ко мне?",
    en: "What goes with me?",
    zh: "什么和我是一对？",
    hi: "मेरे लिए क्या चाहिए?",
    es: "¿Qué va conmigo?",
    ar: "ماذا يناسبني؟",
  },
  helper: {
    de: "Was brauche ich?",
    ru: "Что мне нужно?",
    en: "What do I need?",
    zh: "我需要什么？",
    hi: "मुझे क्या चाहिए?",
    es: "¿Qué necesito?",
    ar: "إلى ماذا أحتاج؟",
  },
};

/**
 * What this round is about, for grown-ups: its question as plain small text under the picture – no sign, no bubble, no
 * frame (user feedback, November 2026). The child needs none of it – it plays from the pictures and hears the wish –
 * so it stays quiet and lets every tap through. In German it is the pair's wish, the very sentence the voice says
 * (Z-25: „Die Blume hat Durst.“); the other languages show the kind's question until the wishes are translated.
 */
export function RoundTopic({ pair }: { pair: Pair }) {
  const t = useT();
  const { id } = useAppLanguage();
  return <p className="tg-topic">{id === "de" ? pair.wish : t(KIND_QUESTIONS[pair.kind])}</p>;
}
