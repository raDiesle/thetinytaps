import type { CSSProperties } from "react";
import { Link } from "react-router";
import { CardPicture, UNFINISHED_LABEL } from "@/components/GameCard";
import { bookIdOf, type Game, gamePage } from "@/content/games";
import { useT } from "@/lib/language";
import { useTurnPage } from "@/lib/look";
import { useFigurePictures } from "@/lib/figurePictures";
import { canTestUnfinished } from "@/lib/localTest";
import { loadOnIntent } from "@/lib/preloadPages";
import previews from "./vorschau/*.webp?glob";
import girlPreviews from "./vorschau-maedchen/*.webp?glob";

/**
 * A book's first page, laid out as a picture book's table of contents (user feedback, October 2026):
 * one line per game, its picture (a framed cut of the game, `vorschau/<book id>.webp`), its name, the dots leading to the
 * page it is on. The lines stand side by side in columns (`contentsGrid`) and share the room under the title, so each is
 * tall and its picture big, and the whole line is the tap: it turns the page to the game.
 * A game still being built but already in its book (`unfinished: "labelled"`) carries the page marker „in Bearbeitung“
 * and opens only where parts being built may be tested; elsewhere its line stands pale and does nothing.
 */
export function BookContents({ games, world }: { games: Game[]; world: string }) {
  const { cols, rows } = contentsGrid(games.length);
  return (
    <ol
      className="toc"
      data-world={world}
      style={{ "--toc-cols": cols, "--toc-rows": rows, "--toc-upright-rows": Math.ceil(games.length / 2) } as CSSProperties}
    >
      {games.map((g, i) => (
        <li key={g.href}>
          <ContentsLine game={g} page={gamePage(i)} />
        </li>
      ))}
    </ol>
  );
}

/**
 * How the lines of a table of contents are laid out on a wide screen: side by side in columns, never one long column
 * of flat lines, so each line is tall and its picture big (user request, November 2026: the pictures were far too
 * small). Up to three games stand in one row, more in two rows (an upright screen takes two columns, see `book.css`).
 */
export function contentsGrid(count: number): { cols: number; rows: number } {
  const cols = count <= 3 ? Math.max(count, 1) : Math.ceil(count / 2);
  return { cols, rows: Math.ceil(count / cols) };
}

/** One line of the table of contents. */
function ContentsLine({ game, page }: { game: Game; page: number }) {
  const t = useT();
  const turnPage = useTurnPage(game.href, "forward");
  const title = t(game.title);
  const labelled = game.unfinished === "labelled";
  const pictures = useFigurePictures(previews, girlPreviews);
  const label = labelled && <span className="toc-badge">{t(UNFINISHED_LABEL)}</span>;
  const picture = <CardPicture className="toc-picture" emoji={game.emoji} picture={pictures[`${bookIdOf(game.href)}.webp`]} />;
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
      // The page starts loading as the finger lands or a mouse comes over it, not only once the tap is done.
      {...loadOnIntent(game.href)}
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
