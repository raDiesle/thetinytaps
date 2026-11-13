import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { DEV } from "@/lib/buildInfo";
import { CornerChoices } from "@/components/CornerChoices";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { loadRecordings, playChime, playPop, playRandomNote, playRustle } from "@/lib/sfx";
import { type Localized, pick, useAppLanguage, useT } from "@/lib/language";
import { tapState } from "@/lib/tapTargets";
import { useVoiceReady } from "@/lib/voiceReady";
import { animalsVoice } from "@/games/animals/voice";
import { ITEMS, PEEK_ITEMS, SHADOW_TEXTS, SHADOW_RECORDINGS, type ShadowItem } from "./content";
import { useDeck } from "./deck";
import {
  choiceRows,
  dealPeek,
  dealShadows,
  nextLevel,
  PEEK_LEVELS,
  poseShadows,
  QUICK_STEPS,
  SHADOW_LEVELS,
  type PeekLevel,
  type ShadowLevel,
  type ShadowPose,
} from "./levels";
import { PeekPlay } from "./PeekPlay";
import type { ShadowsSettings, ShadowTheme } from "./settings";
import { shadowsVoice } from "./voice";
import { useStepAddress } from "@/lib/stepAddress";

/** A finger that moves less than this is a tap, not a drag. */
const TAP_PX = 12;
/** Time to watch the picture sit on its shadow before the next one comes. */
const CELEBRATE_MS = 2600;
/** Time a wrong shadow shows who it belongs to before the child can try again. */
const WRONG_MS = 1500;
/** Dropped this close to a shadow (as a share of its size) still counts: small fingers don't aim well. */
const SNAP = 0.3;

/** What the choices in the top right corner are about (worded as Was gehört zum Tier?'s). */
const WHAT_COMES_UP: Localized = {
  de: "Was drankommt",
  ru: "Что будет в игре",
  en: "What comes up",
  zh: "出现哪些内容",
  hi: "क्या-क्या आएगा",
  es: "Qué aparece",
  ar: "ما الذي يظهر",
};

/** The kinds of pictures to pick from while playing, by name in the top right corner; "all" mixes them. */
const THEMES: { id: ShadowTheme; label: Localized }[] = [
  { id: "all", label: { de: "Gemischt", ru: "Вперемешку", en: "Mixed", zh: "混合", hi: "मिले-जुले", es: "Mezclado", ar: "منوعة" } },
  { id: "animals", label: { de: "Tiere", ru: "Животные", en: "Animals", zh: "动物", hi: "जानवर", es: "Animales", ar: "حيوانات" } },
  { id: "vehicles", label: { de: "Fahrzeuge", ru: "Транспорт", en: "Vehicles", zh: "交通工具", hi: "गाड़ियाँ", es: "Vehículos", ar: "مركبات" } },
  { id: "food", label: { de: "Essen", ru: "Еда", en: "Food", zh: "食物", hi: "खाना", es: "Comida", ar: "طعام" } },
  { id: "things", label: { de: "Dinge", ru: "Вещи", en: "Things", zh: "东西", hi: "चीज़ें", es: "Cosas", ar: "أشياء" } },
];

interface Round {
  id: number;
  item: ShadowItem;
  shadows: ShadowItem[];
  correct: number;
  /** The step it was dealt on: whether its shadows lie turned, mirrored or under flaps. */
  level: ShadowLevel;
  /** How each shadow lies. */
  poses: ShadowPose[];
  /** What comes after it, drawn a turn ahead so its lines load while this round is played. */
  ahead: Ahead;
}

/**
 * The next picture and, where animals peek out, the next animal, drawn from their decks a turn early (the same order
 * as drawing them when due): only their lines are fetched ahead, never all of the game's (user request, November 2026).
 * Their step and the others to choose from are dealt when they come, as the child's last round decides.
 */
interface Ahead {
  /** The pictures it was drawn from: a new kind of pictures draws anew. */
  pool: ShadowItem[];
  item: ShadowItem;
  peek: ShadowItem | null;
}

interface Offset {
  x: number;
  y: number;
  scale?: number;
  /** Landing on a turned or mirrored shadow, the picture turns with it to fit it exactly. */
  pose?: ShadowPose;
}

/** Where the picture is while dragged or landing: moved, and on landing shrunk, turned and mirrored like its shadow. */
function landedStyle(offset: Offset, landed: Offset | null) {
  const scale = landed?.scale;
  const pose = landed?.pose;
  return {
    translate: `${offset.x}px ${offset.y}px`,
    scale: scale === undefined ? undefined : `${pose?.flip ? -scale : scale} ${scale}`,
    rotate: pose?.angle ? `${pose.angle}deg` : undefined,
  };
}

const centre = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

/** Whether (x, y) lies on `r`, or no further than `SNAP` of its size away. */
function near(r: DOMRect, x: number, y: number) {
  const margin = SNAP * Math.max(r.width, r.height);
  return x > r.left - margin && x < r.right + margin && y > r.top - margin && y < r.bottom + margin;
}

/** A round of „Wer schaut da raus?“, which takes its turn after every picture that looked for its shadow. */
interface PeekRound {
  id: number;
  item: ShadowItem;
  choices: ShadowItem[];
  level: PeekLevel;
}

/**
 * „Erkennen“ (N-07 and X-04, Z-14): a picture looks for its shadow (drag it onto the shadow, or tap the right one), and
 * after it an animal peeks out of a bush or the pond and the child taps the whole animal (`PeekPlay`) – the two kinds
 * take turns, each climbing its own steps by how the child plays: more to choose from and closer ones, fewer when it gets hard.
 */
export function ShadowsPlay({ settings }: { settings: ShadowsSettings }) {
  const language = useAppLanguage();
  const t = useT();
  const texts = pick(SHADOW_TEXTS, language.id);
  const [round, setRound] = useState<Round | null>(null);
  const [theme, setTheme] = useState<ShadowTheme>("all");
  /** The round of „Wer schaut da raus?“ being played; null while a picture looks for its shadow. */
  const [peek, setPeek] = useState<PeekRound | null>(null);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  /** The shadow the picture is dragged over, so it can grow a little. */
  const [hover, setHover] = useState<number | null>(null);
  /** The picture on its way onto the right shadow. */
  const [landed, setLanded] = useState<Offset | null>(null);
  const [outcome, setOutcome] = useState<{ pick: number; ok: boolean } | null>(null);
  /** The keyboard frame; appears with the first key. */
  const [focus, setFocus] = useState<number | null>(null);
  const focusRef = useRef<number | null>(null);
  /** Set from a pick until the child may pick again; a ref, since a key can come before the next render. */
  const busy = useRef(false);
  /** The flap lifted on a step with covered shadows (`ShadowLevel.covered`). */
  const [opened, setOpened] = useState<number | null>(null);
  /** No flap was lifted yet this visit: a still hand points at the first one. */
  const [flapsNew, setFlapsNew] = useState(true);
  /** Bumped to make the picture hop again, e.g. "drag me" when tapping isn't enough. */
  const [nudge, setNudge] = useState(0);
  const { effects, ripple } = useTapFeedback();

  const nextId = useRef(0);
  const pictureRef = useRef<HTMLSpanElement>(null);
  const shadowRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pointer = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  // Refs, since `nextRound` is also called from timers set before a change: it always deals at the current ones.
  const themeRef = useRef(theme);
  /** The difficulty step (an index into `SHADOW_LEVELS`); every visit begins on the first (while developing, `?level=N` on step N). */
  const levelRef = useRef(Math.min(SHADOW_LEVELS.length - 1, Number(DEV && new URLSearchParams(window.location.search).get("level")) || 0));
  /** The wrong shadows tapped in each picture on the current step, newest last; cleared on each step up or down. */
  const resultsRef = useRef<number[]>([]);
  /** Wrong shadows tapped in the current picture. */
  const missesRef = useRef(0);
  /** The same for „Wer schaut da raus?“: its step (an index into `PEEK_LEVELS`) and the wrong animals in each round on it. */
  const peekLevelRef = useRef(Math.min(PEEK_LEVELS.length - 1, Number(DEV && new URLSearchParams(window.location.search).get("level")) || 0));
  const peekResultsRef = useRef<number[]>([]);
  const peekId = useRef(0);
  // The picture on screen in the address (`?seite=3`, `3-tier` while an animal peeks out after it), so the time-on-page event tells how far the child got.
  useStepAddress(round ? (peek ? `${round.id + 1}-tier` : round.id + 1) : undefined);
  const drawPeek = useDeck(PEEK_ITEMS);

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
  const say = useCallback((text: string, queue = false) => shadowsVoice.say(text, language.id, { queue }), [language.id]);

  const pool = useMemo(() => (theme === "all" ? ITEMS : ITEMS.filter((i) => i.theme === theme)), [theme]);
  const poolRef = useRef(pool);
  poolRef.current = pool;

  const drawItem = useDeck(pool);
  const drawRef = useRef(drawItem);
  drawRef.current = drawItem;

  /** What was drawn ahead for the round after the one on screen. */
  const aheadRef = useRef<Ahead | null>(null);

  /** Deals the next picture; it shows and asks once its first line is loaded (`ready` below). */
  const nextRound = useCallback(() => {
    const before = aheadRef.current;
    const item = before?.pool === poolRef.current ? before.item : drawRef.current();
    const peeks = themeRef.current === "all" || themeRef.current === "animals";
    const ahead = { pool: poolRef.current, item: drawRef.current(), peek: peeks ? (before?.peek ?? drawPeek()) : null };
    aheadRef.current = ahead;
    const level = SHADOW_LEVELS[levelRef.current];
    const shadows = dealShadows(item, poolRef.current, level);
    const next = { id: nextId.current++, item, shadows, correct: shadows.indexOf(item), level, poses: poseShadows(shadows.length, level), ahead };
    missesRef.current = 0;
    setPeek(null);
    setRound(next);
    setDrag(null);
    setHover(null);
    setLanded(null);
    setOutcome(null);
    setOpened(null);
    setFocus(null);
    focusRef.current = null;
    busy.current = false;
  }, [drawPeek]);

  /** After a picture found its shadow: an animal peeks out, but only where animals are among the pictures; else the next picture. */
  const advance = useCallback(() => {
    if (themeRef.current !== "all" && themeRef.current !== "animals") {
      nextRound();
      return;
    }
    const ahead = aheadRef.current;
    const item = ahead?.peek ?? drawPeek();
    if (ahead) aheadRef.current = { ...ahead, peek: null };
    const level = PEEK_LEVELS[peekLevelRef.current];
    setPeek({ id: peekId.current++, item, choices: dealPeek(item, PEEK_ITEMS, level), level });
  }, [nextRound, drawPeek]);
  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  /** The right animal was picked after `misses` wrong ones: its round sets its own next step. */
  const peekSolved = useCallback((misses: number) => {
    const results = [...peekResultsRef.current, misses];
    const level = nextLevel(peekLevelRef.current, results, PEEK_LEVELS.length - 1);
    peekResultsRef.current = level === peekLevelRef.current ? results : [];
    peekLevelRef.current = level;
  }, []);

  // Start with a picture right away; settings can't change while playing.
  useEffect(() => loadRecordings(SHADOW_RECORDINGS), []);
  useEffect(() => nextRound(), []);

  // A round shows only once the line it starts with is loaded, so picture and voice come together (the paw track shows
  // meanwhile); then the rest of its lines and the next round's load. A picture asks „… sucht seinen Schatten“, an
  // animal peeking out „Wer schaut da raus?“ (from Was gehört zum Tier?'s recordings).
  const shadowNow = round && !peek ? [texts.search(round.item)] : [];
  const shadowNext =
    round && !peek
      ? [
          texts.found(round.item),
          ...round.shadows.filter((s) => s !== round.item).map(texts.thatIs),
          texts.search(round.ahead.item),
          texts.found(round.ahead.item),
        ]
      : [];
  const shadowReady = useVoiceReady(shadowsVoice, shadowNow, language.id, { next: shadowNext, enabled: !!round && !peek });
  const peekNow = peek ? [texts.peek] : [];
  const peekNext = peek
    ? [texts.there(peek.item), ...peek.choices.filter((c) => c !== peek.item).map(texts.thatIs)]
    : round?.ahead.peek
      ? [texts.peek, texts.there(round.ahead.peek)]
      : [];
  const peekReady = useVoiceReady(animalsVoice, peekNow, language.id, { next: peekNext });

  // The picture asks for its shadow and makes its noise once it shows.
  const asked = useRef(-1);
  useEffect(() => {
    if (!round || peek || !shadowReady || asked.current === round.id) return;
    asked.current = round.id;
    say(texts.search(round.item));
    if (settings.sounds) later(400, () => round.item.sound?.());
  }, [round, peek, shadowReady]);

  const softTap = useCallback(
    (x?: number, y?: number) => {
      ripple(x, y);
      if (settings.sounds) playRandomNote();
    },
    [ripple, settings.sounds],
  );

  /** The child picked shadow `index`; `from` is how far the dragged picture already is from its place. */
  const choose = (index: number, from: Offset = { x: 0, y: 0 }) => {
    if (!round || busy.current) return;
    busy.current = true;
    const ok = index === round.correct;
    setOutcome({ pick: index, ok });
    setDrag(null);
    setHover(null);

    if (!ok) {
      // Never a "wrong" for the child; only the difficulty takes note.
      missesRef.current++;
      // The shadow lights up and shows who it really belongs to.
      const owner = round.shadows[index];
      if (settings.sounds) later(250, () => (owner.sound ?? playPop)());
      say(texts.thatIs(owner));
      say(texts.search(round.item), true);
      later(WRONG_MS, () => {
        busy.current = false;
        setOutcome(null);
      });
      return;
    }

    // How this picture went decides the next one's step.
    const results = [...resultsRef.current, missesRef.current];
    const level = nextLevel(levelRef.current, results, SHADOW_LEVELS.length - 1, QUICK_STEPS);
    resultsRef.current = level === levelRef.current ? results : [];
    levelRef.current = level;

    // The picture flies onto its shadow and shrinks to fit it exactly.
    const picture = pictureRef.current;
    const shadow = shadowRefs.current[index];
    if (picture && shadow) {
      const start = centre(picture.getBoundingClientRect());
      const end = centre(shadow.getBoundingClientRect());
      setLanded({
        x: end.x - start.x + from.x,
        y: end.y - start.y + from.y,
        scale: shadow.offsetHeight / picture.offsetHeight,
        pose: round.poses[index],
      });
    }
    if (settings.sounds) {
      later(200, playChime);
      later(700, () => round.item.sound?.());
    }
    say(texts.found(round.item));
    later(CELEBRATE_MS, () => advanceRef.current());
  };

  /** Whether shadow `index` still lies under its flap: a tap or a drop there lifts the flap instead of picking it. */
  const hidden = (index: number) => !!round?.level.covered && opened !== index;

  /** Lifts the flap over shadow `index`; the one lifted before goes down again. */
  const lift = (index: number) => {
    if (!round || busy.current) return;
    setOpened(index);
    setFlapsNew(false);
    if (settings.sounds) playRustle();
  };

  /** A tap, key or drop on shadow `index`: lifts its flap while it is covered, else picks it. */
  const touch = (index: number, from?: Offset) => {
    if (hidden(index)) {
      setDrag(null);
      setHover(null);
      lift(index);
    } else choose(index, from);
  };

  /** Tapping the picture asks again; it makes its noise and hops. */
  const askAgain = () => {
    if (!round) return;
    say(texts.search(round.item));
    if (settings.sounds) round.item.sound?.();
    setNudge((n) => n + 1);
  };

  /** The shadow the picture would land on if let go at (x, y). */
  const shadowAt = (x: number, y: number): number | null => {
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

  const onPictureDown = (e: PointerEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    if (!round || busy.current || pointer.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
  };

  const onPictureMove = (e: PointerEvent<HTMLSpanElement>) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    const x = e.clientX - p.x;
    const y = e.clientY - p.y;
    if (!p.moved && Math.hypot(x, y) < TAP_PX) return;
    p.moved = true;
    setDrag({ x, y });
    setHover(shadowAt(e.clientX, e.clientY));
  };

  const onPictureUp = (e: PointerEvent<HTMLSpanElement>) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    pointer.current = null;
    if (!p.moved) {
      askAgain();
      return;
    }
    const target = shadowAt(e.clientX, e.clientY);
    if (target === null) {
      // Back to its place.
      setDrag(null);
      setHover(null);
    } else touch(target, { x: e.clientX - p.x, y: e.clientY - p.y });
  };

  const onPictureCancel = () => {
    pointer.current = null;
    setDrag(null);
    setHover(null);
  };

  const onShadowDown = (index: number) => (e: PointerEvent) => {
    e.stopPropagation();
    touch(index);
  };

  /** Only pictures of `next` from now on ("all" mixes them): a new picture comes at once, at the same step. */
  const pickTheme = (next: ShadowTheme) => {
    if (next === themeRef.current) {
      if (settings.sounds) playPop();
      return;
    }
    themeRef.current = next;
    setTheme(next);
  };

  // A new theme brings a new picture of it; what was still to come of the old one is dropped.
  const firstTheme = useRef(true);
  useEffect(() => {
    if (firstTheme.current) {
      firstTheme.current = false;
      return;
    }
    timers.current.forEach(clearTimeout);
    timers.current.clear();
    resultsRef.current = [];
    nextRound();
  }, [theme]);

  // Arrow keys (or any key) move the frame, Space or Enter picks, 1–4 pick straight away.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || !round || peek || !shadowReady || e.key === "Escape") return;
      if (outcome) {
        softTap();
        return;
      }
      const count = round.shadows.length;
      const digit = Number(e.key);
      // Read and set through the ref: fast key presses come before React has rendered the last one.
      const move = (to: number) => {
        focusRef.current = to;
        setFocus(to);
      };
      const current = focusRef.current;
      if (Number.isInteger(digit) && digit >= 1 && digit <= count) {
        move(digit - 1);
        touch(digit - 1);
      } else if (e.key === "Enter" || e.key === " ") {
        if (current === null) move(0);
        else touch(current);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        move(((current ?? 0) - 1 + count) % count);
      } else {
        move(current === null ? 0 : (current + 1) % count);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // The kind of pictures, chosen in the top right corner in every round (also while an animal peeks out or a round waits for its voice).
  const corner = (
    <CornerChoices title={t(WHAT_COMES_UP)} value={theme} onChange={pickTheme} choices={THEMES.map((th) => ({ value: th.id, label: t(th.label) }))} />
  );

  if (!round || (!peek && !shadowReady)) return corner;
  if (peek)
    return (
      <>
        {peekReady && (
          <PeekPlay key={peek.id} settings={settings} item={peek.item} choices={peek.choices} level={peek.level} onSolved={peekSolved} onNext={nextRound} />
        )}
        {corner}
      </>
    );

  const won = outcome?.ok === true;
  const offset = landed ?? drag;

  return (
    <>
      <div className="shadows-play" onPointerDown={(e) => softTap(e.clientX, e.clientY)}>
        <div className="sh-top">
          <div key={`picture-${round.id}`} className="sh-picture-box">
            <span
              ref={pictureRef}
              className={`sh-picture sh-emoji${drag ? " dragging" : ""}${landed ? " landed" : ""}${
                outcome?.ok === false ? " wrong" : ""
              }${!drag && !outcome && nudge ? ` nudge-${nudge % 2}` : ""}`}
              style={offset ? landedStyle(offset, landed) : undefined}
              role="img"
              aria-label={texts.name(round.item)}
              data-tap
              onPointerDown={onPictureDown}
              onPointerMove={onPictureMove}
              onPointerUp={onPictureUp}
              onPointerCancel={onPictureCancel}
            >
              {round.item.emoji}
            </span>
          </div>
        </div>
        <div className="sh-ground">
          <div className="sh-options" style={choiceRows(round.shadows.length)}>
            {round.shadows.map((s, i) => {
              const peek = outcome?.pick === i && !outcome.ok;
              const pose = round.poses[i];
              const covered = round.level.covered;
              return (
                <div
                  key={`${round.id}-${s.id}`}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  className={`sh-option${focus === i ? " focused" : ""}${hover === i ? " near" : ""}${
                    won && outcome.pick === i ? " matched" : ""
                  }${peek ? " peek" : ""}${covered ? " covered" : ""}${covered && opened === i ? " open" : ""}`}
                  role="button"
                  aria-label={peek ? texts.name(s) : texts.shadow(i + 1)}
                  data-tap={tapState({ goal: i === round.correct })}
                  onPointerDown={onShadowDown(i)}
                >
                  <span
                    ref={(el) => {
                      shadowRefs.current[i] = el;
                    }}
                    className="sh-shadow sh-emoji"
                    style={pose.angle || pose.flip ? { rotate: `${pose.angle}deg`, scale: pose.flip ? "-1 1" : undefined } : undefined}
                    aria-hidden
                  >
                    {s.emoji}
                  </span>
                  {covered && (
                    <span className="sh-flap" aria-hidden>
                      {flapsNew && i === 0 && <span className="sh-flap-hand">👆</span>}
                    </span>
                  )}
                  <span className="sh-name" aria-hidden>
                    {texts.name(s)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <FeedbackLayer effects={effects} />
      </div>
      {corner}
    </>
  );
}
