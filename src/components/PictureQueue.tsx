import { Fragment } from "react";
import { waitingMascotPictures } from "@/content/ideas/mascotStatus";
import { PICTURE_QUEUE, type QueuedPicture } from "@/content/pictureQueue";
import { costOf, type EngineId, type Grid, planQueue } from "@/content/pictureQueuePlan";

const dollars = (sheets: { engine: EngineId }[]) => `≈ ${costOf(sheets).toFixed(3).replace(".", ",")} $`;
const gridName = (grid: Grid) => grid.replace("x", "×");

/** What a sheet's pictures have in common, in words: „1:1, 512 px, freigestellt“. */
function kindOf(p: QueuedPicture) {
  return [p.aspect ?? "1:1", p.size ? `${p.size} px` : "ganzes Bild", p.transparent && "freigestellt", p.ref?.length && "mit Vorlage"]
    .filter(Boolean)
    .join(", ");
}

/**
 * On the management page: every picture asked for that Gemini still has to make (content/pictureQueue.ts), split as
 * `bun run image queue` splits it – what is cheap now, what waits for partners to fill its sheet, and what waits for
 * its reference – with how many wait in all in its heading, the one number the user looks for, and below how many mascot
 * pictures still wait for their word. Prompts are not shown here to check: the user only wants the count (November 2026).
 */
export function PictureQueue() {
  const plan = planQueue(PICTURE_QUEUE);
  const mascots = waitingMascotPictures();
  const rows = (pictures: QueuedPicture[]) =>
    pictures.map((p) => (
      <tr key={p.id} className="ideas-languages-part">
        <th>
          {p.use}
          <small>
            <code>{p.file}</code>
          </small>
        </th>
        <td>{new Date(`${p.date}T12:00:00`).toLocaleDateString("de-DE")}</td>
      </tr>
    ));
  return (
    <section id="offene-bilder" className="ideas-panel">
      <h2>
        🖼️ Offene Bilder: {PICTURE_QUEUE.length} {PICTURE_QUEUE.length === 1 ? "wartet" : "warten"} auf Gemini
      </h2>
      <p className="ideas-hint">
        Jedes Bild, um das gebeten wird, kommt erst hierher, und keins wird einzeln gemacht, wo es einen Bogen teilen kann. Eine Anfrage an Gemini kostet gleich
        viel, ob sie ein Bild bringt oder einen Bogen aus zwei oder vier, die danach zerschnitten werden: kleine Bilder kommen auf 1K-Bögen von Lite (≈ 0,004 $
        das Bild), große auf 2K-Bögen von Nano Banana 2.1 (≈ 0,007 $ statt 0,017 $ allein). Darum warten Bilder derselben Art, bis ihr Bogen voll ist; was schon
        so günstig geht wie möglich (ein voller Bogen, ein Geschichtenbild, das nach seinem eigenen ersten Bild gezeichnet wird), macht Claude gleich mit. Ein
        Bogen, der noch wartet, kostet jetzt gemacht eine Anfrage mehr – Claude fragt dann, ob er noch warten soll. Sag z. B. „mach die günstigen Bilder“ oder
        „mach die wartenden Sticker jetzt“.
      </p>
      {PICTURE_QUEUE.length === 0 ? (
        <p>Gerade wartet kein Bild.</p>
      ) : (
        <div className="ideas-overview-scroll">
          <table className="ideas-overview ideas-languages">
            <thead>
              <tr>
                <th>Bild</th>
                <th>Seit</th>
              </tr>
            </thead>
            <tbody>
              {plan.now.length > 0 && (
                <tr>
                  <th colSpan={2}>
                    ✅ Jetzt günstig: {plan.now.length} {plan.now.length === 1 ? "Anfrage" : "Anfragen"} {dollars(plan.now)}
                    <small>Volle Bögen und Bilder, die nie einen Bogen teilen – Warten spart hier nichts.</small>
                  </th>
                </tr>
              )}
              {plan.now.map((sheet) => (
                <Fragment key={sheet.pictures[0].id}>{rows(sheet.pictures)}</Fragment>
              ))}
              {plan.waiting.map((w) => (
                <Fragment key={w.pictures[0].id}>
                  <tr>
                    <th colSpan={2}>
                      ⏳ Bogen {gridName(w.grid)} ({kindOf(w.pictures[0])}): {w.pictures.length} von {w.pictures.length + w.missing} da, es{" "}
                      {w.missing === 1 ? "fehlt eins" : `fehlen ${w.missing}`}
                      <small>Jetzt gemacht: eine Anfrage mehr, {dollars([w])}; die freien Felder werden dann zu Varianten zum Aussuchen.</small>
                    </th>
                  </tr>
                  {rows(w.pictures)}
                </Fragment>
              ))}
              {plan.blocked.length > 0 && (
                <tr>
                  <th colSpan={2}>
                    🔗 Wartet auf sein Vorbild
                    <small>Diese Bilder werden nach einem anderen aus der Liste gezeichnet und kommen danach.</small>
                  </th>
                </tr>
              )}
              {rows(plan.blocked.map((b) => b.picture))}
            </tbody>
          </table>
        </div>
      )}
      <p className="ideas-hint">
        Noch ohne fertigen Auftrag: {mascots} Bilder mit Fuchs und Bär (<a href="#maskottchen">Fuchs & Bär</a>) . Sind sie gewünscht, kommen sie hier in die
        Liste.
      </p>
    </section>
  );
}
