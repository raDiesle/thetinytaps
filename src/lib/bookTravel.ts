import { bookIdOf, shelfEntryOf } from "@/content/games";
import { playPageTurn } from "@/lib/sfx";
import { pageMoves } from "@/lib/pageMotion";
import { holdPreloads } from "@/lib/preloadPages";
import { BOOK_ASPECT } from "@/lib/shelfLayout";

/*
 * The way into a book and back onto the shelf (bookshelf.css): the home page is a bookshelf, and a
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

/**
 * The book on the shelf a page is in, by its `data-book`: its category's (its page and its games), a game's own, or the
 * volume of a game tied in a bundle that the page opens (`Game.volumes`).
 */
export function shelfBookOf(pathname: string): string | undefined {
  const entry = shelfEntryOf(pathname);
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const volume = entry?.game?.volumes?.find((v) => path.startsWith(v.href));
  return volume ? bookIdOf(volume.href) : entry?.id;
}

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

/**
 * A copy of `original` without what is never seen in it: the words kept unseen for search engines (`hidden`), and what
 * lies below the first screen – a page turned in 3D is painted whole, all the way down. Each element left out is one a
 * phone needn't style and paint while it gets the book ready (the shelf's unseen texts were 40 % of the room).
 */
function seenCopy(original: HTMLElement) {
  const copy = original.cloneNode(true) as HTMLElement;
  copy.removeAttribute("id");
  for (const unseen of copy.querySelectorAll("[hidden], [data-below-fold], .seo-text")) unseen.remove();
  return copy;
}

/** A still copy of everything the app shows, as big as the screen, to be printed on the book's left page. */
function copyScreen() {
  const print = element("bt-print");
  const root = document.getElementById("root");
  if (root) print.append(seenCopy(root));
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
  // A book spine out leans on the shelf (`--lean`): measured standing up, it flies from there and straightens as it
  // lifts, turning about the corner it leans on.
  const { rect, lean, pivot } = spine ? upright(book, spine) : { rect: (cover ?? book).getBoundingClientRect(), lean: 0, pivot: null };
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
  // Where the book leans on its corner, in the copy's own place (its origin at `x`, its top).
  const px = pivot ? pivot.left - x : 0;
  const py = pivot ? pivot.bottom - rect.top : 0;
  return { book: copy, right, lid, left, w, h: rect.height, x, y: rect.top, turned: Boolean(spine), lean, px, py };
}

/**
 * Measures the spine `spine` as it would stand without the lean of the book `leaning`, and the book's box, whose bottom
 * left corner it leans on. The lean is taken off and put back before anything is drawn, and
 * without its transition, so nothing on the shelf moves.
 */
function upright(leaning: HTMLElement, spine: HTMLElement) {
  const lean = Number.parseFloat(getComputedStyle(leaning).getPropertyValue("--lean")) || 0;
  leaning.style.transition = "none";
  leaning.style.setProperty("--lean", "0deg");
  const rect = spine.getBoundingClientRect();
  const pivot = leaning.getBoundingClientRect();
  leaning.style.removeProperty("--lean");
  // Leaning again before the transition comes back, so it doesn't play the lean anew.
  void getComputedStyle(leaning).transform;
  leaning.style.removeProperty("transition");
  return { rect, lean, pivot };
}

type Built = ReturnType<typeof buildBook>;

/**
 * The book's moves, from its place on the shelf to its left page filling the screen, and the scale of that page then
 * (to print the screen on it at the right size).
 */
function moves({ w, h, x, y, turned, lean, px, py }: Built) {
  const vw = innerWidth;
  const vh = innerHeight;
  const margin = pageMargins();
  // A book standing spine out turns its cover towards the eye as it comes out, done once it is in the middle; leaning
  // on its corner (`tilt`), it stands up as it lifts.
  const at = (dx: number, dy: number, s: number, z = 0, deg = 0, tilt = 0) =>
    turned
      ? `translate(${px}px, ${py}px) rotate(${tilt}deg) translate(${-px}px, ${-py}px) translate3d(${dx}px, ${dy}px, ${z}px) scale(${s}) rotateY(${deg}deg)`
      : `translate3d(${dx}px, ${dy}px, ${z}px) scale(${s})`;
  // In the middle closed, as big as it fits open; open with the spine in the middle; close with its left page as the screen.
  const middle = Math.min((0.7 * vh) / h, (0.42 * vw) / w);
  const page = (vw - margin.left - margin.right) / w;
  const pageTop = vh / 2 - (page * h) / 2;
  const book = [
    { offset: 0, transform: at(0, 0, 1, 0, 90, lean), easing: "cubic-bezier(.3,0,.4,1)" },
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

/**
 * The moves forwards (out of the shelf) or backwards (back into it): each part stands still as it is in their first
 * frame until the returned function starts them all at once, which resolves when they are done. Not paused animations
 * standing ready: started only then, the phone knows from the start how big the book will grow and draws it once at
 * that size.
 */
function travel(built: Built, m: ReturnType<typeof moves>, direction: "normal" | "reverse") {
  const timing: KeyframeAnimationOptions = { duration: TOTAL, fill: "both", direction, easing: "linear" };
  const dim = [
    { offset: 0, filter: "brightness(1)" },
    { offset: AT_MIDDLE, filter: "brightness(1)", easing: "cubic-bezier(.5,0,.35,1)" },
    { offset: AT_OPEN, filter: "brightness(0.45)" },
    { offset: 1, filter: "brightness(0.45)" },
  ];
  const parts: [Element | null, Keyframe[]][] = [
    [built.lid.querySelector(".shelf-book-cover"), dim],
    [built.left, m.left],
    [built.right, m.right],
    [built.lid, m.lid],
    [built.book, m.book],
  ];
  for (const [part, frames] of parts) {
    const { offset, easing, ...first } = frames[direction === "normal" ? 0 : frames.length - 1];
    if (part instanceof HTMLElement) Object.assign(part.style, first);
  }
  return () => Promise.all(parts.map(([part, frames]) => part?.animate(frames, timing).finished));
}

/** A layer over the app for the book to travel on; it takes the taps meanwhile, so nothing under it starts. */
function layer() {
  const root = element("book-travel");
  root.style.setProperty("--bt-eye", `${EYE}px`);
  document.body.append(root);
  return root;
}

/** Fades the layer away and removes it; resolves when it is gone. */
function leave(root: HTMLElement, ms: number) {
  root.style.pointerEvents = "none";
  return root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, fill: "both" }).finished.finally(() => root.remove());
}

/** Waits for the next frames, `count` of them. */
const frames = (count: number) => new Promise<void>((resolve) => (count <= 0 ? resolve() : requestAnimationFrame(() => frames(count - 1).then(resolve))));

/** The longest the book waits on the shelf for the page it opens on (its code still loading): then it goes anyway. */
const READY_WAIT = 3000;

/**
 * Resolves once `gone` has left the page (the router has put the new page in its place), or after `READY_WAIT`. It
 * resolves in the same task as that change, before the browser draws it, so what is done then is drawn with it.
 */
function whenGone(gone: Element | null) {
  const root = document.getElementById("root");
  if (!gone || !root) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const done = () => {
      observer.disconnect();
      clearTimeout(cap);
      resolve();
    };
    const observer = new MutationObserver(() => !gone.isConnected && done());
    observer.observe(root, { childList: true, subtree: true });
    const cap = setTimeout(done, READY_WAIT);
  });
}

/** The longest the book waits for the new page's pictures to be decoded. */
const PICTURES_WAIT = 800;

/**
 * Resolves once every picture on the page is loaded and decoded, or after `PICTURES_WAIT`: a menu's pictures
 * (`CardPicture`) that came only while the book flew had the phone draw the page again in its first frames.
 */
function picturesReady() {
  const pictures = [...document.querySelectorAll<HTMLImageElement>("#root img")].map((img) => img.decode().catch(() => undefined));
  return Promise.race([Promise.all(pictures), new Promise((resolve) => setTimeout(resolve, PICTURES_WAIT))]);
}

/**
 * Takes the shelf book `book` out, opens it and goes on to where it leads with `go`. The room stays on the layer as a
 * copy while the app changes under it, so the left page can show the new page printed.
 *
 * Everything heavy comes before the book moves, while it still stands in its gap and the screen looks as before:
 * the room's copy is drawn in the very frame the new page replaces the room (one long frame on an old phone, which no
 * one sees, since nothing changes), then the new page is copied onto the left page, and only then the book lifts – and
 * with it the sound. While it moves the main thread has nothing left to do: drawing and copying during the motion
 * stuttered on phones (4 frames over 50 ms in its first 0.4 s, November 2026), and no other page's code is loaded until
 * the book is open.
 */
export function takeOutBook(book: HTMLElement, go: () => void) {
  if (travelling || still()) {
    if (!travelling) go();
    return;
  }
  travelling = true;
  holdPreloads(READY_WAIT);
  // The game or menu the book opens on waits with its voice, songs and animations until the book lies open and the
  // layer is gone (pageMotion.ts): the child sees it start, never while the book still flies.
  const lies = pageMoves();
  // The layer is there at once, empty, to take the taps while the book gets ready.
  const root = layer();
  const built = buildBook(book);
  const m = moves(built);
  const room = book.closest("main");
  const scene: HTMLElement[] = [];
  if (room) {
    // The copy has the book's gap; the shelf itself shows it whole until the copy covers it.
    book.dataset.away = "";
    const backdrop = seenCopy(room);
    delete book.dataset.away;
    const box = room.getBoundingClientRect();
    backdrop.classList.add("bt-backdrop");
    Object.assign(backdrop.style, { top: `${box.top}px`, left: `${box.left}px`, width: `${box.width}px` });
    scene.push(backdrop);
  }
  scene.push(built.book);
  const moving = travel(built, m, "normal");
  void (async () => {
    try {
      const ready = whenGone(room);
      go();
      await ready;
      book.dataset.away = "";
      root.append(...scene);
      // The new page fits its cards a frame or two after it first shows (useFitGrid); then it is printed on the left page,
      // with its pictures already decoded.
      await Promise.all([frames(3), picturesReady()]);
      const print = copyScreen();
      print.style.transform = m.print;
      built.left.append(print);
      // The print is drawn before the book lifts.
      await frames(2);
      // The cover lands on the left with the sound's last thud.
      playPageTurn((LIFT + FLY + OPEN) / 1000 / 0.85);
      holdPreloads(TOTAL + 300);
      await moving();
    } catch {
      // A move cut short (the page hidden meanwhile): the layer goes all the same.
    } finally {
      travelling = false;
      void leave(root, m.fills ? 140 : 320)
        .catch(() => root.remove())
        .finally(lies);
    }
  })();
}

/**
 * Closes the book whose page `from` is and puts it back in its gap on the shelf, after `go` has gone back to the
 * shelf. Without a shelf book for the page (or without motion) it just goes.
 */
export function putBookBack(from: string, go: () => void) {
  const id = shelfBookOf(from);
  // Going back is never dropped, not even while a book is still on its way out (a grown-up leaving a game that opened
  // at once): it then goes without the book.
  if (travelling || still() || !id) {
    go();
    return;
  }
  travelling = true;
  holdPreloads(TOTAL + 1800);
  const lies = pageMoves();
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
      void leave(root, 250).finally(lies);
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
    travel(built, m, "reverse")().finally(() => {
      delete book.dataset.away;
      travelling = false;
      root.remove();
      lies();
    });
  });
}
