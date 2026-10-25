import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useCommonSettings, useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { DEFAULT_TEETH_SETTINGS, TEETH_SETTINGS_KEY, type BrushMinutes } from "./settings";
import { KAI } from "./steps";
import { TeethPlay } from "./TeethPlay";

export function TeethGame() {
  const [shared, update, stored] = useGameSettings(TEETH_SETTINGS_KEY, DEFAULT_TEETH_SETTINGS);
  // The spoken hints have their own switch here, independent of "Vorlesen" on the home page.
  const settings = { ...shared, speech: stored.speech };
  const [common] = useCommonSettings();
  const { touchOnly } = useDevice();

  return (
    <GameShell
      title="Zähne putzen"
      emoji="🦷"
      modes={[
        { id: "1", emoji: "🪥", title: "1 Minute" },
        { id: "2", emoji: "🦷", title: "2 Minuten" },
        { id: "3", emoji: "✨", title: "3 Minuten" },
      ]}
      mode={settings.minutes}
      onMode={(minutes) => update({ minutes: minutes as BrushMinutes })}
      info={
        <>
          <p>
            Gerät hinstellen und los: Niemand muss tippen. Geputzt wird in sieben Schritten nach KAI ({KAI}). Das Bild zeigt jedes Mal, ob der Mund weit auf ist
            oder die Zähne zusammen sind (Pfeile an den Lippen zeigen, wann er auf- oder zugeht) und welche Zähne gerade dran sind. Auf allen noch nicht
            geputzten Zähnen sitzen Zuckermonster, die beim Putzen nach und nach verschwinden. Der Bildschirm bleibt dabei an.
          </p>
          <p>
            Morgens geht die Sonne auf und am Kinn kleben Frühstückskrümel; abends scheint der Mond, der Ärmel ist ein Schlafanzug und zum Schluss heißt es
            „Gute Nacht“. Nach der Uhr ist bis 14 Uhr morgens.
          </p>
          <p>
            Zahnärzte empfehlen: zweimal täglich Zahnpasta mit Fluorid (1000 ppm), unter 2 Jahren reiskorngroß, ab 2 Jahren erbsengroß. Danach ausspucken, nicht
            nachspülen. Bis ins Grundschulalter putzen Eltern nach.
          </p>
          <p>
            Unten neben dem Fortschrittsbalken pausiert ⏸️ das Putzen. Tippen oder Ziehen auf dem Balken springt an diese Stelle.
            {!touchOnly && (
              <>
                {" "}
                Mit Tastatur: <kbd>←</kbd> <kbd>→</kbd> springen zum vorigen oder nächsten Schritt, die <kbd>Leertaste</kbd> pausiert.
              </>
            )}
          </p>
        </>
      }
      settings={
        <SettingsGroup title="Putzen">
          <Choice
            label="Tageszeit"
            value={settings.daytime}
            options={[
              { value: "auto", label: "🕑 Nach der Uhr" },
              { value: "morning", label: "☀️ Morgens" },
              { value: "evening", label: "🌙 Abends" },
            ]}
            onChange={(daytime) => update({ daytime })}
          />
          <Toggle label="Vorher zeigen: Zahnbürste holen, Zahnpasta drauf" checked={settings.prep} onChange={(prep) => update({ prep })} />
          <Toggle
            label="Ansagen vorlesen („Mund weit auf!“) – auch wenn „Vorlesen“ auf der Startseite aus ist"
            checked={settings.speech}
            onChange={(speech) => update({ speech })}
          />
          <Toggle label="Wochenbild am Ende: ein Stern für jedes Putzen morgens und abends" checked={settings.week} onChange={(week) => update({ week })} />
          <Toggle label="Musik beim Putzen" checked={settings.music} onChange={(music) => update({ music })} />
          {!common.music && <p className="setting-note">Die Musik ist für alle Spiele aus (⚙️ auf der Startseite).</p>}
        </SettingsGroup>
      }
    >
      {/* Its own song, which plays only while music is on for all games too. */}
      <TeethPlay speechLang={de.speechLang} settings={{ ...settings, music: settings.music && common.music }} />
    </GameShell>
  );
}
