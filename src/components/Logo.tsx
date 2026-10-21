import type { CSSProperties } from "react";
import { BRIGHT_COLORS } from "./Bursts";

/** "The Tiny Taps" in bouncy letters, each in its own colour. */
export function Logo() {
  let i = 0;
  return (
    <h1 className="logo" aria-label="The Tiny Taps">
      {["The", "Tiny", "Taps"].map((word) => (
        <span key={word} className="logo-word" aria-hidden>
          {Array.from(word, (char) => {
            const n = i++;
            return (
              <span key={n} className="logo-letter" style={{ "--i": n, color: BRIGHT_COLORS[n % BRIGHT_COLORS.length] } as CSSProperties}>
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
