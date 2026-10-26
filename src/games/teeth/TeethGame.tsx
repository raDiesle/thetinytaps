import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { useCommonSettings, useGameSettings } from "@/lib/common";
import { useDevice } from "@/lib/device";
import { useAppLanguage, useT } from "@/lib/language";
import { SUNG_LANGUAGES } from "./music";
import { DEFAULT_TEETH_SETTINGS, TEETH_SETTINGS_KEY } from "./settings";
import { KAI } from "./steps";
import { SUNG_LABELS, sungLanguageFor } from "./sung";
import { TeethPlay } from "./TeethPlay";

export function TeethGame() {
  const [shared, update, stored] = useGameSettings(TEETH_SETTINGS_KEY, DEFAULT_TEETH_SETTINGS);
  // The spoken hints have their own switch here, independent of "Vorlesen" on the home page.
  const settings = { ...shared, speech: stored.speech };
  const [common] = useCommonSettings();
  const { touchOnly } = useDevice();
  const language = useAppLanguage();
  const t = useT();
  // "auto" shows as what it plays: the song in the app language, else in the browser's language or English, else "Nur Musik".
  const singing = sungLanguageFor(settings.singing, language.id, SUNG_LANGUAGES) ?? "off";

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
              de: "Morgens geht die Sonne auf und am Kinn kleben Frühstückskrümel; abends scheint der Mond, der Ärmel ist ein Schlafanzug und zum Schluss heißt es „Gute Nacht“. Nach der Uhr ist bis 14 Uhr morgens.",
              ru: "Утром встаёт солнце и на подбородке крошки от завтрака; вечером светит луна, рукав — это пижама, а в конце звучит «Спокойной ночи». «По часам» — до 14:00 считается утром.",
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
          <Choice
            label={t({ de: "Tageszeit", ru: "Время суток" })}
            value={settings.daytime}
            options={[
              { value: "auto", label: t({ de: "🕑 Nach der Uhr", ru: "🕑 По часам" }) },
              { value: "morning", label: t({ de: "☀️ Morgens", ru: "☀️ Утром" }) },
              { value: "evening", label: t({ de: "🌙 Abends", ru: "🌙 Вечером" }) },
            ]}
            onChange={(daytime) => update({ daytime })}
          />
          <Toggle
            label={t({
              de: "Vorher zeigen: Wie Zuckermonster entstehen (Süßes, dann wachsen sie)",
              ru: "Сначала показать: откуда берутся сахарные монстры (сладкое, потом они вырастают)",
            })}
            checked={settings.origin}
            onChange={(origin) => update({ origin })}
          />
          <Toggle
            label={t({ de: "Vorher zeigen: Zahnbürste holen, Zahnpasta drauf", ru: "Сначала показать: взять щётку, выдавить пасту" })}
            checked={settings.prep}
            onChange={(prep) => update({ prep })}
          />
          <Toggle
            label={t({
              de: "Ansagen vorlesen („Mund weit auf!“) – auch wenn „Vorlesen“ auf der Startseite aus ist",
              ru: "Читать подсказки вслух («Открой ротик широко!») — даже если «Читать вслух» на главной странице выключено",
            })}
            checked={settings.speech}
            onChange={(speech) => update({ speech })}
          />
          <Toggle
            label={t({
              de: "Wochenbild am Ende: ein Stern für jedes Putzen morgens und abends",
              ru: "Неделя в конце: звёздочка за каждую чистку утром и вечером",
            })}
            checked={settings.week}
            onChange={(week) => update({ week })}
          />
          <Toggle label={t({ de: "Musik beim Putzen", ru: "Музыка во время чистки" })} checked={settings.music} onChange={(music) => update({ music })} />
          {!common.music && (
            <p className="setting-note">
              {t({ de: "Die Musik ist für alle Spiele aus (⚙️ auf der Startseite).", ru: "Музыка выключена для всех игр (⚙️ на главной странице)." })}
            </p>
          )}
          {settings.music && SUNG_LANGUAGES.length > 0 && (
            <>
              <Choice
                label={t({ de: "Gesungen", ru: "Песенка" })}
                value={singing}
                options={[
                  { value: "off", label: t({ de: "🎶 Nur Musik", ru: "🎶 Только музыка" }) },
                  ...SUNG_LANGUAGES.map((lang) => ({ value: lang, label: SUNG_LABELS[lang] ? t(SUNG_LABELS[lang]) : lang })),
                ]}
                onChange={(singing) => update({ singing })}
              />
              <p className="setting-note">
                {t({
                  de: "Das Lied singt zu jedem Schritt, was gerade dran ist, und das Putzen dauert so lange wie das Lied, gut 2 Minuten. Mit „Nur Musik“ sind es genau 2 Minuten.",
                  ru: "Песенка поёт к каждому шагу, что сейчас делать, и чистка длится столько же, сколько песенка, — чуть больше 2 минут. С «Только музыка» — ровно 2 минуты.",
                })}
              </p>
            </>
          )}
        </SettingsGroup>
      }
    >
      {/* Its own song, which plays only while music is on for all games too. */}
      <TeethPlay settings={{ ...settings, music: settings.music && common.music }} />
    </GameShell>
  );
}
