import { REWARDS_TITLE, RewardsGame } from "@/games/rewards/RewardsGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function RewardsPage() {
  const t = useT();
  useTitle(t(REWARDS_TITLE));
  return <RewardsGame />;
}
