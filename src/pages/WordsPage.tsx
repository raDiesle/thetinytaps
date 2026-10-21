import { WordsGame } from "@/games/words/WordsGame";
import { useTitle } from "@/lib/title";

export function WordsPage() {
  useTitle("Wörter tippen");
  return <WordsGame />;
}
