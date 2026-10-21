import { GameShell } from "@/components/GameShell";
import { LanguageSetting, useLanguages } from "@/components/LanguageSetting";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { TouchKeysSetting } from "@/components/TouchKeyboard";
import { VoiceSetting } from "@/components/VoiceSetting";
import { sampleLetter } from "@/content/languages";
import { useStoredSettings } from "@/lib/storage";
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
  const [settings, update] = useStoredSettings(WORDS_SETTINGS_KEY, DEFAULT_WORDS_SETTINGS);
  const languages = useLanguages();
  const pack = languages.language.pack;
  // Colours and doing words are short fixed lists, so length and theme only apply to the picture words.
  const nouns = settings.mode === "spell" || settings.mode === "first";

  return (
    <GameShell
      title="Wörter tippen"
      emoji="✍️"
      settings={
        <>
          <SettingsGroup title="Spielart">
            <Choice<WordsMode>
              label="Spiel"
              value={settings.mode}
              onChange={(mode) => update({ mode })}
              options={[
                { value: "spell", label: "✍️ Ganzes Wort" },
                { value: "first", label: "🐻 Erster Buchstabe" },
                { value: "colors", label: "🎨 Farben" },
                { value: "actions", label: "🦘 Tu-Wörter" },
              ]}
            />
          </SettingsGroup>

          <LanguageSetting settings={languages.settings} update={languages.update} />

          {nouns && (
            <SettingsGroup title="Wörter">
              <Choice<WordLength>
                label="Länge"
                value={settings.length}
                onChange={(length) => update({ length })}
                options={[
                  { value: "short", label: "Bär" },
                  { value: "medium", label: "Hund" },
                  { value: "long", label: "Giraffe" },
                ]}
              />
              <Choice<WordsSettings["theme"]>
                label="Bilder"
                value={settings.theme}
                onChange={(theme) => update({ theme })}
                options={[
                  { value: "all", label: "🌈 Alle" },
                  ...pack.themes.map((t) => ({ value: t.id, label: `${t.emoji} ${t.label}` })),
                ]}
              />
            </SettingsGroup>
          )}

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
            {settings.mode !== "first" && (
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
            )}
          </SettingsGroup>

          <SettingsGroup title="Ton">
            <Toggle label="Vorlesen" checked={settings.speech} onChange={(speech) => update({ speech })} />
            {settings.speech && <VoiceSetting lang={pack.speechLang} sample={`${sampleLetter(pack).words[0].word}! ${pack.praise[0]}`} />}
            <Toggle label="Töne" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
          </SettingsGroup>

          <SettingsGroup title="Verhalten">
            <Toggle
              label="Jede Taste schreibt den nächsten Buchstaben (für die Kleinsten)"
              checked={settings.anyKey}
              onChange={(anyKey) => update({ anyKey })}
            />
            <Toggle
              label="Ruhiger Modus (leiser, weniger Bewegung)"
              checked={settings.calm}
              onChange={(calm) => update({ calm })}
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
