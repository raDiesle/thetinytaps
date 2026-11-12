import { useEffect, useState, type CSSProperties } from "react";
import { afterPageMotion } from "@/lib/pageMotion";
import "./tapHint.css";

/**
 * After how many ms without a tap the hint gets clearer (user feedback, November 2026: the longer a child looks for
 * what to tap, the plainer it becomes). Stage 1: the hand shows a tap and a ring goes out from the spot at each press.
 * Stage 2: the picture round the spot darkens and spot and hand grow. Before stage 1 nothing moves.
 */
export const TAP_HINT_STAGES_MS = [3500, 9000];

/** On which side of the spot the hand is, pointing at it: below (the default), above, left or right. */
export type HintSide = "below" | "above" | "left" | "right";

/** Which way the hand lies from the spot, a little to the side, so the hand doesn't hide what stands under the spot. */
const SIDE: Record<HintSide, { x: number; y: number }> = {
  below: { x: 0.36, y: 1 },
  above: { x: 0.36, y: -1 },
  left: { x: -1, y: 0.3 },
  right: { x: 1, y: 0.3 },
};

/** The hint's state for its CSS, with where it is: the spot's middle and radius, in pixels of its positioned parent. */
type HintStyle = CSSProperties & Record<`--${string}`, string>;

/**
 * „Tap here“ for what a child taps in a picture to go on: a warm golden ring round the spot and a drawn hand pointing
 * at it, the longer the child waits the clearer (`TAP_HINT_STAGES_MS`). An HTML layer laid over the picture: `x`, `y`
 * and `r` are in pixels of the nearest positioned parent (the picture's box), so the rings and the hand move as layers
 * of their own and the picture under them is never painted again. Taps go through it. Mount it anew (a `key`) for a new
 * spot, so it starts calm again; `hand={false}` leaves the hand out until the first stage.
 */
export function TapHint({ x, y, r, side = "below", hand = true, size }: { x: number; y: number; r: number; side?: HintSide; hand?: boolean; size?: number }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    let timers: number[] = [];
    const cancel = afterPageMotion(() => {
      timers = TAP_HINT_STAGES_MS.map((ms, i) => window.setTimeout(() => setStage(i + 1), ms));
    });
    return () => {
      cancel();
      for (const timer of timers) clearTimeout(timer);
    };
  }, []);

  const dir = SIDE[side];
  const len = Math.hypot(dir.x, dir.y);
  const ux = dir.x / len;
  const uy = dir.y / len;
  const handH = size ?? Math.max(60, Math.min(150, r * 1.35));
  // The fingertip touches the ring from outside; the hand turns so the finger points at the spot's middle.
  const tip = r * 0.92;
  const angle = (Math.atan2(-ux, uy) * 180) / Math.PI;
  const style: HintStyle = {
    "--x": `${x}px`,
    "--y": `${y}px`,
    "--r": `${r}px`,
    "--hand-h": `${handH}px`,
    "--tip-x": `${x + ux * tip}px`,
    "--tip-y": `${y + uy * tip}px`,
    "--turn": `${angle}deg`,
    "--grow-x": `${ux * r * 0.18}px`,
    "--grow-y": `${uy * r * 0.18}px`,
  };
  return (
    <div className={`tap-hint stage-${stage}`} style={style} aria-hidden>
      <div className="tap-hint-dim" />
      <div className="tap-hint-spot">
        <div className="tap-hint-glow" />
        <div className="tap-hint-ring" />
        {stage > 0 && <div className="tap-hint-wave" />}
      </div>
      {(hand || stage > 0) && (
        <div className="tap-hint-hand">
          <div className="tap-hint-press">
            <HintHand />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * A child's hand pointing up with its index finger, its fingertip at the top middle of its box (2 : 3, `width: 100%` and
 * `height: 100%`): the one hand of every „tap here“, also where it stands on its own, like under a film's choice cards.
 */
export function HintHand() {
  // Outlines first, all of them, then the fills over them: the shapes melt into one hand with one line round it.
  const parts = (
    <>
      <rect x="37" y="3" width="26" height="76" rx="13" />
      <rect x="21" y="50" width="64" height="68" rx="25" />
      <rect x="57" y="50" width="31" height="21" rx="10.5" />
      <rect x="59" y="68" width="31" height="21" rx="10.5" />
      <rect x="57" y="86" width="28" height="20" rx="10" />
      <rect x="9" y="58" width="22" height="44" rx="11" transform="rotate(-28 20 80)" />
    </>
  );
  return (
    <svg viewBox="0 0 100 150" className="tap-hint-svg">
      <g fill="#5c3d4e" stroke="#5c3d4e" strokeWidth="9" strokeLinejoin="round">
        {parts}
        <rect x="25" y="114" width="58" height="32" rx="9" />
      </g>
      <g fill="#ffd8b5">{parts}</g>
      <path d="M62 60.5 h8 M64 78.5 h8 M62 96 h7" stroke="#d99a78" strokeWidth="3" strokeLinecap="round" />
      <rect x="43" y="8" width="14" height="13" rx="6" fill="#fff1e6" />
      <path d="M44 60 q6 4 13 0" fill="none" stroke="#d99a78" strokeWidth="3" strokeLinecap="round" />
      <rect x="25" y="114" width="58" height="32" rx="9" fill="#4dabf7" />
      <rect x="25" y="121" width="58" height="7" fill="#fff" opacity="0.85" />
    </svg>
  );
}
