import { TOGETHER_TITLE } from "@/games/together/names";
import { TogetherGame } from "@/games/together/TogetherGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function TogetherPage() {
  const t = useT();
  useTitle(t(TOGETHER_TITLE));
  return <TogetherGame />;
}
