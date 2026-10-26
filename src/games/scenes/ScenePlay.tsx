import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { GameEnd } from "@/components/GameEnd";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { loadRecordings, playChime, playLullaby, playMelody, playRandomNote } from "@/lib/sfx";
import { targetLanguageFor } from "@/content/targetLanguages";
import { pick as pickLanguage, useAppLanguage } from "@/lib/language";
import { speak } from "@/lib/speech";
import { tapState, tapTargetAt } from "@/lib/tapTargets";
import { SCENES } from ".";
import { ARROWS, middleItem, nextInDirection } from "./focus";
import { HideoutContext, peekTimes, SURPRISES } from "./hideout";
import { assignKeys, pressedKey } from "./keys";
import { localizeScene, sceneLanguage } from "./localize";
import { ExitSign, FocusRing, HintRing, KeyBadges, Thumbnail, type Exit, type Lit } from "./marks";
import { capitalize, SCENE_PHRASES } from "./phrases";
import { nextQuest, questsFor, type Quest } from "./quests";
import { driveDistance, guestFor, roadId, roadsFrom, tripTo, withGuest, type Road, type Trip } from "./roads";
import { hasHints, isQuestMode, type ScenesSettings } from "./settings";
import { playSound } from "./sounds";
import { placeBox, type Scene, type SceneItem } from "./types";

/** Key presses closer together than this only spawn shapes. */
const MIN_KEY_MS = 600;
/** Find modes: a key press repeats the question at most this often. */
const REPEAT_QUESTION_MS = 3000;
/** Find modes: pause after a found item before the next question. */
const NEXT_QUESTION_MS = 2600;
/** Find modes: when the hint ring appears. */
const HINT_AFTER_MS = 8000;
const HINT_AFTER_MISSES = 2;
/** Without taps for this long, the picture starts moving by itself… */
const AMBIENT_IDLE_MS = 4000;
/** …one item every few seconds, at random. */
const AMBIENT_MIN_MS = 4000;
const AMBIENT_MAX_MS = 9000;
/** Hover mode: how long the pointer has to rest on an item, so just passing by doesn't count. */
const HOVER_DWELL_MS = 200;
/** Chain reactions: the next item reacts this long after the one before. */
const CHAIN_STEP_MS = 1100;
/** "Alles entdeckt!": the party starts a moment after the last item, and everything dances for a while. */
const PARTY_AFTER_MS = 900;
const PARTY_MS = 3600;
/** "Nochmal" and the next picture come once the party (or the room going dark) has had its moment. */
const END_BUTTONS_MS = PARTY_AFTER_MS + 2400;
/** Vehicles driving into another picture (idea B-19): how fast they drive, in scene units per second… */
const DRIVE_SPEED = 600;
const DRIVE_MIN_MS = 1400;
const DRIVE_MAX_MS = 3000;
/** …and how long the sign at the edge waits to be followed before the vehicle comes back. */
const GONE_MS = 15000;

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/**
 * Per item: how often it was started (remounts restart the animation), whether it is running
 * and, for an item with a hideout, which surprise peeks out this time (index into SURPRISES).
 */
type Plays = Record<string, { count: number; playing: boolean; surprise?: number }>;
/** A vehicle driving out of the picture, gone from it, or driving in; dx is how far off the picture it is then. */
type Drive = { phase: "out" | "gone" | "in"; dx: number; ms: number };

const driveMs = (dx: number) => Math.min(DRIVE_MAX_MS, Math.max(DRIVE_MIN_MS, (Math.abs(dx) / DRIVE_SPEED) * 1000));

/** Colour mode: how much of each colour is left in the grey picture; the rest is white. */
const GREY_SLOPE = 0.55;

/** Colour mode: a dab of paint on the background is this share of the picture's width across. */
const PAINT_RADIUS = 0.14;

/** Colour mode, space bar: of this many random spots off the items, the one furthest from the paint so far gets painted. */
const SPACE_TRIES = 40;

/** Colour mode: a round patch of the background (and overlay) that got its colour back, in picture units. */
type Dab = { x: number; y: number };

/** Colour mode: a colour as the pale grey it has in the uncoloured picture (same as the grey filter). */
function paleGrey(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const luminance = 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  const v = Math.round(luminance * GREY_SLOPE + 255 * (1 - GREY_SLOPE));
  return `rgb(${v} ${v} ${v})`;
}

/** Plays `scene` (already in the app language, see localize.ts); the engine's own sentences come from phrases.ts. */
export function ScenePlay({ scene, settings }: { scene: Scene; settings: ScenesSettings }) {
  // A picture that is not translated completely plays in German, voice and keys included (localize.ts).
  const appLanguage = useAppLanguage();
  const language = targetLanguageFor(sceneLanguage(scene.id, appLanguage.id));
  const words = pickLanguage(SCENE_PHRASES, language.id);
  const speechLang = language.speechLang;
  const [plays, setPlays] = useState<Plays>({});
  const [quest, setQuest] = useState<Quest | null>(null);
  /** Answers already found for the current question. */
  const [answered, setAnswered] = useState<ReadonlySet<string>>(new Set());
  const [hint, setHint] = useState(false);
  const [found, setFound] = useState(0);
  const [touched, setTouched] = useState(false);
  /** Explore and colour mode: items tapped at least once (in colour mode: the coloured ones). */
  const [discovered, setDiscovered] = useState<ReadonlySet<string>>(new Set());
  const [partying, setPartying] = useState(false);
  /** Colour mode: where the background was painted, by tapping it or an item. */
  const [dabs, setDabs] = useState<Dab[]>([]);
  /** Bedtime pictures: everything is asleep and the room is dark. */
  const [night, setNight] = useState(false);
  /** Keys mode: the item in the glowing frame, moved with the arrow keys; hidden once an item starts. */
  const [focus, setFocus] = useState<SceneItem | null>(null);
  const [lit, setLit] = useState<Lit | null>(null);
  /** Colour mode: the space bar is held, so its cap on the screen goes down too. */
  const [spaceDown, setSpaceDown] = useState(false);
  const { bursts, spawn } = useBursts();
  const location = useLocation();
  const navigate = useNavigate();
  const roadsOn = settings.roads && settings.mode === "explore";
  // Opened by following a vehicle: it drives in, as a guest or back at home. Read once, the play is keyed by scene.
  const [arrival] = useState(() => (roadsOn ? tripTo(scene.id, location.state) : null));
  const [guest] = useState(() => (arrival && !arrival.home ? (guestFor(arrival.road, language.id) ?? null) : null));
  const items = useMemo(() => (guest ? withGuest(scene.items, guest) : scene.items), [scene, guest]);
  const [drives, setDrives] = useState<Record<string, Drive>>(() => {
    const item = guest?.item ?? scene.items.find((i) => i.id === arrival?.road.item);
    if (!arrival || !item) return {};
    const dx = driveDistance(item, arrival.road.faces, scene.width, false);
    return { [item.id]: { phase: "in", dx, ms: driveMs(dx) } };
  });
  const [exits, setExits] = useState<Exit[]>([]);
  const exitsRef = useRef(exits);
  exitsRef.current = exits;
  /** Random picks leave out vehicles that drove off: only their own key or sign follows them. */
  const here = useCallback((list: SceneItem[]) => list.filter((i) => !exitsRef.current.some((e) => e.item === i)), []);

  const questRef = useRef<Quest | null>(null);
  const answeredRef = useRef<ReadonlySet<string>>(answered);
  const discoveredRef = useRef<ReadonlySet<string>>(discovered);
  const focusRef = useRef<SceneItem | null>(null);
  const busyUntil = useRef(new Map<string, number>());
  const celebrating = useRef(false);
  const misses = useRef(0);
  const lastKey = useRef(0);
  const lastQuestion = useRef(0);
  const lastKeyItem = useRef<SceneItem | null>(null);
  const lastInteraction = useRef(0);
  /** Taps per vehicle that can drive off: every second one sends it on its way. */
  const driveTaps = useRef(new Map<string, number>());
  const sentenceIndex = useRef(new Map<string, number>());
  /** Hidden surprises: the one each hideout showed last, and the last one shown anywhere. */
  const lastSurprise = useRef(new Map<string, number>());
  const lastSurpriseAnywhere = useRef(-1);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const svgRef = useRef<SVGSVGElement>(null);
  // An SVG id without the colons React puts in, so it can go into url(#…).
  const svgId = `scene-${useId().replace(/[^\w-]/g, "")}`;
  const greyId = `${svgId}-grey`;

  const questMode = isQuestMode(settings.mode);
  const colouring = settings.mode === "colour";
  const soundsOn = settings.sounds;
  const quests = useMemo(() => questsFor(settings.mode, scene, language.id), [settings.mode, scene, language.id]);
  const itemsById = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const roads = useMemo(() => roadsFrom(scene.id), [scene]);
  const allDiscovered = discovered.size === scene.items.length;
  /** Bedtime picture while exploring: tapped items fall asleep, and the end is a quiet night instead of the party. */
  const bedtime = !!scene.bedtime && !colouring && !questMode;
  // The good-night picture is about getting calm: no song in the background there.
  useNoBackgroundMusic(!!scene.bedtime);

  const later = useCallback((fn: () => void, ms: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      fn();
    }, ms);
    timers.current.add(timer);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    loadRecordings(new Set(items.map((item) => item.sound)));
  }, [items]);

  const say = useCallback(
    (text: string, queue = false) => {
      if (settings.speech) speak(text, speechLang, { queue, rate: 0.85 });
    },
    [settings.speech, speechLang],
  );

  // Repeated taps cycle through the item's sentences, so there is always something new to hear.
  const describe = useCallback(
    (item: SceneItem) => {
      if (settings.announce === "name") return `${capitalize(item.name)}!`;
      const index = sentenceIndex.current.get(item.id) ?? 0;
      sentenceIndex.current.set(item.id, index + 1);
      return item.sentences[index % item.sentences.length];
    },
    [settings.announce],
  );

  const funBurst = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      if (soundsOn) playRandomNote();
    },
    [spawn, soundsOn],
  );

  /** Hidden surprises: never the same twice in a row, neither in one hideout nor one after the other. */
  const nextSurprise = useCallback((item: SceneItem) => {
    const avoid = [lastSurprise.current.get(item.id), lastSurpriseAnywhere.current];
    const choices = SURPRISES.map((_, i) => i).filter((i) => !avoid.includes(i));
    const next = pick(choices);
    lastSurprise.current.set(item.id, next);
    lastSurpriseAnywhere.current = next;
    return next;
  }, []);

  /** Start the item's animation and (unless quiet) its sound. Returns false while it is still running. */
  const animate = useCallback(
    (item: SceneItem, quiet = false) => {
      const now = performance.now();
      if (now < (busyUntil.current.get(item.id) ?? 0)) return false;
      busyUntil.current.set(item.id, now + item.durationMs);
      const surprise = item.hideout ? nextSurprise(item) : undefined;
      setPlays((prev) => ({ ...prev, [item.id]: { count: (prev[item.id]?.count ?? 0) + 1, playing: true, surprise } }));
      later(() => setPlays((prev) => ({ ...prev, [item.id]: { ...prev[item.id], playing: false } })), item.durationMs);
      if (soundsOn && !quiet) {
        playSound(item.sound);
        // The surprise says hello once it is out of its hideout; not while looking for something, it would
        // mislead, and not at bedtime, where a bark would wake everyone up.
        if (surprise !== undefined && !questMode && !bedtime) later(() => playSound(SURPRISES[surprise].sound), peekTimes(item).delayMs + 300);
      }
      return true;
    },
    [later, soundsOn, nextSurprise, questMode, bedtime],
  );

  /** Asks the question (again). */
  const ask = useCallback(
    (quest: Quest, queue = false) => {
      lastQuestion.current = performance.now();
      say(quest.question, queue);
    },
    [say],
  );

  const newQuestion = useCallback(
    (queue: boolean) => {
      const next = nextQuest(quests, questRef.current);
      questRef.current = next;
      answeredRef.current = new Set();
      celebrating.current = false;
      misses.current = 0;
      setQuest(next);
      setAnswered(answeredRef.current);
      setHint(false);
      if (next) ask(next, queue);
    },
    [quests, ask],
  );

  // Settings can't change while playing, so this only runs once.
  useEffect(() => {
    if (questMode) newQuestion(false);
  }, []);

  // The hint ring marks an answer that hasn't been found yet; after each found one the wait starts again.
  // Not when looking for a named thing: a ring around it would give it away.
  const hintsOn = settings.hints && hasHints(settings.mode);
  const hintItem = quest?.answers.find((item) => !answered.has(item.id));
  useEffect(() => {
    if (!quest || !hintsOn) return;
    const timer = setTimeout(() => setHint(true), HINT_AFTER_MS);
    return () => clearTimeout(timer);
  }, [quest, answered, hintsOn]);

  // Ambient life (only if switched on): when nobody taps for a while, items move by themselves, silently.
  // While something is looked for, the answers stay still, so they aren't given away.
  useEffect(() => {
    if (!settings.ambient) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(
        () => {
          if (performance.now() - lastInteraction.current > AMBIENT_IDLE_MS) {
            animate(pick(items.filter((item) => !questRef.current?.answers.includes(item))), true);
          }
          schedule();
        },
        AMBIENT_MIN_MS + Math.random() * (AMBIENT_MAX_MS - AMBIENT_MIN_MS),
      );
    };
    schedule();
    return () => clearTimeout(timer);
  }, [items, animate, settings.ambient]);

  const interacted = () => {
    lastInteraction.current = performance.now();
    setTouched(true);
  };

  const moveFocus = useCallback((item: SceneItem) => {
    focusRef.current = item;
    setFocus(item);
  }, []);

  /** Everything was discovered: all items dance at once, with shapes all over the screen. */
  const party = () => {
    setPartying(true);
    if (soundsOn) playMelody();
    say(colouring ? words.allColoured : words.allFound);
    items.forEach((item, i) => later(() => animate(item, true), i * 40));
    for (let i = 0; i < 14; i++) later(() => spawn(), i * 140);
    later(() => setPartying(false), PARTY_MS);
  };

  /** Bedtime picture: everything is asleep, so the room goes dark – softly, without dancing or shapes. */
  const goodNight = () => {
    setNight(true);
    if (soundsOn) playLullaby();
    say(words.goodNight);
  };

  const startOver = () => {
    discoveredRef.current = new Set();
    setDiscovered(discoveredRef.current);
    setDabs([]);
    setNight(false);
  };

  /** The next picture in menu order (after the last one the first). The game stays open, like following a vehicle. */
  const nextScene = localizeScene(SCENES[(SCENES.findIndex((s) => s.id === scene.id) + 1) % SCENES.length], appLanguage.id);
  const goToNextScene = () => {
    const { trip: _, ...state } = (location.state ?? {}) as { trip?: Trip };
    navigate(`/bilder/${nextScene.id}/`, { replace: true, state });
  };

  /** Explore and colour mode: count the item (and colour it in), and celebrate when it was the last one. */
  const discover = (item: SceneItem, x: number, y: number) => {
    if (!colouring && !settings.goal && !bedtime) return;
    // A guest from another picture isn't part of this one.
    if (item === guest?.item || discoveredRef.current.has(item.id)) return;
    discoveredRef.current = new Set(discoveredRef.current).add(item.id);
    setDiscovered(discoveredRef.current);
    // A splash of paint where the colour comes back.
    if (colouring) for (let i = 0; i < 3; i++) spawn(x + (Math.random() - 0.5) * 120, y + (Math.random() - 0.5) * 120);
    if (discoveredRef.current.size !== scene.items.length) return;
    if (bedtime) later(goodNight, PARTY_AFTER_MS);
    else if (settings.goal) later(party, PARTY_AFTER_MS);
  };

  /**
   * Colour mode: the background gets its colour back in a big round patch
   * around the tap, so the houses, trees and hills that don't move can be
   * painted too. A dab right on top of an earlier one adds nothing.
   */
  const paint = (clientX: number, clientY: number) => {
    const matrix = svgRef.current?.getScreenCTM();
    if (!colouring || !matrix) return;
    const { x, y } = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
    dab(x, y);
  };

  /** Colour mode: a dab at this point of the picture, in picture units. */
  const dab = (x: number, y: number) => {
    const near = (scene.width * PAINT_RADIUS) / 4;
    setDabs((prev) => (prev.some((d) => Math.hypot(d.x - x, d.y - y) < near) ? prev : [...prev, { x, y }]));
  };

  /**
   * Colour mode, space bar (on a computer): a spot of the grey background where
   * nothing happens gets its colour back. Of a few random spots off the items it
   * takes the one furthest from the paint so far, so each press paints somewhere new.
   */
  const paintSomewhere = () => {
    interacted();
    const boxes = here(items).map((item) => placeBox(item.box, item.place));
    const spots = Array.from({ length: SPACE_TRIES }, () => ({ x: Math.random() * scene.width, y: Math.random() * scene.height }));
    const free = spots.filter(({ x, y }) => !boxes.some(([bx, by, w, h]) => x >= bx && x <= bx + w && y >= by && y <= by + h));
    const room = ({ x, y }: Dab) => Math.min(Infinity, ...dabs.map((d) => Math.hypot(d.x - x, d.y - y)));
    const spot = (free.length ? free : spots).reduce((best, s) => (room(s) > room(best) ? s : best));
    dab(spot.x, spot.y);
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return;
    const { x, y } = new DOMPoint(spot.x, spot.y).matrixTransform(matrix);
    funBurst(x, y);
    for (let i = 0; i < 2; i++) spawn(x + (Math.random() - 0.5) * 120, y + (Math.random() - 0.5) * 120);
  };

  /** Chain reaction: the items after this one react one by one, each telling its part of the story. */
  const runChain = (item: SceneItem) => {
    const chain = scene.chains?.find((c) => c.start === item.id);
    chain?.steps.forEach((step, i) => {
      later(
        () => {
          const next = itemsById.get(step.item);
          if (next && animate(next)) say(settings.announce === "name" ? describe(next) : step.sentence, true);
        },
        (i + 1) * CHAIN_STEP_MS,
      );
    });
  };

  /** A vehicle drives into the picture from behind itself, to where it stands. */
  const driveIn = useCallback(
    (item: SceneItem, road: Road) => {
      const dx = driveDistance(item, road.faces, scene.width, false);
      const ms = driveMs(dx);
      busyUntil.current.set(item.id, performance.now() + ms);
      setDrives((prev) => ({ ...prev, [item.id]: { phase: "in", dx, ms } }));
      later(() => setDrives(({ [item.id]: _, ...rest }) => rest), ms);
    },
    [scene, later],
  );

  // Arrived by following a vehicle: it drives in and says hello.
  useEffect(() => {
    if (!arrival) return;
    const { road, home } = arrival;
    const item = guest?.item ?? itemsById.get(road.item);
    if (!item) return;
    driveIn(item, road);
    if (soundsOn) playSound(item.sound);
    say(home ? words.backHome(item, words.places[scene.id]) : words.comesFrom(item, words.places[road.from]));
    // So a reload doesn't bring it once more.
    const { trip: _, ...state } = location.state as { trip?: Trip };
    navigate(location.pathname, { replace: true, state });
  }, []);

  /**
   * The vehicle drives off forwards, out of the picture; a sign at that edge
   * follows it. A vehicle of this picture comes back after a while, a guest has gone home.
   */
  const driveOff = (item: SceneItem, road: Road) => {
    const goingHome = item === guest?.item;
    const to = goingHome ? road.from : road.to;
    const dx = driveDistance(item, road.faces, scene.width, true);
    const ms = driveMs(dx);
    busyUntil.current.set(item.id, Infinity);
    setDrives((prev) => ({ ...prev, [item.id]: { phase: "out", dx, ms } }));
    if (soundsOn) playSound(item.sound);
    say(words.drivesTo(item, words.places[to]), true);
    later(() => {
      setDrives((prev) => ({ ...prev, [item.id]: { phase: "gone", dx, ms } }));
      const exit: Exit = { item, to, trip: { road: roadId(road), home: goingHome } };
      setExits((prev) => [...prev, exit]);
      later(() => {
        setExits((prev) => prev.filter((e) => e !== exit));
        if (!goingHome) driveIn(item, road);
      }, GONE_MS);
    }, ms);
  };

  /** Explore mode: every second tap on a vehicle that can drive off sends it away, once its animation is over. */
  const maybeDriveOff = (item: SceneItem) => {
    const road = item === guest?.item ? guest.road : roads.get(item.id);
    if (!roadsOn || !road) return;
    const taps = (driveTaps.current.get(item.id) ?? 0) + 1;
    driveTaps.current.set(item.id, taps);
    if (taps % 2) return;
    busyUntil.current.set(item.id, Infinity);
    later(() => driveOff(item, road), item.durationMs);
  };

  /** Into the other picture, where the vehicle arrives. The game stays open (fullscreen, kid mode). */
  const follow = (exit: Exit) => {
    navigate(`/bilder/${exit.to}/`, { replace: true, state: { ...(location.state as object | null), trip: exit.trip } });
  };

  /**
   * An item was tapped, pointed at for a moment (hover mode) or its key was
   * pressed (keys mode). Hovering is quieter in the find modes: wrong items only
   * move, so sweeping the mouse or a finger across the picture doesn't start a
   * stream of talk.
   */
  const activate = (item: SceneItem, x: number, y: number, how: "tap" | "hover" | "key") => {
    interacted();
    // A vehicle that drove off: its sign (or its key) follows it.
    const exit = exits.find((e) => e.item === item);
    if (exit) {
      follow(exit);
      return;
    }
    // The arrow keys go on from the activated item, but it gets no frame; its key badge lights up instead.
    if (settings.trigger === "keys") {
      focusRef.current = item;
      setFocus(null);
      setLit((prev) => ({ id: item.id, count: (prev?.count ?? 0) + 1 }));
    }
    const quest = questRef.current;

    if (!quest) {
      const started = animate(item);
      if (started) {
        say(describe(item));
        if (item.hideout) say(words.peekaboo(pickLanguage(SURPRISES[lastSurprise.current.get(item.id)!].found, language.id)), true);
      } else if (how !== "hover") funBurst(x, y);
      paint(x, y);
      discover(item, x, y);
      if (started) {
        runChain(item);
        maybeDriveOff(item);
      }
      return;
    }
    const isAnswer = quest.answers.includes(item);
    if (celebrating.current || (isAnswer && answeredRef.current.has(item.id))) {
      if (!animate(item) && how !== "hover") funBurst(x, y);
      return;
    }
    if (isAnswer) {
      answeredRef.current = new Set(answeredRef.current).add(item.id);
      setAnswered(answeredRef.current);
      animate(item);
      for (let i = 0; i < 5; i++) spawn(x + (Math.random() - 0.5) * 200, y + (Math.random() - 0.5) * 200);
      if (soundsOn) playChime();
      setHint(false);
      setFound((n) => n + 1);
      misses.current = 0;
      say(`${pick(words.praise)} ${quest.praise(item)}`);
      if (answeredRef.current.size >= quest.needed) {
        celebrating.current = true;
        later(() => newQuestion(true), NEXT_QUESTION_MS);
      } else {
        // More answers to find: ask again.
        lastQuestion.current = performance.now();
        say(quest.question, true);
      }
      return;
    }
    animate(item);
    if (how === "hover") return;
    // Wrong item: no "wrong", just say what it is and ask again.
    misses.current++;
    if (hintsOn && misses.current >= HINT_AFTER_MISSES) setHint(true);
    lastQuestion.current = performance.now();
    say(words.thatIs(item, quest.question));
  };

  // The key handler is set up once; this way it always calls the current activate.
  const activateRef = useRef(activate);
  activateRef.current = activate;
  const paintSomewhereRef = useRef(paintSomewhere);
  paintSomewhereRef.current = paintSomewhere;

  /** Where an item is on screen, for the shapes that fly out of it. */
  const screenPoint = useCallback((item: SceneItem): [number, number] => {
    const [x, y, w, h] = placeBox(item.box, item.place);
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return [window.innerWidth / 2, window.innerHeight / 2];
    const point = new DOMPoint(x + w / 2, y + h / 2).matrixTransform(matrix);
    return [point.x, point.y];
  }, []);

  const keys = useMemo(() => assignKeys(scene.items, language.id), [scene, language.id]);
  const keyTurns = useRef(new Map<string, number>());

  const tapItem = (item: SceneItem, e: PointerEvent) => {
    e.stopPropagation();
    activate(item, e.clientX, e.clientY, "tap");
  };

  const onBackgroundPointer = (e: PointerEvent) => {
    interacted();
    funBurst(e.clientX, e.clientY);
    paint(e.clientX, e.clientY);
  };

  // Hover mode: whatever is under the mouse, or under a finger sliding over the
  // picture, comes alive after a short pause. Looking the item up by position
  // works for touch too, where the finger's events all go to where it started.
  const hovered = useRef<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const endHover = () => {
    hovered.current = null;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (settings.trigger !== "hover") return;
    // The same grown tap areas as for taps (see tapTargets.ts).
    const under = tapTargetAt(e.clientX, e.clientY, document.elementFromPoint(e.clientX, e.clientY));
    const id = under?.closest("[data-item]")?.getAttribute("data-item") ?? null;
    if (id === hovered.current) return;
    endHover();
    hovered.current = id;
    const item = id ? itemsById.get(id) : undefined;
    if (!item) return;
    const { clientX, clientY } = e;
    hoverTimer.current = setTimeout(() => activate(item, clientX, clientY, "hover"), HOVER_DWELL_MS);
  };

  useEffect(() => endHover, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.repeat) return;

      // Colour mode: the space bar paints the background where nothing happens (Enter still starts the item in the frame).
      if (colouring && e.key === " ") {
        setSpaceDown(true);
        paintSomewhereRef.current();
        return;
      }

      // Keys mode: the key's own item; items sharing a key take turns.
      // Only the item's own animation limits how fast keys can be pressed.
      if (settings.trigger === "keys") {
        // Arrow keys move the glowing frame, Space and Enter start the item in it.
        const arrow = ARROWS[e.key];
        if (arrow) {
          interacted();
          const from = focusRef.current;
          moveFocus(from ? nextInDirection(items, from, arrow) : middleItem(items, scene.width, scene.height));
          if (settings.sounds) playRandomNote();
          return;
        }
        const key = pressedKey(e, language.id);
        const list = keys.byKey.get(key);
        const open = (i: SceneItem) => questRef.current?.answers.includes(i) && !answeredRef.current.has(i.id);
        let item: SceneItem;
        if (e.key === " " || e.key === "Enter") item = focusRef.current ?? pick(here(items));
        else if (!list) item = pick(here(scene.items));
        else if (list.some(open)) item = list.find(open)!;
        else {
          const turn = keyTurns.current.get(key) ?? 0;
          keyTurns.current.set(key, turn + 1);
          item = list[turn % list.length];
        }
        const [x, y] = screenPoint(item);
        activateRef.current(item, x, y, "key");
        return;
      }

      const now = performance.now();
      if (now - lastKey.current < MIN_KEY_MS) {
        funBurst();
        return;
      }
      lastKey.current = now;
      interacted();

      const quest = questRef.current;
      if (quest) {
        if (!celebrating.current && now - lastQuestion.current > REPEAT_QUESTION_MS) ask(quest);
        else funBurst();
        return;
      }
      // Exploring: every key brings another item to life.
      const item = pick(here(items).filter((i) => i !== lastKeyItem.current));
      lastKeyItem.current = item;
      const [x, y] = screenPoint(item);
      activateRef.current(item, x, y, "key");
    };
    const onKeyUp = (e: KeyboardEvent) => e.key === " " && setSpaceDown(false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [scene, items, here, keys, screenPoint, colouring, settings.trigger, settings.sounds, ask, funBurst, moveFocus, language.id]);

  // Colour mode: everything not yet tapped is pale grey, the background too until the picture is done.
  const grey = colouring && !allDiscovered;
  const greyFilter = `url(#${greyId})`;
  // The grey copy of the background, with holes where it was painted.
  const greyCopy = { filter: greyFilter, mask: `url(#${svgId}-paint)` };
  const sceneClass = ["scene", settings.ambient && "lively", colouring && "colouring", partying && "party", night && "night"].filter(Boolean).join(" ");

  return (
    <div
      className={sceneClass}
      style={{ "--sky": grey ? paleGrey(scene.sky) : scene.sky, "--ground": grey ? paleGrey(scene.ground) : scene.ground } as CSSProperties}
      onPointerDown={onBackgroundPointer}
      onPointerMove={onPointerMove}
      onPointerLeave={endHover}
      onPointerUp={(e) => e.pointerType === "touch" && endHover()}
      onPointerCancel={endHover}
    >
      <svg ref={svgRef} className="scene-svg" viewBox={`0 0 ${scene.width} ${scene.height}`} preserveAspectRatio="xMidYMid meet">
        {colouring && (
          <defs>
            <filter id={greyId} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="linear" slope={GREY_SLOPE} intercept={1 - GREY_SLOPE} />
                <feFuncG type="linear" slope={GREY_SLOPE} intercept={1 - GREY_SLOPE} />
                <feFuncB type="linear" slope={GREY_SLOPE} intercept={1 - GREY_SLOPE} />
              </feComponentTransfer>
            </filter>
            <radialGradient id={`${svgId}-dab`}>
              <stop offset="0.6" stopColor="#000" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <mask id={`${svgId}-paint`} maskUnits="userSpaceOnUse" x={-scene.width} y={-scene.height} width={3 * scene.width} height={3 * scene.height}>
              <rect x={-scene.width} y={-scene.height} width={3 * scene.width} height={3 * scene.height} fill="#fff" />
              {dabs.map(({ x, y }, i) => (
                <circle key={i} className="scene-dab" cx={x} cy={y} r={scene.width * PAINT_RADIUS} fill={`url(#${svgId}-dab)`} />
              ))}
            </mask>
          </defs>
        )}
        {/* Colour mode: the picture in colour, and its grey copy on top until it is all painted. */}
        <g id={`${svgId}-bg`}>
          <scene.Background />
        </g>
        {grey && <use href={`#${svgId}-bg`} {...greyCopy} />}
        {items.map((item, i) => {
          const play = plays[item.id];
          const place = item.place;
          const drive = drives[item.id];
          // A guest keeps the class of its own picture, which its animations use.
          const look = item === guest?.item ? guest.look : item.id;
          const peek = play?.playing && play.surprise !== undefined ? { surprise: SURPRISES[play.surprise], ...peekTimes(item) } : null;
          return (
            <g
              key={item.id}
              className={drive && `scene-drive ${drive.phase}`}
              style={drive && ({ "--drive-dx": `${drive.dx}px`, "--drive-ms": `${drive.ms}ms` } as CSSProperties)}
            >
              <g
                key={`${item.id}-${play?.count ?? 0}`}
                className={`scene-item item-${look}${play?.playing ? " playing" : ""}${bedtime && discovered.has(item.id) ? " asleep" : ""}`}
                style={{ "--party-i": i } as CSSProperties}
                filter={colouring && !discovered.has(item.id) ? greyFilter : undefined}
                data-item={item.id}
                data-tap={quest ? tapState({ goal: quest.answers.includes(item), done: answered.has(item.id) }) : tapState({ done: discovered.has(item.id) })}
                role="button"
                aria-label={capitalize(item.name)}
                onPointerDown={(e) => tapItem(item, e)}
              >
                <g transform={place && `translate(${place.x} ${place.y}) scale(${place.scale})`}>
                  {item.shadow && (
                    <ellipse className="scene-shadow" cx={item.shadow[0]} cy={item.shadow[1]} rx={item.shadow[2]} ry={Math.max(6, item.shadow[2] * 0.12)} />
                  )}
                  <HideoutContext.Provider value={peek}>
                    <item.Art />
                  </HideoutContext.Provider>
                  {(item.hitAreas ?? [item.box]).map(([x, y, w, h], i) => (
                    <rect key={i} className="scene-hit" data-tap-area x={x} y={y} width={w} height={h} />
                  ))}
                </g>
              </g>
            </g>
          );
        })}
        {scene.Overlay && (
          <g className="scene-overlay">
            <g id={`${svgId}-overlay`}>
              <scene.Overlay />
            </g>
            {grey && <use href={`#${svgId}-overlay`} {...greyCopy} />}
          </g>
        )}
        {exits.map((exit) => (
          <ExitSign
            key={exit.item.id}
            exit={exit}
            right={(drives[exit.item.id]?.dx ?? 0) > 0}
            width={scene.width}
            onFollow={(e) => {
              e.stopPropagation();
              interacted();
              follow(exit);
            }}
          />
        ))}
        {settings.trigger === "keys" && settings.showKeys && <KeyBadges scene={scene} keyOf={keys.keyOf} lit={lit} />}
        {settings.trigger === "keys" && focus && <FocusRing key={focus.id} box={placeBox(focus.box, focus.place)} />}
        {hint && hintItem && <HintRing box={placeBox(hintItem.box, hintItem.place)} />}
      </svg>

      {quest && (
        <button
          type="button"
          key={quest.id}
          className="find-question"
          onPointerDown={(e) => {
            e.stopPropagation();
            ask(quest);
          }}
        >
          {quest.item && <Thumbnail item={quest.item} />}
          {quest.emoji && <span className="find-emoji">{quest.emoji}</span>}
          <span>{quest.question}</span>
          {quest.needed > 1 && (
            <span className="find-progress" aria-label={words.of(answered.size, quest.needed)}>
              {Array.from({ length: quest.needed }, (_, i) => (
                <span key={i} className={i < answered.size ? "done" : undefined} />
              ))}
            </span>
          )}
        </button>
      )}
      {found > 0 && (
        <div className="find-stars" aria-label={words.foundCount(found)}>
          {"⭐".repeat(Math.min(found, 10))}
          {found > 10 && <span className="find-count">{found}</span>}
        </div>
      )}
      {!questMode && settings.goal && (
        <div className={`scene-goal${allDiscovered ? " done" : ""}`} aria-label={words.discoveredCount(discovered.size, scene.items.length)}>
          <span className="scene-goal-star">{allDiscovered ? (bedtime ? "🌙" : "🎉") : "⭐"}</span>
          {discovered.size}/{scene.items.length}
        </div>
      )}
      {/* Counted to the end (party, the room gone dark or the picture coloured in). */}
      {!questMode && allDiscovered && (
        <GameEnd delayMs={END_BUTTONS_MS} onAgain={startOver} next={{ emoji: nextScene.emoji, name: nextScene.title, onNext: goToNextScene }} />
      )}
      {/* Colour mode with the key badges on: the space bar, small at the bottom, paints where nothing happens. */}
      {colouring && settings.trigger === "keys" && settings.showKeys && !allDiscovered && (
        <button
          type="button"
          className={`scene-space${spaceDown ? " down" : ""}`}
          aria-label={words.spaceBar}
          onPointerDown={(e) => {
            e.stopPropagation();
            paintSomewhere();
          }}
        >
          <span className="scene-space-top">
            <svg className="scene-space-bar" viewBox="-40 -14 80 28" aria-hidden>
              <path d="M-34 -8 V8 H34 V-8" />
            </svg>
          </span>
        </button>
      )}
      {!questMode && !touched && <p className="scene-prompt">{(colouring ? words.colourPrompts : words.prompts)[settings.trigger]}</p>}
      {/* Only shown by CSS on a phone held upright, where the wide picture gets tiny. */}
      <p className="scene-rotate">
        <span className="scene-rotate-phone" aria-hidden>
          📱
        </span>
        {words.rotate}
      </p>
      <BurstLayer bursts={bursts} />
    </div>
  );
}
