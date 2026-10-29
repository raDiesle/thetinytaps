import type { CSSProperties, ReactNode } from "react";
import { Cloud, INK } from "@/games/scenes/shared";
import { Apple, Berries, Honey, Nut, Umbrella } from "./items";
import type { Point, SceneryProps } from "./types";

// "Picknick im Wald" (G-07): the teddy runs ahead into the forest with the picnic basket. From the meadow
// at the forest's edge past the hazel bush, the beehives and the squirrel, the blackberries, a hedgehog
// that rolls up, the robins, over the river on a fallen tree trunk, past the forest hut and through the
// waterfall to the clearing, where the bear holds the teddy – and then everybody has a picnic together.
// World points: the ground is at y = 740; the stones up to the trunk go from x 2610 to 2760, the trunk
// lies at y = 604 over the river (x 2780 to 3090), and the path goes down the far bank to x 3330.

export const GROUND_Y = 740;
const LOG_Y = 604;

/** The four stones up onto the fallen trunk, from the bottom up; the last one is as high as the trunk. */
export const STONES: Point[] = Array.from({ length: 4 }, (_, i) => [2610 + i * 50, 706 - i * 34]);

/** The ground: up the stones, along the trunk over the river and down the far bank. */
export const PICKNICK_GROUND: Point[] = [[-3000, GROUND_Y], [2570, GROUND_Y], ...STONES, [3160, LOG_Y], [3330, GROUND_Y], [9000, GROUND_Y]];

/** Where the bear sits, at the edge of the picnic blanket. */
const BEAR_X = 4640;

/** Where the teddy is: on the bear's lap, in its arms. */
export const TEDDY_AT: Point = [4570, 722];

/** Where the teddy sits down on the blanket at the end. */
export const TEDDY_PICNIC: Point = [4830, 742];

const GRASS = "#51cf66";
const EARTH = "#8d6e4f";
const PATH = "#dcb98a";
const LEAVES = "#2f9e44";
const LEAVES_DARK = "#2b8a3e";
const BARK = "#7a5235";
const WOOD = "#c08552";
const STONE = "#ced4da";
const STONE_DARK = "#868e96";
const FUR = "#7a4a2a";
const SNOUT = "#d9a066";
/** Darker than the teddy's golden fur, so the teddy in the bear's arms stands out. */
const BELLY = "#9a6238";
const SQUIRREL = "#f76707";
const HEDGEHOG = "#8d6e4f";
const SPIKES = "#5c3b1e";
const ROBIN = "#9c7a54";
const BREAST = "#ff7a2f";

/** A wobble when a wrong thing is tried; keyed so every try starts it anew. */
function Nope({ id, nope, children }: { id: string; nope: SceneryProps["nope"]; children: ReactNode }) {
  const on = nope?.id === id;
  return (
    <g key={on ? nope.n : 0} className={on ? "tl-nope" : undefined}>
      {children}
    </g>
  );
}

/** Pops in after `delay` seconds (the picnic coming out of the basket, the guests arriving). */
function Pop({ x, y, delay, children }: { x: number; y: number; delay: number; children: ReactNode }) {
  const style: CSSProperties = { animationDelay: `${delay}s` };
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="tl-picknick-pop" style={style}>
        {children}
      </g>
    </g>
  );
}

function Flower({ x, y = GROUND_Y, colour }: { x: number; y?: number; colour: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 V-34" stroke="#2f9e44" strokeWidth="4" />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 9} cy={-40 + Math.sin((a * Math.PI) / 180) * 9} r="7" fill={colour} />
      ))}
      <circle cx="0" cy="-40" r="5" fill="#ffd43b" />
    </g>
  );
}

/** A red toadstool with white dots. */
function Toadstool({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${GROUND_Y}) scale(${s})`}>
      <rect x="-8" y="-30" width="16" height="30" rx="5" fill="#fff" stroke={INK} strokeWidth="3" />
      <path d="M-28 -26 Q-28 -56 0 -56 Q28 -56 28 -26 Z" fill="#fa5252" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="-12" cy="-40" r="4" fill="#fff" />
      <circle cx="8" cy="-46" r="3.5" fill="#fff" />
      <circle cx="14" cy="-34" r="3" fill="#fff" />
    </g>
  );
}

/** A tall leafy tree behind the path. */
function Tree({ x, top = 300 }: { x: number; top?: number }) {
  return (
    <g>
      <path d={`M${x - 22} ${GROUND_Y} L${x - 14} ${top + 60} H${x + 14} L${x + 22} ${GROUND_Y} Z`} fill={BARK} stroke={INK} strokeWidth="4" />
      {[
        [0, 0, 110],
        [-90, 60, 74],
        [90, 60, 78],
        [0, 90, 80],
      ].map(([dx, dy, r]) => (
        <circle key={`${dx}${dy}`} cx={x + dx} cy={top + dy} r={r} fill={LEAVES} stroke={LEAVES_DARK} strokeWidth="5" />
      ))}
    </g>
  );
}

/** A dark fir tree behind the path. */
function Fir({ x, h = 420 }: { x: number; h?: number }) {
  const top = GROUND_Y - h;
  return (
    <g>
      <rect x={x - 12} y={GROUND_Y - 60} width="24" height="60" fill={BARK} stroke={INK} strokeWidth="3" />
      {[0, 1, 2].map((i) => {
        const y = top + i * (h / 4);
        const w = 70 + i * 34;
        return <path key={i} d={`M${x} ${y} L${x + w} ${y + h / 2.6} H${x - w} Z`} fill="#2b8a3e" stroke="#1b5e20" strokeWidth="4" strokeLinejoin="round" />;
      })}
    </g>
  );
}

/** The start: a meadow at the forest's edge, with a little wooden fence. */
function Meadow() {
  return (
    <g>
      <path d="M-700 740 V690 M-640 740 V690 M-580 740 V690 M-520 740 V690 M-460 740 V690" stroke={WOOD} strokeWidth="12" strokeLinecap="round" />
      <path d="M-720 704 H-440 M-720 724 H-440" stroke={WOOD} strokeWidth="8" />
      {[-380, -300, -220, -40, 60, 200].map((x, i) => (
        <Flower key={x} x={x} colour={["#ff8fa3", "#ffd43b", "#cc5de8", "#fff", "#74c0fc", "#ff8fa3"][i]} />
      ))}
    </g>
  );
}

/** A hazel bush with nuts in it; a big nut has fallen onto the path. */
function HazelBush({ nut }: { nut: boolean }) {
  return (
    <g>
      <g fill="#40c057" stroke={LEAVES_DARK} strokeWidth="4">
        <circle cx="620" cy="690" r="46" />
        <circle cx="720" cy="680" r="54" />
        <circle cx="670" cy="640" r="56" />
      </g>
      {[
        [640, 620],
        [700, 650],
        [730, 610],
        [660, 680],
      ].map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx="7" ry="9" fill="#a9622b" stroke={INK} strokeWidth="2" />
      ))}
      {nut && (
        <g transform="translate(640 746)">
          <Nut />
        </g>
      )}
    </g>
  );
}

/** A bee: yellow and black, with white wings. */
function Bee({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x - 4} cy={y - 10} rx="7" ry="9" fill="#fff" stroke={INK} strokeWidth="2" opacity="0.9" />
      <ellipse cx={x} cy={y} rx="11" ry="8" fill="#ffd43b" stroke={INK} strokeWidth="2.5" />
      <path d={`M${x - 3} ${y - 7} V${y + 7} M${x + 4} ${y - 7} V${y + 7}`} stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** The beehives at the forest's edge; the jar of honey stands on a tree stump in front. */
function Beehives({ honey }: { honey: boolean }) {
  return (
    <g>
      {[
        [1050, "#ffd43b"],
        [1150, "#74c0fc"],
      ].map(([x, colour]) => (
        <g key={x}>
          <path d={`M${(x as number) - 30} 740 V700 M${(x as number) + 30} 740 V700`} stroke={INK} strokeWidth="6" />
          <rect x={(x as number) - 42} y="630" width="84" height="74" rx="4" fill={colour as string} stroke={INK} strokeWidth="4" />
          <path d={`M${(x as number) - 42} 668 H${(x as number) + 42}`} stroke={INK} strokeWidth="3" />
          <rect x={(x as number) - 50} y="616" width="100" height="16" rx="4" fill="#e03131" stroke={INK} strokeWidth="4" />
          <rect x={(x as number) - 14} y="690" width="28" height="7" rx="3" fill={INK} />
        </g>
      ))}
      <Bee x={1090} y={590} />
      <Bee x={1170} y={576} />
      <Bee x={1120} y={548} />
      {/* The stump with the jar of honey */}
      <rect x="932" y="698" width="76" height="44" fill="#5c3b1e" stroke={INK} strokeWidth="4" />
      <ellipse cx="970" cy="698" rx="38" ry="10" fill="#e8c39e" stroke={INK} strokeWidth="4" />
      <ellipse cx="970" cy="698" rx="18" ry="4" fill="none" stroke="#b08155" strokeWidth="2" />
      {honey && (
        <g transform="translate(970 702)">
          <Honey />
        </g>
      )}
    </g>
  );
}

/** A squirrel, sitting up and facing left, standing on (0, 0). */
function SquirrelFigure({ nut }: { nut: boolean }) {
  return (
    <g transform="scale(1.3)">
      <path d="M16 -10 Q70 -20 60 -80 Q50 -112 22 -96 Q44 -60 10 -30 Z" fill="#e8590c" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <ellipse cx="0" cy="-30" rx="22" ry="30" fill={SQUIRREL} stroke={INK} strokeWidth="3.5" />
      <ellipse cx="-8" cy="-26" rx="11" ry="20" fill="#ffd8a8" />
      <ellipse cx="-12" cy="-3" rx="15" ry="6" fill="#d9480f" stroke={INK} strokeWidth="3" />
      <g className="tl-picknick-squirrel-head">
        <path d="M-12 -84 L-4 -104 L4 -82 Z" fill={SQUIRREL} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="-14" cy="-70" r="19" fill={SQUIRREL} stroke={INK} strokeWidth="3.5" />
        <ellipse cx="-24" cy="-64" rx="9" ry="7" fill="#ffd8a8" />
        <circle cx="-20" cy="-76" r="3.5" fill={INK} />
        <circle cx="-33" cy="-66" r="3" fill={INK} />
      </g>
      {nut && (
        <g transform="translate(-26 -34) scale(0.45)">
          <g className="tl-chew">
            <Nut />
          </g>
        </g>
      )}
      <ellipse cx="-22" cy="-40" rx="8" ry="5" fill={SQUIRREL} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/** The squirrel sits on the path; with the nut it hops onto the stump beside it and nibbles. */
function Squirrel({ done, here, nope }: SceneryProps) {
  const solved = done.includes("squirrel");
  return (
    <g>
      <rect x="1404" y="672" width="80" height="70" fill="#5c3b1e" stroke={INK} strokeWidth="4" />
      <ellipse cx="1444" cy="672" rx="40" ry="10" fill="#e8c39e" stroke={INK} strokeWidth="4" />
      <g transform="translate(1360 742)">
        <g className={`tl-picknick-squirrel${solved ? " done" : ""}`}>
          <Nope id="squirrel" nope={nope}>
            <g className={here === "squirrel" && !solved ? "tl-meet" : undefined}>
              <SquirrelFigure nut={solved} />
            </g>
          </Nope>
        </g>
      </g>
    </g>
  );
}

/** A blackberry bush; one twig full of ripe berries hangs out over the path. */
function BlackberryBush({ berries }: { berries: boolean }) {
  return (
    <g>
      <g fill="#69db7c" stroke={LEAVES_DARK} strokeWidth="4">
        <circle cx="1700" cy="690" r="54" />
        <circle cx="1780" cy="676" r="60" />
        <circle cx="1740" cy="630" r="58" />
      </g>
      <path d="M1690 650 l-8 -6 M1760 610 l6 -8 M1800 660 l8 -4 M1730 700 l-6 6" stroke="#2b8a3e" strokeWidth="3" strokeLinecap="round" />
      {[
        [1730, 640],
        [1790, 690],
        [1760, 600],
        [1810, 640],
      ].map(([x, y]) => (
        <g key={x} stroke={INK} strokeWidth="2">
          <circle cx={x} cy={y} r="7" fill="#2b124c" />
          <circle cx={x + 12} cy={y + 2} r="7" fill="#c92a2a" />
          <circle cx={x + 6} cy={y + 12} r="7" fill="#2b124c" />
        </g>
      ))}
      {berries && (
        <g transform="translate(1680 730)">
          <Berries />
        </g>
      )}
    </g>
  );
}

/** The spikes of a hedgehog's back: triangles from an ellipse round (cx, cy) outwards, from angle `from` to `to`. */
function spikes(cx: number, cy: number, r: [number, number], tip: [number, number], from: number, to: number, n: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = from + ((to - from) * i) / (n - 1);
    const [c, s] = [Math.cos(a), Math.sin(a)];
    const [x, y] = [cx + r[0] * c, cy - r[1] * s];
    return `M${x - 8 * s} ${y - 8 * c} L${cx + tip[0] * c} ${cy - tip[1] * s} L${x + 8 * s} ${y + 8 * c} Z`;
  }).join(" ");
}

/** A hedgehog facing left, standing on (0, 0). */
function HedgehogFigure() {
  return (
    <g>
      <path d={spikes(6, -30, [42, 28], [62, 50], Math.PI * 0.95, Math.PI * 0.08, 13)} fill={SPIKES} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="6" cy="-28" rx="46" ry="28" fill={HEDGEHOG} stroke={INK} strokeWidth="3.5" />
      <path d="M-14 -44 l6 -8 M6 -50 l4 -8 M24 -46 l6 -8 M38 -34 l8 -6" stroke={SPIKES} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="-30" cy="-4" rx="9" ry="5" fill="#5c3b1e" />
      <ellipse cx="30" cy="-4" rx="9" ry="5" fill="#5c3b1e" />
      <path d="M-34 -42 Q-58 -38 -72 -18 Q-62 -6 -38 -8 Q-28 -22 -34 -42 Z" fill="#e6ccb2" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="-72" cy="-18" r="5" fill={INK} />
      <circle cx="-48" cy="-28" r="3.5" fill={INK} />
      <circle cx="-42" cy="-17" r="3.5" fill="#ff8fa3" opacity="0.7" />
    </g>
  );
}

/** The hedgehog rolled up into a spiky ball, sitting on (0, 0). */
function HedgehogBall() {
  return (
    <g className="tl-picknick-ball">
      <path d={spikes(0, -50, [34, 34], [52, 50], 0, Math.PI * 2 * (19 / 20), 20)} fill={SPIKES} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="0" cy="-50" r="38" fill={HEDGEHOG} stroke={INK} strokeWidth="3.5" />
      <path d="M-18 -66 l6 -8 M4 -72 l4 -8 M20 -58 l8 -6 M-24 -44 l-8 -4 M10 -40 l6 -6" stroke={SPIKES} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/** The hedgehog on the path rolls up while the child stands still beside it, then uncurls and trots off. */
function Hedgehog({ done, here }: SceneryProps) {
  const gone = done.includes("hedgehog");
  const curled = here === "hedgehog" && !gone;
  return (
    <g transform="translate(2010 742)">
      <g className={`tl-picknick-hedgehog${gone ? " done" : ""}`}>{curled ? <HedgehogBall /> : <HedgehogFigure />}</g>
    </g>
  );
}

/** A robin facing left on (x, 0): brown with an orange breast; its head pecks. */
function Robin({ x, s = 1.4 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} 0) scale(${s})`}>
      <path d="M-4 0 V-14 M6 0 V-14" stroke="#a0522d" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 -30 L46 -44 L42 -22 Z" fill={ROBIN} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="4" cy="-28" rx="26" ry="19" fill={ROBIN} stroke={INK} strokeWidth="3.5" />
      <path d="M-20 -36 Q-26 -22 -12 -12 Q2 -14 0 -30 Q-8 -40 -20 -36 Z" fill={BREAST} />
      <path d="M2 -32 Q14 -36 22 -26" stroke={INK} strokeWidth="2.5" fill="none" />
      <g className="tl-picknick-robin-head">
        <circle cx="-16" cy="-48" r="14" fill={ROBIN} stroke={INK} strokeWidth="3.5" />
        <path d="M-28 -50 Q-30 -38 -18 -36 Q-14 -44 -20 -50 Z" fill={BREAST} />
        <path d="M-28 -52 L-42 -48 L-28 -44 Z" fill="#495057" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="-20" cy="-53" r="3" fill={INK} />
      </g>
    </g>
  );
}

/** Two robins on the path; with the blackberries they peck them up where they fell, then fly up onto the branch. */
function Robins({ done, here, nope }: SceneryProps) {
  const solved = done.includes("robins");
  return (
    <g transform="translate(2330 742)">
      <g className={`tl-picknick-robins${solved ? " done" : ""}`}>
        <Nope id="robins" nope={nope}>
          <g className={here === "robins" && !solved ? "tl-meet" : undefined}>
            <Robin x={0} />
            <Robin x={80} s={1.15} />
          </g>
        </Nope>
        {solved && (
          <>
            <g transform="translate(-60 0) rotate(-80) scale(0.55)">
              <g className="tl-bites">
                <Berries />
              </g>
            </g>
            <circle cx="32" cy="-8" r="8" fill="#2b124c" stroke={INK} strokeWidth="2" className="tl-bites" style={{ animationDelay: "0.8s" }} />
          </>
        )}
      </g>
    </g>
  );
}

/** The tree whose low branch the robins fly up to. */
function RobinTree() {
  return (
    <g>
      <path d="M2460 740 L2468 300 H2500 L2508 740 Z" fill={BARK} stroke={INK} strokeWidth="4" />
      <path d="M2470 556 H2340" stroke={BARK} strokeWidth="14" strokeLinecap="round" />
      {[
        [2484, 250, 110],
        [2380, 320, 70],
        [2590, 320, 76],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill={LEAVES} stroke={LEAVES_DARK} strokeWidth="5" />
      ))}
    </g>
  );
}

/** The river, the stones up onto the fallen trunk lying over it, and the far bank going down again. */
function River() {
  return (
    <g>
      <path d="M2770 738 Q2790 806 2850 812 H3040 Q3090 806 3100 738 Z" fill="#4dabf7" stroke="#1c7ed6" strokeWidth="4" strokeLinejoin="round" />
      <path d="M2830 770 q20 -8 40 0 t40 0 M2950 790 q20 -8 40 0 t40 0" stroke="#e7f5ff" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* The far bank, with the path down it */}
      <path d={`M3080 760 L3120 640 L3160 ${LOG_Y} L3340 ${GROUND_Y} V760 Z`} fill={EARTH} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d={`M3150 ${LOG_Y + 2} L3332 ${GROUND_Y + 2}`} stroke={GRASS} strokeWidth="12" />
      {/* The trunk, its cut end to the left, resting on the top stone and the far bank */}
      <rect x="2740" y={LOG_Y} width="440" height="46" rx="18" fill="#a0673a" stroke={INK} strokeWidth="5" />
      <path d="M2800 620 H2900 M2950 632 H3060 M2840 640 H2880 M3090 618 H3150" stroke="#6b4426" strokeWidth="4" strokeLinecap="round" />
      <path d="M2980 606 L2996 570 L3008 606" fill="#a0673a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M2992 574 Q2980 556 2992 548 Q3004 560 2992 574 Z" fill="#69db7c" stroke={LEAVES_DARK} strokeWidth="2.5" />
      {STONES.map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 28} y={y} width="56" height={GROUND_Y - y + 4} rx="12" fill={STONE} stroke={STONE_DARK} strokeWidth="4" />
          <path d={`M${x - 22} ${y + 3} Q${x} ${y - 4} ${x + 22} ${y + 3}`} stroke="#69db7c" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      ))}
      <ellipse cx="2740" cy={LOG_Y + 23} rx="14" ry="22" fill="#e8c39e" stroke={INK} strokeWidth="4" />
      <ellipse cx="2740" cy={LOG_Y + 23} rx="6" ry="10" fill="none" stroke="#b08155" strokeWidth="2" />
    </g>
  );
}

/** The forest hut, open at the front with a bench inside; an umbrella leans in front of it. */
function Hut({ umbrella }: { umbrella: boolean }) {
  return (
    <g>
      <rect x="3700" y="560" width="220" height="180" fill="#a0673a" stroke={INK} strokeWidth="5" />
      {[3744, 3788, 3832, 3876].map((x) => (
        <path key={x} d={`M${x} 562 V738`} stroke="#7a4f2b" strokeWidth="3" />
      ))}
      <path d="M3672 572 L3810 470 L3948 572 Z" fill="#5c3b1e" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <rect x="3740" y="672" width="140" height="14" rx="4" fill={WOOD} stroke={INK} strokeWidth="4" />
      <path d="M3756 686 V740 M3864 686 V740" stroke={INK} strokeWidth="6" />
      {umbrella && (
        <g transform="translate(3650 742)">
          <Umbrella />
        </g>
      )}
    </g>
  );
}

/** The water of the waterfall: from the rock's lip down onto the path, or onto the open umbrella. */
const FALL = ["M4110 300 V740", "M4132 296 V740", "M4154 300 V740"];
const FALL_BLOCKED = ["M4110 300 V572", "M4132 296 V572", "M4154 300 V572"];

/** The rock with the waterfall pouring over the path; the umbrella stands open under it once it is used. */
function Waterfall({ done, here, nope }: SceneryProps) {
  const solved = done.includes("waterfall");
  return (
    <g>
      <path d="M4020 744 V340 Q4024 290 4080 284 H4360 V744 Z" fill={STONE} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path
        d="M4200 380 l40 20 M4260 470 l-30 26 M4060 420 l26 14 M4300 600 l-36 10 M4220 660 l30 14"
        stroke={STONE_DARK}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M4076 286 Q4200 270 4360 284" stroke="#69db7c" strokeWidth="14" fill="none" strokeLinecap="round" />
      <ellipse cx="4132" cy="752" rx="90" ry="12" fill="#4dabf7" />
      <Nope id="waterfall" nope={nope}>
        <rect x="4096" y="290" width="72" height={(solved ? 572 : 740) - 290} rx="14" fill="#a5d8ff" opacity="0.85" />
        <g className={`tl-picknick-fall${here === "waterfall" ? " on" : ""}`}>
          {(solved ? FALL_BLOCKED : FALL).map((d) => (
            <path key={d} d={d} stroke="#4dabf7" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="16 12" />
          ))}
        </g>
        {!solved &&
          [4090, 4132, 4176].map((x) => (
            <g key={x}>
              <circle cx={x - 12} cy="730" r="7" fill="#a5d8ff" stroke="#1c7ed6" strokeWidth="2" />
              <circle cx={x + 12} cy="724" r="5" fill="#a5d8ff" stroke="#1c7ed6" strokeWidth="2" />
            </g>
          ))}
      </Nope>
      {solved && (
        <g transform="translate(4132 742)">
          <g className="tl-plank-laid">
            <Umbrella />
          </g>
          {[
            [-90, -160],
            [-110, -136],
            [-80, -120],
            [90, -160],
            [110, -136],
            [80, -120],
          ].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="6" fill="#74c0fc" />
          ))}
        </g>
      )}
    </g>
  );
}

/** The picnic blanket on the clearing, red with white checks, seen a little from above. */
function Blanket() {
  return (
    <g>
      <path d="M4680 756 L4716 722 H5010 L4974 756 Z" fill="#fa5252" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {[4760, 4820, 4880, 4940].map((x) => (
        <path key={x} d={`M${x - 18} 756 L${x + 18} 722`} stroke="#fff" strokeWidth="8" opacity="0.8" />
      ))}
      <path d="M4698 739 H4992" stroke="#fff" strokeWidth="8" opacity="0.8" />
    </g>
  );
}

/** The bear sitting at the blanket, facing left; with the honey it holds the jar to its mouth. */
function Bear({ done, here, nope }: SceneryProps) {
  const solved = done.includes("bear");
  return (
    <g transform={`translate(${BEAR_X} ${GROUND_Y})`}>
      <g className={`tl-picknick-bear${solved ? " done" : ""}`}>
        <Nope id="bear" nope={nope}>
          <g className={here === "bear" && !solved ? "tl-meet" : undefined}>
            <ellipse cx="10" cy="-100" rx="78" ry="100" fill={FUR} stroke={INK} strokeWidth="5" />
            <ellipse cx="-4" cy="-88" rx="50" ry="66" fill={BELLY} />
            <ellipse cx="-56" cy="-16" rx="36" ry="18" fill={FUR} stroke={INK} strokeWidth="4" />
            <ellipse cx="-74" cy="-18" rx="12" ry="12" fill={SNOUT} />
            <ellipse cx="52" cy="-14" rx="30" ry="16" fill={FUR} stroke={INK} strokeWidth="4" />
            <g className="tl-picknick-bear-head">
              {[-50, 30].map((x) => (
                <g key={x}>
                  <circle cx={x} cy="-276" r="20" fill={FUR} stroke={INK} strokeWidth="4" />
                  <circle cx={x} cy="-276" r="10" fill={SNOUT} />
                </g>
              ))}
              <circle cx="-10" cy="-232" r="56" fill={FUR} stroke={INK} strokeWidth="5" />
              <ellipse cx="-50" cy="-212" rx="30" ry="22" fill={SNOUT} stroke={INK} strokeWidth="3.5" />
              <ellipse cx="-72" cy="-220" rx="10" ry="8" fill={INK} />
              <path d="M-66 -200 Q-54 -192 -42 -200" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
              <circle cx="-38" cy="-248" r="5" fill={INK} />
              <circle cx="-4" cy="-252" r="5" fill={INK} />
            </g>
            {solved && (
              <g>
                <path d="M-20 -160 Q-60 -150 -76 -186" stroke={INK} strokeWidth="36" fill="none" strokeLinecap="round" />
                <path d="M-20 -160 Q-60 -150 -76 -186" stroke={FUR} strokeWidth="27" fill="none" strokeLinecap="round" />
                <g transform="translate(-84 -172) scale(0.6)">
                  <g className="tl-chew">
                    <Honey />
                  </g>
                </g>
              </g>
            )}
          </g>
        </Nope>
      </g>
    </g>
  );
}

/** After the honey: the picnic comes out of the basket, and the animals of the way come to eat along. */
function Feast() {
  return (
    <g>
      <Pop x={4760} y={736} delay={2.6}>
        <g transform="scale(0.55)">
          <Apple />
        </g>
      </Pop>
      <Pop x={4790} y={746} delay={2.8}>
        <g transform="scale(0.5)">
          <Apple />
        </g>
      </Pop>
      <Pop x={4910} y={738} delay={3}>
        <ellipse cx="0" cy="-6" rx="40" ry="10" fill="#fff" stroke={INK} strokeWidth="3.5" />
        {[-18, 4].map((x) => (
          <g key={x}>
            <path d={`M${x - 12} -10 L${x + 2} -34 L${x + 16} -10 Z`} fill="#fff3bf" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <path d={`M${x - 8} -14 L${x + 12} -14`} stroke="#69db7c" strokeWidth="4" />
          </g>
        ))}
      </Pop>
      <Pop x={4970} y={740} delay={3.2}>
        <path d="M-26 -22 H26 Q22 0 0 0 Q-22 0 -26 -22 Z" fill="#4dabf7" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        {[-14, 0, 14, -7, 7].map((x, i) => (
          <circle key={i} cx={x} cy={i < 3 ? -24 : -34} r="7" fill="#2b124c" stroke={INK} strokeWidth="2" />
        ))}
      </Pop>
      <Pop x={5050} y={742} delay={3.6}>
        <Robin x={0} s={1} />
        <Robin x={56} s={0.85} />
      </Pop>
      <Pop x={5180} y={742} delay={3.9}>
        <g transform="scale(0.8)">
          <HedgehogFigure />
        </g>
      </Pop>
      <Pop x={4700} y={742} delay={4.2}>
        <g transform="scale(0.75)">
          <SquirrelFigure nut={false} />
        </g>
      </Pop>
    </g>
  );
}

/** The world of "Picknick im Wald", drawn as far as the child has come. */
export function PicknickScenery(props: SceneryProps) {
  const { done } = props;
  return (
    <g>
      <rect x="-1200" y={GROUND_Y} width="7600" height="2000" fill={EARTH} />
      <rect x="-1200" y={GROUND_Y - 4} width="7600" height="22" fill={GRASS} />
      <rect x="-1200" y={GROUND_Y + 10} width="7600" height="20" fill={PATH} />
      <Fir x={-560} h={380} />
      <Tree x={360} top={280} />
      <Fir x={880} h={460} />
      <Tree x={1230} top={260} />
      <Fir x={1580} h={420} />
      <Tree x={1900} top={300} />
      <Fir x={2170} h={480} />
      <Tree x={3440} top={260} />
      <Fir x={3580} h={400} />
      <Fir x={5500} h={460} />
      <Meadow />
      <HazelBush nut={!done.includes("nut")} />
      <Beehives honey={!done.includes("honey")} />
      <Squirrel {...props} />
      <BlackberryBush berries={!done.includes("berries")} />
      <Hedgehog {...props} />
      <RobinTree />
      <Robins {...props} />
      <River />
      <Hut umbrella={!done.includes("umbrella")} />
      <Waterfall {...props} />
      {[4400, 4500, 5280, 5400].map((x, i) => (
        <Flower key={x} x={x} colour={["#ff8fa3", "#ffd43b", "#cc5de8", "#fff"][i]} />
      ))}
      {[1140, 2090, 3380].map((x, i) => (
        <Toadstool key={x} x={x} s={i === 1 ? 0.8 : 1} />
      ))}
      <Blanket />
      <Bear {...props} />
      {done.includes("bear") && <Feast />}
    </g>
  );
}

/** In front of the teddy: the bear's arms round it, until the bear gets the honey. */
export function PicknickFront({ done }: SceneryProps) {
  if (done.includes("bear")) return null;
  return (
    <g transform={`translate(${BEAR_X} ${GROUND_Y})`}>
      {["M-10 -112 Q-50 -52 -108 -42", "M30 -104 Q12 -36 -60 -30"].map((d) => (
        <g key={d}>
          <path d={d} stroke={INK} strokeWidth="34" fill="none" strokeLinecap="round" />
          <path d={d} stroke={FUR} strokeWidth="25" fill="none" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

/** Wooded hills far away, clouds and the sun; drawn at a third of the world's speed. */
export function PicknickBackdrop() {
  const firs: [number, number][] = [];
  for (let i = 0; i < 40; i++) firs.push([-1200 + i * 130, 560 + ((i * 37) % 70)]);
  return (
    <g>
      <circle cx="1200" cy="130" r="70" fill="#ffe066" />
      <Cloud x={100} y={110} scale={1.2} />
      <Cloud x={900} y={180} />
      <Cloud x={1800} y={90} scale={1.4} />
      <Cloud x={2700} y={160} />
      <path d="M-1200 640 Q-700 420 -200 600 Q300 400 900 590 Q1500 420 2100 600 Q2700 430 3300 600 Q3900 440 4400 600 V1600 H-1200 Z" fill="#b2f2bb" />
      {firs.map(([x, top]) => (
        <path key={x} d={`M${x} ${top} L${x + 50} ${top + 130} H${x - 50} Z`} fill="#8ce99a" />
      ))}
      <path d="M-1200 690 Q-500 640 200 680 Q900 630 1600 680 Q2300 640 3000 680 Q3700 640 4400 680 V1600 H-1200 Z" fill="#69db7c" />
    </g>
  );
}
