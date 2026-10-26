import { SHADOWS_TITLE, ShadowsGame } from "@/games/shadows/ShadowsGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function ShadowsPage() {
  const t = useT();
  useTitle(t(SHADOWS_TITLE));
  return <ShadowsGame />;
}
