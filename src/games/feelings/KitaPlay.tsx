import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { imageFor, preloadImages, storyImages } from "./images";
import { QUESTION, SITUATIONS, type Situation } from "./kita";
import type { FeelingsSettings } from "./settings";
import { ChoiceCard, EndButtons, Mark, StepDots, StoryPicture, useTimers, useVoice, type CardState } from "./shared";
import { beatMs, type Beat } from "./story";

const NEXT_QUESTION = "Und jetzt?";

type Phase = "intro" | "steps" | "outro" | "done";

interface Run {
  /** Changes with every new story, so a story played again starts fresh. */
  key: number;
  situation: Situation;
  phase: Phase;
  stepsDone: number;
  /** The not-so-good idea next to this step was tried already. */
  tried: boolean;
  /** The not-so-good idea is shown crossed out right now. */
  trying: boolean;
  /** Whether the not-so-good idea sits left of the good one; mixed anew for every step. */
  insteadFirst: boolean;
  /** Beats are playing; buttons wait. */
  busy: boolean;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function freshRun(situation: Situation, key: number): Run {
  return {
    key,
    situation,
    phase: "intro",
    stepsDone: 0,
    tried: false,
    trying: false,
    insteadFirst: Math.random() < 0.5,
    busy: true,
  };
}

/** The big picture for this moment: what happened, the step the bear just did, the not-so-good idea, or the happy end. */
function pictureName({ situation, phase, stepsDone, trying }: Run): string {
  const { id, steps } = situation;
  if (trying) return storyImages.instead(id, stepsDone);
  if (phase === "outro" || phase === "done") {
    return imageFor(storyImages.end(id)) ? storyImages.end(id) : storyImages.step(id, steps.length - 1);
  }
  return stepsDone > 0 ? storyImages.step(id, stepsDone - 1) : storyImages.problem(id);
}

/** What the big picture shows, in a few words for grown-ups. */
function pictureCaption({ situation, phase, stepsDone, trying }: Run): string {
  if (trying) return situation.steps[stepsDone].instead.caption;
  if (phase === "outro" || phase === "done") return situation.endCaption;
  return stepsDone > 0 ? situation.steps[stepsDone - 1].caption : situation.caption;
}

export function KitaPlay({ settings }: { settings: FeelingsSettings }) {
  // The story the grown-up picked comes first; without one all come in random order.
  const chosen = SITUATIONS.find((s) => s.id === settings.situation);
  const deck = useRef<Situation[]>([]);
  const nextKey = useRef(0);
  const [run, setRun] = useState<Run>(() => freshRun(chosen ?? SITUATIONS[0], nextKey.current++));
  const { later, clearAll } = useTimers();
  const { say, sound } = useVoice(settings);

  /** Plays the beats one after another, then calls `then`. */
  const playBeats = useCallback(
    (beats: Beat[], then: () => void) => {
      setRun((r) => ({ ...r, busy: true }));
      let delay = 0;
      beats.forEach((beat, i) => {
        later(() => {
          sound(beat.sound);
          const text = [beat.narration, beat.line].filter(Boolean).join(" ");
          if (text) say(text, i > 0);
        }, delay);
        delay += beatMs(beat, settings.speech);
      });
      later(then, delay);
    },
    [later, say, sound, settings.speech],
  );

  const ask = useCallback(
    (question: string) => {
      setRun((r) => ({ ...r, busy: false }));
      say(question, true);
    },
    [say],
  );

  const startSituation = useCallback(
    (situation: Situation) => {
      clearAll();
      preloadImages([
        storyImages.problem(situation.id),
        storyImages.end(situation.id),
        ...situation.steps.flatMap((_, i) => [storyImages.step(situation.id, i), storyImages.instead(situation.id, i)]),
      ]);
      setRun(freshRun(situation, nextKey.current++));
      playBeats(situation.intro, () => {
        setRun((r) => ({ ...r, phase: "steps" }));
        ask(QUESTION);
      });
    },
    [clearAll, playBeats, ask],
  );

  // After a picked story the others follow in order, so „Weiter“ never plays the same one again.
  // Without one, go through all stories in random order before any comes again.
  const nextSituation = useCallback(() => {
    if (chosen) return startSituation(SITUATIONS[(SITUATIONS.indexOf(run.situation) + 1) % SITUATIONS.length]);
    if (deck.current.length === 0) {
      deck.current = shuffle(SITUATIONS);
      const last = deck.current.length - 1;
      if (last > 0 && deck.current[last] === run.situation) {
        [deck.current[0], deck.current[last]] = [deck.current[last], deck.current[0]];
      }
    }
    startSituation(deck.current.pop()!);
  }, [chosen, run.situation, startSituation]);

  useEffect(() => {
    deck.current = [];
    if (chosen) startSituation(chosen);
    else nextSituation();
    // Only when the picked story changes; nextSituation changes with every story.
  }, [chosen]);

  const doStep = useCallback(
    (i: number) => {
      const { situation } = run;
      const step = situation.steps[i];
      setRun((r) => ({ ...r, stepsDone: i + 1 }));
      // The good idea gets a happy chime.
      sound("chime");
      playBeats(step.beats, () => {
        if (i + 1 < situation.steps.length) {
          setRun((r) => ({ ...r, tried: false, insteadFirst: Math.random() < 0.5 }));
          ask(NEXT_QUESTION);
          return;
        }
        setRun((r) => ({ ...r, phase: "outro" }));
        playBeats(situation.outro, () => setRun((r) => ({ ...r, phase: "done", busy: false })));
      });
    },
    [run, sound, playBeats, ask],
  );

  const tryInstead = useCallback(() => {
    const { answer } = run.situation.steps[run.stepsDone].instead;
    setRun((r) => ({ ...r, tried: true, trying: true, busy: true }));
    say(answer);
    sound("yuck");
    later(() => setRun((r) => ({ ...r, busy: false, trying: false })), beatMs({ narration: answer }, settings.speech));
  }, [run, say, sound, later, settings.speech]);

  const ready = run.phase === "steps" && !run.busy;

  // The two buttons a child can choose from, left to right.
  const goodStep = () => doStep(run.stepsDone);
  const choices = run.insteadFirst ? [tryInstead, goodStep] : [goodStep, tryInstead];

  // The arrow keys pick the left or right card; every other key picks the good idea, so mashing keys still tells the story.
  const pressKey = useCallback(
    (key: string) => {
      if (run.phase === "done") return nextSituation();
      if (!ready) return;
      if (!run.tried && key === "ArrowLeft") return choices[0]();
      if (!run.tried && key === "ArrowRight") return choices[1]();
      goodStep();
    },
    [run, ready, choices, nextSituation, goodStep],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!e.repeat) pressKey(e.key);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey]);

  const { situation } = run;

  // Only what the child can choose from now is shown, big; while the happy end plays all good steps once more, small.
  let cards: ReactNode = null;
  if (run.phase === "done") {
    cards = <EndButtons onAgain={() => startSituation(situation)} onNext={nextSituation} />;
  } else if (run.phase === "outro") {
    cards = situation.steps.map((step, i) => (
      <ChoiceCard key={step.caption} image={storyImages.step(situation.id, i)} caption={step.caption} state="done" small />
    ));
  } else if (run.phase === "steps") {
    const playing = run.busy && !run.trying;
    const index = playing ? Math.max(0, run.stepsDone - 1) : run.stepsDone;
    const step = situation.steps[index];
    const stepState: CardState = playing ? "playing" : run.trying ? "rest" : "choose";
    const insteadState: CardState = run.tried ? "wrong" : playing ? "rest" : "choose";
    const good = (
      <ChoiceCard key="good" image={storyImages.step(situation.id, index)} caption={step.caption} state={stepState} onChoose={() => doStep(index)} />
    );
    const instead = (
      <ChoiceCard key="instead" image={storyImages.instead(situation.id, index)} caption={step.instead.caption} state={insteadState} onChoose={tryInstead} />
    );
    cards = run.insteadFirst ? [instead, good] : [good, instead];
  }

  const picture = pictureName(run);
  const caption = pictureCaption(run);

  return (
    <div className="story-play kita-play" onPointerDown={() => run.phase === "done" && nextSituation()}>
      <header className="story-top">
        <StepDots total={situation.steps.length} done={Math.min(run.stepsDone, situation.steps.length)} current={run.phase === "steps"} />
      </header>
      <main className="story-middle">
        <StoryPicture key={`${run.key}-${picture}`} name={picture} caption={caption}>
          {run.trying && <Mark good={false} className="fg-picture-mark" />}
        </StoryPicture>
      </main>
      <footer className="story-choices">{cards}</footer>
    </div>
  );
}
