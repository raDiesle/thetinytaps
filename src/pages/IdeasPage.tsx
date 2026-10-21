import { Link } from "react-router";
import { Toggle } from "@/components/SettingControls";
import { EFFORT_LABELS, IDEA_AREAS, TOP_PICKS, type Idea } from "@/content/ideas";
import { useStoredSettings } from "@/lib/storage";
import { useTitle } from "@/lib/title";

const ALL_IDEAS = IDEA_AREAS.flatMap((a) => a.ideas);

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/**
 * Hidden page for grown-ups: the idea collection from content/ideas.ts.
 * Reached by holding the "p" in the home page title; stars are saved per browser.
 */
export function IdeasPage() {
  useTitle("Ideen");
  const [saved, update] = useStoredSettings("tinytaps.ideas.v1", { starred: [] as string[], onlyStarred: false });
  const starred = new Set(saved.starred);

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

      <section className="ideas-panel">
        <h2>Meine Empfehlung zuerst</h2>
        <ol className="ideas-picks">
          {TOP_PICKS.map(({ id, reason }) => (
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
            <span aria-hidden>{a.emoji}</span> {a.prefix}: {a.title}
          </button>
        ))}
      </nav>

      <div className="ideas-filter">
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
        const ideas = saved.onlyStarred ? area.ideas.filter((i) => starred.has(i.id)) : area.ideas;
        if (ideas.length === 0) return null;
        return (
          <section key={area.prefix} id={`area-${area.prefix}`} className="ideas-area">
            <h2>
              <span aria-hidden>{area.emoji}</span> {area.prefix} – {area.title}
            </h2>
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

function IdeaCard({ idea, starred, onStar }: { idea: Idea; starred: boolean; onStar: () => void }) {
  return (
    <li id={idea.id} className="idea-card">
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
      <div className="idea-tags">
        <span className={`effort effort-${idea.effort}`}>
          Aufwand {idea.effort} {EFFORT_LABELS[idea.effort]}
        </span>
        {idea.planned && <span className="idea-planned">schon geplant</span>}
        {idea.done && <span className="idea-done">schon umgesetzt</span>}
      </div>
    </li>
  );
}
