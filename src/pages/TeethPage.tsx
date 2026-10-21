import { TeethGame } from "@/games/teeth/TeethGame";
import { useTitle } from "@/lib/title";

export function TeethPage() {
  useTitle("Zähne putzen");
  return <TeethGame />;
}
