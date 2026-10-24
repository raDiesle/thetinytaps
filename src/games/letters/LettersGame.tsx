import { GameShell } from "@/components/GameShell";
import { useLanguages } from "@/components/LanguageSetting";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { TouchKeysSetting, useTouchKeys } from "@/components/TouchKeyboard";
import { sampleLetter } from "@/content/languages";
import { useGameSettings } from "@/lib/common";
import {
  DEFAULT_LETTERS_SETTINGS,
  LETTERS_SETTINGS_KEY,
  type Announce,
  type LetterCase,
  type LettersMode,
  type LettersSettings,
} from "./settings";
import { FindPlay } from "./FindPlay";
import { LettersPlay } from "./LettersPlay";
import { TrainPlay } from "./TrainPlay";

export function LettersGame() {
  const [settings, update] = useGameSettings(LETTERS_SETTINGS_KEY, DEFAULT_LETTERS_SETTINGS);
  const languages = useLanguages();
  const pack = languages.language.pack;
  const second = languages.second?.pack ?? null;
  // Examples in the settings, in the chosen language: „Be, wie Bär“.
  const b = sampleLetter(pack);
  // Free typing: the ABC keys on every touch screen, the other modes only on tablets.
  const anyTouch = settings.mode === "free";
  const touchKeys = useTouchKeys(settings.touchKeys, anyTouch);

  return (
    <GameShell
      title="Buchstaben & Zahlen"
      emoji="🔤"
      modes={[
        { id: "free", emoji: "⌨️", title: "Frei tippen" },
        { id: "find", emoji: "🔍", title: `Wo ist das ${b.upper}?` },
        { id: "train", emoji: "🚂", title: "Buchstaben-Zug" },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as LettersMode })}
      level={
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
      }
      settings={
        <>
          <SettingsGroup title="Anzeige">
            <Choice<LettersSettings["theme"]>
              label="Bilder"
              value={settings.theme}
              onChange={(theme) => update({ theme })}
              options={[
                { value: "all", label: "🌈 Alle" },
                ...pack.themes.map((t) => ({ value: t.id, label: `${t.emoji} ${t.label}` })),
              ]}
            />
            <Toggle
              label="Wort anzeigen (nicht beim Zug)"
              checked={settings.showWord}
              onChange={(showWord) => update({ showWord })}
            />
          </SettingsGroup>

          <SettingsGroup title="⌨️ Frei tippen">
            <Toggle
              label="Nachspuren: Buchstabe aus Punkten, Finger oder Maus lässt Sterne erscheinen"
              checked={settings.trace}
              onChange={(trace) => update({ trace })}
            />
            {settings.letterCase === "both" && !settings.trace && (
              <Toggle
                label="Mama- und Baby-Buchstabe (mit Augen, an der Hand)"
                checked={settings.letterFamily}
                onChange={(letterFamily) => update({ letterFamily })}
              />
            )}
            {settings.letterCase !== "lower" && !settings.trace && !(settings.letterCase === "both" && settings.letterFamily) && (
              <Toggle
                label="Lebende Buchstaben (der Buchstabe wird kurz zum Tier: S zur Schlange, M zur Maus)"
                checked={settings.livingLetters}
                onChange={(livingLetters) => update({ livingLetters })}
              />
            )}
            {settings.speech && (
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
            <Toggle
              label="Schritt für Schritt (jeder Klick zeigt das Nächste)"
              checked={settings.stepByStep}
              onChange={(stepByStep) => update({ stepByStep })}
            />
            <Toggle
              label="Selbst zählen (jedes Ding antippen)"
              checked={settings.countByTap}
              onChange={(countByTap) => update({ countByTap })}
            />
            {!settings.stepByStep && !settings.countByTap && (
              <Toggle
                label="Zählen nicht unterbrechen"
                checked={settings.finishCounting}
                onChange={(finishCounting) => update({ finishCounting })}
              />
            )}
          </SettingsGroup>

          <SettingsGroup title={`🔍 Wo ist das ${b.upper}?`}>
            <Toggle
              label={
                touchKeys
                  ? "Gesuchte Taste aufleuchten lassen, wenn es länger dauert"
                  : "Taste auf einer kleinen Tastatur zeigen, wenn es länger dauert"
              }
              checked={settings.hints}
              onChange={(hints) => update({ hints })}
            />
          </SettingsGroup>

          <TouchKeysSetting
            value={settings.touchKeys}
            onChange={(touchKeys) => update({ touchKeys })}
            anyTouch={anyTouch}
          />
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
