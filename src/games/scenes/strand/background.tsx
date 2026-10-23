import { HORIZON, depthScale, transformOf } from "../layout";
import { Cloud, nth } from "../shared";
import { LIGHTHOUSE, TOWEL, shoreY } from "./layout";

// A summer beach. Far away a hazy headland and a few sailing boats sit on the horizon; the sea
// gets lighter and more turquoise towards the water's edge, with little wave lines that get
// bigger nearer the front. The wet sand along the water line is darker, with a seam of foam;
// the dry sand behind it is dotted with pebbles, shells, footprints and tufts of beach grass,
// and the striped towel lies under the sunshade.

const XS = Array.from({ length: 35 }, (_, i) => i * 50 - 50);
const shoreLine = XS.map((x) => `${x} ${shoreY(x)}`).join(" L");

/** Wave lines spread over the sea, denser far away, never below the water's edge. */
const SEA_LINES = Array.from({ length: 52 }, (_, i) => {
  const x = (i * 337) % 1640 - 20;
  const t = ((i * 53) % 52) / 52;
  const y = HORIZON + 14 + t * t * (shoreY(x) - HORIZON - 40);
  return [x, y];
});

// Pebbles and shells on the sand: [x, y, kind].
const PEBBLES = Array.from({ length: 46 }, (_, i) => {
  const x = (i * 211) % 1620 - 10;
  const t = ((i * 37) % 46) / 46;
  const top = shoreY(x) + 40;
  return [x, top + Math.sqrt(t) * (990 - top), i % 5];
});

// Tufts of beach grass: [x, y].
const GRASS = [
  [20, 650],
  [1580, 640],
  [40, 880],
  [1590, 900],
  [1240, 700],
  [470, 700],
];

// Footprints running from the front towards the water: [x, y].
const STEPS = Array.from({ length: 9 }, (_, i) => {
  const y = 990 - i * 44;
  return [1420 - i * 22 + (i % 2) * 18, y];
});

function Distance() {
  return (
    <g>
      {/* A hazy headland on the left, a tiny ship and two sails far away */}
      <path d={`M0 ${HORIZON} V${HORIZON - 34} Q80 ${HORIZON - 58} 180 ${HORIZON - 30} Q260 ${HORIZON - 12} 340 ${HORIZON} Z`} fill="#b9d4e8" />
      <path d={`M0 ${HORIZON - 20} Q60 ${HORIZON - 40} 120 ${HORIZON - 28}`} stroke="#d0e3f1" strokeWidth="5" fill="none" />
      <path d={`M1300 ${HORIZON} Q1400 ${HORIZON - 22} 1500 ${HORIZON - 16} Q1560 ${HORIZON - 14} 1600 ${HORIZON - 20} V${HORIZON} Z`} fill="#c5dcec" />
      <g fill="#fff" opacity="0.85">
        <path d={`M420 ${HORIZON - 2} V${HORIZON - 26} L436 ${HORIZON - 4} Z`} />
        <path d={`M1240 ${HORIZON - 2} V${HORIZON - 22} L1253 ${HORIZON - 4} Z`} />
      </g>
      <path d={`M412 ${HORIZON - 2} h28`} stroke="#9fb7cc" strokeWidth="3" />
      <path d={`M1234 ${HORIZON - 2} h24`} stroke="#9fb7cc" strokeWidth="3" />
    </g>
  );
}

/** The sea from the horizon to the water's edge, with its wave lines and the glitter of the sun. */
function Sea() {
  return (
    <g>
      <path d={`M-50 ${HORIZON} H1650 L${shoreLine} Z`} fill="url(#sd-sea)" />
      <path d={`M-50 ${HORIZON} H1650`} stroke="#a5d8ff" strokeWidth="3" />
      {/* Glitter of the sun on the water */}
      <g fill="#fff" opacity="0.7">
        {[
          [1380, 344, 40],
          [1430, 356, 28],
          [1350, 366, 22],
          [1460, 372, 34],
          [1400, 388, 18],
        ].map(([x, y, w]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={w * depthScale(y)} height={3 * depthScale(y)} rx="1.5" />
        ))}
      </g>
      <g className="sd-sea-lines" stroke="#d0ebff" strokeLinecap="round" fill="none" opacity="0.8">
        {SEA_LINES.map(([x, y], i) => {
          const s = depthScale(y);
          return <path key={i} className="sd-sea-wave" d={`M${x} ${y} q${10 * s} ${-7 * s} ${20 * s} 0 q${10 * s} ${7 * s} ${20 * s} 0`} strokeWidth={3 * s} style={nth(i % 4)} />;
        })}
      </g>
      {/* Foam where the waves break on the lighthouse rock */}
      <g transform={transformOf(LIGHTHOUSE)}>
        <path d="M-130 8 Q-60 -4 0 6 Q60 -4 130 8" stroke="#e7f5ff" strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
}

/** The beach: wet sand at the water's edge with a seam of foam, dry sand behind it. */
function Beach() {
  const wet = XS.map((x) => `${x} ${shoreY(x) + 26 * depthScale(shoreY(x))}`).join(" L");
  return (
    <g>
      <path d={`M${shoreLine} L1650 1010 H-50 Z`} fill="url(#sd-sand)" />
      <path d={`M${shoreLine} L${[...XS].reverse().map((x) => `${x} ${shoreY(x) + 26 * depthScale(shoreY(x))}`).join(" L")} Z`} fill="#e4bf82" />
      <path d={`M${wet}`} stroke="#ecd09a" strokeWidth="4" fill="none" opacity="0.8" />
      <g className="sd-foam">
        <path d={`M${XS.map((x) => `${x} ${shoreY(x) - 2}`).join(" L")}`} stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.9" />
        {XS.filter((_, i) => i % 2).map((x, i) => {
          const y = shoreY(x);
          const s = depthScale(y);
          return <ellipse key={x} cx={x + (i % 3) * 8} cy={y + 2} rx={14 * s} ry={4 * s} fill="#fff" opacity="0.85" />;
        })}
      </g>
      {/* Ripples in the sand */}
      <g stroke="#ecc88a" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8">
        {[
          [200, 760],
          [880, 700],
          [1060, 900],
          [620, 980],
          [1300, 640],
          [1500, 870],
        ].map(([x, y]) => {
          const s = depthScale(y);
          return <path key={`${x}-${y}`} d={`M${x} ${y} q${30 * s} ${-10 * s} ${60 * s} 0 q${30 * s} ${10 * s} ${60 * s} 0 M${x + 20 * s} ${y + 14 * s} q${30 * s} ${-10 * s} ${60 * s} 0`} />;
        })}
      </g>
      {PEBBLES.map(([x, y, kind], i) => {
        const s = depthScale(y);
        if (kind === 0) return <path key={i} d={`M${x - 8 * s} ${y} Q${x} ${y - 12 * s} ${x + 8 * s} ${y} Z`} fill="#ffc9c9" />;
        if (kind === 1) return <circle key={i} cx={x} cy={y} r={4 * s} fill="#fff" opacity="0.8" />;
        return <ellipse key={i} cx={x} cy={y} rx={6 * s} ry={3.5 * s} fill={kind === 2 ? "#ced4da" : "#d9b27a"} />;
      })}
      {STEPS.map(([x, y], i) => {
        const s = depthScale(y);
        return <ellipse key={i} cx={x} cy={y} rx={7 * s} ry={4 * s} fill="#e2b46a" opacity="0.6" />;
      })}
      <g stroke="#94b86a" strokeWidth="5" strokeLinecap="round" fill="none">
        {GRASS.map(([x, y]) => (
          <path key={`${x}-${y}`} d="M0 0 q-6 -30 -20 -44 M6 0 q0 -36 4 -56 M12 0 q8 -26 24 -38 M-6 0 q-10 -18 -26 -22" transform={`translate(${x} ${y}) scale(${depthScale(y)})`} />
        ))}
      </g>
    </g>
  );
}

/** The striped towel under the sunshade, in the towel's coordinates. */
function Towel() {
  return (
    <g transform={transformOf(TOWEL)}>
      <path d="M-90 14 L250 14 L216 -46 L-60 -46 Z" fill="#ff8787" />
      {[0, 1, 2, 3, 4].map((i) => {
        const t = 0.1 + i * 0.2;
        return <path key={i} d={`M${-90 + 340 * t - 8} 14 L${-60 + 276 * t - 6} -46 h12 L${-90 + 340 * t + 8} 14 Z`} fill="#fff" />;
      })}
      <path d="M-90 14 L250 14" stroke="#e8590c" strokeWidth="4" opacity="0.4" />
    </g>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="sd-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#74c0fc" />
          <stop offset="1" stopColor="#e7f5ff" />
        </linearGradient>
        <linearGradient id="sd-sea" x1="0" y1={HORIZON} x2="0" y2="610" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#5fa8e0" />
          <stop offset="0.5" stopColor="#4dabf7" />
          <stop offset="1" stopColor="#66d9e8" />
        </linearGradient>
        <linearGradient id="sd-sand" x1="0" y1="470" x2="0" y2="1000" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fbe3b0" />
          <stop offset="0.5" stopColor="#f6d89c" />
          <stop offset="1" stopColor="#efc982" />
        </linearGradient>
        <radialGradient id="sd-sunglow">
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height={HORIZON + 10} fill="url(#sd-sky)" />
      <circle cx="1480" cy="90" r="150" fill="url(#sd-sunglow)" />
      <Cloud x={1150} y={200} scale={0.36} className="sd-cloud" />
      <Cloud x={200} y={250} scale={0.26} className="sd-cloud sd-cloud-slow" />
      <Distance />
      <Sea />
      <Beach />
      <Towel />
    </>
  );
}
