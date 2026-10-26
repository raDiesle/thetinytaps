import { useMemo, type PointerEvent } from "react";
import { pick, useAppLanguage } from "@/lib/language";
import { findScene } from ".";
import { SCENE_PHRASES } from "./phrases";
import type { Trip } from "./roads";
import { placeBox, type Box, type Scene, type SceneItem } from "./types";

// The marks ScenePlay draws over a picture: exit signs, hint and focus rings, key badges, find thumbnails.

/** Keys mode: the badge that lights up; the count restarts its animation on every press. */
export type Lit = { id: string; count: number };
/** The sign at the edge where a vehicle drove off; tapping it follows the vehicle into the other picture. */
export type Exit = { item: SceneItem; to: string; trip: Trip };

/**
 * Where a vehicle drove off: a bubble at the edge with the vehicle in it, an
 * arrow out of the picture and the emoji of the picture it went to.
 */
export function ExitSign({ exit, right, width, onFollow }: { exit: Exit; right: boolean; width: number; onFollow: (e: PointerEvent) => void }) {
  const [, y, , h] = placeBox(exit.item.box, exit.item.place);
  const cy = Math.min(860, Math.max(140, y + h / 2));
  const [bx, by, bw, bh] = exit.item.box;
  const dir = right ? 1 : -1;
  const words = pick(SCENE_PHRASES, useAppLanguage().id);
  return (
    <g
      className="scene-exit"
      transform={`translate(${right ? width - 140 : 140} ${cy})`}
      data-item={exit.item.id}
      data-tap
      role="button"
      aria-label={words.follow(exit.item)}
      onPointerDown={onFollow}
    >
      <g className="scene-exit-pulse">
        <path className="scene-exit-arrow" d={`M ${70 * dir} -50 L ${126 * dir} 0 L ${70 * dir} 50 Z`} />
        <rect className="scene-exit-bubble" x={-86} y={-70} width={172} height={140} rx={36} />
        <svg x={-70} y={-58} width={140} height={84} viewBox={`${bx} ${by} ${bw} ${bh}`}>
          <exit.item.Art />
        </svg>
        <text className="scene-exit-emoji" x={0} y={46}>
          {findScene(exit.to)?.emoji}
        </text>
      </g>
    </g>
  );
}

export function HintRing({ box: [x, y, w, h] }: { box: Box }) {
  const pad = 14;
  return <rect className="scene-hint" x={x - pad} y={y - pad} width={w + 2 * pad} height={h + 2 * pad} rx={28} />;
}

/** Keys mode: the glowing frame the arrow keys move around. */
export function FocusRing({ box: [x, y, w, h] }: { box: Box }) {
  const pad = 10;
  const rect = { x: x - pad, y: y - pad, width: w + 2 * pad, height: h + 2 * pad, rx: 24 };
  return (
    <g className="scene-focus" aria-hidden>
      <rect className="scene-focus-glow" {...rect} />
      <rect className="scene-focus-line" {...rect} />
    </g>
  );
}

const BADGE_R = 13;

/**
 * Keys mode: each item's key in a little bubble next to it. The bubble of the
 * item that was just started lights up, so the child sees where to look.
 */
export function KeyBadges({ scene, keyOf, lit }: { scene: Scene; keyOf: Map<string, string>; lit: Lit | null }) {
  const spots = useMemo(() => badgeSpots(scene, BADGE_R), [scene]);
  return (
    <g className="scene-keys" aria-hidden>
      {scene.items.map((item, i) => {
        const [cx, cy] = spots[i];
        const isLit = lit?.id === item.id;
        return (
          <g key={isLit ? `${item.id}-${lit.count}` : item.id} className={isLit ? "lit" : undefined}>
            <circle className="scene-key-glow" cx={cx} cy={cy} r={BADGE_R} />
            <g className="scene-key-cap">
              <circle cx={cx} cy={cy} r={BADGE_R} />
              <text x={cx} y={cy}>
                {keyOf.get(item.id)}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}

/**
 * Where the key badges go: just outside each item, at the spot that covers the
 * least of it, of the other items and of the badges placed before. Above the
 * item is preferred, then the sides, then below.
 */
function badgeSpots(scene: Scene, r: number): [number, number][] {
  const areas = scene.items.flatMap((item) => (item.hitAreas ?? [item.box]).map((box) => placeBox(box, item.place)));
  const covered = (cx: number, cy: number) =>
    areas.reduce((sum, [x, y, w, h]) => {
      const dx = Math.min(cx + r, x + w) - Math.max(cx - r, x);
      const dy = Math.min(cy + r, y + h) - Math.max(cy - r, y);
      return dx > 0 && dy > 0 ? sum + dx * dy : sum;
    }, 0);
  const gap = r + 4;
  const taken: [number, number][] = [];
  return scene.items.map((item) => {
    const [x, y, w, h] = placeBox(item.box, item.place);
    const candidates: [number, number][] = [
      ...[0.5, 0.25, 0.75, 0, 1].map((t): [number, number] => [x + w * t, y - gap]),
      ...[r, h / 2].flatMap((dy): [number, number][] => [
        [x - gap, y + dy],
        [x + w + gap, y + dy],
      ]),
      ...[0.5, 0, 1].map((t): [number, number] => [x + w * t, y + h + gap]),
    ];
    let best = candidates[0];
    let bestScore = Infinity;
    candidates.forEach(([cx, cy], order) => {
      const outside = cx < r || cy < r || cx > scene.width - r || cy > scene.height - r;
      const crowded = taken.some(([tx, ty]) => Math.hypot(tx - cx, ty - cy) < 2 * r + 4);
      // Order only breaks ties: a free spot further round always beats a covering one.
      const score = covered(cx, cy) + (outside ? 1e6 : 0) + (crowded ? 1e5 : 0) + order;
      if (score < bestScore) {
        best = [cx, cy];
        bestScore = score;
      }
    });
    taken.push(best);
    return best;
  });
}

/** The item drawn on its own, for the find question. */
export function Thumbnail({ item }: { item: SceneItem }) {
  const [x, y, w, h] = item.box;
  return (
    <svg className="find-thumb" viewBox={`${x} ${y} ${w} ${h}`} aria-hidden>
      <item.Art />
    </svg>
  );
}
