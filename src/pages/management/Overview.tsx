import { EFFORT_LABELS, IDEA_GROUPS, areaKey, type Effort, type Idea, type IdeaArea } from "@/content/ideas";
import { EFFORTS, countActive, countDone, isOpen, type Mark } from "./shared";

/** Table of areas × effort with the number of open ideas in each cell; every number is a filter. */
export function Overview({ marks, onPick }: { marks: Record<string, Mark>; onPick: (area: string, effort?: Effort) => void }) {
  const cell = (key: string, area: IdeaArea, ideas: Idea[], effort?: Effort) =>
    ideas.length === 0 ? (
      <td key={key} className="ideas-zero">
        ·
      </td>
    ) : (
      <td key={key}>
        <button type="button" className={effort ? `effort-${effort}` : undefined} onClick={() => onPick(areaKey(area), effort)}>
          {ideas.length}
        </button>
      </td>
    );

  return (
    <div className="ideas-overview-scroll">
      <table className="ideas-overview">
        <thead>
          <tr>
            <th>Bereich</th>
            {EFFORTS.map((e) => (
              <th key={e}>
                {e} <small>{EFFORT_LABELS[e]}</small>
              </th>
            ))}
            <th>Offen</th>
            <th>⭐</th>
            <th>Fertig</th>
            <th>🚫</th>
          </tr>
        </thead>
        {IDEA_GROUPS.map((group) => (
          <tbody key={group.title}>
            <tr className="ideas-overview-group">
              <th colSpan={8}>
                {group.emoji} {group.title}
              </th>
            </tr>
            {group.areas.map((area) => {
              const open = area.ideas.filter(isOpen);
              return (
                <tr key={areaKey(area)} className={open.length === 0 ? "ideas-overview-finished" : undefined}>
                  <th>
                    <button type="button" onClick={() => onPick(areaKey(area))}>
                      {area.emoji} <b>{area.prefix}</b> {area.title}
                    </button>
                  </th>
                  {EFFORTS.map((e) =>
                    cell(
                      e,
                      area,
                      open.filter((i) => i.effort === e),
                      e,
                    ),
                  )}
                  {cell("open", area, open)}
                  <td>{open.filter((i) => marks[i.id] === "next").length || <span className="ideas-zero">·</span>}</td>
                  <td className="ideas-overview-done">
                    {countDone(area.ideas)}/{countActive(area.ideas)}
                  </td>
                  <td className="ideas-overview-done">{area.ideas.length - countActive(area.ideas) || <span className="ideas-zero">·</span>}</td>
                </tr>
              );
            })}
          </tbody>
        ))}
      </table>
    </div>
  );
}
