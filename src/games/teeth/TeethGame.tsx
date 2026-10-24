import { GameShell } from "@/components/GameShell";
import { SettingsGroup, Toggle } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { DEFAULT_TEETH_SETTINGS, TEETH_SETTINGS_KEY, type BrushMinutes } from "./settings";
import { KAI } from "./steps";
import { TeethPlay } from "./TeethPlay";

export function TeethGame() {
  const [shared, update, stored] = useGameSettings(TEETH_SETTINGS_KEY, DEFAULT_TEETH_SETTINGS);
  // The spoken hints are the point here, so they have their own switch.
  const settings = { ...shared, speech: stored.speech };
  const { touchOnly } = useDevice();

  return (
    <GameShell
      title="Zähne putzen"
      emoji="🦷"
      modes={[
        { id: "1", emoji: "🪥", title: "1 Minute", text: "Kurz – für den Anfang." },
        { id: "2", emoji: "🦷", title: "2 Minuten", text: "So empfehlen es Zahnärzte." },
        { id: "3", emoji: "✨", title: "3 Minuten", text: "Ganz gründlich." },
      ]}
      mode={settings.minutes}
      onMode={(minutes) => update({ minutes: minutes as BrushMinutes })}
      settings={
        <>
          <SettingsGroup title="Putzen">
            <Toggle
              label="Vorher zeigen: Zahnbürste holen, Zahnpasta drauf"
              checked={settings.prep}
              onChange={(prep) => update({ prep })}
            />
            <Toggle
              label="Ansagen vorlesen („Mund weit auf!“) – auch wenn „Vorlesen“ auf der Startseite aus ist"
              checked={settings.speech}
              onChange={(speech) => update({ speech })}
            />
            <p className="setting-note">
              Gerät hinstellen und los: Niemand muss tippen. Geputzt wird in sieben Schritten nach KAI ({KAI}). Das Bild zeigt jedes
              Mal, ob der Mund weit auf ist oder die Zähne zusammen sind (Pfeile an den Lippen zeigen, wann er auf- oder zugeht) und
              welche Zähne gerade dran sind. Auf allen noch nicht geputzten Zähnen sitzen Zuckermonster, die beim Putzen nach und
              nach verschwinden. Der Bildschirm bleibt dabei an.
            </p>
            <p className="setting-note">
              Zahnärzte empfehlen: zweimal täglich Zahnpasta mit Fluorid (1000 ppm), unter 2 Jahren reiskorngroß, ab 2 Jahren
              erbsengroß. Danach ausspucken, nicht nachspülen. Bis ins Grundschulalter putzen Eltern nach.
            </p>
            {!touchOnly && (
              <p className="setting-note">
                Mit Tastatur: <kbd>←</kbd> <kbd>→</kbd> springen zum vorigen oder nächsten Schritt, die <kbd>Leertaste</kbd> pausiert.
              </p>
            )}
          </SettingsGroup>
        </>
      }
    >
      <TeethPlay speechLang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
