import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useT } from "@/lib/language";
import { PartyPlay } from "./PartyPlay";
import { PottyPlay } from "./PottyPlay";
import { DEFAULT_POTTY_SETTINGS, POTTY_SETTINGS_KEY, type PottyMode } from "./settings";
import "./potty.css";

/** The game's name, on its start screen and in the browser tab. */
export const POTTY_TITLE: Localized = { de: "Aufs Töpfchen", ru: "На горшок" };

export function PottyGame() {
  const t = useT();
  const [settings, update] = useGameSettings(POTTY_SETTINGS_KEY, DEFAULT_POTTY_SETTINGS);
  const { touchOnly } = useDevice();

  return (
    <GameShell
      title={t(POTTY_TITLE)}
      emoji="🚽"
      modes={[
        { id: "story", emoji: "🚽", title: t({ de: "Muss mal!", ru: "Хочу на горшок!" }) },
        { id: "party", emoji: "🎉", title: t({ de: "Hat geklappt!", ru: "Получилось!" }) },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as PottyMode })}
      // Opened when the child has to go: the story starts at once; „Hat geklappt!“ and the info are behind ✕.
      startMode="story"
      info={
        <>
          <p>
            {t({
              de: "„Muss mal!“: Tapsi der Fuchs isst und trinkt abwechselnd, gleich vom Start an – dann drückt die Blase oder der Bauch brummelt, je nachdem, was Ihr Kind gesagt hat: Solange Tapsi isst und trinkt, stehen unten rechts drei runde Knöpfe – 💧 Pipi, 💩 Kaka oder ❓ weiß nicht (dann muss Tapsi einfach mal; das gilt auch, wenn keiner getippt wird). Tapsi ruft Mama und Papa, und alle gehen zusammen ins Bad: Hose runter, aufs Töpfchen, abwischen, Hose hoch, ausleeren und abziehen, Hände waschen – und dann wird gefeiert. Jedes Tippen ist ein Schritt; unten zeigt eine Reihe Bilder, welcher dran ist – tippen Sie dort auf ein Bild, springt die Geschichte sofort zu diesem Schritt.",
              ru: "«Хочу на горшок!»: лисёнок Тапси ест и пьёт по очереди, прямо с самого начала, – потом пи-пи просится наружу или в животике бурчит, смотря что сказал ваш ребёнок: пока Тапси ест и пьёт, справа внизу три круглые кнопки – 💧 пи-пи, 💩 ка-ка или ❓ не знаю (тогда Тапси просто надо на горшок; так же, если никто не нажал). Тапси зовёт маму и папу, и все вместе идут в ванную: штанишки вниз, на горшок, вытереть, штанишки вверх, вылить и смыть, помыть руки – а потом праздник. Каждое нажатие – это шаг; внизу ряд картинок показывает, какой шаг сейчас, – нажмите там на картинку, и история сразу перейдёт к этому шагу.",
            })}
          </p>
          <p>
            {t({
              de: "Auf dem Töpfchen darf man sich Zeit lassen: Solange Tapsi sitzt, machen Mama und Papa bei jedem Tippen etwas anderes – bei Pipi plätschert Wasser (Gießkanne, Wasserhahn, Dusche), bei Kaka wird gedrückt (Zahnpasta, Luftballon aufpusten, schwerer Korb), bei ❓ beides im Wechsel, und zwischendurch Quatsch (tanzen, jonglieren, Kuckuck). Dazu spielt ein Warte-Lied. Erst einer der drei großen grünen Haken unten rechts sagt „fertig“ – so kann Ihr Kind auf dem echten Töpfchen mit Tapsi zusammen sitzen, und Sie tippen den Haken mit dem Tropfen 💧, wenn Pipi kam, den mit dem Kaka 💩 oder den mit beidem 💧💩. Was kam, zeigt dann auch Tapsis Töpfchen.",
              ru: "На горшке можно не торопиться: пока Тапси сидит, мама и папа при каждом нажатии делают что-то другое – при пи-пи журчит вода (лейка, кран, душ), при ка-ка что-то выдавливают (зубная паста, надуть шарик, тяжёлая корзина), при ❓ то и другое по очереди, а между делом – дурачатся (танцуют, жонглируют, ку-ку). А ещё играет песенка для ожидания. Только одна из трёх больших зелёных галочек справа внизу говорит «готово» – так ваш ребёнок может сидеть на настоящем горшке вместе с Тапси, а вы нажимаете галочку с капелькой 💧, если было пи-пи, с ка-ка 💩 или с тем и другим 💧💩. Что получилось, видно потом и в горшке у Тапси.",
            })}
          </p>
          <p>
            {t({
              de: "„Hat geklappt!“ ist für echte Erfolge: Öffnen Sie es, wenn Ihr Kind es aufs Töpfchen geschafft hat. Ein Tipp bringt Applaus, Konfetti und einen Stern für heute auf die Wochentafel. Ein Mal Öffnen ist ein Stern. Nichts geht verloren, und es gibt keine leeren Felder als „nicht geschafft“.",
              ru: "«Получилось!» – для настоящих успехов: откройте, когда ваш ребёнок сходил на горшок. Одно нажатие – аплодисменты, конфетти и звёздочка за сегодня на доске недели. Одно открытие – одна звёздочка. Ничего не пропадает, и пустых клеток «не получилось» нет.",
            })}
          </p>
          <p>
            {t({
              de: "Das Spiel startet sofort mit „Muss mal!“, wenn Sie es öffnen – hierher kommen Sie, wenn Sie ✕ gedrückt halten. Töpfchentraining beginnt meist zwischen 2 und 3 Jahren, wenn das Kind merkt, dass es muss. Druck hilft nicht; Mitfreuen und feste Zeiten (nach dem Aufwachen, nach dem Essen) schon.",
              ru: "Игра сразу начинается с «Хочу на горшок!», когда вы её открываете, – сюда вы попадёте, если удержите ✕. Приучение к горшку обычно начинается между 2 и 3 годами, когда ребёнок замечает, что ему надо. Давление не помогает, а радоваться вместе и постоянное время (после сна, после еды) – помогают.",
            })}
            {!touchOnly && (
              <>
                {" "}
                {t({
                  de: "Mit der Tastatur: jede Taste ist ein Tippen, beim Sitzen ist Enter der Haken für das, was Ihr Kind gesagt hat (bei ❓ Pipi); die anderen tippen Sie mit der Maus an.",
                  ru: "С клавиатуры: каждая клавиша – это нажатие, на горшке Enter – галочка для того, что сказал ваш ребёнок (при ❓ – пи-пи); остальные нажимайте мышкой.",
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
