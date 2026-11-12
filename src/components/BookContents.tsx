import type { CSSProperties } from "react";
import { Link } from "react-router";
import { CardPicture, UNFINISHED_LABEL } from "@/components/GameCard";
import { bookIdOf, type Game, gamePage } from "@/content/games";
import { useT } from "@/lib/language";
import { useTurnPage } from "@/lib/look";
import { canTestUnfinished } from "@/lib/localTest";
import { preloadPage } from "@/lib/preloadPages";
import previews from "./vorschau/*.webp?glob";

/**
 * A book's first page, laid out as a picture book's table of contents (user feedback, October 2026):
 * one line per game, its picture (a framed cut of the game, `vorschau/<book id>.webp`), its name, the dots leading to the page it is on. Each line is as tall as the page
 * allows (the lines share the room under the title), and the whole line is the tap: it turns the page to the game.
 * A game still being built but already in its book (`unfinished: "labelled"`) carries the page marker „in Bearbeitung“
 * and opens only where parts being built may be tested; elsewhere its line stands pale and does nothing.
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
  const labelled = game.unfinished === "labelled";
  const label = labelled && <span className="toc-badge">{t(UNFINISHED_LABEL)}</span>;
  const picture = <CardPicture className="toc-picture" emoji={game.emoji} picture={previews[`${bookIdOf(game.href)}.webp`]} />;
  const name = (
    <span className="toc-name">
      <span className="toc-title">{title}</span>
      <span className="toc-blurb">{t(game.blurb)}</span>
    </span>
  );
  if (labelled && !canTestUnfinished()) {
    return (
      <div className="toc-line toc-unfinished" aria-disabled aria-label={`${title} – ${t(UNFINISHED_LABEL)}`}>
        {picture}
        {name}
        <span className="toc-dots" aria-hidden />
        {label}
      </div>
    );
  }
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
      {picture}
      {name}
      <span className="toc-dots" aria-hidden />
      {label}
      <span className="toc-page" aria-hidden>
        {page}
      </span>
    </Link>
  );
}
