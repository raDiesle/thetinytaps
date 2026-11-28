import type { CSSProperties, HTMLAttributes } from "react";
import { SITE_NAME } from "@/content/seo";
import { BRIGHT_COLORS } from "./TapFeedback";
import pictures from "./bilder/*.webp?glob";

/**
 * Papa Fox and his child (Gemini, `bilder/`), drawn sitting on Georgia's bold o, which was then cut out of the picture;
 * the outro's pin board seats them on the o of „.com“ too.
 */
export const FOX_O = pictures["logo-fuchs-o.webp"];

/**
 * The name's two lines, „Little Steps“ over „to Grow“: in one line the longer name made the sign over the shelf half as
 * wide again and took the books' room (user decision, November 2026).
 */
export const LOGO_LINES = [SITE_NAME.split(" ").slice(0, 2), SITE_NAME.split(" ").slice(2)];

/**
 * The app's name, "Little Steps to Grow", printed like a book's title (book.css), in two lines (`LOGO_LINES`). Who grows
 * is drawn into the word: on the o of „Grow“ sits Papa Fox with his child on his lap, reading it a story, and a big and a
 * small paw track run under the name up to them (the foxes were drawn on Georgia's o, the book face of the title).
 * `secretProps` go onto the o with the foxes (the home page uses them as the hidden way to the management page: hold
 * them).
 */
export function Logo({ secretProps }: { secretProps?: HTMLAttributes<HTMLSpanElement> }) {
  let i = 0;
  const last = LOGO_LINES.flat().length - 1;
  let w = -1;
  return (
    <h1 className="logo" aria-label={SITE_NAME}>
      {LOGO_LINES.map((line) => (
        <span key={line.join(" ")} className="logo-line" aria-hidden>
          {line.map((word) => {
            w++;
            const foxes = w === last ? word.indexOf("o") : -1;
            return (
              <span key={word} className={`logo-word logo-${word.toLowerCase()}`}>
                {Array.from(word, (char, c) => {
                  const n = i++;
                  const style = { "--i": n, "--c": BRIGHT_COLORS[n % BRIGHT_COLORS.length] } as CSSProperties;
                  if (c === foxes)
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
            );
          })}
        </span>
      ))}
    </h1>
  );
}
