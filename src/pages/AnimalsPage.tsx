import { AnimalsGame } from "@/games/animals/AnimalsGame";
import { useTitle } from "@/lib/title";

export function AnimalsPage() {
  useTitle("Was gehört zum Tier?");
  return <AnimalsGame />;
}
