import { useEffect, useRef, type ReactNode } from "react";
import { useAnyKey, useFrames, VIEW_H, VIEW_W, type LevelProps } from "./level";
import type { MachineEvent } from "./machineKit";

/** How fast the camera catches up with the action, per second. */
const CAMERA_FOLLOW = 2.6;

/** What the stage needs to know about a machine. */
export interface MachineBase {
  events: MachineEvent[];
  duration: number;
  /** The left edge of what the screen shows, `t` seconds after the tap (below 0 before it). */
  cameraTarget: (t: number) => number;
}

/**
 * The stage every Rube Goldberg machine runs on: waits for the tap (or a key),
 * then counts the seconds, plays the machine's sounds and lines at their
 * moments and lets the camera glide after the action. `children` draws the
 * machine at a moment, in world coordinates.
 */
export function MachineStage({
  machine,
  label,
  sound,
  say,
  onDone,
  children,
}: LevelProps & { machine: MachineBase; label: string; children: (t: number) => ReactNode }) {
  /** Seconds since the tap; below 0 until then. */
  const clock = useRef(-1);
  const fired = useRef(0);
  const camera = useRef(machine.cameraTarget(-1));

  useFrames((dt) => {
    if (clock.current >= 0) {
      clock.current += dt;
      const { events } = machine;
      while (fired.current < events.length && events[fired.current].at <= clock.current) {
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
    if (import.meta.env.PROD) return;
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

  return (
    <div className="marble-level" onPointerDown={start}>
      <svg className="marble-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-label={label}>
        <g transform={`translate(${-camera.current} 0)`}>{children(clock.current)}</g>
      </svg>
    </div>
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
