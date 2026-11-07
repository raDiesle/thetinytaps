import { type Localized, useT } from "@/lib/language";
import type { RoundKind } from "./levels";

/**
 * The sign of each kind of round, before its name under ⚙️ (never while playing). Never something the child picks from
 * (no 🥕, no 🦋), or it would give the answer away or look like one more choice.
 */
export const KIND_SIGNS: Record<RoundKind, string> = { peek: "🔍", feed: "🍽️", gift: "🎁", home: "🏠", grow: "🌱" };

/** The round's question, as the animal (or the small one) would ask it. */
const KIND_QUESTIONS: Record<RoundKind, Localized> = {
  peek: {
    de: "Wer versteckt sich da?",
    ru: "Кто там прячется?",
    en: "Who is hiding there?",
    zh: "谁藏在那里？",
    hi: "वहाँ कौन छिपा है?",
    es: "¿Quién se esconde ahí?",
    ar: "من يختبئ هناك؟",
  },
  feed: { de: "Was esse ich?", ru: "Что я ем?", en: "What do I eat?", zh: "我吃什么？", hi: "मुझे क्या खाना पसंद है?", es: "¿Qué como?", ar: "ماذا آكل؟" },
  gift: {
    de: "Was produziere ich?",
    ru: "Что я тебе даю?",
    en: "What do I give you?",
    zh: "我给你什么？",
    hi: "मुझसे तुम्हें क्या मिलता है?",
    es: "¿Qué te doy?",
    ar: "ماذا أعطيك؟",
  },
  home: { de: "Wo lebe ich?", ru: "Где я живу?", en: "Where do I live?", zh: "我住在哪里？", hi: "मेरा घर कहाँ है?", es: "¿Dónde vivo?", ar: "أين أعيش؟" },
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

/**
 * What this round is about, for grown-ups: its question as plain small text under the picture – no sign, no bubble, no
 * frame (user feedback, November 2026). The child needs none of it – it plays from the pictures – so it stays quiet and
 * lets every tap through.
 */
export function RoundTopic({ kind }: { kind: RoundKind }) {
  const t = useT();
  return <p className="ap-topic">{t(KIND_QUESTIONS[kind])}</p>;
}
