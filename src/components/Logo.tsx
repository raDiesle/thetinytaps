import type { CSSProperties, HTMLAttributes } from "react";
import { SITE_NAME } from "@/content/seo";
import { BRIGHT_COLORS } from "./Bursts";

/**
 * The app's name, "Books for Both", with its mascots, the fox and the bear, peeking over an open book in front of it:
 * in bouncy letters, each in its own colour, and in the book look printed like a book's title (book.css).
 * `secretProps` go onto the two (the home page uses them as the hidden way to the management page: hold them).
 */
export function Logo({ secretProps }: { secretProps?: HTMLAttributes<HTMLSpanElement> }) {
  let i = 0;
  return (
    <h1 className="logo" aria-label={SITE_NAME}>
      <span {...secretProps} className="logo-mascots secret-hold" aria-hidden>
        <ReadingFoxAndBear />
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

/** Tapsi the fox and the bear, heads and paws over the top of an open book they read together, as a printed title's vignette; box 150 × 92. */
function ReadingFoxAndBear() {
  return (
    <svg viewBox="0 0 150 92">
      <g stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <g transform="translate(-8 0)">
          <path d="M26 40 L22 8 L44 26 Z" fill="#e8782f" />
          <path d="M74 40 L78 8 L56 26 Z" fill="#e8782f" />
          <path d="M28 31 L26 16 L37 25 Z" fill="var(--ink)" stroke="none" />
          <path d="M72 31 L74 16 L63 25 Z" fill="var(--ink)" stroke="none" />
          <path d="M20 46 C20 26 36 20 50 20 C64 20 80 26 80 46 C80 58 66 68 50 68 C34 68 20 58 20 46 Z" fill="#e8782f" />
          <path d="M24 50 C32 52 40 56 50 64 C60 56 68 52 76 50 C72 60 62 68 50 68 C38 68 28 60 24 50 Z" fill="#fff" />
          <circle cx="38" cy="42" r="3.5" fill="var(--ink)" stroke="none" />
          <circle cx="62" cy="42" r="3.5" fill="var(--ink)" stroke="none" />
          <ellipse cx="50" cy="54" rx="4.5" ry="3.2" fill="var(--ink)" stroke="none" />
        </g>
        <circle cx="84" cy="27" r="9" fill="#b97a4a" />
        <circle cx="122" cy="27" r="9" fill="#b97a4a" />
        <circle cx="84" cy="27" r="4" fill="#8a5530" stroke="none" />
        <circle cx="122" cy="27" r="4" fill="#8a5530" stroke="none" />
        <circle cx="103" cy="47" r="23" fill="#c98a55" />
        <ellipse cx="103" cy="57" rx="10" ry="8" fill="#f0d2a8" />
        <circle cx="94" cy="43" r="3.3" fill="var(--ink)" stroke="none" />
        <circle cx="112" cy="43" r="3.3" fill="var(--ink)" stroke="none" />
        <ellipse cx="103" cy="53" rx="4" ry="3" fill="var(--ink)" stroke="none" />
        <path d="M75 72 C62 64 30 64 6 68 V88 C30 85 62 85 75 90 Z" fill="#fbf4e3" />
        <path d="M75 72 C88 64 120 64 144 68 V88 C120 85 88 85 75 90 Z" fill="#fbf4e3" />
        <path d="M14 75 C34 71 56 71 68 76 M14 81 C34 77 56 77 68 82 M82 76 C94 71 116 71 136 75 M82 82 C94 77 116 77 136 81" strokeWidth="2" opacity="0.45" />
        <ellipse cx="25" cy="69" rx="7" ry="4.5" fill="#e8782f" />
        <ellipse cx="59" cy="69" rx="7" ry="4.5" fill="#e8782f" />
        <ellipse cx="91" cy="69" rx="7" ry="4.5" fill="#c98a55" />
        <ellipse cx="115" cy="69" rx="7" ry="4.5" fill="#c98a55" />
      </g>
    </svg>
  );
}
