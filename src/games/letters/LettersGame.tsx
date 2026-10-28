import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { TouchKeysSetting, useTouchKeys } from "@/components/TouchKeyboard";
import { sampleLetter, useLanguagePack } from "@/content/languages";
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
  type WordKind,
  type WordLength,
  type WordTyping,
} from "./settings";
import { FindPlay } from "./FindPlay";
import { LettersPlay } from "./LettersPlay";
import { WordsPlay } from "./WordsPlay";

export function LettersGame() {
  const [settings, update] = useGameSettings(LETTERS_SETTINGS_KEY, DEFAULT_LETTERS_SETTINGS);
  const pack = useLanguagePack();
  // Examples in the settings, in the app language: „Be, wie Bär“.
  const b = sampleLetter(pack);
  const a = pack.letters[0];
  const t = useT();
  const quote = (text: string) => t({ de: `„${text}“`, ru: `«${text}»` });
  const findTitle = t({ de: `Wo ist das ${b.upper}?`, ru: `Где буква ${b.upper}?` });
  // Free typing and Zählen: the keys on every touch screen, the other modes only on tablets.
  const anyTouch = settings.mode === "free" || settings.mode === "count";
  const touchKeys = useTouchKeys(settings.touchKeys, anyTouch);
  const pictureWords = settings.wordKind === "nouns" || settings.wordKind === "all";

  return (
    <GameShell
      title={t({ de: "Buchstaben & Zahlen", ru: "Буквы и цифры" })}
      emoji="🔤"
      modes={[
        { id: "free", emoji: "⌨️", title: t({ de: "Frei tippen", ru: "Печатать что хочешь" }) },
        { id: "count", emoji: "🔢", title: t({ de: "Zählen" }) },
        { id: "find", emoji: "🔍", title: findTitle },
        { id: "words", emoji: "✍️", title: t({ de: "Wörter tippen", ru: "Печатаем слова" }) },
      ]}
      mode={settings.mode}
      onMode={(mode) => update({ mode: mode as LettersMode })}
      level={
        // Always in sight above the cards: the letters for every mode, then what „Wörter tippen“ plays.
        <div className="letters-level">
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
          <Choice<WordTyping>
            label={t({ de: "✍️ Wörter tippen", ru: "✍️ Печатаем слова" })}
            value={settings.wordTyping}
            onChange={(wordTyping) => update({ wordTyping })}
            options={[
              { value: "spell", label: t({ de: "Ganzes Wort", ru: "Целое слово" }) },
              { value: "first", label: t({ de: "Erster Buchstabe", ru: "Первая буква" }) },
            ]}
          />
          <Choice<WordKind>
            label={t({ de: "Wörter", ru: "Слова" })}
            value={settings.wordKind}
            onChange={(wordKind) => update({ wordKind })}
            options={[
              { value: "nouns", label: t({ de: "🐻 Substantive" }) },
              { value: "all", label: t({ de: "🌈 Alle", ru: "🌈 Все" }) },
              { value: "colors", label: t({ de: "🎨 Farben", ru: "🎨 Цвета" }) },
              { value: "actions", label: t({ de: "🦘 Tu-Wörter", ru: "🦘 Слова-действия" }) },
            ]}
          />
          {/* Colours and doing words are short fixed lists, so the length only applies to the picture words. */}
          {pictureWords && (
            <Choice<WordLength>
              label={t({ de: "Wortlänge", ru: "Длина слова" })}
              value={settings.wordLength}
              onChange={(wordLength) => update({ wordLength })}
              options={[
                { value: "3", label: "3" },
                { value: "4", label: "4" },
                { value: "7", label: "7" },
              ]}
            />
          )}
        </div>
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
              de: "Zählen: Nur Zahlen kommen, jede mit so vielen Dingen. Eine Ziffer zeigt sich selbst, jede andere Taste bringt eine Zahl zufällig.",
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
              de: "Ganzes Wort: Ein Bild erscheint mit seinem Wort, und das Kind tippt es Buchstabe für Buchstabe. Erster Buchstabe: nur den Anfang zum Bild.",
              ru: "Целое слово: появляется картинка со своим словом, и ребёнок печатает его буква за буквой. Первая буква: только начало слова к картинке.",
            })}
          </p>
          <p>
            {t({
              de: "Farben: Ein Farbwort wie „Rot“ tippen, und Dinge in dieser Farbe hüpfen herein. Tu-Wörter: „Hüpf“ oder „Tanz“ tippen, die Figur macht es vor, und das Kind macht mit.",
              ru: "Цвета: напечатать слово цвета, например «Красный», и вещи этого цвета запрыгивают на экран. Слова-действия: напечатать «Прыгай» или «Танцуй», фигурка показывает, а ребёнок повторяет.",
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
              label={t({ de: "Wort unter dem Bild anzeigen (nicht bei Wörter tippen)" })}
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
          </SettingsGroup>

          <SettingsGroup title={t({ de: "⌨️ Frei tippen und 🔢 Zählen" })}>
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
        <FindPlay pack={pack} settings={settings} />
      ) : settings.mode === "words" ? (
        <WordsPlay pack={pack} settings={settings} />
      ) : (
        // Also for a mode saved before it was taken away (the Buchstaben-Zug).
        <LettersPlay pack={pack} settings={settings} numbersOnly={settings.mode === "count"} />
      )}
    </GameShell>
  );
}
