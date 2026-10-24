import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  /** The not-so-good idea was tried already. */
  tried: boolean;
  /** The not-so-good idea is shown crossed out right now. */
  trying: boolean;
  /** Whether the not-so-good idea sits left of the good one. */
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
  if (trying) return storyImages.instead(id);
  if (phase === "outro" || phase === "done") {
    return imageFor(storyImages.end(id)) ? storyImages.end(id) : storyImages.step(id, steps.length - 1);
  }
  return stepsDone > 0 ? storyImages.step(id, stepsDone - 1) : storyImages.problem(id);
}

export function KitaPlay({ settings }: { settings: FeelingsSettings }) {
  const situations = useMemo(
    () => (settings.situation === "all" ? SITUATIONS : SITUATIONS.filter((s) => s.id === settings.situation)),
    [settings.situation],
  );
  const deck = useRef<Situation[]>([]);
  const nextKey = useRef(0);
  const [run, setRun] = useState<Run>(() => freshRun(situations[0], nextKey.current++));
  const { later, clearAll } = useTimers();
  const { say, sound } = useVoice(settings);
  const choose = settings.answers === "choose";

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
        storyImages.instead(situation.id),
        storyImages.end(situation.id),
        ...situation.steps.map((_, i) => storyImages.step(situation.id, i)),
      ]);
      setRun(freshRun(situation, nextKey.current++));
      playBeats(situation.intro, () => {
        setRun((r) => ({ ...r, phase: "steps" }));
        ask(QUESTION);
      });
    },
    [clearAll, playBeats, ask],
  );

  // Go through all stories in random order before any comes again.
  const nextSituation = useCallback(() => {
    if (deck.current.length === 0) {
      deck.current = shuffle(situations);
      const last = deck.current.length - 1;
      if (last > 0 && deck.current[last] === run.situation) {
        [deck.current[0], deck.current[last]] = [deck.current[last], deck.current[0]];
      }
    }
    startSituation(deck.current.pop()!);
  }, [situations, run.situation, startSituation]);

  useEffect(() => {
    deck.current = [];
    nextSituation();
    // Only when the chosen stories change; nextSituation changes with every story.
  }, [situations]);

  const doStep = useCallback(
    (i: number) => {
      const { situation } = run;
      const step = situation.steps[i];
      setRun((r) => ({ ...r, stepsDone: i + 1 }));
      // Choosing between a good and a not-so-good idea: the good one gets a happy chime.
      if (choose && i === 0) sound("chime");
      playBeats(step.beats, () => {
        if (i + 1 < situation.steps.length) {
          ask(NEXT_QUESTION);
          return;
        }
        setRun((r) => ({ ...r, phase: "outro" }));
        playBeats(situation.outro, () => setRun((r) => ({ ...r, phase: "done", busy: false })));
      });
    },
    [run, choose, sound, playBeats, ask],
  );

  const tryInstead = useCallback(() => {
    const { answer } = run.situation.instead;
    setRun((r) => ({ ...r, tried: true, trying: true, busy: true }));
    say(answer);
    sound("yuck");
    later(() => setRun((r) => ({ ...r, busy: false, trying: false })), beatMs({ narration: answer }, settings.speech));
  }, [run, say, sound, later, settings.speech]);

  const ready = run.phase === "steps" && !run.busy;
  const offerInstead = choose && run.phase === "steps" && run.stepsDone === 0;

  // The two buttons a child can choose from first, left to right.
  const firstChoices = run.insteadFirst ? [tryInstead, () => doStep(0)] : [() => doStep(0), tryInstead];

  const pressKey = useCallback(
    (key: string) => {
      if (run.phase === "done") return nextSituation();
      if (!ready) return;
      if (offerInstead && !run.tried) {
        if (key === "ArrowLeft") firstChoices[0]();
        else if (key === "ArrowRight") firstChoices[1]();
        else say(QUESTION);
        return;
      }
      doStep(run.stepsDone);
    },
    [run, ready, offerInstead, firstChoices, nextSituation, say, doStep],
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
  let choices: ReactNode = null;
  if (run.phase === "done") {
    choices = <EndButtons onAgain={() => startSituation(situation)} onNext={nextSituation} />;
  } else if (run.phase === "outro") {
    choices = situation.steps.map((step, i) => (
      <ChoiceCard key={step.label} image={storyImages.step(situation.id, i)} label={step.label} state="done" small />
    ));
  } else if (run.phase === "steps") {
    const playing = run.busy && !run.trying;
    const index = playing ? Math.max(0, run.stepsDone - 1) : run.stepsDone;
    const step = situation.steps[index];
    const stepState: CardState = playing ? "playing" : run.trying ? "rest" : "choose";
    const list = [
      <ChoiceCard
        key={step.label}
        image={storyImages.step(situation.id, index)}
        label={step.label}
        state={stepState}
        onChoose={() => doStep(index)}
      />,
    ];
    if (choose && index === 0) {
      const insteadState: CardState = run.tried ? "wrong" : playing ? "rest" : "choose";
      list.splice(
        run.insteadFirst ? 0 : 1,
        0,
        <ChoiceCard
          key="instead"
          image={storyImages.instead(situation.id)}
          label={situation.instead.label}
          state={insteadState}
          onChoose={tryInstead}
        />,
      );
    }
    choices = list;
  }

  const picture = pictureName(run);

  return (
    <div className="story-play kita-play" onPointerDown={() => run.phase === "done" && nextSituation()}>
      <header className="story-top">
        <StepDots total={situation.steps.length} done={Math.min(run.stepsDone, situation.steps.length)} current={run.phase === "steps"} />
      </header>
      <main className="story-middle">
        <StoryPicture key={`${run.key}-${picture}`} name={picture}>
          {run.trying && <Mark good={false} className="fg-picture-mark" />}
        </StoryPicture>
      </main>
      <footer className="story-choices">{choices}</footer>
    </div>
  );
}
