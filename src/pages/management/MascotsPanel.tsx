import { MASCOT_STATUS, type MascotTask, waitingMascotPictures } from "@/content/ideas";
import { pick } from "@/lib/language";
import { EffortTag, GAME_BY_HREF, IdeaLink } from "./shared";

const MASCOT_WORK: Record<MascotTask["work"], string> = { drawing: "✏️ Zeichnung", picture: "🖼️ Gemini-Bild" };
const MASCOT_STATE: Record<NonNullable<MascotTask["state"]>, string> = { done: "✅", partial: "🟡", removed: "🚫" };

/**
 * Where the app's mascots, the fox and the bear, could still turn up (content/ideas/mascotStatus.ts), game by game:
 * drawings can be done any time, Gemini pictures wait and are made together in one batch, so the footer counts them.
 */
export function Mascots({ onShow }: { onShow: (id: string) => void }) {
  const tasks = MASCOT_STATUS.flatMap((row) => row.tasks);
  return (
    <details id="maskottchen" className="ideas-panel">
      <summary>
        <h2>🦊🐻 Fuchs & Bär: wo die Maskottchen der App noch vorkommen könnten</h2>
      </summary>
      <p className="ideas-hint">
        Fuchs und Bär kommen in den Spielen immer wieder vor, aber nur, wo sie zum Spiel gehören: als Figur, die das Spiel zeigt und die darin etwas tut, oder
        in einer Rolle, die das Bild schon hat (Bäcker, Fahrerin). Nie als Deko, die daneben steht, zuschaut oder jubelt – Kinder wollen sie antippen und
        denken, sie gehöre zum Spiel, und jedes Ding mehr ist ein Reiz mehr. Das Kind tut die Sache, ein Großer nur, wo er auch etwas tut. ✏️ Zeichnungen sind
        Code und gehen jederzeit; 🖼️ Gemini-Bilder warten und werden zusammen in einem Batch gemacht, das ist günstiger – sag dann z. B. „mach die wartenden
        Fuchs- und Bärenbilder“. ✅ fertig, 🟡 teilweise, 🚫 als Deko wieder herausgenommen oder nicht zu bauen, · offen. Ideen dazu: D-16 bis D-21.
      </p>
      <div className="ideas-overview-scroll">
        <table className="ideas-overview ideas-languages ideas-mascots">
          <thead>
            <tr>
              <th>Spiel und Aufgabe</th>
              <th>Wie</th>
              <th>Aufwand</th>
              <th>Idee</th>
              <th>Stand</th>
            </tr>
          </thead>
          <tbody>
            {MASCOT_STATUS.flatMap((row) => {
              const game = GAME_BY_HREF.get(row.href);
              return [
                <tr key={row.href}>
                  <th colSpan={5}>
                    {game ? `${game.emoji} ${pick(game.title, "de")}` : "🏠 Startseite, Cover & Menüs"}
                    {row.note && <small>{row.note}</small>}
                  </th>
                </tr>,
                ...row.tasks.map((task) => (
                  <tr key={`${row.href} ${task.label}`} className="ideas-languages-part">
                    <th>
                      {task.label}
                      {task.note && <small>{task.note}</small>}
                    </th>
                    <td>
                      {MASCOT_WORK[task.work]}
                      {task.pictures && task.pictures > 1 && ` ×${task.pictures}`}
                    </td>
                    <td>
                      <EffortTag effort={task.effort} short />
                    </td>
                    <td>
                      <IdeaLink id={task.idea ?? "D-18"} onShow={onShow} />
                    </td>
                    {task.state ? <td>{MASCOT_STATE[task.state]}</td> : <td className="ideas-zero">·</td>}
                  </tr>
                )),
              ];
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={5}>
                Fertig {tasks.filter((t) => t.state === "done").length}/{tasks.filter((t) => t.state !== "removed").length} · Gemini-Bilder für den nächsten
                Batch: {waitingMascotPictures()}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </details>
  );
}
