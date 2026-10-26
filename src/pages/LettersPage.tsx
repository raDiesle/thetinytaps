import { LettersGame } from "@/games/letters/LettersGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function LettersPage() {
  const t = useT();
  useTitle(t({ de: "Buchstaben & Zahlen", ru: "Буквы и цифры" }));
  return <LettersGame />;
}
