import { Link, Navigate, useParams } from "react-router";
import { GameCard } from "@/components/GameCard";
import { Sky } from "@/components/Sky";
import { CATEGORIES } from "@/content/games";
import { useTitle } from "@/lib/title";

/** One category of the home menu with its games. */
export function CategoryPage() {
  const { category: id } = useParams();
  const category = CATEGORIES.find((c) => c.id === id);
  useTitle(category?.title);
  if (!category) return <Navigate to="/" replace />;
  return (
    <main className="home">
      <Sky />
      <Link to="/" className="back-link">
        ← Alle Spiele
      </Link>
      <h1 className="menu-title">
        <span aria-hidden>{category.emoji}</span> {category.title}
      </h1>
      <p className="home-subtitle">{category.subtitle}</p>
      <ul className="game-list">
        {category.games.map((g) => (
          <li key={g.href}>
            <GameCard {...g} />
          </li>
        ))}
      </ul>
    </main>
  );
}
