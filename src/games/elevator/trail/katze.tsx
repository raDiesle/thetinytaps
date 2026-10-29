import type { ReactNode } from "react";
import { Cloud, INK } from "@/games/scenes/shared";
import { Bone, Cat, Torch, Yarn } from "./items";
import type { Point, SceneryProps } from "./types";

// "Wo ist die Katze?" (G-04): the cat jumps out of the child's arms and runs up the stairwell, and the world rolls up
// instead of sideways. The house is seen cut open from the front: the stairs zigzag up between the walls, one flight
// per floor, and the way turns round on the landings (`turns` of the level). Ground floor: the front door and a torch
// on the shelf. 1st floor (right): the dog's door with its bowl and a bone; the dog sits on the stairs up. 2nd floor
// (left): the child rings at Oma's door and she rolls out a ball of wool. 3rd floor (right): a ladder up through the
// hatch. The attic is dark; in the torchlight the cat sits in a basket with three kittens, who want to play.
// Everything here is drawn where it is on the screen (x 0 to 1600, the camera only goes up); the ground of the level
// is the way walked, which turns round at each landing.

/** The height of each floor: the ground floor, the 1st to 3rd floor and the attic. */
export const FLOOR = [740, 300, -140, -580, -1020];

/** The stairs between two floors run from x 560 to 1040 on the screen, in eight steps. */
const STAIR_LOW = 560;
const STAIR_HIGH = 1040;
const STEPS = 8;
/** The inner sides of the outer walls. */
const WALL_L = 40;
const WALL_R = 1560;
/** The floors are this thick where they are cut. */
const SLAB = 36;

// The way walked (the ground's x) at its corners. Up to the first turn it is where it is drawn; after each turn it
// goes back the other way (see `placed` in ground.ts).
/** Where the way turns round: by the dog's bowl (1st floor), at the yarn (2nd floor) and at the top of the ladder. */
export const TURNS = [1340, 2376, 3552];

/** The rungs of the ladder from the 3rd floor up into the attic, as points of the way walked. */
export const LADDER: Point[] = Array.from({ length: 8 }, (_, i) => [3524 + 4 * i, FLOOR[3] - 55 * (i + 1)]);

/** The way through the house: the ground floor, up to the 1st floor, back up to the 2nd, up to the 3rd, the ladder,
 * and across the attic. */
export const KATZE_GROUND: Point[] = [
  [0, FLOOR[0]],
  [STAIR_LOW, FLOOR[0]],
  [STAIR_HIGH, FLOOR[1]],
  [TURNS[0], FLOOR[1]],
  [1640, FLOOR[1]],
  [2120, FLOOR[2]],
  [TURNS[1], FLOOR[2]],
  [2632, FLOOR[2]],
  [3112, FLOOR[3]],
  [3520, FLOOR[3]],
  ...LADDER,
  [4980, FLOOR[4]],
];

/** Where the cat sits in its basket in the attic (it looks left there). */
export const CAT_AT: Point = [450, FLOOR[4] - 30];

/** Where the bone goes, into the dog's mouth, and the dog's thought bubble above its head. */
export const DOG_MOUTH: Point = [988, 126];
export const DOG_WANTS: Point = [970, 60];

const WALL = "#c3fae8";
const WALL_LOW = "#96f2d7";
const ATTIC_WALL = "#e9c891";
const CUT = "#adb5bd";
const WOOD = "#c08552";
const WOOD_DARK = "#8d5a3b";
const TREAD = "#e0a46c";
const ROOF = "#e8590c";
/** The ridge of the roof and its eaves at the sides. */
const RIDGE: Point = [800, -1640];
const EAVES = -1180;

/** The windows in the back wall, where the town outside is seen: left, top, width, height. */
const WINDOWS: [number, number, number, number][] = [
  [180, FLOOR[1] - 270, 180, 160],
  [740, 200, 120, 150],
  [1240, FLOOR[2] - 270, 180, 160],
  [740, -250, 120, 150],
  [180, FLOOR[3] - 270, 180, 160],
  [740, -720, 120, 150],
];

/** A wobble when a wrong thing is tried; keyed so every try starts it anew. */
function Nope({ id, nope, children }: { id: string; nope: SceneryProps["nope"]; children: ReactNode }) {
  const on = nope?.id === id;
  return (
    <g key={on ? nope.n : 0} className={on ? "tl-nope" : undefined}>
      {children}
    </g>
  );
}

/** The back wall of the stairwell and the attic, with holes for the windows (the town shows through them). */
function BackWall() {
  const outer = `M${WALL_L} ${FLOOR[0]} V${EAVES} L${RIDGE[0]} ${RIDGE[1]} L${WALL_R} ${EAVES} V${FLOOR[0]} Z`;
  const holes = WINDOWS.map(([x, y, w, h]) => `M${x} ${y} h${w} v${h} h${-w} Z`).join(" ");
  return (
    <g>
      <path d={`${outer} ${holes}`} fillRule="evenodd" fill={WALL} />
      {/* The darker lower part of the wall on every floor */}
      {FLOOR.slice(0, 4).map((y) => (
        <rect key={y} x={WALL_L} y={y - 90} width={WALL_R - WALL_L} height="90" fill={WALL_LOW} opacity="0.7" />
      ))}
      {/* The attic: wooden boards under the roof, and two beams */}
      <path d={`M${WALL_L} ${FLOOR[4]} V${EAVES} L${RIDGE[0]} ${RIDGE[1]} L${WALL_R} ${EAVES} V${FLOOR[4]} Z`} fill={ATTIC_WALL} />
      {[200, 440, 680, 920, 1160, 1400].map((x) => (
        <path key={x} d={`M${x} ${FLOOR[4]} V${-1300 - Math.max(0, 300 - Math.abs(x - RIDGE[0]) / 2)}`} stroke="#d9a066" strokeWidth="5" />
      ))}
      <path d={`M300 ${FLOOR[4]} V-1390 M1300 ${FLOOR[4]} V-1390 M220 -1350 H1380`} stroke={WOOD_DARK} strokeWidth="22" />
      {WINDOWS.map(([x, y, w, h]) => (
        <g key={`${x}${y}`} fill="none" stroke="#fff" strokeLinejoin="round">
          <rect x={x} y={y} width={w} height={h} strokeWidth="14" />
          <path d={`M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}`} strokeWidth="8" />
          <rect x={x - 7} y={y - 7} width={w + 14} height={h + 14} stroke={INK} strokeWidth="3" />
          <rect x={x - 14} y={y + h + 4} width={w + 28} height="12" rx="4" fill="#fff" stroke={INK} strokeWidth="3" />
        </g>
      ))}
    </g>
  );
}

/** One flight of stairs from (x0, y0) up to (x1, y1), with its banister; the way walked runs through the treads' middles. */
function Flight({ x0, y0, x1, y1 }: { x0: number; y0: number; x1: number; y1: number }) {
  const run = (x1 - x0) / STEPS;
  const rise = (y0 - y1) / STEPS;
  let d = `M${x0} ${y0}`;
  const treads: Point[] = [];
  for (let i = 1; i <= STEPS; i++) {
    const y = y0 - rise * (i - 0.5);
    d += ` V${y} H${x0 + run * i}`;
    treads.push([x0 + run * (i - 0.5), y]);
  }
  d += ` V${y1} V${y1 + SLAB} L${x0} ${y0 + SLAB} Z`;
  return (
    <g>
      <path d={d} fill={TREAD} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d={`M${x1} ${y1 + SLAB} L${x0} ${y0 + SLAB}`} stroke={WOOD_DARK} strokeWidth="8" />
      {treads.map(([x, y]) => (
        <path key={x} d={`M${x} ${y} V${y - 96}`} stroke={WOOD_DARK} strokeWidth="5" />
      ))}
      <path d={`M${x0} ${y0 - 96} L${x1} ${y1 - 96}`} stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <path d={`M${x0} ${y0 - 96} L${x1} ${y1 - 96}`} stroke={WOOD} strokeWidth="8" strokeLinecap="round" />
    </g>
  );
}

/** A floor cut open: grey inside, wood on top. */
function Slab({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  return (
    <g>
      <rect x={x0} y={y} width={x1 - x0} height={SLAB} fill={CUT} stroke={INK} strokeWidth="4" />
      <rect x={x0} y={y - 2} width={x1 - x0} height="10" fill={WOOD} stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** A lamp hanging under a floor, giving warm light. */
function Lamp({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y + SLAB} V${y + SLAB + 30}`} stroke={INK} strokeWidth="3" />
      <path d={`M${x - 30} ${y + SLAB + 56} Q${x} ${y + SLAB + 14} ${x + 30} ${y + SLAB + 56} Z`} fill="#ffd43b" stroke={INK} strokeWidth="3.5" />
      <circle cx={x} cy={y + SLAB + 60} r="9" fill="#fff9db" />
    </g>
  );
}

/** A flat's front door in the back wall, standing on the floor at `y`, `w` wide. */
function Door({ x, y, colour, children }: { x: number; y: number; colour: string; children?: ReactNode }) {
  return (
    <g>
      <rect x={x - 8} y={y - 196} width="126" height="196" rx="6" fill="#f8f9fa" stroke={INK} strokeWidth="4" />
      <rect x={x} y={y - 186} width="110" height="186" rx="4" fill={colour} stroke={INK} strokeWidth="4" />
      <rect x={x + 16} y={y - 168} width="78" height="60" rx="6" fill="none" stroke={INK} strokeWidth="3" opacity="0.4" />
      <rect x={x + 16} y={y - 92} width="78" height="76" rx="6" fill="none" stroke={INK} strokeWidth="3" opacity="0.4" />
      <circle cx={x + 92} cy={y - 96} r="7" fill="#fcc419" stroke={INK} strokeWidth="2.5" />
      {children}
    </g>
  );
}

/** The ground floor: the front door the child came in by, the letterboxes and the shelf with the torch. */
function GroundFloor({ torch }: { torch: boolean }) {
  return (
    <g>
      {/* The front door, with glass in it */}
      <rect x="54" y="520" width="132" height="220" rx="8" fill={WOOD} stroke={INK} strokeWidth="5" />
      <rect x="76" y="546" width="88" height="80" rx="6" fill="#a5d8ff" stroke={INK} strokeWidth="4" />
      <circle cx="166" cy="650" r="7" fill="#fcc419" stroke={INK} strokeWidth="2.5" />
      <rect x="40" y="726" width="160" height="14" rx="4" fill="#868e96" stroke={INK} strokeWidth="3" />
      {/* The letterboxes */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={230 + i * 44} y="580" width="40" height="52" rx="5" fill={["#4dabf7", "#ffa94d", "#e599f7"][i]} stroke={INK} strokeWidth="3" />
          <path d={`M${238 + i * 44} 596 H${262 + i * 44}`} stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
      {/* The shelf by the stairs, the torch standing on it */}
      <rect x="392" y="680" width="120" height="14" rx="4" fill={WOOD_DARK} stroke={INK} strokeWidth="3" />
      <path d="M408 694 L420 716 M496 694 L484 716" stroke={WOOD_DARK} strokeWidth="6" strokeLinecap="round" />
      {torch && (
        <g transform="translate(452 682) scale(0.8)">
          <Torch />
        </g>
      )}
      {/* A pram parked under the stairs */}
      <g transform="translate(760 740)">
        <circle cx="-44" cy="-20" r="20" fill="#495057" stroke={INK} strokeWidth="4" />
        <circle cx="44" cy="-20" r="20" fill="#495057" stroke={INK} strokeWidth="4" />
        <path d="M-74 -54 H74 Q74 -110 0 -110 H-30 Q-74 -110 -74 -54 Z" fill="#748ffc" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M-74 -60 Q-74 -132 -10 -132 L-10 -60 Z" fill="#4263eb" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M74 -90 L104 -126" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      </g>
      <Door x={1250} y={FLOOR[0]} colour="#ffc078" />
    </g>
  );
}

/** The 1st floor: the dog's door with a paw on it, its mat and bowl, and the bone lying by the bowl. */
function DogHome({ bone }: { bone: boolean }) {
  const y = FLOOR[1];
  return (
    <g>
      <Door x={1420} y={y} colour="#74c0fc">
        {/* A paw on the door: the dog lives here */}
        <g transform={`translate(1475 ${y - 136})`} fill={INK}>
          <ellipse cx="0" cy="8" rx="14" ry="11" />
          <circle cx="-14" cy="-10" r="5" />
          <circle cx="-5" cy="-17" r="5" />
          <circle cx="5" cy="-17" r="5" />
          <circle cx="14" cy="-10" r="5" />
        </g>
      </Door>
      <rect x="1380" y={y - 8} width="170" height="10" rx="4" fill="#c92a2a" stroke={INK} strokeWidth="3" />
      <path d={`M1478 ${y - 4} L1484 ${y - 26} H1536 L1542 ${y - 4} Z`} fill="#fa5252" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      {bone && (
        <g transform={`translate(1416 ${y - 4}) scale(0.8)`}>
          <Bone />
        </g>
      )}
    </g>
  );
}

/** The dog sitting on the stairs up from the 1st floor, looking down at the child; with the bone it trots back to its
 * mat and chews. */
function Dog({ done, here, nope }: SceneryProps) {
  const solved = done.includes("dog");
  return (
    <g transform="translate(940 220)">
      <g className={`tl-katze-dog${solved ? " done" : ""}`}>
        <Nope id="dog" nope={nope}>
          <g className={here === "dog" && !solved ? "tl-meet" : undefined}>
            <path className="tl-dog-tail" d="M-50 -60 Q-84 -66 -82 -100" stroke="#8d5a3b" strokeWidth="12" strokeLinecap="round" fill="none" />
            {/* Sitting: the back high on the upper step, the front paws on the lower one */}
            <ellipse cx="-30" cy="-70" rx="34" ry="30" fill="#d9a066" stroke={INK} strokeWidth="4" />
            <ellipse cx="-40" cy="-46" rx="22" ry="12" fill="#d9a066" stroke={INK} strokeWidth="3.5" />
            <path d="M-6 -80 Q14 -60 10 -6 M8 -80 Q26 -60 24 -6" stroke={INK} strokeWidth="18" strokeLinecap="round" fill="none" />
            <path d="M-6 -80 Q14 -60 10 -6 M8 -80 Q26 -60 24 -6" stroke="#d9a066" strokeWidth="11" strokeLinecap="round" fill="none" />
            <ellipse cx="0" cy="-74" rx="22" ry="34" fill="#f1d3a8" stroke={INK} strokeWidth="4" />
            <g className="tl-dog-head" style={{ transformOrigin: "10px -100px" }}>
              <circle cx="14" cy="-120" r="30" fill="#d9a066" stroke={INK} strokeWidth="4" />
              <ellipse cx="42" cy="-110" rx="20" ry="14" fill="#f1d3a8" stroke={INK} strokeWidth="3.5" />
              <circle cx="58" cy="-116" r="7" fill={INK} />
              <circle cx="22" cy="-128" r="5" fill={INK} />
              <path d="M2 -148 Q-20 -140 -12 -104 Q2 -112 2 -148 Z" fill="#8d5a3b" stroke={INK} strokeWidth="3" />
              <path d="M-6 -94 Q14 -86 30 -96" stroke="#e03131" strokeWidth="8" strokeLinecap="round" fill="none" />
              {solved ? (
                <g transform="translate(48 -94) rotate(-10) scale(0.5)">
                  <g className="tl-chew">
                    <Bone />
                  </g>
                </g>
              ) : (
                <path d="M46 -98 Q40 -90 32 -96" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
              )}
            </g>
          </g>
        </Nope>
      </g>
    </g>
  );
}

/** The 2nd floor: Oma's door with the bell; the child rings, the door opens, Oma waves and rolls out a ball of wool. */
function OmaHome({ done, here }: SceneryProps) {
  const y = FLOOR[2];
  const open = here === "bell" || done.includes("bell");
  return (
    <g>
      {/* Inside the flat, behind the door: Oma */}
      <rect x="340" y={y - 186} width="110" height="186" fill="#ffe8cc" stroke={INK} strokeWidth="4" />
      <g transform={`translate(395 ${y})`} className={open ? "tl-katze-oma open" : "tl-katze-oma"}>
        <path d="M-30 0 L-24 -70 H24 L30 0 Z" fill="#9775fa" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M-26 -66 L-22 -130 Q0 -140 22 -130 L26 -66 Z" fill="#e599f7" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <g className="tl-katze-oma-wave" style={{ transformOrigin: "22px -124px" }}>
          <path d="M22 -124 L46 -160" stroke={INK} strokeWidth="14" strokeLinecap="round" />
          <path d="M22 -124 L46 -160" stroke="#e599f7" strokeWidth="8" strokeLinecap="round" />
          <circle cx="48" cy="-164" r="8" fill="#ffd8a8" stroke={INK} strokeWidth="3" />
        </g>
        <circle cx="0" cy="-158" r="24" fill="#ffd8a8" stroke={INK} strokeWidth="4" />
        <circle cx="0" cy="-186" r="14" fill="#dee2e6" stroke={INK} strokeWidth="3.5" />
        <path d="M-24 -166 Q-20 -186 0 -184 Q20 -186 24 -166" fill="#dee2e6" stroke={INK} strokeWidth="3.5" />
        <circle cx="-9" cy="-158" r="7" fill="none" stroke={INK} strokeWidth="2.5" />
        <circle cx="9" cy="-158" r="7" fill="none" stroke={INK} strokeWidth="2.5" />
        <path d="M-6 -144 q6 6 12 0" stroke={INK} strokeWidth="2.5" fill="none" />
      </g>
      {/* The door swings open */}
      <g className={`tl-katze-door${open ? " open" : ""}`} style={{ transformOrigin: `340px ${y}px` }}>
        <rect x="340" y={y - 186} width="110" height="186" rx="4" fill="#51cf66" stroke={INK} strokeWidth="4" />
        <path d={`M395 ${y - 150} c-12 -14 -30 0 0 22 c30 -22 12 -36 0 -22 Z`} fill="#fa5252" stroke={INK} strokeWidth="2.5" />
        <circle cx="432" cy={y - 96} r="7" fill="#fcc419" stroke={INK} strokeWidth="2.5" />
      </g>
      <rect x="332" y={y - 196} width="126" height="12" fill="#f8f9fa" stroke={INK} strokeWidth="3" />
      {/* The bell on the frame: a round button */}
      <rect x="452" y={y - 132} width="22" height="34" rx="5" fill="#f8f9fa" stroke={INK} strokeWidth="3" />
      <circle cx="463" cy={y - 115} r="6" fill="#ffd43b" stroke={INK} strokeWidth="2.5" />
      <rect x="320" y={y - 8} width="150" height="10" rx="4" fill="#e8590c" stroke={INK} strokeWidth="3" />
      {open && !done.includes("yarn") && (
        <g transform={`translate(232 ${y})`}>
          <g className="tl-katze-roll">
            <g transform="scale(0.8)">
              <Yarn />
            </g>
          </g>
        </g>
      )}
    </g>
  );
}

/** The ladder from the 3rd floor up through the hatch into the attic, seen from the front; the hatch lid stands open. */
function Ladder() {
  const y = FLOOR[3];
  return (
    <g>
      <path d={`M1556 ${FLOOR[4]} L1540 ${FLOOR[4] - 120}`} stroke={WOOD_DARK} strokeWidth="14" strokeLinecap="round" />
      {[1430, 1530].map((x) => (
        <rect key={x} x={x - 7} y={FLOOR[4] - 40} width="14" height={y - FLOOR[4] + 40} rx="5" fill={WOOD} stroke={INK} strokeWidth="4" />
      ))}
      {LADDER.map(([, ry]) => (
        <rect key={ry} x="1430" y={ry - 5} width="100" height="10" rx="4" fill={WOOD} stroke={INK} strokeWidth="3" />
      ))}
    </g>
  );
}

/** The old chest in the attic; the torch lies on it and lights the way once the child has put it there. */
function Chest({ lit }: { lit: boolean }) {
  const y = FLOOR[4];
  return (
    <g>
      {lit && <path d={`M1086 ${y - 100} L360 ${y - 290} V${y} L1086 ${y - 74} Z`} fill="#fff3bf" opacity="0.55" />}
      <rect x="1080" y={y - 50} width="130" height="50" rx="6" fill={WOOD_DARK} stroke={INK} strokeWidth="4" />
      <path d={`M1080 ${y - 30} H1210`} stroke="#fcc419" strokeWidth="5" />
      {lit && (
        <g transform={`translate(1200 ${y - 68}) rotate(-90)`}>
          <Torch lit />
        </g>
      )}
    </g>
  );
}

/** The house cut open: back wall, stairs, floors, lamps, doors, and the attic under the roof. */
export function KatzeScenery(props: SceneryProps) {
  const { done } = props;
  return (
    <g>
      <BackWall />
      <Flight x0={STAIR_LOW} y0={FLOOR[0]} x1={STAIR_HIGH} y1={FLOOR[1]} />
      <Flight x0={STAIR_HIGH} y0={FLOOR[1]} x1={STAIR_LOW} y1={FLOOR[2]} />
      <Flight x0={STAIR_LOW} y0={FLOOR[2]} x1={STAIR_HIGH} y1={FLOOR[3]} />
      {FLOOR.slice(1, 4).map((y) => (
        <g key={y}>
          <Slab x0={WALL_L} x1={STAIR_LOW} y={y} />
          <Slab x0={STAIR_HIGH} x1={WALL_R} y={y} />
        </g>
      ))}
      <Slab x0={WALL_L} x1={1420} y={FLOOR[4]} />
      {FLOOR.slice(1, 5).flatMap((y) => [300, 1300].map((x) => <Lamp key={`${x}${y}`} x={x} y={y} />))}
      <GroundFloor torch={!done.includes("torch")} />
      <DogHome bone={!done.includes("bone")} />
      <OmaHome {...props} />
      <Door x={1200} y={FLOOR[3]} colour="#ffa8a8" />
      {/* Plants on the landings nobody stops at */}
      {[
        [470, FLOOR[1]],
        [1450, FLOOR[2]],
        [470, FLOOR[3]],
      ].map(([x, y]) => (
        <g key={y}>
          <path d={`M${x - 26} ${y} L${x - 32} ${y - 50} H${x + 32} L${x + 26} ${y} Z`} fill="#e8590c" stroke={INK} strokeWidth="3.5" />
          {[-24, 0, 24].map((dx) => (
            <ellipse
              key={dx}
              cx={x + dx}
              cy={y - 84}
              rx="16"
              ry="34"
              transform={`rotate(${dx} ${x + dx} ${y - 50})`}
              fill="#51cf66"
              stroke="#2b8a3e"
              strokeWidth="3"
            />
          ))}
        </g>
      ))}
      <Ladder />
      <Chest lit={done.includes("dark")} />
      <Dog {...props} />
      {/* The ground below the house, the outer walls cut open, and the roof */}
      <rect x="-400" y={FLOOR[0]} width="2400" height="1200" fill="#868e96" />
      <rect x="-400" y={FLOOR[0] - 4} width="2400" height="16" fill={WOOD} stroke={INK} strokeWidth="3" />
      {[
        [0, WALL_L],
        [WALL_R, 1600],
      ].map(([x0, x1]) => (
        <rect key={x0} x={x0} y={EAVES + 20} width={x1 - x0} height={FLOOR[0] - EAVES - 20} fill="#ffc9c9" stroke={INK} strokeWidth="4" />
      ))}
      <rect x="1080" y={RIDGE[1] + 70} width="60" height="150" fill="#c92a2a" stroke={INK} strokeWidth="4" />
      <path
        d={`M-60 ${EAVES + 30} L${RIDGE[0]} ${RIDGE[1] - 20} L1660 ${EAVES + 30} L1660 ${EAVES + 80} L${RIDGE[0]} ${RIDGE[1] + 34} L-60 ${EAVES + 80} Z`}
        fill={ROOF}
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** In front of the cat: the basket's front, the three kittens peeking over it, and the dark of the attic with their
 * eyes shining in it, until the torch lights it. With the wool the kittens play. */
export function KatzeFront({ done, here, nope }: SceneryProps) {
  const lit = done.includes("dark");
  const played = done.includes("kittens");
  const y = FLOOR[4];
  const kittens: [number, string, string][] = [
    [460, "#adb5bd", "#495057"],
    [510, "#f8f9fa", "#868e96"],
    [556, "#ffc078", "#e8590c"],
  ];
  return (
    <g>
      <Nope id="kittens" nope={nope}>
        <g className={`${here === "kittens" && !played ? "tl-meet" : ""}${played ? " tl-katze-play" : ""}`}>
          {kittens.map(([x, colour, stripe], i) => (
            <g key={x} transform={`translate(${x} ${y - 84}) scale(0.58)`}>
              <g className="tl-katze-kitten" style={{ animationDelay: `${i * 0.15}s` }}>
                <Cat colour={colour} stripe={stripe} />
              </g>
            </g>
          ))}
          {played && (
            <g transform={`translate(520 ${y - 150}) scale(0.5)`}>
              <g className="tl-katze-bat">
                <Yarn />
              </g>
            </g>
          )}
        </g>
      </Nope>
      {/* The basket: woven, its rim in front of the cats */}
      <path d={`M350 ${y - 84} H600 L582 ${y} H368 Z`} fill="#e8a500" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d={`M356 ${y - 56} H594 M362 ${y - 28} H588`} stroke="#b07d00" strokeWidth="4" />
      {[400, 450, 500, 550].map((x) => (
        <path key={x} d={`M${x} ${y - 84} V${y}`} stroke="#b07d00" strokeWidth="3" />
      ))}
      <rect x="342" y={y - 92} width="266" height="16" rx="8" fill="#fcc419" stroke={INK} strokeWidth="4" />
      {/* The dark attic, the hatch side a little lighter; eyes shine in it */}
      <Nope id="dark" nope={nope}>
        <g className={`tl-dark${lit ? " lit" : ""}`}>
          <defs>
            <linearGradient id="tl-katze-dark" gradientUnits="userSpaceOnUse" x1="1250" y1="0" x2="1420" y2="0">
              <stop offset="0" stopColor="#101028" />
              <stop offset="1" stopColor="#101028" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M${WALL_L} ${y} V${EAVES} L${RIDGE[0]} ${RIDGE[1]} L1420 -1340 V${y} Z`} fill="url(#tl-katze-dark)" />
          {[
            [CAT_AT[0] - 53, CAT_AT[1] - 74],
            [CAT_AT[0] - 35, CAT_AT[1] - 74],
            ...kittens.flatMap(([x]): Point[] => [
              [x + 23, y - 127],
              [x + 34, y - 127],
            ]),
          ].map(([ex, ey]) => (
            <ellipse key={`${ex}${ey}`} cx={ex} cy={ey} rx="5" ry="4" fill="#d8f5a2" />
          ))}
        </g>
      </Nope>
    </g>
  );
}

/** The town outside, seen through the windows: trees and roofs further down, clouds and the sun higher up. */
export function KatzeBackdrop() {
  return (
    <g>
      <rect x="-600" y="-1400" width="2800" height="2600" fill="#a5d8ff" />
      <circle cx="1200" cy="-900" r="80" fill="#ffe066" />
      <Cloud x={200} y={-700} scale={1.3} />
      <Cloud x={900} y={-450} />
      <Cloud x={1400} y={-1100} scale={1.2} />
      <Cloud x={500} y={-1200} />
      {/* Houses across the street, their roofs about the 2nd floor */}
      {[-200, 260, 720, 1180, 1640].map((x, i) => (
        <g key={x}>
          <rect x={x} y={-60 + (i % 2) * 60} width="400" height="1200" fill={["#ffd8a8", "#d0bfff", "#ffc9c9", "#b2f2bb", "#ffec99"][i]} />
          <path d={`M${x - 20} ${-60 + (i % 2) * 60} L${x + 200} ${-220 + (i % 2) * 60} L${x + 420} ${-60 + (i % 2) * 60} Z`} fill="#c92a2a" />
          {[0, 1, 2].flatMap((r) =>
            [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={x + 50 + c * 120} y={40 + (i % 2) * 60 + r * 200} width="60" height="80" fill="#74c0fc" />),
          )}
        </g>
      ))}
      {[100, 600, 1100, 1500].map((x) => (
        <g key={x}>
          <rect x={x - 14} y="560" width="28" height="300" fill="#8d5a3b" />
          <circle cx={x} cy="520" r="110" fill="#51cf66" />
        </g>
      ))}
    </g>
  );
}
