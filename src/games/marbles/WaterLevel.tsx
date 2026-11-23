import { memo, useEffect, useId, useMemo, useRef, type PointerEvent } from "react";
import { playPlop } from "@/lib/sfx";
import { loadRealSounds, playCroak, playFlush, playQuack, playSplash } from "@/lib/realSounds";
import { cameraLayer, cameraPoint, gliding, SETTLE_S, useAnyKey, useFrames, useLevelName, VIEW_H, VIEW_W, worldHint, type LevelProps } from "./level";
import { TapHint } from "@/components/TapHint";
import { deg, svgLine } from "./machineKit";
import type { Pt } from "./path";
import { INK, Sparkles } from "./scenery";
import {
  BASINS,
  BELL,
  BELL_ANGLE,
  BROOK,
  brookY,
  buildWater,
  cameraFor,
  flowAt,
  FLUME,
  FOUNTAIN,
  FROG,
  GATE,
  gateAt,
  gateX,
  GEYSER,
  GROUND,
  groundY,
  HOT_SPRING,
  PIPE,
  PIPE_LINE,
  POOL,
  POOL_SPOT,
  poseAt,
  REED_POND,
  REEDS,
  SKY_TOP,
  SLIDE_LINE,
  STORK,
  TOWER,
  TURTLE,
  TURTLE_POND,
  waterAt,
  WHEEL,
  WORLD_H,
  WORLD_W,
  type Basin,
  type Bubble,
  type Pose,
  type StorkPose,
  gateWaits,
} from "./water";
import "./water.css";
import { PROD } from "@/lib/buildInfo";

/** All of the hillside the camera can show, drawn once as a layer of its own that the camera moves. */
const WATER_WORLD = { x: 0, y: SKY_TOP, w: WORLD_W, h: WORLD_H - SKY_TOP };

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
 * It waits, all still, at the first lock gate and at one more on the way
 * (`gateWaits`) until the child taps (or presses a key) anywhere; the other
 * gates open by themselves. As a gate lifts, the water rushes through and
 * carries it down to the next basin – past a water wheel ringing a bell and a
 * stork that flies it out of the reeds, a leaping fish, a turtle ferrying it
 * across its pond and a frog, down a twisty slide onto a geyser and through a
 * pipe – into the paddling pool where its ducklings wait and follow it in a
 * row. While it is on its way, a tap on the
 * water splashes a ripple and any other tap or key makes the duck quack and hop.
 */
export function WaterLevel({ sound, say, onDone, watch }: LevelProps) {
  const label = useLevelName("water");
  useEffect(() => loadRealSounds([playCroak, playFlush, playQuack, playSplash]), []);
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
  const box = useRef<HTMLDivElement>(null);
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
      // Settled: on to the next gate, where the duck waits for the tap only at the one gate that waits (`gateWaits`).
      if (clock.current >= s.duration && !last) {
        step.current++;
        clock.current = -1;
        fired.current = 0;
        if (!gateWaits(step.current, watch)) open();
      }
    }
    ripples.current = ripples.current.filter((r) => life.current - r.at < RIPPLE_S);
    const target = cameraFor(focus());
    const cam = camera.current ?? target;
    const k = 1 - Math.exp(-dt * CAMERA_FOLLOW);
    camera.current = { x: cam.x + (target.x - cam.x) * k, y: cam.y + (target.y - cam.y) * k };
    // Still while the duck waits at a gate and once the pool's fountain and sparkles are over after the end.
    const s = current();
    const running = clock.current >= 0 && (step.current < stretches.length - 1 || clock.current < s.duration + SETTLE_S);
    return running || ripples.current.length > 0 || life.current - hopAt.current < HOP.s || gliding(cam.x, target.x) || gliding(cam.y, target.y);
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
    if (PROD) return;
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
  const turtle = water.turtleAt(t2);

  return (
    <div className="marble-level" ref={box} onPointerDown={onPointerDown}>
      <svg
        className="marble-camera"
        viewBox={`0 ${SKY_TOP} ${WORLD_W} ${WORLD_H - SKY_TOP}`}
        style={cameraLayer(box.current, WATER_WORLD, { x: cam.x, y: cam.y, w: VIEW_W, h: VIEW_H })}
        aria-label={label}
      >
        <g ref={world}>
          <Sky gradient={`${ids}-sky`} />
          <Hill />
          <NestPole />
          {BASINS.map((b, i) => (
            <BasinBack key={i} basin={b} />
          ))}
          <PondBack pond={REED_POND} kind="reeds" />
          <PondBack pond={TURTLE_POND} kind="grass" />
          <PondBack pond={HOT_SPRING} kind="stones" />
          <Bell swing={water.bellAt(t1)} />
          <WaterWheel turned={water.wheelAt(t1)} />
          <Waterfall pts={[FLUME.to, { x: 1440, y: FLUME.to.y + 10 }, { x: 1470, y: REED_POND.y }]} flow={flowAt(stretches[0], t1)} t={t1} />
          <FlumeBack flow={flowAt(stretches[0], t1)} t={t1} />
          <Reeds sway={water.reedsAt(t1)} front={false} />
          <Brook flow={flowAt(stretches[1], t2)} t={t2} />
          <Waterfall pts={[BROOK.to, { x: 4220, y: BROOK.to.y + 10 }, { x: 4250, y: TURTLE_POND.y }]} flow={flowAt(stretches[1], t2)} t={t2} />
          <TurtleRock />
          {turtle && <Turtle {...turtle} />}
          <LilyPads />
          <Frog {...water.frogAt(t2)} />
          <Tower />
          <GeyserColumn top={water.geyserAt(t3)} t={t3} />
          <PoolBack />
          <Fountain drops={water.dropsAt(t4)} />
          {[0, 1, 2].map((i) => {
            const baby = water.babyAt(i, t4);
            return <Duck key={i} x={baby.x} y={POOL.y - 70 * baby.hop} tilt={-8 * baby.hop} flip scale={0.5} />;
          })}

          {!duck.hidden && (
            <Duck
              x={duck.pt.x}
              y={duck.pt.y - lift}
              tilt={duck.tilt}
              flip={duck.flip}
              scale={duck.scale * (hopping ? 1 + 0.08 * Math.sin(hopK * Math.PI) : 1)}
            />
          )}
          <Stork {...water.storkAt(t1)} />
          <NestFront />

          {BASINS.map((b, i) => (
            <BasinFront key={i} basin={b} />
          ))}
          <PondFront pond={REED_POND} />
          <PondFront pond={TURTLE_POND} />
          <PondFront pond={HOT_SPRING} />
          <Reeds sway={water.reedsAt(t1)} front />
          <Bubbles bubbles={[...water.turtleBubbles(t2), ...water.geyserBubbles(t3)]} />
          <FlumeFront />
          <BrookFront />
          <Slide flow={flowAt(stretches[2], t3)} t={t3} />
          <PoolFront />
          <Pipe duck={duck} t={t4} flow={flowAt(stretches[3], t4)} bulge={duck.hidden && hopping ? Math.sin(hopK * Math.PI) : 0} />
          {BASINS.map((b, i) => (
            <Gate key={i} basin={b} lift={gateAt(stretches[i], timeOf(i))} />
          ))}
          <Fish at={water.fishAt(t2)} />

          {stretches.map((st, k) => st.splashes.map((sp, j) => <Splash key={`${k}-${j}`} x={sp.pt.x} y={sp.pt.y} age={timeOf(k) - sp.at} size={sp.size} />))}
          {ripples.current.map((r, i) => (
            <Splash key={i} x={r.pt.x} y={r.pt.y} age={life.current - r.at} size={0.5} />
          ))}
          <Sparkles x={(POOL.x0 + POOL.x1) / 2 + 120} y={POOL.y - 140} age={t4 - water.pool.sparkle} n={14} spread={320} />
        </g>
      </svg>
      {t < 0 && (
        <TapHint
          key={`gate${step.current}`}
          {...worldHint(cameraPoint(box.current, WATER_WORLD, { x: cam.x, y: cam.y, w: VIEW_W, h: VIEW_H }), {
            x: gateX(s.basin),
            y: s.basin.y + GATE.wheelY,
            r: GATE.wheelR + 22,
          })}
          side="right"
        />
      )}
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

/** The sky with its sun and clouds, and soft far hills behind the near one; drawn once. */
const Sky = memo(function Sky({ gradient }: { gradient: string }) {
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
        [2500, 120, 0.8],
        [3700, 380, 1.1],
        [5000, 700, 0.9],
        [6300, 940, 1],
        [7700, 1260, 0.85],
        [9100, 1560, 1],
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
        [2400, 640, 900],
        [4100, 980, 900],
        [5800, 1260, 900],
        [7400, 1600, 950],
        [9000, 1900, 1000],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y + r * 0.55} rx={r} ry={r * 0.75} fill="#bfeaa0" />
      ))}
    </g>
  );
});

// Trees, bushes and flowers stand clear of the duck's way, the stork's flight and the geyser's throw.
const FLOWERS = [-260, -120, 1080, 1180, 2480, 2620, 3600, 3700, 4120, 7400, 9640, 9690];
const TREES = [-220, 3760, 9620];
const BUSHES = [2560, 3900, 7470, 9560];

/** The near hillside with its grass, trees, bushes and flowers; drawn once. */
const Hill = memo(function Hill() {
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
      {/* The stony cliffs the brook falls over and the slide goes down. */}
      <path d="M4180 1020 L4210 1130 L4185 1130 L4165 1030 Z" fill={STONE_DARK} />
      <path d="M6220 1250 L6300 1640 L6260 1640 L6190 1260 Z" fill={STONE_DARK} />
    </g>
  );
});

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

/* ---------- Ponds ---------- */

/** A wild pond's bank and its deep water, behind the duck: earth round the reed and turtle ponds, stone round the warm spring. */
const PondBack = memo(function PondBack({ pond: b, kind }: { pond: Basin; kind: "reeds" | "grass" | "stones" }) {
  const rim = kind === "stones" ? STONE : "#8d6e4a";
  const mid = (b.x0 + b.x1) / 2;
  return (
    <g>
      <path
        d={`M${b.x0 - 24} ${b.y - 20} Q${b.x0 - 10} ${b.y + b.depth + 20} ${mid} ${b.y + b.depth + 18} Q${b.x1 + 10} ${b.y + b.depth + 20} ${b.x1 + 24} ${b.y - 20} Z`}
        fill={rim}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d={`M${b.x0} ${b.y - 4} Q${b.x0 + 10} ${b.y + b.depth} ${mid} ${b.y + b.depth} Q${b.x1 - 10} ${b.y + b.depth} ${b.x1} ${b.y - 4} Z`}
        fill={kind === "stones" ? "#2fb5b0" : WATER_DEEP}
      />
    </g>
  );
});

/** A wild pond's water in front of the duck, and what rims it: tufts of grass, or the warm spring's round stones. */
const PondFront = memo(function PondFront({ pond: b }: { pond: Basin }) {
  const spring = b === HOT_SPRING;
  const w = b.x1 - b.x0;
  const shine = spring ? "#c8fff8" : "#bdeeff";
  return (
    <g>
      <path
        d={`M${b.x0} ${b.y + 3} H${b.x1} Q${b.x1 - 10} ${b.y + b.depth} ${(b.x0 + b.x1) / 2} ${b.y + b.depth} Q${b.x0 + 10} ${b.y + b.depth} ${b.x0} ${b.y + 3} Z`}
        fill={spring ? "#5fd6cf" : WATER}
      />
      <path d={`M${b.x0} ${b.y + 4} H${b.x1}`} stroke={shine} strokeWidth="5" />
      {[0.25, 0.55, 0.8].map((k) => (
        <path key={k} d={`M${b.x0 + w * k - 40} ${b.y + 40} q20 -10 40 0 t40 0`} fill="none" stroke={shine} strokeWidth="4" strokeLinecap="round" />
      ))}
      {spring
        ? Array.from({ length: 11 }, (_, i) => (
            <ellipse key={i} cx={b.x0 + (w * i) / 10} cy={b.y + b.depth + 8} rx="34" ry="20" fill={STONE} stroke={INK} strokeWidth="3" />
          ))
        : // The turtle's rock takes the far shore of its pond, so no grass there.
          [b.x0 - 14, ...(b === TURTLE_POND ? [] : [b.x1 + 14])].map((x) => (
            <path
              key={x}
              d={`M${x - 24} ${b.y - 4} l10 -34 l8 30 l8 -40 l8 40 l10 -30 l4 34 Z`}
              fill={GRASS_DARK}
              stroke={INK}
              strokeWidth="3"
              strokeLinejoin="round"
            />
          ))}
      {spring && [b.x0 - 14, b.x1 + 14].map((x) => <ellipse key={x} cx={x} cy={b.y - 4} rx="30" ry="22" fill={STONE} stroke={INK} strokeWidth="3" />)}
    </g>
  );
});

/** The reeds at the reed pond's end, swaying from their roots once the duck bumps in; every other one behind the duck, the rest before it. */
function Reeds({ sway, front }: { sway: number; front: boolean }) {
  const y = REED_POND.y + 4;
  return (
    <g>
      {REEDS.map((x, i) => {
        if (i % 2 === (front ? 1 : 0)) return null;
        const h = 190 + ((i * 47) % 60);
        return (
          <g key={x} transform={`rotate(${sway * (0.6 + (i % 3) * 0.25)} ${x} ${y})`}>
            <path d={`M${x} ${y} Q${x + 6} ${y - h / 2} ${x + 2} ${y - h}`} fill="none" stroke="#4f8f2f" strokeWidth="7" strokeLinecap="round" />
            <path d={`M${x} ${y} Q${x - 30} ${y - h / 3} ${x - 44} ${y - h / 2}`} fill="none" stroke="#6cbf43" strokeWidth="6" strokeLinecap="round" />
            <rect x={x - 9} y={y - h - 4} width="20" height="54" rx="10" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
          </g>
        );
      })}
    </g>
  );
}

/** The pole the stork's nest sits on, standing behind the second basin; drawn once. */
const NestPole = memo(function NestPole() {
  const { x, y } = STORK.nest;
  return <rect x={x - 11} y={y} width="22" height={groundY(x) - y + 10} rx="5" fill={WOOD_DARK} stroke={INK} strokeWidth="3" />;
});

/** The stork's nest of twigs on its pole: drawn in front of the stork, so it sits in it. */
const NestFront = memo(function NestFront() {
  const { x, y } = STORK.nest;
  return (
    <g strokeLinecap="round">
      <path d={`M${x - 78} ${y - 14} Q${x} ${y + 40} ${x + 78} ${y - 14} Z`} fill="#a77a45" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {[-60, -30, 0, 30, 60].map((dx, i) => (
        <line key={dx} x1={x + dx - 24} y1={y - 10 + (i % 2) * 12} x2={x + dx + 26} y2={y - 2 - (i % 2) * 10} stroke="#6e4a22" strokeWidth="5" />
      ))}
    </g>
  );
});

const STORK_RED = "#e8453c";

/** The white stork, facing right: standing on long red legs, bent down to the duck, flying with it in its beak, or sitting in its nest. */
function Stork({ body: b, head: h, tip, wing, legs }: StorkPose) {
  const shoulder = { x: b.x + 40, y: b.y - 14 };
  const angle = Math.atan2(tip.y - h.y, tip.x - h.x);
  const side = { x: -Math.sin(angle) * 6, y: Math.cos(angle) * 6 };
  const base = { x: h.x + Math.cos(angle) * 8, y: h.y + Math.sin(angle) * 8 };
  const feetY = REED_POND.y + 70;
  const neck = `M${shoulder.x} ${shoulder.y} Q${(shoulder.x + h.x) / 2 + 16} ${(shoulder.y + h.y) / 2} ${h.x} ${h.y}`;
  /** One wing, flapping from its root on the back: `w` 1 up, -1 down; its outer half black. */
  const wingPaths = (w: number, reach: number) => {
    const end = { x: b.x - 50, y: b.y - 12 - reach * w };
    return {
      white: `M${b.x + 26} ${b.y - 12} Q${b.x} ${end.y + (b.y - end.y) * 0.3} ${end.x} ${end.y} L${b.x - 46} ${b.y - 4} Z`,
      black: `M${b.x - 12} ${(b.y + end.y) / 2} L${end.x} ${end.y} L${b.x - 46} ${b.y - 4} Z`,
    };
  };
  const far = wing === null ? null : wingPaths(-wing * 0.8, 110);
  const near = wing === null ? null : wingPaths(wing, 140);
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {legs === "stand" &&
        [-14, 12].map((dx) => (
          <path
            key={dx}
            d={`M${b.x + dx * 0.5} ${b.y + 22} L${STORK.x + dx + 6} ${(b.y + feetY) / 2} L${STORK.x + dx} ${feetY}`}
            fill="none"
            stroke={STORK_RED}
            strokeWidth="7"
          />
        ))}
      {legs === "trail" &&
        [0, 12].map((dy) => (
          <path key={dy} d={`M${b.x - 20} ${b.y + 16 + dy / 2} L${b.x - 150} ${b.y + 34 + dy}`} fill="none" stroke={STORK_RED} strokeWidth="7" />
        ))}
      {far && (
        <g>
          <path d={far.white} fill="#e9edf0" stroke={INK} strokeWidth="3" />
          <path d={far.black} fill="#333" stroke={INK} strokeWidth="3" />
        </g>
      )}
      <path d={`M${b.x - 52} ${b.y - 6} L${b.x - 86} ${b.y + 4} L${b.x - 50} ${b.y + 14} Z`} fill="#fff" stroke={INK} strokeWidth="3" />
      <ellipse cx={b.x} cy={b.y} rx="60" ry="30" fill="#fff" stroke={INK} strokeWidth="4" />
      {wing === null && (
        <path
          d={`M${b.x + 30} ${b.y - 16} Q${b.x - 20} ${b.y - 30} ${b.x - 78} ${b.y + 6} Q${b.x - 20} ${b.y + 14} ${b.x + 30} ${b.y - 16} Z`}
          fill="#333"
          stroke={INK}
          strokeWidth="3"
        />
      )}
      <path d={neck} fill="none" stroke={INK} strokeWidth="22" />
      <path d={neck} fill="none" stroke="#fff" strokeWidth="15" />
      <path
        d={`M${base.x + side.x} ${base.y + side.y} L${tip.x} ${tip.y} L${base.x - side.x} ${base.y - side.y} Z`}
        fill={STORK_RED}
        stroke={INK}
        strokeWidth="3"
      />
      <circle cx={h.x} cy={h.y} r="15" fill="#fff" stroke={INK} strokeWidth="3.5" />
      <circle cx={h.x + 4} cy={h.y - 4} r="3.5" fill={INK} />
      {near && (
        <g>
          <path d={near.white} fill="#fff" stroke={INK} strokeWidth="3.5" />
          <path d={near.black} fill="#333" stroke={INK} strokeWidth="3" />
        </g>
      )}
    </g>
  );
}

/** The flat rock at the turtle pond's far shore, where the turtle climbs out; drawn once. */
const TurtleRock = memo(function TurtleRock() {
  const { x0, x1, y } = TURTLE.rock;
  return (
    <path
      d={`M${x0} ${y + 40} Q${x0 - 6} ${y + 2} ${x0 + 30} ${y} H${x1 - 30} Q${x1 + 6} ${y + 2} ${x1} ${y + 50} Z`}
      fill={STONE}
      stroke={INK}
      strokeWidth="4"
      strokeLinejoin="round"
    />
  );
});

/** The turtle, facing right, the top of its shell at `top`: its flippers swing while it swims, and it leans `tilt` degrees nose down. */
function Turtle({ top, tilt, paddle }: { top: Pt; tilt: number; paddle: number }) {
  const green = "#6fbf4a";
  return (
    <g transform={`translate(${top.x} ${top.y}) rotate(${tilt})`} strokeLinejoin="round">
      <ellipse cx="44" cy="46" rx="24" ry="9" transform={`rotate(${20 + 28 * paddle} 44 46)`} fill={green} stroke={INK} strokeWidth="3" />
      <ellipse cx="-50" cy="46" rx="19" ry="8" transform={`rotate(${-20 - 28 * paddle} -50 46)`} fill={green} stroke={INK} strokeWidth="3" />
      <path d="M60 30 Q80 14 92 24" fill="none" stroke={INK} strokeWidth="20" strokeLinecap="round" />
      <path d="M60 30 Q80 14 92 24" fill="none" stroke={green} strokeWidth="13" strokeLinecap="round" />
      <circle cx="94" cy="24" r="16" fill={green} stroke={INK} strokeWidth="3.5" />
      <circle cx="99" cy="19" r="3.5" fill={INK} />
      <path d="M96 30 Q102 33 108 28" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="-76" y="36" width="152" height="12" rx="6" fill="#e2cf8a" stroke={INK} strokeWidth="3" />
      <path d="M-72 40 C-72 -14 72 -14 72 40 Z" fill="#7a9e3a" stroke={INK} strokeWidth="4" />
      {[
        [-30, 18],
        [0, 8],
        [30, 18],
      ].map(([x, y]) => (
        <path key={x} d={`M${x - 14} ${y + 6} l7 -12 h14 l7 12 l-7 12 h-14 Z`} fill="#5a7f2a" stroke={INK} strokeWidth="2.5" />
      ))}
    </g>
  );
}

/** The geyser's column of water from the warm spring up to `top`, with foam running up it and a crown of drops. */
function GeyserColumn({ top, t }: { top: number | null; t: number }) {
  if (top === null || top > HOT_SPRING.y - 4) return null;
  const { x } = GEYSER;
  const base = HOT_SPRING.y + 10;
  const d = `M${x - 40} ${base} Q${x - 22} ${(base + top) / 2} ${x - 26} ${top} H${x + 26} Q${x + 22} ${(base + top) / 2} ${x + 40} ${base} Z`;
  return (
    <g>
      <path d={d} fill={WATER} stroke="#fff" strokeWidth="4" />
      <path d={`M${x - 6} ${base} V${top + 10}`} stroke={FOAM} strokeWidth="6" strokeDasharray="26 34" strokeDashoffset={t * 600} strokeLinecap="round" />
      <path d={`M${x + 12} ${base} V${top + 20}`} stroke={FOAM} strokeWidth="4" strokeDasharray="18 40" strokeDashoffset={t * 520} strokeLinecap="round" />
      {[-34, -12, 12, 34].map((dx, i) => (
        <circle key={dx} cx={x + dx} cy={top + 4 - 6 * Math.abs(Math.sin(t * 9 + i))} r={14 - Math.abs(dx) / 6} fill={WATER} stroke="#fff" strokeWidth="3" />
      ))}
    </g>
  );
}

/** Bubbles rising to the surface of a pond. */
function Bubbles({ bubbles }: { bubbles: Bubble[] }) {
  return (
    <g>
      {bubbles.map((b, i) => (
        <circle key={i} cx={b.pt.x} cy={b.pt.y} r={b.r} fill="#bdeeff" fillOpacity="0.6" stroke="#fff" strokeWidth="3" />
      ))}
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

/** A lock gate: a wooden board between two posts, lifted by the big red handwheel on the beam. */
function Gate({ basin: b, lift }: { basin: Basin; lift: number }) {
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

const FlumeFront = memo(function FlumeFront() {
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
});

/** The water wheel behind the waterfall: wooden rim, spokes and paddles, and four red pegs that knock the bell. */
function WaterWheel({ turned }: { turned: number }) {
  const { x, y, r, peg } = WHEEL;
  return (
    <g>
      <path
        d={`M${x} ${y} L${x - 70} ${REED_POND.y + 90} M${x} ${y} L${x + 70} ${REED_POND.y + 90}`}
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

const BrookFront = memo(function BrookFront() {
  const { from, to, depth } = BROOK;
  return (
    <g>
      <path d={`M${from.x} ${from.y + 3} L${to.x} ${to.y + 3} L${to.x} ${to.y + depth} L${from.x} ${from.y + depth} Z`} fill={WATER} />
      <path d={`M${from.x} ${from.y + depth} L${to.x} ${to.y + depth}`} stroke={GRASS_DARK} strokeWidth="6" />
      {[3720, 3980].map((x) => (
        <ellipse key={x} cx={x} cy={brookY(x) + depth + 6} rx="30" ry="14" fill={STONE} stroke={INK} strokeWidth="3" />
      ))}
    </g>
  );
});

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
const LilyPads = memo(function LilyPads() {
  const y = BASINS[2].y - 4;
  return (
    <g>
      {[FROG.pad, FROG.rest].map((x) => (
        <path key={x} d={`M${x} ${y} L${x + 54} ${y - 4} A54 12 0 1 1 ${x + 40} ${y + 8} Z`} fill="#3f9f3a" stroke={INK} strokeWidth="3" />
      ))}
    </g>
  );
});

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
const Tower = memo(function Tower() {
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
});

/** The twisty slide: a red chute under the duck's way, on posts, with water streaming down it while the gate is open. */
function Slide({ flow, t }: { flow: number; t: number }) {
  const chute = svgLine(SLIDE_LINE.map((p) => ({ x: p.x, y: p.y + 16 })));
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {[6280, 6620].map((x) => (
        <line key={x} x1={x} x2={x} y1={x < TOWER.x ? 1320 : 1630} y2={groundY(x)} stroke={WOOD_DARK} strokeWidth="12" />
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
const PoolBack = memo(function PoolBack() {
  return (
    <g>
      <ellipse cx={POOL_CX} cy={POOL.y} rx={POOL_RX + 22} ry={POOL.ry + 20} fill="#ff8fa3" stroke={INK} strokeWidth="4" />
      <ellipse cx={POOL_CX} cy={POOL.y + 2} rx={POOL_RX} ry={POOL.ry} fill={WATER} stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** The front half of the pool: its water in front of the ducks and the blow-up wall down to the lawn. */
const PoolFront = memo(function PoolFront() {
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
});

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
