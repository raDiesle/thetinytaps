import { Choice, SettingsGroup } from "@/components/SettingControls";
import { LANGUAGES, languageFor, type LanguageId, languageName } from "@/content/languages";
import { TARGET_LANGUAGES, type TargetLanguageId, targetLanguageFor } from "@/content/targetLanguages";
import { languageLabel, useAppLanguage, useT } from "@/lib/language";
import { playLanguage } from "@/lib/locale";
import { useStoredSettings } from "@/lib/storage";

/** A play language: one with a pack for letters and words, or one only the Bewegungsabenteuer speaks so far. */
export type PlayLanguageId = LanguageId | TargetLanguageId;

/** The play languages to choose from: those with a pack first, then the wanted ones without one. */
const PLAY_LANGUAGES: { id: PlayLanguageId; label: string }[] = [...LANGUAGES, ...TARGET_LANGUAGES.filter((t) => !LANGUAGES.some((l) => l.id === t.id))].map(
  ({ id, label }) => ({ id, label }),
);

/** Flag and name of a play language in the app language: "🇷🇺 Russisch" on German screens, "🇷🇺 Русский" on Russian ones. */
const nameOf = (id: PlayLanguageId, appLanguageId: TargetLanguageId) =>
  LANGUAGES.some((l) => l.id === id) ? languageName(languageFor(id), appLanguageId) : languageLabel(targetLanguageFor(id), appLanguageId);

export interface LanguageSettings {
  /** The language the child plays in; a game that doesn't speak it plays in English (`packFor`). */
  language: PlayLanguageId;
  /** Optional second language: every word is also shown and said in it, „Bär – bear“. */
  second: LanguageId | "none";
}

// Until the parents choose, the child plays in the browser's language (English when the app has none of it).
const DEFAULT_LANGUAGE_SETTINGS: LanguageSettings = { language: playLanguage(PLAY_LANGUAGES.map((l) => l.id)), second: "none" };

/** The play language with this id; German for anything unknown, e.g. an old saved setting. */
const playLanguageFor = (id: string) => PLAY_LANGUAGES.find((l) => l.id === id) ?? PLAY_LANGUAGES[0];

/** The pack letters and words play in: English where the play language has none (Spanish, Chinese, …). */
const packFor = (id: string) => LANGUAGES.find((l) => l.id === id) ?? languageFor("en");

// Shared by the letters and words games and the Bewegungsabenteuer, so parents choose the language once.
const LANGUAGE_SETTINGS_KEY = "tinytaps.language.v1";

/** The chosen play language (id and label), its language pack, the second one (or null) and the settings to change them. */
export function useLanguages() {
  const [settings, update] = useStoredSettings(LANGUAGE_SETTINGS_KEY, DEFAULT_LANGUAGE_SETTINGS);
  const chosen = playLanguageFor(settings.language);
  const main = packFor(chosen.id);
  const second = settings.second === "none" || settings.second === main.id ? null : languageFor(settings.second);
  return { settings, update, chosen, language: main, second };
}

export function LanguageSetting({ settings, update }: { settings: LanguageSettings; update: (patch: Partial<LanguageSettings>) => void }) {
  const t = useT();
  const app = useAppLanguage();
  const chosen = playLanguageFor(settings.language);
  const main = packFor(chosen.id).id;
  return (
    <SettingsGroup title={t({ de: "Sprache", ru: "Язык" })}>
      <Choice<PlayLanguageId>
        label={t({ de: "Spielsprache", ru: "Язык игры" })}
        value={chosen.id}
        onChange={(language) => update({ language, second: language === settings.second ? "none" : settings.second })}
        options={PLAY_LANGUAGES.map((l) => ({ value: l.id, label: nameOf(l.id, app.id) }))}
      />
      {main !== chosen.id && (
        <p className="setting-note">
          {t({
            de: `Auf ${chosen.label.split(" ")[1]} spricht bisher nur Tapsi im Bewegungsabenteuer; „Buchstaben & Zahlen“ und „Wörter tippen“ sind auf Englisch.`,
            ru: "На этом языке пока говорит только Тапси в «Приключениях в движении»; «Буквы и цифры» и «Печатаем слова» — на английском.",
          })}
        </p>
      )}
      <Choice<LanguageId | "none">
        label={t({ de: "Zweite Sprache", ru: "Второй язык" })}
        value={settings.second === main ? "none" : settings.second}
        onChange={(second) => update({ second })}
        options={[
          { value: "none", label: t({ de: "Aus", ru: "Выкл." }) },
          ...LANGUAGES.filter((l) => l.id !== main).map((l) => ({ value: l.id, label: nameOf(l.id, app.id) })),
        ]}
      />
      {settings.second !== "none" && settings.second !== main && (
        <p className="setting-note">
          {t({
            de: "Unter jedem Wort steht es auch in der zweiten Sprache und wird danach vorgelesen: „Bär – bear“.",
            ru: "Под каждым словом оно написано и на втором языке и потом читается вслух: «Медведь – bear».",
          })}
        </p>
      )}
    </SettingsGroup>
  );
}
