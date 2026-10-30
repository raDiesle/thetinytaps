import { memo, useId, useMemo } from "react";
import { VIEW_H, type LevelProps } from "./level";
import {
  BED,
  BLOBS,
  BULB_DROP,
  BULBS,
  buildLight,
  CAROUSEL,
  CHEST,
  DESK,
  DISCO,
  DOME_Y,
  DRESSER,
  FIREFLIES,
  FLOOR,
  GLOBE,
  GLOBE_BUTTON,
  JAR,
  LAMP,
  LAVA,
  lavaHalf,
  type Light,
  MIRROR,
  NAILS,
  NIGHTSTAND,
  OWL,
  SHADOW,
  SIDE_TABLE,
  STOOL,
  SWITCH,
  TORCH,
  WORLD_W,
  wireY,
} from "./light";
import { easeOut, seg } from "./machineKit";
import { MachineStage, TapHint } from "./MachineStage";
import { BAR_COLORS, STAR_POINTS } from "./parts";
import type { Pt } from "./path";
import { INK, Picture, Sparkles } from "./scenery";

/** The wallpaper in daylight; the night lies over it as a dark veil with holes where the light is. */
const WALL = "#9fb0e8";
const NIGHT = "#070b2a";
const LIGHT = "#fff6b8";
const PLUSH = "#a77bca";
/** The black card of the shadow cut-outs, and the colour of their shadows on the wall. */
const CARD = "#241a4d";
const SHADE = "#1a1440";
/** How much bigger than their shapes the cut-outs are drawn (their shadows are `SHADOW.scale` times the shapes). */
const CUT = 1.4;

/** A place where light makes a hole in the dark: middle, size, and how much (0 to 1). */
interface Hole {
  x: number;
  y: number;
  r: number;
  k: number;
}

/**
 * Level 8: the light chain (R-10). A dark children's room; one tap switches
 * on the torch, its beam bounces off the mirror onto the disco ball, a golden
 * spot from the ball wanders onto the jar of sleeping fireflies, they wake up
 * and fly along the fairy lights (each bulb comes on as they pass) down to the
 * lava lamp, where the first lands on its switch. The lamp's blobs warm up and
 * rise, the warm air turns the paper carousel on its cap, and the rabbit and
 * bird cut-outs throw big shadows that hop and fly over the wall. The paper bird
 * comes loose, flutters onto the globe's button, the globe lights up and turns,
 * and its glow calls the fireflies over it to the star lamp, which throws stars
 * all over the room. Then the toy owl on the bed wakes up. The camera travels
 * along with the light.
 */
export function LightLevel(props: LevelProps) {
  const light = useMemo(buildLight, []);
  const ids = useId();

  return (
    <MachineStage machine={light} level="light" {...props}>
      {(t) => (
        <>
          <Room paper={`${ids}-paper`} />
          <WallShadows light={light} t={t} />
          <Nightstand />
          <Torch on={t >= 0} />
          <Chest />
          <Mirror tilt={light.mirrorTilt} />
          <DiscoBall spin={light.spin(t)} />
          <Stool />
          <Jar light={light} t={t} />
          <FairyLights />
          <SideTable />
          <Carousel light={light} t={t} side="back" />
          <LavaLamp light={light} t={t} />
          <Carousel light={light} t={t} side="front" />
          <WarmAir light={light} t={t} />
          <Desk />
          <Globe light={light} t={t} />
          <Dresser />
          <Lamp light={light} t={t} />
          <Bed />
          <Owl light={light} t={t} />

          <Night light={light} t={t} ids={ids} />

          <Beam light={light} t={t} />
          <DiscoSpots light={light} t={t} />
          <GoldenSpot light={light} t={t} />
          <LitBulbs light={light} t={t} glow={`${ids}-glow`} />
          <Halo x={LAVA.x} y={490} r={170} k={0.3 * light.lavaGlow(t)} glow={`${ids}-glow`} />
          <Halo x={GLOBE.x} y={GLOBE.y} r={170} k={0.35 * light.globeGlow(t)} glow={`${ids}-glow`} />
          <LampLight light={light} t={t} glow={`${ids}-glow`} />
          <PaperBird light={light} t={t} />
          <Fireflies light={light} t={t} glow={`${ids}-glow`} />
          <Sparkles x={LAMP.x} y={DOME_Y - 140} age={t - light.tLamp - 0.6} n={12} spread={300} />
          <Sparkles x={OWL.x} y={OWL.y - 40} age={t - light.tOwl} n={8} spread={140} />
          <TapHint t={t} x={TORCH.x0 + 80} y={NIGHTSTAND.top + 140} />
        </>
      )}
    </MachineStage>
  );
}

/* ---------- The room ---------- */

function Room({ paper }: { paper: string }) {
  return (
    <g>
      <defs>
        <pattern id={paper} width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill={WALL} />
          <circle cx="30" cy="30" r="6" fill="#b9c6f2" />
          <circle cx="90" cy="90" r="6" fill="#b9c6f2" />
        </pattern>
      </defs>
      <rect x="-400" y="-200" width={WORLD_W + 800} height={FLOOR + 200} fill={`url(#${paper})`} />
      <NightWindow x={2560} />
      <Picture x={1180} y={420} />
      <Picture x={3380} y={330} />
      {/* Floor boards */}
      <rect x="-400" y={FLOOR - 14} width={WORLD_W + 800} height="14" fill="#f2f2ff" stroke={INK} strokeWidth="3" />
      <rect x="-400" y={FLOOR} width={WORLD_W + 800} height={VIEW_H - FLOOR + 200} fill="#c99a6b" />
      {Array.from({ length: Math.ceil((WORLD_W + 800) / 180) }, (_, i) => (
        <line key={i} x1={-400 + i * 180} y1={FLOOR} x2={-400 + i * 180 - 40} y2={VIEW_H + 200} stroke="#a97c50" strokeWidth="4" />
      ))}
      <line x1="-400" y1={FLOOR} x2={WORLD_W + 400} y2={FLOOR} stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** A window with the night outside: moon and stars, and curtains drawn aside. */
function NightWindow({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 270)`}>
      <rect width="280" height="220" rx="10" fill="#1b2266" stroke={INK} strokeWidth="5" />
      <path d="M206 40 a34 34 0 1 0 26 58 a28 28 0 1 1 -26 -58 Z" fill="#fff3b0" />
      {[
        [50, 50],
        [110, 34],
        [80, 150],
        [180, 170],
        [240, 140],
      ].map(([sx, sy]) => (
        <polygon key={sx} points={STAR_POINTS} transform={`translate(${sx} ${sy}) scale(0.6)`} fill="#fff3b0" />
      ))}
      <line x1="140" y1="0" x2="140" y2="220" stroke={INK} strokeWidth="5" />
      <line x1="0" y1="110" x2="280" y2="110" stroke={INK} strokeWidth="5" />
      {[-1, 1].map((side) => (
        <path
          key={side}
          d={side < 0 ? "M-30 -16 L40 -16 Q10 110 -30 236 Z" : "M310 -16 L240 -16 Q270 110 310 236 Z"}
          fill="#ff7bd0"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      ))}
      <rect x="-40" y="-24" width="360" height="12" rx="6" fill="#8e7dff" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/* ---------- Torch, mirror, disco ball ---------- */

function Nightstand() {
  const { x0, x1, top } = NIGHTSTAND;
  return (
    <g>
      <rect x={x0} y={top} width={x1 - x0} height={FLOOR - top - 30} rx="8" fill="#ffd8a8" stroke={INK} strokeWidth="4" />
      <rect x={x0 + 20} y={top + 30} width={x1 - x0 - 40} height="60" rx="6" fill="#ffc078" stroke={INK} strokeWidth="3" />
      <circle cx={(x0 + x1) / 2} cy={top + 60} r="8" fill={INK} />
      {[x0 + 16, x1 - 30].map((x) => (
        <rect key={x} x={x} y={FLOOR - 32} width="14" height="32" fill="#ffc078" stroke={INK} strokeWidth="3" />
      ))}
    </g>
  );
}

/** The torch lying on its side; the switch on top goes down at the tap and the glass lights up. */
function Torch({ on }: { on: boolean }) {
  const { x0, r, lens } = TORCH;
  const y = lens.y;
  const neck = lens.x - 44;
  return (
    <g>
      <rect x={x0} y={y - r} width={neck - x0} height={2 * r} rx="10" fill="#ff5d73" stroke={INK} strokeWidth="4" />
      {[x0 + 20, x0 + 34].map((x) => (
        <line key={x} x1={x} y1={y - r + 4} x2={x} y2={y + r - 4} stroke="#c9324a" strokeWidth="4" />
      ))}
      <rect x={x0 + 70} y={y - r - (on ? 6 : 12)} width="28" height="14" rx="5" fill="#ffd23f" stroke={INK} strokeWidth="3" />
      <path
        d={`M${neck} ${y - r} L${lens.x} ${y - 34} L${lens.x} ${y + 34} L${neck} ${y + r} Z`}
        fill="#ff8c42"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <ellipse cx={lens.x} cy={y} rx="8" ry="32" fill={on ? LIGHT : "#cfd8ea"} stroke={INK} strokeWidth="4" />
    </g>
  );
}

function Chest() {
  const { x0, x1, top } = CHEST;
  return (
    <g>
      <rect x={x0} y={top} width={x1 - x0} height={FLOOR - top} rx="10" fill="#3ec300" stroke={INK} strokeWidth="4" />
      <rect x={x0 - 8} y={top} width={x1 - x0 + 16} height="26" rx="8" fill="#2f9a00" stroke={INK} strokeWidth="4" />
      <polygon points={STAR_POINTS} transform={`translate(${(x0 + x1) / 2} ${top + 66}) scale(1.6)`} fill="#ffd23f" stroke={INK} strokeWidth="2" />
    </g>
  );
}

/** The round mirror on its foot, tilted so the torch's light goes up to the disco ball. */
function Mirror({ tilt }: { tilt: number }) {
  const { c, half } = MIRROR;
  return (
    <g>
      <rect x={c.x - 40} y={CHEST.top - 12} width="80" height="12" rx="5" fill="#8e7dff" stroke={INK} strokeWidth="3" />
      <line x1={c.x} y1={CHEST.top - 10} x2={c.x} y2={c.y + 10} stroke={INK} strokeWidth="10" strokeLinecap="round" />
      <line x1={c.x} y1={CHEST.top - 10} x2={c.x} y2={c.y + 10} stroke="#8e7dff" strokeWidth="5" strokeLinecap="round" />
      <g transform={`translate(${c.x} ${c.y}) rotate(${tilt})`}>
        <ellipse rx={half} ry="16" fill="#ffb703" stroke={INK} strokeWidth="4" />
        <ellipse cy="-3" rx={half - 10} ry="8" fill="#e8f9ff" />
        <line x1={-half + 26} y1="-5" x2={-half + 46} y2="-5" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx={c.x} cy={c.y} r="6" fill={INK} />
    </g>
  );
}

/** The disco ball: rows of little mirror squares that move round as it turns. */
function DiscoBall({ spin }: { spin: number }) {
  const { x, y, r } = DISCO;
  const facets: { fx: number; fy: number; w: number; h: number; i: number }[] = [];
  for (let row = -3; row <= 3; row++) {
    const lat = (row * Math.PI) / 8;
    const ring = r * Math.cos(lat);
    for (let col = 0; col < 14; col++) {
      const lon = (col * 2 * Math.PI) / 14 + spin;
      if (Math.cos(lon) <= 0.08) continue;
      facets.push({ fx: ring * Math.sin(lon), fy: r * Math.sin(lat), w: 15 * Math.cos(lon) * Math.cos(lat), h: 13, i: row * 14 + col });
    }
  }
  return (
    <g>
      <line x1={x} y1="-220" x2={x} y2={y - r} stroke={INK} strokeWidth="4" />
      <rect x={x - 12} y={y - r - 12} width="24" height="16" rx="4" fill="#c9d1e8" stroke={INK} strokeWidth="3" />
      <circle cx={x} cy={y} r={r} fill="#8f98c8" stroke={INK} strokeWidth="4" />
      {facets.map((f) => (
        <rect
          key={f.i}
          x={x + f.fx - f.w / 2}
          y={y + f.fy - f.h / 2}
          width={f.w}
          height={f.h}
          rx="2"
          fill={(f.i * 5) % 7 === 0 ? "#ffffff" : (f.i * 3) % 5 === 0 ? "#b9f1ff" : "#d6dcf2"}
        />
      ))}
      <circle cx={x - 22} cy={y - 26} r="10" fill="#fff" opacity="0.8" />
    </g>
  );
}

/* ---------- Fireflies, fairy lights, star lamp, bed ---------- */

function Stool() {
  const { x0, x1, top } = STOOL;
  return (
    <g>
      {[x0 + 18, x1 - 32].map((x) => (
        <rect key={x} x={x} y={top + 14} width="14" height={FLOOR - top - 14} fill="#ffb703" stroke={INK} strokeWidth="3" />
      ))}
      <rect x={x0} y={top} width={x1 - x0} height="18" rx="9" fill="#ff8c42" stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** The glass jar; its lid has air holes and flips open on its hinge when the fireflies are awake. */
function Jar({ light, t }: { light: Light; t: number }) {
  const { x, bottom, top, w } = JAR;
  const open = -125 * easeOut(seg(t, light.tLid, light.tLid + 0.35));
  const hinge = { x: x + w / 2 + 6, y: top };
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={bottom - top} rx="22" fill="#d9f3ff" opacity="0.5" stroke={INK} strokeWidth="4" />
      <path d={`M${x - w / 2 + 16} ${top + 24} L${x - w / 2 + 16} ${bottom - 26}`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
      <rect x={x - w / 2 - 4} y={top - 6} width={w + 8} height="14" rx="6" fill="#d9f3ff" stroke={INK} strokeWidth="3" />
      <g transform={`rotate(${open} ${hinge.x} ${hinge.y})`}>
        <rect x={x - w / 2 - 8} y={top - 26} width={w + 16} height="22" rx="7" fill="#ff5d73" stroke={INK} strokeWidth="4" />
        {[-30, 0, 30].map((dx) => (
          <circle key={dx} cx={x + dx} cy={top - 15} r="4" fill={INK} />
        ))}
      </g>
    </g>
  );
}

/** The wire of the fairy lights from nail to nail, with its bulbs still off. */
function FairyLights() {
  const pts: Pt[] = [];
  for (let x = NAILS[0]; x <= NAILS[NAILS.length - 1]; x += 20) pts.push({ x, y: wireY(x) });
  return (
    <g>
      <path d={`M${pts.map((p) => `${p.x} ${p.y}`).join(" L")}`} fill="none" stroke="#2f7d4a" strokeWidth="4" />
      {NAILS.map((x) => (
        <circle key={x} cx={x} cy={wireY(x)} r="7" fill="#c9d1e8" stroke={INK} strokeWidth="3" />
      ))}
      {BULBS.map((x) => (
        <Bulb key={x} x={x} color="#8a93b8" />
      ))}
    </g>
  );
}

function Bulb({ x, color }: { x: number; color: string }) {
  const y = wireY(x);
  return (
    <g>
      <rect x={x - 6} y={y} width="12" height="12" rx="2" fill="#2f7d4a" stroke={INK} strokeWidth="2" />
      <ellipse cx={x} cy={y + BULB_DROP} rx="10" ry="14" fill={color} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/* ---------- Lava lamp, shadow play, globe ---------- */

const SideTable = memo(function SideTable() {
  const { x0, x1, top } = SIDE_TABLE;
  return (
    <g>
      {[x0 + 30, x1 - 46].map((x) => (
        <rect key={x} x={x} y={top + 16} width="16" height={FLOOR - top - 16} rx="4" fill="#ff8c42" stroke={INK} strokeWidth="3" />
      ))}
      <rect x={x0} y={top} width={x1 - x0} height="22" rx="10" fill="#ffd23f" stroke={INK} strokeWidth="4" />
    </g>
  );
});

/** The outline of the lava lamp's glass, from the bottom left up and down the right side. */
const GLASS = (() => {
  const left: Pt[] = [];
  for (let y = LAVA.glass0; y >= LAVA.glass1; y -= 10) left.push({ x: LAVA.x - lavaHalf(y), y });
  const right = left.map((p) => ({ x: 2 * LAVA.x - p.x, y: p.y })).reverse();
  return `M${[...left, ...right].map((p) => `${p.x} ${p.y}`).join(" L")} Z`;
})();

/** The lava lamp: foot, glass with its blobs, cap, and the cord to the switch on the table, whose button the first firefly presses. */
function LavaLamp({ light, t }: { light: Light; t: number }) {
  const { x, glass0, glass1, top } = LAVA;
  const g = light.lavaGlow(t);
  const down = light.switchDown(t);
  return (
    <g>
      <path d={`M${x + 52} ${SIDE_TABLE.top - 4} L${SWITCH.x - 20} ${SIDE_TABLE.top - 4}`} stroke={INK} strokeWidth="4" fill="none" />
      <path
        d={`M${SWITCH.x + 20} ${SIDE_TABLE.top - 4} Q${SIDE_TABLE.x1 + 30} ${SIDE_TABLE.top} ${SIDE_TABLE.x1 + 16} ${FLOOR}`}
        stroke={INK}
        strokeWidth="4"
        fill="none"
      />
      <rect x={SWITCH.x - 20} y={SWITCH.y} width="40" height="12" rx="5" fill="#f2f2ff" stroke={INK} strokeWidth="3" />
      <ellipse cx={SWITCH.x} cy={SWITCH.y - 1 + 4 * down} rx="10" ry="6" fill="#ff5d73" stroke={INK} strokeWidth="3" />
      <path d={GLASS} fill="#463a78" />
      <path d={GLASS} fill="#c9a8ff" opacity={g} />
      {BLOBS.map(({ color }, i) => {
        const b = light.blobAt(i, t);
        // Dull while cold, brighter as the lamp shines and fully once warm.
        return <ellipse key={color} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} fill={color} opacity={0.45 + 0.55 * Math.max(g * 0.6, b.warm)} />;
      })}
      <path
        d={`M${x - 30} ${glass0 - 40} Q${x - 40} ${(glass0 + glass1) / 2} ${x - 18} ${glass1 + 20}`}
        stroke="#fff"
        strokeWidth="5"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />
      <path d={GLASS} fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path
        d={`M${x - 60} ${SIDE_TABLE.top} L${x - 42} ${glass0} L${x + 42} ${glass0} L${x + 60} ${SIDE_TABLE.top} Z`}
        fill="#8e7dff"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d={`M${x - 26} ${glass1 + 2} L${x - 15} ${top} L${x + 15} ${top} L${x + 26} ${glass1 + 2} Z`}
        fill="#8e7dff"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** The rabbit cut-out (or its shadow), facing right, its feet at 0 and about 56 high; it takes its fill from around it. */
function RabbitShape({ eye }: { eye?: boolean }) {
  return (
    <g>
      <ellipse cx="13" cy="-56" rx="4.5" ry="14" transform="rotate(-14 13 -56)" />
      <ellipse cx="23" cy="-54" rx="4.5" ry="13" transform="rotate(12 23 -54)" />
      <ellipse cx="0" cy="-18" rx="21" ry="16" />
      <circle cx="18" cy="-36" r="12" />
      <circle cx="-21" cy="-22" r="6" />
      <ellipse cx="8" cy="-3" rx="11" ry="4" />
      {eye && <circle cx="22" cy="-38" r="2.5" fill="#fff" />}
    </g>
  );
}

/** The bird cut-out (or its shadow), facing right around its middle; `flap` from -1 (wing down) to 1 (up). */
function BirdShape({ flap, eye }: { flap: number; eye?: boolean }) {
  return (
    <g>
      <path d="M-16 -2 L-31 -11 L-28 5 Z" />
      <ellipse rx="18" ry="10" />
      <circle cx="16" cy="-6" r="8" />
      <path d="M22 -9 L32 -5 L22 -2 Z" />
      <path d={`M-8 -3 Q0 ${-4 - 24 * flap} 12 -3 Z`} />
      {eye && <circle cx="18" cy="-8" r="2" fill="#fff" />}
    </g>
  );
}

/** The wing beat of the bird cut-out: a gentle flap on its thread, quicker while it flies, still on the globe and at the end. */
function birdFlap(light: Light, t: number) {
  const tt = Math.min(t, light.duration);
  if (t < light.tLoose) return 0.5 * Math.sin(tt * 6);
  return t < light.tGlobe ? Math.sin(tt * 16) : 0.3;
}

/** How high the rabbit is in its hop, 0 to 1 (its shadow on the wall hops with it). */
const rabbitHop = (light: Light, t: number) => (SHADOW.floor - light.rabbitShadow(t).y) / 50;

/** The big shadows the cut-outs throw on the wall behind the lava lamp: the rabbit hopping, the bird flying. */
function WallShadows({ light, t }: { light: Light; t: number }) {
  const r = light.rabbitShadow(t);
  const b = light.birdShadow(t);
  return (
    <g fill={SHADE}>
      {r.show > 0 && (
        <g opacity={0.7 * r.show} transform={`translate(${r.x} ${r.y}) scale(${SHADOW.scale})`}>
          <RabbitShape />
        </g>
      )}
      {b.show > 0 && (
        <g opacity={0.7 * b.show} transform={`translate(${b.x} ${b.y}) scale(${SHADOW.scale})`}>
          <BirdShape flap={birdFlap(light, t)} />
        </g>
      )}
    </g>
  );
}

/**
 * The paper carousel on the lava lamp's cap. `side` "back" draws the cut-outs behind the lamp (towards the wall),
 * "front" those in front of it with the needle, the hoop and the paper rotor. A cut-out turns its face along the
 * hoop, so it looks narrow at the sides.
 */
function Carousel({ light, t, side }: { light: Light; t: number; side: "back" | "front" }) {
  const { r, hoop, rotor } = CAROUSEL;
  const turn = light.carousel(t);
  const rabbit = light.rabbitAt(t);
  const bird = light.birdOnHoop(t);
  const figures = [{ key: "rabbit", ...rabbit, lift: 12 * rabbitHop(light, t) }, ...(bird ? [{ key: "bird", ...bird, lift: 0 }] : [])].filter((f) =>
    side === "back" ? Math.cos(f.a) < 0 : Math.cos(f.a) >= 0,
  );
  return (
    <g>
      {figures.map((f) => {
        // Behind the lamp it moves right, in front of it left; the face follows.
        const face = Math.cos(f.a) < 0 ? 1 : -1;
        const narrow = Math.max(0.2, Math.abs(Math.cos(f.a)));
        const y = f.pt.y - f.lift;
        return (
          <g key={f.key}>
            <line x1={f.pt.x} y1={hoop} x2={f.pt.x} y2={y - (f.key === "rabbit" ? 2 : 12)} stroke={INK} strokeWidth="1.5" />
            <g
              transform={`translate(${f.pt.x} ${f.key === "rabbit" ? y + 96 : y}) scale(${face * narrow * CUT} ${CUT})`}
              fill={CARD}
              stroke={INK}
              strokeWidth="1"
            >
              {f.key === "rabbit" ? <RabbitShape eye /> : <BirdShape flap={birdFlap(light, t)} eye />}
            </g>
          </g>
        );
      })}
      {side === "front" && (
        <g>
          <line x1={LAVA.x} y1={LAVA.top} x2={LAVA.x} y2={rotor - 6} stroke={INK} strokeWidth="3" />
          {[0, 1, 2, 3].map((k) => {
            const a = turn + (k * Math.PI) / 2;
            return <line key={k} x1={LAVA.x} y1={rotor + 4} x2={LAVA.x + r * Math.sin(a)} y2={hoop + 12 * Math.cos(a)} stroke={INK} strokeWidth="1.5" />;
          })}
          <ellipse cx={LAVA.x} cy={hoop} rx={r} ry="12" fill="none" stroke={INK} strokeWidth="5" />
          <ellipse cx={LAVA.x} cy={hoop} rx={r} ry="12" fill="none" stroke="#ffb703" strokeWidth="2.5" />
          {Array.from({ length: 6 }, (_, k) => {
            const a = turn * 1.5 + (k * Math.PI) / 3;
            return (
              <ellipse
                key={k}
                cx={LAVA.x + 26 * Math.sin(a)}
                cy={rotor + 4 * Math.cos(a)}
                rx={4 + 12 * Math.abs(Math.cos(a))}
                ry="6"
                fill={BAR_COLORS[k % BAR_COLORS.length]}
                stroke={INK}
                strokeWidth="2"
              />
            );
          })}
          <circle cx={LAVA.x} cy={rotor} r="6" fill="#ffd23f" stroke={INK} strokeWidth="2" />
        </g>
      )}
    </g>
  );
}

/** Wavy lines of warm air rising from the lava lamp's cap to the paper rotor. */
function WarmAir({ light, t }: { light: Light; t: number }) {
  const k = light.heat(t);
  if (k <= 0) return null;
  const tt = Math.min(t, light.duration);
  return (
    <g opacity={0.7 * k} fill="none" stroke={LIGHT} strokeWidth="3" strokeLinecap="round">
      {[-1, 0, 1].map((j) => {
        const pts: Pt[] = [];
        for (let y = LAVA.top - 6; y >= CAROUSEL.rotor + 16; y -= 6) pts.push({ x: LAVA.x + 11 * j + 5 * Math.sin(y / 8 + tt * 7 + j * 2), y });
        return <path key={j} d={`M${pts.map((p) => `${p.x} ${p.y}`).join(" L")}`} />;
      })}
    </g>
  );
}

const Desk = memo(function Desk() {
  const { x0, x1, top } = DESK;
  return (
    <g>
      <rect x={x0} y={top} width={x1 - x0} height={FLOOR - top} rx="8" fill="#b39cff" stroke={INK} strokeWidth="4" />
      <rect x={x0 + 18} y={top + 26} width={x1 - x0 - 36} height="50" rx="6" fill="#cbbcff" stroke={INK} strokeWidth="3" />
      <circle cx={(x0 + x1) / 2} cy={top + 51} r="7" fill="#ffd23f" stroke={INK} strokeWidth="2" />
    </g>
  );
});

/** Land on the globe: longitude and latitude (radians) and size of each blob. */
const LANDS = [
  { lon: 0, lat: -0.5, s: 30 },
  { lon: 0.5, lat: 0.35, s: 24 },
  { lon: 1.9, lat: -0.3, s: 34 },
  { lon: 2.4, lat: 0.6, s: 18 },
  { lon: 3.7, lat: 0.1, s: 28 },
  { lon: 4.9, lat: -0.55, s: 22 },
];

/** The globe on its foot: dark until the paper bird presses the button, then it shines, wobbles and turns. */
function Globe({ light, t }: { light: Light; t: number }) {
  const { x, y, r } = GLOBE;
  const g = light.globeGlow(t);
  const turn = light.globeTurn(t);
  const plinth = DESK.top - 24;
  return (
    <g>
      <rect x={x - 6} y={y + r} width="12" height={plinth - y - r} fill="#ffb703" stroke={INK} strokeWidth="3" />
      <rect x={x - 60} y={plinth} width="120" height="24" rx="8" fill="#8a5a2b" stroke={INK} strokeWidth="4" />
      <ellipse cx={GLOBE_BUTTON.x} cy={GLOBE_BUTTON.y - 2 + 4 * light.globeButton(t)} rx="10" ry="6" fill="#ff5d73" stroke={INK} strokeWidth="3" />
      <g transform={`rotate(${23 + light.globeWobble(t)} ${x} ${y})`}>
        <circle cx={x} cy={y} r={r} fill="#34508f" />
        <circle cx={x} cy={y} r={r} fill="#7fdcff" opacity={g} />
        {LANDS.map((l, i) => {
          const lon = l.lon + turn;
          const front = Math.cos(lon);
          if (front <= 0.05) return null;
          const ring = r * Math.cos(l.lat);
          return (
            <ellipse
              key={i}
              cx={x + (ring - l.s * 0.3) * Math.sin(lon)}
              cy={y + r * 0.85 * Math.sin(l.lat)}
              rx={l.s * front * Math.cos(l.lat)}
              ry={l.s * 0.6}
              fill={g > 0.5 ? "#8ee07a" : "#4f7d55"}
            />
          );
        })}
        <circle cx={x - 26} cy={y - 30} r="12" fill="#fff" opacity={0.3 + 0.4 * g} />
        <circle cx={x} cy={y} r={r} fill="none" stroke={INK} strokeWidth="4" />
        <path d={`M${x} ${y + r + 12} A${r + 12} ${r + 12} 0 0 0 ${x} ${y - r - 12}`} fill="none" stroke={INK} strokeWidth="9" />
        <path d={`M${x} ${y + r + 12} A${r + 12} ${r + 12} 0 0 0 ${x} ${y - r - 12}`} fill="none" stroke="#ffb703" strokeWidth="5" />
      </g>
    </g>
  );
}

/** A soft glow round something that shines, over the night. */
function Halo({ x, y, r, k, glow }: { x: number; y: number; r: number; k: number; glow: string }) {
  if (k <= 0) return null;
  return <circle cx={x} cy={y} r={r} fill={`url(#${glow})`} opacity={k} />;
}

/** The paper bird once it has come loose: it flutters over to the globe and sits on its button. */
function PaperBird({ light, t }: { light: Light; t: number }) {
  const b = light.birdFlying(t);
  if (!b) return null;
  return (
    <g transform={`translate(${b.pt.x} ${b.pt.y}) rotate(${b.tilt}) scale(${CUT})`} fill={CARD} stroke={INK} strokeWidth="1">
      <BirdShape flap={birdFlap(light, t)} eye />
    </g>
  );
}

function Dresser() {
  const { x0, x1, top } = DRESSER;
  return (
    <g>
      <rect x={x0} y={top} width={x1 - x0} height={FLOOR - top} rx="8" fill="#00b4d8" stroke={INK} strokeWidth="4" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={x0 + 16} y={top + 18 + i * 60} width={x1 - x0 - 32} height="48" rx="6" fill="#48cae4" stroke={INK} strokeWidth="3" />
          <circle cx={(x0 + x1) / 2} cy={top + 42 + i * 60} r="7" fill="#ffd23f" stroke={INK} strokeWidth="2" />
        </g>
      ))}
    </g>
  );
}

/** The star lamp: a dome with star-shaped holes on a base; it turns when it is on. */
function Lamp({ light, t }: { light: Light; t: number }) {
  const { x, r, baseH } = LAMP;
  const turn = light.lampTurn(t);
  return (
    <g>
      <rect x={x - 56} y={DOME_Y} width="112" height={baseH} rx="8" fill="#8e7dff" stroke={INK} strokeWidth="4" />
      <path d={`M${x - r} ${DOME_Y} A${r} ${r} 0 0 1 ${x + r} ${DOME_Y} Z`} fill="#c7c0e6" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <DomeStars turn={turn} color="#8f86b8" />
    </g>
  );
}

/** The star holes on the dome, moving round with the turning lamp. */
function DomeStars({ turn, color }: { turn: number; color: string }) {
  return (
    <g>
      {[0, 1].map((row) =>
        Array.from({ length: 8 }, (_, i) => {
          const lon = (i * 2 * Math.PI) / 8 + turn + row * 0.4;
          if (Math.cos(lon) <= 0.15) return null;
          const ring = LAMP.r * (row ? 0.5 : 0.82);
          const y = DOME_Y - (row ? 46 : 22);
          return (
            <polygon
              key={`${row}-${i}`}
              points={STAR_POINTS}
              transform={`translate(${LAMP.x + ring * Math.sin(lon)} ${y}) scale(${0.55 * Math.cos(lon)} 0.55)`}
              fill={color}
            />
          );
        }),
      )}
    </g>
  );
}

function Bed() {
  const { x0, x1, top } = BED;
  return (
    <g>
      <rect x={x1 - 44} y="420" width="44" height={FLOOR - 420} rx="14" fill="#ff8c42" stroke={INK} strokeWidth="4" />
      <rect x={x0} y="560" width="34" height={FLOOR - 560} rx="12" fill="#ff8c42" stroke={INK} strokeWidth="4" />
      <rect x={x0 + 20} y={top} width={x1 - x0 - 50} height="80" rx="10" fill="#fff" stroke={INK} strokeWidth="4" />
      <ellipse cx={x1 - 110} cy={top - 6} rx="80" ry="30" fill="#fff" stroke={INK} strokeWidth="4" />
      <path
        d={`M${x0 + 20} ${top + 10} L${x1 - 200} ${top - 10} L${x1 - 200} ${top + 80} L${x0 + 20} ${top + 80} Z`}
        fill="#ffb3e1"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={x0 + 70 + i * 50} cy={top + 40 + (i % 2) * 18} r="8" fill="#ff7bd0" />
      ))}
    </g>
  );
}

/** The toy owl on the pillow: asleep with closed eyes, until the stars wake it and it hops. */
function Owl({ light, t }: { light: Light; t: number }) {
  const awake = easeOut(seg(t, light.tOwl, light.tOwl + 0.2));
  const hop = 18 * Math.sin(Math.PI * seg(t, light.tOwl, light.tOwl + 0.5));
  return (
    <g transform={`translate(${OWL.x} ${OWL.y - hop})`}>
      <path d="M-30 -42 L-22 -66 L-8 -46 Z M30 -42 L22 -66 L8 -46 Z" fill={PLUSH} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse rx="42" ry="50" fill={PLUSH} stroke={INK} strokeWidth="4" />
      <ellipse cy="18" rx="26" ry="26" fill="#f1d9ff" />
      {[-17, 17].map((dx) => (
        <g key={dx}>
          <circle cx={dx} cy="-16" r="15" fill="#fff" stroke={INK} strokeWidth="3" />
          {awake > 0.5 ? (
            <circle cx={dx} cy="-16" r="7" fill={INK} />
          ) : (
            <path d={`M${dx - 9} -16 Q${dx} -9 ${dx + 9} -16`} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          )}
        </g>
      ))}
      <path d="M-6 -2 L6 -2 L0 10 Z" fill="#ffb703" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </g>
  );
}

/* ---------- The night and the light ---------- */

/** The dark over the whole room, with soft holes wherever something shines. */
function Night({ light, t, ids }: { light: Light; t: number; ids: string }) {
  const holes: Hole[] = [
    // Moonlight at the window, and a little round the torch so the child sees what to tap.
    { x: 2700, y: 380, r: 260, k: 0.6 },
    { x: 250, y: 590, r: 200, k: 0.55 },
  ];
  const front = light.beamFront(t);
  const b = light.beam(t);
  if (b.first > 0) {
    for (let x = TORCH.lens.x; x < Math.min(front.x, MIRROR.c.x) || (b.second > 0 && x <= MIRROR.c.x); x += 70)
      holes.push({ x, y: TORCH.lens.y, r: 110, k: 1 });
    holes.push({ x: front.x, y: front.y, r: 130, k: 1 });
  }
  if (b.second > 0) {
    for (let k = 0; k < b.second; k += 0.15)
      holes.push({ x: MIRROR.c.x + (front.x - MIRROR.c.x) * (k / b.second), y: MIRROR.c.y + (front.y - MIRROR.c.y) * (k / b.second), r: 110, k: 1 });
  }
  if (t >= light.tBall) holes.push({ x: DISCO.x, y: DISCO.y + 60, r: 420, k: easeOut(seg(t, light.tBall, light.tBall + 0.6)) });
  if (t >= light.tSpot) {
    const spot = light.spotAt(t);
    holes.push({ x: spot.x, y: spot.y, r: 150, k: 1 - seg(t, light.tJar + 0.6, light.tJar + 1.6) });
  }
  for (let i = 0; i < FIREFLIES; i++) {
    const f = light.fireflyAt(i, t);
    if (f.glow > 0.2) holes.push({ x: f.pt.x, y: f.pt.y, r: 160, k: f.glow });
  }
  BULBS.forEach((x, k) => {
    const on = light.bulbOn(k, t);
    if (on > 0) holes.push({ x, y: wireY(x) + BULB_DROP, r: 150, k: on });
  });
  const lava = light.lavaGlow(t);
  if (lava > 0) holes.push({ x: LAVA.x, y: 470, r: 300 + 260 * lava, k: lava });
  const bird = light.birdFlying(t);
  const globe = light.globeGlow(t);
  if (bird) holes.push({ x: bird.pt.x, y: bird.pt.y, r: 130, k: 0.6 * (1 - globe) });
  if (globe > 0) holes.push({ x: GLOBE.x, y: GLOBE.y, r: 200 + 120 * globe, k: globe });
  const lamp = light.lampGlow(t);
  if (lamp > 0) holes.push({ x: LAMP.x, y: DOME_Y - 40, r: 260 + 400 * easeOut(seg(t, light.tLamp, light.tLamp + 2)), k: lamp });

  const mask = `${ids}-mask`;
  const hole = `${ids}-hole`;
  return (
    <g>
      <defs>
        <radialGradient id={hole}>
          <stop offset="0" stopColor="#000" />
          <stop offset="0.45" stopColor="#000" stopOpacity="0.85" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <mask id={mask} maskUnits="userSpaceOnUse" x="-400" y="-200" width={WORLD_W + 800} height={VIEW_H + 400}>
          <rect x="-400" y="-200" width={WORLD_W + 800} height={VIEW_H + 400} fill="#fff" />
          {holes.map((h, i) => (
            <circle key={i} cx={h.x} cy={h.y} r={h.r} fill={`url(#${hole})`} opacity={h.k} />
          ))}
        </mask>
      </defs>
      <rect x="-400" y="-200" width={WORLD_W + 800} height={VIEW_H + 400} fill={NIGHT} opacity={light.dark(t)} mask={`url(#${mask})`} />
    </g>
  );
}

/** The torch's beam: a widening band of light to the mirror, and from there up to the disco ball. */
function Beam({ light, t }: { light: Light; t: number }) {
  const b = light.beam(t);
  if (b.first <= 0) return null;
  const front = light.beamFront(t);
  const { lens } = TORCH;
  const m = MIRROR.c;
  const toMirror = b.second > 0 ? m : front;
  const w1 = 26 + 14 * b.first;
  const pieces = [`M${lens.x} ${lens.y - 26} L${toMirror.x} ${toMirror.y - w1} L${toMirror.x} ${toMirror.y + w1} L${lens.x} ${lens.y + 26} Z`];
  if (b.second > 0) {
    // Across the way up, the band is as wide as where it left the mirror, then a little wider.
    const dx = front.x - m.x;
    const dy = front.y - m.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w2 = 40 + 14 * b.second;
    pieces.push(
      `M${m.x + nx * 40} ${m.y + ny * 40} L${front.x + nx * w2} ${front.y + ny * w2} L${front.x - nx * w2} ${front.y - ny * w2} L${m.x - nx * 40} ${m.y - ny * 40} Z`,
    );
  }
  return (
    <g>
      {pieces.map((d) => (
        <path key={d.slice(0, 12)} d={d} fill={LIGHT} opacity="0.45" />
      ))}
      <circle cx={front.x} cy={front.y} r="20" fill="#fff" opacity="0.8" />
    </g>
  );
}

/** Little coloured spots of light that circle over the wall around the turning disco ball. */
function DiscoSpots({ light, t }: { light: Light; t: number }) {
  if (t < light.tBall) return null;
  const appear = easeOut(seg(t, light.tBall + 0.1, light.tBall + 0.7));
  const spin = light.spin(t);
  return (
    <g opacity={appear * 0.85}>
      {Array.from({ length: 16 }, (_, j) => {
        const a = (j * 2 * Math.PI) / 16 + spin * 0.5;
        const r = 150 + ((j * 97) % 380);
        const x = DISCO.x + 1.4 * r * Math.cos(a);
        const y = DISCO.y + 120 + 0.8 * r * Math.sin(a);
        if (y > FLOOR + 60) return null;
        return <circle key={j} cx={x} cy={y} r={10 + (j % 3) * 4} fill={j % 2 ? "#fff" : BAR_COLORS[j % BAR_COLORS.length]} />;
      })}
    </g>
  );
}

/** The golden spot that wanders from the disco ball onto the jar, then melts into the fireflies' light. */
function GoldenSpot({ light, t }: { light: Light; t: number }) {
  if (t < light.tSpot) return null;
  const p = light.spotAt(t);
  const fade = 1 - seg(t, light.tJar + 0.4, light.tJar + 1.4);
  if (fade <= 0) return null;
  const grow = easeOut(seg(t, light.tSpot, light.tSpot + 0.4));
  return (
    <g opacity={fade}>
      <circle cx={p.x} cy={p.y} r={46 * grow} fill="#ffd23f" opacity="0.45" />
      <circle cx={p.x} cy={p.y} r={26 * grow} fill={LIGHT} opacity="0.9" />
    </g>
  );
}

/** Each bulb that is on: its colour and a soft glow round it. */
function LitBulbs({ light, t, glow }: { light: Light; t: number; glow: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={glow}>
          <stop offset="0" stopColor={LIGHT} stopOpacity="0.9" />
          <stop offset="1" stopColor={LIGHT} stopOpacity="0" />
        </radialGradient>
      </defs>
      {BULBS.map((x, k) => {
        const on = light.bulbOn(k, t);
        if (on <= 0) return null;
        return (
          <g key={x} opacity={on}>
            <circle cx={x} cy={wireY(x) + BULB_DROP} r="44" fill={`url(#${glow})`} />
            <Bulb x={x} color={BAR_COLORS[k % BAR_COLORS.length]} />
            <ellipse cx={x - 3} cy={wireY(x) + BULB_DROP - 4} rx="3" ry="5" fill="#fff" opacity="0.8" />
          </g>
        );
      })}
    </g>
  );
}

/** The star lamp shining, and the stars it throws over the walls, turning slowly with it. */
function LampLight({ light, t, glow }: { light: Light; t: number; glow: string }) {
  const k = light.lampGlow(t);
  if (k <= 0) return null;
  const turn = light.lampTurn(t);
  const on = seg(t, light.tLamp, light.tLamp + 0.6);
  const c = { x: LAMP.x, y: DOME_Y - 30 };
  return (
    <g>
      <circle cx={c.x} cy={c.y} r={150} fill={`url(#${glow})`} opacity={k} />
      <path
        d={`M${LAMP.x - LAMP.r} ${DOME_Y} A${LAMP.r} ${LAMP.r} 0 0 1 ${LAMP.x + LAMP.r} ${DOME_Y} Z`}
        fill="#fff3b0"
        opacity={k}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <g opacity={k}>
        <DomeStars turn={turn} color="#ffb703" />
      </g>
      {on > 0 &&
        Array.from({ length: 40 }, (_, i) => {
          const r = 180 + ((i * 131) % 640);
          const appear = easeOut(seg(t, light.tLamp + r / 700, light.tLamp + r / 700 + 0.3));
          if (appear <= 0) return null;
          const a = i * 2.39996 + turn;
          const x = c.x + 1.4 * r * Math.cos(a);
          const y = c.y + 0.8 * r * Math.sin(a);
          if (y > FLOOR - 16 || y < -60) return null;
          const twinkle = 0.85 + 0.15 * Math.sin(Math.min(t, light.duration) * 4 + i);
          return (
            <polygon
              key={i}
              points={STAR_POINTS}
              transform={`translate(${x} ${y}) scale(${(1 + (i % 3) * 0.4) * appear * twinkle})`}
              fill={i % 4 ? LIGHT : BAR_COLORS[i % BAR_COLORS.length]}
              opacity="0.9"
            />
          );
        })}
    </g>
  );
}

/** The fireflies: a dark little body with wings, and a tail that glows once they are awake. */
function Fireflies({ light, t, glow }: { light: Light; t: number; glow: string }) {
  return (
    <g>
      {Array.from({ length: FIREFLIES }, (_, i) => {
        const f = light.fireflyAt(i, t);
        const awake = f.glow > 0.2;
        // Wings beat while awake, and stop when the level is over.
        const flap = awake ? 18 * Math.sin(Math.min(t, light.duration) * 38 + i) : 0;
        // Small enough to fit six in the jar, big enough to follow on a phone once the lid is open, and a bit smaller again round the lamp.
        const size = 1.2 + 0.5 * seg(t, light.tLid, light.tLid + 1) - 0.3 * seg(t, light.tLamp - 2, light.tLamp);
        return (
          <g key={i} transform={`translate(${f.pt.x} ${f.pt.y}) scale(${size})`}>
            <circle r="40" fill={`url(#${glow})`} opacity={f.glow} />
            <ellipse cx="-4" cy="-10" rx="11" ry="6" transform={`rotate(${-30 - flap} -4 -4)`} fill="#e8f6ff" opacity="0.85" stroke={INK} strokeWidth="1.5" />
            <ellipse cx="6" cy="-10" rx="11" ry="6" transform={`rotate(${30 + flap} 6 -4)`} fill="#e8f6ff" opacity="0.85" stroke={INK} strokeWidth="1.5" />
            <circle cx="-9" cy="2" r="10" fill={awake ? "#eaff5c" : "#8b9466"} stroke={INK} strokeWidth="2" />
            <ellipse cx="5" cy="0" rx="9" ry="7" fill={INK} />
            <circle cx="14" cy="-2" r="5" fill={INK} />
          </g>
        );
      })}
    </g>
  );
}
