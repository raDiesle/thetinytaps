import { LettersGame } from "@/games/letters/LettersGame";
import { useTitle } from "@/lib/title";

export function LettersPage() {
  useTitle("Buchstaben & Zahlen");
  return <LettersGame />;
}
