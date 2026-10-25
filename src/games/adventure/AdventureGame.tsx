import { useMemo } from "react";
import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { TARGET_LANGUAGES, targetLanguageFor } from "@/content/targetLanguages";
import { useCommonSettings, useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { AdventurePlay } from "./AdventurePlay";
import { ADVENTURE_SETTINGS_KEY, carryOverAdventureSettings, DEFAULT_ADVENTURE_SETTINGS } from "./settings";
import { storyIn } from "./stories/story";
import { TREASURE_ISLAND } from "./stories/treasureIsland";

carryOverAdventureSettings();

export function AdventureGame() {
  const [settings, update] = useGameSettings(ADVENTURE_SETTINGS_KEY, DEFAULT_ADVENTURE_SETTINGS);
  const [common] = useCommonSettings();
  const { touchOnly } = useDevice();
  const language = targetLanguageFor(settings.language);
  // Built once per language: the game starts anew when the story changes.
  const story = useMemo(() => storyIn(TREASURE_ISLAND, language.id), [language.id]);

  return (
    <GameShell
      title="Bewegungsabenteuer"
      emoji="🏝️"
      modes={[{ id: "normal", emoji: "🏝️", title: "Die Schatzinsel" }]}
      settings={
        <SettingsGroup title="Die Schatzinsel">
          <p className="setting-note">
            Der kleine Fuchs Tapsi zeigt jede Bewegung vor, und das Kind macht sie vor dem Bildschirm mit: Paddeln, über eine kleine Brücke hüpfen und mit dem
            Kopf an Sternkisten stoßen, sich unter einem schaukelnden Ast ducken, Blumen mit den Armen öffnen, Kokosnüssen ausweichen, Spinnweben wegwedeln, die
            Schatztruhe am Seil heranziehen und zum Schluss Stopptanz am Strand: Hört die Musik auf, frieren Tapsi, der Papagei und die Krebse ein. Die Welt
            reagiert von selbst im Takt der Bewegung – es gibt keine Kamera und kein „falsch“.
          </p>
          <p className="setting-note">
            Am besten auf einem großen Bildschirm, mit etwas Platz um das Kind herum (Arme ausbreiten, ein Schritt zur Seite). Niemand muss tippen.
          </p>
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
          <Choice
            label="Tapsi spricht"
            value={language.id}
            options={TARGET_LANGUAGES.map((l) => ({ value: l.id, label: l.label }))}
            onChange={(id) => update({ language: id })}
          />
          {!settings.speech && <p className="setting-note">Tapsi spricht nur, wenn „Vorlesen“ auf der Startseite an ist.</p>}
          <Toggle label="Musik" checked={settings.music} onChange={(music) => update({ music })} />
          {!common.music && <p className="setting-note">Die Musik ist für alle Spiele aus (⚙️ auf der Startseite).</p>}
          {!touchOnly && (
            <p className="setting-note">
              Oben links: pausieren und zur vorigen oder nächsten Bewegung springen; ein Bild unten springt zu dieser Bewegung. Mit Tastatur: <kbd>←</kbd>{" "}
              <kbd>→</kbd> und die <kbd>Leertaste</kbd>.
            </p>
          )}
        </SettingsGroup>
      }
    >
      {/* Its own music, which plays only while music is on for all games too. */}
      <AdventurePlay story={story} language={language} settings={{ ...settings, music: settings.music && common.music }} />
    </GameShell>
  );
}
