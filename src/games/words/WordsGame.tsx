import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { de } from "@/content/de";
import { useStoredSettings } from "@/lib/storage";
import { DEFAULT_WORDS_SETTINGS, WORDS_SETTINGS_KEY, type WordCase, type WordLength, type WordsSettings } from "./settings";
import { WordsPlay } from "./WordsPlay";

const pack = de;

export function WordsGame() {
  const [settings, update] = useStoredSettings(WORDS_SETTINGS_KEY, DEFAULT_WORDS_SETTINGS);

  return (
    <GameShell
      title="Wörter tippen"
      emoji="✍️"
      settings={
        <>
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
            <Toggle
              label="Bild gleich zeigen (sonst erst am Ende)"
              checked={settings.showPicture}
              onChange={(showPicture) => update({ showPicture })}
            />
          </SettingsGroup>

          <SettingsGroup title="Ton">
            <Toggle label="Vorlesen" checked={settings.speech} onChange={(speech) => update({ speech })} />
            {settings.speech && <VoiceSetting lang={pack.speechLang} sample={`Bär! ${pack.praise[0]}`} />}
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
        </>
      }
    >
      <WordsPlay pack={pack} settings={settings} />
    </GameShell>
  );
}
