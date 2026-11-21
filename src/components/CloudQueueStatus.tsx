import { lazy, type ReactNode, Suspense, useState } from "react";
import { PICTURE_QUEUE } from "@/content/pictureQueue";
import { costOf, planQueue } from "@/content/pictureQueuePlan";
import { SOUND_QUEUE } from "@/content/soundQueue";
import { VOICE_QUEUE } from "@/content/voiceQueue";
import { PictureQueue } from "./PictureQueue";
import { SoundQueue } from "./SoundQueue";
import { VoiceQueue } from "./VoiceQueue";

/** The lines still to record: loaded only once „Stimmen“ is opened, since it reads the data of every game. */
const VoiceList = lazy(() => import("./VoiceList").then((module) => ({ default: module.VoiceList })));

/**
 * The first thing on the management page (user request, 21 November 2026): whether anything paid is open that a Claude
 * cloud session has to make – recordings of `voiceQueue.ts`, sound effects of `soundQueue.ts` and the pictures
 * `bun run image queue` would make now –
 * since this Mac's Zscaler blocks ElevenLabs and Gemini; `/paid-queue` there makes it (a scheduled task would, once
 * the organization allows them). Pictures that still wait for partners on their sheet are named but are not open.
 *
 * Each queue is one short line here that opens to its whole list (user request, 21 November 2026: the lists of
 * „Stimmen“, „Geräusche“ and „Offene Bilder“ stood as long sections further down; now they are folded away up here
 * and have no section of their own).
 */
export function CloudQueueStatus() {
  const plan = planQueue(PICTURE_QUEUE);
  const pictures = plan.now.reduce((sum, sheet) => sum + sheet.pictures.length, 0);
  const recordings = VOICE_QUEUE.length;
  const sounds = SOUND_QUEUE.length;
  const waiting = PICTURE_QUEUE.length - pictures;
  const open = recordings > 0 || sounds > 0 || pictures > 0;
  const [voiceOpened, setVoiceOpened] = useState(false);
  return (
    <section id="claude-cloud" className={`ideas-panel ideas-cloud${open ? " ideas-cloud-open" : ""}`}>
      <h2>{open ? "☁️ Offen für Claude Cloud" : "✅ Nichts offen für Claude Cloud"}</h2>
      <QueueLine
        id="stimmen"
        onOpen={() => setVoiceOpened(true)}
        line={
          <>
            🎙️ Stimmen: {recordings === 0 ? "keine Aufnahme" : recordings === 1 ? "1 Aufnahme" : `${recordings} Aufnahmen`} für ElevenLabs freigegeben
            <small> – und alle Sätze, die noch keine Aufnahme haben</small>
          </>
        }
      >
        <VoiceQueue />
        {voiceOpened && (
          <Suspense fallback={<p className="ideas-hint">Die Sätze aller Spiele werden gelesen …</p>}>
            <VoiceList />
          </Suspense>
        )}
      </QueueLine>
      <QueueLine id="geraeusche" line={<>🔊 Geräusche: {sounds === 0 ? "keins" : sounds === 1 ? "1 Geräusch" : `${sounds} Geräusche`} für ElevenLabs</>}>
        <SoundQueue />
      </QueueLine>
      <QueueLine
        id="offene-bilder"
        line={
          <>
            🖼️ Offene Bilder: {pictures === 0 ? "keins" : pictures === 1 ? "1 Bild" : `${pictures} Bilder`} jetzt für Gemini
            {pictures > 0 && <>, ≈ {costOf(plan.now).toFixed(3).replace(".", ",")} $</>}
            {waiting > 0 && <small> – {waiting === 1 ? "1 weiteres wartet" : `${waiting} weitere warten`} auf Partner für den Bogen</small>}
          </>
        }
      >
        <PictureQueue />
      </QueueLine>
      <p className="ideas-hint">
        Dieser Mac erreicht ElevenLabs und Gemini nicht (Zscaler). Ist der Stand auf <code>main</code> gepusht, in einer Claude-Cloud-Sitzung (claude.ai/code){" "}
        <code>/paid-queue</code> sagen: sie macht alles Offene, prüft es, baut es ein, nimmt es aus den Listen und führt es in <code>main</code> zusammen – nur
        dort, nicht mehr als Skript auf einem anderen Rechner. Von selbst jeden Abend geht es erst, wenn geplante Aufgaben für die Organisation eingeschaltet
        sind (Organisationseinstellungen → Capabilities). Bilder, die noch auf Partner für ihren Bogen warten, zählen nicht als offen.
      </p>
    </section>
  );
}

/** One queue as a single line, opened to its whole list by a tap (and by a link to its id, see `openPlace`). */
function QueueLine({ id, line, onOpen, children }: { id: string; line: ReactNode; onOpen?: () => void; children: ReactNode }) {
  return (
    <details id={id} className="ideas-cloud-queue" onToggle={(event) => event.currentTarget.open && onOpen?.()}>
      <summary>{line}</summary>
      <div className="ideas-cloud-list">{children}</div>
    </details>
  );
}
