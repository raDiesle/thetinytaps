import { useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { STAR_PATH } from "@/components/TapFeedback";
import { useT } from "@/lib/language";
import { playPuff, playRecorded, playSplash, playTwinkle } from "@/lib/sfx";
import type { Cue } from "./cues";
import { useFigure } from "@/lib/common";
import type { Daytime } from "@/lib/days";
import { PyjamaPattern, topFill } from "./clothes";
import { fitBox, FrameStroke, INK, screenFrame, SKIN, useRoom, type Box } from "./mouth";
import { Piece, pictureSpace } from "./piece";

// Before brushing, at the sink: the toothbrush wiggles in its cup until a
// hand takes it out, then the tube comes over and squeezes a little striped dab of
// toothpaste onto the bristles and lies down again. All of it is CSS
// animation (teeth.css); the sounds (PREP_CUES) go by the brushing clock.
// After brushing the same sink again: the brush is rinsed under the tap and
// goes back into its cup. Through the window the sun comes up in the morning;
// in the evening the moon is out and the sleeve is a pyjama one.
// The wall, the window, the basin and the tap are one still picture; everything that moves (the brush with the hand,
// the tube, the water, the sun, the twinkles) is an HTML layer of its own on it (`Piece`), so a phone moves finished
// pictures instead of painting the whole sink again in every frame.

/** Before brushing: get the brush, toothpaste on; after it: rinse the brush and put it away. */
export type PrepPart = "brush" | "paste" | "tidy";

const SINK = 300;
/** The part of the sink that always shows: window, cup, tube and the bowl; the rest of the screen shows more wall and sink. */
const FOCUS: Box = { x: 30, y: 24, width: 390, height: 356 };
const WINDOW = { x: 176, y: 34, width: 112, height: 112 };

/** How long each part lasts, as long as its animation in teeth.css. */
export const PREP_MS: Record<PrepPart, number> = { brush: 7000, paste: 8000, tidy: 8570 };

/** The sounds of each part, in ms from its start, matching the animations in teeth.css. */
export const PREP_CUES: Record<PrepPart, Cue[]> = {
  // Rattling in the cup, then lifted out of it.
  brush: [
    { at: 360, play: () => playRecorded("clink", playTwinkle) },
    { at: 1000, play: () => playRecorded("clink", playTwinkle) },
    { at: 2050, play: () => playRecorded("clink", playTwinkle) },
  ],
  // The squeeze, and a twinkle when the toothpaste is on.
  paste: [
    { at: 1650, play: playPuff },
    { at: 3650, play: playTwinkle },
  ],
  // The tap runs, the brush rattles back into its cup, and a twinkle: all tidy.
  tidy: [
    { at: 600, play: () => playRecorded("splash", playSplash) },
    { at: 2150, play: () => playRecorded("splash", playSplash) },
    { at: 6450, play: () => playRecorded("clink", playTwinkle) },
    { at: 6980, play: () => playRecorded("clink", playTwinkle) },
    { at: 7500, play: playTwinkle },
  ],
};

/** The recordings the sink plays, to load before it starts. */
export const PREP_RECORDINGS = ["clink"];

/** The recordings of rinsing and putting the brush away at the end. */
export const TIDY_RECORDINGS = ["splash", "clink"];

/** Where the tufts of bristles stand on the head, left to right; the one at the tip is longer. */
const TUFTS = [-36, -26, -16, -6, 4, 14];

/**
 * A child's toothbrush lying with the bristles up and the handle to the right; the head sits at the origin.
 * Tufts of white and blue bristles, a thin neck, and a wide handle with a soft rubber grip.
 */
function Toothbrush() {
  return (
    <g stroke={INK} strokeLinejoin="round">
      {TUFTS.map((x, i) => (
        <g key={x}>
          <rect x={x} y={i === 0 ? -18 : -14} width={9} height={i === 0 ? 22 : 18} rx={3.5} fill={i % 2 ? "#8fdcf7" : "#fff"} strokeWidth={2} />
          <path d={`M${x + 4.5} ${i === 0 ? -14 : -10} V0`} stroke={i % 2 ? "#5fc4ea" : "#d2e9f8"} strokeWidth={1.5} />
        </g>
      ))}
      <path d="M-40 9 C-40 3 -35 0 -27 0 L22 1 C28 1 30 5 30 9 C30 13 28 17 22 17 L-27 18 C-35 18 -40 15 -40 9 Z" fill="#4cc9f0" strokeWidth={3} />
      <path
        d="M20 5 C34 6 46 7 60 4 C76 1 96 0 120 1 L172 2 C181 2 185 7 185 12 C185 17 181 22 172 22 L120 23 C96 24 76 23 60 19 C46 15 34 14 20 14 Z"
        fill="#4cc9f0"
        strokeWidth={3}
      />
      {/* The soft grip, with ridges for small fingers. */}
      <path d="M86 6 C102 4 132 4 154 6 C158 9 158 16 154 19 C132 21 102 21 86 19 C82 16 82 9 86 6 Z" fill="#8bd346" strokeWidth={2.5} />
      <path d="M100 8 V17 M110 7.5 V17.5 M120 7.5 V17.5 M130 7.5 V17.5 M140 8 V17" stroke="#5f9e2b" strokeWidth={2} />
      <path
        d="M-32 4 L16 4.5 M30 8 C44 9 54 8 64 6 M164 6 C172 6 178 8 180 11"
        fill="none"
        stroke="#fff"
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.75}
      />
    </g>
  );
}

/** How long the arm is below the cuff, enough to reach off the screen from the hand's highest place on a tall screen. */
const ARM = 580;
/** How much wider the sleeve gets per unit down, so the arm looks to come towards us. */
const ARM_SPREAD = 0.06;

/**
 * A child's fist round a handle that runs left to right through the origin, the arm going down off the picture:
 * four fingers curled round it, the thumb lying along the top.
 */
function Fist({ daytime }: { daytime: Daytime }) {
  // The sleeve is the boy's or the girl's T-shirt, or pyjama in the evening (`clothes.tsx`).
  const figure = useFigure();
  const sleeve = topFill(figure, daytime, "prep-pyjama");
  return (
    <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
      <defs>
        <PyjamaPattern id="prep-pyjama" figure={figure} />
      </defs>
      {/* Long enough to reach past the screen's edge however much of the sink shows, and wider further down: the arm
          comes towards us from the child standing in front of the sink, not up out of the basin. */}
      <rect x={-17} y={8} width={34} height={70} rx={14} fill={SKIN} />
      <path d={`M-23 66 L23 66 L${23 + ARM_SPREAD * ARM} ${66 + ARM} L${-23 - ARM_SPREAD * ARM} ${66 + ARM} Z`} fill={sleeve} />
      <path d={`M-12 80 L${-12 - ARM_SPREAD * ARM * 0.6} ${66 + ARM}`} stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.3} />
      <rect x={-25} y={62} width={50} height={14} rx={7} fill={sleeve} />
      <path d="M-26 -6 C-26 -16 -18 -20 -8 -20 L14 -20 C24 -20 28 -14 28 -4 L28 14 C28 26 20 32 8 32 L-12 32 C-22 32 -26 26 -26 14 Z" fill={SKIN} />
      {[-19, -6, 7, 20].map((x, i) => (
        <g key={x}>
          <rect x={x - 6.5} y={i === 1 || i === 2 ? -15 : -12} width={13} height={i === 1 || i === 2 ? 30 : 26} rx={6.5} fill={SKIN} strokeWidth={3} />
          <path d={`M${x - 3} 6 Q${x} 8 ${x + 3} 6`} fill="none" strokeWidth={1.8} stroke="#c98a6a" strokeLinecap="round" />
        </g>
      ))}
      <path d="M-30 -8 C-34 -18 -26 -24 -16 -22 L8 -17 C14 -15 14 -9 8 -8 L-18 -6 C-24 -5 -28 -5 -30 -8 Z" fill={SKIN} strokeWidth={3} />
      <path d="M2 -16 C6 -15 7 -11 3 -10" fill="#ffe3d3" strokeWidth={1.8} />
    </g>
  );
}

/** Lying with the nozzle at the origin pointing down and the body going up to the crimped end. */
function Tube() {
  return (
    <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
      <rect x={-7} y={-12} width={14} height={14} rx={3} fill="#fff" />
      <path d="M-16 -12 L16 -12 L20 -26 L-20 -26 Z" fill="#fff" />
      <path d="M-20 -26 C-26 -60 -31 -108 -33 -136 L33 -136 C31 -108 26 -60 20 -26 Z" fill="#fff" />
      <path d="M8 -30 C12 -60 16 -100 18 -130 L28 -130 C26 -100 22 -60 17 -30 Z" fill="#e3f3ff" stroke="none" />
      <path d="M-24 -64 L24 -64 L28 -110 L-28 -110 Z" fill="#4cc9f0" strokeWidth={3} />
      {/* A little tooth on the label. */}
      <path
        d="M-8 -98 C-12 -98 -12 -92 -11 -86 C-10 -80 -8 -76 -6 -76 C-4 -76 -3 -82 0 -82 C3 -82 4 -76 6 -76 C8 -76 10 -80 11 -86 C12 -92 12 -98 8 -98 C4 -98 3 -96 0 -96 C-3 -96 -4 -98 -8 -98 Z"
        fill="#fff"
        strokeWidth={2.5}
      />
      <path d="M-24 -70 Q-12 -76 0 -70 T24 -70" fill="none" stroke="#ff8fab" strokeWidth={3} />
      <path d="M-36 -136 L36 -136 L36 -152 L-36 -152 Z" fill="#ff8fab" />
      <path
        d="M-28 -139 V-149 M-20 -139 V-149 M-12 -139 V-149 M-4 -139 V-149 M4 -139 V-149 M12 -139 V-149 M20 -139 V-149 M28 -139 V-149"
        stroke="#d94f74"
        strokeWidth={2}
      />
    </g>
  );
}

/**
 * A little dab of striped toothpaste in the middle of the bristles, in the toothbrush's coordinates: pea-sized, as
 * much as a child's brush gets – never a stripe along the whole head (user feedback, November 2026).
 */
function Paste() {
  return (
    <g stroke={INK} strokeLinejoin="round" strokeLinecap="round">
      <path d="M-17 -14 C-19 -19 -15 -23 -10 -22 C-7 -27 0 -27 1 -21 C5 -20 6 -15 3 -14 Z" fill="#fff" strokeWidth={2.5} />
      <path d="M-14 -17 C-10 -20 -5 -20 -2 -18 C0 -19 2 -19 3 -17" fill="none" stroke="#4cc9f0" strokeWidth={2.5} />
      {/* The little curl where the tube lifted off. */}
      <path d="M-5 -24 C-4 -29 2 -29 1 -25" fill="#fff" strokeWidth={2.5} />
    </g>
  );
}

/** The foam left on the bristles after brushing, in the toothbrush's coordinates; the water washes it off. */
function Foam() {
  return (
    <g fill="#fff" stroke="#9fd8ef" strokeWidth={2}>
      <path d="M-40 -14 C-44 -24 -36 -32 -27 -28 C-22 -38 -8 -38 -3 -30 C2 -38 16 -38 20 -29 C28 -30 32 -20 27 -13 Z" />
      {[
        [-30, -34, 5],
        [-12, -38, 6],
        [8, -36, 4.5],
        [24, -26, 3.5],
      ].map(([x, y, r]) => (
        <circle key={x} cx={x} cy={y} r={r} />
      ))}
    </g>
  );
}

/** Where the water runs from the tap down into the basin, with room for its drops. */
const WATER_AREA: Box = { x: 190, y: SINK - 50, width: 62, height: 126 };
/** The drops hopping where the water lands. */
const DROPS = [
  [196, SINK + 62],
  [246, SINK + 58],
  [204, SINK + 50],
];

/** The water running from the tap into the basin while the brush is rinsed, and its drops hopping in the basin. */
function Water() {
  return (
    <Piece
      area={WATER_AREA}
      className="prep-water"
      over={DROPS.map(([x, y]) => (
        <Piece key={x} area={{ x: x - 6, y: y - 6, width: 12, height: 12 }} within={WATER_AREA} className="prep-drop">
          <circle cx={x} cy={y} r={4} fill="#8fdcf7" stroke={INK} strokeWidth={1.5} />
        </Piece>
      ))}
    >
      <path
        d={`M214 ${SINK - 49} C212 ${SINK - 10} 216 ${SINK + 30} 214 ${SINK + 72} L228 ${SINK + 72} C226 ${SINK + 30} 230 ${SINK - 10} 228 ${SINK - 49} Z`}
        fill="#8fdcf7"
        opacity={0.85}
      />
      <path d={`M219 ${SINK - 44} V${SINK + 60}`} stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
    </Piece>
  );
}

/** Far hills along the window's bottom, so the sun has something to rise behind. */
function hills({ x, y, width, height } = WINDOW) {
  return `M${x} ${y + height * 0.82} Q${x + width * 0.27} ${y + height * 0.66} ${x + width * 0.54} ${y + height * 0.8} T${x + width} ${y + height * 0.75} V${y + height} H${x} Z`;
}

/** The sky through the window, still: dawn in the morning (the sun rises in a layer of its own), the moon and stars in the evening. */
function WindowSky({ daytime }: { daytime: Daytime }) {
  const { x, y, width, height } = WINDOW;
  const evening = daytime === "evening";
  return (
    <g>
      <clipPath id="prep-window">
        <rect x={x} y={y} width={width} height={height} rx={10} />
      </clipPath>
      <g clipPath="url(#prep-window)">
        <rect x={x} y={y} width={width} height={height} fill={evening ? "#2d2a6e" : "url(#prep-dawn)"} />
        {evening && (
          <>
            <path d={`M${x + width * 0.64} ${y + height * 0.2} a26 26 0 1 0 22 40 a22 22 0 1 1 -22 -40 Z`} fill="#ffe680" stroke={INK} strokeWidth={3} />
            {[
              [x + width * 0.21, y + height * 0.27],
              [x + width * 0.39, y + height * 0.7],
              [x + width * 0.8, y + height * 0.82],
            ].map(([sx, sy]) => (
              <g key={sx} transform={`translate(${sx - 8} ${sy - 8}) scale(0.16)`}>
                <path d={STAR_PATH} fill="#fff6c2" />
              </g>
            ))}
            <path d={hills()} fill="#1d4a5c" />
          </>
        )}
      </g>
    </g>
  );
}

/** The window's frame, its bars and the hills, over the sky and the rising sun; and the sill under it. */
function WindowFront({ daytime }: { daytime: Daytime }) {
  const { x, y, width, height } = WINDOW;
  return (
    <>
      {daytime === "morning" && <path d={hills()} fill="#8bd346" clipPath="url(#prep-window-front)" />}
      <clipPath id="prep-window-front">
        <rect x={x} y={y} width={width} height={height} rx={10} />
      </clipPath>
      <rect x={x} y={y} width={width} height={height} rx={10} fill="none" stroke="#fff" strokeWidth={10} />
      <path d={`M${x + width / 2} ${y} V${y + height} M${x} ${y + height / 2} H${x + width}`} stroke="#fff" strokeWidth={6} />
      {/* A soft light on the glass. */}
      <path
        d={`M${x + 14} ${y + 40} L${x + 40} ${y + 14} M${x + 14} ${y + 52} L${x + 52} ${y + 14}`}
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.35}
      />
      <rect x={x - 5} y={y - 5} width={width + 10} height={height + 10} rx={14} fill="none" stroke={INK} strokeWidth={4} />
      <rect x={x - 16} y={y + height + 4} width={width + 32} height={12} rx={5} fill="#fff" stroke={INK} strokeWidth={4} />
    </>
  );
}

/** Where the window's front and its sill lie, a still layer over the rising sun. */
const WINDOW_FRONT: Box = { x: WINDOW.x - 20, y: WINDOW.y - 9, width: WINDOW.width + 40, height: WINDOW.height + 32 };
/** The sun in the window, rising in the morning. */
const SUN = { x: WINDOW.x + WINDOW.width / 2, y: WINDOW.y + WINDOW.height * 0.54, r: WINDOW.width * 0.21 };

/** The tap behind the basin, shiny chrome. */
function Tap() {
  return (
    <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
      <ellipse cx={258} cy={SINK + 2} rx={22} ry={5} fill={INK} opacity={0.12} stroke="none" />
      <rect x={244} y={SINK - 24} width={28} height={26} rx={6} fill="url(#prep-chrome)" />
      <path
        d={`M250 ${SINK - 22} V${SINK - 48} Q250 ${SINK - 62} 236 ${SINK - 62} L216 ${SINK - 62} Q210 ${SINK - 62} 210 ${SINK - 56} V${SINK - 48} L220 ${SINK - 48} V${SINK - 50} L236 ${SINK - 50} Q238 ${SINK - 50} 238 ${SINK - 48} V${SINK - 22} Z`}
        fill="url(#prep-chrome)"
      />
      <rect x={250} y={SINK - 34} width={26} height={9} rx={4.5} fill="#ff8fab" strokeWidth={3} />
      <path d={`M244 ${SINK - 56} H226 M246 ${SINK - 44} V${SINK - 28}`} stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.9} />
    </g>
  );
}

/** The basin let into the counter: its rim, the bowl going down (darker at the back, where the rim shades it) and the drain. */
function Basin() {
  const [cx, cy] = [220, SINK + 70];
  return (
    <g stroke={INK} strokeLinejoin="round">
      <ellipse cx={cx} cy={cy} rx={154} ry={33} fill="#f4fbff" strokeWidth={4} />
      <ellipse cx={cx} cy={cy + 3} rx={134} ry={24} fill="url(#prep-bowl)" strokeWidth={3} />
      <ellipse cx={cx} cy={cy + 10} rx={12} ry={4} fill="#9fb4c4" strokeWidth={2.5} />
      <path d={`M${cx - 6} ${cy + 10} H${cx + 6}`} stroke="#6f8597" strokeWidth={1.5} />
      <path
        d={`M${cx - 120} ${cy + 18} Q${cx} ${cy + 36} ${cx + 120} ${cy + 18}`}
        fill="none"
        stroke="#fff"
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.9}
      />
    </g>
  );
}

/** The cup's glass: its back (behind the brush) and its rim's far edge. */
const CUP = "M318 212 L394 212 L386 298 L326 298 Z";

/** Where the brush, its toothpaste or foam and the hand lie, in the toothbrush's coordinates (its head at the origin). */
const BRUSH_AREA: Box = { x: -46, y: -46, width: 236, height: 72 };
/** The fist's own layer round its pivot at the wrist, long enough for the arm to reach off the screen. */
const FIST_AREA: Box = { x: -64, y: -28, width: 128, height: 680 };
/** Where the hand holds the handle, in the toothbrush's coordinates: the wrist turns round it. */
const WRIST = { x: 118, y: 12 };
/** The tube's layer, in its own coordinates (the nozzle at the origin). */
const TUBE_AREA: Box = { x: -40, y: -156, width: 80, height: 160 };
const ORIGIN = { x: 0, y: 0 };
/** Points as empty boxes, for pieces placed inside a piece that has no size. */
const WRIST_BOX: Box = { ...WRIST, width: 0, height: 0 };
const ORIGIN_BOX: Box = { ...ORIGIN, width: 0, height: 0 };

/**
 * The brush's moves (out of its cup, over to the tube, under the tap and back) and its bob while it waits, for what
 * goes with it. The brush lies behind the glass and the hand in front of it, so each has its own, moved alike by the
 * same keyframes from the same moment.
 */
function BrushMoves({ children }: { children: ReactNode }) {
  return (
    <Piece
      area={BRUSH_AREA}
      pivot={ORIGIN}
      className="prep-brush"
      over={<Piece area={BRUSH_AREA} within={BRUSH_AREA} className="prep-brush-bob" over={children} />}
    />
  );
}

/** Twinkles round the brush (this one!), one on the dab of toothpaste, and round the cup at the end (all tidy). */
const TWINKLES: Record<PrepPart, { x: number; y: number; s: number; delay: number; className: string }[]> = {
  brush: [
    { x: 300, y: 70, s: 0.28, delay: 0, className: "" },
    { x: 414, y: 120, s: 0.28, delay: 300, className: "" },
    { x: 298, y: 150, s: 0.28, delay: 600, className: "" },
  ],
  paste: [{ x: 130, y: 128, s: 0.3, delay: 3600, className: "late" }],
  tidy: [
    { x: 300, y: 150, s: 0.3, delay: 7500, className: "tidy" },
    { x: 410, y: 168, s: 0.3, delay: 7770, className: "tidy" },
    { x: 352, y: 52, s: 0.3, delay: 8040, className: "tidy" },
  ],
};

/** The sink filling the screen; `free` is the part between heading and controls, where the sink has to fit. */
export function Prep({ part, daytime, free }: { part: PrepPart; daytime: Daytime; free: RefObject<HTMLElement | null> }) {
  const t = useT();
  const scene = useRef<HTMLDivElement>(null);
  const { box, unit } = fitBox(useRoom(scene, free), FOCUS);
  const frame = screenFrame(box, unit);
  const bottom = box.y + box.height;
  const viewBox = `${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.width.toFixed(1)} ${box.height.toFixed(1)}`;
  const label =
    part === "brush"
      ? t({
          de: "Die Zahnbürste steht im Becher am Waschbecken",
          en: "The toothbrush stands in the cup by the sink",
          zh: "牙刷放在洗手池边的杯子里",
          hi: "टूथब्रश सिंक के पास गिलास में खड़ा है",
          es: "El cepillo de dientes está en el vaso junto al lavabo",
          ar: "فرشاة الأسنان في الكوب بجانب المغسلة",
          ru: "Зубная щётка стоит в стаканчике у раковины",
        })
      : part === "paste"
        ? t({
            de: "Zahnpasta kommt auf die Zahnbürste",
            en: "Toothpaste goes onto the toothbrush",
            zh: "牙膏挤到牙刷上",
            hi: "टूथपेस्ट ब्रश पर लगता है",
            es: "La pasta de dientes va sobre el cepillo",
            ar: "المعجون يوضع على الفرشاة",
            ru: "Зубная паста ложится на щётку",
          })
        : t({
            de: "Die Zahnbürste wird ausgespült und kommt zurück in den Becher",
            en: "The toothbrush is rinsed and goes back into the cup",
            zh: "牙刷冲干净后放回杯子里",
            hi: "टूथब्रश धोकर वापस गिलास में रखा जाता है",
            es: "El cepillo se enjuaga y vuelve al vaso",
            ar: "تُشطف الفرشاة وتعود إلى الكوب",
            ru: "Щётку споласкивают и ставят обратно в стаканчик",
          });
  return (
    <div ref={scene} className={`prep at-${part}`}>
      <svg className="prep-picture" viewBox={viewBox} role="img" aria-label={label}>
        <defs>
          <clipPath id="prep-frame">
            <rect {...frame} />
          </clipPath>
          <pattern id="prep-tiles" width={55} height={55} patternUnits="userSpaceOnUse">
            <rect width={55} height={55} fill="#e6f7ff" />
            <path d="M0 0.5 H55 M0.5 0 V55" stroke="#b8e2f5" strokeWidth={3} />
            <path d="M6 10 Q6 6 10 6 H18" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
          </pattern>
          <linearGradient id="prep-dawn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe9c4" />
            <stop offset="1" stopColor="#ffc59a" />
          </linearGradient>
          <linearGradient id="prep-wall-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={INK} stopOpacity={0} />
            <stop offset="1" stopColor={INK} stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="prep-chrome" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f6f9fc" />
            <stop offset="0.55" stopColor="#d5e0ea" />
            <stop offset="1" stopColor="#aebfcf" />
          </linearGradient>
          <linearGradient id="prep-bowl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a9d6ee" />
            <stop offset="0.6" stopColor="#d6eefa" />
            <stop offset="1" stopColor="#eef8fe" />
          </linearGradient>
        </defs>

        <g clipPath="url(#prep-frame)">
          <rect {...box} fill="url(#prep-tiles)" />
          <WindowSky daytime={daytime} />
          {/* The counter's shade on the wall just above it. */}
          <rect x={box.x} y={SINK - 34} width={box.width} height={34} fill="url(#prep-wall-shade)" />
          {/* The counter across the whole screen and down to its bottom, a soft line where it meets the wall. */}
          <rect x={box.x - 20} y={SINK} width={box.width + 40} height={Math.max(140, bottom - SINK + 20)} rx={26} fill="#fff" stroke={INK} strokeWidth={6} />
          <path d={`M${box.x} ${SINK + 9} H${box.x + box.width}`} stroke="#e3f1fa" strokeWidth={6} />
          <Basin />
          <Tap />
          {/* Shadows of the tube and the cup on the counter. */}
          <ellipse cx={114} cy={SINK + 3} rx={78} ry={6} fill={INK} opacity={0.1} />
          <ellipse cx={356} cy={SINK + 1} rx={38} ry={6} fill={INK} opacity={0.12} />
          {/* The cup's inside, behind the brush, and the far edge of its rim. */}
          <path d={CUP} fill="#cfe9ff" />
          <path d="M318 212 A38 7 0 0 1 394 212" fill="#b6dcfb" stroke={INK} strokeWidth={4} />
        </g>
      </svg>

      <div className="teeth-space" style={pictureSpace(box, unit)}>
        {daytime === "morning" && (
          <div className="teeth-piece prep-window-clip" style={{ left: WINDOW.x, top: WINDOW.y, width: WINDOW.width, height: WINDOW.height }}>
            <Piece area={{ x: SUN.x - SUN.r - 3, y: SUN.y - SUN.r - 3, width: 2 * SUN.r + 6, height: 2 * SUN.r + 6 }} within={WINDOW} className="prep-sun">
              <circle cx={SUN.x} cy={SUN.y} r={SUN.r} fill="#ffd23f" stroke={INK} strokeWidth={3} />
            </Piece>
          </div>
        )}
        <Piece area={WINDOW_FRONT} className="prep-still">
          <WindowFront daytime={daytime} />
        </Piece>

        {part === "tidy" && <Water />}

        <Piece
          area={TUBE_AREA}
          pivot={ORIGIN}
          className="prep-tube"
          over={
            <Piece area={TUBE_AREA} within={TUBE_AREA} pivot={ORIGIN} className="prep-tube-squeeze">
              <Tube />
            </Piece>
          }
        />

        {/* The brush (with its toothpaste or foam) behind the glass, so it stands in it. */}
        <BrushMoves>
          <Piece area={BRUSH_AREA} within={BRUSH_AREA} className="prep-still">
            <Toothbrush />
          </Piece>
          {part === "paste" && (
            <Piece area={{ x: -21, y: -31, width: 29, height: 20 }} within={BRUSH_AREA} className="prep-paste">
              <Paste />
            </Piece>
          )}
          {part === "tidy" && (
            <Piece area={{ x: -46, y: -46, width: 80, height: 36 }} within={BRUSH_AREA} className="prep-foam">
              <Foam />
            </Piece>
          )}
        </BrushMoves>

        <Piece area={{ x: 312, y: 206, width: 88, height: 98 }} className="prep-still">
          <path d={CUP} fill="#bde0fe" fillOpacity={0.55} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d="M318 212 A38 7 0 0 0 394 212" fill="none" stroke={INK} strokeWidth={4} />
          <path d="M328 224 L324 280" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
        </Piece>

        {/* The hand holding it, in front of the glass (the child's arm comes from in front of the sink): the same moves
            as the brush, so it holds the handle wherever the brush goes. Turned against the brush, so the arm always
            comes up from below, also while the brush stands in its cup. */}
        <BrushMoves>
          <Piece
            area={WRIST_BOX}
            within={BRUSH_AREA}
            pivot={WRIST}
            className="prep-wrist"
            over={
              <Piece
                area={WRIST_BOX}
                within={WRIST_BOX}
                className="prep-hand"
                over={
                  <Piece area={FIST_AREA} within={ORIGIN_BOX} className="prep-still">
                    <Fist daytime={daytime} />
                  </Piece>
                }
              />
            }
          />
        </BrushMoves>

        {TWINKLES[part].map(({ x, y, s, delay, className }) => (
          <Piece
            key={x}
            area={{ x, y, width: 100 * s, height: 100 * s }}
            className={`prep-twinkle ${className}`}
            style={{ animationDelay: `${delay}ms` } as CSSProperties}
          >
            <g transform={`translate(${x} ${y}) scale(${s})`}>
              <path d={STAR_PATH} fill="#ffd23f" stroke={INK} strokeWidth={8} />
            </g>
          </Piece>
        ))}
      </div>

      {/* The frame stays at the screen's edge, over everything. */}
      <svg className="prep-frame" viewBox={viewBox} aria-hidden>
        <FrameStroke frame={frame} unit={unit} />
      </svg>
    </div>
  );
}
