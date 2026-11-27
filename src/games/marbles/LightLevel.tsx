import { memo, useId, useLayoutEffect, useMemo, useRef } from "react";
import { VIEW_H, type LevelProps } from "./level";
import {
  BEAM,
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
  FLOWER,
  GLOBE,
  GLOBE_BUTTON,
  JAR,
  LAMP,
  LANTERN,
  LAVA,
  lavaHalf,
  LIGHTHOUSE,
  type Light,
  MIRROR,
  NAILS,
  NIGHTSTAND,
  OWL,
  PRISM,
  SHADOW,
  SIDE_TABLE,
  STICK,
  STICKERS,
  STOOL,
  SWITCH,
  TORCH,
  WINDOW,
  WORLD_W,
  wireY,
} from "./light";
import { clamp01, deg, easeOut, lerp, seg, hump } from "./machineKit";
import { MachineStage, type Seen } from "./MachineStage";
import { BAR_COLORS, type ScreenAt, Sprite, STAR_POINTS, still } from "./parts";
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
 * The disco ball turns till the level's end, its hundred facets and its spots drawn anew in every frame: while it is
 * off screen it gets a still time (before it starts), so nothing changes there (perf, November 2026).
 */
const disco = (t: number, seen: Seen) => (seen(DISCO.x - 760, DISCO.x + 760) ? t : 0);

/**
 * The lava lamp's time, with its carousel, the warm air and the shadows on the wall: from the moment the camera has left
 * them behind for good on this screen (`lampRest`), they stand still instead of going round to the end. With `seen`'s
 * half a screen to spare they kept going a screen away, and the machine's svg was painted again in every frame while
 * the lighthouse swept the wall (A-36, A-42).
 */
const lamp = (light: Light, t: number, seen: Seen) => Math.min(t, light.lampRest(seen.wide));

/**
 * Level 8: the light chain (R-10). A dark children's room; one tap switches
 * on the torch, its beam bounces off the mirror onto the disco ball, a golden
 * spot from the ball wanders onto the jar of sleeping fireflies, they wake up
 * and fly along the fairy lights (each bulb comes on as they pass) down to the
 * lava lamp, where the first lands on its switch. The lamp's blobs warm up and
 * rise, the warm air turns the paper carousel on its cap, and the rabbit and
 * bird cut-outs throw big shadows that hop and fly over the wall. The paper bird
 * comes loose, flutters onto the globe's button, the globe lights up and turns,
 * and its glow calls the fireflies over it into the toy lighthouse's lantern.
 * The lighthouse turns, its spot sweeps over the wall and wakes the
 * glow-in-the-dark stickers, and rests on the prism in the window; a rainbow
 * falls onto the solar flower, which dances, bows and snaps the glow stick.
 * Its green glow calls the fireflies to the star lamp, which throws stars all
 * over the room. Then the toy owl on the bed wakes up. The camera travels
 * along with the light.
 */
export function LightLevel(props: LevelProps) {
  const light = useMemo(buildLight, []);
  const ids = useId();

  // The backdrop never changes: a layer of its own, painted once.
  const backdrop = useMemo(() => [{ content: <Room paper={`${ids}-paper`} /> }], [ids]);

  return (
    <MachineStage
      back={backdrop}
      machine={light}
      level="light"
      start={{ x: TORCH.x0 + 85, y: TORCH.lens.y, r: 100 }}
      over={(t, at, seen) => (
        <>
          <GlobeTurning light={light} t={t} at={at} />
          <NightVeil light={light} t={t} at={at} />
          <DiscoSpots light={light} t={disco(t, seen)} at={at} />
          <LighthouseBeam light={light} t={t} at={at} />
        </>
      )}
      front={(t) => [
        {
          content: (
            <>
              <Beam light={light} t={t} />
              <GoldenSpot light={light} t={t} />
              <LitBulbs light={light} t={t} glow={`${ids}-glow`} />
              <Halo x={LAVA.x} y={490} r={170} k={0.3 * light.lavaGlow(t)} glow={`${ids}-glow`} />
              <Halo x={GLOBE.x} y={GLOBE.y} r={170} k={0.35 * light.globeGlow(t)} glow={`${ids}-glow`} />
              <StickerGlow light={light} t={t} green={`${ids}-green`} />
              <Rainbow light={light} t={t} />
              <StickLight light={light} t={t} green={`${ids}-green`} />
              <LampLight light={light} t={t} glow={`${ids}-glow`} />
              <PaperBird light={light} t={t} />
              <Sparkles x={LAMP.x} y={DOME_Y - 140} age={t - light.tLamp - 0.6} n={12} spread={300} />
              <Sparkles x={OWL.x} y={OWL.y - 40} age={t - light.tOwl} n={8} spread={140} />
            </>
          ),
        },
      ]}
      top={(t, at) => (
        <>
          <StickersWaking light={light} t={t} at={at} green={`${ids}-green`} />
          <LanternLight light={light} t={t} at={at} glow={`${ids}-glow`} />
          <Fireflies light={light} t={t} at={at} glow={`${ids}-glow`} />
          <Sprite at={at} x={LANTERN.x} y={LANTERN.y} pad={LANTERN.ry + 4}>
            <LanternBars />
          </Sprite>
        </>
      )}
      {...props}
    >
      {(t, seen) => (
        <>
          <WallShadows light={light} t={lamp(light, t, seen)} />
          <Nightstand />
          <Torch on={t >= 0} />
          <Chest />
          <Mirror tilt={light.mirrorTilt} />
          <DiscoBall spin={light.spin(disco(t, seen))} />
          <Stool />
          <Jar light={light} t={t} />
          <FairyLights />
          <SideTable />
          <Carousel light={light} t={lamp(light, t, seen)} side="back" />
          <LavaLamp light={light} t={lamp(light, t, seen)} />
          <Carousel light={light} t={lamp(light, t, seen)} side="front" />
          <WarmAir light={light} t={lamp(light, t, seen)} />
          <Desk />
          <Globe light={light} t={t} />
          <Stickers />
          <Lighthouse />
          <Dresser />
          <Lamp light={light} t={t} />
          <GlowStick light={light} t={t} />
          <Flower light={light} t={t} />
          <Bed />
          <Owl light={light} t={t} />
        </>
      )}
    </MachineStage>
  );
}

/* ---------- The room ---------- */

const Room = still(function Room({ paper }: { paper: string }) {
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
      <StarWindow />
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
});

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

/** The arched window by the star lamp: stars only, and the prism hanging in it on a thread. */
const StarWindow = memo(function StarWindow() {
  const { x0, x1, top, bottom } = WINDOW;
  const r = (x1 - x0) / 2;
  const mid = (x0 + x1) / 2;
  const glass = `M${x0} ${bottom} L${x0} ${top + r} A${r} ${r} 0 0 1 ${x1} ${top + r} L${x1} ${bottom} Z`;
  return (
    <g>
      <path d={glass} fill="#1b2266" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      {[
        [mid - 70, top + 140],
        [mid - 20, top + 60],
        [mid + 66, top + 120],
        [mid + 40, top + 230],
        [mid - 80, top + 250],
      ].map(([sx, sy]) => (
        <polygon key={sx} points={STAR_POINTS} transform={`translate(${sx} ${sy}) scale(0.5)`} fill="#fff3b0" />
      ))}
      <line x1={mid} y1={top} x2={mid} y2={bottom} stroke={INK} strokeWidth="5" />
      <line x1={x0} y1={top + r + 40} x2={x1} y2={top + r + 40} stroke={INK} strokeWidth="5" />
      <rect x={x0 - 18} y={bottom} width={x1 - x0 + 36} height="14" rx="5" fill="#8e7dff" stroke={INK} strokeWidth="3" />
      {/* The prism: a glass drop on its thread from the top of the arch. */}
      <line x1={PRISM.x} y1={top} x2={PRISM.x} y2={PRISM.y - PRISM.r} stroke="#e8f6ff" strokeWidth="2" />
      <PrismShape />
    </g>
  );
});

/** The glass prism: a cut crystal drop with its facets. */
function PrismShape({ fill = "#cfe8ff", opacity = 0.85 }: { fill?: string; opacity?: number }) {
  const { x, y, r } = PRISM;
  return (
    <g opacity={opacity}>
      <path
        d={`M${x} ${y - r} L${x + r * 0.8} ${y + r * 0.2} L${x} ${y + r} L${x - r * 0.8} ${y + r * 0.2} Z`}
        fill={fill}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d={`M${x} ${y - r} L${x} ${y + r} M${x - r * 0.8} ${y + r * 0.2} L${x + r * 0.8} ${y + r * 0.2}`} stroke="#fff" strokeWidth="2" opacity="0.8" />
    </g>
  );
}

/* ---------- Torch, mirror, disco ball ---------- */

const Nightstand = memo(function Nightstand() {
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
});

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

const Chest = memo(function Chest() {
  const { x0, x1, top } = CHEST;
  return (
    <g>
      <rect x={x0} y={top} width={x1 - x0} height={FLOOR - top} rx="10" fill="#3ec300" stroke={INK} strokeWidth="4" />
      <rect x={x0 - 8} y={top} width={x1 - x0 + 16} height="26" rx="8" fill="#2f9a00" stroke={INK} strokeWidth="4" />
      <polygon points={STAR_POINTS} transform={`translate(${(x0 + x1) / 2} ${top + 66}) scale(1.6)`} fill="#ffd23f" stroke={INK} strokeWidth="2" />
    </g>
  );
});

/** The round mirror on its foot, tilted so the torch's light goes up to the disco ball. */
const Mirror = still(function Mirror({ tilt }: { tilt: number }) {
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
});

/** The disco ball: rows of little mirror squares that move round as it turns. */
const DiscoBall = still(function DiscoBall({ spin }: { spin: number }) {
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
});

/* ---------- Fireflies, fairy lights, star lamp, bed ---------- */

const Stool = memo(function Stool() {
  const { x0, x1, top } = STOOL;
  return (
    <g>
      {[x0 + 18, x1 - 32].map((x) => (
        <rect key={x} x={x} y={top + 14} width="14" height={FLOOR - top - 14} fill="#ffb703" stroke={INK} strokeWidth="3" />
      ))}
      <rect x={x0} y={top} width={x1 - x0} height="18" rx="9" fill="#ff8c42" stroke={INK} strokeWidth="4" />
    </g>
  );
});

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
const FairyLights = memo(function FairyLights() {
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
});

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

/**
 * The globe on its foot: dark until the paper bird presses the button, then it shines, wobbles and turns. While it
 * turns (`globeMoving`) its ball is a `Sprite` under the night (`GlobeTurning`), drawn here again once it stands:
 * turning in the machine's svg it had the phone raster the band round it in every frame for eight seconds (A-42).
 */
function Globe({ light, t }: { light: Light; t: number }) {
  return (
    <>
      <GlobeFoot press={light.globeButton(t)} />
      {!light.globeMoving(t) && (
        <g transform={`translate(${GLOBE.x} ${GLOBE.y})`}>
          <GlobeBall glow={light.globeGlow(t)} turn={light.globeTurn(t)} wobble={light.globeWobble(t)} />
        </g>
      )}
    </>
  );
}

/** The globe's ball while it turns, a small layer of its own under the night (`over`, before `NightVeil`). */
function GlobeTurning({ light, t, at }: { light: Light; t: number; at: ScreenAt }) {
  if (!light.globeMoving(t)) return null;
  return (
    <Sprite at={at} x={GLOBE.x} y={GLOBE.y} pad={GLOBE_PAD}>
      <GlobeBall glow={light.globeGlow(t)} turn={light.globeTurn(t)} wobble={light.globeWobble(t)} />
    </Sprite>
  );
}

/** Half the globe sprite's side: the ball, its brass meridian and the meridian's line. */
const GLOBE_PAD = GLOBE.r + 24;

/** The globe's stand, plinth and button, which never turn. */
const GlobeFoot = still(function GlobeFoot({ press }: { press: number }) {
  const { x, y, r } = GLOBE;
  const plinth = DESK.top - 24;
  return (
    <g>
      <rect x={x - 6} y={y + r} width="12" height={plinth - y - r} fill="#ffb703" stroke={INK} strokeWidth="3" />
      <rect x={x - 60} y={plinth} width="120" height="24" rx="8" fill="#8a5a2b" stroke={INK} strokeWidth="4" />
      <ellipse cx={GLOBE_BUTTON.x} cy={GLOBE_BUTTON.y - 2 + 4 * press} rx="10" ry="6" fill="#ff5d73" stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** The globe's ball and meridian round 0, 0: `glow` how far it shines, `turn` in radians, `wobble` in degrees. */
const GlobeBall = still(function GlobeBall({ glow: g, turn, wobble }: { glow: number; turn: number; wobble: number }) {
  const { r } = GLOBE;
  return (
    <g transform={`rotate(${23 + wobble})`}>
      <circle r={r} fill="#34508f" />
      <circle r={r} fill="#7fdcff" opacity={g} />
      {LANDS.map((l, i) => {
        const lon = l.lon + turn;
        const front = Math.cos(lon);
        if (front <= 0.05) return null;
        const ring = r * Math.cos(l.lat);
        return (
          <ellipse
            key={i}
            cx={(ring - l.s * 0.3) * Math.sin(lon)}
            cy={r * 0.85 * Math.sin(l.lat)}
            rx={l.s * front * Math.cos(l.lat)}
            ry={l.s * 0.6}
            fill={g > 0.5 ? "#8ee07a" : "#4f7d55"}
          />
        );
      })}
      <circle cx={-26} cy={-30} r="12" fill="#fff" opacity={0.3 + 0.4 * g} />
      <circle r={r} fill="none" stroke={INK} strokeWidth="4" />
      <path d={`M0 ${r + 12} A${r + 12} ${r + 12} 0 0 0 0 ${-r - 12}`} fill="none" stroke={INK} strokeWidth="9" />
      <path d={`M0 ${r + 12} A${r + 12} ${r + 12} 0 0 0 0 ${-r - 12}`} fill="none" stroke="#ffb703" strokeWidth="5" />
    </g>
  );
});

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

/* ---------- Lighthouse, stickers, prism, flower, glow stick ---------- */

/** Half the lighthouse tower's width at height `y`. */
const towerHalf = (y: number) => LIGHTHOUSE.neck + ((LIGHTHOUSE.foot - LIGHTHOUSE.neck) * (y - LIGHTHOUSE.gallery)) / (FLOOR - LIGHTHOUSE.gallery);

/** The toy lighthouse: a striped tower, a gallery with a railing, the glass lantern with its little hatch open, and a red roof. */
const Lighthouse = memo(function Lighthouse() {
  const { x, gallery } = LIGHTHOUSE;
  const band = (y0: number, y1: number) => `M${x - towerHalf(y0)} ${y0} L${x + towerHalf(y0)} ${y0} L${x + towerHalf(y1)} ${y1} L${x - towerHalf(y1)} ${y1} Z`;
  const { rx, ry, y } = LANTERN;
  return (
    <g>
      <path d={band(gallery, FLOOR)} fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {[
        [450, 520],
        [590, 660],
        [730, FLOOR],
      ].map(([y0, y1]) => (
        <path key={y0} d={band(y0, y1)} fill="#ff5d73" />
      ))}
      <path d={band(gallery, FLOOR)} fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path
        d={`M${x - 20} ${FLOOR} L${x - 20} ${FLOOR - 44} A20 20 0 0 1 ${x + 20} ${FLOOR - 44} L${x + 20} ${FLOOR} Z`}
        fill="#3a86ff"
        stroke={INK}
        strokeWidth="3"
      />
      <circle cx={x} cy="555" r="13" fill="#bfe9ff" stroke={INK} strokeWidth="3" />
      {/* The lantern's glass, its open hatch on the left, the railing in front and the roof. */}
      <rect x={x - rx} y={y - ry} width={rx * 2} height={ry * 2} rx="8" fill="#cfe8ff" opacity="0.7" stroke={INK} strokeWidth="4" />
      <path
        d={`M${x - rx} ${y - 22} L${x - rx - 30} ${y - 28} L${x - rx - 30} ${y + 26} L${x - rx} ${y + 30} Z`}
        fill="#cfe8ff"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x={x - 74} y={gallery - 8} width="148" height="16" rx="5" fill="#ff5d73" stroke={INK} strokeWidth="3" />
      <path
        d={`M${x - 66} ${gallery - 8} L${x - 66} ${gallery - 36} L${x + 66} ${gallery - 36} L${x + 66} ${gallery - 8}`}
        fill="none"
        stroke={INK}
        strokeWidth="3"
      />
      {[-44, -22, 0, 22, 44].map((dx) => (
        <line key={dx} x1={x + dx} y1={gallery - 36} x2={x + dx} y2={gallery - 8} stroke={INK} strokeWidth="2.5" />
      ))}
      <path
        d={`M${x - rx - 12} ${y - ry + 2} L${x} ${y - ry - 52} L${x + rx + 12} ${y - ry + 2} Z`}
        fill="#ff5d73"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx={x} cy={y - ry - 58} r="8" fill="#ffd23f" stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** The thin bars of the lantern's glass, in front of the fireflies flying round inside. */
/** The lantern's bars in front of the fireflies, round the lantern's middle: a small still layer over them (`top`). */
const LanternBars = memo(function LanternBars() {
  const { rx, ry } = LANTERN;
  return (
    <g stroke={INK} strokeWidth="3">
      {[-rx / 2, 0, rx / 2].map((dx) => (
        <line key={dx} x1={dx} y1={-ry} x2={dx} y2={ry} />
      ))}
    </g>
  );
});

/** One sticker's shape round (0, 0), about 70 wide. */
function StickerShape({ kind }: { kind: (typeof STICKERS)[number]["kind"] }) {
  switch (kind) {
    case "moon":
      return <path d="M10 -32 A32 32 0 1 0 10 32 A24 24 0 1 1 10 -32 Z" />;
    case "fish":
      return <path d="M-30 0 Q-8 -22 16 -8 L34 -22 L30 0 L34 22 L16 8 Q-8 22 -30 0 Z" />;
    case "boat":
      return <path d="M-34 8 L34 8 L22 28 L-22 28 Z M-2 4 L-2 -34 L28 2 Z M-8 4 L-8 -24 L-30 2 Z" />;
    case "shell":
      return <path d="M0 26 L-32 -4 Q-22 -32 0 -32 Q22 -32 32 -4 Z M-6 26 L-10 34 L10 34 L6 26 Z" />;
  }
}

/** The glow-in-the-dark stickers, pale and dull while they have drunk no light yet. */
const Stickers = memo(function Stickers() {
  return (
    <g fill="#e3ecd2" stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
      {STICKERS.map((s) => (
        <g key={s.x} transform={`translate(${s.x} ${s.y})`}>
          <StickerShape kind={s.kind} />
        </g>
      ))}
    </g>
  );
});

/** The solar flower in its pot: leaves of little solar panels, a face with sunglasses that smiles in the light. It dances in the rainbow and bows to the glow stick. */
function Flower({ light, t }: { light: Light; t: number }) {
  const { x, rim, stem, head } = FLOWER;
  const lit = light.rainbow(t);
  const lean = deg(light.flowerLean(t));
  const top = rim - stem;
  return (
    <g>
      <path
        d={`M${x - 32} ${rim - 4} L${x + 32} ${rim - 4} L${x + 24} ${DRESSER.top} L${x - 24} ${DRESSER.top} Z`}
        fill="#e07a3f"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect x={x - 36} y={rim - 10} width="72" height="14" rx="5" fill="#f08c4f" stroke={INK} strokeWidth="3" />
      <g transform={`rotate(${lean} ${x} ${rim})`}>
        <path d={`M${x} ${rim} Q${x - 8} ${rim - stem / 2} ${x} ${top}`} fill="none" stroke="#3ec300" strokeWidth="8" strokeLinecap="round" />
        {[-1, 1].map((side) => (
          <g key={side} transform={`translate(${x} ${rim - stem * 0.42 + side * 10}) rotate(${side * -28}) scale(${side * 1.2} 1.2)`}>
            <rect x="4" y="-12" width="40" height="24" rx="3" fill="#1d3fa6" stroke={INK} strokeWidth="3" />
            <path d="M17 -12 V12 M31 -12 V12 M4 0 H44" stroke="#7fdcff" strokeWidth="1.5" />
          </g>
        ))}
        {/* The face, drawn for petals 28 round and scaled to the flower's size. */}
        <g transform={`translate(${x} ${top}) scale(${head / 28})`}>
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i * 360) / 10;
            return <ellipse key={i} cx="19" rx="10" ry="6" transform={`rotate(${a})`} fill={i % 2 ? "#ff8c42" : "#ffb703"} stroke={INK} strokeWidth="2" />;
          })}
          <circle r="19" fill="#ffd23f" stroke={INK} strokeWidth="3" />
          <path d="M-15 -7 h12 v7 a6 6 0 0 1 -12 0 Z M3 -7 h12 v7 a6 6 0 0 1 -12 0 Z M-3 -5 h6" fill={INK} stroke={INK} strokeWidth="2" />
          <path d={`M-8 8 Q0 ${9 + 6 * lit} 8 8`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

/** The points of the glow stick: from the pot's rim over to the lamp's base, snapped into a little V where the flower pressed it. */
function stickPoints(bent: number) {
  const { a, b } = STICK;
  const mid = { x: lerp(a.x, b.x, 0.55), y: lerp(a.y, b.y, 0.55) + 6 * bent };
  return `${a.x},${a.y} ${mid.x},${mid.y} ${b.x},${b.y}`;
}

/** The glow stick, dull and grey until it is snapped. */
function GlowStick({ light, t }: { light: Light; t: number }) {
  const points = stickPoints(light.stickBent(t));
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={points} stroke={INK} strokeWidth={STICK.r * 2 + 4} />
      <polyline points={points} stroke="#a9b8ae" strokeWidth={STICK.r * 2 - 2} />
    </g>
  );
}

const Dresser = memo(function Dresser() {
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
});

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

const Bed = memo(function Bed() {
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
});

/** The toy owl on the pillow: asleep with closed eyes, until the stars wake it and it hops. */
function Owl({ light, t }: { light: Light; t: number }) {
  const awake = easeOut(seg(t, light.tOwl, light.tOwl + 0.2));
  const hop = 18 * hump(seg(t, light.tOwl, light.tOwl + 0.5));
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

/** Where something shines through the dark at `t`: the holes `NightVeil` cuts. */
function nightHoles(light: Light, t: number): Hole[] {
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
  // Starlight at the arched window, so the prism in it can be found in the dark.
  holes.push({ x: PRISM.x, y: WINDOW.top + 140, r: 200, k: 0.45 });
  const lantern = light.lanternGlow(t);
  if (lantern > 0) holes.push({ x: LANTERN.x, y: LANTERN.y, r: 160 + 200 * lantern, k: lantern });
  const spot = light.beamSpot(t);
  if (spot.show > 0) {
    holes.push({ x: spot.x, y: spot.y, r: 190, k: spot.show });
    for (const k of [0.3, 0.55, 0.8]) holes.push({ x: lerp(LANTERN.x, spot.x, k), y: spot.y, r: 90, k: 0.7 * spot.show });
  }
  STICKERS.forEach((s, k) => {
    const g = light.stickerGlow(k, t);
    if (g > 0) holes.push({ x: s.x, y: s.y, r: 90, k: 0.8 * g });
  });
  const rainbow = light.rainbow(t);
  if (rainbow > 0) {
    const reach = light.rainbowReach(t);
    for (const k of [0.2, 0.5, 0.8, 1])
      holes.push({ x: lerp(PRISM.x, FLOWER.x, k * reach), y: lerp(PRISM.y, FLOWER.rim - FLOWER.stem, k * reach), r: 110, k: rainbow });
  }
  const stick = light.stickGlow(t);
  if (stick > 0) holes.push({ x: (STICK.a.x + STICK.b.x) / 2, y: STICK.a.y + 10, r: 130 + 90 * stick, k: stick });
  const lamp = light.lampGlow(t);
  if (lamp > 0) holes.push({ x: LAMP.x, y: DOME_Y - 40, r: 260 + 400 * easeOut(seg(t, light.tLamp, light.tLamp + 2)), k: lamp });
  return holes;
}

/** How many CSS pixels one pixel of the dark's canvas covers: the holes are soft, so a coarse canvas looks the same. */
const VEIL_PX = 4;

/**
 * The dark over the whole room, with soft holes wherever something shines: a small canvas laid over the machine, which
 * the compositor stretches over the screen. As a mask over the room's svg it had the phone raster the whole screen two
 * or three times in every frame a light moved (158 screens a second, perf November 2026); the canvas has a few thousand
 * pixels to fill.
 */
function NightVeil({ light, t, at }: { light: Light; t: number; at: (x: number, y: number) => { x: number; y: number; k: number } }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  /** What the veil was last drawn from: drawn again only when that changes, so the dark doesn't change while all is still. */
  const drawn = useRef("");
  useLayoutEffect(() => {
    const c = canvas.current;
    const box = c?.parentElement;
    const ctx = c?.getContext("2d");
    if (!c || !box || !ctx) return;
    const w = Math.ceil(box.clientWidth / VEIL_PX);
    const h = Math.ceil(box.clientHeight / VEIL_PX);
    // What is drawn, in the canvas's own pixels, rounded to a quarter of one (a screen pixel) and the dark to 1/256: the
    // canvas is drawn again only when that changes, never for a hole that moved by a fraction no one sees (A-42: drawing
    // it in every frame was the level's biggest piece of script on the old phone).
    const px = (v: number) => Math.round((4 * v) / VEIL_PX) / 4;
    const a = at(-400, -200);
    const b = at(WORLD_W + 400, VIEW_H + 200);
    const dark = Math.round(256 * light.dark(t)) / 256;
    const room = [px(a.x), px(a.y), px(b.x - a.x), px(b.y - a.y)];
    const fills: [number, number, number, number][] = [];
    for (const hole of nightHoles(light, t)) {
      const p = at(hole.x, hole.y);
      const [x, y, r, k] = [px(p.x), px(p.y), px(hole.r * p.k), Math.round(256 * hole.k) / 256];
      if (r > 0 && k > 0 && x + r >= 0 && y + r >= 0 && x - r <= w && y - r <= h) fills.push([x, y, r, k]);
    }
    const key = JSON.stringify([w, h, room, dark, fills]);
    if (key === drawn.current) return;
    drawn.current = key;
    if (c.width !== w) c.width = w;
    if (c.height !== h) c.height = h;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, w, h);
    ctx.globalAlpha = dark;
    ctx.fillStyle = NIGHT;
    ctx.fillRect(room[0], room[1], room[2], room[3]);
    // Each hole takes away from the dark as the svg mask's black circles did: 1 in the middle, 0.85 at 45 %, 0 at the rim.
    ctx.globalCompositeOperation = "destination-out";
    ctx.globalAlpha = 1;
    for (const [x, y, r, k] of fills) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(0,0,0,${k})`);
      g.addColorStop(0.45, `rgba(0,0,0,${0.85 * k})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
  });
  return <canvas ref={canvas} className="marble-veil" aria-hidden />;
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

/** How far the disco spots reach from their middle, in world units: the furthest ring and a dot. */
const DISCO_PAD = 550;
/** The spots' ellipse: wider than high, as the wall is seen from the side. Their dots are made a little smaller for it. */
const DISCO_SX = 1.4;
const DISCO_SY = 0.8;

/**
 * Little coloured spots of light that circle over the wall around the turning disco ball: one ring of dots drawn once in
 * a layer of its own, turned and stretched into its ellipse by a CSS transform. Moved one by one inside the svg over the
 * room, they changed most of the wall in every frame and the phone rastered 64 screens a second (perf, A-36).
 */
function DiscoSpots({ light, t, at }: { light: Light; t: number; at: ScreenAt }) {
  if (t < light.tBall) return null;
  const appear = easeOut(seg(t, light.tBall + 0.1, light.tBall + 0.7));
  const turn = light.spin(t) * 0.5;
  const p = at(DISCO.x, DISCO.y + 120);
  const half = DISCO_PAD * p.k;
  return (
    <svg
      className="marble-sprite"
      viewBox={`${-DISCO_PAD} ${-DISCO_PAD} ${2 * DISCO_PAD} ${2 * DISCO_PAD}`}
      style={{
        width: 2 * half,
        height: 2 * half,
        opacity: appear * 0.85,
        transform: `translate3d(${p.x - half}px, ${p.y - half}px, 0) scale(${DISCO_SX}, ${DISCO_SY}) rotate(${turn}rad)`,
      }}
      aria-hidden
    >
      <DiscoDots />
    </svg>
  );
}

/** The ring of dots round 0, 0, before it is turned and stretched: drawn once. */
const DiscoDots = memo(function DiscoDots() {
  const shrink = 1 / Math.sqrt(DISCO_SX * DISCO_SY);
  return (
    <g>
      {Array.from({ length: 16 }, (_, j) => {
        const a = (j * 2 * Math.PI) / 16;
        const r = 150 + ((j * 97) % 380);
        return (
          <circle key={j} cx={r * Math.cos(a)} cy={r * Math.sin(a)} r={(10 + (j % 3) * 4) * shrink} fill={j % 2 ? "#fff" : BAR_COLORS[j % BAR_COLORS.length]} />
        );
      })}
    </g>
  );
});

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
function Fireflies({ light, t, at, glow }: { light: Light; t: number; at: ScreenAt; glow: string }) {
  return (
    <>
      {Array.from({ length: FIREFLIES }, (_, i) => {
        const f = light.fireflyAt(i, t);
        const awake = f.glow > 0.2;
        // Wings beat while it flies, and rest while it sits (on the table, on the lamp) and while it goes round in the
        // lantern, small behind its bars: beating on, they had an old phone paint their band of the screen in every frame
        // long after their flight (perf, A-36), and the six layers in every frame of the lighthouse's sweep (A-42).
        const before = light.fireflyAt(i, t - 1 / 30).pt;
        const flying = clamp01(Math.hypot(f.pt.x - before.x, f.pt.y - before.y) / 2) * (1 - f.inside);
        const flap = awake ? 18 * flying * Math.sin(Math.min(t, light.duration) * 38 + i) : 0;
        // Small enough to fit six in the jar, big enough to follow on a phone once the lid is open, small again in the
        // lighthouse's lantern, and a bit smaller round the lamp.
        const size = 1.2 + 0.5 * seg(t, light.tLid, light.tLid + 1) - 0.75 * f.inside - 0.3 * seg(t, light.tLamp - 2, light.tLamp);
        return (
          <Sprite key={i} at={at} x={f.pt.x} y={f.pt.y} pad={FIREFLY_PAD}>
            <Firefly size={size} flap={flap} glow={f.glow} awake={awake} gradient={glow} />
          </Sprite>
        );
      })}
    </>
  );
}

/** Half the side of a firefly's own layer, in world units: its glow (40) at its biggest (1.7 times). */
const FIREFLY_PAD = 70;

/**
 * One firefly round its own 0, 0, in a small layer of its own (`Sprite`): drawn in the front svg, six fireflies flying
 * or going round in the lantern had the phone paint that world-sized svg again in every frame (A-42). `gradient` is the
 * glow's id, defined with the fairy lights in the front svg of the same page.
 */
const Firefly = still(function Firefly({ size, flap, glow, awake, gradient }: { size: number; flap: number; glow: number; awake: boolean; gradient: string }) {
  return (
    <g transform={`scale(${size})`}>
      <circle r="40" fill={`url(#${gradient})`} opacity={glow} />
      <ellipse cx="-4" cy="-10" rx="11" ry="6" transform={`rotate(${-30 - flap} -4 -4)`} fill="#e8f6ff" opacity="0.85" stroke={INK} strokeWidth="1.5" />
      <ellipse cx="6" cy="-10" rx="11" ry="6" transform={`rotate(${30 + flap} 6 -4)`} fill="#e8f6ff" opacity="0.85" stroke={INK} strokeWidth="1.5" />
      <circle cx="-9" cy="2" r="10" fill={awake ? "#eaff5c" : "#8b9466"} stroke={INK} strokeWidth="2" />
      <ellipse cx="5" cy="0" rx="9" ry="7" fill={INK} />
      <circle cx="14" cy="-2" r="5" fill={INK} />
    </g>
  );
});

/** How long the lighthouse's band of light is drawn before CSS stretches it to its spot. */
const BAND_LEN = 1000;
/** The biggest the glare round the lantern gets, in world units. */
const GLARE_R = 110;

/**
 * The lighthouse's beam: a band of light from the lantern to its spot on the wall, and a soft glare while it shines at
 * the child. Three small HTML layers over the dark, each drawn once and only moved, stretched and faded by CSS: drawn in
 * the front svg, the band sweeping over the wall had an old phone raster 60 screens a second (perf, A-36).
 */
function LighthouseBeam({ light, t, at }: { light: Light; t: number; at: ScreenAt }) {
  const s = light.beamSpot(t);
  if (s.show <= 0 && s.facing <= 0) return null;
  const o = at(LANTERN.x, LANTERN.y);
  const p = at(s.x, s.y);
  const { rx, ry } = BEAM;
  return (
    <>
      {s.show > 0 && (
        <>
          <svg
            className="marble-sprite"
            viewBox={`0 ${-ry} ${BAND_LEN} ${2 * ry}`}
            style={{
              width: BAND_LEN * o.k,
              height: 2 * ry * o.k,
              opacity: s.show,
              transformOrigin: "0 50%",
              transform: `translate3d(${o.x}px, ${o.y - ry * o.k}px, 0) scaleX(${(s.x - LANTERN.x) / BAND_LEN})`,
            }}
            aria-hidden
          >
            <BeamBand />
          </svg>
          <svg
            className="marble-sprite"
            viewBox={`${-rx} ${-ry} ${2 * rx} ${2 * ry}`}
            style={{ width: 2 * rx * p.k, height: 2 * ry * p.k, opacity: s.show, transform: `translate3d(${p.x - rx * p.k}px, ${p.y - ry * p.k}px, 0)` }}
            aria-hidden
          >
            <BeamSpot />
          </svg>
        </>
      )}
      {s.facing > 0 && (
        <svg
          className="marble-sprite"
          viewBox={`${-GLARE_R} ${-GLARE_R} ${2 * GLARE_R} ${2 * GLARE_R}`}
          style={{
            width: 2 * GLARE_R * o.k,
            height: 2 * GLARE_R * o.k,
            opacity: 0.45 * s.facing ** 3,
            transform: `translate3d(${o.x - GLARE_R * o.k}px, ${o.y - GLARE_R * o.k}px, 0) scale(${(50 + 60 * s.facing) / GLARE_R})`,
          }}
          aria-hidden
        >
          <circle r={GLARE_R} fill="#fff" />
        </svg>
      )}
    </>
  );
}

/** The band from the lantern (at 0, 0) to the right, `BAND_LEN` long: drawn once, stretched by CSS. */
const BeamBand = memo(function BeamBand() {
  return <path d={`M0 -16 L${BAND_LEN} ${-BEAM.ry * 0.8} L${BAND_LEN} ${BEAM.ry * 0.8} L0 16 Z`} fill={LIGHT} opacity="0.22" />;
});

/** The spot on the wall round 0, 0: drawn once, moved by CSS. */
const BeamSpot = memo(function BeamSpot() {
  return (
    <>
      <ellipse rx={BEAM.rx} ry={BEAM.ry} fill={LIGHT} opacity="0.35" />
      <ellipse rx={BEAM.rx * 0.6} ry={BEAM.ry * 0.6} fill={LIGHT} opacity="0.45" />
    </>
  );
});

/** Half the side of the lantern's light's own layer, in world units: its glow. */
const LANTERN_GLOW_R = 170;

/**
 * The lantern shining with the fireflies' light, and the lens inside turning with the lighthouse: a small layer of its
 * own under the fireflies (`top`), since the lens turning in the front svg had it painted again in every frame (A-42).
 */
function LanternLight({ light, t, at, glow }: { light: Light; t: number; at: ScreenAt; glow: string }) {
  const k = light.lanternGlow(t);
  if (k <= 0) return null;
  const a = light.lighthouseAngle(t);
  return (
    <Sprite at={at} x={LANTERN.x} y={LANTERN.y} pad={LANTERN_GLOW_R}>
      <LanternShine k={k} lens={30 * Math.sin(a)} width={4 + 12 * Math.abs(Math.cos(a))} gradient={glow} />
    </Sprite>
  );
}

/** `LanternLight`'s drawing round the lantern's middle: how bright (`k`), and where the lens is and how wide it looks. */
const LanternShine = still(function LanternShine({ k, lens, width, gradient }: { k: number; lens: number; width: number; gradient: string }) {
  const { rx, ry } = LANTERN;
  return (
    <g>
      <circle r={LANTERN_GLOW_R} fill={`url(#${gradient})`} opacity={k} />
      <rect x={-rx} y={-ry} width={rx * 2} height={ry * 2} rx="8" fill={LIGHT} opacity={0.55 * k} />
      <ellipse cx={lens} rx={width} ry={ry - 10} fill="#fff" opacity={0.7 * k} />
    </g>
  );
});

/**
 * The stickers glowing green once the beam has passed over them, and on in the dark. While one wakes (`stickerWaking`)
 * it is a `Sprite` over everything whose opacity the compositor fades (`StickersWaking`), and drawn here once it shines
 * steadily: fading in the front layer, the five had the phone raster the band round them in every frame of the sweep (A-42).
 */
function StickerGlow({ light, t, green }: { light: Light; t: number; green: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={green}>
          <stop offset="0" stopColor="#b8ff9a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#b8ff9a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {STICKERS.map((s, k) => {
        const g = light.stickerGlow(k, t);
        if (g <= 0 || light.stickerWaking(k, t)) return null;
        return (
          <g key={s.x} transform={`translate(${s.x} ${s.y})`} opacity={g}>
            <LitSticker kind={s.kind} green={green} />
          </g>
        );
      })}
    </g>
  );
}

/** The stickers waking as the beam passes, each a small layer faded by its `opacity` (`top`, A-42). */
function StickersWaking({ light, t, at, green }: { light: Light; t: number; at: ScreenAt; green: string }) {
  return STICKERS.map((s, k) =>
    light.stickerWaking(k, t) ? (
      <Sprite key={s.x} at={at} x={s.x} y={s.y} pad={STICKER_GLOW_R} opacity={light.stickerGlow(k, t)}>
        <LitSticker kind={s.kind} green={green} />
      </Sprite>
    ) : null,
  );
}

/** How far a sticker's glow reaches round it. */
const STICKER_GLOW_R = 64;

/** A sticker shining, round 0, 0, with its glow (the gradient `green`, defined by `StickerGlow`). */
const LitSticker = still(function LitSticker({ kind, green }: { kind: (typeof STICKERS)[number]["kind"]; green: string }) {
  return (
    <>
      <circle r={STICKER_GLOW_R} fill={`url(#${green})`} opacity="0.6" />
      <g fill="#c9ffb0" stroke="#5fd35a" strokeWidth="2.5" strokeLinejoin="round">
        <StickerShape kind={kind} />
      </g>
    </>
  );
});

/** The colours of the rainbow, from its top to its bottom. */
const RAINBOW = ["#ff5d73", "#ff8c42", "#ffd23f", "#3ec300", "#3a86ff", "#8e7dff"];

/** The rainbow fanning out from the prism down onto the flower, and the prism shining while the beam rests on it. */
function Rainbow({ light, t }: { light: Light; t: number }) {
  const k = light.rainbow(t);
  const lit = t >= light.tPrism ? light.beamSpot(t).show : 0;
  if (lit <= 0 && k <= 0) return null;
  const reach = light.rainbowReach(t);
  // From the prism towards the flower's face, as far as it has grown, fanning out across that way.
  const from = { x: PRISM.x + 8, y: PRISM.y + 8 };
  const to = { x: lerp(from.x, FLOWER.x + 30, reach), y: lerp(from.y, FLOWER.rim - FLOWER.stem + 30, reach) };
  const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  const n = { x: -(to.y - from.y) / len, y: (to.x - from.x) / len };
  const w = 16 * reach;
  return (
    <g>
      {k > 0 &&
        RAINBOW.map((color, i) => {
          const a = (i - 3) * 3 * reach;
          const b = (i - 2) * 3 * reach;
          const c = (i - 3) * w;
          const d = (i - 2) * w;
          return (
            <path
              key={color}
              d={`M${from.x + n.x * a} ${from.y + n.y * a} L${to.x + n.x * c} ${to.y + n.y * c} L${to.x + n.x * d} ${to.y + n.y * d} L${from.x + n.x * b} ${from.y + n.y * b} Z`}
              fill={color}
              opacity={0.6 * k}
            />
          );
        })}
      {lit > 0 && <PrismShape fill="#fff" opacity={0.8 * lit} />}
    </g>
  );
}

/** The snapped glow stick shining green. */
function StickLight({ light, t, green }: { light: Light; t: number; green: string }) {
  const g = light.stickGlow(t);
  if (g <= 0) return null;
  const points = stickPoints(light.stickBent(t));
  return (
    <g opacity={g}>
      <ellipse cx={(STICK.a.x + STICK.b.x) / 2} cy={STICK.a.y + 8} rx="130" ry="70" fill={`url(#${green})`} />
      <polyline points={points} fill="none" stroke="#7dff6a" strokeWidth={STICK.r * 2 - 2} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={points} fill="none" stroke="#eaffd9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}
