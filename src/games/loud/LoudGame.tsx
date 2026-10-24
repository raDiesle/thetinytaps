import { useMemo, useRef, useState, type CSSProperties } from "react";
import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { unlockAudio } from "@/lib/sfx";
import { createEar, meterAt, useMicPermission, useMicrophone, type Heard } from "./mic";
import { LoudPlay } from "./LoudPlay";
import { DEFAULT_LOUD_SETTINGS, LOUD_SETTINGS_KEY, type LoudLevels, type Sensitivity } from "./settings";
import "./loud.css";

const MODES = [
  { id: "all", emoji: "🌈", title: "Beides nacheinander", featured: true },
  { id: "voice", emoji: "🦁", title: "Löwe und Maus" },
  { id: "blow", emoji: "🌬️", title: "Pusten" },
];

export function LoudGame() {
  const [settings, update] = useGameSettings(LOUD_SETTINGS_KEY, DEFAULT_LOUD_SETTINGS);

  return (
    <GameShell
      title="Laut und leise"
      emoji="🦁"
      modes={MODES}
      mode={settings.levels}
      onMode={(levels) => update({ levels: levels as LoudLevels })}
      level={
        <Choice<Sensitivity>
          label="Wie laut?"
          value={settings.sensitivity}
          onChange={(sensitivity) => update({ sensitivity })}
          options={[
            { value: "low", label: "📣 Sehr laut rufen" },
            { value: "mid", label: "🦁 Laut rufen" },
            { value: "high", label: "🗣️ Etwas lauter reden" },
          ]}
        />
      }
      settings={
        <SettingsGroup title="Mikrofon">
          <p className="setting-note">
            Löwe und Maus: Ruft das Kind laut, brüllt der Löwe und springt. Spricht oder flüstert es leise, piepst die kleine Maus.
            Nacheinander geht es nach zehn Tönen weiter zum Pusten.
          </p>
          <p className="setting-note">
            Pusten: Ins Mikrofon pusten bläst die Kerzen auf dem Geburtstagskuchen aus, lässt die Schirmchen der Pusteblume fliegen,
            dreht ein Windrad, bis der Regenbogen fertig ist, und treibt das Segelboot mit der Maus zum Löwen. Lautes Rufen pustet
            auch; so laut wie für den Löwen ist ganz fest gepustet.
          </p>
          <p className="setting-note">
            Das Spiel misst nur, wie laut es gerade ist – nichts wird aufgenommen, gespeichert oder verschickt. Antippen geht auch:
            Ein Tipp ist ein kurzer Puster, Finger draufhalten pustet weiter.
          </p>
          <MicCheck sensitivity={settings.sensitivity} />
          <p className="setting-note">
            Mit „Vorlesen“ auf der Startseite sprechen die Tiere („Roaaar! Ich bin der Löwe!“) und laden zum Rufen und Pusten ein.
          </p>
        </SettingsGroup>
      }
    >
      <LoudPlay speechLang={de.speechLang} settings={settings} />
    </GameShell>
  );
}

const HEARD_LABEL: Record<Heard, string> = { loud: "🦁 Laut – der Löwe brüllt!", quiet: "🐭 Leise – die Maus piepst." };
const HEARD_SHOW_MS = 1500;

/**
 * Lets the grown-up allow the microphone before handing over the device, and
 * try out how loud the child has to be for the lion.
 */
function MicCheck({ sensitivity }: { sensitivity: Sensitivity }) {
  const permission = useMicPermission();
  const [testing, setTesting] = useState(false);
  const [heard, setHeard] = useState<Heard | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const heardAt = useRef(0);
  const ear = useMemo(createEar, []);

  const mic = useMicrophone(testing, (db, ms) => {
    const now = performance.now();
    const result = ear.hear(db, ms, false, sensitivity);
    barRef.current?.style.setProperty("--level", ear.meter.toFixed(3));
    if (result) {
      heardAt.current = now;
      setHeard(result);
    } else if (now - heardAt.current > HEARD_SHOW_MS) {
      setHeard(null);
    }
  });

  const start = () => {
    unlockAudio();
    setTesting(true);
  };

  return (
    <div className="mic-check">
      {!testing && (
        <>
          <button type="button" className="mic-check-button" onClick={start}>
            🎤 {permission === "granted" ? "Mikrofon ausprobieren" : "Mikrofon erlauben und ausprobieren"}
          </button>
          {permission === "granted" && <p className="setting-note">✓ Das Mikrofon ist für diese Seite erlaubt.</p>}
          {permission === "denied" && (
            <p className="setting-note">Das Mikrofon ist für diese Seite blockiert. Bitte in den Browser-Einstellungen erlauben.</p>
          )}
        </>
      )}
      {testing && mic === "asking" && <p className="setting-note">Bitte im Browser „Erlauben“ wählen.</p>}
      {testing && mic === "denied" && (
        <p className="setting-note">Das Mikrofon ist blockiert. Bitte in den Browser-Einstellungen für diese Seite erlauben.</p>
      )}
      {testing && mic === "missing" && <p className="setting-note">Kein Mikrofon gefunden.</p>}
      {testing && mic === "on" && (
        <>
          <div
            ref={barRef}
            className="mic-check-meter"
            style={{ "--threshold": meterAt(ear.loudDb(sensitivity)) } as CSSProperties}
            aria-hidden
          >
            <span className="mic-check-level" />
            <span className="mic-check-mark">🦁</span>
          </div>
          <p className="mic-check-heard" role="status">
            {heard ? HEARD_LABEL[heard] : "Probier mal: leise sprechen, dann laut rufen."}
          </p>
          <button type="button" className="mic-check-button" onClick={() => setTesting(false)}>
            Fertig
          </button>
        </>
      )}
    </div>
  );
}
