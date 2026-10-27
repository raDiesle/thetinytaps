import { GameShell } from "@/components/GameShell";
import { Choice } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useT } from "@/lib/language";
import { PartyPlay } from "./PartyPlay";
import { PottyPlay } from "./PottyPlay";
import { SAID, type Said } from "./content";
import { DEFAULT_POTTY_SETTINGS, POTTY_SETTINGS_KEY, type PottyMode } from "./settings";
import "./potty.css";

/** The game's name, on its start screen and in the browser tab. */
export const POTTY_TITLE: Localized = { de: "Aufs Töpfchen" };

/** How the choices of what the child said are named for the grown-up. */
const SAID_LABELS: Record<Said, Localized> = { unsure: { de: "Weiß nicht" }, pipi: { de: "Pipi" }, kaka: { de: "Kaka" } };

export function PottyGame() {
  const t = useT();
  const [settings, update] = useGameSettings(POTTY_SETTINGS_KEY, DEFAULT_POTTY_SETTINGS);
  const { touchOnly } = useDevice();

  return (
    <GameShell
      title={t(POTTY_TITLE)}
      emoji="🚽"
      modes={[
        { id: "story", emoji: "🚽", title: t({ de: "Muss mal!" }) },
        { id: "party", emoji: "🎉", title: t({ de: "Hat geklappt!" }) },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as PottyMode })}
      level={
        <Choice<Said>
          label={t({ de: "Was hat Ihr Kind gesagt?" })}
          value={settings.said}
          onChange={(said) => update({ said })}
          options={SAID.map((s) => ({ value: s.id, label: `${s.emoji} ${t(SAID_LABELS[s.id])}` }))}
        />
      }
      info={
        <>
          <p>
            {t({
              de: "„Muss mal!“: Tapsi der Fuchs isst und trinkt – dann drückt die Blase oder der Bauch brummelt, je nachdem, was Ihr Kind gesagt hat (oben: Pipi, Kaka oder „Weiß nicht“, dann muss Tapsi einfach mal). Tapsi ruft Mama und Papa, und alle gehen zusammen ins Bad: Hose runter, aufs Töpfchen, abwischen, Hose hoch, ausleeren und abziehen, Hände waschen – und dann wird gefeiert. Jedes Tippen ist ein Schritt; unten zeigt eine Reihe Bilder, welcher dran ist.",
            })}
          </p>
          <p>
            {t({
              de: "Auf dem Töpfchen darf man sich Zeit lassen: Solange Tapsi sitzt, machen Mama und Papa bei jedem Tippen etwas anderes – bei Pipi plätschert Wasser (Gießkanne, Wasserhahn, Dusche), bei Kaka wird gedrückt (Zahnpasta, Luftballon aufpusten, schwerer Korb), bei „Weiß nicht“ beides im Wechsel, und zwischendurch Quatsch (tanzen, jonglieren, Kuckuck). Dazu spielt ein Warte-Lied. Erst einer der beiden großen grünen Haken unten rechts sagt „fertig“ – so kann Ihr Kind auf dem echten Töpfchen mit Tapsi zusammen sitzen, und Sie tippen den Haken mit dem Tropfen 💧, wenn Pipi kam, oder den mit dem Kaka 💩. Was kam, zeigt dann auch Tapsis Töpfchen.",
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
            {!touchOnly && (
              <>
                {" "}
                {t({
                  de: "Mit der Tastatur: jede Taste ist ein Tippen, beim Sitzen ist Enter der Haken für das, was Ihr Kind gesagt hat (bei „Weiß nicht“ Pipi); den anderen tippen Sie mit der Maus an.",
                })}
              </>
            )}
          </p>
        </>
      }
    >
      {settings.mode === "party" ? <PartyPlay settings={settings} onStory={() => update({ mode: "story" })} /> : <PottyPlay settings={settings} />}
    </GameShell>
  );
}
