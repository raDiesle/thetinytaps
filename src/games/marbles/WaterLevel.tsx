import { useEffect, useId, useMemo, useRef, type PointerEvent } from "react";
import { playPlop, playQuack } from "@/lib/sfx";
import { useAnyKey, useFrames, useLevelName, VIEW_H, VIEW_W, type LevelProps } from "./level";
import { deg, svgLine } from "./machineKit";
import type { Pt } from "./path";
import { INK, Sparkles } from "./scenery";
import {
  BABIES,
  BASINS,
  BELL,
  BELL_ANGLE,
  BROOK,
  brookY,
  buildWater,
  cameraFor,
  FISH,
  flowAt,
  FLUME,
  FOUNTAIN,
  GATE,
  gateAt,
  gateX,
  GROUND,
  groundY,
  PIPE,
  PIPE_LINE,
  POOL,
  POOL_SPOT,
  poseAt,
  SKY_TOP,
  SLIDE_LINE,
  TOWER,
  waterAt,
  WHEEL,
  WORLD_H,
  WORLD_W,
  type Basin,
  type Pose,
} from "./water";
import "./water.css";

const WATER = "#5cc8f5";
const WATER_DEEP = "#3aa6e0";
const FOAM = "#ffffff";
const GRASS = "#86d04f";
const GRASS_DARK = "#5aa83a";
const STONE = "#c9c3b8";
const STONE_DARK = "#9d958a";
const WOOD = "#c98b4f";
const WOOD_DARK = "#8a5a2b";
const DUCK = "#ffd23f";
const BEAK = "#ff8c42";
/** How fast the camera catches up with the duck, per second. */
const CAMERA_FOLLOW = 2.4;
/** A tapped duck hops this high, for this long. */
const HOP = { h: 60, s: 0.45 };
/** A ripple where the water was tapped lasts this long. */
const RIPPLE_S = 0.9;

/** A ring of water where the child tapped, `at` seconds into the level. */
interface Ripple {
  pt: Pt;
  at: number;
}

/**
 * „Wasserbahn“: a yellow rubber duck rides a water run down a sunny hillside.
 * It waits, all still, at each closed lock gate until the child taps (or
 * presses a key) anywhere; then the gate lifts, the water rushes through and
 * carries it down to the next basin – past a water wheel ringing a bell, a
 * leaping fish and a frog, down a twisty slide and through a pipe – into the
 * paddling pool where its ducklings wait. While it is on its way, a tap on the
 * water splashes a ripple and any other tap or key makes the duck quack and hop.
 */
export function WaterLevel({ sound, say, onDone }: LevelProps) {
  const label = useLevelName("water");
  const water = useMemo(buildWater, []);
  const { stretches } = water;
  const ids = useId();
  /** The stretch running or waiting for its gate, and the seconds since its gate opened (below 0 while the duck waits). */
  const step = useRef(0);
  const clock = useRef(-1);
  const fired = useRef(0);
  /** Seconds since the level started, for hops and ripples. */
  const life = useRef(0);
  const hopAt = useRef(-10);
  const ripples = useRef<Ripple[]>([]);
  const world = useRef<SVGGElement>(null);
  const current = () => stretches[step.current];
  const pose = () => poseAt(current(), clock.current);
  const focus = () => {
    const s = current();
    if (step.current === stretches.length - 1 && clock.current >= s.land) return POOL_SPOT;
    const { pt } = pose();
    return clock.current < 0 ? { x: pt.x + 120, y: pt.y - 60 } : { x: pt.x + 80, y: pt.y - 40 };
  };
  const camera = useRef<Pt | null>(null);
  camera.current ??= cameraFor(focus());

  /** Plays the sounds and lines of the current stretch up to its clock; the last stretch's end calls `onDone`. */
  const fire = () => {
    const { events } = current();
    while (fired.current < events.length && events[fired.current].at <= clock.current) {
      const e = events[fired.current++];
      if (e.sound) sound(e.sound);
      if (e.say) say(e.say);
      if (e.done) onDone();
    }
  };

  useFrames((dt) => {
    life.current += dt;
    if (clock.current >= 0) {
      const s = current();
      const last = step.current === stretches.length - 1;
      // The last stretch's clock runs on after the end, so the sparkles and the fountain's last drops fade away.
      clock.current = last ? clock.current + dt : Math.min(s.duration, clock.current + dt);
      fire();
      // Settled: on to the next gate, where the duck waits again.
      if (clock.current >= s.duration && !last) {
        step.current++;
        clock.current = -1;
        fired.current = 0;
      }
    }
    ripples.current = ripples.current.filter((r) => life.current - r.at < RIPPLE_S);
    const target = cameraFor(focus());
    const cam = camera.current ?? target;
    const k = 1 - Math.exp(-dt * CAMERA_FOLLOW);
    camera.current = { x: cam.x + (target.x - cam.x) * k, y: cam.y + (target.y - cam.y) * k };
  });

  /** The duck waits at a gate: open it now, with its creak right away. */
  const open = () => {
    clock.current = 0;
    fired.current = 0;
    fire();
  };
  const quackHop = () => {
    hopAt.current = life.current;
    sound(playQuack);
  };

  useAnyKey(() => (clock.current < 0 ? open() : quackHop()));

  // For trying out a stretch in the browser console: __water.seek(2, 1.5) is one and a half seconds after the third gate opened.
  useEffect(() => {
    if (import.meta.env.PROD) return;
    Object.assign(window, {
      __water: {
        seek(stretch: number, seconds: number) {
          step.current = Math.max(0, Math.min(stretches.length - 1, stretch));
          clock.current = seconds;
          const { events } = stretches[step.current];
          fired.current = events.findIndex((e) => e.at > seconds);
          if (fired.current < 0) fired.current = events.length;
          camera.current = cameraFor(focus());
        },
      },
    });
  }, [stretches]);

  const onPointerDown = (e: PointerEvent) => {
    if (clock.current < 0) {
      open();
      return;
    }
    const m = world.current?.getScreenCTM();
    const p = m ? new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse()) : null;
    const duck = pose();
    const onDuck = p && !duck.hidden && Math.hypot(p.x - duck.pt.x, p.y - (duck.pt.y - 40)) < 95;
    const wet = p && !onDuck ? waterAt(p) : null;
    if (wet) {
      ripples.current.push({ pt: wet, at: life.current });
      sound(playPlop);
    } else quackHop();
  };

  const s = current();
  const t = clock.current;
  /** The seconds into stretch `k`: done ones are at their end, coming ones before their start. */
  const timeOf = (k: number) => (k < step.current ? stretches[k].duration : k === step.current ? t : -1);
  const duck = pose();
  const hopK = (life.current - hopAt.current) / HOP.s;
  const hopping = hopK >= 0 && hopK < 1;
  const lift = hopping ? 4 * HOP.h * hopK * (1 - hopK) : 0;
  const cam = camera.current;
  const t1 = timeOf(0);
  const t2 = timeOf(1);
  const t3 = timeOf(2);
  const t4 = timeOf(3);

  return (
    <div className="marble-level" onPointerDown={onPointerDown}>
      <svg className="marble-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-label={label}>
        <g ref={world} transform={`translate(${-cam.x} ${-cam.y})`}>
          <Sky gradient={`${ids}-sky`} />
          <Hill />
          {BASINS.map((b, i) => (
            <BasinBack key={i} basin={b} />
          ))}
          <Bell swing={water.bellAt(t1)} />
          <WaterWheel turned={water.wheelAt(t1)} />
          <Waterfall pts={[FLUME.to, { x: 1440, y: FLUME.to.y + 10 }, { x: 1470, y: BASINS[1].y }]} flow={flowAt(stretches[0], t1)} t={t1} />
          <FlumeBack flow={flowAt(stretches[0], t1)} t={t1} />
          <Brook flow={flowAt(stretches[1], t2)} t={t2} />
          <Waterfall pts={[BROOK.to, { x: 2800, y: BROOK.to.y + 10 }, { x: 2830, y: BASINS[2].y }]} flow={flowAt(stretches[1], t2)} t={t2} />
          <LilyPads />
          <Frog {...water.frogAt(t2)} />
          <Tower />
          <PoolBack />
          <Fountain drops={water.dropsAt(t4)} />
          {BABIES.map((x, i) => (
            <Duck key={i} x={x} y={POOL.y - 70 * water.babyAt(i, t4)} tilt={-8 * water.babyAt(i, t4)} flip scale={0.5} />
          ))}

          {!duck.hidden && (
            <Duck
              x={duck.pt.x}
              y={duck.pt.y - lift}
              tilt={duck.tilt}
              flip={duck.flip}
              scale={duck.scale * (hopping ? 1 + 0.08 * Math.sin(hopK * Math.PI) : 1)}
            />
          )}

          {BASINS.map((b, i) => (
            <BasinFront key={i} basin={b} />
          ))}
          <FlumeFront />
          <BrookFront />
          <Slide flow={flowAt(stretches[2], t3)} t={t3} />
          <PoolFront />
          <Pipe duck={duck} t={t4} flow={flowAt(stretches[3], t4)} bulge={duck.hidden && hopping ? Math.sin(hopK * Math.PI) : 0} />
          {BASINS.map((b, i) => (
            <Gate key={i} basin={b} lift={gateAt(stretches[i], timeOf(i))} waiting={i === step.current && t < 0} />
          ))}
          <Fish at={water.fishAt(t2)} />

          <Splash x={1500} y={BASINS[1].y} age={t1 - stretches[0].land} />
          <Splash x={2880} y={BASINS[2].y} age={t2 - stretches[1].land} />
          <Splash x={FISH.from} y={brookY(FISH.from)} age={t2 - water.fishFrom} size={0.6} />
          <Splash x={FISH.to} y={brookY(FISH.to)} age={t2 - water.fishFrom - FISH.duration} size={0.6} />
          <Splash x={3200} y={BASINS[2].y} age={t2 - water.frog.splash} size={0.8} />
          <Splash x={4160} y={BASINS[3].y} age={t3 - stretches[2].land} />
          <Splash x={5300} y={POOL.y} age={t4 - stretches[3].land} />
          {ripples.current.map((r, i) => (
            <Splash key={i} x={r.pt.x} y={r.pt.y} age={life.current - r.at} size={0.5} />
          ))}
          <Sparkles x={(POOL.x0 + POOL.x1) / 2 + 120} y={POOL.y - 140} age={t4 - water.pool.sparkle} n={14} spread={320} />
          {t < 0 && <TapHint basin={s.basin} />}
        </g>
      </svg>
    </div>
  );
}

/* ---------- The duck ---------- */

/** The yellow rubber duck, its waterline at (x, y), looking right (or left when `flip`). */
function Duck({ x, y, tilt, flip = false, scale = 1 }: { x: number; y: number; tilt: number; flip?: boolean; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${(flip ? -1 : 1) * scale} ${scale})`}>
      <path
        d="M-48 -34 Q-62 -60 -40 -54 Q-22 -46 -6 -44 L28 -44 Q54 -42 50 -14 Q46 16 0 16 Q-44 16 -48 -34 Z"
        fill={DUCK}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M-26 -24 Q-6 -36 14 -24 Q-2 -8 -26 -24 Z" fill="#ffb703" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="20" cy="-64" r="25" fill={DUCK} stroke={INK} strokeWidth="4" />
      <path d="M40 -68 Q66 -70 68 -60 Q62 -50 40 -54 Z" fill={BEAK} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="28" cy="-70" r="5" fill={INK} />
      <circle cx="30" cy="-72" r="1.8" fill="#fff" />
      <ellipse cx="10" cy="-76" rx="7" ry="4" fill="#fff6" />
    </g>
  );
}

/* ---------- Sky and hill ---------- */

function Sky({ gradient }: { gradient: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fd0ff" />
          <stop offset="1" stopColor="#e3f7ff" />
        </linearGradient>
      </defs>
      {/* Plain sky above the gradient, for tall screens. */}
      <rect x="-600" y={SKY_TOP - 2600} width={WORLD_W + 1200} height="2010" fill="#7fd0ff" />
      <rect x="-600" y={SKY_TOP - 600} width={WORLD_W + 1200} height={WORLD_H - SKY_TOP + 600} fill={`url(#${gradient})`} />
      <g transform="translate(560 -110)">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="0" y1="-84" x2="0" y2="-112" transform={`rotate(${i * 30})`} stroke="#ffd23f" strokeWidth="9" strokeLinecap="round" />
        ))}
        <circle r="66" fill="#ffd23f" stroke="#ffb703" strokeWidth="6" />
      </g>
      {[
        [1300, -90, 1],
        [2500, 260, 0.8],
        [3300, 520, 1.1],
        [4500, 860, 0.9],
        [5500, 1180, 1],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
          <ellipse cx="0" cy="0" rx="90" ry="34" />
          <circle cx="-30" cy="-22" r="34" />
          <circle cx="26" cy="-28" r="42" />
        </g>
      ))}
      {/* Soft far hills behind, going down with the near one. */}
      {[
        [700, 300, 900],
        [2300, 700, 900],
        [3900, 1040, 900],
        [5500, 1460, 1000],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y + r * 0.55} rx={r} ry={r * 0.75} fill="#bfeaa0" />
      ))}
    </g>
  );
}

const FLOWERS = [-260, -120, 1080, 1180, 2200, 2420, 2620, 3600, 3660, 4820, 4900, 5020, 6040, 6120];
const TREES = [-220, 2330, 4300, 6080];
const BUSHES = [1700, 2650, 4540];

function Hill() {
  const top = svgLine(GROUND);
  return (
    <g>
      <path d={`${top} L${WORLD_W + 400} ${WORLD_H + 2000} L-400 ${WORLD_H + 2000} Z`} fill={GRASS} />
      <path d={`${top} L${WORLD_W + 400} ${WORLD_H + 2000} L-400 ${WORLD_H + 2000} Z`} fill="#6cbf43" transform="translate(0 90)" />
      <path d={top} fill="none" stroke={GRASS_DARK} strokeWidth="6" strokeLinejoin="round" />
      {TREES.map((x) => (
        <Tree key={x} x={x} y={groundY(x)} />
      ))}
      {BUSHES.map((x) => (
        <g key={x} transform={`translate(${x} ${groundY(x) - 20})`}>
          <circle cx="-34" cy="-16" r="34" fill="#4caf50" stroke={INK} strokeWidth="3" />
          <circle cx="30" cy="-14" r="30" fill="#4caf50" stroke={INK} strokeWidth="3" />
          <circle cx="0" cy="-34" r="38" fill="#5cbf55" stroke={INK} strokeWidth="3" />
          <circle cx="-10" cy="-40" r="6" fill="#ff5d73" />
          <circle cx="22" cy="-24" r="6" fill="#ff5d73" />
        </g>
      ))}
      {FLOWERS.map((x, i) => (
        <Flower key={x} x={x} y={groundY(x)} color={["#ff5d73", "#ffd23f", "#b388ff", "#ffffff"][i % 4]} />
      ))}
      {/* The stony cliff the slide goes down. */}
      <path d="M3560 990 L3640 1380 L3600 1380 L3530 1000 Z" fill={STONE_DARK} />
    </g>
  );
}

function Tree({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-16" y="-150" width="32" height="154" rx="8" fill="#a0673a" stroke={INK} strokeWidth="3" />
      <circle cx="0" cy="-200" r="90" fill="#4caf50" stroke={INK} strokeWidth="4" />
      <circle cx="-40" cy="-230" r="16" fill="#6cc95a" />
      <circle cx="30" cy="-180" r="12" fill="#6cc95a" />
    </g>
  );
}

function Flower({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y + 4})`}>
      <line x1="0" y1="0" x2="0" y2="-34" stroke="#3f8f2f" strokeWidth="4" />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={10 * Math.cos((a * Math.PI) / 180)} cy={-40 + 10 * Math.sin((a * Math.PI) / 180)} r="8" fill={color} stroke={INK} strokeWidth="2" />
      ))}
      <circle cx="0" cy="-40" r="6" fill="#ffb703" />
    </g>
  );
}

/* ---------- Basins and gates ---------- */

/** The basin's stone tub and its water, behind the duck. */
function BasinBack({ basin: b }: { basin: Basin }) {
  const x1 = b.x1 + GATE.w / 2;
  return (
    <g>
      <rect x={b.x0 - 18} y={b.y - 22} width={x1 - b.x0 + 18} height={b.depth + 40} rx="14" fill={STONE} stroke={INK} strokeWidth="4" />
      <rect x={b.x0} y={b.y - 22} width={x1 - b.x0} height={b.depth + 22} fill={STONE_DARK} />
      <rect x={b.x0} y={b.y - 4} width={x1 - b.x0} height={b.depth + 4} fill={WATER_DEEP} />
    </g>
  );
}

/** The basin's water in front of the duck, so it sits in it rather than on it. */
function BasinFront({ basin: b }: { basin: Basin }) {
  const x1 = b.x1 + GATE.w / 2;
  return (
    <g>
      <rect x={b.x0} y={b.y + 3} width={x1 - b.x0} height={b.depth - 3} fill={WATER} />
      <path d={`M${b.x0} ${b.y + 4} H${x1}`} stroke="#bdeeff" strokeWidth="5" />
      {[0.2, 0.5, 0.8].map((k) => (
        <path key={k} d={`M${b.x0 + (x1 - b.x0) * k - 40} ${b.y + 40} q20 -10 40 0 t40 0`} fill="none" stroke="#bdeeff" strokeWidth="4" strokeLinecap="round" />
      ))}
      <rect x={b.x0 - 18} y={b.y + b.depth} width={x1 - b.x0 + 18} height="18" rx="9" fill={STONE} stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** A lock gate: a wooden board between two posts, lifted by the big red handwheel on the beam. `waiting` marks the gate the child can open. */
function Gate({ basin: b, lift, waiting }: { basin: Basin; lift: number; waiting: boolean }) {
  const x = gateX(b);
  const up = lift * GATE.lift;
  const wy = b.y + GATE.wheelY;
  return (
    <g>
      {[x - GATE.w / 2, x + GATE.w / 2 - 14].map((px) => (
        <rect key={px} x={px} y={b.y + GATE.beam} width="14" height={GATE.bottom - GATE.beam + 10} rx="4" fill={WOOD_DARK} stroke={INK} strokeWidth="3" />
      ))}
      <g transform={`translate(0 ${-up})`}>
        <rect x={x - 22} y={b.y + GATE.top} width="44" height={GATE.bottom - GATE.top} rx="5" fill={WOOD} stroke={INK} strokeWidth="3.5" />
        {[0.25, 0.5, 0.75].map((k) => (
          <line
            key={k}
            x1={x - 22}
            x2={x + 22}
            y1={b.y + GATE.top + (GATE.bottom - GATE.top) * k}
            y2={b.y + GATE.top + (GATE.bottom - GATE.top) * k}
            stroke={WOOD_DARK}
            strokeWidth="3"
          />
        ))}
      </g>
      <rect x={x - GATE.w / 2 - 14} y={b.y + GATE.beam - 16} width={GATE.w + 28} height="22" rx="6" fill={WOOD_DARK} stroke={INK} strokeWidth="3" />
      <rect x={x - 5} y={wy} width="10" height={GATE.wheelY * -1 + GATE.beam - 16} fill="#777" stroke={INK} strokeWidth="2" />
      {waiting && <circle cx={x} cy={wy} r={GATE.wheelR + 22} fill="#fff59d" fillOpacity="0.7" stroke="#ffd23f" strokeWidth="8" />}
      <g transform={`translate(${x} ${wy}) rotate(${lift * 400})`}>
        <circle r={GATE.wheelR} fill="none" stroke={INK} strokeWidth="18" />
        <circle r={GATE.wheelR} fill="none" stroke="#ff5d73" strokeWidth="12" />
        {[0, 60, 120].map((a) => (
          <line key={a} x1={-GATE.wheelR} x2={GATE.wheelR} y1="0" y2="0" transform={`rotate(${a})`} stroke="#ff5d73" strokeWidth="8" strokeLinecap="round" />
        ))}
        <circle r="12" fill="#ffd23f" stroke={INK} strokeWidth="3" />
        <circle cx={GATE.wheelR} cy="0" r="9" fill="#ffd23f" stroke={INK} strokeWidth="3" />
      </g>
    </g>
  );
}

/** The finger over the gate the duck waits at; still, so nothing moves before the child does. */
function TapHint({ basin }: { basin: Basin }) {
  return (
    <text className="water-hint" x={gateX(basin)} y={basin.y + GATE.wheelY - GATE.wheelR - 34} fontSize="90" textAnchor="middle">
      👇
    </text>
  );
}

/* ---------- Flowing water ---------- */

/** Water rushing along `pts` while `flow` is above 0: a band with white streaks running downhill. */
function Rush({ pts, flow, t, width }: { pts: Pt[]; flow: number; t: number; width: number }) {
  if (flow <= 0.01) return null;
  const d = svgLine(pts);
  return (
    <g opacity={Math.min(1, flow * 1.5)} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={d} stroke={WATER} strokeWidth={width * (0.4 + 0.6 * flow)} />
      <path d={d} stroke={FOAM} strokeWidth="5" strokeDasharray="34 60" strokeDashoffset={-t * 420} />
    </g>
  );
}

/** A waterfall from a lip down into a basin, through the three points; only there while the water runs. */
function Waterfall({ pts, flow, t }: { pts: Pt[]; flow: number; t: number }) {
  if (flow <= 0.01) return null;
  const [a, c, b] = pts;
  const d = `M${a.x} ${a.y} Q${c.x} ${c.y} ${b.x} ${b.y}`;
  return (
    <g opacity={Math.min(1, flow * 1.5)} fill="none" strokeLinecap="round">
      <path d={d} stroke={WATER} strokeWidth={46 * flow} />
      <path d={d} stroke={FOAM} strokeWidth="5" strokeDasharray="30 46" strokeDashoffset={-t * 520} />
      <ellipse cx={b.x} cy={b.y} rx={60 * flow} ry={14 * flow} fill={FOAM} />
    </g>
  );
}

/** The wooden flume on its posts, with its water; its front board comes after the duck. */
function FlumeBack({ flow, t }: { flow: number; t: number }) {
  const { from, to } = FLUME;
  return (
    <g>
      {[1110, 1210].map((x) => {
        const y = from.y + ((x - from.x) * (to.y - from.y)) / (to.x - from.x);
        return <rect key={x} x={x - 9} y={y + 20} width="18" height={groundY(x) - y - 10} fill={WOOD_DARK} stroke={INK} strokeWidth="3" />;
      })}
      <path d={`M${from.x} ${from.y - 10} L${to.x} ${to.y - 10} L${to.x} ${to.y + 20} L${from.x} ${from.y + 20} Z`} fill={WATER_DEEP} />
      <Rush pts={[from, to]} flow={flow} t={t} width={16} />
    </g>
  );
}

function FlumeFront() {
  const { from, to } = FLUME;
  return (
    <g>
      <path
        d={`M${from.x} ${from.y + 4} L${to.x} ${to.y + 4} L${to.x} ${to.y + 36} L${from.x} ${from.y + 36} Z`}
        fill={WOOD}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${from.x + 10} ${from.y + 20} L${to.x - 10} ${to.y + 20}`} stroke={WOOD_DARK} strokeWidth="3" />
    </g>
  );
}

/** The water wheel behind the waterfall: wooden rim, spokes and paddles, and four red pegs that knock the bell. */
function WaterWheel({ turned }: { turned: number }) {
  const { x, y, r, peg } = WHEEL;
  return (
    <g>
      <path
        d={`M${x} ${y} L${x - 70} ${BASINS[1].y + 90} M${x} ${y} L${x + 70} ${BASINS[1].y + 90}`}
        stroke={WOOD_DARK}
        strokeWidth="16"
        strokeLinecap="round"
      />
      <g transform={`translate(${x} ${y}) rotate(${-deg(turned)})`}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={r - 30} y="-9" width="44" height="18" rx="3" transform={`rotate(${i * 30})`} fill={WOOD} stroke={INK} strokeWidth="3" />
        ))}
        <circle r={r - 20} fill="none" stroke={INK} strokeWidth="16" />
        <circle r={r - 20} fill="none" stroke={WOOD} strokeWidth="10" />
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={-(r - 20)} x2={r - 20} y1="0" y2="0" transform={`rotate(${i * 30})`} stroke={WOOD_DARK} strokeWidth="8" />
        ))}
        {[0, 1, 2, 3].map((i) => {
          const a = deg(BELL_ANGLE) + 45 + i * 90;
          return (
            <g key={i} transform={`rotate(${a})`}>
              <line x1={r - 20} x2={peg - 10} y1="0" y2="0" stroke={INK} strokeWidth="8" strokeLinecap="round" />
              <circle cx={peg - 10} cy="0" r="10" fill="#ff5d73" stroke={INK} strokeWidth="3" />
            </g>
          );
        })}
        <circle r="20" fill="#ffd23f" stroke={INK} strokeWidth="4" />
      </g>
    </g>
  );
}

/** The bell hanging from its post left of the wheel; `swing` degrees after a peg knocked it. */
function Bell({ swing }: { swing: number }) {
  const top = BELL.y - 62;
  return (
    <g>
      <rect x={BELL.post - 8} y={top - 10} width="16" height={groundY(BELL.post) - top + 14} fill={WOOD_DARK} stroke={INK} strokeWidth="3" />
      <rect x={BELL.post - 8} y={top - 14} width={BELL.x - BELL.post + 12} height="14" rx="4" fill={WOOD_DARK} stroke={INK} strokeWidth="3" />
      <g transform={`rotate(${swing} ${BELL.x} ${top})`}>
        <path
          d={`M${BELL.x - 32} ${BELL.y} Q${BELL.x - 30} ${top + 4} ${BELL.x} ${top + 2} Q${BELL.x + 30} ${top + 4} ${BELL.x + 32} ${BELL.y} Z`}
          fill="#ffc94a"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <circle cx={BELL.x} cy={BELL.y + 6} r="8" fill="#b8763d" stroke={INK} strokeWidth="3" />
      </g>
    </g>
  );
}

/** The brook down the bank: its water, with streaks while it rushes. */
function Brook({ flow, t }: { flow: number; t: number }) {
  const { from, to, depth } = BROOK;
  return (
    <g>
      <path d={`M${from.x} ${from.y - 8} L${to.x} ${to.y - 8} L${to.x} ${to.y + depth} L${from.x} ${from.y + depth} Z`} fill={WATER_DEEP} />
      <Rush pts={[from, to]} flow={flow} t={t} width={14} />
    </g>
  );
}

function BrookFront() {
  const { from, to, depth } = BROOK;
  return (
    <g>
      <path d={`M${from.x} ${from.y + 3} L${to.x} ${to.y + 3} L${to.x} ${to.y + depth} L${from.x} ${from.y + depth} Z`} fill={WATER} />
      <path d={`M${from.x} ${from.y + depth} L${to.x} ${to.y + depth}`} stroke={GRASS_DARK} strokeWidth="6" />
      {[2300, 2560].map((x) => (
        <ellipse key={x} cx={x} cy={brookY(x) + depth + 6} rx="30" ry="14" fill={STONE} stroke={INK} strokeWidth="3" />
      ))}
    </g>
  );
}

/** The fish leaping over the duck, pointing the way it flies. */
function Fish({ at }: { at: { pt: Pt; angle: number } | null }) {
  if (!at) return null;
  return (
    <g transform={`translate(${at.pt.x} ${at.pt.y}) rotate(${deg(at.angle) - 180}) scale(-1 1)`}>
      <path d="M-30 0 L-54 -20 L-50 0 L-54 20 Z" fill="#ff8c42" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse rx="38" ry="19" fill="#ffa94d" stroke={INK} strokeWidth="3.5" />
      <path d="M-4 -18 Q6 -30 16 -16" fill="#ff8c42" stroke={INK} strokeWidth="3" />
      <circle cx="20" cy="-5" r="4.5" fill={INK} />
      <path d="M30 6 Q34 8 36 4" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

/** The two lily pads on the third basin. */
function LilyPads() {
  const y = BASINS[2].y - 4;
  return (
    <g>
      {[3040, 3270].map((x) => (
        <path key={x} d={`M${x} ${y} L${x + 54} ${y - 4} A54 12 0 1 1 ${x + 40} ${y + 8} Z`} fill="#3f9f3a" stroke={INK} strokeWidth="3" />
      ))}
    </g>
  );
}

/** The green frog: sitting, leaping with its legs out, or only its eyes over the water. */
function Frog({ pt, look }: { pt: Pt; look: "sit" | "leap" | "eyes" }) {
  const green = "#5bbf3a";
  const eyes = (
    <g>
      {[-14, 14].map((x) => (
        <g key={x}>
          <circle cx={x} cy="-38" r="11" fill={green} stroke={INK} strokeWidth="3" />
          <circle cx={x} cy="-39" r="5" fill="#fff" />
          <circle cx={x + 1} cy="-39" r="2.6" fill={INK} />
        </g>
      ))}
    </g>
  );
  if (look === "eyes")
    return (
      <g transform={`translate(${pt.x} ${pt.y + 26})`}>
        {eyes}
        <ellipse cx="0" cy="-26" rx="34" ry="6" fill="none" stroke="#bdeeff" strokeWidth="4" />
      </g>
    );
  return (
    <g transform={`translate(${pt.x} ${pt.y})`}>
      {look === "leap" ? (
        <path d="M-14 -14 L-40 6 M14 -14 L40 6" stroke={green} strokeWidth="10" strokeLinecap="round" />
      ) : (
        <path d="M-26 0 Q-36 -12 -20 -14 M26 0 Q36 -12 20 -14" stroke={green} strokeWidth="10" strokeLinecap="round" fill="none" />
      )}
      <ellipse cx="0" cy="-18" rx="28" ry="20" fill={green} stroke={INK} strokeWidth="3.5" />
      {eyes}
      <path d="M-10 -14 Q0 -6 10 -14" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/** The tower the twisty slide winds around: a striped pole with a pointed red roof. */
function Tower() {
  const bottom = groundY(TOWER.x);
  return (
    <g>
      <rect x={TOWER.x - 26} y={TOWER.top} width="52" height={bottom - TOWER.top} fill="#fff6e0" stroke={INK} strokeWidth="4" />
      {Array.from({ length: Math.floor((bottom - TOWER.top) / 60) }, (_, i) => (
        <rect key={i} x={TOWER.x - 26} y={TOWER.top + 20 + i * 60} width="52" height="26" fill="#3a86ff" />
      ))}
      <path
        d={`M${TOWER.x - 60} ${TOWER.top} L${TOWER.x} ${TOWER.top - 90} L${TOWER.x + 60} ${TOWER.top} Z`}
        fill="#ff5d73"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d={`M${TOWER.x} ${TOWER.top - 90} L${TOWER.x} ${TOWER.top - 130} L${TOWER.x + 34} ${TOWER.top - 118} L${TOWER.x} ${TOWER.top - 106}`}
        fill="#ffd23f"
        stroke={INK}
        strokeWidth="3"
      />
    </g>
  );
}

/** The twisty slide: a red chute under the duck's way, on posts, with water streaming down it while the gate is open. */
function Slide({ flow, t }: { flow: number; t: number }) {
  const chute = svgLine(SLIDE_LINE.map((p) => ({ x: p.x, y: p.y + 16 })));
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {[3620, 3960].map((x) => (
        <line key={x} x1={x} x2={x} y1={x < 3800 ? 1060 : 1370} y2={groundY(x)} stroke={WOOD_DARK} strokeWidth="12" />
      ))}
      <path d={chute} stroke={INK} strokeWidth="40" />
      <path d={chute} stroke="#ff5d73" strokeWidth="32" />
      <path d={chute} stroke="#fff" strokeWidth="5" strokeDasharray="18 30" opacity="0.7" />
      <Rush pts={SLIDE_LINE.map((p) => ({ x: p.x, y: p.y + 2 }))} flow={flow} t={t} width={10} />
    </g>
  );
}

/** The big green pipe; the duck inside shows as a bump moving along it, which swells when the child taps. */
function Pipe({ duck, t, flow, bulge }: { duck: Pose; t: number; flow: number; bulge: number }) {
  const mid = PIPE_LINE.map((p) => ({ x: p.x, y: p.y - PIPE.lift }));
  const d = svgLine(mid);
  const inlet = mid[0];
  const outlet = mid[mid.length - 1];
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={PIPE.r * 2 + 8} strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#43b047" strokeWidth={PIPE.r * 2} strokeLinejoin="round" />
      <path
        d={svgLine(mid.map((p) => ({ x: p.x - 18, y: p.y - 30 })))}
        fill="none"
        stroke="#7fd36f"
        strokeWidth="14"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {duck.hidden && <circle cx={duck.pt.x} cy={duck.pt.y - PIPE.lift} r={PIPE.r + 8 + 14 * bulge} fill="#43b047" stroke={INK} strokeWidth="4" />}
      <ellipse cx={inlet.x - 6} cy={inlet.y} rx="22" ry={PIPE.r + 8} fill="#43b047" stroke={INK} strokeWidth="4" />
      <ellipse cx={inlet.x - 8} cy={inlet.y} rx="12" ry={PIPE.r - 6} fill="#1d4d1a" />
      <ellipse cx={outlet.x + 6} cy={outlet.y} rx="22" ry={PIPE.r + 8} fill="#43b047" stroke={INK} strokeWidth="4" />
      <ellipse cx={outlet.x + 8} cy={outlet.y} rx="12" ry={PIPE.r - 6} fill="#1d4d1a" />
      <Waterfall
        pts={[
          { x: outlet.x + 10, y: outlet.y + 30 },
          { x: outlet.x + 60, y: outlet.y + 30 },
          { x: outlet.x + 90, y: POOL.y },
        ]}
        flow={flow}
        t={t}
      />
    </g>
  );
}

/* ---------- The paddling pool ---------- */

const POOL_CX = (POOL.x0 + POOL.x1) / 2;
const POOL_RX = (POOL.x1 - POOL.x0) / 2;

/** The back of the paddling pool's blow-up ring and its water. */
function PoolBack() {
  return (
    <g>
      <ellipse cx={POOL_CX} cy={POOL.y} rx={POOL_RX + 22} ry={POOL.ry + 20} fill="#ff8fa3" stroke={INK} strokeWidth="4" />
      <ellipse cx={POOL_CX} cy={POOL.y + 2} rx={POOL_RX} ry={POOL.ry} fill={WATER} stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** The front half of the pool: its water in front of the ducks and the blow-up wall down to the lawn. */
function PoolFront() {
  const y = POOL.y + 3;
  return (
    <g>
      <path d={`M${POOL.x0} ${y} A${POOL_RX} ${POOL.ry - 1} 0 0 0 ${POOL.x1} ${y} Z`} fill={WATER} />
      <path
        d={`M${POOL.x0 - 22} ${POOL.y} L${POOL.x0 - 22} ${POOL.lawn - 30} Q${POOL.x0 - 22} ${POOL.lawn} ${POOL.x0 + 30} ${POOL.lawn} L${POOL.x1 - 30} ${POOL.lawn} Q${POOL.x1 + 22} ${POOL.lawn} ${POOL.x1 + 22} ${POOL.lawn - 30} L${POOL.x1 + 22} ${POOL.y} A${POOL_RX + 22} ${POOL.ry + 20} 0 0 1 ${POOL.x0 - 22} ${POOL.y} Z`}
        fill="#ff8fa3"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${POOL.x0 - 8} ${POOL.lawn - 30} H${POOL.x1 + 8}`} stroke="#fff" strokeWidth="10" strokeDasharray="40 40" />
    </g>
  );
}

/** The little fountain in the pool: a stone spout, and its drops while it sprays. */
function Fountain({ drops }: { drops: Pt[] }) {
  return (
    <g>
      {drops.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="10" fill={WATER} stroke="#fff" strokeWidth="2.5" />
      ))}
      <path
        d={`M${FOUNTAIN.x - 22} ${FOUNTAIN.y + 6} L${FOUNTAIN.x - 12} ${FOUNTAIN.y - 40} L${FOUNTAIN.x + 12} ${FOUNTAIN.y - 40} L${FOUNTAIN.x + 22} ${FOUNTAIN.y + 6} Z`}
        fill={STONE}
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <ellipse cx={FOUNTAIN.x} cy={FOUNTAIN.y - 40} rx="16" ry="6" fill={STONE_DARK} stroke={INK} strokeWidth="3" />
    </g>
  );
}

/* ---------- Splashes ---------- */

/** Drops flying up and a ring spreading where something hits the water at (x, y), `age` seconds ago. */
function Splash({ x, y, age, size = 1 }: { x: number; y: number; age: number; size?: number }) {
  if (age < 0 || age > 0.9) return null;
  const fade = 1 - age / 0.9;
  return (
    <g opacity={fade}>
      <ellipse cx={x} cy={y + 4} rx={(30 + 160 * age) * size} ry={(8 + 30 * age) * size} fill="none" stroke="#fff" strokeWidth={5 * size + 1} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (-160 + i * 20) * (Math.PI / 180);
        const v = (220 + ((i * 53) % 5) * 40) * size;
        const cy = y + Math.sin(a) * v * 1.4 * age + 900 * size * age * age;
        // A drop that has fallen back is in the water again.
        if (cy > y + 4) return null;
        return <circle key={i} cx={x + Math.cos(a) * v * age} cy={cy} r={(9 - 4 * age) * size + 2} fill={WATER} stroke="#fff" strokeWidth="2" />;
      })}
    </g>
  );
}
