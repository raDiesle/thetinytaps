import type { CSSProperties } from "react";
import { CHEEK, Eye } from "@/games/scenes/shared";

const MANE = "#c8641b";
const LION = "#f0b35a";
const MUZZLE = "#fbe3a1";
const MOUSE = "#b9b4c9";
const MOUSE_DARK = "#9a94ad";
const PINK = "#ffb3c6";
const BROWN = "#6f4518";

/** The lion sitting, facing the child; feet at (0, 0). Roaring opens the big mouth. */
export function Lion() {
  return (
    <g className="ll-lion-body">
      <g className="ll-lion-tail" style={{ transformOrigin: "70px -30px" }}>
        <path d="M70 -30 Q150 -20 150 -90 Q150 -130 175 -140" stroke={LION} strokeWidth="14" fill="none" strokeLinecap="round" />
        <ellipse cx="180" cy="-148" rx="17" ry="22" fill={MANE} />
      </g>
      {[-1, 1].map((s) => (
        <ellipse key={s} cx={s * 82} cy="-34" rx="48" ry="34" fill={LION} />
      ))}
      <ellipse cx="0" cy="-118" rx="96" ry="112" fill={LION} />
      <ellipse cx="0" cy="-96" rx="56" ry="78" fill={MUZZLE} />
      {[-1, 1].map((s) => (
        <g key={s}>
          <rect x={s * 34 - 18} y="-130" width="36" height="128" rx="16" fill={LION} />
          <ellipse cx={s * 34} cy="-8" rx="26" ry="14" fill="#e9a24c" />
          <path d={`M${s * 34 - 8} -14 v8 M${s * 34 + 8} -14 v8`} stroke="#c8841b" strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
      <g className="ll-lion-head" style={{ transformOrigin: "0px -200px" }}>
        <g className="ll-lion-mane" style={{ transformOrigin: "0px -250px" }}>
          {Array.from({ length: 14 }, (_, i) => (
            <circle key={i} cx={96 * Math.cos((i * Math.PI) / 7)} cy={-250 + 96 * Math.sin((i * Math.PI) / 7)} r="36" fill={i % 2 ? MANE : "#b5561a"} />
          ))}
          <circle cx="0" cy="-250" r="100" fill={MANE} />
        </g>
        {[-1, 1].map((s) => (
          <g key={s} className="ll-lion-ear" style={{ transformOrigin: `${s * 52}px -296px` }}>
            <circle cx={s * 56} cy="-306" r="22" fill={LION} />
            <circle cx={s * 56} cy="-306" r="11" fill="#e9a24c" />
          </g>
        ))}
        <circle cx="0" cy="-250" r="72" fill={LION} />
        <ellipse cx="0" cy="-214" rx="42" ry="30" fill={MUZZLE} />
        <circle cx="-44" cy="-228" r="11" fill={CHEEK} opacity="0.45" />
        <circle cx="44" cy="-228" r="11" fill={CHEEK} opacity="0.45" />
        <g className="ll-lion-eyes" style={{ transformOrigin: "0px -264px" }}>
          <Eye cx={-27} cy={-264} r={9} />
          <Eye cx={27} cy={-264} r={9} />
        </g>
        <path className="ll-lion-brows" d="M-40 -284 q13 -8 26 0 M14 -284 q13 -8 26 0" stroke={BROWN} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path
          className="ll-lion-smile"
          d="M0 -222 V-212 M0 -212 Q-12 -202 -22 -210 M0 -212 Q12 -202 22 -210"
          stroke={BROWN}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <g className="ll-lion-roar" style={{ transformOrigin: "0px -214px" }}>
          <ellipse cx="0" cy="-196" rx="30" ry="30" fill="#9d0208" />
          <path d="M-22 -218 l6 12 l6 -12 M10 -218 l6 12 l6 -12" fill="#fff" />
          <ellipse cx="0" cy="-180" rx="17" ry="10" fill="#ff8fa3" />
        </g>
        <path d="M-12 -234 H12 L0 -222 Z" fill={BROWN} />
      </g>
    </g>
  );
}

/** The little mouse sitting, facing the child; feet at (0, 0). Squeaking opens the tiny mouth. */
export function Mouse() {
  return (
    <g className="ll-mouse-body" style={{ transformOrigin: "0px 0px" }}>
      <path
        className="ll-mouse-tail"
        d="M28 -14 Q86 -4 84 -46 Q82 -74 104 -78"
        stroke={PINK}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        style={{ transformOrigin: "28px -14px" }}
      />
      <ellipse cx="0" cy="-44" rx="40" ry="46" fill={MOUSE} />
      <ellipse cx="0" cy="-38" rx="25" ry="32" fill="#ece8f2" />
      {[-1, 1].map((s) => (
        <ellipse key={s} cx={s * 20} cy="-4" rx="16" ry="7" fill={PINK} />
      ))}
      {[-1, 1].map((s) => (
        <ellipse key={s} cx={s * 18} cy="-60" rx="9" ry="12" fill={MOUSE_DARK} />
      ))}
      <g className="ll-mouse-head" style={{ transformOrigin: "0px -80px" }}>
        {[-1, 1].map((s) => (
          <g key={s} className="ll-mouse-ear" style={{ transformOrigin: `${s * 20}px -120px`, "--s": s } as CSSProperties}>
            <circle cx={s * 32} cy="-138" r="25" fill={MOUSE} />
            <circle cx={s * 32} cy="-138" r="16" fill={PINK} />
          </g>
        ))}
        <circle cx="0" cy="-108" r="34" fill={MOUSE} />
        <circle cx="-20" cy="-98" r="6" fill={CHEEK} opacity="0.55" />
        <circle cx="20" cy="-98" r="6" fill={CHEEK} opacity="0.55" />
        <Eye cx={-12} cy={-114} r={5.5} />
        <Eye cx={12} cy={-114} r={5.5} />
        <g className="ll-mouse-whiskers" style={{ transformOrigin: "0px -100px" }}>
          <path d="M-8 -100 L-40 -106 M-8 -97 L-40 -94 M8 -100 L40 -106 M8 -97 L40 -94" stroke={MOUSE_DARK} strokeWidth="2" strokeLinecap="round" />
        </g>
        <path className="ll-mouse-smile" d="M-6 -92 Q0 -87 6 -92" stroke="#2b2d42" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <ellipse className="ll-mouse-squeak" cx="0" cy="-89" rx="5" ry="6" fill="#9d0208" style={{ transformOrigin: "0px -92px" }} />
        <circle cx="0" cy="-101" r="5.5" fill="#ff7096" />
      </g>
    </g>
  );
}

/** A flat-topped tree for the savanna. */
export function Acacia() {
  return (
    <g>
      <path d="M-10 0 Q-6 -80 -40 -150 M-4 -60 Q20 -110 50 -150" stroke="#8d5a2b" strokeWidth="16" fill="none" strokeLinecap="round" />
      <path d="M-8 0 Q-4 -60 -2 -100" stroke="#8d5a2b" strokeWidth="22" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="-160" rx="130" ry="30" fill="#6a994e" />
      <ellipse cx="-30" cy="-176" rx="80" ry="22" fill="#7cb15a" />
    </g>
  );
}

/** Three blades of grass. */
export function Tuft({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x - 12} ${y} Q${x - 14} ${y - 18} ${x - 22} ${y - 26} M${x} ${y} Q${x} ${y - 22} ${x + 2} ${y - 34} M${x + 12} ${y} Q${x + 14} ${y - 18} ${x + 22} ${y - 24}`}
      stroke="#4f772d"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
  );
}
