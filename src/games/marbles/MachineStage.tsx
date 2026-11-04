import { useEffect, useRef, type ReactNode } from "react";
import { cameraLayer, useAnyKey, useFrames, useLevelName, VIEW_H, VIEW_W, type LevelProps } from "./level";
import type { MarbleLevel } from "./settings";
import type { MachineEvent } from "./machineKit";
import { PROD } from "@/lib/buildInfo";
import { loadRealSounds } from "@/lib/realSounds";
import { playPop } from "@/lib/sfx";

/** How fast the camera catches up with the action, per second. */
const CAMERA_FOLLOW = 2.6;

/**
 * A station where the machine holds still until the child taps (R-03): at `at` seconds everything stops, the thing at
 * (`x`, `y`) – the one that sets off the next part – glows with a still 👇 beside it, and a tap or key lets it run on.
 * With „Von selbst“ (`LevelProps.watch`) the machine runs straight through.
 */
export interface MachineStop {
  at: number;
  x: number;
  y: number;
}

/** What the stage needs to know about a machine. */
export interface MachineBase {
  events: MachineEvent[];
  duration: number;
  /** How wide the world is: all of it is drawn, and the camera moves it as a whole. */
  width: number;
  /** The left edge of what the screen shows, `t` seconds after the tap (below 0 before it). */
  cameraTarget: (t: number) => number;
  /** Where it waits for the child's tap on the way, in order; the camera shows each spot while it waits (`stops.test.ts`). */
  stops: MachineStop[];
}

/**
 * The stage every Rube Goldberg machine runs on: waits for the tap (or a key),
 * then counts the seconds, plays the machine's sounds and lines at their
 * moments and lets the camera glide after the action. At each of the machine's
 * stops the clock holds until the next tap. `children` draws the machine at a
 * moment, in world coordinates.
 */
export function MachineStage({
  machine,
  level,
  sound,
  say,
  onDone,
  watch,
  children,
}: LevelProps & { machine: MachineBase; level: MarbleLevel; children: (t: number) => ReactNode }) {
  const label = useLevelName(level);
  /** Seconds since the tap; below 0 until then. */
  const clock = useRef(-1);
  const fired = useRef(0);
  /** The next stop on the way, and whether the machine waits there now. */
  const nextStop = useRef(0);
  const waiting = useRef(false);
  const camera = useRef(machine.cameraTarget(-1));
  const box = useRef<HTMLDivElement>(null);

  // The real recordings among the machine's sounds, loaded at once so even the first one is real.
  useEffect(() => loadRealSounds(machine.events.map((e) => e.sound)), [machine]);

  useFrames((dt) => {
    if (clock.current >= 0 && !waiting.current) {
      clock.current += dt;
      const next = watch ? undefined : machine.stops[nextStop.current];
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
        stops: machine.stops,
        seek(seconds: number) {
          clock.current = seconds;
          fired.current = machine.events.findIndex((e) => e.at > seconds);
          if (fired.current < 0) fired.current = machine.events.length;
          camera.current = machine.cameraTarget(seconds);
          nextStop.current = machine.stops.filter((s) => s.at < seconds).length;
          waiting.current = false;
        },
      },
    });
  }, [machine]);

  const start = () => {
    if (clock.current < 0) clock.current = 0;
    else if (waiting.current) {
      waiting.current = false;
      nextStop.current++;
      sound(playPop);
    }
  };
  const stop = waiting.current ? machine.stops[nextStop.current] : undefined;
  useAnyKey(start);

  return (
    <div className="marble-level" ref={box} onPointerDown={start}>
      <svg
        className="marble-camera"
        viewBox={`0 0 ${machine.width} ${VIEW_H}`}
        style={cameraLayer(box.current, { x: 0, y: 0, w: machine.width, h: VIEW_H }, { x: camera.current, y: 0, w: VIEW_W, h: VIEW_H })}
        aria-label={label}
      >
        {children(clock.current)}
        {stop && <StopHint {...stop} />}
      </svg>
    </div>
  );
}

/** How far the 👇 of a stop stands above its spot (its baseline), and how big the glow round the spot is. */
export const STOP_HINT = { above: 110, glow: 100 };

/**
 * Where the finger of a stop stands: 👇 above the spot, or 👈 right of its glow where the spot is high up – never below
 * it, where it covered the thing itself (the circus seal's body).
 */
export function stopFinger({ x, y }: { x: number; y: number }) {
  if (y - STOP_HINT.above >= 200) return { emoji: "👇", x, y: y - STOP_HINT.above };
  return { emoji: "👈", x: x + STOP_HINT.glow + 60, y: y + 30 };
}

/**
 * The glow round what sets off the next part (a halo, clear in the middle so the thing itself shows), and a still
 * finger pointing at it, while the machine waits at a stop. Drawn once when it stops, nothing in it moves.
 */
function StopHint({ x, y }: MachineStop) {
  const finger = stopFinger({ x, y });
  return (
    <g className="marble-hint">
      <defs>
        <radialGradient id="marble-stop-glow">
          <stop offset="0.5" stopColor="#ffe066" stopOpacity="0" />
          <stop offset="0.72" stopColor="#ffe066" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffe066" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={STOP_HINT.glow} fill="url(#marble-stop-glow)" />
      <circle cx={x} cy={y} r={STOP_HINT.glow * 0.72} fill="none" stroke="#ffd23f" strokeWidth="8" />
      <text x={finger.x} y={finger.y} fontSize="90" textAnchor="middle">
        {finger.emoji}
      </text>
    </g>
  );
}

/** The still finger that says „tap here“, until the machine starts. */
export function TapHint({ t, x, y }: { t: number; x: number; y: number }) {
  if (t >= 0) return null;
  return (
    <text className="marble-hint" x={x} y={y} fontSize="90" textAnchor="middle">
      👆
    </text>
  );
}
