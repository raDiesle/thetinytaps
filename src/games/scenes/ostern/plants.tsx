import type { CSSProperties } from "react";
import { Hideout } from "../hideout";
import { nth, sparklePath } from "../shared";
import { Notes } from "../spielplatz/parts";
import { Blades, Blossom, Egg, type EggPattern } from "./parts";

// Trees, bushes and flowers of the Easter garden. Foot point at (0, 0).

function Sparkles({ className, spots, r = 10, fill = "#fff" }: { className: string; spots: number[][]; r?: number; fill?: string }) {
  return (
    <g className={className} fill={fill}>
      {spots.map(([x, y], i) => (
        <path key={i} d={sparklePath(x, y, r)} style={nth(i)} />
      ))}
    </g>
  );
}

/** Falling petals or leaves: each drifts down by --dx / --dy while the item plays. */
function Falling({ className, spots, fill, rx = 7, ry = 4 }: { className: string; spots: number[][]; fill: string; rx?: number; ry?: number }) {
  return (
    <g className={className} fill={fill}>
      {spots.map(([x, y, dx, dy], i) => (
        <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} style={{ ...nth(i), "--dx": `${dx}px`, "--dy": `${dy}px` } as CSSProperties} />
      ))}
    </g>
  );
}

// ---------- Kirschbaum ----------

const CROWN: [number, number, number, string][] = [
  [-190, -370, 86, "#ffadc9"],
  [-60, -400, 110, "#ffb8d1"],
  [90, -410, 104, "#ffadc9"],
  [200, -380, 78, "#ffc2d9"],
  [-210, -480, 80, "#ffc2d9"],
  [-100, -530, 104, "#ffc2d9"],
  [60, -540, 110, "#ffd1e3"],
  [190, -490, 82, "#ffc2d9"],
  [-20, -620, 76, "#ffd6e7"],
  [120, -610, 60, "#ffd6e7"],
  [-140, -600, 56, "#ffd1e3"],
];

/** Blossom dots on the crown: [x, y]. */
const BLOSSOMS = [
  [-220, -400],
  [-150, -330],
  [-90, -440],
  [-20, -360],
  [50, -450],
  [120, -370],
  [200, -420],
  [240, -360],
  [-180, -500],
  [-60, -560],
  [30, -590],
  [110, -520],
  [180, -540],
  [-120, -620],
  [70, -640],
  [-10, -500],
  [-240, -460],
  [150, -460],
];

/** The blossoming cherry tree; the blackbird's nest sits on its right branch (an item of its own). */
export function Kirschbaum() {
  return (
    <>
      <path d="M-34 0 Q-24 -120 -22 -230 L-64 -330 L-46 -340 L-8 -262 L-4 -380 L14 -380 L16 -262 L58 -344 L76 -332 L26 -232 Q26 -120 34 0 Z" fill="#8d5f45" />
      <path d="M-4 -40 Q-2 -120 0 -220 M16 -60 Q14 -140 14 -200" stroke="#a47148" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* The branch to the nest */}
      <path d="M18 -228 Q100 -252 236 -246" stroke="#8d5f45" strokeWidth="13" strokeLinecap="round" fill="none" />
      <g className="os-kb-crown" style={{ transformOrigin: "0px -240px" }}>
        {CROWN.map(([cx, cy, r, fill], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={fill} />
        ))}
        {/* Darker underside and soft light on top */}
        <path
          d="M-270 -360 Q-200 -270 -100 -300 Q0 -280 100 -310 Q200 -290 276 -370 Q200 -320 100 -340 Q0 -310 -100 -330 Q-200 -300 -270 -360 Z"
          fill="#f799b9"
          opacity="0.5"
        />
        <ellipse cx="-80" cy="-600" rx="70" ry="26" fill="#fff" opacity="0.4" />
        {BLOSSOMS.map(([x, y], i) => (
          <Blossom key={i} x={x} y={y} r={13} fill="#fff" centre="#ff6b9a" className="os-kb-blossom" i={i} />
        ))}
      </g>
      <Falling
        className="os-kb-petal"
        fill="#ffc2d9"
        spots={[
          [-200, -320, -30, 300],
          [-120, -300, 20, 280],
          [-40, -290, -20, 270],
          [60, -300, 30, 290],
          [140, -310, -10, 280],
          [-240, -380, 10, 320],
          [220, -340, 40, 300],
          [0, -320, 50, 300],
        ]}
      />
    </>
  );
}

// ---------- Osterstrauch ----------

/** Eggs hanging from the branches: [hanging x, hanging y, colour, deco, pattern]. */
const HANGING: [number, number, string, string, EggPattern][] = [
  [-150, -316, "#ff6b6b", "#fff", "zigzag"],
  [-96, -372, "#74c0fc", "#fff", "dots"],
  [-30, -398, "#ffd43b", "#ff922b", "stripes"],
  [44, -388, "#b197fc", "#fff", "hearts"],
  [118, -340, "#69db7c", "#fff", "waves"],
  [160, -262, "#ff8fab", "#fff", "dots"],
  [-160, -236, "#ffa94d", "#fff", "waves"],
  [-70, -290, "#e599f7", "#fff", "zigzag"],
  [60, -296, "#4dabf7", "#ffe066", "stripes"],
  [0, -330, "#ff6b6b", "#ffe066", "dots"],
];

/** An Easter egg tree: a young tree with fresh green buds, hung with painted eggs. */
export function Osterstrauch() {
  return (
    <>
      <ellipse cx="0" cy="-6" rx="70" ry="16" fill="#69c26b" />
      <path d="M-12 0 Q-8 -90 -6 -170 L6 -170 Q8 -90 12 0 Z" fill="#a47148" />
      <g className="os-strauch-top" style={{ transformOrigin: "0px -150px" }}>
        <g stroke="#a47148" strokeLinecap="round" fill="none">
          <path d="M0 -160 Q-80 -220 -150 -316 M-60 -210 Q-120 -220 -170 -236 M0 -170 Q-50 -280 -96 -372 M-40 -250 Q-70 -270 -70 -290" strokeWidth="8" />
          <path d="M0 -170 Q-10 -300 -30 -398 M0 -170 Q30 -300 44 -388 M10 -190 Q80 -260 118 -340 M10 -170 Q100 -200 160 -262" strokeWidth="8" />
          <path d="M0 -240 Q0 -290 0 -330 M30 -250 Q50 -270 60 -296" strokeWidth="5" />
        </g>
        {/* Fresh green buds and little leaves */}
        <g fill="#8ce99a">
          {[
            [-120, -270],
            [-80, -320],
            [-40, -360],
            [-20, -300],
            [20, -360],
            [60, -340],
            [90, -300],
            [130, -250],
            [-130, -228],
            [-110, -340],
            [100, -380],
            [-60, -400],
            [10, -420],
            [140, -300],
            [-150, -280],
          ].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="9" ry="5" transform={`rotate(${i * 37} ${x} ${y})`} fill={i % 3 ? "#8ce99a" : "#b2f2bb"} />
          ))}
        </g>
        {HANGING.map(([x, y, fill, deco, pattern], i) => (
          <g key={i} className="os-strauch-egg" style={{ ...nth(i), transformOrigin: `${x}px ${y}px` }}>
            <path d={`M${x} ${y} V${y + 14}`} stroke="#fff" strokeWidth="2" />
            <Egg cx={x} by={y + 50} w={30} h={38} fill={fill} deco={deco} pattern={pattern} />
          </g>
        ))}
      </g>
      {/* A yellow bow on the trunk */}
      <path d="M0 -120 L-24 -134 L-24 -106 Z M0 -120 L24 -134 L24 -106 Z" fill="#ffd43b" />
      <circle cx="0" cy="-120" r="6" fill="#fab005" />
      <Sparkles
        className="os-strauch-spark"
        spots={[
          [-190, -380],
          [170, -400],
          [-200, -200],
          [200, -190],
          [0, -450],
        ]}
        r={12}
        fill="#fff3bf"
      />
    </>
  );
}

// ---------- Hohler Baum (Kopfweide) ----------

/** Pussy willow shoots: [tip x, tip y]. */
const SHOOTS = [
  [-150, -380],
  [-120, -430],
  [-70, -460],
  [-20, -470],
  [30, -468],
  [80, -450],
  [126, -420],
  [156, -370],
];

/**
 * An old pollard willow with pussy willow shoots. The yellow egg sits in the big hole at
 * the bottom (an item of its own); a woodpecker knocks, and up in the knothole someone else peeks out.
 */
export function HohlerBaum() {
  return (
    <>
      <g className="os-weide-shoots" style={{ transformOrigin: "0px -280px" }}>
        {SHOOTS.map(([x, y], i) => (
          <g key={i}>
            <path d={`M${x * 0.25} -284 Q${x * 0.55} ${(y - 284) / 2 - 20} ${x} ${y}`} stroke="#9c6644" strokeWidth="4" fill="none" strokeLinecap="round" />
            {[0.35, 0.55, 0.75, 0.95].map((t) => {
              const px = x * 0.25 + (x - x * 0.25) * t;
              const py = -284 + (y + 284) * t - 10 * Math.sin(t * Math.PI);
              return (
                <ellipse
                  key={t}
                  cx={px + 4}
                  cy={py}
                  rx="5"
                  ry="8"
                  fill="#e9ecef"
                  stroke="#ced4da"
                  strokeWidth="1.5"
                  transform={`rotate(${x / 6} ${px + 4} ${py})`}
                />
              );
            })}
          </g>
        ))}
      </g>
      <path d="M-82 0 Q-70 -60 -64 -140 Q-68 -230 -88 -272 Q-50 -304 0 -296 Q50 -304 88 -272 Q68 -230 64 -140 Q70 -60 82 0 Z" fill="#8d6e63" />
      <path d="M-88 -272 Q-50 -304 0 -296 Q50 -304 88 -272 Q50 -284 0 -278 Q-50 -284 -88 -272 Z" fill="#6d4c41" />
      <g stroke="#6d4c41" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M-50 -250 Q-46 -200 -54 -150 M44 -260 Q50 -240 46 -232 M-30 -20 Q-34 -60 -50 -90 M54 -20 Q50 -60 56 -100" />
      </g>
      <path d="M-82 0 Q-70 -60 -64 -140 Q-58 -60 -60 0 Z" fill="#6d4c41" opacity="0.5" />
      {/* The big hole at the bottom, where the yellow egg hides */}
      <path d="M-40 -6 Q-46 -98 0 -104 Q46 -98 40 -6 Z" fill="#3e2723" />
      <path d="M-40 -6 Q-46 -98 0 -104 Q46 -98 40 -6" stroke="#a1887f" strokeWidth="5" fill="none" />
      {/* The knothole up high: someone else peeks out of it every time */}
      <rect x="10" y="-222" width="44" height="52" rx="18" fill="#3e2723" />
      <Hideout x={10} y={-222} w={44} h={52} size={46} />
      <rect x="10" y="-222" width="44" height="52" rx="18" fill="none" stroke="#a1887f" strokeWidth="5" />
      {/* The woodpecker clings to the left side and knocks */}
      <g>
        <path d="M-84 -150 L-98 -122 L-86 -124 Z" fill="#212529" />
        <ellipse cx="-80" cy="-170" rx="14" ry="24" fill="#212529" />
        <ellipse cx="-76" cy="-162" rx="8" ry="14" fill="#f8f9fa" />
        <path d="M-90 -178 Q-96 -160 -88 -146" stroke="#f8f9fa" strokeWidth="3" fill="none" />
        <circle cx="-72" cy="-148" r="5" fill="#e03131" />
        <g className="os-specht-head" style={{ transformOrigin: "-78px -188px" }}>
          <circle cx="-76" cy="-198" r="13" fill="#f8f9fa" />
          <path d="M-88 -202 Q-80 -218 -66 -208 Z" fill="#e03131" />
          <path d="M-88 -204 Q-80 -214 -66 -206" stroke="#212529" strokeWidth="4" fill="none" />
          <path d="M-64 -198 L-48 -194 L-64 -192 Z" fill="#495057" />
          <circle cx="-72" cy="-200" r="2.6" fill="#212529" />
          <circle cx="-71" cy="-201" r="0.9" fill="#fff" />
        </g>
      </g>
      <g className="os-specht-chips" fill="#bcaaa4">
        {[
          [-40, -206],
          [-34, -190],
          [-44, -180],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="6" height="4" style={nth(i)} />
        ))}
      </g>
      <Notes x={-150} y={-250} texts={["Tock!", "Tock!"]} colour="#ffd43b" size={24} />
    </>
  );
}

// ---------- Forsythie ----------

const BUSH: [number, number, number, string][] = [
  [-120, -80, 64, "#fcc419"],
  [120, -84, 62, "#fcc419"],
  [0, -110, 96, "#ffd43b"],
  [-70, -180, 70, "#ffe066"],
  [70, -190, 70, "#ffe066"],
  [-140, -150, 44, "#ffd43b"],
  [140, -150, 44, "#ffd43b"],
  [0, -236, 44, "#fff3bf"],
];

/** The forsythia: a big round bush full of yellow blossoms. The green egg hides underneath. */
export function Forsythie() {
  return (
    <>
      <g stroke="#a47148" strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M-6 0 Q-30 -60 -120 -110 M0 0 Q0 -60 -10 -150 M6 0 Q40 -60 120 -110" />
      </g>
      <g className="os-busch-body" style={{ transformOrigin: "0px 0px" }}>
        {BUSH.map(([cx, cy, r, fill], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={fill} />
        ))}
        <path
          d="M-180 -80 Q-150 -20 -60 -30 Q0 -14 60 -30 Q150 -20 180 -80 Q120 -50 60 -60 Q0 -44 -60 -60 Q-120 -50 -180 -80 Z"
          fill="#f59f00"
          opacity="0.45"
        />
        <g stroke="#a47148" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7">
          <path d="M-150 -120 Q-80 -170 -40 -240 M150 -120 Q80 -170 40 -240 M-20 -60 Q-60 -110 -140 -140 M20 -60 Q60 -110 140 -140" />
        </g>
        {Array.from({ length: 30 }, (_, i) => {
          const x = -150 + ((i * 97) % 300);
          const y = -40 - ((i * 53) % 210);
          return (
            <g key={i} fill={i % 2 ? "#fab005" : "#fff3bf"} transform={`rotate(${i * 23} ${x} ${y})`}>
              <ellipse cx={x} cy={y - 5} rx="3" ry="6" />
              <ellipse cx={x} cy={y + 5} rx="3" ry="6" />
              <ellipse cx={x - 5} cy={y} rx="6" ry="3" />
              <ellipse cx={x + 5} cy={y} rx="6" ry="3" />
            </g>
          );
        })}
        <ellipse cx="-40" cy="-220" rx="40" ry="14" fill="#fff" opacity="0.4" />
      </g>
      <Falling
        className="os-busch-petal"
        fill="#ffd43b"
        rx={6}
        ry={4}
        spots={[
          [-150, -100, -20, 100],
          [-80, -60, 10, 70],
          [40, -70, -10, 80],
          [130, -90, 20, 100],
          [-20, -160, 30, 160],
          [90, -170, -20, 170],
        ]}
      />
    </>
  );
}

// ---------- Tulpen ----------

/** Tulips: [x, height, colour, darker]. */
const TULIPS: [number, number, string, string][] = [
  [-88, 104, "#ff6b6b", "#e03131"],
  [-44, 128, "#ffd43b", "#fab005"],
  [0, 112, "#f783ac", "#e64980"],
  [44, 134, "#b197fc", "#7950f2"],
  [88, 100, "#ffa94d", "#f76707"],
];

/** A flower bed with five tulips; tapped, they sway one after the other and open their petals. */
export function Tulpen() {
  return (
    <>
      <ellipse cx="0" cy="-12" rx="124" ry="24" fill="#8d5a3b" />
      <ellipse cx="0" cy="-16" rx="108" ry="15" fill="#a0673d" />
      {TULIPS.map(([x, h, fill, dark], i) => {
        const top = -16 - h;
        return (
          <g key={i} className="os-tulpe" style={{ ...nth(i), transformOrigin: `${x}px -16px` }}>
            <path d={`M${x} -16 Q${x + (i % 2 ? 6 : -6)} ${-16 - h / 2} ${x} ${top}`} stroke="#40916c" strokeWidth="6" fill="none" />
            <path d={`M${x} -18 Q${x - 30} ${-40 - h / 3} ${x - 8} ${-30 - h / 1.6} Q${x - 4} ${-30 - h / 3} ${x} -18 Z`} fill="#52b788" />
            <path d={`M${x} -18 Q${x + 26} ${-30 - h / 4} ${x + 12} ${-24 - h / 2} Q${x + 6} ${-24 - h / 4} ${x} -18 Z`} fill="#40916c" />
            <ellipse cx={x} cy={top - 18} rx="17" ry="22" fill={dark} />
            <g className="os-tulpe-l" style={{ transformOrigin: `${x - 4}px ${top}px` }}>
              <path d={`M${x - 4} ${top} Q${x - 24} ${top - 6} ${x - 18} ${top - 40} Q${x - 6} ${top - 30} ${x} ${top - 20} Z`} fill={fill} />
            </g>
            <g className="os-tulpe-r" style={{ transformOrigin: `${x + 4}px ${top}px` }}>
              <path d={`M${x + 4} ${top} Q${x + 24} ${top - 6} ${x + 18} ${top - 40} Q${x + 6} ${top - 30} ${x} ${top - 20} Z`} fill={fill} />
            </g>
            <path
              d={`M${x - 10} ${top - 2} Q${x} ${top + 4} ${x + 10} ${top - 2} L${x + 6} ${top - 36} L${x} ${top - 26} L${x - 6} ${top - 36} Z`}
              fill={fill}
            />
            <path
              d={`M${x - 6} ${top - 10} Q${x - 8} ${top - 22} ${x - 4} ${top - 30}`}
              stroke="#fff"
              strokeOpacity="0.5"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        );
      })}
      {/* Stones along the front of the bed */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = Math.PI * (0.1 + (i * 0.8) / 8);
        return <ellipse key={i} cx={-124 * Math.cos(a)} cy={-10 + 22 * Math.sin(a)} rx="15" ry="9" fill={i % 2 ? "#ced4da" : "#dee2e6"} />;
      })}
      <Sparkles
        className="os-tulpe-spark"
        spots={[
          [-110, -150],
          [-20, -180],
          [70, -190],
          [120, -130],
        ]}
        r={11}
        fill="#fff3bf"
      />
    </>
  );
}

// ---------- Osterglocken ----------

/** Daffodils: [x, height]. */
const DAFFODILS: [number, number][] = [
  [-70, 118],
  [-24, 146],
  [24, 130],
  [72, 112],
];

/** A clump of daffodils ("Osterglocken"); tapped, the bells swing and ring. */
export function Osterglocken() {
  return (
    <>
      <Blades xs={[-96, -76, -50, -30, -6, 14, 40, 60, 84, 100]} shade="#40916c" height={70} />
      <Blades xs={[-86, -60, -16, 30, 70, 92]} shade="#52b788" height={56} />
      {DAFFODILS.map(([x, h], i) => {
        const cy = -h;
        return (
          <g key={i}>
            <path d={`M${x} 0 Q${x + (i % 2 ? -8 : 8)} ${-h / 2} ${x} ${cy + 12}`} stroke="#40916c" strokeWidth="6" fill="none" />
            <g className="os-glocke" style={{ ...nth(i), transformOrigin: `${x}px ${cy + 12}px` }}>
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <ellipse key={a} cx={x} cy={cy - 16} rx="10" ry="17" fill={i % 2 ? "#fff3bf" : "#ffe066"} transform={`rotate(${a} ${x} ${cy})`} />
              ))}
              <circle cx={x} cy={cy} r="14" fill="#ffa94d" />
              <circle cx={x} cy={cy} r="9" fill="#ff922b" />
              <circle cx={x} cy={cy} r="14" fill="none" stroke="#fd7e14" strokeWidth="3" strokeDasharray="4 3" />
            </g>
          </g>
        );
      })}
      <Notes x={-90} y={-190} texts={["Bimm!", "Bamm!"]} colour="#ffe066" size={28} />
    </>
  );
}

// ---------- Pusteblume ----------

/** Seeds around the head: angle in degrees, and where they fly to. */
const SEEDS = Array.from({ length: 14 }, (_, i) => {
  const a = (i * 360) / 14;
  return { a, dx: 70 + ((i * 37) % 80), dy: -60 - ((i * 53) % 90) };
});

/** A dandelion clock next to a yellow dandelion; tapped, the seeds fly away and grow back. */
export function Pusteblume() {
  const cx = -14;
  const cy = -168;
  return (
    <>
      <path
        d="M0 0 Q-30 -10 -54 -34 Q-40 -30 -36 -40 Q-30 -26 -20 -30 Q-14 -18 0 0 Z M0 0 Q30 -6 52 -30 Q40 -26 36 -36 Q28 -22 20 -26 Q12 -14 0 0 Z"
        fill="#40916c"
      />
      <path d={`M0 0 Q-10 -80 ${cx} ${cy}`} stroke="#69db7c" strokeWidth="5" fill="none" />
      <path d="M4 0 Q20 -60 38 -104" stroke="#69db7c" strokeWidth="5" fill="none" />
      <g className="os-puste-flower" style={{ transformOrigin: "38px -104px" }}>
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={i} cx="38" cy="-122" rx="4.5" ry="14" fill={i % 2 ? "#fcc419" : "#ffd43b"} transform={`rotate(${i * 30} 38 -110)`} />
        ))}
        <circle cx="38" cy="-110" r="8" fill="#fab005" />
      </g>
      {SEEDS.map(({ a, dx, dy }, i) => (
        <g key={i} className="os-puste-seed" style={{ ...nth(i), "--dx": `${dx}px`, "--dy": `${dy}px` } as CSSProperties}>
          <g transform={`rotate(${a} ${cx} ${cy})`}>
            <path d={`M${cx} ${cy} V${cy - 30}`} stroke="#dee2e6" strokeWidth="2" />
            <circle cx={cx} cy={cy - 34} r="7" fill="#fff" />
            <path d={`M${cx - 8} ${cy - 38} L${cx} ${cy - 32} L${cx + 8} ${cy - 38} M${cx} ${cy - 42} V${cy - 32}`} stroke="#e9ecef" strokeWidth="2" />
          </g>
        </g>
      ))}
      <circle cx={cx} cy={cy} r="7" fill="#c9b48a" />
    </>
  );
}
