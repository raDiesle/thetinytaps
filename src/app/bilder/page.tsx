import type { Metadata } from "next";
import Link from "next/link";
import { GameCard } from "@/components/GameCard";
import { SCENES, UPCOMING_SCENES } from "@/games/scenes";

export const metadata: Metadata = {
  title: "Lebendige Bilder – The Tiny Taps",
};

export default function ScenesMenu() {
  return (
    <main className="home">
      <Link href="/" className="back-link">
        ← Alle Spiele
      </Link>
      <h1>
        <span aria-hidden>🖼️</span> Lebendige Bilder
      </h1>
      <p className="home-subtitle">Bild aussuchen – dann alles antippen und entdecken!</p>
      <ul className="game-list">
        {SCENES.map((s) => (
          <li key={s.id}>
            <GameCard href={`/bilder/${s.id}/`} emoji={s.emoji} title={s.title} text={s.description} />
          </li>
        ))}
        {UPCOMING_SCENES.map((s) => (
          <li key={s.title}>
            <GameCard emoji={s.emoji} title={s.title} />
          </li>
        ))}
      </ul>
    </main>
  );
}
