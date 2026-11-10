import { PACIFIER_STORY_TITLE } from "@/games/pacifierstory/names";
import { PacifierStoryGame } from "@/games/pacifierstory/PacifierStoryGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function PacifierStoryPage() {
  const t = useT();
  useTitle(t(PACIFIER_STORY_TITLE));
  return <PacifierStoryGame />;
}
