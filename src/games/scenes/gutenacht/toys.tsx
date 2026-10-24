import { Hideout } from "../hideout";
import { INK, Inside, Wheel, nth } from "../shared";
import { Eyes, SleepyFace, Sparkles, Zzz, star } from "./parts";

// Toys on the floor. The rug is drawn in picture coordinates; every other toy has its foot
// point at (0, 0) and is placed on the floor with ground().

/** The round rug in the middle of the room: rings, a moon and stars that twinkle. */
export function Teppich() {
  const cx = 810;
  const cy = 690;
  return (
    <>
      <ellipse cx={cx} cy={cy} rx="340" ry="78" fill="#a5c8ec" />
      <g className="gn-teppich-ring" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <ellipse cx={cx} cy={cy} rx="290" ry="64" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="2 14" strokeLinecap="round" />
        <ellipse cx={cx} cy={cy} rx="230" ry="50" fill="#cdb4db" />
        <ellipse cx={cx} cy={cy} rx="160" ry="34" fill="#fde2e4" />
      </g>
      <path d={`M${cx - 30} ${cy - 18} a28 22 0 1 0 22 30 a22 17 0 1 1 -22 -30 Z`} fill="#ffe066" />
      {[
        [cx - 250, cy - 6],
        [cx + 250, cy + 4],
        [cx - 120, cy + 46],
        [cx + 130, cy - 44],
        [cx + 60, cy + 50],
        [cx - 170, cy - 42],
      ].map(([x, y], i) => (
        <path key={i} className="gn-teppich-star" style={{ ...nth(i % 3), transformOrigin: `${x}px ${y}px` }} d={star(x, y, 11)} fill="#fff3bf" />
      ))}
      <ellipse cx={cx} cy={cy} rx="340" ry="78" fill="none" stroke="#8fb5e0" strokeWidth="5" />
    </>
  );
}

const BLOCKS = [
  { x: -54, y: -56, w: 56, colour: "#4dabf7", mark: "circle" },
  { x: -50, y: -104, w: 48, colour: "#ffd43b", mark: "star" },
  { x: 20, y: -54, w: 54, colour: "#69db7c", mark: "heart" },
] as const;

/** A tower of building blocks with a roof, and one block beside it; they wobble and hop. */
export function Bausteine() {
  return (
    <>
      <g className="gn-turm" style={{ transformOrigin: "-26px 0px" }}>
        {BLOCKS.slice(0, 2).map((b, i) => (
          <Block key={i} {...b} i={i} />
        ))}
        <g className="gn-block" style={{ ...nth(2), transformOrigin: "-26px -104px" }}>
          <path d="M-52 -104 L-26 -150 L0 -104 Z" fill="#ff6b6b" />
          <path d="M-44 -108 L-26 -140" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        </g>
      </g>
      <Block {...BLOCKS[2]} i={3} />
    </>
  );
}

function Block({ x, y, w, colour, mark, i }: { x: number; y: number; w: number; colour: string; mark: string; i: number }) {
  const cx = x + w / 2;
  const cy = y + w / 2;
  return (
    <g className="gn-block" style={{ ...nth(i), transformOrigin: `${cx}px ${y + w}px` }}>
      <rect x={x} y={y} width={w} height={w} rx="6" fill={colour} />
      <rect x={x + 4} y={y + 4} width={w - 8} height={w - 8} rx="4" fill="#fff" opacity="0.25" />
      {mark === "circle" && <circle cx={cx} cy={cy} r={w * 0.2} fill="#fff" />}
      {mark === "star" && <path d={star(cx, cy, w * 0.28)} fill="#fff" />}
      {mark === "heart" && (
        <path
          d={`M${cx} ${cy + 9} C${cx - 16} ${cy - 2} ${cx - 10} ${cy - 16} ${cx} ${cy - 6} C${cx + 10} ${cy - 16} ${cx + 16} ${cy - 2} ${cx} ${cy + 9} Z`}
          fill="#fff"
        />
      )}
    </g>
  );
}

/** The rocking horse; it rocks to and fro, tosses its mane and swishes its tail. */
export function Schaukelpferd() {
  return (
    <>
      <g className="gn-pferd" style={{ transformOrigin: "0px 0px" }}>
        <g className="gn-pferd-tail" style={{ transformOrigin: "68px -118px" }}>
          <path d="M68 -118 Q96 -110 92 -70 M68 -114 Q88 -96 80 -66" stroke="#e8590c" strokeWidth="9" strokeLinecap="round" fill="none" />
        </g>
        {[
          [-58, -96, -82, -18],
          [-36, -96, -44, -8],
          [36, -96, 44, -8],
          [58, -96, 82, -18],
        ].map(([x1, y1, x2, y2], i) => (
          <path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={i === 1 || i === 2 ? "#f1e3d3" : "#fff4e6"} strokeWidth="13" strokeLinecap="round" />
        ))}
        <path d="M-134 -26 Q0 22 134 -26" stroke="#e63946" strokeWidth="13" strokeLinecap="round" fill="none" />
        <path d="M-120 -24 Q0 12 120 -24" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.35" fill="none" />
        <ellipse cx="0" cy="-112" rx="72" ry="30" fill="#fff4e6" />
        {[
          [-30, -118, 7],
          [18, -104, 6],
          [42, -122, 5],
          [-6, -126, 4],
        ].map(([x, y, r]) => (
          <circle key={x} cx={x} cy={y} r={r} fill="#ffd8a8" />
        ))}
        <path d="M-26 -136 Q0 -152 26 -136 V-118 H-26 Z" fill="#51cf66" />
        <path d="M-6 -118 V-80" stroke="#2f9e44" strokeWidth="4" />
        <path d="M-56 -128 Q-74 -150 -84 -184" stroke="#fff4e6" strokeWidth="30" strokeLinecap="round" fill="none" />
        <g className="gn-pferd-head" style={{ transformOrigin: "-70px -150px" }}>
          <ellipse cx="-100" cy="-186" rx="32" ry="19" fill="#fff4e6" transform="rotate(-22 -100 -186)" />
          <ellipse cx="-126" cy="-176" rx="10" ry="8" fill="#ffd8a8" />
          <circle cx="-128" cy="-178" r="2" fill={INK} />
          <path d="M-84 -204 L-76 -224 L-70 -200 Z" fill="#fff4e6" />
          <circle className="gn-open" cx="-98" cy="-192" r="3.6" fill={INK} />
          <path className="gn-shut" d="M-102 -192 q4 4 8 0" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <path d="M-112 -170 Q-104 -166 -98 -172" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M-90 -180 L-56 -136" stroke="#e63946" strokeWidth="3" />
        </g>
        <g className="gn-pferd-mane" style={{ transformOrigin: "-70px -170px" }}>
          <path
            d="M-80 -206 q14 2 10 14 q14 0 8 14 q14 2 6 16 q12 2 4 16"
            stroke="#e8590c"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </g>
      <Zzz x={-60} y={-226} />
    </>
  );
}

/** One wheel of the train, turning around its own centre. */
function TrainWheel({ cx }: { cx: number }) {
  return (
    <g className="gn-zug-wheel" style={{ transformOrigin: `${cx}px -14px` }}>
      <Wheel cx={cx} cy={-14} r={14} />
    </g>
  );
}

/** A wooden toy train: a green engine with a face and two wagons; it chugs along and back. */
export function Eisenbahn() {
  return (
    <>
      <path d="M-176 -2 H176" stroke="#b08968" strokeWidth="5" strokeLinecap="round" />
      <g className="gn-zug">
        <g className="gn-zug-smoke" fill="#fff">
          {[0, 1, 2].map((i) => (
            <circle key={i} style={nth(i)} cx={-138 + i * 6} cy={-124 - i * 6} r={8 + i * 3} />
          ))}
        </g>
        <rect x="-150" y="-112" width="22" height="36" rx="3" fill="#2f9e44" />
        <rect x="-154" y="-118" width="30" height="10" rx="4" fill="#2b8a3e" />
        <rect x="-164" y="-80" width="88" height="54" rx="16" fill="#40c057" />
        <rect x="-168" y="-74" width="10" height="44" rx="4" fill="#2b8a3e" />
        <path d="M-150 -70 H-90" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
        <Eyes cx={-122} cy={-56} gap={10} r={3.6} />
        <path d="M-128 -44 Q-122 -39 -116 -44" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <rect x="-84" y="-118" width="56" height="92" rx="6" fill="#2f9e44" />
        <rect x="-90" y="-126" width="68" height="12" rx="5" fill="#2b8a3e" />
        <rect x="-74" y="-106" width="36" height="28" rx="4" fill="#bde0fe" />
        <rect x="-170" y="-32" width="148" height="14" rx="4" fill="#495057" />
        {/* Wagons */}
        <path d="M-22 -26 H-6" stroke="#495057" strokeWidth="4" />
        <rect x="-8" y="-72" width="80" height="48" rx="6" fill="#ff6b6b" />
        <rect x="-2" y="-90" width="20" height="20" rx="3" fill="#ffd43b" />
        <rect x="22" y="-90" width="20" height="20" rx="3" fill="#4dabf7" />
        <path d="M46 -70 L56 -90 L66 -70 Z" fill="#69db7c" />
        <path d="M72 -26 H86" stroke="#495057" strokeWidth="4" />
        <rect x="84" y="-72" width="80" height="48" rx="6" fill="#ffd43b" />
        <circle cx="124" cy="-86" r="16" fill="#f783ac" />
        <path d="M110 -90 Q124 -96 138 -88" stroke="#fff" strokeWidth="3" fill="none" />
        {[-146, -104, -56, 6, 54, 102, 146].map((cx) => (
          <TrainWheel key={cx} cx={cx} />
        ))}
      </g>
      <Zzz x={-124} y={-136} />
    </>
  );
}

/** A red ball with a white band and a star; it bounces and rolls back. */
export function Ball() {
  return (
    <g className="gn-ball" style={{ transformOrigin: "0px 0px" }}>
      <g className="gn-ball-spin" style={{ transformOrigin: "0px -40px" }}>
        <circle cx="0" cy="-40" r="40" fill="#ff6b6b" />
        <path d="M-38 -52 Q0 -30 38 -52 L36 -30 Q0 -10 -36 -30 Z" fill="#fff" />
        <path d={star(0, -62, 10)} fill="#ffd43b" />
      </g>
      <path d="M-24 -62 Q-16 -72 -4 -74" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.5" fill="none" />
    </g>
  );
}

/** A doll's pram with the doll sleeping inside; it rocks gently. */
export function Puppenwagen() {
  return (
    <>
      <g className="gn-wagen" style={{ transformOrigin: "0px -20px" }}>
        <path d="M-48 -22 L-20 -60 M42 -22 L20 -60" stroke="#adb5bd" strokeWidth="5" strokeLinecap="round" />
        <path d="M60 -100 L92 -176" stroke="#adb5bd" strokeWidth="6" strokeLinecap="round" />
        <rect x="80" y="-188" width="28" height="12" rx="6" fill="#f4a6b8" />
        <path d="M-80 -110 H64 Q64 -52 0 -48 Q-80 -52 -80 -110 Z" fill="#f4a6b8" />
        <path d="M-70 -84 Q0 -66 56 -84" stroke="#fff" strokeWidth="4" strokeDasharray="2 10" strokeLinecap="round" fill="none" />
        <g className="gn-wagen-doll" style={{ transformOrigin: "-8px -110px" }}>
          <circle cx="-8" cy="-124" r="15" fill="#ffe0bd" />
          <path d="M-24 -126 Q-24 -144 -8 -144 Q8 -144 8 -126 Q-8 -138 -24 -126 Z" fill="#fff" />
          <SleepyFace cx={-8} cy={-124} size={0.6} />
        </g>
        <path d="M-30 -116 Q20 -124 62 -114 L64 -104 H-30 Z" fill="#fff" />
        <circle cx="10" cy="-112" r="3" fill="#f4a6b8" />
        <circle cx="40" cy="-112" r="3" fill="#f4a6b8" />
        <path d="M-86 -106 Q-88 -170 -26 -172 L-28 -106 Z" fill="#e58fa4" />
        <path d="M-80 -110 Q-76 -150 -30 -160 M-60 -108 Q-56 -136 -30 -140" stroke="#fff" strokeWidth="3" fill="none" opacity="0.5" />
        <Wheel cx={-48} cy={-20} r={20} />
        <Wheel cx={42} cy={-20} r={20} />
      </g>
      <Zzz x={20} y={-150} />
    </>
  );
}

/** A little robot on wheels: it waves its arms, turns its head, and its eyes and lamp go out. */
export function Roboter() {
  return (
    <>
      <g className="gn-robo" style={{ transformOrigin: "0px 0px" }}>
        <Wheel cx={-22} cy={-10} r={10} />
        <Wheel cx={22} cy={-10} r={10} />
        <rect x="-32" y="-28" width="64" height="14" rx="4" fill="#868e96" />
        {[-1, 1].map((s, i) => (
          <g key={s} className="gn-robo-arm" style={{ ...nth(i), transformOrigin: `${s * 34}px -80px` }}>
            <path d={`M${s * 34} -80 L${s * 50} -50`} stroke="#adb5bd" strokeWidth="8" strokeLinecap="round" />
            <path d={`M${s * 44} -44 q${s * 6} 10 ${s * 14} 2`} stroke="#748ffc" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
        ))}
        <rect x="-34" y="-98" width="68" height="72" rx="12" fill="#91a7ff" />
        <rect x="-22" y="-86" width="44" height="34" rx="6" fill="#e7f5ff" />
        <circle className="gn-robo-btn" style={nth(0)} cx="-10" cy="-70" r="5" fill="#ff6b6b" />
        <circle className="gn-robo-btn" style={nth(1)} cx="10" cy="-70" r="5" fill="#ffd43b" />
        <rect x="-14" y="-44" width="28" height="6" rx="3" fill="#748ffc" />
        <rect x="-6" y="-108" width="12" height="12" fill="#adb5bd" />
        <g className="gn-robo-head" style={{ transformOrigin: "0px -106px" }}>
          <path d="M0 -150 V-166" stroke="#adb5bd" strokeWidth="3" />
          <circle cx="0" cy="-170" r="6" fill="#c92a2a" />
          <circle className="gn-on" cx="0" cy="-170" r="6" fill="#ff8787" />
          <rect x="-30" y="-152" width="60" height="46" rx="12" fill="#748ffc" />
          <rect x="-36" y="-138" width="8" height="18" rx="3" fill="#5c7cfa" />
          <rect x="28" y="-138" width="8" height="18" rx="3" fill="#5c7cfa" />
          <g className="gn-open">
            <circle cx="-12" cy="-132" r="7" fill="#3bc9db" />
            <circle cx="12" cy="-132" r="7" fill="#3bc9db" />
            <circle cx="-10" cy="-134" r="2.4" fill="#fff" />
            <circle cx="14" cy="-134" r="2.4" fill="#fff" />
          </g>
          <path className="gn-shut" d="M-18 -132 H-6 M6 -132 H18" stroke="#364fc7" strokeWidth="3" strokeLinecap="round" />
          <path d="M-10 -116 H10" stroke="#364fc7" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
      <Zzz x={30} y={-176} />
    </>
  );
}

const TOP = "M0 0 L-42 -42 Q-46 -64 -20 -72 H20 Q46 -64 42 -42 Z";

/** A green spinning top: it spins, wobbles and slows down. */
export function Kreisel() {
  return (
    <>
      <g className="gn-kreisel" style={{ transformOrigin: "0px 0px" }}>
        <path d={TOP} fill="#51cf66" />
        <Inside d={TOP}>
          <path d="M-50 -52 H50 V-42 H-50 Z" fill="#ffd43b" />
          <g className="gn-kreisel-band">
            {[-66, -42, -18, 6, 30].map((x) => (
              <path key={x} d={`M${x} -72 h10 l-4 72 h-6 Z`} fill="#fff" opacity="0.4" />
            ))}
          </g>
        </Inside>
        <path d="M-30 -40 L-4 -8" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
        <rect x="-22" y="-80" width="44" height="10" rx="5" fill="#2f9e44" />
        <rect x="-5" y="-100" width="10" height="22" rx="4" fill="#adb5bd" />
        <circle cx="0" cy="-102" r="7" fill="#ff6b6b" />
      </g>
      <g className="gn-kreisel-swoosh" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round">
        <path d="M-58 -40 q-6 -14 4 -26" style={nth(0)} />
        <path d="M58 -40 q6 -14 -4 -26" style={nth(1)} />
      </g>
    </>
  );
}

/** A pair of bunny slippers; they hop one after the other and wiggle their ears. */
export function Hausschuhe() {
  return (
    <>
      {[-38, 38].map((cx, i) => (
        <g key={cx} className="gn-schuh" style={{ ...nth(i), transformOrigin: `${cx}px 0px` }}>
          {[-1, 1].map((s, j) => (
            <g key={s} className="gn-schuh-ear" style={{ ...nth(j), transformOrigin: `${cx + s * 9}px -30px` }}>
              <ellipse cx={cx + s * 11} cy="-50" rx="7" ry="20" fill="#ffdeeb" transform={`rotate(${s * 12} ${cx + s * 11} -50)`} />
              <ellipse cx={cx + s * 11} cy="-48" rx="3.5" ry="13" fill="#faa2c1" transform={`rotate(${s * 12} ${cx + s * 11} -48)`} />
            </g>
          ))}
          <ellipse cx={cx} cy="-18" rx="34" ry="19" fill="#ffdeeb" />
          <ellipse cx={cx} cy="-8" rx="30" ry="9" fill="#fcc2d7" />
          <Eyes cx={cx} cy={-24} gap={8} r={2.6} />
          <circle cx={cx} cy="-16" r="3" fill="#f06595" />
          <circle cx={cx - 14} cy="-14" r="4" fill="#ff8fa3" opacity="0.5" />
          <circle cx={cx + 14} cy="-14" r="4" fill="#ff8fa3" opacity="0.5" />
        </g>
      ))}
      <Zzz x={64} y={-62} />
    </>
  );
}

/** A yellow torch lying on the floor; its button clicks, and its beam goes out for the night. */
export function Taschenlampe() {
  return (
    <>
      <path className="gn-on gn-tlampe-beam" d="M72 -46 L220 -96 Q240 -24 220 48 L72 -2 Z" fill="#fff3bf" fillOpacity="0.45" />
      <g className="gn-tlampe" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-82" y="-42" width="116" height="36" rx="14" fill="#ffd43b" />
        {[-62, -50].map((x) => (
          <rect key={x} x={x} y="-42" width="6" height="36" fill="#fab005" />
        ))}
        <path d="M30 -40 L70 -54 V6 L30 -8 Z" fill="#fab005" />
        <ellipse cx="70" cy="-24" rx="8" ry="30" fill="#fff9db" />
        <ellipse className="gn-on" cx="70" cy="-24" rx="8" ry="30" fill="#fff" />
        <path d="M-70 -34 H20" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        <g className="gn-tlampe-btn" style={{ transformOrigin: "-20px -42px" }}>
          <rect x="-30" y="-50" width="20" height="10" rx="4" fill="#e63946" />
        </g>
      </g>
    </>
  );
}

/** The red toy chest: the lid is open and toys peek out; tapped, they duck in and the lid shuts. */
export function Spielzeugkiste() {
  return (
    <>
      <g className="gn-kiste-toys">
        {/* Duck */}
        <circle cx="-54" cy="-126" r="16" fill="#ffd43b" />
        <path d="M-40 -126 L-28 -122 L-40 -118 Z" fill="#fd7e14" />
        <circle cx="-50" cy="-130" r="2.4" fill={INK} />
        {/* Ball */}
        <circle cx="0" cy="-120" r="16" fill="#4dabf7" />
        <path d="M-14 -126 Q0 -118 14 -126" stroke="#fff" strokeWidth="4" fill="none" />
        {/* Star wand */}
        <path d="M46 -110 L58 -148" stroke="#be4bdb" strokeWidth="5" strokeLinecap="round" />
        <path d={star(60, -152, 14)} fill="#ffe066" />
      </g>
      {/* Someone else is hiding in the toy chest every time */}
      <Hideout x={-90} y={-210} w={180} h={120} size={70} />
      <rect x="-100" y="-112" width="200" height="112" rx="8" fill="#e76f51" />
      <path d="M-100 -76 H100 M-100 -40 H100" stroke="#d65a3c" strokeWidth="4" />
      <rect x="-100" y="-14" width="200" height="14" rx="4" fill="#c4553b" />
      <circle cx="0" cy="-58" r="30" fill="#f4a261" />
      <path d={star(0, -58, 22)} fill="#ffe066" />
      <path d="M-90 -104 V-20" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.3" />
      <g className="gn-kiste-lid" style={{ transformOrigin: "104px -112px" }}>
        <rect x="-106" y="-130" width="212" height="22" rx="8" fill="#d65a3c" />
        <path d="M-96 -124 H96" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
        <rect x="-12" y="-114" width="24" height="10" rx="3" fill="#ffd43b" />
      </g>
      <Sparkles x={0} y={-150} spread={70} count={3} colour="#ffe066" />
    </>
  );
}
