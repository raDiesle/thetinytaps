import { ShadowsGame } from "@/games/shadows/ShadowsGame";
import { useTitle } from "@/lib/title";

export function ShadowsPage() {
  useTitle("Schatten finden");
  return <ShadowsGame />;
}
