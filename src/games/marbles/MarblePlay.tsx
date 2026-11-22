import { Suspense, use, useCallback, useEffect, useState, type PointerEvent } from "react";
import { useLocation } from "react-router";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { GameEnd } from "@/components/GameEnd";
import { useLevelOnScreen } from "@/components/GameShell";
import { PageLoading } from "@/components/PageLoading";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { playLullaby, playMelody } from "@/lib/sfx";
import { type Localized, pick, useAppLanguage } from "@/lib/language";
import { savesData } from "@/lib/pwa";
import { useTimers } from "@/lib/timers";
import { awardTrophy, gameOfPath } from "@/lib/trophies";
import { type LevelEntry, LEVELS, loadLevel, prefetchLevel, RUNS } from "./catalog";
import { LEVEL_TEXTS } from "./content";
import { useAnyKey, type LevelProps } from "./level";
import type { MarbleLevel, MarbleSettings } from "./settings";
import { marblesVoice } from "./voice";
import "./marbles.css";

/** The levels in turn, beginning with the chosen one (`/kettenreaktion/garden/` opens that one), so „Weiter“ always has a next. */
function chosenLevels(choice: MarbleSettings["levels"]): MarbleLevel[] {
  const first = Math.max(
    0,
    LEVELS.findIndex((l) => l.id === choice),
  );
  return [...LEVELS.slice(first), ...LEVELS.slice(0, first)].map((l) => l.id);
}

/** Party time after a level, before "Nochmal" and "Weiter" come. */
const PARTY_MS = 3200;

/** Plays a level's sound effect (`LevelProps.sound`). */
const play = (sound: () => void) => sound();

/**
 * "Kettenreaktion": one tap, and one thing sets off the next – the marble
 * run, the Rube Goldberg machines and the long row of things that fall over,
 * one level after the other (from the one the grown-up chose).
 * After each level the child plays it again or goes on.
 */
export function MarblePlay({ settings }: { settings: MarbleSettings }) {
  const language = useAppLanguage();
  const levels = chosenLevels(settings.levels);
  /** Which level in turn is on, and how often a level was started (a new one or the same again). */
  const [index, setIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [party, setParty] = useState(false);
  const [ended, setEnded] = useState(false);
  const levelAt = (i: number) => LEVELS.find((l) => l.id === levels[i % levels.length]) ?? LEVELS[0];
  const level = levelAt(index);
  const next = levelAt(index + 1);
  // „Weiter“ plays the next level without changing the card picked: the address names the one on screen.
  useLevelOnScreen(level.id);
  const { effects, ripple } = useTapFeedback();
  // The marble runs play their own notes and scales, and the good-night machine its music box: a song on top would clash with them.
  useNoBackgroundMusic(RUNS.includes(level.id) || level.id === "night");
  const { later } = useTimers();

  // Every line is said from its ElevenLabs recording in the app language; a line not translated yet in German. Lines wait
  // for each other, but a level's first line cuts off what is still said from before.
  const say = useCallback((text: Localized, queue = true) => marblesVoice.say(pick(text, language.id), language.id, { queue }), [language.id]);
  // Its few dozen lines are fetched as it starts, so none comes late (src/lib/voice.ts: `loadAll` only for so few).
  useEffect(() => marblesVoice.loadAll(language.id), [language.id]);

  const onDone = useCallback(() => {
    setParty(true);
    // „Weiter“ should not wait for the next level's code: fetched during the party, never while a level runs.
    if (!savesData()) prefetchLevel(next);
    // The good-night machine ends as calmly as it ran.
    (level.id === "night" ? playLullaby : playMelody)();
    later(() => {
      setParty(false);
      setEnded(true);
    }, PARTY_MS);
  }, [level.id, later, next]);

  // One ball in the goal is enough for the level's trophy (user decision, November 2026); the end shows it beside its buttons.
  const game = gameOfPath(useLocation().pathname)?.href;
  const onGoal = useCallback(() => {
    if (game) awardTrophy(game, level.id, Date.now(), { early: true });
  }, [game, level.id]);

  const startLevel = (nextIndex: number) => {
    setEnded(false);
    setIndex(nextIndex);
    setRound((r) => r + 1);
  };
  const again = () => startLevel(index);
  const goOn = () => startLevel(index + 1);

  // Keys start each level, so a key goes on after one too.
  useAnyKey(() => {
    if (ended) goOn();
  });

  // While the party is on, taps make ripples.
  const onPointerDown = (e: PointerEvent) => {
    if (party) ripple(e.clientX, e.clientY);
  };

  return (
    <div className={`marble-play${party ? " party" : ""}`} data-level={level.id} onPointerDown={onPointerDown}>
      {/* The paper with the paw track while the level's code still loads – never a dark screen. */}
      <Suspense fallback={<PageLoading />}>
        <PlayedLevel key={round} entry={level} sound={play} say={say} onDone={onDone} onGoal={onGoal} watch={settings.play === "watch"} />
      </Suspense>
      {ended && <GameEnd level={level.id} onAgain={again} next={{ name: pick(LEVEL_TEXTS[next.id].name, language.id), onNext: goOn }} />}
      <FeedbackLayer effects={effects} />
    </div>
  );
}

/** One level played: waits (suspends) for its code, then says its first line and plays it. */
function PlayedLevel({ entry, ...props }: LevelProps & { entry: LevelEntry }) {
  const Level = use(loadLevel(entry));
  const { say } = props;
  // Its first line comes with its picture, not while its code still loads; a level's first line cuts off what is still said from before.
  useEffect(() => {
    say(LEVEL_TEXTS[entry.id].intro, false);
  }, [entry, say]);
  return <Level {...props} />;
}
