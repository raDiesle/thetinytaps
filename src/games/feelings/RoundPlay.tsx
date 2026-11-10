import { type ReactNode, useCallback, useEffect, useState } from "react";
import { DevTag, letterCode } from "@/components/DevTag";
import { useT } from "@/lib/language";
import { afterPageMotion } from "@/lib/pageMotion";
import { screenChanged, screenTap } from "@/lib/tapGuard";
import { preloadImages } from "./images";
import { STORIES } from "./stories";
import { beatText, openingLines, type ReadPart, roundText, roundImages, roundLines, type Round } from "./rounds";
import type { FeelingsSettings } from "./settings";
import {
  CHEER_MS,
  ChoiceCard,
  GoOn,
  OOPS_MS,
  StepBack,
  StepDots,
  StoryPicture,
  StoryWords,
  cheer,
  oops,
  useLinesReady,
  useTimers,
  useVoice,
  type PictureLook,
} from "./shared";
import { beatMs, type Beat } from "./story";

/**
 * "intro": the scene is shown and told until the child taps the screen (▶). "choose": the two choices A and B side by
 * side, as big as the screen allows, the scene small above them (left out on a phone) and its text under them.
 * "trying": the not-so-good idea is shown big with what it leads to. "good": the good idea is done. "end": the story's
 * happy end. "done": the round is over and `ending` shows.
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
  voiceSwitch,
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
  /**
   * The page or scene before this one: ◀ bottom left goes back to it (`StepBack`); left out where there is none. While
   * the child chooses, ◀ always goes back to the scene told.
   */
  onBack?: () => void;
  /** „Alltagssituationen“: the loudspeaker in the bottom right corner, left of ▶, that switches the voice (`VoiceSwitch`). */
  voiceSwitch?: ReactNode;
  /** What the page or scene after this one opens with: loaded while this one plays, so it starts at once. */
  nextLines?: string[];
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [tried, setTried] = useState(false);
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
  // A tap on the small scene or on ◀ while choosing steps back: the scene alone, big in the middle, as before the choices.
  const minimised = () => setPhase("intro");

  // Every new picture, or the cards coming: a tap right after it (the second of a double tap) does nothing (`screenTap`).
  useEffect(() => screenChanged(), [phase]);

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

  // The left arrow picks the not-so-good idea on the left; every other key the good one, so mashing keys still tells the
  // story – one step at a time, like taps (`screenTap`).
  const pressKey = (key: string) => {
    if (!screenTap()) return;
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

  const choosing = phase === "choose";
  // The part of the round's text that goes with the big picture now.
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
  // Its whole text, never cut short (user feedback, November 2026): everything the voice says with it. It stands under
  // the picture, never on it; while the child chooses, under the cards.
  const caption = roundText(round).find((p) => p.id === part)?.text || shown.caption;
  // The tick stays on the good picture and the cross on the not-so-good one: nothing comes and goes after a choice.
  const look: PictureLook = phase === "trying" ? "bad" : doneHere ? "good" : "story";
  // What a tap on the screen does now: the choices after the scene is told, the next scene after the last picture.
  const next = phase === "intro" ? goOn : phase === "done" ? onDone : undefined;
  const insteadState = tried ? "wrong" : "choose";
  // ◀ bottom left: from the choices back to the scene told, otherwise to the page or scene before.
  const back = choosing ? minimised : onBack;

  return (
    <div className="story-play" data-stage={choosing ? "choose" : "show"} data-end={phase === "done" && ending ? "" : undefined}>
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
      {/* The scene big, or small above the choices. Only one thing moves at a time: the scene while it is shown, the
          choices while the child chooses. */}
      <div className="story-scene">
        <StoryPicture key={shown.image} name={shown.image} look={look} still={choosing} onTap={choosing ? minimised : undefined} />
      </div>
      {/* A: the not-so-good idea (left), B: the good one (right), as big as the screen allows. After a choice only the picture stays. */}
      {choosing && (
        <div className="story-choices">
          <ChoiceCard
            key="instead"
            letter="A"
            image={round.instead.image}
            caption={round.instead.caption}
            state={insteadState}
            onChoose={() => choose("instead")}
          />
          <ChoiceCard key="good" letter="B" image={round.good.image} caption={round.good.caption} state="choose" onChoose={() => choose("good")} />
        </div>
      )}
      <StoryWords text={caption} />
      {phase === "done" && ending && <div className="story-ending">{ending}</div>}
      {/* The scene told, or the chosen idea's last picture: a tap anywhere goes on. */}
      {next && <GoOn onNext={next} label={caption} />}
      {back && (
        <StepBack
          onBack={back}
          label={
            choosing
              ? t({ de: "Zurück", ru: "Назад", en: "Back", zh: "返回", hi: "वापस", es: "Atrás", ar: "رجوع" })
              : t({
                  de: "Vorige Szene",
                  en: "Previous scene",
                  zh: "上一个场景",
                  hi: "पिछला दृश्य",
                  es: "Escena anterior",
                  ar: "المشهد السابق",
                  ru: "Предыдущая сцена",
                })
          }
        />
      )}
      {voiceSwitch && <div className="story-corner">{voiceSwitch}</div>}
    </div>
  );
}
