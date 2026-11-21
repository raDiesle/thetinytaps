import { BottleStoryGame } from "@/games/bottlestory/BottleStoryGame";
import { BOTTLE_STORY_TITLE } from "@/games/bottlestory/names";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function BottleStoryPage() {
  const t = useT();
  useTitle(t(BOTTLE_STORY_TITLE));
  return <BottleStoryGame />;
}
