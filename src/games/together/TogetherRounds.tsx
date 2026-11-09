import { useCallback, useEffect, useRef, useState } from "react";
import { DevTag, letterCode } from "@/components/DevTag";
import { useDeck } from "@/games/shadows/deck";
import { nextLevel } from "@/games/shadows/levels";
import { DEV } from "@/lib/buildInfo";
import { pick, useAppLanguage } from "@/lib/language";
import { countGame, gameEnded, isPlaytimeOver } from "@/lib/playtime";
import { loadRealSounds } from "@/lib/realSounds";
import { useVoiceReady } from "@/lib/voiceReady";
import { dealRound, FIXED_LEVELS, nextKind, ROUNDS_PER_GAME, TOGETHER_LEVELS, type RoundKind, type TogetherRound } from "./levels";
import { partImage } from "./frames";
import { PAIRS, type Pair, pairsOf, TOGETHER_TEXTS } from "./pairs";
import { TOPICS } from "./topics";
import type { TogetherSettings } from "./settings";
import { roundLines, TogetherPlay } from "./TogetherPlay";
import { RoundTopic } from "./RoundTopic";
import { togetherVoice } from "./voice";

const OF_DAY = pairsOf("pair");
const HELPERS = pairsOf("helper");

/** The picture files a round shows: its own frames, and the first frame and partner picture of every choice. */
function imagesOf(round: TogetherRound): string[] {
  const urls: string[] = [];
  for (const frame of round.pair.frames ?? []) urls.push(frame);
  for (const choice of round.choices) {
    const first = choice.frames?.[0];
    if (first) urls.push(first);
    const part = choice.partner.image && partImage(choice.partner.image);
    if (part) urls.push(part);
  }
  return urls;
}

/**
 * True once the round's pictures are decoded. The round's caption stands under its picture, so both come together:
 * without this the text showed long before the picture file had loaded (user feedback, November 2026).
 */
function useImagesReady(round: TogetherRound): boolean {
  const key = imagesOf(round).join("|");
  const [loaded, setLoaded] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const urls = key ? key.split("|") : [];
    Promise.all(
      urls.map((src) => {
        const img = new Image();
        img.src = src;
        return img.decode().catch(() => undefined);
      }),
    ).then(() => {
      if (!cancelled) setLoaded(key);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);
  return loaded === key;
}

/** Developer code of a pair ("C07": its topic's letter, its place among that topic's pairs), to name a scene in feedback. */
function pairCode(pair: (typeof PAIRS)[number]): string {
  const topic = Object.keys(TOPICS).indexOf(pair.topic);
  const place = PAIRS.filter((p) => p.topic === pair.topic).indexOf(pair) + 1;
  return `${letterCode(topic)}${String(place).padStart(2, "0")}`;
}

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

  const draw = (kind: RoundKind) => (kind === "pair" ? drawOfDay() : drawHelper());

  /**
   * Dealt once per turn: the round must stay the same while it is played, however often this renders. The pair of the
   * round after it (`next`) is drawn a turn ahead, so its lines load while this one plays; that round's choices and
   * difficulty are dealt only on its turn, since this round's play may still change the difficulty.
   */
  const dealt = useRef<{ turn: number; round: TogetherRound; next: Pair } | null>(null);
  function deal(before: { round: TogetherRound; next: Pair } | null): TogetherRound {
    // A fixed difficulty plays its step; switched back to „Von selbst“, the game climbs on from there.
    if (settings.difficulty !== "auto" && levelRef.current !== FIXED_LEVELS[settings.difficulty]) {
      levelRef.current = FIXED_LEVELS[settings.difficulty];
      resultsRef.current = [];
    }
    // While developing, `?pair=<id>` shows that pair first, to look at it.
    const asked = DEV && before === null ? PAIRS.find((p) => p.id === new URLSearchParams(window.location.search).get("pair")) : undefined;
    if (asked) return dealRound(asked, PAIRS, TOGETHER_LEVELS[levelRef.current]);
    const kind = nextKind(before?.round.kind ?? null, settings.kinds);
    // The pair drawn ahead, unless grown-ups switched its kind off meanwhile.
    const pair = before?.next.kind === kind ? before.next : draw(kind);
    return dealRound(pair, PAIRS, TOGETHER_LEVELS[levelRef.current]);
  }
  if (dealt.current?.turn !== turn) {
    const round = deal(dealt.current);
    dealt.current = { turn, round, next: draw(nextKind(round.kind, settings.kinds)) };
  }
  const { round, next } = dealt.current;

  // A round starts only once the lines it may say are loaded (the paw track shows meanwhile); the last round's picture
  // stays till then. The next pair's question and praise load behind it.
  const language = useAppLanguage();
  const texts = pick(TOGETHER_TEXTS, language.id);
  const ready = useVoiceReady(togetherVoice, roundLines(round, texts), language.id, { next: [texts.question(next), texts.right(next)] });
  const imagesReady = useImagesReady(round);
  const shownRef = useRef<{ turn: number; round: TogetherRound } | null>(null);
  if (ready && imagesReady && shownRef.current?.turn !== turn) shownRef.current = { turn, round };
  const shown = shownRef.current;

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

  if (!shown) return null;
  return (
    <>
      <TogetherPlay
        key={shown.turn}
        settings={settings}
        round={shown.round}
        onSolved={onSolved}
        onNext={onNext}
        topic={<RoundTopic pair={shown.round.pair} />}
      />
      <DevTag code={pairCode(shown.round.pair)} id={shown.round.pair.id} />
    </>
  );
}
