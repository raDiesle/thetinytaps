import { MoodGame } from "@/games/feelings/MoodGame";
import { MOOD_TITLE } from "@/games/feelings/names";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function MoodPage() {
  const t = useT();
  useTitle(t(MOOD_TITLE));
  return <MoodGame />;
}
