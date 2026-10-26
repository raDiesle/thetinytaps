import { GameShell } from "@/components/GameShell";
import { useLanguages } from "@/components/LanguageSetting";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { TouchKeysSetting, useTouchKeys } from "@/components/TouchKeyboard";
import { sampleLetter } from "@/content/languages";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import {
  DEFAULT_LETTERS_SETTINGS,
  LETTERS_SETTINGS_KEY,
  type Announce,
  type LetterCase,
  type LettersMode,
  type LettersSettings,
  type NumberReveal,
} from "./settings";
import { FindPlay } from "./FindPlay";
import { LettersPlay } from "./LettersPlay";
import { TrainPlay } from "./TrainPlay";

export function LettersGame() {
  const [settings, update] = useGameSettings(LETTERS_SETTINGS_KEY, DEFAULT_LETTERS_SETTINGS);
  const languages = useLanguages();
  const pack = languages.language.pack;
  const second = languages.second?.pack ?? null;
  // Examples in the settings, in the chosen language: „Be, wie Bär“.
  const b = sampleLetter(pack);
  const a = pack.letters[0];
  const t = useT();
  const quote = (text: string) => t({ de: `„${text}“`, ru: `«${text}»` });
  const findTitle = t({ de: `Wo ist das ${b.upper}?`, ru: `Где буква ${b.upper}?` });
  // Free typing: the ABC keys on every touch screen, the other modes only on tablets.
  const anyTouch = settings.mode === "free";
  const touchKeys = useTouchKeys(settings.touchKeys, anyTouch);

  return (
    <GameShell
      title={t({ de: "Buchstaben & Zahlen", ru: "Буквы и цифры" })}
      emoji="🔤"
      modes={[
        { id: "free", emoji: "⌨️", title: t({ de: "Frei tippen", ru: "Печатать что хочешь" }) },
        { id: "find", emoji: "🔍", title: findTitle },
        { id: "train", emoji: "🚂", title: t({ de: "Buchstaben-Zug", ru: "Поезд из букв" }) },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as LettersMode })}
      level={
        <Choice<LetterCase>
          label={t({ de: "Buchstaben", ru: "Буквы" })}
          value={settings.letterCase}
          onChange={(letterCase) => update({ letterCase })}
          options={[
            { value: "upper", label: a.upper },
            { value: "both", label: `${a.upper} ${a.lower}` },
            { value: "lower", label: a.lower },
          ]}
        />
      }
      info={
        <>
          <p>
            {t({
              de: `Frei tippen: Jede Taste zeigt ihren Buchstaben groß mit einem Bild dazu, „${b.upper} wie ${b.words[0].word}“. Eine Zahl zeigt so viele Dinge – auf einmal, vorgezählt, Schritt für Schritt oder zum selbst Antippen.`,
              ru: `Свободный набор: каждая клавиша показывает свою букву крупно и картинку к ней, «${b.upper} как ${b.words[0].word}». Цифра показывает столько же вещей – сразу, с подсчётом вслух, по одной или чтобы нажимать самому.`,
            })}
          </p>
          <p>
            {t({
              de: `Wo ist das ${b.upper}? Ein Buchstabe und sein Bild erscheinen, und das Kind sucht die Taste dafür.`,
              ru: `Где ${b.upper}? Появляются буква и её картинка, и ребёнок ищет нужную клавишу.`,
            })}
          </p>
          <p>
            {t({
              de: "Buchstaben-Zug: Jede Taste hängt einen Wagen mit ihrem Buchstaben an. Ist der Zug voll, pfeift er und fährt los.",
              ru: "Поезд с буквами: каждая клавиша прицепляет вагон со своей буквой. Когда поезд полный, он гудит и уезжает.",
            })}
          </p>
        </>
      }
      settings={
        <>
          <SettingsGroup title={t({ de: "Anzeige", ru: "Что видно" })}>
            <Choice<LettersSettings["theme"]>
              label={t({ de: "Bilder", ru: "Картинки" })}
              value={settings.theme}
              onChange={(theme) => update({ theme })}
              options={[
                { value: "all", label: t({ de: "🌈 Alle", ru: "🌈 Все" }) },
                ...pack.themes.map((th) => ({ value: th.id, label: `${th.emoji} ${th.label}` })),
              ]}
            />
            <Toggle
              label={t({ de: "Wort anzeigen (nicht beim Zug)", ru: "Показывать слово (кроме поезда)" })}
              checked={settings.showWord}
              onChange={(showWord) => update({ showWord })}
            />
          </SettingsGroup>

          <SettingsGroup title={t({ de: "⌨️ Frei tippen", ru: "⌨️ Печатать что хочешь" })}>
            <Toggle
              label={t({
                de: "Nachspuren: Buchstabe aus Punkten, Finger oder Maus lässt Sterne erscheinen",
                ru: "Обводить: буква из точек, палец или мышка зажигает звёздочки",
              })}
              checked={settings.trace}
              onChange={(trace) => update({ trace })}
            />
            {settings.letterCase === "both" && !settings.trace && (
              <Toggle
                label={t({ de: "Mama- und Baby-Buchstabe (mit Augen, an der Hand)", ru: "Буква-мама и буква-малыш (с глазками, за ручку)" })}
                checked={settings.letterFamily}
                onChange={(letterFamily) => update({ letterFamily })}
              />
            )}
            {settings.speech && (
              <Choice<Announce>
                label={t({ de: "Ansage", ru: "Что звучит" })}
                value={settings.announce}
                onChange={(announce) => update({ announce })}
                options={[
                  { value: "letterAndWord", label: quote(pack.letterSentence(b, b.words[0]).replace(/!$/, "")) },
                  { value: "word", label: quote(b.words[0].word) },
                  { value: "letter", label: quote(b.spoken) },
                ]}
              />
            )}
            <Choice<NumberReveal>
              label={t({ de: "Zahlen", ru: "Цифры" })}
              value={settings.numbers}
              onChange={(numbers) => update({ numbers })}
              options={[
                { value: "all", label: t({ de: "🖼️ Alles sofort", ru: "🖼️ Всё сразу" }) },
                { value: "count", label: t({ de: "🗣️ Vorzählen", ru: "🗣️ Считать вслух" }) },
                { value: "step", label: t({ de: "👆 Schritt für Schritt", ru: "👆 Шаг за шагом" }) },
                { value: "tap", label: t({ de: "✋ Selbst zählen", ru: "✋ Считать пальчиком" }) },
              ]}
            />
            {settings.numbers === "count" && (
              <Toggle
                label={t({ de: "Zählen nicht unterbrechen", ru: "Не прерывать счёт" })}
                checked={settings.finishCounting}
                onChange={(finishCounting) => update({ finishCounting })}
              />
            )}
          </SettingsGroup>

          <SettingsGroup title={`🔍 ${findTitle}`}>
            <Toggle
              label={
                touchKeys
                  ? t({ de: "Gesuchte Taste aufleuchten lassen, wenn es länger dauert", ru: "Подсвечивать нужную клавишу, если поиск затянулся" })
                  : t({
                      de: "Taste auf einer kleinen Tastatur zeigen, wenn es länger dauert",
                      ru: "Показывать клавишу на маленькой клавиатуре, если поиск затянулся",
                    })
              }
              checked={settings.hints}
              onChange={(hints) => update({ hints })}
            />
          </SettingsGroup>

          <TouchKeysSetting value={settings.touchKeys} onChange={(touchKeys) => update({ touchKeys })} anyTouch={anyTouch} />
        </>
      }
    >
      {settings.mode === "find" ? (
        <FindPlay pack={pack} second={second} settings={settings} />
      ) : settings.mode === "train" ? (
        <TrainPlay pack={pack} settings={settings} />
      ) : (
        <LettersPlay pack={pack} second={second} settings={settings} />
      )}
    </GameShell>
  );
}
