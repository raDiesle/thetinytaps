import type { CSSProperties, HTMLAttributes } from "react";
import { SITE_NAME } from "@/content/seo";
import { BRIGHT_COLORS } from "./Bursts";
import pictures from "./bilder/*.webp?glob";

/** Papa Fox and his child on the letter o (Gemini, `bilder/`), drawn on Georgia's bold o so it sits in the word. */
const FOX_O = pictures["logo-fuchs-o.webp"];

/**
 * The app's name, "Books for Both", in bouncy letters, each in its own colour, and in the book look printed like a
 * book's title (book.css). What „Both“ means is drawn into the word: its o is a picture of Papa Fox sitting on the
 * letter with his child on his lap, reading it a story, and a big and a small paw track run under the name up to them.
 * The toy look's rounded letters keep a plain o (the picture's o is Georgia's). `secretProps` go onto the o with the foxes (the home page uses them as the hidden way to the management page: hold them).
 */
export function Logo({ secretProps }: { secretProps?: HTMLAttributes<HTMLSpanElement> }) {
  let i = 0;
  const words = SITE_NAME.split(" ");
  return (
    <h1 className="logo" aria-label={SITE_NAME}>
      {words.map((word, w) => (
        <span key={word} className={`logo-word logo-${word.toLowerCase()}`} aria-hidden>
          {Array.from(word, (char, c) => {
            const n = i++;
            const style = { "--i": n, "--c": BRIGHT_COLORS[n % BRIGHT_COLORS.length] } as CSSProperties;
            if (w === words.length - 1 && c === 1 && char === "o")
              return (
                <span key={n} {...secretProps} className="logo-o secret-hold">
                  <span className="logo-letter" style={style}>
                    o
                  </span>
                  <span className="logo-o-anchor">
                    <img src={FOX_O} alt="" draggable={false} decoding="async" />
                    <span className="logo-tracks" />
                  </span>
                </span>
              );
            return (
              <span key={n} className="logo-letter" style={style}>
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
