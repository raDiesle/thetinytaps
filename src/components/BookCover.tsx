import { useEffect, useState } from "react";
import { useT } from "@/lib/language";
import { isBookLook } from "@/lib/look";
import { playPageTurn, unlockAudio } from "@/lib/sfx";
import pictures from "./bilder/*.webp?glob";

/** The cover's picture: Tapsi's family and the little bear's, reading one book together (Gemini, `bilder/`). */
const COVER = pictures["buch-cover.webp"];

/** The leather corners of the cover. */
const CORNERS = ["top-right", "bottom-right"] as const;

/** Once opened, the cover stays open for the rest of the visit. */
const OPENED_KEY = "tinytaps.book.opened";

/** How long the cover takes to swing open and the book to come close, before the contents page is left alone (`book.css`). */
const OPEN_MS = 2400;

/** How long the cover's board takes to swing over, for the sound of it landing on the table. */
const SWING_SECONDS = 1.7;

function openedThisVisit() {
  try {
    return sessionStorage.getItem(OPENED_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * The book's cover over the home page, the first thing a visit sees in the book look: a cloth-bound picture book
 * lying on a table, drawn in 3D with its boards and pages. One tap or key opens it – the cover swings over to the left
 * with the sound of a page – and the home page is its contents page. Taps while it opens do nothing more.
 */
export function BookCover() {
  const t = useT();
  const [state, setState] = useState<"closed" | "opening" | "gone">(() => (isBookLook() && !openedThisVisit() ? "closed" : "gone"));

  const open = () => {
    if (state !== "closed") return;
    unlockAudio();
    playPageTurn(SWING_SECONDS);
    setState("opening");
    try {
      sessionStorage.setItem(OPENED_KEY, "1");
    } catch {
      // Without storage the cover simply shows again on the next visit to the home page.
    }
  };

  useEffect(() => {
    if (state === "closed") {
      const onKey = (e: KeyboardEvent) => {
        e.preventDefault();
        open();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    if (state === "opening") {
      // Without motion the cover is simply gone, and must not hold the taps meant for the page under it.
      const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const timer = setTimeout(() => setState("gone"), still ? 0 : OPEN_MS);
      return () => clearTimeout(timer);
    }
  });

  if (state === "gone") return null;
  return (
    <button type="button" className={`book-cover-screen ${state}`} onPointerDown={open} aria-label={t({ de: "Buch aufmachen" })}>
      <span className="book-closed" aria-hidden>
        <span className="book-shadow" />
        <span className="book-back">
          <Edges />
        </span>
        {/* The pages between the boards; the first one under the cover is plain paper, seen as the cover swings away. */}
        <span className="book-pages">
          <span className="book-first-page" />
          <Edges />
        </span>
        <span className="book-cover">
          <span className="book-cover-front">
            <span className="book-cover-title">Books for Both</span>
            {/* The animal families of the games reading the book together: it is read by a grown-up and a child. */}
            <span className="book-cover-label">{COVER && <img src={COVER} alt="" decoding="async" fetchPriority="high" />}</span>
            {CORNERS.map((corner) => (
              <span key={corner} className={`book-corner ${corner}`} />
            ))}
            <span className="book-cover-hand">👆</span>
          </span>
          <span className="book-cover-back" />
          <Edges />
        </span>
        <span className="book-ribbon" />
      </span>
    </button>
  );
}

/** The two edges of a board or of the block of pages that face the viewer: the right side and the front. */
function Edges() {
  return (
    <>
      <span className="book-edge right" />
      <span className="book-edge bottom" />
    </>
  );
}
