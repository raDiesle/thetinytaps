import { useCallback, useEffect, useState, type ReactNode } from "react";
import { preloadImages } from "./images";
import { beatText, roundImages, roundLines, type Round } from "./rounds";
import type { FeelingsSettings } from "./settings";
import { CHEER_MS, ChoiceCard, OOPS_MS, StepDots, StoryPicture, cheer, oops, useTimers, useVoice, type CardState, type PictureLook } from "./shared";
import { beatMs, type Beat } from "./story";

/**
 * "intro": the scene is shown and told until the child taps it (▶). "choose": the two cards wait. "trying": the not-so-good idea is shown with what it leads
 * to. "good": the good idea is done. "end": the story's happy end. "done": the round is over and `ending` shows.
 */
type Phase = "intro" | "choose" | "trying" | "good" | "end" | "done";

/**
 * One round: the scene, one question, two cards – the not-so-good idea and the good one; a tap on a card chooses it.
 * The not-so-good one shows what it leads to and is crossed out, then the good one is left to choose. After the good
 * one (and the story's happy end, on its last step) `onFinish` is called; with `ending` the round then stays on its
 * last picture and shows it (the end buttons of a pass), otherwise the next round follows.
 */
export function RoundPlay({
  round,
  settings,
  progress,
  onFinish,
  ending,
  onEndKey,
}: {
  round: Round;
  settings: FeelingsSettings;
  /** The dots at the top: how many scenes the pass has and how many are done before this one. */
  progress: { total: number; done: number };
  onFinish: () => void;
  /** Shown in the cards' room once the round is over, if it is the last of its pass. */
  ending?: ReactNode;
  /** A key pressed while `ending` shows: every key does something. */
  onEndKey?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [tried, setTried] = useState(false);
  const [cheering, setCheering] = useState(false);
  const { later } = useTimers();
  const { say, sound, voiced, preload } = useVoice(settings);

  /** Plays the beats one after another, then calls `then`. */
  const playBeats = useCallback(
    (beats: Beat[], then: () => void) => {
      let delay = 0;
      beats.forEach((beat, i) => {
        const text = beatText(beat);
        later(() => {
          sound(beat.sound);
          if (text) say(text, i > 0);
        }, delay);
        delay += beatMs(beat, voiced(text));
      });
      later(then, delay);
    },
    [later, say, sound, voiced],
  );

  useEffect(() => {
    preloadImages(roundImages(round));
    preload(roundLines(round));
    // The scene is told, then its question; the cards come only with a tap on the picture, never after a while.
    playBeats(round.start.beats, () => say(round.question, true));
  }, []);

  const goOn = () => setPhase((now) => (now === "intro" ? "choose" : now));

  const finish = useCallback(() => {
    onFinish();
    if (ending) setPhase("done");
  }, [onFinish, ending]);

  // The good idea: a laugh and „Juhu!“ with a still green frame, then it is done; on the story's last step its happy end follows.
  const chooseGood = useCallback(() => {
    setPhase("good");
    setCheering(true);
    cheer(say, sound);
    later(() => {
      setCheering(false);
      playBeats(round.good.beats, () => {
        const { end } = round;
        if (!end) return finish();
        setPhase("end");
        playBeats(end.beats, finish);
      });
    }, CHEER_MS);
  }, [round, say, sound, later, playBeats, finish]);

  // The not-so-good idea: its picture with a still red frame and what it leads to, heard, while the answer says why.
  const chooseInstead = useCallback(() => {
    const { answer, sound: heard } = round.instead;
    setPhase("trying");
    setTried(true);
    say(answer);
    oops(heard, sound);
    later(() => setPhase("choose"), Math.max(OOPS_MS, beatMs({ narration: answer }, voiced(answer))));
  }, [round, say, sound, later, voiced]);

  const choose = (card: "good" | "instead") => {
    if (phase !== "choose") return;
    if (card === "good") chooseGood();
    else if (!tried) chooseInstead();
  };

  // The left arrow picks the not-so-good idea on the left; every other key the good one, so mashing keys still tells the story.
  const pressKey = (key: string) => {
    if (phase === "done") return onEndKey?.();
    if (phase === "intro") return goOn();
    choose(!tried && key === "ArrowLeft" ? "instead" : "good");
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!e.repeat) pressKey(e.key);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey]);

  // The big picture: the scene while it is told and chosen, a card's picture once chosen, at last the happy end.
  let shown: { image: string; caption: string } = round.start;
  // The scene's whole text at once: its question, which says what is the matter and who acts (user feedback, November 2026).
  let caption = round.question;
  let look: PictureLook = "story";
  if (phase === "choose") look = "quiet";
  else if (phase === "trying") [shown, caption, look] = [round.instead, round.instead.caption, "bad"];
  else if (phase === "good" || ((phase === "done" || phase === "end") && !round.end)) [shown, caption] = [round.good, round.good.caption];
  else if (phase === "end" || phase === "done") [shown, caption] = [round.end!, round.end!.caption];
  if (cheering) look = "good";

  const doneHere = phase === "good" || phase === "end" || phase === "done";
  const insteadState: CardState = tried ? "wrong" : phase === "choose" ? "choose" : "rest";
  const goodState: CardState = doneHere ? "playing" : phase === "choose" ? "choose" : "rest";

  return (
    <div className="story-play">
      <header className="story-top">
        <StepDots total={progress.total} done={progress.done + (doneHere ? 1 : 0)} current={!doneHere} />
      </header>
      <main className="story-middle">
        {/* Only one thing moves at a time: the scene while it is shown, then the cards while the child chooses. */}
        <StoryPicture
          key={shown.image}
          name={shown.image}
          caption={caption}
          look={look}
          still={phase === "choose"}
          onNext={phase === "intro" ? goOn : undefined}
        />
      </main>
      {/* The not-so-good idea always first (bottom left), the good one second (top right). */}
      <footer className={`story-choices${phase === "done" ? " ending" : ""}`}>
        {phase === "done"
          ? ending
          : phase !== "intro" && (
              <>
                <ChoiceCard key="instead" image={round.instead.image} caption={round.instead.caption} state={insteadState} onChoose={() => choose("instead")} />
                <ChoiceCard key="good" image={round.good.image} caption={round.good.caption} state={goodState} onChoose={() => choose("good")} />
              </>
            )}
      </footer>
    </div>
  );
}
