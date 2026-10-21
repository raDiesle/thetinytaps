import { useEffect, useRef, useState } from "react";
import { audioContext } from "@/lib/sfx";
import type { Sensitivity } from "./settings";

// Only the loudness of each moment is measured; the sound itself is never
// kept, played back or sent anywhere.

export type MicState = "asking" | "on" | "denied" | "missing";

/** dBFS at which the lion roars. Without auto gain, quiet rooms sit around -55 and shouting near the device reaches -15 to -5. */
export const LOUD_DB: Record<Sensitivity, number> = { low: -12, mid: -19, high: -26 };

/** The lion needs at least this much more than the room's own noise, so a noisy room doesn't roar on its own. */
const LOUD_ABOVE_FLOOR_DB = 18;
/** A sound counts for the mouse from this much above the room's noise. */
const QUIET_ABOVE_FLOOR_DB = 9;
const QUIET_MIN_DB = -62;
/** Short bangs (a tap on the tablet, a cough) don't count. */
const LOUD_HOLD_MS = 60;
const QUIET_HOLD_MS = 300;
/** Whispering comes in bits; gaps shorter than this keep it one sound. */
const QUIET_GAP_MS = 220;
/**
 * The room's noise level sinks fast and creeps up slowly, so a long shout
 * isn't taken for the room, and a few silent frames (when the microphone
 * starts) don't make the room seem silent.
 */
const FLOOR_RISE_DB_PER_S = 2;
const FLOOR_FALL_DB_PER_S = 15;
const FLOOR_START_DB = -55;
/** Below this the microphone sends plain zeros, not the room. */
const SILENT_DB = -85;

/** The meter shows this range of dBFS. */
const METER_MIN_DB = -66;
const METER_MAX_DB = -6;
const METER_FALL_PER_S = 1.4;

export const meterAt = (db: number) => Math.min(1, Math.max(0, (db - METER_MIN_DB) / (METER_MAX_DB - METER_MIN_DB)));

export type Heard = "loud" | "quiet";

/**
 * Turns the loudness of each frame into "loud" (the lion) or "quiet" (the
 * mouse) once a sound has lasted long enough. While `deaf` (the game itself
 * makes noise) it hears nothing, so the lion doesn't answer his own roar.
 */
export function createEar() {
  let floor = FLOOR_START_DB;
  let loudMs = 0;
  let quietMs = 0;
  let gapMs = 0;
  let meter = 0;

  return {
    /** The level to show, 0–1: jumps up with the voice and sinks slowly. */
    get meter() {
      return meter;
    },
    loudDb(sensitivity: Sensitivity) {
      return Math.max(LOUD_DB[sensitivity], floor + LOUD_ABOVE_FLOOR_DB);
    },
    hear(db: number, ms: number, deaf: boolean, sensitivity: Sensitivity): Heard | null {
      const dt = Math.min(ms, 100);
      meter = Math.max(meterAt(db), meter - (METER_FALL_PER_S * dt) / 1000);
      if (db < floor && db > SILENT_DB) floor = Math.max(db, floor - (FLOOR_FALL_DB_PER_S * dt) / 1000);
      else if (db > floor && !deaf) floor = Math.min(db, floor + (FLOOR_RISE_DB_PER_S * dt) / 1000);
      if (deaf) {
        loudMs = quietMs = gapMs = 0;
        return null;
      }
      const loud = this.loudDb(sensitivity);
      if (db >= loud) {
        loudMs += dt;
        quietMs += dt;
        gapMs = 0;
        if (loudMs >= LOUD_HOLD_MS) {
          loudMs = quietMs = 0;
          return "loud";
        }
        return null;
      }
      loudMs = 0;
      if (db >= Math.max(QUIET_MIN_DB, floor + QUIET_ABOVE_FLOOR_DB)) {
        quietMs += dt;
        gapMs = 0;
        if (quietMs >= QUIET_HOLD_MS) {
          quietMs = 0;
          return "quiet";
        }
      } else if ((gapMs += dt) > QUIET_GAP_MS) {
        quietMs = 0;
      }
      return null;
    },
  };
}

export type Ear = ReturnType<typeof createEar>;

/**
 * Listens to the microphone while `active` and calls `onFrame` with the
 * loudness in dBFS on every animation frame. The browser asks the grown-up
 * once; the microphone is switched off again when the game ends.
 */
export function useMicrophone(active: boolean, onFrame: (db: number, ms: number) => void): MicState {
  const [state, setState] = useState<MicState>("asking");
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  useEffect(() => {
    if (!active) return;
    const ac = audioContext();
    if (!navigator.mediaDevices?.getUserMedia || !ac) {
      setState("missing");
      return;
    }
    setState("asking");
    let cancelled = false;
    let stream: MediaStream | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let frame = 0;

    navigator.mediaDevices
      // Auto gain would make whispering as loud as shouting; echo cancellation keeps the game's own sounds out.
      .getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false } })
      .then((s) => {
        stream = s;
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        void ac.resume();
        source = ac.createMediaStreamSource(s);
        const analyser = ac.createAnalyser();
        analyser.fftSize = 1024;
        // Only to the analyser, never to the speakers.
        source.connect(analyser);
        const samples = new Float32Array(analyser.fftSize);
        let last = performance.now();
        const loop = (t: number) => {
          analyser.getFloatTimeDomainData(samples);
          let sum = 0;
          for (const v of samples) sum += v * v;
          const db = 20 * Math.log10(Math.max(Math.sqrt(sum / samples.length), 1e-5));
          onFrameRef.current(db, t - last);
          last = t;
          frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
        setState("on");
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const name = e instanceof DOMException ? e.name : "";
        setState(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "missing");
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      source?.disconnect();
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [active]);

  return state;
}

/** Whether the browser already lets this site use the microphone, where it can tell. */
export function useMicPermission(): PermissionState | null {
  const [permission, setPermission] = useState<PermissionState | null>(null);
  useEffect(() => {
    let status: PermissionStatus | null = null;
    const update = () => status && setPermission(status.state);
    navigator.permissions
      ?.query({ name: "microphone" as PermissionName })
      .then((s) => {
        status = s;
        update();
        s.addEventListener("change", update);
      })
      .catch(() => {
        // Firefox and older Safari can't tell; the game asks when it starts.
      });
    return () => status?.removeEventListener("change", update);
  }, []);
  return permission;
}
