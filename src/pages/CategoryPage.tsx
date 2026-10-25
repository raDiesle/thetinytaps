import { Link, Navigate, useParams } from "react-router";
import { FullscreenCorner } from "@/components/FullscreenButton";
import { GameCard } from "@/components/GameCard";
import { Sky } from "@/components/Sky";
import { CATEGORIES } from "@/content/games";
import { useFitGrid } from "@/lib/fitGrid";
import { useUpdateBetweenGames } from "@/lib/pwa";
import { useTitle } from "@/lib/title";

/** One category of the home menu with its games. */
export function CategoryPage() {
  const { category: id } = useParams();
  const category = CATEGORIES.find((c) => c.id === id);
  useTitle(category?.title);
  useUpdateBetweenGames();
  const grid = useFitGrid(category?.games.length ?? 0);
  if (!category) return <Navigate to="/" replace />;
  return (
    <main className="home">
      <Sky />
      <FullscreenCorner />
      <Link to="/" className="back-link">
        ← Alle Spiele
      </Link>
      <h1 className="menu-title">
        <span aria-hidden>{category.emoji}</span> {category.title}
      </h1>
      <p className="home-subtitle">{category.subtitle}</p>
      <ul ref={grid.ref} className={`game-list ${grid.className}`} style={grid.style}>
        {category.games.map((g) => (
          <li key={g.href}>
            <GameCard {...g} />
          </li>
        ))}
      </ul>
    </main>
  );
}
