import { useEffect, useState } from "react";
import { Sun } from "@/components/Worlds";
import { useT } from "@/lib/language";
import { isBookLook } from "@/lib/look";
import { playPageTurn, unlockAudio } from "@/lib/sfx";

/** Once opened, the cover stays open for the rest of the visit. */
const OPENED_KEY = "tinytaps.book.opened";

/** How long the cover takes to swing open before the contents page is left alone. */
const OPEN_MS = 1100;

function openedThisVisit() {
  try {
    return sessionStorage.getItem(OPENED_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * The book's cover over the home page, the first thing a visit sees in the book look: a cloth-bound picture book
 * lying on a table. One tap or key opens it – the cover swings over to the left with the sound of a page – and the
 * home page is its contents page.
 */
export function BookCover() {
  const t = useT();
  const [state, setState] = useState<"closed" | "opening" | "gone">(() => (isBookLook() && !openedThisVisit() ? "closed" : "gone"));

  const open = () => {
    if (state !== "closed") return;
    unlockAudio();
    playPageTurn();
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
      const timer = setTimeout(() => setState("gone"), OPEN_MS);
      return () => clearTimeout(timer);
    }
  });

  if (state === "gone") return null;
  return (
    <button type="button" className={`book-cover-screen ${state}`} onPointerDown={open} aria-label={t({ de: "Buch aufmachen" })}>
      <span className="book-closed" aria-hidden>
        {/* The first page under the cover: plain paper, seen while the cover swings away. */}
        <span className="book-first-page" />
        <span className="book-cover">
          <span className="book-cover-front">
            <span className="book-cover-label">
              <span className="book-cover-title">The Tiny Taps</span>
              <svg className="book-cover-picture" viewBox="0 0 300 170">
                <path className="book-cover-hill-back" d="M0 120 C60 80 120 80 170 110 C220 140 260 90 300 100 V170 H0 Z" />
                <path className="book-cover-hill" d="M0 145 C70 115 140 125 190 140 C240 155 270 130 300 135 V170 H0 Z" />
                <svg x="105" y="8" width="90" height="90" viewBox="0 0 200 200">
                  <Sun />
                </svg>
              </svg>
            </span>
            <span className="book-cover-hand">👆</span>
          </span>
          <span className="book-cover-back" />
        </span>
        <span className="book-ribbon" />
      </span>
    </button>
  );
}
