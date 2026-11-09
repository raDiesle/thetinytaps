import { type ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DevTag, letterCode } from "@/components/DevTag";
import { useT } from "@/lib/language";
import { afterPageMotion } from "@/lib/pageMotion";
import { preloadImages } from "./images";
import { ReadAlong } from "./ReadAlong";
import type { ReadAlongCorner } from "./PassPlay";
import { STORIES } from "./stories";
import { beatText, openingLines, type ReadPart, readAlong as wholeText, roundImages, roundLines, type Round } from "./rounds";
import type { FeelingsSettings } from "./settings";
import {
  CHEER_MS,
  ChoiceCard,
  GoOn,
  OOPS_MS,
  StepBack,
  StepDots,
  StoryPicture,
  cheer,
  oops,
  useLinesReady,
  useTimers,
  useVoice,
  type PictureLook,
} from "./shared";
import { beatMs, type Beat } from "./story";

/**
 * "intro": the scene is shown and told until the child taps the screen (▶). "choose": the scene is minimised top left,
 * its text under it, and the two choices A and B side by side with arrows from the scene to them. "trying": the
 * not-so-good idea is shown big with what it leads to. "good": the good idea is done. "end": the story's happy end.
 * "done": the round is over and `ending` shows.
 */
type Phase = "intro" | "choose" | "trying" | "good" | "end" | "done";

/**
 * One round: the scene, one question, two choices – the not-so-good idea (A, left) and the good one (B, right). A tap on
 * a choice picks it. The not-so-good one shows what it leads to and is crossed out, then the choices come back. After
 * the good one only its picture stays, with its green tick (and the story's happy end, on its last step), and `onFinish`
 * is called: the round stays on its last picture, with ▶ in the screen's corner (`onDone`, the next scene; `GoOn`), or
 * with `ending` in its place (the end buttons of a pass).
 */
export function RoundPlay({
  round,
  settings,
  progress,
  onFinish,
  ending,
  onDone,
  onEndKey,
  onPick,
  onBack,
  readAlong,
  nextLines = [],
}: {
  round: Round;
  settings: FeelingsSettings;
  /** The dots at the top: how many scenes the pass has and how many are done before this one. */
  progress: { total: number; done: number };
  onFinish: () => void;
  /** Shown in the choices' room once the round is over, if it is the last of its pass. */
  ending?: ReactNode;
  /** Once the round is over, a tap on the screen (▶) goes on with it: the next scene of the pass. */
  onDone?: () => void;
  /** A key pressed once the round is over: every key does something. */
  onEndKey?: () => void;
  /** A tap on a dot at the top: that scene again, one before this or this one from its start. */
  onPick?: (index: number) => void;
  /** The scene before this one: a corner bottom left goes back to it (`StepBack`); left out for the first scene. */
  onBack?: () => void;
  /**
   * „Alltagssituationen“: the note in the bottom right corner that shows grown-ups the round's whole text to read out,
   * whether it is open, and the loudspeaker standing beside it (`VoiceSwitch`).
   */
  readAlong?: ReadAlongCorner;
  /** What the page or scene after this one opens with: loaded while this one plays, so it starts at once. */
  nextLines?: string[];
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [tried, setTried] = useState(false);
  const [arrows, setArrows] = useState<string[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const { later } = useTimers();
  const { say, sound, voiced } = useVoice(settings);
  // The scene starts telling once its opening lines are there; the rest of it and the next one's opening load meanwhile.
  const ready = useLinesReady(settings, openingLines(round), [...roundLines(round), ...nextLines]);

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
  }, []);

  useEffect(() => {
    if (!ready) return;
    // The scene is told, then its question; the choices come only with a tap on the picture, never after a while. Only
    // once the page it opens on lies still (pageMotion.ts) and its opening lines are loaded (`useLinesReady`).
    return afterPageMotion(() => playBeats(round.start.beats, () => say(round.question, true)));
  }, [ready]);

  const goOn = () => setPhase((now) => (now === "intro" ? "choose" : now));
  // A tap on the minimised scene steps back: the scene alone, big in the middle, as before the choices.
  const minimised = () => setPhase("intro");

  const finish = useCallback(() => {
    onFinish();
    setPhase("done");
  }, [onFinish]);

  // The good idea: a laugh and „Juhu!“, then its picture stays with the green tick; on the story's last step its happy end follows.
  const chooseGood = useCallback(() => {
    setPhase("good");
    cheer(say, sound);
    later(() => {
      playBeats(round.good.beats, () => {
        const { end } = round;
        if (!end) return finish();
        setPhase("end");
        playBeats(end.beats, finish);
      });
    }, CHEER_MS);
  }, [round, say, sound, later, playBeats, finish]);

  // The not-so-good idea: its picture with a still red cross and what it leads to, heard, while the answer says why.
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

  // While the choices stand, two arrows run from the minimised scene to A and to B (drawn where they stand, so they
  // follow the room the screen gives them).
  const choosing = phase === "choose";
  useLayoutEffect(() => {
    if (!choosing) return setArrows([]);
    const measure = () => {
      const root = rootRef.current;
      const pic = root?.querySelector(".fg-frame")?.getBoundingClientRect();
      const cards = root ? [...root.querySelectorAll(".fg-choice")].map((el) => el.getBoundingClientRect()) : [];
      if (!root || !pic || cards.length < 2) return setArrows([]);
      const at = root.getBoundingClientRect();
      const x0 = pic.left - at.left + pic.width / 2;
      const y0 = pic.bottom - at.top + 4;
      setArrows(
        cards.map((card) => {
          const x1 = card.left - at.left + card.width / 2;
          const y1 = card.top - at.top - 8;
          const mid = (y0 + y1) / 2;
          return `M${x0} ${y0} C${x0} ${mid}, ${x1} ${mid}, ${x1} ${y1}`;
        }),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [choosing, tried, round.storyId, round.step]);

  // The part of the text being told now, marked on the sheet for grown-ups who read it out.
  const doneHere = phase === "good" || phase === "end" || phase === "done";
  const part: ReadPart =
    phase === "trying"
      ? "instead"
      : phase === "good" || ((phase === "end" || phase === "done") && !round.end)
        ? "good"
        : phase === "end" || phase === "done"
          ? "end"
          : "start";
  // The big picture: the scene while it is told and chosen, the not-so-good idea while it is tried, the good one once
  // chosen, at last the happy end.
  const shown = { start: round.start, instead: round.instead, good: round.good, end: round.end ?? round.good }[part];
  // Its whole text, never cut short (user feedback, November 2026): everything the voice says with it, as on the sheet.
  // It stands under the picture, never on it.
  const caption = wholeText(round).find((p) => p.id === part)?.text || shown.caption;
  // The tick stays on the good picture and the cross on the not-so-good one: nothing comes and goes after a choice.
  const look: PictureLook = phase === "trying" ? "bad" : doneHere ? "good" : "story";
  // The sheet with the text is open: the texts leave the pictures and stand on it, in the bottom right corner.
  const sheet = !!readAlong?.open && !(phase === "done" && ending !== undefined);
  // What a tap on the screen does now: the choices after the scene is told, the next scene after the last picture.
  const next = phase === "intro" ? goOn : phase === "done" ? onDone : undefined;
  const insteadState = tried ? "wrong" : "choose";

  return (
    <div ref={rootRef} className="story-play" data-stage={choosing ? "choose" : "show"} data-back={onBack ? "" : undefined} data-sheet={sheet ? "" : undefined}>
      <DevTag
        code={`${letterCode(
          Math.max(
            0,
            STORIES.findIndex((s) => s.id === round.storyId),
          ),
        )}${round.step + 1}`}
        id={`${round.storyId} · Schritt ${round.step + 1}`}
      />
      <header className="story-top">
        <StepDots total={progress.total} done={progress.done + (doneHere ? 1 : 0)} current={!doneHere} upTo={progress.done} onPick={onPick} />
      </header>
      <main className="story-middle">
        {/* Only one thing moves at a time: the scene while it is shown, the choices while the child chooses. */}
        <StoryPicture key={shown.image} name={shown.image} caption={caption} look={look} still={choosing} onTap={choosing ? minimised : undefined} />
      </main>
      {arrows.length === 2 && (
        <svg className="story-arrows" aria-hidden>
          <defs>
            <marker id="fg-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path className="story-arrow-head" d="M0 0 L10 5 L0 10 z" />
            </marker>
          </defs>
          {arrows.map((d) => (
            <path key={d} className="story-arrow" d={d} markerEnd="url(#fg-arrow)" />
          ))}
        </svg>
      )}
      {/* The scene told, or the chosen idea's last picture: a tap anywhere goes on. */}
      {next && <GoOn onNext={next} label={caption} />}
      {onBack && (
        <StepBack
          onBack={onBack}
          label={t({
            de: "Vorige Szene",
            en: "Previous scene",
            zh: "上一个场景",
            hi: "पिछला दृश्य",
            es: "Escena anterior",
            ar: "المشهد السابق",
            ru: "Предыдущая сцена",
          })}
        />
      )}
      {/* A: the not-so-good idea (left), B: the good one (right). After a choice only the picture stays. */}
      <footer className={`story-choices${phase === "done" ? " ending" : ""}`}>
        {phase === "done"
          ? ending
          : choosing && (
              <>
                <ChoiceCard
                  key="instead"
                  letter="A"
                  image={round.instead.image}
                  caption={round.instead.caption}
                  state={insteadState}
                  onChoose={() => choose("instead")}
                />
                <ChoiceCard key="good" letter="B" image={round.good.image} caption={round.good.caption} state="choose" onChoose={() => choose("good")} />
              </>
            )}
      </footer>
      {readAlong && (
        <ReadAlong
          round={round}
          part={part}
          open={readAlong.open}
          onToggle={readAlong.onToggle}
          voice={settings.voice}
          hidden={phase === "done" && ending !== undefined}
        >
          {readAlong.voiceSwitch}
        </ReadAlong>
      )}
    </div>
  );
}
