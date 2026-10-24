import { HORIZON, depthScale, towardsHorizon, transformOf } from "../layout";
import { Cloud } from "../shared";
import { PUDDLE, STATION_Y, YARD_BOTTOM } from "./layout";

// Far away hills with a village in the haze; then the meadow behind the station, the
// yard in front of it with yellow lines before every bay, the garden on the right and the
// lawn at the front. Tufts and pebbles grow towards the front.

// Little houses on the far hills: [x, y, width, colour].
const VILLAGE = [
  [30, 300, 34, "#f6d6c8"],
  [1080, 292, 30, "#f3e3c3"],
  [1126, 300, 38, "#dfe7fd"],
  [1200, 296, 28, "#f6d6c8"],
  [1500, 298, 32, "#f3e3c3"],
];

const TUFTS = [
  [1100, 470],
  [1250, 520],
  [1560, 560],
  [1330, 600],
  [30, 860],
  [380, 830],
  [640, 990],
  [880, 840],
  [1080, 990],
  [1460, 830],
  [1300, 980],
];

const PEBBLES = [
  [150, 540],
  [480, 700],
  [700, 560],
  [940, 740],
  [260, 780],
  [600, 790],
  [1180, 760],
];

/** The bays' centres at the station's foot, where the yellow lines start. */
const BAYS = [
  [244, 436],
  [458, 649],
  [672, 796],
];

function FarTree({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-6" y="-50" width="12" height="50" fill="#9c6b3c" />
      <circle cx="0" cy="-64" r="32" fill="#74c69d" />
      <circle cx="-20" cy="-48" r="20" fill="#52b788" />
      <circle cx="20" cy="-50" r="22" fill="#52b788" />
    </g>
  );
}

/** A line on the ground from (x, y1) towards the front, running away from the vanishing point. */
const ray = (x: number, y1: number, y2: number) => `M${x} ${y1} L${towardsHorizon(x, y1, y2)} ${y2}`;

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="fw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc8fb" />
          <stop offset="1" stopColor="#e3f4ff" />
        </linearGradient>
        <linearGradient id="fw-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3f4ff" stopOpacity="0" />
          <stop offset="1" stopColor="#e3f4ff" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="fw-meadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c7ebd0" />
          <stop offset="1" stopColor="#95d5a6" />
        </linearGradient>
        <linearGradient id="fw-yard" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#adb5bd" />
          <stop offset="1" stopColor="#8d959d" />
        </linearGradient>
        <linearGradient id="fw-lawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd19e" />
          <stop offset="1" stopColor="#6fbf82" />
        </linearGradient>
        <radialGradient id="fw-sunglow">
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height={HORIZON + 20} fill="url(#fw-sky)" />
      <circle cx="1530" cy="76" r="140" fill="url(#fw-sunglow)" />
      <Cloud x={250} y={200} scale={0.32} className="fw-cloud fw-cloud-slow" />
      <Cloud x={880} y={230} scale={0.36} className="fw-cloud" />
      <path d="M760 110 q6 -6 12 0 q6 -6 12 0 M800 96 q5 -5 10 0 q5 -5 10 0" stroke="#5c677d" strokeWidth="2.5" fill="none" />

      {/* Far hills with a village */}
      <path d="M0 312 Q180 260 380 300 T760 296 T1140 280 T1600 300 V350 H0 Z" fill="#b7dfc4" />
      {VILLAGE.map(([x, y, w, colour]) => (
        <g key={x}>
          <rect x={x} y={Number(y) - Number(w) * 0.7} width={w} height={Number(w) * 0.7} fill={String(colour)} />
          <path
            d={`M${Number(x) - 4} ${Number(y) - Number(w) * 0.7} L${Number(x) + Number(w) / 2} ${Number(y) - Number(w) * 1.15} L${Number(x) + Number(w) + 4} ${Number(y) - Number(w) * 0.7} Z`}
            fill="#e5989b"
          />
        </g>
      ))}
      <rect x="1290" y="252" width="12" height="44" fill="#e9ecef" />
      <path d="M1286 252 L1296 226 L1306 252 Z" fill="#cdb4db" />
      <rect y="250" width="1600" height="100" fill="url(#fw-haze)" />

      {/* Meadow behind the station, with far trees and a hedge */}
      <rect y={HORIZON} width="1600" height={1000 - HORIZON} fill="url(#fw-meadow)" />
      <FarTree x={1010} y={420} scale={0.5} />
      <FarTree x={1210} y={400} scale={0.42} />
      <FarTree x={1580} y={420} scale={0.55} />
      <FarTree x={20} y={410} scale={0.45} />
      <path d="M1000 470 Q1080 446 1160 466 T1320 460 T1600 470 V500 H1000 Z" fill="#74c69d" />
      <path d="M1000 470 Q1080 446 1160 466" stroke="#95d5b2" strokeWidth="6" fill="none" />

      {/* The yard in front of the station */}
      <path d={`M180 ${STATION_Y} H1010 Q1120 640 1300 ${YARD_BOTTOM} H0 V620 Q120 520 180 ${STATION_Y} Z`} fill="url(#fw-yard)" />
      <g stroke="#ffd60a" strokeWidth="5" fill="none" opacity="0.9">
        {BAYS.map(([l, r]) => (
          <path key={l} d={`${ray(l, STATION_Y, 700)} ${ray(r, STATION_Y, 700)}`} />
        ))}
      </g>
      <g fill="#7c848c">
        {PEBBLES.map(([x, y]) => (
          <ellipse key={`${x}${y}`} cx={x} cy={y} rx={5 * depthScale(y)} ry={2.5 * depthScale(y)} />
        ))}
      </g>
      {/* A drain cover in the yard */}
      <g transform={`translate(560 720) scale(${depthScale(720)})`}>
        <ellipse cx="0" cy="0" rx="30" ry="8" fill="#6c757d" />
        <path d="M-20 0 H20 M-14 -4 H14 M-14 4 H14" stroke="#495057" strokeWidth="2" />
      </g>
      {/* Kerb between the yard and the lawn */}
      <path d={`M0 ${YARD_BOTTOM} H1300`} stroke="#ced4da" strokeWidth="8" />
      <path d={`M1010 ${STATION_Y} Q1120 640 1300 ${YARD_BOTTOM}`} stroke="#ced4da" strokeWidth="6" fill="none" />

      {/* The hose from the hydrant to the firefighter's nozzle */}
      <path d="M820 596 C860 610 830 700 900 760 S1150 800 1214 789" stroke="#e63946" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M820 596 C860 610 830 700 900 760 S1150 800 1214 789" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="10 14" fill="none" />

      {/* The puddle where the hose has sprayed */}
      <g transform={transformOf(PUDDLE)}>
        <ellipse cx="0" cy="-6" rx="96" ry="20" fill="#74c0fc" />
        <ellipse cx="-24" cy="-10" rx="40" ry="6" fill="#d0ebff" opacity="0.7" />
      </g>

      {/* Grass tufts */}
      <g stroke="#40916c" strokeWidth="5" strokeLinecap="round" fill="none">
        {TUFTS.map(([x, y]) => (
          <path key={`${x}-${y}`} d="M0 0 q4 -24 12 -30 M10 0 q0 -26 -6 -36 M20 0 q2 -20 12 -26" transform={`translate(${x} ${y}) scale(${depthScale(y)})`} />
        ))}
      </g>
      {/* Little flowers in the lawn */}
      <g>
        {[
          [80, 900, "#fff"],
          [500, 860, "#ffd60a"],
          [840, 960, "#fff"],
          [1400, 880, "#ff8fab"],
          [1580, 720, "#fff"],
        ].map(([x, y, colour]) => (
          <g key={`${x}`} transform={`translate(${x} ${y}) scale(${depthScale(Number(y))})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={7 * Math.cos((a * Math.PI) / 180)} cy={7 * Math.sin((a * Math.PI) / 180)} r="5" fill={String(colour)} />
            ))}
            <circle r="4" fill="#ffb703" />
          </g>
        ))}
      </g>
    </>
  );
}
