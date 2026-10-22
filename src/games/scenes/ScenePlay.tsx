import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import {
  playBark,
  playBeeps,
  playBoing,
  playChime,
  playDrops,
  playEngine,
  playKnocks,
  playQuack,
  playRandomNote,
  playRattle,
  playRotor,
  playSqueak,
  playMelody,
  playSniff,
  playPop,
  playBuzz,
  playRumble,
  playHum,
  playSaw,
  playHonk,
  playSiren,
  playBells,
  playRing,
  playCoo,
  playMeow,
  playMoo,
  playOink,
  playBaa,
  playCluck,
  playCrow,
  playNeigh,
  playHoot,
  playCroak,
  playRoar,
  playTrumpet,
  playChatter,
  playSquawk,
  playMunch,
  playSnap,
  playTweet,
  playBlub,
  playWhale,
  playPing,
  playDolphin,
  playLaunch,
  playTwinkle,
  playBeam,
  playRobot,
  playAlien,
  playAlarm,
  playTrill,
  playWhoosh,
  playFlush,
  playBlow,
  playScrub,
  playSplash,
  playTick,
  playPeck,
  playCuckoo,
  playKettle,
  playSizzle,
  playCrunch,
  playSleigh,
  playCrackle,
  playYawn,
  playMusicbox,
  playLullaby,
  playTrain,
  playJet,
  setSfxVolume,
} from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { ARROWS, middleItem, nextInDirection } from "./focus";
import { assignKeys } from "./keys";
import { nextQuest, questsFor, verb, type Quest } from "./quests";
import { isQuestMode, type ScenesSettings } from "./settings";
import { placeBox, type Box, type Scene, type SceneItem, type SceneSound } from "./types";

const SOUNDS: Record<SceneSound, () => void> = {
  engine: playEngine,
  beeps: playBeeps,
  tweet: playTweet,
  boing: playBoing,
  knocks: playKnocks,
  chime: playChime,
  drops: playDrops,
  rattle: playRattle,
  rotor: playRotor,
  quack: playQuack,
  bark: playBark,
  squeak: playSqueak,
  melody: playMelody,
  sniff: playSniff,
  pop: playPop,
  buzz: playBuzz,
  rumble: playRumble,
  hum: playHum,
  saw: playSaw,
  honk: playHonk,
  siren: playSiren,
  bells: playBells,
  ring: playRing,
  coo: playCoo,
  meow: playMeow,
  moo: playMoo,
  oink: playOink,
  baa: playBaa,
  cluck: playCluck,
  crow: playCrow,
  neigh: playNeigh,
  hoot: playHoot,
  croak: playCroak,
  roar: playRoar,
  trumpet: playTrumpet,
  chatter: playChatter,
  squawk: playSquawk,
  munch: playMunch,
  snap: playSnap,
  blub: playBlub,
  whale: playWhale,
  ping: playPing,
  dolphin: playDolphin,
  launch: playLaunch,
  twinkle: playTwinkle,
  beam: playBeam,
  robot: playRobot,
  alien: playAlien,
  alarm: playAlarm,
  trill: playTrill,
  whoosh: playWhoosh,
  flush: playFlush,
  blow: playBlow,
  scrub: playScrub,
  splash: playSplash,
  tick: playTick,
  peck: playPeck,
  cuckoo: playCuckoo,
  kettle: playKettle,
  sizzle: playSizzle,
  crunch: playCrunch,
  sleigh: playSleigh,
  crackle: playCrackle,
  yawn: playYawn,
  musicbox: playMusicbox,
  train: playTrain,
  jet: playJet,
};

/** Key presses closer together than this only spawn shapes. */
const MIN_KEY_MS = 600;
/** Find modes: a key press repeats the question at most this often. */
const REPEAT_QUESTION_MS = 3000;
/** Find modes: pause after a found item before the next question. */
const NEXT_QUESTION_MS = 2600;
/** Sound riddle: the question is spoken after the sound, and the sound is repeated after a wrong tap. */
const RIDDLE_QUESTION_MS = 1500;
const RIDDLE_REPEAT_MS = 2200;
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

const PROMPTS = { tap: "Tipp etwas an! 👆", hover: "Zeig auf etwas! 👆", keys: "Drück eine Taste! ⌨️" };
const COLOUR_PROMPTS = {
  tap: "Tipp etwas an – es wird bunt! 🖍️",
  hover: "Zeig auf etwas – es wird bunt! 🖍️",
  keys: "Drück eine Taste – es wird bunt! 🖍️",
};

const PRAISE = ["Super!", "Toll!", "Prima!", "Ja, genau!", "Richtig!"];

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];
const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase("de-DE") + text.slice(1);

/** Per item: how often it was started (remounts restart the animation) and whether it is running. */
type Plays = Record<string, { count: number; playing: boolean }>;
/** Keys mode: the badge that lights up; the count restarts its animation on every press. */
type Lit = { id: string; count: number };

/** Colour mode: how much of each colour is left in the grey picture; the rest is white. */
const GREY_SLOPE = 0.55;

/** Colour mode: a colour as the pale grey it has in the uncoloured picture (same as the grey filter). */
function paleGrey(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const luminance = 0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  const v = Math.round(luminance * GREY_SLOPE + 255 * (1 - GREY_SLOPE));
  return `rgb(${v} ${v} ${v})`;
}

export function ScenePlay({ scene, settings, speechLang }: { scene: Scene; settings: ScenesSettings; speechLang: string }) {
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
  /** Bedtime pictures: everything is asleep and the room is dark. */
  const [night, setNight] = useState(false);
  /** Keys mode: the item in the glowing frame, moved with the arrow keys; hidden once an item starts. */
  const [focus, setFocus] = useState<SceneItem | null>(null);
  const [lit, setLit] = useState<Lit | null>(null);
  const { bursts, spawn } = useBursts();

  const questRef = useRef<Quest | null>(null);
  const answeredRef = useRef<ReadonlySet<string>>(answered);
  const discoveredRef = useRef<ReadonlySet<string>>(discovered);
  const focusRef = useRef<SceneItem | null>(null);
  const busyUntil = useRef(new Map<string, number>());
  const celebrating = useRef(false);
  const misses = useRef(0);
  const riddleRepeat = useRef(false);
  const lastKey = useRef(0);
  const lastQuestion = useRef(0);
  const lastKeyItem = useRef<SceneItem | null>(null);
  const lastInteraction = useRef(0);
  const sentenceIndex = useRef(new Map<string, number>());
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const svgRef = useRef<SVGSVGElement>(null);
  // An SVG id without the colons React puts in, so it can go into url(#…).
  const greyId = `scene-grey-${useId().replace(/[^\w-]/g, "")}`;

  const questMode = isQuestMode(settings.mode);
  const colouring = settings.mode === "colour";
  /** In the sound riddle the sounds are the game, so they always play. */
  const soundsOn = settings.sounds || settings.mode === "sounds";
  const quests = useMemo(() => questsFor(settings.mode, scene), [settings.mode, scene]);
  const itemsById = useMemo(() => new Map(scene.items.map((item) => [item.id, item])), [scene]);
  const allDiscovered = discovered.size === scene.items.length;
  /** Bedtime picture while exploring: tapped items fall asleep, and the end is a quiet night instead of the party. */
  const bedtime = !!scene.bedtime && !colouring && !questMode;

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
    setSfxVolume(settings.calm ? 0.4 : 1);
  }, [settings.calm]);

  const say = useCallback(
    (text: string, queue = false) => {
      if (settings.speech) speak(text, speechLang, { queue, rate: settings.calm ? 0.75 : 0.85 });
    },
    [settings.speech, settings.calm, speechLang],
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

  /** Start the item's animation and (unless quiet) its sound. Returns false while it is still running. */
  const animate = useCallback(
    (item: SceneItem, quiet = false) => {
      const now = performance.now();
      if (now < (busyUntil.current.get(item.id) ?? 0)) return false;
      busyUntil.current.set(item.id, now + item.durationMs);
      setPlays((prev) => ({ ...prev, [item.id]: { count: (prev[item.id]?.count ?? 0) + 1, playing: true } }));
      later(() => setPlays((prev) => ({ ...prev, [item.id]: { ...prev[item.id], playing: false } })), item.durationMs);
      if (soundsOn && !quiet) SOUNDS[item.sound]();
      return true;
    },
    [later, soundsOn],
  );

  /** Asks the question; a sound riddle plays its sound first and then asks "Wer macht das?". */
  const ask = useCallback(
    (quest: Quest, queue = false) => {
      lastQuestion.current = performance.now();
      if (!quest.sound) {
        say(quest.question, queue);
        return;
      }
      SOUNDS[quest.sound]();
      later(() => say(quest.question, true), RIDDLE_QUESTION_MS);
    },
    [say, later],
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
  const hintItem = quest?.answers.find((item) => !answered.has(item.id));
  useEffect(() => {
    if (!quest || !settings.hints) return;
    const timer = setTimeout(() => setHint(true), HINT_AFTER_MS);
    return () => clearTimeout(timer);
  }, [quest, answered, settings.hints]);

  // Ambient life (only if switched on): when nobody taps for a while, items move by themselves, silently.
  // While something is looked for, the answers stay still, so they aren't given away.
  useEffect(() => {
    if (!settings.ambient || settings.calm) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        if (performance.now() - lastInteraction.current > AMBIENT_IDLE_MS) {
          animate(pick(scene.items.filter((item) => !questRef.current?.answers.includes(item))), true);
        }
        schedule();
      }, AMBIENT_MIN_MS + Math.random() * (AMBIENT_MAX_MS - AMBIENT_MIN_MS));
    };
    schedule();
    return () => clearTimeout(timer);
  }, [scene, animate, settings.ambient, settings.calm]);

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
    say(colouring ? "Hurra! Das ganze Bild ist bunt!" : "Hurra! Du hast alles entdeckt!");
    scene.items.forEach((item, i) => later(() => animate(item, true), i * 40));
    for (let i = 0; i < 14; i++) later(() => spawn(), i * 140);
    later(() => setPartying(false), PARTY_MS);
  };

  /** Bedtime picture: everything is asleep, so the room goes dark – softly, without dancing or shapes. */
  const goodNight = () => {
    setNight(true);
    if (soundsOn) playLullaby();
    say("Gute Nacht! Alle schlafen jetzt.");
  };

  const startOver = () => {
    discoveredRef.current = new Set();
    setDiscovered(discoveredRef.current);
    setNight(false);
  };

  /** Explore and colour mode: count the item (and colour it in), and celebrate when it was the last one. */
  const discover = (item: SceneItem, x: number, y: number) => {
    if (!colouring && !settings.goal && !bedtime) return;
    if (discoveredRef.current.has(item.id)) return;
    discoveredRef.current = new Set(discoveredRef.current).add(item.id);
    setDiscovered(discoveredRef.current);
    // A splash of paint where the colour comes back.
    if (colouring) for (let i = 0; i < 3; i++) spawn(x + (Math.random() - 0.5) * 120, y + (Math.random() - 0.5) * 120);
    if (discoveredRef.current.size !== scene.items.length) return;
    if (bedtime) later(goodNight, PARTY_AFTER_MS);
    else if (settings.goal) later(party, PARTY_AFTER_MS);
  };

  /** Chain reaction: the items after this one react one by one, each telling its part of the story. */
  const runChain = (item: SceneItem) => {
    const chain = scene.chains?.find((c) => c.start === item.id);
    chain?.steps.forEach((step, i) => {
      later(() => {
        const next = itemsById.get(step.item);
        if (next && animate(next)) say(settings.announce === "name" ? describe(next) : step.sentence, true);
      }, (i + 1) * CHAIN_STEP_MS);
    });
  };

  /**
   * An item was tapped, pointed at for a moment (hover mode) or its key was
   * pressed (keys mode). Hovering is quieter in the find modes: wrong items only
   * move, so sweeping the mouse or a finger across the picture doesn't start a
   * stream of talk.
   */
  const activate = (item: SceneItem, x: number, y: number, how: "tap" | "hover" | "key") => {
    interacted();
    // The arrow keys go on from the activated item, but it gets no frame; its key badge lights up instead.
    if (settings.trigger === "keys") {
      focusRef.current = item;
      setFocus(null);
      setLit((prev) => ({ id: item.id, count: (prev?.count ?? 0) + 1 }));
    }
    const quest = questRef.current;

    if (!quest) {
      const started = animate(item);
      if (started) say(describe(item));
      else if (how !== "hover") funBurst(x, y);
      discover(item, x, y);
      if (started) runChain(item);
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
      say(`${pick(PRAISE)} ${quest.praise(item)}`);
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
    if (settings.hints && misses.current >= HINT_AFTER_MISSES) setHint(true);
    lastQuestion.current = performance.now();
    if (!quest.sound) {
      say(`Das ${verb(item)} ${item.name}. ${quest.question}`);
      return;
    }
    say(`Das ${verb(item)} ${item.name}. Hör noch mal!`);
    if (riddleRepeat.current) return;
    riddleRepeat.current = true;
    later(() => {
      riddleRepeat.current = false;
      if (questRef.current === quest && !celebrating.current) SOUNDS[quest.sound!]();
    }, RIDDLE_REPEAT_MS);
  };

  // The key handler is set up once; this way it always calls the current activate.
  const activateRef = useRef(activate);
  activateRef.current = activate;

  /** Where an item is on screen, for the shapes that fly out of it. */
  const screenPoint = useCallback((item: SceneItem): [number, number] => {
    const [x, y, w, h] = placeBox(item.box, item.place);
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return [window.innerWidth / 2, window.innerHeight / 2];
    const point = new DOMPoint(x + w / 2, y + h / 2).matrixTransform(matrix);
    return [point.x, point.y];
  }, []);

  const keys = useMemo(() => assignKeys(scene.items), [scene]);
  const keyTurns = useRef(new Map<string, number>());

  const tapItem = (item: SceneItem, e: PointerEvent) => {
    e.stopPropagation();
    activate(item, e.clientX, e.clientY, "tap");
  };

  const onBackgroundPointer = (e: PointerEvent) => {
    interacted();
    funBurst(e.clientX, e.clientY);
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
    const id = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-item]")?.getAttribute("data-item") ?? null;
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

      // Keys mode: the key's own item; items sharing a key take turns.
      // Only the item's own animation limits how fast keys can be pressed.
      if (settings.trigger === "keys") {
        // Arrow keys move the glowing frame, Space and Enter start the item in it.
        const arrow = ARROWS[e.key];
        if (arrow) {
          interacted();
          const from = focusRef.current;
          moveFocus(from ? nextInDirection(scene.items, from, arrow) : middleItem(scene.items, scene.width, scene.height));
          if (settings.sounds) playRandomNote();
          return;
        }
        const key = e.key.toLocaleUpperCase("de-DE");
        const list = keys.byKey.get(key);
        const open = (i: SceneItem) => questRef.current?.answers.includes(i) && !answeredRef.current.has(i.id);
        let item: SceneItem;
        if (e.key === " " || e.key === "Enter") item = focusRef.current ?? pick(scene.items);
        else if (!list) item = pick(scene.items);
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
      const item = pick(scene.items.filter((i) => i !== lastKeyItem.current));
      lastKeyItem.current = item;
      const [x, y] = screenPoint(item);
      activateRef.current(item, x, y, "key");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [scene, keys, screenPoint, settings.trigger, settings.sounds, ask, funBurst, moveFocus]);

  // Colour mode: everything not yet tapped is pale grey, the background too until the picture is done.
  const grey = colouring && !allDiscovered;
  const greyFilter = `url(#${greyId})`;
  const sceneClass = [
    "scene",
    settings.calm && "calm",
    settings.ambient && !settings.calm && "lively",
    colouring && "colouring",
    partying && "party",
    night && "night",
  ]
    .filter(Boolean)
    .join(" ");

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
          </defs>
        )}
        <g filter={grey ? greyFilter : undefined}>
          <scene.Background />
        </g>
        {scene.items.map((item, i) => {
          const play = plays[item.id];
          const place = item.place;
          return (
            <g
              key={`${item.id}-${play?.count ?? 0}`}
              className={`scene-item item-${item.id}${play?.playing ? " playing" : ""}${bedtime && discovered.has(item.id) ? " asleep" : ""}`}
              style={{ "--party-i": i } as CSSProperties}
              filter={colouring && !discovered.has(item.id) ? greyFilter : undefined}
              data-item={item.id}
              role="button"
              aria-label={capitalize(item.name)}
              onPointerDown={(e) => tapItem(item, e)}
            >
              <g transform={place && `translate(${place.x} ${place.y}) scale(${place.scale})`}>
                {item.shadow && (
                  <ellipse
                    className="scene-shadow"
                    cx={item.shadow[0]}
                    cy={item.shadow[1]}
                    rx={item.shadow[2]}
                    ry={Math.max(6, item.shadow[2] * 0.12)}
                  />
                )}
                <item.Art />
                {(item.hitAreas ?? [item.box]).map(([x, y, w, h], i) => (
                  <rect key={i} className="scene-hit" x={x} y={y} width={w} height={h} />
                ))}
              </g>
            </g>
          );
        })}
        {settings.trigger === "keys" && settings.showKeys && <KeyBadges scene={scene} keyOf={keys.keyOf} lit={lit} />}
        {settings.trigger === "keys" && focus && <FocusRing key={focus.id} box={placeBox(focus.box, focus.place)} />}
        {hint && hintItem && <HintRing box={placeBox(hintItem.box, hintItem.place)} />}
      </svg>

      {quest && (
        <button
          key={quest.id}
          className="find-question"
          onPointerDown={(e) => {
            e.stopPropagation();
            ask(quest);
          }}
        >
          {quest.item && <Thumbnail item={quest.item} />}
          {quest.sound && <span className="find-emoji">🔊</span>}
          {quest.emoji && <span className="find-emoji">{quest.emoji}</span>}
          <span>{quest.question}</span>
          {quest.needed > 1 && (
            <span className="find-progress" aria-label={`${answered.size} von ${quest.needed}`}>
              {Array.from({ length: quest.needed }, (_, i) => (
                <span key={i} className={i < answered.size ? "done" : undefined} />
              ))}
            </span>
          )}
        </button>
      )}
      {found > 0 && (
        <div className="find-stars" aria-label={`${found} gefunden`}>
          {"⭐".repeat(Math.min(found, 10))}
          {found > 10 && <span className="find-count">{found}</span>}
        </div>
      )}
      {!questMode && settings.goal && (
        <div className={`scene-goal${allDiscovered ? " done" : ""}`} aria-label={`${discovered.size} von ${scene.items.length} entdeckt`}>
          <span className="scene-goal-star">{allDiscovered ? (bedtime ? "🌙" : "🎉") : "⭐"}</span>
          {discovered.size}/{scene.items.length}
          {allDiscovered && (
            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
                startOver();
              }}
            >
              {colouring ? "🖍️ Nochmal" : "🔄 Nochmal"}
            </button>
          )}
        </div>
      )}
      {!questMode && !touched && <p className="scene-prompt">{(colouring ? COLOUR_PROMPTS : PROMPTS)[settings.trigger]}</p>}
      {/* Only shown by CSS on a phone held upright, where the wide picture gets tiny. */}
      <p className="scene-rotate">
        <span className="scene-rotate-phone" aria-hidden>
          📱
        </span>
        Quer halten – dann wird das Bild groß
      </p>
      <BurstLayer bursts={bursts} />
    </div>
  );
}

function HintRing({ box: [x, y, w, h] }: { box: Box }) {
  const pad = 14;
  return <rect className="scene-hint" x={x - pad} y={y - pad} width={w + 2 * pad} height={h + 2 * pad} rx={28} />;
}

/** Keys mode: the glowing frame the arrow keys move around. */
function FocusRing({ box: [x, y, w, h] }: { box: Box }) {
  const pad = 10;
  const rect = { x: x - pad, y: y - pad, width: w + 2 * pad, height: h + 2 * pad, rx: 24 };
  return (
    <g className="scene-focus" aria-hidden>
      <rect className="scene-focus-glow" {...rect} />
      <rect className="scene-focus-line" {...rect} />
    </g>
  );
}

const BADGE_R = 13;

/**
 * Keys mode: each item's key in a little bubble next to it. The bubble of the
 * item that was just started lights up, so the child sees where to look.
 */
function KeyBadges({ scene, keyOf, lit }: { scene: Scene; keyOf: Map<string, string>; lit: Lit | null }) {
  const spots = useMemo(() => badgeSpots(scene, BADGE_R), [scene]);
  return (
    <g className="scene-keys" aria-hidden>
      {scene.items.map((item, i) => {
        const [cx, cy] = spots[i];
        const isLit = lit?.id === item.id;
        return (
          <g key={isLit ? `${item.id}-${lit.count}` : item.id} className={isLit ? "lit" : undefined}>
            <circle className="scene-key-glow" cx={cx} cy={cy} r={BADGE_R} />
            <g className="scene-key-cap">
              <circle cx={cx} cy={cy} r={BADGE_R} />
              <text x={cx} y={cy}>
                {keyOf.get(item.id)}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}

/**
 * Where the key badges go: just outside each item, at the spot that covers the
 * least of it, of the other items and of the badges placed before. Above the
 * item is preferred, then the sides, then below.
 */
function badgeSpots(scene: Scene, r: number): [number, number][] {
  const areas = scene.items.flatMap((item) => (item.hitAreas ?? [item.box]).map((box) => placeBox(box, item.place)));
  const covered = (cx: number, cy: number) =>
    areas.reduce((sum, [x, y, w, h]) => {
      const dx = Math.min(cx + r, x + w) - Math.max(cx - r, x);
      const dy = Math.min(cy + r, y + h) - Math.max(cy - r, y);
      return dx > 0 && dy > 0 ? sum + dx * dy : sum;
    }, 0);
  const gap = r + 4;
  const taken: [number, number][] = [];
  return scene.items.map((item) => {
    const [x, y, w, h] = placeBox(item.box, item.place);
    const candidates: [number, number][] = [
      ...[0.5, 0.25, 0.75, 0, 1].map((t): [number, number] => [x + w * t, y - gap]),
      ...[r, h / 2].flatMap((dy): [number, number][] => [
        [x - gap, y + dy],
        [x + w + gap, y + dy],
      ]),
      ...[0.5, 0, 1].map((t): [number, number] => [x + w * t, y + h + gap]),
    ];
    let best = candidates[0];
    let bestScore = Infinity;
    candidates.forEach(([cx, cy], order) => {
      const outside = cx < r || cy < r || cx > scene.width - r || cy > scene.height - r;
      const crowded = taken.some(([tx, ty]) => Math.hypot(tx - cx, ty - cy) < 2 * r + 4);
      // Order only breaks ties: a free spot further round always beats a covering one.
      const score = covered(cx, cy) + (outside ? 1e6 : 0) + (crowded ? 1e5 : 0) + order;
      if (score < bestScore) {
        best = [cx, cy];
        bestScore = score;
      }
    });
    taken.push(best);
    return best;
  });
}

/** The item drawn on its own, for the find question. */
function Thumbnail({ item }: { item: SceneItem }) {
  const [x, y, w, h] = item.box;
  return (
    <svg className="find-thumb" viewBox={`${x} ${y} ${w} ${h}`} aria-hidden>
      <item.Art />
    </svg>
  );
}
