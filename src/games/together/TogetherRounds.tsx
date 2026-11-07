import { useCallback, useEffect, useRef, useState } from "react";
import { useDeck } from "@/games/shadows/deck";
import { nextLevel } from "@/games/shadows/levels";
import { DEV } from "@/lib/buildInfo";
import { countGame, gameEnded, isPlaytimeOver } from "@/lib/playtime";
import { loadRealSounds } from "@/lib/realSounds";
import { dealRound, FIXED_LEVELS, nextKind, ROUNDS_PER_GAME, TOGETHER_LEVELS, type RoundKind } from "./levels";
import { PAIRS, pairsOf } from "./pairs";
import type { TogetherSettings } from "./settings";
import { TogetherPlay } from "./TogetherPlay";
import { RoundTopic } from "./RoundTopic";

const OF_DAY = pairsOf("pair");
const HELPERS = pairsOf("helper");

/**
 * "Was gehört zusammen?" as one flowing game: a thing of the day and a helper take turns, and the difficulty follows
 * how the child plays (`TOGETHER_LEVELS`). Grown-ups may switch a kind off or fix the difficulty while playing; that
 * counts from the next round. Each round is mounted anew, with a quiet line under its picture saying what it is about.
 */
export function TogetherRounds({ settings }: { settings: TogetherSettings }) {
  const [turn, setTurn] = useState(0);
  /**
   * The difficulty step (an index into `TOGETHER_LEVELS`); every visit begins on the first. While developing,
   * `?level=N` starts on step N, to look at the harder rounds.
   */
  const levelRef = useRef(Math.min(TOGETHER_LEVELS.length - 1, Number(DEV && new URLSearchParams(window.location.search).get("level")) || 0));
  /** The wrong picks in each round on the current step, newest last; cleared on each step up or down. */
  const resultsRef = useRef<number[]>([]);
  const drawOfDay = useDeck(OF_DAY);
  const drawHelper = useDeck(HELPERS);
  // The real recordings among the sounds (the giggle, the splash), loaded at once so even the first round sounds real.
  useEffect(() => loadRealSounds(PAIRS.flatMap((p) => p.sounds.map(([, sound]) => sound))), []);

  // Dealt once per turn: the round must stay the same while it is played, however often this renders.
  const dealt = useRef<{ turn: number; round: ReturnType<typeof deal> } | null>(null);
  function deal(last: RoundKind | null) {
    // A fixed difficulty plays its step; switched back to „Von selbst“, the game climbs on from there.
    if (settings.difficulty !== "auto" && levelRef.current !== FIXED_LEVELS[settings.difficulty]) {
      levelRef.current = FIXED_LEVELS[settings.difficulty];
      resultsRef.current = [];
    }
    // While developing, `?pair=<id>` shows that pair first, to look at it.
    const shown = DEV && last === null ? PAIRS.find((p) => p.id === new URLSearchParams(window.location.search).get("pair")) : undefined;
    if (shown) return dealRound(shown, PAIRS, TOGETHER_LEVELS[levelRef.current]);
    const kind = nextKind(last, settings.kinds);
    const pair = kind === "pair" ? drawOfDay() : drawHelper();
    return dealRound(pair, PAIRS, TOGETHER_LEVELS[levelRef.current]);
  }
  if (dealt.current?.turn !== turn) dealt.current = { turn, round: deal(dealt.current?.round.kind ?? null) };
  const round = dealt.current.round;

  const auto = settings.difficulty === "auto";
  const onSolved = useCallback(
    (misses: number) => {
      if (!auto) return;
      // How this round went decides the next one's step.
      const results = [...resultsRef.current, misses];
      const level = nextLevel(levelRef.current, results, TOGETHER_LEVELS.length - 1);
      resultsRef.current = level === levelRef.current ? results : [];
      levelRef.current = level;
    },
    [auto],
  );

  const onNext = useCallback(() => {
    // Every few rounds are a game for a game limit: with the last one played, the game says good night.
    if ((turn + 1) % ROUNDS_PER_GAME === 0) {
      gameEnded();
      if (isPlaytimeOver()) return;
      countGame();
    }
    setTurn(turn + 1);
  }, [turn]);

  return <TogetherPlay key={turn} settings={settings} round={round} onSolved={onSolved} onNext={onNext} topic={<RoundTopic kind={round.kind} />} />;
}
