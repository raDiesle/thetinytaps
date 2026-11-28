import type { CSSProperties } from "react";
import { FOX_O } from "@/components/Logo";
import type { SeoLanguage } from "@/content/seo";
import { pick } from "@/lib/language";
import { CANVAS } from "../canvas";
import { BOARD_ADDRESS, boardLine, FREE, PINBOARD, type PinnedPhoto, photoWord } from "./content";
import {
  FLAT,
  FRAME,
  markShown,
  NOTE,
  PAW_PRINTS,
  PHOTO,
  PIN_COLORS,
  PIN_SLOTS,
  pawShown,
  type PressPose,
  type Slot,
  stampPose,
  TRACK_DEPTH,
  TRACK_EMS,
  TRACK_UNITS,
} from "./pinboard";

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

/** A pushpin seen from above: a round coloured head with light on it, its shadow falling to the lower right; `left` is where it goes through its paper. */
function Pin({ color, pose, left = "50%" }: { color: string; pose: PressPose; left?: string }) {
  if (pose.pin <= 0) return null;
  return (
    <svg
      className="vp-pin"
      viewBox="-30 -30 60 60"
      aria-hidden
      style={{ left, opacity: Math.min(1, pose.pin * 4), transform: `translate(-50%, -50%) scale(${(1.7 - 0.7 * pose.pin).toFixed(3)})` }}
    >
      <ellipse cx={7 + 6 * (1 - pose.pin)} cy={9 + 6 * (1 - pose.pin)} rx="15" ry="13" fill="#2a17083d" />
      <circle r="15" fill={color} />
      <circle r="15" fill="url(#vp-pin-shade)" />
      <ellipse cx="-5" cy="-6" rx="5.5" ry="4" fill="#ffffffb3" />
    </svg>
  );
}

/** A paw print of the app's tracks (`.logo-tracks`), its toes pointing along them. */
const PAW = "M-9 4C-9-4-3-6 0-6S9-4 9 4 4 10 0 9-9 9-9 4Z";
const TOES: readonly (readonly [number, number, number, number])[] = [
  [-10.5, -8, 3.3, 4.3],
  [-3.8, -13.5, 3.3, 4.6],
  [3.8, -13.5, 3.3, 4.6],
  [10.5, -8, 3.3, 4.3],
];

/**
 * The paw tracks under the address at `t`: a big and a small track walking from its first letter up to the o of „.com“,
 * one print after another, each coming a little bigger and settling – as in the app's title, where they lead to Papa
 * Fox and his child.
 */
function Tracks({ t }: { t: number }) {
  return (
    <svg
      className="vp-tracks"
      viewBox={`0 0 ${TRACK_EMS * TRACK_UNITS} ${TRACK_DEPTH * TRACK_UNITS}`}
      aria-hidden
      style={{ "--track-ems": TRACK_EMS, "--track-depth": TRACK_DEPTH } as CSSProperties}
    >
      {PAW_PRINTS.map((paw, k) => {
        const shown = pawShown(k, t);
        if (shown <= 0) return null;
        const size = (paw.big ? 1.35 : 0.95) * (1 + 0.5 * (1 - shown));
        return (
          <g
            key={k}
            opacity={Math.min(1, shown * 1.6).toFixed(3)}
            fill={paw.big ? "#d9692a" : "#e8914f"}
            transform={`translate(${paw.x} ${paw.y}) rotate(${90 + paw.turn}) scale(${size.toFixed(4)})`}
          >
            <path d={PAW} />
            {TOES.map(([cx, cy, rx, ry]) => (
              <ellipse key={cx} cx={cx} cy={cy} rx={rx} ry={ry} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/** The address with each word's first capital set apart, so its words can be told apart at a glance. */
const lettered = (text: string) =>
  [...text].map((letter, k) =>
    /[A-Z]/.test(letter) ? (
      <span key={k} className="vp-capital">
        {letter}
      </span>
    ) : (
      letter
    ),
  );

/** Where the o of „.com“ stands in the address: Papa Fox and his child sit on it. */
const O_AT = BOARD_ADDRESS.lastIndexOf("o");

/** A photo's picture: whole, or only the part `crop` names (a page's sofa, not the whole room). */
function PhotoPicture({ photo }: { photo: PinnedPhoto }) {
  const { width, height } = PHOTO.picture;
  if (!photo.crop) return <img src={photo.picture} alt="" style={{ width, height }} />;
  const { x, y, width: w } = photo.crop;
  const scale = width / w;
  return (
    <span className="vp-crop" style={{ width, height }}>
      <img src={photo.picture} alt="" style={{ width: photo.crop.of * scale, left: -x * scale, top: -y * scale }} />
    </span>
  );
}

/**
 * One frame of the outro „Pinnwand“ at second `t` (user requests, 27 and 28 November 2026): a cork board filling the
 * picture with every game's photo pinned on it, each in a white frame with a word for what it is, and in the middle a
 * sheet torn from a spiral pad with the address, Papa Fox and his child sitting on the o of „.com“, and under it what the
 * site holds – all of it there from the first frame. Then the address is marked with a highlighter, the paw tracks
 * walk along under it up to the foxes, one print after another, and a red „Free“ stamp comes down beside the line
 * under them – one picture to take in, its words in `language`.
 */
export function PinboardScene({ t, language }: { t: number; language: SeoLanguage }) {
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
      {PINBOARD.map((photo, k) => (
        <div key={photo.href} className="vp-photo" style={pressedStyle(PIN_SLOTS[k]!, FRAME.width, FRAME.height, FLAT)}>
          <PhotoPicture photo={pictureIn(photo, language)} />
          <p className="vp-word" style={{ fontSize: fitted(pick(photoWord(photo), language), 34, 15) }}>
            {pick(photoWord(photo), language)}
          </p>
          <Pin color={PIN_COLORS[k % PIN_COLORS.length]!} pose={FLAT} />
        </div>
      ))}
      <div className="vp-note" style={pressedStyle(NOTE, NOTE.width, NOTE.height, FLAT)}>
        <div className="vp-note-holes" />
        <p className="vp-address">
          <span className="vp-mark" style={{ "--mark": markShown(t).toFixed(3) } as CSSProperties}>
            {lettered(BOARD_ADDRESS.slice(0, O_AT))}
            <span className="vp-o">
              o
              <span className="vp-o-anchor">
                <Tracks t={t} />
                <img src={FOX_O} alt="" />
              </span>
            </span>
            {BOARD_ADDRESS.slice(O_AT + 1)}
          </span>
        </p>
        <p className="vp-line">
          <span className="vp-stamp" style={stampStyle(t)}>
            {pick(FREE, language)}
          </span>
          <span style={{ fontSize: fitted(boardLine(language), 40, 30) }}>{boardLine(language)}</span>
        </p>
        <Pin color={PIN_COLORS[0]} pose={FLAT} left="7%" />
        <Pin color={PIN_COLORS[2]} pose={FLAT} left="93%" />
      </div>
    </div>
  );
}

/** The stamp's look at `t` (`stampPose`): falling onto the sheet, turned as a stamp is pressed on by hand. */
function stampStyle(t: number): CSSProperties {
  const { opacity, scale } = stampPose(t);
  return { opacity, transform: `rotate(-8deg) scale(${scale.toFixed(4)})` };
}

/** A photo with its picture in `language`, where its picture has words in it (Gefühle's page with its choices). */
const pictureIn = (photo: PinnedPhoto, language: SeoLanguage): PinnedPhoto =>
  photo.byLanguage ? { ...photo, picture: photo.byLanguage[language] ?? photo.picture } : photo;

/** Every picture this outro shows, so it can wait until all are decoded before its first frame. */
export const PINBOARD_PICTURES = [...PINBOARD.flatMap((photo) => [photo.picture, ...Object.values(photo.byLanguage ?? {})]), FOX_O].filter(
  (url): url is string => !!url,
);
