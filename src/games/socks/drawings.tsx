import { useId } from "react";
import type { Side, SockLook, SockPattern } from "./content";

/** The sock's outline in its 64 × 96 box: leg down from the cuff, heel at the left, toe pointing right. */
const SOCK_PATH = "M16 14 H44 V54 Q44 61 51 63 L54 64 Q63 68 61 79 Q59 90 48 89 L26 86 Q11 84 13 69 Z";

const HEART = "M0 2 C-3 -2 -6 1 -4 4 L0 8 L4 4 C6 1 3 -2 0 2 Z";
const STAR = "M0 -5 L1.5 -1.5 L5 -1.5 L2.2 0.8 L3.2 4.5 L0 2.3 L-3.2 4.5 L-2.2 0.8 L-5 -1.5 L-1.5 -1.5 Z";

/** The knitted pattern as an SVG <pattern> tile, in the sock's lighter colour. */
function PatternTile({ id, pattern, color }: { id: string; pattern: SockPattern; color: string }) {
  switch (pattern) {
    case "stripes":
      return (
        <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
          <rect y="0" width="12" height="5" fill={color} />
        </pattern>
      );
    case "dots":
      return (
        <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2.6" fill={color} />
          <circle cx="9" cy="9" r="2.6" fill={color} />
        </pattern>
      );
    case "hearts":
      return (
        <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d={HEART} transform="translate(4 3)" fill={color} />
          <path d={HEART} transform="translate(12 11)" fill={color} />
        </pattern>
      );
    case "stars":
      return (
        <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d={STAR} transform="translate(4 5)" fill={color} />
          <path d={STAR} transform="translate(12 13)" fill={color} />
        </pattern>
      );
    case "zigzag":
      return (
        <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 4 L3 8 L6 4 L9 8 L12 4" fill="none" stroke={color} strokeWidth="2.6" strokeLinejoin="round" />
        </pattern>
      );
    case "plain":
      return null;
  }
}

/** A mitten's outline (the left one): cuff on top, the thumb standing out to the right. */
const MITTEN_PATH = "M14 18 H46 V38 C52 34 60 38 59 48 C58 57 52 60 47 62 V70 C47 86 40 92 30 92 C20 92 13 85 13 72 Z";
/** A rain boot's outline (the left one): the straight shaft, and the foot with its round toe pointing left. */
const BOOT_PATH = "M22 6 H54 L52 64 Q52 72 54 80 V86 H1 V82 Q1 64 20 61 Q26 60 26 52 Z";
/**
 * A bear slipper seen from above (the left one), heel on top and toes below: a foot's shape, its heel to the right and
 * its big toe's side reaching far out to the left, so the left and the right one are told apart at a glance.
 */
const SLIPPER_PATH = "M40 6 C49 6 52 14 51 26 C50 40 51 56 48 72 C45 86 36 93 25 92 C13 91 8 82 10 70 C12 58 24 46 28 30 C31 16 32 6 40 6 Z";

/** One piece of laundry (a sock, mitten, boot or slipper), drawn upright; it fills the height of its box. */
export function SockDrawing({ look, side = "left" }: { look: SockLook; side?: Side }) {
  // useId may contain characters that don't work inside url(#…).
  const id = `sock${useId().replace(/[^\w-]/g, "")}`;
  const { garment, color, pattern } = look;
  const outline = { sock: SOCK_PATH, mitten: MITTEN_PATH, boot: BOOT_PATH, slipper: SLIPPER_PATH }[garment];
  const stroke = { fill: "none", stroke: "#00000030", strokeWidth: 2, strokeLinejoin: "round" } as const;
  return (
    <svg className="sock-svg" viewBox="0 0 64 96" aria-hidden>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={outline} />
        </clipPath>
        <PatternTile id={`${id}-pattern`} pattern={pattern} color={color.light} />
      </defs>
      {/* The right one of a mirrored garment is the left one mirrored; a sock's two are the same. */}
      <g transform={side === "right" && garment !== "sock" ? "matrix(-1 0 0 1 64 0)" : undefined}>
        <g clipPath={`url(#${id}-clip)`}>
          <path d={outline} fill={color.main} />
          {/* A slipper's heel part is the plain felt inside, the bear's head covers the toes; it has no pattern. */}
          {garment === "slipper" && <path d="M0 0 H64 V52 Q30 42 0 56 Z" fill={color.light} />}
          {pattern !== "plain" && garment !== "slipper" && <rect x="0" y="16" width="64" height="80" fill={`url(#${id}-pattern)`} />}
          {garment === "sock" && (
            <>
              <circle cx="15" cy="83" r="11" fill={color.light} />
              <circle cx="60" cy="84" r="10" fill={color.light} />
            </>
          )}
          {/* The rubber's shine down the shaft, and the line where the thumb begins. */}
          {garment === "boot" && <rect x="44" y="12" width="5" height="46" rx="2.5" fill="#ffffff" opacity="0.45" />}
          {garment === "mitten" && <path d="M47 41 Q44 52 47 62" fill="none" stroke="#00000030" strokeWidth="1.6" />}
        </g>
        <path d={outline} {...stroke} />
        {garment === "sock" && <Cuff x={13} y={5} width={34} color={color} />}
        {garment === "mitten" && <Cuff x={11} y={6} width={38} color={color} />}
        {garment === "boot" && (
          <>
            {/* The rim with its pull loop at the back, and the thick sole with a heel. */}
            <path d="M50 8 Q60 4 60 14 Q60 20 53 20" fill="none" stroke={color.main} strokeWidth="4" strokeLinecap="round" />
            <rect x="20" y="3" width="36" height="7" rx="3" fill={color.main} stroke="#00000040" strokeWidth="2" />
            <path d="M0 82 H56 V92 H40 V89 H12 Q1 89 0 85 Z" fill="#5c4b45" stroke="#00000040" strokeWidth="1.5" strokeLinejoin="round" />
          </>
        )}
        {garment === "slipper" && <BearFace color={color} />}
      </g>
    </svg>
  );
}

/** The bear's head on a slipper's toes: round ears, eyes and a snout (the app's mascot, user decision October 2026). */
function BearFace({ color }: { color: SockLook["color"] }) {
  return (
    <>
      <path d="M12 60 Q28 44 49 52" fill="none" stroke="#00000030" strokeWidth="2" strokeLinecap="round" />
      {[17, 43].map((x) => (
        <g key={x}>
          <circle cx={x} cy={53} r="6" fill={color.main} stroke="#00000030" strokeWidth="1.5" />
          <circle cx={x} cy={53} r="3" fill={color.light} />
        </g>
      ))}
      <circle cx="23" cy="66" r="2.4" fill="#3b2a24" />
      <circle cx="37" cy="66" r="2.4" fill="#3b2a24" />
      <ellipse cx="30" cy="75" rx="7" ry="5" fill={color.light} />
      <ellipse cx="30" cy="73" rx="2.8" ry="2" fill="#3b2a24" />
    </>
  );
}

/** The knitted cuff of a sock or mitten, with its ribs. */
function Cuff({ x, y, width, color }: { x: number; y: number; width: number; color: SockLook["color"] }) {
  const ribs = Math.round(width / 8);
  return (
    <>
      <rect x={x} y={y} width={width} height="15" rx="4" fill={color.light} stroke="#00000030" strokeWidth="2" />
      {Array.from({ length: ribs }, (_, i) => {
        const rx = x + ((i + 1) * width) / (ribs + 1);
        return <line key={i} x1={rx} y1={y + 3} x2={rx} y2={y + 12} stroke={color.main} strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round" />;
      })}
    </>
  );
}

/** A wooden clothes peg that holds a sock by its cuff. */
export function Peg() {
  return (
    <svg className="sock-peg" viewBox="0 0 12 28" aria-hidden>
      <rect x="1" y="0" width="10" height="28" rx="3" fill="#e9c48a" stroke="#a0673c" strokeWidth="1.5" />
      <line x1="6" y1="3" x2="6" y2="25" stroke="#a0673c" strokeWidth="1.2" />
      <rect x="0.5" y="10" width="11" height="4" rx="1" fill="#bfc6cf" />
    </svg>
  );
}

/**
 * The washing machine: a white front with knob and lights, and a round door.
 * Behind the glass the drum with water and socks turns while it washes (class
 * `washing` on the machine); `open` swings the door aside.
 */
export function WashingMachine({ looks }: { looks: SockLook[] }) {
  return (
    <svg className="sock-machine-svg" viewBox="0 0 200 236" aria-hidden>
      <rect x="6" y="6" width="188" height="222" rx="18" fill="#f4f7fa" stroke="#9aa7b4" strokeWidth="4" />
      <rect x="6" y="6" width="188" height="44" rx="18" fill="#dde5ec" stroke="#9aa7b4" strokeWidth="4" />
      <rect x="20" y="17" width="44" height="22" rx="6" fill="#ffffff" stroke="#9aa7b4" strokeWidth="2" />
      <circle className="sock-light" cx="120" cy="28" r="6" fill="#3ec300" />
      <circle cx="140" cy="28" r="6" fill="#ffc300" />
      <circle cx="170" cy="28" r="11" fill="#ffffff" stroke="#9aa7b4" strokeWidth="3" />
      <line className="sock-knob" x1="170" y1="28" x2="170" y2="19" stroke="#5c6b7a" strokeWidth="3" strokeLinecap="round" />
      <rect x="22" y="214" width="20" height="10" rx="3" fill="#9aa7b4" />
      <rect x="158" y="214" width="20" height="10" rx="3" fill="#9aa7b4" />
      {/* The drum behind the glass: dark inside, water and the socks going round. */}
      <defs>
        <clipPath id="sock-drum-clip">
          <circle cx="100" cy="136" r="54" />
        </clipPath>
      </defs>
      <circle cx="100" cy="136" r="58" fill="#5c6b7a" />
      <g className="sock-drum" clipPath="url(#sock-drum-clip)">
        <circle cx="100" cy="136" r="54" fill="#8fd3ff" />
        <path d="M46 150 Q73 138 100 150 T154 150 V190 H46 Z" fill="#4fb4ec" />
        {[...looks, ...looks].slice(0, 8).map((look, i, shown) => {
          const angle = (i / shown.length) * Math.PI * 2;
          return (
            <ellipse
              key={i}
              cx={100 + Math.cos(angle) * 30}
              cy={136 + Math.sin(angle) * 30}
              rx="13"
              ry="7"
              transform={`rotate(${(angle * 180) / Math.PI + 30} ${100 + Math.cos(angle) * 30} ${136 + Math.sin(angle) * 30})`}
              fill={look.color.main}
            />
          );
        })}
      </g>
      <g className="sock-door">
        <circle cx="100" cy="136" r="62" fill="none" stroke="#c9d3dc" strokeWidth="14" />
        <circle cx="100" cy="136" r="62" fill="#ffffff33" stroke="#9aa7b4" strokeWidth="3" />
        <path d="M66 108 Q78 92 98 88" fill="none" stroke="#ffffffcc" strokeWidth="6" strokeLinecap="round" />
        <rect x="156" y="128" width="10" height="18" rx="4" fill="#9aa7b4" />
      </g>
    </svg>
  );
}

/** An upside-down laundry basket of woven willow, put over a sock so it can't be seen (100 × 110). */
export function Basket() {
  const clip = `basket${useId().replace(/[^\w-]/g, "")}`;
  return (
    <svg className="sock-basket-svg" viewBox="0 0 100 110" aria-hidden>
      <defs>
        <clipPath id={clip}>
          <path d="M18 8 H82 L95 100 H5 Z" />
        </clipPath>
      </defs>
      <path d="M18 8 H82 L95 100 H5 Z" fill="#e3b46a" stroke="#a8742f" strokeWidth="3" strokeLinejoin="round" />
      <g clipPath={`url(#${clip})`} stroke="#c48f45" strokeWidth="3">
        {/* The weave: bands across, and the willow rods going down between them. */}
        {[22, 36, 50, 64, 78].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} />
        ))}
        {[20, 35, 50, 65, 80].map((x) => (
          <line key={x} x1={x - (50 - x) * 0.05} y1="8" x2={x - (50 - x) * 0.2} y2="100" strokeWidth="2" />
        ))}
      </g>
      {/* Handles near the rim (the rim is at the bottom, since the basket stands upside down). */}
      <rect x="14" y="80" width="18" height="8" rx="4" fill="#7a5223" />
      <rect x="68" y="80" width="18" height="8" rx="4" fill="#7a5223" />
      <rect x="2" y="98" width="96" height="9" rx="4" fill="#c98f3e" stroke="#a8742f" strokeWidth="3" />
      <rect x="15" y="4" width="70" height="8" rx="4" fill="#c98f3e" stroke="#a8742f" strokeWidth="3" />
    </svg>
  );
}
