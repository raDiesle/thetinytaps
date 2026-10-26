import { ElevatorGame } from "@/games/elevator/ElevatorGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function ElevatorPage() {
  const t = useT();
  useTitle(t({ de: "Kleine Abenteuer", ru: "Маленькие приключения" }));
  return <ElevatorGame />;
}
