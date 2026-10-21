import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
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
  playNeigh,
  playCluck,
  playCrow,
  playCroak,
  playTweet,
  setSfxVolume,
} from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { assignKeys } from "./keys";
import type { ScenesSettings } from "./settings";
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
  neigh: playNeigh,
  cluck: playCluck,
  crow: playCrow,
  croak: playCroak,
};

/** Key presses closer together than this only spawn shapes. */
const MIN_KEY_MS = 600;
/** Find mode: a key press repeats the question at most this often. */
const REPEAT_QUESTION_MS = 3000;
/** Find mode: pause after a found item before the next question. */
const NEXT_QUESTION_MS = 2600;
/** Find mode: when the hint ring appears. */
const HINT_AFTER_MS = 8000;
const HINT_AFTER_MISSES = 2;
/** Without taps for this long, the picture starts moving by itself… */
const AMBIENT_IDLE_MS = 4000;
/** …one item every few seconds, at random. */
const AMBIENT_MIN_MS = 4000;
const AMBIENT_MAX_MS = 9000;
/** Hover mode: how long the pointer has to rest on an item, so just passing by doesn't count. */
const HOVER_DWELL_MS = 200;

const PROMPTS = { tap: "Tipp etwas an! 👆", hover: "Zeig auf etwas! 👆", keys: "Drück eine Taste! ⌨️" };

const PRAISE = ["Super!", "Toll!", "Prima!", "Ja, genau!", "Richtig!"];

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];
const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase("de-DE") + text.slice(1);

/** Per item: how often it was started (remounts restart the animation) and whether it is running. */
type Plays = Record<string, { count: number; playing: boolean }>;

export function ScenePlay({ scene, settings, speechLang }: { scene: Scene; settings: ScenesSettings; speechLang: string }) {
  const [plays, setPlays] = useState<Plays>({});
  const [target, setTarget] = useState<SceneItem | null>(null);
  const [hint, setHint] = useState(false);
  const [found, setFound] = useState(0);
  const [touched, setTouched] = useState(false);
  const { bursts, spawn } = useBursts();

  const targetRef = useRef<SceneItem | null>(null);
  const busyUntil = useRef(new Map<string, number>());
  const celebrating = useRef(false);
  const misses = useRef(0);
  const lastKey = useRef(0);
  const lastQuestion = useRef(0);
  const lastKeyItem = useRef<SceneItem | null>(null);
  const lastInteraction = useRef(0);
  const sentenceIndex = useRef(new Map<string, number>());
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const svgRef = useRef<SVGSVGElement>(null);

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
      if (settings.sounds) playRandomNote();
    },
    [spawn, settings.sounds],
  );

  /** Start the item's animation and (unless quiet) its sound. Returns false while it is still running. */
  const animate = useCallback(
    (item: SceneItem, quiet = false) => {
      const now = performance.now();
      if (now < (busyUntil.current.get(item.id) ?? 0)) return false;
      busyUntil.current.set(item.id, now + item.durationMs);
      setPlays((prev) => ({ ...prev, [item.id]: { count: (prev[item.id]?.count ?? 0) + 1, playing: true } }));
      later(() => setPlays((prev) => ({ ...prev, [item.id]: { ...prev[item.id], playing: false } })), item.durationMs);
      if (settings.sounds && !quiet) SOUNDS[item.sound]();
      return true;
    },
    [later, settings.sounds],
  );

  const ask = useCallback(
    (item: SceneItem, queue = false) => {
      lastQuestion.current = performance.now();
      say(`Wo ist ${item.name}?`, queue);
    },
    [say],
  );

  const newQuestion = useCallback(
    (queue: boolean) => {
      const next = pick(scene.items.filter((item) => item !== targetRef.current));
      targetRef.current = next;
      celebrating.current = false;
      misses.current = 0;
      setTarget(next);
      setHint(false);
      ask(next, queue);
    },
    [scene, ask],
  );

  // Settings can't change while playing, so this only runs once.
  useEffect(() => {
    if (settings.mode === "find") newQuestion(false);
  }, []);

  useEffect(() => {
    if (!target || !settings.hints) return;
    const timer = setTimeout(() => setHint(true), HINT_AFTER_MS);
    return () => clearTimeout(timer);
  }, [target, settings.hints]);

  // Ambient life (only if switched on): when nobody taps for a while, items move by themselves, silently.
  // In find mode the item being looked for stays still, so it isn't given away.
  useEffect(() => {
    if (!settings.ambient || settings.calm) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        if (performance.now() - lastInteraction.current > AMBIENT_IDLE_MS) {
          animate(pick(scene.items.filter((item) => item !== targetRef.current)), true);
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

  /**
   * An item was tapped, pointed at for a moment (hover mode) or its key was
   * pressed (keys mode). Hovering is quieter in find mode: wrong items only
   * move, so sweeping the mouse or a finger across the picture doesn't start a
   * stream of talk.
   */
  const activate = (item: SceneItem, x: number, y: number, how: "tap" | "hover" | "key") => {
    interacted();
    const wanted = targetRef.current;

    if (settings.mode === "explore" || !wanted) {
      if (animate(item)) say(describe(item));
      else if (how !== "hover") funBurst(x, y);
      return;
    }
    if (celebrating.current) {
      if (!animate(item) && how !== "hover") funBurst(x, y);
      return;
    }
    if (item === wanted) {
      celebrating.current = true;
      animate(item);
      for (let i = 0; i < 5; i++) spawn(x + (Math.random() - 0.5) * 200, y + (Math.random() - 0.5) * 200);
      if (settings.sounds) playChime();
      setHint(false);
      setFound((n) => n + 1);
      say(`${pick(PRAISE)} Das ist ${item.name}!`);
      later(() => newQuestion(true), NEXT_QUESTION_MS);
      return;
    }
    animate(item);
    if (how === "hover") return;
    // Wrong item: no "wrong", just say what it is and ask again.
    misses.current++;
    if (settings.hints && misses.current >= HINT_AFTER_MISSES) setHint(true);
    lastQuestion.current = performance.now();
    say(`Das ist ${item.name}. Wo ist ${wanted.name}?`);
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
  const itemsById = useMemo(() => new Map(scene.items.map((item) => [item.id, item])), [scene]);
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
        const key = e.key.toLocaleUpperCase("de-DE");
        const list = keys.byKey.get(key);
        const wanted = targetRef.current;
        let item: SceneItem;
        if (!list) item = pick(scene.items);
        else if (wanted && list.includes(wanted)) item = wanted;
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

      const wanted = targetRef.current;
      if (wanted) {
        if (!celebrating.current && now - lastQuestion.current > REPEAT_QUESTION_MS) ask(wanted);
        else funBurst();
        return;
      }
      // Exploring: every key brings another item to life.
      const item = pick(scene.items.filter((i) => i !== lastKeyItem.current));
      lastKeyItem.current = item;
      if (animate(item)) say(describe(item));
      else funBurst();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [scene, keys, screenPoint, settings.trigger, animate, ask, describe, funBurst, say]);

  return (
    <div
      className={`scene${settings.calm ? " calm" : ""}${settings.ambient && !settings.calm ? " lively" : ""}`}
      style={{ "--sky": scene.sky, "--ground": scene.ground } as CSSProperties}
      onPointerDown={onBackgroundPointer}
      onPointerMove={onPointerMove}
      onPointerLeave={endHover}
      onPointerUp={(e) => e.pointerType === "touch" && endHover()}
      onPointerCancel={endHover}
    >
      <svg ref={svgRef} className="scene-svg" viewBox={`0 0 ${scene.width} ${scene.height}`} preserveAspectRatio="xMidYMid meet">
        <scene.Background />
        {scene.items.map((item) => {
          const play = plays[item.id];
          const place = item.place;
          return (
            <g
              key={`${item.id}-${play?.count ?? 0}`}
              className={`scene-item item-${item.id}${play?.playing ? " playing" : ""}`}
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
        {settings.trigger === "keys" && settings.showKeys && <KeyBadges scene={scene} keyOf={keys.keyOf} />}
        {hint && target && <HintRing box={placeBox(target.box, target.place)} />}
      </svg>

      {target && (
        <button
          key={target.id}
          className="find-question"
          onPointerDown={(e) => {
            e.stopPropagation();
            ask(target);
          }}
        >
          <Thumbnail item={target} />
          <span>Wo ist {target.name}?</span>
        </button>
      )}
      {found > 0 && (
        <div className="find-stars" aria-label={`${found} gefunden`}>
          {"⭐".repeat(Math.min(found, 10))}
          {found > 10 && <span className="find-count">{found}</span>}
        </div>
      )}
      {settings.mode === "explore" && !touched && (
        <p className="scene-prompt">{PROMPTS[settings.trigger]}</p>
      )}
      <BurstLayer bursts={bursts} />
    </div>
  );
}

function HintRing({ box: [x, y, w, h] }: { box: Box }) {
  const pad = 14;
  return <rect className="scene-hint" x={x - pad} y={y - pad} width={w + 2 * pad} height={h + 2 * pad} rx={28} />;
}

/** Keys mode: each item's key in a little bubble at its top left corner. */
function KeyBadges({ scene, keyOf }: { scene: Scene; keyOf: Map<string, string> }) {
  const r = 13;
  // Each badge sits on its item; one that would cover an earlier badge moves aside.
  const taken: [number, number][] = [];
  const spots = scene.items.map((item) => {
    let [cx, cy] = badgeSpot(item, r);
    for (let step = 1; step < 8 && taken.some(([x, y]) => Math.hypot(x - cx, y - cy) < 2 * r + 2); step++) {
      cx += (step % 2 ? 1 : -1) * step * (2 * r + 2);
    }
    cx = Math.min(scene.width - r - 2, Math.max(r + 2, cx));
    taken.push([cx, cy]);
    return [cx, cy];
  });
  return (
    <g className="scene-keys" aria-hidden>
      {scene.items.map((item, i) => {
        const [cx, cy] = spots[i];
        return (
          <g key={item.id}>
            <circle cx={cx} cy={cy} r={r} />
            <text x={cx} y={cy}>
              {keyOf.get(item.id)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Where an item's key badge goes: its own spot, else just inside the top of its first hit area. */
function badgeSpot(item: SceneItem, r: number): [number, number] {
  if (item.badge) {
    const [x, y] = placeBox([...item.badge, 0, 0], item.place);
    return [x, y];
  }
  const [x, y, w, h] = placeBox(item.hitAreas?.[0] ?? item.box, item.place);
  return [x + w / 2, y + Math.min(h / 2, r + 4)];
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
