import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { cameraLayer, cameraPoint, useAnyKey, useFrames, useLevelName, VIEW_H, VIEW_W, worldHint, type LevelProps } from "./level";
import type { MarbleLevel } from "./settings";
import type { MachineEvent } from "./machineKit";
import { PROD } from "@/lib/buildInfo";
import { loadRealSounds } from "@/lib/realSounds";
import { playPop } from "@/lib/sfx";
import { type HintSide, TapHint } from "@/components/TapHint";

/** How fast the camera catches up with the action, per second. */
const CAMERA_FOLLOW = 2.6;

/**
 * A station where the machine may hold still until the child taps (R-03): at `at` seconds everything stops, the thing at
 * (`x`, `y`) – the one that sets off the next part – is marked by the shared `TapHint`, and a tap or key lets it run on.
 * Only the one stop marked `active` waits; the others stay in the data, ready to be switched on, and the machine runs
 * through them (at most one tap on the way, user feedback, November 2026). With „Von selbst“ (`LevelProps.watch`) the
 * machine runs straight through.
 */
export interface MachineStop {
  at: number;
  x: number;
  y: number;
  /** This stop waits for the child's tap; at most one stop of a machine is active (`stops.test.ts`). */
  active?: boolean;
}

/** The stops a machine really waits at: only the active one. */
export const activeStops = (machine: MachineBase) => machine.stops.filter((s) => s.active);

/** What the stage needs to know about a machine. */
export interface MachineBase {
  events: MachineEvent[];
  duration: number;
  /** How wide the world is: all of it is drawn, and the camera moves it as a whole. */
  width: number;
  /** The left edge of what the screen shows, `t` seconds after the tap (below 0 before it). */
  cameraTarget: (t: number) => number;
  /** Where it could wait for the child's tap on the way, in order, one of them `active`; the camera shows each spot while it waits (`stops.test.ts`). */
  stops: MachineStop[];
}

/** What the child taps to start a machine, in world units: the hint's ring goes round it, and the hand points from `side`. */
export interface StartSpot {
  x: number;
  y: number;
  r: number;
  side?: HintSide;
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
  watch,
  start: startSpot,
  children,
}: LevelProps & { machine: MachineBase; level: MarbleLevel; start: StartSpot; children: (t: number) => ReactNode }) {
  const label = useLevelName(level);
  /** Seconds since the tap; below 0 until then. */
  const clock = useRef(-1);
  const fired = useRef(0);
  /** The next stop on the way, and whether the machine waits there now. */
  const nextStop = useRef(0);
  const waiting = useRef(false);
  const camera = useRef(machine.cameraTarget(-1));
  const stops = useMemo(() => (watch ? [] : activeStops(machine)), [machine, watch]);
  const box = useRef<HTMLDivElement>(null);

  // The real recordings among the machine's sounds, loaded at once so even the first one is real.
  useEffect(() => loadRealSounds(machine.events.map((e) => e.sound)), [machine]);

  useFrames((dt) => {
    if (clock.current >= 0 && !waiting.current) {
      clock.current += dt;
      const next = stops[nextStop.current];
      if (next && clock.current >= next.at) {
        clock.current = next.at;
        waiting.current = true;
      }
      const { events } = machine;
      // What happens right at a stop waits for the tap, so the tap is what sets it off.
      const until = (e: MachineEvent) => (waiting.current ? e.at < clock.current : e.at <= clock.current);
      while (fired.current < events.length && until(events[fired.current])) {
        const e = events[fired.current++];
        if (e.sound) sound(e.sound);
        if (e.say) say(e.say);
        if (e.done) onDone();
      }
    }
    const target = machine.cameraTarget(clock.current);
    camera.current += (target - camera.current) * (1 - Math.exp(-dt * CAMERA_FOLLOW));
  });

  // For trying out the machine in the browser console: __machine.seek(20)
  useEffect(() => {
    if (PROD) return;
    Object.assign(window, {
      __machine: {
        duration: machine.duration,
        stops,
        seek(seconds: number) {
          clock.current = seconds;
          fired.current = machine.events.findIndex((e) => e.at > seconds);
          if (fired.current < 0) fired.current = machine.events.length;
          camera.current = machine.cameraTarget(seconds);
          nextStop.current = stops.filter((s) => s.at < seconds).length;
          waiting.current = false;
        },
      },
    });
  }, [machine, stops]);

  const start = () => {
    if (clock.current < 0) clock.current = 0;
    else if (waiting.current) {
      waiting.current = false;
      nextStop.current++;
      sound(playPop);
    }
  };
  const stop = waiting.current ? stops[nextStop.current] : undefined;
  useAnyKey(start);
  const world = { x: 0, y: 0, w: machine.width, h: VIEW_H };
  const view = { x: camera.current, y: 0, w: VIEW_W, h: VIEW_H };
  const at = cameraPoint(box.current, world, view);

  return (
    <div className="marble-level" ref={box} onPointerDown={start}>
      <svg className="marble-camera" viewBox={`0 0 ${machine.width} ${VIEW_H}`} style={cameraLayer(box.current, world, view)} aria-label={label}>
        {children(clock.current)}
      </svg>
      {clock.current < 0 && <TapHint key="start" {...worldHint(at, startSpot)} side={startSpot.side} />}
      {stop && <TapHint key={`stop${nextStop.current}`} {...worldHint(at, { x: stop.x, y: stop.y, r: STOP_HINT.ring })} side={stopFinger(stop).side} />}
    </div>
  );
}

/** How far the hand of a stop reaches above its spot (its far end), how big the glow round the spot is, and the ring in it. */
export const STOP_HINT = { above: 110, glow: 100, ring: 72 };

/**
 * Where the hand of a stop is: above the spot pointing down, or right of its glow pointing left where the spot is high
 * up – never below it, where it covered the thing itself (the circus seal's body). `x`, `y` is about the hand's far end.
 */
export function stopFinger({ x, y }: { x: number; y: number }): { side: HintSide; x: number; y: number } {
  if (y - STOP_HINT.above >= 200) return { side: "above", x, y: y - STOP_HINT.above };
  return { side: "right", x: x + STOP_HINT.glow + 60, y: y + 30 };
}
