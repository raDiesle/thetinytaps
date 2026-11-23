import { useLocation } from "react-router";
import { HairStoryGame, titleAt } from "@/games/hairstory/HairStoryGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

/** The book „Haare waschen“ with its stories: the bath's at `/haare-waschen/`, the shower's at `/haare-waschen/dusche/`. */
export function HairStoryPage() {
  const t = useT();
  useTitle(t(titleAt(useLocation().pathname)));
  return <HairStoryGame />;
}
