import { useId } from "react";
import type { SockLook, SockPattern } from "./content";

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

/** One sock, drawn upright with the cuff on top; it fills the height of its box. */
export function SockDrawing({ look }: { look: SockLook }) {
  // useId may contain characters that don't work inside url(#…).
  const id = `sock${useId().replace(/[^\w-]/g, "")}`;
  const { color, pattern } = look;
  return (
    <svg className="sock-svg" viewBox="0 0 64 96" aria-hidden>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={SOCK_PATH} />
        </clipPath>
        <PatternTile id={`${id}-pattern`} pattern={pattern} color={color.light} />
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <path d={SOCK_PATH} fill={color.main} />
        {pattern !== "plain" && <rect x="0" y="16" width="64" height="80" fill={`url(#${id}-pattern)`} />}
        <circle cx="15" cy="83" r="11" fill={color.light} />
        <circle cx="60" cy="84" r="10" fill={color.light} />
      </g>
      <path d={SOCK_PATH} fill="none" stroke="#00000030" strokeWidth="2" strokeLinejoin="round" />
      <rect x="13" y="5" width="34" height="15" rx="4" fill={color.light} stroke="#00000030" strokeWidth="2" />
      {[20, 26, 32, 38].map((x) => (
        <line key={x} x1={x + 1} y1="8" x2={x + 1} y2="17" stroke={color.main} strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round" />
      ))}
    </svg>
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
