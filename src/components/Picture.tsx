import type { WordEntry } from "@/content/types";
import { asset } from "@/lib/asset";

/** The word's illustration if it has one, otherwise its emoji. */
export function Picture({ word }: { word: WordEntry }) {
  if (word.image) {
    return <img className="picture picture-image" src={asset(word.image)} alt={word.word} />;
  }
  return (
    <span className="picture" role="img" aria-label={word.word}>
      {word.emoji}
    </span>
  );
}
