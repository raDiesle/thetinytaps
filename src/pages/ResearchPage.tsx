import { useState } from "react";
import { MenuTop } from "@/components/MenuTop";
import { RESEARCH, RESEARCH_AREAS, type Research, type ResearchArea } from "@/content/research";
import { useTitle } from "@/lib/title";
import "@/styles/ideas.css";
import { BackToContents, Contents, goToPlace, useHashPlace } from "./management/Contents";
import { ResearchPanel, researchDate } from "./management/ResearchPanel";

/** How many of the newest studies the contents name on their own, above the topics. */
const NEWEST = 3;

/** Everything of a study a search looks through. */
const textOf = (r: Research) =>
  [
    r.id,
    r.title,
    r.question,
    r.method,
    ...r.findings,
    ...r.ideas,
    ...r.topics.flatMap((t) => [t.title, ...t.searches, ...t.ideas]),
    ...r.games.flatMap((g) => [g.title, ...g.searches]),
    ...r.excluded.flatMap((e) => [e.title, e.why]),
    ...(r.domains ?? []).flatMap((d) => [d.name, d.why]),
  ]
    .join(" ")
    .toLowerCase();

/**
 * Hidden page for grown-ups, reached from /management/: every piece of research (`content/research/`) – what was looked
 * up, how, what came out and which ideas it led to – on a page of its own, so the management page stays with what is
 * to decide (user request, November 2026). Its contents group the studies by topic (`RESEARCH_AREAS`), newest first in
 * each, with the newest few named on their own; a search narrows them, and `#<study id>` in the address opens one.
 */
export function ResearchPage() {
  useTitle("Recherchen");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const toggle = (id: string, isOpen: boolean) =>
    setOpen((now) => {
      if (now.has(id) === isOpen) return now;
      const next = new Set(now);
      if (isOpen) next.add(id);
      else next.delete(id);
      return next;
    });
  const show = (id: string) => {
    setQuery("");
    toggle(id, true);
    setTimeout(() => goToPlace(id));
  };
  useHashPlace(show);

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const shown = RESEARCH.filter((r) => words.every((w) => textOf(r).includes(w)));
  const areas = (Object.keys(RESEARCH_AREAS) as ResearchArea[])
    .map((area) => ({ area, ...RESEARCH_AREAS[area], studies: shown.filter((r) => r.area === area) }))
    .filter((a) => a.studies.length > 0);
  const newest = [...RESEARCH].sort((a, b) => b.date.localeCompare(a.date)).slice(0, NEWEST);

  return (
    <main className="home ideas" lang="de" dir="ltr">
      <MenuTop to="/management/" back="Management" />
      <h1>
        <span aria-hidden>🔍</span> Recherchen
      </h1>
      <p className="home-subtitle">
        {RESEARCH.length} Recherchen: was nachgeschaut wurde, wie, was herauskam und welche Ideen daraus wurden. Nach Thema geordnet, die neueste zuerst. Eine
        Ideen-Nummer führt zur Idee auf der Management-Seite.
      </p>

      <Contents
        groups={[
          {
            title: "🆕 Neu",
            entries: newest.map((r) => ({ id: r.id, label: `${r.emoji} ${r.title}`, note: researchDate(r) })),
          },
          ...(Object.keys(RESEARCH_AREAS) as ResearchArea[]).map((area) => ({
            title: `${RESEARCH_AREAS[area].emoji} ${RESEARCH_AREAS[area].title}`,
            entries: RESEARCH.filter((r) => r.area === area).map((r) => ({ id: r.id, label: r.title, note: researchDate(r) })),
          })),
        ].filter((group) => group.entries.length > 0)}
      />

      <div className="ideas-toolbar">
        <input
          type="search"
          className="ideas-search"
          placeholder="Suchen (z. B. Schnuller, Domain, YouTube, H-12)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Recherchen durchsuchen"
        />
        <div className="ideas-count">
          {shown.length} von {RESEARCH.length}
        </div>
      </div>

      {areas.map(({ area, emoji, title, about, studies }) => (
        <section key={area} id={`thema-${area}`} className="ideas-research">
          <h2>
            {emoji} {title} <span className="ideas-area-count">{studies.length}</span>
          </h2>
          <p className="ideas-hint">{about}</p>
          {studies.map((research) => (
            <ResearchPanel
              key={research.id}
              research={research}
              open={open.has(research.id) || (words.length > 0 && shown.length <= 3)}
              onToggle={(isOpen) => toggle(research.id, isOpen)}
            />
          ))}
        </section>
      ))}
      {shown.length === 0 && <p className="ideas-empty">Keine Recherche passt zu dieser Suche.</p>}
      <BackToContents />
    </main>
  );
}
