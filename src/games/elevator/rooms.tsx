import { createContext, useContext, useId, type CSSProperties, type ReactNode } from "react";
import { INK } from "@/games/scenes/shared";
import { HERO, KidHead } from "./kid";
import { ROOM_H, ROOM_L, ROOM_R } from "./layout";
import {
  Bed,
  Block,
  Blocks,
  Boots,
  Bowl,
  ChefHat,
  EggBasket,
  FlourBag,
  Fridge,
  JamJar,
  Mixer,
  Mug,
  Pancakes,
  PaperFold,
  Puddle,
  Pyjama,
  RainHat,
  Raincoat,
  Stove,
  Table,
  Teddy,
  Toilet,
  ToothCup,
  Tub,
  Umbrella,
  star,
} from "./things";

// The rooms. Each one is drawn from ROOM_L to ROOM_R and from -ROOM_H (the ceiling) to 0 (the floor)
// and is placed on its floor by the house. `playing` is the thing being used right now, `used` the ones
// already done, so a room can show the fridge open or the boots gone from the shelf. `taps` counts what
// was done by tapping (two eggs cracked, one boot on …) and `task` is the one being tapped now.

export interface RoomProps {
  playing: string | null;
  used: string[];
  task: string | null;
  taps: Record<string, number>;
}

/** How often a task has been tapped. */
const count = (taps: Record<string, number>, name: string) => taps[name] ?? 0;

const BLOCK_COLOURS = ["#ff6b6b", "#4dabf7", "#ffd43b", "#51cf66"];

export type Weather = "day" | "evening" | "rain";

/** What the windows and the open rooms show outside. */
export const WeatherContext = createContext<Weather>("day");

const W = ROOM_R - ROOM_L;

function Wall({ colour, children }: { colour: string; children?: ReactNode }) {
  return (
    <>
      <rect x={ROOM_L} y={-ROOM_H} width={W} height={ROOM_H} fill={colour} />
      {children}
    </>
  );
}

/** Thin vertical stripes over the whole wall. */
function Stripes({ colour, every = 46 }: { colour: string; every?: number }) {
  return (
    <g fill={colour}>
      {Array.from({ length: Math.ceil(W / every) }, (_, i) => (
        <rect key={i} x={ROOM_L + i * every + every / 2} y={-ROOM_H} width={every / 3} height={ROOM_H} />
      ))}
    </g>
  );
}

function Dots({ colour }: { colour: string }) {
  return (
    <g fill={colour}>
      {Array.from({ length: 22 }, (_, i) =>
        [0, 1, 2].map((row) => <circle key={`${i}-${row}`} cx={ROOM_L + 24 + i * 46 + (row % 2) * 23} cy={-170 + row * 52} r="6" />),
      )}
    </g>
  );
}

function Floorboards({ colour, line }: { colour: string; line: string }) {
  return (
    <>
      <rect x={ROOM_L} y="-16" width={W} height="16" fill={colour} />
      <path d={Array.from({ length: 12 }, (_, i) => `M${ROOM_L + 40 + i * 84} -16 V0`).join(" ")} stroke={line} strokeWidth="2" />
      <rect x={ROOM_L} y="-22" width={W} height="6" fill={line} />
    </>
  );
}

/** What is seen outside, in a window or behind an open room. */
function Outside({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const weather = useContext(WeatherContext);
  if (weather === "evening")
    return (
      <>
        <rect x={x} y={y} width={w} height={h} fill="#364fc7" />
        <rect x={x} y={y + h * 0.6} width={w} height={h * 0.4} fill="#5c4bb5" opacity="0.6" />
        <path d={`M${x + w * 0.66} ${y + h * 0.18} a16 16 0 1 0 14 24 a12 12 0 1 1 -14 -24 Z`} fill="#ffe066" />
        {[0.2, 0.42, 0.86].map((f, i) => (
          <path
            key={f}
            className="el-twinkle"
            style={{ animationDelay: `${i * 0.5}s` }}
            d={star(x + w * f, y + h * (0.25 + (i % 2) * 0.3), 5)}
            fill="#fff3bf"
          />
        ))}
      </>
    );
  if (weather === "rain")
    return (
      <>
        <rect x={x} y={y} width={w} height={h} fill="#a9b6c2" />
        <g className="el-rain-lines" stroke="#e7f5ff" strokeWidth="3" strokeLinecap="round">
          {Array.from({ length: Math.ceil(w / 22) }, (_, i) => (
            <path key={i} d={`M${x + 10 + i * 22} ${y + (i % 3) * 18 - 10} l-6 16 M${x + 4 + i * 22} ${y + 44 + (i % 2) * 20} l-6 16`} />
          ))}
        </g>
      </>
    );
  return (
    <>
      <rect x={x} y={y} width={w} height={h} fill="#a5d8ff" />
      <g fill="#fff">
        <circle cx={x + w * 0.3} cy={y + h * 0.35} r={h * 0.13} />
        <circle cx={x + w * 0.42} cy={y + h * 0.28} r={h * 0.17} />
        <circle cx={x + w * 0.54} cy={y + h * 0.36} r={h * 0.12} />
      </g>
    </>
  );
}

function Window({ x, y = -178, w = 130, h = 104, curtains }: { x: number; y?: number; w?: number; h?: number; curtains?: string }) {
  const id = useId();
  return (
    <>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} rx="4" />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <Outside x={x} y={y} w={w} h={h} />
      </g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill="none" stroke="#fff" strokeWidth="9" />
      <path d={`M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}`} stroke="#fff" strokeWidth="6" />
      <rect x={x - 12} y={y + h} width={w + 24} height="9" rx="3" fill="#dee2e6" />
      {curtains && (
        <>
          <path d={`M${x - 20} ${y - 14} H${x + 22} Q${x + 10} ${y + h * 0.5} ${x + 24} ${y + h + 6} H${x - 20} Z`} fill={curtains} />
          <path
            d={`M${x + w + 20} ${y - 14} H${x + w - 22} Q${x + w - 10} ${y + h * 0.5} ${x + w - 24} ${y + h + 6} H${x + w + 20} Z`}
            fill={curtains}
          />
          <rect x={x - 28} y={y - 18} width={w + 56} height="6" rx="3" fill="#868e96" />
        </>
      )}
    </>
  );
}

/** A lamp hanging from the ceiling. */
function Bulb({ x, length = 40, shade = "#ffd43b" }: { x: number; length?: number; shade?: string }) {
  const y = -ROOM_H + length;
  return (
    <>
      <path d={`M${x} ${-ROOM_H} V${y}`} stroke="#495057" strokeWidth="3" />
      <path d={`M${x - 26} ${y + 20} Q${x - 24} ${y} ${x} ${y} Q${x + 24} ${y} ${x + 26} ${y + 20} Z`} fill={shade} />
      <circle cx={x} cy={y + 22} r="7" fill="#fff9db" />
    </>
  );
}

function Frame({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: ReactNode }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="3" fill="#fff" stroke="#c88b3a" strokeWidth="6" />
      {children}
    </>
  );
}

function Plant({ x, pot = "#e8590c", size = 1 }: { x: number; pot?: string; size?: number }) {
  return (
    <g transform={`translate(${x} 0) scale(${size})`}>
      {[-30, -10, 10, 30].map((a, i) => (
        <ellipse
          key={a}
          cx={a * 0.6}
          cy={-60 - (i % 2) * 14}
          rx="11"
          ry="26"
          fill={i % 2 ? "#2f9e44" : "#40c057"}
          transform={`rotate(${a} ${a * 0.6} -40)`}
        />
      ))}
      <path d="M-22 -40 H22 L17 0 H-17 Z" fill={pot} />
      <rect x="-25" y="-44" width="50" height="9" rx="3" fill={pot} />
    </g>
  );
}

/** A shelf board with brackets from x1 to x2 at height y. */
function Shelf({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <>
      <rect x={x1} y={y} width={x2 - x1} height="8" rx="2" fill="#a0662f" />
      <path d={`M${x1 + 14} ${y + 8} v12 h10 M${x2 - 14} ${y + 8} v12 h-10`} stroke="#868e96" strokeWidth="3" fill="none" />
    </>
  );
}

// ---------- Story 1: hungry ----------

/** The cellar with the big fridge, shelves of jars and crates of apples. */
export function Keller({ playing, used, taps }: RoomProps) {
  const open = playing === "eggs" || playing === "juice";
  return (
    <>
      <Wall colour="#d6cdbf">
        <g stroke="#bfb3a1" strokeWidth="3">
          {Array.from({ length: 8 }, (_, row) => (
            <path
              key={row}
              d={`M${ROOM_L} ${-ROOM_H + row * 26} H${ROOM_R} ${Array.from({ length: 17 }, (_, i) => `M${ROOM_L + i * 64 + (row % 2) * 32} ${-ROOM_H + row * 26} v26`).join(" ")}`}
            />
          ))}
        </g>
      </Wall>
      <Window x={110} y={-196} w={120} h={50} />
      <path d="M140 -196 V-146 M170 -196 V-146 M200 -196 V-146" stroke="#495057" strokeWidth="4" />
      <rect x={ROOM_L} y="-14" width={W} height="14" fill="#8d8478" />
      <Bulb x={520} length={30} shade="#adb5bd" />
      {/* Shelf with jars */}
      <Shelf x1={590} x2={830} y={-120} />
      <Shelf x1={590} x2={830} y={-64} />
      {[
        [610, -120, "#e03131"],
        [652, -120, "#fab005"],
        [694, -120, "#e03131"],
        [760, -120, "#74b816"],
        [800, -120, "#fab005"],
        [620, -64, "#7048e8"],
        [664, -64, "#7048e8"],
        [740, -64, "#e8590c"],
      ].map(([x, y, colour]) => (
        <g key={`${x}${y}`}>
          <rect x={Number(x)} y={Number(y) - 34} width="28" height="34" rx="6" fill={String(colour)} opacity="0.85" />
          <rect x={Number(x) - 2} y={Number(y) - 40} width="32" height="8" rx="2" fill="#ced4da" />
          <rect x={Number(x) + 6} y={Number(y) - 24} width="16" height="10" fill="#fff" opacity="0.7" />
        </g>
      ))}
      {/* Crates of apples and potatoes */}
      {[
        [900, "#fa5252"],
        [978, "#c9a26b"],
      ].map(([x, colour]) => (
        <g key={x}>
          {[-24, -4, 16, -14, 6].map((dx, i) => (
            <circle key={dx} cx={Number(x) + dx} cy={i < 3 ? -54 : -66} r="11" fill={String(colour)} />
          ))}
          <rect x={Number(x) - 40} y="-56" width="72" height="42" rx="3" fill="#c88b3a" />
          <path d={`M${Number(x) - 40} -42 h72 M${Number(x) - 40} -28 h72`} stroke="#8d5a2b" strokeWidth="3" />
        </g>
      ))}
      {/* The sack of flour */}
      {!count(taps, "sack") && (
        <g transform="translate(520 0) scale(1.15)">
          <FlourBag />
        </g>
      )}
      <g className={`el-fridge${open ? " open" : ""}`} transform="translate(300 -10)">
        <Fridge eggs={!count(taps, "eggs") && !used.includes("eggs")} juice={!count(taps, "juice")} />
      </g>
    </>
  );
}

/** The kitchen: the bowl for the batter, the cooker with pan and pot, the mug, and the jam in the cupboard. */
export function Kueche({ playing, used, task, taps }: RoomProps) {
  const t = (name: string) => count(taps, name);
  const flipped = t("flip");
  /** A pancake is in the pan until it is flipped onto the plate. */
  const baking = t("pour") > flipped;
  const flying = task === "flip" && !baking && flipped > 0;
  const cooking = baking ? "pan" : playing === "milk" && !t("milkpour") ? "pot" : null;
  const mugHeld = t("blow") >= 2 && !used.includes("milk");
  return (
    <>
      <Wall colour="#fff3bf">
        <g fill="#fff" opacity="0.9">
          {Array.from({ length: 10 }, (_, i) =>
            [0, 1].map((row) => <rect key={`${i}${row}`} x={300 + i * 60 + row * 30} y={-140 + row * 26} width="26" height="22" rx="3" />),
          )}
        </g>
      </Wall>
      <Window x={100} curtains="#ff8787" />
      {/* Wall cupboards: inside the left one is the jam */}
      <rect x="300" y="-196" width="250" height="56" rx="6" fill="#1971c2" />
      <rect x="304" y="-172" width="117" height="4" fill="#4dabf7" />
      {!t("jar") && (
        <g transform="translate(362 -142) scale(0.62)">
          <JamJar />
        </g>
      )}
      <g className={`el-cupboard-door${t("door") && !used.includes("jam") ? " open" : ""}`} style={{ transformOrigin: "300px 0px" }}>
        <rect x="300" y="-196" width="125" height="56" rx="6" fill="#74c0fc" stroke="#4dabf7" strokeWidth="3" />
        <circle cx="412" cy="-150" r="4" fill="#fff" />
      </g>
      <rect x="425" y="-196" width="125" height="56" rx="6" fill="#74c0fc" stroke="#4dabf7" strokeWidth="3" />
      <circle cx="438" cy="-150" r="4" fill="#fff" />
      <path d="M620 -200 H700 L720 -168 H600 Z" fill="#ced4da" />
      <rect x="632" y="-204" width="56" height="8" fill="#adb5bd" />
      {/* Clock */}
      <circle cx="820" cy="-166" r="24" fill="#fff" stroke="#ff6b6b" strokeWidth="6" />
      <path d="M820 -166 V-180 M820 -166 H832" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {/* Worktops */}
      <rect x="300" y="-86" width="290" height="86" fill="#74c0fc" />
      <rect x="292" y="-94" width="300" height="12" rx="3" fill="#e9b872" />
      <path d="M445 -80 V0" stroke="#4dabf7" strokeWidth="4" />
      {[372, 518].map((x) => (
        <rect key={x} x={x - 14} y="-60" width="28" height="6" rx="3" fill="#fff" />
      ))}
      <rect x="738" y="-86" width="200" height="86" fill="#74c0fc" />
      <rect x="734" y="-94" width="210" height="12" rx="3" fill="#e9b872" />
      <rect x="826" y="-60" width="28" height="6" rx="3" fill="#fff" />
      {/* Fruit bowl */}
      <circle cx="880" cy="-108" r="10" fill="#fa5252" />
      <circle cx="898" cy="-110" r="10" fill="#fab005" />
      <circle cx="916" cy="-106" r="10" fill="#82c91e" />
      <path d="M864 -104 H932 Q928 -94 898 -94 Q868 -94 864 -104 Z" fill="#fff" stroke="#ced4da" strokeWidth="2" />
      {/* The bowl, and what goes into it */}
      {playing === "bowl" && (
        <g transform="translate(385 -94) scale(0.8)">
          <EggBasket eggs={2 - t("crack")} milk={!t("milk")} />
        </g>
      )}
      {playing === "batter" && t("flour") < 2 && (
        <g transform="translate(385 -94) scale(0.7)">
          <FlourBag />
        </g>
      )}
      <g transform="translate(455 -94)">
        <Bowl eggs={t("crack")} milk={t("milk") > 0} flour={t("flour")} mixed={t("mix")} poured={t("pour")} />
      </g>
      {task === "crack" && t("crack") > 0 && (
        <g key={t("crack")} transform="translate(455 -152)">
          <path className="el-shell-l" d="M0 -14 Q-12 -14 -12 0 Q-12 10 0 10 L-3 4 L2 -2 L-2 -8 Z" fill="#fff4e6" stroke="#e8c59a" strokeWidth="2" />
          <path className="el-shell-r" d="M0 -14 Q12 -14 12 0 Q12 10 0 10 L-3 4 L2 -2 L-2 -8 Z" fill="#fff4e6" stroke="#e8c59a" strokeWidth="2" />
          <ellipse className="el-yolk-drop" cx="0" cy="6" rx="6" ry="5" fill="#fab005" />
        </g>
      )}
      {task === "flour" && t("flour") > 0 && (
        <g key={t("flour")} className="el-dust" fill="#fff">
          {[-24, -6, 14, 28].map((dx, i) => (
            <circle key={dx} cx={455 + dx} cy={-140 - (i % 2) * 10} r={10 + (i % 2) * 4} />
          ))}
        </g>
      )}
      <g transform={task === "mix" ? "translate(455 -126)" : "translate(330 -94)"}>
        <Mixer spinning={task === "mix"} />
      </g>
      {!mugHeld && (
        <g transform="translate(556 -94) scale(0.9)">
          <Mug steam={t("milkpour") > 0 && t("blow") < 2} empty={!t("milkpour") || used.includes("milk")} spoon={task === "stir"} />
        </g>
      )}
      {/* The plate for the pancakes */}
      {t("pour") > 0 && !used.includes("batter") && (
        <g transform="translate(810 -94) scale(0.9)">
          <Pancakes plain count={flying ? flipped - 1 : flipped} />
        </g>
      )}
      <Floorboards colour="#e9ecef" line="#ced4da" />
      <g className={cooking ? `el-stove cooking-${cooking}` : "el-stove"} transform="translate(664 0)">
        <Stove cooking={cooking} pancake={baking} />
      </g>
      {flying && (
        <g
          key={flipped}
          className="el-fly"
          style={{ "--dx": "183px", "--dy": `${11 - (flipped - 1) * 8}px` } as CSSProperties}
        >
          <ellipse cx="627" cy="-118" rx="22" ry="6" fill="#d9902f" />
          <ellipse cx="627" cy="-121" rx="22" ry="5" fill="#f4b860" />
        </g>
      )}
    </>
  );
}

/** The children's room: toys on the shelf, the tower of blocks and the raincoat on its hook. */
export function Kinderzimmer({ playing, used, taps }: RoomProps) {
  return (
    <>
      <Wall colour="#d0ebff">
        <Dots colour="#e7f5ff" />
      </Wall>
      <Window x={100} curtains="#ffd43b" />
      <Frame x={320} y={-180} w={80} h={64}>
        <circle cx="342" cy="-160" r="10" fill="#ffd43b" />
        <path d="M330 -124 L356 -150 L376 -132 L388 -142 L396 -124 Z" fill="#51cf66" />
      </Frame>
      {/* Shelf with a ball, a drum and the paper boat */}
      <Shelf x1={440} x2={640} y={-118} />
      <circle cx="470" cy="-138" r="20" fill="#ff6b6b" />
      <path d="M452 -144 Q470 -132 488 -144" stroke="#fff" strokeWidth="4" fill="none" />
      <rect x="512" y="-150" width="36" height="32" rx="6" fill="#4dabf7" />
      <ellipse cx="530" cy="-150" rx="18" ry="5" fill="#e7f5ff" />
      <path d="M584 -118 L594 -146 H626 L636 -118 Z" fill="#ffd43b" />
      <circle cx="610" cy="-150" r="8" fill="#fab005" />
      {/* Rug and the tower of blocks */}
      <ellipse cx="560" cy="-8" rx="200" ry="14" fill="#ffc9c9" />
      <ellipse cx="560" cy="-8" rx="150" ry="9" fill="#ffa8a8" />
      <g className={playing === "tower" ? "el-wobble" : undefined} transform="translate(500 -4)">
        <Blocks />
      </g>
      {/* Toy box */}
      <rect x="690" y="-62" width="96" height="58" rx="6" fill="#9775fa" />
      <rect x="684" y="-70" width="108" height="14" rx="5" fill="#845ef7" />
      <path d="M704 -40 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10" stroke="#fff" strokeWidth="3" fill="none" opacity="0.6" />
      {/* A sheet of paper on the toy box, for the boat */}
      {count(taps, "fold") < 3 && (
        <g transform="translate(738 -70)">
          <g key={count(taps, "fold")} className="el-pop-in">
            <PaperFold stage={count(taps, "fold")} />
          </g>
        </g>
      )}
      {/* Hook with the raincoat */}
      <rect x="868" y="-176" width="44" height="10" rx="4" fill="#a0662f" />
      <circle cx="890" cy="-166" r="5" fill="#868e96" />
      {!count(taps, "coat") && (
        <g transform="translate(890 -20) scale(0.95)">
          <Raincoat />
        </g>
      )}
      {/* Peg with the chef's hat */}
      <rect x="966" y="-128" width="38" height="8" rx="4" fill="#a0662f" />
      {!count(taps, "chefhat") && (
        <g transform="translate(985 -122) scale(0.9)">
          <ChefHat />
        </g>
      )}
      <Floorboards colour="#e9b872" line="#c88b3a" />
    </>
  );
}

/** The roof terrace: open to the sky, a sunshade, plants and the table for the feast. */
export function Terrasse({ playing, used, taps }: RoomProps) {
  const feast = playing === "feast" || used.includes("feast");
  return (
    <>
      <Outside x={ROOM_L} y={-ROOM_H} w={W} h={ROOM_H} />
      {/* Roofs of the town far away */}
      <g fill="#b2bec3">
        <path
          d={`M${ROOM_L} -60 H140 V-110 L170 -130 L200 -110 V-80 H300 V-120 H360 V-70 H460 V-100 L500 -126 L540 -100 V-60 H${ROOM_R} V0 H${ROOM_L} Z`}
        />
        <path d="M720 -60 V-116 H790 V-60 Z M860 -60 V-96 L900 -124 L940 -96 V-60 Z" />
      </g>
      {/* Railing */}
      <rect x={ROOM_L} y="-92" width={W} height="8" rx="3" fill="#fff" />
      <path d={Array.from({ length: 26 }, (_, i) => `M${ROOM_L + 20 + i * 40} -84 V-22`).join(" ")} stroke="#fff" strokeWidth="5" />
      {/* Garland of little flags */}
      <path d="M60 -190 Q300 -140 540 -186 Q780 -140 1020 -190" stroke="#868e96" strokeWidth="2" fill="none" />
      {Array.from({ length: 12 }, (_, i) => {
        const x = 90 + i * 80;
        const y = -178 + Math.sin(((x - 60) / 480) * Math.PI) * 26;
        return (
          <path key={i} d={`M${x - 12} ${y} H${x + 12} L${x} ${y + 22} Z`} fill={["#ff6b6b", "#ffd43b", "#51cf66", "#4dabf7"][i % 4]} />
        );
      })}
      {/* Sunshade */}
      <path d="M260 0 V-150" stroke="#868e96" strokeWidth="6" />
      <path d="M150 -140 Q260 -200 370 -140 Z" fill="#ff8787" />
      <path d="M205 -140 Q240 -186 260 -172 Q280 -186 315 -140 Z" fill="#fff" />
      <Plant x={110} />
      <Plant x={970} pot="#1c7ed6" />
      <Plant x={430} size={0.7} pot="#f08c00" />
      <Floorboards colour="#c88b3a" line="#a0662f" />
      <g transform="translate(640 0)">
        <Table feast={feast} pancakes={3 - count(taps, "bite")} jam={count(taps, "spread")} open={count(taps, "lid") > 0} />
      </g>
    </>
  );
}

// ---------- Story 2: bedtime ----------

/** The living room in the evening: sofa with the teddy, a reading lamp and books. */
export function Wohnzimmer({ used, taps }: RoomProps) {
  const teddy = !count(taps, "teddy") && !used.includes("teddy");
  const tidied = count(taps, "tidy");
  return (
    <>
      <Wall colour="#d3f9d8">
        <Stripes colour="#ebfbee" />
      </Wall>
      <Window x={840} curtains="#748ffc" />
      <Frame x={380} y={-186} w={110} h={66}>
        <path d="M388 -128 Q420 -170 446 -146 Q466 -170 482 -128 Z" fill="#74c0fc" />
        <circle cx="468" cy="-168" r="9" fill="#ffd43b" />
      </Frame>
      {/* Reading lamp, lit */}
      <ellipse cx="160" cy="-120" rx="70" ry="80" fill="#fff3bf" opacity="0.6" />
      <path d="M160 -10 V-150" stroke="#495057" strokeWidth="5" />
      <ellipse cx="160" cy="-6" rx="26" ry="6" fill="#495057" />
      <path d="M130 -150 L142 -188 H178 L190 -150 Z" fill="#ffd43b" />
      {/* Bookshelf */}
      <rect x="650" y="-170" width="130" height="170" rx="4" fill="#a0662f" />
      {[-162, -110, -58].map((y) => (
        <g key={y}>
          <rect x="658" y={y} width="114" height="44" fill="#8d5a2b" />
          {["#e03131", "#1c7ed6", "#fab005", "#2f9e44", "#7048e8"].map((colour, i) => (
            <rect
              key={colour}
              x={662 + i * 20 + (y === -110 ? 10 : 0)}
              y={y + 6 + (i % 2) * 6}
              width="16"
              height={38 - (i % 2) * 6}
              rx="2"
              fill={colour}
            />
          ))}
        </g>
      ))}
      <ellipse cx="460" cy="-8" rx="230" ry="13" fill="#ffd8a8" />
      {/* Sofa */}
      <rect x="300" y="-122" width="320" height="70" rx="26" fill="#f06595" />
      {teddy && (
        <g transform="translate(520 -58) scale(0.85)">
          <Teddy />
        </g>
      )}
      <rect x="320" y="-72" width="280" height="42" rx="14" fill="#f783ac" />
      <path d="M460 -72 V-30" stroke="#e64980" strokeWidth="3" />
      <rect x="282" y="-96" width="44" height="78" rx="18" fill="#e64980" />
      <rect x="594" y="-96" width="44" height="78" rx="18" fill="#e64980" />
      <rect x="300" y="-18" width="14" height="18" fill="#862e9c" />
      <rect x="606" y="-18" width="14" height="18" fill="#862e9c" />
      <Plant x={960} />
      <Floorboards colour="#c88b3a" line="#a0662f" />
      {/* Blocks on the floor, and the toy box they go into */}
      {BLOCK_COLOURS.map(
        (colour, i) =>
          tidied <= i && (
            <g key={colour} transform={`translate(${250 + i * 90} -4)`}>
              <Block colour={colour} />
            </g>
          ),
      )}
      {BLOCK_COLOURS.slice(0, tidied).map((colour, i) => (
        <g key={colour} transform={`translate(${850 + i * 20} -44) scale(0.8)`}>
          <g className="el-drop-in">
            <Block colour={colour} />
          </g>
        </g>
      ))}
      <rect x="834" y="-56" width="96" height="56" rx="6" fill="#9775fa" />
      <rect x="828" y="-62" width="108" height="12" rx="5" fill="#845ef7" />
      <path d="M848 -34 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10 l10 -10 l10 10" stroke="#fff" strokeWidth="3" fill="none" opacity="0.6" />
    </>
  );
}

/** The bathroom: bathtub with a duck, the washbasin with the tooth cup, a towel. */
export function Bad({ playing, task, taps }: RoomProps) {
  const bathing = playing === "bath";
  return (
    <>
      <Wall colour="#e3fafc">
        <path
          d={`${Array.from({ length: 26 }, (_, i) => `M${ROOM_L + i * 40} -110 V0`).join(" ")} ${Array.from({ length: 3 }, (_, i) => `M${ROOM_L} ${-110 + i * 40} H${ROOM_R}`).join(" ")}`}
          stroke="#c5f6fa"
          strokeWidth="4"
        />
        <rect x={ROOM_L} y="-114" width={W} height="6" fill="#66d9e8" />
      </Wall>
      <circle cx="140" cy="-160" r="34" fill="#fff" />
      <clipPath id="el-bad-window">
        <circle cx="140" cy="-160" r="28" />
      </clipPath>
      <g clipPath="url(#el-bad-window)">
        <Outside x={100} y={-200} w={80} h={80} />
      </g>
      {/* Washbasin with mirror and tooth cup */}
      <ellipse cx="730" cy="-164" rx="50" ry="34" fill="#e7f5ff" stroke="#adb5bd" strokeWidth="6" />
      <path d="M708 -178 L724 -194 M716 -170 L740 -194" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <path d="M690 -94 H770 Q766 -64 730 -64 Q694 -64 690 -94 Z" fill="#fff" stroke="#ced4da" strokeWidth="3" />
      <rect x="720" y="-64" width="20" height="64" fill="#fff" stroke="#ced4da" strokeWidth="3" />
      <path d="M730 -94 V-108 H744" stroke="#adb5bd" strokeWidth="6" strokeLinecap="round" fill="none" />
      <rect x="772" y="-108" width="70" height="8" rx="3" fill="#adb5bd" />
      <g transform="translate(796 -108) scale(0.8)">
        <ToothCup brush={playing !== "teeth" || count(taps, "rinse") > 0} />
      </g>
      <g className={task === "scrub" ? "el-foam-bits on" : "el-foam-bits"} fill="#fff" stroke="#a5d8ff" strokeWidth="2">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={710 + i * 20} cy={-120 - (i % 2) * 14} r="7" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </g>
      {/* Towel */}
      <rect x="900" y="-170" width="60" height="8" rx="4" fill="#868e96" />
      <path d="M906 -166 H954 V-90 Q930 -84 906 -90 Z" fill="#ff8787" />
      <path d="M906 -104 H954 M906 -116 H954" stroke="#fff" strokeWidth="4" />
      <rect x={ROOM_L} y="-16" width={W} height="16" fill="#99e9f2" />
      <ellipse cx="560" cy="-8" rx="60" ry="8" fill="#ff8787" opacity="0.7" />
      <g transform="translate(985 0)">
        <Toilet flushing={task === "toilet" && count(taps, "toilet") > 0} />
      </g>
      <g className={bathing ? "el-tub bathing" : "el-tub"} transform="translate(330 -4)">
        <Tub
          soap={count(taps, "soap")}
          quack={count(taps, "duck")}
          bather={
            bathing ? (
              <g transform="translate(-24 34)">
                <g className="el-bather">
                  <KidHead look={HERO} />
                </g>
              </g>
            ) : undefined
          }
        />
      </g>
    </>
  );
}

/** The bedroom: the bed with the star blanket, a night light and the moon outside. */
export function Schlafzimmer({ playing, used, taps }: RoomProps) {
  const sleeping = playing === "bed" || used.includes("bed");
  const dark = count(taps, "light") > 0;
  const slippers = count(taps, "slippers");
  return (
    <>
      <Wall colour="#e5dbff">
        <g fill="#f3f0ff">
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={star(ROOM_L + 40 + i * 70, -160 + (i % 2) * 50, 10)} />
          ))}
        </g>
      </Wall>
      <Window x={120} curtains="#9775fa" />
      {/* Night light on the bedside table */}
      {!dark && <ellipse className="el-night-glow" cx="790" cy="-110" rx="60" ry="50" fill="#fff3bf" opacity="0.7" />}
      <rect x="750" y="-70" width="80" height="70" rx="6" fill="#c88b3a" />
      <rect x="760" y="-50" width="60" height="6" rx="3" fill="#8d5a2b" />
      <path d="M790 -70 V-90" stroke="#868e96" strokeWidth="5" />
      <path d="M766 -90 Q790 -134 814 -90 Z" fill={dark ? "#868e96" : "#ffd43b"} />
      {/* Slippers and rug */}
      <ellipse cx="560" cy="-8" rx="180" ry="12" fill="#b197fc" opacity="0.5" />
      {slippers < 1 && <ellipse cx="390" cy="-8" rx="16" ry="7" fill="#f783ac" />}
      {slippers < 2 && <ellipse cx="416" cy="-6" rx="16" ry="7" fill="#f783ac" />}
      <g transform="translate(560 0)">
        <Bed
          sleeper={
            sleeping ? (
              <>
                <g transform="translate(-66 22) scale(0.75)">
                  <KidHead look={HERO} asleep />
                </g>
                <g transform="translate(-28 -60) scale(0.45)">
                  <Teddy />
                </g>
              </>
            ) : undefined
          }
        />
        {sleeping && (
          <g className="el-zzz" stroke="#5f3dc4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                style={{ animationDelay: `${i * 0.7}s` }}
                d={`M${-50 + i * 26} ${-124 - i * 26} h${14 - i * 2} l${-14 + i * 2} ${16 - i * 2} h${14 - i * 2}`}
              />
            ))}
          </g>
        )}
      </g>
      {!count(taps, "pyjama") && (
        <g transform="translate(650 -84) scale(0.8)">
          <Pyjama />
        </g>
      )}
    </>
  );
}

// ---------- Story 3: puddles ----------

/** The hall: front door, mirror and the shoe rack with the yellow boots. */
export function Flur({ task, taps }: RoomProps) {
  const boots = count(taps, "boots");
  return (
    <>
      <Wall colour="#ffe8cc">
        <Stripes colour="#fff4e6" every={40} />
      </Wall>
      {/* Front door */}
      <rect x="130" y="-190" width="110" height="190" rx="6" fill="#2b8a3e" />
      <rect x="146" y="-176" width="78" height="64" rx="32" fill="#a5d8ff" />
      <path d="M185 -176 V-112" stroke="#fff" strokeWidth="5" />
      <rect x="146" y="-96" width="78" height="80" rx="4" fill="#2f9e44" />
      <circle cx="226" cy="-96" r="7" fill="#fab005" />
      {/* Peg with the rain hat */}
      <rect x="276" y="-182" width="28" height="8" rx="3" fill="#a0662f" />
      {!count(taps, "hat") && (
        <g transform="translate(290 -142)">
          <RainHat />
        </g>
      )}
      {/* Mirror; it sparkles when the child looks in */}
      <ellipse cx="400" cy="-130" rx="42" ry="56" fill="#e7f5ff" stroke="#c88b3a" strokeWidth="8" />
      <path d="M380 -150 L396 -170 M384 -132 L410 -164" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      {task === "mirror" && count(taps, "mirror") > 0 && (
        <g key={count(taps, "mirror")} className="el-sparkle" fill="#ffd43b">
          {[
            [366, -176, 10],
            [440, -160, 8],
            [430, -86, 9],
            [360, -96, 7],
          ].map(([x, y, r]) => (
            <path key={x} d={star(x, y, r)} />
          ))}
        </g>
      )}
      {/* Shoe rack: the boots on top, more shoes below */}
      <rect x="540" y="-84" width="190" height="10" rx="3" fill="#a0662f" />
      <rect x="540" y="-40" width="190" height="8" rx="3" fill="#a0662f" />
      <rect x="544" y="-84" width="10" height="84" fill="#8d5a2b" />
      <rect x="716" y="-84" width="10" height="84" fill="#8d5a2b" />
      <g transform="translate(630 -84)">
        <Boots left={boots < 1} right={boots < 2} />
      </g>
      <path d="M570 -40 Q570 -60 590 -60 H604 Q620 -52 630 -48 V-40 Z" fill="#4dabf7" />
      <path d="M640 -40 Q640 -60 660 -60 H674 Q690 -52 700 -48 V-40 Z" fill="#4dabf7" />
      <ellipse cx="600" cy="-6" rx="24" ry="8" fill="#f783ac" />
      <ellipse cx="660" cy="-6" rx="24" ry="8" fill="#f783ac" />
      <Frame x={820} y={-176} w={70} h={56}>
        <path d="M826 -126 L846 -150 L862 -134 L884 -158 V-126 Z" fill="#69db7c" />
      </Frame>
      <Plant x={960} pot="#1971c2" />
      <Bulb x={480} />
      <Floorboards colour="#d9a066" line="#a0662f" />
    </>
  );
}

/** The attic under the roof: a chest, the umbrella stand, a rocking horse and a cobweb. */
export function Dachboden({ taps }: RoomProps) {
  return (
    <>
      <Wall colour="#e9c79a">
        <path d={Array.from({ length: 26 }, (_, i) => `M${ROOM_L + i * 40} ${-ROOM_H} V0`).join(" ")} stroke="#d9a066" strokeWidth="3" />
      </Wall>
      {/* Slanted roof beams in the corners */}
      <path d={`M${ROOM_L} ${-ROOM_H} H200 L${ROOM_L} -70 Z`} fill="#a0662f" />
      <path d={`M${ROOM_R} ${-ROOM_H} H880 L${ROOM_R} -70 Z`} fill="#a0662f" />
      <path d={`M${ROOM_L} -70 L200 ${-ROOM_H} M${ROOM_R} -70 L880 ${-ROOM_H}`} stroke="#8d5a2b" strokeWidth="10" />
      <path
        d="M70 -204 Q90 -180 70 -166 M70 -204 Q60 -186 44 -180 M70 -204 L52 -160 M60 -190 Q66 -186 72 -192"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        opacity="0.8"
      />
      {/* Round window */}
      <circle cx="520" cy="-150" r="40" fill="#a0662f" />
      <clipPath id="el-attic-window">
        <circle cx="520" cy="-150" r="32" />
      </clipPath>
      <g clipPath="url(#el-attic-window)">
        <Outside x={480} y={-190} w={80} h={80} />
      </g>
      <path d="M520 -182 V-118 M488 -150 H552" stroke="#a0662f" strokeWidth="5" />
      <Bulb x={360} length={34} shade="#adb5bd" />
      {/* Boxes */}
      <rect x="120" y="-60" width="90" height="60" fill="#d9a066" stroke="#a0662f" strokeWidth="3" />
      <rect x="138" y="-104" width="64" height="44" fill="#e9b872" stroke="#a0662f" strokeWidth="3" />
      <path d="M120 -40 H210 M138 -88 H202" stroke="#c88b3a" strokeWidth="5" />
      {/* Chest */}
      <path d="M260 -62 Q260 -96 330 -96 Q400 -96 400 -62 Z" fill="#a0662f" />
      <rect x="260" y="-64" width="140" height="64" rx="4" fill="#8d5a2b" />
      <path d="M290 -96 V0 M370 -96 V0" stroke="#fab005" strokeWidth="6" />
      <rect x="320" y="-60" width="20" height="18" rx="3" fill="#fab005" />
      {/* Umbrella stand */}
      {!count(taps, "umbrella") && (
        <g transform="translate(620 -40)">
          <Umbrella />
        </g>
      )}
      <path d="M648 -40 V-120 Q648 -132 660 -132" stroke="#495057" strokeWidth="6" strokeLinecap="round" fill="none" />
      <rect x="596" y="-70" width="68" height="70" rx="6" fill="#868e96" />
      <path d="M596 -50 H664" stroke="#adb5bd" strokeWidth="5" />
      {/* Rocking horse */}
      <g transform="translate(830 0)">
        <g key={count(taps, "horse")} className={count(taps, "horse") ? "el-rock" : undefined}>
          <path d="M-70 -4 Q0 22 70 -4" stroke="#c92a2a" strokeWidth="8" fill="none" />
          <path d="M-46 -6 L-34 -60 M46 -6 L34 -60" stroke="#fff4e6" strokeWidth="9" strokeLinecap="round" />
          <ellipse cx="0" cy="-70" rx="52" ry="22" fill="#fff4e6" />
          <path d="M34 -84 L54 -132 Q76 -136 82 -116 L64 -100 Z" fill="#fff4e6" />
          <path d="M44 -100 L50 -136 Q36 -124 38 -100 Z" fill="#fab005" />
          <circle cx="66" cy="-120" r="4" fill={INK} />
          <path d="M-52 -74 Q-76 -70 -70 -40" stroke="#fab005" strokeWidth="9" strokeLinecap="round" fill="none" />
          <rect x="-16" y="-96" width="36" height="12" rx="4" fill="#e03131" />
        </g>
      </g>
      <Floorboards colour="#c88b3a" line="#a0662f" />
    </>
  );
}

/** The garden on the ground: hedge, tree, flowers, the frog and the puddles. */
export function Garten({ playing, used, task, taps }: RoomProps) {
  const weather = useContext(WeatherContext);
  const splashing = playing === "splash" && (task === null || task === "jump");
  const sailing = count(taps, "sail") > 0;
  return (
    <>
      <Outside x={ROOM_L} y={-ROOM_H} w={W} h={ROOM_H} />
      {weather !== "rain" && (
        <g className="el-rainbow" fill="none" strokeWidth="14">
          {["#ff6b6b", "#ffa94d", "#ffe066", "#69db7c", "#4dabf7", "#9775fa"].map((colour, i) => (
            <path key={colour} d={`M${300 + i * 14} -40 A${220 - i * 14} ${150 - i * 14} 0 0 1 ${740 - i * 14} -40`} stroke={colour} />
          ))}
        </g>
      )}
      {/* Hedge and fence */}
      <g fill="#2f9e44">
        {Array.from({ length: 21 }, (_, i) => (
          <circle key={i} cx={ROOM_L + i * 50} cy={-70 - (i % 2) * 10} r="34" />
        ))}
      </g>
      <rect x={ROOM_L} y="-70" width={W} height="60" fill="#2f9e44" />
      <path
        d={Array.from({ length: 34 }, (_, i) => `M${ROOM_L + 10 + i * 30} -20 V-60`).join(" ")}
        stroke="#fff"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path d={`M${ROOM_L} -50 H${ROOM_R}`} stroke="#fff" strokeWidth="6" />
      {/* Tree */}
      <rect x="912" y="-120" width="26" height="110" rx="6" fill="#8d5a2b" />
      <circle cx="896" cy="-150" r="40" fill="#37b24d" />
      <circle cx="944" cy="-160" r="44" fill="#40c057" />
      <circle cx="924" cy="-186" r="30" fill="#51cf66" />
      {[
        [890, -150],
        [950, -170],
        [930, -132],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="7" fill="#fa5252" />
      ))}
      {/* Flowers */}
      {[90, 150, 210, 420, 480].map((x, i) => (
        <g key={x}>
          <path d={`M${x} -14 V-44`} stroke="#2b8a3e" strokeWidth="4" />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle
              key={a}
              cx={x + 9 * Math.cos((a * Math.PI) / 180)}
              cy={-50 + 9 * Math.sin((a * Math.PI) / 180)}
              r="7"
              fill={["#ff6b6b", "#ffd43b", "#cc5de8", "#ff922b", "#f783ac"][i]}
            />
          ))}
          <circle cx={x} cy="-50" r="5" fill="#fff3bf" />
        </g>
      ))}
      <rect x={ROOM_L} y="-16" width={W} height="16" fill="#82c91e" />
      <path d={`M${ROOM_L} -16 H${ROOM_R}`} stroke="#66a80f" strokeWidth="4" />
      <g transform="translate(330 0)">
        <Puddle width={120} />
      </g>
      <g className={splashing ? "el-puddle splashing" : "el-puddle"} transform="translate(600 0)">
        <Puddle width={240} boat={sailing || used.includes("splash")} drift={sailing ? count(taps, "puff") : 3} />
      </g>
      <g transform="translate(820 0)">
        <Puddle width={110} />
      </g>
      {/* Frog */}
      <g className={playing === "splash" && !task ? "el-frog jumping" : "el-frog"} transform="translate(760 -4)">
        <g key={count(taps, "frog")} className={count(taps, "frog") ? "el-jump-once" : undefined}>
          <ellipse cx="0" cy="-16" rx="22" ry="16" fill="#51cf66" />
          <circle cx="-10" cy="-32" r="9" fill="#51cf66" />
          <circle cx="10" cy="-32" r="9" fill="#51cf66" />
          <circle cx="-10" cy="-33" r="4.5" fill="#fff" />
          <circle cx="10" cy="-33" r="4.5" fill="#fff" />
          <circle cx="-10" cy="-33" r="2.5" fill={INK} />
          <circle cx="10" cy="-33" r="2.5" fill={INK} />
          <path d="M-10 -18 Q0 -10 10 -18" stroke="#2b8a3e" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="-18" cy="-2" rx="10" ry="4" fill="#40c057" />
          <ellipse cx="18" cy="-2" rx="10" ry="4" fill="#40c057" />
        </g>
      </g>
    </>
  );
}
