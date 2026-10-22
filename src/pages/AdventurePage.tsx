import { AdventureGame } from "@/games/adventure/AdventureGame";
import { useTitle } from "@/lib/title";

export function AdventurePage() {
  useTitle("Bewegungsabenteuer");
  return <AdventureGame />;
}
