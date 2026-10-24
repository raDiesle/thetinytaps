import { useId, useMemo } from "react";
import { wobble, VIEW_H, type LevelProps } from "./level";
import {
  APPLE,
  ARM,
  BARROW,
  BED,
  BIRDHOUSE,
  branchY,
  buildGarden,
  CAN,
  CAN_CUP,
  CAN_ROSE,
  CHIMES,
  CROQUET,
  CUP,
  FENCE_TOP,
  FLOOR,
  GROUND,
  GUTTER,
  gutterY,
  HOOP,
  HOSE,
  LOW_BRANCH,
  RAKE,
  RAKE_PIVOT,
  SHED,
  SLIDE,
  SLIDE_LINE,
  SPRINKLER,
  SUN,
  TAP,
  TERRACE,
  TREE,
  WATERWHEEL,
  WORLD_W,
  type Garden,
} from "./garden";
import { beside, deg, seg, svgLine } from "./machineKit";
import { MachineStage, TapHint } from "./MachineStage";
import { DARK_WOOD, INK, MARBLE_COLOR, MID_WOOD, Sparkles, WOOD } from "./scenery";
import { BALL_R, type Pt } from "./path";
import { BAR_COLORS, Ball } from "./parts";

const LAWN = "#7fd34e";
const LEAF = "#4caf50";
const LEAF_LIGHT = "#6cc95a";
const BARK = "#a0673a";
const ZINC = "#c3cfdf";
const WATER = "#6fd3ff";

/**
 * Level 5: the garden. One tap lets the marble roll out of the birdhouse, and
 * then one thing sets off the next for about half a minute: wind chimes, a
 * watering can that tips onto a water wheel, whose arm pushes a wheelbarrow
 * down the bank onto a rake, whose handle shakes the apple tree; the apple
 * rolls down the slide into a croquet ball, which opens the garden tap, and
 * the sprinkler waters the sunflower until it blooms. The camera travels along
 * with whatever moves.
 */
export function GardenLevel(props: LevelProps) {
  const garden = useMemo(buildGarden, []);
  const ids = useId();

  return (
    <MachineStage machine={garden} label="Im Garten" {...props}>
      {(t) => (
        <>
          <Sky gradient={`${ids}-sky`} />
          <Fence />
          <OldTree />
          <Chimes garden={garden} t={t} />
          <AppleTree sway={garden.swayAt(t)} />
          <FallingLeaves age={t - garden.tStop} />
          <Shed />
          <Lawn />
          <Snail t={t} />
          <Birdhouse garden={garden} t={t} />
          <GutterBack />
          <CanStick />
          <WaterWheel turned={garden.wheelAt(t)} />
          <Slide />
          <HoopBack />
          <FlowerBed />
          <Sunflower garden={garden} t={t} />
          <Hedgehog garden={garden} t={t} />
          <Hose fill={garden.hoseAt(t)} t={t} />
          <Sprinkler spin={garden.spinAt(t)} />
          <Tap angle={garden.leverAt(t)} />

          <MovingThings garden={garden} t={t} />

          <GutterFront />
          <Downpipe />
          <WateringCan tilt={garden.tiltAt(t)} />
          <Pour garden={garden} t={t} />
          <HoopFront />
          <Spray drops={garden.sprayAt(t)} />
          <Birds garden={garden} t={t} />
          <Butterfly garden={garden} t={t} />
          <Sparkles x={SUN.x} y={SUN.headY} age={t - garden.tBloom} n={12} spread={240} />

          <TapHint t={t} x={BIRDHOUSE.x + 92} y={BIRDHOUSE.doorY + 96} />
        </>
      )}
    </MachineStage>
  );
}

function MovingThings({ garden, t }: { garden: Garden; t: number }) {
  const marble = garden.marbleAt(t);
  const barrow = garden.barrowAt(t);
  const apple = garden.appleAt(t);
  const ball = garden.ballAt(t);
  return (
    <g>
      <Ball color={MARBLE_COLOR} x={marble.pt.x} y={marble.pt.y} spin={marble.spin} />
      <Rake angle={garden.rakeAt(t)} />
      <g transform={`translate(${barrow.pt.x} ${barrow.pt.y}) rotate(${deg(barrow.angle)})`}>
        <Wheelbarrow turned={barrow.turned} />
      </g>
      <Apple at={apple.pt} spin={apple.spin} hanging={apple.hanging} sway={garden.swayAt(t)} />
      <CroquetBall at={ball.pt} spin={ball.spin} />
    </g>
  );
}

/* ---------- Sky, fence and lawn ---------- */

function Sky({ gradient }: { gradient: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd5ff" />
          <stop offset="1" stopColor="#dff5ff" />
        </linearGradient>
      </defs>
      <rect x="-400" y="-200" width={WORLD_W + 800} height={FLOOR + 200} fill={`url(#${gradient})`} />
      <g transform="translate(1300 130)">
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1="0" y1="-74" x2="0" y2="-96" transform={`rotate(${i * 36})`} stroke="#ffd23f" strokeWidth="8" strokeLinecap="round" />
        ))}
        <circle r="58" fill="#ffd23f" stroke="#ffb703" strokeWidth="6" />
      </g>
      {[
        [1750, 150, 1],
        [2650, 100, 0.8],
        [3350, 190, 1.1],
        [4250, 110, 0.9],
        [5050, 200, 1],
      ].map(([x, y, s]) => (
        <Cloud key={x} x={x} y={y} s={s} />
      ))}
      {/* Far bushes behind the fence */}
      {Array.from({ length: Math.ceil((WORLD_W + 800) / 180) }, (_, i) => (
        <circle key={i} cx={-400 + i * 180 + (i % 3) * 30} cy={FENCE_TOP + 20 + (i % 2) * 14} r={90 + (i % 3) * 16} fill="#a7dd84" />
      ))}
    </g>
  );
}

function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M-90 30 Q-110 0 -70 -6 Q-60 -44 -16 -34 Q10 -66 50 -36 Q96 -40 92 0 Q120 20 90 30 Z"
      fill="#fff"
      stroke="#d6ecfa"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  );
}

/** A white picket fence all along the back of the garden. */
function Fence() {
  const n = Math.ceil((WORLD_W + 800) / 46);
  return (
    <g>
      {[FENCE_TOP + 34, FENCE_TOP + 112].map((y) => (
        <rect key={y} x="-400" y={y} width={WORLD_W + 800} height="14" fill="#fff4dc" stroke={INK} strokeWidth="3" />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const x = -400 + i * 46;
        return <path key={i} d={`M${x} ${FLOOR} L${x} ${FENCE_TOP + 14} L${x + 17} ${FENCE_TOP} L${x + 34} ${FENCE_TOP + 14} L${x + 34} ${FLOOR} Z`} fill="#fffaf0" stroke={INK} strokeWidth="3" strokeLinejoin="round" />;
      })}
    </g>
  );
}

/** The lawn: the raised part on the left, the bank, and the rest of the garden. */
function Lawn() {
  return (
    <g>
      <path d={`${svgLine(GROUND)} L${WORLD_W + 400} ${VIEW_H + 200} L-400 ${VIEW_H + 200} Z`} fill={LAWN} />
      <path d={svgLine(GROUND)} fill="none" stroke="#3e9a2e" strokeWidth="5" />
      {Array.from({ length: Math.ceil(WORLD_W / 130) }, (_, i) => {
        const x = 40 + i * 130 + (i % 4) * 17;
        const y = (x < TERRACE.edge ? TERRACE.y : FLOOR) + 40 + (i % 3) * 22;
        return <path key={i} d={`M${x} ${y} q5 -18 10 0 q4 -14 9 0 q5 -16 10 0`} fill="none" stroke="#4fb23a" strokeWidth="4" strokeLinecap="round" />;
      })}
    </g>
  );
}

/** A little snail creeping along the raised lawn, very slowly. */
function Snail({ t }: { t: number }) {
  const x = 520 + 4 * Math.max(0, t);
  return (
    <g transform={`translate(${x} ${TERRACE.y})`}>
      <path d="M-30 0 Q-34 -12 -20 -12 L22 -12 Q34 -12 34 0 Z" fill="#ffd9a8" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <line x1="26" y1="-12" x2="32" y2="-30" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="-12" x2="22" y2="-28" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="-31" r="3.5" fill={INK} />
      <circle cx="22" cy="-29" r="3.5" fill={INK} />
      <circle cx="-4" cy="-26" r="20" fill="#ff8c42" stroke={INK} strokeWidth="3" />
      <path d="M-4 -26 m-12 0 a12 12 0 1 1 12 12 a7 7 0 1 1 -6 -8" fill="none" stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/* ---------- Birdhouse, chimes and gutter ---------- */

/** The old tree at the left edge, whose long branch reaches out over the gutter. */
function OldTree() {
  const branch = Array.from({ length: 9 }, (_, i) => {
    const x = 90 + i * 96;
    return { x, y: branchY(x) + (i % 2 ? -3 : 3) };
  });
  return (
    <g>
      <path d={`M10 ${TERRACE.y} Q26 400 30 20 L92 20 Q96 400 112 ${TERRACE.y} Z`} fill={BARK} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M50 600 q8 -30 0 -60 M70 380 q-8 -40 0 -70" fill="none" stroke="#7a4a26" strokeWidth="4" strokeLinecap="round" />
      <path d={svgLine(branch)} fill="none" stroke={INK} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
      <path d={svgLine(branch)} fill="none" stroke={BARK} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      {[300, 520, 700, 860].map((x, i) => (
        <ellipse key={x} cx={x} cy={branchY(x) - 12} rx="30" ry="14" transform={`rotate(${i % 2 ? 20 : -20} ${x} ${branchY(x) - 12})`} fill={LEAF_LIGHT} stroke={INK} strokeWidth="3" />
      ))}
      {[
        [40, -20, 160],
        [-90, 110, 120],
        [170, 10, 90],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} fill={LEAF} stroke={INK} strokeWidth="4" />
      ))}
      <circle cx="80" cy="-40" r="60" fill={LEAF_LIGHT} />
    </g>
  );
}

/** The wind chime tubes on strings, each swinging when the marble brushes its end. */
function Chimes({ garden, t }: { garden: Garden; t: number }) {
  return (
    <g>
      {CHIMES.map((c, i) => {
        const top = branchY(c.x);
        const swing = -wobble(t - garden.chimeTimes[i], 12, 9, 1.6);
        return (
          <g key={c.x} transform={`rotate(${swing} ${c.x} ${top})`}>
            <line x1={c.x} y1={top} x2={c.x} y2={c.top} stroke={INK} strokeWidth="3" />
            <rect x={c.x - 10} y={c.top} width="20" height={c.bottom - c.top} rx="6" fill={BAR_COLORS[(i * 2 + 1) % BAR_COLORS.length]} stroke={INK} strokeWidth="3" />
            <line x1={c.x - 3} y1={c.top + 8} x2={c.x - 3} y2={c.bottom - 10} stroke="#fff9" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

/** The birdhouse on its pole; after the marble has left, the bird looks out of the door. */
function Birdhouse({ garden, t }: { garden: Garden; t: number }) {
  const { x, doorY } = BIRDHOUSE;
  const peek = seg(t, garden.tMarble + 0.4, garden.tMarble + 0.8);
  return (
    <g>
      <rect x={x - 9} y="130" width="18" height={TERRACE.y - 130} rx="4" fill={DARK_WOOD} stroke={INK} strokeWidth="3" />
      <rect x={x - 55} y="40" width="110" height="98" rx="8" fill="#ffb703" stroke={INK} strokeWidth="4" />
      <path d={`M${x - 74} 52 L${x} -8 L${x + 74} 52 Z`} fill="#ff5d73" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <circle cx={x} cy={doorY} r="25" fill="#4a2f1a" stroke={INK} strokeWidth="3" />
      {peek > 0 && (
        <g transform={`translate(${x} ${doorY + 14 - 12 * peek})`}>
          <circle r="17" fill="#3a86ff" stroke={INK} strokeWidth="3" />
          <circle cx="-6" cy="-4" r="3.5" fill={INK} />
          <circle cx="6" cy="-4" r="3.5" fill={INK} />
          <path d="M-6 4 L0 12 L6 4 Z" fill="#ffb703" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        </g>
      )}
      <circle cx={x + 30} cy="62" r="8" fill="#fff8" />
    </g>
  );
}

const GUTTER_X0 = GUTTER.from.x - 22;
const gutterBand = (x0: number, x1: number, top: number, bottom: number) =>
  `M${x0} ${gutterY(x0) + top} L${x1} ${gutterY(x1) + top} L${x1} ${gutterY(x1) + bottom} L${x0} ${gutterY(x0) + bottom} Z`;

/** The inside of the gutter, behind the marble, and the posts holding it up. */
function GutterBack() {
  return (
    <g>
      {[330, 660].map((x) => (
        <g key={x}>
          <rect x={x - 8} y={gutterY(x) + BALL_R} width="16" height={TERRACE.y - gutterY(x) - BALL_R} rx="4" fill={MID_WOOD} stroke={INK} strokeWidth="3" />
          <rect x={x - 16} y={gutterY(x) + BALL_R + 4} width="32" height="10" rx="4" fill={DARK_WOOD} stroke={INK} strokeWidth="2.5" />
        </g>
      ))}
      <path d={gutterBand(GUTTER_X0, GUTTER.to.x, -8, BALL_R + 8)} fill="#8e9bb4" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
}

/** The gutter's front, hiding the lower half of the marble. */
function GutterFront() {
  return (
    <g>
      <path d={gutterBand(GUTTER_X0, GUTTER.to.x, 8, BALL_R + 12)} fill={ZINC} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <line x1={GUTTER_X0 + 20} y1={gutterY(GUTTER_X0 + 20) + 15} x2={GUTTER.to.x - 30} y2={gutterY(GUTTER.to.x - 30) + 15} stroke="#fffb" strokeWidth="4" strokeLinecap="round" />
      <rect x={GUTTER_X0 - 6} y={gutterY(GUTTER_X0) - 12} width="12" height={BALL_R + 26} rx="4" fill={ZINC} stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** The elbow at the end of the gutter that turns the marble down into the cup. */
function Downpipe() {
  const { to } = GUTTER;
  const d = `M${to.x - 20} ${gutterY(to.x - 20)} L${to.x} ${to.y} Q${CUP.x} ${to.y + 6} ${CUP.x} ${to.y + 44}`;
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth="62" />
      <path d={d} fill="none" stroke={ZINC} strokeWidth="54" />
      <rect x={CUP.x - 33} y={to.y + 34} width="66" height="12" rx="4" fill="#a9b6ca" stroke={INK} strokeWidth="3" />
      <path d={`M${to.x - 6} ${to.y - 18} Q${CUP.x - 14} ${to.y - 12} ${CUP.x - 16} ${to.y + 24}`} fill="none" stroke="#fffb" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

/* ---------- Watering can and water wheel ---------- */

/** The forked stick the can turns on. */
function CanStick() {
  const { x, y } = CAN.pivot;
  return (
    <g>
      <rect x={x - 9} y={y} width="18" height={TERRACE.y - y} rx="5" fill={MID_WOOD} stroke={INK} strokeWidth="3" />
      <path d={`M${x - 22} ${y - 14} L${x} ${y + 40} L${x + 22} ${y - 14}`} fill="none" stroke={INK} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${x - 22} ${y - 14} L${x} ${y + 40} L${x + 22} ${y - 14}`} fill="none" stroke={MID_WOOD} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** The red watering can with a tin cup on top, drawn around its pin and tipped by `tilt` degrees. */
function WateringCan({ tilt }: { tilt: number }) {
  const spoutAngle = deg(Math.atan2(CAN_ROSE.y - 30, CAN_ROSE.x - 56));
  return (
    <g>
      <g transform={`translate(${CAN.pivot.x} ${CAN.pivot.y}) rotate(${tilt})`}>
        <path d="M-60 -44 C-124 -50 -122 34 -64 34" fill="none" stroke={INK} strokeWidth="17" strokeLinecap="round" />
        <path d="M-60 -44 C-124 -50 -122 34 -64 34" fill="none" stroke="#ff5d73" strokeWidth="9" strokeLinecap="round" />
        <path d={`M56 30 L${CAN_ROSE.x - 6} ${CAN_ROSE.y + 5}`} stroke={INK} strokeWidth="21" strokeLinecap="round" />
        <path d={`M56 30 L${CAN_ROSE.x - 6} ${CAN_ROSE.y + 5}`} stroke="#ff5d73" strokeWidth="13" strokeLinecap="round" />
        <g transform={`translate(${CAN_ROSE.x} ${CAN_ROSE.y}) rotate(${spoutAngle})`}>
          <ellipse rx="9" ry="21" fill="#ffd23f" stroke={INK} strokeWidth="3" />
          {[-10, 0, 10].map((y) => (
            <circle key={y} cx="3" cy={y} r="2" fill={INK} />
          ))}
        </g>
        <rect x="-70" y="-55" width="140" height="110" rx="18" fill="#ff5d73" stroke={INK} strokeWidth="4" />
        <rect x="-70" y="10" width="140" height="16" fill="#ff8c42" stroke={INK} strokeWidth="2.5" />
        <path d="M-50 -36 L-50 -4" stroke="#fff9" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="-24" cy="-55" rx="28" ry="7" fill="#b8344a" stroke={INK} strokeWidth="3" />
        {/* The tin cup the marble drops into */}
        <path d={`M${CAN_CUP.x - 32} ${CAN_CUP.y} L${CAN_CUP.x + 32} ${CAN_CUP.y} L${CAN_CUP.x + 24} -55 L${CAN_CUP.x - 24} -55 Z`} fill="#ffd23f" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <line x1={CAN_CUP.x - 20} y1={CAN_CUP.y + 6} x2={CAN_CUP.x - 16} y2="-60" stroke="#fffa" strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx={CAN.pivot.x} cy={CAN.pivot.y} r="8" fill={INK} />
      <circle cx={CAN.pivot.x} cy={CAN.pivot.y} r="3" fill="#bbb" />
    </g>
  );
}

/** Water drops falling from the can's rose, and a splash where they hit the wheel. */
function Pour({ garden, t }: { garden: Garden; t: number }) {
  const { x, y } = garden.waterHit;
  const drops = garden.pourAt(t);
  return (
    <g>
      {drops.length > 1 && <path d={svgLine(drops)} fill="none" stroke={WATER} strokeWidth="10" strokeLinecap="round" opacity="0.6" />}
      {drops.map((p, i) => (
        <ellipse key={i} cx={p.x} cy={p.y} rx="8" ry="11" fill={WATER} stroke="#1e6fb8" strokeWidth="2" />
      ))}
      {garden.splashing(t) &&
        [-1, 1].map((side) => {
          const k = (t * 3) % 1;
          return <circle key={side} cx={x + side * 26 * k} cy={y - 18 * Math.sin(k * Math.PI)} r={6 * (1 - k) + 2} fill={WATER} stroke="#1e6fb8" strokeWidth="2" />;
        })}
    </g>
  );
}

/** The water wheel on its stand, turned `turned` radians, with the long arm on its axle. */
function WaterWheel({ turned }: { turned: number }) {
  const { cx, cy, r } = WATERWHEEL;
  const legs = [-58, 58];
  return (
    <g>
      {legs.map((dx) => (
        <line key={dx} x1={cx} y1={cy} x2={cx + dx} y2={TERRACE.y + 2} stroke={INK} strokeWidth="16" strokeLinecap="round" />
      ))}
      {legs.map((dx) => (
        <line key={dx} x1={cx} y1={cy} x2={cx + dx} y2={TERRACE.y + 2} stroke={DARK_WOOD} strokeWidth="9" strokeLinecap="round" />
      ))}
      <g transform={`translate(${cx} ${cy}) rotate(${deg(turned)})`}>
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 45})`}>
            <line x1="0" y1="0" x2={r - 20} y2="0" stroke={DARK_WOOD} strokeWidth="6" />
            <rect x={r - 30} y="-9" width="30" height="18" rx="4" fill="#ffb703" stroke={INK} strokeWidth="3" />
          </g>
        ))}
        <circle r={r - 22} fill="none" stroke={INK} strokeWidth="13" />
        <circle r={r - 22} fill="none" stroke={WOOD} strokeWidth="7" />
        <g transform={`rotate(${ARM.start})`}>
          <rect x="-8" y="-8" width={ARM.len + 8} height="16" rx="8" fill="#ff8c42" stroke={INK} strokeWidth="3" />
          <circle cx={ARM.len} r={ARM.knob} fill="#ff5d73" stroke={INK} strokeWidth="3" />
        </g>
        <circle r="13" fill="#ffd23f" stroke={INK} strokeWidth="3" />
      </g>
      <circle cx={cx} cy={cy} r="4" fill={INK} />
    </g>
  );
}

/* ---------- Wheelbarrow, rake and apple tree ---------- */

/** A blue wheelbarrow full of soil, drawn around the axle of its wheel, facing right. */
function Wheelbarrow({ turned }: { turned: number }) {
  const r = BARROW.wheelR;
  const { handle, legX, grip } = BARROW;
  return (
    <g>
      <line x1="0" y1="0" x2={handle.x} y2={handle.y} stroke={INK} strokeWidth="12" strokeLinecap="round" />
      <line x1="0" y1="0" x2={handle.x} y2={handle.y} stroke={DARK_WOOD} strokeWidth="6" strokeLinecap="round" />
      <circle cx={handle.x} cy={handle.y} r={grip} fill="#ff5d73" stroke={INK} strokeWidth="2.5" />
      <line x1={legX + 8} y1="-14" x2={legX} y2={r} stroke={INK} strokeWidth="10" strokeLinecap="round" />
      <line x1={legX + 8} y1="-14" x2={legX} y2={r} stroke={DARK_WOOD} strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="-74" cy="-74" rx="82" ry="20" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
      <path d="M-160 -76 L12 -80 L-24 -16 L-120 -14 Z" fill="#3a86ff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-138 -64 L-112 -26" stroke="#fff8" strokeWidth="7" strokeLinecap="round" />
      <g transform={`rotate(${deg(turned / r)})`}>
        <circle r={r} fill="#3b3b4f" stroke={INK} strokeWidth="3" />
        <circle r="9" fill="#e8e8f0" />
        <line x1={-r + 5} y1="0" x2={r - 5} y2="0" stroke="#e8e8f0" strokeWidth="3" />
        <line x1="0" y1={-r + 5} x2="0" y2={r - 5} stroke="#e8e8f0" strokeWidth="3" />
      </g>
      <circle r="4" fill={INK} />
    </g>
  );
}

/** The rake lying in the grass with its tines up, turned by `angle` degrees around its head. */
function Rake({ angle }: { angle: number }) {
  return (
    <g transform={`translate(${RAKE_PIVOT.x} ${RAKE_PIVOT.y}) rotate(${angle})`}>
      <rect x="0" y="-5" width={RAKE.len} height="10" rx="5" fill={WOOD} stroke={INK} strokeWidth="3" />
      {[-9, 0, 9].map((da) => (
        <g key={da} transform={`rotate(${RAKE.tineAngle + da})`}>
          <line x1="0" y1="0" x2={RAKE.tines} y2="0" stroke={INK} strokeWidth="8" strokeLinecap="round" />
          <line x1="0" y1="0" x2={RAKE.tines} y2="0" stroke="#9aa0b8" strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      <rect x="-9" y="-9" width="18" height="18" rx="5" fill="#7d7d96" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** Where the apples hang in the crown (besides the one that falls). */
const CROWN_APPLES: Pt[] = [
  { x: TREE.x - 90, y: 330 },
  { x: TREE.x + 30, y: 280 },
  { x: TREE.x + 110, y: 390 },
  { x: TREE.x - 160, y: 450 },
  { x: TREE.x - 20, y: 430 },
];

/** The apple tree with its low branch over the rake; the crown sways by `sway` degrees when the rake hits. */
function AppleTree({ sway }: { sway: number }) {
  const { x, trunkW, crownY } = TREE;
  const half = trunkW / 2;
  return (
    <g>
      <path
        d={`M${x - half - 10} ${FLOOR + 4} Q${x - half} ${FLOOR - 30} ${x - half} ${FLOOR - 80} L${x - half + 4} ${crownY - 60} L${x + half - 4} ${crownY - 60} L${x + half} ${FLOOR - 80} Q${x + half} ${FLOOR - 30} ${x + half + 10} ${FLOOR + 4} Z`}
        fill={BARK}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${x - 6} ${FLOOR - 60} q8 -30 0 -60 M${x + 8} ${crownY + 60} q-8 -30 0 -50`} fill="none" stroke="#7a4a26" strokeWidth="4" strokeLinecap="round" />
      {/* The low branch */}
      <path
        d={`M${x} ${LOW_BRANCH.y + 6} L${LOW_BRANCH.x0 + 30} ${LOW_BRANCH.y} Q${LOW_BRANCH.x0} ${LOW_BRANCH.y} ${LOW_BRANCH.x0 - 16} ${LOW_BRANCH.y - 24}`}
        fill="none"
        stroke={INK}
        strokeWidth={LOW_BRANCH.w + 7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={`M${x} ${LOW_BRANCH.y + 6} L${LOW_BRANCH.x0 + 30} ${LOW_BRANCH.y} Q${LOW_BRANCH.x0} ${LOW_BRANCH.y} ${LOW_BRANCH.x0 - 16} ${LOW_BRANCH.y - 24}`}
        fill="none"
        stroke={BARK}
        strokeWidth={LOW_BRANCH.w}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx={LOW_BRANCH.x0 - 24} cy={LOW_BRANCH.y - 40} rx="30" ry="18" fill={LEAF_LIGHT} stroke={INK} strokeWidth="3" />
      <g transform={`rotate(${sway} ${x} ${crownY})`}>
        {[
          [x, 370, 170],
          [x - 140, 440, 105],
          [x + 120, 450, 110],
          [x - 40, 230, 120],
          [x + 110, 300, 110],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={LEAF} stroke={INK} strokeWidth="4" />
        ))}
        <circle cx={x - 20} cy={330} r="150" fill={LEAF} />
        <circle cx={x + 60} cy={300} r="70" fill={LEAF_LIGHT} />
        {CROWN_APPLES.map((a) => (
          <g key={a.x}>
            <circle cx={a.x} cy={a.y} r={APPLE.r - 4} fill="#ff3b3b" stroke={INK} strokeWidth="3" />
            <circle cx={a.x - 6} cy={a.y - 6} r="4" fill="#fff9" />
          </g>
        ))}
      </g>
    </g>
  );
}

/** A few leaves shaken loose, `age` seconds after the rake hit the branch, see-sawing down to the grass. */
function FallingLeaves({ age }: { age: number }) {
  if (age < 0 || age > 4) return null;
  return (
    <g opacity={Math.min(1, 4 - age)}>
      {[
        [TREE.x - 150, 470],
        [TREE.x - 30, 520],
        [TREE.x + 90, 500],
      ].map(([x0, y0], i) => {
        const fall = Math.min(FLOOR - 8 - y0, 70 * age);
        const sway = 26 * Math.sin(age * 4 + i * 2);
        return (
          <ellipse key={i} cx={x0 + sway} cy={y0 + fall} rx="14" ry="7" transform={`rotate(${sway} ${x0 + sway} ${y0 + fall})`} fill={LEAF_LIGHT} stroke={INK} strokeWidth="2.5" />
        );
      })}
    </g>
  );
}

/** The red apple: hanging by its stem under the crown, or falling and rolling. */
function Apple({ at, spin, hanging, sway }: { at: Pt; spin: number; hanging: boolean; sway: number }) {
  const r = APPLE.r;
  return (
    <g transform={`translate(${at.x} ${at.y})`}>
      <g transform={`rotate(${hanging ? sway : deg(spin)})`}>
        {hanging && <line x1="0" y1={-r} x2="0" y2={-r - 12} stroke={INK} strokeWidth="4" strokeLinecap="round" />}
        <path d={`M0 ${-r + 6} C${r} ${-r - 8} ${r + 6} ${r} 0 ${r} C${-r - 6} ${r} ${-r} ${-r - 8} 0 ${-r + 6} Z`} fill="#ff3b3b" stroke={INK} strokeWidth="3" />
        <path d={`M0 ${-r + 6} q-2 -10 4 -14`} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="8" cy={-r - 4} rx="8" ry="4" fill={LEAF_LIGHT} stroke={INK} strokeWidth="2" transform={`rotate(-20 8 ${-r - 4})`} />
      </g>
      <circle cx="-7" cy="-6" r="5" fill="#fff" opacity="0.7" />
    </g>
  );
}

/* ---------- Slide, croquet and shed ---------- */

/** The children's slide: ladder, platform and the chute the apple rolls down. */
function Slide() {
  const chute = beside(SLIDE_LINE, APPLE.r + 7);
  const topY = SLIDE.top.y + APPLE.r + 7;
  const end = chute[chute.length - 1];
  return (
    <g>
      {[SLIDE.bottom.x - 60, end.x - 16].map((x) => {
        const y = x < SLIDE.bottom.x ? SLIDE.top.y + ((x - SLIDE.top.x) * (SLIDE.bottom.y - SLIDE.top.y)) / (SLIDE.bottom.x - SLIDE.top.x) + APPLE.r + 10 : end.y + 4;
        return <rect key={x} x={x - 6} y={y} width="12" height={FLOOR - y} rx="3" fill="#ff5d73" stroke={INK} strokeWidth="2.5" />;
      })}
      {[SLIDE.top.x - 62, SLIDE.top.x - 18].map((x) => (
        <rect key={x} x={x - 6} y={topY - 50} width="12" height={FLOOR - topY + 50} rx="4" fill="#ff5d73" stroke={INK} strokeWidth="3" />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <rect key={i} x={SLIDE.top.x - 62} y={topY + 18 + i * 24} width="44" height="8" rx="3" fill="#ff8c42" stroke={INK} strokeWidth="2" />
      ))}
      <rect x={SLIDE.top.x - 72} y={topY - 6} width="82" height="14" rx="5" fill="#ff8c42" stroke={INK} strokeWidth="3" />
      <path d={`M${SLIDE.top.x - 62} ${topY - 50} Q${SLIDE.top.x - 40} ${topY - 74} ${SLIDE.top.x - 18} ${topY - 50}`} fill="none" stroke="#ff5d73" strokeWidth="8" strokeLinecap="round" />
      <path d={svgLine(chute)} fill="none" stroke={INK} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
      <path d={svgLine(chute)} fill="none" stroke="#ffb703" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d={svgLine(beside(SLIDE_LINE.slice(2, -12), APPLE.r + 4))} fill="none" stroke="#fff8" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/** A wooden croquet ball with a stripe round it. */
function CroquetBall({ at, spin }: { at: Pt; spin: number }) {
  const r = CROQUET.r;
  return (
    <g transform={`translate(${at.x} ${at.y})`}>
      <circle r={r} fill="#3a86ff" stroke={INK} strokeWidth="3" />
      <g transform={`rotate(${deg(spin)})`}>
        <path d={`M${-r + 2} -6 L${r - 2} -6 L${r - 2} 6 L${-r + 2} 6 Z`} fill="#fff" />
      </g>
      <circle r={r} fill="none" stroke={INK} strokeWidth="3" />
      <circle cx="-8" cy="-10" r="5" fill="#fff" opacity="0.75" />
    </g>
  );
}

const HOOP_W = 30;
const hoopPath = `M${HOOP.x - HOOP_W} ${FLOOR + 4} L${HOOP.x - HOOP_W} ${FLOOR - HOOP.h + HOOP_W} A${HOOP_W} ${HOOP_W} 0 0 1 ${HOOP.x + HOOP_W} ${FLOOR - HOOP.h + HOOP_W} L${HOOP.x + HOOP_W} ${FLOOR + 4}`;

/** The croquet hoop: the far half behind the ball … */
function HoopBack() {
  return (
    <g>
      <path d={hoopPath} fill="none" stroke={INK} strokeWidth="10" strokeLinejoin="round" />
      <path d={hoopPath} fill="none" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
    </g>
  );
}

/** … and its near leg in front, so the ball goes through. */
function HoopFront() {
  const x = HOOP.x + HOOP_W;
  return (
    <g>
      <line x1={x} y1={FLOOR + 4} x2={x} y2={FLOOR - HOOP.h + HOOP_W} stroke={INK} strokeWidth="10" />
      <line x1={x} y1={FLOOR + 4} x2={x} y2={FLOOR - HOOP.h + HOOP_W} stroke="#fff" strokeWidth="5" />
    </g>
  );
}

/** The garden shed, with the tap on its wall. */
function Shed() {
  const { x0, x1, wallTop, roofTop } = SHED;
  return (
    <g>
      <rect x={x0} y={wallTop} width={x1 - x0} height={FLOOR - wallTop} fill="#c97b4a" stroke={INK} strokeWidth="4" />
      {Array.from({ length: Math.floor((x1 - x0) / 34) }, (_, i) => (
        <line key={i} x1={x0 + 34 * (i + 1)} y1={wallTop} x2={x0 + 34 * (i + 1)} y2={FLOOR} stroke="#a85f35" strokeWidth="3" />
      ))}
      <path d={`M${x0 - 34} ${wallTop + 12} L${x0 + 50} ${roofTop} L${x1 - 50} ${roofTop} L${x1 + 34} ${wallTop + 12} Z`} fill="#8e3b46" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x="3745" y="600" width="104" height={FLOOR - 600} rx="6" fill="#a5643a" stroke={INK} strokeWidth="4" />
      <path d="M3797 640 c-12 -14 -28 0 0 22 c28 -22 12 -36 0 -22 Z" fill="#ff7bd0" stroke={INK} strokeWidth="2.5" />
      <circle cx="3832" cy="710" r="6" fill="#ffd23f" stroke={INK} strokeWidth="2" />
      <rect x="3640" y="574" width="80" height="64" rx="6" fill="#bfe9ff" stroke={INK} strokeWidth="4" />
      <line x1="3680" y1="574" x2="3680" y2="638" stroke={INK} strokeWidth="4" />
      <rect x="3632" y="638" width="96" height="18" rx="4" fill="#3ec300" stroke={INK} strokeWidth="3" />
      {[3650, 3680, 3710].map((x, i) => (
        <circle key={x} cx={x} cy="632" r="9" fill={BAR_COLORS[i * 3]} stroke={INK} strokeWidth="2" />
      ))}
    </g>
  );
}

/** The brass tap; its lever hangs down when shut and is turned `angle` degrees to open it. */
function Tap({ angle }: { angle: number }) {
  const { x, y, lever, knob } = TAP;
  return (
    <g>
      <circle cx={x - 18} cy={y} r="12" fill="#a9b6ca" stroke={INK} strokeWidth="3" />
      <path d={`M${x} ${y} L${x + 24} ${y + 4} L${x + 24} ${y + 40}`} fill="none" stroke={INK} strokeWidth="15" strokeLinejoin="round" />
      <path d={`M${x} ${y} L${x + 24} ${y + 4} L${x + 24} ${y + 40}`} fill="none" stroke="#e0b43c" strokeWidth="9" strokeLinejoin="round" />
      <circle cx={x} cy={y} r="16" fill="#e0b43c" stroke={INK} strokeWidth="3" />
      <g transform={`translate(${x} ${y}) rotate(${-angle})`}>
        <line x1="0" y1="0" x2="0" y2={lever} stroke={INK} strokeWidth="12" strokeLinecap="round" />
        <line x1="0" y1="0" x2="0" y2={lever} stroke="#ff5d73" strokeWidth="6" strokeLinecap="round" />
        <circle cy={lever} r={knob} fill="#ff3b3b" stroke={INK} strokeWidth="3" />
      </g>
      <circle cx={x} cy={y} r="5" fill={INK} />
    </g>
  );
}

/** The garden hose; the part that water has reached (`fill` of it) is fat and has water glinting inside. */
function Hose({ fill, t }: { fill: number; t: number }) {
  const all = svgLine(HOSE.pts);
  const upTo = HOSE.total * fill;
  const wet = HOSE.pts.filter((_, i) => HOSE.s[i] <= upTo);
  const front = wet[wet.length - 1];
  return (
    <g>
      <path d={all} fill="none" stroke={INK} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
      <path d={all} fill="none" stroke="#ff8c42" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      {fill > 0 && wet.length > 1 && (
        <g>
          <path d={svgLine(wet)} fill="none" stroke={INK} strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgLine(wet)} fill="none" stroke="#ff8c42" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgLine(wet)} fill="none" stroke={WATER} strokeWidth="7" strokeDasharray="16 10" strokeDashoffset={-t * 120} strokeLinecap="round" />
          {fill < 1 && <circle cx={front.x} cy={front.y} r="16" fill="#ff8c42" stroke={INK} strokeWidth="3" />}
        </g>
      )}
    </g>
  );
}

/* ---------- Sprinkler, flower bed and finale ---------- */

/** The lawn sprinkler; its arms turn round by `spin` radians, so from the side they look shorter and longer. */
function Sprinkler({ spin }: { spin: number }) {
  const { x, headY, arm } = SPRINKLER;
  const reach = arm * Math.cos(spin);
  return (
    <g>
      <rect x={x - 44} y={FLOOR - 18} width="88" height="16" rx="7" fill="#ffd23f" stroke={INK} strokeWidth="3" />
      <rect x={x - 8} y={headY} width="16" height={FLOOR - 18 - headY} fill="#a9b6ca" stroke={INK} strokeWidth="3" />
      <line x1={x - reach} y1={headY} x2={x + reach} y2={headY} stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <line x1={x - reach} y1={headY} x2={x + reach} y2={headY} stroke="#3a86ff" strokeWidth="7" strokeLinecap="round" />
      {[-1, 1].map((side) => (
        <circle key={side} cx={x + side * reach} cy={headY} r="7" fill="#ffd23f" stroke={INK} strokeWidth="2.5" />
      ))}
      <circle cx={x} cy={headY} r="14" fill="#ff5d73" stroke={INK} strokeWidth="3" />
    </g>
  );
}

function Spray({ drops }: { drops: Pt[] }) {
  return (
    <g>
      {drops.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="7" fill={WATER} stroke="#1e6fb8" strokeWidth="2" />
      ))}
    </g>
  );
}

/** The flower bed: dark soil with a few tulips. */
function FlowerBed() {
  const { x0, x1 } = BED;
  return (
    <g>
      <path d={`M${x0} ${FLOOR + 2} Q${x0 + 10} ${FLOOR - 20} ${x0 + 50} ${FLOOR - 20} L${x1 - 50} ${FLOOR - 20} Q${x1 - 10} ${FLOOR - 20} ${x1} ${FLOOR + 2} Z`} fill="#8a5a2b" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      {[4320, 4580, 4660, 4730].map((x, i) => (
        <g key={x}>
          <line x1={x} y1={FLOOR - 18} x2={x} y2={FLOOR - 70 - (i % 2) * 14} stroke="#3e9a2e" strokeWidth="5" />
          <path d={`M${x - 12} ${FLOOR - 76 - (i % 2) * 14} l4 -22 l8 10 l8 -10 l4 22 Q${x} ${FLOOR - 60 - (i % 2) * 14} ${x - 12} ${FLOOR - 76 - (i % 2) * 14} Z`} fill={["#ff5d73", "#ff7bd0", "#8e7dff", "#ff8c42"][i]} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        </g>
      ))}
    </g>
  );
}

/** The sunflower: a tiny sprout, then a stem that grows in spurts, then the big smiling flower. */
function Sunflower({ garden, t }: { garden: Garden; t: number }) {
  const soil = FLOOR - 18;
  const full = soil - SUN.headY;
  const grow = garden.growAt(t);
  const h = Math.max(26, full * grow);
  const bloom = garden.bloomAt(t);
  const stemX = (f: number) => SUN.x + 2 * (1 - f) * f * 22;
  const top = { x: stemX(h / full), y: soil - h };
  const sway = bloom > 0 ? 3 * Math.sin((t - garden.tBloom) * 1.8) : 0;
  return (
    <g>
      <path d={`M${SUN.x} ${soil} Q${SUN.x + 22 * (h / full)} ${soil - h / 2} ${top.x} ${top.y}`} fill="none" stroke={INK} strokeWidth="15" strokeLinecap="round" />
      <path d={`M${SUN.x} ${soil} Q${SUN.x + 22 * (h / full)} ${soil - h / 2} ${top.x} ${top.y}`} fill="none" stroke="#3ec300" strokeWidth="9" strokeLinecap="round" />
      {[0.22, 0.45, 0.68].map((f, i) => {
        const s = Math.min(1, Math.max(0, (h - f * full) / 50));
        if (s <= 0) return null;
        const side = i % 2 ? -1 : 1;
        const x = stemX(f);
        const y = soil - f * full;
        return (
          <ellipse key={f} cx={x + side * 34 * s} cy={y - 8 * s} rx={38 * s} ry={15 * s} transform={`rotate(${-side * 24} ${x} ${y})`} fill="#3ec300" stroke={INK} strokeWidth="3" />
        );
      })}
      {grow === 0 &&
        [-1, 1].map((side) => <ellipse key={side} cx={SUN.x + side * 14} cy={soil - 26} rx="14" ry="7" transform={`rotate(${side * -30} ${SUN.x + side * 14} ${soil - 26})`} fill="#3ec300" stroke={INK} strokeWidth="2.5" />)}
      {bloom <= 0 ? (
        <g transform={`translate(${top.x} ${top.y})`}>
          <circle r={8 + 16 * grow} fill="#3ec300" stroke={INK} strokeWidth="3" />
          {grow > 0.5 && <path d={`M-10 -${12 * grow} q10 -10 20 0`} fill="none" stroke="#ffd23f" strokeWidth="5" strokeLinecap="round" />}
        </g>
      ) : (
        <g transform={`translate(${top.x} ${top.y}) rotate(${sway}) scale(${1.2 * bloom})`}>
          {Array.from({ length: 16 }, (_, i) => (
            <ellipse key={`b${i}`} cx="0" cy="-74" rx="17" ry="34" transform={`rotate(${i * 22.5 + 11})`} fill="#ffb703" stroke={INK} strokeWidth="2.5" />
          ))}
          {Array.from({ length: 16 }, (_, i) => (
            <ellipse key={i} cx="0" cy="-70" rx="16" ry="34" transform={`rotate(${i * 22.5})`} fill="#ffd23f" stroke={INK} strokeWidth="2.5" />
          ))}
          <circle r="50" fill="#8a5a2b" stroke={INK} strokeWidth="3.5" />
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={36 * Math.cos(i * 0.52)} cy={36 * Math.sin(i * 0.52)} r="3" fill="#5c3a1a" />
          ))}
          <circle cx="-17" cy="-10" r="7" fill={INK} />
          <circle cx="17" cy="-10" r="7" fill={INK} />
          <circle cx="-15" cy="-12" r="2.5" fill="#fff" />
          <circle cx="19" cy="-12" r="2.5" fill="#fff" />
          <circle cx="-30" cy="10" r="8" fill="#ff9bb5" />
          <circle cx="30" cy="10" r="8" fill="#ff9bb5" />
          <path d="M-20 12 Q0 32 20 12" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

/** Two little birds fly in and sit on the fence, singing. */
function Birds({ garden, t }: { garden: Garden; t: number }) {
  if (t < garden.tBloom) return null;
  return (
    <g>
      {[0, 1].map((i) => {
        const { pt, flying } = garden.birdAt(i, t);
        const flap = flying ? 40 * Math.sin(t * 30 + i) : 10;
        const bob = flying ? 0 : 3 * Math.sin(t * 9 + i * 2);
        const color = i ? "#ff8c42" : "#00b4d8";
        const note = (t * 1.2 + i * 0.5) % 1;
        return (
          <g key={i}>
            <g transform={`translate(${pt.x} ${pt.y - 22 + bob})`}>
              <path d="M18 -2 L38 -12 L36 4 Z" fill={color} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
              <ellipse rx="24" ry="18" fill={color} stroke={INK} strokeWidth="3" />
              <circle cx="-16" cy="-16" r="14" fill={color} stroke={INK} strokeWidth="3" />
              <circle cx="-20" cy="-19" r="3" fill={INK} />
              <path d={flying ? "M-29 -16 L-42 -13 L-29 -10 Z" : "M-29 -18 L-43 -16 L-29 -10 L-41 -9 Z"} fill="#ffb703" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
              <ellipse cx="4" cy="-2" rx="16" ry="9" transform={`rotate(${-flap} 14 -4)`} fill="#fff8" stroke={INK} strokeWidth="2.5" />
              {!flying && (
                <>
                  <line x1="-6" y1="16" x2="-6" y2="22" stroke={INK} strokeWidth="3" />
                  <line x1="6" y1="16" x2="6" y2="22" stroke={INK} strokeWidth="3" />
                </>
              )}
            </g>
            {!flying && (
              <text x={pt.x - 40 - 20 * note} y={pt.y - 60 - 60 * note} fontSize="34" fill={INK} opacity={1 - note} textAnchor="middle">
                ♪
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

/** A butterfly fluttering round the sunflower. */
function Butterfly({ garden, t }: { garden: Garden; t: number }) {
  const pt = garden.butterflyAt(t);
  if (!pt) return null;
  const open = 0.25 + 0.75 * Math.abs(Math.cos(t * 16));
  return (
    <g transform={`translate(${pt.x} ${pt.y})`}>
      <g transform={`scale(${open} 1)`}>
        {[-1, 1].map((side) => (
          <g key={side}>
            <ellipse cx={side * 18} cy="-10" rx="18" ry="16" fill="#ff7bd0" stroke={INK} strokeWidth="2.5" />
            <ellipse cx={side * 14} cy="12" rx="12" ry="11" fill="#8e7dff" stroke={INK} strokeWidth="2.5" />
            <circle cx={side * 18} cy="-10" r="5" fill="#fff9" />
          </g>
        ))}
      </g>
      <ellipse rx="5" ry="18" fill={INK} />
      <path d="M-2 -16 q-6 -14 -12 -16 M2 -16 q6 -14 12 -16" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

/** A hedgehog by the flower bed, who sniffs and lifts its nose when the sunflower opens. */
function Hedgehog({ garden, t }: { garden: Garden; t: number }) {
  const x = BED.x1 + 110;
  const up = Math.min(1, Math.max(0, (t - garden.tBloom - 1.4) * 3)) * (1 + 0.15 * Math.sin(t * 25));
  const spikes = Array.from({ length: 9 }, (_, i) => {
    const a = Math.PI + (i / 8) * Math.PI;
    const r = i % 2 ? 50 : 62;
    return `${44 * Math.cos(a) * (r / 50) + 6} ${36 * Math.sin(a) * (r / 50)}`;
  }).join(" L");
  return (
    <g transform={`translate(${x} ${FLOOR - 2})`}>
      <path d={`M${spikes} Z`} fill="#6b4423" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <g transform={`rotate(${-12 * up} -30 -14)`}>
        <path d="M-20 -30 Q-46 -26 -60 -12 Q-46 -2 -20 0 Z" fill="#e8c39e" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="-61" cy="-12" r="5" fill={INK} />
        <circle cx="-36" cy="-18" r="3.5" fill={INK} />
      </g>
      <ellipse cx="-14" cy="0" rx="8" ry="4" fill="#4a2f1a" />
    </g>
  );
}
