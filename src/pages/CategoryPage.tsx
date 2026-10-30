import { Navigate, useParams } from "react-router";
import { GameCard } from "@/components/GameCard";
import { MenuHead } from "@/components/MenuTop";
import { Sky } from "@/components/Sky";
import { CATEGORIES, categoryHref, hasPage } from "@/content/games";
import { useFitGrid } from "@/lib/fitGrid";
import { useT } from "@/lib/language";
import { usePreloadPages } from "@/lib/preloadPages";
import { useUpdateBetweenGames } from "@/lib/pwa";
import { useTitle } from "@/lib/title";
import { SeoText } from "@/components/SeoText";

/** One category of the home menu with its games. */
export function CategoryPage() {
  const { category: id } = useParams();
  const category = CATEGORIES.find((c) => c.id === id);
  const t = useT();
  useTitle(category && t(category.title));
  useUpdateBetweenGames();
  usePreloadPages(category?.games.map((g) => g.href) ?? []);
  const grid = useFitGrid(category?.games.length ?? 0);
  if (!category) return <Navigate to="/" replace />;
  // An old address of a category that has only one game now.
  if (!hasPage(category)) return <Navigate to={categoryHref(category)} replace />;
  return (
    <main className="home">
      <Sky />
      <MenuHead
        to="/"
        back={t({ de: "Alle Spiele", ru: "Все игры", en: "All Games", zh: "全部游戏", hi: "सभी खेल", es: "Todos los juegos", ar: "كل الألعاب" })}
        title={
          <>
            <span aria-hidden>{category.emoji}</span> {t(category.title)}
          </>
        }
      />
      <ul ref={grid.ref} className={`game-list ${grid.className}`} style={grid.style} data-world={category.id}>
        {category.games.map((g) => (
          <li key={g.href}>
            <GameCard href={g.href} emoji={g.emoji} title={t(g.title)} blurb={t(g.blurb)} />
          </li>
        ))}
      </ul>
      <SeoText />
    </main>
  );
}
