import { useLocation } from "react-router";
import { KitaStoryGame, titleAt } from "@/games/kitastory/KitaStoryGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

/** The book „Kita-Start“ with its stories: the Kita's at `/kita/`, the childminder's at `/kita/tagesmutter/`. */
export function KitaStoryPage() {
  const t = useT();
  useTitle(t(titleAt(useLocation().pathname)));
  return <KitaStoryGame />;
}
