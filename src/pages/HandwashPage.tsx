import { HandwashGame } from "@/games/handwash/HandwashGame";
import { HANDWASH_TITLE } from "@/games/handwash/names";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function HandwashPage() {
  useTitle(useT()(HANDWASH_TITLE));
  return <HandwashGame />;
}
