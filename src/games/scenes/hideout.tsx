import { createContext, useContext, useId, type ComponentType, type CSSProperties } from "react";
import type { Localized } from "@/lib/language";
import { CHEEK, Eye, Face, INK, sparklePath } from "./shared";
import type { SceneItem, SceneSound } from "./types";
import "./hideout.css";

// Hidden surprises (idea B-01): a door, window, lid or sand pile has a <Hideout>
// in its drawing, and every time the item is tapped something else peeks out of
// it – a cat, a mouse, a present. Guck-guck! The drawings stand on their foot
// point (0, 0) and are about 100 units tall, so a hideout can scale them to fit.

export interface Surprise {
  id: string;
  /** Said after the item's own sentence, after "Guck-guck!": "Da ist ja eine Katze!" */
  found: Localized;
  sound: SceneSound;
  Art: ComponentType;
}

function Katze() {
  return (
    <>
      <path d="M-30 -62 L-26 -98 L-6 -78 Z M30 -62 L26 -98 L6 -78 Z" fill="#f4a261" />
      <path d="M-24 -70 L-23 -88 L-12 -78 Z M24 -70 L23 -88 L12 -78 Z" fill={CHEEK} />
      <ellipse cx="0" cy="-12" rx="30" ry="18" fill="#f4a261" />
      <circle cx="0" cy="-58" r="32" fill="#f4a261" />
      <path d="M-14 -88 q4 10 0 18 M0 -90 v18 M14 -88 q-4 10 0 18" stroke="#e07a2f" strokeWidth="4" strokeLinecap="round" fill="none" />
      <Face cx={0} cy={-56} size={1.1} />
      <path d="M-30 -48 h-14 M-30 -42 h-12 M30 -48 h14 M30 -42 h12" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="-16" cy="-2" rx="11" ry="7" fill="#ffd8a8" />
      <ellipse cx="16" cy="-2" rx="11" ry="7" fill="#ffd8a8" />
    </>
  );
}

function Maus() {
  return (
    <>
      <circle cx="-28" cy="-80" r="20" fill="#adb5bd" />
      <circle cx="28" cy="-80" r="20" fill="#adb5bd" />
      <circle cx="-28" cy="-80" r="12" fill="#ffc9d6" />
      <circle cx="28" cy="-80" r="12" fill="#ffc9d6" />
      <ellipse cx="0" cy="-12" rx="26" ry="16" fill="#adb5bd" />
      <circle cx="0" cy="-52" r="28" fill="#ced4da" />
      <Eye cx={-10} cy={-56} r={4} />
      <Eye cx={10} cy={-56} r={4} />
      <circle cx="0" cy="-42" r="6" fill="#ff8fa3" />
      <path d="M-8 -40 h-22 M-8 -36 l-20 6 M8 -40 h22 M8 -36 l20 6" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M-6 -32 q6 5 12 0" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <ellipse cx="-12" cy="-2" rx="9" ry="6" fill="#ffc9d6" />
      <ellipse cx="12" cy="-2" rx="9" ry="6" fill="#ffc9d6" />
    </>
  );
}

function Hase() {
  return (
    <>
      <ellipse cx="-13" cy="-88" rx="10" ry="26" fill="#f1f3f5" transform="rotate(-10 -13 -88)" />
      <ellipse cx="13" cy="-88" rx="10" ry="26" fill="#f1f3f5" transform="rotate(10 13 -88)" />
      <ellipse cx="-13" cy="-88" rx="5" ry="18" fill="#ffc9d6" transform="rotate(-10 -13 -88)" />
      <ellipse cx="13" cy="-88" rx="5" ry="18" fill="#ffc9d6" transform="rotate(10 13 -88)" />
      <ellipse cx="0" cy="-12" rx="28" ry="17" fill="#e9ecef" />
      <circle cx="0" cy="-48" r="28" fill="#f8f9fa" />
      <Face cx={0} cy={-48} size={1} />
      <path d="M-4 -40 l4 4 l4 -4 Z" fill="#ff8fa3" />
      <ellipse cx="-14" cy="-2" rx="10" ry="6" fill="#fff" />
      <ellipse cx="14" cy="-2" rx="10" ry="6" fill="#fff" />
    </>
  );
}

function Kueken() {
  return (
    <>
      <path d="M-4 -86 q4 -14 10 -4 q4 -10 8 0" stroke="#ffc300" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="0" cy="-36" rx="34" ry="36" fill="#ffd60a" />
      <ellipse cx="-12" cy="-52" rx="10" ry="6" fill="#fff" opacity="0.5" />
      <path d="M-34 -30 q-14 -4 -16 -18 q12 0 18 8 Z M34 -30 q14 -4 16 -18 q-12 0 -18 8 Z" fill="#ffc300" />
      <Eye cx={-11} cy={-46} r={4.5} />
      <Eye cx={11} cy={-46} r={4.5} />
      <path d="M-8 -36 L0 -26 L8 -36 Z" fill="#fb8500" />
      <circle cx="-20" cy="-32" r="5" fill={CHEEK} opacity="0.55" />
      <circle cx="20" cy="-32" r="5" fill={CHEEK} opacity="0.55" />
    </>
  );
}

function Geschenk() {
  return (
    <>
      <rect x="-34" y="-58" width="68" height="58" rx="6" fill="#ef476f" />
      <rect x="-38" y="-70" width="76" height="16" rx="5" fill="#d62f5a" />
      <rect x="-7" y="-70" width="14" height="70" fill="#ffd60a" />
      <path d="M0 -70 C-10 -96 -36 -90 -24 -74 Z M0 -70 C10 -96 36 -90 24 -74 Z" fill="#ffd60a" />
      <circle cx="0" cy="-71" r="6" fill="#ffc300" />
      <rect x="-28" y="-50" width="14" height="40" rx="5" fill="#fff" opacity="0.25" />
      <path className="surprise-sparkle" d={sparklePath(-46, -84, 9)} fill="#ffd60a" />
      <path className="surprise-sparkle" d={sparklePath(46, -64, 7)} fill="#ffd60a" />
    </>
  );
}

function Teddy() {
  return (
    <>
      <circle cx="-24" cy="-80" r="12" fill="#a0673d" />
      <circle cx="24" cy="-80" r="12" fill="#a0673d" />
      <circle cx="-24" cy="-80" r="6" fill="#e0b48a" />
      <circle cx="24" cy="-80" r="6" fill="#e0b48a" />
      <ellipse cx="0" cy="-12" rx="30" ry="18" fill="#a0673d" />
      <circle cx="0" cy="-56" r="30" fill="#b5794a" />
      <ellipse cx="0" cy="-44" rx="14" ry="10" fill="#e0b48a" />
      <ellipse cx="0" cy="-49" rx="5" ry="3.5" fill={INK} />
      <path d="M-5 -40 q5 4 10 0" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <Eye cx={-11} cy={-62} r={4} />
      <Eye cx={11} cy={-62} r={4} />
      <circle cx="-20" cy="-48" r="5" fill={CHEEK} opacity="0.55" />
      <circle cx="20" cy="-48" r="5" fill={CHEEK} opacity="0.55" />
      <path d="M-16 -26 L0 -18 L16 -26 L16 -14 L0 -22 L-16 -14 Z" fill="#4dabf7" />
      <ellipse cx="-16" cy="-2" rx="11" ry="7" fill="#e0b48a" />
      <ellipse cx="16" cy="-2" rx="11" ry="7" fill="#e0b48a" />
    </>
  );
}

function Frosch() {
  return (
    <>
      <ellipse cx="0" cy="-22" rx="38" ry="24" fill="#52b788" />
      <circle cx="-17" cy="-48" r="15" fill="#52b788" />
      <circle cx="17" cy="-48" r="15" fill="#52b788" />
      <circle cx="-17" cy="-50" r="9" fill="#fff" />
      <circle cx="17" cy="-50" r="9" fill="#fff" />
      <Eye cx={-16} cy={-49} r={5} />
      <Eye cx={18} cy={-49} r={5} />
      <path d="M-20 -22 Q0 -8 20 -22" stroke="#2d6a4f" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <circle cx="-26" cy="-26" r="5" fill={CHEEK} opacity="0.55" />
      <circle cx="26" cy="-26" r="5" fill={CHEEK} opacity="0.55" />
      <ellipse cx="-22" cy="-2" rx="13" ry="6" fill="#40916c" />
      <ellipse cx="22" cy="-2" rx="13" ry="6" fill="#40916c" />
    </>
  );
}

function Hund() {
  return (
    <>
      <ellipse cx="0" cy="-12" rx="30" ry="18" fill="#e9c46a" />
      <circle cx="0" cy="-56" r="30" fill="#f4dfb0" />
      <path d="M-26 -78 Q-46 -70 -38 -36 Q-26 -44 -22 -62 Z M26 -78 Q46 -70 38 -36 Q26 -44 22 -62 Z" fill="#9c6644" />
      <ellipse cx="12" cy="-64" rx="10" ry="9" fill="#9c6644" opacity="0.5" />
      <Eye cx={-10} cy={-62} r={4} />
      <Eye cx={10} cy={-62} r={4} />
      <ellipse cx="0" cy="-48" rx="7" ry="5" fill={INK} />
      <path d="M-8 -40 q8 6 16 0" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path className="surprise-tongue" d="M-4 -38 h8 v6 q-4 5 -8 0 Z" fill="#ff8fa3" />
      <ellipse cx="-16" cy="-2" rx="11" ry="7" fill="#f4dfb0" />
      <ellipse cx="16" cy="-2" rx="11" ry="7" fill="#f4dfb0" />
    </>
  );
}

/** Everything that can be hiding; kept to friendly, well-known things a two-year-old can name. */
export const SURPRISES: Surprise[] = [
  { id: "katze", found: { de: "Da ist ja eine Katze!", ru: "Ой, тут котик!" }, sound: "meow", Art: Katze },
  { id: "maus", found: { de: "Da ist ja eine Maus!", ru: "Ой, тут мышка!" }, sound: "squeak", Art: Maus },
  { id: "hase", found: { de: "Da ist ja ein Hase!", ru: "Ой, тут зайчик!" }, sound: "boing", Art: Hase },
  { id: "kueken", found: { de: "Da ist ja ein Küken!", ru: "Ой, тут цыплёнок!" }, sound: "tweet", Art: Kueken },
  { id: "geschenk", found: { de: "Da ist ja ein Geschenk!", ru: "Ой, тут подарок!" }, sound: "twinkle", Art: Geschenk },
  { id: "teddy", found: { de: "Da ist ja ein Teddy!", ru: "Ой, тут мишка!" }, sound: "giggle", Art: Teddy },
  { id: "frosch", found: { de: "Da ist ja ein Frosch!", ru: "Ой, тут лягушка!" }, sound: "croak", Art: Frosch },
  { id: "hund", found: { de: "Da ist ja ein Hund!", ru: "Ой, тут собачка!" }, sound: "bark", Art: Hund },
];

/** While the item plays: what is hiding this time, and when it is out (in ms after the tap). */
export interface Peek {
  surprise: Surprise;
  delayMs: number;
  durationMs: number;
}

export const HideoutContext = createContext<Peek | null>(null);

/** When the surprise of an item is out, from its `hideout` and the length of its animation. */
export function peekTimes(item: SceneItem): Omit<Peek, "surprise"> {
  const [open, close] = item.hideout === true || !item.hideout ? [0.2, 0.8] : item.hideout;
  return { delayMs: open * item.durationMs, durationMs: (close - open) * item.durationMs };
}

/**
 * The opening x, y, w, h (in the drawing's coordinates) where the surprise peeks
 * out of: it rises from the bottom edge and is only seen inside the opening.
 * Draw it behind the door or lid. Outside the item's animation (and in
 * thumbnails) it draws nothing, so the picture stays as it was.
 */
export function Hideout({
  x,
  y,
  w,
  h,
  size,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Height of the surprise; by default it fills the opening. */
  size?: number;
}) {
  const peek = useContext(HideoutContext);
  const id = `hideout-${useId().replace(/[^\w-]/g, "")}`;
  if (!peek) return null;
  const { surprise, delayMs, durationMs } = peek;
  const scale = (size ?? Math.min(w * 1.05, h * 0.95)) / 100;
  const style = { animationDuration: `${durationMs}ms`, animationDelay: `${delayMs}ms` } as CSSProperties;
  return (
    <g className="scene-hideout" data-surprise={surprise.id}>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <g transform={`translate(${x + w / 2} ${y + h}) scale(${scale})`}>
          <g className="scene-surprise" style={style}>
            <surprise.Art />
          </g>
        </g>
      </g>
    </g>
  );
}
