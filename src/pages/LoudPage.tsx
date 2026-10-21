import { LoudGame } from "@/games/loud/LoudGame";
import { useTitle } from "@/lib/title";

export function LoudPage() {
  useTitle("Laut und leise");
  return <LoudGame />;
}
