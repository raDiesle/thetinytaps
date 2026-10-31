import { type CSSProperties, type HTMLAttributes, type MouseEvent, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FullscreenButton } from "@/components/FullscreenButton";
import { Logo } from "@/components/Logo";
import { RoomGlobe, RoomHourglass, RoomSpeaker, RoomStickers } from "@/components/RoomOptions";
import { type WorldId, WorldCardScene } from "@/components/Worlds";
import { CATEGORIES, categoryHref, hasPage } from "@/content/games";
import { takeOutBook } from "@/lib/bookTravel";
import { type Localized, useT } from "@/lib/language";
import { preloadPage } from "@/lib/preloadPages";
import { BOOK_ASPECT, planShelf, type ShelfCell, type ShelfLayout, type ShelfRect, type ShelfThing } from "@/lib/shelfLayout";
import pictures from "./bilder/*.webp?glob";

/** The picture hanging on the wall where there is room: the fox family and the bear family reading together. */
const READING = pictures["buch-cover.webp"];

/** A book on the shelf: a category, opening on its page (its table of contents) or on its only game. */
interface ShelfBook {
  /** Its `data-book`, by which the way back finds its gap (`shelfBookOf` in bookTravel.ts). */
  id: string;
  href: string;
  world: WorldId;
  title: Localized;
  blurb: Localized;
  emoji: string;
  /** A category's games, shown on its cover as a collage. */
  games?: string[];
}

const BOOKS: ShelfBook[] = CATEGORIES.map((c) => ({
  id: c.id,
  href: categoryHref(c),
  world: c.id as WorldId,
  title: c.title,
  blurb: c.blurb,
  emoji: c.emoji,
  games: hasPage(c) ? c.games.map((g) => g.emoji) : undefined,
}));

/** The colours of the books standing with their spines out beside the picture books, only to fill the shelf. */
const SPINE_COLOURS = ["#b5523b", "#3f6f8f", "#d9a441", "#5d8a5a", "#8a5a8f", "#c77d4f", "#2f5d62", "#a8443f", "#6b7fb0", "#e0b85c"];

/** The eye's distance from the shelf and its height on it, as share of the shelf's (`perspective` in bookshelf.css). */
const EYE = 1200;
const EYE_HEIGHT = 0.36;

/** What stands in each of the grown-ups' compartments. */
const THINGS: Record<ShelfThing, () => ReactNode> = {
  music: () => <RoomSpeaker />,
  playtime: () => <RoomHourglass />,
  language: () => <RoomGlobe />,
  figure: () => <RoomStickers />,
};

/**
 * The home page in the book look: a room with a bookshelf, the first thing a visit sees. Each category is a picture
 * book standing in its middle compartments with its cover out, room round each; a tap takes it out and opens it
 * (bookTravel.ts). The grown-ups' options are things in the narrow compartments beside them (RoomOptions), and the
 * app's name is a painted sign standing on top. Drawn in 3D – each compartment a box going back, the boards seen from
 * the eye's height – but still: nothing moves until it is tapped. `children` follow below the first screen.
 */
export function Bookshelf({ secretProps, children }: { secretProps: HTMLAttributes<HTMLElement>; children?: ReactNode }) {
  const navigate = useNavigate();
  const room = useRef<HTMLDivElement>(null);
  const [plan, setPlan] = useState<{ layout: ShelfLayout; roomWidth: number } | null>(null);

  // The shelf's plan follows the room it has (the screen turned, the window resized).
  useLayoutEffect(() => {
    const box = room.current;
    if (!box) return;
    const measure = () => setPlan({ layout: planShelf(box.clientWidth, box.clientHeight, BOOKS.length), roomWidth: box.clientWidth });
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
        "--post": `${layout.frame.post}px`,
        "--crown": `${layout.frame.crown}px`,
        "--plinth": `${layout.frame.plinth}px`,
        width: `${layout.width}px`,
        height: `${layout.height}px`,
      } as CSSProperties)
    : undefined;

  return (
    <main className="room">
      <div className="room-scene">
        <div className="room-wall" aria-hidden />
        <div className="room-floor" aria-hidden />
        <div className="room-top">
          <FullscreenButton />
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
              {/* The app's name, painted on a sign standing on the shelf. */}
              <div className="shelf-sign">
                <Logo secretProps={secretProps} />
              </div>
              <div className="shelf-box">
                <span className="shelf-back" />
                {layout.cells.map((cell, i) => (
                  <Compartment key={i} cell={cell} layout={layout} seed={i * 5}>
                    {cell.books?.map((b) => (
                      <Book key={BOOKS[b].id} book={BOOKS[b]} onClick={take(BOOKS[b])} />
                    ))}
                  </Compartment>
                ))}
                {layout.planks.map((p, i) => (
                  <span key={i} className={`shelf-plank${p.w > p.h ? " board" : ""}`} style={rect(p)} />
                ))}
                <span className="shelf-post left" />
                <span className="shelf-post right" />
                <span className="shelf-crown" />
                <span className="shelf-plinth" />
              </div>
            </div>
          )}
        </div>
      </div>
      {children}
    </main>
  );
}

/** A rectangle of the shelf's plan as a style. */
const rect = (r: ShelfRect): CSSProperties => ({ left: r.x, top: r.y, width: r.w, height: r.h });

/**
 * A compartment of the shelf, a box going back from its opening: walls, the board's underside above and its top below,
 * the shadow inside. In it either picture books (`children`) with books spine out filling its ends, or a grown-up's thing.
 */
function Compartment({ cell, layout, seed, children }: { cell: ShelfCell; layout: ShelfLayout; seed: number; children?: ReactNode }) {
  // What is stuck on the back panel moves away from the eye by half of what the depth draws it towards the middle, so
  // it sits in the middle of the back that can be seen, not half behind the plank in front.
  const back = (layout.bookHeight * 0.62) / EYE / 2;
  const style = {
    ...rect(cell),
    "--cw": `${cell.w}px`,
    "--ch": `${cell.h}px`,
    "--sx": `${(cell.x + cell.w / 2 - layout.width / 2) * back}px`,
    "--sy": `${(cell.y + cell.h / 2 - layout.height * EYE_HEIGHT) * back}px`,
  } as CSSProperties;
  const ends = cell.books ? endsFor(cell, layout.bookHeight) : undefined;
  // The stack of books lying flat goes to one end, the left in one compartment, the right in the next.
  const stackLeft = seed % 2 === 0;
  return (
    <div className={`shelf-cell${cell.thing ? ` thing ${cell.thing}` : ""}`} style={style}>
      <span className="shelf-cell-shade" />
      <span className="shelf-wall left" />
      <span className="shelf-wall right" />
      <span className="shelf-cell-ceiling" />
      <span className="shelf-cell-floor" />
      {ends && (
        <div className="shelf-row">
          <span className="shelf-end">
            {ends.stack > 0 && stackLeft && <Stack seed={seed} />}
            <Spines count={stackLeft ? ends.spines - ends.stack : ends.spines} seed={seed} />
          </span>
          {children}
          <span className="shelf-end">
            <Spines count={stackLeft ? ends.spines : ends.spines - ends.stack} seed={seed + 3} />
            {ends.stack > 0 && !stackLeft && <Stack seed={seed + 1} />}
          </span>
        </div>
      )}
      {cell.thing === "figure" ? (
        // Stuck on the back wall.
        <div className="shelf-back-stuck">{THINGS.figure()}</div>
      ) : (
        cell.thing && <div className="shelf-thing">{THINGS[cell.thing]()}</div>
      )}
    </div>
  );
}

/**
 * How many books stand spine out at each end of a compartment of picture books, and whether a stack lies there too:
 * what the room beside the books leaves, keeping room round each picture book and more between them.
 */
function endsFor(cell: ShelfCell, bh: number) {
  const n = cell.books?.length ?? 0;
  const end = (cell.w - n * bh * BOOK_ASPECT - (n - 1) * bh * 0.5) / 2 - bh * 0.15;
  const spine = bh * 0.16 + 1;
  const spines = Math.max(0, Math.min(7, Math.floor(end / spine)));
  // A stack takes the room of this many spines, where there is room for it.
  const stack = end >= bh * 0.6 ? Math.ceil((bh * 0.62) / spine) : 0;
  return { spines, stack };
}

/** A few books standing with their spines out, only to fill the shelf: their colours and heights from `seed`. */
function Spines({ count, seed }: { count: number; seed: number }) {
  return (
    <span className="shelf-spines" aria-hidden>
      {Array.from({ length: Math.max(0, count) }, (_, i) => {
        const n = seed + i;
        const style = {
          "--c": SPINE_COLOURS[(n * 7) % SPINE_COLOURS.length],
          "--sh": `${[0.86, 0.94, 0.8, 0.98, 0.9, 0.84][n % 6]}`,
          "--sw": `${[0.16, 0.13, 0.19, 0.14, 0.17][n % 5]}`,
        } as CSSProperties;
        return (
          <span key={i} className={`shelf-spine${n % 4 === 1 ? " label" : ""}`} style={style}>
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

/** Two or three books lying flat on each other, as on a shelf that is used. */
function Stack({ seed }: { seed: number }) {
  return (
    <span className="shelf-stack" aria-hidden>
      {Array.from({ length: 2 + (seed % 2) }, (_, i) => {
        const n = seed + i * 3;
        const style = {
          "--c": SPINE_COLOURS[(n * 3 + 1) % SPINE_COLOURS.length],
          "--lw": `${[0.62, 0.56, 0.5][i]}`,
          "--lx": `${[0, 4, -3][i]}%`,
        } as CSSProperties;
        return (
          <span key={i} className="shelf-lying" style={style}>
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
      title={t(book.blurb)}
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
          {/* Each book shows a piece of its category's world. */}
          <WorldCardScene world={book.world} />
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
        <span className="shelf-book-blurb">{t(book.blurb)}</span>
      </span>
    </Link>
  );
}
