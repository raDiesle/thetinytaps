import { GameShell } from "@/components/GameShell";
import { type Localized, useT } from "@/lib/language";
import { WeaningPlay } from "./WeaningPlay";
import "./weaning.css";

/** The game's name, on the shelf and in the browser tab. */
export const WEANING_TITLE: Localized = {
  de: "Abstillen",
  en: "Weaning",
  zh: "断奶",
  hi: "दूध छुड़ाना",
  es: "El destete",
  ar: "الفطام",
  ru: "Отлучение от груди",
};

export function WeaningGame() {
  const t = useT();
  return (
    <GameShell
      title={t(WEANING_TITLE)}
      // One story with nothing to choose before it: it starts at once, and ✕ and „Menü“ go back to the shelf.
      startMode="story"
    >
      <WeaningPlay />
    </GameShell>
  );
}
