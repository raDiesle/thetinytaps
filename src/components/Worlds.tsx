import type { ReactNode } from "react";

/*
 * Each home category has a world of its own (idea V-08), so a child finds „its“ area again by the picture: a meadow
 * with a farm for Lebendige Welten, a table with toys for Zuordnen, building blocks for Buchstaben & Zahlen and a
 * children's room for Weitere. Its menus show it behind the cards (Sky), its home card a small piece of it
 * (WorldCardScene). The things are drawn once here, each in its own box, and placed by the two.
 */

/** The categories that have a world drawn here: every one of the home menu (content.test.ts checks it). */
export const WORLDS = ["lebendige-welten", "zuordnen", "buchstaben-zahlen", "weitere"] as const;

/** A category id that has a world drawn here. */
export type WorldId = (typeof WORLDS)[number];

/** Worlds inside a room: a wall with a window (the sun looks in) instead of the open sky with hills. */
export const INDOOR: readonly string[] = ["zuordnen", "weitere"];

/** A red barn with a white door; box 120 × 110. */
function Barn() {
  return (
    <g className="world-line">
      <path d="M8 52 L60 8 L112 52 V108 H8 Z" fill="#e85d5d" />
      <path d="M2 56 L60 4 L118 56" fill="none" stroke="#9b2c3a" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="60" cy="42" r="9" fill="#fff" />
      <rect x="38" y="66" width="44" height="42" fill="#fff" />
      <path d="M38 66 L82 108 M82 66 L38 108" />
    </g>
  );
}

/** A round tree; box 80 × 120. */
function Tree() {
  return (
    <g className="world-line">
      <rect x="32" y="66" width="16" height="52" rx="4" fill="#a8693f" />
      <circle cx="40" cy="44" r="36" fill="#3fae4a" />
      <circle cx="26" cy="38" r="5" fill="#ff6b6b" stroke="none" />
      <circle cx="52" cy="30" r="5" fill="#ff6b6b" stroke="none" />
      <circle cx="48" cy="56" r="5" fill="#ff6b6b" stroke="none" />
    </g>
  );
}

/** A short wooden fence; box 160 × 50. */
function Fence() {
  return (
    <g className="world-line" fill="#f7e2b5">
      <rect x="4" y="14" width="152" height="9" rx="3" />
      <rect x="4" y="30" width="152" height="9" rx="3" />
      {[8, 48, 88, 128].map((x) => (
        <path key={x} d="M0 8 L12 0 L24 8 V48 H0 Z" transform={`translate(${x} 0)`} />
      ))}
    </g>
  );
}

/** One wooden toy block with a letter or number on it; 42 × 42. */
function Block({ x, y, fill, sign }: { x: number; y: number; fill: string; sign: string }) {
  return (
    <g className="world-line" transform={`translate(${x} ${y})`}>
      <rect width="42" height="42" rx="6" fill={fill} />
      <text className="world-sign" x="21" y="31" textAnchor="middle">
        {sign}
      </text>
    </g>
  );
}

/** Six blocks piled up, three, two, one; box 150 × 130. */
function BlockPile() {
  return (
    <g>
      <Block x={4} y={86} fill="#ff6b6b" sign="A" />
      <Block x={54} y={86} fill="#ffd23f" sign="1" />
      <Block x={104} y={86} fill="#4cc9f0" sign="B" />
      <Block x={29} y={44} fill="#3ddc97" sign="2" />
      <Block x={79} y={44} fill="#b388ff" sign="C" />
      <Block x={54} y={2} fill="#ff9f5a" sign="3" />
    </g>
  );
}

/** Three blocks stacked a little askew; box 56 × 140. */
function BlockTower() {
  return (
    <g>
      <Block x={6} y={96} fill="#b388ff" sign="1" />
      <g transform="rotate(-6 28 96)">
        <Block x={8} y={52} fill="#ff6b6b" sign="O" />
      </g>
      <g transform="rotate(5 28 52)">
        <Block x={4} y={8} fill="#ffd23f" sign="2" />
      </g>
    </g>
  );
}

/** A striped ball; box 60 × 60. */
function Ball() {
  return (
    <g className="world-line">
      <circle cx="30" cy="30" r="26" fill="#ff6b6b" />
      <path d="M8 18 Q30 34 52 18 M8 42 Q30 26 52 42" stroke="#fff" strokeWidth="7" fill="none" />
      <circle cx="30" cy="30" r="26" fill="none" />
    </g>
  );
}

/** Coloured rings on a stick; box 70 × 100. */
function RingStacker() {
  return (
    <g className="world-line">
      <rect x="31" y="4" width="8" height="84" rx="4" fill="#a8693f" />
      <ellipse cx="35" cy="80" rx="32" ry="12" fill="#4cc9f0" />
      <ellipse cx="35" cy="62" rx="26" ry="11" fill="#3ddc97" />
      <ellipse cx="35" cy="45" rx="20" ry="10" fill="#ffd23f" />
      <ellipse cx="35" cy="29" rx="14" ry="9" fill="#ff6b6b" />
      <circle cx="35" cy="12" r="8" fill="#b388ff" />
    </g>
  );
}

/** A yellow rubber duck; box 80 × 70. */
function Duck() {
  return (
    <g className="world-line">
      <path d="M6 40 Q8 66 40 66 Q72 66 74 44 Q60 48 52 40 Z" fill="#ffd23f" />
      <circle cx="52" cy="24" r="18" fill="#ffd23f" />
      <path d="M68 22 L80 27 L68 32 Z" fill="#ff9f5a" />
      <circle cx="56" cy="20" r="3" className="world-dot" />
    </g>
  );
}

/** A toy chest with blocks peeping out; box 120 × 96. */
function ToyChest() {
  return (
    <g className="world-line">
      <rect x="22" y="6" width="26" height="26" rx="4" fill="#4cc9f0" transform="rotate(-12 35 19)" />
      <circle cx="78" cy="22" r="14" fill="#ff6b6b" />
      <rect x="6" y="30" width="108" height="62" rx="8" fill="#b06a3b" />
      <rect x="6" y="30" width="108" height="16" rx="6" fill="#c98250" />
      <circle cx="60" cy="66" r="7" fill="#ffd23f" />
    </g>
  );
}

/** A sitting teddy bear; box 84 × 104. */
function Teddy() {
  return (
    <g className="world-line" fill="#c98250">
      <circle cx="20" cy="14" r="11" />
      <circle cx="64" cy="14" r="11" />
      <ellipse cx="42" cy="76" rx="30" ry="26" />
      <circle cx="16" cy="94" r="11" />
      <circle cx="68" cy="94" r="11" />
      <circle cx="42" cy="34" r="26" />
      <ellipse cx="42" cy="44" rx="11" ry="8" fill="#f2c79a" />
      <circle cx="33" cy="30" r="3" className="world-dot" />
      <circle cx="51" cy="30" r="3" className="world-dot" />
      <circle cx="42" cy="41" r="3" className="world-dot" />
    </g>
  );
}

/** The sun of the menus, its rays turning; box 200 × 200. */
export function Sun() {
  return (
    <>
      <g className="sky-sun-rays">
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x="94" y="4" width="12" height="36" rx="6" transform={`rotate(${i * 30} 100 100)`} />
        ))}
      </g>
      <circle cx="100" cy="100" r="52" />
      <circle className="sky-sun-cheek" cx="74" cy="112" r="9" />
      <circle className="sky-sun-cheek" cx="126" cy="112" r="9" />
      <circle className="sky-sun-eye" cx="82" cy="92" r="6" />
      <circle className="sky-sun-eye" cx="118" cy="92" r="6" />
      <path className="sky-sun-mouth" d="M84 116 Q100 132 116 116" />
    </>
  );
}

/** One thing of a world on its own, placed by the styles (`world-<name>`). */
function Thing({ name, box, children }: { name: string; box: string; children: ReactNode }) {
  return (
    <svg className={`world-thing world-${name}`} viewBox={box}>
      {children}
    </svg>
  );
}

/** The window of a room world in the top right corner, where the sky's sun is otherwise: the sun looks in at the pane that is always on screen. */
export function WorldWindow() {
  return (
    <svg className="world-window" viewBox="0 0 220 220">
      <rect x="10" y="10" width="200" height="200" rx="10" className="world-glass" />
      <svg className="world-sun" x="12" y="20" width="96" height="96" viewBox="0 0 200 200">
        <Sun />
      </svg>
      <path className="world-cloud" d="M30 180 a14 14 0 0 1 3-27 a18 18 0 0 1 33-5 a15 15 0 0 1 25 12 a13 13 0 0 1-3 20 Z" />
      {/* The frame: a dark edge under a white bar. */}
      <path className="world-frame-edge" d="M10 10 H210 V210 H10 Z M110 10 V210 M10 110 H210" />
      <path className="world-frame" d="M10 10 H210 V210 H10 Z M110 10 V210 M10 110 H210" />
    </svg>
  );
}

/** What stands in front of the backdrop of a world, along the bottom of the screen. */
export function WorldGround({ world }: { world: WorldId }) {
  switch (world) {
    case "lebendige-welten":
      return (
        <>
          <Thing name="barn" box="0 0 120 110">
            <Barn />
          </Thing>
          <Thing name="fence" box="0 0 160 50">
            <Fence />
          </Thing>
          <Thing name="tree" box="0 0 80 120">
            <Tree />
          </Thing>
          <Thing name="tree2" box="0 0 80 120">
            <Tree />
          </Thing>
        </>
      );
    case "buchstaben-zahlen":
      return (
        <>
          <Thing name="pile" box="0 0 150 130">
            <BlockPile />
          </Thing>
          <Thing name="tower" box="0 0 56 140">
            <BlockTower />
          </Thing>
        </>
      );
    case "zuordnen":
      return (
        <>
          <svg className="world-table" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path className="world-table-top" d="M-10 4 H1210 V44 H-10 Z" />
            <path className="world-table-front" d="M-10 44 H1210 V130 H-10 Z" />
          </svg>
          <Thing name="ball" box="0 0 60 60">
            <Ball />
          </Thing>
          <Thing name="rings" box="0 0 70 100">
            <RingStacker />
          </Thing>
          <Thing name="duck" box="0 0 80 70">
            <Duck />
          </Thing>
        </>
      );
    case "weitere":
      return (
        <>
          <svg className="world-floor" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path className="world-floor-boards" d="M-10 4 H1210 V110 H-10 Z" />
            <path className="world-floor-lines" d="M-10 36 H1210 M-10 70 H1210" />
            <ellipse className="world-rug" cx="600" cy="62" rx="300" ry="30" />
          </svg>
          <Thing name="chest" box="0 0 120 96">
            <ToyChest />
          </Thing>
          <Thing name="teddy" box="0 0 84 104">
            <Teddy />
          </Thing>
        </>
      );
  }
}

/**
 * A small piece of a world at the top of its home card, behind the collage of its games: 300 × 150, as wide as the
 * card, its things at both sides. Sky, wall, ground and table reach on beyond the edges, for cards of any shape.
 */
export function WorldCardScene({ world }: { world: WorldId }) {
  return (
    <svg className="world-card-scene" viewBox="0 0 300 150" preserveAspectRatio="xMidYMax meet" aria-hidden>
      {world === "lebendige-welten" && (
        <>
          <rect className="world-card-sky" x="-400" y="-300" width="1100" height="460" />
          <path className="hill-back" d="M-400 100 C40 76 110 76 160 98 C210 120 260 82 700 92 V160 H-400 Z" />
          <path className="hill-front" d="M-400 128 C50 112 120 116 170 124 C220 132 270 118 700 120 V160 H-400 Z" />
          <g transform="translate(12 64) scale(0.6)">
            <Barn />
          </g>
          <g transform="translate(244 54) scale(0.56)">
            <Tree />
          </g>
        </>
      )}
      {world === "zuordnen" && (
        <>
          <rect className="world-card-wall" x="-400" y="-300" width="1100" height="460" />
          <path className="world-table-top" d="M-400 112 H700 V128 H-400 Z" />
          <path className="world-table-front" d="M-400 128 H700 V160 H-400 Z" />
          <g transform="translate(16 76) scale(0.62)">
            <Ball />
          </g>
          <g transform="translate(248 60) scale(0.54)">
            <RingStacker />
          </g>
        </>
      )}
      {world === "buchstaben-zahlen" && (
        <>
          <rect className="world-card-sky" x="-400" y="-300" width="1100" height="460" />
          <path className="hill-front" d="M-400 122 C50 108 120 112 170 120 C220 128 270 114 700 118 V160 H-400 Z" />
          <g transform="translate(8 62) scale(0.48)">
            <BlockPile />
          </g>
          <g transform="translate(264 56) scale(0.46)">
            <BlockTower />
          </g>
        </>
      )}
    </svg>
  );
}
