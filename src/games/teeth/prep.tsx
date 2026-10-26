import { STAR_PATH } from "@/components/Bursts";
import { useT } from "@/lib/language";
import type { Daytime } from "./daytime";
import { PICTURE } from "./jaw";
import { INK, SKIN } from "./mouth";

// Before brushing, at the sink: the toothbrush wiggles in its cup until a
// hand takes it out, then the tube comes over and puts a blob of toothpaste
// on the bristles and lies down again. All of it is CSS animation (teeth.css).
// Through the window the sun comes up in the morning; in the evening the moon
// is out and the sleeve is a pyjama one.

export type PrepPart = "brush" | "paste";

const { width: W, height: H } = PICTURE;
const SINK = 300;
const WINDOW = { x: 176, y: 34, width: 112, height: 112 };

/** Drawn lying down with the bristles up and the handle to the right; the head sits at the origin. */
function Toothbrush() {
  return (
    <g stroke={INK} strokeLinejoin="round">
      <rect x={26} y={4} width={150} height={16} rx={8} fill="#4cc9f0" strokeWidth={3} />
      <rect x={-38} y={2} width={70} height={14} rx={7} fill="#4cc9f0" strokeWidth={3} />
      <rect x={-34} y={-15} width={58} height={18} rx={3} fill="#fff" strokeWidth={2.5} />
      <path d="M-24 -13 V1 M-14 -13 V1 M-4 -13 V1 M6 -13 V1 M16 -13 V1" stroke="#9fd8f5" strokeWidth={2} />
    </g>
  );
}

/** A child's hand round the handle, its arm going off the picture. In the toothbrush's own coordinates. */
function Hand({ daytime }: { daytime: Daytime }) {
  return (
    <g className="prep-hand" stroke={INK} strokeWidth={4} strokeLinejoin="round">
      <rect x={100} y={20} width={36} height={420} rx={14} fill={SKIN} />
      <rect x={94} y={78} width={48} height={380} rx={12} fill={daytime === "evening" ? "url(#prep-pyjama)" : "#8e7dff"} />
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

/** The window above the sink: the sun rising, or the moon and stars. */
function Window({ daytime }: { daytime: Daytime }) {
  const { x, y, width, height } = WINDOW;
  const evening = daytime === "evening";
  return (
    <g>
      <clipPath id="prep-window">
        <rect x={x} y={y} width={width} height={height} rx={10} />
      </clipPath>
      <g clipPath="url(#prep-window)">
        <rect x={x} y={y} width={width} height={height} fill={evening ? "#2d2a6e" : "#ffd9a8"} />
        {evening ? (
          <>
            <path d={`M${x + 72} ${y + 22} a26 26 0 1 0 22 40 a22 22 0 1 1 -22 -40 Z`} fill="#ffe680" stroke={INK} strokeWidth={3} />
            {[
              [x + 24, y + 30],
              [x + 44, y + 78],
              [x + 90, y + 92],
            ].map(([sx, sy]) => (
              <g key={sx} transform={`translate(${sx - 8} ${sy - 8}) scale(0.16)`}>
                <path d={STAR_PATH} fill="#fff6c2" />
              </g>
            ))}
          </>
        ) : (
          <circle className="prep-sun" cx={x + width / 2} cy={y + 60} r={24} fill="#ffd23f" stroke={INK} strokeWidth={3} />
        )}
        {/* Far hills, so the sun has something to rise behind. */}
        <path
          d={`M${x} ${y + 92} Q${x + 30} ${y + 74} ${x + 60} ${y + 90} T${x + width} ${y + 84} V${y + height} H${x} Z`}
          fill={evening ? "#1d4a5c" : "#8bd346"}
        />
      </g>
      <rect x={x} y={y} width={width} height={height} rx={10} fill="none" stroke="#fff" strokeWidth={10} />
      <path d={`M${x + width / 2} ${y} V${y + height} M${x} ${y + height / 2} H${x + width}`} stroke="#fff" strokeWidth={6} />
      <rect x={x - 5} y={y - 5} width={width + 10} height={height + 10} rx={14} fill="none" stroke={INK} strokeWidth={4} />
    </g>
  );
}

export function Prep({ part, daytime }: { part: PrepPart; daytime: Daytime }) {
  const t = useT();
  return (
    <svg
      className={`prep at-${part}`}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={
        part === "brush"
          ? t({ de: "Die Zahnbürste steht im Becher am Waschbecken", ru: "Зубная щётка стоит в стаканчике у раковины" })
          : t({ de: "Zahnpasta kommt auf die Zahnbürste", ru: "Зубная паста ложится на щётку" })
      }
    >
      <defs>
        <clipPath id="prep-frame">
          <rect x={10} y={10} width={W - 20} height={H - 20} rx={70} />
        </clipPath>
        <pattern id="prep-tiles" width={55} height={55} patternUnits="userSpaceOnUse">
          <rect width={55} height={55} fill="#e6f7ff" />
          <path d="M0 0.5 H55 M0.5 0 V55" stroke="#b8e2f5" strokeWidth={3} />
        </pattern>
        <pattern id="prep-pyjama" width={36} height={36} patternUnits="userSpaceOnUse">
          <rect width={36} height={36} fill="#3a4a9e" />
          <circle cx={9} cy={9} r={4} fill="#ffe680" />
          <circle cx={27} cy={27} r={3} fill="#fff" />
        </pattern>
      </defs>

      <g clipPath="url(#prep-frame)">
        <rect width={W} height={H} fill="url(#prep-tiles)" />
        <Window daytime={daytime} />
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
            <Hand daytime={daytime} />
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
