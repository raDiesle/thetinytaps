import { memo, useState, type CSSProperties } from "react";
import type { Localized } from "@/lib/language";
import { bulbPolygon, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";
import type { SwapToy } from "./settings";

// Abwechseln (H-52): a toy lies by the fox child while an hourglass runs beside it; when it is empty the toy goes over
// to the bear child and the hourglass turns itself over – back and forth until a grown-up stops it.

const INK = "#3b2a20";

/** The floor the children, the toy and the hourglass stand on. */
export const SWAP_FLOOR = 760;

/**
 * The hourglass between the children, in its own units (0 0 w h): the posts and plates round the glass, the glass's
 * left edge and width, its top, neck and bottom. `cx` and `top` place it on the stage.
 */
export const SWAP_GLASS = { cx: 800, top: SWAP_FLOOR - 440, w: 210, h: 440, glassX: 40, glassW: 130, glassTop: 34, neck: 220, glassBottom: 406 } as const;

/**
 * Where the toy lies: its size, and its left edge by each child – right of the fox child, left of the bear child, with
 * the hourglass between them. The bear's place is `bear - fox` further right (`--tm-toy-way`).
 */
export const TOY = { w: 160, h: 130, fox: 530, bear: 910 } as const;

/** Where the two children stand (their left edges): the fox child at the left, the bear child at the right. */
export const SWAP_CHILDREN = { fox: 400, bear: 1080 } as const;

/** A box in the hourglass's own units as a place in percent of it. */
function inGlass(x: number, y: number, w: number, h: number): CSSProperties {
  const { w: W, h: H } = SWAP_GLASS;
  return { position: "absolute", left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%`, width: `${(w / W) * 100}%`, height: `${(h / H) * 100}%` };
}

/** The bulb's outline in the hourglass's units, the right way up or upside down. */
function bulbPath(top: number, bottom: number, upsideDown: boolean) {
  const { glassX, glassW } = SWAP_GLASS;
  const points: [number, number][] = [
    [0, 0],
    [0.01, 0.25],
    [0.06, 0.45],
    [0.18, 0.65],
    [0.35, 0.82],
    [0.46, 0.95],
    [0.48, 1],
    [0.52, 1],
    [0.54, 0.95],
    [0.65, 0.82],
    [0.82, 0.65],
    [0.94, 0.45],
    [0.99, 0.25],
    [1, 0],
  ];
  return points.map(([x, y], i) => `${i ? "L" : "M"}${glassX + x * glassW} ${upsideDown ? bottom - y * (bottom - top) : top + y * (bottom - top)}`).join(" ");
}

/** A playroom with a rug; drawn once. */
export const SwapBackdrop = memo(function SwapBackdrop() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="none">
        <rect width={STAGE_W} height={STAGE_H} fill="#e6f4ea" />
        {/* A garland of little flags along the wall. */}
        <path d="M120 120 Q800 230 1480 120" stroke="#9c6334" strokeWidth="4" fill="none" />
        {[260, 420, 580, 740, 900, 1060, 1220, 1360].map((x, i) => {
          const y = 120 + 110 * (1 - ((x - 800) / 680) ** 2) - 8;
          return (
            <path
              key={x}
              d={`M${x - 24} ${y} L${x + 24} ${y} L${x} ${y + 44} Z`}
              fill={["#ff8787", "#ffd43b", "#74c0fc", "#8ce99a"][i % 4]}
              stroke={INK}
              strokeWidth="3"
            />
          );
        })}
        <rect y={SWAP_FLOOR - 16} width={STAGE_W} height={STAGE_H} fill="#d9a066" />
        <path d={`M0 ${SWAP_FLOOR - 16} H${STAGE_W}`} stroke="#a8743f" strokeWidth="6" />
        <ellipse cx="800" cy={SWAP_FLOOR + 10} rx="560" ry="44" fill="#91a7ff" opacity="0.6" />
      </svg>
    </Layer>
  );
});

/**
 * The hourglass running one turn: the top heap sinks, the bottom one rises over `ms`, from `startedAt` on, so it shows
 * the turn's real time even when drawn later (a phone waking up). `flip` turns it over as it comes, the full bottom
 * going up – the hourglass turning itself over for the next child. Both are read once, as it comes: give each turn its
 * own `key`. `glow` lights what is left (H-51).
 */
export function SwapHourglass({ ms, startedAt, flip, running, glow }: { ms: number; startedAt: number; flip: boolean; running: boolean; glow: number }) {
  const { cx, top, w, h, glassX, glassW, glassTop, neck, glassBottom } = SWAP_GLASS;
  const [delay] = useState(() => Math.max(0, Date.now() - startedAt));
  const [flipped] = useState(flip);
  return (
    <Layer
      x={cx - w / 2}
      y={top}
      w={w}
      h={h}
      className={`tm-swap-glass${flipped ? " tm-flip" : ""}`}
      style={{ "--tm-ms": `${ms}ms`, "--tm-delay": `${-delay}ms` } as CSSProperties}
    >
      <svg viewBox={`0 0 ${w} ${h}`} style={inGlass(0, 0, w, h)}>
        <path d={`${bulbPath(glassTop, neck, false)} Z`} fill="#f1f8ff" />
        <path d={`${bulbPath(neck, glassBottom, true)} Z`} fill="#f1f8ff" />
      </svg>
      <div className="tm-bulb" style={{ ...inGlass(glassX, glassTop, glassW, neck - glassTop), clipPath: bulbPolygon(false), overflow: "hidden" }}>
        <div className="tm-sand tm-sand-top tm-move">
          <LeftGlow n={glow} />
        </div>
      </div>
      {running && (
        <div className="tm-stream" style={inGlass(w / 2 - 4, neck - 4, 8, glassBottom - neck)}>
          <div className="tm-stream-grains tm-move" />
        </div>
      )}
      <div className="tm-bulb" style={{ ...inGlass(glassX, neck, glassW, glassBottom - neck), clipPath: bulbPolygon(true), overflow: "hidden" }}>
        <div className="tm-sand tm-sand-bottom tm-move" />
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} style={inGlass(0, 0, w, h)}>
        <g fill="none" stroke={INK} strokeWidth="5" strokeLinejoin="round">
          <path d={bulbPath(glassTop, neck, false)} />
          <path d={bulbPath(neck, glassBottom, true)} />
        </g>
        <path
          d={`M${glassX + 26} ${glassTop + 22} Q${glassX + 20} ${glassTop + 90} ${glassX + 44} ${glassTop + 150}`}
          stroke="#fff"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          opacity="0.8"
        />
        {[14, w - 30].map((x) => (
          <rect key={x} x={x} y={glassTop - 8} width="16" height={glassBottom - glassTop + 16} rx="6" fill="#b5651d" stroke={INK} strokeWidth="4" />
        ))}
        <rect x="2" y="2" width={w - 4} height="30" rx="11" fill="#c97d3a" stroke={INK} strokeWidth="5" />
        <rect x="2" y={h - 32} width={w - 4} height="30" rx="11" fill="#c97d3a" stroke={INK} strokeWidth="5" />
      </svg>
    </Layer>
  );
}

/** The toys a grown-up can pick behind ⚙️, in their order there. */
export const SWAP_TOYS: { id: SwapToy; emoji: string; name: Localized }[] = [
  {
    id: "bobbycar",
    emoji: "🚗",
    name: { de: "Bobbycar", en: "Ride-on car", zh: "扭扭车", hi: "खिलौना कार", es: "Correpasillos", ar: "سيارة الأطفال", ru: "Каталка" },
  },
  { id: "doll", emoji: "🪆", name: { de: "Puppe", en: "Doll", zh: "娃娃", hi: "गुड़िया", es: "Muñeca", ar: "الدمية", ru: "Кукла" } },
  { id: "ball", emoji: "⚽", name: { de: "Ball", en: "Ball", zh: "球", hi: "गेंद", es: "Pelota", ar: "الكرة", ru: "Мяч" } },
];

/** The toy's drawing, in TOY.w × TOY.h units, standing on its bottom edge. */
function ToyDrawing({ toy }: { toy: SwapToy }) {
  if (toy === "bobbycar")
    return (
      <svg viewBox={`0 0 ${TOY.w} ${TOY.h}`}>
        <path
          d="M14 88 C10 60 30 52 56 52 H96 L112 30 H130 L126 56 C146 60 152 74 148 90 Z"
          fill="#e03131"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path d="M118 30 V14 M108 14 H130" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <rect x="52" y="40" width="40" height="16" rx="7" fill="#c92a2a" stroke={INK} strokeWidth="4" />
        <circle cx="138" cy="70" r="7" fill="#ffd43b" stroke={INK} strokeWidth="3" />
        {[40, 120].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="104" r="22" fill="#343a40" stroke={INK} strokeWidth="4" />
            <circle cx={cx} cy="104" r="9" fill="#f8f9fa" />
          </g>
        ))}
      </svg>
    );
  if (toy === "doll")
    return (
      <svg viewBox={`0 0 ${TOY.w} ${TOY.h}`}>
        <path d="M54 126 L64 70 H96 L106 126 Z" fill="#cc5de8" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M58 82 L40 104 M102 82 L120 104" stroke={INK} strokeWidth="10" strokeLinecap="round" />
        <path d="M58 82 L40 104 M102 82 L120 104" stroke="#ffd8a8" strokeWidth="5" strokeLinecap="round" />
        <circle cx="80" cy="44" r="30" fill="#ffd8a8" stroke={INK} strokeWidth="5" />
        <path d="M50 42 C50 14 110 14 110 42 C104 28 94 24 80 26 C66 24 56 28 50 42 Z" fill="#f59f00" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <circle cx="70" cy="46" r="4" fill={INK} />
        <circle cx="90" cy="46" r="4" fill={INK} />
        <path d="M72 58 Q80 64 88 58" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="64" cy="56" r="5" fill="#ffa8a8" opacity="0.8" />
        <circle cx="96" cy="56" r="5" fill="#ffa8a8" opacity="0.8" />
      </svg>
    );
  return (
    <svg viewBox={`0 0 ${TOY.w} ${TOY.h}`}>
      <circle cx="80" cy="72" r="54" fill="#fff" stroke={INK} strokeWidth="5" />
      <path d="M80 50 L101 65 L93 90 H67 L59 65 Z" fill="#343a40" />
      <path d="M80 50 V20 M101 65 L130 56 M93 90 L110 116 M67 90 L50 116 M59 65 L30 56" stroke="#343a40" strokeWidth="5" />
    </svg>
  );
}

/**
 * The toy, lying by the child whose turn it is: `bear` moves it over to the bear child (a CSS transition, so it
 * travels across the floor), and back to the fox child without it.
 */
export function Toy({ toy, bear }: { toy: SwapToy; bear: boolean }) {
  return (
    <Layer
      x={TOY.fox}
      y={SWAP_FLOOR - TOY.h + 8}
      w={TOY.w}
      h={TOY.h}
      className={`tm-toy tm-move${bear ? " tm-toy-bear" : ""}`}
      style={{ "--tm-toy-way": `${((TOY.bear - TOY.fox) / TOY.w) * 100}%` } as CSSProperties}
    >
      <ToyDrawing toy={toy} />
    </Layer>
  );
}
