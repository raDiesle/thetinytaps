import type { CSSProperties, HTMLAttributes } from "react";
import { BRIGHT_COLORS } from "./Bursts";

/** Position of the "p" in "Taps", counted over all letters. */
const SECRET_LETTER = 9;

/**
 * "The Tiny Taps" in bouncy letters, each in its own colour.
 * `secretProps` go onto the "p" in "Taps" (the home page uses it as the hidden way to the ideas).
 */
export function Logo({ secretProps }: { secretProps?: HTMLAttributes<HTMLSpanElement> }) {
  let i = 0;
  return (
    <h1 className="logo" aria-label="The Tiny Taps">
      {["The", "Tiny", "Taps"].map((word) => (
        <span key={word} className="logo-word" aria-hidden>
          {Array.from(word, (char) => {
            const n = i++;
            const secret = n === SECRET_LETTER ? secretProps : undefined;
            return (
              <span
                key={n}
                {...secret}
                className={secret ? "logo-letter secret-hold" : "logo-letter"}
                style={{ "--i": n, color: BRIGHT_COLORS[n % BRIGHT_COLORS.length] } as CSSProperties}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
