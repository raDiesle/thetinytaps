import { shelfEntryOf } from "@/content/games";
import { playPageTurn } from "@/lib/sfx";
import { BOOK_ASPECT } from "@/lib/shelfLayout";

/*
 * The way into a book and back onto the shelf, in the book look (bookshelf.css): the home page is a bookshelf, and a
 * tap on a book takes it out – it comes off its board towards you, into the middle, its cover swings open to the left,
 * and the left page, where the book's first menu is printed, comes close until it is the screen. No page turns on the
 * way in; pages turn only inside the book (look.ts). The way back is the same backwards: the page goes far, the cover
 * closes and the book goes back into its gap on the shelf.
 *
 * It is drawn on a layer of its own over the app (`.book-travel`), from copies of what is on the screen: the shelf
 * book's cover, the room behind it, and the page – so the app underneath can already change to where the book leads.
 */

/** How long each part takes, in ms: off the board, into the middle, the cover opening, the page coming close. */
const LIFT = 320;
const FLY = 560;
const OPEN = 950;
const ZOOM = 720;
const TOTAL = LIFT + FLY + OPEN + ZOOM;
/** Where each part ends, as a share of the whole way. */
const AT_LIFTED = LIFT / TOTAL;
const AT_MIDDLE = (LIFT + FLY) / TOTAL;
const AT_OPEN = (LIFT + FLY + OPEN) / TOTAL;
/** The eye's distance from the screen, as on the shelf (`--shelf-eye` in bookshelf.css). */
const EYE = 1300;

/** Only one book travels at a time: a second tap meanwhile does nothing. */
let travelling = false;

const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The book on the shelf a page is in, by its `data-book`: its category's (its page and its games), or a game's own. */
export const shelfBookOf = (pathname: string): string | undefined => shelfEntryOf(pathname)?.id;

function element(className: string, tag = "div") {
  const el = document.createElement(tag);
  el.className = className;
  return el;
}

/** How far the page lies inside the screen at its outer edge and at the spine (`--page-left`, `--page-right`). */
function pageMargins() {
  const style = getComputedStyle(document.documentElement);
  return { left: Number.parseFloat(style.getPropertyValue("--page-left")) || 30, right: Number.parseFloat(style.getPropertyValue("--page-right")) || 18 };
}

/** A still copy of everything the app shows, as big as the screen, to be printed on the book's left page. */
function copyScreen() {
  const print = element("bt-print");
  const root = document.getElementById("root");
  if (root) {
    const copy = root.cloneNode(true) as HTMLElement;
    copy.removeAttribute("id");
    print.append(copy);
  }
  return print;
}

/**
 * The book flying, built from the shelf book `book` (its faces) and placed where its cover is on the screen. A book
 * standing with its spine out (`.shelf-daily`) flies as the picture book it keeps hidden inside (`.shelf-daily-book`):
 * as high as its spine, its spine as thick, at first turned so that its spine faces out where it stood.
 */
function buildBook(book: HTMLElement) {
  const template = book.querySelector<HTMLElement>(".shelf-daily-book");
  const spine = template && book.querySelector<HTMLElement>(".box-front");
  const cover = book.querySelector<HTMLElement>(".shelf-book-cover");
  const rect = (spine ?? cover ?? book).getBoundingClientRect();
  const copy = (template ?? book).cloneNode(true) as HTMLElement;
  copy.className = "shelf-book bt-book";
  copy.hidden = false;
  copy.removeAttribute("href");
  copy.querySelector(".shelf-book-shadow")?.remove();
  // Turned, the spine lies left of the cover's edge, which the book turns on: there, at the spine's right.
  const w = spine ? rect.height * BOOK_ASPECT : rect.width;
  const x = spine ? rect.right : rect.left;
  Object.assign(copy.style, { left: `${x}px`, top: `${rect.top}px` });
  copy.style.setProperty("--bw", `${w}px`);
  copy.style.setProperty("--bh", `${rect.height}px`);
  if (spine) copy.style.setProperty("--depth", `${rect.width}px`);
  // The page under the cover (the right page once open), and the cover turning on the spine with the left page inside it.
  const right = element("bt-page bt-right");
  const lid = element("bt-lid");
  const left = element("bt-page bt-left");
  const front = copy.querySelector(".shelf-book-cover");
  if (front) lid.append(front);
  lid.append(left);
  copy.prepend(right);
  copy.append(lid);
  return { book: copy, right, lid, left, w, h: rect.height, x, y: rect.top, turned: Boolean(spine) };
}

type Built = ReturnType<typeof buildBook>;

/**
 * The book's moves, from its place on the shelf to its left page filling the screen, and the scale of that page then
 * (to print the screen on it at the right size).
 */
function moves({ w, h, x, y, turned }: Built) {
  const vw = innerWidth;
  const vh = innerHeight;
  const margin = pageMargins();
  // A book standing spine out turns its cover towards the eye as it comes out, done once it is in the middle.
  const at = (dx: number, dy: number, s: number, z = 0, deg = 0) => `translate3d(${dx}px, ${dy}px, ${z}px) scale(${s})${turned ? ` rotateY(${deg}deg)` : ""}`;
  // In the middle closed, as big as it fits open; open with the spine in the middle; close with its left page as the screen.
  const middle = Math.min((0.7 * vh) / h, (0.42 * vw) / w);
  const page = (vw - margin.left - margin.right) / w;
  const pageTop = vh / 2 - (page * h) / 2;
  const book = [
    { offset: 0, transform: at(0, 0, 1, 0, 90), easing: "cubic-bezier(.3,0,.4,1)" },
    { offset: AT_LIFTED, transform: at(0, -0.09 * h, 1, turned ? 60 + w / 2 : 60, 50), easing: "cubic-bezier(.45,0,.35,1)" },
    { offset: AT_MIDDLE, transform: at(vw / 2 - (middle * w) / 2 - x, vh / 2 - (middle * h) / 2 - y, middle), easing: "cubic-bezier(.45,0,.35,1)" },
    { offset: AT_OPEN, transform: at(vw / 2 - x, vh / 2 - (middle * h) / 2 - y, middle), easing: "cubic-bezier(.55,0,.4,1)" },
    { offset: 1, transform: at(vw - margin.right - x, pageTop - y, page) },
  ];
  const turn = "cubic-bezier(.5,0,.35,1)";
  const lid = [
    { offset: 0, transform: "rotateY(0deg)" },
    { offset: AT_MIDDLE, transform: "rotateY(0deg)", easing: turn },
    { offset: AT_OPEN, transform: "rotateY(-180deg)" },
    { offset: 1, transform: "rotateY(-180deg)" },
  ];
  // The light: the cover's front darkens as it turns away, the left page comes into the lamp's light, the right one
  // stays in the spine's shadow – the dark beside the page on the right.
  const left = [
    { offset: 0, filter: "brightness(0.55)" },
    { offset: AT_MIDDLE, filter: "brightness(0.55)", easing: turn },
    { offset: AT_OPEN, filter: "brightness(1)" },
    { offset: 1, filter: "brightness(1)" },
  ];
  const right = [
    { offset: 0, filter: "brightness(1)" },
    { offset: AT_MIDDLE, filter: "brightness(0.95)" },
    { offset: AT_OPEN, filter: "brightness(0.7)" },
    { offset: 1, filter: "brightness(0.42)" },
  ];
  // Where the screen's copy lies on the left page so that it is exactly the screen once the page fills it.
  const print = `translate(${-margin.left / page}px, ${-pageTop / page}px) scale(${1 / page})`;
  return { book, lid, left, right, print, fills: page * h >= vh };
}

/** Plays the moves forwards (out of the shelf) or backwards (back into it); resolves when they are done. */
function travel(built: Built, m: ReturnType<typeof moves>, direction: "normal" | "reverse") {
  const timing: KeyframeAnimationOptions = { duration: TOTAL, fill: "both", direction, easing: "linear" };
  const front = built.lid.querySelector(".shelf-book-cover");
  const dim = [
    { offset: 0, filter: "brightness(1)" },
    { offset: AT_MIDDLE, filter: "brightness(1)", easing: "cubic-bezier(.5,0,.35,1)" },
    { offset: AT_OPEN, filter: "brightness(0.45)" },
    { offset: 1, filter: "brightness(0.45)" },
  ];
  front?.animate(dim, timing);
  built.left.animate(m.left, timing);
  built.right.animate(m.right, timing);
  built.lid.animate(m.lid, timing);
  return built.book.animate(m.book, timing).finished;
}

/** A layer over the app for the book to travel on; it takes the taps meanwhile, so nothing under it starts. */
function layer() {
  const root = element("book-travel");
  root.style.setProperty("--bt-eye", `${EYE}px`);
  document.body.append(root);
  return root;
}

/** Fades the layer away and removes it. */
function leave(root: HTMLElement, ms: number) {
  root.style.pointerEvents = "none";
  root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, fill: "both" }).finished.finally(() => root.remove());
}

/** Waits for the next frames, `count` of them. */
const frames = (count: number) => new Promise<void>((resolve) => (count <= 0 ? resolve() : requestAnimationFrame(() => frames(count - 1).then(resolve))));

/**
 * Takes the shelf book `book` out, opens it and goes on to where it leads with `go`. The room stays on the layer as a
 * copy while the app changes under it, as soon as the cover starts opening, so the left page can show it printed.
 */
export function takeOutBook(book: HTMLElement, go: () => void) {
  if (travelling || still()) {
    if (!travelling) go();
    return;
  }
  travelling = true;
  // The cover lands on the left with the sound's last thud.
  playPageTurn((LIFT + FLY + OPEN) / 1000 / 0.85);
  const root = layer();
  const built = buildBook(book);
  const m = moves(built);
  book.dataset.away = "";
  const room = book.closest("main");
  if (room) {
    const backdrop = room.cloneNode(true) as HTMLElement;
    const box = room.getBoundingClientRect();
    backdrop.classList.add("bt-backdrop");
    Object.assign(backdrop.style, { top: `${box.top}px`, left: `${box.left}px`, width: `${box.width}px` });
    root.append(backdrop);
  }
  root.append(built.book);
  const done = travel(built, m, "normal");
  setTimeout(async () => {
    go();
    // The new page shows after React's next render (a game's menu fits its cards a frame later).
    await frames(3);
    const print = copyScreen();
    print.style.transform = m.print;
    built.left.append(print);
  }, LIFT + FLY);
  done.finally(() => {
    travelling = false;
    leave(root, m.fills ? 140 : 320);
  });
}

/**
 * Closes the book whose page `from` is and puts it back in its gap on the shelf, after `go` has gone back to the
 * shelf. Without a shelf book for the page (or without motion) it just goes.
 */
export function putBookBack(from: string, go: () => void) {
  const id = shelfBookOf(from);
  if (travelling || still() || !id) {
    if (!travelling) go();
    return;
  }
  travelling = true;
  // The screen as it is, still on top while the shelf comes in under it.
  const root = layer();
  const print = copyScreen();
  print.classList.add("bt-print-full");
  root.append(print);
  go();
  const started = performance.now();
  const findBook = async (): Promise<HTMLElement | null> => {
    const book = document.querySelector<HTMLElement>(`.shelf [data-book="${id}"]`);
    if (book || performance.now() - started > 1500) return book;
    await frames(1);
    return findBook();
  };
  void findBook().then((book) => {
    if (!book) {
      travelling = false;
      leave(root, 250);
      return;
    }
    const built = buildBook(book);
    const m = moves(built);
    book.dataset.away = "";
    print.classList.remove("bt-print-full");
    print.style.transform = m.print;
    built.left.append(print);
    root.append(built.book);
    setTimeout(() => playPageTurn(OPEN / 1000), ZOOM);
    travel(built, m, "reverse").finally(() => {
      delete book.dataset.away;
      travelling = false;
      root.remove();
    });
  });
}
