import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { playChime, playMunch, playPop, playRandomNote, playRecorded, playYuck } from "@/lib/sfx";
import { pick, useAppLanguage } from "@/lib/language";
import { tapState } from "@/lib/tapTargets";
import { choiceRows } from "@/games/shadows/levels";
import { ANIMAL_TEXTS, ANIMALS, GIFT_TEXTS, giverOf } from "./content";
import { GiftDrawing } from "./gifts";
import { HomeDrawing } from "./homes";
import type { FeedRound, GiftRound, HomeRound } from "./levels";
import { questionLines } from "./lines";
import type { AnimalsSettings } from "./settings";
import { animalsVoice } from "./voice";

/** A finger that moves less than this is a tap, not a drag. */
const TAP_PX = 12;
/** Time to watch the munching or the moving in before the next animal comes. */
const CELEBRATE_MS = 2800;
/** Longer for a gift: the glass fills, the egg drops into the nest, the wool rolls out. */
const GIFT_CELEBRATE_MS = 3400;
/** Time for the "Bäh!", the peeking neighbour or the animal a gift comes from before the child can try again. */
const WRONG_MS = 1400;
/** Dropped this close to a target (as a share of its size) still counts: small fingers don't aim well. */
const SNAP = 0.35;

/** What is being dragged: a food or gift (its index) or, when looking for a home, the animal itself. */
type Mover = number | "animal";

interface Offset {
  x: number;
  y: number;
  scale?: number;
}

const centre = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

/** Whether (x, y) lies on `r`, or no further than `SNAP` of its size away. */
function near(r: DOMRect, x: number, y: number) {
  const margin = SNAP * Math.max(r.width, r.height);
  return x > r.left - margin && x < r.right + margin && y > r.top - margin && y < r.bottom + margin;
}

const moveStyle = (o: Offset | null): CSSProperties | undefined =>
  o ? { translate: `${o.x}px ${o.y}px`, scale: o.scale === undefined ? undefined : `${o.scale}` } : undefined;

/** What a feeding, gift or home round gets from `AnimalsRounds`, which plays the kinds in turn. */
export interface AnimalsPlayProps {
  settings: Pick<AnimalsSettings, "speech" | "sounds">;
  round: FeedRound | GiftRound | HomeRound;
  /** What the round is about, for grown-ups: shown under the picture. */
  topic?: ReactNode;
  /** The kind's question („Was esse ich?“), said before the round's own when the kind of round changes (Z-24). */
  intro?: string;
  /** The right food, gift or home was picked after `misses` wrong ones. */
  onSolved: (misses: number) => void;
  /** The munching or moving in has been watched: the next round may come. */
  onNext: () => void;
}

/**
 * One round of "Was gehört zum Tier?": food to the hungry animal (N-08), what the animal gives us to it (Z-01), or
 * the animal to its home (N-09). Tapping is enough; dragging works too.
 */
export function AnimalsPlay({ settings, round, topic, intro, onSolved, onNext }: AnimalsPlayProps) {
  const language = useAppLanguage();
  const texts = pick(ANIMAL_TEXTS, language.id);
  const giftTexts = pick(GIFT_TEXTS, language.id);
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
  /** Bumped to make the animal hop again when it is tapped to ask once more. */
  const [nudge, setNudge] = useState<{ who: Mover; n: number } | null>(null);
  const { effects, ripple } = useTapFeedback();
  /** Wrong foods or homes picked in this round, for the difficulty. */
  const misses = useRef(0);
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

  // Its ElevenLabs recording; a sentence not translated yet is said in German.
  const say = useCallback((text: string, queue = false) => animalsVoice.say(text, language.id, { queue }), [language.id]);

  /** The round's question; a feeding round's comes after the animal's hunger (Z-24). `queue`: after what is being said. */
  const ask = (queue = false) => questionLines(round, language.id).forEach((line, i) => say(line, queue || i > 0));

  // The kind's question when the kind changed, the round's question and the animal's noise come with the round; the
  // round is mounted anew for every animal.
  useEffect(() => {
    if (intro) say(intro);
    ask(Boolean(intro));
    if (settings.sounds) later(400, () => round.animal.sound?.());
  }, []);

  const softTap = useCallback(
    (x?: number, y?: number) => {
      ripple(x, y);
      if (settings.sounds) playRandomNote();
    },
    [ripple, settings.sounds],
  );

  /** The child picked option `index`; `from` is how far the dragged thing already is from its place. */
  const choose = (index: number, from: Offset = { x: 0, y: 0 }) => {
    if (busy.current) return;
    busy.current = true;
    const ok = index === round.correct;
    setOutcome({ pick: index, ok });
    setDrag(null);
    setHover(null);

    if (!ok) {
      // Never a "wrong" for the child; only the difficulty takes note.
      misses.current++;
      if (round.kind === "feed") {
        if (settings.sounds) playYuck();
        say(texts.yuck(round.animal));
        say(texts.whatEats(round.animal), true);
      } else if (round.kind === "gift") {
        // The animal it comes from pops up behind the plate and says so.
        const gift = round.gifts[index];
        const giver = giverOf(gift);
        if (settings.sounds) later(300, () => giver.sound?.());
        say(giftTexts.comesFrom(gift, giver));
        ask(true);
      } else {
        const resident = ANIMALS.find((a) => a.home === round.homes[index].id)!;
        if (settings.sounds) later(300, () => resident.sound?.());
        say(texts.livesHere(resident));
        ask(true);
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
      if (settings.sounds) later(450, () => playRecorded("munch", playMunch));
      say(texts.yummy(round.animal, round.foods[index]));
    } else if (round.kind === "gift") {
      // The gift flies to the animal's side and is gone; there the animal makes it anew (`.ap-made`).
      const gift = optionRefs.current[index]?.querySelector(".ap-food")?.getBoundingClientRect();
      if (gift && animalBox) {
        const start = centre(gift);
        const side = { x: animalBox.right, y: animalBox.bottom - animalBox.height * 0.25 };
        setLanded({ who: index, to: { x: side.x - start.x + from.x, y: side.y - start.y + from.y, scale: 0.5 } });
      }
      if (settings.sounds) {
        later(500, () => round.animal.sound?.());
        later(1300, playPop);
      }
      say(giftTexts.gives(round.animal, round.gifts[index]));
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
      say(texts.movedIn(round.animal, home));
    }
    if (settings.sounds) later(200, playChime);
    onSolved(misses.current);
    later(round.kind === "gift" ? GIFT_CELEBRATE_MS : CELEBRATE_MS, onNext);
  };

  /** Tapping the animal asks again; it makes its noise and hops. */
  const askAgain = () => {
    ask();
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
    if (outcome || pointer.current) return;
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
      else choose(p.who);
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
    choose(index);
  };

  // Arrow keys (or any key) move the frame, Space or Enter picks, 1–4 pick straight away.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      if (outcome) {
        softTap();
        return;
      }
      const count = round.kind === "feed" ? round.foods.length : round.kind === "gift" ? round.gifts.length : round.homes.length;
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

  const offsetOf = (who: Mover): Offset | null => (landed?.who === who ? landed.to : drag?.who === who ? { x: drag.x, y: drag.y } : null);
  const moverClass = (who: Mover) =>
    `${drag?.who === who ? " dragging" : ""}${landed?.who === who ? " landed" : ""}${nudge?.who === who && !drag ? ` nudge-${nudge.n % 2}` : ""}`;

  const won = outcome?.ok === true;
  const yuck = outcome?.ok === false && round.kind === "feed";
  /** A wrong gift: the animal shakes its head, without a „Bäh!“ – it is not food. */
  const notMine = outcome?.ok === false && round.kind === "gift";

  const animal = (
    <div
      ref={animalRef}
      className={`ap-animal${round.kind === "home" ? moverClass("animal") : ""}${hover === "animal" ? " near" : ""}${
        won && round.kind === "feed" ? " munch" : ""
      }${won && round.kind === "gift" ? " gives" : ""}${yuck || notMine ? " yuck" : ""}`}
      style={round.kind === "home" ? moveStyle(offsetOf("animal")) : undefined}
      data-tap
      onPointerDown={round.kind === "home" ? onMoverDown("animal") : onAnimalTap}
      onPointerMove={onMoverMove}
      onPointerUp={onMoverUp}
      onPointerCancel={onMoverCancel}
    >
      <span ref={emojiRef} className="ap-emoji" role="img" aria-label={texts.animal(round.animal)}>
        {round.animal.emoji}
      </span>
      {won && round.kind === "gift" && (
        <span className={`ap-made gift-${round.gifts[round.correct].id}`} aria-hidden>
          <GiftDrawing gift={round.gifts[round.correct]} />
        </span>
      )}
    </div>
  );

  const options =
    round.kind === "gift" ? (
      <div className="ap-options" style={choiceRows(round.gifts.length)}>
        {round.gifts.map((gift, i) => {
          const giver = outcome?.pick === i && !outcome.ok ? giverOf(gift) : undefined;
          return (
            <div
              key={gift.id}
              ref={(el) => {
                optionRefs.current[i] = el;
              }}
              className={`ap-option ap-plate${focus === i ? " focused" : ""}`}
              data-tap={tapState({ goal: i === round.correct })}
              onPointerDown={onMoverDown(i)}
              onPointerMove={onMoverMove}
              onPointerUp={onMoverUp}
              onPointerCancel={onMoverCancel}
            >
              {giver && (
                <span className="ap-giver ap-emoji" aria-hidden>
                  {giver.emoji}
                </span>
              )}
              <span className={`ap-food ap-gift${moverClass(i)}`} style={moveStyle(offsetOf(i))}>
                <GiftDrawing gift={gift} label={giftTexts.gift(gift)} />
              </span>
              <span className="ap-name" aria-hidden>
                {giftTexts.gift(gift)}
              </span>
            </div>
          );
        })}
      </div>
    ) : round.kind === "feed" ? (
      <div className="ap-options" style={choiceRows(round.foods.length)}>
        {round.foods.map((food, i) => (
          <div
            key={food.id}
            ref={(el) => {
              optionRefs.current[i] = el;
            }}
            className={`ap-option ap-plate${focus === i ? " focused" : ""}`}
            data-tap={tapState({ goal: i === round.correct })}
            onPointerDown={onMoverDown(i)}
            onPointerMove={onMoverMove}
            onPointerUp={onMoverUp}
            onPointerCancel={onMoverCancel}
          >
            <span className={`ap-food ap-emoji${moverClass(i)}`} style={moveStyle(offsetOf(i))} role="img" aria-label={texts.food(food)}>
              {food.emoji}
            </span>
            <span className="ap-name" aria-hidden>
              {texts.food(food)}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <div className="ap-options" style={choiceRows(round.homes.length)}>
        {round.homes.map((home, i) => {
          const peek = outcome?.pick === i && !outcome.ok;
          const resident = peek ? ANIMALS.find((a) => a.home === home.id) : undefined;
          return (
            <div
              key={home.id}
              ref={(el) => {
                optionRefs.current[i] = el;
              }}
              className={`ap-option ap-home${focus === i ? " focused" : ""}${hover === i ? " near" : ""}${
                won && outcome.pick === i ? " happy" : ""
              }${peek ? " peek" : ""}`}
              data-tap={tapState({ goal: i === round.correct })}
              onPointerDown={onHomeDown(i)}
            >
              <div className="ap-home-box">
                <HomeDrawing home={home} label={texts.home(home)} />
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
              <span className="ap-name" aria-hidden>
                {texts.home(home)}
              </span>
            </div>
          );
        })}
      </div>
    );

  return (
    <div className={`animals-play kind-${round.kind}`} onPointerDown={(e) => softTap(e.clientX, e.clientY)}>
      {/* Up in the picture things stand on the horizon; the ground in front is where the child's things are. */}
      {/* The topic stands under the animal: below the sky's picture, or on the ground when the homes fill the sky. */}
      <div className="ap-top">{round.kind === "home" ? options : animal}</div>
      {round.kind !== "home" && topic}
      <div className="ap-ground">
        {round.kind === "home" ? animal : options}
        {round.kind === "home" && topic}
      </div>
      <FeedbackLayer effects={effects} />
    </div>
  );
}
