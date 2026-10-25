import { MarbleRunGame } from "@/games/marblerun/MarbleRunGame";
import { useTitle } from "@/lib/title";

export function MarbleRunPage() {
  useTitle("Klingende Kugelbahn");
  return <MarbleRunGame />;
}
