"use client";

import type { PointerEventHandler, ReactNode } from "react";
import type { Countable, LetterEntry, WordEntry } from "@/content/types";
import { asset } from "@/lib/asset";
import type { LettersSettings } from "./settings";

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

export type LetterPart = "letter" | "word" | "picture";

/** The parts of a letter card, in the order they are revealed. */
export function letterParts(showWord: boolean): LetterPart[] {
  return showWord ? ["letter", "word", "picture"] : ["letter", "picture"];
}

/**
 * Keeps its content's space in the layout but hides it until `visible`.
 * With `hint`, hidden content shows as a pulsing dashed placeholder, so
 * children can see that something more is coming.
 */
function Reveal({ visible, hint, children }: { visible: boolean; hint: boolean; children: ReactNode }) {
  const state = visible ? "shown" : hint ? "waiting" : "hidden";
  return <div className={`reveal ${state}`}>{children}</div>;
}

function Picture({ word }: { word: WordEntry }) {
  if (word.image) {
    return <img className="picture picture-image" src={asset(word.image)} alt={word.word} />;
  }
  return (
    <span className="picture" role="img" aria-label={word.word}>
      {word.emoji}
    </span>
  );
}

export function LetterCard({
  letter,
  word,
  stage,
  settings,
  onPointerDown,
}: {
  letter: LetterEntry;
  word: WordEntry;
  stage: number;
  settings: LettersSettings;
  onPointerDown?: PointerEventHandler;
}) {
  const glyphs = { upper: [letter.upper], both: [letter.upper, letter.lower], lower: [letter.lower] }[
    settings.letterCase
  ];
  const parts = letterParts(settings.showWord);
  const visible = (part: LetterPart) => parts.indexOf(part) <= stage;

  return (
    <div className="card" onPointerDown={onPointerDown}>
      <div className="glyphs">
        {glyphs.map((g) => (
          <span key={g}>{g}</span>
        ))}
      </div>
      {settings.showWord && (
        <Reveal visible={visible("word")} hint={settings.stepByStep}>
          <div className="word">
            <span className="first-letter">{word.word.slice(0, 1)}</span>
            {word.word.slice(1)}
          </div>
        </Reveal>
      )}
      <Reveal visible={visible("picture")} hint={settings.stepByStep}>
        <Picture word={word} />
      </Reveal>
    </div>
  );
}

export function NumberCard({
  n,
  thing,
  zeroEmoji,
  stage,
  hint,
  onPointerDown,
}: {
  n: number;
  thing: Countable;
  zeroEmoji: string;
  /** Number of items shown; the digit appears once stage > n. */
  stage: number;
  hint: boolean;
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
                {Array.from({ length: perRow }, (_, j) => (
                  <Reveal key={j} visible={first + j < stage} hint={hint}>
                    <span className="count-item">{thing.emoji}</span>
                  </Reveal>
                ))}
              </div>
            );
          })}
        </div>
      )}
      <Reveal visible={stage > n} hint={hint}>
        <div className="glyphs">
          <span>{n}</span>
        </div>
      </Reveal>
    </div>
  );
}
