"use client";

import type { PointerEventHandler } from "react";
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
  settings,
  onPointerDown,
}: {
  letter: LetterEntry;
  word: WordEntry;
  settings: LettersSettings;
  onPointerDown: PointerEventHandler;
}) {
  const glyphs = { upper: [letter.upper], both: [letter.upper, letter.lower], lower: [letter.lower] }[
    settings.letterCase
  ];

  return (
    <div className="card" onPointerDown={onPointerDown}>
      <div className="glyphs">
        {glyphs.map((g) => (
          <span key={g}>{g}</span>
        ))}
      </div>
      <Picture word={word} />
      {settings.showWord && (
        <div className="word">
          <span className="first-letter">{word.word.slice(0, 1)}</span>
          {word.word.slice(1)}
        </div>
      )}
    </div>
  );
}

export function NumberCard({
  n,
  thing,
  zeroEmoji,
  counted,
  onPointerDown,
}: {
  n: number;
  thing: Countable;
  zeroEmoji: string;
  counted: number;
  onPointerDown: PointerEventHandler;
}) {
  return (
    <div className="card" onPointerDown={onPointerDown}>
      <div className="glyphs">
        <span>{n}</span>
      </div>
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
                  <span key={j} className={`count-item${first + j < counted ? " visible" : ""}`}>
                    {thing.emoji}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
