import { Choice, SettingsGroup } from "@/components/SettingControls";
import { LANGUAGES, languageFor, type LanguageId } from "@/content/languages";
import { playLanguage } from "@/lib/locale";
import { useStoredSettings } from "@/lib/storage";

export interface LanguageSettings {
  /** The language the child plays in. */
  language: LanguageId;
  /** Optional second language: every word is also shown and said in it, „Bär – bear“. */
  second: LanguageId | "none";
}

// Until the parents choose, the child plays in the browser's language (English when there is none of it).
const DEFAULT_LANGUAGE_SETTINGS: LanguageSettings = { language: playLanguage(LANGUAGES.map((l) => l.id)), second: "none" };

// Shared by the letters and words games, so parents choose the language once.
const LANGUAGE_SETTINGS_KEY = "tinytaps.language.v1";

/** The chosen language pack, the second one (or null) and the settings to change them. */
export function useLanguages() {
  const [settings, update] = useStoredSettings(LANGUAGE_SETTINGS_KEY, DEFAULT_LANGUAGE_SETTINGS);
  const main = languageFor(settings.language);
  const second = settings.second === "none" || settings.second === main.id ? null : languageFor(settings.second);
  return { settings, update, language: main, second };
}

export function LanguageSetting({ settings, update }: { settings: LanguageSettings; update: (patch: Partial<LanguageSettings>) => void }) {
  const main = languageFor(settings.language).id;
  return (
    <SettingsGroup title="Sprache">
      <Choice<LanguageId>
        label="Spielsprache"
        value={main}
        onChange={(language) => update({ language, second: language === settings.second ? "none" : settings.second })}
        options={LANGUAGES.map((l) => ({ value: l.id, label: l.label }))}
      />
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
