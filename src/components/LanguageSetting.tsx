import { Choice, SettingsGroup } from "@/components/SettingControls";
import { LANGUAGES, type LanguageId, languageFor, languageName } from "@/content/languages";
import { useAppLanguage, useT } from "@/lib/language";
import { useStoredSettings } from "@/lib/storage";

// One language for everything: the letters and words games and Tapsi play in the app language (🌐 on the home
// page), so menus, letters and voice never mix. A language joins 🌐 only once the whole app speaks it.

export interface LanguageSettings {
  /** Optional second language: every word is also shown and said in it, „Bär – bear“. */
  second: LanguageId | "none";
}

const DEFAULT_LANGUAGE_SETTINGS: LanguageSettings = { second: "none" };

// Shared by the letters and words games, so parents choose the second language once. An old saved play
// language (`language`) is no longer read: the app language decides.
const LANGUAGE_SETTINGS_KEY = "tinytaps.language.v1";

/** The language pack of the app language, the second one (or null) and the settings to change it. */
export function useLanguages() {
  const [settings, update] = useStoredSettings(LANGUAGE_SETTINGS_KEY, DEFAULT_LANGUAGE_SETTINGS);
  const main = languageFor(useAppLanguage().id);
  const second = settings.second === "none" || settings.second === main.id ? null : languageFor(settings.second);
  return { settings, update, language: main, second };
}

/** The choice of a second language for the letters and words games; the first one is the app language. */
export function LanguageSetting({ settings, update }: { settings: LanguageSettings; update: (patch: Partial<LanguageSettings>) => void }) {
  const t = useT();
  const app = useAppLanguage();
  const main = languageFor(app.id).id;
  return (
    <SettingsGroup title={t({ de: "Sprache", ru: "Язык" })}>
      <Choice<LanguageId | "none">
        label={t({ de: "Zweite Sprache", ru: "Второй язык" })}
        value={settings.second === main ? "none" : settings.second}
        onChange={(second) => update({ second })}
        options={[
          { value: "none", label: t({ de: "Aus", ru: "Выкл." }) },
          ...LANGUAGES.filter((l) => l.id !== main).map((l) => ({ value: l.id, label: languageName(l, app.id) })),
        ]}
      />
      <p className="setting-note">
        {settings.second !== "none" && settings.second !== main
          ? t({
              de: "„Buchstaben & Zahlen“ und „Wörter tippen“ zeigen jedes Wort auch in der zweiten Sprache und lesen es danach vor: „Bär – bear“.",
              ru: "«Буквы и цифры» и «Печатаем слова» показывают каждое слово и на втором языке и потом читают его вслух: «Медведь – bear».",
            })
          : t({
              de: "Alle Spiele sprechen die Sprache der App (🌐 oben).",
              ru: "Все игры говорят на языке приложения (🌐 вверху).",
            })}
      </p>
    </SettingsGroup>
  );
}
