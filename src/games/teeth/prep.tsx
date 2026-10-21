import { STAR_PATH } from "@/components/Bursts";
import { PICTURE } from "./jaw";
import { INK, SKIN, Toothbrush } from "./mouth";

// Before brushing, at the sink: the toothbrush wiggles in its cup until a
// hand takes it out, then the tube comes over and puts a blob of toothpaste
// on the bristles and lies down again. All of it is CSS animation (teeth.css).

export type PrepPart = "brush" | "paste";

const { width: W, height: H } = PICTURE;
const SINK = 300;

/** A child's hand round the handle, its arm going off the picture. In the toothbrush's own coordinates. */
function Hand() {
  return (
    <g className="prep-hand" stroke={INK} strokeWidth={4} strokeLinejoin="round">
      <rect x={100} y={20} width={36} height={420} rx={14} fill={SKIN} />
      <rect x={94} y={78} width={48} height={380} rx={12} fill="#8e7dff" />
      <rect x={90} y={-6} width={56} height={36} rx={15} fill={SKIN} />
      <path d="M104 12 V28 M118 12 V28 M132 12 V28" fill="none" strokeWidth={3} strokeLinecap="round" />
      <rect x={94} y={-10} width={36} height={13} rx={6.5} fill={SKIN} />
    </g>
  );
}

/** Lying with the nozzle at the origin pointing down and the body going up. */
function Tube() {
  return (
    <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
      <rect x={-9} y={-22} width={18} height={24} rx={4} fill="#fff" />
      <path d="M-26 -20 Q0 -34 26 -20 L30 -140 L-30 -140 Z" fill="#fff" />
      <path className="prep-tube-stripe" d="M-28 -66 L28 -66 L29 -96 L-29 -96 Z" fill="#4cc9f0" strokeWidth={3} />
      <path d="M-34 -140 L34 -140 L34 -152 L-34 -152 Z" fill="#ff8fab" />
    </g>
  );
}

export function Prep({ part }: { part: PrepPart }) {
  return (
    <svg
      className={`prep at-${part}`}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={part === "brush" ? "Die Zahnbürste steht im Becher am Waschbecken" : "Zahnpasta kommt auf die Zahnbürste"}
    >
      <defs>
        <clipPath id="prep-frame">
          <rect x={10} y={10} width={W - 20} height={H - 20} rx={70} />
        </clipPath>
        <pattern id="prep-tiles" width={55} height={55} patternUnits="userSpaceOnUse">
          <rect width={55} height={55} fill="#e6f7ff" />
          <path d="M0 0.5 H55 M0.5 0 V55" stroke="#b8e2f5" strokeWidth={3} />
        </pattern>
      </defs>

      <g clipPath="url(#prep-frame)">
        <rect width={W} height={H} fill="url(#prep-tiles)" />
        {/* The edge of the sink. */}
        <rect x={-20} y={SINK} width={W + 40} height={140} rx={26} fill="#fff" stroke={INK} strokeWidth={6} />
        <ellipse cx={W / 2} cy={SINK + 70} rx={150} ry={30} fill="#d6eefa" stroke={INK} strokeWidth={4} />

        {/* The cup's back, then the brush in it, then the glass in front. */}
        <path d="M318 212 L394 212 L386 298 L326 298 Z" fill="#cfe9ff" />

        <g className="prep-tube">
          <Tube />
        </g>

        <g className="prep-brush">
          <g className="prep-brush-bob">
            <Toothbrush />
            {part === "paste" && (
              <g className="prep-paste">
                <path
                  d="M-24 -16 C-26 -30 -12 -36 -4 -30 C2 -40 18 -34 16 -22 C24 -20 22 -12 16 -14 Z"
                  fill="#fff"
                  stroke={INK}
                  strokeWidth={3}
                  strokeLinejoin="round"
                />
                <path d="M-16 -22 C-10 -28 0 -26 8 -24" fill="none" stroke="#4cc9f0" strokeWidth={4} strokeLinecap="round" />
              </g>
            )}
            <Hand />
          </g>
        </g>

        <path
          className="prep-cup"
          d="M318 212 L394 212 L386 298 L326 298 Z"
          fill="#bde0fe"
          fillOpacity={0.55}
          stroke={INK}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <path d="M328 224 L324 280" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.8} />

        {/* Twinkles round the brush to say: this one! */}
        {part === "brush" &&
          [
            [300, 70, 0],
            [414, 120, 300],
            [298, 150, 600],
          ].map(([x, y, delay]) => (
            <g key={x} transform={`translate(${x} ${y}) scale(0.28)`}>
              <path className="prep-twinkle" d={STAR_PATH} fill="#ffd23f" stroke={INK} strokeWidth={8} style={{ animationDelay: `${delay}ms` }} />
            </g>
          ))}
        {part === "paste" && (
          <g transform="translate(150 118) scale(0.3)">
            <path className="prep-twinkle late" d={STAR_PATH} fill="#ffd23f" stroke={INK} strokeWidth={8} />
          </g>
        )}
      </g>

      <rect x={10} y={10} width={W - 20} height={H - 20} rx={70} fill="none" stroke={INK} strokeWidth={14} />
      <rect x={10} y={10} width={W - 20} height={H - 20} rx={70} fill="none" stroke="#b9a8ff" strokeWidth={7} />
    </svg>
  );
}
