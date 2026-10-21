import { Link } from "react-router";
import { GameCard } from "@/components/GameCard";
import { SCENES, UPCOMING_SCENES } from "@/games/scenes";
import { useTitle } from "@/lib/title";

export function ScenesMenu() {
  useTitle("Lebendige Bilder");
  return (
    <main className="home">
      <Link to="/" className="back-link">
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
