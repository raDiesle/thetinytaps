import { FeelingsGame } from "@/games/feelings/FeelingsGame";
import { useTitle } from "@/lib/title";

export function FeelingsPage() {
  useTitle("Gefühle");
  return <FeelingsGame />;
}
