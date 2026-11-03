import { TimerGame } from "@/games/timer/TimerGame";
import { TIMER_TITLE } from "@/games/timer/content";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function TimerPage() {
  const t = useT();
  useTitle(t(TIMER_TITLE));
  return <TimerGame />;
}
