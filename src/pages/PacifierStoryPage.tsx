import { useLocation } from "react-router";
import { PacifierStoryGame, titleAt } from "@/games/pacifierstory/PacifierStoryGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

/** The book „Schnullerfee“ with its stories: the fairy's at `/schnullerfee/`, the pacifier tree's at `/schnullerfee/baum/`. */
export function PacifierStoryPage() {
  const t = useT();
  useTitle(t(titleAt(useLocation().pathname)));
  return <PacifierStoryGame />;
}
