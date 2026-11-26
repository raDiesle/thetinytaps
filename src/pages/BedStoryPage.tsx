import { useLocation } from "react-router";
import { BedStoryGame, titleAt } from "@/games/bedstory/BedStoryGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

/** The book „Sleep Tight“ with its stories: the cot's at `/grosses-bett/`, the parents' bed's at `/grosses-bett/eigenes-bett/`. */
export function BedStoryPage() {
  const t = useT();
  useTitle(t(titleAt(useLocation().pathname)));
  return <BedStoryGame />;
}
