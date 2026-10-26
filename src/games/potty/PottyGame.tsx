import { GameShell } from "@/components/GameShell";
import { Choice } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useT } from "@/lib/language";
import { ANIMALS, type AnimalId, animalById } from "./content";
import { PartyPlay } from "./PartyPlay";
import { PottyPlay } from "./PottyPlay";
import { DEFAULT_POTTY_SETTINGS, POTTY_SETTINGS_KEY, type PottyMode } from "./settings";
import "./potty.css";

/** The game's name, on its start screen and in the browser tab. */
export const POTTY_TITLE: Localized = { de: "Aufs Töpfchen" };

export function PottyGame() {
  const t = useT();
  const [settings, update] = useGameSettings(POTTY_SETTINGS_KEY, DEFAULT_POTTY_SETTINGS);
  const { touchOnly } = useDevice();
  const animal = animalById(settings.animal);

  return (
    <GameShell
      title={t(POTTY_TITLE)}
      emoji="🚽"
      modes={[
        { id: "story", emoji: animal.emoji, title: t({ de: "Muss mal!" }) },
        { id: "party", emoji: "🎉", title: t({ de: "Hat geklappt!" }) },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as PottyMode })}
      level={
        <Choice<AnimalId>
          label={t({ de: "Wer muss mal?" })}
          value={settings.animal}
          onChange={(animal) => update({ animal })}
          options={ANIMALS.map((a) => ({ value: a.id, label: `${a.emoji} ${a.name}` }))}
        />
      }
      info={
        <>
          <p>
            {t({
              de: "„Muss mal!“: Tapsi der Fuchs (oder Bruno der Bär, Hoppel der Hase) muss aufs Töpfchen. Jedes Tippen ist ein Schritt: hinlaufen, Hose runter, hinsetzen, warten, abwischen, Hose hoch, ausleeren und abziehen, Hände waschen – und dann wird gefeiert. Unten zeigt eine Reihe Bilder, welcher Schritt dran ist.",
            })}
          </p>
          <p>
            {t({
              de: "Beim Sitzen spielt ein Warte-Lied, so lange es dauert – es wiederholt sich, bis jemand tippt. Dann plätschert es, und das nächste Tippen geht weiter. So kann das Kind mit dem Tier zusammen sitzen, und das Kind sieht: Auf dem Töpfchen darf man sich Zeit lassen. Tippen während eines Schritts lässt nur Farben aufsteigen.",
            })}
          </p>
          <p>
            {t({
              de: "„Hat geklappt!“ ist für echte Erfolge: Öffnen Sie es, wenn Ihr Kind es aufs Töpfchen geschafft hat. Ein Tipp bringt Applaus, Konfetti und einen Stern für heute auf die Wochentafel. Ein Mal Öffnen ist ein Stern. Nichts geht verloren, und es gibt keine leeren Felder als „nicht geschafft“.",
            })}
          </p>
          <p>
            {t({
              de: "Töpfchentraining beginnt meist zwischen 2 und 3 Jahren, wenn das Kind merkt, dass es muss. Druck hilft nicht; Mitfreuen und feste Zeiten (nach dem Aufwachen, nach dem Essen) schon.",
            })}
            {!touchOnly && <> {t({ de: "Mit der Tastatur: jede Taste ist ein Tippen." })}</>}
          </p>
        </>
      }
    >
      {settings.mode === "party" ? <PartyPlay settings={settings} onStory={() => update({ mode: "story" })} /> : <PottyPlay settings={settings} />}
    </GameShell>
  );
}
