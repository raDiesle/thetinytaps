import { type CSSProperties, type HTMLAttributes, type MouseEvent, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FullscreenButton } from "@/components/FullscreenButton";
import { InstallHint } from "@/components/InstallHint";
import { Logo } from "@/components/Logo";
import { RoomFigures, RoomHourglass, RoomSpeaker, RoomSwitch } from "@/components/RoomOptions";
import { type WorldId, WorldCardScene } from "@/components/Worlds";
import { CATEGORIES, categoryHref, hasPage } from "@/content/games";
import { takeOutBook } from "@/lib/bookTravel";
import { type Localized, useT } from "@/lib/language";
import { preloadPage } from "@/lib/preloadPages";
import { buildDate } from "@/lib/pwa";
import { BOOK_ASPECT, planShelf, type ShelfLayout } from "@/lib/shelfLayout";
import pictures from "./bilder/*.webp?glob";

/** The picture hanging on the wall where there is room: the fox family and the bear family reading together. */
const READING = pictures["buch-cover.webp"];

/** A book on the shelf: a category (its page, or its only game) or a game of „Weitere“, which stands there on its own. */
interface ShelfBook {
  /** Its `data-book`, by which the way back finds its gap (`shelfBookOf` in bookTravel.ts). */
  id: string;
  href: string;
  world: WorldId;
  title: Localized;
  blurb?: Localized;
  emoji: string;
  /** A category's games, shown on its cover as a collage. */
  games?: string[];
}

/** The categories behind a book of their own. */
const CARDS = CATEGORIES.filter((c) => !c.onHome);
/** The categories whose games are books of their own, together on a board named after them. */
const FRAMED = CATEGORIES.filter((c) => c.onHome);

const BOOKS: ShelfBook[] = [
  ...CARDS.map((c) => ({
    id: c.id,
    href: categoryHref(c),
    world: c.id as WorldId,
    title: c.title,
    blurb: c.blurb,
    emoji: c.emoji,
    games: hasPage(c) ? c.games.map((g) => g.emoji) : undefined,
  })),
  ...FRAMED.flatMap((c) => c.games.map((g) => ({ id: g.href, href: g.href, world: c.id as WorldId, title: g.title, blurb: g.blurb, emoji: g.emoji }))),
];
/** How many books each group has, each on a board (or two) of its own. */
const GROUPS = [CARDS.length, ...FRAMED.map((c) => c.games.length)];

/** The colours of the books standing with their spines out beside the picture books, only to fill the shelf. */
const SPINE_COLOURS = ["#b5523b", "#3f6f8f", "#d9a441", "#5d8a5a", "#8a5a8f", "#c77d4f", "#2f5d62", "#a8443f", "#6b7fb0", "#e0b85c"];

/**
 * The home page in the book look: a room with a bookshelf, the first thing a visit sees. Each category and each game
 * of „Weitere“ is a picture book standing on it with its cover out; a tap takes it out and opens it (bookTravel.ts).
 * Around the shelf the room's things are the options for grown-ups (RoomOptions). Drawn in 3D – the boards seen from
 * the eye's height, the walls inside going back – but still: nothing moves until it is tapped.
 */
export function Bookshelf({ secretProps }: { secretProps: HTMLAttributes<HTMLElement> }) {
  const t = useT();
  const navigate = useNavigate();
  const room = useRef<HTMLDivElement>(null);
  const [plan, setPlan] = useState<{ layout: ShelfLayout; roomWidth: number; height: number } | null>(null);

  // The shelf's plan follows the room it has (the screen turned, the window resized).
  useLayoutEffect(() => {
    const box = room.current;
    if (!box) return;
    const measure = () => setPlan({ layout: planShelf(box.clientWidth, box.clientHeight, GROUPS), roomWidth: box.clientWidth, height: box.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const take = (book: ShelfBook) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    takeOutBook(e.currentTarget, () => navigate(book.href));
  };

  const layout = plan?.layout;
  const margin = layout && plan ? (plan.roomWidth - layout.width) / 2 : 0;
  const style = layout
    ? ({
        "--bh": `${layout.bookHeight}px`,
        "--tier": `${layout.tierHeight}px`,
        "--gap": `${layout.gap}px`,
        "--post": `${layout.frame.post}px`,
        "--crown": `${layout.frame.crown}px`,
        "--board": `${layout.frame.board}px`,
        "--plinth": `${layout.frame.plinth}px`,
        width: `${layout.width}px`,
        height: `${plan?.height}px`,
      } as CSSProperties)
    : undefined;

  return (
    <main className="room">
      <div className="room-scene">
        <div className="room-wall" aria-hidden />
        <div className="room-floor" aria-hidden />
        <div className="room-top">
          <RoomSpeaker />
          <Logo secretProps={secretProps} />
          <div className="room-top-right">
            <RoomFigures />
            <FullscreenButton />
          </div>
        </div>
        {READING && margin > 200 && (
          <span
            className="room-picture"
            style={{ width: Math.min(margin - 60, 300), left: `calc(var(--side) + ${(margin - Math.min(margin - 60, 300)) / 2}px)` }}
            aria-hidden
          >
            <img src={READING} alt="" decoding="async" />
          </span>
        )}
        <div className="room-shelf-place" ref={room}>
          {layout && (
            <div className="shelf" style={style}>
              <div className="shelf-box">
                <span className="shelf-back" />
                <span className="shelf-side left" />
                <span className="shelf-side right" />
                <span className="shelf-ceiling" />
                {layout.rows.map((row, r) => {
                  const group = groupOf(row[0]);
                  const first = r === 0 || groupOf(layout.rows[r - 1][0]) !== group;
                  return (
                    <div key={row[0]} className="shelf-tier" style={{ top: layout.frame.crown + r * (layout.tierHeight + layout.frame.board) }}>
                      <div className="shelf-row">
                        <Spines count={spinesFor(layout, row.length)} seed={r * 3} />
                        {row.map((i) => (
                          <Book key={BOOKS[i].id} book={BOOKS[i]} onClick={take(BOOKS[i])} />
                        ))}
                        <Spines count={spinesFor(layout, row.length) + (r % 2)} seed={r * 3 + 5} />
                      </div>
                      <span className="shelf-board-top" />
                      <span className="shelf-board-under" />
                      <span className="shelf-board" />
                      {/* „Weitere“ is named once, on the edge of its first board, as a library labels its shelves. */}
                      {group && first && (
                        <span className="shelf-label">
                          <span aria-hidden>{group.emoji}</span> {t(group.title)}
                        </span>
                      )}
                    </div>
                  );
                })}
                <span className="shelf-post left" />
                <span className="shelf-post right" />
                <span className="shelf-crown" />
                <span className="shelf-plinth" />
              </div>
            </div>
          )}
          {/* Outside the shelf's 3D, where its menu can open over the whole room. */}
          {layout && (
            <div className="room-hourglass-place" style={{ "--at": `calc(50% - ${layout.width / 2 - layout.frame.post - 6}px)` } as CSSProperties}>
              <RoomHourglass />
            </div>
          )}
          <div className="room-switch-place" style={{ left: `calc(50% + ${(layout?.width ?? 0) / 2}px + 10px)` }}>
            <RoomSwitch />
          </div>
        </div>
      </div>
      <InstallHint />
      <p className="home-version">
        {t({ de: "Stand", ru: "Версия от", en: "Version", zh: "版本", hi: "संस्करण", es: "Versión", ar: "الإصدار" })} {buildDate()}
      </p>
    </main>
  );
}

/** The category on a board of its own a book belongs to („Weitere“), none for a category's own book. */
function groupOf(book: number) {
  let start = CARDS.length;
  for (const category of FRAMED) {
    if (book >= start && book < start + category.games.length) return category;
    start += category.games.length;
  }
  return undefined;
}

/** How many spines fit on each side of a board's picture books, to fill it as a real shelf is. */
function spinesFor(layout: ShelfLayout, books: number) {
  const free = layout.width - 2 * layout.frame.post - books * layout.bookHeight * BOOK_ASPECT - (books + 1) * layout.gap;
  return Math.max(0, Math.min(5, Math.floor(free / 2 / (layout.bookHeight * 0.17))));
}

/** A few books standing with their spines out, only to fill the shelf: their colours and heights from `seed`. */
function Spines({ count, seed }: { count: number; seed: number }) {
  return (
    <span className="shelf-spines" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const n = seed + i;
        const style = {
          "--c": SPINE_COLOURS[(n * 7) % SPINE_COLOURS.length],
          "--sh": `${[0.86, 0.94, 0.8, 0.98, 0.9, 0.84][n % 6]}`,
          "--sw": `${[0.16, 0.13, 0.19, 0.14, 0.17][n % 5]}`,
        } as CSSProperties;
        return (
          <span key={i} className="shelf-spine" style={style}>
            <span className="box-front" />
            <span className="box-left" />
            <span className="box-right" />
            <span className="box-top" />
          </span>
        );
      })}
    </span>
  );
}

/** A picture book standing on the shelf with its cover out: a box of cover, spine, pages' edge and top. */
function Book({ book, onClick }: { book: ShelfBook; onClick: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  const t = useT();
  const title = t(book.title);
  return (
    <Link
      to={book.href}
      className="shelf-book"
      data-book={book.id}
      data-world={book.world}
      data-tap
      aria-label={title}
      title={book.blurb && t(book.blurb)}
      // The page starts loading as the finger lands, not only once it is lifted.
      onPointerDown={() => preloadPage(book.href)}
      onClick={onClick}
    >
      <span className="shelf-book-shadow" />
      <span className="box-left" />
      <span className="box-right" />
      <span className="box-top" />
      <span className="shelf-book-cover">
        <span className="shelf-book-title">{title}</span>
        <span className="shelf-book-picture">
          {/* A category's book shows a piece of its world; „Weitere“'s games have none of their own. */}
          {book.world !== "weitere" && <WorldCardScene world={book.world} />}
          {book.games ? (
            <span className="shelf-book-collage" data-count={Math.min(book.games.length, 4)}>
              {book.games.slice(0, 4).map((e, i) => (
                <span key={i}>{e}</span>
              ))}
            </span>
          ) : (
            <span className="shelf-book-emoji">{book.emoji}</span>
          )}
        </span>
        {book.blurb && <span className="shelf-book-blurb">{t(book.blurb)}</span>}
      </span>
    </Link>
  );
}
