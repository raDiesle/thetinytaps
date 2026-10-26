import { ANIMALS_TITLE, AnimalsGame } from "@/games/animals/AnimalsGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function AnimalsPage() {
  const t = useT();
  useTitle(t(ANIMALS_TITLE));
  return <AnimalsGame />;
}
