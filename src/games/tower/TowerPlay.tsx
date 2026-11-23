import { type PointerEvent, type ReactNode, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { GameEnd } from "@/components/GameEnd";
import type { MascotPose } from "@/components/Mascot";
import { PlayOptions } from "@/components/PlayOptions";
import { SettingsGroup, Slider } from "@/components/SettingControls";
import { TapHint } from "@/components/TapHint";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { useLanguagePack } from "@/content/languages";
import { pick, useAppLanguage, useT } from "@/lib/language";
import { loadRealSounds, playGiggle, playTweet } from "@/lib/realSounds";
import {
  playClimbNote,
  playCreak,
  playDrumRoll,
  playHoot,
  playInflate,
  playKnock,
  playLaugh,
  playLeaves,
  playLullaby,
  playSlide,
  playThump,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { EXTRA_SOUND_GAP_MS } from "@/lib/spacing";
import { stepInAddress, useStepAddress } from "@/lib/stepAddress";
import { readStored, writeStored } from "@/lib/storage";
import { useTimers } from "@/lib/timers";
import { TWO_DIGIT_WORDS } from "../letters/twoDigits";
import { lettersVoice, useLettersSay } from "../letters/voice";
import {
  Backdrop,
  Balloon,
  Bird,
  Block,
  BLOCK_COLORS,
  CloudSeat,
  Hollow,
  HotAir,
  Kite,
  LEAF_COLORS,
  Leaf,
  GoalCard,
  Moon,
  Nest,
  Owl,
  Plane,
  Rainbow,
  Star,
} from "./drawings";
import { Kid } from "./Kid";
import {
  BAND,
  BLOCK_WIDE,
  BLOCKS,
  type GoalPlace,
  type Point,
  SWAY_DEG,
  type TowerLayout,
  blockAt,
  digitLeft,
  fallenAt,
  feetAt,
  goalPlace,
  leafPile,
  towerLayout,
} from "./layout";
import { GOAL_NAMES, GOAL_ORDER, type GoalId, HUNDRED, OPTION_TEXTS, TOTAL } from "./names";
import "./tower.css";

/** The next block to put on, kept for the next visit. */
const PROGRESS_KEY = "tinytaps.tower.v1";

/** A block's flight from the meadow onto the tower, and the round's tenth, slower, while the drum rolls. */
const FLY_MS = 480;
const LAST_FLY_MS = 1000;
/** From one block to the next at the quickest: the block lands, the child lands on it, the number is said. */
export const STEP_MS = 950;
/** How long the tower sways after a block landed. */
const SWAY_MS = 1100;
/** From the tenth block's landing: the goal taken, the tower tumbling, and the end's buttons, per goal. */
const FINALE: Record<GoalId, { take: number; tumble: number; end: number }> = {
  balloon: { take: 450, tumble: 1500, end: 5300 },
  nest: { take: 450, tumble: 1900, end: 4900 },
  plane: { take: 450, tumble: 1300, end: 4900 },
  cloud: { take: 500, tumble: 1500, end: 5400 },
  rainbow: { take: 500, tumble: 1300, end: 4700 },
  kite: { take: 450, tumble: 1500, end: 5300 },
  bird: { take: 300, tumble: 1900, end: 5900 },
  hotair: { take: 500, tumble: 1500, end: 5700 },
  owl: { take: 450, tumble: 1900, end: 4900 },
  moon: { take: 500, tumble: 1500, end: 5400 },
};
/** The blocks of a round (1 to 10) at which the goal stirs as the tower comes near: each block brings it closer. */
export const STIR_AT = [3, 6, 9];
/** The child reaches up from this block of a round on: the goal is near. */
const REACH_FROM = 8;

/** The first number of the round of ten that `n` belongs to, less one: 0 for 1–10, 10 for 11–20 … */
const roundOf = (n: number) => Math.floor((n - 1) / BLOCKS) * BLOCKS;
/** The number after `n`, back to 1 after a hundred. */
const after = (n: number) => (n >= TOTAL ? 1 : n + 1);
/** A number from 1 to 100, or none. */
const asNumber = (v: unknown) =>
  (typeof v === "number" || typeof v === "string") && Number.isInteger(Number(v)) && Number(v) >= 1 && Number(v) <= TOTAL ? Number(v) : undefined;

/**
 * The Counting Tower (L-18): counting to a hundred in ten rounds of ten blocks, each round with its goal up there – the
 * red balloon at 10, the bird's nest at 20 … the moon at 100. „Weiter“ goes on with the next ten, „Nochmal“ builds the
 * same ten again; behind ⚙️ grown-ups start again from 1 or at any number (user request), the round's earlier blocks then
 * standing already. The next block's number is in the address (`?seite=`) and kept for the next visit.
 */
export function TowerPlay() {
  const t = useT();
  const { id: language } = useAppLanguage();
  const [now, setNow] = useState(() => ({ start: asNumber(stepInAddress()) ?? asNumber(readStored(PROGRESS_KEY, { next: 1 }).next) ?? 1, run: 0 }));
  /** The next block to put on, as the round goes. */
  const [next, setNext] = useState(now.start);
  useStepAddress(next);

  const first = roundOf(now.start);
  const goal = GOAL_ORDER[first / BLOCKS];
  const following = after(first + BLOCKS);
  const startAt = (start: number) => {
    setNow((o) => ({ start, run: o.run + 1 }));
    setNext(start);
    writeStored(PROGRESS_KEY, { next: start });
  };
  const placed = (n: number) => {
    setNext(after(n));
    writeStored(PROGRESS_KEY, { next: after(n) });
  };

  return (
    <>
      <TowerRound
        key={now.run}
        goal={goal}
        first={first}
        standing={now.start - 1 - first}
        onPlaced={placed}
        ending={
          <GameEnd
            level={goal}
            onAgain={() => startAt(first + 1)}
            next={{
              name: pick(GOAL_NAMES[GOAL_ORDER[roundOf(following) / BLOCKS]], language),
              onNext: () => startAt(following),
              art: <GoalCard goal={GOAL_ORDER[roundOf(following) / BLOCKS]} />,
            }}
          />
        }
      />
      <PlayOptions intro={t(OPTION_TEXTS.intro)}>
        <SettingsGroup title={t(OPTION_TEXTS.group)}>
          <Slider label={t(OPTION_TEXTS.startAt)} value={next} min={1} max={TOTAL} format={String} onChange={startAt} />
          <fieldset className="choice">
            <legend>{t(OPTION_TEXTS.again)}</legend>
            <button type="button" onClick={() => startAt(1)}>
              <span className="choice-label">{t(OPTION_TEXTS.fromOne)}</span>
            </button>
          </fieldset>
        </SettingsGroup>
      </PlayOptions>
    </>
  );
}

/** What a round needs: its goal, the numbers before it (`first`), how many of its blocks stand already, and its end. */
interface RoundProps {
  goal: GoalId;
  first: number;
  standing: number;
  onPlaced: (n: number) => void;
  ending: ReactNode;
}

/** One round: the stage measured, then its blocks up to the goal, its end picture and `ending`. */
function TowerRound(props: RoundProps) {
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
  const layout = useMemo(() => (size.w > 0 && size.h > 0 ? towerLayout(size.w, size.h) : null), [size.w, size.h]);
  return (
    <div className={`tw-play tw-${props.goal}`} ref={ref}>
      {layout && <TowerScene layout={layout} {...props} />}
    </div>
  );
}

/** The CSS `transform` putting a box of `w` × `h` with its middle at `p`. */
const centred = (p: Point, w: number, h: number) => `translate(${p.x - w / 2}px, ${p.y - h / 2}px)`;
/** The same for a box standing with its bottom middle at `p` (the child's feet). */
const standing = (p: Point, w: number, h: number) => `translate(${p.x - w / 2}px, ${p.y - h}px)`;

/** Where the round is: building, the goal reached and its end picture playing, or the end with its buttons. */
type Phase = "build" | "finale" | "end";

/** The goals living in the tree: a mother and her little one, who rides up on the child's head and goes home at ten. */
const HOMES: GoalId[] = ["nest", "owl"];
/** The goals the child floats down with, hanging from them. */
const FLOATS: GoalId[] = ["balloon", "kite", "plane"];
/** The goals the child sits on while they rock it. */
const ROCKS: GoalId[] = ["cloud", "moon"];

/** Where the rainbow's top edge runs, in its box's pixels: from the tower's top over its bend down to its foot. */
function rainbowCurve(l: TowerLayout, place: GoalPlace) {
  const end = place.end ?? place.reach;
  const o = { x: place.box.left, y: place.box.top };
  const from = { x: place.reach.x - o.x, y: place.reach.y - o.y };
  const bend = { x: from.x + 0.55 * (end.x - place.reach.x), y: from.y - 0.15 * l.b };
  const to = { x: end.x - o.x, y: l.ground - 6 * BAND * l.b - o.y };
  return { from, bend, to, o };
}

/** The point at `t` (0 to 1) of the quadratic curve from `a` over `c` to `z`. */
const quad = (a: Point, c: Point, z: Point, t: number): Point => ({
  x: (1 - t) ** 2 * a.x + 2 * t * (1 - t) * c.x + t ** 2 * z.x,
  y: (1 - t) ** 2 * a.y + 2 * t * (1 - t) * c.y + t ** 2 * z.y,
});

/** The scene laid out for one stage size: everything placed in its pixels. */
function TowerScene({ layout: l, goal, first, standing: already, onPlaced, ending }: RoundProps & { layout: TowerLayout }) {
  const [count, setCount] = useState(already);
  const [phase, setPhase] = useState<Phase>("build");
  const [pose, setPose] = useState<MascotPose>(already >= REACH_FROM ? "cheer" : "stand");
  const [stirs, setStirs] = useState(() => STIR_AT.filter((k) => k <= already).length);
  const pack = useLanguagePack();
  const { id: language } = useAppLanguage();
  const say = useLettersSay();
  const { later } = useTimers();
  const { effects, ripple, glow } = useTapFeedback();
  const busyUntil = useRef(0);
  const lastSoft = useRef(0);
  const scene = useRef<HTMLDivElement>(null);
  const blocks = useRef<(HTMLDivElement | null)[]>([]);
  const tower = useRef<HTMLDivElement>(null);
  const kid = useRef<HTMLDivElement>(null);
  const rock = useRef<HTMLDivElement>(null);
  const goalEl = useRef<HTMLDivElement>(null);
  const mother = useRef<HTMLDivElement>(null);
  const baby = useRef<HTMLDivElement>(null);
  const leaves = useRef<(HTMLDivElement | null)[]>([]);

  const { b, kidW, kidH } = l;
  const blockW = BLOCK_WIDE * b;
  const place = goalPlace(l, goal);
  const home = HOMES.includes(goal);
  // The tower's own layer, only as wide as the tower and its sway: the blocks and the child in it are placed in its
  // pixels (`local`), so the whole tower – child on top – sways from its foot as one.
  const box = { left: l.x - 3 * b, width: 6 * b, height: l.ground };
  const local = useCallback((p: Point): Point => ({ x: p.x - box.left, y: p.y }), [box.left]);
  const top = local(feetAt(l, BLOCKS));
  const kidOn = (n: number) => standing(local(feetAt(l, n)), kidW, kidH);
  const goalBox = { w: place.box.right - place.box.left, h: place.box.bottom - place.box.top };
  const goalAt = `translate(${place.box.left}px, ${place.box.top}px)`;

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

  // The round's ten number words load as it starts, so even its first block is counted in time; the real bird and
  // giggle too.
  useEffect(() => {
    lettersVoice.load(
      Array.from({ length: BLOCKS }, (_, i) => word(first + i + 1)),
      language,
    );
    loadRealSounds([playTweet, playGiggle]);
  }, [word, language, first]);

  /** The child hops from `from` blocks onto `to`, landing as the block slides in under it. */
  const hop = (from: number, to: number, delay: number) => {
    const z = local(feetAt(l, to));
    const a = kidOn(from);
    kid.current?.animate(
      [
        { transform: a, offset: 0 },
        { transform: `${a} translateY(${0.06 * b}px) scale(1.04, 0.94)`, offset: 0.12 },
        { transform: standing({ x: z.x, y: z.y - 0.75 * b }, kidW, kidH), offset: 0.62 },
        { transform: standing(z, kidW, kidH), offset: 1 },
      ],
      { duration: 560, delay, easing: "ease-out", fill: "backwards" },
    );
  };

  /** The child hops from the top block over onto the goal, its feet at `to` (stage pixels). */
  const hopOnto = (to: Point, duration = 650) => {
    const seat = local(to);
    const mid = { x: (top.x + seat.x) / 2, y: Math.min(top.y, seat.y) - 0.7 * b };
    kid.current?.animate([{ transform: kidOn(BLOCKS) }, { transform: standing(mid, kidW, kidH) }, { transform: standing(seat, kidW, kidH) }], {
      duration,
      easing: "ease-in-out",
      fill: "forwards",
    });
  };

  /** The tower sways once from its foot, the more the higher it stands, and settles: will it hold? */
  const sway = (k: number) => {
    const a = SWAY_DEG[k - 1];
    if (!a) return;
    const side = k % 2 === 0 ? 1 : -1;
    tower.current?.animate(
      [0, a, -0.65 * a, 0.4 * a, -0.18 * a, 0].map((d) => ({ transform: `rotate(${side * d}deg)` })),
      { duration: SWAY_MS, easing: "ease-in-out" },
    );
  };

  /** A little up-and-down of a layer: the balloon bobbing, the mother bird fluttering. */
  const bob = (el: HTMLElement | null, lift: number, times = 1, base = "") =>
    el?.animate(
      [
        { transform: `${base} translateY(0px)` },
        { transform: `${base} translateY(${-lift}px)` },
        { transform: `${base} translateY(${lift * 0.4}px)` },
        { transform: `${base} translateY(0px)` },
      ],
      { duration: 700, iterations: times, easing: "ease-in-out" },
    );

  /** The goal stirs as the tower comes near: it bobs or flutters with its sound, a star lights, a band of colour comes. */
  const stir = (k: number) => {
    const n = STIR_AT.indexOf(k) + 1;
    if (!n) return;
    setStirs(n);
    if (goal === "moon" || goal === "rainbow" || goal === "cloud") playTwinkle();
    else if (home) {
      bob(mother.current, 0.3 * b, n);
      if (goal === "owl") playHoot();
      else playTweet();
    } else {
      bob(goalEl.current, 0.25 * b, 1, goalAt);
      if (goal === "bird") playTweet();
      else if (goal === "balloon" || goal === "hotair") playInflate();
      else playWhoosh();
    }
  };

  /** The tower tumbles: top block first, each rolling to its place on the meadow, the notes climbing back down. */
  const tumble = () => {
    for (let k = BLOCKS; k >= 1; k--) {
      const el = blocks.current[k];
      const from = local(blockAt(l, k));
      const fall = fallenAt(l, k);
      const to = local(fall);
      const order = BLOCKS - k;
      const mid = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 0.6 * b };
      const duration = 650 + k * 30;
      el?.animate(
        [
          { transform: `${centred(from, blockW, b)} rotate(0deg)` },
          { transform: `${centred(mid, blockW, b)} rotate(${fall.turn * 0.6}deg)`, offset: 0.45 },
          { transform: `${centred(to, blockW, b)} rotate(${fall.turn}deg)` },
        ],
        { duration, delay: order * 90, easing: "ease-in", fill: "forwards" },
      );
      later(() => playClimbNote(k - 1, 0.12), order * 90 + duration);
    }
    later(() => playKnock(380), 250);
    later(playLaugh, 1000);
  };

  /** The child and the goal move together along `path` (offsets from where they are), the goal's layer from `goalFrom`. */
  const together = (path: Point[], duration: number, kidFrom: string, goalFrom: string) => {
    const options = { duration, easing: "linear", fill: "forwards" as const };
    kid.current?.animate(
      path.map((p) => ({ transform: `${kidFrom} translate(${p.x}px, ${p.y}px)` })),
      options,
    );
    goalEl.current?.animate(
      path.map((p) => ({ transform: `${goalFrom} translate(${p.x}px, ${p.y}px)` })),
      options,
    );
  };

  /** After the round's tenth block: the goal taken, its end picture, the tower tumbling, then the end's buttons. */
  const finale = () => {
    setPhase("finale");
    const timing = FINALE[goal];
    const kidAt = kidOn(BLOCKS);
    if (FLOATS.includes(goal)) {
      // The child has the string (or the paper plane): it carries the child down gently beside the tumbling tower – the
      // plane glides further, the kite tugs it up once first.
      const plane = goal === "plane";
      later(() => {
        if (plane) playWhoosh();
        else playInflate();
        playGiggle();
      }, timing.take);
      later(() => {
        const land = local({ x: plane ? Math.min(l.x + 4.5 * b, digitLeft(l) - b) : l.x + 1.9 * b, y: l.ground });
        const dx = land.x - top.x;
        const dy = land.y - top.y;
        const wobble = plane ? 0.15 : goal === "kite" ? 0.5 : 0.35;
        const path = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => ({
          x: dx * t + Math.sin(t * Math.PI * 2) * wobble * b,
          y: dy * t * t * (3 - 2 * t) - (goal === "kite" ? Math.sin(t * Math.PI) * 0.8 * b : 0),
        }));
        const duration = plane ? 2600 : 3200;
        together(path, duration, kidAt, goalAt);
        playWhoosh();
        tumble();
        later(() => {
          playThump();
          setPose("wave");
          playGiggle();
        }, duration);
      }, timing.tumble);
    } else if (home) {
      // The little one hops from the child's head home, and its mother greets it.
      later(() => {
        const head = { x: top.x, y: top.y - kidH };
        const hollow = local(place.reach);
        const dx = hollow.x - head.x;
        const dy = hollow.y - head.y;
        baby.current?.animate(
          [
            { transform: "none" },
            { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 0.8 * b}px)`, offset: 0.5 },
            { transform: `translate(${dx}px, ${dy}px)` },
          ],
          { duration: 600, easing: "ease-in-out", fill: "forwards" },
        );
        const call = goal === "owl" ? playHoot : playTweet;
        call();
        later(() => {
          call();
          bob(mother.current, 0.25 * b, 2);
        }, 700);
      }, timing.take);
      // Then the child jumps off into the leaf pile, and the tower it pushed off from tumbles.
      later(() => {
        const land = local({ x: leafPile(l).x, y: l.ground - 0.15 * b });
        const mid = { x: (top.x + land.x) / 2 + 0.5 * b, y: top.y - 1.2 * b };
        kid.current?.animate(
          [
            { transform: `${kidAt} rotate(0deg)` },
            { transform: `${standing(mid, kidW, kidH)} rotate(14deg)`, offset: 0.32 },
            { transform: `${standing(land, kidW, kidH)} rotate(0deg)` },
          ],
          { duration: 900, easing: "ease-in", fill: "forwards" },
        );
        setPose("cheer");
        playWhoosh();
        later(tumble, 120);
        later(() => {
          playLeaves();
          playGiggle();
          leaves.current.forEach((leaf, i) => {
            const side = i % 2 === 0 ? -1 : 1;
            leaf?.animate(
              [
                { transform: "none", opacity: 1 },
                {
                  transform: `translate(${side * (0.5 + i * 0.15) * b}px, ${-(1.3 + (i % 3) * 0.4) * b}px) rotate(${side * 160}deg)`,
                  opacity: 1,
                  offset: 0.45,
                },
                { transform: `translate(${side * (0.8 + i * 0.2) * b}px, ${0.1 * b}px) rotate(${side * 320}deg)`, opacity: 0 },
              ],
              { duration: 1500, easing: "ease-out", fill: "forwards" },
            );
          });
        }, 900);
      }, timing.tumble);
    } else if (ROCKS.includes(goal)) {
      // The child climbs onto the cloud or into the moon's hollow; it rocks the child like a cradle.
      later(() => {
        hopOnto(place.reach);
        setStirs(STIR_AT.length + 1);
        playTwinkle();
      }, timing.take);
      later(() => {
        setPose("wave");
        const big = goal === "moon" ? 1 : 0.6;
        const swing = [0, 7, -5, 3.5, -2, 0.8, 0].map((d) => ({ transform: `rotate(${d * big}deg)` }));
        const options = { duration: 4200, easing: "ease-in-out" };
        goalEl.current?.animate(
          swing.map((s) => ({ transform: `${goalAt} ${s.transform}` })),
          options,
        );
        rock.current?.animate(swing, options);
        if (goal === "moon") playLullaby();
        else playGiggle();
        tumble();
      }, timing.tumble);
    } else if (goal === "rainbow") {
      // The child steps onto the rainbow's top and slides down it to the meadow.
      later(() => {
        hopOnto(place.reach, 500);
        playTwinkle();
      }, timing.take);
      later(() => {
        const { from, bend, to, o } = rainbowCurve(l, place);
        const steps = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map((t) => quad(from, bend, to, t));
        const feet = [...steps.map((p) => local({ x: p.x + o.x, y: p.y + o.y })), local({ x: to.x + o.x + 0.6 * b, y: l.ground })];
        kid.current?.animate(
          feet.map((p) => ({ transform: standing(p, kidW, kidH) })),
          { duration: 1900, easing: "ease-in", fill: "forwards" },
        );
        setPose("cheer");
        playSlide();
        tumble();
        later(() => {
          playThump();
          playGiggle();
          setPose("wave");
        }, 1900);
      }, timing.tumble);
    } else if (goal === "bird") {
      // The big bird lands beside the top, the child climbs onto its back, and it glides down to the meadow with it.
      // Its back, the svg mirrored so it flies forwards to the right.
      const back = { x: place.box.left + 0.4 * goalBox.w, y: place.box.top + 0.375 * goalBox.h };
      const land = { x: place.reach.x - back.x, y: place.reach.y - back.y };
      const landed = `${goalAt} translate(${land.x}px, ${land.y}px)`;
      later(() => {
        goalEl.current?.animate(
          [{ transform: goalAt }, { transform: `${goalAt} translate(${land.x * 0.5}px, ${land.y * 0.5 - 0.6 * b}px)` }, { transform: landed }],
          {
            duration: 700,
            easing: "ease-in-out",
            fill: "forwards",
          },
        );
        playTweet();
      }, timing.take);
      later(() => {
        hopOnto(place.reach, 550);
        playGiggle();
      }, timing.take + 800);
      later(() => {
        const seat = standing(local(place.reach), kidW, kidH);
        // Down to where its feet touch the meadow, out to the right, rising once on the way.
        const end = { x: Math.min(l.x + 5 * b, digitLeft(l) - 1.5 * b) - place.reach.x, y: l.ground - (place.reach.y + 0.55 * goalBox.h) };
        const path = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => ({ x: end.x * t, y: end.y * t * t - Math.sin(t * Math.PI) * 0.9 * b }));
        together(path, 3000, seat, landed);
        playWhoosh();
        tumble();
        later(() => {
          playTweet();
          setPose("wave");
        }, 3000);
      }, timing.tumble);
    } else {
      // The child climbs into the hot-air balloon's basket, and it sinks gently to the meadow with the child waving.
      later(() => {
        hopOnto(place.reach, 600);
        playInflate();
      }, timing.take);
      later(() => {
        const seat = standing(local(place.reach), kidW, kidH);
        const dy = l.ground - place.box.bottom + (6 / 150) * goalBox.h;
        const path = [0, 0.25, 0.5, 0.75, 1].map((t) => ({ x: Math.sin(t * Math.PI * 2) * 0.3 * b, y: dy * t * t * (3 - 2 * t) }));
        together(path, 3400, seat, goalAt);
        setPose("wave");
        playGiggle();
        tumble();
        later(playThump, 3400);
      }, timing.tumble);
    }
    later(() => setPhase("end"), timing.end);
  };

  /** A tap or key: the next block flies onto the tower, the child hops onto it, the number is said. */
  const press = (x?: number, y?: number) => {
    const at = performance.now();
    if (phase !== "build" || at < busyUntil.current || count >= BLOCKS) {
      // Between blocks a press only ripples, its soft knock at most every so often (root CLAUDE.md: no din).
      ripple(x, y);
      if (phase === "build" && at - lastSoft.current > EXTRA_SOUND_GAP_MS) {
        lastSoft.current = at;
        playKnock(1100);
      }
      return;
    }
    glow(x, y);
    const k = count + 1;
    const last = k === BLOCKS;
    const fly = last ? LAST_FLY_MS : FLY_MS;
    busyUntil.current = last ? Number.POSITIVE_INFINITY : at + STEP_MS;
    setCount(k);
    onPlaced(first + k);
    // The round's tenth: a drum roll while it flies, slower, up to the goal.
    if (last) playDrumRoll(1);
    hop(k - 1, k, fly - 330);
    later(() => {
      playKnock(420 + k * 45);
      playClimbNote(k - 1);
      // From the seventh on the wood creaks: the tower is high now.
      if (k >= 7) later(playCreak, 250);
      sway(k);
      const line = word(first + k);
      say(line.text, true, line.english);
      if (k >= REACH_FROM) setPose("cheer");
      stir(k);
      if (last) finale();
    }, fly);
  };
  const pressRef = useRef(press);
  pressRef.current = press;

  // The new block flies from where it waited onto the tower, in an arc over the child's head; the blocks a jump put
  // there stand already.
  useLayoutEffect(() => {
    if (count === already) return;
    const to = local(blockAt(l, count));
    const from = local(l.waiting);
    const dx = from.x - to.x;
    const dy = from.y - to.y;
    const final = centred(to, blockW, b);
    blocks.current[count]?.animate(
      [
        { transform: `${final} translate(${dx}px, ${dy}px) rotate(-8deg)` },
        { transform: `${final} translate(${dx * 0.45}px, ${Math.min(dy, 0) * 0.45 - 1.6 * b}px) rotate(6deg)`, offset: 0.55 },
        { transform: final },
      ],
      { duration: count === BLOCKS ? LAST_FLY_MS : FLY_MS, easing: "ease-in-out" },
    );
  }, [count, already, l, b, blockW, local]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Esc is the game's way out (held), and shortcuts stay the browser's.
      if (e.key === "Escape" || e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      if (e.repeat) return;
      // A key's light shows where the next block waits.
      const r = scene.current?.getBoundingClientRect();
      pressRef.current(r && r.left + l.waiting.x, r && r.top + l.waiting.y);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [l]);

  const onPointerDown = (e: PointerEvent) => press(e.clientX, e.clientY);

  const shown = Math.min(count, BLOCKS);
  const number = first + shown;
  const next = count + 1;
  /** The string's units of the balloon and the kite (120 for their height): how far it hangs, and how far aside. */
  const unit = place.size / 120;
  const stars: Point[] = [
    { x: place.at.x - 1.6 * b, y: place.at.y - 1.2 * b },
    { x: place.at.x + 2 * b, y: place.at.y - 0.6 * b },
    { x: place.at.x + 1.3 * b, y: place.at.y + 1.9 * b },
    { x: place.at.x - 2.5 * b, y: place.at.y + 0.5 * b },
  ];
  const star = 0.75 * b;
  const rainbow = goal === "rainbow" ? rainbowCurve(l, place) : undefined;

  return (
    <>
      <div className="tw-scene" ref={scene} onPointerDown={onPointerDown}>
        <Backdrop layout={l} goal={goal} />
        {goal === "moon" &&
          stars.map((p, i) => (
            <div key={i} className={i < stirs ? "tw-star tw-lit" : "tw-star"} style={{ width: star, height: star, transform: centred(p, star, star) }}>
              <Star />
            </div>
          ))}
        <div className={`tw-goal tw-goal-${goal}`} ref={goalEl} style={{ width: goalBox.w, height: goalBox.h, transform: goalAt }}>
          {goal === "balloon" && <Balloon hang={(goalBox.h - place.size) / unit} aside={(place.reach.x - place.at.x) / unit} />}
          {goal === "kite" && <Kite hang={(goalBox.h - place.size) / unit} aside={(place.reach.x - place.at.x) / unit} />}
          {goal === "plane" && <Plane />}
          {goal === "cloud" && <CloudSeat awake={stirs >= STIR_AT.length} />}
          {rainbow && <Rainbow w={goalBox.w} h={goalBox.h} from={rainbow.from} bend={rainbow.bend} to={rainbow.to} b={b} bands={2 * stirs} />}
          {goal === "bird" && <Bird />}
          {goal === "hotair" && <HotAir />}
          {home && (
            <>
              <div className="tw-mother" ref={mother} style={{ width: 0.95 * b, height: 0.8 * b, left: 0.1 * b, top: -0.45 * b }}>
                {goal === "owl" ? <Owl /> : <Bird />}
              </div>
              {goal === "owl" ? <Hollow /> : <Nest />}
            </>
          )}
          {goal === "moon" && <Moon awake={stirs >= STIR_AT.length} />}
        </div>
        {home &&
          LEAF_COLORS.map((color, i) => (
            <div
              key={color}
              className="tw-leaf"
              ref={(el) => {
                leaves.current[i] = el;
              }}
              style={{
                width: 0.45 * b,
                height: 0.3 * b,
                transform: centred({ x: leafPile(l).x + (i - 2) * 0.3 * b, y: l.ground - 0.35 * b }, 0.45 * b, 0.3 * b),
              }}
            >
              <Leaf color={color} />
            </div>
          ))}
        <div className="tw-tower" ref={tower} style={{ left: box.left, width: box.width, height: box.height, transformOrigin: `${3 * b}px ${l.ground}px` }}>
          {Array.from({ length: shown }, (_, i) => {
            const k = i + 1;
            return (
              <div
                key={k}
                className="tw-block"
                ref={(el) => {
                  blocks.current[k] = el;
                }}
                style={{ width: blockW, height: b, transform: centred(local(blockAt(l, k)), blockW, b) }}
              >
                <Block n={first + k} />
              </div>
            );
          })}
          <div className="tw-kid" ref={kid} style={{ width: kidW, height: kidH, transform: kidOn(count) }}>
            <div
              className="tw-rock"
              ref={rock}
              // Seated on the cloud or in the moon, it rocks with it round the goal's middle.
              style={{ transformOrigin: `${place.at.x - place.reach.x + kidW / 2}px ${place.at.y - place.reach.y + kidH}px` }}
            >
              <Kid pose={pose} />
            </div>
            {home && (
              <div className="tw-baby" ref={baby} style={{ width: 0.62 * b, height: 0.52 * b, left: (kidW - 0.62 * b) / 2, top: -0.32 * b }}>
                {goal === "owl" ? <Owl baby /> : <Bird baby />}
              </div>
            )}
          </div>
        </div>
        {next <= BLOCKS && phase === "build" && (
          <div key={next} className="tw-waiting" data-tap style={{ width: blockW, height: b, transform: centred(l.waiting, blockW, b) }}>
            <Block n={first + next} />
          </div>
        )}
        {count === already && <TapHint x={l.waiting.x} y={l.waiting.y} r={1.1 * b} side="above" />}
        {number > 0 && (
          <div
            key={number}
            className="tw-digit"
            style={{ left: l.digit.x, top: l.digit.y, fontSize: l.digitSize * (number >= TOTAL ? 0.75 : 1), color: BLOCK_COLORS[(number - 1) % BLOCKS] }}
          >
            {number}
          </div>
        )}
        <FeedbackLayer effects={effects} />
      </div>
      {phase === "end" && ending}
    </>
  );
}
