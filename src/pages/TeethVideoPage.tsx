import { TeethVideo } from "@/games/teeth/TeethVideo";
import { useTitle } from "@/lib/title";

/** Hidden page for grown-ups, reached from /management/: Zähne putzen played for a video recording. */
export function TeethVideoPage() {
  useTitle("Zähne putzen fürs Video");
  return <TeethVideo />;
}
