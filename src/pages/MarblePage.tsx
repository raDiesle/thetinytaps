import { MarbleGame } from "@/games/marbles/MarbleGame";
import { useTitle } from "@/lib/title";

export function MarblePage() {
  useTitle("Kettenreaktion");
  return <MarbleGame />;
}
