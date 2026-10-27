import { POTTY_TITLE, PottyGame } from "@/games/potty/PottyGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function PottyPage() {
  const t = useT();
  useTitle(t(POTTY_TITLE));
  return <PottyGame />;
}
