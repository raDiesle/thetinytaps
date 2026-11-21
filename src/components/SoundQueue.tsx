import { SOUND_QUEUE } from "@/content/soundQueue";

/**
 * On the management page, opened from „Geräusche“ in the Claude Cloud status: the sound effects the user has approved,
 * waiting for ElevenLabs in a Claude cloud session (content/soundQueue.ts).
 */
export function SoundQueue() {
  if (SOUND_QUEUE.length === 0) return <p>Gerade wartet kein Geräusch.</p>;
  return (
    <div className="ideas-overview-scroll">
      <table className="ideas-overview ideas-languages">
        <thead>
          <tr>
            <th>Geräusch</th>
            <th>Sekunden</th>
            <th>Seit</th>
          </tr>
        </thead>
        <tbody>
          {SOUND_QUEUE.map((sound) => (
            <tr key={sound.id} className="ideas-languages-part">
              <th>
                {sound.use}
                <small>
                  <code>{sound.file}</code>
                </small>
              </th>
              <td>{String(sound.seconds).replace(".", ",")}</td>
              <td>{new Date(`${sound.date}T12:00:00`).toLocaleDateString("de-DE")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
