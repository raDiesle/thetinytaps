import { KITA_STORY_TITLE } from "@/games/kitastory/names";
import { KitaStoryGame } from "@/games/kitastory/KitaStoryGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function KitaStoryPage() {
  const t = useT();
  useTitle(t(KITA_STORY_TITLE));
  return <KitaStoryGame />;
}
