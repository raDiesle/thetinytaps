import type { ReactNode } from "react";
import { INK } from "@/games/scenes/shared";
import { playBuzz, playMunch } from "@/lib/realSounds";
import { playChime, playCrunch, playDrops, playLeaves, playPlop, playPop, playRustle, playTrickle, playTwinkle, playYum } from "@/lib/sfx";
import { type Holding, Kid, type Look, type Pose, useHero } from "../kid";
import { Carrot, Strawberry } from "../things";
import type { Picture } from "../trail/items";
import type { Cue, Point } from "../trail/types";
import { Go, route } from "./move";
import { Grownup, type GrownPose } from "./people";
import { Outdoors, RoundTree } from "./places";
import type { Film, Scene, SceneProps } from "./types";

// „Unser Garten wächst“ (G-30, a film of something growing): in the garden the child picks a packet of seeds – a
// sunflower, carrots or strawberries. At the bed it digs a little hole, lays the seeds in, covers them with earth and
// waters them. Then it calls a rain cloud over the bed, a sprout comes out, the cloud moves on and in the sun the plant
// grows, day by day. At the end the sunflower opens and a bee visits it, or the child pulls out a carrot and bites
// into it, or a bee visits the strawberry's flowers, they turn into red strawberries, and they are picked and eaten.
// A calm film of slow growing: soft sounds (earth, water, a bee), nothing hurries.

/** What grows in the bed. */
export type Plant = "sonnenblume" | "karotte" | "erdbeere";

const PLANTS: Plant[] = ["sonnenblume", "karotte", "erdbeere"];
const FAR = 2400;
const LAWN = "#8ce99a";
const LEAF = "#51cf66";
const STEM = "#2f9e44";

/** Where the people stand: just behind the bed, the fence behind them. */
const FEET = 738;
const FENCE_BASE = 700;
/** The bed: its back edge, its front edge, and where the plant comes up in its middle. */
const BED = { back: 740, front: 820, left: 600, right: 1060, slant: 40 };
const PLANT: Point = [830, 782];
const KID_X = 700;
const PARENT_X = 990;

const PARENT: Look = { shirt: "#f08c00", pants: "#495057", hair: "#5c3d2e" };

/** The child in its own clothes, holding what it picked or pulled. */
function Child({ pose, holding = null, face = 1 }: { pose: Pose; holding?: Holding | null; face?: 1 | -1 }) {
  const hero = useHero();
  return <Kid look={hero} pose={pose} holding={holding} wear={["boots"]} face={face} />;
}

/** The child and Mama or Papa behind the bed, the child on the left, turned to the plant. */
function People({ kid, parent, holding = null, kidX = KID_X }: { kid: Pose; parent: GrownPose; holding?: Holding | null; kidX?: number }) {
  return (
    <g>
      <g transform={`translate(${PARENT_X} ${FEET})`}>
        <Grownup look={PARENT} pose={parent} face={-1} />
      </g>
      <g transform={`translate(${kidX} ${FEET})`}>
        <Child pose={kid} holding={holding} />
      </g>
    </g>
  );
}

/** Something that pops in when it appears, after `delay` seconds of the film's pace. */
function Pop({ delay = 0, children }: { delay?: number; children: ReactNode }) {
  return (
    <g className="fm-pop" style={delay ? { animationDelay: `calc(${delay}s * var(--fm-pace))` } : undefined}>
      {children}
    </g>
  );
}

// ---------- The garden ----------

/** The white picket fence along the back of the garden, from far left to far right, built once. */
const PICKETS = (() => {
  let d = "";
  for (let x = -FAR; x < FAR * 2; x += 64) d += `M${x} ${FENCE_BASE} V${FENCE_BASE - 104} l17 -20 l17 20 V${FENCE_BASE} Z `;
  return d;
})();

function Fence() {
  return (
    <g>
      <rect x={-FAR} y={FENCE_BASE - 86} width={FAR * 3} height="14" fill="#e9ecef" stroke={INK} strokeWidth="3" />
      <rect x={-FAR} y={FENCE_BASE - 40} width={FAR * 3} height="14" fill="#e9ecef" stroke={INK} strokeWidth="3" />
      <path d={PICKETS} fill="#fff9db" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
}

/** A tulip standing on (0, 0) in front of the fence. */
function Tulip({ x, colour }: { x: number; colour: string }) {
  return (
    <g transform={`translate(${x} ${FENCE_BASE + 6})`}>
      <path d="M0 0 Q-4 -40 0 -80" stroke={STEM} strokeWidth="6" fill="none" />
      <path d="M0 -20 Q-26 -36 -22 -62 Q-6 -46 0 -24" fill={LEAF} stroke={INK} strokeWidth="2.5" />
      <path d="M-18 -110 L-18 -84 Q0 -66 18 -84 L18 -110 L9 -96 L0 -112 L-9 -96 Z" fill={colour} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
}

/** Tulips along the fence on the right: where the bee goes when it only flies by. */
const TULIPS: [number, string][] = [
  [1290, "#ff6b6b"],
  [1350, "#ffd43b"],
  [1410, "#f783ac"],
  [1470, "#ff6b6b"],
];
const BEE_FLOWER: Point = [1350, 590];

/** The garden: the meadow with the sky and the hills, the fence with tulips, a tree on the right. */
function Garden({ children }: { children?: ReactNode }) {
  return (
    <g>
      <Outdoors ground={LAWN} />
      <Fence />
      {TULIPS.map(([x, colour]) => (
        <Tulip key={x} x={x} colour={colour} />
      ))}
      <RoundTree x={1640} s={1.15} />
      {children}
    </g>
  );
}

/** The bed: dark earth with furrows in a wooden frame, seen a little from above; `wet` darkens it after watering. */
function Bed({ wet = false, furrows = true }: { wet?: boolean; furrows?: boolean }) {
  const { back, front, left, right, slant } = BED;
  return (
    <g>
      <path d={`M${left} ${back} H${right} L${right + slant} ${front} H${left - slant} Z`} fill="#8d5a3b" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path
        className="fm-gt-wet"
        d={`M${left} ${back} H${right} L${right + slant} ${front} H${left - slant} Z`}
        fill="#5c3d2e"
        style={{ opacity: wet ? 0.6 : 0 }}
      />
      {furrows && (
        <path
          d={`M${left + 10} ${back + 20} H${right + 10} M${left} ${back + 44} H${right + 22} M${left - 14} ${back + 66} H${right + 32}`}
          stroke="#6b4329"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="60 26"
        />
      )}
      {/* The wooden frame: a thin board behind, a broad one in front */}
      <path d={`M${left - 4} ${back - 6} H${right + 4} V${back + 2} H${left - 4} Z`} fill="#c08552" stroke={INK} strokeWidth="3" />
      <path d={`M${left - slant - 6} ${front} H${right + slant + 6} V${front + 24} H${left - slant - 6} Z`} fill="#c08552" stroke={INK} strokeWidth="4" />
      <path d={`M${left - slant + 20} ${front + 12} H${right + slant - 20}`} stroke="#a0522d" strokeWidth="3" strokeDasharray="70 40" />
    </g>
  );
}

// ---------- What grows ----------

/** A leaf growing out from (0, 0) to the right; mirror it for the left. */
function Leaf({ s = 1 }: { s?: number }) {
  return (
    <g transform={`scale(${s})`}>
      <path d="M0 0 Q26 -34 74 -18 Q46 18 0 0 Z" fill={LEAF} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M6 -2 Q36 -12 62 -16" stroke={STEM} strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** The first two small leaves coming out of the earth at (0, 0). */
function Sprout() {
  return (
    <g>
      <path d="M0 0 Q-3 -22 0 -42" stroke={STEM} strokeWidth="7" strokeLinecap="round" fill="none" />
      <ellipse cx="-16" cy="-46" rx="17" ry="8" transform="rotate(-24 -16 -46)" fill={LEAF} stroke={INK} strokeWidth="2.5" />
      <ellipse cx="16" cy="-46" rx="17" ry="8" transform="rotate(24 16 -46)" fill={LEAF} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/** How tall the grown sunflower is: its head is at (0, -SUNFLOWER_TOP) above the earth. */
const SUNFLOWER_TOP = 420;

/** A sunflower's head facing us, centred on (0, 0): yellow petals round a brown middle full of seeds. */
function SunflowerHead({ r = 46 }: { r?: number }) {
  return (
    <g>
      {Array.from({ length: 16 }, (_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy={-r - 26}
          rx="15"
          ry="34"
          transform={`rotate(${i * 22.5})`}
          fill={i % 2 ? "#fcc419" : "#ffd43b"}
          stroke={INK}
          strokeWidth="2.5"
        />
      ))}
      <circle r={r} fill="#7f4f24" stroke={INK} strokeWidth="3" />
      <g fill="#5c3d2e">
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={Math.cos(i * 0.52) * r * 0.6} cy={Math.sin(i * 0.52) * r * 0.6} r="4" />
        ))}
      </g>
      <circle cx={-r * 0.3} cy={-r * 0.3} r={r * 0.22} fill="#a0522d" />
    </g>
  );
}

/** A green bud, closed, centred on (0, 0). */
function Bud({ r = 34 }: { r?: number }) {
  return (
    <g>
      {[-50, -20, 20, 50].map((a) => (
        <path
          key={a}
          d={`M0 0 L${-r * 0.4} ${-r * 0.6} L0 ${-r * 1.35} L${r * 0.4} ${-r * 0.6} Z`}
          transform={`rotate(${a})`}
          fill={STEM}
          stroke={INK}
          strokeWidth="2.5"
        />
      ))}
      <circle r={r} fill="#69db7c" stroke={INK} strokeWidth="3" />
      <path d={`M${-r * 0.5} ${-r * 0.3} Q0 ${-r * 0.9} ${r * 0.5} ${-r * 0.3}`} stroke={STEM} strokeWidth="3" fill="none" />
    </g>
  );
}

/** The sunflower growing on (0, 0): half grown (`stage` 2) with a small bud, or grown (3) as tall as a grown-up with its
 * bud, which opens into a big flower (`open`). */
function Sunflower({ stage, open = false }: { stage: 2 | 3; open?: boolean }) {
  if (stage === 2)
    return (
      <g>
        <path d="M0 0 Q-8 -110 0 -220" stroke={STEM} strokeWidth="11" strokeLinecap="round" fill="none" />
        <g transform="translate(-4 -80) scale(-1 1)">
          <Leaf s={0.8} />
        </g>
        <g transform="translate(-2 -140)">
          <Leaf s={0.7} />
        </g>
        <g transform="translate(0 -232)">
          <Bud r={18} />
        </g>
      </g>
    );
  return (
    <g>
      <path d={`M0 0 Q-14 -200 0 ${-SUNFLOWER_TOP + 20}`} stroke={STEM} strokeWidth="16" strokeLinecap="round" fill="none" />
      <g transform="translate(-6 -110) scale(-1 1)">
        <Leaf s={1.1} />
      </g>
      <g transform="translate(-8 -190)">
        <Leaf s={1.1} />
      </g>
      <g transform="translate(-6 -290) scale(-1 1)">
        <Leaf s={0.9} />
      </g>
      <g transform={`translate(0 ${-SUNFLOWER_TOP})`}>
        <Bud />
        <g className="fm-gt-open" style={{ transform: open ? "scale(1)" : "scale(0.2)", opacity: open ? 1 : 0 }}>
          <SunflowerHead />
        </g>
      </g>
    </g>
  );
}

/** Where the three carrots grow, from the middle of the bed. */
const CARROTS = [-110, 0, 110];

/** A carrot's leaves above the earth, with its orange top just showing. */
function CarrotTop({ s = 1, shoulder = true }: { s?: number; shoulder?: boolean }) {
  return (
    <g transform={`scale(${s})`}>
      <g stroke={STEM} strokeWidth="8" strokeLinecap="round" fill="none">
        <path d="M-4 -2 Q-20 -30 -30 -62" />
        <path d="M0 -2 Q2 -40 0 -78" />
        <path d="M4 -2 Q20 -30 30 -62" />
      </g>
      <g fill={LEAF} stroke={INK} strokeWidth="2.5">
        <ellipse cx="-30" cy="-66" rx="12" ry="18" transform="rotate(-20 -30 -66)" />
        <ellipse cx="0" cy="-82" rx="12" ry="18" />
        <ellipse cx="30" cy="-66" rx="12" ry="18" transform="rotate(20 30 -66)" />
      </g>
      {shoulder && <ellipse cx="0" cy="2" rx="22" ry="9" fill="#fd7e14" stroke={INK} strokeWidth="3" />}
    </g>
  );
}

/** The carrots' leaves in a row: small (`stage` 2) or grown (3), the middle one gone once it is pulled out. */
function Carrots({ stage, pulled = false }: { stage: 2 | 3; pulled?: boolean }) {
  return (
    <g>
      {CARROTS.map((x) =>
        x === 0 && pulled ? (
          <ellipse key={x} cx="0" cy="2" rx="26" ry="9" fill="#5c3d2e" />
        ) : (
          <g key={x} transform={`translate(${x} 0)`}>
            <CarrotTop s={stage === 2 ? 0.55 : 1.15} shoulder={stage === 3} />
          </g>
        ),
      )}
    </g>
  );
}

/** A strawberry leaf of three leaflets at the end of its stalk, at (0, 0). */
function TriLeaf() {
  return (
    <g fill={LEAF} stroke={INK} strokeWidth="2.5">
      <ellipse cx="-16" cy="-6" rx="13" ry="17" transform="rotate(-40 -16 -6)" />
      <ellipse cx="16" cy="-6" rx="13" ry="17" transform="rotate(40 16 -6)" />
      <ellipse cx="0" cy="-18" rx="14" ry="19" />
    </g>
  );
}

/** Where the strawberry plant's leaves are, and its three flowers that turn into strawberries. */
const STRAW_LEAVES: Point[] = [
  [-70, -36],
  [-34, -60],
  [10, -50],
  [52, -64],
  [80, -32],
];
const STRAW_FLOWERS: Point[] = [
  [-48, -96],
  [8, -116],
  [60, -92],
];

/** A white strawberry flower centred on (0, 0). */
function StrawFlower() {
  return (
    <g>
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} cx="0" cy="-11" r="9" transform={`rotate(${i * 72})`} fill="#fff" stroke={INK} strokeWidth="2" />
      ))}
      <circle r="6" fill="#fcc419" stroke={INK} strokeWidth="2" />
    </g>
  );
}

/** The strawberry plant on (0, 0): a few leaves (`stage` 2), or grown (3) with its white flowers, which turn into red
 * strawberries (`ripe`) until they are picked. */
function StrawberryPlant({ stage, ripe = false, picked = false }: { stage: 2 | 3; ripe?: boolean; picked?: boolean }) {
  const leaves = stage === 2 ? STRAW_LEAVES.filter((_, i) => i % 2 === 0) : STRAW_LEAVES;
  const s = stage === 2 ? 0.6 : 1;
  return (
    <g transform={`scale(${s})`}>
      {leaves.map(([x, y]) => (
        <g key={`${x}${y}`}>
          <path d={`M0 0 Q${x * 0.4} ${y * 0.3} ${x} ${y}`} stroke={STEM} strokeWidth="5" strokeLinecap="round" fill="none" />
          <g transform={`translate(${x} ${y})`}>
            <TriLeaf />
          </g>
        </g>
      ))}
      {stage === 3 &&
        STRAW_FLOWERS.map(([x, y]) => (
          <g key={`${x}${y}`}>
            <path d={`M0 -10 Q${x * 0.3} ${y * 0.6} ${x} ${y}`} stroke={STEM} strokeWidth="4" strokeLinecap="round" fill="none" />
            <g className="fm-gt-turn" transform={`translate(${x} ${y})`} style={{ opacity: ripe ? 0 : 1 }}>
              <StrawFlower />
            </g>
            {!picked && (
              <g className="fm-gt-turn" transform={`translate(${x} ${y}) scale(0.7)`} style={{ opacity: ripe ? 1 : 0 }}>
                <Strawberry />
              </g>
            )}
          </g>
        ))}
    </g>
  );
}

/** The plant at `stage` 2 or 3, drawn on (0, 0). */
function Grown({ plant, stage }: { plant: Plant; stage: 2 | 3 }) {
  if (plant === "sonnenblume") return <Sunflower stage={stage} />;
  if (plant === "karotte") return <Carrots stage={stage} />;
  return <StrawberryPlant stage={stage} />;
}

/** The plant coming up at the middle of the bed: each stage grows out of the earth as the one before fades. */
function Growing({ plant, stage }: { plant: Plant; stage: number }) {
  const layer = (n: number, child: ReactNode) => (
    <g className="fm-gt-grow" style={{ transform: stage >= n ? "scale(1)" : "scale(0.3)", opacity: stage === n ? 1 : 0 }}>
      {child}
    </g>
  );
  return (
    <g transform={`translate(${PLANT[0]} ${PLANT[1]})`}>
      {layer(1, <Sprout />)}
      {layer(2, <Grown plant={plant} stage={2} />)}
      {layer(3, <Grown plant={plant} stage={3} />)}
    </g>
  );
}

/** The little mound over the seeds, with the empty seed packet on a stick beside it, so one sees what grows there. */
function Mound({ plant, stake = true }: { plant: Plant; stake?: boolean }) {
  return (
    <g>
      <ellipse cx={PLANT[0]} cy={PLANT[1]} rx="70" ry="16" fill="#6b4329" stroke={INK} strokeWidth="3" />
      {stake && <Stake plant={plant} />}
    </g>
  );
}

/** Where the empty packet sits on its stick: right behind the plant. */
const STAKE: Point = [PLANT[0] + 190, PLANT[1] - 16];

function Stake({ plant }: { plant: Plant }) {
  return (
    <g transform={`translate(${STAKE[0]} ${STAKE[1]})`}>
      <path d="M0 0 V-90" stroke="#a0522d" strokeWidth="8" strokeLinecap="round" />
      <g transform="translate(0 -60) scale(0.55)">
        <SeedPacket plant={plant} />
      </g>
    </g>
  );
}

// ---------- Seeds, tools and the bee ----------

/** The small picture of a plant printed on its seed packet and shown in the strip, centred on (0, 0). */
function PlantPicture({ plant }: { plant: Plant }) {
  if (plant === "sonnenblume")
    return (
      <g transform="scale(0.42)">
        <SunflowerHead />
      </g>
    );
  if (plant === "karotte")
    return (
      <g transform="translate(0 -6) rotate(-30) scale(0.42)">
        <Carrot />
      </g>
    );
  return (
    <g transform="translate(0 -22) scale(0.75)">
      <Strawberry />
    </g>
  );
}

const PACKET_COLOUR: Record<Plant, string> = { sonnenblume: "#fff3bf", karotte: "#ffe8cc", erdbeere: "#ffe3e3" };

/** A paper packet of seeds standing on (0, 0), 96 wide, the picture of its plant on it. */
function SeedPacket({ plant }: { plant: Plant }) {
  return (
    <g>
      <path
        d="M-48 0 V-112 L-36 -124 L-24 -112 L-12 -124 L0 -112 L12 -124 L24 -112 L36 -124 L48 -112 V0 Z"
        fill={PACKET_COLOUR[plant]}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M-48 -102 H48" stroke={INK} strokeOpacity="0.25" strokeWidth="3" />
      <circle cx="0" cy="-56" r="36" fill="#fff" stroke={INK} strokeOpacity="0.3" strokeWidth="2" />
      <g transform="translate(0 -56)">
        <PlantPicture plant={plant} />
      </g>
      <path d="M-36 -12 H36" stroke={INK} strokeOpacity="0.2" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

/** A child's spade, its blade's tip at (0, 0) and its handle up. */
function Spade() {
  return (
    <g>
      <path d="M0 -50 V-150" stroke="#a0522d" strokeWidth="10" strokeLinecap="round" />
      <path d="M-20 -150 H20" stroke="#a0522d" strokeWidth="10" strokeLinecap="round" />
      <path d="M-22 -54 H22 V-20 Q22 0 0 4 Q-22 0 -22 -20 Z" fill="#ff6b6b" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M-12 -46 V-16" stroke="#ffc9c9" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

/** A watering can standing on (0, 0), its spout reaching up to the left. */
function WateringCan() {
  return (
    <g>
      <path d="M-34 -50 L-104 -98" stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <path d="M-34 -50 L-104 -98" stroke="#339af0" strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="-108" cy="-100" rx="9" ry="14" transform="rotate(-35 -108 -100)" fill="#1c7ed6" stroke={INK} strokeWidth="3" />
      <path d="M-20 -110 Q20 -150 46 -96" stroke={INK} strokeWidth="12" fill="none" strokeLinecap="round" />
      <path d="M-20 -110 Q20 -150 46 -96" stroke="#339af0" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M-44 0 L-36 -100 H50 L56 0 Z" fill="#339af0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-30 -80 Q-34 -40 -28 -14" stroke="#a5d8ff" strokeWidth="8" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** A small bowl standing on (0, 0). */
function SmallBowl() {
  return (
    <g>
      <path d="M-54 -36 Q-50 4 0 6 Q50 4 54 -36 Z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="0" cy="-36" rx="54" ry="12" fill="#e7f5ff" stroke={INK} strokeWidth="3" />
      <path d="M-40 -18 Q0 -6 40 -18" stroke="#74c0fc" strokeWidth="5" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** A friendly round bee centred on (0, 0), looking left; its wings beat softly while it flies (`flying`). */
function Bee({ flying }: { flying: boolean }) {
  return (
    <g>
      <g className={flying ? "fm-gt-wings" : undefined} style={{ transformOrigin: "0px -14px" }}>
        <ellipse cx="-8" cy="-26" rx="13" ry="18" transform="rotate(-20 -8 -26)" fill="#fff" fillOpacity="0.85" stroke={INK} strokeWidth="2.5" />
        <ellipse cx="10" cy="-24" rx="12" ry="16" transform="rotate(25 10 -24)" fill="#fff" fillOpacity="0.85" stroke={INK} strokeWidth="2.5" />
      </g>
      <ellipse cx="0" cy="0" rx="28" ry="20" fill="#fcc419" stroke={INK} strokeWidth="3" />
      <path d="M-4 -19 Q-8 0 -4 19 M12 -16 Q8 0 12 16" stroke={INK} strokeWidth="7" fill="none" />
      <circle cx="-16" cy="-4" r="4" fill={INK} />
      <circle cx="-17" cy="-6" r="1.4" fill="#fff" />
      <path d="M-22 6 Q-17 10 -12 6" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

// ---------- Small pictures: the strip of scenes and the choice ----------

/** A picture for the strip or a card, drawn centred and lifted so it stands on (0, 0) like the other pictures. */
const pic = (w: number, h: number, draw: () => ReactNode): Picture => ({ w, h, draw: () => <g transform={`translate(0 ${-h / 2})`}>{draw()}</g> });

const PACKETS_ICON = pic(320, 200, () => (
  <g transform="translate(0 70)">
    {PLANTS.map((plant, i) => (
      <g key={plant} transform={`translate(${(i - 1) * 100} 0) rotate(${(i - 1) * 8})`}>
        <SeedPacket plant={plant} />
      </g>
    ))}
  </g>
));
const BED_ICON = pic(320, 220, () => (
  <g>
    <ellipse cx="0" cy="70" rx="140" ry="30" fill="#8d5a3b" stroke={INK} strokeWidth="6" />
    <g transform="translate(40 30) rotate(-25)">
      <WateringCan />
    </g>
    <g fill="#74c0fc">
      <circle cx="-60" cy="10" r="7" />
      <circle cx="-40" cy="36" r="7" />
      <circle cx="-74" cy="44" r="7" />
    </g>
  </g>
));
const WEATHER_ICON = pic(320, 240, () => (
  <g>
    <circle cx="70" cy="-40" r="50" fill="#ffe066" stroke="#fab005" strokeWidth="6" />
    <path
      d="M-120 20 Q-130 -20 -90 -20 Q-80 -60 -30 -56 Q0 -84 40 -60 Q80 -60 76 -20 Q100 20 60 20 Z"
      fill="#fff"
      stroke={INK}
      strokeWidth="6"
      strokeLinejoin="round"
    />
    <path d="M-80 46 l-8 24 M-30 46 l-8 24 M20 46 l-8 24" stroke="#339af0" strokeWidth="10" strokeLinecap="round" />
    <g transform="translate(0 112) scale(1.3)">
      <Sprout />
    </g>
  </g>
));
const harvestIcon = (plant: Plant): Picture =>
  pic(300, 260, () => (
    <g>
      {plant === "sonnenblume" && (
        <g transform="scale(1.1)">
          <SunflowerHead />
        </g>
      )}
      {plant === "karotte" && (
        <g transform="translate(-20 -40) rotate(-20) scale(1.2)">
          <Carrot />
        </g>
      )}
      {plant === "erdbeere" &&
        [-60, 0, 60].map((x, i) => (
          <g key={x} transform={`translate(${x} ${i === 1 ? -70 : -40}) scale(1.3)`}>
            <Strawberry />
          </g>
        ))}
    </g>
  ));
const HARVEST_ICON: Record<Plant, Picture> = { sonnenblume: harvestIcon("sonnenblume"), karotte: harvestIcon("karotte"), erdbeere: harvestIcon("erdbeere") };

/** A choice's card: a close-up of what will have grown in the bed – the open sunflower against the sky, the carrots
 * pulled out on the earth, the red strawberries among their leaves. */
const plantCard = (plant: Plant): Picture =>
  pic(420, 320, () => (
    <g>
      {plant === "sonnenblume" && (
        <g>
          <rect x="-210" y="-160" width="420" height="320" fill="#a5d8ff" />
          <rect x="-210" y="100" width="420" height="60" fill={LAWN} />
          <path d="M0 160 Q-10 80 0 20" stroke={STEM} strokeWidth="18" fill="none" />
          <g transform="translate(-6 110) scale(-1.1 1.1)">
            <Leaf />
          </g>
          <g transform="translate(0 -30) scale(1.25)">
            <SunflowerHead />
          </g>
        </g>
      )}
      {plant === "karotte" && (
        <g>
          <rect x="-210" y="-160" width="420" height="320" fill="#8d5a3b" />
          <path d="M-210 -60 H210 M-210 40 H210" stroke="#6b4329" strokeWidth="8" strokeDasharray="90 30" />
          {[-110, 0, 110].map((x, i) => (
            <g key={x} transform={`translate(${x} ${i === 1 ? -40 : -20}) rotate(${(i - 1) * 14}) scale(1.05)`}>
              <Carrot />
            </g>
          ))}
        </g>
      )}
      {plant === "erdbeere" && (
        <g>
          <rect x="-210" y="-160" width="420" height="320" fill="#b2f2bb" />
          {(
            [
              [-150, 120],
              [-60, 150],
              [60, 140],
              [160, 110],
              [-170, -90],
              [170, -100],
            ] as const
          ).map(([x, y]) => (
            <g key={`${x}${y}`} transform={`translate(${x} ${y}) scale(2)`}>
              <TriLeaf />
            </g>
          ))}
          {[-90, 0, 90].map((x, i) => (
            <g key={x} transform={`translate(${x} ${i === 1 ? -110 : -80}) scale(1.6)`}>
              <Strawberry />
            </g>
          ))}
        </g>
      )}
    </g>
  ));
const PLANT_CARD: Record<Plant, Picture> = { sonnenblume: plantCard("sonnenblume"), karotte: plantCard("karotte"), erdbeere: plantCard("erdbeere") };

const PLANT_SAY: Record<Plant, string> = {
  sonnenblume: "Eine Sonnenblume!",
  karotte: "Karotten!",
  erdbeere: "Erdbeeren!",
};
/** Each option's sound as its card comes out. */
const PLANT_SOUND: Record<Plant, Cue[]> = {
  sonnenblume: [[0, playChime]],
  karotte: [[0, playPlop]],
  erdbeere: [[0, playTwinkle]],
};

// ---------- In the garden: what do we plant? ----------

/** The garden table with the three seed packets standing on it. */
const TABLE = { left: 1160, right: 1540, top: 600 };
const ON_TABLE: Record<Plant, Point> = { sonnenblume: [1230, 540], karotte: [1350, 540], erdbeere: [1470, 540] };
const KID_TABLE = 1100;
const PARENT_TABLE = 880;

/** A garden shed on the left, behind the people: boards, a roof, a door and a small window. */
function Shed() {
  return (
    <g>
      <path d="M20 500 L180 400 L340 500 Z" fill="#c92a2a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x="50" y="500" width="260" height={FEET - 500} fill="#a0522d" stroke={INK} strokeWidth="4" />
      <path d={Array.from({ length: 6 }, (_, i) => `M${92 + i * 42} 500 V${FEET}`).join(" ")} stroke="#8d5a3b" strokeWidth="3" />
      <rect x="90" y="560" width="80" height={FEET - 560} rx="6" fill="#8d5a3b" stroke={INK} strokeWidth="3" />
      <circle cx="156" cy="660" r="6" fill="#ffd43b" stroke={INK} strokeWidth="2" />
      <rect x="210" y="550" width="70" height="60" rx="5" fill="#fff3bf" stroke={INK} strokeWidth="3" />
      <path d="M245 550 V610 M210 580 H280" stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

function GardenTable() {
  const { left, right, top } = TABLE;
  return (
    <g>
      {[left + 24, right - 40].map((x) => (
        <rect key={x} x={x} y={top + 20} width="16" height={FEET - top - 20} fill="#8d5a3b" stroke={INK} strokeWidth="2" />
      ))}
      <rect x={left} y={top} width={right - left} height="24" rx="5" fill="#c08552" stroke={INK} strokeWidth="4" />
      <path d={`M${left + 10} ${top + 10} H${right - 10}`} stroke="#e8b678" strokeWidth="4" />
    </g>
  );
}

function GardenDraw({ step, busy }: SceneProps) {
  const kid = route<Point[]>(step, [
    [0, [[-60, FEET]]],
    [
      1,
      [
        [-60, FEET],
        [KID_TABLE, FEET],
      ],
    ],
  ]);
  const parent = route<Point[]>(step, [
    [0, [[-240, FEET]]],
    [
      1,
      [
        [-240, FEET],
        [PARENT_TABLE, FEET],
      ],
    ],
  ]);
  const walking = busy && step === 1;
  return (
    <Garden>
      <Shed />
      <GardenTable />
      {PLANTS.map((plant) => (
        <g key={plant} transform={`translate(${ON_TABLE[plant][0]} ${TABLE.top})`}>
          <SeedPacket plant={plant} />
        </g>
      ))}
      <Go path={parent} ms={4200}>
        <Grownup look={PARENT} pose={walking ? "walk" : "stand"} face={1} />
      </Go>
      <Go path={kid} ms={4200}>
        <Child pose={walking ? "walk" : step >= 2 ? "reach" : "stand"} />
      </Go>
      <Bed />
    </Garden>
  );
}

const garden: Scene = {
  id: "garten",
  icon: PACKETS_ICON,
  focus: [200, 240, 1360, 660],
  Draw: GardenDraw,
  beats: [
    { ms: 4400, say: "Heute sind wir im Garten. Das Beet ist schon fertig." },
    { ms: 2800, say: "Auf dem Tisch liegen Tüten mit Samen." },
  ],
  choice: {
    ask: "Was soll in unserem Beet wachsen?",
    options: PLANTS.map((plant) => ({
      id: plant,
      picture: HARVEST_ICON[plant],
      card: PLANT_CARD[plant],
      sounds: PLANT_SOUND[plant],
      at: ON_TABLE[plant],
      r: 56,
      say: PLANT_SAY[plant],
    })),
  },
};

// ---------- At the bed: dig, sow, cover, water ----------

/** Where the spade waits beside the bed, the seed packet lies in the grass and the watering can waits, clear of the child. */
const SPADE_REST: Point = [560, 840];
const SPADE_DIG: Point = [PLANT[0] - 40, PLANT[1] + 4];
const PACKET_REST: Point = [990, 880];
const PACKET_POUR: Point = [PLANT[0] - 10, PLANT[1] - 70];
const CAN_REST: Point = [1180, 850];
const CAN_POUR: Point = [PLANT[0] + 150, PLANT[1] - 70];

function BedDraw({ step, busy, picks }: SceneProps) {
  const plant = picks[0] as Plant;
  const spade = route<Point[]>(step, [
    [0, [SPADE_REST]],
    [2, [SPADE_REST, [SPADE_REST[0] + 60, SPADE_REST[1] - 90], SPADE_DIG]],
    [3, [SPADE_DIG, [SPADE_REST[0] + 60, SPADE_REST[1] - 90], SPADE_REST]],
  ]);
  const packet = route<Point[]>(step, [
    [0, [PACKET_REST]],
    [3, [PACKET_REST, [PACKET_REST[0] + 30, PACKET_POUR[1] - 40], PACKET_POUR]],
  ]);
  const can = route<Point[]>(step, [
    [0, [CAN_REST]],
    [5, [CAN_REST, [CAN_POUR[0] + 60, CAN_POUR[1] - 40], CAN_POUR]],
  ]);
  const digging = step === 2 && busy;
  const sowing = step === 3 && busy;
  const watering = step === 5 && busy;
  const dug = step >= 2 && step < 4;
  const covered = step >= 4;
  const acting = busy && (step === 2 || step === 3 || step === 5);
  return (
    <Garden>
      <People kid={acting ? "reach" : "stand"} parent="stand" />
      <Bed wet={step >= 5} />
      {dug && (
        <g>
          <Pop delay={2.2}>
            <ellipse cx={PLANT[0]} cy={PLANT[1]} rx="34" ry="10" fill="#3b2418" />
          </Pop>
          <Pop delay={2.4}>
            <path
              d={`M${PLANT[0] + 36} ${PLANT[1] + 6} Q${PLANT[0] + 60} ${PLANT[1] - 26} ${PLANT[0] + 86} ${PLANT[1] + 6} Z`}
              fill="#8d5a3b"
              stroke={INK}
              strokeWidth="3"
            />
          </Pop>
        </g>
      )}
      {sowing && (
        <g fill="#f4b860" stroke={INK} strokeWidth="1.5">
          {[-12, 4, 18].map((dx, i) => (
            <ellipse
              key={dx}
              className="fm-gt-seed"
              style={{ animationDelay: `calc(${2.2 + i * 0.3}s * var(--fm-pace))` }}
              cx={PLANT[0] + dx}
              cy={PLANT[1] - 56}
              rx="5"
              ry="7"
            />
          ))}
        </g>
      )}
      {covered && (
        <Pop delay={step === 4 ? 1.2 : 0}>
          <Mound plant={plant} stake={false} />
        </Pop>
      )}
      {covered && (
        <Pop delay={step === 4 ? 2.6 : 0}>
          <Stake plant={plant} />
        </Pop>
      )}
      <Go path={spade} ms={1400}>
        <g className={digging ? "fm-gt-dig" : undefined}>
          <Spade />
        </g>
      </Go>
      {!covered && (
        <Go path={packet} ms={1400}>
          <g className={sowing ? "fm-gt-tip" : undefined} style={{ transformOrigin: "0px -60px" }}>
            <g transform={step >= 3 ? undefined : "rotate(-10)"}>
              <SeedPacket plant={plant} />
            </g>
          </g>
        </Go>
      )}
      <Go path={can} ms={1400}>
        <g className={watering ? "fm-gt-tilt" : undefined} style={{ transformOrigin: "0px -40px" }}>
          <WateringCan />
        </g>
      </Go>
      {watering && (
        <g stroke="#74c0fc" strokeWidth="6" strokeLinecap="round">
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              className="fm-gt-water"
              style={{ animationDelay: `calc(${2.3 + i * 0.25}s * var(--fm-pace))` }}
              d={`M${PLANT[0] + 20 + i * 14} ${PLANT[1] - 150} v18`}
            />
          ))}
        </g>
      )}
    </Garden>
  );
}

const bed: Scene = {
  id: "beet",
  icon: BED_ICON,
  focus: [480, 460, 840, 440],
  Draw: BedDraw,
  beats: [
    { ms: 2600, say: "Hier ist unser Beet." },
    {
      tap: { at: [SPADE_REST[0], SPADE_REST[1] - 80], r: 70 },
      ask: "Grab ein kleines Loch!",
      sounds: [[1500, playRustle]],
      say: "Ein Loch in der Erde.",
      ms: 3400,
    },
    {
      tap: { at: [PACKET_REST[0], PACKET_REST[1] - 60], r: 60 },
      ask: "Leg die Samen hinein!",
      sounds: [[1700, playPlop]],
      say: "Die Samen fallen ins Loch.",
      ms: 3600,
    },
    { ms: 3600, sounds: [[700, playRustle]], say: "Erde drauf. Jetzt schlafen die Samen in der Erde." },
    {
      tap: { at: [CAN_REST[0], CAN_REST[1] - 66], r: 66 },
      ask: "Jetzt gießen wir!",
      sounds: [[1600, playTrickle]],
      say: "Plitsch, platsch. Die Erde trinkt.",
      ms: 4000,
    },
  ],
};

// ---------- Rain and sun: the plant grows ----------

const CLOUD_REST: Point = [600, 210];
const CLOUD_RAIN: Point = [PLANT[0], 330];
const CLOUD_GONE: Point = [2000, 200];

/** The grey-white rain cloud, centred on (0, 0); while it rains (`raining`) drops fall from it down to the bed. */
function RainCloud({ raining }: { raining: boolean }) {
  return (
    <g>
      {raining && (
        <g stroke="#4dabf7" strokeWidth="7" strokeLinecap="round">
          {[0, 1, 2].map((n) => (
            <g key={n} className="fm-gt-rain" style={{ animationDelay: `calc(${2 + n * 0.35}s * var(--fm-pace))` }}>
              {[-110, -60, -10, 40, 90].map((x, i) => (
                <path key={x} d={`M${x + n * 16} ${50 + ((i + n) % 3) * 30} l-6 26`} />
              ))}
            </g>
          ))}
        </g>
      )}
      <g transform="scale(1.4)">
        <path
          d="M-90 20 Q-112 20 -110 0 Q-108 -22 -80 -20 Q-74 -54 -36 -52 Q-14 -80 22 -66 Q52 -78 66 -44 Q104 -46 106 -12 Q110 20 82 20 Z"
          fill="#e9ecef"
          stroke="#868e96"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path d="M-70 4 Q-20 14 60 4" stroke="#f8f9fa" strokeWidth="10" strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
}

function WeatherDraw({ step, busy, picks }: SceneProps) {
  const plant = picks[0] as Plant;
  const cloud = route<Point[]>(step, [
    [0, [CLOUD_REST]],
    [2, [CLOUD_REST, CLOUD_RAIN]],
    [4, [CLOUD_RAIN, CLOUD_GONE]],
  ]);
  // The sprout comes after the rain, half grown in the sun, grown the next days.
  const stage = step >= 5 ? 3 : step >= 4 ? 2 : step >= 3 ? 1 : 0;
  const happy = busy && (step === 3 || step === 5);
  return (
    <Garden>
      {step >= 4 && (
        <g transform="translate(1420 110)">
          <circle className="fm-gt-shine" r="100" fill="none" stroke="#ffe066" strokeWidth="18" />
        </g>
      )}
      <People kid={happy ? "cheer" : "stand"} parent={happy ? "cheer" : "stand"} />
      <Bed wet={step >= 2 && step < 4} furrows={false} />
      <Mound plant={plant} />
      <Growing plant={plant} stage={stage} />
      <Go path={cloud} ms={step >= 4 ? 3000 : 1800}>
        <RainCloud raining={step === 2} />
      </Go>
    </Garden>
  );
}

const weather: Scene = {
  id: "wetter",
  icon: WEATHER_ICON,
  focus: [300, 46, 1180, 834],
  Draw: WeatherDraw,
  beats: [
    { ms: 3000, say: "Die Samen brauchen Regen und Sonne." },
    {
      tap: { at: CLOUD_REST, r: 100 },
      ask: "Hol die Regenwolke!",
      sounds: [[1500, playDrops]],
      say: "Es regnet auf unser Beet.",
      ms: 4600,
    },
    { ms: 3000, sounds: [[500, playPop]], say: "Schau, ein kleiner Keim!" },
    {
      tap: { at: CLOUD_RAIN, r: 100 },
      ask: "Schieb die Wolke weg!",
      sounds: [[400, playChime]],
      say: "Die Sonne scheint warm. Die Pflanze wächst.",
      ms: 4200,
    },
    { ms: 3800, sounds: [[800, playLeaves]], say: "Jeden Tag wird sie ein bisschen größer." },
  ],
};

// ---------- The end: it blooms, or it is harvested ----------

/** The bowl the strawberries go into, on the bed's front board left of the plant. */
const BOWL_AT: Point = [640, 818];
/** Where the child stands at the harvest: at the bed's back corner, so the wide carrot tops and strawberry leaves don't
 * cover it (at KID_X they hid its face). */
const HARVEST_KID_X = 600;
/** Where the child's raised hand is (pose „lift“), with the carrot in it. */
const HAND_UP: Point = [HARVEST_KID_X + 40, FEET - 150];

function SunflowerDraw({ step, busy }: SceneProps) {
  const bee = route<Point[]>(step, [
    [0, [[1900, 60]]],
    [
      3,
      [
        [1900, 60],
        [1400, 220],
        [PLANT[0] + 10, PLANT[1] - SUNFLOWER_TOP - 40],
      ],
    ],
  ]);
  const happy = busy && (step === 2 || step === 4);
  return (
    <Garden>
      <People kid={happy ? "cheer" : "stand"} parent={happy ? "cheer" : "stand"} />
      <Bed furrows={false} />
      <Mound plant="sonnenblume" />
      <g transform={`translate(${PLANT[0]} ${PLANT[1]})`}>
        <Sunflower stage={3} open={step >= 2} />
      </g>
      <Go path={bee} ms={3200}>
        <Bee flying={step === 3 && busy} />
      </Go>
    </Garden>
  );
}

function CarrotDraw({ step, busy }: SceneProps) {
  // The middle carrot comes up out of the earth into the child's raised hand, then the child holds it.
  const pulling = step === 2 && busy;
  const held = step >= 2 && !pulling;
  const pull = route<Point[]>(step, [
    [0, [PLANT]],
    [2, [PLANT, [PLANT[0], PLANT[1] - 130], HAND_UP]],
  ]);
  const bee = route<Point[]>(step, [
    [0, [[-300, 160]]],
    [4, [[-300, 160], [600, 380], [1100, 460], BEE_FLOWER]],
  ]);
  const holding: Holding | null = !held ? null : step >= 3 && !(step === 3 && busy) ? "carrotBitten" : "carrot";
  const kid: Pose = step === 3 && busy ? "drink" : step >= 2 ? (step === 4 && busy ? "cheer" : "lift") : "stand";
  return (
    <Garden>
      <People kid={kid} parent={step === 4 && busy ? "cheer" : "stand"} holding={holding} kidX={HARVEST_KID_X} />
      <Bed furrows={false} />
      <Mound plant="karotte" />
      <g transform={`translate(${PLANT[0]} ${PLANT[1]})`}>
        <Carrots stage={3} pulled={step >= 2} />
      </g>
      <Go path={pull} ms={2000}>
        <g style={{ opacity: pulling ? 1 : 0 }}>
          <g transform="scale(0.62)">
            <Carrot />
          </g>
        </g>
      </Go>
      <Go path={bee} ms={3600}>
        <Bee flying={step === 4 && busy} />
      </Go>
    </Garden>
  );
}

/** Where the picked strawberries lie in the bowl. */
const IN_BOWL: Point[] = [
  [BOWL_AT[0] - 22, BOWL_AT[1] - 60],
  [BOWL_AT[0] + 20, BOWL_AT[1] - 62],
  [BOWL_AT[0], BOWL_AT[1] - 78],
];

function StrawberryDraw({ step, busy }: SceneProps) {
  const bee = route<Point[]>(step, [
    [0, [[1900, 60]]],
    [
      2,
      [
        [1900, 60],
        [1300, 420],
        [PLANT[0] + STRAW_FLOWERS[1][0], PLANT[1] + STRAW_FLOWERS[1][1] - 34],
      ],
    ],
    [
      3,
      [
        [PLANT[0] + STRAW_FLOWERS[1][0], PLANT[1] + STRAW_FLOWERS[1][1] - 34],
        [1200, 300],
        [1900, -100],
      ],
    ],
  ]);
  const picked = step >= 4;
  const eating = step === 5 && busy;
  const eaten = step >= 5 && !eating;
  const happy = busy && step === 3;
  const kid: Pose = eating ? "drink" : happy || (step >= 5 && !busy) ? "cheer" : "stand";
  return (
    <Garden>
      <People kid={kid} parent={happy ? "cheer" : "stand"} holding={eating ? "berry" : null} kidX={HARVEST_KID_X} />
      <Bed furrows={false} />
      <Mound plant="erdbeere" />
      <g transform={`translate(${PLANT[0]} ${PLANT[1]})`}>
        <StrawberryPlant stage={3} ripe={step >= 3} picked={picked} />
      </g>
      <g transform={`translate(${BOWL_AT[0]} ${BOWL_AT[1]})`}>
        <SmallBowl />
      </g>
      {STRAW_FLOWERS.map(([x, y], i) => (
        <Go
          key={x}
          path={picked ? [[PLANT[0] + x, PLANT[1] + y], [PLANT[0] + x - 40, PLANT[1] + y - 80], IN_BOWL[i]] : [[PLANT[0] + x, PLANT[1] + y]]}
          ms={1100}
          delay={i * 700}
          className={eaten ? "fm-gt-gone" : undefined}
        >
          <g transform="scale(0.7)" style={{ opacity: picked ? 1 : 0 }}>
            <Strawberry />
          </g>
        </Go>
      ))}
      <Go path={bee} ms={3200}>
        <Bee flying={busy && (step === 2 || step === 3)} />
      </Go>
    </Garden>
  );
}

const harvest: Record<Plant, Scene> = {
  sonnenblume: {
    id: "bluete",
    icon: HARVEST_ICON.sonnenblume,
    focus: [300, 200, 1160, 700],
    Draw: SunflowerDraw,
    beats: [
      { ms: 3000, say: "Die Sonnenblume ist groß geworden." },
      {
        tap: { at: [PLANT[0], PLANT[1] - SUNFLOWER_TOP], r: 80 },
        ask: "Tipp die Knospe an!",
        sounds: [[600, playChime]],
        say: "Sie blüht! Wie eine kleine Sonne.",
        ms: 3800,
      },
      { ms: 4400, sounds: [[600, playBuzz]], say: "Summ, summ. Eine Biene besucht die Blume." },
      { ms: 3200, say: "Die Sonnenblume ist größer als wir alle!" },
    ],
  },
  karotte: {
    id: "karotten",
    icon: HARVEST_ICON.karotte,
    focus: [300, 200, 1160, 700],
    Draw: CarrotDraw,
    beats: [
      { ms: 3000, say: "Die Karotten sind groß geworden." },
      {
        tap: { at: [PLANT[0], PLANT[1] - 60], r: 90 },
        ask: "Zieh eine Karotte heraus!",
        sounds: [[1200, playPlop]],
        say: "Hau ruck! Da ist sie!",
        ms: 3400,
      },
      {
        tap: { at: [HAND_UP[0], HAND_UP[1] + 10], r: 64 },
        ask: "Beiß hinein!",
        sounds: [[400, playCrunch]],
        say: "Knack! Die Karotte ist süß.",
        ms: 3200,
      },
      { ms: 4000, sounds: [[600, playBuzz]], say: "Summ, summ. Eine Biene fliegt zu den Tulpen." },
    ],
  },
  erdbeere: {
    id: "erdbeeren",
    icon: HARVEST_ICON.erdbeere,
    focus: [300, 200, 1160, 700],
    Draw: StrawberryDraw,
    beats: [
      { ms: 3000, say: "Die Erdbeere blüht." },
      { ms: 4400, sounds: [[600, playBuzz]], say: "Summ, summ. Eine Biene besucht die Blüten." },
      { ms: 3600, sounds: [[900, playTwinkle]], say: "Aus den Blüten werden rote Erdbeeren!" },
      {
        tap: { at: [PLANT[0], PLANT[1] - 80], r: 80 },
        ask: "Pflück die Erdbeeren!",
        sounds: [
          [800, playPlop],
          [1500, playPlop],
          [2200, playPlop],
        ],
        say: "Rein in die Schüssel.",
        ms: 3600,
      },
      {
        tap: { at: [BOWL_AT[0], BOWL_AT[1] - 40], r: 56 },
        ask: "Jetzt essen wir!",
        sounds: [
          [300, playMunch],
          [1500, playYum],
        ],
        say: "Mmh, süß und lecker!",
        ms: 3400,
      },
    ],
  },
};

/** „Unser Garten wächst“: what the child picks, from the seed packet through sowing, rain and sun to the flower or the
 * harvest. */
export const GARTEN: Film = {
  id: "garten",
  title: "Unser Garten wächst",
  end: "Das haben wir selbst gepflanzt!",
  scenes: (picks) => (picks[0] ? [garden, bed, weather, harvest[picks[0] as Plant]] : [garden]),
};
