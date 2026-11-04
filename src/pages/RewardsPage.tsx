import { type PageKind, REWARDS_TITLE, RewardsGame } from "@/games/rewards/RewardsGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

/** The Belohnungstafel and the Tagesplan on one page; `/tagesplan/` opens it on a plan. */
export function RewardsPage({ type }: { type?: PageKind } = {}) {
  const t = useT();
  useTitle(t(REWARDS_TITLE));
  return <RewardsGame type={type} />;
}

/** `/tagesplan/`: the same page, opened on a plan. */
export function PlannerPage() {
  return <RewardsPage type="plan" />;
}

/** `/wie-lange-warten/`: the same page, opened on a Countdown to a big day (H-05). */
export function WaitPage() {
  return <RewardsPage type="countdown" />;
}
