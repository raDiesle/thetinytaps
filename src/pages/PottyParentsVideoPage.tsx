import { ParentsVideo } from "@/games/potty/ParentsVideo";
import { useTitle } from "@/lib/title";

/** Hidden page for grown-ups, reached from /management/: Aufs Töpfchen played on a tablet by a drawn hand, for a parents' video. */
export function PottyParentsVideoPage() {
  useTitle("Aufs Töpfchen: Video für Eltern");
  return <ParentsVideo />;
}
