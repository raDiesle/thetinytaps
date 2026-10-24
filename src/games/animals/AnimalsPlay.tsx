import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { playChime, playMunch, playPop, playRandomNote, playYuck } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { ANIMALS, FOODS, texts, type Animal, type Food } from "./content";
import { HOMES, HomeDrawing, type Home } from "./homes";
import type { AnimalsSettings } from "./settings";

/** A finger that moves less than this is a tap, not a drag. */
const TAP_PX = 12;
/** Time to watch the munching or the moving in before the next animal comes. */
const CELEBRATE_MS = 2800;
/** Time for the "Bäh!" or the peeking neighbour before the child can try again. */
const WRONG_MS = 1400;
/** Dropped this close to a target (as a share of its size) still counts: small fingers don't aim well. */
const SNAP = 0.35;

type Round =
  | { id: number; kind: "feed"; animal: Animal; foods: Food[]; correct: number }
  | { id: number; kind: "home"; animal: Animal; homes: Home[]; correct: number };

/** What is being dragged: a food (its index) or, when looking for a home, the animal itself. */
type Mover = number | "animal";

interface Offset {
  x: number;
  y: number;
  scale?: number;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const centre = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

/** Whether (x, y) lies on `r`, or no further than `SNAP` of its size away. */
function near(r: DOMRect, x: number, y: number) {
  const margin = SNAP * Math.max(r.width, r.height);
  return x > r.left - margin && x < r.right + margin && y > r.top - margin && y < r.bottom + margin;
}

const moveStyle = (o: Offset | null): CSSProperties | undefined =>
  o ? { translate: `${o.x}px ${o.y}px`, scale: o.scale === undefined ? undefined : `${o.scale}` } : undefined;

/** "Was gehört zum Tier?": food to the hungry animal (N-08), or the animal to its home (N-09). */
export function AnimalsPlay({ lang, settings }: { lang: string; settings: AnimalsSettings }) {
  const [round, setRound] = useState<Round | null>(null);
  const [drag, setDrag] = useState<{ who: Mover; x: number; y: number } | null>(null);
  /** The target the dragged thing is over, so it can lean towards it. */
  const [hover, setHover] = useState<Mover | null>(null);
  /** The right thing on its way to the animal or into the home. */
  const [landed, setLanded] = useState<{ who: Mover; to: Offset } | null>(null);
  const [outcome, setOutcome] = useState<{ pick: number; ok: boolean } | null>(null);
  /** The keyboard frame; appears with the first key. */
  const [focus, setFocus] = useState<number | null>(null);
  const focusRef = useRef<number | null>(null);
  /** Set from a pick until the child may pick again; a ref, since a key can come before the next render. */
  const busy = useRef(false);
  /** Bumped to make the animal or a food hop again, e.g. "drag me" when tapping isn't enough. */
  const [nudge, setNudge] = useState<{ who: Mover; n: number } | null>(null);
  const [stars, setStars] = useState(0);
  const { bursts, spawn } = useBursts();

  const nextId = useRef(0);
  const decks = useRef({ feed: [] as Animal[], home: [] as Animal[] });
  const lastAnimal = useRef<Animal | null>(null);
  const lastKind = useRef<Round["kind"]>(settings.mode === "home" ? "feed" : "home");
  const animalRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLSpanElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pointer = useRef<{ who: Mover; id: number; x: number; y: number; moved: boolean } | null>(null);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const later = useCallback((ms: number, run: () => void) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      run();
    }, ms);
    timers.current.add(timer);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const say = useCallback(
    (text: string, queue = false) => {
      if (settings.speech) speak(text, lang, { queue, rate: 0.85 });
    },
    [settings.speech, lang],
  );

  const prompt = (r: Round) => (r.kind === "feed" ? texts.hungry(r.animal) : texts.whereLives(r.animal));

  /** Go through all animals in random order before one comes again, and never the same one twice in a row. */
  const drawAnimal = useCallback((kind: Round["kind"]) => {
    const deck = decks.current[kind];
    if (deck.length === 0) deck.push(...shuffle(ANIMALS.filter((a) => (kind === "feed" ? a.food : a.home))));
    let animal = deck.pop()!;
    if (animal === lastAnimal.current && deck.length > 0) {
      const other = deck.pop()!;
      deck.unshift(animal);
      animal = other;
    }
    lastAnimal.current = animal;
    return animal;
  }, []);

  const nextRound = useCallback(() => {
    const kind = settings.mix ? (lastKind.current === "feed" ? "home" : "feed") : settings.mode === "home" ? "home" : "feed";
    lastKind.current = kind;
    const animal = drawAnimal(kind);
    const count = Number(settings.choices);
    const id = nextId.current++;
    let next: Round;
    if (kind === "feed") {
      const right = animal.food!;
      const foods = shuffle([right, ...shuffle(FOODS.filter((f) => f.id !== right.id)).slice(0, count - 1)]);
      next = { id, kind, animal, foods, correct: foods.indexOf(right) };
    } else {
      const right = HOMES[animal.home!];
      const homes = shuffle([right, ...shuffle(Object.values(HOMES).filter((h) => h.id !== right.id)).slice(0, count - 1)]);
      next = { id, kind, animal, homes, correct: homes.indexOf(right) };
    }
    setRound(next);
    setDrag(null);
    setHover(null);
    setLanded(null);
    setOutcome(null);
    setFocus(null);
    focusRef.current = null;
    busy.current = false;
    say(prompt(next));
    if (settings.sounds) later(400, () => animal.sound?.());
  }, [settings.mode, settings.mix, settings.choices, settings.sounds, drawAnimal, say, later]);

  // Start with an animal right away; settings can't change while playing.
  useEffect(() => nextRound(), []);

  const funBurst = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
    },
    [spawn, settings.sounds],
  );

  /** The child picked option `index`; `from` is how far the dragged thing already is from its place. */
  const choose = (index: number, from: Offset = { x: 0, y: 0 }) => {
    if (!round || busy.current) return;
    busy.current = true;
    const ok = index === round.correct;
    setOutcome({ pick: index, ok });
    setDrag(null);
    setHover(null);

    if (!ok) {
      if (round.kind === "feed") {
        if (settings.sounds) playYuck();
        say(texts.yuck(round.animal));
      } else {
        const resident = ANIMALS.find((a) => a.home === round.homes[index].id)!;
        if (settings.sounds) later(300, () => resident.sound?.());
        say(texts.livesHere(resident));
        say(prompt(round), true);
      }
      later(WRONG_MS, () => {
        busy.current = false;
        setOutcome(null);
      });
      return;
    }

    const animalBox = animalRef.current?.getBoundingClientRect();
    if (round.kind === "feed") {
      // The food flies into the animal's mouth, a bit below the middle of its face.
      const food = optionRefs.current[index]?.querySelector(".ap-food")?.getBoundingClientRect();
      if (food && animalBox) {
        const start = centre(food);
        const mouth = { x: animalBox.left + animalBox.width / 2, y: animalBox.top + animalBox.height * 0.6 };
        setLanded({ who: index, to: { x: mouth.x - start.x + from.x, y: mouth.y - start.y + from.y, scale: 0.3 } });
      }
      if (settings.sounds) later(450, playMunch);
      say(texts.yummy(round.animal, round.foods[index]));
    } else {
      // The animal walks into its home and stays in the doorway, small enough to fit.
      const home = round.homes[index];
      const drawing = optionRefs.current[index]?.querySelector("svg")?.getBoundingClientRect();
      const emoji = emojiRef.current;
      if (drawing && animalBox && emoji) {
        const start = centre(emoji.getBoundingClientRect());
        const spot = {
          x: drawing.left + (home.spot[0] / 120) * drawing.width,
          y: drawing.top + (home.spot[1] / 120) * drawing.height,
        };
        setLanded({
          who: "animal",
          to: { x: spot.x - start.x + from.x, y: spot.y - start.y + from.y, scale: (home.fit * drawing.width) / emoji.offsetHeight },
        });
      }
      if (settings.sounds) {
        later(650, playPop);
        later(900, () => round.animal.sound?.());
      }
      say(texts.movedIn(round.animal, home.inPhrase));
    }
    if (settings.sounds) later(200, playChime);
    setStars((n) => n + 1);
    later(700, () => {
      for (let i = 0; i < 8; i++) spawn();
    });
    later(CELEBRATE_MS, nextRound);
  };

  /** Tapping the animal asks again; it makes its noise and hops. */
  const askAgain = () => {
    if (!round) return;
    say(prompt(round));
    if (settings.sounds) round.animal.sound?.();
    setNudge((prev) => ({ who: "animal", n: (prev?.n ?? 0) + 1 }));
  };

  const onAnimalTap = (e: PointerEvent) => {
    e.stopPropagation();
    askAgain();
  };

  /** Where a dragged thing would land if let go at (x, y). */
  const targetAt = (who: Mover, x: number, y: number): Mover | null => {
    if (who !== "animal") {
      const box = animalRef.current?.getBoundingClientRect();
      return box && near(box, x, y) ? "animal" : null;
    }
    let best: number | null = null;
    let bestDistance = Infinity;
    optionRefs.current.forEach((el, i) => {
      const box = el?.getBoundingClientRect();
      if (!box || !near(box, x, y)) return;
      const c = centre(box);
      const distance = Math.hypot(c.x - x, c.y - y);
      if (distance < bestDistance) {
        best = i;
        bestDistance = distance;
      }
    });
    return best;
  };

  const onMoverDown = (who: Mover) => (e: PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!round || outcome || pointer.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointer.current = { who, id: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
  };

  const onMoverMove = (e: PointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    const x = e.clientX - p.x;
    const y = e.clientY - p.y;
    if (!p.moved && Math.hypot(x, y) < TAP_PX) return;
    p.moved = true;
    setDrag({ who: p.who, x, y });
    setHover(targetAt(p.who, e.clientX, e.clientY));
  };

  const onMoverUp = (e: PointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    pointer.current = null;
    if (!p.moved) {
      if (p.who === "animal") askAgain();
      else if (settings.tap) choose(p.who);
      else setNudge((prev) => ({ who: p.who, n: (prev?.n ?? 0) + 1 }));
      return;
    }
    const target = targetAt(p.who, e.clientX, e.clientY);
    const from = { x: e.clientX - p.x, y: e.clientY - p.y };
    if (target === null) {
      // Back to its place.
      setDrag(null);
      setHover(null);
    } else choose(p.who === "animal" ? (target as number) : p.who, from);
  };

  const onMoverCancel = () => {
    pointer.current = null;
    setDrag(null);
    setHover(null);
  };

  const onHomeDown = (index: number) => (e: PointerEvent) => {
    e.stopPropagation();
    if (settings.tap) choose(index);
    else setNudge((prev) => ({ who: "animal", n: (prev?.n ?? 0) + 1 }));
  };

  // Arrow keys (or any key) move the frame, Space or Enter picks, 1–4 pick straight away.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || !round || e.key === "Escape") return;
      if (outcome) {
        funBurst();
        return;
      }
      const count = round.kind === "feed" ? round.foods.length : round.homes.length;
      const digit = Number(e.key);
      // Read and set through the ref: fast key presses come before React has rendered the last one.
      const move = (to: number) => {
        focusRef.current = to;
        setFocus(to);
      };
      const current = focusRef.current;
      if (Number.isInteger(digit) && digit >= 1 && digit <= count) {
        move(digit - 1);
        choose(digit - 1);
      } else if (e.key === "Enter" || e.key === " ") {
        if (current === null) move(0);
        else choose(current);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        move(((current ?? 0) - 1 + count) % count);
      } else {
        move(current === null ? 0 : (current + 1) % count);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!round) return null;

  const offsetOf = (who: Mover): Offset | null => (landed?.who === who ? landed.to : drag?.who === who ? { x: drag.x, y: drag.y } : null);
  const moverClass = (who: Mover) =>
    `${drag?.who === who ? " dragging" : ""}${landed?.who === who ? " landed" : ""}${nudge?.who === who && !drag ? ` nudge-${nudge.n % 2}` : ""}`;

  const won = outcome?.ok === true;
  const yuck = outcome?.ok === false && round.kind === "feed";

  const animal = (
    <div
      ref={animalRef}
      key={`animal-${round.id}`}
      className={`ap-animal${round.kind === "home" ? moverClass("animal") : ""}${hover === "animal" ? " near" : ""}${
        won && round.kind === "feed" ? " munch" : ""
      }${yuck ? " yuck" : ""}`}
      style={round.kind === "home" ? moveStyle(offsetOf("animal")) : undefined}
      onPointerDown={round.kind === "home" ? onMoverDown("animal") : onAnimalTap}
      onPointerMove={onMoverMove}
      onPointerUp={onMoverUp}
      onPointerCancel={onMoverCancel}
    >
      <span ref={emojiRef} className="ap-emoji" role="img" aria-label={round.animal.name}>
        {round.animal.emoji}
      </span>
      {settings.names && <span className="ap-name">{round.animal.name}</span>}
      {yuck && <span className="ap-bubble">Bäh!</span>}
      {won && round.kind === "feed" && (
        <>
          <span className="ap-bubble thanks">Danke!</span>
          <span className="ap-hearts" aria-hidden>
            <span>💖</span>
            <span>💛</span>
            <span>💖</span>
          </span>
        </>
      )}
    </div>
  );

  const options =
    round.kind === "feed" ? (
      <div className="ap-options" style={{ "--n": round.foods.length } as CSSProperties}>
        {round.foods.map((food, i) => (
          <div
            key={`${round.id}-${food.id}`}
            ref={(el) => {
              optionRefs.current[i] = el;
            }}
            className={`ap-option ap-plate${focus === i ? " focused" : ""}`}
            onPointerDown={onMoverDown(i)}
            onPointerMove={onMoverMove}
            onPointerUp={onMoverUp}
            onPointerCancel={onMoverCancel}
          >
            <span
              className={`ap-food ap-emoji${moverClass(i)}${outcome?.pick === i && !outcome.ok ? " refused" : ""}`}
              style={moveStyle(offsetOf(i))}
              role="img"
              aria-label={food.name}
            >
              {food.emoji}
            </span>
            {settings.names && <span className="ap-name">{food.name}</span>}
          </div>
        ))}
      </div>
    ) : (
      <div className="ap-options" style={{ "--n": round.homes.length } as CSSProperties}>
        {round.homes.map((home, i) => {
          const peek = outcome?.pick === i && !outcome.ok;
          const resident = peek ? ANIMALS.find((a) => a.home === home.id) : undefined;
          return (
            <div
              key={`${round.id}-${home.id}`}
              ref={(el) => {
                optionRefs.current[i] = el;
              }}
              className={`ap-option ap-home${focus === i ? " focused" : ""}${hover === i ? " near" : ""}${
                won && outcome.pick === i ? " happy" : ""
              }${peek ? " peek" : ""}`}
              onPointerDown={onHomeDown(i)}
            >
              <div className="ap-home-box">
                <HomeDrawing home={home} />
                {resident && (
                  <span
                    className="ap-resident ap-emoji"
                    style={
                      {
                        left: `${(home.spot[0] / 120) * 100}%`,
                        top: `${(home.spot[1] / 120) * 100}%`,
                        "--fit": home.fit,
                      } as CSSProperties
                    }
                    aria-hidden
                  >
                    {resident.emoji}
                  </span>
                )}
              </div>
              {settings.names && <span className="ap-name">{home.name}</span>}
            </div>
          );
        })}
      </div>
    );

  return (
    <div className={`animals-play kind-${round.kind}`} onPointerDown={(e) => funBurst(e.clientX, e.clientY)}>
      <p key={round.id} className="ap-prompt">
        {prompt(round)}
      </p>
      {/* Up in the picture things stand on the horizon; the ground in front is where the child's things are. */}
      <div className="ap-top">{round.kind === "home" ? options : animal}</div>
      <div className="ap-ground">{round.kind === "home" ? animal : options}</div>
      {stars > 0 && (
        <div className="find-stars" aria-label={`${stars} geschafft`}>
          {"⭐".repeat(Math.min(stars, 10))}
          {stars > 10 && <span className="find-count">{stars}</span>}
        </div>
      )}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
