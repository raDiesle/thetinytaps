import type { CSSProperties } from "react";
import type { SeoLanguage } from "@/content/seo";
import { pick } from "@/lib/language";
import { LEARNING_GAMES } from "@/lib/sharedTexts";
import pictures from "../../components/bilder/*.webp?glob";
import { CANVAS } from "../canvas";
import { GALLERY, gameTitle, HELPERS_TITLE, SIGNS } from "./content";
import { EndCard } from "./EndCard";
import { backgroundGames, GALLERY_BEATS, galleryFadeIn, headingPose, nameShown, type PicturePose, picturePose } from "./gallery";
import { cardPose } from "./timeline";

/** Every game the outro shows, the helpers first: the run of pictures. */
const RUN = [...GALLERY.helpers, ...GALLERY.games];

/** The picture in the middle: 3 : 2 like the games' pictures, as big as the heading over it and the name under it allow. */
const PHOTO = { width: 1140, height: 760 };

/** Where the picture in the middle has its middle: a little below the canvas's, under the heading. */
const MIDDLE = { x: CANVAS.width / 2, y: 560 };

/** A picture placed by its pose, framed like a photo; nearer pictures lie over further ones. */
function photoStyle(pose: PicturePose): CSSProperties {
  return {
    left: MIDDLE.x - PHOTO.width / 2,
    top: MIDDLE.y - PHOTO.height / 2,
    width: PHOTO.width,
    height: PHOTO.height,
    transform: `translate(${pose.x}px, ${pose.y}px) scale(${pose.scale})`,
    opacity: pose.opacity,
    filter: pose.blur > 0.2 ? `blur(${pose.blur.toFixed(1)}px)` : undefined,
    zIndex: Math.round(pose.scale * 100),
  };
}

/**
 * One frame of the outro „Bilder aus den Spielen“ at second `t` (user request, November 2026): the two categories side
 * by side, „Alltagshelfer“ and „Lernspiele“, each with a picture of its games; then picture after picture of the games
 * coming out of the depth into the middle, big, with its name under it and its category over it, flying on past the
 * camera as the next comes; then the card with the address, five signs and a code leading to the home page in `language`.
 */
export function GalleryScene({ t, language }: { t: number; language: SeoLanguage }) {
  const headings = [HELPERS_TITLE, LEARNING_GAMES] as const;
  return (
    <div className="vi-scene vg-scene" style={{ width: CANVAS.width, height: CANVAS.height }}>
      <div className="vg-light vg-light-games" style={{ opacity: backgroundGames(t) }} />
      {RUN.map((game, k) => {
        const pose = picturePose(k, t);
        return pose.opacity > 0.005 ? (
          <div key={game.href} className="vg-photo" style={photoStyle(pose)}>
            <img src={game.picture} alt="" />
          </div>
        ) : null;
      })}
      {headings.map((title, k) => {
        const pose = headingPose(k as 0 | 1, t);
        return pose.opacity > 0.005 ? (
          <p
            key={k}
            className="vg-heading"
            style={{ left: MIDDLE.x + pose.x, top: MIDDLE.y + pose.y, opacity: pose.opacity, transform: `translate(-50%, -50%) scale(${pose.scale})` }}
          >
            {pick(title, language)}
          </p>
        ) : null;
      })}
      {RUN.map((game, k) => {
        const shown = nameShown(k, t);
        return shown > 0.005 ? (
          <p key={game.href} className="vg-name" style={{ left: MIDDLE.x, top: MIDDLE.y + PHOTO.height / 2 + 4, opacity: shown }}>
            {pick(gameTitle(game), language)}
          </p>
        ) : null;
      })}
      <EndCard pose={cardPose(t, SIGNS.length, GALLERY_BEATS)} language={language} />
      <div className="vi-paper-fade" style={{ opacity: 1 - galleryFadeIn(t) }} />
    </div>
  );
}

/** Every picture this outro shows, so it can wait until all are decoded before its first frame. */
export const GALLERY_PICTURES = [...RUN.map((game) => game.picture), pictures["logo-fuchs-o.webp"]].filter((url): url is string => !!url);
