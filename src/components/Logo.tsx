import type { CSSProperties, HTMLAttributes } from "react";
import { SITE_NAME } from "@/content/seo";
import { BRIGHT_COLORS } from "./Bursts";

/**
 * The app's name, "Books for Both", with Tapsi peeking over an open book in front of it: in bouncy letters, each in
 * its own colour, and in the book look printed like a book's title (book.css). `secretProps` go onto the fox (the
 * home page uses it as the hidden way to the management page: hold it).
 */
export function Logo({ secretProps }: { secretProps?: HTMLAttributes<HTMLSpanElement> }) {
  let i = 0;
  return (
    <h1 className="logo" aria-label={SITE_NAME}>
      <span {...secretProps} className="logo-fox secret-hold" aria-hidden>
        <ReadingFox />
      </span>
      {SITE_NAME.split(" ").map((word) => (
        <span key={word} className={`logo-word logo-${word.toLowerCase()}`} aria-hidden>
          {Array.from(word, (char) => {
            const n = i++;
            return (
              <span key={n} className="logo-letter" style={{ "--i": n, "--c": BRIGHT_COLORS[n % BRIGHT_COLORS.length] } as CSSProperties}>
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

/** Tapsi's head and paws over the top of an open book, as a printed title's vignette; box 100 × 92. */
function ReadingFox() {
  return (
    <svg viewBox="0 0 100 92">
      <g stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <path d="M26 40 L22 8 L44 26 Z" fill="#e8782f" />
        <path d="M74 40 L78 8 L56 26 Z" fill="#e8782f" />
        <path d="M28 31 L26 16 L37 25 Z" fill="var(--ink)" stroke="none" />
        <path d="M72 31 L74 16 L63 25 Z" fill="var(--ink)" stroke="none" />
        <path d="M20 46 C20 26 36 20 50 20 C64 20 80 26 80 46 C80 58 66 68 50 68 C34 68 20 58 20 46 Z" fill="#e8782f" />
        <path d="M24 50 C32 52 40 56 50 64 C60 56 68 52 76 50 C72 60 62 68 50 68 C38 68 28 60 24 50 Z" fill="#fff" />
        <circle cx="38" cy="42" r="3.5" fill="var(--ink)" stroke="none" />
        <circle cx="62" cy="42" r="3.5" fill="var(--ink)" stroke="none" />
        <ellipse cx="50" cy="54" rx="4.5" ry="3.2" fill="var(--ink)" stroke="none" />
        <path d="M50 72 C40 64 22 64 8 68 V88 C22 85 40 85 50 90 Z" fill="#fbf4e3" />
        <path d="M50 72 C60 64 78 64 92 68 V88 C78 85 60 85 50 90 Z" fill="#fbf4e3" />
        <path d="M16 75 C26 72 36 72 43 76 M16 81 C26 78 36 78 43 82 M57 76 C64 72 74 72 84 75 M57 82 C64 78 74 78 84 81" strokeWidth="2" opacity="0.45" />
        <ellipse cx="33" cy="69" rx="7" ry="4.5" fill="#e8782f" />
        <ellipse cx="67" cy="69" rx="7" ry="4.5" fill="#e8782f" />
      </g>
    </svg>
  );
}
