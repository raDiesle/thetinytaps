import { memo, useId, useMemo, type ReactNode } from "react";
import { MASCOT_COLORS, MascotHead } from "@/components/Mascot";
import { useT } from "@/lib/language";
import { VIEW_H, wobble, type LevelProps, decay, SETTLE_S } from "./level";
import { beside, deg, hop, lerp, seg, svgLine } from "./machineKit";
import { MachineStage, type WorldLayer } from "./MachineStage";
import { INK, MARBLE_COLOR, Sparkles } from "./scenery";
import {
  ARM,
  BOARD,
  buildSpace,
  BUGGY,
  CAPSULE,
  HUT,
  INTERCOM,
  KANGAROO_SPOTS,
  TRUSS,
  DECK,
  DISH,
  DOWN,
  FLOOR,
  groundY,
  HILLS,
  HOSE,
  IRON,
  PANEL,
  LEVER,
  MAGNET,
  MOBILE,
  MOON,
  PAD,
  type Planet,
  planetSpot,
  PLANETS,
  RADIO,
  RADIO_LAMPS,
  RAMP,
  RINGS,
  rampY,
  ROBOT,
  ROCK,
  ROCKET,
  ROCKET_RISE,
  SAT,
  SCOPE,
  scopeTip,
  SLOT,
  TANK,
  TOWER,
  TOWER_ARM,
  UFO_BELOW,
  WINDOW_UP,
  WORLD_W,
  type Space,
} from "./space";
import { BALL_R, type Pt } from "./path";
import { BAR_COLORS, Ball, FlowingDashes, type ScreenAt, Sprite, still } from "./parts";

const SKY_TOP = "#0d1446";
const SKY_LOW = "#2b3a88";
const STEEL = "#c9d1e8";
const DARK_STEEL = "#7d86ad";
const GROUND = "#a9afcf";
const CRATER = "#8f96bb";
const GLOW = "#7dffb2";

/**
 * A Rube Goldberg machine on a toy launch site at night. One tap lets the
 * marble out of the satellite dish, through the glowing rings and down the
 * zigzag pipe into a sleepy robot, which pushes the moon buggy over the hills
 * against the intercom of a glass dome. The space kangaroo dozing inside wakes,
 * comes out through the tunnel and hops onto the pedal of the radio mast, whose
 * waves wake a satellite; it drops a capsule on a parachute, and the capsule's
 * puff of air sets the planet mobile turning. The earth bonks the telescope,
 * which swings round and points at the sky, where a UFO with a little alien
 * sees it and comes floating in. It beams up a moon rock, carries it over and drops it onto the switch,
 * waves and zooms off; the magnet lets go of its iron ball, the ball drops into
 * the countdown board's slot, and after „3, 2, 1“ the rocket lifts off and,
 * small far away, lands on the moon. The camera travels along with whatever
 * moves.
 */
export function SpaceLevel(props: LevelProps) {
  const space = useMemo(buildSpace, []);
  const ids = useId();
  const sky = useMemo(() => skyLayers(`${ids}-sky`), [ids]);

  return (
    <MachineStage
      machine={space}
      level="space"
      start={{ x: DISH.x, y: DISH.y - 6, r: 96 }}
      back={(t) => sky.map((l, i) => (i === 0 || t < 0 ? l : { ...l, className: `${l.className} ${t >= space.tLift ? "party" : "on"}` }))}
      over={(t, at) => (
        <>
          <BuggyDriving space={space} t={t} at={at} />
          <Current space={space} t={t} at={at} />
          <RadioWaves space={space} t={t} at={at} />
          <SkyFall space={space} t={t} at={at} />
          <MobileTurning space={space} t={t} at={at} />
          <UfoSky space={space} t={t} at={at} />
        </>
      )}
      {...props}
    >
      {(t, seen) => {
        // Every part below is `still` and gets only the numbers it draws, worked out here from the clock: React then
        // skips every part whose numbers stay the same in a frame. Drawn with the clock itself, the whole machine went
        // through React in every frame, 72–81 % busy on an old phone while only a few attributes changed (A-38).
        const roo = space.kangarooAt(t);
        const glows = RINGS.map((_, i) => ringGlow(t - space.ringTimes[i]));
        const blinking = (x0: number, x1: number, phase: number) => t >= 0 && seen(x0, x1) && Math.sin(t * 5 + phase) > 0;
        const mini = space.miniRocketAt(t);
        return (
          <>
            <RingedPlanet x={2350} y={170} />
            <Moon awake={t >= space.tMoonLand} />
            {mini && <MoonLanding x={mini.pt.x} y={mini.pt.y} flame={mini.flame} flag={space.flagAt(t)} />}
            <Ground />
            <DishMast />
            <RingRail glows={glows} />
            <Deck />
            <DownRamp space={space} />
            <Intercom pressed={t >= space.tBump && t < space.tBump + 0.35} lit={t >= space.tBump && t < space.tExit} />
            <DomeBack />
            {roo.pt.x < KANGAROO_SPOTS[1].x && <Kangaroo {...roo} />}
            <DomeFront open={space.hatchAt(t)} />
            {roo.pt.x >= KANGAROO_SPOTS[1].x && <Kangaroo {...roo} />}
            <RadioMast />
            <RadioMoving down={RADIO.press * space.pedalAt(t)} sending={t >= space.tPedal} lit={space.lampTimes.map((l) => t >= l)} />
            <PipeBack space={space} green={blinking(PANEL.x0, PANEL.x1, 0)} yellow={blinking(PANEL.x0, PANEL.x1, 2)} />
            <RobotNow space={space} t={seen(ROBOT.cx - 300, ROBOT.cx + 300) ? t : Math.min(t, space.tRobot + SETTLE_S)} />
            <StationTruss
              on={t < space.tOff}
              moduleLamp={blinking(TRUSS.x - 100, TRUSS.x + 100, 0)}
              jibLamp={blinking(TRUSS.jib1 - 100, TRUSS.jib1 + 100, 2)}
            />
            <MagnetWaves pulse={t >= space.tOff ? -1 : t >= 0 && seen(MAGNET.x - 100, MAGNET.x + 100) ? magnetPulse(t) : 0.5} />
            <MobileCord />
            <ScopeTripod />
            <Telescope angle={space.scopeAngle(t)} glint={glintAge(t - space.tGlint)} />
            <LeverBox on={t < space.tLever} tilt={space.leverTilt(t)} />
            <SlotHole />
            <IronBall at={space.ironAt(t)} />
            <CountdownNow space={space} t={t} />
            <LaunchTower angle={space.armAngle(t)} lamp={blinking(TOWER.x - 100, TOWER.x + 100, 1)} />
            <Pad />
            <Tank />
            <Hose drop={space.hoseDrop(t)} />

            <MovingThings space={space} t={t} />

            <DishFront />
            <RingFronts glows={glows} />
            <PipeFront space={space} />
            <Smoke space={space} t={Math.min(Math.max(t, space.tIgnite - 1), space.tLift + SMOKE.until + SMOKE.life + 0.1)} />
            <StillSparkles x={ROCKET.x} y={330} age={sparkleAge(t - space.tLift - 0.9)} n={12} spread={320} />
          </>
        );
      }}
    </MachineStage>
  );
}

/** The marble, drawn again only when it moves. */
const StillBall = still(Ball);

/** The marble and the rocket, each drawn again only in the frames where it moves. */
function MovingThings({ space, t }: { space: Space; t: number }) {
  const marble = space.marbleAt(t);
  return (
    <g>
      <StillBall color={MARBLE_COLOR} x={marble.pt.x} y={marble.pt.y} spin={marble.spin} />
      <RocketNow space={space} t={t} />
    </g>
  );
}

/** A metal beam along `pts`: an ink outline around a steel middle. */
function Beam({ pts, w = 8, color = STEEL }: { pts: Pt[]; w?: number; color?: string }) {
  const d = svgLine(pts);
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + 6} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** A lattice mast from `top` down to the ground, `w` wide, its middle at `x`. */
function Lattice({ x, w, top, bottom = FLOOR }: { x: number; w: number; top: number; bottom?: number }) {
  const l = x - w / 2 + 6;
  const r = x + w / 2 - 6;
  const n = Math.max(1, Math.round((bottom - top) / 64));
  const zig = Array.from({ length: n + 1 }, (_, i) => ({ x: i % 2 ? r : l, y: top + ((bottom - top) * i) / n }));
  return (
    <g>
      <Beam pts={zig} w={5} />
      <Beam
        pts={[
          { x: l, y: top },
          { x: l, y: bottom },
        ]}
      />
      <Beam
        pts={[
          { x: r, y: top },
          { x: r, y: bottom },
        ]}
      />
    </g>
  );
}

/** A little lamp, lit or not (`blinking` in `SpaceLevel` says which while the machine runs). */
function Blinker({ x, y, on, color = "#ff5d73" }: { x: number; y: number; on: boolean; color?: string }) {
  return (
    <g>
      {on && <circle cx={x} cy={y} r="16" fill={color} opacity="0.35" />}
      <circle cx={x} cy={y} r="7" fill={on ? color : "#5a4a7a"} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/* ---------- Night sky and moon ground ---------- */

const rand = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const STARS = Array.from({ length: 170 }, (_, i) => ({
  x: -300 + rand(i) * (WORLD_W + 600),
  y: 14 + rand(i + 500) * 620,
  size: 2 + rand(i + 900) * 5,
}));

/** How many groups the stars twinkle in, each a layer of its own a little out of step with the others. */
const STAR_GROUPS = 3;

/**
 * The night sky under everything: its colour, then the stars in `STAR_GROUPS` layers. Once the machine runs each layer
 * twinkles by its opacity (`marble-stars` in marbles.css, faster from the lift-off on), which the phone's compositor
 * does without painting: every star drawn again in every frame with its own twinkle kept an old phone's main thread
 * busy and had it raster the whole sky 100 times a second (perf, November 2026).
 */
function skyLayers(sky: string): WorldLayer[] {
  const star = (s: (typeof STARS)[number], i: number) =>
    s.size < 4.6 ? (
      <circle key={i} cx={s.x} cy={s.y} r={s.size / 2} fill="#fff7d6" />
    ) : (
      <path key={i} transform={`translate(${s.x} ${s.y}) scale(${s.size / 12})`} d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" fill="#ffe680" />
    );
  return [
    {
      content: (
        <>
          <defs>
            <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={SKY_TOP} />
              <stop offset="1" stopColor={SKY_LOW} />
            </linearGradient>
          </defs>
          <rect x="-400" y="-200" width={WORLD_W + 800} height={FLOOR + 200} fill={`url(#${sky})`} />
        </>
      ),
    },
    ...Array.from({ length: STAR_GROUPS }, (_, g) => ({
      content: <>{STARS.map((s, i) => (i % STAR_GROUPS === g ? star(s, i) : null))}</>,
      className: `marble-stars marble-stars-${g}`,
    })),
  ];
}

const RingedPlanet = still(function RingedPlanet({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-14)`}>
      <path d="M-74 0 A74 18 0 0 1 74 0" fill="none" stroke={INK} strokeWidth="11" />
      <path d="M-74 0 A74 18 0 0 1 74 0" fill="none" stroke="#ffd9a0" strokeWidth="6" />
      <circle r="44" fill="#ff9bb5" stroke={INK} strokeWidth="3.5" />
      <path d="M-40 -14 Q0 -4 40 -14 M-42 10 Q0 20 42 10" fill="none" stroke="#ff7bd0" strokeWidth="6" />
      <path d="M-74 0 A74 18 0 0 0 74 0" fill="none" stroke={INK} strokeWidth="11" />
      <path d="M-74 0 A74 18 0 0 0 74 0" fill="none" stroke="#ffd9a0" strokeWidth="6" />
      <circle cx="-16" cy="-22" r="7" fill="#fff" opacity="0.6" />
    </g>
  );
});

/** The moon sleeps until the rocket lands on it, then opens its eyes and smiles. */
const Moon = still(function Moon({ awake }: { awake: boolean }) {
  const { x, y, r } = MOON;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 26} fill="#fff3c4" opacity="0.12" />
      <circle r={r} fill="#fff3c4" stroke={INK} strokeWidth="4" />
      <circle cx="-30" cy="-30" r="12" fill="#f2df9b" />
      <circle cx="34" cy="-18" r="8" fill="#f2df9b" />
      <circle cx="22" cy="36" r="10" fill="#f2df9b" />
      {awake ? (
        <>
          <circle cx="-20" cy="-4" r="7" fill={INK} />
          <circle cx="16" cy="-4" r="7" fill={INK} />
          <circle cx="-18" cy="-6" r="2.5" fill="#fff" />
          <circle cx="18" cy="-6" r="2.5" fill="#fff" />
        </>
      ) : (
        <path d="M-28 -4 Q-20 4 -12 -4 M8 -4 Q16 4 24 -4" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      )}
      <circle cx="-32" cy="14" r="8" fill="#ffb3c1" />
      <circle cx="28" cy="14" r="8" fill="#ffb3c1" />
      <path d={awake ? "M-14 16 Q-2 34 10 16" : "M-10 20 Q-2 26 6 20"} fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
});

const CRATERS = [180, 640, 1150, 1700, 2300, 2650, 3420, 4000, 4460, 5000, 5360, 6000, 6400, 7000, 7450, 7900, 8300];

const Ground = memo(function Ground() {
  const x0 = HILLS[0].x - HILLS[0].w / 2;
  const x1 = HILLS[HILLS.length - 1].x + HILLS[HILLS.length - 1].w / 2;
  const top = Array.from({ length: Math.ceil((x1 - x0) / 8) + 1 }, (_, i) => {
    const x = Math.min(x1, x0 + i * 8);
    return { x, y: groundY(x) };
  });
  return (
    <g>
      <rect x="-400" y={FLOOR} width={WORLD_W + 800} height={VIEW_H - FLOOR + 200} fill={GROUND} />
      {CRATERS.map((x, i) => (
        <ellipse key={x} cx={x} cy={FLOOR + 34 + (i % 3) * 22} rx={40 + (i % 2) * 22} ry={10 + (i % 2) * 4} fill={CRATER} stroke={INK} strokeWidth="2.5" />
      ))}
      <line x1="-400" y1={FLOOR} x2={WORLD_W + 400} y2={FLOOR} stroke={INK} strokeWidth="4" />
      <path d={`${svgLine(top)} L${x1} ${FLOOR + 3} L${x0} ${FLOOR + 3} Z`} fill={GROUND} />
      <path d={svgLine(top)} fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {HILLS.map((h) => (
        <ellipse key={h.x} cx={h.x + h.w * 0.12} cy={FLOOR - h.h * 0.35} rx={h.w * 0.1} ry="5" fill={CRATER} />
      ))}
    </g>
  );
});

/* ---------- Dish, glowing buttons and glass tube ---------- */

/** The mast holding the dish, and the inside of the dish behind the marble. */
const DishMast = memo(function DishMast() {
  const { x, y, rx } = DISH;
  return (
    <g>
      <rect x="52" y={y + 4} width="20" height={FLOOR - y - 4} rx="4" fill={STEEL} stroke={INK} strokeWidth="3" />
      <Beam
        pts={[
          { x: 62, y: y + 20 },
          { x: x - 52, y: y + 18 },
        ]}
        w={6}
      />
      <ellipse cx={x} cy={y - 8} rx={rx} ry="18" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** The front of the dish bowl, and the feed sticking up over it with a light on top. */
const DishFront = memo(function DishFront() {
  const { x, y, rx } = DISH;
  return (
    <g>
      <path
        d={`M${x - rx} ${y - 8} Q${x} ${y + 60} ${x + rx} ${y - 8} A${rx} 18 0 0 1 ${x - rx} ${y - 8} Z`}
        fill={STEEL}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d={`M${x - rx + 26} ${y + 8} Q${x - 30} ${y + 26} ${x - 6} ${y + 26}`}
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <Beam
        pts={[
          { x: x + rx - 10, y: y - 10 },
          { x: x + 14, y: y - 84 },
        ]}
        w={4}
      />
      <circle cx={x + 14} cy={y - 88} r="10" fill="#ff5d73" stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** A steel rail just under the marble's path from `a` to `b`. */
function MetalRail({ a, b }: { a: Pt; b: Pt }) {
  const off = BALL_R + 7;
  return (
    <g>
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke={STEEL} strokeWidth="12" strokeLinecap="round" />
      <line x1={a.x + 10} y1={a.y + off - 3} x2={b.x - 10} y2={b.y + off - 3} stroke="#fff" strokeWidth="2.5" opacity="0.7" />
    </g>
  );
}

/** How bright a ring glows `age` seconds after the marble passed it, from 1 down to exactly 0; -1 before it is lit. */
const ringGlow = (age: number) => (age >= 0 ? decay(age * 3) : -1);

/** A ring around the rail at `x`, tilted with it; `half` is the half behind the marble or the one in front of it. `glow` from `ringGlow`. */
function Ring({ x, color, glow, half }: { x: number; color: string; glow: number; half: "back" | "front" }) {
  const slope = deg(Math.atan2(RAMP.to.y - RAMP.from.y, RAMP.to.x - RAMP.from.x));
  const lit = glow >= 0;
  const d = half === "back" ? "M0 -40 A14 40 0 0 0 0 40" : "M0 -40 A14 40 0 0 1 0 40";
  return (
    <g transform={`translate(${x} ${rampY(x)}) rotate(${slope})`}>
      {half === "back" && lit && <ellipse rx="34" ry="56" fill={color} opacity={0.2 + 0.4 * glow} />}
      <path d={d} fill="none" stroke={INK} strokeWidth="11" strokeLinecap="round" />
      <path d={d} fill="none" stroke={lit ? color : "#4a4f7d"} strokeWidth="6" strokeLinecap="round" />
      {half === "front" && lit && (
        <path d="M3 -30 A10 30 0 0 1 9 -6" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity={0.5 + 0.5 * glow} />
      )}
    </g>
  );
}

/** The rail on its two legs, and the back halves of the glowing rings. */
const RingRail = still(function RingRail({ glows }: { glows: number[] }) {
  const legY = (x: number) => rampY(x) + BALL_R + 14;
  return (
    <g>
      {[330, 780].map((x) => (
        <rect key={x} x={x - 8} y={legY(x)} width="16" height={FLOOR - legY(x)} rx="4" fill={STEEL} stroke={INK} strokeWidth="3" />
      ))}
      {RINGS.map((ring, i) => (
        <Ring key={i} x={ring.x} color={BAR_COLORS[i]} glow={glows[i]} half="back" />
      ))}
      <MetalRail a={{ x: RAMP.from.x - 24, y: rampY(RAMP.from.x - 24) }} b={RAMP.to} />
    </g>
  );
});

/** The front halves of the rings the marble rolls through; each one lights up as it passes. */
const RingFronts = still(function RingFronts({ glows }: { glows: number[] }) {
  return (
    <g>
      {RINGS.map((ring, i) => (
        <Ring key={i} x={ring.x} color={BAR_COLORS[i]} glow={glows[i]} half="front" />
      ))}
    </g>
  );
});

/** The panel the pipe is clamped to, with its two blinking lights, and the inside of the pipe behind the marble. */
const PipeBack = still(function PipeBack({ space, green, yellow }: { space: Space; green: boolean; yellow: boolean }) {
  const { x0, x1, top } = PANEL;
  const inside = space.pipe.filter((p) => p.x <= x1);
  return (
    <g>
      <rect x={x0} y={top} width={x1 - x0} height={DECK.y - top} rx="14" fill="#3d4a7a" stroke={INK} strokeWidth="4" />
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} cx={x0 + 16} cy={top + 30 + i * 60} r="4" fill={DARK_STEEL} />
      ))}
      <Blinker x={x1 - 26} y={top + 26} on={green} color={GLOW} />
      <Blinker x={x1 - 56} y={top + 26} on={yellow} color="#ffd23f" />
      <path d={svgLine(inside)} fill="none" stroke="#bde9ff" strokeWidth={2 * BALL_R + 12} strokeLinecap="round" strokeLinejoin="round" opacity="0.18" />
    </g>
  );
});

/** The front of the see-through pipe: its two edges, a shine and the clamps that hold it to the panel. */
const PipeFront = still(function PipeFront({ space }: { space: Space }) {
  const inside = space.pipe.filter((p) => p.x <= PANEL.x1);
  const clamps = [0.12, 0.3, 0.55, 0.8].map((k) => inside[Math.round(k * (inside.length - 1))]);
  return (
    <g>
      <path d={svgLine(inside)} fill="none" stroke="#bde9ff" strokeWidth={2 * BALL_R + 12} strokeLinecap="round" strokeLinejoin="round" opacity="0.14" />
      {[-1, 1].map((side) => (
        <path
          key={side}
          d={svgLine(beside(inside, side * (BALL_R + 6)))}
          fill="none"
          stroke="#e8f8ff"
          strokeWidth="3.5"
          strokeLinejoin="round"
          opacity="0.85"
        />
      ))}
      <path d={svgLine(beside(inside, -BALL_R + 2))} fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" opacity="0.4" />
      {clamps.map((p, i) => (
        <rect key={i} x={p.x - 6} y={p.y - BALL_R - 10} width="12" height={2 * BALL_R + 20} rx="4" fill={STEEL} stroke={INK} strokeWidth="2.5" />
      ))}
    </g>
  );
});

/* ---------- Deck, robot and moon buggy ---------- */

const Deck = memo(function Deck() {
  const { x0, x1, y } = DECK;
  const legs = [x0 + 20, (x0 + x1) / 2 - 40, x1 - 40];
  return (
    <g>
      {legs.slice(1).map((x, i) => (
        <Beam
          key={x}
          pts={[
            { x: legs[i] + 9, y: y + 18 },
            { x: x + 9, y: FLOOR },
          ]}
          w={4}
        />
      ))}
      {legs.map((x) => (
        <rect key={x} x={x} y={y + 10} width="18" height={FLOOR - y - 10} rx="3" fill={STEEL} stroke={INK} strokeWidth="3" />
      ))}
      <rect x={x0} y={y} width={x1 - x0} height="20" rx="5" fill={STEEL} stroke={INK} strokeWidth="4" />
      <rect x={x0 + 6} y={y + 4} width={x1 - x0 - 12} height="4" rx="2" fill="#fff" opacity="0.6" />
      {Array.from({ length: Math.floor((x1 - x0) / 60) }, (_, i) => (
        <circle key={i} cx={x0 + 30 + i * 60} cy={y + 13} r="3" fill={DARK_STEEL} />
      ))}
    </g>
  );
});

/** The steel track from the deck down onto the moon, on two legs. */
const DownRamp = still(function DownRamp({ space }: { space: Space }) {
  const { pts } = space.buggyPath;
  const down = pts.filter((p) => p.x >= DECK.x1 - 6 && p.x <= DOWN.x1 + 60);
  const track = beside(down, 8);
  const at = (x: number) => track.reduce((best, p) => (Math.abs(p.x - x) < Math.abs(best.x - x) ? p : best));
  return (
    <g>
      {[1830, 1970].map((x) => {
        const p = at(x);
        return <rect key={x} x={x - 7} y={p.y} width="14" height={FLOOR - p.y} fill={STEEL} stroke={INK} strokeWidth="3" />;
      })}
      <path d={svgLine(track)} fill="none" stroke={INK} strokeWidth="20" strokeLinejoin="round" strokeLinecap="round" />
      <path d={svgLine(track)} fill="none" stroke="#ffb703" strokeWidth="13" strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
});

/** The robot at the machine's `t` seconds: works out what it shows and draws it only when that changes. */
function RobotNow({ space, t }: { space: Space; t: number }) {
  const awake = t >= space.tRobot;
  return (
    <Robot
      awake={awake}
      blink={awake && Math.floor(t * 4) % 2 === 0}
      lights={awake ? Math.floor(t * 6) % 3 : -1}
      nod={wobble(t - space.tRobot, 8, 12, 2.5)}
      back={space.backArm(t)}
      front={space.frontArm(t)}
    />
  );
}

/**
 * The robot sleeps until the marble presses its button; then it wakes, pushes the buggy and waves. `lights` is which of
 * its three chest lights is on (-1 none), `back` and `front` its arms' angles.
 */
const Robot = still(function Robot({
  awake,
  blink,
  lights,
  nod,
  back,
  front,
}: {
  awake: boolean;
  blink: boolean;
  lights: number;
  nod: number;
  back: number;
  front: number;
}) {
  const arm = (angle: number, x: number) => (
    <g transform={`translate(${x} -100) rotate(${angle})`}>
      <rect x="-8" y="0" width="16" height={ARM.len} rx="8" fill="#ff8c42" stroke={INK} strokeWidth="3" />
      <circle cy={ARM.len} r={ARM.hand} fill="#ffb703" stroke={INK} strokeWidth="3" />
    </g>
  );
  return (
    <g transform={`translate(${ROBOT.cx} ${DECK.y})`}>
      <rect x={-ROBOT.half - ROBOT.button + (awake ? 6 : 0)} y="-30" width={ROBOT.button + 10} height="16" rx="6" fill="#ff3b3b" stroke={INK} strokeWidth="3" />
      {arm(back, -40)}
      <rect x={-ROBOT.half} y="-34" width={ROBOT.half * 2} height="34" rx="17" fill="#5b6489" stroke={INK} strokeWidth="3.5" />
      {[-32, 0, 32].map((x) => (
        <circle key={x} cx={x} cy="-17" r="10" fill={STEEL} stroke={INK} strokeWidth="2.5" />
      ))}
      <rect x="-44" y="-112" width="88" height="80" rx="14" fill="#8fd3ff" stroke={INK} strokeWidth="4" />
      <rect x="-28" y="-98" width="56" height="34" rx="7" fill="#3d4a7a" stroke={INK} strokeWidth="2.5" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={-16 + i * 16} cy="-81" r="5" fill={(lights + i) % 3 === 0 && lights >= 0 ? BAR_COLORS[i * 2] : "#5a4a7a"} />
      ))}
      <rect x="-10" y="-124" width="20" height="14" fill={DARK_STEEL} stroke={INK} strokeWidth="2.5" />
      <g transform={`rotate(${nod} 0 -124)`}>
        <line x1="0" y1="-182" x2="0" y2="-204" stroke={INK} strokeWidth="4" />
        {blink && <circle cy="-208" r="14" fill="#ff5d73" opacity="0.4" />}
        <circle cy="-208" r="8" fill={blink ? "#ff5d73" : "#7a2a3a"} stroke={INK} strokeWidth="2.5" />
        <rect x="-38" y="-182" width="76" height="60" rx="16" fill={STEEL} stroke={INK} strokeWidth="4" />
        {awake ? (
          [-15, 15].map((x) => (
            <g key={x}>
              <circle cx={x} cy="-156" r="13" fill={GLOW} opacity="0.35" />
              <circle cx={x} cy="-156" r="8" fill={GLOW} stroke={INK} strokeWidth="2.5" />
              <circle cx={x - 2} cy="-158" r="2.5" fill="#fff" />
            </g>
          ))
        ) : (
          <path d="M-22 -156 L-8 -156 M8 -156 L22 -156" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        )}
        <path d={awake ? "M-14 -138 Q0 -128 14 -138" : "M-10 -136 L10 -136"} fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      </g>
      {arm(-front, ARM.x - ROBOT.cx)}
    </g>
  );
});

/**
 * The moon buggy as a small layer of its own over the machine (`Sprite`), placed and tipped by its sprite: driving over
 * the hills in the machine's svg for seven seconds, it had the phone paint the whole machine again in every frame
 * (perf, A-49).
 */
function BuggyDriving({ space, t, at }: { space: Space; t: number; at: ScreenAt }) {
  const { pt, angle, turned, bob } = space.buggyAt(t);
  return (
    <Sprite at={at} x={pt.x} y={pt.y} pad={140} angle={angle}>
      <Buggy turned={turned} bob={bob} />
    </Sprite>
  );
}

/** The moon buggy with its alien, round the middle between its wheels on the ground; its wheels turned `turned` along the way, its body bobbing up by `bob`. */
const Buggy = still(function Buggy({ turned, bob }: { turned: number; bob: number }) {
  const r = BUGGY.wheelR;
  const wheel = (x: number) => (
    <g transform={`translate(${x} ${-r}) rotate(${deg(turned / r)})`}>
      <circle r={r} fill="#5b6489" stroke={INK} strokeWidth="3" />
      {[0, 60, 120].map((a) => (
        <line key={a} x1={-r + 4} y1="0" x2={r - 4} y2="0" transform={`rotate(${a})`} stroke={STEEL} strokeWidth="2.5" />
      ))}
      <circle r="5" fill={STEEL} stroke={INK} strokeWidth="1.5" />
    </g>
  );
  return (
    <g>
      <g transform={`translate(0 ${-Math.abs(bob)})`}>
        <line x1="-62" y1="-64" x2="-72" y2="-128" stroke={INK} strokeWidth="3.5" />
        <path d="M-72 -128 L-44 -120 L-70 -110 Z" fill="#ffd23f" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        {/* The alien */}
        <line x1="6" y1="-92" x2="-2" y2="-108" stroke={INK} strokeWidth="2.5" />
        <line x1="18" y1="-92" x2="26" y2="-108" stroke={INK} strokeWidth="2.5" />
        <circle cx="-2" cy="-109" r="4" fill="#ff7bd0" stroke={INK} strokeWidth="1.5" />
        <circle cx="26" cy="-109" r="4" fill="#ff7bd0" stroke={INK} strokeWidth="1.5" />
        <circle cx="12" cy="-80" r="15" fill="#7ee081" stroke={INK} strokeWidth="2.5" />
        <circle cx="7" cy="-83" r="3" fill={INK} />
        <circle cx="18" cy="-83" r="3" fill={INK} />
        <path d="M5 -74 Q12 -68 19 -74" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="-80" r="27" fill="#bde9ff" opacity="0.3" stroke={INK} strokeWidth="3" />
        <path d="M-6 -94 Q0 -101 8 -103" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        <path d="M-80 -30 L-80 -58 Q-80 -64 -74 -64 L66 -64 Q80 -64 80 -52 L80 -30 Z" fill="#ffd23f" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <rect x="-70" y="-58" width="34" height="5" rx="2.5" fill="#fff" opacity="0.7" />
        <rect x={BUGGY.nose - 12} y="-62" width="12" height="18" rx="5" fill="#ff5d73" stroke={INK} strokeWidth="2.5" />
        <circle cx="-40" cy="-44" r="6" fill="#ff8c42" stroke={INK} strokeWidth="2" />
      </g>
      {wheel(-BUGGY.wheelX)}
      {wheel(BUGGY.wheelX)}
    </g>
  );
});

/* ---------- Station truss, mobile, switch and magnet ---------- */

const jibLow = TRUSS.jibY + TRUSS.jibH;

/** The power cable from the switch up the mast and along under the beam to the magnet's clamp. */
const CABLE: Pt[] = [
  { x: LEVER.x + 34, y: FLOOR - 14 },
  { x: LEVER.x + 60, y: FLOOR - 4 },
  { x: TRUSS.x - TRUSS.w / 2 - 8, y: FLOOR - 4 },
  { x: TRUSS.x - TRUSS.w / 2 - 8, y: jibLow + 8 },
  { x: MAGNET.x - 26, y: jibLow + 8 },
  { x: MAGNET.x - 8, y: jibLow + 22 },
];
/** Where the magnet's own cable ends, above the magnet. */
const MAGNET_DROP = MAGNET.y - 56;

/**
 * The current flowing in both cables while the magnet is on, after the tap: white dashes sliding towards the magnet, as
 * HTML layers over the machine (`FlowingDashes`), since drawn in the machine's svg they rastered most of the picture's
 * height in every frame.
 */
function Current({ space, t, at }: { space: Space; t: number; at: ScreenAt }) {
  if (t < 0 || t >= space.tOff) return null;
  const flow = { at, dash: 4, gap: 26, speed: 90, width: 3, color: "#fff" };
  return (
    <>
      <FlowingDashes {...flow} pts={CABLE} />
      <FlowingDashes
        {...flow}
        pts={[
          { x: MAGNET.x, y: jibLow + 16 },
          { x: MAGNET.x, y: MAGNET_DROP },
        ]}
      />
    </>
  );
}

/**
 * The space-station truss: a mast with a round module on top, a long beam with solar wings, the power cable and the
 * magnet, `on` until the switch is thrown; `moduleLamp` and `jibLamp` are its two blinking lamps.
 */
const StationTruss = still(function StationTruss({ on, moduleLamp, jibLamp }: { on: boolean; moduleLamp: boolean; jibLamp: boolean }) {
  const { x, w, jibY, jib0, jib1 } = TRUSS;
  const n = Math.round((jib1 - jib0) / 44);
  const zig = Array.from({ length: n + 1 }, (_, i) => ({ x: jib0 + ((jib1 - jib0) * i) / n, y: i % 2 ? jibLow : jibY }));
  const cable = CABLE;
  const drop = MAGNET_DROP;
  const module = { x0: x - 80, x1: x + 80, top: jibY - 74 };
  const panels = [
    { x0: jib0 + 30, x1: x - 110 },
    { x0: x + 110, x1: jib1 - 30 },
  ];
  return (
    <g>
      <Lattice x={x} w={w} top={jibY} />
      <rect x={x - w / 2 - 22} y={FLOOR - 22} width={w + 44} height="22" rx="5" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
      {/* Solar wings standing on the truss */}
      {panels.map(({ x0, x1 }, i) => {
        const cells = Math.round((x1 - x0) / 46);
        return (
          <g key={i}>
            <rect x={x0} y={jibY - 54} width={x1 - x0} height="46" rx="4" fill="#2f6fd6" stroke={INK} strokeWidth="3" />
            {Array.from({ length: cells - 1 }, (_, k) => {
              const cx = x0 + ((x1 - x0) * (k + 1)) / cells;
              return <line key={k} x1={cx} y1={jibY - 54} x2={cx} y2={jibY - 8} stroke="#8fc3ff" strokeWidth="2" />;
            })}
            <line x1={x0} y1={jibY - 31} x2={x1} y2={jibY - 31} stroke="#8fc3ff" strokeWidth="2" />
            <line x1={x0 + 10} y1={jibY - 46} x2={x0 + 40} y2={jibY - 46} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          </g>
        );
      })}
      <Beam pts={zig} w={5} />
      <Beam
        pts={[
          { x: jib0, y: jibY },
          { x: jib1, y: jibY },
        ]}
      />
      <Beam
        pts={[
          { x: jib0, y: jibLow },
          { x: jib1, y: jibLow },
        ]}
      />
      {/* The round station module on top of the mast, with portholes and an antenna */}
      <line x1={x + 40} y1={module.top} x2={x + 56} y2={module.top - 40} stroke={STEEL} strokeWidth="4" strokeLinecap="round" />
      <circle cx={x + 56} cy={module.top - 40} r="6" fill="#ffd23f" stroke={INK} strokeWidth="2.5" />
      <rect x={module.x0} y={module.top} width={module.x1 - module.x0} height={jibY - module.top + 4} rx="34" fill="#f3f5ff" stroke={INK} strokeWidth="4" />
      <rect x={module.x0 + 4} y={module.top + 40} width={module.x1 - module.x0 - 8} height="10" fill="#ff5d73" />
      {[-44, 0, 44].map((dx) => (
        <circle key={dx} cx={x + dx} cy={module.top + 22} r="10" fill="#bde9ff" stroke={INK} strokeWidth="3" />
      ))}
      <Blinker x={module.x0 + 8} y={module.top + 4} on={moduleLamp} />
      <Blinker x={jib1} y={jibY - 12} on={jibLamp} />
      {/* The power cable from the switch to the magnet */}
      <path d={svgLine(cable)} fill="none" stroke={INK} strokeWidth="8" strokeLinejoin="round" />
      <path d={svgLine(cable)} fill="none" stroke={on ? "#ffd23f" : "#9a8a50"} strokeWidth="4" strokeLinejoin="round" />
      {/* The clamp and the magnet's cable */}
      <path
        d={`M${MAGNET.x - 20} ${jibLow - 2} L${MAGNET.x + 20} ${jibLow - 2} L${MAGNET.x + 10} ${jibLow + 18} L${MAGNET.x - 10} ${jibLow + 18} Z`}
        fill={DARK_STEEL}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <line x1={MAGNET.x} y1={jibLow + 16} x2={MAGNET.x} y2={drop} stroke={INK} strokeWidth="8" />
      <line x1={MAGNET.x} y1={jibLow + 16} x2={MAGNET.x} y2={drop} stroke={on ? "#ffd23f" : "#9a8a50"} strokeWidth="4" />
      <Magnet />
    </g>
  );
});

/**
 * How strongly the magnet's waves show `t` seconds into the machine. A decoration, so it pulses in steps, ten a second,
 * rather than in every frame (like the Zirkus hoop's flames).
 */
const magnetPulse = (t: number) => 0.5 + 0.3 * Math.sin((Math.floor(t * 10) / 10) * 8);

/** The little waves coming off the magnet's ends while it is on, at `pulse` opacity (-1: none). */
const MagnetWaves = still(function MagnetWaves({ pulse }: { pulse: number }) {
  if (pulse < 0) return null;
  const { x, y } = MAGNET;
  return (
    <g fill="none" stroke="#fff3a0" strokeWidth="3.5" strokeLinecap="round" opacity={pulse}>
      <path d={`M${x - 52} ${y + 6} Q${x - 70} ${y + 36} ${x - 44} ${y + 62}`} />
      <path d={`M${x + 52} ${y + 6} Q${x + 70} ${y + 36} ${x + 44} ${y + 62}`} />
      <path d={`M${x - 64} ${y - 2} Q${x - 90} ${y + 36} ${x - 58} ${y + 76}`} />
      <path d={`M${x + 64} ${y - 2} Q${x + 90} ${y + 36} ${x + 58} ${y + 76}`} />
    </g>
  );
});

/** A red horseshoe magnet, upside down. */
function Magnet() {
  const { x, y } = MAGNET;
  return (
    <g>
      <path
        d={`M${x - 48} ${y} L${x - 48} ${y - 28} A48 28 0 0 1 ${x + 48} ${y - 28} L${x + 48} ${y} L${x + 20} ${y} L${x + 20} ${y - 28} A20 10 0 0 0 ${x - 20} ${y - 28} L${x - 20} ${y} Z`}
        fill="#ff3b3b"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect x={x - 48} y={y - 14} width="28" height="14" fill={STEEL} stroke={INK} strokeWidth="3" />
      <rect x={x + 20} y={y - 14} width="28" height="14" fill={STEEL} stroke={INK} strokeWidth="3" />
      <path d={`M${x - 38} ${y - 30} Q${x - 30} ${y - 46} ${x - 12} ${y - 50}`} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

const IronBall = still(function IronBall({ at }: { at: Pt }) {
  const r = IRON.r;
  return (
    <g transform={`translate(${at.x} ${at.y})`}>
      <circle r={r} fill={DARK_STEEL} stroke={INK} strokeWidth="3.5" />
      <path d={`M${-r + 6} 0 A${r - 6} ${r - 6} 0 0 0 ${r - 6} 0`} fill="none" stroke="#5b6489" strokeWidth="5" />
      <circle cx="-11" cy="-12" r="8" fill="#fff" opacity="0.65" />
    </g>
  );
});

function PlanetBody({ p, scale }: { p: Planet; scale: number }) {
  const r = p.r;
  let body: ReactNode;
  if (p.kind === "earth")
    body = (
      <>
        <circle r={r} fill="#3a86ff" stroke={INK} strokeWidth="3" />
        <path d="M-22 -14 Q-10 -26 2 -18 Q8 -6 -4 0 Q-16 4 -22 -14 Z M6 10 Q18 4 24 12 Q20 26 8 24 Z" fill="#3ec300" stroke={INK} strokeWidth="2" />
      </>
    );
  else if (p.kind === "saturn")
    body = (
      <>
        <path d={`M${-r * 1.9} 0 A${r * 1.9} ${r * 0.5} 0 0 1 ${r * 1.9} 0`} fill="none" stroke={INK} strokeWidth="9" />
        <path d={`M${-r * 1.9} 0 A${r * 1.9} ${r * 0.5} 0 0 1 ${r * 1.9} 0`} fill="none" stroke="#ffd9a0" strokeWidth="5" />
        <circle r={r} fill="#ffb703" stroke={INK} strokeWidth="3" />
        <path d={`M${-r * 1.9} 0 A${r * 1.9} ${r * 0.5} 0 0 0 ${r * 1.9} 0`} fill="none" stroke={INK} strokeWidth="9" />
        <path d={`M${-r * 1.9} 0 A${r * 1.9} ${r * 0.5} 0 0 0 ${r * 1.9} 0`} fill="none" stroke="#ffd9a0" strokeWidth="5" />
      </>
    );
  else if (p.kind === "mars")
    body = (
      <>
        <circle r={r} fill="#ff7a45" stroke={INK} strokeWidth="3" />
        <circle cx="5" cy="4" r="4" fill="#d9542a" />
      </>
    );
  else
    body = (
      <>
        <circle r={r} fill="#e8e8f0" stroke={INK} strokeWidth="3" />
        <circle cx="4" cy="3" r="3" fill="#b9bdd6" />
      </>
    );
  return (
    <g transform={`scale(${scale})`}>
      {body}
      <circle cx={-r * 0.35} cy={-r * 0.4} r={r * 0.2} fill="#fff" opacity="0.7" />
    </g>
  );
}

/** The middle of the mobile's sprite: half way between its bars and the lowest planet's foot. */
const MOBILE_MID = 622;
/** How far the mobile's sprite reaches round its middle: Saturn's ring on the outer bar as it swings nearest to us. */
const MOBILE_PAD = 225;

/** The mobile's cord from the truss down to its sun. It never moves, so it stays in the machine, drawn once. */
const MobileCord = memo(function MobileCord() {
  return <line x1={MOBILE.cx} y1={jibLow} x2={MOBILE.cx} y2={MOBILE.sun.y - MOBILE.sun.r} stroke={STEEL} strokeWidth="3" />;
});

/**
 * The planet mobile and the puff of air that sets it turning, as small layers of their own over the machine (`Sprite`):
 * turning in the machine's svg it had the phone paint the whole machine again in every frame for ten seconds (perf,
 * A-49). Over the machine, its earth lies in front of the telescope's lens as it bonks it.
 */
function MobileTurning({ space, t, at }: { space: Space; t: number; at: ScreenAt }) {
  const puff = space.puffAt(t);
  return (
    <>
      <Sprite at={at} x={MOBILE.cx} y={MOBILE_MID} pad={MOBILE_PAD}>
        <g transform={`translate(${-MOBILE.cx} ${-MOBILE_MID})`}>
          <Mobile spin={space.spinAt(t)} />
        </g>
      </Sprite>
      {puff && (
        <Sprite at={at} x={puff.pt.x} y={puff.pt.y} pad={40}>
          <AirPuff size={puff.size} fade={puff.fade} />
        </Sprite>
      )}
    </>
  );
}

/** The mobile, hanging from its cord: a sun, two crossed bars and four planets on strings, turning by `spin` radians. */
const Mobile = still(function Mobile({ spin }: { spin: number }) {
  const { cx, barY, sun } = MOBILE;
  const spots = PLANETS.map((p) => ({ p, ...planetSpot(p, spin) }));
  const end = (s: (typeof spots)[number]) => ({ x: s.x, y: barY + 8 * s.z });
  const planet = (s: (typeof spots)[number]) => (
    <g key={s.p.kind}>
      <line x1={s.x} y1={end(s).y} x2={s.x} y2={s.y - s.p.r * s.scale} stroke={STEEL} strokeWidth="2.5" />
      <g transform={`translate(${s.x} ${s.y})`}>
        <PlanetBody p={s.p} scale={s.scale} />
      </g>
    </g>
  );
  const bar = (a: (typeof spots)[number], b: (typeof spots)[number]) => (
    <g>
      <line x1={end(a).x} y1={end(a).y} x2={end(b).x} y2={end(b).y} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1={end(a).x} y1={end(a).y} x2={end(b).x} y2={end(b).y} stroke="#ffd23f" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
  const sorted = [...spots].sort((a, b) => a.z - b.z);
  return (
    <g>
      {sorted.filter((s) => s.z < 0).map(planet)}
      {bar(spots[0], spots[2])}
      {bar(spots[1], spots[3])}
      <g transform={`translate(${cx} ${sun.y}) rotate(${deg(spin) / 4})`}>
        {Array.from({ length: 10 }, (_, i) => (
          <path
            key={i}
            transform={`rotate(${i * 36})`}
            d={`M-8 ${-sun.r + 2} L0 ${-sun.r - 14} L8 ${-sun.r + 2} Z`}
            fill="#ff8c42"
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ))}
      </g>
      <circle cx={cx} cy={sun.y} r={sun.r} fill="#ffd23f" stroke={INK} strokeWidth="3.5" />
      <circle cx={cx - 11} cy={sun.y - 5} r="3.5" fill={INK} />
      <circle cx={cx + 11} cy={sun.y - 5} r="3.5" fill={INK} />
      <path d={`M${cx - 12} ${sun.y + 8} Q${cx} ${sun.y + 20} ${cx + 12} ${sun.y + 8}`} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {sorted.filter((s) => s.z >= 0).map(planet)}
    </g>
  );
});

/** The switch box: its handle tips over by `tilt` when the earth knocks it, and the light turns from green to red. */
const LeverBox = still(function LeverBox({ on, tilt }: { on: boolean; tilt: number }) {
  return (
    <g>
      <g transform={`translate(${LEVER.x} ${LEVER.y}) rotate(${tilt})`}>
        <rect x="-5" y={-LEVER.len} width="10" height={LEVER.len} rx="4" fill={STEEL} stroke={INK} strokeWidth="2.5" />
        <circle cy={-LEVER.len} r={LEVER.knob} fill="#ff3b3b" stroke={INK} strokeWidth="3" />
        <circle cx="-4" cy={-LEVER.len - 4} r="3.5" fill="#fff" opacity="0.8" />
      </g>
      <rect x={LEVER.x - 34} y={FLOOR - 36} width="68" height="36" rx="8" fill="#8e7dff" stroke={INK} strokeWidth="3.5" />
      <circle cx={LEVER.x} cy={LEVER.y} r="5" fill={INK} />
      <circle cx={LEVER.x + 21} cy={FLOOR - 16} r="6" fill={on ? GLOW : "#ff5d73"} stroke={INK} strokeWidth="2" />
      <circle cx={LEVER.x - 21} cy={FLOOR - 16} r="6" fill="#5a4a7a" stroke={INK} strokeWidth="2" />
    </g>
  );
});

/* ---------- Telescope, UFO and moon rock ---------- */

/** The telescope's tripod: three legs from the mount down to the ground. It never moves, so it is drawn once. */
const ScopeTripod = memo(function ScopeTripod() {
  const { x, y } = SCOPE.pivot;
  return (
    <g>
      <Beam
        pts={[
          { x: x + 4, y },
          { x: x + 14, y: FLOOR - 4 },
        ]}
        w={5}
        color={DARK_STEEL}
      />
      {[-1, 1].map((side) => (
        <Beam
          key={side}
          pts={[
            { x, y },
            { x: x + side * 58, y: FLOOR - 4 },
          ]}
          w={6}
          color="#ffb703"
        />
      ))}
      {[-1, 1].map((side) => (
        <rect key={side} x={x + side * 58 - 9} y={FLOOR - 8} width="18" height="8" rx="3" fill={DARK_STEEL} stroke={INK} strokeWidth="2.5" />
      ))}
      <rect x={x - 12} y={y} width="24" height="22" rx="5" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** How long the telescope's lens has glinted, `age` seconds after its glint began; -1 before and after it. */
const glintAge = (age: number) => (age >= 0 && age < 1.2 ? age : -1);

/**
 * The telescope's tube on its mount, turned to `angle`: it looks down at the mobile until the earth bonks it, then
 * swings round to the sky, and its lens glints (`glint` from `glintAge`).
 */
const Telescope = still(function Telescope({ angle, glint }: { angle: number; glint: number }) {
  const { pivot, front, back, lens } = SCOPE;
  const tip = scopeTip(angle);
  return (
    <g>
      <g transform={`translate(${pivot.x} ${pivot.y}) rotate(${angle})`}>
        {/* Eyepiece behind, the tube widening to the front, gold rings, and a little finder on top */}
        <rect x={-back - 4} y="-7" width="22" height="14" rx="3" fill={DARK_STEEL} stroke={INK} strokeWidth="2.5" />
        <path
          d={`M${-back + 14} -10 L${front - 14} -15 L${front - 14} 15 L${-back + 14} 10 Z`}
          fill="#f4f5fb"
          stroke={INK}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <rect x="18" y="-14" width="16" height="28" fill="#3a86ff" stroke={INK} strokeWidth="2.5" />
        <line x1={-back + 22} y1="-6" x2="10" y2="-7" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
        <rect x="-10" y="-22" width="34" height="9" rx="4" fill={STEEL} stroke={INK} strokeWidth="2.5" />
        <rect x={front - 18} y={-lens - 3} width="20" height={2 * lens + 6} rx="5" fill="#ffd23f" stroke={INK} strokeWidth="3" />
        <ellipse cx={front + 2} rx="5" ry={lens - 2} fill="#8fd3ff" stroke={INK} strokeWidth="2.5" />
        <circle r="8" fill={STEEL} stroke={INK} strokeWidth="2.5" />
      </g>
      {glint >= 0 && glint < 1.2 && (
        <path
          transform={`translate(${tip.x} ${tip.y}) scale(${2.2 * decay(glint * 2.5)}) rotate(${glint * 90})`}
          d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z"
          fill="#fff7d6"
        />
      )}
    </g>
  );
});

/** How far below the beam's sprite middle the ground is: the sprite reaches from above the UFO's lamp down past the ground. */
const BEAM_LOW = 200;
/** How far the beam's sprite reaches round its middle. */
const BEAM_PAD = 230;
/** How far the UFO's sprite reaches round its middle: the saucer's rim and the alien's antenna. */
const UFO_PAD = 92;
/** How far the moon rock's sprite reaches round its middle: its crystal and its glow in the beam. */
const ROCK_PAD = ROCK.r + 18;

/**
 * The UFO, its beam and the moon rock it carries, as small layers of their own over the machine (`Sprite`), in the
 * order they lay in: the beam, the saucer, the rock hanging under it. Drawn in the machine's svg, the beam's rings
 * running up to the ground changed a tall band of it in every frame while the saucer hovered, carried the rock and
 * zoomed off, and the phone painted the whole machine again for it (perf, A-49).
 */
function UfoSky({ space, t, at }: { space: Space; t: number; at: ScreenAt }) {
  const ufo = space.ufoAt(t);
  const beam = space.beamAt(t);
  const rock = space.rockAt(t);
  const inBeam = beam > 0 && t < space.tRelease;
  return (
    <>
      {ufo && beam > 0 && (
        <Sprite at={at} x={ufo.pt.x} y={FLOOR - BEAM_LOW} pad={BEAM_PAD}>
          <BeamLight top={ufo.pt.y + UFO_BELOW - (FLOOR - BEAM_LOW)} beam={beam} rise={(t * 0.7) % 1} />
        </Sprite>
      )}
      {ufo && (
        <Sprite at={at} x={ufo.pt.x} y={ufo.pt.y} pad={UFO_PAD} angle={(ufo.tilt * Math.PI) / 180}>
          <Ufo
            scale={ufo.scale}
            look={ufo.look}
            lamp={beam > 0}
            hand={ufo.waving ? { x: 22 + 3 * Math.sin(t * 14), y: -44 + 4 * Math.abs(Math.sin(t * 7)) } : { x: 18, y: -16 }}
            light={Math.floor(t * 6) % UFO_LIGHTS.length}
          />
        </Sprite>
      )}
      <Sprite at={at} x={rock.pt.x} y={rock.pt.y} pad={ROCK_PAD} angle={(rock.spin * Math.PI) / 180}>
        <MoonRock glow={inBeam ? 0.3 + 0.15 * Math.sin(t * 10) : -1} />
      </Sprite>
    </>
  );
}

/**
 * The UFO's beam down to the ground, round a point `BEAM_LOW` above the ground under the UFO: it starts at `top` (in
 * the same frame, so negative), is as bright as `beam` and its rings of light are `rise` (0–1) of the way up.
 */
const BeamLight = still(function BeamLight({ top, beam, rise }: { top: number; beam: number; rise: number }) {
  const low = BEAM_LOW;
  const rings = [0, 1, 2, 3];
  return (
    <g opacity={beam}>
      <path d={`M-24 ${top} L24 ${top} L90 ${low} L-90 ${low} Z`} fill="#fff3a0" opacity="0.35" />
      <path d={`M-12 ${top} L12 ${top} L46 ${low} L-46 ${low} Z`} fill="#fffbd0" opacity="0.35" />
      {rings.map((i) => {
        // Rings of light running up the beam.
        const f = (rise + i / rings.length) % 1;
        const y = lerp(low, top, f);
        const half = lerp(90, 24, f);
        return <ellipse key={i} cy={y} rx={half} ry={half * 0.18} fill="none" stroke="#fffbd0" strokeWidth="3" opacity={0.8 * (1 - f)} />;
      })}
      <ellipse cy={low - 2} rx="92" ry="12" fill="#fff3a0" opacity="0.5" />
    </g>
  );
});

const UFO_LIGHTS = [-60, -30, 0, 30, 60];

/**
 * The UFO with a little one-eyed alien under its glass dome, round its middle and grown to `scale`; its lamp underneath
 * glows while the beam is on (`lamp`), `hand` is where the alien's hand is, `look` where its eye looks, `light` which
 * of the rim's lights is on.
 */
const Ufo = still(function Ufo({ scale, look, lamp, hand, light }: { scale: number; look: Pt; lamp: boolean; hand: Pt; light: number }) {
  return (
    <g transform={`scale(${scale})`}>
      {/* The alien under the dome */}
      <path d="M-14 -4 Q-16 -20 -10 -24 L10 -24 Q16 -20 14 -4 Z" fill="#b98cff" stroke={INK} strokeWidth="2.5" />
      <line x1="0" y1="-48" x2="5" y2="-60" stroke={INK} strokeWidth="2.5" />
      <circle cx="5" cy="-61" r="4" fill="#ff7bd0" stroke={INK} strokeWidth="1.5" />
      <circle cy="-34" r="16" fill="#b98cff" stroke={INK} strokeWidth="2.5" />
      <circle cy="-37" r="8" fill="#fff" stroke={INK} strokeWidth="2" />
      <circle cx={look.x * 3.5} cy={-37 + look.y * 3.5} r="4" fill={INK} />
      <circle cx={look.x * 3.5 - 1.5} cy={-38.5 + look.y * 3.5} r="1.3" fill="#fff" />
      <path d="M-6 -26 Q0 -21 6 -26" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="-14" x2={hand.x} y2={hand.y} stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <line x1="10" y1="-14" x2={hand.x} y2={hand.y} stroke="#b98cff" strokeWidth="3" strokeLinecap="round" />
      <circle cx={hand.x} cy={hand.y} r="4.5" fill="#b98cff" stroke={INK} strokeWidth="2" />
      {/* The glass dome over it */}
      <path d="M-38 -6 Q-38 -66 0 -66 Q38 -66 38 -6 Z" fill="#bde9ff" opacity="0.3" stroke={INK} strokeWidth="3" />
      <path d="M-26 -30 Q-24 -52 -8 -58" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      {/* The saucer: rim, blinking lights, and the beam's lamp underneath */}
      <ellipse cy="14" rx="32" ry="10" fill={lamp ? "#fff3a0" : DARK_STEEL} stroke={INK} strokeWidth="3" />
      <ellipse rx="82" ry="20" fill={STEEL} stroke={INK} strokeWidth="3.5" />
      <path d="M-80 -2 Q0 -18 80 -2" fill="none" stroke="#ff5d73" strokeWidth="5" />
      <path d="M-60 -10 Q-30 -16 -10 -16" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      {UFO_LIGHTS.map((x, i) => {
        const on = light === i;
        return (
          <circle
            key={x}
            cx={x}
            cy={8 - Math.abs(x) * 0.06}
            r="5.5"
            fill={on ? "#ffd23f" : BAR_COLORS[i]}
            stroke={INK}
            strokeWidth="2"
            opacity={on ? 1 : 0.75}
          />
        );
      })}
    </g>
  );
});

const ROCK_SHAPE = Array.from({ length: 9 }, (_, i) => {
  const a = (i / 9) * 2 * Math.PI;
  const r = ROCK.r * (0.86 + 0.18 * Math.sin(i * 2.7));
  return { x: r * Math.cos(a), y: r * Math.sin(a) * 0.9 };
});

/** The lumpy moon rock with a pink crystal, round its middle (its sprite turns it), which sparkles while it is in the UFO's beam (`glow`, -1 when not). */
const MoonRock = still(function MoonRock({ glow }: { glow: number }) {
  return (
    <g>
      {glow >= 0 && <circle r={ROCK.r + 12} fill="#fff3a0" opacity={glow} />}
      <path d={`${svgLine(ROCK_SHAPE)} Z`} fill="#b7aed6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="-7" cy="5" r="5" fill="#968cbf" />
      <circle cx="9" cy="8" r="3.5" fill="#968cbf" />
      <path d="M2 -16 L8 -30 L14 -16 Z M-4 -14 L-6 -25 L3 -16 Z" fill="#ff9bd7" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="-8" cy="-7" r="3" fill="#fff" opacity="0.7" />
    </g>
  );
});

/* ---------- Countdown board ---------- */

const LAMP_COLORS = ["#ff3b3b", "#ff8c42", "#ffd23f"];

/** The dark opening of the slot on top of the board, behind the iron ball. */
const SlotHole = memo(function SlotHole() {
  return <ellipse cx={SLOT.x} cy={BOARD.y - SLOT.h} rx={SLOT.w / 2 - 6} ry="10" fill="#10163a" stroke={INK} strokeWidth="3" />;
});

/** The countdown board at the machine's `t` seconds: works out what it shows and draws it only when that changes. */
function CountdownNow({ space, t }: { space: Space; t: number }) {
  const step = space.countAt(t);
  const awake = t >= space.tWake;
  const tStep = step === 0 ? 0 : step === 4 ? space.tLift : space.tCount[step - 1];
  return <CountdownBoard step={step} awake={awake} popUp={1 + 0.35 * decay((t - tStep) * 8)} dot={awake && step === 0 ? Math.floor(t * 5) % 3 : -1} />;
}

/**
 * The board wakes up when the iron ball drops into its slot, then counts down: three lamps one after the other, then
 * all green for the start. `step` is how far it counted (0–4), `popUp` how big its number pops up, `dot` which of the
 * waiting dots lights (-1 none).
 */
const CountdownBoard = still(function CountdownBoard({ step, awake, popUp, dot }: { step: number; awake: boolean; popUp: number; dot: number }) {
  // The word on the screen at lift-off, as the voice says it.
  const liftWord = useT()({ de: "START!", en: "LIFTOFF!", zh: "发射！", hi: "उड़ान!", es: "¡DESPEGUE!", ar: "انطلاق!", ru: "ПУСК!" });
  const { x, y, w, h } = BOARD;
  const cx = x + w / 2;
  const screen = { y: y + 82, h: h - 104 };
  const cy = screen.y + screen.h / 2;
  const slotL = SLOT.x - SLOT.w / 2;
  return (
    <g>
      {/* The slot box the iron ball drops into */}
      <path
        d={`M${slotL} ${y - SLOT.h} A${SLOT.w / 2 - 6} 10 0 0 0 ${slotL + SLOT.w} ${y - SLOT.h} L${slotL + SLOT.w - 6} ${y + 4} L${slotL + 6} ${y + 4} Z`}
        fill="#ffb703"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d={`M${slotL + 14} ${y - SLOT.h + 16} L${slotL + 16} ${y - 6}`} stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d={`M${slotL} ${y - SLOT.h} A${SLOT.w / 2 - 6} 10 0 0 1 ${slotL + SLOT.w} ${y - SLOT.h}`} fill="none" stroke={INK} strokeWidth="3.5" />
      {[x + 40, x + w - 56].map((lx) => (
        <rect key={lx} x={lx} y={y + h - 10} width="16" height={FLOOR - y - h + 10} rx="4" fill={STEEL} stroke={INK} strokeWidth="3" />
      ))}
      <rect x={x} y={y} width={w} height={h} rx="18" fill="#3d4a7a" stroke={INK} strokeWidth="4" />
      {[0, 1, 2].map((i) => {
        const lit = step >= i + 1;
        const color = step === 4 ? GLOW : LAMP_COLORS[i];
        const lx = x + w * (0.25 + 0.25 * i);
        return (
          <g key={i}>
            {lit && <circle cx={lx} cy={y + 42} r="36" fill={color} opacity="0.3" />}
            <circle cx={lx} cy={y + 42} r="24" fill={lit ? color : "#2a2f55"} stroke={INK} strokeWidth="3.5" />
            <circle cx={lx - 7} cy={y + 35} r="5.5" fill="#fff" opacity={lit ? 0.8 : 0.25} />
          </g>
        );
      })}
      <rect x={x + 40} y={screen.y} width={w - 80} height={screen.h} rx="12" fill="#10163a" stroke={INK} strokeWidth="3" />
      {awake && <rect x={x + 46} y={screen.y + 6} width={w - 92} height={screen.h - 12} rx="8" fill={GLOW} opacity="0.08" />}
      {step === 0 && [-1, 0, 1].map((i) => <circle key={i} cx={cx + i * 36} cy={cy} r="8" fill={dot === i + 1 ? GLOW : "#2e3a70"} />)}
      {step > 0 && (
        <text
          x={cx}
          y={cy}
          transform={`translate(${cx} ${cy}) scale(${popUp}) translate(${-cx} ${-cy})`}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={step === 4 ? 70 : 100}
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          fill={step === 4 ? GLOW : LAMP_COLORS[step - 1]}
        >
          {step === 4 ? liftWord : 4 - step}
        </text>
      )}
    </g>
  );
});

/* ---------- Launch tower, fuel tank, rocket ---------- */

/** The launch tower, its blinking `lamp` on top and its arm to the rocket turned by `angle`. */
const LaunchTower = still(function LaunchTower({ angle, lamp }: { angle: number; lamp: boolean }) {
  const len = ROCKET.x - ROCKET.w / 2 - TOWER_ARM.x;
  return (
    <g>
      <Lattice x={TOWER.x} w={TOWER.w} top={TOWER.top} />
      <rect x={TOWER.x - TOWER.w / 2 - 14} y={TOWER.top - 16} width={TOWER.w + 28} height="18" rx="5" fill="#ffb703" stroke={INK} strokeWidth="3" />
      <Blinker x={TOWER.x} y={TOWER.top - 30} on={lamp} />
      <rect x={TOWER.x - TOWER.w / 2 - 22} y={FLOOR - 22} width={TOWER.w + 44} height="22" rx="5" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
      <g transform={`translate(${TOWER_ARM.x} ${TOWER_ARM.y}) rotate(${angle})`}>
        <line x1="4" y1="-40" x2={len - 6} y2="-40" stroke={STEEL} strokeWidth="4" />
        {[16, len / 2, len - 10].map((lx) => (
          <line key={lx} x1={lx} y1="-40" x2={lx} y2="-10" stroke={STEEL} strokeWidth="3" />
        ))}
        <rect x="0" y="-10" width={len} height="22" rx="5" fill="#ffb703" stroke={INK} strokeWidth="3" />
      </g>
      <circle cx={TOWER_ARM.x} cy={TOWER_ARM.y} r="8" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
    </g>
  );
});

const Pad = memo(function Pad() {
  const { x0, x1 } = PAD;
  return (
    <g>
      <rect x={x0} y={ROCKET.bottom} width={x1 - x0} height={FLOOR - ROCKET.bottom + 4} rx="6" fill={DARK_STEEL} stroke={INK} strokeWidth="4" />
      {Array.from({ length: Math.floor((x1 - x0 - 20) / 40) }, (_, i) => (
        <path key={i} d={`M${x0 + 16 + i * 40} ${FLOOR - 6} l14 -26 h14 l-14 26 Z`} fill="#ffd23f" />
      ))}
    </g>
  );
});

const Tank = memo(function Tank() {
  const { x, w, h } = TANK;
  return (
    <g>
      {[x + 16, x + w - 30].map((lx) => (
        <rect key={lx} x={lx} y={FLOOR - 40} width="14" height="40" fill={STEEL} stroke={INK} strokeWidth="3" />
      ))}
      <rect x={x} y={FLOOR - h} width={w} height={h - 30} rx={w / 2} fill="#f4f5fb" stroke={INK} strokeWidth="4" />
      <rect x={x} y={FLOOR - h * 0.62} width={w} height="34" fill="#3a86ff" stroke={INK} strokeWidth="3" />
      <path d={`M${x + w / 2} ${FLOOR - h + 46} q-16 24 0 34 q16 -10 0 -34 Z`} fill="#3a86ff" stroke={INK} strokeWidth="2.5" />
      <rect x={x + 16} y={FLOOR - h + 30} width="8" height="60" rx="4" fill="#fff" />
      <rect x={HOSE.from.x - 14} y={HOSE.from.y - 12} width="18" height="24" rx="4" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** The fuel hose from the tank to the rocket; `drop` goes from 0 (plugged in) to 1 (lying on the ground). */
const Hose = still(function Hose({ drop }: { drop: number }) {
  const { from, plug, dropped } = HOSE;
  const tip = hop(plug, dropped, 30, drop);
  const bend = {
    x: lerp((from.x + plug.x) / 2, (from.x + dropped.x) / 2, drop),
    y: lerp(from.y + 40, FLOOR - 6, drop),
  };
  const d = `M${from.x - 12} ${from.y} Q${bend.x} ${bend.y} ${tip.x} ${tip.y}`;
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth="20" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#ffb703" strokeWidth="13" strokeLinecap="round" />
      <path d={d} fill="none" stroke={INK} strokeWidth="13" strokeDasharray="6 18" opacity="0.25" />
      <circle cx={tip.x} cy={tip.y} r="11" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** The rocket at the machine's `t` seconds, until it has flown out of the picture. */
function RocketNow({ space, t }: { space: Space; t: number }) {
  const rise = space.rocketRise(t);
  // Flown out of the picture, it is gone: its flame flickered and the bear waved there for ever, unseen (perf).
  if (rise >= ROCKET_RISE) return null;
  const size = space.flameAt(t);
  // The gloved paw waves beside the cheek, clear of the ear.
  const paw = t >= space.tCount[0] ? { x: 20 + 3 * Math.sin(t * 12), y: -WINDOW_UP + 6 - 5 * Math.abs(Math.sin(t * 6)) } : { x: 12, y: -WINDOW_UP + 18 };
  return <Rocket rise={rise} flame={Math.max(size, 0)} flicker={size > 0 ? 1 + 0.12 * Math.sin(t * 41) + 0.08 * Math.sin(t * 23) : 1} paw={paw} />;
}

/**
 * The rocket with a bear astronaut at the window (the app's bear in a white space suit, D-18), lifted by `rise`; it
 * lifts off on its flame (`flame` its size, 0 when off, `flicker` its length's flicker), and `paw` is where the bear's
 * gloved paw is.
 */
const Rocket = still(function Rocket({ rise, flame, flicker, paw }: { rise: number; flame: number; flicker: number; paw: Pt }) {
  const clip = useId();
  const { w, h, nose } = ROCKET;
  const half = w / 2;
  const top = -30 - h;
  const plugY = HOSE.plug.y - ROCKET.bottom;
  const fin = (s: number) => (
    <path
      d={`M${s * half} -170 Q${s * (half + 50)} -110 ${s * (half + 46)} 0 L${s * (half + 10)} 0 L${s * half} -30 Z`}
      fill="#ff5d73"
      stroke={INK}
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
  );
  return (
    <g transform={`translate(${ROCKET.x} ${ROCKET.bottom - rise})`}>
      <Flame size={flame} flicker={flicker} />
      {fin(-1)}
      {fin(1)}
      <path d="M-34 -32 L34 -32 L46 0 L-46 0 Z" fill={DARK_STEEL} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path
        d={`M${-half} -30 L${-half} ${top} Q${-half} ${top - nose * 0.75} 0 ${top - nose} Q${half} ${top - nose * 0.75} ${half} ${top} L${half} -30 Z`}
        fill="#f4f5fb"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${-half * 0.62} ${top - nose * 0.47} Q0 ${top - nose * 0.62} ${half * 0.62} ${top - nose * 0.47}`} fill="none" stroke={INK} strokeWidth="3" />
      <path
        d={`M${-half * 0.62} ${top - nose * 0.47} Q0 ${top - nose * 0.62} ${half * 0.62} ${top - nose * 0.47} Q${half * 0.3} ${top - nose * 0.85} 0 ${top - nose} Q${-half * 0.3} ${top - nose * 0.85} ${-half * 0.62} ${top - nose * 0.47} Z`}
        fill="#ff5d73"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x={-half} y={-110} width={w} height="26" fill="#3a86ff" stroke={INK} strokeWidth="3" />
      <rect x={-half + 14} y={top + 30} width="10" height={h - 80} rx="5" fill="#fff" />
      <rect x={half - 4} y={plugY - 10} width="12" height="20" rx="3" fill={DARK_STEEL} stroke={INK} strokeWidth="2.5" />
      {/* Window with the bear astronaut */}
      <defs>
        <clipPath id={clip}>
          <circle cy={-WINDOW_UP} r="27" />
        </clipPath>
      </defs>
      <circle cy={-WINDOW_UP} r="27" fill="#bde9ff" />
      <g clipPath={`url(#${clip})`}>
        {/* The white space suit with its blue collar ring, then the app's bear head (components/Mascot.tsx) and a gloved paw */}
        <circle cy={-WINDOW_UP + 30} r="24" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <path d={`M-15 ${-WINDOW_UP + 14} Q0 ${-WINDOW_UP + 22} 15 ${-WINDOW_UP + 14}`} fill="none" stroke="#3a86ff" strokeWidth="5" strokeLinecap="round" />
        <g transform={`translate(-19 ${-WINDOW_UP - 20}) scale(0.38)`}>
          <BearFace />
        </g>
        <circle cx={paw.x} cy={paw.y} r="6" fill="#fff" stroke={INK} strokeWidth="2" />
        <circle cx={paw.x} cy={paw.y} r="2.5" fill={MASCOT_COLORS.bear.fur} />
      </g>
      <circle cy={-WINDOW_UP} r="30" fill="none" stroke={DARK_STEEL} strokeWidth="8" />
      <circle cy={-WINDOW_UP} r="34" fill="none" stroke={INK} strokeWidth="3" />
      <circle cy={-WINDOW_UP} r="26" fill="none" stroke={INK} strokeWidth="3" />
      <path
        d={`M-16 ${-WINDOW_UP - 14} Q-10 ${-WINDOW_UP - 20} -2 ${-WINDOW_UP - 21}`}
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.8"
      />
    </g>
  );
});

/** The bear astronaut's head, drawn once: the rocket moves it but never changes it. */
const BearFace = memo(function BearFace() {
  return <MascotHead kind="bear" mouth="grin" />;
});

/** The flame under the rocket, its length times `flicker`; `size` is 0 when the engine is off. */
function Flame({ size, flicker }: { size: number; flicker: number }) {
  if (size <= 0) return null;
  const len = 200 * size * flicker;
  const wide = 36 + 10 * size;
  return (
    <g>
      <path
        d={`M${-wide} 0 Q${-wide - 6} ${len * 0.5} 0 ${len} Q${wide + 6} ${len * 0.5} ${wide} 0 Z`}
        fill="#ff8c42"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d={`M${-wide * 0.6} 0 Q${-wide * 0.6} ${len * 0.35} 0 ${len * 0.66} Q${wide * 0.6} ${len * 0.35} ${wide * 0.6} 0 Z`} fill="#ffd23f" />
      <path d={`M${-wide * 0.28} 0 Q${-wide * 0.28} ${len * 0.18} 0 ${len * 0.34} Q${wide * 0.28} ${len * 0.18} ${wide * 0.28} 0 Z`} fill="#fff" />
    </g>
  );
}

/** The smoke's puffs: one every `every` seconds from the ignition until `until` seconds after lift-off, each `life` seconds long. */
const SMOKE = { life: 2.6, every: 0.09, until: 2.2 };

/**
 * Clouds of smoke: a few puffs while the engine warms up, big ones rolling sideways at the start, and a trail after the
 * rocket. Nothing shows before the ignition or once the last puff is gone, so `SpaceLevel` holds `t` there.
 */
const Smoke = still(function Smoke({ space, t }: { space: Space; t: number }) {
  const puffs = [];
  const { life, every } = SMOKE;
  for (let i = 0; space.tIgnite + i * every <= Math.min(t, space.tLift + SMOKE.until); i++) {
    const te = space.tIgnite + i * every;
    const age = t - te;
    if (age > life) continue;
    const side = i % 2 ? 1 : -1;
    const fade = 0.9 * (1 - age / life);
    let x: number;
    let y: number;
    let r: number;
    if (te < space.tLift + 0.5) {
      // Rolling away along the ground on both sides of the pad.
      const big = te < space.tLift ? 0.55 : 1;
      x = ROCKET.x + side * (50 + 330 * big * (1 - decay(age * 1.4)) + (i % 3) * 14);
      y = ROCKET.bottom - 16 - 40 * age * big - (i % 4) * 8;
      r = (20 + 46 * Math.min(age, 1.4)) * big;
    } else {
      x = ROCKET.x + side * (8 + 26 * age);
      y = ROCKET.bottom - space.rocketRise(te) + 60 + 14 * age;
      r = 18 + 34 * Math.min(age, 1.4);
    }
    puffs.push(<circle key={i} cx={x} cy={y} r={r} fill="#f4f5fb" stroke="#b9bdd6" strokeWidth="3" opacity={fade} />);
  }
  return <g>{puffs}</g>;
});

/** The sparkles round the rocket at lift-off, drawn again only while they change. */
const StillSparkles = still(Sparkles);

/** How old the lift-off's sparkles are, `age` seconds after they began; -1 while there are none (`Sparkles` lasts 3 s). */
const sparkleAge = (age: number) => (age >= 0 && age <= 3 ? age : -1);

/* ---------- The intercom, the glass dome with the space kangaroo, the radio mast, the satellite and its capsule ---------- */

/** The intercom on its post: a box with a speaker grille and a lamp that lights when the buggy presses its button. */
const Intercom = still(function Intercom({ pressed, lit }: { pressed: boolean; lit: boolean }) {
  const { x, r, post, h, y } = INTERCOM;
  const box = { x0: x - 34, y0: FLOOR - h - 60, w: 68, h: 60 };
  return (
    <g>
      <rect x={x - post / 2} y={FLOOR - h} width={post} height={h} rx="4" fill={STEEL} stroke={INK} strokeWidth="3" />
      <rect x={x - post / 2 - 2 * r - (pressed ? 0 : 6)} y={y - 7} width={2 * r + 6} height="14" rx="4" fill={DARK_STEEL} stroke={INK} strokeWidth="2.5" />
      <circle cx={x - post / 2 - r - (pressed ? -4 : 2)} cy={y} r={r} fill="#ff5d73" stroke={INK} strokeWidth="3" />
      <rect x={box.x0} y={box.y0} width={box.w} height={box.h} rx="12" fill="#8e7dff" stroke={INK} strokeWidth="3.5" />
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={box.x0 + 14}
          y1={box.y0 + 18 + i * 12}
          x2={box.x0 + 40}
          y2={box.y0 + 18 + i * 12}
          stroke={INK}
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      {lit && <circle cx={box.x0 + 52} cy={box.y0 + 30} r="16" fill={GLOW} opacity="0.35" />}
      <circle cx={box.x0 + 52} cy={box.y0 + 30} r="8" fill={lit ? GLOW : "#5a4a7a"} stroke={INK} strokeWidth="2.5" />
    </g>
  );
});

/** The inside of the glass dome behind the kangaroo: its floor ring and a soft round cushion. It never changes, so it is drawn once. */
const DomeBack = memo(function DomeBack() {
  const { x, r } = HUT;
  return (
    <g>
      <path d={`M${x - r} ${FLOOR} A${r} ${r} 0 0 1 ${x + r} ${FLOOR} Z`} fill="#1d2a66" opacity="0.55" />
      <ellipse cx={x - 30} cy={FLOOR - 6} rx="70" ry="14" fill="#ff9bb5" stroke={INK} strokeWidth="3" />
      <ellipse cx={x - 50} cy={FLOOR - 10} rx="22" ry="4" fill="#fff" opacity="0.5" />
    </g>
  );
});

/** The glass over the kangaroo, its steel ribs, and the tunnel out to the hatch, which slides up by `open` (0–1). */
const DomeFront = still(function DomeFront({ open }: { open: number }) {
  const { x, r, tunnel0, x1, door } = HUT;
  const top = FLOOR - door;
  return (
    <g>
      <path d={`M${x - r} ${FLOOR} A${r} ${r} 0 0 1 ${x + r} ${FLOOR} Z`} fill="#bde9ff" opacity="0.22" stroke={INK} strokeWidth="4" />
      <path d={`M${x} ${FLOOR - r} L${x} ${FLOOR}`} stroke={STEEL} strokeWidth="4" opacity="0.6" />
      <path d={`M${x - r * 0.7} ${FLOOR} Q${x - r * 0.7} ${FLOOR - r * 0.72} ${x} ${FLOOR - r}`} fill="none" stroke={STEEL} strokeWidth="4" opacity="0.6" />
      <path
        d={`M${x - r * 0.72} ${FLOOR - r * 0.38} Q${x - r * 0.6} ${FLOOR - r * 0.8} ${x - r * 0.2} ${FLOOR - r * 0.92}`}
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <rect x={x - r - 10} y={FLOOR - 14} width={2 * r + 20} height="14" rx="5" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
      {/* The tunnel, its ribs, and the hatch at its end */}
      <rect x={tunnel0} y={top} width={x1 - tunnel0} height={door} rx="10" fill={STEEL} stroke={INK} strokeWidth="3.5" />
      {[tunnel0 + 30, tunnel0 + 60].map((rx) => (
        <line key={rx} x1={rx} y1={top + 4} x2={rx} y2={FLOOR - 4} stroke={DARK_STEEL} strokeWidth="4" />
      ))}
      <rect x={x1 - 6} y={top - 4} width="14" height={door + 4} rx="5" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
      <g transform={`translate(0 ${-open * (door - 6)})`}>
        <rect x={x1 + 4} y={top + 4} width="12" height={door - 4} rx="4" fill="#ffb703" stroke={INK} strokeWidth="3" />
        <circle cx={x1 + 10} cy={top + door / 2} r="3.5" fill={INK} />
      </g>
    </g>
  );
});

const ROO = "#d9944f";
const ROO_LIGHT = "#f6d6a8";

/** The space kangaroo in its bubble helmet, its feet at `pt`, facing right; asleep it droops its ears, `crouch` (0–1) bends it down for a hop, `lean` tips it forward. */
const Kangaroo = still(function Kangaroo({ pt, awake, crouch, lean }: { pt: Pt; awake: boolean; crouch: number; lean: number }) {
  const squash = 1 - 0.16 * crouch;
  const ear = awake ? 0 : -55;
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${lean}) scale(1 ${squash})`}>
      <path d="M-12 -26 Q-40 -18 -54 -2" fill="none" stroke={INK} strokeWidth="15" strokeLinecap="round" />
      <path d="M-12 -26 Q-40 -18 -54 -2" fill="none" stroke={ROO} strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="12" cy="-6" rx="22" ry="6" fill={ROO} stroke={INK} strokeWidth="3" />
      <ellipse cx="-2" cy="-26" rx="19" ry="20" fill={ROO} stroke={INK} strokeWidth="3" />
      <ellipse cx="6" cy="-48" rx="17" ry="26" transform="rotate(14 6 -48)" fill={ROO} stroke={INK} strokeWidth="3" />
      <ellipse cx="11" cy="-42" rx="9" ry="15" transform="rotate(14 11 -42)" fill={ROO_LIGHT} />
      <path d="M4 -34 Q12 -28 19 -34" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 -56 L26 -44" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d="M16 -56 L26 -44" stroke={ROO} strokeWidth="3.5" strokeLinecap="round" />
      {[8, 18].map((ex, i) => (
        <g key={ex} transform={`rotate(${ear * (i ? 0.8 : 1)} ${ex} -88)`}>
          <ellipse cx={ex} cy="-101" rx="5.5" ry="14" fill={ROO} stroke={INK} strokeWidth="2.5" />
          <ellipse cx={ex} cy="-100" rx="2.5" ry="9" fill="#ffb3c1" />
        </g>
      ))}
      <circle cx="15" cy="-78" r="15" fill={ROO} stroke={INK} strokeWidth="3" />
      <ellipse cx="28" cy="-73" rx="10" ry="7.5" fill={ROO_LIGHT} stroke={INK} strokeWidth="2.5" />
      <circle cx="37" cy="-75" r="3" fill={INK} />
      {awake ? (
        <>
          <circle cx="20" cy="-82" r="3.5" fill={INK} />
          <circle cx="21" cy="-83.5" r="1.2" fill="#fff" />
        </>
      ) : (
        <path d="M16 -82 Q20 -78 24 -82" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      )}
      <circle cx="12" cy="-74" r="4" fill="#ffb3c1" opacity="0.8" />
      {/* The bubble helmet with its collar ring */}
      <circle cx="16" cy="-86" r="30" fill="#bde9ff" opacity="0.25" stroke={INK} strokeWidth="3" />
      <path d="M-2 -106 Q6 -114 18 -115" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <rect x="-6" y="-62" width="40" height="8" rx="4" fill="#ff5d73" stroke={INK} strokeWidth="2.5" transform="rotate(14 14 -58)" />
    </g>
  );
});

/** The radio mast: a lattice with an antenna on top. It never changes, so it is drawn once. */
const RadioMast = memo(function RadioMast() {
  const { x, top } = RADIO;
  return (
    <g>
      <Lattice x={x} w={40} top={top + 60} />
      <rect x={x - 34} y={FLOOR - 18} width="68" height="18" rx="5" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
      <Beam
        pts={[
          { x, y: top + 60 },
          { x, y: top + 10 },
        ]}
        w={5}
      />
      {[-1, 1].map((s) => (
        <line key={s} x1={x} y1={top + 40} x2={x + s * 22} y2={top + 28} stroke={STEEL} strokeWidth="4" strokeLinecap="round" />
      ))}
      <path d={`M${RADIO.pedal + RADIO.pedalW / 2 + 6} ${FLOOR - 6} L${x - 34} ${FLOOR - 6}`} stroke={INK} strokeWidth="6" strokeLinecap="round" />
    </g>
  );
});

/** The mast's moving parts: the pedal pressed `down`, the lamps lighting one after the other (`lit`) and the antenna tip glowing while `sending`. */
const RadioMoving = still(function RadioMoving({ down, sending, lit }: { down: number; sending: boolean; lit: boolean[] }) {
  const { x, top, pedal, pedalW, pedalH } = RADIO;
  return (
    <g>
      <rect x={pedal - pedalW / 2 - 6} y={FLOOR - 10} width={pedalW + 12} height="10" rx="3" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
      <rect
        x={pedal - pedalW / 2 + 6}
        y={FLOOR - pedalH + down + 6}
        width={pedalW - 12}
        height={pedalH - 14 - down}
        fill={STEEL}
        stroke={INK}
        strokeWidth="3"
      />
      <rect x={pedal - pedalW / 2 - 4} y={FLOOR - pedalH + down} width={pedalW + 8} height="10" rx="5" fill="#3ec300" stroke={INK} strokeWidth="3" />
      {RADIO_LAMPS.map((y, i) => (
        <g key={y}>
          {lit[i] && <circle cx={x} cy={y} r="22" fill={LAMP_COLORS[i]} opacity="0.35" />}
          <circle cx={x} cy={y} r="11" fill={lit[i] ? LAMP_COLORS[i] : "#5a4a7a"} stroke={INK} strokeWidth="3" />
        </g>
      ))}
      {sending && <circle cx={x} cy={top} r="20" fill={GLOW} opacity="0.3" />}
      <circle cx={x} cy={top} r="10" fill={sending ? GLOW : "#ffd23f"} stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** Which way the radio waves travel, from the mast's top to the satellite, in degrees. */
const WAVE_DIR = deg(Math.atan2(SAT.y - RADIO.top, SAT.x - RADIO.x));

/**
 * The radio-wave arcs on their way from the mast up to the satellite, each a small layer of its own over the machine
 * (`Sprite`): drawn in the machine's svg they crossed a tall band of it in every frame (perf, A-38).
 */
function RadioWaves({ space, t, at }: { space: Space; t: number; at: ScreenAt }) {
  return space.waveAt(t).map(({ pt, k }, i) => (
    <Sprite key={i} at={at} x={pt.x} y={pt.y} pad={50} angle={(WAVE_DIR * Math.PI) / 180}>
      <RadioWave k={k} />
    </Sprite>
  ));
}

/** One radio-wave arc, round 0, 0, facing right; `k` (0–1) is how far it has come, so it grows and fades. */
const RadioWave = still(function RadioWave({ k }: { k: number }) {
  const R = 18 + 22 * k;
  return (
    <g opacity={1 - 0.5 * k}>
      <path d={`M0 ${-R} A${R} ${R} 0 0 1 0 ${R}`} fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d={`M0 ${-R} A${R} ${R} 0 0 1 0 ${R}`} fill="none" stroke={GLOW} strokeWidth="5" strokeLinecap="round" />
    </g>
  );
});

/**
 * The satellite and the capsule it drops, as small layers of their own over the machine (`Sprite`): the satellite
 * bobbing high in the sky and the capsule floating all the way down to the ground changed a tall column of the
 * machine's svg in every frame, and the phone rastered bands as wide as the screen all down it (perf, A-38).
 */
function SkyFall({ space, t, at }: { space: Space; t: number; at: ScreenAt }) {
  const { awake, wings } = space.satAt(t);
  // It bobs for a few seconds once awake, then floats still: bobbing for ever kept the phone painting it (perf).
  const bob = awake ? 4 * Math.sin((t - space.tSatWake) * 3) * (1 - seg(t, space.tSatWake + 4, space.tSatWake + 6)) : 0;
  const { pt, chute, sway } = space.capsuleAt(t);
  return (
    <>
      <Sprite at={at} x={SAT.x} y={SAT.y + bob} pad={SAT.wing + 40}>
        <Satellite awake={awake} wings={wings} />
      </Sprite>
      <Sprite at={at} x={pt.x} y={pt.y - CAPSULE.h} pad={CAPSULE_PAD} angle={(sway * Math.PI) / 180}>
        <Capsule chute={chute} />
      </Sprite>
    </>
  );
}

/** The little satellite in the sky, round 0, 0: asleep until the radio waves reach it, then it opens its eyes and unfolds its solar wings (`wings`, 0–1). */
const Satellite = still(function Satellite({ awake, wings }: { awake: boolean; wings: number }) {
  const { wing } = SAT;
  const reach = lerp(18, wing, wings);
  return (
    <g>
      {[-1, 1].map((s) => {
        const x0 = s * 30;
        const x1 = s * (30 + reach);
        const cells = Math.max(1, Math.round(reach / 30));
        return (
          <g key={s}>
            <line x1={x0} y1="0" x2={x1} y2="0" stroke={STEEL} strokeWidth="5" />
            <rect x={Math.min(x0 + s * 8, x1)} y="-20" width={Math.abs(x1 - x0 - s * 8)} height="40" rx="3" fill="#2f6fd6" stroke={INK} strokeWidth="3" />
            {Array.from({ length: cells - 1 }, (_, k) => {
              const cx = x0 + s * 8 + ((x1 - x0 - s * 8) * (k + 1)) / cells;
              return <line key={k} x1={cx} y1="-20" x2={cx} y2="20" stroke="#8fc3ff" strokeWidth="2" />;
            })}
          </g>
        );
      })}
      <line x1="0" y1="-24" x2="10" y2="-48" stroke={STEEL} strokeWidth="4" strokeLinecap="round" />
      <path d="M-2 -52 Q10 -40 24 -50 Z" fill={STEEL} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="-30" y="-24" width="60" height="50" rx="10" fill="#ffd23f" stroke={INK} strokeWidth="3.5" />
      <rect x="-24" y="-18" width="16" height="8" rx="3" fill="#fff" opacity="0.6" />
      {awake ? (
        <>
          <circle cx="-10" cy="-2" r="4.5" fill={INK} />
          <circle cx="10" cy="-2" r="4.5" fill={INK} />
          <circle cx="-9" cy="-3.5" r="1.5" fill="#fff" />
          <circle cx="11" cy="-3.5" r="1.5" fill="#fff" />
          <path d="M-8 10 Q0 17 8 10" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M-15 -2 Q-10 2 -5 -2 M5 -2 Q10 2 15 -2" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M-5 12 Q0 14 5 12" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      <rect x="-12" y="26" width="24" height="8" rx="3" fill={DARK_STEEL} stroke={INK} strokeWidth="2.5" />
    </g>
  );
});

const CHUTE_COLORS = ["#ff5d73", "#fff", "#ff5d73", "#fff", "#ff5d73"];

/** How far the capsule's sprite reaches round the top of the capsule, where it hangs from its parachute and sways: up to the open canopy. */
const CAPSULE_PAD = 220;

/** The capsule with its striped parachute open by `chute` (0–1), drawn round the top of the capsule, the point it sways about. */
const Capsule = still(function Capsule({ chute }: { chute: number }) {
  const { half, h, nozzle } = CAPSULE;
  const canopyY = -h - 40 - 90 * chute;
  const cw = 90 * chute;
  return (
    <g transform={`translate(0 ${h})`}>
      {chute > 0.02 && (
        <g>
          {[-1, -0.35, 0.35, 1].map((s) => (
            <line key={s} x1={s * cw} y1={canopyY} x2={s * 12} y2={-h + 2} stroke={INK} strokeWidth="2" />
          ))}
          {CHUTE_COLORS.map((c, i) => {
            const a = -cw + (2 * cw * i) / CHUTE_COLORS.length;
            const b = -cw + (2 * cw * (i + 1)) / CHUTE_COLORS.length;
            const lift = (u: number) => canopyY - 70 * chute * Math.sqrt(Math.max(0, 1 - (u / Math.max(cw, 1)) ** 2));
            return (
              <path
                key={i}
                d={`M${a} ${canopyY} L${a} ${lift(a)} Q${(a + b) / 2} ${lift((a + b) / 2) - 8 * chute} ${b} ${lift(b)} L${b} ${canopyY} Q${(a + b) / 2} ${canopyY - 10 * chute} ${a} ${canopyY} Z`}
                fill={c}
                stroke={INK}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            );
          })}
        </g>
      )}
      <path d={`M${-half} 0 L${-half * 0.6} ${-h} L${half * 0.6} ${-h} L${half} 0 Z`} fill="#f4f5fb" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <rect x={-half + 4} y="-22" width={2 * half - 8} height="10" fill="#ff5d73" />
      <circle cy={-h * 0.62} r="9" fill="#bde9ff" stroke={INK} strokeWidth="3" />
      <rect x={half - 8} y={-nozzle - 6} width="14" height="12" rx="3" fill={DARK_STEEL} stroke={INK} strokeWidth="2.5" />
      <rect x={-12} y={-h - 6} width="24" height="8" rx="3" fill={DARK_STEEL} stroke={INK} strokeWidth="2.5" />
    </g>
  );
});

/** The puff of air from the capsule's nozzle, round its middle: a small cloud growing (`size`) on its way to the earth and fading (`fade`) there. */
const AirPuff = still(function AirPuff({ size, fade }: { size: number; fade: number }) {
  return (
    <g transform={`scale(${size})`} opacity={0.9 * (1 - fade)}>
      {[
        { x: -14, y: 4, r: 14 },
        { x: 4, y: -6, r: 16 },
        { x: 16, y: 8, r: 12 },
      ].map((c) => (
        <circle key={c.x} cx={c.x} cy={c.y} r={c.r} fill="#f4f5fb" stroke="#b9bdd6" strokeWidth="3" />
      ))}
    </g>
  );
});

/** Far away and small, the rocket coming down on the moon at `x`, `y` on its `flame`, and the `flag` that pops out once it has landed. */
const MoonLanding = still(function MoonLanding({ x, y, flame, flag }: { x: number; y: number; flame: number; flag: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(1.5)`}>
      {flame > 0 && <path d={`M-7 0 Q0 ${26 * flame} 7 0 Z`} fill="#ff8c42" stroke={INK} strokeWidth="2" />}
      {flag > 0 && (
        <g>
          <line x1="14" y1="-6" x2="14" y2={-6 - 44 * flag} stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d={`M14 ${-6 - 44 * flag} l${24 * flag} 7 l${-24 * flag} 7 Z`} fill="#ffd23f" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        </g>
      )}
      <path d="M-14 0 L-10 -10 L10 -10 L14 0 Z" fill="#ff5d73" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M-9 -8 L-9 -40 Q0 -58 9 -40 L9 -8 Z" fill="#f4f5fb" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cy="-30" r="4" fill="#bde9ff" stroke={INK} strokeWidth="1.5" />
    </g>
  );
});
