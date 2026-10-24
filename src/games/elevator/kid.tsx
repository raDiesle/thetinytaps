import type { ReactNode } from "react";
import { CHEEK, INK, SKIN } from "@/games/scenes/shared";
import {
  Bed,
  Boat,
  Boots,
  Bowl,
  Breakfast,
  ChefHat,
  EggBasket,
  EmptyPlate,
  Fridge,
  Juice,
  Mug,
  OpenUmbrella,
  Pancakes,
  Pyjama,
  RainHat,
  RainPuddle,
  Raincoat,
  SleepyMoon,
  Stove,
  Table,
  Teddy,
  ToothCup,
  Toothbrush,
  Tub,
  Umbrella,
} from "./things";

// The children of the stories, drawn from the front with their feet at (0, 0), and the thought bubble.
// Poses are classes; their movements are in elevator.css.

export interface Look {
  shirt: string;
  pants: string;
  hair: string;
  curly?: boolean;
}

export const HERO: Look = { shirt: "#ff922b", pants: "#4263eb", hair: "#8d5a3b" };
export const BROTHER: Look = { shirt: "#40c057", pants: "#e8590c", hair: "#f2c14e", curly: true };

/** Height of a child at scale 1, from the feet to the top of the hair. */
export const KID_H = 178;

export type Pose =
  | "stand"
  | "walk"
  | "reach"
  | "stir"
  | "blow"
  | "tummy"
  | "yawn"
  | "shake"
  | "jump"
  | "eat"
  | "sit"
  | "serve"
  | "drink"
  | "brush"
  | "cheer"
  | "build"
  | "hop";

export type Outfit = "pyjama" | "boots" | "coat" | "umbrella" | "chef" | "hat";
export type Holding = "eggs" | "breakfast" | "juice" | "teddy" | "mug" | "toothbrush" | "boat";

/** Held in front with both hands. */
const IN_FRONT: Partial<Record<Holding, { draw: () => ReactNode; scale: number }>> = {
  eggs: { draw: () => <EggBasket />, scale: 0.78 },
  breakfast: { draw: () => <Breakfast />, scale: 0.85 },
  juice: { draw: () => <Juice />, scale: 0.62 },
  teddy: { draw: () => <Teddy />, scale: 0.6 },
};

type Arm = "down" | "up" | "out" | "front" | "belly" | "mouth" | "fork" | "side";

/** The right arm in each position, and where its hand is; the left one is mirrored. */
const ARMS: Record<Arm, { d: string; hand: [number, number] }> = {
  down: { d: "M22 -100 Q34 -80 32 -58", hand: [32, -56] },
  up: { d: "M22 -100 Q40 -116 40 -146", hand: [40, -150] },
  out: { d: "M22 -100 Q40 -96 60 -110", hand: [62, -112] },
  front: { d: "M22 -100 Q34 -80 18 -70", hand: [17, -70] },
  belly: { d: "M22 -100 Q36 -82 12 -74", hand: [10, -74] },
  mouth: { d: "M22 -100 Q44 -98 14 -118", hand: [12, -120] },
  fork: { d: "M22 -100 Q48 -100 30 -116", hand: [28, -118] },
  side: { d: "M22 -100 Q42 -106 40 -96", hand: [40, -94] },
};

function rightArm(pose: Pose, front: boolean): Arm {
  if (pose === "reach" || pose === "stir" || pose === "serve") return "out";
  if (pose === "cheer" || pose === "yawn" || pose === "build") return "up";
  if (pose === "eat") return "fork";
  if (pose === "drink" || pose === "brush") return "mouth";
  if (pose === "tummy") return "belly";
  return front ? "front" : "down";
}

function leftArm(pose: Pose, front: boolean, umbrella: boolean): Arm {
  if (umbrella) return pose === "jump" || pose === "cheer" ? "side" : "down";
  if (pose === "cheer" || pose === "yawn") return "up";
  if (pose === "tummy") return "belly";
  return front ? "front" : "down";
}

/** Hair and face; also used alone in the bathtub, the bed and the bubble. */
export function KidHead({ look, asleep = false }: { look: Look; asleep?: boolean }) {
  return (
    <>
      {look.curly ? (
        <g fill={look.hair}>
          {[-28, -16, 0, 16, 28].map((x, i) => (
            <circle key={x} cx={x} cy={-160 - (i % 2) * 8 + Math.abs(x) * 0.3} r="14" />
          ))}
        </g>
      ) : (
        <path d="M-33 -146 Q-38 -180 0 -180 Q38 -180 33 -146 Z" fill={look.hair} />
      )}
      <circle cx="0" cy="-140" r="32" fill={SKIN} />
      {look.curly ? (
        <path d="M-30 -150 Q-24 -172 0 -170 Q24 -172 30 -150 Q18 -160 8 -154 Q0 -162 -8 -154 Q-18 -160 -30 -150 Z" fill={look.hair} />
      ) : (
        <>
          <path d="M-33 -142 Q-36 -178 0 -178 Q36 -178 33 -142 Q26 -160 8 -158 Q-6 -166 -20 -156 Q-28 -150 -33 -142 Z" fill={look.hair} />
          <path d="M-2 -176 q4 -18 20 -14 q-12 2 -12 14 Z" fill={look.hair} />
        </>
      )}
      <circle cx="-31" cy="-138" r="6" fill={SKIN} />
      <circle cx="31" cy="-138" r="6" fill={SKIN} />
      <circle cx="-19" cy="-127" r="6" fill={CHEEK} opacity="0.55" />
      <circle cx="19" cy="-127" r="6" fill={CHEEK} opacity="0.55" />
      {asleep ? (
        <path d="M-16 -140 q5 4 10 0 M6 -140 q5 4 10 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      ) : (
        <g className="el-eyes">
          <circle cx="-11" cy="-141" r="4.4" fill={INK} />
          <circle cx="11" cy="-141" r="4.4" fill={INK} />
          <circle cx="-9.6" cy="-142.6" r="1.5" fill="#fff" />
          <circle cx="12.4" cy="-142.6" r="1.5" fill="#fff" />
        </g>
      )}
      {!asleep && (
        <g className="el-lids">
          <circle cx="-11" cy="-141" r="6" fill={SKIN} />
          <circle cx="11" cy="-141" r="6" fill={SKIN} />
          <path d="M-16 -140 q5 4 10 0 M6 -140 q5 4 10 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      )}
      <path className="el-smile" d="M-8 -127 Q0 -119 8 -127" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      <ellipse className="el-mouth-open" cx="0" cy="-123" rx="7" ry="8" fill="#a61e4d" />
    </>
  );
}

/** A child. `face` -1 mirrors it, so it turns to where it walks or reaches. */
export function Kid({ look, pose, holding, wear, face }: { look: Look; pose: Pose; holding: Holding | null; wear: Outfit[]; face: 1 | -1 }) {
  const pyjama = wear.includes("pyjama");
  const coat = wear.includes("coat");
  const boots = wear.includes("boots");
  const umbrella = wear.includes("umbrella");
  const chef = wear.includes("chef");
  const hat = wear.includes("hat");
  const front = holding ? IN_FRONT[holding] : undefined;
  const shirt = pyjama ? "#a5d8ff" : look.shirt;
  const pants = pyjama ? "#a5d8ff" : look.pants;
  const right = ARMS[rightArm(pose, !!front)];
  const left = ARMS[leftArm(pose, !!front, umbrella)];
  const sleeve = coat ? "#ffd43b" : shirt;
  const [rx, ry] = right.hand;
  const [lx, ly] = left.hand;
  // At the table the child sits on a stool with its legs dangling; eating, it brings the fork up in front of its face.
  const sitting = pose === "eat" || pose === "sit" || pose === "serve";
  const legH = sitting ? 30 : 50;
  const rightArmEl = (
    <g className="el-arm el-arm-r" style={{ transformOrigin: "22px -100px" }}>
      {holding === "mug" && (
        <g transform={`translate(${rx + 4} ${ry + 14}) scale(0.6)`}>
          <Mug />
        </g>
      )}
      {holding === "toothbrush" && (
        <g transform={`translate(${rx + 2} ${ry + 2}) rotate(-80) scale(0.55)`}>
          <Toothbrush />
        </g>
      )}
      {holding === "boat" && (
        <g transform={`translate(${rx + 2} ${ry + 30}) scale(0.6)`}>
          <Boat />
        </g>
      )}
      <path d={right.d} stroke={sleeve} strokeWidth="14" strokeLinecap="round" fill="none" />
      {pose === "eat" && !holding && (
        <g transform={`translate(${rx} ${ry})`}>
          <path d="M2 2 L-18 -4" stroke="#868e96" strokeWidth="4" strokeLinecap="round" />
          <path d="M-17 -8 L-26 -10 M-18 -4 L-28 -6 M-19 0 L-27 -1" stroke="#868e96" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="-27" cy="-3" rx="9" ry="6" fill="#d9902f" />
          <ellipse cx="-27" cy="-6" rx="9" ry="5" fill="#f4b860" />
          <path d="M-31 -8 Q-27 -10 -23 -8" stroke="#a0522d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      )}
      <circle cx={rx} cy={ry} r="8" fill={SKIN} />
    </g>
  );

  return (
    <g className={`el-kid pose-${pose}`} style={{ transform: `scaleX(${face})` }}>
      <ellipse cx="0" cy="0" rx="34" ry="7" fill="#000" opacity="0.12" />
      <g className="el-kid-body">
        {/* Legs */}
        {[-1, 1].map((s) => (
          <g key={s} className={`el-leg el-leg-${s < 0 ? "l" : "r"}`} style={{ transformOrigin: `${s * 10}px -52px` }}>
            <rect x={s * 11 - 7} y="-54" width="14" height={legH} rx="6" fill={pants} />
            {pyjama && <path d={`M${s * 11 - 7} -36 H${s * 11 + 7} M${s * 11 - 7} -20 H${s * 11 + 7}`} stroke="#74c0fc" strokeWidth="4" />}
            {boots ? (
              <>
                <path
                  d={`M${s * 11 - 9} -30 H${s * 11 + 9} V-4 H${s * 11 + 9 + s * 8} V2 H${s * 11 - 9} Z`}
                  fill="#ffd43b"
                  stroke="#f59f00"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <rect x={s * 11 - 10} y="-33" width="20" height="6" rx="3" fill="#fab005" />
              </>
            ) : (
              <ellipse cx={s * 13} cy={legH - 54} rx="13" ry="7" fill={pyjama ? "#f783ac" : "#495057"} />
            )}
          </g>
        ))}
        {/* Body */}
        {coat ? (
          <>
            <path
              d="M-28 -98 Q-30 -60 -34 -30 H34 Q30 -60 28 -98 Q14 -108 0 -108 Q-14 -108 -28 -98 Z"
              fill="#ffd43b"
              stroke="#f59f00"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d="M0 -106 V-30" stroke="#f59f00" strokeWidth="3" />
            {[-90, -70, -50].map((y) => (
              <circle key={y} cx="7" cy={y} r="3.5" fill="#e8590c" />
            ))}
          </>
        ) : (
          <>
            <rect x="-26" y="-108" width="52" height="62" rx="18" fill={shirt} />
            {pyjama ? (
              <path d="M-24 -92 H24 M-26 -76 H26 M-25 -60 H25" stroke="#74c0fc" strokeWidth="5" />
            ) : (
              <path d="M-10 -82 l4 -9 l4 9 l4 -9 l4 9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" />
            )}
            <path
              className="el-rumble"
              d="M-34 -78 q-6 6 0 12 M-42 -82 q-8 10 0 20 M34 -78 q6 6 0 12 M42 -82 q8 10 0 20"
              stroke={INK}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}
        {front && <g transform={`translate(0 -54) scale(${front.scale})`}>{front.draw()}</g>}
        {/* Arms */}
        <g className="el-arm el-arm-l" style={{ transformOrigin: "-22px -100px" }}>
          {/* Drawn as a right arm and mirrored */}
          <g transform="scale(-1 1)">
            <path d={left.d} stroke={sleeve} strokeWidth="14" strokeLinecap="round" fill="none" />
            <circle cx={lx} cy={ly} r="8" fill={SKIN} />
            {umbrella &&
              (left === ARMS.side ? (
                <g transform={`translate(${lx} ${ly + 4}) rotate(12) scale(0.74)`}>
                  <OpenUmbrella />
                </g>
              ) : (
                <g transform={`translate(${lx + 4} 2) scale(0.42)`}>
                  <Umbrella />
                </g>
              ))}
          </g>
        </g>
        {!sitting && rightArmEl}
        {/* Head */}
        <rect x="-7" y="-116" width="14" height="12" fill={SKIN} />
        <g className="el-head" style={{ transformOrigin: "0px -108px" }}>
          {coat && <path d="M-36 -136 Q-40 -176 0 -178 Q40 -176 36 -136 Q34 -106 0 -104 Q-34 -106 -36 -136 Z" fill="#fab005" />}
          <KidHead look={look} />
          {pyjama && <path d="M-20 -176 Q0 -200 30 -186 L36 -160 Q10 -172 -20 -176 Z" fill="#74c0fc" />}
          {pyjama && <circle cx="38" cy="-160" r="6" fill="#fff" />}
          {chef && (
            <g transform="translate(0 -160) scale(0.95)">
              <ChefHat />
            </g>
          )}
          {hat && (
            <g transform="translate(0 -156)">
              <RainHat />
            </g>
          )}
        </g>
        {sitting && rightArmEl}
      </g>
    </g>
  );
}

export type PicId =
  | "plate"
  | "pancakes"
  | "fridge"
  | "stove"
  | "brother"
  | "juice"
  | "table"
  | "moon"
  | "tub"
  | "mug"
  | "toothcup"
  | "teddy"
  | "bed"
  | "rain"
  | "boots"
  | "coat"
  | "umbrella"
  | "boat"
  | "chefhat"
  | "bowl"
  | "pyjama"
  | "hat";

/** What can show in a thought bubble: the drawing and its size. */
export const PICTURES: Record<PicId, { w: number; h: number; draw: () => ReactNode }> = {
  plate: { w: 150, h: 44, draw: () => <EmptyPlate /> },
  pancakes: { w: 90, h: 50, draw: () => <Pancakes /> },
  fridge: { w: 126, h: 186, draw: () => <Fridge /> },
  stove: { w: 210, h: 190, draw: () => <Stove /> },
  brother: {
    w: 80,
    h: 80,
    draw: () => (
      <g transform="translate(0 106)">
        <KidHead look={BROTHER} />
      </g>
    ),
  },
  juice: { w: 40, h: 86, draw: () => <Juice /> },
  table: { w: 360, h: 124, draw: () => <Table /> },
  moon: {
    w: 140,
    h: 120,
    draw: () => (
      <g transform="translate(-10 0)">
        <SleepyMoon />
      </g>
    ),
  },
  tub: { w: 240, h: 140, draw: () => <Tub /> },
  mug: { w: 60, h: 44, draw: () => <Mug /> },
  toothcup: { w: 70, h: 96, draw: () => <ToothCup /> },
  teddy: { w: 80, h: 100, draw: () => <Teddy /> },
  bed: { w: 260, h: 150, draw: () => <Bed /> },
  rain: { w: 150, h: 122, draw: () => <RainPuddle /> },
  boots: { w: 90, h: 64, draw: () => <Boots /> },
  coat: { w: 100, h: 146, draw: () => <Raincoat /> },
  umbrella: { w: 40, h: 150, draw: () => <Umbrella /> },
  boat: { w: 84, h: 64, draw: () => <Boat /> },
  chefhat: { w: 90, h: 84, draw: () => <ChefHat /> },
  bowl: { w: 116, h: 64, draw: () => <Bowl eggs={2} flour={1} /> },
  pyjama: { w: 80, h: 50, draw: () => <Pyjama /> },
  hat: { w: 112, h: 56, draw: () => <RainHat /> },
};

/** A thought bubble with a picture, above the head of a child of height `height`. It pops up once; every new `nudge`
 * runs a yellow light once along its outline, to remind the child of the wish. */
export function Bubble({ pic, height, nudge = 0 }: { pic: PicId; height: number; nudge?: number }) {
  const { w, h, draw } = PICTURES[pic];
  const s = Math.min(150 / w, 104 / h);
  const puffs: [number, number, number][] = [
    [-58, 4, 46],
    [-20, -30, 50],
    [30, -30, 48],
    [64, 4, 44],
    [28, 36, 46],
    [-24, 36, 46],
    [60, 86, 12],
    [76, 104, 7],
  ];
  return (
    <g transform={`translate(-78 ${-height - 112})`}>
      <g className="el-bubble" style={{ transformOrigin: "76px 104px" }}>
        {puffs.map(([x, y, r]) => (
          <circle key={`o${x}${y}`} cx={x} cy={y} r={r + 4} fill={INK} />
        ))}
        {/* Dashes on every puff's rim; the white puffs on top leave only the part on the outline visible. */}
        {nudge > 0 && (
          <g key={nudge} className="el-bubble-trace" fill="none" stroke="#ffd43b" strokeWidth="12" strokeDasharray="14 11" strokeLinecap="round">
            {puffs.map(([x, y, r]) => (
              <circle key={`t${x}${y}`} cx={x} cy={y} r={r + 3} pathLength={100} />
            ))}
          </g>
        )}
        {puffs.map(([x, y, r]) => (
          <circle key={`i${x}${y}`} cx={x} cy={y} r={r} fill="#fff" />
        ))}
        <g transform={`translate(0 ${(h * s) / 2}) scale(${s})`}>{draw()}</g>
      </g>
    </g>
  );
}
