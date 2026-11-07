import { useCallback, useEffect, useRef, useState } from "react";
import { PEEK_ITEMS, SHADOW_RECORDINGS } from "@/games/shadows/content";
import { useDeck } from "@/games/shadows/deck";
import { nextLevel } from "@/games/shadows/levels";
import { PeekPlay } from "@/games/shadows/PeekPlay";
import { DEV } from "@/lib/buildInfo";
import { countGame, gameEnded, isPlaytimeOver } from "@/lib/playtime";
import { loadRecordings } from "@/lib/sfx";
import { AnimalsPlay } from "./AnimalsPlay";
import { ANIMAL_RECORDINGS, ANIMALS, GIVERS, type Animal } from "./content";
import { GrowPlay } from "./GrowPlay";
import { GROWTHS } from "./growth";
import { ANIMAL_LEVELS, dealFeed, dealGift, dealGrow, dealHome, dealPeek, FIXED_LEVELS, KIND_ORDER, nextKind, type RoundKind } from "./levels";
import type { AnimalsSettings } from "./settings";
import { RoundTopic } from "./RoundTopic";

const FED = ANIMALS.filter((a) => a.food);
const HOUSED = ANIMALS.filter((a) => a.home);

/**
 * "Was gehört zum Tier?" as one flowing game: who peeks out, feeding, what the animal gives us, who lives where and
 * what the small one becomes take turns in that order,
 * and the difficulty follows how the child plays (`ANIMAL_LEVELS`). Grown-ups may switch kinds off or fix the
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
  const drawPeek = useDeck(PEEK_ITEMS);
  const drawGrowth = useDeck(GROWTHS);
  const lastAnimal = useRef<Animal | null>(null);
  // The real animal sounds (and the munch), loaded at once so even the first round sounds real.
  useEffect(() => loadRecordings([...ANIMAL_RECORDINGS, ...SHADOW_RECORDINGS, "munch"]), []);

  /** The next animal to feed, house or ask, never the one of the round before (the kinds share some). */
  const drawAnimal = (draw: () => Animal) => {
    let animal = draw();
    if (animal === lastAnimal.current) animal = draw();
    lastAnimal.current = animal;
    return animal;
  };

  // Dealt once per turn: the round must stay the same while it is played, however often this renders.
  const dealt = useRef<{ turn: number; round: ReturnType<typeof deal> } | null>(null);
  function deal(last: RoundKind | null) {
    // A fixed difficulty plays its step; switched back to „Von selbst“, the game climbs on from there.
    if (settings.difficulty !== "auto" && levelRef.current !== FIXED_LEVELS[settings.difficulty]) {
      levelRef.current = FIXED_LEVELS[settings.difficulty];
      resultsRef.current = [];
    }
    const level = ANIMAL_LEVELS[levelRef.current];
    const kind = nextKind(last, settings);
    if (kind === "peek") {
      const item = drawPeek();
      return { kind, item, choices: dealPeek(item, PEEK_ITEMS, level.peek), level: level.peek } as const;
    }
    if (kind === "grow") return dealGrow(drawGrowth(), level.choices);
    if (kind === "gift") return dealGift(drawAnimal(drawGiver), level.choices);
    return kind === "feed" ? dealFeed(drawAnimal(drawFed), level.choices) : dealHome(drawAnimal(drawHoused), level.choices);
  }
  if (dealt.current?.turn !== turn) dealt.current = { turn, round: deal(dealt.current?.round.kind ?? null) };
  const round = dealt.current.round;

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
    // Every five rounds (one of each kind) are a game for a game limit: with the last one played, the game says good night.
    if ((turn + 1) % KIND_ORDER.length === 0) {
      gameEnded();
      if (isPlaytimeOver()) return;
      countGame();
    }
    setTurn(turn + 1);
  }, [turn]);

  // What the round is about, as plain text under its picture.
  const topic = <RoundTopic kind={round.kind} />;
  return round.kind === "peek" ? (
    <PeekPlay key={turn} settings={settings} item={round.item} choices={round.choices} level={round.level} topic={topic} onSolved={onSolved} onNext={onNext} />
  ) : round.kind === "grow" ? (
    <GrowPlay key={turn} settings={settings} round={round} topic={topic} onSolved={onSolved} onNext={onNext} />
  ) : (
    <AnimalsPlay key={turn} settings={settings} round={round} topic={topic} onSolved={onSolved} onNext={onNext} />
  );
}
