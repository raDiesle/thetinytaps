import { useRef, type RefObject } from "react";
import { STAR_PATH } from "@/components/Bursts";
import { useT } from "@/lib/language";
import { playPuff, playRecorded, playSplash, playTwinkle } from "@/lib/sfx";
import type { Cue } from "./cues";
import type { Daytime } from "./daytime";
import { fitBox, FrameStroke, INK, screenFrame, SKIN, useRoom, type Box } from "./mouth";

// Before brushing, at the sink: the toothbrush wiggles in its cup until a
// hand takes it out, then the tube comes over and squeezes a striped wave of
// toothpaste along the bristles and lies down again. All of it is CSS
// animation (teeth.css); the sounds (PREP_CUES) go by the brushing clock.
// After brushing the same sink again: the brush is rinsed under the tap and
// goes back into its cup. Through the window the sun comes up in the morning;
// in the evening the moon is out and the sleeve is a pyjama one.

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

/**
 * A child's fist round a handle that runs left to right through the origin, the arm going down off the picture:
 * four fingers curled round it, the thumb lying along the top.
 */
function Fist({ daytime }: { daytime: Daytime }) {
  const sleeve = daytime === "evening" ? "url(#prep-pyjama)" : "#8e7dff";
  return (
    <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
      {/* Long enough to reach past the screen's edge however much of the sink shows. */}
      <rect x={-17} y={8} width={34} height={900} rx={14} fill={SKIN} />
      <rect x={-23} y={66} width={46} height={860} rx={12} fill={sleeve} />
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
      <path className="prep-tube-body" d="M-20 -26 C-26 -60 -31 -108 -33 -136 L33 -136 C31 -108 26 -60 20 -26 Z" fill="#fff" />
      <path d="M8 -30 C12 -60 16 -100 18 -130 L28 -130 C26 -100 22 -60 17 -30 Z" fill="#e3f3ff" stroke="none" />
      <path className="prep-tube-stripe" d="M-24 -64 L24 -64 L28 -110 L-28 -110 Z" fill="#4cc9f0" strokeWidth={3} />
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

/** The striped wave of toothpaste on top of the bristles, in the toothbrush's coordinates. */
function Paste() {
  return (
    <g className="prep-paste">
      <clipPath id="prep-paste-reveal">
        <rect className="prep-paste-reveal" x={-42} y={-48} width={74} height={36} />
      </clipPath>
      <g clipPath="url(#prep-paste-reveal)" stroke={INK} strokeLinejoin="round" strokeLinecap="round">
        <path d="M-38 -14 C-40 -24 -32 -31 -24 -28 C-18 -36 -6 -36 -1 -29 C4 -36 16 -37 20 -29 C26 -30 30 -22 26 -14 Z" fill="#fff" strokeWidth={3} />
        <path d="M-32 -20 C-24 -26 -12 -29 -2 -23 C6 -29 16 -28 22 -21" fill="none" stroke="#4cc9f0" strokeWidth={3.5} />
        <path d="M-30 -16 C-22 -21 -12 -22 -2 -18 C6 -22 14 -22 22 -17" fill="none" stroke="#ff7088" strokeWidth={3} />
        {/* The little curl where the tube lifted off. */}
        <path d="M18 -30 C20 -40 30 -40 28 -32" fill="#fff" strokeWidth={3} />
      </g>
    </g>
  );
}

/** The foam left on the bristles after brushing, in the toothbrush's coordinates; the water washes it off. */
function Foam() {
  return (
    <g className="prep-foam" fill="#fff" stroke="#9fd8ef" strokeWidth={2}>
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

/** The water running from the tap into the basin while the brush is rinsed. */
function Water() {
  return (
    <g className="prep-water">
      <path
        d={`M214 ${SINK - 49} C212 ${SINK - 10} 216 ${SINK + 30} 214 ${SINK + 72} L228 ${SINK + 72} C226 ${SINK + 30} 230 ${SINK - 10} 228 ${SINK - 49} Z`}
        fill="#8fdcf7"
        opacity={0.85}
      />
      <path d={`M219 ${SINK - 44} V${SINK + 60}`} stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
      {[
        [196, SINK + 62],
        [246, SINK + 58],
        [204, SINK + 50],
      ].map(([x, y]) => (
        <circle key={x} className="prep-drop" cx={x} cy={y} r={4} fill="#8fdcf7" stroke={INK} strokeWidth={1.5} />
      ))}
    </g>
  );
}

/** A window with the sun rising, or the moon and stars. */
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
          </>
        ) : (
          <circle className="prep-sun" cx={x + width / 2} cy={y + height * 0.54} r={width * 0.21} fill="#ffd23f" stroke={INK} strokeWidth={3} />
        )}
        {/* Far hills, so the sun has something to rise behind. */}
        <path
          d={`M${x} ${y + height * 0.82} Q${x + width * 0.27} ${y + height * 0.66} ${x + width * 0.54} ${y + height * 0.8} T${x + width} ${y + height * 0.75} V${y + height} H${x} Z`}
          fill={evening ? "#1d4a5c" : "#8bd346"}
        />
      </g>
      <rect x={x} y={y} width={width} height={height} rx={10} fill="none" stroke="#fff" strokeWidth={10} />
      <path d={`M${x + width / 2} ${y} V${y + height} M${x} ${y + height / 2} H${x + width}`} stroke="#fff" strokeWidth={6} />
      <rect x={x - 5} y={y - 5} width={width + 10} height={height + 10} rx={14} fill="none" stroke={INK} strokeWidth={4} />
    </g>
  );
}

/** The tap behind the basin, shiny chrome. */
function Tap() {
  return (
    <g stroke={INK} strokeWidth={4} strokeLinejoin="round">
      <rect x={244} y={SINK - 24} width={28} height={26} rx={6} fill="#dfe7ef" />
      <path
        d={`M250 ${SINK - 22} V${SINK - 48} Q250 ${SINK - 62} 236 ${SINK - 62} L216 ${SINK - 62} Q210 ${SINK - 62} 210 ${SINK - 56} V${SINK - 48} L220 ${SINK - 48} V${SINK - 50} L236 ${SINK - 50} Q238 ${SINK - 50} 238 ${SINK - 48} V${SINK - 22} Z`}
        fill="#dfe7ef"
      />
      <rect x={250} y={SINK - 34} width={26} height={9} rx={4.5} fill="#ff8fab" strokeWidth={3} />
      <path d={`M244 ${SINK - 56} H226`} stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.9} />
    </g>
  );
}

/** The sink filling the screen; `free` is the part between heading and controls, where the sink has to fit. */
export function Prep({ part, daytime, free }: { part: PrepPart; daytime: Daytime; free: RefObject<HTMLElement | null> }) {
  const t = useT();
  const svg = useRef<SVGSVGElement>(null);
  const { box, unit } = fitBox(useRoom(svg, free), FOCUS);
  const frame = screenFrame(box, unit);
  const bottom = box.y + box.height;
  return (
    <svg
      ref={svg}
      className={`prep at-${part}`}
      viewBox={`${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.width.toFixed(1)} ${box.height.toFixed(1)}`}
      role="img"
      aria-label={
        part === "brush"
          ? t({ de: "Die Zahnbürste steht im Becher am Waschbecken", ru: "Зубная щётка стоит в стаканчике у раковины" })
          : part === "paste"
            ? t({ de: "Zahnpasta kommt auf die Zahnbürste", ru: "Зубная паста ложится на щётку" })
            : t({ de: "Die Zahnbürste wird ausgespült und kommt zurück in den Becher" })
      }
    >
      <defs>
        <clipPath id="prep-frame">
          <rect {...frame} />
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
        <rect {...box} fill="url(#prep-tiles)" />
        <Window daytime={daytime} />
        {/* The edge of the sink, across the whole screen and down to its bottom, the basin with its drain, and the tap. */}
        <rect x={box.x - 20} y={SINK} width={box.width + 40} height={Math.max(140, bottom - SINK + 20)} rx={26} fill="#fff" stroke={INK} strokeWidth={6} />
        <ellipse cx={220} cy={SINK + 70} rx={150} ry={30} fill="#d6eefa" stroke={INK} strokeWidth={4} />
        <path d={`M90 ${SINK + 62} Q220 ${SINK + 44} 350 ${SINK + 62}`} fill="none" stroke="#fff" strokeWidth={4} opacity={0.8} />
        <ellipse cx={220} cy={SINK + 78} rx={12} ry={4} fill="#9fb4c4" stroke={INK} strokeWidth={2.5} />
        <Tap />
        {part === "tidy" && <Water />}

        {/* The cup's back, then the brush in it, then the glass in front. */}
        <path d="M318 212 L394 212 L386 298 L326 298 Z" fill="#cfe9ff" />

        <g className="prep-tube">
          <Tube />
        </g>

        <g className="prep-brush">
          <g className="prep-brush-bob">
            <Toothbrush />
            {part === "paste" && <Paste />}
            {part === "tidy" && <Foam />}
            <g className="prep-hand">
              <g transform="translate(118 12)">
                <Fist daytime={daytime} />
              </g>
            </g>
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
        {/* Back in its cup: all tidy. */}
        {part === "tidy" &&
          [
            [300, 150, 0],
            [410, 168, 270],
            [352, 52, 540],
          ].map(([x, y, delay]) => (
            <g key={x} transform={`translate(${x} ${y}) scale(0.3)`}>
              <path className="prep-twinkle tidy" d={STAR_PATH} fill="#ffd23f" stroke={INK} strokeWidth={8} style={{ animationDelay: `${7500 + delay}ms` }} />
            </g>
          ))}
      </g>

      <FrameStroke frame={frame} unit={unit} />
    </svg>
  );
}
