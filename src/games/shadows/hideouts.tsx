// The hiding places of "Wer schaut da raus?" (X-04), drawn in SVG. Both stand
// on a stage of 600 × 400 units (`STAGE`); the boxes below say where, so the
// animal behind can be placed to show just a part of itself.

const INK = "#2a1e5c";

export const STAGE = { width: 600, height: 400 };

/** The bush: its box on the stage, and the height of its top in the middle, between the two big leaf blobs. */
export const BUSH = { x: 150, y: 150, width: 300, height: 250, top: 188 };

/** The pond: its box on the stage, and the water line (the lowest point of its waves). */
export const POND = { x: 60, y: 215, width: 480, height: 185, line: 258 };

// Circles and a block that together make the bush; drawn twice, wide and dark
// first, so only the outer edge of all of them shows as the outline.
const BUSH_BLOBS = [
  [60, 105, 52],
  [135, 62, 62],
  [210, 70, 58],
  [255, 118, 45],
  [28, 178, 32],
  [272, 182, 30],
] as const;

function BushShape({ fill, stroke }: { fill: string; stroke?: number }) {
  const line = stroke ? { stroke: INK, strokeWidth: stroke } : {};
  return (
    <g fill={fill} {...line}>
      <rect x={10} y={90} width={280} height={170} rx={18} />
      {BUSH_BLOBS.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </g>
  );
}

export function Bush() {
  return (
    <svg viewBox={`0 0 ${BUSH.width} ${BUSH.height}`} preserveAspectRatio="none" aria-hidden>
      <BushShape fill={INK} stroke={9} />
      <BushShape fill="#58b368" />
      {/* Lighter leaves on top, a few darker ones below, and berries. */}
      <g fill="#7fd08a">
        <ellipse cx={120} cy={42} rx={26} ry={14} transform="rotate(-20 120 42)" />
        <ellipse cx={205} cy={50} rx={22} ry={12} transform="rotate(15 205 50)" />
        <ellipse cx={55} cy={92} rx={18} ry={10} transform="rotate(-30 55 92)" />
        <ellipse cx={250} cy={102} rx={16} ry={9} transform="rotate(25 250 102)" />
      </g>
      <g fill="#3f9150">
        <ellipse cx={90} cy={170} rx={24} ry={11} transform="rotate(15 90 170)" />
        <ellipse cx={175} cy={150} rx={22} ry={10} transform="rotate(-10 175 150)" />
        <ellipse cx={230} cy={200} rx={24} ry={11} transform="rotate(20 230 200)" />
        <ellipse cx={55} cy={222} rx={20} ry={9} transform="rotate(-15 55 222)" />
        <ellipse cx={140} cy={218} rx={22} ry={10} />
      </g>
      <g fill="#ff5d73" stroke={INK} strokeWidth={3}>
        <circle cx={160} cy={105} r={7} />
        <circle cx={176} cy={112} r={7} />
        <circle cx={70} cy={140} r={6} />
        <circle cx={248} cy={160} r={6} />
      </g>
    </svg>
  );
}

/** The wavy water line across the pond: crests at y 15, troughs at 35. */
function waves(width: number) {
  let d = "";
  for (let x = 20; x < width - 20; x += 55) {
    const next = Math.min(x + 55, width - 20);
    d += ` Q ${(x + next) / 2} ${x % 110 === 20 ? 4 : 46} ${next} 25`;
  }
  return d;
}

export function Pond() {
  const { width, height } = POND;
  const water = `M 0 ${height} C 0 70 8 25 20 25${waves(width)} C ${width - 8} 25 ${width} 70 ${width} ${height} Z`;
  return (
    <svg viewBox={`-10 -10 ${width + 20} ${height + 10}`} preserveAspectRatio="none" aria-hidden>
      <path d={water} fill="#4cc9f0" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <g fill="none" stroke="#bdefff" strokeWidth={6} strokeLinecap="round">
        <path d="M 70 75 q 25 -10 50 0" />
        <path d="M 300 95 q 30 -12 60 0" />
        <path d="M 170 135 q 25 -10 50 0" />
        <path d="M 380 150 q 20 -8 40 0" />
      </g>
      {/* Reeds at both ends. */}
      {[18, 36, width - 34, width - 16].map((x, i) => (
        <g key={x}>
          <path
            d={`M ${x} ${height} Q ${x + (i % 2 ? 6 : -6)} ${height - 90} ${x} ${-5 + i * 6}`}
            fill="none"
            stroke="#3f9150"
            strokeWidth={6}
            strokeLinecap="round"
          />
          <rect x={x - 8} y={-5 + i * 6} width={16} height={42} rx={8} fill="#8a5a3b" stroke={INK} strokeWidth={3} />
        </g>
      ))}
    </svg>
  );
}
