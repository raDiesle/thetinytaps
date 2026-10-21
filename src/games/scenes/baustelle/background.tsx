import { Cloud, INK, nth } from "./shared";

// Far-away city above the hills: [x, top, width].
const TOWERS = [
  [10, 420, 60],
  [80, 380, 50],
  [140, 440, 70],
  [230, 400, 46],
  [290, 452, 64],
  [1300, 430, 54],
  [1364, 390, 48],
  [1424, 446, 70],
  [1506, 410, 56],
];

// Soft shadows under everything standing on the ground: [cx, cy, rx].
const SHADOWS = [
  [235, 718, 170],
  [702, 597, 64],
  [720, 655, 52],
  [1045, 603, 200],
  [807, 603, 44],
  [1480, 657, 112],
  [1290, 653, 40],
  [1430, 746, 72],
  [1545, 767, 42],
  [780, 860, 200],
  [1170, 860, 210],
  [255, 990, 62],
  [470, 992, 92],
  [1192, 996, 54],
  [1440, 994, 26],
  [940, 996, 70],
  [1066, 994, 32],
  [92, 996, 48],
  [108, 572, 34],
];

function Skyline() {
  return (
    <g>
      {TOWERS.map(([x, y, w]) => (
        <g key={x}>
          <rect x={x} y={y} width={w} height={570 - y} rx="4" fill="#cfdcf3" />
          <rect x={x + w - 10} y={y} width="10" height={570 - y} fill="#bccbe8" />
          {Array.from({ length: Math.floor((540 - y) / 26) }, (_, row) => (
            <path
              key={row}
              d={`M${x + 10} ${y + 18 + row * 26} h${w / 2 - 16} M${x + w / 2 + 2} ${y + 18 + row * 26} h${w / 2 - 16}`}
              stroke="#e7eefa"
              strokeWidth="8"
            />
          ))}
        </g>
      ))}
    </g>
  );
}

function Tree({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 6} y={y} width="12" height="50" fill="#8d5a2b" />
      <circle cx={x} cy={y - 10} r="34" fill="#52b788" />
      <circle cx={x - 22} cy={y + 6} r="22" fill="#40916c" />
      <circle cx={x + 22} cy={y + 4} r="24" fill="#40916c" />
      <circle cx={x - 10} cy={y - 22} r="12" fill="#74c69d" />
    </g>
  );
}

/** Mesh fence panels with orange feet along the back of the site. */
function Fence() {
  return (
    <g>
      <defs>
        <pattern id="bs-mesh" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 0 L14 14 M14 0 L0 14" stroke="#adb5bd" strokeWidth="1.5" />
        </pattern>
      </defs>
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <rect x={i * 82} y="520" width="80" height="70" fill="url(#bs-mesh)" stroke="#adb5bd" strokeWidth="4" />
          <rect x={i * 82 - 8} y="588" width="18" height="10" rx="3" fill="#ff8c42" />
        </g>
      ))}
    </g>
  );
}

/** A red car that drives past behind the trucks now and then. */
function Car() {
  return (
    <g className="bs-car">
      <path d="M-160 790 Q-150 770 -125 770 H-95 Q-75 770 -66 790 Z" fill="#ff5d73" />
      <path d="M-148 789 Q-140 776 -124 776 H-112 V789 Z M-106 789 V776 H-96 Q-82 776 -76 789 Z" fill="#bde0fe" />
      <rect x="-172" y="788" width="120" height="24" rx="10" fill="#ff5d73" />
      <rect x="-172" y="790" width="120" height="6" rx="3" fill="#ff8fa3" />
      <circle cx="-56" cy="798" r="4" fill="#ffd60a" />
      <circle cx="-150" cy="814" r="11" fill="#2b2d42" />
      <circle cx="-76" cy="814" r="11" fill="#2b2d42" />
      <circle cx="-150" cy="814" r="4" fill="#ced4da" />
      <circle cx="-76" cy="814" r="4" fill="#ced4da" />
    </g>
  );
}

function Flowers() {
  return (
    <g>
      <path d="M1512 995 V950 M1548 995 V935 M1584 995 V955" stroke="#40916c" strokeWidth="5" />
      <path d="M1530 978 q10 -14 18 -4 M1566 984 q10 -14 18 -4" stroke="#40916c" strokeWidth="5" fill="none" />
      {[
        [1512, 946, "#ff7bd0"],
        [1548, 931, "#ffd60a"],
        [1584, 951, "#8e7dff"],
      ].map(([cx, cy, color]) => (
        <g key={cx}>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={cx} cy={Number(cy) - 10} r="7" fill={String(color)} transform={`rotate(${a} ${cx} ${cy})`} />
          ))}
          <circle cx={cx} cy={cy} r="6" fill="#fff4d6" />
        </g>
      ))}
    </g>
  );
}

export function Background() {
  return (
    <>
      <defs>
        <linearGradient id="bs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc8fb" />
          <stop offset="1" stopColor="#e3f4ff" />
        </linearGradient>
        <linearGradient id="bs-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d79f" />
          <stop offset="1" stopColor="#ecbd78" />
        </linearGradient>
        <radialGradient id="bs-sunglow">
          <stop offset="0" stopColor="#fff3b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="590" fill="url(#bs-sky)" />
      <circle cx="1460" cy="120" r="170" fill="url(#bs-sunglow)" />
      <Cloud x={1240} y={260} scale={0.7} className="bs-cloud" />
      <Cloud x={560} y={300} scale={0.5} className="bs-cloud bs-cloud-slow" />
      {/* Birds far away */}
      <path d="M520 220 q8 -8 16 0 q8 -8 16 0 M580 196 q6 -6 12 0 q6 -6 12 0" stroke="#5c677d" strokeWidth="3" fill="none" />
      <Skyline />
      <path d="M0 540 Q160 470 360 520 T760 500 T1180 505 T1600 500 V600 H0 Z" fill="#d8f3dc" />
      <path d="M0 560 Q200 490 420 545 T860 535 T1300 525 T1600 540 V600 H0 Z" fill="#b7e4c7" />
      <Tree x={610} y={510} />
      <Fence />
      <rect y="570" width="1600" height="430" fill="url(#bs-ground)" />
      <ellipse cx="760" cy="640" rx="90" ry="14" fill="#e0b070" />
      <ellipse cx="1420" cy="672" rx="70" ry="10" fill="#e0b070" />
      <path d="M140 740 q30 -8 60 0 t60 0 t60 0" stroke="#e0b070" strokeWidth="8" fill="none" />
      <g fill="#d4a373" opacity="0.6">
        {[
          [180, 600],
          [420, 750],
          [640, 610],
          [1110, 640],
          [1250, 700],
          [330, 760],
          [880, 620],
          [600, 990],
          [1290, 960],
          [870, 900],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" />
        ))}
      </g>
      <g fill="#c9ada7">
        <ellipse cx="440" cy="740" rx="12" ry="7" />
        <ellipse cx="1110" cy="640" rx="10" ry="6" />
      </g>

      <g fill={INK} opacity="0.14">
        {SHADOWS.map(([cx, cy, rx]) => (
          <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={rx} ry={Math.max(6, rx * 0.12)} />
        ))}
      </g>

      {/* Dirt pile the digger is working on */}
      <path d="M455 714 Q560 600 670 714 Z" fill="#c68b59" />
      <path d="M500 700 Q560 630 620 700" stroke="#d9a066" strokeWidth="10" fill="none" opacity="0.7" />
      <g fill="#a86f45">
        <circle cx="520" cy="690" r="6" />
        <circle cx="575" cy="668" r="5" />
        <circle cx="610" cy="700" r="7" />
      </g>

      {/* Pallet of bricks below the crane */}
      <rect x="676" y="644" width="88" height="10" rx="2" fill="#8d5a2b" />
      <g fill="#e76f51" stroke="#f4a261" strokeWidth="2">
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect key={`${row}-${col}`} x={680 + col * 27 + (row % 2) * 6} y={626 - row * 18} width="27" height="18" />
          )),
        )}
      </g>

      {/* Barrier at the left edge */}
      <g>
        <path d="M30 700 V770 M110 700 V770" stroke={INK} strokeWidth="6" />
        <rect x="16" y="700" width="110" height="22" rx="4" fill="#fff" />
        <path d="M30 700 l-14 22 M58 700 l-14 22 M86 700 l-14 22 M114 700 l-14 22" stroke="#ff5d73" strokeWidth="12" />
        <rect x="16" y="700" width="110" height="22" rx="4" fill="none" stroke={INK} strokeWidth="3" />
        <circle className="bs-blink" cx="30" cy="694" r="7" fill="#ffd60a" />
        <circle className="bs-blink" cx="110" cy="694" r="7" fill="#ffd60a" style={nth(1)} />
      </g>

      {/* Road with kerbs */}
      <rect y="770" width="1600" height="96" fill="#6c757d" />
      <g fill="#5f676f">
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={(i * 97) % 1600} cy={784 + ((i * 37) % 76)} r="2.5" />
        ))}
      </g>
      <Car />
      <rect y="762" width="1600" height="10" fill="#ced4da" />
      <rect y="866" width="1600" height="18" fill="#dee2e6" />
      <path
        d={Array.from({ length: 27 }, (_, i) => `M${i * 60} 762 v10 M${i * 60 + 30} 866 v18`).join(" ")}
        stroke="#adb5bd"
        strokeWidth="2"
      />
      <path d="M0 818 H1600" stroke="#fff" strokeWidth="8" strokeDasharray="50 40" />
      <ellipse cx="320" cy="846" rx="36" ry="10" fill="#495057" />
      <path d="M296 846 H344 M306 840 H334 M306 852 H334" stroke="#6c757d" strokeWidth="2" />

      {/* Front edge: grass tufts and flowers */}
      <g stroke="#52b788" strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M6 1000 q4 -24 12 -30 M16 1000 q0 -26 -6 -36" />
        <path d="M630 1000 q4 -24 12 -30 M640 1000 q0 -26 -6 -36" />
        <path d="M1300 1000 q4 -24 12 -30 M1310 1000 q0 -26 -6 -36 M1320 1000 q2 -20 12 -26" />
      </g>
      <Flowers />
    </>
  );
}
