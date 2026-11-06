import { type PointerEvent, useCallback, useEffect, useState } from "react";
import { useInnerBack } from "@/components/GameShell";
import { useT } from "@/lib/language";
import { FACE_LINE } from "./copy";
import { MOODS, type Mood } from "./mood";
import { BigFace } from "./moodArt";
import { MoodGroups, useAnyKey, usePickKeys } from "./moodGroups";
import type { FeelingsSettings } from "./settings";
import { useVoice } from "./shared";

/**
 * Gefühle nachmachen (C-35, a game of its own since November 2026, user feedback): the little bear's head with each
 * feeling's face, the pleasant ones apart from the unpleasant ones. A tap shows that face big – „Kannst du auch so
 * gucken?“ – for the child to copy in a mirror or for the grown-up; a tap on it asks again, and the corner goes back to
 * all the faces. Drawn, so every face is there at once and the same each time.
 */
export function CopyPlay({ settings }: { settings: FeelingsSettings }) {
  const [mood, setMood] = useState<Mood>();
  const { say, preload } = useVoice(settings);
  const t = useT();

  useEffect(() => {
    preload([t(FACE_LINE)]);
  }, []);

  useInnerBack(mood ? () => setMood(undefined) : undefined);

  const ask = useCallback(() => say(t(FACE_LINE)), [say, t]);
  const pick = useCallback(
    (picked: Mood) => {
      setMood(picked);
      ask();
    },
    [ask],
  );
  usePickKeys(!mood, MOODS, pick);
  useAnyKey(!!mood, ask);

  const card = (m: Mood) => (
    <div key={m.id} className="fg-choice">
      <button
        type="button"
        className="fg-card fg-card-choose mood-face-card"
        data-tap
        aria-label={t(m.caption)}
        onPointerDown={(e: PointerEvent) => {
          e.stopPropagation();
          pick(m);
        }}
      >
        <BigFace face={m.face} />
      </button>
      <span className="fg-caption" aria-hidden>
        {t(m.caption)}
      </span>
    </div>
  );

  return (
    <main className="mood-play">
      {mood ? (
        <div className={`mood-big ${mood.pleasant ? "pleasant" : "unpleasant"}`}>
          <button
            type="button"
            className="mood-big-picture"
            data-tap
            aria-label={t(FACE_LINE)}
            onPointerDown={(e: PointerEvent) => {
              e.stopPropagation();
              ask();
            }}
          >
            <BigFace face={mood.face} />
          </button>
          <span className="fg-caption mood-big-caption">{t(mood.caption)}</span>
        </div>
      ) : (
        <MoodGroups card={card} />
      )}
    </main>
  );
}
