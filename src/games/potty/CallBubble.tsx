import { framesFor } from "./images";

/** The potty cut out of the bathroom picture (`fox-bad`), shown in Tapsi's speech bubble while it calls. */
export const CALL_PICTURE = "fox-toepfchen";

/**
 * Where the bubble lies in the kitchen picture `rufen` (1376 × 768): on the wall left of Tapsi's head, above the
 * table, its tail ending just before Tapsi's mouth. Clear of the top that phones on their side cut off.
 */
const BOX = { x: 290, y: 125, w: 390, h: 300 };
const BUBBLE = { cx: 470, cy: 255, rx: 165, ry: 120 };
const TIP = { x: 665, y: 410 };
/** The tail leaves the bubble between these two angles (degrees, clockwise from the right). */
const TAIL = [20, 50];

const on = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${BUBBLE.cx + BUBBLE.rx * Math.cos(a)} ${BUBBLE.cy + BUBBLE.ry * Math.sin(a)}`;
};

/** The bubble's outline: the long way round the ellipse, then out to the tip and back. */
const OUTLINE = `M ${on(TAIL[0])} A ${BUBBLE.rx} ${BUBBLE.ry} 0 1 0 ${on(TAIL[1])} L ${TIP.x} ${TIP.y} Z`;

/** How big the potty stands in the bubble. */
const POTTY = { w: 190, h: 181 };

/**
 * „Mama! Papa!“: a speech bubble with only the potty in it, so the child sees where Tapsi wants to go – no words, no
 * emoji. It lies in a layer cut like the picture (`.pt-scene`), so it stays beside Tapsi on every screen, and pops
 * out of its tip once (the svg's own transform, a layer of its own).
 */
export function CallBubble() {
  const potty = framesFor(CALL_PICTURE)[0];
  return (
    <div className="pt-scene" aria-hidden>
      <svg
        className="pt-call"
        viewBox={`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`}
        style={{
          left: `${(BOX.x / 1376) * 100}%`,
          top: `${(BOX.y / 768) * 100}%`,
          width: `${(BOX.w / 1376) * 100}%`,
          height: `${(BOX.h / 768) * 100}%`,
          transformOrigin: `${((TIP.x - BOX.x) / BOX.w) * 100}% ${((TIP.y - BOX.y) / BOX.h) * 100}%`,
        }}
      >
        <path d={OUTLINE} fill="#fff" stroke="#2a1e5c" strokeWidth="8" strokeLinejoin="round" />
        {potty && <image href={potty} x={BUBBLE.cx - POTTY.w / 2} y={BUBBLE.cy - POTTY.h / 2} width={POTTY.w} height={POTTY.h} />}
      </svg>
    </div>
  );
}
