import { useEffect, useState } from "react";
import { Link } from "react-router";

/** One line of a page's contents: a place on the page (`#id`) or another page (`to`). */
export interface ContentsEntry {
  label: string;
  /** A place on this page: the element with this id (a closed `<details>` is opened). */
  id?: string;
  /** Another page, opened like a link. */
  to?: string;
  /** A few words on what is there, shown small beside it. */
  note?: string;
}

/** A heading of the contents with its lines. */
export interface ContentsGroup {
  title: string;
  entries: ContentsEntry[];
}

/** Opens the place (a folded `<details>` and the folded ones round it) and scrolls it into view. */
export function goToPlace(id: string) {
  const target = document.getElementById(id);
  for (let node: HTMLElement | null = target; node; node = node.parentElement) if (node instanceof HTMLDetailsElement) node.open = true;
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * A page's table of contents for grown-ups (/management/ and its pages, user request, November 2026: everything should
 * be easy to find): headings with their lines, each a place on the page or a page of its own (↗). It carries the id
 * `inhalt`, where the floating „↑ Inhalt“ (`BackToContents`) leads.
 */
export function Contents({ groups, label = "Inhalt" }: { groups: ContentsGroup[]; label?: string }) {
  return (
    <nav id="inhalt" className="ideas-toc" aria-label={label}>
      {groups.map((group) => (
        <div key={group.title} className="ideas-toc-group">
          <h2>{group.title}</h2>
          <ul>
            {group.entries.map((entry) => (
              <li key={entry.id ?? entry.to}>
                {entry.to ? (
                  <Link to={entry.to}>{entry.label} ↗</Link>
                ) : (
                  <a
                    href={`#${entry.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goToPlace(entry.id as string);
                    }}
                  >
                    {entry.label}
                  </a>
                )}
                {entry.note && <small> – {entry.note}</small>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** A small button in the bottom right corner, shown once the contents have scrolled away, that leads back to them. */
export function BackToContents() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const contents = document.getElementById("inhalt");
    if (!contents) return;
    const watch = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    watch.observe(contents);
    return () => watch.disconnect();
  }, []);
  if (!shown) return null;
  return (
    <button type="button" className="ideas-back-to-toc" onClick={() => goToPlace("inhalt")}>
      ↑ Inhalt
    </button>
  );
}

/** Opens and shows the place an address names after „#“ (a link from another page), once the page is drawn. */
export function useHashPlace(show: (id: string) => void) {
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    // Only for the address the page was opened with.
    if (id) setTimeout(() => show(id), 50);
  }, []);
}
