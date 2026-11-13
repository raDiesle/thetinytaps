import { pick, useAppLanguage } from "@/lib/language";
import { type Pair, TOGETHER_TEXTS } from "./pairs";

/**
 * What this round is about, under the picture: its caption (`caption`, the wish and a question about what is needed, in
 * the app language, e.g. „Die Blume hat Durst. Womit bekommt sie Wasser?“), for the grown-up to read out. Set like
 * Abstillen's sentence under its picture (`.cb-words`; user feedback, November 2026: the bold grey line looked poor) –
 * the book's serif, its first letter big and red, at the size of every caption, curls beside it on wide screens – and
 * still no sign, bubble or frame. The child plays from the pictures and hears the wish, so it lets every tap through.
 */
export function RoundTopic({ pair }: { pair: Pair }) {
  const { id } = useAppLanguage();
  return (
    <div className="tg-words">
      <p className="tg-topic">{pick(TOGETHER_TEXTS, id).caption(pair)}</p>
    </div>
  );
}
