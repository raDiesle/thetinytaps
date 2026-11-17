import { GameShell } from "@/components/GameShell";
import { type Localized, useT } from "@/lib/language";
import { PottyPlay } from "./PottyPlay";
import "./potty.css";

/** The game's name, on its start screen and in the browser tab. */
export const POTTY_TITLE: Localized = {
  de: "Aufs Töpfchen",
  en: "Potty Time",
  zh: "上小马桶",
  hi: "पॉटी का समय",
  es: "Al orinal",
  ar: "إلى النونية",
  ru: "На горшок",
};

export function PottyGame() {
  const t = useT();

  return (
    <GameShell
      title={t(POTTY_TITLE)}
      // Opened when the child has to go: the story starts at once, with no modes to pick (the star is its last step);
      // ✕ and „Menü“ go back to the shelf (GameShell), there is no start screen.
      startMode="story"
    >
      <PottyPlay />
    </GameShell>
  );
}
