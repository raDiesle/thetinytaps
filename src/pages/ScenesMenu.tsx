import { Link } from "react-router";
import { GameCard } from "@/components/GameCard";
import { Sky } from "@/components/Sky";
import { SCENES, UPCOMING_SCENES } from "@/games/scenes";
import { useFitGrid } from "@/lib/fitGrid";
import { useTitle } from "@/lib/title";

export function ScenesMenu() {
  useTitle("Lebendige Bilder");
  const grid = useFitGrid(SCENES.length + UPCOMING_SCENES.length);
  return (
    <main className="home">
      <Sky />
      <Link to="/" className="back-link">
        ← Alle Spiele
      </Link>
      <h1 className="menu-title">
        <span aria-hidden>🖼️</span> Lebendige Bilder
      </h1>
      <p className="home-subtitle">Bild aussuchen – dann alles antippen und entdecken!</p>
      <ul ref={grid.ref} className={`game-list ${grid.className}`} style={grid.style}>
        {SCENES.map((s) => (
          <li key={s.id}>
            <GameCard href={`/bilder/${s.id}/`} emoji={s.emoji} title={s.title} />
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
