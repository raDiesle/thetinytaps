import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { type Localized, useT } from "@/lib/language";
import { PottyPlay } from "./PottyPlay";
import { DEFAULT_POTTY_SETTINGS, POTTY_SETTINGS_KEY } from "./settings";
import "./potty.css";

/** The game's name, on its start screen and in the browser tab. */
export const POTTY_TITLE: Localized = { de: "Aufs Töpfchen", ru: "На горшок" };

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
              de: "Tapsi der Fuchs isst und trinkt abwechselnd, gleich vom Start an – dann drückt die Blase oder der Bauch brummelt. Wenn Tapsi Mama und Papa ruft, tippen Sie unten rechts, was Ihr Kind gesagt hat: 💧 Pipi, 💩 Kaka oder 💧💩 beides (auch, wenn Sie es nicht wissen). Dann gehen alle zusammen ins Bad: Hose runter, aufs Töpfchen, abwischen, Hose hoch, ausleeren und abziehen, Hände waschen – dann wird gefeiert, und zum Schluss zeigt eine Wochentafel die Sterne. Jedes Tippen ist ein Schritt; unten zeigt eine Reihe Bilder, welcher dran ist – tippen Sie dort auf ein Bild, springt die Geschichte sofort zu diesem Schritt.",
              ru: "Лисёнок Тапси ест и пьёт по очереди, прямо с самого начала, – потом пи-пи просится наружу или в животике бурчит. Когда Тапси зовёт маму и папу, нажмите справа внизу, что сказал ваш ребёнок: 💧 пи-пи, 💩 ка-ка или 💧💩 и то и другое (и если вы не знаете). Потом все вместе идут в ванную: штанишки вниз, на горшок, вытереть, штанишки вверх, вылить и смыть, помыть руки – потом праздник, а в конце доска недели показывает звёздочки. Каждое нажатие – это шаг; внизу ряд картинок показывает, какой шаг сейчас, – нажмите там на картинку, и история сразу перейдёт к этому шагу.",
            })}
          </p>
          <p>
            {t({
              de: "Auf dem Töpfchen darf man sich Zeit lassen: Solange Tapsi sitzt, denkt es in einer Blase an etwas, das hilft – bei Pipi plätschert Wasser (Gießkanne, Brunnen, Regen), bei Kaka wird gedrückt (Ketchup, Luftballon aufpusten, Knete), bei beidem im Wechsel; bei jedem Tippen kommt das nächste. Dazu spielt ein Warte-Lied. Erst einer der beiden großen grünen Haken unten rechts sagt „fertig“ – so kann Ihr Kind auf dem echten Töpfchen mit Tapsi zusammen sitzen, und Sie tippen den Haken mit dem Tropfen 💧, wenn Pipi kam, oder den mit dem Kaka 💩 (bei beidem einen davon). Kam nichts, tippen Sie „nichts“: Dann wäscht Tapsi die Hände und spielt.",
              ru: "На горшке можно не торопиться: пока Тапси сидит, он думает в облачке о том, что помогает, – при пи-пи журчит вода (лейка, фонтан, дождь), при ка-ка что-то выдавливается (кетчуп, надуть шарик, пластилин), при том и другом – по очереди; при каждом нажатии появляется следующее. А ещё играет песенка для ожидания. Только одна из двух больших зелёных галочек справа внизу говорит «готово» – так ваш ребёнок может сидеть на настоящем горшке вместе с Тапси, а вы нажимаете галочку с капелькой 💧, если было пи-пи, или с ка-ка 💩 (если и то и другое – любую из них). Если ничего не было, нажмите «ничего»: тогда Тапси моет руки и играет.",
            })}
          </p>
          <p>
            {t({
              de: "Der Stern ist für echte Erfolge: Haben Sie beim Sitzen einen grünen Haken getippt, kommt am Ende ein Stern für heute auf die Wochentafel – einer pro Runde. Ohne Haken zeigt die Tafel nur die Sterne, die schon da sind. Nichts geht verloren, und es gibt keine leeren Felder als „nicht geschafft“.",
              ru: "Звёздочка – для настоящих успехов: если вы нажали зелёную галочку, пока Тапси сидел, в конце на доске недели появляется звёздочка за сегодня – одна за раунд. Без галочки доска показывает только те звёздочки, что уже есть. Ничего не пропадает, и пустых клеток «не получилось» нет.",
            })}
          </p>
          <p>
            {t({
              de: "Das Spiel startet sofort, wenn Sie es öffnen – hierher kommen Sie, wenn Sie ✕ gedrückt halten. Töpfchentraining beginnt meist zwischen 2 und 3 Jahren, wenn das Kind merkt, dass es muss. Druck hilft nicht; Mitfreuen und feste Zeiten (nach dem Aufwachen, nach dem Essen) schon.",
              ru: "Игра сразу начинается, когда вы её открываете, – сюда вы попадёте, если удержите ✕. Приучение к горшку обычно начинается между 2 и 3 годами, когда ребёнок замечает, что ему надо. Давление не помогает, а радоваться вместе и постоянное время (после сна, после еды) – помогают.",
            })}
            {!touchOnly && (
              <>
                {" "}
                {t({
                  de: "Mit der Tastatur: jede Taste ist ein Tippen, beim Sitzen ist Enter der Haken für das, was Ihr Kind gesagt hat (sonst Pipi); die anderen tippen Sie mit der Maus an.",
                  ru: "С клавиатуры: каждая клавиша – это нажатие, на горшке Enter – галочка для того, что сказал ваш ребёнок (иначе пи-пи); остальные нажимайте мышкой.",
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
