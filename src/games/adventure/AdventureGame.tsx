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
              steigen, sich unter einem schaukelnden Ast ducken, Blumen mit den Armen öffnen, Kokosnüssen ausweichen, eine Steintür
              aufdrücken, die Schatztruhe am Seil heranziehen und zum Schluss tanzen. Die Welt reagiert von selbst im Takt der Bewegung –
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
              label="Was sich am Fuchs gerade bewegt, leuchtet (Arme, Beine oder der ganze Körper)"
              checked={settings.glow}
              onChange={(glow) => update({ glow })}
            />
            <Toggle
              label="Umriss-Hilfe: eine leuchtende Figur macht die Bewegung groß mit (zum Ausprobieren erst beim Winken)"
              checked={settings.outline}
              onChange={(outline) => update({ outline })}
            />
            {!touchOnly && (
              <p className="setting-note">
                Mit Tastatur: <kbd>←</kbd> <kbd>→</kbd> springen zur vorigen oder nächsten Bewegung, die <kbd>Leertaste</kbd> pausiert.
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
