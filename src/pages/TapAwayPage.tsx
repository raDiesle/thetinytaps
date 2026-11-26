import { TapAwayGame } from "@/games/tapaway/TapAwayGame";
import { TAP_AWAY_TITLE } from "@/games/tapaway/names";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

/** „Tap Magic“, at `/drauflos/`. */
export function TapAwayPage() {
  const t = useT();
  useTitle(t(TAP_AWAY_TITLE));
  return <TapAwayGame />;
}
