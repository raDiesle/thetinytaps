import { ElevatorGame } from "@/games/elevator/ElevatorGame";
import { useTitle } from "@/lib/title";

export function ElevatorPage() {
  useTitle("Kleine Abenteuer");
  return <ElevatorGame />;
}
