import { Link } from "react-router";
import type { Research } from "@/content/research";
import { pick } from "@/lib/language";
import { GAME_BY_HREF, IdeaLink } from "./shared";

/** A study's date as Germans write it. */
export const researchDate = (research: Research) => new Date(`${research.date}T12:00:00`).toLocaleDateString("de-DE");

/**
 * One piece of research from content/research: question, method, findings, topics with their ideas, games, what was
 * left out, sources. Its idea numbers lead to the idea on /management/ (`IdeaLink`).
 */
export function ResearchPanel({
  research,
  open,
  onToggle,
  onShow,
}: {
  research: Research;
  open: boolean;
  onToggle?: (open: boolean) => void;
  onShow?: (id: string) => void;
}) {
  const date = researchDate(research);
  return (
    <details id={research.id} className="ideas-panel ideas-research-study" open={open} onToggle={(e) => onToggle?.(e.currentTarget.open)}>
      <summary>
        <h2>
          {research.emoji} {research.title}
        </h2>{" "}
        <small className="ideas-research-date">{date}</small>
      </summary>
      <p>
        <b>Frage:</b> {research.question}
      </p>
      <p className="ideas-hint">
        <b>Wie:</b> {research.method}
      </p>
      <h3>Ergebnisse</h3>
      <ul className="ideas-research-findings">
        {research.findings.map((finding) => (
          <li key={finding}>{finding}</li>
        ))}
      </ul>
      {research.ideas.length > 0 && (
        <p>
          Ideen daraus außerdem:{" "}
          {research.ideas.map((id) => (
            <IdeaLink key={id} id={id} onShow={onShow} />
          ))}
        </p>
      )}
      {research.topics.length > 0 && (
        <>
          <h3>Themen und Ideen</h3>
          <div className="ideas-overview-scroll">
            <table className="ideas-research-table">
              <thead>
                <tr>
                  <th>Thema</th>
                  <th>Was Eltern suchen</th>
                  <th>Ideen</th>
                </tr>
              </thead>
              <tbody>
                {research.topics.map((topic) => (
                  <tr key={topic.title}>
                    <th>
                      {topic.emoji} {topic.title}
                    </th>
                    <td>{topic.searches.map((q) => `„${q}“`).join(", ")}</td>
                    <td>
                      {topic.ideas.map((id) => (
                        <IdeaLink key={id} id={id} onShow={onShow} />
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {research.games.length > 0 && (
        <>
          <h3>Gibt es schon – Titel-Vorschlag für Google</h3>
          <div className="ideas-overview-scroll">
            <table className="ideas-research-table">
              <thead>
                <tr>
                  <th>Spiel</th>
                  <th>Was Eltern suchen</th>
                  <th>Titel</th>
                </tr>
              </thead>
              <tbody>
                {research.games.map((match) => {
                  const game = GAME_BY_HREF.get(match.href);
                  return (
                    <tr key={match.href}>
                      <th>
                        <Link to={match.href}>{game ? `${game.emoji} ${pick(game.title, "de")}` : match.href}</Link>
                      </th>
                      <td>{match.searches.map((q) => `„${q}“`).join(", ")}</td>
                      <td>{match.title}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {research.domains && (
        <>
          <h3>Domains – frei am {date}</h3>
          <div className="ideas-overview-scroll">
            <table className="ideas-research-table">
              <thead>
                <tr>
                  <th>Platz</th>
                  <th>Name</th>
                  <th>Frei</th>
                  <th>Vergeben</th>
                  <th>Warum</th>
                </tr>
              </thead>
              <tbody>
                {research.domains.map((domain) => (
                  <tr key={domain.name}>
                    <td>{domain.rank}</td>
                    <th>{domain.name}</th>
                    <td>{domain.free.map((tld) => `.${tld}`).join(" ") || "–"}</td>
                    <td>{domain.taken.map((tld) => `.${tld}`).join(" ") || "–"}</td>
                    <td>{domain.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {research.excluded.length > 0 && (
        <>
          <h3>Bewusst weggelassen</h3>
          <ul className="ideas-research-findings">
            {research.excluded.map(({ title, why }) => (
              <li key={title}>
                <b>{title}:</b> {why}
              </li>
            ))}
          </ul>
        </>
      )}
      {research.sources.length > 0 && (
        <>
          <h3>Quellen</h3>
          <ul className="ideas-research-findings">
            {research.sources.map(({ label, url }) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noreferrer">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </details>
  );
}
