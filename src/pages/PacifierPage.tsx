import { PACIFIER_TITLE, PacifierGame } from "@/games/pacifier/PacifierGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function PacifierPage() {
  const t = useT();
  useTitle(t(PACIFIER_TITLE));
  return <PacifierGame />;
}
