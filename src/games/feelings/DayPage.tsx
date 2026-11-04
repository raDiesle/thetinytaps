import { type ReactNode, useEffect } from "react";
import { useT } from "@/lib/language";
import { preloadImages } from "./images";
import type { FeelingsSettings } from "./settings";
import { Frames, StepDots, useVoice } from "./shared";

/**
 * A page of a day's story between two scenes (`days.ts`): only told, never chosen in (user idea, November 2026). So it
 * looks unlike a scene on purpose – a page of a picture book: the picture printed on the paper without the photo's
 * white mat, the text beside it (below it, upright) in the book's letters, no question and no cards. One tap anywhere
 * (or any key) turns to the scene; the last page of a day, the house at night, holds „Nochmal“ and „Weiter“ instead
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
  corner,
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
  /** The loudspeaker that switches the voice, in the bottom right corner as in the scenes. */
  corner?: ReactNode;
}) {
  const t = useT();
  const { say, preload } = useVoice(settings);

  useEffect(() => {
    preloadImages([image]);
    preload([text]);
    say(text);
  }, []);

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
        <StepDots total={progress.total} done={progress.done} current={false} />
      </header>
      {/* The whole page turns to the scene: under the picture and the text, which let the tap through. */}
      {onNext && (
        <button
          type="button"
          className="fg-day-tap"
          data-tap="goal"
          aria-label={t({ de: "Weiter", ru: "Дальше", en: "Next", zh: "下一个", hi: "आगे", es: "Siguiente", ar: "التالي" })}
          onPointerDown={(e) => {
            e.stopPropagation();
            onNext();
          }}
        />
      )}
      <div className="fg-day-picture-room">
        <div className="fg-day-picture">
          <Frames name={image} moving={false} />
        </div>
      </div>
      <div className="fg-day-words">
        <p className="fg-day-text">{text}</p>
        {onNext && (
          <svg className="fg-next-sign fg-day-next" viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r="44" />
            <path d="M40 30 L72 50 L40 70 Z" />
          </svg>
        )}
        {ending}
      </div>
      {corner && <div className="story-corner">{corner}</div>}
    </div>
  );
}
