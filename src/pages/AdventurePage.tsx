import { AdventureGame } from "@/games/adventure/AdventureGame";
import { useT } from "@/lib/language";
import { useTitle } from "@/lib/title";

export function AdventurePage() {
  const t = useT();
  useTitle(
    t({
      de: "Bewegungsabenteuer",
      ru: "Приключения в движении",
      en: "Move-Along Adventures",
      zh: "动起来大冒险",
      hi: "हिलो-डुलो रोमांच",
      es: "Aventuras en movimiento",
      ar: "مغامرات الحركة",
    }),
  );
  return <AdventureGame />;
}
