import { type MutableRefObject, type PointerEvent, type ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { GameEnd } from "@/components/GameEnd";
import type { MascotPose } from "@/components/Mascot";
import { TapHint } from "@/components/TapHint";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { useLanguagePack } from "@/content/languages";
import { pick, useAppLanguage, useT } from "@/lib/language";
import { noPointerClick } from "@/lib/press";
import { loadRealSounds, playBark, playMeow, playTweet } from "@/lib/realSounds";
import {
  playBlub,
  playChime,
  playClimbNote,
  playDoorbell,
  playDrumRoll,
  playGlockenspielEnd,
  playKnock,
  playLift,
  playPlink,
  playPop,
  playPuff,
  playThump,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { EXTRA_SOUND_GAP_MS } from "@/lib/spacing";
import { stepInAddress, useStepAddress } from "@/lib/stepAddress";
import { readStored, writeStored } from "@/lib/storage";
import { screenTap } from "@/lib/tapGuard";
import { useTimers } from "@/lib/timers";
import { TWO_DIGIT_WORDS } from "../letters/twoDigits";
import { lettersVoice, useLettersSay } from "../letters/voice";
import { Backdrop, Beam, Flag, Hook, HOOK, HouseBlock, Puff, Roof, roofBox } from "./drawings";
import { FLOORS, type Special, colorOf, floorOf, placeOf, specialOf } from "./floors";
import { Kid } from "./Kid";
import {
  BEAM,
  type HouseLayout,
  type Point,
  cameraAt,
  cameraAtRoof,
  feetAt,
  floorBottom,
  floorTop,
  hangingAt,
  houseLayout,
  slotAt,
  wholeHouse,
} from "./layout";
import { HUNDRED, JUMP_TEXTS, ROW, TOTAL } from "./names";
import "./tower.css";

/** The next block to put on, kept for the next visit. */
const PROGRESS_KEY = "tinytaps.tower.v1";

/** The hook lowering a block into its place, and the slower tenth of a floor, while the drum rolls. */
const LOWER_MS = 380;
const LAST_LOWER_MS = 850;
/** The hook going up for the next block and coming down with it over the next place. */
const RETURN_MS = 640;
/** From one press to the next at the quickest: the block lands, the child hops on, the next block hangs ready. */
export const STEP_MS = LOWER_MS + RETURN_MS - 120;
/** The child's hop onto a block. */
const HOP_MS = 460;
/** The beam sliding in over a full floor from the left. */
const BEAM_MS = 900;
/** The camera going up a floor while the child runs back to the ledge, and the hook bringing the floor's first block. */
const UP_MS = 1100;
const ARRIVE_MS = 520;
/** The camera riding to another ten after a jump: longer the further. */
const rideMs = (floors: number) => Math.min(1800, 500 + 260 * floors);
/** From the hundredth's beam: the roof coming down, the smoke and the flag, the whole house, the end's buttons. */
const FINALE = { roof: 500, roofDrop: 1100, flag: 2100, whole: 3000, wholeMs: 1900, end: 5400 };

/** A number from 1 to 101 (101: the house is finished), or none. */
const asNumber = (v: unknown) =>
  (typeof v === "number" || typeof v === "string") && Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= TOTAL + 1 ? Number(v) : undefined;

/** The world's transform with the camera at `y` (the world's pixel at the screen's top). */
const camera = (y: number) => `translate(0px, ${-y}px) scale(1)`;
/** The world's transform with the whole house in view, as at the end. */
const whole = (l: HouseLayout) => {
  const { x, y, scale } = wholeHouse(l);
  return `translate(${x}px, ${y}px) scale(${scale})`;
};
/** How the world stands for the next number `next`: the camera on its floor, or the whole house once it is finished. */
const worldFor = (l: HouseLayout, next: number) => (next > TOTAL ? whole(l) : camera(cameraAt(l, floorOf(next))));

/**
 * The Counting Tower (L-18), made new (user request, 24 November 2026): one house built from 1 to 100 without a break.
 * Each tap or key lowers the next block from the crane's hook into its place, the fox or bear child hops onto it and the
 * number is said; ten blocks make a floor across the screen, a beam is laid over it and the camera goes up to the next
 * ten, as in a jump-and-run. The elevator panel on the right shows the number and jumps a whole ten up or back. At a
 * hundred the roof goes on and the whole house is seen, then its trophy. The next number is in the address (`?seite=`)
 * and kept for the next visit.
 */
export function TowerPlay() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize((s) => (s.w === el.clientWidth && s.h === el.clientHeight ? s : { w: el.clientWidth, h: el.clientHeight }));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const layout = useMemo(() => (size.w > 0 && size.h > 0 ? houseLayout(size.w, size.h) : null), [size.w, size.h]);

  /** The next block to put on; 101 once the house is finished. */
  const [next, setNext] = useState(() => asNumber(stepInAddress()) ?? asNumber(readStored(PROGRESS_KEY, { next: 1 }).next) ?? 1);
  const [run, setRun] = useState(0);
  /** Where the world stood before a jump, so the new scene rides from there like an elevator. */
  const ride = useRef<string | undefined>(undefined);
  useStepAddress(Math.min(next, TOTAL));

  const jump = (to: number) => {
    if (layout) ride.current = worldFor(layout, next);
    setNext(to);
    writeStored(PROGRESS_KEY, { next: to });
    setRun((r) => r + 1);
  };
  const placed = (n: number) => {
    setNext(n + 1);
    // A new visit after the hundred builds the house again from 1.
    writeStored(PROGRESS_KEY, { next: n >= TOTAL ? 1 : n + 1 });
  };

  return (
    <div className="zt-play" ref={ref}>
      {layout && (
        <HouseScene
          // A jump or another screen size builds the scene anew; `start` is read only then.
          key={`${run} ${size.w}×${size.h}`}
          layout={layout}
          start={next}
          ride={ride}
          onPlaced={placed}
          onJump={jump}
          ending={<GameEnd onAgain={() => jump(1)} />}
        />
      )}
    </div>
  );
}

/** What the scene needs: its layout, the number it starts at, where the world rides from, and its end. */
interface SceneProps {
  layout: HouseLayout;
  start: number;
  ride: MutableRefObject<string | undefined>;
  onPlaced: (n: number) => void;
  onJump: (to: number) => void;
  ending: ReactNode;
}

/** Building, a full floor's beam sliding in and the camera going up, the roof going on, or the end with its buttons. */
type Phase = "build" | "beam" | "finale" | "end";

/** The CSS `transform` putting a box of `w` × `h` with its middle at `p`. */
const centred = (p: Point, w: number, h: number) => `translate(${p.x - w / 2}px, ${p.y - h / 2}px)`;

/** How a special's moving part comes as its block lands, and its sound. */
const ARRIVAL: Record<Special, { frames: Keyframe[]; ms: number; sound: () => void }> = {
  window: { frames: [{ opacity: 0 }, { opacity: 1 }], ms: 600, sound: () => playPlink(4) },
  heart: { frames: [{ opacity: 0 }, { opacity: 1 }], ms: 700, sound: playChime },
  star: { frames: [{ opacity: 0 }, { opacity: 1 }], ms: 700, sound: playTwinkle },
  cat: { frames: [{ transform: "translateY(100%)" }, { transform: "none" }], ms: 550, sound: playMeow },
  dog: { frames: [{ transform: "translateY(100%)" }, { transform: "none" }], ms: 550, sound: playBark },
  flowers: { frames: [{ transform: "scaleY(0)" }, { transform: "none" }], ms: 650, sound: playPop },
  birdhouse: { frames: [{ transform: "translateY(90%) scale(0.6)" }, { transform: "none" }], ms: 450, sound: playTweet },
  fish: { frames: [{ transform: "translateX(-115%)" }, { transform: "none" }], ms: 900, sound: playBlub },
  door: {
    frames: [
      { transform: "none", offset: 0 },
      { transform: "scaleX(0.12)", offset: 0.25 },
      { transform: "scaleX(0.12)", offset: 0.72 },
      { transform: "none", offset: 1 },
    ],
    ms: 1700,
    sound: playDoorbell,
  },
};

/** The house for one screen size: the world with everything placed in its pixels, the elevator panel over it. */
function HouseScene({ layout: l, start, ride, onPlaced, onJump, ending }: SceneProps) {
  const t = useT();
  const finished = start > TOTAL;
  const [count, setCount] = useState(finished ? TOTAL : start - 1);
  const [beams, setBeams] = useState(Math.floor((finished ? TOTAL : start - 1) / ROW));
  const [roof, setRoof] = useState(finished);
  const [phase, setPhase] = useState<Phase>(finished ? "end" : "build");
  const [pose, setPose] = useState<MascotPose>(finished ? "wave" : "stand");
  /** What stood already when the scene was built: those came without moving. */
  const [mounted] = useState({ count, beams, roof });
  const pack = useLanguagePack();
  const { id: language } = useAppLanguage();
  const say = useLettersSay();
  const { later } = useTimers();
  const { effects, ripple, glow } = useTapFeedback();
  const busyUntil = useRef(0);
  const lastSoft = useRef(0);
  const scene = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const kid = useRef<HTMLDivElement>(null);
  const hook = useRef<HTMLDivElement>(null);
  const hookBlock = useRef<HTMLDivElement>(null);
  const roofEl = useRef<HTMLDivElement>(null);
  const rope = useRef<HTMLDivElement>(null);
  const flag = useRef<HTMLDivElement>(null);
  const puffs = useRef<(HTMLDivElement | null)[]>([]);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);
  const beamEls = useRef<(HTMLDivElement | null)[]>([]);

  const { s, kidW, kidH } = l;
  /** The floor being built (or the top one, once the house is full) and how many of its blocks lie. */
  const floor = count >= TOTAL ? ROW - 1 : floorOf(count + 1);
  const laid = count - floor * ROW;
  const standing = (p: Point) => `translate(${p.x - kidW / 2}px, ${p.y - kidH}px)`;
  const hookAt = (p: Point) => `translate(${p.x - s / 2}px, ${p.y - s / 2}px)`;
  const box = roofBox(l);

  /** The number word of `n`, and the English one standing in where the language has none yet. */
  const word = useCallback(
    (n: number) =>
      n < 10
        ? { text: `${pack.numberWords[n]}!` }
        : n < TOTAL
          ? { text: pick(TWO_DIGIT_WORDS, language)(n), english: TWO_DIGIT_WORDS.en(n) }
          : { text: pick(HUNDRED, language), english: HUNDRED.en },
    [pack, language],
  );

  // The floor's ten number words and the next floor's load as it starts, so every block is counted in time.
  useEffect(() => {
    const numbers = Array.from({ length: 2 * ROW }, (_, i) => floor * ROW + i + 1).filter((n) => n <= TOTAL);
    lettersVoice.load(
      numbers.map((n) => word(n)),
      language,
    );
  }, [word, language, floor]);
  useEffect(() => loadRealSounds([playMeow, playBark, playTweet]), []);

  // Everything moved by hand stands where the scene starts; after a jump the world rides there from where it was.
  useLayoutEffect(() => {
    const own = worldFor(l, finished ? TOTAL + 1 : count + 1);
    const w = world.current;
    if (w) w.style.transform = own;
    if (kid.current) kid.current.style.transform = standing(feetAt(l, finished ? ROW : floor, finished ? 0 : laid));
    if (hook.current && !finished) hook.current.style.transform = hookAt(hangingAt(l, floor, laid + 1));
    const from = ride.current;
    ride.current = undefined;
    if (w && from && from !== own) {
      const floors = Math.abs(floorOf(Math.min(count + 1, TOTAL)) - floor) || 3;
      const ms = rideMs(floors);
      w.animate([{ transform: from }, { transform: own }], { duration: ms, easing: "ease-in-out" });
      playLift(ms / 1000, true);
      busyUntil.current = performance.now() + ms * 0.7;
    }
  }, []);

  /** The child hops from `a` to `z`, `lift` blocks up on the way. */
  const hop = (a: Point, z: Point, duration = HOP_MS, delay = 0, lift = 0.7) => {
    const el = kid.current;
    if (!el) return;
    el.style.transform = standing(z);
    el.animate(
      [
        { transform: standing(a), offset: 0 },
        { transform: `${standing(a)} translateY(${0.05 * s}px) scale(1.04, 0.94)`, offset: 0.12 },
        { transform: standing({ x: (a.x + z.x) / 2, y: Math.min(a.y, z.y) - lift * s }), offset: 0.6 },
        { transform: standing(z), offset: 1 },
      ],
      { duration, delay, easing: "ease-out", fill: "backwards" },
    );
  };

  /** The child runs from `a` to `z` along a beam, a little hop at every step. */
  const runTo = (a: Point, z: Point, duration: number, delay = 0) => {
    const el = kid.current;
    if (!el) return;
    el.style.transform = standing(z);
    const steps = 10;
    el.animate(
      Array.from({ length: steps + 1 }, (_, i) => {
        const p = { x: a.x + ((z.x - a.x) * i) / steps, y: a.y + ((z.y - a.y) * i) / steps };
        return { transform: standing({ x: p.x, y: p.y - (i % 2 ? 0.18 * s : 0) }) };
      }),
      { duration, delay, easing: "linear", fill: "backwards" },
    );
  };

  /** Moves the world (the camera) to `to`, from where it stands now. */
  const moveWorld = (to: string, duration: number, delay = 0) => {
    const el = world.current;
    if (!el) return;
    const from = getComputedStyle(el).transform;
    el.style.transform = to;
    el.animate([{ transform: from }, { transform: to }], { duration, delay, easing: "ease-in-out", fill: "backwards" });
  };

  /** A full floor: the beam slides in from the left under the child's jump, then the camera goes up a floor. */
  const layBeam = (f: number) => {
    setPhase("beam");
    setBeams(f + 1);
    setPose("cheer");
    playWhoosh();
    const top = feetAt(l, f, ROW);
    const onBeam = { x: top.x, y: top.y - BEAM * s };
    // In the air as the beam's front passes under its feet.
    hop(top, onBeam, 640, 0.42 * BEAM_MS, 0.9);
    later(() => {
      playThump();
      playChime();
    }, BEAM_MS);
    later(() => (f < ROW - 1 ? nextFloor(f + 1) : finale()), BEAM_MS + 350);
  };

  /** Up to floor `f`: the camera rises a floor, the child runs back to the ledge, the hook brings the floor's first block. */
  const nextFloor = (f: number) => {
    moveWorld(camera(cameraAt(l, f)), UP_MS);
    setPose("stand");
    runTo({ x: slotAt(l, f - 1, ROW).x, y: floorBottom(l, f) }, feetAt(l, f, 0), UP_MS);
    playLift(UP_MS / 1000, true);
    const h = hook.current;
    if (h) {
      const to = hangingAt(l, f, 1);
      h.style.transform = hookAt(to);
      h.animate([{ transform: hookAt({ x: to.x, y: cameraAt(l, f) - 1.4 * s }) }, { transform: hookAt(to) }], {
        duration: ARRIVE_MS,
        delay: UP_MS - 200,
        easing: "ease-out",
        fill: "backwards",
      });
    }
    later(
      () => {
        setPhase("build");
        busyUntil.current = 0;
      },
      UP_MS + ARRIVE_MS - 200,
    );
  };

  /** The hundred: the child runs to the ledge, the roof comes down, smoke and the flag, and the whole house is seen. */
  const finale = () => {
    setPhase("finale");
    setPose("wave");
    runTo({ x: slotAt(l, ROW - 1, ROW).x, y: floorBottom(l, ROW) }, feetAt(l, ROW, 0), 900);
    moveWorld(camera(cameraAtRoof(l)), 1000);
    setRoof(true);
    later(playWhoosh, FINALE.roof);
    later(() => {
      playThump();
      playKnock(300);
    }, FINALE.roof + FINALE.roofDrop);
    later(() => {
      playPuff();
      playTwinkle();
      setPose("cheer");
      flag.current?.animate([{ transform: `translateY(${1.1 * s}px)` }, { transform: "none" }], { duration: 900, easing: "ease-out", fill: "backwards" });
      puffs.current.forEach((p, i) =>
        p?.animate(
          [
            { opacity: 0, transform: "none" },
            { opacity: 1, transform: `translate(${0.1 * s}px, ${-0.3 * s}px) scale(1.1)`, offset: 0.2 },
            { opacity: 0, transform: `translate(${(0.4 + 0.2 * i) * s}px, ${-1.7 * s}px) scale(1.7)` },
          ],
          { duration: 1900, delay: i * 450, easing: "ease-out" },
        ),
      );
    }, FINALE.flag);
    later(() => {
      moveWorld(whole(l), FINALE.wholeMs);
      playGlockenspielEnd();
    }, FINALE.whole);
    later(() => setPhase("end"), FINALE.end);
  };

  /** The block just put in its place: it settles with a little squash, and a special does its thing. */
  const land = (n: number) => {
    const f = floorOf(n);
    const k = placeOf(n);
    setCount(n);
    onPlaced(n);
    playKnock(420 + k * 45);
    playClimbNote(k - 1);
    const special = specialOf(n);
    if (special) later(ARRIVAL[special].sound, 120);
    const line = word(n);
    say(line.text, true, line.english);
    hop(feetAt(l, f, k - 1), feetAt(l, f, k), HOP_MS, 0, k === 1 ? 1.4 : 0.7);
    if (k === 1) setPose("stand");
    // The hook goes up out of the picture and comes down over the next place with the next block on it; after a
    // floor's tenth it stays up there until the camera has gone up.
    const h = hook.current;
    if (h) {
      const at = slotAt(l, f, k);
      const high = cameraAt(l, f) - 1.4 * s;
      const up = hookAt({ x: at.x, y: high });
      if (k < ROW) {
        const to = hangingAt(l, f, k + 1);
        h.style.transform = hookAt(to);
        h.animate(
          [
            { transform: hookAt(at), offset: 0 },
            { transform: up, offset: 0.42 },
            { transform: hookAt({ x: to.x, y: high }), offset: 0.5 },
            { transform: hookAt(to), offset: 1 },
          ],
          { duration: RETURN_MS, easing: "ease-in-out" },
        );
        hookBlock.current?.animate([{ opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 1, offset: 0.5 }], { duration: RETURN_MS });
      } else {
        h.style.transform = up;
        h.animate([{ transform: hookAt(at) }, { transform: up }], { duration: RETURN_MS * 0.45, easing: "ease-in" });
        hookBlock.current?.animate([{ opacity: 0 }, { opacity: 0 }], { duration: RETURN_MS });
        later(() => layBeam(f), 650);
      }
    }
  };

  /** A tap or key: the hook lowers the next block into its place. */
  const press = (x?: number, y?: number) => {
    const at = performance.now();
    if (phase !== "build" || at < busyUntil.current || count >= TOTAL) {
      // Meanwhile a press only ripples, its soft knock at most every so often (root CLAUDE.md: no din).
      ripple(x, y);
      if (phase !== "end" && at - lastSoft.current > EXTRA_SOUND_GAP_MS) {
        lastSoft.current = at;
        playKnock(1100);
      }
      return;
    }
    glow(x, y);
    const n = count + 1;
    const f = floorOf(n);
    const k = placeOf(n);
    const last = k === ROW;
    const lower = last ? LAST_LOWER_MS : LOWER_MS;
    busyUntil.current = last ? Number.POSITIVE_INFINITY : at + STEP_MS;
    // A floor's tenth comes down slowly while the drum rolls.
    if (last) playDrumRoll(1);
    const h = hook.current;
    if (h) {
      const to = slotAt(l, f, k);
      h.style.transform = hookAt(to);
      h.animate([{ transform: hookAt(hangingAt(l, f, k)) }, { transform: hookAt(to) }], { duration: lower, easing: "ease-in" });
    }
    later(() => land(n), lower);
  };
  const pressRef = useRef(press);
  pressRef.current = press;

  // The block just landed settles, and a special's moving part arrives (a light going on, the cat coming up).
  useLayoutEffect(() => {
    if (count <= mounted.count || count > TOTAL) return;
    const el = blocks.current[count];
    if (!el) return;
    const base = centred(slotAt(l, floorOf(count), placeOf(count)), s, s);
    el.animate([{ transform: `${base} scale(1.05, 0.9)` }, { transform: base }], { duration: 220, easing: "ease-out" });
    const special = specialOf(count);
    const actor = el.querySelector<HTMLElement>(".zt-actor");
    if (special && actor) actor.animate(ARRIVAL[special].frames, { duration: ARRIVAL[special].ms, delay: 80, easing: "ease-out", fill: "backwards" });
  }, [count]);

  // A full floor's beam slides in from the left, out of the picture, along the floor's top.
  useLayoutEffect(() => {
    if (beams <= mounted.beams) return;
    const f = beams - 1;
    const base = `translate(${l.beamLeft}px, ${floorTop(l, f) - BEAM * s}px)`;
    beamEls.current[f]?.animate([{ transform: `${base} translateX(${-(l.beamLeft + l.beamW + 0.5 * s)}px)` }, { transform: base }], {
      duration: BEAM_MS,
      easing: "cubic-bezier(0.33, 1, 0.68, 1)",
    });
  }, [beams]);

  // The roof comes down on the crane's rope from above the picture, and the rope goes up again.
  useLayoutEffect(() => {
    if (!roof || mounted.roof) return;
    roofEl.current?.animate([{ transform: `translateY(${-(box.top - cameraAt(l, ROW - 1) + box.height + 2 * s)}px)` }, { transform: "none" }], {
      duration: FINALE.roofDrop,
      delay: FINALE.roof,
      easing: "cubic-bezier(0.3, 1.15, 0.55, 1)",
      fill: "backwards",
    });
    rope.current?.animate([{ transform: "none" }, { transform: `translateY(${-2 * l.h}px)` }], {
      duration: 700,
      delay: FINALE.roof + FINALE.roofDrop + 150,
      easing: "ease-in",
      fill: "forwards",
    });
  }, [roof]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Esc is the game's way out (held), and shortcuts stay the browser's.
      if (e.key === "Escape" || e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      if (e.repeat) return;
      // A key's light shows where the next block hangs.
      const r = scene.current?.getBoundingClientRect();
      const n = Math.min(count + 1, TOTAL);
      const p = hangingAt(l, floorOf(n), placeOf(n));
      pressRef.current(r && r.left + p.x, r && r.top + p.y - cameraAt(l, floorOf(n)));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [l, count]);

  const onPointerDown = (e: PointerEvent) => press(e.clientX, e.clientY);

  /** The panel's arrows: a whole ten up, or back to the ten before (on the first floor: from 1 again). */
  const up = phase === "build" || phase === "beam" ? (floor < ROW - 1 ? (floor + 1) * ROW + 1 : undefined) : undefined;
  const down = phase === "build" || phase === "beam" ? (count > 0 ? Math.max(0, floor - 1) * ROW + 1 : undefined) : undefined;
  const hanging = count < TOTAL ? hangingAt(l, floor, laid + 1) : undefined;
  const flagW = 0.45 * s;
  const flagH = 1.1 * s;
  const puffW = 0.6 * s;

  return (
    <>
      <div className="zt-scene" ref={scene} onPointerDown={onPointerDown}>
        <div className="zt-world" ref={world} style={{ width: l.w, height: l.worldH }}>
          <Backdrop layout={l} />
          {roof && (
            <>
              <div
                className="zt-layer"
                ref={flag}
                style={{ width: flagW, height: flagH, transform: `translate(${box.left + box.width / 2 - 0.07 * s}px, ${box.top + 0.15 * s - flagH}px)` }}
              >
                <Flag />
              </div>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="zt-layer zt-puff"
                  ref={(el) => {
                    puffs.current[i] = el;
                  }}
                  style={{ width: puffW, height: puffW * 0.73, left: box.left + box.width * 0.735 - puffW / 2, top: box.top + box.height * 0.14 - puffW * 0.6 }}
                >
                  <Puff />
                </div>
              ))}
              <div className="zt-layer" ref={roofEl} style={{ left: box.left, top: box.top, width: box.width, height: box.height }}>
                <div
                  className="zt-rope"
                  ref={rope}
                  style={{ left: box.width / 2 - 0.03 * s, width: Math.max(2, 0.06 * s), bottom: box.height - 4, height: 2 * l.h }}
                />
                <Roof w={box.width} h={box.height} />
              </div>
            </>
          )}
          {Array.from({ length: beams }, (_, f) => (
            <div
              key={f}
              className="zt-layer"
              ref={(el) => {
                beamEls.current[f] = el;
              }}
              style={{ width: l.beamW, height: BEAM * s, transform: `translate(${l.beamLeft}px, ${floorTop(l, f) - BEAM * s}px)` }}
            >
              <Beam w={l.beamW} h={BEAM * s} s={s} color={FLOORS[f].beam} />
            </div>
          ))}
          {Array.from({ length: count }, (_, i) => {
            const n = i + 1;
            return (
              <div
                key={n}
                className="zt-layer zt-block"
                ref={(el) => {
                  blocks.current[n] = el;
                }}
                style={{ width: s, height: s, transform: centred(slotAt(l, floorOf(n), placeOf(n)), s, s) }}
              >
                <HouseBlock n={n} />
              </div>
            );
          })}
          {count < TOTAL && (
            <div className="zt-layer zt-hook" ref={hook} style={{ width: s, height: s }}>
              <div
                className="zt-rope"
                style={{ left: s / 2 - Math.max(1, 0.03 * s), width: Math.max(2, 0.06 * s), bottom: s + HOOK * s - 2, height: 1.5 * l.h }}
              />
              <div className="zt-hook-art" style={{ top: -HOOK * s, height: HOOK * s }}>
                <Hook />
              </div>
              <div className="zt-block zt-hook-block" ref={hookBlock}>
                <HouseBlock n={count + 1} />
              </div>
            </div>
          )}
          <div className="zt-layer zt-kid" ref={kid} style={{ width: kidW, height: kidH }}>
            <Kid pose={pose} />
          </div>
        </div>
        {(phase === "build" || phase === "beam") && (
          <ElevatorPanel
            l={l}
            number={count}
            up={up}
            down={down}
            upLabel={t(JUMP_TEXTS.up)}
            downLabel={t(JUMP_TEXTS.down)}
            onJump={(to) => {
              // A jump in the middle of a floor's beam or a ride waits for nothing: the scene is built anew.
              onJump(to);
            }}
          />
        )}
        {hanging && phase === "build" && count === mounted.count && (
          <TapHint x={hanging.x} y={hanging.y - cameraAt(l, floor)} r={0.75 * s} side={laid >= ROW - 2 ? "left" : "right"} />
        )}
        <FeedbackLayer effects={effects} />
      </div>
      {phase === "end" && ending}
    </>
  );
}

/**
 * The elevator panel on the right: the number of blocks laid big in its display, and an arrow up and down that jump a
 * whole ten – up to the next floor, or back to the floor below – so grown-ups can go on at 11, 21 … at once (user
 * request, 24 November 2026). Only a tap on an arrow jumps, never a press elsewhere; a quick second tap changes nothing.
 */
function ElevatorPanel({
  l,
  number,
  up,
  down,
  upLabel,
  downLabel,
  onJump,
}: {
  l: HouseLayout;
  number: number;
  up?: number;
  down?: number;
  upLabel: string;
  downLabel: string;
  onJump: (to: number) => void;
}) {
  const { left, width, middle } = l.panel;
  const shown = useRef<HTMLSpanElement>(null);
  const first = useRef(number);
  // A new number pops up in the display; the one the scene starts with simply stands there.
  useLayoutEffect(() => {
    if (number === first.current) return;
    shown.current?.animate(
      [
        { transform: "scale(0.6)", opacity: 0.4 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 260, easing: "ease-out" },
    );
  }, [number]);
  const height = Math.min(2.3 * width, 0.86 * l.h);
  const arrow = (to: number | undefined, label: string, dir: "up" | "down") => (
    <button
      type="button"
      className={`zt-jump zt-jump-${dir}`}
      data-tap=""
      aria-label={label}
      disabled={to === undefined}
      onPointerDown={(e: PointerEvent) => {
        e.stopPropagation();
        if (to !== undefined && screenTap()) onJump(to);
      }}
      onClick={noPointerClick(() => {
        if (to !== undefined && screenTap()) onJump(to);
      })}
    >
      <svg viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="44" />
        <path d={dir === "up" ? "M50 28 L74 64 H26 Z" : "M50 72 L74 36 H26 Z"} />
      </svg>
    </button>
  );
  return (
    <div
      className="zt-panel"
      style={{ left, top: middle - height / 2, width, height, padding: `${0.08 * width}px ${0.1 * width}px` }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {arrow(up, upLabel, "up")}
      <div className="zt-display" style={{ fontSize: width * (number >= TOTAL ? 0.36 : 0.46) }}>
        {number > 0 && (
          <span ref={shown} className="zt-number" style={{ color: colorOf(number) }}>
            {number}
          </span>
        )}
      </div>
      {arrow(down, downLabel, "down")}
    </div>
  );
}
