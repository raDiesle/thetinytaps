import { NeedsGame } from "@/games/feelings/NeedsGame";
import { NEEDS_TITLE } from "@/games/feelings/needs";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function NeedsPage() {
  const t = useT();
  useTitle(t(NEEDS_TITLE));
  return <NeedsGame />;
}
