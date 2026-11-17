import { EFFORT_LABELS, type Idea } from "@/content/ideas";
import { AREA_OF, CopyCommand, EFFORTS, EffortTag, type Mark } from "./shared";

/**
 * The ideas marked ⭐, with a button that copies "mach N-01, B-02" for Claude.
 * The 👎 ones get a line of their own, so they can be rejected for good (`rejected: true`).
 */
export function NextPanel({
  ideas,
  noIdeas,
  onShow,
  onMark,
}: {
  ideas: Idea[];
  noIdeas: Idea[];
  onShow: (id: string) => void;
  onMark: (id: string, mark: Mark) => void;
}) {
  const command = `mach ${ideas.map((i) => i.id).join(", ")}`;
  const rejectCommand = `lehne ab: ${noIdeas.map((i) => i.id).join(", ")}`;
  const efforts = EFFORTS.map((e) => [e, ideas.filter((i) => i.effort === e).length] as const).filter(([, n]) => n > 0);

  return (
    <section className="ideas-panel ideas-next">
      <h2>⭐ Als nächstes ({ideas.length})</h2>
      {ideas.length === 0 ? (
        <p className="ideas-hint">Markiere Ideen mit ⭐, dann sammeln sie sich hier. 🤔 heißt „vielleicht“, 👎 „eher nicht“ (rutscht nach unten).</p>
      ) : (
        <>
          <ul className="ideas-next-list">
            {ideas.map((idea) => (
              <li key={idea.id}>
                <button type="button" className="idea-id" onClick={() => onShow(idea.id)}>
                  {idea.id}
                </button>
                <EffortTag effort={idea.effort} short />
                <span>
                  {idea.emoji} <b>{idea.title}</b> <span className="ideas-next-area">{AREA_OF.get(idea.id)?.title}</span>
                </span>
                <button type="button" className="ideas-unmark" aria-label="Nicht mehr merken" onClick={() => onMark(idea.id, "next")}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div className="ideas-next-foot">
            <span>Zusammen: {efforts.map(([e, n]) => `${n}× ${EFFORT_LABELS[e]}`).join(", ")}</span>
            <CopyCommand command={command} />
          </div>
        </>
      )}
      {noIdeas.length > 0 && (
        <div className="ideas-next-foot">
          <span>
            👎 {noIdeas.length} {noIdeas.length === 1 ? "Idee" : "Ideen"} „eher nicht“ – endgültig ablehnen:
          </span>
          <CopyCommand command={rejectCommand} />
        </div>
      )}
    </section>
  );
}
