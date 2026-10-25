import { GameShell, type GameMode } from "@/components/GameShell";
import { SettingsGroup } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { FEELINGS } from "./bear";
import { BearPlay } from "./BearPlay";
import { SITUATIONS } from "./kita";
import { KitaPlay } from "./KitaPlay";
import type { Place } from "./places";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY, type FeelingsSettings } from "./settings";
import "./feelings.css";

/** "All in turn" comes first and across the whole row. */
const ALL: GameMode = { id: "all", emoji: "🌈", title: "Alle", featured: true };

/** The start screen of one place: all its feelings or stories in turn, or just one. */
export function FeelingsGame({ place }: { place: Place }) {
  const [settings, update] = useGameSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);
  const home = place.id === "zuhause";
  const modes = [ALL, ...(home ? FEELINGS : SITUATIONS).map(({ id, emoji, title }) => ({ id, emoji, title }))];

  return (
    <GameShell
      title={place.title}
      emoji={place.emoji}
      modes={modes}
      mode={home ? settings.feeling : settings.situation}
      onMode={(id) => update(home ? { feeling: id as FeelingsSettings["feeling"] } : { situation: id as FeelingsSettings["situation"] })}
      backHref="/gefuehle/"
      backLabel="Gefühle"
      settings={
        <>
          <SettingsGroup title={`${place.emoji} ${place.title}`}>
            {home ? (
              <p className="setting-note">
                Der kleine Bär ist traurig, wütend, müde oder hat Angst. Drei Karten zeigen, was ihm hilft – umarmen, Teddy geben, stampfen, Licht an … Sind
                alle drei getan, ist er wieder froh.
              </p>
            ) : (
              <p className="setting-note">
                Kleine Geschichten: Jemand schubst, tritt oder nimmt etwas weg, die Rutsche ist voll, ein anderes Kind hat das tolle Spielzeug – oder der kleine
                Bär ist selbst wütend. Bei jedem Schritt tippt das Kind, was der Bär tun kann: laut „Stopp! Nein!“ sagen, weggehen, Hilfe holen, fragen, warten,
                tauschen.
              </p>
            )}
            <p className="setting-note">
              Zwischen den guten Ideen liegt immer eine nicht so gute (z.&nbsp;B. zurückschubsen, Licht aus). Tippt das Kind darauf, erscheint sie groß mit
              rotem Kreuz und es wird erklärt, warum. Die guten Ideen bekommen einen grünen Haken.
            </p>
            <p className="setting-note">
              Unter jedem Bild steht klein, was es zeigt – zum Mitlesen und Erzählen für Erwachsene. Kinder wählen nur nach dem Bild.
            </p>
          </SettingsGroup>

          {!settings.speech && (
            <p className="setting-note">Mit Vorlesen (auf der Startseite) wird die Geschichte erzählt, sonst erzählen Erwachsene sie anhand der Bilder.</p>
          )}
        </>
      }
    >
      {home ? <BearPlay settings={settings} /> : <KitaPlay settings={settings} />}
    </GameShell>
  );
}
