import { type PointerEvent, useEffect, useRef } from "react";
import { useHold } from "@/lib/hold";
import { useT } from "@/lib/language";
import { type ReadAlongPart, type ReadPart, readAlong, type Round } from "./rounds";
import { Mark } from "./shared";
import { HOLD_MS, HOLD_WORD } from "./VoiceSwitch";

/**
 * „Alltagssituationen“ only (user wish, November 2026): a paper note with an open book in the picture's bottom left
 * corner shows grown-ups everything the voice says in this scene – the scene and its question, the not-so-good idea, the
 * good one, the happy end – so they can read it out, above all with the voice switched off (`VoiceSwitch`). Held to
 * open (a child's tap changes nothing), one tap closes it. The sheet stays open from scene to scene until closed.
 */
export function ReadAlong({ round, part, open, onToggle }: { round: Round; part: ReadPart; open: boolean; onToggle: () => void }) {
  const t = useT();
  const { holding, props } = useHold(onToggle, HOLD_MS);
  const label = open ? t({ de: "Text ausblenden" }) : t({ de: "Text zum Vorlesen zeigen" });
  const hold = t(HOLD_WORD);
  // Closing is a plain tap: hiding the text again should be quick, and it only gives the picture back to the child.
  const press = open
    ? {
        onPointerDown: (e: PointerEvent) => {
          e.stopPropagation();
          onToggle();
        },
        onKeyDown: (e: { key: string; preventDefault: () => void }) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          onToggle();
        },
      }
    : props;

  return (
    <>
      {open && <Sheet parts={readAlong(round)} part={part} />}
      <button
        type="button"
        className={`story-text${holding ? " holding" : ""}`}
        aria-pressed={open}
        aria-label={open ? label : `${label} (${hold})`}
        title={label}
        data-tap-keep
        {...press}
      >
        <svg viewBox="0 0 64 48" aria-hidden>
          {/* An open book: two pages with lines of text, bent down to the spine. */}
          <path className="story-text-page" d="M32 10 Q20 3 4 6 V42 Q20 39 32 46 Z" />
          <path className="story-text-page" d="M32 10 Q44 3 60 6 V42 Q44 39 32 46 Z" />
          <path className="story-text-lines" d="M10 14 Q18 12 26 15 M10 21 Q18 19 26 22 M10 28 Q18 26 26 29 M10 35 Q16 33.5 22 35.5" />
          <path className="story-text-lines" d="M38 15 Q46 12 54 14 M38 22 Q46 19 54 21 M38 29 Q46 26 54 28 M38 36 Q44 33.5 50 34" />
        </svg>
        {!open && <small>{hold}</small>}
      </button>
    </>
  );
}

/** The whole text of the round, the part being told now marked like a line gone over with a highlighter and kept in view. */
function Sheet({ parts, part }: { parts: ReadAlongPart[]; part: ReadPart }) {
  const sheet = useRef<HTMLDivElement>(null);
  const now = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const box = sheet.current;
    const line = now.current;
    // Scrolls only the sheet, never the page round it.
    if (box && line) box.scrollTop = Math.max(0, line.offsetTop - 6);
  }, [part]);

  return (
    <div ref={sheet} className="story-text-sheet" data-tap-keep>
      {parts.map(({ id, caption, text }) => (
        <p key={id} ref={id === part ? now : undefined} className={id === part ? "now" : undefined}>
          {id === "instead" && <Mark good={false} className="story-text-mark" />}
          {id === "good" && <Mark good className="story-text-mark" />}
          {caption && <b>{caption}: </b>}
          {text}
        </p>
      ))}
    </div>
  );
}
