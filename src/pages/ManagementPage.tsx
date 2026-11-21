import { lazy, Suspense, useState } from "react";
import { Link } from "react-router";
import { MenuTop } from "@/components/MenuTop";
import { PictureQueue } from "@/components/PictureQueue";
import { VoiceQueue } from "@/components/VoiceQueue";
import { UNFINISHED } from "@/content/games";
import { EFFORT_LABELS, IDEA_AREAS, TODDLER_RULES, TOP_PICKS, type Effort, type Idea, type IdeaArea, areaKey } from "@/content/ideas";
import { RESEARCH } from "@/content/research";
import { buildDate } from "@/lib/pwa";
import { useStoredSettings } from "@/lib/storage";
import { useTitle } from "@/lib/title";
import "@/styles/ideas.css";
import { IdeaRow } from "./management/IdeaRow";
import { Languages } from "./management/LanguageTable";
import { Mascots } from "./management/MascotsPanel";
import { NextPanel } from "./management/NextPanel";
import { Overview } from "./management/Overview";
import { researchDate } from "./management/ResearchPanel";
import { BackToContents, Contents, type ContentsEntry, useHashPlace } from "./management/Contents";
import { TOOL_GROUPS } from "./management/tools";
import {
  ALL_IDEAS,
  AREA_OF,
  Chips,
  EFFORTS,
  EffortTag,
  IDEA_BY_ID,
  MARKS,
  MarkButtons,
  Progress,
  countActive,
  countDone,
  isOpen,
  type Mark,
} from "./management/shared";
import { Unfinished } from "./management/Unfinished";

/**
 * Built ideas are never listed (user feedback, November 2026: the page shows only what is still to decide); they stay in
 * the data so their numbers stay taken and the research and mascot links to them still name them.
 */
type StatusFilter = "todo" | "rejected";
type MarkFilter = "any" | Mark | "undecided";
type GroupBy = "area" | "effort";

/** What is saved per browser: the marks and how the list is ordered – never a filter (see `FILTERS`). */
const DEFAULTS = {
  marks: {} as Record<string, Mark>,
  /** Stars from the first version of this page; read as "next" and cleared on the next change. */
  starred: [] as string[],
  groupBy: "area" as GroupBy,
};

/**
 * The list's filters, for this visit only: saved, a filter picked once kept the list short on every later visit,
 * and scrolling down no longer showed all the ideas the overview counts (user feedback, November 2026).
 */
const FILTERS = {
  status: "todo" as StatusFilter,
  efforts: [] as Effort[],
  mark: "any" as MarkFilter,
  area: "" as string,
};

/** The page's parts, for its contents at the top. */
const PLACES: ContentsEntry[] = [
  { id: "als-naechstes", label: "⭐ Als nächstes", note: "markierte Ideen, zum Kopieren" },
  { id: "in-arbeit", label: "🚧 In Arbeit", note: "Spiele, die noch nicht im Regal stehen" },
  { id: "uebersicht", label: "📊 Überblick", note: "offene Ideen nach Bereich und Aufwand" },
  { id: "ideas-list", label: "💡 Alle Ideen", note: "suchen, filtern, markieren" },
];

/** Tables of what is there and what is missing, per game. */
const TABLES: ContentsEntry[] = [
  { id: "sprachen", label: "🌍 Sprachen", note: "Übersetzungen und Aufnahmen" },
  { id: "maskottchen", label: "🦊🐻 Fuchs & Bär", note: "wo die Maskottchen schon sind" },
  { id: "stimmen", label: "🎙️ Stimmen", note: "was ElevenLabs noch aufnehmen muss" },
  { id: "offene-bilder", label: "🖼️ Offene Bilder", note: "die Warteschlange für Gemini" },
  { id: "recherchen", label: "🔍 Neue Recherchen", note: "die letzten, alle auf eigener Seite" },
];

/** How many of the newest studies the page names, above the link to all of them. */
const NEWEST_RESEARCH = 4;

/** The lines still to record: loaded after the page, since it reads the data of every game. */
const VoiceList = lazy(() => import("@/components/VoiceList").then((module) => ({ default: module.VoiceList })));

/**
 * Hidden page for grown-ups that collects everything that helps decide what to
 * do next: the idea collection from content/ideas, the language table and the
 * newest research (all of it on /management/recherchen/), with contents at the top that also lead to the pages of
 * their own (`TOOL_GROUPS`). An overview table shows where the open work is
 * (area × effort) and jumps to it in the list, filters narrow the list for this visit, and each idea can be marked
 * ⭐ / 🤔 / 👎. The ⭐ ones collect at the top, ready to copy as "mach N-01, …".
 * Reached by holding the "p" in the home page title.
 */
export function ManagementPage() {
  useTitle("Management");
  const [stored, updateStored] = useStoredSettings("tinytaps.ideas.v1", DEFAULTS);
  const [filters, setFilters] = useState(FILTERS);
  const saved = { ...stored, ...filters };
  const update = (change: Partial<typeof FILTERS>) => setFilters((f) => ({ ...f, ...change }));
  const [query, setQuery] = useState("");
  /** The overview's last pick, marked in the full list: its area, and its effort if a number was tapped. */
  const [spot, setSpot] = useState<{ area: string; effort?: Effort }>();
  const marks: Record<string, Mark> = { ...Object.fromEntries(saved.starred.map((id) => [id, "next"])), ...saved.marks };
  const done = countDone(ALL_IDEAS);
  const active = countActive(ALL_IDEAS);
  const rejected = ALL_IDEAS.length - active;

  const setMark = (id: string, mark: Mark) => {
    const next = { ...marks };
    if (next[id] === mark) delete next[id];
    else next[id] = mark;
    updateStored({ marks: next, starred: [] });
  };

  /** Shows an idea even when the filters hide it, then scrolls to it (a built one is not in the list to show). */
  const showIdea = (id: string, instant = false) => {
    if (IDEA_BY_ID.get(id)?.done) return;
    if (!document.getElementById(id)) {
      setQuery("");
      update({ ...FILTERS, status: IDEA_BY_ID.get(id)?.rejected ? "rejected" : "todo" });
    }
    setTimeout(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: instant ? "instant" : "smooth", block: "center" });
      el?.focus({ preventScroll: true });
    });
  };

  /**
   * From the overview table: jump to this area in the full list of open ideas and mark its ideas (of this effort)
   * there – never a filter, so scrolling on still shows every idea the overview counts.
   */
  const pick = (area: string, effort?: Effort) => {
    setQuery("");
    update(FILTERS);
    updateStored({ groupBy: "area" });
    setSpot({ area, effort });
    setTimeout(() => {
      const first = effort && document.querySelector(`#area-${area} .idea-card[data-effort="${effort}"]`);
      (first || document.getElementById(`area-${area}`))?.scrollIntoView({ behavior: "smooth", block: first ? "center" : "start" });
    });
  };

  // A link from another page (the research's idea numbers) names an idea after „#“: jumped to at once, since a smooth
  // scroll over this long page did not get there in Chrome.
  useHashPlace((id) => (IDEA_BY_ID.has(id) ? showIdea(id, true) : document.getElementById(id)?.scrollIntoView()));

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const visible = (idea: Idea) => {
    const mark = marks[idea.id];
    if (idea.done || (saved.status === "rejected") !== !!idea.rejected) return false;
    if (saved.efforts.length > 0 && !saved.efforts.includes(idea.effort)) return false;
    if (saved.area && areaKey(AREA_OF.get(idea.id) as IdeaArea) !== saved.area) return false;
    if (saved.mark === "undecided" ? mark : saved.mark !== "any" && mark !== saved.mark) return false;
    const haystack = `${idea.id} ${idea.title} ${idea.text} ${idea.why ?? ""} ${idea.partial ?? ""}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  };
  /** "Eher nicht" sinks to the bottom; otherwise number order. */
  const order = (a: Idea, b: Idea) => Number(marks[a.id] === "no") - Number(marks[b.id] === "no");

  const shown = ALL_IDEAS.filter(visible);
  const sections: { key: string; title: string; intro?: string; ideas: Idea[] }[] =
    saved.groupBy === "area"
      ? IDEA_AREAS.map((a) => ({ key: areaKey(a), title: `${a.emoji} ${a.prefix} – ${a.title}`, intro: a.intro, ideas: a.ideas.filter(visible).sort(order) }))
      : EFFORTS.map((e) => ({ key: e, title: `Aufwand ${e} – ${EFFORT_LABELS[e]}`, ideas: shown.filter((i) => i.effort === e).sort(order) }));

  const marked = (mark: Mark) =>
    Object.keys(marks)
      .filter((id) => marks[id] === mark)
      .map((id) => IDEA_BY_ID.get(id))
      .filter((i): i is Idea => !!i && isOpen(i));
  const nextIdeas = marked("next");
  const noIdeas = marked("no");
  const picks = TOP_PICKS.filter(({ id }) => isOpen(IDEA_BY_ID.get(id) as Idea));
  const filtered = saved.status !== FILTERS.status || saved.efforts.length > 0 || saved.mark !== "any" || saved.area !== "" || words.length > 0;
  const markProps = { marks, onMark: setMark };

  return (
    <main className="home ideas" lang="de" dir="ltr">
      <MenuTop to="/" back="Alle Spiele" />
      <h1>
        <span aria-hidden>🧭</span> Management
      </h1>
      <p className="ideas-build">Stand: {buildDate()}</p>
      <p className="home-subtitle">
        Alles, was beim Entscheiden hilft: Ideen, Sprachen, Recherchen, offene Bilder. {active - done} offene Ideen, {done} schon umgesetzt (nicht mehr
        aufgelistet), {rejected} abgelehnt. Die Nummern (z.&nbsp;B. <b>N-03</b>) bleiben fest, damit man sie nennen kann.
      </p>
      <Progress done={done} total={active} />
      <Contents
        groups={[
          { title: "💡 Ideen", entries: PLACES.filter((place) => place.id !== "in-arbeit" || UNFINISHED.length > 0) },
          { title: "📋 Tabellen und Listen", entries: TABLES },
          ...TOOL_GROUPS.map((group) => ({
            title: group.title,
            entries: group.pages.map((page) => ({
              to: page.to,
              label: `${page.emoji} ${page.label}`,
              note: page.ideas ? `${page.about} (${page.ideas.join(", ")})` : page.about,
            })),
          })),
        ]}
      />

      <NextPanel ideas={nextIdeas} noIdeas={noIdeas} onShow={showIdea} onMark={setMark} />

      <Unfinished />

      <section id="uebersicht" className="ideas-panel">
        <h2>Überblick: Wo ist was offen?</h2>
        <p className="ideas-hint">Zahlen = offene Ideen. Antippen springt zu diesen Ideen in der Liste unten und markiert sie – die Liste bleibt ganz.</p>
        <Overview marks={marks} onPick={pick} />
      </section>

      <Languages />

      <Mascots onShow={showIdea} />

      <details id="stimmen" className="ideas-panel">
        <summary>
          <h2>🎙️ Stimmen: was ElevenLabs noch aufnehmen muss</h2>
        </summary>
        <VoiceQueue />
        <Suspense fallback={<p className="ideas-hint">Die Sätze aller Spiele werden gelesen …</p>}>
          <VoiceList />
        </Suspense>
      </details>

      <section id="recherchen" className="ideas-panel">
        <h2>🔍 Neue Recherchen</h2>
        <p className="ideas-hint">
          Was nachgeschaut wurde, wie und welche Ideen daraus kamen, steht auf einer eigenen Seite, nach Thema geordnet. Die neuesten:
        </p>
        <ul className="ideas-research-newest">
          {[...RESEARCH]
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, NEWEST_RESEARCH)
            .map((research) => (
              <li key={research.id}>
                <Link to={`/management/recherchen/#${research.id}`}>
                  {research.emoji} {research.title}
                </Link>{" "}
                <small>{researchDate(research)}</small>
              </li>
            ))}
        </ul>
        <Link to="/management/recherchen/" className="ideas-more">
          Alle {RESEARCH.length} Recherchen nach Thema ↗
        </Link>
      </section>

      <PictureQueue />

      {picks.length > 0 && (
        <section className="ideas-panel">
          <h2>Meine Empfehlung</h2>
          <ol className="ideas-picks">
            {picks.map(({ id, reason }) => {
              const idea = IDEA_BY_ID.get(id) as Idea;
              return (
                <li key={id}>
                  <button type="button" className="idea-id" onClick={() => showIdea(id)}>
                    {id}
                  </button>
                  <EffortTag effort={idea.effort} short />
                  <span>
                    <b>{idea.title}</b> – {reason}
                  </span>
                  <MarkButtons id={id} {...markProps} />
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <details className="ideas-panel">
        <summary>
          <h2>So einfach muss es sein – Faustregeln für 2-Jährige</h2>
        </summary>
        <ul className="ideas-rules">
          {TODDLER_RULES.map(({ emoji, text }) => (
            <li key={text}>
              <span aria-hidden>{emoji}</span> {text}
            </li>
          ))}
        </ul>
      </details>

      <div id="ideas-list" className="ideas-toolbar">
        <input
          type="search"
          className="ideas-search"
          placeholder="Suchen (z. B. Bagger, Musik, N-1)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Chips
          label="Zeigen"
          options={[
            { value: "todo", label: `Offen (${active - done})` },
            { value: "rejected", label: `🚫 Abgelehnt (${rejected})` },
          ]}
          selected={[saved.status]}
          onToggle={(status) => update({ status })}
        />
        <Chips
          label="Aufwand"
          options={EFFORTS.map((e) => ({ value: e, label: `${e} ${EFFORT_LABELS[e]}`, className: `effort-${e}` }))}
          selected={saved.efforts}
          onToggle={(e) => update({ efforts: saved.efforts.includes(e) ? saved.efforts.filter((x) => x !== e) : [...saved.efforts, e] })}
        />
        <Chips
          label="Markiert"
          options={[
            { value: "any", label: "Egal" },
            ...MARKS.map((m) => ({ value: m.value, label: `${m.emoji} ${m.label}` })),
            { value: "undecided", label: "Noch nicht entschieden" },
          ]}
          selected={[saved.mark]}
          onToggle={(mark) => update({ mark })}
        />
        <Chips
          label="Bereich"
          options={[{ value: "", label: "Alle" }, ...IDEA_AREAS.map((a) => ({ value: areaKey(a), label: `${a.emoji} ${a.prefix}`, title: a.title }))]}
          selected={[saved.area]}
          onToggle={(area) => update({ area })}
        />
        <Chips
          label="Ordnen nach"
          options={[
            { value: "area", label: "Bereich" },
            { value: "effort", label: "Aufwand" },
          ]}
          selected={[saved.groupBy]}
          onToggle={(groupBy) => updateStored({ groupBy })}
        />
        <div className="ideas-count">
          {shown.length} {shown.length === 1 ? "Idee" : "Ideen"}
          {filtered && (
            <button
              type="button"
              className="ideas-reset"
              onClick={() => {
                setQuery("");
                update(FILTERS);
              }}
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      </div>

      {sections.map(
        ({ key, title, intro, ideas }) =>
          ideas.length > 0 && (
            <section key={key} id={`area-${key}`} className="ideas-area">
              <h2>
                {title} <span className="ideas-area-count">{ideas.length}</span>
              </h2>
              {intro && <p className="ideas-intro">{intro}</p>}
              <ul className="ideas-list">
                {ideas.map((idea) => (
                  <IdeaRow
                    key={idea.id}
                    idea={idea}
                    area={saved.groupBy === "effort" ? AREA_OF.get(idea.id) : undefined}
                    spotted={spot?.area === AREA_OF.get(idea.id)?.prefix && (!spot?.effort || spot.effort === idea.effort)}
                    {...markProps}
                  />
                ))}
              </ul>
            </section>
          ),
      )}
      {shown.length === 0 && <p className="ideas-empty">Keine Idee passt zu diesen Filtern.</p>}
      <BackToContents />
    </main>
  );
}
