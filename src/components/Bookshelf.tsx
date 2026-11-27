import {
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type RefObject,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate } from "react-router";
import { FullscreenButton } from "@/components/FullscreenButton";
import { Logo } from "@/components/Logo";
import { RoomFeedback, RoomGlobe, RoomHourglass, RoomNotes, RoomOffline, RoomSpeaker, RoomStickers } from "@/components/RoomOptions";
import { TrophySign } from "@/components/TrophySign";
import { type WorldId, WorldCardScene } from "@/components/Worlds";
import { bookIdOf, CATEGORIES, calendarHref, hasPage, SHELF, shelfVolumes } from "@/content/games";
import { OPEN_EDITOR } from "@/games/rewards/openEditor";
import { takeOutBook } from "@/lib/bookTravel";
import { type EnglishFirst, type Localized, type Texts, useAppLanguage, useT } from "@/lib/language";
import { LEARNING_GAMES } from "@/lib/sharedTexts";
import { loadOnIntent, pageCodeSoon } from "@/lib/preloadPages";
import { playChimeNote, playKnock } from "@/lib/sfx";
import {
  BOOK_ASPECT,
  BOOK_GAP,
  DAILY_TALL,
  LEAN_CLEAR,
  planShelf,
  type ShelfCell,
  type ShelfLayout,
  type ShelfRect,
  type ShelfThing,
  TOY_SPAN,
  railUnder,
} from "@/lib/shelfLayout";
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
  title: Texts;
  blurb: Texts;
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
  /** A game standing as one ring-bound desk calendar (`Game.calendar`, `ShelfCalendar`) instead of its volumes' books. */
  calendar?: boolean;
  /** What the page it opens is told (`navigate`'s state): the calendar opens the Zeitplan right in its editor. */
  state?: unknown;
  /** A toy standing on the board instead of a book (`Category.toy`), narrower than a picture book (`TOY_SPAN`). */
  toy?: "poster";
  /** The picture on a toy's poster (`bilder/plakat-<category>.webp`, made by `bun run previews`). */
  poster?: string;
}

/** The cloths of the books standing spine out with a game's name, one after the other: bright, unlike the books only filling the shelf. */
const DAILY_COLOURS = ["#2f78a8", "#3f8a4a", "#b0457a", "#c77d4f", "#2f5d62"];

/**
 * How wide each book spine out stands, in picture books' widths: wide enough for its name in one line, big enough to
 * read, and thick enough for a child's finger (user feedback, November 2026; six books once had 1.6 together, then
 * 0.27 each was still too thin to hit on a phone).
 */
const DAILY_SPINE = 0.38;

/**
 * How wide the ring calendar stands among the books spine out, in their widths (`Game.calendar`): as wide as the three
 * books tied together it replaced (user request, 26 November 2026), so its picture of a day's plan can be made out.
 */
const CALENDAR_SPINES = 3;

/**
 * The room a book leaning left needs at its foot where it rests against the tied books upright left of it, in picture
 * books' widths: without it the book leant into them and hid half its name (the book „Abstillen“, November 2026).
 */
const LEAN_ROOM = 0.13;

/**
 * The place of the words carved before the everyday helpers. Their sentence below the first line comes wherever it fits
 * (measured in the page, `DailyGroup`): a phone on its side has room for it under the sign too, and showed only „Für
 * Groß & Klein“ with empty room below it (user feedback, November 2026).
 */
interface Carving {
  /** How wide, in picture books' widths. */
  span: number;
  /** A narrow place, where the words stand a little smaller and closer to its sides. */
  narrow: boolean;
  /** The least height of a picture book for them: below it they would be too small to read. */
  minBook: number;
}

/**
 * The carvings tried, the widest first: the first that leaves the books nearly as big is carved, and the last where
 * none does, since its „mehr …“ is the way to the texts for grown-ups.
 */
const CARVINGS: Carving[] = [
  { span: 1.4, narrow: false, minBook: 170 },
  { span: 1.3, narrow: false, minBook: 170 },
  { span: 1.25, narrow: true, minBook: 100 },
].map((carving) => ({ ...carving, span: carving.span + LEAN_CLEAR / BOOK_ASPECT }));

/** How much smaller the picture books may get for the carved words. */
const CARVING_SHRINK = 0.8;

/** The width of the place of the books spine out, in picture books' widths. */
const dailySpan = (carving: Carving | undefined) => DAILY_SPAN + (carving?.span ?? 0);

/** Each place's width in picture books' widths, for the shelf's plan. */
const spansFor = (carving: Carving | undefined) => PLACES.map((place) => (place[0].colour ? dailySpan(carving) : place[0].toy ? TOY_SPAN : 1));

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
    toy: c.toy,
    poster: c.toy ? pictures[`plakat-${c.id}.webp`] : undefined,
  };
  const volumes = (entry.game && shelfVolumes(entry.game))?.map(
    (v, i): ShelfBook => ({
      ...book,
      id: bookIdOf(v.href),
      href: v.href,
      title: v.title,
      emoji: v.emoji,
      colour: DAILY_COLOURS[i % DAILY_COLOURS.length],
      spine: pictures[`spine-${bookIdOf(v.href)}.webp`],
    }),
  );
  const calendar = entry.game?.calendar ? { href: calendarHref(entry.game), calendar: true, state: OPEN_EDITOR } : undefined;
  const daily = (n: number): ShelfBook => ({
    ...book,
    colour: DAILY_COLOURS[n % DAILY_COLOURS.length],
    spine: pictures[`spine-${book.id}.webp`],
    volumes,
    ...calendar,
  });
  if (!entry.game) PLACES.push([book]);
  else if (last?.[0].colour && last[0].world === book.world) last.push(daily(last.filter((b) => !b.volumes && !b.calendar).length));
  else PLACES.push([daily(0)]);
}

/**
 * How wide the books spine out stand together, in picture books' widths: each book's and each tied volume's width, and
 * the room at the foot of a book leaning against the tied books. A new everyday helper widens it, never squeezes the rest.
 */
const DAILY_SPAN = (() => {
  const books = PLACES.find((place) => place[0].colour) ?? [];
  const spines = books.reduce((n, book) => n + (book.volumes?.length ?? (book.calendar ? CALENDAR_SPINES : 1)), 0);
  const upright = (book?: ShelfBook) => Boolean(book?.volumes || book?.calendar);
  const leaning = books.filter((book, i) => !upright(book) && upright(books[i - 1])).length;
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
 * board's width and height in those (the name, the sign's padding and frame; the foxes on its o rise 0.4 above it). The
 * board measures 6.9 of them in the page: a wider guess took the books' room beside it (November 2026).
 */
const SIGN_SIZE = 0.09;
const SIGN_EMS = 7.1;
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

/** „Wer spielt?“, written beside the stickers of the child's figure. */
const WHO_PLAYS: Localized = {
  de: "Wer spielt?",
  ru: "Кто играет?",
  en: "Who’s playing?",
  zh: "谁来玩？",
  hi: "किसकी बारी?",
  es: "¿Quién juega?",
  ar: "من يلعب؟",
};

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

  // The shelf's plan follows the room it has (the screen turned, the window resized). The words carved before the
  // everyday helpers' books come only where they leave the books nearly as big and can still be read.
  useLayoutEffect(() => {
    const box = room.current;
    if (!box) return;
    // The inputs the plan was made from: the same again (the room's own resize after the plan changed its height, the
    // window's resize event after the observer's) plans nothing anew, so the 3D shelf is drawn once, not three times.
    let planned = "";
    const measure = () => {
      const [width, height] = [box.clientWidth, box.clientHeight];
      // The screen's shape decides, not the room's: the room's height follows the plan (`data-plan` in bookshelf.css).
      const upright = window.innerWidth / window.innerHeight < 0.95;
      const inputs = `${width}×${height}${upright ? " upright" : ""}`;
      if (inputs === planned) return;
      planned = inputs;
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
    takeOutBook(e.currentTarget, () => navigate(book.href, book.state === undefined ? undefined : { state: book.state }));
  };

  const layout = plan?.layout;
  const margin = layout && plan ? (plan.roomWidth - layout.width) / 2 : 0;
  const style = layout
    ? ({
        "--bh": `${layout.bookHeight}px`,
        "--gap": BOOK_GAP,
        "--lean-clear": LEAN_CLEAR,
        "--daily-tall": DAILY_TALL,
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
              {/*
               * The way to the trophy room: a wooden sign nailed into the bottom right corner of the picture books'
               * compartment, reaching left into it (user request, November 2026: the trophies standing on a board took
               * the books' room and sank into the wall, and a small sign above the loudspeaker was hardly seen).
               */}
              <TrophySign {...trophySignAt(layout)} />
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
                      ) : PLACES[b][0].toy ? (
                        <ShelfToy key={PLACES[b][0].id} book={PLACES[b][0]} />
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
 * with several parts stands as its books tied together with a red ribbon (`BookBundle`), or as one ring-bound calendar
 * (`ShelfCalendar`): the Belohnungstafel's, right of Aufs Töpfchen, glowing brightest, so it is what the eye finds first.
 * Before them words carved into the shelf's back panel tell grown-ups in short who the shelf is for and that it is a
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
  const { id: language } = useAppLanguage();
  const name = t(CATEGORIES.find((c) => c.id === books[0].world)?.title ?? books[0].title);
  const span = dailySpan(carving);
  const sentence = useRef<HTMLSpanElement>(null);

  // The sentence under „Für Groß & Klein“ comes wherever it fits whole – in height and in its longest word's width –
  // and is left out where it doesn't, never cut off or spilling over the board: what fits shows on the page, so it is
  // measured there (offsetHeight leaves the carving's 3D push out). Hiding it changes nothing of the carving's own size.
  // Measured again when the words change with the language, and the room with the carving.
  useLayoutEffect(() => {
    const words = sentence.current;
    const text = words?.parentElement;
    const box = text?.parentElement;
    if (!words || !text || !box) return;
    const fit = () => {
      words.hidden = false;
      const style = getComputedStyle(box);
      const room = box.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      const parts = [...text.children].filter((part): part is HTMLElement => part instanceof HTMLElement && part.offsetHeight > 0);
      const need = parts.reduce((sum, part) => sum + part.offsetHeight, 0) + (parseFloat(style.rowGap) || 0) * (parts.length - 1);
      words.hidden = need > room + 1 || words.scrollWidth > words.clientWidth + 1;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, [carving, language]);
  return (
    <span className="shelf-daily-row" style={{ "--span": span, "--books-span": DAILY_SPAN, "--lean-room": LEAN_ROOM } as CSSProperties}>
      {carving && (
        <span className="shelf-carving" data-narrow={carving.narrow || undefined}>
          {/* The words together, only as big as they are, so the light behind them stays on them. */}
          <span className="shelf-carving-text">
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
            <span className="shelf-carving-words" ref={sentence}>
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
            <RoomNotes />
          </span>
        </span>
      )}
      <span className="shelf-daily-books">
        {books.map((book) =>
          book.calendar ? (
            <ShelfCalendar key={book.id} book={book} onClick={take(book)} />
          ) : book.volumes ? (
            <BookBundle key={book.id} volumes={book.volumes} take={take} />
          ) : (
            <SpineBook key={book.id} book={book} onClick={take(book)} />
          ),
        )}
        <GroupSign name={name} />
      </span>
    </span>
  );
}

/**
 * Books tied together with a red ribbon and a bow, each a part of one game with its own name on its spine (the
 * Belohnungstafel's three until they became a calendar): the ribbon shows they belong together, and each opens its own part.
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

/**
 * The Belohnungstafel's calendar (user request, 26 November 2026: one thing instead of three books tied together): a
 * ring-bound desk calendar standing on the board as a tent – its pages leaning back on a cardboard stand behind them,
 * the two meeting in the rings on top like an upside-down V (user request, 26 November 2026: it should stand and look
 * 3D). Its page shows a day's plan under its name „Zeitplan & Belohnungstafel“, set big like the picture books'
 * titles, with a gear: two of the Tagesplan's pictures side by side and as big as the page allows on a sunny and a
 * sky-blue band filling the page, a small star at the middle of each picture's foot, and „Morning“ and „Afternoon“ small
 * in the middle between the two stars (user requests, 27 November 2026) – no reward, no plain white page (user request, 26 November 2026: small pictures on white paper with the reward
 * looked boring). Last on its board, it stands at the right wall, turned to face left into the room, its stand touching
 * the wall and its front page clear of the post
 * (user request, 27 November 2026). One tap takes it out and opens the Zeitplan in
 * its editor, whose quick access reaches the other two parts. Its page is the cover that swings open as it flies
 * (`.shelf-book-cover`, bookTravel.ts; the tent's other parts stay behind). Still, like everything on the shelf, and
 * glowing as the shelf's eye-catcher.
 */
function ShelfCalendar({ book, onClick }: { book: ShelfBook; onClick: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  const t = useT();
  const link = useRef<HTMLAnchorElement>(null);
  // Turned to face left, its stand swings out to the right by as much as the shelf's perspective makes of it, which
  // differs with every screen: so the room before the right wall is measured in the page, until the stand's right edge
  // meets the wall's inner face (`WALL_TOUCH`) – touching it, never cut off by the post (user request, 27 November 2026).
  // Measured again when the compartment changes size.
  useLayoutEffect(() => {
    const calendar = link.current;
    const cell = calendar?.closest<HTMLElement>(".shelf-cell");
    const wall = cell?.querySelector<HTMLElement>(".shelf-wall.right");
    const stand = calendar?.querySelector<HTMLElement>(".shelf-calendar-stand");
    if (!calendar || !cell || !wall || !stand) return;
    const fit = () => {
      // A few steps, since the room taken from the right moves the calendar's page and so its perspective too.
      for (let step = 0; step < 3; step++) {
        const scale = cell.getBoundingClientRect().width / cell.offsetWidth || 1;
        const face = wall.getBoundingClientRect();
        const over = (stand.getBoundingClientRect().right - (face.left + face.width * WALL_TOUCH)) / scale;
        if (Math.abs(over) < 0.5) break;
        const room = parseFloat(getComputedStyle(calendar).marginRight) || 0;
        calendar.style.setProperty("--wall-room", `${Math.max(0, room + over)}px`);
      }
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(cell);
    return () => observer.disconnect();
  }, []);
  return (
    <Link
      ref={link}
      to={book.href}
      state={book.state}
      className="shelf-calendar"
      style={{ "--spines": CALENDAR_SPINES } as CSSProperties}
      data-book={book.id}
      data-world={book.world}
      data-tap
      aria-label={t(book.title)}
      title={t(book.blurb)}
      {...loadOnIntent(book.href)}
      onClick={onClick}
    >
      <span className="shelf-calendar-shadow" aria-hidden />
      <span className="shelf-calendar-stand" aria-hidden>
        <span className="shelf-calendar-flipped" />
      </span>
      <span className="shelf-calendar-front">
        <span className="shelf-calendar-pages" aria-hidden />
        <span className="shelf-book-cover shelf-calendar-sheet">
          <CalendarRings />
          <span className="shelf-calendar-head" aria-hidden>
            <span className="shelf-calendar-title" style={{ "--len": longestWord(t(CALENDAR_TITLE)) } as CSSProperties}>
              {t(CALENDAR_TITLE)}
            </span>
            <CalendarGear />
          </span>
          <span className="shelf-calendar-day">
            {CALENDAR_PARTS.map((part) => (
              <span key={part.id} className="shelf-calendar-part" data-part={part.id} aria-hidden>
                <span className="shelf-calendar-label">{t(part.name)}</span>
                <span className="shelf-calendar-cards">
                  {part.cards.map((card) => (
                    <span key={card} className="shelf-calendar-card">
                      <img src={pictures[`kalender-${card}.webp`]} alt="" decoding="async" draggable={false} />
                      <CalendarStar />
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </span>
        </span>
      </span>
    </Link>
  );
}

/**
 * The calendar page's two parts of the day, each with its name and two of the Tagesplan's pictures in the day's order
 * (`bilder/kalender-<card>.webp`, copies of `src/games/rewards/bilder/`, cut to the figure and 240 px wide).
 */
const CALENDAR_PARTS: { id: string; name: EnglishFirst; cards: string[] }[] = [
  {
    id: "morning",
    name: { en: "Morning", de: "Vormittag", zh: "上午", hi: "सुबह", es: "Mañana", ar: "الصباح", ru: "Утро" },
    cards: ["fruehstueck", "zaehne"],
  },
  {
    id: "afternoon",
    name: { en: "Afternoon", de: "Nachmittag", zh: "下午", hi: "दोपहर", es: "Tarde", ar: "بعد الظهر", ru: "День" },
    cards: ["spielplatz", "malen"],
  },
];

/**
 * Where on the right wall's inner face, seen from the room, the calendar's stand ends: as a share of the face's width
 * from its back edge, so the stand, a little behind the page, meets the wall instead of going into it.
 */
const WALL_TOUCH = 0.3;

/**
 * The name on the calendar's red band: what its books were called before it (user request, 27 November 2026), the
 * Zeitplan first, since a tap opens its editor.
 */
const CALENDAR_TITLE: EnglishFirst = {
  en: "Schedule & Reward Chart",
  de: "Zeitplan & Belohnungstafel",
  zh: "时间表和奖励表",
  hi: "समय-सारणी और इनाम चार्ट",
  es: "Horario y tabla de premios",
  ar: "الجدول ولوحة المكافآت",
  ru: "Расписание и награды",
};

/** How many letters the longest word of a name has: what its size must fit into one line of the calendar's head. */
function longestWord(name: string): number {
  return Math.max(...name.split(/\s+/).map((word) => [...word].length));
}

/** A gear beside the calendar's name, in the band's cream: a tap on the calendar opens the editor to set it up. */
function CalendarGear() {
  const teeth = 8;
  return (
    <svg className="shelf-calendar-gear" viewBox="0 0 40 40" aria-hidden>
      <g fill="#fff6dc" stroke="#8f2a22" strokeWidth={1.2} strokeLinejoin="round">
        {Array.from({ length: teeth }, (_, i) => (
          <rect key={i} x={16.5} y={2.5} width={7} height={9} rx={1.6} transform={`rotate(${(i * 360) / teeth} 20 20)`} />
        ))}
        <circle cx={20} cy={20} r={12.5} />
      </g>
      <circle cx={20} cy={20} r={5} fill="#c23a30" stroke="#8f2a22" strokeWidth={1.2} />
    </svg>
  );
}

/**
 * The star a picture's step earned, as the Tagesplan gives one: a small golden star in a round field sitting in the
 * middle of the picture's bottom edge, half on it and half below it (user requests, 27 November 2026).
 */
function CalendarStar() {
  return (
    <svg className="shelf-calendar-star" viewBox="0 0 40 40" aria-hidden>
      <circle cx={20} cy={20} r={18} fill="#fff4cf" stroke="#d99a1c" strokeWidth={3} />
      <path
        d="M20 7.5 L23.7 15.6 L32.4 16.4 L25.8 22.2 L27.8 30.8 L20 26.3 L12.2 30.8 L14.2 22.2 L7.6 16.4 L16.3 15.6 Z"
        fill="#ffc531"
        stroke="#c07d0c"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path d="M17.2 14.4 L19.4 10.6" stroke="#fff6cf" strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  );
}

/** The calendar's metal rings through the punched holes along its top edge. */
function CalendarRings() {
  const rings = 7;
  return (
    <svg className="shelf-calendar-rings" viewBox="0 0 70 12" preserveAspectRatio="none" aria-hidden>
      {Array.from({ length: rings }, (_, i) => {
        const x = 5 + (i * 60) / (rings - 1);
        return (
          <g key={i}>
            <ellipse cx={x} cy={8.2} rx={1.6} ry={1.3} fill="#3b2c22" />
            <path d={`M${x - 1.1} 8.6 C${x - 1.6} 2.4 ${x + 1.6} 2.4 ${x + 1.1} 8.6`} fill="none" stroke="#5b5f66" strokeWidth={1.3} strokeLinecap="round" />
            <path d={`M${x - 0.7} 6 C${x - 0.6} 3.9 ${x + 0.3} 3.6 ${x + 0.6} 4.6`} fill="none" stroke="#e9edf2" strokeWidth={0.5} strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
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

/**
 * A group's sign: a brass rail along the board's front edge under all of its books, from the first to the last, with
 * its ends turned up round them, and the wooden sign with the group's name hanging big from the rail's middle – so it
 * is plain at a glance that the name stands for every book on that board (user feedback, November 2026: the small sign
 * alone was hardly seen, and not that it named all the books).
 */
function GroupSign({ name, board, style }: { name: string; board?: boolean; style?: CSSProperties }) {
  return (
    <span className={`shelf-group${board ? " board" : ""}`} style={style}>
      <span className="shelf-group-rail" />
      <span className="shelf-group-label">{name}</span>
    </span>
  );
}

/** The rail of a group's sign under a compartment's picture books, a toy among them left out (`railUnder`). */
function groupWidth(cell: ShelfCell, bh: number, spans: number[]): CSSProperties {
  return railUnder(cell, bh, spans, (b) => Boolean(PLACES[b][0].toy));
}

/**
 * The name on a wooden sign under a compartment's books: „Lernspiele“ where all the picture books stand together on
 * one board and nothing else does (user feedback, November 2026) – split over several boards there is no group to name.
 */
function labelOf(cell: ShelfCell, layout: ShelfLayout): Localized | undefined {
  const pictureBooks = (c: ShelfCell) => (c.books ?? []).filter((b) => !PLACES[b][0].colour).length;
  const all = layout.cells.reduce((sum, c) => sum + pictureBooks(c), 0);
  const own = pictureBooks(cell);
  return own > 0 && own === cell.books?.length && own === all ? LEARNING_GAMES : undefined;
}

/**
 * Where the trophy room's sign is nailed on: on a wide shelf in the top left corner of the speaker's compartment, the
 * bottom of the column at the right, its nails in the post and the board above (`left` and `top` their middles), so the speaker below it at the right wall can be big again (user request, 26
 * November 2026: beside the speaker on its board both were small), sized by that narrow compartment (`size`, `from:
 * "top"`); on an upright shelf, whose things stand in small compartments on top, the bottom right corner of the lowest
 * compartment holding picture books, reaching left into it.
 */
function trophySignAt(layout: ShelfLayout): { left: number; top: number; size?: number; from?: "top" } {
  const speaker = layout.upright ? undefined : layout.cells.find((cell) => !cell.books && cell.things?.includes("music"));
  if (speaker) {
    // Its nails go on the wood (user feedback, 26 November 2026): the middles of the post at the compartment's left and
    // of the board above it, where its corner's nails are driven in.
    const post = layout.planks.find((p) => p.h > p.w && Math.abs(p.x + p.w - speaker.x) < 2 && p.y <= speaker.y && p.y + p.h >= speaker.y);
    const board = layout.planks.find((p) => p.w > p.h && Math.abs(p.y + p.h - speaker.y) < 2 && p.x <= speaker.x + 1 && p.x + p.w >= speaker.x + 1);
    return {
      left: post ? post.x + post.w / 2 : speaker.x,
      top: board ? board.y + board.h / 2 : speaker.y,
      size: Math.min(speaker.w * TROPHY_CORNER, speaker.h * 0.36),
      from: "top",
    };
  }
  const pictureBooks = layout.cells.filter((cell) => cell.books?.some((b) => !PLACES[b][0].colour));
  const cell = pictureBooks.sort((a, b) => b.y - a.y || b.x - a.x)[0] ?? layout.cells[layout.cells.length - 1];
  return { left: cell.x + cell.w, top: cell.y + cell.h };
}

/** The share of the speaker's compartment the trophy sign in its top left corner is wide. */
const TROPHY_CORNER = 0.42;

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
  // Each board's books as big as its own room allows (`ShelfCell.bh`), and all on it – the books spine out too – sized by them.
  const bh = cell.bh ?? layout.bookHeight;
  const style = {
    ...rect(cell),
    ...(cell.bh && { "--bh": `${cell.bh}px` }),
    // Under the sign hanging above them, the everyday helpers' books stand no higher than this.
    ...(cell.tall !== undefined && { "--tall": `${cell.tall}px` }),
    "--cw": `${cell.w}px`,
    "--ch": `${cell.h}px`,
    "--sx": `${(cell.x + cell.w / 2 - layout.width / 2) * back}px`,
    "--sy": `${(cell.y + cell.h / 2 - layout.height * EYE_HEIGHT) * back}px`,
  } as CSSProperties;
  // The carved words, and the sign over them on a wide shelf, begin the board at its far left where the everyday helpers
  // stand first on it (user request, November 2026: a visitor looks at the left first); the books follow at their right.
  const leads = cell.books?.[0] !== undefined && Boolean(PLACES[cell.books[0]][0].colour);
  const ends = cell.books ? endsFor(cell, bh, spans, leads) : undefined;
  const things = cell.things ?? [];
  // The stack of books lying flat goes to one end, the left in one compartment, the right in the next – never to the
  // wall with the stickers, which it would hide.
  const stackLeft = !leads && (seed % 2 === 0 || things.includes("figure"));
  return (
    <div className={`shelf-cell${cell.books ? "" : ` thing ${things.join(" ")}`}`} style={style}>
      <span className="shelf-cell-shade" />
      {cell.books && <BooksLight cell={cell} bh={bh} spans={spans} leads={leads} />}
      <span className="shelf-wall left" />
      <span className="shelf-wall right" />
      <span className="shelf-cell-ceiling" />
      <span className="shelf-cell-floor" />
      {ends && (
        <div
          className="shelf-row"
          data-leads={leads || undefined}
          style={
            cell.lead || cell.pull || ends.fills
              ? ({ "--lead": `${cell.lead ?? 0}px`, "--pull": `${cell.pull ?? 0}px`, "--grow": `${ends.grow}px` } as CSSProperties)
              : undefined
          }
        >
          <span className="shelf-end">
            {ends.stack > 0 && stackLeft && <Stack seed={seed} />}
            <Spines count={stackLeft ? ends.left - ends.stack : ends.left} seed={seed} />
          </span>
          {children}
          {!ends.fills && (
            <span className="shelf-end">
              <Spines count={stackLeft ? ends.right : ends.right - ends.stack} seed={seed + 3} />
              {ends.stack > 0 && !stackLeft && <Stack seed={seed + 1} />}
            </span>
          )}
        </div>
      )}
      {label && cell.books && <GroupSign name={t(label)} board style={groupWidth(cell, bh, spans)} />}
      {things.includes("figure") &&
        (layout.upright ? (
          // The stickers of the child's figure with „Wer spielt?“ written small right above them (user feedback,
          // November 2026), on an upright shelf on its compartment's right wall.
          <div className="shelf-side-stuck">
            <span className="shelf-figure-ask" aria-hidden>
              {t(WHO_PLAYS)}
            </span>
            <RoomStickers />
          </div>
        ) : (
          // On a wide shelf in a compartment of their own in the right column under the hourglass: the two heads one
          // above the other on its back panel, whole, and „Wer spielt?“ running down its right wall, the face seen
          // most of in that narrow compartment (user request, 26 November 2026: over the heads side by side the words
          // and the heads were cut off).
          <>
            <div className="shelf-side-stuck shelf-ask-wall">
              <span className="shelf-figure-ask" aria-hidden>
                {t(WHO_PLAYS)}
              </span>
            </div>
            <div className="shelf-back-stuck">
              <RoomStickers />
            </div>
          </>
        ))}
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
 * the books only filling the shelf stand in its shadow (user decision, November 2026). Where the sign and the carved
 * words begin the board (`leads`), it starts right of the words: their own brighter light lies close round them
 * (`.shelf-carving-text`), never over the whole compartment up to its post. Still: it never moves.
 */
function BooksLight({ cell, bh, spans, leads }: { cell: ShelfCell; bh: number; spans: number[]; leads: boolean }) {
  const books = cell.books ?? [];
  const span = books.reduce((sum, b) => sum + spans[b], 0);
  const width = span * bh * BOOK_ASPECT + (books.length + 1) * BOOK_GAP * bh + (cell.lead ?? 0);
  if (!leads) return <span className="shelf-light" style={{ left: (cell.w - width) / 2, width }} />;
  const words = BOOK_GAP * bh + spans[books[0]] * bh * BOOK_ASPECT - DAILY_SPAN * bh * BOOK_ASPECT + (cell.lead ?? 0);
  return <span className="shelf-light" style={{ left: 2 + words, width: width - words }} />;
}

/**
 * How many books stand spine out at each end of a compartment of picture books, and whether a stack lies there too:
 * what the room beside the books leaves, the books standing together in the middle with `BOOK_GAP` round each – or,
 * where the carved words and the sign begin the board at its far left (`leads`), all of it at the right end – or, where
 * the ring calendar ends that board, none: it grows by that room (`grow`, `--grow`) up to the right wall.
 */
function endsFor(cell: ShelfCell, bh: number, spans: number[], leads: boolean) {
  const n = cell.books?.length ?? 0;
  const span = (cell.books ?? []).reduce((sum, b) => sum + spans[b], 0);
  const free = cell.w - (cell.lead ?? 0) - span * bh * BOOK_ASPECT - (n + 1) * BOOK_GAP * bh - 4;
  // The everyday helpers alone on their board end with the ring calendar: it takes all the room up to the right wall –
  // the gap before the right end too, which is left out (`fills`) –, so none is given to books only filling the shelf
  // (user request, 27 November 2026).
  if (leads && n === 1 && PLACES[cell.books?.[0] ?? 0].at(-1)?.calendar) {
    return { left: 0, right: 0, stack: 0, grow: Math.max(0, free + BOOK_GAP * bh), fills: true };
  }
  const end = leads ? 0 : free / 2;
  // The widest spine's room, so that they never reach past the wall.
  const spine = bh * 0.17 + 1;
  const count = (room: number) => Math.max(0, Math.min(24, Math.floor(room / spine)));
  // A stack takes the room of this many spines, where there is room for it.
  const stack = free - end >= bh * 0.6 ? Math.ceil((bh * 0.62) / spine) : 0;
  return { left: count(end), right: count(free - end), stack, grow: 0, fills: false };
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
      // The page starts loading as the finger lands or a mouse comes over it, not only once the tap is done.
      {...loadOnIntent(book.href)}
      onClick={onClick}
    >
      <span className="shelf-book-shadow" />
      <BookFaces book={book} />
    </Link>
  );
}

/** How long the poster is pressed back before its game opens, in ms (`.shelf-toy.pressed` in bookshelf-books.css). */
const TOY_PRESS_MS = 260;

/**
 * How wide the poster looks against its place (`TOY_SPAN`): a little into the gap on either side, as big as it can be
 * and still clear of the book beside it.
 */
const POSTER_REACH = 1.5;

/**
 * The clear room kept round the poster's paper on every side, as a part of its width: its tape reaches about 0.15 of it
 * past the corners, and a little more stays free to the boards above and below, the wall on the left and the book on
 * the right. With its foot on the board, the board's front hid its lower tape, and against the wall the wall hid its
 * left tape – both looked cut off (user feedback, 25 November 2026).
 */
const POSTER_MARGIN = 0.22;

/**
 * A toy's place on the board among the picture books instead of a book (`Category.toy`, user request, 24 November
 * 2026): a big poster from its game (`ToyPoster`), stuck flat onto the shelf's back panel in the middle between the
 * boards, clear of them, the wall and the book beside it, tape included (user feedback, 25 November 2026) – never leaning, never behind the book beside it, and nothing standing in front of it (a toy keyboard stood there first
 * and looked like a till; it was taken out, user feedback, 24 November 2026). A tap presses the poster with a knock and a
 * note, and its game opens – no book comes out, no page turns, and the way back simply comes to the shelf again.
 */
function ShelfToy({ book }: { book: ShelfBook }) {
  const t = useT();
  const navigate = useNavigate();
  const link = useRef<HTMLAnchorElement>(null);
  usePosterPlace(link);
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const toy = e.currentTarget;
    if (toy.classList.contains("pressed")) return;
    toy.classList.add("pressed");
    playKnock(560);
    playChimeNote(Math.floor(Math.random() * 8));
    // The game's code was asked for as the finger landed; the poster is pressed meanwhile, and it opens once both are done.
    const code = pageCodeSoon(book.href);
    window.setTimeout(() => void code.finally(() => navigate(book.href)), TOY_PRESS_MS);
  };
  return (
    <Link
      ref={link}
      to={book.href}
      className="shelf-toy"
      data-toy={book.toy}
      data-tap
      aria-label={t(book.title)}
      title={t(book.blurb)}
      {...loadOnIntent(book.href)}
      onClick={onClick}
    >
      <span className="shelf-poster-spot" />
      <ToyPoster title={t(book.title)} picture={book.poster} />
    </Link>
  );
}

/**
 * Keeps the poster on the back panel over its own place. The shelf's perspective draws everything on the panel towards
 * the middle of the shelf and makes it smaller, so a poster laid out in its place was seen behind the book beside it
 * (user feedback, 24 November 2026). `.shelf-poster-spot` is the place moved back onto the panel, unseen: measured
 * against the place itself (the link, standing in the row), it tells how far the panel moves and shrinks it there, and
 * the poster is moved back over its place and grown by that much (`--poster-x`, `--poster-k`) – but only as far as
 * it fits, tape and `POSTER_MARGIN` round it, into the compartment's panel as seen (`.shelf-cell-shade`, below the
 * board above's front edge, right of the wall) and left of the book beside it; it hangs in the middle between the
 * boards (`--poster-y`), clear of all of them (user feedback, 25 November 2026).
 */
function usePosterPlace(link: RefObject<HTMLAnchorElement | null>) {
  useLayoutEffect(() => {
    const place = link.current;
    const spot = place?.querySelector<HTMLElement>(".shelf-poster-spot");
    if (!place || !spot) return;
    const measure = () => {
      const seen = place.getBoundingClientRect();
      const back = spot.getBoundingClientRect();
      if (!back.width || !spot.offsetWidth) return;
      // How much one px moved on the panel is seen, and how far the panel's version of the place lies from the place.
      const shrink = back.width / spot.offsetWidth;
      // Seen on the screen: as wide as `POSTER_REACH` over the middle of its place, as long as that fits.
      const hw = back.height / back.width;
      let w = seen.width * POSTER_REACH;
      let cx = seen.left + seen.width / 2;
      let bottom = back.bottom;
      const cell = place.closest(".shelf-cell");
      const shade = cell?.querySelector(".shelf-cell-shade")?.getBoundingClientRect();
      if (cell && shade?.height) {
        // The panel as seen: from the board above's front edge (or the panel's top, whichever is lower) to the board
        // below, from the wall (or what stands before it in the row) to the book after it.
        const top = Math.max(shade.top, cell.getBoundingClientRect().top);
        const room = shade.bottom - top;
        const left = Math.max(shade.left, place.previousElementSibling?.getBoundingClientRect().right ?? -Infinity);
        const right = Math.min(shade.right, place.nextElementSibling?.getBoundingClientRect().left ?? Infinity);
        w = Math.min(w, room / (hw + 2 * POSTER_MARGIN), (right - left) / (1 + 2 * POSTER_MARGIN));
        const m = w * POSTER_MARGIN;
        cx = Math.min(Math.max(cx, left + m + w / 2), right - m - w / 2);
        bottom = top + (room + w * hw) / 2;
      }
      // Back from the screen to the panel, where one px is seen `shrink` px; the spot's foot is the scale's origin.
      const x = (cx - (back.left + back.width / 2)) / shrink;
      const y = (bottom - back.bottom) / shrink;
      const k = w / back.width;
      place.style.setProperty("--poster-x", `${x.toFixed(1)}px`);
      place.style.setProperty("--poster-y", `${y.toFixed(1)}px`);
      place.style.setProperty("--poster-k", k.toFixed(3));
    };
    measure();
    // The shelf plans its boards anew after a resize, so the compartment may change after the place did: watch it too,
    // and measure once more a frame later (turned upright, a stale measure left the poster off the middle).
    let frame = 0;
    const later = () => {
      measure();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(later);
    observer.observe(place);
    const cell = place.closest(".shelf-cell");
    if (cell) observer.observe(cell);
    window.addEventListener("resize", later);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", later);
    };
  }, [link]);
}

/**
 * The poster (user request, 24 November 2026): a big picture from the game – a firework, a number with its shapes,
 * letters – under the game's name, on paper taped at three corners. The fourth, top right, curls away from the wood.
 * All drawn still, in CSS (`.shelf-poster` in bookshelf-books.css).
 */
function ToyPoster({ title, picture }: { title: string; picture?: string }) {
  return (
    <span className="shelf-poster" aria-hidden>
      <span className="shelf-poster-paper">
        <span className="shelf-poster-title" style={{ "--len": Math.max(...title.split(/\s+/).map((word) => [...word].length)) } as CSSProperties}>
          {title}
        </span>
        {picture && <img className="shelf-poster-picture" src={picture} alt="" decoding="async" draggable={false} />}
      </span>
      <span className="shelf-poster-curl" />
      <span className="shelf-poster-tape" data-corner="top-left" />
      <span className="shelf-poster-tape" data-corner="bottom-left" />
      <span className="shelf-poster-tape" data-corner="bottom-right" />
    </span>
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
      data-tap
      aria-label={t(book.title)}
      title={t(book.blurb)}
      {...loadOnIntent(book.href)}
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
      {spine && book.spine ? (
        // A game's own book opens with the very picture of its spine and nothing else: no title, no line, no second picture.
        <span className="shelf-book-cover" data-spine-art>
          <img className="shelf-book-art" src={book.spine} alt="" decoding="async" draggable={false} />
        </span>
      ) : (
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
      )}
    </>
  );
}
