import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { type WorldId, WorldCardScene } from "@/components/Worlds";
import { CATEGORIES, categoryHref } from "@/content/games";
import { roomFor } from "@/lib/fitGrid";
import { useT } from "@/lib/language";
import { turnPageWith } from "@/lib/look";
import { preloadPage } from "@/lib/preloadPages";

/** A book's cover is this much as wide as it is tall: a picture book standing upright. */
const BOOK_ASPECT = 0.78;
/** How long a tapped book takes to come out of the shelf before the page turns into it; as `.shelf-book` in book.css. */
const PULL_MS = 350;
/** The biggest a book gets, however much room there is. */
const MAX_BOOK = 360;
/**
 * The board each row of books stands on, the bookcase's top and sides, and the room above the books' heads (a part
 * of their height); matches `.shelf-books` in book.css.
 */
const BOARD = 14;
const FRAME = 14;
const HEADROOM = 0.08;
/** The room between two books and at the shelf's sides, as a part of a book's width; matches `.shelf-books`. */
const BETWEEN = 0.34;

/** How the books stand: how many in a row, and how tall each is. */
interface ShelfFit {
  perRow: number;
  height: number;
}

/** The arrangement that gives the books the most room: all in one row, or in rows of fewer books one above the other. */
function bestShelf(count: number, width: number, height: number): ShelfFit {
  let best: ShelfFit = { perRow: count, height: 0 };
  for (let rows = 1; rows <= count; rows++) {
    const perRow = Math.ceil(count / rows);
    const byHeight = ((height - FRAME) / rows - BOARD) / (1 + HEADROOM);
    const byWidth = (width - 2 * FRAME) / (perRow + (perRow + 1) * BETWEEN) / BOOK_ASPECT;
    const size = Math.min(byHeight, byWidth, MAX_BOOK);
    if (size > best.height) best = { perRow, height: Math.floor(size) };
  }
  return best;
}

/**
 * The home page in the book look (D-20): a bookshelf with one picture book per category, its world on the cover and
 * its name on cover and spine. A tap pulls the book out and the page turns into it, its games standing inside on
 * pasted-in cards; a book of one game opens straight on that game. The books are as big as the screen allows.
 */
export function Bookshelf() {
  const t = useT();
  const [shelf, setShelf] = useState<HTMLElement | null>(null);
  const [fit, setFit] = useState<ShelfFit | null>(null);

  useEffect(() => {
    const page = shelf?.closest("main");
    if (!shelf || !page) return;
    const measure = () => {
      const next = bestShelf(CATEGORIES.length, shelf.clientWidth, roomFor(shelf, page));
      setFit((prev) => (prev?.perRow === next.perRow && prev.height === next.height ? prev : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(page);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [shelf]);

  const style = fit && ({ "--per-row": fit.perRow, "--book-h": `${fit.height}px`, "--book-w": `${fit.height * BOOK_ASPECT}px` } as CSSProperties);
  return (
    <nav ref={setShelf} className={`shelf${fit ? " fit" : ""}`} style={style || undefined} aria-label={t({ de: "Bücherregal" })}>
      <ul className="shelf-books">
        {CATEGORIES.map((c) => (
          <li key={c.id} data-world={c.id}>
            <ShelfBook href={categoryHref(c)} world={c.id as WorldId} emoji={c.emoji} title={t(c.title)} blurb={t(c.blurb)} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** One book on the shelf, its cover facing out and turned a little, so its spine shows on the left. */
function ShelfBook({ href, world, emoji, title, blurb }: { href: string; world: WorldId; emoji: string; title: string; blurb: string }) {
  const navigate = useNavigate();
  const [pulled, setPulled] = useState(false);
  const opening = useRef(false);
  return (
    <Link
      to={href}
      className={`shelf-book${pulled ? " pulled" : ""}`}
      data-tap
      aria-label={title}
      title={blurb}
      // The finger landing pulls the book out at once, and its page starts loading.
      onPointerDown={() => {
        preloadPage(href);
        setPulled(true);
      }}
      onPointerCancel={() => setPulled(false)}
      // Once it is out, the page turns into it; a second tap meanwhile changes nothing, a click for a new tab is left alone.
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        setPulled(true);
        if (opening.current) return;
        opening.current = true;
        setTimeout(() => turnPageWith("forward", () => navigate(href)), PULL_MS);
      }}
    >
      <span className="shelf-book-spine" aria-hidden>
        <span>{title}</span>
      </span>
      <span className="shelf-book-cover">
        <span className="shelf-book-picture" aria-hidden>
          <WorldCardScene world={world} />
          <span className="shelf-book-emoji">{emoji}</span>
        </span>
        <span className="shelf-book-title">{title}</span>
      </span>
    </Link>
  );
}
