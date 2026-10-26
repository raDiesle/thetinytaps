import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { loadRecordings, playDing, playGiggle, playKnock, playLift, playLullaby, playMelody, playRandomNote, playSlide } from "@/lib/sfx";
import type { TargetLanguage } from "@/content/targetLanguages";
import { speak } from "@/lib/speech";
import { StoryEnd, nextCard } from "./cards";
import { STORIES, RECORDINGS, texts, type Step, type Story, type Task, type Who } from "./content";
import { Backdrop, Buttons, CabinBack, CabinFront, Confetti, Contour, Hint, Shaft, Shell, Slabs } from "./house";
import { BROTHER, Bubble, HERO, KID_H, Kid, type Holding, type Outfit, type PicId, type Pose } from "./kid";
import { CABIN_L, FLOORS, IN_CABIN, ROOM_H, ROOM_L, ROOM_R, VIEW_H, VIEW_L, VIEW_W, floorLine } from "./layout";
import { spokenIn } from "./phrases";
import { WeatherContext } from "./rooms";
import type { ElevatorSettings } from "./settings";

/** Time the lift takes per floor. */
const FLOOR_MS = 1200;
/** Time the doors take to open or close. */
const DOOR_MS = 700;
/** Walking time per SVG unit. */
const WALK_MS = 2.6;
/** While waiting for the right button: the bubble reminds the child, and the button (and, for a ride, the room) glows. */
const NUDGE_MS = 7000;
/** How long one move of a task lasts if the task doesn't say. */
const BEAT_MS = 700;
/** From the end of a story until „Nochmal“ and „Weiter“ come. */
const END_MS = 5000;
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
  /** The story is over: „Nochmal“ and „Weiter“ are shown. */
  picking: boolean;
  cabin: number;
  /** Length of the current ride, for the cabin's and the riders' transition. */
  ride: number;
  doors: boolean;
  actors: Record<Who, Actor | null>;
  /** The wish over a child's head; `nudge` counts the reminders. */
  bubble: { who: Who; pic: PicId; nudge: number } | null;
  playing: string | null;
  used: string[];
  /** The task being done now, and how often each task has been done in this story. */
  task: string | null;
  taps: Record<string, number>;
  /** The button that pulses as a reminder (and its room glows, unless the child is in it already). */
  hint: number | null;
  /** The button of the floor the lift rides to. */
  lit: number | null;
  /** The button of the child's own floor, lit while a move in the room waits for it. */
  call: number | null;
  /** The thing the child rides to: it has an outline in its room. */
  seek: { wish: PicId; floor: number } | null;
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
  task: null,
  taps: {},
  hint: null,
  lit: null,
  call: null,
  seek: null,
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
export function ElevatorPlay({
  language,
  settings,
  story: storyId,
  onPick,
}: {
  /** The app language: what the child hears is spoken in it. */
  language: TargetLanguage;
  settings: ElevatorSettings;
  /** The story to play. */
  story: string;
  /** „Nochmal“ or „Weiter“ at the end: the game starts that story or level. */
  onPick: (id: string) => void;
}) {
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
    if (settings.sounds) loadRecordings(RECORDINGS);
  }, [settings.sounds]);

  /** Speaks a German sentence of the story in the app language (only with "Vorlesen"). */
  const say = (german: string) => {
    if (!settings.speech) return;
    const { text, speechLang } = spokenIn(german, language);
    speak(text, speechLang, { rate: 0.85 });
  };

  const sound = (play: () => void) => {
    if (settings.sounds) play();
  };

  const cue = (sounds: [number, () => void][]) => sounds.forEach(([ms, play]) => later(ms, () => sound(play)));

  /** Shows a wish; the same wish again doesn't pop the bubble up anew but runs a light along its outline. */
  const showBubble = (who: Who, pic: PicId) =>
    put((v) => ({
      bubble: v.bubble?.who === who && v.bubble.pic === pic ? { ...v.bubble, nudge: v.bubble.nudge + 1 } : { who, pic, nudge: 0 },
    }));

  /** Walks a child to `x` on its floor. */
  const walk = async (who: Who, x: number) => {
    const a = viewRef.current.actors[who];
    if (!a) return;
    const ms = Math.abs(x - a.x) * WALK_MS;
    if (ms < 1) return;
    actor(who, { x, walk: ms, pose: "walk", face: x > a.x ? 1 : -1, inCabin: false });
    await wait(ms);
    actor(who, { walk: 0, pose: "stand", inCabin: x >= CABIN_L });
  };

  /** Doors shut, the lift goes to `target` with everyone in it, "Pling", doors open. */
  const ride = async (target: number) => {
    put({ doors: false, lit: target });
    sound(playSlide);
    await wait(DOOR_MS);
    const from = viewRef.current.cabin;
    const ms = Math.abs(target - from) * FLOOR_MS;
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
    await wait(DOOR_MS);
  };

  const nextPress = () => new Promise<number>((resolve) => (waiter.current = resolve));

  /** Waits until the child has pressed `floor`: the lift rides there. With `here` the child is in that room already –
   * its own number lights up, and another number doesn't call the lift. The bubble must already show `wish`. */
  const reach = async (who: Who, wish: PicId, floor: number, here = false) => {
    for (;;) {
      if (here) put({ call: floor });
      const stopNudging = (() => {
        let stop = () => {};
        const nudge = () => {
          showBubble(who, wish);
          put({ hint: floor });
          stop = later(NUDGE_MS, nudge);
        };
        stop = later(NUDGE_MS, nudge);
        return () => stop();
      })();
      const pressed = await nextPress();
      stopNudging();
      if (pressed === floor && (here || pressed === viewRef.current.cabin)) break;
      if (!here && pressed !== viewRef.current.cabin) {
        sound(() => playKnock(1500));
        await ride(pressed);
        if (pressed === floor) break;
      }
      // Wrong floor: the child shakes its head and thinks of the wish again.
      const pose = viewRef.current.actors[who]!.pose;
      actor(who, { pose: "shake" });
      say(here ? texts.notYet : texts.wrong);
      await wait(1100);
      actor(who, { pose });
      showBubble(who, wish);
      put({ hint: floor });
    }
    put({ hint: null, call: null });
  };

  /** Does a task `taps` times. A task with a wish asks for every move like a floor: the bubble shows it and the
   * child's own floor number lights up; one without does itself. */
  const doTask = async (who: Who, task: Task) => {
    const other: Who = who === "hero" ? "buddy" : "hero";
    put((v) => ({ task: task.name, taps: { ...v.taps, [task.name]: v.taps[task.name] ?? 0 } }));
    if (task.spot !== undefined) await walk(who, task.spot);
    if (task.face) actor(who, { face: task.face });
    if (task.wish) {
      showBubble(who, task.wish.pic);
      say(task.wish.ask);
    }
    for (let i = 0; i < task.taps; i++) {
      if (task.wish) await reach(who, task.wish.pic, viewRef.current.actors[who]!.floor, true);
      const lastTap = i === task.taps - 1;
      put((v) => ({ taps: { ...v.taps, [task.name]: (v.taps[task.name] ?? 0) + 1 } }));
      const a = viewRef.current.actors[who]!;
      actor(who, {
        pose: task.pose,
        ...(lastTap && task.hold !== undefined && { holding: task.hold }),
        ...(lastTap && task.wear && { wear: [...a.wear, task.wear] }),
      });
      if (task.together) actor(other, { pose: task.pose });
      sound(task.sound);
      await wait(task.beat ?? BEAT_MS);
      actor(who, { pose: task.rest ?? "stand" });
      if (task.together) actor(other, { pose: task.rest ?? "stand" });
    }
    if (task.wish) put({ bubble: null });
    if (task.done) say(task.done);
    if (task.wait) {
      cue(task.sounds ?? []);
      await wait(task.wait);
    }
  };

  const doStep = async (step: Step, last: boolean) => {
    const who = step.who ?? "hero";
    const other: Who = who === "hero" ? "buddy" : "hero";
    showBubble(who, step.wish);
    say(step.ask);
    put({ seek: { wish: step.wish, floor: step.floor } });
    await reach(who, step.wish, step.floor);
    put({ bubble: null, seek: null });
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
    await wait(step.ms);
    for (const task of step.tasks ?? []) await doTask(who, task);
    put({ task: null });
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
    await wait(500);
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
      later(1200, () => {
        put((v) => ({ playing: null, used: [...v.used, last.prop] }));
        (["hero", "buddy"] as Who[]).forEach((who) => actor(who, { pose: "cheer", hidden: false }));
      });
    }
    await wait(END_MS);
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
    await wait(2800);
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
    // The child stands in its room: while a move there waits, tapping the child is tapping the room.
    if (viewRef.current.call !== null) return press(viewRef.current.call);
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

  // The story picked on the start screen begins at once; „Nochmal“ and „Weiter“ come after it.
  useEffect(() => {
    void play(STORIES.find((s) => s.id === storyId) ?? STORIES[0]);
  }, []);

  // 1–4 fetch the lift or do the move in the room, arrows ride one floor up or down, any key at the end goes on to the next story,
  // and any other key – or any key while a move does itself – makes a burst.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      const digit = Number(e.key);
      const v = viewRef.current;
      if (v.picking) {
        if (v.story) onPick(nextCard(v.story.id).id);
        return;
      }
      if (v.task && v.call === null) funBurst();
      else if (Number.isInteger(digit) && digit >= 1 && digit <= FLOORS) press(digit - 1);
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
    <div className={`elevator-play weather-${weather}`} onPointerDown={(e) => funBurst(e.clientX, e.clientY)}>
      <svg className="el-svg" viewBox={`${VIEW_L} 0 ${VIEW_W - VIEW_L} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet">
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
                    <Room playing={view.playing} used={view.used} task={view.task} taps={view.taps} />
                  </g>
                </g>
              ))}
              <Slabs />
              <Shaft />
              <CabinBack floor={view.cabin} ride={view.ride} />
              <Buttons lit={view.lit ?? view.call} hint={view.hint} onPress={press} />
              {view.hint !== null && view.call === null && <Hint floor={view.hint} />}
              {view.seek && <Contour key={view.seek.wish} wish={view.seek.wish} floor={view.seek.floor} glow={view.hint === view.seek.floor} />}
              {kids.map((who) => {
                const a = actors[who];
                if (!a || a.hidden) return null;
                const { outer, inner } = place(a);
                return (
                  <g key={who} className="el-ride" style={outer} data-wish={who === "buddy" ? "brother" : undefined}>
                    <g className="el-walker" style={inner}>
                      <g className={a.hop ? `el-hopper hop-${a.hop % 2}` : "el-hopper"} data-tap onPointerDown={tapKid(who)}>
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
                    <Bubble
                      key={`${bubble.who}${bubble.pic}`}
                      pic={bubble.pic}
                      nudge={bubble.nudge}
                      height={KID_H * (bubble.who === "buddy" ? BUDDY_SCALE : 1)}
                    />
                  </g>
                </g>
              )}
              <rect className={`el-night${view.night ? " on" : ""}`} x="-4000" y="-4000" width={VIEW_W + 8000} height={VIEW_H + 8000} fill="#0b1340" />
              {view.party && <Confetti />}
            </>
          )}
        </WeatherContext.Provider>
      </svg>

      {view.picking && story && <StoryEnd id={story.id} onPick={onPick} />}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
