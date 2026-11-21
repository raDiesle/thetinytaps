import { useState } from "react";
import { Link } from "react-router";
import { CATEGORIES } from "@/content/games";
import { EFFORT_LABELS, IDEA_AREAS, type Effort, type Idea } from "@/content/ideas";

/** The grown-up's own decision on an idea, saved per browser. */
export type Mark = "next" | "maybe" | "no";

export const EFFORTS: Effort[] = ["S", "M", "L"];

export const MARKS: { value: Mark; emoji: string; label: string }[] = [
  { value: "next", emoji: "⭐", label: "Als nächstes" },
  { value: "maybe", emoji: "🤔", label: "Vielleicht" },
  { value: "no", emoji: "👎", label: "Eher nicht" },
];

export const ALL_IDEAS = IDEA_AREAS.flatMap((a) => a.ideas);
export const AREA_OF = new Map(IDEA_AREAS.flatMap((a) => a.ideas.map((i) => [i.id, a] as const)));
export const IDEA_BY_ID = new Map(ALL_IDEAS.map((i) => [i.id, i]));

/** Still to build: neither done nor turned down. */
export const isOpen = (idea: Idea) => !idea.done && !idea.rejected;
export const countDone = (ideas: Idea[]) => ideas.filter((i) => i.done).length;
/** Rejected ideas don't count towards the progress; they only show under their own filter. */
export const countActive = (ideas: Idea[]) => ideas.filter((i) => !i.rejected).length;

export const GAME_BY_HREF = new Map(CATEGORIES.flatMap((c) => c.games.map((g) => [g.href, g])));

/** A command for Claude and a button that copies it. */
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <>
      <code>{command}</code>
      <button type="button" className="ideas-copy" onClick={copy}>
        {copied ? "Kopiert ✓" : "📋 Kopieren"}
      </button>
    </>
  );
}

/**
 * An idea number that shows the idea in the list of /management/ – on that page by `onShow`, from another page (the
 * research) as a link to it – or, for a built idea, which the list no longer holds, only its number with a tick.
 */
export function IdeaLink({ id, onShow }: { id: string; onShow?: (id: string) => void }) {
  const idea = IDEA_BY_ID.get(id);
  if (idea?.done)
    return (
      <span className="idea-id idea-id-done" title={`${idea.title} – umgesetzt`}>
        {id} ✓
      </span>
    );
  if (!onShow)
    return (
      <Link className="idea-id" title={idea?.title} to={`/management/#${id}`}>
        {id}
      </Link>
    );
  return (
    <button type="button" className="idea-id" title={idea?.title} onClick={() => onShow(id)}>
      {id}
    </button>
  );
}

/** A row of toggle chips; single choice unless the caller toggles a list itself. */
export function Chips<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: T; label: string; title?: string; className?: string }[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset className="ideas-chips">
      <legend>{label}</legend>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          title={o.title}
          className={[o.className, selected.includes(o.value) && "selected"].filter(Boolean).join(" ") || undefined}
          aria-pressed={selected.includes(o.value)}
          onClick={() => onToggle(o.value)}
        >
          {o.label}
        </button>
      ))}
    </fieldset>
  );
}

export function MarkButtons({ id, marks, onMark }: { id: string; marks: Record<string, Mark>; onMark: (id: string, mark: Mark) => void }) {
  return (
    <span className="idea-marks">
      {MARKS.map((m) => (
        <button
          key={m.value}
          type="button"
          className={marks[id] === m.value ? "selected" : undefined}
          aria-pressed={marks[id] === m.value}
          aria-label={m.label}
          title={m.label}
          onClick={() => onMark(id, m.value)}
        >
          {m.emoji}
        </button>
      ))}
    </span>
  );
}

export function EffortTag({ effort, short }: { effort: Effort; short?: boolean }) {
  return (
    <span className={`effort effort-${effort}`} title={`Aufwand ${EFFORT_LABELS[effort]}`}>
      {short ? effort : `${effort} ${EFFORT_LABELS[effort]}`}
    </span>
  );
}

export function Progress({ done, total }: { done: number; total: number }) {
  return (
    <div className="ideas-progress">
      <span className="ideas-progress-bar" aria-hidden>
        <span style={{ width: `${(done / total) * 100}%` }} />
      </span>
      {done} von {total} umgesetzt
    </div>
  );
}
