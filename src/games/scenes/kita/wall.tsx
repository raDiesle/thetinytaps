import { Cloud, Eye, Face, INK, Inside, SKIN, STEEL, nth } from "../shared";
import { SLEEP_WINDOW, WINDOW, WINDOW_GLASS } from "./layout";
import { Hearts, Lines, Notes, Puffs, Sparkles } from "./parts";

// Things on the back wall, all drawn in picture coordinates.

/** A sun, a duck, a star or an apple: the little pictures that show each child its own hook. */
function Symbol({ kind, x, y }: { kind: "sun" | "duck" | "star" | "apple"; x: number; y: number }) {
  if (kind === "sun")
    return (
      <>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <path key={a} d={`M${x} ${y - 10} V${y - 14}`} stroke="#fab005" strokeWidth="3" strokeLinecap="round" transform={`rotate(${a} ${x} ${y})`} />
        ))}
        <circle cx={x} cy={y} r="8" fill="#ffd43b" />
      </>
    );
  if (kind === "duck")
    return (
      <>
        <ellipse cx={x + 2} cy={y + 4} rx="11" ry="7" fill="#ffd43b" />
        <circle cx={x - 5} cy={y - 5} r="6" fill="#ffd43b" />
        <path d={`M${x - 11} ${y - 5} l-6 2 l6 2 Z`} fill="#ff922b" />
        <circle cx={x - 6} cy={y - 6} r="1.5" fill={INK} />
      </>
    );
  if (kind === "star") return <path d={`M${x} ${y - 13} l4 8 h9 l-7 6 l3 9 l-9 -5 l-9 5 l3 -9 l-7 -6 h9 Z`} fill="#7950f2" />;
  return (
    <>
      <circle cx={x} cy={y + 2} r="10" fill="#ff6b6b" />
      <path d={`M${x} ${y - 8} q2 -6 6 -7`} stroke="#6b4423" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx={x + 5} cy={y - 10} rx="4" ry="2.5" fill="#51cf66" />
    </>
  );
}

/** A picture tile above a hook, centred on (x, y). */
function Tile({ x, y, kind, cls, i }: { x: number; y: number; kind: "sun" | "duck" | "star" | "apple"; cls?: string; i?: number }) {
  return (
    <g className={cls} style={nth(i ?? 0)}>
      <rect x={x - 18} y={y - 18} width="36" height="36" rx="6" fill="#fff" stroke="#e9ecef" strokeWidth="2" />
      <Symbol kind={kind} x={x} y={y} />
    </g>
  );
}

// ---------- The entrance door ----------

const DOOR = "M40 42 H184 V330 H40 Z";

/** The red entrance door; the handle turns, it swings open and Mama looks in and waves. */
export function Tuer() {
  return (
    <>
      <rect x="28" y="30" width="168" height="300" rx="4" fill="#fff" />
      <Inside d={DOOR}>
        {/* The hallway behind the door, and Mama, who has come to pick someone up */}
        <rect x="40" y="42" width="144" height="288" fill="#fff3bf" />
        <rect x="40" y="250" width="144" height="80" fill="#ffe8a3" />
        <g className="ki-tuer-mama" style={{ transformOrigin: "112px 330px" }}>
          <path d="M70 330 V214 Q70 182 112 182 Q154 182 154 214 V330 Z" fill="#e64980" />
          <rect x="104" y="160" width="16" height="26" fill={SKIN} />
          <circle cx="112" cy="136" r="34" fill={SKIN} />
          <path d="M78 140 Q72 96 112 98 Q152 96 146 140 Q140 112 112 114 Q84 112 78 140 Z" fill="#495057" />
          <Face cx={112} cy={140} size={1} />
          <g className="ki-tuer-arm" style={{ transformOrigin: "148px 206px" }}>
            <path d="M148 206 L176 160" stroke="#e64980" strokeWidth="16" strokeLinecap="round" />
            <circle cx="178" cy="154" r="10" fill={SKIN} />
          </g>
        </g>
      </Inside>
      <g className="ki-tuer-door" style={{ transformOrigin: "40px 186px" }}>
        <rect x="40" y="42" width="144" height="288" fill="#ff6b6b" />
        <rect x="54" y="176" width="116" height="134" rx="8" fill="#fa5252" />
        <rect x="46" y="48" width="10" height="276" rx="5" fill="#fff" opacity="0.25" />
        {/* A round window and a sun sign */}
        <circle cx="112" cy="104" r="30" fill="#fff" />
        <circle cx="112" cy="104" r="24" fill="#d0ebff" />
        <path d="M100 90 L94 112 M112 84 L104 116" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        <g transform="translate(112 236)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <path key={a} d="M0 -26 V-34" stroke="#ffd43b" strokeWidth="5" strokeLinecap="round" transform={`rotate(${a})`} />
          ))}
          <circle r="22" fill="#ffd43b" />
          <circle cx="-8" cy="-4" r="3" fill={INK} />
          <circle cx="8" cy="-4" r="3" fill={INK} />
          <path d="M-8 6 Q0 13 8 6" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
        <g className="ki-tuer-handle" style={{ transformOrigin: "166px 190px" }}>
          <circle cx="166" cy="190" r="8" fill="#ced4da" />
          <rect x="140" y="186" width="28" height="9" rx="4" fill="#dee2e6" />
        </g>
      </g>
      <Lines x={198} y={120} colour="#ff6b6b" />
    </>
  );
}

// ---------- Birthday train ----------

/** The birthday train on the wall: it chugs, the wheels turn, the candle flickers and the present opens. */
export function Geburtstagszug() {
  const wagons = [
    { x: 226, colour: "#4dabf7" },
    { x: 290, colour: "#51cf66" },
    { x: 354, colour: "#ffd43b" },
  ];
  return (
    <>
      <path d="M212 94 H446" stroke="#c88b3a" strokeWidth="4" strokeLinecap="round" />
      <Puffs x={430} y={24} count={3} spread={14} r={8} colour="#f1f3f5" />
      <g className="ki-zug-train" style={{ transformOrigin: "330px 94px" }}>
        {/* Wagon 1: a present whose lid pops up */}
        <g className="ki-zug-present">
          <rect x="234" y="44" width="34" height="22" rx="2" fill="#f783ac" />
          <path d="M251 44 V66" stroke="#fff" strokeWidth="5" />
        </g>
        <g className="ki-zug-lid" style={{ transformOrigin: "234px 44px" }}>
          <rect x="231" y="38" width="40" height="8" rx="2" fill="#e64980" />
          <path d="M251 38 q-10 -10 -12 0 M251 38 q10 -10 12 0" stroke="#fff" strokeWidth="3" fill="none" />
        </g>
        {/* Wagon 2: a cake with a candle */}
        <rect x="300" y="52" width="34" height="14" rx="3" fill="#fff4e6" />
        <rect x="300" y="50" width="34" height="5" rx="2" fill="#ff8787" />
        <rect x="314" y="38" width="5" height="12" rx="2" fill="#74c0fc" />
        <g className="ki-zug-flame" style={{ transformOrigin: "316.5px 38px" }}>
          <path d="M316.5 26 Q322 33 316.5 38 Q311 33 316.5 26 Z" fill="#ff922b" />
        </g>
        {/* Wagon 3: a balloon */}
        <g className="ki-zug-balloon" style={{ transformOrigin: "382px 64px" }}>
          <path d="M382 64 Q378 50 384 40" stroke={INK} strokeWidth="1.5" fill="none" />
          <ellipse cx="384" cy="30" rx="11" ry="13" fill="#ff6b6b" />
          <ellipse cx="380" cy="25" rx="3" ry="4" fill="#fff" opacity="0.6" />
        </g>
        {wagons.map(({ x, colour }) => (
          <rect key={x} x={x} y="64" width="56" height="18" rx="4" fill={colour} />
        ))}
        <path d="M282 74 H290 M346 74 H354 M410 74 H416" stroke={INK} strokeWidth="3" />
        {/* Locomotive */}
        <rect x="416" y="58" width="30" height="24" rx="4" fill="#ff6b6b" />
        <rect x="406" y="42" width="22" height="40" rx="4" fill="#ff6b6b" />
        <rect x="410" y="46" width="14" height="12" rx="2" fill="#d0ebff" />
        <rect x="432" y="40" width="8" height="18" rx="2" fill={INK} />
        <rect x="429" y="36" width="14" height="6" rx="2" fill={INK} />
        {[236, 268, 300, 332, 364, 396, 422, 440].map((cx, i) => (
          <g key={cx} className="ki-zug-wheel" style={{ transformOrigin: `${cx}px 86px` }}>
            <circle cx={cx} cy="86" r={i > 5 ? 7 : 6} fill={INK} />
            <path d={`M${cx - 4} 86 H${cx + 4}`} stroke="#fff" strokeWidth="2" />
          </g>
        ))}
      </g>
    </>
  );
}

// ---------- Clock ----------

/** The round clock with a smiling face; it wobbles and the hands go round. */
export function Uhr() {
  const cx = 508;
  const cy = 62;
  return (
    <>
      <g className="ki-uhr-body" style={{ transformOrigin: `${cx}px ${cy - 36}px` }}>
        <circle cx={cx} cy={cy} r="38" fill="#74c0fc" />
        <circle cx={cx} cy={cy} r="31" fill="#fff" />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={cx + 25 * Math.sin((i * Math.PI) / 6)} cy={cy - 25 * Math.cos((i * Math.PI) / 6)} r={i % 3 ? 1.6 : 3} fill={["#ff6b6b", "#fab005", "#51cf66", "#7950f2"][i % 4]} />
        ))}
        <circle cx={cx - 9} cy={cy + 10} r="2.6" fill={INK} />
        <circle cx={cx + 9} cy={cy + 10} r="2.6" fill={INK} />
        <path d={`M${cx - 7} ${cy + 17} Q${cx} ${cy + 22} ${cx + 7} ${cy + 17}`} stroke={INK} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path className="ki-uhr-hour" d={`M${cx} ${cy} L${cx + 12} ${cy - 8}`} stroke={INK} strokeWidth="4.5" strokeLinecap="round" style={{ transformOrigin: `${cx}px ${cy}px` }} />
        <path className="ki-uhr-minute" d={`M${cx} ${cy} V${cy - 22}`} stroke="#ff6b6b" strokeWidth="3.2" strokeLinecap="round" style={{ transformOrigin: `${cx}px ${cy}px` }} />
        <circle cx={cx} cy={cy} r="3.5" fill={INK} />
        <path d={`M${cx - 27} ${cy - 20} Q${cx - 18} ${cy - 32} ${cx - 4} ${cy - 35}`} stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
      </g>
      <Lines x={cx + 46} y={cy} colour="#74c0fc" />
    </>
  );
}

// ---------- Coat hooks ----------

const JACKETS = [
  { x: 254, colour: "#ff922b", kind: "sun" as const },
  { x: 334, colour: "#4dabf7", kind: "duck" as const },
  { x: 414, colour: "#69db7c", kind: "star" as const },
];

/** A hook on the coat rail at (x, 164). */
function Hook({ x }: { x: number }) {
  return <path d={`M${x} 160 V170 Q${x} 178 ${x + 7} 176`} stroke={STEEL} strokeWidth="4" strokeLinecap="round" fill="none" />;
}

/** The coat hooks with a little picture for every child; the jackets swing and the pictures hop. */
export function Garderobe() {
  return (
    <>
      <rect x="214" y="146" width="318" height="16" rx="5" fill="#e9b872" />
      <rect x="214" y="158" width="318" height="4" fill="#c88b3a" />
      {JACKETS.map(({ x, kind }, i) => (
        <Tile key={x} x={x} y={122} kind={kind} cls="ki-garderobe-tile" i={i} />
      ))}
      {[254, 334, 414, 494].map((x) => (
        <Hook key={x} x={x} />
      ))}
      {JACKETS.map(({ x, colour }, i) => (
        <g key={x} className="ki-garderobe-jacket" style={{ ...nth(i), transformOrigin: `${x}px 172px` }}>
          {/* A hooded jacket: sleeves, body, zip and pockets */}
          <path d={`M${x - 24} 186 L${x - 40} 248 H${x - 26} L${x - 18} 212 Z`} fill={colour} />
          <path d={`M${x + 24} 186 L${x + 40} 248 H${x + 26} L${x + 18} 212 Z`} fill={colour} />
          <path d={`M${x - 16} 172 Q${x} 166 ${x + 16} 172 L${x + 30} 262 H${x - 30} Z`} fill={colour} />
          <path d={`M${x - 16} 172 Q${x} 196 ${x + 16} 172 Q${x} 160 ${x - 16} 172 Z`} fill="#000" opacity="0.15" />
          <path d={`M${x} 184 V262`} stroke="#fff" strokeWidth="3" opacity="0.6" />
          <rect x={x - 24} y="230" width="14" height="12" rx="3" fill="#fff" opacity="0.35" />
          <rect x={x + 10} y="230" width="14" height="12" rx="3" fill="#fff" opacity="0.35" />
        </g>
      ))}
      {/* A scarf on the blue jacket */}
      <g className="ki-garderobe-scarf" style={{ transformOrigin: "334px 180px" }}>
        <path d="M318 180 Q334 192 350 180 L346 192 Q334 200 322 192 Z" fill="#ff6b6b" />
        <path d="M340 192 L344 230 L334 232 L332 196 Z" fill="#ff6b6b" />
        <path d="M336 226 h10 M335 220 h10" stroke="#fff" strokeWidth="2" />
      </g>
    </>
  );
}

/** The red backpack on the last hook; it swings, the flap opens and an apple and a teddy ear peek out. */
export function Rucksack() {
  return (
    <>
      <Tile x={494} y={122} kind="apple" />
      <g className="ki-rucksack-bag" style={{ transformOrigin: "494px 172px" }}>
        <path d="M480 178 Q494 166 508 178" stroke="#c92a2a" strokeWidth="5" fill="none" />
        {/* What is inside: it pops up when the flap opens */}
        <g className="ki-rucksack-stuff">
          <circle cx="486" cy="190" r="10" fill="#ff6b6b" />
          <path d="M486 180 q1 -5 5 -6" stroke="#6b4423" strokeWidth="2.5" fill="none" />
          <circle cx="504" cy="188" r="8" fill="#c88b3a" />
          <circle cx="504" cy="188" r="4" fill="#e9b872" />
        </g>
        <rect x="468" y="186" width="52" height="64" rx="14" fill="#fa5252" />
        <rect x="478" y="222" width="32" height="20" rx="6" fill="#ff8787" />
        <rect x="476" y="190" width="6" height="52" rx="3" fill="#fff" opacity="0.25" />
        <g className="ki-rucksack-flap" style={{ transformOrigin: "494px 184px" }}>
          <path d="M466 184 Q466 178 474 178 H514 Q522 178 522 184 V206 Q494 216 466 206 Z" fill="#e03131" />
          <circle cx="494" cy="206" r="4" fill="#ffd43b" />
        </g>
      </g>
    </>
  );
}

// ---------- Children's drawings ----------

const DRAWINGS = [653, 747, 841, 935];

/** The children's drawings on a string with pegs; they flutter and swing. */
export function Bilder() {
  const sag = (x: number) => 16 + 18 * (1 - ((x - 800) / 200) ** 2);
  return (
    <>
      <path d="M600 14 Q800 52 1000 14" stroke="#adb5bd" strokeWidth="2.5" fill="none" />
      <circle cx="600" cy="14" r="4" fill={STEEL} />
      <circle cx="1000" cy="14" r="4" fill={STEEL} />
      {DRAWINGS.map((x, i) => {
        const y = sag(x);
        return (
          <g key={x} className="ki-bilder-sheet" style={{ ...nth(i), transformOrigin: `${x}px ${y}px` }}>
            <rect x={x - 34} y={y + 2} width="68" height="52" rx="2" fill="#fff" stroke="#e9ecef" strokeWidth="2" transform={`rotate(${(i % 2 ? 1 : -1) * 3} ${x} ${y})`} />
            {i === 0 && (
              <>
                <rect x={x - 18} y={y + 24} width="24" height="20" fill="#ff8787" />
                <path d={`M${x - 22} ${y + 25} L${x - 6} ${y + 12} L${x + 10} ${y + 25} Z`} fill="#c92a2a" />
                <circle cx={x + 18} cy={y + 16} r="7" fill="#ffd43b" />
                <path d={`M${x - 30} ${y + 46} H${x + 30}`} stroke="#51cf66" strokeWidth="4" />
              </>
            )}
            {i === 1 && (
              <g fill="none" strokeWidth="5">
                <path d={`M${x - 24} ${y + 46} A24 24 0 0 1 ${x + 24} ${y + 46}`} stroke="#ff6b6b" />
                <path d={`M${x - 18} ${y + 46} A18 18 0 0 1 ${x + 18} ${y + 46}`} stroke="#ffd43b" />
                <path d={`M${x - 12} ${y + 46} A12 12 0 0 1 ${x + 12} ${y + 46}`} stroke="#4dabf7" />
              </g>
            )}
            {i === 2 && (
              <>
                <ellipse cx={x} cy={y + 36} rx="16" ry="12" fill="#ffa94d" />
                <circle cx={x} cy={y + 20} r="10" fill="#ffa94d" />
                <path d={`M${x - 9} ${y + 14} l2 -9 l5 6 M${x + 9} ${y + 14} l-2 -9 l-5 6`} fill="#ffa94d" />
                <path d={`M${x + 14} ${y + 40} q12 -4 8 -16`} stroke="#ffa94d" strokeWidth="4" strokeLinecap="round" fill="none" />
                <circle cx={x - 4} cy={y + 19} r="1.6" fill={INK} />
                <circle cx={x + 4} cy={y + 19} r="1.6" fill={INK} />
              </>
            )}
            {i === 3 && (
              <g stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none">
                {[-16, 0, 16].map((dx, k) => (
                  <g key={dx}>
                    <circle cx={x + dx} cy={y + 18 + (k === 1 ? 4 : 0)} r="5" fill={["#f783ac", "#ffd43b", "#74c0fc"][k]} stroke="none" />
                    <path d={`M${x + dx} ${y + 24 + (k === 1 ? 4 : 0)} V${y + 38} M${x + dx - 6} ${y + 30} H${x + dx + 6} M${x + dx} ${y + 38} l-5 8 M${x + dx} ${y + 38} l5 8`} />
                  </g>
                ))}
              </g>
            )}
            <rect x={x - 4} y={y - 6} width="8" height="14" rx="2" fill={["#ff8787", "#74c0fc", "#69db7c", "#ffd43b"][i]} />
          </g>
        );
      })}
    </>
  );
}

// ---------- The big window ----------

const GLASS = `M${WINDOW_GLASS.x} ${WINDOW_GLASS.y} h${WINDOW_GLASS.w} v${WINDOW_GLASS.h} h${-WINDOW_GLASS.w} Z`;
const MID = WINDOW_GLASS.x + WINDOW_GLASS.w / 2;

/** The big window: the sashes swing open, the curtains flutter and Papa waves back from the garden. */
export function Fenster() {
  const { x, y, w, h } = WINDOW;
  const g = WINDOW_GLASS;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="#fff" />
      <Inside d={GLASS}>
        <rect x={g.x} y={g.y} width={g.w} height={g.h} fill="#a5d8ff" />
        <circle cx="664" cy="130" r="16" fill="#ffd43b" />
        <Cloud x={736} y={132} scale={0.26} />
        {/* Garden: a tree, the fence and the hedge */}
        <path d="M700 250 V196" stroke="#8d5a3b" strokeWidth="10" />
        <circle cx="700" cy="184" r="28" fill="#51cf66" />
        <circle cx="684" cy="196" r="18" fill="#40c057" />
        <circle cx="716" cy="198" r="16" fill="#69db7c" />
        <g className="ki-fenster-papa" style={{ transformOrigin: "820px 250px" }}>
          <path d="M792 250 V222 Q792 202 820 202 Q848 202 848 222 V250 Z" fill="#4c6ef5" />
          <rect x="814" y="190" width="12" height="16" fill={SKIN} />
          <circle cx="820" cy="176" r="20" fill={SKIN} />
          <path d="M800 174 Q800 150 820 152 Q840 150 840 174 Q834 160 820 162 Q806 160 800 174 Z" fill="#6b4423" />
          <path d="M806 186 Q820 200 834 186 Q830 196 820 196 Q810 196 806 186 Z" fill="#6b4423" />
          <Face cx={820} cy={176} size={0.6} />
          <g className="ki-fenster-wave" style={{ transformOrigin: "846px 214px" }}>
            <path d="M846 214 L864 182" stroke="#4c6ef5" strokeWidth="10" strokeLinecap="round" />
            <circle cx="866" cy="178" r="6.5" fill={SKIN} />
          </g>
        </g>
        <path d={`M${g.x} 236 H${g.x + g.w}`} stroke="#fff" strokeWidth="4" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${g.x + 8 + i * 28} 250 V226 l5 -6 l5 6 V250`} fill="#fff" />
        ))}
        <path d={`M${g.x} 250 Q${g.x + 40} 232 ${g.x + 80} 248 Q${g.x + 110} 236 ${g.x + 150} 250 Z`} fill="#40c057" />
        <path d={`M${g.x + 190} 250 Q${g.x + 240} 230 ${g.x + 290} 248 Q${g.x + 316} 238 ${g.x + g.w} 248 V250 Z`} fill="#40c057" />
      </Inside>
      {[
        { d: `M${g.x} ${g.y} H${MID} V${g.y + g.h} H${g.x} Z`, origin: `${g.x}px ${g.y + g.h / 2}px`, knob: MID - 12 },
        { d: `M${MID} ${g.y} H${g.x + g.w} V${g.y + g.h} H${MID} Z`, origin: `${g.x + g.w}px ${g.y + g.h / 2}px`, knob: MID + 12 },
      ].map(({ d, origin, knob }, i) => (
        <g key={i} className="ki-fenster-sash" style={{ ...nth(i), transformOrigin: origin }}>
          <path d={d} fill="#d0ebff" fillOpacity="0.2" stroke="#fff" strokeWidth="8" />
          <path d={i ? `M${MID + 40} ${g.y + 120} L${MID + 80} ${g.y + 20}` : `M${g.x + 30} ${g.y + 120} L${g.x + 70} ${g.y + 20}`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.45" />
          <rect x={knob - 3} y={g.y + 64} width="6" height="18" rx="3" fill="#ced4da" />
        </g>
      ))}
      {/* Curtains on a rod */}
      <rect x={x - 14} y={y - 2} width={w + 28} height="7" rx="3" fill="#f59f00" />
      {[
        { cx: x + 6, s: 1, origin: `${x + 6}px ${y}px` },
        { cx: x + w - 6, s: -1, origin: `${x + w - 6}px ${y}px` },
      ].map(({ cx, s, origin }, i) => (
        <g key={i} className="ki-fenster-curtain" style={{ ...nth(i), transformOrigin: origin }}>
          <path d={`M${cx - 18 * s} ${y + 2} H${cx + 34 * s} Q${cx + 26 * s} ${y + 80} ${cx + 34 * s} ${y + 160} Q${cx + 8 * s} ${y + 170} ${cx - 18 * s} ${y + 160} Z`} fill="#ffe066" />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={cx + 8 * s} cy={y + 34 + k * 46} r="6" fill="#ff922b" opacity="0.7" />
          ))}
        </g>
      ))}
      {/* Window sill */}
      <rect x={x - 10} y={y + h - 4} width={w + 20} height="12" rx="4" fill="#fff" />
      <rect x={x - 6} y={y + h + 6} width={w + 12} height="4" rx="2" fill="#dee2e6" />
      <g className="ki-fenster-breeze" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none">
        {[140, 170, 200].map((by, i) => (
          <path key={by} d={`M${MID - 40} ${by} q14 -8 28 0 t28 0`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** A little blue tit at the bird feeder outside the window; it pecks a seed, flaps and sings. */
export function Vogel() {
  return (
    <>
      <Inside d={GLASS}>
        {/* The feeder on its pole */}
        <path d="M930 250 V206" stroke="#8d5a3b" strokeWidth="6" />
        <rect x="904" y="196" width="52" height="12" rx="3" fill="#e9b872" />
        <path d="M898 172 L930 154 L962 172 Z" fill="#c8553d" />
        <path d="M910 172 V196 M950 172 V196" stroke="#8d5a3b" strokeWidth="4" />
        <g className="ki-vogel-seed">
          <circle cx="922" cy="194" r="2.5" fill="#6b4423" />
        </g>
        <g className="ki-vogel-body" style={{ transformOrigin: "932px 196px" }}>
          <path d="M944 186 L958 182 L950 194 Z" fill="#4dabf7" />
          <ellipse cx="934" cy="184" rx="13" ry="11" fill="#ffd43b" />
          <circle cx="922" cy="174" r="9" fill="#4dabf7" />
          <circle cx="921" cy="176" r="5.5" fill="#fff" />
          <path d="M914 174 L907 176 L914 178 Z" fill="#f76707" />
          <Eye cx={919} cy={174} r={2} />
          <g className="ki-vogel-wing" style={{ transformOrigin: "936px 180px" }}>
            <path d="M928 182 Q940 172 948 186 Q938 194 928 182 Z" fill="#339af0" />
          </g>
          <path d="M930 194 V198 M938 194 V198" stroke="#f76707" strokeWidth="2" strokeLinecap="round" />
        </g>
      </Inside>
      <Notes x={904} y={150} colour="#f59f00" size={0.6} />
    </>
  );
}

// ---------- Craft cupboard and hamster ----------

/** The hamster's cage on the cupboard: the little door opens, the wheel spins and the hamster hops and puffs its cheeks. */
export function Hamster() {
  return (
    <>
      {/* Bedding, house and wheel */}
      <rect x="1036" y="128" width="158" height="12" fill="#ffe8a3" />
      <path d="M1046 128 V108 L1066 94 L1086 108 V128 Z" fill="#c8553d" />
      <path d="M1058 128 V116 Q1066 108 1074 116 V128 Z" fill="#6b2737" />
      <g className="ki-hamster-wheel" style={{ transformOrigin: "1158px 104px" }}>
        <circle cx="1158" cy="104" r="22" fill="none" stroke="#4dabf7" strokeWidth="4" />
        {[0, 45, 90, 135].map((a) => (
          <path key={a} d="M1136 104 H1180" stroke="#74c0fc" strokeWidth="2" transform={`rotate(${a} 1158 104)`} />
        ))}
      </g>
      <path d="M1158 104 L1168 132 M1158 104 L1148 132" stroke="#339af0" strokeWidth="3" />
      {/* The hamster */}
      <g className="ki-hamster-body" style={{ transformOrigin: "1110px 130px" }}>
        <ellipse cx="1110" cy="118" rx="20" ry="15" fill="#ffa94d" />
        <ellipse cx="1110" cy="124" rx="12" ry="8" fill="#fff4e6" />
        <circle cx="1098" cy="102" r="5" fill="#ffa94d" />
        <circle cx="1122" cy="102" r="5" fill="#ffa94d" />
        <circle cx="1098" cy="102" r="2.5" fill="#ffc9c9" />
        <circle cx="1122" cy="102" r="2.5" fill="#ffc9c9" />
        <circle cx="1110" cy="110" r="13" fill="#ffa94d" />
        <g className="ki-hamster-cheeks">
          <circle cx="1100" cy="115" r="6" fill="#ffc078" />
          <circle cx="1120" cy="115" r="6" fill="#ffc078" />
        </g>
        <Eye cx={1105} cy={108} r={2.2} />
        <Eye cx={1115} cy={108} r={2.2} />
        <circle cx="1110" cy="113" r="1.8" fill="#e64980" />
        <path d="M1104 114 h-8 M1116 114 h8" stroke="#868e96" strokeWidth="1" />
      </g>
      <g className="ki-hamster-seed">
        <ellipse cx="1130" cy="96" rx="3" ry="5" fill="#495057" />
      </g>
      {/* Bars and the tray */}
      <path d="M1036 136 V84 Q1036 70 1050 70 H1180 Q1194 70 1194 84 V136" fill="none" stroke="#adb5bd" strokeWidth="3" />
      <g stroke="#ced4da" strokeWidth="2">
        {Array.from({ length: 13 }, (_, i) => (
          <path key={i} d={`M${1048 + i * 11} 72 V136`} />
        ))}
      </g>
      {/* The little door */}
      <g className="ki-hamster-door" style={{ transformOrigin: "1170px 116px" }}>
        <rect x="1170" y="98" width="22" height="34" fill="#fff" fillOpacity="0.2" stroke={STEEL} strokeWidth="3" />
        <path d="M1177 100 V130 M1184 100 V130" stroke={STEEL} strokeWidth="2" />
      </g>
      <rect x="1030" y="134" width="170" height="16" rx="5" fill="#ff922b" />
      <Hearts x={1110} y={74} count={2} spread={30} colour="#ff8787" size={0.8} />
    </>
  );
}

/** The craft cupboard: both doors open, the paint pots hop, the brushes wiggle and glitter sparkles. */
export function Schrank() {
  const pots = [
    { x: 1046, colour: "#ff6b6b" },
    { x: 1078, colour: "#ffd43b" },
    { x: 1110, colour: "#4dabf7" },
  ];
  return (
    <>
      <rect x="1010" y="150" width="210" height="180" rx="6" fill="#4dabf7" />
      <rect x="1018" y="158" width="194" height="164" fill="#fff9ec" />
      <rect x="1018" y="238" width="194" height="6" fill="#e9d8b4" />
      {/* Upper shelf: paint pots and a cup with brushes */}
      {pots.map(({ x, colour }, i) => (
        <g key={x} className="ki-schrank-pot" style={nth(i)}>
          <rect x={x - 13} y="212" width="26" height="26" rx="4" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
          <rect x={x - 13} y="206" width="26" height="9" rx="3" fill={colour} />
        </g>
      ))}
      {["#ff6b6b", "#51cf66", "#7950f2"].map((c, i) => (
        <g key={c} className="ki-schrank-brush" style={{ ...nth(i), transformOrigin: "1170px 236px" }}>
          <path d={`M${1162 + i * 8} 214 L${1158 + i * 12} 176`} stroke="#c88b3a" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx={1158 + i * 12} cy="174" rx="4" ry="7" fill={c} />
        </g>
      ))}
      <path d="M1152 238 L1156 210 H1188 L1192 238 Z" fill="#ffa94d" />
      {/* Lower shelf: paper, crayons and the glitter jar */}
      <rect x="1030" y="286" width="70" height="34" fill="#ffc9c9" />
      <rect x="1034" y="280" width="70" height="8" fill="#d0ebff" />
      <rect x="1036" y="272" width="70" height="8" fill="#b2f2bb" />
      <rect x="1120" y="298" width="40" height="22" rx="3" fill="#ffd43b" />
      {["#ff6b6b", "#4dabf7", "#51cf66"].map((c, i) => (
        <path key={c} d={`M${1126 + i * 12} 298 V282 l3 -6 l3 6 V298`} fill={c} />
      ))}
      <rect x="1172" y="286" width="28" height="34" rx="6" fill="#e5dbff" stroke="#b197fc" strokeWidth="2" />
      <rect x="1170" y="280" width="32" height="8" rx="3" fill="#b197fc" />
      {[1180, 1190, 1184].map((cx, i) => (
        <circle key={i} cx={cx} cy={300 + i * 6} r="2.5" fill={["#fcc419", "#f783ac", "#4dabf7"][i]} />
      ))}
      {/* The doors, hinged at the outer edges */}
      {[
        { x: 1014, hinge: 1014, knob: 1104 },
        { x: 1116, hinge: 1216, knob: 1126 },
      ].map(({ x, hinge, knob }, i) => (
        <g key={x} className="ki-schrank-door" style={{ ...nth(i), transformOrigin: `${hinge}px 240px` }}>
          <rect x={x} y="154" width="100" height="172" rx="5" fill="#74c0fc" stroke="#4dabf7" strokeWidth="3" />
          <rect x={x + 12} y="166" width="76" height="148" rx="5" fill="none" stroke="#fff" strokeWidth="3" opacity="0.5" />
          <circle cx={knob} cy="240" r="6" fill="#ffd43b" stroke="#e9a23b" strokeWidth="2" />
        </g>
      ))}
      {/* A painted handprint on the left door */}
      <g className="ki-schrank-door" style={{ ...nth(0), transformOrigin: "1014px 240px" }}>
        <ellipse cx="1060" cy="206" rx="14" ry="16" fill="#ff8787" />
        {[-14, -6, 2, 10].map((dx, k) => (
          <ellipse key={dx} cx={1060 + dx} cy={186 - (k === 1 || k === 2 ? 4 : 0)} rx="4" ry="9" fill="#ff8787" />
        ))}
        <ellipse cx="1078" cy="208" rx="4" ry="8" fill="#ff8787" transform="rotate(40 1078 208)" />
      </g>
      <Sparkles x={1115} y={240} spread={50} colour="#da77f2" />
    </>
  );
}

// ---------- The sleeping corner's window ----------

/** The window of the sleeping corner: the blind with the moon comes down, the stars twinkle, and it rolls up again. */
export function Rollo() {
  const { x, y, w, h } = SLEEP_WINDOW;
  const gx = x + 12;
  const gy = y + 26;
  const gw = w - 24;
  const gh = h - 38;
  return (
    <>
      <rect x={x} y={y + 12} width={w} height={h - 12} rx="6" fill="#fff" />
      <rect x={gx} y={gy} width={gw} height={gh} fill="#d0ebff" />
      <Inside d={`M${gx} ${gy} h${gw} v${gh} h${-gw} Z`}>
        <Cloud x={gx + 40} y={gy + 40} scale={0.3} />
        <circle cx={gx + 40} cy={gy + gh + 10} r="46" fill="#69db7c" />
        <circle cx={gx + 130} cy={gy + gh + 20} r="50" fill="#51cf66" />
        <circle cx={gx + 210} cy={gy + gh + 6} r="40" fill="#8ce99a" />
      </Inside>
      <path d={`M${x + w / 2} ${gy} V${gy + gh}`} stroke="#fff" strokeWidth="8" />
      <path d={`M${gx + 24} ${gy + 100} L${gx + 54} ${gy + 20}`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
      {/* The blind, half down when nobody plays with it */}
      <g className="ki-rollo-blind" style={{ transformOrigin: `${x}px ${gy}px` }}>
        <rect x={gx - 4} y={gy} width={gw + 8} height={gh} fill="#4263eb" />
        <path d={`M${x + 150} ${gy + 34} A22 22 0 1 0 ${x + 150} ${gy + 78} A16 16 0 1 1 ${x + 150} ${gy + 34} Z`} fill="#ffe066" />
        {[
          [x + 50, gy + 40],
          [x + 90, gy + 96],
          [x + 200, gy + 50],
          [x + 60, gy + 130],
          [x + 190, gy + 120],
        ].map(([sx, sy], i) => (
          <g key={i} className="ki-rollo-star" style={{ ...nth(i), transformOrigin: `${sx}px ${sy}px` }}>
            <path d={`M${sx} ${sy - 8} l2.5 5.5 h6 l-5 4 l2 6 l-5.5 -3.5 l-5.5 3.5 l2 -6 l-5 -4 h6 Z`} fill="#fff3bf" />
          </g>
        ))}
        <rect x={gx - 6} y={gy + gh - 8} width={gw + 12} height="10" rx="4" fill="#364fc7" />
      </g>
      <rect x={x - 6} y={y} width={w + 12} height="26" rx="8" fill="#e7f5ff" stroke="#a5d8ff" strokeWidth="3" />
      <g className="ki-rollo-cord" style={{ transformOrigin: `${x + w - 18}px ${y + 24}px` }}>
        <path d={`M${x + w - 18} ${y + 24} V${y + 140}`} stroke="#adb5bd" strokeWidth="2.5" />
        <circle cx={x + w - 18} cy={y + 144} r="6" fill="#ffd43b" />
      </g>
      <rect x={x - 8} y={y + h - 4} width={w + 16} height="12" rx="4" fill="#fff" />
    </>
  );
}

// ---------- Bunting ----------

const FLAGS = ["#ff6b6b", "#ffd43b", "#51cf66", "#4dabf7", "#da77f2", "#ff922b"];

/** The bunting across the top of the wall; the little flags swing one after another. */
export function Wimpelkette() {
  const from = 1012;
  const to = 1588;
  const n = 12;
  const at = (k: number) => {
    const t = k / n;
    return [from + (to - from) * t, 8 + 36 * t * (1 - t) * 1.6] as const;
  };
  return (
    <>
      <path d={`M${from} 8 Q${(from + to) / 2} ${8 + 36 * 0.8} ${to} 8`} stroke="#c88b3a" strokeWidth="2.5" fill="none" />
      {Array.from({ length: n }, (_, k) => {
        const [fx, fy] = at(k + 0.5);
        return (
          <g key={k} className="ki-wimpel" style={{ ...nth(k), transformOrigin: `${fx}px ${fy}px` }}>
            <path d={`M${fx - 18} ${fy - 1} H${fx + 18} L${fx} ${fy + 30} Z`} fill={FLAGS[k % FLAGS.length]} />
            <path d={`M${fx - 10} ${fy + 3} H${fx + 4}`} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          </g>
        );
      })}
      <Sparkles x={1300} y={40} spread={120} colour="#ffd43b" />
    </>
  );
}
