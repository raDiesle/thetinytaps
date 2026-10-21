import { Link } from "react-router";
import { Choice, Toggle } from "@/components/SettingControls";
import { EFFORT_LABELS, IDEA_AREAS, TOP_PICKS, ideaStatus, type Idea, type IdeaStatus } from "@/content/ideas";
import { useStoredSettings } from "@/lib/storage";
import { useTitle } from "@/lib/title";

const ALL_IDEAS = IDEA_AREAS.flatMap((a) => a.ideas);

type StatusFilter = "all" | "todo" | "done";

const STATUS_ORDER: Record<IdeaStatus, number> = { open: 0, partial: 1, done: 2 };

const countDone = (ideas: Idea[]) => ideas.filter((i) => i.done).length;

const matches = (idea: Idea, filter: StatusFilter) =>
  filter === "all" || (filter === "done") === (ideaStatus(idea) === "done");

/** Open ideas first, then partly done, then done ones; otherwise in number order. */
const byStatus = (a: Idea, b: Idea) => STATUS_ORDER[ideaStatus(a)] - STATUS_ORDER[ideaStatus(b)];

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/**
 * Hidden page for grown-ups: the idea collection from content/ideas.ts.
 * Reached by holding the "p" in the home page title; stars are saved per browser.
 */
export function IdeasPage() {
  useTitle("Ideen");
  const [saved, update] = useStoredSettings("tinytaps.ideas.v1", {
    starred: [] as string[],
    onlyStarred: false,
    status: "all" as StatusFilter,
  });
  const starred = new Set(saved.starred);
  const done = countDone(ALL_IDEAS);
  const picks = TOP_PICKS.filter(({ id }) => !ALL_IDEAS.find((i) => i.id === id)?.done);

  const toggleStar = (id: string) =>
    update({ starred: starred.has(id) ? saved.starred.filter((s) => s !== id) : [...saved.starred, id] });

  return (
    <main className="home ideas">
      <Link to="/" className="back-link">
        ← Alle Spiele
      </Link>
      <h1>
        <span aria-hidden>💡</span> Ideen
      </h1>
      <p className="home-subtitle">
        {ALL_IDEAS.length} Ideen für neue und bestehende Spiele. Die Nummern (z.&nbsp;B. <b>N-03</b>) bleiben fest, damit man sie nennen
        kann.
      </p>
      <Progress done={done} total={ALL_IDEAS.length} />

      <section className="ideas-panel">
        <h2>Meine Empfehlung zuerst</h2>
        <ol className="ideas-picks">
          {picks.map(({ id, reason }) => (
            <li key={id}>
              <button type="button" className="idea-id" onClick={() => scrollTo(id)}>
                {id}
              </button>{" "}
              <b>{ALL_IDEAS.find((i) => i.id === id)?.title}</b> – {reason}
            </li>
          ))}
        </ol>
      </section>

      <nav className="ideas-nav" aria-label="Bereiche">
        {IDEA_AREAS.map((a) => (
          <button key={a.prefix} type="button" onClick={() => scrollTo(`area-${a.prefix}`)}>
            <span aria-hidden>{a.emoji}</span> {a.prefix}: {a.title}{" "}
            <span className="ideas-nav-count">
              {countDone(a.ideas)}/{a.ideas.length}
            </span>
          </button>
        ))}
      </nav>

      <div className="ideas-filter">
        <Choice<StatusFilter>
          label="Zeigen"
          value={saved.status}
          onChange={(status) => update({ status })}
          options={[
            { value: "all", label: "Alle" },
            { value: "todo", label: `Noch offen (${ALL_IDEAS.length - done})` },
            { value: "done", label: `✅ Umgesetzt (${done})` },
          ]}
        />
        <Toggle
          label={`Nur gemerkte ⭐ (${saved.starred.length})`}
          checked={saved.onlyStarred}
          onChange={(onlyStarred) => update({ onlyStarred })}
        />
        <span className="ideas-legend">
          Aufwand: <span className="effort effort-S">S {EFFORT_LABELS.S}</span> <span className="effort effort-M">M {EFFORT_LABELS.M}</span>{" "}
          <span className="effort effort-L">L {EFFORT_LABELS.L}</span>
        </span>
      </div>

      {IDEA_AREAS.map((area) => {
        const ideas = area.ideas
          .filter((i) => matches(i, saved.status) && (!saved.onlyStarred || starred.has(i.id)))
          .sort(byStatus);
        if (ideas.length === 0) return null;
        return (
          <section key={area.prefix} id={`area-${area.prefix}`} className="ideas-area">
            <h2>
              <span aria-hidden>{area.emoji}</span> {area.prefix} – {area.title}
            </h2>
            <Progress done={countDone(area.ideas)} total={area.ideas.length} />
            <ul className="ideas-list">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} starred={starred.has(idea.id)} onStar={() => toggleStar(idea.id)} />
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}

function Progress({ done, total }: { done: number; total: number }) {
  return (
    <div className="ideas-progress">
      <span className="ideas-progress-bar" aria-hidden>
        <span style={{ width: `${(done / total) * 100}%` }} />
      </span>
      {done} von {total} umgesetzt
    </div>
  );
}

function IdeaCard({ idea, starred, onStar }: { idea: Idea; starred: boolean; onStar: () => void }) {
  return (
    <li id={idea.id} className={`idea-card ${ideaStatus(idea)}`}>
      {idea.done && (
        <span className="idea-done-stamp" aria-hidden>
          ✅
        </span>
      )}
      <div className="idea-head">
        <span className="idea-id">{idea.id}</span>
        <span className="idea-emoji" aria-hidden>
          {idea.emoji}
        </span>
        <h3>{idea.title}</h3>
        <button
          type="button"
          className={`idea-star${starred ? " starred" : ""}`}
          aria-pressed={starred}
          aria-label={starred ? "Nicht mehr merken" : "Merken"}
          onClick={onStar}
        >
          {starred ? "★" : "☆"}
        </button>
      </div>
      <p>{idea.text}</p>
      {idea.why && <p className="idea-why">💬 {idea.why}</p>}
      {idea.partial && <p className="idea-partial">🟡 Teilweise da: {idea.partial}</p>}
      <div className="idea-tags">
        <span className={`effort effort-${idea.effort}`}>
          Aufwand {idea.effort} {EFFORT_LABELS[idea.effort]}
        </span>
        {idea.planned && !idea.done && <span className="idea-planned">schon geplant</span>}
        {idea.partial && <span className="idea-partial-tag">teilweise umgesetzt</span>}
        {idea.done && <span className="idea-done">✓ umgesetzt</span>}
      </div>
    </li>
  );
}
