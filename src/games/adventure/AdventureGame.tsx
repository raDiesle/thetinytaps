import { GameShell } from "@/components/GameShell";
import { SettingsGroup, Toggle } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useCommonSettings, useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { AdventurePlay } from "./AdventurePlay";
import { ADVENTURE_SETTINGS_KEY, type AdventureStoryId, carryOverAdventureSettings, DEFAULT_ADVENTURE_SETTINGS } from "./settings";
import { CLOUD_TRIP } from "./stories/cloudTrip";
import type { Story } from "./stories/story";
import { TREASURE_ISLAND } from "./stories/treasureIsland";

carryOverAdventureSettings();

/** The stories on the start screen, each a card. */
const STORIES: { id: AdventureStoryId; emoji: string; story: Story }[] = [
  { id: "schatzinsel", emoji: "🏝️", story: TREASURE_ISLAND },
  { id: "wolkenreise", emoji: "☁️", story: CLOUD_TRIP },
];

export function AdventureGame() {
  const [settings, update] = useGameSettings(ADVENTURE_SETTINGS_KEY, DEFAULT_ADVENTURE_SETTINGS);
  const [common] = useCommonSettings();
  const { touchOnly } = useDevice();
  const story = (STORIES.find((s) => s.id === settings.story) ?? STORIES[0]).story;

  return (
    <GameShell
      title="Bewegungsabenteuer"
      emoji="🏝️"
      modes={STORIES.map((s) => ({ id: s.id, emoji: s.emoji, title: s.story.sequence.title }))}
      mode={settings.story}
      onMode={(id) => update({ story: id as AdventureStoryId })}
      settings={
        <SettingsGroup title="Bewegungsabenteuer">
          <p className="setting-note">
            Der kleine Fuchs Tapsi zeigt jede Bewegung vor, und das Kind macht sie vor dem Bildschirm mit. Die Welt reagiert von selbst im Takt der Bewegung –
            es gibt keine Kamera und kein „falsch“.
          </p>
          <p className="setting-note">
            🏝️ Die Schatzinsel: angeln, paddeln, über eine kleine Brücke hüpfen und mit dem Kopf an Sternkisten stoßen, sich unter einem schaukelnden Baumstamm
            ducken, trommeln, Kokosnüssen ausweichen, Spinnweben wegwedeln, die Truhe am Seil heranziehen und zum Schluss das Gold hochwerfen.
          </p>
          <p className="setting-note">
            ☁️ Die Wolkenreise: Tapsi fliegt auf der kleinen Wolke Wolle in den Himmel – flattern wie ein Vogel, sich unter Spielzeugflugzeugen ducken,
            Luftballons antippen, im Sitzen in die Kurven lehnen und Sterne holen, die Regenwolke hochdrücken, bis die Sonne lacht, und mit den Armen einen
            Regenbogen malen.
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
      <AdventurePlay story={story} speechLang={de.speechLang} settings={{ ...settings, music: settings.music && common.music }} />
    </GameShell>
  );
}
