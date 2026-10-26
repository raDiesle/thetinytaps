import type { CSSProperties, ReactNode } from "react";
import { STAR_PATH } from "@/components/Bursts";
import { playCrunch, playGiggle, playMunch, playRecorded, playRustle, playSqueak, playYum } from "@/lib/sfx";
import type { Daytime } from "./daytime";
import { PICTURE } from "./jaw";
import { INK, Monster, SKIN } from "./mouth";
import { Fist, Window } from "./prep";

// Before brushing, the child at the table: a plate of sweets slides in, the
// child's face lights up („Juhu!“), and one by one the lollipop, the sweet
// and the cookie go to the mouth – two crunchy bites each, then chewing with
// full cheeks, „Mmmh!“. At the end the child grins, and two little sugar
// monsters pop up on the teeth: that's why we brush.
// Everything follows the brushing clock (`at`), so the pictures and the
// sounds (TREAT_CUES) stay together through pause and jumps.

const { width: W, height: H } = PICTURE;

/** When things happen, in ms from the start of the part. */
const JOY = 800;
const FIRST_SWEET = 2000;
const PER_SWEET = 1900;
/** Within one sweet: up to the mouth, the first bite, open again, the second bite, chewing. */
const BITE = 450;
const REOPEN = 700;
const SECOND_BITE = 950;
const CHEW = 1100;
const YUM = FIRST_SWEET + 3 * PER_SWEET;
const GRIN = YUM + 1100;
/** The whole part. */
export const TREAT_MS = GRIN + 1500;

const HEAD = { x: 168, y: 192, r: 108 };
const MOUTH = { x: HEAD.x, y: HEAD.y + 54 };
const TABLE = 336;
const PLATE = { x: 334, y: 336, rx: 86, ry: 20 };

type SweetKind = "lolly" | "candy" | "cookie";

interface Sweet {
  kind: SweetKind;
  /** Where it lies on the plate. */
  x: number;
  y: number;
  /** Half its width: where its edge goes into the mouth. */
  r: number;
  /** Where the fist holds it, from its middle. */
  hand: { x: number; y: number };
  crumbs: string;
  /** Plays at each bite. */
  bite: () => void;
}

const SWEETS: Sweet[] = [
  { kind: "lolly", x: 270, y: 318, r: 22, hand: { x: 52, y: 4 }, crumbs: "#ff5d8f", bite: () => playRecorded("lolly", playCrunch) },
  { kind: "candy", x: 334, y: 324, r: 15, hand: { x: 12, y: 24 }, crumbs: "#ff9f43", bite: () => playRecorded("lolly", playCrunch) },
  { kind: "cookie", x: 390, y: 322, r: 21, hand: { x: 18, y: 26 }, crumbs: "#c98a4b", bite: () => playRecorded("munch", playMunch) },
];

const sweetStart = (i: number) => FIRST_SWEET + i * PER_SWEET;
/** The wrapper comes off the sweet while the lollipop is still being chewed. */
const UNWRAP = sweetStart(1) - 450;

/** A sound at a moment of the part. */
export interface Cue {
  at: number;
  play: () => void;
}

/** The sounds of the part, in order. */
export const TREAT_CUES: Cue[] = [
  { at: JOY, play: () => playRecorded("yay", playGiggle) },
  { at: UNWRAP, play: () => playRecorded("wrapper", playRustle) },
  ...SWEETS.flatMap((sweet, i) => [
    { at: sweetStart(i) + BITE, play: sweet.bite },
    { at: sweetStart(i) + SECOND_BITE, play: sweet.bite },
    { at: sweetStart(i) + CHEW, play: () => playRecorded("chew", playMunch) },
  ]),
  { at: YUM, play: () => playRecorded("yum", playYum) },
  { at: GRIN + 300, play: playSqueak },
].sort((a, b) => a.at - b.at);

/** The recordings the part plays, to load before it starts. */
export const TREAT_RECORDINGS = ["yay", "wrapper", "lolly", "munch", "chew", "yum"];

type Face = "look" | "joy" | "open" | "chomp" | "chew" | "yum" | "grin";
type SweetState = "plate" | "mouth" | "bitten" | "eaten";

/** What the face does and where each sweet is, `at` ms into the part. */
function sceneAt(at: number): { face: Face; sweets: SweetState[]; bites: number } {
  const sweets = SWEETS.map((_, i): SweetState => {
    const k = at - sweetStart(i);
    if (k < 0) return "plate";
    if (k < BITE) return "mouth";
    if (k < SECOND_BITE) return "bitten";
    return "eaten";
  });
  const bites = SWEETS.reduce((sum, _, i) => sum + (at >= sweetStart(i) + BITE ? 1 : 0) + (at >= sweetStart(i) + SECOND_BITE ? 1 : 0), 0);
  if (at >= GRIN) return { face: "grin", sweets, bites };
  if (at >= YUM) return { face: "yum", sweets, bites };
  if (at < JOY) return { face: "look", sweets, bites };
  if (at < FIRST_SWEET) return { face: "joy", sweets, bites };
  const k = (at - FIRST_SWEET) % PER_SWEET;
  const face: Face = k < BITE ? "open" : k < REOPEN ? "chomp" : k < SECOND_BITE ? "open" : "chew";
  return { face, sweets, bites };
}

/** A lollipop with a swirl, its stick to the right; drawn round its middle. */
function Lolly() {
  return (
    <g stroke={INK} strokeLinejoin="round">
      <rect x={16} y={-3.5} width={58} height={7} rx={3.5} fill="#fff" strokeWidth={3} />
      <circle r={22} fill="#ff5d8f" strokeWidth={4} />
      <clipPath id="treat-lolly">
        <circle r={20} />
      </clipPath>
      <path
        clipPath="url(#treat-lolly)"
        d="M0 0 m-2 0 a2 2 0 1 1 4 0 a6 6 0 1 1 -12 0 a10 10 0 1 1 20 0 a14 14 0 1 1 -28 0 a18 18 0 1 1 36 0"
        fill="none"
        stroke="#fff"
        strokeWidth={4}
      />
      <path d="M-12 -12 Q-6 -17 0 -17" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
    </g>
  );
}

/** A sweet in its twisted wrapper, which flies off when `unwrapped`. */
function Candy({ unwrapped }: { unwrapped: boolean }) {
  return (
    <g stroke={INK} strokeLinejoin="round">
      <ellipse rx={15} ry={12} fill="#ff9f43" strokeWidth={3.5} />
      <path d="M-8 -6 Q-2 -10 4 -8" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      <g className={`treat-wrapper${unwrapped ? " off" : ""}`}>
        <path d="M-15 -4 L-34 -16 L-29 0 L-34 16 L-15 4 Z" fill="#ffd23f" strokeWidth={3} />
        <path d="M15 -4 L34 -16 L29 0 L34 16 L15 4 Z" fill="#ffd23f" strokeWidth={3} />
        <ellipse rx={17} ry={14} fill="#ffd23f" strokeWidth={3.5} />
        <path d="M-9 -11 L-3 11 M3 -12 L9 10" stroke="#ff7bd0" strokeWidth={4} strokeLinecap="round" />
      </g>
    </g>
  );
}

/** A round cookie with chocolate chips. */
function Cookie() {
  return (
    <g stroke={INK} strokeLinejoin="round">
      <circle r={21} fill="#e3a868" strokeWidth={4} />
      <circle r={16} fill="none" stroke="#c98a4b" strokeWidth={2} />
      <g fill="#5a3a22" stroke="none">
        <circle cx={-7} cy={-6} r={3.2} />
        <circle cx={6} cy={-9} r={2.6} />
        <circle cx={8} cy={5} r={3.4} />
        <circle cx={-5} cy={8} r={2.8} />
        <circle cx={0} cy={0} r={2.2} />
      </g>
    </g>
  );
}

const DRAWINGS: Record<SweetKind, (unwrapped: boolean) => ReactNode> = {
  lolly: () => <Lolly />,
  candy: (unwrapped) => <Candy unwrapped={unwrapped} />,
  cookie: () => <Cookie />,
};

/** Bite marks on the edge that goes into the mouth: round bites out of the left side. */
function BiteMask({ id, r, bitten }: { id: string; r: number; bitten: boolean }) {
  return (
    <mask id={id} maskUnits="userSpaceOnUse" x={-90} y={-90} width={240} height={180}>
      <rect x={-90} y={-90} width={240} height={180} fill="#fff" />
      {bitten && (
        <g fill="#000">
          <circle cx={-r - 1} cy={-7} r={8} />
          <circle cx={-r + 1} cy={5} r={8.5} />
          <circle cx={-r - 3} cy={15} r={6} />
        </g>
      )}
    </mask>
  );
}

const CRUMB_FLIGHT: [number, number][] = [
  [-34, -18],
  [-26, 22],
  [30, 18],
  [-12, 34],
  [18, -24],
  [40, -4],
];

/** Crumbs that fly off at a bite; keyed by the bite, so each one flies anew. */
function CrumbBurst({ color }: { color: string }) {
  return (
    <g transform={`translate(${MOUTH.x} ${MOUTH.y})`}>
      {CRUMB_FLIGHT.map(([dx, dy], i) => (
        <rect
          key={i}
          className="treat-crumb"
          x={-3.5}
          y={-3}
          width={7}
          height={6}
          rx={2}
          fill={color}
          stroke={INK}
          strokeWidth={1.5}
          style={{ "--dx": `${dx}px`, "--dy": `${dy}px`, "--spin": `${i * 70 - 160}deg` } as CSSProperties}
        />
      ))}
    </g>
  );
}

/** Crumbs that stay stuck round the mouth, one more with every bite. */
const STUCK: [number, number, string][] = [
  [-38, 10, "#ff5d8f"],
  [30, 16, "#ff5d8f"],
  [-22, 30, "#ff9f43"],
  [40, -2, "#ff9f43"],
  [-44, -6, "#c98a4b"],
  [12, 34, "#c98a4b"],
];

function Eyes({ face }: { face: Face }) {
  return (
    <>
      {[-1, 1].map((s) => {
        const x = HEAD.x + s * 38;
        const y = HEAD.y - 4;
        if (face === "chew" || face === "yum" || face === "chomp")
          return <path key={s} d={`M${x - 13} ${y + 4} Q${x} ${y - 12} ${x + 13} ${y + 4}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />;
        if (face === "joy" || face === "grin")
          return (
            <g key={s}>
              <ellipse cx={x} cy={y} rx={13} ry={17} fill={INK} />
              <circle cx={x + 4} cy={y - 6} r={5} fill="#fff" />
              <path d={STAR_PATH} fill="#fff" transform={`translate(${x - 6} ${y + 4}) scale(0.1) translate(-50 -50)`} />
            </g>
          );
        // Looking at the plate, or at the sweet coming to the mouth.
        const look = face === "open" ? { dx: 4, dy: 4 } : { dx: 5, dy: 2 };
        return (
          <g key={s} className="face-eye">
            <ellipse cx={x + look.dx} cy={y + look.dy} rx={10} ry={14} fill={INK} />
            <circle cx={x + look.dx + 3} cy={y + look.dy - 5} r={4} fill="#fff" />
          </g>
        );
      })}
      {[-1, 1].map((s) => {
        const x = HEAD.x + s * 40;
        const y = HEAD.y - 34 - (face === "joy" || face === "open" ? 8 : 0);
        return <path key={s} d={`M${x - 15} ${y + 4} Q${x} ${y - 6} ${x + 15} ${y + 4}`} fill="none" stroke="#8a5a3c" strokeWidth={6} strokeLinecap="round" />;
      })}
    </>
  );
}

/** The mouth for each face, round MOUTH. */
function FaceMouth({ face }: { face: Face }) {
  switch (face) {
    case "look":
      return <path d="M-20 -4 Q0 12 20 -4" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
    case "joy":
      return (
        <g>
          <clipPath id="treat-joy">
            <path d="M-32 -10 Q0 -4 32 -10 Q28 26 0 28 Q-28 26 -32 -10 Z" />
          </clipPath>
          <path d="M-32 -10 Q0 -4 32 -10 Q28 26 0 28 Q-28 26 -32 -10 Z" fill="#5c1430" />
          <g clipPath="url(#treat-joy)">
            <path d="M-32 -10 Q0 -4 32 -10 L32 -2 Q0 4 -32 -2 Z" fill="#fff" />
            <ellipse cx={0} cy={24} rx={16} ry={10} fill="#ff6f91" />
          </g>
          <path d="M-32 -10 Q0 -4 32 -10 Q28 26 0 28 Q-28 26 -32 -10 Z" fill="none" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
        </g>
      );
    case "open":
      return (
        <g>
          <clipPath id="treat-open">
            <ellipse rx={22} ry={25} />
          </clipPath>
          <ellipse rx={22} ry={25} fill="#5c1430" />
          <g clipPath="url(#treat-open)">
            <rect x={-22} y={-26} width={44} height={9} fill="#fff" />
            <rect x={-22} y={18} width={44} height={9} fill="#fff" />
            <ellipse cx={0} cy={16} rx={14} ry={7} fill="#ff6f91" />
          </g>
          <ellipse rx={22} ry={25} fill="none" stroke={INK} strokeWidth={4.5} />
        </g>
      );
    case "chomp":
    case "chew":
      return (
        <g className="treat-jaw">
          <path d="M-18 0 Q-9 -6 0 0 Q9 6 18 0" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        </g>
      );
    case "yum":
      return (
        <g>
          <path d="M-22 -4 Q0 16 22 -4" fill="#5c1430" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
          <path className="treat-lick" d="M6 2 Q14 -6 20 2 Q16 10 8 8 Z" fill="#ff6f91" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        </g>
      );
    case "grin":
      return (
        <g>
          <path d="M-36 -8 Q0 2 36 -8 Q32 24 0 26 Q-32 24 -36 -8 Z" fill="#fff" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
          <path d="M-33 8 Q0 15 33 8" fill="none" stroke="#d9c49a" strokeWidth={2.5} />
          <path d="M-20 -4 V22 M-7 -2 V25 M7 -2 V25 M20 -4 V22" stroke="#e6d8bd" strokeWidth={2} />
        </g>
      );
  }
}

/** Hair over the top of the head with a fringe of little points. */
const HAIR = (() => {
  const { x, y } = HEAD;
  return (
    `M${x - 124} ${y - 10} C${x - 120} ${y - 140} ${x + 120} ${y - 140} ${x + 124} ${y - 10} ` +
    `Q${x + 100} ${y - 44} ${x + 72} ${y - 46} Q${x + 52} ${y - 70} ${x + 24} ${y - 54} Q${x} ${y - 76} ${x - 24} ${y - 54} ` +
    `Q${x - 52} ${y - 70} ${x - 72} ${y - 46} Q${x - 100} ${y - 44} ${x - 124} ${y - 10} Z`
  );
})();

/** The child at the table, from the shirt up. */
function Kid({ face, bites, daytime, onTickle }: { face: Face; bites: number; daytime: Daytime; onTickle: () => void }) {
  const full = face === "chomp" || face === "chew";
  return (
    <g className={`treat-kid ${face}`}>
      {/* Shirt, or pyjamas in the evening. */}
      <path
        d={`M${HEAD.x - 120} ${H} Q${HEAD.x - 118} ${HEAD.y + 118} ${HEAD.x} ${HEAD.y + 112} Q${HEAD.x + 118} ${HEAD.y + 118} ${HEAD.x + 120} ${H} Z`}
        fill={daytime === "evening" ? "url(#prep-pyjama)" : "#8e7dff"}
        stroke={INK}
        strokeWidth={5}
      />
      {[-1, 1].map((s) => (
        <circle key={s} cx={HEAD.x + s * 104} cy={HEAD.y + 10} r={24} fill={SKIN} stroke={INK} strokeWidth={5} />
      ))}
      {/* Full cheeks bulge out of the face while chewing. */}
      {full &&
        [-1, 1].map((s) => (
          <circle key={s} className="treat-full-cheek" cx={HEAD.x + s * 72} cy={HEAD.y + 50} r={32} fill={SKIN} stroke={INK} strokeWidth={5} />
        ))}
      <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill={SKIN} stroke={INK} strokeWidth={6} />
      <clipPath id="treat-head">
        <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} />
      </clipPath>
      <g clipPath="url(#treat-head)">
        {full && [-1, 1].map((s) => <circle key={s} cx={HEAD.x + s * 72} cy={HEAD.y + 50} r={32} fill={SKIN} />)}
        <path d={HAIR} fill="#8a5a3c" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </g>
      {/* A curl on top. */}
      <path
        d={`M${HEAD.x - 6} ${HEAD.y - HEAD.r + 2} C${HEAD.x - 18} ${HEAD.y - HEAD.r - 22} ${HEAD.x + 10} ${HEAD.y - HEAD.r - 26} ${HEAD.x + 8} ${HEAD.y - HEAD.r - 10}`}
        fill="none"
        stroke={INK}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {[-1, 1].map((s) => (
        <ellipse key={s} className="treat-blush" cx={HEAD.x + s * 62} cy={HEAD.y + 30} rx={20} ry={13} fill="#ff8fa3" opacity={face === "look" ? 0.45 : 0.8} />
      ))}
      <Eyes face={face} />
      <ellipse cx={HEAD.x} cy={HEAD.y + 20} rx={11} ry={8} fill="#e8a982" />
      {STUCK.slice(0, Math.min(STUCK.length, Math.floor(bites / 2) * 2)).map(([dx, dy, color], i) => (
        <rect key={i} x={MOUTH.x + dx - 3} y={MOUTH.y + dy - 3} width={6} height={5} rx={2} fill={color} stroke={INK} strokeWidth={1.2} />
      ))}
      <g transform={`translate(${MOUTH.x} ${MOUTH.y})`}>
        <g key={face} className="treat-mouth">
          <FaceMouth face={face} />
        </g>
      </g>
      {face === "grin" &&
        [
          { x: MOUTH.x - 16, y: MOUTH.y + 4, color: "#8bd346", variant: 0, delay: 200 },
          { x: MOUTH.x + 17, y: MOUTH.y + 6, color: "#b388ff", variant: 2, delay: 450 },
        ].map((m) => (
          <g key={m.x} transform={`translate(${m.x} ${m.y}) scale(0.62)`}>
            <Monster color={m.color} variant={m.variant} active={false} gone={false} scared={false} tickled={false} delayMs={m.delay} onTickle={onTickle} />
          </g>
        ))}
    </g>
  );
}

/** Hearts that float up when the child sees the sweets, stars when it tastes good. */
function Floaters({ kind }: { kind: "hearts" | "stars" }) {
  const spots: [number, number, number][] = [
    [HEAD.x - 120, HEAD.y - 60, 0],
    [HEAD.x + 118, HEAD.y - 76, 180],
    [HEAD.x + 96, HEAD.y + 10, 360],
  ];
  return (
    <g pointerEvents="none">
      {spots.map(([x, y, delay]) => (
        // The animation moves the group; the drawing is placed inside it.
        <g key={x} transform={`translate(${x} ${y})`}>
          <g className="treat-float" style={{ animationDelay: `${delay}ms` }}>
            {kind === "hearts" ? (
              <path
                d="M0 8 C-14 -2 -16 -12 -8 -15 C-4 -16 -1 -14 0 -10 C1 -14 4 -16 8 -15 C16 -12 14 -2 0 8 Z"
                transform="scale(1.4)"
                fill="#ff5d8f"
                stroke={INK}
                strokeWidth={2.5}
              />
            ) : (
              <path d={STAR_PATH} transform="scale(0.26) translate(-50 -50)" fill="#ffd23f" stroke={INK} strokeWidth={9} />
            )}
          </g>
        </g>
      ))}
    </g>
  );
}

/** The sweets part of the prelude, `at` ms into it. */
export function Treat({ at, daytime, onTickle }: { at: number; daytime: Daytime; onTickle: () => void }) {
  const { face, sweets, bites } = sceneAt(at);
  return (
    <svg className="prep treat" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ein Kind isst Süßigkeiten">
      <defs>
        <clipPath id="treat-frame">
          <rect x={10} y={10} width={W - 20} height={H - 20} rx={70} />
        </clipPath>
        <pattern id="treat-wall" width={40} height={40} patternUnits="userSpaceOnUse">
          <rect width={40} height={40} fill={daytime === "evening" ? "#ffe9c7" : "#fff4d6"} />
          <circle cx={20} cy={20} r={3} fill="#ffd9a8" />
        </pattern>
        <pattern id="prep-pyjama" width={36} height={36} patternUnits="userSpaceOnUse">
          <rect width={36} height={36} fill="#3a4a9e" />
          <circle cx={9} cy={9} r={4} fill="#ffe680" />
          <circle cx={27} cy={27} r={3} fill="#fff" />
        </pattern>
        {SWEETS.map((sweet, i) => (
          <BiteMask key={i} id={`treat-bite-${i}`} r={sweet.r} bitten={sweets[i] !== "plate" && sweets[i] !== "mouth"} />
        ))}
      </defs>

      <g clipPath="url(#treat-frame)">
        <rect width={W} height={H} fill="url(#treat-wall)" />
        <Window daytime={daytime} at={{ x: 300, y: 40, width: 100, height: 100 }} />
        <Kid face={face} bites={bites} daytime={daytime} onTickle={onTickle} />

        {/* The table and the plate. */}
        <rect x={-20} y={TABLE} width={W + 40} height={H - TABLE + 20} fill="#e0a85a" stroke={INK} strokeWidth={6} />
        <path d={`M-20 ${TABLE + 14} H${W + 20}`} stroke="#c98a4b" strokeWidth={4} />
        <g className="treat-plate">
          <ellipse cx={PLATE.x} cy={PLATE.y + 4} rx={PLATE.rx} ry={PLATE.ry} fill="#fff" stroke={INK} strokeWidth={5} />
          <ellipse cx={PLATE.x} cy={PLATE.y + 2} rx={PLATE.rx - 22} ry={PLATE.ry - 8} fill="none" stroke="#bde0fe" strokeWidth={3} />
        </g>

        {SWEETS.map((sweet, i) => {
          const state = sweets[i];
          const atMouth = state === "mouth" || state === "bitten";
          // At the mouth its left edge is between the lips; after the bite it pulls back a little.
          const dx = MOUTH.x + sweet.r - (state === "bitten" ? 0 : 8) - sweet.x;
          const dy = MOUTH.y + 2 - sweet.y;
          const move = state === "plate" ? "translate(0px, 0px)" : `translate(${dx}px, ${dy}px) scale(${state === "eaten" ? 0 : 1.1})`;
          return (
            <g key={sweet.kind} transform={`translate(${sweet.x} ${sweet.y})`}>
              <g className={`treat-sweet ${state}`} style={{ transform: move }}>
                <g mask={`url(#treat-bite-${i})`}>{DRAWINGS[sweet.kind](at >= UNWRAP)}</g>
                <g className={`treat-hand${atMouth ? " holding" : ""}`} transform={`translate(${sweet.hand.x} ${sweet.hand.y})`}>
                  <Fist daytime={daytime} />
                </g>
              </g>
            </g>
          );
        })}

        {bites > 0 && <CrumbBurst key={bites} color={SWEETS[Math.min(SWEETS.length - 1, Math.floor((bites - 1) / 2))].crumbs} />}
        {face === "joy" && <Floaters kind="hearts" />}
        {face === "yum" && <Floaters kind="stars" />}
      </g>

      <rect x={10} y={10} width={W - 20} height={H - 20} rx={70} fill="none" stroke={INK} strokeWidth={14} />
      <rect x={10} y={10} width={W - 20} height={H - 20} rx={70} fill="none" stroke="#b9a8ff" strokeWidth={7} />
    </svg>
  );
}
