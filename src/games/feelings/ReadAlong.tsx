import { type ReactNode, useEffect, useRef } from "react";
import { useT } from "@/lib/language";
import { type ReadAlongPart, type ReadPart, readAlong, type Round } from "./rounds";
import { Mark } from "./shared";
import { tapProps } from "./VoiceSwitch";

/**
 * „Alltagssituationen“ only (user wish, November 2026): in the screen's bottom right corner, beside the loudspeaker
 * (`VoiceSwitch`, passed as `children`), a paper note with an open book shows grown-ups everything the voice says in
 * this scene – the scene and its question, the not-so-good idea, the good one, the happy end – so they can read it out.
 * One tap opens it and one tap closes it (`tapProps`; user feedback, November 2026: held, it was too slow to reach). The sheet opens
 * above the notes, in the corner where it covers least of the pictures, and stays open from scene to scene until
 * closed. While the voice tells the scene the part told now is marked; with the voice off the grown-up reads everything,
 * so all of it shows alike, nothing marked (`voice`).
 */
export function ReadAlong({
  round,
  part,
  open,
  onToggle,
  voice,
  hidden,
  children,
}: {
  round: Round;
  part: ReadPart;
  open: boolean;
  onToggle: () => void;
  /** Whether the voice tells the scene: then the part told now is marked on the sheet. */
  voice: boolean;
  /** Leaves the sheet out for now (the pass's end, where „Weiter“ stands in its room), without closing it for good. */
  hidden?: boolean;
  /** The loudspeaker, standing in the corner beside the book. */
  children?: ReactNode;
}) {
  const t = useT();
  const label = open ? t({ de: "Text ausblenden" }) : t({ de: "Text zum Vorlesen zeigen" });

  return (
    <>
      {open && !hidden && <Sheet parts={readAlong(round)} part={voice ? part : undefined} />}
      <div className="story-corner">
        <button type="button" className="story-text" aria-pressed={open} aria-label={label} title={label} data-tap-keep {...tapProps(onToggle)}>
          <svg viewBox="0 0 64 48" aria-hidden>
            {/* An open book: two pages with lines of text, bent down to the spine. */}
            <path className="story-text-page" d="M32 10 Q20 3 4 6 V42 Q20 39 32 46 Z" />
            <path className="story-text-page" d="M32 10 Q44 3 60 6 V42 Q44 39 32 46 Z" />
            <path className="story-text-lines" d="M10 14 Q18 12 26 15 M10 21 Q18 19 26 22 M10 28 Q18 26 26 29 M10 35 Q16 33.5 22 35.5" />
            <path className="story-text-lines" d="M38 15 Q46 12 54 14 M38 22 Q46 19 54 21 M38 29 Q46 26 54 28 M38 36 Q44 33.5 50 34" />
          </svg>
        </button>
        {children}
      </div>
    </>
  );
}

/**
 * The whole text of the round. With `part` (the voice telling it) the part being told is marked like a line gone over
 * with a highlighter and kept in view; without it everything shows alike, to be read through.
 */
function Sheet({ parts, part }: { parts: ReadAlongPart[]; part?: ReadPart }) {
  const sheet = useRef<HTMLDivElement>(null);
  const now = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const box = sheet.current;
    const line = now.current;
    // Scrolls only the sheet, never the page round it.
    if (box && line) box.scrollTop = Math.max(0, line.offsetTop - 6);
  }, [part]);

  return (
    <div ref={sheet} className={`story-text-sheet${part ? " told" : ""}`} data-tap-keep>
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
