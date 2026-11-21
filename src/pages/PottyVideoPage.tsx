import { PottyVideo } from "@/games/potty/PottyVideo";
import { useTitle } from "@/lib/title";

/** Hidden page for grown-ups, reached from /management/: Aufs Töpfchen played for a video recording. */
export function PottyVideoPage() {
  useTitle("Aufs Töpfchen fürs Video");
  return <PottyVideo />;
}
