import { VOICE_QUEUE } from "@/content/voiceQueue";

/**
 * On the management page, opened from „Stimmen“ in the Claude Cloud status, above the lines still to record: the recordings the user has already asked for, waiting for
 * `bun run paid` in a Claude cloud session, whose network reaches ElevenLabs (content/voiceQueue.ts) – this Mac's Zscaler blocks it.
 */
export function VoiceQueue() {
  return (
    <>
      <h3>Freigegeben: {VOICE_QUEUE.length === 1 ? "1 Aufnahme wartet" : `${VOICE_QUEUE.length} Aufnahmen warten`} auf Claude Cloud</h3>
      <p className="ideas-hint">
        Was du freigibst, schreibt Claude hier ein (Geräusche und Bilder in ihre Listen darunter); eine Claude-Cloud-Sitzung macht mit /paid-queue alles auf
        einmal – <code>bun run paid --dry</code> zeigt vorher, was es kostet.
      </p>
      {VOICE_QUEUE.length > 0 && (
        <div className="ideas-overview-scroll">
          <table className="ideas-overview ideas-languages">
            <thead>
              <tr>
                <th>Aufnahme</th>
                <th>Sprachen</th>
                <th>Seit</th>
              </tr>
            </thead>
            <tbody>
              {VOICE_QUEUE.map((job) => (
                <tr key={job.id} className="ideas-languages-part">
                  <th>
                    {job.why}
                    <small>
                      <code>{job.id}</code>
                      {job.voice ? " · Klon, zweites Konto" : ""}
                    </small>
                  </th>
                  <td>{job.lang.join(", ")}</td>
                  <td>{new Date(`${job.date}T12:00:00`).toLocaleDateString("de-DE")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
