import { MarbleGame } from "@/games/marbles/MarbleGame";
import { useTitle } from "@/lib/title";

export function MarblePage() {
  useTitle("Kugelbahn");
  return <MarbleGame />;
}
