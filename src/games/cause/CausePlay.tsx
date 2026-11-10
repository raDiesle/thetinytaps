import { type ReactNode, useEffect, useState } from "react";
import { DevTag } from "@/components/DevTag";
import { GameEnd } from "@/components/GameEnd";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { playPlop, playTwinkle } from "@/lib/sfx";
import { screenChanged, screenTap } from "@/lib/tapGuard";
import { ChoiceCard, GoOn, StepBack, StepDots, StoryPicture, StoryWords } from "../feelings/shared";
import { framesOf, preloadImages } from "./images";
import { CAUSE_PASSES, CAUSE_QUESTION, type CauseScene, causeOnLeft, sceneCode, sceneImages } from "./scenes";

/** Where the child stopped: kept between visits, so the game goes on with the next scenes. */
interface CauseProgress {
  /** The pass played last, counted from 0 (`CAUSE_PASSES`). */
  pass: number;
  /** The scene of `pass` it goes on with, counted from 0. */
  scene: number;
}

const PROGRESS_KEY = "tinytaps.cause.v1";
const START: CauseProgress = { pass: 0, scene: 0 };

/**
 * „Was ist passiert?“: one pass of six scenes after the other, laid out like Gefühle's „Alltagssituationen“ (its
 * `.story-play` and picture components). The dots at the top are the pass's scenes; after the last come „Nochmal“ and
 * „Weiter“ (the next pass, after the last the first). The pass and scene reached are kept, so the next visit goes on.
 */
export function CausePlay() {
  const [progress, update] = useGameSettings<CauseProgress>(PROGRESS_KEY, START);
  // `run` restarts a scene played again from its dot or with „Nochmal“.
  const [now, setNow] = useState(() => {
    const pass = progress.pass % CAUSE_PASSES.length;
    return { pass, index: progress.scene < CAUSE_PASSES[pass].length ? progress.scene : 0, run: 0 };
  });
  const scenes = CAUSE_PASSES[now.pass];
  const scene = scenes[now.index];
  const last = now.index === scenes.length - 1;
  const following = (now.pass + 1) % CAUSE_PASSES.length;

  const go = (pass: number, index: number) => setNow({ pass, index, run: now.run + 1 });
  // The cause found: the scene to go on with is kept at once, even if no one taps ▶ – after the last, the next pass.
  const found = () => update(last ? { pass: following, scene: 0 } : { pass: now.pass, scene: now.index + 1 });
  const again = () => {
    update({ pass: now.pass, scene: 0 });
    go(now.pass, 0);
  };
  const onward = () => {
    update({ pass: following, scene: 0 });
    go(following, 0);
  };

  return (
    <CauseScenePlay
      key={`${now.pass}-${now.index}-${now.run}`}
      scene={scene}
      pass={now.pass}
      progress={{ total: scenes.length, done: now.index }}
      onFound={found}
      onDone={last ? undefined : () => go(now.pass, now.index + 1)}
      ending={last ? <GameEnd inline onAgain={again} next={{ onNext: onward }} /> : undefined}
      onEndKey={last ? onward : () => go(now.pass, now.index + 1)}
      onPick={(index) => go(now.pass, index)}
      onBack={now.index > 0 ? () => go(now.pass, now.index - 1) : undefined}
      nextImage={last ? undefined : sceneImages(scenes[now.index + 1].id).feeling}
    />
  );
}

/**
 * "show": the little bear's feeling, big, and „Was ist passiert?“ under it, until a tap anywhere (▶). "choose": the two
 * pictures of what may have happened, A and B, the feeling small above them. "found": the picture of what happened,
 * big with its green tick, and why it led to the feeling under it.
 */
type Phase = "show" | "choose" | "found";

/** One scene: the feeling, the choice of two causes, and the cause found. */
function CauseScenePlay({
  scene,
  pass,
  progress,
  onFound,
  onDone,
  ending,
  onEndKey,
  onPick,
  onBack,
  nextImage,
}: {
  scene: CauseScene;
  /** The pass it belongs to, for the dev server's tag. */
  pass: number;
  /** The dots at the top: how many scenes the pass has and how many are done before this one. */
  progress: { total: number; done: number };
  /** Called once the cause is found. */
  onFound: () => void;
  /** Once the cause is found, a tap on the screen (▶) goes on: the next scene. */
  onDone?: () => void;
  /** Shown in the room under the words once the cause is found, on the pass's last scene: „Nochmal“ and „Weiter“. */
  ending?: ReactNode;
  /** A key pressed once the cause is found: every key does something. */
  onEndKey: () => void;
  /** A tap on a dot at the top: that scene again, one before this or this one from its start. */
  onPick: (index: number) => void;
  /** The scene before: ◀ bottom left goes back to it; left out on a pass's first scene. */
  onBack?: () => void;
  /** The next scene's first picture, loaded while this one plays. */
  nextImage?: string;
}) {
  const t = useT();
  const [phase, setPhase] = useState<Phase>("show");
  /** The other picture was tapped: it stays crossed out. */
  const [crossed, setCrossed] = useState(false);
  const images = sceneImages(scene.id);

  useEffect(() => {
    preloadImages([images.feeling, images.cause, images.other, ...(nextImage ? [nextImage] : [])]);
  }, []);

  // Every new picture, or the cards coming: a tap right after it (the second of a double tap) does nothing (`screenTap`).
  useEffect(() => screenChanged(), [phase]);

  const pick = (card: "cause" | "other") => {
    if (phase !== "choose") return;
    if (card === "cause") {
      setPhase("found");
      playTwinkle();
      onFound();
    } else if (!crossed) {
      setCrossed(true);
      playPlop();
    }
  };

  const left: "cause" | "other" = causeOnLeft(scene) ? "cause" : "other";
  const right = left === "cause" ? "other" : "cause";

  // ←/1 the left card, →/2 the right one, every other key the cause, so mashing keys still plays the scene through –
  // one step at a time, like taps (`screenTap`).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.repeat || !screenTap()) return;
      if (phase === "show") return setPhase("choose");
      if (phase === "found") return (onDone ?? onEndKey)();
      pick(e.key === "ArrowLeft" || e.key === "1" ? left : e.key === "ArrowRight" || e.key === "2" ? right : "cause");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const choosing = phase === "choose";
  const shown = phase === "found" ? images.cause : images.feeling;
  // The whole text stands under the picture, never on it: what the bear shows and the question, then why once found.
  const caption = phase === "found" ? scene.told : `${scene.shows} ${t(CAUSE_QUESTION)}`;
  const next = phase === "show" ? () => setPhase("choose") : phase === "found" ? onDone : undefined;
  // ◀ bottom left: from the choice back to the feeling alone, otherwise to the scene before.
  const back = choosing ? () => setPhase("show") : onBack;
  const card = (which: "cause" | "other", letter: string) => (
    <ChoiceCard
      key={which}
      letter={letter}
      image={images[which]}
      sources={framesOf(images[which])}
      caption={which === "cause" ? scene.cause : scene.other}
      state={which === "other" && crossed ? "wrong" : "choose"}
      onChoose={() => pick(which)}
    />
  );

  return (
    <div className="story-play" data-stage={choosing ? "choose" : "show"} data-end={phase === "found" && ending ? "" : undefined}>
      <DevTag code={sceneCode(scene)} id={`${scene.id} · Durchgang ${pass + 1}`} />
      <header className="story-top">
        <StepDots total={progress.total} done={progress.done + (phase === "found" ? 1 : 0)} current={phase !== "found"} upTo={progress.done} onPick={onPick} />
      </header>
      <div className="story-scene">
        <StoryPicture
          key={shown}
          name={shown}
          sources={framesOf(shown)}
          look={phase === "found" ? "good" : "story"}
          still={choosing}
          onTap={choosing ? () => setPhase("show") : undefined}
        />
      </div>
      {choosing && (
        <div className="story-choices">
          {card(left, "A")}
          {card(right, "B")}
        </div>
      )}
      <StoryWords text={caption} />
      {phase === "found" && ending && <div className="story-ending">{ending}</div>}
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
    </div>
  );
}
