import { memo, useEffect, useMemo, useRef, type CSSProperties } from "react";
import { playDrum, playKnock, playTwinkle } from "@/lib/sfx";
import {
  cameraLayer,
  cameraPoint,
  gliding,
  SETTLE_S,
  useAnyKey,
  useFrames,
  useLevelName,
  levelNow,
  useLevelTimers,
  VIEW_H,
  VIEW_W,
  worldHint,
  type LevelProps,
  decay,
} from "./level";
import { TapHint } from "@/components/TapHint";
import { cameraOn } from "./machineKit";
import { Sparkles } from "./scenery";
import { pickRuns } from "./things";
import { createSim, DONE_AFTER_DRUM_S, DRUM, FLOOR, focusX, GROUPS, layOut, linkAge, linksSeconds, MARGIN, pushFirst, roomX, SCALE, stepSim } from "./topple";
import { LinkArt } from "./toppleLinks";

const INK = "#2a1e5c";
/** How fast the camera catches up with the falling, per second. */
const CAMERA_FOLLOW = 2.2;
/** One after another the things on the first screen drop in from above. */
const DROP_STAGGER_MS = 130;
const DROP_MS = 600;
/** If something got stuck, end anyway after this long per thing (plus the links' own seconds). */
const MAX_FALL_MS_EACH = 1500;

type Phase = "dropping" | "ready" | "falling" | "done";

/**
 * Everyday things stand in a long row through the room, small to tall again
 * and again, with a drum at the end. A tap pushes the first one; it tips over
 * onto the next, which tips onto the next … and the camera walks along. Between
 * two runs a link of another kind carries the fall on (`topple.ts`): a bolster
 * rolls off a bench onto a pop-up tent, a space hopper bounces away, a toy
 * balloon drifts off with its sandbag, a skateboard rides through a tunnel and
 * up a ramp, a fan blows a sailboat on wheels, an egg chair swings and flings
 * its teddy. At the end the broom hits the drum and sparkles burst out of it.
 * Every round brings other things.
 */
export function ToppleLevel({ sound, say, onDone }: LevelProps) {
  const label = useLevelName("topple");
  const layout = useMemo(() => layOut(pickRuns(GROUPS)), []);
  const { things, lefts, links, drumLeft, worldW } = layout;
  /** How many things stand on the first screen; only they drop in. */
  const onFirstScreen = useMemo(() => lefts.filter((l) => roomX(l) < VIEW_W).length, [lefts]);
  const sim = useMemo(() => createSim(layout), [layout]);
  const phase = useRef<Phase>("dropping");
  const fallStart = useRef(0);
  const drumAt = useRef(-Infinity);
  const now = useRef(levelNow());
  const camera = useRef(0);
  const box = useRef<HTMLDivElement>(null);
  // The knocks, the twinkle after the drum and the end are dropped when the level is left before them.
  const { later } = useLevelTimers();
  // The room is as wide as the whole row: drawn once, not again in every frame.
  const room = useMemo(() => <Room width={worldW} />, [worldW]);

  // Tock, tock, tock: each one on the first screen lands after dropping in; then the row is ready.
  useEffect(() => {
    const timers = things.slice(0, onFirstScreen).map((t, i) => later(() => sound(() => playKnock(1100 - t.h)), i * DROP_STAGGER_MS + DROP_MS * 0.7));
    timers.push(
      later(
        () => {
          phase.current = "ready";
        },
        onFirstScreen * DROP_STAGGER_MS + DROP_MS,
      ),
    );
    return () => timers.forEach((timer) => timer.cancel());
  }, [things, onFirstScreen, sound, later]);

  const finish = () => {
    phase.current = "done";
    later(onDone, DONE_AFTER_DRUM_S * 1000);
  };

  useFrames((dt, t) => {
    now.current = t;
    // The camera looks at the one falling furthest along, at a link while it carries the fall on, or at the drum at the end.
    const target = cameraOn(worldW, roomX(focusX(sim)));
    const panning = gliding(camera.current, target);
    camera.current += (target - camera.current) * (1 - Math.exp(-dt * CAMERA_FOLLOW));
    // While the things drop in, draw on, so the hint comes as the row is ready; at the end, until the drum and its sparkles are still.
    if (phase.current !== "falling") return phase.current === "dropping" || panning || t - drumAt.current < SETTLE_S * 1000;
    const { sounds, drum } = stepSim(sim, dt);
    for (const s of sounds) sound(s);
    if (drum) {
      drumAt.current = t;
      sound(playDrum);
      later(() => sound(playTwinkle), 350);
      say({
        de: "Bumm! Alles umgefallen!",
        en: "Boom! Everything fell over!",
        zh: "砰！全倒啦！",
        hi: "धड़ाम! सब गिर गया!",
        es: "¡Bum! ¡Todo se cayó!",
        ar: "بوم! سقط كل شيء!",
        ru: "Бум! Всё упало!",
      });
      finish();
    }
    if (phase.current === "falling" && t - fallStart.current > MAX_FALL_MS_EACH * things.length + linksSeconds(layout) * 1000) finish();
    return true;
  });

  const push = () => {
    if (phase.current !== "ready") return;
    phase.current = "falling";
    fallStart.current = levelNow();
    pushFirst(sim);
    sound(() => playKnock(1400));
  };

  useAnyKey(push);

  const t = now.current;
  const drumAge = (t - drumAt.current) / 1000;
  const drumSquash = drumAge >= 0 && drumAge < 2 ? 0.12 * decay(drumAge * 5) * Math.cos(drumAge * 30) : 0;
  const first = things[0];
  const world = { x: 0, y: 0, w: worldW, h: VIEW_H };
  const view = { x: camera.current, y: 0, w: VIEW_W, h: VIEW_H };
  // Round the first thing, the one the tap pushes over; the hand comes from the left, where the push comes from.
  const firstSpot = {
    x: MARGIN + (lefts[0] + first.w / 2) * SCALE,
    y: FLOOR - first.h * 0.55 * SCALE,
    r: Math.min(110, Math.max(60, Math.max(first.w, first.h) * 0.6 * SCALE)),
  };

  return (
    <div className="marble-level" ref={box} onPointerDown={push}>
      <svg className="marble-camera" viewBox={`0 0 ${worldW} ${VIEW_H}`} style={cameraLayer(box.current, world, view)} aria-label={label}>
        <g>
          {room}
          <g transform={`translate(${MARGIN} ${FLOOR}) scale(${SCALE})`}>
            {links.map(({ link, left }, k) => (
              <LinkArt key={k} link={link} left={left} age={linkAge(sim, k)} />
            ))}
            {things.map((thing, i) => (
              <g
                key={i}
                className={i < onFirstScreen ? "thing-drop" : undefined}
                style={{ animationDelay: `${i * DROP_STAGGER_MS}ms`, "--drop-ms": `${DROP_MS}ms` } as CSSProperties}
              >
                <g transform={`translate(${lefts[i] + thing.w} 0) rotate(${(sim.tips[i].angle * 180) / Math.PI}) translate(${-thing.w} 0)`}>{thing.draw()}</g>
              </g>
            ))}
            <g transform={`translate(${drumLeft + DRUM.w / 2} 0) scale(${1 + drumSquash} ${1 - drumSquash}) translate(${-DRUM.w / 2} 0)`}>
              <Drum />
            </g>
            <Sparkles x={drumLeft + DRUM.w / 2} y={-DRUM.h - 70} age={drumAge - 0.25} n={14} spread={200} />
          </g>
        </g>
      </svg>
      {/* Only once everything has dropped in, so the hint doesn't stand in the air before the first thing. */}
      {phase.current === "ready" && <TapHint key="push" {...worldHint(cameraPoint(box.current, world, view), firstSpot)} side="left" />}
    </div>
  );
}

const Drum = memo(function Drum() {
  const { w, h } = DRUM;
  return (
    <g>
      <rect x="0" y={-h + 14} width={w} height={h - 14} rx="10" fill="#ff5d73" stroke={INK} strokeWidth="3" />
      <path
        d={`M4 ${-h + 24} ${Array.from({ length: 6 }, (_, i) => `L${12 + i * 24 + 12} -14 L${12 + (i + 1) * 24} ${-h + 24}`).join(" ")}`}
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <ellipse cx={w / 2} cy={-h + 14} rx={w / 2} ry="14" fill="#fff6e0" stroke={INK} strokeWidth="3" />
      <rect x="0" y="-16" width={w} height="16" rx="6" fill="#ffb703" stroke={INK} strokeWidth="3" />
      <line x1={w * 0.62} y1={-h + 10} x2={w + 30} y2={-h - 40} stroke="#8a5a2b" strokeWidth="8" strokeLinecap="round" />
      <circle cx={w + 30} cy={-h - 40} r="9" fill="#ffd6e0" stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** A cosy room as wide as the row: wallpaper, windows, pictures, and the wooden floor everything stands on. */
function Room({ width }: { width: number }) {
  const w = width + 800;
  return (
    <g>
      <rect x="-400" y="-200" width={w} height={FLOOR + 200} fill="#ffe9c7" />
      {Array.from({ length: Math.ceil(w / 110) }, (_, i) => (
        <line key={i} x1={-400 + i * 110} y1="-200" x2={-400 + i * 110} y2={FLOOR} stroke="#ffdcae" strokeWidth="30" />
      ))}
      {Array.from({ length: Math.ceil(width / VIEW_W) }, (_, i) => (
        <g key={i} transform={`translate(${i * VIEW_W} 0)`}>
          <g transform="translate(150 90)">
            <rect width="300" height="230" rx="10" fill="#bfe9ff" stroke={INK} strokeWidth="5" />
            <circle cx="230" cy="60" r="30" fill="#ffd23f" />
            <path d="M40 150 q20 -30 50 -10 q25 -25 55 0 q25 0 25 20 h-130 z" fill="#fff" />
            <line x1="150" y1="0" x2="150" y2="230" stroke={INK} strokeWidth="5" />
            <line x1="0" y1="115" x2="300" y2="115" stroke={INK} strokeWidth="5" />
          </g>
          <g transform="translate(1180 110)">
            <rect width="200" height="150" rx="6" fill="#fff" stroke="#b8763d" strokeWidth="12" />
            <path d="M30 120 L80 60 L110 95 L135 70 L175 120 Z" fill="#3ec300" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <circle cx="150" cy="40" r="14" fill="#ff8c42" />
          </g>
        </g>
      ))}
      <rect x="-400" y={FLOOR - 26} width={w} height="26" fill="#fff" stroke={INK} strokeWidth="3" />
      <rect x="-400" y={FLOOR} width={w} height={VIEW_H - FLOOR + 200} fill="#d9a066" />
      {Array.from({ length: 5 }, (_, i) => (
        <line key={i} x1="-400" y1={FLOOR + 22 + i * 26} x2={width + 400} y2={FLOOR + 22 + i * 26} stroke="#c48a52" strokeWidth="3" />
      ))}
      <line x1="-400" y1={FLOOR} x2={width + 400} y2={FLOOR} stroke={INK} strokeWidth="4" />
    </g>
  );
}
