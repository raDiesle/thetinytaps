import type { CSSProperties } from "react";
import { Link } from "react-router";
import { type Game, gamePage } from "@/content/games";
import { useT } from "@/lib/language";
import { useTurnPage } from "@/lib/look";
import { preloadPage } from "@/lib/preloadPages";

/**
 * A book's first page in the book look, laid out as a picture book's table of contents (user feedback, October 2026):
 * one line per game, its picture, its name, the dots leading to the page it is on. Each line is as tall as the page
 * allows (the lines share the room under the title), and the whole line is the tap: it turns the page to the game.
 */
export function BookContents({ games, world }: { games: Game[]; world: string }) {
  return (
    <ol className="toc" data-world={world} style={{ "--toc-lines": games.length } as CSSProperties}>
      {games.map((g, i) => (
        <li key={g.href}>
          <ContentsLine game={g} page={gamePage(i)} />
        </li>
      ))}
    </ol>
  );
}

/** One line of the table of contents. */
function ContentsLine({ game, page }: { game: Game; page: number }) {
  const t = useT();
  const turnPage = useTurnPage(game.href, "forward");
  const title = t(game.title);
  return (
    <Link
      to={game.href}
      className="toc-line"
      data-tap
      aria-label={title}
      // The page starts loading as the finger lands, not only once it is lifted.
      onPointerDown={() => preloadPage(game.href)}
      onClick={turnPage}
    >
      <span className="toc-picture" aria-hidden>
        {game.emoji}
      </span>
      <span className="toc-name">
        <span className="toc-title">{title}</span>
        <span className="toc-blurb">{t(game.blurb)}</span>
      </span>
      <span className="toc-dots" aria-hidden />
      <span className="toc-page" aria-hidden>
        {page}
      </span>
    </Link>
  );
}
