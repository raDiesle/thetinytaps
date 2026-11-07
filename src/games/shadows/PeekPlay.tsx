import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { PointingFamily, type MascotKind } from "@/components/Mascot";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { playChime, playPop, playRandomNote } from "@/lib/sfx";
import { pick, useAppLanguage } from "@/lib/language";
import { tapState } from "@/lib/tapTargets";
import { hideoutOf, SHADOW_TEXTS, type Hideout, type ShadowItem } from "./content";
import { shuffle } from "./deck";
import { choiceRows } from "./levels";
import { emojiGlyph, pickPeepholes, type Glyph } from "./glyph";
import { BUSH, Bush, POND, Pond, STAGE } from "./hideouts";
import type { PeekLevel } from "@/games/animals/levels";
import type { AnimalsSettings } from "@/games/animals/settings";
import { animalsVoice } from "@/games/animals/voice";

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

/** A gap in the bush's leaves the animal shows through: its middle and radius, in stage units. */
interface Hole {
  x: number;
  y: number;
  r: number;
}

interface Round {
  item: ShadowItem;
  hideout: Hideout;
  side: Side;
  /** The share of the animal that peeks out. */
  show: number;
  /** With gaps, the animal stands wholly behind the bush and shows only through them. */
  holes: Hole[];
  choices: ShadowItem[];
  correct: number;
}

/**
 * The fox or bear family standing beside the bush, the grown-up showing the child where something peeks out: picked by
 * chance once per visit, since every round is mounted anew and the family should stay the same.
 */
const FAMILY: MascotKind = Math.random() < 0.5 ? "fox" : "bear";

/** The side of the last round, so the next one peeks out of another; kept between rounds, which are mounted anew. */
let lastSide: Side | null = null;

/** Hides `item` as `level` says: at which side, how much of it shows, and the gaps it shows through. */
function hideAnimal(item: ShadowItem, choices: ShadowItem[], level: PeekLevel): Round {
  const hideout = hideoutOf(item);
  const glyph = emojiGlyph(item.emoji);
  const holes: Hole[] = [];
  // Through the leaves only where the shape could be measured; out of the pond it always peeks out.
  if (level.holes && hideout === "bush" && glyph.url) {
    const { count, r } = level.holes;
    const box = place(glyph, { hideout, side: "top", show: 0, holes: [{ x: 0, y: 0, r }] }, "hidden");
    for (const h of pickPeepholes(glyph.cover, box.w, box.h, count, 2.3 * r)) {
      // Never past the bush's foot: a gap there would hang over the meadow.
      holes.push({ x: box.x + h.x * box.w, y: Math.min(box.y + h.y * box.h, BUSH.y + BUSH.height - r - 12), r });
    }
  }
  // Flat animals would show only their back over the bush, so they peek out at a side; and
  // never from the same side twice in a row, so it doesn't always look the same.
  const sides = glyph.aspect > FLAT ? SIDES.filter((s) => s !== "top") : SIDES;
  const side = hideout === "pond" || holes.length > 0 ? "top" : shuffle(sides.filter((s) => s !== lastSide))[0];
  lastSide = side;
  return { item, hideout, side, show: level.show + Math.random() * 0.08, holes, choices, correct: choices.indexOf(item) };
}

/** The animal's box on the stage, in stage units. */
function place(glyph: Glyph, round: Pick<Round, "hideout" | "side" | "show" | "holes">, phase: Phase) {
  const w = glyph.aspect >= 1 ? SIZE : SIZE * glyph.aspect;
  const h = glyph.aspect >= 1 ? SIZE / glyph.aspect : SIZE;
  const middle = STAGE.width / 2 - w / 2;

  if (round.hideout === "pond") {
    // Out of the water it leaps up above the waves.
    return { x: middle, y: phase === "hidden" ? POND.line - round.show * h : POND.y + 12 - h, w, h };
  }
  if (phase === "front") return { x: middle, y: STAGE.height + 6 - h, w, h };
  // Wholly behind the bush, low in its middle, where the leaves hide all of it.
  if (round.holes.length > 0 && phase === "hidden") return { x: middle, y: BUSH.y + BUSH.height - 8 - h, w, h };

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

/** What a round of "Wer schaut da raus?" gets from "Was gehört zum Tier?", which plays it in turn with the others. */
export interface PeekPlayProps {
  settings: Pick<AnimalsSettings, "speech" | "sounds">;
  /** The animal that hides. */
  item: ShadowItem;
  /** The whole animals to choose from, `item` among them. */
  choices: ShadowItem[];
  level: PeekLevel;
  /** What the round is about, for grown-ups: shown under the stage. */
  topic?: ReactNode;
  /** The right animal was picked after `misses` wrong ones. */
  onSolved: (misses: number) => void;
  /** Its coming out has been watched: the next round may come. */
  onNext: () => void;
}

/**
 * "Wer schaut da raus?" (X-04), one round: a part of an animal peeks out of a bush or the pond (on the hardest steps
 * only bits of it show through gaps in the leaves); tap the whole animal below. A kind of round of "Was gehört zum
 * Tier?", but it lives here since it shares the stage, pictures and glyphs with the shadows.
 */
export function PeekPlay({ settings, item, choices, level, topic, onSolved, onNext }: PeekPlayProps) {
  const language = useAppLanguage();
  const texts = pick(SHADOW_TEXTS, language.id);
  const [round] = useState(() => hideAnimal(item, choices, level));
  const [phase, setPhase] = useState<Phase>("hidden");
  const [outcome, setOutcome] = useState<{ pick: number; ok: boolean } | null>(null);
  /** The keyboard frame; appears with the first key. */
  const [focus, setFocus] = useState<number | null>(null);
  const focusRef = useRef<number | null>(null);
  /** Set from a pick until the child may pick again; a ref, since a key can come before the next render. */
  const busy = useRef(false);
  /** Bumped when the hiding place is tapped: it rustles and the animal wiggles. */
  const [rustle, setRustle] = useState(0);
  const { effects, ripple } = useTapFeedback();
  /** Wrong animals picked in this round, for the difficulty. */
  const misses = useRef(0);
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

  // The question comes with the round; the round is mounted anew for every animal.
  useEffect(() => say(texts.peek), []);

  const softTap = useCallback(
    (x?: number, y?: number) => {
      ripple(x, y);
      if (settings.sounds) playRandomNote();
    },
    [ripple, settings.sounds],
  );

  const choose = (index: number) => {
    if (busy.current) return;
    busy.current = true;
    const ok = index === round.correct;
    setOutcome({ pick: index, ok });

    if (!ok) {
      // Never a "wrong" for the child; only the difficulty takes note.
      misses.current++;
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
    onSolved(misses.current);
    later(CELEBRATE_MS, onNext);
  };

  /** Tapping the hiding place: it rustles, the animal wiggles and makes its noise, as a hint. */
  const onHideoutDown = (e: PointerEvent) => {
    e.stopPropagation();
    if (busy.current) return;
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
      if (e.repeat || e.key === "Escape") return;
      if (outcome) {
        softTap();
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
  const behind = round.holes.length > 0 && phase === "hidden";

  return (
    <div className="shadows-play peek-play" onPointerDown={(e) => softTap(e.clientX, e.clientY)}>
      <div className="sh-top">
        <div className="pk-stage" data-tap onPointerDown={onHideoutDown}>
          {glyph.url ? (
            <img
              src={glyph.url}
              alt=""
              draggable={false}
              className={`pk-animal pk-${phase}${behind ? " pk-behind" : phase === "hidden" ? wiggle : ""}`}
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
            {/* The gaps in the leaves, each showing the bit of the animal behind it. */}
            {behind &&
              round.holes.map((h) => (
                <span
                  key={`${h.x}-${h.y}`}
                  className="pk-hole"
                  style={{ left: pct(h.x - h.r - BUSH.x, BUSH.width), top: pct(h.y - h.r - BUSH.y, BUSH.height), width: pct(2 * h.r, BUSH.width) }}
                >
                  <img
                    src={glyph.url}
                    alt=""
                    draggable={false}
                    style={{
                      left: pct(box.x - (h.x - h.r), 2 * h.r),
                      top: pct(box.y - (h.y - h.r), 2 * h.r),
                      width: pct(box.w, 2 * h.r),
                      height: pct(box.h, 2 * h.r),
                    }}
                  />
                </span>
              ))}
          </div>
        </div>
        {/* Tapped, they wave and grin while the bush rustles and the animal calls, like a tap on the bush. */}
        <PointingFamily kind={FAMILY} pointer="grown" className="pk-family mirror" onTap={onHideoutDown} />
      </div>
      {topic}
      <div className="sh-ground">
        <div className="sh-options" style={choiceRows(round.choices.length)}>
          {round.choices.map((c, i) => (
            <div
              key={c.id}
              className={`sh-option pk-option${focus === i ? " focused" : ""}${won && outcome.pick === i ? " matched" : ""}${
                outcome?.ok === false && outcome.pick === i ? " nope" : ""
              }`}
              role="button"
              aria-label={texts.name(c)}
              data-tap={tapState({ goal: i === round.correct })}
              onPointerDown={onChoiceDown(i)}
            >
              <span className="pk-choice sh-emoji" aria-hidden>
                {c.emoji}
              </span>
              <span className="sh-name" aria-hidden>
                {texts.name(c)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <FeedbackLayer effects={effects} />
    </div>
  );
}
