import { GAME_TITLE } from "@/games/marbles/content";
import { MarbleGame } from "@/games/marbles/MarbleGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function MarblePage() {
  const t = useT();
  useTitle(t(GAME_TITLE));
  return <MarbleGame />;
}
