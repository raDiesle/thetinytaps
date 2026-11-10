import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { STAR_PATH } from "@/components/TapFeedback";
import { useFigure } from "@/lib/common";
import { useT } from "@/lib/language";
import { playCrunch, playGiggle, playMunch, playRecorded, playRustle, playYum } from "@/lib/sfx";
import type { Cue } from "./cues";
import type { Daytime } from "./daytime";
import { PICTURE } from "./jaw";
import { fitBox, FrameStroke, INK, Monster, screenFrame, SKIN, useRoom, type Box } from "./mouth";

// Before anything else, a short story of where the sugar monsters come from:
// a sweet appears in the corner, floats a moment so the child sees what it is,
// glides into the child's mouth and is chewed; each leaves sugar crumbs on the
// teeth. Then time goes by in the sky (the sun crosses the day before the
// evening brushing, the moon crosses the night before the morning one) and the
// crumbs grow into the same monsters the mirror shows later, while the child
// looks worried. The child is happy about each sweet: its eyes follow it and
// its brows go up, hearts rise, and while it chews its eyes close happily and
// its cheeks glow. All of it is CSS animation (teeth.css), calm enough to go
// with the music; ARRIVE_MS here sets when each sweet reaches the mouth, and
// ORIGIN_CUES the sounds that go with it (cheering, unwrapping, biting, chewing, „Mmmh“).

export type OriginPart = "sweets" | "grow";

/** How long each part lasts: the sweets one until the last is chewed, the grow one until the monsters are there. */
export const ORIGIN_MS: Record<OriginPart, number> = { sweets: 9600, grow: 6000 };

const { width: W } = PICTURE;
/** What has to fit between heading and controls: the head, with the corners the sweets appear in; the screen shows more sky round it. */
const FOCUS: Box = { x: 40, y: 34, width: 360, height: 340 };
/** Where the camera ends up while the monsters grow: the mouth with them, as big as the free room allows. */
const MOUTH_FOCUS: Box = { x: 95, y: 222, width: 250, height: 150 };
const HEAD = { x: W / 2, y: 215, r: 165 };
/** The open smile: a nearly straight top edge and a round bottom. */
const MOUTH = { left: 110, right: 330, top: 262, depth: 95 };
const MID = (MOUTH.left + MOUTH.right) / 2;
const HALF = (MOUTH.right - MOUTH.left) / 2;
const MOUTH_PATH = `M${MOUTH.left} ${MOUTH.top} Q${MID} ${MOUTH.top + 12} ${MOUTH.right} ${MOUTH.top} A${HALF} ${MOUTH.depth} 0 0 1 ${MOUTH.left} ${MOUTH.top} Z`;
/** The bottom edge of the mouth below x. */
const bottomAt = (x: number) => MOUTH.top + MOUTH.depth * Math.sqrt(Math.max(0, 1 - ((x - MID) / HALF) ** 2));
/** The top edge of the mouth above x (it dips a little in the middle). */
const topAt = (x: number) => {
  const s = (x - MOUTH.left) / (MOUTH.right - MOUTH.left);
  return MOUTH.top + 24 * s * (1 - s);
};
const TOOTH_W = 30;
/** Six teeth along the top, four along the round bottom. */
const UPPER = [0, 1, 2, 3, 4, 5].map((i) => MOUTH.left + 6 + i * 34.5 + TOOTH_W / 2);
const LOWER = [0, 1, 2, 3].map((i) => MID + (i - 1.5) * 35);
const upperX = (i: number) => UPPER[i];
const lowerX = (i: number) => LOWER[i];

/**
 * How far the gum reaches from the mouth's edge at x: furthest between the teeth and arching back over the middle of
 * each one, so the teeth grow out of it like in the mirror (jaw.ts).
 */
function gumDepth(x: number, teeth: number[]) {
  const d = Math.min(...teeth.map((t) => Math.abs(x - t))) / (TOOTH_W / 2);
  return d >= 1 ? 14 : 6 + 8 * d ** 2;
}

/** The gum's edge over the upper teeth and under the lower ones, left to right. */
const GUM_EDGE = {
  upper: Array.from({ length: 111 }, (_, i) => MOUTH.left + i * 2).map((x) => ({ x, y: topAt(x) + gumDepth(x, UPPER) })),
  lower: Array.from({ length: 111 }, (_, i) => MOUTH.left + i * 2).map((x) => ({ x, y: bottomAt(x) - gumDepth(x, LOWER) })),
};
const edgePath = (edge: { x: number; y: number }[]) => edge.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y.toFixed(1)}`).join(" ");
/** The gum as a band: the edge, then back along the mouth's outline (clipped by it). */
const GUM_PATHS = {
  upper: `${edgePath(GUM_EDGE.upper)} L${MOUTH.right} ${MOUTH.top - 20} L${MOUTH.left} ${MOUTH.top - 20} Z`,
  lower: `${edgePath(GUM_EDGE.lower)} L${MOUTH.right} ${MOUTH.top + MOUTH.depth + 20} L${MOUTH.left} ${MOUTH.top + MOUTH.depth + 20} Z`,
};

/** Tickle ids of the monsters here start above the mirror's (step × 100 + order in TeethPlay). */
const FIRST_ID = 1000;

/** When each sweet reaches the mouth (ms into the sweets part); it shows a while before, then the mouth chews. */
const ARRIVE_MS = [2300, 5000, 7700];
/** How long the mouth chews each sweet; the crumbs show when it opens again. */
const CHEW_MS = 1200;
/** How long a sweet shows before it reaches the mouth: growing, floating and gliding in (`.origin-sweet` in teeth.css). */
const SHOW_MS = 2288;
/** When each sweet appears in its corner. */
const APPEAR_MS = ARRIVE_MS.map((at) => at - SHOW_MS);

/** One animation per sweet, starting at `times`; set property by property, so the pause rule in teeth.css still holds. */
const perSweet = (names: string[], ms: number, times: number[]): CSSProperties => ({
  animationName: names.join(", "),
  animationDuration: `${ms}ms`,
  animationTimingFunction: "ease-in-out",
  animationDelay: times.map((at) => `${at}ms`).join(", "),
});

/** One chew per sweet. */
const CHEWING = perSweet(
  ARRIVE_MS.map(() => "teeth-origin-chew"),
  CHEW_MS,
  ARRIVE_MS,
);
/** While chewing the eyes close happily and the cheeks glow. */
const HAPPY_EYES = perSweet(
  ARRIVE_MS.map(() => "teeth-origin-happy"),
  CHEW_MS,
  ARRIVE_MS,
);
const GLOW = perSweet(
  ARRIVE_MS.map(() => "teeth-origin-glow"),
  CHEW_MS,
  ARRIVE_MS,
);
/** The brows go up in delight while a sweet shows. */
const DELIGHT = perSweet(
  APPEAR_MS.map(() => "teeth-origin-delight"),
  SHOW_MS,
  APPEAR_MS,
);

/** Where each sweet first appears: in the top corners, beside the head. */
const SWEET_FROM = [
  { x: 372, y: 78 },
  { x: 68, y: 78 },
  { x: 372, y: 78 },
];

/** A crumb of each sweet on two teeth, in its colour; in the grow part each becomes a monster of that colour. */
const CRUMBS = [
  { tooth: 1, upper: true, sweet: 0, color: "#ff7bd0" },
  { tooth: 2, upper: false, sweet: 0, color: "#ff7bd0" },
  { tooth: 4, upper: true, sweet: 1, color: "#ff9f43" },
  { tooth: 0, upper: false, sweet: 1, color: "#ff9f43" },
  { tooth: 3, upper: true, sweet: 2, color: "#b388ff" },
  { tooth: 3, upper: false, sweet: 2, color: "#8bd346" },
];

/** A tooth's place in the picture, where a crumb lies and its monster grows. */
function crumbAt(c: (typeof CRUMBS)[number]) {
  if (c.upper) return { x: upperX(c.tooth), y: MOUTH.top + 19 };
  const x = lowerX(c.tooth);
  return { x, y: bottomAt(x) - 22 };
}

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

/** The eyes follow each sweet: up to its corner while it floats, down to the mouth as it glides in. */
const LOOK = perSweet(
  SWEET_FROM.map((from) => (from.x > W / 2 ? "teeth-origin-look-right" : "teeth-origin-look-left")),
  SHOW_MS,
  APPEAR_MS,
);

/** Two hearts rise beside the head when a sweet appears, on its side. */
const HEARTS = SWEET_FROM.flatMap((from, i) => {
  const side = from.x > W / 2 ? 1 : -1;
  return [
    { x: W / 2 + side * 112, y: 70, at: APPEAR_MS[i] + 500 },
    { x: W / 2 + side * 168, y: 128, at: APPEAR_MS[i] + 770 },
  ];
});
const HEART_PATH = "M0 10 C-22 -6 -16 -26 0 -14 C16 -26 22 -6 0 10 Z";

/** What the child hears: a cheer when the sweets come, unwrapping the bonbon, a bite and chewing for each, „Mmmh“ at the end. */
export const ORIGIN_CUES: Cue[] = [
  { at: APPEAR_MS[0] + 500, play: () => playRecorded("yay", playGiggle) },
  { at: APPEAR_MS[1] + 700, play: () => playRecorded("wrapper", playRustle) },
  ...ARRIVE_MS.flatMap((at, i) => [
    { at: at + 300, play: i === 2 ? () => playRecorded("munch", playMunch) : () => playRecorded("lolly", playCrunch) },
    { at: at + 600, play: () => playRecorded("chew", playMunch) },
  ]),
  { at: ARRIVE_MS[2] + CHEW_MS + 150, play: () => playRecorded("yum", playYum) },
].sort((a, b) => a.at - b.at);

/** The recordings the story plays, to load before it starts. */
export const ORIGIN_RECORDINGS = ["yay", "wrapper", "lolly", "munch", "chew", "yum"];

/** Where the sun or the moon stands at the top of its arc, which turns round the point below it (`.origin-sky-body`). */
const SKY_BODY_AREA: Box = { x: W / 2 - 40, y: -30, width: 100, height: 72 };

/** The sun, or the moon with a star, that crosses the sky while the monsters grow. */
function SkyBody({ daytime }: { daytime: Daytime }) {
  return (
    <Piece area={SKY_BODY_AREA} className="origin-sky-body" style={{ transformOrigin: `${W / 2 - SKY_BODY_AREA.x}px ${560 - SKY_BODY_AREA.y}px` }}>
      {daytime === "evening" ? (
        <circle cx={W / 2} cy={10} r={30} fill="#ffd23f" stroke={INK} strokeWidth={4} />
      ) : (
        <>
          <path d={`M${W / 2 + 6} -18 a30 30 0 1 0 24 48 a25 25 0 1 1 -24 -48 Z`} fill="#ffe680" stroke={INK} strokeWidth={4} />
          <g transform={`translate(${W / 2 + 40} -20) scale(0.14)`}>
            <path d={STAR_PATH} fill="#fff6c2" />
          </g>
        </>
      )}
    </Piece>
  );
}

/** A big round eye's white (and the girl's lashes); its pupil is a layer of its own over it (Pupil). */
function EyeWhite({ x, y, side }: { x: number; y: number; side: -1 | 1 }) {
  // The girl (👧 on the home page) has three lashes at the outer top.
  const girl = useFigure() === "girl";
  return (
    <g>
      {girl && (
        <path
          d={[
            [12, -22, 18, -34],
            [19, -14, 30, -22],
            [22, -4, 34, -8],
          ]
            .map(([x1, y1, x2, y2]) => `M${x + side * x1} ${y + y1} L${x + side * x2} ${y + y2}`)
            .join(" ")}
          stroke={INK}
          strokeWidth={5}
          strokeLinecap="round"
        />
      )}
      <ellipse cx={x} cy={y} rx={22} ry={26} fill="#fff" stroke={INK} strokeWidth={4} />
    </g>
  );
}

/** An eye's pupil with two shines: it follows the sweets, and looks down at the teeth while the monsters grow. */
function Pupil({ x, y, look }: { x: number; y: number; look?: CSSProperties }) {
  return (
    <Piece area={{ x: x - 16, y: y - 14, width: 36, height: 36 }} className="origin-pupil" style={look}>
      <circle cx={x + 2} cy={y + 4} r={15} fill={INK} />
      <circle cx={x + 7} cy={y - 3} r={6} fill="#fff" />
      <circle cx={x - 3} cy={y + 11} r={3} fill="#fff" />
    </Piece>
  );
}

/** The brows, each turning round its middle (the middle of its piece) as it goes up in delight or worry. */
const BROWS = [
  { side: "left", d: "M140 150 Q160 140 180 148", area: { x: 136, y: 139, width: 48, height: 16 } },
  { side: "right", d: "M260 148 Q280 140 300 150", area: { x: 256, y: 139, width: 48, height: 16 } },
];

/** The mouth with its teeth, the crumbs on them and the monsters growing out of them. */
const MOUTH_AREA: Box = { x: 100, y: 232, width: 240, height: 140 };
/** Round the picture's corner, where each sweet is drawn before its keyframes move it into place. */
const SWEET_AREA: Box = { x: -42, y: -36, width: 84, height: 98 };

/**
 * A moving part of the story's picture in an HTML layer of its own (`.origin-piece`), so the phone moves a finished
 * picture instead of painting the whole one again: `area` is where it lies in picture units, inside `.origin-space`
 * (picture units on the screen) or inside the piece `within`, and its svg draws in picture units too, so the drawing,
 * the transform origins and the keyframes stay those of the one picture. `over` goes on top, inside it (pieces moving
 * with it).
 */
function Piece({
  area,
  within,
  className,
  style,
  over,
  children,
}: {
  area: Box;
  within?: Box;
  className: string;
  style?: CSSProperties;
  over?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={`origin-piece ${className}`}
      style={{ left: area.x - (within?.x ?? 0), top: area.y - (within?.y ?? 0), width: area.width, height: area.height, ...style }}
    >
      <svg viewBox={`${area.x} ${area.y} ${area.width} ${area.height}`}>{children}</svg>
      {over}
    </div>
  );
}

/** The story filling the screen; `free` is the part between heading and controls, where the head has to fit. */
export function Origin({
  part,
  daytime,
  tickled,
  onTickle,
  free,
}: {
  part: OriginPart;
  daytime: Daytime;
  /** The monster that was just tapped and giggles. */
  tickled: number | null;
  onTickle: (id: number) => void;
  free: RefObject<HTMLElement | null>;
}) {
  const t = useT();
  const scene = useRef<HTMLDivElement>(null);
  const room = useRoom(scene, free);
  const { box, unit } = fitBox(room, FOCUS);
  const frame = screenFrame(box, unit);
  const bottom = box.y + box.height;
  const sweets = part === "sweets";
  const girl = useFigure() === "girl";
  // The camera zooms in on the mouth while the monsters grow: the whole picture is scaled as an HTML layer, which the
  // browser moves without painting it again, so the picture goes from showing `box` to showing `close`.
  const close = fitBox(room, MOUTH_FOCUS);
  const camera = {
    "--zoom": (unit / close.unit).toFixed(4),
    "--zoom-x": `${((box.x - close.box.x) / close.unit).toFixed(1)}px`,
    "--zoom-y": `${((box.y - close.box.y) / close.unit).toFixed(1)}px`,
  } as CSSProperties;
  /** Picture units on the screen, for the moving pieces: a point of the picture lands where the svgs show it. */
  const space: CSSProperties = { transform: `scale(${(1 / unit).toFixed(5)}) translate(${(-box.x).toFixed(1)}px, ${(-box.y).toFixed(1)}px)` };
  const viewBox = `${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.width.toFixed(1)} ${box.height.toFixed(1)}`;
  const label =
    part === "sweets"
      ? t({
          de: "Ein Kind isst Süßigkeiten",
          en: "A child eats sweets",
          zh: "一个孩子在吃甜食",
          hi: "एक बच्चा मिठाई खा रहा है",
          es: "Un niño come dulces",
          ar: "طفل يأكل الحلوى",
          ru: "Ребёнок ест сладости",
        })
      : t({
          de: "Aus dem Zucker auf den Zähnen wachsen kleine Monster",
          en: "Little monsters grow out of the sugar on the teeth",
          zh: "牙齿上的糖长成了小怪兽",
          hi: "दाँतों पर लगी चीनी से छोटे मॉन्स्टर बनते हैं",
          es: "Del azúcar en los dientes crecen monstruitos",
          ar: "من السكر على الأسنان تنمو وحوش صغيرة",
          ru: "Из сахара на зубках вырастают маленькие монстры",
        });
  // The picture is still pictures with small moving ones between them, each moving piece an HTML layer of its own
  // (Piece): the sky behind (it changes colour as the day goes by), the sun or the moon crossing it, the child, and on
  // the child its brows, pupils, cheeks, chewing mouth, hearts and sweets. Something animated inside an svg has the
  // phone paint that svg again in every frame: with all of it in one picture, the story painted more than the budget.
  return (
    <div ref={scene} className={`origin at-${part} ${daytime}`}>
      <div className="origin-camera" style={camera}>
        <svg className="origin-picture" viewBox={viewBox} aria-hidden>
          <defs>
            <clipPath id="origin-frame-back">
              <rect {...frame} />
            </clipPath>
          </defs>
          <rect className="origin-sky" {...box} clipPath="url(#origin-frame-back)" />
        </svg>
        <div className="origin-space" style={space}>
          {/* In the morning the night ends with the sun coming up beside the head. */}
          {daytime === "morning" && part === "grow" && (
            <Piece area={{ x: 42, y: 42, width: 60, height: 60 }} className="origin-sunrise">
              <circle cx={72} cy={72} r={26} fill="#ffd23f" stroke={INK} strokeWidth={4} />
            </Piece>
          )}
          <SkyBody daytime={daytime} />
        </div>

        <svg className="origin-picture" viewBox={viewBox} role="img" aria-label={label}>
          <defs>
            <clipPath id="origin-frame">
              <rect {...frame} />
            </clipPath>
            <pattern id="origin-pyjama" width={36} height={36} patternUnits="userSpaceOnUse">
              <rect width={36} height={36} fill="#3a4a9e" />
              <circle cx={9} cy={9} r={4} fill="#ffe680" />
              <circle cx={27} cy={27} r={3} fill="#fff" />
            </pattern>
          </defs>

          <g clipPath="url(#origin-frame)">
            {/* Shoulders in a T-shirt, or pyjamas in the evening, down to the screen's bottom. */}
            <path
              d={`M20 ${Math.max(480, bottom + 20)} V440 C20 395 110 365 ${W / 2} 365 C330 365 420 395 420 440 V${Math.max(480, bottom + 20)} Z`}
              fill={daytime === "evening" ? "url(#origin-pyjama)" : "#8e7dff"}
              stroke={INK}
              strokeWidth={5}
            />

            {/* The girl (👧 on the home page): two pigtails behind the head; their bands come over the hair below. */}
            {girl &&
              [-1, 1].map((s) => (
                <ellipse
                  key={s}
                  cx={HEAD.x + s * (HEAD.r + 22)}
                  cy={140}
                  rx={44}
                  ry={72}
                  transform={`rotate(${s * -35} ${HEAD.x + s * (HEAD.r + 22)} 140)`}
                  fill="#8a5a3b"
                  stroke={INK}
                  strokeWidth={5}
                />
              ))}
            <g stroke={INK} strokeWidth={5}>
              <circle cx={HEAD.x - HEAD.r} cy={228} r={26} fill={SKIN} />
              <circle cx={HEAD.x + HEAD.r} cy={228} r={26} fill={SKIN} />
              <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill={SKIN} />
            </g>
            {/* Hair with a fringe and a little curl on top. */}
            <path
              d="M58 200 C48 92 140 42 220 42 C300 42 392 92 382 200 C372 150 342 118 302 124 Q280 98 250 118 Q222 92 192 118 Q162 96 138 124 C98 118 68 150 58 200 Z"
              fill="#8a5a3b"
              stroke={INK}
              strokeWidth={5}
              strokeLinejoin="round"
            />
            <path d="M222 44 C206 18 238 4 244 24 C248 38 230 42 228 32" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
            {girl && [-1, 1].map((s) => <circle key={s} cx={HEAD.x + s * (HEAD.r - 12)} cy={118} r={17} fill="#ffd43b" stroke={INK} strokeWidth={4} />)}

            <EyeWhite x={160} y={186} side={-1} />
            <EyeWhite x={280} y={186} side={1} />
            <path d="M212 226 Q220 234 228 226" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
          </g>
        </svg>

        <div className="origin-space" style={space}>
          {BROWS.map((brow) => (
            <Piece key={brow.side} area={brow.area} className={`origin-brow ${brow.side}`} style={sweets ? DELIGHT : undefined}>
              <path d={brow.d} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
            </Piece>
          ))}
          <Pupil x={160} y={186} look={sweets ? LOOK : undefined} />
          <Pupil x={280} y={186} look={sweets ? LOOK : undefined} />
          {/* Happy closed eyes while chewing: skin over the eye and a smiling arc. */}
          {sweets && (
            <Piece area={{ x: 130, y: 155, width: 180, height: 66 }} className="origin-happy-eyes" style={HAPPY_EYES}>
              {[160, 280].map((x) => (
                <g key={x}>
                  <ellipse cx={x} cy={188} rx={27} ry={31} fill={SKIN} />
                  <path d={`M${x - 18} 194 Q${x} 172 ${x + 18} 194`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
                </g>
              ))}
            </Piece>
          )}
          {[104, 336].map((cx) => (
            <Piece key={cx} area={{ x: cx - 26, y: 222, width: 52, height: 32 }} className="origin-cheek" style={sweets ? GLOW : undefined}>
              <ellipse cx={cx} cy={238} rx={24} ry={14} fill="#ff8fab" />
            </Piece>
          ))}

          {/* The mouth closes and chews when a sweet arrives. */}
          <Piece
            area={MOUTH_AREA}
            className="origin-mouth"
            style={{ transformOrigin: `${MID - MOUTH_AREA.x}px ${MOUTH.top + 6 - MOUTH_AREA.y}px`, ...(sweets ? CHEWING : undefined) }}
            over={
              <>
                {/* Sugar crumbs: they show once the mouth opens after its sweet, and in the grow part each becomes a monster. */}
                {CRUMBS.map((c, i) => {
                  const { x, y } = crumbAt(c);
                  return (
                    <Piece
                      key={i}
                      area={{ x: x - 11, y: y - 7, width: 21, height: 18 }}
                      within={MOUTH_AREA}
                      className="origin-crumb"
                      style={{ "--crumb": `${ARRIVE_MS[c.sweet] + CHEW_MS - 200}ms`, "--grow": `${600 + i * 700}ms` } as CSSProperties}
                    >
                      <circle cx={x - 6} cy={y + 2} r={4.5} fill={c.color} stroke={INK} strokeWidth={1.5} />
                      <circle cx={x + 6} cy={y - 3} r={3.5} fill={c.color} stroke={INK} strokeWidth={1.5} />
                      <circle cx={x + 3} cy={y + 7} r={3} fill="#fff" stroke={INK} strokeWidth={1.5} />
                    </Piece>
                  );
                })}
                {part === "grow" &&
                  CRUMBS.map((c, i) => {
                    const { x, y } = crumbAt(c);
                    // Its foot (12 below its middle at this size) is the bottom middle of its piece, where it grows from.
                    return (
                      <Piece
                        key={i}
                        area={{ x: x - 14, y: y - 23, width: 28, height: 35 }}
                        within={MOUTH_AREA}
                        className="origin-monster"
                        style={{ "--grow": `${600 + i * 700}ms` } as CSSProperties}
                      >
                        <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(0.8)`}>
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
                      </Piece>
                    );
                  })}
              </>
            }
          >
            <defs>
              <clipPath id="origin-mouth">
                <path d={MOUTH_PATH} />
              </clipPath>
            </defs>
            <path d={MOUTH_PATH} fill="#7a1f3d" />
            <g clipPath="url(#origin-mouth)">
              {/* The tongue lies behind the lower teeth. */}
              <ellipse cx={MID} cy={MOUTH.top + MOUTH.depth - 42} rx={64} ry={22} fill="#ff7088" />
              <g fill="#fffdf6" stroke={INK} strokeWidth={3}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <rect key={`u${i}`} x={upperX(i) - TOOTH_W / 2} y={MOUTH.top - 14} width={TOOTH_W} height={50} rx={9} />
                ))}
                {[0, 1, 2, 3].map((i) => (
                  <rect key={`l${i}`} x={lowerX(i) - TOOTH_W / 2} y={bottomAt(lowerX(i)) - 34} width={TOOTH_W} height={50} rx={9} />
                ))}
              </g>
              {/* The gum over the teeth's roots, with a darker edge where they come out of it. */}
              {(["upper", "lower"] as const).map((jaw) => (
                <g key={jaw}>
                  <path d={GUM_PATHS[jaw]} fill="#ff8fab" />
                  <path d={edgePath(GUM_EDGE[jaw])} fill="none" stroke="#e2577c" strokeWidth={3} strokeLinejoin="round" />
                </g>
              ))}
            </g>
            <path d={MOUTH_PATH} fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          </Piece>

          {/* Hearts for each sweet: the child is delighted. */}
          {sweets &&
            HEARTS.map(({ x, y, at }, i) => (
              <Piece key={i} area={{ x: x - 17, y: y - 22, width: 34, height: 34 }} className="origin-heart" style={{ "--at": `${at}ms` } as CSSProperties}>
                <path transform={`translate(${x} ${y})`} d={HEART_PATH} fill="#ff6b9a" stroke={INK} strokeWidth={3} />
              </Piece>
            ))}

          {/* Each sweet appears big in a top corner, floats a moment, then glides into the mouth. Its piece lies round
              the picture's corner (0, 0), where the sweet is drawn and from where the keyframes move it. */}
          {sweets &&
            SWEETS.map((Sweet, i) => (
              <Piece
                key={i}
                area={SWEET_AREA}
                className="origin-sweet"
                style={{ "--arrive": `${ARRIVE_MS[i]}ms`, "--sx": `${SWEET_FROM[i].x}px`, "--sy": `${SWEET_FROM[i].y}px` } as CSSProperties}
              >
                <Sweet />
              </Piece>
            ))}
        </div>
      </div>
      {/* The frame stays at the screen's edge while the camera moves. */}
      <svg className="origin-frame" viewBox={`${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.width.toFixed(1)} ${box.height.toFixed(1)}`} aria-hidden>
        <FrameStroke frame={frame} unit={unit} />
      </svg>
    </div>
  );
}
