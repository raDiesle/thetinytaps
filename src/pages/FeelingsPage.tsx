import { FeelingsGame } from "@/games/feelings/FeelingsGame";
import { ALLTAG_TITLE } from "@/games/feelings/names";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function FeelingsPage() {
  const t = useT();
  useTitle(t(ALLTAG_TITLE));
  return <FeelingsGame />;
}
