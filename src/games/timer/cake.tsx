import { memo, type CSSProperties } from "react";
import { Draw, Family, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Kuchen (H-53): time that brings something, like the flower – a cake in the oven. Through the oven's window the dough
// rises out of its tin up to the dashed outline of the finished cake (H-64: the goal is seen from the start) and turns
// brown in the second half; every second a puff of warm air rises from the vent (H-63). At the end the door opens and
// the cake comes out onto the table by the fox family, who cheer. The dough is one drawing sliding up out of a box cut
// off behind the tin's front (`overflow: hidden`, moved by `transform`), never drawn again or stretched.

/** The oven's body, standing on the floor right of the table. */
export const OVEN = { x: 860, y: 300, w: 440, h: 500 } as const;

/** The window in the oven's door the child looks through. */
export const OVEN_WINDOW = { x: 930, y: 450, w: 300, h: 250 } as const;

/** The cake with its tin, as it stands on the rack in the oven: its box, the tin's rim and the dough's box in it. */
export const CAKE = { x: 970, y: 480, w: 220, h: 220, rim: 160, dough: { x: 10, y: 20, w: 200, h: 150 } } as const;

/** How much of the dough shows above the tin at the start: a flat little bump. */
export const DOUGH_START = 0.2;

/** The table the cake is put on at the end, and the fox family left of it (its child right of its grown-up). */
export const TABLE = { x: 560, w: 260, top: 615 } as const;
export const CAKE_FAMILY = 220;
export const CAKE_FLOOR = 800;

/** The dome of the risen cake in the dough box's units, also its dashed outline. */
const DOME = "M4 150 V108 C4 38 44 6 100 6 C156 6 196 38 196 108 V150 Z";

/** The kitchen: wall, window, floor, the table and the oven's body with its glowing inside; drawn once. */
const KitchenBackdrop = memo(function KitchenBackdrop() {
  const o = OVEN;
  const w = OVEN_WINDOW;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <defs>
          <radialGradient id="tm-oven-glow" cx="0.5" cy="0.55" r="0.65">
            <stop offset="0" stopColor="#ffd8a8" />
            <stop offset="0.6" stopColor="#ff922b" />
            <stop offset="1" stopColor="#c2410c" />
          </radialGradient>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="#fff4e0" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M0 ${520 + i * 32} H${STAGE_W}`} stroke="#f1dcb8" strokeWidth="3" />
        ))}
        <rect x="250" y="130" width="230" height="200" rx="10" fill="#a5dcff" stroke={INK} strokeWidth="6" />
        <path d="M365 130 V330 M250 230 H480" stroke={INK} strokeWidth="5" />
        <rect y="800" width={STAGE_W} height="100" fill="#e9c79a" />
        {/* The table the cake comes onto. */}
        <rect x={TABLE.x + 20} y={TABLE.top + 20} width="18" height={CAKE_FLOOR - TABLE.top - 20} fill="#8a5a2b" stroke={INK} strokeWidth="4" />
        <rect x={TABLE.x + TABLE.w - 38} y={TABLE.top + 20} width="18" height={CAKE_FLOOR - TABLE.top - 20} fill="#8a5a2b" stroke={INK} strokeWidth="4" />
        <rect x={TABLE.x} y={TABLE.top} width={TABLE.w} height="24" rx="6" fill="#c07a3a" stroke={INK} strokeWidth="5" />
        {/* The oven: body, its panel with knobs and the vent, and the hot inside behind the door's window. */}
        <rect x={o.x} y={o.y} width={o.w} height={o.h} rx="18" fill="#f1f3f5" stroke={INK} strokeWidth="6" />
        <rect x={o.x} y={o.y} width={o.w} height="80" rx="18" fill="#dee2e6" stroke={INK} strokeWidth="6" />
        {[950, 1040, 1130].map((x) => (
          <g key={x}>
            <circle cx={x} cy={o.y + 40} r="20" fill="#495057" stroke={INK} strokeWidth="4" />
            <path d={`M${x} ${o.y + 40} V${o.y + 24}`} stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={1210 + i * 18} y={o.y + 22} width="8" height="36" rx="4" fill="#868e96" />
        ))}
        <rect x={w.x - 10} y={w.y - 10} width={w.w + 20} height={w.h + 20} fill="url(#tm-oven-glow)" />
        <path d={`M${w.x} ${w.y + 8} q20 -14 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t20 0`} fill="none" stroke="#e8590c" strokeWidth="6" />
        <path d={`M${w.x} ${CAKE.y + CAKE.h - 8} H${w.x + w.w}`} stroke="#495057" strokeWidth="6" />
        <rect x={o.x + 30} y={o.y + o.h - 8} width="40" height="14" rx="4" fill="#495057" />
        <rect x={o.x + o.w - 70} y={o.y + o.h - 8} width="40" height="14" rx="4" fill="#495057" />
      </Draw>
    </Layer>
  );
});

/** The oven door around the window, with its handle and glass; drawn once, it opens down at the end. */
const Door = memo(function Door() {
  const d = { x: 885, y: 400, w: 390, h: 375 };
  const w = OVEN_WINDOW;
  const hole = `M${w.x + 14} ${w.y} H${w.x + w.w - 14} Q${w.x + w.w} ${w.y} ${w.x + w.w} ${w.y + 14} V${w.y + w.h - 14} Q${w.x + w.w} ${w.y + w.h} ${w.x + w.w - 14} ${w.y + w.h} H${w.x + 14} Q${w.x} ${w.y + w.h} ${w.x} ${w.y + w.h - 14} V${w.y + 14} Q${w.x} ${w.y} ${w.x + 14} ${w.y} Z`;
  return (
    <Layer x={d.x} y={d.y - 30} w={d.w} h={d.h + 30} className="tm-door tm-dims">
      <svg viewBox={`${d.x} ${d.y - 30} ${d.w} ${d.h + 30}`}>
        <path
          d={`M${d.x + 16} ${d.y} H${d.x + d.w - 16} Q${d.x + d.w} ${d.y} ${d.x + d.w} ${d.y + 16} V${d.y + d.h} H${d.x} V${d.y + 16} Q${d.x} ${d.y} ${d.x + 16} ${d.y} Z ${hole}`}
          fill="#ced4da"
          stroke={INK}
          strokeWidth="6"
          fillRule="evenodd"
        />
        <path d={hole} fill="#ffe8cc" opacity="0.18" stroke={INK} strokeWidth="5" />
        <path
          d={`M${w.x + 30} ${w.y + w.h - 30} L${w.x + 90} ${w.y + 30} M${w.x + 60} ${w.y + w.h - 30} L${w.x + 110} ${w.y + 60}`}
          stroke="#fff"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.4"
        />
        <rect x={d.x + 60} y={d.y - 26} width={d.w - 120} height="18" rx="9" fill="#868e96" stroke={INK} strokeWidth="4" />
        <path d={`M${d.x + 80} ${d.y - 8} V${d.y + 4} M${d.x + d.w - 80} ${d.y - 8} V${d.y + 4}`} stroke={INK} strokeWidth="6" />
      </svg>
    </Layer>
  );
});

/** The cake's dome in its colours: pale dough, or brown and baked. */
function Dome({ baked }: { baked?: boolean }) {
  const { w, h } = CAKE.dough;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={DOME} fill={baked ? "#d9963f" : "#fff0b3"} stroke={INK} strokeWidth="5" />
      <path d="M40 60 Q60 40 80 52 M120 46 Q140 38 160 58" fill="none" stroke={baked ? "#a8642a" : "#f2d98b"} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The cake in its tin on the rack: the dashed outline of the finished cake (the goal), the dough rising up to it and
 * browning, the way still to rise (lit by a tap, H-51) and the tin's front over the dough's foot. All of it moves out
 * onto the table at the end.
 */
function Cake({ glow }: { glow: number }) {
  const { dough } = CAKE;
  const pc = (v: number, of: number) => `${(v / of) * 100}%`;
  const box: CSSProperties = { left: pc(dough.x, CAKE.w), top: pc(dough.y, CAKE.h), width: pc(dough.w, CAKE.w), height: pc(dough.h, CAKE.h) };
  const style = {
    "--tm-out-x": pc(TABLE.x + TABLE.w / 2 - (CAKE.x + CAKE.w / 2), CAKE.w),
    "--tm-out-y": pc(TABLE.top - (CAKE.y + CAKE.h - 10), CAKE.h),
  } as CSSProperties;
  return (
    <Layer x={CAKE.x} y={CAKE.y} w={CAKE.w} h={CAKE.h} className="tm-cake" style={style}>
      <div className="tm-cake-part" style={box}>
        <svg viewBox={`0 0 ${dough.w} ${dough.h}`} preserveAspectRatio="none">
          <path d={DOME} fill="none" stroke="#a8642a" strokeWidth="4" strokeDasharray="12 10" />
        </svg>
      </div>
      <div className="tm-cake-part tm-sky-box" style={box}>
        <div className="tm-to-grow tm-move" style={{ "--tm-sprout": `${-DOUGH_START * 100}%` } as CSSProperties}>
          <LeftGlow n={glow} />
        </div>
      </div>
      <div className="tm-cake-part tm-sky-box" style={box}>
        <div className="tm-stalk tm-move" style={{ "--tm-sprout": `${(1 - DOUGH_START) * 100}%` } as CSSProperties}>
          <Dome />
          <div className="tm-baked">
            <Dome baked />
          </div>
        </div>
      </div>
      <svg className="tm-cake-tin" viewBox={`0 0 ${CAKE.w} ${CAKE.h}`}>
        <path d={`M22 ${CAKE.rim} H198 L192 ${CAKE.h - 10} H28 Z`} fill="#ced4da" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d={`M40 ${CAKE.rim + 14} V${CAKE.h - 20} M180 ${CAKE.rim + 14} V${CAKE.h - 20}`} stroke="#f8f9fa" strokeWidth="6" strokeLinecap="round" />
        <rect x="12" y={CAKE.rim - 8} width="196" height="14" rx="7" fill="#e9ecef" stroke={INK} strokeWidth="5" />
      </svg>
    </Layer>
  );
}

/** A puff of warm air from the oven's vent every second (H-63). */
function Vent() {
  return (
    <Layer x={1215} y={OVEN.y - 70} w={60} h={70}>
      <div className="tm-chug tm-beat tm-steam-puff" />
    </Layer>
  );
}

/** The whole picture: the dough rises and browns in the oven, then the door opens and the cake comes onto the table. */
export function CakeScene({ glow }: { glow: number }) {
  return (
    <>
      <KitchenBackdrop />
      <Cake glow={glow} />
      <Door />
      <Vent />
      <Family kind="fox" x={CAKE_FAMILY} floor={CAKE_FLOOR} />
    </>
  );
}
