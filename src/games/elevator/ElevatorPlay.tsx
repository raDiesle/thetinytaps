import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import {
  loadRecordings,
  playDing,
  playGiggle,
  playKnock,
  playLift,
  playLullaby,
  playMelody,
  playRandomNote,
  playSlide,
  setSfxVolume,
} from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { STORIES, RECORDINGS, texts, type Step, type Story, type Who } from "./content";
import { Backdrop, Buttons, CabinBack, CabinFront, Confetti, Hint, Shaft, Shell, Slabs } from "./house";
import { BROTHER, Bubble, HERO, KID_H, Kid, PICTURES, type Holding, type Outfit, type PicId, type Pose } from "./kid";
import { CABIN_L, FLOORS, IN_CABIN, ROOM_H, ROOM_L, ROOM_R, VIEW_H, VIEW_W, floorLine } from "./layout";
import { WeatherContext } from "./rooms";
import type { ElevatorSettings } from "./settings";

/** Time the lift takes per floor. */
const FLOOR_MS = 1200;
/** Time the doors take to open or close. */
const DOOR_MS = 700;
/** Walking time per SVG unit. */
const WALK_MS = 2.6;
/** While waiting for the right button: the bubble pops up again, and the first time the room starts to glow. */
const NUDGE_MS = 7000;
/** From the end of a story until the picture cards come back. */
const END_MS = 5000;
/** Calm mode: everything a bit slower. */
const CALM_PACE = 1.35;
const BUDDY_SCALE = 0.8;

interface Actor {
  floor: number;
  x: number;
  /** Length of the current walk in ms; 0 while standing. */
  walk: number;
  pose: Pose;
  face: 1 | -1;
  holding: Holding | null;
  wear: Outfit[];
  /** In the bathtub or the bed. */
  hidden: boolean;
  /** Rides along with the cabin. */
  inCabin: boolean;
  /** The brother comes along. */
  joined: boolean;
  /** Bumped to make it hop when tapped. */
  hop: number;
}

interface View {
  story: Story | null;
  /** The picture cards to choose a story are shown. */
  picking: boolean;
  cabin: number;
  /** Length of the current ride, for the cabin's and the riders' transition. */
  ride: number;
  doors: boolean;
  actors: Record<Who, Actor | null>;
  bubble: { who: Who; pic: PicId; n: number } | null;
  playing: string | null;
  used: string[];
  hint: number | null;
  lit: number | null;
  night: boolean;
  /** The rain has stopped. */
  cleared: boolean;
  party: boolean;
}

const START: View = {
  story: null,
  picking: true,
  cabin: 0,
  ride: 0,
  doors: true,
  actors: { hero: null, buddy: null },
  bubble: null,
  playing: null,
  used: [],
  hint: null,
  lit: null,
  night: false,
  cleared: false,
  party: false,
};

const actorAt = (floor: number, x: number, face: 1 | -1, pose: Pose): Actor => ({
  floor,
  x,
  walk: 0,
  pose,
  face,
  holding: null,
  wear: [],
  hidden: false,
  inCabin: false,
  joined: false,
  hop: 0,
});

/** "Aufzug": picture stories – the bubble shows what the child needs, and the lift takes it to the floor where it is. */
export function ElevatorPlay({ lang, settings }: { lang: string; settings: ElevatorSettings }) {
  const pace = settings.calm ? CALM_PACE : 1;
  const [view, setView] = useState<View>(START);
  const viewRef = useRef<View>(START);
  const { bursts, spawn } = useBursts();

  // A story is a script of waits; starting another one (or leaving) bumps the generation and drops its timers.
  const generation = useRef(0);
  const timers = useRef(new Set<number>());
  /** Set while the script waits for a button: it gets the floor. */
  const waiter = useRef<((floor: number) => void) | null>(null);

  const put = useCallback((change: Partial<View> | ((v: View) => Partial<View>)) => {
    const patch = typeof change === "function" ? change(viewRef.current) : change;
    viewRef.current = { ...viewRef.current, ...patch };
    setView(viewRef.current);
  }, []);

  const actor = (who: Who, patch: Partial<Actor>) =>
    put((v) => {
      const current = v.actors[who];
      return current ? { actors: { ...v.actors, [who]: { ...current, ...patch } } } : {};
    });

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

  /** Resolves after `ms`; never, if another story starts meanwhile, so the old script just stops. */
  const wait = (ms: number) => new Promise<void>((resolve) => later(ms, resolve));

  const cancel = () => {
    generation.current++;
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    waiter.current = null;
  };

  useEffect(() => cancel, []);

  useEffect(() => {
    setSfxVolume(settings.calm ? 0.4 : 1);
  }, [settings.calm]);

  useEffect(() => {
    if (settings.sounds) loadRecordings(RECORDINGS);
  }, [settings.sounds]);

  const say = (text: string) => {
    if (settings.speech) speak(text, lang, { rate: settings.calm ? 0.75 : 0.85 });
  };

  const sound = (play: () => void) => {
    if (settings.sounds) play();
  };

  const cue = (sounds: [number, () => void][]) => sounds.forEach(([ms, play]) => later(ms * pace, () => sound(play)));

  const showBubble = (who: Who, pic: PicId) => put((v) => ({ bubble: { who, pic, n: (v.bubble?.n ?? 0) + 1 } }));

  /** Walks a child to `x` on its floor. */
  const walk = async (who: Who, x: number) => {
    const a = viewRef.current.actors[who];
    if (!a) return;
    const ms = Math.abs(x - a.x) * WALK_MS * pace;
    if (ms < 1) return;
    actor(who, { x, walk: ms, pose: "walk", face: x > a.x ? 1 : -1, inCabin: false });
    await wait(ms);
    actor(who, { walk: 0, pose: "stand", inCabin: x >= CABIN_L });
  };

  /** Doors shut, the lift goes to `target` with everyone in it, "Pling", doors open. */
  const ride = async (target: number) => {
    put({ doors: false, lit: target });
    sound(playSlide);
    await wait(DOOR_MS * pace);
    const from = viewRef.current.cabin;
    const ms = Math.abs(target - from) * FLOOR_MS * pace;
    put((v) => ({
      cabin: target,
      ride: ms,
      actors: {
        hero: v.actors.hero?.inCabin ? { ...v.actors.hero, floor: target } : v.actors.hero,
        buddy: v.actors.buddy?.inCabin ? { ...v.actors.buddy, floor: target } : v.actors.buddy,
      },
    }));
    sound(() => playLift(ms / 1000, target > from));
    await wait(ms);
    put({ lit: null, doors: true });
    sound(playDing);
    later(150, () => sound(playSlide));
    await wait(DOOR_MS * pace);
  };

  const nextPress = () => new Promise<number>((resolve) => (waiter.current = resolve));

  /** Shows the wish and waits until the child has brought the lift to the floor where it is. */
  const reach = async (step: Step) => {
    const who = step.who ?? "hero";
    showBubble(who, step.wish);
    say(step.ask);
    for (;;) {
      const stopNudging = (() => {
        let stop = () => {};
        const nudge = () => {
          showBubble(who, step.wish);
          put({ hint: step.floor });
          stop = later(NUDGE_MS * pace, nudge);
        };
        stop = later(NUDGE_MS * pace, nudge);
        return () => stop();
      })();
      const floor = await nextPress();
      stopNudging();
      if (floor === step.floor && floor === viewRef.current.cabin) return;
      if (floor !== viewRef.current.cabin) {
        sound(() => playKnock(1500));
        await ride(floor);
        if (floor === step.floor) return;
      }
      // Wrong floor: the child looks out, shakes its head and thinks of the wish again.
      actor(who, { pose: "shake" });
      say(texts.wrong);
      await wait(1100);
      actor(who, { pose: "stand" });
      showBubble(who, step.wish);
      put({ hint: step.floor });
    }
  };

  const doStep = async (step: Step, last: boolean) => {
    const who = step.who ?? "hero";
    const other: Who = who === "hero" ? "buddy" : "hero";
    await reach(step);
    put({ bubble: null, hint: null });
    const otherComes = viewRef.current.actors[other]?.inCabin;
    await Promise.all([walk(who, step.spot), otherComes ? walk(other, step.otherSpot ?? step.spot + step.face * -110) : undefined]);

    actor(who, {
      pose: step.pose,
      face: step.face,
      hidden: !!step.hide,
      ...(step.hold !== undefined && { holding: step.hold }),
    });
    if (viewRef.current.actors[other] && (otherComes || step.otherPose)) {
      actor(other, {
        pose: step.otherPose ?? "stand",
        face: step.otherFace ?? viewRef.current.actors[other]!.face,
        ...(step.otherHold !== undefined && { holding: step.otherHold }),
      });
    }
    put({ playing: step.prop });
    cue(step.sounds);
    say(step.done);
    await wait(step.ms * pace);
    if (last) return;

    put((v) => ({ playing: null, used: [...v.used, step.prop] }));
    const a = viewRef.current.actors[who]!;
    actor(who, {
      pose: "stand",
      hidden: false,
      ...(step.carry !== undefined && { holding: step.carry }),
      ...(step.wear && { wear: [...a.wear, step.wear] }),
    });
    const o = viewRef.current.actors[other];
    if (o) {
      actor(other, {
        pose: o.pose === "build" && !step.joins ? "build" : "stand",
        joined: o.joined || !!step.joins,
        ...(step.otherCarry !== undefined && { holding: step.otherCarry }),
      });
    }
    await wait(500 * pace);
    const withOther = other === "hero" || viewRef.current.actors[other]?.joined;
    await Promise.all([walk(who, IN_CABIN[who]), withOther ? walk(other, IN_CABIN[other]) : undefined]);
  };

  const finish = async (story: Story) => {
    const last = story.steps[story.steps.length - 1];
    if (story.ending === "sleep") {
      put((v) => ({ used: [...v.used, last.prop], night: true }));
      sound(playLullaby);
      say(texts.sleep);
    } else {
      put({ party: true, cleared: true });
      sound(playMelody);
      say(texts.party);
      for (let i = 0; i < 8; i++) later(i * 250, () => spawn());
      later(1200 * pace, () => {
        put((v) => ({ playing: null, used: [...v.used, last.prop] }));
        (["hero", "buddy"] as Who[]).forEach((who) => actor(who, { pose: "cheer", hidden: false }));
      });
    }
    await wait(END_MS * pace);
    put({ picking: true });
  };

  const play = async (story: Story) => {
    cancel();
    const hero = actorAt(story.start, story.startX, -1, "stand");
    const buddy = story.buddy ? actorAt(story.buddy.floor, story.buddy.x, story.buddy.face, story.buddy.pose) : null;
    put({ ...START, picking: false, story, cabin: story.start, actors: { hero, buddy } });
    await wait(700);
    actor("hero", { pose: story.need.pose });
    showBubble("hero", story.need.pic);
    cue(story.need.sounds);
    say(story.need.say);
    await wait(2800 * pace);
    actor("hero", { pose: "stand" });
    await walk("hero", IN_CABIN.hero);
    for (const [i, step] of story.steps.entries()) await doStep(step, i === story.steps.length - 1);
    await finish(story);
  };

  /** A floor button or a room was tapped. */
  const press = (floor: number) => {
    if (floor < 0 || floor >= FLOORS || !viewRef.current.story || viewRef.current.picking) return;
    const resolve = waiter.current;
    if (resolve) {
      waiter.current = null;
      resolve(floor);
    } else sound(() => playKnock(1500));
  };

  const tapKid = (who: Who) => (e: PointerEvent) => {
    e.stopPropagation();
    const a = viewRef.current.actors[who];
    if (!a || a.walk) return;
    actor(who, { hop: a.hop + 1 });
    sound(playGiggle);
  };

  const funBurst = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
    },
    [spawn, settings.sounds],
  );

  // 1–4 fetch the lift (or pick a story on the cards), arrows ride one floor up or down, any other key makes a burst.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      const digit = Number(e.key);
      const v = viewRef.current;
      if (v.picking) {
        if (Number.isInteger(digit) && digit >= 1 && digit <= STORIES.length) void play(STORIES[digit - 1]);
        else if (e.key === "Enter" || e.key === " ") void play(STORIES[0]);
        else funBurst();
        return;
      }
      if (Number.isInteger(digit) && digit >= 1 && digit <= FLOORS) press(digit - 1);
      else if (e.key === "ArrowUp") press(Math.min(FLOORS - 1, v.cabin + 1));
      else if (e.key === "ArrowDown") press(Math.max(0, v.cabin - 1));
      else funBurst();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const { story, actors, bubble } = view;
  const weather = story ? (story.weather === "rain" && view.cleared ? "day" : story.weather) : "day";
  const kids: Who[] = ["buddy", "hero"];

  /** The floor and walking position of a child, as two nested moving groups. */
  const place = (a: Actor) => ({
    outer: { transform: `translateY(${floorLine(a.floor)}px)`, transitionDuration: `${view.ride}ms` } as CSSProperties,
    inner: { transform: `translateX(${a.x}px)`, transitionDuration: `${a.walk}ms` } as CSSProperties,
  });

  return (
    <div
      className={`elevator-play weather-${weather}${settings.calm ? " calm" : ""}`}
      onPointerDown={(e) => funBurst(e.clientX, e.clientY)}
    >
      <svg className="el-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
        <WeatherContext.Provider value={weather}>
          <Backdrop weather={weather} />
          {story && (
            <>
              <Shell />
              {story.rooms.map((Room, f) => (
                <g key={`${story.id}${f}`} transform={`translate(0 ${floorLine(f)})`}>
                  <clipPath id={`el-room-${f}`}>
                    <rect x={ROOM_L} y={-ROOM_H} width={ROOM_R - ROOM_L} height={ROOM_H} />
                  </clipPath>
                  <g clipPath={`url(#el-room-${f})`}>
                    <Room playing={view.playing} used={view.used} />
                  </g>
                </g>
              ))}
              <Slabs />
              <Shaft />
              <CabinBack floor={view.cabin} ride={view.ride} />
              <Buttons lit={view.lit} hint={view.hint} onPress={press} />
              {view.hint !== null && <Hint floor={view.hint} />}
              {kids.map((who) => {
                const a = actors[who];
                if (!a || a.hidden) return null;
                const { outer, inner } = place(a);
                return (
                  <g key={who} className="el-ride" style={outer}>
                    <g className="el-walker" style={inner}>
                      <g className={a.hop ? `el-hopper hop-${a.hop % 2}` : "el-hopper"} onPointerDown={tapKid(who)}>
                        <g transform={who === "buddy" ? `scale(${BUDDY_SCALE})` : undefined}>
                          <Kid look={who === "hero" ? HERO : BROTHER} pose={a.pose} holding={a.holding} wear={a.wear} face={a.face} />
                        </g>
                      </g>
                    </g>
                  </g>
                );
              })}
              <CabinFront floor={view.cabin} ride={view.ride} open={view.doors} />
              {bubble && actors[bubble.who] && !actors[bubble.who]!.hidden && (
                <g className="el-ride" style={place(actors[bubble.who]!).outer}>
                  <g className="el-walker" style={place(actors[bubble.who]!).inner}>
                    <Bubble key={bubble.n} pic={bubble.pic} height={KID_H * (bubble.who === "buddy" ? BUDDY_SCALE : 1)} />
                  </g>
                </g>
              )}
              <rect
                className={`el-night${view.night ? " on" : ""}`}
                x="-4000"
                y="-4000"
                width={VIEW_W + 8000}
                height={VIEW_H + 8000}
                fill="#0b1340"
              />
              {view.party && <Confetti />}
            </>
          )}
        </WeatherContext.Provider>
      </svg>

      {view.picking && (
        <div className={`el-picker${story ? " again" : ""}`}>
          {STORIES.map((s, i) => {
            const { w, h, draw } = PICTURES[s.icon];
            const scale = Math.min(200 / w, 150 / h);
            return (
              <button
                key={s.id}
                type="button"
                className={`el-card el-card-${i}`}
                aria-label={s.title}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  void play(s);
                }}
              >
                <svg viewBox="-130 -100 260 200" aria-hidden>
                  <g transform={`translate(0 ${(h * scale) / 2}) scale(${scale})`}>{draw()}</g>
                </svg>
              </button>
            );
          })}
        </div>
      )}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
