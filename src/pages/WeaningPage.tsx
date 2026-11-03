import { WEANING_TITLE, WeaningGame } from "@/games/weaning/WeaningGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function WeaningPage() {
  const t = useT();
  useTitle(t(WEANING_TITLE));
  return <WeaningGame />;
}
