import { REWARDS_TITLE, RewardsGame } from "@/games/rewards/RewardsGame";
import type { ChartType } from "@/games/rewards/catalog";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

/** The Belohnungstafel and the Tagesplan on one page; `/tagesplan/` opens it on a plan. */
export function RewardsPage({ type }: { type?: ChartType } = {}) {
  const t = useT();
  useTitle(t(REWARDS_TITLE));
  return <RewardsGame type={type} />;
}

/** `/tagesplan/`: the same page, opened on a plan. */
export function PlannerPage() {
  return <RewardsPage type="plan" />;
}
