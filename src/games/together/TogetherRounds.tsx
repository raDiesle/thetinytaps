import { useCallback, useEffect, useRef, useState } from "react";
import { DevTag, letterCode } from "@/components/DevTag";
import { StepBack } from "@/components/StepBack";
import { useDeck } from "@/games/shadows/deck";
import { nextLevel } from "@/games/shadows/levels";
import { DEV } from "@/lib/buildInfo";
import { type Localized, pick, useAppLanguage, useT } from "@/lib/language";
import { countGame, gameEnded, isPlaytimeOver } from "@/lib/playtime";
import { loadRealSounds } from "@/lib/realSounds";
import { useVoiceReady } from "@/lib/voiceReady";
import { dealRound, nextKind, ROUNDS_PER_GAME, TOGETHER_LEVELS, type RoundKind, type TogetherRound } from "./levels";
import { partImage } from "./frames";
import { PAIRS, type Pair, pairsOf, TOGETHER_TEXTS } from "./pairs";
import { TOPICS } from "./topics";
import type { TogetherSettings } from "./settings";
import { roundLines, TogetherPlay } from "./TogetherPlay";
import { RoundTopic } from "./RoundTopic";
import { togetherVoice } from "./voice";
import { useStepAddress } from "@/lib/stepAddress";

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

/** The way back's name, read out („Vorige Szene“ in every language, as in Gefühle). */
const PREVIOUS: Localized = {
  de: "Vorige Szene",
  en: "Previous scene",
  zh: "上一个场景",
  hi: "पिछला दृश्य",
  es: "Escena anterior",
  ar: "المشهد السابق",
  ru: "Предыдущая сцена",
};

/**
 * "Was gehört zusammen?" as one flowing game: a thing of the day and a helper take turns, and the difficulty follows
 * how the child plays (`TOGETHER_LEVELS`). Grown-ups pick what comes up in the corner while playing. Each round is
 * mounted anew, with a quiet line under its picture saying what it is about, and ◀ bottom left shows the round before
 * again, as it was dealt (user request, November 2026).
 */
export function TogetherRounds({ settings }: { settings: TogetherSettings }) {
  const t = useT();
  const [turn, setTurn] = useState(0);
  // The round on screen in the address (`?seite=3`), so the time-on-page event tells how many rounds were played.
  useStepAddress(turn + 1);
  /**
   * The difficulty step (an index into `TOGETHER_LEVELS`); every visit begins on the first. While developing,
   * `?level=N` starts on step N, to look at the harder rounds.
   */
  const levelRef = useRef(Math.min(TOGETHER_LEVELS.length - 1, Number(DEV && new URLSearchParams(window.location.search).get("level")) || 0));
  /** The wrong picks in each round on the current step, newest last; cleared on each step up or down. */
  const resultsRef = useRef<number[]>([]);
  /** The furthest turn reached: a round played again after ◀ counts no second time for the play-time limit. */
  const furthest = useRef(0);
  const drawOfDay = useDeck(OF_DAY);
  const drawHelper = useDeck(HELPERS);
  // The real recordings among the sounds (the giggle, the splash), loaded at once so even the first round sounds real.
  useEffect(() => loadRealSounds(PAIRS.flatMap((p) => p.sounds.map(([, sound]) => sound))), []);

  const draw = (kind: RoundKind) => (kind === "pair" ? drawOfDay() : drawHelper());

  /**
   * Every round dealt so far, by turn: a round must stay the same while it is played, however often this renders, and
   * ◀ shows the one before as it was. Going on after ◀ plays the rounds already dealt again, like turning a book's pages.
   * The pair of the round after the last one (`ahead`) is drawn a turn early, so its lines load while this one plays;
   * that round's choices and difficulty are dealt only on its turn, since this round's play may still change them.
   */
  const rounds = useRef<TogetherRound[]>([]);
  const ahead = useRef<Pair | null>(null);
  /** The kinds the rounds were dealt for: a kind chosen in the corner comes at once. */
  const dealtFor = useRef(settings.kinds);
  function deal(before: TogetherRound | null): TogetherRound {
    // While developing, `?pair=<id>` shows that pair first, to look at it.
    const asked = DEV && before === null ? PAIRS.find((p) => p.id === new URLSearchParams(window.location.search).get("pair")) : undefined;
    if (asked) return dealRound(asked, PAIRS, TOGETHER_LEVELS[levelRef.current]);
    const kind = nextKind(before?.kind ?? null, settings.kinds);
    // The pair drawn ahead, unless grown-ups switched its kind off meanwhile.
    const pair = ahead.current?.kind === kind ? ahead.current : draw(kind);
    ahead.current = null;
    return dealRound(pair, PAIRS, TOGETHER_LEVELS[levelRef.current]);
  }
  if (dealtFor.current !== settings.kinds) {
    dealtFor.current = settings.kinds;
    ahead.current = null;
    // The rounds after this one are dealt anew for the new choice. One other kind chosen comes at once, not only after
    // this round – the grown-up who tapped it wants to see it (as in Was gehört zum Tier?); „Gemischt“ or this round's
    // own kind lets it play on.
    const current = rounds.current[turn];
    const keep = current && (settings.kinds === "all" || settings.kinds === current.kind);
    rounds.current.length = keep ? turn + 1 : turn;
  }
  while (rounds.current.length <= turn) rounds.current.push(deal(rounds.current.at(-1) ?? null));
  const round = rounds.current[turn];
  if (!rounds.current[turn + 1] && !ahead.current) ahead.current = draw(nextKind(round.kind, settings.kinds));
  const next = rounds.current[turn + 1]?.pair ?? ahead.current ?? round.pair;

  // A round starts only once the lines it may say are loaded (the paw track shows meanwhile); the last round's picture
  // stays till then. The next pair's question and praise load behind it.
  const language = useAppLanguage();
  const texts = pick(TOGETHER_TEXTS, language.id);
  const ready = useVoiceReady(togetherVoice, roundLines(round, texts), language.id, { next: [texts.question(next), texts.right(next)] });
  const imagesReady = useImagesReady(round);
  const shownRef = useRef<{ turn: number; round: TogetherRound } | null>(null);
  if (ready && imagesReady && (shownRef.current?.turn !== turn || shownRef.current.round !== round)) shownRef.current = { turn, round };
  const shown = shownRef.current;

  const onSolved = useCallback((misses: number) => {
    // How this round went decides the next one's step.
    const results = [...resultsRef.current, misses];
    const level = nextLevel(levelRef.current, results, TOGETHER_LEVELS.length - 1);
    resultsRef.current = level === levelRef.current ? results : [];
    levelRef.current = level;
  }, []);

  const onNext = useCallback(() => {
    // Every few rounds are a game for a game limit: with the last one played, the game says good night.
    if (turn + 1 > furthest.current) {
      furthest.current = turn + 1;
      if ((turn + 1) % ROUNDS_PER_GAME === 0) {
        gameEnded();
        if (isPlaytimeOver()) return;
        countGame();
      }
    }
    setTurn(turn + 1);
  }, [turn]);

  if (!shown) return null;
  return (
    <>
      <TogetherPlay
        key={`${shown.turn}-${shown.round.pair.id}`}
        settings={settings}
        round={shown.round}
        onSolved={onSolved}
        onNext={onNext}
        topic={<RoundTopic pair={shown.round.pair} />}
        back={shown.turn > 0 && <StepBack className="tg-back" onBack={() => setTurn(shown.turn - 1)} label={t(PREVIOUS)} />}
      />
      <DevTag code={pairCode(shown.round.pair)} id={shown.round.pair.id} />
    </>
  );
}
