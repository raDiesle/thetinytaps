import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { playChime, playPop, playRandomNote } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { PEEK_ITEMS, hideoutOf, texts, type Hideout, type ShadowItem } from "./content";
import { shuffle, useDeck } from "./deck";
import { emojiGlyph, type Glyph } from "./glyph";
import { BUSH, Bush, POND, Pond, STAGE } from "./hideouts";
import type { ShadowsSettings } from "./settings";

/** Time to watch the animal that came out before the next one hides. */
const CELEBRATE_MS = 3000;
/** Time a wrong picture shakes before the child can try again. */
const WRONG_MS = 1500;
/** The animal's longer side, in stage units. */
const SIZE = 180;
/** How far in from its outer edge the bush hides an animal at its side. */
const BUSH_EDGE = 14;
/** Wider than high by this much, an animal doesn't peek out over the top. */
const FLAT = 1.3;

/** Where the part that peeks out sticks out of the bush; from the pond always at the top. */
type Side = "top" | "left" | "right";
const SIDES: Side[] = ["top", "left", "right"];

/** Hiding with a part peeking out, all of it out next to the bush, then out in front (or above the pond). */
type Phase = "hidden" | "out" | "front";

interface Round {
  id: number;
  item: ShadowItem;
  hideout: Hideout;
  side: Side;
  /** The share of the animal that peeks out. */
  show: number;
  choices: ShadowItem[];
  correct: number;
}

/** The animal's box on the stage, in stage units. */
function place(glyph: Glyph, round: Round, phase: Phase) {
  const w = glyph.aspect >= 1 ? SIZE : SIZE * glyph.aspect;
  const h = glyph.aspect >= 1 ? SIZE / glyph.aspect : SIZE;
  const middle = STAGE.width / 2 - w / 2;

  if (round.hideout === "pond") {
    // Out of the water it leaps up above the waves.
    return { x: middle, y: phase === "hidden" ? POND.line - round.show * h : POND.y + 12 - h, w, h };
  }
  if (phase === "front") return { x: middle, y: STAGE.height + 6 - h, w, h };

  const ground = STAGE.height - 6 - h;
  const left = BUSH.x + BUSH_EDGE;
  const right = BUSH.x + BUSH.width - BUSH_EDGE;
  switch (round.side) {
    case "top":
      return { x: middle, y: phase === "hidden" ? BUSH.top - round.show * h : BUSH.y + 20 - h, w, h };
    case "left":
      return { x: phase === "hidden" ? left - round.show * w : left - w, y: ground, w, h };
    case "right":
      return { x: phase === "hidden" ? right - (1 - round.show) * w : right, y: ground, w, h };
  }
}

const pct = (units: number, of: number) => `${(units / of) * 100}%`;

/** Which way the animal moves to hide all of itself, for the peeking animations. */
const HIDE_DIRECTION: Record<Side, { x: number; y: number }> = {
  top: { x: 0, y: 1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
};

/** "Wer schaut da raus?" (X-04): a part of an animal peeks out of a bush or the pond; tap the whole animal below. */
export function PeekPlay({ lang, settings }: { lang: string; settings: ShadowsSettings }) {
  const [round, setRound] = useState<Round | null>(null);
  const [phase, setPhase] = useState<Phase>("hidden");
  const [outcome, setOutcome] = useState<{ pick: number; ok: boolean } | null>(null);
  /** The keyboard frame; appears with the first key. */
  const [focus, setFocus] = useState<number | null>(null);
  const focusRef = useRef<number | null>(null);
  /** Set from a pick until the child may pick again; a ref, since a key can come before the next render. */
  const busy = useRef(false);
  /** Bumped when the hiding place is tapped: it rustles and the animal wiggles. */
  const [rustle, setRustle] = useState(0);
  const [stars, setStars] = useState(0);
  const { bursts, spawn } = useBursts();

  const nextId = useRef(0);
  const lastSide = useRef<Side | null>(null);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const drawItem = useDeck(PEEK_ITEMS);

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

  const nextRound = useCallback(() => {
    const item = drawItem();
    const hideout = hideoutOf(item);
    // Flat animals would show only their back over the bush, so they peek out at a side; and
    // never from the same side twice in a row, so it doesn't always look the same.
    const sides = emojiGlyph(item.emoji).aspect > FLAT ? SIDES.filter((s) => s !== "top") : SIDES;
    const side = hideout === "pond" ? "top" : shuffle(sides.filter((s) => s !== lastSide.current))[0];
    lastSide.current = side;
    const count = Number(settings.choices);
    const choices = shuffle([item, ...shuffle(PEEK_ITEMS.filter((i) => i !== item)).slice(0, count - 1)]);
    setRound({
      id: nextId.current++,
      item,
      hideout,
      side,
      show: 0.35 + Math.random() * 0.1,
      choices,
      correct: choices.indexOf(item),
    });
    setPhase("hidden");
    setOutcome(null);
    setRustle(0);
    setFocus(null);
    focusRef.current = null;
    busy.current = false;
    say(texts.peek);
  }, [settings.choices, drawItem, say]);

  // Start with an animal right away; settings can't change while playing.
  useEffect(() => nextRound(), []);

  const funBurst = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
    },
    [spawn, settings.sounds],
  );

  const choose = (index: number) => {
    if (!round || busy.current) return;
    busy.current = true;
    const ok = index === round.correct;
    setOutcome({ pick: index, ok });

    if (!ok) {
      const owner = round.choices[index];
      if (settings.sounds) later(250, () => (owner.sound ?? playPop)());
      say(texts.thatIs(owner));
      say(texts.peek, true);
      later(WRONG_MS, () => {
        busy.current = false;
        setOutcome(null);
      });
      return;
    }

    // The whole animal comes out: from the bush it hops to the front, out of the pond it leaps up.
    if (round.hideout === "bush") {
      setPhase("out");
      later(450, () => setPhase("front"));
    } else setPhase("front");
    if (settings.sounds) {
      later(200, playChime);
      later(600, () => round.item.sound?.());
    }
    say(texts.there(round.item));
    setStars((n) => n + 1);
    later(800, () => {
      for (let i = 0; i < 8; i++) spawn();
    });
    later(CELEBRATE_MS, nextRound);
  };

  /** Tapping the hiding place: it rustles, the animal wiggles and makes its noise, as a hint. */
  const onHideoutDown = (e: PointerEvent) => {
    e.stopPropagation();
    if (!round || busy.current) return;
    setRustle((n) => n + 1);
    if (settings.sounds) (round.item.sound ?? playPop)();
    say(texts.peek);
  };

  const onChoiceDown = (index: number) => (e: PointerEvent) => {
    e.stopPropagation();
    choose(index);
  };

  // Arrow keys (or any key) move the frame, Space or Enter picks, 1–4 pick straight away.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || !round || e.key === "Escape") return;
      if (outcome) {
        funBurst();
        return;
      }
      const count = round.choices.length;
      const digit = Number(e.key);
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

  const won = outcome?.ok === true;
  const glyph = emojiGlyph(round.item.emoji);
  const box = place(glyph, round, phase);
  const hide = HIDE_DIRECTION[round.side];
  const animalStyle = {
    left: pct(box.x, STAGE.width),
    top: pct(box.y, STAGE.height),
    width: pct(box.w, STAGE.width),
    height: pct(box.h, STAGE.height),
    "--hide-x": `${hide.x * round.show * 100}%`,
    "--hide-y": `${hide.y * round.show * 100}%`,
  } as CSSProperties;
  const Hiding = round.hideout === "bush" ? Bush : Pond;
  const spot = round.hideout === "bush" ? BUSH : POND;
  const wiggle = rustle ? ` again-${rustle % 2}` : "";

  return (
    <div className="shadows-play peek-play" onPointerDown={(e) => funBurst(e.clientX, e.clientY)}>
      <p key={`${round.id}-${won}`} className="sh-prompt">
        {won ? texts.there(round.item) : texts.peek}
      </p>
      <div className="sh-top">
        <div key={`stage-${round.id}`} className="pk-stage" onPointerDown={onHideoutDown}>
          {glyph.url ? (
            <img
              src={glyph.url}
              alt=""
              draggable={false}
              className={`pk-animal pk-${phase}${phase === "hidden" ? wiggle : ""}`}
              style={animalStyle}
            />
          ) : (
            // Without a canvas: the emoji itself, roughly in place.
            <span className={`pk-animal pk-emoji sh-emoji pk-${phase}`} style={animalStyle}>
              {round.item.emoji}
            </span>
          )}
          <div
            className={`pk-hideout pk-${round.hideout}${wiggle}${outcome?.ok === false ? " rustle" : ""}`}
            style={{
              left: pct(spot.x, STAGE.width),
              top: pct(spot.y, STAGE.height),
              width: pct(spot.width, STAGE.width),
              height: pct(spot.height, STAGE.height),
            }}
          >
            <Hiding />
          </div>
        </div>
      </div>
      <div className="sh-ground">
        <div className="sh-options" style={{ "--n": round.choices.length } as CSSProperties}>
          {round.choices.map((c, i) => (
            <div
              key={`${round.id}-${c.id}`}
              className={`sh-option pk-option${focus === i ? " focused" : ""}${won && outcome.pick === i ? " matched" : ""}${
                outcome?.ok === false && outcome.pick === i ? " nope" : ""
              }`}
              role="button"
              aria-label={c.name}
              onPointerDown={onChoiceDown(i)}
            >
              <span className="pk-choice sh-emoji" aria-hidden>
                {c.emoji}
              </span>
              {settings.names && <span className="pk-name">{c.name}</span>}
            </div>
          ))}
        </div>
      </div>
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
