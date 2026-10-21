import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { useStoredSettings } from "@/lib/storage";
import { BearPlay } from "./BearPlay";
import { SITUATIONS } from "./kita";
import { KitaPlay } from "./KitaPlay";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY, type FeelingsMode, type FeelingsSettings, type KitaAnswers } from "./settings";
import "./feelings.css";

export function FeelingsGame() {
  const [settings, update] = useStoredSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);
  const kita = settings.mode === "kita";

  return (
    <GameShell
      title="Gefühle"
      emoji="🐻"
      settings={
        <>
          <SettingsGroup title="Spielart">
            <Choice<FeelingsMode>
              label="Spiel"
              value={settings.mode}
              onChange={(mode) => update({ mode })}
              options={[
                { value: "bear", label: "🐻 Bär trösten" },
                { value: "kita", label: "🏫 Im Kindergarten" },
              ]}
            />
            <p className="setting-note">
              {kita
                ? "Kleine Geschichten: Jemand schubst, tritt oder nimmt etwas weg, die Rutsche ist voll, ein anderes Kind hat das tolle Spielzeug – oder der kleine Bär ist selbst wütend. Das Kind tippt, was der Bär tun kann: laut „Stopp! Nein!“ sagen, weggehen und Abstand halten, Hilfe holen, fragen, warten, tauschen."
                : "Der Bär ist traurig, wütend, müde oder hat Angst. Das Kind tröstet ihn (umarmen, Teddy geben, pusten, zudecken …) und sieht, wie sein Gesicht sich Schritt für Schritt verändert. Den Bären antippen heißt streicheln."}
            </p>
          </SettingsGroup>

          {kita && (
            <SettingsGroup title="Kindergarten">
              <Choice<FeelingsSettings["situation"]>
                label="Geschichte"
                value={settings.situation}
                onChange={(situation) => update({ situation })}
                options={[
                  { value: "all", label: "🌈 Alle" },
                  ...SITUATIONS.map((s) => ({ value: s.id, label: `${s.emoji} ${s.title}` })),
                ]}
              />
              <Choice<KitaAnswers>
                label="Antworten"
                value={settings.answers}
                onChange={(answers) => update({ answers })}
                options={[
                  { value: "show", label: "👣 Vorgemacht" },
                  { value: "choose", label: "🤔 Selbst wählen (ab 3)" },
                ]}
              />
              <p className="setting-note">
                Jede Antwort ist ein Bild, auf dem der Bär es vormacht – so kann das Kind ohne Lesen wählen. Beim Selbst-Wählen steht neben
                dem ersten Schritt eine nicht so gute Idee (z.&nbsp;B. zurückschubsen). Tippt das Kind darauf, bekommt sie ein rotes Kreuz, der
                Bär schüttelt den Kopf, denkt sie sich durchgestrichen und es wird erklärt, warum. Die gute Idee bekommt einen grünen Haken.
              </p>
            </SettingsGroup>
          )}

          <SettingsGroup title="Ton">
            <Toggle label="Vorlesen" checked={settings.speech} onChange={(speech) => update({ speech })} />
            {settings.speech ? (
              <VoiceSetting lang="de-DE" sample="Stopp! Nein! Ich will das nicht!" />
            ) : (
              <p className="setting-note">Ohne Vorlesen stehen die Sätze groß oben im Bild – zum Vorlesen durch Erwachsene.</p>
            )}
            <Toggle label="Töne" checked={settings.sounds} onChange={(sounds) => update({ sounds })} />
          </SettingsGroup>

          <SettingsGroup title="Verhalten">
            <Toggle label="Ruhiger Modus (leiser, weniger Bewegung, langsamer)" checked={settings.calm} onChange={(calm) => update({ calm })} />
          </SettingsGroup>
        </>
      }
    >
      {kita ? <KitaPlay settings={settings} /> : <BearPlay settings={settings} />}
    </GameShell>
  );
}
