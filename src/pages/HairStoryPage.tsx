import { HAIR_STORY_TITLE } from "@/games/hairstory/names";
import { HairStoryGame } from "@/games/hairstory/HairStoryGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function HairStoryPage() {
  const t = useT();
  useTitle(t(HAIR_STORY_TITLE));
  return <HairStoryGame />;
}
