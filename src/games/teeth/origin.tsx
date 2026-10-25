import type { CSSProperties } from "react";
import { STAR_PATH } from "@/components/Bursts";
import type { Daytime } from "./daytime";
import { PICTURE } from "./jaw";
import { INK, Monster, SKIN } from "./mouth";

// Before anything else, a short story of where the sugar monsters come from:
// sweets fly into a big grin one after another and leave sugar crumbs on the
// teeth; then time goes by in the sky (the sun crosses the day before the
// evening brushing, the moon crosses the night before the morning one) and the
// crumbs grow into the same monsters the mirror shows later. All of it is CSS
// animation (teeth.css); the timings there match the arrival times here.

export type OriginPart = "sweets" | "grow";

const { width: W, height: H } = PICTURE;
const MOUTH = { x: 66, y: 236, width: 308, height: 124 };
const MOUTH_R = 56;
const TOOTH_W = 42;
const toothX = (i: number) => MOUTH.x + 10 + i * 48;
const UPPER_Y = MOUTH.y + 30;
const LOWER_Y = MOUTH.y + MOUTH.height - 30;

/** Tickle ids of the monsters here start above the mirror's (step × 100 + order in TeethPlay). */
const FIRST_ID = 1000;

/** When each sweet reaches the mouth (ms into the sweets part); teeth.css flies them in on the same beat. */
const ARRIVE_MS = [1300, 2500, 3700];

/** A crumb of each sweet on two teeth, in its colour; in the grow part each becomes a monster of that colour. */
const CRUMBS = [
  { tooth: 1, upper: true, sweet: 0, color: "#ff7bd0" },
  { tooth: 4, upper: false, sweet: 0, color: "#ff7bd0" },
  { tooth: 4, upper: true, sweet: 1, color: "#ff9f43" },
  { tooth: 1, upper: false, sweet: 1, color: "#ff9f43" },
  { tooth: 2, upper: true, sweet: 2, color: "#b388ff" },
  { tooth: 3, upper: false, sweet: 2, color: "#8bd346" },
];

/** A lollipop with a white swirl, its stick going down. */
function Lollipop() {
  return (
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
      <rect x={-3} y={14} width={6} height={44} rx={3} fill="#fff" />
      <circle r={24} fill="#ff7bd0" />
      <path d="M0 0 a5 5 0 0 1 9 2 a10 10 0 0 1 -17 6 a15 15 0 0 1 22 -18" fill="none" stroke="#fff" strokeWidth={4} />
    </g>
  );
}

/** A wrapped sweet with its two twisted ends. */
function Bonbon() {
  return (
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
      <path d="M-20 0 L-38 -14 L-34 0 L-38 14 Z M20 0 L38 -14 L34 0 L38 14 Z" fill="#ffd23f" />
      <ellipse rx={22} ry={16} fill="#ff9f43" />
      <path d="M-10 -8 Q0 -13 10 -8" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}

/** A cupcake with purple icing, sprinkles and a cherry. */
function Cupcake() {
  return (
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round">
      <path d="M-22 2 L22 2 L16 32 L-16 32 Z" fill="#4cc9f0" />
      <path d="M-8 4 L-6 30 M8 4 L6 30" fill="none" strokeWidth={2} />
      <path d="M-26 4 C-30 -10 -18 -18 -10 -14 C-6 -26 6 -26 10 -14 C18 -18 30 -10 26 4 Z" fill="#b388ff" />
      <path d="M-14 -6 l4 -2 M0 -12 l3 3 M12 -4 l-3 -3" stroke="#8bd346" strokeWidth={3} strokeLinecap="round" />
      <circle cx={2} cy={-26} r={6} fill="#ff4d6d" />
    </g>
  );
}

const SWEETS = [Lollipop, Bonbon, Cupcake];

/** The sun, or the moon with a star, that crosses the sky while the monsters grow. */
function SkyBody({ daytime }: { daytime: Daytime }) {
  return (
    <g className="origin-sky-body">
      {daytime === "evening" ? (
        <circle cx={W / 2} cy={70} r={30} fill="#ffd23f" stroke={INK} strokeWidth={4} />
      ) : (
        <>
          <path d={`M${W / 2 + 6} 42 a30 30 0 1 0 24 48 a25 25 0 1 1 -24 -48 Z`} fill="#ffe680" stroke={INK} strokeWidth={4} />
          <g transform={`translate(${W / 2 + 40} 40) scale(0.14)`}>
            <path d={STAR_PATH} fill="#fff6c2" />
          </g>
        </>
      )}
    </g>
  );
}

/** A tooth's place in the picture, where a crumb lies and its monster grows. */
const crumbAt = (c: (typeof CRUMBS)[number]) => ({ x: toothX(c.tooth) + TOOTH_W / 2, y: c.upper ? UPPER_Y : LOWER_Y });

export function Origin({
  part,
  daytime,
  tickled,
  onTickle,
}: {
  part: OriginPart;
  daytime: Daytime;
  /** The monster that was just tapped and giggles. */
  tickled: number | null;
  onTickle: (id: number) => void;
}) {
  return (
    <svg
      className={`origin at-${part} ${daytime}`}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={part === "sweets" ? "Süßigkeiten fliegen in einen lachenden Mund" : "Aus dem Zucker auf den Zähnen wachsen kleine Monster"}
    >
      <defs>
        <clipPath id="origin-frame">
          <rect x={10} y={10} width={W - 20} height={H - 20} rx={70} />
        </clipPath>
        <clipPath id="origin-mouth">
          <rect {...MOUTH} rx={MOUTH_R} />
        </clipPath>
      </defs>

      <g clipPath="url(#origin-frame)">
        <rect className="origin-sky" width={W} height={H} />
        {/* In the morning the night ends with the sun coming up behind the head. */}
        {daytime === "morning" && part === "grow" && <circle className="origin-sunrise" cx={120} cy={110} r={28} fill="#ffd23f" stroke={INK} strokeWidth={4} />}
        <SkyBody daytime={daytime} />

        {/* The child's face, with a big grin. */}
        <ellipse cx={W / 2} cy={H + 60} rx={250} ry={290} fill={SKIN} stroke={INK} strokeWidth={6} />
        <g fill={INK}>
          <ellipse cx={150} cy={196} rx={11} ry={14} />
          <ellipse cx={290} cy={196} rx={11} ry={14} />
        </g>
        <circle cx={154} cy={191} r={4} fill="#fff" />
        <circle cx={294} cy={191} r={4} fill="#fff" />
        <ellipse cx={104} cy={216} rx={18} ry={10} fill="#ff8fab" opacity={0.6} />
        <ellipse cx={336} cy={216} rx={18} ry={10} fill="#ff8fab" opacity={0.6} />

        <g className="origin-mouth">
          <rect {...MOUTH} rx={MOUTH_R} fill="#7a1f3d" />
          <ellipse cx={W / 2} cy={MOUTH.y + MOUTH.height - 24} rx={86} ry={26} fill="#ff7088" />
          <g fill="#fffdf6" stroke={INK} strokeWidth={3} clipPath="url(#origin-mouth)">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={`u${i}`} x={toothX(i)} y={MOUTH.y - 16} width={TOOTH_W} height={60} rx={12} />
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={`l${i}`} x={toothX(i)} y={MOUTH.y + MOUTH.height - 44} width={TOOTH_W} height={60} rx={12} />
            ))}
          </g>
          <rect {...MOUTH} rx={MOUTH_R} fill="none" stroke={INK} strokeWidth={30} />
          <rect {...MOUTH} rx={MOUTH_R} fill="none" stroke="#ff7088" strokeWidth={22} />

          {/* Sugar crumbs: they land with their sweet, and in the grow part each becomes a monster. */}
          {CRUMBS.map((c, i) => {
            const { x, y } = crumbAt(c);
            return (
              <g key={i} className="origin-crumb" style={{ "--arrive": `${ARRIVE_MS[c.sweet]}ms`, "--grow": `${400 + i * 500}ms` } as CSSProperties}>
                <circle cx={x - 7} cy={y + 2} r={5.5} fill={c.color} stroke={INK} strokeWidth={1.5} />
                <circle cx={x + 7} cy={y - 4} r={4.5} fill={c.color} stroke={INK} strokeWidth={1.5} />
                <circle cx={x + 4} cy={y + 8} r={3.5} fill="#fff" stroke={INK} strokeWidth={1.5} />
              </g>
            );
          })}
          {part === "grow" &&
            CRUMBS.map((c, i) => {
              const { x, y } = crumbAt(c);
              return (
                <g key={i} transform={`translate(${x} ${y}) scale(0.95)`}>
                  <g className="origin-monster" style={{ "--grow": `${400 + i * 500}ms` } as CSSProperties}>
                    <Monster
                      color={c.color}
                      variant={i % 3}
                      active={false}
                      gone={false}
                      scared={false}
                      tickled={tickled === FIRST_ID + i}
                      blinkMs={i * 900}
                      onTickle={() => onTickle(FIRST_ID + i)}
                    />
                  </g>
                </g>
              );
            })}
        </g>

        {/* The sweets fly in from the top corner, one after another, and the mouth bites. */}
        {part === "sweets" &&
          SWEETS.map((Sweet, i) => (
            <g key={i} className="origin-sweet" style={{ "--arrive": `${ARRIVE_MS[i]}ms` } as CSSProperties}>
              <Sweet />
            </g>
          ))}
      </g>

      <rect x={10} y={10} width={W - 20} height={H - 20} rx={70} fill="none" stroke={INK} strokeWidth={14} />
      <rect x={10} y={10} width={W - 20} height={H - 20} rx={70} fill="none" stroke="#b9a8ff" strokeWidth={7} />
    </svg>
  );
}
