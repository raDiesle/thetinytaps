import { Navigate, useParams } from "react-router";
import { BookContents } from "@/components/BookContents";
import { MenuHead } from "@/components/MenuTop";
import { Sky } from "@/components/Sky";
import { CATEGORIES, categoryHref, hasPage, listedGames } from "@/content/games";
import { useT } from "@/lib/language";
import { usePreloadPages } from "@/lib/preloadPages";
import { useUpdateBetweenGames } from "@/lib/pwa";
import { useTitle } from "@/lib/title";
import { SeoText } from "@/components/SeoText";

/**
 * One book of the home page's shelf, opened: its first page is the table of contents (BookContents), each game on a page
 * of its own.
 */
export function CategoryPage() {
  const { category: id } = useParams();
  const category = CATEGORIES.find((c) => c.id === id);
  const t = useT();
  useTitle(category && t(category.title));
  useUpdateBetweenGames();
  usePreloadPages(category ? listedGames(category).map((g) => g.href) : []);
  if (!category) return <Navigate to="/" replace />;
  // An old address of a category that has only one game now.
  if (!hasPage(category)) return <Navigate to={categoryHref(category)} replace />;
  return (
    <main className="home" data-contents>
      <Sky />
      <MenuHead
        to="/"
        back={t({ de: "Alle Spiele", ru: "Все игры", en: "All Games", zh: "全部游戏", hi: "सभी खेल", es: "Todos los juegos", ar: "كل الألعاب" })}
        title={t(category.title)}
      />
      <BookContents games={listedGames(category)} world={category.id} />
      <SeoText />
    </main>
  );
}
