import type { PointerEvent, ReactNode, Ref } from "react";
import { INK } from "@/components/drawing";
import type { TargetLanguage } from "@/content/targetLanguages";
import { pick } from "@/lib/language";
import { spokenIn } from "../phrases";
import { tapState } from "@/lib/tapTargets";
import { ActionButton } from "../house";
import { PACK } from "../kid";
import { type Hud, HUD_H, HUD_TOP, ACTION_R, SLOT_STEP, VIEW_H, VIEW_W } from "./hud";
import { Fitted, ITEMS, type ItemId, type Picture } from "./items";
import type { Fork, Point } from "./types";
import { itemOf, type Next, type View } from "./view";

// What a trail level draws besides its world: the layers the picture is stacked of, the rings, key caps and button
// pictures, and the big open backpack with the action button at the screen's bottom edge.

/** A pocket of the backpack on the screen: from its middle to its side, and its top and height. */
const FACH = 62;
const FACH_TOP = 772;
const POCKET_Y = 806;
const POCKET_H = 66;
/** The backpack's body is a little lower than the button's frame: its handle sticks out above it. */
const BAG_TOP = 724;
/** On a computer a small key cap under the action button, and one on each thing's front pocket, shows which key
 * does it. */
const KEY_Y = 864;
const POCKET_KEY_Y = 842;

/**
 * One layer of the picture: its own svg over the whole screen, moved as a whole by CSS. Moving a group inside one
 * svg makes the browser paint the whole picture again in every frame while the world scrolls, which stutters on
 * phones; a layer of its own is only shifted. `pan` is where the camera is (times the layer's depth) and `walker`
 * where someone walking stands in the world, drawn on (0, 0) of the svg – both in the picture's units, moving in
 * their `ms`; `scale` turns the picture's units into pixels. `stage` places and zooms the world in the svg (it
 * changes only with the screen), so `scale` then includes the zoom.
 */
export function Layer({
  scale,
  stage,
  pan: [px, py],
  ms,
  walker,
  svgRef,
  children,
}: {
  scale: number;
  stage?: string;
  pan: Point;
  ms: number;
  walker?: { x: number; y: number; ms: number };
  svgRef?: Ref<SVGSVGElement>;
  children: ReactNode;
}) {
  const svg = (
    <svg ref={svgRef} className="el-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
      {stage ? <g transform={stage}>{children}</g> : children}
    </svg>
  );
  return (
    <div className="tl-layer" style={{ transform: `translate(${-px * scale}px, ${-py * scale}px)`, transitionDuration: `${ms}ms` }}>
      {walker ? (
        <div className="tl-layer" style={{ transform: `translate(${walker.x * scale}px, ${walker.y * scale}px)`, transitionDuration: `${walker.ms}ms` }}>
          {svg}
        </div>
      ) : (
        svg
      )}
    </div>
  );
}

/** A thing standing in the open backpack on (0, 0), its bottom behind the front; a long thing (the plank) sticks out slanted. */
function InPack({ picture }: { picture: Picture }) {
  if (picture.w > picture.h * 2.5) return <g transform={`rotate(-58) scale(${150 / picture.w})`}>{picture.draw()}</g>;
  const s = Math.min(118 / picture.w, 104 / picture.h);
  return <g transform={`translate(0 ${Math.min(24, picture.h * s * 0.25)}) scale(${s})`}>{picture.draw()}</g>;
}

/** How big the ring round a thing lying in the world is: about as big as the thing. */
export const ringOf = (picture: Picture) => Math.min(110, Math.max(56, Math.max(picture.w, picture.h) / 2 + 14));

/** A dashed yellow ring round the thing the next tap picks up, in the world and in the backpack on the screen. */
export function WantRing({ at: [x, y], r }: { at: Point; r: number }) {
  return (
    <g className="tl-want">
      <circle cx={x} cy={y} r={r} stroke={INK} strokeWidth="13" />
      <circle cx={x} cy={y} r={r} stroke="#ffd43b" strokeWidth="7" />
    </g>
  );
}

/** A small key of the keyboard, drawn around its middle; `on` while it does something now, `down` while it is held. */
export function KeyCap({ x, y, w, on, down, children }: { x: number; y: number; w: number; on: boolean; down: boolean; children: ReactNode }) {
  return (
    <g className={`tl-key${on ? " on" : ""}${down ? " down" : ""}`}>
      <rect x={x - w / 2} y={y - 14} width={w} height={34} rx="8" className="tl-key-base" />
      <g className="tl-key-top">
        <rect x={x - w / 2} y={y - 18} width={w} height={32} rx="8" className="tl-key-face" stroke={INK} strokeWidth="3" />
        <g transform={`translate(${x} ${y - 2})`}>{children}</g>
      </g>
    </g>
  );
}

/** The picture on the action button for what the next tap does. */
function NextIcon({ icon }: { icon: Next["icon"] }) {
  if (icon === "paddle")
    return (
      <g transform="rotate(30)">
        <path d="M0 -40 V14" stroke={INK} strokeWidth="12" strokeLinecap="round" />
        <path d="M0 -40 V14" stroke="#c08552" strokeWidth="6" strokeLinecap="round" />
        <ellipse cy="24" rx="14" ry="22" fill="#fcc419" stroke={INK} strokeWidth="4" />
      </g>
    );
  if (icon === "climb")
    return <path d="M-30 26 H-12 V8 H6 V-10 H24 V-28" fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />;
  if (icon === "walk")
    return (
      <g fill="#fff" stroke={INK} strokeWidth="4">
        {[
          [-13, 8, -12],
          [13, -8, 12],
        ].map(([x, y, turn]) => (
          <g key={x} transform={`translate(${x} ${y}) rotate(${turn})`}>
            <ellipse cy="-6" rx="10" ry="15" fill="#4263eb" />
            <ellipse cy="16" rx="8" ry="7" fill="#4263eb" />
          </g>
        ))}
      </g>
    );
  return <Fitted picture={ITEMS[icon]} width={70} />;
}

/**
 * The child's backpack again, big and open at the bottom left of the screen, with the action button in its frame
 * right next to it, where `hud` puts them (`layoutHud`). `need` is the thing that helps while the child picks,
 * `held` the key held down; `pressSlot` takes a thing out of its pocket.
 */
export function BagAndButton({
  view,
  hud: { bagBox, slots, action, actionBox, corner, zoom },
  need,
  held,
  touchOnly,
  language,
  pressSlot,
}: {
  view: View;
  hud: Hud;
  need: ItemId | null;
  held: string | null;
  touchOnly: boolean;
  language: TargetLanguage;
  pressSlot: (slot: number) => (e: PointerEvent) => void;
}) {
  const next = view.action?.next;
  /** Bumped by the reminders: the ring and the pale thing come again. */
  const again = view.action?.nudge ?? 0;
  /** The free place in the backpack where the next thing goes, when the next tap picks one up. */
  const nextItem = next?.at ? itemOf(next.icon) : null;
  const packing = nextItem ? { item: nextItem, slot: view.bag.indexOf(null) } : null;
  const [bx, , bw] = bagBox;
  const handle = `M${bx + bw / 2 - 58} ${BAG_TOP + 14} Q${bx + bw / 2 - 58} ${BAG_TOP - 38} ${bx + bw / 2} ${BAG_TOP - 38} Q${bx + bw / 2 + 58} ${BAG_TOP - 38} ${bx + bw / 2 + 58} ${BAG_TOP + 14}`;
  return (
    <g transform={`translate(${corner[0]} ${corner[1]}) scale(${zoom}) translate(${-bx} ${-(HUD_TOP + HUD_H)})`}>
      <ActionButton
        waiting={!!view.action || view.queued}
        nudge={view.action?.nudge ?? 0}
        x={action[0]}
        y={action[1]}
        r={ACTION_R}
        box={actionBox}
        picture={next && <NextIcon icon={next.icon} />}
      />
      {!touchOnly && (
        <KeyCap x={action[0]} y={KEY_Y} w={110} on={!!view.action} down={held === " "}>
          <path d="M-24 -5 V5 H24 V-5" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </KeyCap>
      )}
      {/* The child's backpack again, big and open at the bottom left: its body is the frame, the handle on top
        sticks out, and the things stand side by side in its three pockets */}
      <g className={`tl-bag${view.choosing ? " open" : ""}`}>
        <path d={handle} stroke={INK} strokeWidth="20" strokeLinecap="round" fill="none" />
        <path d={handle} stroke={PACK.dark} strokeWidth="10" strokeLinecap="round" fill="none" />
        <rect x={bx + 8} y={BAG_TOP + 8} width={bw} height={HUD_TOP + HUD_H - BAG_TOP} rx="56" className="tl-bag-shadow" />
        <rect x={bx} y={BAG_TOP} width={bw} height={HUD_TOP + HUD_H - BAG_TOP} rx="56" fill={PACK.body} stroke={INK} strokeWidth="6" />
        <g key={view.bagBump} className={view.bagBump ? "tl-bag-bump" : undefined} style={{ transformOrigin: `${bx + bw / 2}px 888px` }}>
          {/* The lid along the top, folded open */}
          <path
            d={`M${bx + 56} ${BAG_TOP + 3} H${bx + bw - 56} Q${bx + bw - 6} ${BAG_TOP + 3} ${bx + bw - 3} ${BAG_TOP + 38} H${bx + 3} Q${bx + 6} ${BAG_TOP + 3} ${bx + 56} ${BAG_TOP + 3} Z`}
            fill={PACK.dark}
          />
          <path d={`M${bx + 3} ${BAG_TOP + 38} H${bx + bw - 3}`} stroke={INK} strokeWidth="4" />
          <path d={`M${bx + 60} ${BAG_TOP + 20} H${bx + bw - 60}`} stroke="#fff" strokeWidth="4" strokeDasharray="10 8" opacity="0.4" />
          {/* Three pockets, open at the top: each holds one thing and is a button to take it out */}
          {slots.map(([x], i) => (
            <g key={x}>
              {view.choosing && view.bag[i] && (
                <rect
                  x={x - FACH - 10}
                  y={FACH_TOP - 12}
                  width={2 * FACH + 20}
                  height={POCKET_Y + POCKET_H + 20 - FACH_TOP}
                  rx="28"
                  className="tl-fach-ring"
                  fill="none"
                  strokeWidth="9"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              )}
              <rect x={x - FACH} y={FACH_TOP} width={2 * FACH} height={POCKET_Y - FACH_TOP + 16} rx="20" fill={PACK.inside} stroke={INK} strokeWidth="4" />
              {!view.bag[i] && packing?.slot !== i && (
                <rect
                  x={x - FACH + 14}
                  y={FACH_TOP + 10}
                  width={2 * FACH - 28}
                  height={POCKET_Y - FACH_TOP - 14}
                  rx="12"
                  fill="none"
                  stroke={PACK.lining}
                  strokeWidth="4"
                  strokeDasharray="10 8"
                  opacity="0.45"
                />
              )}
            </g>
          ))}
          {slots.map(([x, y], i) => {
            const item = view.bag[i];
            if (!item) return null;
            const moving = view.entering === i ? " in" : view.leaving === i ? " out" : "";
            return (
              <g
                key={`${i}-${view.shake}`}
                className={`tl-slot${item === view.hint ? " hint" : ""}`}
                style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 80}ms` }}
              >
                <g transform={`translate(${x} ${y})`}>
                  <g key={item} className={`tl-thing${moving}`}>
                    <ellipse className="tl-glow" cx="0" cy="-48" rx="70" ry="64" />
                    <InPack picture={ITEMS[item]} />
                  </g>
                </g>
              </g>
            );
          })}
          {/* The thing the next tap picks up, pale and ringed like in the world, already over where it will go */}
          {packing && slots[packing.slot] && (
            <g key={again} transform={`translate(${slots[packing.slot][0]} ${slots[packing.slot][1] - 30})`}>
              <WantRing at={[0, -50]} r={62} />
              <g className="tl-pack-ghost">
                <InPack picture={ITEMS[packing.item]} />
              </g>
            </g>
          )}
          {/* The front of each pocket, raised like a button and pressed in when its thing comes out: its number key
          on a computer, a buckle on a tablet */}
          {slots.map(([x], i) => (
            <g key={x}>
              <rect x={x - FACH} y={POCKET_Y + 8} width={2 * FACH} height={POCKET_H} rx="18" fill={PACK.dark} stroke={INK} strokeWidth="4" />
              <g className={`tl-pocket${view.leaving === i ? " press" : ""}`}>
                <rect x={x - FACH} y={POCKET_Y} width={2 * FACH} height={POCKET_H} rx="18" fill={PACK.pocket} stroke={INK} strokeWidth="5" />
                <rect
                  x={x - FACH + 9}
                  y={POCKET_Y + 9}
                  width={2 * FACH - 18}
                  height={POCKET_H - 18}
                  rx="11"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                  opacity="0.6"
                />
                {touchOnly ? (
                  <>
                    <path
                      d={`M${x - FACH} ${POCKET_Y + 22} Q${x} ${POCKET_Y + 36} ${x + FACH} ${POCKET_Y + 22}`}
                      stroke={INK}
                      strokeWidth="3"
                      fill="none"
                      opacity="0.5"
                    />
                    <rect x={x - 13} y={POCKET_Y + 22} width="26" height="22" rx="5" fill={PACK.buckle} stroke={INK} strokeWidth="3" />
                  </>
                ) : (
                  <KeyCap x={x} y={POCKET_KEY_Y} w={40} on={view.choosing && !!view.bag[i]} down={held === `${i + 1}`}>
                    <text y="9" textAnchor="middle" fontSize="24" fontWeight="800" fontFamily="inherit" fill={INK}>
                      {i + 1}
                    </text>
                  </KeyCap>
                )}
              </g>
            </g>
          ))}
        </g>
        {/* What a tap hits: a thing with its pocket below it */}
        {slots.map(([x], i) => (
          <rect
            key={x}
            x={x - SLOT_STEP / 2}
            y={bagBox[1] - 60}
            width={SLOT_STEP}
            height={bagBox[3] + 60}
            fill="transparent"
            data-tap={tapState({ goal: need !== null && view.bag[i] === need })}
            onPointerDown={pressSlot(i)}
            role="button"
            aria-label={view.bag[i] ?? pick({ de: "leer", ru: "пусто", en: "empty", zh: "空的", hi: "ख़ाली", es: "vacío", ar: "فارغ" }, language.id)}
            className="tl-slot-tap"
          />
        ))}
      </g>
    </g>
  );
}

/** The round picture sign of each way at a fork. */
const WAY_R = 66;

/** The picture signs of the ways at each fork, on their signposts: always there; while the child picks a way at
 * `fork` they hop and glow, and on a computer a key cap under each says 1 or 2. `pressWay` picks a way. */
export function ForkSigns({
  forks,
  fork,
  touchOnly,
  held,
  language,
  pressWay,
}: {
  forks: Fork[];
  fork: View["fork"];
  touchOnly: boolean;
  held: string | null;
  language: TargetLanguage;
  pressWay: (way: number) => (e: PointerEvent) => void;
}) {
  return (
    <>
      {forks.flatMap((f) =>
        f.ways.map(({ id, Sign, sign: [x, y], say: wayName }, w) => {
          const on = fork?.id === f.id;
          return (
            <g
              key={`${id}-${on ? fork?.nudge : "off"}`}
              className={`tl-way${on ? " on" : ""}`}
              data-tap
              onPointerDown={pressWay(w)}
              role="button"
              aria-label={spokenIn(wayName, language).text}
            >
              <g className="tl-way-board" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${w * 120}ms` }}>
                <circle cx={x} cy={y} r={WAY_R + 12} className="tl-way-glow" fill="none" strokeWidth="14" />
                <circle cx={x} cy={y} r={WAY_R} className="tl-way-face" stroke={INK} strokeWidth="6" />
                <g transform={`translate(${x} ${y})`}>
                  <Sign />
                </g>
              </g>
              {on && !touchOnly && (
                <KeyCap x={x} y={y + WAY_R + 40} w={40} on down={held === `${w + 1}`}>
                  <text y="9" textAnchor="middle" fontSize="24" fontWeight="800" fontFamily="inherit" fill={INK}>
                    {w + 1}
                  </text>
                </KeyCap>
              )}
            </g>
          );
        }),
      )}
    </>
  );
}
