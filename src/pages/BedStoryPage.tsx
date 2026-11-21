import { BedStoryGame } from "@/games/bedstory/BedStoryGame";
import { BED_STORY_TITLE } from "@/games/bedstory/names";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function BedStoryPage() {
  const t = useT();
  useTitle(t(BED_STORY_TITLE));
  return <BedStoryGame />;
}
