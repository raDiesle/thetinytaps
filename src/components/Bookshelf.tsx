import { type CSSProperties, type HTMLAttributes, type MouseEvent, type PointerEvent, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FullscreenButton } from "@/components/FullscreenButton";
import { Logo } from "@/components/Logo";
import { RoomFeedback, RoomGlobe, RoomHourglass, RoomNotes, RoomOffline, RoomSpeaker, RoomStickers } from "@/components/RoomOptions";
import { type WorldId, WorldCardScene } from "@/components/Worlds";
import { bookIdOf, CATEGORIES, hasPage, SHELF } from "@/content/games";
import { takeOutBook } from "@/lib/bookTravel";
import { type Localized, useT } from "@/lib/language";
import { preloadPage } from "@/lib/preloadPages";
import { playKnock } from "@/lib/sfx";
import { BOOK_ASPECT, BOOK_GAP, planShelf, type ShelfCell, type ShelfLayout, type ShelfRect, type ShelfThing } from "@/lib/shelfLayout";
import pictures from "./bilder/*.webp?glob";

/** The picture hanging on the wall where there is room: the fox family and the bear family reading together. */
const READING = pictures["buch-cover.webp"];

/**
 * A book on the shelf: a category, opening on its page (its table of contents) or on its only game, standing with its
 * cover out; or a game of a category whose games stand apart, standing with its spine out (`colour` its cloth).
 */
interface ShelfBook {
  /** Its `data-book`, by which the way back finds its gap (`shelfBookOf` in bookTravel.ts). */
  id: string;
  href: string;
  world: WorldId;
  title: Localized;
  blurb: Localized;
  emoji: string;
  /** The picture pasted on its cover (`bilder/cover-<category>.webp`); without one a piece of its world and its emoji. */
  cover?: string;
  /** A category's games, shown on its cover as a collage where it has no picture. */
  games?: string[];
  /** The cloth of a book standing spine out. */
  colour?: string;
  /** The small picture from its game on the label of a book standing spine out (`bilder/spine-<id>.webp`). */
  spine?: string;
  /** A game standing as several books tied together with a ribbon (`Game.volumes`): those books, spine out. */
  volumes?: ShelfBook[];
}

/** The cloths of the books standing spine out with a game's name, one after the other: bright, unlike the books only filling the shelf. */
const DAILY_COLOURS = ["#2f78a8", "#3f8a4a", "#b0457a", "#c77d4f", "#2f5d62"];

/** The gold cloth of the Belohnungstafel, with its gilded bands (`[data-gold]` in bookshelf.css). */
const GOLD = "#c8952c";

/**
 * The cloths of the books tied together, by address: the Belohnungstafel gold, the shelf's eye-catcher, wherever it
 * stands in the bundle; others take the next free colour.
 */
const VOLUME_COLOURS: Record<string, string> = { "/belohnungstafel/": GOLD, "/tagesplan/": "#7a4fa0", "/wie-lange-warten/": "#2f78a8" };

/** A volume's cloth: its own, or one of the books standing spine out. */
const volumeColour = (href: string, i: number) => VOLUME_COLOURS[href] ?? DAILY_COLOURS[i % DAILY_COLOURS.length];

/**
 * How wide each book spine out stands, in picture books' widths: wide enough for its name in one line, big enough to
 * read, and thick enough for a child's finger (user feedback, November 2026; six books once had 1.6 together, then
 * 0.27 each was still too thin to hit on a phone).
 */
const DAILY_SPINE = 0.38;

/**
 * The room a book leaning left needs at its foot where it rests against the tied books upright left of it, in picture
 * books' widths: without it the book leant into them and hid half its name (the book „Abstillen“, November 2026).
 */
const LEAN_ROOM = 0.13;

/** The words carved beside the everyday helpers: all of them, or only the first line where the room is small. */
interface Carving {
  /** How wide, in picture books' widths. */
  span: number;
  short: boolean;
  /** The least height of a picture book for them: below it they would be too small to read. */
  minBook: number;
}

/**
 * The carvings tried, the widest first: the first that leaves the books nearly as big is carved, and the last where
 * none does, since its „mehr …“ is the way to the texts for grown-ups.
 */
const CARVINGS: Carving[] = [
  { span: 1.4, short: false, minBook: 170 },
  { span: 1.3, short: false, minBook: 170 },
  { span: 1.25, short: true, minBook: 100 },
];

/** How much smaller the picture books may get for the carved words. */
const CARVING_SHRINK = 0.8;

/** The width of the place of the books spine out, in picture books' widths. */
const dailySpan = (carving: Carving | undefined) => DAILY_SPAN + (carving?.span ?? 0);

/** Each place's width in picture books' widths, for the shelf's plan. */
const spansFor = (carving: Carving | undefined) => PLACES.map((place) => (place[0].colour ? dailySpan(carving) : 1));

/**
 * The shelf's places, each standing where a picture book can: a picture book, or the books of a category whose games
 * stand apart, side by side with their spines out in the room of one picture book.
 */
const PLACES: ShelfBook[][] = [];
for (const entry of SHELF) {
  const c = entry.category;
  const last = PLACES.at(-1);
  const book: ShelfBook = {
    id: entry.id,
    href: entry.href,
    world: c.id as WorldId,
    title: entry.game?.title ?? c.title,
    blurb: entry.game?.blurb ?? c.blurb,
    emoji: entry.game?.emoji ?? c.emoji,
    cover: entry.game ? undefined : pictures[`cover-${c.id}.webp`],
    games: !entry.game && hasPage(c) ? c.games.map((g) => g.emoji) : undefined,
  };
  const volumes = entry.game?.volumes?.map(
    (v, i): ShelfBook => ({
      ...book,
      id: bookIdOf(v.href),
      href: v.href,
      title: v.title,
      emoji: v.emoji,
      colour: volumeColour(v.href, i),
      spine: pictures[`spine-${bookIdOf(v.href)}.webp`],
    }),
  );
  const daily = (n: number): ShelfBook => ({ ...book, colour: DAILY_COLOURS[n % DAILY_COLOURS.length], spine: pictures[`spine-${book.id}.webp`], volumes });
  if (!entry.game) PLACES.push([book]);
  else if (last?.[0].colour && last[0].world === book.world) last.push(daily(last.filter((b) => !b.volumes).length));
  else PLACES.push([daily(0)]);
}

/**
 * How wide the books spine out stand together, in picture books' widths: each book's and each tied volume's width, and
 * the room at the foot of a book leaning against the tied books. A new everyday helper widens it, never squeezes the rest.
 */
const DAILY_SPAN = (() => {
  const books = PLACES.find((place) => place[0].colour) ?? [];
  const spines = books.reduce((n, book) => n + (book.volumes?.length ?? 1), 0);
  const leaning = books.filter((book, i) => !book.volumes && books[i - 1]?.volumes).length;
  return spines * DAILY_SPINE + leaning * LEAN_ROOM;
})();

/**
 * The colours of the books standing with their spines out beside the picture books, only to fill the shelf: dusty and
 * dim, so that they are plainly not what is there to be taken – the books that open something are bright, labelled
 * and glowing (user feedback, November 2026).
 */
const SPINE_COLOURS = ["#5e4f44", "#475057", "#685e4b", "#515647", "#594c51", "#464750", "#645649", "#4d5450", "#5c574d", "#504a43"];

/**
 * The sign with the app's name hanging in front of a wide shelf: its letters' size for the room's height, and its
 * board's width and height in those (the name, the sign's padding and frame; the foxes on its o rise 0.4 above it).
 */
const SIGN_SIZE = 0.09;
const SIGN_EMS = 7.8;
const SIGN_BOARD = 1.5;
/** How far the foxes on its o rise above its board, in its letters' size. */
const SIGN_FOXES = 0.4;

/**
 * The least height of the shelf's legs, for the room's: the bottom's middle where browsers note how to leave
 * fullscreen; and in px, so the sign „Offline spielen“ hanging between them under the globe can be read and tapped.
 */
const LEGS = 0.1;
const MIN_LEGS = 46;

/** The eye's distance from the shelf and its height on it, as share of the shelf's (`perspective` in bookshelf.css). */
const EYE = 1300;
const EYE_HEIGHT = 0.36;
/** How deep the shelf is, in book heights (`--d` in bookshelf.css). */
const DEPTH = 0.56;

/**
 * A book only filling the shelf, tapped: it rocks on its board with a soft knock and stays where it is, so a child sees
 * the tap was felt even though this book opens nothing (user feedback, November 2026).
 */
function nudge(e: PointerEvent<HTMLElement>) {
  const book = (e.target as Element).closest<HTMLElement>(".shelf-spines > .shelf-spine, .shelf-lying");
  if (!book) return;
  book.classList.remove("nudged");
  // Read once so that the rocking starts again on a second tap while it still rocks.
  void book.offsetWidth;
  book.classList.add("nudged");
  book.addEventListener("animationend", () => book.classList.remove("nudged"), { once: true });
  playKnock(book.classList.contains("shelf-lying") ? 420 : 560);
}

/** What stands in each of the grown-ups' compartments (the stickers' has nothing on its board: they are on its side). */
const THINGS: Partial<Record<ShelfThing, () => ReactNode>> = {
  music: () => <RoomSpeaker />,
  playtime: () => <RoomHourglass />,
  language: () => <RoomGlobe />,
};

/**
 * The home page: a room with a bookshelf, the first thing a visit sees. Each category is a picture
 * book standing in its middle compartments with its cover out, room round each; a tap takes it out and opens it
 * (bookTravel.ts). The grown-ups' options are things in the narrow compartments beside them (RoomOptions), and the
 * app's name is a painted sign hanging on chains: in front of a wide shelf standing on legs, down into its top
 * compartment, above an upright one's. The fullscreen button is a small sign nailed onto the shelf's top right corner,
 * and „Offline spielen“ hangs under the shelf at its right, at the screen's bottom right on every screen (RoomOffline). Drawn in 3D – each compartment a box going back, the boards seen from
 * the eye's height – but still: nothing moves until it is tapped. The room fills the screen and nothing follows below it:
 * `legal` (Impressum, Datenschutz) stands small in its bottom right corner, „Feedback“ in its bottom left (RoomFeedback).
 */
export function Bookshelf({ secretProps, legal }: { secretProps: HTMLAttributes<HTMLElement>; legal?: ReactNode }) {
  const navigate = useNavigate();
  const room = useRef<HTMLDivElement>(null);
  const [plan, setPlan] = useState<{ layout: ShelfLayout; roomWidth: number; carving?: Carving; spans: number[]; sign: number } | null>(null);

  // The shelf's plan follows the room it has (the screen turned, the window resized). The words carved beside the
  // everyday helpers' books come only where they leave the books nearly as big and can still be read.
  useLayoutEffect(() => {
    const box = room.current;
    if (!box) return;
    const measure = () => {
      const [width, height] = [box.clientWidth, box.clientHeight];
      // The screen's shape decides, not the room's: the room's height follows the plan (`data-plan` in bookshelf.css).
      const upright = window.innerWidth / window.innerHeight < 0.95;
      const sign = Math.min(64, Math.max(20, height * SIGN_SIZE));
      const options = {
        upright,
        sign: { width: sign * SIGN_EMS, height: sign * SIGN_BOARD, rise: sign * SIGN_FOXES },
        legs: Math.min(90, Math.max(MIN_LEGS, height * LEGS)),
      };
      const planFor = (carving: Carving | undefined) => planShelf(width, height, spansFor(carving), { ...options, carved: carving?.span ?? 0 });
      const plain = planFor(undefined);
      const carved = CARVINGS.map((carving) => ({ carving, layout: planFor(carving) })).find(
        ({ carving, layout }) => layout.bookHeight >= Math.max(carving.minBook, plain.bookHeight * CARVING_SHRINK),
      );
      const last = CARVINGS[CARVINGS.length - 1];
      const carving = carved?.carving ?? last;
      const layout = carved?.layout ?? planFor(last);
      setPlan({ layout, roomWidth: width, carving, spans: spansFor(carving), sign });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
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
        "--gap": BOOK_GAP,
        "--post": `${layout.frame.post}px`,
        "--crown": `${layout.frame.crown}px`,
        "--plinth": `${layout.frame.plinth}px`,
        ...(!layout.upright && { "--sign": `${plan?.sign}px` }),
        "--legs": `${layout.legs}px`,
        width: `${layout.width}px`,
        height: `${layout.height}px`,
      } as CSSProperties)
    : undefined;

  return (
    <main className="room">
      <div className="room-scene" data-plan={layout?.upright ? "upright" : "wide"}>
        <div className="room-wall" aria-hidden />
        <div className="room-floor" aria-hidden />
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
              {/* The app's name, painted on a sign: hanging in front of a wide shelf's top compartment, above an upright one's. */}
              <div className="shelf-sign" style={layout.sign && { left: layout.sign.x + layout.sign.w / 2, top: layout.sign.y + layout.sign.h }}>
                <Logo secretProps={secretProps} />
              </div>
              {/*
               * The fullscreen button, a little sign nailed onto the shelf's top right corner (user request, November
               * 2026): above the shelf it took a strip of the screen the books now have.
               */}
              <FullscreenButton className="shelf-fullscreen" />
              <div className="shelf-offline">
                <RoomOffline />
              </div>
              <div className="shelf-box" onPointerDown={nudge}>
                <span className="shelf-back" />
                {layout.cells.map((cell, i) => (
                  <Compartment key={i} cell={cell} layout={layout} spans={plan.spans} seed={i * 5} label={labelOf(cell, layout)}>
                    {cell.books?.map((b) =>
                      PLACES[b][0].colour ? (
                        <DailyGroup key={PLACES[b][0].id} books={PLACES[b]} carving={plan.carving} take={take} />
                      ) : (
                        <Book key={PLACES[b][0].id} book={PLACES[b][0]} onClick={take(PLACES[b][0])} />
                      ),
                    )}
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
              {/*
               * Standing on four legs at its corners, none in the middle, so the bottom of the screen's middle, where the
               * browser shows how to leave fullscreen, holds nothing to tap, and „Offline spielen“ hangs between the right
               * ones. The back legs stand behind the front ones.
               */}
              <span className="shelf-legs" aria-hidden>
                <span className="back" />
                <span className="back" />
                <span />
                <span />
              </span>
            </div>
          )}
        </div>
        {legal && <nav className="room-legal">{legal}</nav>}
        <RoomFeedback />
      </div>
    </main>
  );
}

/**
 * The books of a category whose games stand apart, spines out side by side, marked as one group by a library's label
 * with its name clipped on the board's edge under them (chosen from four drafts, user decision, November 2026). A game
 * with several parts stands as its books tied together with a red ribbon (`BookBundle`): the Belohnungstafel's, right of
 * Aufs Töpfchen, bound in gold and glowing brightest, so it is what the eye finds first (user feedback, November 2026).
 * Beside them words carved into the shelf's back panel tell grown-ups in short who the shelf is for and that it is a
 * first step into the digital world taken together – never an advert for one of its games (user feedback, November
 * 2026) – and their „mehr …“ opens all the texts for grown-ups (RoomNotes).
 */
function DailyGroup({
  books,
  carving,
  take,
}: {
  books: ShelfBook[];
  carving?: Carving;
  take: (book: ShelfBook) => (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const t = useT();
  const name = t(CATEGORIES.find((c) => c.id === books[0].world)?.title ?? books[0].title);
  const span = dailySpan(carving);
  return (
    <span className="shelf-daily-row" style={{ "--span": span, "--books-span": DAILY_SPAN, "--lean-room": LEAN_ROOM } as CSSProperties}>
      <span className="shelf-daily-books">
        {books.map((book) =>
          book.volumes ? <BookBundle key={book.id} volumes={book.volumes} take={take} /> : <SpineBook key={book.id} book={book} onClick={take(book)} />,
        )}
        <span className="shelf-group-label">{name}</span>
      </span>
      {carving && (
        <span className="shelf-carving" data-short={carving.short || undefined}>
          {/* Kept whole, so a narrow carving never breaks it. */}
          <span className="shelf-carving-big">
            {t({
              de: "Für\u00a0Groß\u00a0&\u00a0Klein",
              ru: "Для\u00a0всей\u00a0семьи",
              en: "For\u00a0Big\u00a0&\u00a0Little",
              zh: "给大人和孩子",
              hi: "बड़ों\u00a0और\u00a0छोटों\u00a0के\u00a0लिए",
              es: "Grandes\u00a0y\u00a0chicos",
              ar: "للكبار\u00a0والصغار",
            })}
          </span>
          {!carving.short && (
            <>
              <span>
                {t({
                  de: "Der erste gemeinsame Schritt ins Digitale – mit Lernspielen und kleinen Helfern für den Tag.",
                  ru: "Первый шаг в цифровой мир вместе – развивающие игры и помощники на каждый день.",
                  en: "The first step into the digital world, taken together – with learning games and little helpers for the day.",
                  zh: "一起迈向数字世界的第一步——有益智游戏，也有日常小帮手。",
                  hi: "डिजिटल दुनिया में साथ मिलकर पहला क़दम – सीखने वाले खेलों और दिन भर के छोटे मददगारों के साथ।",
                  es: "El primer paso juntos al mundo digital, con juegos para aprender y pequeños ayudantes para el día.",
                  ar: "الخطوة الأولى معًا إلى العالم الرقمي – مع ألعاب تعليمية ومساعدين صغار لكل يوم.",
                })}
              </span>
            </>
          )}
          <RoomNotes />
        </span>
      )}
    </span>
  );
}

/**
 * Books tied together with a red ribbon and a bow, each a part of one game with its own name on its spine
 * („Wie lange warten?“, Zeitplan, Belohnungstafel): the ribbon shows they belong together, and each opens its own part.
 * Tied, they are one block standing upright (leaning, they looked unnatural), and one ribbon runs round all of them – a band on each book looked like
 * three small ribbons (user feedback, November 2026). They stand on the board like the books beside them – a box round
 * them looked as if it floated (user feedback, November 2026).
 */
function BookBundle({ volumes, take }: { volumes: ShelfBook[]; take: (book: ShelfBook) => (e: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <span className="shelf-bundle" style={{ "--volumes": volumes.length } as CSSProperties}>
      {volumes.map((book) => (
        <SpineBook key={book.id} book={book} onClick={take(book)} />
      ))}
      {volumes.length > 1 && (
        <span className="shelf-bundle-ribbon" aria-hidden>
          <RibbonBow />
        </span>
      )}
    </span>
  );
}

/** The ribbon's bow, tied in the middle of a bundle's ribbon: two loops, a knot and two ends. */
function RibbonBow() {
  return (
    <svg className="shelf-bundle-bow" viewBox="0 0 40 32" aria-hidden>
      <path d="M20 16 L9 30 L13 31 L20 18 L27 31 L31 30 Z" fill="#8f1f24" />
      <path d="M20 16 C12 4 2 4 3 11 C4 18 12 19 20 16 Z" fill="#c8323a" stroke="#7a1a1f" strokeWidth="1.2" />
      <path d="M20 16 C28 4 38 4 37 11 C36 18 28 19 20 16 Z" fill="#c8323a" stroke="#7a1a1f" strokeWidth="1.2" />
      <path d="M9 9 C12 8 15 11 17 14 M31 9 C28 8 25 11 23 14" fill="none" stroke="#ffffff59" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="16.5" y="12.5" width="7" height="7" rx="2" fill="#b0262d" stroke="#7a1a1f" strokeWidth="1.2" />
    </svg>
  );
}

/** How much room the books spine out leave beside the wall with the stickers, in book heights. */
const STICKERS_ROOM = 0.45;

/** The name of the picture books' group (the everyday helpers' is their category's, `DailyGroup`). */
const LEARNING: Localized = {
  de: "Lernspiele",
  ru: "Развивающие игры",
  en: "Learning Games",
  zh: "益智游戏",
  hi: "सीखने के खेल",
  es: "Juegos para aprender",
  ar: "ألعاب تعليمية",
};

/**
 * The name on a wooden sign under a compartment's books: „Lernspiele“ where all the picture books stand together on
 * one board and nothing else does (user feedback, November 2026) – split over several boards there is no group to name.
 */
function labelOf(cell: ShelfCell, layout: ShelfLayout): Localized | undefined {
  const pictureBooks = (c: ShelfCell) => (c.books ?? []).filter((b) => !PLACES[b][0].colour).length;
  const all = layout.cells.reduce((sum, c) => sum + pictureBooks(c), 0);
  const own = pictureBooks(cell);
  return own > 0 && own === cell.books?.length && own === all ? LEARNING : undefined;
}

/** A rectangle of the shelf's plan as a style. */
const rect = (r: ShelfRect): CSSProperties => ({ left: r.x, top: r.y, width: r.w, height: r.h });

/**
 * A compartment of the shelf, a box going back from its opening: walls, the board's underside above and its top below,
 * the shadow inside. In it either picture books (`children`) with books spine out filling its ends, or a grown-up's thing.
 */
function Compartment({
  cell,
  layout,
  spans,
  seed,
  label,
  children,
}: {
  cell: ShelfCell;
  layout: ShelfLayout;
  spans: number[];
  seed: number;
  label?: Localized;
  children?: ReactNode;
}) {
  const t = useT();
  // What is stuck on the back panel moves away from the eye by half of what the depth draws it towards the middle, so
  // it sits in the middle of the back that can be seen, not half behind the plank in front.
  const back = (layout.bookHeight * DEPTH) / EYE / 2;
  const style = {
    ...rect(cell),
    "--cw": `${cell.w}px`,
    "--ch": `${cell.h}px`,
    "--sx": `${(cell.x + cell.w / 2 - layout.width / 2) * back}px`,
    "--sy": `${(cell.y + cell.h / 2 - layout.height * EYE_HEIGHT) * back}px`,
  } as CSSProperties;
  // The carved words move right to stand centred under the hanging sign, and the books spine out beside them make way –
  // a little less than the words move, as there was room between them already.
  const shift = cell.trail ? (layout.wordsShift ?? 0) : 0;
  const spinesShift = Math.max(0, shift - 0.1 * layout.bookHeight);
  const ends = cell.books ? endsFor(cell, layout.bookHeight, spans, spinesShift) : undefined;
  const things = cell.things ?? [];
  // The stack of books lying flat goes to one end, the left in one compartment, the right in the next – never to the
  // wall with the stickers, which it would hide.
  const stackLeft = seed % 2 === 0 || things.includes("figure");
  return (
    <div className={`shelf-cell${cell.books ? "" : ` thing ${things.join(" ")}`}`} style={style}>
      <span className="shelf-cell-shade" />
      {cell.books && <BooksLight cell={cell} bh={layout.bookHeight} spans={spans} />}
      <span className="shelf-wall left" />
      <span className="shelf-wall right" />
      <span className="shelf-cell-ceiling" />
      <span className="shelf-cell-floor" />
      {ends && (
        <div
          className="shelf-row"
          style={
            cell.trail ? ({ "--trail": `${cell.trail}px`, "--words-shift": `${shift}px`, "--spines-shift": `${spinesShift}px` } as CSSProperties) : undefined
          }
        >
          <span className="shelf-end">
            {ends.stack > 0 && stackLeft && <Stack seed={seed} />}
            <Spines count={stackLeft ? ends.left - ends.stack : ends.left} seed={seed} />
          </span>
          {children}
          <span className="shelf-end">
            <Spines count={stackLeft ? ends.right : ends.right - ends.stack} seed={seed + 3} />
            {ends.stack > 0 && !stackLeft && <Stack seed={seed + 1} />}
          </span>
        </div>
      )}
      {label && <span className="shelf-group-label shelf-board-label">{t(label)}</span>}
      {things.includes("figure") && (
        // The stickers of the child's figure, stuck on the compartment's right wall, and „Wer spielt?“ written small on
        // that wall right above the fox's head (user feedback, November 2026).
        <div className="shelf-side-stuck">
          <span className="shelf-figure-ask" aria-hidden>
            {t({ de: "Wer spielt?", ru: "Кто играет?", en: "Who’s playing?", zh: "谁来玩？", hi: "किसकी बारी?", es: "¿Quién juega?", ar: "من يلعب؟" })}
          </span>
          <RoomStickers />
        </div>
      )}
      {things.map(
        (thing) =>
          THINGS[thing] && (
            <div key={thing} className="shelf-thing">
              {THINGS[thing]?.()}
            </div>
          ),
      )}
    </div>
  );
}

/**
 * Warm light falling on the back panel behind the books of a compartment that can be taken, so the eye goes to them and
 * the books only filling the shelf stand in its shadow (user decision, November 2026). Still: it never moves.
 */
function BooksLight({ cell, bh, spans }: { cell: ShelfCell; bh: number; spans: number[] }) {
  const books = cell.books ?? [];
  const span = books.reduce((sum, b) => sum + spans[b], 0);
  const width = span * bh * BOOK_ASPECT + (books.length + 1) * BOOK_GAP * bh;
  const left = (cell.w - (cell.trail ?? 0) - width) / 2;
  return <span className="shelf-light" style={{ left, width }} />;
}

/**
 * How many books stand spine out at each end of a compartment of picture books, and whether a stack lies there too:
 * what the room beside the books leaves, the books standing together in the middle with `BOOK_GAP` round each. The
 * right end keeps room free beside the wall with the stickers, so they are seen.
 */
function endsFor(cell: ShelfCell, bh: number, spans: number[], shift: number) {
  const n = cell.books?.length ?? 0;
  const span = (cell.books ?? []).reduce((sum, b) => sum + spans[b], 0);
  const trail = cell.trail ?? 0;
  const end = (cell.w - trail - span * bh * BOOK_ASPECT - (n + 1) * BOOK_GAP * bh) / 2 - 2;
  // The widest spine's room, so that they never reach past the wall.
  const spine = bh * 0.17 + 1;
  const count = (room: number) => Math.max(0, Math.min(12, Math.floor(room / spine)));
  // A stack takes the room of this many spines, where there is room for it.
  const stack = end >= bh * 0.6 ? Math.ceil((bh * 0.62) / spine) : 0;
  // The room kept for the sign hanging in front is the right end's, filled with books spine out as well, less what the
  // carved words moved into (`ShelfLayout.wordsShift`).
  const wall = cell.things?.includes("figure") ? STICKERS_ROOM * bh : 0;
  return { left: count(end), right: count(end + trail - wall - shift), stack };
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
  return (
    <Link
      to={book.href}
      className="shelf-book"
      data-book={book.id}
      data-world={book.world}
      data-tap
      aria-label={t(book.title)}
      title={t(book.blurb)}
      // The page starts loading as the finger lands, not only once it is lifted.
      onPointerDown={() => preloadPage(book.href)}
      onClick={onClick}
    >
      <span className="shelf-book-shadow" />
      <BookFaces book={book} />
    </Link>
  );
}

/**
 * A game's own book, standing with its spine out and its name printed on a label along the spine, so grown-ups find it
 * like a book on a real shelf. It keeps the picture book it is hidden inside (`.shelf-daily-book`): taken out, that one
 * turns its cover out and opens (bookTravel.ts).
 */
function SpineBook({ book, onClick }: { book: ShelfBook; onClick: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  const t = useT();
  const style = { "--c": book.colour, "--w1": book.colour } as CSSProperties;
  return (
    <Link
      to={book.href}
      className="shelf-spine shelf-daily"
      style={style}
      data-book={book.id}
      data-world={book.world}
      data-gold={book.colour === GOLD ? "" : undefined}
      data-tap
      aria-label={t(book.title)}
      title={t(book.blurb)}
      onPointerDown={() => preloadPage(book.href)}
      onClick={onClick}
    >
      <span className="box-front">
        <SpineLabel title={t(book.title)} picture={book.spine} />
      </span>
      <span className="box-left" />
      <span className="box-right" />
      <span className="box-top" />
      <span className="shelf-daily-book" data-world={book.world} data-spine style={style} hidden>
        <BookFaces book={book} spine />
      </span>
    </Link>
  );
}

/**
 * The paper label on the spine of a game's own book: a small picture from its game on top, so a child finds it at a
 * glance – never an emoji, the pictures look better (user feedback, November 2026) – its name running down below in one
 * line, never broken (user feedback, November 2026) – the longer the name, the smaller (`--len`).
 */
function SpineLabel({ title, picture }: { title: string; picture?: string }) {
  return (
    <span className="shelf-daily-label" style={{ "--len": [...title].length } as CSSProperties}>
      <img className="shelf-daily-picture" src={picture} alt="" decoding="async" draggable={false} />
      <span className="shelf-daily-title">{title}</span>
    </span>
  );
}

/**
 * A picture book's faces: spine, pages' edge, top, and the cover with its title, picture and line for grown-ups. A
 * game's own book (`spine`) has its name on its spine too, as it stood on the shelf.
 */
function BookFaces({ book, spine }: { book: ShelfBook; spine?: boolean }) {
  const t = useT();
  return (
    <>
      <span className="box-left">{spine && <SpineLabel title={t(book.title)} picture={book.spine} />}</span>
      <span className="box-right" />
      <span className="box-top" />
      <span className="shelf-book-cover">
        <span className="shelf-book-title">{t(book.title)}</span>
        <span className="shelf-book-picture">
          {book.cover ? (
            <img className="shelf-book-art" src={book.cover} alt="" decoding="async" draggable={false} />
          ) : (
            <>
              {/* Without a picture of its own, a book shows a piece of its category's world. */}
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
            </>
          )}
        </span>
        <span className="shelf-book-blurb">{t(book.blurb)}</span>
      </span>
    </>
  );
}
