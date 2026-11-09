import { CauseGame } from "@/games/cause/CauseGame";
import { CAUSE_TITLE } from "@/games/cause/names";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function CausePage() {
  const t = useT();
  useTitle(t(CAUSE_TITLE));
  return <CauseGame />;
}
