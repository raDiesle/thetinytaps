import { type CSSProperties, useEffect, useRef, type ReactNode } from "react";
import { cameraLayer, cameraPoint, gliding, useAnyKey, useFrames, useLevelName, VIEW_H, VIEW_W, worldHint, type LevelProps } from "./level";
import type { MarbleLevel } from "./settings";
import type { MachineEvent } from "./machineKit";
import { PROD } from "@/lib/buildInfo";
import { loadRealSounds } from "@/lib/realSounds";
import { type HintSide, TapHint } from "@/components/TapHint";

/** How fast the camera catches up with the action, per second. */
export const CAMERA_FOLLOW = 2.6;

/**
 * How long a machine's picture may still move after its end, in seconds: then its clock stands and nothing is drawn
 * again. Ends that kept moving (a sprinkler, birds singing, a mole waving, an excavator humming) had an old phone paint
 * in every frame behind the end for as long as it was shown (perf, A-36); each level lets its end settle well before.
 */
export const AFTER_END_S = 6;

/** The machine's clock `dt` seconds on from `t`: it runs until `AFTER_END_S` after the end and stands there. */
export const tickClock = (machine: Pick<MachineBase, "duration">, t: number, dt: number) => Math.min(t + dt, Math.max(t, machine.duration + AFTER_END_S));

/** What the stage needs to know about a machine. */
export interface MachineBase {
  events: MachineEvent[];
  duration: number;
  /** How wide the world is: all of it is drawn, and the camera moves it as a whole. */
  width: number;
  /** The left edge of what the screen shows, `t` seconds after the tap (below 0 before it). */
  cameraTarget: (t: number) => number;
}

/** What the child taps to start a machine, in world units: the hint's ring goes round it, and the hand points from `side`. */
export interface StartSpot {
  x: number;
  y: number;
  r: number;
  side?: HintSide;
}

/**
 * Whether the world's stretch from `x0` to `x1` is on the screen or near it (`MachineStage`'s `children`); its `wide`
 * is how many world units the screen really shows beyond the view on each side (0 up to 16 : 9), for a level that must
 * know exactly when something has left the screen for good (the Licht-Kette's lava lamp, A-42). `shown` says whether the
 * stretch is on the screen itself, with `wide`: what only swings or rocks on beside the screen (a pendulum, a rocking
 * chair) holds still unless `shown`, since a phone still rasters the room half a screen beside what it shows, and the
 * „near“ of `seen` reaches that far (Gute Nacht's clock and chair, A-43).
 */
export type Seen = ((x0: number, x1: number) => boolean) & { wide: number; shown: (x0: number, x1: number) => boolean };

/**
 * A part of the world drawn in an svg of its own under (`back`) or over (`front`) the machine's svg, moved by the same
 * camera. Its `content` is built once (`useMemo`) and changes seldom: then the phone paints it once and only moves it,
 * while the machine's svg, where something changes in every frame, holds only what moves. Everything in one svg was
 * painted again in every frame – the room, the sky, the floor –, which kept an old phone's main thread busy (perf,
 * November 2026). A `className` may give the layer CSS of its own (an `opacity` the compositor animates, never one that
 * changes what is drawn).
 */
export interface WorldLayer {
  content: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * The stage every Rube Goldberg machine runs on: waits for the tap (or a key),
 * then counts the seconds, plays the machine's sounds and lines at their
 * moments and lets the camera glide after the action. At the machine's active
 * stop the clock holds until the next tap. `children` draws the machine at a
 * moment, in world coordinates.
 */
export function MachineStage({
  machine,
  level,
  sound,
  say,
  onDone,
  start: startSpot,
  back,
  over,
  front,
  top,
  children,
}: LevelProps & {
  machine: MachineBase;
  level: MarbleLevel;
  start: StartSpot;
  /** Still parts of the world under the machine (the room, the sky), in layers of their own, bottom first; a function of the machine's seconds where it must know them. */
  back?: WorldLayer[] | ((t: number, seen: Seen) => WorldLayer[]);
  /**
   * HTML laid over the machine's svg, under `front`, at the machine's seconds: `at` maps world units to its pixels (the
   * Lichterkette's dark, a small canvas the compositor stretches over the screen).
   */
  over?: (t: number, at: ReturnType<typeof cameraPoint>, seen: Seen) => ReactNode;
  /** Still or seldom changing parts over the machine, top last; a function of the machine's seconds where it must know them. */
  front?: WorldLayer[] | ((t: number, seen: Seen) => WorldLayer[]);
  /**
   * HTML laid over everything, `front` included, like `over`: small things moving for long that must stay in front of
   * what `front` draws (the Licht-Kette's fireflies over the fairy lights, as `Sprite`s).
   */
  top?: (t: number, at: ReturnType<typeof cameraPoint>, seen: Seen) => ReactNode;
  /**
   * Draws the machine at `t` seconds. `seen(x0, x1)` says whether that stretch of the world is on the screen or near it:
   * what moves for ever (flames, blinking lights) passes a still time while it is not, so it changes nothing off screen.
   */
  children: (t: number, seen: Seen) => ReactNode;
}) {
  const label = useLevelName(level);
  /** Seconds since the tap; below 0 until then. */
  const clock = useRef(-1);
  const fired = useRef(0);
  const camera = useRef(machine.cameraTarget(-1));
  const box = useRef<HTMLDivElement>(null);

  // The real recordings among the machine's sounds, loaded at once so even the first one is real.
  useEffect(() => loadRealSounds(machine.events.map((e) => e.sound)), [machine]);

  useFrames((dt) => {
    const before = clock.current;
    // After the first tap the machine runs through to its end by itself: nothing on the way waits for another tap (user
    // request, 24 November 2026 – its stops, R-03, were taken out).
    if (clock.current >= 0) {
      clock.current = tickClock(machine, clock.current, dt);
      const { events } = machine;
      while (fired.current < events.length && events[fired.current].at <= clock.current) {
        const e = events[fired.current++];
        if (e.sound) sound(e.sound);
        if (e.say) say(e.say);
        if (e.done) onDone();
      }
    }
    const target = machine.cameraTarget(clock.current);
    const from = camera.current;
    camera.current += (target - camera.current) * (1 - Math.exp(-dt * CAMERA_FOLLOW));
    // Still before the tap, once the camera is there; after the end it runs on for `AFTER_END_S`, since
    // some machines' pictures keep moving then (the good-night machine's „z z z“), and then stands for good.
    return clock.current !== before || gliding(from, target);
  });

  // For trying out the machine in the browser console: __machine.seek(20)
  useEffect(() => {
    if (PROD) return;
    Object.assign(window, {
      __machine: {
        duration: machine.duration,
        seek(seconds: number) {
          clock.current = seconds;
          fired.current = machine.events.findIndex((e) => e.at > seconds);
          if (fired.current < 0) fired.current = machine.events.length;
          camera.current = machine.cameraTarget(seconds);
        },
      },
    });
  }, [machine]);

  const start = () => {
    if (clock.current < 0) clock.current = 0;
  };
  useAnyKey(start);
  const world = { x: 0, y: 0, w: machine.width, h: VIEW_H };
  const view = { x: camera.current, y: 0, w: VIEW_W, h: VIEW_H };
  const at = cameraPoint(box.current, world, view);
  const cameraStyle = cameraLayer(box.current, world, view);
  // A screen wider than 16 : 9 shows more than the view, so half a view's width on both sides counts as near (up to 32 : 9).
  const w = box.current?.clientWidth || window.innerWidth;
  const h = box.current?.clientHeight || window.innerHeight;
  const wide = Math.max(0, (w / Math.min(w / VIEW_W, h / VIEW_H) - VIEW_W) / 2);
  const seen: Seen = Object.assign((x0: number, x1: number) => x1 >= camera.current - VIEW_W / 2 && x0 <= camera.current + 1.5 * VIEW_W, {
    wide,
    shown: (x0: number, x1: number) => x1 >= camera.current - wide && x0 <= camera.current + VIEW_W + wide,
  });
  const viewBox = `0 0 ${machine.width} ${VIEW_H}`;
  const layer = (l: WorldLayer, key: string) => (
    <svg
      key={key}
      className={l.className ? `marble-camera ${l.className}` : "marble-camera"}
      viewBox={viewBox}
      style={{ ...cameraStyle, ...l.style }}
      aria-hidden
    >
      {l.content}
    </svg>
  );
  const backs = typeof back === "function" ? back(clock.current, seen) : back;
  const fronts = typeof front === "function" ? front(clock.current, seen) : front;

  return (
    <div className="marble-level" ref={box} onPointerDown={start}>
      {backs?.map((l, i) => layer(l, `back${i}`))}
      <svg className="marble-camera" viewBox={viewBox} style={cameraStyle} aria-label={label}>
        {children(clock.current, seen)}
      </svg>
      {over?.(clock.current, at, seen)}
      {fronts?.map((l, i) => layer(l, `front${i}`))}
      {top?.(clock.current, at, seen)}
      {clock.current < 0 && <TapHint key="start" {...worldHint(at, startSpot)} side={startSpot.side} />}
    </div>
  );
}
