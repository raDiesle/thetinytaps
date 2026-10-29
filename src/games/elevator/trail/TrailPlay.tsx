import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { INK } from "@/games/scenes/shared";
import { useDevice } from "@/lib/device";
import { playCountNote, playGiggle, playMelody, playPop, playRandomNote, playSlide } from "@/lib/sfx";
import { type TargetLanguage, targetLanguageFor } from "@/content/targetLanguages";
import { pick } from "@/lib/language";
import { speak } from "@/lib/speech";
import { tapState } from "@/lib/tapTargets";
import { StoryEnd, nextCard } from "../cards";
import { ActionButton, Confetti } from "../house";
import { HERO, KID_H, Kid, type Outfit, PACK, ThoughtBubble, type Pose } from "../kid";
import { spokenIn, translationOf } from "../phrases";
import type { ElevatorSettings } from "../settings";
import { FRIENDS, type FriendPose } from "./friends";
import { allStations, facing, groundY, placed, route } from "./ground";
import { Fitted, GOALS, ITEMS, type Goal, type ItemId, type Picture } from "./items";
import type { Climb, Cue, Flight, Fork, Moment, Obstacle, Pickup, Point, Station, TrailLevel, Way } from "./types";
import { WORRIES } from "./worries";
import "./trail.css";

const VIEW_W = 1600;
const VIEW_H = 900;
/** Where the child's feet are on the 1600 × 900 picture the backdrops are drawn for: the world scrolls so that they
 * stay there, and `layoutHud` then puts that point where the screen has room for it (`Hud.feet`). */
const KID_AT: Point = [760, 740];
/** How high the child's feet are on the screen in a world that goes up (`turns`), which keeps the whole width. */
const UP_FEET = 620;
/** A screen taller than the picture zooms the world in until it shows this much height, so it doesn't fill with
 * sky; at most `MAX_ZOOM` times, so a world going sideways still shows enough of the way ahead. */
const WORLD_H = 900;
const MAX_ZOOM = 1.5;
/** At least this much of the world is shown ahead of the child (and a third of it behind). */
const AHEAD = 840;
/** Ground kept free between the child's feet and the top of the frames below them. */
const FEET_GAP = 24;
/** How much slower the far hills move than the world. */
const FAR = 0.3;
/** Walking time per world point. */
const WALK_MS = 2.6;
/** One step up the stairs. */
const STEP_MS = 380;
/** Sliding time per world point: much faster than walking. */
const SLIDE_MS = 0.9;
/** Floating time per world point, under the umbrella: much slower than walking. */
const FLOAT_MS = 9;
/** A thing flying from the child's hand to an obstacle. */
const FLY_MS = 650;
/** How big a thing is while the child carries it, in world points. */
const CARRY = 84;
// Where a carried thing is, from the child's feet (facing right): in the hand reaching out, high up in the
// raised hand, just above the backpack's opening on the back, and deep in it.
const HAND_OUT: Point = [72, -128];
const HAND_UP: Point = [44, -196];
const PACK_TOP: Point = [-54, -180];
const PACK_IN: Point = [-51, -96];
/** The backpack on the child's back while nothing goes in or out (the ghost wears it too). */
const PACK_SHUT = { open: false, bump: 0 };
/** Without a tap for so long, the hand pops up again (and while choosing, the right thing glows). */
const NUDGE_MS = 7000;
/** A tap while something is still going on makes the next tap's walk go by itself: first the footprints and the
 * ghost show for this long, so the child sees where it goes. */
const QUEUED_MS = 600;
/** From the end of the level until „Nochmal“ and „Weiter“ come. */
const END_MS = 6000;
/** The language a level speaks until it is translated. */
const GERMAN = targetLanguageFor("de");
/** The backpack on the screen holds three things at most, standing side by side in it. */
const SLOT_COUNT = 3;
/** From one thing's middle to the next, and from the frame's left edge to the first. */
const SLOT_STEP = 150;
const SLOT_IN = 100;
/** The upper edge of the front pockets: the things stand behind them, their bottoms hidden. */
const RIM = 808;
/** A pocket of the backpack on the screen: from its middle to its side, and its top and height. */
const FACH = 62;
const FACH_TOP = 772;
const POCKET_Y = 806;
const POCKET_H = 66;
const ACTION_R = 62;
/** The bag's frame and the button's frame, as high as each other: drawn here, then moved down by `Hud.lift` to the
 * screen's bottom edge. */
const HUD_TOP = 704;
const HUD_H = 188;
/** The backpack's body is a little lower than the button's frame: its handle sticks out above it. */
const BAG_TOP = 724;
/** On a computer a small key cap under the action button, and one on each thing's front pocket, shows which key
 * does it. */
const KEY_Y = 864;
const POCKET_KEY_Y = 842;
/** Room kept free between the screen's edge and the frames. */
const EDGE = 18;
/** The footprints to where the child goes next are this far apart. */
const PRINT_GAP = 62;
/** The round picture sign of each way at a fork. */
const WAY_R = 66;
/** A friend walks this far behind the child, clear of its backpack. */
const FRIEND_GAP = 170;
/** A friend running to help or back, per world point: faster than the child walks. */
const RUN_MS = 1.4;

/** The screen's free edges (without a notch) in the picture's units: they lie outside 0–1600 and 0–900 where the
 * screen is wider or taller than the picture. */
export interface Screen {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** Where the bag and the action button are on the screen, and where the world is, in the picture's units. */
export interface Hud {
  /** The bag's frame: left, top, width, height – before `lift`. */
  bagBox: [number, number, number, number];
  /** Where each thing stands in the backpack: its middle, on the front pockets' upper edge – before `lift`. */
  slots: Point[];
  action: Point;
  actionBox: [number, number, number, number];
  /** Bag and button are drawn as above, then their frames' bottom-left corner moves here, at the screen's bottom
   * edge, and they grow by `zoom` from there. */
  corner: Point;
  /** Where the child's feet are on the screen in a world going sideways: above the frames, never behind them. */
  feet: Point;
  /** How much bigger the world – and bag and button with it – is drawn than the picture's units, on a screen taller
   * than the picture (a tablet: so its big buttons are big to the thumb too). */
  zoom: number;
}

/**
 * Bag and button sit side by side along the screen's bottom edge, not the picture's – the bag at the very left and
 * the button right next to it, where one thumb reaches both – and the child walks above them: its feet stand just
 * over the frames, so nothing of the way is covered and the sky gets only what is left. A screen taller than the
 * picture (a tablet) zooms the world in instead of showing more sky – bag and button grow with it – and the child
 * stands further left there so the way ahead stays in sight.
 */
export function layoutHud({ left, right, top, bottom }: Screen, keys: boolean): Hud {
  const x0 = left + EDGE;
  const y = keys ? 784 : HUD_TOP + HUD_H / 2;
  const slots = Array.from({ length: SLOT_COUNT }, (_, i): Point => [x0 + SLOT_IN + i * SLOT_STEP, RIM]);
  const bagW = 2 * SLOT_IN + (SLOT_COUNT - 1) * SLOT_STEP;
  const boxW = 2 * ACTION_R + 44;
  const boxX = x0 + bagW + 26;
  const zoom = Math.min(MAX_ZOOM, Math.max(1, (bottom - top) / WORLD_H));
  const kidX = Math.max(left + (AHEAD / 3) * zoom, Math.min((left + right) / 2, right - AHEAD * zoom));
  const base = bottom - EDGE;
  return {
    bagBox: [x0, HUD_TOP, bagW, HUD_H],
    slots,
    action: [boxX + boxW / 2, y],
    actionBox: [boxX, HUD_TOP, boxW, HUD_H],
    corner: [x0, base],
    feet: [kidX, base - HUD_H * zoom - FEET_GAP],
    zoom,
  };
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** How much bigger a thing is where it lies in the world than while it is carried. */
const natural = (picture: Picture) => 1 / Math.min(CARRY / picture.w, CARRY / picture.h);

/** A thing standing in the open backpack on (0, 0), its bottom behind the front; a long thing (the plank) sticks out slanted. */
function InPack({ picture }: { picture: Picture }) {
  if (picture.w > picture.h * 2.5) return <g transform={`rotate(-58) scale(${150 / picture.w})`}>{picture.draw()}</g>;
  const s = Math.min(118 / picture.w, 104 / picture.h);
  return <g transform={`translate(0 ${Math.min(24, picture.h * s * 0.25)}) scale(${s})`}>{picture.draw()}</g>;
}

/** How big the ring round a thing lying in the world is: about as big as the thing. */
const ringOf = (picture: Picture) => Math.min(110, Math.max(56, Math.max(picture.w, picture.h) / 2 + 14));

/** A dashed yellow ring round the thing the next tap picks up, in the world and in the backpack on the screen. */
function WantRing({ at: [x, y], r }: { at: Point; r: number }) {
  return (
    <g className="tl-want">
      <circle cx={x} cy={y} r={r} stroke={INK} strokeWidth="13" />
      <circle cx={x} cy={y} r={r} stroke="#ffd43b" strokeWidth="7" />
    </g>
  );
}

/** A small key of the keyboard, drawn around its middle; `on` while it does something now, `down` while it is held. */
function KeyCap({ x, y, w, on, down, children }: { x: number; y: number; w: number; on: boolean; down: boolean; children: ReactNode }) {
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

/** What the next tap does: the child walks along the footprints to its pale ghost and does what the ghost does
 * there; the button shows the thing it gets there, or feet or stairs. */
interface Next {
  prints: Point[];
  ghost: Point;
  /** The way the ghost looks: in a world that turns, it may look left. */
  face: 1 | -1;
  pose: Pose;
  icon: ItemId | "walk" | "climb" | "paddle";
  /** Where the thing lies that the tap picks up: a yellow ring goes round it, and its pale picture waits in the
   * backpack where it will go. */
  at?: Point;
}

/** The thing the next tap picks up, if it picks one up. */
const itemOf = (icon: Next["icon"]): ItemId | null => (icon === "walk" || icon === "climb" || icon === "paddle" ? null : icon);

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

interface KidState {
  x: number;
  y: number;
  /** Length of the current walk (and scroll) in ms; 0 while standing. */
  walk: number;
  pose: Pose;
  face: 1 | -1;
  /** Bumped to make it hop when tapped. */
  hop: number;
}

/** The creature walking along with the child (G-10), drawn by its `FRIENDS` entry. */
interface FriendState {
  /** Its picture in the bag, and the key of `FRIENDS`. */
  id: ItemId;
  x: number;
  y: number;
  /** Length of the current run in ms; 0 while it stays. */
  ms: number;
  face: 1 | -1;
  pose: FriendPose;
  /** Bumped to make it hop (joining, setting off, tapped). */
  hop: number;
}

interface View {
  picking: boolean;
  kid: KidState;
  /** The things in the bag, one per slot. */
  bag: (ItemId | null)[];
  /** The slot a thing is just dropping into, or rising out of, on the screen. */
  entering: number | null;
  leaving: number | null;
  /** Bumped to bounce the backpack on the screen when a thing goes in or out. */
  bagBump: number;
  /** The thing the child carries in the world, between where it lies, the hands and the backpack. */
  carry: ItemId | null;
  /** What the child wears (bare feet, flip-flops). */
  wear: Outfit[];
  /** The backpack on the child's back: its lid is open while a thing goes in or out; `bump` bounces it. */
  pack: { open: boolean; bump: number };
  done: string[];
  here: string | null;
  nope: { id: string; n: number } | null;
  /** The bag is open: the child picks a thing. */
  choosing: boolean;
  /** The thing that helps glows. */
  hint: ItemId | null;
  /** Bumped to bounce the slots. */
  shake: number;
  /** The action button waits for a tap; `nudge` makes it jump anew, `next` shows what the tap will do. */
  action: { nudge: number; next: Next } | null;
  /** The child tapped while something was still going on: the button stays lit, and the next walk goes by itself. */
  queued: boolean;
  /** A thought bubble: the child's (`at` null) with the goal when it goes away, or at an obstacle why a thing helps –
   * the child's worry, or the creature's wish above its head at `at`. `nudge` counts the reminders. */
  bubble: { picture: Picture; at: Point | null; nudge: number } | null;
  /** At a fork: the child picks a way by its sign; each shows where it goes first. `nudge` makes the signs hop. */
  fork: { id: string; ways: Next[]; nudge: number } | null;
  /** The friend walking along, once a creature has joined. */
  friend: FriendState | null;
  /** The goal is going away, with the level's thief round it (the hare). */
  away: boolean;
  /** The child sits on this while it slides down (the sled). */
  riding: ComponentType | null;
  party: boolean;
}

const startView = (level: TrailLevel): View => {
  const [x, y] = placed(level.turns, [level.start, groundY(level.ground, level.start)]);
  return {
    picking: false,
    kid: { x, y, walk: 0, pose: "stand", face: facing(level.turns, level.start), hop: 0 },
    bag: [null, null, null],
    entering: null,
    leaving: null,
    bagBump: 0,
    carry: null,
    wear: level.wear ?? [],
    pack: PACK_SHUT,
    done: [],
    here: null,
    nope: null,
    choosing: false,
    hint: null,
    shake: 0,
    action: null,
    queued: false,
    bubble: null,
    fork: null,
    friend: null,
    away: false,
    riding: null,
    party: false,
  };
};

/** The hand of the child reaching out (pose "reach"), where the string is held. */
const handOf = (kid: KidState): Point => [kid.x + 62 * kid.face, kid.y - 112];
/** Where the goal is while the child holds it: high up on its string, or in the reaching hand. */
const heldOf = (kid: KidState, goal: Goal): Point => (goal.carry === "string" ? [kid.x + 140 * kid.face, kid.y - 250] : [kid.x + 66 * kid.face, kid.y - 78]);

/** "Weg-Abenteuer": the goal goes away, the child follows it through a scrolling world and uses what it finds. */
export function TrailPlay({
  language,
  settings,
  level,
  onPick,
}: {
  /** The app language: what the child hears is spoken in it. */
  language: TargetLanguage;
  settings: ElevatorSettings;
  level: TrailLevel;
  onPick: (id: string) => void;
}) {
  const theGoal = GOALS[level.goal];
  const { raft } = level;
  /** On the raft here: from the start until the child gets off at `raft.until`. */
  const afloat = (x: number) => !!raft && x <= raft.until;
  const onString = theGoal.carry === "string";
  const [view, setView] = useState<View>(() => startView(level));
  const viewRef = useRef<View>(view);
  const { bursts, spawn } = useBursts();
  const { touchOnly } = useDevice();
  /** The key held down right now, so its cap on the screen goes down too. */
  const [held, setHeld] = useState<string | null>(null);

  // The screen's free edges (without a notch) in the picture's units, measured whenever the screen turns or resizes.
  const playEl = useRef<HTMLDivElement>(null);
  const svgEl = useRef<SVGSVGElement>(null);
  const safeEl = useRef<HTMLDivElement>(null);
  const [screen, setScreen] = useState<Screen>({ left: 0, right: VIEW_W, top: 0, bottom: VIEW_H });
  useLayoutEffect(() => {
    const measure = () => {
      const box = svgEl.current?.getBoundingClientRect();
      const free = safeEl.current?.getBoundingClientRect();
      if (!box || !free) return;
      const scale = Math.min(box.width / VIEW_W, box.height / VIEW_H);
      if (!scale) return;
      const toX = (px: number) => Math.round(VIEW_W / 2 + (px - box.left - box.width / 2) / scale);
      const toY = (px: number) => Math.round(VIEW_H / 2 + (px - box.top - box.height / 2) / scale);
      setScreen({ left: toX(free.left), right: toX(free.right), top: toY(free.top), bottom: toY(free.bottom) });
    };
    measure();
    const watch = new ResizeObserver(measure);
    if (playEl.current) watch.observe(playEl.current);
    return () => watch.disconnect();
  }, []);

  // The level is a script of waits; leaving bumps the generation and drops its timers.
  const generation = useRef(0);
  const timers = useRef(new Set<number>());
  /** Set while the script waits for a tap anywhere. */
  const tapper = useRef<(() => void) | null>(null);
  /** Set while the bag is open: it gets the slot. */
  const chooser = useRef<((slot: number) => void) | null>(null);
  /** Set at a fork while the child picks a way: it gets the way's number. */
  const picker = useRef<((way: number) => void) | null>(null);
  /** A tap came while the script was busy: the next `nextTap` goes on by itself. */
  const queued = useRef(false);
  /** The ground the child walks on: the level's, and from a fork on the picked way's. */
  const ground = useRef(level.ground);
  /** How far along the ground the child is (its x there); in a world that turns, the child is drawn elsewhere. */
  const along = useRef(level.start);
  /** Where a point of the ground is drawn. */
  const place = (p: Point) => placed(level.turns, p);

  // The goal (the kite, the ball, the balloon) moves along curves, so it is moved frame by frame, not by React.
  const goalEl = useRef<SVGGElement>(null);
  const spinEl = useRef<SVGGElement>(null);
  const stringEl = useRef<SVGLineElement>(null);
  const goal = useRef<{ at: Point; hand: Point | null }>({ at: [0, 0], hand: null });
  // The carried thing moves frame by frame too. It is drawn in front of the child, or behind it (and its
  // backpack) while it sinks into the backpack or comes up out of it; `mover` stops an older move.
  const carryFront = useRef<SVGGElement>(null);
  const carryBack = useRef<SVGGElement>(null);
  const carried = useRef<{ at: Point; s: number; behind: boolean }>({ at: [0, 0], s: 1, behind: false });
  const mover = useRef(0);

  const put = useCallback((change: Partial<View> | ((v: View) => Partial<View>)) => {
    const patch = typeof change === "function" ? change(viewRef.current) : change;
    viewRef.current = { ...viewRef.current, ...patch };
    setView(viewRef.current);
  }, []);

  const kid = (patch: Partial<KidState>) => put((v) => ({ kid: { ...v.kid, ...patch } }));

  const later = (ms: number, run: () => void) => {
    const g = generation.current;
    const timer = window.setTimeout(() => {
      timers.current.delete(timer);
      if (g === generation.current) run();
    }, ms);
    timers.current.add(timer);
    return () => {
      clearTimeout(timer);
      timers.current.delete(timer);
    };
  };

  /** Resolves after `ms`; never, once the child has left, so the script just stops. */
  const wait = (ms: number) => new Promise<void>((resolve) => later(ms, resolve));

  useEffect(
    () => () => {
      generation.current++;
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  /** A level not yet translated into the app language (its title has no translation) is said all in German, so
   * its new lines and the shared ones („Ab in den Rucksack!“) never come in two languages. */
  const voice = translationOf(level.title, language.id) === undefined ? GERMAN : language;

  /** Speaks a German sentence of the level in the app language (only with "Vorlesen"). */
  const say = (german: string) => {
    if (!settings.speech) return;
    const { text, speechLang } = spokenIn(german, voice);
    speak(text, speechLang, { rate: 0.85 });
  };

  const sound = (play: () => void) => {
    if (settings.sounds) play();
  };

  const cue = (sounds: Cue[]) => sounds.forEach(([ms, play]) => later(ms, () => sound(play)));

  /** Draws the goal at `at`, with its string to `hand` if it is held; a ball turns as far as it has rolled. */
  const drawGoal = (at: Point, hand: Point | null) => {
    goal.current = { at, hand };
    goalEl.current?.setAttribute("transform", `translate(${at[0]} ${at[1]})`);
    const r = theGoal.roll;
    if (r) spinEl.current?.setAttribute("transform", `rotate(${((at[0] / r) * 180) / Math.PI} 0 ${-r})`);
    const line = stringEl.current;
    if (!line) return;
    line.style.display = hand ? "" : "none";
    if (hand) {
      line.setAttribute("x1", `${hand[0]}`);
      line.setAttribute("y1", `${hand[1]}`);
      line.setAttribute("x2", `${at[0]}`);
      line.setAttribute("y2", `${at[1]}`);
    }
  };

  /** Moves the goal to `to` in `ms`, swaying sideways by `sway` on the way. */
  const moveGoal = (to: Point, ms: number, hand: Point | null, sway = 0) => {
    const [x0, y0] = goal.current.at;
    if (theGoal.turn && to[0] !== x0) spinEl.current?.setAttribute("transform", `scale(${to[0] > x0 ? 1 : -1} 1)`);
    const g = generation.current;
    const begin = performance.now();
    const frame = (now: number) => {
      if (g !== generation.current) return;
      const t = Math.min(1, (now - begin) / ms);
      const e = ease(t);
      const side = Math.sin(t * Math.PI * 3) * sway * (1 - t);
      drawGoal([x0 + (to[0] - x0) * e, y0 + (to[1] - y0) * e + side], hand);
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return wait(ms);
  };

  /** Moves the goal along a flight: through its `via` points, then to `to`. */
  const flyGoal = async (flight: Flight, hand: Point | null) => {
    for (const [at, ms] of flight.via ?? []) await moveGoal(at, ms, hand, flight.sway);
    await moveGoal(flight.to, flight.ms, hand, flight.sway);
  };

  /** The camera: the world moves so that the child stays at `KID_AT` of the picture (which the HUD's `feet` and `zoom`
   * then put on the screen); a world that goes up stays put sideways and only follows the child's height. */
  const camOf = (k: KidState): Point => (level.turns ? [0, k.y - UP_FEET] : [k.x - KID_AT[0], k.y - KID_AT[1]]);

  /** Where the ground is drawn at `x` of the way. */
  const onGround = (x: number) => place([x, groundY(ground.current, x)]);

  /** The friend (if there is one) runs to the drawn point `to` in `ms`. */
  const friendTo = ([x, y]: Point, ms: number) => put((v) => ({ friend: v.friend && { ...v.friend, x, y, ms, face: x >= v.friend.x ? 1 : -1, pose: "walk" } }));

  /** The friend stays where it is now, doing `pose`, facing the way on. */
  const friendStays = (pose: FriendPose = "sit") =>
    put((v) => ({ friend: v.friend && { ...v.friend, ms: 0, face: facing(level.turns, along.current), pose } }));

  /** The friend runs to the drawn point `to` (a little faster than the child walks) and does `pose` there. */
  const runFriend = async (to: Point, pose: FriendPose = "sit") => {
    const f = viewRef.current.friend;
    if (!f) return;
    const ms = Math.max(300, Math.hypot(to[0] - f.x, to[1] - f.y) * RUN_MS);
    friendTo(to, ms);
    await wait(ms);
    friendStays(pose);
  };

  const hopFriend = () => put((v) => ({ friend: v.friend && { ...v.friend, hop: v.friend.hop + 1 } }));

  /** Walks the child along the ground to `x`; the world scrolls along, and a friend follows behind. */
  const walkTo = async (x: number) => {
    for (const corner of route(ground.current, along.current, x)) {
      const k = viewRef.current.kid;
      const [px, py] = place(corner);
      along.current = corner[0];
      const ms = Math.hypot(px - k.x, py - k.y) * WALK_MS;
      if (ms < 1) continue;
      kid({ x: px, y: py, walk: ms, pose: afloat(corner[0]) ? "paddle" : "walk", face: px >= k.x ? 1 : -1 });
      friendTo(onGround(corner[0] - FRIEND_GAP), ms);
      await wait(ms);
    }
    kid({ walk: 0, pose: "stand", face: facing(level.turns, x) });
    friendStays();
  };

  /** Draws the carried thing at `at`, `s` times its carrying size, in front of the child or `behind` it. */
  const drawCarry = (at: Point, s: number, behind = carried.current.behind) => {
    carried.current = { at, s, behind };
    const [shown, hidden] = behind ? [carryBack.current, carryFront.current] : [carryFront.current, carryBack.current];
    if (hidden) hidden.style.display = "none";
    if (!shown) return;
    shown.style.display = "";
    shown.setAttribute("transform", `translate(${at[0]} ${at[1]}) scale(${s})`);
  };

  /** Moves the carried thing to `to` in `ms` along a bow `arc` points high, growing or shrinking to `s`; `linear` keeps
   * pace with the child walking or floating. */
  const moveCarry = (to: Point, ms: number, s = carried.current.s, arc = 0, linear = false) => {
    const {
      at: [x0, y0],
      s: s0,
    } = carried.current;
    const g = generation.current;
    const move = ++mover.current;
    const begin = performance.now();
    const frame = (now: number) => {
      if (g !== generation.current || move !== mover.current) return;
      const t = Math.min(1, (now - begin) / ms);
      const e = linear ? t : ease(t);
      drawCarry([x0 + (to[0] - x0) * e, y0 + (to[1] - y0) * e - arc * 4 * t * (1 - t)], s0 + (s - s0) * e);
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    // Frames can lag behind the clock: the thing is where it should be when the next step starts.
    return wait(ms).then(() => {
      if (move === mover.current) drawCarry(to, s);
    });
  };

  /** A point next to the child, from its feet: `HAND_UP`, `PACK_TOP` … */
  const byKid = ([dx, dy]: Point): Point => {
    const k = viewRef.current.kid;
    return [k.x + dx * k.face, k.y + dy];
  };

  /** The child holds the thing in its hand up high, then throws it over its shoulder into the open backpack;
   * the backpack bounces, and on the screen the thing drops into the big backpack at `slot`. */
  const packAway = async (item: ItemId, slot: number) => {
    kid({ pose: "lift" });
    await moveCarry(byKid(HAND_UP), 320, 1);
    await wait(420);
    put((v) => ({ pack: { ...v.pack, open: true } }));
    kid({ pose: "pack" });
    await moveCarry(byKid(PACK_TOP), 440, 0.9, 60);
    drawCarry(carried.current.at, carried.current.s, true);
    await moveCarry(byKid(PACK_IN), 280, 0.6);
    put((v) => ({
      carry: null,
      pack: { open: false, bump: v.pack.bump + 1 },
      bag: v.bag.map((thing, i) => (i === slot ? item : thing)),
      entering: slot,
      bagBump: v.bagBump + 1,
    }));
    sound(playPop);
    kid({ pose: "stand" });
    await wait(500);
    put({ entering: null });
  };

  /** The thing rises out of the big backpack on the screen, and the child reaches back into its backpack and
   * holds the thing up high. */
  const takeOut = async (item: ItemId, slot: number) => {
    put((v) => ({ leaving: slot, bagBump: v.bagBump + 1 }));
    sound(playPop);
    await wait(320);
    put((v) => ({ leaving: null, carry: item, bag: v.bag.map((thing, i) => (i === slot ? null : thing)), pack: { ...v.pack, open: true } }));
    kid({ pose: "pack" });
    drawCarry(byKid(PACK_IN), 0.6, true);
    await moveCarry(byKid(PACK_TOP), 300, 0.9);
    drawCarry(carried.current.at, carried.current.s, false);
    put((v) => ({ pack: { ...v.pack, open: false } }));
    kid({ pose: "lift" });
    await moveCarry(byKid(HAND_UP), 380, 1, 50);
    await wait(260);
  };

  /** Waits for a tap – or, after a tap that came while something was still going on, goes on by itself. */
  const nextTap = () =>
    new Promise<void>((resolve) => {
      tapper.current = resolve;
      if (queued.current) later(QUEUED_MS, () => tapper.current === resolve && tap());
    });

  /** A tap, a click or a key while the script waits for one. */
  const tap = () => {
    const resolve = tapper.current;
    if (resolve) {
      tapper.current = null;
      unqueue();
      resolve();
    }
  };

  /** Nothing waits for the child: the script is walking, packing, using a thing … */
  const busy = () => !tapper.current && !chooser.current && !picker.current && !viewRef.current.picking;

  /** A tap while busy is kept for the next walk, so the child doesn't have to wait and tap again. */
  const queue = () => {
    queued.current = true;
    if (!viewRef.current.queued) put({ queued: true });
  };

  /** A kept tap is dropped where the child has to pick something itself (a thing at an obstacle, a way). */
  const unqueue = () => {
    queued.current = false;
    if (viewRef.current.queued) put({ queued: false });
  };

  /** Footprints along `on` (the ground) from the child to `x`, then one on each of `steps`, where they are drawn. */
  const printsTo = (x: number, steps: Point[] = [], on = ground.current): Point[] => {
    const prints: Point[] = [];
    for (let px = along.current + PRINT_GAP; px < x - PRINT_GAP / 2; px += PRINT_GAP) prints.push([px, groundY(on, px)]);
    return [...prints, ...steps].map(place);
  };

  /** Walking on to `x` and doing `pose` there, shown before the tap. */
  const nextAt = (x: number, pose: Pose, icon: Next["icon"], on = ground.current): Next => ({
    prints: printsTo(x, [], on),
    ghost: place([x, groundY(on, x)]),
    face: facing(level.turns, x),
    pose,
    icon: icon === "walk" && afloat(x) ? "paddle" : icon,
  });

  /** What the tap at `station` does: for stairs, walking there and up all the steps. */
  const nextOf = (station: Station, on = ground.current): Next => {
    if (station.kind === "pickup") return { ...nextAt(station.x, "take", station.item, on), at: station.at };
    if (station.kind === "moment") return nextAt(station.x, station.pose, "walk", on);
    if (station.kind === "obstacle") return nextAt(station.x, "stand", "walk", on);
    const top = station.steps[station.steps.length - 1];
    return { prints: printsTo(station.x, station.steps, on), ghost: place(top), face: facing(level.turns, top[0]), pose: "stand", icon: "climb" };
  };

  /** The action button lights up until the child taps (it, anywhere, or any key), and footprints and the child's
   * ghost show where the tap takes it; after a while the button jumps and the footprints and the ghost come again.
   * The reminder shows only the next step, never the goal at the end: that is far away and doesn't help now. */
  const go = async (next: Next) => {
    put({ action: { nudge: 0, next } });
    let stop = () => {};
    const nudge = () => {
      put((v) => ({ action: v.action && { ...v.action, nudge: v.action.nudge + 1 } }));
      stop = later(NUDGE_MS, nudge);
    };
    stop = later(NUDGE_MS, nudge);
    await nextTap();
    stop();
    put({ action: null });
  };

  // A station where the child does something starts with a tap that walks there, unless the child already tapped its
  // way at a fork (`picked`). The child walks on to an obstacle or a fork by itself: a tap that only walks is no fun.
  const pickup = async (station: Pickup, picked: boolean) => {
    if (!picked) await go(nextOf(station));
    await walkTo(station.x);
    say(station.ask);
    // The child takes the thing, holds it up high and puts it into the backpack.
    kid({ pose: "take" });
    sound(station.sound);
    put((v) => ({ done: [...v.done, station.id], carry: station.item }));
    drawCarry(station.at, natural(ITEMS[station.item]), false);
    await moveCarry(byKid(HAND_OUT), 450, 1);
    await packAway(station.item, viewRef.current.bag.indexOf(null));
    say(station.done);
    await wait(200);
  };

  const nextChoice = () => new Promise<number>((resolve) => (chooser.current = resolve));

  /** The friend's picture rises out of the backpack on the screen, and the friend barks and runs off to `to` to help. */
  const sendFriend = async (slot: number, to: Point, pose: FriendPose) => {
    const f = viewRef.current.friend!;
    put((v) => ({ leaving: slot, bagBump: v.bagBump + 1 }));
    sound(playPop);
    await wait(320);
    put((v) => ({ leaving: null, bag: v.bag.map((thing, i) => (i === slot ? null : thing)) }));
    kid({ pose: "reach" });
    hopFriend();
    sound(FRIENDS[f.id]!.sound);
    await wait(400);
    await runFriend(to, pose);
  };

  /** The friend runs back behind the child; its picture drops into the backpack again at `slot`. */
  const friendBack = async (slot: number | null) => {
    await runFriend(onGround(along.current - FRIEND_GAP));
    if (slot === null) return;
    const id = viewRef.current.friend!.id;
    put((v) => ({ bag: v.bag.map((thing, i) => (i === slot ? id : thing)), entering: slot, bagBump: v.bagBump + 1 }));
    sound(playPop);
    await wait(500);
    put({ entering: null });
  };

  /** The creature just helped joins (G-10): in its place the friend hops and calls, its picture drops into the
   * backpack, and it runs round behind the child. */
  const befriend = async ({ friend: id, from, say: line }: NonNullable<Obstacle["befriends"]>) => {
    put({ friend: { id, x: from[0], y: from[1], ms: 0, face: -1, pose: "sit", hop: 1 } });
    sound(FRIENDS[id]!.sound);
    say(line);
    kid({ pose: "cheer" });
    await wait(600);
    const slot = viewRef.current.bag.indexOf(null);
    put((v) => ({ bag: v.bag.map((thing, i) => (i === slot ? id : thing)), entering: slot, bagBump: v.bagBump + 1 }));
    sound(playPop);
    await wait(500);
    put({ entering: null });
    kid({ pose: "stand" });
    await runFriend(onGround(along.current - FRIEND_GAP));
  };

  const obstacle = async (station: Obstacle) => {
    await walkTo(station.x);
    // Why a thing helps: the creature thinks of what it wants, or the child of what would happen.
    const { why } = station;
    const bubble = "wants" in why ? { picture: ITEMS[station.need], at: why.wants, nudge: 0 } : { picture: WORRIES[why.worry], at: null, nudge: 0 };
    put({ here: station.id, choosing: true, shake: viewRef.current.shake + 1, bubble });
    cue(station.meet);
    say(station.ask);
    /** A friend helped, instead of a thing: it runs back once its job is done. */
    let helped = false;
    for (;;) {
      let stop = () => {};
      const nudge = () => {
        put((v) => ({ hint: station.need, shake: v.shake + 1, bubble: v.bubble && { ...v.bubble, nudge: v.bubble.nudge + 1 } }));
        say(station.ask);
        stop = later(NUDGE_MS, nudge);
      };
      stop = later(NUDGE_MS, nudge);
      unqueue();
      const slot = await nextChoice();
      stop();
      const item = viewRef.current.bag[slot]!;
      put({ choosing: false, hint: null });
      if (item === viewRef.current.friend?.id) {
        // The friend runs over: it does the job itself, or tries, gets a funny "no" and comes back.
        const right = item === station.need;
        await sendFriend(slot, [station.at[0], viewRef.current.kid.y], right ? "work" : "sit");
        if (right) {
          helped = true;
          break;
        }
        put((v) => ({ nope: { id: station.id, n: (v.nope?.n ?? 0) + 1 } }));
        sound(station.nope);
        kid({ pose: "shake" });
        hopFriend();
        await wait(1000);
        kid({ pose: "stand" });
        await friendBack(slot);
        put({ nope: null, hint: station.need, choosing: true });
        continue;
      }
      // Out of the backpack, up high, and over to the obstacle.
      await takeOut(item, slot);
      kid({ pose: "take" });
      await moveCarry(station.at, FLY_MS, natural(ITEMS[item]), 50);
      if (item === station.need) break;
      // Not this one: something funny happens, the thing comes back into the backpack and the right one glows.
      put((v) => ({ nope: { id: station.id, n: (v.nope?.n ?? 0) + 1 } }));
      sound(station.nope);
      kid({ pose: "shake" });
      await wait(1000);
      kid({ pose: "take" });
      await moveCarry(byKid(HAND_OUT), 500, 1, 50);
      await packAway(item, slot);
      put({ nope: null, hint: station.need, choosing: true });
    }
    put((v) => ({
      carry: station.float ? v.carry : null,
      done: station.float ? v.done : [...v.done, station.id],
      bubble: null,
      wear: station.wear ?? v.wear,
    }));
    cue(station.sounds);
    say(station.done);
    if (station.float) await float(station.float, station.id);
    await wait(500);
    kid({ pose: "cheer" });
    await wait(Math.max(0, station.ms - 500));
    if (helped) await friendBack(null);
    if (station.befriends) await befriend(station.befriends);
    if (station.frees) {
      kid({ pose: "reach" });
      await moveGoal(heldOf(viewRef.current.kid, theGoal), 1200, null, onString ? 30 : 0);
      if (onString) drawGoal(goal.current.at, handOf(viewRef.current.kid));
    } else kid({ pose: "stand" });
    put({ here: null });
  };

  /** The child holds the thing up (the open umbrella) and floats down slowly by itself, the thing going along; then it
   * puts the thing down where the level's drawing shows it (stuck into the raft), and the station is done. */
  const float = async ({ to, put: down }: NonNullable<Obstacle["float"]>, id: string) => {
    const k0 = viewRef.current.kid;
    const [hx, hy] = carried.current.at;
    const held: Point = [hx - k0.x, hy - k0.y];
    kid({ pose: "lift" });
    await wait(400);
    for (const point of to) {
      const [x, y] = place(point);
      along.current = point[0];
      const k = viewRef.current.kid;
      const ms = Math.hypot(x - k.x, y - k.y) * FLOAT_MS;
      kid({ x, y, walk: ms });
      void moveCarry([x + held[0], y + held[1]], ms, carried.current.s, 0, true);
      await wait(ms);
    }
    kid({ walk: 0, pose: "take" });
    await moveCarry(byKid(down), 600);
    put((v) => ({ carry: null, done: [...v.done, id] }));
    kid({ pose: "stand" });
  };

  /** One tap walks to the stairs and climbs all of them; a note per step. */
  const climb = async (station: Climb, picked: boolean) => {
    const { steps } = station;
    if (!picked) await go(nextOf(station));
    await walkTo(station.x);
    say(station.ask);
    for (const [i, step] of steps.entries()) {
      const [x, y] = place(step);
      along.current = step[0];
      kid({ x, y, walk: STEP_MS, pose: "walk" });
      sound(() => playCountNote(i));
      await wait(STEP_MS);
      kid({ walk: 0, pose: "stand" });
    }
    if (station.slide) {
      // Down the slide by itself: "Huiii!" – on the sled, if there is one. A friend, who waited at the bottom, runs along below.
      sound(playSlide);
      if (station.sled) put({ here: station.id, riding: station.sled });
      kid({ pose: station.sled ? "sit" : "cheer" });
      const { slide } = station;
      const from = [steps[steps.length - 1], ...slide].map(place);
      const slideMs = slide.map(place).reduce((sum, [x, y], i) => sum + Math.hypot(x - from[i][0], y - from[i][1]) * SLIDE_MS, 0);
      friendTo(onGround(slide[slide.length - 1][0] - FRIEND_GAP), slideMs);
      for (const point of slide) {
        const k = viewRef.current.kid;
        const [x, y] = place(point);
        along.current = point[0];
        const ms = Math.hypot(x - k.x, y - k.y) * SLIDE_MS;
        kid({ x, y, walk: ms });
        await wait(ms);
      }
      if (station.sled) put((v) => ({ here: null, riding: null, done: [...v.done, station.id] }));
      kid({ walk: 0, pose: "cheer" });
      friendStays();
      sound(playGiggle);
      await wait(700);
      kid({ pose: "stand" });
    }
    say(station.done);
  };

  /** The child gets there and something happens by itself (the light turns green); the walk was the tap. */
  const moment = async (station: Moment, picked: boolean) => {
    if (!picked) await go(nextOf(station));
    await walkTo(station.x);
    put({ here: station.id });
    kid({ pose: station.pose });
    cue(station.sounds);
    say(station.ask);
    await wait(700);
    kid({ pose: "stand" });
    await wait(Math.max(0, station.ms - 700));
    put((v) => ({ done: [...v.done, station.id], here: null }));
    kid({ pose: "cheer" });
    say(station.done);
    await wait(900);
    kid({ pose: "stand" });
  };

  const station = (s: Station, picked = false) => {
    if (s.kind === "pickup") return pickup(s, picked);
    if (s.kind === "obstacle") return obstacle(s);
    if (s.kind === "moment") return moment(s, picked);
    return climb(s, picked);
  };

  /** Two ways: the child walks to the fork by itself, then both ways show where they go first (footprints to a ghost
   * each) and the child taps a sign (or 1 / 2). The picked way's stations follow, starting right away. */
  const fork = async (at: Fork) => {
    await walkTo(at.x);
    unqueue();
    put({ here: at.id, fork: { id: at.id, ways: at.ways.map((way) => nextOf(way.stations[0], way.ground ?? ground.current)), nudge: 0 } });
    say(at.ask);
    let stop = () => {};
    const nudge = () => {
      put((v) => ({ fork: v.fork && { ...v.fork, nudge: v.fork.nudge + 1 } }));
      say(at.ask);
      stop = later(NUDGE_MS, nudge);
    };
    stop = later(NUDGE_MS, nudge);
    const way: Way = at.ways[await new Promise<number>((resolve) => (picker.current = resolve))];
    stop();
    put((v) => ({ fork: null, here: null, done: [...v.done, at.id, way.id] }));
    if (way.ground) ground.current = way.ground;
    sound(playPop);
    say(way.say);
    for (const [i, s] of way.stations.entries()) await station(s, i === 0);
  };

  const funBurst = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
    },
    [spawn, settings.sounds],
  );

  const play = async () => {
    const k = viewRef.current.kid;
    drawGoal(heldOf(k, theGoal), onString ? handOf(k) : null);
    kid({ pose: level.away.pose });
    await wait(900);
    cue(level.away.sounds);
    kid({ pose: "shake" });
    put({ away: true });
    await flyGoal(level.away, null);
    put({ away: false });
    kid({ pose: "stand" });
    put({ bubble: { picture: theGoal, at: null, nudge: 0 } });
    say(level.away.say);
    await wait(1800);
    put({ bubble: null });
    for (const s of level.stations) await (s.kind === "fork" ? fork(s) : station(s));
    // The goal is back in the child's hands: up it goes.
    put({ party: true });
    sound(playMelody);
    say(level.finale.say);
    for (let i = 0; i < 8; i++) later(i * 250, () => spawn());
    const finaleMs = level.finale.ms + (level.finale.via ?? []).reduce((sum, [, ms]) => sum + ms, 0);
    await flyGoal(level.finale, onString ? handOf(viewRef.current.kid) : null);
    const { into } = level.finale;
    if (into) put((v) => ({ done: [...v.done, into] }));
    await wait(Math.max(0, END_MS - finaleMs));
    put({ picking: true });
  };

  useEffect(() => {
    void play();
  }, []);

  /** A slot of the bag was tapped: the thing in it is used, or it just bounces. */
  const pressSlot = (slot: number) => (e: PointerEvent) => {
    e.stopPropagation();
    const v = viewRef.current;
    const pick = chooser.current;
    if (pick && v.bag[slot]) {
      chooser.current = null;
      pick(slot);
    } else if (tapper.current) {
      spawn(e.clientX, e.clientY);
      tap();
    } else funBurst(e.clientX, e.clientY);
  };

  /** A creature's bubble was tapped while the bag is open: it shows the thing it wants, so that thing is given, just
   * as if its slot in the backpack (or the friend) had been tapped. Otherwise the tap goes on to the picture. */
  const tapBubble = (e: PointerEvent) => {
    const pick = chooser.current;
    const here = allStations(level).find((s) => s.id === viewRef.current.here);
    const slot = here?.kind === "obstacle" ? viewRef.current.bag.indexOf(here.need) : -1;
    if (!pick || slot < 0) return;
    e.stopPropagation();
    chooser.current = null;
    spawn(e.clientX, e.clientY);
    pick(slot);
  };

  /** While the bag is open, a tap elsewhere or another key shows which thing helps; at a fork the signs hop. */
  const showHint = () => {
    if (viewRef.current.fork) return put((v) => ({ fork: v.fork && { ...v.fork, nudge: v.fork.nudge + 1 } }));
    const here = allStations(level).find((s) => s.id === viewRef.current.here);
    if (here?.kind === "obstacle") put((v) => ({ hint: here.need, shake: v.shake + 1, bubble: v.bubble && { ...v.bubble, nudge: v.bubble.nudge + 1 } }));
  };

  /** A way was picked at a fork: by its sign, its ghost, or the key 1 / 2. */
  const pickWay = (way: number) => {
    const pick = picker.current;
    picker.current = null;
    pick?.(way);
  };

  const pressWay = (way: number) => (e: PointerEvent) => {
    if (!picker.current) return;
    e.stopPropagation();
    spawn(e.clientX, e.clientY);
    pickWay(way);
  };

  /** The friend was tapped: while the bag is open it is picked like its picture, otherwise it hops and calls. */
  const tapFriend = (e: PointerEvent) => {
    e.stopPropagation();
    const v = viewRef.current;
    if (!v.friend) return;
    const slot = v.bag.indexOf(v.friend.id);
    const pick = chooser.current;
    if (pick && slot >= 0) {
      chooser.current = null;
      spawn(e.clientX, e.clientY);
      return pick(slot);
    }
    if (tapper.current) {
      spawn(e.clientX, e.clientY);
      return tap();
    }
    if (pick || picker.current) showHint();
    if (v.friend.ms) return;
    hopFriend();
    sound(FRIENDS[v.friend.id]!.sound);
  };

  const tapKid = (e: PointerEvent) => {
    e.stopPropagation();
    if (tapper.current) return tap();
    const k = viewRef.current.kid;
    // Not while walking, nor while the child carries a thing: the thing would stay behind in the air. The tap is
    // kept for the next walk instead.
    if (k.walk || viewRef.current.carry) {
      if (busy()) queue();
      return;
    }
    kid({ hop: k.hop + 1 });
    sound(playGiggle);
  };

  // Any key goes on when the action button lights up (the space bar is the one shown on it); 1–3 take a thing out
  // of the open bag; any key at the end goes on to the next story.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      setHeld(e.key);
      const v = viewRef.current;
      if (v.picking) {
        onPick(nextCard(level.id).id);
        return;
      }
      if (tapper.current) return tap();
      if (busy()) queue();
      const way = Number(e.key) - 1;
      if (picker.current && (way === 0 || way === 1)) return pickWay(way);
      const pick = chooser.current;
      const slot = Number(e.key) - 1;
      if (pick && slot >= 0 && slot < SLOT_COUNT && v.bag[slot]) {
        chooser.current = null;
        pick(slot);
      } else {
        if (pick || picker.current) showHint();
        funBurst();
      }
    };
    const onKeyUp = () => setHeld(null);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  });

  const { kid: k } = view;
  const carry = view.carry && <Fitted picture={ITEMS[view.carry]} width={CARRY} />;
  const next = view.action?.next;
  /** Where the next tap may take the child: one way, or both at a fork. */
  const shown = next ? [next] : (view.fork?.ways ?? []);
  /** Bumped by the reminders: the footprints, the ghost and the ring come again. */
  const again = view.action?.nudge ?? 0;
  /** The free place in the backpack where the next thing goes, when the next tap picks one up. */
  const nextItem = next?.at ? itemOf(next.icon) : null;
  const packing = nextItem ? { item: nextItem, slot: view.bag.indexOf(null) } : null;
  const forks = level.stations.filter((s): s is Fork => s.kind === "fork");
  const { bagBox, slots, action, actionBox, corner, feet, zoom } = layoutHud(screen, !touchOnly);
  const [bx, , bw] = bagBox;
  const handle = `M${bx + bw / 2 - 58} ${BAG_TOP + 14} Q${bx + bw / 2 - 58} ${BAG_TOP - 38} ${bx + bw / 2} ${BAG_TOP - 38} Q${bx + bw / 2 + 58} ${BAG_TOP - 38} ${bx + bw / 2 + 58} ${BAG_TOP + 14}`;
  const [cx, cy] = camOf(k);
  /** Puts the picture's `KID_AT` where the HUD wants the child's feet, zoomed; a world going up keeps the picture. */
  const stage = level.turns ? undefined : `translate(${feet[0]} ${feet[1]}) scale(${zoom}) translate(${-KID_AT[0]} ${-KID_AT[1]})`;
  const pan = (depth: number): CSSProperties => ({ transform: `translate(${-cx * depth}px, ${-cy * depth}px)`, transitionDuration: `${k.walk}ms` });
  const { Scenery, Front, Backdrop } = level;
  const friends = view.friend ? [view.friend.id] : [];
  const Friend = view.friend && FRIENDS[view.friend.id];
  const Thief = level.away.thief;
  const Sled = view.riding;
  // While the child picks from the bag at an obstacle, the thing that helps is the right one to tap.
  const stop = view.choosing ? allStations(level).find((s) => s.id === view.here) : undefined;
  const need = stop?.kind === "obstacle" ? stop.need : null;
  // Where the goal is drawn before the script moves it: in the hands at the start. React sets these
  // once; after that the script moves goal and string by itself.
  const [startHand, startHeld] = [handOf(startView(level).kid), heldOf(startView(level).kid, theGoal)];
  const firstGoal = `translate(${startHeld[0]} ${startHeld[1]})`;
  const firstString = { x1: startHand[0], y1: startHand[1], x2: startHeld[0], y2: startHeld[1], display: onString ? undefined : "none" };

  return (
    <div
      ref={playEl}
      className="tl-play"
      onPointerDown={(e) => {
        if (tapper.current) {
          spawn(e.clientX, e.clientY);
          return tap();
        }
        if (busy()) queue();
        if (chooser.current || picker.current) showHint();
        funBurst(e.clientX, e.clientY);
      }}
    >
      <div ref={safeEl} className="tl-safe" />
      <svg ref={svgEl} className="el-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
        <g transform={stage}>
          <g className="tl-pan" style={pan(FAR)}>
            <Backdrop />
          </g>
          <g className="tl-pan" style={pan(1)}>
            <Scenery done={view.done} here={view.here} nope={view.nope} party={view.party} friends={friends} />
            <line ref={stringEl} className="tl-string" stroke={INK} strokeWidth="3" {...firstString} />
            <g ref={goalEl} className="tl-goal" transform={firstGoal} display={level.finale.into && view.done.includes(level.finale.into) ? "none" : undefined}>
              {view.away && Thief && (
                <g className="tl-thief">
                  <Thief />
                </g>
              )}
              <g className={view.party && onString ? "tl-sway" : undefined}>
                <g ref={spinEl}>{(theGoal.world ?? theGoal.draw)()}</g>
              </g>
            </g>
            {Front && <Front done={view.done} here={view.here} nope={view.nope} party={view.party} friends={friends} />}
            {/* The friend walking along, behind the child */}
            {view.friend && Friend && (
              <g className="tl-walker" style={{ transform: `translate(${view.friend.x}px, ${view.friend.y}px)`, transitionDuration: `${view.friend.ms}ms` }}>
                <g transform={view.friend.face < 0 ? "scale(-1 1)" : undefined}>
                  <g className={view.party ? "tl-friend-party" : undefined}>
                    <g
                      className={view.friend.hop ? `el-hopper hop-${view.friend.hop % 2}` : "el-hopper"}
                      data-tap={tapState({ goal: need === view.friend.id })}
                      onPointerDown={tapFriend}
                    >
                      <Friend.Body pose={view.friend.pose} />
                    </g>
                  </g>
                </g>
              </g>
            )}
            {shown.map((n, w) => (
              <g key={`${n.ghost}-${again}`} className="tl-next">
                {n.at && itemOf(n.icon) && <WantRing at={n.at} r={ringOf(ITEMS[itemOf(n.icon)!])} />}
                {n.prints.map(([x, y], i) => (
                  <ellipse
                    key={`${x}-${y}`}
                    className="tl-print"
                    cx={x + (i % 2 ? 6 : -6)}
                    cy={y - 4}
                    rx="18"
                    ry="7"
                    style={{ animationDelay: `${i * 90}ms` }}
                  />
                ))}
                <g transform={`translate(${n.ghost[0]} ${n.ghost[1]})`} className={view.fork ? "tl-way-ghost" : undefined} data-tap onPointerDown={pressWay(w)}>
                  <g className="tl-ghost" style={{ animationDelay: `${n.prints.length * 90}ms` }}>
                    {raft && afloat(n.ghost[0]) && <raft.Raft paddling={false} done={view.done} />}
                    <Kid look={HERO} pose={n.pose} holding={null} wear={view.wear} face={n.face} backpack={PACK_SHUT} />
                  </g>
                </g>
              </g>
            ))}
            {/* The picture signs of the ways at a fork: always there; while the child picks a way they hop and glow */}
            {forks.flatMap((f) =>
              f.ways.map(({ id, Sign, sign: [x, y], say: wayName }, w) => {
                const on = view.fork?.id === f.id;
                return (
                  <g
                    key={`${id}-${on ? view.fork?.nudge : "off"}`}
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
            {/* The raft stays behind where the child got off */}
            {raft && !afloat(k.x) && (
              <g transform={`translate(${raft.until} ${groundY(level.ground, raft.until)})`}>
                <raft.Raft paddling={false} done={view.done} />
              </g>
            )}
            <g ref={carryBack} className="tl-carry">
              {carry}
            </g>
            <g className="tl-walker" style={{ transform: `translate(${k.x}px, ${k.y}px)`, transitionDuration: `${k.walk}ms` }}>
              {raft && afloat(k.x) && <raft.Raft paddling={k.pose === "paddle"} done={view.done} />}
              {Sled && <Sled />}
              <g className={k.hop ? `el-hopper hop-${k.hop % 2}` : "el-hopper"} data-tap onPointerDown={tapKid}>
                <Kid look={HERO} pose={k.pose} holding={null} wear={view.wear} face={k.face} backpack={view.pack} />
              </g>
              {view.bubble && !view.bubble.at && <ThoughtBubble picture={view.bubble.picture} height={KID_H} nudge={view.bubble.nudge} />}
            </g>
            <g ref={carryFront} className="tl-carry">
              {carry}
            </g>
            {view.bubble?.at && (
              <g
                transform={`translate(${view.bubble.at[0]} ${view.bubble.at[1]})`}
                data-tap={view.choosing ? tapState({ goal: true }) : undefined}
                onPointerDown={tapBubble}
              >
                <ThoughtBubble picture={view.bubble.picture} height={0} nudge={view.bubble.nudge} right={view.bubble.at[0] >= k.x} />
              </g>
            )}
          </g>
        </g>

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
        {view.party && (
          <g transform={`scale(${VIEW_W / 1400} 1)`}>
            <Confetti />
          </g>
        )}
      </svg>

      {view.picking && <StoryEnd id={level.id} onPick={onPick} />}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
