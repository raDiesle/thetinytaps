import { type PointerEvent, useEffect } from "react";
import { ControlIcon } from "@/components/ControlIcon";
import { type Localized, useT } from "@/lib/language";
import { noPointerClick } from "@/lib/press";
import { GO_ON, PAUSE } from "@/lib/sharedTexts";
import { useStore } from "@/lib/store";
import { paused } from "./level";

/** „Überspringen“: read out on the next level's picture in the pause. */
const SKIP: Localized = { de: "Überspringen", en: "Skip", zh: "跳过", hi: "आगे बढ़ें", es: "Saltar", ar: "تخطٍّ", ru: "Пропустить" };

/**
 * Pause at any moment of a level, and from the pause skip to the next one (user request, November 2026): a round paper
 * button in the bottom right corner stops the level on the level clock (`paused` in level.ts). Paused, a veil lies over
 * the picture with two things only, no words – children don't read: the big ▶ goes on, and the next level's picture
 * (the same as „Weiter“ at a level's end) skips to it. A tap anywhere else on the veil, or any key but Esc, goes on too,
 * so a child who paused by chance is never stuck.
 */
export function PauseVeil({ next, nextName, onSkip }: { next?: string; nextName: string; onSkip: () => void }) {
  const t = useT();
  const isPaused = useStore(paused);

  // A level left or changed while paused starts unpaused.
  useEffect(() => () => paused.set(false), []);

  // Paused, a key only goes on – caught before every level's own keys, which listen later on the way.
  useEffect(() => {
    if (!isPaused) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.repeat) return;
      e.stopPropagation();
      e.preventDefault();
      paused.set(false);
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [isPaused]);

  const stop = (e: PointerEvent) => e.stopPropagation();
  const goOn = () => paused.set(false);

  if (!isPaused)
    return (
      <button
        type="button"
        className="marble-pause-button"
        data-tap=""
        aria-label={t(PAUSE)}
        onPointerDown={(e) => {
          stop(e);
          paused.set(true);
        }}
        onClick={noPointerClick(() => paused.set(true))}
      >
        <ControlIcon kind="pause" className="marble-pause-icon" />
      </button>
    );

  return (
    <div
      className="marble-pause"
      data-tap-root
      onPointerDown={(e) => {
        stop(e);
        goOn();
      }}
    >
      <button
        type="button"
        className="marble-pause-go-on"
        data-tap=""
        aria-label={t(GO_ON)}
        onPointerDown={(e) => {
          stop(e);
          goOn();
        }}
        onClick={noPointerClick(goOn)}
      >
        <ControlIcon kind="play" className="marble-pause-play" />
      </button>
      {next && (
        <button
          type="button"
          className="marble-pause-skip"
          data-tap=""
          aria-label={`${t(SKIP)}: ${nextName}`}
          onPointerDown={(e) => {
            stop(e);
            onSkip();
          }}
          onClick={noPointerClick(onSkip)}
        >
          <img src={next} alt="" draggable={false} />
        </button>
      )}
    </div>
  );
}
