import { GameShell } from "@/components/GameShell";
import { useLanguages } from "@/components/LanguageSetting";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { TouchKeysSetting } from "@/components/TouchKeyboard";
import { useGameSettings } from "@/lib/common";
import {
  DEFAULT_WORDS_SETTINGS,
  WORDS_SETTINGS_KEY,
  type PictureReveal,
  type WordCase,
  type WordLength,
  type WordsMode,
  type WordsSettings,
} from "./settings";
import { WordsPlay } from "./WordsPlay";

export function WordsGame() {
  const [settings, update] = useGameSettings(WORDS_SETTINGS_KEY, DEFAULT_WORDS_SETTINGS);
  const languages = useLanguages();
  const pack = languages.language.pack;

  return (
    <GameShell
      title="Wörter tippen"
      emoji="✍️"
      modes={[
        { id: "spell", emoji: "✍️", title: "Ganzes Wort" },
        { id: "first", emoji: "🐻", title: "Erster Buchstabe" },
        { id: "colors", emoji: "🎨", title: "Farben" },
        { id: "actions", emoji: "🦘", title: "Tu-Wörter" },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as WordsMode })}
      level={
        // Colours and doing words are short fixed lists, so the length only applies to the picture words.
        <Choice<WordLength>
          label="Wortlänge"
          value={settings.length}
          onChange={(length) => update({ length })}
          options={[
            { value: "short", label: "Bär" },
            { value: "medium", label: "Hund" },
            { value: "long", label: "Giraffe" },
          ]}
        />
      }
      settings={
        <>
          <SettingsGroup title="Wörter">
            <Choice<WordsSettings["theme"]>
              label="Bilder"
              value={settings.theme}
              onChange={(theme) => update({ theme })}
              options={[
                { value: "all", label: "🌈 Alle" },
                ...pack.themes.map((t) => ({ value: t.id, label: `${t.emoji} ${t.label}` })),
              ]}
            />
            <p className="setting-note">Wortlänge und Bilder gelten für „Ganzes Wort“ und „Erster Buchstabe“.</p>
          </SettingsGroup>

          <SettingsGroup title="Anzeige">
            <Choice<WordCase>
              label="Schrift"
              value={settings.letterCase}
              onChange={(letterCase) => update({ letterCase })}
              options={[
                { value: "upper", label: "BÄR" },
                { value: "word", label: "Bär" },
                { value: "lower", label: "bär" },
              ]}
            />
            <Choice<PictureReveal>
              label="Bild"
              value={settings.picture}
              onChange={(picture) => update({ picture })}
              options={[
                { value: "now", label: "Gleich zeigen" },
                { value: "puzzle", label: "🧩 Baut sich auf" },
                { value: "end", label: "Erst am Ende" },
              ]}
            />
            <p className="setting-note">Beim ersten Buchstaben ist das Bild immer gleich da – es ist der einzige Hinweis.</p>
          </SettingsGroup>

          <SettingsGroup title="Verhalten">
            <Toggle
              label="Jede Taste schreibt den nächsten Buchstaben (für die Kleinsten)"
              checked={settings.anyKey}
              onChange={(anyKey) => update({ anyKey })}
            />
          </SettingsGroup>

          <TouchKeysSetting value={settings.touchKeys} onChange={(touchKeys) => update({ touchKeys })} />
        </>
      }
    >
      <WordsPlay pack={pack} second={languages.second?.pack ?? null} settings={settings} />
    </GameShell>
  );
}
