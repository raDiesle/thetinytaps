import { PLANNER_TITLE, PlannerGame } from "@/games/rewards/PlannerGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function PlannerPage() {
  const t = useT();
  useTitle(t(PLANNER_TITLE));
  return <PlannerGame />;
}
