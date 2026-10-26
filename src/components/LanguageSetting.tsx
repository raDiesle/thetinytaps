import { Choice, SettingsGroup } from "@/components/SettingControls";
import { LANGUAGES, languageFor, type LanguageId, languageName } from "@/content/languages";
import { useAppLanguage, useT } from "@/lib/language";
import { useStoredSettings } from "@/lib/storage";

export interface LanguageSettings {
  /** The language the child plays in; "app": the app's language (German or Russian), until the parents pick one here. */
  language: LanguageId | "app";
  /** Optional second language: every word is also shown and said in it, „Bär – bear“. */
  second: LanguageId | "none";
}

// "app" by default, so a family that switched the whole app to Russian plays Russian
// letters and words without choosing again; a language picked here stays, whatever the app speaks.
const DEFAULT_LANGUAGE_SETTINGS: LanguageSettings = { language: "app", second: "none" };

// Shared by the letters and words games, so parents choose the language once.
const LANGUAGE_SETTINGS_KEY = "tinytaps.language.v1";

/** The chosen language pack, the second one (or null) and the settings to change them. */
export function useLanguages() {
  const [settings, update] = useStoredSettings(LANGUAGE_SETTINGS_KEY, DEFAULT_LANGUAGE_SETTINGS);
  const app = useAppLanguage();
  const main = languageFor(settings.language === "app" ? app.id : settings.language);
  const second = settings.second === "none" || settings.second === main.id ? null : languageFor(settings.second);
  return { settings, update, language: main, second };
}

export function LanguageSetting({ settings, update }: { settings: LanguageSettings; update: (patch: Partial<LanguageSettings>) => void }) {
  const t = useT();
  const app = useAppLanguage();
  const main = languageFor(settings.language === "app" ? app.id : settings.language);
  const name = (id: LanguageId) => languageName(languageFor(id), app.id);
  return (
    <SettingsGroup title={t({ de: "Sprache", ru: "Язык" })}>
      <Choice<LanguageId | "app">
        label={t({ de: "Spielsprache", ru: "Язык игры" })}
        value={settings.language === "app" ? "app" : main.id}
        onChange={(language) => {
          const chosen = language === "app" ? app.id : language;
          update({ language, second: chosen === settings.second ? "none" : settings.second });
        }}
        options={[
          { value: "app", label: t({ de: `Wie die App (${name(main.id)})`, ru: `Как в приложении (${name(main.id)})` }) },
          ...LANGUAGES.map((l) => ({ value: l.id, label: name(l.id) })),
        ]}
      />
      <Choice<LanguageId | "none">
        label={t({ de: "Zweite Sprache", ru: "Второй язык" })}
        value={settings.second === main.id ? "none" : settings.second}
        onChange={(second) => update({ second })}
        options={[
          { value: "none", label: t({ de: "Aus", ru: "Нет" }) },
          ...LANGUAGES.filter((l) => l.id !== main.id).map((l) => ({ value: l.id, label: name(l.id) })),
        ]}
      />
      {settings.second !== "none" && settings.second !== main.id && (
        <p className="setting-note">
          {t({
            de: "Unter jedem Wort steht es auch in der zweiten Sprache und wird danach vorgelesen: „Bär – bear“.",
            ru: "Под каждым словом оно написано и на втором языке, а потом звучит вслух: «мишка – bear».",
          })}
        </p>
      )}
    </SettingsGroup>
  );
}
