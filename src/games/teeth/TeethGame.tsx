import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { useT } from "@/lib/language";
import { DEFAULT_TEETH_SETTINGS, type TeethSettings, TEETH_SETTINGS_KEY } from "./settings";
import { KAI } from "./steps";
import { TeethPlay } from "./TeethPlay";

/** What is shown before the brushing, as one choice: the sweets story, the sink, both or neither. */
type Before = "both" | "origin" | "prep" | "none";

const BEFORE: Record<Before, Pick<TeethSettings, "origin" | "prep">> = {
  both: { origin: true, prep: true },
  origin: { origin: true, prep: false },
  prep: { origin: false, prep: true },
  none: { origin: false, prep: false },
};

const beforeOf = ({ origin, prep }: TeethSettings): Before => (origin ? (prep ? "both" : "origin") : prep ? "prep" : "none");

export function TeethGame() {
  const [settings, update] = useGameSettings(TEETH_SETTINGS_KEY, DEFAULT_TEETH_SETTINGS);
  const { touchOnly } = useDevice();
  const t = useT();

  return (
    <GameShell
      title={t({ de: "Zähne putzen", ru: "Чистим зубы" })}
      emoji="🦷"
      info={
        <>
          <p>
            {t({
              de: `Gerät hinstellen und los: Niemand muss tippen. Geputzt wird in sieben Schritten nach KAI (${KAI.de}). Das Bild zeigt jedes Mal, ob der Mund weit auf ist oder die Zähne zusammen sind (Pfeile an den Lippen zeigen, wann er auf- oder zugeht) und welche Zähne gerade dran sind. Auf allen noch nicht geputzten Zähnen sitzen Zuckermonster, die beim Putzen nach und nach verschwinden. Der Bildschirm bleibt dabei an.`,
              ru: `Поставьте устройство — и вперёд: нажимать ничего не нужно. Чистим в семь шагов по порядку: ${t(KAI)}. Картинка каждый раз показывает, широко ли открыт рот или зубки сомкнуты (стрелки у губ показывают, когда открыть или закрыть рот), и какие зубы чистить сейчас. На всех ещё не почищенных зубах сидят сахарные монстры, они по очереди исчезают при чистке. Экран при этом не гаснет.`,
            })}
          </p>
          <p>
            {t({
              de: "Bis 14 Uhr ist morgens: Die Sonne geht auf und am Kinn kleben Frühstückskrümel. Danach ist abends: Der Mond scheint, der Ärmel ist ein Schlafanzug und zum Schluss heißt es „Gute Nacht“.",
              ru: "До 14:00 — утро: встаёт солнышко, а на подбородке крошки от завтрака. Потом — вечер: светит луна, рукав — это пижама, а в конце звучит «Спокойной ночи».",
            })}
          </p>
          <p>
            {t({
              de: "Zahnärzte empfehlen: zweimal täglich Zahnpasta mit Fluorid (1000 ppm), unter 2 Jahren reiskorngroß, ab 2 Jahren erbsengroß. Danach ausspucken, nicht nachspülen. Bis ins Grundschulalter putzen Eltern nach.",
              ru: "Стоматологи советуют: дважды в день паста со фтором (1000 ppm), до 2 лет — с рисовое зёрнышко, с 2 лет — с горошину. Потом сплюнуть, не полоскать. До младшей школы родители дочищают зубы за ребёнком.",
            })}
          </p>
          <p>
            {t({
              de: "Unten neben dem Fortschrittsbalken pausiert ⏸️ das Putzen. Tippen oder Ziehen auf dem Balken springt an diese Stelle.",
              ru: "Внизу рядом с полосой прогресса кнопка ⏸️ ставит чистку на паузу. Нажатие или перетаскивание по полосе переносит в это место.",
            })}
            {!touchOnly && (
              <>
                {" "}
                {t({ de: "Mit Tastatur:", ru: "С клавиатуры:" })} <kbd>←</kbd> <kbd>→</kbd>{" "}
                {t({ de: "springen zum vorigen oder nächsten Schritt, die", ru: "— к предыдущему или следующему шагу," })}{" "}
                <kbd>{t({ de: "Leertaste", ru: "Пробел" })}</kbd> {t({ de: "pausiert.", ru: "— пауза." })}
              </>
            )}
          </p>
        </>
      }
      settings={
        <SettingsGroup title={t({ de: "Putzen", ru: "Чистка" })}>
          <Choice<Before>
            label={t({ de: "Vorher zeigen", ru: "Сначала показать" })}
            value={beforeOf(settings)}
            options={[
              { value: "both", label: t({ de: "🍬 + 🪥 Beides", ru: "🍬 + 🪥 Всё вместе" }) },
              { value: "origin", label: t({ de: "🍬 Zuckermonster", ru: "🍬 Сахарные монстры" }) },
              { value: "prep", label: t({ de: "🪥 Zahnpasta", ru: "🪥 Зубная паста" }) },
              { value: "none", label: t({ de: "⏩ Gleich putzen", ru: "⏩ Сразу чистить" }) },
            ]}
            onChange={(before) => update(BEFORE[before])}
          />
          <p className="setting-note">
            {t({
              de: "🍬 Wie Süßes zu Zuckermonstern wird. 🪥 Zahnbürste holen, Zahnpasta drauf.",
              ru: "🍬 Как сладкое превращается в сахарных монстров. 🪥 Достаём щётку, выдавливаем пасту.",
            })}
          </p>
          <Toggle
            label={t({ de: "⭐ Wochenbild: ein Stern für jedes Putzen", ru: "⭐ Неделя: звёздочка за каждую чистку" })}
            checked={settings.week}
            onChange={(week) => update({ week })}
          />
          <p className="setting-note">
            {t({
              de: "🎵 Das Zahnputzlied singt zu jedem Schritt, was dran ist, in der Sprache der App (🌐 auf der Startseite). Das Putzen dauert so lange wie das Lied, gut 2 Minuten. Es spielt immer, auch wenn die Musik aus ist.",
              ru: "🎵 Песенка на каждом шаге поёт, что сейчас чистим, на языке приложения (🌐 на главной странице). Чистка длится столько же, сколько песенка, — чуть больше 2 минут. Она звучит всегда, даже когда музыка выключена.",
            })}
          </p>
        </SettingsGroup>
      }
    >
      <TeethPlay settings={settings} />
    </GameShell>
  );
}
