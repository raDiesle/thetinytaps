import { useEffect, useRef, useState, type PointerEvent, type PointerEventHandler, type ReactNode } from "react";
import { Picture } from "@/components/Picture";
import type { Countable, LetterEntry, WordEntry } from "@/content/types";
import { tapState } from "@/lib/tapTargets";
import type { LettersSettings } from "./settings";
import { TraceGlyphs } from "./TraceGlyphs";

/** Item counts per row, arranged so small numbers are easy to count at a glance. */
const ROWS: Record<number, number[]> = {
  1: [1],
  2: [2],
  3: [3],
  4: [2, 2],
  5: [3, 2],
  6: [3, 3],
  7: [4, 3],
  8: [4, 4],
  9: [3, 3, 3],
};

/**
 * Keeps its content's space in the layout but hides it until `visible`.
 * With `hint`, hidden content shows as a pulsing dashed placeholder, so
 * children can see that something more is coming.
 */
function Reveal({ visible, hint, children }: { visible: boolean; hint: boolean; children: ReactNode }) {
  const state = visible ? "shown" : hint ? "waiting" : "hidden";
  return <div className={`reveal ${state}`}>{children}</div>;
}

/** A letter with its picture in the middle and the word underneath, all shown at once. */
export function LetterCard({
  letter,
  word,
  translation,
  settings,
  onPointerDown,
  onPicturePointerDown,
}: {
  letter: LetterEntry;
  word: WordEntry;
  /** The word in the second language, shown under it. */
  translation?: string;
  settings: LettersSettings;
  onPointerDown?: PointerEventHandler;
  /** Tapping the picture, e.g. for the next word with the same letter. */
  onPicturePointerDown?: PointerEventHandler;
}) {
  const glyphs = { upper: [letter.upper], both: [letter.upper, letter.lower], lower: [letter.lower] }[settings.letterCase];

  return (
    <div className="card" onPointerDown={onPointerDown}>
      {settings.trace ? (
        <TraceGlyphs glyphs={glyphs} sounds={settings.sounds} />
      ) : settings.letterCase === "both" && settings.letterFamily ? (
        <LetterFamily letter={letter} />
      ) : (
        <div className="glyphs">
          {glyphs.map((g) => (
            <span key={g}>{g}</span>
          ))}
        </div>
      )}
      <div onPointerDown={onPicturePointerDown}>
        <Picture word={word} />
      </div>
      {settings.showWord && (
        <>
          <div className="word">
            <span className="first-letter">{word.word.slice(0, 1)}</span>
            {word.word.slice(1)}
          </div>
          {translation && <div className="translation">{translation}</div>}
        </>
      )}
    </div>
  );
}

/** How long the baby letter stays grown up after a tap. */
const GROWN_MS = 1600;

/**
 * "A a" as mother and baby: both have eyes and wiggle, holding hands.
 * Tapping the baby makes it grow into the big letter for a moment.
 */
function LetterFamily({ letter }: { letter: LetterEntry }) {
  const [grown, setGrown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const grow = (e: PointerEvent) => {
    e.stopPropagation();
    setGrown(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setGrown(false), GROWN_MS);
  };

  return (
    <div className="glyphs family">
      <span className="mama">
        {letter.upper}
        <Eyes />
      </span>
      <svg className="hands" viewBox="0 0 40 24" aria-hidden>
        <path d="M0 4 Q10 20 20 16 Q30 20 40 8" />
        <circle cx="20" cy="16" r="6" />
      </svg>
      <span className={`baby${grown ? " grown" : ""}`} data-tap onPointerDown={grow}>
        {grown ? letter.upper : letter.lower}
        <Eyes />
      </span>
    </div>
  );
}

function Eyes() {
  return (
    <span className="eyes" aria-hidden>
      <span />
      <span />
    </span>
  );
}

export function NumberCard({
  n,
  thing,
  zeroEmoji,
  stage,
  hint,
  tapped,
  trace,
  onItemPointer,
  onPointerDown,
}: {
  n: number;
  thing: Countable;
  zeroEmoji: string;
  /** Number of items shown; the digit appears once stage > n. */
  stage: number;
  hint: boolean;
  /**
   * Counting by tapping: all items are shown, and these item indices have
   * been tapped, in order. Each tapped item keeps its number.
   */
  tapped?: number[];
  /** Show the digit as dots to trace, with stars; `sounds` plays notes while tracing. */
  trace?: { sounds: boolean };
  onItemPointer?: (index: number, e: PointerEvent) => void;
  onPointerDown?: PointerEventHandler;
}) {
  return (
    <div className="card" onPointerDown={onPointerDown}>
      {n === 0 ? (
        <span className="picture" aria-hidden>
          {zeroEmoji}
        </span>
      ) : (
        <div className={`count-grid count-${n}`} aria-label={`${n} × ${thing.singular}`}>
          {ROWS[n].map((perRow, row) => {
            const first = ROWS[n].slice(0, row).reduce((sum, k) => sum + k, 0);
            return (
              <div key={row} className="count-row">
                {Array.from({ length: perRow }, (_, j) => {
                  const index = first + j;
                  if (!tapped) {
                    return (
                      <Reveal key={j} visible={index < stage} hint={hint}>
                        <span className="count-item">{thing.emoji}</span>
                      </Reveal>
                    );
                  }
                  const order = tapped.indexOf(index);
                  return (
                    <Reveal key={j} visible hint={hint}>
                      <span
                        className={`count-tap${order >= 0 ? " counted" : ""}`}
                        data-tap={tapState({ done: order >= 0 })}
                        onPointerDown={(e) => onItemPointer?.(index, e)}
                      >
                        <span className="count-item">{thing.emoji}</span>
                        {order >= 0 && <span className="count-badge">{order + 1}</span>}
                      </span>
                    </Reveal>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
      <Reveal visible={stage > n} hint={hint}>
        {trace ? (
          <TraceGlyphs glyphs={[String(n)]} sounds={trace.sounds} />
        ) : (
          <div className="glyphs">
            <span>{n}</span>
          </div>
        )}
      </Reveal>
    </div>
  );
}
