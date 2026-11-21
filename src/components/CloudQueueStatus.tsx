import { PICTURE_QUEUE } from "@/content/pictureQueue";
import { costOf, planQueue } from "@/content/pictureQueuePlan";
import { VOICE_QUEUE } from "@/content/voiceQueue";

/**
 * The first thing on the management page (user request, 21 November 2026): whether anything paid is open that a Claude
 * cloud session has to make – recordings of `voiceQueue.ts` and the pictures `bun run image queue` would make now –
 * since this Mac's Zscaler blocks ElevenLabs and Gemini; `/paid-queue` there makes it (a scheduled task would, once
 * the organization allows them). Pictures that still wait for partners on their sheet are named but are not open.
 */
export function CloudQueueStatus() {
  const plan = planQueue(PICTURE_QUEUE);
  const pictures = plan.now.reduce((sum, sheet) => sum + sheet.pictures.length, 0);
  const recordings = VOICE_QUEUE.length;
  const waiting = PICTURE_QUEUE.length - pictures;
  const open = recordings > 0 || pictures > 0;
  return (
    <section id="claude-cloud" className={`ideas-panel ideas-cloud${open ? " ideas-cloud-open" : ""}`}>
      <h2>{open ? "☁️ Offen für Claude Cloud" : "✅ Nichts offen für Claude Cloud"}</h2>
      {open ? (
        <ul>
          {recordings > 0 && (
            <li>
              <a href="#stimmen">{recordings === 1 ? "1 Aufnahme" : `${recordings} Aufnahmen`}</a> für ElevenLabs
            </li>
          )}
          {pictures > 0 && (
            <li>
              <a href="#offene-bilder">{pictures === 1 ? "1 Bild" : `${pictures} Bilder`}</a> für Gemini, ≈ {costOf(plan.now).toFixed(3).replace(".", ",")} $
            </li>
          )}
        </ul>
      ) : (
        <p>Keine Aufnahme und kein Bild, das jetzt gemacht werden müsste.</p>
      )}
      <p className="ideas-hint">
        Dieser Mac erreicht ElevenLabs und Gemini nicht (Zscaler). Ist der Stand auf <code>main</code> gepusht, in einer Claude-Cloud-Sitzung (claude.ai/code){" "}
        <code>/paid-queue</code> sagen: sie macht alles Offene, nimmt es aus den Listen und führt es in <code>main</code> zusammen. Von selbst jeden Abend geht
        es erst, wenn geplante Aufgaben für die Organisation eingeschaltet sind (Organisationseinstellungen → Capabilities).
        {waiting > 0 &&
          (waiting === 1
            ? " Ein Bild wartet noch auf Partner für seinen Bogen und zählt nicht als offen."
            : ` ${waiting} Bilder warten noch auf Partner für ihren Bogen und zählen nicht als offen.`)}
      </p>
    </section>
  );
}
