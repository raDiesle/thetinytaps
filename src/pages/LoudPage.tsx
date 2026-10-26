import { LoudGame } from "@/games/loud/LoudGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function LoudPage() {
  useTitle(useT()({ de: "Laut und leise", ru: "Громко и тихо" }));
  return <LoudGame />;
}
