import { WordsGame } from "@/games/words/WordsGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function WordsPage() {
  const t = useT();
  useTitle(t({ de: "Wörter tippen", ru: "Печатаем слова" }));
  return <WordsGame />;
}
