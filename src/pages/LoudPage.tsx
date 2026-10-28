import { LoudGame } from "@/games/loud/LoudGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function LoudPage() {
  useTitle(
    useT()({ de: "Laut und leise", ru: "Громко и тихо", en: "Loud and Quiet", zh: "大声和小声", hi: "ज़ोर से और धीरे", es: "Fuerte y suave", ar: "عالٍ وخافت" }),
  );
  return <LoudGame />;
}
