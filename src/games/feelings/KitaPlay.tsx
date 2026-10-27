import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { imageFor, preloadImages, storyImages } from "./images";
import type { Situation } from "./kita";
import type { FeelingsSettings } from "./settings";
import {
  CHEER_MS,
  ChoiceCard,
  EndButtons,
  FloaterLayer,
  OOPS_MS,
  StepDots,
  StoryPicture,
  cheer,
  oops,
  useFloaters,
  useTimers,
  useVoice,
  type CardState,
  type PictureLook,
} from "./shared";
import { beatMs, type Beat } from "./story";

type Phase = "intro" | "steps" | "outro" | "done";

/** One of the two cards of a step: the good idea or the not-so-good one. */
type Pick = "good" | "instead";

interface Run {
  /** Changes when the story is played again, so it starts fresh. */
  key: number;
  phase: Phase;
  stepsDone: number;
  /** The not-so-good idea next to this step was tried already. */
  tried: boolean;
  /** The not-so-good idea is shown crossed out right now. */
  trying: boolean;
  /** The card tapped once, shown big; tapped again it is chosen. */
  picked: Pick | null;
  /** The good idea was just chosen: the picture is framed green while the child laughs. */
  cheering: boolean;
  /** Beats are playing; buttons wait. */
  busy: boolean;
}

function freshRun(key: number): Run {
  return { key, phase: "intro", stepsDone: 0, tried: false, trying: false, picked: null, cheering: false, busy: true };
}

/**
 * The big picture for this moment: a card tapped once, the not-so-good idea, the happy end, the step the bear is doing,
 * and otherwise – before every choice – what happened, so each step starts from the same picture.
 */
function pictureName(situation: Situation, { phase, stepsDone, trying, picked, busy }: Run): string {
  const { id, steps } = situation;
  if (picked === "good") return storyImages.step(id, stepsDone);
  if (trying || picked === "instead") return storyImages.instead(id, stepsDone);
  if (phase === "outro" || phase === "done") {
    return imageFor(storyImages.end(id)) ? storyImages.end(id) : storyImages.step(id, steps.length - 1);
  }
  return busy && stepsDone > 0 ? storyImages.step(id, stepsDone - 1) : storyImages.problem(id);
}

/** What the big picture shows, in a few words for grown-ups. */
function pictureCaption(situation: Situation, { phase, stepsDone, trying, picked, busy }: Run): string {
  if (picked === "good") return situation.steps[stepsDone].caption;
  if (trying || picked === "instead") return situation.steps[stepsDone].instead.caption;
  if (phase === "outro" || phase === "done") return situation.endCaption;
  // While the child chooses, the step's question: it tells grown-ups who acts.
  if (phase === "steps" && !busy) return situation.steps[stepsDone].question;
  return busy && stepsDone > 0 ? situation.steps[stepsDone - 1].caption : situation.caption;
}

/** Im Kindergarten: one story (its words already in the app language), step by step. `onNext` goes on to the next story. */
export function KitaPlay({ situation, settings, onNext }: { situation: Situation; settings: FeelingsSettings; onNext: () => void }) {
  const nextKey = useRef(0);
  const [run, setRun] = useState<Run>(() => freshRun(nextKey.current++));
  const { later, clearAll } = useTimers();
  const { say, sound } = useVoice(settings);
  const { floaters, float } = useFloaters();

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

  const startSituation = useCallback(() => {
    clearAll();
    preloadImages([
      storyImages.problem(situation.id),
      storyImages.end(situation.id),
      ...situation.steps.flatMap((_, i) => [storyImages.step(situation.id, i), storyImages.instead(situation.id, i)]),
    ]);
    setRun(freshRun(nextKey.current++));
    playBeats(situation.intro, () => {
      setRun((r) => ({ ...r, phase: "steps" }));
      ask(situation.steps[0].question);
    });
  }, [situation, clearAll, playBeats, ask]);

  useEffect(() => startSituation(), []);

  // The good idea is cheered first – green frame, a laugh, stars – then the bear does it.
  const doStep = useCallback(
    (i: number) => {
      const step = situation.steps[i];
      setRun((r) => ({ ...r, stepsDone: i + 1, picked: null, cheering: true, busy: true }));
      cheer(say, sound, float);
      later(() => {
        setRun((r) => ({ ...r, cheering: false }));
        playBeats(step.beats, () => {
          if (i + 1 < situation.steps.length) {
            setRun((r) => ({ ...r, tried: false }));
            ask(situation.steps[i + 1].question);
            return;
          }
          setRun((r) => ({ ...r, phase: "outro" }));
          playBeats(situation.outro, () => setRun((r) => ({ ...r, phase: "done", busy: false })));
        });
      }, CHEER_MS);
    },
    [situation, say, sound, float, later, playBeats, ask],
  );

  // The not-so-good idea stays big in a red frame that shakes, with crying or a crash, while the answer says why.
  const tryInstead = useCallback(() => {
    const { answer, sound: heard } = situation.steps[run.stepsDone].instead;
    setRun((r) => ({ ...r, tried: true, trying: true, picked: null, busy: true }));
    say(answer);
    oops(heard, sound, float);
    later(() => setRun((r) => ({ ...r, busy: false, trying: false })), Math.max(OOPS_MS, beatMs({ narration: answer }, settings.speech)));
  }, [situation, run.stepsDone, say, sound, float, later, settings.speech]);

  const ready = run.phase === "steps" && !run.busy;

  /** The first tap on a card shows it big, so the child sees what it chose; the second tap (on the card or the big picture) chooses it. */
  const pick = useCallback(
    (card: Pick) => {
      if (!ready) return;
      if (run.picked !== card) {
        setRun((r) => ({ ...r, picked: card }));
        sound("pop");
      } else if (card === "good") doStep(run.stepsDone);
      else tryInstead();
    },
    [ready, run.picked, run.stepsDone, sound, doStep, tryInstead],
  );

  // The left arrow picks the not-so-good idea on the left; every other key picks the good idea, so mashing keys still tells the story.
  const pressKey = useCallback(
    (key: string) => {
      if (run.phase === "done") return onNext();
      pick(!run.tried && key === "ArrowLeft" ? "instead" : "good");
    },
    [run.phase, run.tried, onNext, pick],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!e.repeat) pressKey(e.key);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey]);

  // Only what the child can choose from now is shown, big; while the happy end plays all good steps once more, small.
  let cards: ReactNode = null;
  if (run.phase === "done") {
    cards = <EndButtons onAgain={startSituation} onNext={onNext} />;
  } else if (run.phase === "outro") {
    cards = situation.steps.map((step, i) => (
      <ChoiceCard key={step.caption} image={storyImages.step(situation.id, i)} caption={step.caption} state="done" small />
    ));
  } else if (run.phase === "steps") {
    const playing = run.busy && !run.trying;
    const index = playing ? Math.max(0, run.stepsDone - 1) : run.stepsDone;
    const step = situation.steps[index];
    const stepState: CardState = playing ? "playing" : run.trying ? "rest" : run.picked === "good" ? "picked" : "choose";
    const insteadState: CardState = run.tried ? "wrong" : playing ? "rest" : run.picked === "instead" ? "picked" : "choose";
    const good = <ChoiceCard key="good" image={storyImages.step(situation.id, index)} caption={step.caption} state={stepState} onChoose={() => pick("good")} />;
    const instead = (
      <ChoiceCard
        key="instead"
        image={storyImages.instead(situation.id, index)}
        caption={step.instead.caption}
        state={insteadState}
        onChoose={() => pick("instead")}
      />
    );
    // The not-so-good idea always on the left, the good one on the right.
    cards = [instead, good];
  }

  const picture = pictureName(situation, run);
  const caption = pictureCaption(situation, run);
  let look: PictureLook = "story";
  if (run.picked) look = "option";
  else if (run.trying) look = "bad";
  else if (run.cheering) look = "good";
  else if (ready) look = "quiet";

  return (
    <div className="story-play kita-play" onPointerDown={() => run.phase === "done" && onNext()}>
      <header className="story-top">
        <StepDots total={situation.steps.length} done={Math.min(run.stepsDone, situation.steps.length)} current={run.phase === "steps"} />
      </header>
      <main className="story-middle">
        <StoryPicture
          key={`${run.key}-${picture}`}
          name={picture}
          caption={caption}
          look={look}
          zoom={run.picked !== null}
          onPointerDown={() => run.picked && pick(run.picked)}
        >
          <FloaterLayer floaters={floaters} />
        </StoryPicture>
      </main>
      <footer className="story-choices">{cards}</footer>
    </div>
  );
}
