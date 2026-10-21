"use client";

import { GameShell } from "@/components/GameShell";
import { Choice, Toggle } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useStoredSettings } from "@/lib/storage";
import { DEFAULT_LETTERS_SETTINGS, LETTERS_SETTINGS_KEY, type LetterCase } from "./settings";
import { LettersPlay } from "./LettersPlay";

const pack = de;

export function LettersGame() {
  const [settings, update] = useStoredSettings(LETTERS_SETTINGS_KEY, DEFAULT_LETTERS_SETTINGS);

  return (
    <GameShell
      title="Buchstaben & Zahlen"
      emoji="🔤"
      speechLang={pack.speechLang}
      settings={
        <>
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
          <Toggle label="Wort anzeigen" checked={settings.showWord} onChange={(showWord) => update({ showWord })} />
          <Toggle label="Vorlesen" checked={settings.speech} onChange={(speech) => update({ speech })} />
          <Toggle label="Töne" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
        </>
      }
    >
      <LettersPlay pack={pack} settings={settings} />
    </GameShell>
  );
}
