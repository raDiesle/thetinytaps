import { HORIZON, depthScale, towardsHorizon, transformOf } from "../layout";
import { Cloud } from "../shared";
import { PUMP, SAND_LEFT, SAND_RIGHT, SAND_TOP, SWING, TOWER, pathHalf, pathY } from "./layout";

// A playground in the park. Far away the roofs of the town and rows of trees fade into the
// haze; a hedge and a white picket fence close the playground off at the horizon. On the lawn
// lie the bark mulch under the climbing tower, the soft mat under the swing and the round
// patch of the roundabout; the gravel path with chalk drawings crosses the picture; at the
// front is the sandpit with its wooden frame and the little stream from the water pump.

// Far roofs: [x, width, height, colour].
const ROOFS: [number, number, number, string][] = [
  [40, 90, 60, "#f2b8a2"],
  [150, 70, 48, "#e8c3a8"],
  [520, 80, 52, "#f2b8a2"],
  [980, 96, 58, "#e8c3a8"],
  [1110, 70, 44, "#f2b8a2"],
  [1360, 84, 56, "#e8c3a8"],
  [1480, 100, 64, "#f2b8a2"],
];

// Round trees in the haze behind the hedge: [x, radius].
const FAR_TREES = [
  [10, 40],
  [250, 34],
  [330, 46],
  [640, 38],
  [720, 30],
  [880, 44],
  [1230, 36],
  [1300, 30],
  [1600, 44],
];

// Pebbles on the gravel path: [x, offset from the middle in half heights].
const GRAVEL = Array.from({ length: 70 }, (_, i) => [(i * 131) % 1660 - 30, (((i * 53) % 17) / 8.5 - 1) * 0.8]);

const TUFTS = [
  [60, 360],
  [700, 352],
  [1250, 372],
  [420, 440],
  [990, 420],
  [1560, 470],
  [40, 560],
  [640, 560],
  [1300, 580],
  [1580, 640],
  [480, 680],
  [880, 690],
  [1180, 680],
  [20, 820],
  [1180, 830],
  [1560, 830],
  [40, 990],
  [1300, 990],
  [1580, 990],
];

// Daisies in the grass: [x, y].
const DAISIES = [
  [300, 360],
  [760, 380],
  [1180, 400],
  [1540, 360],
  [80, 640],
  [560, 600],
  [1060, 690],
  [1360, 640],
  [180, 860],
  [1520, 820],
  [1140, 970],
];

/** The town far away, the trees in the haze and the hedge with the picket fence at the horizon. */
function Distance() {
  return (
    <g>
      {ROOFS.map(([x, w, h, colour]) => (
        <g key={x}>
          <rect x={x} y={HORIZON - 20 - h} width={w} height={h} fill="#f1f3f5" />
          <path d={`M${x - 6} ${HORIZON - 20 - h} L${x + w / 2} ${HORIZON - 44 - h} L${x + w + 6} ${HORIZON - 20 - h} Z`} fill={colour} />
          <rect x={x + 12} y={HORIZON - 6 - h} width="14" height="12" fill="#d0ebff" />
          <rect x={x + w - 26} y={HORIZON - 6 - h} width="14" height="12" fill="#d0ebff" />
        </g>
      ))}
      <path d="M1384 238 v-24 h12 v20" fill="#e8c3a8" />
      {FAR_TREES.map(([x, r]) => (
        <g key={x}>
          <rect x={x - 4} y={HORIZON - 34} width="8" height="20" fill="#b08968" opacity="0.6" />
          <circle cx={x} cy={HORIZON - 30 - r * 0.7} r={r} fill="#b7e4c7" />
          <circle cx={x - r * 0.3} cy={HORIZON - 30 - r} r={r * 0.4} fill="#d8f3dc" />
        </g>
      ))}
    </g>
  );
}

function Hedge() {
  return (
    <g>
      <path
        d={`M0 ${HORIZON + 4} V${HORIZON - 22} ${Array.from({ length: 41 }, (_, i) => `Q${i * 40 + 20} ${HORIZON - 36 - (i % 3) * 3} ${i * 40 + 40} ${HORIZON - 22}`).join(" ")} V${HORIZON + 4} Z`}
        fill="#74c69d"
      />
      <path d={`M0 ${HORIZON - 6} H1600`} stroke="#52b788" strokeWidth="8" opacity="0.6" />
      {/* White picket fence in front of the hedge */}
      <g fill="#fff">
        {Array.from({ length: 81 }, (_, i) => (
          <path key={i} d={`M${i * 20 - 3} ${HORIZON + 6} V${HORIZON - 12} l3 -4 l3 4 V${HORIZON + 6} Z`} />
        ))}
      </g>
      <path d={`M0 ${HORIZON - 6} H1600 M0 ${HORIZON + 1} H1600`} stroke="#e9ecef" strokeWidth="3" />
    </g>
  );
}

/** The gravel path across the picture with its edges. */
function Path() {
  const xs = Array.from({ length: 34 }, (_, i) => i * 50 - 20);
  const top = xs.map((x) => `${x} ${pathY(x) - pathHalf(x)}`).join(" L");
  const bottom = [...xs].reverse().map((x) => `${x} ${pathY(x) + pathHalf(x)}`).join(" L");
  const edge = (dir: 1 | -1) => `M${xs.map((x) => `${x} ${pathY(x) + dir * pathHalf(x)}`).join(" L")}`;
  return (
    <g>
      <path d={`M${top} L${bottom} Z`} fill="#ecdcb8" />
      <path d={edge(-1)} stroke="#d6c193" strokeWidth="5" fill="none" />
      <path d={edge(1)} stroke="#cdb582" strokeWidth="7" fill="none" />
      <g fill="#cbb487">
        {GRAVEL.map(([x, off], i) => {
          const y = pathY(x) + off * pathHalf(x);
          const s = depthScale(y);
          return <ellipse key={i} cx={x} cy={y} rx={4.5 * s} ry={3 * s} />;
        })}
      </g>
    </g>
  );
}

/** Chalk drawings on the path: a hopscotch and a sun. */
function Chalk() {
  const hop = (x: number, w: number, i: number) => {
    const y = pathY(x);
    const s = depthScale(y);
    return <rect key={i} x={x} y={y - 14 * s} width={w * s} height={28 * s} fill="none" />;
  };
  const sunX = 1130;
  const sunY = pathY(sunX);
  const s = depthScale(sunY);
  return (
    <g stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.85">
      {[0, 1, 2, 3].map((i) => hop(340 + i * 40, 40, i))}
      <g stroke="#ffc9e0">
        <ellipse cx={sunX} cy={sunY} rx={20 * s} ry={9 * s} fill="none" />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return <path key={i} d={`M${sunX + 26 * s * Math.cos(a)} ${sunY + 12 * s * Math.sin(a)} L${sunX + 36 * s * Math.cos(a)} ${sunY + 17 * s * Math.sin(a)}`} />;
        })}
      </g>
      <path d={`M${860} ${pathY(860) - 4} q10 -10 20 0 q10 10 20 0`} stroke="#a5d8ff" fill="none" />
    </g>
  );
}

/** The sandpit: sand inside a wooden frame whose sides run towards the horizon. */
function Sandpit() {
  const leftBottom = towardsHorizon(SAND_LEFT, SAND_TOP, 1010);
  const rightBottom = towardsHorizon(SAND_RIGHT, SAND_TOP, 1010);
  return (
    <g>
      <path d={`M${SAND_LEFT} ${SAND_TOP} H${SAND_RIGHT} L${rightBottom} 1010 H${leftBottom} Z`} fill="#f4d58d" />
      <path d={`M${SAND_LEFT + 30} ${SAND_TOP + 30} Q600 ${SAND_TOP + 10} ${SAND_RIGHT - 40} ${SAND_TOP + 40}`} stroke="#ead08a" strokeWidth="18" fill="none" opacity="0.7" />
      <g fill="#e2b866" opacity="0.7">
        {[
          [400, 880],
          [700, 870],
          [980, 900],
          [300, 960],
          [560, 940],
          [860, 990],
          [1060, 960],
        ].map(([cx, cy]) => (
          <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={30 * depthScale(cy)} ry={6 * depthScale(cy)} />
        ))}
      </g>
      {/* Frame: the back beam, then the side beams */}
      <path d={`M${SAND_LEFT - 14} ${SAND_TOP - 16} H${SAND_RIGHT + 14} V${SAND_TOP} H${SAND_LEFT - 14} Z`} fill="#c98b4f" />
      <path d={`M${SAND_LEFT - 14} ${SAND_TOP - 16} H${SAND_RIGHT + 14} V${SAND_TOP - 10} H${SAND_LEFT - 14} Z`} fill="#e0a96d" />
      <path d={`M${SAND_LEFT} ${SAND_TOP - 8} L${leftBottom} 1010`} stroke="#c98b4f" strokeWidth="26" strokeLinecap="round" />
      <path d={`M${SAND_LEFT - 6} ${SAND_TOP - 12} L${leftBottom - 10} 1010`} stroke="#e0a96d" strokeWidth="8" strokeLinecap="round" />
      <path d={`M${SAND_RIGHT} ${SAND_TOP - 8} L${rightBottom} 1010`} stroke="#c98b4f" strokeWidth="26" strokeLinecap="round" />
      <path d={`M${SAND_RIGHT + 6} ${SAND_TOP - 12} L${rightBottom + 10} 1010`} stroke="#e0a96d" strokeWidth="8" strokeLinecap="round" />
    </g>
  );
}

/** The little stream from the water pump, running to the front and out of the picture. */
function Stream() {
  return (
    <g transform={transformOf(PUMP)}>
      <path d="M50 -10 Q90 30 40 80 Q0 120 -40 150 L40 150 Q80 120 110 80 Q150 30 90 -10 Z" fill="#74c0fc" />
      <path d="M70 0 Q100 30 70 70 Q40 100 10 130" stroke="#d0ebff" strokeWidth="6" strokeLinecap="round" fill="none" className="sp-stream-shine" />
      <path d="M40 -12 h70" stroke="#868e96" strokeWidth="8" strokeLinecap="round" />
      {[
        [30, 40],
        [130, 50],
        [10, 110],
        [100, 120],
      ].map(([cx, cy]) => (
        <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx="12" ry="7" fill="#adb5bd" />
      ))}
    </g>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#74c0fc" />
          <stop offset="1" stopColor="#e7f5ff" />
        </linearGradient>
        <linearGradient id="sp-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b2f2bb" />
          <stop offset="0.4" stopColor="#8ce99a" />
          <stop offset="1" stopColor="#69db7c" />
        </linearGradient>
        <linearGradient id="sp-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7f5ff" stopOpacity="0" />
          <stop offset="1" stopColor="#e7f5ff" stopOpacity="0.75" />
        </linearGradient>
        <radialGradient id="sp-sunglow">
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height={HORIZON + 10} fill="url(#sp-sky)" />
      <circle cx="1470" cy="96" r="150" fill="url(#sp-sunglow)" />
      <Cloud x={1080} y={180} scale={0.4} className="sp-cloud" />
      <Cloud x={260} y={236} scale={0.28} className="sp-cloud sp-cloud-slow" />
      <path d="M880 150 q6 -6 12 0 q6 -6 12 0 M920 134 q5 -5 10 0 q5 -5 10 0" stroke="#5c677d" strokeWidth="2.5" fill="none" />
      <Distance />
      <rect y={HORIZON - 70} width="1600" height="60" fill="url(#sp-haze)" />
      <Hedge />
      <rect y={HORIZON + 4} width="1600" height={1000 - HORIZON - 4} fill="url(#sp-grass)" />

      {/* Bark mulch under the climbing tower and the slide, the soft mat under the swing */}
      <g transform={transformOf(TOWER)}>
        <ellipse cx="90" cy="0" rx="330" ry="46" fill="#d9a066" />
        <ellipse cx="90" cy="-4" rx="306" ry="36" fill="#e6b47a" />
      </g>
      <g transform={transformOf(SWING)}>
        <ellipse cx="0" cy="0" rx="300" ry="40" fill="#e8590c" opacity="0.55" />
        <ellipse cx="-110" cy="-2" rx="70" ry="12" fill="#c2410c" opacity="0.35" />
        <ellipse cx="110" cy="-2" rx="70" ry="12" fill="#c2410c" opacity="0.35" />
      </g>
      {/* Round patch under the roundabout */}
      <ellipse cx="920" cy="634" rx={150} ry={34} fill="#ced4da" />
      <ellipse cx="920" cy="632" rx={140} ry={28} fill="#dee2e6" />

      <g stroke="#51cf66" strokeWidth="5" strokeLinecap="round" fill="none">
        {TUFTS.map(([x, y]) => (
          <path key={`${x}-${y}`} d="M0 0 q4 -24 12 -30 M10 0 q0 -26 -6 -36 M20 0 q2 -20 12 -26" transform={`translate(${x} ${y}) scale(${depthScale(y)})`} />
        ))}
      </g>
      {DAISIES.map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${depthScale(y)})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-7" rx="3.5" ry="6" fill="#fff" transform={`rotate(${a})`} />
          ))}
          <circle r="3.5" fill="#ffd43b" />
        </g>
      ))}

      <Path />
      <Chalk />
      <Sandpit />
      <Stream />
    </>
  );
}
