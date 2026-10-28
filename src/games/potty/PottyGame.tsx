import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useT } from "@/lib/language";
import { PottyPlay } from "./PottyPlay";
import { DEFAULT_POTTY_SETTINGS, POTTY_SETTINGS_KEY } from "./settings";
import "./potty.css";

/** The game's name, on its start screen and in the browser tab. */
export const POTTY_TITLE: Localized = { de: "Aufs Töpfchen" };

export function PottyGame() {
  const t = useT();
  const [settings] = useGameSettings(POTTY_SETTINGS_KEY, DEFAULT_POTTY_SETTINGS);
  const { touchOnly } = useDevice();

  return (
    <GameShell
      title={t(POTTY_TITLE)}
      emoji="🚽"
      // Opened when the child has to go: the story starts at once, with no modes to pick (the star is its last step);
      // after ✕ the start screen has only „Los geht’s!“ and the info.
      startMode="story"
      info={
        <>
          <p>
            {t({
              de: "Tapsi der Fuchs isst und trinkt abwechselnd, gleich vom Start an – dann drückt die Blase oder der Bauch brummelt. Wenn Tapsi Mama und Papa ruft, tippen Sie unten rechts, was Ihr Kind gesagt hat: 💧 Pipi, 💩 Kaka oder 💧💩 beides (auch, wenn Sie es nicht wissen). Dann gehen alle zusammen ins Bad: und alle gehen zusammen ins Bad: Hose runter, aufs Töpfchen, abwischen, Hose hoch, ausleeren und abziehen, Hände waschen – dann wird gefeiert, und zum Schluss zeigt eine Wochentafel die Sterne. Jedes Tippen ist ein Schritt; unten zeigt eine Reihe Bilder, welcher dran ist – tippen Sie dort auf ein Bild, springt die Geschichte sofort zu diesem Schritt.",
            })}
          </p>
          <p>
            {t({
              de: "Auf dem Töpfchen darf man sich Zeit lassen: Solange Tapsi sitzt, denkt es in einer Blase an etwas, das hilft – bei Pipi plätschert Wasser (Gießkanne, Brunnen, Regen), bei Kaka wird gedrückt (Ketchup, Luftballon aufpusten, Knete), bei beidem im Wechsel; bei jedem Tippen kommt das nächste. Dazu spielt ein Warte-Lied. Erst einer der beiden großen grünen Haken unten rechts sagt „fertig“ – so kann Ihr Kind auf dem echten Töpfchen mit Tapsi zusammen sitzen, und Sie tippen den Haken mit dem Tropfen 💧, wenn Pipi kam, oder den mit dem Kaka 💩 (bei beidem einen davon). Kam nichts, tippen Sie „nichts“: Dann wäscht Tapsi die Hände und spielt.",
            })}
          </p>
          <p>
            {t({
              de: "Der Stern ist für echte Erfolge: Haben Sie beim Sitzen einen grünen Haken getippt, kommt am Ende ein Stern für heute auf die Wochentafel – einer pro Runde. Ohne Haken zeigt die Tafel nur die Sterne, die schon da sind. Nichts geht verloren, und es gibt keine leeren Felder als „nicht geschafft“.",
            })}
          </p>
          <p>
            {t({
              de: "Das Spiel startet sofort, wenn Sie es öffnen – hierher kommen Sie, wenn Sie ✕ gedrückt halten. Töpfchentraining beginnt meist zwischen 2 und 3 Jahren, wenn das Kind merkt, dass es muss. Druck hilft nicht; Mitfreuen und feste Zeiten (nach dem Aufwachen, nach dem Essen) schon.",
            })}
            {!touchOnly && (
              <>
                {" "}
                {t({
                  de: "Mit der Tastatur: jede Taste ist ein Tippen, beim Sitzen ist Enter der Haken für das, was Ihr Kind gesagt hat (sonst Pipi); die anderen tippen Sie mit der Maus an.",
                })}
              </>
            )}
          </p>
        </>
      }
    >
      <PottyPlay settings={settings} />
    </GameShell>
  );
}
