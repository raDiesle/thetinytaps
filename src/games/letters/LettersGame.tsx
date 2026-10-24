import { GameShell } from "@/components/GameShell";
import { LanguageSetting, useLanguages } from "@/components/LanguageSetting";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { TouchKeysSetting, useTouchKeys } from "@/components/TouchKeyboard";
import { VoiceSetting } from "@/components/VoiceSetting";
import { sampleLetter } from "@/content/languages";
import { useStoredSettings } from "@/lib/storage";
import {
  DEFAULT_LETTERS_SETTINGS,
  LETTERS_SETTINGS_KEY,
  type Announce,
  type LetterCase,
  type LettersMode,
  type LettersSettings,
  type NumberReveal,
} from "./settings";
import { FindPlay } from "./FindPlay";
import { LettersPlay } from "./LettersPlay";
import { TrainPlay } from "./TrainPlay";

export function LettersGame() {
  const [settings, update] = useStoredSettings(LETTERS_SETTINGS_KEY, DEFAULT_LETTERS_SETTINGS);
  const languages = useLanguages();
  const pack = languages.language.pack;
  const second = languages.second?.pack ?? null;
  // Examples in the settings, in the chosen language: „Be, wie Bär“.
  const b = sampleLetter(pack);
  const touchKeys = useTouchKeys(settings.touchKeys);

  return (
    <GameShell
      title="Buchstaben & Zahlen"
      emoji="🔤"
      settings={
        <>
          <SettingsGroup title="Spielart">
            <Choice<LettersMode>
              label="Spiel"
              value={settings.mode}
              onChange={(mode) => update({ mode })}
              options={[
                { value: "free", label: "⌨️ Frei tippen" },
                { value: "find", label: "🔍 Wo ist das B?" },
                { value: "train", label: "🚂 Buchstaben-Zug" },
              ]}
            />
            {settings.mode === "find" && (
              <Toggle
                label={
                  touchKeys
                    ? "Gesuchte Taste aufleuchten lassen, wenn es länger dauert"
                    : "Taste auf einer kleinen Tastatur zeigen, wenn es länger dauert"
                }
                checked={settings.hints}
                onChange={(hints) => update({ hints })}
              />
            )}
          </SettingsGroup>

          <LanguageSetting settings={languages.settings} update={languages.update} />

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
            {settings.mode === "free" && (
              <Toggle
                label="Nachspuren: Buchstabe aus Punkten, Finger oder Maus lässt Sterne erscheinen"
                checked={settings.trace}
                onChange={(trace) => update({ trace })}
              />
            )}
            {settings.letterCase === "both" && settings.mode === "free" && !settings.trace && (
              <Toggle
                label="Mama- und Baby-Buchstabe (mit Augen, an der Hand)"
                checked={settings.letterFamily}
                onChange={(letterFamily) => update({ letterFamily })}
              />
            )}
            <Choice<LettersSettings["theme"]>
              label="Bilder"
              value={settings.theme}
              onChange={(theme) => update({ theme })}
              options={[
                { value: "all", label: "🌈 Alle" },
                ...pack.themes.map((t) => ({ value: t.id, label: `${t.emoji} ${t.label}` })),
              ]}
            />
            {settings.mode !== "train" && (
              <Toggle label="Wort anzeigen" checked={settings.showWord} onChange={(showWord) => update({ showWord })} />
            )}
          </SettingsGroup>

          <SettingsGroup title="Ton">
            <Toggle label="Vorlesen" checked={settings.speech} onChange={(speech) => update({ speech })} />
            {settings.speech && <VoiceSetting lang={pack.speechLang} sample={pack.letterSentence(b, b.words[0])} />}
            {settings.speech && settings.mode === "free" && (
              <Choice<Announce>
                label="Ansage"
                value={settings.announce}
                onChange={(announce) => update({ announce })}
                options={[
                  { value: "letterAndWord", label: `„${pack.letterSentence(b, b.words[0]).replace(/!$/, "")}“` },
                  { value: "word", label: `„${b.words[0].word}“` },
                  { value: "letter", label: `„${b.spoken}“` },
                ]}
              />
            )}
            <Toggle label="Töne" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
          </SettingsGroup>

          <SettingsGroup title="Verhalten">
            {settings.mode === "free" && (
              <Choice<NumberReveal>
                label="Zahlen"
                value={settings.numbers}
                onChange={(numbers) => update({ numbers })}
                options={[
                  { value: "all", label: "🖼️ Alles sofort" },
                  { value: "count", label: "🗣️ Vorzählen" },
                  { value: "step", label: "👆 Schritt für Schritt" },
                  { value: "tap", label: "✋ Selbst zählen" },
                ]}
              />
            )}
            <Toggle
              label="Ruhiger Modus (leiser, weniger Bewegung)"
              checked={settings.calm}
              onChange={(calm) => update({ calm })}
            />
            {settings.mode === "free" && settings.numbers === "count" && (
              <Toggle
                label="Zählen nicht unterbrechen"
                checked={settings.finishCounting}
                onChange={(finishCounting) => update({ finishCounting })}
              />
            )}
          </SettingsGroup>

          <TouchKeysSetting value={settings.touchKeys} onChange={(touchKeys) => update({ touchKeys })} />
        </>
      }
    >
      {settings.mode === "find" ? (
        <FindPlay pack={pack} second={second} settings={settings} />
      ) : settings.mode === "train" ? (
        <TrainPlay pack={pack} settings={settings} />
      ) : (
        <LettersPlay pack={pack} second={second} settings={settings} />
      )}
    </GameShell>
  );
}
