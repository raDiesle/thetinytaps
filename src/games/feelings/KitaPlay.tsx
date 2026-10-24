import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { MOODS } from "./Critter";
import { imageFor, preloadImages, storyImages } from "./images";
import { QUESTION, SITUATIONS, type Situation } from "./kita";
import { PlaceDrawing } from "./places";
import type { FeelingsSettings } from "./settings";
import { Actor, ChoiceCard, Mark, PictureScene, StepDots, useTimers, useVoice, type CardState } from "./shared";
import { applyCast, beatMs, type ActorId, type ActorState, type Beat } from "./story";

const NEXT_QUESTION = "Und jetzt?";

type Phase = "intro" | "steps" | "outro" | "done";

interface Run {
  /** Changes with every new story, so the actors start in place instead of walking in. */
  key: number;
  situation: Situation;
  actors: Partial<Record<ActorId, ActorState>>;
  stage: string;
  narration: string;
  line: Beat["line"] | null;
  phase: Phase;
  stepsDone: number;
  /** The not-so-good idea was tried already. */
  tried: boolean;
  /** The bear is shaking his head about it right now. */
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
  const first = situation.intro[0];
  return {
    key,
    situation,
    actors: applyCast({}, first.cast),
    stage: first.stage ?? "",
    narration: first.narration ?? "",
    line: first.line ?? null,
    phase: "intro",
    stepsDone: 0,
    tried: false,
    trying: false,
    insteadFirst: Math.random() < 0.5,
    busy: true,
  };
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
          setRun((r) => ({
            ...r,
            actors: applyCast(r.actors, beat.cast),
            stage: beat.stage ?? r.stage,
            narration: beat.narration ?? r.narration,
            line: beat.line ?? null,
          }));
          sound(beat.sound);
          const text = [beat.narration, beat.line?.text].filter(Boolean).join(" ");
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
      setRun((r) => ({ ...r, busy: false, narration: question }));
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
    const before = run.actors.bear;
    setRun((r) => ({
      ...r,
      tried: true,
      trying: true,
      busy: true,
      narration: answer,
      line: null,
      actors: applyCast(r.actors, { bear: { pose: "shake", mood: "sorry" } }),
    }));
    say(answer);
    sound("yuck");
    later(
      () => setRun((r) => ({ ...r, busy: false, trying: false, actors: applyCast(r.actors, { bear: before }) })),
      beatMs({ narration: answer }, settings.speech),
    );
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

  const onStagePointer = () => {
    if (run.phase === "done") nextSituation();
  };

  const { situation } = run;
  const place = situation.place;

  // Only what the child can choose from now is shown, big; at the end all good steps once more, small.
  let cards: ReactNode = null;
  if (run.phase === "outro" || run.phase === "done") {
    cards = situation.steps.map((step, i) => (
      <ChoiceCard
        key={step.label}
        picture={step.picture}
        image={imageFor(storyImages.step(situation.id, i))}
        place={place}
        label={step.label}
        state="done"
        small
      />
    ));
  } else if (run.phase === "steps") {
    const playing = run.busy && !run.trying;
    const index = playing ? Math.max(0, run.stepsDone - 1) : run.stepsDone;
    const step = situation.steps[index];
    const stepState: CardState = playing ? "playing" : run.trying ? "rest" : "choose";
    const list = [
      <ChoiceCard
        key={step.label}
        picture={step.picture}
        image={imageFor(storyImages.step(situation.id, index))}
        place={place}
        label={step.label}
        state={stepState}
        onChoose={() => doStep(index)}
      />,
    ];
    if (choose && index === 0) {
      const { instead } = situation;
      const insteadState: CardState = run.tried ? "wrong" : playing ? "rest" : "choose";
      list.splice(
        run.insteadFirst ? 0 : 1,
        0,
        <ChoiceCard
          key="instead"
          picture={instead.picture}
          image={imageFor(storyImages.instead(situation.id))}
          place={place}
          label={instead.label}
          state={insteadState}
          onChoose={tryInstead}
        />,
      );
    }
    cards = list;
  }

  // While the bear waits for the child he wonders; trying the not-so-good idea, he sees it crossed out.
  const thought = run.trying ? (
    <span className="fg-thought-picture">
      <PictureScene picture={situation.instead.picture} place={place} image={imageFor(storyImages.instead(situation.id))} />
      <Mark good={false} className="fg-thought-mark" />
    </span>
  ) : ready ? (
    <span className="fg-thought-ask">?</span>
  ) : undefined;

  const problemImage = imageFor(storyImages.problem(situation.id));

  return (
    <div className={`story-play kita-play`} onPointerDown={onStagePointer}>
      <header className="story-narration">
        {problemImage ? (
          <img key={situation.id} className="story-picture" src={problemImage} alt={situation.title} draggable={false} />
        ) : (
          <span className="story-tag">
            <span aria-hidden>{situation.emoji}</span> {situation.title}
          </span>
        )}
        <StepDots total={situation.steps.length} done={Math.min(run.stepsDone, situation.steps.length)} current={run.phase === "steps"} />
        <p key={run.narration}>{run.narration}</p>
      </header>
      <div className={`story-stage-wrap place-${situation.place}`}>
        <div key={run.key} className={`story-stage ${run.stage}`}>
          <PlaceDrawing place={situation.place} />
          {(Object.entries(run.actors) as [ActorId, ActorState][]).map(([id, state]) => (
            <Actor
              key={id}
              id={id}
              state={state}
              face={MOODS[state.mood]}
              line={run.line?.who === id ? run.line.text : undefined}
              thought={id === "bear" ? thought : undefined}
            />
          ))}
        </div>
      </div>
      <footer className="story-buttons">
        {cards}
        {run.phase === "done" && (
          <button
            type="button"
            className="story-button next again"
            onPointerDown={(e: PointerEvent) => {
              e.stopPropagation();
              nextSituation();
            }}
          >
            <span className="story-button-emoji" aria-hidden>
              ▶
            </span>
            Weiter
          </button>
        )}
      </footer>
    </div>
  );
}
