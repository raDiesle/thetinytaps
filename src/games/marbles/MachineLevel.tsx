import { useId, useMemo } from "react";
import { wobble, VIEW_H, type LevelProps } from "./level";
import {
  BALL,
  BARS,
  BELL,
  BUCKET,
  BUTTON,
  buildMachine,
  CABLE,
  CAR,
  CROSSING_X,
  DOMINO,
  dominoLeft,
  FLOOR,
  FUNNEL,
  GATE,
  GIFT,
  HOPPER,
  JUMP,
  LOOP,
  PULLEYS,
  RAMP,
  rampY,
  SEESAW,
  STAIRS,
  TABLE,
  TRAIN,
  WORLD_W,
  type Machine,
} from "./machine";
import { beside, deg, seg } from "./machineKit";
import { MachineStage, TapHint } from "./MachineStage";
import { DARK_WOOD, Hopper, INK, MARBLE_COLOR, Picture, WallClock, Window, WOOD } from "./scenery";
import { BALL_R, type Pt } from "./track";
import { BAR_COLORS, Ball, Rail } from "./TrackLevel";

/**
 * Level 3: the big machine. One tap lets the marble go, and then one thing
 * sets off the next for about half a minute: xylophone, bell, funnel, ten
 * dominoes, a toy car through a loop onto a seesaw that flings a ball down the
 * stairs into a bucket, which pulls up a gate for the train, which presses
 * the button for the jack-in-the-box. The camera travels along with whatever
 * moves.
 */
export function MachineLevel(props: LevelProps) {
  const machine = useMemo(buildMachine, []);
  const ids = useId();

  return (
    <MachineStage machine={machine} label="Große Maschine" {...props}>
      {(t) => (
        <>
          <Room stripes={`${ids}-stripes`} />
          <Table />
          <XylophoneRamp machine={machine} t={t} />
          <FunnelBack />
          {Array.from({ length: DOMINO.n }, (_, i) => (
            <Domino key={i} i={i} angle={machine.dominoAngle(i, t)} />
          ))}
          <CarTrack machine={machine} />
          <Seesaw tilt={machine.tiltAt(t)} />
          <Stairs />
          <Pulley drop={machine.bucketDrop(t)} />
          <BucketBack drop={machine.bucketDrop(t)} />
          <Rails />
          <Crossing machine={machine} t={t} />
          <ButtonBox machine={machine} t={t} />
          <Jack age={t - machine.tPop} />
          <GiftBox age={t - machine.tPop} />

          <MovingThings machine={machine} t={t} />

          <Hopper x={HOPPER.x} y={HOPPER.y} />
          <Bell age={t - machine.tBell} />
          <FunnelFront />
          <BucketFront drop={machine.bucketDrop(t)} />
          <Gate lift={machine.bucketDrop(t)} />

          <TapHint t={t} x={HOPPER.x + 92} y={HOPPER.y + 96} />
        </>
      )}
    </MachineStage>
  );
}

function MovingThings({ machine, t }: { machine: Machine; t: number }) {
  const marble = machine.marbleAt(t);
  const car = machine.carAt(t);
  const ball = machine.ballAt(t);
  return (
    <g>
      <Ball color={MARBLE_COLOR} x={marble.pt.x} y={marble.pt.y} spin={marble.spin} />
      <g transform={`translate(${car.pt.x} ${car.pt.y}) rotate(${deg(car.angle)})`}>
        <Car turned={car.turned} />
      </g>
      <BeachBall at={ball.pt} squash={ball.squash} />
      <Smoke machine={machine} t={t} />
      <Train machine={machine} t={t} />
    </g>
  );
}

/* ---------- The room ---------- */

function Room({ stripes }: { stripes: string }) {
  return (
    <g>
      <defs>
        <pattern id={stripes} width="120" height="40" patternUnits="userSpaceOnUse">
          <rect width="120" height="40" fill="#fff1d0" />
          <rect width="44" height="40" fill="#ffe6b3" />
        </pattern>
      </defs>
      <rect x="-400" y="-200" width={WORLD_W + 800} height={FLOOR + 200} fill={`url(#${stripes})`} />
      <Window x={1460} />
      <Picture x={2420} y={110} />
      <Window x={3150} />
      <WallClock x={4330} y={230} />
      <Picture x={5300} y={110} />
      <Window x={5850} />
      {Array.from({ length: 13 }, (_, i) => {
        const x = 6060 + i * 64;
        return <path key={i} d={`M${x} 40 L${x + 64} 40 L${x + 32} 96 Z`} fill={BAR_COLORS[i % BAR_COLORS.length]} stroke={INK} strokeWidth="3" strokeLinejoin="round" />;
      })}
      <path d={`M6040 36 Q6480 60 6920 36`} stroke={INK} strokeWidth="4" fill="none" />
      <rect x="-400" y={FLOOR - 26} width={WORLD_W + 800} height="26" fill="#fff" stroke={INK} strokeWidth="3" />
      <rect x="-400" y={FLOOR} width={WORLD_W + 800} height={VIEW_H - FLOOR + 200} fill="#d9a066" />
      {Array.from({ length: 5 }, (_, i) => (
        <line key={i} x1="-400" y1={FLOOR + 22 + i * 26} x2={WORLD_W + 400} y2={FLOOR + 22 + i * 26} stroke="#c48a52" strokeWidth="3" />
      ))}
      <line x1="-400" y1={FLOOR} x2={WORLD_W + 400} y2={FLOOR} stroke={INK} strokeWidth="4" />
    </g>
  );
}

/* ---------- Marble, xylophone, bell and funnel ---------- */

function XylophoneRamp({ machine, t }: { machine: Machine; t: number }) {
  const slope = deg(Math.atan2(RAMP.to.y - RAMP.from.y, RAMP.to.x - RAMP.from.x));
  const first = BARS[0];
  const last = BARS[BARS.length - 1];
  return (
    <g>
      <Rail a={{ x: RAMP.from.x - 24, y: rampY(RAMP.from.x - 24) }} b={{ x: first.x - 4, y: rampY(first.x - 4) }} />
      <line
        x1={first.x - 6}
        y1={rampY(first.x) + BALL_R + 26}
        x2={last.x + last.w + 6}
        y2={rampY(last.x + last.w) + BALL_R + 26}
        stroke={DARK_WOOD}
        strokeWidth="8"
        strokeLinecap="round"
      />
      {BARS.map((bar, i) => {
        const age = t - machine.barTimes[i];
        const cx = bar.x + bar.w / 2;
        const dip = age >= 0 && age < 1 ? 5 * Math.exp(-age * 10) : 0;
        return (
          <g key={i} transform={`translate(${cx} ${rampY(cx) + BALL_R + 9 + dip}) rotate(${slope})`}>
            <rect x={-bar.w / 2} y={-9} width={bar.w} height={18} rx={6} fill={BAR_COLORS[i]} stroke={INK} strokeWidth="3" />
            <rect x={-bar.w / 2} y={-9} width={bar.w} height={18} rx={6} fill="#fff" opacity={age >= 0 && age < 1 ? 0.7 * Math.exp(-age * 6) : 0} />
            <circle cx={-bar.w / 2 + 10} cy="0" r="3" fill="#fff8" />
            <circle cx={bar.w / 2 - 10} cy="0" r="3" fill="#fff8" />
          </g>
        );
      })}
      <Rail a={{ x: last.x + last.w + 4, y: rampY(last.x + last.w + 4) }} b={RAMP.to} />
      {/* The bracket on the wall the bell hangs from */}
      <rect x={BELL.pivot.x - 16} y={BELL.pivot.y - 110} width="32" height="22" rx="5" fill="#b8763d" stroke={INK} strokeWidth="3" />
      <line x1={BELL.pivot.x} y1={BELL.pivot.y - 88} x2={BELL.pivot.x} y2={BELL.pivot.y} stroke={INK} strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

function Bell({ age }: { age: number }) {
  return (
    <g transform={`translate(${BELL.pivot.x} ${BELL.pivot.y}) rotate(${wobble(age, 24, 13, 2.2)}) scale(0.85)`}>
      <path d="M-4 0 L4 0 L5 12 C22 16 28 34 30 58 L34 64 L-34 64 L-30 58 C-28 34 -22 16 -5 12 Z" fill="#ffc93c" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M-18 28 C-16 22 -12 19 -8 18" stroke="#fff9" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="0" cy="70" r="7" fill="#c98a00" stroke={INK} strokeWidth="3" />
    </g>
  );
}

function FunnelBack() {
  const { cx, rimY, rx, ry } = FUNNEL;
  return (
    <g>
      <rect x={cx - rx - 48} y={rimY + 4} width="16" height={TABLE.y - rimY - 4} rx="5" fill="#b8763d" stroke={INK} strokeWidth="3" />
      <line x1={cx - rx - 40} y1={rimY + 12} x2={cx - rx + 4} y2={rimY + 4} stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <ellipse cx={cx} cy={rimY} rx={rx} ry={ry} fill="#1b8fc4" opacity="0.45" />
    </g>
  );
}

function FunnelFront() {
  const { cx, rimY, rx, ry, spoutY, spoutW } = FUNNEL;
  const half = spoutW / 2;
  return (
    <g>
      <path
        d={`M${cx - rx} ${rimY} A${rx} ${ry} 0 0 0 ${cx + rx} ${rimY} L${cx + half} ${spoutY - 24} L${cx + half} ${spoutY + 12} L${cx - half} ${spoutY + 12} L${cx - half} ${spoutY - 24} Z`}
        fill="#4cc9f0"
        opacity="0.38"
      />
      <path
        d={`M${cx - rx} ${rimY} L${cx - half} ${spoutY - 24} L${cx - half} ${spoutY + 12} L${cx + half} ${spoutY + 12} L${cx + half} ${spoutY - 24} L${cx + rx} ${rimY}`}
        fill="none"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <ellipse cx={cx} cy={rimY} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth="4" />
      <path d={`M${cx - rx + 28} ${rimY + 26} L${cx - half - 4} ${spoutY - 30}`} stroke="#fffa" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

/* ---------- Table and dominoes ---------- */

function Table() {
  const { x0, x1, y } = TABLE;
  return (
    <g>
      {[x0 + 30, (x0 + x1) / 2, x1 - 52].map((x) => (
        <rect key={x} x={x} y={y + 10} width="22" height={FLOOR - y - 10} fill="#b8763d" stroke={INK} strokeWidth="3" />
      ))}
      <rect x={x0} y={y} width={x1 - x0} height="22" rx="6" fill={WOOD} stroke={INK} strokeWidth="4" />
    </g>
  );
}

function Domino({ i, angle }: { i: number; angle: number }) {
  const { w, h } = DOMINO;
  return (
    <g transform={`translate(${dominoLeft(i) + w} ${TABLE.y}) rotate(${deg(angle)}) translate(${-w} 0)`}>
      <rect x="0" y={-h} width={w} height={h} rx="5" fill={BAR_COLORS[i % BAR_COLORS.length]} stroke={INK} strokeWidth="3" />
      <line x1="4" y1={-h / 2} x2={w - 4} y2={-h / 2} stroke={INK} strokeWidth="2.5" />
      <circle cx={w / 2} cy={-h * 0.76} r="4" fill="#fff" />
      <circle cx={w / 2} cy={-h * 0.24} r="4" fill="#fff" />
    </g>
  );
}

/* ---------- Car, loop and seesaw ---------- */

function CarTrack({ machine }: { machine: Machine }) {
  const { pts, s } = machine.carPath;
  const down = pts.filter((p, i) => p.x >= TABLE.x1 - 4 && s[i] <= machine.loopIn);
  const track = beside(down, 7)
    .map((p) => `${p.x} ${p.y}`)
    .join(" L");
  return (
    <g>
      {[2330, 2560].map((x) => {
        const y = TABLE.y + ((x - TABLE.x1) * (FLOOR - TABLE.y)) / (LOOP.cx - 220 - TABLE.x1) + 8;
        return <rect key={x} x={x} y={y} width="16" height={FLOOR - y} fill="#b8763d" stroke={INK} strokeWidth="3" />;
      })}
      <path d={`M${track}`} fill="none" stroke={INK} strokeWidth="20" strokeLinejoin="round" />
      <path d={`M${track}`} fill="none" stroke="#ff8c42" strokeWidth="13" strokeLinejoin="round" />
      <rect x={LOOP.cx - 60} y={FLOOR - 16} width="120" height="16" rx="5" fill={DARK_WOOD} stroke={INK} strokeWidth="3" />
      <circle cx={LOOP.cx} cy={LOOP.cy} r={LOOP.r + 7} fill="none" stroke={INK} strokeWidth="20" />
      <circle cx={LOOP.cx} cy={LOOP.cy} r={LOOP.r + 7} fill="none" stroke="#ff8c42" strokeWidth="13" />
      <path d={`M${JUMP.x0} ${FLOOR} L${JUMP.x1} ${JUMP.top} L${JUMP.x1} ${FLOOR} Z`} fill="#ffb703" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d={`M${JUMP.x1 - 50} ${FLOOR - 6} L${JUMP.x1 - 50} ${FLOOR - 32} M${JUMP.x1 - 22} ${FLOOR - 6} L${JUMP.x1 - 22} ${FLOOR - 42}`} stroke="#ff5d73" strokeWidth="8" strokeLinecap="round" />
    </g>
  );
}

/** A red toy car, drawn standing on its wheels with the middle between them at (0, 0), facing right. */
function Car({ turned }: { turned: number }) {
  const r = CAR.wheelR;
  const wheel = (x: number) => (
    <g transform={`translate(${x} ${-r}) rotate(${deg(turned / r)})`}>
      <circle r={r} fill="#3b3b4f" stroke={INK} strokeWidth="3" />
      <circle r="7" fill="#e8e8f0" />
      <line x1={-r + 4} y1="0" x2={r - 4} y2="0" stroke="#e8e8f0" strokeWidth="3" />
    </g>
  );
  return (
    <g>
      <path
        d="M-75 -22 L-75 -52 Q-75 -60 -66 -61 L-44 -63 L-30 -92 Q-26 -98 -18 -98 L24 -98 Q32 -98 36 -92 L52 -63 L68 -60 Q78 -58 78 -48 L78 -22 Z"
        fill="#ff5d73"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M-34 -66 L-23 -89 L-2 -89 L-2 -66 Z" fill="#bde9ff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M5 -66 L5 -89 L25 -89 L40 -66 Z" fill="#bde9ff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {/* A teddy at the wheel */}
      <circle cx="16" cy="-74" r="9" fill="#c98a4b" stroke={INK} strokeWidth="2" />
      <circle cx="11" cy="-83" r="3.5" fill="#c98a4b" stroke={INK} strokeWidth="1.5" />
      <circle cx="19" cy="-76" r="1.8" fill={INK} />
      <circle cx="71" cy="-47" r="6" fill="#ffd23f" stroke={INK} strokeWidth="2" />
      <rect x="-60" y="-50" width="24" height="6" rx="3" fill="#fff8" />
      {wheel(-46)}
      {wheel(46)}
    </g>
  );
}

function Seesaw({ tilt }: { tilt: number }) {
  const { cx, cy, half } = SEESAW;
  return (
    <g>
      <path d={`M${cx} ${cy} L${cx - 44} ${FLOOR} L${cx + 44} ${FLOOR} Z`} fill={DARK_WOOD} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <g transform={`translate(${cx} ${cy}) rotate(${tilt})`}>
        <rect x={-half} y="-7" width={half * 2} height="14" rx="7" fill="#ffb703" stroke={INK} strokeWidth="3" />
      </g>
      <circle cx={cx} cy={cy} r="7" fill={INK} />
    </g>
  );
}

/* ---------- Ball, stairs and bucket ---------- */

function BeachBall({ at, squash }: { at: Pt; squash: number }) {
  const r = BALL.r;
  const colors = ["#ff5d73", "#fff", "#3a86ff", "#fff", "#ffb703", "#fff"];
  return (
    <g transform={`translate(${at.x} ${at.y + r}) scale(${1 + squash} ${1 - squash}) translate(0 ${-r})`}>
      <g transform={`rotate(${deg(at.x / r)})`}>
        {colors.map((c, i) => {
          const a0 = (i * Math.PI) / 3;
          const a1 = ((i + 1) * Math.PI) / 3;
          return <path key={i} d={`M0 0 L${r * Math.cos(a0)} ${r * Math.sin(a0)} A${r} ${r} 0 0 1 ${r * Math.cos(a1)} ${r * Math.sin(a1)} Z`} fill={c} />;
        })}
        <circle r="6" fill="#fff" stroke={INK} strokeWidth="2" />
      </g>
      <circle r={r} fill="none" stroke={INK} strokeWidth="3" />
      <circle cx="-10" cy="-12" r="6" fill="#fff" opacity="0.8" />
    </g>
  );
}

function Stairs() {
  const { x0, w, top0, rise, n } = STAIRS;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const top = top0 + i * rise;
        const color = BAR_COLORS[(i * 2 + 1) % BAR_COLORS.length];
        return (
          <g key={i}>
            {Array.from({ length: Math.ceil((FLOOR - top) / 80) }, (_, k) => {
              const y = top + k * 80;
              return <rect key={k} x={x0 + i * w} y={y} width={w} height={Math.min(80, FLOOR - y)} rx="6" fill={color} stroke={INK} strokeWidth="3" />;
            })}
            <circle cx={x0 + i * w + w / 2} cy={top + 40} r="14" fill="#fff6" />
          </g>
        );
      })}
    </g>
  );
}

/** The rope runs up from the bucket, over two pulleys and down to the gate. */
function Pulley({ drop }: { drop: number }) {
  const { a, b, r } = PULLEYS;
  const handle = BUCKET.rimY - 35 + drop;
  const gateTop = FLOOR - GATE.h - drop;
  return (
    <g>
      <path
        d={`M${a.x - r} ${handle} L${a.x - r} ${a.y} M${a.x} ${a.y - r} L${b.x} ${b.y - r} M${b.x + r} ${b.y} L${b.x + r} ${gateTop}`}
        stroke="#8a6a4a"
        strokeWidth="5"
        fill="none"
      />
      {[a, b].map((p) => (
        <g key={p.x} transform={`translate(${p.x} ${p.y})`}>
          <line x1="0" y1="0" x2="0" y2={-p.y - 10} stroke={INK} strokeWidth="6" />
          <g transform={`rotate(${(-drop / r) * (180 / Math.PI)})`}>
            <circle r={r} fill="#ffb703" stroke={INK} strokeWidth="3" />
            <line x1={-r + 5} y1="0" x2={r - 5} y2="0" stroke={INK} strokeWidth="3" />
            <line x1="0" y1={-r + 5} x2="0" y2={r - 5} stroke={INK} strokeWidth="3" />
          </g>
          <circle r="5" fill={INK} />
        </g>
      ))}
    </g>
  );
}

function BucketBack({ drop }: { drop: number }) {
  const { cx, rimY, top } = BUCKET;
  return <ellipse cx={cx} cy={rimY + drop} rx={top / 2} ry="12" fill="#1e6fb8" stroke={INK} strokeWidth="3" />;
}

function BucketFront({ drop }: { drop: number }) {
  const { cx, h, top, bottom } = BUCKET;
  const rim = BUCKET.rimY + drop;
  return (
    <g>
      <path d={`M${cx - top / 2} ${rim} Q${cx} ${rim - 72} ${cx + top / 2} ${rim}`} fill="none" stroke={INK} strokeWidth="4" />
      <path
        d={`M${cx - top / 2} ${rim} A${top / 2} 12 0 0 0 ${cx + top / 2} ${rim} L${cx + bottom / 2} ${rim + h} L${cx - bottom / 2} ${rim + h} Z`}
        fill="#3a86ff"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${cx - top / 2 + 16} ${rim + 22} L${cx - bottom / 2 + 12} ${rim + h - 14}`} stroke="#fff8" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

/* ---------- Gate, train, crossing ---------- */

function Gate({ lift }: { lift: number }) {
  const top = FLOOR - GATE.h - lift;
  return (
    <g>
      {[GATE.x - 14, GATE.x + GATE.w + 4].map((x) => (
        <rect key={x} x={x} y={FLOOR - 230} width="10" height="230" rx="3" fill={DARK_WOOD} stroke={INK} strokeWidth="2.5" />
      ))}
      <rect x={GATE.x} y={top} width={GATE.w} height={GATE.h} rx="5" fill="#fff" stroke={INK} strokeWidth="3" />
      {[0, 1, 2].map((k) => (
        <rect key={k} x={GATE.x + 3} y={top + 12 + k * 50} width={GATE.w - 6} height="24" fill="#ff5d73" />
      ))}
    </g>
  );
}

function Rails() {
  const x0 = TRAIN.front0 - 360;
  const x1 = BUTTON.x;
  return (
    <g>
      {Array.from({ length: Math.floor((x1 - x0) / 36) }, (_, i) => (
        <rect key={i} x={x0 + i * 36} y={FLOOR - 4} width="22" height="10" rx="2" fill={DARK_WOOD} />
      ))}
      <rect x={x0} y={FLOOR - 8} width={x1 - x0} height="6" rx="3" fill="#7d7d96" stroke={INK} strokeWidth="1.5" />
    </g>
  );
}

const TRAIN_FLOOR = FLOOR - 7;

function Train({ machine, t }: { machine: Machine; t: number }) {
  const front = machine.trainFront(t);
  const turned = deg((front - TRAIN.front0) / 15);
  const wheel = (x: number, r: number) => (
    <g key={x} transform={`translate(${x} ${-r}) rotate(${turned * (15 / r)})`}>
      <circle r={r} fill="#ff5d73" stroke={INK} strokeWidth="3" />
      <line x1={-r + 3} y1="0" x2={r - 3} y2="0" stroke={INK} strokeWidth="2.5" />
      <line x1="0" y1={-r + 3} x2="0" y2={r - 3} stroke={INK} strokeWidth="2.5" />
    </g>
  );
  const wagonRight = -TRAIN.loco - TRAIN.gap;
  return (
    <g transform={`translate(${front} ${TRAIN_FLOOR})`}>
      {/* Wagon with blocks */}
      <g transform={`translate(${wagonRight} 0)`}>
        <line x1="0" y1="-30" x2={TRAIN.gap} y2="-30" stroke={INK} strokeWidth="5" />
        {["#ffb703", "#8e7dff", "#00b4d8"].map((c, i) => (
          <rect key={c} x={-110 + i * 34} y={-98 + (i % 2) * 8} width="30" height="30" rx="4" fill={c} stroke={INK} strokeWidth="2.5" />
        ))}
        <rect x={-TRAIN.wagon} y="-70" width={TRAIN.wagon} height="46" rx="6" fill="#3ec300" stroke={INK} strokeWidth="3" />
        {wheel(-92, 14)}
        {wheel(-28, 14)}
      </g>
      {/* Locomotive */}
      <rect x="-50" y="-116" width="22" height="34" fill={INK} />
      <rect x="-56" y="-120" width="34" height="10" rx="3" fill={INK} />
      <rect x="-112" y="-86" width="108" height="52" rx="22" fill="#3a86ff" stroke={INK} strokeWidth="3" />
      <circle cx="-80" cy="-88" r="10" fill="#ffb703" stroke={INK} strokeWidth="2.5" />
      <rect x="-166" y="-120" width="68" height="12" rx="4" fill={INK} />
      <rect x="-160" y="-110" width="56" height="78" rx="6" fill="#ff5d73" stroke={INK} strokeWidth="3" />
      <rect x="-150" y="-100" width="36" height="28" rx="4" fill="#bde9ff" stroke={INK} strokeWidth="2.5" />
      <circle cx="-130" cy="-84" r="9" fill="#c98a4b" stroke={INK} strokeWidth="2" />
      <circle cx="-136" cy="-93" r="3.5" fill="#c98a4b" stroke={INK} strokeWidth="1.5" />
      <circle cx="-126" cy="-86" r="1.8" fill={INK} />
      <rect x="-164" y="-38" width="164" height="14" rx="4" fill={INK} />
      <path d="M0 -38 L14 -8 L0 -8 Z" fill="#ffb703" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="-8" cy="-62" r="7" fill="#ffd23f" stroke={INK} strokeWidth="2" />
      {wheel(-134, 20)}
      {wheel(-78, 15)}
      {wheel(-36, 15)}
    </g>
  );
}

/** Puffs of steam, one every third of a second while the train runs, rising and fading. */
function Smoke({ machine, t }: { machine: Machine; t: number }) {
  const puffs = [];
  const life = 1.6;
  for (let te = machine.tTrain; te <= Math.min(t, machine.tButton); te += 0.32) {
    const age = t - te;
    if (age > life) continue;
    const x = machine.trainFront(te) - 39 - 34 * age;
    const y = TRAIN_FLOOR - 124 - 80 * age;
    puffs.push(<circle key={te} cx={x} cy={y} r={10 + 20 * age} fill="#f4f5fb" stroke="#b9bdd6" strokeWidth="3" opacity={0.9 * (1 - age / life)} />);
  }
  return <g>{puffs}</g>;
}

function Crossing({ machine, t }: { machine: Machine; t: number }) {
  const front = machine.trainFront(t);
  const near = front > CROSSING_X - 420 && front - TRAIN.loco - TRAIN.gap - TRAIN.wagon < CROSSING_X + 80;
  const blink = Math.floor(t * 3) % 2;
  const cross = (turn: number) => (
    <g transform={`rotate(${turn})`}>
      <rect x="-62" y="-9" width="124" height="18" rx="3" fill="#fff" stroke={INK} strokeWidth="3" />
      <rect x="-40" y="-9" width="20" height="18" fill="#ff5d73" />
      <rect x="20" y="-9" width="20" height="18" fill="#ff5d73" />
    </g>
  );
  return (
    <g>
      <rect x={CROSSING_X - 7} y="540" width="14" height={FLOOR - 540} fill="#fff" stroke={INK} strokeWidth="3" />
      <g transform={`translate(${CROSSING_X} 560)`}>
        {cross(35)}
        {cross(-35)}
      </g>
      <rect x={CROSSING_X - 46} y="626" width="92" height="38" rx="19" fill={INK} />
      {[-1, 1].map((side) => (
        <circle
          key={side}
          cx={CROSSING_X + side * 23}
          cy="645"
          r="13"
          fill={near && (side < 0) === (blink === 0) ? "#ff3b3b" : "#7a2a3a"}
          stroke={near && (side < 0) === (blink === 0) ? "#ffd0d0" : "none"}
          strokeWidth="3"
        />
      ))}
    </g>
  );
}

/* ---------- Finale ---------- */

function ButtonBox({ machine, t }: { machine: Machine; t: number }) {
  const knobX = BUTTON.x - BUTTON.knob;
  const press = Math.min(BUTTON.press, Math.max(0, machine.trainFront(t) - knobX));
  const top = FLOOR - BUTTON.h;
  const k = seg(t, machine.tButton, machine.tPop);
  const spark = CABLE[Math.round(k * (CABLE.length - 1))];
  return (
    <g>
      <path d={`M${CABLE.map((p) => `${p.x} ${p.y}`).join(" L")}`} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <rect x={knobX + press} y={top + 28} width={BUTTON.knob + 6} height="36" rx="8" fill="#ff3b3b" stroke={INK} strokeWidth="3" />
      <rect x={BUTTON.x} y={top} width={BUTTON.w} height={BUTTON.h} rx="8" fill="#8e7dff" stroke={INK} strokeWidth="4" />
      <circle cx={BUTTON.x + BUTTON.w / 2} cy={top + 30} r="9" fill={press >= BUTTON.press ? "#3ec300" : "#5a4ab0"} stroke={INK} strokeWidth="2" />
      {k > 0 && k < 1 && (
        <g transform={`translate(${spark.x} ${spark.y}) rotate(${t * 500})`}>
          <path d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" fill="#ffd23f" stroke="#ff8c42" strokeWidth="2" />
        </g>
      )}
    </g>
  );
}

/** The jack-in-the-box springs up out of the gift box, `age` seconds after it pops. */
function Jack({ age }: { age: number }) {
  if (age < 0) return null;
  const cx = GIFT.x + GIFT.w / 2;
  const top = FLOOR - GIFT.h;
  const rise = 250 * (1 - Math.exp(-age * 5) * Math.cos(age * 11));
  const head = top + 70 - rise;
  const coils = 9;
  const spring = Array.from({ length: coils * 2 + 1 }, (_, i) => {
    const y = top + 120 + ((head + 40 - top - 120) * i) / (coils * 2);
    return `${i === 0 || i === coils * 2 ? cx : cx + (i % 2 ? -22 : 22)} ${y}`;
  }).join(" L");
  const sway = wobble(age - 0.4, 14, 7, 1.2);
  return (
    <g>
      <path d={`M${spring}`} fill="none" stroke="#7d7d96" strokeWidth="7" strokeLinejoin="round" />
      <g transform={`translate(${cx} ${head}) rotate(${sway}) scale(1.2)`}>
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} cx={34 * Math.cos((i * Math.PI) / 4)} cy={40 + 10 * Math.sin((i * Math.PI) / 4)} rx="20" ry="11" fill={BAR_COLORS[i]} stroke={INK} strokeWidth="2" />
        ))}
        <circle r="48" fill="#ffe0bd" stroke={INK} strokeWidth="3.5" />
        <circle cx="-30" cy="12" r="10" fill="#ff9bb5" />
        <circle cx="30" cy="12" r="10" fill="#ff9bb5" />
        <circle cx="-16" cy="-6" r="6" fill={INK} />
        <circle cx="16" cy="-6" r="6" fill={INK} />
        <circle cx="0" cy="8" r="9" fill="#ff3b3b" stroke={INK} strokeWidth="2" />
        <path d="M-22 20 Q0 42 22 20" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M-40 -30 L0 -104 L40 -30 Z" fill="#8e7dff" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <circle cx="-8" cy="-60" r="6" fill="#ffd23f" />
        <circle cx="12" cy="-44" r="6" fill="#ffd23f" />
        <circle cy="-108" r="12" fill="#ff5d73" stroke={INK} strokeWidth="3" />
      </g>
    </g>
  );
}

/** The gift box; its lid flies off when the jack pops out. */
function GiftBox({ age }: { age: number }) {
  const { x, w, h } = GIFT;
  const top = FLOOR - h;
  // Up and over to the right, turning once, onto the floor.
  const k = seg(age, 0, 0.9);
  const fly = { x: 170 * k, y: (FLOOR - 17 - (top - 13)) * k - 1040 * k * (1 - k) };
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} rx="8" fill="#ff7bd0" stroke={INK} strokeWidth="4" />
      <rect x={x + w / 2 - 18} y={top} width="36" height={h} fill="#ffd23f" stroke={INK} strokeWidth="3" />
      {[0.2, 0.8].map((f) => (
        <circle key={f} cx={x + w * f} cy={top + h / 2} r="14" fill="#fff8" />
      ))}
      <g transform={`translate(${x + w / 2 + fly.x} ${top - 13 + fly.y}) rotate(${360 * k})`}>
        <rect x={-w / 2 - 12} y="-17" width={w + 24} height="34" rx="7" fill="#ff5d73" stroke={INK} strokeWidth="4" />
        <rect x="-18" y="-17" width="36" height="34" fill="#ffd23f" stroke={INK} strokeWidth="3" />
        <path d="M0 -17 C-30 -60 -60 -20 0 -17 C60 -20 30 -60 0 -17 Z" fill="#ffd23f" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      </g>
    </g>
  );
}
