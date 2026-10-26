import { GameShell } from "@/components/GameShell";
import { useLanguages } from "@/components/LanguageSetting";
import { SettingsGroup, Toggle } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { SUNG_LANGUAGES, sungLanguage } from "./music";
import { DEFAULT_TEETH_SETTINGS, TEETH_SETTINGS_KEY } from "./settings";
import { KAI } from "./steps";
import { SUNG_LABELS } from "./sung";
import { TeethPlay } from "./TeethPlay";

/** "🇩🇪 Deutsch oder 🇬🇧 Englisch": the languages the song is sung in. */
const sungNames = new Intl.ListFormat("de", { type: "disjunction" }).format(SUNG_LANGUAGES.map((lang) => SUNG_LABELS[lang] ?? lang));

export function TeethGame() {
  const [settings, update] = useGameSettings(TEETH_SETTINGS_KEY, DEFAULT_TEETH_SETTINGS);
  // The song sings in the language the app's texts are in, so there is nothing to choose here.
  const sungIn = sungLanguage(useLanguages().language.id);
  const { touchOnly } = useDevice();

  return (
    <GameShell
      title="Zähne putzen"
      emoji="🦷"
      settings={
        <SettingsGroup title="Putzen">
          <Toggle label="🪥 Vorher: Bürste holen, Zahnpasta drauf" checked={settings.prep} onChange={(prep) => update({ prep })} />
          <Toggle label="⭐ Wochenbild: ein Stern für jedes Putzen" checked={settings.week} onChange={(week) => update({ week })} />
          <p className="setting-note">
            🎵 Das Zahnputzlied singt zu jedem Schritt, was gerade dran ist, und das Putzen dauert so lange wie das Lied, gut 2 Minuten. Es spielt immer, auch
            wenn die Musik für alle Spiele aus ist, und singt in der Sprache von der Startseite: {sungNames}, sonst Deutsch. Mit „Vorlesen“ (Startseite) wird
            vorher angesagt, was kommt.
          </p>
          <p className="setting-note">
            Gerät hinstellen und los: Niemand muss tippen. Geputzt wird in sieben Schritten nach KAI ({KAI}). Das Bild zeigt jedes Mal, ob der Mund weit auf ist
            oder die Zähne zusammen sind (Pfeile an den Lippen zeigen, wann er auf- oder zugeht) und welche Zähne gerade dran sind. Auf allen noch nicht
            geputzten Zähnen sitzen Zuckermonster, die beim Putzen nach und nach verschwinden. Der Bildschirm bleibt dabei an.
          </p>
          <p className="setting-note">
            Bis 14 Uhr ist morgens: Die Sonne geht auf und am Kinn kleben Frühstückskrümel. Danach ist abends: Der Mond scheint, der Ärmel ist ein Schlafanzug
            und zum Schluss heißt es „Gute Nacht“.
          </p>
          <p className="setting-note">
            Zahnärzte empfehlen: zweimal täglich Zahnpasta mit Fluorid (1000 ppm), unter 2 Jahren reiskorngroß, ab 2 Jahren erbsengroß. Danach ausspucken, nicht
            nachspülen. Bis ins Grundschulalter putzen Eltern nach.
          </p>
          <p className="setting-note">
            Unten neben dem Fortschrittsbalken pausiert ⏸️ das Putzen. Tippen oder Ziehen auf dem Balken springt an diese Stelle.
            {!touchOnly && (
              <>
                {" "}
                Mit Tastatur: <kbd>←</kbd> <kbd>→</kbd> springen zum vorigen oder nächsten Schritt, die <kbd>Leertaste</kbd> pausiert.
              </>
            )}
          </p>
        </SettingsGroup>
      }
    >
      <TeethPlay speechLang={de.speechLang} sungIn={sungIn} settings={settings} />
    </GameShell>
  );
}
