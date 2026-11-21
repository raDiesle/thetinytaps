import { TowerGame } from "@/games/tower/TowerGame";
import { TOWER_TITLE } from "@/games/tower/names";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function TowerPage() {
  const t = useT();
  useTitle(t(TOWER_TITLE));
  return <TowerGame />;
}
