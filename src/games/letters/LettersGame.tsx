import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { TouchKeysSetting } from "@/components/TouchKeyboard";
import { VoiceSetting } from "@/components/VoiceSetting";
import { de } from "@/content/de";
import { useStoredSettings } from "@/lib/storage";
import { DEFAULT_LETTERS_SETTINGS, LETTERS_SETTINGS_KEY, type Announce, type LetterCase, type LettersSettings } from "./settings";
import { LettersPlay } from "./LettersPlay";

const pack = de;

export function LettersGame() {
  const [settings, update] = useStoredSettings(LETTERS_SETTINGS_KEY, DEFAULT_LETTERS_SETTINGS);

  return (
    <GameShell
      title="Buchstaben & Zahlen"
      emoji="🔤"
      settings={
        <>
          <SettingsGroup title="Anzeige">
            <Choice<LetterCase>
              label="Buchstaben"
              value={settings.letterCase}
              onChange={(letterCase) => update({ letterCase })}
              options={[
                { value: "upper", label: "A" },
                { value: "both", label: "A a" },
                { value: "lower", label: "a" },
              ]}
            />
            <Choice<LettersSettings["theme"]>
              label="Bilder"
              value={settings.theme}
              onChange={(theme) => update({ theme })}
              options={[
                { value: "all", label: "🌈 Alle" },
                ...pack.themes.map((t) => ({ value: t.id, label: `${t.emoji} ${t.label}` })),
              ]}
            />
            <Toggle label="Wort anzeigen" checked={settings.showWord} onChange={(showWord) => update({ showWord })} />
          </SettingsGroup>

          <SettingsGroup title="Ton">
            <Toggle label="Vorlesen" checked={settings.speech} onChange={(speech) => update({ speech })} />
            {settings.speech && <VoiceSetting lang={pack.speechLang} sample="Be, wie Bär!" />}
            {settings.speech && (
              <Choice<Announce>
                label="Ansage"
                value={settings.announce}
                onChange={(announce) => update({ announce })}
                options={[
                  { value: "letterAndWord", label: "„Be, wie Bär“" },
                  { value: "word", label: "„Bär“" },
                  { value: "letter", label: "„Be“" },
                ]}
              />
            )}
            <Toggle label="Töne" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
          </SettingsGroup>

          <SettingsGroup title="Verhalten">
            <Toggle
              label="Schritt für Schritt (jeder Klick zeigt das Nächste)"
              checked={settings.stepByStep}
              onChange={(stepByStep) => update({ stepByStep })}
            />
            <Toggle
              label="Ruhiger Modus (leiser, weniger Bewegung)"
              checked={settings.calm}
              onChange={(calm) => update({ calm })}
            />
            {!settings.stepByStep && (
              <Toggle
                label="Zählen nicht unterbrechen"
                checked={settings.finishCounting}
                onChange={(finishCounting) => update({ finishCounting })}
              />
            )}
          </SettingsGroup>

          <SettingsGroup title="Tablet">
            <TouchKeysSetting value={settings.touchKeys} onChange={(touchKeys) => update({ touchKeys })} />
          </SettingsGroup>
        </>
      }
    >
      <LettersPlay pack={pack} settings={settings} />
    </GameShell>
  );
}
