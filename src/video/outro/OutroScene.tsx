import type { SeoLanguage } from "@/content/seo";
import previews from "../../components/vorschau/*.webp?glob";
import { CANVAS } from "../canvas";
import { COVER_BOXES, COVERS, INTRO_PICTURES, PrintedTitle, ShelfAndBook } from "../intro/IntroScene";
import { SIGNS } from "./content";
import { EndCard } from "./EndCard";
import { cardPose, glows, outroBookPose, outroFadeIn, outroShelfPose, titleLeft } from "./timeline";

/**
 * For each picture book of the shelf (`COVERS`, left to right), the picture of one of its games it shows when it lights
 * up: menu pictures with no word in them, since one picture serves the video in every language (the letters game's
 * shows „Affe“, so the book of letters and numbers shows counting).
 */
const GAME_PICTURES = ["bilder", "tiere", "zaehlen", "gefuehle"].map((id) => previews[`${id}.webp`]);

/** The picture of a game rising over its book while the book is lit: 3 : 2, like the menus' pictures. */
const PHOTO = { width: 300, height: 200, lift: 26 };

/** The printed name as the intro left it, so the cut from the video into the outro lands on the same page. */
const FULL_TITLE = { letters: 1, tracks: 1, foxes: 1, address: 1 };

/**
 * One frame of the outro at second `t` (idea Y-04 and Y-05): the first page with the name, the book closing and going
 * back into the shelf, the other picture books lighting up in turn with a picture of their games, then a card with the
 * address, what the site is in five small signs, and a code leading to the home page in `language`.
 */
export function OutroScene({ t, language }: { t: number; language: SeoLanguage }) {
  const lit = glows(t);
  const card = cardPose(t, SIGNS.length);
  const title = titleLeft(t);
  return (
    <div className="vi-scene vo-scene" style={{ width: CANVAS.width, height: CANVAS.height }}>
      <ShelfAndBook shelf={outroShelfPose(t)} book={outroBookPose(t)} glows={lit} />
      {COVER_BOXES.map((box, k) =>
        lit[k]! > 0.01 ? (
          <div
            key={COVERS[k]}
            className="vo-photo"
            style={{
              left: box.left + (box.width - PHOTO.width) / 2,
              top: box.top - PHOTO.height - 30,
              width: PHOTO.width,
              height: PHOTO.height,
              opacity: lit[k],
              translate: `0 ${(1 - lit[k]!) * PHOTO.lift}px`,
            }}
          >
            <img src={GAME_PICTURES[k]} alt="" />
          </div>
        ) : null,
      )}
      {title > 0 && <PrintedTitle title={FULL_TITLE} opacity={title} />}
      <EndCard pose={card} language={language} />
      <div className="vi-paper-fade" style={{ opacity: 1 - outroFadeIn(t) }} />
    </div>
  );
}

/** Every picture the outro shows, so it can wait until all are decoded before its first frame. */
export const OUTRO_PICTURES = [...INTRO_PICTURES, ...GAME_PICTURES].filter((url): url is string => !!url);
