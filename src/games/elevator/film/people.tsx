import type { ReactNode } from "react";
import { INK, SKIN } from "@/games/scenes/shared";
import { FIRE_BLUE, FIRE_STRIPE, FireHelmet, KidHead, type Look } from "../kid";

// The grown-ups of the films, drawn from the front with their feet at (0, 0), facing right. They use the class
// names of the children (`el-kid`, `pose-…`, `el-arm-r` …), so the poses of elevator.css move them the same way.

/** What a grown-up does: the arms of `cheer` wave, `walk` swings legs and arms, `phone` holds the phone to the ear,
 * `hold` carries something in front of the chest (`holding`). */
export type GrownPose = "stand" | "walk" | "cheer" | "phone" | "hold";

/** The firefighters and the people they help. */
export const CREW: Look[] = [
  { shirt: "#f76707", pants: "#495057", hair: "#5c3d2e" },
  { shirt: "#12b886", pants: "#364fc7", hair: "#e8b04b", curly: true },
];
export const NEIGHBOUR: Look = { shirt: "#e64980", pants: "#5f3dc4", hair: "#343a40", curly: true };
export const RESIDENT: Look = { shirt: "#fab005", pants: "#1971c2", hair: "#a0522d" };
export const DRIVER: Look = { shirt: "#7950f2", pants: "#2b8a3e", hair: "#c2410c", curly: true };

const ARMS = {
  down: { d: "M24 -188 Q40 -150 36 -112", hand: [36, -110] },
  up: { d: "M24 -188 Q46 -214 44 -256", hand: [44, -260] },
  front: { d: "M24 -188 Q44 -150 16 -136", hand: [14, -136] },
  ear: { d: "M24 -188 Q58 -196 36 -228", hand: [34, -230] },
} as const;

/** A grown-up; `face` -1 turns it left. With `wear` "fire" it is a firefighter, with "blanket" a warm blanket lies
 * round its shoulders. */
export function Grownup({
  look,
  pose,
  wear = [],
  face = 1,
  holding,
}: {
  look: Look;
  pose: GrownPose;
  wear?: ("fire" | "blanket")[];
  face?: 1 | -1;
  holding?: ReactNode;
}) {
  const fire = wear.includes("fire");
  const shirt = fire ? FIRE_BLUE : look.shirt;
  const pants = fire ? FIRE_BLUE : look.pants;
  const right = ARMS[pose === "phone" ? "ear" : pose === "cheer" ? "up" : pose === "hold" ? "front" : "down"];
  const left = ARMS[pose === "cheer" ? "up" : pose === "hold" ? "front" : "down"];
  const arm = (a: (typeof ARMS)[keyof typeof ARMS], className: string, origin: string, mirror: boolean) => (
    <g className={`el-arm ${className}`} style={{ transformOrigin: origin }}>
      <g transform={mirror ? "scale(-1 1)" : undefined}>
        <path d={a.d} stroke={shirt} strokeWidth="17" strokeLinecap="round" fill="none" />
        <circle cx={a.hand[0]} cy={a.hand[1]} r="10" fill={SKIN} />
        {!mirror && pose === "phone" && (
          <rect x={a.hand[0] - 12} y={a.hand[1] - 22} width="16" height="34" rx="4" fill="#343a40" stroke={INK} strokeWidth="2" />
        )}
      </g>
    </g>
  );
  return (
    <g className={`el-kid pose-${pose === "phone" || pose === "hold" ? "stand" : pose}`} style={{ transform: `scaleX(${face})` }}>
      <ellipse cx="0" cy="0" rx="42" ry="8" fill="#000" opacity="0.12" />
      <g className="el-kid-body">
        {[-1, 1].map((s) => (
          <g key={s} className={`el-leg el-leg-${s < 0 ? "l" : "r"}`} style={{ transformOrigin: `${s * 12}px -98px` }}>
            <rect x={s * 13 - 9} y="-102" width="18" height="98" rx="8" fill={pants} />
            {fire && <path d={`M${s * 13 - 9} -40 H${s * 13 + 9}`} stroke={FIRE_STRIPE} strokeWidth="6" />}
            <ellipse cx={s * 15} cy="-4" rx="16" ry="8" fill={fire ? "#212529" : "#495057"} />
          </g>
        ))}
        <rect x="-32" y="-202" width="64" height="110" rx="22" fill={shirt} />
        {fire && <path d="M-32 -116 H32 M-32 -132 H32" stroke={FIRE_STRIPE} strokeWidth="6" />}
        {arm(left, "el-arm-l", "-24px -188px", true)}
        {holding && <g transform="translate(0 -122)">{holding}</g>}
        {wear.includes("blanket") && (
          <g>
            <path d="M-40 -200 Q0 -214 40 -200 L44 -100 Q0 -88 -44 -100 Z" fill="#e03131" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path d="M-42 -170 H42 M-43 -136 H43 M-20 -206 V-94 M20 -206 V-94" stroke="#ffc9c9" strokeWidth="5" opacity="0.8" />
          </g>
        )}
        {arm(right, "el-arm-r", "24px -188px", false)}
        <rect x="-8" y="-212" width="16" height="14" fill={SKIN} />
        <g className="el-head" style={{ transformOrigin: "0px -206px" }}>
          <g transform="translate(0 -120) scale(0.8)">
            <KidHead look={look} />
            {fire && <FireHelmet />}
          </g>
        </g>
      </g>
    </g>
  );
}
