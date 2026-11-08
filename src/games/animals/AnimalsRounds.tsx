import { useCallback, useEffect, useRef, useState } from "react";
import { SHADOW_RECORDINGS } from "@/games/shadows/content";
import { useDeck } from "@/games/shadows/deck";
import { nextLevel } from "@/games/shadows/levels";
import { DEV } from "@/lib/buildInfo";
import { useAppLanguage, useT } from "@/lib/language";
import { countGame, gameEnded, isPlaytimeOver } from "@/lib/playtime";
import { loadRecordings } from "@/lib/sfx";
import { useVoiceReady } from "@/lib/voiceReady";
import { AnimalsPlay } from "./AnimalsPlay";
import { ANIMAL_RECORDINGS, ANIMALS, GIVERS, type Animal } from "./content";
import { GrowPlay } from "./GrowPlay";
import { GROWTHS } from "./growth";
import { type AnimalRound, answerLines, questionLines, type RoundSubject, wrongLines } from "./lines";
import { ANIMAL_LEVELS, dealFeed, dealGift, dealGrow, dealHome, FIXED_LEVELS, KIND_ORDER, nextKind, type RoundKind } from "./levels";
import type { AnimalsSettings } from "./settings";
import { KIND_QUESTIONS, RoundTopic } from "./RoundTopic";
import { animalsVoice } from "./voice";

const FED = ANIMALS.filter((a) => a.food);
const HOUSED = ANIMALS.filter((a) => a.home);

/**
 * "Was gehört zum Tier?" as one flowing game: feeding, what the animal gives us, who lives where and what the small
 * one becomes take turns in that order, and the difficulty follows how the child plays (`ANIMAL_LEVELS`). Grown-ups may switch kinds off or fix the
 * difficulty while playing; that counts from the next round. Each round is mounted anew, with a line under its
 * picture saying what it is about; the step and the animals still to come live here.
 */
export function AnimalsRounds({ settings }: { settings: AnimalsSettings }) {
  const [turn, setTurn] = useState(0);
  /**
   * The difficulty step (an index into `ANIMAL_LEVELS`); every visit begins on the first. While developing, `?level=N`
   * starts on step N, to look at the harder rounds.
   */
  const levelRef = useRef(Math.min(ANIMAL_LEVELS.length - 1, Number(DEV && new URLSearchParams(window.location.search).get("level")) || 0));
  /** The wrong picks in each round on the current step, newest last; cleared on each step up or down. */
  const resultsRef = useRef<number[]>([]);
  const drawFed = useDeck(FED);
  const drawHoused = useDeck(HOUSED);
  const drawGiver = useDeck(GIVERS);
  const drawGrowth = useDeck(GROWTHS);
  /** While developing, `?grow=<id>` plays only „Was wird aus mir?“ with that small one, to watch it grow again and again. */
  const devGrowth = useRef(DEV ? GROWTHS.find((g) => g.id === new URLSearchParams(window.location.search).get("grow")) : undefined);
  const lastAnimal = useRef<Animal | null>(null);
  const t = useT();
  const language = useAppLanguage().id;
  /** While developing, `?animal=<id>` feeds, houses or asks only that animal, to look at its rounds and its home. */
  const [devAnimal] = useState(() => (DEV ? ANIMALS.find((a) => a.id === new URLSearchParams(window.location.search).get("animal")) : undefined));
  // The real animal sounds (and the munch), loaded at once so even the first round sounds real.
  useEffect(() => loadRecordings([...ANIMAL_RECORDINGS, ...SHADOW_RECORDINGS, "munch"]), []);

  /** The next animal to feed, house or ask, never the one of the round before (the kinds share some). */
  const drawAnimal = (draw: () => Animal, has: (a: Animal) => unknown) => {
    if (devAnimal && has(devAnimal)) return devAnimal;
    let animal = draw();
    if (animal === lastAnimal.current) animal = draw();
    lastAnimal.current = animal;
    return animal;
  };

  /** The kind of the round after `last` and its animal or small one, drawn from the decks before its choices are dealt. */
  function drawSubject(last: RoundKind | null): RoundSubject {
    if (devGrowth.current) return { kind: "grow", growth: devGrowth.current };
    const kind = nextKind(last, settings.kinds);
    if (kind === "grow") return { kind, growth: drawGrowth() };
    if (kind === "gift") return { kind, animal: drawAnimal(drawGiver, (a) => a.gives) };
    return kind === "feed" ? { kind, animal: drawAnimal(drawFed, (a) => a.food) } : { kind, animal: drawAnimal(drawHoused, (a) => a.home) };
  }
  /** The choices of a round, dealt as it comes on, on the step the child is on now. */
  function deal(subject: RoundSubject): AnimalRound {
    // A fixed difficulty plays its step; switched back to „Von selbst“, the game climbs on from there.
    if (settings.difficulty !== "auto" && levelRef.current !== FIXED_LEVELS[settings.difficulty]) {
      levelRef.current = FIXED_LEVELS[settings.difficulty];
      resultsRef.current = [];
    }
    const { choices } = ANIMAL_LEVELS[levelRef.current];
    if (subject.kind === "grow") return dealGrow(subject.growth, choices);
    if (subject.kind === "gift") return dealGift(subject.animal, choices);
    return subject.kind === "feed" ? dealFeed(subject.animal, choices) : dealHome(subject.animal, choices);
  }

  // Dealt once per turn: the round must stay the same while it is played, however often this renders. The next round's
  // animal or small one is drawn a turn ahead (`upcoming`), so its lines load while this one is played; its choices are
  // dealt only when it comes, on the step this round leads to.
  const dealt = useRef<{ turn: number; round: AnimalRound; newKind: boolean; upcoming: RoundSubject; kinds: AnimalsSettings["kinds"] } | null>(null);
  if (dealt.current?.turn !== turn) {
    const last = dealt.current?.round.kind ?? null;
    const round = deal(dealt.current?.upcoming ?? drawSubject(last));
    dealt.current = { turn, round, newKind: round.kind !== last, upcoming: drawSubject(round.kind), kinds: settings.kinds };
  } else if (dealt.current.kinds !== settings.kinds) {
    // Other kinds chosen behind ⚙️ while this round is played: the next round is drawn again.
    const { round } = dealt.current;
    lastAnimal.current = "animal" in round ? round.animal : null;
    dealt.current = { ...dealt.current, upcoming: drawSubject(round.kind), kinds: settings.kinds };
  }
  const { round, upcoming } = dealt.current;

  const auto = settings.difficulty === "auto";
  const onSolved = useCallback(
    (misses: number) => {
      if (!auto) return;
      // How this round went decides the next one's step.
      const results = [...resultsRef.current, misses];
      const level = nextLevel(levelRef.current, results, ANIMAL_LEVELS.length - 1);
      resultsRef.current = level === levelRef.current ? results : [];
      levelRef.current = level;
    },
    [auto],
  );

  const onNext = useCallback(() => {
    // Every four rounds (one of each kind) are a game for a game limit: with the last one played, the game says good night.
    if ((turn + 1) % KIND_ORDER.length === 0) {
      gameEnded();
      if (isPlaytimeOver()) return;
      countGame();
    }
    setTurn(turn + 1);
  }, [turn]);

  // What the round is about, as plain text under its picture.
  const topic = <RoundTopic kind={round.kind} />;
  // When the kind of round changes (also the first round), the voice says its question once before the round's own (Z-24).
  const intro = dealt.current.newKind ? t(KIND_QUESTIONS[round.kind]) : undefined;
  // The round comes on once the lines it starts with are loaded, so its question comes with its picture (the paw track
  // shows meanwhile); then the rest of its lines load and the next round's question and answer – never all the game's
  // lines at once.
  const upcomingIntro = upcoming.kind !== round.kind ? t(KIND_QUESTIONS[upcoming.kind]) : undefined;
  const ready = useVoiceReady(animalsVoice, [...(intro ? [intro] : []), ...questionLines(round, language)], language, {
    next: [
      ...answerLines(round, language),
      ...wrongLines(round, language),
      ...(upcomingIntro ? [upcomingIntro] : []),
      ...questionLines(upcoming, language),
      ...answerLines(upcoming, language),
    ],
  });
  if (!ready) return null;
  return round.kind === "grow" ? (
    <GrowPlay key={turn} settings={settings} round={round} topic={topic} intro={intro} onSolved={onSolved} onNext={onNext} />
  ) : (
    <AnimalsPlay key={turn} settings={settings} round={round} topic={topic} intro={intro} onSolved={onSolved} onNext={onNext} />
  );
}
