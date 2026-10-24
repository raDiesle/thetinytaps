import { TrafficGame } from "@/games/traffic/TrafficGame";
import { useTitle } from "@/lib/title";

export function TrafficPage() {
  useTitle("Ampel und Zebrastreifen");
  return <TrafficGame />;
}
