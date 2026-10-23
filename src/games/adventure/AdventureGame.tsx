import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { de } from "@/content/de";
import { useDevice } from "@/lib/device";
import { useStoredSettings } from "@/lib/storage";
import { AdventurePlay } from "./AdventurePlay";
import { ADVENTURE_SETTINGS_KEY, DEFAULT_ADVENTURE_SETTINGS, type AdventurePace } from "./settings";
import { TREASURE_ISLAND } from "./stories/treasureIsland";

const minutes = (seconds: number) => Math.round(seconds / 30) / 2;

export function AdventureGame() {
  const [settings, update] = useStoredSettings(ADVENTURE_SETTINGS_KEY, DEFAULT_ADVENTURE_SETTINGS);
  const { touchOnly } = useDevice();
  const story = TREASURE_ISLAND;
  const seconds = story.sequence.steps.reduce((sum, s) => sum + s.seconds, 0);

  return (
    <GameShell
      title="Bewegungsabenteuer"
      emoji="🏝️"
      settings={
        <>
          <SettingsGroup title={`Die Schatzinsel (etwa ${minutes(seconds)} Minuten)`}>
            <p className="setting-note">
              Der kleine Fuchs Tapsi zeigt jede Bewegung vor, und das Kind macht sie vor dem Bildschirm mit: Paddeln, von Stein zu Stein
              springen und mit dem Kopf an Sternkisten stoßen, sich unter einem schaukelnden Ast ducken, Blumen mit den Armen öffnen,
              Kokosnüssen ausweichen, Spinnweben wegwedeln, die Schatztruhe am Seil heranziehen und zum Schluss tanzen. Die Welt reagiert von selbst im Takt der Bewegung –
              es gibt keine Kamera und kein „falsch“.
            </p>
            <p className="setting-note">
              Am besten auf einem großen Bildschirm, mit etwas Platz um das Kind herum (Arme ausbreiten, ein Schritt zur Seite). Niemand
              muss tippen.
            </p>
            <Choice<AdventurePace>
              label="Tempo"
              value={settings.pace}
              onChange={(pace) => update({ pace })}
              options={[
                { value: "normal", label: "Normal" },
                { value: "calm", label: "🐢 Ruhiger (mehr Zeit)" },
              ]}
            />
            <Toggle
              label="Am Fuchs leuchtet, worauf es bei der Bewegung ankommt (z. B. nur die Arme an der Kurbel)"
              checked={settings.glow}
              onChange={(glow) => update({ glow })}
            />
            <Toggle
              label="Umriss-Hilfe: eine dunkle Figur mit leuchtendem Rand macht jede Bewegung groß mit"
              checked={settings.outline}
              onChange={(outline) => update({ outline })}
            />
            {!touchOnly && (
              <p className="setting-note">
                Oben links: pausieren und zur vorigen oder nächsten Bewegung springen; ein Bild unten springt zu dieser Bewegung. Mit Tastatur: <kbd>←</kbd> <kbd>→</kbd> und die <kbd>Leertaste</kbd>.
              </p>
            )}
          </SettingsGroup>

          <SettingsGroup title="Ton">
            <Toggle label="Tapsi spricht („Duck dich!“)" checked={settings.speech} onChange={(speech) => update({ speech })} />
            {settings.speech && <VoiceSetting lang={de.speechLang} sample="Ahoi! Ich bin Tapsi. Komm, wir suchen den Schatz!" />}
            <Toggle label="Musik" checked={settings.music} onChange={(music) => update({ music })} />
            <Toggle label="Geräusche (Platschen, Rauschen, Glitzern)" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
          </SettingsGroup>
        </>
      }
    >
      <AdventurePlay story={story} speechLang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
