import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { FEELINGS } from "./bear";
import { BearPlay } from "./BearPlay";
import { SITUATIONS } from "./kita";
import { KitaPlay } from "./KitaPlay";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY, type FeelingsSettings } from "./settings";
import "./feelings.css";

/** Card ids: the bear, or the kindergarten with shown or chosen answers. */
const MODE_PATCH: Record<string, Partial<FeelingsSettings>> = {
  bear: { mode: "bear" },
  "kita-show": { mode: "kita", answers: "show" },
  "kita-choose": { mode: "kita", answers: "choose" },
};

export function FeelingsGame() {
  const [settings, update] = useGameSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);
  const kita = settings.mode === "kita";

  return (
    <GameShell
      title="Gefühle"
      emoji="🐻"
      modes={[
        { id: "bear", emoji: "🐻", title: "Bär trösten" },
        { id: "kita-show", emoji: "🏫", title: "Im Kindergarten" },
        { id: "kita-choose", emoji: "🤔", title: "Kindergarten: selbst wählen" },
      ]}
      mode={kita ? `kita-${settings.answers}` : "bear"}
      onMode={(id) => update(MODE_PATCH[id])}
      level={
        <>
          <Choice<FeelingsSettings["feeling"]>
            label="🐻 Bär trösten: Gefühl"
            value={settings.feeling}
            onChange={(feeling) => update({ feeling })}
            options={[
              { value: "all", label: "🌈 Alle" },
              ...FEELINGS.map((f) => ({ value: f.id, label: `${f.emoji} ${f.title}` })),
            ]}
          />
          <Choice<FeelingsSettings["situation"]>
            label="🏫 Kindergarten: Geschichte"
            value={settings.situation}
            onChange={(situation) => update({ situation })}
            options={[
              { value: "all", label: "🌈 Alle" },
              ...SITUATIONS.map((s) => ({ value: s.id, label: `${s.emoji} ${s.title}` })),
            ]}
          />
        </>
      }
      settings={
        <>
          <SettingsGroup title="🏫 Im Kindergarten">
            <p className="setting-note">
              Kleine Geschichten: Jemand schubst, tritt oder nimmt etwas weg, die Rutsche ist voll, ein anderes Kind hat das tolle
              Spielzeug – oder der kleine Bär ist selbst wütend. Das Kind tippt, was der Bär tun kann: laut „Stopp! Nein!“ sagen,
              weggehen und Abstand halten, Hilfe holen, fragen, warten, tauschen.
            </p>
            <p className="setting-note">
              Jede Antwort ist ein Bild, auf dem der Bär es vormacht – so kann das Kind ohne Lesen wählen. Beim Selbst-Wählen steht neben
              dem ersten Schritt eine nicht so gute Idee (z.&nbsp;B. zurückschubsen). Tippt das Kind darauf, erscheint sie groß in der Mitte
              mit rotem Kreuz und es wird erklärt, warum. Die gute Idee bekommt einen grünen Haken.
            </p>
          </SettingsGroup>

          {!settings.speech && (
            <p className="setting-note">
              Im Spiel steht kein Text, nur Bilder. Mit Vorlesen (auf der Startseite) wird die Geschichte erzählt, sonst erzählen
              Erwachsene sie anhand der Bilder.
            </p>
          )}
        </>
      }
    >
      {kita ? <KitaPlay settings={settings} /> : <BearPlay settings={settings} />}
    </GameShell>
  );
}
