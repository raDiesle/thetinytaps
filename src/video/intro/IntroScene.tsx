import { type CSSProperties, memo } from "react";
import { Logo } from "@/components/Logo";
import pictures from "../../components/bilder/*.webp?glob";
import { type BookPose, bookPose, CANVAS, fadeIn, HERO, type ShelfPose, shelfPose, type TitlePose, titlePose } from "./timeline";

/** The picture books standing cover out beside the Little Steps to Grow book, two on each side, as on the home page's shelf, from left to right. */
export const COVERS = ["cover-lebendige-welten", "cover-zuordnen", "cover-buchstaben-zahlen", "cover-gefuehle"];

/** The everyday helpers standing spine out at both ends, each with its picture on a paper label, as on the shelf. */
const SPINES = [
  { id: "timer", color: "#4c8fd6", height: 360 },
  { id: "abstillen", color: "#e8a0b4", height: 330 },
  { id: "schnullerfee", color: "#9b7fd4", height: 372 },
  { id: "zaehne", color: "#5fb7a8", height: 344 },
  { id: "toepfchen", color: "#f2b84b", height: 356 },
  { id: "kita", color: "#e07a5f", height: 338 },
  { id: "belohnungstafel", color: "#d4a12a", height: 368 },
  { id: "haare-waschen", color: "#6aa6d8", height: 334 },
];

/** Where the board's top lies: every book stands on it. */
const BOARD = HERO.y + HERO.height + 6;
const COVER_SIZE = 262;
const GAP = 22;

/** Where each picture book of `COVERS` stands on the canvas, from left to right: two left of the Little Steps to Grow book, two right. */
export const COVER_BOXES = COVERS.map((_, k) => {
  const side = k < 2 ? -1 : 1;
  const step = k < 2 ? 1 - k : k - 2;
  const left = side < 0 ? HERO.x - GAP - (step + 1) * COVER_SIZE - step * GAP : HERO.x + HERO.width + GAP + step * (COVER_SIZE + GAP);
  return { left, top: BOARD - COVER_SIZE, width: COVER_SIZE, height: COVER_SIZE };
});

/** One book standing with its spine out. */
function Spine({ id, color, height, x }: { id: string; color: string; height: number; x: number }) {
  return (
    <div className="vi-spine" style={{ left: x, top: BOARD - height, height, "--spine": color } as CSSProperties}>
      <span className="vi-spine-label">
        <img src={pictures[`spine-${id}.webp`]} alt="" />
      </span>
    </div>
  );
}

/**
 * The shelf, drawn once: what moves is the camera on it, by a transform of the whole layer. A picture book lights up
 * by `--glow-<k>` (0 to 1) set on a layer round it (the outro shows them one after another), never by drawing it again.
 */
export const Shelf = memo(function Shelf() {
  const left = SPINES.slice(0, 4);
  const right = SPINES.slice(4);
  // From the Little Steps to Grow book outwards: two covers on each side, then four spines.
  const firstLeft = COVER_BOXES[0]!.left - GAP;
  const firstRight = COVER_BOXES[3]!.left + COVER_SIZE + GAP;
  return (
    <div className="vi-shelf-picture">
      <div className="vi-wall" />
      <div className="vi-back" />
      <div className="vi-glow" style={{ left: HERO.x + HERO.width / 2, top: HERO.y + HERO.height / 2 }} />
      <div className="vi-board vi-board-top" style={{ top: 60 }} />
      {left.map((spine, k) => (
        <Spine key={spine.id} {...spine} x={firstLeft - (k + 1) * 66} />
      ))}
      {right.map((spine, k) => (
        <Spine key={spine.id} {...spine} x={firstRight + k * 66} />
      ))}
      {COVERS.map((cover, k) => (
        <div key={cover} className="vi-cover-out" style={{ ...COVER_BOXES[k], "--lit": `var(--glow-${k}, 0)` } as CSSProperties}>
          <img src={pictures[`${cover}.webp`]} alt="" />
        </div>
      ))}
      <div className="vi-board" style={{ top: BOARD }} />
    </div>
  );
});

/** The Little Steps to Grow book: its pages, and over them the cover with the families reading, which swings open. */
export const Book = memo(function Book() {
  return (
    <>
      <div className="vi-pages">
        <div className="vi-page-edges" />
        <div className="vi-page" />
      </div>
      <div className="vi-cover">
        <div className="vi-cover-front">
          <img src={pictures["buch-cover.webp"]} alt="" />
          <span className="vi-cover-label">Little Steps to Grow</span>
        </div>
        <div className="vi-cover-inside" />
      </div>
    </>
  );
});

/** The shelf under the camera and the Little Steps to Grow book in its pose: what the intro and the outro both show. */
export function ShelfAndBook({ shelf, book, glows }: { shelf: ShelfPose; book: BookPose; glows?: readonly number[] }) {
  const bookStyle = {
    left: HERO.x,
    top: HERO.y,
    width: HERO.width,
    height: HERO.height,
    transform: `translate(${book.x - (HERO.x + HERO.width / 2)}px, ${book.y - (HERO.y + HERO.height / 2)}px) scale(${book.scale}) rotateX(${book.tip}deg)`,
    "--cover": `${-book.cover}deg`,
  } as CSSProperties;
  const shelfStyle = {
    transform: `scale(${shelf.scale})`,
    transformOrigin: `${HERO.x + HERO.width / 2}px ${HERO.y + HERO.height / 2}px`,
    filter: shelf.blur > 0.05 ? `blur(${shelf.blur}px) brightness(${1 - shelf.dim})` : undefined,
    ...Object.fromEntries((glows ?? []).map((glow, k) => [`--glow-${k}`, glow])),
  } as CSSProperties;
  return (
    <>
      <div className="vi-shelf" style={shelfStyle}>
        <Shelf />
      </div>
      <div className="vi-book" style={bookStyle}>
        <Book />
      </div>
    </>
  );
}

/** The name printed on the first page, with the paw tracks, Papa Fox and his child on the o, and the address under it. */
export function PrintedTitle({ title, opacity = 1 }: { title: TitlePose; opacity?: number }) {
  return (
    <div
      className="vi-title"
      style={
        {
          opacity,
          "--letters": title.letters,
          "--tracks": title.tracks,
          "--foxes": title.foxes,
        } as CSSProperties
      }
    >
      <Logo />
      <p className="vi-address" style={{ opacity: title.address, translate: `0 ${(1 - title.address) * 12}px` }}>
        littlestepstogrow.com
      </p>
    </div>
  );
}

/**
 * One frame of the intro at second `t`: a shelf of picture books, the Little Steps to Grow book coming out and opening, and on
 * its first page the name printed with Papa Fox and his child sitting down on the o. Everything is a function of `t`.
 */
export function IntroScene({ t }: { t: number }) {
  const title = titlePose(t);
  return (
    <div className="vi-scene" style={{ width: CANVAS.width, height: CANVAS.height }}>
      <ShelfAndBook shelf={shelfPose(t)} book={bookPose(t)} />
      {title.letters > 0 && <PrintedTitle title={title} />}
      <div className="vi-paper-fade" style={{ opacity: 1 - fadeIn(t) }} />
    </div>
  );
}

/** Every picture the intro shows, so it can wait until all are decoded before its first frame. */
export const INTRO_PICTURES = [
  pictures["buch-cover.webp"],
  pictures["logo-fuchs-o.webp"],
  ...COVERS.map((c) => pictures[`${c}.webp`]),
  ...SPINES.map((s) => pictures[`spine-${s.id}.webp`]),
].filter((url): url is string => !!url);
