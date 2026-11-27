import type { CSSProperties } from "react";
import type { SeoLanguage } from "@/content/seo";
import { pick } from "@/lib/language";
import { CANVAS } from "../canvas";
import { BOARD_ADDRESS, BOARD_LINE, PINBOARD, photoWord } from "./content";
import { FRAME, lineShown, NOTE, notePose, PHOTO, PIN_COLORS, PIN_SLOTS, type PressPose, photoPose, pinboardFadeIn, type Slot } from "./pinboard";

/** A thing pressed onto the board at `slot`, `width` × `height`, as `pose` says: higher, it is bigger and its shadow longer. */
function pressedStyle(slot: Slot, width: number, height: number, pose: PressPose): CSSProperties {
  return {
    left: slot.x - width / 2,
    top: slot.y - height / 2,
    width,
    height,
    opacity: pose.opacity,
    transform: `translateY(${(-24 * pose.lift).toFixed(1)}px) rotate(${slot.turn}deg) scale(${pose.scale.toFixed(4)})`,
    "--lift": pose.lift.toFixed(3),
  } as CSSProperties;
}

/**
 * A font size that keeps `text` on one line within its paper: `size` px for a short text, smaller as it grows longer
 * than `room` letters (a Spanish line is half again as long as the German one).
 */
const fitted = (text: string, size: number, room: number) => `${Math.min(size, Math.floor((size * room) / [...text].length))}px`;

/** A pushpin seen from above: a round coloured head with light on it, its shadow falling to the lower right. */
function Pin({ color, pose }: { color: string; pose: PressPose }) {
  if (pose.pin <= 0) return null;
  return (
    <svg
      className="vp-pin"
      viewBox="-30 -30 60 60"
      aria-hidden
      style={{ opacity: Math.min(1, pose.pin * 4), transform: `translate(-50%, -50%) scale(${(1.7 - 0.7 * pose.pin).toFixed(3)})` }}
    >
      <ellipse cx={7 + 6 * (1 - pose.pin)} cy={9 + 6 * (1 - pose.pin)} rx="15" ry="13" fill="#2a17083d" />
      <circle r="15" fill={color} />
      <circle r="15" fill="url(#vp-pin-shade)" />
      <ellipse cx="-5" cy="-6" rx="5.5" ry="4" fill="#ffffffb3" />
    </svg>
  );
}

/**
 * One frame of the outro „Pinnwand“ at second `t` (user request, 27 November 2026): a cork board filling the picture,
 * the games' photos pinned onto it one after another in white frames, each with a word for what it is, then a paper
 * in the middle with the address and a short line on what the site holds – one picture to take in, in `language`.
 */
export function PinboardScene({ t, language }: { t: number; language: SeoLanguage }) {
  const note = notePose(t);
  return (
    <div className="vi-scene vp-scene" style={{ width: CANVAS.width, height: CANVAS.height }}>
      <svg width="0" height="0" aria-hidden className="vp-defs">
        <radialGradient id="vp-pin-shade" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </radialGradient>
      </svg>
      <div className="vp-cork" />
      {PINBOARD.map((photo, k) => {
        const pose = photoPose(k, t);
        const slot = PIN_SLOTS[k]!;
        return pose.opacity > 0.005 ? (
          <div key={photo.href} className="vp-photo" style={pressedStyle(slot, FRAME.width, FRAME.height, pose)}>
            <img src={photo.picture} alt="" style={{ width: PHOTO.picture.width, height: PHOTO.picture.height }} />
            <p className="vp-word" style={{ fontSize: fitted(pick(photoWord(photo), language), 34, 15) }}>
              {pick(photoWord(photo), language)}
            </p>
            <Pin color={PIN_COLORS[k % PIN_COLORS.length]!} pose={pose} />
          </div>
        ) : null;
      })}
      {note.opacity > 0.005 ? (
        <div className="vp-note" style={pressedStyle(NOTE, NOTE.width, NOTE.height, note)}>
          <p className="vp-address">{BOARD_ADDRESS}</p>
          <p className="vp-line" style={{ opacity: lineShown(t), fontSize: fitted(pick(BOARD_LINE, language), 50, 34) }}>
            {pick(BOARD_LINE, language)}
          </p>
          <Pin color={PIN_COLORS[0]} pose={note} />
        </div>
      ) : null}
      <div className="vi-paper-fade" style={{ opacity: 1 - pinboardFadeIn(t) }} />
    </div>
  );
}

/** Every picture this outro shows, so it can wait until all are decoded before its first frame. */
export const PINBOARD_PICTURES = PINBOARD.map((photo) => photo.picture).filter((url): url is string => !!url);
