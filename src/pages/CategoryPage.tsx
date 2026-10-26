import { Link, Navigate, useParams } from "react-router";
import { FullscreenCorner } from "@/components/FullscreenButton";
import { GameCard } from "@/components/GameCard";
import { Sky } from "@/components/Sky";
import { CATEGORIES } from "@/content/games";
import { useFitGrid } from "@/lib/fitGrid";
import { useT } from "@/lib/language";
import { useUpdateBetweenGames } from "@/lib/pwa";
import { useTitle } from "@/lib/title";

/** One category of the home menu with its games. */
export function CategoryPage() {
  const { category: id } = useParams();
  const category = CATEGORIES.find((c) => c.id === id);
  const t = useT();
  useTitle(category && t(category.title));
  useUpdateBetweenGames();
  const grid = useFitGrid(category?.games.length ?? 0);
  if (!category) return <Navigate to="/" replace />;
  return (
    <main className="home">
      <Sky />
      <FullscreenCorner />
      <Link to="/" className="back-link">
        ← {t({ de: "Alle Spiele", ru: "Все игры" })}
      </Link>
      <h1 className="menu-title">
        <span aria-hidden>{category.emoji}</span> {t(category.title)}
      </h1>
      <p className="home-subtitle">{t(category.subtitle)}</p>
      <ul ref={grid.ref} className={`game-list ${grid.className}`} style={grid.style}>
        {category.games.map((g) => (
          <li key={g.href}>
            <GameCard href={g.href} emoji={g.emoji} title={t(g.title)} />
          </li>
        ))}
      </ul>
    </main>
  );
}
