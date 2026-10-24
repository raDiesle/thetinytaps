import type { ReactNode, SVGProps } from "react";
import { Eye, Face, GLASS, INK, Inside, SKIN, nth } from "../shared";
import { Helmet, Lid, SUIT, Sparkles, ellipsePath, starPath } from "./parts";

// Everything up in space. Each drawing has its middle at (0, 0) and is placed with `space`.

const EARTH_LAND = [
  "M-62 -38 Q-44 -64 -12 -54 Q4 -38 -14 -22 Q-30 -8 -26 12 Q-32 30 -50 22 Q-68 0 -62 -38 Z",
  "M18 -12 Q40 -30 62 -14 Q72 8 58 28 Q44 50 28 40 Q14 20 18 -12 Z",
  "M-24 52 Q-2 44 16 58 Q2 72 -20 66 Z",
  "M30 -62 Q46 -70 58 -58 Q48 -48 34 -52 Z",
];
const EARTH_CLOUDS = ["M-50 -6 q20 -8 40 0", "M8 -42 q22 -8 44 0", "M-14 34 q18 -6 36 0"];

/** The land and clouds repeat every 160 units, so sliding them by 160 looks like the earth turning. */
function Repeat({ className, children, ...props }: { className: string; children: ReactNode } & SVGProps<SVGGElement>) {
  return (
    <g className={className} {...props}>
      {[-160, 0, 160].map((dx) => (
        <g key={dx} transform={`translate(${dx} 0)`}>
          {children}
        </g>
      ))}
    </g>
  );
}

/** The blue earth with green land; it turns, its clouds drift and it blinks. */
export function Erde() {
  const ball = ellipsePath(0, 0, 80);
  return (
    <>
      <circle className="wa-erde-glow" cx="0" cy="0" r="92" fill="#74c0fc" opacity="0.25" />
      <g className="wa-erde-body" style={{ transformOrigin: "0px 0px" }}>
        <circle cx="0" cy="0" r="80" fill="#4dabf7" />
        <Inside d={ball}>
          <Repeat className="wa-erde-land" fill="#69db7c">
            {EARTH_LAND.map((d) => (
              <path key={d} d={d} />
            ))}
          </Repeat>
          <Repeat className="wa-erde-clouds" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.85">
            {EARTH_CLOUDS.map((d) => (
              <path key={d} d={d} />
            ))}
          </Repeat>
          <circle cx="18" cy="20" r="80" fill="#1864ab" opacity="0.22" />
        </Inside>
        <path d="M-52 -44 Q-30 -66 0 -70" stroke="#fff" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.5" />
        <Face cx={0} cy={12} size={1.8} />
        <Lid cx={-12.6} cy={12} r={5.8} fill="#4dabf7" />
        <Lid cx={12.6} cy={12} r={5.8} fill="#4dabf7" />
      </g>
      <Sparkles
        className="wa-erde-sparkle"
        spots={[
          [-92, -60],
          [92, -66],
          [96, 58],
          [-94, 62],
        ]}
        r={12}
        fill="#fff3bf"
      />
    </>
  );
}

const MARS_SPOTS = [
  [-24, -14, 10, 7],
  [14, 12, 13, 9],
  [-8, 30, 7, 5],
  [28, -22, 6, 4],
];

/** Red Mars with craters; it spins and bounces, and its tiny moon flies around it. */
export function Mars() {
  const ball = ellipsePath(0, 0, 44);
  return (
    <>
      <g className="wa-mars-moon" style={{ transformOrigin: "0px 0px" }}>
        <circle cx="66" cy="-26" r="9" fill="#ced4da" />
        <circle cx="63" cy="-28" r="2.5" fill="#adb5bd" />
      </g>
      <g className="wa-mars-body" style={{ transformOrigin: "0px 0px" }}>
        <circle cx="0" cy="0" r="44" fill="#e8613c" />
        <Inside d={ball}>
          <g className="wa-mars-spots" fill="#c4452d">
            {[-88, 0, 88].map((dx) => (
              <g key={dx} transform={`translate(${dx} 0)`}>
                {MARS_SPOTS.map(([x, y, rx, ry]) => (
                  <ellipse key={x} cx={x} cy={y} rx={rx} ry={ry} />
                ))}
              </g>
            ))}
          </g>
          <ellipse cx="0" cy="-40" rx="22" ry="8" fill="#fff" opacity="0.9" />
          <circle cx="10" cy="12" r="44" fill="#9c2f1c" opacity="0.22" />
        </Inside>
        <path d="M-28 -24 Q-16 -36 0 -38" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.4" />
        <Face cx={0} cy={4} size={1} />
        <Lid cx={-7} cy={4} r={3.2} fill="#e8613c" />
        <Lid cx={7} cy={4} r={3.2} fill="#e8613c" />
      </g>
    </>
  );
}

/** The big yellow star: it spins, shines and winks. */
export function Stern() {
  return (
    <>
      <g className="wa-stern-rays" stroke="#ffe066" strokeWidth="5" strokeLinecap="round" style={{ transformOrigin: "0px 0px" }}>
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="0" y1="-50" x2="0" y2="-62" transform={`rotate(${i * 45})`} />
        ))}
      </g>
      <g className="wa-stern-body" style={{ transformOrigin: "0px 0px" }}>
        <path d={starPath(0, 3, 40, 20)} fill="#ffb703" />
        <path d={starPath(0, 0, 38, 19)} fill="#ffd60a" />
        <path d={starPath(-4, -6, 15, 7)} fill="#fff" opacity="0.35" />
        <Face cx={0} cy={2} size={0.85} />
        <g className="wa-stern-wink">
          <circle cx="5.95" cy="2" r="4" fill="#ffd60a" />
          <path d="M2.5 2 Q6 5 9.5 2" stroke="#2b2d42" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </>
  );
}

/** A shooting star: it zooms away and comes back with a sparkling trail. */
export function Sternschnuppe() {
  return (
    <>
      <g className="wa-schnuppe-body">
        <path d="M-44 4 L92 -42 L96 -34 L-38 32 Z" fill="#fff3bf" opacity="0.45" />
        <path d="M-44 12 L94 -38 L-40 24 Z" fill="#fff" opacity="0.7" />
        <path d={starPath(-50, 18, 22, 10)} fill="#ffd60a" />
        <path d={starPath(-53, 14, 9, 4)} fill="#fff" opacity="0.55" />
      </g>
      <Sparkles
        className="wa-schnuppe-dust"
        spots={[
          [-8, -8],
          [28, -20],
          [62, -32],
          [-30, 44],
        ]}
        r={8}
        fill="#fff3bf"
      />
    </>
  );
}

/** A lumpy little asteroid with a face; it tumbles and loses some crumbs. */
export function Asteroid() {
  return (
    <>
      <g className="wa-asteroid-bits" fill="#a5a3b5">
        {[
          [32, -28],
          [-36, 24],
          [36, 26],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" style={nth(i)} />
        ))}
      </g>
      <g className="wa-asteroid-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-30 -8 Q-28 -28 -6 -30 Q16 -34 28 -16 Q36 4 24 22 Q6 32 -14 26 Q-34 18 -30 -8 Z" fill="#9a95ab" />
        <path d="M-14 26 Q6 32 24 22 Q36 4 28 -16 Q30 10 10 20 Q-6 26 -14 26 Z" fill="#76718a" />
        <circle cx="-14" cy="-16" r="6" fill="#817c95" />
        <circle cx="16" cy="-18" r="4" fill="#817c95" />
        <circle cx="18" cy="12" r="4.5" fill="#817c95" />
        <Eye cx={-7} cy={1} r={2.8} />
        <Eye cx={8} cy={1} r={2.8} />
        <path d="M-4 9 Q1 13 6 9" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </>
  );
}

/** An icy comet with a long glowing tail; it swishes its tail and sparkles. */
export function Komet() {
  return (
    <>
      <Sparkles
        className="wa-komet-sparkle"
        spots={[
          [0, -26],
          [40, 20],
          [78, -16],
          [110, 10],
        ]}
        r={8}
        fill="#d0ebff"
      />
      <g className="wa-komet-body">
        <g className="wa-komet-tail" style={{ transformOrigin: "-62px 0px" }}>
          <path d="M-62 -20 Q20 -34 112 -30 Q30 -8 -62 20 Z" fill="#a5d8ff" opacity="0.55" />
          <path d="M-62 -12 Q20 -18 104 -6 Q20 4 -62 14 Z" fill="#d0ebff" opacity="0.8" />
          <path d="M-62 -6 Q10 -4 90 16 Q10 8 -62 8 Z" fill="#fff" opacity="0.8" />
        </g>
        <circle className="wa-komet-glow" cx="-62" cy="0" r="30" fill="#d0ebff" opacity="0.35" />
        <circle cx="-62" cy="0" r="20" fill="#e7f5ff" />
        <circle cx="-69" cy="-7" r="6" fill="#fff" />
        <Face cx={-62} cy={-2} size={0.55} />
      </g>
    </>
  );
}

const UFO_LIGHTS = ["#ffd60a", "#ff6b6b", "#69db7c", "#4dabf7", "#ff8fa3"];

/** The flying saucer: it wobbles, its lights blink, a beam shines down and the little alien inside waves. */
export function Ufo() {
  const dome = "M-40 -16 A40 42 0 0 1 40 -16 Z";
  return (
    <>
      <g className="wa-ufo-beam">
        <path d="M-28 14 L28 14 L84 150 L-84 150 Z" fill="#fff3bf" opacity="0.55" />
        <path d="M-14 14 L14 14 L40 150 L-40 150 Z" fill="#fff" opacity="0.5" />
      </g>
      <g className="wa-ufo-body" style={{ transformOrigin: "0px 0px" }}>
        <g className="wa-ufo-antenna" style={{ transformOrigin: "0px -56px" }}>
          <path d="M0 -56 V-74" stroke={INK} strokeWidth="3" />
          <circle cx="0" cy="-78" r="6" fill="#ff6b6b" />
        </g>
        <path d={dome} fill={GLASS} />
        <Inside d={dome}>
          <g className="wa-ufo-pilot">
            <path d="M-8 -40 L-14 -52 M8 -40 L14 -52" stroke="#40c057" strokeWidth="3" strokeLinecap="round" />
            <circle cx="-14" cy="-53" r="3.5" fill="#ffd60a" />
            <circle cx="14" cy="-53" r="3.5" fill="#ffd60a" />
            <circle cx="0" cy="-26" r="17" fill="#8ce99a" />
            <Face cx={0} cy={-29} size={0.7} />
          </g>
          <g className="wa-ufo-arm" style={{ transformOrigin: "16px -12px" }}>
            <path d="M16 -12 L30 -30" stroke="#8ce99a" strokeWidth="6" strokeLinecap="round" />
            <circle cx="31" cy="-32" r="4.5" fill="#8ce99a" />
          </g>
        </Inside>
        <path d="M-26 -42 Q-12 -54 6 -54" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
        <ellipse cx="0" cy="8" rx="56" ry="13" fill="#868e96" />
        <ellipse cx="0" cy="-6" rx="90" ry="22" fill="#ced4da" />
        <ellipse cx="0" cy="-13" rx="72" ry="9" fill="#e9ecef" />
        <path d="M-84 0 Q0 22 84 0" stroke="#adb5bd" strokeWidth="3" fill="none" />
        {UFO_LIGHTS.map((colour, i) => (
          <circle key={colour} className="wa-ufo-light" cx={-64 + i * 32} cy={i === 0 || i === 4 ? -1 : 3} r="7" fill={colour} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

function StationWing({ x }: { x: number }) {
  return (
    <>
      <rect x={x} y="-44" width="58" height="88" rx="4" fill="#3a6fd8" />
      <path d={`M${x} -15 h58 M${x} 15 h58 M${x + 19} -44 v88 M${x + 39} -44 v88`} stroke="#74a7ff" strokeWidth="2.5" />
      <path d={`M${x + 6} -38 h14`} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    </>
  );
}

/** The space station: its solar wings turn, the windows light up and someone looks out. */
export function Raumstation() {
  const window = ellipsePath(0, -2, 7.5);
  return (
    <g className="wa-station-body" style={{ transformOrigin: "0px 0px" }}>
      <path d="M-118 0 H118" stroke="#adb5bd" strokeWidth="6" />
      <g className="wa-station-wing" style={{ transformOrigin: "-93px 0px" }}>
        <StationWing x={-122} />
      </g>
      <g className="wa-station-wing" style={{ transformOrigin: "93px 0px", ...nth(1) }}>
        <StationWing x={64} />
      </g>
      <rect x="-58" y="-24" width="116" height="48" rx="22" fill="#e9ecef" />
      <path d="M-50 14 Q0 30 50 14 V18 Q0 34 -50 18 Z" fill="#ced4da" />
      <path d="M-22 -24 V24 M22 -24 V24" stroke="#ced4da" strokeWidth="4" />
      <path d="M0 -24 V-40" stroke="#adb5bd" strokeWidth="3" />
      <circle className="wa-station-beacon" cx="0" cy="-44" r="5" fill="#ff6b6b" />
      {[-40, 0, 40].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="-2" r="10" fill="#adb5bd" />
          <circle cx={x} cy="-2" r="7.5" fill={GLASS} />
          {x === 0 && (
            <Inside d={window}>
              <g className="wa-station-face">
                <circle cx="0" cy="0" r="6" fill={SKIN} />
                <circle cx="-2.2" cy="-1" r="1.1" fill="#2b2d42" />
                <circle cx="2.2" cy="-1" r="1.1" fill="#2b2d42" />
                <path d="M-2 2 Q0 3.5 2 2" stroke="#2b2d42" strokeWidth="0.9" fill="none" />
              </g>
            </Inside>
          )}
          <circle className="wa-station-light" cx={x} cy="-2" r="7.5" fill="#ffe066" style={nth(i)} />
        </g>
      ))}
    </g>
  );
}

/** An astronaut floating on a line from the space station: drifts, kicks and waves. */
export function Astronaut() {
  return (
    <>
      <path d="M-24 -4 Q-60 -10 -54 -50 Q-50 -80 -84 -96" stroke="#ced4da" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g className="wa-astro-body" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-28" y="-14" width="14" height="36" rx="5" fill="#adb5bd" />
        <g className="wa-astro-leg" style={{ transformOrigin: "-8px 24px" }}>
          <rect x="-16" y="18" width="14" height="34" rx="7" fill={SUIT} />
          <rect x="-18" y="44" width="18" height="10" rx="5" fill="#868e96" />
        </g>
        <g className="wa-astro-leg" style={{ transformOrigin: "8px 24px", ...nth(1) }}>
          <rect x="2" y="18" width="14" height="34" rx="7" fill={SUIT} />
          <rect x="2" y="44" width="18" height="10" rx="5" fill="#868e96" />
        </g>
        <path d="M-16 -10 Q-30 -4 -26 10" stroke={SUIT} strokeWidth="11" strokeLinecap="round" fill="none" />
        <circle cx="-25" cy="12" r="6" fill="#ced4da" />
        <rect x="-20" y="-18" width="40" height="44" rx="14" fill={SUIT} />
        <rect x="-10" y="-6" width="20" height="14" rx="3" fill="#dee2e6" />
        <circle cx="-4" cy="1" r="2.5" fill="#ff6b6b" />
        <circle cx="4" cy="1" r="2.5" fill="#4dabf7" />
        <g className="wa-astro-arm" style={{ transformOrigin: "16px -10px" }}>
          <path d="M16 -10 L32 -28" stroke={SUIT} strokeWidth="11" strokeLinecap="round" />
          <circle cx="34" cy="-31" r="6.5" fill="#ced4da" />
        </g>
        <Helmet cx={0} cy={-34} r={24} hair="#e09f3e" />
        <Sparkles className="wa-astro-glint" spots={[[-9, -44]]} r={6} />
      </g>
    </>
  );
}

/** Yellow Saturn with its ring: the ring turns, the planet rocks, two little moons fly past and it winks. */
export function Saturn() {
  const ball = ellipsePath(0, 0, 52);
  return (
    <>
      <g className="wa-saturn-moons" fill="#e9ecef">
        <circle cx="-128" cy="-30" r="8" style={nth(0)} />
        <circle cx="126" cy="34" r="6" style={nth(1)} />
      </g>
      <g className="wa-saturn-body" style={{ transformOrigin: "0px 0px" }}>
        <g transform="rotate(-14)">
          <path d="M-108 0 A108 26 0 0 1 108 0" stroke="#e9c46a" strokeWidth="13" fill="none" />
          <path d="M-92 0 A92 20 0 0 1 92 0" stroke="#f4a261" strokeWidth="5" fill="none" />
          <path className="wa-saturn-spin" d="M-108 0 A108 26 0 0 1 108 0" stroke="#fff" strokeWidth="3" strokeDasharray="8 18" fill="none" opacity="0.6" />
        </g>
        <circle cx="0" cy="0" r="52" fill="#f6c453" />
        <Inside d={ball}>
          <rect x="-60" y="-32" width="120" height="10" fill="#f4a261" opacity="0.55" />
          <rect x="-60" y="30" width="120" height="10" fill="#f4a261" opacity="0.55" />
          <circle cx="12" cy="14" r="52" fill="#c77d1a" opacity="0.18" />
        </Inside>
        <path d="M-34 -30 Q-18 -46 4 -48" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.45" />
        <Face cx={0} cy={-6} size={1.3} />
        <g className="wa-saturn-wink">
          <circle cx="9.1" cy="-6" r="5.4" fill="#f6c453" />
          <path d="M4.5 -6 Q9.1 -2 13.7 -6" stroke="#2b2d42" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
        <g transform="rotate(-14)">
          <path d="M-108 0 A108 26 0 0 0 108 0" stroke="#e9c46a" strokeWidth="13" fill="none" />
          <path d="M-92 0 A92 20 0 0 0 92 0" stroke="#f4a261" strokeWidth="5" fill="none" />
          <path className="wa-saturn-spin" d="M-108 0 A108 26 0 0 0 108 0" stroke="#fff" strokeWidth="3" strokeDasharray="8 18" fill="none" opacity="0.6" />
        </g>
      </g>
    </>
  );
}

function SatWing({ x }: { x: number }) {
  return (
    <>
      <rect x={x} y="-15" width="48" height="30" rx="3" fill="#3a6fd8" />
      <path d={`M${x + 16} -15 v30 M${x + 32} -15 v30 M${x} 0 h48`} stroke="#74a7ff" strokeWidth="2" />
    </>
  );
}

/** A golden satellite: it turns, flaps its panels, blinks and sends out signals. */
export function Satellit() {
  return (
    <>
      <g className="wa-sat-waves" stroke="#ffe066" strokeWidth="4" fill="none" strokeLinecap="round">
        {[16, 28, 40].map((r, i) => (
          <path key={r} d={`M${-r * 0.5} ${-34 - r * 0.87} A${r} ${r} 0 0 1 ${r * 0.87} ${-34 - r * 0.5}`} style={nth(i)} />
        ))}
      </g>
      <g className="wa-sat-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-76 0 H76" stroke="#adb5bd" strokeWidth="4" />
        <g className="wa-sat-wing" style={{ transformOrigin: "-28px 0px" }}>
          <SatWing x={-78} />
        </g>
        <g className="wa-sat-wing" style={{ transformOrigin: "28px 0px", ...nth(1) }}>
          <SatWing x={30} />
        </g>
        <rect x="-22" y="-20" width="44" height="40" rx="6" fill="#f4c542" />
        <path d="M-16 -8 L-4 -14 L8 -6 L18 -12 M-16 8 L-2 2 L10 10 L18 4" stroke="#e0a800" strokeWidth="2" fill="none" />
        <path d="M0 -20 V-28" stroke="#adb5bd" strokeWidth="3" />
        <path d="M-14 -28 Q0 -42 14 -28 Q0 -32 -14 -28 Z" fill="#e9ecef" />
        <circle className="wa-sat-light" cx="14" cy="-12" r="4" fill="#ff6b6b" />
      </g>
    </>
  );
}

const CLUSTER = [
  [-62, -14, 16],
  [-28, 16, 13],
  [6, -24, 21],
  [40, 10, 14],
  [68, -16, 17],
];

/** A little group of stars; they twinkle one after the other. */
export function Sterne() {
  return (
    <>
      <path
        className="wa-sterne-lines"
        d="M-62 -14 L-28 16 L6 -24 L40 10 L68 -16"
        stroke="#fff3bf"
        strokeWidth="2.5"
        strokeDasharray="4 6"
        fill="none"
        opacity="0.35"
      />
      {CLUSTER.map(([x, y, r], i) => (
        <g key={i} className="wa-sterne-star" style={{ transformOrigin: `${x}px ${y}px`, ...nth(i) }}>
          <path d={starPath(x, y, r, r * 0.45)} fill={i === 2 ? "#ffd60a" : "#fff3bf"} />
          {i === 2 && (
            <>
              <Eye cx={x - 5} cy={y} r={2.4} />
              <Eye cx={x + 5} cy={y} r={2.4} />
            </>
          )}
        </g>
      ))}
    </>
  );
}
