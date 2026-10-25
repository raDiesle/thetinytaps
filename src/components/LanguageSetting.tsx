import { Choice, SettingsGroup } from "@/components/SettingControls";
import { LANGUAGES, languageFor, type LanguageId } from "@/content/languages";
import { TARGET_LANGUAGES, type TargetLanguageId } from "@/content/targetLanguages";
import { useStoredSettings } from "@/lib/storage";

/** A play language: one with a pack for letters and words, or one only the Bewegungsabenteuer speaks so far. */
export type PlayLanguageId = LanguageId | TargetLanguageId;

/** The play languages to choose from: those with a pack first, then the wanted ones without one. */
const PLAY_LANGUAGES: { id: PlayLanguageId; label: string }[] = [...LANGUAGES, ...TARGET_LANGUAGES.filter((t) => !LANGUAGES.some((l) => l.id === t.id))].map(
  ({ id, label }) => ({ id, label }),
);

export interface LanguageSettings {
  /** The language the child plays in; a game that doesn't speak it plays in German. */
  language: PlayLanguageId;
  /** Optional second language: every word is also shown and said in it, „Bär – bear“. */
  second: LanguageId | "none";
}

const DEFAULT_LANGUAGE_SETTINGS: LanguageSettings = { language: "de", second: "none" };

// Shared by the letters and words games and the Bewegungsabenteuer, so parents choose the language once.
const LANGUAGE_SETTINGS_KEY = "tinytaps.language.v1";

/** The chosen language pack, the second one (or null) and the settings to change them. */
export function useLanguages() {
  const [settings, update] = useStoredSettings(LANGUAGE_SETTINGS_KEY, DEFAULT_LANGUAGE_SETTINGS);
  const main = languageFor(settings.language);
  const second = settings.second === "none" || settings.second === main.id ? null : languageFor(settings.second);
  return { settings, update, language: main, second };
}

export function LanguageSetting({ settings, update }: { settings: LanguageSettings; update: (patch: Partial<LanguageSettings>) => void }) {
  const chosen = PLAY_LANGUAGES.find((l) => l.id === settings.language) ?? PLAY_LANGUAGES[0];
  // The pack letters and words play in: German where the chosen language has none.
  const main = languageFor(chosen.id).id;
  return (
    <SettingsGroup title="Sprache">
      <Choice<PlayLanguageId>
        label="Spielsprache"
        value={chosen.id}
        onChange={(language) => update({ language, second: language === settings.second ? "none" : settings.second })}
        options={PLAY_LANGUAGES.map((l) => ({ value: l.id, label: l.label }))}
      />
      {main !== chosen.id && (
        <p className="setting-note">
          Auf {chosen.label.split(" ")[1]} spricht bisher nur Tapsi im Bewegungsabenteuer; „Buchstaben &amp; Zahlen“ und „Wörter tippen“ bleiben Deutsch.
        </p>
      )}
      <Choice<LanguageId | "none">
        label="Zweite Sprache"
        value={settings.second === main ? "none" : settings.second}
        onChange={(second) => update({ second })}
        options={[{ value: "none", label: "Aus" }, ...LANGUAGES.filter((l) => l.id !== main).map((l) => ({ value: l.id, label: l.label }))]}
      />
      {settings.second !== "none" && settings.second !== main && (
        <p className="setting-note">Unter jedem Wort steht es auch in der zweiten Sprache und wird danach vorgelesen: „Bär – bear“.</p>
      )}
    </SettingsGroup>
  );
}
