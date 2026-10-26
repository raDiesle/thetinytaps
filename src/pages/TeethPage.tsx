import { TeethGame } from "@/games/teeth/TeethGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function TeethPage() {
  useTitle(useT()({ de: "Zähne putzen", ru: "Чистим зубы" }));
  return <TeethGame />;
}
