import { type ReactNode, useEffect } from "react";
import { useT } from "@/lib/language";
import { preloadImages } from "./images";
import type { FeelingsSettings } from "./settings";
import { Frames, GoOn, StepDots, useLinesReady, useVoice } from "./shared";

/**
 * A page of a day's story between two scenes (`days.ts`): only told, never chosen in (user idea, November 2026). So it
 * looks unlike a scene on purpose – a page of a picture book: the picture printed on the paper without the photo's
 * white mat, the text beside it (below it, upright) in the book's letters, no question and no cards. One tap anywhere
 * (or any key) turns to the scene, with ▶ in the screen's corner as in the scenes (`GoOn`); the grown-ups' notes are not
 * here, since they would change nothing on a page (user feedback, November 2026). The last page of a day, the house at night, holds „Nochmal“ and „Weiter“ instead
 * (`ending`). Its text is said from its recording, once there is one; until then it stays silent, like every line
 * not recorded yet.
 */
export function DayPage({
  image,
  text,
  settings,
  progress,
  onNext,
  ending,
  onEndKey,
  onPick,
  nextLines = [],
}: {
  image: string;
  text: string;
  settings: FeelingsSettings;
  /** The dots at the top: the day's scenes and how many are done. */
  progress: { total: number; done: number };
  /** Turns to the scene this page leads to. */
  onNext?: () => void;
  /** The day's end: „Nochmal“ and „Weiter“ under the text. */
  ending?: ReactNode;
  /** A key pressed at the day's end: every key does something. */
  onEndKey?: () => void;
  /** A tap on a dot at the top: that scene again. */
  onPick?: (index: number) => void;
  /** What the scene after this page opens with: loaded while the page is read, so the scene starts at once. */
  nextLines?: string[];
}) {
  const t = useT();
  const { say } = useVoice(settings);
  // Its text is said once its recording is there (the paw track meanwhile); then the next scene's opening loads.
  const ready = useLinesReady(settings, [text], nextLines);

  useEffect(() => {
    preloadImages([image]);
  }, []);

  useEffect(() => {
    if (ready) say(text);
  }, [ready]);

  useEffect(() => {
    const go = onNext ?? onEndKey;
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!e.repeat) go?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onNext, onEndKey]);

  return (
    <div className={`fg-day${ending ? " fg-day-end" : ""}`}>
      <header className="story-top">
        <StepDots total={progress.total} done={progress.done} current={false} upTo={Math.min(progress.done, progress.total - 1)} onPick={onPick} />
      </header>
      {/* The whole page turns to the scene, with ▶ where it is in the scenes: under the picture and the text, which let the tap through. */}
      {onNext && <GoOn onNext={onNext} label={t({ de: "Weiter", ru: "Дальше", en: "Next", zh: "下一个", hi: "आगे", es: "Siguiente", ar: "التالي" })} />}
      <div className="fg-day-picture-room">
        <div className="fg-day-picture">
          <Frames name={image} moving={false} />
        </div>
      </div>
      <div className="fg-day-words">
        <p className="fg-day-text">{text}</p>
        {ending}
      </div>
    </div>
  );
}
