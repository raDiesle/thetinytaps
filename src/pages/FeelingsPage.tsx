import { FeelingsGame } from "@/games/feelings/FeelingsGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function FeelingsPage() {
  const t = useT();
  useTitle(t({ de: "Gefühle", ru: "Чувства", en: "Feelings", zh: "情绪", hi: "भावनाएँ", es: "Emociones", ar: "المشاعر" }));
  return <FeelingsGame />;
}
