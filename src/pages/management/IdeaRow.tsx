import { type Idea, type IdeaArea, ideaStatus } from "@/content/ideas";
import { EffortTag, MarkButtons, type Mark, isOpen } from "./shared";

/** One idea as a compact row: number, title, effort and marks on top, the text below. Only open and rejected ideas get one. */
export function IdeaRow({
  idea,
  area,
  spotted,
  marks,
  onMark,
}: {
  idea: Idea;
  /** Shown as a tag when the list is not ordered by area. */
  area?: IdeaArea;
  /** Among the ideas picked last in the overview. */
  spotted?: boolean;
  marks: Record<string, Mark>;
  onMark: (id: string, mark: Mark) => void;
}) {
  const mark = marks[idea.id];
  return (
    <li
      id={idea.id}
      tabIndex={-1}
      data-effort={idea.effort}
      className={`idea-card ${ideaStatus(idea)}${mark ? ` mark-${mark}` : ""}${spotted ? " idea-spotted" : ""}`}
    >
      <div className="idea-head">
        <span className="idea-id">{idea.id}</span>
        <span className="idea-emoji" aria-hidden>
          {idea.emoji}
        </span>
        <h3>{idea.title}</h3>
        <EffortTag effort={idea.effort} />
        {area && (
          <span className="idea-area-tag">
            {area.emoji} {area.title}
          </span>
        )}
        {idea.planned && isOpen(idea) && <span className="idea-planned">schon geplant</span>}
        {idea.rejected && <span className="idea-rejected">✗ abgelehnt</span>}
        {isOpen(idea) && <MarkButtons id={idea.id} marks={marks} onMark={onMark} />}
      </div>
      <p>{idea.text}</p>
      {idea.why && <p className="idea-why">💬 {idea.why}</p>}
      {idea.partial && <p className="idea-partial">Davon gebaut: {idea.partial}</p>}
    </li>
  );
}
