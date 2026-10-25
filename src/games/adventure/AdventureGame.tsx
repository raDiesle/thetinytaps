import { useMemo } from "react";
import { GameShell } from "@/components/GameShell";
import { useLanguages } from "@/components/LanguageSetting";
import { type TargetLanguageId, targetLanguageFor } from "@/content/targetLanguages";
import { useCommonSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { useStoredSettings } from "@/lib/storage";
import { AdventurePlay } from "./AdventurePlay";
import { ADVENTURE_SETTINGS_KEY, type AdventureStoryId, DEFAULT_ADVENTURE_SETTINGS } from "./settings";
import { CLOUD_TRIP } from "./stories/cloudTrip";
import { type Story, storyIn } from "./stories/story";
import { TREASURE_ISLAND } from "./stories/treasureIsland";

/** The stories on the start screen, each a card. */
const STORIES: { id: AdventureStoryId; emoji: string; story: Story }[] = [
  { id: "schatzinsel", emoji: "🏝️", story: TREASURE_ISLAND },
  { id: "wolkenreise", emoji: "☁️", story: CLOUD_TRIP },
];

/** The start screen: no options of its own, read aloud, sounds, music and Tapsi's language come from the home page. */
export function AdventureGame() {
  const [settings, update] = useStoredSettings(ADVENTURE_SETTINGS_KEY, DEFAULT_ADVENTURE_SETTINGS);
  const [common] = useCommonSettings();
  const languages = useLanguages();
  const { touchOnly } = useDevice();
  const at = Math.max(
    0,
    STORIES.findIndex((s) => s.id === settings.story),
  );
  const chosen = STORIES[at].story;
  // „Weiter“ at the end: the next story on the start screen, after the last the first.
  const next = STORIES[(at + 1) % STORIES.length];
  // The play language of the home page. A story not told in it yet (Turkish, Polish, …) is said in English,
  // or else German – never German words with a Spanish voice.
  const wanted = languages.chosen;
  const told = (id: string) => id === "de" || Boolean(chosen.translations?.[id as TargetLanguageId]);
  const language = targetLanguageFor(told(wanted.id) ? wanted.id : told("en") ? "en" : "de");
  // Built once per story and language: the game starts anew when the story changes.
  const story = useMemo(() => storyIn(chosen, language.id), [chosen, language.id]);

  return (
    <GameShell
      title="Bewegungsabenteuer"
      emoji="🏝️"
      modes={STORIES.map((s) => ({ id: s.id, emoji: s.emoji, title: s.story.sequence.title }))}
      mode={settings.story}
      onMode={(id) => update({ story: id as AdventureStoryId })}
      info={
        <>
          <p>
            Der kleine Fuchs Tapsi zeigt jede Bewegung vor, und das Kind macht sie vor dem Bildschirm mit. Die Welt reagiert von selbst im Takt der Bewegung –
            es gibt keine Kamera und kein „falsch“.
          </p>
          <p>
            🏝️ Die Schatzinsel: angeln, paddeln, über eine kleine Brücke hüpfen und mit dem Kopf an Sternkisten stoßen, sich unter einem schaukelnden Baumstamm
            ducken, trommeln, Kokosnüssen ausweichen, Spinnweben wegwedeln, die Truhe am Seil heranziehen und zum Schluss das Gold hochwerfen.
          </p>
          <p>
            ☁️ Die Wolkenreise: Tapsi fliegt auf der kleinen Wolke Wolle in den Himmel – flattern wie ein Vogel, sich unter Spielzeugflugzeugen ducken,
            Luftballons antippen, im Sitzen in die Kurven lehnen und Sterne holen, die Regenwolke hochdrücken, bis die Sonne lacht, und mit den Armen einen
            Regenbogen malen.
          </p>
          <p>
            Am Fuchs leuchtet, worauf es bei der Bewegung ankommt (z.&nbsp;B. nur die Arme an der Kurbel), und eine dunkle Figur mit leuchtendem Rand macht jede
            Bewegung groß mit.
          </p>
          <p>Am besten auf einem großen Bildschirm, mit etwas Platz um das Kind herum (Arme ausbreiten, ein Schritt zur Seite). Niemand muss tippen.</p>
          <p>
            Ob Tapsi spricht und in welcher Sprache, Töne und Musik stellt ⚙️ auf der Startseite für alle Spiele ein.
            {language.id !== wanted.id &&
              ` „${chosen.sequence.title}“ gibt es noch nicht auf ${wanted.label.split(" ")[1]}, Tapsi spricht dort ${language.label.split(" ")[1]}.`}
          </p>
          {!touchOnly && (
            <p>
              Oben links: pausieren und zur vorigen oder nächsten Bewegung springen; ein Bild unten springt zu dieser Bewegung. Mit Tastatur: <kbd>←</kbd>{" "}
              <kbd>→</kbd> und die <kbd>Leertaste</kbd>.
            </p>
          )}
        </>
      }
    >
      {/* Its own music, which plays while music is on for all games. */}
      <AdventurePlay
        key={story.sequence.title}
        story={story}
        language={language}
        settings={common}
        next={{ emoji: next.emoji, name: next.story.sequence.title, onNext: () => update({ story: next.id }) }}
      />
    </GameShell>
  );
}
